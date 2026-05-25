bittensor.core.chain_data.neuron_info
=====================================

.. py:module:: bittensor.core.chain_data.neuron_info


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.neuron_info.NeuronInfo


Module Contents
---------------

.. py:class:: NeuronInfo

   Bases: :py:obj:`bittensor.core.chain_data.info_base.InfoBase`


   Represents the metadata of a neuron including keys, UID, stake, rankings, and other attributes.

   :ivar hotkey: The hotkey associated with the neuron.
   :ivar coldkey: The coldkey associated with the neuron.
   :ivar uid: The unique identifier for the neuron.
   :ivar netuid: The network unique identifier for the neuron.
   :ivar active: The active status of the neuron.
   :ivar stake: The balance staked to this neuron.
   :ivar stake_dict: A dictionary mapping coldkey to the amount staked.
   :ivar total_stake: The total amount of stake.
   :ivar emission: The emission rate.
   :ivar incentive: The incentive value.
   :ivar consensus: The consensus score.
   :ivar validator_trust: The validation trust score.
   :ivar dividends: The dividends value.
   :ivar last_update: The timestamp of the last update.
   :ivar validator_permit: Validator permit status.
   :ivar weights: List of weights associated with the neuron.
   :ivar bonds: List of bonds associated with the neuron.
   :ivar prometheus_info: Information related to Prometheus.
   :ivar axon_info: Information related to Axon.
   :ivar is_null: Indicator if this is a null neuron.



   .. py:attribute:: active
      :type:  int


   .. py:attribute:: axon_info
      :type:  Optional[bittensor.core.chain_data.axon_info.AxonInfo]
      :value: None



   .. py:attribute:: bonds
      :type:  list[list[int]]


   .. py:attribute:: coldkey
      :type:  str


   .. py:attribute:: consensus
      :type:  float


   .. py:attribute:: dividends
      :type:  float


   .. py:attribute:: emission
      :type:  float


   .. py:method:: from_weights_bonds_and_neuron_lite(neuron_lite, weights_as_dict, bonds_as_dict)
      :classmethod:


      Creates an instance of NeuronInfo from NeuronInfoLite and dictionaries of weights and bonds.

      :param neuron_lite: A lite version of the neuron containing basic attributes.
      :param weights_as_dict: A dictionary where the key is the UID and the value is a list of weight tuples associated
                              with the neuron.
      :param bonds_as_dict: A dictionary where the key is the UID and the value is a list of bond tuples associated with
                            the neuron.

      :returns: An instance of NeuronInfo populated with the provided weights and bonds.



   .. py:method:: get_null_neuron()
      :staticmethod:


      Returns a null NeuronInfo instance.



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
      :value: None



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


   .. py:attribute:: weights
      :type:  list[tuple[int, int]]


