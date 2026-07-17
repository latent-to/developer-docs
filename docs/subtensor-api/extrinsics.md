---
title: Extrinsics
description: "The following sections contain Extrinsic methods that are part of the Subtensor runtime."
---

# Extrinsics

The following sections contain Extrinsic methods that are part of the Subtensor runtime. On the API, these are exposed via `api.tx.<Pallet>.<call_name>`.

:::info
Generated from Subtensor runtime spec version **432**. Connected to: `wss://entrypoint-finney.opentensor.ai:443`
:::

- **[adminUtils](#adminutils)**
- **[balances](#balances)**
- **[baseFee](#basefee)**
- **[commitments](#commitments)**
- **[contracts](#contracts)**
- **[crowdloan](#crowdloan)**
- **[drand](#drand)**
- **[ethereum](#ethereum)**
- **[evm](#evm)**
- **[grandpa](#grandpa)**
- **[limitOrders](#limitorders)**
- **[mevShield](#mevshield)**
- **[multisig](#multisig)**
- **[preimage](#preimage)**
- **[proxy](#proxy)**
- **[safeMode](#safemode)**
- **[scheduler](#scheduler)**
- **[subtensorModule](#subtensormodule)**
- **[sudo](#sudo)**
- **[swap](#swap)**
- **[system](#system)**
- **[timestamp](#timestamp)**
- **[utility](#utility)**

## `adminUtils`

### `scheduleGrandpaChange(next_authorities: AuthorityList, in_blocks: u32, forced: Option<BlockNumberFor<T>>)`

- **interface**: `api.tx.adminUtils.scheduleGrandpaChange`
- **summary**: A public interface for `pallet_grandpa::Pallet::schedule_grandpa_change`.

    Schedule a change in the authorities.

    The change will be applied at the end of execution of the block `in_blocks` after the current block. This value may be 0, in which case the change is applied at the end of the current block.

    If the `forced` parameter is defined, this indicates that the current set has been synchronously determined to be offline and that after `in_blocks` the given change should be applied. The given block number indicates the median last finalized block number and it should be used as the canon block when starting the new grandpa voter.

    No change should be signaled while any change is pending. Returns an error if a change is already pending.

### `sudoSetActivityCutoff(netuid: NetUid, activity_cutoff: u16)`

- **interface**: `api.tx.adminUtils.sudoSetActivityCutoff`
- **summary**: The extrinsic sets the activity cutoff for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the activity cutoff.

### `sudoSetActivityCutoffFactor(netuid: NetUid, factor_milli: u32)`

- **interface**: `api.tx.adminUtils.sudoSetActivityCutoffFactor`
- **summary**: The extrinsic sets the activity-cutoff factor for a subnet, in per-mille (1/1000) of the tempo: the effective cutoff in blocks is `(factor × tempo) / 1000`. Bounded to `[MinActivityCutoffFactorMilli, MaxActivityCutoffFactorMilli]`. It is callable by the subnet owner (rate-limited via `OwnerHyperparamUpdate`, respects the admin freeze window) or the root account (bypasses both). This supersedes the absolute-blocks `sudo_set_activity_cutoff`.

### `sudoSetAdjustmentAlpha(netuid: NetUid, adjustment_alpha: u64)`

- **interface**: `api.tx.adminUtils.sudoSetAdjustmentAlpha`
- **summary**: The extrinsic sets the adjustment alpha for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the adjustment alpha.

### `sudoSetAdjustmentInterval(netuid: NetUid, adjustment_interval: u16)`

- **interface**: `api.tx.adminUtils.sudoSetAdjustmentInterval`
- **summary**: The extrinsic sets the adjustment interval for a subnet. It is only callable by the root account, not changeable by the subnet owner. The extrinsic will call the Subtensor pallet to set the adjustment interval.

### `sudoSetAdminFreezeWindow(window: u16)`

- **interface**: `api.tx.adminUtils.sudoSetAdminFreezeWindow`
- **summary**: Sets the admin freeze window length (in blocks) at the end of a tempo. Only callable by root.

### `sudoSetAlphaSigmoidSteepness(netuid: NetUid, steepness: i16)`

- **interface**: `api.tx.adminUtils.sudoSetAlphaSigmoidSteepness`
- **summary**:     **Arguments:**

    - `origin`: The origin of the call, which must be the root account.
    - `netuid`: The unique identifier for the subnet.
    - `steepness`: The Steepness for the alpha sigmoid function. (range is 0-int16::MAX,
    negative values are reserved for future use)

    **Errors:**

    - `BadOrigin`: If the caller is not the root account.
    - `SubnetDoesNotExist`: If the specified subnet does not exist.
    - `NegativeSigmoidSteepness`: If the steepness is negative and the caller is
    root.

    **Weight:**

    Weight is handled by the `#[pallet::weight]` attribute.

### `sudoSetAlphaValues(netuid: NetUid, alpha_low: u16, alpha_high: u16)`

- **interface**: `api.tx.adminUtils.sudoSetAlphaValues`
- **summary**: Sets values for liquid alpha

### `sudoSetBondsMovingAverage(netuid: NetUid, bonds_moving_average: u64)`

- **interface**: `api.tx.adminUtils.sudoSetBondsMovingAverage`
- **summary**: The extrinsic sets the bonds moving average for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the bonds moving average.

### `sudoSetBondsPenalty(netuid: NetUid, bonds_penalty: u16)`

- **interface**: `api.tx.adminUtils.sudoSetBondsPenalty`
- **summary**: The extrinsic sets the bonds penalty for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the bonds penalty.

### `sudoSetBondsResetEnabled(netuid: NetUid, enabled: bool)`

- **interface**: `api.tx.adminUtils.sudoSetBondsResetEnabled`
- **summary**: Enables or disables Bonds Reset for a given subnet.

    **Arguments:**

    - `origin`: The origin of the call, which must be the root account or subnet owner.
    - `netuid`: The unique identifier for the subnet.
    - `enabled`: A boolean flag to enable or disable Bonds Reset.

    **Weight:**

    This function has a fixed weight of 0 and is classified as an operational transaction that does not incur any fees.

### `sudoSetBurnHalfLife(netuid: NetUid, burn_half_life: u16)`

- **interface**: `api.tx.adminUtils.sudoSetBurnHalfLife`
- **summary**: Set BurnHalfLife for a subnet. It is only callable by root and subnet owner.

### `sudoSetBurnIncreaseMult(netuid: NetUid, burn_increase_mult: U64F64)`

- **interface**: `api.tx.adminUtils.sudoSetBurnIncreaseMult`
- **summary**: Set BurnIncreaseMult for a subnet. It is only callable by root and subnet owner.

### `sudoSetCkBurn(burn: u64)`

- **interface**: `api.tx.adminUtils.sudoSetCkBurn`
- **summary**: Sets the childkey burn for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the childkey burn.

### `sudoSetColdkeySwapAnnouncementDelay(duration: u32)`

- **interface**: `api.tx.adminUtils.sudoSetColdkeySwapAnnouncementDelay`
- **summary**: Sets the announcement delay for coldkey swap.

### `sudoSetColdkeySwapReannouncementDelay(duration: u32)`

- **interface**: `api.tx.adminUtils.sudoSetColdkeySwapReannouncementDelay`
- **summary**: Sets the coldkey swap reannouncement delay.

### `sudoSetCommitRevealVersion(version: u16)`

- **interface**: `api.tx.adminUtils.sudoSetCommitRevealVersion`
- **summary**: Sets the commit-reveal weights version for all subnets

### `sudoSetCommitRevealWeightsEnabled(netuid: NetUid, enabled: bool)`

- **interface**: `api.tx.adminUtils.sudoSetCommitRevealWeightsEnabled`
- **summary**: The extrinsic enabled/disables commit/reaveal for a given subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the value.

### `sudoSetCommitRevealWeightsInterval(netuid: NetUid, interval: u64)`

- **interface**: `api.tx.adminUtils.sudoSetCommitRevealWeightsInterval`
- **summary**: Sets the commit-reveal weights periods for a specific subnet.

    This extrinsic allows the subnet owner or root account to set the duration (in epochs) during which committed weights must be revealed. The commit-reveal mechanism ensures that users commit weights in advance and reveal them only within a specified period.

    **Arguments:**

    - `origin`: The origin of the call, which must be the subnet owner or the root account.
    - `netuid`: The unique identifier of the subnet for which the periods are being set.
    - `periods`: The number of epochs that define the commit-reveal period.

    **Errors:**

    - `BadOrigin`: If the caller is neither the subnet owner nor the root account.
    - `SubnetDoesNotExist`: If the specified subnet does not exist.

    **Weight:**

    Weight is handled by the `#[pallet::weight]` attribute.

### `sudoSetDefaultTake(default_take: PerU16)`

- **interface**: `api.tx.adminUtils.sudoSetDefaultTake`
- **summary**: The extrinsic sets the default take for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the default take.

### `sudoSetDifficulty(netuid: NetUid, difficulty: u64)`

- **interface**: `api.tx.adminUtils.sudoSetDifficulty`
- **summary**: The extrinsic sets the difficulty for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the difficulty.

### `sudoSetDissolveNetworkScheduleDuration(duration: u32)`

- **interface**: `api.tx.adminUtils.sudoSetDissolveNetworkScheduleDuration`
- **summary**: Sets the duration of the dissolve network schedule.

    This extrinsic allows the root account to set the duration for the dissolve network schedule. The dissolve network schedule determines how long it takes for a network dissolution operation to complete.

    **Arguments:**

    - `origin`: The origin of the call, which must be the root account.
    - `duration`: The new duration for the dissolve network schedule, in number of blocks.

    **Errors:**

    - `BadOrigin`: If the caller is not the root account.

    **Weight:**

    Weight is handled by the `#[pallet::weight]` attribute.

### `sudoSetEmaPriceHalvingPeriod(netuid: NetUid, ema_halving: u64)`

- **interface**: `api.tx.adminUtils.sudoSetEmaPriceHalvingPeriod`
- **summary**:     **Arguments:**

    - `origin`: The origin of the call, which must be the root account.
    - `ema_alpha_period`: Number of blocks for EMA price to halve

    **Errors:**

    - `BadOrigin`: If the caller is not the root account.

    **Weight:**

    Weight is handled by the `#[pallet::weight]` attribute.

### `sudoSetEvmChainId(chain_id: u64)`

- **interface**: `api.tx.adminUtils.sudoSetEvmChainId`
- **summary**: Sets the EVM ChainID.

    **Arguments:**

    - `origin`: The origin of the call, which must be the subnet owner or the root account.
    - `chainId`: The u64 chain ID

    **Errors:**

    - `BadOrigin`: If the caller is neither the subnet owner nor the root account.

    **Weight:**

    Weight is handled by the `#[pallet::weight]` attribute.

### `sudoSetImmunityPeriod(netuid: NetUid, immunity_period: u16)`

- **interface**: `api.tx.adminUtils.sudoSetImmunityPeriod`
- **summary**: The extrinsic sets the immunity period for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the immunity period.

### `sudoSetKappa(netuid: NetUid, kappa: u16)`

- **interface**: `api.tx.adminUtils.sudoSetKappa`
- **summary**: The extrinsic sets the kappa for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the kappa.

### `sudoSetLiquidAlphaEnabled(netuid: NetUid, enabled: bool)`

- **interface**: `api.tx.adminUtils.sudoSetLiquidAlphaEnabled`
- **summary**: Enables or disables Liquid Alpha for a given subnet.

    **Arguments:**

    - `origin`: The origin of the call, which must be the root account or subnet owner.
    - `netuid`: The unique identifier for the subnet.
    - `enabled`: A boolean flag to enable or disable Liquid Alpha.

    **Weight:**

    This function has a fixed weight of 0 and is classified as an operational transaction that does not incur any fees.

### `sudoSetLockReductionInterval(interval: u64)`

- **interface**: `api.tx.adminUtils.sudoSetLockReductionInterval`
- **summary**: The extrinsic sets the lock reduction interval for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the lock reduction interval.

### `sudoSetMaxAllowedUids(netuid: NetUid, max_allowed_uids: u16)`

- **interface**: `api.tx.adminUtils.sudoSetMaxAllowedUids`
- **summary**: The extrinsic sets the maximum allowed UIDs for a subnet. It is only callable by the root account and subnet owner. The extrinsic will call the Subtensor pallet to set the maximum allowed UIDs for a subnet.

### `sudoSetMaxAllowedValidators(netuid: NetUid, max_allowed_validators: u16)`

- **interface**: `api.tx.adminUtils.sudoSetMaxAllowedValidators`
- **summary**: The extrinsic sets the maximum allowed validators for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the maximum allowed validators.

### `sudoSetMaxBurn(netuid: NetUid, max_burn: TaoBalance)`

- **interface**: `api.tx.adminUtils.sudoSetMaxBurn`
- **summary**: The extrinsic sets the maximum burn for a subnet. It is only callable by root and subnet owner. The extrinsic will call the Subtensor pallet to set the maximum burn.

### `sudoSetMaxDifficulty(netuid: NetUid, max_difficulty: u64)`

- **interface**: `api.tx.adminUtils.sudoSetMaxDifficulty`
- **summary**: The extrinsic sets the maximum difficulty for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the maximum difficulty.

### `sudoSetMaxEpochsPerBlock(max_epochs_per_block: u8)`

- **interface**: `api.tx.adminUtils.sudoSetMaxEpochsPerBlock`
- **summary**: Sets the per-block cap on subnet epochs (dynamic tempo throttle).

### `sudoSetMaxMechanismCount(max_mechanism_count: MechId)`

- **interface**: `api.tx.adminUtils.sudoSetMaxMechanismCount`
- **summary**: Sets the global maximum number of mechanisms in a subnet

### `sudoSetMaxRegistrationsPerBlock(netuid: NetUid, max_registrations_per_block: u16)`

- **interface**: `api.tx.adminUtils.sudoSetMaxRegistrationsPerBlock`
- **summary**: The extrinsic sets the maximum registrations per block for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the maximum registrations per block.

### `sudoSetMechanismCount(netuid: NetUid, mechanism_count: MechId)`

- **interface**: `api.tx.adminUtils.sudoSetMechanismCount`
- **summary**: Sets the desired number of mechanisms in a subnet

### `sudoSetMechanismEmissionSplit(netuid: NetUid, maybe_split: Option<Vec<u16>>)`

- **interface**: `api.tx.adminUtils.sudoSetMechanismEmissionSplit`
- **summary**: Sets the emission split between mechanisms in a subnet

### `sudoSetMinAllowedUids(netuid: NetUid, min_allowed_uids: u16)`

- **interface**: `api.tx.adminUtils.sudoSetMinAllowedUids`
- **summary**: The extrinsic sets the minimum allowed UIDs for a subnet. It is only callable by the root account.

### `sudoSetMinAllowedWeights(netuid: NetUid, min_allowed_weights: u16)`

- **interface**: `api.tx.adminUtils.sudoSetMinAllowedWeights`
- **summary**: The extrinsic sets the minimum allowed weights for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the minimum allowed weights.

### `sudoSetMinBurn(netuid: NetUid, min_burn: TaoBalance)`

- **interface**: `api.tx.adminUtils.sudoSetMinBurn`
- **summary**: The extrinsic sets the minimum burn for a subnet. It is only callable by root and subnet owner. The extrinsic will call the Subtensor pallet to set the minimum burn.

### `sudoSetMinChildkeyTakePerSubnet(netuid: NetUid, take: PerU16)`

- **interface**: `api.tx.adminUtils.sudoSetMinChildkeyTakePerSubnet`
- **summary**: The extrinsic sets the minimum childkey take for a subnet. It is callable by root or the subnet owner. The subnet minimum can only make the global minimum stricter.

### `sudoSetMinDelegateTake(take: PerU16)`

- **interface**: `api.tx.adminUtils.sudoSetMinDelegateTake`
- **summary**: The extrinsic sets the minimum delegate take. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the minimum delegate take.

### `sudoSetMinDifficulty(netuid: NetUid, min_difficulty: u64)`

- **interface**: `api.tx.adminUtils.sudoSetMinDifficulty`
- **summary**: The extrinsic sets the minimum difficulty for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the minimum difficulty.

### `sudoSetMinNonImmuneUids(netuid: NetUid, min: u16)`

- **interface**: `api.tx.adminUtils.sudoSetMinNonImmuneUids`
- **summary**: Sets the minimum number of non-immortal & non-immune UIDs that must remain in a subnet

### `sudoSetNetTaoFlowEnabled(enabled: bool)`

- **interface**: `api.tx.adminUtils.sudoSetNetTaoFlowEnabled`
- **summary**: Enables or disables net TAO flow (protocol cost deduction from emission shares). When enabled, emission shares use net flow = user flow - protocol cost. When disabled, emission shares use gross user flow only (current behavior).

### `sudoSetNetworkImmunityPeriod(immunity_period: u64)`

- **interface**: `api.tx.adminUtils.sudoSetNetworkImmunityPeriod`
- **summary**: The extrinsic sets the immunity period for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the immunity period for the network.

### `sudoSetNetworkMinLockCost(lock_cost: TaoBalance)`

- **interface**: `api.tx.adminUtils.sudoSetNetworkMinLockCost`
- **summary**: The extrinsic sets the min lock cost for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the min lock cost for the network.

### `sudoSetNetworkPowRegistrationAllowed(netuid: NetUid, registration_allowed: bool)`

- **interface**: `api.tx.adminUtils.sudoSetNetworkPowRegistrationAllowed`
- **summary**: The extrinsic sets the network PoW registration allowed for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the network PoW registration allowed.

### `sudoSetNetworkRateLimit(rate_limit: u64)`

- **interface**: `api.tx.adminUtils.sudoSetNetworkRateLimit`
- **summary**: The extrinsic sets the network rate limit for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the network rate limit.

### `sudoSetNetworkRegistrationAllowed(netuid: NetUid, registration_allowed: bool)`

- **interface**: `api.tx.adminUtils.sudoSetNetworkRegistrationAllowed`
- **summary**: The extrinsic sets the network registration allowed for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the network registration allowed.

### `sudoSetNominatorMinRequiredStake(min_stake: u64)`

- **interface**: `api.tx.adminUtils.sudoSetNominatorMinRequiredStake`
- **summary**: The extrinsic sets the minimum stake required for nominators. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the minimum stake required for nominators.

### `sudoSetOwnerCutAutoLockEnabled(netuid: NetUid, enabled: bool)`

- **interface**: `api.tx.adminUtils.sudoSetOwnerCutAutoLockEnabled`
- **summary**: Set whether subnet owner cut is auto-locked for a subnet. It is only callable by root and subnet owner.

### `sudoSetOwnerCutEnabled(netuid: NetUid, enabled: bool)`

- **interface**: `api.tx.adminUtils.sudoSetOwnerCutEnabled`
- **summary**: Set whether the subnet owner cut is enabled for a subnet. It is only callable by root and subnet owner.

### `sudoSetOwnerHparamRateLimit(epochs: u16)`

- **interface**: `api.tx.adminUtils.sudoSetOwnerHparamRateLimit`
- **summary**: Sets the owner hyperparameter rate limit in epochs (global multiplier). Only callable by root.

### `sudoSetOwnerImmuneNeuronLimit(netuid: NetUid, immune_neurons: u16)`

- **interface**: `api.tx.adminUtils.sudoSetOwnerImmuneNeuronLimit`
- **summary**: Sets the number of immune owner neurons

### `sudoSetRaoRecycled(netuid: NetUid, rao_recycled: TaoBalance)`

- **interface**: `api.tx.adminUtils.sudoSetRaoRecycled`
- **summary**: The extrinsic sets the recycled RAO for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the recycled RAO.

### `sudoSetRecycleOrBurn(netuid: NetUid, recycle_or_burn: pallet_subtensor::RecycleOrBurnEnum)`

- **interface**: `api.tx.adminUtils.sudoSetRecycleOrBurn`
- **summary**: Set the behaviour of the "burn" UID(s) for a given subnet. If set to `Burn`, the miner emission sent to the burn UID(s) will be burned. If set to `Recycle`, the miner emission sent to the burn UID(s) will be recycled.

    **Arguments:**

    - `origin`: The origin of the call, which must be the root account or subnet owner.
    - `netuid`: The unique identifier for the subnet.
    - `recycle_or_burn`: The desired behaviour of the "burn" UID(s) for the subnet.

### `sudoSetRho(netuid: NetUid, rho: u16)`

- **interface**: `api.tx.adminUtils.sudoSetRho`
- **summary**: The extrinsic sets the rho for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the rho.

### `sudoSetServingRateLimit(netuid: NetUid, serving_rate_limit: u64)`

- **interface**: `api.tx.adminUtils.sudoSetServingRateLimit`
- **summary**: The extrinsic sets the serving rate limit for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the serving rate limit.

### `sudoSetSnOwnerHotkey(netuid: NetUid, hotkey: AccountId)`

- **interface**: `api.tx.adminUtils.sudoSetSnOwnerHotkey`
- **summary**: Sets or updates the hotkey account associated with the owner of a specific subnet.

    This function allows either the root origin or the current subnet owner to set or update the hotkey for a given subnet. The subnet must already exist. To prevent abuse, the call is rate-limited to once per configured interval (default: one week) per subnet.

    **Arguments:**

    - `origin`: The dispatch origin of the call. Must be either root or the current owner of the subnet.
    - `netuid`: The unique identifier of the subnet whose owner hotkey is being set.
    - `hotkey`: The new hotkey account to associate with the subnet owner.

    **Returns:**

    - `DispatchResult`: Returns `Ok(())` if the hotkey was successfully set, or an appropriate error otherwise.

    **Errors:**

    - `Error::SubnetNotExists`: If the specified subnet does not exist.
    - `Error::TxRateLimitExceeded`: If the function is called more frequently than the allowed rate limit.

    **Access Control:**

    Only callable by:
    - Root origin, or
    - The coldkey account that owns the subnet.

    **Storage:**

    - Updates [`SubnetOwnerHotkey`] for the given `netuid`.
    - Reads and updates [`LastRateLimitedBlock`] for rate-limiting.
    - Reads [`DefaultSetSNOwnerHotkeyRateLimit`] to determine the interval between allowed updates.

    **Rate Limiting:**

    This function is rate-limited to one call per subnet per interval (e.g., one week).

### `sudoSetStakeThreshold(min_stake: u64)`

- **interface**: `api.tx.adminUtils.sudoSetStakeThreshold`
- **summary**: The extrinsic sets the weights min stake. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the weights min stake.

### `sudoSetStartCallDelay(delay: u64)`

- **interface**: `api.tx.adminUtils.sudoSetStartCallDelay`
- **summary**: Sets the delay before a subnet can call start

### `sudoSetSubnetEmissionEnabled(netuid: NetUid, enabled: bool)`

- **interface**: `api.tx.adminUtils.sudoSetSubnetEmissionEnabled`
- **summary**: Enables or disables subnet pool-side emission for a subnet.

    This does not remove the subnet from emission share calculation and does not change `alpha_out`, owner cut, root proportion, pending server emission, or pending validator emission. It only zeros the pool-side `alpha_in`, `tao_in`, and `excess_tao` chain-buy paths.

### `sudoSetSubnetLimit(max_subnets: u16)`

- **interface**: `api.tx.adminUtils.sudoSetSubnetLimit`
- **summary**: The extrinsic sets the subnet limit for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the subnet limit.

### `sudoSetSubnetMovingAlpha(alpha: I96F32)`

- **interface**: `api.tx.adminUtils.sudoSetSubnetMovingAlpha`
- **summary**:     **Arguments:**

    - `origin`: The origin of the call, which must be the root account.
    - `alpha`: The new moving alpha value for the SubnetMovingAlpha.

    **Errors:**

    - `BadOrigin`: If the caller is not the root account.

    **Weight:**

    Weight is handled by the `#[pallet::weight]` attribute.

### `sudoSetSubnetOwnerCut(subnet_owner_cut: u16)`

- **interface**: `api.tx.adminUtils.sudoSetSubnetOwnerCut`
- **summary**: The extrinsic sets the subnet owner cut for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the subnet owner cut.

### `sudoSetSubtokenEnabled(netuid: NetUid, subtoken_enabled: bool)`

- **interface**: `api.tx.adminUtils.sudoSetSubtokenEnabled`
- **summary**: Enables or disables subtoken trading for a given subnet.

    **Arguments:**

    - `origin`: The origin of the call, which must be the root account.
    - `netuid`: The unique identifier of the subnet.
    - `subtoken_enabled`: A boolean indicating whether subtoken trading should be enabled or disabled.

    **Errors:**

    - `BadOrigin`: If the caller is not the root account.

    **Weight:**

    Weight is handled by the `#[pallet::weight]` attribute.

### `sudoSetTaoFlowCutoff(flow_cutoff: I64F64)`

- **interface**: `api.tx.adminUtils.sudoSetTaoFlowCutoff`
- **summary**: Sets TAO flow cutoff value (A)

### `sudoSetTaoFlowNormalizationExponent(exponent: U64F64)`

- **interface**: `api.tx.adminUtils.sudoSetTaoFlowNormalizationExponent`
- **summary**: Sets TAO flow normalization exponent (p)

### `sudoSetTaoFlowSmoothingFactor(smoothing_factor: u64)`

- **interface**: `api.tx.adminUtils.sudoSetTaoFlowSmoothingFactor`
- **summary**: Sets TAO flow smoothing factor (alpha)

### `sudoSetTargetRegistrationsPerInterval(netuid: NetUid, target_registrations_per_interval: u16)`

- **interface**: `api.tx.adminUtils.sudoSetTargetRegistrationsPerInterval`
- **summary**: The extrinsic sets the target registrations per interval for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the target registrations per interval.

### `sudoSetTempo(netuid: NetUid, tempo: u16)`

- **interface**: `api.tx.adminUtils.sudoSetTempo`
- **summary**: The extrinsic sets the tempo for a subnet. It is callable by the subnet owner (bounded to `[MinTempo, MaxTempo]` and rate-limited to one change per `MinTempo` blocks) or the root account (any u16, no rate limit). Both respect the admin freeze window. A successful change resets the epoch cycle (`LastEpochBlock = current_block`).

### `sudoSetToggleTransfer(netuid: NetUid, toggle: bool)`

- **interface**: `api.tx.adminUtils.sudoSetToggleTransfer`
- **summary**: Enable or disable atomic alpha transfers for a given subnet.

    **Arguments:**

    - `origin`: The origin of the call, which must be the root account or subnet owner.
    - `netuid`: The unique identifier for the subnet.
    - `enabled`: A boolean flag to enable or disable Liquid Alpha.

    **Weight:**

    This function has a fixed weight of 0 and is classified as an operational transaction that does not incur any fees.

### `sudoSetTotalIssuance(total_issuance: TaoBalance)`

- **interface**: `api.tx.adminUtils.sudoSetTotalIssuance`
- **summary**: Deprecated. This extrinsic is no longer supported and always returns `Error::Deprecated`.

### `sudoSetTxDelegateTakeRateLimit(tx_rate_limit: u64)`

- **interface**: `api.tx.adminUtils.sudoSetTxDelegateTakeRateLimit`
- **summary**: The extrinsic sets the rate limit for delegate take transactions. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the rate limit for delegate take transactions.

### `sudoSetTxRateLimit(tx_rate_limit: u64)`

- **interface**: `api.tx.adminUtils.sudoSetTxRateLimit`
- **summary**: The extrinsic sets the transaction rate limit for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the transaction rate limit.

### `sudoSetWeightsSetRateLimit(netuid: NetUid, weights_set_rate_limit: u64)`

- **interface**: `api.tx.adminUtils.sudoSetWeightsSetRateLimit`
- **summary**: The extrinsic sets the weights set rate limit for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the weights set rate limit.

### `sudoSetWeightsVersionKey(netuid: NetUid, weights_version_key: u64)`

- **interface**: `api.tx.adminUtils.sudoSetWeightsVersionKey`
- **summary**: The extrinsic sets the weights version key for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the weights version key.

### `sudoSetYuma3Enabled(netuid: NetUid, enabled: bool)`

- **interface**: `api.tx.adminUtils.sudoSetYuma3Enabled`
- **summary**: Enables or disables Yuma3 for a given subnet.

    **Arguments:**

    - `origin`: The origin of the call, which must be the root account or subnet owner.
    - `netuid`: The unique identifier for the subnet.
    - `enabled`: A boolean flag to enable or disable Yuma3.

    **Weight:**

    This function has a fixed weight of 0 and is classified as an operational transaction that does not incur any fees.

### `sudoToggleEvmPrecompile(precompile_id: PrecompileEnum, enabled: bool)`

- **interface**: `api.tx.adminUtils.sudoToggleEvmPrecompile`
- **summary**: Toggles the enablement of an EVM precompile.

    **Arguments:**

    - `origin`: The origin of the call, which must be the root account.
    - `precompile_id`: The identifier of the EVM precompile to toggle.
    - `enabled`: The new enablement state of the precompile.

    **Errors:**

    - `BadOrigin`: If the caller is not the root account.

    **Weight:**

    Weight is handled by the `#[pallet::weight]` attribute.

### `sudoTrimToMaxAllowedUids(netuid: NetUid, max_n: u16)`

- **interface**: `api.tx.adminUtils.sudoTrimToMaxAllowedUids`
- **summary**: Trims the maximum number of UIDs for a subnet.

    The trimming is done by sorting the UIDs by emission descending and then trimming the lowest emitters while preserving temporally and owner immune UIDs. The UIDs are then compressed to the left and storage is migrated to the new compressed UIDs.

### `swapAuthorities(new_authorities: BoundedVec<AuthorityId, T::MaxAuthorities>)`

- **interface**: `api.tx.adminUtils.swapAuthorities`
- **summary**: The extrinsic sets the new authorities for Aura consensus. It is only callable by the root account. The extrinsic will call the Aura pallet to change the authorities.


## `balances`

### `burn(value: u128, keep_alive: bool)`

- **interface**: `api.tx.balances.burn`
- **summary**: Burn the specified liquid free balance from the origin account.

    If the origin's account ends up below the existential deposit as a result of the burn and `keep_alive` is false, the account will be reaped.

    Unlike sending funds to a _burn_ address, which merely makes the funds inaccessible, this `burn` operation will reduce total issuance by the amount _burned_.

### `forceAdjustTotalIssuance(direction: AdjustmentDirection, delta: u128)`

- **interface**: `api.tx.balances.forceAdjustTotalIssuance`
- **summary**: Adjust the total issuance in a saturating way.

    Can only be called by root and always needs a positive `delta`.

    **Example:**

### `forceSetBalance(who: MultiAddress, new_free: u128)`

- **interface**: `api.tx.balances.forceSetBalance`
- **summary**: Set the regular balance of a given account.

    The dispatch origin for this call is `root`.

### `forceTransfer(source: MultiAddress, dest: MultiAddress, value: u128)`

- **interface**: `api.tx.balances.forceTransfer`
- **summary**: Exactly as `transfer_allow_death`, except the origin must be root and the source account may be specified.

### `forceUnreserve(who: MultiAddress, amount: u128)`

- **interface**: `api.tx.balances.forceUnreserve`
- **summary**: Unreserve some balance from a user by force.

    Can only be called by ROOT.

### `transferAll(dest: MultiAddress, keep_alive: bool)`

- **interface**: `api.tx.balances.transferAll`
- **summary**: Transfer the entire transferable balance from the caller account.

    NOTE: This function only attempts to transfer _transferable_ balances. This means that any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be transferred by this function. To ensure that this function results in a killed account, you might need to prepare the account by removing any reference counters, storage deposits, etc...

    The dispatch origin of this call must be Signed.

    - `dest`: The recipient of the transfer.
    - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
    of the funds the account has, causing the sender account to be killed (false), or transfer everything except at least the existential deposit, which will guarantee to keep the sender account alive (true).

### `transferAllowDeath(dest: MultiAddress, value: u128)`

- **interface**: `api.tx.balances.transferAllowDeath`
- **summary**: Transfer some liquid free balance to another account.

    `transfer_allow_death` will set the `FreeBalance` of the sender and receiver. If the sender's account is below the existential deposit as a result of the transfer, the account will be reaped.

    The dispatch origin for this call must be `Signed` by the transactor.

### `transferKeepAlive(dest: MultiAddress, value: u128)`

- **interface**: `api.tx.balances.transferKeepAlive`
- **summary**: Same as the [`transfer_allow_death`] call, but with a check that the transfer will not kill the origin account.

    99% of the time you want [`transfer_allow_death`] instead.

### `upgradeAccounts(who: Vec<T::AccountId>)`

- **interface**: `api.tx.balances.upgradeAccounts`
- **summary**: Upgrade a specified account.

    - `origin`: Must be `Signed`.
    - `who`: The account to be upgraded.

    This will waive the transaction fee if at least all but 10% of the accounts needed to be upgraded. (We let some not have to be upgraded just in order to allow for the possibility of churn).


## `baseFee`

### `setBaseFeePerGas(fee: U256)`

- **interface**: `api.tx.baseFee.setBaseFeePerGas`

### `setElasticity(elasticity: Permill)`

- **interface**: `api.tx.baseFee.setElasticity`


## `commitments`

### `setCommitment(netuid: NetUid, info: Box<CommitmentInfo<T::MaxFields>>)`

- **interface**: `api.tx.commitments.setCommitment`
- **summary**: Set the commitment for a given netuid

### `setMaxSpace(new_limit: u32)`

- **interface**: `api.tx.commitments.setMaxSpace`
- **summary**: Sudo-set MaxSpace


## `contracts`

### `call(dest: MultiAddress, value: u128, gas_limit: Weight, storage_deposit_limit: Option<<BalanceOf<T> as codec::HasCompact>::Type>, data: Vec<u8>)`

- **interface**: `api.tx.contracts.call`
- **summary**: Makes a call to an account, optionally transferring some balance.

    **Parameters:**

    - `dest`: Address of the contract to call.
    - `value`: The balance to transfer from the `origin` to `dest`.
    - `gas_limit`: The gas limit enforced when executing the constructor.
    - `storage_deposit_limit`: The maximum amount of balance that can be charged from the
    caller to pay for the storage consumed.
    - `data`: The input data to pass to the contract.

    - If the account is a smart-contract account, the associated code will be
    executed and any value will be transferred.
    - If the account is a regular account, any value will be transferred.
    - If no account exists and the call value is not less than `existential_deposit`,
    a regular account will be created and any value will be transferred.

### `callOldWeight(dest: MultiAddress, value: u128, gas_limit: OldWeight, storage_deposit_limit: Option<<BalanceOf<T> as codec::HasCompact>::Type>, data: Vec<u8>)`

- **interface**: `api.tx.contracts.callOldWeight`
- **summary**: Deprecated version if [`Self::call`] for use in an in-storage `Call`.

### `instantiate(value: u128, gas_limit: Weight, storage_deposit_limit: Option<<BalanceOf<T> as codec::HasCompact>::Type>, code_hash: CodeHash, data: Vec<u8>, salt: Vec<u8>)`

- **interface**: `api.tx.contracts.instantiate`
- **summary**: Instantiates a contract from a previously deployed wasm binary.

    This function is identical to [`Self::instantiate_with_code`] but without the code deployment step. Instead, the `code_hash` of an on-chain deployed wasm binary must be supplied.

### `instantiateOldWeight(value: u128, gas_limit: OldWeight, storage_deposit_limit: Option<<BalanceOf<T> as codec::HasCompact>::Type>, code_hash: CodeHash, data: Vec<u8>, salt: Vec<u8>)`

- **interface**: `api.tx.contracts.instantiateOldWeight`
- **summary**: Deprecated version if [`Self::instantiate`] for use in an in-storage `Call`.

### `instantiateWithCode(value: u128, gas_limit: Weight, storage_deposit_limit: Option<<BalanceOf<T> as codec::HasCompact>::Type>, code: Vec<u8>, data: Vec<u8>, salt: Vec<u8>)`

- **interface**: `api.tx.contracts.instantiateWithCode`
- **summary**: Instantiates a new contract from the supplied `code` optionally transferring some balance.

    This dispatchable has the same effect as calling [`Self::upload_code`] + [`Self::instantiate`]. Bundling them together provides efficiency gains. Please also check the documentation of [`Self::upload_code`].

    **Parameters:**

    - `value`: The balance to transfer from the `origin` to the newly created contract.
    - `gas_limit`: The gas limit enforced when executing the constructor.
    - `storage_deposit_limit`: The maximum amount of balance that can be charged/reserved
    from the caller to pay for the storage consumed.
    - `code`: The contract code to deploy in raw bytes.
    - `data`: The input data to pass to the contract constructor.
    - `salt`: Used for the address derivation. See [`Pallet::contract_address`].

    Instantiation is executed as follows:

    - The supplied `code` is deployed, and a `code_hash` is created for that code.
    - If the `code_hash` already exists on the chain the underlying `code` will be shared.
    - The destination address is computed based on the sender, code_hash and the salt.
    - The smart-contract account is created at the computed address.
    - The `value` is transferred to the new account.
    - The `deploy` function is executed in the context of the newly-created account.

### `instantiateWithCodeOldWeight(value: u128, gas_limit: OldWeight, storage_deposit_limit: Option<<BalanceOf<T> as codec::HasCompact>::Type>, code: Vec<u8>, data: Vec<u8>, salt: Vec<u8>)`

- **interface**: `api.tx.contracts.instantiateWithCodeOldWeight`
- **summary**: Deprecated version if [`Self::instantiate_with_code`] for use in an in-storage `Call`.

### `migrate(weight_limit: Weight)`

- **interface**: `api.tx.contracts.migrate`
- **summary**: When a migration is in progress, this dispatchable can be used to run migration steps. Calls that contribute to advancing the migration have their fees waived, as it's helpful for the chain. Note that while the migration is in progress, the pallet will also leverage the `on_idle` hooks to run migration steps.

### `removeCode(code_hash: CodeHash)`

- **interface**: `api.tx.contracts.removeCode`
- **summary**: Remove the code stored under `code_hash` and refund the deposit to its owner.

    A code can only be removed by its original uploader (its owner) and only if it is not used by any contract.

### `setCode(dest: MultiAddress, code_hash: CodeHash)`

- **interface**: `api.tx.contracts.setCode`
- **summary**: Privileged function that changes the code of an existing contract.

    This takes care of updating refcounts and all other necessary operations. Returns an error if either the `code_hash` or `dest` do not exist.

    **Note:**

    This does **not** change the address of the contract in question. This means that the contract address is no longer derived from its code hash after calling this dispatchable.

### `uploadCode(code: Vec<u8>, storage_deposit_limit: Option<<BalanceOf<T> as codec::HasCompact>::Type>, determinism: Determinism)`

- **interface**: `api.tx.contracts.uploadCode`
- **summary**: Upload new `code` without instantiating a contract from it.

    If the code does not already exist a deposit is reserved from the caller and unreserved only when [`Self::remove_code`] is called. The size of the reserve depends on the size of the supplied `code`.

    If the code already exists in storage it will still return `Ok` and upgrades the in storage version to the current `InstructionWeights::version`.

    - `determinism`: If this is set to any other value but [`Determinism::Enforced`] then
    the only way to use this code is to delegate call into it from an offchain execution. Set to [`Determinism::Enforced`] if in doubt.

    **Note:**

    Anyone can instantiate a contract from any uploaded code and thus prevent its removal. To avoid this situation a constructor could employ access control so that it can only be instantiated by permissioned entities. The same is true when uploading through [`Self::instantiate_with_code`].

    Use [`Determinism::Relaxed`] exclusively for non-deterministic code. If the uploaded code is deterministic, specifying [`Determinism::Relaxed`] will be disregarded and result in higher gas costs.


## `crowdloan`

### `contribute(crowdloan_id: CrowdloanId, amount: u128)`

- **interface**: `api.tx.crowdloan.contribute`
- **summary**: Contribute to an active crowdloan.

    The contribution will be transferred to the crowdloan account and will be refunded if the crowdloan fails to raise the cap. If the contribution would raise the amount above the cap, the contribution will be set to the amount that is left to be raised.

    The dispatch origin for this call must be _Signed_.

    **Parameters:**

    - `crowdloan_id`: The id of the crowdloan to contribute to.
    - `amount`: The amount to contribute.

### `create(deposit: u128, min_contribution: u128, cap: u128, end: u32, call: Option<Box<RuntimeCall>>, target_address: Option<T::AccountId>)`

- **interface**: `api.tx.crowdloan.create`
- **summary**: Create a crowdloan that will raise funds up to a maximum cap and if successful, will either transfer funds to the target address or dispatch the call (using creator origin). Exactly one of call or target address must be provided. Providing both, or providing neither, is rejected.

    The initial deposit will be transferred to the crowdloan account and will be refunded in case the crowdloan fails to raise the cap. Additionally, the creator will pay for the execution of the call.

    The dispatch origin for this call must be _Signed_.

    **Parameters:**

    - `deposit`: The initial deposit from the creator.
    - `min_contribution`: The minimum contribution required to contribute to the crowdloan.
    - `cap`: The maximum amount of funds that can be raised.
    - `end`: The block number at which the crowdloan will end.
    - `call`: The call to dispatch when the crowdloan is finalized.
    - `target_address`: The address to transfer the raised funds to.

### `dissolve(crowdloan_id: CrowdloanId)`

- **interface**: `api.tx.crowdloan.dissolve`
- **summary**: Dissolve a crowdloan.

    The crowdloan will be removed from the storage. All contributions must have been refunded before the crowdloan can be dissolved (except the creator's one).

    The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan.

    **Parameters:**

    - `crowdloan_id`: The id of the crowdloan to dissolve.

### `finalize(crowdloan_id: CrowdloanId)`

- **interface**: `api.tx.crowdloan.finalize`
- **summary**: Finalize crowdloan that has reached the cap.

    The call will either transfer the raised amount to the configured target address or dispatch the configured call using the creator origin. The stored crowdloan must contain exactly one of target address or call; if both or neither are set, finalization fails before transfer or dispatch.

    When dispatching a call, the CurrentCrowdloanId will be set to the crowdloan id being finalized so the dispatched call can access it temporarily by accessing the `CurrentCrowdloanId` storage item.

    The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan.

    **Parameters:**

    - `crowdloan_id`: The id of the crowdloan to finalize.

### `refund(crowdloan_id: CrowdloanId)`

- **interface**: `api.tx.crowdloan.refund`
- **summary**: Refund contributors of a non-finalized crowdloan.

    The call will try to refund all contributors (excluding the creator) up to the limit defined by the `RefundContributorsLimit`. If the limit is reached, the call will stop and the crowdloan will be marked as partially refunded. It may be needed to dispatch this call multiple times to refund all contributors.

    The dispatch origin for this call must be _Signed_ and doesn't need to be the creator of the crowdloan.

    **Parameters:**

    - `crowdloan_id`: The id of the crowdloan to refund.

### `setMaxContribution(crowdloan_id: CrowdloanId, new_max_contribution: Option<BalanceOf<T>>)`

- **interface**: `api.tx.crowdloan.setMaxContribution`
- **summary**: Set or clear the maximum cumulative contribution allowed per contributor for a non-finalized crowdloan.

    The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan.

    **Parameters:**

    - `crowdloan_id`: The id of the crowdloan to update the maximum contribution of.
    - `new_max_contribution`: The new optional maximum contribution.

### `updateCap(crowdloan_id: CrowdloanId, new_cap: u128)`

- **interface**: `api.tx.crowdloan.updateCap`
- **summary**: Update the cap of a non-finalized crowdloan.

    The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan.

    **Parameters:**

    - `crowdloan_id`: The id of the crowdloan to update the cap of.
    - `new_cap`: The new cap.

### `updateEnd(crowdloan_id: CrowdloanId, new_end: u32)`

- **interface**: `api.tx.crowdloan.updateEnd`
- **summary**: Update the end block of a non-finalized crowdloan.

    The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan.

    **Parameters:**

    - `crowdloan_id`: The id of the crowdloan to update the end block of.
    - `new_end`: The new end block.

### `updateMinContribution(crowdloan_id: CrowdloanId, new_min_contribution: u128)`

- **interface**: `api.tx.crowdloan.updateMinContribution`
- **summary**: Update the minimum contribution of a non-finalized crowdloan.

    If a maximum contribution is configured, the new minimum contribution must not exceed it.

    The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan.

    **Parameters:**

    - `crowdloan_id`: The id of the crowdloan to update the minimum contribution of.
    - `new_min_contribution`: The new minimum contribution.

### `withdraw(crowdloan_id: CrowdloanId)`

- **interface**: `api.tx.crowdloan.withdraw`
- **summary**: Withdraw a contribution from an active (not yet finalized or dissolved) crowdloan.

    Only contributions over the deposit can be withdrawn by the creator.

    The dispatch origin for this call must be _Signed_.

    **Parameters:**

    - `crowdloan_id`: The id of the crowdloan to withdraw from.


## `drand`

### `setBeaconConfig(config_payload: BeaconConfigurationPayload<T::Public, BlockNumberFor<T>>, signature: Option<T::Signature>)`

- **interface**: `api.tx.drand.setBeaconConfig`
- **summary**: allows the root user to set the beacon configuration generally this would be called from an offchain worker context. there is no verification of configurations, so be careful with this.

    - `origin`: the root user
    - `config`: the beacon configuration

### `setOldestStoredRound(oldest_round: u64)`

- **interface**: `api.tx.drand.setOldestStoredRound`
- **summary**: allows the root user to set the oldest stored round

### `writePulse(pulses_payload: PulsesPayload<T::Public, BlockNumberFor<T>>, signature: Option<T::Signature>)`

- **interface**: `api.tx.drand.writePulse`
- **summary**: Verify and write a pulse from the beacon into the runtime


## `ethereum`

### `transact(transaction: Transaction)`

- **interface**: `api.tx.ethereum.transact`
- **summary**: Transact an Ethereum transaction.


## `evm`

### `call(source: H160, target: H160, input: Vec<u8>, value: U256, gas_limit: u64, max_fee_per_gas: U256, max_priority_fee_per_gas: Option<U256>, nonce: Option<U256>, access_list: Vec<(H160, Vec<H256>)>, authorization_list: AuthorizationList)`

- **interface**: `api.tx.evm.call`
- **summary**: Issue an EVM call operation. This is similar to a message call transaction in Ethereum.

### `create(source: H160, init: Vec<u8>, value: U256, gas_limit: u64, max_fee_per_gas: U256, max_priority_fee_per_gas: Option<U256>, nonce: Option<U256>, access_list: Vec<(H160, Vec<H256>)>, authorization_list: AuthorizationList)`

- **interface**: `api.tx.evm.create`
- **summary**: Issue an EVM create operation. This is similar to a contract creation transaction in Ethereum.

### `create2(source: H160, init: Vec<u8>, salt: H256, value: U256, gas_limit: u64, max_fee_per_gas: U256, max_priority_fee_per_gas: Option<U256>, nonce: Option<U256>, access_list: Vec<(H160, Vec<H256>)>, authorization_list: AuthorizationList)`

- **interface**: `api.tx.evm.create2`
- **summary**: Issue an EVM create2 operation.

### `disableWhitelist(disabled: bool)`

- **interface**: `api.tx.evm.disableWhitelist`

### `setWhitelist(new: Vec<H160>)`

- **interface**: `api.tx.evm.setWhitelist`

### `withdraw(address: H160, value: u128)`

- **interface**: `api.tx.evm.withdraw`
- **summary**: Withdraw balance from EVM into currency/balances pallet.


## `grandpa`

### `noteStalled(delay: u32, best_finalized_block_number: u32)`

- **interface**: `api.tx.grandpa.noteStalled`
- **summary**: Note that the current authority set of the GRANDPA finality gadget has stalled.

    This will trigger a forced authority set change at the beginning of the next session, to be enacted `delay` blocks after that. The `delay` should be high enough to safely assume that the block signalling the forced change will not be re-orged e.g. 1000 blocks. The block production rate (which may be slowed down because of finality lagging) should be taken into account when choosing the `delay`. The GRANDPA voters based on the new authority will start voting on top of `best_finalized_block_number` for new finalized blocks. `best_finalized_block_number` should be the highest of the latest finalized block of all validators of the new authority set.

    Only callable by root.

### `reportEquivocation(equivocation_proof: Box<EquivocationProof<T::Hash, BlockNumberFor<T>>>, key_owner_proof: T::KeyOwnerProof)`

- **interface**: `api.tx.grandpa.reportEquivocation`
- **summary**: Report voter equivocation/misbehavior. This method will verify the equivocation proof and validate the given key ownership proof against the extracted offender. If both are valid, the offence will be reported.

### `reportEquivocationUnsigned(equivocation_proof: Box<EquivocationProof<T::Hash, BlockNumberFor<T>>>, key_owner_proof: T::KeyOwnerProof)`

- **interface**: `api.tx.grandpa.reportEquivocationUnsigned`
- **summary**: Report voter equivocation/misbehavior. This method will verify the equivocation proof and validate the given key ownership proof against the extracted offender. If both are valid, the offence will be reported.

    This extrinsic must be called unsigned and it is expected that only block authors will call it (validated in `ValidateUnsigned`), as such if the block author is defined it will be defined as the equivocation reporter.


## `limitOrders`

### `cancelOrder(order: VersionedOrder<T::AccountId>)`

- **interface**: `api.tx.limitOrders.cancelOrder`
- **summary**: Register a cancellation intent for an order.

    Must be called by the order's signer. The full `Order` payload is provided so the pallet can derive the `OrderId`. Once marked Cancelled, the order can never be executed.

### `executeBatchedOrders(netuid: NetUid, orders: BoundedVec<SignedOrder<T::AccountId>, T::MaxOrdersPerBatch>)`

- **interface**: `api.tx.limitOrders.executeBatchedOrders`
- **summary**: Execute a batch of signed limit orders for a single subnet using aggregated (netted) pool interaction.

    Unlike `execute_orders`, which hits the pool once per order, this extrinsic:

    1. Validates all orders (bad signature / expired / already processed /
    price-not-met orders are skipped and emit `OrderSkipped`).
    2. Fetches the current price once.
    3. Aggregates all valid buy inputs (TAO) and sell inputs (alpha).
    4. Nets the two sides: only the residual amount touches the pool in
    a single swap, minimising price impact.
    5. Distributes outputs pro-rata:
    Dominant-side orders split the pool output proportionally to their individual net amounts. Offset-side orders are filled internally at the current price (no pool interaction for them).
    6. Collects protocol fees (TAO for buy orders, alpha → TAO for sell
    orders) and routes them to `FeeCollector`.

    All orders in the batch must target `netuid`. Orders for a different subnet are skipped.

### `executeOrders(orders: BoundedVec<SignedOrder<T::AccountId>, T::MaxOrdersPerBatch>, should_fail: bool)`

- **interface**: `api.tx.limitOrders.executeOrders`
- **summary**: Execute a batch of signed limit orders. Admin-gated.

    The `should_fail` flag controls how individual order failures are handled:

    - When `false` (best-effort): orders whose price condition is not yet
    met are silently skipped so that a single stale order cannot block the rest of the batch. Orders that fail for any other reason (expired, bad signature, etc.) are also skipped; the admin is expected to filter these off-chain.
    - When `true` (all-or-nothing): the first order failure aborts the
    whole batch by returning the underlying error, reverting any orders already executed in this call.

### `setPalletStatus(enabled: bool)`

- **interface**: `api.tx.limitOrders.setPalletStatus`
- **summary**: Set a status for the limit orders pallet

    Must be called by root It allows disabling or enabling the pallet true means enabling, false means disabling


## `mevShield`

### `announceNextKey(enc_key: Option<ShieldEncKey>)`

- **interface**: `api.tx.mevShield.announceNextKey`
- **summary**: Rotate the key chain and announce the current author's ML-KEM encapsulation key.

    Called as an inherent every block. `enc_key` is `None` on node failure, which removes the author from future shielded tx eligibility.

    Key rotation order (using pre-update AuthorKeys):
    1. CurrentKey  ← PendingKey
    2. PendingKey  ← NextKey
    3. NextKey     ← next-next author's key  (user-facing)
    4. AuthorKeys[current] ← announced key

### `setMaxExtrinsicWeight(value: u64)`

- **interface**: `api.tx.mevShield.setMaxExtrinsicWeight`
- **summary**: Set the maximum weight allowed for a single extrinsic during on_initialize processing. Extrinsics exceeding this limit are removed from the queue. Rejects values exceeding the absolute limit.

### `setMaxPendingExtrinsicsNumber(value: u32)`

- **interface**: `api.tx.mevShield.setMaxPendingExtrinsicsNumber`
- **summary**: Set the maximum number of pending extrinsics allowed in the queue.

### `setOnInitializeWeight(value: u64)`

- **interface**: `api.tx.mevShield.setOnInitializeWeight`
- **summary**: Set the maximum weight allowed for on_initialize processing. Rejects values exceeding the absolute limit (half of total block weight).

### `setStoredExtrinsicLifetime(value: u32)`

- **interface**: `api.tx.mevShield.setStoredExtrinsicLifetime`
- **summary**: Set the extrinsic lifetime (max blocks between submission and execution).

### `storeEncrypted(encrypted_call: BoundedVec<u8, MaxEncryptedCallSize>)`

- **interface**: `api.tx.mevShield.storeEncrypted`
- **summary**: Store an encrypted extrinsic for later execution in on_initialize.

### `submitEncrypted(ciphertext: BoundedVec<u8, ConstU32<8192>>)`

- **interface**: `api.tx.mevShield.submitEncrypted`
- **summary**: Users submit an encrypted wrapper.

    Client‑side:

    1. Read `NextKey` (ML‑KEM encapsulation key bytes) from storage.
    2. Sign your extrinsic so that it can be executed when added to the pool,
    i.e. you may need to increment the nonce if you submit using the same account.
    3. Encrypt:

    plaintext = signed_extrinsic key_hash = xxhash128(NextKey) kem_len = Length of kem_ct in bytes (u16) kem_ct = Ciphertext from ML‑KEM‑768 nonce = Random 24 bytes used for XChaCha20‑Poly1305 aead_ct = Ciphertext from XChaCha20‑Poly1305

    with ML‑KEM‑768 + XChaCha20‑Poly1305, producing

    ciphertext = key_hash || kem_len || kem_ct || nonce || aead_ct


## `multisig`

### `approveAsMulti(threshold: u16, other_signatories: Vec<T::AccountId>, maybe_timepoint: Option<Timepoint<BlockNumberFor<T>>>, call_hash: [u8; 32], max_weight: Weight)`

- **interface**: `api.tx.multisig.approveAsMulti`
- **summary**: Register approval for a dispatch to be made from a deterministic composite account if approved by a total of `threshold - 1` of `other_signatories`.

    Payment: `DepositBase` will be reserved if this is the first approval, plus `threshold` times `DepositFactor`. It is returned once this dispatch happens or is cancelled.

    The dispatch origin for this call must be _Signed_.

    - `threshold`: The total number of approvals for this dispatch before it is executed.
    - `other_signatories`: The accounts (other than the sender) who can approve this
    dispatch. May not be empty.
    - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
    not the first approval, then it must be `Some`, with the timepoint (block number and transaction index) of the first approval transaction.
    - `call_hash`: The hash of the call to be executed.

    NOTE: If this is the final approval, you will want to use `as_multi` instead.

    **Complexity:**

    - ``O(S)``.
    - Up to one balance-reserve or unreserve operation.
    - One passthrough operation, one insert, both ``O(S)`` where `S` is the number of
    signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
    - One encode & hash, both of complexity ``O(S)``.
    - Up to one binary search and insert (``O(logS + S)``).
    - I/O: 1 read ``O(S)``, up to 1 mutate ``O(S)``. Up to one remove.
    - One event.
    - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
    taken for its lifetime of `DepositBase + threshold * DepositFactor`.

### `asMulti(threshold: u16, other_signatories: Vec<T::AccountId>, maybe_timepoint: Option<Timepoint<BlockNumberFor<T>>>, call: Box<RuntimeCall>, max_weight: Weight)`

- **interface**: `api.tx.multisig.asMulti`
- **summary**: Register approval for a dispatch to be made from a deterministic composite account if approved by a total of `threshold - 1` of `other_signatories`.

    If there are enough, then dispatch the call.

    Payment: `DepositBase` will be reserved if this is the first approval, plus `threshold` times `DepositFactor`. It is returned once this dispatch happens or is cancelled.

    The dispatch origin for this call must be _Signed_.

    - `threshold`: The total number of approvals for this dispatch before it is executed.
    - `other_signatories`: The accounts (other than the sender) who can approve this
    dispatch. May not be empty.
    - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
    not the first approval, then it must be `Some`, with the timepoint (block number and transaction index) of the first approval transaction.
    - `call`: The call to be executed.

    NOTE: Unless this is the final approval, you will generally want to use `approve_as_multi` instead, since it only requires a hash of the call.

    Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise on success, result is `Ok` and the result from the interior call, if it was executed, may be found in the deposited `MultisigExecuted` event.

    **Complexity:**

    - ``O(S + Z + Call)``.
    - Up to one balance-reserve or unreserve operation.
    - One passthrough operation, one insert, both ``O(S)`` where `S` is the number of
    signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
    - One call encode & hash, both of complexity ``O(Z)`` where `Z` is tx-len.
    - One encode & hash, both of complexity ``O(S)``.
    - Up to one binary search and insert (``O(logS + S)``).
    - I/O: 1 read ``O(S)``, up to 1 mutate ``O(S)``. Up to one remove.
    - One event.
    - The weight of the `call`.
    - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
    taken for its lifetime of `DepositBase + threshold * DepositFactor`.

### `asMultiThreshold1(other_signatories: Vec<T::AccountId>, call: Box<RuntimeCall>)`

- **interface**: `api.tx.multisig.asMultiThreshold1`
- **summary**: Immediately dispatch a multi-signature call using a single approval from the caller.

    The dispatch origin for this call must be _Signed_.

    - `other_signatories`: The accounts (other than the sender) who are part of the
    multi-signature, but do not participate in the approval process.
    - `call`: The call to be executed.

    Result is equivalent to the dispatched result.

    **Complexity:**

    `O(Z + C)` where Z is the length of the call and C its execution weight.

### `cancelAsMulti(threshold: u16, other_signatories: Vec<T::AccountId>, timepoint: Timepoint<BlockNumberFor<T>>, call_hash: [u8; 32])`

- **interface**: `api.tx.multisig.cancelAsMulti`
- **summary**: Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously for this operation will be unreserved on success.

    The dispatch origin for this call must be _Signed_.

    - `threshold`: The total number of approvals for this dispatch before it is executed.
    - `other_signatories`: The accounts (other than the sender) who can approve this
    dispatch. May not be empty.
    - `timepoint`: The timepoint (block number and transaction index) of the first approval
    transaction for this dispatch.
    - `call_hash`: The hash of the call to be executed.

    **Complexity:**

    - ``O(S)``.
    - Up to one balance-reserve or unreserve operation.
    - One passthrough operation, one insert, both ``O(S)`` where `S` is the number of
    signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
    - One encode & hash, both of complexity ``O(S)``.
    - One event.
    - I/O: 1 read ``O(S)``, one remove.
    - Storage: removes one item.

### `pokeDeposit(threshold: u16, other_signatories: Vec<T::AccountId>, call_hash: [u8; 32])`

- **interface**: `api.tx.multisig.pokeDeposit`
- **summary**: Poke the deposit reserved for an existing multisig operation.

    The dispatch origin for this call must be _Signed_ and must be the original depositor of the multisig operation.

    The transaction fee is waived if the deposit amount has changed.

    - `threshold`: The total number of approvals needed for this multisig.
    - `other_signatories`: The accounts (other than the sender) who are part of the
    multisig.
    - `call_hash`: The hash of the call this deposit is reserved for.

    Emits `DepositPoked` if successful.


## `preimage`

### `ensureUpdated(hashes: Vec<T::Hash>)`

- **interface**: `api.tx.preimage.ensureUpdated`
- **summary**: Ensure that the bulk of pre-images is upgraded.

    The caller pays no fee if at least 90% of pre-images were successfully updated.

### `notePreimage(bytes: Vec<u8>)`

- **interface**: `api.tx.preimage.notePreimage`
- **summary**: Register a preimage on-chain.

    If the preimage was previously requested, no fees or deposits are taken for providing the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.

### `requestPreimage(hash: H256)`

- **interface**: `api.tx.preimage.requestPreimage`
- **summary**: Request a preimage be uploaded to the chain without paying any fees or deposits.

    If the preimage requests has already been provided on-chain, we unreserve any deposit a user may have paid, and take the control of the preimage out of their hands.

### `unnotePreimage(hash: H256)`

- **interface**: `api.tx.preimage.unnotePreimage`
- **summary**: Clear an unrequested preimage from the runtime storage.

    If `len` is provided, then it will be a much cheaper operation.

    - `hash`: The hash of the preimage to be removed from the store.
    - `len`: The length of the preimage of `hash`.

### `unrequestPreimage(hash: H256)`

- **interface**: `api.tx.preimage.unrequestPreimage`
- **summary**: Clear a previously made request for a preimage.

    NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.


## `proxy`

### `addProxy(delegate: MultiAddress, proxy_type: T::ProxyType, delay: u32)`

- **interface**: `api.tx.proxy.addProxy`
- **summary**: Register a proxy account for the sender that is able to make calls on its behalf.

    The dispatch origin for this call must be _Signed_.

    **Parameters:**

    - `proxy`: The account that the `caller` would like to make a proxy.
    - `proxy_type`: The permissions allowed for this proxy account.
    - `delay`: The announcement period required of the initial proxy. Will generally be
    zero.

### `announce(real: MultiAddress, call_hash: CallHashOf)`

- **interface**: `api.tx.proxy.announce`
- **summary**: Publish the hash of a proxy-call that will be made in the future.

    This must be called some number of blocks before the corresponding `proxy` is attempted if the delay associated with the proxy relationship is greater than zero.

    No more than `MaxPending` announcements may be made at any one time.

    This will take a deposit of `AnnouncementDepositFactor` as well as `AnnouncementDepositBase` if there are no other pending announcements.

    The dispatch origin for this call must be _Signed_ and a proxy of `real`.

    **Parameters:**

    - `real`: The account that the proxy will make a call on behalf of.
    - `call_hash`: The hash of the call to be made by the `real` account.

### `createPure(proxy_type: T::ProxyType, delay: u32, index: u16)`

- **interface**: `api.tx.proxy.createPure`
- **summary**: Spawn a fresh new account that is guaranteed to be otherwise inaccessible, and initialize it with a proxy of `proxy_type` for `origin` sender.

    Requires a `Signed` origin.

    - `proxy_type`: The type of the proxy that the sender will be registered as over the
    new account. This will almost always be the most permissive `ProxyType` possible to allow for maximum flexibility.
    - `index`: A disambiguation index, in case this is called multiple times in the same
    transaction (e.g. with `utility::batch`). Unless you're using `batch` you probably just want to use `0`.
    - `delay`: The announcement period required of the initial proxy. Will generally be
    zero.

    Fails with `Duplicate` if this has already been called in this transaction, from the same sender, with the same parameters.

    Fails if there are insufficient funds to pay for deposit.

### `killPure(spawner: MultiAddress, proxy_type: T::ProxyType, index: u16, height: u32, ext_index: u32)`

- **interface**: `api.tx.proxy.killPure`
- **summary**: Removes a previously spawned pure proxy.

    WARNING: **All access to this account will be lost.** Any funds held in it will be inaccessible.

    Requires a `Signed` origin, and the sender account must have been created by a call to `create_pure` with corresponding parameters.

    - `spawner`: The account that originally called `create_pure` to create this account.
    - `index`: The disambiguation index originally passed to `create_pure`. Probably `0`.
    - `proxy_type`: The proxy type originally passed to `create_pure`.
    - `height`: The height of the chain when the call to `create_pure` was processed.
    - `ext_index`: The extrinsic index in which the call to `create_pure` was processed.

    Fails with `NoPermission` in case the caller is not a previously created pure account whose `create_pure` call has corresponding parameters.

### `pokeDeposit()`

- **interface**: `api.tx.proxy.pokeDeposit`
- **summary**: Poke / Adjust deposits made for proxies and announcements based on current values. This can be used by accounts to possibly lower their locked amount.

    The dispatch origin for this call must be _Signed_.

    The transaction fee is waived if the deposit amount has changed.

    Emits `DepositPoked` if successful.

### `proxy(real: MultiAddress, force_proxy_type: Option<T::ProxyType>, call: Box<RuntimeCall>)`

- **interface**: `api.tx.proxy.proxy`
- **summary**: Dispatch the given `call` from an account that the sender is authorised for through `add_proxy`.

    The dispatch origin for this call must be _Signed_.

    **Parameters:**

    - `real`: The account that the proxy will make a call on behalf of.
    - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
    - `call`: The call to be made by the `real` account.

### `proxyAnnounced(delegate: MultiAddress, real: MultiAddress, force_proxy_type: Option<T::ProxyType>, call: Box<RuntimeCall>)`

- **interface**: `api.tx.proxy.proxyAnnounced`
- **summary**: Dispatch the given `call` from an account that the sender is authorized for through `add_proxy`.

    Removes any corresponding announcement(s).

    The dispatch origin for this call must be _Signed_.

    **Parameters:**

    - `real`: The account that the proxy will make a call on behalf of.
    - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
    - `call`: The call to be made by the `real` account.

### `rejectAnnouncement(delegate: MultiAddress, call_hash: CallHashOf)`

- **interface**: `api.tx.proxy.rejectAnnouncement`
- **summary**: Remove the given announcement of a delegate.

    May be called by a target (proxied) account to remove a call that one of their delegates (`delegate`) has announced they want to execute. The deposit is returned.

    The dispatch origin for this call must be _Signed_.

    **Parameters:**

    - `delegate`: The account that previously announced the call.
    - `call_hash`: The hash of the call to be made.

### `removeAnnouncement(real: MultiAddress, call_hash: CallHashOf)`

- **interface**: `api.tx.proxy.removeAnnouncement`
- **summary**: Remove a given announcement.

    May be called by a proxy account to remove a call they previously announced and return the deposit.

    The dispatch origin for this call must be _Signed_.

    **Parameters:**

    - `real`: The account that the proxy will make a call on behalf of.
    - `call_hash`: The hash of the call to be made by the `real` account.

### `removeProxies()`

- **interface**: `api.tx.proxy.removeProxies`
- **summary**: Unregister all proxy accounts for the sender.

    The dispatch origin for this call must be _Signed_.

    WARNING: This may be called on accounts created by `create_pure`, however if done, then the unreserved fees will be inaccessible. **All access to this account will be lost.**

### `removeProxy(delegate: MultiAddress, proxy_type: T::ProxyType, delay: u32)`

- **interface**: `api.tx.proxy.removeProxy`
- **summary**: Unregister a proxy account for the sender.

    The dispatch origin for this call must be _Signed_.

    **Parameters:**

    - `proxy`: The account that the `caller` would like to remove as a proxy.
    - `proxy_type`: The permissions currently enabled for the removed proxy account.

### `setRealPaysFee(delegate: MultiAddress, pays_fee: bool)`

- **interface**: `api.tx.proxy.setRealPaysFee`
- **summary**: Set whether the real account pays transaction fees for proxy calls made by a specific delegate.

    The dispatch origin for this call must be _Signed_ and must be the real (delegator) account that has an existing proxy relationship with the delegate.

    **Parameters:**

    - `delegate`: The proxy account for which to set the fee payment preference.
    - `pays_fee`: If `true`, the real account will pay fees for proxy calls made by
    this delegate. If `false`, the delegate pays (default behavior).


## `safeMode`

### `enter()`

- **interface**: `api.tx.safeMode.enter`
- **summary**: Enter safe-mode permissionlessly for [`Config::EnterDuration`] blocks.

    Reserves [`Config::EnterDepositAmount`] from the caller's account. Emits an [`Event::Entered`] event on success. Errors with [`Error::Entered`] if the safe-mode is already entered. Errors with [`Error::NotConfigured`] if the deposit amount is `None`.

### `extend()`

- **interface**: `api.tx.safeMode.extend`
- **summary**: Extend the safe-mode permissionlessly for [`Config::ExtendDuration`] blocks.

    This accumulates on top of the current remaining duration. Reserves [`Config::ExtendDepositAmount`] from the caller's account. Emits an [`Event::Extended`] event on success. Errors with [`Error::Exited`] if the safe-mode is entered. Errors with [`Error::NotConfigured`] if the deposit amount is `None`.

    This may be called by any signed origin with [`Config::ExtendDepositAmount`] free currency to reserve. This call can be disabled for all origins by configuring [`Config::ExtendDepositAmount`] to `None`.

### `forceEnter()`

- **interface**: `api.tx.safeMode.forceEnter`
- **summary**: Enter safe-mode by force for a per-origin configured number of blocks.

    Emits an [`Event::Entered`] event on success. Errors with [`Error::Entered`] if the safe-mode is already entered.

    Can only be called by the [`Config::ForceEnterOrigin`] origin.

### `forceExit()`

- **interface**: `api.tx.safeMode.forceExit`
- **summary**: Exit safe-mode by force.

    Emits an [`Event::Exited`] with [`ExitReason::Force`] event on success. Errors with [`Error::Exited`] if the safe-mode is inactive.

    Note: `safe-mode` will be automatically deactivated by [`Pallet::on_initialize`] hook after the block height is greater than the [`EnteredUntil`] storage item. Emits an [`Event::Exited`] with [`ExitReason::Timeout`] event when deactivated in the hook.

### `forceExtend()`

- **interface**: `api.tx.safeMode.forceExtend`
- **summary**: Extend the safe-mode by force for a per-origin configured number of blocks.

    Emits an [`Event::Extended`] event on success. Errors with [`Error::Exited`] if the safe-mode is inactive.

    Can only be called by the [`Config::ForceExtendOrigin`] origin.

### `forceReleaseDeposit(account: AccountId, block: u32)`

- **interface**: `api.tx.safeMode.forceReleaseDeposit`
- **summary**: Force to release a deposit for an account that entered safe-mode at a given historical block.

    This can be called while safe-mode is still entered.

    Emits a [`Event::DepositReleased`] event on success. Errors with [`Error::Entered`] if safe-mode is entered. Errors with [`Error::NoDeposit`] if the payee has no reserved currency at the specified block.

    Can only be called by the [`Config::ForceDepositOrigin`] origin.

### `forceSlashDeposit(account: AccountId, block: u32)`

- **interface**: `api.tx.safeMode.forceSlashDeposit`
- **summary**: Slash a deposit for an account that entered or extended safe-mode at a given historical block.

    This can only be called while safe-mode is entered.

    Emits a [`Event::DepositSlashed`] event on success. Errors with [`Error::Entered`] if safe-mode is entered.

    Can only be called by the [`Config::ForceDepositOrigin`] origin.

### `releaseDeposit(account: AccountId, block: u32)`

- **interface**: `api.tx.safeMode.releaseDeposit`
- **summary**: Permissionlessly release a deposit for an account that entered safe-mode at a given historical block.

    The call can be completely disabled by setting [`Config::ReleaseDelay`] to `None`. This cannot be called while safe-mode is entered and not until [`Config::ReleaseDelay`] blocks have passed since safe-mode was entered.

    Emits a [`Event::DepositReleased`] event on success. Errors with [`Error::Entered`] if the safe-mode is entered. Errors with [`Error::CannotReleaseYet`] if [`Config::ReleaseDelay`] block have not passed since safe-mode was entered. Errors with [`Error::NoDeposit`] if the payee has no reserved currency at the block specified.


## `scheduler`

### `cancel(when: u32, index: u32)`

- **interface**: `api.tx.scheduler.cancel`
- **summary**: Cancel an anonymously scheduled task.

### `cancelNamed(id: TaskName)`

- **interface**: `api.tx.scheduler.cancelNamed`
- **summary**: Cancel a named scheduled task.

### `cancelRetry(task: TaskAddress<BlockNumberFor<T>>)`

- **interface**: `api.tx.scheduler.cancelRetry`
- **summary**: Removes the retry configuration of a task.

### `cancelRetryNamed(id: TaskName)`

- **interface**: `api.tx.scheduler.cancelRetryNamed`
- **summary**: Cancel the retry configuration of a named task.

### `schedule(when: u32, maybe_periodic: Option<schedule::Period<BlockNumberFor<T>>>, priority: schedule::Priority, call: Box<RuntimeCall>)`

- **interface**: `api.tx.scheduler.schedule`
- **summary**: Anonymously schedule a task.

### `scheduleAfter(after: u32, maybe_periodic: Option<schedule::Period<BlockNumberFor<T>>>, priority: schedule::Priority, call: Box<RuntimeCall>)`

- **interface**: `api.tx.scheduler.scheduleAfter`
- **summary**: Anonymously schedule a task after a delay.

### `scheduleNamed(id: TaskName, when: u32, maybe_periodic: Option<schedule::Period<BlockNumberFor<T>>>, priority: schedule::Priority, call: Box<RuntimeCall>)`

- **interface**: `api.tx.scheduler.scheduleNamed`
- **summary**: Schedule a named task.

### `scheduleNamedAfter(id: TaskName, after: u32, maybe_periodic: Option<schedule::Period<BlockNumberFor<T>>>, priority: schedule::Priority, call: Box<RuntimeCall>)`

- **interface**: `api.tx.scheduler.scheduleNamedAfter`
- **summary**: Schedule a named task after a delay.

### `setRetry(task: TaskAddress<BlockNumberFor<T>>, retries: u8, period: u32)`

- **interface**: `api.tx.scheduler.setRetry`
- **summary**: Set a retry configuration for a task so that, in case its scheduled run fails, it will be retried after `period` blocks, for a total amount of `retries` retries or until it succeeds.

    Tasks which need to be scheduled for a retry are still subject to weight metering and agenda space, same as a regular task. If a periodic task fails, it will be scheduled normally while the task is retrying.

    Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic clones of the original task. Their retry configuration will be derived from the original task's configuration, but will have a lower value for `remaining` than the original `total_retries`.

### `setRetryNamed(id: TaskName, retries: u8, period: u32)`

- **interface**: `api.tx.scheduler.setRetryNamed`
- **summary**: Set a retry configuration for a named task so that, in case its scheduled run fails, it will be retried after `period` blocks, for a total amount of `retries` retries or until it succeeds.

    Tasks which need to be scheduled for a retry are still subject to weight metering and agenda space, same as a regular task. If a periodic task fails, it will be scheduled normally while the task is retrying.

    Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic clones of the original task. Their retry configuration will be derived from the original task's configuration, but will have a lower value for `remaining` than the original `total_retries`.


## `subtensorModule`

### `addStake(hotkey: AccountId, netuid: NetUid, amount_staked: TaoBalance)`

- **interface**: `api.tx.subtensorModule.addStake`
- **summary**: Adds stake to a hotkey. The call is made from a coldkey account. This delegates stake to the hotkey.

    **Note:**

    The coldkey account may own the hotkey, in which case they are delegating to themselves.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `hotkey`: The associated hotkey account.

    - `netuid`: Subnetwork UID.

    - `amount_staked`: The amount of stake to be added to the hotkey staking account.

    **Events:**

    - `StakeAdded`: On the successfully adding stake to a global account.

    **Errors:**

    - `NotEnoughBalanceToStake`: Not enough balance on the coldkey to add onto the global account.

    - `NonAssociatedColdKey`: The calling coldkey is not associated with this hotkey.

    - `BalanceWithdrawalError`: Errors stemming from transaction pallet.

### `addStakeBurn(hotkey: AccountId, netuid: NetUid, amount: TaoBalance, limit: Option<TaoBalance>)`

- **interface**: `api.tx.subtensorModule.addStakeBurn`
- **summary**: The extrinsic is a combination of add_stake(add_stake_limit) and burn_alpha. We buy alpha token first and immediately burn the acquired amount of alpha (aka Subnet buyback).

### `addStakeLimit(hotkey: AccountId, netuid: NetUid, amount_staked: TaoBalance, limit_price: TaoBalance, allow_partial: bool)`

- **interface**: `api.tx.subtensorModule.addStakeLimit`
- **summary**: Adds stake to a hotkey on a subnet with a price limit. This extrinsic allows to specify the limit price for alpha token at which or better (lower) the staking should execute.

    In case if slippage occurs and the price shall move beyond the limit price, the staking order may execute only partially or not execute at all.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `hotkey`: The associated hotkey account.

    - `netuid`: Subnetwork UID.

    - `amount_staked`: The amount of stake to be added to the hotkey staking account.

    - `limit_price`: The limit price expressed in units of RAO per one Alpha.

    - `allow_partial`: Allows partial execution of the amount. If set to false, this becomes
    fill or kill type of order.

    **Events:**

    - `StakeAdded`: On the successfully adding stake to a global account.

    **Errors:**

    - `NotEnoughBalanceToStake`: Not enough balance on the coldkey to add onto the global account.

    - `NonAssociatedColdKey`: The calling coldkey is not associated with this hotkey.

    - `BalanceWithdrawalError`: Errors stemming from transaction pallet.

### `announceColdkeySwap(new_coldkey_hash: H256)`

- **interface**: `api.tx.subtensorModule.announceColdkeySwap`
- **summary**: Announces a coldkey swap using BlakeTwo256 hash of the new coldkey.

    This is required before the coldkey swap can be performed after the delay period.

    It can be reannounced after a delay of `ColdkeySwapReannouncementDelay` following the first valid execution block of the original announcement.

    The dispatch origin of this call must be the original coldkey that made the announcement.

    - `new_coldkey_hash`: The hash of the new coldkey using BlakeTwo256.

    The `ColdkeySwapAnnounced` event is emitted on successful announcement.

### `associateEvmKey(netuid: NetUid, evm_key: H160, block_number: u64, signature: Signature)`

- **interface**: `api.tx.subtensorModule.associateEvmKey`
- **summary**: Attempts to associate a hotkey with an EVM key.

    The signature will be checked to see if the recovered public key matches the `evm_key` provided.

    The EVM key is expected to sign the message according to this formula to produce the signature: ```text keccak_256(hotkey ++ keccak_256(block_number)) ```

    **Arguments:**

    - `origin`: The origin of the transaction, which must be signed by the `hotkey`.
    - `netuid`: The netuid that the `hotkey` belongs to.
    - `evm_key`: The EVM key to associate with the `hotkey`.
    - `block_number`: The block number used in the `signature`.
    - `signature`: A signed message by the `evm_key` containing the `hotkey` and the hashed `block_number`.

    **Errors:**

    - `BadOrigin`: The transaction is not signed.
    - `SubnetNotExists`: The subnet identified by `netuid` does not exist.
    - `NonAssociatedColdKey`: The hotkey is not associated with a coldkey.
    - `HotKeyNotRegisteredInSubNet`: The hotkey is not registered on the subnet identified by `netuid`.
    - `EvmKeyAssociateRateLimitExceeded`: The association rate limit has not elapsed since the last association.
    - `InvalidIdentity`: The public key cannot be recovered from the signature.
    - `UnableToRecoverPublicKey`: The recovered public key cannot be parsed.
    - `InvalidRecoveredPublicKey`: The EVM key recovered from the signature does not match the given `evm_key`.
    - `EvmKeyAssociationLimitExceeded`: The EVM key is already associated with the maximum number of UIDs.

    **Events:**

    May emit a `EvmKeyAssociated` event on success

### `batchCommitWeights(netuids: Vec<Compact<NetUid>>, commit_hashes: Vec<H256>)`

- **interface**: `api.tx.subtensorModule.batchCommitWeights`
- **summary**: Allows a hotkey to commit weight hashes for multiple netuids as a batch.

    **Arguments:**

    - `origin`: The caller, a hotkey who wishes to set their weights.

    - `netuids`: The network uids we are setting these weights on.

    - `commit_hashes`: The commit hashes to commit.

    **Events:**

    - `WeightsSet`: On successfully setting the weights on chain.
    - `BatchWeightsCompleted`: On success of the batch.
    - `BatchCompletedWithErrors`: On failure of any of the weights in the batch.
    - `BatchWeightItemFailed`: On failure for each failed item in the batch.

### `batchRevealWeights(netuid: NetUid, uids_list: Vec<Vec<u16>>, values_list: Vec<Vec<u16>>, salts_list: Vec<Vec<u16>>, version_keys: Vec<u64>)`

- **interface**: `api.tx.subtensorModule.batchRevealWeights`
- **summary**: The implementation for batch revealing committed weights.

    **Arguments:**

    - `origin`: The signature of the revealing hotkey.

    - `netuid`: The u16 network identifier.

    - `uids_list`: A list of uids for each set of weights being revealed.

    - `values_list`: A list of values for each set of weights being revealed.

    - `salts_list`: A list of salts used to generate the commit hashes.

    - `version_keys`: A list of network version keys.

    **Errors:**

    - `CommitRevealDisabled`: Attempting to reveal weights when the commit-reveal mechanism is disabled.

    - `NoWeightsCommitFound`: Attempting to reveal weights without an existing commit.

    - `ExpiredWeightCommit`: Attempting to reveal a weight commit that has expired.

    - `RevealTooEarly`: Attempting to reveal weights outside the valid reveal period.

    - `InvalidRevealCommitHashNotMatch`: The revealed hash does not match any committed hash.

    - `InvalidInputLengths`: The input vectors are of mismatched lengths.

### `batchSetWeights(netuids: Vec<Compact<NetUid>>, weights: Vec<Vec<(Compact<u16>, Compact<u16>)>>, version_keys: Vec<Compact<u64>>)`

- **interface**: `api.tx.subtensorModule.batchSetWeights`
- **summary**: Allows a hotkey to set weights for multiple netuids as a batch.

    **Arguments:**

    - `origin`: The caller, a hotkey who wishes to set their weights.

    - `netuids`: The network uids we are setting these weights on.

    - `weights`: The weights to set for each network. [(uid, weight), ...].

    - `version_keys`: The network version keys to check if the validator is up to date.

    **Events:**

    - `WeightsSet`: On successfully setting the weights on chain.
    - `BatchWeightsCompleted`: On success of the batch.
    - `BatchCompletedWithErrors`: On failure of any of the weights in the batch.
    - `BatchWeightItemFailed`: On failure for each failed item in the batch.

### `burnAlpha(hotkey: AccountId, amount: AlphaBalance, netuid: NetUid)`

- **interface**: `api.tx.subtensorModule.burnAlpha`
- **summary**: Burns alpha from a cold/hot key pair without reducing `AlphaOut`

    **Arguments:**

    - `origin`: The origin of the call (must be signed by the coldkey)
    - `hotkey`: The hotkey account
    - `amount`: The amount of alpha to burn
    - `netuid`: The subnet ID

    **Events:**

    Emits a `TokensBurned` event on success.

### `burnedRegister(netuid: NetUid, hotkey: AccountId)`

- **interface**: `api.tx.subtensorModule.burnedRegister`
- **summary**: User register a new subnetwork via burning token

### `claimRoot(subnets: BTreeSet<NetUid>)`

- **interface**: `api.tx.subtensorModule.claimRoot`
- **summary**: Claims the root emissions for a coldkey.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    **Events:**

    - `RootClaimed`: On the successfully claiming the root emissions for a coldkey.

    **Errors:**

    - `InvalidSubnetNumber`: The subnet set is empty or exceeds the maximum number of claims.

### `clearColdkeySwapAnnouncement()`

- **interface**: `api.tx.subtensorModule.clearColdkeySwapAnnouncement`
- **summary**: Clears a coldkey swap announcement after the reannouncement delay if it has not been disputed.

    The `ColdkeySwapCleared` event is emitted on successful clear.

### `commitCrv3MechanismWeights(netuid: NetUid, mecid: MechId, commit: BoundedVec<u8, ConstU32<MAX_CRV3_COMMIT_SIZE_BYTES>>, reveal_round: u64)`

- **interface**: `api.tx.subtensorModule.commitCrv3MechanismWeights`
- **summary**: Used to commit encrypted commit-reveal v3 weight values to later be revealed for mechanisms.

    **Arguments:**

    - `origin`: The committing hotkey.

    - `netuid`: The u16 network identifier.

    - `mecid`: The u8 mechanism identifier.

    - `commit`: The encrypted compressed commit.
    The steps for this are:
    1. Instantiate [`WeightsTlockPayload`]
    2. Serialize it using the `parity_scale_codec::Encode` trait
    3. Encrypt it following the steps (here)[https://github.com/ideal-lab5/tle/blob/f8e6019f0fb02c380ebfa6b30efb61786dede07b/timelock/src/tlock.rs#L283-L336]
    to produce a [`TLECiphertext<TinyBLS381>`] type.
    4. Serialize and compress using the `ark-serialize` `CanonicalSerialize` trait.

    - `reveal_round`: The drand reveal round which will be avaliable during epoch `n+1` from the current
    epoch.

    **Errors:**

    - `CommitRevealV3Disabled`: Attempting to commit when the commit-reveal mechanism is disabled.

    - `TooManyUnrevealedCommits`: Attempting to commit when the user has more than the allowed limit of unrevealed commits.

### `commitMechanismWeights(netuid: NetUid, mecid: MechId, commit_hash: H256)`

- **interface**: `api.tx.subtensorModule.commitMechanismWeights`
- **summary**: Used to commit a hash of your weight values to later be revealed for mechanisms.

    **Arguments:**

    - `origin`: The signature of the committing hotkey.

    - `netuid`: The u16 network identifier.

    - `mecid`: The u8 mechanism identifier.

    - `commit_hash`: The hash representing the committed weights.

    **Errors:**

    - `CommitRevealDisabled`: Attempting to commit when the commit-reveal mechanism is disabled.

    - `TooManyUnrevealedCommits`: Attempting to commit when the user has more than the allowed limit of unrevealed commits.

### `commitTimelockedMechanismWeights(netuid: NetUid, mecid: MechId, commit: BoundedVec<u8, ConstU32<MAX_CRV3_COMMIT_SIZE_BYTES>>, reveal_round: u64, commit_reveal_version: u16)`

- **interface**: `api.tx.subtensorModule.commitTimelockedMechanismWeights`
- **summary**: Used to commit timelock encrypted commit-reveal weight values to later be revealed for a mechanism.

    **Arguments:**

    - `origin`: The committing hotkey.

    - `netuid`: The u16 network identifier.

    - `mecid`: The u8 mechanism identifier.

    - `commit`: The encrypted compressed commit.
    The steps for this are:
    1. Instantiate [`WeightsTlockPayload`]
    2. Serialize it using the `parity_scale_codec::Encode` trait
    3. Encrypt it following the steps (here)[https://github.com/ideal-lab5/tle/blob/f8e6019f0fb02c380ebfa6b30efb61786dede07b/timelock/src/tlock.rs#L283-L336]
    to produce a [`TLECiphertext<TinyBLS381>`] type.
    4. Serialize and compress using the `ark-serialize` `CanonicalSerialize` trait.

    - `reveal_round`: The drand reveal round which will be avaliable during epoch `n+1` from the current
    epoch.

    - `commit_reveal_version`: The client (bittensor-drand) version.

### `commitTimelockedWeights(netuid: NetUid, commit: BoundedVec<u8, ConstU32<MAX_CRV3_COMMIT_SIZE_BYTES>>, reveal_round: u64, commit_reveal_version: u16)`

- **interface**: `api.tx.subtensorModule.commitTimelockedWeights`
- **summary**: Used to commit timelock encrypted commit-reveal weight values to later be revealed.

    **Arguments:**

    - `origin`: The committing hotkey.

    - `netuid`: The u16 network identifier.

    - `commit`: The encrypted compressed commit.
    The steps for this are:
    1. Instantiate [`WeightsTlockPayload`]
    2. Serialize it using the `parity_scale_codec::Encode` trait
    3. Encrypt it following the steps (here)[https://github.com/ideal-lab5/tle/blob/f8e6019f0fb02c380ebfa6b30efb61786dede07b/timelock/src/tlock.rs#L283-L336]
    to produce a [`TLECiphertext<TinyBLS381>`] type.
    4. Serialize and compress using the `ark-serialize` `CanonicalSerialize` trait.

    - `reveal_round`: The drand reveal round which will be avaliable during epoch `n+1` from the current
    epoch.

    - `commit_reveal_version`: The client (bittensor-drand) version.

### `commitWeights(netuid: NetUid, commit_hash: H256)`

- **interface**: `api.tx.subtensorModule.commitWeights`
- **summary**: Used to commit a hash of your weight values to later be revealed.

    **Arguments:**

    - `origin`: The signature of the committing hotkey.

    - `netuid`: The u16 network identifier.

    - `commit_hash`: The hash representing the committed weights.

    **Errors:**

    - `CommitRevealDisabled`: Attempting to commit when the commit-reveal mechanism is disabled.

    - `TooManyUnrevealedCommits`: Attempting to commit when the user has more than the allowed limit of unrevealed commits.

### `decreaseTake(hotkey: AccountId, take: PerU16)`

- **interface**: `api.tx.subtensorModule.decreaseTake`
- **summary**: Allows delegates to decrease its take value.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `hotkey`: The hotkey we are delegating (must be owned by the coldkey).

    - `netuid`: Subnet ID to decrease take for.

    - `take`: The new stake proportion that this hotkey takes from delegations.
    The new value can be between 0 and 11_796 parts and should be strictly lower than the previous value. If T is the new value (rational number), the the parameter is calculated as [65535 * T]. For example, 1% would be [0.01 * 65535] = [655.35] = 655

    **Events:**

    - `TakeDecreased`: On successfully setting a decreased take for this hotkey.

    **Errors:**

    - `NotRegistered`: The hotkey we are delegating is not registered on the network.

    - `NonAssociatedColdKey`: The hotkey we are delegating is not owned by the calling coldkey.

    - `DelegateTakeTooLow`: The delegate is setting a take which is not lower than the previous.

### `disableVotingPowerTracking(netuid: NetUid)`

- **interface**: `api.tx.subtensorModule.disableVotingPowerTracking`
- **summary**: Schedules disabling of voting power tracking for a subnet.

    This function can be called by the subnet owner or root. Voting power tracking will continue for 14 days (grace period) after this call, then automatically disable and clear all VotingPower entries for the subnet.

    **Arguments:**

    - `origin`: The origin of the call, must be subnet owner or root.
    - `netuid`: The subnet to schedule disabling voting power tracking for.

    **Errors:**

    - `SubnetNotExist`: If the subnet does not exist.
    - `NotSubnetOwner`: If the caller is not the subnet owner or root.
    - `VotingPowerTrackingNotEnabled`: If voting power tracking is not enabled.

### `disputeColdkeySwap()`

- **interface**: `api.tx.subtensorModule.disputeColdkeySwap`
- **summary**: Dispute a coldkey swap.

    This will prevent any further actions on the coldkey swap until triumvirate step in to resolve the issue.

    - `coldkey`: The coldkey to dispute the swap for.

### `dissolveNetwork(coldkey: AccountId, netuid: NetUid)`

- **interface**: `api.tx.subtensorModule.dissolveNetwork`
- **summary**: Remove a user's subnetwork The caller must be the owner of the network

### `enableVotingPowerTracking(netuid: NetUid)`

- **interface**: `api.tx.subtensorModule.enableVotingPowerTracking`
- **summary**: Enables voting power tracking for a subnet.

    This function can be called by the subnet owner or root. When enabled, voting power EMA is updated every epoch for all validators. Voting power starts at 0 and increases over epochs.

    **Arguments:**

    - `origin`: The origin of the call, must be subnet owner or root.
    - `netuid`: The subnet to enable voting power tracking for.

    **Errors:**

    - `SubnetNotExist`: If the subnet does not exist.
    - `NotSubnetOwner`: If the caller is not the subnet owner or root.

### `increaseTake(hotkey: AccountId, take: PerU16)`

- **interface**: `api.tx.subtensorModule.increaseTake`
- **summary**: Allows delegates to increase its take value. This call is rate-limited.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `hotkey`: The hotkey we are delegating (must be owned by the coldkey).

    - `take`: The new stake proportion that this hotkey takes from delegations.
    The new value can be between 0 and 11_796 parts and should be strictly greater than the previous value. T is the new value (rational number), the the parameter is calculated as [65535 * T]. For example, 1% would be [0.01 * 65535] = [655.35] = 655

    **Events:**

    - `TakeIncreased`: On successfully setting a increased take for this hotkey.

    **Errors:**

    - `NotRegistered`: The hotkey we are delegating is not registered on the network.

    - `NonAssociatedColdKey`: The hotkey we are delegating is not owned by the calling coldkey.

    - `DelegateTakeTooHigh`: The delegate is setting a take which is not greater than the previous.

### `lockStake(hotkey: AccountId, netuid: NetUid, amount: AlphaBalance)`

- **interface**: `api.tx.subtensorModule.lockStake`
- **summary**: Locks stake on a subnet to a specific hotkey, building conviction over time.

    If no lock exists for (coldkey, subnet), a new one is created. If a lock exists, the destination hotkey must match the existing lock's hotkey. Top-up adds to the locked amount after rolling the lock state forward.

    **Arguments:**

    - `origin`: Must be signed by the coldkey.
    - `hotkey`: The hotkey to lock stake to.
    - `netuid`: The subnet on which to lock.
    - `amount`: The alpha amount to lock.

### `moveLock(destination_hotkey: AccountId, netuid: NetUid)`

- **interface**: `api.tx.subtensorModule.moveLock`
- **summary**: Moves an existing lock for a coldkey on a subnet from one hotkey to another.

    The lock is rolled forward to the current block before switching the associated hotkey, preserving the decayed locked mass. The conviction is reset to zero.

    **Arguments:**

    - `origin`: Must be signed by the coldkey that owns the lock.
    - `destination_hotkey`: The hotkey the lock should target after the move.
    - `netuid`: The subnet on which the lock exists.

    **Errors:**

    - `Error::<T>::NoExistingLock`: If no lock exists for the given coldkey and subnet.

### `moveStake(origin_hotkey: AccountId, destination_hotkey: AccountId, origin_netuid: NetUid, destination_netuid: NetUid, alpha_amount: AlphaBalance)`

- **interface**: `api.tx.subtensorModule.moveStake`
- **summary**: The implementation for the extrinsic move_stake: Moves specified amount of stake from a hotkey to another across subnets.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `origin_hotkey`: The hotkey account to move stake from.

    - `destination_hotkey`: The hotkey account to move stake to.

    - `origin_netuid`: The subnet ID to move stake from.

    - `destination_netuid`: The subnet ID to move stake to.

    - `alpha_amount`: The alpha stake amount to move.

### `recycleAlpha(hotkey: AccountId, amount: AlphaBalance, netuid: NetUid)`

- **interface**: `api.tx.subtensorModule.recycleAlpha`
- **summary**: Recycles alpha from a cold/hot key pair, reducing AlphaOut on a subnet

    **Arguments:**

    - `origin`: The origin of the call (must be signed by the coldkey)
    - `hotkey`: The hotkey account
    - `amount`: The amount of alpha to recycle
    - `netuid`: The subnet ID

    **Events:**

    Emits a `TokensRecycled` event on success.

### `register(netuid: NetUid, block_number: u64, nonce: u64, work: Vec<u8>, hotkey: AccountId, coldkey: AccountId)`

- **interface**: `api.tx.subtensorModule.register`
- **summary**: Registers a new neuron to the subnetwork.

    **Arguments:**

    - `origin`: The signature of the calling hotkey.

    - `netuid`: The u16 network identifier.

    - `block_number`: Block hash used to prove work done.

    - `nonce`: Positive integer nonce used in POW.

    - `work`: Vector encoded bytes representing work done.

    - `hotkey`: Hotkey to be registered to the network.

    - `coldkey`: Associated coldkey account.

    **Events:**

    - `NeuronRegistered`: On successfully registering a uid to a neuron slot on a subnetwork.

    **Errors:**

    - `MechanismDoesNotExist`: Attempting to register to a non existent network.

    - `TooManyRegistrationsThisBlock`: This registration exceeds the total allowed on this network this block.

    - `HotKeyAlreadyRegisteredInSubNet`: The hotkey is already registered on this network.

    - `InvalidWorkBlock`: The work has been performed on a stale, future, or non existent block.

    - `InvalidDifficulty`: The work does not match the difficulty.

    - `InvalidSeal`: The seal is incorrect.

### `registerLeasedNetwork(emissions_share: Percent, end_block: Option<BlockNumberFor<T>>)`

- **interface**: `api.tx.subtensorModule.registerLeasedNetwork`
- **summary**: Register a new leased network.

    The crowdloan's contributions are used to compute the share of the emissions that the contributors will receive as dividends.

    The leftover cap is refunded to the contributors and the beneficiary.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `emissions_share`: The share of the emissions that the contributors will receive as dividends.

    - `end_block`: The block at which the lease will end. If not defined, the lease is perpetual.

### `registerLimit(netuid: NetUid, hotkey: AccountId, limit_price: u64)`

- **interface**: `api.tx.subtensorModule.registerLimit`
- **summary**: User register a new subnetwork via burning token, but only if the on-chain burn price for this block is \<= `limit_price`.

    `limit_price` is expressed in the same TaoCurrency/u64 units as `Burn`.

### `registerNetwork(hotkey: AccountId)`

- **interface**: `api.tx.subtensorModule.registerNetwork`
- **summary**: User register a new subnetwork

### `registerNetworkWithIdentity(hotkey: AccountId, identity: Option<SubnetIdentityOfV3>)`

- **interface**: `api.tx.subtensorModule.registerNetworkWithIdentity`
- **summary**: User register a new subnetwork

### `removeStake(hotkey: AccountId, netuid: NetUid, amount_unstaked: AlphaBalance)`

- **interface**: `api.tx.subtensorModule.removeStake`
- **summary**: Remove stake from the staking account. The call must be made from the coldkey account attached to the neuron metadata. Only this key has permission to make staking and unstaking requests.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `hotkey`: The associated hotkey account.

    - `netuid`: Subnetwork UID.

    - `amount_unstaked`: The amount of stake to be added to the hotkey staking account.

    **Events:**

    - `StakeRemoved`: On the successfully removing stake from the hotkey account.

    **Errors:**

    - `NotRegistered`: Thrown if the account we are attempting to unstake from is non existent.

    - `NonAssociatedColdKey`: Thrown if the coldkey does not own the hotkey we are unstaking from.

    - `NotEnoughStakeToWithdraw`: Thrown if there is not enough stake on the hotkey to withdwraw this amount.

### `removeStakeFullLimit(hotkey: AccountId, netuid: NetUid, limit_price: Option<TaoBalance>)`

- **interface**: `api.tx.subtensorModule.removeStakeFullLimit`
- **summary**: Removes all stake from a hotkey on a subnet with a price limit. This extrinsic allows to specify the limit price for alpha token at which or better (higher) the staking should execute. Without limit_price it remove all the stake similar to `remove_stake` extrinsic

### `removeStakeLimit(hotkey: AccountId, netuid: NetUid, amount_unstaked: AlphaBalance, limit_price: TaoBalance, allow_partial: bool)`

- **interface**: `api.tx.subtensorModule.removeStakeLimit`
- **summary**: Removes stake from a hotkey on a subnet with a price limit. This extrinsic allows to specify the limit price for alpha token at which or better (higher) the staking should execute.

    In case if slippage occurs and the price shall move beyond the limit price, the staking order may execute only partially or not execute at all.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `hotkey`: The associated hotkey account.

    - `netuid`: Subnetwork UID.

    - `amount_unstaked`: The amount of stake to be added to the hotkey staking account.

    - `limit_price`: The limit price expressed in units of RAO per one Alpha.

    - `allow_partial`: Allows partial execution of the amount. If set to false, this becomes
    fill or kill type of order.

    **Events:**

    - `StakeRemoved`: On the successfully removing stake from the hotkey account.

    **Errors:**

    - `NotRegistered`: Thrown if the account we are attempting to unstake from is non existent.

    - `NonAssociatedColdKey`: Thrown if the coldkey does not own the hotkey we are unstaking from.

    - `NotEnoughStakeToWithdraw`: Thrown if there is not enough stake on the hotkey to withdwraw this amount.

### `resetColdkeySwap(coldkey: AccountId)`

- **interface**: `api.tx.subtensorModule.resetColdkeySwap`
- **summary**: Reset a coldkey swap by clearing the announcement and dispute status.

    The dispatch origin of this call must be root.

    - `coldkey`: The coldkey to reset the swap for.

### `revealMechanismWeights(netuid: NetUid, mecid: MechId, uids: Vec<u16>, values: Vec<u16>, salt: Vec<u16>, version_key: u64)`

- **interface**: `api.tx.subtensorModule.revealMechanismWeights`
- **summary**: Used to reveal the weights for a previously committed hash for mechanisms.

    **Arguments:**

    - `origin`: The signature of the revealing hotkey.

    - `netuid`: The u16 network identifier.

    - `mecid`: The u8 mechanism identifier.

    - `uids`: The uids for the weights being revealed.

    - `values`: The values of the weights being revealed.

    - `salt`: The salt used to generate the commit hash.

    - `version_key`: The network version key.

    **Errors:**

    - `CommitRevealDisabled`: Attempting to reveal weights when the commit-reveal mechanism is disabled.

    - `NoWeightsCommitFound`: Attempting to reveal weights without an existing commit.

    - `ExpiredWeightCommit`: Attempting to reveal a weight commit that has expired.

    - `RevealTooEarly`: Attempting to reveal weights outside the valid reveal period.

    - `InvalidRevealCommitHashNotMatch`: The revealed hash does not match any committed hash.

### `revealWeights(netuid: NetUid, uids: Vec<u16>, values: Vec<u16>, salt: Vec<u16>, version_key: u64)`

- **interface**: `api.tx.subtensorModule.revealWeights`
- **summary**: Used to reveal the weights for a previously committed hash.

    **Arguments:**

    - `origin`: The signature of the revealing hotkey.

    - `netuid`: The u16 network identifier.

    - `uids`: The uids for the weights being revealed.

    - `values`: The values of the weights being revealed.

    - `salt`: The salt used to generate the commit hash.

    - `version_key`: The network version key.

    **Errors:**

    - `CommitRevealDisabled`: Attempting to reveal weights when the commit-reveal mechanism is disabled.

    - `NoWeightsCommitFound`: Attempting to reveal weights without an existing commit.

    - `ExpiredWeightCommit`: Attempting to reveal a weight commit that has expired.

    - `RevealTooEarly`: Attempting to reveal weights outside the valid reveal period.

    - `InvalidRevealCommitHashNotMatch`: The revealed hash does not match any committed hash.

### `rootDissolveNetwork(netuid: NetUid)`

- **interface**: `api.tx.subtensorModule.rootDissolveNetwork`
- **summary**: Remove a subnetwork The caller must be root

### `rootRegister(hotkey: AccountId)`

- **interface**: `api.tx.subtensorModule.rootRegister`
- **summary**: Register the hotkey to root network

### `scheduleSwapColdkey(new_coldkey: AccountId)`

- **interface**: `api.tx.subtensorModule.scheduleSwapColdkey`
- **summary**: Schedules a coldkey swap operation to be executed at a future block.

    **Note:**

    This function is deprecated; please migrate to `announce_coldkey_swap` / `coldkey_swap`.

### `serveAxon(netuid: NetUid, version: u32, ip: u128, port: u16, ip_type: u8, protocol: u8, placeholder1: u8, placeholder2: u8)`

- **interface**: `api.tx.subtensorModule.serveAxon`
- **summary**: Serves or updates axon /prometheus information for the neuron associated with the caller. If the caller is already registered the metadata is updated. If the caller is not registered this call throws NotRegistered.

    **Arguments:**

    - `origin`: The signature of the caller.

    - `netuid`: The u16 network identifier.

    - `version`: The bittensor version identifier.

    - `ip`: The endpoint ip information as a u128 encoded integer.

    - `port`: The endpoint port information as a u16 encoded integer.

    - `ip_type`: The endpoint ip version as a u8, 4 or 6.

    - `protocol`: UDP:1 or TCP:0.

    - `placeholder1`: Placeholder for further extra params.

    - `placeholder2`: Placeholder for further extra params.

    **Events:**

    - `AxonServed`: On successfully serving the axon info.

    **Errors:**

    - `MechanismDoesNotExist`: Attempting to set weights on a non-existent network.

    - `NotRegistered`: Attempting to set weights from a non registered account.

    - `InvalidIpType`: The ip type is not 4 or 6.

    - `InvalidIpAddress`: The numerically encoded ip address does not resolve to a proper ip.

    - `ServingRateLimitExceeded`: Attempting to set prometheus information withing the rate limit min.

### `serveAxonTls(netuid: NetUid, version: u32, ip: u128, port: u16, ip_type: u8, protocol: u8, placeholder1: u8, placeholder2: u8, certificate: Vec<u8>)`

- **interface**: `api.tx.subtensorModule.serveAxonTls`
- **summary**: Same as `serve_axon` but takes a certificate as an extra optional argument. Serves or updates axon /prometheus information for the neuron associated with the caller. If the caller is already registered the metadata is updated. If the caller is not registered this call throws NotRegistered.

    **Arguments:**

    - `origin`: The signature of the caller.

    - `netuid`: The u16 network identifier.

    - `version`: The bittensor version identifier.

    - `ip`: The endpoint ip information as a u128 encoded integer.

    - `port`: The endpoint port information as a u16 encoded integer.

    - `ip_type`: The endpoint ip version as a u8, 4 or 6.

    - `protocol`: UDP:1 or TCP:0.

    - `placeholder1`: Placeholder for further extra params.

    - `placeholder2`: Placeholder for further extra params.

    - `certificate`: TLS certificate for inter neuron communitation.

    **Events:**

    - `AxonServed`: On successfully serving the axon info.

    **Errors:**

    - `MechanismDoesNotExist`: Attempting to set weights on a non-existent network.

    - `NotRegistered`: Attempting to set weights from a non registered account.

    - `InvalidIpType`: The ip type is not 4 or 6.

    - `InvalidIpAddress`: The numerically encoded ip address does not resolve to a proper ip.

    - `ServingRateLimitExceeded`: Attempting to set prometheus information withing the rate limit min.

### `servePrometheus(netuid: NetUid, version: u32, ip: u128, port: u16, ip_type: u8)`

- **interface**: `api.tx.subtensorModule.servePrometheus`
- **summary**: Set prometheus information for the neuron.

    **Arguments:**

    - `origin`: The signature of the calling hotkey.

    - `netuid`: The u16 network identifier.

    - `version`: The bittensor version identifier.

    - `ip`: The prometheus ip information as a u128 encoded integer.

    - `port`: The prometheus port information as a u16 encoded integer.

    - `ip_type`: The ip type v4 or v6.

### `setActivityCutoffFactor(netuid: NetUid, factor_milli: u32)`

- **interface**: `api.tx.subtensorModule.setActivityCutoffFactor`
- **summary**: Deprecated compatibility entry point retained for call-index stability. This call charges a fee, returns success, and does not modify state. Use `AdminUtils::sudo_set_activity_cutoff_factor` to change the factor.

### `setAutoParentDelegationEnabled(hotkey: AccountId, enabled: bool)`

- **interface**: `api.tx.subtensorModule.setAutoParentDelegationEnabled`
- **summary**: Allows a root validator to toggle auto parent delegation for new subnets owner hotkey

### `setChildkeyTake(hotkey: AccountId, netuid: NetUid, take: PerU16)`

- **interface**: `api.tx.subtensorModule.setChildkeyTake`
- **summary**: Sets the childkey take for a given hotkey.

    This function allows a coldkey to set the childkey take for a given hotkey. The childkey take determines the proportion of stake that the hotkey keeps for itself when distributing stake to its children.

    **Arguments:**

    - `origin`: The signature of the calling coldkey. Setting childkey take can only be done by the coldkey.

    - `hotkey`: The hotkey for which the childkey take will be set.

    - `take`: The new childkey take value. This is a ratio represented in parts per 65535,
    where 65535 represents 100%.

    **Events:**

    - `ChildkeyTakeSet`: On successfully setting the childkey take for a hotkey.

    **Errors:**

    - `NonAssociatedColdKey`: The coldkey does not own the hotkey.
    - `InvalidChildkeyTake`: The provided take value is invalid (greater than the maximum allowed take).
    - `TxChildkeyTakeRateLimitExceeded`: The rate limit for changing childkey take has been exceeded.

### `setChildren(hotkey: AccountId, netuid: NetUid, children: Vec<(u64, T::AccountId)>)`

- **interface**: `api.tx.subtensorModule.setChildren`
- **summary**: Set a single child for a given hotkey on a specified network.

    This function allows a coldkey to set a single child for a given hotkey on a specified network. The proportion of the hotkey's stake to be allocated to the child is also specified.

    **Arguments:**

    - `origin`: The signature of the calling coldkey. Setting a hotkey child can only be done by the coldkey.

    - `hotkey`: The hotkey which will be assigned the child.

    - `child`: The child which will be assigned to the hotkey.

    - `netuid`: The u16 network identifier where the childkey will exist.

    - `proportion`: Proportion of the hotkey's stake to be given to the child, the value must be u64 normalized.

    **Events:**

    - `ChildAddedSingular`: On successfully registering a child to a hotkey.

    **Errors:**

    - `MechanismDoesNotExist`: Attempting to register to a non-existent network.
    - `RegistrationNotPermittedOnRootSubnet`: Attempting to register a child on the root network.
    - `NonAssociatedColdKey`: The coldkey does not own the hotkey or the child is the same as the hotkey.
    - `HotKeyAccountNotExists`: The hotkey account does not exist.

    **Note:**

    1. **Signature Verification**: Ensures that the caller has signed the transaction, verifying the coldkey.
    2. **Root Network Check**: Ensures that the delegation is not on the root network, as child hotkeys are not valid on the root.
    3. **Network Existence Check**: Ensures that the specified network exists.
    4. **Ownership Verification**: Ensures that the coldkey owns the hotkey.
    5. **Hotkey Account Existence Check**: Ensures that the hotkey account already exists.
    6. **Child-Hotkey Distinction**: Ensures that the child is not the same as the hotkey.
    7. **Old Children Cleanup**: Removes the hotkey from the parent list of its old children.
    8. **New Children Assignment**: Assigns the new child to the hotkey and updates the parent list for the new child.

### `setColdkeyAutoStakeHotkey(netuid: NetUid, hotkey: AccountId)`

- **interface**: `api.tx.subtensorModule.setColdkeyAutoStakeHotkey`
- **summary**: Set the autostake destination hotkey for a coldkey.

    The caller selects a hotkey where all future rewards will be automatically staked.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `hotkey`: The hotkey account to designate as the autostake destination.

### `setIdentity(name: Vec<u8>, url: Vec<u8>, github_repo: Vec<u8>, image: Vec<u8>, discord: Vec<u8>, description: Vec<u8>, additional: Vec<u8>)`

- **interface**: `api.tx.subtensorModule.setIdentity`
- **summary**: Set prometheus information for the neuron.

    **Arguments:**

    - `origin`: The signature of the calling hotkey.

    - `netuid`: The u16 network identifier.

    - `version`: The bittensor version identifier.

    - `ip`: The prometheus ip information as a u128 encoded integer.

    - `port`: The prometheus port information as a u16 encoded integer.

    - `ip_type`: The ip type v4 or v6.

### `setMechanismWeights(netuid: NetUid, mecid: MechId, dests: Vec<u16>, weights: Vec<u16>, version_key: u64)`

- **interface**: `api.tx.subtensorModule.setMechanismWeights`
- **summary**: Sets the caller weights for the incentive mechanism for mechanisms. The call can be made from the hotkey account so is potentially insecure, however, the damage of changing weights is minimal if caught early. This function includes all the checks that the passed weights meet the requirements. Stored weights are u16s max-upscaled by the pallet, so the largest non-zero supplied weight is stored as `u16::MAX`. The weights determine how inflation propagates outward from this peer.

    **Note:**

    Input weights are relative. They do not need to sum to a particular value before submission.

    **Arguments:**

    - `origin`: The caller, a hotkey who wishes to set their weights.

    - `netuid`: The network uid we are setting these weights on.

    - `mecid`: The u8 mechnism identifier.

    - `dests`: The edge endpoint for the weight, i.e. j for w_ij.

    - `weights`: Relative u16-encoded weights, max-upscaled by the pallet before storage.

    - `version_key`: The network version key to check if the validator is up to date.

    **Events:**

    - `WeightsSet`: On successfully setting the weights on chain.

    **Errors:**

    - `MechanismDoesNotExist`: Attempting to set weights on a non-existent network.

    - `NotRegistered`: Attempting to set weights from a non registered account.

    - `WeightVecNotEqualSize`: Attempting to set weights with uids not of same length.

    - `DuplicateUids`: Attempting to set weights with duplicate uids.

    - `UidsLengthExceedUidsInSubNet`: Attempting to set weights above the max allowed uids.

    - `UidVecContainInvalidOne`: Attempting to set weights with invalid uids.

    - `WeightVecLengthIsLow`: Attempting to set weights with fewer weights than min.

    - `MaxWeightExceeded`: Attempting to set weights with max value exceeding limit.

### `setPendingChildkeyCooldown(cooldown: u64)`

- **interface**: `api.tx.subtensorModule.setPendingChildkeyCooldown`
- **summary**: Sets the pending childkey cooldown (in blocks). Root only.

### `setPerpetualLock(netuid: NetUid, enabled: bool)`

- **interface**: `api.tx.subtensorModule.setPerpetualLock`
- **summary**: Sets or clears the caller's perpetual lock flag for a subnet.

    Locks decay by default. When enabled, the caller's individual lock does not unlock through locked-mass decay. Passing `false` returns the caller's lock to normal decay.

### `setRejectLockedAlpha(enabled: bool)`

- **interface**: `api.tx.subtensorModule.setRejectLockedAlpha`
- **summary**: Sets or clears whether the caller rejects incoming locked alpha.

    Coldkeys reject locked alpha by default. Passing `false` opts the caller into receiving locked alpha from stake transfers or coldkey swaps.

### `setRootClaimType(new_root_claim_type: RootClaimTypeEnum)`

- **interface**: `api.tx.subtensorModule.setRootClaimType`
- **summary**: Sets the root claim type for the coldkey.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    **Events:**

    - `RootClaimTypeSet`: On the successfully setting the root claim type for the coldkey.

### `setSubnetIdentity(netuid: NetUid, subnet_name: Vec<u8>, github_repo: Vec<u8>, subnet_contact: Vec<u8>, subnet_url: Vec<u8>, discord: Vec<u8>, description: Vec<u8>, logo_url: Vec<u8>, additional: Vec<u8>)`

- **interface**: `api.tx.subtensorModule.setSubnetIdentity`
- **summary**: Set the identity information for a subnet.

    **Arguments:**

    - `origin`: The signature of the calling coldkey, which must be the owner of the subnet.

    - `netuid`: The unique network identifier of the subnet.

    - `subnet_name`: The name of the subnet.

    - `github_repo`: The GitHub repository associated with the subnet identity.

    - `subnet_contact`: The contact information for the subnet.

### `setTempo(netuid: NetUid, tempo: u16)`

- **interface**: `api.tx.subtensorModule.setTempo`
- **summary**: Deprecated compatibility entry point retained for call-index stability. This call charges a fee, returns success, and does not modify state. Use `AdminUtils::sudo_set_tempo` to change subnet tempo.

### `setWeights(netuid: NetUid, dests: Vec<u16>, weights: Vec<u16>, version_key: u64)`

- **interface**: `api.tx.subtensorModule.setWeights`
- **summary**: Sets the caller weights for the incentive mechanism. The call can be made from the hotkey account so is potentially insecure, however, the damage of changing weights is minimal if caught early. This function includes all the checks that the passed weights meet the requirements. Stored weights are u16s max-upscaled by the pallet, so the largest non-zero supplied weight is stored as `u16::MAX`. The weights determine how inflation propagates outward from this peer.

    **Note:**

    Input weights are relative. They do not need to sum to a particular value before submission.

    **Arguments:**

    - `origin`: The caller, a hotkey who wishes to set their weights.

    - `netuid`: The network uid we are setting these weights on.

    - `dests`: The edge endpoint for the weight, i.e. j for w_ij.

    - `weights`: Relative u16-encoded weights, max-upscaled by the pallet before storage.

    - `version_key`: The network version key to check if the validator is up to date.

    **Events:**

    - `WeightsSet`: On successfully setting the weights on chain.

    **Errors:**

    - `MechanismDoesNotExist`: Attempting to set weights on a non-existent network.

    - `NotRegistered`: Attempting to set weights from a non registered account.

    - `WeightVecNotEqualSize`: Attempting to set weights with uids not of same length.

    - `DuplicateUids`: Attempting to set weights with duplicate uids.

    - `UidsLengthExceedUidsInSubNet`: Attempting to set weights above the max allowed uids.

    - `UidVecContainInvalidOne`: Attempting to set weights with invalid uids.

    - `WeightVecLengthIsLow`: Attempting to set weights with fewer weights than min.

    - `MaxWeightExceeded`: Attempting to set weights with max value exceeding limit.

### `startCall(netuid: NetUid)`

- **interface**: `api.tx.subtensorModule.startCall`
- **summary**: Initiates a call on a subnet.

    **Arguments:**

    - `origin`: The origin of the call, which must be signed by the subnet owner.
    - `netuid`: The unique identifier of the subnet on which the call is being initiated.

    **Events:**

    Emits a `FirstEmissionBlockNumberSet` event on success.

### `sudoSetMaxChildkeyTake(take: PerU16)`

- **interface**: `api.tx.subtensorModule.sudoSetMaxChildkeyTake`
- **summary**: Sets the maximum allowed childkey take.

    This function can only be called by the root origin.

    **Arguments:**

    - `origin`: The origin of the call, must be root.
    - `take`: The new maximum childkey take value.

    **Errors:**

    - `BadOrigin`: If the origin is not root.

### `sudoSetMinChildkeyTake(take: PerU16)`

- **interface**: `api.tx.subtensorModule.sudoSetMinChildkeyTake`
- **summary**: Sets the minimum allowed childkey take.

    This function can only be called by the root origin.

    **Arguments:**

    - `origin`: The origin of the call, must be root.
    - `take`: The new minimum childkey take value.

    **Errors:**

    - `BadOrigin`: If the origin is not root.

### `sudoSetNumRootClaims(new_value: u64)`

- **interface**: `api.tx.subtensorModule.sudoSetNumRootClaims`
- **summary**: Sets root claim number (sudo extrinsic). Zero disables auto-claim.

### `sudoSetRootClaimThreshold(netuid: NetUid, new_value: u64)`

- **interface**: `api.tx.subtensorModule.sudoSetRootClaimThreshold`
- **summary**: Sets root claim threshold for subnet (sudo or owner origin).

### `sudoSetTxChildkeyTakeRateLimit(tx_rate_limit: u64)`

- **interface**: `api.tx.subtensorModule.sudoSetTxChildkeyTakeRateLimit`
- **summary**: Sets the transaction rate limit for changing childkey take.

    This function can only be called by the root origin.

    **Arguments:**

    - `origin`: The origin of the call, must be root.
    - `tx_rate_limit`: The new rate limit in blocks.

    **Errors:**

    - `BadOrigin`: If the origin is not root.

### `sudoSetVotingPowerEmaAlpha(netuid: NetUid, alpha: u64)`

- **interface**: `api.tx.subtensorModule.sudoSetVotingPowerEmaAlpha`
- **summary**: Sets the EMA alpha value for voting power calculation on a subnet.

    This function can only be called by root (sudo). Higher alpha = faster response to stake changes. Alpha is stored as u64 with 18 decimal precision (1.0 = 10^18).

    **Arguments:**

    - `origin`: The origin of the call, must be root.
    - `netuid`: The subnet to set the alpha for.
    - `alpha`: The new alpha value (u64 with 18 decimal precision).

    **Errors:**

    - `BadOrigin`: If the origin is not root.
    - `SubnetNotExist`: If the subnet does not exist.
    - `InvalidVotingPowerEmaAlpha`: If alpha is greater than 10^18 (1.0).

### `swapColdkey(old_coldkey: AccountId, new_coldkey: AccountId, swap_cost: TaoBalance)`

- **interface**: `api.tx.subtensorModule.swapColdkey`
- **summary**: Performs an arbitrary coldkey swap for any coldkey.

    Only callable by root as it doesn't require an announcement and can be used to swap any coldkey.

### `swapColdkeyAnnounced(new_coldkey: AccountId)`

- **interface**: `api.tx.subtensorModule.swapColdkeyAnnounced`
- **summary**: Performs a coldkey swap if an announcement has been made.

    The dispatch origin of this call must be the original coldkey that made the announcement.

    - `new_coldkey`: The new coldkey to swap to. The BlakeTwo256 hash of the new coldkey must be
    the same as the announced coldkey hash.

    The `ColdkeySwapped` event is emitted on successful swap.

### `swapHotkey(hotkey: AccountId, new_hotkey: AccountId, netuid: Option<NetUid>)`

- **interface**: `api.tx.subtensorModule.swapHotkey`
- **summary**: The extrinsic for user to change its hotkey in subnet or all subnets.

    **Arguments:**

    - `origin`: The origin of the transaction (must be signed by the coldkey).
    - `hotkey`: The old hotkey to be swapped.
    - `new_hotkey`: The new hotkey to replace the old one.
    - `netuid`: Optional subnet ID. If `Some`, swap only on that subnet; if `None`, swap on all subnets.

### `swapHotkeyV2(hotkey: AccountId, new_hotkey: AccountId, netuid: Option<NetUid>, keep_stake: bool)`

- **interface**: `api.tx.subtensorModule.swapHotkeyV2`
- **summary**: The extrinsic for user to change its hotkey in subnet or all subnets. This extrinsic is similar to swap_hotkey, but with keep_stake parameter bo be able to keep the stake when swapping a root key to a child key

    **Arguments:**

    - `origin`: The origin of the transaction (must be signed by the coldkey).
    - `hotkey`: The old hotkey to be swapped.
    - `new_hotkey`: The new hotkey to replace the old one.
    - `netuid`: Optional subnet ID. If `Some`, swap only on that subnet; if `None`, swap on all subnets.
    - `keep_stake`: If `true`, stake remains on the old hotkey and the rest metadata
    is transferred to the new hotkey.

### `swapStake(hotkey: AccountId, origin_netuid: NetUid, destination_netuid: NetUid, alpha_amount: AlphaBalance)`

- **interface**: `api.tx.subtensorModule.swapStake`
- **summary**: Swaps a specified amount of stake from one subnet to another, while keeping the same coldkey and hotkey.

    **Arguments:**

    - `origin`: The origin of the transaction, which must be signed by the coldkey that owns the `hotkey`.
    - `hotkey`: The hotkey whose stake is being swapped.
    - `origin_netuid`: The network/subnet ID from which stake is removed.
    - `destination_netuid`: The network/subnet ID to which stake is added.
    - `alpha_amount`: The amount of stake to swap.

    **Errors:**

    - `BadOrigin`: The transaction is not signed.
    - `SameNetuid`: `origin_netuid` and `destination_netuid` are the same.
    - `SubnetNotExists`: Either `origin_netuid` or `destination_netuid` does not exist.
    - `SubtokenDisabled`: The subtoken is disabled on the origin or destination subnet.
    - `HotKeyAccountNotExists`: The `hotkey` account does not exist.
    - `NotEnoughStakeToWithdraw`: The `(coldkey, hotkey, origin_netuid)` position has less stake than `alpha_amount`.
    - `InsufficientLiquidity`: The swap simulation on the origin subnet fails.
    - `AmountTooLow`: The TAO-equivalent of the swap is below the minimum stake requirement.
    - `StakeUnavailable`: The remaining stake would not cover the locked amount on the origin subnet.

    **Events:**

    May emit a `StakeSwapped` event on success.

### `swapStakeLimit(hotkey: AccountId, origin_netuid: NetUid, destination_netuid: NetUid, alpha_amount: AlphaBalance, limit_price: TaoBalance, allow_partial: bool)`

- **interface**: `api.tx.subtensorModule.swapStakeLimit`
- **summary**: Swaps a specified amount of stake from one subnet to another, while keeping the same coldkey and hotkey.

    **Arguments:**

    - `origin`: The origin of the transaction, which must be signed by the coldkey that owns the `hotkey`.
    - `hotkey`: The hotkey whose stake is being swapped.
    - `origin_netuid`: The network/subnet ID from which stake is removed.
    - `destination_netuid`: The network/subnet ID to which stake is added.
    - `alpha_amount`: The amount of stake to swap.
    - `limit_price`: The limit price expressed in units of RAO per one Alpha.
    - `allow_partial`: Allows partial execution of the amount. If set to false, this becomes fill or kill type of order.

    **Errors:**

    - `BadOrigin`: The transaction is not signed.
    - `SameNetuid`: `origin_netuid` and `destination_netuid` are the same.
    - `SubnetNotExists`: Either `origin_netuid` or `destination_netuid` does not exist.
    - `SubtokenDisabled`: The subtoken is disabled on the origin or destination subnet.
    - `HotKeyAccountNotExists`: The `hotkey` account does not exist.
    - `NotEnoughStakeToWithdraw`: The `(coldkey, hotkey, origin_netuid)` position has less stake than `alpha_amount`.
    - `InsufficientLiquidity`: The swap simulation on the origin subnet fails.
    - `AmountTooLow`: The TAO-equivalent of the swap is below the minimum stake requirement.
    - `SlippageTooHigh`: `allow_partial` is false and the amount would cross the limit price.
    - `StakeUnavailable`: The remaining stake would not cover the locked amount on the origin subnet.

    **Events:**

    May emit a `StakeSwapped` event on success.

### `terminateLease(lease_id: LeaseId, hotkey: AccountId)`

- **interface**: `api.tx.subtensorModule.terminateLease`
- **summary**: Terminate a lease.

    The beneficiary can terminate the lease after the end block has passed and get the subnet ownership. The subnet is transferred to the beneficiary and the lease is removed from storage.

    **The hotkey must be owned by the beneficiary coldkey.**

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `lease_id`: The ID of the lease to terminate.

    - `hotkey`: The hotkey of the beneficiary to mark as subnet owner hotkey.

### `transferStake(destination_coldkey: AccountId, hotkey: AccountId, origin_netuid: NetUid, destination_netuid: NetUid, alpha_amount: AlphaBalance)`

- **interface**: `api.tx.subtensorModule.transferStake`
- **summary**: Transfers a specified amount of stake from one coldkey to another, optionally across subnets, while keeping the same hotkey.

    **Arguments:**

    - `origin`: The origin of the transaction, which must be signed by the `origin_coldkey`.
    - `destination_coldkey`: The coldkey to which the stake is transferred.
    - `hotkey`: The hotkey associated with the stake.
    - `origin_netuid`: The network/subnet ID to move stake from.
    - `destination_netuid`: The network/subnet ID to move stake to (for cross-subnet transfer).
    - `alpha_amount`: The amount of stake to transfer.

    **Errors:**

    - `BadOrigin`: The transaction is not signed.
    - `SubnetNotExists`: Either `origin_netuid` or `destination_netuid` does not exist.
    - `SubtokenDisabled`: The subtoken is disabled on the origin or destination subnet.
    - `HotKeyAccountNotExists`: The `hotkey` account does not exist.
    - `NotEnoughStakeToWithdraw`: The `(origin_coldkey, hotkey, origin_netuid)` position has less stake than `alpha_amount`.
    - `InsufficientLiquidity`: The swap simulation on the origin subnet fails.
    - `AmountTooLow`: The TAO-equivalent of the transfer is below the minimum stake requirement.
    - `TransferDisallowed`: Transfers are disabled on the origin or destination subnet.
    - `StakeUnavailable`: The remaining stake would not cover the locked amount on the origin subnet.

    **Events:**

    May emit a `StakeTransferred` event on success.

### `triggerEpoch(netuid: NetUid)`

- **interface**: `api.tx.subtensorModule.triggerEpoch`
- **summary**: Owner-side `trigger_epoch`. Schedules an epoch to fire after `AdminFreezeWindow` blocks. Rate-limited via the existing `OwnerHyperparamUpdate` pattern.

### `tryAssociateHotkey(hotkey: AccountId)`

- **interface**: `api.tx.subtensorModule.tryAssociateHotkey`
- **summary**: Attempts to associate a hotkey with a coldkey.

    **Arguments:**

    - `origin`: The origin of the transaction, which must be signed by the coldkey that owns the `hotkey`.
    - `hotkey`: The hotkey to associate with the coldkey.

    **Note:**

    Will charge based on the weight even if the hotkey is already associated with a coldkey.

### `unstakeAll(hotkey: AccountId)`

- **interface**: `api.tx.subtensorModule.unstakeAll`
- **summary**: The implementation for the extrinsic unstake_all: Removes all stake from a hotkey account across all subnets and adds it onto a coldkey.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `hotkey`: The associated hotkey account.

    **Events:**

    - `StakeRemoved`: On the successfully removing stake from the hotkey account.

    **Errors:**

    - `NotRegistered`: Thrown if the account we are attempting to unstake from is non existent.

    - `NonAssociatedColdKey`: Thrown if the coldkey does not own the hotkey we are unstaking from.

    - `NotEnoughStakeToWithdraw`: Thrown if there is not enough stake on the hotkey to withdraw this amount.

    - `TxRateLimitExceeded`: Thrown if key has hit transaction rate limit.

### `unstakeAllAlpha(hotkey: AccountId)`

- **interface**: `api.tx.subtensorModule.unstakeAllAlpha`
- **summary**: The implementation for the extrinsic unstake_all: Removes all stake from a hotkey account across all subnets and adds it onto a coldkey.

    **Arguments:**

    - `origin`: The signature of the caller's coldkey.

    - `hotkey`: The associated hotkey account.

    **Events:**

    - `StakeRemoved`: On the successfully removing stake from the hotkey account.

    **Errors:**

    - `NotRegistered`: Thrown if the account we are attempting to unstake from is non existent.

    - `NonAssociatedColdKey`: Thrown if the coldkey does not own the hotkey we are unstaking from.

    - `NotEnoughStakeToWithdraw`: Thrown if there is not enough stake on the hotkey to withdraw this amount.

    - `TxRateLimitExceeded`: Thrown if key has hit transaction rate limit.

### `updateSymbol(netuid: NetUid, symbol: Vec<u8>)`

- **interface**: `api.tx.subtensorModule.updateSymbol`
- **summary**: Updates the symbol for a subnet.

    **Arguments:**

    - `origin`: The origin of the call, which must be the subnet owner or root.
    - `netuid`: The unique identifier of the subnet on which the symbol is being set.
    - `symbol`: The symbol to set for the subnet.

    **Errors:**

    - `BadOrigin`: The transaction is not signed by the subnet owner or root.
    - `SubnetNotExists`: The subnet identified by `netuid` does not exist.
    - `SymbolDoesNotExist`: The symbol is not one of the recognized symbols.
    - `SymbolAlreadyInUse`: The symbol is already in use by another subnet.

    **Events:**

    Emits a `SymbolUpdated` event on success.


## `sudo`

### `removeKey()`

- **interface**: `api.tx.sudo.removeKey`
- **summary**: Permanently removes the sudo key.

    **This cannot be un-done.**

### `setKey(new: MultiAddress)`

- **interface**: `api.tx.sudo.setKey`
- **summary**: Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo key.

### `sudo(call: Box<RuntimeCall>)`

- **interface**: `api.tx.sudo.sudo`
- **summary**: Authenticates the sudo key and dispatches a function call with `Root` origin.

### `sudoAs(who: MultiAddress, call: Box<RuntimeCall>)`

- **interface**: `api.tx.sudo.sudoAs`
- **summary**: Authenticates the sudo key and dispatches a function call with `Signed` origin from a given account.

    The dispatch origin for this call must be _Signed_.

### `sudoUncheckedWeight(call: Box<RuntimeCall>, weight: Weight)`

- **interface**: `api.tx.sudo.sudoUncheckedWeight`
- **summary**: Authenticates the sudo key and dispatches a function call with `Root` origin. This function does not check the weight of the call, and instead allows the Sudo user to specify the weight of the call.

    The dispatch origin for this call must be _Signed_.


## `swap`

### `addLiquidity(hotkey: AccountId, netuid: NetUid, tick_low: TickIndex, tick_high: TickIndex, liquidity: u64)`

- **interface**: `api.tx.swap.addLiquidity`
- **summary**: DEPRECATED

### `disableLp()`

- **interface**: `api.tx.swap.disableLp`
- **summary**: DEPRECATED

### `modifyPosition(hotkey: AccountId, netuid: NetUid, position_id: PositionId, liquidity_delta: i64)`

- **interface**: `api.tx.swap.modifyPosition`
- **summary**: DEPRECATED

### `removeLiquidity(hotkey: AccountId, netuid: NetUid, position_id: PositionId)`

- **interface**: `api.tx.swap.removeLiquidity`
- **summary**: DEPRECATED

### `setFeeRate(netuid: NetUid, rate: u16)`

- **interface**: `api.tx.swap.setFeeRate`
- **summary**: Set the fee rate for swaps on a specific subnet (normalized value). For example, 0.3% is approximately 196.

    Only callable by the admin origin

### `toggleUserLiquidity(netuid: NetUid, enable: bool)`

- **interface**: `api.tx.swap.toggleUserLiquidity`
- **summary**: DEPRECATED


## `system`

### `applyAuthorizedUpgrade(code: Vec<u8>)`

- **interface**: `api.tx.system.applyAuthorizedUpgrade`
- **summary**: Provide the preimage (runtime binary) `code` for an upgrade that has been authorized.

    If the authorization required a version check, this call will ensure the spec name remains unchanged and that the spec version has increased.

    Depending on the runtime's `OnSetCode` configuration, this function may directly apply the new `code` in the same block or attempt to schedule the upgrade.

    All origins are allowed.

### `authorizeUpgrade(code_hash: H256)`

- **interface**: `api.tx.system.authorizeUpgrade`
- **summary**: Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied later.

    This call requires Root origin.

### `authorizeUpgradeWithoutChecks(code_hash: H256)`

- **interface**: `api.tx.system.authorizeUpgradeWithoutChecks`
- **summary**: Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied later.

    WARNING: This authorizes an upgrade that will take place without any safety checks, for example that the spec name remains the same and that the version number increases. Not recommended for normal use. Use `authorize_upgrade` instead.

    This call requires Root origin.

### `killPrefix(prefix: Key, subkeys: u32)`

- **interface**: `api.tx.system.killPrefix`
- **summary**: Kill all storage items with a key that starts with the given prefix.

    **NOTE:** We rely on the Root origin to provide us the number of subkeys under
    the prefix we are removing to accurately calculate the weight of this function.

### `killStorage(keys: Vec<Key>)`

- **interface**: `api.tx.system.killStorage`
- **summary**: Kill some items from storage.

### `remark(remark: Vec<u8>)`

- **interface**: `api.tx.system.remark`
- **summary**: Make some on-chain remark.

    Can be executed by every `origin`.

### `remarkWithEvent(remark: Vec<u8>)`

- **interface**: `api.tx.system.remarkWithEvent`
- **summary**: Make some on-chain remark and emit event.

### `setCode(code: Vec<u8>)`

- **interface**: `api.tx.system.setCode`
- **summary**: Set the new runtime code.

### `setCodeWithoutChecks(code: Vec<u8>)`

- **interface**: `api.tx.system.setCodeWithoutChecks`
- **summary**: Set the new runtime code without doing any checks of the given `code`.

    Note that runtime upgrades will not run if this is called with a not-increasing spec version!

### `setHeapPages(pages: u64)`

- **interface**: `api.tx.system.setHeapPages`
- **summary**: Set the number of pages in the WebAssembly environment's heap.

### `setStorage(items: Vec<KeyValue>)`

- **interface**: `api.tx.system.setStorage`
- **summary**: Set some items of storage.


## `timestamp`

### `set(now: u64)`

- **interface**: `api.tx.timestamp.set`
- **summary**: Set the current time.

    This call should be invoked exactly once per block. It will panic at the finalization phase, if this call hasn't been invoked by that time.

    The timestamp should be greater than the previous one by the amount specified by [`Config::MinimumPeriod`].

    The dispatch origin for this call must be _None_.

    This dispatch class is _Mandatory_ to ensure it gets executed in the block. Be aware that changing the complexity of this call could result exhausting the resources in a block to execute any other calls.

    **Complexity:**

    - ``O(1)`` (Note that implementations of `OnTimestampSet` must also be ``O(1)``)
    - 1 storage read and 1 storage mutation (codec ``O(1)`` because of `DidUpdate::take` in
    `on_finalize`)
    - 1 event handler `on_timestamp_set`. Must be ``O(1)``.


## `utility`

### `asDerivative(index: u16, call: Box<RuntimeCall>)`

- **interface**: `api.tx.utility.asDerivative`
- **summary**: Send a call through an indexed pseudonym of the sender.

    Filter from origin are passed along. The call will be dispatched with an origin which use the same filter as the origin of this call.

    NOTE: If you need to ensure that any account-based filtering is not honored (i.e. because you expect `proxy` to have been used prior in the call stack and you do not want the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1` in the Multisig pallet instead.

    NOTE: Prior to version *12, this was called `as_limited_sub`.

    The dispatch origin for this call must be _Signed_.

### `batch(calls: Vec<RuntimeCall>)`

- **interface**: `api.tx.utility.batch`
- **summary**: Send a batch of dispatch calls.

    May be called from any origin except `None`.

    - `calls`: The calls to be dispatched from the same origin. The number of call must not
    exceed the constant: `batched_calls_limit` (available in constant metadata).

    If origin is root then the calls are dispatched without checking origin filter. (This includes bypassing `frame_system::Config::BaseCallFilter`).

    **Complexity:**

    - `O(C)` where C is the number of calls to be batched.

    This will return `Ok` in all circumstances. To determine the success of the batch, an event is deposited. If a call failed and the batch was interrupted, then the `BatchInterrupted` event is deposited, along with the number of successful calls made and the error of the failed call. If all were successful, then the `BatchCompleted` event is deposited.

### `batchAll(calls: Vec<RuntimeCall>)`

- **interface**: `api.tx.utility.batchAll`
- **summary**: Send a batch of dispatch calls and atomically execute them. The whole transaction will rollback and fail if any of the calls failed.

    May be called from any origin except `None`.

    - `calls`: The calls to be dispatched from the same origin. The number of call must not
    exceed the constant: `batched_calls_limit` (available in constant metadata).

    If origin is root then the calls are dispatched without checking origin filter. (This includes bypassing `frame_system::Config::BaseCallFilter`).

    **Complexity:**

    - `O(C)` where C is the number of calls to be batched.

### `dispatchAs(as_origin: Box<T::PalletsOrigin>, call: Box<RuntimeCall>)`

- **interface**: `api.tx.utility.dispatchAs`
- **summary**: Dispatches a function call with a provided origin.

    The dispatch origin for this call must be _Root_.

    **Complexity:**

    - `O(1)`.

### `dispatchAsFallible(as_origin: Box<T::PalletsOrigin>, call: Box<RuntimeCall>)`

- **interface**: `api.tx.utility.dispatchAsFallible`
- **summary**: Dispatches a function call with a provided origin.

    Almost the same as [`Pallet::dispatch_as`] but forwards any error of the inner call.

    The dispatch origin for this call must be _Root_.

### `forceBatch(calls: Vec<RuntimeCall>)`

- **interface**: `api.tx.utility.forceBatch`
- **summary**: Send a batch of dispatch calls. Unlike `batch`, it allows errors and won't interrupt.

    May be called from any origin except `None`.

    - `calls`: The calls to be dispatched from the same origin. The number of call must not
    exceed the constant: `batched_calls_limit` (available in constant metadata).

    If origin is root then the calls are dispatch without checking origin filter. (This includes bypassing `frame_system::Config::BaseCallFilter`).

    **Complexity:**

    - `O(C)` where C is the number of calls to be batched.

### `ifElse(main: Box<RuntimeCall>, fallback: Box<RuntimeCall>)`

- **interface**: `api.tx.utility.ifElse`
- **summary**: Dispatch a fallback call in the event the main call fails to execute. May be called from any origin except `None`.

    This function first attempts to dispatch the `main` call. If the `main` call fails, the `fallback` is attemted. if the fallback is successfully dispatched, the weights of both calls are accumulated and an event containing the main call error is deposited.

    In the event of a fallback failure the whole call fails with the weights returned.

    - `main`: The main call to be dispatched. This is the primary action to execute.
    - `fallback`: The fallback call to be dispatched in case the `main` call fails.

    **Dispatch Logic:**

    - If the origin is `root`, both the main and fallback calls are executed without
    applying any origin filters.
    - If the origin is not `root`, the origin filter is applied to both the `main` and
    `fallback` calls.

    **Use Case:**

    - Some use cases might involve submitting a `batch` type call in either main, fallback
    or both.

### `withWeight(call: Box<RuntimeCall>, weight: Weight)`

- **interface**: `api.tx.utility.withWeight`
- **summary**: Dispatch a function call with a specified weight.

    This function does not check the weight of the call, and instead allows the Root origin to specify the weight of the call.

    The dispatch origin for this call must be _Root_.
