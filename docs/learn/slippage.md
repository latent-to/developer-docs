---
title: "Understanding Slippage"
---

# Understanding Slippage

## Introduction

When staking and unstaking in Bittensor, *slippage* refers to a difference between the quantity of tokens actually received, and the amount that would be expected based on a static price. This difference is due to the change in price due to the transaction itself.

Each Bittensor subnet operates as a *constant product AMM*, meaning that it will accept trades that conserve the product of the quantities of the two tokens in reserve, TAO and alpha. To calulate the price in one token of batch of the other token that a buyer wishes to acquire&mdash;alpha if they are staking, or TAO if they are unstaking&mdash;the algorithm assumes that the transaction does not change this product, so the product of TAO and alpha is the same before and after.
<details>
  <summary><strong>See how it's calculated!</strong></summary>

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
</details>

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

### Quick Example by Mode

Consider a hypothetical example, attempting to stake 1000 TAO when slippage would be 8% for the full amount, with tolerance set to 5%:

| Mode | Outcome  |
|----------------------|------|
|Safe |Transaction rejected entirely (8% > 5% tolerance)|
|Partial |Stakes ~625 TAO (amount that fits within 5% tolerance)  |
|Unsafe |Stakes full 1000 TAO regardless of 8% slippage|

## Slippage Example

:::info
**Simplified Example**: The following example uses simplified calculations for illustration. Bittensor's actual AMM uses complex Uniswap V3-style mathematics with concentrated liquidity and tick-based pricing.
:::

For example, suppose that a subnet has 100 alpha in reserve and 10 TAO, and we want to stake in 5 TAO.

The price at this moment is 10 TAO / 100 alpha, or 10 alpha per TAO, so if we stake 5 TAO, we would expect 50 alpha, without taking slippage into account.

With slippage, the actual alpha received will be less than 50 due to the price impact of the transaction. The exact amount depends on the current liquidity distribution across price ticks and the specific AMM mathematics.

In general, slippage is high when:
- Available liquidity is limited compared to the transaction size
- The transaction moves the price significantly across multiple ticks
- Liquidity is concentrated in narrow price ranges

$$
\text{Stake} = 100 - \frac{ 10 * 100} {10 + 5}
$$

or 33.333 alpha sent to the hotkey. So in this case, the slippage is the difference between the ideal expectation of 50 and the actual swap value of 33.33333:

$$
16.667 = 50 - 33.333
$$

This slippage is 50% of the actual swap value, which is extremely high, 
because we chose small values for the available liquidity. In general, 
slippage is high when available liquidity is limited compared to the 
magnitude of the transaction, since the transaction itself is changing the 
price significantly.

:::note
**Real Calculation**: Bittensor's SDK provides accurate slippage calculations using the actual AMM implementation. The `tao_to_alpha_with_slippage()` and `alpha_to_tao_with_slippage()` methods use the real chain state and AMM mathematics.
:::

## Managing Slippage with BTCLI

The `btcli stake` interface provides parameters to control slippage protection modes.

:::tip
`btcli` shows the slippage of staking and unstaking operations, so you don't need to calculate it yourself. 
:::

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


## Managing Slippage

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

The SDK provides methods to calculate slippage before executing transactions.

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

