# Extrinsics

The following sections contain Extrinsic methods that are part of the Bittensor (Subtensor) runtime. On the API, these are exposed via `api.tx.<Pallet>.<call_name>`.

> **NOTE:** Generated from a live snapshot of the Subtensor runtime on **2026-03-25**.
> Connected to: `wss://entrypoint-finney.opentensor.ai:443`
> On the API: `api.tx / api.query / api.events / api.errors / api.consts`

**Standard Substrate pallets**

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
- **[mevShield](#mevshield)**
- **[multisig](#multisig)**
- **[preimage](#preimage)**
- **[proxy](#proxy)**
- **[registry](#registry)**
- **[safeMode](#safemode)**
- **[scheduler](#scheduler)**
- **[subtensorModule](#subtensormodule)**
- **[sudo](#sudo)**
- **[swap](#swap)**
- **[system](#system)**
- **[timestamp](#timestamp)**
- **[utility](#utility)**

---

## `adminUtils`

### `scheduleGrandpaChange`(next_authorities: `33`, in_blocks: `4`, forced: `51`)

- **interface**: `api.tx.adminUtils.scheduleGrandpaChange`
- **summary**: A public interface for `pallet_grandpa::Pallet::schedule_grandpa_change`. Schedule a change in the authorities. The change will be applied at the end of execution of the block `in_blocks` after the current block. This value may be 0, in which case the change is applied at the end of the current block. If the `forced` parameter is defined, this indicates that the current set has been synchronously determined to be offline and that after `in_blocks` the given change should be applied. The given block number indicates the median last finalized block number and it should be used as the canon block when starting the new grandpa voter. No change should be signaled while any change is pending. Returns an error if a change is already pending.

---

### sudoSetActivityCutoff(netuid: `40`, activity_cutoff: `40`)

- **interface**: `api.tx.adminUtils.sudoSetActivityCutoff`
- **summary**: The extrinsic sets the activity cutoff for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the activity cutoff.

---

### sudoSetAdjustmentAlpha(netuid: `40`, adjustment_alpha: `6`)

- **interface**: `api.tx.adminUtils.sudoSetAdjustmentAlpha`
- **summary**: The extrinsic sets the adjustment alpha for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the adjustment alpha.

---

### sudoSetAdjustmentInterval(netuid: `40`, adjustment_interval: `40`)

- **interface**: `api.tx.adminUtils.sudoSetAdjustmentInterval`
- **summary**: The extrinsic sets the adjustment interval for a subnet. It is only callable by the root account, not changeable by the subnet owner. The extrinsic will call the Subtensor pallet to set the adjustment interval.

---

### sudoSetAdminFreezeWindow(window: `40`)

- **interface**: `api.tx.adminUtils.sudoSetAdminFreezeWindow`
- **summary**: Sets the admin freeze window length (in blocks) at the end of a tempo. Only callable by root.

---

### sudoSetAlphaSigmoidSteepness(netuid: `40`, steepness: `41`)

- **interface**: `api.tx.adminUtils.sudoSetAlphaSigmoidSteepness`
- **summary**:

# Arguments \_ `origin`

- The origin of the call, which must be the root account. _ `netuid` - The unique identifier for the subnet. _ `steepness` - The Steepness for the alpha sigmoid function. (range is 0-int16::MAX, negative values are reserved for future use) # Errors _ `BadOrigin` - If the caller is not the root account. _ `SubnetDoesNotExist` - If the specified subnet does not exist. \_ `NegativeSigmoidSteepness` - If the steepness is negative and the caller is root. # Weight Weight is handled by the `#[pallet::weight]` attribute.

---

### sudoSetAlphaValues(netuid: `40`, alpha_low: `40`, alpha_high: `40`)

- **interface**: `api.tx.adminUtils.sudoSetAlphaValues`
- **summary**: Sets values for liquid alpha

---

### sudoSetBondsMovingAverage(netuid: `40`, bonds_moving_average: `6`)

- **interface**: `api.tx.adminUtils.sudoSetBondsMovingAverage`
- **summary**: The extrinsic sets the bonds moving average for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the bonds moving average.

---

### sudoSetBondsPenalty(netuid: `40`, bonds_penalty: `40`)

- **interface**: `api.tx.adminUtils.sudoSetBondsPenalty`
- **summary**: The extrinsic sets the bonds penalty for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the bonds penalty.

---

### sudoSetBondsResetEnabled(netuid: `40`, enabled: `9`)

- **interface**: `api.tx.adminUtils.sudoSetBondsResetEnabled`
- **summary**: Enables or disables Bonds Reset for a given subnet.

# Parameters

- `origin`: The origin of the call, which must be the root account or subnet owner. - `netuid`: The unique identifier for the subnet. - `enabled`: A boolean flag to enable or disable Bonds Reset. # Weight This function has a fixed weight of 0 and is classified as an operational transaction that does not incur any fees.

---

### sudoSetCkBurn(burn: `6`)

- **interface**: `api.tx.adminUtils.sudoSetCkBurn`
- **summary**: Sets the childkey burn for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the childkey burn.

---

### sudoSetColdkeySwapAnnouncementDelay(duration: `4`)

- **interface**: `api.tx.adminUtils.sudoSetColdkeySwapAnnouncementDelay`
- **summary**: Sets the announcement delay for coldkey swap.

---

### sudoSetColdkeySwapReannouncementDelay(duration: `4`)

- **interface**: `api.tx.adminUtils.sudoSetColdkeySwapReannouncementDelay`
- **summary**: Sets the coldkey swap reannouncement delay.

---

### sudoSetCommitRevealVersion(version: `40`)

- **interface**: `api.tx.adminUtils.sudoSetCommitRevealVersion`
- **summary**: Sets the commit-reveal weights version for all subnets

---

### sudoSetCommitRevealWeightsEnabled(netuid: `40`, enabled: `9`)

- **interface**: `api.tx.adminUtils.sudoSetCommitRevealWeightsEnabled`
- **summary**: The extrinsic enabled/disables commit/reaveal for a given subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the value.

---

### sudoSetCommitRevealWeightsInterval(netuid: `40`, interval: `6`)

- **interface**: `api.tx.adminUtils.sudoSetCommitRevealWeightsInterval`
- **summary**: Sets the commit-reveal weights periods for a specific subnet. This extrinsic allows the subnet owner or root account to set the duration (in epochs) during which committed weights must be revealed. The commit-reveal mechanism ensures that users commit weights in advance and reveal them only within a specified period. # Arguments _ `origin` - The origin of the call, which must be the subnet owner or the root account. _ `netuid` - The unique identifier of the subnet for which the periods are being set. _ `periods` - The number of epochs that define the commit-reveal period. # Errors _ `BadOrigin` - If the caller is neither the subnet owner nor the root account. \* `SubnetDoesNotExist` - If the specified subnet does not exist. # Weight Weight is handled by the `#[pallet::weight]` attribute.

---

### sudoSetDefaultTake(default_take: `40`)

- **interface**: `api.tx.adminUtils.sudoSetDefaultTake`
- **summary**: The extrinsic sets the default take for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the default take.

---

### sudoSetDifficulty(netuid: `40`, difficulty: `6`)

- **interface**: `api.tx.adminUtils.sudoSetDifficulty`
- **summary**: The extrinsic sets the difficulty for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the difficulty.

---

### sudoSetDissolveNetworkScheduleDuration(duration: `4`)

- **interface**: `api.tx.adminUtils.sudoSetDissolveNetworkScheduleDuration`
- **summary**: Sets the duration of the dissolve network schedule. This extrinsic allows the root account to set the duration for the dissolve network schedule. The dissolve network schedule determines how long it takes for a network dissolution operation to complete. # Arguments _ `origin` - The origin of the call, which must be the root account. _ `duration` - The new duration for the dissolve network schedule, in number of blocks. # Errors \* `BadOrigin` - If the caller is not the root account. # Weight Weight is handled by the `#[pallet::weight]` attribute.

---

### sudoSetEmaPriceHalvingPeriod(netuid: `40`, ema_halving: `6`)

- **interface**: `api.tx.adminUtils.sudoSetEmaPriceHalvingPeriod`
- **summary**: # Arguments _ `origin` - The origin of the call, which must be the root account. _ `ema_alpha_period` - Number of blocks for EMA price to halve # Errors \* `BadOrigin` - If the caller is not the root account. # Weight Weight is handled by the `#[pallet::weight]` attribute.

---

### sudoSetEvmChainId(chain_id: `6`)

- **interface**: `api.tx.adminUtils.sudoSetEvmChainId`
- **summary**: Sets the EVM ChainID. # Arguments _ `origin` - The origin of the call, which must be the subnet owner or the root account. _ `chainId` - The u64 chain ID # Errors \* `BadOrigin` - If the caller is neither the subnet owner nor the root account. # Weight Weight is handled by the `#[pallet::weight]` attribute.

---

### sudoSetImmunityPeriod(netuid: `40`, immunity_period: `40`)

- **interface**: `api.tx.adminUtils.sudoSetImmunityPeriod`
- **summary**: The extrinsic sets the immunity period for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the immunity period.

---

### sudoSetKappa(netuid: `40`, kappa: `40`)

- **interface**: `api.tx.adminUtils.sudoSetKappa`
- **summary**: The extrinsic sets the kappa for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the kappa.

---

### sudoSetLiquidAlphaEnabled(netuid: `40`, enabled: `9`)

- **interface**: `api.tx.adminUtils.sudoSetLiquidAlphaEnabled`
- **summary**: Enables or disables Liquid Alpha for a given subnet. # Parameters - `origin`: The origin of the call, which must be the root account or subnet owner. - `netuid`: The unique identifier for the subnet. - `enabled`: A boolean flag to enable or disable Liquid Alpha. # Weight This function has a fixed weight of 0 and is classified as an operational transaction that does not incur any fees.

---

### sudoSetLockReductionInterval(interval: `6`)

- **interface**: `api.tx.adminUtils.sudoSetLockReductionInterval`
- **summary**: The extrinsic sets the lock reduction interval for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the lock reduction interval.

---

### sudoSetMaxAllowedUids(netuid: `40`, max_allowed_uids: `40`)

- **interface**: `api.tx.adminUtils.sudoSetMaxAllowedUids`
- **summary**: The extrinsic sets the maximum allowed UIDs for a subnet. It is only callable by the root account and subnet owner. The extrinsic will call the Subtensor pallet to set the maximum allowed UIDs for a subnet.

---

### sudoSetMaxAllowedValidators(netuid: `40`, max_allowed_validators: `40`)

- **interface**: `api.tx.adminUtils.sudoSetMaxAllowedValidators`
- **summary**: The extrinsic sets the maximum allowed validators for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the maximum allowed validators.

---

### sudoSetMaxBurn(netuid: `40`, max_burn: `6`)

- **interface**: `api.tx.adminUtils.sudoSetMaxBurn`
- **summary**: The extrinsic sets the maximum burn for a subnet. It is only callable by root and subnet owner. The extrinsic will call the Subtensor pallet to set the maximum burn.

---

### sudoSetMaxDifficulty(netuid: `40`, max_difficulty: `6`)

- **interface**: `api.tx.adminUtils.sudoSetMaxDifficulty`
- **summary**: The extrinsic sets the maximum difficulty for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the maximum difficulty.

---

### sudoSetMaxMechanismCount(max_mechanism_count: `2`)

- **interface**: `api.tx.adminUtils.sudoSetMaxMechanismCount`
- **summary**: Sets the global maximum number of mechanisms in a subnet

---

### sudoSetMaxRegistrationsPerBlock(netuid: `40`, max_registrations_per_block: `40`)

- **interface**: `api.tx.adminUtils.sudoSetMaxRegistrationsPerBlock`
- **summary**: The extrinsic sets the maximum registrations per block for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the maximum registrations per block.

---

### sudoSetMechanismCount(netuid: `40`, mechanism_count: `2`)

- **interface**: `api.tx.adminUtils.sudoSetMechanismCount`
- **summary**: Sets the desired number of mechanisms in a subnet

---

### sudoSetMechanismEmissionSplit(netuid: `40`, maybe_split: `392`)

- **interface**: `api.tx.adminUtils.sudoSetMechanismEmissionSplit`
- **summary**: Sets the emission split between mechanisms in a subnet

---

### sudoSetMinAllowedUids(netuid: `40`, min_allowed_uids: `40`)

- **interface**: `api.tx.adminUtils.sudoSetMinAllowedUids`
- **summary**: The extrinsic sets the minimum allowed UIDs for a subnet. It is only callable by the root account.

---

### sudoSetMinAllowedWeights(netuid: `40`, min_allowed_weights: `40`)

- **interface**: `api.tx.adminUtils.sudoSetMinAllowedWeights`
- **summary**: The extrinsic sets the minimum allowed weights for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the minimum allowed weights.

---

### sudoSetMinBurn(netuid: `40`, min_burn: `6`)

- **interface**: `api.tx.adminUtils.sudoSetMinBurn`
- **summary**: The extrinsic sets the minimum burn for a subnet. It is only callable by root and subnet owner. The extrinsic will call the Subtensor pallet to set the minimum burn.

---

### sudoSetMinDelegateTake(take: `40`)

- **interface**: `api.tx.adminUtils.sudoSetMinDelegateTake`
- **summary**: The extrinsic sets the minimum delegate take. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the minimum delegate take.

---

### sudoSetMinDifficulty(netuid: `40`, min_difficulty: `6`)

- **interface**: `api.tx.adminUtils.sudoSetMinDifficulty`
- **summary**: The extrinsic sets the minimum difficulty for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the minimum difficulty.

---

### sudoSetMinNonImmuneUids(netuid: `40`, min: `40`)

- **interface**: `api.tx.adminUtils.sudoSetMinNonImmuneUids`
- **summary**: Sets the minimum number of non-immortal & non-immune UIDs that must remain in a subnet

---

### sudoSetNetworkImmunityPeriod(immunity_period: `6`)

- **interface**: `api.tx.adminUtils.sudoSetNetworkImmunityPeriod`
- **summary**: The extrinsic sets the immunity period for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the immunity period for the network.

---

### sudoSetNetworkMinLockCost(lock_cost: `6`)

- **interface**: `api.tx.adminUtils.sudoSetNetworkMinLockCost`
- **summary**: The extrinsic sets the min lock cost for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the min lock cost for the network.

---

### sudoSetNetworkPowRegistrationAllowed(netuid: `40`, registration_allowed: `9`)

- **interface**: `api.tx.adminUtils.sudoSetNetworkPowRegistrationAllowed`
- **summary**: The extrinsic sets the network PoW registration allowed for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the network PoW registration allowed.

---

### sudoSetNetworkRateLimit(rate_limit: `6`)

- **interface**: `api.tx.adminUtils.sudoSetNetworkRateLimit`
- **summary**: The extrinsic sets the network rate limit for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the network rate limit.

---

### sudoSetNetworkRegistrationAllowed(netuid: `40`, registration_allowed: `9`)

- **interface**: `api.tx.adminUtils.sudoSetNetworkRegistrationAllowed`
- **summary**: The extrinsic sets the network registration allowed for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the network registration allowed.

---

### sudoSetNominatorMinRequiredStake(min_stake: `6`)

- **interface**: `api.tx.adminUtils.sudoSetNominatorMinRequiredStake`
- **summary**: The extrinsic sets the minimum stake required for nominators. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the minimum stake required for nominators.

---

### sudoSetOwnerHparamRateLimit(epochs: `40`)

- **interface**: `api.tx.adminUtils.sudoSetOwnerHparamRateLimit`
- **summary**: Sets the owner hyperparameter rate limit in epochs (global multiplier). Only callable by root.

---

### sudoSetOwnerImmuneNeuronLimit(netuid: `40`, immune_neurons: `40`)

- **interface**: `api.tx.adminUtils.sudoSetOwnerImmuneNeuronLimit`
- **summary**: Sets the number of immune owner neurons

---

### sudoSetRaoRecycled(netuid: `40`, rao_recycled: `6`)

- **interface**: `api.tx.adminUtils.sudoSetRaoRecycled`
- **summary**: The extrinsic sets the recycled RAO for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the recycled RAO.

---

### sudoSetRecycleOrBurn(netuid: `40`, recycle_or_burn: `197`)

- **interface**: `api.tx.adminUtils.sudoSetRecycleOrBurn`
- **summary**: Set the behaviour of the "burn" UID(s) for a given subnet. If set to `Burn`, the miner emission sent to the burn UID(s) will be burned. If set to `Recycle`, the miner emission sent to the burn UID(s) will be recycled. # Parameters - `origin`: The origin of the call, which must be the root account or subnet owner. - `netuid`: The unique identifier for the subnet. - `recycle_or_burn`: The desired behaviour of the "burn" UID(s) for the subnet.

---

### sudoSetRho(netuid: `40`, rho: `40`)

- **interface**: `api.tx.adminUtils.sudoSetRho`
- **summary**: The extrinsic sets the rho for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the rho.

---

### sudoSetServingRateLimit(netuid: `40`, serving_rate_limit: `6`)

- **interface**: `api.tx.adminUtils.sudoSetServingRateLimit`
- **summary**: The extrinsic sets the serving rate limit for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the serving rate limit.

---

### sudoSetSnOwnerHotkey(netuid: `40`, hotkey: `0`)

- **interface**: `api.tx.adminUtils.sudoSetSnOwnerHotkey`
- **summary**: Sets or updates the hotkey account associated with the owner of a specific subnet. This function allows either the root origin or the current subnet owner to set or update the hotkey for a given subnet. The subnet must already exist. To prevent abuse, the call is rate-limited to once per configured interval (default: one week) per subnet. # Parameters - `origin`: The dispatch origin of the call. Must be either root or the current owner of the subnet. - `netuid`: The unique identifier of the subnet whose owner hotkey is being set. - `hotkey`: The new hotkey account to associate with the subnet owner. # Returns - `DispatchResult`: Returns `Ok(())` if the hotkey was successfully set, or an appropriate error otherwise. # Errors - `Error::SubnetNotExists`: If the specified subnet does not exist. - `Error::TxRateLimitExceeded`: If the function is called more frequently than the allowed rate limit. # Access Control Only callable by: - Root origin, or - The coldkey account that owns the subnet. # Storage - Updates [`SubnetOwnerHotkey`] for the given `netuid`. - Reads and updates [`LastRateLimitedBlock`] for rate-limiting. - Reads [`DefaultSetSNOwnerHotkeyRateLimit`] to determine the interval between allowed updates. # Rate Limiting This function is rate-limited to one call per subnet per interval (e.g., one week).

---

### sudoSetStakeThreshold(min_stake: `6`)

- **interface**: `api.tx.adminUtils.sudoSetStakeThreshold`
- **summary**: The extrinsic sets the weights min stake. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the weights min stake.

---

### sudoSetStartCallDelay(delay: `6`)

- **interface**: `api.tx.adminUtils.sudoSetStartCallDelay`
- **summary**: Sets the delay before a subnet can call start

---

### sudoSetSubnetLimit(max_subnets: `40`)

- **interface**: `api.tx.adminUtils.sudoSetSubnetLimit`
- **summary**: The extrinsic sets the subnet limit for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the subnet limit.

---

### sudoSetSubnetMovingAlpha(alpha: `176`)

- **interface**: `api.tx.adminUtils.sudoSetSubnetMovingAlpha`
- **summary**: # Arguments _ `origin` - The origin of the call, which must be the root account. _ `alpha` - The new moving alpha value for the SubnetMovingAlpha. # Errors \* `BadOrigin` - If the caller is not the root account. # Weight Weight is handled by the `#[pallet::weight]` attribute.

---

### sudoSetSubnetOwnerCut(subnet_owner_cut: `40`)

- **interface**: `api.tx.adminUtils.sudoSetSubnetOwnerCut`
- **summary**: The extrinsic sets the subnet owner cut for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the subnet owner cut.

---

### sudoSetSubnetOwnerHotkey(netuid: `40`, hotkey: `0`)

- **interface**: `api.tx.adminUtils.sudoSetSubnetOwnerHotkey`
- **summary**: Change the SubnetOwnerHotkey for a given subnet. # Arguments _ `origin` - The origin of the call, which must be the subnet owner. _ `netuid` - The unique identifier for the subnet. _ `hotkey` - The new hotkey for the subnet owner. # Errors _ `BadOrigin` - If the caller is not the subnet owner or root account. # Weight Weight is handled by the `#[pallet::weight]` attribute.

---

### sudoSetSubtokenEnabled(netuid: `40`, subtoken_enabled: `9`)

- **interface**: `api.tx.adminUtils.sudoSetSubtokenEnabled`
- **summary**: Enables or disables subtoken trading for a given subnet. # Arguments _ `origin` - The origin of the call, which must be the root account. _ `netuid` - The unique identifier of the subnet. _ `subtoken_enabled` - A boolean indicating whether subtoken trading should be enabled or disabled. # Errors _ `BadOrigin` - If the caller is not the root account. # Weight Weight is handled by the `#[pallet::weight]` attribute.

---

### sudoSetTaoFlowCutoff(flow_cutoff: `194`)

- **interface**: `api.tx.adminUtils.sudoSetTaoFlowCutoff`
- **summary**: Sets TAO flow cutoff value (A)

---

### sudoSetTaoFlowNormalizationExponent(exponent: `189`)

- **interface**: `api.tx.adminUtils.sudoSetTaoFlowNormalizationExponent`
- **summary**: Sets TAO flow normalization exponent (p)

---

### sudoSetTaoFlowSmoothingFactor(smoothing_factor: `6`)

- **interface**: `api.tx.adminUtils.sudoSetTaoFlowSmoothingFactor`
- **summary**: Sets TAO flow smoothing factor (alpha)

---

### sudoSetTargetRegistrationsPerInterval(netuid: `40`, target_registrations_per_interval: `40`)

- **interface**: `api.tx.adminUtils.sudoSetTargetRegistrationsPerInterval`
- **summary**: The extrinsic sets the target registrations per interval for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the target registrations per interval.

---

### sudoSetTempo(netuid: `40`, tempo: `40`)

- **interface**: `api.tx.adminUtils.sudoSetTempo`
- **summary**: The extrinsic sets the tempo for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the tempo.

---

### sudoSetToggleTransfer(netuid: `40`, toggle: `9`)

- **interface**: `api.tx.adminUtils.sudoSetToggleTransfer`
- **summary**: Enable or disable atomic alpha transfers for a given subnet. # Parameters - `origin`: The origin of the call, which must be the root account or subnet owner. - `netuid`: The unique identifier for the subnet. - `enabled`: A boolean flag to enable or disable Liquid Alpha. # Weight This function has a fixed weight of 0 and is classified as an operational transaction that does not incur any fees.

---

### sudoSetTotalIssuance(total_issuance: `6`)

- **interface**: `api.tx.adminUtils.sudoSetTotalIssuance`
- **summary**: The extrinsic sets the total issuance for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the issuance for the network.

---

### sudoSetTxDelegateTakeRateLimit(tx_rate_limit: `6`)

- **interface**: `api.tx.adminUtils.sudoSetTxDelegateTakeRateLimit`
- **summary**: The extrinsic sets the rate limit for delegate take transactions. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the rate limit for delegate take transactions.

---

### sudoSetTxRateLimit(tx_rate_limit: `6`)

- **interface**: `api.tx.adminUtils.sudoSetTxRateLimit`
- **summary**: The extrinsic sets the transaction rate limit for the network. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the transaction rate limit.

---

### sudoSetWeightsSetRateLimit(netuid: `40`, weights_set_rate_limit: `6`)

- **interface**: `api.tx.adminUtils.sudoSetWeightsSetRateLimit`
- **summary**: The extrinsic sets the weights set rate limit for a subnet. It is only callable by the root account. The extrinsic will call the Subtensor pallet to set the weights set rate limit.

---

### sudoSetWeightsVersionKey(netuid: `40`, weights_version_key: `6`)

- **interface**: `api.tx.adminUtils.sudoSetWeightsVersionKey`
- **summary**: The extrinsic sets the weights version key for a subnet. It is only callable by the root account or subnet owner. The extrinsic will call the Subtensor pallet to set the weights version key.

---

### sudoSetYuma3Enabled(netuid: `40`, enabled: `9`)

- **interface**: `api.tx.adminUtils.sudoSetYuma3Enabled`
- **summary**: Enables or disables Yuma3 for a given subnet. # Parameters - `origin`: The origin of the call, which must be the root account or subnet owner. - `netuid`: The unique identifier for the subnet. - `enabled`: A boolean flag to enable or disable Yuma3. # Weight This function has a fixed weight of 0 and is classified as an operational transaction that does not incur any fees.

---

### sudoToggleEvmPrecompile(precompile_id: `71`, enabled: `9`)

- **interface**: `api.tx.adminUtils.sudoToggleEvmPrecompile`
- **summary**: Toggles the enablement of an EVM precompile. # Arguments _ `origin` - The origin of the call, which must be the root account. _ `precompile_id` - The identifier of the EVM precompile to toggle. _ `enabled` - The new enablement state of the precompile. # Errors _ `BadOrigin` - If the caller is not the root account. # Weight Weight is handled by the `#[pallet::weight]` attribute.

---

### sudoTrimToMaxAllowedUids(netuid: `40`, max_n: `40`)

- **interface**: `api.tx.adminUtils.sudoTrimToMaxAllowedUids`
- **summary**: Trims the maximum number of UIDs for a subnet. The trimming is done by sorting the UIDs by emission descending and then trimming the lowest emitters while preserving temporally and owner immune UIDs. The UIDs are then compressed to the left and storage is migrated to the new compressed UIDs.

---

### swapAuthorities(new_authorities: `125`)

- **interface**: `api.tx.adminUtils.swapAuthorities`
- **summary**: The extrinsic sets the new authorities for Aura consensus. It is only callable by the root account. The extrinsic will call the Aura pallet to change the authorities.

---

## balances

### burn(value: `167`, keep_alive: `9`)

- **interface**: `api.tx.balances.burn`
- **summary**: Burn the specified liquid free balance from the origin account. If the origin's account ends up below the existential deposit as a result of the burn and `keep_alive` is false, the account will be reaped. Unlike sending funds to a _burn_ address, which merely makes the funds inaccessible, this `burn` operation will reduce total issuance by the amount _burned_.

---

### forceAdjustTotalIssuance(direction: `169`, delta: `167`)

- **interface**: `api.tx.balances.forceAdjustTotalIssuance`
- **summary**: Adjust the total issuance in a saturating way. Can only be called by root and always needs a positive `delta`. # Example

---

### forceSetBalance(who: `165`, new_free: `167`)

- **interface**: `api.tx.balances.forceSetBalance`
- **summary**: Set the regular balance of a given account. The dispatch origin for this call is `root`.

---

### forceTransfer(source: `165`, dest: `165`, value: `167`)

- **interface**: `api.tx.balances.forceTransfer`
- **summary**: Exactly as `transfer_allow_death`, except the origin must be root and the source account may be specified.

---

### forceUnreserve(who: `165`, amount: `6`)

- **interface**: `api.tx.balances.forceUnreserve`
- **summary**: Unreserve some balance from a user by force. Can only be called by ROOT.

---

### transferAll(dest: `165`, keep_alive: `9`)

- **interface**: `api.tx.balances.transferAll`
- **summary**: Transfer the entire transferable balance from the caller account. NOTE: This function only attempts to transfer _transferable_ balances. This means that any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be transferred by this function. To ensure that this function results in a killed account, you might need to prepare the account by removing any reference counters, storage deposits, etc... The dispatch origin of this call must be Signed. - `dest`: The recipient of the transfer. - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all of the funds the account has, causing the sender account to be killed (false), or transfer everything except at least the existential deposit, which will guarantee to keep the sender account alive (true).

---

### transferAllowDeath(dest: `165`, value: `167`)

- **interface**: `api.tx.balances.transferAllowDeath`
- **summary**: Transfer some liquid free balance to another account. `transfer_allow_death` will set the `FreeBalance` of the sender and receiver. If the sender's account is below the existential deposit as a result of the transfer, the account will be reaped. The dispatch origin for this call must be `Signed` by the transactor.

---

### transferKeepAlive(dest: `165`, value: `167`)

- **interface**: `api.tx.balances.transferKeepAlive`
- **summary**: Same as the [`transfer_allow_death`] call, but with a check that the transfer will not kill the origin account. 99% of the time you want [`transfer_allow_death`] instead. [`transfer_allow_death`]: struct.Pallet.html#method.transfer

---

### upgradeAccounts(who: `168`)

- **interface**: `api.tx.balances.upgradeAccounts`
- **summary**: Upgrade a specified account. - `origin`: Must be `Signed`. - `who`: The account to be upgraded. This will waive the transaction fee if at least all but 10% of the accounts needed to be upgraded. (We let some not have to be upgraded just in order to allow for the possibility of churn).

---

## baseFee

### setBaseFeePerGas(fee: `86`)

- **interface**: `api.tx.baseFee.setBaseFeePerGas`

---

### setElasticity(elasticity: `88`)

- **interface**: `api.tx.baseFee.setElasticity`

---

## commitments

### setCommitment(netuid: `40`, info: `322`)

- **interface**: `api.tx.commitments.setCommitment`
- **summary**: Set the commitment for a given netuid

---

### setMaxSpace(new_limit: `4`)

- **interface**: `api.tx.commitments.setMaxSpace`
- **summary**: Sudo-set MaxSpace

---

## contracts

### call(dest: `165`, value: `167`, gas_limit: `11`, storage_deposit_limit: `432`, data: `14`)

- **interface**: `api.tx.contracts.call`
- **summary**: Makes a call to an account, optionally transferring some balance. # Parameters _ `dest`: Address of the contract to call. _ `value`: The balance to transfer from the `origin` to `dest`. _ `gas_limit`: The gas limit enforced when executing the constructor. _ `storage_deposit_limit`: The maximum amount of balance that can be charged from the caller to pay for the storage consumed. _ `data`: The input data to pass to the contract. _ If the account is a smart-contract account, the associated code will be executed and any value will be transferred. _ If the account is a regular account, any value will be transferred. _ If no account exists and the call value is not less than `existential_deposit`, a regular account will be created and any value will be transferred.

---

### callOldWeight(dest: `165`, value: `167`, gas_limit: `12`, storage_deposit_limit: `432`, data: `14`)

- **interface**: `api.tx.contracts.callOldWeight`
- **summary**: Deprecated version if [`Self::call`] for use in an in-storage `Call`.

---

### instantiate(value: `167`, gas_limit: `11`, storage_deposit_limit: `432`, code_hash: `13`, data: `14`, salt: `14`)

- **interface**: `api.tx.contracts.instantiate`
- **summary**: Instantiates a contract from a previously deployed wasm binary. This function is identical to [`Self::instantiate_with_code`] but without the code deployment step. Instead, the `code_hash` of an on-chain deployed wasm binary must be supplied.

---

### instantiateOldWeight(value: `167`, gas_limit: `12`, storage_deposit_limit: `432`, code_hash: `13`, data: `14`, salt: `14`)

- **interface**: `api.tx.contracts.instantiateOldWeight`
- **summary**: Deprecated version if [`Self::instantiate`] for use in an in-storage `Call`.

---

### instantiateWithCode(value: `167`, gas_limit: `11`, storage_deposit_limit: `432`, code: `14`, data: `14`, salt: `14`)

- **interface**: `api.tx.contracts.instantiateWithCode`
- **summary**: Instantiates a new contract from the supplied `code` optionally transferring some balance. This dispatchable has the same effect as calling [`Self::upload_code`] + [`Self::instantiate`]. Bundling them together provides efficiency gains. Please also check the documentation of [`Self::upload_code`]. # Parameters _ `value`: The balance to transfer from the `origin` to the newly created contract. _ `gas_limit`: The gas limit enforced when executing the constructor. _ `storage_deposit_limit`: The maximum amount of balance that can be charged/reserved from the caller to pay for the storage consumed. _ `code`: The contract code to deploy in raw bytes. _ `data`: The input data to pass to the contract constructor. _ `salt`: Used for the address derivation. See [`Pallet::contract_address`]. Instantiation is executed as follows: - The supplied `code` is deployed, and a `code_hash` is created for that code. - If the `code_hash` already exists on the chain the underlying `code` will be shared. - The destination address is computed based on the sender, code_hash and the salt. - The smart-contract account is created at the computed address. - The `value` is transferred to the new account. - The `deploy` function is executed in the context of the newly-created account.

---

### instantiateWithCodeOldWeight(value: `167`, gas_limit: `12`, storage_deposit_limit: `432`, code: `14`, data: `14`, salt: `14`)

- **interface**: `api.tx.contracts.instantiateWithCodeOldWeight`
- **summary**: Deprecated version if [`Self::instantiate_with_code`] for use in an in-storage `Call`.

---

### migrate(weight_limit: `11`)

- **interface**: `api.tx.contracts.migrate`
- **summary**: When a migration is in progress, this dispatchable can be used to run migration steps. Calls that contribute to advancing the migration have their fees waived, as it's helpful for the chain. Note that while the migration is in progress, the pallet will also leverage the `on_idle` hooks to run migration steps.

---

### removeCode(code_hash: `13`)

- **interface**: `api.tx.contracts.removeCode`
- **summary**: Remove the code stored under `code_hash` and refund the deposit to its owner. A code can only be removed by its original uploader (its owner) and only if it is not used by any contract.

---

### setCode(dest: `165`, code_hash: `13`)

- **interface**: `api.tx.contracts.setCode`
- **summary**: Privileged function that changes the code of an existing contract. This takes care of updating refcounts and all other necessary operations. Returns an error if either the `code_hash` or `dest` do not exist. # Note This does **not** change the address of the contract in question. This means that the contract address is no longer derived from its code hash after calling this dispatchable.

---

### uploadCode(code: `14`, storage_deposit_limit: `432`, determinism: `433`)

- **interface**: `api.tx.contracts.uploadCode`
- **summary**: Upload new `code` without instantiating a contract from it. If the code does not already exist a deposit is reserved from the caller and unreserved only when [`Self::remove_code`] is called. The size of the reserve depends on the size of the supplied `code`. If the code already exists in storage it will still return `Ok` and upgrades the in storage version to the current [`InstructionWeights::version`](InstructionWeights). - `determinism`: If this is set to any other value but [`Determinism::Enforced`] then the only way to use this code is to delegate call into it from an offchain execution. Set to [`Determinism::Enforced`] if in doubt. # Note Anyone can instantiate a contract from any uploaded code and thus prevent its removal. To avoid this situation a constructor could employ access control so that it can only be instantiated by permissioned entities. The same is true when uploading through [`Self::instantiate_with_code`]. Use [`Determinism::Relaxed`] exclusively for non-deterministic code. If the uploaded code is deterministic, specifying [`Determinism::Relaxed`] will be disregarded and result in higher gas costs.

---

## crowdloan

### contribute(crowdloan_id: `104`, amount: `167`)

- **interface**: `api.tx.crowdloan.contribute`
- **summary**: Contribute to an active crowdloan. The contribution will be transfered to the crowdloan account and will be refunded if the crowdloan fails to raise the cap. If the contribution would raise the amount above the cap, the contribution will be set to the amount that is left to be raised. The dispatch origin for this call must be _Signed_. Parameters: - `crowdloan_id`: The id of the crowdloan to contribute to. - `amount`: The amount to contribute.

---

### create(deposit: `167`, min_contribution: `167`, cap: `167`, end: `104`, call: `429`, target_address: `58`)

- **interface**: `api.tx.crowdloan.create`
- **summary**: Create a crowdloan that will raise funds up to a maximum cap and if successful, will transfer funds to the target address if provided and dispatch the call (using creator origin). The initial deposit will be transfered to the crowdloan account and will be refunded in case the crowdloan fails to raise the cap. Additionally, the creator will pay for the execution of the call. The dispatch origin for this call must be _Signed_. Parameters: - `deposit`: The initial deposit from the creator. - `min_contribution`: The minimum contribution required to contribute to the crowdloan. - `cap`: The maximum amount of funds that can be raised. - `end`: The block number at which the crowdloan will end. - `call`: The call to dispatch when the crowdloan is finalized. - `target_address`: The address to transfer the raised funds to if provided.

---

### dissolve(crowdloan_id: `104`)

- **interface**: `api.tx.crowdloan.dissolve`
- **summary**: Dissolve a crowdloan. The crowdloan will be removed from the storage. All contributions must have been refunded before the crowdloan can be dissolved (except the creator's one). The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan. Parameters: - `crowdloan_id`: The id of the crowdloan to dissolve.

---

### finalize(crowdloan_id: `104`)

- **interface**: `api.tx.crowdloan.finalize`
- **summary**: Finalize crowdloan that has reached the cap. The call will transfer the raised amount to the target address if it was provided when the crowdloan was created and dispatch the call that was provided using the creator origin. The CurrentCrowdloanId will be set to the crowdloan id being finalized so the dispatched call can access it temporarily by accessing the `CurrentCrowdloanId` storage item. The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan. Parameters: - `crowdloan_id`: The id of the crowdloan to finalize.

---

### refund(crowdloan_id: `104`)

- **interface**: `api.tx.crowdloan.refund`
- **summary**: Refund contributors of a non-finalized crowdloan. The call will try to refund all contributors (excluding the creator) up to the limit defined by the `RefundContributorsLimit`. If the limit is reached, the call will stop and the crowdloan will be marked as partially refunded. It may be needed to dispatch this call multiple times to refund all contributors. The dispatch origin for this call must be _Signed_ and doesn't need to be the creator of the crowdloan. Parameters: - `crowdloan_id`: The id of the crowdloan to refund.

---

### updateCap(crowdloan_id: `104`, new_cap: `167`)

- **interface**: `api.tx.crowdloan.updateCap`
- **summary**: Update the cap of a non-finalized crowdloan. The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan. Parameters: - `crowdloan_id`: The id of the crowdloan to update the cap of. - `new_cap`: The new cap.

---

### updateEnd(crowdloan_id: `104`, new_end: `104`)

- **interface**: `api.tx.crowdloan.updateEnd`
- **summary**: Update the end block of a non-finalized crowdloan. The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan. Parameters: - `crowdloan_id`: The id of the crowdloan to update the end block of. - `new_end`: The new end block.

---

### updateMinContribution(crowdloan_id: `104`, new_min_contribution: `167`)

- **interface**: `api.tx.crowdloan.updateMinContribution`
- **summary**: Update the minimum contribution of a non-finalized crowdloan. The dispatch origin for this call must be _Signed_ and must be the creator of the crowdloan. Parameters: - `crowdloan_id`: The id of the crowdloan to update the minimum contribution of. - `new_min_contribution`: The new minimum contribution.

---

### withdraw(crowdloan_id: `104`)

- **interface**: `api.tx.crowdloan.withdraw`
- **summary**: Withdraw a contribution from an active (not yet finalized or dissolved) crowdloan. Only contributions over the deposit can be withdrawn by the creator. The dispatch origin for this call must be _Signed_. Parameters: - `crowdloan_id`: The id of the crowdloan to withdraw from.

---

## drand

### setBeaconConfig(config_payload: `424`, signature: `422`)

- **interface**: `api.tx.drand.setBeaconConfig`
- **summary**: allows the root user to set the beacon configuration generally this would be called from an offchain worker context. there is no verification of configurations, so be careful with this. _ `origin`: the root user _ `config`: the beacon configuration

---

### setOldestStoredRound(oldest_round: `6`)

- **interface**: `api.tx.drand.setOldestStoredRound`
- **summary**: allows the root user to set the oldest stored round

---

### writePulse(pulses_payload: `416`, signature: `422`)

- **interface**: `api.tx.drand.writePulse`
- **summary**: Verify and write a pulse from the beacon into the runtime

---

## ethereum

### transact(transaction: `395`)

- **interface**: `api.tx.ethereum.transact`
- **summary**: Transact an Ethereum transaction.

---

## evm

### call(source: `49`, target: `49`, input: `14`, value: `86`, gas_limit: `6`, max_fee_per_gas: `86`, max_priority_fee_per_gas: `410`, nonce: `410`, access_list: `411`, authorization_list: `406`)

- **interface**: `api.tx.evm.call`
- **summary**: Issue an EVM call operation. This is similar to a message call transaction in Ethereum.

---

### create(source: `49`, init: `14`, value: `86`, gas_limit: `6`, max_fee_per_gas: `86`, max_priority_fee_per_gas: `410`, nonce: `410`, access_list: `411`, authorization_list: `406`)

- **interface**: `api.tx.evm.create`
- **summary**: Issue an EVM create operation. This is similar to a contract creation transaction in Ethereum.

---

### create2(source: `49`, init: `14`, salt: `13`, value: `86`, gas_limit: `6`, max_fee_per_gas: `86`, max_priority_fee_per_gas: `410`, nonce: `410`, access_list: `411`, authorization_list: `406`)

- **interface**: `api.tx.evm.create2`
- **summary**: Issue an EVM create2 operation.

---

### disableWhitelist(disabled: `9`)

- **interface**: `api.tx.evm.disableWhitelist`

---

### setWhitelist(new: `413`)

- **interface**: `api.tx.evm.setWhitelist`

---

### withdraw(address: `49`, value: `6`)

- **interface**: `api.tx.evm.withdraw`
- **summary**: Withdraw balance from EVM into currency/balances pallet.

---

## grandpa

### noteStalled(delay: `4`, best_finalized_block_number: `4`)

- **interface**: `api.tx.grandpa.noteStalled`
- **summary**: Note that the current authority set of the GRANDPA finality gadget has stalled. This will trigger a forced authority set change at the beginning of the next session, to be enacted `delay` blocks after that. The `delay` should be high enough to safely assume that the block signalling the forced change will not be re-orged e.g. 1000 blocks. The block production rate (which may be slowed down because of finality lagging) should be taken into account when choosing the `delay`. The GRANDPA voters based on the new authority will start voting on top of `best_finalized_block_number` for new finalized blocks. `best_finalized_block_number` should be the highest of the latest finalized block of all validators of the new authority set. Only callable by root.

---

### reportEquivocation(equivocation_proof: `133`, key_owner_proof: `143`)

- **interface**: `api.tx.grandpa.reportEquivocation`
- **summary**: Report voter equivocation/misbehavior. This method will verify the equivocation proof and validate the given key ownership proof against the extracted offender. If both are valid, the offence will be reported.

---

### reportEquivocationUnsigned(equivocation_proof: `133`, key_owner_proof: `143`)

- **interface**: `api.tx.grandpa.reportEquivocationUnsigned`
- **summary**: Report voter equivocation/misbehavior. This method will verify the equivocation proof and validate the given key ownership proof against the extracted offender. If both are valid, the offence will be reported. This extrinsic must be called unsigned and it is expected that only block authors will call it (validated in `ValidateUnsigned`), as such if the block author is defined it will be defined as the equivocation reporter.

---

## mevShield

### announceNextKey(enc_key: `435`)

- **interface**: `api.tx.mevShield.announceNextKey`
- **summary**: Rotate the key chain and announce the current author's ML-KEM encapsulation key. Called as an inherent every block. `enc_key` is `None` on node failure, which removes the author from future shielded tx eligibility. Key rotation order (using pre-update AuthorKeys): 1. CurrentKey ← PendingKey 2. PendingKey ← NextKey 3. NextKey ← next-next author's key (user-facing) 4. AuthorKeys[current] ← announced key

---

### submitEncrypted(ciphertext: `437`)

- **interface**: `api.tx.mevShield.submitEncrypted`
- **summary**: Users submit an encrypted wrapper. Client‑side: 1. Read `NextKey` (ML‑KEM encapsulation key bytes) from storage. 2. Sign your extrinsic so that it can be executed when added to the pool, i.e. you may need to increment the nonce if you submit using the same account. 3. Encrypt: plaintext = signed_extrinsic key_hash = xxhash128(NextKey) kem_len = Length of kem_ct in bytes (u16) kem_ct = Ciphertext from ML‑KEM‑768 nonce = Random 24 bytes used for XChaCha20‑Poly1305 aead_ct = Ciphertext from XChaCha20‑Poly1305 with ML‑KEM‑768 + XChaCha20‑Poly1305, producing ciphertext = key_hash || kem_len || kem_ct || nonce || aead_ct

---

## multisig

### approveAsMulti(threshold: `40`, other_signatories: `168`, maybe_timepoint: `248`, call_hash: `1`, max_weight: `11`)

- **interface**: `api.tx.multisig.approveAsMulti`
- **summary**: Register approval for a dispatch to be made from a deterministic composite account if approved by a total of `threshold - 1` of `other_signatories`. Payment: `DepositBase` will be reserved if this is the first approval, plus `threshold` times `DepositFactor`. It is returned once this dispatch happens or is cancelled. The dispatch origin for this call must be _Signed_. - `threshold`: The total number of approvals for this dispatch before it is executed. - `other_signatories`: The accounts (other than the sender) who can approve this dispatch. May not be empty. - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is not the first approval, then it must be `Some`, with the timepoint (block number and transaction index) of the first approval transaction. - `call_hash`: The hash of the call to be executed. NOTE: If this is the final approval, you will want to use `as_multi` instead. ## Complexity - `O(S)`. - Up to one balance-reserve or unreserve operation. - One passthrough operation, one insert, both `O(S)` where `S` is the number of signatories. `S` is capped by `MaxSignatories`, with weight being proportional. - One encode & hash, both of complexity `O(S)`. - Up to one binary search and insert (`O(logS + S)`). - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove. - One event. - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit taken for its lifetime of `DepositBase + threshold * DepositFactor`.

---

### asMulti(threshold: `40`, other_signatories: `168`, maybe_timepoint: `248`, call: `245`, max_weight: `11`)

- **interface**: `api.tx.multisig.asMulti`
- **summary**: Register approval for a dispatch to be made from a deterministic composite account if approved by a total of `threshold - 1` of `other_signatories`. If there are enough, then dispatch the call. Payment: `DepositBase` will be reserved if this is the first approval, plus `threshold` times `DepositFactor`. It is returned once this dispatch happens or is cancelled. The dispatch origin for this call must be _Signed_. - `threshold`: The total number of approvals for this dispatch before it is executed. - `other_signatories`: The accounts (other than the sender) who can approve this dispatch. May not be empty. - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is not the first approval, then it must be `Some`, with the timepoint (block number and transaction index) of the first approval transaction. - `call`: The call to be executed. NOTE: Unless this is the final approval, you will generally want to use `approve_as_multi` instead, since it only requires a hash of the call. Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise on success, result is `Ok` and the result from the interior call, if it was executed, may be found in the deposited `MultisigExecuted` event. ## Complexity - `O(S + Z + Call)`. - Up to one balance-reserve or unreserve operation. - One passthrough operation, one insert, both `O(S)` where `S` is the number of signatories. `S` is capped by `MaxSignatories`, with weight being proportional. - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len. - One encode & hash, both of complexity `O(S)`. - Up to one binary search and insert (`O(logS + S)`). - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove. - One event. - The weight of the `call`. - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit taken for its lifetime of `DepositBase + threshold * DepositFactor`.

---

### asMultiThreshold1(other_signatories: `168`, call: `245`)

- **interface**: `api.tx.multisig.asMultiThreshold1`
- **summary**: Immediately dispatch a multi-signature call using a single approval from the caller. The dispatch origin for this call must be _Signed_. - `other_signatories`: The accounts (other than the sender) who are part of the multi-signature, but do not participate in the approval process. - `call`: The call to be executed. Result is equivalent to the dispatched result. ## Complexity O(Z + C) where Z is the length of the call and C its execution weight.

---

### cancelAsMulti(threshold: `40`, other_signatories: `168`, timepoint: `60`, call_hash: `1`)

- **interface**: `api.tx.multisig.cancelAsMulti`
- **summary**: Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously for this operation will be unreserved on success. The dispatch origin for this call must be _Signed_. - `threshold`: The total number of approvals for this dispatch before it is executed. - `other_signatories`: The accounts (other than the sender) who can approve this dispatch. May not be empty. - `timepoint`: The timepoint (block number and transaction index) of the first approval transaction for this dispatch. - `call_hash`: The hash of the call to be executed. ## Complexity - `O(S)`. - Up to one balance-reserve or unreserve operation. - One passthrough operation, one insert, both `O(S)` where `S` is the number of signatories. `S` is capped by `MaxSignatories`, with weight being proportional. - One encode & hash, both of complexity `O(S)`. - One event. - I/O: 1 read `O(S)`, one remove. - Storage: removes one item.

---

### pokeDeposit(threshold: `40`, other_signatories: `168`, call_hash: `1`)

- **interface**: `api.tx.multisig.pokeDeposit`
- **summary**: Poke the deposit reserved for an existing multisig operation. The dispatch origin for this call must be _Signed_ and must be the original depositor of the multisig operation. The transaction fee is waived if the deposit amount has changed. - `threshold`: The total number of approvals needed for this multisig. - `other_signatories`: The accounts (other than the sender) who are part of the multisig. - `call_hash`: The hash of the call this deposit is reserved for. Emits `DepositPoked` if successful.

---

## preimage

### ensureUpdated(hashes: `46`)

- **interface**: `api.tx.preimage.ensureUpdated`
- **summary**: Ensure that the bulk of pre-images is upgraded. The caller pays no fee if at least 90% of pre-images were successfully updated.

---

### notePreimage(bytes: `14`)

- **interface**: `api.tx.preimage.notePreimage`
- **summary**: Register a preimage on-chain. If the preimage was previously requested, no fees or deposits are taken for providing the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.

---

### requestPreimage(hash: `13`)

- **interface**: `api.tx.preimage.requestPreimage`
- **summary**: Request a preimage be uploaded to the chain without paying any fees or deposits. If the preimage requests has already been provided on-chain, we unreserve any deposit a user may have paid, and take the control of the preimage out of their hands.

---

### unnotePreimage(hash: `13`)

- **interface**: `api.tx.preimage.unnotePreimage`
- **summary**: Clear an unrequested preimage from the runtime storage. If `len` is provided, then it will be a much cheaper operation. - `hash`: The hash of the preimage to be removed from the store. - `len`: The length of the preimage of `hash`.

---

### unrequestPreimage(hash: `13`)

- **interface**: `api.tx.preimage.unrequestPreimage`
- **summary**: Clear a previously made request for a preimage. NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.

---

## proxy

### addProxy(delegate: `165`, proxy_type: `66`, delay: `4`)

- **interface**: `api.tx.proxy.addProxy`
- **summary**: Register a proxy account for the sender that is able to make calls on its behalf. The dispatch origin for this call must be _Signed_. Parameters: - `proxy`: The account that the `caller` would like to make a proxy. - `proxy_type`: The permissions allowed for this proxy account. - `delay`: The announcement period required of the initial proxy. Will generally be zero.

---

### announce(real: `165`, call_hash: `13`)

- **interface**: `api.tx.proxy.announce`
- **summary**: Publish the hash of a proxy-call that will be made in the future. This must be called some number of blocks before the corresponding `proxy` is attempted if the delay associated with the proxy relationship is greater than zero. No more than `MaxPending` announcements may be made at any one time. This will take a deposit of `AnnouncementDepositFactor` as well as `AnnouncementDepositBase` if there are no other pending announcements. The dispatch origin for this call must be _Signed_ and a proxy of `real`. Parameters: - `real`: The account that the proxy will make a call on behalf of. - `call_hash`: The hash of the call to be made by the `real` account.

---

### createPure(proxy_type: `66`, delay: `4`, index: `40`)

- **interface**: `api.tx.proxy.createPure`
- **summary**: Spawn a fresh new account that is guaranteed to be otherwise inaccessible, and initialize it with a proxy of `proxy_type` for `origin` sender. Requires a `Signed` origin. - `proxy_type`: The type of the proxy that the sender will be registered as over the new account. This will almost always be the most permissive `ProxyType` possible to allow for maximum flexibility. - `index`: A disambiguation index, in case this is called multiple times in the same transaction (e.g. with `utility::batch`). Unless you're using `batch` you probably just want to use `0`. - `delay`: The announcement period required of the initial proxy. Will generally be zero. Fails with `Duplicate` if this has already been called in this transaction, from the same sender, with the same parameters. Fails if there are insufficient funds to pay for deposit.

---

### killPure(spawner: `165`, proxy_type: `66`, index: `40`, height: `104`, ext_index: `104`)

- **interface**: `api.tx.proxy.killPure`
- **summary**: Removes a previously spawned pure proxy. WARNING: **All access to this account will be lost.** Any funds held in it will be inaccessible. Requires a `Signed` origin, and the sender account must have been created by a call to `create_pure` with corresponding parameters. - `spawner`: The account that originally called `create_pure` to create this account. - `index`: The disambiguation index originally passed to `create_pure`. Probably `0`. - `proxy_type`: The proxy type originally passed to `create_pure`. - `height`: The height of the chain when the call to `create_pure` was processed. - `ext_index`: The extrinsic index in which the call to `create_pure` was processed. Fails with `NoPermission` in case the caller is not a previously created pure account whose `create_pure` call has corresponding parameters.

---

### pokeDeposit()

- **interface**: `api.tx.proxy.pokeDeposit`
- **summary**: Poke / Adjust deposits made for proxies and announcements based on current values. This can be used by accounts to possibly lower their locked amount. The dispatch origin for this call must be _Signed_. The transaction fee is waived if the deposit amount has changed. Emits `DepositPoked` if successful.

---

### proxy(real: `165`, force_proxy_type: `253`, call: `245`)

- **interface**: `api.tx.proxy.proxy`
- **summary**: Dispatch the given `call` from an account that the sender is authorised for through `add_proxy`. The dispatch origin for this call must be _Signed_. Parameters: - `real`: The account that the proxy will make a call on behalf of. - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call. - `call`: The call to be made by the `real` account.

---

### proxyAnnounced(delegate: `165`, real: `165`, force_proxy_type: `253`, call: `245`)

- **interface**: `api.tx.proxy.proxyAnnounced`
- **summary**: Dispatch the given `call` from an account that the sender is authorized for through `add_proxy`. Removes any corresponding announcement(s). The dispatch origin for this call must be _Signed_. Parameters: - `real`: The account that the proxy will make a call on behalf of. - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call. - `call`: The call to be made by the `real` account.

---

### rejectAnnouncement(delegate: `165`, call_hash: `13`)

- **interface**: `api.tx.proxy.rejectAnnouncement`
- **summary**: Remove the given announcement of a delegate. May be called by a target (proxied) account to remove a call that one of their delegates (`delegate`) has announced they want to execute. The deposit is returned. The dispatch origin for this call must be _Signed_. Parameters: - `delegate`: The account that previously announced the call. - `call_hash`: The hash of the call to be made.

---

### removeAnnouncement(real: `165`, call_hash: `13`)

- **interface**: `api.tx.proxy.removeAnnouncement`
- **summary**: Remove a given announcement. May be called by a proxy account to remove a call they previously announced and return the deposit. The dispatch origin for this call must be _Signed_. Parameters: - `real`: The account that the proxy will make a call on behalf of. - `call_hash`: The hash of the call to be made by the `real` account.

---

### removeProxies()

- **interface**: `api.tx.proxy.removeProxies`
- **summary**: Unregister all proxy accounts for the sender. The dispatch origin for this call must be _Signed_. WARNING: This may be called on accounts created by `create_pure`, however if done, then the unreserved fees will be inaccessible. **All access to this account will be lost.**

---

### removeProxy(delegate: `165`, proxy_type: `66`, delay: `4`)

- **interface**: `api.tx.proxy.removeProxy`
- **summary**: Unregister a proxy account for the sender. The dispatch origin for this call must be _Signed_. Parameters: - `proxy`: The account that the `caller` would like to remove as a proxy. - `proxy_type`: The permissions currently enabled for the removed proxy account.

---

### setRealPaysFee(delegate: `165`, pays_fee: `9`)

- **interface**: `api.tx.proxy.setRealPaysFee`
- **summary**: Set whether the real account pays transaction fees for proxy calls made by a specific delegate. The dispatch origin for this call must be _Signed_ and must be the real (delegator) account that has an existing proxy relationship with the delegate. Parameters: - `delegate`: The proxy account for which to set the fee payment preference. - `pays_fee`: If `true`, the real account will pay fees for proxy calls made by this delegate. If `false`, the delegate pays (default behavior).

---

## registry

### clearIdentity(identified: `0`)

- **interface**: `api.tx.registry.clearIdentity`
- **summary**: Clear the identity of an account.

---

### setIdentity(identified: `0`, info: `255`)

- **interface**: `api.tx.registry.setIdentity`
- **summary**: Register an identity for an account. This will overwrite any existing identity.

---

## safeMode

### enter()

- **interface**: `api.tx.safeMode.enter`
- **summary**: Enter safe-mode permissionlessly for [`Config::EnterDuration`] blocks. Reserves [`Config::EnterDepositAmount`] from the caller's account. Emits an [`Event::Entered`] event on success. Errors with [`Error::Entered`] if the safe-mode is already entered. Errors with [`Error::NotConfigured`] if the deposit amount is `None`.

---

### extend()

- **interface**: `api.tx.safeMode.extend`
- **summary**: Extend the safe-mode permissionlessly for [`Config::ExtendDuration`] blocks. This accumulates on top of the current remaining duration. Reserves [`Config::ExtendDepositAmount`] from the caller's account. Emits an [`Event::Extended`] event on success. Errors with [`Error::Exited`] if the safe-mode is entered. Errors with [`Error::NotConfigured`] if the deposit amount is `None`. This may be called by any signed origin with [`Config::ExtendDepositAmount`] free currency to reserve. This call can be disabled for all origins by configuring [`Config::ExtendDepositAmount`] to `None`.

---

### forceEnter()

- **interface**: `api.tx.safeMode.forceEnter`
- **summary**: Enter safe-mode by force for a per-origin configured number of blocks. Emits an [`Event::Entered`] event on success. Errors with [`Error::Entered`] if the safe-mode is already entered. Can only be called by the [`Config::ForceEnterOrigin`] origin.

---

### forceExit()

- **interface**: `api.tx.safeMode.forceExit`
- **summary**: Exit safe-mode by force. Emits an [`Event::Exited`] with [`ExitReason::Force`] event on success. Errors with [`Error::Exited`] if the safe-mode is inactive. Note: `safe-mode` will be automatically deactivated by [`Pallet::on_initialize`] hook after the block height is greater than the [`EnteredUntil`] storage item. Emits an [`Event::Exited`] with [`ExitReason::Timeout`] event when deactivated in the hook.

---

### forceExtend()

- **interface**: `api.tx.safeMode.forceExtend`
- **summary**: Extend the safe-mode by force for a per-origin configured number of blocks. Emits an [`Event::Extended`] event on success. Errors with [`Error::Exited`] if the safe-mode is inactive. Can only be called by the [`Config::ForceExtendOrigin`] origin.

---

### forceReleaseDeposit(account: `0`, block: `4`)

- **interface**: `api.tx.safeMode.forceReleaseDeposit`
- **summary**: Force to release a deposit for an account that entered safe-mode at a given historical block. This can be called while safe-mode is still entered. Emits a [`Event::DepositReleased`] event on success. Errors with [`Error::Entered`] if safe-mode is entered. Errors with [`Error::NoDeposit`] if the payee has no reserved currency at the specified block. Can only be called by the [`Config::ForceDepositOrigin`] origin.

---

### forceSlashDeposit(account: `0`, block: `4`)

- **interface**: `api.tx.safeMode.forceSlashDeposit`
- **summary**: Slash a deposit for an account that entered or extended safe-mode at a given historical block. This can only be called while safe-mode is entered. Emits a [`Event::DepositSlashed`] event on success. Errors with [`Error::Entered`] if safe-mode is entered. Can only be called by the [`Config::ForceDepositOrigin`] origin.

---

### releaseDeposit(account: `0`, block: `4`)

- **interface**: `api.tx.safeMode.releaseDeposit`
- **summary**: Permissionlessly release a deposit for an account that entered safe-mode at a given historical block. The call can be completely disabled by setting [`Config::ReleaseDelay`] to `None`. This cannot be called while safe-mode is entered and not until [`Config::ReleaseDelay`] blocks have passed since safe-mode was entered. Emits a [`Event::DepositReleased`] event on success. Errors with [`Error::Entered`] if the safe-mode is entered. Errors with [`Error::CannotReleaseYet`] if [`Config::ReleaseDelay`] block have not passed since safe-mode was entered. Errors with [`Error::NoDeposit`] if the payee has no reserved currency at the block specified.

---

## scheduler

### cancel(when: `4`, index: `4`)

- **interface**: `api.tx.scheduler.cancel`
- **summary**: Cancel an anonymously scheduled task.

---

### cancelNamed(id: `1`)

- **interface**: `api.tx.scheduler.cancelNamed`
- **summary**: Cancel a named scheduled task.

---

### cancelRetry(task: `63`)

- **interface**: `api.tx.scheduler.cancelRetry`
- **summary**: Removes the retry configuration of a task.

---

### cancelRetryNamed(id: `1`)

- **interface**: `api.tx.scheduler.cancelRetryNamed`
- **summary**: Cancel the retry configuration of a named task.

---

### schedule(when: `4`, maybe_periodic: `251`, priority: `2`, call: `245`)

- **interface**: `api.tx.scheduler.schedule`
- **summary**: Anonymously schedule a task.

---

### scheduleAfter(after: `4`, maybe_periodic: `251`, priority: `2`, call: `245`)

- **interface**: `api.tx.scheduler.scheduleAfter`
- **summary**: Anonymously schedule a task after a delay.

---

### scheduleNamed(id: `1`, when: `4`, maybe_periodic: `251`, priority: `2`, call: `245`)

- **interface**: `api.tx.scheduler.scheduleNamed`
- **summary**: Schedule a named task.

---

### scheduleNamedAfter(id: `1`, after: `4`, maybe_periodic: `251`, priority: `2`, call: `245`)

- **interface**: `api.tx.scheduler.scheduleNamedAfter`
- **summary**: Schedule a named task after a delay.

---

### setRetry(task: `63`, retries: `2`, period: `4`)

- **interface**: `api.tx.scheduler.setRetry`
- **summary**: Set a retry configuration for a task so that, in case its scheduled run fails, it will be retried after `period` blocks, for a total amount of `retries` retries or until it succeeds. Tasks which need to be scheduled for a retry are still subject to weight metering and agenda space, same as a regular task. If a periodic task fails, it will be scheduled normally while the task is retrying. Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic clones of the original task. Their retry configuration will be derived from the original task's configuration, but will have a lower value for `remaining` than the original `total_retries`.

---

### setRetryNamed(id: `1`, retries: `2`, period: `4`)

- **interface**: `api.tx.scheduler.setRetryNamed`
- **summary**: Set a retry configuration for a named task so that, in case its scheduled run fails, it will be retried after `period` blocks, for a total amount of `retries` retries or until it succeeds. Tasks which need to be scheduled for a retry are still subject to weight metering and agenda space, same as a regular task. If a periodic task fails, it will be scheduled normally while the task is retrying. Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic clones of the original task. Their retry configuration will be derived from the original task's configuration, but will have a lower value for `remaining` than the original `total_retries`.

---

## subtensorModule

### addStake(hotkey: `0`, netuid: `40`, amount_staked: `6`)

- **interface**: `api.tx.subtensorModule.addStake`
- **summary**: --- Adds stake to a hotkey. The call is made from a coldkey account. This delegates stake to the hotkey. Note: the coldkey account may own the hotkey, in which case they are delegating to themselves. # Args: _ 'origin': - The signature of the caller's coldkey. _ 'hotkey' (T::AccountId): - The associated hotkey account. _ 'netuid' (u16): - Subnetwork UID _ 'amount*staked' (u64): - The amount of stake to be added to the hotkey staking account. # Event: * StakeAdded; - On the successfully adding stake to a global account. # Raises: _ 'NotEnoughBalanceToStake': - Not enough balance on the coldkey to add onto the global account. _ 'NonAssociatedColdKey': - The calling coldkey is not associated with this hotkey. \_ 'BalanceWithdrawalError': - Errors stemming from transaction pallet.

---

### addStakeBurn(hotkey: `0`, netuid: `40`, amount: `6`, limit: `241`)

- **interface**: `api.tx.subtensorModule.addStakeBurn`
- **summary**: --- The extrinsic is a combination of add_stake(add_stake_limit) and burn_alpha. We buy alpha token first and immediately burn the acquired amount of alpha (aka Subnet buyback).

---

### addStakeLimit(hotkey: `0`, netuid: `40`, amount_staked: `6`, limit_price: `6`, allow_partial: `9`)

- **interface**: `api.tx.subtensorModule.addStakeLimit`
- **summary**: --- Adds stake to a hotkey on a subnet with a price limit. This extrinsic allows to specify the limit price for alpha token at which or better (lower) the staking should execute. In case if slippage occurs and the price shall move beyond the limit price, the staking order may execute only partially or not execute at all. # Args: _ 'origin': - The signature of the caller's coldkey. _ 'hotkey' (T::AccountId): - The associated hotkey account. _ 'netuid' (u16): - Subnetwork UID _ 'amount*staked' (u64): - The amount of stake to be added to the hotkey staking account. * 'limit*price' (u64): - The limit price expressed in units of RAO per one Alpha. * 'allow*partial' (bool): - Allows partial execution of the amount. If set to false, this becomes fill or kill type or order. # Event: * StakeAdded; - On the successfully adding stake to a global account. # Raises: _ 'NotEnoughBalanceToStake': - Not enough balance on the coldkey to add onto the global account. _ 'NonAssociatedColdKey': - The calling coldkey is not associated with this hotkey. \_ 'BalanceWithdrawalError': - Errors stemming from transaction pallet.

---

### announceColdkeySwap(new_coldkey_hash: `13`)

- **interface**: `api.tx.subtensorModule.announceColdkeySwap`
- **summary**: Announces a coldkey swap using BlakeTwo256 hash of the new coldkey. This is required before the coldkey swap can be performed after the delay period. It can be reannounced after a delay of `ColdkeySwapReannouncementDelay` following the first valid execution block of the original announcement. The dispatch origin of this call must be the original coldkey that made the announcement. - `new_coldkey_hash`: The hash of the new coldkey using BlakeTwo256. The `ColdkeySwapAnnounced` event is emitted on successful announcement.

---

### associateEvmKey(netuid: `40`, evm_key: `49`, block_number: `6`, signature: `240`)

- **interface**: `api.tx.subtensorModule.associateEvmKey`
- **summary**: Attempts to associate a hotkey with an EVM key. The signature will be checked to see if the recovered public key matches the `evm_key` provided. The EVM key is expected to sign the message according to this formula to produce the signature: `text keccak_256(hotkey ++ keccak_256(block_number)) ` # Arguments _ `origin` - The origin of the transaction, which must be signed by the `hotkey`. _ `netuid` - The netuid that the `hotkey` belongs to. _ `evm_key` - The EVM key to associate with the `hotkey`. _ `block_number` - The block number used in the `signature`. _ `signature` - A signed message by the `evm_key` containing the `hotkey` and the hashed `block_number`. # Errors Returns an error if: _ The transaction is not signed. _ The hotkey does not belong to the subnet identified by the netuid. _ The EVM key cannot be recovered from the signature. \* The EVM key recovered from the signature does not match the given EVM key. # Events May emit a `EvmKeyAssociated` event on success

---

### batchCommitWeights(netuids: `47`, commit_hashes: `46`)

- **interface**: `api.tx.subtensorModule.batchCommitWeights`
- **summary**: --- Allows a hotkey to commit weight hashes for multiple netuids as a batch. # Args: _ `origin`: - - The caller, a hotkey who wishes to set their weights. _ `netuids` - : - The network uids we are setting these weights on. _ `commit_hashes` : - The commit hashes to commit. # Event: _ WeightsSet; - On successfully setting the weights on chain. _ BatchWeightsCompleted; - On success of the batch. _ BatchCompletedWithErrors; - On failure of any of the weights in the batch. \* BatchWeightItemFailed; - On failure for each failed item in the batch.

---

### batchRevealWeights(netuid: `40`, uids_list: `237`, values_list: `237`, salts_list: `237`, version_keys: `90`)

- **interface**: `api.tx.subtensorModule.batchRevealWeights`
- **summary**: ---- The implementation for batch revealing committed weights. # Args: _ `origin`: (`- ::RuntimeOrigin`): - The signature of the revealing hotkey. _ `netuid` (`u16`): - The u16 network identifier. _ `uids_list` (): - A list of uids for each set of weights being revealed. _ `values_list` ): - A list of values for each set of weights being revealed. _ `salts_list` (): - A list of salts used to generate the commit hashes. _ `version_keys` (`Vec<u64>`): - A list of network version keys. # Raises: _ `CommitRevealDisabled`: - Attempting to reveal weights when the commit-reveal mechanism is disabled. _ `NoWeightsCommitFound`: - Attempting to reveal weights without an existing commit. _ `ExpiredWeightCommit`: - Attempting to reveal a weight commit that has expired. _ `RevealTooEarly`: - Attempting to reveal weights outside the valid reveal period. _ `InvalidRevealCommitHashNotMatch`: - The revealed hash does not match any committed hash. _ `InvalidInputLengths`: - The input vectors are of mismatched lengths.

---

### batchSetWeights(netuids: `47`, weights: `232`, version_keys: `236`)

- **interface**: `api.tx.subtensorModule.batchSetWeights`
- **summary**: --- Allows a hotkey to set weights for multiple netuids as a batch. # Args: _ `origin`: - - The caller, a hotkey who wishes to set their weights. _ `netuids` - : - The network uids we are setting these weights on. _ `weights` (Vec- ,- )>): - The weights to set for each network. [(uid, weight), ...] _ `version_keys` (Vec- ): - The network version keys to check if the validator is up to date. # Event: _ WeightsSet; - On successfully setting the weights on chain. _ BatchWeightsCompleted; - On success of the batch. _ BatchCompletedWithErrors; - On failure of any of the weights in the batch. _ BatchWeightItemFailed; - On failure for each failed item in the batch.

---

### burnAlpha(hotkey: `0`, amount: `6`, netuid: `40`)

- **interface**: `api.tx.subtensorModule.burnAlpha`
- **summary**: Burns alpha from a cold/hot key pair without reducing `AlphaOut` # Arguments _ `origin` - The origin of the call (must be signed by the coldkey) _ `hotkey` - The hotkey account _ `amount` - The amount of alpha to burn _ `netuid` - The subnet ID # Events Emits a `TokensBurned` event on success.

---

### burnedRegister(netuid: `40`, hotkey: `0`)

- **interface**: `api.tx.subtensorModule.burnedRegister`
- **summary**: User register a new subnetwork via burning token

---

### claimRoot(subnets: `54`)

- **interface**: `api.tx.subtensorModule.claimRoot`
- **summary**: --- Claims the root emissions for a coldkey. # Args: _ 'origin': - - The signature of the caller's coldkey. # Event: _ RootClaimed; - On the successfully claiming the root emissions for a coldkey. # Raises:

---

### clearColdkeySwapAnnouncement()

- **interface**: `api.tx.subtensorModule.clearColdkeySwapAnnouncement`
- **summary**: Clears a coldkey swap announcement after the reannouncement delay if it has not been disputed. The `ColdkeySwapCleared` event is emitted on successful clear.

---

### commitCrv3MechanismWeights(netuid: `40`, mecid: `2`, commit: `219`, reveal_round: `6`)

- **interface**: `api.tx.subtensorModule.commitCrv3MechanismWeights`
- **summary**: ---- Used to commit encrypted commit-reveal v3 weight values to later be revealed. # Args: _ `origin`: (`- ::RuntimeOrigin`): - The committing hotkey. _ `netuid` (`u16`): - The u16 network identifier. _ `commit` (`- `): - The encrypted compressed commit. The steps for this are: 1. Instantiate [`WeightsTlockPayload`] 2. Serialize it using the `parity_scale_codec::Encode` trait 3. Encrypt it following the steps (here)[https://github.com/ideal-lab5/tle/blob/f8e6019f0fb02c380ebfa6b30efb61786dede07b/timelock/src/tlock.rs#L283-L336] to produce a [`TLECiphertext<TinyBLS381>`] type. 4. Serialize and compress using the `ark-serialize` `CanonicalSerialize` trait. _ reveal*round (`u64`): - The drand reveal round which will be avaliable during epoch `n+1` from the current epoch. # Raises: * `CommitRevealV3Disabled`: - Attempting to commit when the commit-reveal mechanism is disabled. _ `TooManyUnrevealedCommits`: - Attempting to commit when the user has more than the allowed limit of unrevealed commits. ---- Used to commit encrypted commit-reveal v3 weight values to later be revealed for mechanisms. # Args: _ `origin`: (`- ::RuntimeOrigin`): - The committing hotkey. _ `netuid` (`u16`): - The u16 network identifier. _ `mecid` (`u8`): - The u8 mechanism identifier. _ `commit` (`- `): - The encrypted compressed commit. The steps for this are: 1. Instantiate [`WeightsTlockPayload`] 2. Serialize it using the `parity_scale_codec::Encode` trait 3. Encrypt it following the steps (here)[https://github.com/ideal-lab5/tle/blob/f8e6019f0fb02c380ebfa6b30efb61786dede07b/timelock/src/tlock.rs#L283-L336] to produce a [`TLECiphertext<TinyBLS381>`] type. 4. Serialize and compress using the `ark-serialize` `CanonicalSerialize` trait. _ reveal*round (`u64`): - The drand reveal round which will be avaliable during epoch `n+1` from the current epoch. # Raises: * `CommitRevealV3Disabled`: - Attempting to commit when the commit-reveal mechanism is disabled. \* `TooManyUnrevealedCommits`: - Attempting to commit when the user has more than the allowed limit of unrevealed commits.

---

### commitMechanismWeights(netuid: `40`, mecid: `2`, commit_hash: `13`)

- **interface**: `api.tx.subtensorModule.commitMechanismWeights`
- **summary**: ---- Used to commit a hash of your weight values to later be revealed for mechanisms. # Args: _ `origin`: (`- ::RuntimeOrigin`): - The signature of the committing hotkey. _ `netuid` (`u16`): - The u16 network identifier. _ `mecid` (`u8`): - The u8 mechanism identifier. _ `commit_hash` (`H256`): - The hash representing the committed weights. # Raises: _ `CommitRevealDisabled`: - Attempting to commit when the commit-reveal mechanism is disabled. _ `TooManyUnrevealedCommits`: - Attempting to commit when the user has more than the allowed limit of unrevealed commits.

---

### commitTimelockedMechanismWeights(netuid: `40`, mecid: `2`, commit: `219`, reveal_round: `6`, commit_reveal_version: `40`)

- **interface**: `api.tx.subtensorModule.commitTimelockedMechanismWeights`
- **summary**: ---- Used to commit timelock encrypted commit-reveal weight values to later be revealed for a mechanism. # Args: _ `origin`: (`- ::RuntimeOrigin`): - The committing hotkey. _ `netuid` (`u16`): - The u16 network identifier. _ `mecid` (`u8`): - The u8 mechanism identifier. _ `commit` (`- `): - The encrypted compressed commit. The steps for this are: 1. Instantiate [`WeightsTlockPayload`] 2. Serialize it using the `parity_scale_codec::Encode` trait 3. Encrypt it following the steps (here)[https://github.com/ideal-lab5/tle/blob/f8e6019f0fb02c380ebfa6b30efb61786dede07b/timelock/src/tlock.rs#L283-L336] to produce a [`TLECiphertext<TinyBLS381>`] type. 4. Serialize and compress using the `ark-serialize` `CanonicalSerialize` trait. _ reveal_round (`u64`): - The drand reveal round which will be avaliable during epoch `n+1` from the current epoch. _ commit_reveal_version (`u16`): - The client (bittensor-drand) version

---

### commitTimelockedWeights(netuid: `40`, commit: `219`, reveal_round: `6`, commit_reveal_version: `40`)

- **interface**: `api.tx.subtensorModule.commitTimelockedWeights`
- **summary**: ---- Used to commit timelock encrypted commit-reveal weight values to later be revealed. # Args: _ `origin`: (`- ::RuntimeOrigin`): - The committing hotkey. _ `netuid` (`u16`): - The u16 network identifier. _ `commit` (`- `): - The encrypted compressed commit. The steps for this are: 1. Instantiate [`WeightsTlockPayload`] 2. Serialize it using the `parity_scale_codec::Encode` trait 3. Encrypt it following the steps (here)[https://github.com/ideal-lab5/tle/blob/f8e6019f0fb02c380ebfa6b30efb61786dede07b/timelock/src/tlock.rs#L283-L336] to produce a [`TLECiphertext<TinyBLS381>`] type. 4. Serialize and compress using the `ark-serialize` `CanonicalSerialize` trait. _ reveal_round (`u64`): - The drand reveal round which will be avaliable during epoch `n+1` from the current epoch. \* commit_reveal_version (`u16`): - The client (bittensor-drand) version

---

### commitWeights(netuid: `40`, commit_hash: `13`)

- **interface**: `api.tx.subtensorModule.commitWeights`
- **summary**: ---- Used to commit a hash of your weight values to later be revealed. # Args: _ `origin`: (`- ::RuntimeOrigin`): - The signature of the committing hotkey. _ `netuid` (`u16`): - The u16 network identifier. _ `commit_hash` (`H256`): - The hash representing the committed weights. # Raises: _ `CommitRevealDisabled`: - Attempting to commit when the commit-reveal mechanism is disabled. \* `TooManyUnrevealedCommits`: - Attempting to commit when the user has more than the allowed limit of unrevealed commits.

---

### decreaseTake(hotkey: `0`, take: `40`)

- **interface**: `api.tx.subtensorModule.decreaseTake`
- **summary**: --- Allows delegates to decrease its take value. # Args: _ 'origin': (::Origin): - The signature of the caller's coldkey. _ 'hotkey' (T::AccountId): - The hotkey we are delegating (must be owned by the coldkey.) _ 'netuid' (u16): - Subnet ID to decrease take for _ 'take' (u16): - The new stake proportion that this hotkey takes from delegations. The new value can be between 0 and 11*796 and should be strictly lower than the previous value. It T is the new value (rational number), the the parameter is calculated as [65535 * T]. For example, 1% would be [0.01 * 65535] = [655.35] = 655 # Event: \* TakeDecreased; - On successfully setting a decreased take for this hotkey. # Raises: _ 'NotRegistered': - The hotkey we are delegating is not registered on the network. _ 'NonAssociatedColdKey': - The hotkey we are delegating is not owned by the calling coldkey. \_ 'DelegateTakeTooLow': - The delegate is setting a take which is not lower than the previous.

---

### disableVotingPowerTracking(netuid: `40`)

- **interface**: `api.tx.subtensorModule.disableVotingPowerTracking`
- **summary**: Schedules disabling of voting power tracking for a subnet. This function can be called by the subnet owner or root. Voting power tracking will continue for 14 days (grace period) after this call, then automatically disable and clear all VotingPower entries for the subnet. # Arguments: _ `origin` - The origin of the call, must be subnet owner or root. _ `netuid` - The subnet to schedule disabling voting power tracking for. # Errors: _ `SubnetNotExist` - If the subnet does not exist. _ `NotSubnetOwner` - If the caller is not the subnet owner or root. \* `VotingPowerTrackingNotEnabled` - If voting power tracking is not enabled.

---

### disputeColdkeySwap()

- **interface**: `api.tx.subtensorModule.disputeColdkeySwap`
- **summary**: Dispute a coldkey swap. This will prevent any further actions on the coldkey swap until triumvirate step in to resolve the issue. - `coldkey`: The coldkey to dispute the swap for.

---

### dissolveNetwork(coldkey: `0`, netuid: `40`)

- **interface**: `api.tx.subtensorModule.dissolveNetwork`
- **summary**: Remove a user's subnetwork The caller must be the owner of the network

---

### enableVotingPowerTracking(netuid: `40`)

- **interface**: `api.tx.subtensorModule.enableVotingPowerTracking`
- **summary**: Enables voting power tracking for a subnet. This function can be called by the subnet owner or root. When enabled, voting power EMA is updated every epoch for all validators. Voting power starts at 0 and increases over epochs. # Arguments: _ `origin` - The origin of the call, must be subnet owner or root. _ `netuid` - The subnet to enable voting power tracking for. # Errors: _ `SubnetNotExist` - If the subnet does not exist. _ `NotSubnetOwner` - If the caller is not the subnet owner or root.

---

### increaseTake(hotkey: `0`, take: `40`)

- **interface**: `api.tx.subtensorModule.increaseTake`
- **summary**: --- Allows delegates to increase its take value. This call is rate-limited. # Args: _ 'origin': (- ::Origin): - The signature of the caller's coldkey. _ 'hotkey' (T::AccountId): - The hotkey we are delegating (must be owned by the coldkey.) _ 'take' (u16): - The new stake proportion that this hotkey takes from delegations. The new value can be between 0 and 11_796 and should be strictly greater than the previous value. T is the new value (rational number), the the parameter is calculated as [65535 _ T]. For example, 1% would be [0.01 * 65535] = [655.35] = 655 # Event: _ TakeIncreased; - On successfully setting a increased take for this hotkey. # Raises: _ 'NotRegistered': - The hotkey we are delegating is not registered on the network. _ 'NonAssociatedColdKey': - The hotkey we are delegating is not owned by the calling coldkey. _ 'DelegateTakeTooHigh': - The delegate is setting a take which is not greater than the previous.

---

### moveStake(origin_hotkey: `0`, destination_hotkey: `0`, origin_netuid: `40`, destination_netuid: `40`, alpha_amount: `6`)

- **interface**: `api.tx.subtensorModule.moveStake`
- **summary**: ---- The implementation for the extrinsic move*stake: Moves specified amount of stake from a hotkey to another across subnets. # Args: * `origin` - (- ::Origin): - The signature of the caller's coldkey. _ `origin_hotkey` (T::AccountId): - The hotkey account to move stake from. _ `destination_hotkey` (T::AccountId): - The hotkey account to move stake to. _ `origin_netuid` (T::AccountId): - The subnet ID to move stake from. _ `destination_netuid` (T::AccountId): - The subnet ID to move stake to. \_ `alpha_amount` (T::AccountId): - The alpha stake amount to move.

---

### recycleAlpha(hotkey: `0`, amount: `6`, netuid: `40`)

- **interface**: `api.tx.subtensorModule.recycleAlpha`
- **summary**: Recycles alpha from a cold/hot key pair, reducing AlphaOut on a subnet # Arguments _ `origin` - The origin of the call (must be signed by the coldkey) _ `hotkey` - The hotkey account _ `amount` - The amount of alpha to recycle _ `netuid` - The subnet ID # Events Emits a `TokensRecycled` event on success.

---

### register(netuid: `40`, block_number: `6`, nonce: `6`, work: `14`, hotkey: `0`, coldkey: `0`)

- **interface**: `api.tx.subtensorModule.register`
- **summary**: ---- Registers a new neuron to the subnetwork. # Args: _ 'origin': - - The signature of the calling hotkey. _ 'netuid' (u16): - The u16 network identifier. _ 'block_number' ( u64 ): - Block hash used to prove work done. _ 'nonce' ( u64 ): - Positive integer nonce used in POW. _ 'work' ( - ): - Vector encoded bytes representing work done. _ 'hotkey' ( T::AccountId ): - Hotkey to be registered to the network. _ 'coldkey' ( T::AccountId ): - Associated coldkey account. # Event: _ NeuronRegistered; - On successfully registering a uid to a neuron slot on a subnetwork. # Raises: _ 'MechanismDoesNotExist': - Attempting to register to a non existent network. _ 'TooManyRegistrationsThisBlock': - This registration exceeds the total allowed on this network this block. _ 'HotKeyAlreadyRegisteredInSubNet': - The hotkey is already registered on this network. _ 'InvalidWorkBlock': - The work has been performed on a stale, future, or non existent block. _ 'InvalidDifficulty': - The work does not match the difficulty. _ 'InvalidSeal': - The seal is incorrect.

---

### registerLeasedNetwork(emissions_share: `229`, end_block: `51`)

- **interface**: `api.tx.subtensorModule.registerLeasedNetwork`
- **summary**: Register a new leased network. The crowdloan's contributions are used to compute the share of the emissions that the contributors will receive as dividends. The leftover cap is refunded to the contributors and the beneficiary. # Args: _ `origin` - (- ::Origin): - The signature of the caller's coldkey. _ `emissions_share` (Percent): - The share of the emissions that the contributors will receive as dividends. \* `end_block` (Option- ): - The block at which the lease will end. If not defined, the lease is perpetual.

---

### registerNetwork(hotkey: `0`)

- **interface**: `api.tx.subtensorModule.registerNetwork`
- **summary**: User register a new subnetwork

---

### registerNetworkWithIdentity(hotkey: `0`, identity: `239`)

- **interface**: `api.tx.subtensorModule.registerNetworkWithIdentity`
- **summary**: User register a new subnetwork

---

### removeStake(hotkey: `0`, netuid: `40`, amount_unstaked: `6`)

- **interface**: `api.tx.subtensorModule.removeStake`
- **summary**: Remove stake from the staking account. The call must be made from the coldkey account attached to the neuron metadata. Only this key has permission to make staking and unstaking requests. # Args: _ 'origin': - - The signature of the caller's coldkey. _ 'hotkey' (T::AccountId): - The associated hotkey account. _ 'netuid' (u16): - Subnetwork UID _ 'amount*unstaked' (u64): - The amount of stake to be added to the hotkey staking account. # Event: * StakeRemoved; - On the successfully removing stake from the hotkey account. # Raises: _ 'NotRegistered': - Thrown if the account we are attempting to unstake from is non existent. _ 'NonAssociatedColdKey': - Thrown if the coldkey does not own the hotkey we are unstaking from. \_ 'NotEnoughStakeToWithdraw': - Thrown if there is not enough stake on the hotkey to withdwraw this amount.

---

### removeStakeFullLimit(hotkey: `0`, netuid: `40`, limit_price: `241`)

- **interface**: `api.tx.subtensorModule.removeStakeFullLimit`
- **summary**: Removes all stake from a hotkey on a subnet with a price limit. This extrinsic allows to specify the limit price for alpha token at which or better (higher) the staking should execute. Without limit_price it remove all the stake similar to `remove_stake` extrinsic

---

### removeStakeLimit(hotkey: `0`, netuid: `40`, amount_unstaked: `6`, limit_price: `6`, allow_partial: `9`)

- **interface**: `api.tx.subtensorModule.removeStakeLimit`
- **summary**: --- Removes stake from a hotkey on a subnet with a price limit. This extrinsic allows to specify the limit price for alpha token at which or better (higher) the staking should execute. In case if slippage occurs and the price shall move beyond the limit price, the staking order may execute only partially or not execute at all. # Args: _ 'origin': - - The signature of the caller's coldkey. _ 'hotkey' (T::AccountId): - The associated hotkey account. _ 'netuid' (u16): - Subnetwork UID _ 'amount*unstaked' (u64): - The amount of stake to be added to the hotkey staking account. * 'limit*price' (u64): - The limit price expressed in units of RAO per one Alpha. * 'allow*partial' (bool): - Allows partial execution of the amount. If set to false, this becomes fill or kill type or order. # Event: * StakeRemoved; - On the successfully removing stake from the hotkey account. # Raises: _ 'NotRegistered': - Thrown if the account we are attempting to unstake from is non existent. _ 'NonAssociatedColdKey': - Thrown if the coldkey does not own the hotkey we are unstaking from. \_ 'NotEnoughStakeToWithdraw': - Thrown if there is not enough stake on the hotkey to withdwraw this amount.

---

### resetColdkeySwap(coldkey: `0`)

- **interface**: `api.tx.subtensorModule.resetColdkeySwap`
- **summary**: Reset a coldkey swap by clearing the announcement and dispute status. The dispatch origin of this call must be root. - `coldkey`: The coldkey to reset the swap for.

---

### revealMechanismWeights(netuid: `40`, mecid: `2`, uids: `199`, values: `199`, salt: `199`, version_key: `6`)

- **interface**: `api.tx.subtensorModule.revealMechanismWeights`
- **summary**: ---- Used to reveal the weights for a previously committed hash for mechanisms. # Args: _ `origin`: (`- ::RuntimeOrigin`): - The signature of the revealing hotkey. _ `netuid` (`u16`): - The u16 network identifier. _ `mecid` (`u8`): - The u8 mechanism identifier. _ `uids` (`- `): - The uids for the weights being revealed. _ `values` (`- `): - The values of the weights being revealed. _ `salt` (`- `): - The salt used to generate the commit hash. _ `version_key` (`u64`): - The network version key. # Raises: _ `CommitRevealDisabled`: - Attempting to reveal weights when the commit-reveal mechanism is disabled. _ `NoWeightsCommitFound`: - Attempting to reveal weights without an existing commit. _ `ExpiredWeightCommit`: - Attempting to reveal a weight commit that has expired. _ `RevealTooEarly`: - Attempting to reveal weights outside the valid reveal period. _ `InvalidRevealCommitHashNotMatch`: - The revealed hash does not match any committed hash.

---

### revealWeights(netuid: `40`, uids: `199`, values: `199`, salt: `199`, version_key: `6`)

- **interface**: `api.tx.subtensorModule.revealWeights`
- **summary**: ---- Used to reveal the weights for a previously committed hash. # Args: _ `origin`: (`- ::RuntimeOrigin`): - The signature of the revealing hotkey. _ `netuid` (`u16`): - The u16 network identifier. _ `uids` (`- `): - The uids for the weights being revealed. _ `values` (`- `): - The values of the weights being revealed. _ `salt` (`- `): - The salt used to generate the commit hash. _ `version_key` (`u64`): - The network version key. # Raises: _ `CommitRevealDisabled`: - Attempting to reveal weights when the commit-reveal mechanism is disabled. _ `NoWeightsCommitFound`: - Attempting to reveal weights without an existing commit. _ `ExpiredWeightCommit`: - Attempting to reveal a weight commit that has expired. _ `RevealTooEarly`: - Attempting to reveal weights outside the valid reveal period. \* `InvalidRevealCommitHashNotMatch`: - The revealed hash does not match any committed hash.

---

### rootDissolveNetwork(netuid: `40`)

- **interface**: `api.tx.subtensorModule.rootDissolveNetwork`
- **summary**: Remove a subnetwork The caller must be root

---

### rootRegister(hotkey: `0`)

- **interface**: `api.tx.subtensorModule.rootRegister`
- **summary**: Register the hotkey to root network

---

### scheduleSwapColdkey(new_coldkey: `0`)

- **interface**: `api.tx.subtensorModule.scheduleSwapColdkey`
- **summary**: Schedules a coldkey swap operation to be executed at a future block. WARNING: This function is deprecated, please migrate to `announce_coldkey_swap`/`coldkey_swap`

---

### serveAxon(netuid: `40`, version: `4`, ip: `8`, port: `40`, ip_type: `2`, protocol: `2`, placeholder1: `2`, placeholder2: `2`)

- **interface**: `api.tx.subtensorModule.serveAxon`
- **summary**: Serves or updates axon /prometheus information for the neuron associated with the caller. If the caller is already registered the metadata is updated. If the caller is not registered this call throws NotRegistered. # Args: _ 'origin': - - The signature of the caller. _ 'netuid' (u16): - The u16 network identifier. _ 'version' (u64): - The bittensor version identifier. _ 'ip' (u64): - The endpoint ip information as a u128 encoded integer. _ 'port' (u16): - The endpoint port information as a u16 encoded integer. _ 'ip*type' (u8): - The endpoint ip version as a u8, 4 or 6. * 'protocol' (u8): - UDP:1 or TCP:0 _ 'placeholder1' (u8): - Placeholder for further extra params. _ 'placeholder2' (u8): - Placeholder for further extra params. # Event: _ AxonServed; - On successfully serving the axon info. # Raises: _ 'MechanismDoesNotExist': - Attempting to set weights on a non-existent network. _ 'NotRegistered': - Attempting to set weights from a non registered account. _ 'InvalidIpType': - The ip type is not 4 or 6. \_ 'InvalidIpAddress': - The numerically encoded ip address does not resolve to a proper ip. \* 'ServingRateLimitExceeded': - Attempting to set prometheus information withing the rate limit min.

---

### serveAxonTls(netuid: `40`, version: `4`, ip: `8`, port: `40`, ip_type: `2`, protocol: `2`, placeholder1: `2`, placeholder2: `2`, certificate: `14`)

- **interface**: `api.tx.subtensorModule.serveAxonTls`
- **summary**: Same as `serve_axon` but takes a certificate as an extra optional argument. Serves or updates axon /prometheus information for the neuron associated with the caller. If the caller is already registered the metadata is updated. If the caller is not registered this call throws NotRegistered. # Args: _ 'origin': - - The signature of the caller. _ 'netuid' (u16): - The u16 network identifier. _ 'version' (u64): - The bittensor version identifier. _ 'ip' (u64): - The endpoint ip information as a u128 encoded integer. _ 'port' (u16): - The endpoint port information as a u16 encoded integer. _ 'ip*type' (u8): - The endpoint ip version as a u8, 4 or 6. * 'protocol' (u8): - UDP:1 or TCP:0 _ 'placeholder1' (u8): - Placeholder for further extra params. _ 'placeholder2' (u8): - Placeholder for further extra params. _ 'certificate' (- ): - TLS certificate for inter neuron communitation. # Event: _ AxonServed; - On successfully serving the axon info. # Raises: _ 'MechanismDoesNotExist': - Attempting to set weights on a non-existent network. _ 'NotRegistered': - Attempting to set weights from a non registered account. _ 'InvalidIpType': - The ip type is not 4 or 6. _ 'InvalidIpAddress': - The numerically encoded ip address does not resolve to a proper ip. \_ 'ServingRateLimitExceeded': - Attempting to set prometheus information withing the rate limit min.

---

### servePrometheus(netuid: `40`, version: `4`, ip: `8`, port: `40`, ip_type: `2`)

- **interface**: `api.tx.subtensorModule.servePrometheus`
- **summary**: ---- Set prometheus information for the neuron. # Args: _ 'origin': - - The signature of the calling hotkey. _ 'netuid' (u16): - The u16 network identifier. _ 'version' (u16): - The bittensor version identifier. _ 'ip' (u128): - The prometheus ip information as a u128 encoded integer. _ 'port' (u16): - The prometheus port information as a u16 encoded integer. _ 'ip_type' (u8): - The ip type v4 or v6.

---

### setChildkeyTake(hotkey: `0`, netuid: `40`, take: `40`)

- **interface**: `api.tx.subtensorModule.setChildkeyTake`
- **summary**: Sets the childkey take for a given hotkey. This function allows a coldkey to set the childkey take for a given hotkey. The childkey take determines the proportion of stake that the hotkey keeps for itself when distributing stake to its children. # Arguments: _ `origin` (- ::RuntimeOrigin): - The signature of the calling coldkey. Setting childkey take can only be done by the coldkey. _ `hotkey` (T::AccountId): - The hotkey for which the childkey take will be set. _ `take` (u16): - The new childkey take value. This is a percentage represented as a value between 0 and 10000, where 10000 represents 100%. # Events: _ `ChildkeyTakeSet`: - On successfully setting the childkey take for a hotkey. # Errors: _ `NonAssociatedColdKey`: - The coldkey does not own the hotkey. _ `InvalidChildkeyTake`: - The provided take value is invalid (greater than the maximum allowed take). \* `TxChildkeyTakeRateLimitExceeded`: - The rate limit for changing childkey take has been exceeded.

---

### setChildren(hotkey: `0`, netuid: `40`, children: `44`)

- **interface**: `api.tx.subtensorModule.setChildren`
- **summary**: Set a single child for a given hotkey on a specified network. This function allows a coldkey to set a single child for a given hotkey on a specified network. The proportion of the hotkey's stake to be allocated to the child is also specified. # Arguments: _ `origin` (- ::RuntimeOrigin): - The signature of the calling coldkey. Setting a hotkey child can only be done by the coldkey. _ `hotkey` (T::AccountId): - The hotkey which will be assigned the child. _ `child` (T::AccountId): - The child which will be assigned to the hotkey. _ `netuid` (u16): - The u16 network identifier where the childkey will exist. _ `proportion` (u64): - Proportion of the hotkey's stake to be given to the child, the value must be u64 normalized. # Events: _ `ChildAddedSingular`: - On successfully registering a child to a hotkey. # Errors: _ `MechanismDoesNotExist`: - Attempting to register to a non-existent network. _ `RegistrationNotPermittedOnRootSubnet`: - Attempting to register a child on the root network. _ `NonAssociatedColdKey`: - The coldkey does not own the hotkey or the child is the same as the hotkey. _ `HotKeyAccountNotExists`: - The hotkey account does not exist. # Detailed Explanation of Checks: 1. **Signature Verification**: Ensures that the caller has signed the transaction, verifying the coldkey. 2. **Root Network Check**: Ensures that the delegation is not on the root network, as child hotkeys are not valid on the root. 3. **Network Existence Check**: Ensures that the specified network exists. 4. **Ownership Verification**: Ensures that the coldkey owns the hotkey. 5. **Hotkey Account Existence Check**: Ensures that the hotkey account already exists. 6. **Child-Hotkey Distinction**: Ensures that the child is not the same as the hotkey. 7. **Old Children Cleanup**: Removes the hotkey from the parent list of its old children. 8. **New Children Assignment**: Assigns the new child to the hotkey and updates the parent list for the new child.

---

### setColdkeyAutoStakeHotkey(netuid: `40`, hotkey: `0`)

- **interface**: `api.tx.subtensorModule.setColdkeyAutoStakeHotkey`
- **summary**: Set the autostake destination hotkey for a coldkey. The caller selects a hotkey where all future rewards will be automatically staked. # Args: _ `origin` - (- ::Origin): - The signature of the caller's coldkey. _ `hotkey` (T::AccountId): - The hotkey account to designate as the autostake destination.

---

### setIdentity(name: `14`, url: `14`, github_repo: `14`, image: `14`, discord: `14`, description: `14`, additional: `14`)

- **interface**: `api.tx.subtensorModule.setIdentity`
- **summary**: ---- Set prometheus information for the neuron. # Args: _ 'origin': - - The signature of the calling hotkey. _ 'netuid' (u16): - The u16 network identifier. _ 'version' (u16): - The bittensor version identifier. _ 'ip' (u128): - The prometheus ip information as a u128 encoded integer. _ 'port' (u16): - The prometheus port information as a u16 encoded integer. _ 'ip_type' (u8): - The ip type v4 or v6.

---

### setMechanismWeights(netuid: `40`, mecid: `2`, dests: `199`, weights: `199`, version_key: `6`)

- **interface**: `api.tx.subtensorModule.setMechanismWeights`
- **summary**: --- Sets the caller weights for the incentive mechanism for mechanisms. The call can be made from the hotkey account so is potentially insecure, however, the damage of changing weights is minimal if caught early. This function includes all the checks that the passed weights meet the requirements. Stored as u16s they represent rational values in the range [0,1] which sum to 1 and can be interpreted as probabilities. The specific weights determine how inflation propagates outward from this peer. Note: The 16 bit integers weights should represent 1.0 as the max u16. However, the function normalizes all integers to u16*max anyway. This means that if the sum of all elements is larger or smaller than the amount of elements * u16*max, all elements will be corrected for this deviation. # Args: * `origin`: - - The caller, a hotkey who wishes to set their weights. _ `netuid` (u16): - The network uid we are setting these weights on. _ `mecid` (`u8`): - The u8 mechnism identifier. _ `dests` (- ): - The edge endpoint for the weight, i.e. j for w_ij. _ 'weights' (- ): - The u16 integer encoded weights. Interpreted as rational values in the range [0,1]. They must sum to in32::MAX. _ 'version_key' ( u64 ): - The network version key to check if the validator is up to date. # Event: _ WeightsSet; - On successfully setting the weights on chain. # Raises: _ 'MechanismDoesNotExist': - Attempting to set weights on a non-existent network. _ 'NotRegistered': - Attempting to set weights from a non registered account. _ 'WeightVecNotEqualSize': - Attempting to set weights with uids not of same length. _ 'DuplicateUids': - Attempting to set weights with duplicate uids. _ 'UidsLengthExceedUidsInSubNet': - Attempting to set weights above the max allowed uids. _ 'UidVecContainInvalidOne': - Attempting to set weights with invalid uids. _ 'WeightVecLengthIsLow': - Attempting to set weights with fewer weights than min. _ 'MaxWeightExceeded': - Attempting to set weights with max value exceeding limit.

---

### setPendingChildkeyCooldown(cooldown: `6`)

- **interface**: `api.tx.subtensorModule.setPendingChildkeyCooldown`
- **summary**: Sets the pending childkey cooldown (in blocks). Root only.

---

### setRootClaimType(new_root_claim_type: `53`)

- **interface**: `api.tx.subtensorModule.setRootClaimType`
- **summary**: --- Sets the root claim type for the coldkey. # Args: _ 'origin': - - The signature of the caller's coldkey. # Event: _ RootClaimTypeSet; - On the successfully setting the root claim type for the coldkey.

---

### setSubnetIdentity(netuid: `40`, subnet_name: `14`, github_repo: `14`, subnet_contact: `14`, subnet_url: `14`, discord: `14`, description: `14`, logo_url: `14`, additional: `14`)

- **interface**: `api.tx.subtensorModule.setSubnetIdentity`
- **summary**: ---- Set the identity information for a subnet. # Args: _ `origin` - (- ::Origin): - The signature of the calling coldkey, which must be the owner of the subnet. _ `netuid` (u16): - The unique network identifier of the subnet. _ `subnet_name` (- ): - The name of the subnet. _ `github_repo` (- ): - The GitHub repository associated with the subnet identity. \* `subnet_contact` (- ): - The contact information for the subnet.

---

### setWeights(netuid: `40`, dests: `199`, weights: `199`, version_key: `6`)

- **interface**: `api.tx.subtensorModule.setWeights`
- **summary**: --- Sets the caller weights for the incentive mechanism. The call can be made from the hotkey account so is potentially insecure, however, the damage of changing weights is minimal if caught early. This function includes all the checks that the passed weights meet the requirements. Stored as u16s they represent rational values in the range [0,1] which sum to 1 and can be interpreted as probabilities. The specific weights determine how inflation propagates outward from this peer. Note: The 16 bit integers weights should represent 1.0 as the max u16. However, the function normalizes all integers to u16*max anyway. This means that if the sum of all elements is larger or smaller than the amount of elements * u16*max, all elements will be corrected for this deviation. # Args: * `origin`: - - The caller, a hotkey who wishes to set their weights. _ `netuid` (u16): - The network uid we are setting these weights on. _ `dests` (- ): - The edge endpoint for the weight, i.e. j for w*ij. * 'weights' (- ): - The u16 integer encoded weights. Interpreted as rational values in the range [0,1]. They must sum to in32::MAX. _ 'version_key' ( u64 ): - The network version key to check if the validator is up to date. # Event: _ WeightsSet; - On successfully setting the weights on chain. # Raises: _ 'MechanismDoesNotExist': - Attempting to set weights on a non-existent network. _ 'NotRegistered': - Attempting to set weights from a non registered account. _ 'WeightVecNotEqualSize': - Attempting to set weights with uids not of same length. _ 'DuplicateUids': - Attempting to set weights with duplicate uids. _ 'UidsLengthExceedUidsInSubNet': - Attempting to set weights above the max allowed uids. _ 'UidVecContainInvalidOne': - Attempting to set weights with invalid uids. \_ 'WeightVecLengthIsLow': - Attempting to set weights with fewer weights than min. \* 'MaxWeightExceeded': - Attempting to set weights with max value exceeding limit.

---

### startCall(netuid: `40`)

- **interface**: `api.tx.subtensorModule.startCall`
- **summary**: Initiates a call on a subnet. # Arguments _ `origin` - The origin of the call, which must be signed by the subnet owner. _ `netuid` - The unique identifier of the subnet on which the call is being initiated. # Events Emits a `FirstEmissionBlockNumberSet` event on success.

---

### sudoSetMaxChildkeyTake(take: `40`)

- **interface**: `api.tx.subtensorModule.sudoSetMaxChildkeyTake`
- **summary**: Sets the maximum allowed childkey take. This function can only be called by the root origin. # Arguments: _ `origin` - The origin of the call, must be root. _ `take` - The new maximum childkey take value. # Errors: \* `BadOrigin` - If the origin is not root.

---

### sudoSetMinChildkeyTake(take: `40`)

- **interface**: `api.tx.subtensorModule.sudoSetMinChildkeyTake`
- **summary**: Sets the minimum allowed childkey take. This function can only be called by the root origin. # Arguments: _ `origin` - The origin of the call, must be root. _ `take` - The new minimum childkey take value. # Errors: \* `BadOrigin` - If the origin is not root.

---

### sudoSetNumRootClaims(new_value: `6`)

- **interface**: `api.tx.subtensorModule.sudoSetNumRootClaims`
- **summary**: --- Sets root claim number (sudo extrinsic). Zero disables auto-claim.

---

### sudoSetRootClaimThreshold(netuid: `40`, new_value: `6`)

- **interface**: `api.tx.subtensorModule.sudoSetRootClaimThreshold`
- **summary**: --- Sets root claim threshold for subnet (sudo or owner origin).

---

### sudoSetTxChildkeyTakeRateLimit(tx_rate_limit: `6`)

- **interface**: `api.tx.subtensorModule.sudoSetTxChildkeyTakeRateLimit`
- **summary**: Sets the transaction rate limit for changing childkey take. This function can only be called by the root origin. # Arguments: _ `origin` - The origin of the call, must be root. _ `tx_rate_limit` - The new rate limit in blocks. # Errors: \* `BadOrigin` - If the origin is not root.

---

### sudoSetVotingPowerEmaAlpha(netuid: `40`, alpha: `6`)

- **interface**: `api.tx.subtensorModule.sudoSetVotingPowerEmaAlpha`
- **summary**: Sets the EMA alpha value for voting power calculation on a subnet. This function can only be called by root (sudo). Higher alpha = faster response to stake changes. Alpha is stored as u64 with 18 decimal precision (1.0 = 10^18). # Arguments: _ `origin` - The origin of the call, must be root. _ `netuid` - The subnet to set the alpha for. _ `alpha` - The new alpha value (u64 with 18 decimal precision). # Errors: _ `BadOrigin` - If the origin is not root. _ `SubnetNotExist` - If the subnet does not exist. _ `InvalidVotingPowerEmaAlpha` - If alpha is greater than 10^18 (1.0).

---

### swapColdkey(old_coldkey: `0`, new_coldkey: `0`, swap_cost: `6`)

- **interface**: `api.tx.subtensorModule.swapColdkey`
- **summary**: Performs an arbitrary coldkey swap for any coldkey. Only callable by root as it doesn't require an announcement and can be used to swap any coldkey.

---

### swapColdkeyAnnounced(new_coldkey: `0`)

- **interface**: `api.tx.subtensorModule.swapColdkeyAnnounced`
- **summary**: Performs a coldkey swap if an announcement has been made. The dispatch origin of this call must be the original coldkey that made the announcement. - `new_coldkey`: The new coldkey to swap to. The BlakeTwo256 hash of the new coldkey must be the same as the announced coldkey hash. The `ColdkeySwapped` event is emitted on successful swap.

---

### swapHotkey(hotkey: `0`, new_hotkey: `0`, netuid: `238`)

- **interface**: `api.tx.subtensorModule.swapHotkey`
- **summary**: ---- The extrinsic for user to change its hotkey in subnet or all subnets. # Arguments _ `origin` - The origin of the transaction (must be signed by the coldkey). _ `hotkey` - The old hotkey to be swapped. _ `new_hotkey` - The new hotkey to replace the old one. _ `netuid` - Optional subnet ID. If `Some`, swap only on that subnet; if `None`, swap on all subnets. is transferred to the new hotkey.

---

### swapHotkeyV2(hotkey: `0`, new_hotkey: `0`, netuid: `238`, keep_stake: `9`)

- **interface**: `api.tx.subtensorModule.swapHotkeyV2`
- **summary**: ---- The extrinsic for user to change its hotkey in subnet or all subnets. This extrinsic is similar to swap*hotkey, but with keep_stake parameter bo be able to keep the stake when swapping a root key to a child key # Arguments * `origin` - The origin of the transaction (must be signed by the coldkey). _ `hotkey` - The old hotkey to be swapped. _ `new_hotkey` - The new hotkey to replace the old one. \_ `netuid` - Optional subnet ID. If `Some`, swap only on that subnet; if `None`, swap on all subnets. \* `keep_stake` - If `true`, stake remains on the old hotkey and the rest metadata is transferred to the new hotkey.

---

### swapStake(hotkey: `0`, origin_netuid: `40`, destination_netuid: `40`, alpha_amount: `6`)

- **interface**: `api.tx.subtensorModule.swapStake`
- **summary**: Swaps a specified amount of stake from one subnet to another, while keeping the same coldkey and hotkey. # Arguments _ `origin` - The origin of the transaction, which must be signed by the coldkey that owns the `hotkey`. _ `hotkey` - The hotkey whose stake is being swapped. _ `origin_netuid` - The network/subnet ID from which stake is removed. _ `destination_netuid` - The network/subnet ID to which stake is added. _ `alpha_amount` - The amount of stake to swap. # Errors Returns an error if: _ The transaction is not signed by the correct coldkey (i.e., `coldkey_owns_hotkey` fails). _ Either `origin_netuid` or `destination_netuid` does not exist. _ The hotkey does not exist. _ There is insufficient stake on `(coldkey, hotkey, origin_netuid)`. _ The swap amount is below the minimum stake requirement. # Events May emit a `StakeSwapped` event on success.

---

### swapStakeLimit(hotkey: `0`, origin_netuid: `40`, destination_netuid: `40`, alpha_amount: `6`, limit_price: `6`, allow_partial: `9`)

- **interface**: `api.tx.subtensorModule.swapStakeLimit`
- **summary**: Swaps a specified amount of stake from one subnet to another, while keeping the same coldkey and hotkey. # Arguments _ `origin` - The origin of the transaction, which must be signed by the coldkey that owns the `hotkey`. _ `hotkey` - The hotkey whose stake is being swapped. _ `origin_netuid` - The network/subnet ID from which stake is removed. _ `destination_netuid` - The network/subnet ID to which stake is added. _ `alpha_amount` - The amount of stake to swap. _ `limit_price` - The limit price expressed in units of RAO per one Alpha. _ `allow_partial` - Allows partial execution of the amount. If set to false, this becomes fill or kill type or order. # Errors Returns an error if: _ The transaction is not signed by the correct coldkey (i.e., `coldkey_owns_hotkey` fails). _ Either `origin_netuid` or `destination_netuid` does not exist. _ The hotkey does not exist. _ There is insufficient stake on `(coldkey, hotkey, origin_netuid)`. _ The swap amount is below the minimum stake requirement. # Events May emit a `StakeSwapped` event on success.

---

### terminateLease(lease_id: `4`, hotkey: `0`)

- **interface**: `api.tx.subtensorModule.terminateLease`
- **summary**: Terminate a lease. The beneficiary can terminate the lease after the end block has passed and get the subnet ownership. The subnet is transferred to the beneficiary and the lease is removed from storage. **The hotkey must be owned by the beneficiary coldkey.** # Args: _ `origin` - (- ::Origin): - The signature of the caller's coldkey. _ `lease_id` (LeaseId): - The ID of the lease to terminate. \* `hotkey` (T::AccountId): - The hotkey of the beneficiary to mark as subnet owner hotkey.

---

### transferStake(destination_coldkey: `0`, hotkey: `0`, origin_netuid: `40`, destination_netuid: `40`, alpha_amount: `6`)

- **interface**: `api.tx.subtensorModule.transferStake`
- **summary**: Transfers a specified amount of stake from one coldkey to another, optionally across subnets, while keeping the same hotkey. # Arguments _ `origin` - The origin of the transaction, which must be signed by the `origin_coldkey`. _ `destination_coldkey` - The coldkey to which the stake is transferred. _ `hotkey` - The hotkey associated with the stake. _ `origin_netuid` - The network/subnet ID to move stake from. _ `destination_netuid` - The network/subnet ID to move stake to (for cross-subnet transfer). _ `alpha_amount` - The amount of stake to transfer. # Errors Returns an error if: _ The origin is not signed by the correct coldkey. _ Either subnet does not exist. _ The hotkey does not exist. _ There is insufficient stake on `(origin_coldkey, hotkey, origin_netuid)`. \* The transfer amount is below the minimum stake requirement. # Events May emit a `StakeTransferred` event on success.

---

### tryAssociateHotkey(hotkey: `0`)

- **interface**: `api.tx.subtensorModule.tryAssociateHotkey`
- **summary**: Attempts to associate a hotkey with a coldkey. # Arguments _ `origin` - The origin of the transaction, which must be signed by the coldkey that owns the `hotkey`. _ `hotkey` - The hotkey to associate with the coldkey. # Note Will charge based on the weight even if the hotkey is already associated with a coldkey.

---

### unstakeAll(hotkey: `0`)

- **interface**: `api.tx.subtensorModule.unstakeAll`
- **summary**: ---- The implementation for the extrinsic unstake*all: Removes all stake from a hotkey account across all subnets and adds it onto a coldkey. # Args: * `origin` - (- ::Origin): - The signature of the caller's coldkey. _ `hotkey` (T::AccountId): - The associated hotkey account. # Event: _ StakeRemoved; - On the successfully removing stake from the hotkey account. # Raises: _ `NotRegistered`: - Thrown if the account we are attempting to unstake from is non existent. _ `NonAssociatedColdKey`: - Thrown if the coldkey does not own the hotkey we are unstaking from. \_ `NotEnoughStakeToWithdraw`: - Thrown if there is not enough stake on the hotkey to withdraw this amount. \* `TxRateLimitExceeded`: - Thrown if key has hit transaction rate limit

---

### unstakeAllAlpha(hotkey: `0`)

- **interface**: `api.tx.subtensorModule.unstakeAllAlpha`
- **summary**: ---- The implementation for the extrinsic unstake*all: Removes all stake from a hotkey account across all subnets and adds it onto a coldkey. # Args: * `origin` - (- ::Origin): - The signature of the caller's coldkey. _ `hotkey` (T::AccountId): - The associated hotkey account. # Event: _ StakeRemoved; - On the successfully removing stake from the hotkey account. # Raises: _ `NotRegistered`: - Thrown if the account we are attempting to unstake from is non existent. _ `NonAssociatedColdKey`: - Thrown if the coldkey does not own the hotkey we are unstaking from. \_ `NotEnoughStakeToWithdraw`: - Thrown if there is not enough stake on the hotkey to withdraw this amount. \* `TxRateLimitExceeded`: - Thrown if key has hit transaction rate limit

---

### updateSymbol(netuid: `40`, symbol: `14`)

- **interface**: `api.tx.subtensorModule.updateSymbol`
- **summary**: Updates the symbol for a subnet. # Arguments _ `origin` - The origin of the call, which must be the subnet owner or root. _ `netuid` - The unique identifier of the subnet on which the symbol is being set. _ `symbol` - The symbol to set for the subnet. # Errors Returns an error if: _ The transaction is not signed by the subnet owner. _ The symbol does not exist. _ The symbol is already in use by another subnet. # Events Emits a `SymbolUpdated` event on success.

---

## sudo

### removeKey()

- **interface**: `api.tx.sudo.removeKey`
- **summary**: Permanently removes the sudo key. **This cannot be un-done.**

---

### setKey(new: `165`)

- **interface**: `api.tx.sudo.setKey`
- **summary**: Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo key.

---

### sudo(call: `245`)

- **interface**: `api.tx.sudo.sudo`
- **summary**: Authenticates the sudo key and dispatches a function call with `Root` origin.

---

### sudoAs(who: `165`, call: `245`)

- **interface**: `api.tx.sudo.sudoAs`
- **summary**: Authenticates the sudo key and dispatches a function call with `Signed` origin from a given account. The dispatch origin for this call must be _Signed_.

---

### sudoUncheckedWeight(call: `245`, weight: `11`)

- **interface**: `api.tx.sudo.sudoUncheckedWeight`
- **summary**: Authenticates the sudo key and dispatches a function call with `Root` origin. This function does not check the weight of the call, and instead allows the Sudo user to specify the weight of the call. The dispatch origin for this call must be _Signed_.

---

## swap

### addLiquidity(hotkey: `0`, netuid: `40`, tick_low: `94`, tick_high: `94`, liquidity: `6`)

- **interface**: `api.tx.swap.addLiquidity`
- **summary**: Add liquidity to a specific price range for a subnet. Parameters: - origin: The origin of the transaction - netuid: Subnet ID - tick_low: Lower bound of the price range - tick_high: Upper bound of the price range - liquidity: Amount of liquidity to add Emits `Event::LiquidityAdded` on success

---

### disableLp()

- **interface**: `api.tx.swap.disableLp`
- **summary**: Disable user liquidity in all subnets. Emits `Event::UserLiquidityToggled` on success

---

### modifyPosition(hotkey: `0`, netuid: `40`, position_id: `93`, liquidity_delta: `96`)

- **interface**: `api.tx.swap.modifyPosition`
- **summary**: Modify a liquidity position. Parameters: - origin: The origin of the transaction - netuid: Subnet ID - position_id: ID of the position to remove - liquidity_delta: Liquidity to add (if positive) or remove (if negative) Emits `Event::LiquidityRemoved` on success

---

### removeLiquidity(hotkey: `0`, netuid: `40`, position_id: `93`)

- **interface**: `api.tx.swap.removeLiquidity`
- **summary**: Remove liquidity from a specific position. Parameters: - origin: The origin of the transaction - netuid: Subnet ID - position_id: ID of the position to remove Emits `Event::LiquidityRemoved` on success

---

### setFeeRate(netuid: `40`, rate: `40`)

- **interface**: `api.tx.swap.setFeeRate`
- **summary**: Set the fee rate for swaps on a specific subnet (normalized value). For example, 0.3% is approximately 196. Only callable by the admin origin

---

### toggleUserLiquidity(netuid: `40`, enable: `9`)

- **interface**: `api.tx.swap.toggleUserLiquidity`
- **summary**: Enable user liquidity operations for a specific subnet. This switches the subnet from V2 to V3 swap mode. Thereafter, adding new user liquidity can be disabled by toggling this flag to false, but the swap mode will remain V3 because of existing user liquidity until all users withdraw their liquidity. Only sudo or subnet owner can enable user liquidity. Only sudo can disable user liquidity.

---

## system

### applyAuthorizedUpgrade(code: `14`)

- **interface**: `api.tx.system.applyAuthorizedUpgrade`
- **summary**: Provide the preimage (runtime binary) `code` for an upgrade that has been authorized. If the authorization required a version check, this call will ensure the spec name remains unchanged and that the spec version has increased. Depending on the runtime's `OnSetCode` configuration, this function may directly apply the new `code` in the same block or attempt to schedule the upgrade. All origins are allowed.

---

### authorizeUpgrade(code_hash: `13`)

- **interface**: `api.tx.system.authorizeUpgrade`
- **summary**: Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied later. This call requires Root origin.

---

### authorizeUpgradeWithoutChecks(code_hash: `13`)

- **interface**: `api.tx.system.authorizeUpgradeWithoutChecks`
- **summary**: Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied later. WARNING: This authorizes an upgrade that will take place without any safety checks, for example that the spec name remains the same and that the version number increases. Not recommended for normal use. Use `authorize_upgrade` instead. This call requires Root origin.

---

### killPrefix(prefix: `14`, subkeys: `4`)

- **interface**: `api.tx.system.killPrefix`
- **summary**: Kill all storage items with a key that starts with the given prefix. **NOTE:** We rely on the Root origin to provide us the number of subkeys under the prefix we are removing to accurately calculate the weight of this function.

---

### killStorage(keys: `109`)

- **interface**: `api.tx.system.killStorage`
- **summary**: Kill some items from storage.

---

### remark(remark: `14`)

- **interface**: `api.tx.system.remark`
- **summary**: Make some on-chain remark. Can be executed by every `origin`.

---

### remarkWithEvent(remark: `14`)

- **interface**: `api.tx.system.remarkWithEvent`
- **summary**: Make some on-chain remark and emit event.

---

### setCode(code: `14`)

- **interface**: `api.tx.system.setCode`
- **summary**: Set the new runtime code.

---

### setCodeWithoutChecks(code: `14`)

- **interface**: `api.tx.system.setCodeWithoutChecks`
- **summary**: Set the new runtime code without doing any checks of the given `code`. Note that runtime upgrades will not run if this is called with a not-increasing spec version!

---

### setHeapPages(pages: `6`)

- **interface**: `api.tx.system.setHeapPages`
- **summary**: Set the number of pages in the WebAssembly environment's heap.

---

### setStorage(items: `107`)

- **interface**: `api.tx.system.setStorage`
- **summary**: Set some items of storage.

---

## timestamp

### set(now: `12`)

- **interface**: `api.tx.timestamp.set`
- **summary**: Set the current time. This call should be invoked exactly once per block. It will panic at the finalization phase, if this call hasn't been invoked by that time. The timestamp should be greater than the previous one by the amount specified by [`Config::MinimumPeriod`]. The dispatch origin for this call must be _None_. This dispatch class is _Mandatory_ to ensure it gets executed in the block. Be aware that changing the complexity of this call could result exhausting the resources in a block to execute any other calls. ## Complexity - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`) - 1 storage read and 1 storage mutation (codec `O(1)` because of `DidUpdate::take` in `on_finalize`) - 1 event handler `on_timestamp_set`. Must be `O(1)`.

---

## utility

### asDerivative(index: `40`, call: `245`)

- **interface**: `api.tx.utility.asDerivative`
- **summary**: Send a call through an indexed pseudonym of the sender. Filter from origin are passed along. The call will be dispatched with an origin which use the same filter as the origin of this call. NOTE: If you need to ensure that any account-based filtering is not honored (i.e. because you expect `proxy` to have been used prior in the call stack and you do not want the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1` in the Multisig pallet instead. NOTE: Prior to version \*12, this was called `as_limited_sub`. The dispatch origin for this call must be _Signed_.

---

### batch(calls: `244`)

- **interface**: `api.tx.utility.batch`
- **summary**: Send a batch of dispatch calls. May be called from any origin except `None`. - `calls`: The calls to be dispatched from the same origin. The number of call must not exceed the constant: `batched_calls_limit` (available in constant metadata). If origin is root then the calls are dispatched without checking origin filter. (This includes bypassing `frame_system::Config::BaseCallFilter`). ## Complexity - O(C) where C is the number of calls to be batched. This will return `Ok` in all circumstances. To determine the success of the batch, an event is deposited. If a call failed and the batch was interrupted, then the `BatchInterrupted` event is deposited, along with the number of successful calls made and the error of the failed call. If all were successful, then the `BatchCompleted` event is deposited.

---

### batchAll(calls: `244`)

- **interface**: `api.tx.utility.batchAll`
- **summary**: Send a batch of dispatch calls and atomically execute them. The whole transaction will rollback and fail if any of the calls failed. May be called from any origin except `None`. - `calls`: The calls to be dispatched from the same origin. The number of call must not exceed the constant: `batched_calls_limit` (available in constant metadata). If origin is root then the calls are dispatched without checking origin filter. (This includes bypassing `frame_system::Config::BaseCallFilter`). ## Complexity - O(C) where C is the number of calls to be batched.

---

### dispatchAs(as_origin: `438`, call: `245`)

- **interface**: `api.tx.utility.dispatchAs`
- **summary**: Dispatches a function call with a provided origin. The dispatch origin for this call must be _Root_. ## Complexity - O(1).

---

### dispatchAsFallible(as_origin: `438`, call: `245`)

- **interface**: `api.tx.utility.dispatchAsFallible`
- **summary**: Dispatches a function call with a provided origin. Almost the same as [`Pallet::dispatch_as`] but forwards any error of the inner call. The dispatch origin for this call must be _Root_.

---

### forceBatch(calls: `244`)

- **interface**: `api.tx.utility.forceBatch`
- **summary**: Send a batch of dispatch calls. Unlike `batch`, it allows errors and won't interrupt. May be called from any origin except `None`. - `calls`: The calls to be dispatched from the same origin. The number of call must not exceed the constant: `batched_calls_limit` (available in constant metadata). If origin is root then the calls are dispatch without checking origin filter. (This includes bypassing `frame_system::Config::BaseCallFilter`). ## Complexity - O(C) where C is the number of calls to be batched.

---

### ifElse(main: `245`, fallback: `245`)

- **interface**: `api.tx.utility.ifElse`
- **summary**: Dispatch a fallback call in the event the main call fails to execute. May be called from any origin except `None`. This function first attempts to dispatch the `main` call. If the `main` call fails, the `fallback` is attemted. if the fallback is successfully dispatched, the weights of both calls are accumulated and an event containing the main call error is deposited. In the event of a fallback failure the whole call fails with the weights returned. - `main`: The main call to be dispatched. This is the primary action to execute. - `fallback`: The fallback call to be dispatched in case the `main` call fails. ## Dispatch Logic - If the origin is `root`, both the main and fallback calls are executed without applying any origin filters. - If the origin is not `root`, the origin filter is applied to both the `main` and `fallback` calls. ## Use Case - Some use cases might involve submitting a `batch` type call in either main, fallback or both.

---

### withWeight(call: `245`, weight: `11`)

- **interface**: `api.tx.utility.withWeight`
- **summary**: Dispatch a function call with a specified weight. This function does not check the weight of the call, and instead allows the Root origin to specify the weight of the call. The dispatch origin for this call must be _Root_.

---
