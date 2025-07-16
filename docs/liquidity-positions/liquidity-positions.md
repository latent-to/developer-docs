---
title: User Liquidity Positions (Uniswap)
---

# User Liquidity Positions (Uniswap)

## Overview

The Liquidity Position feature allows users to provide trading liquidity for specific subnets, within specified price ranges for the subnet $\alpha$ token. This system is based on Uniswap V3's concentrated liquidity model and enables providers to earn fees from trading activity.

By creating a liquidity position (LP), any TAO holder can contribute to the health of a subnet by providing liquidity for efficient trading, thereby earning fees from trading activity.

Liquidity providers participate by creating liquidity positions (LPs). Each LP is defined by its:
- **Price Range**: Defined by `price_low` and `price_high` in TAO
- **Liquidity Amount**: The total liquidity provided
- **Position ID**: Unique identifier for the position
- **Fee Tracking**: Separate tracking for TAO and Alpha fees earned

### Liquidity Positions vs. Staking

While both staking and liquidity provision involve committing tokens to support the Bittensor network, they serve different purposes and operate through distinct mechanisms.

**Staking** is designed to support validators and miners by providing them with consensus power. When you stake TAO to a validator, you're essentially voting for that validator's participation in the subnet's consensus mechanism. The validator's total stake (including your delegation) determines their share of emissions and influence in the network.

Stakers earn emissions off of their stake, which are distributed each tempo.

**Liquidity provision**, on the other hand, is focused on market making and trading facilitation. By providing liquidity to a subnet's trading pool, you're enabling other users to trade between TAO and the subnet's Alpha tokens. This creates a more liquid market and improves price discovery for the subnet's token.

Liquidity providers earn fees when others stake or unstake within the price range defined on the position.

:::note
Subnet creators can enable and disable user liquidity provision via the `toggle_user_liquidity` function.

