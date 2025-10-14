bittensor.core.extrinsics.unstaking
===================================

.. py:module:: bittensor.core.extrinsics.unstaking


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.unstaking.unstake_all_extrinsic
   bittensor.core.extrinsics.unstaking.unstake_extrinsic
   bittensor.core.extrinsics.unstaking.unstake_multiple_extrinsic


Module Contents
---------------

.. py:function:: unstake_all_extrinsic(subtensor, wallet, hotkey, netuid, rate_tolerance = 0.005, wait_for_inclusion = True, wait_for_finalization = False, period = None)

   Unstakes all TAO/Alpha associated with a hotkey from the specified subnets on the Bittensor network.

   :param subtensor: Subtensor instance.
   :param wallet: The wallet of the stake owner.
   :param hotkey: The SS58 address of the hotkey to unstake from.
   :param netuid: The unique identifier of the subnet.
   :param rate_tolerance: The maximum allowed price change ratio when unstaking. For example, 0.005 = 0.5% maximum
                          price decrease. If not passed (None), then unstaking goes without price limit. Default is `0.005`.
   :param wait_for_inclusion: Waits for the transaction to be included in a block. Default is `True`.
   :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain. Default is `False`.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction. Default is `None`.

   :returns:     A tuple containing:
                 - `True` and a success message if the unstake operation succeeded;
                 - `False` and an error message otherwise.
   :rtype: tuple[bool, str]


.. py:function:: unstake_extrinsic(subtensor, wallet, hotkey_ss58 = None, netuid = None, amount = None, wait_for_inclusion = True, wait_for_finalization = False, safe_staking = False, allow_partial_stake = False, rate_tolerance = 0.005, period = None, unstake_all = False)

   Removes stake into the wallet coldkey from the specified hotkey ``uid``.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor wallet object.
   :param hotkey_ss58: The ``ss58`` address of the hotkey to unstake from. By default, the wallet hotkey is used.
   :param netuid: Subnet unique id.
   :param amount: Amount to stake as Bittensor balance.
   :param wait_for_inclusion: If set, waits for the extrinsic to enter a block before returning ``True``, or returns
                              ``False`` if the extrinsic fails to enter the block within the timeout.
   :param wait_for_finalization: If set, waits for the extrinsic to be finalized on the chain before returning ``True``,
                                 or returns ``False`` if the extrinsic fails to be finalized within the timeout.
   :param safe_staking: If true, enables price safety checks.
   :param allow_partial_stake: If true, allows partial unstaking if price tolerance exceeded
   :param rate_tolerance: Maximum allowed price decrease percentage (0.005 = 0.5%)
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param unstake_all: If true, unstakes all tokens. Default is ``False``.

   :returns:     A tuple containing:
                 - `True` and a success message if the unstake operation succeeded;
                 - `False` and an error message otherwise.
   :rtype: tuple[bool, str]


.. py:function:: unstake_multiple_extrinsic(subtensor, wallet, hotkey_ss58s, netuids, amounts = None, wait_for_inclusion = True, wait_for_finalization = False, period = None, unstake_all = False)

   Removes stake from each ``hotkey_ss58`` in the list, using each amount, to a common coldkey.

   :param subtensor: Subtensor instance.
   :param wallet: The wallet with the coldkey to unstake to.
   :param hotkey_ss58s: List of hotkeys to unstake from.
   :param netuids: List of subnets unique IDs to unstake from.
   :param amounts: List of amounts to unstake. If ``None``, unstake all.
   :param wait_for_inclusion: If set, waits for the extrinsic to enter a block before returning ``True``, or
                              returns ``False`` if the extrinsic fails to enter the block within the timeout.
   :param wait_for_finalization: If set, waits for the extrinsic to be finalized on the chain before returning ``True``,
                                 or returns ``False`` if the extrinsic fails to be finalized within the timeout.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param unstake_all: If true, unstakes all tokens. Default is ``False``.

   :returns:     A tuple containing:
                 - `True` and a success message if the unstake operation succeeded;
                 - `False` and an error message otherwise.
   :rtype: tuple[bool, str]


