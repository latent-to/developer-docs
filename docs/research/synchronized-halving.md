---
title: "Token Halvings Problem and Solution"
---

# Token Halvings Problem and Solution

This page explains the motivation for synchronizing ALPHA [emission](#emission) halvings with the global [TAO](#tao-τ) halving schedule, in plain language without requiring any math. 

In Bittensor's Dynamic TAO (dTAO) system, each [subnet](../resources/glossary.md#subnet) has its own token, referred to as its ALPHA (α), which represents [stake](../resources/glossary.md#stake) in the subnet and powers commodity validation according to [Yuma Consensus](../learn/yuma-consensus). While this creates a powerful market-driven allocation system, the current design uses independent halving schedules that create unintended asymmetries over time, disadvantaging later subnet cohorts.

For formal derivations, see the [white paper](https://github.com/mcjkula/papers/blob/main/dtao-halving-synchronization-2025-v1.pdf).

See also: [Token Halvings Problem and Solution: Frequently asked questions (FAQ)](./halvings-problem.md).

## 1) Background: Current Token Emissions Halving Schedules

### Market-driven emissions

In Bittensor, each subnet has its own token, known as its ALPHA (α) currency. TAO-holders can trade TAO for ALPHA-tokens, and vice-versa. This internal currency marketplace is historically known as Dynamic TAO (dTAO), in contrast to the initial iteraction of Bittensor, in which all subnets shared a single 'static' TAO currency.

So that users can trade TAO (τ) for any subnet's ALPHA token, and vice versa, on demand, each subnet maintains reserves of both tokens, and adjusts the price as needed. This is a customized application of the [Uniswap](https://en.wikipedia.org/wiki/Uniswap) AMM pattern.

Users stake by putting TAO into a subnet's reserve and taking ALPHA; they unstake (sell) by putting ALPHA in and taking TAO out. The price is set by how much TAO and ALPHA are in the pool at any moment.

### How the tokens flow

The dTAO emissions process involves a threefold token injection for each subnet, which occurs each block. Over time, emissions halvings will change the rate of these token injections.

1. **τ_in (TAO injection)**: New TAO is injected into every subnet's AMM reserve each [block](../resources/glossary.md#block). This allocation is distributed across subnets based on their relative prices, with [EMA](../resources/glossary.md#exponential-moving-average-ema) smoothing to prevent manipulation. TAO injections shrink over time following the global TAO [halving schedule](./halvings-problem.md).

2. **α_in (ALPHA injection)**: ALPHA tokens are minted directly into each subnet's AMM reserve to maintain balanced liquidity on both sides of the pool. This injection is capped by the same global TAO halving schedule as τ_in, ensuring they shrink together proportionally.

3. **α_out (ALPHA outbound)**: ALPHA tokens bound for distribution to network participants (miners, validators, and stakers) accumulate each block throughout an epoch, before being emitted to participants at the epoch's conclusion. Unlike the injections above, injection to **ALPHA out** follow each subnet's own independent ALPHA halving schedule.

**Critical insight**: The first two flows (τ_in and α_in) are synchronized to the global TAO clock, while the third flow (α_out) runs on each subnet's local clock. This timing mismatch is the root cause of the asymmetries described below.


### Why α_in must follow TAO halvings

The synchronization between TAO and ALPHA injections is essential for market stability. If global TAO [issuance](../resources/glossary.md#issuance) halves but ALPHA injection (α_in) does not, each subnet's AMM pool would suddenly receive proportionally more ALPHA tokens per TAO token. This would proportionally remove more TAO from the AMM reserves over time, and for newer or low liquidity subnets, make the AMM subject to proportionally higher selling pressure and price impact.

To maintain stable exchange rates and prevent artificial price shocks, α_in must be locked to TAO's global halving schedule. This ensures that both sides of the AMM pool shrink proportionally, preserving price relationships across halving events. Without this synchronization, the AMM reserves would be affected more by selling pressure over time, particularly for newer and low-liquidity subnets, resulting in higher price impact.

ALPHA emissions to participants (α_out) remain on each subnet's independent local halving schedule, while injections follow the global TAO schedule.  While synchronizing injections (τ_in and α_in) stabilizes markets, this 'semi-synchronization' creates unintended downstream consequences. This timing split—α_in synchronized globally, α_out running locally—creates a growing imbalance between "ALPHA in AMM pools" versus "ALPHA in participant wallets." This imbalance is the mathematical root cause of all four distortions described below.

## 2) The problem

The fundamental issue emerges from the timing mismatch between global and local halving schedules. When ALPHA injections (α_in) halve according to TAO's global schedule but ALPHA emissions (α_out) continue on each subnet's independent schedule, the ratio between "ALPHA in AMM pools" versus "ALPHA held by participants" shifts at every global halving event.

This single mathematical drift creates several distinct but related distortions that systematically disadvantage later subnet cohorts:

### 2.1 Halving "speed‑up" (interval compression)

**The mechanism**: TAO halvings slow down ALPHA halvings by reducing the mining rate while keeping the threshold constant. However, when an ALPHA halving occurs, it halves the threshold while reducing the minting rate by less than 50%, causing the next ALPHA halving to happen faster (compressed intervals). This compression becomes stronger as ALPHA injections outweigh ALPHA emissions.

**Real impact**: A subnet that initially had 2-year halving intervals might see this compress to 18 months, then 12 months, and eventually approach a "singularity" where halvings occur nearly every block. 
ALPHA halvings will compress so severely that no more incentives/emissions would be distributed in ~10 years instead of the intended ~60 years.

### 2.2 Liquidity impact on AMMs

**The mechanism**: As ALPHA emissions (α_out) increasingly dominate relative to ALPHA injections (α_in), the AMM pools receive proportionally less liquidity while participants hold proportionally more tokens. This changes the fundamental dynamics of trading.

**Cohort disadvantage**: For subnets created after multiple TAO halvings, the same selling pressure from participants removes a much larger fraction of the pool's TAO reserves compared to earlier subnet cohorts. This is because later subnets have smaller injection rates but the same emission rates.

**Practical impact**: 
- **Early subnets** (created before TAO halvings): Selling 10% of rewards might cause 3% [slippage](../resources/glossary.md#slippage)
- **Later subnets** (created after multiple halvings): The same 10% sell might cause 15-20% slippage

This makes it progressively harder for newer subnets to maintain healthy liquidity and stable prices, even when participant behavior is identical across cohorts.

### 2.3 Slower root‑proportion decline

**Background**: The [Root Subnet](../resources/glossary.md#root-subnetsubnet-zero) (Subnet Zero) provides a mechanism for TAO holders to stake in a subnet-agnostic way. Root's influence in any given subnet depends on the total TAO staked there, scaled by the global [TAO‑weight](../resources/glossary.md#tao-weight) parameter (γ, currently 0.18).

**The mechanism**: Root's proportional influence should decline as each subnet's ALPHA supply grows through emissions. However, after TAO halvings, ALPHA injections (α_in) slow down while the TAO-weight parameter (γ) remains constant. This means new ALPHA supply grows more slowly, allowing Root to maintain disproportionate influence for longer periods.

**Cohort impact**: 
- **Early subnets**: Root's influence declined predictably as ALPHA supply grew
- **Later subnets**: Root maintains higher influence for extended periods due to slower ALPHA supply growth

**Solution**: Scale the TAO-weight parameter with each TAO halving (e.g., 0.18 → 0.09 → 0.045 → …). This would keep Root's effective power declining in sync with the overall issuance scale, preserving consistent dilution dynamics across all epochs.

### 2.4 Disadvantageous liquidation

**Subnet deregistration context**: Subnets can be deregistered based on their relative performance (currently the lowest EMA subnet among all subnets). When this occurs, the AMM pool is dissolved, and all ALPHA holders redeem their tokens against the pool's remaining TAO reserves.

**Two critical prices**:
- **Spot price**: The current market rate offered by the AMM (TAO reserves ÷ ALPHA reserves)
- **Liquidation price**: The redemption value if the subnet get deregistered (TAO reserves ÷ total outstanding ALPHA held by users)

**Alpha Distribution Ratio ([ADR](../resources/glossary.md#adr-alpha-distribution-ratio))**: This metric compares ALPHA tokens held by participants versus ALPHA tokens remaining in the AMM pool. When injection and emission clocks are misaligned, emissions (α_out) tend to outpace injections (α_in), pushing more ALPHA into participant wallets and driving ADR above 1. A higher ADR means more tokens are in circulation relative to what's in the pool, which affects liquidation dynamics.

**The liquidation [haircut](./halvings-problem#haircut-h)**: When ADR > 1, the liquidation price falls below the spot price. This creates a built-in "haircut" risk where ALPHA holders recover less TAO than their tokens' current market value suggests.

**What is a haircut?** A haircut is the discount between what you expect to receive (based on current market price) and what you actually receive during liquidation. For example, if your ALPHA tokens are worth 100 TAO at market price but you only receive 75 TAO during subnet liquidation, you've suffered a 25% haircut.

**Cohort impact examples**:
- **Early subnets** (ADR ≈ 1): Liquidation price matches spot price — no haircut
- **Later subnets** (ADR >> 1): Liquidation price significantly below spot — substantial haircut risk

This asymmetry makes staking in later subnet cohorts fundamentally riskier, even when the underlying subnet performance is identical.



### 2.5 One root cause

Despite appearing as four separate problems, all of the above distortions stem from a single mathematical source: **timing asynchrony between global and local halving schedules**.

**The fundamental split**:
- **Global TAO clock** governs TAO injections (τ_in) and ALPHA injections (α_in)
- **Local subnet clocks** govern ALPHA emissions (α_out) to participants

**The compounding effect**: At each global TAO halving, the gap between these two timing systems widens. This changes the fundamental ratio between "tokens injected into pools" versus "tokens emitted to participants," and all four distortions flow mathematically from this shifting ratio.

**Why it gets worse over time**: The longer the Bittensor network operates, the more TAO halvings occur, and the more severe these asymmetries become. Critically, no subnet truly benefits in the long term.

## 3) Toward a Solution: Exploring a synchronized design

### 3.1 Core change — one clock for both

The proposed solution directly addresses the root cause by eliminating the timing mismatch:

**Synchronization principle**: Set every subnet's ALPHA emissions (α_out) to halve on the same global blocks as TAO halvings, rather than following independent local schedules.

**Unified timing**: Now all three flows—TAO injections (τ_in), ALPHA injections (α_in), and ALPHA emissions (α_out)—shrink together proportionally at each global halving event.

### 3.2 Immediate benefits

Synchronization eliminates all four distortions at their mathematical source:


1. **Cohort-invariant liquidity**: Selling a fixed fraction of rewards produces identical AMM slippage impact across all subnet cohorts, regardless of when they were created.

2. **Predictable root dynamics**: Root Subnet influence follows a stable dilution trajectory when the TAO-weight parameter (γ) is scaled alongside issuance (e.g., 0.18 → 0.09 → 0.045).

3. **Elimination of liquidation haircuts**: The liquidation price matches the spot price for all cohorts (ADR = 1), removing built-in disadvantages for later subnets.

4. **Stable emission schedule**: ALPHA emissions would halve with TAO every 4 years, eliminating the problematic independent ALPHA halving schedule entirely.

### 3.3 Key implications and trade-offs

While synchronization solves the core asymmetry problems, it introduces some changes to the current system:

#### Supply implications
**Reduced maximum supply for some cohorts**: The current system's interval compression effectively accelerates some subnets beyond their intended pace. Synchronization removes this artificial acceleration, resulting in lower total ALPHA supply for cohorts that would have benefited from compression. Hence, nobody truly benefits.

**Predictable supply curves**: Each subnet's maximum ALPHA supply becomes calculable based on its registration timing relative to the global TAO supply, creating transparent and predictable tokenomics.

#### Long-term considerations

**Emission endpoint**: Once halvings reduce per-block rewards below the smallest unit (RAO = 10⁻⁹ TAO), minting would naturally stop unless token precision is increased.

**Two tail options**:
1. **Hard-stop tail**: Emissions end at the final discrete halving when rewards reach the RAO floor. Simple and finite, but creates a discontinuous endpoint. This approach would also require increasing the TAO supply above 21 million, which may not be desirable.
2. **Zeno-halving tail**: Increase token precision (e.g., from 9 to 18 decimal places) so halvings can continue smoothly below the current minimum unit. Rewards asymptotically approach zero without ever stopping, maintaining the same finite total supply with smoother mathematical properties.

#### Parameter adjustments

**TAO-weight scaling**: The TAO-weight parameter (γ) should be halved at each TAO halving (0.18 → 0.09 → 0.045 → …) to keep Root Subnet influence properly aligned with the shrinking issuance scale across all epochs.

## 5) Further considerations

### Timing urgency

The asymmetries described above begin manifesting immediately after the first TAO halving and compound with each subsequent halving. Early implementation preserves fairness across subnet cohorts, while delayed implementation creates permanent advantages for early subnets and disadvantages for later ones.

### Transition approach

Several implementation strategies could be considered:
- **Immediate synchronization**: All existing subnets switch to the global halving schedule
- **Grandfathering**: Existing subnets continue on local schedules, new subnets use global schedule. One implication of this approach is that grandfathered subnets would reach their supply cap in ~10 years instead of ~60 years, while still benefiting from liquidity and liquidation advantages.
- **Opt-in transition**: Subnet creators choose between current and synchronized models

### Governance considerations

This change affects fundamental tokenomics and requires broad community consensus. The mathematical analysis provides objective evidence of the problems, but implementation decisions involve balancing current subnet owner interests against long-term network fairness and sustainability.

## 6) Conclusion

Dynamic TAO represents a significant advancement over manual emission allocation through validator voting, introducing market-driven price discovery to subnet resource allocation. However, the current system's split halving schedules create unintended mathematical asymmetries that systematically disadvantage later subnet cohorts.

**The core insight**: All four distortions—interval compression, liquidity disadvantages, root-share dynamics, and liquidation haircuts—stem from a single source: the timing mismatch between global TAO halvings and local ALPHA halvings.

**The proposed solution**: Synchronizing ALPHA emissions with the global TAO halving schedule eliminates these asymmetries at their mathematical root, creating:
- Consistent halving intervals across all epochs
- Cohort-invariant trading dynamics
- Predictable Root Subnet influence patterns
- Elimination of liquidation disadvantages

**Implementation trade-offs**: While synchronization solves the asymmetry problems, it requires accepting different maximum ALPHA supplies for some cohorts and implementing either hard-stop or Zeno-style emission tails. Scaling the TAO-weight parameter with each halving ensures consistent root dynamics.

**The result**: A mathematically cleaner system with fairer outcomes for every subnet cohort, predictable tokenomics for builders and users, and elimination of timing-based advantages that have nothing to do with subnet performance or value creation.
