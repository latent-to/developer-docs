bittensor.extras.dev_framework.utils
====================================

.. py:module:: bittensor.extras.dev_framework.utils


Attributes
----------

.. autoapisummary::

   bittensor.extras.dev_framework.utils.ACTIVATE_SUBNET
   bittensor.extras.dev_framework.utils.REGISTER_NEURON
   bittensor.extras.dev_framework.utils.REGISTER_SUBNET
   bittensor.extras.dev_framework.utils.STEPS


Classes
-------

.. autoapisummary::

   bittensor.extras.dev_framework.utils.ActivateSubnet
   bittensor.extras.dev_framework.utils.RegisterNeuron
   bittensor.extras.dev_framework.utils.RegisterSubnet


Functions
---------

.. autoapisummary::

   bittensor.extras.dev_framework.utils.is_instance_namedtuple
   bittensor.extras.dev_framework.utils.split_command


Module Contents
---------------

.. py:data:: ACTIVATE_SUBNET

.. py:class:: ActivateSubnet

   .. py:attribute:: netuid
      :type:  Optional[int]
      :value: None



   .. py:attribute:: wallet
      :type:  bittensor_wallet.Wallet


.. py:data:: REGISTER_NEURON

.. py:data:: REGISTER_SUBNET

.. py:class:: RegisterNeuron

   .. py:attribute:: netuid
      :type:  Optional[int]
      :value: None



   .. py:attribute:: wallet
      :type:  bittensor_wallet.Wallet


.. py:class:: RegisterSubnet

   .. py:attribute:: wallet
      :type:  bittensor_wallet.Wallet


.. py:data:: STEPS

.. py:function:: is_instance_namedtuple(obj)

   Check if the object is an instance of a namedtuple.


.. py:function:: split_command(command)

   Parse command and return four objects (wallet, pallet, sudo, kwargs).


