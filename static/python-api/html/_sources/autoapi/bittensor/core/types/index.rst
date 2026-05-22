bittensor.core.types
====================

.. py:module:: bittensor.core.types


Attributes
----------

.. autoapisummary::

   bittensor.core.types.Salt
   bittensor.core.types.UIDs
   bittensor.core.types.Weights


Classes
-------

.. autoapisummary::

   bittensor.core.types.AxonServeCallParams
   bittensor.core.types.BlockInfo
   bittensor.core.types.CommitmentOfResponse
   bittensor.core.types.CrowdloansResponse
   bittensor.core.types.DynamicInfoResponse
   bittensor.core.types.ExtrinsicResponse
   bittensor.core.types.NeuronCertificateResponse
   bittensor.core.types.PositionResponse
   bittensor.core.types.PrometheusServeCallParams
   bittensor.core.types.SubnetIdentityResponse
   bittensor.core.types.SubtensorMixin


Module Contents
---------------

.. py:class:: AxonServeCallParams(version, ip, port, ip_type, netuid, hotkey, coldkey, protocol, placeholder1, placeholder2, certificate)

   .. py:method:: as_dict()

      Returns a dict representation of this object. If `self.certificate` is `None`, it is not included in this.



   .. py:attribute:: certificate


   .. py:attribute:: coldkey


   .. py:method:: copy()


   .. py:attribute:: hotkey


   .. py:attribute:: ip


   .. py:attribute:: ip_type


   .. py:attribute:: netuid


   .. py:attribute:: placeholder1


   .. py:attribute:: placeholder2


   .. py:attribute:: port


   .. py:attribute:: protocol


   .. py:attribute:: version


.. py:class:: BlockInfo

   Class that holds information about a blockchain block.

   This class encapsulates all relevant information about a block in the blockchain, including its number, hash,
   timestamp, and contents.

   :ivar number: The block number.
   :ivar hash: The corresponding block hash.
   :ivar timestamp: The timestamp of the block (based on the `Timestamp.Now` extrinsic).
   :ivar header: The raw block header returned by the node RPC.
   :ivar extrinsics: The list of extrinsics included in the block.
   :ivar explorer: The link to block explorer service.



   .. py:attribute:: explorer
      :type:  str


   .. py:attribute:: extrinsics
      :type:  list


   .. py:attribute:: hash
      :type:  str


   .. py:attribute:: header
      :type:  dict


   .. py:attribute:: number
      :type:  int


   .. py:attribute:: timestamp
      :type:  Optional[int]


.. py:class:: CommitmentOfResponse

   Bases: :py:obj:`TypedDict`


   dict() -> new empty dictionary
   dict(mapping) -> new dictionary initialized from a mapping object's
       (key, value) pairs
   dict(iterable) -> new dictionary initialized as if via:
       d = {}
       for k, v in iterable:
           d[k] = v
   dict(**kwargs) -> new dictionary initialized with the name=value pairs
       in the keyword argument list.  For example:  dict(one=1, two=2)

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: block
      :type:  int


   .. py:attribute:: deposit
      :type:  int


   .. py:attribute:: info
      :type:  _CommitmentFields


.. py:class:: CrowdloansResponse

   Bases: :py:obj:`TypedDict`


   dict() -> new empty dictionary
   dict(mapping) -> new dictionary initialized from a mapping object's
       (key, value) pairs
   dict(iterable) -> new dictionary initialized as if via:
       d = {}
       for k, v in iterable:
           d[k] = v
   dict(**kwargs) -> new dictionary initialized with the name=value pairs
       in the keyword argument list.  For example:  dict(one=1, two=2)

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: call
      :type:  Optional[dict]


   .. py:attribute:: cap
      :type:  int


   .. py:attribute:: contributors_count
      :type:  int


   .. py:attribute:: creator
      :type:  str


   .. py:attribute:: deposit
      :type:  int


   .. py:attribute:: end
      :type:  int


   .. py:attribute:: finalized
      :type:  bool


   .. py:attribute:: funds_account
      :type:  str


   .. py:attribute:: min_contribution
      :type:  int


   .. py:attribute:: raised
      :type:  int


   .. py:attribute:: target_address
      :type:  str


