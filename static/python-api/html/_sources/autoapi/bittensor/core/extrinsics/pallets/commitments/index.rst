bittensor.core.extrinsics.pallets.commitments
=============================================

.. py:module:: bittensor.core.extrinsics.pallets.commitments


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.commitments.Commitments


Module Contents
---------------

.. py:class:: Commitments

   Bases: :py:obj:`bittensor.core.extrinsics.pallets.base.CallBuilder`


   Factory class for creating GenericCall objects for Commitments pallet functions.

   This class provides methods to create GenericCall instances for Commitments pallet extrinsics.

   Works with both sync (Subtensor) and async (AsyncSubtensor) instances. For async operations, pass an AsyncSubtensor
   instance and await the result.

   .. admonition:: Example

      # Sync usage
      call = Commitments(subtensor).set_commitment(netuid=14, ...)
      response = subtensor.sign_and_send_extrinsic(call=call, ...)
      
      # Async usage
      call = await Commitments(async_subtensor).set_commitment(netuid=14, ...)
      response = await async_subtensor.sign_and_send_extrinsic(call=call, ...)


   .. py:method:: set_commitment(netuid, info)

      Returns GenericCall instance for Subtensor function Commitments.set_commitment.

      :param netuid: The netuid of the subnet to set commitment for.
      :param info: Dictionary of info fields to set.

      :returns: GenericCall instance.



