---
title: "Understand Price Protection"
---

import { SdkVersion } from "../sdk/_sdk-version.mdx";

# Understand Price Protection

Bittensor clients (BTCLI and the SDK) provides three modes to give users control over how their transactions handle adverse price movements: Strict, Partial, and Unsafe.

Other users' transactions can affect the token price, even while your transaction is pending. Subnet token prices may change rapidly, with significant consequences affecting your execution price and increasing slippage. These effects can be exploited by "sandwich attacks" and other [MEV (Maximal Extractable Value)](../resources/glossary.md#mev-maximal-extractable-value) attacks, or can result in loss of liquidity due to organic price volatility.

It is therefore important to carefully manage price protection when staking and unstaking real value liquidity, i.e. on mainnet ("finney"). For additional protection against MEV attacks, consider using [MEV Shield](../sdk/mev-protection.md) to encrypt your transactions.

## Price Protection Modes
### Strict Safe Mode (Default)

In this mode, the transaction is **rejected entirely** if executing it would push the final market price beyond the tolerance threshold from the price when you submitted the transaction. Tolerance threshold can be specified but is 5% by default.

This mode provides maximum protection against price volatility, market movements, and sandwich attacks by preventing transactions that would push the execution price beyond the specified tolerance. This is preferable when you want to guarantee a transaction price, and are willing to accept transaction failure if you cannot get that price.

**Example**: You set a 2% tolerance for unstaking. If executing your transaction would push the final price more than 2% below the price when you submitted the transaction, the entire transaction is rejected.

### Partial Safe Mode

In this mode, the transaction executes **the maximum amount that can be executed while keeping the execution price within the defined tolerance** of the original submission price. If the full amount would cause the market price to exceed the tolerance range, only a portion would be executed.

This mode ensures a partial transaction execution even if market conditions would make the full transaction exceed price tolerance limits.

This is preferable if you want a guarantee of some transaction, and are willing to accept variation in price, which can result in loss of liquidity of up to the tolerance threshold.

**Example**: You try to unstake 1000 alpha with 2% tolerance. If executing the full amount would push the final market price beyond 2% of the original price, the system calculates and executes only the maximum amount (e.g., 400 alpha) that stays within the 2% limit.

### Unsafe Mode

This mode **ignores price protection entirely**. The transaction executes regardless of price movements, offering the fastest execution but no protection against adverse price changes or sandwich attacks.

This mode is generally convenient for development and testing, but inadvisable with real-value liquidity on mainnet ("finney").

### Example Comparison by Mode

Consider attempting to unstake 1000 alpha when executing the full transaction would push the market price 5% below the original price, with tolerance set to 2%:

| Mode         | Outcome                                                                         |
| ------------ | ------------------------------------------------------------------------------- |
| Strict Safe  | Transaction rejected entirely (5% price movement > 2% tolerance)                |
| Partial Safe | Unstakes ~400 alpha (maximum amount that keeps final price within 2% tolerance) |
| Unsafe       | Unstakes full 1000 alpha regardless of 5% price impact                          |

## Managing Price Protection with BTCLI

The `btcli stake` interface provides parameters to control price protection modes.

**Enable/disable price protection (strict or partial):**

True by default. Enables price protection, which is strict by default.

```bash
--safe-staking/--no-safe-staking, --safe/--unsafe
```

**Enable/disable partial execution (ignored in unsafe mode):**

If price protection (`--safe-staking`) is enabled, determines whether protection is strict or partial.

```bash
--allow-partial-stake/--no-allow-partial-stake, --partial/--no-partial
```

**Set price tolerance:**

If in **partial safe** staking mode, determines the threshold of price variation tolerated in the transaction.

```bash
--tolerance, --rate-tolerance FLOAT
```

- **Default**: 0.005 (0.5%)
- **Range**: 0.0 to 1.0 (0% to 100%)
- **Purpose**: Maximum allowed final price deviation from submission price

