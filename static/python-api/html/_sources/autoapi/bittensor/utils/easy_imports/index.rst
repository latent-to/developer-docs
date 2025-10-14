bittensor.utils.easy_imports
============================

.. py:module:: bittensor.utils.easy_imports

.. autoapi-nested-parse::

   The Bittensor Compatibility Module is designed to ensure seamless integration and functionality with legacy versions of
   the Bittensor framework, specifically up to and including version 7.3.0. This module addresses changes and deprecated
   features in recent versions, allowing users to maintain compatibility with older systems and projects.



Attributes
----------

.. autoapisummary::

   bittensor.utils.easy_imports.async_subtensor
   bittensor.utils.easy_imports.axon
   bittensor.utils.easy_imports.config
   bittensor.utils.easy_imports.dendrite
   bittensor.utils.easy_imports.extrinsics_subpackage
   bittensor.utils.easy_imports.keyfile
   bittensor.utils.easy_imports.metagraph
   bittensor.utils.easy_imports.mock_subpackage
   bittensor.utils.easy_imports.subtensor
   bittensor.utils.easy_imports.synapse
   bittensor.utils.easy_imports.wallet


Functions
---------

.. autoapisummary::

   bittensor.utils.easy_imports.debug
   bittensor.utils.easy_imports.info
   bittensor.utils.easy_imports.trace
   bittensor.utils.easy_imports.warning


Module Contents
---------------

.. py:data:: async_subtensor

.. py:data:: axon

.. py:data:: config

.. py:function:: debug(on = True)

   Enables or disables debug logging.
   :param on: If True, enables debug logging. If False, disables debug logging.
   :type on: bool


.. py:data:: dendrite

.. py:data:: extrinsics_subpackage

.. py:function:: info(on = True)

   Enables or disables info logging.
   :param on: If True, enables info logging. If False, disables info logging and sets default (WARNING) level.
   :type on: bool


.. py:data:: keyfile

.. py:data:: metagraph

.. py:data:: mock_subpackage

.. py:data:: subtensor

.. py:data:: synapse

.. py:function:: trace(on = True)

   Enables or disables trace logging.
   :param on: If True, enables trace logging. If False, disables trace logging.
   :type on: bool


.. py:data:: wallet

.. py:function:: warning(on = True)

   Enables or disables warning logging.
   :param on: If True, enables warning logging. If False, disables warning logging and sets default (WARNING) level.
   :type on: bool


