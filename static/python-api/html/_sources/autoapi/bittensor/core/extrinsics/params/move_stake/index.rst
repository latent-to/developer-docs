bittensor.core.extrinsics.params.move_stake
===========================================

.. py:module:: bittensor.core.extrinsics.params.move_stake


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.params.move_stake.MoveStakeParams


Module Contents
---------------

.. py:class:: MoveStakeParams

   .. py:method:: move_stake(origin_netuid, origin_hotkey_ss58, destination_netuid, destination_hotkey_ss58, amount)
      :classmethod:


      Returns the parameters for the `move_stake`.



   .. py:method:: swap_stake(hotkey_ss58, origin_netuid, destination_netuid, amount)
      :classmethod:


      Returns the parameters for the `swap_stake`.



   .. py:method:: swap_stake_limit(hotkey_ss58, origin_netuid, destination_netuid, amount, allow_partial_stake, rate_tolerance, origin_pool, destination_pool)
      :classmethod:


      Returns the parameters for the `swap_stake_limit`.



   .. py:method:: transfer_stake(destination_coldkey_ss58, hotkey_ss58, origin_netuid, destination_netuid, amount)
      :classmethod:


      Returns the parameters for the `transfer_stake`.



