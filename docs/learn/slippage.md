---
title: "Understanding Slippage"
---

# Understanding Slippage

## Introduction

When staking and unstaking in Bittensor, *slippage* refers to a difference between the quantity of tokens actually received, and the amount that would be expected based on a static price. This difference is due to the change in price due to the transaction itself.

Each Bittensor subnet operates as a *constant product AMM*, meaning that it will accept trades that conserve the product of the quantities of the two tokens in reserve, TAO and alpha. To calulate the price in one token of batch of the other token that a buyer wishes to acquire&mdash;alpha if they are staking, or TAO if they are unstaking&mdash;the algorithm assumes that the transaction does not change this product, so the product of TAO and alpha is the same before and after.

When staking, the product K of TAO in reserve and alpha in reserve is the same before and after the transaction, so the initial product must be equal to the product after the cost in TAO is added to the reserve, and the stake is removed from the reserve and placed in the staked hotkey.

Before:
$$
\tau_{\mathrm{in}} \,\alpha_{\mathrm{in}} = k
$$

After:
$$
(\tau_{\mathrm{in}} + \text{cost}) \bigl(\alpha_{\mathrm{in}} - \text{stake}\bigr) = k
$$

Equal:

$$
(\tau_{\mathrm{in}} + \text{cost}) \bigl(\alpha_{\mathrm{in}} - \text{stake}\bigr) 
  = \tau_{\mathrm{in}} \,\alpha_{\mathrm{in}}
$$


This means that if we choose to stake in a certain amount of TAO (if we specify the cost), then the yielded stake (the quantity of alpha to be removed from reserve and granted to the staked hotkey) is:

$$
\text{Stake} = \alpha_{\text{in}} - \frac{\tau_{\text{in}} \alpha_{\text{in}}} {\tau_{\text{in}} + \text{cost}}
$$

## Slippage Example

For example, suppose that a subnet has 100 alpha in reserve and 10 TAO, and we want to stake in 5 TAO.

The price at this moment is 10 TAO / 100 alpha, or 10 alpha per TAO, so if we stake 5 TAO, we would expect 50 alpha, without taking slippage into account.

With slippage, the yielded alpha stake will be:

$$
\text{Stake} = 100 - \frac{ 10 * 100} {10 + 5}
$$

or 33.333 alpha sent to the hotkey. So in this case, the slippage is the difference between the ideal expectation of 50 and the actual swap value of 33.33333:
$$
16.667 = 50 - 33.333
$$

This slippage is 50% of the actual swap value, which is extremely high, because we chose small values for the available liquidity. In general, slippage is high when available liquidity is limited compared to the magnitude of the transaction, since the transaction itself is changing the price significantly.

:::tip
`btcli` shows the slippage of staking and unstaking operations, so you don't need to calculate it yourself. 
:::

## Slippage Protection and Modes

Bittensor provides three distinct protection modes to give users control over how their transactions handle slippage in staking and unstaking transaction:

### Three Modes

#### Safe Mode (Default)
- Transaction is **rejected** if slippage exceeds the specified tolerance
- Provides maximum protection against unfavorable price movements
- "Fill or kill" behavior - either execute at acceptable price or not at all

#### Partial Mode
- Transaction executes **up to the slippage threshold**
- If full amount would exceed tolerance, stakes only the portion within limits
- Ensures some execution while respecting price boundaries

#### Unsafe Mode
- **Ignores slippage entirely**
- Transaction executes regardless of price impact
- Fastest execution but no protection against adverse price movements

### Slippage Example Across Modes

Consider staking 1000 TAO when slippage would be 8% for the full amount, with tolerance set to 5%:
| Mode | Outcome  |
|----------------------|------|
|Safe |Transaction rejected entirely (8% > 5% tolerance)|
|Partial |Stakes ~625 TAO (amount that fits within 5% tolerance)  |
|Unsafe |Stakes full 1000 TAO regardless of 8% slippage|

## Managing Slippage with BTCLI

The `btcli stake` interface provides parameters to control slippage protection modes.

### Mode Selection

