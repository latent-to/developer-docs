---
title: "Staking with a Proxy"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { SdkVersion } from "../../sdk/_sdk-version.mdx";

# Staking with a Proxy

This guide demonstrates how to use proxy accounts to perform staking operations on the Bittensor network. Using a proxy for staking allows you to keep your high-value coldkey secure in cold storage while using a hot wallet to manage day-to-day staking operations.

See also:

- [Proxies: Overview](../../keys/proxies/): Learn about proxy types and how proxies work
- [Working with Proxies](working-with-proxies): Create and manage standard proxies
- [Managing Stake with SDK](../../staking-and-delegation/managing-stake-sdk): General staking operations with the Python SDK
- [Managing Stake with BTCLI](../../staking-and-delegation/managing-stake-btcli): General staking operations with the CLI
- [Working with Blockchain Calls](../../sdk/call): Advanced guide to GenericCall and CallBuilder for composing blockchain transactions


## Overview

A staking proxy is a specialized proxy type that grants limited permissions specifically for staking-related operations. The `Staking` proxy type allows the delegate to:

- Add stake to validator hotkeys
- Remove stake from validator hotkeys
- Unstake tokens
- Move stake between validators and subnets
- Swap stake between validators

The `Staking` proxy type **does not** allow transfers, registrations, or other non-staking operations, providing a secure way to delegate only staking responsibilities.

:::tip Why use a staking proxy?
Using a staking proxy lets you keep your coldkey offline for maximum security while still being able to actively manage your staking positions. This is particularly useful for:
- Validators who need to adjust stake frequently
- Delegators who want to rebalance their stake distribution
- Users who want operational flexibility without exposing their coldkey
:::

## Prerequisites

Before setting up a staking proxy, ensure you have:

- **Coldkey wallet**: Your main account that holds TAO and will authorize the proxy relationship
- **Proxy wallet**: A separate wallet that will act as the delegate and perform staking operations
- **Sufficient TAO balance**: In the coldkey to cover:
  - Staking operations
  - Proxy deposit (refundable when the proxy is removed)
  - Transaction fees

## Create a Staking Proxy

First, establish the proxy relationship by authorizing the proxy wallet to perform staking operations on behalf of your coldkey. You'll need to enter the password for each wallet.

<Tabs groupId="staking-proxy">
<TabItem value="btcli" label="BTCLI">

```bash
btcli proxy add \
  --wallet.name PracticeKey \
  --delegate PROXY_WALLET_SS58_ADDRESS \
  --proxy-type Staking \
  --delay 0
```

**Example with actual address:**
```bash
btcli proxy add \
  --wallet.name my_coldkey \
  --delegate 5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe \
  --proxy-type Staking \
  --delay 0
```

After creating the proxy, you'll be prompted to save it to your address book for easy reference:

```bash
# Save to address book when prompted, or manually:
btcli config add-proxy \
  --name staking-proxy \
  --address 5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe \
  --proxy-type Staking \
  --spawner YOUR_COLDKEY_ADDRESS \
  --delay 0
```

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

<SdkVersion />

```python
import bittensor
from bittensor.core.chain_data.proxy import ProxyType

# Initialize connection to the network
subtensor = bittensor.Subtensor('test')

# Load your coldkey (main account that holds the TAO)
coldkey_wallet = bittensor.Wallet(name="PracticeKey!")

# Load your proxy wallet (delegate that will perform operations)
proxy_wallet = bittensor.Wallet(name="PracticeProxy")

# Create the staking proxy relationship
response = subtensor.add_proxy(
    wallet=coldkey_wallet,                      # Signs this transaction (authorizes the proxy)
    delegate_ss58=proxy_wallet.coldkey.ss58_address,  # The proxy wallet address
    proxy_type=ProxyType.Staking,               # Grant only staking permissions
    delay=0,                                    # No delay (immediate execution)
)

print(response)
```

</TabItem>
</Tabs>

