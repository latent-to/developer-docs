bittensor.core.extrinsics.take
==============================

.. py:module:: bittensor.core.extrinsics.take


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.take.set_take_extrinsic


Module Contents
---------------

.. py:function:: set_take_extrinsic(subtensor, wallet, hotkey_ss58, take, action, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Sets the delegate 'take' percentage for a neuron identified by its hotkey.

   :param subtensor: The Subtensor instance.
   :param wallet: The wallet to sign the extrinsic.
   :param hotkey_ss58: SS58 address of the hotkey to set take for.
   :param take: The percentage of rewards that the delegate claims from nominators.
   :param action: The call function to use to set the take. Can be either "increase_take" or "decrease_take".
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


