---
title: "Managing stake with Bittensor Python SDK"
---

import { SdkVersion } from "../sdk/\_sdk-version.mdx";
import { ProxyColdkeyWarning } from "../keys/_proxy-warning.mdx";

# Managing Stake with Bittensor Python SDK

This page demonstrates usage of the Bittensor SDK for Python for managing stake.

TAO holders can **stake** any amount of the liquidity they hold to a validator. Also known as **delegation**, staking supports validators, because their total stake in the subnet, including stake delegated to them by others, determines their consensus power and their share of emissions. After the validator/delegate extracts their **take** the remaining emissions are credited back to the stakers/delegators in proportion to their stake with that validator.

Likewise, TAO holders can **unstake** from a subnet by converting subnet-specific alpha tokens back to TAO through the subnet's automated market maker (AMM).

<ProxyColdkeyWarning />

See also:

- [Staking/delegation overview](./delegation)
- [Staking with a Proxy](../keys/proxies/staking-with-proxy)
- [Understanding pricing and anticipating slippage](../learn/slippage)
- [Price protection when staking](../learn/price-protection)
- [MEV Shield Protection](../sdk/mev-protection.md)

:::tip
Minimum transaction amount for stake/unstake/move/transfer: 500,000 RAO or 0.0005 TAO.
:::

## Best practices for staking security

When staking real-value liquidity (especially on mainnet), three practices significantly reduce your exposure to loss:

### Use a proxy coldkey

Never expose your primary coldkey on any machine connected to the internet. Instead, create a **proxy coldkey** with `Staking` permissions and use it to sign transactions on behalf of your primary coldkey. Your primary coldkey's private key never needs to be present on the machine. All examples on this page use this pattern.

See: [Working with Proxies](../keys/proxies/working-with-proxies)

### Use time-delay proxies

A **zero-delay** proxy executes transactions immediately — convenient, but if the proxy key is compromised, an attacker can drain your stake instantly.

