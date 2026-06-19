bittensor.core.extrinsics.registration
======================================

.. py:module:: bittensor.core.extrinsics.registration

.. autoapi-nested-parse::

   This module provides sync functionalities for registering a wallet with the subtensor network.



Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.registration.burned_register_extrinsic
   bittensor.core.extrinsics.registration.register_limit_extrinsic
   bittensor.core.extrinsics.registration.register_subnet_extrinsic
   bittensor.core.extrinsics.registration.set_subnet_identity_extrinsic


Module Contents
---------------

.. py:function:: burned_register_extrinsic(subtensor, wallet, netuid, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Registers the wallet to chain by recycling TAO.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor wallet object.
   :param netuid: The ``netuid`` of the subnet to register on.
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


.. py:function:: register_limit_extrinsic(subtensor, wallet, netuid, limit_price, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Registers the wallet to chain by recycling TAO, with a maximum burn price limit.

   :param subtensor: Subtensor instance.
   :param wallet: Bittensor wallet object.
   :param netuid: The ``netuid`` of the subnet to register on.
   :param limit_price: Maximum acceptable burn price as a Balance instance. If the on-chain burn price exceeds
                       this value, the transaction will fail with RegistrationPriceLimitExceeded.
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


.. py:function:: register_subnet_extrinsic(subtensor, wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Registers a new subnetwork on the Bittensor blockchain.

   :param subtensor: The subtensor interface to send the extrinsic.
   :param wallet: The wallet to be used for subnet registration.
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


.. py:function:: set_subnet_identity_extrinsic(subtensor, wallet, netuid, subnet_name, github_repo, subnet_contact, subnet_url, logo_url, discord, description, additional, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Set the identity information for a given subnet.

   :param subtensor: An instance of the Subtensor class to interact with the blockchain.
   :param wallet: A wallet instance used to sign and submit the extrinsic.
   :param netuid: The unique ID for the subnet.
   :param subnet_name: The name of the subnet to assign the identity information.
   :param github_repo: URL of the GitHub repository related to the subnet.
   :param subnet_contact: Subnet's contact information, e.g., email or contact link.
   :param subnet_url: The URL of the subnet's primary web portal.
   :param logo_url: The URL of the logo's primary web portal.
   :param discord: Discord server or contact for the subnet.
   :param description: A textual description of the subnet.
   :param additional: Any additional metadata or information related to the subnet.
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