.. py:class:: DynamicInfoResponse

   Bases: :py:obj:`TypedDict`


   dict() -> new empty dictionary
   dict(mapping) -> new dictionary initialized from a mapping object's
       (key, value) pairs
   dict(iterable) -> new dictionary initialized as if via:
       d = {}
       for k, v in iterable:
           d[k] = v
   dict(**kwargs) -> new dictionary initialized with the name=value pairs
       in the keyword argument list.  For example:  dict(one=1, two=2)

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: alpha_in
      :type:  int


   .. py:attribute:: alpha_in_emission
      :type:  int


   .. py:attribute:: alpha_out
      :type:  int


   .. py:attribute:: alpha_out_emission
      :type:  int


   .. py:attribute:: blocks_since_last_step
      :type:  int


   .. py:attribute:: emission
      :type:  int


   .. py:attribute:: last_step
      :type:  int


   .. py:attribute:: moving_price
      :type:  scalecodec.utils.math.FixedPoint


   .. py:attribute:: netuid
      :type:  int


   .. py:attribute:: network_registered_at
      :type:  int


   .. py:attribute:: owner_coldkey
      :type:  str


   .. py:attribute:: owner_hotkey
      :type:  str


   .. py:attribute:: pending_alpha_emission
      :type:  int


   .. py:attribute:: pending_root_emission
      :type:  int


   .. py:attribute:: price
      :type:  NotRequired[bittensor.utils.balance.Balance]


   .. py:attribute:: subnet_identity
      :type:  SubnetIdentityResponse


   .. py:attribute:: subnet_name
      :type:  list[int]


   .. py:attribute:: subnet_volume
      :type:  int


   .. py:attribute:: tao_in
      :type:  int


   .. py:attribute:: tao_in_emission
      :type:  int


   .. py:attribute:: tempo
      :type:  int


   .. py:attribute:: token_symbol
      :type:  list[int]


