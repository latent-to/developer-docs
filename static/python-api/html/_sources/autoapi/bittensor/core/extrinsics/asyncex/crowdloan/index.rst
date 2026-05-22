bittensor.core.extrinsics.asyncex.crowdloan
===========================================

.. py:module:: bittensor.core.extrinsics.asyncex.crowdloan


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.asyncex.crowdloan.contribute_crowdloan_extrinsic
   bittensor.core.extrinsics.asyncex.crowdloan.create_crowdloan_extrinsic
   bittensor.core.extrinsics.asyncex.crowdloan.dissolve_crowdloan_extrinsic
   bittensor.core.extrinsics.asyncex.crowdloan.finalize_crowdloan_extrinsic
   bittensor.core.extrinsics.asyncex.crowdloan.refund_crowdloan_extrinsic
   bittensor.core.extrinsics.asyncex.crowdloan.update_cap_crowdloan_extrinsic
   bittensor.core.extrinsics.asyncex.crowdloan.update_end_crowdloan_extrinsic
   bittensor.core.extrinsics.asyncex.crowdloan.update_min_contribution_crowdloan_extrinsic
   bittensor.core.extrinsics.asyncex.crowdloan.withdraw_crowdloan_extrinsic


Module Contents
---------------

.. py:function:: contribute_crowdloan_extrinsic(subtensor, wallet, crowdloan_id, amount, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Contributes funds to an active crowdloan campaign.

   :param subtensor: Active Subtensor connection.
   :param wallet: Bittensor Wallet instance used to sign the transaction.
   :param crowdloan_id: The unique identifier of the crowdloan to contribute to.
   :param amount: Amount to contribute.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: create_crowdloan_extrinsic(subtensor, wallet, deposit, min_contribution, cap, end, call = None, target_address = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Creates a new crowdloan campaign on-chain.

   :param subtensor: Active Subtensor connection.
   :param wallet: Bittensor Wallet instance used to sign the transaction.
   :param deposit: Initial deposit in RAO from the creator.
   :param min_contribution: Minimum contribution amount.
   :param cap: Maximum cap to be raised.
   :param end: Block number when the campaign ends.
   :param call: Runtime call data (e.g., subtensor::register_leased_network).
   :param target_address: SS58 address to transfer funds to on success.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: dissolve_crowdloan_extrinsic(subtensor, wallet, crowdloan_id, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Dissolves a completed or failed crowdloan campaign after all refunds are processed.

   This permanently removes the campaign from on-chain storage and refunds the creator's remaining deposit, if
   applicable. Can only be called by the campaign creator.

   :param subtensor: Active Subtensor connection.
   :param wallet: Bittensor Wallet instance used to sign the transaction.
   :param crowdloan_id: The unique identifier of the crowdloan to dissolve.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - Only the creator can dissolve their own crowdloan.
      - All contributors (except the creator) must have been refunded first.
      - The creator’s remaining contribution (deposit) is returned during dissolution.
      - After this call, the crowdloan is removed from chain storage.


.. py:function:: finalize_crowdloan_extrinsic(subtensor, wallet, crowdloan_id, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Finalizes a successful crowdloan campaign once the cap has been reached and the end block has passed.

   This executes the stored call or transfers the raised funds to the target address, completing the campaign.

   :param subtensor: Active Subtensor connection.
   :param wallet: Bittensor Wallet instance used to sign the transaction.
   :param crowdloan_id: The unique identifier of the crowdloan to finalize.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: refund_crowdloan_extrinsic(subtensor, wallet, crowdloan_id, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Refunds contributors from a failed or expired crowdloan campaign.

   This call attempts to refund up to the limit defined by `RefundContributorsLimit` in a single dispatch. If there are
   more contributors than the limit, the call may need to be executed multiple times until all refunds are processed.

   :param subtensor: Active Subtensor connection.
   :param wallet: Bittensor Wallet instance used to sign the transaction.
   :param crowdloan_id: The unique identifier of the crowdloan to refund.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - Can be called by only creator signed account.
      - Refunds contributors (excluding the creator) whose funds were locked in a failed campaign.
      - Each call processes a limited number of refunds (`RefundContributorsLimit`).
      - If the campaign has too many contributors, multiple refund calls are required.


.. py:function:: update_cap_crowdloan_extrinsic(subtensor, wallet, crowdloan_id, new_cap, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Updates the fundraising cap (maximum total contribution) of a non-finalized crowdloan.

   Only the creator of the crowdloan can perform this action, and the new cap must be greater than or equal to the
   current amount already raised.

   :param subtensor: Active Subtensor connection.
   :param wallet: Bittensor Wallet instance used to sign the transaction.
   :param crowdloan_id: The unique identifier of the crowdloan to update.
   :param new_cap: The new fundraising cap (in TAO or Balance).
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - Only the creator can update the cap.
      - The crowdloan must not be finalized.
      - The new cap must be greater than or equal to the total funds already raised.


.. py:function:: update_end_crowdloan_extrinsic(subtensor, wallet, crowdloan_id, new_end, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Updates the end block of a non-finalized crowdloan campaign.

   Only the creator of the crowdloan can perform this action. The new end block must be valid — meaning it cannot be in
   the past and must respect the minimum and maximum duration limits enforced by the chain.

   :param subtensor: Active Subtensor connection.
   :param wallet: Bittensor Wallet instance used to sign the transaction.
   :param crowdloan_id: The unique identifier of the crowdloan to update.
   :param new_end: The new block number at which the crowdloan will end.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - Only the creator can call this extrinsic.
      - The crowdloan must not be finalized.
      - The new end block must be later than the current block and within valid duration bounds (between
          `MinimumBlockDuration` and `MaximumBlockDuration`).


.. py:function:: update_min_contribution_crowdloan_extrinsic(subtensor, wallet, crowdloan_id, new_min_contribution, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Updates the minimum contribution amount of a non-finalized crowdloan.

   Only the creator of the crowdloan can perform this action, and the new value must be greater than or equal to the
   absolute minimum contribution defined in the chain configuration.

   :param subtensor: Active Subtensor connection.
   :param wallet: Bittensor Wallet instance used to sign the transaction.
   :param crowdloan_id: The unique identifier of the crowdloan to update.
   :param new_min_contribution: The new minimum contribution amount (in TAO or Balance).
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - Can only be called by the creator of the crowdloan.
      - The crowdloan must not be finalized.
      - The new minimum contribution must not fall below the absolute minimum defined in the runtime.


.. py:function:: withdraw_crowdloan_extrinsic(subtensor, wallet, crowdloan_id, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Withdraws a contribution from an active (not yet finalized or dissolved) crowdloan.

   :param subtensor: Active Subtensor connection.
   :param wallet: Wallet instance used to sign the transaction (must be unlocked).
   :param crowdloan_id: The unique identifier of the crowdloan to withdraw from.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. note::

      - Regular contributors can fully withdraw their contribution before finalization.
      - The creator cannot withdraw the initial deposit, but may withdraw any amount exceeding his deposit.


