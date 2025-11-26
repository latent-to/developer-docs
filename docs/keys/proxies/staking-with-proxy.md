---
title: "Staking with a Proxy"
---


# Staking with a Proxy

This guide demonstrates how to use proxy accounts to perform staking operations on the Bittensor network. Using a proxy for staking allows you to keep your high-value coldkey secure in cold storage while using a hot wallet to manage day-to-day staking operations.

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

First, establish the proxy relationship by authorizing the proxy wallet to perform staking operations on behalf of your coldkey:


```python
import bittensor
from bittensor.core.chain_data.proxy import ProxyType

# Initialize connection to the network
subtensor = bittensor.Subtensor()

# Load your coldkey (main account that holds the TAO)
coldkey_wallet = bittensor.Wallet(name="my_coldkey", path='.')

# Load your proxy wallet (delegate that will perform operations)
proxy_wallet = bittensor.Wallet(name="my_proxy_wallet", path='.')

# Create the staking proxy relationship
response = subtensor.add_proxy(
    wallet=coldkey_wallet,                      # Signs this transaction (authorizes the proxy)
    delegate_ss58=proxy_wallet.coldkey.ss58_address,  # The proxy wallet address
    proxy_type=ProxyType.Staking,               # Grant only staking permissions
    delay=0,                                    # No delay (immediate execution)
)

print(response)
```


:::info Proxy deposit
Creating a proxy requires a deposit that is held as long as the proxy relationship exists. This deposit is returned when you remove the proxy. You can check current deposit requirements using `subtensor.get_proxy_constants()`.
:::

## Verify the Proxy

Before performing staking operations, verify that the proxy relationship was created successfully:


```python
import bittensor

subtensor = bittensor.Subtensor()
coldkey_wallet = bittensor.Wallet(name="my_coldkey", path='.')

# Get all proxies for your coldkey
proxies, deposit = subtensor.get_proxies_for_real_account(
    real_account=coldkey_wallet.coldkey.ss58_address
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



## Perform Staking Operations with Proxy

Once your staking proxy is set up, you can perform staking operations on behalf of the coldkey using the proxy wallet. Here's a complete example of moving stake between subnets using a proxy:



```python
import bittensor
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

# Initialize connection to the network
subtensor = bittensor.Subtensor()

# Load the proxy wallet (delegate account)
proxy = bittensor.Wallet(name='my_proxy_wallet', path='.')

# Save the wallet password to environment (for automated operations)
proxy.coldkey_file.save_password_to_env("<password>")

# Create the move_stake call using SubtensorModule
move_stake_call = SubtensorModule(subtensor).move_stake(
    origin_netuid=0,                                    # Source subnet (0 = root network)
    origin_hotkey_ss58='<validator hotkey>',            # Source validator hotkey
    destination_netuid=1,                               # Destination subnet
    destination_hotkey_ss58='<validator hotkey>',       # Destination validator hotkey
    alpha_amount=bittensor.Balance.from_tao(1),         # Amount to move (in TAO)
)

# Execute the call through the proxy
response = subtensor.proxy(
    wallet=proxy,                                       # Proxy wallet signs the transaction
    real_account_ss58='<the main account coldkey>',    # Real account (coldkey) being proxied
    force_proxy_type=ProxyType.Staking,                # Must match the proxy relationship
    call=move_stake_call,
)

print(response)
```

:::tip Important Parameters
- **`origin_netuid`**: The subnet ID where the stake is currently located (0 = root network)
- **`origin_hotkey_ss58`**: The validator hotkey where the stake is currently staked
- **`destination_netuid`**: The subnet ID where you want to move the stake
- **`destination_hotkey_ss58`**: The validator hotkey where you want to stake
- **`alpha_amount`**: The amount of stake to move, specified using `Balance.from_tao()`
- **`force_proxy_type`**: Must match the proxy type that was set when creating the proxy relationship
:::

### Other Staking Operations

You can perform other staking operations using the same pattern. Here are additional examples:

**Add Stake**
```python
from bittensor.core.extrinsics.pallets import SubtensorModule

add_stake_call = SubtensorModule(subtensor).add_stake(
    hotkey_ss58='<validator hotkey>',
    alpha_amount=bittensor.Balance.from_tao(100),
)

response = subtensor.proxy(
    wallet=proxy,
    real_account_ss58='<coldkey address>',
    force_proxy_type=ProxyType.Staking,
    call=add_stake_call,
)
```

**Remove Stake**
```python
remove_stake_call = SubtensorModule(subtensor).remove_stake(
    hotkey_ss58='<validator hotkey>',
    alpha_amount=bittensor.Balance.from_tao(50),
)

response = subtensor.proxy(
    wallet=proxy,
    real_account_ss58='<coldkey address>',
    force_proxy_type=ProxyType.Staking,
    call=remove_stake_call,
)
```
