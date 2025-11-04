---
title: "Emission"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Emission

Emission is the economic heartbeat of Bittensor—the process that continuously distributes newly created [TAO](../resources/glossary.md#tao-τ) and subnet-specific alpha tokens to network participants who contribute value through [mining](../resources/glossary.md#subnet-miner), [validation](../resources/glossary.md#validator), [staking](../resources/glossary.md#staking), and [subnet creation](../resources/glossary.md#subnet-creator).


:::tip Tokenomics in Transition
**November 2025 - December 2025**: Bittensor is transitioning from price-based to flow-based model for injection of emissions to subnets, unfolding over a 30-day period. Starting early November 2025, emissions will gradually shift from being determined entirely by subnet token prices to being based on net TAO inflows (staking activity). By early December 2025, emissions will be 100% flow-based.

See:
- [How this affects TAO injection into subnets](#tao-reserve-injection).
- [Rationale for the Transition in Tao Injection model](#rationale-for-the-transition-in-tao-injection-model)
:::

## Injection and Distribution: Two-Stages of the Emissions Process

Bittensor's emission system operates through two stages, reflecting the system's hierarchical, competitive nature: 

- **Injection**: Every [block](../resources/glossary.md#block), new liquidity flows into each subnet's liquidity pools, based on subnet performance.

- **Distribution**: At the end of each [tempo](../resources/glossary.md#tempo) (360 blocks, ~72 minutes), accumulated rewards within each subnet are distributed to the subnet's participants through [Yuma Consensus](../resources/glossary.md#yuma-consensus), which evaluates individual performance and determines who deserves what share.

See also:

- [Coinbase Implementation](../navigating-subtensor/emissions-coinbase.md) in the Subtensor codebase
- [Yuma Consensus](./yuma-consensus.md)
- [Dynamic TAO White Paper](https://drive.google.com/file/d/1vkuxOFPJyUyoY6dQzfIWwZm2_XL3AEOx/view)

### Injection

The first stage of emissions is _injection of liquidity_ into the subnet pools. Liquidity is injected to each subnet based on either price (legacy model) or net TAO flows (new model), or a weighted combination during the transition period.

Each block:

- **TAO is injected** into the subnet's **TAO reserve** — the amount for each subnet is determined by the emission distribution formula (see below)
- **Alpha is injected** into the subnet's **alpha reserve** — proportional to TAO injection to maintain price stability
- **Alpha is allocated** to _alpha outstanding_ — set aside to be distributed by participants (miners, validators, stakers, subnet owner)

#### Distribution across Subnets

The distribution of TAO emissions across subnets is currently transitioning from a **price-based model** to a **flow-based model**:

**Price-Based Model (Legacy, being phased out by December 2025)**
- Emissions proportional to a smoothed subnet token price (See: [Subnet Price Smoothing](../learn/ema#subnet-price-smoothing))
- Can incentivize price manipulation
- Creates 'price inertia' effects, where if a subnet builds up liquidity at a given price it is hard for the price to change. As a result, subnets that currently have a high ALPHA price got a lot of stake in the beginning, but even mass unstaking from those subnets would not, on the legacy model, cause their price and emissions to drop below that of newer subnets.

**Flow-Based Model (New, fully active by December 2025)**
- Emissions based on net TAO inflows from staking/unstaking activity  
- Rewards subnets that attract genuine user engagement
- Subnets with negative net flows (more unstaking than staking) receive zero emissions

**Transition Period (November - December 2025)**

The transition unfolds linearly at ~3.33% per day over 216,000 blocks (~30 days):
- **Week 1 (Nov 4-10)**: ~25% flow-based, 75% price-based
- **Week 2 (Nov 11-17)**: ~50% flow-based, 50% price-based  
- **Week 3 (Nov 18-24)**: ~75% flow-based, 25% price-based
- **Week 4 (Nov 25-Dec 1)**: ~90% flow-based, 10% price-based
- **After Dec 4, 2025**: 100% flow-based

This gradual approach prevents sudden market disruption and gives subnet owners time to adapt their strategies.

#### TAO reserve injection

A subnet's TAO reserve injection is determined by its **emission share**, which is calculated differently depending on the current stage of the transition.

<details>
  <summary><strong>Price-Based Formula (Legacy Model)</strong></summary>

Given set $\mathbb{S}$ of all subnets, and a total per block TAO emission $\Delta\bar{\tau}$ (currently 1 TAO, following a halving schedule), the price-based emission share for subnet $i$ with price $p_i$ is:

$$
\text{share}_{\text{price}}(i) = \frac{p_i}{\sum_{j \in \mathbb{S}} p_j}
$$

This model rewards subnets with higher token prices but doesn't fully account for tokenomic activity or value creation.

</details>

<details>
  <summary><strong>Flow-Based Formula (New Model)</strong></summary>

The flow-based model uses an Exponential Moving Average (EMA) of net TAO flows (staking minus unstaking), with a  30-day half-life, resulting in an EMA window of approximately ~86.8 days:

1. **Track net flows**: Each block, record TAO inflows from staking and outflows from unstaking:
   $$\text{net\_flow}_i = \sum \text{TAO staked} - \sum \text{TAO unstaked}$$

2. **Calculate EMA**: Update the 30-day EMA of net flows (smoothing factor $\alpha \approx 0.000003209$):
   $$S_i = (1 - \alpha) \cdot S_{i-1} + \alpha \cdot \text{net\_flow}_i$$

3. **Apply offset and clipping**: Calculate offset flows by subtracting the lower limit $L$:
   $$z_i = \max(S_i - L, 0)$$
   where $L = \max(\text{FlowCutoff}, \min_{j} \min(S_j, 0))$
   
   Subnets with $S_i \leq L$ (i.e., subnets with negative net flows) receive zero emissions .

4. **Power normalization**: Apply power $p$ (default = 1.5) to amplify differences:
   $$\text{share}_{\text{flow}}(i) = \frac{z_i^p}{\sum_{j \in \mathbb{S}} z_j^p}$$




The power parameter creates winner-takes-more dynamics: a subnet with 2× the flow receives approximately 2.83× the emissions.

**Key Parameters** ([source](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1278-L1348)):
- EMA half-life: 216,000 blocks (30 days)
- Power exponent: $p = 1.0$
- Flow cutoff: 0 (only negative flows clipped by default)

**Implementation**: Flow tracking occurs in [`record_tao_inflow()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs#L35-L47) and [`record_tao_outflow()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs#L49-L59), called during stake and unstake operations.

:::info Exceptions to Inflows/Outflows
Flow tracking does not include root proportion.
While stake/unstake operations are recorded as inflows or outflows, swaps like the `burned_register` (UID registration) and  the root claim are excluded.

See [Calculating root proportion](../navigating-subtensor/emissions-coinbase#6-calculating-root-proportion).
:::


</details>

<details>
  <summary><strong>Transition Formula (November - December 2025)</strong></summary>

During the transition period, emission shares are a weighted combination of both models:

$$
\text{share}(i) = w \cdot \text{share}_{\text{flow}}(i) + (1 - w) \cdot \text{share}_{\text{price}}(i)
$$

where the flow weight $w$ increases linearly over 216,000 blocks:

$$
w = \frac{\text{current\_block} - \text{start\_block}}{216000}
$$

- At block 0: $w = 0$ (100% price-based)
- At block 108,000: $w = 0.5$ (50/50 blend)
- At block 216,000+: $w = 1$ (100% flow-based)

**Implementation**: The transition logic is in [`get_shares()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs#L300-L360).

</details>

**Final TAO injection** to subnet $i$:

$$
\Delta\tau_i = \Delta\bar{\tau} \times \text{share}(i)
$$

This ensures total emissions remain constant at 1 TAO per block (when at least one subnet has positive share).


#### Alpha reserve injection

Alpha is then injected in proportion to the price of the token, so that growth of a subnet's liquidity pools does not not change the price of the alpha token.

<details>
  <summary><strong>See how it's calculated!</strong></summary>

Recall that token price for a subnet is its TAO in reserve divided by its alpha reserve:

$$
p_i  = \frac
                  {\tau_i}
                  {\alpha_i}
$$

So in order to inject alpha without changing the price, it should follow:

$$
\Delta\alpha_i = \frac
                  {\Delta\tau_i}
                  {p_i}
$$

When we fill in this equation with the previous formula for $\Delta\tau_i$, the price $p_i$ is cancelled out of the equation, yielding:

$$
\Delta\alpha_i =
  \frac
    {\Delta\bar{\tau}}
    {\sum_{j \in \mathbb{S}}
  \bigl(p_j)}
$$

However, alpha injection is also capped at 1 by the algorithm, to prevent runaway inflation. Therefore, with cap or _alpha emission rate_ $\Delta\bar{\alpha_i}$, emission $\Delta\alpha_i$ to subnet $i$ is:

$$
\Delta\alpha_i = \min\left\{
  \frac
    {\Delta\bar{\tau}}
    {\sum_{j \in \mathbb{S}}
  \bigl(p_j)},
  \Delta\bar{\alpha_i} \right\}
$$

The cap or _alpha emission rate_ $\Delta\bar{\alpha_i}$ for subnet $i$, starts at 1 and follows a halving schedule identical to that of TAO, beginning when subnet $i$ is created.

</details>

#### Alpha outstanding injection

Each block, liquidity is also set aside to be emitted to participants (validators, miners, stakers, and subnet creator). The quantity per block is equal to the _alpha emission rate_ $\Delta\bar{\alpha_i}$ for subnet $i$.

:::warning Important for Subnet Owners
Under the new flow-based model, subnets with negative net TAO flows (more unstaking than staking) will receive **zero TAO emissions** and consequently **zero alpha injection**. This means:

- No liquidity growth for the subnet pool
- Higher slippage for users trying to stake
- Difficulty attracting new participants

To maintain positive emissions, subnet owners should focus on:
- Building genuine utility that attracts long-term stakers
- Creating sustainable value that encourages TAO inflows
:::

### Distribution

At the end of each tempo (361 blocks), the quantity of alpha accumulated over each block of the tempo is distributed network participants in the following proportions:

1.  18% by subnet owner
1.  41% of emissions go to miners. The allocation to particular miners is determined by [Yuma Consensus: Miner emissions#miner-emissions](./yuma-consensus).
1.  41% by validators and their stakers.

    1.  First, the allocation to validators miners is determined by [Yuma Consensus: Validator Emissions](./yuma-consensus#validator-emissions).
    1.  Then, validators receive their take from that allocation.
    1.  Then, TAO and alpha are emitted to stakers in proportion to the validators' holdings in each token. TAO emissions are sourced by swapping a portion of alpha emissions to TAO through the subnet's liquidity pool.

            <details>
            <summary><strong>See how it's calculated!</strong> </summary>

        For validator x's TAO stake $\tau_x$, and alpha stake $\alpha_x$, and the global TAO weight $w_{\tau}$:

            - TAO is emitted to stakers on the root subnet (i.e. stakers in TAO) in proportion to the validator's stake weight's proportion of TAO.

              $$
              \text{proportional emissions (\%) to root stakers}
              = \frac{\tau_{x}{} \, w_{\tau}}
                    {\alpha_{x} + \tau_{x} \, w_{\tau}}
              $$

            - Alpha is emitted to stakers on the mining subnet (i.e. stakers in alpha) in proportion to the validator's stake weight's proportion of alpha:
              $$
              \text{proportional emissions (\%) to alpha stakers}
              = \frac{\alpha_{x}}
                    {\alpha_{x} + \tau_{x} \, w_{\tau}}
              $$

            Validators who hold both root TAO and subnet alphas will receive both types of token.
            </details>

    See [Core Dynamic TAO Concepts: Validator stake weight](../subnets/understanding-subnets#validator-stake-weight)


## Rationale for the Transition in Tao Injection model

The transition from price-based to flow-based emissions addresses several fundamental issues with the original model as explained by Bittensor co-founder Jacob Steeves (a.k.a., Const) in the [October 30, 2025 episode of Novelty Search](https://www.youtube.com/live/40ug9nbYW9U?si=H6mTnO2pwqwtE25U):

### Leveling the Playing Field

The new model measures emissions contribution "per unit liquidity" to eliminate structural advantages:

- **Old model problem**: Small subnets with low liquidity are devastated by minor sell pressure, while large subnets with high liquidity can absorb massive selling with minimal emission impact
- **New model solution**: All subnets are evaluated by their net TAO flow. Because this is the difference between in-flow and out-flow of TAO, it is scale-invariant and does *not* favor subnets with larger total liquidity pools, leveling the playing field.

### Preventing "TAO Treasury" Gaming

The price-based model enabled a specific exploit pattern:

1. Projects artificially pump their token price by building "TAO treasuries"
2. They pay for initial liquidity buildup using emissions from the inflated price
3. They let the price "slow burn" downward while collecting emissions the entire time

Under the new model, injection favors subnets that are actively being staked into, rather than just holding accumulated liquidity.

### Anti-Manipulation by Design

The flow-based system is designed to be manipulation-resistant:

- Net flows reflect actual user behavior (staking/unstaking decisions)
- ~86.8 day EMA prevents short-term gaming
- Neuron registrations are excluded from inflows
- Power normalization amplifies sustained positive flows over temporary spikes

### Note: De-registration Remains Price-Based

Emissions and de-registration are **intentionally decoupled**:

- De-registration continues to be based on lowest token price
- Subnets with zero emissions (due to negative net flows) are **not** automatically de-registered

## Note on evolution of Bittensor token economy

At the initialization of Dynamic TAO, there was no alpha in circulation, so validator's stake weights were initially determined by their share of TAO stake.

But far more alpha than TAO is emitted into circulation every block. As a result, over time there will be more alpha relative to TAO in overall circulation, and the relative weight of a validator in a given subnet will depend more on their alpha stake share relative to their share of the TAO stake on Subnet Zero.

In order to hasten the process of alpha gaining the majority of stake power in the network, the contribution of TAO stake to a validator's stake weight is reduced by a global parameter called _TAO weight_. Currently, this is planned to be **18%**, in order to achieve a weight parity between TAO and total alpha in approximately 100 days.

<center>
<ThemedImage
alt="Curves"
sources={{
    light: useBaseUrl('/img/docs/dynamic-tao/curves.png'),
    dark: useBaseUrl('/img/docs/dynamic-tao/curves.png'),
  }}
style={{width: 650}}
/>
</center>

<br />