Example output:
```console
Enter your password:
Decrypting...
Enter your password:
Decrypting...
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: add_proxy_extrinsic
    extrinsic: {'account_id': '0xb0fec20486c9cf366c90bf1c93ad1bbc6b50596653f8832ee6c40483aa73d851', 'signature': {'Sr25519': '0xb06d00647f20259df5e6e67ac78dd4cc96710176b798b605794890521868a122b8cc434f6d8841204de9cbedecaaedd84d0444ae1b644cb217629b0be3f7958c'}, 'call_function': 'add_proxy', 'call_module': 'Proxy', 'call_args': {'delegate': '5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe', 'proxy_type': 'Staking', 'delay': 0}, 'nonce': 653, 'era': {'period': 128, 'current': 5910360}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0xb0fec20486c9cf366c90bf1c93ad1bbc6b50596653f8832ee6c40483aa73d851', 'call': {'call_function': 'add_proxy', 'call_module': 'Proxy', 'call_args': {'delegate': '5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe', 'proxy_type': 'Staking', 'delay': 0}}}
    extrinsic_fee: τ0.000013270
    extrinsic_receipt: ExtrinsicReceipt<hash:0xcd5ded2dfc505152870610233532646f6ebdd930793fa82f999d9bda2b79c2b5>
    transaction_tao_fee: None
    transaction_alpha_fee: None
    data: None
    error: None
```

:::info Proxy deposit
Creating a proxy requires a deposit that is held as long as the proxy relationship exists. This deposit is returned when you remove the proxy. You can check current deposit requirements using `subtensor.get_proxy_constants()`.
:::

## Transfer TAO to Proxy Wallet

After creating the proxy relationship, transfer a small amount of TAO to the proxy wallet to cover transaction fees. The proxy wallet needs funds to sign and submit transactions on behalf of the coldkey:

<Tabs groupId="staking-proxy">
<TabItem value="btcli" label="BTCLI">

```bash
btcli wallet transfer \
  --wallet.name my_coldkey \
  --dest PROXY_WALLET_SS58_ADDRESS \
  --amount 1.0
```

**Example:**
```bash
btcli wallet transfer \
  --wallet.name PracticeKey \
  --dest 5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe \
  --amount 1.0
```

This transfers 1 TAO to the proxy wallet to cover transaction fees for future staking operations.

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor

# Initialize connection to the network
subtensor = bittensor.Subtensor('test')

# Load your main coldkey wallet
coldkey_wallet = bittensor.Wallet(name="PracticeKey!")

# Load the proxy wallet (to get its address)
proxy = bittensor.Wallet(name='PracticeProxy')

# Transfer TAO to the proxy wallet
# This covers transaction fees for proxy operations
response = subtensor.transfer(
    wallet=coldkey_wallet,                            # Sending from coldkey
    destination_ss58=proxy.coldkey.ss58_address,      # Sending to proxy wallet
    amount=bittensor.Balance.from_tao(1),             # Transfer 1 TAO for fees
    wait_for_inclusion=True,
    wait_for_finalization=False,
)

print(response)
```

</TabItem>
</Tabs>

## Verify the Proxy

Before performing staking operations, verify that the proxy relationship was created successfully:

<Tabs groupId="staking-proxy">
<TabItem value="btcli" label="BTCLI">

View your locally saved proxies:

```bash
btcli config proxies
```

This displays all proxies you've saved to your local address book.

:::info On-chain verification
BTCLI does not currently provide a command to query on-chain proxy state directly. To verify the on-chain proxy relationship, use the SDK's `get_proxies_for_real_account()` method or query via Polkadot.js Apps (**Developer** → **Chain state** → **proxy.proxies**).
:::

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor

# Your coldkey SS58 address
real_account_ss58 = '5XyZ123...'  # Your coldkey SS58 address

subtensor = bittensor.Subtensor('test')

# Get all proxies for your coldkey
proxies, deposit = subtensor.get_proxies_for_real_account(
    real_account_ss58=real_account_ss58
)

if proxies:
    print(f"✓ Found {len(proxies)} proxy relationship(s):")
    for proxy in proxies:
        print(f"\n  Delegate: {proxy.delegate}")
        print(f"  Type: {proxy.proxy_type}")
        print(f"  Delay: {proxy.delay} blocks")
    print(f"\nTotal deposit held: {deposit} RAO")
else:
    print("✗ No proxies found for this account")
```

</TabItem>
</Tabs>

Example output:
```console
✓ Found 1 proxy relationship(s):

  Delegate: 5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe
  Type: Staking
  Delay: 0 blocks

Total deposit held: τ0.093000000 RAO
```

## Find Validators to Stake To

Before staking, query the metagraph to find validators with the most stake. We'll find validators on subnet 0 (root network) and subnet 14:

