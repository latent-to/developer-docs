bittensor.core.extrinsics.registration
======================================

.. py:module:: bittensor.core.extrinsics.registration

.. autoapi-nested-parse::

   This module provides functionalities for registering a wallet with the subtensor network using Proof-of-Work (PoW).

   Extrinsics:
   - register_extrinsic: Registers the wallet to the subnet.
   - burned_register_extrinsic: Registers the wallet to chain by recycling TAO.



Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.registration.burned_register_extrinsic
   bittensor.core.extrinsics.registration.register_extrinsic
   bittensor.core.extrinsics.registration.register_subnet_extrinsic
   bittensor.core.extrinsics.registration.set_subnet_identity_extrinsic


Module Contents
---------------

.. py:function:: burned_register_extrinsic(subtensor, wallet, netuid, wait_for_inclusion = False, wait_for_finalization = True, period = None)

   Registers the wallet to chain by recycling TAO.

   :param subtensor: Subtensor instance.
   :type subtensor: bittensor.core.subtensor.Subtensor
   :param wallet: Bittensor wallet object.
   :type wallet: bittensor.wallet
   :param netuid: The ``netuid`` of the subnet to register on.
   :type netuid: int
   :param wait_for_inclusion: If set, waits for the extrinsic to enter a block before returning ``True``, or
                              returns ``False`` if the extrinsic fails to enter the block within the timeout.
   :type wait_for_inclusion: bool
   :param wait_for_finalization: If set, waits for the extrinsic to be finalized on the chain before returning
                                 ``True``, or returns ``False`` if the extrinsic fails to be finalized within the timeout.
   :type wait_for_finalization: bool
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :type period: Optional[int]

   :returns:

             Flag is ``True`` if extrinsic was finalized or included in the block. If we did not wait for
                 finalization / inclusion, the response is ``True``.
   :rtype: success (bool)


.. py:function:: register_extrinsic(subtensor, wallet, netuid, wait_for_inclusion = False, wait_for_finalization = True, max_allowed_attempts = 3, output_in_place = True, cuda = False, dev_id = 0, tpb = 256, num_processes = None, update_interval = None, log_verbose = False, period = None)

   Registers the wallet to the chain.

   :param subtensor: Subtensor object to use for chain interactions
   :type subtensor: bittensor.core.subtensor.Subtensor
   :param wallet: Bittensor wallet object.
   :type wallet: bittensor_wallet.Wallet
   :param netuid: The ``netuid`` of the subnet to register on.
   :type netuid: int
   :param wait_for_inclusion: If set, waits for the extrinsic to enter a block before returning `True`, or returns
                              `False` if the extrinsic fails to enter the block within the timeout.
   :type wait_for_inclusion: bool
   :param wait_for_finalization: If set, waits for the extrinsic to be finalized on the chain before returning
                                 `True`, or returns `False` if the extrinsic fails to be finalized within the timeout.
   :type wait_for_finalization: bool
   :param max_allowed_attempts: Maximum number of attempts to register the wallet.
   :type max_allowed_attempts: int
   :param output_in_place: Whether the POW solving should be outputted to the console as it goes along.
   :type output_in_place: bool
   :param cuda: If `True`, the wallet should be registered using CUDA device(s).
   :type cuda: bool
   :param dev_id: The CUDA device id to use, or a list of device ids.
   :param tpb: The number of threads per block (CUDA).
   :param num_processes: The number of processes to use to register.
   :param update_interval: The number of nonces to solve between updates.
   :param log_verbose: If `True`, the registration process will log more information.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :type period: Optional[int]

   :returns:

             `True` if extrinsic was finalized or included in the block. If we did not wait for finalization/inclusion, the
                 response is `True`.


.. py:function:: register_subnet_extrinsic(subtensor, wallet, wait_for_inclusion = False, wait_for_finalization = True, period = None)

   Registers a new subnetwork on the Bittensor blockchain.

   :param subtensor: The subtensor interface to send the extrinsic.
   :type subtensor: Subtensor
   :param wallet: The wallet to be used for subnet registration.
   :type wallet: Wallet
   :param wait_for_inclusion: If set, waits for the extrinsic to enter a block before returning true.
   :type wait_for_inclusion: bool
   :param wait_for_finalization: If set, waits for the extrinsic to be finalized on the chain before returning true.
   :type wait_for_finalization: bool
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :type period: Optional[int]

   :returns: True if the subnet registration was successful, False otherwise.
   :rtype: bool


.. py:function:: set_subnet_identity_extrinsic(subtensor, wallet, netuid, subnet_name, github_repo, subnet_contact, subnet_url, logo_url, discord, description, additional, wait_for_inclusion = False, wait_for_finalization = True, period = None)

   Set the identity information for a given subnet.

   :param subtensor: An instance of the Subtensor class to interact with the blockchain.
   :type subtensor: Subtensor
   :param wallet: A wallet instance used to sign and submit the extrinsic.
   :type wallet: Wallet
   :param netuid: The unique ID for the subnet.
   :type netuid: int
   :param subnet_name: The name of the subnet to assign the identity information.
   :type subnet_name: str
   :param github_repo: URL of the GitHub repository related to the subnet.
   :type github_repo: str
   :param subnet_contact: Subnet's contact information, e.g., email or contact link.
   :type subnet_contact: str
   :param subnet_url: The URL of the subnet's primary web portal.
   :type subnet_url: str
   :param logo_url: The URL of the logo's primary web portal.
   :type logo_url: str
   :param discord: Discord server or contact for the subnet.
   :type discord: str
   :param description: A textual description of the subnet.
   :type description: str
   :param additional: Any additional metadata or information related to the subnet.
   :type additional: str
   :param wait_for_inclusion: Whether to wait for the extrinsic inclusion in a block (default: False).
   :type wait_for_inclusion: bool
   :param wait_for_finalization: Whether to wait for the extrinsic finalization in a block (default: True).
   :type wait_for_finalization: bool
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                  the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                  You can think of it as an expiration date for the transaction.
   :type period: Optional[int]

   :returns:

             A tuple where the first element indicates success or failure (True/False), and the second
                 element contains a descriptive message.
   :rtype: tuple[bool, str]


