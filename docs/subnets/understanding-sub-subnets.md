---
title: "Introducing Sub-Subnets"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Introducing Sub-Subnets

Historically, each subnet operates with a single **incentive mechanism**, a function that validators run to assign weights to miners based on the value of their work. The **Sub-Subnets** feature allows a subnet creator to apportion the subnet's emissions across multiple **sub-subnets**, each of which runs Yuma Consensus *independently* to evaluate the miners' performance on each of a number of distinct tasks. 

Each miner receives emissions separately within each sub-subnet, so a miner's performance within one sub-subnet does not affect their rating in another, and their emissions for each epoch are summed across the sub-subnets. Validators receive dividends as a weighted sum of their performance across all sub-subnets - they cannot choose which sub-subnets to validate, and if they don't validate all sub-subnets, they receive proportionally reduced emissions. Sub-subnets don't change the total emissions to a subnet, but create a way for subnet creators to distribute those emissions to miners working on different tasks. This mechanism affords subnet creators a transparent, on-chain way to exercise fine-grained control over the work they are incentivizing, keeping miner effort focused on work that is most needed at a time.

Each sub-subnet has its own:

- **Weight matrix**: Each validator sets weights for each miner on each of the subnet's sub-subnets.
- **Independent emissions**: Since they depend on weights set by validators, a miner's emissions in each sub-subnet are independent.
- **Transparent on-chain data**: All sub-subnet configurations and the flow of emissions are visible on-chain.
- **Emission distribution**: Currently emissions are evenly distributed, but it is planned that subnet creators will control what percentage of total emissions goes to each sub-subnet.



### Takeaways

1. **Same Validators, Same Stake**: All validators participate in all sub-subnets with identical stake weights.
2. **Same Miners**: All registered miners can participate in any or all sub-subnets.
3. **Owner-Controlled Proportions**: The holder of the *subnet creator* key will set the emission distribution among sub-subnets. 
<!-- CHeck release state of above feature!!! -->
4. **Separate Yuma Consensus**: Each sub-subnet runs its own consensus to determine miner rankings.


## What Should Stakers Know?

**Core Impact:**
- **No change to your staking mechanics**: Your stake weight remains identical across all sub-subnets within a subnet. The same validators, same stake, same neurons participate in all sub-subnets.
- **Same total emissions**: The subnet's total emissions remain unchanged - sub-subnets only redistribute these emissions internally.
- **Transparent allocation**: All emission proportions are visible on-chain, so you can see exactly how subnet owners are distributing emissions.

**What This Means for Your Strategy:**
- **No immediate action required**: Your existing staking strategy doesn't need to change
- **Enhanced monitoring**: You may want to track sub-subnet performance to understand subnet health
- **Risk assessment**: Factor in sub-subnet design when evaluating subnet quality
- **Community oversight**: Use transparency to hold subnet owners accountable for fair emission distribution

## What Should Miners Know?

**Automatic Participation:**
- **No separate registration**: When you register for a subnet, you automatically participate in ALL its sub-subnets
- **Same UID across all sub-subnets**: You use the same UID for all sub-subnets within a subnet

**Performance Tracking:**
- **Independent scoring**: Your performance is independent in different subnets, e.g. sub-subnet 0 doesn't affect your rating in sub-subnet 1.
- **Separate incentive columns**: You'll see individual incentive amounts for each sub-subnet in metagraph data.
- **Cumulative emissions**: Your total emissions = sum of emissions from all sub-subnets where you participate.

## What Should Validators Know?

### Core Changes

- **Separate weight setting**: You must set weights independently for each sub-subnet.
- **Independent evaluation**: Each sub-subnet requires separate assessment according to its specific criteria.
- **Separate Yuma Consensus**: Each sub-subnet runs its consensus algorithm independently to determine rankings.
- **Same stake weight**: Your stake weight is identical across all sub-subnets - no additional stake required.
- **Weighted dividend calculation**: Your dividends are calculated as a weighted sum of your performance across all sub-subnets. If you don't validate on all sub-subnets, you receive proportionally reduced emissions (e.g., if you validate 1 out of 8 sub-subnets, you receive 1/8 of your potential emissions).

