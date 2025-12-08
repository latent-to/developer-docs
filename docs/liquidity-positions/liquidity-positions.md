---
title: User Liquidity Positions (Uniswap)
---

import { SdkVersion } from "../sdk/_sdk-version.mdx";

# User Liquidity Positions (Uniswap)

## Overview

The Liquidity Position feature allows users to provide trading liquidity for specific subnets, within specified price ranges for the subnet $\alpha$ token. This system is based on Uniswap V3's concentrated liquidity model and enables providers to earn fees from trading activity.

Any TAO holder can contribute to the health of a subnet by creating a Liquidity Position (LP), to provide liquidity for staking/unstaking and stabilizing the subnet's token price. Liquidity positions accumulate fees when users stake and unstake within the defined price range, which the creator of the LP can subsequently withdraw into their wallet.

Subnet creators can enable/disable the liquidity positions feature on their subnets.

:::tip
A LP does not accumulate fees for staking operations by the coldkey that owns it.
:::

See also:

- [Managing User Liquidity Positions Tutorial](./managing-liquidity-positions.md).

### Liquidity Positions vs. Staking

When you stake TAO to a validator, you're essentially voting for that validator's participation in the subnet's consensus mechanism. The validator's total stake (including your delegation) determines their share of emissions and influence in the network.

Stakers earn emissions off of their stake, which are distributed each tempo.

Liquidity Positions earn fees when others stake or unstake within the price range defined on the position.

By providing liquidity to a subnet's trading pool, you're enabling other users to trade between TAO and the subnet's Alpha tokens, creating more liquid market conditions for the subnet and helping to stabilize the subnet's token price.

### Dynamic token composition

A liquidity position (LP) can hold TAO, alpha, or both. This depends on the subnet's current token price relative to the range specified for the LP when it was created.

This compositions represents the token requirements for creating an LP depending, as well as token yield from removing liquidity form the position, depending on the token price relative to the LP's price window, at the block when the transaction executes.

**Price below range** (`current_price < price_low`):

- Position becomes **100% Alpha tokens**
- `amount_alpha = liquidity * (1/sqrt_price_low - 1/sqrt_price_high)`
- `amount_tao = 0`

**Price within range** (`price_low <= current_price <= price_high`):

- Position maintains **mixed token composition**
- `amount_alpha = liquidity * (1/sqrt_current_price - 1/sqrt_price_high)`
- `amount_tao = liquidity * (sqrt_current_price - sqrt_price_low)`

**Price above range** (`current_price > price_high`):

- Position becomes **100% TAO tokens**
- `amount_alpha = 0`
- `amount_tao = liquidity * (sqrt_price_high - sqrt_price_low)`

[See source code](https://github.com/opentensor/bittensor/blob/master/bittensor/utils/liquidity.py#L28-L58)

## Liquidity Position Lifecycle

### Creating Positions

To create an LP, the user specifies a _liquidity_ parameter, which is converted into some combination of TAO and alpha token balances. TAO are taken from the users coldkey, alpha tokens are taken from the hotkey on which the Liquidity Position was created, and they are locked up in the LP.

### Modifying a Position

Its creator can modify an existing LP by adding or removing liquidity. The same formula is applied to determine the required tokens when adding liquidity, and to determine the yield of tokens when exiting liquidity, as when creating the LP.

### Fee Accumulation

Fees are generated when users perform swaps (trading TAO for Alpha or vice versa) within their position's price range.

:::tip
Fees are not added to your position's liquidity, they are tracked separately, in the position's `fees_tao` and `fees_alpha` fields.

See: [Managing User Liquidity Positions Tutorial: View your LPs](./managing-liquidity-positions.md#view-your-lps)
:::

<!--

- **Global Fee Counters**: `FeeGlobalTao` and `FeeGlobalAlpha` track total fees accumulated across the entire subnet [See source code](https://github.com/opentensor/subtensor/blob/master/pallets/swap/src/pallet/mod.rs#L80-L84)
- **Tick-Level Tracking**: Individual ticks record the global fee state when they are crossed, enabling precise fee calculation for positions [See source code](https://github.com/opentensor/subtensor/blob/master/pallets/swap/src/position.rs#L130-L140)
 -->

The blockchain calculates fees for each position based on:

- Quantity staked/unstaked, tao/alpha respectively
- The the position's liquidity relative to other LPs that have their price range include the transaction.

[See source code](https://github.com/opentensor/subtensor/blob/master/pallets/swap/src/position.rs#L110-L128)

#### Fee Distribution

Fees are not distributed automatically per tempo like emissions. Instead, fees are only distributed to your wallet when you actively withdraw liquidity:

- **When modifying a position** (adding or removing liquidity): All accumulated fees are automatically collected and sent to your wallet.
  [See source code](https://github.com/opentensor/subtensor/blob/master/pallets/swap/src/pallet/mod.rs#L410-L415)

- **When removing a position entirely**: All accumulated fees are collected along with your position's tokens.
  [See source code](https://github.com/opentensor/subtensor/blob/master/pallets/swap/src/pallet/mod.rs#L520-L535)

This means you must actively manage your positions to claim your earned fees - they remain locked in the position until you perform a position operation (modify or remove).

### Removing a Position

When a position is destroyed/removed, the position's liquidity is converted back to tokens based on the current subnet price relative to your position's price range. The position is then deleted from the system.

[See source code](https://github.com/opentensor/bittensor/blob/master/bittensor/core/extrinsics/asyncex/liquidity.py#L127-L185)

## The `liquidity` Parameter

<SdkVersion />

The `liquidity` parameter that defines a LP is **not** an amount of TAO or Alpha tokens (or even a sum of the two). Instead, it's a mathematical scaling factor from Uniswap V3's concentrated liquidity model, which calculates the token amounts deducted from your hotkey and coldkey (alpha and TAO respectively) when creating a LP.

The actual TAO and Alpha amounts that get locked are calculated by the `to_token_amounts()` function, represented below in pseudocode.

:::note
The composition of the tokens required to create an LP depends on the current token price.
:::

```python
if current_price < price_low {
    # Only Alpha tokens required
    alpha_amount = liquidity * (1/√price_low - 1/√price_high)
    tao_amount = 0
} else if current_price > price_high {
    # Only TAO tokens required
    tao_amount = liquidity * (√price_high - √price_low)
    alpha_amount = 0
} else {
    # Both TAO and Alpha required
    tao_amount = liquidity * (√current_price - √price_low)
    alpha_amount = liquidity * (1/√current_price - 1/√price_high)
}
```

See also:

- [See source code](https://github.com/opentensor/subtensor/blob/master/pallets/swap/src/position.rs#L80-L122)
