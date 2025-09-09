# Chain Rate Limits

This document provides a comprehensive overview of all rate limits implemented in the Bittensor Subtensor chain. Rate limits are crucial for preventing spam, ensuring network stability, and maintaining fair access to network resources.

## Overview

Rate limits in Bittensor are implemented as block-based cooldown periods. When a rate-limited operation is performed, subsequent attempts to perform the same operation must wait for a specified number of blocks to pass before they can be executed again.

**Block Time**: ~12 seconds per block

## Global Rate Limits

### Transaction Rate Limits

These rate limits apply globally across the entire network:

#### General Transaction Rate Limit
- **Rate Limit**: 1000 blocks (~3.3 hours)
- **Configuration**: `TxRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1140)
- **Purpose**: Prevents excessive transaction spam

```rust
pub const SubtensorInitialTxRateLimit: u64 = 1000;
```

#### Delegate Take Rate Limit
- **Rate Limit**: 216,000 blocks (~30 days)
- **Configuration**: `TxDelegateTakeRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1141)
- **Purpose**: Prevents frequent changes to delegate take percentages

```rust
pub const SubtensorInitialTxDelegateTakeRateLimit: u64 = 216000; // 30 days at 12 seconds per block
```

#### Child Key Take Rate Limit
- **Rate Limit**: 216,000 blocks (~30 days)
- **Configuration**: `TxChildkeyTakeRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1142)
- **Purpose**: Prevents frequent changes to child key take percentages

```rust
pub const SubtensorInitialTxChildKeyTakeRateLimit: u64 = INITIAL_CHILDKEY_TAKE_RATELIMIT;
// Where INITIAL_CHILDKEY_TAKE_RATELIMIT = 216000 (30 days)
```

#### Network Registration Rate Limit
- **Rate Limit**: 7,200 blocks (~24 hours)
- **Configuration**: `NetworkRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1151)
- **Purpose**: Prevents rapid creation of new subnets

```rust
pub const SubtensorInitialNetworkRateLimit: u64 = 7200;
```

## Subnet-Specific Rate Limits

### Serving Rate Limits

#### Axon Serving Rate Limit
- **Rate Limit**: Configurable per subnet (default: 50 blocks)
- **Configuration**: `ServingRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1136)
- **Purpose**: Prevents excessive axon information updates
- **Implementation**: [subnets/serving.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/serving.rs#L223-231)

```rust
pub const SubtensorInitialServingRateLimit: u64 = 50;
```

The serving rate limit is checked in the `axon_passes_rate_limit` function:

```rust
pub fn axon_passes_rate_limit(
    netuid: NetUid,
    prev_axon_info: &AxonInfoOf,
    current_block: u64,
) -> bool {
    let rate_limit: u64 = Self::get_serving_rate_limit(netuid);
    let last_serve = prev_axon_info.block;
    rate_limit == 0 || last_serve == 0 || current_block.saturating_sub(last_serve) >= rate_limit
}
```

### Weights Rate Limits

#### Weights Setting Rate Limit
- **Rate Limit**: Configurable per subnet
- **Configuration**: `WeightsSetRateLimit` per subnet
- **Purpose**: Prevents excessive weight updates
- **Implementation**: [subnets/weights.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/weights.rs#L723-731)

The weights setting rate limit is enforced in the `do_set_weights` function:

```rust
// --- 9. Ensure the uid is not setting weights faster than the weights_set_rate_limit.
let neuron_uid = Self::get_uid_for_net_and_hotkey(netuid, &hotkey)?;
let current_block: u64 = Self::get_current_block_as_u64();
if !Self::get_commit_reveal_weights_enabled(netuid) {
    ensure!(
        Self::check_rate_limit(netuid, neuron_uid, current_block),
        Error::<T>::SettingWeightsTooFast
    );
}
```

#### Commit-Reveal Weights Rate Limit
- **Rate Limit**: Uses the same rate limit as weights setting
- **Purpose**: Prevents excessive weight commits
- **Implementation**: [subnets/weights.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/weights.rs#L65-71)

```rust
// 4. Check that the commit rate does not exceed the allowed frequency.
let commit_block = Self::get_current_block_as_u64();
let neuron_uid = Self::get_uid_for_net_and_hotkey(netuid, &who)?;
ensure!(
    Self::check_rate_limit(netuid, neuron_uid, commit_block),
    Error::<T>::CommittingWeightsTooFast
);
```

### Registration Rate Limits

#### Per-Block Registration Limit
- **Rate Limit**: Configurable per subnet (default: 1 registration per block)
- **Configuration**: `MaxRegistrationsPerBlock` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1123)
- **Purpose**: Prevents registration spam within a single block

```rust
pub const SubtensorInitialMaxRegistrationsPerBlock: u16 = 1;
```

#### Per-Interval Registration Limit
- **Rate Limit**: 3x the target registrations per interval
- **Configuration**: `TargetRegistrationsPerInterval` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1120)
- **Purpose**: Prevents registration spam over longer periods

```rust
pub const SubtensorInitialTargetRegistrationsPerInterval: u16 = 2;
```

The per-interval limit is enforced as:

```rust
// --- 5. Ensure we are not exceeding the max allowed registrations per interval.
ensure!(
    Self::get_registrations_this_interval(netuid)
        < Self::get_target_registrations_per_interval(netuid).saturating_mul(3),
    Error::<T>::TooManyRegistrationsThisInterval
);
```

## Transaction-Specific Rate Limits

### Set Children Rate Limit
- **Rate Limit**: 150 blocks (~30 minutes)
- **Purpose**: Prevents excessive child key management
- **Implementation**: [utils/rate_limiting.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L50)

```rust
TransactionType::SetChildren => 150, // 30 minutes
```

### Set Child Key Take Rate Limit
- **Rate Limit**: Uses `TxChildkeyTakeRateLimit` (216,000 blocks)
- **Purpose**: Prevents frequent changes to child key take percentages
- **Implementation**: [utils/rate_limiting.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L51)

### Set Weights Version Key Rate Limit
- **Rate Limit**: `Tempo * WeightsVersionKeyRateLimit`
- **Purpose**: Prevents excessive version key updates
- **Implementation**: [utils/rate_limiting.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L62-63)

```rust
TransactionType::SetWeightsVersionKey => (Tempo::<T>::get(netuid) as u64)
    .saturating_mul(WeightsVersionKeyRateLimit::<T>::get()),
