bittensor.core.extrinsics.asyncex.sudo
======================================

.. py:module:: bittensor.core.extrinsics.asyncex.sudo


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.asyncex.sudo.sudo_set_admin_freeze_window_extrinsic
   bittensor.core.extrinsics.asyncex.sudo.sudo_set_mechanism_count_extrinsic
   bittensor.core.extrinsics.asyncex.sudo.sudo_set_mechanism_emission_split_extrinsic


Module Contents
---------------

.. py:function:: sudo_set_admin_freeze_window_extrinsic(subtensor, wallet, window, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)
   :async:


   Sets the admin freeze window length (in blocks) at the end of a tempo.

   :param subtensor: AsyncSubtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param window: The amount of blocks to freeze in the end of a tempo.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.

   :returns:     `True` if the extrinsic executed successfully, `False` otherwise.
                 `message` is a string value describing the success or potential error.
   :rtype: tuple[bool, str]


.. py:function:: sudo_set_mechanism_count_extrinsic(subtensor, wallet, netuid, mech_count, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)
   :async:


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

   :returns:     `True` if the extrinsic executed successfully, `False` otherwise.
                 `message` is a string value describing the success or potential error.
   :rtype: tuple[bool, str]


.. py:function:: sudo_set_mechanism_emission_split_extrinsic(subtensor, wallet, netuid, maybe_split, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)
   :async:


   Sets the emission split between mechanisms in a provided subnet.

   :param subtensor: AsyncSubtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param netuid: The subnet unique identifier.
   :param maybe_split: List of emission weights (positive integers) for each subnet mechanism.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.

   :returns:     `True` if the extrinsic executed successfully, `False` otherwise.
                 `message` is a string value describing the success or potential error.
   :rtype: tuple[bool, str]

   .. note::

      The `maybe_split` list defines the relative emission share for each subnet mechanism.
      Its length must match the number of active mechanisms in the subnet or be shorter, but not equal to zero. For
      example, [3, 1, 1] distributes emissions in a 3:1:1 ratio across subnet mechanisms 0, 1, and 2. Each mechanism's
      emission share is calculated as: share[i] = maybe_split[i] / sum(maybe_split)


