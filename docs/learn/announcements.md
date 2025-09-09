---
title: "Announcements and Developments"
---
# Announcements and Developments

## Sub-Subnets (Major Feature Launch)
**Status**: Predicted deploy September 12, 2024 
- **What**: Sub-subnets allow subnet creators to apportion emissions across multiple sub-subnets, each running Yuma Consensus independently
- **Key Features**:
  - Each sub-subnet has its own weight matrix and independent emissions
  - All validators participate in all sub-subnets with identical stake weights
  - Miners automatically participate in ALL sub-subnets when registering for a subnet
  - Currently emissions are divided evenly, but subnet creators will control proportions in future
  - Maximum of 8 sub-subnets initially (can be increased to 16)
  - Two-step configuration: first set number of sub-subnets, then set proportions

## Hyperparameter Rate Limiting
**Status**: Predicted deploy September 12, 2024
- **What**: Prevents subnet owners from changing hyperparameters too frequently
- **Rules**: Cannot change hyperparameters in last 10 blocks of a tempo
- **Purpose**: Prevent exploitation where subnet owners kick off root validators to take full incentives

## Subnet Registration/Deregistration Process
**Status**: Predicted deploy September 16, 2024
- **Key Changes**:
  - Subnet limit remains at 128 (not increasing to 148 initially)
  - Immunity period reduced to 4 months (from 6 months)
  - Network rate limit increased to 3 days (from 2 days)
  - Lock cost starts at 1000 TAO, then decays linearly
  - One week delay before registrations become available after deployment

## Auto-Staking for Miners
**Status**: In development; deploy soon (TBD)
- **What**: Miners can automatically stake their mining income to a validator of their choice
- **Implementation**: 
  - New extrinsic `set_coldkey_auto_stake_hotkey` (call index 114)
  - Set per coldkey, affects all miner hotkeys
  - No transaction fees required

## Child Key Tax Implementation
**Status**: Gradual rollout TBD
- **Plan**: 
  - Start at 1% 
  - 30-day delay
  - Increase by 1% per day for 17 days
  - Final rate: 18%
  - Purpose: Incentivize hardware validation over child-key-only validators
