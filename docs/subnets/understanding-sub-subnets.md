---
title: "Introducing Sub-Subnets"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Introducing Sub-Subnets

Historically, each subnet operates with a single **incentive mechanism**, a function that validators run to assign weights to miners based on the value of their work. The **Sub-Subnets** feature allows a subnet creator to apportion the subnet's emissions across multiple **sub-subnets**, each of which runs Yuma Consensus *independently* to evaluate the miners' performance on each of a number of distinct tasks. 

Each miner and validator receives emissions separately within each sub-subnet, so a miner's performance within one sub-subnet does not effect their rating in another, and their emissions for each epoch are summed across the sub-subnets. Sub-subnets don't change the total emissions to a subnet, but create a way for subnet crators to distribute those emissions to miners working on different tasks. This mechanism afford subnet creators a transparent, on-chain way to exercise fine-grained control over the work they are incentivizing, keeping miner effort focused on work that is most needed at a time.

Each sub-subnet has its own:

- **Weight matrix**: Each validator sets weights for each miner on each of the subnet's sub-subnets.
- **Independent emissions**: Since they depend on weights set by validators, a miner's emissions in each sub-subnet are independent.
- **Configurable emission distribution**: Subnet creators control what percentage of total emissions goes to each sub-subnet.
- **Transparent on-chain data**: All sub-subnet configurations and the flow of emissions are visible on-chain.

:::info Key Insights

1. **Same Validators, Same Stake**: All validators participate in all sub-subnets with identical stake weights.
2. **Same Miners**: All registered miners can participate in any or all sub-subnets.
3. **Owner-Controlled Proportions**: The holder of the *subnet creator* key sets the emission distribution among sub-subnets.
4. **Separate Yuma Consensus**: Each sub-subnet runs its own consensus to determine miner rankings.
:::


## What Should Stakers Know?

**Core Impact:**
- **No change to your staking mechanics**: Your stake weight remains identical across all sub-subnets within a subnet. The same validators, same stake, same neurons participate in all sub-subnets.
- **Same total emissions**: The subnet's total emissions remain unchanged - sub-subnets only redistribute these emissions internally.
- **Transparent allocation**: All emission proportions are visible on-chain, so you can see exactly how subnet owners are distributing emissions.

**What You'll See in Interfaces:**
- **Default view**: Most dashboards will likely show aggregated data by default, hiding sub-subnet complexity
- **Optional detail**: You can opt-in to see sub-subnet breakdowns if you want more granular information
- **New CLI commands**: Commands like `btcli subnet sub-subnets` will show detailed sub-subnet performance data
- **JSON output**: Use `--json` flags to export data for analysis, visualization, or Excel spreadsheets

**Critical Risks to Monitor:**
- **Owner manipulation**: Subnet owners can set extreme proportions (e.g., 1% to sub-subnet 0, 99% to sub-subnet 1) and capture most emissions if they're the only validator participating in that sub-subnet
- **Validator abandonment**: If validators "bail on" certain sub-subnets, the remaining validators get disproportionate influence
- **Lack of transparency**: Watch for subnets that don't clearly document their sub-subnet structure and emission allocation

**Due Diligence Questions:**
- How are emissions distributed across sub-subnets? (Look for balanced, logical distributions)
- Are all validators participating in all sub-subnets? (Check for validator participation patterns)
- Is the sub-subnet structure clearly documented and justified?
- Are emission proportions reasonable given the subnet's stated goals?

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
- **Separate Yuma consensus**: Each sub-subnet runs its the consensus algorithm independently to determine rankings.
- **Same stake weight**: Your stake weight is identical across all sub-subnets - no additional stake required.

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
- **Emission distribution**: You control what percentage of total emissions goes to each sub-subnet
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

- **Sub-subnet 0**: Text generation (60% of emissions)
- **Sub-subnet 1**: Image classification (30% of emissions)  
- **Sub-subnet 2**: Code completion (10% of emissions)

Validators would:
- Set weights for each miner across all three sub-subnets
- Evaluate performance separately for each task type
- Allow miners to specialize or participate in multiple sub-subnets



### Example Calculation

For a subnet receiving 100 TAO in emissions:
- Sub-subnet 0 (60%): 60 TAO distributed among miners based on their performance
- Sub-subnet 1 (30%): 30 TAO distributed among miners based on their performance  
- Sub-subnet 2 (10%): 10 TAO distributed among miners based on their performance

A miner who excels in sub-subnet 0 but performs poorly in others might receive more emissions than a miner who performs moderately across all sub-subnets.

## Technical Implementation

### On-Chain Data Structure

Sub-subnets extend the existing metagraph with additional columns:

```
UID | Hotkey | Stake | Sub-subnet 0 Weights | Sub-subnet 1 Weights | Sub-subnet 0 Incentive | Sub-subnet 1 Incentive
-----|--------|-------|---------------------|---------------------|----------------------|----------------------
123  | 5ABC...| 1000  | [0.3, 0.2, 0.1...] | [0.1, 0.4, 0.2...] | 0.05 τ               | 0.02 τ
456  | 7DEF...| 800   | [0.2, 0.3, 0.2...] | [0.2, 0.3, 0.1...] | 0.03 τ               | 0.04 τ
```

### API Changes

New extrinsics and queries support sub-subnet operations:

- `set_weights_sub_subnet(netuid, uids, weights, sub_subnet)`
- `get_sub_subnet_incentives(netuid, sub_subnet)`
- `get_sub_subnet_weights(netuid, sub_subnet)`

### Backward Compatibility

- Existing subnets continue to work as sub-subnet 0
- All existing API calls default to sub-subnet 0
- No breaking changes to current functionality

## Best Practices

### For Subnet Owners

1. **Start simple**: Begin with 2-3 sub-subnets rather than many
2. **Clear differentiation**: Ensure each sub-subnet has distinct, measurable criteria
3. **Balanced proportions**: Avoid extreme emission distributions (e.g., 95%/5%)
4. **Documentation**: Clearly explain each sub-subnet's purpose and evaluation criteria
5. **Community input**: Consider feedback from miners and validators on sub-subnet design

### For All Participants

1. **Monitor performance**: Track your performance across all relevant sub-subnets
2. **Understand proportions**: Know how emissions are distributed across sub-subnets
3. **Stay informed**: Keep up with subnet owner communications about sub-subnet changes
4. **Optimize strategy**: Adjust your participation based on sub-subnet performance and emission proportions

## Future Considerations

Sub-subnets represent a significant evolution in Bittensor's subnet architecture. As the feature matures, we may see:

- **Advanced analytics**: Tools for tracking performance across sub-subnets
- **Dynamic proportions**: Ability to adjust emission distributions based on performance
- **Cross-sub-subnet incentives**: Mechanisms to reward participation across multiple sub-subnets
- **Specialized interfaces**: Tailored UIs for different participant types

## Getting Started

If you're interested in sub-subnets:

1. **For subnet owners**: Review your incentive mechanism and consider how it could benefit from multiple competitions
2. **For miners**: Monitor subnets that implement sub-subnets and understand their structure
3. **For validators**: Prepare to evaluate miners across multiple criteria within the same subnet
4. **For stakers**: Look for subnets with well-designed sub-subnet structures that align with your investment goals

Sub-subnets enable more sophisticated and transparent incentive mechanisms while maintaining the core principles of decentralization and fair competition that make Bittensor unique.
