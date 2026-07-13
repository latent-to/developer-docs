# Bittensor v10→v11 migration brief (for docs page migrations)

Authoritative scheme: https://www.bittensor.com/docs/migration. This brief distills it
plus locally verified corrections. When this brief and the live rc11 package disagree,
FOLLOW THE PACKAGE and report the discrepancy.

## Environment / verification protocol (MANDATORY)

- v11 interpreter: `/Users/michaeltrestman/bittensor_workspace/latents/v11-venv/bin/python` (bittensor==11.0.0rc11, py3.12)
- v11 CLI: `/Users/michaeltrestman/bittensor_workspace/latents/v11-venv/bin/btcli`
- Chain connections REQUIRE `SSL_CERT_FILE=$(<venv>/bin/python -m certifi)` in the environment or the websocket handshake fails.
- Every Python snippet published in a page must be written to `developer-docs/tmp-scripts/v11-snippets/<page-slug>/NN_name.py` and executed successfully with the v11 interpreter.
- Reads: run live against `"test"` (public testnet). NEVER connect to `"finney"` except for read-only price/metagraph checks if testnet lacks the feature.
- Mutations: NEVER execute. Verify shape with `client.plan(intent, wallet)` where a funded testnet wallet exists, otherwise verify the intent class constructs (`sub.AddStake(...)` etc.) and that `btcli tx <name> --help` / `--dry-run` accepts the flags. NEVER run a mutating btcli command without `--dry-run`.
- btcli commands: verify each against `--help` output of its group before publishing.
- NEVER fabricate output blocks in docs. Show output only if copied from an actual run. Redact real key material.
- Wallet tests: use `path="/tmp/v11-doc-tests"` in test scripts; never write to `~/.bittensor/wallets`.

## Package and imports

- One package: `bittensor` ≥11 contains SDK + `btcli` + wallet. `bittensor-cli` and `bittensor_wallet` are superseded.
- Convention: `import bittensor as sub` (official docs use `sub`, not `bt`).
- Wallet: `from bittensor.wallet import Wallet` (same constructor/properties/on-disk format as bittensor_wallet). `bt.Keypair`/`bt.Keyfile` gone from top level; `bittensor.keyfiles.Keyfile` exists; keypairs come from the wallet. Helpers in `sub.wallets` (create, regen_coldkey, list_wallets, sign_message, verify_message, ...).
- Python 3.10–3.13. Windows via WSL only.

## Connecting

- `bt.Subtensor(network=...)` → `sub.SyncClient("finney")` (blocking); `bt.AsyncSubtensor` → `async with sub.Client("finney") as client:`.
- `Subtensor(config=config)`, `mock=True`, `MockSubtensor` — gone. `fallback_endpoints=`, `archive_endpoints=`, `retry_forever=` keep their names.
- Network names finney/test/archive/local; any ws:// or wss:// URL accepted directly. v9 aliases (dev, rao, latent-lite) gone.
- Block pinning: namespace reads still accept `block=`; for multi-read consistency `snap = await client.at(block)` then read from snap.
- Close: context manager preferred, or `client.close()`.

## Reads (typed namespaces; also dispatchable via client.read("name", ...))