**AMM Implementation:**
- [`SwapInterface`](https://github.com/opentensor/subtensor/blob/main/pallets/swap-interface/src/lib.rs) - Core AMM interface
- [`Swap Pallet`](https://github.com/opentensor/subtensor/blob/main/pallets/swap/src/pallet/impls.rs) - Uniswap V3-style AMM implementation
- [`do_swap`](https://github.com/opentensor/subtensor/blob/main/pallets/swap/src/pallet/impls.rs#L421-L460) - Core swap function with complex AMM mathematics
- [`stake_into_subnet`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/stake_utils.rs#L820-L860) - Staking function that uses AMM swap

**Transaction Pool & MEV-Related Implementation:**
- [Transaction Pool API](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1857-L1872) - Where mempool validation happens
- [Priority Calculation](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1796-L1813) - How MEV bots can gain priority
- [Transaction Validation](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L2115-L2137) - Where stake amounts determine priority

**EVM Precompile Implementation:**
- [`subtensor/precompiles/src/solidity/stakingV2.sol:198-225`](https://github.com/opentensor/subtensor/blob/main/precompiles/src/solidity/stakingV2.sol#L198-L225)
- [`subtensor/precompiles/src/staking.rs:320-340`](https://github.com/opentensor/subtensor/blob/main/precompiles/src/staking.rs#L320-L340)

## Sandwich Attack Protection

**Maximal Extractable Value (MEV)** represents profits that can be extracted by reordering, including, or excluding transactions within blocks. In AMM systems like Bittensor's subnets, the most common MEV attack is the **sandwich attack**, where bots exploit the predictable slippage from large transactions.

### Understanding Sandwich Attacks

Sandwich attacks exploit the fact that pending transactions are visible in the **mempool** before execution, allowing attackers to predict and profit from price movements.

#### How Sandwich Attacks Work

1. **Mempool Monitoring**: MEV bots continuously scan the mempool for large pending transactions
2. **Front-Running**: Bots submit higher-priority transactions that execute before the victim's transaction
3. **Rate Limiting Protection**: Bittensor's rate limiting prevents staking and unstaking in the same block, forcing bots to wait for subsequent blocks
4. **Delayed Profit Extraction**: The victim's transaction causes slippage that the bot captures in later blocks

#### Sandwich Attack Example

Let's examine a concrete example using Bittensor's AMM mechanics:

**Initial State:**
- Subnet X has 1000 alpha in reserve, 100 TAO in reserve
- Current price: 0.1 TAO per alpha
- Alice wants to stake 50 TAO (a large transaction)

**Step 1: MEV Bot Observes Alice's Transaction**
```
Mempool: [Alice: "stake 50 TAO in subnet X"]
MEV Bot calculates: "Alice will cause significant slippage, I can profit"
```

**Step 2: MEV Bot Front-Runs Alice**
```
MEV Bot submits: "stake 10 TAO in subnet X" with HIGHER PRIORITY

Execution order will be:
1. MEV Bot stakes 10 TAO (higher priority)
2. Alice stakes 50 TAO (original priority)  
3. MEV Bot must wait for next block due to rate limiting
4. MEV Bot unstakes equivalent alpha (on subsequent block)
```

**Step 3: Block Execution Sequence**

```
Block N - Before any transactions:
- Pool: 1000 alpha, 100 TAO
- Price: 0.1 TAO per alpha

Block N - Transaction 1 - MEV Bot stakes 10 TAO:
- Alpha received = 852,312.67 - (852,312.67 × 20,360.56)/(20,360.56 + 10) = 418.40 alpha
- Pool state: 851,894.27 alpha, 20,370.56 TAO
- New price: 0.023912 TAO per alpha

Block N - Transaction 2 - Alice stakes 50 TAO:
- Alpha received = 851,894.27 - (851,894.27 × 20,370.56)/(20,370.56 + 50) = 2,085.87 alpha  
- Pool state: 849,808.39 alpha, 20,420.56 TAO
- New price: 0.024030 TAO per alpha

Block N+1 - Transaction 3 - MEV Bot unstakes 418.40 alpha (rate limiting enforced):
- TAO received = 20,420.56 - (849,808.39 × 20,420.56)/(849,808.39 + 418.40) = 10.05 TAO
- MEV Bot profit: 10.05 - 10 = 0.05 TAO (0.5% return)
```

**The Victim:**
- Alice expected ~2,092 alpha at 0.023889 TAO per alpha
- Alice actually received 2,085.87 alpha (0.3% slippage)
- **Surprisingly, Alice actually benefited slightly from the MEV bot's presence**
- This demonstrates how rate limiting and realistic pool sizes provide strong protection

**The MEV Bot's Profit Strategy:**
- Bot bought 418.40 alpha for 10 TAO when price was 0.023889 TAO per alpha  
- Alice's large transaction pushed the price up to 0.024030 TAO per alpha
- Bot must wait for the next block due to rate limiting (cannot stake and unstake in same block)
- Bot can now sell their 418.40 alpha at this inflated price for 10.05 TAO
- **This price spike caused by Alice is the entire source of profit**
- Without Alice's transaction, there would be no profitable price movement to exploit
- **Rate limiting combined with realistic pool sizes makes this attack much less profitable**

**Source**: [Subtensor transaction pool implementation](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1857-L1872)

>>>>>>> 1754aa097 (wip)