A **time-delay** proxy requires a two-step flow: first **announce** the transaction (publishing its hash on-chain), then **execute** it after a configurable delay (measured in blocks, where 1 block ≈ 12 seconds). During the delay window, the real account owner can review pending announcements and [**reject**](../keys/proxies/working-with-proxies#reject-an-announcement) any unauthorized ones before they execute. This gives you a safety window to respond to a compromised proxy key.

The tradeoff is latency and operational overhead. Are your tokens worth it?

See: [Stake with a time-delay proxy](#stake-with-a-time-delay-proxy)

### Use price protection (safe staking)

Every stake or unstake operation trades tokens through the subnet's AMM, which means your transaction itself moves the price. Without price protection, you're exposed to:

- **Slippage**: Large transactions push the price against you.
- **MEV/sandwich attacks**: Adversaries can front-run your transaction to extract value.
- **Organic volatility**: The price may move between when you submit and when your transaction lands.

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

See: [Understand Price Protection](../learn/price-protection)

:::warning SDK default is unsafe
Unlike `btcli`, the SDK does **not** enable price protection by default. You must explicitly use `add_stake_limit` / `remove_stake_limit` instead of the unprotected `add_stake` / `remove_stake` to get price protection.
:::

## Check your TAO balance

<SdkVersion />

To stake, you'll first need some TAO. Inquire in [Discord](https://discord.com/channels/799672011265015819/1107738550373454028/threads/1331693251589312553) to obtain TAO on Bittensor test network. Alternatively, you can [run a local Bittensor blockchain instance](../local-build/deploy.md).

:::danger
The funds in a crypto wallet are only as secure as your private key and/or seed phrase, and the devices that have access to these.

Test network tokens have no real value. Before managing liquidity on Bittensor mainnet, carefully consider all aspects of secrets management and endpoint security!
:::

Checking a balance is a permissionless operation — only the public key (SS58 address) is needed:

```python
import bittensor as bt
sub = bt.Subtensor(network="test")
wallet = bt.Wallet(name="PracticeKey!")
balance = sub.get_balance(wallet.coldkeypub.ss58_address)
print(balance)
```

## View exchange rates

The following script displays exchange rates for a subnet alpha token, with and without slippage.

```python
import bittensor as bt

sub = bt.Subtensor(network="test")
subnet = sub.subnet(netuid=1)

alpha_amount = bt.Balance.from_tao(100).set_unit(1)

print("alpha_to_tao_with_slippage", subnet.alpha_to_tao_with_slippage(alpha_amount))
print("alpha_to_tao_with_slippage percentage", subnet.alpha_to_tao_with_slippage(alpha_amount, percentage=True))

print("tao_to_alpha_with_slippage", subnet.tao_to_alpha_with_slippage(100))
print("tao_to_alpha_with_slippage percentage", subnet.tao_to_alpha_with_slippage(100, percentage=True))

print("tao_to_alpha", subnet.tao_to_alpha(100))
print("alpha_to_tao", subnet.alpha_to_tao(alpha_amount))
```

## View top validators in a subnet

Use the metagraph to view validators and their stakes within a subnet. This helps you identify top validators before deciding where to stake.

```python
import bittensor as bt

sub = bt.Subtensor(network="test")
netuid = 14  # Change to your desired subnet

# Fetch the metagraph for the subnet
metagraph = sub.metagraph(netuid=netuid)

# Get validator hotkeys and their stakes
validators = []
for uid in range(len(metagraph.hotkeys)):
    hotkey = metagraph.hotkeys[uid]
    stake = metagraph.stake[uid]
    validators.append((uid, hotkey, stake))

# Sort by stake (highest first) and show top 10
top_validators = sorted(validators, key=lambda x: x[2], reverse=True)[:10]

print(f"Top 10 Validators in Subnet {netuid}:")
for rank, (uid, hotkey, stake) in enumerate(top_validators, start=1):
    print(f"  {rank}. UID {uid} | Stake: {stake:.4f} | Hotkey: {hotkey}")
```

## Register on a subnet

Use a `Registration` proxy to register a hotkey on a subnet. The proxy coldkey signs the transaction; your primary coldkey never needs to be present on the machine.

```python
import os
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

sub = bt.Subtensor(network="test")

proxy_wallet = bt.Wallet(name=os.environ['BT_PROXY_WALLET_NAME'])
real_account_ss58 = os.environ['BT_REAL_ACCOUNT_SS58']

hotkey_wallet = bt.Wallet(
    name="ExampleWalletName",
    hotkey="ExampleHotkey",
)

burned_register_call = SubtensorModule(sub).burned_register(
    netuid=3,
    hotkey=hotkey_wallet.hotkey.ss58_address,
)

response = sub.proxy(
    wallet=proxy_wallet,
    real_account_ss58=real_account_ss58,
    force_proxy_type=ProxyType.Registration,
    call=burned_register_call,
)
print(response)
```

## View your registered subnets

Querying which subnets a hotkey is registered on is a permissionless operation — only the public key is needed:

```python
import bittensor as bt
sub = bt.Subtensor(network="test")
wallet = bt.Wallet(
    name="ExampleWalletName",
    hotkey="ExampleHotkey",
)
netuids = sub.get_netuids_for_hotkey(wallet.hotkey.ss58_address)
print(netuids)
```

## Stake to top subnets and validators

The following script uses a `Staking` proxy to stake a user-defined amount of TAO across the top subnets and validators, with [price protection](#use-price-protection-safe-staking). The proxy coldkey signs all transactions; the primary coldkey SS58 address is supplied as a read-only reference.

**Why transactions are serialized**: Read-only operations (fetching metagraphs) run concurrently for speed. However, staking transactions must run **sequentially** because each transaction from the same signing key requires a unique, incrementing nonce. If multiple transactions are submitted concurrently, they all fetch the same nonce from the chain and all but the first are rejected with a "Transaction is temporarily banned" error.

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
import os, sys, asyncio
import bittensor as bt
import time
from bittensor import tao
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

# Load environment variables
proxy_wallet_name = os.environ.get('BT_PROXY_WALLET_NAME')
real_account_ss58 = os.environ.get('BT_REAL_ACCOUNT_SS58')
total_to_stake = os.environ.get('TOTAL_TAO_TO_STAKE')
num_subnets = os.environ.get('NUM_SUBNETS_TO_STAKE_IN')
validators_per_subnet = os.environ.get('NUM_VALIDATORS_PER_SUBNET')

if proxy_wallet_name is None:
    sys.exit("❌ BT_PROXY_WALLET_NAME not specified.")
if real_account_ss58 is None:
    sys.exit("❌ BT_REAL_ACCOUNT_SS58 not specified.")

if total_to_stake is None:
    print("⚠️ TOTAL_TAO_TO_STAKE not specified. Defaulting to 1 TAO.")
    total_to_stake = 1.0
else:
    try:
        total_to_stake = float(total_to_stake)
    except:
        sys.exit("❌ Invalid TOTAL_TAO_TO_STAKE amount.")

if num_subnets is None:
    num_subnets = 3
else:
    try:
        num_subnets = int(num_subnets)
    except:
        sys.exit("❌ Invalid NUM_SUBNETS_TO_STAKE_IN.")

if validators_per_subnet is None:
    validators_per_subnet = 3
else:
    try:
        validators_per_subnet = int(validators_per_subnet)
    except:
        sys.exit("❌ Invalid NUM_VALIDATORS_PER_SUBNET.")

print(f"\n🔓 Using proxy wallet: {proxy_wallet_name}")
print(f"  Staking on behalf of: {real_account_ss58[:12]}...")
print(f"  Dividing {total_to_stake} TAO across top {validators_per_subnet} validators in each of top {num_subnets} subnets.")

proxy_wallet = bt.Wallet(proxy_wallet_name)

# Price protection settings
RATE_TOLERANCE = 0.02  # 2% price tolerance
ALLOW_PARTIAL = False  # Strict mode: reject if price exceeds tolerance

async def stake_via_proxy(subtensor, netuid, hotkey_ss58, amount_to_stake):
    """Stake to a single validator with price protection."""
    print(f"  Staking {amount_to_stake} to {hotkey_ss58} on subnet {netuid}...")
    try:
        # Fetch current subnet price to compute the limit price.
        # limit_price is the worst acceptable price (in RAO per alpha).
        # For staking, price goes up as you buy alpha, so the limit is above current price.
        pool = await subtensor.subnet(netuid=netuid)
        limit_price = bt.Balance.from_tao(pool.price.tao * (1 + RATE_TOLERANCE)).rao

        # Use add_stake_limit for price protection.
        # Note the `await`: with AsyncSubtensor, pallet helpers return awaitables.
        add_stake_call = await SubtensorModule(subtensor).add_stake_limit(
            netuid=netuid,
            hotkey=hotkey_ss58,
            amount_staked=amount_to_stake.rao,
            limit_price=limit_price,
            allow_partial=ALLOW_PARTIAL,
        )
        result = await subtensor.proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Staking,
            call=add_stake_call,
        )
        return result
    except Exception as e:
        print(f"❌ Failed to stake to {hotkey_ss58} on subnet {netuid}: {e}")
        return None

async def find_top_validators(subtensor, subnet):
    """Fetch metagraph and return top validators by stake. Read-only, safe to run concurrently."""
    netuid = subnet.netuid
    print(f"\n  Subnet {netuid} had {subnet.tao_in_emission} emissions!")
    print(f"\n  Fetching metagraph for subnet {netuid}...")

    start_time = time.time()
    metagraph = await subtensor.metagraph(netuid)

    print(f"✅ Retrieved metagraph for subnet {netuid} in {time.time() - start_time:.2f} seconds.")
    hk_stake_pairs = [(metagraph.hotkeys[index], metagraph.stake[index]) for index in range(len(metagraph.stake))]
    top_validators = sorted(hk_stake_pairs, key=lambda x: x[1], reverse=True)[0:validators_per_subnet]

    print(f"\n  Top {validators_per_subnet} Validators for Subnet {netuid}:")
    for rank, (hk, stake) in enumerate(top_validators, start=1):
        print(f"  {rank}. {hk} - Stake: {stake}")

    return {"netuid": netuid, "validators": top_validators}

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        print("Fetching information on top subnets by TAO emissions")

        sorted_subnets = sorted(list(await subtensor.all_subnets()), key=lambda subnet: subnet.tao_in_emission, reverse=True)
        top_subnets = sorted_subnets[0:num_subnets]
        amount_to_stake = bt.Balance.from_tao(total_to_stake / (num_subnets * validators_per_subnet))

        # Fetch metagraphs concurrently (read-only, no nonce needed)
        top_vali_dicts = await asyncio.gather(*[find_top_validators(subtensor, subnet) for subnet in top_subnets])
        top_validators_per_subnet = {}
        for d in top_vali_dicts:
            netuid = d['netuid']
            top_validators_per_subnet[netuid] = [hk for hk, _ in d['validators']]

        # Stake sequentially: each transaction must complete before the next
        # to avoid nonce collisions from the same signing key.
        start_time = time.time()
        for netuid, top_validators in top_validators_per_subnet.items():
            for hk in top_validators:
                result = await stake_via_proxy(subtensor, netuid, hk, amount_to_stake)
                print(result)
        print(f"Staking completed in {time.time() - start_time:.2f}s")

asyncio.run(main())
```

## Stake to top subnets and validators with a time-delay proxy

This is the same script as above, adapted to use a **time-delay proxy** for stronger security. The process is split into three separate steps with a mandatory human verification step between them:

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
import time
from bittensor import tao
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

# Load environment variables
proxy_wallet_name = os.environ.get('BT_PROXY_WALLET_NAME')
real_account_ss58 = os.environ.get('BT_REAL_ACCOUNT_SS58')
total_to_stake = os.environ.get('TOTAL_TAO_TO_STAKE')
num_subnets = os.environ.get('NUM_SUBNETS_TO_STAKE_IN')
validators_per_subnet = os.environ.get('NUM_VALIDATORS_PER_SUBNET')

if proxy_wallet_name is None:
    sys.exit("❌ BT_PROXY_WALLET_NAME not specified.")
if real_account_ss58 is None:
    sys.exit("❌ BT_REAL_ACCOUNT_SS58 not specified.")

if total_to_stake is None:
    print("⚠️ TOTAL_TAO_TO_STAKE not specified. Defaulting to 1 TAO.")
    total_to_stake = 1.0
else:
    try:
        total_to_stake = float(total_to_stake)
    except:
        sys.exit("❌ Invalid TOTAL_TAO_TO_STAKE amount.")

if num_subnets is None:
    num_subnets = 3
else:
    try:
        num_subnets = int(num_subnets)
    except:
        sys.exit("❌ Invalid NUM_SUBNETS_TO_STAKE_IN.")

if validators_per_subnet is None:
    validators_per_subnet = 3
else:
    try:
        validators_per_subnet = int(validators_per_subnet)
    except:
        sys.exit("❌ Invalid NUM_VALIDATORS_PER_SUBNET.")

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
    print(f"\n  Fetching metagraph for subnet {netuid}...")

    start_time = time.time()
    metagraph = await subtensor.metagraph(netuid)

    print(f"✅ Retrieved metagraph for subnet {netuid} in {time.time() - start_time:.2f} seconds.")
    hk_stake_pairs = [(metagraph.hotkeys[index], metagraph.stake[index]) for index in range(len(metagraph.stake))]
    top_validators = sorted(hk_stake_pairs, key=lambda x: x[1], reverse=True)[0:validators_per_subnet]

    print(f"\n  Top {validators_per_subnet} Validators for Subnet {netuid}:")
    for rank, (hk, stake) in enumerate(top_validators, start=1):
        print(f"  {rank}. {hk} - Stake: {stake}")

    return {"netuid": netuid, "validators": top_validators}

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        print("Fetching information on top subnets by TAO emissions")

        sorted_subnets = sorted(list(await subtensor.all_subnets()), key=lambda subnet: subnet.tao_in_emission, reverse=True)
        top_subnets = sorted_subnets[0:num_subnets]
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

        # Save announced call data to a file so Step 3 can rebuild the exact same calls.
        # The limit_price and amount_staked RAO values must be preserved exactly —
        # proxy_announced requires the full call (not just the hash), and the chain
        # re-hashes it to verify it matches. If any parameter differs, the hash won't match.
        save_data = [
            {
                "netuid": a["netuid"],
                "hotkey": a["hotkey"],
                "call_hash": a["call_hash"],
                "amount_staked_rao": a["amount_staked_rao"],
                "limit_price_rao": a["limit_price_rao"],
                "allow_partial": a["allow_partial"],
            }
            for a in announced
        ]
        with open("announced_stakes.json", "w") as f:
            json.dump(save_data, f, indent=2)
        print(f"\n   Saved announcement data to announced_stakes.json")

asyncio.run(main())
```
```shell
⚠️ TOTAL_TAO_TO_STAKE not specified. Defaulting to 1 TAO.

🔓 Using proxy wallet: zingo
  Staking on behalf of: 5ECaCSR1tEzc...
  Dividing 1.0 TAO across top 3 validators in each of top 3 subnets.
Fetching information on top subnets by TAO emissions

  Subnet 31 had τ0.043267221 emissions!

  Fetching metagraph for subnet 31...

  Subnet 119 had τ0.017303911 emissions!

  Fetching metagraph for subnet 119...

  Subnet 26 had τ0.014446833 emissions!

  Fetching metagraph for subnet 26...
✅ Retrieved metagraph for subnet 31 in 1.30 seconds.

  Top 3 Validators for Subnet 31:
  1. 5H9iGnmydhRKbVNtC6tDr9ZbbEhHAKUE5xuLWZ1wJWsUw49z - Stake: 1130.682861328125
  2. 5CAbcrX6dDoCLYZrXzNCU9csL8JctBxhi9oZcvtc8hqz5Pri - Stake: 695.8594970703125
  3. 5DM5o384xnjsohycyLxX9umWKybCJLVoSjwzYBZ8NUwy5zXj - Stake: 83.06707763671875
✅ Retrieved metagraph for subnet 26 in 1.34 seconds.

  Top 3 Validators for Subnet 26:
  1. 5FZijBVEXfmCqhJH8V6aXhSujVMMTPKGb76AiG4QfWVG6fvM - Stake: 2606.20849609375
  2. 5GYi8aRkGCqQH8YScK4yYDkfZx6DtLVz3G5WJigwwbennZz8 - Stake: 689.8923950195312
  3. 5DoRe6Zic5PUfnPUno3z8MngQEHvgqEMWhfFMEXB7wug9HsV - Stake: 106.76640319824219
✅ Retrieved metagraph for subnet 119 in 1.41 seconds.

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

During the delay window, run this script to cross-reference on-chain announcements against the `announced_stakes.json` file saved in Step 1. It will flag any announcement you didn't create — which would indicate your proxy key has been compromised — and confirm which of your expected announcements are present.

```python
import json
import bittensor as bt
import os

sub = bt.Subtensor(network="test")

delegate_ss58 = os.environ.get("BT_PROXY_WALLET_SS58", "YOUR_PROXY_WALLET_SS58")
real_account_ss58 = os.environ.get("BT_REAL_ACCOUNT_SS58", "YOUR_COLDKEY_SS58")
delay_blocks = 100

# Load the hashes we expect from Step 1
with open("announced_stakes.json") as f:
    expected = json.load(f)
expected_hashes = {a["call_hash"] for a in expected}

# Fetch proxy relationships to confirm setup
proxies, deposit = sub.get_proxies_for_real_account(real_account_ss58)
print(f"Proxy relationships for {real_account_ss58[:16]}...:")
for p in proxies:
    print(f"  {p}")

# Fetch pending announcements for our delegate (proxy) account
announcements = sub.get_proxy_announcement(delegate_ss58)
current_block = sub.block
on_chain_hashes = set()

print(f"\n{'='*60}")
print(f"PENDING ANNOUNCEMENTS (block {current_block})")
print(f"{'='*60}")

for ann in announcements:
    on_chain_hashes.add(ann.call_hash)
    blocks_elapsed = current_block - ann.height
    blocks_remaining = max(0, delay_blocks - blocks_elapsed)
    is_ours = ann.call_hash in expected_hashes
    status = "✅ EXPECTED" if is_ours else "🚨 UNEXPECTED — NOT IN announced_stakes.json"

    print(f"\n  call_hash:    {ann.call_hash}")
    print(f"  real:         {ann.real}")
    print(f"  announced:    block {ann.height} ({blocks_elapsed} blocks ago)")
    print(f"  veto window:  {blocks_remaining} blocks remaining ({blocks_remaining * 12}s)")
    print(f"  status:       {status}")

# Check for expected announcements that are missing on-chain
missing = expected_hashes - on_chain_hashes
unexpected = on_chain_hashes - expected_hashes

print(f"\n{'='*60}")
print(f"SUMMARY")
print(f"{'='*60}")
print(f"  Expected:    {len(expected_hashes)}")
print(f"  On-chain:    {len(on_chain_hashes)}")
print(f"  Matched:     {len(expected_hashes & on_chain_hashes)}")

if missing:
    print(f"\n⚠️  MISSING announcements (expected but not on-chain):")
    for h in missing:
        print(f"    {h}")

if unexpected:
    print(f"\n🚨 UNAUTHORIZED announcements detected!")
    print(f"   Your proxy key may be compromised. Reject these immediately")
    print(f"   and rotate your keys.")
    for h in unexpected:
        print(f"    {h}")
else:
    print(f"\n✅ All on-chain announcements match expected hashes. Safe to proceed to Step 3.")
```


If you see an **unexpected hash**, [reject it](../keys/proxies/working-with-proxies#reject-an-announcement) immediately:

```python
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import Proxy

nontransfer_proxy_wallet = bt.Wallet(name="YOUR_NONTRANSFER_PROXY")  # replace with your NonTransfer proxy wallet name
real_account_ss58 = "YOUR_REAL_ACCOUNT_SS58"  # replace with your real account SS58

reject_call = Proxy(sub).reject_announcement(
    delegate=delegate_ss58,
    call_hash="0xSUSPICIOUS_HASH_HERE",
)
response = sub.proxy(
    wallet=nontransfer_proxy_wallet,
    real_account_ss58=real_account_ss58,
    force_proxy_type=ProxyType.NonTransfer,
    call=reject_call,
)
print(response)
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
                delegate_ss58=proxy_wallet.coldkey.ss58_address,
                real_account_ss58=real_account_ss58,
                force_proxy_type=ProxyType.Staking,
                call=add_stake_call,
            )
            print(result)

asyncio.run(main())
```

## Unstake from a validator

Set up the required environment variables:

```python
import os

os.environ['BT_PROXY_WALLET_NAME'] = 'PROXY_WALLET'
os.environ['BT_REAL_ACCOUNT_SS58'] = 'YOUR_COLDKEY_SS58'
```

Unstake from a specific validator on a specific subnet with price protection. The `limit_price` for unstaking is computed as `price * (1 - tolerance)` since selling alpha pushes the price down — you're setting a floor on the worst price you'll accept:

```python
import asyncio
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule
import os

proxy_wallet = bt.Wallet(name=os.environ['BT_PROXY_WALLET_NAME'])
real_account_ss58 = os.environ['BT_REAL_ACCOUNT_SS58']

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        netuid = 17
        hotkey = "5FvC..."
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
            wait_for_inclusion=True,
            wait_for_finalization=False,
        )
        print(result)

