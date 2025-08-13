---
title: "Launch a Subnet with a Crowdloan (Local chain + Polkadot‑JS)"
---

# Launch a Subnet with a Crowdloan

This hands‑on tutorial walks through creating a subnet via the crowdloan pallet on a locally deployed Bittensor chain, using the Polkadot‑JS web app to submit extrinsics. It follows the same instructional style as the multisig tutorial: step‑by‑step, with concrete UI actions.

## Summary

- Create: `crowdloan.create(deposit, min_contribution, cap, end, call, target_address)`
  - Use base units (e.g., 10 TAO = 10_000_000_000). Ensure `deposit ≥ MinimumDeposit`, `min_contribution ≥ AbsoluteMinimumContribution`, `cap > deposit`, and `end > current` within duration bounds.
  - Set `call = Some(subtensor.registerLeasedNetwork(emissions_share, end_block))` to auto‑register the subnet on finalize.
- Contribute: `crowdloan.contribute(crowdloan_id, amount)` from separate wallets until `raised == cap` (before `end`).
- Finalize: after `end` and with full cap, the creator calls `crowdloan.finalize(crowdloan_id)` to dispatch the nested call and create the lease.
- Verify: check `subtensor.SubnetLeases`, `SubnetLeaseShares`, `SubnetUidToLeaseId`, and beneficiary proxy.
- Dividends: owner emissions periodically split pro‑rata to contributors and the beneficiary; accumulate if not the right block or insufficient liquidity.
- Fallback: if cap not reached, call `crowdloan.refund` repeatedly (batched) then `crowdloan.dissolve` (creator only).
- Get crowdloan_id: read from the `crowdloan.Created` event, `crowdloan.nextCrowdloanId` (last = next-1), or list keys via JS console.

## Prerequisites

- A locally running subtensor development chain.
  - Start a local node (any standard Substrate dev node setup is fine). In Polkadot‑JS, we will connect to `ws://127.0.0.1:9944`.
- Polkadot‑JS browser app and extension installed.
- Test accounts funded with dev TAO:
  - Creator (opens the crowdloan and later finalizes it)
  - Beneficiary (will operate the subnet via proxy)
  - One or more Contributors (fund the crowdloan)

Tips:
- Keep three separate accounts handy: `creator`, `beneficiary`, `contrib1` (and optionally `contrib2`). Give them balances via faucet or sudo as appropriate on your dev chain.

## Connect Polkadot‑JS to your local chain

1. Open the Polkadot‑JS app.
2. In the network selector, choose Development → custom endpoint `ws://127.0.0.1:9944`.
3. Confirm your local chain metadata loads and your test accounts appear in the Accounts tab.

## Create a crowdloan

We will create a campaign whose purpose is to register a leased subnet on finalize.

1. Go to Developer → Extrinsics.
2. Under “using the selected account”, pick the `creator` account.
3. Under “submit the following extrinsic”, choose module `crowdloan`, call `create`.
4. Fill the parameters:
   - deposit: choose an amount (e.g., `10_000_000_000` = 10 TAO on default dev config)
   - min_contribution: e.g., `100_000_000`
   - cap: e.g., `2_000_000_000_000` (1000 TAO)
   - end: pick a block height in the near future (e.g., current + 100)
   - call (optional): expand this field and select the nested call module `subtensor`, call `register_leased_network`
     - emissions_share (Percent): e.g., `30`
     - end_block (Option<BlockNumber>): pick Some and set the lease end (e.g., current + 500). For a perpetual lease, choose None.
   - target_address (Option<AccountId>): leave as None (the lease logic will internally move funds as needed).

Important:
- Set `cap` higher than the projected subnet lock cost plus proxy deposit (and a small fee buffer). On most dev setups the baseline lock cost is 1,000 TAO (1_000_000_000_000 RAO). If `cap` equals the lock cost exactly, the lease coldkey may lack enough to pay proxy deposits and finalize can fail with insufficient balance.
- Quick checks in Polkadot‑JS:
```javascript
// Lower bound for lock cost (min lock)
(await api.query.subtensor.networkMinLockCost()).toHuman()
// If available in your build, current computed lock cost
(await api.call.subtensorApi.getNetworkLockCost?.())?.toHuman?.()
// Proxy deposit components
(await api.consts.proxy.proxyDepositBase).toHuman()
(await api.consts.proxy.proxyDepositFactor).toHuman()
```

5. Click Submit Transaction and sign with `creator`.

Expected result:
- An event like `crowdloan.Created` with a new `crowdloan_id`.

## Get the crowdloan_id

There is no "list crowdloans" extrinsic. Use one of these:

- From Events (easiest):
  - Open the Events panel after submitting `crowdloan.create`. The `crowdloan.Created` event payload includes `crowdloan_id`.
- From storage (quick):
  - Developer → Chain state → Storage → `crowdloan.nextCrowdloanId`. The last created id is `next - 1` (assuming no concurrent creates).