.. py:class:: ExtrinsicResponse

   A standardized response container for handling the extrinsic results submissions and related operations in the SDK.

   This class is designed to give developers a consistent way to represent the outcome of an extrinsic call — whether
   it succeeded or failed — along with useful metadata for debugging, logging, or higher-level business logic.

   The object also implements tuple-like behavior:
     * Iteration yields ``(success, message)``.
     * Indexing is supported: ``response[0] -> success``, ``response[1] -> message``.
     * ``len(response)`` returns 2.

   :ivar success: Indicates if the extrinsic execution was successful.
   :ivar message: A status or informational message returned from the execution (e.g., "Successfully registered subnet").
   :ivar extrinsic_function: The SDK extrinsic or external function name that was executed (e.g., "add_stake_extrinsic").
   :ivar extrinsic: The raw extrinsic object used in the call, if available. This is a ``GenericExtrinsic`` instance
                    containing the full payload and metadata of the submitted extrinsic, including call section, method, signer,
                    signature, parameters, and encoded bytes. Useful for inspecting or reconstructing the exact transaction
                    submitted to the chain.
   :ivar extrinsic_fee: The fee charged by the extrinsic, if available.
   :ivar extrinsic_receipt: The receipt object of the submitted extrinsic. This is an ``ExtrinsicReceipt`` instance that
                            contains the most detailed execution data available, including the block number and hash, triggered events,
                            extrinsic index, execution phase, and other low-level details. This allows deep debugging or post-analysis
                            of on-chain execution.
   :ivar mev_extrinsic: The extrinsic object of the revealed (decrypted and executed) MEV Shield extrinsic. This is
                        populated when using MEV Shield protection (``with_mev_protection=True``) and contains the execution details
                        of the second extrinsic that decrypts and executes the originally encrypted call. Contains triggered events,
                        block information, and other execution metadata. Set to ``None`` for non-MEV Shield transactions or when the
                        revealed extrinsic receipt is not available.
   :ivar transaction_tao_fee: TAO fee charged by the transaction in TAO (e.g., fee for add_stake), if available.
   :ivar transaction_alpha_fee: Alpha fee charged by the transaction (e.g., fee for transfer_stake), if available.
   :ivar error: Captures the underlying exception if the extrinsic failed, otherwise `None`.
   :ivar data: Arbitrary data returned from the extrinsic, such as decoded events, balance or another extra context.


   Instance methods:
       as_dict: Returns a dictionary representation of this object.
       with_log: Returns itself but with logging message.

   Class methods:
       from_exception: Checks if error is raised or return ExtrinsicResponse accordingly.
       unlock_wallet: Checks if keypair is unlocked and can be used for signing the extrinsic.


   .. admonition:: Example

      import bittensor as bt
      
      subtensor = bt.SubtensorApi("local")
      wallet = bt.Wallet("alice")
      
      response = subtensor.subnets.register_subnet(alice_wallet)
      print(response)
      
      ExtrinsicResponse:
          success: True
          message: Successfully registered subnet
          extrinsic_function: register_subnet_extrinsic
          extrinsic: {'account_id': '0xd43593c715fdd31c...
          transaction_fee: τ1.0
          extrinsic_receipt: Extrinsic Receipt data of of the submitted extrinsic
          mev_extrinsic: None
          transaction_tao_fee: τ1.0
          transaction_alpha_fee: 1.0β
          error: None
          data: None
      
      success, message = response
      print(success, message)
      
      True Successfully registered subnet
      
      print(response[0])
      True
      print(response[1])
      'Successfully registered subnet'


   .. py:method:: as_dict()

      Represents this object as a dictionary.



   .. py:attribute:: data
      :type:  Optional[Any]
      :value: None



   .. py:attribute:: error
      :type:  Optional[Exception]
      :value: None



   .. py:attribute:: extrinsic
      :type:  Optional[scalecodec.types.GenericExtrinsic]
      :value: None



   .. py:attribute:: extrinsic_fee
      :type:  Optional[bittensor.utils.balance.Balance]
      :value: None



   .. py:attribute:: extrinsic_function
      :type:  Optional[str]
      :value: None



   .. py:attribute:: extrinsic_receipt
      :type:  Optional[AsyncExtrinsicReceipt | ExtrinsicReceipt]
      :value: None



   .. py:method:: from_exception(raise_error, error)
      :classmethod:


      Check if error is raised and return ExtrinsicResponse accordingly.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param error: Exception raised during extrinsic execution.

      :returns: Extrinsic Response with False checks whether to raise an error or simply return the instance.



   .. py:attribute:: message
      :type:  Optional[str]
      :value: None



   .. py:attribute:: mev_extrinsic
      :type:  Optional[AsyncExtrinsicReceipt | ExtrinsicReceipt]
      :value: None



   .. py:attribute:: success
      :type:  bool
      :value: True



   .. py:attribute:: transaction_alpha_fee
      :type:  Optional[bittensor.utils.balance.Balance]
      :value: None



   .. py:attribute:: transaction_tao_fee
      :type:  Optional[bittensor.utils.balance.Balance]
      :value: None



   .. py:method:: unlock_wallet(wallet, raise_error = False, unlock_type = 'coldkey', nonce_key = None)
      :classmethod:


      Check if keypair is unlocked and return ExtrinsicResponse accordingly.

      :param wallet: Bittensor Wallet instance.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param unlock_type: The key type, 'coldkey' or 'hotkey'. Or 'both' to check both.
      :param nonce_key: Key used for generating nonce in extrinsic function.

      :returns: Extrinsic Response is used to check if the key is unlocked.

      .. note::

         When an extrinsic is signed with the coldkey but internally references or uses the hotkey, both keypairs
         must be validated. Passing unlock_type='both' ensures that authentication is performed against both the
         coldkey and hotkey.



   .. py:method:: with_log(level = 'error')

      Logs provided message with provided level.

      :param level: Logging level represented as "trace", "debug", "info", "warning", "error", "success" uses to logging
                    message.

      :returns: ExtrinsicResponse instance.



.. py:class:: NeuronCertificateResponse

   Bases: :py:obj:`TypedDict`


   dict() -> new empty dictionary
   dict(mapping) -> new dictionary initialized from a mapping object's
       (key, value) pairs
   dict(iterable) -> new dictionary initialized as if via:
       d = {}
       for k, v in iterable:
           d[k] = v
   dict(**kwargs) -> new dictionary initialized with the name=value pairs
       in the keyword argument list.  For example:  dict(one=1, two=2)

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: algorithm
      :type:  int


   .. py:attribute:: public_key
      :type:  str


.. py:class:: PositionResponse

   Bases: :py:obj:`TypedDict`


   dict() -> new empty dictionary
   dict(mapping) -> new dictionary initialized from a mapping object's
       (key, value) pairs
   dict(iterable) -> new dictionary initialized as if via:
       d = {}
       for k, v in iterable:
           d[k] = v
   dict(**kwargs) -> new dictionary initialized with the name=value pairs
       in the keyword argument list.  For example:  dict(one=1, two=2)

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: fees_alpha
      :type:  scalecodec.utils.math.FixedPoint


   .. py:attribute:: fees_tao
      :type:  scalecodec.utils.math.FixedPoint


   .. py:attribute:: id
      :type:  int


   .. py:attribute:: liquidity
      :type:  int


   .. py:attribute:: netuid
      :type:  int


   .. py:attribute:: tick_high
      :type:  int


   .. py:attribute:: tick_low
      :type:  int


.. py:class:: PrometheusServeCallParams

   Bases: :py:obj:`TypedDict`


   Prometheus serve chain call parameters.

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: ip
      :type:  int


   .. py:attribute:: ip_type
      :type:  int


   .. py:attribute:: netuid
      :type:  int


   .. py:attribute:: port
      :type:  int


   .. py:attribute:: version
      :type:  int


.. py:data:: Salt

.. py:class:: SubnetIdentityResponse

   Bases: :py:obj:`TypedDict`


   dict() -> new empty dictionary
   dict(mapping) -> new dictionary initialized from a mapping object's
       (key, value) pairs
   dict(iterable) -> new dictionary initialized as if via:
       d = {}
       for k, v in iterable:
           d[k] = v
   dict(**kwargs) -> new dictionary initialized with the name=value pairs
       in the keyword argument list.  For example:  dict(one=1, two=2)

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: additional
      :type:  str


   .. py:attribute:: description
      :type:  str


   .. py:attribute:: discord
      :type:  str


   .. py:attribute:: github_repo
      :type:  str


   .. py:attribute:: logo_url
      :type:  str


   .. py:attribute:: subnet_contact
      :type:  str


   .. py:attribute:: subnet_name
      :type:  str


   .. py:attribute:: subnet_url
      :type:  str


.. py:class:: SubtensorMixin

   Bases: :py:obj:`abc.ABC`


   Helper class that provides a standard way to create an ABC using
   inheritance.


   .. py:method:: add_args(parser, prefix = None)
      :classmethod:


      Adds command-line arguments to the provided ArgumentParser for configuring the Subtensor settings.

      :param parser: The ArgumentParser object to which the Subtensor arguments will be added.
      :param prefix: An optional prefix for the argument names. If provided, the prefix is prepended to each argument name.

      Arguments added:
          --subtensor.network: The Subtensor network flag. Possible values are 'finney', 'test', 'archive', and
              'local'. Overrides the chain endpoint if set.
          --subtensor.chain_endpoint: The Subtensor chain endpoint flag. If set, it overrides the network flag.
          --subtensor._mock: If true, uses a mocked connection to the chain.

      .. admonition:: Example

         parser = argparse.ArgumentParser()
         Subtensor.add_args(parser)



   .. py:attribute:: chain_endpoint
      :type:  str


   .. py:method:: config()
      :staticmethod:


      Creates and returns a Bittensor configuration object.

      :returns: A Bittensor configuration object configured with arguments added by the `subtensor.add_args` method.



   .. py:method:: help()
      :classmethod:


      Print help to stdout.



   .. py:attribute:: log_verbose
      :type:  bool


   .. py:attribute:: network
      :type:  str


   .. py:method:: setup_config(network, config)
      :staticmethod:


      Sets up and returns the configuration for the Subtensor network and endpoint.

      This method determines the appropriate network and chain endpoint based on the provided network string or
          configuration object. It evaluates the network and endpoint in the following order of precedence:
          1. Provided network string.
          2. Configured chain endpoint in the `config` object.
          3. Configured network in the `config` object.
          4. Default chain endpoint.
          5. Default network.

      :param network: The name of the Subtensor network. If None, the network and endpoint will be determined from the
                      `config` object.
      :param config: The configuration object containing the network and chain endpoint settings.

      :returns: A tuple containing the formatted WebSocket endpoint URL and the evaluated network name.
      :rtype: tuple



.. py:data:: UIDs

.. py:data:: Weights

