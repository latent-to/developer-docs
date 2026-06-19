bittensor.core.extrinsics.pallets.sudo
======================================

.. py:module:: bittensor.core.extrinsics.pallets.sudo


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.sudo.Sudo


Module Contents
---------------

.. py:class:: Sudo

   Bases: :py:obj:`bittensor.core.extrinsics.pallets.base.CallBuilder`


   Factory class for creating GenericCall objects for Sudo pallet functions.

   This class provides methods to create GenericCall instances for all Sudo pallet extrinsics.

   Works with both sync (Subtensor) and async (AsyncSubtensor) instances. For async operations, pass an AsyncSubtensor
   instance and await the result.

   .. admonition:: Example

      # Nested sync calls (e.g., with Sudo)
      inner_call = SubtensorModule(subtensor).set_pending_childkey_cooldown(cooldown=100)
      sudo_call = Sudo(subtensor).sudo(call=inner_call)
      response = subtensor.sign_and_send_extrinsic(call=sudo_call, ...)
      
      # Nested async calls (e.g., with Sudo)
      inner_call = await SubtensorModule(subtensor).set_pending_childkey_cooldown(cooldown=100)
      sudo_call = await Sudo(subtensor).sudo(call=inner_call)
      response = subtensor.sign_and_send_extrinsic(call=sudo_call, ...)


   .. py:method:: sudo(call)

      Returns GenericCall instance for Subtensor function Sudo.sudo.

      :param call: The call to be executed as sudo.

      :returns: GenericCall instance.



