# Rate Limiting in Bittensor: Developer Guide

This document provides a comprehensive overview of rate limiting mechanisms in Bittensor, covering implementation details, error types, configuration, and best practices for developers.

---

## Overview

Rate limiting in Bittensor prevents spam and abuse by enforcing time-based restrictions on various operations. The system tracks the last block when specific operations were performed and requires a minimum number of blocks to pass before allowing the same operation again.

### Key Concepts

- **Rate Limit**: Minimum number of blocks that must pass between operations
- **Last Block Tracking**: Storage of the block number when an operation was last performed
- **Transaction Types**: Different operations have different rate limits
- **Account-Specific Limits**: Some limits apply per account, others per subnet

---

## Implementation Architecture

### Core Components

1. **Rate Limit Storage**: `LastRateLimitedBlock<T>` maps rate limit keys to block numbers
2. **Transaction Type Enum**: Defines different operation categories
3. **Rate Limit Keys**: Unique identifiers for different rate limit contexts
4. **Validation Functions**: Check if operations pass rate limits

### Rate Limit Values

| Transaction Type       | Default Rate Limit       | Description                         |
| ---------------------- | ------------------------ | ----------------------------------- |
| `SetChildren`          | 150 blocks (~30 minutes) | Setting child key relationships     |
| `SetChildkeyTake`      | Configurable             | Changing child key take percentages |
| `RegisterNetwork`      | Configurable             | Creating new subnets                |
| `SetWeightsVersionKey` | Subnet-specific          | Setting weights version keys        |
| `SetSNOwnerHotkey`     | Configurable             | Changing subnet owner hotkeys       |

### Subnet-Specific Rate Limits

Some operations have different rate limits depending on the subnet:

```rust
pub fn get_rate_limit_on_subnet(tx_type: &TransactionType, netuid: NetUid) -> u64 {
    match tx_type {
        TransactionType::SetWeightsVersionKey =>
            (Tempo::<T>::get(netuid) as u64)
                .saturating_mul(WeightsVersionKeyRateLimit::<T>::get()),
        TransactionType::SetSNOwnerHotkey =>
            DefaultSetSNOwnerHotkeyRateLimit::<T>::get(),
        _ => Self::get_rate_limit(tx_type),
    }
}
```

---

## Rate Limit Validation

### Core Validation Logic

```rust
pub fn check_passes_rate_limit(limit: u64, block: u64, last_block: u64) -> bool {
    // Allow first transaction (last_block == 0) or if enough blocks have passed
    last_block == 0 || block.saturating_sub(last_block) >= limit
}
```

### Validation Flow

1. **Get Current Block**: Retrieve current block number
2. **Get Rate Limit**: Determine applicable rate limit for operation
3. **Get Last Block**: Retrieve last execution block for the operation
4. **Check Condition**: Verify sufficient blocks have passed
5. **Update Tracking**: Set new last block if operation succeeds

---

## Error Types and Codes

### Rate Limit Error Variants

| Error                               | Code | Description                        |
| ----------------------------------- | ---- | ---------------------------------- |
| `RateLimitExceeded`                 | 6    | General rate limit exceeded        |
| `ServingRateLimitExceeded`          | 12   | Axon/prometheus serving rate limit |
| `TxRateLimitExceeded`               | 158  | General transaction rate limit     |
| `NetworkTxRateLimitExceeded`        | 89   | Network registration rate limit    |
| `DelegateTxRateLimitExceeded`       | 91   | Delegate take change rate limit    |
| `HotKeySetTxRateLimitExceeded`      | 93   | Hotkey swap rate limit             |
| `StakingOperationRateLimitExceeded` | 222  | Staking operation rate limit       |
| `TxChildkeyTakeRateLimitExceeded`   | 168  | Child key take change rate limit   |

### Error Handling

Rate limit errors are returned as `CustomTransactionError` variants and converted to appropriate dispatch errors:

```rust
impl From<CustomTransactionError> for u8 {
    fn from(variant: CustomTransactionError) -> u8 {
        match variant {
            CustomTransactionError::RateLimitExceeded => 6,
            CustomTransactionError::ServingRateLimitExceeded => 12,
            // ... other variants
        }
    }
}
```

---

## Specialized Rate Limiting

### Staking Operations

Staking operations use a different mechanism with temporary locks:

