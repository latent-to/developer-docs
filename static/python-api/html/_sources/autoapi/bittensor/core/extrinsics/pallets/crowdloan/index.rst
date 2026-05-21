bittensor.core.extrinsics.pallets.crowdloan
===========================================

.. py:module:: bittensor.core.extrinsics.pallets.crowdloan


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.crowdloan.Crowdloan


Module Contents
---------------

.. py:class:: Crowdloan

   Bases: :py:obj:`bittensor.core.extrinsics.pallets.base.CallBuilder`


   Factory class for creating GenericCall objects for Crowdloan pallet functions.

   This class provides methods to create GenericCall instances for all Crowdloan pallet extrinsics.

   Works with both sync (Subtensor) and async (AsyncSubtensor) instances. For async operations, pass an AsyncSubtensor
   instance and await the result.

   .. admonition:: Example

      # Sync usage
      call = Crowdloan(subtensor).finalize(crowdloan_id=123)
      response = subtensor.sign_and_send_extrinsic(call=call, ...)
      
      # Async usage
      call = await Crowdloan(subtensor).finalize(crowdloan_id=123)
      response = await async_subtensor.sign_and_send_extrinsic(call=call, ...)


   .. py:method:: contribute(crowdloan_id, amount)

      Returns GenericCall instance for Subtensor function Crowdloan.contribute.

      :param crowdloan_id: The unique identifier of the crowdloan to contribute to.
      :param amount: Amount in RAO to contribute.

      :returns: GenericCall instance.



   .. py:method:: create(deposit, min_contribution, cap, end, call = None, target_address = None)

      Returns GenericCall instance for Subtensor function Crowdloan.create.

      :param deposit: Initial deposit in RAO from the creator.
      :param min_contribution: Minimum contribution amount in RAO.
      :param cap: Maximum cap to be raised in RAO.
      :param end: Block number when the campaign ends.
      :param call: Runtime call data (e.g., subtensor::register_leased_network).
      :param target_address: SS58 address to transfer funds to on success.

      :returns: GenericCall instance.



   .. py:method:: dissolve(crowdloan_id)

      Returns GenericCall instance for Subtensor function Crowdloan.dissolve.

      :param crowdloan_id: The unique identifier of the crowdloan to dissolve.

      :returns: GenericCall instance.



   .. py:method:: finalize(crowdloan_id)

      Returns GenericCall instance for Subtensor function Crowdloan.finalize.

      :param crowdloan_id: The unique identifier of the crowdloan to finalize.

      :returns: GenericCall instance.



   .. py:method:: refund(crowdloan_id)

      Returns GenericCall instance for Subtensor function Crowdloan.refund.

      :param crowdloan_id: The unique identifier of the crowdloan to refund.

      :returns: GenericCall instance.



   .. py:method:: update_cap(crowdloan_id, new_cap)

      Returns GenericCall instance for Subtensor function Crowdloan.update_cap.

      :param crowdloan_id: The unique identifier of the crowdloan to update the cap for.
      :param new_cap: New cap to be raised in RAO.

      :returns: GenericCall instance.



   .. py:method:: update_end(crowdloan_id, new_end)

      Returns GenericCall instance for Subtensor function Crowdloan.update_end.

      :param crowdloan_id: The unique identifier of the crowdloan to update the end block number for.
      :param new_end: New end block number.

      :returns: GenericCall instance.



   .. py:method:: update_min_contribution(crowdloan_id, new_min_contribution)

      Returns GenericCall instance for Subtensor function Crowdloan.update_min_contribution.

      :param crowdloan_id: The unique identifier of the crowdloan to update the minimum contribution amount for.
      :param new_min_contribution: New minimum contribution amount in RAO.

      :returns: GenericCall instance.



   .. py:method:: withdraw(crowdloan_id)

      Returns GenericCall instance for Subtensor function Crowdloan.withdraw.

      :param crowdloan_id: The unique identifier of the crowdloan to withdraw from.

      :returns: GenericCall instance.



