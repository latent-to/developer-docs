---
title: "Emission"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Emission

Emission is the economic heartbeat of Bittensor—the process that continuously distributes newly created [TAO](../resources/glossary.md#tao-tau) and subnet-specific alpha tokens to network participants who contribute value through [mining](../resources/glossary.md#subnet-miner), [validation](../resources/glossary.md#subnet-validator), [staking](../resources/glossary.md#staking), and [subnet creation](../resources/glossary.md#subnet-creator).

:::tip Flow-Based Emissions ("Taoflow") Now Active
**As of November 2025**: Bittensor has transitioned to a **flow-based model** ("Taoflow") for determining how TAO emissions are distributed across subnets. Emissions are now based on net TAO inflows due to staking activity, rather than token prices as previously.

See:

- [How flow-based injection works](#tao-reserve-injection)
- [Rationale for the flow-based model](#rationale-for-flow-based-emissions)
  :::

See also:

- [Implementation in the Subtensor codebase](../navigating-subtensor/emissions-coinbase.md)
- [Yuma Consensus](./yuma-consensus.md)
- [TAO.app Tokenomics Dashboard](https://www.tao.app/tokenomics)
- [Dynamic TAO White Paper](https://drive.google.com/file/d/1vkuxOFPJyUyoY6dQzfIWwZm2_XL3AEOx/view)

## Injection and Distribution: Two-Stages of the Emissions Process

Bittensor's emission system operates through two stages, reflecting the system's hierarchical, competitive nature:

- **Injection**: Every [block](../resources/glossary.md#block), new liquidity flows into each subnet's liquidity pools, based on subnet performance.

- **Distribution**: At the end of each [tempo](../resources/glossary.md#tempo) (waiting period of ~360 blocks, ~72 minutes), accumulated rewards within each subnet are distributed to the subnet's participants through [Yuma Consensus](../resources/glossary.md#yuma-consensus), which evaluates individual performance and determines who deserves what share.

### Injection

The first stage of emissions is _injection of liquidity_ into the subnet pools. Liquidity is injected to each subnet based on either price (legacy model) or net TAO flows (new model), or a weighted combination during the transition period.

Each block:

- **TAO is injected** into the subnet's **TAO reserve** — the amount for each subnet is determined by the emission distribution formula (see below)
- **Alpha is injected** into the subnet's **alpha reserve** — proportional to TAO injection to maintain price stability
- **Alpha is allocated** to _alpha outstanding_ — set aside to be distributed by participants (miners, validators, stakers, subnet owner)

#### Distribution across Subnets

TAO emissions across subnets are now determined by a **flow-based model**:

**Flow-Based Model (Active as of November 2025)**

- Emissions based on net TAO inflows, i.e. TAO that has flowed into the subnet minus TAO that has flowed out, from staking/unstaking activity
- Rewards subnets that attract genuine user engagement
- Subnets with negative net flows (more unstaking than staking) receive zero emissions
- More dynamic and responsive than the previous price-based approach

**Previous Price-Based Model (No Longer Active)**

- Emissions were proportional to smoothed subnet token prices
- Created "price inertia" effects where established subnets maintained high emissions even during mass unstaking
- Was vulnerable to "TAO treasury" gaming strategies

#### TAO reserve injection

A subnet's TAO reserve injection is determined by its **emission share**, calculated based on net flow of TAO in and out of the subnet's TAO liquidity pool due to staking/unstaking.

<details>
  <summary><strong>How it's calculated</strong></summary>

The flow-based model uses an Exponential Moving Average (EMA) of net TAO flows (staking minus unstaking):

1. **Track net flows**: Each block, record TAO inflows from staking and outflows from unstaking:
   $$\text{net\_flow}_i = \sum \text{TAO staked} - \sum \text{TAO unstaked}$$

2. **Calculate EMA**: Update the 86.8-day EMA of net flows (smoothing factor $\alpha \approx 0.000003209$):
   $$S_i = (1 - \alpha) \cdot S_{i-1} + \alpha \cdot \text{net\_flow}_i$$

   The EMA smooths out short-term fluctuations. With a very small α (~0.000003209), the EMA changes slowly 99.9999968% comes from the previous EMA value and only 0.0000032% from the current block's flow. This creates a 30-day half-life, meaning it takes about 30 days for the EMA to move halfway toward a new sustained flow level. This results in an EMA window of approximately ~86.8 days.

3. **Apply offset and clipping**: Calculate offset flows by subtracting the lower limit $L$:
   $$z_i = \max(S_i - L, 0)$$
   where $L = \max(\text{FlowCutoff}, \min_{j} \min(S_j, 0))$

   This step ensures subnets with negative net flows get zero emissions. The lower limit $L$ is set to the most negative EMA across all subnets (or FlowCutoff if higher). By subtracting this from each subnet's EMA, we "lift" all values so the worst-performing subnet gets 0.

4. **Power normalization**: Apply power $p$ to adjust distribution characteristics:
   $$\text{share}_{\text{flow}}(i) = \frac{z_i^p}{\sum_{j \in \mathbb{S}} z_j^p}$$

   This converts the offset flows into proportions that sum to 1 (100%). With $p = 1$ (default), this is just dividing each subnet's offset flow by the total across all subnets, creating a linear relationship. Higher $p$ values favor subnets with stronger flows.

5. **Final TAO injection**: Multiply the share by total block emission to get actual TAO amount:
   $$\Delta\tau_i = \Delta\bar{\tau} \times \text{share}(i)$$

   This converts the proportions into actual TAO amounts. Currently, the total block emission $\Delta\bar{\tau}$ is 0.5 TAO per block.

With the default $p = 1$ ([source](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1293-L1295)), this creates **linear/proportional distribution**: a subnet with 2× the flow receives exactly 2× the emissions. The parameter can be adjusted to create winner-takes-more dynamics if desired (e.g., with $p = 1.5$, a subnet with 2× flow would get 2.83× emissions).

**Key Parameters**:

- **EMA smoothing factor**: 30-day half-life (results in ~86.8 day EMA window) ([source](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1302-L1308))
- **Power exponent**: $p = 1$ (linear/proportional) ([source](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1293-L1295))
- **Flow cutoff**: 0 (only negative flows clipped) ([source](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1285-L1288))
- **EMA Initialization**: New subnets start with EMA = min(moving_price, current_price) ([code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs#L77-L84))

**Implementation**:

- Flow tracking: [`record_tao_inflow()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs#L36-L40) and [`record_tao_outflow()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs#L42-L46), called during stake/unstake
- Share calculation: [`get_shares()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs#L214-L216) → [`get_shares_flow()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs#L181-L211)

:::info Exceptions to Inflows/Outflows
Flow tracking does not include root proportion.
While stake/unstake operations are recorded as inflows or outflows, swaps like the `burned_register` (UID registration) and the root claim are excluded.

See [Calculating root proportion](../navigating-subtensor/emissions-coinbase#6-calculating-root-proportion).
:::

</details>

#### Alpha reserve injection

Alpha is then injected in proportion to the price of the token, so that growth of a subnet's liquidity pools does not change the price of the alpha token.

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
Under the new flow-based model, subnets that have negative net TAO flows (more unstaking than staking) for sufficiently long will receive **zero TAO emissions** and consequently **zero alpha injection**. This means:

- No liquidity growth for the subnet pool
- Higher slippage for users trying to stake
- Difficulty attracting new participants

To maintain positive emissions, subnet owners should focus on:

- Building genuine utility that attracts long-term stakers
- Creating sustainable value that encourages TAO inflows
  :::

### Distribution

At the end of each tempo (~360 blocks), the quantity of alpha accumulated over each block of the tempo is distributed network participants in the following proportions:

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

## Rationale for Flow-Based Emissions

The shift from price-based to flow-based emissions addressed several fundamental issues with the original model, as explained by Bittensor co-founder Jacob Steeves (a.k.a., Const) in the [October 30, 2025 episode of Novelty Search](https://www.youtube.com/live/40ug9nbYW9U?si=H6mTnO2pwqwtE25U):

### Leveling the Playing Field

The new model measures emissions contribution "per unit liquidity" to eliminate structural advantages:

- **Old model problem**: Small subnets with low liquidity are devastated by minor sell pressure, while large subnets with high liquidity can absorb massive selling with minimal emission impact
- **New model solution**: All subnets are evaluated by their net TAO flow. Because this is the difference between in-flow and out-flow of TAO, it is scale-invariant and does _not_ favor subnets with larger total liquidity pools, leveling the playing field.

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