- balances: `client.balances.get(addr)`, `.get_many([...])`, `.existential_deposit()`, `.proxies(coldkey_ss58=)`, `.coldkey_swap_announcement(coldkey_ss58=)`
- staking: `.get(coldkey, hotkey, netuid)`, `.stake_for_coldkey(coldkey_ss58=)` → list[StakePosition], `.stake_for_coldkeys([...])`, `.staking_hotkeys(...)`, `.auto_stake_all(...)`, `.stake_value_for_coldkey(coldkey_ss58=)` (NEVER sum alpha yourself), `.root_claim_type(...)`
- prices: `.quote_stake(netuid=, amount_tao=)` (replaces sim_swap/get_stake_add_fee), `.quote_unstake(netuid=, amount_alpha=)`, `.alpha_price(netuid=)`, `.alpha_prices()`
- fees: `(await client.plan(intent, wallet)).fee` replaces get_transfer_fee/get_extrinsic_fee
- locks: `.coldkey_lock(...)`, `.locks_for_coldkey(...)`, `.hotkey_conviction(...)`, `.most_convicted_hotkey(netuid=)`
- subnets: `.all()` → list[SubnetInfo], `.info(netuid)`, `.subnet(netuid=)` (exists-check), `.subnet_registration_cost()`, `.burn(netuid)` (recycle/registration price), `.subnet_hyperparameters(netuid=)`, `.commit_reveal_enabled(netuid)`, `.mechanism_count(...)`, `.mechanism_emission_split(...)`, `.metagraph(netuid)`, `.commitments(netuid)`, `.subnet_start_schedule(netuid=)`
- hyperparameters: same names on `client.hyperparameters` (immunity_period, difficulty, min_allowed_weights, max_weight_limit, weights_rate_limit, reveal_period, ...)
- epochs: `.blocks_until_next_epoch(netuid=)`, `.blocks_since_last_update(netuid=, uid=)`, `.epoch_status(netuid=)`
- weights: `.weights(netuid=, mechid=0)` and `.bonds(...)` → dict[uid, dict[uid, float]] normalized 0..1 (was u16 tuples); `.timelocked_weight_commits(...)`
- neurons: `.all(netuid, lite=)`, `.uid(hotkey_ss58=, netuid=)` (replaces is_hotkey_registered*), `.netuids_for_hotkey(...)`, `.hotkey_owner(...)`, `.owned_hotkeys(...)`
- delegation: `.delegates()`, `.delegate(...)`, `.is_delegate(...)`, `.delegate_take(...)`, `.delegated(...)`, `.children(...)`, `.pending_children(...)`, `.parents(...)`
- identity: `.identity(coldkey_ss58=)`, `.hotkey_identities(...)`, `.commitment(netuid=, hotkey_ss58=)`, `.revealed_commitment(...)`
- leasing: `.crowdloans()`, `.crowdloan(...)`, `.crowdloan_contributors(...)`
- chain: `.tx_rate_limit()`, `.mev_shield_next_key()`; top-level `client.block()`, `client.block_info(b)`, `client.timestamp(b)`, `client.wait_for_block(b)` (+wait_for_timestamp, wait_for_epoch), `client.is_fast_blocks()`
- Generic accessors replace query_subtensor/query_module/query_map/query_constant/query_runtime_api/state_call: `client.query(sub.storage.Pallet.Item, [params])`, `client.query_map(...)`, `client.constant(sub.constants...)`, `client.runtime(sub.runtime_api...)`
- Liquidity reads/writes: REMOVED (feature retired on chain).

## Metagraph

`mg = await client.subnets.metagraph(netuid)`: iterable of MetagraphNeuron ordered by uid. Per-neuron: n.uid, n.hotkey, n.coldkey, n.incentive/dividends/rank/trust/consensus (0..1 floats), n.emission/alpha_stake/tao_stake/total_stake (Balance), n.axon ("ip:port" or None). mg.hotkeys, mg.coldkeys, mg.validators, mg.neuron(uid), mg.by_hotkey(ss58). No matrices: mg.W → client.weights.weights(); mg.B → client.weights.bonds(); mg.S → [n.total_stake for n in mg]. No sync/save/load (refetch; persist mg.raw yourself).

## Transactions = intents via client.plan / client.execute

`result = await client.execute(intent, wallet)`; kwargs wait_for_inclusion/wait_for_finalization/period on execute; `raise_error=True` → `result.raise_for_failure()`; mev_protection → `mev_shield` (ON by default for stake-trading intents). safe_staking/rate_tolerance/allow_partial_stake → explicit `*Limit` intents with `limit_price_rao` + `allow_partial=`.

