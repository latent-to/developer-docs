bittensor.core.extrinsics.params.transfer
=========================================

.. py:module:: bittensor.core.extrinsics.params.transfer


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.params.transfer.TransferParams


Functions
---------

.. autoapisummary::

   bittensor.core.extrinsics.params.transfer.get_transfer_fn_params


Module Contents
---------------

.. py:class:: TransferParams

   .. py:method:: transfer_all(destination, amount = None, keep_alive = True)
      :classmethod:


      Returns the parameters for the `transfer_all`.



   .. py:method:: transfer_allow_death(destination, amount = None, keep_alive = True)
      :classmethod:


      Returns the parameters for the `transfer_allow_death`.



   .. py:method:: transfer_keep_alive(destination, amount = None, keep_alive = True)
      :classmethod:


      Returns the parameters for the `transfer_keep_alive`.



.. py:function:: get_transfer_fn_params(amount, destination_ss58, keep_alive)

   Helper function to get the transfer call function and call params, depending on the value and keep_alive flag
   provided.

   :param amount: the amount of Tao to transfer. `None` if transferring all.
   :param destination_ss58: the destination SS58 of the transfer
   :param keep_alive: whether to enforce a retention of the existential deposit in the account after transfer.

   :returns: tuple[call function, call params]


