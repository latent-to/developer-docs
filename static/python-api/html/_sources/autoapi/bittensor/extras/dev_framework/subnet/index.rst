bittensor.extras.dev_framework.subnet
=====================================

.. py:module:: bittensor.extras.dev_framework.subnet


Attributes
----------

.. autoapisummary::

   bittensor.extras.dev_framework.subnet.NETUID


Classes
-------

.. autoapisummary::

   bittensor.extras.dev_framework.subnet.CALL_RECORD
   bittensor.extras.dev_framework.subnet.TestSubnet


Module Contents
---------------

.. py:class:: CALL_RECORD

   Bases: :py:obj:`tuple`


   .. py:attribute:: idx


   .. py:attribute:: operation


   .. py:attribute:: response


.. py:data:: NETUID
   :value: 'SN_NETUID'


.. py:class:: TestSubnet(subtensor, netuid = None, period = DEFAULT_PERIOD, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)

   Class for managing test subnet operations.


   .. py:method:: async_execute_one(step)
      :async:


      Executes one step asynchronously.



   .. py:method:: async_execute_steps(steps)
      :async:


      Executes a multiple steps asynchronously.



   .. py:method:: async_set_hyperparameter(sudo_or_owner_wallet, call_function, call_module, call_params, sudo_call = False, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)
      :async:


      Set hyperparameter for the chain or subnet.



   .. py:method:: async_wait_next_epoch(netuid = None)
      :async:


      Async wait until the next epoch first block is reached.



   .. py:property:: calls
      :type: list[CALL_RECORD]



   .. py:method:: execute_one(step)

      Executes one step synchronously.



   .. py:method:: execute_steps(steps)

      Executes a multiple steps synchronously.



   .. py:property:: netuid
      :type: int



   .. py:property:: owner
      :type: bittensor_wallet.Wallet



   .. py:attribute:: period
      :value: 128



   .. py:attribute:: raise_error
      :value: False



   .. py:attribute:: s
      :type:  bittensor.extras.SubtensorApi


   .. py:method:: set_hyperparameter(sudo_or_owner_wallet, call_function, call_module, call_params, sudo_call = False, period = None, raise_error = False, wait_for_inclusion = True, wait_for_finalization = True)

      Set hyperparameter for the chain or subnet.



   .. py:attribute:: wait_for_finalization
      :value: True



   .. py:attribute:: wait_for_inclusion
      :value: True



   .. py:method:: wait_next_epoch(netuid = None)

      Sync wait until the next epoch first block is reached.



