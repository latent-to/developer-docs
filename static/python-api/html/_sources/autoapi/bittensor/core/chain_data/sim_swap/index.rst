bittensor.core.chain_data.sim_swap
==================================

.. py:module:: bittensor.core.chain_data.sim_swap


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.sim_swap.SimSwapResult


Module Contents
---------------

.. py:class:: SimSwapResult

   Represents the result of a simulated swap operation.

   This class is used to encapsulate the amounts and fees for the  simulated swap process, including both tao and alpha token values.
   It provides a convenient way to manage and interpret the swap results.

   :ivar tao_amount: The amount of tao tokens obtained as the result of the swap.
   :ivar alpha_amount: The amount of alpha tokens obtained as the result of the swap.
   :ivar tao_fee: The fee associated with the tao token portion of the swap.
   :ivar alpha_fee: The fee associated with the alpha token portion of the swap.



   .. py:attribute:: alpha_amount
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: alpha_fee
      :type:  bittensor.utils.balance.Balance


   .. py:method:: from_dict(data, netuid)
      :classmethod:


      Converts a dictionary to a SimSwapResult instance.

      This method acts as a factory to create a SimSwapResult object using the data
      from a dictionary. It parses the specified dictionary, converts values into
      Balance objects, and sets associated units based on parameters and context.

      :param data: A dictionary containing the swap result data. It must include  the keys "tao_amount",  "alpha_amount",
                   "tao_fee", and "alpha_fee" with their respective values.
      :param netuid: A network-specific unit identifier used to set the unit for alpha-related amounts.

      :returns: An instance of SimSwapResult initialized with the parsed  and converted data.
      :rtype: SimSwapResult



   .. py:attribute:: tao_amount
      :type:  bittensor.utils.balance.Balance


   .. py:attribute:: tao_fee
      :type:  bittensor.utils.balance.Balance


