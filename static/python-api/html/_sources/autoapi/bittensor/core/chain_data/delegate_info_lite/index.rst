bittensor.core.chain_data.delegate_info_lite
============================================

.. py:module:: bittensor.core.chain_data.delegate_info_lite


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.delegate_info_lite.DelegateInfoLite


Module Contents
---------------

.. py:class:: DelegateInfoLite

   Bases: :py:obj:`bittensor.core.chain_data.info_base.InfoBase`


   Dataclass for `DelegateLiteInfo`. This is a lighter version of :func:``DelegateInfo``.

   :param delegate_ss58: Hotkey of the delegate for which the information is being fetched.
   :param take: Take of the delegate as a percentage.
   :param nominators: Count of the nominators of the delegate.
   :param owner_ss58: Coldkey of the owner.
   :param registrations: List of subnets that the delegate is registered on.
   :param validator_permits: List of subnets that the delegate is allowed to validate on.
   :param return_per_1000: Return per 1000 TAO, for the delegate over a day.


   .. py:attribute:: delegate_ss58
      :type:  str


   .. py:attribute:: nominators
      :type:  int


   .. py:attribute:: owner_ss58
      :type:  str


   .. py:attribute:: registrations
      :type:  list[int]


   .. py:attribute:: return_per_1000
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: take
      :type:  float


   .. py:attribute:: validator_permits
      :type:  list[int]