```rust
// Temporary lock for staking operations
StakingOperationRateLimiter::<T>::insert((hotkey, coldkey, netuid), true);

// Check if staking operation is rate limited
ensure!(
    !StakingOperationRateLimiter::<T>::contains_key((hotkey, coldkey, netuid)),
    Error::<T>::StakingOperationRateLimitExceeded
);
```

### Serving Rate Limits

Axon and prometheus serving have subnet-specific rate limits:

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

---

## Configuration and Parameters

### Runtime Configuration

```rust
parameter_types! {
    pub const SubtensorInitialServingRateLimit: u64 = 50;
    pub const SubtensorInitialTxRateLimit: u64 = 1000;
    pub const SubtensorInitialTxDelegateTakeRateLimit: u64 = 216000; // 30 days
    pub const SubtensorInitialTxChildKeyTakeRateLimit: u64 = 5;
}
```

### Configurable Parameters

- **Serving Rate Limit**: Per-subnet limit for axon/prometheus updates
- **Transaction Rate Limit**: General transaction frequency limit
- **Delegate Take Rate Limit**: Time between delegate take changes
- **Child Key Take Rate Limit**: Time between child key take changes
- **Network Registration Rate Limit**: Time between network registrations

---

## Usage Patterns

### Checking Rate Limits

```rust
// Check if operation passes rate limit
if !Self::passes_rate_limit(&tx_type, &account) {
    return Err(Error::<T>::TxRateLimitExceeded.into());
}

// Check subnet-specific rate limit
if !Self::passes_rate_limit_on_subnet(&tx_type, &hotkey, netuid) {
    return Err(Error::<T>::TxRateLimitExceeded.into());
}
```

### Updating Rate Limit Tracking

```rust
// Set last transaction block after successful operation
let current_block = Self::get_current_block_as_u64();
Self::set_last_transaction_block_on_subnet(
    &hotkey,
    netuid,
    &tx_type,
    current_block,
);
```

### Clearing Rate Limits (Testing)

```rust
// Remove rate limit for testing
Self::remove_rate_limited_last_block(&RateLimitKey::LastTxBlock(account.clone()));
```

---

## Best Practices

### For Developers

1. **Always Check Rate Limits**: Validate rate limits before performing operations
2. **Handle Errors Gracefully**: Provide meaningful error messages for rate limit violations
3. **Use Appropriate Transaction Types**: Choose the correct transaction type for rate limiting
4. **Consider User Experience**: Implement retry mechanisms with appropriate delays

### For DApp Integration

1. **Cache Rate Limit Status**: Track last operation times client-side
2. **Implement Exponential Backoff**: Gradually increase retry delays
3. **Show Clear Error Messages**: Inform users about rate limit violations
4. **Provide Alternatives**: Suggest alternative operations when rate limited

### For Testing

1. **Mock Rate Limits**: Use test configurations with disabled rate limits
2. **Test Edge Cases**: Verify behavior at rate limit boundaries
3. **Clear State**: Reset rate limit state between test cases
4. **Validate Error Codes**: Ensure correct error codes are returned

---

## Monitoring and Debugging

### Rate Limit Status Queries

```rust
// Get last transaction block for an account
let last_block = Self::get_last_tx_block(&account);

// Get current rate limit for transaction type
let rate_limit = Self::get_rate_limit(&TransactionType::SetChildren);

// Check if operation would pass rate limit
let would_pass = Self::check_passes_rate_limit(rate_limit, current_block, last_block);
```

### Common Debugging Scenarios

1. **Unexpected Rate Limit Errors**: Check if operations are being called too frequently
2. **Inconsistent Behavior**: Verify correct transaction types are being used
3. **Test Failures**: Ensure rate limit state is properly reset between tests
4. **Performance Issues**: Monitor rate limit check frequency and optimize if needed

---

## Future Considerations

- **Dynamic Rate Limits**: Consider implementing adaptive rate limits based on network conditions
- **Priority Queues**: Implement priority-based rate limiting for critical operations
- **Rate Limit Exemptions**: Add mechanisms for exempting certain accounts or operations
- **Enhanced Monitoring**: Improve rate limit metrics and alerting capabilities

This rate limiting system provides essential protection against spam and abuse while maintaining usability for legitimate operations. Understanding these mechanisms is crucial for building robust applications on Bittensor.
