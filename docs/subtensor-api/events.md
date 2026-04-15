---
title: Events
description: "The following page contains runtime events emitted by the Subtensor runtime."
---

# Events

The following page contains runtime events emitted by the Subtensor runtime. Accessible via `api.events.<Pallet>.<EventName>`.

:::info
Generated from a live snapshot of the Subtensor runtime on **2026-04-15**. Connected to: `wss://entrypoint-finney.opentensor.ai:443`
:::

- **[adminUtils](#adminutils)**
- **[balances](#balances)**
- **[baseFee](#basefee)**
- **[commitments](#commitments)**
- **[contracts](#contracts)**
- **[crowdloan](#crowdloan)**
- **[drand](#drand)**
- **[ethereum](#ethereum)**
- **[evm](#evm)**
- **[grandpa](#grandpa)**
- **[mevShield](#mevshield)**
- **[multisig](#multisig)**
- **[preimage](#preimage)**
- **[proxy](#proxy)**
- **[registry](#registry)**
- **[safeMode](#safemode)**
- **[scheduler](#scheduler)**
- **[subtensorModule](#subtensormodule)**
- **[sudo](#sudo)**
- **[swap](#swap)**
- **[system](#system)**
- **[transactionPayment](#transactionpayment)**
- **[utility](#utility)**

## `adminUtils`

### `BondsResetToggled(NetUid, bool)`

- **interface**: `api.events.adminUtils.BondsResetToggled`
- **summary**: Event emitted when Bonds Reset is toggled.

### `PrecompileUpdated(PrecompileEnum, bool)`

- **interface**: `api.events.adminUtils.PrecompileUpdated`
- **summary**: Event emitted when a precompile operation is updated.

### `Yuma3EnableToggled(NetUid, bool)`

- **interface**: `api.events.adminUtils.Yuma3EnableToggled`
- **summary**: Event emitted when the Yuma3 enable is toggled.


## `balances`

### `BalanceSet(AccountId, u128)`

- **interface**: `api.events.balances.BalanceSet`
- **summary**: A balance was set by root.

### `Burned(AccountId, u128)`

- **interface**: `api.events.balances.Burned`
- **summary**: Some amount was burned from an account.

### `Deposit(AccountId, u128)`

- **interface**: `api.events.balances.Deposit`
- **summary**: Some amount was deposited (e.g. for transaction fees).

### `DustLost(AccountId, u128)`

- **interface**: `api.events.balances.DustLost`
- **summary**: An account was removed whose balance was non-zero but below ExistentialDeposit, resulting in an outright loss.

### `Endowed(AccountId, u128)`

- **interface**: `api.events.balances.Endowed`
- **summary**: An account was created with some free balance.

### `Frozen(AccountId, u128)`

- **interface**: `api.events.balances.Frozen`
- **summary**: Some balance was frozen.

### `Issued(u128)`

- **interface**: `api.events.balances.Issued`
- **summary**: Total issuance was increased by `amount`, creating a credit to be balanced.

### `Locked(AccountId, u128)`

- **interface**: `api.events.balances.Locked`
- **summary**: Some balance was locked.

### `Minted(AccountId, u128)`

- **interface**: `api.events.balances.Minted`
- **summary**: Some amount was minted into an account.

### `Rescinded(u128)`

- **interface**: `api.events.balances.Rescinded`
- **summary**: Total issuance was decreased by `amount`, creating a debt to be balanced.

### `Reserved(AccountId, u128)`

- **interface**: `api.events.balances.Reserved`
- **summary**: Some balance was reserved (moved from free to reserved).

### `ReserveRepatriated(AccountId, AccountId, u128, Status)`

- **interface**: `api.events.balances.ReserveRepatriated`
- **summary**: Some balance was moved from the reserve of the first account to the second account. Final argument indicates the destination balance type.

### `Restored(AccountId, u128)`

- **interface**: `api.events.balances.Restored`
- **summary**: Some amount was restored into an account.

### `Slashed(AccountId, u128)`

- **interface**: `api.events.balances.Slashed`
- **summary**: Some amount was removed from the account (e.g. for misbehavior).

### `Suspended(AccountId, u128)`

- **interface**: `api.events.balances.Suspended`
- **summary**: Some amount was suspended from an account (it can be restored later).

### `Thawed(AccountId, u128)`

- **interface**: `api.events.balances.Thawed`
- **summary**: Some balance was thawed.

### `TotalIssuanceForced(u128, u128)`

- **interface**: `api.events.balances.TotalIssuanceForced`
- **summary**: The `TotalIssuance` was forcefully changed.

### `Transfer(AccountId, AccountId, u128)`

- **interface**: `api.events.balances.Transfer`
- **summary**: Transfer succeeded.

### `Unlocked(AccountId, u128)`

- **interface**: `api.events.balances.Unlocked`
- **summary**: Some balance was unlocked.

### `Unreserved(AccountId, u128)`

- **interface**: `api.events.balances.Unreserved`
- **summary**: Some balance was unreserved (moved from reserved to free).

### `Upgraded(AccountId)`

- **interface**: `api.events.balances.Upgraded`
- **summary**: An account was upgraded.

### `Withdraw(AccountId, u128)`

- **interface**: `api.events.balances.Withdraw`
- **summary**: Some amount was withdrawn from the account (e.g. for transaction fees).


## `baseFee`

### `BaseFeeOverflow()`

- **interface**: `api.events.baseFee.BaseFeeOverflow`

### `NewBaseFeePerGas(U256)`

- **interface**: `api.events.baseFee.NewBaseFeePerGas`

### `NewElasticity(Permill)`

- **interface**: `api.events.baseFee.NewElasticity`


## `commitments`

### `Commitment(NetUid, AccountId)`

- **interface**: `api.events.commitments.Commitment`
- **summary**: A commitment was set

### `CommitmentRevealed(NetUid, AccountId)`

- **interface**: `api.events.commitments.CommitmentRevealed`
- **summary**: A timelock-encrypted commitment was auto-revealed

### `TimelockCommitment(NetUid, AccountId, u64)`

- **interface**: `api.events.commitments.TimelockCommitment`
- **summary**: A timelock-encrypted commitment was set


## `contracts`

### `Called(Origin, AccountId)`

- **interface**: `api.events.contracts.Called`
- **summary**: A contract was called either by a plain account or another contract.

    **Note:**

    Please keep in mind that like all events this is only emitted for successful calls. This is because on failure all storage changes including events are rolled back.

### `CodeRemoved(H256, u128, AccountId)`

- **interface**: `api.events.contracts.CodeRemoved`
- **summary**: A code with the specified hash was removed.

### `CodeStored(H256, u128, AccountId)`

- **interface**: `api.events.contracts.CodeStored`
- **summary**: Code with the specified hash has been stored.

### `ContractCodeUpdated(AccountId, H256, H256)`

- **interface**: `api.events.contracts.ContractCodeUpdated`
- **summary**: A contract's code was updated.

### `ContractEmitted(AccountId, Vec<u8>)`

- **interface**: `api.events.contracts.ContractEmitted`
- **summary**: A custom event emitted by the contract.

### `DelegateCalled(AccountId, CodeHash)`

- **interface**: `api.events.contracts.DelegateCalled`
- **summary**: A contract delegate called a code hash.

    **Note:**

    Please keep in mind that like all events this is only emitted for successful calls. This is because on failure all storage changes including events are rolled back.

### `Instantiated(AccountId, AccountId)`

- **interface**: `api.events.contracts.Instantiated`
- **summary**: Contract deployed by address at the specified address.

### `StorageDepositTransferredAndHeld(AccountId, AccountId, u128)`

- **interface**: `api.events.contracts.StorageDepositTransferredAndHeld`
- **summary**: Some funds have been transferred and held as storage deposit.

### `StorageDepositTransferredAndReleased(AccountId, AccountId, u128)`

- **interface**: `api.events.contracts.StorageDepositTransferredAndReleased`
- **summary**: Some storage deposit funds have been transferred and released.

### `Terminated(AccountId, AccountId)`

- **interface**: `api.events.contracts.Terminated`
- **summary**: Contract has been removed.

    **Note:**

    The only way for a contract to be removed and emitting this event is by calling `seal_terminate`.


## `crowdloan`

### `AllRefunded(CrowdloanId)`

- **interface**: `api.events.crowdloan.AllRefunded`
- **summary**: A refund was fully processed for a failed crowdloan.

### `CapUpdated(CrowdloanId, u128)`

- **interface**: `api.events.crowdloan.CapUpdated`
- **summary**: The cap was updated.

### `Contributed(CrowdloanId, AccountId, u128)`

- **interface**: `api.events.crowdloan.Contributed`
- **summary**: A contribution was made to an active crowdloan.

### `Created(CrowdloanId, AccountId, u32, u128)`

- **interface**: `api.events.crowdloan.Created`
- **summary**: A crowdloan was created.

### `Dissolved(CrowdloanId)`

- **interface**: `api.events.crowdloan.Dissolved`
- **summary**: A crowdloan was dissolved.

### `EndUpdated(CrowdloanId, u32)`

- **interface**: `api.events.crowdloan.EndUpdated`
- **summary**: The end was updated.

### `Finalized(CrowdloanId)`

- **interface**: `api.events.crowdloan.Finalized`
- **summary**: A crowdloan was finalized, funds were transferred and the call was dispatched.

### `MinContributionUpdated(CrowdloanId, u128)`

- **interface**: `api.events.crowdloan.MinContributionUpdated`
- **summary**: The minimum contribution was updated.

### `PartiallyRefunded(CrowdloanId)`

- **interface**: `api.events.crowdloan.PartiallyRefunded`
- **summary**: A refund was partially processed for a failed crowdloan.

### `Withdrew(CrowdloanId, AccountId, u128)`

- **interface**: `api.events.crowdloan.Withdrew`
- **summary**: A contribution was withdrawn from a failed crowdloan.


## `drand`

### `BeaconConfigChanged()`

- **interface**: `api.events.drand.BeaconConfigChanged`
- **summary**: Beacon Configuration has changed.

### `NewPulse(Vec<RoundNumber>)`

- **interface**: `api.events.drand.NewPulse`
- **summary**: Successfully set a new pulse(s).

### `SetOldestStoredRound(u64)`

- **interface**: `api.events.drand.SetOldestStoredRound`
- **summary**: Oldest Stored Round has been set.


## `ethereum`

### `Executed(H160, H160, H256, ExitReason, Vec<u8>)`

- **interface**: `api.events.ethereum.Executed`
- **summary**: An ethereum transaction was successfully executed.


## `evm`

### `Created(H160)`

- **interface**: `api.events.evm.Created`
- **summary**: A contract has been created at given address.

### `CreatedFailed(H160)`

- **interface**: `api.events.evm.CreatedFailed`
- **summary**: A contract was attempted to be created, but the execution failed.

### `Executed(H160)`

- **interface**: `api.events.evm.Executed`
- **summary**: A contract has been executed successfully with states applied.

### `ExecutedFailed(H160)`

- **interface**: `api.events.evm.ExecutedFailed`
- **summary**: A contract has been executed with errors. States are reverted with only gas fees applied.

### `Log(Log)`

- **interface**: `api.events.evm.Log`
- **summary**: Ethereum events from contracts.


## `grandpa`

### `NewAuthorities(AuthorityList)`

- **interface**: `api.events.grandpa.NewAuthorities`
- **summary**: New authority set has been applied.

### `Paused()`

- **interface**: `api.events.grandpa.Paused`
- **summary**: Current authority set has been paused.

### `Resumed()`

- **interface**: `api.events.grandpa.Resumed`
- **summary**: Current authority set has been resumed.


## `mevShield`

### `EncryptedSubmitted(H256, AccountId)`

- **interface**: `api.events.mevShield.EncryptedSubmitted`
- **summary**: Encrypted wrapper accepted.


## `multisig`

### `DepositPoked(AccountId, CallHash, u128, u128)`

- **interface**: `api.events.multisig.DepositPoked`
- **summary**: The deposit for a multisig operation has been updated/poked.

### `MultisigApproval(AccountId, Timepoint<BlockNumberFor<T>>, AccountId, CallHash)`

- **interface**: `api.events.multisig.MultisigApproval`
- **summary**: A multisig operation has been approved by someone.

### `MultisigCancelled(AccountId, Timepoint<BlockNumberFor<T>>, AccountId, CallHash)`

- **interface**: `api.events.multisig.MultisigCancelled`
- **summary**: A multisig operation has been cancelled.

### `MultisigExecuted(AccountId, Timepoint<BlockNumberFor<T>>, AccountId, CallHash, DispatchResult)`

- **interface**: `api.events.multisig.MultisigExecuted`
- **summary**: A multisig operation has been executed.

### `NewMultisig(AccountId, AccountId, CallHash)`

- **interface**: `api.events.multisig.NewMultisig`
- **summary**: A new multisig operation has begun.


## `preimage`

### `Cleared(H256)`

- **interface**: `api.events.preimage.Cleared`
- **summary**: A preimage has ben cleared.

### `Noted(H256)`

- **interface**: `api.events.preimage.Noted`
- **summary**: A preimage has been noted.

### `Requested(H256)`

- **interface**: `api.events.preimage.Requested`
- **summary**: A preimage has been requested.


## `proxy`

### `Announced(AccountId, AccountId, CallHashOf)`

- **interface**: `api.events.proxy.Announced`
- **summary**: An announcement was placed to make a call in the future.

### `DepositPoked(AccountId, DepositKind, u128, u128)`

- **interface**: `api.events.proxy.DepositPoked`
- **summary**: A deposit stored for proxies or announcements was poked / updated.

### `ProxyAdded(AccountId, AccountId, T::ProxyType, u32)`

- **interface**: `api.events.proxy.ProxyAdded`
- **summary**: A proxy was added.

### `ProxyExecuted(DispatchResult)`

- **interface**: `api.events.proxy.ProxyExecuted`
- **summary**: A proxy was executed correctly, with the given.

### `ProxyRemoved(AccountId, AccountId, T::ProxyType, u32)`

- **interface**: `api.events.proxy.ProxyRemoved`
- **summary**: A proxy was removed.

### `PureCreated(AccountId, AccountId, T::ProxyType, u16)`

- **interface**: `api.events.proxy.PureCreated`
- **summary**: A pure account has been created by new proxy with given disambiguation index and proxy type.

### `PureKilled(AccountId, AccountId, T::ProxyType, u16)`

- **interface**: `api.events.proxy.PureKilled`
- **summary**: A pure proxy was killed by its spawner.

### `RealPaysFeeSet(AccountId, AccountId, bool)`

- **interface**: `api.events.proxy.RealPaysFeeSet`
- **summary**: The real-pays-fee setting was updated for a proxy relationship.


## `registry`

### `IdentityDissolved(AccountId)`

- **interface**: `api.events.registry.IdentityDissolved`
- **summary**: Emitted when a user dissolves an identity

### `IdentitySet(AccountId)`

- **interface**: `api.events.registry.IdentitySet`
- **summary**: Emitted when a user registers an identity


## `safeMode`

### `CannotDeposit()`

- **interface**: `api.events.safeMode.CannotDeposit`
- **summary**: Could not hold funds for entering or extending the safe-mode.

    This error comes from the underlying `Currency`.

### `CannotRelease()`

- **interface**: `api.events.safeMode.CannotRelease`
- **summary**: Could not release funds for entering or extending the safe-mode.

    This error comes from the underlying `Currency`.

### `DepositPlaced(AccountId, u128)`

- **interface**: `api.events.safeMode.DepositPlaced`
- **summary**: An account reserved funds for either entering or extending the safe-mode.

### `DepositReleased(AccountId, u128)`

- **interface**: `api.events.safeMode.DepositReleased`
- **summary**: An account had a reserve released that was reserved.

### `DepositSlashed(AccountId, u128)`

- **interface**: `api.events.safeMode.DepositSlashed`
- **summary**: An account had reserve slashed that was reserved.

### `Entered(u32)`

- **interface**: `api.events.safeMode.Entered`
- **summary**: The safe-mode was entered until inclusively this block.

### `Exited(ExitReason)`

- **interface**: `api.events.safeMode.Exited`
- **summary**: Exited the safe-mode for a specific reason.

### `Extended(u32)`

- **interface**: `api.events.safeMode.Extended`
- **summary**: The safe-mode was extended until inclusively this block.


## `scheduler`

### `AgendaIncomplete(u32)`

- **interface**: `api.events.scheduler.AgendaIncomplete`
- **summary**: Agenda is incomplete from `when`.

### `CallUnavailable(TaskAddress<BlockNumberFor<T>>, Option<TaskName>)`

- **interface**: `api.events.scheduler.CallUnavailable`
- **summary**: The call for the provided hash was not found so the task has been aborted.

### `Canceled(u32, u32)`

- **interface**: `api.events.scheduler.Canceled`
- **summary**: Canceled some task.

### `Dispatched(TaskAddress<BlockNumberFor<T>>, Option<TaskName>, DispatchResult)`

- **interface**: `api.events.scheduler.Dispatched`
- **summary**: Dispatched some task.

### `PeriodicFailed(TaskAddress<BlockNumberFor<T>>, Option<TaskName>)`

- **interface**: `api.events.scheduler.PeriodicFailed`
- **summary**: The given task was unable to be renewed since the agenda is full at that block.

### `PermanentlyOverweight(TaskAddress<BlockNumberFor<T>>, Option<TaskName>)`

- **interface**: `api.events.scheduler.PermanentlyOverweight`
- **summary**: The given task can never be executed since it is overweight.

### `RetryCancelled(TaskAddress<BlockNumberFor<T>>, Option<TaskName>)`

- **interface**: `api.events.scheduler.RetryCancelled`
- **summary**: Cancel a retry configuration for some task.

### `RetryFailed(TaskAddress<BlockNumberFor<T>>, Option<TaskName>)`

- **interface**: `api.events.scheduler.RetryFailed`
- **summary**: The given task was unable to be retried since the agenda is full at that block or there was not enough weight to reschedule it.

### `RetrySet(TaskAddress<BlockNumberFor<T>>, Option<TaskName>, u32, u8)`

- **interface**: `api.events.scheduler.RetrySet`
- **summary**: Set a retry configuration for some task.

### `Scheduled(u32, u32)`

- **interface**: `api.events.scheduler.Scheduled`
- **summary**: Scheduled some task.


## `subtensorModule`

### `ActivityCutoffSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.ActivityCutoffSet`
- **summary**: an activity cutoff is set for a subnet.

### `AddStakeBurn(NetUid, AccountId, TaoBalance, AlphaBalance)`

- **interface**: `api.events.subtensorModule.AddStakeBurn`
- **summary**: "Add stake and burn" event: alpha token was purchased and burned.

### `AdjustmentAlphaSet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.AdjustmentAlphaSet`
- **summary**: setting the adjustment alpha on a subnet.

### `AdjustmentIntervalSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.AdjustmentIntervalSet`
- **summary**: the adjustment interval is set for a subnet.

### `AdminFreezeWindowSet(u16)`

- **interface**: `api.events.subtensorModule.AdminFreezeWindowSet`
- **summary**: setting the admin freeze window length (last N blocks of tempo)

### `AllBalanceUnstakedAndTransferredToNewColdkey(AccountId, AccountId, AccountId,>>::Balance)`

- **interface**: `api.events.subtensorModule.AllBalanceUnstakedAndTransferredToNewColdkey`
- **summary**: All balance of a hotkey has been unstaked and transferred to a new coldkey

### `AlphaBurned(AccountId, AccountId, AlphaBalance, NetUid)`

- **interface**: `api.events.subtensorModule.AlphaBurned`
- **summary**: Alpha have been burned without reducing AlphaOut.

    **Parameters:**

    (coldkey, hotkey, amount, subnet_id)

### `AlphaRecycled(AccountId, AccountId, AlphaBalance, NetUid)`

- **interface**: `api.events.subtensorModule.AlphaRecycled`
- **summary**: Alpha has been recycled, reducing AlphaOut on a subnet.

    **Parameters:**

    (coldkey, hotkey, amount, subnet_id)

### `AlphaSigmoidSteepnessSet(NetUid, i16)`

- **interface**: `api.events.subtensorModule.AlphaSigmoidSteepnessSet`
- **summary**: steepness of the sigmoid used to compute alpha values.

### `ArbitrationPeriodExtended(AccountId)`

- **interface**: `api.events.subtensorModule.ArbitrationPeriodExtended`
- **summary**: The arbitration period has been extended

### `AutoStakeAdded(NetUid, AccountId, AccountId, AccountId, AlphaBalance)`

- **interface**: `api.events.subtensorModule.AutoStakeAdded`
- **summary**: Auto-staking hotkey received stake

### `AutoStakeDestinationSet(AccountId, NetUid, AccountId)`

- **interface**: `api.events.subtensorModule.AutoStakeDestinationSet`
- **summary**: The auto stake destination has been set.

    - **coldkey**: The account ID of the coldkey.
    - **netuid**: The network identifier.
    - **hotkey**: The account ID of the hotkey.

### `AxonServed(NetUid, AccountId)`

- **interface**: `api.events.subtensorModule.AxonServed`
- **summary**: the axon server information is added to the network.

### `BatchCompletedWithErrors()`

- **interface**: `api.events.subtensorModule.BatchCompletedWithErrors`
- **summary**: A batch extrinsic completed but with some errors.

### `BatchWeightItemFailed(sp_runtime::DispatchError)`

- **interface**: `api.events.subtensorModule.BatchWeightItemFailed`
- **summary**: A weight set among a batch of weights failed.

    - **error**: The dispatch error emitted by the failed item.

### `BatchWeightsCompleted(Vec<Compact<NetUid>>, AccountId)`

- **interface**: `api.events.subtensorModule.BatchWeightsCompleted`
- **summary**: A batch of weights (or commits) have been force-set.

    - **netuids**: The netuids these weights were successfully set/committed for.
    - **who**: The hotkey that set this batch.

### `BondsMovingAverageSet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.BondsMovingAverageSet`
- **summary**: bonds moving average is set for a subnet.

### `BondsPenaltySet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.BondsPenaltySet`
- **summary**: bonds penalty is set for a subnet.

### `BondsResetOnSet(NetUid, bool)`

- **interface**: `api.events.subtensorModule.BondsResetOnSet`
- **summary**: bonds reset is set for a subnet.

### `BulkBalancesSet(u16, u16)`

- **interface**: `api.events.subtensorModule.BulkBalancesSet`
- **summary**: FIXME: Not used yet

### `BulkNeuronsRegistered(u16, u16)`

- **interface**: `api.events.subtensorModule.BulkNeuronsRegistered`
- **summary**: multiple uids have been concurrently registered.

### `BurnSet(NetUid, TaoBalance)`

- **interface**: `api.events.subtensorModule.BurnSet`
- **summary**: setting burn on a network.

### `ChainIdentitySet(AccountId)`

- **interface**: `api.events.subtensorModule.ChainIdentitySet`
- **summary**: The identity of a coldkey has been set

### `ChildKeyTakeSet(AccountId, u16)`

- **interface**: `api.events.subtensorModule.ChildKeyTakeSet`
- **summary**: childkey take set

### `ColdkeySwapAnnounced(AccountId, H256)`

- **interface**: `api.events.subtensorModule.ColdkeySwapAnnounced`
- **summary**: A coldkey swap announcement has been made.

### `ColdkeySwapAnnouncementDelaySet(u32)`

- **interface**: `api.events.subtensorModule.ColdkeySwapAnnouncementDelaySet`
- **summary**: The coldkey swap announcement delay has been set.

### `ColdkeySwapCleared(AccountId)`

- **interface**: `api.events.subtensorModule.ColdkeySwapCleared`
- **summary**: A coldkey swap announcement has been cleared.

### `ColdkeySwapDisputed(AccountId)`

- **interface**: `api.events.subtensorModule.ColdkeySwapDisputed`
- **summary**: A coldkey swap has been disputed.

### `ColdkeySwapped(AccountId, AccountId)`

- **interface**: `api.events.subtensorModule.ColdkeySwapped`
- **summary**: A coldkey has been swapped.

### `ColdkeySwapReannouncementDelaySet(u32)`

- **interface**: `api.events.subtensorModule.ColdkeySwapReannouncementDelaySet`
- **summary**: The coldkey swap reannouncement delay has been set.

### `ColdkeySwapReset(AccountId)`

- **interface**: `api.events.subtensorModule.ColdkeySwapReset`
- **summary**: A coldkey swap has been reset.

### `CommitRevealEnabled(NetUid, bool)`

- **interface**: `api.events.subtensorModule.CommitRevealEnabled`
- **summary**: Commit-Reveal has been successfully toggled.

    - **netuid**: The network identifier.
    - **Enabled**: Is Commit-Reveal enabled.

### `CommitRevealPeriodsSet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.CommitRevealPeriodsSet`
- **summary**: Commit-Reveal periods has been successfully set.

    - **netuid**: The network identifier.
    - **periods**: The number of epochs before the reveal.

### `CommitRevealVersionSet(u16)`

- **interface**: `api.events.subtensorModule.CommitRevealVersionSet`
- **summary**: Commit Reveal Weights version has been updated.

    - **version**: The required version.

### `CRV3WeightsCommitted(AccountId, NetUidStorageIndex, H256)`

- **interface**: `api.events.subtensorModule.CRV3WeightsCommitted`
- **summary**: Commit-reveal v3 weights have been successfully committed.

    - **who**: The account ID of the user committing the weights.
    - **netuid**: The network identifier.
    - **commit_hash**: The hash representing the committed weights.

### `CRV3WeightsRevealed(NetUid, AccountId)`

- **interface**: `api.events.subtensorModule.CRV3WeightsRevealed`
- **summary**: CRV3 Weights have been successfully revealed.

    - **netuid**: The network identifier.
    - **who**: The account ID of the user revealing the weights.

### `DefaultTakeSet(u16)`

- **interface**: `api.events.subtensorModule.DefaultTakeSet`
- **summary**: the default take is set.

### `DelegateAdded(AccountId, AccountId, u16)`

- **interface**: `api.events.subtensorModule.DelegateAdded`
- **summary**: a hotkey has become a delegate.

### `DifficultySet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.DifficultySet`
- **summary**: the difficulty has been set for a subnet.

### `DissolveNetworkScheduled(AccountId, NetUid, u32)`

- **interface**: `api.events.subtensorModule.DissolveNetworkScheduled`
- **summary**: A dissolve network extrinsic scheduled.

### `DissolveNetworkScheduleDurationSet(u32)`

- **interface**: `api.events.subtensorModule.DissolveNetworkScheduleDurationSet`
- **summary**: The duration of dissolve network has been set

### `EvmKeyAssociated(NetUid, AccountId, H160, u64)`

- **interface**: `api.events.subtensorModule.EvmKeyAssociated`
- **summary**: An EVM key has been associated with a hotkey.

### `Faucet(AccountId, u64)`

- **interface**: `api.events.subtensorModule.Faucet`
- **summary**: the faucet it called on the test net.

### `FirstEmissionBlockNumberSet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.FirstEmissionBlockNumberSet`
- **summary**: FirstEmissionBlockNumber is set via start call extrinsic

    **Parameters:**

    netuid block number

### `HotkeySwapped(AccountId, AccountId, AccountId)`

- **interface**: `api.events.subtensorModule.HotkeySwapped`
- **summary**: the hotkey is swapped

### `HotkeySwappedOnSubnet(AccountId, AccountId, AccountId, NetUid)`

- **interface**: `api.events.subtensorModule.HotkeySwappedOnSubnet`
- **summary**: the hotkey is swapped

### `ImmunityPeriodSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.ImmunityPeriodSet`
- **summary**: immunity period is set for a subnet.

### `IncentiveAlphaEmittedToMiners(NetUidStorageIndex, Vec<AlphaBalance>)`

- **interface**: `api.events.subtensorModule.IncentiveAlphaEmittedToMiners`
- **summary**: End-of-epoch miner incentive alpha by UID

### `KappaSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.KappaSet`
- **summary**: Kappa is set for a subnet.

### `MaxAllowedUidsSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.MaxAllowedUidsSet`
- **summary**: max allowed uids has been set for a subnetwork.

### `MaxAllowedValidatorsSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.MaxAllowedValidatorsSet`
- **summary**: setting the max number of allowed validators on a subnet.

### `MaxBurnSet(NetUid, TaoBalance)`

- **interface**: `api.events.subtensorModule.MaxBurnSet`
- **summary**: setting max burn on a network.

### `MaxChildKeyTakeSet(u16)`

- **interface**: `api.events.subtensorModule.MaxChildKeyTakeSet`
- **summary**: maximum childkey take set

### `MaxDelegateTakeSet(u16)`

- **interface**: `api.events.subtensorModule.MaxDelegateTakeSet`
- **summary**: maximum delegate take is set by sudo/admin transaction

### `MaxDifficultySet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.MaxDifficultySet`
- **summary**: setting max difficulty on a network.

### `MaxRegistrationsPerBlockSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.MaxRegistrationsPerBlockSet`
- **summary**: we set max registrations per block.

### `MaxWeightLimitSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.MaxWeightLimitSet`
- **summary**: DEPRECATED: max weight limit updates are no longer supported.

### `MinAllowedUidsSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.MinAllowedUidsSet`
- **summary**: The minimum allowed UIDs for a subnet have been set.

### `MinAllowedWeightSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.MinAllowedWeightSet`
- **summary**: minimum allowed weight is set for a subnet.

### `MinBurnSet(NetUid, TaoBalance)`

- **interface**: `api.events.subtensorModule.MinBurnSet`
- **summary**: setting min burn on a network.

### `MinChildKeyTakeSet(u16)`

- **interface**: `api.events.subtensorModule.MinChildKeyTakeSet`
- **summary**: minimum childkey take set

### `MinDelegateTakeSet(u16)`

- **interface**: `api.events.subtensorModule.MinDelegateTakeSet`
- **summary**: minimum delegate take is set by sudo/admin transaction

### `MinDifficultySet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.MinDifficultySet`
- **summary**: setting min difficulty on a network.

### `MinNonImmuneUidsSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.MinNonImmuneUidsSet`
- **summary**: The minimum allowed non-Immune UIDs has been set.

### `NetworkAdded(NetUid, u16)`

- **interface**: `api.events.subtensorModule.NetworkAdded`
- **summary**: a new network is added.

### `NetworkImmunityPeriodSet(u64)`

- **interface**: `api.events.subtensorModule.NetworkImmunityPeriodSet`
- **summary**: the network immunity period is set.

### `NetworkLockCostReductionIntervalSet(u64)`

- **interface**: `api.events.subtensorModule.NetworkLockCostReductionIntervalSet`
- **summary**: the lock cost reduction is set

### `NetworkMinLockCostSet(TaoBalance)`

- **interface**: `api.events.subtensorModule.NetworkMinLockCostSet`
- **summary**: the network minimum locking cost is set.

### `NetworkRateLimitSet(u64)`

- **interface**: `api.events.subtensorModule.NetworkRateLimitSet`
- **summary**: the network creation rate limit is set.

### `NetworkRemoved(NetUid)`

- **interface**: `api.events.subtensorModule.NetworkRemoved`
- **summary**: a network is removed.

### `NeuronRegistered(NetUid, u16, AccountId)`

- **interface**: `api.events.subtensorModule.NeuronRegistered`
- **summary**: a new neuron account has been registered to the chain.

### `OwnerHyperparamRateLimitSet(u16)`

- **interface**: `api.events.subtensorModule.OwnerHyperparamRateLimitSet`
- **summary**: setting the owner hyperparameter rate limit in epochs

### `PowRegistrationAllowed(NetUid, bool)`

- **interface**: `api.events.subtensorModule.PowRegistrationAllowed`
- **summary**: POW registration is allowed/disallowed for a subnet.

### `PrometheusServed(NetUid, AccountId)`

- **interface**: `api.events.subtensorModule.PrometheusServed`
- **summary**: the prometheus server information is added to the network.

### `RAORecycledForRegistrationSet(NetUid, TaoBalance)`

- **interface**: `api.events.subtensorModule.RAORecycledForRegistrationSet`
- **summary**: setting the RAO recycled for registration.

### `RegistrationAllowed(NetUid, bool)`

- **interface**: `api.events.subtensorModule.RegistrationAllowed`
- **summary**: registration is allowed/disallowed for a subnet.

### `RegistrationPerIntervalSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.RegistrationPerIntervalSet`
- **summary**: registration per interval is set for a subnet.

### `RhoSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.RhoSet`
- **summary**: Rho value is set.

### `RootClaimed(AccountId)`

- **interface**: `api.events.subtensorModule.RootClaimed`
- **summary**: Root emissions have been claimed for a coldkey on all subnets and hotkeys.

    **Parameters:**

    (coldkey)

### `RootClaimTypeSet(AccountId, RootClaimTypeEnum)`

- **interface**: `api.events.subtensorModule.RootClaimTypeSet`
- **summary**: Root claim type for a coldkey has been set.

    **Parameters:**

    (coldkey, u8)

### `ScalingLawPowerSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.ScalingLawPowerSet`
- **summary**: the scaling law power has been set for a subnet.

### `ServingRateLimitSet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.ServingRateLimitSet`
- **summary**: setting the prometheus serving rate limit.

### `SetChildren(AccountId, NetUid, Vec<(u64, T::AccountId)>)`

- **interface**: `api.events.subtensorModule.SetChildren`
- **summary**: The children of a hotkey have been set

### `SetChildrenScheduled(AccountId, NetUid, u64, Vec<(u64, T::AccountId)>)`

- **interface**: `api.events.subtensorModule.SetChildrenScheduled`
- **summary**: Setting of children of a hotkey have been scheduled

### `StakeAdded(AccountId, AccountId, TaoBalance, AlphaBalance, NetUid, u64)`

- **interface**: `api.events.subtensorModule.StakeAdded`
- **summary**: stake has been transferred from the a coldkey account onto the hotkey staking account.

### `StakeMoved(AccountId, AccountId, NetUid, AccountId, NetUid, TaoBalance)`

- **interface**: `api.events.subtensorModule.StakeMoved`
- **summary**: stake has been moved from origin (hotkey, subnet ID) to destination (hotkey, subnet ID) of this amount (in TAO).

### `StakeRemoved(AccountId, AccountId, TaoBalance, AlphaBalance, NetUid, u64)`

- **interface**: `api.events.subtensorModule.StakeRemoved`
- **summary**: stake has been removed from the hotkey staking account onto the coldkey account.

### `StakeSwapped(AccountId, AccountId, NetUid, NetUid, TaoBalance)`

- **interface**: `api.events.subtensorModule.StakeSwapped`
- **summary**: Stake has been swapped from one subnet to another for the same coldkey-hotkey pair.

    **Parameters:**

    (coldkey, hotkey, origin_netuid, destination_netuid, amount)

### `StakeThresholdSet(u64)`

- **interface**: `api.events.subtensorModule.StakeThresholdSet`
- **summary**: min stake is set for validators to set weights.

### `StakeTransferred(AccountId, AccountId, AccountId, NetUid, NetUid, TaoBalance)`

- **interface**: `api.events.subtensorModule.StakeTransferred`
- **summary**: Stake has been transferred from one coldkey to another on the same subnet.

    **Parameters:**

    (origin_coldkey, destination_coldkey, hotkey, origin_netuid, destination_netuid, amount)

### `StartCallDelaySet(u64)`

- **interface**: `api.events.subtensorModule.StartCallDelaySet`
- **summary**: the start call delay is set.

### `SubnetIdentityRemoved(NetUid)`

- **interface**: `api.events.subtensorModule.SubnetIdentityRemoved`
- **summary**: The identity of a subnet has been removed

### `SubnetIdentitySet(NetUid)`

- **interface**: `api.events.subtensorModule.SubnetIdentitySet`
- **summary**: The identity of a subnet has been set

### `SubnetLeaseCreated(AccountId, LeaseId, NetUid, Option<BlockNumberFor<T>>)`

- **interface**: `api.events.subtensorModule.SubnetLeaseCreated`
- **summary**: A subnet lease has been created.

### `SubnetLeaseDividendsDistributed(LeaseId, AccountId, AlphaBalance)`

- **interface**: `api.events.subtensorModule.SubnetLeaseDividendsDistributed`
- **summary**: Subnet lease dividends have been distributed.

### `SubnetLeaseTerminated(AccountId, NetUid)`

- **interface**: `api.events.subtensorModule.SubnetLeaseTerminated`
- **summary**: A subnet lease has been terminated.

### `SubnetLimitSet(u16)`

- **interface**: `api.events.subtensorModule.SubnetLimitSet`
- **summary**: the maximum number of subnets is set

### `SubnetOwnerCutSet(u16)`

- **interface**: `api.events.subtensorModule.SubnetOwnerCutSet`
- **summary**: the subnet owner cut is set.

### `SubnetOwnerHotkeySet(NetUid, AccountId)`

- **interface**: `api.events.subtensorModule.SubnetOwnerHotkeySet`
- **summary**: The owner hotkey for a subnet has been set.

    **Parameters:**

    (netuid, new_hotkey)

### `Sudid(DispatchResult)`

- **interface**: `api.events.subtensorModule.Sudid`
- **summary**: a sudo call is done.

### `SymbolUpdated(NetUid, Vec<u8>)`

- **interface**: `api.events.subtensorModule.SymbolUpdated`
- **summary**: The symbol for a subnet has been updated.

### `TakeDecreased(AccountId, AccountId, u16)`

- **interface**: `api.events.subtensorModule.TakeDecreased`
- **summary**: the take for a delegate is decreased.

### `TakeIncreased(AccountId, AccountId, u16)`

- **interface**: `api.events.subtensorModule.TakeIncreased`
- **summary**: the take for a delegate is increased.

### `TempoSet(NetUid, u16)`

- **interface**: `api.events.subtensorModule.TempoSet`
- **summary**: setting tempo on a network

### `TimelockedWeightsCommitted(AccountId, NetUidStorageIndex, H256, u64)`

- **interface**: `api.events.subtensorModule.TimelockedWeightsCommitted`
- **summary**: Timelocked weights have been successfully committed.

    - **who**: The account ID of the user committing the weights.
    - **netuid**: The network identifier.
    - **commit_hash**: The hash representing the committed weights.
    - **reveal_round**: The round at which weights can be revealed.

### `TimelockedWeightsRevealed(NetUidStorageIndex, AccountId)`

- **interface**: `api.events.subtensorModule.TimelockedWeightsRevealed`
- **summary**: Timelocked Weights have been successfully revealed.

    - **netuid**: The network identifier.
    - **who**: The account ID of the user revealing the weights.

### `TransferToggle(NetUid, bool)`

- **interface**: `api.events.subtensorModule.TransferToggle`
- **summary**: Event called when transfer is toggled on a subnet.

    **Parameters:**

    (netuid, bool)

### `TxChildKeyTakeRateLimitSet(u64)`

- **interface**: `api.events.subtensorModule.TxChildKeyTakeRateLimitSet`
- **summary**: setting the childkey take transaction rate limit.

### `TxDelegateTakeRateLimitSet(u64)`

- **interface**: `api.events.subtensorModule.TxDelegateTakeRateLimitSet`
- **summary**: setting the delegate take transaction rate limit.

### `TxRateLimitSet(u64)`

- **interface**: `api.events.subtensorModule.TxRateLimitSet`
- **summary**: setting the transaction rate limit.

### `ValidatorPruneLenSet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.ValidatorPruneLenSet`
- **summary**: the validator pruning length has been set.

### `VotingPowerEmaAlphaSet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.VotingPowerEmaAlphaSet`
- **summary**: Voting power EMA alpha has been set for a subnet.

### `VotingPowerTrackingDisabled(NetUid)`

- **interface**: `api.events.subtensorModule.VotingPowerTrackingDisabled`
- **summary**: Voting power tracking has been fully disabled and entries cleared.

### `VotingPowerTrackingDisableScheduled(NetUid, u64)`

- **interface**: `api.events.subtensorModule.VotingPowerTrackingDisableScheduled`
- **summary**: Voting power tracking has been scheduled for disabling. Tracking will continue until disable_at_block, then stop and clear entries.

### `VotingPowerTrackingEnabled(NetUid)`

- **interface**: `api.events.subtensorModule.VotingPowerTrackingEnabled`
- **summary**: Voting power tracking has been enabled for a subnet.

### `WeightsBatchRevealed(AccountId, NetUid, Vec<H256>)`

- **interface**: `api.events.subtensorModule.WeightsBatchRevealed`
- **summary**: Weights have been successfully batch revealed.

    - **who**: The account ID of the user revealing the weights.
    - **netuid**: The network identifier.
    - **revealed_hashes**: A vector of hashes representing each revealed weight set.

### `WeightsCommitted(AccountId, NetUidStorageIndex, H256)`

- **interface**: `api.events.subtensorModule.WeightsCommitted`
- **summary**: Weights have been successfully committed.

    - **who**: The account ID of the user committing the weights.
    - **netuid**: The network identifier.
    - **commit_hash**: The hash representing the committed weights.

### `WeightsRevealed(AccountId, NetUidStorageIndex, H256)`

- **interface**: `api.events.subtensorModule.WeightsRevealed`
- **summary**: Weights have been successfully revealed.

    - **who**: The account ID of the user revealing the weights.
    - **netuid**: The network identifier.
    - **commit_hash**: The hash of the revealed weights.

### `WeightsSet(NetUidStorageIndex, u16)`

- **interface**: `api.events.subtensorModule.WeightsSet`
- **summary**: a caller successfully sets their weights on a subnetwork.

### `WeightsSetRateLimitSet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.WeightsSetRateLimitSet`
- **summary**: weights set rate limit has been set for a subnet.

### `WeightsVersionKeySet(NetUid, u64)`

- **interface**: `api.events.subtensorModule.WeightsVersionKeySet`
- **summary**: weights version key is set for a network.


## `sudo`

### `KeyChanged(Option<T::AccountId>, AccountId)`

- **interface**: `api.events.sudo.KeyChanged`
- **summary**: The sudo key has been updated.

### `KeyRemoved()`

- **interface**: `api.events.sudo.KeyRemoved`
- **summary**: The key was permanently removed.

### `Sudid(DispatchResult)`

- **interface**: `api.events.sudo.Sudid`
- **summary**: A sudo call just took place.

### `SudoAsDone(DispatchResult)`

- **interface**: `api.events.sudo.SudoAsDone`
- **summary**: A sudo_as call just took place.


## `swap`

### `FeeRateSet(NetUid, u16)`

- **interface**: `api.events.swap.FeeRateSet`
- **summary**: Event emitted when the fee rate has been updated for a subnet

### `LiquidityAdded(AccountId, AccountId, NetUid, PositionId, u64, TaoBalance, AlphaBalance, TickIndex, TickIndex)`

- **interface**: `api.events.swap.LiquidityAdded`
- **summary**: Event emitted when a liquidity position is added to a subnet's liquidity pool.

### `LiquidityModified(AccountId, AccountId, NetUid, PositionId, i64, i64, i64, TaoBalance, AlphaBalance, TickIndex, TickIndex)`

- **interface**: `api.events.swap.LiquidityModified`
- **summary**: Event emitted when a liquidity position is modified in a subnet's liquidity pool. Modifying causes the fees to be claimed.

### `LiquidityRemoved(AccountId, AccountId, NetUid, PositionId, u64, TaoBalance, AlphaBalance, TaoBalance, AlphaBalance, TickIndex, TickIndex)`

- **interface**: `api.events.swap.LiquidityRemoved`
- **summary**: Event emitted when a liquidity position is removed from a subnet's liquidity pool.

### `UserLiquidityToggled(NetUid, bool)`

- **interface**: `api.events.swap.UserLiquidityToggled`
- **summary**: Event emitted when user liquidity operations are enabled for a subnet. First enable even indicates a switch from V2 to V3 swap.


## `system`

### `CodeUpdated()`

- **interface**: `api.events.system.CodeUpdated`
- **summary**: `:code` was updated.

### `ExtrinsicFailed(DispatchError, DispatchEventInfo)`

- **interface**: `api.events.system.ExtrinsicFailed`
- **summary**: An extrinsic failed.

### `ExtrinsicSuccess(DispatchEventInfo)`

- **interface**: `api.events.system.ExtrinsicSuccess`
- **summary**: An extrinsic completed successfully.

### `KilledAccount(AccountId)`

- **interface**: `api.events.system.KilledAccount`
- **summary**: An account was reaped.

### `NewAccount(AccountId)`

- **interface**: `api.events.system.NewAccount`
- **summary**: A new account was created.

### `RejectedInvalidAuthorizedUpgrade(H256, DispatchError)`

- **interface**: `api.events.system.RejectedInvalidAuthorizedUpgrade`
- **summary**: An invalid authorized upgrade was rejected while trying to apply it.

### `Remarked(AccountId, H256)`

- **interface**: `api.events.system.Remarked`
- **summary**: On on-chain remark happened.

### `UpgradeAuthorized(H256, bool)`

- **interface**: `api.events.system.UpgradeAuthorized`
- **summary**: An upgrade was authorized.


## `transactionPayment`

### `TransactionFeePaid(AccountId, u128, u128)`

- **interface**: `api.events.transactionPayment.TransactionFeePaid`
- **summary**: A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee, has been paid by `who`.


## `utility`

### `BatchCompleted()`

- **interface**: `api.events.utility.BatchCompleted`
- **summary**: Batch of dispatches completed fully with no error.

### `BatchCompletedWithErrors()`

- **interface**: `api.events.utility.BatchCompletedWithErrors`
- **summary**: Batch of dispatches completed but has errors.

### `BatchInterrupted(u32, DispatchError)`

- **interface**: `api.events.utility.BatchInterrupted`
- **summary**: Batch of dispatches did not complete fully. Index of first failing dispatch given, as well as the error.

### `DispatchedAs(DispatchResult)`

- **interface**: `api.events.utility.DispatchedAs`
- **summary**: A call was dispatched.

### `IfElseFallbackCalled(DispatchError)`

- **interface**: `api.events.utility.IfElseFallbackCalled`
- **summary**: The fallback call was dispatched.

### `IfElseMainSuccess()`

- **interface**: `api.events.utility.IfElseMainSuccess`
- **summary**: Main call was dispatched.

### `ItemCompleted()`

- **interface**: `api.events.utility.ItemCompleted`
- **summary**: A single item within a Batch of dispatches has completed with no error.

### `ItemFailed(DispatchError)`

- **interface**: `api.events.utility.ItemFailed`
- **summary**: A single item within a Batch of dispatches has completed with error.
