# Sub-Subnets Developer Meeting Transcript

## Overview
This transcript documents a developer meeting discussing the implementation and user experience design for Sub-Subnets, a new Bittensor feature that allows subnet owners to create multiple incentive mechanisms within a single subnet.

## Key Participants
- **Speaker 2**: Core developer working on Sub-Subnets implementation
- **Speaker 7**: Documentation team member
- **Speaker 9**: SDK/API developer

## What are Sub-Subnets?

### Core Concept
Sub-Subnets are a new feature that allows subnet owners to create multiple incentive mechanisms within a single subnet. Currently, each subnet has only one incentive mechanism (referred to as "sub-subnet zero"). With this feature, subnet owners can create additional sub-subnets, each with their own:

- Separate weight setting mechanisms
- Independent incentive distributions
- Configurable emission proportions

### Current State vs. New Feature

**Current State:**
- Each subnet has one incentive mechanism (sub-subnet 0)
- Validators set weights for all miners in the subnet
- All emissions go to a single incentive pool

**With Sub-Subnets:**
- Subnet owners can create multiple sub-subnets (0, 1, 2, etc.)
- Validators can set weights separately for each sub-subnet
- Emissions are distributed proportionally between sub-subnets based on owner configuration
- Each sub-subnet has its own incentive tracking

## Technical Implementation

### Registration and Participation
- **No separate registration required**: When you register for a subnet, you automatically participate in all its sub-subnets
- **Same validators, same stake**: All validators participate in all sub-subnets with the same stake weight
- **Same miners**: All registered miners can participate in any or all sub-subnets

### Emission Distribution
- **Owner-controlled proportions**: Subnet owners set the emission proportion for each sub-subnet (e.g., 60% to sub-subnet 0, 30% to sub-subnet 1, 10% to sub-subnet 2)
- **Transparent on-chain**: All emission proportions and incentives are visible on-chain
- **Separate incentive tracking**: Each sub-subnet tracks incentives independently

### Data Structure Changes
- **Metagraph extensions**: New columns for sub-subnet weights and incentives
- **Two-dimensional arrays**: Incentive data becomes `[uid][sub_subnet]` instead of just `[uid]`
- **Backward compatibility**: Existing subnets continue to work as sub-subnet 0

## Use Cases and Benefits

### Problem Solved
Previously, subnet owners who wanted multiple incentive mechanisms had to:
- Register multiple separate subnets
- Occupy multiple subnet slots
- Manage complex cross-subnet coordination
- Deal with unclear emission attribution

### Example: Subnet 9's Three Competitions
Subnet 9 previously had three separate competitions (60%, 30%, 10% split) but had to implement this client-side without on-chain transparency. With Sub-Subnets, they could:
- Create three sub-subnets within their single subnet
- Set emission proportions: 60% to sub-subnet 0, 30% to sub-subnet 1, 10% to sub-subnet 2
- Have full on-chain transparency of which miners perform best in which competitions

### Strategic Mining Opportunities
- **Specialized miners**: A miner good at one task can focus on that sub-subnet
- **Collaborative mining**: Two miners could share a UID, with one mining sub-subnet A and another mining sub-subnet B
- **Risk diversification**: Miners can participate in multiple sub-subnets to reduce registration risk

## User Experience Considerations

### CLI and Interface Design
**Challenges identified:**
- How to display multiple incentive columns in metagraph tables
- Scalability when there are many sub-subnets (e.g., 16 columns would be unwieldy)
- Different views needed for miners vs. stakers

**Proposed solutions:**
- **Separate command**: `btcli subnet sub-subnets` to show sub-subnet specific data
- **JSON output**: `--json` flag for scripting and visualization
- **User-specific views**: Show only relevant sub-subnets based on user's hotkeys
- **Collapsible interface**: Default to aggregated view with option to expand sub-subnet details

### Data Display Format
```
UID | Hotkey | Sub-subnet 0 Incentive | Sub-subnet 1 Incentive | Sub-subnet 2 Incentive
-----|--------|------------------------|------------------------|------------------------
123  | 5ABC...| 0.05 τ                | 0.02 τ                | 0.01 τ
456  | 7DEF...| 0.03 τ                | 0.04 τ                | 0.00 τ
```

### Stakeholder-Specific Views
- **Miners**: Want to see their performance across all sub-subnets
- **Stakers**: May want to hide sub-subnet complexity and see aggregated performance
- **Subnet owners**: Need full visibility into all sub-subnet configurations

## Technical Specifications

### Emission Proportion Configuration
- **Parameter type**: Considering 64-bit integers for precision with many sub-subnets
- **Precision**: Avoid chunky rounding with small percentages
- **Validation**: Ensure proportions sum to 100%

### API Changes Needed
- **Metagraph data**: Include sub-subnet weights and incentives
- **New extrinsics**: Separate weight-setting calls for each sub-subnet
- **Backward compatibility**: Existing weight-setting calls default to sub-subnet 0

### Implementation Status
- **Release timeline**: Feature was scheduled for imminent release (mentioned as "tomorrow" in meeting)
- **Testing**: Greg was working on test completion
- **Documentation**: Need to document the feature before release

## Potential Issues and Considerations

### Centralization Risks
- **Owner control**: Subnet owners have significant control over emission distribution
- **Transparency requirement**: All configurations must be visible on-chain
- **Community oversight**: Stakeholders can "run burn code" on misbehaving owners

### Economic Implications
- **Emission dilution**: Miners may see reduced emissions if they only participate in low-proportion sub-subnets
- **Competition dynamics**: Could lead to more specialized mining strategies
- **Stake distribution**: Same stake weight applies across all sub-subnets

### Technical Challenges
- **UI complexity**: Managing multiple incentive columns in interfaces
- **Data volume**: Increased on-chain data storage requirements
- **API consistency**: Ensuring all tools (CLI, SDK, dashboards) handle sub-subnets consistently

## Next Steps

### Immediate Actions
1. **Complete testing**: Finish test suite for the feature
2. **Update metagraph data**: Ensure sub-subnet information is included in metagraph calls
3. **Documentation**: Create user guides for subnet owners and participants
4. **CLI updates**: Implement sub-subnet display commands

### Future Considerations
1. **UI/UX refinement**: Develop intuitive interfaces for managing multiple sub-subnets
2. **Analytics tools**: Create dashboards for tracking sub-subnet performance
3. **Community feedback**: Gather user experience feedback after initial release
4. **Feature evolution**: Consider additional sub-subnet management features based on usage

## Conclusion

Sub-Subnets represent a significant evolution in Bittensor's subnet architecture, enabling more flexible and transparent incentive mechanisms within individual subnets. The feature addresses real needs from subnet owners while maintaining the core principles of decentralization and transparency. Success will depend on thoughtful UI/UX design and comprehensive documentation to ensure users can effectively utilize this new capability.