<Tabs groupId="staking-proxy">
<TabItem value="btcli" label="BTCLI">

View the metagraph for a subnet to find validators:

```bash
# View subnet 0 (root network) metagraph
btcli subnets metagraph --netuid 0

# View subnet 14 metagraph
btcli subnets metagraph --netuid 14
```

This displays a table showing all validators on the subnet, including their hotkeys, stake amounts, and other metrics. Look for validators with high stake amounts to delegate to.

You can also use the wallet overview to see validators you're already staking to:

```bash
btcli wallet overview --wallet.name my_coldkey
```

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor

# Initialize connection to the network
subtensor = bittensor.Subtensor('test')

# Get metagraph for subnet 0 (root network)
metagraph_subnet0 = subtensor.metagraph(netuid=0)

# Find validator with most stake on subnet 0
max_stake_idx = metagraph_subnet0.S.argmax()
subnet0_validator = metagraph_subnet0.hotkeys[max_stake_idx]
subnet0_stake = metagraph_subnet0.S[max_stake_idx]

print(f"Subnet 0 - Top validator: {subnet0_validator}")
print(f"Subnet 0 - Current stake: {subnet0_stake} TAO")

# Get metagraph for subnet 14
metagraph_subnet14 = subtensor.metagraph(netuid=14)

# Find validator with most stake on subnet 14
max_stake_idx_14 = metagraph_subnet14.S.argmax()
subnet14_validator = metagraph_subnet14.hotkeys[max_stake_idx_14]
subnet14_stake = metagraph_subnet14.S[max_stake_idx_14]

print(f"\nSubnet 14 - Top validator: {subnet14_validator}")
print(f"Subnet 14 - Current stake: {subnet14_stake} TAO")
```

</TabItem>
</Tabs>

Example output:

```console
Subnet 0 - Top validator: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
Subnet 0 - Current stake: 125000.5 TAO

Subnet 14 - Top validator: 5HEo565WAy4Dbq3Sv271SAi7syBSofyfhhwRNjFNSM2gP9M2
Subnet 14 - Current stake: 89432.3 TAO
```

:::tip Metagraph Properties
- **`S`**: Stake tensor - contains the stake amounts for all neurons in the subnet
- **`hotkeys`**: List of hotkey addresses for all neurons in the subnet
- **`argmax()`**: Returns the index of the neuron with the maximum stake
:::

## Add Stake with Proxy

Add stake to a validator on behalf of your coldkey using the proxy wallet. We'll stake to the top validator on subnet 0 that we found in the previous step:

<Tabs groupId="staking-proxy">
<TabItem value="btcli" label="BTCLI">

```bash
btcli stake add \
  --wallet.name proxy_wallet \
  --proxy COLDKEY_SS58_ADDRESS \
  --netuid 0 \
  --hotkey VALIDATOR_HOTKEY \
  --amount 100.0
```

**Example using saved proxy:**
```bash
# Using proxy address directly
btcli stake add \
  --wallet.name PracticeProxy \
  --proxy 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY \
  --netuid 0 \
  --hotkey 5HEo565WAy4Dbq3Sv271SAi7syBSofyfhhwRNjFNSM2gP9M2 \
  --amount 100.0

# Or using saved proxy name from address book
btcli stake add \
  --wallet.name PracticeProxy \
  --proxy my-coldkey \
  --netuid 0 \
  --hotkey 5HEo565WAy4Dbq3Sv271SAi7syBSofyfhhwRNjFNSM2gP9M2 \
  --amount 100.0
```

**Parameters:**
- `--wallet.name`: The proxy wallet that signs the transaction
- `--proxy`: Your coldkey's SS58 address (or saved proxy name)
- `--netuid`: The subnet ID (0 for root network)
- `--hotkey`: The validator's hotkey address
- `--amount`: Amount of TAO to stake

The stake will be added from your coldkey's balance to the specified validator.

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

# Your coldkey SS58 address (no private key needed)
real_account_ss58 = '5XyZ123...'  # Your coldkey SS58 address

# Initialize connection to the network
subtensor = bittensor.Subtensor('test')

# Load proxy wallet
proxy = bittensor.Wallet(name='PracticeProxy')

# Use the top validator from subnet 0 (from previous step)
subnet0_validator = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

# Create the add_stake call using SubtensorModule
add_stake_call = SubtensorModule(subtensor).add_stake(
    netuid=0,                                          # Subnet to stake on (0 = root network)
    hotkey=subnet0_validator,                          # Validator hotkey (top validator on subnet 0)
    amount_staked=bittensor.Balance.from_tao(100).rao, # Amount to stake (in RAO)
)

# Execute the call through the proxy
response = subtensor.proxy(
    wallet=proxy,                                      # Proxy wallet signs the transaction
    real_account_ss58=real_account_ss58,               # Real account (coldkey) being proxied
    force_proxy_type=ProxyType.Staking,                # Must match the proxy relationship
    call=add_stake_call,
)

print(response)
```

