bittensor.core.extrinsics.pallets.proxy
=======================================

.. py:module:: bittensor.core.extrinsics.pallets.proxy


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.proxy.Proxy


Module Contents
---------------

.. py:class:: Proxy

   Bases: :py:obj:`bittensor.core.extrinsics.pallets.base.CallBuilder`


   Factory class for creating GenericCall objects for Proxy pallet functions.

   This class provides methods to create GenericCall instances for all Proxy pallet extrinsics.

   Works with both sync (Subtensor) and async (AsyncSubtensor) instances. For async operations, pass an AsyncSubtensor
   instance and await the result.

   .. admonition:: Example

      # Sync usage
      
      call = Proxy(subtensor).add_proxy(delegate="5DE..", proxy_type="Any", delay=0)
      
      response = subtensor.sign_and_send_extrinsic(call=call, ...)
      
      # Async usage
      
      call = await Proxy(async_subtensor).add_proxy(delegate="5DE..", proxy_type="Any", delay=0)
      
      response = await async_subtensor.sign_and_send_extrinsic(call=call, ...)


   .. py:method:: add_proxy(delegate, proxy_type, delay)

      Add a proxy relationship between existing wallets.

      :param delegate: The SS58 address of the delegate proxy account.
      :param proxy_type: The type of proxy permissions (e.g., `Any`, `NonTransfer`, `Staking`). For available
                         proxy types and their permissions, see the documentation link in the Notes section below.
      :param delay: Optionally, include a delay in blocks. The time-lock period for proxy announcements. A delay of `0`
                    means immediate execution without announcements.

      :returns: GenericCall instance for the `Proxy.addProxy` extrinsic.

      .. admonition:: Notes

         - For available proxy types and their specific permissions, see: <https://docs.learnbittensor.org/keys/proxies#types-of-proxies>
         - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>



   .. py:method:: announce(real, call_hash)

      Create a call to announce a future proxied operation.

      :param real: The SS58 address of the real account on whose behalf the call will be made.
      :param call_hash: The hash of the call that will be executed in the future (hex string with `0x` prefix).

      :returns: GenericCall instance for the `Proxy.announce` extrinsic.

      .. admonition:: Notes

         - A deposit is required when making an announcement. The deposit is returned when the announcement is executed,
           rejected, or removed. The announcement can be executed after the delay period has passed.
         - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>



   .. py:method:: create_pure(proxy_type, delay, index)

      Create a pure proxy account.

      :param proxy_type: The type of proxy permissions for the pure proxy (e.g., `Any`, `NonTransfer`,
                         `Staking`). For available proxy types and their permissions, see the documentation link in the Notes
                         section below.
      :param delay: Optionally, include a delay in blocks. The time-lock period for proxy announcements. A delay of `0`
                    means immediate execution without announcements.
      :param index: A salt value (u16, range `0-65535`) used to generate unique pure proxy addresses. This should
                    generally be left as `0` unless you are creating batches of proxies. Must be preserved for
                    `kill_pure`.

      :returns: GenericCall instance for the `Proxy.createPure` extrinsic.

      .. admonition:: Notes

         - For available proxy types and their specific permissions, see: <https://docs.learnbittensor.org/keys/proxies#types-of-proxies>
         - See Pure Proxies: <https://docs.learnbittensor.org/keys/proxies/pure-proxies>



   .. py:method:: kill_pure(spawner, proxy_type, index, height, ext_index)

      Destroy a pure proxy account.

      :param spawner: The SS58 address of the account that spawned the pure proxy (the account that called
                      `create_pure`).
      :param proxy_type: The type of proxy permissions that were used when creating the pure proxy. Must match the value
                         used in `create_pure`.
      :param index: The salt value (u16, range `0-65535`) originally used in `create_pure` to generate this pure
                    proxy's address. Must match exactly the index used during creation.
      :param height: The block number at which the pure proxy was created. This is returned in the `PureCreated`
                     event from `create_pure`.
      :param ext_index: The extrinsic index within the block at which the pure proxy was created. This is returned in the
                        `PureCreated` event from `create_pure`.

      :returns: GenericCall instance for the `Proxy.killPure` extrinsic.

      .. admonition:: Notes

         See Pure Proxies: <https://docs.learnbittensor.org/keys/proxies/pure-proxies>

      .. warning::

         All access to this account will be lost. Any funds remaining in the pure proxy account will become
         permanently inaccessible after this operation.



   .. py:method:: poke_deposit()

      Adjust proxy and announcement deposits based on current runtime values.

      :returns: GenericCall instance for the `Proxy.pokeDeposit` extrinsic.

      .. admonition:: Notes

         - This can be used by accounts to possibly lower their locked amount. The function automatically recalculates
           deposits for both proxy relationships and announcements for the signing account. The transaction fee is waived
           if the deposit amount has changed.
         - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>



   .. py:method:: proxy(real, force_proxy_type, call)

      Create a call to execute an operation through a proxy relationship.

      :param real: The SS58 address of the real account on whose behalf the call is being made.
      :param force_proxy_type: The type of proxy to use for the call. If `None`, any proxy type can be used. Otherwise,
                               must match one of the allowed proxy types that the signing account has for the real account.
      :param call: The inner call to be executed on behalf of the real account.

      :returns: GenericCall instance for the `Proxy.proxy` extrinsic.

      .. admonition:: Notes

         - The call must be permitted by the proxy type. For example, a `NonTransfer` proxy cannot execute transfer
           calls.
         - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>



   .. py:method:: proxy_announced(delegate, real, force_proxy_type, call)

      Create a call to execute a previously announced proxied operation.

      :param delegate: The SS58 address of the delegate proxy account that made the announcement.
      :param real: The SS58 address of the real account on whose behalf the call will be made.
      :param force_proxy_type: The type of proxy to use for the call. If `None`, any proxy type can be used. Otherwise,
                               must match one of the allowed proxy types.
      :param call: The inner call to be executed on behalf of the real account. The hash of this call must match the
                   `call_hash` that was announced.

      :returns: GenericCall instance for the `Proxy.proxyAnnounced` extrinsic.

      .. admonition:: Notes

         - The `call_hash` of the provided call must match the `call_hash` that was announced. The announcement must
           not have been rejected by the real account, and the delay period must have passed.
         - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>



   .. py:method:: reject_announcement(delegate, call_hash)

      Reject a proxy announcement.

      :param delegate: The SS58 address of the delegate proxy account whose announcement is being rejected.
      :param call_hash: The hash of the call that was announced and is now being rejected (hex string with `0x`
                        prefix).

      :returns: GenericCall instance for the `Proxy.rejectAnnouncement` extrinsic.

      .. admonition:: Notes

         - Once rejected, the announcement cannot be executed. The delegate's announcement deposit is returned.
         - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>



   .. py:method:: remove_announcement(real, call_hash)

      Remove an announcement made by the signing proxy account.

      :param real: The SS58 address of the real account on whose behalf the call was announced.
      :param call_hash: The hash of the call that was announced and is now being removed (hex string with `0x`
                        prefix).

      :returns: GenericCall instance for the `Proxy.removeAnnouncement` extrinsic.

      .. admonition:: Notes

         - Removing an announcement frees up the announcement deposit.
         - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>



   .. py:method:: remove_proxies()

      Remove all proxy relationships for the signing account.

      :returns: GenericCall instance for the `Proxy.removeProxies` extrinsic.

      .. admonition:: Notes

         - This removes all proxy relationships in a single call, which is more efficient than removing them one by one.
         - See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>



   .. py:method:: remove_proxy(delegate, proxy_type, delay)

      Remove a specific proxy relationship.

      :param delegate: The SS58 address of the delegate proxy account to remove.
      :param proxy_type: The type of proxy permissions to remove. Must match the value used when the proxy was added.
      :param delay: The announcement delay value (in blocks) for the proxy being removed. Must exactly match the delay
                    value that was set when the proxy was originally added. This is a required identifier for the specific
                    proxy relationship.

      :returns: GenericCall instance for the `Proxy.removeProxy` extrinsic.

      .. admonition:: Notes

         See Working with Proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>



