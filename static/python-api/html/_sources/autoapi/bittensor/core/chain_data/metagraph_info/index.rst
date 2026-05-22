bittensor.core.chain_data.metagraph_info
========================================

.. py:module:: bittensor.core.chain_data.metagraph_info


Attributes
----------

.. autoapisummary::

   bittensor.core.chain_data.metagraph_info.SELECTIVE_METAGRAPH_COMMITMENTS_OFFSET


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.metagraph_info.MetagraphInfo
   bittensor.core.chain_data.metagraph_info.MetagraphInfoEmissions
   bittensor.core.chain_data.metagraph_info.MetagraphInfoParams
   bittensor.core.chain_data.metagraph_info.MetagraphInfoPool
   bittensor.core.chain_data.metagraph_info.SelectiveMetagraphIndex


Functions
---------

.. autoapisummary::

   bittensor.core.chain_data.metagraph_info.get_selective_metagraph_commitments
   bittensor.core.chain_data.metagraph_info.process_nested


Module Contents
---------------

.. py:class:: MetagraphInfo

   Bases: :py:obj:`bittensor.core.chain_data.info_base.InfoBase`


   .. py:attribute:: active
      :type:  list[bool]


   .. py:attribute:: activity_cutoff
      :type:  int


   .. py:attribute:: adjustment_alpha
      :type:  float


   .. py:attribute:: adjustment_interval
      :type:  int


   .. py:attribute:: alpha_dividends_per_hotkey
      :type:  list[tuple[str, bittensor.utils.balance.Balance]]


   .. py:attribute:: alpha_high
      :type:  float


   .. py:attribute:: alpha_in
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: alpha_in_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: alpha_low
      :type:  float


   .. py:attribute:: alpha_out
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: alpha_out_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: alpha_stake
      :type:  list[bittensor.utils.balance.Balance]


   .. py:attribute:: axons
      :type:  list[bittensor.core.chain_data.axon_info.AxonInfo]


   .. py:attribute:: block
      :type:  int


   .. py:attribute:: block_at_registration
      :type:  list[int]


   .. py:attribute:: blocks_since_last_step
      :type:  int


   .. py:attribute:: bonds_moving_avg
      :type:  float


   .. py:attribute:: burn
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: coldkeys
      :type:  list[str]


   .. py:attribute:: commit_reveal_period
      :type:  int


   .. py:attribute:: commit_reveal_weights_enabled
      :type:  bool


   .. py:attribute:: commitments
      :type:  Optional[tuple[tuple[str, str]]]


   .. py:attribute:: consensus
      :type:  list[float]


   .. py:attribute:: difficulty
      :type:  float


   .. py:attribute:: dividends
      :type:  list[float]


   .. py:attribute:: emission
      :type:  list[bittensor.utils.balance.Balance]


   .. py:attribute:: hotkeys
      :type:  list[str]


   .. py:attribute:: identities
      :type:  list[Optional[bittensor.core.chain_data.chain_identity.ChainIdentity]]


   .. py:attribute:: identity
      :type:  Optional[bittensor.core.chain_data.subnet_identity.SubnetIdentity]


   .. py:attribute:: immunity_period
      :type:  int


   .. py:attribute:: incentives
      :type:  list[float]


   .. py:attribute:: kappa
      :type:  float


   .. py:attribute:: last_step
      :type:  int


   .. py:attribute:: last_update
      :type:  list[int]


   .. py:attribute:: liquid_alpha_enabled
      :type:  bool


   .. py:attribute:: max_burn
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: max_difficulty
      :type:  float


   .. py:attribute:: max_regs_per_block
      :type:  int


   .. py:attribute:: max_uids
      :type:  int


   .. py:attribute:: max_validators
      :type:  int


   .. py:attribute:: max_weights_limit
      :type:  float


   .. py:attribute:: mechid
      :type:  int


   .. py:attribute:: min_allowed_weights
      :type:  float


   .. py:attribute:: min_burn
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: min_difficulty
      :type:  float


   .. py:attribute:: moving_price
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: name
      :type:  str


   .. py:attribute:: netuid
      :type:  int


   .. py:attribute:: network_registered_at
      :type:  int


   .. py:attribute:: num_uids
      :type:  int


   .. py:attribute:: owner_coldkey
      :type:  Optional[str]


   .. py:attribute:: owner_hotkey
      :type:  Optional[str]


   .. py:attribute:: pending_alpha_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: pending_root_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: pow_registration_allowed
      :type:  bool


   .. py:attribute:: pruning_score
      :type:  list[float]


   .. py:attribute:: rank
      :type:  list[float]


   .. py:attribute:: registration_allowed
      :type:  bool


   .. py:attribute:: rho
      :type:  int


   .. py:attribute:: serving_rate_limit
      :type:  int


   .. py:attribute:: subnet_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: subnet_volume
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: symbol
      :type:  str


   .. py:attribute:: tao_dividends_per_hotkey
      :type:  list[tuple[str, bittensor.utils.balance.Balance]]


   .. py:attribute:: tao_in
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: tao_in_emission
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: tao_stake
      :type:  list[bittensor.utils.balance.Balance]


   .. py:attribute:: target_regs_per_interval
      :type:  int


   .. py:attribute:: tempo
      :type:  int


   .. py:attribute:: total_stake
      :type:  list[bittensor.utils.balance.Balance]


   .. py:attribute:: trust
      :type:  list[float]


   .. py:attribute:: validator_permit
      :type:  list[bool]


   .. py:attribute:: validators
      :type:  Optional[list[str]]


   .. py:attribute:: weights_rate_limit
      :type:  int


   .. py:attribute:: weights_version
      :type:  int


