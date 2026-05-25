bittensor.core.chain_data.subnet_state
======================================

.. py:module:: bittensor.core.chain_data.subnet_state

.. autoapi-nested-parse::

   This module defines the `SubnetState` data class and associated methods for handling and decoding subnetwork states in
   the Bittensor network.



Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.subnet_state.SubnetState


Module Contents
---------------

.. py:class:: SubnetState

   Bases: :py:obj:`bittensor.core.chain_data.info_base.InfoBase`


   .. py:attribute:: active
      :type:  list[bool]


   .. py:attribute:: alpha_stake
      :type:  list[bittensor.utils.balance.Balance]


   .. py:attribute:: block_at_registration
      :type:  list[int]


   .. py:attribute:: coldkeys
      :type:  list[str]


   .. py:attribute:: consensus
      :type:  list[float]


   .. py:attribute:: dividends
      :type:  list[float]


   .. py:attribute:: emission
      :type:  list[bittensor.utils.balance.Balance]


   .. py:attribute:: emission_history
      :type:  list[list[int]]


   .. py:attribute:: hotkeys
      :type:  list[str]


   .. py:attribute:: incentives
      :type:  list[float]


   .. py:attribute:: last_update
      :type:  list[int]


   .. py:attribute:: netuid
      :type:  int


   .. py:attribute:: pruning_score
      :type:  list[float]


   .. py:attribute:: rank
      :type:  list[float]


   .. py:attribute:: tao_stake
      :type:  list[bittensor.utils.balance.Balance]


   .. py:attribute:: total_stake
      :type:  list[bittensor.utils.balance.Balance]


   .. py:attribute:: trust
      :type:  list[float]


   .. py:attribute:: validator_permit
      :type:  list[bool]


