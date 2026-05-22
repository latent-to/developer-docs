bittensor.core.chain_data.weight_commit_info
============================================

.. py:module:: bittensor.core.chain_data.weight_commit_info


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.weight_commit_info.WeightCommitInfo


Module Contents
---------------

.. py:class:: WeightCommitInfo

   Data class representing weight commit information.

   :ivar ss58: The SS58 address of the committer
   :ivar commit_block: The block number of the commitment.
   :ivar commit_hex: The serialized weight commit data as hex string
   :ivar reveal_round: The round number for reveal



   .. py:attribute:: commit_block
      :type:  Optional[int]


   .. py:attribute:: commit_hex
      :type:  str


   .. py:method:: from_vec_u8(data)
      :classmethod:


      Creates a WeightCommitInfo instance

      :param data: Tuple containing ((AccountId,), (commit_data,), round_number)

      :returns: A new instance with the decoded data
      :rtype: WeightCommitInfo

      .. note::

         This method is used when querying a block or block hash where storage functions `CRV3WeightCommitsV2` does
         not exist in Subtensor module.



   .. py:method:: from_vec_u8_v2(data)
      :classmethod:


      # TODO no it does not
      Creates a WeightCommitInfo instance

      :param data: Tuple containing ((AccountId,), (commit_block, ) (commit_data,), round_number)

      :returns: A new instance with the decoded data
      :rtype: WeightCommitInfo



   .. py:attribute:: reveal_round
      :type:  int


   .. py:attribute:: ss58
      :type:  str


