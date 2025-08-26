---
title: "Emissions and Coinbase Implementation"
---

# Emissions and Coinbase Implementation

This page provides a deep dive into the coinbase mechanism that drives TAO and alpha emissions across subnets. The `run_coinbase()` function is the heart of Bittensor's emission system, orchestrating the complex flow of value distribution throughout the network.

## Overview

The coinbase mechanism runs every block and handles:
1. **Injection**: Adding TAO and alpha liquidity to subnet pools
2. **Accumulation**: Building up pending emissions over time
3. **Extraction**: Distributing accumulated emissions to participants via epochs

## Core Function: `run_coinbase()`

Located in `subtensor/pallets/subtensor/src/coinbase/run_coinbase.rs`, this function orchestrates the entire emission cycle.

### Function Signature
```rust
pub fn run_coinbase(block_emission: U96F32)
```

The `block_emission` parameter represents the total TAO to be distributed across all subnets in the current block.

## Implementation Flow

### 1. Subnet Identification and Filtering

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

**Key Points:**
- Root subnet (NetUid::ROOT) is excluded from direct emissions
- Only subnets with a `FirstEmissionBlockNumber` receive emissions
- This ensures new subnets don't receive emissions immediately upon creation

### 2. Price Aggregation and Emission Calculation

```rust
let mut total_moving_prices = U96F32::saturating_from_num(0.0);
for netuid_i in subnets_to_emit_to.iter() {
    total_moving_prices = total_moving_prices
        .saturating_add(Self::get_moving_alpha_price(*netuid_i));
}
```

**Price-Based Distribution:**
Each subnet receives TAO emissions proportional to its alpha token price relative to all other subnets:

$$
\text{tao\_in}_i = \text{block\_emission} \times \frac{\text{price}_i}{\sum_{j} \text{price}_j}
$$

### 3. Subnet-Specific Emission Terms

For each subnet, three key values are calculated:

#### TAO In (`tao_in`)
- Base TAO injection based on price proportion
- May be reduced if price is below threshold

#### Alpha In (`alpha_in`) 
- Alpha injected to maintain pool price stability
- Calculated as: `tao_in / price` (when not subsidized)