.. py:class:: MetagraphInfoEmissions

   Emissions presented in tao values.


   .. py:attribute:: alpha_in_emission
      :type:  float


   .. py:attribute:: alpha_out_emission
      :type:  float


   .. py:attribute:: pending_alpha_emission
      :type:  float


   .. py:attribute:: pending_root_emission
      :type:  float


   .. py:attribute:: subnet_emission
      :type:  float


   .. py:attribute:: tao_in_emission
      :type:  float


.. py:class:: MetagraphInfoParams

   .. py:attribute:: activity_cutoff
      :type:  int


   .. py:attribute:: adjustment_alpha
      :type:  float


   .. py:attribute:: adjustment_interval
      :type:  int


   .. py:attribute:: alpha_high
      :type:  float


   .. py:attribute:: alpha_low
      :type:  float


   .. py:attribute:: bonds_moving_avg
      :type:  float


   .. py:attribute:: burn
      :type:  float


   .. py:attribute:: commit_reveal_period
      :type:  int


   .. py:attribute:: commit_reveal_weights_enabled
      :type:  bool


   .. py:attribute:: difficulty
      :type:  float


   .. py:attribute:: immunity_period
      :type:  int


   .. py:attribute:: kappa
      :type:  float


   .. py:attribute:: liquid_alpha_enabled
      :type:  bool


   .. py:attribute:: max_burn
      :type:  float


   .. py:attribute:: max_difficulty
      :type:  float


   .. py:attribute:: max_regs_per_block
      :type:  int


   .. py:attribute:: max_validators
      :type:  int


   .. py:attribute:: max_weights_limit
      :type:  float


   .. py:attribute:: min_allowed_weights
      :type:  float


   .. py:attribute:: min_burn
      :type:  float


   .. py:attribute:: min_difficulty
      :type:  float


   .. py:attribute:: pow_registration_allowed
      :type:  bool


   .. py:attribute:: registration_allowed
      :type:  bool


   .. py:attribute:: rho
      :type:  int


   .. py:attribute:: serving_rate_limit
      :type:  int


   .. py:attribute:: target_regs_per_interval
      :type:  int


   .. py:attribute:: tempo
      :type:  int


   .. py:attribute:: weights_rate_limit
      :type:  int


   .. py:attribute:: weights_version
      :type:  int


.. py:class:: MetagraphInfoPool

   Pool presented in tao values.


   .. py:attribute:: alpha_in
      :type:  float


   .. py:attribute:: alpha_out
      :type:  float


   .. py:attribute:: moving_price
      :type:  float


   .. py:attribute:: subnet_volume
      :type:  float


   .. py:attribute:: tao_in
      :type:  float


.. py:data:: SELECTIVE_METAGRAPH_COMMITMENTS_OFFSET
   :value: 14


