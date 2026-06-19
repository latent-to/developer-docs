bittensor.core.chain_data.neuron_info_lite
==========================================

.. py:module:: bittensor.core.chain_data.neuron_info_lite


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.neuron_info_lite.NeuronInfoLite


Module Contents
---------------

.. py:class:: NeuronInfoLite

   Bases: :py:obj:`bittensor.core.chain_data.info_base.InfoBase`


   NeuronInfoLite is a dataclass representing neuron metadata without weights and bonds.

   :ivar hotkey: The hotkey string for the neuron.
   :ivar coldkey: The coldkey string for the neuron.
   :ivar uid: A unique identifier for the neuron.
   :ivar netuid: Network unique identifier for the neuron.
   :ivar active: Indicates whether the neuron is active.
   :ivar stake: The stake amount associated with the neuron.
   :ivar stake_dict: Mapping of coldkey to the amount staked to this Neuron.
   :ivar total_stake: Total amount of the stake.
   :ivar emission: The emission value of the neuron.
   :ivar incentive: The incentive value of the neuron.
   :ivar consensus: The consensus value of the neuron.
   :ivar validator_trust: Validator trust value of the neuron.
   :ivar dividends: Dividends associated with the neuron.
   :ivar last_update: Timestamp of the last update.
   :ivar validator_permit: Indicates if the neuron has a validator permit.
   :ivar prometheus_info: Prometheus information associated with the neuron.
   :ivar axon_info: Axon information associated with the neuron.
   :ivar is_null: Indicates whether the neuron is null.


   .. method:: get_null_neuron

      Returns a NeuronInfoLite object representing a null neuron.

   .. method:: list_from_vec_u8

      Decodes a bytes object into a list of NeuronInfoLite instances.
      


   .. py:attribute:: active
      :type:  int


   .. py:attribute:: axon_info
      :type:  Optional[bittensor.core.chain_data.axon_info.AxonInfo]


   .. py:attribute:: coldkey
      :type:  str


   .. py:attribute:: consensus
      :type:  float


   .. py:attribute:: dividends
      :type:  float


   .. py:attribute:: emission
      :type:  float


   .. py:method:: get_null_neuron()
      :staticmethod:


      Returns a null NeuronInfoLite instance.



   .. py:attribute:: hotkey
      :type:  str


   .. py:attribute:: incentive
      :type:  float


   .. py:attribute:: is_null
      :type:  bool
      :value: False



   .. py:attribute:: last_update
      :type:  int


   .. py:attribute:: netuid
      :type:  int


   .. py:attribute:: prometheus_info
      :type:  Optional[bittensor.core.chain_data.prometheus_info.PrometheusInfo]


   .. py:attribute:: stake
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: stake_dict
      :type:  dict[str, bittensor.utils.balance.Balance]


   .. py:attribute:: total_stake
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: uid
      :type:  int


   .. py:attribute:: validator_permit
      :type:  bool


   .. py:attribute:: validator_trust
      :type:  float


