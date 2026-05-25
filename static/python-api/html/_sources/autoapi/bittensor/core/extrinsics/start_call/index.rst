bittensor.core.extrinsics.start_call
====================================

.. py:module:: bittensor.core.extrinsics.start_call


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.start_call.start_call_extrinsic


Module Contents
---------------

.. py:function:: start_call_extrinsic(subtensor, wallet, netuid, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = False, wait_for_revealed_execution = True)

   Submits a start_call extrinsic to the blockchain, to trigger the start call process for a subnet (used to start a
   new subnet's emission mechanism).

   :param subtensor: The Subtensor client instance used for blockchain interaction.
   :param wallet: The wallet used to sign the extrinsic (must be unlocked).
   :param netuid: The UID of the target subnet for which the call is being initiated.
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