```

### Set Subnet Owner Hotkey Rate Limit
- **Rate Limit**: Uses `DefaultSetSNOwnerHotkeyRateLimit`
- **Purpose**: Prevents frequent subnet owner changes
- **Implementation**: [utils/rate_limiting.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L64)

## Rate Limit Implementation Details

### Rate Limit Checking Logic

The core rate limit checking logic is implemented in [utils/rate_limiting.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L70-73):

```rust
pub fn check_passes_rate_limit(limit: u64, block: u64, last_block: u64) -> bool {
    // Allow the first transaction (when last_block is 0) or if the rate limit has passed
    last_block == 0 || block.saturating_sub(last_block) >= limit
}
```

### Rate Limit Storage

Rate limits are tracked using the following storage mechanisms:

1. **Transaction Key Last Block**: `TransactionKeyLastBlock<(AccountId, NetUid, u16)>`
2. **Network Last Lock Block**: `NetworkLastLockBlock`
3. **Rate Limited Last Block**: `RateLimitedLastBlock<RateLimitKey>`

### Error Handling

Rate limit violations result in specific error types:

- `SettingWeightsTooFast`: Weights setting rate limit exceeded
- `CommittingWeightsTooFast`: Commit-reveal rate limit exceeded
- `ServingRateLimitExceeded`: Axon serving rate limit exceeded
- `TxRateLimitExceeded`: General transaction rate limit exceeded
- `DelegateTxRateLimitExceeded`: Delegate take rate limit exceeded
- `TxChildkeyTakeRateLimitExceeded`: Child key take rate limit exceeded
- `NetworkTxRateLimitExceeded`: Network registration rate limit exceeded

## Configuration and Updates

Rate limits can be updated through governance mechanisms:

1. **Sudo calls**: For emergency updates
2. **Triumvirate votes**: For major changes
3. **Subnet-specific updates**: For subnet-level rate limits

### Setting Rate Limits

Rate limits can be set using the following functions:

```rust
// General transaction rate limit
SubtensorModule::set_tx_rate_limit(rate_limit);

// Delegate take rate limit
SubtensorModule::set_tx_delegate_take_rate_limit(rate_limit);

// Child key take rate limit
SubtensorModule::set_tx_childkey_take_rate_limit(rate_limit);

// Serving rate limit (per subnet)
SubtensorModule::set_serving_rate_limit(netuid, rate_limit);

// Weights setting rate limit (per subnet)
SubtensorModule::set_weights_set_rate_limit(netuid, rate_limit);
```

## Migration Considerations

When planning runtime upgrades that affect rate limits:

1. **Document Changes**: All rate limit changes should be documented in advance
2. **Gradual Updates**: Consider implementing rate limit changes gradually
3. **User Notification**: Notify users of rate limit changes well in advance
4. **Testing**: Thoroughly test rate limit changes on testnets
5. **Rollback Plan**: Have a plan to rollback rate limit changes if needed

### Rate Limit Change Process

1. **Proposal**: Rate limit changes should be proposed through governance
2. **Discussion**: Community discussion and feedback
3. **Voting**: Formal voting process through Triumvirate
4. **Implementation**: Code changes and testing
5. **Deployment**: Runtime upgrade deployment
6. **Monitoring**: Post-deployment monitoring and adjustment

## Best Practices

1. **Monitor Usage**: Regularly monitor rate limit usage patterns
2. **Adjust Gradually**: Make rate limit adjustments gradually
3. **Document Changes**: Always document rate limit changes
4. **Test Thoroughly**: Test rate limit changes on testnets
5. **User Communication**: Communicate changes to users clearly
6. **Emergency Procedures**: Have procedures for emergency rate limit adjustments

## References

- [Rate Limiting Implementation](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs)
- [Runtime Configuration](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs)
- [Serving Rate Limits](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/serving.rs)
- [Weights Rate Limits](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/weights.rs)
- [Registration Rate Limits](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/registration.rs)
