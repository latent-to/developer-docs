---
title: Constants
description: "This page contains compile-time runtime constants for the Subtensor runtime and their respective values."
---

# Constants

This page contains compile-time runtime constants for the Subtensor runtime and their respective values. Accessible via `api.consts.<Pallet>.<constant_name>`. Values read live from node.

:::info
Generated from Subtensor runtime spec version **432**. Connected to: `wss://entrypoint-finney.opentensor.ai:443`
:::

- **[aura](#aura)**
- **[balances](#balances)**
- **[commitments](#commitments)**
- **[contracts](#contracts)**
- **[crowdloan](#crowdloan)**
- **[drand](#drand)**
- **[grandpa](#grandpa)**
- **[limitOrders](#limitorders)**
- **[multisig](#multisig)**
- **[proxy](#proxy)**
- **[safeMode](#safemode)**
- **[scheduler](#scheduler)**
- **[subtensorModule](#subtensormodule)**
- **[swap](#swap)**
- **[system](#system)**
- **[timestamp](#timestamp)**
- **[transactionPayment](#transactionpayment)**
- **[utility](#utility)**

## `aura`

### `slotDuration`: `u64`

- **interface**: `api.consts.aura.slotDuration`
- **value**: `12000`
- **summary**: The slot duration Aura should run with, expressed in milliseconds. The effective value of this type should not change while the chain is running.

    For backwards compatibility either use [`MinimumPeriodTimesTwo`] or a const.


## `balances`

### `existentialDeposit`: `u64`

- **interface**: `api.consts.balances.existentialDeposit`
- **value**: `500`
- **summary**: The minimum amount required to keep an account open. MUST BE GREATER THAN ZERO!

    If you *really* need it to be zero, you can enable the feature `insecure_zero_ed` for this pallet. However, you do so at your own risk: this will open up a major DoS vector. In case you have multiple sources of provider references, you may also get unexpected behaviour if you set this to zero.

    Bottom line: Do yourself a favour and make it at least one!

### `maxFreezes`: `u32`

- **interface**: `api.consts.balances.maxFreezes`
- **value**: `50`
- **summary**: The maximum number of individual freeze locks that can exist on an account at any time.

### `maxLocks`: `u32`

- **interface**: `api.consts.balances.maxLocks`
- **value**: `50`
- **summary**: The maximum number of locks that should exist on an account. Not strictly enforced, but used for weight estimation.

    Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`

### `maxReserves`: `u32`

- **interface**: `api.consts.balances.maxReserves`
- **value**: `50`
- **summary**: The maximum number of named reserves that can exist on an account.

    Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`


## `commitments`

### `fieldDeposit`: `u64`

- **interface**: `api.consts.commitments.fieldDeposit`
- **value**: `0`
- **summary**: The amount held on deposit per additional field for a registered identity.

### `initialDeposit`: `u64`

- **interface**: `api.consts.commitments.initialDeposit`
- **value**: `0`
- **summary**: The amount held on deposit for a registered identity

### `maxFields`: `u32`

- **interface**: `api.consts.commitments.maxFields`
- **value**: `3`
- **summary**: The maximum number of additional fields that can be added to a commitment


## `contracts`

### `apiVersion`: `u16`

- **interface**: `api.consts.contracts.apiVersion`
- **value**: `4`
- **summary**: The version of the HostFn APIs that are available in the runtime.

    Only valid value is `()`.

### `codeHashLockupDepositPercent`: `Perbill`

- **interface**: `api.consts.contracts.codeHashLockupDepositPercent`
- **value**: `300000000`
- **summary**: The percentage of the storage deposit that should be held for using a code hash. Instantiating a contract, or calling [`chain_extension::Ext::lock_delegate_dependency`] protects the code from being removed. In order to prevent abuse these actions are protected with a percentage of the code deposit.

### `defaultDepositLimit`: `u64`

- **interface**: `api.consts.contracts.defaultDepositLimit`
- **value**: `31534080`
- **summary**: Fallback value to limit the storage deposit if it's not being set by the caller.

### `depositPerByte`: `u64`

- **interface**: `api.consts.contracts.depositPerByte`
- **value**: `30`
- **summary**: The amount of balance a caller has to pay for each byte of storage.

    **Note:**

    Changing this value for an existing chain might need a storage migration.

### `depositPerItem`: `u64`

- **interface**: `api.consts.contracts.depositPerItem`
- **value**: `75`
- **summary**: The amount of balance a caller has to pay for each storage item.

    **Note:**

    Changing this value for an existing chain might need a storage migration.

### `environment`: `{"_alias":{"hash_":"hash"},"accountId":"PalletContractsEnvironmentTypeAccountId32","balance":"PalletContractsEnvironmentTypeTaoBalance","hash_":"PalletContractsEnvironmentTypeH256","hasher":"PalletContractsEnvironmentTypeBlakeTwo256","timestamp":"PalletContractsEnvironmentTypeU64","blockNumber":"PalletContractsEnvironmentTypeU32"}`

- **interface**: `api.consts.contracts.environment`
- **value**: `{"accountId":null,"balance":null,"hash":null,"hasher":null,"timestamp":null,"blockNumber":null}`
- **summary**: Type that bundles together all the runtime configurable interface types.

    This is not a real config. We just mention the type here as constant so that its type appears in the metadata. Only valid value is `()`.

### `maxCodeLen`: `u32`

- **interface**: `api.consts.contracts.maxCodeLen`
- **value**: `131072`
- **summary**: The maximum length of a contract code in bytes.

    The value should be chosen carefully taking into the account the overall memory limit your runtime has, as well as the [maximum allowed callstack depth](#associatedtype.CallStack). Look into the `integrity_test()` for some insights.

### `maxDebugBufferLen`: `u32`

- **interface**: `api.consts.contracts.maxDebugBufferLen`
- **value**: `2097152`
- **summary**: The maximum length of the debug buffer in bytes.

### `maxDelegateDependencies`: `u32`

- **interface**: `api.consts.contracts.maxDelegateDependencies`
- **value**: `32`
- **summary**: The maximum number of delegate_dependencies that a contract can lock with [`chain_extension::Ext::lock_delegate_dependency`].

### `maxStorageKeyLen`: `u32`

- **interface**: `api.consts.contracts.maxStorageKeyLen`
- **value**: `128`
- **summary**: The maximum allowable length in bytes for storage keys.

### `maxTransientStorageSize`: `u32`

- **interface**: `api.consts.contracts.maxTransientStorageSize`
- **value**: `1048576`
- **summary**: The maximum size of the transient storage in bytes. This includes keys, values, and previous entries used for storage rollback.

### `schedule`: `{"limits":"PalletContractsScheduleLimits","instructionWeights":"PalletContractsScheduleInstructionWeights"}`

- **interface**: `api.consts.contracts.schedule`
- **value**: `{"limits":{"eventTopics":4,"memoryPages":16,"subjectLen":32,"payloadLen":16384,"runtimeMemory":1073741824,"validatorRuntimeMemory":2147483648,"eventRefTime":60000},"instructionWeights":{"base":1259}}`
- **summary**: Cost schedule and limits.

### `unsafeUnstableInterface`: `bool`

- **interface**: `api.consts.contracts.unsafeUnstableInterface`
- **value**: `false`
- **summary**: Make contract callable functions marked as `#[unstable]` available.

    Contracts that use `#[unstable]` functions won't be able to be uploaded unless this is set to `true`. This is only meant for testnets and dev nodes in order to experiment with new features.

    **Warning:**

    Do **not** set to `true` on productions chains.


## `crowdloan`

### `absoluteMinimumContribution`: `u64`

- **interface**: `api.consts.crowdloan.absoluteMinimumContribution`
- **value**: `100000000`
- **summary**: The absolute minimum contribution required to contribute to a crowdloan.

### `maxContributors`: `u32`

- **interface**: `api.consts.crowdloan.maxContributors`
- **value**: `500`

### `maximumBlockDuration`: `u32`

- **interface**: `api.consts.crowdloan.maximumBlockDuration`
- **value**: `432000`
- **summary**: The maximum block duration for a crowdloan.

### `minimumBlockDuration`: `u32`

- **interface**: `api.consts.crowdloan.minimumBlockDuration`
- **value**: `50400`
- **summary**: The minimum block duration for a crowdloan.

### `minimumDeposit`: `u64`

- **interface**: `api.consts.crowdloan.minimumDeposit`
- **value**: `10000000000`
- **summary**: The minimum deposit required to create a crowdloan.

### `palletId`: `[u8;8]`

- **interface**: `api.consts.crowdloan.palletId`
- **value**: `0x62742f636c6f616e`
- **summary**: The pallet id that will be used to derive crowdloan account ids.

### `refundContributorsLimit`: `u32`

- **interface**: `api.consts.crowdloan.refundContributorsLimit`
- **value**: `50`
- **summary**: The maximum number of contributors that can be refunded in a single refund.


## `drand`

### `httpFetchTimeout`: `u64`

- **interface**: `api.consts.drand.httpFetchTimeout`
- **value**: `1000`
- **summary**: The maximum number of milliseconds we are willing to wait for the HTTP request to complete.

### `unsignedPriority`: `u64`

- **interface**: `api.consts.drand.unsignedPriority`
- **value**: `1048576`
- **summary**: A configuration for base priority of unsigned transactions.

    This is exposed so that it can be tuned for particular runtime, when multiple pallets send unsigned transactions.


## `grandpa`

### `maxAuthorities`: `u32`

- **interface**: `api.consts.grandpa.maxAuthorities`
- **value**: `32`
- **summary**: Max Authorities in use

### `maxNominators`: `u32`

- **interface**: `api.consts.grandpa.maxNominators`
- **value**: `20`
- **summary**: The maximum number of nominators for each validator.

### `maxSetIdSessionEntries`: `u64`

- **interface**: `api.consts.grandpa.maxSetIdSessionEntries`
- **value**: `0`
- **summary**: The maximum number of entries to keep in the set id to session index mapping.

    Since the `SetIdSession` map is only used for validating equivocations this value should relate to the bonding duration of whatever staking system is being used (if any). If equivocation handling is not enabled then this value can be zero.


## `limitOrders`

### `maxOrdersPerBatch`: `u32`

- **interface**: `api.consts.limitOrders.maxOrdersPerBatch`
- **value**: `100`
- **summary**: Maximum number of orders in a single `execute_orders` call. Should equal `floor(max_block_weight / per_order_weight)`.

### `palletHotkey`: `AccountId32`

- **interface**: `api.consts.limitOrders.palletHotkey`
- **value**: `5EYCAe5fvncY7XCnFeAMaW4jAaVtzayKdaNNRURB5Nwvtw74`
- **summary**: Hotkey registered in each subnet that the pallet's intermediary account stakes to/from during batch execution.

    This must be a hotkey registered on every subnet the pallet may operate on. Operators should register a dedicated hotkey and set this in the runtime configuration.

### `palletId`: `[u8;8]`

- **interface**: `api.consts.limitOrders.palletId`
- **value**: `0x62742f6c696d6974`
- **summary**: PalletId used to derive the intermediary account for batch execution.

    The derived account temporarily holds pooled TAO and staked alpha during `execute_batched_orders` before distributing to order signers.


## `multisig`

### `depositBase`: `u64`

- **interface**: `api.consts.multisig.depositBase`
- **value**: `132000000`
- **summary**: The base amount of currency needed to reserve for creating a multisig execution or to store a dispatch call for later.

    This is held for an additional storage item whose value size is `4 + sizeof((BlockNumber, Balance, AccountId))` bytes and whose key size is `32 + sizeof(AccountId)` bytes.

### `depositFactor`: `u64`

- **interface**: `api.consts.multisig.depositFactor`
- **value**: `32000000`
- **summary**: The amount of currency needed per unit threshold when creating a multisig execution.

    This is held for adding 32 bytes more into a pre-existing storage value.

### `maxSignatories`: `u32`

- **interface**: `api.consts.multisig.maxSignatories`
- **value**: `100`
- **summary**: The maximum amount of signatories allowed in the multisig.


## `proxy`

### `announcementDepositBase`: `u64`

- **interface**: `api.consts.proxy.announcementDepositBase`
- **value**: `36000000`
- **summary**: The base amount of currency needed to reserve for creating an announcement.

    This is held when a new storage item holding a `Balance` is created (typically 16 bytes).

### `announcementDepositFactor`: `u64`

- **interface**: `api.consts.proxy.announcementDepositFactor`
- **value**: `68000000`
- **summary**: The amount of currency needed per announcement made.

    This is held for adding an `AccountId`, `Hash` and `BlockNumber` (typically 68 bytes) into a pre-existing storage value.

### `maxPending`: `u32`

- **interface**: `api.consts.proxy.maxPending`
- **value**: `75`
- **summary**: The maximum amount of time-delayed announcements that are allowed to be pending.

### `maxProxies`: `u32`

- **interface**: `api.consts.proxy.maxProxies`
- **value**: `20`
- **summary**: The maximum amount of proxies allowed for a single account.

### `proxyDepositBase`: `u64`

- **interface**: `api.consts.proxy.proxyDepositBase`
- **value**: `60000000`
- **summary**: The base amount of currency needed to reserve for creating a proxy.

    This is held for an additional storage item whose value size is `sizeof(Balance)` bytes and whose key size is `sizeof(AccountId)` bytes.

### `proxyDepositFactor`: `u64`

- **interface**: `api.consts.proxy.proxyDepositFactor`
- **value**: `33000000`
- **summary**: The amount of currency needed per proxy added.

    This is held for adding 32 bytes plus an instance of `ProxyType` more into a pre-existing storage value. Thus, when configuring `ProxyDepositFactor` one should take into account `32 + proxy_type.encode().len()` bytes of data.


## `safeMode`

### `enterDepositAmount`: `Option<u64>`

- **interface**: `api.consts.safeMode.enterDepositAmount`
- **value**: ``
- **summary**: The amount that will be reserved upon calling [`Pallet::enter`].

    `None` disallows permissionlessly enabling the safe-mode and is a sane default.

### `enterDuration`: `u32`

- **interface**: `api.consts.safeMode.enterDuration`
- **value**: `0`
- **summary**: For how many blocks the safe-mode will be entered by [`Pallet::enter`].

### `extendDepositAmount`: `Option<u64>`

- **interface**: `api.consts.safeMode.extendDepositAmount`
- **value**: ``
- **summary**: The amount that will be reserved upon calling [`Pallet::extend`].

    `None` disallows permissionlessly extending the safe-mode and is a sane default.

### `extendDuration`: `u32`

- **interface**: `api.consts.safeMode.extendDuration`
- **value**: `0`
- **summary**: For how many blocks the safe-mode can be extended by each [`Pallet::extend`] call.

    This does not impose a hard limit as the safe-mode can be extended multiple times.

### `releaseDelay`: `Option<u32>`

- **interface**: `api.consts.safeMode.releaseDelay`
- **value**: ``
- **summary**: The minimal duration a deposit will remain reserved after safe-mode is entered or extended, unless [`Pallet::force_release_deposit`] is successfully called sooner.

    Every deposit is tied to a specific activation or extension, thus each deposit can be released independently after the delay for it has passed.

    `None` disallows permissionlessly releasing the safe-mode deposits and is a sane default.


## `scheduler`

### `maximumWeight`: `{"refTime":"Compact<u64>","proofSize":"Compact<u64>"}`

- **interface**: `api.consts.scheduler.maximumWeight`
- **value**: `{"refTime":3200000000000,"proofSize":"0xcccccccccccccccc"}`
- **summary**: The maximum weight that may be scheduled per block for any dispatchables.

### `maxScheduledPerBlock`: `u32`

- **interface**: `api.consts.scheduler.maxScheduledPerBlock`
- **value**: `50`
- **summary**: The maximum number of scheduled calls in the queue for a single block.

    **NOTE:**

    + Dependent pallets' benchmarks might require a higher limit for the setting. Set a higher limit under `runtime-benchmarks` feature.


## `subtensorModule`

### `alphaHigh`: `u16`

- **interface**: `api.consts.subtensorModule.alphaHigh`
- **value**: `58982`
- **summary**: The upper bound for the alpha parameter. Used for Liquid Alpha.

### `alphaLow`: `u16`

- **interface**: `api.consts.subtensorModule.alphaLow`
- **value**: `45875`
- **summary**: The lower bound for the alpha parameter. Used for Liquid Alpha.

### `burnAccountId`: `[u8;8]`

- **interface**: `api.consts.subtensorModule.burnAccountId`
- **value**: `0x6275726e746e7372`
- **summary**: Burn account ID

### `hotkeySwapOnSubnetInterval`: `u64`

- **interface**: `api.consts.subtensorModule.hotkeySwapOnSubnetInterval`
- **value**: `7200`
- **summary**: Block number for a coldkey swap the hotkey in specific subnet.

### `initialActivityCutoff`: `u16`

- **interface**: `api.consts.subtensorModule.initialActivityCutoff`
- **value**: `5000`
- **summary**: Activity constant.

### `initialAdjustmentAlpha`: `u64`

- **interface**: `api.consts.subtensorModule.initialAdjustmentAlpha`
- **value**: `0`
- **summary**: Initial adjustment alpha on burn and pow.

### `initialAdjustmentInterval`: `u16`

- **interface**: `api.consts.subtensorModule.initialAdjustmentInterval`
- **value**: `100`
- **summary**: Initial adjustment interval.

### `initialAlphaSigmoidSteepness`: `i16`

- **interface**: `api.consts.subtensorModule.initialAlphaSigmoidSteepness`
- **value**: `1000`
- **summary**: AlphaSigmoidSteepness constant.

### `initialBondsMovingAverage`: `u64`

- **interface**: `api.consts.subtensorModule.initialBondsMovingAverage`
- **value**: `900000`
- **summary**: Initial bonds moving average.

### `initialBondsPenalty`: `u16`

- **interface**: `api.consts.subtensorModule.initialBondsPenalty`
- **value**: `65535`
- **summary**: Initial bonds penalty.

### `initialBondsResetOn`: `bool`

- **interface**: `api.consts.subtensorModule.initialBondsResetOn`
- **value**: `false`
- **summary**: Initial bonds reset.

### `initialBurn`: `u64`

- **interface**: `api.consts.subtensorModule.initialBurn`
- **value**: `100000000`
- **summary**: Initial Burn.

### `initialColdkeySwapAnnouncementDelay`: `u32`

- **interface**: `api.consts.subtensorModule.initialColdkeySwapAnnouncementDelay`
- **value**: `36000`
- **summary**: Coldkey swap announcement delay.

### `initialColdkeySwapReannouncementDelay`: `u32`

- **interface**: `api.consts.subtensorModule.initialColdkeySwapReannouncementDelay`
- **value**: `7200`
- **summary**: Coldkey swap reannouncement delay.

### `initialDefaultChildKeyTake`: `u16`

- **interface**: `api.consts.subtensorModule.initialDefaultChildKeyTake`
- **value**: `0`
- **summary**: Initial default childkey take.

### `initialDefaultDelegateTake`: `u16`

- **interface**: `api.consts.subtensorModule.initialDefaultDelegateTake`
- **value**: `11796`
- **summary**: Initial default delegation take.

### `initialDifficulty`: `u64`

- **interface**: `api.consts.subtensorModule.initialDifficulty`
- **value**: `10000000`
- **summary**: Initial Difficulty.

### `initialDissolveNetworkScheduleDuration`: `u32`

- **interface**: `api.consts.subtensorModule.initialDissolveNetworkScheduleDuration`
- **value**: `36000`
- **summary**: Dissolve network schedule duration

### `initialEmaPriceHalvingPeriod`: `u64`

- **interface**: `api.consts.subtensorModule.initialEmaPriceHalvingPeriod`
- **value**: `201600`
- **summary**: Initial EMA price halving period

### `initialEmissionValue`: `u16`

- **interface**: `api.consts.subtensorModule.initialEmissionValue`
- **value**: `0`
- **summary**: Initial Emission Ratio.

### `initialImmunityPeriod`: `u16`

- **interface**: `api.consts.subtensorModule.initialImmunityPeriod`
- **value**: `4096`
- **summary**: Immunity Period Constant.

### `initialIssuance`: `u64`

- **interface**: `api.consts.subtensorModule.initialIssuance`
- **value**: `0`
- **summary**: Initial currency issuance.

### `initialKappa`: `u16`

- **interface**: `api.consts.subtensorModule.initialKappa`
- **value**: `32767`
- **summary**: Kappa constant.

### `initialMaxAllowedUids`: `u16`

- **interface**: `api.consts.subtensorModule.initialMaxAllowedUids`
- **value**: `256`
- **summary**: Initial maximum allowed network UIDs

### `initialMaxAllowedValidators`: `u16`

- **interface**: `api.consts.subtensorModule.initialMaxAllowedValidators`
- **value**: `128`
- **summary**: Initial maximum allowed validators per network.

### `initialMaxBurn`: `u64`

- **interface**: `api.consts.subtensorModule.initialMaxBurn`
- **value**: `100000000000`
- **summary**: Initial Max Burn.

### `initialMaxChildKeyTake`: `u16`

- **interface**: `api.consts.subtensorModule.initialMaxChildKeyTake`
- **value**: `11796`
- **summary**: Initial maximum childkey take.

### `initialMaxDifficulty`: `u64`

- **interface**: `api.consts.subtensorModule.initialMaxDifficulty`
- **value**: `4611686018427387903`
- **summary**: Initial Max Difficulty.

### `initialMaxEpochsPerBlock`: `u8`

- **interface**: `api.consts.subtensorModule.initialMaxEpochsPerBlock`
- **value**: `2`
- **summary**: Initial default per-block cap on number of subnet epochs that may execute in a single `block_step`; the rest are deferred 1 block forward via `PendingEpochAt`.

### `initialMaxRegistrationsPerBlock`: `u16`

- **interface**: `api.consts.subtensorModule.initialMaxRegistrationsPerBlock`
- **value**: `1`
- **summary**: Initial max registrations per block.

### `initialMinAllowedUids`: `u16`

- **interface**: `api.consts.subtensorModule.initialMinAllowedUids`
- **value**: `64`
- **summary**: Initial minimum allowed network UIDs

### `initialMinAllowedWeights`: `u16`

- **interface**: `api.consts.subtensorModule.initialMinAllowedWeights`
- **value**: `1024`
- **summary**: Initial min allowed weights setting.

### `initialMinBurn`: `u64`

- **interface**: `api.consts.subtensorModule.initialMinBurn`
- **value**: `500000`
- **summary**: Initial Min Burn.

### `initialMinChildKeyTake`: `u16`

- **interface**: `api.consts.subtensorModule.initialMinChildKeyTake`
- **value**: `0`
- **summary**: Initial minimum childkey take.

### `initialMinDelegateTake`: `u16`

- **interface**: `api.consts.subtensorModule.initialMinDelegateTake`
- **value**: `0`
- **summary**: Initial minimum delegation take.

### `initialMinDifficulty`: `u64`

- **interface**: `api.consts.subtensorModule.initialMinDifficulty`
- **value**: `10000000`
- **summary**: Initial Min Difficulty.

### `initialMinStake`: `u64`

- **interface**: `api.consts.subtensorModule.initialMinStake`
- **value**: `2000000`
- **summary**: Initial minimum stake.

### `initialNetworkImmunityPeriod`: `u64`

- **interface**: `api.consts.subtensorModule.initialNetworkImmunityPeriod`
- **value**: `1296000`
- **summary**: Initial network immunity period

### `initialNetworkLockReductionInterval`: `u64`

- **interface**: `api.consts.subtensorModule.initialNetworkLockReductionInterval`
- **value**: `100800`
- **summary**: Initial lock reduction interval.

### `initialNetworkMinLockCost`: `u64`

- **interface**: `api.consts.subtensorModule.initialNetworkMinLockCost`
- **value**: `1000000000000`
- **summary**: Initial network minimum burn cost

### `initialNetworkRateLimit`: `u64`

- **interface**: `api.consts.subtensorModule.initialNetworkRateLimit`
- **value**: `7200`
- **summary**: Initial network creation rate limit

### `initialPruningScore`: `u16`

- **interface**: `api.consts.subtensorModule.initialPruningScore`
- **value**: `65535`
- **summary**: Initial pruning score for each neuron.

### `initialRAORecycledForRegistration`: `u64`

- **interface**: `api.consts.subtensorModule.initialRAORecycledForRegistration`
- **value**: `0`
- **summary**: Initial RAO Recycled.

### `initialRho`: `u16`

- **interface**: `api.consts.subtensorModule.initialRho`
- **value**: `10`
- **summary**: Rho constant.

### `initialScalingLawPower`: `u16`

- **interface**: `api.consts.subtensorModule.initialScalingLawPower`
- **value**: `50`
- **summary**: Initial scaling law power.

### `initialServingRateLimit`: `u64`

- **interface**: `api.consts.subtensorModule.initialServingRateLimit`
- **value**: `50`
- **summary**: Initial serving rate limit.

### `initialStartCallDelay`: `u64`

- **interface**: `api.consts.subtensorModule.initialStartCallDelay`
- **value**: `0`
- **summary**: Delay after which a new subnet can dispatch start call extrinsic.

### `initialSubnetOwnerCut`: `u16`

- **interface**: `api.consts.subtensorModule.initialSubnetOwnerCut`
- **value**: `11796`
- **summary**: Initial network subnet cut.

### `initialTaoWeight`: `u64`

- **interface**: `api.consts.subtensorModule.initialTaoWeight`
- **value**: `971718665099567868`
- **summary**: Initial TAO weight.

### `initialTargetRegistrationsPerInterval`: `u16`

- **interface**: `api.consts.subtensorModule.initialTargetRegistrationsPerInterval`
- **value**: `2`
- **summary**: Initial target registrations per interval.

### `initialTempo`: `u16`

- **interface**: `api.consts.subtensorModule.initialTempo`
- **value**: `360`
- **summary**: Tempo for each network.

### `initialTxChildKeyTakeRateLimit`: `u64`

- **interface**: `api.consts.subtensorModule.initialTxChildKeyTakeRateLimit`
- **value**: `216000`
- **summary**: Initial childkey take transaction rate limit.

### `initialTxDelegateTakeRateLimit`: `u64`

- **interface**: `api.consts.subtensorModule.initialTxDelegateTakeRateLimit`
- **value**: `216000`
- **summary**: Initial delegate take transaction rate limit.

### `initialTxRateLimit`: `u64`

- **interface**: `api.consts.subtensorModule.initialTxRateLimit`
- **value**: `1000`
- **summary**: Initial transaction rate limit.

### `initialValidatorPruneLen`: `u64`

- **interface**: `api.consts.subtensorModule.initialValidatorPruneLen`
- **value**: `1`
- **summary**: Initial validator context pruning length.

### `initialWeightsVersionKey`: `u64`

- **interface**: `api.consts.subtensorModule.initialWeightsVersionKey`
- **value**: `0`
- **summary**: Initial weights version key.

### `keySwapCost`: `u64`

- **interface**: `api.consts.subtensorModule.keySwapCost`
- **value**: `100000000`
- **summary**: Cost of swapping a hotkey.

### `keySwapOnSubnetCost`: `u64`

- **interface**: `api.consts.subtensorModule.keySwapOnSubnetCost`
- **value**: `1000000`
- **summary**: Cost of swapping a hotkey in a subnet.

### `leaseDividendsDistributionInterval`: `u32`

- **interface**: `api.consts.subtensorModule.leaseDividendsDistributionInterval`
- **value**: `100`
- **summary**: Number of blocks between dividends distribution.

### `liquidAlphaOn`: `bool`

- **interface**: `api.consts.subtensorModule.liquidAlphaOn`
- **value**: `false`
- **summary**: A flag to indicate if Liquid Alpha is enabled.

### `maxActivityCutoffFactorMilli`: `u32`

- **interface**: `api.consts.subtensorModule.maxActivityCutoffFactorMilli`
- **value**: `50000`
- **summary**: Upper bound for the activity-cutoff factor (per-mille).

### `maxBurnLowerBound`: `u64`

- **interface**: `api.consts.subtensorModule.maxBurnLowerBound`
- **value**: `100000000`
- **summary**: Max burn lower bound.

### `maxImmuneUidsPercentage`: `Percent`

- **interface**: `api.consts.subtensorModule.maxImmuneUidsPercentage`
- **value**: `80`
- **summary**: Maximum percentage of immune UIDs.

### `maxTempo`: `u16`

- **interface**: `api.consts.subtensorModule.maxTempo`
- **value**: `50400`
- **summary**: Upper bound for owner-set tempo.

### `minActivityCutoffFactorMilli`: `u32`

- **interface**: `api.consts.subtensorModule.minActivityCutoffFactorMilli`
- **value**: `1000`
- **summary**: Lower bound for the activity-cutoff factor (per-mille).

### `minBurnUpperBound`: `u64`

- **interface**: `api.consts.subtensorModule.minBurnUpperBound`
- **value**: `1000000000`
- **summary**: Min  burn upper bound.

### `minTempo`: `u16`

- **interface**: `api.consts.subtensorModule.minTempo`
- **value**: `360`
- **summary**: Lower bound for owner-set tempo.

### `subtensorPalletId`: `[u8;8]`

- **interface**: `api.consts.subtensorModule.subtensorPalletId`
- **value**: `0x73756274656e7372`
- **summary**: Pallet account ID

### `yuma3On`: `bool`

- **interface**: `api.consts.subtensorModule.yuma3On`
- **value**: `false`
- **summary**: A flag to indicate if Yuma3 is enabled.


## `swap`

### `maxFeeRate`: `u16`

- **interface**: `api.consts.swap.maxFeeRate`
- **value**: `10000`
- **summary**: The maximum fee rate that can be set

### `minimumLiquidity`: `u64`

- **interface**: `api.consts.swap.minimumLiquidity`
- **value**: `1000`
- **summary**: Minimum liquidity that is safe for rounding and integer math.

### `minimumReserve`: `u64`

- **interface**: `api.consts.swap.minimumReserve`
- **value**: `1000000`
- **summary**: Minimum reserve for tao and alpha

### `protocolId`: `[u8;8]`

- **interface**: `api.consts.swap.protocolId`
- **value**: `0x74656e2f73776170`
- **summary**: This type is used to derive protocol accoun ID.


## `system`

### `blockHashCount`: `u32`

- **interface**: `api.consts.system.blockHashCount`
- **value**: `2400`
- **summary**: Maximum number of block number to block hash mappings to keep (oldest pruned first).

### `blockLength`: `{"max":"FrameSupportDispatchPerDispatchClassU32"}`

- **interface**: `api.consts.system.blockLength`
- **value**: `{"max":{"normal":7864320,"operational":10485760,"mandatory":10485760}}`
- **summary**: The maximum length of a block (in bytes).

### `blockWeights`: `{"baseBlock":"SpWeightsWeightV2Weight","maxBlock":"SpWeightsWeightV2Weight","perClass":"FrameSupportDispatchPerDispatchClassWeightsPerClass"}`

- **interface**: `api.consts.system.blockWeights`
- **value**: `{"baseBlock":{"refTime":431614000,"proofSize":0},"maxBlock":{"refTime":4000000000000,"proofSize":"0xffffffffffffffff"},"perClass":{"normal":{"baseExtrinsic":{"refTime":108157000,"proofSize":0},"maxExtrinsic":{"refTime":2599891843000,"proofSize":"0xa666666666666666"},"maxTotal":{"refTime":3000000000000,"proofSize":"0xbfffffffffffffff"},"reserved":{"refTime":0,"proofSize":0}},"operational":{"baseExtrinsic":{"refTime":108157000,"proofSize":0},"maxExtrinsic":{"refTime":3599891843000,"proofSize":"0xe666666666666666"},"maxTotal":{"refTime":4000000000000,"proofSize":"0xffffffffffffffff"},"reserved":{"refTime":1000000000000,"proofSize":"0x4000000000000000"}},"mandatory":{"baseExtrinsic":{"refTime":108157000,"proofSize":0},"maxExtrinsic":null,"maxTotal":null,"reserved":null}}}`
- **summary**: Block & extrinsics weights: base values and limits.

### `dbWeight`: `{"read":"u64","write":"u64"}`

- **interface**: `api.consts.system.dbWeight`
- **value**: `{"read":25000000,"write":100000000}`
- **summary**: The weight of runtime database operations the runtime can invoke.

### `ss58Prefix`: `u16`

- **interface**: `api.consts.system.ss58Prefix`
- **value**: `42`
- **summary**: The designated SS58 prefix of this chain.

    This replaces the "ss58Format" property declared in the chain spec. Reason is that the runtime should know about the prefix in order to make use of it as an identifier of the chain.

### `version`: `{"specName":"Text","implName":"Text","authoringVersion":"u32","specVersion":"u32","implVersion":"u32","apis":"Vec<([u8;8],u32)>","transactionVersion":"u32","systemVersion":"u8"}`

- **interface**: `api.consts.system.version`
- **value**: `{"specName":"node-subtensor","implName":"node-subtensor","authoringVersion":1,"specVersion":432,"implVersion":1,"apis":[["0xdf6acb689907609b",5],["0x37e397fc7c91f5e4",2],["0x40fe3ad401f8959a",6],["0xfbc577b9d747efd6",1],["0xd2bc9897eed08f15",3],["0xf78b278be53f454c",2],["0xdd718d5cc53262d4",1],["0xab3c0572291feb8b",1],["0xed99c5acb25eedf5",3],["0xbc9d89904f5b923f",1],["0x37c8bb1350a9a2a8",4],["0xf3ff14d5ab527059",3],["0x582211f65bb14b89",6],["0xe65b00e46cedd0aa",2],["0x68b66ba122c93fa7",2],["0x42e62be4a39e5b60",1],["0x806df4ccaa9ed485",1],["0x8375104b299b74c5",2],["0x5d1fbfbe852f2807",1],["0xc6886e2f8e598b0a",1],["0xc0de4984d112f3b4",1],["0xcbca25e39f142387",2],["0xa8b093e6508d9e9c",1],["0x1c4585bd5c707202",1]],"transactionVersion":1,"systemVersion":1}`
- **summary**: Get the chain's in-code version.


## `timestamp`

### `minimumPeriod`: `u64`

- **interface**: `api.consts.timestamp.minimumPeriod`
- **value**: `6000`
- **summary**: The minimum period between blocks.

    Be aware that this is different to the *expected* period that the block production apparatus provides. Your chosen consensus system will generally work with this to determine a sensible block time. For example, in the Aura pallet it will be double this period on default settings.


## `transactionPayment`

### `operationalFeeMultiplier`: `u8`

- **interface**: `api.consts.transactionPayment.operationalFeeMultiplier`
- **value**: `5`
- **summary**: A fee multiplier for `Operational` extrinsics to compute "virtual tip" to boost their `priority`

    This value is multiplied by the `final_fee` to obtain a "virtual tip" that is later added to a tip component in regular `priority` calculations. It means that a `Normal` transaction can front-run a similarly-sized `Operational` extrinsic (with no tip), by including a tip value greater than the virtual tip.

    ```rust,ignore // For `Normal` let priority = priority_calc(tip);

    // For `Operational` let virtual_tip = (inclusion_fee + tip) * OperationalFeeMultiplier; let priority = priority_calc(tip + virtual_tip); ```

    Note that since we use `final_fee` the multiplier applies also to the regular `tip` sent with the transaction. So, not only does the transaction get a priority bump based on the `inclusion_fee`, but we also amplify the impact of tips applied to `Operational` transactions.


## `utility`

### `batchedCallsLimit`: `u32`

- **interface**: `api.consts.utility.batchedCallsLimit`
- **value**: `10922`
- **summary**: The limit on the number of batched calls.
