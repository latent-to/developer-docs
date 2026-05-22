bittensor.core.extrinsics.root
==============================

.. py:module:: bittensor.core.extrinsics.root


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.root.claim_root_extrinsic
   bittensor.core.extrinsics.root.root_register_extrinsic
   bittensor.core.extrinsics.root.set_root_claim_type_extrinsic


Module Contents
---------------

.. py:function:: claim_root_extrinsic(subtensor, wallet, netuids, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Claims the root emissions for a coldkey.

   :param subtensor: Subtensor instance to interact with the blockchain.
   :param wallet: Bittensor Wallet instance.
   :param netuids: The netuids to claim root emissions for.
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


.. py:function:: root_register_extrinsic(subtensor, wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Registers the neuron to the root network.

   :param subtensor: Subtensor instance to interact with the blockchain.
   :param wallet: Bittensor Wallet instance.
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


.. py:function:: set_root_claim_type_extrinsic(subtensor, wallet, new_root_claim_type, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Sets the root claim type for the coldkey in provided wallet.

   :param subtensor: Subtensor instance to interact with the blockchain.
   :param wallet: Bittensor Wallet instance.
   :param new_root_claim_type: The new root claim type to set. Can be:
                               - String: "Swap" or "Keep"
                               - RootClaimType: RootClaimType.Swap, RootClaimType.Keep
                               - Dict: {"KeepSubnets": {"subnets": [1, 2, 3]}}
                               - Callable: RootClaimType.KeepSubnets([1, 2, 3])
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


