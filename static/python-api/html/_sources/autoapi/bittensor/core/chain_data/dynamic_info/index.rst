bittensor.core.chain_data.dynamic_info
======================================

.. py:module:: bittensor.core.chain_data.dynamic_info

.. autoapi-nested-parse::

   This module defines the `DynamicInfo` data class and associated methods for handling and decoding
   dynamic information in the Bittensor network.



Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.dynamic_info.DynamicInfo


Module Contents
---------------

.. py:class:: DynamicInfo

   Bases: :py:obj:`bittensor.core.chain_data.info_base.InfoBase`


   Base dataclass for info objects.


   .. py:attribute:: alpha_in
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: alpha_in_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: alpha_out
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: alpha_out_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: alpha_slippage


   .. py:method:: alpha_to_tao(alpha)


   .. py:method:: alpha_to_tao_with_slippage(alpha, percentage = False)

      Returns an estimate of how much TAO would a staker receive if they unstake their alpha using the current pool state.

      :param alpha: Amount of Alpha to stake.
      :param percentage: percentage

      :returns: If percentage is False, a tuple of balances where the first part is the amount of TAO received, and the
                second part (slippage) is the difference between the estimated amount and ideal
                amount as if there was no slippage. If percentage is True, a float representing the slippage percentage.



   .. py:attribute:: blocks_since_last_step
      :type:  int


   .. py:attribute:: emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: is_dynamic
      :type:  bool


   .. py:attribute:: k
      :type:  float


   .. py:attribute:: last_step
      :type:  int


   .. py:attribute:: moving_price
      :type:  float


   .. py:attribute:: netuid
      :type:  int


   .. py:attribute:: network_registered_at
      :type:  int


   .. py:attribute:: owner_coldkey
      :type:  str


   .. py:attribute:: owner_hotkey
      :type:  str


   .. py:attribute:: pending_alpha_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: pending_root_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: price
      :type:  Optional[bittensor.utils.balance.Balance]


   .. py:attribute:: slippage


   .. py:attribute:: subnet_identity
      :type:  Optional[bittensor.core.chain_data.subnet_identity.SubnetIdentity]


   .. py:attribute:: subnet_name
      :type:  str


   .. py:attribute:: subnet_volume
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: symbol
      :type:  str


   .. py:attribute:: tao_in
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: tao_in_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: tao_slippage


   .. py:method:: tao_to_alpha(tao)


   .. py:method:: tao_to_alpha_with_slippage(tao, percentage = False)

      Returns an estimate of how much Alpha would a staker receive if they stake their tao using the current pool state.

      :param tao: Amount of TAO to stake.
      :param percentage: percentage

      :returns: If percentage is False, a tuple of balances where the first part is the amount of Alpha received, and the
                second part (slippage) is the difference between the estimated amount and ideal
                amount as if there was no slippage. If percentage is True, a float representing the slippage percentage.



   .. py:attribute:: tempo
      :type:  int


