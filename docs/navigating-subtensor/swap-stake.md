---
title: "Swap and Staking Implementation"
---

# Swap and Staking Implementation

This page provides a detailed examination of staking and unstaking mechanisms in Bittensor, including the automated market maker (AMM) functionality that enables seamless TAO ↔ alpha conversions. Understanding these mechanisms is crucial for developers working with Dynamic TAO and subnet economics.

## Overview

The staking system in Dynamic TAO operates through:
1. **TAO to Alpha conversion** when staking
2. **Alpha to TAO conversion** when unstaking
3. **AMM price calculation** maintaining liquidity pools
4. **Stake tracking** across subnets and participants

Each subnet maintains its own TAO/alpha liquidity pool, with automated market making ensuring continuous convertibility between tokens.

## Core Staking Operations

### Stake Addition: `do_add_stake()`

Located in `subtensor/pallets/subtensor/src/staking.rs`, this function handles the complete stake addition flow.

#### Function Signature
```rust
pub fn do_add_stake(
    origin: T::RuntimeOrigin,
    hotkey: T::AccountId,
    amount_staked: AlphaCurrency,
) -> DispatchResult
```

#### Implementation Flow

##### 1. Validation and Setup
```rust
// Ensure the caller is signed
let coldkey = ensure_signed(origin)?;

// Get the netuid for this operation (from context)
let netuid: NetUid = /* determined by calling context */;

// Validate minimum stake
ensure!(
    amount_staked >= Self::get_minimum_stake_amount(),
    Error::<T>::StakeTooLow
);

// Check if hotkey exists in subnet
ensure!(
    Self::get_uid_for_net_and_hotkey(netuid, &hotkey).is_ok(),
    Error::<T>::NotRegistered
);
```

##### 2. TAO Balance Verification
```rust
// Check coldkey has sufficient TAO balance
let current_balance = Self::get_coldkey_balance(&coldkey);
ensure!(
    current_balance >= amount_staked.to_u64().into(),
    Error::<T>::InsufficientBalance
);
```

##### 3. AMM Price Calculation
```rust
// Get current subnet reserves
let tao_reserves = SubnetTAO::<T>::get(netuid);
let alpha_reserves = SubnetAlphaIn::<T>::get(netuid);

// Calculate current price: price = tao_reserves / alpha_reserves
let current_price = T::SwapInterface::current_alpha_price(netuid.into());

// Calculate alpha amount to be received
let alpha_amount = T::SwapInterface::calculate_tao_to_alpha_swap(
    netuid.into(),
    amount_staked,
    current_price,
)?;
```

The AMM uses the constant product formula:
$$k = \tau \times \alpha$$

Where:
- $\tau$ = TAO reserves
- $\alpha$ = Alpha reserves  
- $k$ = Constant product

##### 4. Slippage Protection
```rust
// Apply slippage protection if enabled
let max_slippage = Self::get_max_slippage_basis_points();
let min_alpha_expected = alpha_amount
    .saturating_mul((10000 - max_slippage).into())
    .saturating_div(10000.into());

ensure!(
    alpha_amount >= min_alpha_expected,
    Error::<T>::SlippageExceeded
);
```

##### 5. Balance Updates
```rust
// Remove TAO from coldkey
Self::remove_balance_from_coldkey_account(&coldkey, amount_staked.to_u64().into())?;

// Add TAO to subnet reserves
SubnetTAO::<T>::mutate(netuid, |reserves| {
    *reserves = reserves.saturating_add(amount_staked.to_u64().into());
});

// Add alpha to hotkey stake
TotalHotkeyStake::<T>::mutate(&hotkey, |stake| {
    *stake = stake.saturating_add(alpha_amount);
});

// Update subnet-specific stake
Stake::<T>::mutate(&hotkey, &coldkey, netuid, |stake| {
    *stake = stake.saturating_add(alpha_amount);
});

// Update total network stake
TotalStake::<T>::mutate(|total| {
    *total = total.saturating_add(amount_staked.to_u64().into());
});
```

##### 6. Event Emission
```rust
// Emit staking event
Self::deposit_event(Event::StakeAdded {
    hotkey: hotkey.clone(),
    coldkey: coldkey.clone(),
    netuid,
    tao_amount: amount_staked.to_u64().into(),
    alpha_amount,
    new_stake: Self::get_stake_for_hotkey_on_subnet(&hotkey, netuid),
});
```

### Stake Removal: `do_remove_stake()`

The unstaking process reverses the staking flow, converting alpha back to TAO.

