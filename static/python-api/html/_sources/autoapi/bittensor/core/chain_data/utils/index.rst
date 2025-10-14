bittensor.core.chain_data.utils
===============================

.. py:module:: bittensor.core.chain_data.utils

.. autoapi-nested-parse::

   Chain data helper functions and data.



Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.utils.ChainDataType


Functions
---------

.. autoapisummary::

   bittensor.core.chain_data.utils.decode_account_id
   bittensor.core.chain_data.utils.decode_block
   bittensor.core.chain_data.utils.decode_metadata
   bittensor.core.chain_data.utils.decode_revealed_commitment
   bittensor.core.chain_data.utils.decode_revealed_commitment_with_hotkey
   bittensor.core.chain_data.utils.from_scale_encoding
   bittensor.core.chain_data.utils.from_scale_encoding_using_type_string
   bittensor.core.chain_data.utils.process_stake_data


Module Contents
---------------

.. py:class:: ChainDataType

   Bases: :py:obj:`enum.Enum`


   Generic enumeration.

   Derive from this class to define new enumerations.


   .. py:attribute:: AccountId
      :value: 10



   .. py:attribute:: AxonInfo
      :value: 16



   .. py:attribute:: ChainIdentity
      :value: 15



   .. py:attribute:: DelegateInfo
      :value: 3



   .. py:attribute:: DelegatedInfo
      :value: 5



   .. py:attribute:: DynamicInfo
      :value: 12



   .. py:attribute:: IPInfo
      :value: 7



   .. py:attribute:: MetagraphInfo
      :value: 14



   .. py:attribute:: NeuronInfo
      :value: 1



   .. py:attribute:: NeuronInfoLite
      :value: 4



   .. py:attribute:: ScheduledColdkeySwapInfo
      :value: 9



   .. py:attribute:: StakeInfo
      :value: 6



   .. py:attribute:: SubnetHyperparameters
      :value: 8



   .. py:attribute:: SubnetIdentity
      :value: 13



   .. py:attribute:: SubnetInfo
      :value: 2



   .. py:attribute:: SubnetState
      :value: 11



.. py:function:: decode_account_id(account_id_bytes)

   Decodes an AccountId from bytes to a Base64 string using SS58 encoding.

   :param account_id_bytes: The AccountId in bytes that needs to be decoded.
   :type account_id_bytes: bytes

   :returns: The decoded AccountId as a Base64 string.
   :rtype: str


.. py:function:: decode_block(data)

   Decode the block data from the given input if it is not None.

   :param data: The block data to decode.
   :type data: bytes

   :returns: The decoded block.
   :rtype: int


.. py:function:: decode_metadata(metadata)

.. py:function:: decode_revealed_commitment(encoded_data)

   Decode the revealed commitment data from the given input if it is not None.

   :param encoded_data: A tuple containing the revealed message and the block number.
   :type encoded_data: tuple[bytes, int]

   :returns: A tuple containing the revealed block number and decoded commitment message.
   :rtype: tuple[int, str]


.. py:function:: decode_revealed_commitment_with_hotkey(encoded_data)

   Decode revealed commitment using a hotkey.

   :returns:

             A tuple containing the hotkey (ss58 address) and a tuple of block
                 numbers and their corresponding revealed commitments.
   :rtype: tuple[str, tuple[tuple[int, str], ...]]


.. py:function:: from_scale_encoding(input_, type_name, is_vec = False, is_option = False)

   Decodes input_ data from SCALE encoding based on the specified type name and modifiers.

   :param input_: The input_ data to decode.
   :type input_: Union[List[int], bytes, ScaleBytes]
   :param type_name: The type of data being decoded.
   :type type_name: ChainDataType
   :param is_vec: Whether the data is a vector of the specified type. Default is ``False``.
   :type is_vec: bool
   :param is_option: Whether the data is an optional value of the specified type. Default is ``False``.
   :type is_option: bool

   :returns: The decoded data as a dictionary, or ``None`` if the decoding fails.
   :rtype: Optional[dict]


.. py:function:: from_scale_encoding_using_type_string(input_, type_string)

   Decodes SCALE encoded data to a dictionary based on the provided type string.

   :param input_: The SCALE encoded input data.
   :type input_: Union[List[int], bytes, ScaleBytes]
   :param type_string: The type string defining the structure of the data.
   :type type_string: str

   :returns: The decoded data as a dictionary, or ``None`` if the decoding fails.
   :rtype: Optional[dict]

   :raises TypeError: If the input_ is not a list[int], bytes, or ScaleBytes.


.. py:function:: process_stake_data(stake_data)

   Processes stake data to decode account IDs and convert stakes from rao to Balance objects.

   :param stake_data: A list of tuples where each tuple contains an account ID in bytes and a stake in rao.
   :type stake_data: list

   :returns: A dictionary with account IDs as keys and their corresponding Balance objects as values.
   :rtype: dict


