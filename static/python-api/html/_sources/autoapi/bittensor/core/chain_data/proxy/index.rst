bittensor.core.chain_data.proxy
===============================

.. py:module:: bittensor.core.chain_data.proxy


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.proxy.ProxyAnnouncementInfo
   bittensor.core.chain_data.proxy.ProxyConstants
   bittensor.core.chain_data.proxy.ProxyInfo
   bittensor.core.chain_data.proxy.ProxyType


Module Contents
---------------

.. py:class:: ProxyAnnouncementInfo

   Dataclass representing proxy announcement information.

   This class contains information about a pending proxy announcement. Announcements are used when a proxy account
   with a non-zero delay period (time-lock) wants to declare its intention to execute a call on behalf of the real
   account. The announcement must be made before the actual call can be executed, allowing the real account time to
   review and potentially reject the operation via `reject_proxy_announcement` before it takes effect. After the
   delay period passes, the proxy can execute the announced call via `proxy_announced`.

   :ivar real: The SS58 address of the real account on whose behalf the call will be made.
   :ivar call_hash: The hash of the call that will be executed in the future (hex string with `0x` prefix). This hash
                    must match the actual call when it is executed via `proxy_announced`.
   :ivar height: The block height at which the announcement was made. The delay period is calculated from this block.


   .. admonition:: Notes

      - Announcements are required when using delayed proxies (non-zero delay), providing an additional security
        layer for time-locked operations.
      - Bittensor proxies: <https://docs.learnbittensor.org/keys/proxies>


   .. py:attribute:: call_hash
      :type:  str


   .. py:method:: from_dict(data)
      :classmethod:


      Creates a list of ProxyAnnouncementInfo objects from chain announcement data.

      This method decodes the raw announcement data returned from the Proxy.Announcements storage function.

      :param data: Tuple of announcements data from the `Proxy.Announcements` storage function.

      :returns: List of ProxyAnnouncementInfo objects representing all pending announcements.

      .. admonition:: Notes

         See: <https://docs.learnbittensor.org/keys/proxies>



   .. py:method:: from_query_map_record(record)
      :classmethod:


      Returns a list of ProxyAnnouncementInfo objects from a tuple of announcements data.

      :param record: Data item from query_map records call to Announcements storage function. Structure is [key, value]
                     where key is the delegate account and value contains announcements data.

      :returns:     - SS58 address of the delegate account making the announcement.
                    - List of ProxyAnnouncementInfo objects for all pending announcements from this delegate.
      :rtype: Tuple containing



   .. py:attribute:: height
      :type:  int


   .. py:attribute:: real
      :type:  str


.. py:class:: ProxyConstants

   Fetches all runtime constants defined in the Proxy pallet.

   Displays current values for on-chain configuration constants for the Proxy pallet. They define
   deposit requirements, account limits, and announcement constraints that govern the behavior of proxies.

   Each attribute is fetched directly from the runtime via `Subtensor.query_constant("Proxy", <name>)` and reflects
   the current chain configuration at the time of retrieval.

   :ivar AnnouncementDepositBase: Base deposit amount (in RAO) required to announce a future proxy call. This deposit
                                  is held until the announced call is executed or cancelled.
   :ivar AnnouncementDepositFactor: Additional deposit factor (in RAO) per byte of the call hash being announced. The
                                    total announcement deposit is calculated as: `AnnouncementDepositBase + (call_hash_size *
                                    AnnouncementDepositFactor)`.
   :ivar MaxProxies: Maximum number of proxy relationships that a single account can have. This limits the total
                     number of delegates that can act on behalf of an account.
   :ivar MaxPending: Maximum number of pending proxy announcements that can exist for a single account at any given
                     time. This prevents spam and limits the storage requirements for pending announcements.
   :ivar ProxyDepositBase: Base deposit amount (in RAO) required when adding a proxy relationship. This deposit is
                           held as long as the proxy relationship exists and is returned when the proxy is removed.
   :ivar ProxyDepositFactor: Additional deposit factor (in RAO) per proxy type added. The total proxy deposit is
                             calculated as: `ProxyDepositBase + (number_of_proxy_types * ProxyDepositFactor)`.


   .. admonition:: Notes

      - All Balance amounts are in RAO.
      - See: <https://docs.learnbittensor.org/keys/proxies>


   .. py:attribute:: AnnouncementDepositBase
      :type:  Optional[bittensor.utils.balance.Balance]


   .. py:attribute:: AnnouncementDepositFactor
      :type:  Optional[bittensor.utils.balance.Balance]


   .. py:attribute:: MaxPending
      :type:  Optional[int]


   .. py:attribute:: MaxProxies
      :type:  Optional[int]


   .. py:attribute:: ProxyDepositBase
      :type:  Optional[bittensor.utils.balance.Balance]


   .. py:attribute:: ProxyDepositFactor
      :type:  Optional[bittensor.utils.balance.Balance]


   .. py:method:: constants_names()
      :classmethod:


      Returns the all constant field names defined in this dataclass.

      :returns: List of constant field names as strings.



   .. py:method:: from_dict(data)
      :classmethod:


      Creates a ProxyConstants instance from a dictionary of decoded chain constants.

      :param data: Dictionary mapping constant names to their decoded values (returned by `Subtensor.query_constant()`).

      :returns: ProxyConstants object with constants filled in. Fields not found in data will be set to `None`.



   .. py:method:: to_dict()

      Converts the ProxyConstants instance to a dictionary.

      :returns: Dictionary mapping constant names to their values. Balance objects remain as Balance instances.



