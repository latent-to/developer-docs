bittensor.core.extrinsics.pallets.balances
==========================================

.. py:module:: bittensor.core.extrinsics.pallets.balances


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.balances.Balances


Module Contents
---------------

.. py:class:: Balances

   Bases: :py:obj:`bittensor.core.extrinsics.pallets.base.CallBuilder`


   Factory class for creating GenericCall objects for Balances pallet functions.

   This class provides methods to create GenericCall instances for all Balances pallet extrinsics.

   Works with both sync (Subtensor) and async (AsyncSubtensor) instances. For async operations, pass an AsyncSubtensor
   instance and await the result.

   .. admonition:: Example

      # Sync usage
      call = Balances(subtensor).transfer_all(dest="5DE..", keep_alive=True)
      response = subtensor.sign_and_send_extrinsic(call=call, ...)
      
      # Async usage
      call = await Balances(subtensor).transfer_all(dest="5DE..", keep_alive=True)
      response = await async_subtensor.sign_and_send_extrinsic(call=call, ...)


   .. py:method:: transfer_all(dest, keep_alive)

      Returns GenericCall instance for Subtensor function Balances.transfer_all.

      :param dest: The destination ss58 address.
      :param keep_alive: A boolean to determine if the transfer_all operation should send all of the funds the account
                         has, causing the sender account to be killed (false), or transfer everything except at least the
                         existential deposit, which will guarantee to keep the sender account alive (true).

      :returns: GenericCall instance.



   .. py:method:: transfer_allow_death(dest, value)

      Returns GenericCall instance for Subtensor function Balances.transfer_allow_death.

      :param dest: The destination ss58 address.
      :param value: The Balance amount in RAO to transfer.

      :returns: GenericCall instance.



   .. py:method:: transfer_keep_alive(dest, value)

      Returns GenericCall instance for Subtensor function Balances.transfer_keep_alive.

      :param dest: The destination ss58 address.
      :param value: The Balance amount in RAO to transfer.

      :returns: GenericCall instance.



