---
title: "Staking with a Proxy"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

<Tabs groupId="staking-proxy">

<TabItem value="sdk" label="Bittensor SDK">

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

if response.success:
    print("✓ Staking proxy created successfully!")
    print(f"  Real account: {coldkey_wallet.coldkey.ss58_address}")
    print(f"  Delegate: {proxy_wallet.coldkey.ss58_address}")
    print(f"  Proxy Type: Staking")
else:
    print(f"✗ Failed to create proxy: {response.message}")
```

</TabItem>

</Tabs>

:::info Proxy deposit
Creating a proxy requires a deposit that is held as long as the proxy relationship exists. This deposit is returned when you remove the proxy. You can check current deposit requirements using `subtensor.get_proxy_constants()`.
:::

## Verify the Proxy

Before performing staking operations, verify that the proxy relationship was created successfully:

<Tabs groupId="staking-proxy">

<TabItem value="sdk" label="Bittensor SDK">

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

</TabItem>

</Tabs>

## Perform Staking Operations with Proxy

Once your staking proxy is set up, you can perform staking operations on behalf of the coldkey using the proxy wallet. Here's a complete example of moving stake between subnets using a proxy:

<Tabs groupId="staking-proxy">

<TabItem value="sdk" label="Bittensor SDK">

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

if response.success:
    print("✓ Successfully moved stake between subnets")
else:
    print(f"✗ Failed to move stake: {response.message}")
```

</TabItem>

</Tabs>

### Understanding the Code

Let's break down each component of the staking operation:

**1. Initialize Subtensor**
```python
subtensor = bittensor.Subtensor()
```
Creates a connection to the Bittensor network (defaults to mainnet/finney).

**2. Load Proxy Wallet**
```python
proxy = bittensor.Wallet(name='my_proxy_wallet', path='.')
proxy.coldkey_file.save_password_to_env("<password>")
```
Loads the proxy wallet (the delegate account that will sign transactions) and optionally saves the password to the environment for automated operations.

**3. Create the Staking Call**
```python
move_stake_call = SubtensorModule(subtensor).move_stake(
    origin_netuid=0,                                    # Source subnet
    origin_hotkey_ss58='<validator hotkey>',            # Source validator
    destination_netuid=1,                               # Destination subnet
    destination_hotkey_ss58='<validator hotkey>',       # Destination validator
    alpha_amount=bittensor.Balance.from_tao(1),         # Amount in TAO
)
```
Uses `SubtensorModule` to create a `move_stake` call. This method allows you to move stake between different subnets and validators atomically.

**4. Execute Through Proxy**
```python
response = subtensor.proxy(
    wallet=proxy,                                       # Proxy wallet signs
    real_account_ss58='<the main account coldkey>',    # Real account (funds source)
    force_proxy_type=ProxyType.Staking,                # Proxy type must match
    call=move_stake_call,
)
```
Executes the staking operation through the proxy relationship. The proxy wallet signs the transaction, but the operation is performed on behalf of the real account.

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

## Complete Example: Staking Management Script

Here's a complete example script that demonstrates the full workflow from creating a proxy to performing staking operations:

<Tabs groupId="staking-proxy">

<TabItem value="sdk" label="Bittensor SDK">

