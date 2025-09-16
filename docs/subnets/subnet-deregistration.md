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
The subnet to deregister is the subnet with lowest EMA (Exponential Moving Average) price among non-immune subnets.

Source code: [`get_network_to_prune()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L753-795)

The subnet price EMA uses the standard EMA formula:
$$
\mathrm{EMA}^{(t)} = \alpha \times \mathrm{current\_price} + (1 - \alpha) \times \mathrm{EMA}^{(t-1)}
$$

Where $\alpha$ is calculated dynamically based on subnet age:
$$
\alpha = \frac{\mathrm{base\_alpha} \times \mathrm{blocks\_since\_start}}{\mathrm{blocks\_since\_start} + \mathrm{halving\_blocks}}
$$

- **base_alpha**: ~0.0003 for Bittensor mainnet ("finney")
- **blocks_since_start**: Number of blocks since subnet registration
- **halving_blocks**: Halving period for the subnet

This EMA value is recalculated for the subnet each time the coinbase function runs.

See also:
- [Navigating Subtensor Codebase: Coinbase Implementation](../navigating-subtensor/emissions-coinbase)
- [Exponential Moving Averages (EMAs) in Bittensor](../learn/ema.md).


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

## Token Liquidation

When a subnet is deregistered, all ALPHA tokens in that subnet are liquidated and the subnet's TAO pool is distributed to ALPHA holders and to refunding the subnet owner for their lock cost minus the emissions they've received. This process is implemented in the [`destroy_alpha_in_out_stakes()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/remove_stake.rs#L444-623) function.

### Liquidation Steps

1. **Dissolve Liquidity Pools**: All liquidity pools in the subnet's AMM pools are dissolved
2. **Calculate Owner Refund**: The subnet owner's refund is calculated as:
   ```
   refund = max(0, lock_cost - owner_received_emission_in_tao)
   ```
   Where `owner_received_emission_in_tao` is the TAO value of the owner's cut of all emissions received during the subnet's lifetime.

3. **Enumerate ALPHA Holders**: All ALPHA token holders and their stake amounts are collected

4. **Extract TAO Pool**: The subnet's TAO pool (`SubnetTAO`) is extracted for distribution

5. **Pro-Rata Distribution**: TAO is distributed proportionally to ALPHA holders using the largest-remainder method:
   - Each holder receives: `(holder_alpha_value / total_alpha_value) * pool_tao`
   - TAO is credited directly to each holder's coldkey free balance

6. **Cleanup**: All ALPHA-related storage is removed:
   - All `Alpha` entries for the subnet
   - `TotalHotkeyAlpha` and `TotalHotkeyShares` for each hotkey
   - `SubnetAlphaIn`, `SubnetAlphaInProvided`, `SubnetAlphaOut` counters

### Key Implementation Details

- **Source Code**: [`destroy_alpha_in_out_stakes()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/remove_stake.rs#L444-623)
- **Called From**: [`prune_network()`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L377)
- **Distribution Method**: Largest-remainder for fair rounding
- **Owner Protection**: Owner gets refund minus emissions already received
- **Immediate Effect**: All ALPHA tokens are destroyed and cannot be recovered

This liquidation mechanism ensures that when a subnet is deregistered, ALPHA holders are fairly compensated with the subnet's TAO pool, while the subnet owner receives their remaining lock cost after accounting for emissions already received.
