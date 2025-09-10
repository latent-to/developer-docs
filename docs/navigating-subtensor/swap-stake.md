---
title: "Staking Implementation"
---

# Staking Implementation

This page provides a detailed examination of how staking is implemented in the Subtensor codebase.

Each subnet maintains its own AMM pool with TAO and Alpha reserves. When you stake, your TAO enters the subnet's TAO reserve and you receive Alpha tokens that represent your stake in that specific subnet. Alpha stake determines consensus weight and emission share for validators within a given subnet.

See [Staking/Delegation Overview](../staking-and-delegation/delegation)

:::tip Key Concept
**Stake is held in Alpha (α) token denominations** on each subnet. The exception is the Root Subnet (subnet 0), in which stake is held in TAO.
:::

## Core Staking Operations

### Stake Addition: `do_add_stake()`

Located in `subtensor/pallets/subtensor/src/staking/add_stake.rs`, this function converts TAO to Alpha through the subnet's AMM.

#### Function Signature
```rust
pub fn do_add_stake(
    origin: T::RuntimeOrigin,
    hotkey: T::AccountId,
    netuid: NetUid,
    stake_to_be_added: TaoCurrency,
) -> DispatchResult
```

#### Implementation Flow

##### 1. Validation and Fee Calculation
```rust
// Ensure the caller is signed
let coldkey = ensure_signed(origin)?;

// Ensure subnet exists and is enabled for staking
ensure!(Self::if_subnet_exist(netuid), Error::<T>::SubnetNotExists);
Self::ensure_subtoken_enabled(netuid)?;

// Calculate minimum amount including swap fees
let min_stake = DefaultMinStake::<T>::get();
let fee = T::SwapInterface::sim_swap(netuid.into(), OrderType::Buy, min_stake.into())
    .map(|res| res.fee_paid)
    .unwrap_or(T::SwapInterface::approx_fee_amount(netuid.into(), min_stake.into()));
let min_amount = min_stake.saturating_add(fee.into());

// Validate minimum stake amount (must cover both stake and fees)
ensure!(stake_to_be_added >= min_amount, Error::<T>::AmountTooLow);
```

##### 2. Balance Verification
```rust
// Check coldkey has sufficient TAO balance
let current_balance = Self::get_coldkey_balance(&coldkey);
ensure!(
    current_balance >= stake_to_be_added.into(),
    Error::<T>::NotEnoughBalanceToStake
);
```

##### 3. TAO Removal and Alpha Conversion
```rust
// Remove TAO from coldkey balance
let tao_staked = Self::remove_balance_from_coldkey_account(&coldkey, stake_to_be_added.into())?;

// Convert TAO to Alpha through subnet AMM
Self::stake_into_subnet(
    &hotkey,
    &coldkey,
    netuid,
    tao_staked.to_u64().into(),
    T::SwapInterface::max_price().into(), // Accept market price
    true, // drop_fees = true for add_stake
)?;
```

The `stake_into_subnet` function handles the AMM conversion:
- Uses 1:1 conversion for Stable subnets (mechanism_id = 0)
- Calls `swap_tao_for_alpha()` for dynamic subnets (mechanism_id = 1)
- Updates subnet TAO and Alpha reserves
- Credits Alpha tokens to the hotkey's stake

The `swap_tao_for_alpha()` function:
- Executes the actual AMM swap operation
- Calculates the amount of Alpha tokens received for the given TAO input
- Handles slippage and fee calculations
- Updates the subnet's liquidity pool reserves

##### 4. Event Emission
```rust
// Emit staking event with actual amounts
Self::deposit_event(Event::StakeAdded {
    account_id: hotkey.clone(),
    balance_staked: stake_to_be_added,
    balance_increased: Self::get_total_stake_for_hotkey(&hotkey),
});
```

### Stake Removal: `do_remove_stake()`

The unstaking process converts Alpha stake back to TAO through the subnet's AMM.

#### Function Signature
```rust
pub fn do_remove_stake(
    origin: T::RuntimeOrigin,
    hotkey: T::AccountId,
    netuid: NetUid,
    alpha_unstaked: AlphaCurrency,
) -> DispatchResult
```

#### Implementation Flow

##### 1. Validation
```rust
let coldkey = ensure_signed(origin)?;

// Ensure subnet exists and is enabled
ensure!(Self::if_subnet_exist(netuid), Error::<T>::SubnetNotExists);
Self::ensure_subtoken_enabled(netuid)?;

// Verify sufficient Alpha stake exists on this subnet
let alpha_on_subnet = Self::get_stake_for_hotkey_and_coldkey_on_subnet(&hotkey, &coldkey, netuid);
ensure!(
    alpha_on_subnet >= alpha_unstaked,
    Error::<T>::NotEnoughStakeToWithdraw
);
```

##### 2. Alpha to TAO Conversion
```rust
// Convert Alpha back to TAO through subnet AMM
let tao_received = Self::unstake_from_subnet(
    &hotkey,
    &coldkey,
    netuid,
    alpha_unstaked,
    TaoCurrency::ZERO, // min_price = 0 (accept any price)
    true, // drop_fees = true for remove_stake
)?;

// Add the received TAO back to coldkey balance
Self::add_balance_to_coldkey_account(&coldkey, tao_received.into())?;
```

The `unstake_from_subnet` function:
- Removes Alpha from hotkey's stake
- Calls `swap_alpha_for_tao()` to convert Alpha → TAO
- Updates subnet reserves (Alpha increases, TAO decreases)
- Returns the TAO amount received after fees

The `swap_alpha_for_tao()` function:
- Executes the actual AMM swap operation
- Calculates the amount of TAO tokens received for the given Alpha input
- Handles slippage and fee calculations
- Updates the subnet's liquidity pool reserves

## Price Protection

The staking system includes price protection mechanisms to prevent excessive slippage during AMM operations. Each staking operation has a corresponding `_limit` variant that accepts price protection parameters:

- `do_add_stake_limit()` - Staking with price protection
- `do_remove_stake_limit()` - Unstaking with price protection  

These functions accept `limit_price` and `allow_partial` parameters to control protection behavior. See [Price Protection Guide](../learn/price-protection.md) for detailed usage and examples.

## Error Handling

### Common Error Types

```rust
Error::<T>::SubnetNotExists              // Subnet doesn't exist
Error::<T>::AmountTooLow                 // Below minimum stake + fees
Error::<T>::NotEnoughBalanceToStake      // Insufficient TAO balance
Error::<T>::NotEnoughStakeToWithdraw     // Insufficient Alpha stake
Error::<T>::SlippageTooHigh              // Price protection triggered (strict mode)
Error::<T>::ZeroMaxStakeAmount           // No amount executable within price limit
Error::<T>::InsufficientLiquidity        // AMM simulation failed
```