```python
#!/usr/bin/env python3
"""
Staking Proxy Management Script

This script demonstrates:
1. Creating a staking proxy relationship
2. Verifying the proxy setup
3. Moving stake between subnets using the proxy
"""

import bittensor
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule


def create_staking_proxy(
    subtensor: bittensor.Subtensor,
    coldkey_wallet: bittensor.Wallet,
    proxy_wallet_address: str
) -> bool:
    """Create a staking proxy relationship."""
    print("Creating staking proxy...")
    
    response = subtensor.add_proxy(
        wallet=coldkey_wallet,
        delegate_ss58=proxy_wallet_address,
        proxy_type=ProxyType.Staking,
        delay=0,  # No delay for immediate operations
    )
    
    if response.success:
        print("✓ Staking proxy created successfully!")
        return True
    else:
        print(f"✗ Failed to create proxy: {response.message}")
        return False


def verify_proxy(
    subtensor: bittensor.Subtensor,
    coldkey_address: str,
    proxy_address: str
) -> bool:
    """Verify the proxy relationship exists."""
    print("\nVerifying proxy setup...")
    
    proxies, deposit = subtensor.get_proxies_for_real_account(
        real_account=coldkey_address
    )
    
    for proxy in proxies:
        if proxy.delegate == proxy_address and proxy.proxy_type == "Staking":
            print(f"✓ Staking proxy verified:")
            print(f"  Delegate: {proxy.delegate}")
            print(f"  Type: {proxy.proxy_type}")
            print(f"  Delay: {proxy.delay} blocks")
            print(f"  Deposit: {deposit} RAO")
            return True
    
    print("✗ Staking proxy not found")
    return False


def move_stake_via_proxy(
    subtensor: bittensor.Subtensor,
    proxy_wallet: bittensor.Wallet,
    coldkey_address: str,
    origin_netuid: int,
    origin_hotkey: str,
    dest_netuid: int,
    dest_hotkey: str,
    amount_tao: float
) -> bool:
    """Move stake between subnets using the proxy."""
    print(f"\nMoving {amount_tao} TAO stake...")
    print(f"  From: Subnet {origin_netuid}, Validator {origin_hotkey[:10]}...")
    print(f"  To:   Subnet {dest_netuid}, Validator {dest_hotkey[:10]}...")
    
    # Create the move_stake call using SubtensorModule
    move_stake_call = SubtensorModule(subtensor).move_stake(
        origin_netuid=origin_netuid,
        origin_hotkey_ss58=origin_hotkey,
        destination_netuid=dest_netuid,
        destination_hotkey_ss58=dest_hotkey,
        alpha_amount=bittensor.Balance.from_tao(amount_tao),
    )
    
    # Execute through the proxy
    response = subtensor.proxy(
        wallet=proxy_wallet,
        real_account_ss58=coldkey_address,
        force_proxy_type=ProxyType.Staking,
        call=move_stake_call,
    )
    
    if response.success:
        print(f"✓ Successfully moved {amount_tao} TAO stake")
        return True
    else:
        print(f"✗ Failed to move stake: {response.message}")
        return False


def main():
    """Main function demonstrating staking proxy workflow."""
    
    # Configuration
    COLDKEY_NAME = "my_coldkey"
    PROXY_WALLET_NAME = "my_proxy_wallet"
    PROXY_PASSWORD = "<your_password>"
    
    # Staking configuration
    ORIGIN_NETUID = 0  # Root network
    ORIGIN_VALIDATOR = "<origin validator hotkey>"
    DEST_NETUID = 1    # Subnet 1
    DEST_VALIDATOR = "<destination validator hotkey>"
    AMOUNT_TAO = 1.0
    
    # Initialize connection
    print("Connecting to Bittensor network...")
    subtensor = bittensor.Subtensor()
    
    # Load wallets
    print("\nLoading wallets...")
    coldkey_wallet = bittensor.Wallet(name=COLDKEY_NAME, path='.')
    proxy_wallet = bittensor.Wallet(name=PROXY_WALLET_NAME, path='.')
    
    # Save password to environment for automated operations
    proxy_wallet.coldkey_file.save_password_to_env(PROXY_PASSWORD)
    
    print(f"Coldkey (real account): {coldkey_wallet.coldkey.ss58_address}")
    print(f"Proxy wallet (delegate): {proxy_wallet.coldkey.ss58_address}")
    
    # Step 1: Create staking proxy
    if not create_staking_proxy(
        subtensor,
        coldkey_wallet,
        proxy_wallet.coldkey.ss58_address
    ):
        return
    
    # Step 2: Verify proxy
    if not verify_proxy(
        subtensor,
        coldkey_wallet.coldkey.ss58_address,
        proxy_wallet.coldkey.ss58_address
    ):
        return
    
    # Step 3: Move stake using proxy
    move_stake_via_proxy(
        subtensor,
        proxy_wallet,
        coldkey_wallet.coldkey.ss58_address,
        ORIGIN_NETUID,
        ORIGIN_VALIDATOR,
        DEST_NETUID,
        DEST_VALIDATOR,
        AMOUNT_TAO
    )
    
    print("\n✓ Staking proxy workflow completed!")


if __name__ == "__main__":
    main()
```

