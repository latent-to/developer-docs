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

.. py:function:: move_stake_extrinsic(subtensor, wallet, origin_netuid, origin_hotkey_ss58, destination_netuid, destination_hotkey_ss58, amount = None, move_all_stake = False, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Moves stake to a different hotkey and/or subnet while keeping the same coldkey owner.

   :param subtensor: Subtensor instance.
   :param wallet: The wallet to move stake from.
   :param origin_netuid: The netuid of the source subnet.
   :param origin_hotkey_ss58: The SS58 address of the source hotkey.
   :param destination_netuid: The netuid of the destination subnet.
   :param destination_hotkey_ss58: The SS58 address of the destination hotkey.
   :param amount: Amount to move.
   :param move_all_stake: If true, moves all stake from the source hotkey to the destination hotkey.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: swap_stake_extrinsic(subtensor, wallet, hotkey_ss58, origin_netuid, destination_netuid, amount, safe_swapping = False, allow_partial_stake = False, rate_tolerance = 0.005, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Moves stake between subnets while keeping the same coldkey-hotkey pair ownership.

   :param subtensor: Subtensor instance.
   :param wallet: The wallet to swap stake from.
   :param hotkey_ss58: The hotkey SS58 address associated with the stake.
   :param origin_netuid: The source subnet UID.
   :param destination_netuid: The destination subnet UID.
   :param amount: Amount to swap.
   :param safe_swapping: If true, enables price safety checks to protect against price impact.
   :param allow_partial_stake: If true, allows partial stake swaps when the full amount would exceed the price tolerance.
   :param rate_tolerance: Maximum allowed increase in a price ratio (0.005 = 0.5%).
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


.. py:function:: transfer_stake_extrinsic(subtensor, wallet, destination_coldkey_ss58, hotkey_ss58, origin_netuid, destination_netuid, amount, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Transfers stake from one subnet to another while changing the coldkey owner.

   :param subtensor: The subtensor instance to interact with the blockchain.
   :param wallet: The wallet containing the coldkey to authorize the transfer.
   :param destination_coldkey_ss58: SS58 address of the destination coldkey.
   :param hotkey_ss58: SS58 address of the hotkey associated with the stake.
   :param origin_netuid: Network UID of the origin subnet.
   :param destination_netuid: Network UID of the destination subnet.
   :param amount: The amount of stake to transfer as a `Balance` object.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                  think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse


