---
title: "Multiple Incentive Mechanisms Within Subnets"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

#  Multiple Incentive Mechanisms Within Subnets

This page explores how subnets can implement multiple incentive mechanisms to distribute emissions across different evaluation criteria.

:::tip Hot new feature
Multiple incentive mechanisms per subnet is a new feature that is still in development. It's initial release on mainnet is expected the week of September 22. In the meantime, it can be experimented with using a locally run chain.

See [Announcements](../learn/announcements) for updates.
:::

For an introduction to incentive mechanisms in general, see [Understanding Incentive Mechanisms](../learn/anatomy-of-incentive-mechanism). For the basics of subnets, miners, validators, and the blockchain, see [Components of the Bittensor platform](../learn/neurons).

For coverage of the procedures involved, see:
- [Managing Mechanisms with SDK](./managing-mechanisms-with-sdk)
- [Managing Mechanisms with BTCLI](./managing-mechanisms-btcli)

Historically, each subnet operates with a single **incentive mechanism**, a function that validators run to assign weights to miners based on the value of their work. Subnets can now support **multiple incentive mechanisms**, allowing a subnet creator to apportion the subnet's emissions across different evaluation criteria, each running Yuma Consensus _independently_ with separate bond pools to evaluate miners' performance on distinct tasks.

Each miner receives emissions separately from each incentive mechanism, so a miner's performance in one mechanism does not affect their rating in another, and their emissions for each epoch are summed across all mechanisms. Validators receive dividends as a weighted sum of their performance across all incentive mechanisms - they cannot choose which mechanisms to validate, and if they don't validate all mechanisms, they receive proportionally reduced emissions. Multiple incentive mechanisms don't change the total emissions to a subnet, but create a way for subnet creators to distribute those emissions to miners working on different tasks. This mechanism affords subnet creators a transparent, on-chain way to exercise fine-grained control over the work they are incentivizing, keeping miner effort focused on work that is most needed at a time.

Each incentive mechanism has its own:

- **Weight matrix**: Each validator sets weights for each miner on each of the subnet's incentive mechanisms.
- **Independent bond pools**: Each mechanism maintains separate bonding relationships for Yuma Consensus calculations.
- **Independent emissions**: Since they depend on weights set by validators, a miner's emissions from each mechanism are independent.
- **Transparent on-chain data**: All incentive mechanism configurations and the flow of emissions are visible on-chain.
- **Emission distribution**: Subnet creators can control what percentage of total emissions goes to each mechanism using the `sudo_set_mechanism_emission_split` extrinsic. <!-- See: subtensor/pallets/subtensor/src/subnets/subsubnet.rs:173-175 -->

### Takeaways

1. **Same Validators, Same Stake**: All validators participate in all incentive mechanisms within a subnet with identical stake weights.
2. **Same Miners**: All miners registered on a subnet can participate in any of its incentive mechanisms.
3. **Owner-Controlled Proportions**: The holder of the _subnet creator_ key sets the emission distribution among incentive mechanisms.
4. **Separate Bond Pools**: Each incentive mechanism maintains separate bonding relationships for independent Yuma Consensus calculations.

:::note Current runtime limit
As of the current Subtensor runtime, a subnet can have a maximum of 2 mechanisms. It is planned to raised this cap in the future.
:::

## What Should Stakers Know?

**Core Impact:**

- **No change to your staking mechanics**: Your stake is delegated to a validator on a subnet, and applies across all incentive mechanisms equally.
- **Same total emissions**: The subnet's total emissions remain unchanged - multiple mechanisms only redistribute these emissions internally among miners and validators.
- **Transparent allocation**: All emission proportions are visible on-chain, so you can see exactly how subnet owners are distributing emissions.

**What This Means for Your Strategy:**

- **No immediate action required**: Your existing staking strategy doesn't need to change
- **Enhanced monitoring**: You may want to track individual mechanism performance to understand subnet health
- **Risk assessment**: Factor in incentive mechanism design when evaluating subnet quality
- **Community oversight**: Use transparency to hold subnet owners accountable for fair emission distribution

## What Should Miners Know?

**Automatic Participation:**

- **No separate registration**: When you register for a subnet, you are eligible to participate in any of its incentive mechanisms
- **Same UID across all mechanisms**: You use the same UID for all incentive mechanisms within a subnet

**Performance Tracking:**

- **Independent scoring**: Your performance is independent across different mechanisms, e.g. mechanism 0 doesn't affect your rating in mechanism 1.
- **Separate incentive columns**: You'll see individual incentive amounts for each mechanism in metagraph data.
- **Cumulative emissions**: Your total emissions = sum of emissions from all mechanisms where you participate.

## What Should Validators Know?

