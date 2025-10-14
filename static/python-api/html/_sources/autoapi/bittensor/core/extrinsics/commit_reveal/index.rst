bittensor.core.extrinsics.commit_reveal
=======================================

.. py:module:: bittensor.core.extrinsics.commit_reveal

.. autoapi-nested-parse::

   This module provides sync functionality for commit reveal in the Bittensor network.



Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.commit_reveal.commit_reveal_v3_extrinsic


Module Contents
---------------

.. py:function:: commit_reveal_v3_extrinsic(subtensor, wallet, netuid, uids, weights, version_key = version_as_int, wait_for_inclusion = False, wait_for_finalization = False, block_time = 12.0, period = None)

   Commits and reveals weights for a given subtensor and wallet with provided uids and weights.

   :param subtensor: The Subtensor instance.
   :param wallet: The wallet to use for committing and revealing.
   :param netuid: The id of the network.
   :param uids: The uids to commit.
   :param weights: The weights associated with the uids.
   :param version_key: The version key to use for committing and revealing. Default is version_as_int.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction. Default is False.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction. Default is False.
   :param block_time: The number of seconds for block duration. Default is 12.0 seconds.
   :type block_time: float
   :param period: The number of blocks during which the transaction will remain valid after it's submitted.
                  If the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :type period: Optional[int]

   :returns:

             A tuple where the first element is a boolean indicating success or failure, and the second
                 element is a message associated with the result
   :rtype: tuple[bool, str]


