bittensor.core.chain_data.coldkey_swap
======================================

.. py:module:: bittensor.core.chain_data.coldkey_swap


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.coldkey_swap.ColdkeySwapAnnouncementInfo
   bittensor.core.chain_data.coldkey_swap.ColdkeySwapConstants
   bittensor.core.chain_data.coldkey_swap.ColdkeySwapDisputeInfo


Module Contents
---------------

.. py:class:: ColdkeySwapAnnouncementInfo

   Information about a coldkey swap announcement.

   This class contains information about a pending coldkey swap announcement. Announcements are used when a coldkey
   wants to declare its intention to swap to a new coldkey address. The announcement must be made before the actual
   swap can be executed, allowing time for verification and security checks.

   :ivar coldkey: The SS58 address of the coldkey that made the announcement.
   :ivar execution_block: The block number when the swap can be executed (after the delay period has passed).
   :ivar new_coldkey_hash: The BlakeTwo256 hash of the new coldkey AccountId (hex string with 0x prefix). This hash
                           must match the actual new coldkey when the swap is executed.


   .. admonition:: Notes

      - The announcement is stored on-chain and can be queried via `get_coldkey_swap_announcement()`.
      - After making an announcement, all transactions from coldkey are blocked except for `swap_coldkey_announced`.
      - The swap can only be executed after the `execution_block` has been reached.
      - See: <https://docs.learnbittensor.org/keys/coldkey-swap>


   .. py:attribute:: coldkey
      :type:  str


   .. py:attribute:: execution_block
      :type:  int


   .. py:method:: from_query(coldkey_ss58, query)
      :classmethod:


      Creates a ColdkeySwapAnnouncementInfo object from a Substrate query result.

      :param coldkey_ss58: The SS58 address of the coldkey that made the announcement.
      :param query: Query result from Substrate `query()` call to `ColdkeySwapAnnouncements` storage function.

      :returns: ColdkeySwapAnnouncementInfo if announcement exists, None otherwise.



   .. py:method:: from_record(record)
      :classmethod:


      Creates a ColdkeySwapAnnouncementInfo object from a query_map record.

      :param record: Data item from query_map records call to ColdkeySwapAnnouncements storage function. Structure is
                     [key, value] where key is the coldkey AccountId and value contains (BlockNumber, Hash) tuple.

      :returns: ColdkeySwapAnnouncementInfo object with announcement details for the coldkey from the record.



   .. py:attribute:: new_coldkey_hash
      :type:  str


.. py:class:: ColdkeySwapConstants

   Represents runtime constants for coldkey swap operations in the SubtensorModule.

   This class contains runtime constants that define cost requirements for coldkey swap operations.
   Note: For delay values (ColdkeySwapAnnouncementDelay and ColdkeySwapReannouncementDelay), use the dedicated
   query methods `get_coldkey_swap_announcement_delay()` and `get_coldkey_swap_reannouncement_delay()` instead,
   as these are storage values, not runtime constants.

   :ivar KeySwapCost: The cost in RAO required to make a coldkey swap announcement. This cost is charged when making the
                      first announcement (not when reannouncing). This is a runtime constant (queryable via constants).


   .. admonition:: Notes

      - All amounts are in RAO.
      - Values reflect the current chain configuration at the time of retrieval.
      - See: <https://docs.learnbittensor.org/keys/coldkey-swap>


   .. py:attribute:: KeySwapCost
      :type:  Optional[int]


   .. py:method:: constants_names()
      :classmethod:


      Returns the list of all constant field names defined in this dataclass.

      :returns: List of constant field names as strings.



   .. py:method:: from_dict(data)
      :classmethod:


      Creates a ColdkeySwapConstants instance from a dictionary of decoded chain constants.

      :param data: Dictionary mapping constant names to their decoded values (returned by `Subtensor.query_constant()`).

      :returns: ColdkeySwapConstants object with constants filled in. Fields not found in data will be set to `None`.



   .. py:method:: to_dict()

      Converts the ColdkeySwapConstants instance to a dictionary.

      :returns: Dictionary mapping constant names to their values.



.. py:class:: ColdkeySwapDisputeInfo

   Information about a coldkey swap dispute.

   This class contains information about a disputed coldkey swap. When a coldkey swap is disputed,
   the account is frozen until the triumvirate resolves it via a root-only reset.

   :ivar coldkey: The SS58 address of the coldkey that was disputed.
   :ivar disputed_block: The block number when the dispute was recorded.


   .. admonition:: Notes

      - The dispute is stored on-chain in ColdkeySwapDisputes storage.
      - While disputed, the coldkey can only perform announce_coldkey_swap, swap_coldkey_announced,
        or dispute_coldkey_swap (or MEV-protected calls).
      - See: <https://docs.learnbittensor.org/keys/coldkey-swap>


   .. py:attribute:: coldkey
      :type:  str


   .. py:attribute:: disputed_block
      :type:  int


   .. py:method:: from_query(coldkey_ss58, query)
      :classmethod:


      Creates a ColdkeySwapDisputeInfo object from a Substrate query result.

      :param coldkey_ss58: The SS58 address of the coldkey that was disputed.
      :param query: Query result from Substrate `query()` call to `ColdkeySwapDisputes` storage function.

      :returns: ColdkeySwapDisputeInfo if dispute exists, None otherwise.



   .. py:method:: from_record(record)
      :classmethod:


      Creates a ColdkeySwapDisputeInfo object from a query_map record.

      :param record: Data item from query_map records call to ColdkeySwapDisputes storage function. Structure is
                     [key, value] where key is the coldkey AccountId and value is the disputed block number.

      :returns: ColdkeySwapDisputeInfo object with dispute details for the coldkey from the record.



