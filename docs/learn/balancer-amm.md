---
title: "Balancer Weighted Pools for Subnet AMMs"
---

# Balancer Weighted Pools for Subnet AMMs

Each Bittensor subnet maintains an automated market maker (AMM) with [reserve pools](../subnets/understanding-subnets#liquidity-pools) of TAO and the subnet's alpha token.

A constant product AMM can be seen as similar to a scale that sets the price of a swap by weighing the two pools against each other. When the TAO and alpha pools are balanced, the price is even. Staking in, adding TAO and taking alpha from the respective pools, tilts the scale toward TAO (the pool is now heavier). The angle of the scale determines the price: the more people stake TAO and take alpha, the price of alpha (alpha's position in vertical space) goes up.

In any AMM, the price tends to 'slide' back down toward even, since a higher price exerts sell pressure. In a constant product AMM, the price is determined by the ratio of TAO and alpha, so the balance point is where they are even, i.e. in a 50/50 ratio, by their *value* (i.e. token quantities adjusted by price, so for example 100 TAO and 1000 alpha at a price of 0.1 TAO per alpha are in a 50/50 ratio).

Balancer AMM allows the balance point of the scale to shift away from even 50/50 to reflect the value of the subnet on the marketplace of alpha tokens within Bittensor.

:::note Mathematical limits of the analogy
The analogy between an AMM and a scale is helpful but limited, since the scale's behavior is a bit simpler.
A physical balance scale is linear: the angle of tilt is proportional to the mass difference between the two sides.
Price on a constant-product AMM follows a hyperbola (`x·y = k`), so the same-size trade moves the price much more when reserves are thin than when they are deep. The analogy captures the directional intuition: adding to one side raises that side's price. But it breaks down for slippage, which is a consequence of the hyperbolic curve.
:::

For a full mathematical treatment, see the [Balancer AMMs whitepaper](https://learnbittensor.org/papers/balancer_amms.pdf).

## Pool State

Each subnet pool is defined by three values:

| Parameter           | Description                               |
| ------------------- | ----------------------------------------- |
| `alpha_reserve` (x) | Alpha tokens held in the pool             |
| `tao_reserve` (y)   | TAO held in the pool                      |
| `w_base`, `w_quote` | Pool weights where `w_base + w_quote = 1` |

The weights are stored as a single `w_quote` value (18-decimal precision); `w_base = 1 - w_quote`. Both weights are bounded to **[0.01, 0.99]** (the upper bound is implied: `1 - w_quote ≥ 0.01`; there is no separate `MAX_WEIGHT` constant). The default at pool initialization is 0.5/0.5 (equal weight).

## Price

The current price of Alpha in TAO (the ideal price for an infinitesimally small trade, before any slippage) is:

$$
p = \frac{w_{\text{base}}}{w_{\text{quote}}} \cdot \frac{\tau}{\alpha}
$$

With equal weights (0.5/0.5), this simplifies to `p = TAO / alpha`,  the same as a constant-product pool.

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

With default equal weights (0.5/0.5), the exponent is 1 in both formulas, which reduces to the constant-product result `∆y = y * ∆x / (x + ∆x)`. The weights only diverge from 0.5/0.5 when the protocol has injected liquidity in a proportion that does not match the current price.

## Weight Updates (moving the balance point)

When the emissions system injects liquidity into a pool each block, the injection rarely arrives in exactly the current price ratio. The protocol calls `update_weights_for_added_liquidity()` to shift the weights and absorb the injection without moving the price. The new weights are computed from the updated reserves:

$$
w_{\text{quote}}^{\text{new}} = \frac{\tau^{\text{new}}}{p \cdot \alpha^{\text{new}} + \tau^{\text{new}}}
$$

where `p` is the price before the injection. Adding disproportionate liquidity shifts the weights; the price is unchanged.

Both weights must remain within [0.01, 0.99]. If a proposed injection would push a weight outside this range, the injection is rejected rather than destabilize the pool math.

## Limit Orders and Slippage Control

Swaps can be bounded by a price limit. When a limit price is set, the pool calculates exactly how much can be swapped before the price reaches the limit:

- **Selling with a floor price `p'`**: `∆alpha_max = alpha * ((p / p')^w_quote - 1)`
- **Buying with a ceiling price `p'`**: `∆TAO_max = TAO * ((p' / p)^w_base - 1)`

If the requested swap amount would push the price past the limit, only the portion up to the limit executes. See [Price Protection](./price-protection.md) for how to use these limits via the CLI and SDK.

## Liquidity Ownership

All pool liquidity is protocol-owned. There are no user liquidity positions or LP tokens. The protocol initializes each pool when a subnet launches, and liquidity grows over time as emissions flow into the pool each tempo.

## Fees

A swap fee is charged on each stake and unstake operation. The fee rate is set per subnet (default ≈ 0.05%) and is applied to the input amount before the swap formula is evaluated. The fee goes to the block author.

To compute the fee on an input amount `a` at fee rate `r` (stored as a `u16` where the full range is 0–65535):

$$
\text{fee} = a \cdot \frac{r}{65535}
$$

The effective input to the swap formula is `a - fee`.

## Relationship to Slippage

Slippage arises because the AMM price changes as reserves move. For a given swap size, slippage is higher when reserves are small relative to the trade. See [Understanding Slippage](./slippage.md) for worked examples.

---

## Blockchain Implementation

The following traces how the fulcrum-shifting mechanism works in the Subtensor codebase.

### Every-block entry point

Each block, `run_coinbase()` fires:

```
pallets/subtensor/src/coinbase/run_coinbase.rs — run_coinbase()
  └─ emit_to_subnets()
       ├─ get_subnet_terms()          ← calculates tao_in and alpha_in
       └─ inject_and_maybe_swap()     ← calls adjust_protocol_liquidity
```

### Calculating the injection amounts

`get_subnet_terms()` (`run_coinbase.rs`) determines how much TAO and Alpha to inject into each subnet pool per block:

- **`tao_in`** = the subnet's share of this block's TAO emission
- **`alpha_in`** = `tao_in / current_price` — the equivalent Alpha at the current spot price
- If `alpha_in` exceeds the alpha injection cap (min of `alpha_emission` and `tao_block_emission`), both are scaled down and the excess TAO is routed to a buy-swap instead of an injection

The injection pair `(tao_in, alpha_in)` is always computed at the current price ratio. Whether this shifts the weights depends on whether that price ratio matches the reserve ratio (see below).

### Calling adjust_protocol_liquidity

`inject_and_maybe_swap()` (`run_coinbase.rs:70`) makes the following call at line 91:

```rust
T::SwapInterface::adjust_protocol_liquidity(*netuid_i, tao_in_i, alpha_in_i)
```

This routes through the `SwapHandler` trait implementation in `pallets/swap/src/pallet/impls.rs` to `Pallet::adjust_protocol_liquidity()` (`impls.rs:84`), which:

1. Reads the current `alpha_reserve`, `tao_reserve`, and `SwapBalancer` weight state from storage
2. Calls `balancer.update_weights_for_added_liquidity(tao_reserve, alpha_reserve, tao_delta, alpha_delta)`
3. On success: writes the updated `SwapBalancer` (new weights) back to storage and returns the actual amounts injected
4. On failure (new weight would land outside `[0.01, 0.99]`): logs a warning, injects nothing, returns zeros

### When the fulcrum actually moves

`update_weights_for_added_liquidity()` (`balancer.rs:254`) computes new weights as:

```
quantity_1 = w_base_old × tao_reserve × new_alpha_reserve
quantity_2 = w_quote_old × alpha_reserve × new_tao_reserve
new_w_quote = quantity_2 / (quantity_1 + quantity_2)
```

Weights stay unchanged only when the injection is proportional to the *reserve ratio* (`tao_delta / alpha_delta = tao_reserve / alpha_reserve`). The coinbase injects at the *price ratio* (`tao_delta / alpha_delta = price`). Since `price = (w_base/w_quote) × (tao/alpha)`, these two ratios match only when `w_base = w_quote = 0.5`. When weights have drifted off 0.5/0.5, price-ratio injections nudge them back — a built-in self-correcting tendency.

### Initialization

When a subnet first becomes active, `maybe_initialize_palswap()` (`impls.rs:38`) is called. It reads the existing TAO and alpha reserves and the current price (from the migration), then computes the initial weights:

```
w_quote = tao_reserve / (price × alpha_reserve + tao_reserve)
```

This is stored in `SwapBalancer` and all subsequent price and swap calculations read from there.

### Storage key

The balancer state for each subnet is stored in `SwapBalancer<T>` (a `StorageMap<NetUid, Balancer>` in `pallets/swap/src/pallet/mod.rs`). The `Balancer` struct holds only a single `Perquintill` field named `quote`; `w_base` is always derived as `1 - quote`.
