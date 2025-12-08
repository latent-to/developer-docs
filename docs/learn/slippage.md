---
title: "Understanding Slippage"
---

import { SdkVersion } from "../sdk/_sdk-version.mdx";

# Understanding Slippage

## Introduction

When staking and unstaking in Bittensor, _slippage_ refers to a difference between the quantity of tokens actually received, and the amount that would be expected based on a static price. This difference is due to the change in price due to the transaction itself.

Each Bittensor subnet operates as a _constant product AMM_, meaning that it will accept trades that conserve the product of the quantities of the two tokens in reserve, TAO and alpha. To calculate the price in one token of batch of the other token that a buyer wishes to acquire—alpha if they are staking, or TAO if they are unstaking—the algorithm assumes that the transaction does not change this product, so the product of TAO and alpha is the same before and after.

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

    For example, suppose that a subnet has 100 alpha in reserve and 10 TAO, and we want to stake in 5 TAO.

    The price at this moment is 10 TAO / 100 alpha, or 10 alpha per TAO, so if we stake 5 TAO, we would expect 50 alpha, without taking slippage into account.

    With slippage, the actual alpha received will be less than 50 due to the price impact of the transaction.

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

</details>

## Calculating Slippage with the SDK

<SdkVersion />

You can use Bittensor's SDK to calculate expected slippage before executing transactions:

### For Staking Operations

```python
import bittensor as bt

# Connect to network
subtensor = bt.Subtensor()
subnet_info = subtensor.subnet(netuid=1)

# Calculate slippage for staking 10 TAO
amount_tao = 10.0
slippage_percentage = subnet_info.tao_to_alpha_with_slippage(amount_tao, percentage=True)
print(f"Expected slippage for staking {amount_tao} TAO: {slippage_percentage:.2%}")

# Get detailed breakdown
alpha_received, slippage_amount = subnet_info.tao_to_alpha_with_slippage(amount_tao)
ideal_alpha = subnet_info.tao_to_alpha(amount_tao)
print(f"Alpha received: {alpha_received}")
print(f"Slippage amount: {slippage_amount}")
print(f"Ideal (no slippage): {ideal_alpha}")
```

### For Unstaking Operations

```python
# Calculate slippage for unstaking 100 alpha
amount_alpha = bt.Balance.from_tao(100).set_unit(1)
slippage_percentage = subnet_info.alpha_to_tao_with_slippage(amount_alpha, percentage=True)
print(f"Expected slippage for unstaking {amount_alpha} alpha: {slippage_percentage:.2%}")

# Get detailed breakdown
tao_received, slippage_amount = subnet_info.alpha_to_tao_with_slippage(amount_alpha)
ideal_tao = subnet_info.alpha_to_tao(amount_alpha)
print(f"TAO received: {tao_received}")
print(f"Slippage amount: {slippage_amount}")
print(f"Ideal (no slippage): {ideal_tao}")
```
