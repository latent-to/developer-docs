bittensor.extras.dev_framework.calls
====================================

.. py:module:: bittensor.extras.dev_framework.calls

.. autoapi-nested-parse::

   This module serves primarily as a reference and auxiliary resource for developers.

   Although any command can be constructed directly within a test without relying on the pre-generated call definitions,
   the provided command lists (divided into sudo and non-sudo categories), together with the pallet reference,
   significantly streamline the creation of accurate, maintainable, and well-structured end-to-end tests.

   In practice, these definitions act as convenient blueprints for composing extrinsic calls and understanding the
   structure of available Subtensor operations.



Submodules
----------

.. toctree::
   :maxdepth: 1

   /autoapi/bittensor/extras/dev_framework/calls/non_sudo_calls/index
   /autoapi/bittensor/extras/dev_framework/calls/pallets/index
   /autoapi/bittensor/extras/dev_framework/calls/sudo_calls/index


Attributes
----------

.. autoapisummary::

   bittensor.extras.dev_framework.calls.HEADER
   bittensor.extras.dev_framework.calls.IMPORT_TEXT


Functions
---------

.. autoapisummary::

   bittensor.extras.dev_framework.calls.recreate_calls_subpackage


Package Contents
----------------

.. py:data:: HEADER
   :value: Multiline-String

   .. raw:: html

      <details><summary>Show Value</summary>

   .. code-block:: python

      """"""
      This file is auto-generated. Do not edit manually.
      
      For developers:
      - Use the function `recreate_calls_subpackage()` to regenerate this file.
      - The command lists are built dynamically from the current Subtensor metadata (`Subtensor.substrate.metadata`).
      - Each command is represented as a `namedtuple` with fields:
          * System arguments: wallet, pallet (and `sudo` for sudo calls).
          * Additional arguments: taken from the extrinsic definition (with type hints for reference).
      - These namedtuples are intended as convenient templates for building commands in tests and end-to-end scenarios.
      
      Note:
          Any manual changes will be overwritten the next time the generator is run.
      """

   .. raw:: html

      </details>



.. py:data:: IMPORT_TEXT
   :value: Multiline-String

   .. raw:: html

      <details><summary>Show Value</summary>

   .. code-block:: python

      """
      """
      
      from collections import namedtuple
      
      
      """

   .. raw:: html

      </details>



.. py:function:: recreate_calls_subpackage(network='local')

   Fetch the list of pallets and their call and save them to the corresponding modules.


