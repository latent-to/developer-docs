bittensor.utils.weight_utils
============================

.. py:module:: bittensor.utils.weight_utils

.. autoapi-nested-parse::

   Conversion for weight between chain representation and np.array or torch.Tensor



Attributes
----------

.. autoapisummary::

   bittensor.utils.weight_utils.U16_MAX
   bittensor.utils.weight_utils.U32_MAX


Functions
---------

.. autoapisummary::

   bittensor.utils.weight_utils.convert_and_normalize_weights_and_uids
   bittensor.utils.weight_utils.convert_bond_uids_and_vals_to_tensor
   bittensor.utils.weight_utils.convert_maybe_split_to_u16
   bittensor.utils.weight_utils.convert_root_weight_uids_and_vals_to_tensor
   bittensor.utils.weight_utils.convert_uids_and_weights
   bittensor.utils.weight_utils.convert_weight_uids_and_vals_to_tensor
   bittensor.utils.weight_utils.convert_weights_and_uids_for_emit
   bittensor.utils.weight_utils.generate_weight_hash
   bittensor.utils.weight_utils.normalize_max_weight
   bittensor.utils.weight_utils.process_weights
   bittensor.utils.weight_utils.process_weights_for_netuid


Module Contents
---------------

.. py:data:: U16_MAX
   :value: 65535


.. py:data:: U32_MAX
   :value: 4294967295


.. py:function:: convert_and_normalize_weights_and_uids(uids, weights)

   Converts weights and uids to numpy arrays if they are not already.

   :param uids: The ``uint64`` uids of destination neurons.
   :param weights: The weights to set. These must be ``float`` s and correspond to the passed ``uid`` s.

   :returns: Bytes converted weights and uids
   :rtype: weight_uids, weight_vals


.. py:function:: convert_bond_uids_and_vals_to_tensor(n, uids, bonds)

   Converts bond and uids from chain representation into a np.array.

   :param n: number of neurons on network.
   :param uids: Tensor of uids as destinations for passed bonds.
   :param bonds: Tensor of bonds.

   :returns: Converted row bonds.


.. py:function:: convert_maybe_split_to_u16(maybe_split)

.. py:function:: convert_root_weight_uids_and_vals_to_tensor(n, uids, weights, subnets)

   Converts root weights and uids from chain representation into a np.array or torch FloatTensor
   (inverse operation from convert_weights_and_uids_for_emit)

   :param n: number of neurons on network.
   :param uids: Tensor of uids as destinations for passed weights.
   :param weights: Tensor of weights.
   :param subnets: list of subnets on the network.

   :returns: Converted row weights.


.. py:function:: convert_uids_and_weights(uids, weights)

   Converts netuids and weights to numpy arrays if they are not already.

   :param uids: The uint64 uids of destination neurons.
   :param weights: The weights to set. These must be floated.

   :returns: Bytes converted netuids and weights.
   :rtype: tuple[ndarray, ndarray]


.. py:function:: convert_weight_uids_and_vals_to_tensor(n, uids, weights)

   Converts weights and uids from chain representation into a np.array (inverse operation from
   convert_weights_and_uids_for_emit).

   :param n: number of neurons on network.
   :param uids: Tensor of uids as destinations for passed weights.
   :param weights: Tensor of weights.

   :returns: Converted row weights.


.. py:function:: convert_weights_and_uids_for_emit(uids, weights)

   Converts weights into integer u32 representation that sum to MAX_INT_WEIGHT.

   :param uids: Tensor of uids as destinations for passed weights.
   :param weights: Tensor of weights.

   :returns: Uids as a list.
             weight_vals: Weights as a list.
   :rtype: weight_uids


.. py:function:: generate_weight_hash(address, netuid, uids, values, version_key, salt)

   Generate a valid commit hash from the provided weights.

   :param address: The account identifier. Wallet ss58_address.
   :param netuid: The subnet unique identifier.
   :param uids: The list of UIDs.
   :param salt: The salt to add to hash.
   :param values: The list of weight values.
   :param version_key: The version key.

   :returns: The generated commit hash.
   :rtype: str


.. py:function:: normalize_max_weight(x, limit = 0.1)

   Normalizes the tensor x so that sum(x) = 1 and the max value is not greater than the limit.

   :param x: Tensor to be max_value normalized.
   :param limit: float: Max value after normalization.

   :returns: Normalized x tensor.
   :rtype: y


.. py:function:: process_weights(uids, weights, num_neurons, min_allowed_weights, max_weight_limit, exclude_quantile = 0)

   Processes weight tensors for a given weights and UID arrays and hyperparams, applying constraints and normalization
   based on the subtensor and metagraph data. This function can handle both NumPy arrays and PyTorch tensors.

   :param uids: Array of unique identifiers of the neurons.
   :param weights: Array of weights associated with the user IDs.
   :param num_neurons: The number of neurons in the network.
   :param min_allowed_weights: Subnet hyperparam Minimum number of allowed weights.
   :param max_weight_limit: Subnet hyperparam Maximum weight limit.
   :param exclude_quantile: Quantile threshold for excluding lower weights.

   :returns: Tuple containing the array of user IDs and the corresponding normalized weights. The data type of the return
             matches the type of the input weights (NumPy or PyTorch).


.. py:function:: process_weights_for_netuid(uids, weights, netuid, subtensor, metagraph = None, exclude_quantile = 0)

   Processes weight tensors for a given subnet id using the provided weight and UID arrays, applying constraints and
   normalization based on the subtensor and metagraph data. This function can handle both NumPy arrays and PyTorch
   tensors.

   :param uids: Array of unique identifiers of the neurons.
   :param weights: Array of weights associated with the user IDs.
   :param netuid: The network uid to process weights for.
   :param subtensor: Subtensor instance to access blockchain data.
   :param metagraph: Metagraph instance for additional network data. If None, it is fetched from the subtensor using the
                     netuid.
   :param exclude_quantile: Quantile threshold for excluding lower weights.

   :returns: Tuple containing the array of user IDs and the corresponding normalized weights. The data type of the return
             matches the type of the input weights (NumPy or PyTorch).


