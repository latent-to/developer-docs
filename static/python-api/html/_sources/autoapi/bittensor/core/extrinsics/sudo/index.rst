bittensor.core.extrinsics.sudo
==============================

.. py:module:: bittensor.core.extrinsics.sudo


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.sudo.reset_coldkey_swap_extrinsic
   bittensor.core.extrinsics.sudo.sudo_set_admin_freeze_window_extrinsic
   bittensor.core.extrinsics.sudo.sudo_set_coldkey_swap_announcement_delay_extrinsic
   bittensor.core.extrinsics.sudo.sudo_set_coldkey_swap_reannouncement_delay_extrinsic
   bittensor.core.extrinsics.sudo.sudo_set_mechanism_count_extrinsic
   bittensor.core.extrinsics.sudo.sudo_set_mechanism_emission_split_extrinsic
   bittensor.core.extrinsics.sudo.swap_coldkey_extrinsic


Module Contents
---------------

.. py:function:: reset_coldkey_swap_extrinsic(subtensor, wallet, coldkey_ss58, *, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)

   Resets the coldkey swap state for the given coldkey (root only).

   Clears the coldkey swap announcement and dispute for the specified coldkey. Only callable by root.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor wallet object (must be root/admin wallet).
   :param coldkey_ss58: SS58 address of the coldkey to reset the swap for.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - This function can only called by root.


.. py:function:: sudo_set_admin_freeze_window_extrinsic(subtensor, wallet, window, *, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)

   Sets the admin freeze window length (in blocks) at the end of a tempo.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param window: The amount of blocks to freeze in the end of a tempo.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: sudo_set_coldkey_swap_announcement_delay_extrinsic(subtensor, wallet, duration, *, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)

   Sets the announcement delay for coldkey swap.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param duration: The announcement delay in blocks.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: sudo_set_coldkey_swap_reannouncement_delay_extrinsic(subtensor, wallet, duration, *, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)

   Sets the reannouncement delay for coldkey swap.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param duration: The reannouncement delay in blocks.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: sudo_set_mechanism_count_extrinsic(subtensor, wallet, netuid, mech_count, *, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)

   Sets the number of subnet mechanisms.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param netuid: The subnet unique identifier.
   :param mech_count: The amount of subnet mechanism to be set.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: sudo_set_mechanism_emission_split_extrinsic(subtensor, wallet, netuid, maybe_split, *, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)

   Sets the emission split between mechanisms in a provided subnet.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param netuid: The subnet unique identifier.
   :param maybe_split: List of emission weights (positive integers) for each subnet mechanism.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. note::

      The `maybe_split` list defines the relative emission share for each subnet mechanism.
      Its length must match the number of active mechanisms in the subnet or be shorter, but not equal to zero. For
      example, [3, 1, 1] distributes emissions in a 3:1:1 ratio across subnet mechanisms 0, 1, and 2. Each mechanism's
      emission share is calculated as: share[i] = maybe_split[i] / sum(maybe_split)


.. py:function:: swap_coldkey_extrinsic(subtensor, wallet, old_coldkey_ss58, new_coldkey_ss58, swap_cost, *, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)

   Performs a root-only coldkey swap without an announcement.

   Only callable by root. Transfers all stake and associations from old_coldkey to new_coldkey; `swap_cost` (in RAO) is
   charged from old_coldkey. Use 0 for no charge.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor wallet object (must be root/admin wallet).
   :param old_coldkey_ss58: SS58 address of the coldkey to swap from.
   :param new_coldkey_ss58: SS58 address of the coldkey to swap to.
   :param swap_cost: Cost in RAO charged from old_coldkey (use 0 for no charge).
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - This function can only called by root.