</TabItem>
</Tabs>

**Parameters**:
- **`netuid`**: The subnet ID where you want to stake (0 = root network in this example)
- **`hotkey`**: The validator hotkey to stake to (subnet 0 top validator from metagraph)
- **`amount_staked`**: The amount to stake in RAO, use `Balance.from_tao(amount).rao` to convert
- **`force_proxy_type`**: Must match the proxy type that was set when creating the proxy relationship


Verify the stake was added:

<Tabs groupId="staking-proxy">
<TabItem value="btcli" label="BTCLI">

```bash
# View overview of all your stakes
btcli wallet overview --wallet.name my_coldkey

# Or list stakes specifically
btcli stake list --wallet.name my_coldkey
```

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor

# Your coldkey SS58 address
real_account_ss58 = '5XyZ123...'  # Your coldkey SS58 address

subtensor = bittensor.Subtensor('test')

# Get all stake for your coldkey
stake_info = subtensor.get_stake_info_for_coldkey(
    coldkey_ss58=real_account_ss58
)

for stake in stake_info:
    print(f"Subnet {stake.netuid}: {stake.stake} TAO staked to {stake.hotkey_ss58}")
```

</TabItem>
</Tabs>

## Move Stake with Proxy

Move stake between subnets using the proxy. We'll move stake from subnet 0 to subnet 14, using the top validators we found earlier:

<Tabs groupId="staking-proxy">
<TabItem value="btcli" label="BTCLI">

```bash
btcli stake move \
  --wallet.name proxy_wallet \
  --proxy COLDKEY_SS58_ADDRESS \
  --origin-netuid 0 \
  --origin-hotkey SUBNET0_VALIDATOR \
  --dest-netuid 14 \
  --dest-hotkey SUBNET14_VALIDATOR \
  --amount 50.0
```

**Example:**
```bash
btcli stake move \
  --wallet.name PracticeProxy \
  --proxy my-coldkey \
  --origin-netuid 0 \
  --origin-hotkey 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY \
  --dest-netuid 14 \
  --dest-hotkey 5HEo565WAy4Dbq3Sv271SAi7syBSofyfhhwRNjFNSM2gP9M2 \
  --amount 50.0
```

**Parameters:**
- `--wallet.name`: The proxy wallet that signs the transaction
- `--proxy`: Your coldkey's SS58 address (or saved proxy name)
- `--origin-netuid`: Source subnet ID
- `--origin-hotkey`: Source validator hotkey
- `--dest-netuid`: Destination subnet ID
- `--dest-hotkey`: Destination validator hotkey
- `--amount`: Amount of TAO to move

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

# Your coldkey SS58 address (no private key needed)
real_account_ss58 = '5XyZ123...'  # Your coldkey SS58 address

# Initialize connection to the network
subtensor = bittensor.Subtensor('test')

# Load proxy wallet
proxy = bittensor.Wallet(name='PracticeProxy')

# Get the top validators from each subnet (from previous step)
subnet0_validator = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
subnet14_validator = '5HEo565WAy4Dbq3Sv271SAi7syBSofyfhhwRNjFNSM2gP9M2'

# Create the move_stake call using SubtensorModule
move_stake_call = SubtensorModule(subtensor).move_stake(
    origin_netuid=0,                                   # Source subnet (0 = root network)
    origin_hotkey_ss58=subnet0_validator,              # Source validator hotkey
    destination_netuid=14,                             # Destination subnet (subnet 14)
    destination_hotkey_ss58=subnet14_validator,        # Destination validator hotkey
    alpha_amount=bittensor.Balance.from_tao(50),       # Amount to move (in TAO)
)

# Execute the call through the proxy
response = subtensor.proxy(
    wallet=proxy,                                      # Proxy wallet signs the transaction
    real_account_ss58=real_account_ss58,               # Real account (coldkey) being proxied
    force_proxy_type=ProxyType.Staking,                # Must match the proxy relationship
    call=move_stake_call,
)

print(response)
```