#### Function Signature
```rust
pub fn do_remove_stake(
    origin: T::RuntimeOrigin,
    hotkey: T::AccountId,
    amount_unstaked: AlphaCurrency,
) -> DispatchResult
```

#### Implementation Flow

##### 1. Validation
```rust
let coldkey = ensure_signed(origin)?;

// Verify sufficient stake exists
let current_stake = Self::get_stake_for_hotkey_on_subnet(&hotkey, netuid);
ensure!(
    current_stake >= amount_unstaked,
    Error::<T>::InsufficientStake
);

// Check minimum remaining stake
let remaining_stake = current_stake.saturating_sub(amount_unstaked);
ensure!(
    remaining_stake >= Self::get_minimum_stake_amount() || remaining_stake.is_zero(),
    Error::<T>::StakeTooDeLow
);
```

##### 2. AMM Conversion Calculation
```rust
// Get current reserves
let tao_reserves = SubnetTAO::<T>::get(netuid);
let alpha_reserves = SubnetAlphaIn::<T>::get(netuid);

// Calculate TAO amount to receive: tao_out = (tao_reserves * alpha_in) / (alpha_reserves + alpha_in)
let tao_amount = T::SwapInterface::calculate_alpha_to_tao_swap(
    netuid.into(),
    amount_unstaked,
    Self::get_current_alpha_price(netuid),
)?;

// Apply exit fees if configured
let exit_fee_rate = Self::get_exit_fee_basis_points(netuid);
let exit_fee = tao_amount
    .saturating_mul(exit_fee_rate.into())
    .saturating_div(10000.into());
let tao_after_fees = tao_amount.saturating_sub(exit_fee);
```

##### 3. Balance Updates
```rust
// Remove alpha from hotkey stake  
TotalHotkeyStake::<T>::mutate(&hotkey, |stake| {
    *stake = stake.saturating_sub(amount_unstaked);
});

// Update subnet-specific stake
Stake::<T>::mutate(&hotkey, &coldkey, netuid, |stake| {
    *stake = stake.saturating_sub(amount_unstaked);
});

// Update subnet reserves
SubnetTAO::<T>::mutate(netuid, |reserves| {
    *reserves = reserves.saturating_sub(tao_amount);
});

SubnetAlphaIn::<T>::mutate(netuid, |reserves| {
    *reserves = reserves.saturating_add(amount_unstaked);
});

// Add TAO to coldkey (after fees)
Self::add_balance_to_coldkey_account(&coldkey, tao_after_fees)?;

// Handle exit fees (typically burned or sent to treasury)
if !exit_fee.is_zero() {
    Self::handle_exit_fee(netuid, exit_fee)?;
}
```

## AMM Price Mechanism

### Price Calculation

The automated market maker maintains price stability through the constant product formula:

```rust
pub fn current_alpha_price(netuid: NetUid) -> U96F32 {
    let tao_reserves = SubnetTAO::<T>::get(netuid);
    let alpha_reserves = SubnetAlphaIn::<T>::get(netuid);
    
    if alpha_reserves.is_zero() {
        return U96F32::from(1); // Default price of 1 TAO per alpha
    }
    
    U96F32::from(tao_reserves).safe_div(U96F32::from(alpha_reserves))
}
```

$$\text{price} = \frac{\text{TAO reserves}}{\text{Alpha reserves}}$$

### Swap Calculations

#### TAO → Alpha Conversion
```rust
pub fn calculate_tao_to_alpha_swap(
    netuid: NetUid,
    tao_in: TaoCurrency,
    current_price: U96F32,
) -> Result<AlphaCurrency, Error> {
    let tao_reserves = SubnetTAO::<T>::get(netuid);
    let alpha_reserves = SubnetAlphaIn::<T>::get(netuid);
    
    // Apply constant product formula: (tao + tao_in) * (alpha - alpha_out) = tao * alpha
    // Solve for alpha_out: alpha_out = (alpha * tao_in) / (tao + tao_in)
    let alpha_out = alpha_reserves
        .saturating_mul(tao_in)
        .safe_div(tao_reserves.saturating_add(tao_in))?;
    
    Ok(alpha_out)
}
```

#### Alpha → TAO Conversion
```rust
pub fn calculate_alpha_to_tao_swap(
    netuid: NetUid,
    alpha_in: AlphaCurrency,
    current_price: U96F32,
) -> Result<TaoCurrency, Error> {
    let tao_reserves = SubnetTAO::<T>::get(netuid);
    let alpha_reserves = SubnetAlphaIn::<T>::get(netuid);
    
    // Apply constant product formula: (tao - tao_out) * (alpha + alpha_in) = tao * alpha
    // Solve for tao_out: tao_out = (tao * alpha_in) / (alpha + alpha_in)
    let tao_out = tao_reserves
        .saturating_mul(alpha_in)
        .safe_div(alpha_reserves.saturating_add(alpha_in))?;
    
    Ok(tao_out)
}
```