.. py:class:: ProxyInfo

   Dataclass representing proxy relationship information.

   This class contains information about a proxy relationship between a real account and a delegate account. A proxy
   relationship allows the delegate to perform certain operations on behalf of the real account, with restrictions
   defined by the proxy type and a delay period.

   :ivar delegate: The SS58 address of the delegate proxy account that can act on behalf of the real account.
   :ivar proxy_type: The type of proxy permissions granted to the delegate (e.g., `"Any"`, `"NonTransfer"`,
                     `"ChildKeys"`, `"Staking"`). This determines what operations the delegate can perform.
   :ivar delay: The number of blocks that must elapse between announcing a call and executing it (time-lock period). A
                delay of `0` allows immediate execution without announcements. Non-zero delays require the delegate to
                announce the call first via `announce_proxy`, wait for the delay period to pass, then execute it via
                `proxy_announced`, giving the real account time to review and potentially reject the call via
                `reject_proxy_announcement` before execution.


   .. admonition:: Notes

      - Bittensor proxies: <https://docs.learnbittensor.org/keys/proxies>
      - Creating proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>


   .. py:attribute:: delay
      :type:  int


   .. py:attribute:: delegate
      :type:  str


   .. py:method:: from_query(query)
      :classmethod:


      Creates a list of ProxyInfo objects and deposit balance from a Substrate query result.

      This method decodes the query result from the Proxy.Proxies storage function, extracting both the proxy
      relationships and the deposit amount reserved for maintaining these proxies.

      :param query: Query result from Substrate `query()` call to `Proxy.Proxies` storage function.

      :returns:     - List of ProxyInfo objects representing all proxy relationships for the real account.
                    - Balance object representing the reserved deposit amount (in RAO).
      :rtype: Tuple containing

      .. admonition:: Notes

         The deposit is held as long as the proxy relationships exist and is returned when proxies are removed.
         
         See: <https://docs.learnbittensor.org/keys/proxies>



   .. py:method:: from_query_map_record(record)
      :classmethod:


      Creates a dictionary mapping delegate addresses to their ProxyInfo lists from a query_map record.

      Processes a single record from a query_map call to the Proxy.Proxies storage function. Each record represents
      one real account and its associated proxy/ies relationships.

      :param record: Data item from query_map records call to Proxies storage function. Structure is [key, value] where
                     key is the real account and value contains proxies data.

      :returns:     - SS58 address of the real account (delegator).
                    - List of ProxyInfo objects representing all proxy relationships for this real account.
      :rtype: Tuple containing



   .. py:method:: from_tuple(data)
      :classmethod:


      Creates a list of ProxyInfo objects from chain proxy data.

      This method decodes the raw proxy data returned from the Proxy.Proxies storage function and creates
      structured ProxyInfo objects.

      :param data: Tuple of chain proxy data from the `Proxy.Proxies` storage function.

      :returns: List of ProxyInfo objects representing all proxy relationships for a real account.

      .. admonition:: Notes

         See: <https://docs.learnbittensor.org/keys/proxies>



   .. py:attribute:: proxy_type
      :type:  str


