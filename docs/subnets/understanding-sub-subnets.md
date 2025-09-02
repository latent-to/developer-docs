---
title: "Introducing Sub-Subnets"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Introducing Sub-Subnets

The Sub-Subnets feature allows a subnet creator to apportion the subnet's emissions across multiple **sub-subnets**, each of which runs Yuma Consensus independently to evaluate the miners' performance on each of a number of distinct tasks. Each miner and validator receives emissions separately within each sub-subnet, so a miner's performance within one sub-subnet does not effect their rating in another, and their emissions for each epoch are summed across the sub-subnets.

This mechanism afford subnet creators a transparent, on-chain way to exercise fine-grained control over the work they are incentivizing, keeping miner effort focused on work that is most needed at a time.

Historically, each subnet operates with a single incentive mechanism, a single function that validators run to assign weights to miners based on the value of their work. Sub-Subnets extend this by allowing subnet owners to divide their subnet's emissions across multiple incentive mechanisms (sub-subnets). Each sub-subnet has its own:

- **Weight setting**: Validators set weights for each miners on the subnet's sub-subnets.
- **Independent incentive tracking**: Each sub-subnet tracks miner performance separately
- **Configurable emission distribution**: Subnet owners control what percentage of total emissions goes to each sub-subnet.
- **Transparent on-chain data**: All sub-subnet configurations and the flow of emissions are visible on-chain.

:::info Key Insights

1. **Same Validators, Same Stake**: All validators participate in all sub-subnets with identical stake weights
2. **Same Miners**: All registered miners can participate in any or all sub-subnets
3. **Owner-Controlled Proportions**: Subnet owners set emission distribution percentages
4. **Separate Yuma Consensus**: Each sub-subnet runs its own consensus to determine miner rankings
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
- **Same stake weight**: Your stake weight is identical across all sub-subnets

**Performance Tracking:**
- **Independent scoring**: Your performance in sub-subnet 0 doesn't affect your rating in sub-subnet 1
- **Separate incentive columns**: You'll see individual incentive amounts for each sub-subnet in metagraph data
- **Cumulative emissions**: Your total emissions = sum of emissions from all sub-subnets you participate in
- **Two-dimensional data**: Incentive data becomes `[uid][sub_subnet]` instead of just `[uid]`

**Strategic Options:**

**1. Specialization Strategy:**
- Focus entirely on sub-subnets where you excel
- Example: If you're great at text generation but poor at image classification, focus on the text generation sub-subnet
- Risk: If that sub-subnet has low emission allocation, you'll earn less overall

**2. Diversification Strategy:**
- Participate in multiple sub-subnets to spread risk
- Example: Moderate performance across all sub-subnets might yield higher total emissions than excellent performance in one low-allocation sub-subnet
- Benefit: Reduces risk of earning zero if you perform poorly in your specialty

**3. Collaboration Strategy:**
- Partner with other miners to cover different sub-subnets on the same UID
- Example: "I'll mine sub-subnet 3 (text), you mine sub-subnet 5 (images), we share the UID"
- Benefit: Higher total emissions and reduced registration risk
- Risk: Requires trust and coordination with your partner

**Critical Considerations:**
- **Emission dilution**: If you only participate in low-proportion sub-subnets, your total emissions will be capped
- **Registration risk**: Poor performance across all sub-subnets increases your risk of being deregistered
- **Competition dynamics**: Other miners might specialize, making generalist strategies less effective

**What You'll See in Tools:**
- **CLI tables**: Separate columns for each sub-subnet's incentives
- **JSON output**: Structured data for scripting and analysis
- **Dashboard views**: Performance tracking across all sub-subnets
- **Hotkey-specific views**: See performance for all your miners across sub-subnets

**Example Scenarios:**

**Scenario 1: High-Performance Specialist**
- Excels at sub-subnet 0 (60% emissions)
- Poor at sub-subnet 1 (30% emissions) and sub-subnet 2 (10% emissions)
- Strategy: Focus entirely on sub-subnet 0, ignore others
- Result: High emissions from 60% allocation, zero from others

**Scenario 2: Balanced Generalist**
- Moderate performance across all sub-subnets
- Strategy: Participate in all sub-subnets
- Result: Steady emissions from all allocations, lower risk

**Scenario 3: Collaborative Partnership**
- Partner A: Excels at sub-subnet 0, poor at others
- Partner B: Excels at sub-subnet 1, poor at others
- Strategy: Share UID, each focuses on their specialty
- Result: High total emissions, reduced individual risk

## What Should Validators Know?

