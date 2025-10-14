bittensor.core.extrinsics.asyncex.take
======================================

.. py:module:: bittensor.core.extrinsics.asyncex.take


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.asyncex.take.decrease_take_extrinsic
   bittensor.core.extrinsics.asyncex.take.increase_take_extrinsic


Module Contents
---------------

.. py:function:: decrease_take_extrinsic(subtensor, wallet, hotkey_ss58, take, wait_for_inclusion = True, wait_for_finalization = True, raise_error = False, period = None)
   :async:


   Sets the delegate 'take' percentage for a neuron identified by its hotkey.

   :param subtensor: Blockchain connection.
   :type subtensor: Subtensor
   :param wallet: The wallet to sign the extrinsic.
   :type wallet: Wallet
   :param hotkey_ss58: SS58 address of the hotkey to set take for.
   :type hotkey_ss58: str
   :param take: The percentage of rewards that the delegate claims from nominators.
   :type take: int
   :param wait_for_inclusion: Wait for inclusion before returning. Defaults to True.
   :type wait_for_inclusion: bool, optional
   :param wait_for_finalization: Wait for finalization before returning. Defaults to True.
   :type wait_for_finalization: bool, optional
   :param raise_error: Raise error on failure. Defaults to False.
   :type raise_error: bool, optional
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.

   :returns: Success flag and status message.
   :rtype: tuple[bool, str]


.. py:function:: increase_take_extrinsic(subtensor, wallet, hotkey_ss58, take, wait_for_inclusion = True, wait_for_finalization = True, raise_error = False, period = None)
   :async:


   Sets the delegate 'take' percentage for a neuron identified by its hotkey.

   :param subtensor: Blockchain connection.
   :type subtensor: Subtensor
   :param wallet: The wallet to sign the extrinsic.
   :type wallet: Wallet
   :param hotkey_ss58: SS58 address of the hotkey to set take for.
   :type hotkey_ss58: str
   :param take: The percentage of rewards that the delegate claims from nominators.
   :type take: int
   :param wait_for_inclusion: Wait for inclusion before returning. Defaults to True.
   :type wait_for_inclusion: bool, optional
   :param wait_for_finalization: Wait for finalization before returning. Defaults to True.
   :type wait_for_finalization: bool, optional
   :param raise_error: Raise error on failure. Defaults to False.
   :type raise_error: bool, optional
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.

   :returns: Success flag and status message.
   :rtype: tuple[bool, str]