asyncio.run(main())
```

:::tip Unsafe unstake (for development/testing)
To skip price protection (e.g. on testnet), use `remove_stake` instead of `remove_stake_limit`:

```python
remove_stake_call = await SubtensorModule(subtensor).remove_stake(
    netuid=netuid,
    hotkey=hotkey,
    amount_unstaked=amount.rao,
)
```
:::

## Unstake from low-emissions validators

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
import os, sys, asyncio, time
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

proxy_wallet_name = os.environ.get('BT_PROXY_WALLET_NAME')
real_account_ss58 = os.environ.get('BT_REAL_ACCOUNT_SS58')
total_to_unstake = os.environ.get('TOTAL_TAO_TO_UNSTAKE')
max_stakes_to_unstake = os.environ.get('MAX_STAKES_TO_UNSTAKE')

if proxy_wallet_name is None:
    sys.exit("BT_PROXY_WALLET_NAME not specified.")
if real_account_ss58 is None:
    sys.exit("BT_REAL_ACCOUNT_SS58 not specified.")

if total_to_unstake is None:
    print("Unstaking total not specified, defaulting to 1 TAO.")
    total_to_unstake = 1
else:
    try:
        total_to_unstake = float(total_to_unstake)
    except:
        sys.exit("invalid TAO amount!")

if max_stakes_to_unstake is None:
    max_stakes_to_unstake = 10
else:
    try:
        max_stakes_to_unstake = int(max_stakes_to_unstake)
    except:
        sys.exit("invalid number for MAX_STAKES_TO_UNSTAKE")

print(f"  Using proxy wallet: {proxy_wallet_name}")
print(f"  Unstaking on behalf of: {real_account_ss58[:12]}...")
print(f"  Unstaking a total of {total_to_unstake} TAO across up to {max_stakes_to_unstake} lowest-emission validators")

total_to_unstake = bt.Balance.from_tao(total_to_unstake)
proxy_wallet = bt.Wallet(proxy_wallet_name)
unstake_minimum = 0.0005  # TAO

# Price protection settings
RATE_TOLERANCE = 0.02  # 2%
ALLOW_PARTIAL = False  # Strict mode

async def perform_unstake(subtensor, stake, amount):
    try:
        print(f"⏳ Attempting to unstake {amount} from {stake.hotkey_ss58} on subnet {stake.netuid}")
        start = time.time()

        # Compute limit price for this subnet (price floor)
        pool = await subtensor.subnet(netuid=stake.netuid)
        limit_price = bt.Balance.from_tao(pool.price.tao * (1 - RATE_TOLERANCE)).rao

        remove_stake_call = await SubtensorModule(subtensor).remove_stake_limit(
            netuid=stake.netuid,
            hotkey=stake.hotkey_ss58,
            amount_unstaked=amount.rao,
            limit_price=limit_price,
            allow_partial=ALLOW_PARTIAL,
        )
        result = await subtensor.proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Staking,
            call=remove_stake_call,
        )
        elapsed = time.time() - start
        print(result)
        print(f"Time elapsed: {elapsed:.2f}s")
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

        stakes = list(filter(lambda s: float(s.stake.tao) > unstake_minimum, stakes))
        stakes = sorted(stakes, key=lambda s: s.emission.tao)
        stakes = stakes[:max_stakes_to_unstake]

        if not stakes:
            sys.exit("❌ No eligible stakes found to unstake.")

        print(f"\n  Preparing to unstake from {len(stakes)} validators:\n")
        for s in stakes:
            print(f"Validator: {s.hotkey_ss58}\n  NetUID: {s.netuid}\n  Stake: {s.stake.tao}\n  Emission: {s.emission}\n-----------")

        amount_per_stake = total_to_unstake.tao / len(stakes)

        # Unstake sequentially to avoid nonce collisions
        success_count = 0
        for stake in stakes:
            amount = bt.Balance.from_tao(min(amount_per_stake, stake.stake.tao)).set_unit(stake.netuid)
            success = await perform_unstake(subtensor, stake, amount)
            if success:
                success_count += 1
        print(f"\n  Unstake complete. Success: {success_count}/{len(stakes)}")

asyncio.run(main())
```

## Move stake

Move stake from one validator/subnet to another using a `Staking` proxy:

```python
import asyncio
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule
import os

proxy_wallet = bt.Wallet(name=os.environ['BT_PROXY_WALLET_NAME'])
real_account_ss58 = os.environ['BT_REAL_ACCOUNT_SS58']

async def main():
    async with bt.AsyncSubtensor("test") as subtensor:
        move_stake_call = await SubtensorModule(subtensor).move_stake(
            origin_netuid=5,
            origin_hotkey_ss58="5DyHnV9Wz6cnefGfczeBkQCzHZ5fJcVgy7x1eKVh8otMEd31",
            destination_netuid=18,
            destination_hotkey_ss58="5HidY9Danh9NhNPHL2pfrf97Zboew3v7yz4abuibZszcKEMv",
            alpha_amount=bt.Balance.from_tao(1.0).set_unit(5),
        )
        result = await subtensor.proxy(
            wallet=proxy_wallet,
            real_account_ss58=real_account_ss58,
            force_proxy_type=ProxyType.Staking,
            call=move_stake_call,
            wait_for_inclusion=True,
            wait_for_finalization=False,
        )
        print(result)

asyncio.run(main())
```
