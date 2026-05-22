bittensor.core.extrinsics.pallets.admin_utils
=============================================

.. py:module:: bittensor.core.extrinsics.pallets.admin_utils

.. autoapi-nested-parse::

   WARNING: This module contains administrative utilities that should ONLY be used for local development and testing
   purposes. These functions provide direct access to critical network parameters and should never be used in production
   environments as they can potentially disrupt network stability.

   The AdminUtils module contains powerful administrative functions that can modify core network parameters. Improper use
   of these functions outside of development/testing contexts could have severe consequences for network operation.



Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.admin_utils.AdminUtils


Module Contents
---------------

.. py:class:: AdminUtils

   Bases: :py:obj:`bittensor.core.extrinsics.pallets.base.CallBuilder`


   Factory class for creating GenericCall objects for AdminUtils pallet functions.

   This class provides methods to create GenericCall instances for all AdminUtils pallet extrinsics.

   Works with both sync (Subtensor) and async (AsyncSubtensor) instances. For async operations, pass an AsyncSubtensor
   instance and await the result.

   .. admonition:: Example

      # Sync usage
      call = AdminUtils(subtensor).sudo_set_default_take(default_take=100)
      response = subtensor.sign_and_send_extrinsic(call=call, ...)
      
      # Async usage
      call = await AdminUtils(async_subtensor).sudo_set_default_take(default_take=100)
      response = await async_subtensor.sign_and_send_extrinsic(call=call, ...)


   .. py:method:: schedule_grandpa_change(next_authorities, in_blocks, forced = None)

      Returns GenericCall instance for AdminUtils function schedule_grandpa_change.

      A public interface for `pallet_grandpa::Pallet::schedule_grandpa_change`.

      Schedule a change in the authorities.

      The change will be applied at the end of execution of the block `in_blocks` after the
      current block. This value may be 0, in which case the change is applied at the end of
      the current block.

      If the `forced` parameter is defined, this indicates that the current set has been
      synchronously determined to be offline and that after `in_blocks` the given change
      should be applied. The given block number indicates the median last finalized block
      number and it should be used as the canon block when starting the new grandpa voter.

      No change should be signaled while any change is pending. Returns an error if a change
      is already pending.

      :param next_authorities: The list of next authorities (AuthorityList).
      :param in_blocks: The number of blocks after which the change is applied.
      :param forced: Optional block number for forced change.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_activity_cutoff(netuid, activity_cutoff)

      Returns GenericCall instance for AdminUtils function sudo_set_activity_cutoff.

      The extrinsic sets the activity cutoff for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the activity cutoff.

      :param netuid: The network identifier.
      :param activity_cutoff: The activity cutoff value (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_adjustment_alpha(netuid, adjustment_alpha)

      Returns GenericCall instance for AdminUtils function sudo_set_adjustment_alpha.

      The extrinsic sets the adjustment alpha for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the adjustment alpha.

      :param netuid: The network identifier.
      :param adjustment_alpha: The adjustment alpha value (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_adjustment_interval(netuid, adjustment_interval)

      Returns GenericCall instance for AdminUtils function sudo_set_adjustment_interval.

      The extrinsic sets the adjustment interval for a subnet.
      It is only callable by the root account, not changeable by the subnet owner.
      The extrinsic will call the Subtensor pallet to set the adjustment interval.

      :param netuid: The network identifier.
      :param adjustment_interval: The adjustment interval (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_admin_freeze_window(window)

      Returns GenericCall instance for AdminUtils function sudo_set_admin_freeze_window.

      Sets the admin freeze window length (in blocks) at the end of a tempo.
      Only callable by root.

      :param window: The admin freeze window length in blocks (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_alpha_sigmoid_steepness(netuid, steepness)

      Returns GenericCall instance for AdminUtils function sudo_set_alpha_sigmoid_steepness.

      Sets the Steepness for the alpha sigmoid function.

      :param netuid: The unique identifier for the subnet.
      :param steepness: The Steepness for the alpha sigmoid function. (range is 0-int16::MAX,
                        negative values are reserved for future use).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_alpha_values(netuid, alpha_low, alpha_high)

      Returns GenericCall instance for AdminUtils function sudo_set_alpha_values.

      Sets values for liquid alpha.

      :param netuid: The network identifier.
      :param alpha_low: The low alpha value (u16).
      :param alpha_high: The high alpha value (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_bonds_moving_average(netuid, bonds_moving_average)

      Returns GenericCall instance for AdminUtils function sudo_set_bonds_moving_average.

      The extrinsic sets the bonds moving average for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the bonds moving average.

      :param netuid: The network identifier.
      :param bonds_moving_average: The bonds moving average value (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_bonds_penalty(netuid, bonds_penalty)

      Returns GenericCall instance for AdminUtils function sudo_set_bonds_penalty.

      The extrinsic sets the bonds penalty for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the bonds penalty.

      :param netuid: The network identifier.
      :param bonds_penalty: The bonds penalty value (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_bonds_reset_enabled(netuid, enabled)

      Returns GenericCall instance for AdminUtils function sudo_set_bonds_reset_enabled.

      Enables or disables Bonds Reset for a given subnet.

      :param netuid: The unique identifier for the subnet.
      :param enabled: A boolean flag to enable or disable Bonds Reset.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_ck_burn(burn)

      Returns GenericCall instance for AdminUtils function sudo_set_ck_burn.

      Sets the childkey burn for a subnet.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the childkey burn.

      :param burn: The childkey burn value (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_coldkey_swap_schedule_duration(duration)

      Returns GenericCall instance for AdminUtils function sudo_set_coldkey_swap_schedule_duration.

      Sets the duration of the coldkey swap schedule.

      This extrinsic allows the root account to set the duration for the coldkey swap schedule.
      The coldkey swap schedule determines how long it takes for a coldkey swap operation to complete.

      :param duration: The new duration for the coldkey swap schedule, in number of blocks.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_commit_reveal_version(version)

      Returns GenericCall instance for AdminUtils function sudo_set_commit_reveal_version.

      Sets the commit-reveal weights version for all subnets.

      :param version: The commit-reveal weights version (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_commit_reveal_weights_enabled(netuid, enabled)

      Returns GenericCall instance for AdminUtils function sudo_set_commit_reveal_weights_enabled.

      The extrinsic enabled/disables commit/reaveal for a given subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the value.

      :param netuid: The network identifier.
      :param enabled: Whether commit/reveal weights is enabled (bool).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_commit_reveal_weights_interval(netuid, interval)

      Returns GenericCall instance for AdminUtils function sudo_set_commit_reveal_weights_interval.

      Sets the commit-reveal weights periods for a specific subnet.

      This extrinsic allows the subnet owner or root account to set the duration (in epochs) during which committed weights must be revealed.
      The commit-reveal mechanism ensures that users commit weights in advance and reveal them only within a specified period.

      :param netuid: The unique identifier of the subnet for which the periods are being set.
      :param interval: The number of epochs that define the commit-reveal period.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_default_take(default_take)

      Returns GenericCall instance for AdminUtils function sudo_set_default_take.

      The extrinsic sets the default take for the network.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the default take.

      :param default_take: The default take value (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_difficulty(netuid, difficulty)

      Returns GenericCall instance for AdminUtils function sudo_set_difficulty.

      The extrinsic sets the difficulty for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the difficulty.

      :param netuid: The network identifier.
      :param difficulty: The difficulty value (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_dissolve_network_schedule_duration(duration)

      Returns GenericCall instance for AdminUtils function sudo_set_dissolve_network_schedule_duration.

      Sets the duration of the dissolve network schedule.

      This extrinsic allows the root account to set the duration for the dissolve network schedule.
      The dissolve network schedule determines how long it takes for a network dissolution operation to complete.

      :param duration: The new duration for the dissolve network schedule, in number of blocks.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_ema_price_halving_period(netuid, ema_halving)

      Returns GenericCall instance for AdminUtils function sudo_set_ema_price_halving_period.

      Sets the number of blocks for EMA price to halve.

      :param netuid: The unique identifier for the subnet.
      :param ema_halving: Number of blocks for EMA price to halve.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_evm_chain_id(chain_id)

      Returns GenericCall instance for AdminUtils function sudo_set_evm_chain_id.

      Sets the EVM ChainID.

      :param chain_id: The u64 chain ID.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_immunity_period(netuid, immunity_period)

      Returns GenericCall instance for AdminUtils function sudo_set_immunity_period.

      The extrinsic sets the immunity period for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the immunity period.

      :param netuid: The network identifier.
      :param immunity_period: The immunity period (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_kappa(netuid, kappa)

      Returns GenericCall instance for AdminUtils function sudo_set_kappa.

      The extrinsic sets the kappa for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the kappa.

      :param netuid: The network identifier.
      :param kappa: The kappa value (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_liquid_alpha_enabled(netuid, enabled)

      Returns GenericCall instance for AdminUtils function sudo_set_liquid_alpha_enabled.

      Enables or disables Liquid Alpha for a given subnet.

      :param netuid: The unique identifier for the subnet.
      :param enabled: A boolean flag to enable or disable Liquid Alpha.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_lock_reduction_interval(interval)

      Returns GenericCall instance for AdminUtils function sudo_set_lock_reduction_interval.

      The extrinsic sets the lock reduction interval for the network.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the lock reduction interval.

      :param interval: The lock reduction interval (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_max_allowed_uids(netuid, max_allowed_uids)

      Returns GenericCall instance for AdminUtils function sudo_set_max_allowed_uids.

      The extrinsic sets the maximum allowed UIDs for a subnet.
      It is only callable by the root account and subnet owner.
      The extrinsic will call the Subtensor pallet to set the maximum allowed UIDs for a subnet.

      :param netuid: The network identifier.
      :param max_allowed_uids: The maximum allowed UIDs (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_max_allowed_validators(netuid, max_allowed_validators)

      Returns GenericCall instance for AdminUtils function sudo_set_max_allowed_validators.

      The extrinsic sets the maximum allowed validators for a subnet.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the maximum allowed validators.

      :param netuid: The network identifier.
      :param max_allowed_validators: The maximum allowed validators (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_max_burn(netuid, max_burn)

      Returns GenericCall instance for AdminUtils function sudo_set_max_burn.

      The extrinsic sets the maximum burn for a subnet.
      It is only callable by root and subnet owner.
      The extrinsic will call the Subtensor pallet to set the maximum burn.

      :param netuid: The network identifier.
      :param max_burn: The maximum burn value in RAO (TaoCurrency).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_max_difficulty(netuid, max_difficulty)

      Returns GenericCall instance for AdminUtils function sudo_set_max_difficulty.

      The extrinsic sets the maximum difficulty for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the maximum difficulty.

      :param netuid: The network identifier.
      :param max_difficulty: The maximum difficulty value (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_max_registrations_per_block(netuid, max_registrations_per_block)

      Returns GenericCall instance for AdminUtils function sudo_set_max_registrations_per_block.

      The extrinsic sets the maximum registrations per block for a subnet.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the maximum registrations per block.

      :param netuid: The network identifier.
      :param max_registrations_per_block: The maximum registrations per block (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_mechanism_count(netuid, mechanism_count)

      Returns GenericCall instance for AdminUtils function sudo_set_mechanism_count.

      Sets the desired number of mechanisms in a subnet.

      :param netuid: The network identifier.
      :param mechanism_count: The desired number of mechanisms (MechId).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_mechanism_emission_split(netuid, maybe_split = None)

      Returns GenericCall instance for AdminUtils function sudo_set_mechanism_emission_split.

      Sets the emission split between mechanisms in a subnet.

      :param netuid: The network identifier.
      :param maybe_split: Optional list of emission split values (Option<Vec<u16>>).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_min_allowed_uids(netuid, min_allowed_uids)

      Returns GenericCall instance for AdminUtils function sudo_set_min_allowed_uids.

      The extrinsic sets the minimum allowed UIDs for a subnet.
      It is only callable by the root account.

      :param netuid: The network identifier.
      :param min_allowed_uids: The minimum allowed UIDs (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_min_allowed_weights(netuid, min_allowed_weights)

      Returns GenericCall instance for AdminUtils function sudo_set_min_allowed_weights.

      The extrinsic sets the minimum allowed weights for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the minimum allowed weights.

      :param netuid: The network identifier.
      :param min_allowed_weights: The minimum allowed weights (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_min_burn(netuid, min_burn)

      Returns GenericCall instance for AdminUtils function sudo_set_min_burn.

      The extrinsic sets the minimum burn for a subnet.
      It is only callable by root and subnet owner.
      The extrinsic will call the Subtensor pallet to set the minimum burn.

      :param netuid: The network identifier.
      :param min_burn: The minimum burn value in RAO (TaoCurrency).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_min_delegate_take(take)

      Returns GenericCall instance for AdminUtils function sudo_set_min_delegate_take.

      The extrinsic sets the minimum delegate take.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the minimum delegate take.

      :param take: The minimum delegate take value (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_min_difficulty(netuid, min_difficulty)

      Returns GenericCall instance for AdminUtils function sudo_set_min_difficulty.

      The extrinsic sets the minimum difficulty for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the minimum difficulty.

      :param netuid: The network identifier.
      :param min_difficulty: The minimum difficulty value (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_network_immunity_period(immunity_period)

      Returns GenericCall instance for AdminUtils function sudo_set_network_immunity_period.

      The extrinsic sets the immunity period for the network.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the immunity period for the network.

      :param immunity_period: The immunity period (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_network_min_lock_cost(lock_cost)

      Returns GenericCall instance for AdminUtils function sudo_set_network_min_lock_cost.

      The extrinsic sets the min lock cost for the network.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the min lock cost for the network.

      :param lock_cost: The lock cost value in RAO (TaoCurrency).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_network_pow_registration_allowed(netuid, registration_allowed)

      Returns GenericCall instance for AdminUtils function sudo_set_network_pow_registration_allowed.

      The extrinsic sets the network PoW registration allowed for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the network PoW registration allowed.

      :param netuid: The network identifier.
      :param registration_allowed: Whether PoW registration is allowed (bool).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_network_rate_limit(rate_limit)

      Returns GenericCall instance for AdminUtils function sudo_set_network_rate_limit.

      The extrinsic sets the network rate limit for the network.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the network rate limit.

      :param rate_limit: The network rate limit (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_network_registration_allowed(netuid, registration_allowed)

      Returns GenericCall instance for AdminUtils function sudo_set_network_registration_allowed.

      The extrinsic sets the network registration allowed for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the network registration allowed.

      :param netuid: The network identifier.
      :param registration_allowed: Whether registration is allowed (bool).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_nominator_min_required_stake(min_stake)

      Returns GenericCall instance for AdminUtils function sudo_set_nominator_min_required_stake.

      The extrinsic sets the minimum stake required for nominators.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the minimum stake required for nominators.

      :param min_stake: The minimum stake required for nominators (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_owner_hparam_rate_limit(epochs)

      Returns GenericCall instance for AdminUtils function sudo_set_owner_hparam_rate_limit.

      Sets the owner hyperparameter rate limit in epochs (global multiplier).
      Only callable by root.

      :param epochs: The owner hyperparameter rate limit in epochs (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_owner_immune_neuron_limit(netuid, immune_neurons)

      Returns GenericCall instance for AdminUtils function sudo_set_owner_immune_neuron_limit.

      Sets the number of immune owner neurons.

      :param netuid: The network identifier.
      :param immune_neurons: The number of immune owner neurons (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_rao_recycled(netuid, rao_recycled)

      Returns GenericCall instance for AdminUtils function sudo_set_rao_recycled.

      The extrinsic sets the recycled RAO for a subnet.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the recycled RAO.

      :param netuid: The network identifier.
      :param rao_recycled: The recycled RAO value in RAO (TaoCurrency).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_recycle_or_burn(netuid, recycle_or_burn)

      Returns GenericCall instance for AdminUtils function sudo_set_recycle_or_burn.

      Set the behaviour of the "burn" UID(s) for a given subnet.
      If set to `Burn`, the miner emission sent to the burn UID(s) will be burned.
      If set to `Recycle`, the miner emission sent to the burn UID(s) will be recycled.

      :param netuid: The unique identifier for the subnet.
      :param recycle_or_burn: The desired behaviour of the "burn" UID(s) for the subnet.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_rho(netuid, rho)

      Returns GenericCall instance for AdminUtils function sudo_set_rho.

      The extrinsic sets the rho for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the rho.

      :param netuid: The network identifier.
      :param rho: The rho value (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_serving_rate_limit(netuid, serving_rate_limit)

      Returns GenericCall instance for AdminUtils function sudo_set_serving_rate_limit.

      The extrinsic sets the serving rate limit for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the serving rate limit.

      :param netuid: The network identifier.
      :param serving_rate_limit: The serving rate limit (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_sn_owner_hotkey(netuid, hotkey)

      Returns GenericCall instance for AdminUtils function sudo_set_sn_owner_hotkey.

      Sets or updates the hotkey account associated with the owner of a specific subnet.

      This function allows either the root origin or the current subnet owner to set or update
      the hotkey for a given subnet. The subnet must already exist. To prevent abuse, the call is
      rate-limited to once per configured interval (default: one week) per subnet.

      :param netuid: The unique identifier of the subnet whose owner hotkey is being set.
      :param hotkey: The new hotkey account to associate with the subnet owner.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_stake_threshold(min_stake)

      Returns GenericCall instance for AdminUtils function sudo_set_stake_threshold.

      The extrinsic sets the weights min stake.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the weights min stake.

      :param min_stake: The minimum stake value (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_subnet_limit(max_subnets)

      Returns GenericCall instance for AdminUtils function sudo_set_subnet_limit.

      The extrinsic sets the subnet limit for the network.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the subnet limit.

      :param max_subnets: The maximum number of subnets (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_subnet_moving_alpha(alpha)

      Returns GenericCall instance for AdminUtils function sudo_set_subnet_moving_alpha.

      Sets the new moving alpha value for the SubnetMovingAlpha.

      :param alpha: The new moving alpha value (I96F32).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_subnet_owner_cut(subnet_owner_cut)

      Returns GenericCall instance for AdminUtils function sudo_set_subnet_owner_cut.

      The extrinsic sets the subnet owner cut for a subnet.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the subnet owner cut.

      :param subnet_owner_cut: The subnet owner cut value (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_subnet_owner_hotkey(netuid, hotkey)

      Returns GenericCall instance for AdminUtils function sudo_set_subnet_owner_hotkey.

      Change the SubnetOwnerHotkey for a given subnet.

      :param netuid: The unique identifier for the subnet.
      :param hotkey: The new hotkey for the subnet owner.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_subtoken_enabled(netuid, subtoken_enabled)

      Returns GenericCall instance for AdminUtils function sudo_set_subtoken_enabled.

      Enables or disables subtoken trading for a given subnet.

      :param netuid: The unique identifier of the subnet.
      :param subtoken_enabled: A boolean indicating whether subtoken trading should be enabled or disabled.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_tao_flow_cutoff(flow_cutoff)

      Returns GenericCall instance for AdminUtils function sudo_set_tao_flow_cutoff.

      Sets TAO flow cutoff value (A).

      :param flow_cutoff: The TAO flow cutoff value (I64F64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_tao_flow_normalization_exponent(exponent)

      Returns GenericCall instance for AdminUtils function sudo_set_tao_flow_normalization_exponent.

      Sets TAO flow normalization exponent (p).

      :param exponent: The TAO flow normalization exponent (U64F64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_tao_flow_smoothing_factor(smoothing_factor)

      Returns GenericCall instance for AdminUtils function sudo_set_tao_flow_smoothing_factor.

      Sets TAO flow smoothing factor (alpha).

      :param smoothing_factor: The TAO flow smoothing factor (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_target_registrations_per_interval(netuid, target_registrations_per_interval)

      Returns GenericCall instance for AdminUtils function sudo_set_target_registrations_per_interval.

      The extrinsic sets the target registrations per interval for a subnet.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the target registrations per interval.

      :param netuid: The network identifier.
      :param target_registrations_per_interval: The target registrations per interval (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_tempo(netuid, tempo)

      Returns GenericCall instance for AdminUtils function sudo_set_tempo.

      The extrinsic sets the tempo for a subnet.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the tempo.

      :param netuid: The network identifier.
      :param tempo: The tempo value (u16).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_toggle_transfer(netuid, toggle)

      Returns GenericCall instance for AdminUtils function sudo_set_toggle_transfer.

      Enable or disable atomic alpha transfers for a given subnet.

      :param netuid: The unique identifier for the subnet.
      :param toggle: A boolean flag to enable or disable Liquid Alpha.

      :returns: GenericCall instance.



   .. py:method:: sudo_set_total_issuance(total_issuance)

      Returns GenericCall instance for AdminUtils function sudo_set_total_issuance.

      The extrinsic sets the total issuance for the network.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the issuance for the network.

      :param total_issuance: The total issuance value in RAO (TaoCurrency).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_tx_delegate_take_rate_limit(tx_rate_limit)

      Returns GenericCall instance for AdminUtils function sudo_set_tx_delegate_take_rate_limit.

      The extrinsic sets the rate limit for delegate take transactions.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the rate limit for delegate take transactions.

      :param tx_rate_limit: The transaction rate limit (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_tx_rate_limit(tx_rate_limit)

      Returns GenericCall instance for AdminUtils function sudo_set_tx_rate_limit.

      The extrinsic sets the transaction rate limit for the network.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the transaction rate limit.

      :param tx_rate_limit: The transaction rate limit (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_weights_set_rate_limit(netuid, weights_set_rate_limit)

      Returns GenericCall instance for AdminUtils function sudo_set_weights_set_rate_limit.

      The extrinsic sets the weights set rate limit for a subnet.
      It is only callable by the root account.
      The extrinsic will call the Subtensor pallet to set the weights set rate limit.

      :param netuid: The network identifier.
      :param weights_set_rate_limit: The weights set rate limit (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_weights_version_key(netuid, weights_version_key)

      Returns GenericCall instance for AdminUtils function sudo_set_weights_version_key.

      The extrinsic sets the weights version key for a subnet.
      It is only callable by the root account or subnet owner.
      The extrinsic will call the Subtensor pallet to set the weights version key.

      :param netuid: The network identifier.
      :param weights_version_key: The weights version key (u64).

      :returns: GenericCall instance.



   .. py:method:: sudo_set_yuma3_enabled(netuid, enabled)

      Returns GenericCall instance for AdminUtils function sudo_set_yuma3_enabled.

      Enables or disables Yuma3 for a given subnet.

      :param netuid: The unique identifier for the subnet.
      :param enabled: A boolean flag to enable or disable Yuma3.

      :returns: GenericCall instance.



   .. py:method:: sudo_toggle_evm_precompile(precompile_id, enabled)

      Returns GenericCall instance for AdminUtils function sudo_toggle_evm_precompile.

      Toggles the enablement of an EVM precompile.

      :param precompile_id: The identifier of the EVM precompile to toggle.
      :param enabled: The new enablement state of the precompile.

      :returns: GenericCall instance.



   .. py:method:: sudo_trim_to_max_allowed_uids(netuid, max_n)

      Returns GenericCall instance for AdminUtils function sudo_trim_to_max_allowed_uids.

      Trims the maximum number of UIDs for a subnet.

      The trimming is done by sorting the UIDs by emission descending and then trimming
      the lowest emitters while preserving temporally and owner immune UIDs. The UIDs are
      then compressed to the left and storage is migrated to the new compressed UIDs.

      :param netuid: The network identifier.
      :param max_n: The maximum number of UIDs (u16).

      :returns: GenericCall instance.



   .. py:method:: swap_authorities(new_authorities)

      Returns GenericCall instance for AdminUtils function swap_authorities.

      The extrinsic sets the new authorities for Aura consensus.
      It is only callable by the root account.
      The extrinsic will call the Aura pallet to change the authorities.

      :param new_authorities: List of new authority identifiers.

      :returns: GenericCall instance.