### BTCLI Examples

**Strict Safe Mode (reject if price moves beyond tolerance):**

```bash
# note that --safe is unnecessary as it is enabled by default
btcli stake add --amount 100 --netuid 1 --safe --tolerance 0.02 --no-partial
```

**Partial Safe Mode (execute what fits within tolerance):**

```bash
# note that --safe is unnecessary as it is enabled by default
btcli stake add --amount 1000 --netuid 1 --safe --tolerance 0.02 --partial
```

**Unsafe Mode (ignore price protection):**

```bash
btcli stake add --amount 300 --netuid 1 --unsafe
```

## Managing Price Protection with SDK

The Bittensor SDK provides price protection through method parameters:

### Parameters

:::warning
Unlike the `btcli`, the SDK's default behavior is _Unsafe_ mode.
You must explicitly configure price protection when using the SDK's staking/unstaking functionality.
:::

**`safe_staking`** (bool):

- **Default**: False
- **Purpose**: Enables price protection

**`allow_partial_stake`** (bool):

- **Default**: False
- **Purpose**: Enables partial execution mode

**`rate_tolerance`** (float):

- **Default**: 0.005 (0.5%)
- **Range**: 0.0 to 1.0
- **Purpose**: Maximum allowed final price deviation from submission price

### SDK Examples

<SdkVersion />

