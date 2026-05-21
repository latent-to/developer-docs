bittensor.core.config
=====================

.. py:module:: bittensor.core.config

.. autoapi-nested-parse::

   Implementation of the config class, which manages the configuration of different Bittensor modules.

   .. admonition:: Example

      import argparse
      import bittensor as bt
      
      parser = argparse.ArgumentParser('Miner')
      bt.Axon.add_args(parser)
      bt.Subtensor.add_args(parser)
      bt.Async_subtensor.add_args(parser)
      bt.Wallet.add_args(parser)
      bt.logging.add_args(parser)
      bt.PriorityThreadPoolExecutor.add_args(parser)
      config = bt.config(parser)
      
      print(config)



Exceptions
----------

.. autoapisummary::

   bittensor.core.config.InvalidConfigFile


Classes
-------

.. autoapisummary::

   bittensor.core.config.Config
   bittensor.core.config.DefaultMunch


Module Contents
---------------

.. py:class:: Config(parser = None, args = None, strict = False, default = DEFAULTS)

   Bases: :py:obj:`DefaultMunch`


   Manages configuration for Bittensor modules with nested namespace support.

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:method:: is_set(param_name)

      Checks if a parameter was explicitly set.



   .. py:method:: merge(other)

      Merges another Config into this one.



   .. py:method:: to_dict()

      Returns the configuration as a dictionary.



.. py:class:: DefaultMunch(default=None, *args, **kwargs)

   Bases: :py:obj:`dict`


   Dict with attribute-style access and a configurable default value.

   Drop-in replacement for munch.DefaultMunch using only the stdlib.
   The default value (returned for missing keys) is stored on the instance
   via ``object.__setattr__`` so it never collides with dict entries.

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:method:: fromDict(d, _default=None)
      :classmethod:


      Recursively creates a DefaultMunch from a plain dict.



   .. py:method:: toDict()

      Recursively converts this object to a plain dict.



.. py:exception:: InvalidConfigFile

   Bases: :py:obj:`Exception`


   Raised when there's an error loading the config file.

   Initialize self.  See help(type(self)) for accurate signature.


