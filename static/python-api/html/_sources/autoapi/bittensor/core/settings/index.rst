bittensor.core.settings
=======================

.. py:module:: bittensor.core.settings


Attributes
----------

.. autoapisummary::

   bittensor.core.settings.ARCHIVE_ENTRYPOINT
   bittensor.core.settings.BLOCKTIME
   bittensor.core.settings.DEFAULT_ENDPOINT
   bittensor.core.settings.DEFAULT_MEV_PROTECTION
   bittensor.core.settings.DEFAULT_NETWORK
   bittensor.core.settings.DEFAULT_PERIOD
   bittensor.core.settings.FINNEY_ENTRYPOINT
   bittensor.core.settings.FINNEY_TEST_ENTRYPOINT
   bittensor.core.settings.HOME_DIR
   bittensor.core.settings.LATENT_LITE_ENTRYPOINT
   bittensor.core.settings.LOCAL_ENTRYPOINT
   bittensor.core.settings.MAX_MEV_SHIELD_PERIOD
   bittensor.core.settings.MINERS_DIR
   bittensor.core.settings.MLKEM768_PUBLIC_KEY_SIZE
   bittensor.core.settings.NETWORKS
   bittensor.core.settings.NETWORK_EXPLORER_MAP
   bittensor.core.settings.NETWORK_MAP
   bittensor.core.settings.PIPADDRESS
   bittensor.core.settings.RAO_SYMBOL
   bittensor.core.settings.READ_ONLY
   bittensor.core.settings.REVERSE_NETWORK_MAP
   bittensor.core.settings.ROOT_TAO_STAKE_WEIGHT
   bittensor.core.settings.SS58_ADDRESS_LENGTH
   bittensor.core.settings.TAO_APP_BLOCK_EXPLORER
   bittensor.core.settings.TAO_SYMBOL
   bittensor.core.settings.TYPE_REGISTRY
   bittensor.core.settings.USER_BITTENSOR_DIR
   bittensor.core.settings.WALLETS_DIR
   bittensor.core.settings.version_as_int


Classes
-------

.. autoapisummary::

   bittensor.core.settings.DEFAULTS


Module Contents
---------------

.. py:data:: ARCHIVE_ENTRYPOINT
   :value: 'wss://archive.chain.opentensor.ai:443'


.. py:data:: BLOCKTIME
   :value: 12


.. py:class:: DEFAULTS

   .. py:class:: axon

      .. py:attribute:: external_ip


      .. py:attribute:: external_port


      .. py:attribute:: ip


      .. py:attribute:: max_workers


      .. py:attribute:: port



   .. py:attribute:: config
      :value: False



   .. py:class:: logging

      .. py:attribute:: debug


      .. py:attribute:: enable_third_party_loggers


      .. py:attribute:: info


      .. py:attribute:: logging_dir
         :value: None



      .. py:attribute:: record_log


      .. py:attribute:: trace



   .. py:attribute:: no_version_checking
      :value: False



   .. py:class:: priority

      .. py:attribute:: max_workers


      .. py:attribute:: maxsize



   .. py:attribute:: strict
      :value: False



   .. py:class:: subtensor

      .. py:attribute:: chain_endpoint


      .. py:attribute:: network



   .. py:class:: wallet

      .. py:attribute:: hotkey


      .. py:attribute:: name


      .. py:attribute:: path



.. py:data:: DEFAULT_ENDPOINT
   :value: 'wss://entrypoint-finney.opentensor.ai:443'


.. py:data:: DEFAULT_MEV_PROTECTION

.. py:data:: DEFAULT_NETWORK
   :value: 'finney'


.. py:data:: DEFAULT_PERIOD
   :value: 128


.. py:data:: FINNEY_ENTRYPOINT
   :value: 'wss://entrypoint-finney.opentensor.ai:443'


.. py:data:: FINNEY_TEST_ENTRYPOINT
   :value: 'wss://test.finney.opentensor.ai:443'


.. py:data:: HOME_DIR

.. py:data:: LATENT_LITE_ENTRYPOINT
   :value: 'wss://lite.sub.latent.to:443'


.. py:data:: LOCAL_ENTRYPOINT

.. py:data:: MAX_MEV_SHIELD_PERIOD
   :value: 8


.. py:data:: MINERS_DIR

.. py:data:: MLKEM768_PUBLIC_KEY_SIZE
   :value: 1184


.. py:data:: NETWORKS
   :value: ['finney', 'test', 'archive', 'local', 'latent-lite']


.. py:data:: NETWORK_EXPLORER_MAP

.. py:data:: NETWORK_MAP

.. py:data:: PIPADDRESS
   :value: 'https://pypi.org/pypi/bittensor/json'


.. py:data:: RAO_SYMBOL
   :type:  str

.. py:data:: READ_ONLY

.. py:data:: REVERSE_NETWORK_MAP

.. py:data:: ROOT_TAO_STAKE_WEIGHT
   :value: 0.18


.. py:data:: SS58_ADDRESS_LENGTH
   :value: 48


.. py:data:: TAO_APP_BLOCK_EXPLORER
   :value: 'https://www.tao.app/block/'


.. py:data:: TAO_SYMBOL
   :type:  str

.. py:data:: TYPE_REGISTRY
   :type:  dict[str, dict]

.. py:data:: USER_BITTENSOR_DIR

.. py:data:: WALLETS_DIR

.. py:data:: version_as_int
   :type:  int

