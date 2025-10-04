# Bittensor Rate Limits

This page reviews all rate limits implemented in the Bittensor blockchain (Subtensor). Rate limits prevent spam, ensure network stability, and maintain fair access to network resources. Rate limits in Bittensor are implemented as block-based cooldown periods. When a rate-limited operation succeeds, subsequent attempts to perform the same operation must wait for a specified number of [blocks](../resources/glossary.md#block) to pass before they can be executed again. Unsuccessful operations may be re-tried.

:::info
To check/confirm confirm current rate limits and other chain state variables on the blockchain, use the Polkadot.js chain explorer.

To view the chain state for Bittensor main network ('finney'), visit [`https://polkadot.js.org/apps`](https://polkadot.js.org/apps), choose Bittensor network, and click **Chain State** under the **Developer** tab, or visit:

[`https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fbittensor-finney.api.onfinality.io%2Fpublic-ws#/chainstate`](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fbittensor-finney.api.onfinality.io%2Fpublic-ws#/chainstate).

Most relevant attributes are under the `subtensorModule`.
:::

## Global rate limits

This section discusses rate limits that apply globally across the entire network.

### General transaction rate limit

This is the default transaction rate limit in Bittensor, but it currently only applies to hotkey swaps (other rate limited transsactions are handled by custom rate limits).

- **Rate Limit**: 1 block (12 sec)
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

This rate limit prevents a user from swapping a hotkey too frequently.

- **Rate Limit**: 1,000 blocks (~3.3 hours)
- **Configuration**: [macros/errors.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/errors.rs#L93)
- **Error message**: [`HotKeySetTxRateLimitExceeded`](../errors/subtensor.md#hotkeysettxratelimitexceeded)

### UID trimming rate limit

This rate limit controls how frequently subnet owners can trim UIDs on their subnets. This prevents disruptions in subnet stability and excessive network reorganization.

- **Rate Limit**: 216,000 blocks (~30 days) on main net; 1 block in 'fastblocks' development mode.
- **Configuration**: `MaxUidsTrimmingRateLimit` [macros/errors.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L620-L624)
- **Error message**: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

### Network registration rate limit

This rate limit prevents frequent creation of new subnets.

- **Rate Limit**: 28,800 blocks (~4 days)
- **Configuration**: `NetworkRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1155)
- **Error message**: [`NetworkTxRateLimitExceeded`](../errors/subtensor.md#networktxratelimitexceeded)

### Administrative rate limits

#### Owner hyperparameter rate limit

This rate limit controls how frequently subnet owners can modify hyperparameters.

- **Rate Limit**: 2 blocks (~24 seconds)
- **Configuration**: `OwnerHyperparamRateLimit` 
- **Error message**: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

#### Weights version key rate limit

This rate limit controls the frequency of weights version key updates.

- **Rate Limit**: 5 blocks (~1 minute)
- **Configuration**: `WeightsVersionKeyRateLimit`
- **Error message**: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

#### Administrative freeze window

This controls the duration of administrative freeze operations.

- **Duration**: 10 blocks (~2 minutes)
- **Configuration**: `AdminFreezeWindow`
- **Error message**: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

## Subnet-specific rate limits

This section discusses rate limits that apply within a specific subnet on the network. These limits are typically configurable at the subnet level.

### Serving rate limits

This rate limit controls how frequently neurons can update their serving information (axon and prometheus data) on the Bittensor network. This rate limit can be modified by changing the `serving_rate_limit` parameter in the subnet hyperparameters. For more information, see [subnet hyperparameters](../subnets/subnet-hyperparameters.md#servingratelimit).

- **Rate Limit**: Configurable per subnet (default: 50 blocks)
- **Configuration**: `ServingRateLimit` in [runtime/src/lib.rs](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1138)
- **Error message**: [`ServingRateLimitExceeded`](../errors/subtensor.md#servingratelimitexceeded)

### Subnet owner hyperparameter update rate limit

This rate limit controls how frequently a subnet owner can change subnet hyperparameters (e.g., `kappa`, `rho`, `serving_rate_limit`, etc.). The limit is enforced independently per hyperparameter, so updating one parameter does not block updating a different one during the same window.

- **Rate Limit**: Tempo(netuid) × OwnerHyperparamRateLimit (default: 2 tempos; with default tempo 360, that is 720 blocks)
- **Configuration**:
  - Global multiplier: `OwnerHyperparamRateLimit` (root) via `sudo_set_owner_hparam_rate_limit`
  - Tempo per subnet: `Tempo` (root) via `sudo_set_tempo`
- **Implementation**: [rate_limiting.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L41-L49)
- **Error message**: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

Note: All subnet owner operations are disallowed during the final blocks of each tempo as governed by `AdminFreezeWindow`. This restriction is in addition to the above rate limit.

### Additional subnet-specific limits

#### Adjustment interval

This controls the time between subnet adjustment periods where mechanism steps occur.

- **Rate Limit**: Typically 112 blocks (~22 minutes)
- **Configuration**: `AdjustmentInterval` per subnet
- **Implementation**: Controls frequency of subnet mechanism execution

#### Immunity period

This provides protection for new subnet registrations.

- **Rate Limit**: Typically 7,200 blocks (~24 hours)
- **Configuration**: `ImmunityPeriod` per subnet
- **Implementation**: Protection window for new registrants

### Mechanism configuration rate limits

These limits govern how often a subnet owner can change the number of incentive mechanisms and the emission split among them. For background on mechanisms, see [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets.md).

#### Mechanism count update rate limit

- **Rate Limit**: 7,200 blocks (~24 hours)
- **Implementation**: [utils/rate_limiting.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L28-L29)
- **Error message**: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

#### Mechanism emission split update rate limit

- **Rate Limit**: 7,200 blocks (~24 hours) on main net; 1 block in 'fastblocks' development mode.
- **Implementation**: [utils/rate_limiting.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L28-L29)
- **Error message**: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

### Staking operations rate limits

This rate limit controls how frequently a user can perform staking operations (add/remove stake, move stake) to a particular subnet (netuid).

- **Rate Limit**: 1 per block
- **Configuration**: [macros/errors.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/errors.rs#L222)
- **Error message**: [`StakingOperationRateLimitExceeded`](../errors/subtensor.md#stakingoperationratelimitexceeded)

### Weights rate limits

This section covers rate limits related to setting weights on a subnet. This rate limit can be modified by changing the `weights_rate_limit` parameter in the subnet hyperparameters. For more information, see [subnet hyperparameters](../subnets/subnet-hyperparameters.md#weightsratelimit--commitmentratelimit).

#### Weights setting rate limit

This rate limit controls how frequently a subnet validator can set weights to the network.

- **Rate Limit**: Configurable per subnet (default: 100 blocks, varies significantly by subnet)
- **Configuration**: `WeightsSetRateLimit` per subnet
- **Implementation**: [subnets/weights.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/weights.rs#L723-731)
- **Error message**: [`SettingWeightsTooFast`](../errors/subtensor.md#settingweightstoofast)
- **Effective Period**: Formula is `Tempo × WeightsSetRateLimit × 12 seconds`

:::note Current subnet variations
The weights setting rate limit varies significantly across subnets:
- Subnet 1: 100 blocks (~33 minutes)
- Subnet 12: 700 blocks (~3.9 hours) 
- Subnet 13: 50 blocks (~16 minutes)
- Subnet 25: 5 blocks (~2.5 minutes)
- Subnet 28: 1 block (~30 seconds)
- Most others: 100 blocks (~33 minutes)
:::

#### Commit-reveal weights rate limit

This rate limit controls how frequently a subnet validator can set commit on to the Bittensor chain. Changing the `weights_rate_limit` parameter in the subnet's hyperparameters also modifies this rate limit. For more information, see [subnet hyperparameters](../subnets/subnet-hyperparameters.md#weightsratelimit--commitmentratelimit).

- **Rate Limit**: Uses the same rate limit as [weights setting rate limit](#weights-setting-rate-limit)
- **Implementation**: [subnets/weights.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/weights.rs#L65-71)
- **Error message**: [`CommittingWeightsTooFast`](../errors/subtensor.md#committingweightstoofast)

### Registration rate limits

This section covers rate limits related to neuron registrations on a subnet.

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

## Subtensor Node Rate Limits

When querying OTF-provided lite nodes, then the following rate limits apply. We strongly encourage you to run your own local lite node.

- Any OTF-provided lite node will rate limit the requests to one request per second, per IP address. Note that this rate limit may change dynamically based on the network or application requirements.
- A request can be either WS/WSS or HTTP/HTTPS.
- If you exceed the rate limit, you will receive the error code 429. You will then have to wait until the rate limit window has expired.
- You can avoid OTF-lite node rate limits by running your own local lite node. You can run a lite node either [Using Docker](../subtensor-nodes/using-docker.md#using-lite-nodes) or [Using Source](../subtensor-nodes/using-source#lite-node-on-mainchain).

## Rate Limit Discovery Tool

We provide a comprehensive rate limit discovery script that programmatically queries all rate limiting parameters from the blockchain:

**Location**: [`scripts/check-rate-limits.js`](../scripts/check-rate-limits.js)

This tool automatically discovers all storage methods containing rate limiting keywords ('limit', 'rate', 'period', 'delay', 'cooldown', 'interval', 'freeze', 'pause', 'gap', 'timeout', 'restriction', 'throttle') and displays their current values.

**Usage:**
```bash
cd scripts
npm install @polkadot/api prompt-sync
node check-rate-limits.js
```

The tool provides real-time rate limit values and can be used to verify current blockchain parameters without manual Polkadot.js queries.
