bittensor.core.extrinsics.start_call
====================================

.. py:module:: bittensor.core.extrinsics.start_call


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.start_call.start_call_extrinsic


Module Contents
---------------

.. py:function:: start_call_extrinsic(subtensor, wallet, netuid, wait_for_inclusion = True, wait_for_finalization = False, period = None)

   Submits a start_call extrinsic to the blockchain, to trigger the start call process for a subnet (used to start a
   new subnet's emission mechanism).

   :param subtensor: The Subtensor client instance used for blockchain interaction.
   :type subtensor: Subtensor
   :param wallet: The wallet used to sign the extrinsic (must be unlocked).
   :type wallet: Wallet
   :param netuid: The UID of the target subnet for which the call is being initiated.
   :type netuid: int
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block. Defaults to True.
   :type wait_for_inclusion: bool, optional
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic. Defaults to False.
   :type wait_for_finalization: bool, optional
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.

   :returns:     - True and a success message if the extrinsic is successfully submitted or processed.
                 - False and an error message if the submission fails or the wallet cannot be unlocked.
   :rtype: Tuple[bool, str]


