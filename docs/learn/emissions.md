---
title: "Emission"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

Emission is the economic heartbeat of Bittensor—the process that continuously distributes newly created [TAO](../resources/glossary.md#tao-tau) and subnet-specific alpha tokens to network participants who contribute value through [mining](../resources/glossary.md#subnet-miner), [validation](../resources/glossary.md#subnet-validator), [staking](../resources/glossary.md#staking), and [subnet creation](../resources/glossary.md#subnet-creator).

:::tip Price-Based Emissions with Emission Gate
**As of June 2026**: Bittensor uses a **price-based model** for determining how TAO emissions are distributed across subnets. Subnet price shares now pass through a **Hill gate function** before normalization, concentrating emission toward subnets with above-average demand, while reducing emission allocation to idle or low-demand subnets.

See:

- [How the emission gate works](#tao-reserve-injection)
  :::

## Injection and Distribution: Two-Stages of the Emissions Process

Bittensor's emission system operates through two stages, reflecting the system's hierarchical, competitive nature:

- **Injection**: Every [block](../resources/glossary.md#block), new liquidity flows into each subnet's liquidity pools, based on subnet performance.

- **Distribution**: At the end of each [tempo](../resources/glossary.md#tempo) (default ~360 blocks; owner-configurable), accumulated rewards within each subnet are distributed to the subnet's participants through [Yuma Consensus](../resources/glossary.md#yuma-consensus), which evaluates individual performance and determines who deserves what share.

:::info Manual epoch triggering
Subnet owners can also manually trigger an epoch via the `trigger_epoch` extrinsic on the `SubtensorModule` pallet. This operates independently of the automatic epoch schedule and allows an epoch to be executed on demand.
:::

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

TAO emissions across subnets are determined by a price-based model with an emission gate. Each subnet's raw share is proportional to its EMA price (`SubnetMovingPrice`) weighted by its miner-burn penalty. The raw share is then passed through a Hill gate function centered on the demand distribution. Subnets above the threshold retain nearly their full share, while those below it receive progressively smaller allocations, with the lowest-demand subnets receiving only 1–5%. Emission-disabled subnets receive zero regardless of gate position, and their share is redistributed to enabled subnets.

:::info Deprecated: Flow-Based Emissions

From November 2025 to June 2026, emission shares were determined by a flow-based model that used an EMA of net TAO flows (staking minus unstaking activity) rather than price. That model's share logic `(get_shares_flow()`) is now deprecated.

:::

#### TAO reserve injection

A subnet's TAO reserve injection is determined by its **emission share**, calculated from its EMA price (`SubnetMovingPrice`) relative to the sum of EMA prices across all emission-enabled subnets.

<details>
<summary><strong>How it's calculated</strong></summary>

Emission shares are computed in four steps:

**Step 1 — Raw share** (price × miner-burn penalty):

$$
s_i = p_i \cdot (1 - b_i)
$$

**Step 2 — Demand bar** (recomputed each tempo from the same EMA prices):

$$
\theta = \text{quantile}_q\bigl(\{s_i\}_{i \in \mathbb{S}}\bigr)
$$

where $q$ = `EmissionBarQuantile` (default 0.61, landing around rank 32 on current mainnet).

**Step 3 — Hill gate**:

$$
\text{gate}(s_i) = \frac{s_i^h}{s_i^h + \theta^h}
$$

where $h$ = `EmissionGateExponent` (default 3). At $s_i = \theta$ the gate passes exactly $\frac{1}{2}$; well above the bar it approaches 1; deep below it approaches 0.

**Step 4 — Normalized emission share**:

$$
\text{share}_i = \frac{s_i \cdot \text{gate}(s_i)}{\sum_{j \in \mathbb{S}} s_j \cdot \text{gate}(s_j)}
$$

where:

- $p_i$ = `SubnetMovingPrice` — the subnet's EMA price (not the live spot price)
- $b_i$ = `MinerBurned` — the proportion (0–1) of the most recent tempo's miner incentive withheld because the recipient hotkey is owned by the subnet owner, regardless of whether that emission is recycled or burned
- $\theta$ = demand bar; recomputed once per tempo
- $h$ = gate sharpness; at $h = 3$ a subnet near the bar gains ~26% more emission for a 10% demand increase

TAO injected into subnet $i$ per block:

$$
\Delta\tau_i = \Delta\bar{\tau} \times \text{share}_i
$$

**Fallback**: if the combined gate-weighted sum is zero (e.g. all subnets withholding all miner emission), `get_shares` falls back to unweighted price shares — $p_i / \sum p_j$ — so block emission is never stranded.

**Implementation**: [`get_shares()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs) → `get_shares_price_ema()` in `subnet_emissions.rs`

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

At the end of each tempo (default ~360 blocks; owner-configurable), the quantity of alpha accumulated over each block of the tempo is distributed to network participants in the following proportions:

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
