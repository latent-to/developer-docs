bittensor.core.extrinsics.children
==================================

.. py:module:: bittensor.core.extrinsics.children


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.children.root_set_pending_childkey_cooldown_extrinsic
   bittensor.core.extrinsics.children.set_children_extrinsic


Module Contents
---------------

.. py:function:: root_set_pending_childkey_cooldown_extrinsic(subtensor, wallet, cooldown, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Allows a root coldkey to set children-keys.

   :param subtensor: The Subtensor client instance used for blockchain interaction.
   :param wallet: The wallet used to sign the extrinsic (must be unlocked).
   :param cooldown: The cooldown period in blocks.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Waits for the transaction to be included in a block.
   :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: set_children_extrinsic(subtensor, wallet, hotkey_ss58, netuid, children, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Allows a coldkey to set children-keys.

   :param subtensor: The Subtensor client instance used for blockchain interaction.
   :param wallet: bittensor wallet instance.
   :param hotkey_ss58: The ``SS58`` address of the neuron's hotkey.
   :param netuid: The netuid value.
   :param children: A list of children with their proportions.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Waits for the transaction to be included in a block.
   :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   :raises DuplicateChild: There are duplicates in the list of children.
   :raises InvalidChild: Child is the hotkey.
   :raises NonAssociatedColdKey: The coldkey does not own the hotkey or the child is the same as the hotkey.
   :raises NotEnoughStakeToSetChildkeys: Parent key doesn't have minimum own stake.
   :raises ProportionOverflow: The sum of the proportions does exceed uint64.
   :raises RegistrationNotPermittedOnRootSubnet: Attempting to register a child on the root network.
   :raises SubnetNotExists: Attempting to register to a non-existent network.
   :raises TooManyChildren: Too many children in request.
   :raises TxRateLimitExceeded: Hotkey hit the rate limit.
   :raises bittensor_wallet.errors.KeyFileError: Failed to decode keyfile data.
   :raises bittensor_wallet.errors.PasswordError: Decryption failed or wrong password for decryption provided.


