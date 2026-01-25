---
title: "Coinbase Implementation"
---

# Coinbase Implementation

This document provides a technical deep dive into the `run_coinbase()` function that orchestrates [TAO](../resources/glossary.md#tao-tau) and alpha [emission](../resources/glossary.md#emission) distribution across [subnets](../resources/glossary.md#subnet). The coinbase mechanism serves as Bittensor's economic heartbeat, connecting [subnet validators](../resources/glossary.md#subnet-validator), [subnet miners](../resources/glossary.md#subnet-miner), and [stakers](../resources/glossary.md#staking) through emission distribution.

For conceptual understanding of emission mechanisms, see [Emissions](../learn/emissions.md).

The coinbase mechanism orchestrates Bittensor's tokenomic engine, running every 12-second [block](../resources/glossary.md#block) to ensure continuous flow of liquidity into the network.

Every block, the coinbase mechanism performs three critical functions:

1. **Liquidity Injection**: Adds TAO and subnet-specific alpha tokens to each subnet's liquidity pools.
2. **Accumulation**: Builds up pending [emissions](../resources/glossary.md#emission) (also known as "alpha outstanding") bound for distribution to [subnet miners](../resources/glossary.md#subnet-miner) and [validators](../resources/glossary.md#subnet-validator) during the next [epoch](../resources/glossary.md#tempo).
3. **Consensus Triggering**: Initiates each subnet's [Yuma Consensus](../resources/glossary.md#yuma-consensus) epochs, the process that distributes emissions to participants within each subnet. Epochs are staggered to avoid overloading the blockchain with the computation involved.

For broader conceptual understanding of emission mechanisms, see [Emissions](../learn/emissions.md).

## Core Function: `run_coinbase()`

**Location**: [`run_coinbase.rs`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/run_coinbase.rs)

```rust
pub fn run_coinbase(block_emission: U96F32)
```

**Parameters**:

- `block_emission`: Total TAO to distribute across all subnets this block. Currently 1 $\tau$, this amount will follow a halving schedule.

The function implements a multistep process that handles liquidity injection, reward accumulation, epoch triggering, and EMA updates.

## Implementation Flow

### 1. Subnet Discovery and Filtering

The process begins with identifying subnets eligible for emissions, applying filters to ensure only active, established subnets participate in the reward distribution.

```rust
// Get all netuids (filter out root)
let subnets: Vec<NetUid> = Self::get_all_subnet_netuids()
    .into_iter()
    .filter(|netuid| *netuid != NetUid::ROOT)
    .collect();

// Filter out subnets with no first emission block number
let subnets_to_emit_to: Vec<NetUid> = subnets
    .clone()
    .into_iter()
    .filter(|netuid| FirstEmissionBlockNumber::<T>::get(*netuid).is_some())
    .collect();
```

**Subnet Eligibility Rules:**

- **[Root Subnet](../resources/glossary.md#root-subnetsubnet-zero) Exclusion**: [Subnet Zero](../resources/glossary.md#root-subnetsubnet-zero) operates differently—it has no [subnet miners](../resources/glossary.md#subnet-miner) and serves as a TAO staking pool for [delegates](../resources/glossary.md#delegate), so it's excluded from direct alpha emissions
- **Emission Readiness**: Only subnets that have been started (and hence been assigned a `FirstEmissionBlockNumber`) receive emissions.

### 2. Emission Allocation to Subnets

:::tip Flow-Based Emissions Active
As of November 2025, subnet emissions are determined by net TAO flows (staking minus unstaking) rather than token prices. This section describes the current flow-based model.
:::

Each subnet's share of the block's TAO emission depends on its net TAO flow, smoothed with an [exponential moving average (EMA)](../learn/ema) to prevent manipulation while maintaining responsiveness to genuine user engagement.

**Flow-Based Distribution:**
The system tracks TAO inflows and outflows for each subnet, calculating an EMA of net flows with a 30-day half-life (~86.8 day effective window):

$$
S_i = (1 - \alpha) \cdot S_{i-1} + \alpha \cdot \text{net\_flow}_i
$$

where $\alpha \approx 0.000003209$ (smoothing factor).

Each subnet receives TAO emissions proportional to its offset flow share:

$$
\text{tao\_allocation}_i = \text{block\_emission} \times \frac{z_i^p}{\sum_{j} z_j^p}
$$

where $z_i = \max(S_i - L, 0)$ and $L$ is the lower limit ensuring subnets with negative net flows receive zero emissions.

**Implementation:**

- Flow tracking: `record_tao_inflow()` and `record_tao_outflow()` called during stake/unstake operations
- Share calculation: `get_shares()` → `get_shares_flow()`
- See [Emissions](../learn/emissions.md#tao-reserve-injection) for complete mathematical details

**Key Characteristics:**

- Subnets with sustained negative flows (more unstaking than staking) receive zero emissions
- Rewards genuine user engagement rather than just accumulated liquidity
- Prevents "TAO treasury" gaming strategies that were possible under the previous price-based model

### 3. Token Pool Injections and Emissions

For each subnet, the coinbase calculates critical values that govern the subnet's token economics and determine how fresh liquidity flows into the system.

#### TAO In (`tao_in`): Fresh Liquidity Injection

- Represents new TAO flowing into the subnet's liquidity pool
- Calculated from the subnet's proportional share of block emissions
- May be reduced through the subsidy mechanism to maintain price stability

#### Alpha In (`alpha_in`): Liquidity Pool Balance

- Alpha tokens injected to maintain healthy AMM pool ratios
- Ensures the TAO injection doesn't create excessive [slippage](../resources/glossary.md#slippage) for [stakers](../resources/glossary.md#staking)
- Calculated as: `tao_in / current_price` during normal operations

#### Alpha Out (`alpha_out`): Participant Emissions

- Alpha tokens emitted for distribution to [miners](../resources/glossary.md#subnet-miner) and [subnet validators](../resources/glossary.md#subnet-validator)
- Represents the subnet's emission budget for [incentives](../resources/glossary.md#incentives) and validator dividends
- Forms the reward pool that will be processed during [epochs](../resources/glossary.md#tempo)

#### Subsidy Mechanism

When a subnet's alpha price falls below its expected emission proportion, the mechanism automatically intervenes to maintain market stability:

1. **Price Neutral Injection**: Downscales both TAO and ALPHA injected to provide a price neutral injection
2. **Market Making**: Uses the excess TAO for buying pressure on alpha tokens

This encourages alpha prices to move towards their emission ratio, or to encourage the sum of prices to be at/above 1.

```rust
for netuid_i in subnets_to_emit_to.iter() {
    let price_i = T::SwapInterface::current_alpha_price((*netuid_i).into());
    let moving_price_i: U96F32 = Self::get_moving_alpha_price(*netuid_i);

    let default_tao_in_i: U96F32 = block_emission
        .saturating_mul(moving_price_i)
        .checked_div(total_moving_prices)
        .unwrap_or(asfloat!(0.0));

    let alpha_emission_i: U96F32 = asfloat!(
        Self::get_block_emission_for_issuance(
            Self::get_alpha_issuance(*netuid_i).into()
        ).unwrap_or(0)
    );


    let tao_in_ratio: U96F32 = default_tao_in_i.safe_div_or(
        U96F32::saturating_from_num(block_emission),
        U96F32::saturating_from_num(0.0),
    );

    if price_i < tao_in_ratio {
        tao_in_i = price_i.saturating_mul(block_emission);
        alpha_in_i = block_emission;
        let difference_tao: U96F32 = default_tao_in_i.saturating_sub(tao_in_i);

        let buy_swap_result = Self::swap_tao_for_alpha(
            *netuid_i,
            tou64!(difference_tao).into(),
            T::SwapInterface::max_price().into(),
            true, // skip fees
        );
    } else {
        // Normal operation
        tao_in_i = default_tao_in_i;
        alpha_in_i = tao_in_i.safe_div_or(price_i, alpha_emission_i);
    }
}
```

### 4. Liquidity Pool Updates

The coinbase updates each subnet's liquidity pools.

**Critical State Updates:**

- **`SubnetAlphaIn`**: Alpha reserves backing the AMM, enabling liquid [staking](../resources/glossary.md#staking) and unstaking operations.
- **`SubnetAlphaOut`**: Accumulated emissions and/or ALPHA outside the pool (ALPHA emissions + ALPHA taken out from pool).
- **`SubnetTAO`**: TAO reserves backing the AMM, providing price stability and liquidity for unstaking.
- **`TotalIssuance`**: Global TAO supply (see [Issuance](../resources/glossary.md#issuance)).

```rust
for netuid_i in subnets_to_emit_to.iter() {
    // Inject Alpha in (AMM liquidity)
    let alpha_in_i = AlphaCurrency::from(
        tou64!(*alpha_in.get(netuid_i).unwrap_or(&asfloat!(0)))
    );
    SubnetAlphaIn::<T>::mutate(*netuid_i, |total| {
        *total = total.saturating_add(alpha_in_i);
    });

    // Inject Alpha outstanding
    let alpha_out_i = AlphaCurrency::from(
        tou64!(*alpha_out.get(netuid_i).unwrap_or(&asfloat!(0)))
    );
    SubnetAlphaOut::<T>::mutate(*netuid_i, |total| {
        *total = total.saturating_add(alpha_out_i);
    });

    // Inject TAO in (AMM liquidity)
    let tao_in_i: TaoCurrency =
        tou64!(*tao_in.get(netuid_i).unwrap_or(&asfloat!(0))).into();
    SubnetTAO::<T>::mutate(*netuid_i, |total| {
        *total = total.saturating_add(tao_in_i.into());
    });

    // Update global TAO supply tracking
    TotalIssuance::<T>::mutate(|total| {
        *total = total.saturating_add(tao_in_i.into());
    });

    // Notify AMM of new liquidity
    T::SwapInterface::adjust_protocol_liquidity(*netuid_i, tao_in_i, alpha_in_i);
}
```

### 5. Subnet Owner Emissions

Before distributing rewards to [miners](../resources/glossary.md#subnet-miner) and [subnet validators](../resources/glossary.md#subnet-validator), the system allocates a percentage to [subnet owners](../resources/glossary.md#subnet-creator).

[Subnet owners](../resources/glossary.md#subnet-creator) receive 18% of alpha emissions. The subnet owner cut is calculated before other distributions so that the owner cut can be passed to `drain_pending_emission` (there was a bug before where the owner cut was incorrectly calculated after). Subnet owner emissions accumulate in `PendingOwnerCut` until the next [epoch](../resources/glossary.md#tempo).

```rust
let cut_percent: U96F32 = Self::get_float_subnet_owner_cut(); // Default: ~18%
let mut owner_cuts: BTreeMap<NetUid, U96F32> = BTreeMap::new();

for netuid_i in subnets_to_emit_to.iter() {
    let alpha_out_i: U96F32 = *alpha_out.get(netuid_i).unwrap_or(&asfloat!(0));
    let owner_cut_i: U96F32 = alpha_out_i.saturating_mul(cut_percent);

    owner_cuts.insert(*netuid_i, owner_cut_i);
    alpha_out.insert(*netuid_i, alpha_out_i.saturating_sub(owner_cut_i));

    PendingOwnerCut::<T>::mutate(*netuid_i, |total| {
        *total = total.saturating_add(tou64!(owner_cut_i).into());
    });
}
```

### 6. Calculating Root Proportion

The root proportion on each subnet determines how much of the dividends (41% of ALPHA emissions) are being sold for each block and being distributed to stakers on root.

$$
\text{root\_proportion} = \frac{\text{root\_tao} \times \text{tao\_weight}}{\text{root\_tao} \times \text{tao\_weight} + \text{alpha\_issuance}}
$$

Where:

- `root_tao`: Total TAO [staked](../resources/glossary.md#staking) in [Root Subnet](../resources/glossary.md#root-subnetsubnet-zero)
- `tao_weight`: Global parameter ([TAO Weight](../resources/glossary.md#tao-weight)) determining TAO vs alpha influence
- `alpha_issuance`: Total alpha tokens for this specific subnet

```rust
for netuid_i in subnets_to_emit_to.iter() {
    let alpha_out_i: U96F32 = *alpha_out.get(netuid_i).unwrap_or(&asfloat!(0.0));
    let root_tao: U96F32 = asfloat!(SubnetTAO::<T>::get(NetUid::ROOT));
    let alpha_issuance: U96F32 = asfloat!(Self::get_alpha_issuance(*netuid_i));
    let tao_weight: U96F32 = root_tao.saturating_mul(Self::get_tao_weight());

    // Calculate root subnet's proportional share
    let root_proportion: U96F32 = tao_weight
        .checked_div(tao_weight.saturating_add(alpha_issuance))
        .unwrap_or(asfloat!(0.0));

    // 50% of proportional alpha goes to root validators
    let root_alpha: U96F32 = root_proportion
        .saturating_mul(alpha_out_i)
        .saturating_mul(asfloat!(0.5));

    let pending_alpha: U96F32 = alpha_out_i.saturating_sub(root_alpha);

    // Convert root alpha to TAO through AMM (if not subsidized)
    // If the subnet is subsidized by the Subsidy Mechanism then no ALPHA will be sold - so the dividends for root are stopped.
    if !subsidized {
        let swap_result = Self::swap_alpha_for_tao(
            *netuid_i,
            tou64!(root_alpha).into(),
            T::SwapInterface::min_price().into(),
            true, // skip fees
        );

        if let Ok(ok_result) = swap_result {
            PendingRootDivs::<T>::mutate(*netuid_i, |total| {
                *total = total.saturating_add(ok_result.amount_paid_out.into());
            });
        }
    }

    PendingEmission::<T>::mutate(*netuid_i, |total| {
        *total = total.saturating_add(tou64!(pending_alpha).into());
    });
}
```

### 7. Epoch Execution

When each subnet's [tempo](../resources/glossary.md#tempo) interval completes, the coinbase triggers execution of its Yuma Consensus _epoch_. Epochs execute when `(block_number + netuid + 1) % (tempo + 1) == 0`, creating a predictable, staggered schedule of epoch execution.

The coinbase passes accumulated emissions to `drain_pending_emission()`, which executes the [full Yuma Consensus algorithm](./epoch.md) including validator weight processing, consensus calculation, bond updates, and final emission distribution to participants.

For detailed implementation of the consensus mechanism, validator weight processing, and emission distribution, see [Epoch Implementation](./epoch.md).

```rust
for &netuid in subnets.iter() {
    // Process matured commit-reveal weight submissions
    if let Err(e) = Self::reveal_crv3_commits(netuid) {
        log::warn!("Failed to reveal commits for subnet {netuid} due to error: {e:?}");
    }

    if Self::should_run_epoch(netuid, current_block) {
        // Reset epoch timing and collect accumulated emissions
        BlocksSinceLastStep::<T>::insert(netuid, 0);
        LastMechansimStepBlock::<T>::insert(netuid, current_block);

        // Execute Yuma Consensus with accumulated rewards
        Self::drain_pending_emission(netuid, pending_alpha, pending_tao, pending_swapped, owner_cut);
    } else {
        BlocksSinceLastStep::<T>::mutate(netuid, |total| *total = total.saturating_add(1));
    }
}
```
