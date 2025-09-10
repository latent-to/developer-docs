---
title: "Announcements and Developments"
---
# Announcements and Developments

This page tracks recent and upcoming changes to the Bittensor protocol and other major events in the Bittensor ecosystem.


## Sub-Subnets (Major Feature Launch)

**Status**: Ready for deployment on September 12, 2025
- **What**: Sub-subnets allow subnet owners to apportion emissions across multiple sub-subnets, each running Yuma Consensus independently
- **Key Features**:
  - Enables up to 8 sub-subnets (IDs 0-7) within each main subnet for multi-task validation
  - Fully backward-compatible with existing miners and validators via sub-subnet ID 0
  - Each sub-subnet has its own weight matrix and independent emissions
  - All validators participate in all sub-subnets with identical stake weights
  - Miners automatically participate in ALL sub-subnets when registering for a subnet
  - Emissions are divided evenly, but subnet owners can configure proportions.
  - First version focuses on core functionality with additional features planned based on community feedback

## Hyperparameter Rate Limiting
**Status**: WIP
- **What**: Prevents subnet owners from changing hyperparameters too frequently
- **Rules**: Cannot change hyperparameters in last 10 blocks of a tempo
- **Purpose**: Prevent exploitation where subnet owners kick off root validators to take full incentives
- **Implementation**: Applies 7,200-block rate limit to prevent subnet owner exploitation

## Child Key Fee

A percentage fee will be deducted from emissions bound to validator hotkeys through a *child hotkey* relationship. This is designed to more highly incentivize validators who perform validation work, over child-key-only validators. It is being gradually rolled out to reduce surprise for the community and allow validators to adjust.

**Status**: Implemented (Merged)
- **Plan**: 
  - Start at 1% (September 10)
  - 30-day delay
  - Increase by 1% per day for 17 days
  - Final rate: 18%

## Changes to the Subnet Registration/Deregistration Process

**Status**: Ready for deployment on September 16, 2025
- **Key Changes**:
  - Subnet limit remains at 128 initially with no new registrations available immediately
  - Immunity period reduced from 6 months to 4 months from registration block
  - Network rate limit increased to 3 days (from 2 days) between registrations
  - Initial lock cost set at 1,000 TAO with standard linear decay mechanism
  - First deregistrations available approximately September 23 (one week after deployment)

## Auto-Staking for Miners
**Status**: Implemented (Merged)
- **What**: Miners can automatically stake their mining income to a validator of their choice
- **Implementation**: 
  - New extrinsics `set_coldkey_auto_stake_hotkey` and `get_coldkey_auto_stake_hotkey`
  - Set per coldkey, affects all miner hotkeys
  - No transaction fees required
  - Reduces sell pressure by allowing automatic delegation of mining rewards
  - Event emission system being added to distinguish mining vs staking rewards for proper accounting
  - Requires CLI support for configuration and management

## Registration Fee Controls
**Status**: Deployed
- **What**: Subnet owners can configure neuron registration fees
- **Implementation**:
  - Subnet owners can configure neuron registration fees between 0.1 and 1 TAO
