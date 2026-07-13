---
title: "Managing Your Stakes"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { SdkVersion } from "../sdk/\_sdk-version.mdx";
import { ProxyColdkeyWarning } from "../keys/_proxy-warning.mdx";

# Managing Your Stakes

This guide covers staking operations in Bittensor.

TAO holders can **stake** any amount of the liquidity they hold to a validator. Also known as **delegation**, staking supports validators, because their total stake in the subnet, including stake delegated to them by others, determines their consensus power and their share of emissions. After the validator/delegate extracts their **take** the remaining emissions are credited back to the stakers/delegators in proportion to their stake with that validator.

Subsequently, TAO holders **unstake** from a subnet by converting subnet-specific alpha tokens back to TAO through the subnet's automated market maker (AMM).

See also: [Staking/delegation overview](./delegation)

## Best practices for staking securely

When staking real-value liquidity (especially on mainnet), three tools can significantly reduce your exposure to loss, if properly used: **proxies**, **price protection**, and **MEV shield**.

### Proxies

A proxy allows a separate key to sign staking transactions on behalf of your primary coldkey, which stays in cold storage. For mainnet staking, always use a proxy with a non-zero delay so that transactions must be announced on-chain before execution, giving you a window to detect and reject unauthorized activity.

See [Proxies: Overview](../keys/proxies/) and review [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security) to make sure you understand the full Bittensor security model.

### Price protection (safe staking)

Every stake or unstake operation trades tokens through the subnet's AMM, which means your transaction itself moves the price. Without price protection, you're exposed to:

- **Slippage**: Large transactions push the price against you.
- **Organic volatility**: The price may move between when you submit and when your transaction lands.

Price protection sets a hard limit on the worst price you'll accept. If the price moves beyond your limit, the transaction is rejected (strict mode) or partially filled (partial mode).

See: [Understand Price Protection](../learn/price-protection)


<details>
  <summary><strong>SDK Price Protection details</strong></summary>

  The SDK provides **price protection** through `add_stake_limit` and `remove_stake_limit` extrinsics, which accept a `limit_price` (the worst acceptable price in RAO per alpha) and an `allow_partial` flag:

- **Strict mode** (`allow_partial=False`): Transaction is rejected entirely if the final price would exceed your limit.
- **Partial mode** (`allow_partial=True`): Executes the maximum amount that stays within your price limit.

To calculate `limit_price` from a tolerance percentage:

```python
# For staking (price goes up as you buy alpha):
pool = await subtensor.subnet(netuid=netuid)
limit_price = bt.Balance.from_tao(pool.price.tao * (1 + rate_tolerance)).rao

# For unstaking (price goes down as you sell alpha):
limit_price = bt.Balance.from_tao(pool.price.tao * (1 - rate_tolerance)).rao
```

:::warning SDK default is unsafe
Unlike `btcli`, the SDK does **not** enable price protection by default, it must be explicitly configured.
:::
</details>

### MEV shield

MEV (maximal extractable value) attacks exploit the fact that pending transactions are visible in the mempool before they land in a block. An attacker who sees your staking transaction can front-run it (buying alpha before you, driving the price up) or sandwich it (buying before and selling after, extracting value from your trade). Price protection limits your losses from these attacks, but MEV shield prevents them entirely by encrypting your transaction so its contents are hidden until it is included in a block.

MEV shield encrypts the signed extrinsic before submission. The chain decrypts and executes it only after block inclusion, so no one — including block producers — can see or front-run the transaction while it is pending.

To enable MEV shield, add `mev_protection=True` to any supported SDK extrinsic call (or enable it globally):

```python
response = await subtensor.add_stake_extrinsic(
    wallet=wallet,
    hotkey_ss58=hotkey,
    netuid=netuid,
    amount=amount,
    mev_protection=True,
)
```

MEV shield and price protection are complementary — use both for maximum safety. Price protection caps your worst-case price; MEV shield prevents adversaries from manipulating that price in the first place.

See: [MEV Shield](../concepts/mev-shield/), [Using MEV Shield with the SDK](../sdk/mev-protection)

## Prerequisites

### For testing/practice

