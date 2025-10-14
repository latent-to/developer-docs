bittensor.core.chain_data.prometheus_info
=========================================

.. py:module:: bittensor.core.chain_data.prometheus_info


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.prometheus_info.PrometheusInfo


Module Contents
---------------

.. py:class:: PrometheusInfo

   Bases: :py:obj:`bittensor.core.chain_data.info_base.InfoBase`


   Dataclass representing information related to Prometheus.

   :ivar block: The block number associated with the Prometheus data.
   :vartype block: int
   :ivar version: The version of the Prometheus data.
   :vartype version: int
   :ivar ip: The IP address associated with Prometheus.
   :vartype ip: str
   :ivar port: The port number for Prometheus.
   :vartype port: int
   :ivar ip_type: The type of IP address (e.g., IPv4, IPv6).

   :vartype ip_type: int


   .. py:attribute:: block
      :type:  int


   .. py:attribute:: ip
      :type:  str


   .. py:attribute:: ip_type
      :type:  int


   .. py:attribute:: port
      :type:  int


   .. py:attribute:: version
      :type:  int


