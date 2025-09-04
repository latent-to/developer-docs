---
title: "Navigating the Subtensor Codebase"
---


# Navigating the Subtensor Codebase

The heart of Bittensor is Subtensor, the L1 substrate blockchain that computes and records all transactions, as well as the internal tokenomic processes (Yuma Consensus and liquidity emission) that drive the system.

This section of the docs is designed make the codebase more accessible by guiding the reader through the implementation of these critical functions in code. Each implementation page traces the complete flow of operations from initial function calls through to final state changes.

We recommend reading our conceptual explainer docs before diving into the implementation details:

- [Emissions](../learn/emissions.md)
- [Yuma Consensus](../learn/yuma-consensus.md)
- [Staking/Delegation](../staking-and-delegation/delegation.md)

## Implementation Topics

This section covers the following implementation-focused topics:

### [Emissions and Coinbase](./emissions-coinbase.md)
Deep dive into the coinbase mechanism that drives TAO and alpha emissions across subnets. Learn how `run_coinbase()` calculates and distributes emissions, manages liquidity pools, and orchestrates the emission cycles of the subnets within the overall network by triggering their epochs.

**Key areas covered:**
- Block emission calculation and distribution
- TAO and alpha injection mechanics
- Subnet price-based emission allocation
- Pending emission accumulation and drainage
- Owner cuts and root dividends
- Triggering of the epoch

### [Epoch Mechanism](./epoch.md)
Comprehensive exploration of the epoch function that implements Yuma Consensus. Understand how validator weights are processed, consensus is computed, and emissions are allocated to participants.

**Key areas covered:**
- Weight processing and validation
- Consensus calculation and clipping
- Bond computation and EMA updates
- Rank, trust, and incentive calculations
- Emission distribution to miners and validators

### [Swap and Staking](./swap-stake.md)
Detailed examination of the staking and unstaking mechanisms, including the automated market maker (AMM) functionality that enables TAO ↔ alpha conversions.

**Key areas covered:**
- Stake addition and removal flows
- AMM price calculations
- TAO to alpha conversions
- Liquidity pool management
- Slippage and price protection

