---
title: "Subnet Deregistration"
---

This page details the process by which subnets can become deregistered from Bittensor network, with an eye to the implementation of the functionality in the Subtensor codebase that makes up Bittensor's blockchain layer.

See also [Learn Bittensor: Subnet Deregistration](https://learnbittensor.org/concepts/dynamic-tao/subnet-deregistration)

Subnet deregistration is a mechanism that manages the lifecycle of subnets within the Bittensor network. It ensures network quality by removing underperforming subnets, clearing room for new subnet registrations within the 128 subnet limit.

:::info Deployment Timeline
The subnet deregistration feature deployed on September 17, 2025, with a 7-day delay before the first registrations can occur.
:::

Subnet deregistration addresses network efficiency issues:

- Removes underperforming subnets that consume TAO emissions without providing value.
- Unlocks TAO resources locked in underperforming subnet pools

| Parameter           | Value                    | Description                                        |
| ------------------- | ------------------------ | -------------------------------------------------- |
| **Subnet Limit**    | 128                      | Maximum number of occupied subnet slots            |
| **Immunity Period** | 4 months (864000 blocks) | Protection period from subnet deregistration       |
| **Rate Limiting**   | 2 days (14400 blocks)    | Minimum time between registrations/deregistrations |

## The Automated Deregistration Process

### Trigger

The process begins when the subnet limit is reached and a new subnet attempts to register.

Source: [`do_register_network()`](https://github.com/RaoFoundation/subtensor/blob/main/pallets/subtensor/src/subnets/subnet.rs#L146-158)

### Selection Criteria

The subnet to deregister is the subnet with lowest EMA (Exponential Moving Average) price among non-immune subnets.

Source code: [`get_network_to_prune()`](https://github.com/RaoFoundation/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L753-795)

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
- Source code: [Immunity check](https://github.com/RaoFoundation/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L768-770)

### Rate Limiting

Deregistration can occur at most every once every 2 days (coordinated with registration rate).

- Block-based timing: 14400 blocks ≈ 2 days at 12s/block
- [Source code](https://github.com/RaoFoundation/subtensor/blob/main/pallets/subtensor/src/utils/rate_limiting.rs#L27)

See [Rate Limits in Bittensor](../learn/chain-rate-limits.md).

## Special Cases and Edge Conditions

### All Subnets Immune

If all subnets are still within their immunity period, the system will:

1. Return `None` from [`get_network_to_prune()`](https://github.com/RaoFoundation/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L753-795)
2. Registration fails with `SubnetLimitReached` error
3. No subnet is deregistered until at least one becomes eligible

### Tied EMA Prices

When multiple subnets have identical EMA prices:

1. Select the subnet with the earliest registration timestamp
2. Implementation: [Tie-breaking logic](https://github.com/RaoFoundation/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L774-781)

## Token Liquidation

When a subnet is deregistered, all alpha tokens in that subnet are swapped back to TAO and distributed to the subnet's alpha holders. The subnet’s TAO reserve is then allocated to these holders and used to refund any applicable lock cost to the subnet owner, minus the emissions they have received.

### Takeaways

- **Distribution Method**: Largest-remainder for fair rounding
- **Owner Protection**: Owners receive a lock cost refund, where applicable, minus emissions already received
- **Immediate Effect**: All alpha tokens are destroyed and cannot be recovered

### Liquidation Steps

1. **Dissolve Liquidity Pools**: All liquidity pools in the subnet's AMM pools are dissolved
2. **Alpha-to-TAO conversion**: All alpha tokens are converted to TAO and added to the subnet's TAO reserve
3. **Calculate Owner Refund**: The subnet owner's refund is calculated as:

   ```
   refund = max(0, lock_cost - owner_received_emission_in_tao)
   ```

   Where `owner_received_emission_in_tao` is the TAO value of the owner's cut of all emissions received during the subnet's lifetime.

:::info Subnet owner refund
The total amount returned to a subnet owner upon deregistration depends on when the subnet was registered. The refund is categorized as follows:

- Legacy subnets registered before DTAO receive no refund as the owners were already compensated during the initial DTAO upgrade.
- Subnets registered after DTAO but before the implementation of subnet deregistration (**Oct 1, 2025**) receive a full refund. The total subnet owner payout equals the original Locked TAO (`Lock Refund - Owner Emissions Received`).
- Subnets registered after DTAO and after the implementation of subnet deregistration (**Oct 1, 2025**) receive subnet owner emissions only. There are no lock cost refunds since the registration costs are burned.
  :::

4. **Enumerate alpha Holders**: All alpha token holders and their stake amounts are collected

5. **Extract TAO Pool**: The subnet's TAO pool (`SubnetTAO`) is extracted for distribution

6. **Distribution**: TAO is distributed proportionally to alpha holders, accounting for any protocol-owned alpha:
   - Each holder receives: `(holder_alpha_value / total_alpha_value) * pool_tao`
   - `total_alpha_value` includes any alpha cached in `SubnetProtocolAlpha` (accumulated from chain-side TAO buys). This reduces the per-staker payout proportionally. The protocol's corresponding TAO share is not distributed to users; it is returned to the chain.
   - TAO is credited directly to each holder's coldkey free balance

### Protocol Alpha and Settlement

The protocol tracks its own alpha position per subnet. During TAO reserve injection (coinbase), the protocol buys alpha as part of the emission mechanism. Previously this alpha was immediately recycled (burned). Now it is cached in `SubnetProtocolAlpha` storage, giving the protocol an explicit ownership stake in each subnet's alpha supply.

When a subnet is dissolved, `SubnetProtocolAlpha` is included in the total alpha pool used to compute pro-rata TAO shares. Stakers receive a smaller TAO payout than they would on a subnet with zero protocol alpha: the larger the protocol's accumulated position relative to total alpha, the greater the reduction. The protocol's corresponding TAO is returned to the chain, not distributed to any address. `SubnetProtocolAlpha` is cleared as part of subnet dissolution.

**Source Code**:

- [`destroy_alpha_in_out_stakes()`](https://github.com/RaoFoundation/subtensor/blob/main/pallets/subtensor/src/staking/remove_stake.rs#L444-623)
- [`prune_network()`](https://github.com/RaoFoundation/subtensor/blob/main/pallets/subtensor/src/coinbase/root.rs#L377)

## Conviction locks and deregistration

[Conviction locks](../staking-and-delegation/conviction-staking.md) on a deregistered subnet are handled as follows:

- **Locks do not affect the pruning score.** The EMA price is the only factor in subnet selection. A subnet with large locked conviction is no more protected from deregistration than one with none.
- **Lock records are deleted before liquidation runs.** The conviction lock storage entries for the subnet are wiped as part of the dissolution sequence, before `destroy_alpha_in_out_stakes` executes.
- **Underlying stake is liquidated normally.** Once the lock records are removed, the alpha that was locked is treated like any other staked alpha: converted to TAO pro-rata and returned to coldkey free balances as described above.
- **Accumulated conviction is not compensated.** The conviction score itself has no monetary value that is refunded — it is simply gone when the subnet is removed.
