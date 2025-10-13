bittensor.core.extrinsics.params.liquidity
==========================================

.. py:module:: bittensor.core.extrinsics.params.liquidity


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.params.liquidity.LiquidityParams


Module Contents
---------------

.. py:class:: LiquidityParams

   .. py:method:: add_liquidity(netuid, hotkey_ss58, liquidity, price_low, price_high)
      :classmethod:


      Returns the parameters for the `add_liquidity`.



   .. py:method:: modify_position(netuid, hotkey_ss58, position_id, liquidity_delta)
      :classmethod:


      Returns the parameters for the `modify_position`.



   .. py:method:: remove_liquidity(netuid, hotkey_ss58, position_id)
      :classmethod:


      Returns the parameters for the `remove_liquidity`.



   .. py:method:: toggle_user_liquidity(netuid, enable)
      :classmethod:


      Returns the parameters for the `toggle_user_liquidity`.



