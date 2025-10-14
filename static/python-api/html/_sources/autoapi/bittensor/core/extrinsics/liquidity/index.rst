bittensor.core.extrinsics.liquidity
===================================

.. py:module:: bittensor.core.extrinsics.liquidity


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.liquidity.add_liquidity_extrinsic
   bittensor.core.extrinsics.liquidity.modify_liquidity_extrinsic
   bittensor.core.extrinsics.liquidity.remove_liquidity_extrinsic
   bittensor.core.extrinsics.liquidity.toggle_user_liquidity_extrinsic


Module Contents
---------------

.. py:function:: add_liquidity_extrinsic(subtensor, wallet, netuid, liquidity, price_low, price_high, hotkey = None, wait_for_inclusion = True, wait_for_finalization = False, period = None)

   Adds liquidity to the specified price range.

   :param subtensor: The Subtensor client instance used for blockchain interaction.
   :param wallet: The wallet used to sign the extrinsic (must be unlocked).
   :param netuid: The UID of the target subnet for which the call is being initiated.
   :param liquidity: The amount of liquidity to be added.
   :param price_low: The lower bound of the price tick range.
   :param price_high: The upper bound of the price tick range.
   :param hotkey: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used. Defaults to `None`.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block. Defaults to True.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic. Defaults to False.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.

   :returns:     - True and a success message if the extrinsic is successfully submitted or processed.
                 - False and an error message if the submission fails or the wallet cannot be unlocked.
   :rtype: Tuple[bool, str]

   Note: Adding is allowed even when user liquidity is enabled in specified subnet. Call
       `toggle_user_liquidity_extrinsic` to enable/disable user liquidity.


.. py:function:: modify_liquidity_extrinsic(subtensor, wallet, netuid, position_id, liquidity_delta, hotkey = None, wait_for_inclusion = True, wait_for_finalization = False, period = None)

   Modifies liquidity in liquidity position by adding or removing liquidity from it.

   :param subtensor: The Subtensor client instance used for blockchain interaction.
   :param wallet: The wallet used to sign the extrinsic (must be unlocked).
   :param netuid: The UID of the target subnet for which the call is being initiated.
   :param position_id: The id of the position record in the pool.
   :param liquidity_delta: The amount of liquidity to be added or removed (add if positive or remove if negative).
   :param hotkey: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used. Defaults to `None`.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block. Defaults to True.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic. Defaults to False.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.

   :returns:     - True and a success message if the extrinsic is successfully submitted or processed.
                 - False and an error message if the submission fails or the wallet cannot be unlocked.
   :rtype: Tuple[bool, str]

   Note: Modifying is allowed even when user liquidity is enabled in specified subnet. Call
       `toggle_user_liquidity_extrinsic` to enable/disable user liquidity.


.. py:function:: remove_liquidity_extrinsic(subtensor, wallet, netuid, position_id, hotkey = None, wait_for_inclusion = True, wait_for_finalization = False, period = None)

   Remove liquidity and credit balances back to wallet's hotkey stake.

   :param subtensor: The Subtensor client instance used for blockchain interaction.
   :param wallet: The wallet used to sign the extrinsic (must be unlocked).
   :param netuid: The UID of the target subnet for which the call is being initiated.
   :param position_id: The id of the position record in the pool.
   :param hotkey: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used. Defaults to `None`.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block. Defaults to True.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic. Defaults to False.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.

   :returns:     - True and a success message if the extrinsic is successfully submitted or processed.
                 - False and an error message if the submission fails or the wallet cannot be unlocked.
   :rtype: Tuple[bool, str]

   Note: Adding is allowed even when user liquidity is enabled in specified subnet.
       Call `toggle_user_liquidity_extrinsic` to enable/disable user liquidity.


.. py:function:: toggle_user_liquidity_extrinsic(subtensor, wallet, netuid, enable, wait_for_inclusion = True, wait_for_finalization = False, period = None)

   Allow to toggle user liquidity for specified subnet.

   :param subtensor: The Subtensor client instance used for blockchain interaction.
   :param wallet: The wallet used to sign the extrinsic (must be unlocked).
   :param netuid: The UID of the target subnet for which the call is being initiated.
   :param enable: Boolean indicating whether to enable user liquidity.
   :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block. Defaults to True.
   :param wait_for_finalization: Whether to wait for finalization of the extrinsic. Defaults to False.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.

   :returns:     - True and a success message if the extrinsic is successfully submitted or processed.
                 - False and an error message if the submission fails or the wallet cannot be unlocked.
   :rtype: Tuple[bool, str]