#### Alpha Out (`alpha_out`)
- Alpha allocated for participant emissions
- Equals the subnet's alpha emission rate

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
    
    // Subsidy logic
    let tao_in_ratio: U96F32 = default_tao_in_i.safe_div_or(
        U96F32::saturating_from_num(block_emission),
        U96F32::saturating_from_num(0.0),
    );
    
    if price_i < tao_in_ratio {
        // Subsidized subnet: buy alpha with difference
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

**Subsidy Mechanism:**
When a subnet's price falls below its emission proportion, the system:
1. Reduces TAO injection to maintain price stability
2. Uses the difference to buy alpha from the pool
3. Marks the subnet as subsidized to prevent double-spending

### 4. Liquidity Injection

```rust
for netuid_i in subnets_to_emit_to.iter() {
    // Inject Alpha in
    let alpha_in_i = AlphaCurrency::from(
        tou64!(*alpha_in.get(netuid_i).unwrap_or(&asfloat!(0)))
    );
    SubnetAlphaIn::<T>::mutate(*netuid_i, |total| {
        *total = total.saturating_add(alpha_in_i);
    });
    
    // Inject Alpha out
    let alpha_out_i = AlphaCurrency::from(
        tou64!(*alpha_out.get(netuid_i).unwrap_or(&asfloat!(0)))
    );
    SubnetAlphaOut::<T>::mutate(*netuid_i, |total| {
        *total = total.saturating_add(alpha_out_i);
    });
    
    // Inject TAO in
    let tao_in_i: TaoCurrency = 
        tou64!(*tao_in.get(netuid_i).unwrap_or(&asfloat!(0))).into();
    SubnetTAO::<T>::mutate(*netuid_i, |total| {
        *total = total.saturating_add(tao_in_i.into());
    });
    
    // Update global issuance
    TotalIssuance::<T>::mutate(|total| {
        *total = total.saturating_add(tao_in_i.into());
    });
    
    // Adjust protocol liquidity
    T::SwapInterface::adjust_protocol_liquidity(*netuid_i, tao_in_i, alpha_in_i);
}
```

**State Updates:**
- `SubnetAlphaIn`: Alpha reserves for AMM
- `SubnetAlphaOut`: Alpha available for emission
- `SubnetTAO`: TAO reserves for AMM  
- `TotalIssuance`: Global TAO supply tracking

### 5. Owner Cut Calculation

```rust
let cut_percent: U96F32 = Self::get_float_subnet_owner_cut(); // Default: 18%
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

**Owner Cut Logic:**
- Subnet owners receive 18% of alpha emissions by default
- Cut is calculated before other distributions
- Accumulated in `PendingOwnerCut` for later extraction

### 6. Root Dividend Processing

```rust
for netuid_i in subnets_to_emit_to.iter() {
    let alpha_out_i: U96F32 = *alpha_out.get(netuid_i).unwrap_or(&asfloat!(0.0));
    let root_tao: U96F32 = asfloat!(SubnetTAO::<T>::get(NetUid::ROOT));
    let alpha_issuance: U96F32 = asfloat!(Self::get_alpha_issuance(*netuid_i));
    let tao_weight: U96F32 = root_tao.saturating_mul(Self::get_tao_weight());
    
    // Calculate root's proportional share
    let root_proportion: U96F32 = tao_weight
        .checked_div(tao_weight.saturating_add(alpha_issuance))
        .unwrap_or(asfloat!(0.0));
        
    // 50% of proportional alpha goes to root validators
    let root_alpha: U96F32 = root_proportion
        .saturating_mul(alpha_out_i)
        .saturating_mul(asfloat!(0.5));
        
    let pending_alpha: U96F32 = alpha_out_i.saturating_sub(root_alpha);
    
    // Swap root alpha for TAO (if not subsidized)
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

**Root Dividend Calculation:**
The root subnet receives dividends based on:

$$
\text{root\_proportion} = \frac{\text{root\_tao} \times \text{tao\_weight}}{\text{root\_tao} \times \text{tao\_weight} + \text{alpha\_issuance}}
$$

Where:
- `root_tao`: Total TAO staked on root subnet
- `tao_weight`: Global parameter (default: 18%)  
- `alpha_issuance`: Total alpha tokens for the subnet

### 7. Epoch Execution and Drainage

```rust
for &netuid in subnets.iter() {
    // Reveal any matured weight commits
    if let Err(e) = Self::reveal_crv3_commits(netuid) {
        log::warn!("Failed to reveal commits for subnet {netuid} due to error: {e:?}");
    }
    
    if Self::should_run_epoch(netuid, current_block) {
        // Reset counters
        BlocksSinceLastStep::<T>::insert(netuid, 0);
        LastMechansimStepBlock::<T>::insert(netuid, current_block);
        
        // Drain pending amounts
        let pending_alpha = PendingEmission::<T>::get(netuid);
        let pending_tao = PendingRootDivs::<T>::get(netuid);
        let pending_swapped = PendingAlphaSwapped::<T>::get(netuid);
        let owner_cut = PendingOwnerCut::<T>::get(netuid);
        
        // Reset pending storage
        PendingEmission::<T>::insert(netuid, AlphaCurrency::ZERO);
        PendingRootDivs::<T>::insert(netuid, TaoCurrency::ZERO);
        PendingAlphaSwapped::<T>::insert(netuid, AlphaCurrency::ZERO);
        PendingOwnerCut::<T>::insert(netuid, AlphaCurrency::ZERO);
        
        // Execute drainage
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

**Epoch Timing:**
Epochs run when `(block_number + netuid + 1) % (tempo + 1) == 0`, where `tempo` is the subnet's configured interval (default: 360 blocks).

## Emission Drainage: `drain_pending_emission()`

When an epoch runs, accumulated emissions are distributed through `drain_pending_emission()`:

### 1. Epoch Execution
```rust
let hotkey_emission: Vec<(T::AccountId, AlphaCurrency, AlphaCurrency)> =
    Self::epoch(netuid, pending_alpha.saturating_add(pending_swapped));
```

This calls the main epoch function (see [Epoch Implementation](./epoch.md)) which returns tuples of `(hotkey, miner_emission, validator_emission)`.

### 2. Validator Alpha Calculation
```rust
let incentive_sum = hotkey_emission
    .iter()
    .fold(AlphaCurrency::default(), |acc, (_, incentive, _)| {
        acc.saturating_add(*incentive)
    });

let pending_validator_alpha = if !incentive_sum.is_zero() {
    pending_alpha
        .saturating_add(pending_swapped)
        .saturating_div(2.into())
        .saturating_sub(pending_swapped)
} else {
    pending_alpha
};
```

**Split Logic:**
- If miners receive incentives: validators get 50% of (total_alpha - swapped_alpha)
- If no miner incentives: validators get 100% of pending alpha

### 3. Distribution Calculation and Execution
```rust
let (incentives, (alpha_dividends, tao_dividends)) =
    Self::calculate_dividend_and_incentive_distribution(
        netuid,
        pending_tao,
        pending_validator_alpha,
        hotkey_emission,
        tao_weight,
    );

Self::distribute_dividends_and_incentives(
    netuid,
    owner_cut,
    incentives,
    alpha_dividends,
    tao_dividends,
);
```

This complex calculation distributes emissions based on:
- **Incentives**: Direct miner rewards in alpha
- **Alpha dividends**: Validator rewards in alpha
- **TAO dividends**: Validator rewards converted to TAO

## Storage Integration

The coinbase mechanism interacts with numerous storage items:

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

## Key Design Principles

### 1. Price-Proportional Distribution
Subnets with higher alpha prices receive more TAO emissions, incentivizing valuable subnet development.

### 2. Liquidity Pool Stability  
Alpha injection is calculated to maintain stable exchange rates despite TAO injection.

### 3. Gradual Emission Release
Emissions accumulate over multiple blocks and are released during epochs, smoothing distribution and reducing gas costs.

### 4. Multi-Token Economics
The system seamlessly handles both TAO (global) and alpha (subnet-specific) tokens with automatic conversions.

### 5. Incentive Alignment
Root dividend mechanisms ensure TAO holders benefit from successful subnet development while maintaining decentralization.

## Integration Points

The coinbase mechanism integrates with:

- **[Epoch System](./epoch.md)**: Processes accumulated emissions through Yuma Consensus
- **[Swap Interface](./swap-stake.md)**: Converts between TAO and alpha as needed
- **Staking System**: Distributes rewards to validators and nominators
- **Governance**: Respects subnet registration permissions and parameters

Understanding this flow is crucial for subnet developers and protocol researchers, as it governs the fundamental economic incentives that drive the Bittensor network.