</TabItem>
</Tabs>

**Parameters**:
- **`origin_netuid`**: The subnet ID where the stake is currently located (0 = root network in this example)
- **`origin_hotkey_ss58`**: The validator hotkey where the stake is currently staked (subnet 0 top validator)
- **`destination_netuid`**: The subnet ID where you want to move the stake (14 in this example)
- **`destination_hotkey_ss58`**: The validator hotkey where you want to stake (subnet 14 top validator)
- **`alpha_amount`**: The amount of stake to move, use `Balance.from_tao(amount)` (Balance object is automatically converted)
- **`force_proxy_type`**: Must match the proxy type that was set when creating the proxy relationship


Verify the stake was moved:

<Tabs groupId="staking-proxy">
<TabItem value="btcli" label="BTCLI">

```bash
btcli wallet overview --wallet.name my_coldkey
```

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor

# Your coldkey SS58 address
real_account_ss58 = '5XyZ123...'  # Your coldkey SS58 address

subtensor = bittensor.Subtensor('test')

# Get all stake for your coldkey
stake_info = subtensor.get_stake_info_for_coldkey(
    coldkey_ss58=real_account_ss58
)

for stake in stake_info:
    print(f"Subnet {stake.netuid}: {stake.stake} TAO staked to {stake.hotkey_ss58}")
```

</TabItem>
</Tabs>

## Remove Stake with Proxy

Remove stake from a validator on behalf of your coldkey using the proxy wallet. We'll unstake from the subnet 14 validator:

<Tabs groupId="staking-proxy">
<TabItem value="btcli" label="BTCLI">

```bash
btcli stake remove \
  --wallet.name proxy_wallet \
  --proxy COLDKEY_SS58_ADDRESS \
  --netuid 14 \
  --hotkey VALIDATOR_HOTKEY \
  --amount 25.0
```

**Example:**
```bash
btcli stake remove \
  --wallet.name PracticeProxy \
  --proxy my-coldkey \
  --netuid 14 \
  --hotkey 5HEo565WAy4Dbq3Sv271SAi7syBSofyfhhwRNjFNSM2gP9M2 \
  --amount 25.0
```

**Parameters:**
- `--wallet.name`: The proxy wallet that signs the transaction
- `--proxy`: Your coldkey's SS58 address (or saved proxy name)
- `--netuid`: The subnet ID to unstake from
- `--hotkey`: The validator's hotkey address
- `--amount`: Amount of TAO to unstake

The unstaked TAO will be returned to your coldkey's free balance.

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

# Your coldkey SS58 address (no private key needed)
real_account_ss58 = '5XyZ123...'  # Your coldkey SS58 address

# Initialize connection to the network
subtensor = bittensor.Subtensor('test')

# Load proxy wallet
proxy = bittensor.Wallet(name='PracticeProxy')

# Use the top validator from subnet 14 (from earlier step)
subnet14_validator = '5HEo565WAy4Dbq3Sv271SAi7syBSofyfhhwRNjFNSM2gP9M2'

# Create the remove_stake call using SubtensorModule
remove_stake_call = SubtensorModule(subtensor).remove_stake(
    netuid=14,                                         # Subnet to unstake from (subnet 14)
    hotkey=subnet14_validator,                         # Validator hotkey (top validator on subnet 14)
    amount_unstaked=bittensor.Balance.from_tao(25).rao, # Amount to unstake (in RAO)
)

# Execute the call through the proxy
response = subtensor.proxy(
    wallet=proxy,                                      # Proxy wallet signs the transaction
    real_account_ss58=real_account_ss58,               # Real account (coldkey) being proxied
    force_proxy_type=ProxyType.Staking,                # Must match the proxy relationship
    call=remove_stake_call,
)

print(response)
```

</TabItem>
</Tabs>

:::tip Important Parameters
- **`netuid`**: The subnet ID where you want to unstake from (14 in this example)
- **`hotkey`**: The validator hotkey to unstake from (subnet 14 top validator from metagraph)
- **`amount_unstaked`**: The amount to unstake in RAO, use `Balance.from_tao(amount).rao` to convert
- **`force_proxy_type`**: Must match the proxy type that was set when creating the proxy relationship
:::