.. py:class:: ProxyType

   Bases: :py:obj:`str`, :py:obj:`enum.Enum`


   Enumeration of all supported proxy types in the Bittensor network.

   These types define the permissions that a proxy account has when acting on behalf of the real account. Each type
   restricts what operations the proxy can perform.

   Proxy Type Descriptions:

       Any: Allows the proxy to execute any call on behalf of the real account. This is the most permissive but least
           secure proxy type. Use with caution.

       Owner: Allows the proxy to manage subnet identity and settings. Permitted operations include:
           - AdminUtils calls (except sudo_set_sn_owner_hotkey)
           - set_subnet_identity
           - update_symbol

       NonCritical: Allows all operations except critical ones that could harm the account. Prohibited operations:
           - dissolve_network
           - root_register
           - burned_register
           - Sudo calls

       NonTransfer: Allows all operations except those involving token transfers. Prohibited operations:
           - All Balances module calls
           - transfer_stake

       NonFungible: Allows all operations except token-related operations and registrations. Prohibited operations:
           - All Balances module calls
           - All staking operations (add_stake, remove_stake, unstake_all, swap_stake, move_stake, transfer_stake)
           - Registration operations (burned_register, root_register)
           - Key swap operations (announce_coldkey_swap, swap_coldkey_announced, swap_hotkey)

       Staking: Allows only staking-related operations. Permitted operations:
           - add_stake, add_stake_limit
           - remove_stake, remove_stake_limit, remove_stake_full_limit
           - unstake_all, unstake_all_alpha
           - swap_stake, swap_stake_limit
           - move_stake

       Registration: Allows only neuron registration operations. Permitted operations:
           - burned_register
           - register

       Transfer: Allows only token transfer operations. Permitted operations:
           - transfer_keep_alive
           - transfer_allow_death
           - transfer_all
           - transfer_stake

       SmallTransfer: Allows only small token transfers below a specific limit. Permitted operations:
           - transfer_keep_alive (if value < SMALL_TRANSFER_LIMIT)
           - transfer_allow_death (if value < SMALL_TRANSFER_LIMIT)
           - transfer_stake (if alpha_amount < SMALL_TRANSFER_LIMIT)

       ChildKeys: Allows only child key management operations. Permitted operations:
           - set_children
           - set_childkey_take

       SudoUncheckedSetCode: Allows only runtime code updates. Permitted operations:
           - sudo_unchecked_weight with inner call System::set_code

       SwapHotkey: Allows only hotkey swap operations. Permitted operations:
           - swap_hotkey

       SubnetLeaseBeneficiary: Allows subnet management and configuration operations. Permitted operations:
           - start_call
           - Multiple AdminUtils.sudo_set_* calls for subnet parameters, network settings, weights, alpha values, etc.

       RootClaim: Allows only root claim operations. Permitted operations:
           - claim_root
           - set_root_claim_type

   .. admonition:: Notes

      - The permissions described above may change over time as the Subtensor runtime evolves. For the most up-to-date
        and authoritative information about proxy type permissions, refer to the Subtensor source code at:
        <https://github.com/RaoFoundation/subtensor/blob/main/runtime/src/lib.rs>
        Specifically, look for the `impl InstanceFilter<RuntimeCall> for ProxyType` implementation which defines the
        exact filtering logic for each proxy type.
      - The values match exactly with the ProxyType enum defined in the Subtensor runtime. Any changes to the
        runtime enum must be reflected here.
      - Proxy overview: <https://docs.learnbittensor.org/keys/proxies>
      - Creating and managing proxies: <https://docs.learnbittensor.org/keys/proxies/create-proxy>
      - Pure proxies: <https://docs.learnbittensor.org/keys/proxies/pure-proxies>

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: Any
      :value: 'Any'



   .. py:attribute:: ChildKeys
      :value: 'ChildKeys'



   .. py:attribute:: Governance
      :value: 'Governance'



   .. py:attribute:: NonCritical
      :value: 'NonCritical'



   .. py:attribute:: NonFungible
      :value: 'NonFungible'



   .. py:attribute:: NonTransfer
      :value: 'NonTransfer'



   .. py:attribute:: Owner
      :value: 'Owner'



   .. py:attribute:: Registration
      :value: 'Registration'



   .. py:attribute:: RootClaim
      :value: 'RootClaim'



   .. py:attribute:: RootWeights
      :value: 'RootWeights'



   .. py:attribute:: Senate
      :value: 'Senate'



   .. py:attribute:: SmallTransfer
      :value: 'SmallTransfer'



   .. py:attribute:: Staking
      :value: 'Staking'



   .. py:attribute:: SubnetLeaseBeneficiary
      :value: 'SubnetLeaseBeneficiary'



   .. py:attribute:: SudoUncheckedSetCode
      :value: 'SudoUncheckedSetCode'



   .. py:attribute:: SwapHotkey
      :value: 'SwapHotkey'



   .. py:attribute:: Transfer
      :value: 'Transfer'



   .. py:attribute:: Triumvirate
      :value: 'Triumvirate'



   .. py:method:: all_types()
      :classmethod:


      Returns a list of all proxy type values.

      :returns: List of all valid proxy type string values (e.g., `["Any", "Owner", "Staking", ...]`).



   .. py:method:: is_valid(value)
      :classmethod:


      Checks if a string value is a valid proxy type.

      :param value: String value to validate.

      :returns: `True` if the value is a valid proxy type, `False` otherwise.



   .. py:method:: normalize(proxy_type)
      :classmethod:


      Normalizes a proxy type to a string value.

      This method handles both string and ProxyType enum values, validates the input, and returns the string
      representation suitable for Substrate calls.

      :param proxy_type: Either a string or ProxyType enum value.

      :returns: The normalized string value of the proxy type.

      :raises ValueError: If the proxy_type is not a valid proxy type.



