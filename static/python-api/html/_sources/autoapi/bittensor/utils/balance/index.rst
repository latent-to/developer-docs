bittensor.utils.balance
=======================

.. py:module:: bittensor.utils.balance


Classes
-------

.. autoapisummary::

   bittensor.utils.balance.Balance
   bittensor.utils.balance.FixedPoint


Functions
---------

.. autoapisummary::

   bittensor.utils.balance.check_and_convert_to_balance
   bittensor.utils.balance.fixed_to_float
   bittensor.utils.balance.rao
   bittensor.utils.balance.tao


Module Contents
---------------

.. py:class:: Balance(balance)

   Represents the bittensor balance of the wallet, stored as rao (int).
   This class provides a way to interact with balances in two different units: rao and tao.
   It provides methods to convert between these units, as well as to perform arithmetic and comparison operations.

   :ivar unit: A string representing the symbol for the tao unit.
   :vartype unit: str
   :ivar rao_unit: A string representing the symbol for the rao unit.
   :vartype rao_unit: str
   :ivar rao: An integer that stores the balance in rao units.
   :vartype rao: int
   :ivar tao: A float property that gives the balance in tao units.

   :vartype tao: float

   Initialize a Balance object. If balance is an int, it's assumed to be in rao.
   If balance is a float, it's assumed to be in tao.

   :param balance: The initial balance, in either rao (if an int) or tao (if a float).


   .. py:method:: from_float(amount, netuid = 0)
      :staticmethod:


      Given tao, return :func:`Balance` object with rao(``int``) and tao(``float``), where rao = int(tao*pow(10,9))
      :param amount: The amount in tao.
      :type amount: float
      :param netuid: The subnet uid for set currency unit. Defaults to `0`.
      :type netuid: int

      :returns: A Balance object representing the given amount.



   .. py:method:: from_rao(amount, netuid = 0)
      :staticmethod:


      Given rao, return Balance object with rao(``int``) and tao(``float``), where rao = int(tao*pow(10,9))

      :param amount: The amount in rao.
      :type amount: int
      :param netuid: The subnet uid for set currency unit. Defaults to `0`.
      :type netuid: int

      :returns: A Balance object representing the given amount.



   .. py:method:: from_tao(amount, netuid = 0)
      :staticmethod:


      Given tao, return Balance object with rao(``int``) and tao(``float``), where rao = int(tao*pow(10,9))

      :param amount: The amount in tao.
      :type amount: float
      :param netuid: The subnet uid for set currency unit. Defaults to `0`.
      :type netuid: int

      :returns: A Balance object representing the given amount.



   .. py:method:: get_unit(netuid)
      :staticmethod:



   .. py:attribute:: netuid
      :type:  int
      :value: 0



   .. py:attribute:: rao
      :type:  int


   .. py:attribute:: rao_unit
      :type:  str


   .. py:method:: set_unit(netuid)


   .. py:property:: tao


   .. py:attribute:: unit
      :type:  str


.. py:class:: FixedPoint

   Bases: :py:obj:`TypedDict`


   Represents a fixed point ``U64F64`` number.
   Where ``bits`` is a U128 representation of the fixed point number.

   This matches the type of the Alpha shares.

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: bits
      :type:  int


.. py:function:: check_and_convert_to_balance(amount)

   Helper function to check and convert the amount type to a Balance object.
   This is used to support backwards compatibility while also providing a deprecation notice.


.. py:function:: fixed_to_float(fixed, frac_bits = 64, total_bits = 128)

.. py:function:: rao(amount, netuid = 0)

   Helper function to create a Balance object from an int (Rao)


.. py:function:: tao(amount, netuid = 0)

   Helper function to create a Balance object from a float (Tao)


