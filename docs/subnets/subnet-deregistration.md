---
title: "Subnet Deregistration"
---

# Subnet Deregistration

This page provides documents the process by which subnets can become deregistered from Bittensor network, with an eye to the implementation of the functionality in the Subtensor codebase that makes up Bittensor's blockchain layer.

See also [Learn Bittensor: Subnet Deregistration](https://learnbittensor.org/concepts/dynamic-tao/subnet-deregistration)

Subnet deregistration is a critical mechanism that manages the lifecycle of subnets within the Bittensor network. It ensures network quality by removing underperforming subnets, clearing room for new subnet registrations within the 128 subnet limit.

Subnet deregistration addresses critical network efficiency issues:
- Removes underperforming subnets that consume TAO emissions without providing value.
- Unlocks TAO resources locked in underperforming subnet pools

| Parameter | Value | Description |
|-----------|-------|-------------|
| **Subnet Limit** | 128 | Maximum number of active subnets |
| **Immunity Period** | 4 months | Protection period from subnet deregistration
| **Rate Limiting** | 3 days (7200 blocks) | Minimum time between registrations/deregistrations |

## The Automated Deregistration Process

### Trigger

The process begins when the subnet limit is reached and a new subnet attempts to register.

Source: [`do_register_network()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/subnet.rs#L146-158)

### Selection Criteria
The subnet to deregister is the subnet with lowest EMA (Exponential Moving Average) price among non-immune subnets. For detailed information about EMA calculations and the mathematical formulas used, see [Exponential Moving Averages (EMAs) in Bittensor](../learn/ema.md).

Source code: [`get_network_to_prune()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L753-795)

### Immunity Protection
Network immunity period is currently 4 months from registration block.
  - Formula: `current_block < registered_at + network_immunity_period`
  - Source code: [Immunity check](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L768-770)
### Rate Limiting
Deregistration can occur at most every once every 3 days (coordinated with registration rate).
  - Block-based timing: 7200 blocks ≈ 3 days at 12s/block
  - [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L27)




## Special Cases and Edge Conditions

### All Subnets Immune
If all subnets are still within their immunity period, the system will:
1. Return `None` from [`get_network_to_prune()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L753-795)
2. Registration fails with `SubnetLimitReached` error
3. No subnet is deregistered until at least one becomes eligible

### Tied EMA Prices
When multiple subnets have identical EMA prices:
1. Select the subnet with the earliest registration timestamp
2. Implementation: [Tie-breaking logic](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L774-781)
3. Only applies to subnets outside their immunity period
4. If all subnets are immune, no subnet is selected for deregistration
