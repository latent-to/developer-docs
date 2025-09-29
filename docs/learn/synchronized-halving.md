---
title: "Token Halvings Problem and Solution"
---

# Token Halvings Problem and Solution

This page explains the motivation for synchronizing ALPHA emission halvings with the global TAO halving schedule, in plain language without requiring any math. 

For formal derivations, see the [white paper](https://github.com/mcjkula/papers/blob/main/dtao-halving-synchronization-2025-v1.pdf).

See also: [Token Halvings Problem and Solution: Frequently asked questions (FAQ)](./halvings-problem.md). 

## 1) How Dynamic TAO works — and why ALPHA follows the TAO clock

### Market-driven emissions
- In Bittensor, each subnet has its own token, known as its ALPHA (α) currency. So that users can trade TAO (τ) for ALPHA, and vice versa, on demand, each subnet maintains reserves of both tokens, and adjusts the price as needed. This is a customized application of the [Uniswap](https://en.wikipedia.org/wiki/Uniswap) AMM pattern.
- Users stake (buy) by putting TAO in and taking ALPHA out; they unstake (sell) by putting ALPHA in and taking TAO out. The price is set by how much TAO and ALPHA are in the pool at any moment.

### Three key flows
- τ_in (TAO injection): New TAO injected into every subnet’s AMM reserve, allocated across subnets by price weights with EMA smoothing, and shrinking over time on the global TAO [halving schedule](../learn/halvings-problem.md).
- α_in (ALPHA injection): ALPHA minted into the AMM reserve (so the pool has inventory on both sides). This is capped by the same global TAO halving schedule as τ_in, so they shrink together.
- α_out (ALPHA emissions): ALPHA minted directly to participants (miners/validators/nominators). This follows each subnet’s own, local ALPHA halving schedule.

Allocation note: TAO and ALPHA injections use smoothed prices to avoid manipulation, via Exponential Moving Average (EMA). See [EMA](../learn/ema.md) for details.

### Why α_in must follow TAO halvings
- If TAO issuance halves but α_in does not, the pool suddenly receives proportionally more ALPHA per TAO. That would cut ALPHA’s price in half overnight and destabilize markets.
- To keep the AMM balanced and the price stable across halvings, α_in is locked to TAO’s halving clock so they always shrink together.

### The side-effect
- While this stabilizes the market, α_out (rewards to participants) remains on each subnet’s own clock. That split—α_in on the TAO clock, α_out on a local clock—is the seed of later problems.

## 2) The problem — asymmetries caused by two clocks
When α_in halves on TAO’s schedule but α_out keeps running on its own, the mix of “ALPHA in the pool” versus “ALPHA in people’s wallets” drifts at every global halving. That one drift explains four consistent distortions:

### 2.1 Halving “speed‑up” (interval compression)
- As global halvings reduce α_in while α_out keeps its pace until the subnet’s own halving, the mix leans more on α_out.
- Result: each new ALPHA halving threshold arrives sooner than the last; halving intervals keep getting shorter for the same subnet as time goes on.

### 2.2 Liquidity impact on AMMs
- Over time, α_out (rewards) can dominate relative to α_in (pool top‑ups). For subnets born after later TAO halvings, selling one ALPHA removes a larger fraction of the pool’s TAO than it did for earlier cohorts.
- Translation: the same sell‑pressure moves the price more for later cohorts (higher price impact). Liquidity becomes harder to sustain for newer subnets even when behavior is identical.

### 2.3 Slower root‑share decline
- Root’s effective influence depends on TAO staked on [Root Subnet](../resources/glossary.md#root-subnetsubnet-zero), scaled by [TAO‑weight](../resources/glossary.md#tao-weight).
- Root’s share declines only as ALPHA supply grows. But after a TAO halving, pool top‑ups slow while γ stays the same, so it takes longer for a new subnet to dilute root.
- Potential fix (?): halve γ at each TAO halving (e.g., 0.18 → 0.09 → …). That keeps root’s effective power shrinking in sync with issuance, preserving a stable dilution pace across epochs.

### 2.4 Disadvantageous liquidation

Subnets can be [deregistered](../subnets/subnet-deregistration.md) when they no longer meet economic or operational criteria. When that happens, the AMM is dissolved, and subnet owners and ALPHA holders redeem their held stakes against the pool’s remaining TAO. That redemption value is the liquidation price.

- Spot price is what the AMM offers right now (TAO reserve divided by ALPHA reserve).
- Liquidation price is what you’d recover if a subnet shuts down: the pool’s TAO divided by outstanding ALPHA held by users (see [Subnet Deregistration](../subnets/subnet-deregistration.md)).
- ADR (Alpha Distribution Ratio) compares ALPHA held by users to ALPHA left in the pool. When the two clocks are out of sync, α_out tends to outpace α_in, pushing ADR above 1.
- When ADR > 1, liquidation price falls below spot. That means if a subnet deregisters, users can recover less TAO than their ALPHA’s current market value—a built‑in haircut risk for later cohorts.

## 3) One root cause

All of the above comes from a single source: TAO’s global halving clock governs τ_in and α_in, while each subnet’s local halving clock governs α_out. The widening gap changes the injection/emission mix every epoch, and the distortions follow.

## 4) Toward a Solution: Exploring a synchronized design

### 4.1 Core change — one clock for both
- Set every subnet’s α_out to halve on the same global blocks as TAO’s halvings.
- Now τ_in, α_in, and α_out all shrink together each epoch.

Results:
- Halving intervals keep their intended spacing—no speed‑up.
- Selling a fixed fraction of rewards has the same AMM impact across all cohorts.
- Root‑share dilution stays on a stable trajectory if γ halves each epoch alongside issuance.
- Liquidation price matches spot—no built‑in haircut risk.

### 4.2 Key implications
- Lower total ALPHA supply for some cohorts: compression had previously accelerated some subnets; syncing removes that extra pace.
- Eventual end of emissions: once halvings push per‑block rewards below the smallest unit ([RAO](../resources/glossary.md#rao)), minting would stop unless the unit size changes.
- Two options for the “tail” after many halvings:
  - Hard‑stop tail: emissions end at the final discrete halving. Simple and finite.
  - Zeno‑halving tail: increase token precision so halvings can continue smoothly below today’s minimum unit. Rewards shrink toward zero without ever snapping to zero, keeping the same finite total with smoother aesthetics.
- TAO‑weight (γ): halve γ at each TAO halving to keep root’s influence aligned with the shrinking issuance scale.

## 5) Conclusion
dTAO’s market model is a leap beyond manual emission voting, but split clocks unintentionally distort subnet economics over time. Synchronizing ALPHA’s halving with TAO’s restores a steady ratio of injection to emission and removes the resulting four distortions at the source. Pair that with either a hard‑stop or Zeno‑style tail for the endpoint and scale γ each epoch: the result is a cleaner policy, fairer outcomes for every cohort, and simpler expectations for builders and users.

---

Want the math later?
- The white paper formalizes interval compression, liquidity impact, liquidation haircuts, and root‑share dynamics. See `bittensor/maciej-paper.txt` for derivations and examples.