.. py:class:: SelectiveMetagraphIndex

   Bases: :py:obj:`enum.Enum`


   Create a collection of name/value pairs.

   Example enumeration:

   >>> class Color(Enum):
   ...     RED = 1
   ...     BLUE = 2
   ...     GREEN = 3

   Access them by:

   - attribute access:

     >>> Color.RED
     <Color.RED: 1>

   - value lookup:

     >>> Color(1)
     <Color.RED: 1>

   - name lookup:

     >>> Color['RED']
     <Color.RED: 1>

   Enumerations can be iterated over, and know how many members they have:

   >>> len(Color)
   3

   >>> list(Color)
   [<Color.RED: 1>, <Color.BLUE: 2>, <Color.GREEN: 3>]

   Methods can be added to enumerations, and members can have their own
   attributes -- see the documentation for details.


   .. py:attribute:: Active
      :value: 56



   .. py:attribute:: ActivityCutoff
      :value: 28



   .. py:attribute:: AdjustmentAlpha
      :value: 41



   .. py:attribute:: AdjustmentInterval
      :value: 42



   .. py:attribute:: AlphaDividendsPerHotkey
      :value: 71



   .. py:attribute:: AlphaHigh
      :value: 49



   .. py:attribute:: AlphaIn
      :value: 12



   .. py:attribute:: AlphaInEmission
      :value: 16



   .. py:attribute:: AlphaLow
      :value: 50



   .. py:attribute:: AlphaOut
      :value: 13



   .. py:attribute:: AlphaOutEmission
      :value: 15



   .. py:attribute:: AlphaStake
      :value: 67



   .. py:attribute:: Axons
      :value: 55



   .. py:attribute:: Block
      :value: 7



   .. py:attribute:: BlockAtRegistration
      :value: 66



   .. py:attribute:: BlocksSinceLastStep
      :value: 10



   .. py:attribute:: BondsMovingAvg
      :value: 51



   .. py:attribute:: Burn
      :value: 32



   .. py:attribute:: Coldkeys
      :value: 53



   .. py:attribute:: CommitRevealPeriod
      :value: 47



   .. py:attribute:: CommitRevealWeightsEnabled
      :value: 46



   .. py:attribute:: Commitments
      :value: 73



   .. py:attribute:: Consensus
      :value: 63



   .. py:attribute:: Difficulty
      :value: 33



   .. py:attribute:: Dividends
      :value: 61



   .. py:attribute:: Emission
      :value: 60



   .. py:attribute:: Hotkeys
      :value: 52



   .. py:attribute:: Identities
      :value: 54



   .. py:attribute:: Identity
      :value: 3



   .. py:attribute:: ImmunityPeriod
      :value: 36



   .. py:attribute:: Incentives
      :value: 62



   .. py:attribute:: Kappa
      :value: 23



   .. py:attribute:: LastStep
      :value: 9



   .. py:attribute:: LastUpdate
      :value: 59



   .. py:attribute:: LiquidAlphaEnabled
      :value: 48



   .. py:attribute:: MaxBurn
      :value: 40



   .. py:attribute:: MaxDifficulty
      :value: 38



   .. py:attribute:: MaxRegsPerBlock
      :value: 44



   .. py:attribute:: MaxUids
      :value: 31



   .. py:attribute:: MaxValidators
      :value: 29



   .. py:attribute:: MaxWeightsLimit
      :value: 25



   .. py:attribute:: MinAllowedWeights
      :value: 24



   .. py:attribute:: MinBurn
      :value: 39



   .. py:attribute:: MinDifficulty
      :value: 37



   .. py:attribute:: MovingPrice
      :value: 21



   .. py:attribute:: Name
      :value: 1



   .. py:attribute:: Netuid
      :value: 0



   .. py:attribute:: NetworkRegisteredAt
      :value: 4



   .. py:attribute:: NumUids
      :value: 30



   .. py:attribute:: OwnerColdkey
      :value: 6



   .. py:attribute:: OwnerHotkey
      :value: 5



   .. py:attribute:: PendingAlphaEmission
      :value: 18



   .. py:attribute:: PendingRootEmission
      :value: 19



   .. py:attribute:: PowRegistrationAllowed
      :value: 35



   .. py:attribute:: PruningScore
      :value: 58



   .. py:attribute:: Rank
      :value: 65



   .. py:attribute:: RegistrationAllowed
      :value: 34



   .. py:attribute:: Rho
      :value: 22



   .. py:attribute:: ServingRateLimit
      :value: 45



   .. py:attribute:: SubnetEmission
      :value: 11



   .. py:attribute:: SubnetVolume
      :value: 20



   .. py:attribute:: Symbol
      :value: 2



   .. py:attribute:: TaoDividendsPerHotkey
      :value: 70



   .. py:attribute:: TaoIn
      :value: 14



   .. py:attribute:: TaoInEmission
      :value: 17



   .. py:attribute:: TaoStake
      :value: 68



   .. py:attribute:: TargetRegsPerInterval
      :value: 43



   .. py:attribute:: Tempo
      :value: 8



   .. py:attribute:: TotalStake
      :value: 69



   .. py:attribute:: Trust
      :value: 64



   .. py:attribute:: ValidatorPermit
      :value: 57



   .. py:attribute:: Validators
      :value: 72



   .. py:attribute:: WeightsRateLimit
      :value: 27



   .. py:attribute:: WeightsVersion
      :value: 26



   .. py:method:: all_indices()
      :staticmethod:



.. py:function:: get_selective_metagraph_commitments(decoded)

   Returns a tuple of hotkeys and commitments from decoded chain data if provided, else None.


.. py:function:: process_nested(data, chr_transform)

   Processes nested data structures by applying a transformation function to their elements.