### Price Impact and Slippage

Large trades can cause significant price impact:

```rust
pub fn calculate_price_impact(
    netuid: NetUid,
    tao_amount: TaoCurrency,
) -> U96F32 {
    let price_before = Self::current_alpha_price(netuid);
    let alpha_received = Self::calculate_tao_to_alpha_swap(netuid, tao_amount, price_before)?;
    
    // Calculate new reserves after trade
    let new_tao_reserves = SubnetTAO::<T>::get(netuid).saturating_add(tao_amount);
    let new_alpha_reserves = SubnetAlphaIn::<T>::get(netuid).saturating_sub(alpha_received);
    let price_after = new_tao_reserves.safe_div(new_alpha_reserves);
    
    // Price impact = (price_after - price_before) / price_before
    price_after.saturating_sub(price_before).safe_div(price_before)
}
```

## Advanced Staking Features

### Child Key Management

Bittensor supports delegation through child keys, allowing hotkeys to delegate stake to other validators:

```rust
pub fn do_set_children(
    origin: T::RuntimeOrigin,
    netuid: NetUid,
    children: Vec<(u64, T::AccountId)>, // (proportion, child_hotkey)
) -> DispatchResult {
    let hotkey = ensure_signed(origin)?;
    
    // Validate total proportion doesn't exceed 100%
    let total_proportion: u64 = children.iter().map(|(prop, _)| *prop).sum();
    ensure!(
        total_proportion <= u64::MAX,
        Error::<T>::InvalidChildKeyProportion
    );
    
    // Update child key storage
    ChildKeys::<T>::insert(&hotkey, netuid, children.clone());
    
    // Update parent mappings for each child
    for (proportion, child) in children {
        let mut parents = ParentKeys::<T>::get(&child, netuid);
        parents.retain(|(_, parent)| parent != &hotkey); // Remove existing
        parents.push((proportion, hotkey.clone()));
        ParentKeys::<T>::insert(&child, netuid, parents);
    }
    
    Self::deposit_event(Event::ChildKeysSet {
        hotkey,
        netuid,
        children,
    });
    
    Ok(())
}
```

### Stake Distribution with Child Keys

When emissions are distributed, child keys receive proportional rewards:

```rust
pub fn distribute_stake_to_children(
    hotkey: &T::AccountId,
    netuid: NetUid,
    total_emission: AlphaCurrency,
) -> Vec<(T::AccountId, AlphaCurrency)> {
    let children = ChildKeys::<T>::get(hotkey, netuid);
    let mut distributions = Vec::new();
    let mut remaining_emission = total_emission;
    
    for (proportion, child_hotkey) in children {
        let child_proportion = U96F32::from(proportion).safe_div(U96F32::from(u64::MAX));
        let child_emission = child_proportion.saturating_mul(U96F32::from(total_emission));
        let child_amount = child_emission.saturating_to_num::<u64>().into();
        
        remaining_emission = remaining_emission.saturating_sub(child_amount);
        distributions.push((child_hotkey, child_amount));
    }
    
    // Parent keeps remaining emission
    distributions.push((hotkey.clone(), remaining_emission));
    distributions
}
```

### Validator Takes

Validators can set a "take" percentage from delegated stakes:

```rust
pub fn do_set_take(
    origin: T::RuntimeOrigin,
    take: u16, // Basis points (e.g., 1800 = 18%)
) -> DispatchResult {
    let hotkey = ensure_signed(origin)?;
    
    // Validate take percentage
    ensure!(
        take <= Self::get_max_take_basis_points(),
        Error::<T>::TakeTooHigh
    );
    
    // Apply rate limiting
    let last_update = LastTakeUpdate::<T>::get(&hotkey);
    let current_block = Self::get_current_block_as_u64();
    ensure!(
        current_block.saturating_sub(last_update) >= Self::get_take_update_interval(),
        Error::<T>::TakeUpdateTooFrequent
    );
    
    // Update take and timestamp
    Takes::<T>::insert(&hotkey, take);
    LastTakeUpdate::<T>::insert(&hotkey, current_block);
    
    Self::deposit_event(Event::TakeSet { hotkey, take });
    Ok(())
}
```

## Stake Weight Calculation

The effective stake weight combines alpha and TAO stakes:

