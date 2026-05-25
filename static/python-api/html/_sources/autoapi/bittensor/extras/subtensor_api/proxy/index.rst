bittensor.extras.subtensor_api.proxy
====================================

.. py:module:: bittensor.extras.subtensor_api.proxy


Classes
-------

.. autoapisummary::

   bittensor.extras.subtensor_api.proxy.Proxy


Module Contents
---------------

.. py:class:: Proxy(subtensor)

   Class for managing proxy operations on the Bittensor network.

   This class provides access to all proxy-related operations, including creating and managing both standard and pure
   proxy relationships, handling proxy announcements, and querying proxy data. It works with both synchronous
   `Subtensor` and asynchronous `AsyncSubtensor` instances.

   Proxies enable secure delegation of account permissions by allowing a delegate account to perform certain operations
   on behalf of a real account, with restrictions defined by the proxy type and optional time-lock delays.

   .. admonition:: Notes

      - For comprehensive documentation on proxies, see: <https://docs.learnbittensor.org/keys/proxies>
      - For creating and managing proxies, see: <https://docs.learnbittensor.org/keys/proxies/create-proxy>
      - For pure proxy documentation, see: <https://docs.learnbittensor.org/keys/proxies/pure-proxies>
      - For available proxy types and their permissions, see: <https://docs.learnbittensor.org/keys/proxies#types-of-proxies>


   .. py:attribute:: add_proxy


   .. py:attribute:: announce_proxy


   .. py:attribute:: create_pure_proxy


   .. py:attribute:: get_proxies


   .. py:attribute:: get_proxies_for_real_account


   .. py:attribute:: get_proxy_announcement


   .. py:attribute:: get_proxy_announcements


   .. py:attribute:: get_proxy_constants


   .. py:attribute:: kill_pure_proxy


   .. py:attribute:: poke_deposit


   .. py:attribute:: proxy


   .. py:attribute:: proxy_announced


   .. py:attribute:: reject_proxy_announcement


   .. py:attribute:: remove_proxies


   .. py:attribute:: remove_proxy


   .. py:attribute:: remove_proxy_announcement


