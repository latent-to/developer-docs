---
title: "Coinbase Implementation"
---

# Coinbase Implementation

This document provides a technical deep dive into the `run_coinbase()` function that orchestrates [TAO](../glossary.md#tao-τ) and alpha [emission](../glossary.md#emission) distribution across [subnets](../glossary.md#subnet). The coinbase mechanism serves as Bittensor's economic heartbeat, connecting [subnet validators](../glossary.md#validator), [subnet miners](../glossary.md#subnet-miner), and [stakers](../glossary.md#staking) through sophisticated emission distribution.

For conceptual understanding of emission economics, see [Emissions](../emissions.md).

## Understanding the Coinbase Role

The coinbase mechanism operates as Bittensor's economic engine, running every 12-second [block](../glossary.md#block) to ensure continuous value flow throughout the network. Unlike traditional blockchains where coinbase simply creates new tokens, Bittensor's coinbase intelligently distributes newly minted [TAO](../glossary.md#tao-τ) based on subnet performance and market dynamics.

Every block, the coinbase mechanism performs three critical functions:

1. **Liquidity Injection**: Adds fresh TAO and subnet-specific alpha tokens to automated market maker (AMM) pools, maintaining healthy token economics across all subnets
2. **Reward Accumulation**: Builds up pending [emissions](../glossary.md#emission) that will be distributed to [subnet miners](../glossary.md#subnet-miner) and [validators](../glossary.md#validator) during the next [tempo](../glossary.md#tempo)
3. **Consensus Triggering**: Initiates [Yuma Consensus](../glossary.md#yuma-consensus) epochs every 360 blocks, where accumulated rewards flow to network participants based on demonstrated performance

For broader conceptual understanding of emission economics, see [Emissions](../emissions.md).

## Core Function: `run_coinbase()`

**Location**: [`run_coinbase.rs`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/run_coinbase.rs)

```rust
pub fn run_coinbase(block_emission: U96F32)
```

**Parameters**:
- `block_emission`: Total TAO to distribute across all subnets this block (typically 1 TAO per block, continuously expanding the network's [total issuance](../glossary.md#issuance))

The function implements a seven-step process that handles liquidity injection, reward accumulation, and epoch triggering. Each step builds upon the previous one to create a comprehensive emission distribution system.

## Implementation Flow

### 1. Subnet Discovery and Filtering

The coinbase begins by identifying which subnets are eligible for emissions, applying careful filters to ensure only active, established subnets participate in the reward distribution.

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
- **[Root Subnet](../glossary.md#root-subnetsubnet-zero) Exclusion**: [Subnet Zero](../glossary.md#root-subnetsubnet-zero) operates differently—it has no [subnet miners](../glossary.md#subnet-miner) and serves as a TAO staking pool for [delegates](../glossary.md#delegate), so it's excluded from direct alpha emissions
- **Emission Readiness**: Only subnets with a `FirstEmissionBlockNumber` receive emissions, ensuring new subnets undergo proper initialization before participating in rewards
- **Anti-Gaming Protection**: This prevents immediate emission farming by requiring subnets to demonstrate commitment beyond just [burn cost](../glossary.md#burn-cost) payment

### 2. Emission Allocation to Subnets

The coinbase implements a sophisticated market mechanism where each subnet's share of the daily TAO emission depends on its alpha token's market performance. This creates a competitive environment where successful subnets attract more resources, encouraging [subnet creators](../glossary.md#subnet-creator) to build valuable services that attract [stakers](../glossary.md#staking).

```rust
let mut total_moving_prices = U96F32::saturating_from_num(0.0);
for netuid_i in subnets_to_emit_to.iter() {
    total_moving_prices = total_moving_prices
        .saturating_add(Self::get_moving_alpha_price(*netuid_i));
}
```

**Price-Driven Distribution Philosophy:**
Each subnet receives TAO emissions proportional to its alpha token price relative to all other subnets:

$$
\text{tao\_allocation}_i = \text{block\_emission} \times \frac{\text{moving\_price}_i}{\sum_{j} \text{moving\_price}_j}
$$

This design encourages [subnet creators](../glossary.md#subnet-creator) to build valuable services that attract [stakers](../glossary.md#staking), driving up their alpha token prices and thus their emission allocation. The system uses [Exponential Moving Average (EMA)](../learn/ema.md#subnet-price-emission-smoothing) price smoothing to prevent manipulation while remaining responsive to genuine market signals.

### 3. Three Token Pool Injections

For each subnet, the coinbase calculates three critical values that govern the subnet's token economics and determine how fresh liquidity flows into the system.

#### TAO In (`tao_in`): Fresh Capital Injection
- Represents new TAO flowing into the subnet's liquidity pool
- Calculated from the subnet's proportional share of block emissions
- May be reduced through the subsidy mechanism to maintain price stability

#### Alpha In (`alpha_in`): Liquidity Pool Balance  
- Alpha tokens injected to maintain healthy AMM pool ratios
- Ensures the TAO injection doesn't create excessive [slippage](../glossary.md#slippage) for [stakers](../glossary.md#staking)
- Calculated as: `tao_in / current_price` during normal operations

#### Alpha Out (`alpha_out`): Participant Rewards
- Alpha tokens allocated for distribution to [subnet miners](../glossary.md#subnet-miner) and [validators](../glossary.md#validator)
- Represents the subnet's emission budget for [incentives](../glossary.md#incentives) and validator dividends
- Forms the reward pool that will be processed during [epochs](../glossary.md#tempo)

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
    
    // Subsidy mechanism protects against manipulation
    let tao_in_ratio: U96F32 = default_tao_in_i.safe_div_or(
        U96F32::saturating_from_num(block_emission),
        U96F32::saturating_from_num(0.0),
    );
    
    if price_i < tao_in_ratio {
        // Subsidized operation: reduce TAO injection, buy alpha
        tao_in_i = price_i.saturating_mul(block_emission);
        alpha_in_i = alpha_emission_i;
        let difference_tao: U96F32 = default_tao_in_i.saturating_sub(tao_in_i);
        
        // Use excess TAO to purchase alpha, supporting the price
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

**Economic Stabilization Through Subsidies:**
When a subnet's alpha price falls below its expected emission proportion, the subsidy mechanism automatically intervenes to maintain market stability:
1. **Price Support**: Reduces TAO injection to prevent further price depression
2. **Market Making**: Uses the "saved" TAO to buy alpha from the pool, supporting the token price
3. **Gaming Prevention**: Marks the subnet as subsidized to prevent double-counting

This creates a floor for alpha token prices while maintaining the market-driven allocation philosophy.

### 4. Liquidity Pool Updates

The coinbase updates each subnet's liquidity pools. 

```rust
for netuid_i in subnets_to_emit_to.iter() {
    // Inject Alpha in (AMM liquidity)
    let alpha_in_i = AlphaCurrency::from(
        tou64!(*alpha_in.get(netuid_i).unwrap_or(&asfloat!(0)))
    );
    SubnetAlphaIn::<T>::mutate(*netuid_i, |total| {
        *total = total.saturating_add(alpha_in_i);
    });
    
    // Inject Alpha out (reward pool)
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

**Critical State Updates:**
- **`SubnetAlphaIn`**: Alpha reserves backing the AMM, enabling liquid [staking](../glossary.md#staking) and unstaking operations
- **`SubnetAlphaOut`**: The reward pool that [Yuma Consensus](../glossary.md#yuma-consensus) will distribute to participants during epochs
- **`SubnetTAO`**: TAO reserves backing the AMM, providing price stability and liquidity depth  
- **`TotalIssuance`**: Global TAO supply tracking for monetary policy (see [Issuance](../glossary.md#issuance))

### 5. Subnet Creator Compensation

Before distributing rewards to [subnet miners](../glossary.md#subnet-miner) and [validators](../glossary.md#validator), the system allocates a percentage to [subnet creators](../glossary.md#subnet-creator).

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

**Entrepreneur Incentives:**
- [Subnet creators](../glossary.md#subnet-creator) receive approximately 18% of alpha emissions by default
- This compensation rewards the intellectual and technical work of designing effective [subnet protocols](../glossary.md#subnet-protocol)
- The cut is calculated before other distributions to ensure creators are compensated regardless of network performance
- Accumulated in `PendingOwnerCut` for distribution during the next [epoch](../glossary.md#tempo)

This mechanism ensures that entrepreneurs who create valuable subnets are compensated for their ongoing contributions to the network's intellectual property.

### 6. Root Dividend Processing


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

**Cross-Subnet Value Sharing:**
The [Root Subnet](../glossary.md#root-subnetsubnet-zero) dividend system implements a mathematical formula that determines how much of each subnet's success flows back to general TAO holders:

$$
\text{root\_proportion} = \frac{\text{root\_tao} \times \text{tao\_weight}}{\text{root\_tao} \times \text{tao\_weight} + \text{alpha\_issuance}}
$$

Where:
- `root_tao`: Total TAO [staked](../glossary.md#staking) in [Root Subnet](../glossary.md#root-subnetsubnet-zero)
- `tao_weight`: Global parameter ([TAO Weight](../glossary.md#tao-weight)) determining TAO vs alpha influence
- `alpha_issuance`: Total alpha tokens for this specific subnet


### 7. Epoch Execution

The final step bridges the coinbase's economic preparation with [Yuma Consensus](../glossary.md#yuma-consensus). This step determines how accumulated rewards are actually distributed to miners and validators within each subnet.

```rust
for &netuid in subnets.iter() {
    // Process matured commit-reveal weight submissions
    if let Err(e) = Self::reveal_crv3_commits(netuid) {
        log::warn!("Failed to reveal commits for subnet {netuid} due to error: {e:?}");
    }
    
    if Self::should_run_epoch(netuid, current_block) {
        // Reset epoch timing counters
        BlocksSinceLastStep::<T>::insert(netuid, 0);
        LastMechansimStepBlock::<T>::insert(netuid, current_block);
        
        // Collect accumulated emission pools
        let pending_alpha = PendingEmission::<T>::get(netuid);
        let pending_tao = PendingRootDivs::<T>::get(netuid);
        let pending_swapped = PendingAlphaSwapped::<T>::get(netuid);
        let owner_cut = PendingOwnerCut::<T>::get(netuid);
        
        // Clear pending storage (atomic operation)
        PendingEmission::<T>::insert(netuid, AlphaCurrency::ZERO);
        PendingRootDivs::<T>::insert(netuid, TaoCurrency::ZERO);
        PendingAlphaSwapped::<T>::insert(netuid, AlphaCurrency::ZERO);
        PendingOwnerCut::<T>::insert(netuid, AlphaCurrency::ZERO);
        
        // Execute [Yuma Consensus](../glossary.md#yuma-consensus) with accumulated rewards
        Self::drain_pending_emission(
            netuid,
            pending_alpha,
            pending_tao,
            pending_swapped,
            owner_cut,
        );
    } else {
        BlocksSinceLastStep::<T>::mutate(netuid, |total| 
            *total = total.saturating_add(1)
        );
    }
}
```

**[Tempo](../glossary.md#tempo)-Based Rhythm:**
Epochs execute when `(block_number + netuid + 1) % (tempo + 1) == 0`, where [tempo](../glossary.md#tempo) represents the subnet's consensus interval (typically 360 blocks or 72 minutes). This creates a predictable rhythm where:

1. **Accumulation Phase**: 359 blocks of coinbase operations build up reward pools across all subnets
2. **Distribution Phase**: 1 block processes accumulated rewards through [Yuma Consensus](../glossary.md#yuma-consensus) 
3. **[Commit Reveal](../glossary.md#commit-reveal)**: Processes any matured weight commitments to prevent manipulation

The [commit reveal](../glossary.md#commit-reveal) mechanism enhances security by preventing [validators](../glossary.md#validator) from copying each other's [weight vectors](../glossary.md#weight-vector), ensuring genuine evaluation of [subnet miner](../glossary.md#subnet-miner) performance.

## Emission Drainage Function

The `drain_pending_emission()` function distributes accumulated rewards through [Yuma Consensus](../glossary.md#yuma-consensus):

### 1. Epoch Execution
```rust
let hotkey_emission: Vec<(T::AccountId, AlphaCurrency, AlphaCurrency)> =
    Self::epoch(netuid, pending_alpha.saturating_add(pending_swapped));
```
Calls [Yuma Consensus](../glossary.md#yuma-consensus) (see [Epoch Implementation](./epoch.md)) returning `(hotkey, miner_incentive, validator_dividend)` tuples.

### 2. Validator Alpha Calculation
```rust
let pending_validator_alpha = if !incentive_sum.is_zero() {
    pending_alpha.saturating_add(pending_swapped).saturating_div(2.into()).saturating_sub(pending_swapped)
} else {
    pending_alpha
};
```
**Split Logic**: Validators get 50% if miners receive incentives, otherwise 100%.

### 3. Distribution
```rust
let (incentives, (alpha_dividends, tao_dividends)) =
    Self::calculate_dividend_and_incentive_distribution(/* ... */);
Self::distribute_dividends_and_incentives(/* ... */);
```
Distributes three reward types:
- **Incentives**: Alpha to miners based on [ranks](../glossary.md#rank)
- **Alpha Dividends**: Alpha to validators based on [bonds](../glossary.md#validator-miner-bonds)  
- **TAO Dividends**: TAO to validators from root dividend conversions

## Storage Items

### Per-Subnet Reserves
- `SubnetTAO<NetUid>`: TAO liquidity pool reserves
- `SubnetAlphaIn<NetUid>`: Alpha reserves for AMM
- `SubnetAlphaOut<NetUid>`: Alpha available for emissions

### Pending Accumulation  
- `PendingEmission<NetUid>`: Alpha to be distributed to participants
- `PendingRootDivs<NetUid>`: TAO dividends for root stakers
- `PendingOwnerCut<NetUid>`: Alpha for subnet owner
- `PendingAlphaSwapped<NetUid>`: Alpha swapped for root dividends

### Emission Tracking
- `SubnetAlphaInEmission<NetUid>`: Alpha injected this block
- `SubnetAlphaOutEmission<NetUid>`: Alpha emitted this block  
- `SubnetTaoInEmission<NetUid>`: TAO injected this block

### Timing and Control
- `BlocksSinceLastStep<NetUid>`: Blocks since last epoch
- `LastMechansimStepBlock<NetUid>`: Block number of last epoch
- `FirstEmissionBlockNumber<NetUid>`: When subnet emissions began



