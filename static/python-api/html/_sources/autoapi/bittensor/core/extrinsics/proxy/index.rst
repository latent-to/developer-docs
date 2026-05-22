bittensor.core.extrinsics.proxy
===============================

.. py:module:: bittensor.core.extrinsics.proxy


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.proxy.add_proxy_extrinsic
   bittensor.core.extrinsics.proxy.announce_extrinsic
   bittensor.core.extrinsics.proxy.create_pure_proxy_extrinsic
   bittensor.core.extrinsics.proxy.kill_pure_proxy_extrinsic
   bittensor.core.extrinsics.proxy.poke_deposit_extrinsic
   bittensor.core.extrinsics.proxy.proxy_announced_extrinsic
   bittensor.core.extrinsics.proxy.proxy_extrinsic
   bittensor.core.extrinsics.proxy.reject_announcement_extrinsic
   bittensor.core.extrinsics.proxy.remove_announcement_extrinsic
   bittensor.core.extrinsics.proxy.remove_proxies_extrinsic
   bittensor.core.extrinsics.proxy.remove_proxy_extrinsic


Module Contents
---------------

.. py:function:: add_proxy_extrinsic(subtensor, wallet, delegate_ss58, proxy_type, delay, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Adds a proxy relationship.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object.
   :param delegate_ss58: The SS58 address of the delegate proxy account.
   :param proxy_type: The type of proxy permissions (e.g., `Any`, `NonTransfer`, `Governance`, `Staking`).
                      Can be a string or `ProxyType` enum value. For available proxy types and their permissions, see the
                      documentation link in the Notes section below.
   :param delay: Optionally, include a delay in blocks. The number of blocks that must elapse between announcing and
                 executing a proxied transaction (time-lock period). A delay of `0` means the proxy can be used immediately
                 without announcements. A non-zero delay creates a time-lock, requiring the proxy to announce calls first, wait
                 for the delay period, then execute them, giving the real account time to review and reject unwanted operations.
   :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If `False`, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - A deposit is required when adding a proxy. The deposit amount is determined by runtime constants and is
        returned when the proxy is removed.
      - For available proxy types and their specific permissions, see: <https://docs.learnbittensor.org/keys/proxies#types-of-proxies>
      - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>

   .. warning::

      - The `Any` proxy type is dangerous as it grants full permissions to the proxy, including the ability to make
        transfers and manage the account completely. Use with extreme caution.
      - If `wait_for_inclusion=False` or when `block_hash` is not available, the extrinsic receipt may not contain
        triggered events. This means that any data that would normally be extracted from blockchain events (such as
        proxy relationship details) will not be available in the response. To ensure complete event data is available,
        either pass `wait_for_inclusion=True` when calling this function, or retrieve the data manually from the
        blockchain using the extrinsic hash.


.. py:function:: announce_extrinsic(subtensor, wallet, real_account_ss58, call_hash, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Announces a future call that will be executed through a proxy.

   This extrinsic allows a proxy account to declare its intention to execute a specific call on behalf of a real
   account after a delay period. The real account can review and either approve or reject the announcement.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (should be the proxy account wallet).
   :param real_account_ss58: The SS58 address of the real account on whose behalf the call will be made.
   :param call_hash: The hash of the call that will be executed in the future (hex string with `0x` prefix).
   :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If `False`, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - A deposit is required when making an announcement. The deposit is returned when the announcement is
        executed, rejected, or removed. The announcement can be executed after the delay period has passed.
      - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>


.. py:function:: create_pure_proxy_extrinsic(subtensor, wallet, proxy_type, delay, index, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Creates a pure proxy account.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object.
   :param proxy_type: The type of proxy permissions for the pure proxy. Can be a string or `ProxyType` enum value. For
                      available proxy types and their permissions, see the documentation link in the Notes section below.
   :param delay: Optionally, include a delay in blocks. The number of blocks that must elapse between announcing and
                 executing a proxied transaction (time-lock period). A delay of `0` means the pure proxy can be used
                 immediately without any announcement period. A non-zero delay creates a time-lock, requiring announcements
                 before execution to give the spawner time to review/reject.
   :param index: A salt value (u16, range `0-65535`) used to generate unique pure proxy addresses. This should generally
                 be left as `0` unless you are creating batches of proxies. When creating multiple pure proxies with identical
                 parameters (same `proxy_type` and `delay`), different index values will produce different SS58 addresses.
                 This is not a sequential counter—you can use any unique values (e.g., 0, 100, 7, 42) in any order. The index
                 must be preserved as it's required for :meth:`kill_pure_proxy_extrinsic`. If creating multiple pure proxies in
                 a single batch transaction, each must have a unique index value.
   :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If `False`, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - The pure proxy account address can be extracted from the `PureCreated` event in the response. Store the
        spawner address, `proxy_type`, `index`, `height`, and `ext_index` as they are required to kill the
        pure proxy later.
      - For available proxy types and their specific permissions, see: <https://docs.learnbittensor.org/keys/proxies#types-of-proxies>
      - See Pure Proxies: <https://docs.learnbittensor.org/keys/proxies/pure-proxies>

   .. warning::

      - The `Any` proxy type is dangerous as it grants full permissions to the proxy, including the ability to make
        transfers and kill the proxy. Use with extreme caution.
      - If `wait_for_inclusion=False` or when `block_hash` is not available, the extrinsic receipt may not contain
        triggered events. This means that any data that would normally be extracted from blockchain events (such as
        the pure proxy account address) will not be available in the response. To ensure complete event data is available,
        either pass `wait_for_inclusion=True` when calling this function, or retrieve the data manually from the
        blockchain using the extrinsic hash.


.. py:function:: kill_pure_proxy_extrinsic(subtensor, wallet, pure_proxy_ss58, spawner, proxy_type, index, height, ext_index, force_proxy_type = ProxyType.Any, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Kills (removes) a pure proxy account.

   This method removes a pure proxy account that was previously created via `create_pure_proxy()`. The `kill_pure` call
   must be executed through the pure proxy account itself, with the spawner acting as an "Any" proxy. This method
   automatically handles this by executing the call via `proxy()`.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object. The `wallet.coldkey.ss58_address` must be the spawner of the pure proxy (the
                  account that created it via :meth:`create_pure_proxy_extrinsic`). The spawner must have an `Any` proxy
                  relationship with the pure proxy.
   :param pure_proxy_ss58: The SS58 address of the pure proxy account to be killed. This is the address that was returned
                           in the :meth:`create_pure_proxy_extrinsic` response.
   :param spawner: The SS58 address of the spawner account (the account that originally created the pure proxy via
                   :meth:`create_pure_proxy_extrinsic`). This should match `wallet.coldkey.ss58_address`.
   :param proxy_type: The type of proxy permissions that were used when creating the pure proxy. This must match exactly
                      the `proxy_type` that was passed to :meth:`create_pure_proxy_extrinsic`.
   :param index: The salt value (u16, range `0-65535`) originally used in :meth:`create_pure_proxy_extrinsic` to generate
                 this pure proxy's address. This value, combined with `proxy_type`, `delay`, and `spawner`, uniquely
                 identifies the pure proxy to be killed. Must match exactly the index used during creation.
   :param height: The block number at which the pure proxy was created. This is returned in the `PureCreated` event from
                  :meth:`create_pure_proxy_extrinsic` and is required to identify the exact creation transaction.
   :param ext_index: The extrinsic index within the block at which the pure proxy was created. This is returned in the
                     `PureCreated` event from :meth:`create_pure_proxy_extrinsic` and specifies the position of the creation
                     extrinsic within the block. Together with `height`, this uniquely identifies the creation transaction.
   :param force_proxy_type: The proxy type relationship to use when executing `kill_pure` through the proxy mechanism.
                            Since pure proxies are keyless and cannot sign transactions, the spawner must act as a proxy for the pure
                            proxy to execute `kill_pure`. This parameter specifies which proxy type relationship between the spawner and
                            the pure proxy account should be used. The spawner must have a proxy relationship of this type (or `Any`)
                            with the pure proxy account. Defaults to `ProxyType.Any` for maximum compatibility. If `None`, Substrate
                            will automatically select an available proxy type from the spawner's proxy relationships.
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

   .. admonition:: Notes

      - The `kill_pure` call must be executed through the pure proxy account itself, with the spawner acting as a proxy.
        This method automatically handles this by executing the call via :meth:`proxy_extrinsic`. By default,
        `force_proxy_type` is set to `ProxyType.Any`, meaning the spawner must have an `Any` proxy relationship
        with the pure proxy. If you pass a different `force_proxy_type`, the spawner must have that specific proxy
        type relationship with the pure proxy.
      - See Pure Proxies: <https://docs.learnbittensor.org/keys/proxies/pure-proxies>

   .. warning::

      All access to this account will be lost. Any funds remaining in the pure proxy account will become permanently
      inaccessible after this operation.

   .. admonition:: Example

      # After creating a pure proxy
      create_response = subtensor.proxies.create_pure_proxy(
          wallet=spawner_wallet,
          proxy_type=ProxyType.Any,  # Type of proxy permissions for the pure proxy
          delay=0,
          index=0,
      )
      
      pure_proxy_ss58 = create_response.data["pure_account"]
      spawner = create_response.data["spawner"]
      proxy_type_used = create_response.data["proxy_type"]  # The proxy_type used during creation
      height = create_response.data["height"]
      ext_index = create_response.data["ext_index"]
      # Kill the pure proxy
      # Note: force_proxy_type defaults to ProxyType.Any (spawner must have Any proxy relationship)
      
      kill_response = subtensor.proxies.kill_pure_proxy(
          wallet=spawner_wallet,
          pure_proxy_ss58=pure_proxy_ss58,
          spawner=spawner,
          proxy_type=proxy_type_used,  # Must match the proxy_type used during creation
          index=0,
          height=height,
          ext_index=ext_index,
          # force_proxy_type=ProxyType.Any,  # Optional: defaults to ProxyType.Any
      )


.. py:function:: poke_deposit_extrinsic(subtensor, wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Adjusts deposits made for proxies and announcements based on current values.

   This can be used by accounts to possibly lower their locked amount. The function automatically recalculates deposits
   for both proxy relationships and announcements for the signing account. The transaction fee is waived if the deposit
   amount has changed.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (the account whose deposits will be adjusted).
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      When to use:
          - After runtime upgrade, if deposit constants have changed.
          - After removing proxies/announcements, to free up excess locked funds.
          - Periodically to optimize locked deposit amounts.
      - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>


.. py:function:: proxy_announced_extrinsic(subtensor, wallet, delegate_ss58, real_account_ss58, force_proxy_type, call, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Executes an announced call on behalf of the real account through a proxy.

   This extrinsic executes a call that was previously announced via :meth:`announce_extrinsic`. The call must match the
   `call_hash` that was announced, and the delay period must have passed.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (should be the proxy account wallet that made the announcement).
   :param delegate_ss58: The SS58 address of the delegate proxy account that made the announcement.
   :param real_account_ss58: The SS58 address of the real account on whose behalf the call will be made.
   :param force_proxy_type: The type of proxy to use for the call. If `None`, any proxy type can be used. Otherwise, must
                            match one of the allowed proxy types. Can be a string or `ProxyType` enum value.
   :param call: The inner call to be executed on behalf of the real account (must match the announced `call_hash`).
   :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If `False`, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - The `call_hash` of the provided call must match the `call_hash` that was announced. The announcement must not
        have been rejected by the real account, and the delay period must have passed.
      - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>


.. py:function:: proxy_extrinsic(subtensor, wallet, real_account_ss58, force_proxy_type, call, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Executes a call on behalf of the real account through a proxy.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (should be the proxy account wallet).
   :param real_account_ss58: The SS58 address of the real account on whose behalf the call is being made.
   :param force_proxy_type: The type of proxy to use for the call. If `None`, any proxy type can be used. Otherwise, must
                            match one of the allowed proxy types. Can be a string or `ProxyType` enum value.
   :param call: The inner call to be executed on behalf of the real account.
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - The call must be permitted by the proxy type. For example, a `NonTransfer` proxy cannot execute transfer calls.
      - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>


.. py:function:: reject_announcement_extrinsic(subtensor, wallet, delegate_ss58, call_hash, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Rejects an announcement made by a proxy delegate.

   This extrinsic allows the real account to reject an announcement made by a proxy delegate, preventing the announced
   call from being executed. Once rejected, the announcement cannot be executed and the announcement deposit is
   returned to the delegate.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (should be the real account wallet).
   :param delegate_ss58: The SS58 address of the delegate proxy account whose announcement is being rejected.
   :param call_hash: The hash of the call that was announced and is now being rejected (hex string with `0x` prefix).
   :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If `False`, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - Once rejected, the announcement cannot be executed. The delegate's announcement deposit is returned.
      - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>


.. py:function:: remove_announcement_extrinsic(subtensor, wallet, real_account_ss58, call_hash, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Removes an announcement made by a proxy account.

   This extrinsic allows the proxy account to remove its own announcement before it is executed or rejected. This frees
   up the announcement deposit.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (should be the proxy account wallet that made the announcement).
   :param real_account_ss58: The SS58 address of the real account on whose behalf the call was announced.
   :param call_hash: The hash of the call that was announced and is now being removed (hex string with `0x` prefix).
   :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If `False`, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - Removing an announcement frees up the announcement deposit.
      - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>


.. py:function:: remove_proxies_extrinsic(subtensor, wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Removes all proxy relationships for the account.

   This removes all proxy relationships in a single call, which is more efficient than removing them one by one. The
   deposit for all proxies will be returned.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object (the account whose proxies will be removed).
   :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If False, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - This removes all proxy relationships for the account, regardless of proxy type or delegate.
      - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>


.. py:function:: remove_proxy_extrinsic(subtensor, wallet, delegate_ss58, proxy_type, delay, *, mev_protection = DEFAULT_MEV_PROTECTION, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)

   Removes a proxy relationship.

   :param subtensor: Subtensor instance with the connection to the chain.
   :param wallet: Bittensor wallet object.
   :param delegate_ss58: The SS58 address of the delegate proxy account to remove.
   :param proxy_type: The type of proxy permissions to remove. Can be a string or `ProxyType` enum value.
   :param delay: The announcement delay value (in blocks) for the proxy being removed. Must exactly match the delay value
                 that was set when the proxy was originally added. This is a required identifier for the specific proxy
                 relationship, not a delay before removal takes effect (removal is immediate).
   :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                          against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                          decrypt and execute it. If `False`, submits the transaction directly without encryption.
   :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                  transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                  can think of it as an expiration date for the transaction.
   :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
   :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
   :param wait_for_finalization: Whether to wait for the finalization of the transaction.
   :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

   :returns: The result object of the extrinsic execution.
   :rtype: ExtrinsicResponse

   .. admonition:: Notes

      - The delegate_ss58, proxy_type, and delay parameters must exactly match those used when the proxy was added.
      - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>


