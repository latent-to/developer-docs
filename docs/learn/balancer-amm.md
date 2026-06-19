---
title: "Subnet AMM: Balancer Weighted Pool"
---

# Subnet AMM: Balancer Weighted Pool

Each Bittensor subnet maintains an automated market maker (AMM) pool with TAO and Alpha reserves. This pool executes every stake and unstake operation — when you stake TAO, the pool converts it to Alpha; when you unstake, it converts Alpha back to TAO.

## The Intuition: A Scale with a Movable Fulcrum

In a constant product AMM, the scale is always trying to get back to level. As trades happen the scale tips temporarily, but the price movement in proportion to the tip gives the scale a resistance to tipping further — the pool always wants to hold equal dollar value of both tokens.

With a Balancer AMM, the fulcrum itself — the point at which the scale is "level" — can shift. If weights are 70/30, the pool's neutral position is 70% alpha value and 30% TAO value, which is just like shifting the fulcrum of the scale. Trades still tip the scale, but the scale's resting position is itself tilted.

Instead of moving the scale to balance at a fixed point, you move the fulcrum so the pool can treat any reserve ratio as its natural resting state.

**Who moves the fulcrum?** Traders don't. Normal staking and unstaking just tips the scale — the fulcrum stays put. The fulcrum shifts when the **protocol injects liquidity** at the end of each tempo. Subnet emissions add new TAO and Alpha into the pool reserves, and that injection almost never arrives in exactly the right price ratio. Rather than forcing a pre-swap to match the ratio (which would itself move the price), the Balancer absorbs whatever ratio arrives by recalculating the weights to match the new reserve split. Price is preserved; the fulcrum moves.

In short: **traders tip the scale; the emissions system moves the fulcrum.**

For a full mathematical treatment, see the [Balancer AMMs whitepaper](https://learnbittensor.org/papers/balancer_amms.pdf).

---

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

With default equal weights (0.5/0.5), the exponent is 1 in both formulas, which reduces to the constant-product result `∆y = y * ∆x / (x + ∆x)`. The weights only diverge from 0.5/0.5 when the protocol has injected liquidity in a proportion that does not match the current price.

## Weight Updates (Moving the Fulcrum)

When the emissions system injects liquidity into a pool at the end of a tempo, the injection rarely arrives in exactly the current price ratio. The protocol calls `update_weights_for_added_liquidity()` to shift the weights and absorb the injection without moving the price. The new weights are computed from the updated reserves:

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

`inject_and_maybe_swap()` (`run_coinbase.rs:91`) calls:

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

The balancer state for each subnet is stored in `SwapBalancer<T>` (a `StorageMap<NetUid, Balancer>` in `pallets/swap/src/pallet/mod.rs`). The `Balancer` struct holds only a single `Perquintill` value for `w_quote`; `w_base` is always derived as `1 - w_quote`.
