---
title: "Coinbase Implementation"
---

# Coinbase Implementation

This document provides a technical deep dive into the `run_coinbase()` function that orchestrates [TAO](../resources/glossary.md#tao-τ) and alpha [emission](../resources/glossary.md#emission) distribution across [subnets](../resources/glossary.md#subnet). The coinbase mechanism serves as Bittensor's economic heartbeat, connecting [subnet validators](../resources/glossary.md#validator), [subnet miners](../resources/glossary.md#subnet-miner), and [stakers](../resources/glossary.md#staking) through emission distribution.

For conceptual understanding of emission mechanisms, see [Emissions](../learn/emissions.md).

The coinbase mechanism orchestrates Bittensor's tokenomic engine, running every 12-second [block](../resources/glossary.md#block) to ensure continuous flow of liquidity into the network.

Every block, the coinbase mechanism performs three critical functions:

1. **Liquidity Injection**: Adds TAO and subnet-specific alpha tokens to each subnet's liquidity pools.
2. **Accumulation**: Builds up pending [emissions](../resources/glossary.md#emission) (also known as "alpha outstanding") bound for distribution to [subnet miners](../resources/glossary.md#subnet-miner) and [validators](../resources/glossary.md#validator) during the next [epoch](../resources/glossary.md#tempo).
3. **Consensus Triggering**: Initiates each subnet's [Yuma Consensus](../resources/glossary.md#yuma-consensus) epochs, the process that distributes emissions to participants within each subnet. Epochs are staggered to avoid overloading the blockchain with the computation involved.

For broader conceptual understanding of emission mechanisms, see [Emissions](../learn/emissions.md).

## Core Function: `run_coinbase()`

**Location**: [`run_coinbase.rs`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/run_coinbase.rs)

```rust
pub fn run_coinbase(block_emission: U96F32)
```

**Parameters**:
- `block_emission`: Total TAO to distribute across all subnets this block. Currently 1 $\tau$, this amount will follow a halving schedule.

The function implements an eight-step process that handles liquidity injection, reward accumulation, epoch triggering, and EMA updates.

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

Each subnet's share of the block's TAO emission depends on its alpha token's price, smoothed with an [exponential moving average (EMA)](../learn/ema) function to prevent price manipulation while maintaining market responsiveness.

```rust
let mut total_moving_prices = U96F32::saturating_from_num(0.0);
for netuid_i in subnets_to_emit_to.iter() {
    total_moving_prices = total_moving_prices
        .saturating_add(Self::get_moving_alpha_price(*netuid_i));
}
```

**EMA Price Smoothing Implementation:**
The moving price for each subnet is calculated using a sophisticated EMA that adapts its responsiveness based on subnet maturity:

$$
\alpha = \text{base\_alpha} \times \frac{\text{blocks\_since\_start}}{\text{blocks\_since\_start} + \text{halving\_blocks}}
$$

$$
\text{moving\_price}^{(t)} = \alpha \times \text{current\_price} + (1-\alpha) \times \text{moving\_price}^{(t-1)}
$$

Where:
- **base_alpha**: ~0.000003 (approximately 30 days to reach 50% of true price)
- **halving_blocks**: 201,600 blocks (~4 weeks at 12-second blocks)
- **blocks_since_start**: Blocks elapsed since subnet creation

This creates a **double-smoothing effect**: new subnets have extremely slow price adaptation (preventing launch manipulation), while mature subnets respond more quickly to legitimate market signals.

**Price-Driven Distribution:**
Each subnet receives TAO emissions proportional to its EMA-smoothed alpha token price:

$$
\text{tao\_allocation}_i = \text{block\_emission} \times \frac{\text{moving\_price}_i}{\sum_{j} \text{moving\_price}_j}
$$

**EMA Update Timing:** The EMA is updated **after** being used for emission calculations in each `run_coinbase()` call (line 279), ensuring that current block emissions are based on the previous block's smoothed prices while continuously updating the moving average for future calculations.

### 3. Three Token Pool Injections

For each subnet, the coinbase calculates three critical values that govern the subnet's token economics and determine how fresh liquidity flows into the system.

#### TAO In (`tao_in`): Fresh Liquidity Injection
- Represents new TAO flowing into the subnet's liquidity pool
- Calculated from the subnet's proportional share of block emissions
- May be reduced through the subsidy mechanism to maintain price stability

#### Alpha In (`alpha_in`): Liquidity Pool Balance  
- Alpha tokens injected to maintain healthy AMM pool ratios
- Ensures the TAO injection doesn't create excessive [slippage](../resources/glossary.md#slippage) for [stakers](../resources/glossary.md#staking)
- Calculated as: `tao_in / current_price` during normal operations

#### Alpha Out (`alpha_out`): Participant Rewards
- Alpha tokens allocated for distribution to [subnet miners](../resources/glossary.md#subnet-miner) and [validators](../resources/glossary.md#validator)
- Represents the subnet's emission budget for [incentives](../resources/glossary.md#incentives) and validator emissions
- Forms the reward pool that will be processed during [epochs](../resources/glossary.md#tempo)

#### Price Stabilization

When a subnet's alpha price falls below its expected emission proportion, the a mechanism automatically intervenes to maintain market stability:
1. **Price Support**: Reduces TAO injection to prevent further price depression
2. **Market Making**: Uses the "saved" TAO to buy alpha from the pool, supporting the token price

This creates a floor for alpha token prices while maintaining the market-driven allocation philosophy.

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
        alpha_in_i = alpha_emission_i;
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
- **`SubnetAlphaOut`**: The emissions pool that [Yuma Consensus](../resources/glossary.md#yuma-consensus) allocates to participants during epochs.
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

### 5. Subnet Creator Emissions

Before distributing rewards to [subnet miners](../resources/glossary.md#subnet-miner) and [validators](../resources/glossary.md#validator), the system allocates a percentage to [subnet creators](../resources/glossary.md#subnet-creator).

[Subnet creators](../resources/glossary.md#subnet-creator) receive 18% of alpha emissions by default, although they can reduce their cut. The subnet creator cut is calculated before other distributions to ensure creators receive emissions regardless of network performance. Subnet creator emissions accumulate in `PendingOwnerCut` until the next [epoch](../resources/glossary.md#tempo).


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


### 6. Calculating Root Emissions

The [Root Subnet](../resources/glossary.md#root-subnetsubnet-zero) emission system determines how much of each subnet's emissions flows back to TAO holders that have staked into subnet zero, the root subnet.

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

When each subnet's [tempo](../resources/glossary.md#tempo) interval completes, the coinbase triggers execution of its Yuma Consensus *epoch*. Epochs execute when `(block_number + netuid + 1) % (tempo + 1) == 0`, creating a predictable, staggered schedule of epoch execution.

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


### 8. EMA Price Update 

**After** epoch execution completes, the system updates each subnet's moving price for future calculations:

```rust

for netuid_i in subnets_to_emit_to.iter() {
    // Update moving prices after using them above.
    Self::update_moving_price(*netuid_i);
}
```

