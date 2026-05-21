bittensor.core.chain_data.ip_info
=================================

.. py:module:: bittensor.core.chain_data.ip_info


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.ip_info.IPInfo


Module Contents
---------------

.. py:class:: IPInfo

   Dataclass representing IP information.

   :ivar ip: The IP address as a string.
   :ivar ip_type: The type of the IP address (e.g., IPv4, IPv6).
   :ivar protocol: The protocol associated with the IP (e.g., TCP, UDP).



   .. py:method:: encode()

      Returns a dictionary of the IPInfo object that can be encoded.



   .. py:method:: from_parameter_dict(parameter_dict)
      :classmethod:


      Creates a IPInfo instance from a parameter dictionary.



   .. py:attribute:: ip
      :type:  str


   .. py:attribute:: ip_type
      :type:  int


   .. py:attribute:: protocol
      :type:  int


   .. py:method:: to_parameter_dict()

      Returns a torch tensor or dict of the subnet IP info.



