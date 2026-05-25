bittensor.utils.registration.torch_utils
========================================

.. py:module:: bittensor.utils.registration.torch_utils

.. autoapi-nested-parse::

   Torch compatibility utilities for Bittensor.



Attributes
----------

.. autoapisummary::

   bittensor.utils.registration.torch_utils.torch


Classes
-------

.. autoapisummary::

   bittensor.utils.registration.torch_utils.LazyLoadedTorch


Functions
---------

.. autoapisummary::

   bittensor.utils.registration.torch_utils.legacy_torch_api_compat
   bittensor.utils.registration.torch_utils.log_no_torch_error
   bittensor.utils.registration.torch_utils.use_torch


Module Contents
---------------

.. py:class:: LazyLoadedTorch

   A lazy-loading proxy for the torch module.


.. py:function:: legacy_torch_api_compat(func)

   Convert function operating on numpy Input&Output to legacy torch Input&Output API if `use_torch()` is True.

   :param func: Function with numpy Input/Output to be decorated.

   :returns: Decorated function.
   :rtype: decorated


.. py:function:: log_no_torch_error()

.. py:data:: torch

.. py:function:: use_torch()

   Force the use of torch over numpy for certain operations.