**Core Responsibilities:**
- **Separate weight setting**: You must set weights independently for each sub-subnet using separate extrinsics
- **Same stake weight**: Your stake weight is identical across all sub-subnets - no additional stake required
- **Independent evaluation**: Each sub-subnet requires separate assessment according to its specific criteria
- **Separate Yuma consensus**: Each sub-subnet runs its own consensus algorithm to determine final rankings

**Technical Implementation:**

**New Extrinsics:**
```python
# Old way (still works for sub-subnet 0)
subnet.set_weights(
    netuid=subnet_id,
    uids=[1, 2, 3, 4, 5],
    weights=[0.3, 0.2, 0.2, 0.2, 0.1]
    # Defaults to sub-subnet 0
)

# New way (explicit sub-subnet parameter)
subnet.set_weights_sub_subnet(
    netuid=subnet_id,
    uids=[1, 2, 3, 4, 5],
    weights=[0.3, 0.2, 0.2, 0.2, 0.1],
    sub_subnet=0  # Text generation sub-subnet
)

subnet.set_weights_sub_subnet(
    netuid=subnet_id,
    uids=[1, 2, 3, 4, 5],
    weights=[0.1, 0.4, 0.3, 0.1, 0.1],
    sub_subnet=1  # Image classification sub-subnet
)
```

**Critical Operational Changes:**

**1. Evaluation Workload:**
- **Multiple assessments**: You must evaluate miners separately for each sub-subnet's tasks
- **Different criteria**: Each sub-subnet may have distinct evaluation standards
- **Increased complexity**: More weight-setting calls and evaluation logic

**2. Data Structure Changes:**
- **Two-dimensional weights**: Weight data becomes `[validator][uid][sub_subnet]`
- **Separate incentive tracking**: Each sub-subnet tracks incentives independently
- **Extended metagraph**: New columns for sub-subnet weights and incentives

**3. API Changes:**
- **New queries**: `get_sub_subnet_weights()`, `get_sub_subnet_incentives()`
- **Backward compatibility**: Existing calls default to sub-subnet 0
- **Metagraph extensions**: Additional data fields for sub-subnet information

**Strategic Considerations:**

**Participation Decisions:**
- **All or nothing**: You participate in all sub-subnets with the same stake weight
- **No selective participation**: Cannot choose to only validate certain sub-subnets
- **Consistent standards**: Must maintain evaluation quality across all sub-subnets

**Risk Management:**
- **Validator abandonment**: If you "bail on" certain sub-subnets, remaining validators get disproportionate influence
- **Owner manipulation**: Subnet owners can set extreme proportions and capture most emissions if they're the only active validator
- **Community oversight**: Your weight-setting decisions are more visible and scrutinized

**Best Practices:**

**1. Consistent Evaluation:**
- Maintain the same evaluation standards across all sub-subnets
- Don't favor specific sub-subnets unless justified by performance
- Document your evaluation criteria for transparency

**2. Operational Efficiency:**
- Develop scripts to set weights across multiple sub-subnets efficiently
- Monitor performance across all sub-subnets to maintain quality
- Use JSON output for data analysis and visualization

**3. Community Engagement:**
- Participate actively in all sub-subnets to prevent owner manipulation
- Provide feedback to subnet owners on sub-subnet design
- Maintain transparency in your weight-setting decisions

**What You'll See in Tools:**
- **Extended CLI tables**: Separate columns for each sub-subnet's weights and incentives
- **New commands**: `btcli subnet sub-subnets` for detailed sub-subnet data
- **JSON export**: Structured data for analysis and monitoring
- **Dashboard views**: Performance tracking across all sub-subnets

