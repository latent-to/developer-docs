bittensor.core.extrinsics.pallets.subtensor_module
==================================================

.. py:module:: bittensor.core.extrinsics.pallets.subtensor_module


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.subtensor_module.SubtensorModule


Module Contents
---------------

.. py:class:: SubtensorModule

   Bases: :py:obj:`bittensor.core.extrinsics.pallets.base.CallBuilder`


   Factory class for creating GenericCall objects for SubtensorModule pallet functions.

   This class provides methods to create GenericCall instances for all SubtensorModule pallet extrinsics.

   Works with both sync (Subtensor) and async (AsyncSubtensor) instances. For async operations, pass an AsyncSubtensor
   instance and await the result.

   .. admonition:: Example

      # Sync usage
      call = SubtensorModule(subtensor).start_call(netuid=14)
      response = subtensor.sign_and_send_extrinsic(call=call, ...)
      
      # Async usage
      call = await SubtensorModule(async_subtensor).start_call(netuid=14)
      response = await async_subtensor.sign_and_send_extrinsic(call=call, ...)


   .. py:method:: add_stake(netuid, hotkey, amount_staked)

      Returns GenericCall instance for Subtensor function SubtensorModule.add_stake.

      :param netuid: The netuid of the subnet to add stake to.
      :param hotkey: The hotkey SS58 address associated with validator.
      :param amount_staked: Amount of stake in RAO to add.

      :returns: GenericCall instance.



   .. py:method:: add_stake_burn(netuid, hotkey, amount, limit = None)

      Returns GenericCall instance for Subtensor function SubtensorModule.add_stake_burn.

      :param netuid: The netuid of the subnet to buy back on.
      :param hotkey: The hotkey SS58 address associated with the buyback.
      :param amount: Amount of TAO in RAO to use for the buyback.
      :param limit: Optional limit price expressed in units of RAO per one Alpha.

      :returns: GenericCall instance.



   .. py:method:: add_stake_limit(netuid, hotkey, amount_staked, limit_price, allow_partial)

      Returns GenericCall instance for Subtensor function SubtensorModule.add_stake_limit.

      :param netuid: The netuid of the subnet to add stake to.
      :param hotkey: The hotkey SS58 address associated with validator.
      :param amount_staked: Amount of stake in RAO to add.
      :param limit_price: The limit price expressed in units of RAO per one Alpha.
      :param allow_partial: If True, allows partial unstaking if price tolerance exceeded.

      :returns: GenericCall instance.



   .. py:method:: announce_coldkey_swap(new_coldkey_hash)

      Returns GenericCall instance for Subtensor function SubtensorModule.announce_coldkey_swap.

      :param new_coldkey_hash: The BlakeTwo256 hash of the new coldkey AccountId (hex string with 0x prefix).

      :returns: GenericCall instance.



   .. py:method:: burned_register(netuid, hotkey)

      Returns GenericCall instance for Subtensor function SubtensorModule.burned_register.

      :param netuid: The netuid of the subnet to register on.
      :param hotkey: The hotkey SS58 address associated with the neuron.

      :returns: GenericCall instance.



   .. py:method:: claim_root(subnets)

      Returns GenericCall instance for Subtensor function SubtensorModule.claim_root.

      :param subnets: The netuids of the subnets to claim root for. Think about it as netuids.

      :returns: GenericCall instance.



   .. py:method:: clear_coldkey_swap_announcement()

      Returns GenericCall instance for Subtensor function SubtensorModule.clear_coldkey_swap_announcement.

      Callable by the coldkey that has an active swap announcement. Withdraws the announcement
      after the reannouncement delay has elapsed past the execution block.

      :returns: GenericCall instance.



   .. py:method:: commit_mechanism_weights(netuid, mecid, commit_hash)

      Returns GenericCall instance for Subtensor function SubtensorModule.commit_mechanism_weights.

      :param netuid: The unique identifier of the subnet.
      :param mecid: The subnet mechanism unique identifier.
      :param commit_hash: The hash of the commitment.

      :returns: GenericCall instance.



   .. py:method:: commit_timelocked_mechanism_weights(netuid, mecid, commit, reveal_round, commit_reveal_version)

      Returns GenericCall instance for Subtensor function SubtensorModule.commit_mechanism_weights.

      :param netuid: The unique identifier of the subnet.
      :param mecid: The subnet mechanism unique identifier.
      :param commit: Raw bytes of the encrypted and compressed uids & weights values for setting weights.
      :param reveal_round: Drand round number when weights have to be revealed. Based on Drand Quicknet network.
      :param commit_reveal_version: The version of the commit-reveal in the chain.

      :returns: GenericCall instance.



   .. py:method:: decrease_take(hotkey, take)

      Returns GenericCall instance for Subtensor function SubtensorModule.decrease_take.

      :param hotkey: SS58 address of the hotkey to set take for.
      :param take: The percentage of rewards that the delegate claims from nominators.

      :returns: GenericCall instance.



   .. py:method:: dispute_coldkey_swap()

      Returns GenericCall instance for Subtensor function SubtensorModule.dispute_coldkey_swap.

      Callable by the coldkey that has an active swap announcement. Marks the swap as disputed;
      the account is blocked until root calls reset_coldkey_swap.

      :returns: GenericCall instance.



   .. py:method:: increase_take(hotkey, take)

      Returns GenericCall instance for Subtensor function SubtensorModule.increase_take.

      :param hotkey: SS58 address of the hotkey to set take for.
      :param take: The percentage of rewards that the delegate claims from nominators.

      :returns: GenericCall instance.



   .. py:method:: move_stake(origin_netuid, origin_hotkey_ss58, destination_netuid, destination_hotkey_ss58, alpha_amount)

      Returns GenericCall instance for Subtensor function SubtensorModule.move_stake.

      :param origin_netuid: The netuid of the source subnet.
      :param origin_hotkey_ss58: The SS58 address of the source hotkey.
      :param destination_netuid: The netuid of the destination subnet.
      :param destination_hotkey_ss58: The SS58 address of the destination hotkey.
      :param alpha_amount: Amount of origin Balance to move.

      :returns: GenericCall instance.



   .. py:method:: register_limit(netuid, hotkey, limit_price)

      Returns GenericCall instance for Subtensor function SubtensorModule.register_limit.

      :param netuid: The netuid of the subnet to register on.
      :param hotkey: The hotkey SS58 address associated with the neuron.
      :param limit_price: Maximum acceptable burn price in RAO. If on-chain burn exceeds this,
                          the transaction fails with RegistrationPriceLimitExceeded.

      :returns: GenericCall instance.



   .. py:method:: register_network(hotkey)

      Returns GenericCall instance for Subtensor function SubtensorModule.register_network.

      :param hotkey: The hotkey SS58 address associated with the subnet owner.

      :returns: GenericCall instance.



   .. py:method:: remove_coldkey_swap_announcement(coldkey)

      Returns GenericCall that resets coldkey swap for the given coldkey (root only).

      Deprecated. Use :meth:`reset_coldkey_swap` instead. This shim exists for compatibility;
      the runtime call is SubtensorModule.reset_coldkey_swap, which clears both announcement
      and dispute.

      :param coldkey: SS58 address of the coldkey to reset the swap for.

      :returns: GenericCall instance.



   .. py:method:: remove_stake(netuid, hotkey, amount_unstaked)

      Returns GenericCall instance for Subtensor function SubtensorModule.remove_stake.

      :param netuid: The netuid of the subnet to remove stake from.
      :param hotkey: The hotkey SS58 address associated with validator.
      :param amount_unstaked: Amount of stake in RAO to remove/unstake from the validator.

      :returns: GenericCall instance.



   .. py:method:: remove_stake_full_limit(netuid, hotkey, limit_price = None)

      Returns GenericCall instance for Subtensor function SubtensorModule.remove_stake_full_limit.

      :param netuid: The netuid of the subnet to remove stake from.
      :param hotkey: The hotkey SS58 address associated with validator.
      :param limit_price: The limit price expressed in units of RAO per one Alpha.

      :returns: GenericCall instance.



   .. py:method:: remove_stake_limit(netuid, hotkey, amount_unstaked, limit_price, allow_partial)

      Returns GenericCall instance for Subtensor function SubtensorModule.remove_stake_full.

      :param netuid: The netuid of the subnet to remove stake from.
      :param hotkey: The hotkey SS58 address associated with validator.
      :param amount_unstaked: Amount of stake in RAO to remove/unstake from the validator.
      :param limit_price: The limit price expressed in units of RAO per one Alpha.
      :param allow_partial: Allows partial stake execution of the amount.

      :returns: GenericCall instance.



   .. py:method:: reset_coldkey_swap(coldkey)

      Returns GenericCall instance for Subtensor function SubtensorModule.reset_coldkey_swap.

      Only callable by root. Clears the coldkey swap announcement and dispute for the given coldkey.

      :param coldkey: SS58 address of the coldkey to reset the swap for.

      :returns: GenericCall instance.



   .. py:method:: reveal_mechanism_weights(netuid, mecid, uids, values, salt, version_key)

      Returns GenericCall instance for Subtensor function SubtensorModule.reveal_mechanism_weights.

      :param netuid: The unique identifier of the subnet.
      :param mecid: The subnet mechanism unique identifier.
      :param uids: List of neuron UIDs for which weights are being revealed. Think like UIDs.
      :param values: List of weight values corresponding to each UID. Think like Weights.
      :param salt: The salt used to generate the hash.
      :param version_key: Version key for compatibility with the network.

      :returns: GenericCall instance.



   .. py:method:: root_register(hotkey)

      Returns GenericCall instance for Subtensor function SubtensorModule.root_register.

      :param hotkey: The hotkey SS58 address associated with the neuron.

      :returns: GenericCall instance.



   .. py:method:: serve_axon(netuid, version, ip, port, ip_type, protocol, placeholder1 = 0, placeholder2 = 0)

      Returns GenericCall instance for Subtensor function SubtensorModule.serve_axon.

      :param netuid: The network uid to serve on.
      :param version: The bittensor version identifier.
      :param ip: Integer representation of endpoint ip.
      :param port: Endpoint port number i.e., ``9221``.
      :param ip_type: The endpoint ip version.
      :param protocol: An ``int`` representation of the protocol.
      :param placeholder1: Placeholder for further extra params.
      :param placeholder2: Placeholder for further extra params.

      :returns: GenericCall instance.



   .. py:method:: serve_axon_tls(netuid, version, ip, port, ip_type, protocol, placeholder1 = 0, placeholder2 = 0, certificate = None)

      Returns GenericCall instance for Subtensor function SubtensorModule.serve_axon_tls.

      :param netuid: The network uid to serve on.
      :param version: The bittensor version identifier.
      :param ip: Integer representation of endpoint ip.
      :param port: Endpoint port number i.e., ``9221``.
      :param ip_type: The endpoint ip version.
      :param protocol: An ``int`` representation of the protocol.
      :param placeholder1: Placeholder for further extra params.
      :param placeholder2: Placeholder for further extra params.
      :param certificate: Certificate to use for TLS. If ``None``, no TLS will be used.

      :returns: GenericCall instance.



   .. py:method:: set_children(hotkey, netuid, children)

      Returns GenericCall instance for Subtensor function SubtensorModule.set_children.

      :param hotkey: The hotkey SS58 address associated with the neuron.
      :param netuid: The netuid of the subnet to set children for.
      :param children: List of tuples containing the proportion of stake to assign to each child hotkey.

      :returns: GenericCall instance.



   .. py:method:: set_coldkey_auto_stake_hotkey(netuid, hotkey)

      Returns GenericCall instance for Subtensor function SubtensorModule.set_coldkey_auto_stake_hotkey.

      :param netuid: The netuid of the subnet to set auto stake hotkey for.
      :param hotkey: The hotkey SS58 address associated with the validator neuron.

      :returns: GenericCall instance.



   .. py:method:: set_mechanism_weights(netuid, mecid, dests, weights, version_key)

      Returns GenericCall instance for Subtensor function SubtensorModule.set_mechanism_weights.

      :param netuid: The unique identifier of the subnet.
      :param mecid: The subnet mechanism unique identifier.
      :param dests: List of neuron UIDs for which weights are being revealed. Think like UIDs.
      :param weights: List of weight values corresponding to each UID.
      :param version_key: Version key for compatibility with the network.

      :returns: GenericCall instance.



   .. py:method:: set_pending_childkey_cooldown(cooldown)

      Returns GenericCall instance for Subtensor function SubtensorModule.set_pending_childkey_cooldown.

      :param cooldown: The pending childkey cooldown period in seconds.

      :returns: GenericCall instance.



   .. py:method:: set_root_claim_type(new_root_claim_type)

      Returns GenericCall instance for Subtensor function SubtensorModule.set_root_claim_type.

      :param new_root_claim_type: The new root claim type. Can be:
                                  - String: "Swap" or "Keep"
                                  - Dict: {"KeepSubnets": {"subnets": [1, 2, 3]}}

      :returns: GenericCall instance.



   .. py:method:: set_subnet_identity(netuid, subnet_name, github_repo, subnet_contact, subnet_url, discord, description, logo_url, additional)

      Returns GenericCall instance for Subtensor function SubtensorModule.set_subnet_identity.

      :param netuid: The netuid of the subnet to set identity for.
      :param subnet_name: The name of the subnet.
      :param github_repo: The GitHub repository URL of the subnet.
      :param subnet_contact: The contact information of the subnet owner.
      :param subnet_url: The URL of the subnet.
      :param logo_url: The URL of the subnet logo.
      :param discord: The Discord server URL of the subnet.
      :param description: The description of the subnet.
      :param additional: Additional information about the subnet.

      :returns: GenericCall instance.



   .. py:method:: start_call(netuid)

      Returns GenericCall instance for Subtensor function SubtensorModule.start_call.

      :param netuid: The netuid of the subnet to to be activated.

      :returns: GenericCall instance.



   .. py:method:: swap_coldkey(old_coldkey, new_coldkey, swap_cost)

      Returns GenericCall instance for Subtensor function SubtensorModule.swap_coldkey.

      Only callable by root. Performs a coldkey swap without an announcement; swap_cost is charged
      from old_coldkey in RAO.

      :param old_coldkey: SS58 address of the coldkey to swap from.
      :param new_coldkey: SS58 address of the coldkey to swap to.
      :param swap_cost: Cost in RAO charged from old_coldkey (use 0 for no charge).

      :returns: GenericCall instance.



   .. py:method:: swap_coldkey_announced(new_coldkey)

      Returns GenericCall instance for Subtensor function SubtensorModule.swap_coldkey_announced.

      :param new_coldkey: SS58 address of the new coldkey to swap to. The BlakeTwo256 hash of this coldkey must match
                          the hash that was announced.

      :returns: GenericCall instance.



   .. py:method:: swap_stake(hotkey, origin_netuid, destination_netuid, alpha_amount)

      Returns GenericCall instance for Subtensor function SubtensorModule.swap_stake.

      :param hotkey: The hotkey SS58 address associated with the stake.
      :param origin_netuid: The source subnet UID.
      :param destination_netuid: The destination subnet UID.
      :param alpha_amount: Amount of stake in RAO to swap.

      :returns: GenericCall instance.



   .. py:method:: swap_stake_limit(hotkey, origin_netuid, destination_netuid, alpha_amount, limit_price, allow_partial)

      Returns GenericCall instance for Subtensor function SubtensorModule.swap_stake_limit.

      :param hotkey: The hotkey SS58 address associated with the stake.
      :param origin_netuid: The source subnet UID.
      :param destination_netuid: The destination subnet UID.
      :param alpha_amount: The amount of stake in RAO to swap.
      :param allow_partial: If true, allows partial stake swaps when the full amount would exceed the price
                            tolerance.
      :param limit_price: Maximum allowed increase in a price ratio (0.005 = 0.5%).

      :returns: GenericCall instance.



   .. py:method:: transfer_stake(destination_coldkey, hotkey, origin_netuid, destination_netuid, alpha_amount)

      Returns GenericCall instance for Subtensor function SubtensorModule.transfer_stake.

      :param destination_coldkey: SS58 address of the destination coldkey.
      :param hotkey: SS58 address of the hotkey associated with the stake.
      :param origin_netuid: Network UID of the origin subnet.
      :param destination_netuid: Network UID of the destination subnet.
      :param alpha_amount: The amount of stake in RAO to transfer as a `Balance` object.

      :returns: GenericCall instance.



