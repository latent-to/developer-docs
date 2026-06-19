bittensor.core.extrinsics.asyncex.serving
=========================================

.. py:module:: bittensor.core.extrinsics.asyncex.serving


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.asyncex.serving.publish_metadata_extrinsic
   bittensor.core.extrinsics.asyncex.serving.serve_axon_extrinsic
   bittensor.core.extrinsics.asyncex.serving.serve_extrinsic


Module Contents
---------------

.. py:function:: publish_metadata_extrinsic(subtensor, wallet, netuid, data_type, data, reset_bonds = False, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Publishes metadata on the Bittensor network using the specified wallet and network identifier.

   :param subtensor: The subtensor instance representing the Bittensor blockchain connection.
   :param wallet: The wallet object used for authentication in the transaction.
   :param netuid: Network UID on which the metadata is to be published.
   :param data_type: The data type of the information being submitted. It should be one of the following:
                     ``'Sha256'``, ``'Blake256'``, ``'Keccak256'``, or ``'Raw0-128'``. This specifies the format or hashing
                     algorithm used for the data.
   :param data: The actual metadata content to be published. This should be formatted or hashed
                according to the ``type`` specified. (Note: max ``str`` length is 128 bytes for ``'Raw0-128'``.)
   :param reset_bonds: If `True`, the function will reset the bonds for the neuron.
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

   :raises MetadataError: If there is an error in submitting the extrinsic, or if the response from the blockchain indicates
   :raises failure.:


.. py:function:: serve_axon_extrinsic(subtensor, netuid, axon, certificate = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Serves the axon to the network.

   :param subtensor: AsyncSubtensor instance object.
   :param netuid: The ``netuid`` being served on.
   :param axon: Axon to serve.
   :param certificate: Certificate to use for TLS. If ``None``, no TLS will be used.
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


.. py:function:: serve_extrinsic(subtensor, wallet, ip, port, protocol, netuid, placeholder1 = 0, placeholder2 = 0, certificate = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
   :async:


   Subscribes a Bittensor endpoint to the subtensor chain.

   :param subtensor: Subtensor instance object.
   :param wallet: Bittensor wallet object.
   :param ip: Endpoint host port i.e., ``192.122.31.4``.
   :param port: Endpoint port number i.e., ``9221``.
   :param protocol: An ``int`` representation of the protocol.
   :param netuid: The network uid to serve on.
   :param placeholder1: A placeholder for future use.
   :param placeholder2: A placeholder for future use.
   :param certificate: Certificate to use for TLS. If ``None``, no TLS will be used.
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


