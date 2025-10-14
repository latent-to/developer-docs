bittensor.core.extrinsics.asyncex.move_stake
============================================

.. py:module:: bittensor.core.extrinsics.asyncex.move_stake


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.asyncex.move_stake.move_stake_extrinsic
   bittensor.core.extrinsics.asyncex.move_stake.swap_stake_extrinsic
   bittensor.core.extrinsics.asyncex.move_stake.transfer_stake_extrinsic


Module Contents
---------------

.. py:function:: move_stake_extrinsic(subtensor, wallet, origin_hotkey, origin_netuid, destination_hotkey, destination_netuid, amount, wait_for_inclusion = True, wait_for_finalization = False, period = None, move_all_stake = False)
   :async:


   Moves stake from one hotkey to another within subnets in the Bittensor network.

   :param subtensor: The subtensor instance to interact with the blockchain.
   :param wallet: The wallet containing the coldkey to authorize the move.
   :param origin_hotkey: SS58 address of the origin hotkey associated with the stake.
   :param origin_netuid: Network UID of the origin subnet.
   :param destination_hotkey: SS58 address of the destination hotkey.
   :param destination_netuid: Network UID of the destination subnet.
   :param amount: The amount of stake to move as a `Balance` object.
   :param wait_for_inclusion: If True, waits for transaction inclusion in a block. Defaults to True.
   :param wait_for_finalization: If True, waits for transaction finalization. Defaults to False.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param move_all_stake: If true, moves all stake from the source hotkey to the destination hotkey.

   :returns: True if the move was successful, False otherwise.
   :rtype: bool


.. py:function:: swap_stake_extrinsic(subtensor, wallet, hotkey_ss58, origin_netuid, destination_netuid, amount, wait_for_inclusion = True, wait_for_finalization = False, safe_staking = False, allow_partial_stake = False, rate_tolerance = 0.005, period = None)
   :async:


   Swaps stake from one subnet to another for a given hotkey in the Bittensor network.

   :param subtensor: The subtensor instance to interact with the blockchain.
   :type subtensor: AsyncSubtensor
   :param wallet: The wallet containing the coldkey to authorize the swap.
   :type wallet: Wallet
   :param hotkey_ss58: SS58 address of the hotkey associated with the stake.
   :type hotkey_ss58: str
   :param origin_netuid: Network UID of the origin subnet.
   :type origin_netuid: int
   :param destination_netuid: Network UID of the destination subnet.
   :type destination_netuid: int
   :param amount: The amount of stake to swap as a `Balance` object.
   :type amount: Balance
   :param wait_for_inclusion: If True, waits for transaction inclusion in a block. Defaults to True.
   :type wait_for_inclusion: bool
   :param wait_for_finalization: If True, waits for transaction finalization. Defaults to False.
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

   :returns: True if the swap was successful, False otherwise.
   :rtype: bool


.. py:function:: transfer_stake_extrinsic(subtensor, wallet, destination_coldkey_ss58, hotkey_ss58, origin_netuid, destination_netuid, amount, wait_for_inclusion = True, wait_for_finalization = False, period = None)
   :async:


   Transfers stake from one coldkey to another in the Bittensor network.

   :param subtensor: The subtensor instance to interact with the blockchain.
   :type subtensor: AsyncSubtensor
   :param wallet: The wallet containing the coldkey to authorize the transfer.
   :type wallet: Wallet
   :param destination_coldkey_ss58: SS58 address of the destination coldkey.
   :type destination_coldkey_ss58: str
   :param hotkey_ss58: SS58 address of the hotkey associated with the stake.
   :type hotkey_ss58: str
   :param origin_netuid: Network UID of the origin subnet.
   :type origin_netuid: int
   :param destination_netuid: Network UID of the destination subnet.
   :type destination_netuid: int
   :param amount: The amount of stake to transfer as a `Balance` object.
   :type amount: Balance
   :param wait_for_inclusion: If True, waits for transaction inclusion in a block. Defaults to `True`.
   :type wait_for_inclusion: bool
   :param wait_for_finalization: If True, waits for transaction finalization. Defaults to `False`.
   :type wait_for_finalization: bool
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :type period: Optional[int]

   :returns: True if the transfer was successful, False otherwise.
   :rtype: bool


