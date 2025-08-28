---
title: "Emission"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Emission

Emission is the economic heartbeat of Bittensor—the process that continuously distributes newly created [TAO](./glossary.md#tao-τ) and subnet-specific alpha tokens to network participants who contribute value through [mining](./glossary.md#subnet-miner), [validation](./glossary.md#validator), [staking](./glossary.md#staking), and [subnet creation](./glossary.md#subnet-creator).

## Understanding the Two-Stage Process

Bittensor's emission system operates through two coordinated stages that work together to ensure fair, market-driven distribution:

### Stage 1: Injection into Subnets
Every [block](./glossary.md#block), new liquidity flows into [subnet](./glossary.md#subnet) pools based on market performance. [Subnets](./glossary.md#subnet) with higher-value alpha tokens attract more TAO, creating a competitive marketplace for innovation.

### Stage 2: Extraction by Participants  
Every [tempo](./glossary.md#tempo) (360 blocks, ~72 minutes), accumulated rewards are distributed to participants through [Yuma Consensus](./glossary.md#yuma-consensus), which evaluates performance and determines who deserves what share.

This two-stage approach creates stability while maintaining responsiveness—rewards accumulate gradually but are distributed based on demonstrated value creation.

## Technical References
- **Implementation Details**: [Coinbase Implementation](./navigating-subtensor/emissions-coinbase-improved.md)
- **Consensus Mechanics**: [Yuma Consensus](./yuma-consensus.md)
- **Mathematical Framework**: [Dynamic TAO White Paper](https://drive.google.com/file/d/1vkuxOFPJyUyoY6dQzfIWwZm2_XL3AEOx/view)

### Injection

The first stage of emissions is _injection of liquidity_ into the subnet pools. Liquidity is injected to each subnet in proportion to the price of its token compared to the price of other subnet tokens. This is designed to incentivize development on the most valuable subnets.

Each block:

- TAO is injected into the subnet's **TAO reserve**.
- Alpha is injected into the subnet's **alpha reserve**.
- Alpha is allocated to _alpha outstanding_, to be extracted by participants.

#### TAO reserve injection

A subnet's TAO reserve injection is computed in proportion to the price of its alpha token over the sum of prices for all the subnets in Bittensor.

<details>
  <summary><strong>See how it's calculated!</strong></summary>

    Given set $\mathbb{S}$ of all subnets, and a total per block TAO emission $\Delta\bar{\tau}$, which begins at 1 TAO and follows a halving schedule, TAO emission $\Delta\tau_i$ to subnet $i$ with price $p_i$ is:

    $$
    \Delta\tau_i = \Delta\bar{\tau} \times
    \frac
      {p_i}
      {\sum_{j \in \mathbb{S}}
    \bigl(p_j)}
    $$

</details>

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

### Extraction

At the end of each tempo (360 blocks), the quantity of alpha accumulated over each block of the tempo is extracted by network participants in the following proportions:

1.  18% by subnet owner
1.  41% of emissions go to miners. The allocation to particular miners is determined by [Yuma Consensus: Miner emissions#miner-emissions](../yuma-consensus).
1.  41% by validators and their stakers.

    1.  First, the allocation to validators miners is determined by [Yuma Consensus: Validator Emissions](./yuma-consensus#validator-emissions).
    1.  Then, validators extract their take from that allocation.
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

            Validators who hold both root TAO and subnet alphas will extract both types of token.
            </details>

    See [Core Dynamic TAO Concepts: Validator stake weight](../subnets/understanding-subnets#validator-stake-weight)

### Note on evolution of Bittensor token economy

When Dynamic TAO is initiated, there will be no alpha in circulation, so validator's stake weights will be entirely determined by their share of TAO stake.

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