**Potential Issues to Watch:**
- **Metagraph data**: Ensure sub-subnet information is included in metagraph calls (this was flagged as missing in Greg's PR)
- **API consistency**: All tools (CLI, SDK, dashboards) must handle sub-subnets consistently
- **Performance impact**: Additional weight-setting calls may increase operational overhead

## What Should Subnet Creators/Developers Know?

**Core Control and Responsibility:**
- **Emission distribution**: You control what percentage of total emissions goes to each sub-subnet
- **Incentive mechanism design**: You define the specific tasks and evaluation criteria for each sub-subnet
- **Transparent configuration**: All sub-subnet settings are visible on-chain for community oversight
- **Single subnet slot**: No need to register multiple subnets for multiple competitions

**Technical Implementation:**

**Emission Proportion Configuration:**
```python
# Subnet configuration - emission proportions must sum to 100%
sub_subnets = {
    0: {
        "name": "Text Generation",
        "emission_proportion": 0.60,  # 60% of total emissions
        "description": "Evaluate text completion quality"
    },
    1: {
        "name": "Image Classification", 
        "emission_proportion": 0.30,  # 30% of total emissions
        "description": "Evaluate image recognition accuracy"
    },
    2: {
        "name": "Code Completion",
        "emission_proportion": 0.10,  # 10% of total emissions
        "description": "Evaluate code generation quality"
    }
}
```

**Hyperparameters and Configuration:**
- **Precision**: Use 64-bit integers for emission proportions to avoid chunky rounding with small percentages
- **Validation**: Ensure proportions sum to 100% (or equivalent in your chosen representation)
- **Flexibility**: Design for future expansion (the discussion mentioned potential for up to 16 sub-subnets)

**Critical Design Considerations:**

**1. Balanced Distribution:**
- **Avoid extreme allocations**: Don't set 1% to sub-subnet 0 and 99% to sub-subnet 1
- **Justify proportions**: Ensure emission allocations make sense for your subnet's goals
- **Community feedback**: Consider input from miners and validators on sub-subnet design

**2. Clear Task Differentiation:**
- **Distinct criteria**: Each sub-subnet should have clearly different, measurable tasks
- **Independent evaluation**: Validators should be able to assess performance separately for each sub-subnet
- **Documentation**: Clearly explain what each sub-subnet evaluates and how

**3. Transparency Requirements:**
- **On-chain visibility**: All configurations must be visible on-chain
- **Clear communication**: Document your sub-subnet structure and rationale
- **Community oversight**: Expect scrutiny of your emission distribution decisions

**Implementation Steps:**

**1. Design Phase:**
- Define what different tasks/competitions you want to incentivize
- Determine logical emission proportions based on importance/effort
- Design evaluation criteria for each sub-subnet

**2. Technical Setup:**
- Configure emission proportions (must sum to 100%)
- Update your incentive mechanism code to handle multiple sub-subnets
- Ensure validators understand evaluation criteria for each sub-subnet

**3. Community Engagement:**
- Communicate your sub-subnet design to participants
- Gather feedback from miners and validators
- Document your rationale for emission distribution

**Benefits Over Multiple Subnets:**

**Historical Problem Solved:**
- **Subnet 9 example**: Previously had to implement 60%/30%/10% split client-side with no on-chain transparency
- **Multiple subnet slots**: Avoided occupying multiple subnet slots for multiple competitions
- **Complex registration**: Eliminated confusion about which UID to register for which competition

**New Advantages:**
- **Single subnet slot**: Use one subnet slot instead of multiple
- **Shared infrastructure**: Same validators and stake across all competitions
- **Transparent attribution**: Clear on-chain visibility of which miners perform best in which competitions
- **Simplified management**: One subnet to manage instead of multiple
- **Better UX**: No need to "watch one hour presentation on how to configure sub-subnets"

**Risk Management:**

**Potential Abuse Scenarios:**
- **Owner manipulation**: You could set extreme proportions (e.g., 1%/99%) and capture most emissions if you're the only active validator
- **Validator abandonment**: If validators "bail on" certain sub-subnets, remaining validators get disproportionate influence

**Mitigation Strategies:**
- **Community oversight**: Expect "burn code" if you abuse the system
- **Transparency**: All configurations are visible on-chain
- **Documentation**: Clear communication about your sub-subnet design
- **Balanced design**: Create fair, logical emission distributions

**What You'll Need to Update:**

**1. Incentive Mechanism Code:**
- Handle multiple sub-subnet evaluations
- Provide clear criteria for each sub-subnet
- Ensure validators can assess performance separately

**2. Documentation:**
- Explain your sub-subnet structure
- Document evaluation criteria for each sub-subnet
- Provide guidance for miners and validators

**3. Community Communication:**
- Announce your sub-subnet design
- Explain your rationale for emission distribution
- Gather feedback from participants

**Future Considerations:**
- **Scalability**: Design for potential expansion to more sub-subnets
- **Dynamic proportions**: Consider whether emission distributions should be adjustable
- **Cross-sub-subnet incentives**: Potential mechanisms to reward participation across multiple sub-subnets

## Economic Implications
### Example: Multi-Task Subnet

Consider a subnet focused on AI tasks that wants to evaluate three different capabilities:

- **Sub-subnet 0**: Text generation (60% of emissions)
- **Sub-subnet 1**: Image classification (30% of emissions)  
- **Sub-subnet 2**: Code completion (10% of emissions)

Validators would:
- Set weights for each miner across all three sub-subnets
- Evaluate performance separately for each task type
- Allow miners to specialize or participate in multiple sub-subnets

### Emission Distribution

Sub-subnets don't change the total emissions to a subnet. Instead, they redistribute those emissions based on:

1. **Owner-defined proportions**: How much of total emissions each sub-subnet receives
2. **Miner performance**: How well miners perform within each sub-subnet
3. **Validator weights**: How validators score miners in each sub-subnet

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
