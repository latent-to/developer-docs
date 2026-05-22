bittensor.core.extrinsics.utils
===============================

.. py:module:: bittensor.core.extrinsics.utils

.. autoapi-nested-parse::

   Module with helper functions for extrinsics.



Attributes
----------

.. autoapisummary::

   bittensor.core.extrinsics.utils.MEV_HOTKEY_USAGE_WARNING


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.utils.apply_pure_proxy_data
   bittensor.core.extrinsics.utils.compute_coldkey_hash
   bittensor.core.extrinsics.utils.get_event_data_by_event_name
   bittensor.core.extrinsics.utils.get_mev_shielded_ciphertext
   bittensor.core.extrinsics.utils.get_old_stakes
   bittensor.core.extrinsics.utils.get_transfer_fn_params
   bittensor.core.extrinsics.utils.resolve_mev_shield_period
   bittensor.core.extrinsics.utils.sudo_call_extrinsic
   bittensor.core.extrinsics.utils.verify_coldkey_hash


Module Contents
---------------

.. py:data:: MEV_HOTKEY_USAGE_WARNING
   :value: 'MeV Shield cannot be used with hotkey-signed extrinsics. The transaction will fail because the...


.. py:function:: apply_pure_proxy_data(response, triggered_events, block_number, extrinsic_idx, raise_error)

   Apply pure proxy data to the response object.

   :param response: The response object to update.
   :param triggered_events: The triggered events of the transaction.
   :param block_number: The block number of the transaction.
   :param extrinsic_idx: The index of the extrinsic in the transaction.
   :param raise_error: Whether to raise an error if the data cannot be applied successfully.

   :returns: True if the data was applied successfully, False otherwise.


.. py:function:: compute_coldkey_hash(keypair)

   Computes BlakeTwo256 hash of a coldkey AccountId.

   This function extracts the AccountId (32-byte public key) from an SS58 address and computes its BlakeTwo256 hash.
   The hash is used in coldkey swap announcements to verify the new coldkey address when executing the swap.

   :param keypair: keypair for getting hash.

   :returns: Hex string with 0x prefix representing the BlakeTwo256 hash of the AccountId.

   .. admonition:: Notes

      - The hash is computed from the AccountId (public key bytes), not from the SS58 string.
      - This matches the hash computation used in the Subtensor runtime.
      - See: <https://docs.learnbittensor.org/keys/coldkey-swap>


.. py:function:: get_event_data_by_event_name(events, event_name)

   Extracts event data from triggered events by event ID.

   Searches through a list of triggered events and returns the attributes dictionary for the first event matching the
   specified event_id.

   :param events: List of event dictionaries, typically from ExtrinsicReceipt.triggered_events. Each event should have an
                  "module_id". "event_id" key and an "attributes" key.
   :param event_name: The events identifier to search for (e.g. "mevShield.EncryptedSubmitted", etc).

   :returns: The attributes dictionary of the matching event, or None if no matching event is found.


.. py:function:: get_mev_shielded_ciphertext(signed_ext, ml_kem_768_public_key)

   Encrypts a signed extrinsic for MEV Shield submission.

   This function extracts the raw extrinsic bytes and encrypts them using ML-KEM-768 + XChaCha20Poly1305 with the
   twox_128 key hash prepended for on-chain validation.

   :param signed_ext: The signed GenericExtrinsic object representing the inner call to be encrypted and executed.
   :param ml_kem_768_public_key: The ML-KEM-768 public key bytes (1184 bytes) from NextKey storage.

   :returns: [key_hash(16)][u16 kem_len LE][kem_ct][nonce24][aead_ct]
   :rtype: The encrypted ciphertext bytes in wire format


.. py:function:: get_old_stakes(wallet, hotkey_ss58s, netuids, all_stakes)

   Retrieve the previous staking balances for a wallet's hotkeys across given netuids.

   This function searches through the provided staking data to find the stake amounts for the specified hotkeys and
   netuids associated with the wallet's coldkey. If no match is found for a particular hotkey and netuid combination,
   a default balance of zero is returned.

   :param wallet: The wallet containing the coldkey to compare with stake data.
   :param hotkey_ss58s: List of hotkey SS58 addresses for which stakes are retrieved.
   :param netuids: List of network unique identifiers (netuids) corresponding to the hotkeys.
   :param all_stakes: A collection of all staking information to search through.

   :returns: A list of Balances, each representing the stake for a given hotkey and netuid.


.. py:function:: get_transfer_fn_params(amount, destination_ss58, keep_alive)

   Helper function to get the transfer call function and call params, depending on the value and keep_alive flag
   provided.

   :param amount: the amount of Tao to transfer. `None` if transferring all.
   :param destination_ss58: the destination SS58 of the transfer
   :param keep_alive: whether to enforce a retention of the existential deposit in the account after transfer.

   :returns: tuple[call function, call params]


.. py:function:: resolve_mev_shield_period(period)

   Return effective era period for MEV Shield extrinsics.

   MEV Shield extrinsics must use a short-lived era. If period is omitted or
   exceeds the MEV limit, the maximum allowed MEV period is applied.

   :param period: The period to resolve.

   :returns: The effective period (in blocks).


.. py:function:: sudo_call_extrinsic(subtensor, wallet, call_function, call_params, call_module = 'AdminUtils', sign_with = 'coldkey', use_nonce = False, nonce_key = 'hotkey', *, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, root_call = False)

   Execute a sudo call extrinsic.

   :param subtensor: The Subtensor instance.
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
   :param root_call: False, if the subnet owner makes a call.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: verify_coldkey_hash(keypair, expected_hash)

   Verifies that a coldkey SS58 address matches the expected BlakeTwo256 hash.

   This function computes the hash of the coldkey AccountId and compares it with the expected hash. Used to verify that
   the new coldkey address in a swap announcement matches the announced hash.

   :param keypair: keypair whose hash needs to be verified.
   :param expected_hash: Expected BlakeTwo256 hash (hex string with 0x prefix).

   :returns: True if the computed hash matches the expected hash, False otherwise.

   .. admonition:: Notes

      - Both hashes are compared in lowercase to handle case differences.
      - See: <https://docs.learnbittensor.org/keys/coldkey-swap>


