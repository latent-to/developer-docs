bittensor.core.extrinsics.transfer
==================================

.. py:module:: bittensor.core.extrinsics.transfer


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.transfer.transfer_extrinsic


Module Contents
---------------

.. py:function:: transfer_extrinsic(subtensor, wallet, destination_ss58, amount, keep_alive = True, transfer_all = False, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Transfers funds from this wallet to the destination public key address.

   :param subtensor: the Subtensor object used for transfer
   :param wallet: The wallet to sign the extrinsic.
   :param destination_ss58: Destination public key address (ss58_address or ed25519) of recipient.
   :param amount: Amount to stake as Bittensor balance. `None` if transferring all.
   :param transfer_all: Whether to transfer all funds from this wallet to the destination address.
   :param keep_alive: If set, keeps the account alive by keeping the balance above the existential deposit.
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


