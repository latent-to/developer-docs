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

.. py:function:: root_set_pending_childkey_cooldown_extrinsic(subtensor, wallet, cooldown, wait_for_inclusion = True, wait_for_finalization = False, period = None)

   Allows a coldkey to set children-keys.


.. py:function:: set_children_extrinsic(subtensor, wallet, hotkey, netuid, children, wait_for_inclusion = True, wait_for_finalization = False, raise_error = False, period = None)

   Allows a coldkey to set children-keys.

   :param subtensor: bittensor subtensor.
   :param wallet: bittensor wallet instance.
   :param hotkey: The ``SS58`` address of the neuron's hotkey.
   :param netuid: The netuid value.
   :param children: A list of children with their proportions.
   :param wait_for_inclusion: Waits for the transaction to be included in a block.
   :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.

   :returns:

             A tuple where the first element is a boolean indicating success or failure of the operation,
                 and the second element is a message providing additional information.
   :rtype: tuple[bool, str]

   :raises DuplicateChild: There are duplicates in the list of children.
   :raises InvalidChild: Child is the hotkey.
   :raises NonAssociatedColdKey: The coldkey does not own the hotkey or the child is the same as the hotkey.
   :raises NotEnoughStakeToSetChildkeys: Parent key doesn't have minimum own stake.
   :raises ProportionOverflow: The sum of the proportions does exceed uint64.
   :raises RegistrationNotPermittedOnRootSubnet: Attempting to register a child on the root network.
   :raises SubNetworkDoesNotExist: Attempting to register to a non-existent network.
   :raises TooManyChildren: Too many children in request.
   :raises TxRateLimitExceeded: Hotkey hit the rate limit.
   :raises bittensor_wallet.errors.KeyFileError: Failed to decode keyfile data.
   :raises bittensor_wallet.errors.PasswordError: Decryption failed or wrong password for decryption provided.


