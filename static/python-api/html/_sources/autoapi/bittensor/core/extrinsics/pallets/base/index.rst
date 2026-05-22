bittensor.core.extrinsics.pallets.base
======================================

.. py:module:: bittensor.core.extrinsics.pallets.base


Attributes
----------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.base.Call


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.pallets.base.CallBuilder


Module Contents
---------------

.. py:data:: Call

.. py:class:: CallBuilder

   Base class for creating GenericCall objects for all Subtensor pallet functions.

   This class implements an interface for creating GenericCall objects that can be used with any Subtensor pallet
   function. For async operations, pass an AsyncSubtensor instance and await the result.

   :ivar subtensor: The Subtensor or AsyncSubtensor instance used for call composition.
   :ivar dynamic_function: If True, allows dynamic calls to functions not explicitly defined in the pallet class. When a
   :ivar method is called that doesn't exist in the class, it will be dynamically created as a call to the pallet:
   :ivar function with the same name.:



   .. py:method:: create_composed_call(call_module = None, call_function = None, **kwargs)

      Create a call to the pallet function.

      :param call_module: If not provided, will be determined from the calling class name.
      :param call_function: If not provided, will be determined from the calling method name.
      :param \*\*kwargs: Named parameters that will be passed to the function.

      .. note:: The key in kwargs must always match the parameter name in the subtensor's function.



   .. py:attribute:: dynamic_function
      :type:  bool
      :value: True



   .. py:attribute:: subtensor
      :type:  Union[bittensor.core.subtensor.Subtensor, bittensor.core.async_subtensor.AsyncSubtensor]


