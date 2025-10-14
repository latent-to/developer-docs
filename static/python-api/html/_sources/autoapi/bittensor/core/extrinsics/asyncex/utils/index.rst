bittensor.core.extrinsics.asyncex.utils
=======================================

.. py:module:: bittensor.core.extrinsics.asyncex.utils


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.asyncex.utils.get_extrinsic_fee
   bittensor.core.extrinsics.asyncex.utils.sudo_call_extrinsic


Module Contents
---------------

.. py:function:: get_extrinsic_fee(subtensor, call, keypair, netuid = None)
   :async:


   Get extrinsic fee for a given extrinsic call and keypair for a given SN's netuid.

   :param subtensor: The Subtensor instance.
   :param netuid: The SN's netuid.
   :param call: The extrinsic call.
   :param keypair: The keypair associated with the extrinsic.

   :returns: Balance object representing the extrinsic fee in RAO.


.. py:function:: sudo_call_extrinsic(subtensor, wallet, call_function, call_params, call_module = 'AdminUtils', sign_with = 'coldkey', use_nonce = False, nonce_key = 'hotkey', period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)
   :async:


   Execute a sudo call extrinsic.

   :param subtensor: AsyncSubtensor instance.
   :param wallet: The wallet instance.
   :param call_function: The call function to execute.
   :param call_params: The call parameters.
   :param call_module: The call module.
   :param sign_with: The keypair to sign the extrinsic with.
   :param use_nonce: Whether to use a nonce.
   :param nonce_key: The key to use for the nonce.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.

   :returns:     `True` if the extrinsic executed successfully, `False` otherwise.
                 `message` is a string value describing the success or potential error.
   :rtype: tuple[bool, str]


