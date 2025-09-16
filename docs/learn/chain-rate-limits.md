# Bittensor Rate Limits

This document provides a comprehensive overview of all rate limits implemented in the Bittensor Subtensor chain. Rate limits are crucial for preventing spam, ensuring network stability, and maintaining fair access to network resources.

---

Rate limits in Bittensor are implemented as block-based cooldown periods. When a rate-limited operation is performed, subsequent attempts to perform the same operation must wait for a specified number of [blocks](../resources/glossary.md#block) to pass before they can be executed again.

## Global rate limits

This section discusses rate limits that apply globally across the entire network.

### General transaction rate limit

This is the default transaction rate limit in Bittensor. It helps to prevent excessive transaction spam from a single account on the network.

- **Rate Limit**: 1000 blocks (~3.3 hours)
- **Configuration**: `TxRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1144)
- **Error message**: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

### Delegate take rate limit

This rate limit prevents frequent changes to delegate take percentages.

- **Rate Limit**: 216,000 blocks (~30 days)
- **Configuration**: `TxDelegateTakeRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1145)
- **Error message**: [`DelegateTxRateLimitExceeded`](../errors/subtensor.md#delegatetxratelimitexceeded)

### Child key take rate limit

This rate limit prevents the owner of a child hotkey from making frequent changes to the child key take percentages. This protects against rapid manipulation of child key relationships and ensures stability in the child key delegation system.

- **Rate Limit**: 216,000 blocks (~30 days)
- **Configuration**: `TxChildkeyTakeRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1146)
- **Error message**:[ `TxChildkeyTakeRateLimitExceeded`](../errors/subtensor.md#txchildkeytakeratelimitexceeded)

### Hotkey set rate limit

This rate limit prevents a user from setting or swapping a hotkey too frequently.

- **Rate Limit**: 1,000 blocks (~3.3 hours)
- **Configuration**: [macros/errors.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/errors.rs#L93)
- **Error message**: [`HotKeySetTxRateLimitExceeded`](../errors/subtensor.md#hotkeysettxratelimitexceeded)

### Network registration rate rimit

This rate limit prevents frequent creation of new subnets.

- **Rate Limit**: 7,200 blocks (~24 hours)
- **Configuration**: `NetworkRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1155)
- **Error message**: [`NetworkTxRateLimitExceeded`](../errors/subtensor.md#networktxratelimitexceeded)

## Subnet-specific rate limits

This section discusses rate limits that apply within a specific subnet on the network. These limits are typically configurable at the subnet level.

### Serving rate limits

This rate limit controls how frequently neurons can update their serving information (axon and prometheus data) on the Bittensor network. This rate limit can be modified by changing the `serving_rate_limit` parameter in the subnet hyperparameters. For more information, see [subnet hyperparameters](../subnets/subnet-hyperparameters.md#servingratelimit).

- **Rate Limit**: Configurable per subnet (default: 50 blocks)
- **Configuration**: `ServingRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1138)
- **Error message**: [`ServingRateLimitExceeded`](../errors/subtensor.md#servingratelimitexceeded)

### Staking operations rate limits

This rate limit controls how frequently a user can perform staking operations (add/remove stake, move stake).

- **Rate Limit**: 1 per block
- **Configuration**: [macros/errors.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/errors.rs#L222)
- **Error message**: [`StakingOperationRateLimitExceeded`](../errors/subtensor.md#stakingoperationratelimitexceeded)

### Weights rate limits

This section covers rate limits related to setting weights on a subnet. This rate limit can be modified by changing the `weights_rate_limit` parameter in the subnet hyperparameters. For more information, see [subnet hyperparameters](../subnets/subnet-hyperparameters.md#weightsratelimit--commitmentratelimit).

#### Weights setting rate limit

This rate limit controls how frequently a subnet validator can set weights to the network.

- **Rate Limit**: Configurable per subnet (default: 100 blocks)
- **Configuration**: `WeightsSetRateLimit` per subnet
- **Implementation**: [subnets/weights.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/weights.rs#L723-731)
- **Error message**: [`SettingWeightsTooFast`](../errors/subtensor.md#settingweightstoofast)

#### Commit-reveal weights rate limit

This rate limit controls how frequently a subnet validator can set commit on to the Bittensor chain. Changing the `weights_rate_limit` parameter in the subnet's hyperparameters also modifies this rate limit. For more information, see [subnet hyperparameters](../subnets/subnet-hyperparameters.md#weightsratelimit--commitmentratelimit).

- **Rate Limit**: Uses the same rate limit as [weights setting rate limit](#weights-setting-rate-limit)
- **Implementation**: [subnets/weights.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/weights.rs#L65-71)
- **Error message**: [`CommittingWeightsTooFast`](../errors/subtensor.md#committingweightstoofast)

### Registration rate limits

This section covers rate limits related to neuron registrations on a subnet and on the network.

#### Per-block registration limit

This rate limit controls how frequently registrations can occur on a particular subnet. This rate limit can be modified by changing the `max_regs_per_block` parameter in the subnet hyperparameters. For more information, see [subnet hyperparameters](../subnets/subnet-hyperparameters.md#maxregistrationsperblock).

- **Rate Limit**: Configurable per subnet (default: 1 registration per block)
- **Configuration**: `MaxRegistrationsPerBlock` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1123)
- **Error message**: [`TooManyRegistrationsThisBlock`](../errors/subtensor.md#toomanyregistrationsthisblock)

#### Per-interval registration limit

This rate limit controls the frequency of neuron registrations within an [interval](../subnets/subnet-hyperparameters#adjustmentinterval). This limit occurs when registration attempts in the current interval exceed three times the target registrations per interval.

- **Rate Limit**: 3x the target registrations per interval
- **Configuration**: `TargetRegistrationsPerInterval` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1122)
- **Error message**: [`TooManyRegistrationsThisInterval`](../errors/subtensor.md#toomanyregistrationsthisinterval)

## Best Practices

1. **Monitor Usage**: Regularly monitor rate limit usage patterns
2. **Document Changes**: Always document rate limit changes
3. **Test Thoroughly**: Test rate limit changes on testnets
