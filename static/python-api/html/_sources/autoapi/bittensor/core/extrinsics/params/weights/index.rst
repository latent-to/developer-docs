bittensor.core.extrinsics.params.weights
========================================

.. py:module:: bittensor.core.extrinsics.params.weights


Classes
-------

.. autoapisummary::

   bittensor.core.extrinsics.params.weights.WeightsParams


Module Contents
---------------

.. py:class:: WeightsParams

   .. py:method:: commit_mechanism_weights(netuid, mechid, commit_hash)
      :classmethod:


      Returns the parameters for the `commit_mechanism_weights`.



   .. py:method:: commit_timelocked_mechanism_weights(netuid, mechid, commit_for_reveal, reveal_round, commit_reveal_version)
      :classmethod:


      Returns the parameters for the `commit_timelocked_mechanism_weights`.



   .. py:method:: reveal_mechanism_weights(netuid, mechid, uids, weights, salt, version_key)
      :classmethod:


      Returns the parameters for the `reveal_mechanism_weights`.



   .. py:method:: set_mechanism_weights(netuid, mechid, uids, weights, version_key)
      :classmethod:


      Returns the parameters for the `set_mechanism_weights`.



