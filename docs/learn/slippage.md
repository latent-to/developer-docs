---
title: "Understanding Slippage"
---

import { SdkVersion } from "../sdk/_sdk-version.mdx";

# Understanding Slippage

## Introduction

When staking and unstaking in Bittensor, _slippage_ refers to the difference between the quantity of tokens actually received and the amount that would be expected at the static spot price. This difference arises because the transaction itself changes the pool's reserves, and therefore the price.

Each Bittensor subnet operates a **Balancer weighted pool AMM**. The spot price and swap output are determined by the pool's TAO reserves, Alpha reserves, and a pair of pool weights (`w_base`, `w_quote`). See [Subnet AMM: Balancer Weighted Pool](./balancer-amm.md) for the full model.

For the default case where pool weights are equal (0.5/0.5), the swap formula reduces to a constant-product result, so slippage behaves identically to a `xy = k` AMM. The worked example below uses this default case.

<details>
  <summary><strong>See how it's calculated!</strong></summary>

  The output of a swap is given by the Balancer formula. When staking `∆τ` TAO, the Alpha received is:

  $$
  \Delta\alpha = \alpha \cdot \left(1 - \left(\frac{\tau}{\tau + \Delta\tau}\right)^{w_{\text{quote}}/w_{\text{base}}}\right)
  $$

  With equal weights (0.5/0.5), the exponent is 1 and this simplifies to:

  $$
  \Delta\alpha = \alpha - \frac{\tau \cdot \alpha}{\tau + \Delta\tau}
  $$

  For example, suppose a subnet has 100 Alpha in reserve and 10 TAO, and you want to stake 5 TAO.

  The spot price is 10 TAO / 100 Alpha = 0.1 TAO per Alpha (or 10 Alpha per TAO), so at the static price you would expect 50 Alpha for 5 TAO.

  With slippage, the actual Alpha received is:

  $$
  \Delta\alpha = 100 - \frac{10 \times 100}{10 + 5} = 100 - \frac{1000}{15} \approx 33.33
  $$

  The slippage is the gap between the ideal and actual amounts:

  $$
  50 - 33.33 = 16.67 \text{ Alpha}
  $$

  This is 50% of the actual swap value — extremely high because the trade is large relative to the pool's reserves. In general, slippage increases as trade size grows relative to available liquidity.

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
