bittensor.core.extrinsics.staking
=================================

.. py:module:: bittensor.core.extrinsics.staking


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.staking.add_stake_burn_extrinsic
   bittensor.core.extrinsics.staking.add_stake_extrinsic
   bittensor.core.extrinsics.staking.add_stake_multiple_extrinsic
   bittensor.core.extrinsics.staking.set_auto_stake_extrinsic


Module Contents
---------------

.. py:function:: add_stake_burn_extrinsic(subtensor, wallet, netuid, hotkey_ss58, amount, limit_price = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Executes a subnet buyback by staking TAO and immediately burning the resulting Alpha.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object.
   :param netuid: The unique identifier of the subnet.
   :param hotkey_ss58: The `ss58` address of the hotkey account to stake to.
   :param amount: Amount to stake as Bittensor balance in TAO always.
   :param limit_price: Optional limit price expressed in units of RAO per one Alpha.
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

   :raises SubstrateRequestException: Raised if the extrinsic fails to be included in the block within the timeout.

   .. admonition:: Notes

      The `data` field in the returned `ExtrinsicResponse` contains extra information about the extrinsic execution.


.. py:function:: add_stake_extrinsic(subtensor, wallet, netuid, hotkey_ss58, amount, safe_staking = False, allow_partial_stake = False, rate_tolerance = 0.005, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Adds a stake from the specified wallet to the neuron identified by the SS58 address of its hotkey in specified subnet.
   Staking is a fundamental process in the Bittensor network that enables neurons to participate actively and earn
   incentives.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object.
   :param netuid: The unique identifier of the subnet to which the neuron belongs.
   :param hotkey_ss58: The `ss58` address of the hotkey account to stake to default to the wallet's hotkey.
   :param amount: Amount to stake as Bittensor balance in TAO always.
   :param safe_staking: If True, enables price safety checks.
   :param allow_partial_stake: If True, allows partial unstaking if price tolerance exceeded.
   :param rate_tolerance: Maximum allowed price increase percentage (0.005 = 0.5%).
   :param mev_protection: If True, encrypts and submits the staking transaction through the MEV Shield pallet to protect
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

   :raises SubstrateRequestException: Raised if the extrinsic fails to be included in the block within the timeout.

   .. admonition:: Notes

      The `data` field in the returned `ExtrinsicResponse` contains extra information about the extrinsic execution.


.. py:function:: add_stake_multiple_extrinsic(subtensor, wallet, netuids, hotkey_ss58s, amounts, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Adds stake to each ``hotkey_ss58`` in the list, using each amount, from a common coldkey on subnet with
   corresponding netuid.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object for the coldkey.
   :param netuids: List of netuids to stake to.
   :param hotkey_ss58s: List of hotkeys to stake to.
   :param amounts: List of corresponding TAO amounts to bet for each netuid and hotkey.
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
      `add_stake_extrinsic` call. Each entry maps a tuple key `(idx, hotkey_ss58, netuid)` to either:
          - the corresponding `ExtrinsicResponse` object if the staking attempt was executed, or
          - `None` if the staking was skipped due to failing validation (e.g., wrong balance, zero amount, etc.).
      In the key, `idx` is the index the stake attempt. This allows the caller to inspect which specific operations
      were attempted and which were not.


.. py:function:: set_auto_stake_extrinsic(subtensor, wallet, netuid, hotkey_ss58, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Sets the coldkey to automatically stake to the hotkey within specific subnet mechanism.

   :param subtensor: AsyncSubtensor instance.
   :param wallet: Bittensor Wallet instance.
   :param netuid: The subnet unique identifier.
   :param hotkey_ss58: The SS58 address of the validator's hotkey to which the miner automatically stakes all rewards
                       received from the specified subnet immediately upon receipt.
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


