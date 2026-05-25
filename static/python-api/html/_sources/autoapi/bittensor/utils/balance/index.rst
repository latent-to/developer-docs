bittensor.utils.balance
=======================

.. py:module:: bittensor.utils.balance


Classes
-------

.. autoapisummary::

   bittensor.utils.balance.Balance


Functions
---------

.. autoapisummary::

   bittensor.utils.balance.check_balance_amount
   bittensor.utils.balance.rao
   bittensor.utils.balance.tao


Module Contents
---------------

.. py:class:: Balance(balance)

   Represents the bittensor balance of the wallet, stored as rao (int).

   This class provides a way to interact with balances in two different units: rao and tao. It provides methods to
   convert between these units, as well as to perform arithmetic and comparison operations.

   :ivar unit: A string representing the symbol for the tao unit.
   :vartype unit: str
   :ivar rao_unit: A string representing the symbol for the rao unit.
   :vartype rao_unit: str
   :ivar rao: An integer that stores the balance in rao units.
   :vartype rao: int
   :ivar tao: A float property that gives the balance in tao units.

   :vartype tao: float

   .. note::

      To ensure arithmetic operations between `Balance` instances work correctly, they must set the same unit for each
      using the `netuid`.

   .. admonition:: Examples

      balance_wallet_default = Balance.from_tao(10, netuid=14)
      balance_wallet_secret = Balance.from_tao(2, netuid=14)
      total_balance = balance_wallet_default + balance_wallet_secret
      
      # or
      
      balance_wallet_default = Balance.from_tao(10).set_unit(netuid=14)
      balance_wallet_secret = Balance.from_tao(2).set_unit(netuid=14)
      total_balance = balance_wallet_default + balance_wallet_secret
      
      The `from_tao()` and `from_rao()` methods accept the `netuid` parameter to set the appropriate unit symbol.

   .. note::

      When performing arithmetic or comparison operations where the first operand is a `Balance` instance and the
      second operand is not, the second operand is implicitly interpreted as a raw amount in `rao`, using the same
      unit (netuid) as the first operand. This allows interoperability with integer or float values, but may result in
      unexpected behavior if the caller assumes the second operand is in `tao`.

   .. admonition:: Example

      balance = Balance.from_tao(10, netuid=14)
      result = balance + 5000  # 5 will be treated as 5000 rao, not 5 tao
      print(result)
      output: τ10.000005000

   Initialize a Balance object. If balance is an int, it's assumed to be in rao.
   If balance is a float, it's assumed to be in tao.

   :param The initial balance:
   :type The initial balance: if an int) or tao (if a float
   :param in either rao:
   :type in either rao: if an int) or tao (if a float


   .. py:method:: from_float(amount, netuid = 0)
      :staticmethod:


      Given tao, return :func:`Balance` object with rao(``int``) and tao(``float``), where rao = int(tao*pow(10,9))

      :param amount: The amount in tao.
      :param netuid: The subnet uid for set currency unit.

      :returns: A Balance object representing the given amount.



   .. py:method:: from_rao(amount, netuid = 0)
      :staticmethod:


      Given rao, return Balance object with rao(``int``) and tao(``float``), where rao = int(tao*pow(10,9))

      :param amount: The amount in rao.
      :param netuid: The subnet uid for set currency unit.

      :returns: A Balance object representing the given amount.



   .. py:method:: from_tao(amount, netuid = 0)
      :staticmethod:


      Given tao, return Balance object with rao(``int``) and tao(``float``), where rao = int(tao*pow(10,9))

      :param amount: The amount in tao.
      :param netuid: The subnet uid for set currency unit.

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


.. py:function:: check_balance_amount(amount, allow_none = True)

   Validate that the provided value is a Balance instance.

   This function ensures that the `amount` argument is a `Balance` object.  If a non-Balance type is passed, it raises
   a `BalanceTypeError` to enforce consistent usage of Balance objects across arithmetic operations.

   :param amount: The value to validate.
   :param allow_none: if False then a `BalanceTypeError` is raised if the value is None.

   :returns: Always returns None if validation passes.
   :rtype: None

   :raises BalanceTypeError: If amount is not a Balance instance and not None.


.. py:function:: rao(amount, netuid = 0)

   Helper function to create a Balance object from an int (Rao)


.. py:function:: tao(amount, netuid = 0)

   Helper function to create a Balance object from a float (Tao)


