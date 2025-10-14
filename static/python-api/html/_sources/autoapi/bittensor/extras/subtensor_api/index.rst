bittensor.extras.subtensor_api
==============================

.. py:module:: bittensor.extras.subtensor_api


Submodules
----------

.. toctree::
   :maxdepth: 1

   /autoapi/bittensor/extras/subtensor_api/chain/index
   /autoapi/bittensor/extras/subtensor_api/commitments/index
   /autoapi/bittensor/extras/subtensor_api/delegates/index
   /autoapi/bittensor/extras/subtensor_api/extrinsics/index
   /autoapi/bittensor/extras/subtensor_api/metagraphs/index
   /autoapi/bittensor/extras/subtensor_api/neurons/index
   /autoapi/bittensor/extras/subtensor_api/queries/index
   /autoapi/bittensor/extras/subtensor_api/staking/index
   /autoapi/bittensor/extras/subtensor_api/subnets/index
   /autoapi/bittensor/extras/subtensor_api/utils/index
   /autoapi/bittensor/extras/subtensor_api/wallets/index


Classes
-------

.. autoapisummary::

   bittensor.extras.subtensor_api.SubtensorApi


Package Contents
----------------

.. py:class:: SubtensorApi(network = None, config = None, async_subtensor = False, legacy_methods = False, fallback_endpoints = None, retry_forever = False, log_verbose = False, mock = False, archive_endpoints = None, websocket_shutdown_timer = 5.0)

   Subtensor API class.

   :param network: The network to connect to.
   :param config: Bittensor configuration object.
   :param legacy_methods: If `True`, all methods from the Subtensor class will be added to the root level of this class.
   :param fallback_endpoints: List of fallback endpoints to use if default or provided network is not available.
   :param retry_forever: Whether to retry forever on connection errors.
   :param log_verbose: Enables or disables verbose logging.
   :param mock: Whether this is a mock instance. Mainly just for use in testing.
   :param archive_endpoints: Similar to fallback_endpoints, but specifically only archive nodes. Will be used in cases
                             where you are requesting a block that is too old for your current (presumably lite) node.
   :param websocket_shutdown_timer: Amount of time, in seconds, to wait after the last response from the chain to close
                                    the connection. Only applicable to AsyncSubtensor. If `None` is passed to this, the automatic shutdown
                                    process is disabled.

   .. admonition:: Example

      # sync version
      import bittensor as bt
      
      subtensor = bt.SubtensorApi()
      print(subtensor.block)
      print(subtensor.delegates.get_delegate_identities())
      subtensor.chain.tx_rate_limit()
      
      # async version
      import bittensor as bt
      
      subtensor = bt.SubtensorApi(async_subtensor=True)
      async with subtensor:
          print(await subtensor.block)
          print(await subtensor.delegates.get_delegate_identities())
          print(await subtensor.chain.tx_rate_limit())
      
      # using `legacy_methods`
      import bittensor as bt
      
      subtensor = bt.SubtensorApi(legacy_methods=True)
      print(subtensor.bonds(0))
      
      # using `fallback_endpoints` or `retry_forever`
      import bittensor as bt
      
      subtensor = bt.SubtensorApi(
          network="finney",
          fallback_endpoints=["wss://localhost:9945", "wss://some-other-endpoint:9945"],
          retry_forever=True,
      )
      print(subtensor.block)


   .. py:method:: add_args(parser)
      :classmethod:



   .. py:property:: block

      Returns current chain block number.


   .. py:property:: chain

      Property of interaction with chain methods.


   .. py:attribute:: chain_endpoint
      :value: None



   .. py:attribute:: close


   .. py:property:: commitments

      Property to access commitments methods.


   .. py:attribute:: compose_call


   .. py:attribute:: config


   .. py:property:: delegates

      Property to access delegates methods.


   .. py:attribute:: determine_block_hash


   .. py:attribute:: encode_params


   .. py:property:: extrinsics

      Property to access extrinsics methods.


   .. py:attribute:: help


   .. py:attribute:: initialize
      :value: None



   .. py:attribute:: inner_subtensor


   .. py:attribute:: is_async
      :value: False



   .. py:attribute:: log_verbose
      :value: False



   .. py:property:: metagraphs

      Property to access metagraphs methods.


   .. py:attribute:: network
      :value: None



   .. py:property:: neurons

      Property to access neurons methods.


   .. py:property:: queries

      Property to access subtensor queries methods.


   .. py:attribute:: setup_config


   .. py:attribute:: sign_and_send_extrinsic


   .. py:property:: staking

      Property to access staking methods.


   .. py:attribute:: start_call


   .. py:property:: subnets

      Property of interaction with subnets methods.


   .. py:attribute:: substrate


   .. py:attribute:: wait_for_block


   .. py:property:: wallets

      Property of interaction methods with cold/hotkeys, and balances, etc.


