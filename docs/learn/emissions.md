---
title: "Emission"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Emission

Emission is the economic heartbeat of Bittensor—the process that continuously distributes newly created [TAO](../resources/glossary.md#tao-tau) and subnet-specific alpha tokens to network participants who contribute value through [mining](../resources/glossary.md#subnet-miner), [validation](../resources/glossary.md#subnet-validator), [staking](../resources/glossary.md#staking), and [subnet creation](../resources/glossary.md#subnet-creator).

:::tip Price-Based Emissions Now Active
**As of June 2026**: Bittensor has reverted to a **price-based model** for determining how TAO emissions are distributed across subnets. Each subnet's share of block emissions is proportional to its EMA (Exponential Moving Average) token price, normalized over all subnets with emissions enabled.

See:

- [How price-based injection works](#tao-reserve-injection)
  :::

## Injection and Distribution: Two-Stages of the Emissions Process

Bittensor's emission system operates through two stages, reflecting the system's hierarchical, competitive nature:

- **Injection**: Every [block](../resources/glossary.md#block), new liquidity flows into each subnet's liquidity pools, based on subnet performance.

- **Distribution**: At the end of each [tempo](../resources/glossary.md#tempo) (waiting period of ~360 blocks, ~72 minutes), accumulated rewards within each subnet are distributed to the subnet's participants through [Yuma Consensus](../resources/glossary.md#yuma-consensus), which evaluates individual performance and determines who deserves what share.

See also:

- [Coinbase Implementation](../navigating-subtensor/emissions-coinbase.md) in the Subtensor codebase
- [Yuma Consensus](./yuma-consensus.md)
- [Dynamic TAO White Paper](https://drive.google.com/file/d/1vkuxOFPJyUyoY6dQzfIWwZm2_XL3AEOx/view)

### Injection

The first stage of emissions is _injection of liquidity_ into the subnet pools. Each subnet receives liquidity in proportion to its EMA token price relative to all other emission-enabled subnets.

Each block:

- **TAO is injected** into the subnet's **TAO reserve**: the amount for each subnet is determined by the emission distribution formula (see below)
- **Alpha is injected** into the subnet's **alpha reserve**: proportional to TAO injection to maintain price stability
- **Alpha is allocated** to _alpha outstanding_: set aside to be distributed by participants (miners, validators, stakers, subnet owner)

#### Distribution across Subnets

TAO emissions across subnets are determined by a price-based model. Each subnet's emission share is proportional to its EMA price (`SubnetMovingPrice`), normalized over all emission-enabled subnets — so subnets with higher EMA prices attract a greater share of block emissions. Emission-disabled subnets receive zero and their share is redistributed proportionally to enabled subnets.

:::info Deprecated: Flow-Based Emissions

From November 2025 to June 2026, emission shares were determined by a flow-based model that used an EMA of net TAO flows (staking minus unstaking activity) rather than price. That model's share logic `(get_shares_flow()`) is now deprecated.

:::

#### TAO reserve injection

A subnet's TAO reserve injection is determined by its **emission share**, calculated from its EMA price (`SubnetMovingPrice`) relative to the sum of EMA prices across all emission-enabled subnets.

<details>
<summary><strong>How it's calculated</strong></summary>

The price-based model uses the subnet's Exponential Moving Average price (`SubnetMovingPrice`), not the live spot price:

Given set $\mathbb{S}$ of all emission-enabled subnets, and a total per-block TAO emission $\Delta\bar{\tau}$ (which begins at 1 TAO and follows a halving schedule), the emission share for subnet $i$ with EMA price $p_i$ is:

$$
\text{share}(i) = \frac{p_i}{\sum_{j \in \mathbb{S}} p_j}
$$

And the TAO injected into subnet $i$ per block is:

$$
\Delta\tau_i = \Delta\bar{\tau} \times \frac{p_i}{\sum_{j \in \mathbb{S}} p_j}
$$

**Implementation**:

- Share calculation: [`get_shares()`](<https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs#:~:text=pub(crate)%20fn%20get_shares>) → `get_shares_price_ema()`

</details>

:::info Emission-Disabled Subnets
Subnets with emission disabled receive zero share, and their portion of the block emission is redistributed proportionally to all emission-enabled subnets.
:::

#### Alpha reserve injection

Alpha is injected in proportion to the price of the token, so that growth of a subnet's liquidity pools does not change the price of the alpha token.

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

When we fill in this equation with the previous formula for $\Delta\tau_i$, the price $p_i$ cancels out, yielding:

$$
\Delta\alpha_i =
  \frac
    {\Delta\bar{\tau}}
    {\sum_{j \in \mathbb{S}}
  \bigl(p_j)}
$$

However, alpha injection is also capped to prevent runaway inflation. The cap is now computed as:

$$
\text{alpha injection cap}_i = \text{root\_proportion}_i \times \Delta\bar{\alpha_i}
$$

where $\text{root\_proportion}_i = \frac{\text{tao\_weight}}{\text{tao\_weight} + \text{alpha\_issuance}_i}$.

Therefore, with this root-proportion-based cap:

$$
\Delta\alpha^{\text{in}}_i = \min\left\{
\frac{\Delta\tau_i}{p_i},\;
\text{root\_proportion}_i \times \Delta\bar{\alpha_i}
\right\}
$$

**Effect of the cap**: As a subnet ages, its `alpha_issuance` grows, which causes `root_proportion` to shrink, which in turn lowers the injection cap. TAO emission that cannot be injected as liquidity due to the cap becomes **excess TAO**, which is routed into chain buys instead. This is the mechanism that transitions older subnets from liquidity injection toward chain buys over time.

The cap or _alpha emission rate_ $\Delta\bar{\alpha_i}$ for subnet $i$ starts at 1 and follows a halving schedule identical to that of TAO, beginning when subnet $i$ is created.

</details>

#### Alpha outstanding injection

Each block, liquidity is also set aside to be emitted to participants (validators, miners, stakers, and subnet creator). The quantity per block is equal to the _alpha emission rate_ $\Delta\bar{\alpha_i}$ for subnet $i$.

### Distribution

At the end of each tempo (~360 blocks), the quantity of alpha accumulated over each block of the tempo is distributed to network participants in the following proportions:

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