Intents: sub.Transfer(dest_ss58=, amount_tao=), TransferAll(dest_ss58=), AddStake(hotkey_ss58=, netuid=, amount_tao=), AddStakeLimit(..., limit_price_rao=, allow_partial=), RemoveStake(hotkey_ss58=, netuid=, amount_alpha=) (accepts "all"), RemoveStakeLimit, UnstakeAll(hotkey_ss58=), UnstakeAllAlpha, Batch(intents=[...]) (replaces add_stake_multiple/unstake_multiple), MoveStake(origin_hotkey_ss58, origin_netuid, dest_hotkey_ss58, dest_netuid, amount_alpha), SwapStake, TransferStake(dest_coldkey_ss58, ...), SetAutoStake(netuid=, hotkey_ss58=), LockStake/MoveLock/SetPerpetualLock, BurnedRegister(netuid=, hotkey_ss58=None), RegisterSubnet(), RootRegister(), StartCall(netuid=), ServeAxon(netuid=, ip=, port=) (no Axon object; ServeAxonTls for TLS), SetWeights(netuid=, weights={uid: w} or uids=[...] weights=[...], mechid=0), CommitWeights/RevealWeights (reveal only for legacy salt commits), SetTake(take=), IncreaseTake/DecreaseTake, SetChildren(netuid=, children=[[prop, ss58], ...]), SetSubnetIdentity(netuid=, subnet_name=, ...), SetIdentity(name=, url=, ...), ClaimRoot(subnets=[...]), SetRootClaimType(claim_type="Swap"/"Keep"/"KeepSubnets"), AddProxy(delegate_ss58=, proxy_type=, delay=)/RemoveProxy/RemoveProxies/CreatePureProxy/KillPureProxy, AnnounceColdkeySwap etc (same-name), CreateCrowdloan/ContributeCrowdloan/..., SetHyperparameter(netuid=, name=, value=)
- Proxy execution: `client.execute(intent, wallet, proxy_for=real_ss58)` (replaces proxy(wallet, real, type, call))
- Raw calls: `client.submit_call(sub.calls.Pallet.function(...), wallet, signer="coldkey"/"hotkey")` (replaces compose_call+sign_and_send_extrinsic; also set_commitment)
- Shielded: `client.submit_shielded(intent, wallet)` (replaces mev_submit_encrypted)
- Dynamic dispatch: `sub.intents.build(op, args)` / `client.execute_tool(op, args, wallet)`
- New: `client.plan(intent, wallet)` previews fee/effects/warnings; `sub.Policy(max_spend_tao=, allowed_netuids=[...])` bounds executions.
- `bittensor.core.extrinsics.*` gone.

## Semantic traps

