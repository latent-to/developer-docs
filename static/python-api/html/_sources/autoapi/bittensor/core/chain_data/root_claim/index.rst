bittensor.core.chain_data.root_claim
====================================

.. py:module:: bittensor.core.chain_data.root_claim


Classes
-------

.. autoapisummary::

   bittensor.core.chain_data.root_claim.KeepSubnetsDescriptor
   bittensor.core.chain_data.root_claim.RootClaimType


Module Contents
---------------

.. py:class:: KeepSubnetsDescriptor

   Descriptor that allows callable syntax for KeepSubnets variant.


   .. py:attribute:: subnets
      :type:  list[int]


   .. py:method:: to_dict()

      Converts the descriptor to the required dictionary format.



.. py:class:: RootClaimType

   Bases: :py:obj:`str`, :py:obj:`enum.Enum`


   Enumeration of root claim types in the Bittensor network.

   This enum defines how coldkeys manage their root alpha emissions:
   - Swap: Swap any alpha emission for TAO
   - Keep: Keep all alpha emission
   - KeepSubnets: Keep alpha emission for specified subnets, swap everything else

   The values match exactly with the RootClaimTypeEnum defined in the Subtensor runtime.

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: Keep
      :value: 'Keep'



   .. py:attribute:: KeepSubnets


   .. py:attribute:: Swap
      :value: 'Swap'



   .. py:method:: normalize(value)
      :classmethod:


      Normalizes a root claim type to a format suitable for Substrate calls.

      This method handles various input formats:
      - String values ("Swap", "Keep") → returns string
      - Enum values (RootClaimType.Swap) → returns string
      - Dict values ({"KeepSubnets": {"subnets": [1, 2, 3]}}) → returns dict as-is
      - Callable KeepSubnets([1, 2, 3]) → returns dict

      :param value: The root claim type in any supported format.

      :returns: Normalized value - string for Swap/Keep or dict for KeepSubnets.

      :raises ValueError: If the value is not a valid root claim type or KeepSubnets has no subnets.
      :raises TypeError: If the value type is not supported.