The following apply to `btcli stake add` and `btcli stake remove`.

:::tip
Other stake commands (`stake swap`, `stake move`, `stake transfer`) do not have slippage protection, since they do not involve balance changes.
:::

**Rate Tolerance:**
```bash
--slippage, --slippage-tolerance, --tolerance, --rate-tolerance FLOAT
```
- **Default**: 0.005 (0.5%)
- **Range**: 0.0 to 1.0 (0% to 100%)
- **Purpose**: Sets the maximum allowed price change ratio

Enable/disable slippage protection (including partial protection).

:::warning
In `--unsafe` mode, transactions are very vulnerable, including [sandwich attacks](#sandwich-attacks).

It is not recommended to stake/unstake on main net ("finney") in `--unsafe` mode.
:::

```bash
--safe-staking/--no-safe-staking, --safe/--unsafe
```

Enable/disable partial staking. Ignored in `--unsafe` mode.

```bash

--allow-partial-stake/--no-allow-partial-stake, --partial/--no-partial 
```

### Examples

**Safe Mode (reject if slippage exceeds limit):**
```bash
btcli stake add --amount 100 --netuid 1 --safe --tolerance 0.05 --no-partial
```

**Partial Mode (execute what fits within limit):**
```bash
btcli stake add --amount 1000 --netuid 1 --safe --partial --tolerance 0.05
```

**Unsafe Mode (ignore slippage):**
```bash
btcli stake add --amount 300 --netuid 1 --unsafe
```

## Managing Slippage with SDK

The Bittensor SDK `add_stake` and `remove_stake` commands provides slippage through method parameters. The SDK automatically translates your mode selection to the appropriate blockchain extrinsics.
                   
See: [Source code](https://github.com/opentensor/bittensor/blob/master/bittensor/core/extrinsics/staking.py#L113-146)

### Parameters

**`safe_staking`** (bool):
- **Default**: False
- **Purpose**: Enables/disables slippage protection

**`allow_partial_stake`** (bool):
- **Default**: False
- **Purpose**: Enables partial execution mode

**`rate_tolerance`** (float):
- **Default**: 0.005 (0.5%)
- **Range**: 0.0 to 1.0
- **Purpose**: Maximum allowed slippage value before transaction is rejected (with `--partial` disabled), or limited (with `--partial` enabled).

### Examples

**Safe Mode (reject if slippage exceeds limit):**
```python
import bittensor as bt

subtensor = bt.Subtensor()
wallet = bt.Wallet("my_wallet")

success = subtensor.add_stake(
    wallet=wallet,
    hotkey_ss58="5F...",
    netuid=1,
    amount=bt.Balance.from_tao(100),
    safe_staking=True,           # Enable protection
    rate_tolerance=0.05,         # 5% tolerance
    allow_partial_stake=False    # Reject if exceeds tolerance
)
```

**Partial Mode (execute what fits within limit):**
```python
success = subtensor.add_stake(
    wallet=wallet,
    hotkey_ss58="5F...",
    netuid=1,
    amount=bt.Balance.from_tao(1000),
    safe_staking=True,           # Enable protection
    rate_tolerance=0.05,         # 5% tolerance
    allow_partial_stake=True     # Execute partial amount within tolerance
)
```

**Unsafe Mode (ignore slippage):**
```python
success = subtensor.add_stake(
    wallet=wallet,
    hotkey_ss58="5F...",
    netuid=1,
    amount=bt.Balance.from_tao(100),
    safe_staking=False          # Disable protection entirely
)
```

## Calculating Slippage

The SDK provides methods to calculate slippage before executing transactions:

```python
import bittensor as bt

# Initialize connection to the network
subtensor = bt.Subtensor()

# Get subnet information for subnet 14
subnet_info = subtensor.subnet(netuid=14)

print(f"Subnet 14 Information:")
print(f"  - Alpha in: {subnet_info.alpha_in}")
print(f"  - Alpha out: {subnet_info.alpha_out}")
print(f"  - TAO in: {subnet_info.tao_in}")
print(f"  - Price: {subnet_info.price}")
print(f"  - Emission: {subnet_info.emission}")

# Calculate slippage for staking 10 TAO
tao_amount = 10.0
print(f"\nCalculating slippage for staking {tao_amount} TAO:")

# Method 1: Get alpha received and slippage amount
alpha_received, slippage_amount = subnet_info.tao_to_alpha_with_slippage(tao_amount)
print(f"  - Alpha received: {alpha_received}")
print(f"  - Slippage amount: {slippage_amount}")

# Method 2: Get slippage percentage (relative to total transaction)
slippage_percentage = subnet_info.tao_to_alpha_with_slippage(tao_amount, percentage=True)
print(f"  - SDK slippage percentage: {slippage_percentage:.2%}")

# Method 3: Calculate traditional slippage percentage (relative to received amount)
# Use Balance.rao property to get raw values for calculation
traditional_percentage = (slippage_amount.rao / alpha_received.rao) * 100
print(f"  - Traditional slippage percentage: {traditional_percentage:.4f}%")

# Calculate slippage for unstaking 100 alpha
# Create alpha amount with correct netuid to avoid deprecation warnings
alpha_amount = bt.Balance.from_tao(100).set_unit(14)  # Set to subnet 14
print(f"\nCalculating slippage for unstaking {alpha_amount} alpha:")

# Method 1: Get TAO received and slippage amount
tao_received, slippage_amount = subnet_info.alpha_to_tao_with_slippage(alpha_amount)
print(f"  - TAO received: {tao_received}")
print(f"  - Slippage amount: {slippage_amount}")

# Method 2: Get slippage percentage (relative to total transaction)
slippage_percentage = subnet_info.alpha_to_tao_with_slippage(alpha_amount, percentage=True)
print(f"  - SDK slippage percentage: {slippage_percentage:.2%}")

# Method 3: Calculate traditional slippage percentage (relative to received amount)
# Use Balance.rao property to get raw values for calculation
traditional_percentage = (slippage_amount.rao / tao_received.rao) * 100
print(f"  - Traditional slippage percentage: {traditional_percentage:.4f}%")

# Compare different amounts to see how slippage changes
print(f"\nSlippage comparison for different amounts:")
amounts = [1.0, 10.0, 50.0, 100.0]
for amount in amounts:
    alpha_received, slippage_amount = subnet_info.tao_to_alpha_with_slippage(amount)
    slippage_pct = subnet_info.tao_to_alpha_with_slippage(amount, percentage=True)
    # Use Balance.rao property to get raw values for calculation
    traditional_pct = (slippage_amount.rao / alpha_received.rao) * 100
    print(f"  - {amount} TAO → {alpha_received} alpha (SDK: {slippage_pct:.2%}, Traditional: {traditional_pct:.4f}%)")
```
```console
Subnet 14 Information:
  - Alpha in: ‎852,213.419039698ξ‎
  - Alpha out: ‎1,143,515.702624673ξ‎
  - TAO in: τ20,358.835906940
  - Price: τ0.023889112
  - Emission: τ0.000000000

Calculating slippage for staking 10.0 TAO:
  - Alpha received: ‎418.390831432ξ‎
  - Slippage amount: ‎0.209910193ξ‎
  - SDK slippage percentage: 5.01%
  - Traditional slippage percentage: 0.0502%

Calculating slippage for unstaking ‎100.000000000ξ‎ alpha:
  - TAO received: τ2.388656034
  - Slippage amount: τ0.000255166
  - SDK slippage percentage: 1.07%
  - Traditional slippage percentage: 0.0107%

Slippage comparison for different amounts:
  - 1.0 TAO → ‎41.857577976ξ‎ alpha (SDK: 0.60%, Traditional: 0.0060%)
  - 10.0 TAO → ‎418.390831432ξ‎ alpha (SDK: 5.01%, Traditional: 0.0502%)
  - 50.0 TAO → ‎2,087.854062147ξ‎ alpha (SDK: 24.60%, Traditional: 0.2466%)
  - 100.0 TAO → ‎4,165.502978352ξ‎ alpha (SDK: 48.98%, Traditional: 0.4922%)

```
## Best Practices

1. **Set Reasonable Tolerances**: Use 0.5-5% for most operations
2. **Monitor Liquidity**: Check pool liquidity before large transactions
3. **Use Partial Execution**: Enable for large amounts to ensure some execution
4. **Test Small Amounts**: Start with small transactions to understand slippage
5. **Check Current Prices**: Verify market conditions before executing

## Error Handling

**Common Error Messages:**
- `"Price exceeded tolerance limit"`: Increase tolerance or enable partial execution
- `"Slippage is too high"`: Reduce transaction size or increase tolerance
- `"Insufficient liquidity"`: Try smaller amounts or different timing

**Troubleshooting:**
```python
try:
    success = subtensor.add_stake(
        wallet=wallet,
        amount=bt.Balance.from_tao(100),
        safe_staking=True,
        rate_tolerance=0.05
    )
except Exception as e:
    if "SlippageTooHigh" in str(e):
        # Increase tolerance or reduce amount
        pass
    elif "InsufficientLiquidity" in str(e):
        # Try smaller amount or wait for better conditions
        pass
```

## Code References

### BTCLI Commands
- [`btcli stake add`](../btcli/btcli-playground.md#stake-add) - Staking with slippage protection
- [`btcli stake remove`](../btcli/btcli-playground.md#stake-remove) - Unstaking with slippage protection

**Note**: Only `stake add` and `stake remove` support slippage protection. Other stake commands (`stake swap`, `stake move`, `stake transfer`) do not have slippage protection parameters.

### SDK Methods (With Slippage Protection)
- [`bittensor.core.subtensor.Subtensor.add_stake()`](pathname:///python-api/html/autoapi/bittensor/core/subtensor/index.html) - Staking with protection
- [`bittensor.core.subtensor.Subtensor.unstake()`](pathname:///python-api/html/autoapi/bittensor/core/subtensor/index.html) - Unstaking with protection
- [`bittensor.core.subtensor.Subtensor.swap_stake()`](pathname:///python-api/html/autoapi/bittensor/core/subtensor/index.html) - Stake movement with protection

### SDK Calculation Methods
- [`bittensor.core.chain_data.dynamic_info.DynamicInfo.tao_to_alpha_with_slippage()`](https://github.com/opentensor/bittensor/blob/master/bittensor/core/chain_data/dynamic_info.py#L130-L185) - Staking slippage calculation
- [`bittensor.core.chain_data.dynamic_info.DynamicInfo.alpha_to_tao_with_slippage()`](https://github.com/opentensor/bittensor/blob/master/bittensor/core/chain_data/dynamic_info.py#L187-L238) - Unstaking slippage calculation

### Blockchain References

**Blockchain Implementation (Protected Extrinsics):**
- [`do_add_stake_limit`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/add_stake.rs#L126-L180) - Protected staking function
- [`do_remove_stake_limit`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/remove_stake.rs#L329-L390) - Protected unstaking function  
- [`do_swap_stake_limit`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/move_stake.rs#L175-L220) - Protected stake movement function

**Blockchain Implementation (Basic Extrinsics):**
- [`do_add_stake`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/add_stake.rs#L39-L75) - Basic staking function
- [`do_remove_stake`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/remove_stake.rs#L38-L75) - Basic unstaking function
- [`do_swap_stake`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/move_stake.rs#L175-L220) - Basic stake movement function

**Transaction Pool & MEV-Related Implementation:**
- [Transaction Pool API](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1857-L1872) - Where mempool validation happens
- [Priority Calculation](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1796-L1813) - How MEV bots can gain priority
- [Transaction Validation](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L2115-L2137) - Where stake amounts determine priority

**EVM Precompile Implementation:**
- [Solidity Interface](https://github.com/opentensor/subtensor/blob/main/precompiles/src/solidity/stakingV2.sol#L198-L225) - EVM interface for slippage protection
- [Rust Implementation](https://github.com/opentensor/subtensor/blob/main/precompiles/src/staking.rs#L320-L340)



## Slippage Protection

Bittensor provides comprehensive slippage protection mechanisms to help users avoid unfavorable trades. These protections work at multiple levels: CLI interface, SDK methods, and blockchain-level validation.

### BTICLI Slippage Protection

The `btcli` command-line interface provides several parameters for slippage protection. For complete CLI reference documentation, see [btcli Reference](../btcli/overview.md).

#### Rate Tolerance Parameter
```bash
--slippage, --slippage-tolerance, --tolerance, --rate-tolerance FLOAT
```
<!-- todo source code reference in blockchain /subtensor -->
- **Default**: 0.005 (0.5%)
- **Range**: 0.0 to 1.0 (0% to 100%)
- **Purpose**: Sets the maximum allowed price change ratio for transactions

#### Safe Staking/Unstaking Mode
```bash
--safe-staking/--no-safe-staking, --safe/--unsafe
```
- **Default**: Enabled
- **Purpose**: Enables price safety checks to protect against fluctuating prices

#### Partial Execution
```bash
--allow-partial-stake/--no-allow-partial-stake, --partial/--no-partial
```
- **Default**: Disabled
- **Purpose**: Allows partial execution when full amount would exceed tolerance

#### Example CLI Commands

**Safe staking with 10% tolerance:**
```bash
btcli stake add --amount 100 --netuid 1 --safe --tolerance 0.1 --no-partial
```

**Allow partial stake if rates change:**
```bash
btcli stake add --amount 300 --safe --partial --tolerance 0.1
```

**Unsafe staking (no protection):**
```bash
btcli stake add --amount 300 --netuid 1 --unsafe
```

**Safe unstaking with protection:**
```bash
btcli stake remove --amount 100 --netuid 1 --safe --tolerance 0.1
```

**Note**: Only `btcli stake add` and `btcli stake remove` support slippage protection. Other stake commands (`stake swap`, `stake move`, `stake transfer`) do not have slippage protection parameters.

### SDK Slippage Protection

The Bittensor SDK provides **built-in slippage protection** through method parameters. The SDK methods automatically handle the translation between basic and protected blockchain extrinsics.

#### SDK Protection Parameters

**`safe_staking`** (bool):
- **Default**: False
- **Purpose**: Enables price safety checks and calls protected extrinsics

**`rate_tolerance`** (float):
- **Default**: 0.005 (0.5%)
- **Range**: 0.0 to 1.0
- **Purpose**: Maximum allowed price change ratio

**`allow_partial_stake`** (bool):
- **Default**: False
- **Purpose**: Allows partial execution when full amount exceeds tolerance

#### SDK Method Examples

**Adding stake with protection:**
```python
import bittensor as bt

subtensor = bt.Subtensor()
wallet = bt.Wallet("my_wallet")

# Safe staking with 5% tolerance
success = subtensor.add_stake(
    wallet=wallet,
    hotkey_ss58="5F...",
    netuid=1,
    amount=bt.Balance.from_tao(100),
    safe_staking=True,
    rate_tolerance=0.05,
    allow_partial_stake=False
)
```

**Removing stake with protection:**
```python
# Safe unstaking with 3% tolerance
success = subtensor.unstake(
    wallet=wallet,
    hotkey_ss58="5F...",
    netuid=1,
    amount=bt.Balance.from_tao(50),
    safe_staking=True,
    rate_tolerance=0.03,
    allow_partial_stake=True
)
```

**Moving stake between subnets:**
```python
# Safe stake movement with protection
success = subtensor.swap_stake(
    wallet=wallet,
    hotkey_ss58="5F...",
    origin_netuid=1,
    destination_netuid=2,
    amount=bt.Balance.from_tao(100),
    safe_staking=True,
    rate_tolerance=0.05,
    allow_partial_stake=False
)
```

#### How SDK Protection Works

The SDK automatically translates parameters to the appropriate blockchain calls:

**When `safe_staking=True`:**
- Calls `add_stake_limit` extrinsic (protected)
- Calculates price limits with tolerance
- Enables partial execution if specified

**When `safe_staking=False`:**
- Calls `add_stake` extrinsic (basic)
- No slippage protection

**Source**: [`bittensor/bittensor/core/extrinsics/staking.py:120-140`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/extrinsics/staking.py#L120-L140)

### Blockchain-Level Implementation

The CLI and SDK both translate to **protected blockchain extrinsics** when slippage protection is enabled:

#### Protected vs Basic Extrinsics

**Basic Extrinsics (no protection):**
- `add_stake` - Regular staking
- `remove_stake` - Regular unstaking  
- `swap_stake` - Regular stake movement

**Protected Extrinsics (with slippage limits):**
- `add_stake_limit` - Staking with price limit
- `remove_stake_limit` - Unstaking with price limit
- `swap_stake_limit` - Stake movement with price limit

#### How Protection Works

**Price Limit Calculation:**
```rust
// From subtensor/pallets/subtensor/src/staking/add_stake.rs:75-95
pub fn do_add_stake_limit(
    origin: T::RuntimeOrigin,
    hotkey: T::AccountId,
    netuid: NetUid,
    stake_to_be_added: u64,
    limit_price: u64,        // ← Price limit in RAO per Alpha
    allow_partial: bool,     // ← Allow partial execution
) -> dispatch::DispatchResult {
    // Calculate maximum amount that can be executed at limit price
    let max_amount = Self::get_max_amount_add(netuid, limit_price)?;
    let mut possible_stake = stake_to_be_added;
    if possible_stake > max_amount {
        possible_stake = max_amount;  // ← Partial execution
    }
    
    // Execute the transaction with slippage protection
    Self::stake_into_subnet(&hotkey, &coldkey, netuid, possible_stake, limit_price, true)
}
```

**Partial Execution Logic:**
- **When `allow_partial = false`**: Transaction fails if full amount can't be executed
- **When `allow_partial = true`**: Executes whatever amount fits within the price limit

#### EVM Precompile Support

Slippage protection is also available through EVM precompiles:

```solidity
// From subtensor/precompiles/src/solidity/stakingV2.sol:198-225
function addStakeLimit(
    bytes32 hotkey,
    uint256 amount,
    uint256 limit_price,
    bool allow_partial,
    uint256 netuid
) external payable;
```

## Calculating Slippage

The SDK provides methods to calculate slippage before executing transactions:

### Complete Slippage Calculation Example
```python
import bittensor as bt

# Initialize connection to the network
subtensor = bt.Subtensor()

# Get subnet information for subnet 14
subnet_info = subtensor.subnet(netuid=14)

print(f"Subnet 14 Information:")
print(f"  - Alpha in: {subnet_info.alpha_in}")
print(f"  - Alpha out: {subnet_info.alpha_out}")
print(f"  - TAO in: {subnet_info.tao_in}")
print(f"  - Price: {subnet_info.price}")
print(f"  - Emission: {subnet_info.emission}")

# Calculate slippage for staking 10 TAO
tao_amount = 10.0
print(f"\nCalculating slippage for staking {tao_amount} TAO:")

# Method 1: Get alpha received and slippage amount
alpha_received, slippage_amount = subnet_info.tao_to_alpha_with_slippage(tao_amount)
print(f"  - Alpha received: {alpha_received}")
print(f"  - Slippage amount: {slippage_amount}")

# Method 2: Get slippage percentage (relative to total transaction)
slippage_percentage = subnet_info.tao_to_alpha_with_slippage(tao_amount, percentage=True)
print(f"  - SDK slippage percentage: {slippage_percentage:.2%}")

# Method 3: Calculate traditional slippage percentage (relative to received amount)
traditional_percentage = (float(slippage_amount) / float(alpha_received)) * 100
print(f"  - Traditional slippage percentage: {traditional_percentage:.4f}%")

# Calculate slippage for unstaking 100 alpha
alpha_amount = 100.0
print(f"\nCalculating slippage for unstaking {alpha_amount} alpha:")

# Method 1: Get TAO received and slippage amount
tao_received, slippage_amount = subnet_info.alpha_to_tao_with_slippage(alpha_amount)
print(f"  - TAO received: {tao_received}")
print(f"  - Slippage amount: {slippage_amount}")

# Method 2: Get slippage percentage (relative to total transaction)
slippage_percentage = subnet_info.alpha_to_tao_with_slippage(alpha_amount, percentage=True)
print(f"  - SDK slippage percentage: {slippage_percentage:.2%}")

# Method 3: Calculate traditional slippage percentage (relative to received amount)
traditional_percentage = (float(slippage_amount) / float(tao_received)) * 100
print(f"  - Traditional slippage percentage: {traditional_percentage:.4f}%")

# Compare different amounts to see how slippage changes
print(f"\nSlippage comparison for different amounts:")
amounts = [1.0, 10.0, 50.0, 100.0]
for amount in amounts:
    alpha_received, slippage_amount = subnet_info.tao_to_alpha_with_slippage(amount)
    slippage_pct = subnet_info.tao_to_alpha_with_slippage(amount, percentage=True)
    traditional_pct = (float(slippage_amount) / float(alpha_received)) * 100
    print(f"  - {amount} TAO → {alpha_received:.2f} alpha (SDK: {slippage_pct:.2%}, Traditional: {traditional_pct:.4f}%)")
```

#### Individual Method Examples

**`tao_to_alpha_with_slippage()` - Calculate slippage for staking:**
```python
import bittensor as bt

subtensor = bt.Subtensor()
subnet_info = subtensor.subnet(netuid=14)

# Calculate slippage for staking 10 TAO
tao_amount = 10.0
alpha_received, slippage_amount = subnet_info.tao_to_alpha_with_slippage(tao_amount)
slippage_percentage = subnet_info.tao_to_alpha_with_slippage(tao_amount, percentage=True)

print(f"Staking {tao_amount} TAO:")
print(f"  Alpha received: {alpha_received}")
print(f"  Slippage: {slippage_amount}")
print(f"  SDK percentage: {slippage_percentage:.2%}")
print(f"  Traditional percentage: {(float(slippage_amount) / float(alpha_received)) * 100:.4f}%")
```

**`alpha_to_tao_with_slippage()` - Calculate slippage for unstaking:**
```python
import bittensor as bt

subtensor = bt.Subtensor()
subnet_info = subtensor.subnet(netuid=14)

# Calculate slippage for unstaking 100 alpha
alpha_amount = 100.0
tao_received, slippage_amount = subnet_info.alpha_to_tao_with_slippage(alpha_amount)
slippage_percentage = subnet_info.alpha_to_tao_with_slippage(alpha_amount, percentage=True)

print(f"Unstaking {alpha_amount} alpha:")
print(f"  TAO received: {tao_received}")
print(f"  Slippage: {slippage_amount}")
print(f"  SDK percentage: {slippage_percentage:.2%}")
print(f"  Traditional percentage: {(float(slippage_amount) / float(tao_received)) * 100:.4f}%")

# Verify the percentage calculation manually
manual_percentage = (slippage_amount / tao_received) * 100
print(f"  Manual calculation: {manual_percentage:.4f}%")
print(f"  SDK calculation: {slippage_percentage:.4f}%")
```

:::note
**Percentage Calculation**: The `percentage=True` parameter calculates slippage as a percentage of the total transaction value: `100 * slippage / (slippage + received_amount)`. This represents the proportion of slippage relative to the entire transaction, not just the received amount.

**Source**: [`bittensor/bittensor/core/chain_data/dynamic_info.py:175-185`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/chain_data/dynamic_info.py#L175-L185)

For the traditional slippage percentage (relative to received amount), use: `100 * slippage_amount / received_amount`.
:::

## Best Practices

1. **Set Reasonable Tolerances**: Use 0.5-5% for most operations
2. **Monitor Liquidity**: Check pool liquidity before large transactions
3. **Use Partial Execution**: Enable for large amounts to ensure some execution
4. **Test Small Amounts**: Start with small transactions to understand slippage
5. **Check Current Prices**: Verify market conditions before executing

## Error Handling

**Common Error Messages:**
- `"Price exceeded tolerance limit"`: Increase tolerance or enable partial execution
- `"Slippage is too high"`: Reduce transaction size or increase tolerance
- `"Insufficient liquidity"`: Try smaller amounts or different timing

**Troubleshooting:**
```python
try:
    success = subtensor.add_stake(
        wallet=wallet,
        amount=bt.Balance.from_tao(100),
        safe_staking=True,
        rate_tolerance=0.05
    )
except Exception as e:
    if "SlippageTooHigh" in str(e):
        # Increase tolerance or reduce amount
        pass
    elif "InsufficientLiquidity" in str(e):
        # Try smaller amount or wait for better conditions
        pass
```

## Code References

### BTCLI Commands
- [`btcli stake add`](../btcli/btcli-playground.md#stake-add) - Staking with slippage protection
- [`btcli stake remove`](../btcli/btcli-playground.md#stake-remove) - Unstaking with slippage protection

**Note**: Only `stake add` and `stake remove` support slippage protection. Other stake commands (`stake swap`, `stake move`, `stake transfer`) do not have slippage protection parameters.

### SDK Methods (With Slippage Protection)
- [`bittensor.core.subtensor.Subtensor.add_stake()`](pathname:///python-api/html/autoapi/bittensor/core/subtensor/index.html) - Staking with protection
- [`bittensor.core.subtensor.Subtensor.unstake()`](pathname:///python-api/html/autoapi/bittensor/core/subtensor/index.html) - Unstaking with protection
- [`bittensor.core.subtensor.Subtensor.swap_stake()`](pathname:///python-api/html/autoapi/bittensor/core/subtensor/index.html) - Stake movement with protection

### SDK Calculation Methods
- [`bittensor.core.chain_data.dynamic_info.DynamicInfo.tao_to_alpha_with_slippage()`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/chain_data/dynamic_info.py#L130-L185) - Staking slippage calculation
- [`bittensor.core.chain_data.dynamic_info.DynamicInfo.alpha_to_tao_with_slippage()`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/chain_data/dynamic_info.py#L187-L238) - Unstaking slippage calculation

### Implementation References

**CLI Implementation:**
- [`btcli/bittensor_cli/src/commands/stake/add.py`](https://github.com/opentensor/btcli/blob/main/bittensor_cli/src/commands/stake/add.py) - CLI staking with protection
- [`btcli/bittensor_cli/src/commands/stake/remove.py`](https://github.com/opentensor/btcli/blob/main/bittensor_cli/src/commands/stake/remove.py) - CLI unstaking with protection

**Blockchain Implementation (Protected Extrinsics):**
- [`subtensor/pallets/subtensor/src/staking/add_stake.rs:75-95`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/add_stake.rs#L75-L95) - `do_add_stake_limit` function
- [`subtensor/pallets/subtensor/src/staking/remove_stake.rs:286-380`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/remove_stake.rs#L286-L380) - `do_remove_stake_limit` function
- [`subtensor/pallets/subtensor/src/staking/move_stake.rs:268-317`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/move_stake.rs#L268-L317) - `do_swap_stake_limit` function

**Blockchain Implementation (Basic Extrinsics):**
- [`subtensor/pallets/subtensor/src/staking/add_stake.rs:25-70`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/add_stake.rs#L25-L70) - `do_add_stake` function
- [`subtensor/pallets/subtensor/src/staking/remove_stake.rs:25-285`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/remove_stake.rs#L25-L285) - `do_remove_stake` function
- [`subtensor/pallets/subtensor/src/staking/move_stake.rs:25-267`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/move_stake.rs#L25-L267) - `do_swap_stake` function

**EVM Precompile Implementation:**
- [`subtensor/precompiles/src/solidity/stakingV2.sol:198-225`](https://github.com/opentensor/subtensor/blob/main/precompiles/src/solidity/stakingV2.sol#L198-L225) - Solidity interface
- [`subtensor/precompiles/src/staking.rs:320-340`](https://github.com/opentensor/subtensor/blob/main/precompiles/src/staking.rs#L320-L340) - Rust precompile implementation
>>>>>>> fe04126b5 (wip)