```rust
pub fn get_stake_weights_for_network(
    netuid: NetUid,
) -> (Vec<I64F64>, Vec<I64F64>, Vec<I64F64>) {
    let n = Self::get_subnetwork_n(netuid);
    let tao_weight = Self::get_tao_weight(); // Default: 18%
    
    let mut total_stake = Vec::with_capacity(n as usize);
    let mut alpha_stake = Vec::with_capacity(n as usize);
    let mut tao_stake = Vec::with_capacity(n as usize);
    
    for uid in 0..n {
        if let Ok(hotkey) = Self::get_hotkey_for_net_and_uid(netuid, uid) {
            // Get alpha stake on this subnet
            let alpha = Self::get_stake_for_hotkey_on_subnet(&hotkey, netuid);
            
            // Get TAO stake on root subnet
            let tao = Self::get_stake_for_hotkey_on_subnet(&hotkey, NetUid::ROOT);
            
            // Calculate weighted total: total = alpha + (tao * tao_weight)
            let weighted_tao = I64F64::from(tao).saturating_mul(I64F64::from(tao_weight));
            let total = I64F64::from(alpha).saturating_add(weighted_tao);
            
            total_stake.push(total);
            alpha_stake.push(I64F64::from(alpha));
            tao_stake.push(I64F64::from(tao));
        } else {
            total_stake.push(I64F64::from(0));
            alpha_stake.push(I64F64::from(0));
            tao_stake.push(I64F64::from(0));
        }
    }
    
    (total_stake, alpha_stake, tao_stake)
}
```

**Stake Weight Formula:**
$$\text{stake\_weight} = \alpha + (\tau \times \text{tao\_weight})$$

Where:
- $\alpha$ = Alpha stake on the specific subnet
- $\tau$ = TAO stake on root subnet (NetUid::ROOT)
- `tao_weight` = Global parameter (default: 18%)

## Liquidity Pool Management

### Reserve Updates

Liquidity pools are updated through various mechanisms:

#### Emission-Driven Updates
```rust
// Called from coinbase mechanism
pub fn adjust_protocol_liquidity(
    netuid: NetUid,
    tao_injection: TaoCurrency,
    alpha_injection: AlphaCurrency,
) {
    SubnetTAO::<T>::mutate(netuid, |reserves| {
        *reserves = reserves.saturating_add(tao_injection);
    });
    
    SubnetAlphaIn::<T>::mutate(netuid, |reserves| {
        *reserves = reserves.saturating_add(alpha_injection);
    });
    
    // Update price tracking
    Self::update_moving_alpha_price(netuid);
}
```

#### Swap-Driven Updates
```rust
// Called during stake operations
fn update_reserves_for_swap(
    netuid: NetUid,
    tao_delta: i64, // Positive = added, negative = removed
    alpha_delta: i64,
) {
    if tao_delta > 0 {
        SubnetTAO::<T>::mutate(netuid, |reserves| {
            *reserves = reserves.saturating_add(tao_delta as u64);
        });
    } else {
        SubnetTAO::<T>::mutate(netuid, |reserves| {
            *reserves = reserves.saturating_sub((-tao_delta) as u64);
        });
    }
    
    // Similar logic for alpha_delta...
}
```

### Price Tracking

Moving average prices are maintained for emission calculations:

```rust
pub fn update_moving_alpha_price(netuid: NetUid) {
    let current_price = Self::current_alpha_price(netuid);
    let alpha = Self::get_moving_average_alpha(); // Default: 0.1
    
    MovingAverageAlphaPrice::<T>::mutate(netuid, |moving_price| {
        *moving_price = alpha * current_price + (1.0 - alpha) * *moving_price;
    });
}
```

## Error Handling and Edge Cases

### Common Validation Checks

```rust
// Minimum stake validation
ensure!(
    amount >= Self::get_minimum_stake_amount(),
    Error::<T>::StakeTooLow
);

// Maximum stake validation (prevents single entity dominance)
ensure!(
    amount <= Self::get_maximum_stake_amount(),
    Error::<T>::StakeTooHigh
);

// Hotkey registration validation
ensure!(
    Self::get_uid_for_net_and_hotkey(netuid, &hotkey).is_ok(),
    Error::<T>::NotRegistered
);

// Balance sufficiency validation
ensure!(
    Self::get_coldkey_balance(&coldkey) >= amount,
    Error::<T>::InsufficientBalance
);

// Pool liquidity validation
ensure!(
    SubnetTAO::<T>::get(netuid) >= minimum_liquidity,
    Error::<T>::InsufficientLiquidity
);
```

