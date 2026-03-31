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

The following script uses a `Staking` proxy to stake a user-defined amount of TAO across the top subnets and validators. The proxy coldkey signs all transactions; the primary coldkey SS58 address is supplied as a read-only reference.

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

async def stake_via_proxy(subtensor, netuid, hotkey_ss58, amount_to_stake):
    print(f"  Staking {amount_to_stake} to {hotkey_ss58} on subnet {netuid}...")
    try:
        add_stake_call = SubtensorModule(subtensor).add_stake(
            netuid=netuid,
            hotkey=hotkey_ss58,
            amount_staked=amount_to_stake.rao,
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

async def stake_batch(subtensor, netuid, top_validators, amount_to_stake):
    tasks = [stake_via_proxy(subtensor, netuid, hk, amount_to_stake) for hk in top_validators]
    results = await asyncio.gather(*tasks)
    print(results)

async def find_top_validators(subtensor, subnet):
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

        top_vali_dicts = await asyncio.gather(*[find_top_validators(subtensor, subnet) for subnet in top_subnets])
        top_validators_per_subnet = {}
        for d in top_vali_dicts:
            netuid = d['netuid']
            top_validators_per_subnet[netuid] = [hk for hk, _ in d['validators']]

        start_time = time.time()
        await asyncio.gather(*[stake_batch(subtensor, netuid, top_validators, amount_to_stake) for netuid, top_validators in top_validators_per_subnet.items()])
        print(f"Staking completed in {time.time() - start_time:.2f}s")

asyncio.run(main())
```

```shell
🔓 Using proxy wallet: zingo
  Staking on behalf of: 5ECaCSR1tEzc...
  Dividing 10.0 TAO across top 3 validators in each of top 3 subnets.
Fetching information on top subnets by TAO emissions

  Subnet 119 had τ0.017297815 emissions!

  Fetching metagraph for subnet 119...

  Subnet 13 had τ0.011085027 emissions!

  Fetching metagraph for subnet 13...

  Subnet 353 had τ0.006091625 emissions!

  Fetching metagraph for subnet 353...
✅ Retrieved metagraph for subnet 353 in 1.24 seconds.

  Top 3 Validators for Subnet 353:
  1. 5CFZ9xDaFQVLA9ERsTs9S3i6jp1VDydvjQH5RDsyWCCJkTM4 - Stake: 249972.03125
  2. 5E7NahRhasrbzdiy9ET9Uau8jBPWisvYzZNbrEmf2kCsnYqN - Stake: 574.5496826171875
  3. 5Gb9UGDCMandeYerV3okgQVwcvovS5ZNnmnKuQ1zmJqD3vqT - Stake: 0.0
✅ Retrieved metagraph for subnet 119 in 1.36 seconds.

  Top 3 Validators for Subnet 119:
  1. 5FRxKzKrBDX3cCGqXFjYb6zCNC7GMTEaam1FWtsE8Nbr1EQJ - Stake: 990945.875
  2. 5FCPTnjevGqAuTttetBy4a24Ej3pH9fiQ8fmvP1ZkrVsLUoT - Stake: 489277.59375
  3. 5Ckdcm5X2EMe8q3V5EH3A6bhNpUEd8ZM61dwfxECjuJLfMUV - Stake: 296578.34375
✅ Retrieved metagraph for subnet 13 in 1.41 seconds.

  Top 3 Validators for Subnet 13:
  1. 5EnSc8m4n79NetfJZ4w7c7bxT3CA8XdgAKUJqBLnu6yyFvAr - Stake: 1168657.375
  2. 5DcQrTd45LGT88WR3tBRqgyDxFJ73SQ2ULfUqNcrMNez2Vtx - Stake: 1080121.5
  3. 5Ckdcm5X2EMe8q3V5EH3A6bhNpUEd8ZM61dwfxECjuJLfMUV - Stake: 320195.09375
  Staking τ1.111111111 to 5FRxKzKrBDX3cCGqXFjYb6zCNC7GMTEaam1FWtsE8Nbr1EQJ on subnet 119...
Enter your password:
Decrypting...
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: proxy_extrinsic
    extrinsic: {'account_id': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'signature': {'Sr25519': '0x284c140823f5d70b04e92ccf9f7ed7560e38f1c6a4496f4474ec8a3a63e0a338742135f906359e673571b91b53854a716032e5528eeb6f4a1179f74e8ee56884'}, 'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5FRxKzKrBDX3cCGqXFjYb6zCNC7GMTEaam1FWtsE8Nbr1EQJ', 'netuid': 119, 'amount_staked': 1111111111}})>}, 'nonce': 33, 'era': {'period': 128, 'current': 6800798}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'call': {'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5FRxKzKrBDX3cCGqXFjYb6zCNC7GMTEaam1FWtsE8Nbr1EQJ', 'netuid': 119, 'amount_staked': 1111111111}})>}}}
    extrinsic_fee: τ0.001447515
    extrinsic_receipt: ExtrinsicReceipt<hash:0x8d3f7370f9a2bfc81e18018ebd41c9b03768f95954b4936cf5a7836b0b6710f6>

    mev_extrinsic: None
    transaction_tao_fee: None
    transaction_alpha_fee: None
    error: None
    data: None

  Staking τ1.111111111 to 5FCPTnjevGqAuTttetBy4a24Ej3pH9fiQ8fmvP1ZkrVsLUoT on subnet 119...
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: proxy_extrinsic
    extrinsic: {'account_id': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'signature': {'Sr25519': '0x2083f26dfb3fc05eb434a98d0de971978e35e6667d14ae5444edfd802d2997516088f58c5a141d0ef31189328823729dcefca788150a33c9f397c2ebdc7e8b86'}, 'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5FCPTnjevGqAuTttetBy4a24Ej3pH9fiQ8fmvP1ZkrVsLUoT', 'netuid': 119, 'amount_staked': 1111111111}})>}, 'nonce': 34, 'era': {'period': 128, 'current': 6800802}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'call': {'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5FCPTnjevGqAuTttetBy4a24Ej3pH9fiQ8fmvP1ZkrVsLUoT', 'netuid': 119, 'amount_staked': 1111111111}})>}}}
    extrinsic_fee: τ0.001447515
    extrinsic_receipt: ExtrinsicReceipt<hash:0xd23a02136c8c5202a8ec3cffa3d0d653675f019b28671c27ef519638683e87a5>

    mev_extrinsic: None
    transaction_tao_fee: None
    transaction_alpha_fee: None
    error: None
    data: None

  Staking τ1.111111111 to 5Ckdcm5X2EMe8q3V5EH3A6bhNpUEd8ZM61dwfxECjuJLfMUV on subnet 119...
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: proxy_extrinsic
    extrinsic: {'account_id': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'signature': {'Sr25519': '0x3eaa81e8ee37e91767029aa967264545671c8fe0143dc047f502b7927e9f862e67c95f56ec25ee2f369ed5f232d340372d38846d354f9c5953e9daa6ffe5dd89'}, 'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5Ckdcm5X2EMe8q3V5EH3A6bhNpUEd8ZM61dwfxECjuJLfMUV', 'netuid': 119, 'amount_staked': 1111111111}})>}, 'nonce': 35, 'era': {'period': 128, 'current': 6800804}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'call': {'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5Ckdcm5X2EMe8q3V5EH3A6bhNpUEd8ZM61dwfxECjuJLfMUV', 'netuid': 119, 'amount_staked': 1111111111}})>}}}
    extrinsic_fee: τ0.001447515
    extrinsic_receipt: ExtrinsicReceipt<hash:0x3632ee897d1f3f977ac00635112943e710f1abf634e5a89270ff500cbb275dc8>

    mev_extrinsic: None
    transaction_tao_fee: None
    transaction_alpha_fee: None
    error: None
    data: None

  Staking τ1.111111111 to 5EnSc8m4n79NetfJZ4w7c7bxT3CA8XdgAKUJqBLnu6yyFvAr on subnet 13...
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: proxy_extrinsic
    extrinsic: {'account_id': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'signature': {'Sr25519': '0xdecfc77cdcaf0736263bbbf3a4cd90a04f68c59ff765458087a67eae203f734bd89c1fd01e112a2a286bd24197473249c74f58073d92ec37a3e29d22a7d3a481'}, 'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5EnSc8m4n79NetfJZ4w7c7bxT3CA8XdgAKUJqBLnu6yyFvAr', 'netuid': 13, 'amount_staked': 1111111111}})>}, 'nonce': 36, 'era': {'period': 128, 'current': 6800808}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'call': {'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5EnSc8m4n79NetfJZ4w7c7bxT3CA8XdgAKUJqBLnu6yyFvAr', 'netuid': 13, 'amount_staked': 1111111111}})>}}}
    extrinsic_fee: τ0.001447515
    extrinsic_receipt: ExtrinsicReceipt<hash:0x9f18e06a3b9d0bd09e0af239ca39d3b77fb1afae93e8b3be4bab0361faf67dc7>

    mev_extrinsic: None
    transaction_tao_fee: None
    transaction_alpha_fee: None
    error: None
    data: None

  Staking τ1.111111111 to 5DcQrTd45LGT88WR3tBRqgyDxFJ73SQ2ULfUqNcrMNez2Vtx on subnet 13...
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: proxy_extrinsic
    extrinsic: {'account_id': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'signature': {'Sr25519': '0xde501cc5bdad357689b77ea9159add53a700db4d75d7e12e60622351de1538640527eb0860f3d124e0fa5ee186b8c60707efc1ecc4cfc5f4be79943a3da58d84'}, 'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5DcQrTd45LGT88WR3tBRqgyDxFJ73SQ2ULfUqNcrMNez2Vtx', 'netuid': 13, 'amount_staked': 1111111111}})>}, 'nonce': 37, 'era': {'period': 128, 'current': 6800810}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'call': {'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5DcQrTd45LGT88WR3tBRqgyDxFJ73SQ2ULfUqNcrMNez2Vtx', 'netuid': 13, 'amount_staked': 1111111111}})>}}}
    extrinsic_fee: τ0.001447515
    extrinsic_receipt: ExtrinsicReceipt<hash:0x3cc778716050735fa9387a0f57ae4d79d95c1be20f67769b1c196280b890d983>

    mev_extrinsic: None
    transaction_tao_fee: None
    transaction_alpha_fee: None
    error: None
    data: None

  Staking τ1.111111111 to 5Ckdcm5X2EMe8q3V5EH3A6bhNpUEd8ZM61dwfxECjuJLfMUV on subnet 13...
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: proxy_extrinsic
    extrinsic: {'account_id': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'signature': {'Sr25519': '0x80f64a110b4aeee41b5efbaf8a6ccff4704302f01dcef725d63cdc02865fd0126642e09c568f83eab15953d3e1737983496398bcf3da223ae8c5ba7e166fb585'}, 'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5Ckdcm5X2EMe8q3V5EH3A6bhNpUEd8ZM61dwfxECjuJLfMUV', 'netuid': 13, 'amount_staked': 1111111111}})>}, 'nonce': 38, 'era': {'period': 128, 'current': 6800814}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'call': {'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5Ckdcm5X2EMe8q3V5EH3A6bhNpUEd8ZM61dwfxECjuJLfMUV', 'netuid': 13, 'amount_staked': 1111111111}})>}}}
    extrinsic_fee: τ0.001447515
    extrinsic_receipt: ExtrinsicReceipt<hash:0xa277eec29bed42d5442a11e450697ea373cc2f2aeb533ca57d2f91beecde46b9>

    mev_extrinsic: None
    transaction_tao_fee: None
    transaction_alpha_fee: None
    error: None
    data: None

  Staking τ1.111111111 to 5CFZ9xDaFQVLA9ERsTs9S3i6jp1VDydvjQH5RDsyWCCJkTM4 on subnet 353...
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: proxy_extrinsic
    extrinsic: {'account_id': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'signature': {'Sr25519': '0x1c92ece8ea85faf0e5ad5aae55f7a104a9ad25f653cc8a260cc0fdc9503b7d0bc7528f310195980379882e892039c313a0e3426e2cf5074ff6bef2f98d7c1d84'}, 'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5CFZ9xDaFQVLA9ERsTs9S3i6jp1VDydvjQH5RDsyWCCJkTM4', 'netuid': 353, 'amount_staked': 1111111111}})>}, 'nonce': 39, 'era': {'period': 128, 'current': 6800817}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'call': {'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5CFZ9xDaFQVLA9ERsTs9S3i6jp1VDydvjQH5RDsyWCCJkTM4', 'netuid': 353, 'amount_staked': 1111111111}})>}}}
    extrinsic_fee: τ0.001447515
    extrinsic_receipt: ExtrinsicReceipt<hash:0x2286eee64fa36db43a0946b60d80dbf0e8cd72065d21513eb26e655a781cd379>

    mev_extrinsic: None
    transaction_tao_fee: None
    transaction_alpha_fee: None
    error: None
    data: None

  Staking τ1.111111111 to 5E7NahRhasrbzdiy9ET9Uau8jBPWisvYzZNbrEmf2kCsnYqN on subnet 353...
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: proxy_extrinsic
    extrinsic: {'account_id': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'signature': {'Sr25519': '0xf6caf107f69848b05d89dd3aa6c259ba2d2f7b1291c674092c33beee947a466682ef737ed1161dc59d4536ff244f623a9dfb375673bb94cb822754ac27179089'}, 'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5E7NahRhasrbzdiy9ET9Uau8jBPWisvYzZNbrEmf2kCsnYqN', 'netuid': 353, 'amount_staked': 1111111111}})>}, 'nonce': 40, 'era': {'period': 128, 'current': 6800819}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'call': {'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5E7NahRhasrbzdiy9ET9Uau8jBPWisvYzZNbrEmf2kCsnYqN', 'netuid': 353, 'amount_staked': 1111111111}})>}}}
    extrinsic_fee: τ0.001447515
    extrinsic_receipt: ExtrinsicReceipt<hash:0x6a34c510537039ce1250481d2286f5250e7bd915c8be14c717ced8a097dc51eb>

    mev_extrinsic: None
    transaction_tao_fee: None
    transaction_alpha_fee: None
    error: None
    data: None

  Staking τ1.111111111 to 5Gb9UGDCMandeYerV3okgQVwcvovS5ZNnmnKuQ1zmJqD3vqT on subnet 353...
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: proxy_extrinsic
    extrinsic: {'account_id': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'signature': {'Sr25519': '0x72d78aaa8e8007a373f9dcda04cdc2d50a6db0ca21d65307cbc399660ce7b029507cac24949c020168b8ea202436b94cee3042c3f09a6327e6c07d759b946185'}, 'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5Gb9UGDCMandeYerV3okgQVwcvovS5ZNnmnKuQ1zmJqD3vqT', 'netuid': 353, 'amount_staked': 1111111111}})>}, 'nonce': 41, 'era': {'period': 128, 'current': 6800823}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0x8239a0d104d34d835eb44217a0383e4af12a06782833da8f4c5bd734a6bed239', 'call': {'call_function': 'proxy', 'call_module': 'Proxy', 'call_args': {'real': '5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b', 'force_proxy_type': 'Staking', 'call': <GenericCall(value={'call_module': 'SubtensorModule', 'call_function': 'add_stake', 'call_args': {'hotkey': '5Gb9UGDCMandeYerV3okgQVwcvovS5ZNnmnKuQ1zmJqD3vqT', 'netuid': 353, 'amount_staked': 1111111111}})>}}}
    extrinsic_fee: τ0.001447515
    extrinsic_receipt: ExtrinsicReceipt<hash:0xf6fad2ee153defb2bd19759c2852e8369708f37b169ce9518c0bc234ea488bbf>

    mev_extrinsic: None
    transaction_tao_fee: None
    transaction_alpha_fee: None
    error: None
    data: None

