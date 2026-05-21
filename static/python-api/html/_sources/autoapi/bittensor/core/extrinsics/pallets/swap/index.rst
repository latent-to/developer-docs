bittensor.core.extrinsics.pallets.swap
======================================

.. py:module:: bittensor.core.extrinsics.pallets.swap


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.swap.Swap


Module Contents
---------------

.. py:class:: Swap

   Bases: :py:obj:`bittensor.core.extrinsics.pallets.base.CallBuilder`


   Factory class for creating GenericCall objects for Swap pallet functions.

   This class provides methods to create GenericCall instances for all Swap pallet extrinsics.

   Works with both sync (Subtensor) and async (AsyncSubtensor) instances. For async operations, pass an AsyncSubtensor
   instance and await the result.

   .. admonition:: Example

      # Sync usage
      call = Swap(subtensor).toggle_user_liquidity(netuid=14, enable=True)
      response = subtensor.sign_and_send_extrinsic(call=call, ...)
      
      # Async usage
      call = await Swap(subtensor).toggle_user_liquidity(netuid=14, enable=True)
      response = await async_subtensor.sign_and_send_extrinsic(call=call, ...)


   .. py:method:: add_liquidity(netuid, liquidity, tick_low, tick_high, hotkey = None)

      Returns GenericCall instance for Subtensor function Swap.add_liquidity.

      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param liquidity: The amount of liquidity in RAO to be added.
      :param tick_low: The lower bound of the price tick range.
      :param tick_high: The upper bound of the price tick range.
      :param hotkey: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used.

      :returns: GenericCall instance.



   .. py:method:: modify_position(netuid, hotkey, position_id, liquidity_delta)

      Returns GenericCall instance for Subtensor function Swap.modify_position.

      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param hotkey: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used.
      :param position_id: The id of the position record in the pool.
      :param liquidity_delta: The amount of liquidity in RAO to be added or removed (could be positive or negative).

      :returns: GenericCall instance.



   .. py:method:: remove_liquidity(netuid, hotkey, position_id)

      Returns GenericCall instance for Subtensor function Swap.remove_liquidity.

      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param position_id: The id of the position record in the pool.
      :param hotkey: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used.

      :returns: GenericCall instance.



   .. py:method:: toggle_user_liquidity(netuid, enable)

      Returns GenericCall instance for Subtensor function Swap.toggle_user_liquidity.

      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param enable: Boolean indicating whether to enable user liquidity.

      :returns: GenericCall instance.



