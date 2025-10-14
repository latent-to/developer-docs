bittensor.utils
===============

.. py:module:: bittensor.utils


Submodules
----------

.. toctree::
   :maxdepth: 1

   /autoapi/bittensor/utils/axon_utils/index
   /autoapi/bittensor/utils/balance/index
   /autoapi/bittensor/utils/btlogging/index
   /autoapi/bittensor/utils/easy_imports/index
   /autoapi/bittensor/utils/formatting/index
   /autoapi/bittensor/utils/liquidity/index
   /autoapi/bittensor/utils/networking/index
   /autoapi/bittensor/utils/registration/index
   /autoapi/bittensor/utils/subnets/index
   /autoapi/bittensor/utils/substrate_utils/index
   /autoapi/bittensor/utils/version/index
   /autoapi/bittensor/utils/weight_utils/index


Attributes
----------

.. autoapisummary::

   bittensor.utils.BT_DOCS_LINK
   bittensor.utils.GLOBAL_MAX_SUBNET_COUNT
   bittensor.utils.RAOPERTAO
   bittensor.utils.U16_MAX
   bittensor.utils.U64_MAX
   bittensor.utils.VersionCheckError
   bittensor.utils.check_version
   bittensor.utils.hex_to_bytes
   bittensor.utils.logging
   bittensor.utils.ss58_decode
   bittensor.utils.torch
   bittensor.utils.use_torch
   bittensor.utils.version_checking


Classes
-------

.. autoapisummary::

   bittensor.utils.Certificate
   bittensor.utils.UnlockStatus


Functions
---------

.. autoapisummary::

   bittensor.utils.decode_hex_identity_dict
   bittensor.utils.deprecated_message
   bittensor.utils.determine_chain_endpoint_and_network
   bittensor.utils.float_to_u64
   bittensor.utils.format_error_message
   bittensor.utils.get_explorer_url_for_network
   bittensor.utils.get_hash
   bittensor.utils.get_mechid_storage_index
   bittensor.utils.get_netuid_and_mechid_by_storage_index
   bittensor.utils.get_transfer_fn_params
   bittensor.utils.is_valid_bittensor_address_or_public_key
   bittensor.utils.is_valid_ss58_address
   bittensor.utils.ss58_address_to_bytes
   bittensor.utils.ss58_to_vec_u8
   bittensor.utils.strtobool
   bittensor.utils.u16_normalized_float
   bittensor.utils.u64_normalized_float
   bittensor.utils.unlock_key
   bittensor.utils.validate_chain_endpoint


Package Contents
----------------

.. py:data:: BT_DOCS_LINK
   :value: 'https://docs.bittensor.com'


.. py:class:: Certificate

   Bases: :py:obj:`str`


   str(object='') -> str
   str(bytes_or_buffer[, encoding[, errors]]) -> str

   Create a new string object from the given object. If encoding or
   errors is specified, then the object must expose a data buffer
   that will be decoded using the given encoding and error handler.
   Otherwise, returns the result of object.__str__() (if defined)
   or repr(object).
   encoding defaults to sys.getdefaultencoding().
   errors defaults to 'strict'.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:data:: GLOBAL_MAX_SUBNET_COUNT
   :value: 4096


.. py:data:: RAOPERTAO
   :value: 1000000000.0


.. py:data:: U16_MAX
   :value: 65535


.. py:data:: U64_MAX
   :value: 18446744073709551615


.. py:class:: UnlockStatus

   Bases: :py:obj:`tuple`


   .. py:attribute:: message


   .. py:attribute:: success


.. py:data:: VersionCheckError

.. py:data:: check_version

.. py:function:: decode_hex_identity_dict(info_dictionary)

   Decodes a dictionary of hexadecimal identities.


.. py:function:: deprecated_message(message)

   Shows a deprecation warning message with the given message.


.. py:function:: determine_chain_endpoint_and_network(network)

   Determines the chain endpoint and network from the passed network or chain_endpoint.

   :param network: The network flag. The choices are: ``finney`` (main network), ``archive`` (archive network
                   +300 blocks), ``local`` (local running network), ``test`` (test network).
   :type network: str

   :returns:

             The network and chain endpoint flag. If passed, overrides the
                 ``network`` argument.
   :rtype: tuple[Optional[str], Optional[str]]


