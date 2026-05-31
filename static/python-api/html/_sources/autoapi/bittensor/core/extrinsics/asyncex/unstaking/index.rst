bittensor.core.extrinsics.asyncex.unstaking
===========================================

.. py:module:: bittensor.core.extrinsics.asyncex.unstaking


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.asyncex.unstaking.unstake_all_extrinsic
   bittensor.core.extrinsics.asyncex.unstaking.unstake_extrinsic
   bittensor.core.extrinsics.asyncex.unstaking.unstake_multiple_extrinsic


Module Contents
---------------

.. py:function:: unstake_all_extrinsic(subtensor, wallet, netuid, hotkey_ss58, rate_tolerance = 0.005, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Unstakes all TAO/Alpha associated with a hotkey from the specified subnets on the Bittensor network.

   :param subtensor: Subtensor instance.
   :param wallet: The wallet of the stake owner.
   :param netuid: The unique identifier of the subnet.
   :param hotkey_ss58: The SS58 address of the hotkey to unstake from.
   :param rate_tolerance: The maximum allowed price change ratio when unstaking. For example, 0.005 = 0.5% maximum
                          price decrease. If not passed (None), then unstaking goes without price limit.
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


.. py:function:: unstake_extrinsic(subtensor, wallet, netuid, hotkey_ss58, amount, allow_partial_stake = False, rate_tolerance = 0.005, safe_unstaking = False, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Removes stake into the wallet coldkey from the specified hotkey ``uid``.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor wallet object.
   :param netuid: Subnet unique id.
   :param hotkey_ss58: The ``ss58`` address of the hotkey to unstake from.
   :param amount: Amount to stake as Bittensor balance.
   :param allow_partial_stake: If true, allows partial unstaking if price tolerance exceeded.
   :param safe_unstaking: If true, enables price safety checks.
   :param rate_tolerance: Maximum allowed price decrease percentage (0.005 = 0.5%).
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


.. py:function:: unstake_multiple_extrinsic(subtensor, wallet, netuids, hotkey_ss58s, amounts = None, rate_tolerance = 0.05, unstake_all = False, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Removes stake from each ``hotkey_ss58`` in the list, using each amount, to a common coldkey.

   :param subtensor: AsyncSubtensor instance.
   :param wallet: The wallet with the coldkey to unstake to.
   :param netuids: List of subnets unique IDs to unstake from.
   :param hotkey_ss58s: List of hotkeys to unstake from.
   :param amounts: List of amounts to unstake. If ``None``, unstake all.
   :param rate_tolerance: Maximum allowed price decrease percentage (0.005 = 0.5%).
   :param unstake_all: If true, unstakes all tokens.
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

   .. note::

      The `data` field in the returned `ExtrinsicResponse` contains the results of each individual internal
      `unstake_extrinsic` or `unstake_all_extrinsic` call. Each entry maps a tuple key `(idx, hotkey_ss58, netuid)` to
      either:
          - the corresponding `ExtrinsicResponse` object if the unstaking attempt was executed, or
          - `None` if the unstaking was skipped due to failing validation (e.g., wrong balance, zero amount, etc.).
      In the key, `idx` is the index the unstake attempt. This allows the caller to inspect which specific operations
      were attempted and which were not.


