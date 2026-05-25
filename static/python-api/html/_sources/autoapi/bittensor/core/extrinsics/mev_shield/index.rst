bittensor.core.extrinsics.mev_shield
====================================

.. py:module:: bittensor.core.extrinsics.mev_shield

.. autoapi-nested-parse::

   Module provides sync MEV Shield extrinsics.



Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.mev_shield.submit_encrypted_extrinsic
   bittensor.core.extrinsics.mev_shield.wait_for_extrinsic_by_hash


Module Contents
---------------

.. py:function:: submit_encrypted_extrinsic(subtensor, wallet, call, sign_with = 'coldkey', *, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = False, wait_for_revealed_execution = True, blocks_for_revealed_execution = 3)

   Submits an encrypted extrinsic to the MEV Shield pallet.

   This function encrypts a call using ML-KEM-768 + XChaCha20Poly1305 and submits it to the MevShield pallet. The
   extrinsic remains encrypted in the transaction pool until it is included in a block and decrypted by validators.

   :param subtensor: The Subtensor client instance used for blockchain interaction.
   :param wallet: The wallet used to sign the extrinsic (must be unlocked, coldkey will be used for signing).
   :param call: The GenericCall object to encrypt and submit.
   :param sign_with: The keypair to use for signing the inner call/extrinsic. Can be either "coldkey" or "hotkey".
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the executed event, indicating that validators have
                                       successfully decrypted and executed the inner call. If True, the function will poll subsequent blocks for
                                       the extrinsic matching this submission.
   :param blocks_for_revealed_execution: Maximum number of blocks to poll for the executed event after inclusion.
                                         The function checks blocks from start_block to start_block + blocks_for_revealed_execution. Returns
                                         immediately if the event is found before the block limit is reached.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   :raises ValueError: If NextKey is not available in storage or encryption fails.
   :raises SubstrateRequestException: If the extrinsic fails to be submitted or included.

   .. note::

      The encryption uses the public key from NextKey storage, which rotates every block. The ciphertext wire format
      is: [key_hash(16)][u16 kem_len LE][kem_ct][nonce24][aead_ct], where key_hash = twox_128(NextKey).


.. py:function:: wait_for_extrinsic_by_hash(subtensor, extrinsic_hash, submit_block_hash, timeout_blocks = 3)

   Wait for the result of a MeV Shield encrypted extrinsic.

   After submit_encrypted succeeds, the block author will decrypt and submit the inner extrinsic directly. This
   function polls subsequent blocks looking for an extrinsic matching the provided hash.

   :param subtensor: SubtensorInterface instance.
   :param extrinsic_hash: The hash of the inner extrinsic to find.
   :param submit_block_hash: Block hash where submit_encrypted was included.
   :param timeout_blocks: Max blocks to wait.

   :returns: Optional ExtrinsicReceipt.