- Weights: pass floats any scale or {uid: w} dict; clipping/normalization/quantization internal (`bittensor.intents.normalize`); weight_utils gone; set_weights auto-selects plain vs timelocked commit-reveal; version_key defaults 0 (pass subnet's key explicitly if enforced).
- Take: float 0–1 (take=0.18) or plain int = raw u16. Children: float 0–1 or plain int = raw u64 share.
- Balance: carries netuid (0=TAO). Cross-unit arithmetic/comparison raises sub.UnitMismatchError; comparison with bare float raises TypeError; `.tao` on alpha RAISES (use `.amount`, or stake_value_for_coldkey read). Balance.from_tao(amount) (no netuid); Balance.from_alpha(amount, netuid=). Shorthands sub.tao(1.5), sub.alpha(2.5, 42), sub.rao(...). Intent amount fields unit-named (amount_tao/amount_alpha/limit_price_rao) accept int|float|str|Decimal|Balance; some accept "all".

## Results and errors

ExtrinsicResponse → ExtrinsicResult: .success/.message keep; .extrinsic_fee → .fee; receipt → .block_hash/.extrinsic_id/.events/.explorer_url; .error is ChainError with .name/.code (sub.ErrorCode)/.remediation. Branch on result.error.code (ErrorCode.INSUFFICIENT_BALANCE, RATE_LIMITED, NOT_REGISTERED, SUBNET_NOT_EXISTS, ...) instead of typed exceptions. BalanceUnitMismatchError → sub.UnitMismatchError.

## Deleted outright

bt.Axon, bt.Dendrite, bt.Synapse, StreamingSynapse, SubnetsAPI, bt.Tensor (no miner/validator networking stack — replacement: own HTTP server/client + `sub.http_auth.sign`/`sub.http_auth.verify`, btauth/1 wire format; chain-side ServeAxon/SetWeights intents remain). bt.logging (standard `logging`, namespace "bittensor"). bt.Config/add_args/argparse/dotted flags. weight_utils.

## Env vars (VERIFIED against rc11 — differs from official page's framing)

btcli option defaults (typer envvars, NOT read by SDK constructors): BT_NETWORK, BT_WALLET, BT_WALLET_HOTKEY, BT_WALLET_PATH, BTCLI_CONFIG (config file, default ~/.bittensor/btcli.json).
SDK: BT_CHAIN_ENDPOINT (overrides what `local` resolves to; for other endpoints pass ws:// URL as network), BT_WALLET_PASSWORD / BT_WALLET_PASSWORD_FILE / BT_PW__* (non-interactive coldkey unlock).
Gone: BT_SUBTENSOR_NETWORK, BT_SUBTENSOR_CHAIN_ENDPOINT, BT_WALLET_NAME, BT_NO_PARSE_CLI_ARGS, BT_LOGGING_*, BT_AXON_*, BT_PRIORITY_*, BT_MEV_PROTECTION, BTCLI_CONFIG_PATH, USE_TORCH, NEST_ASYNCIO, READ_ONLY.

## CLI

One binary `btcli`, installed with `bittensor`. Reads: `btcli query <name>`; transactions: `btcli tx <name>`; familiar groups (wallet/stake/subnets/sudo/weights/axon/proxy/crowd/lock/utils/config) wrap the same machinery. v9 shorthands and snake_case spellings still work as hidden aliases.
Flags: --wallet.name/--wallet-name/--name → --wallet/-w; --wallet.hotkey/--hotkey → --wallet-hotkey/-H; --wallet.path → --wallet-path; --network/-n (name or URL, replaces --subtensor.* and --chain); --no-prompt/-y → --yes/-y; --json-output → --json; --quiet/-q; -v/-vv/-vvv; --mev-protection → --mev-shield; --proxy NAME → --proxy-for NAME; NEW --dry-run on any tx.
Command changes: sudo set --param → --name; subnets register --netuid 0 → tx root-register; subnets start/check-start → sudo start/check-start; subnets set-identity/get-identity/set-symbol → sudo *; subnets mechanisms → sudo mechanisms; weights set exists and is preferred (auto commit-reveal); stake remove --all → tx unstake-all / tx unstake-all-alpha; stake batching flags (--include-hotkeys/--exclude-hotkeys/--all-hotkeys) gone (loop in scripts); wallet swap-coldkey announce/execute → wallet announce-coldkey-swap / wallet swap-coldkey / wallet swap-check; config add-proxy/proxies/remove-proxy → proxy book add/list/remove; crowd mutations → tx *-crowdloan (crowd keeps reads list/info/contributors); REMOVED: senate/proposals/senate-vote, all liquidity commands, view dashboard. New: btcli tools (tx catalog + JSON schemas), btcli explain <code>. Config file ~/.bittensor/config.yml → ~/.bittensor/btcli.json (keys renamed: wallet_name → wallet); use_cache/rate_tolerance/safe_staking/allow_partial_stake/dashboard_path keys have no equivalent. Non-TTY without --yes: mutation declined with exit 1; missing options exit 2.
rc11 discrepancies found so far: `tx dispute-coldkey-swap`/`clear-coldkey-swap-announcement` absent from help; crowdloan contribute is `tx contribute-crowdloan`; `lock view` is `lock show`/`lock list`.

## Docs style rules

- No em dashes in prose. Use commas, periods, parentheses.
- `import { SdkVersion } from "<relpath>/sdk/_sdk-version.mdx"` banner stays on SDK-using pages; place `<SdkVersion />` near the first code.
- Links to deleted reference docs (btcli/btcli, sdk/bt-api-ref, sdk/subtensor-api, python-api/btwallet-api sphinx HTML) → keep as absolute https://docs.learnbittensor.org/... form, do not reintroduce internal links to them.
- Deleted pages redirect per docusaurus.config.js; do not link to: miners/miners-btcli-guide, validators/validators-btcli-guide, subnets/subnet-creators-btcli-guide, subnets/managing-mechanisms-btcli, getting-started/install-btcli, btcli/overview, btcli/btcli-permissions (→ keys/key-permissions), concepts/bt-logging-levels, sdk/managing-subtensor-connections (→ subnets/asyncio), governance/senate, keys/btwallet/{keypair,encrypt-decrypt,wallet-class} (→ keys/btwallet/).
- Do not use "docs" framing; this is a guides site. Keep pages procedural.
