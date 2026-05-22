bittensor.core.extrinsics.pallets.mev_shield
============================================

.. py:module:: bittensor.core.extrinsics.pallets.mev_shield


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.mev_shield.MevShield


Module Contents
---------------

.. py:class:: MevShield

   Bases: :py:obj:`bittensor.core.extrinsics.pallets.base.CallBuilder`


   Factory class for creating GenericCall objects for MevShield pallet functions.

   This class provides methods to create GenericCall instances for all MevShield pallet extrinsics.

   Works with both sync (Subtensor) and async (AsyncSubtensor) instances. For async operations, pass an AsyncSubtensor
   instance and await the result.

   .. admonition:: Example

      # Sync usage
      call = MevShield(subtensor).submit_encrypted(
          ciphertext=b"encrypted_data..."
      )
      response = subtensor.sign_and_send_extrinsic(call=call, ...)
      
      # Async usage
      call = await MevShield(async_subtensor).submit_encrypted(
          ciphertext=b"encrypted_data..."
      )
      response = await async_subtensor.sign_and_send_extrinsic(call=call, ...)


   .. py:method:: submit_encrypted(ciphertext)

      Returns GenericCall instance for MevShield function submit_encrypted.

      This function submits an encrypted extrinsic to the MEV Shield pallet. The extrinsic remains encrypted in the
      transaction pool until it is included in a block and decrypted by validators.

      :param ciphertext: The encrypted blob containing the payload and signature.
                         Format: [key_hash(16)][u16 kem_len LE][kem_ct][nonce24][aead_ct]
                         Maximum size: 8192 bytes.

      :returns: GenericCall instance ready for extrinsic submission.

      .. note::

         The ciphertext is encrypted using ML-KEM-768 + XChaCha20Poly1305 with the public key from the NextKey
         storage item, which rotates every block. The key_hash prefix (twox_128 of the public key) is validated
         on-chain by CheckShieldedTxValidity.