- From the JS console (lists all ids): Developer → JavaScript, run:
```javascript
// List all existing crowdloan ids
const keys = await api.query.crowdloan.crowdloans.keys();
keys.map((k) => k.args[0].toNumber());
```

## Contribute to the crowdloan

Contributions must occur before the `end` block and will be clipped to the `cap`.

Repeat for each contributor account:
1. Developer → Extrinsics → using account `contrib1` (then `contrib2`, etc.).
2. Select `crowdloan.contribute(crowdloan_id, amount)`.
3. Provide the `crowdloan_id` (typically 0 on a fresh chain) and an amount.
4. Submit and sign.

Notes:
- Cap is the maximum total raise, not a minimum. Contributions that would exceed the remaining amount are clipped; after cap is reached, further contributions are rejected with `CapRaised`.
- There is no per‑contributor max beyond the remaining amount and runtime checks, but there is a global `MaxContributors` limit.

Verify:
- Check Events for `crowdloan.Contributed`.
- In Developer → Chain state → Storage, query `crowdloan.Crowdloans(crowdloan_id)` and `crowdloan.Contributions(crowdloan_id, contributor)`.

## Finalize the crowdloan

Once the end block has passed and the cap has been fully raised (`raised == cap`), the creator finalizes.

1. Wait for the chain to reach the `end` block (watch the status bar or use the Blocks tab).
2. Developer → Extrinsics → using account `creator`.
3. Select `crowdloan.finalize(crowdloan_id)`.
4. Submit and sign.

On success:
- If `target_address` was provided, the raised amount is transferred there.
- The stored `subtensor.register_leased_network` call executes with creator origin, and the lease is created.

actual success!!!
```
system.ExtrinsicSuccess
balances.Withdraw (x2)
system.NewAccount (x2)
balances.Endowed
balances.Transfer (x2)
subtensorModule.RegistrationAllowed
subtensorModule.MaxAllowedUidsSet
subtensorModule.MaxAllowedValidatorsSet
subtensorModule.MinAllowedWeightSet
subtensorModule.MaxWeightLimitSet
subtensorModule.AdjustmentIntervalSet
subtensorModule.RegistrationPerIntervalSet
subtensorModule.AdjustmentAlphaSet
subtensorModule.ImmunityPeriodSet
subtensorModule.MinDifficultySet
subtensorModule.MaxDifficultySet
subtensorModule.NetworkAdded
balances.Reserved
proxy.ProxyAdded
subtensorModule.SubnetLeaseCreated
crowdloan.Finalized
balances.Deposit
transactionPayment.TransactionFeePaid
extrinsic event

```


Notes:
- Finalizing before the contribution period ends fails with `ContributionPeriodNotEnded`. This keeps the window open so others can contribute until `end`.

## Verify the leased subnet

Open Developer → Chain state → Storage, module `subtensor` and check:
- `SubnetLeases(lease_id)` → shows beneficiary, emissions_share, end_block, netuid, cost
- `SubnetUidToLeaseId(netuid)` → maps subnet to lease id
- `SubnetLeaseShares(lease_id, contributor)` → pro‑rata shares per contributor

Also verify a proxy was added for the beneficiary:
- Module `proxy` → query `Proxies(lease_coldkey)` (if available in your UI) to see the `SubnetLeaseBeneficiary` delegate.

## Operate the leased subnet (via proxy)

The beneficiary (i.e., the finalizing creator) operates the subnet by acting as a proxy for the `lease.coldkey` using proxy type `SubnetLeaseBeneficiary`.

Steps in Polkadot‑JS (Developer → Extrinsics):
- Using account: your beneficiary (the crowdloan creator that finalized)
- Toggle “Use a proxy for this call”
  - Proxied account: paste the `lease.coldkey` from `subtensorModule.subnetLeases(lease_id)`
  - Proxy type: `SubnetLeaseBeneficiary`
- Pick an allowed call, for example:
  - `subtensorModule.start_call { ... }`
  - or a network parameter via `adminUtils` such as `sudo_set_min_difficulty`, `sudo_set_network_registration_allowed`, etc.
- Fill arguments → Submit and sign.

Notes:
- If you submit without the proxy toggle, you’ll see errors like “wallet doesn’t own the subnet.” Always proxy through the `lease.coldkey` with type `SubnetLeaseBeneficiary`.
- If `subtensorModule.subnetUidToLeaseId(netuid)` returns None, the subnet was not created via leasing; operate it using `subtensorModule.subnetOwner(netuid)` instead.

### Alternative: submit via explicit proxy.proxy extrinsic

If the “Use a proxy for this call” toggle does not appear, submit the proxy call directly:

1) Build the inner call (to get its encoding) [optional]
- Developer → Extrinsics → pick the inner call you want (e.g., `subtensorModule.start_call`) and fill its arguments.
- Copy the “encoded call data” (hex starting with `0x…`).

