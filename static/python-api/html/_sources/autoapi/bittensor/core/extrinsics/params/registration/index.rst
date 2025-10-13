bittensor.core.extrinsics.params.registration
=============================================

.. py:module:: bittensor.core.extrinsics.params.registration


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.params.registration.RegistrationParams


Module Contents
---------------

.. py:class:: RegistrationParams

   .. py:method:: burned_register(netuid, hotkey_ss58)
      :classmethod:


      Returns the parameters for the `burned_register`.



   .. py:method:: register(netuid, coldkey_ss58, hotkey_ss58, block_number, nonce, work)
      :classmethod:


      Returns the parameters for the `register`.



   .. py:method:: register_network(hotkey_ss58)
      :classmethod:


      Returns the parameters for the `register_network`.



   .. py:method:: set_subnet_identity(netuid, hotkey_ss58, subnet_name, github_repo, subnet_contact, subnet_url, logo_url, discord, description, additional)
      :classmethod:


      Returns the parameters for the `set_subnet_identity`.



