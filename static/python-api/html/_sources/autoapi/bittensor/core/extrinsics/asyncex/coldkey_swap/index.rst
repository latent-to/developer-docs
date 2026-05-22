bittensor.core.extrinsics.asyncex.coldkey_swap
==============================================

.. py:module:: bittensor.core.extrinsics.asyncex.coldkey_swap


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.asyncex.coldkey_swap.announce_coldkey_swap_extrinsic
   bittensor.core.extrinsics.asyncex.coldkey_swap.clear_coldkey_swap_announcement_extrinsic
   bittensor.core.extrinsics.asyncex.coldkey_swap.dispute_coldkey_swap_extrinsic
   bittensor.core.extrinsics.asyncex.coldkey_swap.remove_coldkey_swap_announcement_extrinsic
   bittensor.core.extrinsics.asyncex.coldkey_swap.swap_coldkey_announced_extrinsic


Module Contents
---------------

.. py:function:: announce_coldkey_swap_extrinsic(subtensor, wallet, new_coldkey_ss58, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Announces a coldkey swap by submitting the BlakeTwo256 hash of the new coldkey.

   This extrinsic allows a coldkey to declare its intention to swap to a new coldkey address. The announcement
   must be made before the actual swap can be executed, and a delay period must pass before execution is allowed.
   After making an announcement, all transactions from the coldkey are blocked except for `swap_coldkey_announced`.

   :param subtensor: AsyncSubtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (should be the current coldkey wallet).
   :param new_coldkey_ss58: SS58 address of the new coldkey that will replace the current one.
   :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If ``False``, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - A swap cost is charged when making the first announcement (not when reannouncing).
      - After making an announcement, all transactions from the coldkey are blocked except for `swap_coldkey_announced`.
      - The swap can only be executed after the delay period has passed (check via `get_coldkey_swap_announcement`).
      - The destination coldkey cannot have any staking hotkeys. It must be completely new without any staking activity.
      - See: <https://docs.learnbittensor.org/keys/coldkey-swap>


.. py:function:: clear_coldkey_swap_announcement_extrinsic(subtensor, wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Clears (withdraws) a pending coldkey swap announcement.

   Callable by the coldkey that has an active, undisputed swap announcement. The reannouncement delay must have
   elapsed past the execution block before the announcement can be cleared.

   :param subtensor: AsyncSubtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (should be the current coldkey with an active announcement).
   :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet.
   :param period: The number of blocks during which the transaction will remain valid.
   :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - The coldkey must have an active, undisputed swap announcement.
      - The reannouncement delay must have elapsed past the execution block.


.. py:function:: dispute_coldkey_swap_extrinsic(subtensor, wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Disputes the coldkey swap announcement for the current coldkey.

   Callable by the coldkey that has an active swap announcement. Marks the swap as disputed. The account is blocked
   until root calls reset_coldkey_swap.

   :param subtensor: AsyncSubtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (should be the current coldkey with an active announcement).
   :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet.
   :param period: The number of blocks during which the transaction will remain valid.
   :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - The coldkey must have an active swap announcement.
      - After disputing, only root can clear the state via reset_coldkey_swap.


.. py:function:: remove_coldkey_swap_announcement_extrinsic(subtensor, wallet, coldkey_ss58, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Removes a coldkey swap announcement.

   This extrinsic can only called by root. It removes a pending coldkey swap announcement for the specified coldkey.

   :param subtensor: AsyncSubtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (must be root/admin wallet).
   :param coldkey_ss58: SS58 address of the coldkey to remove the swap announcement for.
   :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If ``False``, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - This function can only called by root.
      - See: <https://docs.learnbittensor.org/keys/coldkey-swap>


.. py:function:: swap_coldkey_announced_extrinsic(subtensor, wallet, new_coldkey_ss58, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Executes a previously announced coldkey swap.

   This extrinsic executes a coldkey swap that was previously announced via `announce_coldkey_swap_extrinsic`.
   The new coldkey address must match the hash that was announced, and the delay period must have passed.

   :param subtensor: AsyncSubtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (should be the current coldkey wallet that made the announcement).
   :param new_coldkey_ss58: SS58 address of the new coldkey to swap to. This must match the hash that was announced.
   :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If ``False``, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - The new coldkey hash must match the hash that was announced.
      - The delay period must have passed (check via `get_coldkey_swap_announcement`).
      - All assets, stakes, subnet ownerships, and hotkey associations are transferred from the old coldkey to the new
          one.
      - See: <https://docs.learnbittensor.org/keys/coldkey-swap>