See [Price Protection Simulation](#price-protection-simulation) for an extended example.

#### Safe Mode (reject if price moves beyond tolerance)

```python
import bittensor as bt

subtensor = bt.Subtensor()
wallet = bt.Wallet("my_wallet")

response = subtensor.add_stake(
    wallet=wallet,
    hotkey_ss58="5F...",
    netuid=1,
    amount=bt.Balance.from_tao(100),
    safe_staking=True,           # Enable protection
    rate_tolerance=0.02,         # 2% price tolerance
    allow_partial_stake=False    # Reject if exceeds tolerance
)
```

#### Partial Mode (execute what fits within tolerance)

```python
response = subtensor.add_stake(
    wallet=wallet,
    hotkey_ss58="5F...",
    netuid=1,
    amount=bt.Balance.from_tao(1000),
    safe_staking=True,           # Enable protection
    rate_tolerance=0.02,         # 2% price tolerance
    allow_partial_stake=True     # Execute partial amount within tolerance
)
```

#### Unsafe Mode (ignore price protection)

```python
response = subtensor.add_stake(
    wallet=wallet,
    hotkey_ss58="5F...",
    netuid=1,
    amount=bt.Balance.from_tao(100),
    safe_staking=False          # Disable protection; Unnecessary as this is the default setting
)
```

## Price Protection Simulation

The following script runs through several different stake and unstake operations with different price protection modes, to demonstrate the different behaviors contingent on price.

Prerequisites:

- [Run a Local Bittensor Blockchain Instance](../local-build/deploy)
- [Create a subnet on a local blockchain](../local-build/create-subnet)

:::tip troubleshooting tip
If you see a `Custom error: 14` or a `SubtokenDisabled(Module)` error, you may need to start emissions on your subnet with the following command:

```shell
btcli s start
```

:::

```python
import bittensor as bt

def display_balances_and_stakes(subtensor, wallet, target_hotkey, netuid, label):
    """Display current balances and stakes for the simulation."""
    print(f"\n--- {label} ---")
    balance = subtensor.get_balance(wallet.coldkey.ss58_address)
    stakes = subtensor.get_stake_info_for_coldkey(wallet.coldkey.ss58_address)

    print(f"Coldkey balance: {balance}")

    # Find stake for our target hotkey and netuid
    target_stake = None
    for stake_info in stakes:
        if stake_info.hotkey_ss58 == target_hotkey and stake_info.netuid == netuid:
            target_stake = stake_info.stake
            break

    if target_stake:
        print(f"Stake on {target_hotkey[:8]}... (netuid {netuid}): {target_stake}")
    else:
        print(f"No stake found on {target_hotkey[:8]}... (netuid {netuid})")

def show_current_price_and_protection(subtensor, netuid, tolerance, label):
    """Show current subnet price and calculate protection thresholds."""
    print(f"\n{label} Price Analysis:")
    subnet_info = subtensor.subnet(netuid=netuid)
    current_price = subnet_info.price
    print(f"Current price: {current_price}")

    # Calculate protection thresholds
    price_floor = current_price.tao * (1 - tolerance)
    price_ceiling = current_price.tao * (1 + tolerance)

    print(f"Price protection with {tolerance:.2%} tolerance:")
    print(f"  • Price floor (unstaking): {price_floor:.6f} TAO/α")
    print(f"  • Price ceiling (staking): {price_ceiling:.6f} TAO/α")
    print(f"  • Protection range: {price_floor:.6f} - {price_ceiling:.6f} TAO/α")

    return subnet_info

def demonstrate_protection_modes():
    """Comprehensive demonstration of all three price protection modes."""

    print("=== Bittensor Price Protection Mode Simulation ===\n")

    # Connect to local network
    subtensor = bt.Subtensor("ws://127.0.0.1:9945")

    # Get subnet information
    netuid = 2
    subnet_info = subtensor.subnet(netuid=netuid)
    if subnet_info is None:
        print(f"Error: Could not connect to subnet {netuid}. Is the local node running?")
        return False

    print(f"Connected to subnet {netuid}")
    print(f"Alpha in reserve: {subnet_info.alpha_in}")
    print(f"TAO in reserve: {subnet_info.tao_in}")

    # Initialize wallet
    wallet = bt.Wallet(name="Alice")

    try:
        wallet.unlock_coldkey()
    except Exception as e:
        print(f"Error: Could not unlock wallet. Make sure 'Alice' wallet exists and is unlocked. {e}")
        return False

    # Get registered hotkeys for the subnet
    metagraph = subtensor.metagraph(netuid=netuid)
    registered_hotkeys = metagraph.hotkeys

    if not registered_hotkeys:
        print(f"Error: No registered hotkeys found on subnet {netuid}.")
        return False

    target_hotkey = registered_hotkeys[0]
    print(f"Using registered hotkey: {target_hotkey[:8]}...")

    # Display initial state
    display_balances_and_stakes(subtensor, wallet, target_hotkey, netuid, "Initial State")

    print("\n" + "="*60)
    print("SIMULATION: Testing price protection modes")
    print("="*60)

    # Test amounts
    stake_amount = 5.0  # TAO

    # Mode 1: UNSAFE MODE (No Protection)
    print(f"\n{'='*20} MODE 1: UNSAFE (No Protection) {'='*20}")
    print("Executes transaction regardless of price movements")

    subnet_info = show_current_price_and_protection(subtensor, netuid, 0.0, "Pre-Unsafe")

    try:
        print(f"\nStaking {stake_amount} TAO with NO protection...")
        response = subtensor.add_stake(
            wallet=wallet,
            hotkey_ss58=target_hotkey,
            netuid=netuid,
            amount=bt.Balance.from_tao(stake_amount),
            safe_staking=False  # No protection
        )

        print(response)

    except Exception as e:
        print(f"❌ Unsafe staking failed: {e}")

    # Show price after unsafe transaction
    show_current_price_and_protection(subtensor, netuid, 0.0, "Post-Unsafe")

    display_balances_and_stakes(subtensor, wallet, target_hotkey, netuid, "After Unsafe Staking")

    # Mode 2: SAFE MODE with VERY strict tolerance (should fail)
    print(f"\n{'='*20} MODE 2: SAFE with STRICT Tolerance {'='*20}")
    print("Rejects transaction if price moves beyond tolerance")

    strict_tolerance = 0.001  # 0.1% tolerance - very strict
    large_stake_amount = 20.0  # Larger amount to trigger protection

    subnet_info = show_current_price_and_protection(subtensor, netuid, strict_tolerance, "Pre-Safe-Strict")
    pre_safe_price = subnet_info.price.tao
    price_ceiling = pre_safe_price * (1 + strict_tolerance)

    try:
        print(f"\nStaking {large_stake_amount} TAO with SAFE protection (tolerance: {strict_tolerance:.2%})...")
        print(f"Transaction should FAIL if final price > {price_ceiling:.6f} TAO/α")

        response = subtensor.add_stake(
            wallet=wallet,
            hotkey_ss58=target_hotkey,
            netuid=netuid,
            amount=bt.Balance.from_tao(large_stake_amount),
            safe_staking=True,
            rate_tolerance=strict_tolerance,
            allow_partial_stake=False
        )

        print(response)
        
        if response.success:
            # Check if it should have failed
            post_subnet_info = subtensor.subnet(netuid=netuid)
            post_safe_price = post_subnet_info.price.tao
            print(f"Final price: {post_safe_price:.6f} TAO/α")
            print(f"Price ceiling was: {price_ceiling:.6f} TAO/α")

            if post_safe_price > price_ceiling:
                print(f"🚨 BUG: Transaction succeeded but price ({post_safe_price:.6f}) > ceiling ({price_ceiling:.6f})")
            else:
                print(f"Price stayed within tolerance: {post_safe_price:.6f} ≤ {price_ceiling:.6f}")
                print(f"Actual price increase: {((post_safe_price - pre_safe_price) / pre_safe_price) * 100:.3f}%")

    except Exception as e:
        if "Price exceeded tolerance limit" in str(e) or "exceeded tolerance" in str(e) or "tolerance" in str(e).lower():
            print("🛡️  EXPECTED: Transaction rejected - price protection activated!")
        else:
            print(f"❌ Safe staking failed with unexpected error: {e}")

    # Show price after safe transaction
    show_current_price_and_protection(subtensor, netuid, strict_tolerance, "Post-Safe-Strict")

    display_balances_and_stakes(subtensor, wallet, target_hotkey, netuid, "After Strict Safe Staking")

    # Mode 3: SAFE MODE with reasonable tolerance (should succeed)
    print(f"\n{'='*20} MODE 3: SAFE with Reasonable Tolerance {'='*20}")
    print("Demonstrating normal safe staking that succeeds")

    reasonable_tolerance = 0.05  # 5% tolerance
    normal_amount = 5.0  # Normal amount

    subnet_info = show_current_price_and_protection(subtensor, netuid, reasonable_tolerance, "Pre-Safe-Normal")

    try:
        print(f"\nStaking {normal_amount} TAO with SAFE protection (tolerance: {reasonable_tolerance:.2%})...")

        response = subtensor.add_stake(
            wallet=wallet,
            hotkey_ss58=target_hotkey,
            netuid=netuid,
            amount=bt.Balance.from_tao(normal_amount),
            safe_staking=True,
            rate_tolerance=reasonable_tolerance,
            allow_partial_stake=False
        )

        print(response)

    except Exception as e:
        print(f"❌ Safe staking failed: {e}")

    display_balances_and_stakes(subtensor, wallet, target_hotkey, netuid, "After Normal Safe Staking")

    # Mode 4: PARTIAL MODE with strict tolerance (should execute partially)
    print(f"\n{'='*20} MODE 4: PARTIAL with STRICT Tolerance {'='*20}")
    print("Should execute maximum amount within tolerance")

    partial_strict_tolerance = 0.002  # 0.2% tolerance - very strict for partial
    very_large_amount = 50.0  # Very large amount to force partial execution

    subnet_info = show_current_price_and_protection(subtensor, netuid, partial_strict_tolerance, "Pre-Partial-Strict")

    print(f"\nUsing very strict tolerance ({partial_strict_tolerance:.2%}) with large amount ({very_large_amount} TAO)")
    print(f"Should execute PARTIAL amount to stay within tolerance")

    # Record balance before to see actual amount executed
    balance_before = subtensor.get_balance(wallet.coldkey.ss58_address)

    try:
        print(f"\nStaking {very_large_amount} TAO with PARTIAL protection (tolerance: {partial_strict_tolerance:.2%})...")
        response = subtensor.add_stake(
            wallet=wallet,
            hotkey_ss58=target_hotkey,
            netuid=netuid,
            amount=bt.Balance.from_tao(very_large_amount),
            safe_staking=True,
            rate_tolerance=partial_strict_tolerance,
            allow_partial_stake=True  # Allow partial execution
        )

        # Check actual amount executed
        balance_after = subtensor.get_balance(wallet.coldkey.ss58_address)
        actual_amount_executed = balance_before.tao - balance_after.tao

        print(response)
        
        if response.success:
            print(f"Amount requested: {very_large_amount} TAO")
            print(f"Amount actually executed: {actual_amount_executed:.3f} TAO")
            execution_percentage = (actual_amount_executed / very_large_amount) * 100
            print(f"Execution percentage: {execution_percentage:.1f}%")

            if actual_amount_executed < very_large_amount * 0.95:  # Less than 95% executed
                print(f"🎯 SUCCESS: PARTIAL execution detected! Only {execution_percentage:.1f}% executed due to price protection")
            else:
                print(f"🤔 Unexpected: Near-full execution despite strict tolerance")

    except Exception as e:
        print(f"❌ Partial staking failed: {e}")

    # Show price after partial to see impact
    show_current_price_and_protection(subtensor, netuid, partial_strict_tolerance, "Post-Partial-Strict")

    display_balances_and_stakes(subtensor, wallet, target_hotkey, netuid, "After Partial Staking")

    # Demonstrate unstaking with protection
    print(f"\n{'='*20} UNSTAKING WITH PROTECTION {'='*20}")
    print("Demonstrating unstaking with price protection")

    # Find current stake to unstake from
    stakes = subtensor.get_stake_info_for_coldkey(wallet.coldkey.ss58_address)
    current_stake = None
    for stake_info in stakes:
        if stake_info.hotkey_ss58 == target_hotkey and stake_info.netuid == netuid:
            current_stake = stake_info.stake
            break

    if current_stake and current_stake.rao > 0:
        unstake_tolerance = 0.05  # 5% tolerance for unstaking
        subnet_info = show_current_price_and_protection(subtensor, netuid, unstake_tolerance, "Pre-Unstake")

        # Unstake a portion with protection
        unstake_amount_rao = min(current_stake.rao // 4, int(50 * 1e9))
        unstake_balance = bt.Balance.from_rao(unstake_amount_rao).set_unit(netuid=netuid)

        print(f"Current stake: {current_stake}")
        print(f"Attempting to unstake: {unstake_balance}")

        try:
            print(f"\nUnstaking with SAFE protection (tolerance: {unstake_tolerance:.2%})...")
            response = subtensor.unstake(
                wallet=wallet,
                hotkey_ss58=target_hotkey,
                netuid=netuid,
                amount=unstake_balance,
                safe_unstaking=True,
                rate_tolerance=unstake_tolerance,
                allow_partial_stake=False
            )

            print(response)

        except Exception as e:
            if "Price exceeded tolerance limit" in str(e) or "exceeded tolerance" in str(e):
                print("🛡️  Unstaking rejected - price moved beyond tolerance")
            else:
                print(f"❌ Protected unstaking failed: {e}")
    else:
        print("No stake available to unstake")

    display_balances_and_stakes(subtensor, wallet, target_hotkey, netuid, "Final State")
    show_current_price_and_protection(subtensor, netuid, 0.0, "Final")

    return True

if __name__ == "__main__":
    demonstrate_protection_modes()
```
