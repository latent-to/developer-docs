bittensor.core.extrinsics.move_stake
====================================

.. py:module:: bittensor.core.extrinsics.move_stake


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.move_stake.move_stake_extrinsic
   bittensor.core.extrinsics.move_stake.swap_stake_extrinsic
   bittensor.core.extrinsics.move_stake.transfer_stake_extrinsic


Module Contents
---------------

.. py:function:: move_stake_extrinsic(subtensor, wallet, origin_hotkey, origin_netuid, destination_hotkey, destination_netuid, amount = None, wait_for_inclusion = True, wait_for_finalization = False, period = None, move_all_stake = False)

   Moves stake to a different hotkey and/or subnet while keeping the same coldkey owner.

   :param subtensor: Subtensor instance.
   :param wallet: The wallet to move stake from.
   :param origin_hotkey: The SS58 address of the source hotkey.
   :param origin_netuid: The netuid of the source subnet.
   :param destination_hotkey: The SS58 address of the destination hotkey.
   :param destination_netuid: The netuid of the destination subnet.
   :param amount: Amount to move.
   :param wait_for_inclusion: If true, waits for inclusion before returning.
   :param wait_for_finalization: If true, waits for finalization before returning.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param move_all_stake: If true, moves all stake from the source hotkey to the destination hotkey.

   :returns: True if the move was successful. Otherwise, False.
   :rtype: success


.. py:function:: swap_stake_extrinsic(subtensor, wallet, hotkey_ss58, origin_netuid, destination_netuid, amount = None, wait_for_inclusion = True, wait_for_finalization = False, safe_staking = False, allow_partial_stake = False, rate_tolerance = 0.005, period = None)

   Moves stake between subnets while keeping the same coldkey-hotkey pair ownership.

   :param subtensor: Subtensor instance.
   :type subtensor: Subtensor
   :param wallet: The wallet to swap stake from.
   :type wallet: bittensor.wallet
   :param hotkey_ss58: The hotkey SS58 address associated with the stake.
   :type hotkey_ss58: str
   :param origin_netuid: The source subnet UID.
   :type origin_netuid: int
   :param destination_netuid: The destination subnet UID.
   :type destination_netuid: int
   :param amount: Amount to swap.
   :type amount: Union[Balance, float]
   :param wait_for_inclusion: If true, waits for inclusion before returning.
   :type wait_for_inclusion: bool
   :param wait_for_finalization: If true, waits for finalization before returning.
   :type wait_for_finalization: bool
   :param safe_staking: If true, enables price safety checks to protect against price impact.
   :type safe_staking: bool
   :param allow_partial_stake: If true, allows partial stake swaps when the full amount would exceed the price tolerance.
   :type allow_partial_stake: bool
   :param rate_tolerance: Maximum allowed increase in a price ratio (0.005 = 0.5%).
   :type rate_tolerance: float
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :type period: Optional[int]

   :returns: True if the swap was successful.
   :rtype: success (bool)


.. py:function:: transfer_stake_extrinsic(subtensor, wallet, destination_coldkey_ss58, hotkey_ss58, origin_netuid, destination_netuid, amount = None, wait_for_inclusion = True, wait_for_finalization = False, period = None)

   Transfers stake from one subnet to another while changing the coldkey owner.

   :param subtensor: Subtensor instance.
   :type subtensor: Subtensor
   :param wallet: The wallet to transfer stake from.
   :type wallet: bittensor.wallet
   :param destination_coldkey_ss58: The destination coldkey SS58 address.
   :type destination_coldkey_ss58: str
   :param hotkey_ss58: The hotkey SS58 address associated with the stake.
   :type hotkey_ss58: str
   :param origin_netuid: The source subnet UID.
   :type origin_netuid: int
   :param destination_netuid: The destination subnet UID.
   :type destination_netuid: int
   :param amount: Amount to transfer.
   :type amount: Union[Balance, float, int]
   :param wait_for_inclusion: If true, waits for inclusion before returning.
   :type wait_for_inclusion: bool
   :param wait_for_finalization: If true, waits for finalization before returning.
   :type wait_for_finalization: bool
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :type period: Optional[int]

   :returns: True if the transfer was successful.
   :rtype: success (bool)