</TabItem>

</Tabs>

### Running the Script

1. **Install dependencies**:
```bash
pip install bittensor
```

2. **Update configuration**:
Replace the placeholder values in the script:
- `COLDKEY_NAME`: Your main coldkey wallet name
- `PROXY_WALLET_NAME`: Your proxy wallet name
- `PROXY_PASSWORD`: Password for the proxy wallet
- `ORIGIN_VALIDATOR`: Source validator hotkey
- `DEST_VALIDATOR`: Destination validator hotkey

3. **Run the script**:
```bash
python3 staking_proxy_example.py
```

## Remove the Staking Proxy

When you no longer need the staking proxy, remove it to reclaim the deposit:

<Tabs groupId="staking-proxy">

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor
from bittensor.core.chain_data.proxy import ProxyType

subtensor = bittensor.Subtensor()
coldkey_wallet = bittensor.Wallet(name="my_coldkey", path='.')
proxy_wallet = bittensor.Wallet(name="my_proxy_wallet", path='.')

# Remove the proxy relationship
response = subtensor.remove_proxy(
    wallet=coldkey_wallet,                          # Coldkey signs (owns the relationship)
    delegate_ss58=proxy_wallet.coldkey.ss58_address,  # The proxy to remove
    proxy_type=ProxyType.Staking,                   # Must match the type used when created
    delay=0,                                        # Must match the delay used when created
)

if response.success:
    print("✓ Staking proxy removed successfully!")
    print("✓ Deposit returned to your coldkey")
else:
    print(f"✗ Failed to remove proxy: {response.message}")
```

</TabItem>

</Tabs>

:::info Important
When removing a proxy, you must specify the exact `proxy_type` and `delay` values that were used when the proxy was created. If you don't remember these values, use `get_proxies_for_real_account()` to retrieve them first.
:::

## Security Best Practices

When using staking proxies, follow these security best practices:

1. **Keep your coldkey offline**: The entire purpose of a staking proxy is to keep your coldkey secure. Never expose your coldkey unnecessarily.

2. **Use dedicated delegate accounts**: Create a separate hot wallet specifically for your staking proxy operations. Don't reuse wallets across multiple purposes.

3. **Monitor proxy activity**: Regularly check your staking positions and proxy relationships to ensure no unauthorized changes.

4. **Set appropriate delays**: If you want an extra layer of security, consider using a non-zero `delay` value that requires announcements before operations execute.

5. **Remove unused proxies**: If you're no longer using a staking proxy, remove it to reclaim your deposit and reduce potential attack surface.

6. **Verify proxy type**: Always use `ProxyType.Staking` for staking operations. Never grant broader permissions (like `ProxyType.Any`) than necessary.

## Troubleshooting

### Common errors and solutions:

**`proxy.NotFound`**
- The proxy relationship doesn't exist
- Solution: Verify the proxy was created using `get_proxies_for_real_account()`

**`proxy.NotProxy`**
- The delegate account isn't authorized for the real account
- Solution: Create the proxy relationship first using `add_proxy()`

**`system.CallFiltered`**
- The proxy type doesn't permit the requested operation
- Solution: Ensure you're using `ProxyType.Staking` for staking operations

**`proxy.Unannounced`**
- A delayed proxy requires announcement first
- Solution: Use `announce_proxy()` before executing, or use `delay=0`

## Additional Resources

- [Proxy Overview](https://docs.learnbittensor.org/keys/proxies)
- [Working with Proxies](https://docs.learnbittensor.org/keys/proxies/create-proxy)
- [Proxy Types](https://docs.learnbittensor.org/keys/proxies#types-of-proxies)
- [Staking Guide](https://docs.learnbittensor.org/staking)


