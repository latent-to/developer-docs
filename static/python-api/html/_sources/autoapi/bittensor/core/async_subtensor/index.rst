bittensor.core.async_subtensor
==============================

.. py:module:: bittensor.core.async_subtensor


Classes
-------

.. autoapisummary::

   bittensor.core.async_subtensor.AsyncSubtensor


Functions
---------

.. autoapisummary::

   bittensor.core.async_subtensor.get_async_subtensor


Module Contents
---------------

.. py:class:: AsyncSubtensor(network = None, config = None, log_verbose = False, fallback_endpoints = None, retry_forever = False, archive_endpoints = None, websocket_shutdown_timer = 5.0, mock = False)

   Bases: :py:obj:`bittensor.core.types.SubtensorMixin`


   Asynchronous interface for interacting with the Bittensor blockchain.

   This class provides a thin layer over the Substrate Interface offering async functionality for Bittensor. This
   includes frequently-used calls for querying blockchain data, managing stakes and liquidity positions, registering
   neurons, submitting weights, and many other functions for participating in Bittensor.

   .. admonition:: Notes

      Key Bittensor concepts used throughout this class:
      
      - **Coldkey**: The key pair corresponding to a user's overall wallet. Used to transfer, stake, manage subnets.
      - **Hotkey**: A key pair (each wallet may have zero, one, or more) used for neuron operations (mining and
        validation).
      - **Netuid**: Unique identifier for a subnet (0 is the Root Subnet)
      - **UID**: Unique identifier for a neuron registered to a hotkey on a specific subnet.
      - **Metagraph**: Data structure containing the complete state of a subnet at a block.
      - **TAO**: The base network token; subnet 0 stake is in TAO
      - **Alpha**: Subnet-specific token representing some quantity of TAO staked into a subnet.
      - **Rao**: Smallest unit of TAO (1 TAO = 1e9 Rao)
      - Bittensor Glossary <https://docs.learnbittensor.org/glossary>
      - Wallets, Coldkeys and Hotkeys in Bittensor <https://docs.learnbittensor.org/keys/wallets>

   Initializes an AsyncSubtensor instance for blockchain interaction.

   :param network: The network name to connect to (e.g., `finney` for Bittensor mainnet, `test`, for
                   Bittensor test network, `local` for a locally deployed blockchain). If `None`, uses the
                   default network from config.
   :param config: Configuration object for the AsyncSubtensor instance. If `None`, uses the default configuration.
   :param log_verbose: Enables or disables verbose logging.
   :param fallback_endpoints: List of fallback WebSocket endpoints to use if the primary network endpoint is
                              unavailable. These are tried in order when the default endpoint fails.
   :param retry_forever: Whether to retry connection attempts indefinitely on connection errors.
   :param mock: Whether this is a mock instance. FOR TESTING ONLY.
   :param archive_endpoints: List of archive node endpoints for queries requiring historical block data beyond the
                             retention period of lite nodes. These are only used when requesting blocks that the current node is
                             unable to serve.
   :param websocket_shutdown_timer: Amount of time (in seconds) to wait after the last response from the chain before
                                    automatically closing the WebSocket connection. Pass `None` to disable automatic shutdown entirely.

   :returns: None


   .. py:method:: add_liquidity(wallet, netuid, liquidity, price_low, price_high, hotkey_ss58 = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Adds liquidity to the specified price range.

      :param wallet: The wallet used to sign the extrinsic (must be unlocked).
      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param liquidity: The amount of liquidity to be added.
      :param price_low: The lower bound of the price tick range. In TAO.
      :param price_high: The upper bound of the price tick range. In TAO.
      :param hotkey_ss58: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. note::

         Adding is allowed even when user liquidity is enabled in specified subnet. Call `toggle_user_liquidity`
         method to enable/disable user liquidity.



   .. py:method:: add_proxy(wallet, delegate_ss58, proxy_type, delay, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Adds a proxy relationship.

      This method creates a proxy relationship where the delegate can execute calls on behalf of the real account (the
      wallet owner) with restrictions defined by the proxy type and a delay period. A deposit is required and held as
      long as the proxy relationship exists.

      :param wallet: Bittensor wallet object.
      :param delegate_ss58: The SS58 address of the delegate proxy account.
      :param proxy_type: The type of proxy permissions (e.g., "Any", "NonTransfer", "Governance", "Staking"). Can be a
                         string or ProxyType enum value. For available proxy types and their permissions, see the documentation
                         link in the Notes section below.
      :param delay: Optionally, include a delay in blocks. The number of blocks that must elapse between announcing and
                    executing a proxied transaction. A delay of `0` means the proxy can be used immediately without
                    announcements. A non-zero delay creates a time-lock, requiring the proxy to announce calls via
                    :meth:`announce_proxy` before execution, giving the real account time to review and reject unwanted
                    operations via :meth:`reject_proxy_announcement`.
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
           returned when the proxy is removed. Use :meth:`get_proxy_constants` to check current deposit requirements.
         - For available proxy types and their specific permissions, see: <https://docs.learnbittensor.org/keys/proxies#types-of-proxies>
         - Bittensor proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>

      .. warning::

         The `Any` proxy type is dangerous as it grants full permissions to the proxy, including the ability to make
         transfers and manage the account completely. Use with extreme caution.



   .. py:method:: add_stake(wallet, netuid, hotkey_ss58, amount, safe_staking = False, allow_partial_stake = False, rate_tolerance = 0.005, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Adds a stake from the specified wallet to the neuron identified by the SS58 address of its hotkey in specified
      subnet. Staking is a fundamental process in the Bittensor network that enables neurons to participate actively
      and earn incentives.

      :param wallet: The wallet to be used for staking.
      :param netuid: The unique identifier of the subnet to which the neuron belongs.
      :param hotkey_ss58: The `ss58` address of the hotkey account to stake to default to the wallet's hotkey.
      :param amount: The amount of TAO to stake.
      :param safe_staking: If `True`, enables price safety checks to protect against fluctuating prices. The stake will
                           only execute if the price change doesn't exceed the rate tolerance.
      :param allow_partial_stake: If `True` and safe_staking is enabled, allows partial staking when the full amount would
                                  exceed the price tolerance. If false, the entire stake fails if it would exceed the tolerance.
      :param rate_tolerance: The maximum allowed price change ratio when staking. For example, 0.005 = 0.5% maximum price
                             increase. Only used when safe_staking is True.
      :param mev_protection: If `True`, encrypts and submits the staking transaction through the MEV Shield pallet to
                             protect against front-running and MEV attacks. The transaction remains encrypted in the mempool until
                             validators decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      This function enables neurons to increase their stake in the network, enhancing their influence and potential.
      When safe_staking is enabled, it provides protection against price fluctuations during the time stake is
      executed and the time it is actually processed by the chain.

      .. admonition:: Notes

         - Price Protection: <https://docs.learnbittensor.org/learn/price-protection>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#staking-operations-rate-limits>



   .. py:method:: add_stake_burn(wallet, netuid, hotkey_ss58, amount, limit_price = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Executes a subnet buyback by staking TAO and immediately burning the resulting Alpha.

      Only the subnet owner can call this method, and it is rate-limited to one call per subnet tempo.

      :param wallet: The wallet used to sign the extrinsic (must be the subnet owner).
      :param netuid: The unique identifier of the subnet.
      :param hotkey_ss58: The `SS58` address of the hotkey account to stake to.
      :param amount: The amount of TAO to use for the buyback.
      :param limit_price: Optional limit price expressed in units of RAO per one Alpha.
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



   .. py:method:: add_stake_multiple(wallet, netuids, hotkey_ss58s, amounts, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Adds stakes to multiple neurons identified by their hotkey SS58 addresses.
      This bulk operation allows for efficient staking across different neurons from a single wallet.

      :param wallet: The wallet used for staking.
      :param netuids: List of subnet UIDs.
      :param hotkey_ss58s: List of `SS58` addresses of hotkeys to stake to.
      :param amounts: List of corresponding TAO amounts to bet for each netuid and hotkey.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - Price Protection: <https://docs.learnbittensor.org/learn/price-protection>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#staking-operations-rate-limits>



   .. py:method:: all_subnets(block = None, block_hash = None, reuse_block = False)
      :async:


      Queries the blockchain for comprehensive information about all subnets, including their dynamic parameters
      and operational status.

      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: A list of `DynamicInfo` objects, each containing detailed information about
                a subnet, or None if the query fails.
      :rtype: Optional[list[DynamicInfo]]



   .. py:method:: announce_coldkey_swap(wallet, new_coldkey_ss58, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Announces a coldkey swap by submitting the BlakeTwo256 hash of the new coldkey.

      This method allows a coldkey to declare its intention to swap to a new coldkey address. The announcement must be
      made before the actual swap can be executed, and a delay period must pass before execution is allowed.
      After making an announcement, all transactions from the coldkey are blocked except for `swap_coldkey_announced`.

      :param wallet: Bittensor wallet object (should be the current coldkey wallet).
      :param new_coldkey_ss58: SS58 address of the new coldkey that will replace the current one.
      :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If ``False``, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
      :param wait_for_finalization: Whether to wait for the finalization of the transaction.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - A swap cost is charged when making the first announcement (not when reannouncing).
         - After making an announcement, all transactions from the coldkey are blocked except for
             `swap_coldkey_announced`.
         - The swap can only be executed after the delay period has passed (check via
             `get_coldkey_swap_announcement`).
         - See: <https://docs.learnbittensor.org/keys/coldkey-swap>



   .. py:method:: announce_proxy(wallet, real_account_ss58, call_hash, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Announces a future call that will be executed through a proxy.

      This method allows a proxy account to declare its intention to execute a specific call on behalf of a real
      account after a delay period. The real account can review and either approve (via :meth:`proxy_announced`) or reject
      (via :meth:`reject_proxy_announcement`) the announcement.

      :param wallet: Bittensor wallet object (should be the proxy account wallet).
      :param real_account_ss58: The SS58 address of the real account on whose behalf the call will be made.
      :param call_hash: The hash of the call that will be executed in the future.
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
         - Bittensor proxies: <https://docs.learnbittensor.org/keys/proxies>



   .. py:property:: block

      Provides an asynchronous getter to retrieve the current block number.

      :returns: The current blockchain block number.


   .. py:method:: blocks_since_last_step(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Queries the blockchain to determine how many blocks have passed since the last epoch step for a specific
      subnet.

      :param netuid: The unique identifier of the subnetwork.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The number of blocks since the last step in the subnet, or None if the query fails.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#epoch>



   .. py:method:: blocks_since_last_update(netuid, uid, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns the number of blocks since the last update, or `None` if the subnetwork or UID does not exist.

      :param netuid: The unique identifier of the subnetwork.
      :param uid: The unique identifier of the neuron.
      :param block: The block number for this query. Do not specify if using block_hash or reuse_block.
      :param block_hash: The hash of the block for the query. Do not specify if using reuse_block or block.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The number of blocks since the last update, or None if the subnetwork or UID does not exist.



   .. py:method:: blocks_until_next_epoch(netuid, tempo = None, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns the number of blocks until the next epoch of subnet with provided netuid.

      :param netuid: The unique identifier of the subnetwork.
      :param tempo: The tempo of the subnet.
      :param block: The block number to query. Do not specify if using block_hash or reuse_block.
      :param block_hash: The block hash at which to check the parameter. Do not set if using block or reuse_block.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using block_hash or block.

      :returns: The number of blocks until the next epoch of the subnet with provided netuid.



   .. py:method:: bonds(netuid, mechid = 0, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the bond distribution set by subnet validators within a specific subnet.

      Bonds represent a validator's accumulated assessment of each miner's performance over time, which serves as the
      starting point of Yuma Consensus.

      :param netuid: Subnet identifier.
      :param mechid: Subnet mechanism identifier (default 0 for primary mechanism).
      :param block: The block number for this query. Do not specify if using block_hash or reuse_block.
      :param block_hash: The hash of the block for the query. Do not specify if using reuse_block or block.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:     - validator_uid: The UID of the validator
                    - bonds: List of (miner_uid, bond_value) pairs

                Bond values are u16-normalized (0-65535, where 65535 = 1.0 or 100%).
      :rtype: List of tuples, where each tuple contains

      .. admonition:: Example

         # Get bonds for subnet 1
         bonds = await subtensor.bonds(netuid=1)
         print(bonds[0])
         # example output: (5, [(0, 32767), (1, 16383), (3, 8191)])
         # This means validator UID 5 has bonds: 50% to miner 0, 25% to miner 1, 12.5% to miner 3

      .. admonition:: Notes

         - See: <https://docs.learnbittensor.org/glossary#validator-miner-bonds>
         - See: <https://docs.learnbittensor.org/glossary#yuma-consensus>



   .. py:method:: burned_register(wallet, netuid, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Registers a neuron on the Bittensor network by recycling TAO. This method of registration involves recycling
      TAO tokens, allowing them to be re-mined by performing work on the network.

      :param wallet: The wallet associated with the neuron to be registered.
      :param netuid: The unique identifier of the subnet.
      :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#registration-rate-limits>



   .. py:method:: claim_root(wallet, netuids, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Submit an extrinsic to manually claim accumulated root dividends from one or more subnets.

      :param wallet: Bittensor `Wallet` instance.
      :param netuids: Iterable of subnet IDs to claim from in this call (the chain enforces a maximum number per
                      transaction).
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: Number of blocks during which the transaction remains valid after submission. If the extrinsic is
                     not included in a block within this window, it will expire and be rejected.
      :param raise_error: Whether to raise a Python exception instead of returning a failed `ExtrinsicResponse`.
      :param wait_for_inclusion: Whether to wait until the extrinsic is included in a block before returning.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic in a block before returning.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` describing the result of the extrinsic execution.

      .. admonition:: Notes

         - Only Alpha dividends are claimed; the underlying TAO stake on the Root Subnet remains unchanged.
         - The current root claim type (`Swap` or `Keep`) determines whether claimed Alpha is converted to
           TAO and restaked on root or left as Alpha on the originating subnets.
         - See: <https://docs.learnbittensor.org/staking-and-delegation/root-claims>
         - See also: <https://docs.learnbittensor.org/staking-and-delegation/root-claims/managing-root-claims>
         - Transaction fees: <https://docs.learnbittensor.org/learn/fees>



   .. py:method:: clear_coldkey_swap_announcement(wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Clears (withdraws) a pending coldkey swap announcement.

      Callable by the coldkey that has an active, undisputed swap announcement. The reannouncement delay must have
      elapsed past the execution block before the announcement can be cleared.

      :param wallet: Bittensor wallet object (should be the current coldkey with an active announcement).
      :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet.
      :param period: The number of blocks during which the transaction will remain valid.
      :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
      :param wait_for_finalization: Whether to wait for the finalization of the transaction.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - The coldkey must have an active, undisputed swap announcement.
         - The reannouncement delay must have elapsed past the execution block.



   .. py:method:: close()
      :async:


      Closes the connection to the blockchain.

      Use this to explicitly clean up resources and close the network connection instead of waiting for garbage
      collection.

      :returns: None

      .. admonition:: Example

         sub = bt.AsyncSubtensor(network="finney")
         
         # Initialize the connection
         
         await subtensor.initialize()
         
         # calls to subtensor
         
         await subtensor.close()



   .. py:method:: commit_reveal_enabled(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Check if commit-reveal mechanism is enabled for a given subnet at a specific block.

      :param netuid: The unique identifier of the subnet for which to check the commit-reveal mechanism.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: True if commit-reveal mechanism is enabled, False otherwise.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#commit-reveal>
         - <https://docs.learnbittensor.org/subnets/subnet-hyperparameters>



   .. py:method:: commit_weights(wallet, netuid, salt, uids, weights, mechid = 0, version_key = version_as_int, max_attempts = 5, *, mev_protection = DEFAULT_MEV_PROTECTION, period = 16, raise_error = True, wait_for_inclusion = False, wait_for_finalization = False, wait_for_revealed_execution = True)
      :async:


      Commits a hash of the subnet validator's weight vector to the Bittensor blockchain using the provided wallet.
      This action serves as a commitment or snapshot of the validator's current weight distribution.

      :param wallet: The wallet associated with the neuron committing the weights.
      :param netuid: The unique identifier of the subnet.
      :param salt: list of randomly generated integers as salt to generated weighted hash.
      :param uids: NumPy array of neuron UIDs for which weights are being committed.
      :param weights: NumPy array of weight values corresponding to each UID.
      :param mechid: The subnet mechanism unique identifier.
      :param version_key: Version key for compatibility with the network.
      :param max_attempts: The number of maximum attempts to commit weights.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      This function allows subnet validators to create a tamper-proof record of their weight vector at a specific
      point in time, creating a foundation of transparency and accountability for the Bittensor network.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#commit-reveal>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#weights-setting-rate-limit>



   .. py:method:: compose_call(call_module, call_function, call_params, block = None, block_hash = None, reuse_block = False)
      :async:


      Dynamically compose a GenericCall using on-chain Substrate metadata after validating the provided parameters.

      :param call_module: Pallet name (e.g. "SubtensorModule", "AdminUtils").
      :param call_function: Function name (e.g. "set_weights", "sudo_set_tempo").
      :param call_params: Dictionary of parameters for the call.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of the block id.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: Composed call object ready for extrinsic submission.
      :rtype: GenericCall

      .. admonition:: Notes

         For detailed documentation and examples of composing calls, including the CallBuilder utility, see:
         <https://docs.learnbittensor.org/sdk/call>



   .. py:method:: contribute_crowdloan(wallet, crowdloan_id, amount, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Contributes TAO to an active crowdloan campaign.

      Contributions must occur before the crowdloan's end block and are subject to minimum contribution
      requirements. If a contribution would push the total raised above the cap, it is automatically clipped
      to fit the remaining amount. Once the cap is reached, further contributions are rejected.


      :param wallet: Bittensor wallet instance used to sign the transaction (coldkey pays, coldkey receives emissions).
      :param crowdloan_id: The unique identifier of the crowdloan to contribute to.
      :param amount: Amount to contribute (TAO). Must meet or exceed the campaign's `min_contribution`.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted.
      :param raise_error: If `True`, raises an exception rather than returning failure in the response.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` indicating success or failure, with error details if applicable.

      .. admonition:: Notes

         - Contributions can be withdrawn before finalization via `withdraw_crowdloan`.
         - If the campaign does not reach its cap by the end block, contributors can be refunded via `refund_crowdloan`.
         - Contributions are counted toward `MaxContributors` limit per crowdloan.
         
         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Crowdloan Tutorial: <https://docs.learnbittensor.org/subnets/crowdloans/crowdloans-tutorial#step-4-contribute-to-the-crowdloan>



   .. py:method:: create_crowdloan(wallet, deposit, min_contribution, cap, end, call = None, target_address = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Creates a new crowdloan campaign on-chain.

      :param wallet: Bittensor Wallet instance used to sign the transaction.
      :param deposit: Initial deposit in RAO from the creator.
      :param min_contribution: Minimum contribution amount.
      :param cap: Maximum cap to be raised.
      :param end: Block number when the campaign ends.
      :param call: Runtime call data (e.g., subtensor::register_leased_network).
      :param target_address: SS58 address to transfer funds to on success.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` indicating success or failure. On success, the crowdloan ID can be extracted from the
                `Crowdloan.Created` event in the response.

      .. admonition:: Notes

         - Creator cannot update `call` or `target_address` after creation.
         - Creator can update `cap`, `end`, and `min_contribution` before finalization via `update_*` methods.
         - Use `get_crowdloan_next_id` to determine the ID that will be assigned to the new crowdloan.
         
         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Crowdloan Tutorial: <https://docs.learnbittensor.org/subnets/crowdloans/crowdloans-tutorial#step-3-create-a-crowdloan>



   .. py:method:: create_pure_proxy(wallet, proxy_type, delay, index, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Creates a pure proxy account.

      A pure proxy is a keyless account that can only be controlled through proxy relationships. Unlike regular
      proxies, pure proxies do not have their own private keys, making them more secure for certain use cases. The
      pure proxy address is deterministically generated based on the spawner account, proxy type, delay, and index.

      :param wallet: Bittensor wallet object.
      :param proxy_type: The type of proxy permissions for the pure proxy. Can be a string or ProxyType enum value. For
                         available proxy types and their permissions, see the documentation link in the Notes section below.
      :param delay: Optionally, include a delay in blocks. The number of blocks that must elapse between announcing and
                    executing a proxied transaction. A delay of `0` means the pure proxy can be used immediately without any
                    announcement period. A non-zero delay creates a time-lock, requiring announcements before execution to give
                    the spawner time to review/reject.
      :param index: A salt value (u16, range `0-65535`) used to generate unique pure proxy addresses. This should generally
                    be left as `0` unless you are creating batches of proxies. When creating multiple pure proxies with
                    identical parameters (same `proxy_type` and `delay`), different index values will produce different SS58
                    addresses. This is not a sequential counter—you can use any unique values (e.g., 0, 100, 7, 42) in any
                    order. The index must be preserved as it's required for :meth:`kill_pure_proxy`. If creating multiple pure
                    proxies in a single batch transaction, each must have a unique index value.
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

         - The pure proxy account address can be extracted from the "PureCreated" event in the response. Store the
           spawner address, proxy_type, index, height, and ext_index as they are required to kill the pure proxy later
           via :meth:`kill_pure_proxy`.
         - For available proxy types and their specific permissions, see: <https://docs.learnbittensor.org/keys/proxies#types-of-proxies>
         - Bittensor proxies: <https://docs.learnbittensor.org/keys/proxies/pure-proxies>

      .. warning::

         The `Any` proxy type is dangerous as it grants full permissions to the proxy, including the ability to make
         transfers and kill the proxy. Use with extreme caution.



   .. py:method:: determine_block_hash(block = None, block_hash = None, reuse_block = False)
      :async:


      Determine the block hash for the block specified with the provided parameters.

      Ensures that only one of the block specification parameters is used and returns the appropriate block hash
      for blockchain queries.

      Parameter precedence (in order):
          1. If `reuse_block=True` and `block` or `block_hash` is set → raises ValueError
          2. If both `block` and `block_hash` are set → validates they match, raises ValueError if not
          3. If only `block_hash` is set → returns it directly
          4. If only `block` is set → fetches and returns its hash
          5. If none are set → returns `None`

      :param block: The block number to get the hash for. If specifying along with `block_hash`, the hash of `block`
                    will be checked and compared with the supplied block hash, raising a ValueError if the two do not match.
      :param block_hash: The hash of the blockchain block (hex string prefixed with `0x`). If specifying along with
                         `block`, the hash of `block` will be checked and compared with the supplied block hash, raising a
                         ValueError if the two do not match.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block` or `block_hash`.

      :returns: The block hash (hex string with `0x` prefix) if one can be determined, `None` otherwise.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#block>



   .. py:method:: difficulty(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the 'Difficulty' hyperparameter for a specified subnet in the Bittensor network.

      This parameter determines the computational challenge required for neurons to participate in consensus and
       validation processes, using proof of work (POW) registration.


      :param netuid: The unique identifier of the subnet.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The value of the 'Difficulty' hyperparameter if the subnet exists, `None` otherwise.

      .. admonition:: Notes

         Burn registration is much more common on Bittensor subnets currently, compared to POW registration.
         
         - <https://docs.learnbittensor.org/subnets/subnet-hyperparameters>
         - <https://docs.learnbittensor.org/validators#validator-registration>
         - <https://docs.learnbittensor.org/miners#miner-registration>



   .. py:method:: dispute_coldkey_swap(wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Disputes the coldkey swap announcement for the current coldkey.

      Callable by the coldkey that has an active swap announcement. Marks the swap as disputed. The account is blocked
      until root calls reset_coldkey_swap.

      :param wallet: Bittensor wallet object (should be the current coldkey with an active announcement).
      :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet.
      :param period: The number of blocks during which the transaction will remain valid.
      :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
      :param wait_for_finalization: Whether to wait for the finalization of the transaction.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - The coldkey must have an active swap announcement.
         - After disputing, only root can clear the state via reset_coldkey_swap.



   .. py:method:: dissolve_crowdloan(wallet, crowdloan_id, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Dissolves a failed or refunded crowdloan, cleaning up storage and returning the creator's deposit.

      This permanently removes the crowdloan from on-chain storage and returns the creator's deposit. Can only
      be called by the creator after all non-creator contributors have been refunded via `refund_crowdloan`.
      This is the final step in the lifecycle of a failed crowdloan (one that did not reach its cap by the end
      block).

      :param wallet: Bittensor wallet instance used to sign the transaction (must be the creator's coldkey).
      :param crowdloan_id: The unique identifier of the crowdloan to dissolve.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after submission.
      :param raise_error: If `True`, raises an exception rather than returning failure in the response.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` indicating success or failure, with error details if applicable.

      .. admonition:: Notes

         - Only the creator can dissolve their own crowdloan.
         - All non-creator contributors must be refunded first via `refund_crowdloan`.
         - The creator's deposit (and any remaining contribution above deposit) is returned.
         - After dissolution, the crowdloan is permanently removed from chain storage.
         
         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Refund and Dissolve: <https://docs.learnbittensor.org/subnets/crowdloans/crowdloans-tutorial#alternative-path-refund-and-dissolve>



   .. py:method:: does_hotkey_exist(hotkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns true if the hotkey has been associated with a coldkey through account creation.

      This method queries the Subtensor's Owner storage map to check if the hotkey has been paired with a
      coldkey, as it must be before it (the hotkey) can be used for neuron registration.

      The Owner storage map defaults to the zero address (`5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM`)
      for unused hotkeys. This method returns `True` if the Owner value is anything other than this default.

      :param hotkey_ss58: The SS58 address of the hotkey.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: True if the hotkey has been associated with a coldkey, False otherwise.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#hotkey>



   .. py:method:: filter_netuids_by_registered_hotkeys(all_netuids, filter_for_netuids, all_hotkeys, block = None, block_hash = None, reuse_block = False)
      :async:


      Filters netuids by combining netuids from all_netuids and netuids with registered hotkeys.

      If filter_for_netuids is empty/None:
          Returns all netuids where hotkeys from all_hotkeys are registered.

      If filter_for_netuids is provided:
          Returns the union of:
          - Netuids from all_netuids that are in filter_for_netuids, AND
          - Netuids with registered hotkeys that are in filter_for_netuids

      This allows you to get netuids that are either in your specified list (all_netuids) or have registered hotkeys,
      as long as they match filter_for_netuids.

      :param all_netuids: A list of netuids to consider for filtering.
      :param filter_for_netuids: A subset of netuids to restrict the result to. If None/empty, returns
                                 all netuids with registered hotkeys.
      :param all_hotkeys: Hotkeys to check for registration.
      :param block: The blockchain block number for the query.
      :param block_hash: hash of the blockchain block number at which to perform the query.
      :param reuse_block: whether to reuse the last-used blockchain hash when retrieving info.

      :returns: The filtered list of netuids (union of filtered all_netuids and registered hotkeys).



   .. py:method:: finalize_crowdloan(wallet, crowdloan_id, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Finalizes a successful crowdloan after the cap is fully raised and the end block has passed.

      Finalization executes the stored call (e.g., `register_leased_network`) or transfers raised funds to
      the target address. For subnet lease crowdloans, this registers the subnet, creates a
      `SubnetLeaseBeneficiary` proxy for the creator, and records contributor shares for pro-rata emissions
      distribution. Leftover funds (after registration and proxy costs) are refunded to contributors.

      Only the creator can finalize, and finalization can only occur after both the end block is reached and
      the total raised equals the cap.

      :param wallet: Bittensor wallet instance used to sign the transaction (must be the creator's coldkey).
      :param crowdloan_id: The unique identifier of the crowdloan to finalize.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after submission.
      :param raise_error: If `True`, raises an exception rather than returning failure in the response.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` indicating success or failure. On success, a subnet lease is created (if applicable)
                and contributor shares are recorded for emissions.

      .. admonition:: Notes

         - Only the creator can finalize.
         - Finalization requires `raised == cap` and `current_block >= end`.
         - For subnet leases, emissions are swapped to TAO and distributed to contributors' coldkeys during the lease.
         - Leftover cap (after subnet lock + proxy deposit) is refunded to contributors pro-rata.
         
         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Crowdloan Tutorial: <https://docs.learnbittensor.org/subnets/crowdloans/crowdloans-tutorial#step-5-finalize-the-crowdloan>
         - Emissions Distribution: <https://docs.learnbittensor.org/subnets/crowdloans#emissions-distribution-during-a-lease>



   .. py:method:: get_admin_freeze_window(block = None, block_hash = None, reuse_block = False)
      :async:


      Returns the duration, in blocks, of the administrative freeze window at the end of each epoch.

      The admin freeze window is a period at the end of each epoch during which subnet owner
      operations are prohibited. This prevents subnet owners from modifying hyperparameters or performing certain
      administrative actions right before validators submit weights at the epoch boundary.

      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: 10 blocks, ~2 minutes).
      :rtype: The number of blocks in the administrative freeze window (default

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/learn/chain-rate-limits#administrative-freeze-window>



   .. py:method:: get_all_commitments(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves raw commitment metadata from a given subnet.

      This method retrieves all commitment data for all neurons in a specific subnet. This is useful for analyzing the
      commit-reveal patterns across an entire subnet.

      :param netuid: The unique identifier of the subnetwork.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: commitment with the commitment as a string.
      :rtype: A mapping of the ss58

      .. admonition:: Example

         # TODO add example of how to handle realistic commitment data



   .. py:method:: get_all_ema_tao_inflow(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the EMA (exponential moving average) of net TAO flows for all subnets.

      The EMA tracks net TAO flows (staking minus unstaking) with a 30-day half-life (~86.8 day window), smoothing
      out short-term fluctuations while capturing sustained staking trends. This metric determines the subnet's share
      of TAO emissions under the current, flow-based model. Positive values indicate net inflow (more staking than unstaking),
      negative values indicate net outflow. Subnets with negative EMA flows receive zero emissions.

      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: Dict mapping netuid to (last_updated_block, ema_flow). The Balance represents the EMA of net TAO flow in
                TAO units. Positive values indicate sustained net inflow, negative values indicate sustained net outflow.

      The EMA uses a smoothing factor α ≈ 0.000003209, creating a 30-day half-life and ~86.8 day window. Only
      direct stake/unstake operations count toward flows; neuron registrations and root claims are excluded.
      Subnet 0 (root network) does not have an EMA TAO flow value.

      .. admonition:: Notes

         - Flow-based emissions: <https://docs.learnbittensor.org/learn/emissions#tao-reserve-injection>
         - EMA smoothing: <https://docs.learnbittensor.org/learn/ema>



   .. py:method:: get_all_metagraphs_info(all_mechanisms = False, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves a list of MetagraphInfo objects for all subnets

      :param all_mechanisms: If True then returns all mechanisms, otherwise only those with index 0 for all subnets.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number at which to perform the query.
      :param reuse_block: Whether to reuse the last-used block hash when retrieving info.

      :returns: List of MetagraphInfo objects for all existing subnets.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#metagraph>



   .. py:method:: get_all_neuron_certificates(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the TLS certificates for neurons within a specified subnet (netuid) of the Bittensor network.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block to retrieve the parameter from. Do not specify if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to use the last-used block. Do not set if using `block_hash` or `block`.

      :returns: Dictionary mapping neuron hotkey SS58 addresses to their Certificate objects. Only includes neurons
                that have registered certificates.

      .. admonition:: Notes

         This method is used for certificate discovery to establish mutual TLS communication between neurons.
         - <https://docs.learnbittensor.org/subnets/neuron-tls-certificates>



   .. py:method:: get_all_revealed_commitments(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all revealed commitments for a given subnet.

      :param netuid: The unique identifier of the subnetwork.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: A dictionary mapping hotkey addresses to tuples of (reveal_block, commitment_message) pairs.
                Each validator can have multiple revealed commitments (up to 10 most recent).

      .. admonition:: Example

         # sample return value
         
         {
         
             "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY": ( (12, "Alice message 1"), (152, "Alice message 2") ),
         
             "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty": ( (12, "Bob message 1"), (147, "Bob message 2") ),
         
         }

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#commit-reveal>



   .. py:method:: get_all_subnets_info(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves detailed information about all subnets within the Bittensor network.

      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: A list of SubnetInfo objects, each containing detailed information about a subnet.



   .. py:method:: get_all_subnets_netuid(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the list of all subnet unique identifiers (netuids) currently present in the Bittensor network.

      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block to retrieve the subnet unique identifiers from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: A list of subnet netuids.

      This function provides a comprehensive view of the subnets within the Bittensor network, offering insights into
      its diversity and scale.



   .. py:method:: get_auto_stakes(coldkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Fetches auto stake destinations for a given wallet across all subnets.

      :param coldkey_ss58: Coldkey ss58 address.
      :param block: The block number for the query.
      :param block_hash: The block hash for the query.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns:     - netuid: The unique identifier of the subnet.
                    - hotkey: The hotkey of the wallet.
      :rtype: Dictionary mapping netuid to hotkey, where

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/miners/autostaking>



   .. py:method:: get_balance(address, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the balance for given coldkey.

      This method queries the System module's Account storage to get the current balance of a coldkey address. The
      balance represents the amount of TAO tokens held by the specified address.

      :param address: The coldkey address in SS58 format.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The balance object containing the account's TAO balance.
      :rtype: Balance



   .. py:method:: get_balances(*addresses, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the balance for given coldkey(s).

      This method efficiently queries multiple coldkey addresses in a single batch operation, returning a dictionary
      mapping each address to its corresponding balance. This is more efficient than calling get_balance multiple
      times.

      :param \*addresses: Variable number of coldkey addresses in SS58 format.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: A dictionary mapping each address to its Balance object.



   .. py:method:: get_block_hash(block = None)
      :async:


      Retrieves the hash of a specific block on the Bittensor blockchain.

      The block hash is a unique identifier representing the cryptographic hash of the block's content, ensuring its
      integrity and immutability. It is a fundamental aspect of blockchain technology, providing a secure reference
      to each block's data. It is crucial for verifying transactions, ensuring data consistency, and maintaining the
      trustworthiness of the blockchain.

      :param block: The block number for which the hash is to be retrieved. If `None`, returns the latest block hash.

      :returns: The cryptographic hash of the specified block.
      :rtype: str

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#block>



   .. py:method:: get_block_info(block = None, block_hash = None)
      :async:


      Retrieve complete information about a specific block from the Subtensor chain.

      This method aggregates multiple low-level RPC calls into a single structured response, returning both the raw
      on-chain data and high-level decoded metadata for the given block.

      :param block: The block number for which the hash is to be retrieved.
      :param block_hash: The hash of the block to retrieve the block from.

      :returns:

                A dataclass containing all available information about the specified block, including:

                    - number: The block number.
                    - hash: The corresponding block hash.
                    - timestamp: The timestamp of the block (based on the `Timestamp.Now` extrinsic).
                    - header: The raw block header returned by the node RPC.
                    - extrinsics: The list of decoded extrinsics included in the block.
                    - explorer: The link to block explorer service. Always related with finney block data.
      :rtype: BlockInfo instance



   .. py:method:: get_children(hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the children of a given hotkey and netuid.

      This method queries the SubtensorModule's ChildKeys storage function to get the children and formats them before
      returning as a tuple. It provides information about the child neurons that a validator has set for weight
      distribution.

      :param hotkey_ss58: The hotkey value.
      :param netuid: The netuid value.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:

                A tuple containing a boolean indicating success or failure, a list of formatted children with their
                    proportions, and an error message (if applicable).

      .. admonition:: Example

         # Get children for a hotkey in subnet 1
         success, children, error = await subtensor.get_children(hotkey="5F...", netuid=1)
         if success:
             for proportion, child_hotkey in children:
                 print(f"Child {child_hotkey}: {proportion}")

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/validators/child-hotkeys>



   .. py:method:: get_children_pending(hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the pending children of a given hotkey and netuid.

      This method queries the SubtensorModule's PendingChildKeys storage function to get children that are pending
      approval or in a cooldown period. These are children that have been proposed but not yet finalized.

      :param hotkey_ss58: The hotkey value.
      :param netuid: The netuid value.
      :param block: The block number for which the children are to be retrieved.
      :param block_hash: The hash of the block to retrieve the subnet unique identifiers from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns:

                A tuple containing:
                    - list[tuple[float, str]]: A list of children with their proportions.
                    - int: The cool-down block number.
      :rtype: tuple

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/validators/child-hotkeys>



   .. py:method:: get_coldkey_swap_announcement(coldkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves coldkey swap announcement for a specific coldkey.

      This method queries the SubtensorModule.ColdkeySwapAnnouncements storage for an announcement made by the given
      coldkey. Announcements allow a coldkey to declare its intention to swap to a new coldkey address after a delay
      period.

      :param coldkey_ss58: SS58 address of the coldkey whose announcement to retrieve.
      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:

                ColdkeySwapAnnouncementInfo if announcement exists, None otherwise. Contains the execution block and
                    new coldkey hash.

      .. admonition:: Notes

         - If the coldkey has no announcement, returns None.
         - See: <https://docs.learnbittensor.org/keys/coldkey-swap>



   .. py:method:: get_coldkey_swap_announcement_delay(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the ColdkeySwapAnnouncementDelay storage value.

      This method queries the SubtensorModule.ColdkeySwapAnnouncementDelay storage value, which defines the number
      of blocks that must elapse after making an announcement before the swap can be executed.

      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The number of blocks that must elapse before swap execution (integer).

      .. admonition:: Notes

         - This is a storage value (can be changed via admin extrinsics), not a runtime constant.
         - See: <https://docs.learnbittensor.org/keys/coldkey-swap>



   .. py:method:: get_coldkey_swap_announcements(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all coldkey swap announcements from the chain.

      This method queries the SubtensorModule.ColdkeySwapAnnouncements storage map across all coldkeys and returns a
      list of all active announcements.

      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: List of ColdkeySwapAnnouncementInfo objects representing all active coldkey swap announcements on the chain.

      .. admonition:: Notes

         - This method queries all announcements on the chain, which may be resource-intensive for large networks.
           Consider using :meth:`get_coldkey_swap_announcement` for querying specific coldkeys.
         - See: <https://docs.learnbittensor.org/keys/coldkey-swap>



   .. py:method:: get_coldkey_swap_constants(constants = None, as_dict = False, block = None, block_hash = None, reuse_block = False)
      :async:


      Fetches runtime configuration constants for coldkey swap operations.

      This method retrieves on-chain runtime constants that define cost requirements for coldkey swap operations.
      Note: For delay values (ColdkeySwapAnnouncementDelay and ColdkeySwapReannouncementDelay), use the dedicated
      query methods `get_coldkey_swap_announcement_delay()` and `get_coldkey_swap_reannouncement_delay()` instead,
      as these are storage values, not runtime constants.

      :param constants: Optional list of specific constant names to fetch. If omitted, all constants defined in
                        `ColdkeySwapConstants.constants_names()` are queried. Valid constant names include: "KeySwapCost".
      :param as_dict: If True, returns the constants as a dictionary instead of a `ColdkeySwapConstants` object.
      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: ColdkeySwapConstants object containing all requested constants.
                If `as_dict` is True: Dictionary mapping constant names to their values (integers for cost in RAO).
      :rtype: If `as_dict` is False

      .. admonition:: Notes

         - All amounts are returned in RAO. Values reflect the current chain configuration at the specified block.
         - KeySwapCost is a runtime constant (queryable via constants).
         - See: <https://docs.learnbittensor.org/keys/coldkey-swap>



   .. py:method:: get_coldkey_swap_dispute(coldkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves coldkey swap dispute for a specific coldkey.

      This method queries the SubtensorModule.ColdkeySwapDisputes storage for a dispute recorded for the given
      coldkey. When a coldkey swap is disputed, the account is frozen until a root-only reset clears it.

      :param coldkey_ss58: SS58 address of the coldkey whose dispute to retrieve.
      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: ColdkeySwapDisputeInfo if dispute exists, None otherwise. Contains the disputed block number.

      .. admonition:: Notes

         - If the coldkey has no dispute, returns None.
         - See: <https://docs.learnbittensor.org/keys/coldkey-swap>



   .. py:method:: get_coldkey_swap_disputes(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all coldkey swap disputes from the chain.

      This method queries the SubtensorModule.ColdkeySwapDisputes storage map across all coldkeys and returns a
      list of all active disputes.

      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: List of ColdkeySwapDisputeInfo objects representing all active coldkey swap disputes on the chain.

      .. admonition:: Notes

         - This method queries all disputes on the chain, which may be resource-intensive for large networks.
           Consider using :meth:`get_coldkey_swap_dispute` for querying specific coldkeys.
         - See: <https://docs.learnbittensor.org/keys/coldkey-swap>



   .. py:method:: get_coldkey_swap_reannouncement_delay(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the ColdkeySwapReannouncementDelay storage value.

      This method queries the SubtensorModule.ColdkeySwapReannouncementDelay storage value, which defines the number
      of blocks that must elapse between the original announcement and a reannouncement.

      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The number of blocks that must elapse before reannouncement (integer).

      .. admonition:: Notes

         - This is a storage value (can be changed via admin extrinsics), not a runtime constant.
         - See: <https://docs.learnbittensor.org/keys/coldkey-swap>



   .. py:method:: get_commitment(netuid, uid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the on-chain commitment for a specific neuron in the Bittensor network.

      This method retrieves the commitment data that a neuron has published to the blockchain. Commitments are used in
      the commit-reveal mechanism for secure weight setting and other network operations.

      :param netuid: The unique identifier of the subnetwork.
      :param uid: The unique identifier of the neuron.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The commitment data as a string.


                # TODO: add a real example of how to handle realistic commitment data, or chop example

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#commit-reveal>



   .. py:method:: get_commitment_metadata(netuid, hotkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Fetches raw commitment metadata from specific subnet for given hotkey.

      :param netuid: The unique subnet identifier.
      :param hotkey_ss58: The hotkey ss58 address.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block at which to check the hotkey ownership.
      :param reuse_block: Whether to reuse the last-used blockchain hash.

      :returns: The raw commitment metadata. Returns a dict when commitment data exists,
                or an empty string when no commitment is found for the given hotkey on the subnet.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#commit-reveal>



   .. py:method:: get_crowdloan_by_id(crowdloan_id, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves detailed information about a specific crowdloan campaign.

      :param crowdloan_id: Unique identifier of the crowdloan (auto-incremented starting from 0).
      :param block: The blockchain block number for the query.
      :param block_hash: The block hash at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: campaign ID, creator address, creator's deposit,
                minimum contribution amount, end block, funding cap, funds account address, amount raised,
                optional target address, optional embedded call, finalization status, and contributor count.
                Returns `None` if the crowdloan does not exist.
      :rtype: `CrowdloanInfo` object containing

      .. admonition:: Notes

         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>



   .. py:method:: get_crowdloan_constants(constants = None, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves runtime configuration constants governing crowdloan behavior and limits on the Bittensor blockchain.

      If a list of constant names is provided, only those constants will be queried.
      Otherwise, all known constants defined in `CrowdloanConstants.field_names()` are fetched.

      These constants define requirements and operational limits for crowdloan campaigns:
          AbsoluteMinimumContribution: Minimum amount per contribution (TAO).
          MaxContributors: Maximum number of unique contributors per crowdloan.
          MaximumBlockDuration: Maximum duration (in blocks) for a crowdloan campaign (60 days = 432,000 blocks on
              production).
          MinimumDeposit: Minimum deposit required from the creator (TAO).
          MinimumBlockDuration: Minimum duration (in blocks) for a crowdloan campaign (7 days = 50,400 blocks on
              production).
          RefundContributorsLimit: Maximum number of contributors refunded per `refund_crowdloan` call (typically 50).

      :param constants: Specific constant names to query. If `None`, retrieves all constants from `CrowdloanConstants`.
      :param block: The blockchain block number for the query.
      :param block_hash: The block hash at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: A `CrowdloanConstants` data object containing the queried constants. Missing constants return `None`.

      .. admonition:: Notes

         These constants enforce contribution floors, duration bounds, and refund batching limits.
         
         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>



   .. py:method:: get_crowdloan_contributions(crowdloan_id, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all contributions made to a specific crowdloan campaign.

      Returns a mapping of contributor coldkey addresses to their contribution amounts in Rao.

      :param crowdloan_id: The unique identifier of the crowdloan.
      :param block: The blockchain block number for the query.
      :param block_hash: The block hash at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: Dictionary mapping contributor SS58 addresses to their `Balance` contribution amounts (in Rao).
                Returns empty dictionary if the crowdloan has no contributions or does not exist.

      .. admonition:: Notes

         Contributions are clipped to the remaining cap. Once the cap is reached, no further contributions are accepted.
         
         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Crowdloan Tutorial: <https://docs.learnbittensor.org/subnets/crowdloans/crowdloans-tutorial#step-4-contribute-to-the-crowdloan>



   .. py:method:: get_crowdloan_next_id(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the next available crowdloan identifier.

      Crowdloan IDs are allocated sequentially starting from 0. This method returns the ID that will be
      assigned to the next crowdloan created via :meth:`create_crowdloan`.

      :param block: The blockchain block number for the query.
      :param block_hash: The block hash at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The next crowdloan ID (integer) to be assigned.

      .. admonition:: Notes

         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Crowdloan Tutorial: <https://docs.learnbittensor.org/subnets/crowdloans/crowdloans-tutorial#get-the-crowdloan-id>



   .. py:method:: get_crowdloans(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all existing crowdloan campaigns with their metadata.

      Returns comprehensive information for all crowdloans registered on the blockchain, including
      both active and finalized campaigns.

      :param block: The blockchain block number for the query.
      :param block_hash: The block hash at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: campaign ID, creator address, creator's deposit,
                minimum contribution amount, end block, funding cap, funds account address, amount raised,
                optional target address, optional embedded call, finalization status, and contributor count.
                Returns empty list if no crowdloans exist.
      :rtype: List of `CrowdloanInfo` objects, each containing

      .. admonition:: Notes

         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Crowdloan Lifecycle: <https://docs.learnbittensor.org/subnets/crowdloans#crowdloan-lifecycle>



   .. py:method:: get_current_block()
      :async:


      Returns the current block number on the Bittensor blockchain.

      This function provides the latest block number, indicating the most recent state of the blockchain.

      :returns: The current chain block number.
      :rtype: int

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#block>



   .. py:method:: get_delegate_by_hotkey(hotkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves detailed information about a delegate neuron (validator) based on its hotkey. This function
      provides a comprehensive view of the delegate's status, including its stakes, nominators, and reward
      distribution.

      :param hotkey_ss58: The `SS58` address of the delegate's hotkey.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: Detailed information about the delegate neuron, `None` if not found.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#delegate>
         - <https://docs.learnbittensor.org/glossary#nominator>



   .. py:method:: get_delegate_identities(block = None, block_hash = None, reuse_block = False)
      :async:


      Fetches delegate identities.

      Delegates are validators that accept stake from other TAO holders (nominators/delegators). This method
      retrieves the on-chain identity information for all delegates, including display name, legal name, web URLs,
      and other metadata they have set.

      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: Dictionary mapping delegate SS58 addresses to their ChainIdentity objects.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/staking-and-delegation/delegation>



   .. py:method:: get_delegate_take(hotkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the delegate 'take' percentage for a neuron identified by its hotkey. The 'take' represents the
      percentage of rewards that the delegate claims from its nominators' stakes.

      :param hotkey_ss58: The `SS58` address of the neuron's hotkey.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The delegate take percentage.
      :rtype: float

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/staking-and-delegation/delegation>



   .. py:method:: get_delegated(coldkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves delegates and their associated stakes for a given nominator coldkey.

      This method identifies all delegates (validators) that a specific coldkey has staked tokens to, along with
      stake amounts and other delegation information. This is useful for account holders to understand their stake
      allocations and involvement in the network's delegation and consensus mechanisms.

      :param coldkey_ss58: The SS58 address of the account's coldkey.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: List of DelegatedInfo objects containing stake amounts and delegate information. Returns empty list if no
                delegations exist for the coldkey.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/staking-and-delegation/delegation>



   .. py:method:: get_delegates(block = None, block_hash = None, reuse_block = False)
      :async:


      Fetches all delegates registered on the chain.

      Delegates are validators that accept stake from other TAO holders (nominators/delegators). This method
      retrieves comprehensive information about all delegates including their hotkeys, total stake, nominator count,
      take percentage, and other metadata.

      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: List of DelegateInfo objects containing comprehensive delegate information. Returns empty list if no
                delegates are registered.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/staking-and-delegation/delegation>



   .. py:method:: get_ema_tao_inflow(netuid, block = None)
      :async:


      Retrieves the EMA (exponential moving average) of net TAO flow for a specific subnet.

      The EMA tracks net TAO flows (staking minus unstaking) with a 30-day half-life (~86.8 day window), smoothing
      out short-term fluctuations while capturing sustained staking trends. This metric determines the subnet's share
      of TAO emissions under the current, flow-based model. Positive values indicate net inflow (more staking than unstaking),
      negative values indicate net outflow. Subnets with negative EMA flows receive zero emissions.

      :param netuid: The unique identifier of the subnet to query.
      :param block: The block number to query. If `None`, uses latest finalized block.

      :returns: Tuple of (last_updated_block, ema_flow) where ema_flow is the EMA of net TAO flow in TAO units.
                Returns None if the subnet does not exist or if querying subnet 0 (root network).

      The EMA uses a smoothing factor α ≈ 0.000003209, creating a 30-day half-life and ~86.8 day window. Only direct
      stake/unstake operations count toward flows; neuron registrations and root claims are excluded. Subnet 0 (root
      network) does not have an EMA TAO flow value and will return None.

      .. admonition:: Notes

         - Flow-based emissions: <https://docs.learnbittensor.org/learn/emissions#tao-reserve-injection>
         - EMA smoothing: <https://docs.learnbittensor.org/learn/ema>



   .. py:method:: get_existential_deposit(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the existential deposit amount for the Bittensor blockchain.

      The existential deposit is the minimum amount of TAO required for an account to exist on the blockchain.
      Accounts with balances below this threshold can be reaped (removed) to conserve network resources and prevent
      blockchain bloat from dust accounts.

      :param block: The blockchain block number for the query.
      :param block_hash: Block hash at which to query the deposit amount. If `None`, the current block is used.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: The existential deposit amount in RAO.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#existential-deposit>



   .. py:method:: get_extrinsic_fee(call, keypair)
      :async:


      Gets the extrinsic fee for a given extrinsic call and keypair.

      This method estimates the transaction fee that will be charged for submitting the extrinsic to the
      blockchain. The fee is returned in Rao (the smallest unit of TAO, where 1 TAO = 1e9 Rao).

      :param call: The extrinsic GenericCall object representing the transaction to estimate.
      :param keypair: The keypair associated with the extrinsic (used to determine the account paying the fee).

      :returns: Balance object representing the extrinsic fee in Rao.

      .. admonition:: Example

         # Estimate fee before sending a transfer
         call = await subtensor.compose_call(
             call_module="Balances",
             call_function="transfer_allow_death",
             call_params={"dest": destination_ss58, "value": amount.rao}
         )
         fee = await subtensor.get_extrinsic_fee(call=call, keypair=wallet.coldkey)
         print(f"Estimated fee: {fee.tao} TAO")

      .. admonition:: Notes

         To create the GenericCall object, use the `compose_call` method with proper parameters.
         - <https://docs.learnbittensor.org/learn/fees>



   .. py:method:: get_hotkey_owner(hotkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the owner of the given hotkey at a specific block hash.
      This function queries the blockchain for the owner of the provided hotkey. If the hotkey does not exist at the
      specified block hash, it returns `None`.

      :param hotkey_ss58: The SS58 address of the hotkey.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block at which to check the hotkey ownership.
      :param reuse_block: Whether to reuse the last-used blockchain hash.

      :returns: The SS58 address of the owner if the hotkey exists, or None if it doesn't.
      :rtype: Optional[str]

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#hotkey>
         - <https://docs.learnbittensor.org/glossary#subnet>
         - <https://docs.learnbittensor.org/glossary#neuron>



   .. py:attribute:: get_hotkey_stake


   .. py:method:: get_hyperparameter(param_name, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves a specified hyperparameter for a specific subnet.

      This method queries the blockchain for subnet-specific hyperparameters such as difficulty, tempo, immunity
      period, and other network configuration values. Return types and units vary by parameter.

      :param param_name: The name of the hyperparameter storage function to retrieve.
      :param netuid: The unique identifier of the subnet.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The value of the specified hyperparameter if the subnet exists, `None` otherwise. Return type varies
                by parameter (int, float, bool, or Balance).

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/subnets/subnet-hyperparameters>



   .. py:method:: get_last_bonds_reset(netuid, hotkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the block number when bonds were last reset for a specific hotkey on a subnet.

      :param netuid: The network uid to fetch from.
      :param hotkey_ss58: The hotkey of the neuron for which to fetch the last bonds reset.
      :param block: The block number to query.
      :param block_hash: The hash of the block to retrieve the parameter from. Do not specify if using `block` or `reuse_block`.
      :param reuse_block: Whether to use the last-used block. Do not set if using `block_hash` or `block`.

      :returns: A ScaleType object containing the block number when bonds were last reset, or `None` if no bonds reset
                has occurred.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/resources/glossary#validator-miner-bonds>
         - <https://docs.learnbittensor.org/resources/glossary#commit-reveal>



   .. py:method:: get_last_commitment_bonds_reset_block(netuid, uid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the last block number when the bonds reset were triggered by publish_metadata for a specific neuron.

      :param netuid: The unique identifier of the subnetwork.
      :param uid: The unique identifier of the neuron.
      :param block: The block number to query.
      :param block_hash: The hash of the block to retrieve the parameter from. Do not specify if using `block` or `reuse_block`.
      :param reuse_block: Whether to use the last-used block. Do not set if using `block_hash` or `block`.

      :returns: The block number when the bonds were last reset, or None if not found.



   .. py:method:: get_liquidity_list(wallet, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all liquidity positions for the given wallet on a specified subnet (netuid).
      Calculates associated fee rewards based on current global and tick-level fee data.

      :param wallet: Wallet instance to fetch positions for.
      :param netuid: Subnet unique id.
      :param block: The block number for which the children are to be retrieved.
      :param block_hash: The hash of the block to retrieve the subnet unique identifiers from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: List of liquidity positions, or None if subnet does not exist.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/liquidity-positions/
         - <https://docs.learnbittensor.org/liquidity-positions/managing-liquidity-positions>



   .. py:method:: get_mechanism_count(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the number of mechanisms for the given subnet.

      :param netuid: Subnet identifier.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block to retrieve the stake from. Do not specify if using `block` or `reuse_block`.
      :param reuse_block: Whether to use the last-used block. Do not set if using `block_hash` or `block`.

      :returns: The number of mechanisms for the given subnet.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/subnets/understanding-multiple-mech-subnets>



   .. py:method:: get_mechanism_emission_split(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns the emission percentages allocated to each subnet mechanism.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block to retrieve the stake from. Do not specify if using `block` or `reuse_block`.
      :param reuse_block: Whether to use the last-used block. Do not set if using `block_hash` or `block`.

      :returns: A list of integers representing the percentage of emission allocated to each subnet mechanism (rounded to
                whole numbers). Returns None if emission is evenly split or if the data is unavailable.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/subnets/understanding-multiple-mech-subnets>



   .. py:method:: get_metagraph_info(netuid, mechid = 0, selected_indices = None, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves full or partial metagraph information for the specified subnet (netuid).

      A metagraph is a data structure that contains comprehensive information about the current state of a subnet,
      including detailed information on all the nodes (neurons) such as subnet validator stakes and subnet weights
      in the subnet. Metagraph aids in calculating emissions.

      :param netuid: The unique identifier of the subnet to query.
      :param selected_indices: Optional list of SelectiveMetagraphIndex or int values specifying which fields to retrieve.
                               If not provided, all available fields will be returned.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number at which to perform the query.
      :param reuse_block: Whether to reuse the last-used block hash when retrieving info.
      :param mechid: Subnet mechanism unique identifier.

      :returns: MetagraphInfo object with the requested subnet mechanism data, None if the subnet mechanism does not exist.

      .. admonition:: Example

         # Retrieve all fields from the metagraph from subnet 2 mechanism 0
         meta_info = subtensor.get_metagraph_info(netuid=2)
         
         # Retrieve all fields from the metagraph from subnet 2 mechanism 1
         meta_info = subtensor.get_metagraph_info(netuid=2, mechid=1)
         
         # Retrieve selective data from the metagraph from subnet 2 mechanism 0
         partial_meta_info = subtensor.get_metagraph_info(
             netuid=2,
             selected_indices=[SelectiveMetagraphIndex.Name, SelectiveMetagraphIndex.OwnerHotkeys]
         )
         
         # Retrieve selective data from the metagraph from subnet 2 mechanism 1
         partial_meta_info = subtensor.get_metagraph_info(
             netuid=2,
             mechid=1,
             selected_indices=[SelectiveMetagraphIndex.Name, SelectiveMetagraphIndex.OwnerHotkeys]
         )

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/subnets/metagraph>



   .. py:method:: get_mev_shield_current_key(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the CurrentKey from the MevShield pallet storage.

      The CurrentKey contains the ML-KEM-768 public key that is currently being used for encryption in this block.
      This key is rotated from NextKey at the beginning of each block.

      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block to retrieve the stake from. Do not specify if using block or reuse_block.
      :param reuse_block: Whether to use the last-used block. Do not set if using block_hash or block.

      :returns: The ML-KEM-768 public key as bytes (1184 bytes for ML-KEM-768)

      .. note::

         If CurrentKey is not set (None in storage), this function returns None. This can happen if no validator has
         announced a key yet.



   .. py:method:: get_mev_shield_next_key(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the NextKey from the MevShield pallet storage.

      The NextKey contains the ML-KEM-768 public key that will be used for encryption in the next block. This key is
      rotated from NextKey to CurrentKey at the beginning of each block.

      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block to retrieve the stake from. Do not specify if using block or reuse_block.
      :param reuse_block: Whether to use the last-used block. Do not set if using block_hash or block.

      :returns: The ML-KEM-768 public key as bytes (1184 bytes for ML-KEM-768)

      .. note::

         If NextKey is not set (None in storage), this function returns None. This can happen if no validator has
         announced the next key yet.



   .. py:method:: get_minimum_required_stake()
      :async:


      Returns the minimum required stake threshold for nominator cleanup operations.

      This threshold is used ONLY for cleanup after unstaking operations. If a nominator's remaining stake
      falls below this minimum after an unstake, the remaining stake is forcefully cleared and returned
      to the coldkey to prevent dust accounts.

      This is NOT the minimum checked during staking operations. The actual minimum for staking is determined
      by DefaultMinStake (typically 0.001 TAO plus fees).

      :returns: The minimum stake threshold as a Balance object. Nominator stakes below this amount
                are automatically cleared after unstake operations.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/staking-and-delegation/delegation>



   .. py:method:: get_netuids_for_hotkey(hotkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves a list of subnet UIDs (netuids) where a given hotkey is a member. This function identifies the
      specific subnets within the Bittensor network where the neuron associated with the hotkey is active.

      :param hotkey_ss58: The `SS58` address of the neuron's hotkey.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number at which to perform the query.
      :param reuse_block: Whether to reuse the last-used block hash when retrieving info.

      :returns: A list of netuids where the neuron is a member.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#hotkey>



   .. py:method:: get_neuron_certificate(hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the TLS certificate for a specific neuron identified by its unique identifier (UID) within a specified
      subnet (netuid) of the Bittensor network.

      :param hotkey_ss58: The SS58 address of the neuron's hotkey.
      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block to retrieve the parameter from. Do not specify if using block or
                         reuse_block.
      :param reuse_block: Whether to use the last-used block. Do not set if using `block_hash` or `block`.

      :returns: Certificate object containing the neuron's TLS public key and algorithm, or `None` if the neuron has
                not registered a certificate.

      This function is used for certificate discovery for setting up mutual tls communication between neurons.



   .. py:method:: get_neuron_for_pubkey_and_subnet(hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves information about a neuron based on its public key (hotkey SS58 address) and the specific subnet UID
      (netuid). This function provides detailed neuron information for a particular subnet within the Bittensor
      network.

      :param hotkey_ss58: The `SS58` address of the neuron's hotkey.
      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block number at which to perform the query.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: Detailed information about the neuron if found, `None` otherwise.

      This function is crucial for accessing specific neuron data and understanding its status, stake, and other
      attributes within a particular subnet of the Bittensor ecosystem.



   .. py:method:: get_next_epoch_start_block(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Calculates the first block number of the next epoch for the given subnet.

      If `block` is not provided, the current chain block will be used. Epochs are determined based on the subnet's
      tempo (i.e., blocks per epoch). The result is the block number at which the next epoch will begin.

      :param netuid: The unique identifier of the subnet.
      :param block: The reference block to calculate from. If `None`, uses the current chain block height.
      :param block_hash: The blockchain block number at which to perform the query.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: The block number at which the next epoch will start.
      :rtype: int

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#tempo>



   .. py:method:: get_owned_hotkeys(coldkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all hotkeys owned by a specific coldkey address.

      :param coldkey_ss58: The SS58 address of the coldkey to query.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number for the query.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: A list of hotkey SS58 addresses owned by the coldkey.



   .. py:method:: get_parents(hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      This method retrieves the parent of a given hotkey and netuid. It queries the SubtensorModule's ParentKeys
      storage function to get the children and formats them before returning as a tuple.

      :param hotkey_ss58: The child hotkey SS58.
      :param netuid: The netuid value.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: A list of formatted parents [(proportion, parent)]

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/validators/child-hotkeys>
         - :meth:`get_children` for retrieving child keys



   .. py:method:: get_proxies(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all proxy relationships from the chain.

      This method queries the Proxy.Proxies storage map across all accounts and returns a dictionary mapping each real
      account (delegator) to its list of proxy relationships.

      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:

                Dictionary mapping real account SS58 addresses to lists of ProxyInfo objects. Each ProxyInfo contains the
                    delegate address, proxy type, and delay for that proxy relationship.

      .. admonition:: Notes

         - This method queries all proxy relationships on the chain, which may be resource-intensive for large
           networks. Consider using :meth:`get_proxies_for_real_account` for querying specific accounts.
         - See: <https://docs.learnbittensor.org/keys/proxies>



   .. py:method:: get_proxies_for_real_account(real_account_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns proxy/ies associated with the provided real account.

      This method queries the Proxy.Proxies storage for a specific real account and returns all proxy relationships
      where this real account is the delegator. It also returns the deposit amount reserved for these proxies.

      :param real_account_ss58: SS58 address of the real account (delegator) whose proxies to retrieve.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:

                    - List of ProxyInfo objects representing all proxy relationships for the real account. Each ProxyInfo
                        contains delegate address, proxy type, and delay.
                    - Balance object representing the reserved deposit amount for these proxies. This deposit is held as
                        long as the proxy relationships exist and is returned when proxies are removed.
      :rtype: Tuple containing

      .. admonition:: Notes

         - If the account has no proxies, returns an empty list and a zero balance.
         - See: <https://docs.learnbittensor.org/keys/proxies/create-proxy>



   .. py:method:: get_proxy_announcement(delegate_account_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves proxy announcements for a specific delegate account.

      This method queries the Proxy.Announcements storage for announcements made by the given delegate proxy account.
      Announcements allow a proxy to declare its intention to execute a call on behalf of a real account after a delay
      period.

      :param delegate_account_ss58: SS58 address of the delegate proxy account whose announcements to retrieve.
      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:

                List of ProxyAnnouncementInfo objects. Each object contains the real account address, call hash, and block
                    height at which the announcement was made.

      .. admonition:: Notes

         - If the delegate has no announcements, returns an empty list.
         - See: <https://docs.learnbittensor.org/keys/proxies>



   .. py:method:: get_proxy_announcements(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all proxy announcements from the chain.

      This method queries the Proxy.Announcements storage map across all delegate accounts and returns a dictionary
      mapping each delegate to its list of pending announcements.

      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: Dictionary mapping delegate account SS58 addresses to lists of ProxyAnnouncementInfo objects.
                Each ProxyAnnouncementInfo contains the real account address, call hash, and block height.

      .. admonition:: Notes

         - This method queries all announcements on the chain, which may be resource-intensive for large networks.
           Consider using :meth:`get_proxy_announcement` for querying specific delegates.
         - See: <https://docs.learnbittensor.org/keys/proxies>



   .. py:method:: get_proxy_constants(constants = None, as_dict = False, block = None, block_hash = None, reuse_block = False)
      :async:


      Fetches runtime configuration constants from the `Proxy` pallet.

      This method retrieves on-chain configuration constants that define deposit requirements, proxy limits, and
      announcement constraints for the Proxy pallet. These constants govern how proxy accounts operate within the
      Subtensor network.

      :param constants: Optional list of specific constant names to fetch. If omitted, all constants defined in
                        `ProxyConstants.constants_names()` are queried. Valid constant names include: "AnnouncementDepositBase",
                        "AnnouncementDepositFactor", "MaxProxies", "MaxPending", "ProxyDepositBase", "ProxyDepositFactor".
      :param as_dict: If True, returns the constants as a dictionary instead of a `ProxyConstants` object.
      :param block: The blockchain block number for the query. If `None`, queries the latest block.
      :param block_hash: The hash of the block at which to check the parameter. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: ProxyConstants object containing all requested constants.
                If `as_dict` is True: Dictionary mapping constant names to their values (Balance objects for deposit
                    constants, integers for limit constants).
      :rtype: If `as_dict` is False

      .. admonition:: Notes

         - All Balance amounts are returned in RAO. Constants reflect the current chain configuration at the specified
           block.
         - See: <https://docs.learnbittensor.org/keys/proxies>



   .. py:method:: get_revealed_commitment(netuid, uid, block = None)
      :async:


      Returns uid related revealed commitment for a given netuid.

      :param netuid: The unique identifier of the subnetwork.
      :param uid: The neuron uid to retrieve the commitment from.
      :param block: The block number to retrieve the commitment from.

      :returns: A tuple of reveal block and commitment message.

      .. admonition:: Example

         # sample return value
         
         ( (12, "Alice message 1"), (152, "Alice message 2") )
         
         ( (12, "Bob message 1"), (147, "Bob message 2") )

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#commit-reveal>



   .. py:method:: get_revealed_commitment_by_hotkey(netuid, hotkey_ss58 = None, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves hotkey related revealed commitment for a given subnet.

      :param netuid: The unique identifier of the subnetwork.
      :param hotkey_ss58: The ss58 address of the committee member.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: A tuple of reveal block and commitment message.

      # TODO: add example to clarify return ordering and units; @roman can you help w this?
      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#commit-reveal>



   .. py:method:: get_root_alpha_dividends_per_subnet(hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the root alpha dividends per subnet for a given hotkey.

      This storage tracks the root alpha dividends that a hotkey has received on a specific subnet.
      It is updated during block emission distribution when root alpha is distributed to validators.

      :param hotkey_ss58: The ss58 address of the root validator hotkey.
      :param netuid: The unique identifier of the subnet.
      :param block: The block number to query. Do not specify if using block_hash or reuse_block.
      :param block_hash: The block hash at which to check the parameter. Do not set if using block or reuse_block.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using block_hash or block.

      :returns: The root alpha dividends for this hotkey on this subnet in Rao, with unit set to netuid.
      :rtype: Balance



   .. py:method:: get_root_claim_type(coldkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Return the configured root claim type for a given coldkey.

      The root claim type controls how dividends from staking to the Root Subnet (subnet 0) are processed when they
      are claimed:

      - `Swap` (default): Alpha dividends are swapped to TAO at claim time and restaked on the root subnet.
      - `Keep`: Alpha dividends remain as Alpha on the originating subnets.

      :param coldkey_ss58: The SS58 address of the coldkey whose root claim preference to query.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to query the claim type. Do not specify if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not specify if using `block` or `block_hash`.

      :returns: The root claim type as a string, either `Swap` or `Keep`,
                or dict for "KeepSubnets" in format {"KeepSubnets": {"subnets": [1, 2, 3]}}.

      .. admonition:: Notes

         - The claim type applies to both automatic and manual root claims; it does not affect the original TAO stake
           on subnet 0, only how Alpha dividends are treated.
         - See: <https://docs.learnbittensor.org/staking-and-delegation/root-claims>
         - See also: <https://docs.learnbittensor.org/staking-and-delegation/root-claims/managing-root-claims>



   .. py:method:: get_root_claimable_all_rates(hotkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all root claimable rates from a given hotkey address for all subnets with this validator.

      :param hotkey_ss58: The SS58 address of the root validator hotkey.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to query. Do not specify if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not specify if using `block` or `block_hash`.

      :returns: Dictionary mapping `netuid` to a float claimable rate (approximately in the range `[0.0, 1.0]`) for that
                subnet. Missing entries imply no claimable Alpha dividends for that subnet.

      .. admonition:: Notes

         - See: <https://docs.learnbittensor.org/staking-and-delegation/root-claims/managing-root-claims>



   .. py:method:: get_root_claimable_rate(hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Return the fraction of root stake currently claimable on a subnet.

      This method returns a normalized rate representing how much Alpha dividends are currently claimable on the given
      subnet relative to the validator's root stake. It is primarily a low-level helper; most users should call
      :meth:`get_root_claimable_stake` instead to obtain a Balance.

      :param hotkey_ss58: The SS58 address of the root validator hotkey.
      :param netuid: The unique identifier of the subnet whose claimable rate to compute.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to query. Do not specify if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not specify if using `block` or `block_hash`.

      :returns: A float representing the claimable rate for this subnet (approximately in the range `[0.0, 1.0]`). A value
                of 0.0 means there are currently no claimable Alpha dividends on the subnet.

      .. admonition:: Notes

         - Use :meth:`get_root_claimable_stake` to retrieve the actual claimable amount as a `Balance` object.
         - See: <https://docs.learnbittensor.org/staking-and-delegation/root-claims/managing-root-claims>



   .. py:method:: get_root_claimable_stake(coldkey_ss58, hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Return the currently claimable Alpha staking dividends for a coldkey from a root validator on a subnet.

      :param coldkey_ss58: The SS58 address of the delegator's coldkey.
      :param hotkey_ss58: The SS58 address of the root validator hotkey.
      :param netuid: The subnet ID where Alpha dividends will be claimed.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to query. Do not specify if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not specify if using `block` or `block_hash`.

      :returns: `Balance` representing the Alpha stake currently available to claim on the specified subnet (unit is the
                subnet's Alpha token).

      .. admonition:: Notes

         - After a successful manual or automatic claim, this value typically drops to zero for that subnet until new
           dividends accumulate.
         - The underlying TAO stake on the Root Subnet remains unaffected; only Alpha dividends are moved or swapped
           according to the configured root claim type.
         - See: <https://docs.learnbittensor.org/staking-and-delegation/root-claims>
         - See also: <https://docs.learnbittensor.org/staking-and-delegation/root-claims/managing-root-claims>



   .. py:method:: get_root_claimed(coldkey_ss58, hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Return the total Alpha dividends already claimed for a coldkey from a root validator on a subnet.

      :param coldkey_ss58: The SS58 address of the delegator's coldkey.
      :param hotkey_ss58: The SS58 address of the root validator hotkey.
      :param netuid: The unique identifier of the subnet.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to query. Do not specify if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not specify if using `block` or `block_hash`.

      :returns: `Balance` representing the cumulative Alpha stake that has already been claimed from the root validator on
                the specified subnet.

      .. admonition:: Notes

         - See: <https://docs.learnbittensor.org/staking-and-delegation/root-claims/managing-root-claims>



   .. py:method:: get_stake(coldkey_ss58, hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns the amount of Alpha staked by a specific coldkey to a specific hotkey within a given subnet.

      :param coldkey_ss58: The SS58 address of the coldkey that delegated the stake. This address owns the stake.
      :param hotkey_ss58: The SS58 address of the hotkey which the stake is on.
      :param netuid: The unique identifier of the subnet to query.
      :param block: The specific block number at which to retrieve the stake information.
                    or `reuse_block`.
      :param block_hash: The hash of the block to retrieve the stake from. Do not specify if using `block`
                         or `reuse_block`.
      :param reuse_block: Whether to use the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:

                An object representing the amount of Alpha (TAO ONLY if the subnet's netuid is 0) currently staked from the
                    specified coldkey to the specified hotkey within the given subnet.



   .. py:method:: get_stake_add_fee(amount, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Calculates the fee for adding new stake to a hotkey.

      :param amount: Amount of stake to add in TAO
      :param netuid: Netuid of subnet
      :param block: The block number for which the children are to be retrieved.
      :param block_hash: The hash of the block to retrieve the subnet unique identifiers from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: The calculated stake fee as a Balance object in TAO.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/learn/fees>



   .. py:method:: get_stake_for_coldkey_and_hotkey(coldkey_ss58, hotkey_ss58, netuids = None, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves all coldkey-hotkey pairing stake across specified (or all) subnets

      :param coldkey_ss58: The SS58 address of the coldkey.
      :param hotkey_ss58: The SS58 address of the hotkey.
      :param netuids: The subnet IDs to query for. Set to `None` for all subnets.
      :param block: The block number for which the children are to be retrieved.
      :param block_hash: The hash of the block to retrieve the subnet unique identifiers from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: A netuid to StakeInfo mapping of all stakes across all subnets.



   .. py:method:: get_stake_for_hotkey(hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the total stake for a given hotkey on a specific subnet.

      :param hotkey_ss58: The SS58 address of the hotkey.
      :param netuid: The subnet ID to query for.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block to retrieve the stake from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: The total stake for the hotkey on the specified subnet.
      :rtype: Balance



   .. py:method:: get_stake_info_for_coldkey(coldkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the stake information for a given coldkey.

      :param coldkey_ss58: The SS58 address of the coldkey.
      :param block: The block number at which to query the stake information.
      :param block_hash: The hash of the blockchain block number for the query.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: List of StakeInfo objects.



   .. py:method:: get_stake_info_for_coldkeys(coldkey_ss58s, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the stake information for multiple coldkeys.

      :param coldkey_ss58s: A list of SS58 addresses of the coldkeys to query.
      :param block: The block number at which to query the stake information.
      :param block_hash: The hash of the blockchain block number for the query.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: The dictionary mapping coldkey addresses to a list of StakeInfo objects.



   .. py:method:: get_stake_movement_fee(origin_netuid, destination_netuid, amount, block = None, block_hash = None, reuse_block = False)
      :async:


      Calculates the fee for moving stake between hotkeys/subnets/coldkeys.

      :param origin_netuid: Netuid of source subnet.
      :param destination_netuid: Netuid of the destination subnet.
      :param amount: Amount of stake to move.
      :param block: The block number for which the children are to be retrieved.
      :param block_hash: The hash of the block to retrieve the subnet unique identifiers from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: The calculated stake fee as a Balance object

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/learn/fees>



   .. py:method:: get_stake_weight(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the stake weight for all hotkeys in a given subnet.

      :param netuid: Netuid of subnet.
      :param block: The block number for which the children are to be retrieved.
      :param block_hash: The hash of the block to retrieve the subnet unique identifiers from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: A list of stake weights for all hotkeys in the specified subnet.



   .. py:method:: get_staking_hotkeys(coldkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the hotkeys that have staked for a given coldkey.

      :param coldkey_ss58: The SS58 address of the coldkey.
      :param block: The block number at which to query the stake information.
      :param block_hash: The hash of the blockchain block number for the query.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: A list of hotkey SS58 addresses that have staked for the given coldkey.



   .. py:method:: get_start_call_delay(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the start call delay in blocks.

      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash of the block id.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: Amount of blocks after the start call can be executed.



   .. py:method:: get_subnet_burn_cost(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the burn cost for registering a new subnet within the Bittensor network. This cost represents the
          amount of Tao that needs to be locked or burned to establish a new

      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash of the block id.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: The burn cost for subnet registration.
      :rtype: int

      The subnet burn cost is an important economic parameter, reflecting the network's mechanisms for controlling
          the proliferation of subnets and ensuring their commitment to the network's long-term viability.



   .. py:method:: get_subnet_hyperparameters(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the hyperparameters for a specific subnet within the Bittensor network. These hyperparameters define
      the operational settings and rules governing the subnet's behavior.

      :param netuid: The network UID of the subnet to query.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number for the query.
      :param reuse_block: Whether to reuse the last-used blockchain hash.

      :returns: The subnet's hyperparameters, or `None` if not available.

      Understanding the hyperparameters is crucial for comprehending how subnets are configured and managed, and how
      they interact with the network's consensus and incentive mechanisms.



   .. py:method:: get_subnet_info(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves detailed information about subnet within the Bittensor network.
      This function provides comprehensive data on subnet, including its characteristics and operational parameters.

      :param netuid: The unique identifier of the subnet.
      :param block: The block number for which the children are to be retrieved.
      :param block_hash: The hash of the block to retrieve the subnet unique identifiers from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: A SubnetInfo objects, each containing detailed information about a subnet.
      :rtype: SubnetInfo

      Gaining insights into the subnet's details assists in understanding the network's composition, the roles of
      different subnets, and their unique features.



   .. py:method:: get_subnet_owner_hotkey(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the hotkey of the subnet owner for a given network UID.

      This function queries the subtensor network to fetch the hotkey of the owner of a subnet specified by its
      netuid. If no data is found or the query fails, the function returns `None`.

      :param netuid: The network UID of the subnet to fetch the owner's hotkey for.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of the block id.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: The hotkey of the subnet owner if available; None otherwise.



   .. py:method:: get_subnet_price(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Gets the current Alpha price in TAO for the specified subnet.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block to retrieve the stake from. Do not specify if using `block` or `reuse_block`.
      :param reuse_block: Whether to use the last-used block. Do not set if using `block_hash` or `block`.

      :returns: The current Alpha price in TAO units for the specified subnet.

      .. admonition:: Notes

         Subnet 0 (root network) always returns 1 TAO since it uses TAO directly rather than Alpha.



   .. py:method:: get_subnet_prices(block = None, block_hash = None, reuse_block = False)
      :async:


      Gets the current Alpha price in TAO for all subnets.

      :param block: The block number for which the children are to be retrieved.
      :param block_hash: The hash of the block to retrieve the subnet unique identifiers from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: A dictionary mapping subnet unique ID (netuid) to the current Alpha price in TAO units.

      .. admonition:: Notes

         Subnet 0 (root network) always has a price of 1 TAO since it uses TAO directly rather than Alpha.



   .. py:method:: get_subnet_reveal_period_epochs(netuid, block = None, block_hash = None)
      :async:


      Retrieves the SubnetRevealPeriodEpochs hyperparameter for a specified subnet.

      This hyperparameter determines the number of epochs that must pass before a committed weight can be revealed
      in the commit-reveal mechanism.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query. Do not specify if using `block_hash`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block`.

      :returns: The number of epochs in the reveal period for the subnet.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#commit-reveal>



   .. py:method:: get_subnet_validator_permits(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the list of validator permits for a given subnet as boolean values.

      :param netuid: The unique identifier of the subnetwork.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of the block id.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: A list of boolean values representing validator permits, or None if not available.



   .. py:method:: get_timelocked_weight_commits(netuid, mechid = 0, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves CRv4 (Commit-Reveal version 4) weight commit information for a specific subnet.

      This method retrieves timelocked weight commitments made by validators using the commit-reveal mechanism.
      The raw byte/vector encoding from the chain is automatically parsed and converted into a structured format
      via `WeightCommitInfo`.

      :param netuid: The unique identifier of the subnet.
      :param mechid: Subnet mechanism identifier (default 0 for primary mechanism).
      :param block: The blockchain block number for the query. Do not specify if using `block_hash` or
                    `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:     - ss58_address: The SS58 address of the committer.
                    - commit_block: The block number when the commitment was made.
                    - commit_message: The commit message (encoded commitment data).
                    - reveal_round: The drand round when the commitment can be revealed.
      :rtype: A list of commit details, where each item is a tuple containing

      .. admonition:: Notes

         The list may be empty if there are no commits found.
         - <https://docs.learnbittensor.org/resources/glossary#commit-reveal>



   .. py:method:: get_timestamp(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the datetime timestamp for a given block.

      This method queries the Timestamp pallet to get the block's timestamp. The on-chain timestamp is stored in
      milliseconds (Unix timestamp in milliseconds), which is automatically converted to a Python datetime object
      (Unix timestamp in seconds).

      :param block: The blockchain block number for the query. Do not specify if using `block_hash` or
                    `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: A datetime object representing the timestamp of the specified block.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/resources/glossary#block>



   .. py:method:: get_total_subnets(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the total number of subnets within the Bittensor network as of a specific blockchain block.

      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of block id.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: The total number of subnets in the network.



   .. py:method:: get_transfer_fee(wallet, destination_ss58, amount, keep_alive = True)
      :async:


      Calculates the transaction fee for transferring tokens from a wallet to a specified destination address. This
      function simulates the transfer to estimate the associated cost, taking into account the current network
      conditions and transaction complexity.

      :param wallet: The wallet from which the transfer is initiated.
      :param destination_ss58: The `SS58` address of the destination account.
      :param amount: The amount of tokens to be transferred, specified as a Balance object, or in Tao (float) or Rao
                     (int) units.
      :param keep_alive: Whether the transfer fee should be calculated based on keeping the wallet alive (existential
                         deposit) or not.

      :returns:

                The estimated transaction fee for the transfer, represented as a Balance
                    object.
      :rtype: bittensor.utils.balance.Balance

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/learn/fees>



   .. py:method:: get_uid_for_hotkey_on_subnet(hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the unique identifier (UID) for a neuron's hotkey on a specific subnet.

      :param hotkey_ss58: The `SS58` address of the neuron's hotkey.
      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of the block id.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: The UID of the neuron if it is registered on the subnet, `None` otherwise.

      The UID is a critical identifier within the network, linking the neuron's hotkey to its operational and
      governance activities on a particular subnet.



   .. py:method:: get_unstake_fee(netuid, amount, block = None, block_hash = None, reuse_block = False)
      :async:


      Calculates the fee for unstaking from a hotkey.

      :param netuid: The unique identifier of the subnet.
      :param amount: Amount of stake to unstake in TAO.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of the block id.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: The calculated stake fee as a Balance object in Alpha.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/learn/fees>



   .. py:method:: get_vote_data(proposal_hash, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the voting data for a specific proposal on the Bittensor blockchain. This data includes information
      about how senate members have voted on the proposal.

      :param proposal_hash: The hash of the proposal for which voting data is requested.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number to query the voting data.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: An object containing the proposal's voting data, or `None` if not found.

      This function is important for tracking and understanding the decision-making processes within the Bittensor
      network, particularly how proposals are received and acted upon by the governing body.



   .. py:method:: immunity_period(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the 'ImmunityPeriod' hyperparameter for a specific subnet. This parameter defines the duration during
      which new neurons are protected from certain network penalties or restrictions.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of the block id.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: The value of the 'ImmunityPeriod' hyperparameter if the subnet exists, `None` otherwise.

      The 'ImmunityPeriod' is a critical aspect of the network's governance system, ensuring that new participants
      have a grace period to establish themselves and contribute to the network without facing immediate punitive
      actions.



   .. py:method:: initialize()
      :async:


      Establishes connection to the blockchain.

      This method establishes the connection to the Bittensor blockchain and should be called after creating an
      AsyncSubtensor instance before making any queries.

      When using the `async with` context manager, this method is called automatically and does not need to be
      invoked explicitly.

      :returns: The initialized instance (self) for method chaining.
      :rtype: AsyncSubtensor

      .. admonition:: Example

         subtensor = AsyncSubtensor(network="finney")
         
         # Initialize the connection
         
         await subtensor.initialize()
         
         # calls to subtensor
         
         await subtensor.close()



   .. py:method:: is_fast_blocks()
      :async:


      Checks if the node is running with fast blocks enabled.

      Fast blocks have a block time of 0.25 seconds, compared to the standard 12-second block time. This affects
      transaction timing and network synchronization.

      :returns: `True` if fast blocks are enabled, `False` otherwise.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/resources/glossary#fast-blocks>



   .. py:method:: is_hotkey_delegate(hotkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Determines whether a given hotkey (public key) is a delegate on the Bittensor network. This function checks if
      the neuron associated with the hotkey is part of the network's delegation system.

      :param hotkey_ss58: The SS58 address of the neuron's hotkey.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number for the query.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: `True` if the hotkey is a delegate, `False` otherwise.

      Being a delegate is a significant status within the Bittensor network, indicating a neuron's involvement in
      consensus and governance processes.



   .. py:method:: is_hotkey_registered(hotkey_ss58, netuid = None, block = None, block_hash = None, reuse_block = False)
      :async:


      Determines whether a given hotkey (public key) is registered in the Bittensor network, either globally across
      any subnet or specifically on a specified subnet. This function checks the registration status of a neuron
      identified by its hotkey, which is crucial for validating its participation and activities within the network.

      :param hotkey_ss58: The SS58 address of the neuron's hotkey.
      :param netuid: The unique identifier of the subnet to check the registration.
      :param block: The block number for which the children are to be retrieved.
      :param block_hash: The hash of the block to retrieve the subnet unique identifiers from.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns:

                `True` if the hotkey is registered in the specified context (either any subnet or a specific subnet),
                    `False` otherwise.
      :rtype: bool

      This function is important for verifying the active status of neurons in the Bittensor network. It aids in
      understanding whether a neuron is eligible to participate in network processes such as consensus, validation,
      and incentive distribution based on its registration status.



   .. py:method:: is_hotkey_registered_any(hotkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Checks if a neuron's hotkey is registered on any subnet within the Bittensor network.

      :param hotkey_ss58: The `SS58` address of the neuron's hotkey.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of block id.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: `True` if the hotkey is registered on any subnet, False otherwise.
      :rtype: bool



   .. py:method:: is_hotkey_registered_on_subnet(hotkey_ss58, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Checks if the hotkey is registered on a given subnet.

      :param hotkey_ss58: The SS58 address of the hotkey to check.
      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query. Do not specify if using `block_hash` or
                    `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: `True` if the hotkey is registered on the specified subnet, `False` otherwise.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#hotkey>



   .. py:method:: is_in_admin_freeze_window(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns True if the current block is within the terminal freeze window of the tempo
      for the given subnet. During this window, admin ops are prohibited to avoid interference
      with validator weight submissions.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of the block id.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: True if in freeze window, else False.
      :rtype: bool



   .. py:method:: is_subnet_active(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Verifies if a subnet with the provided netuid is active.

      A subnet is considered active if the `start_call` extrinsic has been executed. A newly registered subnet
      may exist but not be active until the subnet owner calls `start_call` to begin emissions.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query. Do not specify if using `block_hash` or
                    `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: `True` if the subnet is active (emissions have started), `False` otherwise.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/subnets/working-with-subnets>



   .. py:method:: kill_pure_proxy(wallet, pure_proxy_ss58, spawner, proxy_type, index, height, ext_index, force_proxy_type = ProxyType.Any, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Kills (removes) a pure proxy account.

      This method removes a pure proxy account that was previously created via :meth:`create_pure_proxy`. The `kill_pure`
      call must be executed through the pure proxy account itself, with the spawner acting as an "Any" proxy. This
      method automatically handles this by executing the call via :meth:`proxy`.

      :param wallet: Bittensor wallet object. The wallet.coldkey.ss58_address must be the spawner of the pure proxy (the
                     account that created it via :meth:`create_pure_proxy`). The spawner must have an "Any" proxy relationship
                     with the pure proxy.
      :param pure_proxy_ss58: The SS58 address of the pure proxy account to be killed. This is the address that was
                              returned in the :meth:`create_pure_proxy` response.
      :param spawner: The SS58 address of the spawner account (the account that originally created the pure proxy via
                      :meth:`create_pure_proxy`). This should match wallet.coldkey.ss58_address.
      :param proxy_type: The type of proxy permissions. Can be a string or ProxyType enum value. Must match the
                         proxy_type used when creating the pure proxy.
      :param index: The salt value (u16, range `0-65535`) originally used in :meth:`create_pure_proxy` to generate this
                    pure proxy's address. This value, combined with `proxy_type`, `delay`, and `spawner`, uniquely
                    identifies the pure proxy to be killed. Must match exactly the index used during creation.
      :param height: The block number at which the pure proxy was created. This is returned in the "PureCreated" event from
                     :meth:`create_pure_proxy` and is required to identify the exact creation transaction.
      :param ext_index: The extrinsic index within the block at which the pure proxy was created. This is returned in the
                        "PureCreated" event from :meth:`create_pure_proxy` and specifies the position of the creation extrinsic
                        within the block. Together with `height`, this uniquely identifies the creation transaction.
      :param force_proxy_type: The proxy type relationship to use when executing `kill_pure` through the proxy mechanism.
                               Since pure proxies are keyless and cannot sign transactions, the spawner must act as a proxy for the
                               pure proxy to execute `kill_pure`. This parameter specifies which proxy type relationship between the
                               spawner and the pure proxy account should be used. The spawner must have a proxy relationship of this
                               type (or `Any`) with the pure proxy account. Defaults to `ProxyType.Any` for maximum compatibility. If
                               `None`, Substrate will automatically select an available proxy type from the spawner's proxy
                               relationships.
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

         - The `kill_pure` call must be executed through the pure proxy account itself, with the spawner acting as
           an `Any` proxy. This method automatically handles this by executing the call via :meth:`proxy`. The spawner
           must have an `Any` proxy relationship with the pure proxy for this to work.
         - Bittensor proxies: <https://docs.learnbittensor.org/keys/proxies/pure-proxies>

      .. warning::

         All access to this account will be lost. Any funds remaining in the pure proxy account will become
         permanently inaccessible after this operation.



   .. py:method:: last_drand_round()
      :async:


      Retrieves the last drand round emitted in Bittensor.

      Drand (distributed randomness) rounds are used to determine when committed weights can be revealed in the
      commit-reveal mechanism. This method returns the most recent drand round number, which corresponds to the
      timing for weight reveals.

      :returns: The latest drand round number emitted in Bittensor, or `None` if no round has been stored.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/resources/glossary#drandtime-lock-encryption>



   .. py:attribute:: log_verbose
      :value: False



   .. py:method:: max_weight_limit(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns the MaxWeightsLimit hyperparameter for a subnet.

      :param netuid: The unique identifier of the subnetwork.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:

                The stored maximum weight limit as a normalized float in [0, 1], or `None` if the subnetwork
                    does not exist. Note: this value is not enforced - the weight validation code uses a hardcoded u16::MAX
                        instead.

      .. admonition:: Notes

         - This hyperparameter is now a constant rather than a settable variable.
         - <https://docs.learnbittensor.org/subnets/subnet-hyperparameters>



   .. py:method:: metagraph(netuid, mechid = 0, lite = True, block = None)
      :async:


      Returns a synced metagraph for a specified subnet within the Bittensor network.
      The metagraph represents the network's structure, including neuron connections and interactions.

      :param netuid: The network UID of the subnet to query.
      :param mechid: Subnet mechanism identifier.
      :param lite: If `True`, returns a metagraph using a lightweight sync (no weights, no bonds).
      :param block: Block number for synchronization, or `None` for the latest block.

      :returns: The metagraph representing the subnet's structure and neuron relationships.

      The metagraph is an essential tool for understanding the topology and dynamics of the Bittensor network's
      decentralized architecture, particularly in relation to neuron interconnectivity and consensus processes.



   .. py:method:: mev_submit_encrypted(wallet, call, sign_with = 'coldkey', *, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True, blocks_for_revealed_execution = 3)
      :async:


      Submits an encrypted extrinsic to the MEV Shield pallet.

      This function encrypts a call using ML-KEM-768 + XChaCha20Poly1305 and submits it to the MevShield pallet. The
      extrinsic remains encrypted in the transaction pool until it is included in a block and decrypted by validators.

      :param wallet: The wallet used to sign the extrinsic (must be unlocked, coldkey will be used for signing).
      :param call: The GenericCall object to encrypt and submit.
      :param sign_with: The keypair to use for signing the inner call/extrinsic. Can be either "coldkey" or "hotkey".
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You can
                     think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
      :param wait_for_finalization: Whether to wait for the finalization of the transaction.
      :param wait_for_revealed_execution: Whether to wait for the executed event, indicating that validators
                                          have successfully decrypted and executed the inner call. If True, the function will poll subsequent
                                          blocks for the event matching this submission's commitment.
      :param blocks_for_revealed_execution: Maximum number of blocks to poll for the executed event after
                                            inclusion. The function checks blocks from start_block to start_block + blocks_for_revealed_execution.
                                            Returns immediately if the event is found before the block limit is reached.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      :raises ValueError: If NextKey is not available in storage or encryption fails.
      :raises SubstrateRequestException: If the extrinsic fails to be submitted or included.

      .. note::

         The encryption uses the public key from NextKey storage, which rotates every block. The payload structure is:
         payload_core = signer_bytes (32B) + nonce (u32 LE, 4B) + SCALE(call)
         plaintext = payload_core + b"\x01" + signature (64B for sr25519)
         commitment = blake2_256(payload_core)

      .. admonition:: Notes

         For detailed documentation and examples of MEV Shield protection, see:
         <https://docs.learnbittensor.org/sdk/mev-protection>
         
         For creating GenericCall objects to use with this method, see:
         <https://docs.learnbittensor.org/sdk/call>



   .. py:method:: min_allowed_weights(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns the MinAllowedWeights hyperparameter for a subnet.

      This hyperparameter sets the minimum length of the weights vector that a validator must submit.
      It checks `weights.len() >= MinAllowedWeights`. For example, a validator could submit `[1000, 0, 0, 0]`
      to satisfy `MinAllowedWeights=4`, but this would fail if `MinAllowedWeights` were set to 5.
      This ensures validators distribute attention across the subnet.

      :param netuid: The unique identifier of the subnetwork.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:

                The minimum number of required weight connections, or `None` if the subnetwork does not
                    exist or the parameter is not found.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/subnets/subnet-hyperparameters>



   .. py:method:: modify_liquidity(wallet, netuid, position_id, liquidity_delta, hotkey_ss58 = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Modifies liquidity in liquidity position by adding or removing liquidity from it.

      :param wallet: The wallet used to sign the extrinsic (must be unlocked).
      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param position_id: The id of the position record in the pool.
      :param liquidity_delta: The amount of liquidity to be added or removed (add if positive or remove if negative).
      :param hotkey_ss58: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Example

         import bittensor as bt
         subtensor = bt.AsyncSubtensor(network="local")
         await subtensor.initialize()
         my_wallet = bt.Wallet()
         
         # if liquidity_delta is negative
         my_liquidity_delta = Balance.from_tao(100) * -1
         await subtensor.modify_liquidity(
             wallet=my_wallet,
             netuid=123,
             position_id=2,
             liquidity_delta=my_liquidity_delta
         )
         
         # if liquidity_delta is positive
         my_liquidity_delta = Balance.from_tao(120)
         await subtensor.modify_liquidity(
             wallet=my_wallet,
             netuid=123,
             position_id=2,
             liquidity_delta=my_liquidity_delta
         )

      .. note::

         Modifying is allowed even when user liquidity is enabled in specified subnet. Call `toggle_user_liquidity`
         to enable/disable user liquidity.



   .. py:method:: move_stake(wallet, origin_netuid, origin_hotkey_ss58, destination_netuid, destination_hotkey_ss58, amount = None, move_all_stake = False, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Moves stake to a different hotkey and/or subnet.

      :param wallet: The wallet to move stake from.
      :param origin_netuid: The netuid of the source subnet.
      :param origin_hotkey_ss58: The SS58 address of the source hotkey.
      :param destination_netuid: The netuid of the destination subnet.
      :param destination_hotkey_ss58: The SS58 address of the destination hotkey.
      :param amount: Amount of stake to move.
      :param move_all_stake: If `True`, moves all stake from the source hotkey to the destination hotkey.
      :param mev_protection: I`f` True, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - Price Protection: <https://docs.learnbittensor.org/learn/price-protection>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#staking-operations-rate-limits>



   .. py:method:: neuron_for_uid(uid, netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves detailed information about a specific neuron identified by its unique identifier (UID) within a
      specified subnet (netuid) of the Bittensor network. This function provides a comprehensive view of a neuron's
      attributes, including its stake, rank, and operational status.

      :param uid: The unique identifier of the neuron.
      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number for the query.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: Detailed information about the neuron if found, a null neuron otherwise

      This function is crucial for analyzing individual neurons' contributions and status within a specific subnet,
      offering insights into their roles in the network's consensus and validation mechanisms.



   .. py:method:: neurons(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves a list of all neurons within a specified subnet of the Bittensor network.
      This function provides a snapshot of the subnet's neuron population, including each neuron's attributes and
      network interactions.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number for the query.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: A list of NeuronInfo objects detailing each neuron's characteristics in the subnet.

      Understanding the distribution and status of neurons within a subnet is key to comprehending the network's
      decentralized structure and the dynamics of its consensus and governance processes.



   .. py:method:: neurons_lite(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves a list of neurons in a 'lite' format from a specific subnet of the Bittensor network.
      This function provides a streamlined view of the neurons, focusing on key attributes such as stake and network
      participation.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number for the query.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: A list of simplified neuron information for the subnet.

      This function offers a quick overview of the neuron population within a subnet, facilitating efficient analysis
      of the network's decentralized structure and neuron dynamics.



   .. py:method:: poke_deposit(wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Adjusts deposits made for proxies and announcements based on current values.

      This method recalculates and updates the locked deposit amounts for both proxy relationships and announcements
      for the signing account. It can be used to potentially lower the locked amount if the deposit requirements have
      changed (e.g., due to runtime upgrades or changes in the number of proxies/announcements).

      :param wallet: Bittensor wallet object (the account whose deposits will be adjusted).
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
      :param wait_for_finalization: Whether to wait for the finalization of the transaction.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. note::

         This method automatically adjusts deposits for both proxy relationships and announcements. No parameters are
         needed as it operates on the account's current state.

      When to use:
          - After runtime upgrade, if deposit constants have changed.
          - After removing proxies/announcements, to free up excess locked funds.
          - Periodically to optimize locked deposit amounts.



   .. py:method:: proxy(wallet, real_account_ss58, force_proxy_type, call, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Executes a call on behalf of the real account through a proxy.

      This method allows a proxy account (delegate) to execute a call on behalf of the real account (delegator). The
      call is subject to the permissions defined by the proxy type and must respect the delay period if one was set
      when the proxy was added.

      :param wallet: Bittensor wallet object (should be the proxy account wallet).
      :param real_account_ss58: The SS58 address of the real account on whose behalf the call is being made.
      :param force_proxy_type: The type of proxy to use for the call. If `None`, any proxy type can be used. Otherwise,
                               must match one of the allowed proxy types. Can be a string or ProxyType enum value.
      :param call: The inner call to be executed on behalf of the real account.
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

         - The call must be permitted by the proxy type. For example, a "NonTransfer" proxy cannot execute transfer
           calls. The delay period must also have passed since the proxy was added.



   .. py:method:: proxy_announced(wallet, delegate_ss58, real_account_ss58, force_proxy_type, call, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Executes an announced call on behalf of the real account through a proxy.

      This method executes a call that was previously announced via :meth:`announce_proxy`. The call must match the
      call_hash that was announced, and the delay period must have passed since the announcement was made. The real
      account has the opportunity to review and reject the announcement before execution.

      :param wallet: Bittensor wallet object (should be the proxy account wallet that made the announcement).
      :param delegate_ss58: The SS58 address of the delegate proxy account that made the announcement.
      :param real_account_ss58: The SS58 address of the real account on whose behalf the call will be made.
      :param force_proxy_type: The type of proxy to use for the call. If `None`, any proxy type can be used. Otherwise,
                               must match one of the allowed proxy types. Can be a string or ProxyType enum value.
      :param call: The inner call to be executed on behalf of the real account (must match the announced call_hash).
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

         - The call_hash of the provided call must match the call_hash that was announced. The announcement must not
           have been rejected by the real account, and the delay period must have passed.



   .. py:method:: query_constant(module_name, constant_name, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves a constant from the specified module on the Bittensor blockchain.

      Use this function for nonstandard queries to constants defined within the Bittensor blockchain, if these cannot
      be accessed through other, standard getter methods.

      :param module_name: The name of the module containing the constant (e.g., `Balances`, `SubtensorModule`).
      :param constant_name: The name of the constant to retrieve (e.g., `ExistentialDeposit`).
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: A SCALE-decoded object if found, `None` otherwise. Access the actual value using `.value` attribute.
                Common types include int (for counts/blocks), Balance objects (for amounts in Rao), and booleans.



   .. py:method:: query_identity(coldkey_ss58, block = None, block_hash = None, reuse_block = False)
      :async:


      Queries the identity of a neuron on the Bittensor blockchain using the given key. This function retrieves
      detailed identity information about a specific neuron, which is a crucial aspect of the network's decentralized
      identity and governance system.

      :param coldkey_ss58: Coldkey used to query the neuron's identity (technically the neuron's coldkey SS58 address).
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number at which to perform the query.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: An object containing the identity information of the neuron if found, `None` otherwise.

      The identity information can include various attributes such as the neuron's stake, rank, and other
      network-specific details, providing insights into the neuron's role and status within the Bittensor network.

      .. note::

         See the `Bittensor CLI documentation <https://docs.bittensor.com/reference/btcli>`_ for supported identity
         parameters.



   .. py:method:: query_map(module, name, params = None, block = None, block_hash = None, reuse_block = False)
      :async:


      Queries map storage from any module on the Bittensor blockchain.

      Use this function for nonstandard queries to map storage defined within the Bittensor blockchain, if these cannot
      be accessed through other, standard getter methods.

      :param module: The name of the module from which to query the map storage (e.g., "SubtensorModule", "System").
      :param name: The specific storage function within the module to query (e.g., "Bonds", "Weights").
      :param params: Parameters to be passed to the query.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: A data structure representing the map storage if found, None otherwise.
      :rtype: AsyncQueryMapResult



   .. py:method:: query_map_subtensor(name, params = None, block = None, block_hash = None, reuse_block = False)
      :async:


      Queries map storage from the Subtensor module on the Bittensor blockchain.

      Use this function for nonstandard queries to map storage defined within the Bittensor blockchain, if these cannot
      be accessed through other, standard getter methods.

      :param name: The name of the map storage function to query.
      :param params: A list of parameters to pass to the query function.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: An object containing the map-like data structure, or `None` if not found.



   .. py:method:: query_module(module, name, params = None, block = None, block_hash = None, reuse_block = False)
      :async:


      Queries any module storage on the Bittensor blockchain with the specified parameters and block number.
      This function is a generic query interface that allows for flexible and diverse data retrieval from various
      blockchain modules. Use this function for nonstandard queries to storage defined within the Bittensor
      blockchain, if these cannot be accessed through other, standard getter methods.

      :param module: The name of the module from which to query data.
      :param name: The name of the storage function within the module.
      :param params: A list of parameters to pass to the query function.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: An object containing the requested data if found, `None` otherwise.



   .. py:method:: query_runtime_api(runtime_api, method, params, block = None, block_hash = None, reuse_block = False)
      :async:


      Queries the runtime API of the Bittensor blockchain, providing a way to interact with the underlying runtime
      and retrieve data encoded in Scale Bytes format. Use this function for nonstandard queries to the runtime
       environment, if these cannot be accessed through other, standard getter methods.

      :param runtime_api: The name of the runtime API to query.
      :param method: The specific method within the runtime API to call.
      :param params: The parameters to pass to the method call.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The decoded result from the runtime API call, or `None` if the call fails.



   .. py:method:: query_subtensor(name, params = None, block = None, block_hash = None, reuse_block = False)
      :async:


      Queries named storage from the Subtensor module on the Bittensor blockchain.

      Use this function for nonstandard queries to storage defined within the Bittensor blockchain, if these cannot
      be accessed through other, standard getter methods.

      :param name: The name of the storage function to query.
      :param params: A list of parameters to pass to the query function.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: An object containing the requested data.
      :rtype: query_response



   .. py:method:: recycle(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the 'Burn' hyperparameter for a specified subnet.

      The 'Burn' parameter represents the amount of TAO that is recycled when registering a neuron
      on this subnet. Recycled tokens are removed from circulation but can be re-emitted, unlike
      burned tokens which are permanently removed.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The amount of TAO recycled per neuron registration, or `None` if the subnet does not exist.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/resources/glossary#recycling-and-burning>



   .. py:method:: refund_crowdloan(wallet, crowdloan_id, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Refunds contributors from a failed crowdloan campaign that did not reach its cap.

      Refunds are batched, processing up to `RefundContributorsLimit` (default 50) contributors per call.
      For campaigns with more contributors, multiple calls are required. Only non-creator contributors are
      refunded; the creator's deposit remains until dissolution via `dissolve_crowdloan`.

      Only the crowdloan creator can call this method for a non-finalized crowdloan.

      :param wallet: Bittensor wallet instance used to sign the transaction (must be the crowdloan creator).
      :param crowdloan_id: The unique identifier of the crowdloan to refund.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after submission.
      :param raise_error: If `True`, raises an exception rather than returning failure in the response.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` indicating success or failure, with error details if applicable.

      .. admonition:: Notes

         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Crowdloan Lifecycle: <https://docs.learnbittensor.org/subnets/crowdloans#crowdloan-lifecycle>
         - Refund and Dissolve: <https://docs.learnbittensor.org/subnets/crowdloans/crowdloans-tutorial#alternative-path-refund-and-dissolve>



   .. py:method:: register(wallet, netuid, limit_price = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Registers a neuron on the Bittensor network by recycling TAO, with automatic price protection.

      Uses ``register_limit`` under the hood. If ``limit_price`` is not provided, it is automatically
      calculated as the current recycle (burn) cost plus a 0.5% tolerance to protect against price fluctuations.

      For root subnet (``netuid == 0``), delegates to ``root_register_extrinsic``.

      :param wallet: The wallet associated with the neuron to be registered.
      :param netuid: The unique identifier of the subnet.
      :param limit_price: Maximum acceptable burn price as a Balance instance. If ``None``, automatically calculated
                          as ``recycle * 1.005`` (0.5% tolerance). If the on-chain burn price exceeds this value, the
                          transaction will fail with RegistrationPriceLimitExceeded.
      :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If ``False``, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#registration-rate-limits>



   .. py:method:: register_limit(wallet, netuid, limit_price, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Registers a neuron on the Bittensor network by recycling TAO, with a maximum burn price limit.

      Unlike ``burned_register``, this method includes a ``limit_price`` parameter that ensures the registration
      will only proceed if the current on-chain burn price does not exceed the specified maximum. This protects
      against unexpected price spikes between reading the price and submitting the transaction.

      :param wallet: The wallet associated with the neuron to be registered.
      :param netuid: The unique identifier of the subnet.
      :param limit_price: Maximum acceptable burn price as a Balance instance. If the on-chain burn price exceeds
                          this value, the transaction will fail with RegistrationPriceLimitExceeded.
      :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If ``False``, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#registration-rate-limits>



   .. py:method:: register_subnet(wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Registers a new subnetwork on the Bittensor network.

      :param wallet: The wallet to be used for subnet registration.
      :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#network-registration-rate-limit>



   .. py:method:: reject_proxy_announcement(wallet, delegate_ss58, call_hash, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Rejects an announcement made by a proxy delegate.

      This method allows the real account to reject an announcement made by a proxy delegate, preventing the announced
      call from being executed. Once rejected, the announcement cannot be executed and the announcement deposit is
      returned to the delegate.

      :param wallet: Bittensor wallet object (should be the real account wallet).
      :param delegate_ss58: The SS58 address of the delegate proxy account whose announcement is being rejected.
      :param call_hash: The hash of the call that was announced and is now being rejected.
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



   .. py:method:: remove_liquidity(wallet, netuid, position_id, hotkey_ss58 = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Remove liquidity and credit balances back to wallet's hotkey stake.

      :param wallet: The wallet used to sign the extrinsic (must be unlocked).
      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param position_id: The id of the position record in the pool.
      :param hotkey_ss58: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. note::

         - Adding is allowed even when user liquidity is enabled in specified subnet. Call `toggle_user_liquidity`
           extrinsic to enable/disable user liquidity.
         - To get the `position_id` use `get_liquidity_list` method.



   .. py:method:: remove_proxies(wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Removes all proxy relationships for the account in a single transaction.

      This method removes all proxy relationships for the signing account in a single call, which is more efficient
      than removing them one by one using :meth:`remove_proxy`. The deposit for all proxies will be returned to the
      account.

      :param wallet: Bittensor wallet object. The account whose proxies will be removed (the delegator). All proxy
                     relationships where wallet.coldkey.ss58_address is the real account will be removed.
      :param mev_protection: If `True`, encrypts` and submits the transaction through the MEV Shield pallet to protect
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

         - This removes all proxy relationships for the account, regardless of proxy type or delegate. Use
           :meth:`remove_proxy` if you need to remove specific proxy relationships selectively.



   .. py:method:: remove_proxy(wallet, delegate_ss58, proxy_type, delay, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Removes a specific proxy relationship.

      This method removes a single proxy relationship between the real account and a delegate. The parameters must
      exactly match those used when the proxy was added via :meth:`add_proxy`. The deposit for this proxy will be returned
      to the account.

      :param wallet: Bittensor wallet object.
      :param delegate_ss58: The SS58 address of the delegate proxy account to remove.
      :param proxy_type: The type of proxy permissions to remove. Can be a string or ProxyType enum value.
      :param delay: The announcement delay value (in blocks) for the proxy being removed. Must exactly match the delay
                    value that was set when the proxy was originally added via :meth:`add_proxy`. This is a required
                    identifier for the specific proxy relationship, not a delay before removal takes effect (removal is
                    immediate).
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
           Use :meth:`get_proxies_for_real_account` to retrieve the exact parameters for existing proxies.



   .. py:method:: remove_proxy_announcement(wallet, real_account_ss58, call_hash, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Removes an announcement made by a proxy account.

      This method allows the proxy account to remove its own announcement before it is executed or rejected. This
      frees up the announcement deposit and prevents the call from being executed. Only the proxy account that made
      the announcement can remove it.

      :param wallet: Bittensor wallet object (should be the proxy account wallet that made the announcement).
      :param real_account_ss58: The SS58 address of the real account on whose behalf the call was announced.
      :param call_hash: The hash of the call that was announced and is now being removed.
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

         - Only the proxy account that made the announcement can remove it. The real account can reject it via
           :meth:`reject_proxy_announcement`, but cannot remove it directly.



   .. py:method:: reveal_weights(wallet, netuid, uids, weights, salt, mechid = 0, max_attempts = 5, version_key = version_as_int, *, mev_protection = DEFAULT_MEV_PROTECTION, period = 16, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Reveals the weights for a specific subnet on the Bittensor blockchain using the provided wallet.
      This action serves as a revelation of the neuron's previously committed weight distribution.

      :param wallet: Bittensor Wallet instance.
      :param netuid: The unique identifier of the subnet.
      :param uids: NumPy array of neuron UIDs for which weights are being revealed.
      :param weights: NumPy array of weight values corresponding to each UID.
      :param salt: NumPy array of salt values corresponding to the hash function.
      :param mechid: The subnet mechanism unique identifier.
      :param max_attempts: The number of maximum attempts to reveal weights.
      :param version_key: Version key for compatibility with the network.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      This function allows neurons to reveal their previously committed weight distribution, ensuring transparency and
      accountability within the Bittensor network.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/glossary#commit-reveal>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#weights-setting-rate-limit>



   .. py:method:: root_register(wallet, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Register neuron by recycling some TAO.

      :param wallet: The wallet associated with the neuron to be registered.
      :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#registration-rate-limits>



   .. py:method:: root_set_pending_childkey_cooldown(wallet, cooldown, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Sets the pending childkey cooldown.

      :param wallet: bittensor wallet instance.
      :param cooldown: the number of blocks to setting pending childkey cooldown.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. note:: This operation can only be successfully performed if your wallet has root privileges.



   .. py:method:: serve_axon(netuid, axon, certificate = None, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Registers an Axon endpoint on the network for receiving queries from other neurons.

      This method publishes your neuron's IP address, port, and protocol information to the blockchain, making it
      discoverable by other neurons in the subnet. Optionally, you can include a TLS certificate to enable secure,
      encrypted communication via mutual TLS (mTLS).

      When a certificate is provided, the blockchain stores both your endpoint information and your TLS public key,
      allowing other neurons to discover your certificate and establish encrypted connections. When re-serving with
      updated metadata (including a new certificate), the previous values are overwritten.

      :param netuid: The unique identifier of the subnetwork.
      :param axon: The Axon instance containing your endpoint configuration (IP, port, protocol).
      :param certificate: Optional TLS certificate for secure communication. Should contain a public key (up to 64
                          bytes) and algorithm identifier. If `None`, standard unencrypted serving is used.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until
                             validators decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after submission. If not
                     included in a block within this period, the transaction expires.
      :param raise_error: If True, raises an exception on failure instead of returning an error response.
      :param wait_for_inclusion: If True, waits for the transaction to be included in a block before returning.
      :param wait_for_finalization: If True, waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection
                                          used.

      :returns: ExtrinsicResponse containing the success status and transaction details. On success, the response includes
                the external IP and port that were registered.

      .. admonition:: Notes

         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#serving-rate-limits>



   .. py:method:: set_auto_stake(wallet, netuid, hotkey_ss58, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Sets the coldkey to automatically stake to the hotkey within specific subnet mechanism.

      :param wallet: Bittensor Wallet instance.
      :param netuid: The subnet unique identifier.
      :param hotkey_ss58: The SS58 address of the validator's hotkey to which the miner automatically stakes all rewards
                          received from the specified subnet immediately upon receipt.
      :param mev_protection: If T`rue`, encrypts and submits the transaction through the MEV Shield pallet to protect
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

      .. note:: Use the `get_auto_stakes` method to get the hotkey address of the validator where auto stake is set.



   .. py:method:: set_children(wallet, hotkey_ss58, netuid, children, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Allows a coldkey to set children-keys.

      :param wallet: bittensor wallet instance.
      :param hotkey_ss58: The `SS58` address of the neuron's hotkey.
      :param netuid: The netuid value.
      :param children: A list of children with their proportions.
      :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      :raises DuplicateChild: There are duplicates in the list of children.
      :raises InvalidChild: Child is the hotkey.
      :raises NonAssociatedColdKey: The coldkey does not own the hotkey or the child is the same as the hotkey.
      :raises NotEnoughStakeToSetChildkeys: Parent key doesn't have minimum own stake.
      :raises ProportionOverflow: The sum of the proportions does exceed uint64.
      :raises RegistrationNotPermittedOnRootSubnet: Attempting to register a child on the root network.
      :raises SubnetNotExists: Attempting to register to a non-existent network.
      :raises TooManyChildren: Too many children in request.
      :raises TxRateLimitExceeded: Hotkey hit the rate limit.
      :raises bittensor_wallet.errors.KeyFileError: Failed to decode keyfile data.
      :raises bittensor_wallet.errors.PasswordError: Decryption failed or wrong password for decryption provided.

      .. admonition:: Notes

         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#child-hotkey-operations-rate-limit>



   .. py:method:: set_commitment(wallet, netuid, data, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Commits arbitrary data to the Bittensor network by publishing metadata.
      # TODO: check with @roman, is this about 'arbitrary data' or 'commit-reveal'? we need a real example here if this is important.
              This method allows neurons to publish arbitrary data to the blockchain, which can be used for various purposes
              such as sharing model updates, configuration data, or other network-relevant information. The data is encoded
              and stored on-chain as metadata.

      :param wallet: The wallet associated with the neuron committing the data.
      :param netuid: The unique identifier of the subnetwork.
      :param data: The data string to be committed to the network. The data will be encoded as bytes before submission.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
      :param wait_for_finalization: Whether to wait for the finalization of the transaction.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         The data is automatically encoded as bytes before submission. There may be size limits on metadata
         payloads enforced by the chain.
         
         - <https://docs.learnbittensor.org/resources/glossary#commit-reveal>
         - <https://docs.learnbittensor.org/concepts/commit-reveal>



   .. py:method:: set_delegate_take(wallet, hotkey_ss58, take, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Sets the delegate 'take' percentage for a neuron identified by its hotkey.
      The 'take' represents the percentage of rewards that the delegate claims from its nominators' stakes.

      :param wallet: bittensor wallet instance.
      :param hotkey_ss58: The `SS58` address of the neuron's hotkey.
      :param take: Percentage reward for the delegate.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      :raises DelegateTakeTooHigh: Delegate take is too high.
      :raises DelegateTakeTooLow: Delegate take is too low.
      :raises DelegateTxRateLimitExceeded: A transactor exceeded the rate limit for delegate transaction.
      :raises HotKeyAccountNotExists: The hotkey does not exist.
      :raises NonAssociatedColdKey: Request to stake, unstake, or subscribe is made by a coldkey that is not associated
          with the hotkey account.
      :raises bittensor_wallet.errors.PasswordError: Decryption failed or wrong password for decryption provided.
      :raises bittensor_wallet.errors.KeyFileError: Failed to decode keyfile data.

      The delegate take is a critical parameter in the network's incentive structure, influencing the distribution of
      rewards among neurons and their nominators.

      .. admonition:: Notes

         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#delegate-take-rate-limit>



   .. py:method:: set_reveal_commitment(wallet, netuid, data, blocks_until_reveal = 360, block_time = 12, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Commits arbitrary data to the Bittensor network using timelock encryption for reveal scheduling.

      This method commits data that will be automatically revealed after a specified number of blocks using drand
      timelock encryption. The data is encrypted using `get_encrypted_commitment`, which uses drand rounds to ensure
      the data cannot be revealed before the specified reveal time.

      # TODO: check with @roman, is this about 'arbitrary data' or 'commit-reveal'? we need a real example here if this is important, and documentating a real commit reveal flow.

      :param wallet: The wallet associated with the neuron committing the data.
      :param netuid: The unique identifier of the subnetwork.
      :param data: The data to be committed to the network.
      :param blocks_until_reveal: The number of blocks from now after which the data will be revealed. Then number of
                                  blocks in one epoch.
      :param block_time: The number of seconds between each block (default 12.0 for standard blocks, 10.0 for fast blocks).
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
      :param wait_for_finalization: Whether to wait for the finalization of the transaction.
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

      :returns: The result object of the extrinsic execution. The response's "data" field contains
                `{"encrypted": encrypted, "reveal_round": reveal_round}` on success.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         A commitment can be set once per subnet epoch and is reset at the next epoch automatically. The timelock
         encryption ensures the data cannot be revealed before the specified drand round.
         
         - <https://docs.learnbittensor.org/resources/glossary#commit-reveal>
         - <https://docs.learnbittensor.org/resources/glossary#drandtime-lock-encryption>
         - <https://docs.learnbittensor.org/concepts/commit-reveal>



   .. py:method:: set_root_claim_type(wallet, new_root_claim_type, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Submit an extrinsic to set the root claim type for the wallet's coldkey.

      The root claim type determines how future Alpha dividends from subnets are handled when they are claimed for
      the wallet's coldkey:

      - `Swap`: Alpha dividends are swapped to TAO at claim time and restaked on the Root Subnet (default).
      - `Keep`: Alpha dividends remain as Alpha on the originating subnets.

      :param wallet: Bittensor `Wallet` instance.
      :param new_root_claim_type: The new root claim type to set. Can be:
                                  - String: "Swap" or "Keep"
                                  - RootClaimType: RootClaimType.Swap, RootClaimType.Keep
                                  - Dict: {"KeepSubnets": {"subnets": [1, 2, 3]}}
                                  - Callable: RootClaimType.KeepSubnets([1, 2, 3])
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: Number of blocks for which the transaction remains valid after submission. If the extrinsic is
                     not included in a block within this window, it will expire and be rejected.
      :param raise_error: Whether to raise a Python exception instead of returning a failed `ExtrinsicResponse`.
      :param wait_for_inclusion: Whether to wait until the extrinsic is included in a block before returning.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic in a block before returning.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` describing the result of the extrinsic execution.

      .. admonition:: Notes

         - This setting applies to both automatic and manual root claims going forward; it does not retroactively
           change how already-claimed dividends were processed.
         - Only the treatment of Alpha dividends is affected; the underlying TAO stake on the Root Subnet is
           unchanged.
         - See: <https://docs.learnbittensor.org/staking-and-delegation/root-claims>
         - See also: <https://docs.learnbittensor.org/staking-and-delegation/root-claims/managing-root-claims>



   .. py:method:: set_subnet_identity(wallet, netuid, subnet_identity, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Sets the identity of a subnet for a specific wallet and network.

      :param wallet: The wallet instance that will authorize the transaction.
      :param netuid: The unique ID of the network on which the operation takes place.
      :param subnet_identity: The identity data of the subnet including attributes like name, GitHub repository, contact,
                              URL, discord, description, and any additional metadata.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse



   .. py:method:: set_weights(wallet, netuid, uids, weights, mechid = 0, block_time = 12.0, commit_reveal_version = 4, max_attempts = 5, version_key = version_as_int, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Sets the weight vector for a neuron acting as a validator, specifying the weights assigned to subnet miners
      based on their performance evaluation.

      This method allows subnet validators to submit their weight vectors, which rank the value of each subnet miner's
      work. These weight vectors are used by the Yuma Consensus algorithm to compute emissions for both validators and
      miners.

      The method automatically handles both commit-reveal-enabled subnets (CRv4) and direct weight setting. For
      commit-reveal subnets, weights are committed first and then revealed after the reveal period. The method respects
      rate limiting constraints enforced by `_blocks_weight_limit`.

      :param wallet: The wallet associated with the subnet validator setting the weights.
      :param netuid: The unique identifier of the subnet.
      :param uids: The list of subnet miner neuron UIDs that the weights are being set for.
      :param weights: The corresponding weights to be set for each UID, representing the validator's evaluation of each
                      miner's performance.
      :param mechid: The subnet mechanism unique identifier (default 0 for primary mechanism).
      :param block_time: The block duration in seconds (default 12.0). Used for timing calculations in commit-reveal
                         operations.
      :param commit_reveal_version: The version of the commit-reveal protocol to use (default 4 for CRv4).
      :param max_attempts: The maximum number of attempts to set weights if rate limiting is encountered (default 5).
      :param version_key: Version key for compatibility with the network.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Example

         # Set weights directly (for non-commit-reveal subnets)
         response = await subtensor.set_weights(
             wallet=wallet,
             netuid=1,
             uids=[0, 1, 2],
             weights=[0.5, 0.3, 0.2]
         )
         
         # For commit-reveal subnets, the method automatically handles commit and reveal phases

      .. admonition:: Notes

         This function is crucial in the Yuma Consensus mechanism, where each validator's weight vector contributes
         to the overall weight matrix used to calculate emissions and maintain network consensus.
         
         - <https://docs.learnbittensor.org/resources/glossary#yuma-consensus>
         - <https://docs.learnbittensor.org/concepts/commit-reveal>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#weights-setting-rate-limit>



   .. py:method:: sign_and_send_extrinsic(call, wallet, sign_with = 'coldkey', use_nonce = False, nonce_key = 'hotkey', nonce = None, *, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = False, calling_function = None)
      :async:


      Helper method to sign and submit an extrinsic call to chain.

      :param call: A prepared Call object
      :param wallet: The wallet whose coldkey will be used to sign the extrinsic
      :param sign_with: The wallet's keypair to use for the signing. Options are "coldkey", "hotkey", "coldkeypub"
      :param use_nonce: Unique identifier for the transaction related with hot/coldkey.
      :param nonce_key: The type on nonce to use. Options are "hotkey" or "coldkey".
      :param nonce: The nonce to use for the transaction. If not provided, it will be fetched from the chain.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param raise_error: Raises the relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait until the extrinsic call is included on the chain
      :param wait_for_finalization: Whether to wait until the extrinsic call is finalized on the chain
      :param calling_function: The name of the calling function.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      :raises SubstrateRequestException: Substrate request exception.



   .. py:method:: sim_swap(origin_netuid, destination_netuid, amount, block_hash = None)
      :async:


      Simulates a swap/stake operation and calculates the fees and resulting amounts.

      This method queries the SimSwap Runtime API to calculate the swap fees (in Alpha or TAO) and the quantities
      of Alpha or TAO tokens expected as output from the transaction. This simulation does NOT include the
      blockchain extrinsic transaction fee (the fee to submit the transaction itself).

      When moving stake between subnets, the operation may involve swapping Alpha (subnet-specific stake token) to
      TAO (the base network token), then TAO to Alpha on the destination subnet. For subnet 0 (root network), all
      stake is in TAO.

      :param origin_netuid: Netuid of the source subnet (0 if add stake).
      :param destination_netuid: Netuid of the destination subnet.
      :param amount: Amount to swap/stake as a Balance object. Use `Balance.from_tao(...)` or
                     `Balance.from_rao(...)` to create the amount.
      :param block_hash: The hash of the blockchain block for the query. If `None`, uses the current chain head.

      :returns: Object containing `alpha_fee`, `tao_fee`, `alpha_amount`, and `tao_amount` fields
                representing the swap fees and output amounts.
      :rtype: SimSwapResult

      .. admonition:: Example

         # Simulate staking 100 TAO stake to subnet 1
         result = await subtensor.sim_swap(
             origin_netuid=0,
             destination_netuid=1,
             amount=Balance.from_tao(100)
         )
         print(f"Fee: {result.tao_fee.tao} TAO, Output: {result.alpha_amount} Alpha")

      .. admonition:: Notes

         - **Alpha**: Subnet-specific stake token (dynamic TAO)
         - **TAO**: Base network token; subnet 0 uses TAO directly
         - The returned fees do NOT include the extrinsic transaction fee
         
         - Transaction Fees: <https://docs.learnbittensor.org/learn/fees>
         - Glossary: <https://docs.learnbittensor.org/glossary>



   .. py:method:: start_call(wallet, netuid, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = False, wait_for_revealed_execution = True)
      :async:


      Submits a start_call extrinsic to the blockchain to trigger emission start for a subnet.

      This method initiates the emission mechanism for a newly registered subnet. Once called, the subnet becomes
      "active" and begins receiving TAO emissions. Only the subnet owner (the wallet that registered the subnet) is
      authorized to call this method.

      :param wallet: The wallet used to sign the extrinsic (must be unlocked and must be the subnet owner).
      :param netuid: The unique identifier of the target subnet for which emissions are being started.
      :param mev_protection: If True, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
      :param wait_for_finalization: Whether to wait for the finalization of the transaction.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         Only the subnet owner can call this method. After successful execution, the subnet becomes active and
         eligible for TAO emissions.
         
         - <https://docs.learnbittensor.org/subnets/create-a-subnet>



   .. py:method:: state_call(method, data, block = None, block_hash = None, reuse_block = False)
      :async:


      Makes a state call to the Bittensor blockchain, allowing for direct queries of the blockchain's state.
      This function is typically used for advanced, nonstandard queries not provided by other getter methods.

      Use this method when you need to query runtime APIs or storage functions that don't have dedicated
      wrapper methods in the SDK. For standard queries, prefer the specific getter methods (e.g., `get_balance`,
      `get_stake`) which provide better type safety and error handling.

      :param method: The runtime API method name (e.g., "SubnetInfoRuntimeApi", "get_metagraph").
      :param data: Hex-encoded string of the SCALE-encoded parameters to pass to the method.
      :param block: The block number to query. Do not specify if using `block_hash` or `reuse_block`.
      :param block_hash: The block hash at which to check the parameter. Do not set if using `block` or
                         `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The result of the rpc call.



   .. py:method:: subnet(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the subnet information for a single subnet in the Bittensor network.

      :param netuid: The unique identifier of the subnet.
      :param block: The block number to get the subnets at.
      :param block_hash: The hash of the blockchain block number for the query.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: A DynamicInfo object, containing detailed information about a subnet.



   .. py:method:: subnet_exists(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Checks if a subnet with the specified unique identifier (netuid) exists within the Bittensor network.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number at which to check the subnet existence.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: `True` if the subnet exists, `False` otherwise.

      This function is critical for verifying the presence of specific subnets in the network, enabling a deeper
      understanding of the network's structure and composition.



   .. py:method:: subnetwork_n(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns the current number of registered neurons (UIDs) in a subnet.

      :param netuid: The unique identifier of the subnetwork.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The current number of registered neurons in the subnet, or `None` if the subnetwork does not exist.



   .. py:attribute:: substrate


   .. py:method:: swap_coldkey_announced(wallet, new_coldkey_ss58, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Executes a previously announced coldkey swap.

      This method executes a coldkey swap that was previously announced via `announce_coldkey_swap`. The new coldkey
      address must match the hash that was announced, and the delay period must have passed.

      :param wallet: Bittensor wallet object (should be the current coldkey wallet that made the announcement).
      :param new_coldkey_ss58: SS58 address of the new coldkey to swap to. This must match the hash that was announced.
      :param mev_protection: If ``True``, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If ``False``, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning ``False`` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
      :param wait_for_finalization: Whether to wait for the finalization of the transaction.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - The new coldkey hash must match the hash that was announced.
         - The delay period must have passed (check via `get_coldkey_swap_announcement`).
         - All assets, stakes, subnet ownerships, and hotkey associations are transferred from the old coldkey to the new one.
         - See: <https://docs.learnbittensor.org/keys/coldkey-swap>



   .. py:method:: swap_stake(wallet, hotkey_ss58, origin_netuid, destination_netuid, amount, safe_swapping = False, allow_partial_stake = False, rate_tolerance = 0.005, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Moves stake between subnets while keeping the same coldkey-hotkey pair ownership.

      This method swaps stake from one subnet to another, effectively moving the same stake amount (minus fees) from
      the origin subnet to the destination subnet. Like subnet hopping - same owner, same hotkey, just changing which
      subnet the stake is in.

      The `amount` parameter is specified as a Balance object (in TAO or Alpha units depending on the subnet). The
      actual amount received may be less due to swap fees and potential slippage. When `safe_swapping` is enabled, the
      method uses price ratio checks to protect against unfavorable price movements during the swap.

      :param wallet: The wallet to swap stake from.
      :param hotkey_ss58: The SS58 address of the hotkey whose stake is being swapped.
      :param origin_netuid: The netuid from which stake is removed.
      :param destination_netuid: The netuid to which stake is added.
      :param amount: The amount to swap as a Balance object (in TAO or Alpha units). The actual amount received may be
                     less due to swap fees and slippage.
      :param safe_swapping: If `True`, enables price safety checks to protect against fluctuating prices. The swap
                            will only execute if the price ratio between subnets doesn't exceed the rate tolerance.
      :param allow_partial_stake: If `True` and `safe_swapping` is enabled, allows partial stake swaps when the full
                                  amount would exceed the price tolerance. If `False`, the entire swap fails if it would exceed the
                                  tolerance.
      :param rate_tolerance: The maximum allowed increase in the price ratio between subnets
                             (origin_price/destination_price). For example, 0.005 = 0.5% maximum increase. Only used when
                             `safe_swapping` is `True`.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the inclusion of the transaction.
      :param wait_for_finalization: Whether to wait for the finalization of the transaction.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         The price ratio for swap_stake in safe mode is calculated as: origin_subnet_price / destination_subnet_price.
         When `safe_swapping` is enabled, the swap will only execute if:
         - With `allow_partial_stake=False`: The entire swap amount can be executed without the price ratio
           increasing more than `rate_tolerance`.
         - With `allow_partial_stake=True`: A partial amount will be swapped up to the point where the price ratio
           would increase by `rate_tolerance`.
         - Price Protection: <https://docs.learnbittensor.org/learn/price-protection>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#staking-operations-rate-limits>
         
         - <https://docs.learnbittensor.org/navigating-subtensor/swap-stake>



   .. py:method:: tempo(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns the Tempo hyperparameter for a subnet.

      Tempo determines the length of an epoch in blocks. It defines how frequently the subnet's consensus mechanism
      runs, calculating emissions and updating rankings. A tempo of 360 blocks equals approximately 72 minutes
      (360 blocks × 12 seconds per block).

      :param netuid: The unique identifier of the subnetwork.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns: The tempo value in blocks, or `None` if the subnetwork does not exist.

      .. admonition:: Notes

         - <https://docs.learnbittensor.org/resources/glossary#tempo>
         - <https://docs.learnbittensor.org/resources/glossary#epoch>



   .. py:method:: toggle_user_liquidity(wallet, netuid, enable, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Toggles the user liquidity feature for a specified subnet.

      This method enables or disables user liquidity positions for a subnet. Only the subnet owner (the wallet that
      registered the subnet) is authorized to call this method.

      :param wallet: The wallet used to sign the extrinsic (must be unlocked and must be the subnet owner).
      :param netuid: The unique identifier of the target subnet for which user liquidity is being toggled.
      :param enable: Boolean indicating whether to enable (`True`) or disable (`False`) user liquidity.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         Only the subnet owner can execute this call successfully.
         
         - <https://docs.learnbittensor.org/liquidity-positions/liquidity-positions>



   .. py:method:: transfer(wallet, destination_ss58, amount, transfer_all = False, keep_alive = True, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = False, wait_for_revealed_execution = True)
      :async:


      Transfers TAO tokens from the source wallet to a destination address.

      This method transfers TAO tokens from the wallet's coldkey to the specified destination address. The amount is
      specified as a Balance object (in TAO or Rao units). Use `get_transfer_fee` to pre-estimate the transaction fee
      before sending.

      When `keep_alive=True`, the transfer ensures the source account maintains at least the existential deposit
      amount. If `keep_alive=False`, the transfer may reduce the source account balance below the existential deposit,
      which could result in the account being reaped (removed) from the chain.

      :param wallet: Source wallet for the transfer (must be unlocked).
      :param destination_ss58: Destination SS58 address for the transfer.
      :param amount: Amount of TAO to transfer as a Balance object. If `None` and `transfer_all=True`, transfers all
                     available balance minus fees and existential deposit (if `keep_alive=True`).
      :param transfer_all: If `True`, transfers all available tokens (minus fees and existential deposit if
                           `keep_alive=True`). Ignored if `amount` is specified.
      :param keep_alive: If `True`, ensures the source account maintains at least the existential deposit amount. If
                         `False`, the transfer may reduce the balance below the existential deposit, potentially causing the
                         account to be reaped.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         The existential deposit is the minimum balance required to keep an account alive on the chain. Use
         :meth:`get_existential_deposit` to query the current value.
         
         - <https://docs.learnbittensor.org/resources/glossary#existential-deposit>
         - <https://docs.learnbittensor.org/resources/glossary#transfer>



   .. py:method:: transfer_stake(wallet, destination_coldkey_ss58, hotkey_ss58, origin_netuid, destination_netuid, amount, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Transfers stake from one subnet to another while changing the coldkey owner.

      :param wallet: The wallet to transfer stake from.
      :param destination_coldkey_ss58: The destination coldkey SS58 address.
      :param hotkey_ss58: The hotkey SS58 address associated with the stake.
      :param origin_netuid: The source subnet UID.
      :param destination_netuid: The destination subnet UID.
      :param amount: Amount to transfer.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - Price Protection: <https://docs.learnbittensor.org/learn/price-protection>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#staking-operations-rate-limits>



   .. py:method:: tx_rate_limit(block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the transaction rate limit for the Bittensor network as of a specific blockchain block.
      This rate limit sets the maximum number of transactions that can be processed within a given time frame.

      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the blockchain block number at which to check the subnet existence.
      :param reuse_block: Whether to reuse the last-used block hash.

      :returns: The transaction rate limit of the network, `None` if not available.

      The transaction rate limit is an essential parameter for ensuring the stability and scalability of the Bittensor
      network. It helps in managing network load and preventing congestion, thereby maintaining efficient and timely
      transaction processing.



   .. py:method:: unstake(wallet, netuid, hotkey_ss58, amount, allow_partial_stake = False, safe_unstaking = False, rate_tolerance = 0.005, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Removes a specified amount of stake from a single hotkey account. This function is critical for adjusting
      individual neuron stakes within the Bittensor network.

      :param wallet: The wallet associated with the neuron from which the stake is being removed.
      :param netuid: The unique identifier of the subnet.
      :param hotkey_ss58: The `SS58` address of the hotkey account to unstake from.
      :param amount: The amount of alpha to unstake. If not specified, unstakes all. Alpha amount.
      :param allow_partial_stake: If `True` and safe_staking is enabled, allows partial unstaking when
                                  the full amount would exceed the price tolerance. If false, the entire unstake fails if it would
                                  exceed the tolerance.
      :param rate_tolerance: The maximum allowed price change ratio when unstaking. For example,
                             0.005 = 0.5% maximum price decrease. Only used when safe_staking is True.
      :param safe_unstaking: If `True`, enables price safety checks to protect against fluctuating prices. The unstake
                             will only execute if the price change doesn't exceed the rate tolerance.
      :param mev_protection: If T`rue`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      This function supports flexible stake management, allowing neurons to adjust their network participation and
      potential reward accruals.

      .. admonition:: Notes

         - Price Protection: <https://docs.learnbittensor.org/learn/price-protection>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#staking-operations-rate-limits>



   .. py:method:: unstake_all(wallet, netuid, hotkey_ss58, rate_tolerance = 0.005, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Unstakes all TAO/Alpha associated with a hotkey from the specified subnet on the Bittensor network.

      This method unstakes all stake from a hotkey on a specific subnet. When `rate_tolerance` is specified, the method
      uses safe unstaking behavior to protect against unfavorable price movements due to liquidity/price impact. The
      `rate_tolerance` parameter limits the maximum price change ratio during the unstaking operation.

      :param wallet: The wallet of the stake owner (must be unlocked).
      :param netuid: The unique identifier of the subnet.
      :param hotkey_ss58: The SS58 address of the hotkey to unstake from.
      :param rate_tolerance: The maximum allowed price change ratio when unstaking (default 0.005 = 0.5% maximum price
                             decrease). If `None`, unstaking proceeds without price limit protection. Only used for subnets with
                             liquidity pools where price impact may occur.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected.
      :param mev_protection: If` True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Example

         # If you would like to unstake all stakes in all subnets safely, use default rate_tolerance or pass your
         
         # value:
         
         import bittensor as bt
         subtensor = bt.AsyncSubtensor()
         wallet = bt.Wallet("my_wallet")
         netuid = 14
         hotkey = "5%SOME_HOTKEY_WHERE_IS_YOUR_STAKE_NOW%"
         wallet_stakes = await subtensor.get_stake_info_for_coldkey(coldkey_ss58=wallet.coldkey.ss58_address)
         for stake in wallet_stakes:
             result = await subtensor.unstake_all(
                 wallet=wallet,
                 hotkey_ss58=stake.hotkey_ss58,
                 netuid=stake.netuid,
             )
             print(result)
         
         # If you would like to unstake all stakes in all subnets unsafely, use rate_tolerance=None:
         
         import bittensor as bt
         subtensor = bt.AsyncSubtensor()
         wallet = bt.Wallet("my_wallet")
         netuid = 14
         hotkey = "5%SOME_HOTKEY_WHERE_IS_YOUR_STAKE_NOW%"
         wallet_stakes = await subtensor.get_stake_info_for_coldkey(coldkey_ss58=wallet.coldkey.ss58_address)
         for stake in wallet_stakes:
             result = await subtensor.unstake_all(
                 wallet=wallet,
                 hotkey_ss58=stake.hotkey_ss58,
                 netuid=stake.netuid,
                 rate_tolerance=None,
             )
             print(result)

      .. admonition:: Notes

         - Slippage: <https://docs.learnbittensor.org/learn/slippage>
         - Price Protection: <https://docs.learnbittensor.org/learn/price-protection>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#staking-operations-rate-limits>
         - Managing Stake with SDK: <https://docs.learnbittensor.org/staking-and-delegation/managing-stake-sdk>



   .. py:method:: unstake_multiple(wallet, netuids, hotkey_ss58s, amounts = None, unstake_all = False, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Performs batch unstaking from multiple hotkey accounts, allowing a neuron to reduce its staked amounts
      efficiently. This function is useful for managing the distribution of stakes across multiple neurons.

      :param wallet: The wallet linked to the coldkey from which the stakes are being withdrawn.
      :param netuids: Subnets unique IDs.
      :param hotkey_ss58s: A list of hotkey `SS58` addresses to unstake from.
      :param amounts: The amounts of TAO to unstake from each hotkey. If not provided, unstakes all.
      :param unstake_all: If `True`, unstakes all tokens. Amounts are ignored.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: The result object of the extrinsic execution.
      :rtype: ExtrinsicResponse

      .. admonition:: Notes

         - Slippage: <https://docs.learnbittensor.org/learn/slippage>
         - Price Protection: <https://docs.learnbittensor.org/learn/price-protection>
         - Rate Limits: <https://docs.learnbittensor.org/learn/chain-rate-limits#staking-operations-rate-limits>
         - Managing Stake with SDK: <https://docs.learnbittensor.org/staking-and-delegation/managing-stake-sdk>



   .. py:method:: update_cap_crowdloan(wallet, crowdloan_id, new_cap, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Updates the fundraising cap of an active (non-finalized) crowdloan.

      Allows the creator to adjust the maximum total contribution amount before finalization. The new cap
      must be at least equal to the amount already raised. This is useful for adjusting campaign goals based
      on contributor feedback or changing subnet costs.

      :param wallet: Bittensor wallet instance used to sign the transaction (must be the creator's coldkey).
      :param crowdloan_id: The unique identifier of the crowdloan to update.
      :param new_cap: The new fundraising cap (TAO). Must be `>= raised`.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after submission.
      :param raise_error: If `True`, raises an exception rather than returning failure in the response.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` indicating success or failure, with error details if applicable.

      .. admonition:: Notes

         - Only the creator can update the cap.
         - The crowdloan must not be finalized.
         - The new cap must be `>=` the total funds already raised.
         
         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Update Parameters: <https://docs.learnbittensor.org/subnets/crowdloans#crowdloan-lifecycle>



   .. py:method:: update_end_crowdloan(wallet, crowdloan_id, new_end, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Updates the end block of an active (non-finalized) crowdloan.

      Allows the creator to extend (or shorten) the contribution period before finalization. The new end block
      must be in the future and respect the minimum and maximum duration bounds defined in the runtime constants.
      This is useful for extending campaigns that need more time to reach their cap or shortening campaigns with
      sufficient contributions.

      :param wallet: Bittensor wallet instance used to sign the transaction (must be the creator's coldkey).
      :param crowdloan_id: The unique identifier of the crowdloan to update.
      :param new_end: The new block number at which the crowdloan will end. Must be between `MinimumBlockDuration`
                      (7 days = 50,400 blocks) and `MaximumBlockDuration` (60 days = 432,000 blocks) from the current block.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after submission.
      :param raise_error: If `True`, raises an exception rather than returning failure in the response.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` indicating success or failure, with error details if applicable.

      .. admonition:: Notes

         - Only the creator can update the end block.
         - The crowdloan must not be finalized.
         - The new end block must respect duration bounds (`MinimumBlockDuration` to `MaximumBlockDuration`).
         
         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Update Parameters: <https://docs.learnbittensor.org/subnets/crowdloans#crowdloan-lifecycle>



   .. py:method:: update_min_contribution_crowdloan(wallet, crowdloan_id, new_min_contribution, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Updates the minimum contribution amount of an active (non-finalized) crowdloan.

      Allows the creator to adjust the minimum per-contribution amount before finalization. The new value must
      meet or exceed the `AbsoluteMinimumContribution` constant. This is useful for adjusting contribution
      requirements based on the number of expected contributors or campaign strategy.

      :param wallet: Bittensor wallet instance used to sign the transaction (must be the creator's coldkey).
      :param crowdloan_id: The unique identifier of the crowdloan to update.
      :param new_min_contribution: The new minimum contribution amount (TAO). Must be `>= AbsoluteMinimumContribution`.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after submission.
      :param raise_error: If `True`, raises an exception rather than returning failure in the response.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` indicating success or failure, with error details if applicable.

      .. admonition:: Notes

         - Only the creator can update the minimum contribution.
         - The crowdloan must not be finalized.
         - The new minimum must be `>= AbsoluteMinimumContribution` (check via `get_crowdloan_constants`).
         
         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Update Parameters: <https://docs.learnbittensor.org/subnets/crowdloans#crowdloan-lifecycle>



   .. py:method:: validate_extrinsic_params(call_module, call_function, call_params, block = None, block_hash = None, reuse_block = False)
      :async:


      Validate and filter extrinsic parameters against on-chain metadata.

      This method checks that the provided parameters match the expected signature of the given extrinsic (module and
      function) as defined in the Substrate metadata. It raises explicit errors for missing or invalid parameters and
      silently ignores any extra keys not present in the function definition.

      :param call_module: The pallet name, e.g. "SubtensorModule" or "AdminUtils".
      :param call_function: The extrinsic function name, e.g. "set_weights" or "sudo_set_tempo".
      :param call_params: A dictionary of parameters to validate.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of the block id.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: A filtered dictionary containing only the parameters that are valid for the specified extrinsic.

      :raises ValueError: If the given module or function is not found in the chain metadata.
      :raises KeyError: If one or more required parameters are missing.

      .. admonition:: Notes

         This method does not compose or submit the extrinsic. It only ensures that `call_params` conforms to the
         expected schema derived from on-chain metadata.
         See also `compose_call` and `sign_and_send_extrinsic`.



   .. py:method:: wait_for_block(block = None)
      :async:


      Waits until a specific block is reached on the chain. If no block is specified, waits for the next block.

      :param block: The block number to wait for. If `None`, waits for the next block.

      :returns: `True` if the target block was reached, `False` if timeout occurred.

      .. admonition:: Example

         # Waits for a specific block
         await subtensor.wait_for_block(block=1234)



   .. py:method:: weights(netuid, mechid = 0, block = None, block_hash = None, reuse_block = False)
      :async:


      Retrieves the weight distribution set by neurons within a specific subnet of the Bittensor network.
      This function maps each neuron's UID to the weights it assigns to other neurons, reflecting the network's trust
      and value assignment mechanisms.

      :param netuid: Subnet unique identifier.
      :param mechid: Subnet mechanism unique identifier.
      :param block: The blockchain block number for the query.
      :param block_hash: The blockchain block_hash representation of the block id.
      :param reuse_block: Whether to reuse the last-used blockchain block hash.

      :returns: A list of tuples mapping each neuron's UID to its assigned weights.

      The weight distribution is a key factor in the network's consensus algorithm and the ranking of neurons,
      influencing their influence and reward allocation within the subnet.



   .. py:method:: weights_rate_limit(netuid, block = None, block_hash = None, reuse_block = False)
      :async:


      Returns the WeightsSetRateLimit hyperparameter for a subnet.

      This hyperparameter limits how many times a validator can set weights per epoch. It prevents validators
      from spamming weight updates and ensures stable consensus calculations. Once the limit is reached, validators
      must wait until the next epoch to set weights again.

      :param netuid: The unique identifier of the subnetwork.
      :param block: The blockchain block number for the query.
      :param block_hash: The hash of the block at which to query. Do not set if using `block` or `reuse_block`.
      :param reuse_block: Whether to reuse the last-used block hash. Do not set if using `block_hash` or `block`.

      :returns:

                The maximum number of weight set operations allowed per epoch, or `None` if the subnetwork does not
                    exist or the parameter is not found.



   .. py:method:: withdraw_crowdloan(wallet, crowdloan_id, *, mev_protection = DEFAULT_MEV_PROTECTION, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True, wait_for_revealed_execution = True)
      :async:


      Withdraws a contribution from an active (not yet finalized or dissolved) crowdloan.

      Contributors can withdraw their contributions at any time before finalization. For regular contributors,
      the full contribution amount is returned. For the creator, only amounts exceeding the initial deposit can
      be withdrawn; the deposit itself remains locked until dissolution.

      :param wallet: Bittensor wallet instance used to sign the transaction (coldkey must match a contributor).
      :param crowdloan_id: The unique identifier of the crowdloan to withdraw from.
      :param mev_protection: If `True`, encrypts and submits the transaction through the MEV Shield pallet to protect
                             against front-running and MEV attacks. The transaction remains encrypted in the mempool until validators
                             decrypt and execute it. If `False`, submits the transaction directly without encryption.
      :param period: The number of blocks during which the transaction will remain valid after submission, after which
                     it will be rejected.
      :param raise_error: If `True`, raises an exception rather than returning False in the response, in case the
                          transaction fails.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
      :param wait_for_revealed_execution: Whether to wait for the revealed execution of transaction if mev_protection used.

      :returns: `ExtrinsicResponse` indicating success or failure, with error details if applicable.

      .. admonition:: Notes

         - Crowdloans Overview: <https://docs.learnbittensor.org/subnets/crowdloans>
         - Crowdloan Lifecycle: <https://docs.learnbittensor.org/subnets/crowdloans#crowdloan-lifecycle>
         - Withdraw: <https://docs.learnbittensor.org/subnets/crowdloans/crowdloans-tutorial#optional-withdraw>



.. py:function:: get_async_subtensor(network = None, config = None, mock = False, log_verbose = False)
   :async:


   Factory method to create an initialized AsyncSubtensor instance.

   This function creates an AsyncSubtensor instance and automatically initializes the connection to the blockchain.
   This is useful when you don't want to manually call `await subtensor.initialize()` after instantiation.

   :param network: The network name to connect to (e.g., `finney` for Bittensor mainnet, `test` for test network,
                   `local` for a locally deployed blockchain). If `None`, uses the default network from config.
   :param config: Configuration object for the AsyncSubtensor instance. If `None`, uses the default configuration.
   :param mock: Whether this is a mock instance. FOR TESTING ONLY.
   :param log_verbose: Enables or disables verbose logging.

   :returns: An initialized AsyncSubtensor instance ready for use.

   .. admonition:: Example

      # Create and initialize in one step
      subtensor = await get_async_subtensor(network="finney")
      
      # Ready to use immediately
      block = await subtensor.get_current_block()


