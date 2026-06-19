bittensor.extras.timelock
=========================

.. py:module:: bittensor.extras.timelock

.. autoapi-nested-parse::

   This module provides functionality for TimeLock Encryption (TLE), a mechanism that encrypts data such that it can
   only be decrypted after a specific amount of time (expressed in the form  of Drand rounds). It includes functions
   for encryption, decryption, and handling the decryption process by waiting for the reveal round. The logic is based on
   Drand QuickNet.

   Main Functions:
       - encrypt: Encrypts data and returns the encrypted data along with the reveal round.
       - decrypt: Decrypts the provided encrypted data when the reveal round is reached.
       - wait_reveal_and_decrypt: Waits for the reveal round and decrypts the encrypted data.

   .. admonition:: Example

      ```python
      from bittensor import timelock
      data = "From Cortex to Bittensor"
      encrypted_data, reveal_round = timelock.encrypt(data, n_blocks=5)
      decrypted_data = timelock.wait_reveal_and_decrypt(encrypted_data)
      ```

   Example with custom data:
       ```python
       import pickle
       from dataclasses import dataclass

       from bittensor import timelock


       @dataclass
       class Person:
           name: str
           age: int

       # get instance of your data
       x_person = Person("X Lynch", 123)

       # get bytes of your instance
       byte_data = pickle.dumps(x_person)

       # get TLE encoded bytes
       encrypted, reveal_round = timelock.encrypt(byte_data, 1)

       # wait when reveal round appears in Drand QuickNet and get decrypted data
       decrypted = timelock.wait_reveal_and_decrypt(encrypted_data=encrypted)

       # convert bytes into your instance back
       x_person_2 = pickle.loads(decrypted)

       # make sure initial and decoded instances are the same
       assert x_person == x_person_2
       ```

   Note:
   For handling fast-block nodes, set the `block_time` parameter to 0.25 seconds during encryption.



Functions
---------

.. autoapisummary::

   bittensor.extras.timelock.decrypt
   bittensor.extras.timelock.encrypt
   bittensor.extras.timelock.wait_reveal_and_decrypt


Module Contents
---------------

.. py:function:: decrypt(encrypted_data, no_errors = True, return_str = False)

   Decrypts encrypted data using TimeLock Decryption

   :param encrypted_data: Encrypted data to be decrypted.
   :param no_errors: If True, no errors will be raised during decryption.
   :param return_str: convert decrypted data to string if `True`.

   :returns: Decrypted data, when reveled round is reached.
   :rtype: decrypted_data

   Usage:
       # default usage
       decrypted_data = decrypt(encrypted_data)

       # passing no_errors=False for raising errors during decryption
       decrypted_data = decrypt(encrypted_data, no_errors=False)

       # passing return_str=True for returning decrypted data as string
       decrypted_data = decrypt(encrypted_data, return_str=True)


.. py:function:: encrypt(data, n_blocks, block_time = 12.0)

   Encrypts data using TimeLock Encryption

   :param data: Any bytes data to be encrypted.
   :param n_blocks: Number of blocks to encrypt.
   :param block_time: Time in seconds for each block.

   :returns: A tuple containing the encrypted data and reveal TimeLock reveal round.
   :rtype: tuple

   :raises PyValueError: If failed to encrypt data.

   Usage:
       data = "From Cortex to Bittensor"

       # default usage
       encrypted_data, reveal_round = encrypt(data, 10)

       # passing block_time for fast-blocks node
       encrypted_data, reveal_round = encrypt(data, 15, block_time=0.25)

       encrypted_data, reveal_round = encrypt(data, 5)


   .. note::

      For using this function with fast-blocks node you need to set block_time to 0.25 seconds.
      data, round = encrypt(data, n_blocks, block_time=0.25)


.. py:function:: wait_reveal_and_decrypt(encrypted_data, reveal_round = None, no_errors = True, return_str = False)

   Waits for reveal round and decrypts data using TimeLock Decryption.

   :param encrypted_data: Encrypted data to be decrypted.
   :param reveal_round: Reveal round to wait for. If None, will be parsed from encrypted data.
   :param no_errors: If True, no errors will be raised during decryption.
   :param return_str: convert decrypted data to string if `True`.

   :raises struct.error: If failed to parse reveal round from encrypted data.
   :raises TypeError: If reveal_round is None or wrong type.
   :raises IndexError: If provided encrypted_data does not contain reveal round.

   :returns: Decrypted data.
   :rtype: bytes

   Usage:
       import bittensor as bt
       encrypted, reveal_round = bt.timelock.encrypt("Cortex is power", 3)