- [Install Bittensor](../getting-started/installation) (one package: SDK and `btcli`)
- [Create a wallet](../keys/working-with-keys#creating-a-wallet-with-btcli)
- Get some test TAO: ask in [Discord](https://discord.com/channels/799672011265015819/1107738550373454028/threads/1331693251589312553), or [run a local blockchain](../local-build/deploy.md)

### For mainnet

Everything above, plus:

- **A hardware wallet** (Ledger or [Polkadot Vault](../keys/coldkey-hotkey-security#hardware-solution-polkadot-vault)) for your primary coldkey. Your primary coldkey should never be loaded onto an internet-connected machine.
- **A `NonTransfer` proxy** created from your hardware wallet. This proxy manages all other proxies so the primary coldkey stays in cold storage permanently. See [Add a Proxy Relationship](../keys/proxies/working-with-proxies#add-a-proxy-relationship) and [Manage proxies through a NonTransfer proxy](../keys/proxies/working-with-proxies#manage-proxies-through-a-nontransfer-proxy).
- **A `Staking` proxy with a non-zero delay**, created through your `NonTransfer` proxy. This is the key you will use for day-to-day staking operations on this page. The delay creates a veto window during which you can [reject unauthorized announcements](../keys/proxies/working-with-proxies#reject-an-announcement).
- **Sufficient TAO** in the proxy wallet to cover transaction fees (fees are dynamic and weight-based; see [Transaction Fees](../learn/fees) and [Estimating Fees](../learn/fees#estimating-fees)).

See [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security) for the full security model.

:::tip
Minimum transaction amount for stake/unstake/move/transfer: 500,000 RAO (0.0005 TAO). To verify, query `subtensorModule.minStake()` on the [Polkadot.js app](https://polkadot.js.org/apps/?rpc=wss://entrypoint-finney.opentensor.ai:443#/chainstate).
:::

<SdkVersion />

## Check your TAO balance

Checking a balance is a permissionless operation — only the public key (SS58 address) is needed:

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

```bash
btcli wallet balance
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import bittensor as bt
sub = bt.Subtensor(network="test")
wallet = bt.Wallet(name="my_coldkey")
balance = sub.get_balance(wallet.coldkeypub.ss58_address)
print(balance)
```

</TabItem>
</Tabs>

## View exchange rates

The following script displays exchange rates for a subnet alpha token, with and without slippage.

```python
import bittensor as bt

sub = bt.Subtensor(network="test")
subnet = sub.subnet(netuid=62)

alpha_amount = bt.Balance.from_tao(100).set_unit(1)

print("alpha to tao with slippage", subnet.alpha_to_tao_with_slippage(alpha_amount))
print("alpha to tao with slippage percentage", subnet.alpha_to_tao_with_slippage(alpha_amount, percentage=True))

print("tao to alpha with slippage", subnet.tao_to_alpha_with_slippage(100))
print("tao to alpha with slippage percentage", subnet.tao_to_alpha_with_slippage(100, percentage=True))

print("tao to alpha", subnet.tao_to_alpha(100))
print("alpha to tao", subnet.alpha_to_tao(alpha_amount))
```

## View top validators in a subnet

Use the metagraph to view validators and their stakes within a subnet. This helps you identify top validators before deciding where to stake.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

```bash
# View validators on a specific subnet
btcli subnet show --netuid 14

# Or view the full metagraph
btcli subnets metagraph --netuid 14
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import bittensor as bt

sub = bt.Subtensor(network="test")
netuid = 14  # Change to your desired subnet

# Fetch the metagraph for the subnet
metagraph = sub.metagraph(netuid=netuid)

# Pair each UID with its hotkey and stake, then sort by stake
validators = [
    (uid, hk, stake)
    for uid, (hk, stake) in enumerate(zip(metagraph.hotkeys, metagraph.stake))
]
top_validators = sorted(validators, key=lambda x: x[2], reverse=True)[:10]

print(f"Top 10 Validators in Subnet {netuid}:")
for rank, (uid, hotkey, stake) in enumerate(top_validators, start=1):
    print(f"  {rank}. UID {uid} | Stake: {stake:.4f} | Hotkey: {hotkey}")
```

</TabItem>
</Tabs>

## Stake without a proxy (insecure)

:::danger Do not use this on mainnet
Staking without a proxy requires your coldkey private key on the machine. This is acceptable for testing on testnet but is a serious security risk on mainnet. For mainnet, always use a proxy. See [Best practices](#best-practices-for-staking-security).
:::

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

```bash
btcli stake add --wallet.name my_coldkey --netuid 14 --amount 1.0
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import bittensor as bt

sub = bt.Subtensor(network="test")
wallet = bt.Wallet(name="my_coldkey")

response = sub.add_stake(
    wallet=wallet,
    hotkey_ss58="VALIDATOR_HOTKEY_SS58",  # replace with validator hotkey
    netuid=14,
    amount=bt.Balance.from_tao(1.0),
)

print(response)

```

</TabItem>
</Tabs>

## Stake to a specific validator with a time-delay proxy

Stake to a single validator on a specific subnet using a time-delay `Staking` proxy with [price protection](#price-protection-safe-staking). The process has three steps: announce the transaction, monitor for unauthorized announcements, then execute after the delay.

### Step 1. Announce

Build the staking call and announce its hash on-chain. Record the hash for monitoring.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

:::note Coming in btcli v10
`btcli stake add --announce-only` is not yet available. Use the SDK tab to announce staking calls with a time-delay proxy.
:::

</TabItem>
<TabItem value="sdk" label="Python SDK">




```python
import asyncio, json
import bittensor as bt
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace with your proxy wallet name
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace with your real account SS58

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        netuid = 14
        hotkey = "VALIDATOR_HOTKEY"  # replace with validator hotkey
        amount = bt.Balance.from_tao(100)

        # Build the call with price protection
        pool = await subtensor.subnet(netuid=netuid)
        rate_tolerance = 0.02  # 2%
        limit_price = bt.Balance.from_tao(pool.price.tao * (1 + rate_tolerance)).rao

        add_stake_call = await SubtensorModule(subtensor).add_stake_limit(
            netuid=netuid,
            hotkey=hotkey,
            amount_staked=amount.rao,
            limit_price=limit_price,
            allow_partial=False,
        )

        call_hash = "0x" + add_stake_call.call_hash.hex()
        print(f"Announcing: {call_hash}")
        announce_result = await subtensor.announce_proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            call_hash=call_hash,
            mev_protection=True,
        )
        print(announce_result)

        # Save exact parameters so the execute step can rebuild the identical call.
        save_data = {
            "netuid": netuid,
            "hotkey": hotkey,
            "call_hash": call_hash,
            "amount_staked_rao": amount.rao,
            "limit_price_rao": limit_price,
            "allow_partial": False,
        }
        with open("announced_stake.json", "w") as f:
            json.dump(save_data, f, indent=2)
        print(f"Saved announcement data to announced_stake.json")

asyncio.run(main())
```

</TabItem>
</Tabs>

### Step 2. Monitor

During the delay window, query the chain for pending announcements and verify the only pending hash is the one you announced. This script checks all delayed proxy delegates for your real account, cross-references against `announced_stake.json` from Step 1, and gives a clear verdict.

btcli cannot query on-chain announcements, so use the SDK or [Polkadot.js](../concepts/inspecting-the-chain).

:::warning Run this more than once
An attacker could announce after your first check. Run this at least twice: once shortly after announcing, and again immediately before executing Step 3.
:::


```python
import asyncio, json, sys
import bittensor as bt

REAL_ACCOUNT_SS58 = "REAL_COLDKEY_SS58"  # replace with your coldkey SS58
ANNOUNCED_FILE = "announced_stake.json"  # file saved by Step 1
BLOCK_TIME_SECONDS = 12

async def monitor():
    async with bt.AsyncSubtensor(network="test") as subtensor:
        with open(ANNOUNCED_FILE) as f:
            data = json.load(f)
        # Single-stake file is a dict, not a list. Normalize to lowercase to guard against encoding differences.
        expected_hashes = {data["call_hash"].lower()} if isinstance(data, dict) else {a["call_hash"].lower() for a in data}

        proxies, _ = await subtensor.get_proxies_for_real_account(REAL_ACCOUNT_SS58)
        if not proxies:
            sys.exit("No proxy relationships found for this account.")

        # Warn about 0-delay proxies — these can act immediately with no announcement
        zero_delay = [p for p in proxies if p.delay == 0]
        delayed_proxies = [p for p in proxies if p.delay > 0]

        if zero_delay:
            print(f"WARNING: {len(zero_delay)} zero-delay proxy relationship(s) detected.")
            print("  These proxies can execute instantly with no announcement or veto window:")
            for p in zero_delay:
                print(f"    delegate={p.delegate}  type={p.proxy_type}")
            print("  If you do not recognize these, revoke them immediately.\n")

        if not delayed_proxies:
            sys.exit("No delayed proxy relationships found. Nothing to monitor.")

        current_block = await subtensor.get_current_block()
        on_chain_hashes = set()

        for proxy_info in delayed_proxies:
            announcements = await subtensor.get_proxy_announcement(proxy_info.delegate)
            for ann in announcements:
                if ann.real != REAL_ACCOUNT_SS58:
                    continue
                on_chain_hashes.add(ann.call_hash.lower())
                blocks_elapsed = current_block - ann.height
                blocks_remaining = max(0, proxy_info.delay - blocks_elapsed)
                is_ours = ann.call_hash.lower() in expected_hashes
                executable_now = blocks_remaining == 0

                if is_ours:
                    status = "EXPECTED"
                elif executable_now:
                    status = "EXECUTABLE NOW — REJECT IMMEDIATELY"
                else:
                    status = "UNEXPECTED — NOT IN " + ANNOUNCED_FILE

                print(
                    f"PENDING ANNOUNCEMENT\n"
                    f"  delegate:     {proxy_info.delegate}\n"
                    f"  proxy_type:   {proxy_info.proxy_type}\n"
                    f"  call_hash:    {ann.call_hash}\n"
                    f"  announced:    block {ann.height} ({blocks_elapsed} blocks ago)\n"
                    f"  veto window:  {blocks_remaining} blocks ({blocks_remaining * BLOCK_TIME_SECONDS}s)\n"
                    f"  status:       {status}\n"
                )

        missing = expected_hashes - on_chain_hashes
        if missing:
            print("MISSING announcements (expected but not on-chain):")
            for h in missing:
                print(f"  {h}")
            print("These may not have been finalized yet. Re-check shortly.")

        unexpected = on_chain_hashes - expected_hashes
        if unexpected:
            print("UNAUTHORIZED announcements detected! Reject immediately and rotate keys.")
            for h in unexpected:
                print(f"  {h}")
        else:
            print("All on-chain announcements match expected hashes. Safe to proceed to Step 3.")

asyncio.run(monitor())
```

example output:
```console

[ProxyInfo(delegate='5F1TCdVcRWLYyKiS2kF2nBZ21EwQDDFr8hEqrDhRL6YvdtgQ', proxy_type='NonTransfer', delay=99)]
PENDING ANNOUNCEMENT
  delegate:     5F1TCdVcRWLYyKiS2kF2nBZ21EwQDDFr8hEqrDhRL6YvdtgQ
  proxy_type:   NonTransfer
  call_hash:    0xd8d742d8e104191114db0e135190f275fd16a9f586ccdd305f50bcd7965564ac
  announced:    block 6814130 (502149 blocks ago)
  veto window:  0 blocks remaining (0 s)

PENDING ANNOUNCEMENT
  delegate:     5F1TCdVcRWLYyKiS2kF2nBZ21EwQDDFr8hEqrDhRL6YvdtgQ
  proxy_type:   NonTransfer
  call_hash:    0xad4b9a996a6be1ecb710a277f0677ebf77ddbb6f285c558b7682d56ce6a8d2ad
  announced:    block 7316250 (29 blocks ago)
  veto window:  70 blocks remaining (840 s)

```


If you see an unexpected hash, [reject it](../keys/proxies/working-with-proxies#reject-an-announcement) immediately. To batch-reject all pending announcements, see [Reject all pending announcements](../keys/proxies/working-with-proxies#reject-all-pending-announcements). To reject a single announcement:

```python
import asyncio
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import Proxy

async def main():
    async with bt.AsyncSubtensor(network="test") as subtensor:
        nontransfer_proxy_wallet = bt.Wallet(name="YOUR_NONTRANSFER_PROXY")  # replace
        real_account_ss58 = "REAL_COLDKEY_SS58"  # replace
        delegate_ss58 = "DELEGATE_SS58"  # the proxy that made the announcement

        reject_call = await Proxy(subtensor).reject_announcement(
            delegate=delegate_ss58,
            call_hash="0xSUSPICIOUS_HASH",  # replace with the hash to reject
        )
        response = await subtensor.proxy(
            wallet=nontransfer_proxy_wallet,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.NonTransfer,
            call=reject_call,
            mev_protection=True,
        )
        print(response)

asyncio.run(main())
```

### Step 3. Execute

After the delay has passed and you have confirmed that only your announced hash is pending, execute the call. You must rebuild the call with exactly the same parameters so the hash matches.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

```bash
btcli proxy execute \
  --wallet.name PROXY_WALLET \
  --call-hash 0x...
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import asyncio, json
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace
PROXY_DELAY_BLOCKS = 100  # must match delay configured when the proxy was created

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        # Load the exact parameters saved during announcement.
        with open("announced_stake.json") as f:
            data = json.load(f)

        add_stake_call = await SubtensorModule(subtensor).add_stake_limit(
            netuid=data["netuid"],
            hotkey=data["hotkey"],
            amount_staked=data["amount_staked_rao"],
            limit_price=data["limit_price_rao"],
            allow_partial=data["allow_partial"],
        )

        # Verify the hash matches what was announced.
        call_hash = "0x" + add_stake_call.call_hash.hex()
        assert call_hash == data["call_hash"], (
            f"Hash mismatch: rebuilt {call_hash} != announced {data['call_hash']}. "
            f"Parameters must be identical to announcement."
        )

        current_block = await subtensor.get_current_block()
        target_block = current_block + PROXY_DELAY_BLOCKS
        print(f"Waiting for block {target_block}...")
        await subtensor.wait_for_block(target_block)

        result = await subtensor.proxy_announced(
            wallet=proxy_wallet,
            delegate_ss58=proxy_wallet.coldkeypub.ss58_address,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Staking,
            call=add_stake_call,
            mev_protection=True,
        )
        print(result)

asyncio.run(main())
```

</TabItem>
</Tabs>


## Stake to top subnets and validators with a time-delay proxy

This script automatically stakes across the top validators in the top subnets by emission, using a **time-delay proxy**. The process is split into three separate steps with a mandatory human verification step between them:

1. **Announce**: Build all staking calls and announce their hashes on-chain. Record every hash.
2. **Monitor**: Before doing anything else, verify that **all and only** the hashes you announced are pending. This is the critical security step — if an attacker has compromised your proxy key, unauthorized announcements will appear here. If you see any hash you don't recognize, reject it immediately and rotate your keys.
3. **Execute**: After the delay has passed and you have confirmed the announcements are legitimate, execute them.

The delay is configured when the proxy relationship is created — see [Add a Proxy Relationship](../keys/proxies/working-with-proxies#add-a-proxy-relationship) and [Announce and Execute a Delayed Proxy Call](../keys/proxies/working-with-proxies#announce-and-execute-a-delayed-proxy-call). This example assumes a delay of 100 blocks (~20 minutes). For high-value accounts, this delay is almost always worth the extra latency.

### Step 1: Announce

This script builds all the staking calls, announces each one on-chain, and prints the call hashes, as well as saving them to file. You will need them to verify that no unauthorized announcements were injected before you execute.

Set up the required environment variables before running:

```python
import os

os.environ['BT_PROXY_WALLET_NAME'] = 'PROXY_WALLET'       # proxy wallet name
os.environ['BT_REAL_ACCOUNT_SS58'] = 'YOUR_COLDKEY_SS58'  # primary coldkey SS58 (no private key needed)
os.environ['TOTAL_TAO_TO_STAKE'] = '1'
os.environ['NUM_SUBNETS_TO_STAKE_IN'] = '3'
os.environ['NUM_VALIDATORS_PER_SUBNET'] = '3'
```

```python
import os, sys, asyncio, json
import bittensor as bt
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet_name = os.environ.get('BT_PROXY_WALLET_NAME')
real_account_ss58 = os.environ.get('BT_REAL_ACCOUNT_SS58')

if not proxy_wallet_name:
    sys.exit("❌ BT_PROXY_WALLET_NAME not specified.")
if not real_account_ss58:
    sys.exit("❌ BT_REAL_ACCOUNT_SS58 not specified.")

try:
    total_to_stake = float(os.environ.get('TOTAL_TAO_TO_STAKE', '1'))
except ValueError:
    sys.exit("❌ TOTAL_TAO_TO_STAKE must be a number.")

try:
    num_subnets = int(os.environ.get('NUM_SUBNETS_TO_STAKE_IN', '3'))
except ValueError:
    sys.exit("❌ NUM_SUBNETS_TO_STAKE_IN must be an integer.")

try:
    validators_per_subnet = int(os.environ.get('NUM_VALIDATORS_PER_SUBNET', '3'))
except ValueError:
    sys.exit("❌ NUM_VALIDATORS_PER_SUBNET must be an integer.")

print(f"\n🔓 Using proxy wallet: {proxy_wallet_name}")
print(f"  Staking on behalf of: {real_account_ss58[:12]}...")
print(f"  Dividing {total_to_stake} TAO across top {validators_per_subnet} validators in each of top {num_subnets} subnets.")

proxy_wallet = bt.Wallet(proxy_wallet_name)

# Price protection settings
RATE_TOLERANCE = 0.02  # 2% price tolerance
ALLOW_PARTIAL = False  # Strict mode: reject if price exceeds tolerance

# Time-delay proxy settings
# Must match the delay configured when the proxy relationship was created.
PROXY_DELAY_BLOCKS = 100  # ~20 minutes at 12 seconds per block

async def announce_stake(subtensor, netuid, hotkey_ss58, amount_to_stake):
    """Build a staking call and announce its hash on-chain. Returns the call and hash for later execution."""
    print(f"  Announcing stake of {amount_to_stake} to {hotkey_ss58} on subnet {netuid}...")
    try:
        pool = await subtensor.subnet(netuid=netuid)
        limit_price = bt.Balance.from_tao(pool.price.tao * (1 + RATE_TOLERANCE)).rao

        add_stake_call = await SubtensorModule(subtensor).add_stake_limit(
            netuid=netuid,
            hotkey=hotkey_ss58,
            amount_staked=amount_to_stake.rao,
            limit_price=limit_price,
            allow_partial=ALLOW_PARTIAL,
        )

        # GenericCall objects expose a .call_hash property (blake2-256 of the SCALE-encoded call).
        call_hash = "0x" + add_stake_call.call_hash.hex()
        print(f"    Call hash: {call_hash}")

        announce_result = await subtensor.announce_proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            call_hash=call_hash,
            mev_protection=True,
        )
        if not announce_result.success:
            print(f"    ❌ Announce failed: {announce_result.message}")
            return None

        print(f"    ✅ Announced successfully")
        return {
            "netuid": netuid,
            "hotkey": hotkey_ss58,
            "call_hash": call_hash,
            "amount_staked_rao": amount_to_stake.rao,
            "limit_price_rao": limit_price,
            "allow_partial": ALLOW_PARTIAL,
        }
    except Exception as e:
        print(f"    ❌ Failed: {e}")
        return None

async def find_top_validators(subtensor, subnet):
    """Fetch metagraph and return top validators by stake. Read-only, safe to run concurrently."""
    netuid = subnet.netuid
    print(f"\n  Subnet {netuid} had {subnet.tao_in_emission} emissions!")
    metagraph = await subtensor.metagraph(netuid)

    hk_stake_pairs = list(zip(metagraph.hotkeys, metagraph.stake))
    top_validators = sorted(hk_stake_pairs, key=lambda x: x[1], reverse=True)[:validators_per_subnet]

    print(f"  Top {validators_per_subnet} Validators for Subnet {netuid}:")
    for rank, (hk, stake) in enumerate(top_validators, start=1):
        print(f"  {rank}. {hk} - Stake: {stake}")

    return {"netuid": netuid, "validators": top_validators}

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        print("Fetching information on top subnets by TAO emissions")

        sorted_subnets = sorted(list(await subtensor.all_subnets()), key=lambda subnet: subnet.tao_in_emission, reverse=True)
        top_subnets = sorted_subnets[:num_subnets]
        amount_to_stake = bt.Balance.from_tao(total_to_stake / (num_subnets * validators_per_subnet))

        # Fetch metagraphs concurrently (read-only, no nonce needed)
        top_vali_dicts = await asyncio.gather(*[find_top_validators(subtensor, subnet) for subnet in top_subnets])
        top_validators_per_subnet = {}
        for d in top_vali_dicts:
            netuid = d['netuid']
            top_validators_per_subnet[netuid] = [hk for hk, _ in d['validators']]

        # Announce all stakes sequentially (each announcement needs its own nonce)
        announced = []
        for netuid, top_validators in top_validators_per_subnet.items():
            for hk in top_validators:
                result = await announce_stake(subtensor, netuid, hk, amount_to_stake)
                if result:
                    announced.append(result)

        # Save the announced hashes for later verification and execution.
        # Record these hashes — you will cross-reference them in the monitoring step.
        print(f"\n{'='*60}")
        print(f"ANNOUNCED {len(announced)} STAKING TRANSACTIONS")
        print(f"{'='*60}")
        for a in announced:
            print(f"  Subnet {a['netuid']} → {a['hotkey'][:16]}...")
            print(f"    Hash: {a['call_hash']}")
        print(f"{'='*60}")
        print(f"\n⏳ Delay period: {PROXY_DELAY_BLOCKS} blocks (~{PROXY_DELAY_BLOCKS * 12 // 60} minutes)")
        print(f"   STOP HERE. Do not execute until you have monitored your")
        print(f"   announcements and confirmed that all and only the above")
        print(f"   hashes are pending. See Step 2.")

        # Save announced call data so Step 3 can rebuild the exact same calls.
        # The limit_price and amount_staked RAO values must be preserved exactly —
        # the chain re-hashes the call to verify it matches the announcement.
        with open("announced_stakes.json", "w") as f:
            json.dump(announced, f, indent=2)
        print(f"\n   Saved announcement data to announced_stakes.json")

asyncio.run(main())
```
```shell
🔓 Using proxy wallet: zingo
  Staking on behalf of: 5ECaCSR1tEzc...
  Dividing 1.0 TAO across top 3 validators in each of top 3 subnets.
Fetching information on top subnets by TAO emissions

  Subnet 31 had τ0.043267221 emissions!

  Subnet 119 had τ0.017303911 emissions!

  Subnet 26 had τ0.014446833 emissions!
  Top 3 Validators for Subnet 31:
  1. 5H9iGnmydhRKbVNtC6tDr9ZbbEhHAKUE5xuLWZ1wJWsUw49z - Stake: 1130.682861328125
  2. 5CAbcrX6dDoCLYZrXzNCU9csL8JctBxhi9oZcvtc8hqz5Pri - Stake: 695.8594970703125
  3. 5DM5o384xnjsohycyLxX9umWKybCJLVoSjwzYBZ8NUwy5zXj - Stake: 83.06707763671875
  Top 3 Validators for Subnet 26:
  1. 5FZijBVEXfmCqhJH8V6aXhSujVMMTPKGb76AiG4QfWVG6fvM - Stake: 2606.20849609375
  2. 5GYi8aRkGCqQH8YScK4yYDkfZx6DtLVz3G5WJigwwbennZz8 - Stake: 689.8923950195312
  3. 5DoRe6Zic5PUfnPUno3z8MngQEHvgqEMWhfFMEXB7wug9HsV - Stake: 106.76640319824219
  Top 3 Validators for Subnet 119:
  1. 5FRxKzKrBDX3cCGqXFjYb6zCNC7GMTEaam1FWtsE8Nbr1EQJ - Stake: 993573.125
  2. 5FCPTnjevGqAuTttetBy4a24Ej3pH9fiQ8fmvP1ZkrVsLUoT - Stake: 490129.15625
  3. 5Ckdcm5X2EMe8q3V5EH3A6bhNpUEd8ZM61dwfxECjuJLfMUV - Stake: 297071.78125
  Announcing stake of τ0.111111111 to 5H9iGnmydhRKbVNtC6tDr9ZbbEhHAKUE5xuLWZ1wJWsUw49z on subnet 31...
    Call hash: 0x976e9001af2a194cc174ca7f6b9d073f3070c880ee5338ffc9babee1f9f2152f
Enter your password:
Decrypting...
    ✅ Announced successfully
  Announcing stake of τ0.111111111 to 5CAbcrX6dDoCLYZrXzNCU9csL8JctBxhi9oZcvtc8hqz5Pri on subnet 31...
    Call hash: 0xd7932a9330761d28c9715e0f479588c265ed75e58d588d3e90235723535768e8
    ✅ Announced successfully
  Announcing stake of τ0.111111111 to 5DM5o384xnjsohycyLxX9umWKybCJLVoSjwzYBZ8NUwy5zXj on subnet 31...
    Call hash: 0x16dbf773da71e8783ca70cc25a327550e0e7f0cfe7197bb9df6ca0ef8e80051c
    ✅ Announced successfully
  Announcing stake of τ0.111111111 to 5FRxKzKrBDX3cCGqXFjYb6zCNC7GMTEaam1FWtsE8Nbr1EQJ on subnet 119...
    Call hash: 0x634e5dc1e2c8064d003b55811a3c944a758c977c6d04c2b4c719b5042049aea6
    ✅ Announced successfully
  Announcing stake of τ0.111111111 to 5FCPTnjevGqAuTttetBy4a24Ej3pH9fiQ8fmvP1ZkrVsLUoT on subnet 119...
    Call hash: 0x9b3ca2fa9e8674dd56a93079221c99510e1392f2c9ce898fbf28b69a3a60345e
    ✅ Announced successfully
  Announcing stake of τ0.111111111 to 5Ckdcm5X2EMe8q3V5EH3A6bhNpUEd8ZM61dwfxECjuJLfMUV on subnet 119...
    Call hash: 0x6723384df7f9b865165ce1271bdd7cdf29dfc31b1e807eaabf670f17c013b067
    ✅ Announced successfully
  Announcing stake of τ0.111111111 to 5FZijBVEXfmCqhJH8V6aXhSujVMMTPKGb76AiG4QfWVG6fvM on subnet 26...
    Call hash: 0x47389244e6ed9dcd5b16ae10d2360313db960f87564fce0627603a46fd52d06e
    ✅ Announced successfully
  Announcing stake of τ0.111111111 to 5GYi8aRkGCqQH8YScK4yYDkfZx6DtLVz3G5WJigwwbennZz8 on subnet 26...
    Call hash: 0xc18db3dc6d6260ef995243711a98ee73884914e125d7c35c47def0c190b6dd96
    ✅ Announced successfully
  Announcing stake of τ0.111111111 to 5DoRe6Zic5PUfnPUno3z8MngQEHvgqEMWhfFMEXB7wug9HsV on subnet 26...
    Call hash: 0xf4671b0f0febcfd4e5d6c32b6817b4241aeff6ea07c6c3001c205be1301f0bc0
    ✅ Announced successfully

============================================================
ANNOUNCED 9 STAKING TRANSACTIONS
============================================================
  Subnet 31 → 5H9iGnmydhRKbVNt...
    Hash: 0x976e9001af2a194cc174ca7f6b9d073f3070c880ee5338ffc9babee1f9f2152f
  Subnet 31 → 5CAbcrX6dDoCLYZr...
    Hash: 0xd7932a9330761d28c9715e0f479588c265ed75e58d588d3e90235723535768e8
  Subnet 31 → 5DM5o384xnjsohyc...
    Hash: 0x16dbf773da71e8783ca70cc25a327550e0e7f0cfe7197bb9df6ca0ef8e80051c
  Subnet 119 → 5FRxKzKrBDX3cCGq...
    Hash: 0x634e5dc1e2c8064d003b55811a3c944a758c977c6d04c2b4c719b5042049aea6
  Subnet 119 → 5FCPTnjevGqAuTtt...
    Hash: 0x9b3ca2fa9e8674dd56a93079221c99510e1392f2c9ce898fbf28b69a3a60345e
  Subnet 119 → 5Ckdcm5X2EMe8q3V...
    Hash: 0x6723384df7f9b865165ce1271bdd7cdf29dfc31b1e807eaabf670f17c013b067
  Subnet 26 → 5FZijBVEXfmCqhJH...
    Hash: 0x47389244e6ed9dcd5b16ae10d2360313db960f87564fce0627603a46fd52d06e
  Subnet 26 → 5GYi8aRkGCqQH8YS...
    Hash: 0xc18db3dc6d6260ef995243711a98ee73884914e125d7c35c47def0c190b6dd96
  Subnet 26 → 5DoRe6Zic5PUfnPU...
    Hash: 0xf4671b0f0febcfd4e5d6c32b6817b4241aeff6ea07c6c3001c205be1301f0bc0
============================================================

⏳ Delay period: 100 blocks (~20 minutes)
   STOP HERE. Do not execute until you have monitored your
   announcements and confirmed that all and only the above
   hashes are pending. See Step 2.

```
### Step 2: Monitor announcements

:::danger monitoring is not optional
The entire security value of a time-delay proxy depends on monitoring. If you skip this step, a compromised proxy key can drain your account during the delay window by submitting its own announcements. **Always verify that the pending announcements match exactly what you announced**. 
:::

During the delay window, run this script to cross-reference on-chain announcements against the `announced_stakes.json` file saved in Step 1. It checks **all** proxy delegates for your real account (not just the one you used), filters for announcements targeting your coldkey, and flags anything you didn't create.

:::warning Run this more than once
A single check is not sufficient. An attacker could announce *after* your first check. Run this script at least twice: once shortly after announcing, and again immediately before executing Step 3.
:::



```python
import asyncio, json, sys
import bittensor as bt

REAL_ACCOUNT_SS58 = "YOUR_COLDKEY_SS58"  # replace with your real account SS58
ANNOUNCED_FILE = "announced_stakes.json"  # file saved by Step 1
BLOCK_TIME_SECONDS = 12

async def monitor():
    async with bt.AsyncSubtensor(network="test") as subtensor:
        # Load the hashes we expect from Step 1
        with open(ANNOUNCED_FILE) as f:
            expected = json.load(f)
        # Normalize to lowercase to guard against encoding differences.
        expected_hashes = {a["call_hash"].lower() for a in expected}

        # Get ALL proxy relationships for this real account
        proxies, _ = await subtensor.get_proxies_for_real_account(REAL_ACCOUNT_SS58)
        if not proxies:
            sys.exit("No proxy relationships found for this account.")

        # Warn about 0-delay proxies — these can act immediately with no announcement
        zero_delay = [p for p in proxies if p.delay == 0]
        delayed_proxies = [p for p in proxies if p.delay > 0]

        if zero_delay:
            print(f"WARNING: {len(zero_delay)} zero-delay proxy relationship(s) detected.")
            print("  These proxies can execute instantly with no announcement or veto window:")
            for p in zero_delay:
                print(f"    delegate={p.delegate}  type={p.proxy_type}")
            print("  If you do not recognize these, revoke them immediately.\n")

        if not delayed_proxies:
            sys.exit("No delayed proxy relationships found. Nothing to monitor.")

        print(f"Checking {len(delayed_proxies)} delayed proxy delegate(s) for {REAL_ACCOUNT_SS58[:16]}...")
        current_block = await subtensor.get_current_block()
        on_chain_hashes = set()

        print(f"\n{'='*60}")
        print(f"PENDING ANNOUNCEMENTS (block {current_block})")
        print(f"{'='*60}")

        found_any = False
        for proxy_info in delayed_proxies:
            announcements = await subtensor.get_proxy_announcement(proxy_info.delegate)
            for ann in announcements:
                # Only look at announcements targeting our real account
                if ann.real != REAL_ACCOUNT_SS58:
                    continue
                found_any = True
                on_chain_hashes.add(ann.call_hash.lower())
                blocks_elapsed = current_block - ann.height
                blocks_remaining = max(0, proxy_info.delay - blocks_elapsed)
                is_ours = ann.call_hash.lower() in expected_hashes
                executable_now = blocks_remaining == 0

                if is_ours:
                    status = "EXPECTED"
                elif executable_now:
                    status = "EXECUTABLE NOW — REJECT IMMEDIATELY"
                else:
                    status = "UNEXPECTED — NOT IN " + ANNOUNCED_FILE

                print(f"\n  call_hash:    {ann.call_hash}")
                print(f"  delegate:     {proxy_info.delegate}")
                print(f"  proxy_type:   {proxy_info.proxy_type}")
                print(f"  announced:    block {ann.height} ({blocks_elapsed} blocks ago)")
                print(f"  veto window:  {blocks_remaining} blocks ({blocks_remaining * BLOCK_TIME_SECONDS}s)")
                print(f"  status:       {status}")

        if not found_any:
            print("\n  (no pending announcements found for this account)")

        # Cross-reference
        missing = expected_hashes - on_chain_hashes
        unexpected = on_chain_hashes - expected_hashes

        print(f"\n{'='*60}")
        print(f"SUMMARY")
        print(f"{'='*60}")
        print(f"  Expected:    {len(expected_hashes)}")
        print(f"  On-chain:    {len(on_chain_hashes)}")
        print(f"  Matched:     {len(expected_hashes & on_chain_hashes)}")

        if missing:
            print(f"\n  MISSING announcements (expected but not on-chain):")
            for h in missing:
                print(f"    {h}")
            print(f"  These may not have been finalized yet. Re-check shortly.")

        if unexpected:
            print(f"\n  UNAUTHORIZED announcements detected!")
            print(f"  Your proxy key may be compromised.")
            print(f"  Reject these immediately and rotate your keys.")
            for h in unexpected:
                print(f"    {h}")
            return False
        else:
            print(f"\n  All on-chain announcements match expected hashes. Safe to proceed to Step 3.")
            return True

asyncio.run(monitor())
```


If you see an **unexpected hash**, [reject it](../keys/proxies/working-with-proxies#reject-an-announcement) immediately. To batch-reject all pending announcements at once, see [Reject all pending announcements](../keys/proxies/working-with-proxies#reject-all-pending-announcements). To reject a single announcement:

```python
import asyncio
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import Proxy

async def main():
    async with bt.AsyncSubtensor(network="test") as subtensor:
        nontransfer_proxy_wallet = bt.Wallet(name="YOUR_NONTRANSFER_PROXY")  # replace
        real_account_ss58 = "YOUR_REAL_ACCOUNT_SS58"  # replace
        delegate_ss58 = "COMPROMISED_DELEGATE_SS58"  # the proxy that made the announcement

        reject_call = await Proxy(subtensor).reject_announcement(
            delegate=delegate_ss58,
            call_hash="0xSUSPICIOUS_HASH_HERE",  # replace with the hash to reject
        )
        response = await subtensor.proxy(
            wallet=nontransfer_proxy_wallet,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.NonTransfer,
            call=reject_call,
            mev_protection=True,
        )
        print(response)

asyncio.run(main())
```

### Step 3: Execute

After the delay has passed and you have confirmed in Step 2 that all pending announcements are legitimate, execute them.

`proxy_announced` requires the full `GenericCall` object, not just the hash — the chain re-hashes the call you submit and verifies it matches what was announced. This means you must rebuild each call with **exactly the same parameters** used in Step 1. This is why Step 1 saves `amount_staked_rao`, `limit_price_rao`, and `allow_partial` to `announced_stakes.json` — if any parameter differs (e.g. because you recomputed `limit_price` from a newer pool price), the hash won't match and execution will fail.

```python
import os, sys, asyncio, json
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet_name = os.environ.get('BT_PROXY_WALLET_NAME')
real_account_ss58 = os.environ.get('BT_REAL_ACCOUNT_SS58')

if proxy_wallet_name is None:
    sys.exit("❌ BT_PROXY_WALLET_NAME not specified.")
if real_account_ss58 is None:
    sys.exit("❌ BT_REAL_ACCOUNT_SS58 not specified.")

proxy_wallet = bt.Wallet(proxy_wallet_name)

# Load the announcement data saved in Step 1.
# This contains the exact parameter values needed to rebuild identical calls.
with open("announced_stakes.json") as f:
    announced = json.load(f)

print(f"Loaded {len(announced)} announcements to execute.")

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        for a in announced:
            netuid = a["netuid"]
            hotkey = a["hotkey"]
            expected_hash = a["call_hash"]

            # Rebuild the call using the exact parameters saved in Step 1.
            # Do NOT recompute limit_price from the current pool price —
            # the hash must match what was announced.
            add_stake_call = await SubtensorModule(subtensor).add_stake_limit(
                netuid=netuid,
                hotkey=hotkey,
                amount_staked=a["amount_staked_rao"],
                limit_price=a["limit_price_rao"],
                allow_partial=a["allow_partial"],
            )

            # Sanity check: verify the rebuilt call matches the announced hash
            rebuilt_hash = "0x" + add_stake_call.call_hash.hex()
            if rebuilt_hash != expected_hash:
                print(f"  ❌ Hash mismatch for subnet {netuid} → {hotkey[:16]}...")
                print(f"     Expected: {expected_hash}")
                print(f"     Got:      {rebuilt_hash}")
                print(f"     Skipping — do NOT execute mismatched calls.")
                continue

            print(f"  Executing: subnet {netuid} → {hotkey[:16]}... (hash: {expected_hash[:18]}...)")
            result = await subtensor.proxy_announced(
                wallet=proxy_wallet,
                delegate_ss58=proxy_wallet.coldkeypub.ss58_address,
                real_account_ss58=real_account_ss58,
                force_proxy_type=ProxyType.Staking,
                call=add_stake_call,
                mev_protection=True,
            )
            print(result)

asyncio.run(main())
```

## Unstake from a validator

Unstake from a specific validator on a specific subnet. The `limit_price` for unstaking is computed as `price * (1 - tolerance)` since selling alpha pushes the price down — you're setting a floor on the worst price you'll accept.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

```bash
btcli stake remove \
  --wallet.name PROXY_WALLET \
  --proxy REAL_COLDKEY_SS58 \
  --netuid 14 \
  --hotkey VALIDATOR_HOTKEY \
  --amount 25.0
```

To unstake all stake from a validator:

```bash
btcli stake remove --all \
  --wallet.name PROXY_WALLET \
  --proxy REAL_COLDKEY_SS58
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

Replace the placeholder values with your proxy wallet name, real account SS58, target subnet, validator hotkey, and amount.

```python
import asyncio
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace with your proxy wallet name
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace with your real account SS58

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        netuid = 17
        hotkey = "VALIDATOR_HOTKEY"  # replace with validator hotkey
        amount = bt.Balance.from_tao(10)

        # Compute limit price for unstaking (price floor).
        # Unstaking sells alpha for TAO, pushing the price down.
        pool = await subtensor.subnet(netuid=netuid)
        rate_tolerance = 0.02  # 2%
        limit_price = bt.Balance.from_tao(pool.price.tao * (1 - rate_tolerance)).rao

        remove_stake_call = await SubtensorModule(subtensor).remove_stake_limit(
            netuid=netuid,
            hotkey=hotkey,
            amount_unstaked=amount.rao,
            limit_price=limit_price,
            allow_partial=False,
        )
        result = await subtensor.proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Staking,
            call=remove_stake_call,
            mev_protection=True,
            wait_for_inclusion=True,
            wait_for_finalization=False,
        )
        print(result)

asyncio.run(main())
```


</TabItem>
</Tabs>

## Unstake with a time-delay proxy

Unstake from a validator using a time-delay `Staking` proxy. This follows the same announce → monitor → execute pattern as [staking with a time-delay proxy](#stake-to-top-subnets-and-validators-with-a-time-delay-proxy), adapted for `remove_stake_limit`. The limit price is a **floor** (worst acceptable price when selling alpha for TAO) rather than a ceiling.

### Step 1. Announce

Build the unstaking call and announce its hash on-chain. Save the exact parameters to a file — you will need them to rebuild the identical call in Step 3.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

:::note Coming in btcli v10
`btcli stake remove --announce-only` is not yet available. Use the SDK tab to announce unstaking calls with a time-delay proxy.
:::

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import asyncio, json
import bittensor as bt
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace with your proxy wallet name
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace with your real account SS58

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        netuid = 14
        hotkey = "VALIDATOR_HOTKEY"  # replace with validator hotkey
        amount = bt.Balance.from_tao(25)

        # Compute limit price for unstaking (price floor).
        pool = await subtensor.subnet(netuid=netuid)
        rate_tolerance = 0.02  # 2%
        limit_price = bt.Balance.from_tao(pool.price.tao * (1 - rate_tolerance)).rao

        remove_stake_call = await SubtensorModule(subtensor).remove_stake_limit(
            netuid=netuid,
            hotkey=hotkey,
            amount_unstaked=amount.rao,
            limit_price=limit_price,
            allow_partial=False,
        )

        call_hash = "0x" + remove_stake_call.call_hash.hex()
        print(f"Announcing: {call_hash}")
        announce_result = await subtensor.announce_proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            call_hash=call_hash,
            mev_protection=True,
        )
        print(announce_result)

        # Save parameters so Step 3 can rebuild the exact same call.
        save_data = {
            "netuid": netuid,
            "hotkey": hotkey,
            "call_hash": call_hash,
            "amount_unstaked_rao": amount.rao,
            "limit_price_rao": limit_price,
            "allow_partial": False,
        }
        with open("announced_unstake.json", "w") as f:
            json.dump(save_data, f, indent=2)
        print(f"Saved announcement data to announced_unstake.json")

asyncio.run(main())
```

</TabItem>
</Tabs>

### Step 2. Monitor

:::danger Monitoring is not optional
The entire security value of a time-delay proxy depends on monitoring. If you skip this step, a compromised proxy key can drain your account during the delay window by submitting its own announcements. **Always verify that the pending announcements match exactly what you announced**.
:::

During the delay window, run the [monitoring script from the staking section](#step-2-monitor-announcements) to cross-reference on-chain announcements against your saved data. If you see any hash you didn't create, [reject it](../keys/proxies/working-with-proxies#reject-an-announcement) immediately.

### Step 3. Execute

After the delay has passed and you have confirmed that only your announced hash is pending, rebuild the call with the exact same parameters and execute it.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

```bash
btcli proxy execute \
  --wallet.name PROXY_WALLET \
  --call-hash 0x...
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import asyncio, json
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace
PROXY_DELAY_BLOCKS = 100  # must match delay configured when the proxy was created

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        # Load the exact parameters saved during announcement.
        with open("announced_unstake.json") as f:
            data = json.load(f)

        remove_stake_call = await SubtensorModule(subtensor).remove_stake_limit(
            netuid=data["netuid"],
            hotkey=data["hotkey"],
            amount_unstaked=data["amount_unstaked_rao"],
            limit_price=data["limit_price_rao"],
            allow_partial=data["allow_partial"],
        )

        # Verify the hash matches what was announced.
        call_hash = "0x" + remove_stake_call.call_hash.hex()
        assert call_hash == data["call_hash"], (
            f"Hash mismatch: rebuilt {call_hash} != announced {data['call_hash']}. "
            f"Parameters must be identical to announcement."
        )

        current_block = await subtensor.get_current_block()
        target_block = current_block + PROXY_DELAY_BLOCKS
        print(f"Waiting for block {target_block}...")
        await subtensor.wait_for_block(target_block)

        result = await subtensor.proxy_announced(
            wallet=proxy_wallet,
            delegate_ss58=proxy_wallet.coldkeypub.ss58_address,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Staking,
            call=remove_stake_call,
            mev_protection=True,
        )
        print(result)

asyncio.run(main())
```

</TabItem>
</Tabs>

## Unstake from low-emissions validators

:::danger Not safe for mainnet
This script calls `subtensor.proxy()` directly with immediate execution and no announcement step. There is no veto window. Do not use this on mainnet. For mainnet, use the announce, monitor, and execute pattern shown in [Unstake with a time-delay proxy](#unstake-with-a-time-delay-proxy) above.
:::

The script below unstakes from the delegations to validators on particular subnets that have yielded the least emissions in the last tempo.

Set up the required environment variables:

```python
import os

os.environ['BT_PROXY_WALLET_NAME'] = 'PROXY_WALLET'
os.environ['BT_REAL_ACCOUNT_SS58'] = 'YOUR_COLDKEY_SS58'
os.environ['TOTAL_TAO_TO_UNSTAKE'] = '1'
os.environ['MAX_STAKES_TO_UNSTAKE'] = '10'
```

```python
import os, sys, asyncio
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet_name = os.environ.get('BT_PROXY_WALLET_NAME')
real_account_ss58 = os.environ.get('BT_REAL_ACCOUNT_SS58')

if not proxy_wallet_name:
    sys.exit("BT_PROXY_WALLET_NAME not specified.")
if not real_account_ss58:
    sys.exit("BT_REAL_ACCOUNT_SS58 not specified.")

try:
    total_to_unstake = float(os.environ.get('TOTAL_TAO_TO_UNSTAKE', '1'))
except ValueError:
    sys.exit("TOTAL_TAO_TO_UNSTAKE must be a number.")

try:
    max_stakes_to_unstake = int(os.environ.get('MAX_STAKES_TO_UNSTAKE', '10'))
except ValueError:
    sys.exit("MAX_STAKES_TO_UNSTAKE must be an integer.")

print(f"  Using proxy wallet: {proxy_wallet_name}")
print(f"  Unstaking on behalf of: {real_account_ss58[:12]}...")
print(f"  Unstaking a total of {total_to_unstake} TAO across up to {max_stakes_to_unstake} lowest-emission validators")

total_to_unstake = bt.Balance.from_tao(total_to_unstake)
proxy_wallet = bt.Wallet(proxy_wallet_name)
unstake_minimum = 0.0005  # TAO

# Price protection settings
RATE_TOLERANCE = 0.02  # 2%
ALLOW_PARTIAL = False  # Strict mode

async def perform_unstake(subtensor, stake, amount_tao):
    try:
        # Compute limit price for this subnet (price floor)
        pool = await subtensor.subnet(netuid=stake.netuid)
        limit_price = bt.Balance.from_tao(pool.price.tao * (1 - RATE_TOLERANCE)).rao

        # Convert the TAO amount to alpha using the pool, then cap by actual stake held
        amount_alpha_rao = min(pool.tao_to_alpha(amount_tao).rao, stake.stake.rao)
        print(f"⏳ Attempting to unstake {bt.Balance.from_rao(amount_alpha_rao).set_unit(stake.netuid)} from {stake.hotkey_ss58} on subnet {stake.netuid}")

        remove_stake_call = await SubtensorModule(subtensor).remove_stake_limit(
            netuid=stake.netuid,
            hotkey=stake.hotkey_ss58,
            amount_unstaked=amount_alpha_rao,
            limit_price=limit_price,
            allow_partial=ALLOW_PARTIAL,
        )
        result = await subtensor.proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Staking,
            call=remove_stake_call,
            mev_protection=True,
        )
        print(result)
        return result.success
    except Exception as e:
        print(f"❌ Error during unstake from {stake.hotkey_ss58} on subnet {stake.netuid}: {e}")
        return False

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        try:
            stakes = await subtensor.get_stake_info_for_coldkey(real_account_ss58)
        except Exception as e:
            sys.exit(f"❌ Failed to get stake info: {e}")

        stakes = [s for s in stakes if float(s.stake.tao) > unstake_minimum]
        stakes = sorted(stakes, key=lambda s: s.emission.tao)[:max_stakes_to_unstake]

        if not stakes:
            sys.exit("❌ No eligible stakes found to unstake.")

        print(f"\n  Preparing to unstake from {len(stakes)} validators:\n")
        for s in stakes:
            print(f"Validator: {s.hotkey_ss58}\n  NetUID: {s.netuid}\n  Stake: {s.stake.tao}\n  Emission: {s.emission}\n-----------")

        amount_per_stake = total_to_unstake.tao / len(stakes)

        # Unstake sequentially to avoid nonce collisions
        success_count = 0
        for stake in stakes:
            success = await perform_unstake(subtensor, stake, amount_per_stake)
            if success:
                success_count += 1
        print(f"\n  Unstake complete. Success: {success_count}/{len(stakes)}")

asyncio.run(main())
```

## Move stake

Move stake from one validator/subnet to another using a `Staking` proxy. Moving stake converts alpha on the origin subnet to TAO (via the AMM), then converts TAO to alpha on the destination subnet. Both conversions incur slippage.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

```bash
btcli stake move \
  --wallet.name PROXY_WALLET \
  --proxy REAL_COLDKEY_SS58 \
  --origin-netuid 5 \
  --origin-hotkey ORIGIN_VALIDATOR_HOTKEY \
  --dest-netuid 18 \
  --dest-hotkey DEST_VALIDATOR_HOTKEY \
  --amount 50.0
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import asyncio
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace with your proxy wallet name
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace with your real account SS58

async def main():
    async with bt.AsyncSubtensor("test") as subtensor:
        move_stake_call = await SubtensorModule(subtensor).move_stake(
            origin_netuid=5,
            origin_hotkey_ss58="ORIGIN_VALIDATOR_HOTKEY",  # replace
            destination_netuid=18,
            destination_hotkey_ss58="DEST_VALIDATOR_HOTKEY",  # replace
            alpha_amount=bt.Balance.from_tao(50).rao,
        )
        result = await subtensor.proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Staking,
            call=move_stake_call,
            mev_protection=True,
            wait_for_inclusion=True,
            wait_for_finalization=False,
        )
        print(result)

asyncio.run(main())
```

</TabItem>
</Tabs>

## Move stake with a time-delay proxy

Move stake between validators/subnets using a time-delay `Staking` proxy. This follows the same announce → monitor → execute pattern as [staking with a time-delay proxy](#stake-to-top-subnets-and-validators-with-a-time-delay-proxy), adapted for `move_stake`.

### Step 1. Announce

Build the move-stake call and announce its hash on-chain. Save the exact parameters to a file — you will need them to rebuild the identical call in Step 3.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

:::note Coming in btcli v10
`btcli stake move --announce-only` is not yet available. Use the SDK tab to announce move-stake calls with a time-delay proxy.
:::

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import asyncio, json
import bittensor as bt
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace with your proxy wallet name
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace with your real account SS58

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        origin_netuid = 5
        origin_hotkey = "ORIGIN_VALIDATOR_HOTKEY"  # replace
        destination_netuid = 18
        destination_hotkey = "DEST_VALIDATOR_HOTKEY"  # replace
        alpha_amount = bt.Balance.from_tao(50).rao

        move_stake_call = await SubtensorModule(subtensor).move_stake(
            origin_netuid=origin_netuid,
            origin_hotkey_ss58=origin_hotkey,
            destination_netuid=destination_netuid,
            destination_hotkey_ss58=destination_hotkey,
            alpha_amount=alpha_amount,
        )

        call_hash = "0x" + move_stake_call.call_hash.hex()
        print(f"Announcing: {call_hash}")
        announce_result = await subtensor.announce_proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            call_hash=call_hash,
            mev_protection=True,
        )
        print(announce_result)

        # Save parameters so Step 3 can rebuild the exact same call.
        save_data = {
            "origin_netuid": origin_netuid,
            "origin_hotkey": origin_hotkey,
            "destination_netuid": destination_netuid,
            "destination_hotkey": destination_hotkey,
            "call_hash": call_hash,
            "alpha_amount_rao": alpha_amount,
        }
        with open("announced_move_stake.json", "w") as f:
            json.dump(save_data, f, indent=2)
        print(f"Saved announcement data to announced_move_stake.json")

asyncio.run(main())
```

</TabItem>
</Tabs>

### Step 2. Monitor

:::danger Monitoring is not optional
The entire security value of a time-delay proxy depends on monitoring. If you skip this step, a compromised proxy key can drain your account during the delay window by submitting its own announcements. **Always verify that the pending announcements match exactly what you announced**.
:::

During the delay window, run the [monitoring script from the staking section](#step-2-monitor-announcements) to cross-reference on-chain announcements against your saved data. If you see any hash you didn't create, [reject it](../keys/proxies/working-with-proxies#reject-an-announcement) immediately.

### Step 3. Execute

After the delay has passed and you have confirmed that only your announced hash is pending, rebuild the call with the exact same parameters and execute it.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

```bash
btcli proxy execute \
  --wallet.name PROXY_WALLET \
  --call-hash 0x...
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import asyncio, json
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace
PROXY_DELAY_BLOCKS = 100  # must match delay configured when the proxy was created

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        # Load the exact parameters saved during announcement.
        with open("announced_move_stake.json") as f:
            data = json.load(f)

        move_stake_call = await SubtensorModule(subtensor).move_stake(
            origin_netuid=data["origin_netuid"],
            origin_hotkey_ss58=data["origin_hotkey"],
            destination_netuid=data["destination_netuid"],
            destination_hotkey_ss58=data["destination_hotkey"],
            alpha_amount=data["alpha_amount_rao"],
        )

        # Verify the hash matches what was announced.
        call_hash = "0x" + move_stake_call.call_hash.hex()
        assert call_hash == data["call_hash"], (
            f"Hash mismatch: rebuilt {call_hash} != announced {data['call_hash']}. "
            f"Parameters must be identical to announcement."
        )

        current_block = await subtensor.get_current_block()
        target_block = current_block + PROXY_DELAY_BLOCKS
        print(f"Waiting for block {target_block}...")
        await subtensor.wait_for_block(target_block)

        result = await subtensor.proxy_announced(
            wallet=proxy_wallet,
            delegate_ss58=proxy_wallet.coldkeypub.ss58_address,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Staking,
            call=move_stake_call,
            mev_protection=True,
        )
        print(result)

asyncio.run(main())
```

</TabItem>
</Tabs>

## Transfer stake ownership

Transfer the ownership of staked alpha from one coldkey to another. The stake stays with the same validator on the same subnet, but the controlling coldkey changes. This requires a `Transfer` or `SmallTransfer` proxy type (not `Staking`).

:::warning Transfer vs Move
**Transfer stake** changes which coldkey owns the stake. **Move stake** changes which validator/subnet the stake is on. They are different operations.
:::

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

```bash
btcli stake transfer \
  --wallet.name PROXY_WALLET \
  --proxy REAL_COLDKEY_SS58
```

btcli will interactively prompt for the destination coldkey, hotkey, subnet, and amount.

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import asyncio
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace with your Transfer proxy wallet name
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace with your real account SS58

async def main():
    async with bt.AsyncSubtensor("test") as subtensor:
        transfer_stake_call = await SubtensorModule(subtensor).transfer_stake(
            destination_coldkey="DEST_COLDKEY_SS58",  # replace with destination coldkey
            hotkey="VALIDATOR_HOTKEY",  # replace with the validator hotkey
            origin_netuid=14,
            destination_netuid=14,
            alpha_amount=bt.Balance.from_tao(50).rao,
        )
        result = await subtensor.proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Transfer,
            call=transfer_stake_call,
            mev_protection=True,
            wait_for_inclusion=True,
            wait_for_finalization=False,
        )
        print(result)

asyncio.run(main())
```

</TabItem>
</Tabs>

## Transfer stake ownership with a time-delay proxy

Transfer stake ownership using a time-delay proxy. Because this operation **permanently changes which coldkey controls the stake**, using a time-delay proxy is strongly recommended. This uses a `Transfer` (or `SmallTransfer`) proxy type.

### Step 1. Announce

Build the transfer-stake call and announce its hash on-chain. Save the exact parameters to a file — you will need them to rebuild the identical call in Step 3.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

:::note Coming in btcli v10
`btcli stake transfer --announce-only` is not yet available. Use the SDK tab to announce stake transfer calls with a time-delay proxy.
:::

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import asyncio, json
import bittensor as bt
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace with your Transfer proxy wallet name
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace with your real account SS58

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        destination_coldkey = "DEST_COLDKEY_SS58"  # replace with destination coldkey
        hotkey = "VALIDATOR_HOTKEY"  # replace with the validator hotkey
        origin_netuid = 14
        destination_netuid = 14
        alpha_amount = bt.Balance.from_tao(50).rao

        transfer_stake_call = await SubtensorModule(subtensor).transfer_stake(
            destination_coldkey=destination_coldkey,
            hotkey=hotkey,
            origin_netuid=origin_netuid,
            destination_netuid=destination_netuid,
            alpha_amount=alpha_amount,
        )

        call_hash = "0x" + transfer_stake_call.call_hash.hex()
        print(f"Announcing: {call_hash}")
        announce_result = await subtensor.announce_proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            call_hash=call_hash,
            mev_protection=True,
        )
        print(announce_result)

        # Save parameters so Step 3 can rebuild the exact same call.
        save_data = {
            "destination_coldkey": destination_coldkey,
            "hotkey": hotkey,
            "origin_netuid": origin_netuid,
            "destination_netuid": destination_netuid,
            "call_hash": call_hash,
            "alpha_amount_rao": alpha_amount,
        }
        with open("announced_transfer_stake.json", "w") as f:
            json.dump(save_data, f, indent=2)
        print(f"Saved announcement data to announced_transfer_stake.json")

asyncio.run(main())
```

</TabItem>
</Tabs>

### Step 2. Monitor

:::danger Monitoring is not optional
The entire security value of a time-delay proxy depends on monitoring. A compromised Transfer proxy key could redirect your stake to an attacker-controlled coldkey. **Always verify that the pending announcements match exactly what you announced** — especially the `destination_coldkey`.
:::

During the delay window, run the [monitoring script from the staking section](#step-2-monitor-announcements) to cross-reference on-chain announcements against your saved data. If you see any hash you didn't create, [reject it](../keys/proxies/working-with-proxies#reject-an-announcement) immediately.

### Step 3. Execute

After the delay has passed and you have confirmed that only your announced hash is pending, rebuild the call with the exact same parameters and execute it.

<Tabs groupId="tool">
<TabItem value="btcli" label="btcli">

```bash
btcli proxy execute \
  --wallet.name PROXY_WALLET \
  --call-hash 0x...
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import asyncio, json
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet = bt.Wallet(name="PROXY_WALLET")  # replace
real_account_ss58 = "REAL_COLDKEY_SS58"  # replace
PROXY_DELAY_BLOCKS = 100  # must match delay configured when the proxy was created

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        # Load the exact parameters saved during announcement.
        with open("announced_transfer_stake.json") as f:
            data = json.load(f)

        transfer_stake_call = await SubtensorModule(subtensor).transfer_stake(
            destination_coldkey=data["destination_coldkey"],
            hotkey=data["hotkey"],
            origin_netuid=data["origin_netuid"],
            destination_netuid=data["destination_netuid"],
            alpha_amount=data["alpha_amount_rao"],
        )

        # Verify the hash matches what was announced.
        call_hash = "0x" + transfer_stake_call.call_hash.hex()
        assert call_hash == data["call_hash"], (
            f"Hash mismatch: rebuilt {call_hash} != announced {data['call_hash']}. "
            f"Parameters must be identical to announcement."
        )

        current_block = await subtensor.get_current_block()
        target_block = current_block + PROXY_DELAY_BLOCKS
        print(f"Waiting for block {target_block}...")
        await subtensor.wait_for_block(target_block)

        result = await subtensor.proxy_announced(
            wallet=proxy_wallet,
            delegate_ss58=proxy_wallet.coldkeypub.ss58_address,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Transfer,
            call=transfer_stake_call,
            mev_protection=True,
        )
        print(result)

asyncio.run(main())
```

</TabItem>
</Tabs>
