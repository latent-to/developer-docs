---
title: "Announcements and Developments"
---

# Announcements and Developments

This page tracks recent and upcoming changes to the Bittensor protocol and other major events in the Bittensor ecosystem.

**June, 2026**

## Spec 421 upgrade

**Status**: Deployed to mainnet.

**Release notes:** [Subtensor PR #2781](https://github.com/opentensor/subtensor/pull/2781)

- **Price-based subnet emissions with miner-burn scaling**: Subnet emission shares have reverted from the flow-based model (active since November 2025) to a **price-based model**, extended with two additional weighting factors. Each subnet's share of the fixed block emission is now proportional to `root_proportion × EMA_price × (1 - miner_burned)`, normalized over all emission-enabled subnets, where:
  - **EMA price** (`SubnetMovingPrice`) replaces the flow-based share method. The flow-based share logic (`get_shares_flow()`) is deprecated.
  - **root_proportion** (`tao_weight / (tao_weight + alpha_issuance)`) shrinks as a subnet ages, reallocating emission toward newer subnets over time.
  - **(1 - miner_burned)** penalizes subnets that withhold miner (incentive) emission by routing the withheld proportion away to non-withholding subnets. The penalty applies whether withheld emission is recycled or burned, and is independent of a subnet's `RecycleOrBurn` config.
  - If all subnets have zero combined weight, emission falls back to unweighted price shares so block emission is never stranded
  - **Alpha injection cap updated**: The alpha injection cap is now `root_proportion × alpha_emission` (previously `min(alpha_emission, tao_block_emission)`). As a subnet ages and its alpha issuance grows, the cap shrinks, transitioning older subnets from liquidity injection toward chain buys.

See [Emission](../learn/emissions.md).

## Spec 420 upgrade

**Status**: On Testnet

**Release notes:** [Subtensor PR #2769](https://github.com/opentensor/subtensor/pull/2769)

- **Balancer AMM replaces Uniswap V3**: Subnet liquidity pools now use a weighted balancer-style AMM (`PalSwap`) instead of Uniswap V3.

- **Advanced limit orders**: A new pallet for advanced limit orders introduces more sophisticated on-chain order types for TAO/alpha swaps.

- **Configurable tempo and owner-triggered epochs**: Subnet owners can now configure a custom tempo (block interval between Yuma Consensus epochs) for their subnet, and can manually trigger an epoch outside the normal tempo schedule. See [Subnet Hyperparameters](../subnets/subnet-hyperparameters).

## Spec 413 upgrade (v3.4.1-413)

**Status**: Deployed to mainnet.

Release notes: [v3.4.1-413](https://github.com/opentensor/subtensor/releases/tag/v3.4.1-413)

- **Protocol alpha accounting (hotfix)**: Alpha bought by the protocol during TAO reserve injection is no longer immediately recycled. It is now cached per-subnet in a new storage item (`SubnetProtocolAlpha`) and included in pro-rata TAO settlement when a subnet is dissolved. This reduces individual staker payouts during dissolution proportionally to the protocol's accumulated position, and the corresponding TAO returns to the chain rather than being distributed. The cache is cleared when a subnet dissolves. See [Subnet Deregistration](../subnets/subnet-deregistration.md).

- **Crowdloan: exclusive call or target address**: A crowdloan creation now requires exactly one of `call` or `target_address`. Specifying both or neither is an error (`InvalidFinalizationConfig`). Previously both could be provided and would execute sequentially at finalization. See [Crowdloans](../subnets/crowdloans/index.md).

- **Crowdloan: optional per-contributor maximum**: A new `set_maximum_contribution` extrinsic allows crowdloan creators to set or clear a per-contributor cap after creation. Contributions are automatically clipped to the available room under the cap. See [Crowdloans](../subnets/crowdloans/index.md).

- **Min stake constant**: Formalizes the minimum stake threshold as a named constant in the runtime.

- **Get Hyperparams v3**: Adds a third version of the subnet hyperparameters RPC query with additional fields.

**April, 2026**

## Neuron registration rework

**Status**: Merged in Subtensor ([PR #2382](https://github.com/opentensor/subtensor/pull/2382)); rolling out with network upgrades. Tracking issue: [#2351](https://github.com/opentensor/subtensor/issues/2351).

- **What**: Non-root neuron (UID) registration moves to a **continuous TAO-burn** model, similar in spirit to subnet registration pricing. Legacy **adjustment-interval** mechanics, separate **burned** vs **PoW** admission paths, and **neuron registration rate limits** (including per-interval caps) are removed on upgraded runtimes.
- **Extrinsics**: `register` and `burned_register` remain; both use the **same** burn-based flow under the hood (legacy `register` fields are compatibility-only). **`root_register` / root subnet** behavior is **unchanged**.
- **New owner-tunable pricing hyperparameters**: `BurnHalfLife` (blocks over which the registration cost decays) and `BurnIncreaseMult` (multiplier applied to the current price when a registration succeeds). **`MinBurn`** and **`MaxBurn`** still cap the dynamic price.
- **Optional slippage guard**: `register_limit` (and the EVM neuron precompile `registerLimit`) lets callers specify a maximum acceptable burn; the call fails if the price would exceed it.
- **Docs**: See [Understanding Neurons](neurons.md), [Subnet hyperparameters](../subnets/subnet-hyperparameters.md), [Rate limits](chain-rate-limits.md), and [Neuron precompile](../evm-tutorials/neuron-precompile.md). Confirm exact parameter names, types, and defaults on your target network with `btcli subnet hyperparameters` and chain metadata.

**February, 2026**

## Subnet stake burn

**Status**: In development

- **What**: Subnet stake burn stake mechanism works as a combination of the `add_stake`/`add_stake_limit` extrinsics and the `burn_alpha` extrinsic. It allows subnet owners to permanently remove alpha from circulation.
- **Key Features**:
  - Subnets owner calls `add_stake_burn` extrinsic. Extrinsic initially stakes TAO for alpha and immediately burns the acquired alpha.
  - As a result, the circulating alpha decreases, the AMM pool reserves adjust, and the alpha price updates according to the new reserve ratio.

## Max Subnet Mechanisms

**Status**: In development

- **What**: Maintains current limit of 256 UIDs across all subnet mechanisms.
- **Key Features**:
  - Subnet owners must trim UIDs before increasing the mechanism count.
  - Product of multiplying max UIDs and mechanism count must not excess 256.

**January, 2026**

## Updated coldkey swap mechanism

**Status**: In development

- **What**: Coldkey swap transitions from a schedule-based system to an "Announce-and-Execute" workflow, requiring users to finalize the swap after a mandatory delay.
- **Key Features**:
  - Swaps are no longer automatic. After announcing, the user must execute the swap by providing the destination coldkey to verify it against the announced hash.
  - A default waiting period of 36,000 blocks (~5 days) must elapse before the announced swap can be executed.
  - To prevent spam or frontrunning, a 7,200-block (~1 day) buffer is required after the initial delay expires before a new announcement can be submitted.
  - The source coldkey is locked upon announcement. Once executed, all TAO, delegated stakes, and subnet ownership transfer to the destination key.