### Operational Changes


**1. Evaluation Workload:**
- **Multiple assessments**: You must evaluate miners separately for each sub-subnet's tasks
- **Different criteria**: Each sub-subnet may have distinct evaluation standards

**2. Data Structure Changes:**
- **Two-dimensional weights**: Weight data becomes `[validator][uid][sub_subnet]`
- **Separate incentive tracking**: Each sub-subnet tracks incentives independently
- **Extended metagraph**: New columns for sub-subnet weights and incentives

### API Changes

???


### Best Practices

???

## What Should Subnet Creators/Developers Know?

### Core Changes
- **Emission distribution**: Currently, emissions are divided evenly between subnets; In the planned release state, you will control what percentage of total emissions goes to each sub-subnet.

    :::info
    Currently, emissions are divided evenly between sub-subnets; In the planned release state, you will control what percentage of total emissions goes to each sub-subnet (planned feature).
    :::
- **Incentive mechanism design**: You define the specific tasks and evaluation criteria for each sub-subnet
- **Transparent configuration**: All sub-subnet settings are visible on-chain for community oversight
- **Single subnet slot**: No need to register multiple subnets for multiple competitions


### Hyperparameters and Configuration
- **Precision**: Use 64-bit integers for emission proportions to avoid chunky rounding with small percentages
- **Validation**: Ensure proportions sum to 100% (or equivalent in your chosen representation)
- **Flexibility**: Design for future expansion (the discussion mentioned potential for up to 16 sub-subnets)

### Design Considerations and Best Practices

???

### Implementating Sub-Subnets in your Subnet


## Example: Multi-Task Subnet

Consider a subnet focused on AI tasks that wants to evaluate three different capabilities:

- **Sub-subnet 0**: Text generation (60% of emissions to miners and validators)
- **Sub-subnet 1**: Image classification (30% of emissions to miners and validators)  
- **Sub-subnet 2**: Code completion (10% of emissions to miners and validators)

:::info
See [Emissions](../emissions) for the breakdown of emissions between miners, validators, stakers, and subnet creators.
:::
Validators would:
- Set weights for each miner across all three sub-subnets
- Evaluate performance separately for each task type
- Allow miners to specialize or participate in multiple sub-subnets


### Example Calculation

For each subnet, the subnet creator keeps 18% of emissions, 41% is allocated to miners, and 41% to validators and their stakers, unless the subnet creator has reduced their take. Of the 41% that goes to miners and validators, here is an estimated emission distribution across three sub-subnets for each 100 $\tau$ earned on the subnet:
- Sub-subnet 0 (60%): 100 $\tau$ *.41 * .6 = 24.6
- Sub-subnet 1 (30%): 100 $\tau$ *.41 * .3 = 12.3
- Sub-subnet 2 (10%): 100 $\tau$ *.41 * .1 = 4.1



A miner who excels in sub-subnet 0 but performs poorly in others might receive more emissions than a miner who performs moderately across all sub-subnets, depending on the emission proportions and their relative performance.


## On-Chain Data Structure

Sub-subnets extend the existing metagraph with additional columns:

```
UID | Hotkey | Stake | Sub-subnet 0 Weights | Sub-subnet 1 Weights | Sub-subnet 0 Incentive | Sub-subnet 1 Incentive
-----|--------|-------|---------------------|---------------------|----------------------|----------------------
123  | 5ABC...| 1000  | [0.3, 0.2, 0.1...] | [0.1, 0.4, 0.2...] | 0.05 τ               | 0.02 τ
456  | 7DEF...| 800   | [0.2, 0.3, 0.2...] | [0.2, 0.3, 0.1...] | 0.03 τ               | 0.04 τ
```


## Backward Compatibility

- Existing subnets continue to work as sub-subnet 0
- All existing API calls default to sub-subnet 0
- No breaking changes to current functionality

