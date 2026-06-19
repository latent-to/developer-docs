---
title: "Subnet AMM: Balancer Weighted Pool"
---

# Subnet AMM: Balancer Weighted Pool

Each Bittensor subnet maintains an automated market maker (AMM) pool with TAO and Alpha reserves. This pool executes every stake and unstake operation — when you stake TAO, the pool converts it to Alpha; when you unstake, it converts Alpha back to TAO.

The pool uses a **Balancer weighted pool** model. Unlike a simple constant-product AMM or Uniswap V3 concentrated liquidity, the Balancer model uses pool weights to decouple price from the raw reserve ratio, which allows the protocol to add liquidity in any proportion without moving the price.

## Pool State

Each subnet pool is defined by three values:

| Parameter | Description |
|-----------|-------------|
| `alpha_reserve` (x) | Alpha tokens held in the pool |
| `tao_reserve` (y) | TAO held in the pool |
| `w_base`, `w_quote` | Pool weights where `w_base + w_quote = 1` |

The weights are stored as a single `w_quote` value (18-decimal precision); `w_base = 1 - w_quote`. Both weights are bounded to **[0.01, 0.99]**. The default at pool initialization is 0.5/0.5 (equal weight).

## Price

The spot price of Alpha in TAO is:

$$
p = \frac{w_{\text{base}}}{w_{\text{quote}}} \cdot \frac{\tau}{\alpha}
$$

With equal weights (0.5/0.5), this simplifies to `p = TAO / alpha` — the same as a constant-product pool.

## Swap Formulas

### Selling Alpha to get TAO (unstaking)

Given an input of `∆alpha` Alpha tokens, the TAO payout is:

$$
\Delta\tau = \tau \cdot \left(1 - \left(\frac{\alpha}{\alpha + \Delta\alpha}\right)^{w_{\text{base}}/w_{\text{quote}}}\right)
$$

### Buying Alpha with TAO (staking)

Given an input of `∆TAO`, the Alpha payout is:

$$
\Delta\alpha = \alpha \cdot \left(1 - \left(\frac{\tau}{\tau + \Delta\tau}\right)^{w_{\text{quote}}/w_{\text{base}}}\right)
$$

With default equal weights (0.5/0.5), the exponent is 1 in both formulas, which reduces to the constant-product result `∆y = y * ∆x / (x + ∆x)`. The weights only diverge from 0.5/0.5 when the protocol adds liquidity in a proportion that does not match the current price.

## Weight Updates

When the protocol adds liquidity to a pool in a proportion that does not match the current price, the weights are updated to keep the spot price unchanged. The new weights are computed from the updated reserves:

$$
w_{\text{quote}}^{\text{new}} = \frac{\tau^{\text{new}}}{p \cdot \alpha^{\text{new}} + \tau^{\text{new}}}
$$

where `p` is the price before the addition. This means that adding disproportionate liquidity shifts the weights rather than moving the price.

## Limit Orders and Slippage Control

Swaps can be bounded by a price limit. When a limit price is set, the pool calculates exactly how much can be swapped before the price reaches the limit:

- **Selling with a floor price `p'`**: `∆alpha_max = alpha * ((p / p')^w_quote - 1)`
- **Buying with a ceiling price `p'`**: `∆TAO_max = TAO * ((p' / p)^w_base - 1)`

If the requested swap amount would push the price past the limit, only the portion up to the limit executes. See [Price Protection](./price-protection.md) for how to use these limits via the CLI and SDK.

## Liquidity Ownership

All pool liquidity is protocol-owned. There are no user liquidity positions or LP tokens. The protocol initializes each pool when a subnet launches, and the runtime can inject additional liquidity via governance.

## Fees

A swap fee is charged on each stake and unstake operation. The fee rate is set per subnet (default ≈ 0.05%) and is applied to the input amount before the swap formula is evaluated. The fee goes to the block author.

To compute the fee on an input amount `a` at fee rate `r` (stored as a `u16` where the full range is 0–65535):

$$
\text{fee} = a \cdot \frac{r}{65535}
$$

The effective input to the swap formula is `a - fee`.

## Relationship to Slippage

Slippage arises because the AMM price changes as reserves move. For a given swap size, slippage is higher when reserves are small relative to the trade. See [Understanding Slippage](./slippage.md) for worked examples.
