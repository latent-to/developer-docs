bittensor.core.extrinsics.weights
=================================

.. py:module:: bittensor.core.extrinsics.weights

.. autoapi-nested-parse::

   Module provides sync commit and reveal weights extrinsic.



Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.weights.commit_timelocked_weights_extrinsic
   bittensor.core.extrinsics.weights.commit_weights_extrinsic
   bittensor.core.extrinsics.weights.reveal_weights_extrinsic
   bittensor.core.extrinsics.weights.set_weights_extrinsic


Module Contents
---------------

.. py:function:: commit_timelocked_weights_extrinsic(subtensor, wallet, netuid, mechid, uids, weights, block_time, commit_reveal_version = 4, version_key = version_as_int, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Commits the weights for a specific sub subnet mechanism on the Bittensor blockchain using the provided wallet.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param netuid: The subnet unique identifier.
   :param mechid: The subnet mechanism unique identifier
   :param uids: The list of neuron UIDs that the weights are being set for.
   :param weights: The corresponding weights to be set for each UID.
   :param block_time: The number of seconds for block duration.
   :param commit_reveal_version: The version of the commit-reveal in the chain.
   :param version_key: Version key for compatibility with the network.
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


.. py:function:: commit_weights_extrinsic(subtensor, wallet, netuid, mechid, uids, weights, salt, version_key = version_as_int, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Commits the weights for a specific sub subnet on the Bittensor blockchain using the provided wallet.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param netuid: The subnet unique identifier.
   :param mechid: The subnet mechanism unique identifier.
   :param uids: NumPy array of neuron UIDs for which weights are being committed.
   :param weights: NumPy array of weight values corresponding to each UID.
   :param salt: list of randomly generated integers as salt to generated weighted hash.
   :param version_key: Version key for compatibility with the network.
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


.. py:function:: reveal_weights_extrinsic(subtensor, wallet, netuid, mechid, uids, weights, salt, version_key, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Reveals the weights for a specific sub subnet on the Bittensor blockchain using the provided wallet.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param netuid: The unique identifier of the subnet.
   :param mechid: The subnet mechanism unique identifier.
   :param uids: List of neuron UIDs for which weights are being revealed.
   :param weights: List of weight values corresponding to each UID.
   :param salt: List of salt values corresponding to the hash function.
   :param version_key: Version key for compatibility with the network.
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


.. py:function:: set_weights_extrinsic(subtensor, wallet, netuid, mechid, uids, weights, version_key, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Sets the passed weights in the chain for hotkeys in the sub-subnet of the passed subnet.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param netuid: The unique identifier of the subnet.
   :param mechid: The subnet mechanism unique identifier.
   :param uids: List of neuron UIDs for which weights are being revealed.
   :param weights: List of weight values corresponding to each UID.
   :param version_key: Version key for compatibility with the network.
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