[See source code](https://github.com/opentensor/bittensor/blob/staging/bittensor/core/extrinsics/asyncex/liquidity.py#L187-L232)
:::

## Tokenomics



### Dynamic token composition

A liquidity position (LP) can hold TAO, alpha, or both. This depends on the subnet's current token price relative to the range specified for the LP when it was created.

**Price Below Range** (`current_price < price_low`):
   - Position becomes **100% Alpha tokens**
   - `amount_alpha = liquidity * (1/sqrt_price_low - 1/sqrt_price_high)`
   - `amount_tao = 0`

**Price Above Range** (`current_price > price_high`):
   - Position becomes **100% TAO tokens**
   - `amount_alpha = 0`
   - `amount_tao = liquidity * (sqrt_price_high - sqrt_price_low)`

**Price Within Range** (`price_low <= current_price <= price_high`):
   - Position maintains **mixed token composition**
   - `amount_alpha = liquidity * (1/sqrt_current_price - 1/sqrt_price_high)`
   - `amount_tao = liquidity * (sqrt_current_price - sqrt_price_low)`

<details>
  <summary>See how it's computed</summary>

The `LiquidityPosition.to_token_amounts()` method shows how token composition changes based on current price vs. range boundaries.

```python
def to_token_amounts(
        self, current_subnet_price: Balance
    ) -> tuple[Balance, Balance]:
    sqrt_price_low = math.sqrt(self.price_low)
    sqrt_price_high = math.sqrt(self.price_high)
    sqrt_current_subnet_price = math.sqrt(current_subnet_price)

    if sqrt_current_subnet_price < sqrt_price_low:
        amount_alpha = self.liquidity * (1 / sqrt_price_low - 1 / sqrt_price_high)
        amount_tao = 0
    elif sqrt_current_subnet_price > sqrt_price_high:
        amount_alpha = 0
        amount_tao = self.liquidity * (sqrt_price_high - sqrt_price_low)
    else:
        amount_alpha = self.liquidity * (
            1 / sqrt_current_subnet_price - 1 / sqrt_price_high
        )
        amount_tao = self.liquidity * (sqrt_current_subnet_price - sqrt_price_low)
    return Balance.from_rao(int(amount_alpha), self.netuid), Balance.from_rao(
        int(amount_tao)
    )

```
[See source code](https://github.com/opentensor/bittensor/blob/staging/bittensor/utils/liquidity.py#L28-L58)
</details>

### Fees

Liquidity providers earn fees from trading activity within their price range: 

- **TAO Fees**: Fees earned in TAO tokens
- **Alpha Fees**: Fees earned in Alpha tokens
- **Fee Distribution**: Proportional to liquidity provided and trading volume

The `calculate_fees()` function calculates both TAO and Alpha fees based on global fee data and position liquidity.

[See source code](https://github.com/opentensor/bittensor/blob/staging/bittensor/utils/liquidity.py#L130-L158)


## Liquidity Position Lifecycle

### Creating a Position

When creating a liquidity position, users provide liquidity in the form of a single `liquidity` parameter (in RAO). The system automatically calculates and charges the appropriate amounts of TAO and Alpha tokens from the user's wallet based on the current price.

1. User calls `add_liquidity()` with `liquidity`, `price_low`, and `price_high` parameters
2. System converts price range to tick indices using `price_to_tick()` 
3. System calculates required TAO and Alpha amounts based on current price and range
4. Tokens are transferred from user's wallet to the liquidity pool
5. A new `LiquidityPosition` is created with a unique `position_id`

[See source code](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/swap/src/pallet/impls.rs#L807):

### Modifying a Position

Position management through `modify_liquidity` allows you to adjust existing positions. When adding liquidity with a positive `liquidity_delta`, additional TAO and Alpha tokens are transferred from your wallet and the position's liquidity field is updated. When removing liquidity with a negative `liquidity_delta`, the system calculates the exact TAO and Alpha token amounts based on the current price and your position's price range using the same mathematical formulas as position creation [See source code](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/swap/src/pallet/impls.rs#L952-L958). These calculated amounts are returned to your wallet and the position's liquidity field is updated.

[See source code](https://github.com/opentensor/bittensor/blob/staging/bittensor/core/extrinsics/asyncex/liquidity.py#L74-L125)

### Fee Accumulation and Distribution

Fees are generated when users perform swaps (trading TAO for Alpha or vice versa) within your position's price range. The fee accumulation and distribution system works as follows:

#### Fee Generation
Fees are calculated per swap transaction using the subnet's fee rate (default 0.3% or 196/65535) [See source code](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/swap/src/pallet/impls.rs#L554-L566). When a swap occurs, the `add_fees()` function distributes the fee proportionally to all active liquidity providers based on their share of the current liquidity [See source code](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/swap/src/pallet/impls.rs#L567-L597).

#### Fee Tracking
The system maintains two levels of fee tracking:
- **Global Fee Counters**: `FeeGlobalTao` and `FeeGlobalAlpha` track total fees accumulated across the entire subnet [See source code](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/swap/src/pallet/mod.rs#L80-L84)
- **Tick-Level Tracking**: Individual ticks record the global fee state when they are crossed, enabling precise fee calculation for positions [See source code](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/swap/src/position.rs#L130-L140)

#### Fee Calculation
Each position calculates its earned fees using the `collect_fees()` method, which:
1. Determines the fees accumulated within the position's price range
2. Subtracts previously collected fees to get the new fees earned
3. Multiplies by the position's liquidity share to get the final fee amount [See source code](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/swap/src/position.rs#L110-L128)

#### Fee Distribution
**Fees are NOT distributed automatically per tempo like emissions.** Instead, fees are only distributed when you actively interact with your position:

- **When modifying a position** (adding or removing liquidity): All accumulated fees are automatically collected and sent to your wallet [See source code](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/swap/src/pallet/mod.rs#L520-L535)
- **When removing a position entirely**: All accumulated fees are collected along with your position's tokens [See source code](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/swap/src/pallet/mod.rs#L410-L415)

:::tip
Fees are **NOT added to your position's liquidity**.
:::

Fees are tracked in the position's `fees_tao` and `fees_alpha` fields and are only distributed to your wallet when you perform a position operation. This means your position's token composition and liquidity remain unchanged by fee accumulation - only the fee tracking variables are updated [See source code](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/swap/src/position.rs#L110-L128).

This means you must actively manage your positions to claim your earned fees - they remain locked in the position until you perform a position operation (modify or remove).

### Removing a Position

When a position is destroyed/removed, the position's liquidity is converted back to tokens based on the current subnet price relative to your position's price range. The position is then deleted from the system.

[See source code](https://github.com/opentensor/bittensor/blob/staging/bittensor/core/extrinsics/asyncex/liquidity.py#L127-L185)

