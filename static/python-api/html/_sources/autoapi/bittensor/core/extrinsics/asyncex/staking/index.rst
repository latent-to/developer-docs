bittensor.core.extrinsics.asyncex.staking
=========================================

.. py:module:: bittensor.core.extrinsics.asyncex.staking


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.asyncex.staking.add_stake_extrinsic
   bittensor.core.extrinsics.asyncex.staking.add_stake_multiple_extrinsic


Module Contents
---------------

.. py:function:: add_stake_extrinsic(subtensor, wallet, old_balance = None, hotkey_ss58 = None, netuid = None, amount = None, wait_for_inclusion = True, wait_for_finalization = False, safe_staking = False, allow_partial_stake = False, rate_tolerance = 0.005, period = None)
   :async:


   Adds a stake from the specified wallet to the neuron identified by the SS58 address of its hotkey in specified subnet.
   Staking is a fundamental process in the Bittensor network that enables neurons to participate actively and earn incentives.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object.
   :param old_balance: the balance prior to the staking
   :param hotkey_ss58: The `ss58` address of the hotkey account to stake to default to the wallet's hotkey. If not
                       specified, the wallet's hotkey will be used. Defaults to ``None``.
   :param netuid: The unique identifier of the subnet to which the neuron belongs.
   :param amount: Amount to stake as Bittensor balance in TAO always, `None` if staking all. Defaults is ``None``.
   :param wait_for_inclusion: If set, waits for the extrinsic to enter a block before returning `True`, or returns
                              `False` if the extrinsic fails to enter the block within the timeout.  Defaults to ``True``.
   :param wait_for_finalization: If set, waits for the extrinsic to be finalized on the chain before returning `True`,
                                 or returns `False` if the extrinsic fails to be finalized within the timeout. Defaults to ``False``.
   :param safe_staking: If True, enables price safety checks. Default is ``False``.
   :param allow_partial_stake: If True, allows partial unstaking if price tolerance exceeded. Default is ``False``.
   :param rate_tolerance: Maximum allowed price increase percentage (0.005 = 0.5%). Default is ``0.005``.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction. Defaults to ``None``.

   :returns:

             Flag is `True` if extrinsic was finalized or included in the block. If we did not wait for
                           finalization/inclusion, the response is `True`.
   :rtype: success

   :raises SubstrateRequestException: Raised if the extrinsic fails to be included in the block within the timeout.


.. py:function:: add_stake_multiple_extrinsic(subtensor, wallet, hotkey_ss58s, netuids, old_balance = None, amounts = None, wait_for_inclusion = True, wait_for_finalization = False, period = None)
   :async:


   Adds a stake to each ``hotkey_ss58`` in the list, using each amount, from a common coldkey.

   :param subtensor: The initialized SubtensorInterface object.
   :param wallet: Bittensor wallet object for the coldkey.
   :param old_balance: The balance of the wallet prior to staking.
   :param hotkey_ss58s: List of hotkeys to stake to.
   :param netuids: List of netuids to stake to.
   :param amounts: List of amounts to stake. If `None`, stake all to the first hotkey.
   :param wait_for_inclusion: If set, waits for the extrinsic to enter a block before returning `True`, or returns `False`
                              if the extrinsic fails to enter the block within the timeout.
   :param wait_for_finalization: If set, waits for the extrinsic to be finalized on the chain before returning `True`, or
                                 returns `False` if the extrinsic fails to be finalized within the timeout.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.

   :returns:

             `True` if extrinsic was finalized or included in the block. `True` if any wallet was staked. If we did
                 not wait for finalization/inclusion, the response is `True`.
   :rtype: success


