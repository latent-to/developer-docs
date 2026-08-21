---
title: Errors
description: "This page contains error variants returned by the Subtensor runtime."
---

# Errors

This page contains error variants returned by the Subtensor runtime. Accessible via `api.errors.<Pallet>.<ErrorName>`.

:::info
Generated from Subtensor runtime spec version **447**. Connected to: `wss://entrypoint-finney.opentensor.ai:443`
:::

- **[adminUtils](#pallet-adminutils)**
- **[balances](#pallet-balances)**
- **[commitments](#pallet-commitments)**
- **[contracts](#pallet-contracts)**
- **[crowdloan](#pallet-crowdloan)**
- **[drand](#pallet-drand)**
- **[ethereum](#pallet-ethereum)**
- **[evm](#pallet-evm)**
- **[grandpa](#pallet-grandpa)**
- **[limitOrders](#pallet-limitorders)**
- **[mevShield](#pallet-mevshield)**
- **[multisig](#pallet-multisig)**
- **[preimage](#pallet-preimage)**
- **[proxy](#pallet-proxy)**
- **[safeMode](#pallet-safemode)**
- **[scheduler](#pallet-scheduler)**
- **[subtensorModule](#pallet-subtensormodule)**
- **[sudo](#pallet-sudo)**
- **[swap](#pallet-swap)**
- **[system](#pallet-system)**
- **[utility](#pallet-utility)**

## `adminUtils` {#pallet-adminutils}

### `BondsMovingAverageMaxReached`

- **interface**: `api.errors.adminUtils.BondsMovingAverageMaxReached`
- **summary**: The maximum value for bonds moving average is reached

### `CollateralDrainRatioOutOfBounds`

- **interface**: `api.errors.adminUtils.CollateralDrainRatioOutOfBounds`
- **summary**: The collateral drain ratio must be positive and at most the settable maximum.

### `CollateralLockShareTooHigh`

- **interface**: `api.errors.adminUtils.CollateralLockShareTooHigh`
- **summary**: The collateral lock share exceeds the settable maximum (95% of the registration price).

### `Deprecated`

- **interface**: `api.errors.adminUtils.Deprecated`
- **summary**: Call is deprecated

### `GrandpaChangeDelayMustBeZero`

- **interface**: `api.errors.adminUtils.GrandpaChangeDelayMustBeZero`
- **summary**: GRANDPA changes must take effect at the end of the current block.

### `InvalidValue`

- **interface**: `api.errors.adminUtils.InvalidValue`
- **summary**: Bad parameter value

### `MaxAllowedUidsGreaterThanDefaultMaxAllowedUids`

- **interface**: `api.errors.adminUtils.MaxAllowedUidsGreaterThanDefaultMaxAllowedUids`
- **summary**: The maximum allowed UIDs must be less than the default maximum allowed UIDs.

### `MaxAllowedUIdsLessThanCurrentUIds`

- **interface**: `api.errors.adminUtils.MaxAllowedUIdsLessThanCurrentUIds`
- **summary**: The maximum number of subnet validators must be more than the current number of UIDs already in the subnet.

### `MaxAllowedUidsLessThanMinAllowedUids`

- **interface**: `api.errors.adminUtils.MaxAllowedUidsLessThanMinAllowedUids`
- **summary**: The maximum allowed UIDs must be greater than the minimum allowed UIDs.

### `MaxValidatorsLargerThanMaxUIds`

- **interface**: `api.errors.adminUtils.MaxValidatorsLargerThanMaxUIds`
- **summary**: The maximum number of subnet validators must be less than the maximum number of allowed UIDs in the subnet.

### `MinAllowedUidsGreaterThanCurrentUids`

- **interface**: `api.errors.adminUtils.MinAllowedUidsGreaterThanCurrentUids`
- **summary**: The minimum allowed UIDs must be less than the current number of UIDs in the subnet.

### `MinAllowedUidsGreaterThanMaxAllowedUids`

- **interface**: `api.errors.adminUtils.MinAllowedUidsGreaterThanMaxAllowedUids`
- **summary**: The minimum allowed UIDs must be less than the maximum allowed UIDs.

### `NegativeSigmoidSteepness`

- **interface**: `api.errors.adminUtils.NegativeSigmoidSteepness`
- **summary**: Only root can set negative sigmoid steepness values

### `NotPermittedOnRootSubnet`

- **interface**: `api.errors.adminUtils.NotPermittedOnRootSubnet`
- **summary**: Operation is not permitted on the root network.

### `POWRegistrationDisabled`

- **interface**: `api.errors.adminUtils.POWRegistrationDisabled`
- **summary**: POW Registration has been deprecated

### `SubnetDoesNotExist`

- **interface**: `api.errors.adminUtils.SubnetDoesNotExist`
- **summary**: The subnet does not exist, check the netuid parameter

### `ValueNotInBounds`

- **interface**: `api.errors.adminUtils.ValueNotInBounds`
- **summary**: Value not in allowed bounds.


## `balances` {#pallet-balances}

### `DeadAccount`

- **interface**: `api.errors.balances.DeadAccount`
- **summary**: Beneficiary account must pre-exist.

### `DeltaZero`

- **interface**: `api.errors.balances.DeltaZero`
- **summary**: The delta cannot be zero.

### `ExistentialDeposit`

- **interface**: `api.errors.balances.ExistentialDeposit`
- **summary**: Value too low to create account due to existential deposit.

### `ExistingVestingSchedule`

- **interface**: `api.errors.balances.ExistingVestingSchedule`
- **summary**: A vesting schedule already exists for this account.

### `Expendability`

- **interface**: `api.errors.balances.Expendability`
- **summary**: Transfer/payment would kill account.

### `InsufficientBalance`

- **interface**: `api.errors.balances.InsufficientBalance`
- **summary**: Balance too low to send value.

### `IssuanceDeactivated`

- **interface**: `api.errors.balances.IssuanceDeactivated`
- **summary**: The issuance cannot be modified since it is already deactivated.

### `LiquidityRestrictions`

- **interface**: `api.errors.balances.LiquidityRestrictions`
- **summary**: Account liquidity restrictions prevent withdrawal.

### `TooManyFreezes`

- **interface**: `api.errors.balances.TooManyFreezes`
- **summary**: Number of freezes exceed `MaxFreezes`.

### `TooManyHolds`

- **interface**: `api.errors.balances.TooManyHolds`
- **summary**: Number of holds exceed `VariantCountOf<T::RuntimeHoldReason>`.

### `TooManyReserves`

- **interface**: `api.errors.balances.TooManyReserves`
- **summary**: Number of named reserves exceed `MaxReserves`.

### `VestingBalance`

- **interface**: `api.errors.balances.VestingBalance`
- **summary**: Vesting balance too high to send value.


## `commitments` {#pallet-commitments}

### `AccountNotAllowedCommit`

- **interface**: `api.errors.commitments.AccountNotAllowedCommit`
- **summary**: Account is not allowed to make commitments to the chain

### `SpaceLimitExceeded`

- **interface**: `api.errors.commitments.SpaceLimitExceeded`
- **summary**: Space Limit Exceeded for the current interval

### `TimelockRevealFailedNotAllowed`

- **interface**: `api.errors.commitments.TimelockRevealFailedNotAllowed`
- **summary**: `TimelockRevealFailed` fields may only be created by the runtime.

### `TooManyFieldsInCommitmentInfo`

- **interface**: `api.errors.commitments.TooManyFieldsInCommitmentInfo`
- **summary**: Account passed too many additional fields to their commitment

### `UnexpectedUnreserveLeftover`

- **interface**: `api.errors.commitments.UnexpectedUnreserveLeftover`
- **summary**: Indicates that unreserve returned a leftover, which is unexpected.


## `contracts` {#pallet-contracts}

### `CannotAddSelfAsDelegateDependency`

- **interface**: `api.errors.contracts.CannotAddSelfAsDelegateDependency`
- **summary**: Can not add a delegate dependency to the code hash of the contract itself.

### `CodeInfoNotFound`

- **interface**: `api.errors.contracts.CodeInfoNotFound`
- **summary**: No code info could be found at the supplied code hash.

### `CodeInUse`

- **interface**: `api.errors.contracts.CodeInUse`
- **summary**: Code removal was denied because the code is still in use by at least one contract.

### `CodeNotFound`

- **interface**: `api.errors.contracts.CodeNotFound`
- **summary**: No code could be found at the supplied code hash.

### `CodeRejected`

- **interface**: `api.errors.contracts.CodeRejected`
- **summary**: The contract's code was found to be invalid during validation.

    The most likely cause of this is that an API was used which is not supported by the node. This happens if an older node is used with a new version of ink!. Try updating your node to the newest available version.

    A more detailed error can be found on the node console if debug messages are enabled by supplying `-lruntime::contracts=debug`.

### `CodeTooLarge`

- **interface**: `api.errors.contracts.CodeTooLarge`
- **summary**: The code supplied to `instantiate_with_code` exceeds the limit specified in the current schedule.

### `ContractNotFound`

- **interface**: `api.errors.contracts.ContractNotFound`
- **summary**: No contract was found at the specified address.

### `ContractReverted`

- **interface**: `api.errors.contracts.ContractReverted`
- **summary**: The contract ran to completion but decided to revert its storage changes. Please note that this error is only returned from extrinsics. When called directly or via RPC an `Ok` will be returned. In this case the caller needs to inspect the flags to determine whether a reversion has taken place.

### `ContractTrapped`

- **interface**: `api.errors.contracts.ContractTrapped`
- **summary**: Contract trapped during execution.

### `DecodingFailed`

- **interface**: `api.errors.contracts.DecodingFailed`
- **summary**: Input passed to a contract API function failed to decode as expected type.

### `DelegateDependencyAlreadyExists`

- **interface**: `api.errors.contracts.DelegateDependencyAlreadyExists`
- **summary**: The contract already depends on the given delegate dependency.

### `DelegateDependencyNotFound`

- **interface**: `api.errors.contracts.DelegateDependencyNotFound`
- **summary**: The dependency was not found in the contract's delegate dependencies.

### `DuplicateContract`

- **interface**: `api.errors.contracts.DuplicateContract`
- **summary**: A contract with the same AccountId already exists.

### `Indeterministic`

- **interface**: `api.errors.contracts.Indeterministic`
- **summary**: An indeterministic code was used in a context where this is not permitted.

### `InputForwarded`

- **interface**: `api.errors.contracts.InputForwarded`
- **summary**: `seal_call` forwarded this contracts input. It therefore is no longer available.

### `InvalidCallFlags`

- **interface**: `api.errors.contracts.InvalidCallFlags`
- **summary**: Invalid combination of flags supplied to `seal_call` or `seal_delegate_call`.

### `InvalidSchedule`

- **interface**: `api.errors.contracts.InvalidSchedule`
- **summary**: Invalid schedule supplied, e.g. with zero weight of a basic operation.

### `MaxCallDepthReached`

- **interface**: `api.errors.contracts.MaxCallDepthReached`
- **summary**: Performing a call was denied because the calling depth reached the limit of what is specified in the schedule.

### `MaxDelegateDependenciesReached`

- **interface**: `api.errors.contracts.MaxDelegateDependenciesReached`
- **summary**: The contract has reached its maximum number of delegate dependencies.

### `MigrationInProgress`

- **interface**: `api.errors.contracts.MigrationInProgress`
- **summary**: A pending migration needs to complete before the extrinsic can be called.

### `NoChainExtension`

- **interface**: `api.errors.contracts.NoChainExtension`
- **summary**: The chain does not provide a chain extension. Calling the chain extension results in this error. Note that this usually  shouldn't happen as deploying such contracts is rejected.

### `NoMigrationPerformed`

- **interface**: `api.errors.contracts.NoMigrationPerformed`
- **summary**: Migrate dispatch call was attempted but no migration was performed.

### `OutOfBounds`

- **interface**: `api.errors.contracts.OutOfBounds`
- **summary**: A buffer outside of sandbox memory was passed to a contract API function.

### `OutOfGas`

- **interface**: `api.errors.contracts.OutOfGas`
- **summary**: The executed contract exhausted its gas limit.

### `OutOfTransientStorage`

- **interface**: `api.errors.contracts.OutOfTransientStorage`
- **summary**: Can not add more data to transient storage.

### `OutputBufferTooSmall`

- **interface**: `api.errors.contracts.OutputBufferTooSmall`
- **summary**: The output buffer supplied to a contract API call was too small.

### `RandomSubjectTooLong`

- **interface**: `api.errors.contracts.RandomSubjectTooLong`
- **summary**: The subject passed to `seal_random` exceeds the limit.

### `ReentranceDenied`

- **interface**: `api.errors.contracts.ReentranceDenied`
- **summary**: A call tried to invoke a contract that is flagged as non-reentrant. The only other cause is that a call from a contract into the runtime tried to call back into `pallet-contracts`. This would make the whole pallet reentrant with regard to contract code execution which is not supported.

### `StateChangeDenied`

- **interface**: `api.errors.contracts.StateChangeDenied`
- **summary**: A contract attempted to invoke a state modifying API while being in read-only mode.

### `StorageDepositLimitExhausted`

- **interface**: `api.errors.contracts.StorageDepositLimitExhausted`
- **summary**: More storage was created than allowed by the storage deposit limit.

### `StorageDepositNotEnoughFunds`

- **interface**: `api.errors.contracts.StorageDepositNotEnoughFunds`
- **summary**: Origin doesn't have enough balance to pay the required storage deposits.

### `TerminatedInConstructor`

- **interface**: `api.errors.contracts.TerminatedInConstructor`
- **summary**: A contract self destructed in its constructor.

    This can be triggered by a call to `seal_terminate`.

### `TerminatedWhileReentrant`

- **interface**: `api.errors.contracts.TerminatedWhileReentrant`
- **summary**: Termination of a contract is not allowed while the contract is already on the call stack. Can be triggered by `seal_terminate`.

### `TooManyTopics`

- **interface**: `api.errors.contracts.TooManyTopics`
- **summary**: The amount of topics passed to `seal_deposit_events` exceeds the limit.

### `TransferFailed`

- **interface**: `api.errors.contracts.TransferFailed`
- **summary**: Performing the requested transfer failed. Probably because there isn't enough free balance in the sender's account.

### `ValueTooLarge`

- **interface**: `api.errors.contracts.ValueTooLarge`
- **summary**: The size defined in `T::MaxValueSize` was exceeded.

### `XCMDecodeFailed`

- **interface**: `api.errors.contracts.XCMDecodeFailed`
- **summary**: Failed to decode the XCM program.


## `crowdloan` {#pallet-crowdloan}

### `AlreadyFinalized`

- **interface**: `api.errors.crowdloan.AlreadyFinalized`
- **summary**: The crowdloan has already been finalized.

### `AlreadyFinalizing`

- **interface**: `api.errors.crowdloan.AlreadyFinalizing`
- **summary**: A crowdloan finalization is already in progress.

### `BlockDurationTooLong`

- **interface**: `api.errors.crowdloan.BlockDurationTooLong`
- **summary**: The block duration is too long.

### `BlockDurationTooShort`

- **interface**: `api.errors.crowdloan.BlockDurationTooShort`
- **summary**: The crowdloan block duration is too short.

### `CallUnavailable`

- **interface**: `api.errors.crowdloan.CallUnavailable`
- **summary**: Call to dispatch was not found in the preimage storage.

### `CannotEndInPast`

- **interface**: `api.errors.crowdloan.CannotEndInPast`
- **summary**: The crowdloan cannot end in the past.

### `CapNotRaised`

- **interface**: `api.errors.crowdloan.CapNotRaised`
- **summary**: The crowdloan cap has not been raised.

### `CapRaised`

- **interface**: `api.errors.crowdloan.CapRaised`
- **summary**: The crowdloan cap has been fully raised.

### `CapTooLow`

- **interface**: `api.errors.crowdloan.CapTooLow`
- **summary**: The crowdloan cap is too low.

### `ContributionPeriodEnded`

- **interface**: `api.errors.crowdloan.ContributionPeriodEnded`
- **summary**: The contribution period has ended.

### `ContributionPeriodNotEnded`

- **interface**: `api.errors.crowdloan.ContributionPeriodNotEnded`
- **summary**: The crowdloan contribution period has not ended yet.

### `ContributionTooLow`

- **interface**: `api.errors.crowdloan.ContributionTooLow`
- **summary**: The contribution is too low.

### `DepositCannotBeWithdrawn`

- **interface**: `api.errors.crowdloan.DepositCannotBeWithdrawn`
- **summary**: The deposit cannot be withdrawn from the crowdloan.

### `DepositTooLow`

- **interface**: `api.errors.crowdloan.DepositTooLow`
- **summary**: The crowdloan initial deposit is too low.

### `InsufficientBalance`

- **interface**: `api.errors.crowdloan.InsufficientBalance`
- **summary**: The account does not have enough balance to pay for the initial deposit/contribution.

### `InvalidCrowdloanId`

- **interface**: `api.errors.crowdloan.InvalidCrowdloanId`
- **summary**: The crowdloan id is invalid.

### `InvalidFinalizationConfig`

- **interface**: `api.errors.crowdloan.InvalidFinalizationConfig`
- **summary**: Exactly one of call or target address must be provided.

### `InvalidOrigin`

- **interface**: `api.errors.crowdloan.InvalidOrigin`
- **summary**: The origin of this call is invalid.

### `MaxContributionReached`

- **interface**: `api.errors.crowdloan.MaxContributionReached`
- **summary**: The contributor has already reached the maximum contribution.

### `MaxContributorsReached`

- **interface**: `api.errors.crowdloan.MaxContributorsReached`
- **summary**: The maximum number of contributors has been reached.

### `MaximumContributionTooLow`

- **interface**: `api.errors.crowdloan.MaximumContributionTooLow`
- **summary**: The maximum contribution is too low.

### `MinimumContributionTooHigh`

- **interface**: `api.errors.crowdloan.MinimumContributionTooHigh`
- **summary**: The minimum contribution is too high.

### `MinimumContributionTooLow`

- **interface**: `api.errors.crowdloan.MinimumContributionTooLow`
- **summary**: The minimum contribution is too low.

### `NoContribution`

- **interface**: `api.errors.crowdloan.NoContribution`
- **summary**: The contributor has no contribution for this crowdloan.

### `NotReadyToDissolve`

- **interface**: `api.errors.crowdloan.NotReadyToDissolve`
- **summary**: The crowdloan is not ready to be dissolved, it still has contributions.

### `Overflow`

- **interface**: `api.errors.crowdloan.Overflow`
- **summary**: An overflow occurred.

### `Underflow`

- **interface**: `api.errors.crowdloan.Underflow`
- **summary**: An underflow occurred.


## `drand` {#pallet-drand}

### `DrandConnectionFailure`

- **interface**: `api.errors.drand.DrandConnectionFailure`
- **summary**: failed to connect to the

### `InvalidRoundNumber`

- **interface**: `api.errors.drand.InvalidRoundNumber`
- **summary**: the round number did not increment

### `NoneValue`

- **interface**: `api.errors.drand.NoneValue`
- **summary**: The value retrieved was `None` as no value was previously set.

### `PulseVerificationError`

- **interface**: `api.errors.drand.PulseVerificationError`
- **summary**: the pulse could not be verified

### `StorageOverflow`

- **interface**: `api.errors.drand.StorageOverflow`
- **summary**: There was an attempt to increment the value in storage over `u32::MAX`.

### `UnverifiedPulse`

- **interface**: `api.errors.drand.UnverifiedPulse`
- **summary**: the pulse is invalid


## `ethereum` {#pallet-ethereum}

### `InvalidSignature`

- **interface**: `api.errors.ethereum.InvalidSignature`
- **summary**: Signature is invalid.

### `PreLogExists`

- **interface**: `api.errors.ethereum.PreLogExists`
- **summary**: Pre-log is present, therefore transact is not allowed.


## `evm` {#pallet-evm}

### `BalanceLow`

- **interface**: `api.errors.evm.BalanceLow`
- **summary**: Not enough balance to perform action

### `CreateOriginNotAllowed`

- **interface**: `api.errors.evm.CreateOriginNotAllowed`
- **summary**: Address not allowed to deploy contracts either via CREATE or CALL(CREATE).

### `FeeOverflow`

- **interface**: `api.errors.evm.FeeOverflow`
- **summary**: Calculating total fee overflowed

### `GasLimitTooHigh`

- **interface**: `api.errors.evm.GasLimitTooHigh`
- **summary**: Gas limit is too high.

### `GasLimitTooLow`

- **interface**: `api.errors.evm.GasLimitTooLow`
- **summary**: Gas limit is too low.

### `GasPriceTooLow`

- **interface**: `api.errors.evm.GasPriceTooLow`
- **summary**: Gas price is too low.

### `InvalidChainId`

- **interface**: `api.errors.evm.InvalidChainId`
- **summary**: The chain id is invalid.

### `InvalidNonce`

- **interface**: `api.errors.evm.InvalidNonce`
- **summary**: Nonce is invalid

### `InvalidSignature`

- **interface**: `api.errors.evm.InvalidSignature`
- **summary**: the signature is invalid.

### `NotAllowed`

- **interface**: `api.errors.evm.NotAllowed`
- **summary**: Origin is not allowed to perform the operation.

### `PaymentOverflow`

- **interface**: `api.errors.evm.PaymentOverflow`
- **summary**: Calculating total payment overflowed

### `Reentrancy`

- **interface**: `api.errors.evm.Reentrancy`
- **summary**: EVM reentrancy

### `TransactionMustComeFromEOA`

- **interface**: `api.errors.evm.TransactionMustComeFromEOA`
- **summary**: EIP-3607,

### `Undefined`

- **interface**: `api.errors.evm.Undefined`
- **summary**: Undefined error.

### `WithdrawFailed`

- **interface**: `api.errors.evm.WithdrawFailed`
- **summary**: Withdraw fee failed


## `grandpa` {#pallet-grandpa}

### `ChangePending`

- **interface**: `api.errors.grandpa.ChangePending`
- **summary**: Attempt to signal GRANDPA change with one already pending.

### `DuplicateOffenceReport`

- **interface**: `api.errors.grandpa.DuplicateOffenceReport`
- **summary**: A given equivocation report is valid but already previously reported.

### `InvalidEquivocationProof`

- **interface**: `api.errors.grandpa.InvalidEquivocationProof`
- **summary**: An equivocation proof provided as part of an equivocation report is invalid.

### `InvalidKeyOwnershipProof`

- **interface**: `api.errors.grandpa.InvalidKeyOwnershipProof`
- **summary**: A key ownership proof provided as part of an equivocation report is invalid.

### `PauseFailed`

- **interface**: `api.errors.grandpa.PauseFailed`
- **summary**: Attempt to signal GRANDPA pause when the authority set isn't live (either paused or already pending pause).

### `ResumeFailed`

- **interface**: `api.errors.grandpa.ResumeFailed`
- **summary**: Attempt to signal GRANDPA resume when the authority set isn't paused (either live or already pending resume).

### `TooSoon`

- **interface**: `api.errors.grandpa.TooSoon`
- **summary**: Cannot signal forced change so soon after last.


## `limitOrders` {#pallet-limitorders}

### `ArithmeticOverflow`

- **interface**: `api.errors.limitOrders.ArithmeticOverflow`
- **summary**: A TAO -> alpha conversion overflowed the fixed-point range.

### `ChainIdMismatch`

- **interface**: `api.errors.limitOrders.ChainIdMismatch`
- **summary**: The order's chain_id does not match the current chain.

### `DuplicateOrderInBatch`

- **interface**: `api.errors.limitOrders.DuplicateOrderInBatch`
- **summary**: The same order appears more than once in a single batch.

### `IncorrectPartialFillAmount`

- **interface**: `api.errors.limitOrders.IncorrectPartialFillAmount`
- **summary**: Incorrect partial fill amount provided

### `InvalidSignature`

- **interface**: `api.errors.limitOrders.InvalidSignature`
- **summary**: The provided signature does not match the order payload and signer.

### `LimitOrdersDisabled`

- **interface**: `api.errors.limitOrders.LimitOrdersDisabled`
- **summary**: Limit orders are disabled

### `OrderAlreadyProcessed`

- **interface**: `api.errors.limitOrders.OrderAlreadyProcessed`
- **summary**: The order has already been Fulfilled or Cancelled.

### `OrderCancelled`

- **interface**: `api.errors.limitOrders.OrderCancelled`
- **summary**: Order has been cancelled

### `OrderExpired`

- **interface**: `api.errors.limitOrders.OrderExpired`
- **summary**: The order's expiry timestamp is in the past.

### `OrderNetUidMismatch`

- **interface**: `api.errors.limitOrders.OrderNetUidMismatch`
- **summary**: An order in the batch targets a different netuid than the batch netuid parameter.

### `PalletHotkeyNotRegistered`

- **interface**: `api.errors.limitOrders.PalletHotkeyNotRegistered`
- **summary**: The pallet hotkey has not been registered to the pallet account. Call on_runtime_upgrade or wait for genesis to complete registration before enabling the pallet.

### `PartialFillsNotEnabled`

- **interface**: `api.errors.limitOrders.PartialFillsNotEnabled`
- **summary**: Partial fills not enabled for this order

### `PriceConditionNotMet`

- **interface**: `api.errors.limitOrders.PriceConditionNotMet`
- **summary**: The current market price does not satisfy the order's limit price.

### `RelayerMissMatch`

- **interface**: `api.errors.limitOrders.RelayerMissMatch`
- **summary**: Relayer not the same as specified in the order

### `RelayerRequiredForPartialFill`

- **interface**: `api.errors.limitOrders.RelayerRequiredForPartialFill`
- **summary**: A relayer must be set on the order when using partial fills

### `RootNetUidNotAllowed`

- **interface**: `api.errors.limitOrders.RootNetUidNotAllowed`
- **summary**: Root netuid (0) is not allowed for limit orders.

### `SwapReturnedZero`

- **interface**: `api.errors.limitOrders.SwapReturnedZero`
- **summary**: The pool swap returned zero output for a non-zero input.

### `Unauthorized`

- **interface**: `api.errors.limitOrders.Unauthorized`
- **summary**: Caller is not the order signer (required for cancellation).

### `ZeroShareInBatch`

- **interface**: `api.errors.limitOrders.ZeroShareInBatch`
- **summary**: An order's pro-rata share in the batch rounded down to zero. The whole batch is rejected so the order's input is never consumed without delivering any output (conservation), and the order stays retryable in a differently-composed batch.


## `mevShield` {#pallet-mevshield}

### `BadEncKeyLen`

- **interface**: `api.errors.mevShield.BadEncKeyLen`
- **summary**: The announced ML‑KEM encapsulation key length is invalid.

### `TooManyPendingExtrinsics`

- **interface**: `api.errors.mevShield.TooManyPendingExtrinsics`
- **summary**: Too many pending extrinsics in storage.

### `Unreachable`

- **interface**: `api.errors.mevShield.Unreachable`
- **summary**: Unreachable.

### `WeightExceedsAbsoluteMax`

- **interface**: `api.errors.mevShield.WeightExceedsAbsoluteMax`
- **summary**: Weight exceeds the absolute maximum (half of total block weight).


## `multisig` {#pallet-multisig}

### `AlreadyApproved`

- **interface**: `api.errors.multisig.AlreadyApproved`
- **summary**: Call is already approved by this signatory.

### `AlreadyStored`

- **interface**: `api.errors.multisig.AlreadyStored`
- **summary**: The data to be stored is already stored.

### `MaxWeightTooLow`

- **interface**: `api.errors.multisig.MaxWeightTooLow`
- **summary**: The maximum weight information provided was too low.

### `MinimumThreshold`

- **interface**: `api.errors.multisig.MinimumThreshold`
- **summary**: Threshold must be 2 or greater.

### `NoApprovalsNeeded`

- **interface**: `api.errors.multisig.NoApprovalsNeeded`
- **summary**: Call doesn't need any (more) approvals.

### `NotFound`

- **interface**: `api.errors.multisig.NotFound`
- **summary**: Multisig operation not found in storage.

### `NoTimepoint`

- **interface**: `api.errors.multisig.NoTimepoint`
- **summary**: No timepoint was given, yet the multisig operation is already underway.

### `NotOwner`

- **interface**: `api.errors.multisig.NotOwner`
- **summary**: Only the account that originally created the multisig is able to cancel it or update its deposits.

### `SenderInSignatories`

- **interface**: `api.errors.multisig.SenderInSignatories`
- **summary**: The sender was contained in the other signatories; it shouldn't be.

### `SignatoriesOutOfOrder`

- **interface**: `api.errors.multisig.SignatoriesOutOfOrder`
- **summary**: The signatories were provided out of order; they should be ordered.

### `TooFewSignatories`

- **interface**: `api.errors.multisig.TooFewSignatories`
- **summary**: There are too few signatories in the list.

### `TooManySignatories`

- **interface**: `api.errors.multisig.TooManySignatories`
- **summary**: There are too many signatories in the list.

### `UnexpectedTimepoint`

- **interface**: `api.errors.multisig.UnexpectedTimepoint`
- **summary**: A timepoint was given, yet no multisig operation is underway.

### `WrongTimepoint`

- **interface**: `api.errors.multisig.WrongTimepoint`
- **summary**: A different timepoint was given to the multisig operation that is underway.


## `preimage` {#pallet-preimage}

### `AlreadyNoted`

- **interface**: `api.errors.preimage.AlreadyNoted`
- **summary**: Preimage has already been noted on-chain.

### `NotAuthorized`

- **interface**: `api.errors.preimage.NotAuthorized`
- **summary**: The user is not authorized to perform this action.

### `NotNoted`

- **interface**: `api.errors.preimage.NotNoted`
- **summary**: The preimage cannot be removed since it has not yet been noted.

### `NotRequested`

- **interface**: `api.errors.preimage.NotRequested`
- **summary**: The preimage request cannot be removed since no outstanding requests exist.

### `Requested`

- **interface**: `api.errors.preimage.Requested`
- **summary**: A preimage may not be removed when there are outstanding requests.

### `TooBig`

- **interface**: `api.errors.preimage.TooBig`
- **summary**: Preimage is too large to store on-chain.

### `TooFew`

- **interface**: `api.errors.preimage.TooFew`
- **summary**: Too few hashes were requested to be upgraded (i.e. zero).

### `TooMany`

- **interface**: `api.errors.preimage.TooMany`
- **summary**: More than `MAX_HASH_UPGRADE_BULK_COUNT` hashes were requested to be upgraded at once.


## `proxy` {#pallet-proxy}

### `AnnouncementDepositInvariantViolated`

- **interface**: `api.errors.proxy.AnnouncementDepositInvariantViolated`
- **summary**: Invariant violated: deposit recomputation returned None after updating announcements.

### `Duplicate`

- **interface**: `api.errors.proxy.Duplicate`
- **summary**: Account is already a proxy.

### `InvalidDerivedAccountId`

- **interface**: `api.errors.proxy.InvalidDerivedAccountId`
- **summary**: Failed to derive a valid account id from the provided entropy.

### `NoPermission`

- **interface**: `api.errors.proxy.NoPermission`
- **summary**: Call may not be made by proxy because it may escalate its privileges.

### `NoSelfProxy`

- **interface**: `api.errors.proxy.NoSelfProxy`
- **summary**: Cannot add self as proxy.

### `NotFound`

- **interface**: `api.errors.proxy.NotFound`
- **summary**: Proxy registration not found.

### `NotProxy`

- **interface**: `api.errors.proxy.NotProxy`
- **summary**: Sender is not a proxy of the account to be proxied.

### `TooMany`

- **interface**: `api.errors.proxy.TooMany`
- **summary**: There are too many proxies registered or too many announcements pending.

### `Unannounced`

- **interface**: `api.errors.proxy.Unannounced`
- **summary**: Announcement, if made at all, was made too recently.

### `Unproxyable`

- **interface**: `api.errors.proxy.Unproxyable`
- **summary**: A call which is incompatible with the proxy type's filter was attempted.


## `safeMode` {#pallet-safemode}

### `AlreadyDeposited`

- **interface**: `api.errors.safeMode.AlreadyDeposited`
- **summary**: The account already has a deposit reserved and can therefore not enter or extend again.

### `CannotReleaseYet`

- **interface**: `api.errors.safeMode.CannotReleaseYet`
- **summary**: This deposit cannot be released yet.

### `CurrencyError`

- **interface**: `api.errors.safeMode.CurrencyError`
- **summary**: An error from the underlying `Currency`.

### `Entered`

- **interface**: `api.errors.safeMode.Entered`
- **summary**: The safe-mode is (already or still) entered.

### `Exited`

- **interface**: `api.errors.safeMode.Exited`
- **summary**: The safe-mode is (already or still) exited.

### `NoDeposit`

- **interface**: `api.errors.safeMode.NoDeposit`
- **summary**: There is no balance reserved.

### `NotConfigured`

- **interface**: `api.errors.safeMode.NotConfigured`
- **summary**: This functionality of the pallet is disabled by the configuration.


## `scheduler` {#pallet-scheduler}

### `FailedToSchedule`

- **interface**: `api.errors.scheduler.FailedToSchedule`
- **summary**: Failed to schedule a call

### `Named`

- **interface**: `api.errors.scheduler.Named`
- **summary**: Attempt to use a non-named function on a named task.

### `NotFound`

- **interface**: `api.errors.scheduler.NotFound`
- **summary**: Cannot find the scheduled call.

### `RescheduleNoChange`

- **interface**: `api.errors.scheduler.RescheduleNoChange`
- **summary**: Reschedule failed because it does not change scheduled time.

### `TargetBlockNumberInPast`

- **interface**: `api.errors.scheduler.TargetBlockNumberInPast`
- **summary**: Given target block number is in the past.


## `subtensorModule` {#pallet-subtensormodule}

### `AccountRejectsLockedAlpha`

- **interface**: `api.errors.subtensorModule.AccountRejectsLockedAlpha`
- **summary**: The destination coldkey rejects incoming locked alpha.

### `ActiveLockExists`

- **interface**: `api.errors.subtensorModule.ActiveLockExists`
- **summary**: There is already an active lock for the given coldkey.

### `ActivityCutoffFactorMilliOutOfBounds`

- **interface**: `api.errors.subtensorModule.ActivityCutoffFactorMilliOutOfBounds`
- **summary**: The supplied activity-cutoff factor is outside the allowed range.

### `ActivityCutoffTooLow`

- **interface**: `api.errors.subtensorModule.ActivityCutoffTooLow`
- **summary**: Activity cutoff is being set too low.

### `AddStakeBurnRateLimitExceeded`

- **interface**: `api.errors.subtensorModule.AddStakeBurnRateLimitExceeded`
- **summary**: "Add stake and burn" exceeded the operation rate limit

### `AdminActionProhibitedDuringWeightsWindow`

- **interface**: `api.errors.subtensorModule.AdminActionProhibitedDuringWeightsWindow`
- **summary**: Admin operation is prohibited during the protected weights window

### `AllNetworksInImmunity`

- **interface**: `api.errors.subtensorModule.AllNetworksInImmunity`
- **summary**: All subnets are in the immunity period.

### `AlphaHighTooLow`

- **interface**: `api.errors.subtensorModule.AlphaHighTooLow`
- **summary**: Alpha high is too low: alpha_high > 0.8

### `AlphaLowOutOfRange`

- **interface**: `api.errors.subtensorModule.AlphaLowOutOfRange`
- **summary**: Alpha low is out of range: alpha_low > 0 && alpha_low \< 0.8

### `AmountTooLow`

- **interface**: `api.errors.subtensorModule.AmountTooLow`
- **summary**: Stake amount is too low.

### `AnnouncedColdkeyHashDoesNotMatch`

- **interface**: `api.errors.subtensorModule.AnnouncedColdkeyHashDoesNotMatch`
- **summary**: The announced coldkey hash does not match the new coldkey hash.

### `AutoEpochAlreadyImminent`

- **interface**: `api.errors.subtensorModule.AutoEpochAlreadyImminent`
- **summary**: The next automatic epoch is already imminent; a manual trigger would have no effect.

### `BalanceWithdrawalError`

- **interface**: `api.errors.subtensorModule.BalanceWithdrawalError`
- **summary**: The caller is trying to add stake, but for some reason the requested amount could not be withdrawn from the coldkey account.

### `BasketHasNoWeights`

- **interface**: `api.errors.subtensorModule.BasketHasNoWeights`
- **summary**: Retired (kept for SCALE index stability): direct basket deposits into an uncurated fund are now held as the fund's root (TAO cash) slot instead of erroring.

### `BeneficiaryDoesNotOwnHotkey`

- **interface**: `api.errors.subtensorModule.BeneficiaryDoesNotOwnHotkey`
- **summary**: Beneficiary does not own hotkey.

### `BetaBasketSeedInProgress`

- **interface**: `api.errors.subtensorModule.BetaBasketSeedInProgress`
- **summary**: The `migrate_seed_beta_basket_v2` seed or its per-hotkey deferred-dividend release has not completed. Basket deposits, claims, coldkey / root-touching hotkey swaps, and root stake add/remove/transfer/swap are paused until it finishes so snapshotted conversion cannot desync from live stake (`Σ owed == BasketShares`).

### `CallDisabled`

- **interface**: `api.errors.subtensorModule.CallDisabled`
- **summary**: Call is disabled

### `CannotAffordLockCost`

- **interface**: `api.errors.subtensorModule.CannotAffordLockCost`
- **summary**: Insufficient funds to meet the subnet lock cost

### `CannotBurnOrRecycleOnRootSubnet`

- **interface**: `api.errors.subtensorModule.CannotBurnOrRecycleOnRootSubnet`
- **summary**: Cannot burn or recycle TAO from root subnet

### `CanNotSetRootNetworkWeights`

- **interface**: `api.errors.subtensorModule.CanNotSetRootNetworkWeights`
- **summary**: Can not set weights for the root network.

### `CannotUseSystemAccount`

- **interface**: `api.errors.subtensorModule.CannotUseSystemAccount`
- **summary**: A system account cannot be used in this operation

### `ChildParentInconsistency`

- **interface**: `api.errors.subtensorModule.ChildParentInconsistency`
- **summary**: Violating the rules of Childkey-Parentkey consistency

### `ColdKeyAlreadyAssociated`

- **interface**: `api.errors.subtensorModule.ColdKeyAlreadyAssociated`
- **summary**: The coldkey has already been swapped

### `ColdkeyCollateralIncomplete`

- **interface**: `api.errors.subtensorModule.ColdkeyCollateralIncomplete`
- **summary**: Coldkey swap could not fully migrate miner collateral: the old coldkey's [`ColdkeyMinerCollateral`] aggregate remained non-zero after migrating every indexed collateral hotkey. Failing closed avoids under-locking the destination unstake guard.

### `ColdkeyCollateralPositionsFull`

- **interface**: `api.errors.subtensorModule.ColdkeyCollateralPositionsFull`
- **summary**: This coldkey already has the maximum number of distinct hotkeys with miner collateral on the subnet ([`crate::MAX_COLDKEY_COLLATERAL_HOTKEYS`]).

### `ColdkeySwapAlreadyDisputed`

- **interface**: `api.errors.subtensorModule.ColdkeySwapAlreadyDisputed`
- **summary**: Coldkey swap already disputed

### `ColdkeySwapAnnounced`

- **interface**: `api.errors.subtensorModule.ColdkeySwapAnnounced`
- **summary**: A coldkey swap has been announced for this account.

### `ColdkeySwapAnnouncementNotFound`

- **interface**: `api.errors.subtensorModule.ColdkeySwapAnnouncementNotFound`
- **summary**: Coldkey swap announcement not found

### `ColdkeySwapClearTooEarly`

- **interface**: `api.errors.subtensorModule.ColdkeySwapClearTooEarly`
- **summary**: Coldkey swap clear too early.

### `ColdkeySwapDisputed`

- **interface**: `api.errors.subtensorModule.ColdkeySwapDisputed`
- **summary**: A coldkey swap for this account is under dispute.

### `ColdkeySwapReannouncedTooEarly`

- **interface**: `api.errors.subtensorModule.ColdkeySwapReannouncedTooEarly`
- **summary**: Coldkey swap reannounced too early.

### `ColdkeySwapTooEarly`

- **interface**: `api.errors.subtensorModule.ColdkeySwapTooEarly`
- **summary**: Coldkey swap too early.

### `CommitRevealDisabled`

- **interface**: `api.errors.subtensorModule.CommitRevealDisabled`
- **summary**: Attemtping to commit/reveal weights when disabled.

### `CommitRevealEnabled`

- **interface**: `api.errors.subtensorModule.CommitRevealEnabled`
- **summary**: Attempting to call set_weights when commit/reveal is enabled

### `CommittingWeightsTooFast`

- **interface**: `api.errors.subtensorModule.CommittingWeightsTooFast`
- **summary**: A transactor exceeded the rate limit for setting weights.

### `DelegateTakeTooHigh`

- **interface**: `api.errors.subtensorModule.DelegateTakeTooHigh`
- **summary**: Delegate take is too high.

### `DelegateTakeTooLow`

- **interface**: `api.errors.subtensorModule.DelegateTakeTooLow`
- **summary**: Delegate take is too low.

### `DelegateTxRateLimitExceeded`

- **interface**: `api.errors.subtensorModule.DelegateTxRateLimitExceeded`
- **summary**: A transactor exceeded the rate limit for delegate transaction.

### `Deprecated`

- **interface**: `api.errors.subtensorModule.Deprecated`
- **summary**: Deprecated call.

### `DisabledTemporarily`

- **interface**: `api.errors.subtensorModule.DisabledTemporarily`
- **summary**: Disabled temporarily.

### `DuplicateChild`

- **interface**: `api.errors.subtensorModule.DuplicateChild`
- **summary**: Duplicate child when setting children.

### `DuplicateUids`

- **interface**: `api.errors.subtensorModule.DuplicateUids`
- **summary**: The caller is attempting to set weights with duplicate UIDs in the weight matrix.

### `DynamicTempoBlockedByCommitReveal`

- **interface**: `api.errors.subtensorModule.DynamicTempoBlockedByCommitReveal`
- **summary**: `trigger_epoch` is blocked because commit-reveal is enabled for this subnet: an out-of-band epoch would desync the CRv3 reveal window from the wall-clock Drand schedule and silently drop committed weights.

### `EpochTriggerAlreadyPending`

- **interface**: `api.errors.subtensorModule.EpochTriggerAlreadyPending`
- **summary**: An epoch trigger is already pending for this subnet; wait for it to fire before triggering again.

### `EvmKeyAssociateRateLimitExceeded`

- **interface**: `api.errors.subtensorModule.EvmKeyAssociateRateLimitExceeded`
- **summary**: exceeded the rate limit for associating an EVM key.

### `EvmKeyAssociationLimitExceeded`

- **interface**: `api.errors.subtensorModule.EvmKeyAssociationLimitExceeded`
- **summary**: The EVM address already has the maximum number of associated UIDs on this subnet.

### `ExpectedBeneficiaryOrigin`

- **interface**: `api.errors.subtensorModule.ExpectedBeneficiaryOrigin`
- **summary**: Expected beneficiary origin.

### `ExpiredWeightCommit`

- **interface**: `api.errors.subtensorModule.ExpiredWeightCommit`
- **summary**: Attempted to reveal weights that are expired.

### `FaucetDisabled`

- **interface**: `api.errors.subtensorModule.FaucetDisabled`
- **summary**: Faucet is disabled.

### `FirstEmissionBlockNumberAlreadySet`

- **interface**: `api.errors.subtensorModule.FirstEmissionBlockNumberAlreadySet`
- **summary**: FirstEmissionBlockNumber is already set.

### `HotKeyAccountNotExists`

- **interface**: `api.errors.subtensorModule.HotKeyAccountNotExists`
- **summary**: The hotkey does not exists

### `HotKeyAlreadyDelegate`

- **interface**: `api.errors.subtensorModule.HotKeyAlreadyDelegate`
- **summary**: The hotkey is attempting to become a delegate when the hotkey is already a delegate.

### `HotKeyAlreadyRegisteredInSubNet`

- **interface**: `api.errors.subtensorModule.HotKeyAlreadyRegisteredInSubNet`
- **summary**: The caller is requesting registering a neuron which already exists in the active set.

### `HotKeyNotRegisteredInNetwork`

- **interface**: `api.errors.subtensorModule.HotKeyNotRegisteredInNetwork`
- **summary**: The hotkey is not registered in any subnet.

### `HotKeyNotRegisteredInSubNet`

- **interface**: `api.errors.subtensorModule.HotKeyNotRegisteredInSubNet`
- **summary**: The hotkey is not registered in subnet

### `HotKeySetTxRateLimitExceeded`

- **interface**: `api.errors.subtensorModule.HotKeySetTxRateLimitExceeded`
- **summary**: A transactor exceeded the rate limit for setting or swapping hotkey.

### `HotKeySwapOnSubnetIntervalNotPassed`

- **interface**: `api.errors.subtensorModule.HotKeySwapOnSubnetIntervalNotPassed`
- **summary**: Too frequent hotkey swap on subnet

### `IncorrectCommitRevealVersion`

- **interface**: `api.errors.subtensorModule.IncorrectCommitRevealVersion`
- **summary**: Incorrect commit-reveal version.

### `IncorrectWeightVersionKey`

- **interface**: `api.errors.subtensorModule.IncorrectWeightVersionKey`
- **summary**: A validator is attempting to set weights from a validator with incorrect weight version.

### `InputLengthsUnequal`

- **interface**: `api.errors.subtensorModule.InputLengthsUnequal`
- **summary**: Attempted to batch reveal weights with mismatched vector input lenghts.

### `InsufficientAlphaBalance`

- **interface**: `api.errors.subtensorModule.InsufficientAlphaBalance`
- **summary**: The caller does not have enough Alpha stake for the operation.

### `InsufficientLiquidity`

- **interface**: `api.errors.subtensorModule.InsufficientLiquidity`
- **summary**: Not enough liquidity.

### `InsufficientStakeForLock`

- **interface**: `api.errors.subtensorModule.InsufficientStakeForLock`
- **summary**: Insufficient stake on subnet to cover the lock amount.

### `InsufficientTaoBalance`

- **interface**: `api.errors.subtensorModule.InsufficientTaoBalance`
- **summary**: The caller does not have enough TAO balance for the operation.

### `InvalidChild`

- **interface**: `api.errors.subtensorModule.InvalidChild`
- **summary**: Attempting to set an invalid child for a hotkey on a network.

### `InvalidChildkeyTake`

- **interface**: `api.errors.subtensorModule.InvalidChildkeyTake`
- **summary**: Childkey take is invalid.

### `InvalidDifficulty`

- **interface**: `api.errors.subtensorModule.InvalidDifficulty`
- **summary**: The supplied PoW hash block does not meet the network difficulty.

### `InvalidIdentity`

- **interface**: `api.errors.subtensorModule.InvalidIdentity`
- **summary**: Invalid identity.

### `InvalidIpAddress`

- **interface**: `api.errors.subtensorModule.InvalidIpAddress`
- **summary**: An invalid IP address is passed to the serve function.

### `InvalidIpType`

- **interface**: `api.errors.subtensorModule.InvalidIpType`
- **summary**: The user is trying to serve an axon which is not of type 4 (IPv4) or 6 (IPv6).

### `InvalidLeaseBeneficiary`

- **interface**: `api.errors.subtensorModule.InvalidLeaseBeneficiary`
- **summary**: Invalid lease beneficiary to register the leased network.

### `InvalidPort`

- **interface**: `api.errors.subtensorModule.InvalidPort`
- **summary**: An invalid port is passed to the serve function.

### `InvalidRecoveredPublicKey`

- **interface**: `api.errors.subtensorModule.InvalidRecoveredPublicKey`
- **summary**: Recovered public key is invalid.

### `InvalidRevealCommitHashNotMatch`

- **interface**: `api.errors.subtensorModule.InvalidRevealCommitHashNotMatch`
- **summary**: Committed hash does not equal the hashed reveal data.

### `InvalidRevealRound`

- **interface**: `api.errors.subtensorModule.InvalidRevealRound`
- **summary**: Reveal round is older than the most recently stored DRAND round.

### `InvalidRootClaimThreshold`

- **interface**: `api.errors.subtensorModule.InvalidRootClaimThreshold`
- **summary**: Invalid value of root claim threshold

### `InvalidSeal`

- **interface**: `api.errors.subtensorModule.InvalidSeal`
- **summary**: The supplied PoW hash seal does not match the supplied work.

### `InvalidValue`

- **interface**: `api.errors.subtensorModule.InvalidValue`
- **summary**: Generic error for out-of-range parameter value

### `InvalidVotingPowerEmaAlpha`

- **interface**: `api.errors.subtensorModule.InvalidVotingPowerEmaAlpha`
- **summary**: Invalid voting power EMA alpha value (must be \<= 10^18).

### `InvalidWorkBlock`

- **interface**: `api.errors.subtensorModule.InvalidWorkBlock`
- **summary**: The supplied PoW hash block is in the future or negative.

### `KeepStakeBlockedByCollateral`

- **interface**: `api.errors.subtensorModule.KeepStakeBlockedByCollateral`
- **summary**: `keep_stake` hotkey swap refused because the old hotkey still has standing miner collateral. Stake would stay on the old key while the UID moves, stranding the bond. Swap with `keep_stake=false` so collateral migrates with the UID (lineage maps track the rename).

### `LeaseCannotEndInThePast`

- **interface**: `api.errors.subtensorModule.LeaseCannotEndInThePast`
- **summary**: Lease cannot end in the past.

### `LeaseDoesNotExist`

- **interface**: `api.errors.subtensorModule.LeaseDoesNotExist`
- **summary**: Lease does not exist.

### `LeaseHasNoEndBlock`

- **interface**: `api.errors.subtensorModule.LeaseHasNoEndBlock`
- **summary**: Lease has no end block.

### `LeaseHasNotEnded`

- **interface**: `api.errors.subtensorModule.LeaseHasNotEnded`
- **summary**: Lease has not ended.

### `LeaseNetuidNotFound`

- **interface**: `api.errors.subtensorModule.LeaseNetuidNotFound`
- **summary**: Couldn't find the lease netuid.

### `LiquidAlphaDisabled`

- **interface**: `api.errors.subtensorModule.LiquidAlphaDisabled`
- **summary**: Attempting to set alpha high/low while disabled

### `LockHotkeyMismatch`

- **interface**: `api.errors.subtensorModule.LockHotkeyMismatch`
- **summary**: Lock hotkey mismatch: existing lock is for a different hotkey.

### `LockIdOverFlow`

- **interface**: `api.errors.subtensorModule.LockIdOverFlow`
- **summary**: The coldkey has already registered too many subnets

### `MaxWeightExceeded`

- **interface**: `api.errors.subtensorModule.MaxWeightExceeded`
- **summary**: The dispatch is attempting to set weights on chain with weight value exceeding the configured max weight limit (currently `u16::MAX`).

### `MechanismDoesNotExist`

- **interface**: `api.errors.subtensorModule.MechanismDoesNotExist`
- **summary**: Subnet mechanism does not exist.

### `NeedWaitingMoreBlocksToStarCall`

- **interface**: `api.errors.subtensorModule.NeedWaitingMoreBlocksToStarCall`
- **summary**: need wait for more blocks to accept the start call extrinsic.

### `NetworkDissolveAlreadyQueued`

- **interface**: `api.errors.subtensorModule.NetworkDissolveAlreadyQueued`
- **summary**: Network already in dissolved queue

### `NetworkTxRateLimitExceeded`

- **interface**: `api.errors.subtensorModule.NetworkTxRateLimitExceeded`
- **summary**: A transactor exceeded the rate limit for add network transaction.

### `NeuronNoValidatorPermit`

- **interface**: `api.errors.subtensorModule.NeuronNoValidatorPermit`
- **summary**: The caller is attempting to set non-self weights without being a permitted validator.

### `NewColdKeyIsHotkey`

- **interface**: `api.errors.subtensorModule.NewColdKeyIsHotkey`
- **summary**: New coldkey is hotkey

### `NewHotKeyIsSameWithOld`

- **interface**: `api.errors.subtensorModule.NewHotKeyIsSameWithOld`
- **summary**: The new hotkey is the same as old one

### `NewHotKeyNotCleanForRootSwap`

- **interface**: `api.errors.subtensorModule.NewHotKeyNotCleanForRootSwap`
- **summary**: The new hotkey has outstanding root claimable or non-zero root stake, so the root rate-book cannot be merged without misallocating dividends.

### `NoExistingLock`

- **interface**: `api.errors.subtensorModule.NoExistingLock`
- **summary**: No existing lock found for the given coldkey and subnet.

### `NonAssociatedColdKey`

- **interface**: `api.errors.subtensorModule.NonAssociatedColdKey`
- **summary**: Request to stake, unstake or subscribe is made by a coldkey that is not associated with the hotkey account.

### `NoNeuronIdAvailable`

- **interface**: `api.errors.subtensorModule.NoNeuronIdAvailable`
- **summary**: No neuron ID is available.

### `NotEnoughAlphaOutToRecycle`

- **interface**: `api.errors.subtensorModule.NotEnoughAlphaOutToRecycle`
- **summary**: Not enough AlphaOut on the subnet to recycle

### `NotEnoughBalanceToPaySwapColdKey`

- **interface**: `api.errors.subtensorModule.NotEnoughBalanceToPaySwapColdKey`
- **summary**: The coldkey balance is not enough to pay for the swap

### `NotEnoughBalanceToPaySwapHotKey`

- **interface**: `api.errors.subtensorModule.NotEnoughBalanceToPaySwapHotKey`
- **summary**: Not enough balance to pay swapping hotkey.

### `NotEnoughBalanceToStake`

- **interface**: `api.errors.subtensorModule.NotEnoughBalanceToStake`
- **summary**: The caller is requesting adding more stake than there exists in the coldkey account. See: "[add_stake()]"

### `NotEnoughStake`

- **interface**: `api.errors.subtensorModule.NotEnoughStake`
- **summary**: The caller does not have enought stake to perform this action.

### `NotEnoughStakeToSetChildkeys`

- **interface**: `api.errors.subtensorModule.NotEnoughStakeToSetChildkeys`
- **summary**: The parent hotkey doesn't have enough own stake to set childkeys.

### `NotEnoughStakeToSetWeights`

- **interface**: `api.errors.subtensorModule.NotEnoughStakeToSetWeights`
- **summary**: The caller is requesting to set weights but the caller has less than minimum stake required to set weights (less than WeightsMinStake).

### `NotEnoughStakeToWithdraw`

- **interface**: `api.errors.subtensorModule.NotEnoughStakeToWithdraw`
- **summary**: The caller is requesting removing more stake than there exists in the staking account. See: "[remove_stake()]".

### `NotRootSubnet`

- **interface**: `api.errors.subtensorModule.NotRootSubnet`
- **summary**: Netuid does not match for setting root network weights.

### `NotSubnetOwner`

- **interface**: `api.errors.subtensorModule.NotSubnetOwner`
- **summary**: Not a subnet owner.

### `NoWeightsCommitFound`

- **interface**: `api.errors.subtensorModule.NoWeightsCommitFound`
- **summary**: No commit found for the provided hotkey+netuid combination when attempting to reveal the weights.

### `Overflow`

- **interface**: `api.errors.subtensorModule.Overflow`
- **summary**: An overflow occurred.

### `ProportionOverflow`

- **interface**: `api.errors.subtensorModule.ProportionOverflow`
- **summary**: Proportion overflow when setting children.

### `RegistrationNotPermittedOnRootSubnet`

- **interface**: `api.errors.subtensorModule.RegistrationNotPermittedOnRootSubnet`
- **summary**: Operation is not permitted on the root subnet.

### `RegistrationPriceLimitExceeded`

- **interface**: `api.errors.subtensorModule.RegistrationPriceLimitExceeded`
- **summary**: Registration Price Limit Exceeded

### `RevealPeriodTooLarge`

- **interface**: `api.errors.subtensorModule.RevealPeriodTooLarge`
- **summary**: Reveal period is too large.

### `RevealPeriodTooSmall`

- **interface**: `api.errors.subtensorModule.RevealPeriodTooSmall`
- **summary**: Reveal period is too small.

### `RevealTooEarly`

- **interface**: `api.errors.subtensorModule.RevealTooEarly`
- **summary**: Attempted to reveal weights too early.

### `RootNetworkDoesNotExist`

- **interface**: `api.errors.subtensorModule.RootNetworkDoesNotExist`
- **summary**: The root network does not exist.

### `RootStakeLocked`

- **interface**: `api.errors.subtensorModule.RootStakeLocked`
- **summary**: Root (netuid 0) stake is still within its `RootStakeUnlockInterval` hold window (measured from the last root stake add/remove/claim for that coldkey/hotkey) and cannot leave root yet. Prevents epoch-boundary just-in-time dividend sniping.

### `RootWeightSettingDisabled`

- **interface**: `api.errors.subtensorModule.RootWeightSettingDisabled`
- **summary**: `set_root_weights` is disabled network-wide ([`crate::RootWeightSettingEnabled`] is false). Root Reborn launches gated: every fund runs the null strategy (dividends accumulate in place) until weight setting is switched on by governance or a later upgrade.

### `SameAutoStakeHotkeyAlreadySet`

- **interface**: `api.errors.subtensorModule.SameAutoStakeHotkeyAlreadySet`
- **summary**: Same auto stake hotkey already set

### `SameNetuid`

- **interface**: `api.errors.subtensorModule.SameNetuid`
- **summary**: Invalid netuid duplication

### `ServingRateLimitExceeded`

- **interface**: `api.errors.subtensorModule.ServingRateLimitExceeded`
- **summary**: An axon or prometheus serving exceeded the rate limit for a registered neuron.

### `SettingWeightsTooFast`

- **interface**: `api.errors.subtensorModule.SettingWeightsTooFast`
- **summary**: A transactor exceeded the rate limit for setting weights.

### `SlippageTooHigh`

- **interface**: `api.errors.subtensorModule.SlippageTooHigh`
- **summary**: Slippage is too high for the transaction.

### `StakeTooLowForRoot`

- **interface**: `api.errors.subtensorModule.StakeTooLowForRoot`
- **summary**: Retired: root admission is burn-based and no longer stake-gated. Kept so later error variants keep their metadata indices.

### `StakeUnavailable`

- **interface**: `api.errors.subtensorModule.StakeUnavailable`
- **summary**: Trying to unstake or re-lock the locked amount.

### `StakingRateLimitExceeded`

- **interface**: `api.errors.subtensorModule.StakingRateLimitExceeded`
- **summary**: A transactor exceeded the rate limit for staking.

### `StartCallNotReady`

- **interface**: `api.errors.subtensorModule.StartCallNotReady`
- **summary**: Need to wait more blocks to do the start call.

### `SubnetBuybackRateLimitExceeded`

- **interface**: `api.errors.subtensorModule.SubnetBuybackRateLimitExceeded`
- **summary**: Subnet buyback exceeded the operation rate limit

### `SubnetLimitReached`

- **interface**: `api.errors.subtensorModule.SubnetLimitReached`
- **summary**: Subnet limit reached & there is no eligible subnet to prune

### `SubnetNotExists`

- **interface**: `api.errors.subtensorModule.SubnetNotExists`
- **summary**: Trying to perform action on non-existent subnet.

### `SubNetRegistrationDisabled`

- **interface**: `api.errors.subtensorModule.SubNetRegistrationDisabled`
- **summary**: Registration is disabled.

### `SubtokenDisabled`

- **interface**: `api.errors.subtensorModule.SubtokenDisabled`
- **summary**: SubToken disabled now

### `SymbolAlreadyInUse`

- **interface**: `api.errors.subtensorModule.SymbolAlreadyInUse`
- **summary**: Symbol already in use.

### `SymbolDoesNotExist`

- **interface**: `api.errors.subtensorModule.SymbolDoesNotExist`
- **summary**: Symbol does not exist.

### `TempoOutOfBounds`

- **interface**: `api.errors.subtensorModule.TempoOutOfBounds`
- **summary**: The supplied tempo is outside the allowed range.

### `TooManyChildren`

- **interface**: `api.errors.subtensorModule.TooManyChildren`
- **summary**: Too many children MAX 5.

### `TooManyRegistrationsThisBlock`

- **interface**: `api.errors.subtensorModule.TooManyRegistrationsThisBlock`
- **summary**: Number of registrations in this block exceeds the allowed number (i.e., exceeds the subnet hyperparameter "max_regs_per_block").

### `TooManyRegistrationsThisInterval`

- **interface**: `api.errors.subtensorModule.TooManyRegistrationsThisInterval`
- **summary**: The number of registration attempts exceeded the allowed number in the interval.

### `TooManyUIDsPerMechanism`

- **interface**: `api.errors.subtensorModule.TooManyUIDsPerMechanism`
- **summary**: The maximum allowed UIDs times mechanism count should not exceed 256.

### `TooManyUnrevealedCommits`

- **interface**: `api.errors.subtensorModule.TooManyUnrevealedCommits`
- **summary**: Maximum commit limit reached

### `TransactorAccountShouldBeHotKey`

- **interface**: `api.errors.subtensorModule.TransactorAccountShouldBeHotKey`
- **summary**: The hotkey is required to be the origin.

### `TransferDisallowed`

- **interface**: `api.errors.subtensorModule.TransferDisallowed`
- **summary**: Subnet disallows transfer.

### `TrimmingWouldExceedMaxImmunePercentage`

- **interface**: `api.errors.subtensorModule.TrimmingWouldExceedMaxImmunePercentage`
- **summary**: Trimming would exceed the max immune neurons percentage

### `TxChildkeyTakeRateLimitExceeded`

- **interface**: `api.errors.subtensorModule.TxChildkeyTakeRateLimitExceeded`
- **summary**: Childkey take rate limit exceeded.

### `TxRateLimitExceeded`

- **interface**: `api.errors.subtensorModule.TxRateLimitExceeded`
- **summary**: Default transaction rate limit exceeded.

### `UidMapCouldNotBeCleared`

- **interface**: `api.errors.subtensorModule.UidMapCouldNotBeCleared`
- **summary**: The UID map for the subnet could not be cleared

### `UidsLengthExceedUidsInSubNet`

- **interface**: `api.errors.subtensorModule.UidsLengthExceedUidsInSubNet`
- **summary**: The caller is attempting to set weights with more UIDs than allowed.

### `UidVecContainInvalidOne`

- **interface**: `api.errors.subtensorModule.UidVecContainInvalidOne`
- **summary**: The caller is attempting to set weight to at least one UID that does not exist in the metagraph.

### `UnableToRecoverPublicKey`

- **interface**: `api.errors.subtensorModule.UnableToRecoverPublicKey`
- **summary**: Public key cannot be recovered.

### `UnlockAmountTooHigh`

- **interface**: `api.errors.subtensorModule.UnlockAmountTooHigh`
- **summary**: Trying to unlock more than locked

### `VotingPowerTrackingNotEnabled`

- **interface**: `api.errors.subtensorModule.VotingPowerTrackingNotEnabled`
- **summary**: Voting power tracking is not enabled for this subnet.

### `WaitingForDissolvedSubnetCleanup`

- **interface**: `api.errors.subtensorModule.WaitingForDissolvedSubnetCleanup`
- **summary**: Waiting for dissolved subnet cleanup.

### `WeightVecLengthIsLow`

- **interface**: `api.errors.subtensorModule.WeightVecLengthIsLow`
- **summary**: The dispatch is attempting to set weights on chain with fewer elements than are allowed.

### `WeightVecNotEqualSize`

- **interface**: `api.errors.subtensorModule.WeightVecNotEqualSize`
- **summary**: The caller is attempting to set the weight keys and values but these vectors have different size.

### `ZeroBalanceAfterWithdrawn`

- **interface**: `api.errors.subtensorModule.ZeroBalanceAfterWithdrawn`
- **summary**: Unsuccessfully withdraw, balance could be zero (can not make account exist) after withdrawal.


## `sudo` {#pallet-sudo}

### `RequireSudo`

- **interface**: `api.errors.sudo.RequireSudo`
- **summary**: Sender must be the Sudo account.


## `swap` {#pallet-swap}

### `Deprecated`

- **interface**: `api.errors.swap.Deprecated`
- **summary**: The extrinsic is deprecated

### `FeeRateTooHigh`

- **interface**: `api.errors.swap.FeeRateTooHigh`
- **summary**: The fee rate is too high

### `InsufficientBalance`

- **interface**: `api.errors.swap.InsufficientBalance`
- **summary**: The caller does not have enough balance for the operation.

### `InsufficientInputAmount`

- **interface**: `api.errors.swap.InsufficientInputAmount`
- **summary**: The provided amount is insufficient for the swap.

### `InsufficientLiquidity`

- **interface**: `api.errors.swap.InsufficientLiquidity`
- **summary**: The provided liquidity is insufficient for the operation.

### `InvalidLiquidityValue`

- **interface**: `api.errors.swap.InvalidLiquidityValue`
- **summary**: Provided liquidity parameter is invalid (likely too small)

### `InvalidTickRange`

- **interface**: `api.errors.swap.InvalidTickRange`
- **summary**: The provided tick range is invalid.

### `MechanismDoesNotExist`

- **interface**: `api.errors.swap.MechanismDoesNotExist`
- **summary**: The subnet does not exist.

### `PriceLimitExceeded`

- **interface**: `api.errors.swap.PriceLimitExceeded`
- **summary**: The operation would exceed the price limit.

### `ReservesOutOfBalance`

- **interface**: `api.errors.swap.ReservesOutOfBalance`
- **summary**: Swap reserves are too imbalanced

### `ReservesTooLow`

- **interface**: `api.errors.swap.ReservesTooLow`
- **summary**: Reserves too low for operation.

### `SubtokenDisabled`

- **interface**: `api.errors.swap.SubtokenDisabled`
- **summary**: The subnet does not have subtoken enabled

### `SwapInputTooLarge`

- **interface**: `api.errors.swap.SwapInputTooLarge`
- **summary**: Swap input is too large relative to input-side liquidity


## `system` {#pallet-system}

### `CallFiltered`

- **interface**: `api.errors.system.CallFiltered`
- **summary**: The origin filter prevent the call to be dispatched.

### `FailedToExtractRuntimeVersion`

- **interface**: `api.errors.system.FailedToExtractRuntimeVersion`
- **summary**: Failed to extract the runtime version from the new runtime.

    Either calling `Core_version` or decoding `RuntimeVersion` failed.

### `InvalidSpecName`

- **interface**: `api.errors.system.InvalidSpecName`
- **summary**: The name of specification does not match between the current runtime and the new runtime.

### `MultiBlockMigrationsOngoing`

- **interface**: `api.errors.system.MultiBlockMigrationsOngoing`
- **summary**: A multi-block migration is ongoing and prevents the current code from being replaced.

### `NonDefaultComposite`

- **interface**: `api.errors.system.NonDefaultComposite`
- **summary**: Suicide called when the account has non-default composite data.

### `NonZeroRefCount`

- **interface**: `api.errors.system.NonZeroRefCount`
- **summary**: There is a non-zero reference count preventing the account from being purged.

### `NothingAuthorized`

- **interface**: `api.errors.system.NothingAuthorized`
- **summary**: No upgrade authorized.

### `SpecVersionNeedsToIncrease`

- **interface**: `api.errors.system.SpecVersionNeedsToIncrease`
- **summary**: The specification version is not allowed to decrease between the current runtime and the new runtime.

### `Unauthorized`

- **interface**: `api.errors.system.Unauthorized`
- **summary**: The submitted code is not authorized.


## `utility` {#pallet-utility}

### `InvalidDerivedAccount`

- **interface**: `api.errors.utility.InvalidDerivedAccount`
- **summary**: Bad input data for derived account ID

### `TooManyCalls`

- **interface**: `api.errors.utility.TooManyCalls`
- **summary**: Too many calls batched.