Staking completed in 332.55s
```
## Unstake from a validator

Set up the required environment variables:

```python
import os

os.environ['BT_PROXY_WALLET_NAME'] = 'PROXY_WALLET'
os.environ['BT_REAL_ACCOUNT_SS58'] = 'YOUR_COLDKEY_SS58'
```

Basic unstake from a specific validator on a specific subnet. `amount` specifies the amount of alpha to unstake:

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
        remove_stake_call = SubtensorModule(subtensor).remove_stake(
            netuid=17,
            hotkey="5FvC...",
            amount_unstaked=bt.Balance.from_tao(10).rao,
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

async def perform_unstake(subtensor, stake, amount):
    try:
        print(f"⏳ Attempting to unstake {amount} from {stake.hotkey_ss58} on subnet {stake.netuid}")
        start = time.time()
        remove_stake_call = SubtensorModule(subtensor).remove_stake(
            netuid=stake.netuid,
            hotkey=stake.hotkey_ss58,
            amount_unstaked=amount.rao,
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
        tasks = [
            perform_unstake(subtensor, stake, bt.Balance.from_tao(min(amount_per_stake, stake.stake.tao)).set_unit(stake.netuid))
            for stake in stakes
        ]
        results = await asyncio.gather(*tasks)
        success_count = sum(results)
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
        move_stake_call = SubtensorModule(subtensor).move_stake(
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
