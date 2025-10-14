bittensor.core.errors
=====================

.. py:module:: bittensor.core.errors


Attributes
----------

.. autoapisummary::

   bittensor.core.errors.BlockNotFound
   bittensor.core.errors.ExtrinsicNotFound
   bittensor.core.errors.StorageFunctionNotFound
   bittensor.core.errors.SubstrateRequestException


Exceptions
----------

.. autoapisummary::

   bittensor.core.errors.BlacklistedException
   bittensor.core.errors.ChainConnectionError
   bittensor.core.errors.ChainError
   bittensor.core.errors.ChainQueryError
   bittensor.core.errors.ChainTransactionError
   bittensor.core.errors.DelegateTakeTooHigh
   bittensor.core.errors.DelegateTakeTooLow
   bittensor.core.errors.DelegateTxRateLimitExceeded
   bittensor.core.errors.DuplicateChild
   bittensor.core.errors.HotKeyAccountNotExists
   bittensor.core.errors.IdentityError
   bittensor.core.errors.InternalServerError
   bittensor.core.errors.InvalidChild
   bittensor.core.errors.InvalidRequestNameError
   bittensor.core.errors.MaxAttemptsException
   bittensor.core.errors.MaxSuccessException
   bittensor.core.errors.MetadataError
   bittensor.core.errors.NominationError
   bittensor.core.errors.NonAssociatedColdKey
   bittensor.core.errors.NotDelegateError
   bittensor.core.errors.NotEnoughStakeToSetChildkeys
   bittensor.core.errors.NotRegisteredError
   bittensor.core.errors.NotVerifiedException
   bittensor.core.errors.PostProcessException
   bittensor.core.errors.PriorityException
   bittensor.core.errors.ProportionOverflow
   bittensor.core.errors.RegistrationError
   bittensor.core.errors.RegistrationNotPermittedOnRootSubnet
   bittensor.core.errors.RunException
   bittensor.core.errors.StakeError
   bittensor.core.errors.SubnetNotExists
   bittensor.core.errors.SynapseDendriteNoneException
   bittensor.core.errors.SynapseException
   bittensor.core.errors.SynapseParsingError
   bittensor.core.errors.TakeError
   bittensor.core.errors.TooManyChildren
   bittensor.core.errors.TransferError
   bittensor.core.errors.TxRateLimitExceeded
   bittensor.core.errors.UnknownSynapseError
   bittensor.core.errors.UnstakeError


Module Contents
---------------

.. py:exception:: BlacklistedException(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the request is blacklisted.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:data:: BlockNotFound

.. py:exception:: ChainConnectionError

   Bases: :py:obj:`ChainError`


   Error for any chain connection related errors.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: ChainError

   Bases: :py:obj:`SubstrateRequestException`


   Base error for any chain related errors.

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:method:: from_error(error)
      :classmethod:



.. py:exception:: ChainQueryError

   Bases: :py:obj:`ChainError`


   Error for any chain query related errors.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: ChainTransactionError

   Bases: :py:obj:`ChainError`


   Error for any chain transaction related errors.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: DelegateTakeTooHigh

   Bases: :py:obj:`ChainTransactionError`


   Delegate take is too high.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: DelegateTakeTooLow

   Bases: :py:obj:`ChainTransactionError`


   Delegate take is too low.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: DelegateTxRateLimitExceeded

   Bases: :py:obj:`TxRateLimitExceeded`


   A transactor exceeded the rate limit for delegate transaction.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: DuplicateChild

   Bases: :py:obj:`ChainTransactionError`


   Duplicate child when setting children.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:data:: ExtrinsicNotFound

.. py:exception:: HotKeyAccountNotExists

   Bases: :py:obj:`ChainTransactionError`


   The hotkey does not exist.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: IdentityError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when an identity transaction fails.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: InternalServerError(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the requested function fails on the server. Indicates a server error.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: InvalidChild

   Bases: :py:obj:`ChainTransactionError`


   Attempting to set an invalid child for a hotkey on a network.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: InvalidRequestNameError

   Bases: :py:obj:`Exception`


   This exception is raised when the request name is invalid. Usually indicates a broken URL.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: MaxAttemptsException

   Bases: :py:obj:`Exception`


   Raised when the POW Solver has reached the max number of attempts.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: MaxSuccessException

   Bases: :py:obj:`Exception`


   Raised when the POW Solver has reached the max number of successful solutions.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: MetadataError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when metadata commitment transaction fails.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: NominationError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when a nomination transaction fails.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: NonAssociatedColdKey

   Bases: :py:obj:`ChainTransactionError`


   Request to stake, unstake or subscribe is made by a coldkey that is not associated with the hotkey account.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: NotDelegateError

   Bases: :py:obj:`StakeError`


   Error raised when a hotkey you are trying to stake to is not a delegate.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: NotEnoughStakeToSetChildkeys

   Bases: :py:obj:`ChainTransactionError`


   The parent hotkey doesn't have enough own stake to set childkeys.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: NotRegisteredError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when a neuron is not registered, and the transaction requires it to be.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: NotVerifiedException(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the request is not verified.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: PostProcessException(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the response headers cannot be updated.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: PriorityException(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the request priority is not met.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: ProportionOverflow

   Bases: :py:obj:`ChainTransactionError`


   Proportion overflow when setting children.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: RegistrationError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when a neuron registration transaction fails.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: RegistrationNotPermittedOnRootSubnet

   Bases: :py:obj:`ChainTransactionError`


   Operation is not permitted on the root subnet.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: RunException(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the requested function cannot be executed. Indicates a server error.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: StakeError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when a stake transaction fails.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:data:: StorageFunctionNotFound

.. py:exception:: SubnetNotExists

   Bases: :py:obj:`ChainTransactionError`


   The subnet does not exist.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:data:: SubstrateRequestException

.. py:exception:: SynapseDendriteNoneException(message='Synapse Dendrite is None', synapse = None)

   Bases: :py:obj:`SynapseException`


   Common base class for all non-exit exceptions.

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: message
      :value: 'Synapse Dendrite is None'



.. py:exception:: SynapseException(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`Exception`


   Common base class for all non-exit exceptions.

   Initialize self.  See help(type(self)) for accurate signature.


   .. py:attribute:: message
      :value: 'Synapse Exception'



   .. py:attribute:: synapse
      :value: None



.. py:exception:: SynapseParsingError

   Bases: :py:obj:`Exception`


   This exception is raised when the request headers are unable to be parsed into the synapse type.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: TakeError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when an increase / decrease take transaction fails.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: TooManyChildren

   Bases: :py:obj:`ChainTransactionError`


   Too many children MAX 5.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: TransferError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when a transfer transaction fails.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: TxRateLimitExceeded

   Bases: :py:obj:`ChainTransactionError`


   Default transaction rate limit exceeded.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: UnknownSynapseError(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the request name is not found in the Axon's forward_fns dictionary.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: UnstakeError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when an unstake transaction fails.

   Initialize self.  See help(type(self)) for accurate signature.


