bittensor.core.chain_data.stake_info
====================================

.. py:module:: bittensor.core.chain_data.stake_info


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.stake_info.StakeInfo


Module Contents
---------------

.. py:class:: StakeInfo

   Bases: :py:obj:`bittensor.core.chain_data.info_base.InfoBase`


   Dataclass for representing stake information linked to hotkey and coldkey pairs.

   :ivar hotkey_ss58: The SS58 encoded hotkey address.
   :ivar coldkey_ss58: The SS58 encoded coldkey address.
   :ivar stake: The stake associated with the hotkey-coldkey pair, represented as a Balance object.



   .. py:attribute:: coldkey_ss58
      :type:  str


   .. py:attribute:: drain
      :type:  int


   .. py:attribute:: emission
      :type:  bittensor.utils.balance.Balance


   .. py:method:: from_dict(decoded)
      :classmethod:


      Returns a StakeInfo object from decoded chain data.



   .. py:attribute:: hotkey_ss58
      :type:  str


   .. py:attribute:: is_registered
      :type:  bool


   .. py:attribute:: locked
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: netuid
      :type:  int


   .. py:attribute:: stake
      :type:  bittensor.utils.balance.Balance


