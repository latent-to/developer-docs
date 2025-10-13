bittensor.utils.liquidity
=========================

.. py:module:: bittensor.utils.liquidity

.. autoapi-nested-parse::

   This module provides utilities for managing liquidity positions and price conversions in the Bittensor network. The
   module handles conversions between TAO and Alpha tokens while maintaining precise calculations for liquidity
   provisioning and fee distribution.



Attributes
----------

.. autoapisummary::

   bittensor.utils.liquidity.MAX_TICK
   bittensor.utils.liquidity.MIN_TICK
   bittensor.utils.liquidity.PRICE_STEP


Classes
-------

.. autoapisummary::

   bittensor.utils.liquidity.LiquidityPosition


Functions
---------

.. autoapisummary::

   bittensor.utils.liquidity.calculate_fees
   bittensor.utils.liquidity.get_fees
   bittensor.utils.liquidity.get_fees_in_range
   bittensor.utils.liquidity.price_to_tick
   bittensor.utils.liquidity.tick_to_price


Module Contents
---------------

.. py:class:: LiquidityPosition

   .. py:attribute:: fees_alpha
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: fees_tao
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: id
      :type:  int


   .. py:attribute:: liquidity
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: netuid
      :type:  int


   .. py:attribute:: price_high
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: price_low
      :type:  bittensor.utils.balance.Balance


   .. py:method:: to_token_amounts(current_subnet_price)

      Convert a position to token amounts.

      :param current_subnet_price: current subnet price in Alpha.

      :returns:     Amount of Alpha in liquidity
                    Amount of TAO in liquidity
      :rtype: tuple[int, int]

      Liquidity is a combination of TAO and Alpha depending on the price of the subnet at the moment.



.. py:data:: MAX_TICK
   :value: 887272


.. py:data:: MIN_TICK
   :value: -887272


.. py:data:: PRICE_STEP
   :value: 1.0001


.. py:function:: calculate_fees(position, global_fees_tao, global_fees_alpha, tao_fees_below_low, tao_fees_above_high, alpha_fees_below_low, alpha_fees_above_high, netuid)

.. py:function:: get_fees(current_tick, tick, tick_index, quote, global_fees_tao, global_fees_alpha, above)

   Returns the liquidity fee.


.. py:function:: get_fees_in_range(quote, global_fees_tao, global_fees_alpha, fees_below_low, fees_above_high)

   Returns the liquidity fee value in a range.


.. py:function:: price_to_tick(price)

   Converts a float price to the nearest Uniswap V3 tick index.


.. py:function:: tick_to_price(tick)

   Convert an integer Uniswap V3 tick index to float price.


