bittensor.core.chain_data.delegate_info
=======================================

.. py:module:: bittensor.core.chain_data.delegate_info


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.delegate_info.DelegateInfo
   bittensor.core.chain_data.delegate_info.DelegateInfoBase
   bittensor.core.chain_data.delegate_info.DelegatedInfo


Module Contents
---------------

.. py:class:: DelegateInfo

   Bases: :py:obj:`DelegateInfoBase`


   Dataclass for delegate information.

   Additional Attributes:
       total_stake (dict[int, Balance]): Total stake of the delegate mapped by netuid.
       nominators (dict[str, dict[int, Balance]]): Mapping of nominator SS58 addresses to their stakes per subnet.


   .. py:attribute:: nominators
      :type:  dict[str, dict[int, bittensor.utils.balance.Balance]]


   .. py:attribute:: total_stake
      :type:  dict[int, bittensor.utils.balance.Balance]


.. py:class:: DelegateInfoBase

   Bases: :py:obj:`bittensor.core.chain_data.info_base.InfoBase`


   Base class containing common delegate information fields.

   :ivar hotkey_ss58: Hotkey of delegate.
   :vartype hotkey_ss58: str
   :ivar owner_ss58: Coldkey of owner.
   :vartype owner_ss58: str
   :ivar take: Take of the delegate as a percentage.
   :vartype take: float
   :ivar validator_permits: List of subnets that the delegate is allowed to validate on.
   :vartype validator_permits: list[int]
   :ivar registrations: List of subnets that the delegate is registered on.
   :vartype registrations: list[int]
   :ivar return_per_1000: Return per 1000 tao of the delegate over a day.
   :vartype return_per_1000: Balance
   :ivar total_daily_return: Total daily return of the delegate.

   :vartype total_daily_return: Balance


   .. py:attribute:: hotkey_ss58
      :type:  str


   .. py:attribute:: owner_ss58
      :type:  str


   .. py:attribute:: registrations
      :type:  list[int]


   .. py:attribute:: return_per_1000
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: take
      :type:  float


   .. py:attribute:: total_daily_return
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: validator_permits
      :type:  list[int]


.. py:class:: DelegatedInfo

   Bases: :py:obj:`DelegateInfoBase`


   Dataclass for delegated information. This class represents a delegate's information
   specific to a particular subnet.

   Additional Attributes:
       netuid (int): Network ID of the subnet.
       stake (Balance): Stake amount for this specific delegation.


   .. py:attribute:: netuid
      :type:  int


   .. py:attribute:: stake
      :type:  bittensor.utils.balance.Balance