### Edge Case Handling

#### Empty Pools
```rust
// Handle new subnet with no liquidity
if SubnetTAO::<T>::get(netuid).is_zero() || SubnetAlphaIn::<T>::get(netuid).is_zero() {
    // Use default 1:1 exchange rate
    return Ok(amount_staked); // 1 TAO = 1 Alpha
}
```

#### Large Swaps
```rust
// Prevent trades that would drain reserves
let max_trade_size = SubnetTAO::<T>::get(netuid).saturating_mul(MAX_TRADE_PERCENTAGE) / 100;
ensure!(
    amount_staked <= max_trade_size,
    Error::<T>::TradeAmountTooLarge
);
```

#### Price Manipulation Protection
```rust
// Check for suspicious price movements
let price_before = Self::current_alpha_price(netuid);
let price_after = Self::calculate_price_after_swap(netuid, amount_staked);
let price_change = price_after.saturating_sub(price_before).safe_div(price_before);

ensure!(
    price_change <= Self::get_max_price_change_basis_points(),
    Error::<T>::PriceManipulationDetected
);
```

## Integration with Other Systems

### Coinbase Integration

The staking system integrates with coinbase for emission distribution:

```rust
// Called from drain_pending_emission()
pub fn distribute_staking_rewards(
    netuid: NetUid,
    emissions: Vec<(T::AccountId, AlphaCurrency)>,
) {
    for (hotkey, emission) in emissions {
        // Apply validator take
        let take_rate = Self::get_hotkey_take(&hotkey);
        let validator_take = emission.saturating_mul(take_rate) / 10000;
        let delegator_share = emission.saturating_sub(validator_take);
        
        // Distribute to validator
        Self::increase_stake_for_hotkey_and_coldkey_on_subnet(
            &hotkey,
            &Self::get_owning_coldkey_for_hotkey(&hotkey),
            netuid,
            validator_take,
        );
        
        // Distribute to stakers
        Self::distribute_to_stakers(&hotkey, netuid, delegator_share);
    }
}
```

### Root Subnet Special Handling

The root subnet (NetUid::ROOT) has special staking rules:

```rust
pub fn handle_root_staking(
    coldkey: &T::AccountId,
    hotkey: &T::AccountId,
    amount: TaoCurrency,
) -> DispatchResult {
    // Root subnet uses TAO directly (no conversion)
    TotalHotkeyStake::<T>::mutate(hotkey, |stake| {
        *stake = stake.saturating_add(amount.into());
    });
    
    Stake::<T>::mutate(hotkey, coldkey, NetUid::ROOT, |stake| {
        *stake = stake.saturating_add(amount.into());
    });
    
    // No AMM involved for root subnet
    Ok(())
}
```

## Performance Considerations

### Batch Operations

For large-scale operations, batch processing is available:

```rust
pub fn do_batch_stake_operations(
    origin: T::RuntimeOrigin,
    operations: Vec<StakeOperation>,
) -> DispatchResult {
    let coldkey = ensure_signed(origin)?;
    
    // Validate all operations first
    for op in &operations {
        Self::validate_stake_operation(&coldkey, op)?;
    }
    
    // Execute all operations atomically
    for op in operations {
        match op {
            StakeOperation::Add { hotkey, amount, netuid } => {
                Self::execute_stake_addition(&coldkey, &hotkey, amount, netuid)?;
            }
            StakeOperation::Remove { hotkey, amount, netuid } => {
                Self::execute_stake_removal(&coldkey, &hotkey, amount, netuid)?;
            }
        }
    }
    
    Ok(())
}
```

### Gas Optimization

```rust
// Use storage reads efficiently
let mut stake_cache: BTreeMap<(T::AccountId, NetUid), AlphaCurrency> = BTreeMap::new();

pub fn get_stake_cached(
    hotkey: &T::AccountId,
    netuid: NetUid,
    cache: &mut BTreeMap<(T::AccountId, NetUid), AlphaCurrency>,
) -> AlphaCurrency {
    if let Some(&cached_stake) = cache.get(&(hotkey.clone(), netuid)) {
        cached_stake
    } else {
        let stake = Self::get_stake_for_hotkey_on_subnet(hotkey, netuid);
        cache.insert((hotkey.clone(), netuid), stake);
        stake
    }
}
```

Understanding the swap and staking mechanisms is essential for developers building on Bittensor, as these systems underpin the economic incentives and token flows that drive the network's operation. The AMM functionality ensures seamless conversion between global TAO and subnet-specific alpha tokens, while the staking system enables participation in subnet consensus and emission distribution.