2) Submit the proxy
- Using account: your beneficiary
- Module/method: `proxy → proxy`
- Fields:
  - real: `lease.coldkey` from `subtensorModule.subnetLeases(lease_id)`
  - forceProxyType: `SubnetLeaseBeneficiary`
  - call: either expand and select the inner call again with arguments, or paste the encoded call hex from step 1
- Leave delay at 0 → Submit and sign.

Tips:
- Add the `lease.coldkey` to your Address book so it’s selectable in the UI.
- Verify the proxy exists on‑chain before submitting: `proxy.Proxies(lease_coldkey)` should show your beneficiary with type `SubnetLeaseBeneficiary`.

### Interpreting SubnetLeaseShares (fixed‑point)

`SubnetLeaseShares` values are stored as `U64F64` fixed‑point numbers. Polkadot‑JS often renders them as `{ bits: <u128> }`. Convert to a human percent by dividing by 2^64.

Example (Developer → JavaScript):
```javascript
// bits is a BigInt from the on-chain value, e.g. 18354510353341003857n
function u64f64ToPercent(bitsBig) {
  const scale = 1n << 64n; // 2^64
  const bps = (bitsBig * 10_000n) / scale; // basis points (1/100 of a percent)
  return Number(bps) / 100; // percent with 2 decimals
}

const val = await api.query.subtensorModule.subnetLeaseShares(leaseId, contributor);
const bits = BigInt(val.toJSON().bits);
console.log(u64f64ToPercent(bits), '%');
```

Notes:
- Shares are stored for contributors excluding the beneficiary. If only the beneficiary funded, `SubnetLeaseShares` may be empty; all dividends go to the beneficiary.
- The beneficiary’s effective share is the leftover after summing all stored contributor shares.

## (Optional) Observe dividends distribution

Owner emissions are periodically split among contributors and the beneficiary, but only when all of these are true:
- The subnet is leased and active (lease has not ended).
- A coinbase cycle paid an owner cut to the subnet owner for the given `netuid`.
- Current block is an exact multiple of `LeaseDividendsDistributionInterval` (check in Constants).
- There is sufficient liquidity to unstake the contributors’ cut from the subnet at or above the minimum swap price.

What the code does (high level):
- Compute contributors’ share in alpha: `contributors_alpha = ceil(emissions_share% × owner_cut_alpha)` and add any `AccumulatedLeaseDividends`.
- If not at the distribution block or insufficient liquidity, set/accumulate `AccumulatedLeaseDividends(lease_id)` and exit.
- Otherwise, unstake `contributors_alpha` to TAO, then distribute TAO pro‑rata using `SubnetLeaseShares(lease_id, contributor)`; the leftover TAO goes to the beneficiary.

Alpha vs TAO:
- Emissions accrue in Alpha (subnet share units). On distribution, the contributors’ alpha is unstaked/swapped to TAO using the subnet pool; if swap/unstake cannot proceed (liquidity/price), the alpha is accumulated for later.

How to debug when nothing moves:
- Ensure `subtensorModule.subnetUidToLeaseId(netuid)` is Some and `subtensorModule.subnetLeases(lease_id)` has `end_block` unset or in the future.
- Check `subtensorModule.accumulatedLeaseDividends(lease_id)`; if growing, you’re not at the interval or liquidity is insufficient.
- Verify interval constant: Developer → Chain state → Constants → look for `LeaseDividendsDistributionInterval`.
- Ensure the subnet pool has liquidity (initial TAO was locked at creation; more stake/liquidity improves distribution).

Balances credited go to each contributor’s coldkey and the beneficiary’s coldkey. You can observe changes by querying balances over time.

## Alternative path: Refund and dissolve

If the cap is not reached by `end`:
1. Anyone can call `crowdloan.refund(crowdloan_id)` repeatedly until all contributors (except the creator) are refunded (batched per call).
2. After refunds complete (only the creator’s deposit remains), the `creator` can call `crowdloan.dissolve(crowdloan_id)` to clean up and recover the deposit.

## Troubleshooting

- Finalize fails with CapNotRaised
  - Ensure total `raised` equals `cap`. Add contributions or adjust `cap` via `update_cap` (creator‑only) before `finalize`.
- Finalize fails with ContributionPeriodNotEnded
  - Wait until the `end` block is reached.
- Finalize fails with CallUnavailable
  - Ensure the nested call was supplied during `create`. The pallet stores it as a preimage; if unavailable, it errors and drops the reference.
- Refund does nothing
  - Refunds only after `end` and only for non‑finalized campaigns. It processes up to `RefundContributorsLimit` contributors per call.

## What you learned

- How to create and fund a crowdloan whose purpose is to register a leased subnet.
- How to finalize and verify the subnet lease, contributor shares, and beneficiary proxy.
- How to recover funds via refund/dissolve if the campaign does not reach its cap.