.. py:function:: float_to_u64(value)

   Converts a float to a u64 int


.. py:function:: format_error_message(error_message)

   Formats an error message from the Subtensor error information for use in extrinsics.

   :param error_message: A dictionary containing the error information from Subtensor, or a SubstrateRequestException
                         containing dictionary literal args.

   :returns: A formatted error message string.
   :rtype: str


.. py:function:: get_explorer_url_for_network(network, block_hash, network_map)

   Returns the explorer url for the given block hash and network.

   :param network: The network to get the explorer url for.
   :type network: str
   :param block_hash: The block hash to get the explorer url for.
   :type block_hash: str
   :param network_map: The network maps to get the explorer urls from.
   :type network_map: dict[str, dict[str, str]]

   :returns: The explorer url for the given block hash and network.
             Or None if the network is not known.


.. py:function:: get_hash(content, encoding='utf-8')

.. py:function:: get_mechid_storage_index(netuid, mechid)

   Computes the storage index for a given netuid and mechid pair.

   :param netuid: The netuid of the subnet.
   :param mechid: The mechid of the subnet.

   :returns: Storage index number for the subnet and mechanism id.


.. py:function:: get_netuid_and_mechid_by_storage_index(storage_index)

   Returns the netuid and mechid from the storage index.

   Chain APIs (e.g., SubMetagraph response) returns netuid which is storage index that encodes both the netuid and
   mechid. This function reverses the encoding to extract these components.

   :param storage_index: The storage index of the subnet.

   :returns:     - netuid - subnet identifier.
                 - mechid - mechanism identifier.
   :rtype: tuple[int, int]


.. py:function:: get_transfer_fn_params(amount, destination, keep_alive)

   Helper function to get the transfer call function and call params, depending on the value and keep_alive flag
       provided

   :param amount: the amount of Tao to transfer. `None` if transferring all.
   :param destination: the destination SS58 of the transfer
   :param keep_alive: whether to enforce a retention of the existential deposit in the account after transfer.

   :returns: tuple[call function, call params]


.. py:data:: hex_to_bytes

.. py:function:: is_valid_bittensor_address_or_public_key(address)

   Checks if the given address is a valid destination address.

   :param address: The address to check.
   :type address: Union[str, bytes]

   :returns: True if the address is a valid destination address, False otherwise.


.. py:function:: is_valid_ss58_address(address)

   Checks if the given address is a valid ss58 address.

   :param address: The address to check.
   :type address: str

   :returns: True if the address is a valid ss58 address for Bittensor, False otherwise.


.. py:data:: logging

.. py:function:: ss58_address_to_bytes(ss58_address)

   Converts a ss58 address to a bytes object.


.. py:data:: ss58_decode

.. py:function:: ss58_to_vec_u8(ss58_address)

.. py:function:: strtobool(val)

   Converts a string to a boolean value.

   truth-y values are 'y', 'yes', 't', 'true', 'on', and '1';
   false-y values are 'n', 'no', 'f', 'false', 'off', and '0'.

   Raises ValueError if 'val' is anything else.


.. py:data:: torch

.. py:function:: u16_normalized_float(x)

.. py:function:: u64_normalized_float(x)

.. py:function:: unlock_key(wallet, unlock_type='coldkey', raise_error=False)

   Attempts to decrypt a wallet's coldkey or hotkey

   :param wallet: a Wallet object
   :param unlock_type: the key type, 'coldkey' or 'hotkey'
   :param raise_error: if False, will return (False, error msg), if True will raise the otherwise-caught exception.

   :returns: UnlockStatus for success status of unlock, with error message if unsuccessful

   :raises bittensor_wallet.errors.PasswordError: incorrect password
   :raises bittensor_wallet.errors.KeyFileError: keyfile is corrupt, non-writable, or non-readable, or non-existent


.. py:data:: use_torch

.. py:function:: validate_chain_endpoint(endpoint_url)

   Validates if the provided endpoint URL is a valid WebSocket URL.


.. py:data:: version_checking

