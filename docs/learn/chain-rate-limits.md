---
title: "Rate Limits"
---

# Rate Limits

This page reviews all rate limits implemented in the Bittensor blockchain (Subtensor). Rate limits prevent spam, ensure network stability, and maintain fair access to network resources. Rate limits in Bittensor are implemented as block-based cooldown periods. When a rate-limited operation succeeds, subsequent attempts to perform the same operation must wait for a specified number of [blocks](../resources/glossary.md#block) to pass before they can be executed again. Unsuccessful operations may be re-tried.

:::info
To check/confirm current rate limits and other chain state variables on the blockchain, use the Polkadot.js chain explorer.

To view the chain state for Bittensor main network ('finney'), visit [`https://polkadot.js.org/apps`](https://polkadot.js.org/apps), choose Bittensor network, and click **Chain State** under the **Developer** tab, or visit:

[`https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fbittensor-finney.api.onfinality.io%2Fpublic-ws#/chainstate`](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fbittensor-finney.api.onfinality.io%2Fpublic-ws#/chainstate).

Most relevant attributes are under the `subtensorModule`.
:::

## Global rate limits

This section discusses rate limits that apply globally across the entire network.

### General transaction rate limit

This is the default transaction rate limit in Bittensor, but it currently only applies to hotkey swaps (other rate limited transactions are handled by custom rate limits).

- Rate Limit: 1 block (12 sec)
- Chain State Variable: `TxRateLimit`
- Error message: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

### Delegate take rate limit

This rate limit prevents frequent changes to delegate take percentages.

- Rate Limit: 216,000 blocks (~30 days)
- Chain State Variable: `TxDelegateTakeRateLimit`
- Error message: [`DelegateTxRateLimitExceeded`](../errors/subtensor.md#delegatetxratelimitexceeded)


### Hotkey swap rate limit

This rate limit prevents a user from swapping a hotkey too frequently. Hotkey swaps are subject to **two separate rate limits** that must both be satisfied:

- Rate Limit: 
  - General transaction: 1 block (12 seconds)
  - Per-subnet: 36,000 blocks (~5 days)
- Chain State Variables: 
  - `TxRateLimit` (general transaction rate limit)
  - `HotkeySwapOnSubnetInterval` (global interval constant, not queryable from chain state)
- Source Code: [swap_hotkey.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/swap/swap_hotkey.rs#L52-56)
- Error message: [`HotKeySetTxRateLimitExceeded`](../errors/subtensor.md#hotkeysettxratelimitexceeded)

### UID trimming rate limit

This rate limit controls how frequently subnet owners can trim UIDs on their subnets. This prevents disruptions in subnet stability and excessive network reorganization.

- Rate Limit: 216,000 blocks (~30 days) on main net; 1 block in 'fastblocks' development mode.
- Chain State Variable: `MaxUidsTrimmingRateLimit` (Not queryable from chain state)
- Error message: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

### Network registration rate limit

This rate limit prevents frequent creation of new subnets.

- Rate Limit: 28,800 blocks (4 days)
- Chain State Variable: `NetworkRateLimit`
- Error message: [`NetworkTxRateLimitExceeded`](../errors/subtensor.md#networktxratelimitexceeded)

### Owner hyperparameter rate limit

This rate limit controls how frequently subnet owners can modify hyperparameters. The limit is enforced independently per hyperparameter, so updating one parameter does not block updating a different one during the same window.

- Rate Limit: 2 tempos
- Chain State Variable: `OwnerHyperparamRateLimit`
- Error message: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)


### Weights version key rate limit

This rate limit controls the frequency of weights version key updates.

- Rate Limit: 5 blocks (~1 minute)
- Chain State Variable: `WeightsVersionKeyRateLimit`
- Error message: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

### Administrative freeze window

This controls the duration of the administrative freeze window at the end of each epoch, during which subnet owner operations are disallowed.

- Duration: 10 blocks (~2 minutes)
- Chain State Variable: `AdminFreezeWindow`
- Error message: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

### Subnet Mechanism count update rate limit

Limits how often a subnet owner can change the number of incentive mechanisms. For background on mechanisms, see [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets.md).

- Rate Limit: 7,200 blocks (~24 hours)
- Chain State Variable: `MechanismCountSetRateLimit` (Not queryable from chain state)
- Source Code: [lib.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1894-1897)
- Error message: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

### Subnet Mechanism emission split update rate limit

Limits how often a subnet owner can change the allocation of emissions among the subnet's mechanisms. For background on mechanisms, see [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets.md).

- Rate Limit: 7,200 blocks (~24 hours) on main net; 1 block in 'fastblocks' development mode.
- Chain State Variable: `MechanismEmissionRateLimit` (Not queryable from chain state)
- Source Code: [lib.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1898-1902)
- Error message: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

### Staking operations rate limits

This rate limit controls how frequently a user can perform staking operations (add/remove stake, move stake) to a particular subnet (netuid).

- Rate Limit: 1 per block
- Chain State Variable: `StakingOperationRateLimiter` (Bool, since limit is 1 operation)
- Error message: [`StakingOperationRateLimitExceeded`](../errors/subtensor.md#stakingoperationratelimitexceeded)


### Child hotkey operations rate limit

This rate limit controls how frequently a parent hotkey can set or revoke child hotkeys on a specific subnet. Note that revoking children is implemented by calling `set_children` with an empty list, so both operations share the same rate limit.

- Rate Limit: 150 blocks (~30 minutes)
- Source Code: [rate_limiting.rs](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L25-L28)
- Error message: [`TxRateLimitExceeded`](../errors/subtensor.md#txratelimitexceeded)

### Child key take rate limit

This rate limit prevents the owner of a child hotkey from making frequent changes to the child key take percentages.

- Rate Limit: 216,000 blocks (~30 days)
- Chain State Variable: `TxChildkeyTakeRateLimit`
- Error message: [`TxChildkeyTakeRateLimitExceeded`](../errors/subtensor.md#txchildkeytakeratelimitexceeded)

## Subnet-specific rate limits

This section discusses rate limits that apply within a specific subnet on the network. These limits are typically configurable at the subnet level.

### Serving rate limits

This rate limit controls how frequently neurons can update their serving information (axon and prometheus data) on the Bittensor network. This rate limit can be modified by changing the `serving_rate_limit` parameter in the subnet hyperparameters. For more information, see [subnet hyperparameters](../subnets/subnet-hyperparameters.md#servingratelimit).

- Rate Limit: Configurable per subnet (default: 10 blocks)
- Chain State Variable: `ServingRateLimit`
- Error message: [`ServingRateLimitExceeded`](../errors/subtensor.md#servingratelimitexceeded)


### Weights setting rate limit

This rate limit controls how frequently a subnet validator can set weights to the network. Appears as `weights_rate_limit` in the subnet's hyperparameters. For more information, see [subnet hyperparameters](../subnets/subnet-hyperparameters.md#weightsratelimit--commitmentratelimit).

- Rate Limit: Configurable per subnet (default: 100 blocks, varies significantly by subnet)
- Chain State Variable: `WeightsSetRateLimit` per subnet
- Error message: [`SettingWeightsTooFast`](../errors/subtensor.md#settingweightstoofast)
- Effective Period: Formula is `Tempo × WeightsSetRateLimit × 12 seconds`

### Registration rate limits

This section covers rate limits related to neuron registrations on a subnet.

#### Per-block registration limit

This rate limit controls how frequently registrations can occur on a particular subnet. This rate limit can be modified by changing the `max_regs_per_block` parameter in the subnet hyperparameters. For more information, see [subnet hyperparameters](../subnets/subnet-hyperparameters.md#maxregistrationsperblock).

- Rate Limit: Configurable per subnet (default: 1 registration per block)
- Chain State Variable: `MaxRegistrationsPerBlock`
- Error message: [`TooManyRegistrationsThisBlock`](../errors/subtensor.md#toomanyregistrationsthisblock)

#### Per-interval registration limit

This rate limit controls the frequency of neuron registrations within an [interval](../subnets/subnet-hyperparameters#adjustmentinterval). This limit occurs when registration attempts in the current interval exceed three times the target registrations per interval.

- Rate Limit: 3x the target registrations per interval
- Chain State Variable: `TargetRegistrationsPerInterval`
- Error message: [`TooManyRegistrationsThisInterval`](../errors/subtensor.md#toomanyregistrationsthisinterval)

## Subtensor Node Rate Limits

When querying OTF-provided lite nodes, the following rate limits apply. We strongly encourage you to run your own local lite node.

- Any OTF-provided lite node will rate limit the requests to one request per second, per IP address. Note that this rate limit may change dynamically based on the network or application requirements.
- A request can be either WS/WSS or HTTP/HTTPS.
- If you exceed the rate limit, you will receive the error code 429. You will then have to wait until the rate limit window has expired.
- You can avoid OTF-lite node rate limits by running your own local lite node. You can run a lite node either [Using Docker](../subtensor-nodes/using-docker.md#using-lite-nodes) or [Using Source](../subtensor-nodes/using-source#lite-node-on-mainchain).

