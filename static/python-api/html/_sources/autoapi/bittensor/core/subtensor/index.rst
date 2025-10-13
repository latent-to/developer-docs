bittensor.core.subtensor
========================

.. py:module:: bittensor.core.subtensor


Classes
-------

.. autoapisummary::

   bittensor.core.subtensor.Subtensor


Module Contents
---------------

.. py:class:: Subtensor(network = None, config = None, log_verbose = False, fallback_endpoints = None, retry_forever = False, _mock = False, archive_endpoints = None)

   Bases: :py:obj:`bittensor.core.types.SubtensorMixin`


   Thin layer for interacting with Substrate Interface. Mostly a collection of frequently used calls.

   Initializes an instance of the Subtensor class.

   :param network: The network name or type to connect to.
   :param config: Configuration object for the AsyncSubtensor instance.
   :param log_verbose: Enables or disables verbose logging.
   :param fallback_endpoints: List of fallback endpoints to use if default or provided network is not available.
                              Defaults to `None`.
   :param retry_forever: Whether to retry forever on connection errors. Defaults to `False`.
   :param _mock: Whether this is a mock instance. Mainly just for use in testing.
   :param archive_endpoints: Similar to fallback_endpoints, but specifically only archive nodes. Will be used in cases
                             where you are requesting a block that is too old for your current (presumably lite) node. Defaults to
                             `None`

   :raises Any exceptions raised during the setup, configuration, or connection process.:


   .. py:method:: add_liquidity(wallet, netuid, liquidity, price_low, price_high, hotkey = None, wait_for_inclusion = True, wait_for_finalization = False, period = None)

      Adds liquidity to the specified price range.

      :param wallet: The wallet used to sign the extrinsic (must be unlocked).
      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param liquidity: The amount of liquidity to be added.
      :param price_low: The lower bound of the price tick range. In TAO.
      :param price_high: The upper bound of the price tick range. In TAO.
      :param hotkey: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used. Defaults to
                     `None`.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block. Defaults to True.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic. Defaults to False.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.

      :returns:     - True and a success message if the extrinsic is successfully submitted or processed.
                    - False and an error message if the submission fails or the wallet cannot be unlocked.
      :rtype: Tuple[bool, str]

      Note: Adding is allowed even when user liquidity is enabled in specified subnet. Call `toggle_user_liquidity`
          method to enable/disable user liquidity.



   .. py:method:: add_stake(wallet, hotkey_ss58 = None, netuid = None, amount = None, wait_for_inclusion = True, wait_for_finalization = False, safe_staking = False, allow_partial_stake = False, rate_tolerance = 0.005, period = None)

      Adds a stake from the specified wallet to the neuron identified by the SS58 address of its hotkey in specified
          subnet. Staking is a fundamental process in the Bittensor network that enables neurons to participate
          actively and earn incentives.

      :param wallet: The wallet to be used for staking.
      :param hotkey_ss58: The SS58 address of the hotkey associated with the neuron to which you intend to delegate your
                          stake. If not specified, the wallet's hotkey will be used. Defaults to ``None``.
      :param netuid: The unique identifier of the subnet to which the neuron belongs.
      :param amount: The amount of TAO to stake.
      :param wait_for_inclusion: Waits for the transaction to be included in a block. Defaults to ``True``.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain. Defaults to ``False``.
      :param safe_staking: If true, enables price safety checks to protect against fluctuating prices. The stake will
                           only execute if the price change doesn't exceed the rate tolerance. Default is ``False``.
      :param allow_partial_stake: If true and safe_staking is enabled, allows partial staking when the full amount would
                                  exceed the price tolerance. If false, the entire stake fails if it would exceed the tolerance.
                                  Default is ``False``.
      :param rate_tolerance: The maximum allowed price change ratio when staking. For example,
                             0.005 = 0.5% maximum price increase. Only used when safe_staking is True. Default is ``0.005``.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction. Defaults to ``None``.

      :returns: True if the staking is successful, False otherwise.
      :rtype: bool

      This function enables neurons to increase their stake in the network, enhancing their influence and potential
          rewards in line with Bittensor's consensus and reward mechanisms.
          When safe_staking is enabled, it provides protection against price fluctuations during the time stake is
          executed and the time it is actually processed by the chain.



   .. py:method:: add_stake_multiple(wallet, hotkey_ss58s, netuids, amounts = None, wait_for_inclusion = True, wait_for_finalization = False, period = None)

      Adds stakes to multiple neurons identified by their hotkey SS58 addresses.
      This bulk operation allows for efficient staking across different neurons from a single wallet.

      :param wallet: The wallet used for staking.
      :type wallet: bittensor_wallet.Wallet
      :param hotkey_ss58s: List of ``SS58`` addresses of hotkeys to stake to.
      :type hotkey_ss58s: list[str]
      :param netuids: List of network UIDs to stake to.
      :type netuids: list[int]
      :param amounts: Corresponding amounts of TAO to stake for each hotkey.
      :type amounts: list[Balance]
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :type wait_for_finalization: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: ``True`` if the staking is successful for all specified neurons, False otherwise.
      :rtype: bool

      This function is essential for managing stakes across multiple neurons, reflecting the dynamic and collaborative
          nature of the Bittensor network.



   .. py:method:: all_subnets(block = None)

      Retrieves the subnet information for all subnets in the network.

      :param block: The block number to query the subnet information from.
      :type block: Optional[int]

      :returns: A list of DynamicInfo objects, each containing detailed information about a subnet.
      :rtype: Optional[DynamicInfo]



   .. py:property:: block
      :type: int



   .. py:method:: blocks_since_last_step(netuid, block = None)

      Returns number of blocks since the last epoch of the subnet.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param block: the block number for this query.

      :returns: block number of the last step in the subnet.



   .. py:method:: blocks_since_last_update(netuid, uid)

      Returns the number of blocks since the last update for a specific UID in the subnetwork.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param uid: The unique identifier of the neuron.
      :type uid: int

      :returns:

                The number of blocks since the last update, or ``None`` if the subnetwork or UID does not
                    exist.
      :rtype: Optional[int]



   .. py:method:: bonds(netuid, block = None, mechid = 0)

      Retrieves the bond distribution set by neurons within a specific subnet of the Bittensor network.
          Bonds represent the investments or commitments made by neurons in one another, indicating a level of trust
          and perceived value. This bonding mechanism is integral to the network's market-based approach to
          measuring and rewarding machine intelligence.

      :param netuid: Subnet identifier.
      :param block: the block number for this query.
      :param mechid: Subnet mechanism identifier.

      :returns: List of tuples mapping each neuron's UID to its bonds with other neurons.

      Understanding bond distributions is crucial for analyzing the trust dynamics and market behavior within the
          subnet. It reflects how neurons recognize and invest in each other's intelligence and contributions,
          supporting diverse and niche systems within the Bittensor ecosystem.



   .. py:method:: burned_register(wallet, netuid, wait_for_inclusion = False, wait_for_finalization = True, period = None)

      Registers a neuron on the Bittensor network by recycling TAO. This method of registration involves recycling
          TAO tokens, allowing them to be re-mined by performing work on the network.

      :param wallet: The wallet associated with the neuron to be registered.
      :type wallet: bittensor_wallet.Wallet
      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param wait_for_inclusion: Waits for the transaction to be included in a block. Defaults to
                                 `False`.
      :type wait_for_inclusion: bool, optional
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
                                    Defaults to `True`.
      :type wait_for_finalization: bool, optional
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: ``True`` if the registration is successful, False otherwise.
      :rtype: bool



   .. py:method:: close()

      Closes the websocket connection.



   .. py:method:: commit(wallet, netuid, data, period = None)

      Commits arbitrary data to the Bittensor network by publishing metadata.

      :param wallet: The wallet associated with the neuron committing the data.
      :type wallet: bittensor_wallet.Wallet
      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param data: The data to be committed to the network.
      :type data: str
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: `True` if the commitment was successful, `False` otherwise.
      :rtype: bool



   .. py:method:: commit_reveal_enabled(netuid, block = None)

      Check if the commit-reveal mechanism is enabled for a given network at a specific block.

      :param netuid: The network identifier for which to check the commit-reveal mechanism.
      :param block: The block number to query.

      :returns: Returns the integer value of the hyperparameter if available; otherwise, returns None.



   .. py:method:: commit_weights(wallet, netuid, salt, uids, weights, version_key = version_as_int, wait_for_inclusion = False, wait_for_finalization = False, max_retries = 5, period = 16, mechid = 0)

      Commits a hash of the neuron's weights to the Bittensor blockchain using the provided wallet.
      This action serves as a commitment or snapshot of the neuron's current weight distribution.

      :param wallet: The wallet associated with the neuron committing the weights.
      :param netuid: The unique identifier of the subnet.
      :param salt: list of randomly generated integers as salt to generated weighted hash.
      :param uids: Array/list of neuron UIDs for which weights are being committed.
      :param weights: Array/list of weight values corresponding to each UID.
      :param version_key: Version key for compatibility with the network.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param max_retries: The number of maximum attempts to commit weights.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param mechid: The subnet mechanism unique identifier.

      :returns:     `True` if the weight commitment is successful, False otherwise.
                    `msg` is a string value describing the success or potential error.
      :rtype: tuple[bool, str]

      This function allows neurons to create a tamper-proof record of their weight distribution at a specific point
          in time, enhancing transparency and accountability within the Bittensor network.



   .. py:method:: determine_block_hash(block)


   .. py:method:: difficulty(netuid, block = None)

      Retrieves the 'Difficulty' hyperparameter for a specified subnet in the Bittensor network.

      This parameter is instrumental in determining the computational challenge required for neurons to participate in
          consensus and validation processes.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.

      :returns: The value of the 'Difficulty' hyperparameter if the subnet exists, ``None`` otherwise.
      :rtype: Optional[int]

      The 'Difficulty' parameter directly impacts the network's security and integrity by setting the computational
          effort required for validating transactions and participating in the network's consensus mechanism.



   .. py:method:: does_hotkey_exist(hotkey_ss58, block = None)

      Returns true if the hotkey is known by the chain and there are accounts.

      :param hotkey_ss58: The SS58 address of the hotkey.
      :param block: the block number for this query.

      :returns: `True` if the hotkey is known by the chain and there are accounts, `False` otherwise.



   .. py:method:: encode_params(call_definition, params)

      Returns a hex encoded string of the params using their types.



   .. py:method:: filter_netuids_by_registered_hotkeys(all_netuids, filter_for_netuids, all_hotkeys, block)

      Filters a given list of all netuids for certain specified netuids and hotkeys

      :param all_netuids: A list of netuids to filter.
      :type all_netuids: Iterable[int]
      :param filter_for_netuids: A subset of all_netuids to filter from the main list.
      :type filter_for_netuids: Iterable[int]
      :param all_hotkeys: Hotkeys to filter from the main list.
      :type all_hotkeys: Iterable[Wallet]
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The filtered list of netuids.



   .. py:method:: get_admin_freeze_window(block = None)

      Returns the number of blocks when dependent transactions will be frozen for execution.

      :param block: The block number for which the children are to be retrieved.

      :returns: AdminFreezeWindow as integer. The number of blocks are frozen.



   .. py:method:: get_all_commitments(netuid, block = None)


   .. py:method:: get_all_metagraphs_info(block = None, all_mechanisms = False)

      Retrieves a list of MetagraphInfo objects for all subnets

      :param block: The blockchain block number for the query.
      :param all_mechanisms: If True then returns all mechanisms, otherwise only those with index 0 for all subnets.

      :returns: List of MetagraphInfo objects for all existing subnets.

      .. admonition:: Notes

         See also: See <https://docs.learnbittensor.org/glossary#metagraph>



   .. py:method:: get_all_neuron_certificates(netuid, block = None)

      Retrieves the TLS certificates for neurons within a specified subnet (netuid) of the Bittensor network.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.

      :returns: Certificate} for the key/Certificate pairs on the subnet
      :rtype: {ss58

      This function is used for certificate discovery for setting up mutual tls communication between neurons.



   .. py:method:: get_all_revealed_commitments(netuid, block = None)

      Returns all revealed commitments for a given netuid.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param block: The block number to retrieve the commitment from. Default is ``None``.
      :type block: Optional[int]

      :returns:

                A dictionary of all revealed commitments in view
                    {ss58_address: (reveal block, commitment message)}.
      :rtype: result (dict)

      Example of result:
      {
          "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY": ( (12, "Alice message 1"), (152, "Alice message 2") ),
          "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty": ( (12, "Bob message 1"), (147, "Bob message 2") ),
      }



   .. py:method:: get_all_subnets_info(block = None)

      Retrieves detailed information about all subnets within the Bittensor network. This function provides
          comprehensive data on each subnet, including its characteristics and operational parameters.

      :param block: The blockchain block number for the query.

      :returns: A list of SubnetInfo objects, each containing detailed information about a subnet.
      :rtype: list[SubnetInfo]

      Gaining insights into the subnets' details assists in understanding the network's composition, the roles of
          different subnets, and their unique features.



   .. py:method:: get_balance(address, block = None)

      Retrieves the balance for given coldkey. Always in TAO.

      :param address: coldkey address.
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: Balance object in TAO.



   .. py:method:: get_balances(*addresses, block = None)

      Retrieves the balance for given coldkey(s)

      :param addresses: coldkey addresses(s).
      :type addresses: str
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: Balance objects}.
      :rtype: Dict of {address



   .. py:method:: get_block_hash(block = None)

      Retrieves the hash of a specific block on the Bittensor blockchain. The block hash is a unique identifier
          representing the cryptographic hash of the block's content, ensuring its integrity and immutability.

      :param block: The block number for which the hash is to be retrieved.
      :type block: int

      :returns: The cryptographic hash of the specified block.
      :rtype: str

      The block hash is a fundamental aspect of blockchain technology, providing a secure reference to each block's
          data. It is crucial for verifying transactions, ensuring data consistency, and maintaining the
          trustworthiness of the blockchain.



   .. py:method:: get_children(hotkey, netuid, block = None)

      This method retrieves the children of a given hotkey and netuid. It queries the SubtensorModule's ChildKeys
          storage function to get the children and formats them before returning as a tuple.

      :param hotkey: The hotkey value.
      :type hotkey: str
      :param netuid: The netuid value.
      :type netuid: int
      :param block: The block number for which the children are to be retrieved.
      :type block: Optional[int]

      :returns:

                A tuple containing a boolean indicating success or failure, a list of formatted children, and an error
                    message (if applicable)



   .. py:method:: get_children_pending(hotkey, netuid, block = None)

      This method retrieves the pending children of a given hotkey and netuid.
      It queries the SubtensorModule's PendingChildKeys storage function.

      :param hotkey: The hotkey value.
      :type hotkey: str
      :param netuid: The netuid value.
      :type netuid: int
      :param block: The block number for which the children are to be retrieved.
      :type block: Optional[int]

      :returns: A list of children with their proportions.
                int: The cool-down block number.
      :rtype: list[tuple[float, str]]



   .. py:method:: get_commitment(netuid, uid, block = None)

      Retrieves the on-chain commitment for a specific neuron in the Bittensor network.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param uid: The unique identifier of the neuron.
      :type uid: int
      :param block: The block number to retrieve the commitment from. If None, the latest block is used.
                    Default is ``None``.
      :type block: Optional[int]

      :returns: The commitment data as a string.
      :rtype: str



   .. py:method:: get_current_block()

      Returns the current block number on the Bittensor blockchain. This function provides the latest block number,
          indicating the most recent state of the blockchain.

      :returns: The current chain block number.
      :rtype: int

      Knowing the current block number is essential for querying real-time data and performing time-sensitive
          operations on the blockchain. It serves as a reference point for network activities and data
          synchronization.



   .. py:method:: get_current_weight_commit_info(netuid, block = None)

      Retrieves CRV3 weight commit information for a specific subnet.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query. Default is ``None``.
      :type block: Optional[int]

      :returns:     - ss58_address: The address of the committer.
                    - commit_message: The commit message.
                    - reveal_round: The round when the commitment was revealed.

                The list may be empty if there are no commits found.
      :rtype: A list of commit details, where each item contains



   .. py:method:: get_current_weight_commit_info_v2(netuid, block = None)

      Retrieves CRV3 weight commit information for a specific subnet.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query. Default is ``None``.
      :type block: Optional[int]

      :returns:     - ss58_address: The address of the committer.
                    - commit_block: The block number when the commitment was made.
                    - commit_message: The commit message.
                    - reveal_round: The round when the commitment was revealed.

                The list may be empty if there are no commits found.
      :rtype: A list of commit details, where each item contains



   .. py:method:: get_delegate_by_hotkey(hotkey_ss58, block = None)

      Retrieves detailed information about a delegate neuron based on its hotkey. This function provides a
          comprehensive view of the delegate's status, including its stakes, nominators, and reward distribution.

      :param hotkey_ss58: The ``SS58`` address of the delegate's hotkey.
      :type hotkey_ss58: str
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: Detailed information about the delegate neuron, ``None`` if not found.
      :rtype: Optional[DelegateInfo]

      This function is essential for understanding the roles and influence of delegate neurons within the Bittensor
          network's consensus and governance structures.



   .. py:method:: get_delegate_identities(block = None)

      Fetches delegates identities from the chain.

      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: ChainIdentity, ...}
      :rtype: Dict {ss58



   .. py:method:: get_delegate_take(hotkey_ss58, block = None)

      Retrieves the delegate 'take' percentage for a neuron identified by its hotkey. The 'take' represents the
          percentage of rewards that the delegate claims from its nominators' stakes.

      :param hotkey_ss58: The ``SS58`` address of the neuron's hotkey.
      :type hotkey_ss58: str
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The delegate take percentage.
      :rtype: float

      The delegate take is a critical parameter in the network's incentive structure, influencing the distribution of
          rewards among neurons and their nominators.



   .. py:method:: get_delegated(coldkey_ss58, block = None)

      Retrieves a list of delegates and their associated stakes for a given coldkey. This function identifies the
      delegates that a specific account has staked tokens on.

      :param coldkey_ss58: The `SS58` address of the account's coldkey.
      :type coldkey_ss58: str
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: A list containing the delegated information for the specified coldkey.

      This function is important for account holders to understand their stake allocations and their involvement in
          the network's delegation and consensus mechanisms.



   .. py:method:: get_delegates(block = None)

      Fetches all delegates on the chain

      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: List of DelegateInfo objects, or an empty list if there are no delegates.



   .. py:method:: get_existential_deposit(block = None)

      Retrieves the existential deposit amount for the Bittensor blockchain. Always in TAO.
      The existential deposit is the minimum amount of TAO required for an account to exist on the blockchain.
      Accounts with balances below this threshold can be reaped to conserve network resources.

      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The existential deposit amount. Always in TAO.

      The existential deposit is a fundamental economic parameter in the Bittensor network, ensuring efficient use of
          storage and preventing the proliferation of dust accounts.



   .. py:method:: get_hotkey_owner(hotkey_ss58, block = None)

      Retrieves the owner of the given hotkey at a specific block hash.
      This function queries the blockchain for the owner of the provided hotkey. If the hotkey does not exist at the
          specified block hash, it returns None.

      :param hotkey_ss58: The SS58 address of the hotkey.
      :type hotkey_ss58: str
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The SS58 address of the owner if the hotkey exists, or None if it doesn't.
      :rtype: Optional[str]



   .. py:attribute:: get_hotkey_stake


   .. py:method:: get_hyperparameter(param_name, netuid, block = None)

      Retrieves a specified hyperparameter for a specific subnet.

      :param param_name: The name of the hyperparameter to retrieve.
      :type param_name: str
      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: the block number at which to retrieve the hyperparameter.

      :returns: The value of the specified hyperparameter if the subnet exists, or None



   .. py:method:: get_last_commitment_bonds_reset_block(netuid, uid)

      Retrieves the last block number when the bonds reset were triggered by publish_metadata for a specific neuron.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param uid: The unique identifier of the neuron.
      :type uid: int

      :returns: The block number when the bonds were last reset, or None if not found.
      :rtype: Optional[int]



   .. py:method:: get_liquidity_list(wallet, netuid, block = None)

      Retrieves all liquidity positions for the given wallet on a specified subnet (netuid).
      Calculates associated fee rewards based on current global and tick-level fee data.

      :param wallet: Wallet instance to fetch positions for.
      :param netuid: Subnet unique id.
      :param block: The blockchain block number for the query.

      :returns: List of liquidity positions, or None if subnet does not exist.



   .. py:method:: get_mechanism_count(netuid, block = None)

      Retrieves the number of mechanisms for the given subnet.

      :param netuid: Subnet identifier.
      :param block: The blockchain block number for the query.

      :returns: The number of mechanisms for the given subnet.



   .. py:method:: get_mechanism_emission_split(netuid, block = None)

      Returns the emission percentages allocated to each subnet mechanism.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.

      :returns: A list of integers representing the percentage of emission allocated to each subnet mechanism (rounded to
                whole numbers). Returns None if emission is evenly split or if the data is unavailable.



   .. py:method:: get_metagraph_info(netuid, field_indices = None, block = None, mechid = 0)

      Retrieves full or partial metagraph information for the specified subnet mechanism (netuid, mechid).

      :param netuid: Subnet unique identifier.
      :param field_indices: Optional list of SelectiveMetagraphIndex or int values specifying which fields to retrieve.
                            If not provided, all available fields will be returned.
      :param block: The block number at which to query the data.
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
             field_indices=[SelectiveMetagraphIndex.Name, SelectiveMetagraphIndex.OwnerHotkeys]
         )
         
         # Retrieve selective data from the metagraph from subnet 2 mechanism 1
         partial_meta_info = subtensor.get_metagraph_info(
             netuid=2,
             mechid=1,
             field_indices=[SelectiveMetagraphIndex.Name, SelectiveMetagraphIndex.OwnerHotkeys]
         )

      .. admonition:: Notes

         See also:
         - <https://docs.learnbittensor.org/glossary#metagraph>
         - <https://docs.learnbittensor.org/glossary#emission>



   .. py:method:: get_minimum_required_stake()

      Returns the minimum required stake for nominators in the Subtensor network.

      :returns: The minimum required stake as a Balance object in TAO.



   .. py:method:: get_netuids_for_hotkey(hotkey_ss58, block = None)

      Retrieves a list of subnet UIDs (netuids) for which a given hotkey is a member. This function identifies the
          specific subnets within the Bittensor network where the neuron associated with the hotkey is active.

      :param hotkey_ss58: The ``SS58`` address of the neuron's hotkey.
      :type hotkey_ss58: str
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: A list of netuids where the neuron is a member.



   .. py:method:: get_neuron_certificate(hotkey, netuid, block = None)

      Retrieves the TLS certificate for a specific neuron identified by its unique identifier (UID) within a
          specified subnet (netuid) of the Bittensor network.

      :param hotkey: The hotkey to query.
      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.

      :returns: the certificate of the neuron if found, `None` otherwise.

      This function is used for certificate discovery for setting up mutual tls communication between neurons.



   .. py:method:: get_neuron_for_pubkey_and_subnet(hotkey_ss58, netuid, block = None)

      Retrieves information about a neuron based on its public key (hotkey SS58 address) and the specific subnet UID
          (netuid). This function provides detailed neuron information for a particular subnet within the Bittensor
          network.

      :param hotkey_ss58: The ``SS58`` address of the neuron's hotkey.
      :type hotkey_ss58: str
      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns:

                Detailed information about the neuron if found,
                    ``None`` otherwise.
      :rtype: Optional[bittensor.core.chain_data.neuron_info.NeuronInfo]

      This function is crucial for accessing specific neuron data and understanding its status, stake, and other
          attributes within a particular subnet of the Bittensor ecosystem.



   .. py:method:: get_next_epoch_start_block(netuid, block = None)

      Calculates the first block number of the next epoch for the given subnet.

      If `block` is not provided, the current chain block will be used. Epochs are
      determined based on the subnet's tempo (i.e., blocks per epoch). The result
      is the block number at which the next epoch will begin.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The reference block to calculate from.
                    If None, uses the current chain block height.
      :type block: Optional[int], optional

      :returns: The block number at which the next epoch will start.
      :rtype: int



   .. py:method:: get_owned_hotkeys(coldkey_ss58, block = None, reuse_block = False)

      Retrieves all hotkeys owned by a specific coldkey address.

      :param coldkey_ss58: The SS58 address of the coldkey to query.
      :type coldkey_ss58: str
      :param block: The blockchain block number for the query.
      :type block: int
      :param reuse_block: Whether to reuse the last-used blockchain block hash.
      :type reuse_block: bool

      :returns: A list of hotkey SS58 addresses owned by the coldkey.
      :rtype: list[str]



   .. py:method:: get_parents(hotkey, netuid, block = None)

      This method retrieves the parent of a given hotkey and netuid. It queries the SubtensorModule's ParentKeys
          storage function to get the children and formats them before returning as a tuple.

      :param hotkey: The child hotkey SS58.
      :param netuid: The netuid.
      :param block: The block number for which the children are to be retrieved.

      :returns: A list of formatted parents [(proportion, parent)]



   .. py:method:: get_revealed_commitment(netuid, uid, block = None)

      Returns uid related revealed commitment for a given netuid.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param uid: The neuron uid to retrieve the commitment from.
      :type uid: int
      :param block: The block number to retrieve the commitment from. Default is ``None``.
      :type block: Optional[int]

      :returns: A tuple of reveal block and commitment message.
      :rtype: result (Optional[tuple[int, str]]

      Example of result:
          ( (12, "Alice message 1"), (152, "Alice message 2") )
          ( (12, "Bob message 1"), (147, "Bob message 2") )



   .. py:method:: get_revealed_commitment_by_hotkey(netuid, hotkey_ss58_address, block = None)

      Returns hotkey related revealed commitment for a given netuid.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param hotkey_ss58_address: The ss58 address of the committee member.
      :type hotkey_ss58_address: str
      :param block: The block number to retrieve the commitment from. Default is ``None``.
      :type block: Optional[int]

      :returns: A tuple of reveal block and commitment message.
      :rtype: result (tuple[int, str)



   .. py:method:: get_stake(coldkey_ss58, hotkey_ss58, netuid, block = None)

      Returns the amount of Alpha staked by a specific coldkey to a specific hotkey within a given subnet.
      This function retrieves the delegated stake balance, referred to as the 'Alpha' value.

      :param coldkey_ss58: The SS58 address of the coldkey that delegated the stake. This address owns the stake.
      :param hotkey_ss58: The ss58 address of the hotkey which the stake is on.
      :param netuid: The unique identifier of the subnet to query.
      :param block: The specific block number at which to retrieve the stake information. If None, the current stake at
                    the latest block is returned. Defaults to ``None``.

      :returns:

                An object representing the amount of Alpha (TAO ONLY if the subnet's netuid is 0) currently staked from the
                    specified coldkey to the specified hotkey within the given subnet.



   .. py:method:: get_stake_add_fee(amount, netuid, coldkey_ss58, hotkey_ss58, block = None)

      Calculates the fee for adding new stake to a hotkey.

      :param amount: Amount of stake to add in TAO
      :param netuid: Netuid of subnet
      :param coldkey_ss58: SS58 address of coldkey
      :param hotkey_ss58: SS58 address of hotkey
      :param block: Block number at which to perform the calculation

      :returns: The calculated stake fee as a Balance object



   .. py:method:: get_stake_for_coldkey(coldkey_ss58, block = None)

      Retrieves the stake information for a given coldkey.

      :param coldkey_ss58: The SS58 address of the coldkey.
      :type coldkey_ss58: str
      :param block: The block number at which to query the stake information.
      :type block: Optional[int]

      :returns: A list of StakeInfo objects, or ``None`` if no stake information is found.
      :rtype: Optional[list[StakeInfo]]



   .. py:method:: get_stake_for_coldkey_and_hotkey(coldkey_ss58, hotkey_ss58, netuids = None, block = None)

      Retrieves all coldkey-hotkey pairing stake across specified (or all) subnets

      :param coldkey_ss58: The SS58 address of the coldkey.
      :type coldkey_ss58: str
      :param hotkey_ss58: The SS58 address of the hotkey.
      :type hotkey_ss58: str
      :param netuids: The subnet IDs to query for. Set to `None` for all subnets.
      :type netuids: Optional[list[int]]
      :param block: The block number at which to query the stake information.
      :type block: Optional[int]

      :returns: StakeInfo} pairing of all stakes across all subnets.
      :rtype: A {netuid



   .. py:method:: get_stake_for_hotkey(hotkey_ss58, netuid, block = None)

      Retrieves the stake information for a given hotkey.

      :param hotkey_ss58: The SS58 address of the hotkey.
      :param netuid: The subnet ID to query for.
      :param block: The block number at which to query the stake information. Do not specify if also specifying
                    block_hash or reuse_block



   .. py:attribute:: get_stake_info_for_coldkey


   .. py:method:: get_stake_movement_fee(amount, origin_netuid, origin_hotkey_ss58, origin_coldkey_ss58, destination_netuid, destination_hotkey_ss58, destination_coldkey_ss58, block = None)

      Calculates the fee for moving stake between hotkeys/subnets/coldkeys.

      :param amount: Amount of stake to move in TAO
      :param origin_netuid: Netuid of origin subnet
      :param origin_hotkey_ss58: SS58 address of origin hotkey
      :param origin_coldkey_ss58: SS58 address of origin coldkey
      :param destination_netuid: Netuid of destination subnet
      :param destination_hotkey_ss58: SS58 address of destination hotkey
      :param destination_coldkey_ss58: SS58 address of destination coldkey
      :param block: Block number at which to perform the calculation

      :returns: The calculated stake fee as a Balance object



   .. py:method:: get_stake_operations_fee(amount, netuid, block = None)

      Returns fee for any stake operation in specified subnet.

      :param amount: Amount of stake to add in Alpha/TAO.
      :param netuid: Netuid of subnet.
      :param block: Block number at which to perform the calculation.

      :returns: The calculated stake fee as a Balance object.



   .. py:method:: get_stake_weight(netuid, block = None)

      Retrieves the stake weight for all hotkeys in a given subnet.

      :param netuid: Netuid of subnet.
      :param block: Block number at which to perform the calculation.

      :returns: A list of stake weights for all hotkeys in the specified subnet.



   .. py:method:: get_subnet_burn_cost(block = None)

      Retrieves the burn cost for registering a new subnet within the Bittensor network. This cost represents the
          amount of Tao that needs to be locked or burned to establish a new subnet.

      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The burn cost for subnet registration.
      :rtype: int

      The subnet burn cost is an important economic parameter, reflecting the network's mechanisms for controlling
          the proliferation of subnets and ensuring their commitment to the network's long-term viability.



   .. py:method:: get_subnet_hyperparameters(netuid, block = None)

      Retrieves the hyperparameters for a specific subnet within the Bittensor network. These hyperparameters define
          the operational settings and rules governing the subnet's behavior.

      :param netuid: The network UID of the subnet to query.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The subnet's hyperparameters, or `None` if not available.

      Understanding the hyperparameters is crucial for comprehending how subnets are configured and managed, and how
          they interact with the network's consensus and incentive mechanisms.



   .. py:method:: get_subnet_info(netuid, block = None)

      Retrieves detailed information about subnet within the Bittensor network.
      This function provides comprehensive data on subnet, including its characteristics and operational parameters.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.

      :returns: A SubnetInfo objects, each containing detailed information about a subnet.
      :rtype: SubnetInfo

      Gaining insights into the subnet's details assists in understanding the network's composition, the roles of
          different subnets, and their unique features.



   .. py:method:: get_subnet_owner_hotkey(netuid, block = None)

      Retrieves the hotkey of the subnet owner for a given network UID.

      This function queries the subtensor network to fetch the hotkey of the owner of a subnet specified by its
      netuid. If no data is found or the query fails, the function returns None.

      :param netuid: The network UID of the subnet to fetch the owner's hotkey for.
      :param block: The specific block number to query the data from.

      :returns: The hotkey of the subnet owner if available; None otherwise.



   .. py:method:: get_subnet_price(netuid, block = None)

      Gets the current Alpha price in TAO for all subnets.

      :param netuid: The unique identifier of the subnet.
      :param block: The blockchain block number for the query.

      :returns: The current Alpha price in TAO units for the specified subnet.



   .. py:method:: get_subnet_prices(block = None)

      Gets the current Alpha price in TAO for a specified subnet.

      :param block: The blockchain block number for the query. Default to `None`.

      :returns:     - subnet unique ID
                    - The current Alpha price in TAO units for the specified subnet.
      :rtype: dict



   .. py:method:: get_subnet_reveal_period_epochs(netuid, block = None)

      Retrieve the SubnetRevealPeriodEpochs hyperparameter.



   .. py:method:: get_subnet_validator_permits(netuid, block = None)

      Retrieves the list of validator permits for a given subnet as boolean values.

      :param netuid: The unique identifier of the subnetwork.
      :param block: The blockchain block number for the query.

      :returns: A list of boolean values representing validator permits, or None if not available.



   .. py:method:: get_subnets(block = None)

      Retrieves the list of all subnet unique identifiers (netuids) currently present in the Bittensor network.

      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: A list of subnet netuids.

      This function provides a comprehensive view of the subnets within the Bittensor network,
      offering insights into its diversity and scale.



   .. py:method:: get_timelocked_weight_commits(netuid, block = None, mechid = 0)

      Retrieves CRv4 weight commit information for a specific subnet.

      :param netuid: Subnet identifier.
      :param block: The blockchain block number for the query. Default is ``None``.
      :param mechid: Subnet mechanism identifier.

      :returns:     - ss58_address: The address of the committer.
                    - commit_block: The block number when the commitment was made.
                    - commit_message: The commit message.
                    - reveal_round: The round when the commitment was revealed.

                The list may be empty if there are no commits found.
      :rtype: A list of commit details, where each item contains



   .. py:method:: get_timestamp(block = None)

      Retrieves the datetime timestamp for a given block

      :param block: The blockchain block number for the query.

      :returns: datetime object for the timestamp of the block



   .. py:method:: get_total_subnets(block = None)

      Retrieves the total number of subnets within the Bittensor network as of a specific blockchain block.

      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The total number of subnets in the network.
      :rtype: Optional[str]

      Understanding the total number of subnets is essential for assessing the network's growth and the extent of its
          decentralized infrastructure.



   .. py:method:: get_transfer_fee(wallet, dest, value, keep_alive = True)

      Calculates the transaction fee for transferring tokens from a wallet to a specified destination address. This
          function simulates the transfer to estimate the associated cost, taking into account the current network
          conditions and transaction complexity.

      :param wallet: The wallet from which the transfer is initiated.
      :type wallet: bittensor_wallet.Wallet
      :param dest: The ``SS58`` address of the destination account.
      :type dest: str
      :param value: The amount of tokens to be transferred,
                    specified as a Balance object, or in Tao (float) or Rao (int) units.
      :type value: Union[bittensor.utils.balance.Balance, float, int]
      :param keep_alive: Whether the transfer fee should be calculated based on keeping the wallet alive (existential
                         deposit) or not.

      :returns:

                The estimated transaction fee for the transfer, represented as a Balance
                    object.
      :rtype: bittensor.utils.balance.Balance

      Estimating the transfer fee is essential for planning and executing token transactions, ensuring that the wallet
          has sufficient funds to cover both the transfer amount and the associated costs. This function provides a
          crucial tool for managing financial operations within the Bittensor network.



   .. py:method:: get_uid_for_hotkey_on_subnet(hotkey_ss58, netuid, block = None)

      Retrieves the unique identifier (UID) for a neuron's hotkey on a specific subnet.

      :param hotkey_ss58: The ``SS58`` address of the neuron's hotkey.
      :type hotkey_ss58: str
      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The UID of the neuron if it is registered on the subnet, ``None`` otherwise.
      :rtype: Optional[int]

      The UID is a critical identifier within the network, linking the neuron's hotkey to its operational and
          governance activities on a particular subnet.



   .. py:method:: get_unstake_fee(amount, netuid, coldkey_ss58, hotkey_ss58, block = None)

      Calculates the fee for unstaking from a hotkey.

      :param amount: Amount of stake to unstake in TAO
      :param netuid: Netuid of subnet
      :param coldkey_ss58: SS58 address of coldkey
      :param hotkey_ss58: SS58 address of hotkey
      :param block: Block number at which to perform the calculation

      :returns: The calculated stake fee as a Balance object



   .. py:method:: get_vote_data(proposal_hash, block = None)

      Retrieves the voting data for a specific proposal on the Bittensor blockchain. This data includes information
          about how senate members have voted on the proposal.

      :param proposal_hash: The hash of the proposal for which voting data is requested.
      :type proposal_hash: str
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: An object containing the proposal's voting data, or `None` if not found.

      This function is important for tracking and understanding the decision-making processes within the Bittensor
          network, particularly how proposals are received and acted upon by the governing body.



   .. py:method:: immunity_period(netuid, block = None)

      Retrieves the 'ImmunityPeriod' hyperparameter for a specific subnet. This parameter defines the duration during
          which new neurons are protected from certain network penalties or restrictions.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The value of the 'ImmunityPeriod' hyperparameter if the subnet exists, ``None`` otherwise.
      :rtype: Optional[int]

      The 'ImmunityPeriod' is a critical aspect of the network's governance system, ensuring that new participants
          have a grace period to establish themselves and contribute to the network without facing immediate
          punitive actions.



   .. py:method:: is_fast_blocks()

      Returns True if the node is running with fast blocks. False if not.



   .. py:method:: is_hotkey_delegate(hotkey_ss58, block = None)

      Determines whether a given hotkey (public key) is a delegate on the Bittensor network. This function checks if
          the neuron associated with the hotkey is part of the network's delegation system.

      :param hotkey_ss58: The SS58 address of the neuron's hotkey.
      :type hotkey_ss58: str
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: `True` if the hotkey is a delegate, `False` otherwise.

      Being a delegate is a significant status within the Bittensor network, indicating a neuron's involvement in
          consensus and governance processes.



   .. py:method:: is_hotkey_registered(hotkey_ss58, netuid = None, block = None)

      Determines whether a given hotkey (public key) is registered in the Bittensor network, either globally across
          any subnet or specifically on a specified subnet. This function checks the registration status of a neuron
          identified by its hotkey, which is crucial for validating its participation and activities within the
          network.

      :param hotkey_ss58: The SS58 address of the neuron's hotkey.
      :param netuid: The unique identifier of the subnet to check the registration. If `None`, the
                     registration is checked across all subnets.
      :param block: The blockchain block number at which to perform the query.

      :returns:

                `True` if the hotkey is registered in the specified context (either any subnet or a specific subnet),
                    `False` otherwise.
      :rtype: bool

      This function is important for verifying the active status of neurons in the Bittensor network. It aids in
          understanding whether a neuron is eligible to participate in network processes such as consensus,
          validation, and incentive distribution based on its registration status.



   .. py:method:: is_hotkey_registered_any(hotkey_ss58, block = None)

      Checks if a neuron's hotkey is registered on any subnet within the Bittensor network.

      :param hotkey_ss58: The ``SS58`` address of the neuron's hotkey.
      :type hotkey_ss58: str
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: ``True`` if the hotkey is registered on any subnet, False otherwise.
      :rtype: bool

      This function is essential for determining the network-wide presence and participation of a neuron.



   .. py:method:: is_hotkey_registered_on_subnet(hotkey_ss58, netuid, block = None)

      Checks if the hotkey is registered on a given netuid.



   .. py:method:: is_in_admin_freeze_window(netuid, block = None)

      Returns True if the current block is within the terminal freeze window of the tempo
      for the given subnet. During this window, admin ops are prohibited to avoid interference
      with validator weight submissions.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: True if in freeze window, else False.
      :rtype: bool



   .. py:method:: is_subnet_active(netuid, block = None)

      Verify if subnet with provided netuid is active.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: True if subnet is active, False otherwise.

      This means whether the `start_call` was initiated or not.



   .. py:method:: last_drand_round()

      Retrieves the last drand round emitted in bittensor. This corresponds when committed weights will be revealed.

      :returns: The latest Drand round emitted in bittensor.
      :rtype: int



   .. py:attribute:: log_verbose
      :value: False



   .. py:method:: max_weight_limit(netuid, block = None)

      Returns network MaxWeightsLimit hyperparameter.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns:

                The value of the MaxWeightsLimit hyperparameter, or ``None`` if the subnetwork does not
                    exist or the parameter is not found.
      :rtype: Optional[float]



   .. py:method:: metagraph(netuid, lite = True, block = None, mechid = 0)

      Returns a synced metagraph for a specified subnet within the Bittensor network.
      The metagraph represents the network's structure, including neuron connections and interactions.

      :param netuid: The network UID of the subnet to query.
      :param lite: If true, returns a metagraph using a lightweight sync (no weights, no bonds).
      :param block: Block number for synchronization, or `None` for the latest block.
      :param mechid: Subnet mechanism identifier.

      :returns: The metagraph representing the subnet's structure and neuron relationships.

      The metagraph is an essential tool for understanding the topology and dynamics of the Bittensor network's
      decentralized architecture, particularly in relation to neuron interconnectivity and consensus processes.



   .. py:method:: min_allowed_weights(netuid, block = None)

      Returns network MinAllowedWeights hyperparameter.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns:

                The value of the MinAllowedWeights hyperparameter, or ``None`` if the subnetwork does not
                    exist or the parameter is not found.
      :rtype: Optional[int]



   .. py:method:: modify_liquidity(wallet, netuid, position_id, liquidity_delta, hotkey = None, wait_for_inclusion = True, wait_for_finalization = False, period = None)

      Modifies liquidity in liquidity position by adding or removing liquidity from it.

      :param wallet: The wallet used to sign the extrinsic (must be unlocked).
      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param position_id: The id of the position record in the pool.
      :param liquidity_delta: The amount of liquidity to be added or removed (add if positive or remove if negative).
      :param hotkey: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used. Defaults to
                     `None`.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block. Defaults to True.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic. Defaults to False.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.

      :returns:     - True and a success message if the extrinsic is successfully submitted or processed.
                    - False and an error message if the submission fails or the wallet cannot be unlocked.
      :rtype: Tuple[bool, str]

      .. admonition:: Example

         import bittensor as bt
         
         subtensor = bt.subtensor(network="local")
         my_wallet = bt.Wallet()
         
         # if `liquidity_delta` is negative
         my_liquidity_delta = Balance.from_tao(100) * -1
         
         subtensor.modify_liquidity(
             wallet=my_wallet,
             netuid=123,
             position_id=2,
             liquidity_delta=my_liquidity_delta
         )
         
         # if `liquidity_delta` is positive
         my_liquidity_delta = Balance.from_tao(120)
         
         subtensor.modify_liquidity(
             wallet=my_wallet,
             netuid=123,
             position_id=2,
             liquidity_delta=my_liquidity_delta
         )

      Note: Modifying is allowed even when user liquidity is enabled in specified subnet. Call `toggle_user_liquidity`
          to enable/disable user liquidity.



   .. py:method:: move_stake(wallet, origin_hotkey, origin_netuid, destination_hotkey, destination_netuid, amount = None, wait_for_inclusion = True, wait_for_finalization = False, period = None, move_all_stake = False)

      Moves stake to a different hotkey and/or subnet.

      :param wallet: The wallet to move stake from.
      :type wallet: bittensor.wallet
      :param origin_hotkey: The SS58 address of the source hotkey.
      :type origin_hotkey: str
      :param origin_netuid: The netuid of the source subnet.
      :type origin_netuid: int
      :param destination_hotkey: The SS58 address of the destination hotkey.
      :type destination_hotkey: str
      :param destination_netuid: The netuid of the destination subnet.
      :type destination_netuid: int
      :param amount: Amount of stake to move.
      :type amount: Balance
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :type wait_for_finalization: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]
      :param move_all_stake: If true, moves all stake from the source hotkey to the destination hotkey.

      :returns: True if the stake movement was successful.
      :rtype: success (bool)



   .. py:method:: neuron_for_uid(uid, netuid, block = None)

      Retrieves detailed information about a specific neuron identified by its unique identifier (UID) within a
          specified subnet (netuid) of the Bittensor network. This function provides a comprehensive view of a
          neuron's attributes, including its stake, rank, and operational status.

      :param uid: The unique identifier of the neuron.
      :type uid: int
      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: Detailed information about the neuron if found, a null neuron otherwise

      This function is crucial for analyzing individual neurons' contributions and status within a specific subnet,
          offering insights into their roles in the network's consensus and validation mechanisms.



   .. py:method:: neurons(netuid, block = None)

      Retrieves a list of all neurons within a specified subnet of the Bittensor network.
      This function provides a snapshot of the subnet's neuron population, including each neuron's attributes and
          network interactions.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: A list of NeuronInfo objects detailing each neuron's characteristics in the subnet.

      Understanding the distribution and status of neurons within a subnet is key to comprehending the network's
          decentralized structure and the dynamics of its consensus and governance processes.



   .. py:method:: neurons_lite(netuid, block = None)

      Retrieves a list of neurons in a 'lite' format from a specific subnet of the Bittensor network.
      This function provides a streamlined view of the neurons, focusing on key attributes such as stake and network
          participation.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: A list of simplified neuron information for the subnet.

      This function offers a quick overview of the neuron population within a subnet, facilitating efficient analysis
          of the network's decentralized structure and neuron dynamics.



   .. py:method:: query_constant(module_name, constant_name, block = None)

      Retrieves a constant from the specified module on the Bittensor blockchain. This function is used to access
          fixed parameters or values defined within the blockchain's modules, which are essential for understanding
          the network's configuration and rules.

      :param module_name: The name of the module containing the constant.
      :param constant_name: The name of the constant to retrieve.
      :param block: The blockchain block number at which to query the constant.

      :returns: The value of the constant if found, `None` otherwise.
      :rtype: Optional[async_substrate_interface.types.ScaleObj]

      Constants queried through this function can include critical network parameters such as inflation rates,
          consensus rules, or validation thresholds, providing a deeper understanding of the Bittensor network's
          operational parameters.



   .. py:method:: query_identity(coldkey_ss58, block = None)

      Queries the identity of a neuron on the Bittensor blockchain using the given key. This function retrieves
          detailed identity information about a specific neuron, which is a crucial aspect of the network's
          decentralized identity and governance system.

      :param coldkey_ss58: The coldkey used to query the neuron's identity (technically the neuron's coldkey SS58
                           address).
      :type coldkey_ss58: str
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: An object containing the identity information of the neuron if found, ``None`` otherwise.

      The identity information can include various attributes such as the neuron's stake, rank, and other
          network-specific details, providing insights into the neuron's role and status within the Bittensor network.

      .. note::

         See the `Bittensor CLI documentation <https://docs.bittensor.com/reference/btcli>`_ for supported identity
             parameters.



   .. py:method:: query_map(module, name, block = None, params = None)

      Queries map storage from any module on the Bittensor blockchain. This function retrieves data structures that
          represent key-value mappings, essential for accessing complex and structured data within the blockchain
          modules.

      :param module: The name of the module from which to query the map storage.
      :param name: The specific storage function within the module to query.
      :param block: The blockchain block number at which to perform the query.
      :param params: Parameters to be passed to the query.

      :returns: A data structure representing the map storage if found, `None` otherwise.
      :rtype: result

      This function is particularly useful for retrieving detailed and structured data from various blockchain
          modules, offering insights into the network's state and the relationships between its different components.



   .. py:method:: query_map_subtensor(name, block = None, params = None)

      Queries map storage from the Subtensor module on the Bittensor blockchain. This function is designed to retrieve
          a map-like data structure, which can include various neuron-specific details or network-wide attributes.

      :param name: The name of the map storage function to query.
      :param block: The blockchain block number at which to perform the query.
      :param params: A list of parameters to pass to the query function.

      :returns: An object containing the map-like data structure, or `None` if not found.

      This function is particularly useful for analyzing and understanding complex network structures and
          relationships within the Bittensor ecosystem, such as interneuronal connections and stake distributions.



   .. py:method:: query_module(module, name, block = None, params = None)

      Queries any module storage on the Bittensor blockchain with the specified parameters and block number. This
          function is a generic query interface that allows for flexible and diverse data retrieval from various
          blockchain modules.

      :param module: The name of the module from which to query data.
      :type module: str
      :param name: The name of the storage function within the module.
      :type name: str
      :param block: The blockchain block number at which to perform the query.
      :type block: Optional[int]
      :param params: A list of parameters to pass to the query function.
      :type params: Optional[list[object]]

      :returns: An object containing the requested data if found, `None` otherwise.

      This versatile query function is key to accessing a wide range of data and insights from different parts of the
          Bittensor blockchain, enhancing the understanding and analysis of the network's state and dynamics.



   .. py:method:: query_runtime_api(runtime_api, method, params = None, block = None)

      Queries the runtime API of the Bittensor blockchain, providing a way to interact with the underlying runtime and
          retrieve data encoded in Scale Bytes format. This function is essential for advanced users who need to
          interact with specific runtime methods and decode complex data types.

      :param runtime_api: The name of the runtime API to query.
      :param method: The specific method within the runtime API to call.
      :param params: The parameters to pass to the method call.
      :param block: the block number for this query.

      :returns: The Scale Bytes encoded result from the runtime API call, or `None` if the call fails.

      This function enables access to the deeper layers of the Bittensor blockchain, allowing for detailed and
          specific interactions with the network's runtime environment.



   .. py:method:: query_subtensor(name, block = None, params = None)

      Queries named storage from the Subtensor module on the Bittensor blockchain. This function is used to retrieve
          specific data or parameters from the blockchain, such as stake, rank, or other neuron-specific attributes.

      :param name: The name of the storage function to query.
      :param block: The blockchain block number at which to perform the query.
      :param params: A list of parameters to pass to the query function.

      :returns: An object containing the requested data.
      :rtype: query_response

      This query function is essential for accessing detailed information about the network and its neurons, providing
          valuable insights into the state and dynamics of the Bittensor ecosystem.



   .. py:method:: recycle(netuid, block = None)

      Retrieves the 'Burn' hyperparameter for a specified subnet. The 'Burn' parameter represents the amount of Tao
          that is effectively recycled within the Bittensor network.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The value of the 'Burn' hyperparameter if the subnet exists, None otherwise.
      :rtype: Optional[Balance]

      Understanding the 'Burn' rate is essential for analyzing the network registration usage, particularly how it is
          correlated with user activity and the overall cost of participation in a given subnet.



   .. py:method:: register(wallet, netuid, wait_for_inclusion = False, wait_for_finalization = True, max_allowed_attempts = 3, output_in_place = True, cuda = False, dev_id = 0, tpb = 256, num_processes = None, update_interval = None, log_verbose = False, period = None)

      Registers a neuron on the Bittensor network using the provided wallet.

      Registration is a critical step for a neuron to become an active participant in the network, enabling it to
          stake, set weights, and receive incentives.

      :param wallet: The wallet associated with the neuron to be registered.
      :type wallet: bittensor_wallet.Wallet
      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param wait_for_inclusion: Waits for the transaction to be included in a block. Defaults to `False`.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain. Defaults to
                                    `True`.
      :type wait_for_finalization: bool
      :param max_allowed_attempts: Maximum number of attempts to register the wallet.
      :type max_allowed_attempts: int
      :param output_in_place: If true, prints the progress of the proof of work to the console in-place. Meaning
                              the progress is printed on the same lines. Defaults to `True`.
      :type output_in_place: bool
      :param cuda: If ``true``, the wallet should be registered using CUDA device(s). Defaults to `False`.
      :type cuda: bool
      :param dev_id: The CUDA device id to use, or a list of device ids. Defaults to `0` (zero).
      :type dev_id: Union[List[int], int]
      :param tpb: The number of threads per block (CUDA). Default to `256`.
      :type tpb: int
      :param num_processes: The number of processes to use to register. Default to `None`.
      :type num_processes: Optional[int]
      :param update_interval: The number of nonces to solve between updates.  Default to `None`.
      :type update_interval: Optional[int]
      :param log_verbose: If ``true``, the registration process will log more information.  Default to `False`.
      :type log_verbose: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: ``True`` if the registration is successful, False otherwise.
      :rtype: bool

      This function facilitates the entry of new neurons into the network, supporting the decentralized
      growth and scalability of the Bittensor ecosystem.



   .. py:method:: register_subnet(wallet, wait_for_inclusion = False, wait_for_finalization = True, period = None)

      Registers a new subnetwork on the Bittensor network.

      :param wallet: The wallet to be used for subnet registration.
      :type wallet: bittensor_wallet.Wallet
      :param wait_for_inclusion: If set, waits for the extrinsic to enter a block before returning `True`, or
                                 returns `False` if the extrinsic fails to enter the block within the timeout. Default is `False`.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: If set, waits for the extrinsic to be finalized on the chain before returning
                                    `True`, or returns `False` if the extrinsic fails to be finalized within the timeout. Default is `True`.
      :type wait_for_finalization: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: True if the subnet registration was successful, False otherwise.
      :rtype: bool



   .. py:method:: remove_liquidity(wallet, netuid, position_id, hotkey = None, wait_for_inclusion = True, wait_for_finalization = False, period = None)

      Remove liquidity and credit balances back to wallet's hotkey stake.

      :param wallet: The wallet used to sign the extrinsic (must be unlocked).
      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param position_id: The id of the position record in the pool.
      :param hotkey: The hotkey with staked TAO in Alpha. If not passed then the wallet hotkey is used. Defaults to
                     `None`.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block. Defaults to True.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic. Defaults to False.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.

      :returns:     - True and a success message if the extrinsic is successfully submitted or processed.
                    - False and an error message if the submission fails or the wallet cannot be unlocked.
      :rtype: Tuple[bool, str]

      .. note::

         - Adding is allowed even when user liquidity is enabled in specified subnet. Call `toggle_user_liquidity`
             extrinsic to enable/disable user liquidity.
         - To get the `position_id` use `get_liquidity_list` method.



   .. py:method:: reveal_weights(wallet, netuid, uids, weights, salt, version_key = version_as_int, wait_for_inclusion = False, wait_for_finalization = False, max_retries = 5, period = 16, mechid = 0)

      Reveals the weights for a specific subnet on the Bittensor blockchain using the provided wallet.
      This action serves as a revelation of the neuron's previously committed weight distribution.

      :param wallet: Bittensor Wallet instance.
      :param netuid: The unique identifier of the subnet.
      :param uids: NumPy array of neuron UIDs for which weights are being revealed.
      :param weights: NumPy array of weight values corresponding to each UID.
      :param salt: NumPy array of salt values corresponding to the hash function.
      :param version_key: Version key for compatibility with the network.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param max_retries: The number of maximum attempts to reveal weights.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param mechid: The subnet mechanism unique identifier.

      :returns:     `True` if the extrinsic executed successfully, `False` otherwise.
                    `message` is a string value describing the success or potential error.
      :rtype: tuple[bool, str]

      This function allows neurons to reveal their previously committed weight distribution, ensuring transparency and
      accountability within the Bittensor network.

      See also: <https://docs.learnbittensor.org/glossary#commit-reveal>,



   .. py:method:: root_register(wallet, wait_for_inclusion = False, wait_for_finalization = True, period = None)

      Register neuron by recycling some TAO.

      :param wallet: Bittensor wallet instance.
      :type wallet: bittensor_wallet.Wallet
      :param wait_for_inclusion: Waits for the transaction to be included in a block. Default is ``False``.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain. Default is
                                    ``False``.
      :type wait_for_finalization: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: `True` if registration was successful, otherwise `False`.



   .. py:method:: root_set_pending_childkey_cooldown(wallet, cooldown, wait_for_inclusion = True, wait_for_finalization = True, period = None)

      Sets the pending childkey cooldown.

      :param wallet: bittensor wallet instance.
      :param cooldown: the number of blocks to setting pending childkey cooldown.
      :param wait_for_inclusion: Waits for the transaction to be included in a block. Default is ``False``.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain. Default is
                                    ``False``.
      :type wait_for_finalization: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns:

                A tuple where the first element is a boolean indicating success or failure of the
                    operation, and the second element is a message providing additional information.
      :rtype: tuple[bool, str]

      Note: This operation can only be successfully performed if your wallet has root privileges.



   .. py:method:: root_set_weights(wallet, netuids, weights, version_key = 0, wait_for_inclusion = False, wait_for_finalization = False, period = None)

      Set weights for the root network.

      :param wallet: bittensor wallet instance.
      :type wallet: bittensor_wallet.Wallet
      :param netuids: The list of subnet uids.
      :type netuids: list[int]
      :param weights: The list of weights to be set.
      :type weights: list[float]
      :param version_key: Version key for compatibility with the network. Default is ``0``.
      :type version_key: int, optional
      :param wait_for_inclusion: Waits for the transaction to be included in a block. Defaults to
                                 ``False``.
      :type wait_for_inclusion: bool, optional
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
                                    Defaults to ``False``.
      :type wait_for_finalization: bool, optional
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: `True` if the setting of weights is successful, `False` otherwise.



   .. py:method:: serve_axon(netuid, axon, wait_for_inclusion = False, wait_for_finalization = True, certificate = None, period = None)

      Registers an ``Axon`` serving endpoint on the Bittensor network for a specific neuron. This function is used to
          set up the Axon, a key component of a neuron that handles incoming queries and data processing tasks.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param axon: The Axon instance to be registered for serving.
      :type axon: bittensor.core.axon.Axon
      :param wait_for_inclusion: Waits for the transaction to be included in a block. Default is ``False``.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain. Default is
                                    ``True``.
      :type wait_for_finalization: bool
      :param certificate: Certificate to use for TLS. If ``None``, no TLS will be used.
                          Defaults to ``None``.
      :type certificate: bittensor.utils.Certificate
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: ``True`` if the Axon serve registration is successful, False otherwise.
      :rtype: bool

      By registering an Axon, the neuron becomes an active part of the network's distributed computing infrastructure,
          contributing to the collective intelligence of Bittensor.



   .. py:method:: set_children(wallet, hotkey, netuid, children, wait_for_inclusion = True, wait_for_finalization = True, raise_error = False, period = None)

      Allows a coldkey to set children-keys.

      :param wallet: bittensor wallet instance.
      :param hotkey: The ``SS58`` address of the neuron's hotkey.
      :param netuid: The netuid value.
      :param children: A list of children with their proportions.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.

      :returns:

                A tuple where the first element is a boolean indicating success or failure of the
                    operation, and the second element is a message providing additional information.
      :rtype: tuple[bool, str]



   .. py:attribute:: set_commitment


   .. py:method:: set_delegate_take(wallet, hotkey_ss58, take, wait_for_inclusion = True, wait_for_finalization = True, raise_error = False, period = None)

      Sets the delegate 'take' percentage for a neuron identified by its hotkey.
      The 'take' represents the percentage of rewards that the delegate claims from its nominators' stakes.

      :param wallet: bittensor wallet instance.
      :type wallet: bittensor_wallet.Wallet
      :param hotkey_ss58: The ``SS58`` address of the neuron's hotkey.
      :type hotkey_ss58: str
      :param take: Percentage reward for the delegate.
      :type take: float
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :type wait_for_finalization: bool
      :param raise_error: Raises a relevant exception rather than returning `False` if unsuccessful.
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns:

                A tuple where the first element is a boolean indicating success or failure of the
                 operation, and the second element is a message providing additional information.
      :rtype: tuple[bool, str]

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



   .. py:method:: set_reveal_commitment(wallet, netuid, data, blocks_until_reveal = 360, block_time = 12, period = None)

      Commits arbitrary data to the Bittensor network by publishing metadata.

      :param wallet: The wallet associated with the neuron committing the data.
      :type wallet: bittensor_wallet.Wallet
      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param data: The data to be committed to the network.
      :type data: str
      :param blocks_until_reveal: The number of blocks from now after which the data will be revealed. Defaults to
                                  `360`. Then number of blocks in one epoch.
      :type blocks_until_reveal: int
      :param block_time: The number of seconds between each block. Defaults to `12`.
      :type block_time: Union[int, float]
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: `True` if the commitment was successful, `False` otherwise.
      :rtype: bool

      Note: A commitment can be set once per subnet epoch and is reset at the next epoch in the chain automatically.



   .. py:method:: set_subnet_identity(wallet, netuid, subnet_identity, wait_for_inclusion = False, wait_for_finalization = True, period = None)

      Sets the identity of a subnet for a specific wallet and network.

      :param wallet: The wallet instance that will authorize the transaction.
      :type wallet: Wallet
      :param netuid: The unique ID of the network on which the operation takes place.
      :type netuid: int
      :param subnet_identity: The identity data of the subnet including attributes like name, GitHub
                              repository, contact, URL, discord, description, and any additional metadata.
      :type subnet_identity: SubnetIdentity
      :param wait_for_inclusion: Indicates if the function should wait for the transaction to be included in the
                                 block.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Indicates if the function should wait for the transaction to reach
                                    finalization.
      :type wait_for_finalization: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns:

                A tuple where the first element is a boolean indicating success or failure of the
                 operation, and the second element is a message providing additional information.
      :rtype: tuple[bool, str]



   .. py:method:: set_weights(wallet, netuid, uids, weights, version_key = version_as_int, wait_for_inclusion = False, wait_for_finalization = False, max_retries = 5, block_time = 12.0, period = 8, mechid = 0, commit_reveal_version = 4)

      Sets the interneuronal weights for the specified neuron. This process involves specifying the influence or
          trust a neuron places on other neurons in the network, which is a fundamental aspect of Bittensor's
          decentralized learning architecture.

      :param wallet: The wallet associated with the neuron setting the weights.
      :param netuid: The unique identifier of the subnet.
      :param uids: The list of neuron UIDs that the weights are being set for.
      :param weights: The corresponding weights to be set for each UID.
      :param version_key: Version key for compatibility with the network.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param max_retries: The number of maximum attempts to set weights.
      :param block_time: The number of seconds for block duration.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction.
      :param mechid: The subnet mechanism unique identifier.
      :param commit_reveal_version: The version of the commit-reveal in the chain.

      :returns:     `True` if the setting of weights is successful, `False` otherwise.
                    `msg` is a string value describing the success or potential error.
      :rtype: tuple

      This function is crucial in the Yuma Consensus mechanism, where each validator's weight vector contributes to
      the overall weight matrix used to calculate emissions and maintain network consensus.

      .. admonition:: Notes

         See <https://docs.learnbittensor.org/glossary#yuma-consensus>



   .. py:method:: sign_and_send_extrinsic(call, wallet, wait_for_inclusion = True, wait_for_finalization = False, sign_with = 'coldkey', use_nonce = False, period = None, nonce_key = 'hotkey', raise_error = False)

      Helper method to sign and submit an extrinsic call to chain.

      :param call: a prepared Call object
      :type call: scalecodec.types.GenericCall
      :param wallet: the wallet whose coldkey will be used to sign the extrinsic
      :type wallet: bittensor_wallet.Wallet
      :param wait_for_inclusion: whether to wait until the extrinsic call is included on the chain
      :type wait_for_inclusion: bool
      :param wait_for_finalization: whether to wait until the extrinsic call is finalized on the chain
      :type wait_for_finalization: bool
      :param sign_with: the wallet's keypair to use for the signing. Options are "coldkey", "hotkey", "coldkeypub"
      :type sign_with: str
      :param use_nonce: unique identifier for the transaction related with hot/coldkey.
      :type use_nonce: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]
      :param nonce_key: the type on nonce to use. Options are "hotkey" or "coldkey".
      :param raise_error: raises the relevant exception rather than returning `False` if unsuccessful.

      :returns: (success, error message)

      :raises SubstrateRequestException: Substrate request exception.



   .. py:method:: start_call(wallet, netuid, wait_for_inclusion = True, wait_for_finalization = False, period = None)

      Submits a start_call extrinsic to the blockchain, to trigger the start call process for a subnet (used to start
          a new subnet's emission mechanism).

      :param wallet: The wallet used to sign the extrinsic (must be unlocked).
      :type wallet: Wallet
      :param netuid: The UID of the target subnet for which the call is being initiated.
      :type netuid: int
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block.
                                 Defaults to `True`.
      :type wait_for_inclusion: bool, optional
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic.
                                    Defaults to `False`.
      :type wait_for_finalization: bool, optional
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns:     - True and a success message if the extrinsic is successfully submitted or processed.
                    - False and an error message if the submission fails or the wallet cannot be unlocked.
      :rtype: Tuple[bool, str]



   .. py:method:: state_call(method, data, block = None)

      Makes a state call to the Bittensor blockchain, allowing for direct queries of the blockchain's state. This
          function is typically used for advanced queries that require specific method calls and data inputs.

      :param method: The method name for the state call.
      :param data: The data to be passed to the method.
      :param block: The blockchain block number at which to perform the state call.

      :returns: The result of the rpc call.
      :rtype: result (dict[Any, Any])

      The state call function provides a more direct and flexible way of querying blockchain data, useful for specific
          use cases where standard queries are insufficient.



   .. py:method:: subnet(netuid, block = None)

      Retrieves the subnet information for a single subnet in the network.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The block number to query the subnet information from.
      :type block: Optional[int]

      :returns: A DynamicInfo object, containing detailed information about a subnet.
      :rtype: Optional[DynamicInfo]



   .. py:method:: subnet_exists(netuid, block = None)

      Checks if a subnet with the specified unique identifier (netuid) exists within the Bittensor network.

      :param netuid: The unique identifier of the subnet.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: `True` if the subnet exists, `False` otherwise.

      This function is critical for verifying the presence of specific subnets in the network,
      enabling a deeper understanding of the network's structure and composition.



   .. py:method:: subnetwork_n(netuid, block = None)

      Returns network SubnetworkN hyperparameter.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns:

                The value of the SubnetworkN hyperparameter, or ``None`` if the subnetwork does not exist or
                    the parameter is not found.
      :rtype: Optional[int]



   .. py:attribute:: substrate


   .. py:method:: swap_stake(wallet, hotkey_ss58, origin_netuid, destination_netuid, amount, wait_for_inclusion = True, wait_for_finalization = False, safe_staking = False, allow_partial_stake = False, rate_tolerance = 0.005, period = None)

      Moves stake between subnets while keeping the same coldkey-hotkey pair ownership.
      Like subnet hopping - same owner, same hotkey, just changing which subnet the stake is in.

      :param wallet: The wallet to swap stake from.
      :type wallet: bittensor.wallet
      :param hotkey_ss58: The SS58 address of the hotkey whose stake is being swapped.
      :type hotkey_ss58: str
      :param origin_netuid: The netuid from which stake is removed.
      :type origin_netuid: int
      :param destination_netuid: The netuid to which stake is added.
      :type destination_netuid: int
      :param amount: The amount to swap.
      :type amount: Union[Balance, float]
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :type wait_for_finalization: bool
      :param safe_staking: If true, enables price safety checks to protect against fluctuating prices. The swap
                           will only execute if the price ratio between subnets doesn't exceed the rate tolerance.
                           Default is False.
      :type safe_staking: bool
      :param allow_partial_stake: If true and safe_staking is enabled, allows partial stake swaps when
                                  the full amount would exceed the price tolerance. If false, the entire swap fails if it would
                                  exceed the tolerance. Default is False.
      :type allow_partial_stake: bool
      :param rate_tolerance: The maximum allowed increase in the price ratio between subnets
                             (origin_price/destination_price). For example, 0.005 = 0.5% maximum increase. Only used
                             when safe_staking is True. Default is 0.005.
      :type rate_tolerance: float
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: True if the extrinsic was successful.
      :rtype: success (bool)

      The price ratio for swap_stake in safe mode is calculated as: origin_subnet_price / destination_subnet_price
      When safe_staking is enabled, the swap will only execute if:
          - With allow_partial_stake=False: The entire swap amount can be executed without the price ratio
          increasing more than rate_tolerance
          - With allow_partial_stake=True: A partial amount will be swapped up to the point where the
          price ratio would increase by rate_tolerance



   .. py:method:: tempo(netuid, block = None)

      Returns network Tempo hyperparameter.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns:

                The value of the Tempo hyperparameter, or ``None`` if the subnetwork does not exist or the
                    parameter is not found.
      :rtype: Optional[int]



   .. py:method:: toggle_user_liquidity(wallet, netuid, enable, wait_for_inclusion = True, wait_for_finalization = False, period = None)

      Allow to toggle user liquidity for specified subnet.

      :param wallet: The wallet used to sign the extrinsic (must be unlocked).
      :param netuid: The UID of the target subnet for which the call is being initiated.
      :param enable: Boolean indicating whether to enable user liquidity.
      :param wait_for_inclusion: Whether to wait for the extrinsic to be included in a block. Defaults to True.
      :param wait_for_finalization: Whether to wait for finalization of the extrinsic. Defaults to False.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If
                     the transaction is not included in a block within that number of blocks, it will expire and be rejected.
                     You can think of it as an expiration date for the transaction.

      :returns:     - True and a success message if the extrinsic is successfully submitted or processed.
                    - False and an error message if the submission fails or the wallet cannot be unlocked.
      :rtype: Tuple[bool, str]

      Note: The call can be executed successfully by the subnet owner only.



   .. py:method:: transfer(wallet, dest, amount, wait_for_inclusion = True, wait_for_finalization = False, transfer_all = False, keep_alive = True, period = None)

      Transfer token of amount to destination.

      :param wallet: Source wallet for the transfer.
      :type wallet: bittensor_wallet.Wallet
      :param dest: Destination address for the transfer.
      :type dest: str
      :param amount: Amount of tao to transfer.
      :type amount: float
      :param transfer_all: Flag to transfer all tokens. Default is ``False``.
      :type transfer_all: bool
      :param wait_for_inclusion: Waits for the transaction to be included in a block.  Default is ``True``.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.  Default is
                                    ``False``.
      :type wait_for_finalization: bool
      :param keep_alive: Flag to keep the connection alive. Default is ``True``.
      :type keep_alive: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: `True` if the transferring was successful, otherwise `False`.



   .. py:method:: transfer_stake(wallet, destination_coldkey_ss58, hotkey_ss58, origin_netuid, destination_netuid, amount, wait_for_inclusion = True, wait_for_finalization = False, period = None)

      Transfers stake from one subnet to another while changing the coldkey owner.

      :param wallet: The wallet to transfer stake from.
      :type wallet: bittensor.wallet
      :param destination_coldkey_ss58: The destination coldkey SS58 address.
      :type destination_coldkey_ss58: str
      :param hotkey_ss58: The hotkey SS58 address associated with the stake.
      :type hotkey_ss58: str
      :param origin_netuid: The source subnet UID.
      :type origin_netuid: int
      :param destination_netuid: The destination subnet UID.
      :type destination_netuid: int
      :param amount: Amount to transfer.
      :type amount: Union[Balance, float, int]
      :param wait_for_inclusion: If true, waits for inclusion before returning.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: If true, waits for finalization before returning.
      :type wait_for_finalization: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]

      :returns: True if the transfer was successful.
      :rtype: success (bool)



   .. py:method:: tx_rate_limit(block = None)

      Retrieves the transaction rate limit for the Bittensor network as of a specific blockchain block.
      This rate limit sets the maximum number of transactions that can be processed within a given time frame.

      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns: The transaction rate limit of the network, None if not available.
      :rtype: Optional[int]

      The transaction rate limit is an essential parameter for ensuring the stability and scalability of the Bittensor
          network. It helps in managing network load and preventing congestion, thereby maintaining efficient and
          timely transaction processing.



   .. py:method:: unstake(wallet, hotkey_ss58 = None, netuid = None, amount = None, wait_for_inclusion = True, wait_for_finalization = False, safe_staking = False, allow_partial_stake = False, rate_tolerance = 0.005, period = None, unstake_all = False)

      Removes a specified amount of stake from a single hotkey account. This function is critical for adjusting
          individual neuron stakes within the Bittensor network.

      :param wallet: The wallet associated with the neuron from which the stake is being removed.
      :param hotkey_ss58: The ``SS58`` address of the hotkey account to unstake from.
      :param netuid: The unique identifier of the subnet.
      :param amount: The amount of alpha to unstake. If not specified, unstakes all. Alpha amount.
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :param safe_staking: If true, enables price safety checks to protect against fluctuating prices. The unstake
                           will only execute if the price change doesn't exceed the rate tolerance. Default is False.
      :param allow_partial_stake: If true and safe_staking is enabled, allows partial unstaking when
                                  the full amount would exceed the price tolerance. If false, the entire unstake fails if it would
                                  exceed the tolerance. Default is False.
      :type allow_partial_stake: bool
      :param rate_tolerance: The maximum allowed price change ratio when unstaking. For example,
                             0.005 = 0.5% maximum price decrease. Only used when safe_staking is True. Default is 0.005.
      :type rate_tolerance: float
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]
      :param unstake_all: If `True`, unstakes all tokens, and `amount` is ignored. Default is `False`.

      :returns: ``True`` if the unstaking process is successful, False otherwise.
      :rtype: bool

      This function supports flexible stake management, allowing neurons to adjust their network participation and
          potential reward accruals. When safe_staking is enabled, it provides protection against price fluctuations
          during the time unstake is executed and the time it is actually processed by the chain.



   .. py:method:: unstake_all(wallet, hotkey, netuid, rate_tolerance = 0.005, wait_for_inclusion = True, wait_for_finalization = False, period = None)

      Unstakes all TAO/Alpha associated with a hotkey from the specified subnets on the Bittensor network.

      :param wallet: The wallet of the stake owner.
      :param hotkey: The SS58 address of the hotkey to unstake from.
      :param netuid: The unique identifier of the subnet.
      :param rate_tolerance: The maximum allowed price change ratio when unstaking. For example, 0.005 = 0.5% maximum
                             price decrease. If not passed (None), then unstaking goes without price limit. Default is 0.005.
      :param wait_for_inclusion: Waits for the transaction to be included in a block. Default is `True`.
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain. Default is `False`.
      :param period: The number of blocks during which the transaction will remain valid after it's submitted. If the
                     transaction is not included in a block within that number of blocks, it will expire and be rejected. You
                     can think of it as an expiration date for the transaction. Default is `None`.

      :returns:     A tuple containing:
                    - `True` and a success message if the unstake operation succeeded;
                    - `False` and an error message otherwise.
      :rtype: tuple[bool, str]

      .. admonition:: Example

         # If you would like to unstake all stakes in all subnets safely:
         import bittensor as bt
         
         subtensor = bt.Subtensor()
         wallet = bt.Wallet("my_wallet")
         netuid = 14
         hotkey = "5%SOME_HOTKEY%"
         
         wallet_stakes = subtensor.get_stake_info_for_coldkey(coldkey_ss58=wallet.coldkey.ss58_address)
         
         for stake in wallet_stakes:
             result = subtensor.unstake_all(
                 wallet=wallet,
                 hotkey_ss58=stake.hotkey_ss58,
                 netuid=stake.netuid,
             )
             print(result)
         
         # If you would like to unstake all stakes in all subnets unsafely, use `rate_tolerance=None`:
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



   .. py:method:: unstake_multiple(wallet, hotkey_ss58s, netuids, amounts = None, wait_for_inclusion = True, wait_for_finalization = False, period = None, unstake_all = False)

      Performs batch unstaking from multiple hotkey accounts, allowing a neuron to reduce its staked amounts
          efficiently. This function is useful for managing the distribution of stakes across multiple neurons.

      :param wallet: The wallet linked to the coldkey from which the stakes are being
                     withdrawn.
      :param hotkey_ss58s: A list of hotkey ``SS58`` addresses to unstake from.
      :type hotkey_ss58s: List[str]
      :param netuids: The list of subnet uids.
      :type netuids: List[int]
      :param amounts: The amounts of TAO to unstake from each hotkey. If not provided,
                      unstakes all available stakes.
      :type amounts: List[Balance]
      :param wait_for_inclusion: Waits for the transaction to be included in a block.
      :type wait_for_inclusion: bool
      :param wait_for_finalization: Waits for the transaction to be finalized on the blockchain.
      :type wait_for_finalization: bool
      :param period: The number of blocks during which the transaction will remain valid after it's
                     submitted. If the transaction is not included in a block within that number of blocks, it will expire
                     and be rejected. You can think of it as an expiration date for the transaction.
      :type period: Optional[int]
      :param unstake_all: If `True`, unstakes all tokens, and `amounts` is ignored. Default is `False`.

      :returns: ``True`` if the batch unstaking is successful, False otherwise.
      :rtype: bool

      This function allows for strategic reallocation or withdrawal of stakes, aligning with the dynamic stake
          management aspect of the Bittensor network.



   .. py:method:: wait_for_block(block = None)

      Waits until a specific block is reached on the chain. If no block is specified,
      waits for the next block.

      :param block: The block number to wait for. If None, waits for the next block.
      :type block: Optional[int]

      :returns: True if the target block was reached, False if timeout occurred.
      :rtype: bool

      .. admonition:: Example

         import bittensor as bt
         subtensor = bt.Subtensor()
         
         subtensor.wait_for_block() # Waits for the next block
         subtensor.wait_for_block(block=1234) # Waits for a specific block



   .. py:method:: weights(netuid, block = None, mechid = 0)

      Retrieves the weight distribution set by neurons within a specific subnet of the Bittensor network.
      This function maps each neuron's UID to the weights it assigns to other neurons, reflecting the network's trust
          and value assignment mechanisms.

      :param netuid: The network UID of the subnet to query.
      :type netuid: int
      :param block: Block number for synchronization, or ``None`` for the latest block.
      :type block: Optional[int]
      :param mechid: Subnet mechanism identifier.

      :returns: A list of tuples mapping each neuron's UID to its assigned weights.

      The weight distribution is a key factor in the network's consensus algorithm and the ranking of neurons,
          influencing their influence and reward allocation within the subnet.



   .. py:method:: weights_rate_limit(netuid, block = None)

      Returns network WeightsSetRateLimit hyperparameter.

      :param netuid: The unique identifier of the subnetwork.
      :type netuid: int
      :param block: The blockchain block number for the query.
      :type block: Optional[int]

      :returns:

                The value of the WeightsSetRateLimit hyperparameter, or ``None`` if the subnetwork does not
                    exist or the parameter is not found.
      :rtype: Optional[int]



