bittensor.core.chain_data.crowdloan_info
========================================

.. py:module:: bittensor.core.chain_data.crowdloan_info


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.crowdloan_info.CrowdloanConstants
   bittensor.core.chain_data.crowdloan_info.CrowdloanInfo


Module Contents
---------------

.. py:class:: CrowdloanConstants

   Represents all runtime constants defined in the `pallet-crowdloan`.

   These attributes correspond directly to on-chain configuration constants exposed by the Crowdloan pallet. They
   define contribution limits, duration bounds, pallet identifiers, and refund behavior that govern how crowdloan
   campaigns operate within the Subtensor network.

   Each attribute is fetched directly from the runtime via `Subtensor.substrate.get_constant("Crowdloan", <name>)` and
   reflects the current chain configuration at the time of retrieval.

   :ivar AbsoluteMinimumContribution: The absolute minimum amount required to contribute to any crowdloan.
   :ivar MaxContributors: The maximum number of unique contributors allowed per crowdloan.
   :ivar MaximumBlockDuration: The maximum allowed duration (in blocks) for a crowdloan campaign.
   :ivar MinimumDeposit: The minimum deposit required from the creator to open a new crowdloan.
   :ivar MinimumBlockDuration: The minimum allowed duration (in blocks) for a crowdloan campaign.
   :ivar RefundContributorsLimit: The maximum number of contributors that can be refunded in single on-chain refund call.


   .. note:: All Balance amounts are in RAO.


   .. py:attribute:: AbsoluteMinimumContribution
      :type:  Optional[bittensor.utils.balance.Balance]


   .. py:attribute:: MaxContributors
      :type:  Optional[int]


   .. py:attribute:: MaximumBlockDuration
      :type:  Optional[int]


   .. py:attribute:: MinimumBlockDuration
      :type:  Optional[int]


   .. py:attribute:: MinimumDeposit
      :type:  Optional[bittensor.utils.balance.Balance]


   .. py:attribute:: RefundContributorsLimit
      :type:  Optional[int]


   .. py:method:: constants_names()
      :classmethod:


      Returns the list of all constant field names defined in this dataclass.



   .. py:method:: from_dict(data)
      :classmethod:


      Creates a `CrowdloanConstants` instance from a dictionary of decoded chain constants.

      :param data: Dictionary mapping constant names to their decoded values (returned by `Subtensor.query_constant()`).

      :returns: The structured dataclass with constants filled in.
      :rtype: CrowdloanConstants



.. py:class:: CrowdloanInfo

   Represents a single on-chain crowdloan campaign from the `pallet-crowdloan`.

   Each instance reflects the current state of a specific crowdloan as stored in chain storage. It includes funding
   details, creator information, contribution totals, and optional call/target data that define what happens upon
   successful finalization.

   :ivar id: The unique identifier (index) of the crowdloan.
   :ivar creator: The SS58 address of the creator (campaign initiator).
   :ivar deposit: The creator's initial deposit locked to open the crowdloan.
   :ivar min_contribution: The minimum contribution amount allowed per participant.
   :ivar end: The block number when the campaign ends.
   :ivar cap: The maximum amount to be raised (funding cap).
   :ivar funds_account: The account ID holding the crowdloan’s funds.
   :ivar raised: The total amount raised so far.
   :ivar target_address: Optional SS58 address to which funds are transferred upon success.
   :ivar call: Optional encoded runtime call (e.g., a `register_leased_network` extrinsic) to execute on finalize.
   :ivar finalized: Whether the crowdloan has been finalized on-chain.
   :ivar contributors_count: Number of unique contributors currently participating.



   .. py:attribute:: call
      :type:  Optional[dict]


   .. py:attribute:: cap
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: contributors_count
      :type:  int


   .. py:attribute:: creator
      :type:  str


   .. py:attribute:: deposit
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: end
      :type:  int


   .. py:attribute:: finalized
      :type:  bool


   .. py:method:: from_dict(idx, data)
      :classmethod:


      Returns a CrowdloanInfo object from decoded chain data.



   .. py:attribute:: funds_account
      :type:  str


   .. py:attribute:: id
      :type:  int


   .. py:attribute:: min_contribution
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: raised
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: target_address
      :type:  Optional[str]