### Core Changes

- **Separate weight setting**: You must set weights independently for each incentive mechanism.
- **Independent evaluation**: Each mechanism requires separate assessment according to its specific criteria.
- **Separate bond pools**: Each mechanism maintains independent bonding relationships for Yuma Consensus calculations.
- **Same stake weight**: Your stake weight is identical across all mechanisms - no additional stake required.
- **Weighted dividend calculation**: Your dividends are calculated as a weighted sum of your performance across all mechanisms. If you don't validate on all mechanisms, you will receive proportionally reduced emissions.

### Operational Changes

**1. Evaluation Workload:**

- **Multiple assessments**: You must evaluate miners separately for each mechanism's tasks
- **Different criteria**: Each mechanism may have distinct evaluation standards

**2. Data Structure Changes:**

- **Two-dimensional weights**: Weights are now set for each miner on each mechanism.
- **Separate incentive tracking**: Each mechanism tracks incentives independently
- **Extended metagraph**: New columns for mechanism weights and incentives

## What Should Subnet Creators/Developers Know?

### Core Changes

- **Emission distribution**: You can control what percentage of total emissions goes to each incentive mechanism using the `sudo_set_mechanism_emission_split` extrinsic. When the number of mechanisms is set, the emission distribution is reset to an even split, but you can set it again with custom proportions.

  :::info
  The `sudo_set_mechanism_emission_split` extrinsic accepts an optional vector parameter. If the parameter is `None`, the distribution is set to an even split. When it's not `None`, it reflects the proportion of emissions each mechanism gets. The proportion is calculated as `value / 65535`. For example, in a subnet with two mechanisms and vector `[13107, 52428]`, mechanism 0 gets 20% and mechanism 1 gets 80%. <!-- See: subtensor/pallets/subtensor/src/subnets/subsubnet.rs:173-175 -->
  :::

- **Incentive mechanism design**: You define the specific tasks and evaluation criteria for each mechanism
- **Transparent configuration**: All mechanism settings are visible on-chain for community oversight
- **Single subnet slot**: No need to register multiple subnets for multiple competitions
- **Immediate mechanism number setting**: The number of mechanisms is set immediately when changed. <!-- See: subtensor/pallets/subtensor/src/subnets/subsubnet.rs:91-116 -->
- **Rate limiting**: Subnet owners can set the number of mechanisms once per 7200 blocks (24 hours) on mainnet. See [Rate Limits in Bittensor](../learn/chain-rate-limits.md). <!-- See: subtensor/pallets/subtensor/src/lib.rs:1842-1844 -->

:::tip
Ensure proportions sum to 100% when setting them, or the request will be rejected.
:::

## Example Emissions Split

For each subnet, the subnet creator keeps 18% of emissions, 41% is allocated to miners, and 41% to validators and their stakers, unless the subnet creator has reduced their take. Of the 41% that goes to miners and validators, here is an estimated emission distribution across three incentive mechanisms for each 100 $\tau$ earned on the subnet:

:::info
Note that currently, only 2 mechanisms are allowed per subnet; it is planned that this cap will be raised in the future.
:::

- Mechanism 0 (60%): 100 $\tau$  X .41 X .6 = 24.6
- Mechanism 1 (30%): 100 $\tau$ X  .41 X  .3 = 12.3
- Mechanism 2 (10%): 100 $\tau$ X .41 X  .1 = 4.1

:::info Setting Custom Proportions
To achieve the above distribution, the subnet owner would submit the `sudo_set_mechanism_emission_split` extrinsic with the vector `[39321, 19660, 6554]` (calculated as 60% × 65535, 30% × 65535, 10% × 65535).
:::

Note that a miner who excels in mechanism 0 but performs poorly in others might receive more emissions than a miner who performs moderately across all mechanisms, depending on the emission proportions and their relative performance.

## On-Chain Data Structure

Multiple incentive mechanisms extend the existing metagraph with additional columns:

```
UID | Hotkey | Stake | Mechanism 0 Weights | Mechanism 1 Weights | Mechanism 0 Incentive | Mechanism 1 Incentive
-----|--------|-------|---------------------|---------------------|----------------------|----------------------
123  | 5ABC...| 1000  | [0.3, 0.2, 0.1...] | [0.1, 0.4, 0.2...] | 0.05 τ               | 0.02 τ
456  | 7DEF...| 800   | [0.2, 0.3, 0.2...] | [0.2, 0.3, 0.1...] | 0.03 τ               | 0.04 τ
```

## Backward Compatibility

- Existing subnets continue with only one incentive mechanism (mechanism 0) collecting all emissions by default
- All existing API calls default to mechanism 0
- No breaking changes to current functionality
