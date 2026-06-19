bittensor.core.errors
=====================

.. py:module:: bittensor.core.errors


Attributes
----------

.. autoapisummary::

   bittensor.core.errors.SHIELD_VALIDATION_ERRORS


Exceptions
----------

.. autoapisummary::

   bittensor.core.errors.BalanceTypeError
   bittensor.core.errors.BalanceUnitMismatchError
   bittensor.core.errors.BlacklistedException
   bittensor.core.errors.InternalServerError
   bittensor.core.errors.InvalidRequestNameError
   bittensor.core.errors.MaxAttemptsException
   bittensor.core.errors.MaxSuccessException
   bittensor.core.errors.NotVerifiedException
   bittensor.core.errors.PostProcessException
   bittensor.core.errors.PriorityException
   bittensor.core.errors.RunException
   bittensor.core.errors.SynapseDendriteNoneException
   bittensor.core.errors.SynapseException
   bittensor.core.errors.SynapseParsingError
   bittensor.core.errors.UnknownSynapseError


Classes
-------

.. autoapisummary::

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
   bittensor.core.errors.InvalidChild
   bittensor.core.errors.MetadataError
   bittensor.core.errors.NominationError
   bittensor.core.errors.NonAssociatedColdKey
   bittensor.core.errors.NotDelegateError
   bittensor.core.errors.NotEnoughStakeToSetChildkeys
   bittensor.core.errors.NotRegisteredError
   bittensor.core.errors.ProportionOverflow
   bittensor.core.errors.RegistrationError
   bittensor.core.errors.RegistrationNotPermittedOnRootSubnet
   bittensor.core.errors.StakeError
   bittensor.core.errors.SubnetNotExists
   bittensor.core.errors.TakeError
   bittensor.core.errors.TooManyChildren
   bittensor.core.errors.TransferError
   bittensor.core.errors.TxRateLimitExceeded
   bittensor.core.errors.UnstakeError


Functions
---------

.. autoapisummary::

   bittensor.core.errors.map_shield_error


Module Contents
---------------

.. py:exception:: BalanceTypeError

   Bases: :py:obj:`Exception`


   Raised when a Balance object receives an invalid type.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: BalanceUnitMismatchError

   Bases: :py:obj:`Exception`


   Raised when Balance objects with different units are used in operations.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:exception:: BlacklistedException(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the request is blacklisted.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:class:: ChainConnectionError

   Bases: :py:obj:`ChainError`


   Error for any chain connection related errors.


.. py:class:: ChainError

   Bases: :py:obj:`async_substrate_interface.errors.SubstrateRequestException`


   Base error for any chain related errors.


   .. py:method:: from_error(error)
      :classmethod:



.. py:class:: ChainQueryError

   Bases: :py:obj:`ChainError`


   Error for any chain query related errors.


.. py:class:: ChainTransactionError

   Bases: :py:obj:`ChainError`


   Error for any chain transaction related errors.


.. py:class:: DelegateTakeTooHigh

   Bases: :py:obj:`ChainTransactionError`


   Delegate take is too high.


.. py:class:: DelegateTakeTooLow

   Bases: :py:obj:`ChainTransactionError`


   Delegate take is too low.


.. py:class:: DelegateTxRateLimitExceeded

   Bases: :py:obj:`TxRateLimitExceeded`


   A transactor exceeded the rate limit for delegate transaction.


.. py:class:: DuplicateChild

   Bases: :py:obj:`ChainTransactionError`


   Duplicate child when setting children.


.. py:class:: HotKeyAccountNotExists

   Bases: :py:obj:`ChainTransactionError`


   The hotkey does not exist.


.. py:class:: IdentityError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when an identity transaction fails.


.. py:exception:: InternalServerError(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the requested function fails on the server. Indicates a server error.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:class:: InvalidChild

   Bases: :py:obj:`ChainTransactionError`


   Attempting to set an invalid child for a hotkey on a network.


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


.. py:class:: MetadataError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when metadata commitment transaction fails.


.. py:class:: NominationError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when a nomination transaction fails.


.. py:class:: NonAssociatedColdKey

   Bases: :py:obj:`ChainTransactionError`


   Request to stake, unstake or subscribe is made by a coldkey that is not associated with the hotkey account.


.. py:class:: NotDelegateError

   Bases: :py:obj:`StakeError`


   Error raised when a hotkey you are trying to stake to is not a delegate.


.. py:class:: NotEnoughStakeToSetChildkeys

   Bases: :py:obj:`ChainTransactionError`


   The parent hotkey doesn't have enough own stake to set childkeys.


.. py:class:: NotRegisteredError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when a neuron is not registered, and the transaction requires it to be.


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


.. py:class:: ProportionOverflow

   Bases: :py:obj:`ChainTransactionError`


   Proportion overflow when setting children.


.. py:class:: RegistrationError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when a neuron registration transaction fails.


.. py:class:: RegistrationNotPermittedOnRootSubnet

   Bases: :py:obj:`ChainTransactionError`


   Operation is not permitted on the root subnet.


.. py:exception:: RunException(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the requested function cannot be executed. Indicates a server error.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:data:: SHIELD_VALIDATION_ERRORS

.. py:class:: StakeError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when a stake transaction fails.


.. py:class:: SubnetNotExists

   Bases: :py:obj:`ChainTransactionError`


   The subnet does not exist.


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


.. py:class:: TakeError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when an increase / decrease take transaction fails.


.. py:class:: TooManyChildren

   Bases: :py:obj:`ChainTransactionError`


   Too many children MAX 5.


.. py:class:: TransferError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when a transfer transaction fails.


.. py:class:: TxRateLimitExceeded

   Bases: :py:obj:`ChainTransactionError`


   Default transaction rate limit exceeded.


.. py:exception:: UnknownSynapseError(message='Synapse Exception', synapse = None)

   Bases: :py:obj:`SynapseException`


   This exception is raised when the request name is not found in the Axon's forward_fns dictionary.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:class:: UnstakeError

   Bases: :py:obj:`ChainTransactionError`


   Error raised when an unstake transaction fails.


.. py:function:: map_shield_error(raw_message)

   Map a raw shield validation error to a human-readable description.

   Checks the message against known Custom error codes from CheckShieldedTxValidity,
   then falls back to detecting a generic ``"invalid"`` subscription status.
   Returns the original message unchanged if nothing matches.


