---
title: Storage
description: "This page contains storage query definitions for the Subtensor runtime."
---

# Storage

This page contains storage query definitions for the Subtensor runtime. Accessible via `api.query.<Pallet>.<storage_item>`.

:::info
Generated from Subtensor runtime spec version **438**. Connected to: `wss://entrypoint-finney.opentensor.ai:443`
:::

- **[adminUtils](#adminutils)**
- **[alphaAssets](#alphaassets)**
- **[aura](#aura)**
- **[balances](#balances)**
- **[baseFee](#basefee)**
- **[commitments](#commitments)**
- **[contracts](#contracts)**
- **[crowdloan](#crowdloan)**
- **[drand](#drand)**
- **[ethereum](#ethereum)**
- **[evm](#evm)**
- **[evmChainId](#evmchainid)**
- **[grandpa](#grandpa)**
- **[limitOrders](#limitorders)**
- **[mevShield](#mevshield)**
- **[multisig](#multisig)**
- **[preimage](#preimage)**
- **[proxy](#proxy)**
- **[randomnessCollectiveFlip](#randomnesscollectiveflip)**
- **[safeMode](#safemode)**
- **[scheduler](#scheduler)**
- **[substrate](#substrate)**
- **[subtensorModule](#subtensormodule)**
- **[sudo](#sudo)**
- **[swap](#swap)**
- **[system](#system)**
- **[timestamp](#timestamp)**
- **[transactionPayment](#transactionpayment)**

## `adminUtils`

### `palletVersion`: `u16`

- **interface**: `api.query.adminUtils.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `precompileEnable(PrecompileEnum)`: `bool`

- **interface**: `api.query.adminUtils.precompileEnable`
- **summary**: Map PrecompileEnum --> enabled


## `alphaAssets`

### `alphaBurned(NetUid)`: `AlphaBalance`

- **interface**: `api.query.alphaAssets.alphaBurned`
- **summary**: Total alpha burned per subnet through this pallet.

### `alphaRecycled(NetUid)`: `AlphaBalance`

- **interface**: `api.query.alphaAssets.alphaRecycled`
- **summary**: Total alpha recycled per subnet through this pallet.

### `palletVersion`: `u16`

- **interface**: `api.query.alphaAssets.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `totalAlphaIssuance(NetUid)`: `AlphaBalance`

- **interface**: `api.query.alphaAssets.totalAlphaIssuance`
- **summary**: Total alpha issuance tracked by the pallet.


## `aura`

### `authorities`: `Vec<SpConsensusAuraSr25519AppSr25519Public>`

- **interface**: `api.query.aura.authorities`
- **summary**: The current authority set.

### `currentSlot`: `Slot`

- **interface**: `api.query.aura.currentSlot`
- **summary**: The current slot of this block.

    This will be set in `on_initialize`.

### `palletVersion`: `u16`

- **interface**: `api.query.aura.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage


## `balances`

### `account(AccountId32)`: `AccountData`

- **interface**: `api.query.balances.account`
- **summary**: The Balances pallet example of storing the balance of an account.

    **Example:**

    ```nocompile impl pallet_balances::Config for Runtime { type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>> } ```

    You can also store the balance of an account in the `System` pallet.

    **Example:**

    ```nocompile impl pallet_balances::Config for Runtime { type AccountStore = System } ```

    But this comes with tradeoffs, storing account balances in the system pallet stores `frame_system` data alongside the account data contrary to storing account balances in the `Balances` pallet, which uses a `StorageMap` to store balances data only. NOTE: This is only used in the case that this pallet is used to store balances.

### `freezes(AccountId32)`: `Vec<FrameSupportTokensMiscIdAmountRuntimeFreezeReason>`

- **interface**: `api.query.balances.freezes`
- **summary**: Freeze locks on account balances.

### `holds(AccountId32)`: `Vec<FrameSupportTokensMiscIdAmountRuntimeHoldReason>`

- **interface**: `api.query.balances.holds`
- **summary**: Holds on account balances.

### `inactiveIssuance`: `TaoBalance`

- **interface**: `api.query.balances.inactiveIssuance`
- **summary**: The total units of outstanding deactivated balance in the system.

### `locks(AccountId32)`: `Vec<PalletBalancesBalanceLock>`

- **interface**: `api.query.balances.locks`
- **summary**: Any liquidity locks on some account balances. NOTE: Should only be accessed when setting, changing and freeing a lock.

    Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`

### `palletVersion`: `u16`

- **interface**: `api.query.balances.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `reserves(AccountId32)`: `Vec<PalletBalancesReserveData>`

- **interface**: `api.query.balances.reserves`
- **summary**: Named reserves on some account balances.

    Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`

### `totalIssuance`: `TaoBalance`

- **interface**: `api.query.balances.totalIssuance`
- **summary**: The total units issued in the system.


## `baseFee`

### `baseFeePerGas`: `U256`

- **interface**: `api.query.baseFee.baseFeePerGas`

### `elasticity`: `Permill`

- **interface**: `api.query.baseFee.elasticity`

### `palletVersion`: `u16`

- **interface**: `api.query.baseFee.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage


## `commitments`

### `commitmentOf(u16, AccountId32)`: `Registration`

- **interface**: `api.query.commitments.commitmentOf`
- **modifier**: `Optional`
- **summary**: Identity data by account

### `lastBondsReset(u16, AccountId32)`: `u32`

- **interface**: `api.query.commitments.lastBondsReset`
- **modifier**: `Optional`

### `lastCommitment(u16, AccountId32)`: `u32`

- **interface**: `api.query.commitments.lastCommitment`
- **modifier**: `Optional`

### `maxSpace`: `u32`

- **interface**: `api.query.commitments.maxSpace`

### `palletVersion`: `u16`

- **interface**: `api.query.commitments.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `revealedCommitments(u16, AccountId32)`: `Vec<(Bytes,u64)>`

- **interface**: `api.query.commitments.revealedCommitments`
- **modifier**: `Optional`

### `timelockedIndex`: `BTreeSet`

- **interface**: `api.query.commitments.timelockedIndex`
- **summary**: Tracks all CommitmentOf that have at least one timelocked field.

### `usedSpaceOf(u16, AccountId32)`: `UsageTracker`

- **interface**: `api.query.commitments.usedSpaceOf`
- **modifier**: `Optional`
- **summary**: Maps (netuid, who) -> usage (how many “bytes” they've committed) in the RateLimit window


## `contracts`

### `codeInfoOf(H256)`: `CodeInfo`

- **interface**: `api.query.contracts.codeInfoOf`
- **modifier**: `Optional`
- **summary**: A mapping from a contract's code hash to its code info.

### `contractInfoOf(AccountId32)`: `ContractInfo`

- **interface**: `api.query.contracts.contractInfoOf`
- **modifier**: `Optional`
- **summary**: The code associated with a given account.

    TWOX-NOTE: SAFE since `AccountId` is a secure hash.

### `deletionQueue(u32)`: `Bytes`

- **interface**: `api.query.contracts.deletionQueue`
- **modifier**: `Optional`
- **summary**: Evicted contracts that await child trie deletion.

    Child trie deletion is a heavy operation depending on the amount of storage items stored in said trie. Therefore this operation is performed lazily in `on_idle`.

### `deletionQueueCounter`: `DeletionQueueManager`

- **interface**: `api.query.contracts.deletionQueueCounter`
- **summary**: A pair of monotonic counters used to track the latest contract marked for deletion and the latest deleted contract in queue.

### `migrationInProgress`: `Bytes`

- **interface**: `api.query.contracts.migrationInProgress`
- **modifier**: `Optional`
- **summary**: A migration can span across multiple blocks. This storage defines a cursor to track the progress of the migration, enabling us to resume from the last completed position.

### `nonce`: `u64`

- **interface**: `api.query.contracts.nonce`
- **summary**: This is a **monotonic** counter incremented on contract instantiation.

    This is used in order to generate unique trie ids for contracts. The trie id of a new contract is calculated from hash(account_id, nonce). The nonce is required because otherwise the following sequence would lead to a possible collision of storage:

    1. Create a new contract.
    2. Terminate the contract.
    3. Immediately recreate the contract with the same account_id.

    This is bad because the contents of a trie are deleted lazily and there might be storage of the old instantiation still in it when the new contract is created. Please note that we can't replace the counter by the block number because the sequence above can happen in the same block. We also can't keep the account counter in memory only because storage is the only way to communicate across different extrinsics in the same block.

    **Note:**

    Do not use it to determine the number of contracts. It won't be decremented if a contract is destroyed.

### `palletVersion`: `u16`

- **interface**: `api.query.contracts.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `pristineCode(H256)`: `Bytes`

- **interface**: `api.query.contracts.pristineCode`
- **modifier**: `Optional`
- **summary**: A mapping from a contract's code hash to its code.


## `crowdloan`

### `contributions(u32, AccountId32)`: `TaoBalance`

- **interface**: `api.query.crowdloan.contributions`
- **modifier**: `Optional`
- **summary**: A map of crowdloan ids to their contributors and their contributions.

### `crowdloans(u32)`: `CrowdloanInfo`

- **interface**: `api.query.crowdloan.crowdloans`
- **modifier**: `Optional`
- **summary**: A map of crowdloan ids to their information.

### `currentCrowdloanId`: `u32`

- **interface**: `api.query.crowdloan.currentCrowdloanId`
- **modifier**: `Optional`
- **summary**: The current crowdloan id that will be set during the finalize call, making it temporarily accessible to the dispatched call.

### `hasMigrationRun(Bytes)`: `bool`

- **interface**: `api.query.crowdloan.hasMigrationRun`
- **summary**: Storage for the migration run status.

### `maxContributions(u32)`: `TaoBalance`

- **interface**: `api.query.crowdloan.maxContributions`
- **modifier**: `Optional`
- **summary**: A map of crowdloan ids to their optional maximum cumulative contribution per contributor.

### `nextCrowdloanId`: `u32`

- **interface**: `api.query.crowdloan.nextCrowdloanId`
- **summary**: The next incrementing crowdloan id.

### `palletVersion`: `u16`

- **interface**: `api.query.crowdloan.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage


## `drand`

### `beaconConfig`: `BeaconConfiguration`

- **interface**: `api.query.drand.beaconConfig`
- **summary**: the drand beacon configuration

### `hasMigrationRun(Bytes)`: `bool`

- **interface**: `api.query.drand.hasMigrationRun`
- **summary**: Storage for migration run status

### `lastStoredRound`: `u64`

- **interface**: `api.query.drand.lastStoredRound`

### `nextUnsignedAt`: `u32`

- **interface**: `api.query.drand.nextUnsignedAt`
- **summary**: Defines the block when next unsigned transaction will be accepted.

    To prevent spam of unsigned (and unpaid!) transactions on the network, we only allow one transaction per block. This storage entry defines when new transaction is going to be accepted.

### `oldestStoredRound`: `u64`

- **interface**: `api.query.drand.oldestStoredRound`
- **summary**: oldest stored round

### `palletVersion`: `u16`

- **interface**: `api.query.drand.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `pulses(u64)`: `Pulse`

- **interface**: `api.query.drand.pulses`
- **modifier**: `Optional`
- **summary**: map round number to pulse


## `ethereum`

### `blockHash(U256)`: `H256`

- **interface**: `api.query.ethereum.blockHash`

### `counterForPending`: `u32`

- **interface**: `api.query.ethereum.counterForPending`
- **summary**: Counter for the related counted storage map

### `currentBlock`: `Block`

- **interface**: `api.query.ethereum.currentBlock`
- **modifier**: `Optional`
- **summary**: The current Ethereum block.

### `currentReceipts`: `Vec<EthereumReceiptReceiptV4>`

- **interface**: `api.query.ethereum.currentReceipts`
- **modifier**: `Optional`
- **summary**: The current Ethereum receipts.

### `currentTransactionStatuses`: `Vec<FpRpcTransactionStatus>`

- **interface**: `api.query.ethereum.currentTransactionStatuses`
- **modifier**: `Optional`
- **summary**: The current transaction statuses.

### `palletVersion`: `u16`

- **interface**: `api.query.ethereum.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `pending(u32)`: `(EthereumTransactionTransactionV3,FpRpcTransactionStatus,EthereumReceiptReceiptV4)`

- **interface**: `api.query.ethereum.pending`
- **modifier**: `Optional`
- **summary**: Mapping from transaction index to transaction in the current building block.


## `evm`

### `accountCodes(H160)`: `Bytes`

- **interface**: `api.query.evm.accountCodes`

### `accountCodesMetadata(H160)`: `CodeMetadata`

- **interface**: `api.query.evm.accountCodesMetadata`
- **modifier**: `Optional`

### `accountStorages(H160, H256)`: `H256`

- **interface**: `api.query.evm.accountStorages`

### `disableWhitelistCheck`: `bool`

- **interface**: `api.query.evm.disableWhitelistCheck`

### `palletVersion`: `u16`

- **interface**: `api.query.evm.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `whitelistedCreators`: `Vec<H160>`

- **interface**: `api.query.evm.whitelistedCreators`


## `evmChainId`

### `chainId`: `u64`

- **interface**: `api.query.evmChainId.chainId`
- **summary**: The EVM chain ID.

### `palletVersion`: `u16`

- **interface**: `api.query.evmChainId.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage


## `grandpa`

### `authorities`: `Vec<(SpConsensusGrandpaAppPublic,u64)>`

- **interface**: `api.query.grandpa.authorities`
- **summary**: The current list of authorities.

### `currentSetId`: `u64`

- **interface**: `api.query.grandpa.currentSetId`
- **summary**: The number of changes (both in terms of keys and underlying economic responsibilities) in the "set" of Grandpa validators from genesis.

### `nextForced`: `u32`

- **interface**: `api.query.grandpa.nextForced`
- **modifier**: `Optional`
- **summary**: next block number where we can force a change.

### `palletVersion`: `u16`

- **interface**: `api.query.grandpa.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `pendingChange`: `StoredPendingChange`

- **interface**: `api.query.grandpa.pendingChange`
- **modifier**: `Optional`
- **summary**: Pending change: (signaled at, scheduled change).

### `setIdSession(u64)`: `u32`

- **interface**: `api.query.grandpa.setIdSession`
- **modifier**: `Optional`
- **summary**: A mapping from grandpa set ID to the index of the *most recent* session for which its members were responsible.

    This is only used for validating equivocation proofs. An equivocation proof must contains a key-ownership proof for a given session, therefore we need a way to tie together sessions and GRANDPA set ids, i.e. we need to validate that a validator was the owner of a given key on a given session, and what the active set ID was during that session.

    TWOX-NOTE: `SetId` is not under user control.

### `stalled`: `(u32,u32)`

- **interface**: `api.query.grandpa.stalled`
- **modifier**: `Optional`
- **summary**: `true` if we are currently stalled.

### `state`: `StoredState`

- **interface**: `api.query.grandpa.state`
- **summary**: State of the current authority set.


## `limitOrders`

### `hasMigrationRun(Bytes)`: `bool`

- **interface**: `api.query.limitOrders.hasMigrationRun`
- **summary**: Tracks which named migrations have already been applied. Keyed by a short migration name; value is always `true`.

### `limitOrdersEnabled`: `bool`

- **interface**: `api.query.limitOrders.limitOrdersEnabled`
- **summary**: Switch to enable/disable the pallet. Defaults to `false` so bare node deployments are safe; genesis sets it to `true`.

### `orders(H256)`: `OrderStatus`

- **interface**: `api.query.limitOrders.orders`
- **modifier**: `Optional`
- **summary**: Tracks the on-chain status of a known `OrderId`. Absent ⇒ never seen (still executable if valid). Present ⇒ Fulfilled or Cancelled (both are terminal).

### `palletVersion`: `u16`

- **interface**: `api.query.limitOrders.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage


## `mevShield`

### `authorKeys(Public)`: `Bytes`

- **interface**: `api.query.mevShield.authorKeys`
- **modifier**: `Optional`
- **summary**: Per-author ML-KEM-768 encapsulation key, updated each time the author produces a block.

### `counterForPendingExtrinsics`: `u32`

- **interface**: `api.query.mevShield.counterForPendingExtrinsics`
- **summary**: Counter for the related counted storage map

### `currentKey`: `Bytes`

- **interface**: `api.query.mevShield.currentKey`
- **modifier**: `Optional`
- **summary**: Current block author's ML-KEM-768 encapsulation key (internal, not for encryption).

### `extrinsicLifetime`: `u32`

- **interface**: `api.query.mevShield.extrinsicLifetime`
- **summary**: Configurable extrinsic lifetime (max block difference between submission and execution). Defaults to 10 blocks if not explicitly set.

### `hasMigrationRun(Bytes)`: `bool`

- **interface**: `api.query.mevShield.hasMigrationRun`
- **summary**: Stores whether some migration has been run.

### `maxExtrinsicWeight`: `u64`

- **interface**: `api.query.mevShield.maxExtrinsicWeight`
- **summary**: Configurable maximum weight for a single extrinsic dispatched during on_initialize. Extrinsics exceeding this limit are removed from the queue.

### `maxPendingExtrinsicsLimit`: `u32`

- **interface**: `api.query.mevShield.maxPendingExtrinsicsLimit`
- **summary**: Configurable maximum number of pending extrinsics. Defaults to 100 if not explicitly set via `set_max_pending_extrinsics`.

### `nextKey`: `Bytes`

- **interface**: `api.query.mevShield.nextKey`
- **modifier**: `Optional`
- **summary**: Key users should encrypt with (N+2 author's key).

### `nextKeyExpiresAt`: `u32`

- **interface**: `api.query.mevShield.nextKeyExpiresAt`
- **modifier**: `Optional`
- **summary**: Block number at which `NextKey` is no longer valid (exclusive upper bound). Updated every block during rotation.

### `nextPendingExtrinsicIndex`: `u32`

- **interface**: `api.query.mevShield.nextPendingExtrinsicIndex`
- **summary**: Next index to use when inserting a pending extrinsic (unique auto-increment).

### `onInitializeWeight`: `u64`

- **interface**: `api.query.mevShield.onInitializeWeight`
- **summary**: Configurable maximum weight for on_initialize processing. Defaults to 500_000_000_000 ref_time if not explicitly set.

### `palletVersion`: `u16`

- **interface**: `api.query.mevShield.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `pendingExtrinsics(u32)`: `PendingExtrinsic`

- **interface**: `api.query.mevShield.pendingExtrinsics`
- **modifier**: `Optional`
- **summary**: Storage map for encrypted extrinsics to be executed in on_initialize. Uses u32 index for `O(1)` insertion and removal. Count is maintained automatically.

### `pendingKey`: `Bytes`

- **interface**: `api.query.mevShield.pendingKey`
- **modifier**: `Optional`
- **summary**: Next block author's key, staged here before promoting to `CurrentKey`.

### `pendingKeyExpiresAt`: `u32`

- **interface**: `api.query.mevShield.pendingKeyExpiresAt`
- **modifier**: `Optional`
- **summary**: Block number at which `PendingKey` is no longer valid (exclusive upper bound). Updated every block during rotation.


## `multisig`

### `multisigs(AccountId32, [u8;32])`: `Multisig`

- **interface**: `api.query.multisig.multisigs`
- **modifier**: `Optional`
- **summary**: The set of open multisig operations.

### `palletVersion`: `u16`

- **interface**: `api.query.multisig.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage


## `preimage`

### `palletVersion`: `u16`

- **interface**: `api.query.preimage.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `preimageFor(H256, u32)`: `Bytes`

- **interface**: `api.query.preimage.preimageFor`
- **modifier**: `Optional`

### `requestStatusFor(H256)`: `RequestStatus`

- **interface**: `api.query.preimage.requestStatusFor`
- **modifier**: `Optional`
- **summary**: The request status of a given hash.

### `statusFor(H256)`: `OldRequestStatus`

- **interface**: `api.query.preimage.statusFor`
- **modifier**: `Optional`
- **summary**: The request status of a given hash.


## `proxy`

### `announcements(AccountId32)`: `(Vec<PalletSubtensorProxyAnnouncement>,u64)`

- **interface**: `api.query.proxy.announcements`
- **summary**: The announcements made by the proxy (key).

### `lastCallResult(AccountId32)`: `Result`

- **interface**: `api.query.proxy.lastCallResult`
- **modifier**: `Optional`
- **summary**: The result of the last call made by the proxy (key).

### `palletVersion`: `u16`

- **interface**: `api.query.proxy.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `proxies(AccountId32)`: `(Vec<PalletSubtensorProxyProxyDefinition>,u64)`

- **interface**: `api.query.proxy.proxies`
- **summary**: The set of account proxies. Maps the account which has delegated to the accounts which are being delegated to, together with the amount held on deposit.

### `realPaysFee(AccountId32, AccountId32)`: `Null`

- **interface**: `api.query.proxy.realPaysFee`
- **modifier**: `Optional`
- **summary**: Tracks which (real, delegate) pairs have opted in to the real account paying transaction fees for proxy calls made by the delegate. Existence of an entry means the real account pays; absence means the delegate pays (default).


## `randomnessCollectiveFlip`

### `palletVersion`: `u16`

- **interface**: `api.query.randomnessCollectiveFlip.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `randomMaterial`: `Vec<H256>`

- **interface**: `api.query.randomnessCollectiveFlip.randomMaterial`
- **summary**: Series of block headers from the last 81 blocks that acts as random seed material. This is arranged as a ring buffer with `block_number % 81` being the index into the `Vec` of the oldest hash.


## `safeMode`

### `deposits(AccountId32, u32)`: `TaoBalance`

- **interface**: `api.query.safeMode.deposits`
- **modifier**: `Optional`
- **summary**: Holds the reserve that was taken from an account at a specific block number.

    This helps governance to have an overview of outstanding deposits that should be returned or slashed.

### `enteredUntil`: `u32`

- **interface**: `api.query.safeMode.enteredUntil`
- **modifier**: `Optional`
- **summary**: Contains the last block number that the safe-mode will remain entered in.

    Set to `None` when safe-mode is exited.

    Safe-mode is automatically exited when the current block number exceeds this value.

### `palletVersion`: `u16`

- **interface**: `api.query.safeMode.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage


## `scheduler`

### `agenda(u32)`: `Vec<Option<PalletSchedulerScheduled>>`

- **interface**: `api.query.scheduler.agenda`
- **summary**: Items to be executed, indexed by the block number that they should be executed on.

### `incompleteSince`: `u32`

- **interface**: `api.query.scheduler.incompleteSince`
- **modifier**: `Optional`
- **summary**: Block number at which the agenda began incomplete execution.

### `lookup([u8;32])`: `(u32,u32)`

- **interface**: `api.query.scheduler.lookup`
- **modifier**: `Optional`
- **summary**: Lookup from a name to the block number and index of the task.

    For v3 -> v4 the previously unbounded identities are Blake2-256 hashed to form the v4 identities.

### `palletVersion`: `u16`

- **interface**: `api.query.scheduler.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `retries(u32, u32)`: `RetryConfig`

- **interface**: `api.query.scheduler.retries`
- **modifier**: `Optional`
- **summary**: Retry configurations for items to be executed, indexed by task address.


## `substrate`

### `changesTrieConfig`: `u32`

- **interface**: `api.query.substrate.changesTrieConfig`
- **modifier**: `Required`
- **summary**: Changes trie configuration is stored under this key.

### `childStorageKeyPrefix`: `u32`

- **interface**: `api.query.substrate.childStorageKeyPrefix`
- **modifier**: `Required`
- **summary**: Prefix of child storage keys.

### `code`: `Bytes`

- **interface**: `api.query.substrate.code`
- **modifier**: `Required`
- **summary**: Wasm code of the runtime.

### `defaultChildStorageKeyPrefix`: `u32`

- **interface**: `api.query.substrate.defaultChildStorageKeyPrefix`
- **modifier**: `Required`
- **summary**: Prefix of the default child storage keys in the top trie.

### `extrinsicIndex`: `u32`

- **interface**: `api.query.substrate.extrinsicIndex`
- **modifier**: `Required`
- **summary**: Current extrinsic index (u32) is stored under this key.

### `heapPages`: `u64`

- **interface**: `api.query.substrate.heapPages`
- **modifier**: `Required`
- **summary**: Number of wasm linear memory pages required for execution of the runtime.

### `intrablockEntropy`: `[u8;32]`

- **interface**: `api.query.substrate.intrablockEntropy`
- **modifier**: `Required`
- **summary**: Current intra-block entropy (a universally unique `[u8; 32]` value) is stored here.

### `storageVersionStorageKeyPostfix`: `u16`

- **interface**: `api.query.substrate.storageVersionStorageKeyPostfix`
- **modifier**: `Required`
- **summary**: The storage key postfix that is used to store the [`StorageVersion`] per pallet.

### `transactionLevelKey`: `u32`

- **interface**: `api.query.substrate.transactionLevelKey`
- **modifier**: `Required`
- **summary**: The key that holds the current number of active layers.


## `subtensorModule`

### `accountFlags(AccountId32)`: `u128`

- **interface**: `api.query.subtensorModule.accountFlags`
- **summary**: MAP ( coldkey ) --> flags | Account-level flags. Defaults to zero.

### `accumulatedLeaseDividends(u32)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.accumulatedLeaseDividends`
- **summary**: MAP ( lease_id ) --> accumulated_dividends | The accumulated dividends for a given lease that needs to be distributed.

### `active(NetUid)`: `Vec<bool>`

- **interface**: `api.query.subtensorModule.active`
- **summary**: MAP ( netuid ) --> active

### `activityCutoff(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.activityCutoff`
- **summary**: MAP ( netuid ) --> activity_cutoff

### `activityCutoffFactorMilli(NetUid)`: `u32`

- **interface**: `api.query.subtensorModule.activityCutoffFactorMilli`
- **summary**: MAP ( netuid ) --> activity-cutoff factor in per-mille epochs (1/1000 granularity). Effective cutoff in blocks = `(factor × tempo) / 1000`, clamped to ≥ 1.

### `adjustmentAlpha(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.adjustmentAlpha`
- **summary**: MAP ( netuid ) --> adjustment_alpha

### `adjustmentInterval(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.adjustmentInterval`
- **summary**: MAP ( netuid ) --> adjustment_interval

### `adminFreezeWindow`: `u16`

- **interface**: `api.query.subtensorModule.adminFreezeWindow`
- **summary**: Global window (in blocks) at the end of each tempo where admin ops are disallowed

### `alpha(AccountId32, AccountId32, u16)`: `FixedU128`

- **interface**: `api.query.subtensorModule.alpha`
- **summary**: NMAP ( hot, cold, netuid ) --> alpha | Returns the alpha shares for a hotkey, coldkey, netuid triplet.

### `alphaDividendsPerSubnet(u16, AccountId32)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.alphaDividendsPerSubnet`
- **summary**: DMAP ( netuid, hotkey ) --> u64 | Last alpha dividend this hotkey got on tempo.

### `alphaMapLastKey`: `Option`

- **interface**: `api.query.subtensorModule.alphaMapLastKey`
- **summary**: Contains last Alpha storage map key to iterate (check first)

### `alphaSigmoidSteepness(NetUid)`: `i16`

- **interface**: `api.query.subtensorModule.alphaSigmoidSteepness`
- **summary**: MAP ( netuid ) --> AlphaSigmoidSteepness

### `alphaV2(AccountId32, AccountId32, u16)`: `SafeFloat`

- **interface**: `api.query.subtensorModule.alphaV2`
- **summary**: NMAP ( hot, cold, netuid ) --> alpha | Returns the alpha shares for a hotkey, coldkey, netuid triplet, stores SafeFloat.

### `alphaV2MapLastKey`: `Option`

- **interface**: `api.query.subtensorModule.alphaV2MapLastKey`
- **summary**: Contains last AlphaV2 storage map key to iterate (check first)

### `alphaValues(NetUid)`: `(u16,u16)`

- **interface**: `api.query.subtensorModule.alphaValues`
- **summary**: MAP ( netuid ) --> (alpha_low, alpha_high)

### `associatedEvmAddress(u16, u16)`: `(H160,u64)`

- **interface**: `api.query.subtensorModule.associatedEvmAddress`
- **modifier**: `Optional`
- **summary**: DMAP (netuid, uid) --> (H160, last_block_where_ownership_was_proven)

### `associatedUidsByEvmAddress(u16, H160)`: `Vec<(u16,u64)>`

- **interface**: `api.query.subtensorModule.associatedUidsByEvmAddress`
- **summary**: DMAP (netuid, H160) --> associated UIDs and last block where ownership was proven.

### `autoParentDelegationEnabled(AccountId32)`: `bool`

- **interface**: `api.query.subtensorModule.autoParentDelegationEnabled`
- **summary**: MAP ( hotkey ) --> parent_delegation_enabled

    When `true`, this root validator allows auto parent delegation. Defaults to `true`; validators can opt out at any time by calling `set_auto_parent_delegation_enabled(false)`.

### `autoStakeDestination(AccountId32, u16)`: `AccountId32`

- **interface**: `api.query.subtensorModule.autoStakeDestination`
- **modifier**: `Optional`
- **summary**: DMAP ( cold, netuid )--> hot | Returns the hotkey a coldkey will autostake to with mining rewards.

### `autoStakeDestinationColdkeys(AccountId32, u16)`: `Vec<AccountId32>`

- **interface**: `api.query.subtensorModule.autoStakeDestinationColdkeys`
- **summary**: DMAP ( hot, netuid )--> Vec\<cold> | Returns a list of coldkeys that are autostaking to a hotkey

### `axons(u16, AccountId32)`: `AxonInfo`

- **interface**: `api.query.subtensorModule.axons`
- **modifier**: `Optional`
- **summary**: MAP ( netuid, hotkey ) --> axon_info

### `blockAtRegistration(u16, u16)`: `u64`

- **interface**: `api.query.subtensorModule.blockAtRegistration`
- **summary**: DMAP ( netuid, uid ) --> block_at_registration

### `blockEmission`: `u64`

- **interface**: `api.query.subtensorModule.blockEmission`
- **summary**: ITEM ( global_block_emission )

### `blocksSinceLastStep(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.blocksSinceLastStep`
- **summary**: MAP ( netuid ) --> blocks_since_last_step, capped at the subnet's `tempo + 1`

### `bonds(u16, u16)`: `Vec<(u16,u16)>`

- **interface**: `api.query.subtensorModule.bonds`
- **summary**: DMAP ( netuid, uid ) --> bonds

### `bondsMovingAverage(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.bondsMovingAverage`
- **summary**: MAP ( netuid ) --> bonds_moving_average

### `bondsPenalty(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.bondsPenalty`
- **summary**: MAP ( netuid ) --> bonds_penalty

### `bondsResetOn(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.bondsResetOn`
- **summary**: MAP ( netuid ) --> bonds_reset

### `burn(NetUid)`: `TaoBalance`

- **interface**: `api.query.subtensorModule.burn`
- **summary**: MAP ( netuid ) --> Burn

### `burnHalfLife(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.burnHalfLife`
- **summary**: MAP ( netuid ) --> BurnHalfLife (blocks)

### `burnIncreaseMult(NetUid)`: `FixedU128`

- **interface**: `api.query.subtensorModule.burnIncreaseMult`
- **summary**: MAP ( netuid ) --> BurnIncreaseMult

### `burnRegistrationsThisInterval(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.burnRegistrationsThisInterval`
- **summary**: MAP ( netuid ) --> burn_registrations_this_interval

### `childKeys(AccountId32, u16)`: `Vec<(u64,AccountId32)>`

- **interface**: `api.query.subtensorModule.childKeys`
- **summary**: DMAP ( parent, netuid ) --> Vec\<(proportion,child)>

### `childkeyTake(AccountId32, u16)`: `PerU16`

- **interface**: `api.query.subtensorModule.childkeyTake`
- **summary**: DMAP ( hot, netuid ) --> take | Returns the hotkey childkey take for a specific subnet

### `ckBurn`: `u64`

- **interface**: `api.query.subtensorModule.ckBurn`
- **summary**: ITEM --> CK burn

### `coldkeyCollateralHotkeys(u16, AccountId32)`: `Vec<AccountId32>`

- **interface**: `api.query.subtensorModule.coldkeyCollateralHotkeys`
- **summary**: DMAP ( netuid, coldkey ) --> BoundedVec of hotkeys

    Hotkeys with a standing [`MinerCollateral`] row for this coldkey on the subnet. Kept in sync by collateral create / remove / swap paths so coldkey swaps migrate bonds with a bounded indexed walk (see [`MAX_COLDKEY_COLLATERAL_HOTKEYS`]) instead of scanning unbounded association vectors.

### `coldkeyMinerCollateral(u16, AccountId32)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.coldkeyMinerCollateral`
- **summary**: MAP ( netuid, coldkey ) --> total locked miner collateral

    `O(1)` aggregate of `MinerCollateral.locked` across that coldkey's hotkeys on the subnet. Kept in sync by collateral credit / settle paths so unstake availability checks do not scan `OwnedHotkeys`.

### `coldkeyRoot(AccountId32)`: `AccountId32`

- **interface**: `api.query.subtensorModule.coldkeyRoot`
- **modifier**: `Optional`
- **summary**: MAP ( coldkey ) --> root_coldkey | first coldkey in this swap lineage. Absent means the coldkey is its own root. Prefer root for owner-keyed bans/attribution, not a single SS58.

### `coldkeySuccessor(AccountId32)`: `AccountId32`

- **interface**: `api.query.subtensorModule.coldkeySuccessor`
- **modifier**: `Optional`
- **summary**: MAP ( old_coldkey ) --> new_coldkey | global coldkey swap successor.

    Written on each successful coldkey swap so watchers can follow owner identity without an archive node. Global (not per-netuid) because a coldkey swap moves ownership everywhere at once.

### `coldkeySwapAnnouncementDelay`: `u32`

- **interface**: `api.query.subtensorModule.coldkeySwapAnnouncementDelay`
- **summary**: The delay after an announcement before a coldkey swap can be performed.

### `coldkeySwapAnnouncements(AccountId32)`: `(u32,H256)`

- **interface**: `api.query.subtensorModule.coldkeySwapAnnouncements`
- **modifier**: `Optional`
- **summary**: A map of the coldkey swap announcements from a coldkey to the block number the coldkey swap can be performed.

### `coldkeySwapDisputes(AccountId32)`: `u32`

- **interface**: `api.query.subtensorModule.coldkeySwapDisputes`
- **modifier**: `Optional`
- **summary**: A map of the coldkey swap disputes from a coldkey to the block number the coldkey swap was disputed.

### `coldkeySwapReannouncementDelay`: `u32`

- **interface**: `api.query.subtensorModule.coldkeySwapReannouncementDelay`
- **summary**: The delay after the initial delay has passed before a new announcement can be made.

### `collateralDrainRatio(NetUid)`: `FixedU128`

- **interface**: `api.query.subtensorModule.collateralDrainRatio`
- **summary**: MAP ( netuid ) --> CollateralDrainRatio (k)

    Alpha of locked collateral released per alpha of hotkey emission earned (miner incentive and validator dividends). Snapshot into `MinerCollateral` at each registration.

### `collateralLockShare(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.collateralLockShare`
- **summary**: MAP ( netuid ) --> CollateralLockShare (p)

    Share of the registration price locked as miner collateral instead of burned, normalized so `u16::MAX` = 100%. 0 (the default) disables collateral: the whole registration price is burned as before.

### `commitRevealWeightsEnabled(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.commitRevealWeightsEnabled`
- **summary**: MAP ( netuid ) --> commit reveal v2 weights are enabled

### `commitRevealWeightsVersion`: `u16`

- **interface**: `api.query.subtensorModule.commitRevealWeightsVersion`
- **summary**: ITEM ( CommitRevealWeightsVersion )

### `consensus(NetUid)`: `Vec<PerU16>`

- **interface**: `api.query.subtensorModule.consensus`
- **summary**: MAP ( netuid ) --> consensus

### `crv3WeightCommits(u16, u64)`: `Vec<(AccountId32,Bytes,u64)>`

- **interface**: `api.query.subtensorModule.crv3WeightCommits`
- **summary**: MAP (netuid, epoch) → VecDeque\<(who, ciphertext, reveal_round)> Deprecated: superseded by `CRV3WeightCommitsV2`.

### `crv3WeightCommitsV2(u16, u64)`: `Vec<(AccountId32,u64,Bytes,u64)>`

- **interface**: `api.query.subtensorModule.crv3WeightCommitsV2`
- **summary**: MAP (netuid, epoch) → VecDeque\<(who, commit_block, ciphertext, reveal_round)> Deprecated: superseded by `TimelockedWeightCommits`.

### `currentDissolveCleanupStatus`: `DissolveCleanupStatus`

- **interface**: `api.query.subtensorModule.currentDissolveCleanupStatus`
- **modifier**: `Optional`
- **summary**: ITEM ( current_dissolve_cleanup_status ) dissolve status for the network

### `decayingHotkeyLock(u16, AccountId32)`: `LockState`

- **interface**: `api.query.subtensorModule.decayingHotkeyLock`
- **modifier**: `Optional`
- **summary**: DMAP ( netuid, hotkey ) --> LockState | Total decaying non-owner lock per hotkey per subnet.

### `decayingLock(AccountId32, u16)`: `bool`

- **interface**: `api.query.subtensorModule.decayingLock`
- **modifier**: `Optional`
- **summary**: DMAP ( coldkey, netuid ) --> false | When present and false, this coldkey's lock is perpetual. Missing entries mean the lock decays by default.

### `decayingOwnerLock(NetUid)`: `LockState`

- **interface**: `api.query.subtensorModule.decayingOwnerLock`
- **modifier**: `Optional`
- **summary**: MAP ( netuid ) --> LockState | Total decaying lock to the owner hotkey for a subnet.

### `delegates(AccountId32)`: `PerU16`

- **interface**: `api.query.subtensorModule.delegates`
- **summary**: MAP ( hot ) --> take | Returns the hotkey delegation take. And signals that this key is open for delegation

### `difficulty(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.difficulty`
- **summary**: MAP ( netuid ) --> Difficulty

### `dissolveCleanupQueue`: `Vec<u16>`

- **interface**: `api.query.subtensorModule.dissolveCleanupQueue`
- **summary**: ITEM ( dissolve_cleanup_queue ) Networks dissolved but some storage not removed yet

### `dissolveNetworkScheduleDuration`: `u32`

- **interface**: `api.query.subtensorModule.dissolveNetworkScheduleDuration`
- **summary**: Duration of dissolve network schedule before execution

### `dividends(NetUid)`: `Vec<PerU16>`

- **interface**: `api.query.subtensorModule.dividends`
- **summary**: MAP ( netuid ) --> dividends

### `emaPriceHalvingBlocks(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.emaPriceHalvingBlocks`
- **summary**: MAP ( netuid ) --> Halving time of average moving price.

### `emission(NetUid)`: `Vec<u64>`

- **interface**: `api.query.subtensorModule.emission`
- **summary**: MAP ( netuid ) --> emission

### `firstEmissionBlockNumber(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.firstEmissionBlockNumber`
- **modifier**: `Optional`
- **summary**: MAP ( netuid ) --> block number of first emission

### `flowEmaSmoothingFactor`: `u64`

- **interface**: `api.query.subtensorModule.flowEmaSmoothingFactor`
- **summary**: ITEM --> Flow EMA smoothing factor (flow alpha), u64 normalized

### `flowNormExponent`: `FixedU128`

- **interface**: `api.query.subtensorModule.flowNormExponent`
- **summary**: ITEM --> Flow Normalization Exponent (p)

### `hasMigrationRun(Bytes)`: `bool`

- **interface**: `api.query.subtensorModule.hasMigrationRun`
- **summary**: Storage for migration run status

### `hotkeyLock(u16, AccountId32)`: `LockState`

- **interface**: `api.query.subtensorModule.hotkeyLock`
- **modifier**: `Optional`
- **summary**: DMAP ( netuid, hotkey ) --> LockState | Total lock per hotkey per subnet.

### `hotkeyRoot(u16, AccountId32)`: `AccountId32`

- **interface**: `api.query.subtensorModule.hotkeyRoot`
- **modifier**: `Optional`
- **summary**: DMap ( netuid, hotkey ) --> root_hotkey | first hotkey in this subnet's swap lineage. Absent means the hotkey is its own root (never swapped into, or never recorded). Ban/score against the root, not a single SS58.

### `hotkeySuccessor(u16, AccountId32)`: `AccountId32`

- **interface**: `api.query.subtensorModule.hotkeySuccessor`
- **modifier**: `Optional`
- **summary**: DMap ( netuid, old_hotkey ) --> new_hotkey | hotkey swap successor on a subnet.

    Written on each successful hotkey swap so watchers can follow identity without an archive node. Per-subnet because a swap may move a UID on one netuid while the old hotkey remains registered elsewhere.

### `identitiesV2(AccountId32)`: `ChainIdentityV2`

- **interface**: `api.query.subtensorModule.identitiesV2`
- **modifier**: `Optional`
- **summary**: MAP ( coldkey ) --> identity

### `immuneOwnerUidsLimit(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.immuneOwnerUidsLimit`
- **summary**: MAP ( netuid ) --> Burn key limit

### `immunityPeriod(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.immunityPeriod`
- **summary**: MAP ( netuid ) --> immunity_period

### `incentive(NetUidStorageIndex)`: `Vec<PerU16>`

- **interface**: `api.query.subtensorModule.incentive`
- **summary**: MAP ( netuid ) --> incentive

### `isNetworkMember(AccountId32, u16)`: `bool`

- **interface**: `api.query.subtensorModule.isNetworkMember`
- **summary**: DMAP ( hotkey, netuid ) --> bool

### `kappa(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.kappa`
- **summary**: MAP ( netuid ) --> Kappa

### `keys(u16, u16)`: `AccountId32`

- **interface**: `api.query.subtensorModule.keys`
- **summary**: DMAP ( netuid, uid ) --> hotkey

### `largestLocked(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.largestLocked`
- **summary**: MAP ( netuid ) --> largest_locked

### `lastAdjustmentBlock(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.lastAdjustmentBlock`
- **summary**: MAP ( netuid ) -->  Block at last adjustment.

### `lastColdkeyHotkeyStakeBlock(AccountId32, AccountId32)`: `u64`

- **interface**: `api.query.subtensorModule.lastColdkeyHotkeyStakeBlock`
- **modifier**: `Optional`
- **summary**: Map (coldkey, hotkey) --> u64 the last block at which stake was added/removed.

### `lastEpochBlock(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.lastEpochBlock`
- **summary**: MAP ( netuid ) --> last epoch attempt block (consumed slot). Drives normal-cadence scheduling and the admin freeze window. Advances on every `should_run_epoch == true` slot — including consistency-skipped slots — and on a successful `sudo_set_tempo` (cycle reset).

### `lastHotkeyEmissionOnNetuid(AccountId32, u16)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.lastHotkeyEmissionOnNetuid`
- **summary**: DMap ( hot, netuid ) --> emission | last hotkey emission on network.

### `lastHotkeySwapOnNetuid(u16, AccountId32)`: `u64`

- **interface**: `api.query.subtensorModule.lastHotkeySwapOnNetuid`
- **summary**: DMap ( netuid, coldkey ) --> blocknumber | last hotkey swap on network.

### `lastMechansimStepBlock(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.lastMechansimStepBlock`
- **summary**: MAP ( netuid ) --> last_mechanism_step_block

### `lastRateLimitedBlock(RateLimitKey)`: `u64`

- **interface**: `api.query.subtensorModule.lastRateLimitedBlock`
- **summary**: MAP ( RateLimitKey ) --> Block number in which the last rate limited operation occured

### `lastTxBlock(AccountId32)`: `u64`

- **interface**: `api.query.subtensorModule.lastTxBlock`
- **summary**: MAP ( key ) --> last_block

### `lastTxBlockChildKeyTake(AccountId32)`: `u64`

- **interface**: `api.query.subtensorModule.lastTxBlockChildKeyTake`
- **summary**: MAP ( key ) --> last_tx_block_childkey_take

### `lastTxBlockDelegateTake(AccountId32)`: `u64`

- **interface**: `api.query.subtensorModule.lastTxBlockDelegateTake`
- **summary**: MAP ( key ) --> last_tx_block_delegate_take

### `lastUpdate(NetUidStorageIndex)`: `Vec<u64>`

- **interface**: `api.query.subtensorModule.lastUpdate`
- **summary**: MAP ( netuid ) --> last_update

### `liquidAlphaOn(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.liquidAlphaOn`
- **summary**: MAP ( netuid ) --> Whether or not Liquid Alpha is enabled

### `loadedEmission(NetUid)`: `Vec<(AccountId32,u64,u64)>`

- **interface**: `api.query.subtensorModule.loadedEmission`
- **modifier**: `Optional`
- **summary**: MAP ( netuid ) --> (hotkey, se, ve)

### `lock(AccountId32, u16, AccountId32)`: `LockState`

- **interface**: `api.query.subtensorModule.lock`
- **modifier**: `Optional`
- **summary**: DMAP ( coldkey, netuid, hotkey ) --> LockState | Exponential lock per coldkey per subnet.

### `lockingColdkeys(u16, AccountId32, AccountId32)`: `Null`

- **interface**: `api.query.subtensorModule.lockingColdkeys`
- **modifier**: `Optional`
- **summary**: NMAP ( netuid, hotkey, coldkey ) --> () | Reverse index for non-zero locks targeting this hotkey on this subnet.

### `maturityRate`: `u64`

- **interface**: `api.query.subtensorModule.maturityRate`
- **summary**: ITEM( maturity_rate ) | Decay timescale in blocks for lock conviction.

### `maxAllowedUids(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.maxAllowedUids`
- **summary**: MAP ( netuid ) --> max_allowed_uids

### `maxAllowedValidators(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.maxAllowedValidators`
- **summary**: MAP ( netuid ) --> max_allowed_validators

### `maxBurn(NetUid)`: `TaoBalance`

- **interface**: `api.query.subtensorModule.maxBurn`
- **summary**: MAP ( netuid ) --> MaxBurn

### `maxChildkeyTake`: `PerU16`

- **interface**: `api.query.subtensorModule.maxChildkeyTake`
- **summary**: ITEM ( default_childkey_take )

### `maxDelegateTake`: `PerU16`

- **interface**: `api.query.subtensorModule.maxDelegateTake`
- **summary**: ITEM ( default_delegate_take )

### `maxDifficulty(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.maxDifficulty`
- **summary**: MAP ( netuid ) --> MaxDifficulty

### `maxEpochsPerBlock`: `u8`

- **interface**: `api.query.subtensorModule.maxEpochsPerBlock`
- **summary**: ITEM ( max_epochs_per_block )

### `maxMechanismCount`: `MechId`

- **interface**: `api.query.subtensorModule.maxMechanismCount`
- **summary**: ITEM( max_mechanism_count )

### `maxRegistrationsPerBlock(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.maxRegistrationsPerBlock`
- **summary**: ITEM( global_max_registrations_per_block )

### `maxWeightsLimit(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.maxWeightsLimit`
- **summary**: MAP ( netuid ) --> max_weight_limit

### `mechanismCountCurrent(NetUid)`: `MechId`

- **interface**: `api.query.subtensorModule.mechanismCountCurrent`
- **summary**: MAP ( netuid ) --> Current number of subnet mechanisms

### `mechanismEmissionSplit(NetUid)`: `Vec<u16>`

- **interface**: `api.query.subtensorModule.mechanismEmissionSplit`
- **modifier**: `Optional`
- **summary**: MAP ( netuid ) --> Normalized vector of emission split proportion between subnet mechanisms

### `minActivityCutoff`: `u16`

- **interface**: `api.query.subtensorModule.minActivityCutoff`

### `minAllowedUids(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.minAllowedUids`
- **summary**: MAP ( netuid ) --> min_allowed_uids

### `minAllowedWeights(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.minAllowedWeights`
- **summary**: MAP ( netuid ) --> min_allowed_weights

### `minBurn(NetUid)`: `TaoBalance`

- **interface**: `api.query.subtensorModule.minBurn`
- **summary**: MAP ( netuid ) --> MinBurn

### `minChildkeyTake`: `PerU16`

- **interface**: `api.query.subtensorModule.minChildkeyTake`
- **summary**: ITEM ( min_childkey_take )

### `minChildkeyTakePerSubnet(NetUid)`: `PerU16`

- **interface**: `api.query.subtensorModule.minChildkeyTakePerSubnet`
- **summary**: MAP ( netuid ) --> take | Returns the subnet-specific minimum childkey take.

### `minDelegateTake`: `PerU16`

- **interface**: `api.query.subtensorModule.minDelegateTake`
- **summary**: ITEM ( min_delegate_take )

### `minDifficulty(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.minDifficulty`
- **summary**: MAP ( netuid ) --> MinDifficulty

### `minerBurned(NetUid)`: `FixedU128`

- **interface**: `api.query.subtensorModule.minerBurned`
- **summary**: MAP ( netuid ) --> miner_burned | Proportion (0..1) of this tempo's miner (incentive) emission that was withheld from miners during emission distribution because the recipient hotkey is owned by the subnet owner (immune key). Counts emission that is either recycled or burned, so the value is independent of the subnet's RecycleOrBurn configuration.

### `minerCollateral(u16, AccountId32, AccountId32)`: `MinerCollateralState`

- **interface**: `api.query.subtensorModule.minerCollateral`
- **modifier**: `Optional`
- **summary**: NMAP ( netuid, hotkey, coldkey ) --> MinerCollateralState

    Standing registration collateral of a `(hotkey, coldkey)` stake position on a subnet. Keyed by coldkey so nominators on the same hotkey are never charged for the owner's bond. The entry persists across deregistration and is only removed when fully drained through earned emission.

### `minNonImmuneUids(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.minNonImmuneUids`
- **summary**: MAP ( netuid ) --> minimum required number of non-immortal & non-immune UIDs

### `netTaoFlowEnabled`: `bool`

- **interface**: `api.query.subtensorModule.netTaoFlowEnabled`

### `networkImmunityPeriod`: `u64`

- **interface**: `api.query.subtensorModule.networkImmunityPeriod`
- **summary**: ITEM( network_immunity_period )

### `networkLastLockCost`: `TaoBalance`

- **interface**: `api.query.subtensorModule.networkLastLockCost`
- **summary**: ITEM( last_network_lock_cost )

### `networkLockReductionInterval`: `u64`

- **interface**: `api.query.subtensorModule.networkLockReductionInterval`
- **summary**: ITEM( network_lock_reduction_interval )

### `networkMinLockCost`: `TaoBalance`

- **interface**: `api.query.subtensorModule.networkMinLockCost`
- **summary**: ITEM( min_network_lock_cost )

### `networkPowRegistrationAllowed(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.networkPowRegistrationAllowed`
- **summary**: MAP ( netuid ) --> network_pow_allowed

### `networkRateLimit`: `u64`

- **interface**: `api.query.subtensorModule.networkRateLimit`
- **summary**: ITEM( network_rate_limit )

### `networkRegisteredAt(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.networkRegisteredAt`
- **summary**: MAP ( netuid ) --> block_created

### `networkRegistrationAllowed(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.networkRegistrationAllowed`
- **summary**: MAP ( netuid ) --> network_registration_allowed

### `networkRegistrationLockId`: `u32`

- **interface**: `api.query.subtensorModule.networkRegistrationLockId`
- **summary**: MAP ( coldkey ) --> lock_id

### `networkRegistrationQueue`: `Vec<PalletSubtensorSubnetsSubnetNetworkRegistrationInfo>`

- **interface**: `api.query.subtensorModule.networkRegistrationQueue`
- **summary**: ITEM ( network_registration_queue ) Network registrations waiting to be executed.

### `networkRegistrationStartBlock`: `u64`

- **interface**: `api.query.subtensorModule.networkRegistrationStartBlock`
- **summary**: ITEM( NetworkRegistrationStartBlock )

### `networksAdded(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.networksAdded`
- **summary**: MAP ( netuid ) --> network_is_added

### `neuronCertificates(u16, AccountId32)`: `NeuronCertificate`

- **interface**: `api.query.subtensorModule.neuronCertificates`
- **modifier**: `Optional`
- **summary**: MAP ( netuid, hotkey ) --> certificate

### `nextStakeJobId`: `u64`

- **interface**: `api.query.subtensorModule.nextStakeJobId`
- **summary**: Ensures unique IDs for StakeJobs storage map

### `nextSubnetLeaseId`: `u32`

- **interface**: `api.query.subtensorModule.nextSubnetLeaseId`
- **summary**: ITEM ( next_lease_id ) | The next lease id.

### `nominatorMinRequiredStake`: `u64`

- **interface**: `api.query.subtensorModule.nominatorMinRequiredStake`
- **summary**: ITEM( nominator_min_required_stake ) --- Factor of DefaultMinStake in per-mill format.

### `numRootClaim`: `u64`

- **interface**: `api.query.subtensorModule.numRootClaim`

### `numStakingColdkeys`: `u64`

- **interface**: `api.query.subtensorModule.numStakingColdkeys`

### `ownedHotkeys(AccountId32)`: `Vec<AccountId32>`

- **interface**: `api.query.subtensorModule.ownedHotkeys`
- **summary**: MAP ( cold ) --> Vec\<hot> | Returns the vector of hotkeys controlled by this coldkey.

### `owner(AccountId32)`: `AccountId32`

- **interface**: `api.query.subtensorModule.owner`
- **summary**: MAP ( hot ) --> cold | Returns the controlling coldkey for a hotkey

### `ownerCutAutoLockEnabled(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.ownerCutAutoLockEnabled`
- **summary**: MAP ( netuid ) --> bool | Whether subnet owner cut should be auto-locked. Missing entries default to false, so auto-locking is disabled unless explicitly enabled.

### `ownerCutEnabled(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.ownerCutEnabled`
- **summary**: MAP ( netuid ) --> owner_cut_enabled

### `ownerHyperparamRateLimit`: `u16`

- **interface**: `api.query.subtensorModule.ownerHyperparamRateLimit`
- **summary**: Global number of epochs used to rate limit subnet owner hyperparameter updates

### `ownerLock(NetUid)`: `LockState`

- **interface**: `api.query.subtensorModule.ownerLock`
- **modifier**: `Optional`
- **summary**: MAP ( netuid ) --> LockState | Total perpetual lock to the owner hotkey for a subnet.

### `palletVersion`: `u16`

- **interface**: `api.query.subtensorModule.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `parentKeys(AccountId32, u16)`: `Vec<(u64,AccountId32)>`

- **interface**: `api.query.subtensorModule.parentKeys`
- **summary**: DMAP ( child, netuid ) --> Vec\<(proportion,parent)>

### `pendingChildKeyCooldown`: `u64`

- **interface**: `api.query.subtensorModule.pendingChildKeyCooldown`
- **summary**: Storage value for pending childkey cooldown, settable by root.

### `pendingChildKeys(u16, AccountId32)`: `(Vec<(u64,AccountId32)>,u64)`

- **interface**: `api.query.subtensorModule.pendingChildKeys`
- **summary**: DMAP ( netuid, parent ) --> (Vec\<(proportion,child)>, cool_down_block)

### `pendingEpochAt(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.pendingEpochAt`
- **summary**: MAP ( netuid ) --> block at which a manually triggered epoch should fire. `0` means no trigger pending. Cleared after the triggered epoch runs.

### `pendingOwnerCut(NetUid)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.pendingOwnerCut`
- **summary**: MAP ( netuid ) --> pending_owner_cut

### `pendingRootAlphaDivs(NetUid)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.pendingRootAlphaDivs`
- **summary**: MAP ( netuid ) --> pending_root_alpha_emission

### `pendingServerEmission(NetUid)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.pendingServerEmission`
- **summary**: MAP ( netuid ) --> pending_server_emission

### `pendingValidatorEmission(NetUid)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.pendingValidatorEmission`
- **summary**: MAP ( netuid ) --> pending_validator_emission

### `powRegistrationsThisInterval(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.powRegistrationsThisInterval`
- **summary**: MAP ( netuid ) --> pow_registrations_this_interval

### `prometheus(u16, AccountId32)`: `PrometheusInfo`

- **interface**: `api.query.subtensorModule.prometheus`
- **modifier**: `Optional`
- **summary**: MAP ( netuid, hotkey ) --> prometheus_info

### `raoRecycledForRegistration(NetUid)`: `TaoBalance`

- **interface**: `api.query.subtensorModule.raoRecycledForRegistration`
- **summary**: MAP ( netuid ) --> global_RAO_recycled_for_registration

### `recycleOrBurn(NetUid)`: `RecycleOrBurnEnum`

- **interface**: `api.query.subtensorModule.recycleOrBurn`
- **summary**: MAP ( netuid ) --> recycle_or_burn

### `registeredSubnetCounter(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.registeredSubnetCounter`
- **summary**: MAP ( netuid ) --> registered_subnet_counter

    Monotonic counter incremented on every successful `do_register_network` for a given netuid. Consumers that persist per-netuid state keyed by `(user, netuid)` (e.g. the staking precompile `AllowancesStorage`) can mix the current counter value into their storage key so that entries written under a previous registration of the same netuid become unreachable after the netuid is re-registered, without requiring unbounded storage iteration on deregistration.

### `registrationsThisBlock(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.registrationsThisBlock`
- **summary**: MAP ( netuid ) --> Registrations of this Block.

### `registrationsThisInterval(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.registrationsThisInterval`
- **summary**: MAP ( netuid ) --> registrations_this_interval

### `revealPeriodEpochs(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.revealPeriodEpochs`
- **summary**: Map (netuid) --> Number of epochs allowed for commit reveal periods

### `rho(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.rho`
- **summary**: MAP ( netuid ) --> Rho

### `rootAlphaDividendsPerSubnet(u16, AccountId32)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.rootAlphaDividendsPerSubnet`
- **summary**: DMAP ( netuid, hotkey ) --> u64 | Last root alpha dividend this hotkey got on tempo.

### `rootClaimable(AccountId32)`: `BTreeMap`

- **interface**: `api.query.subtensorModule.rootClaimable`

### `rootClaimableThreshold(NetUid)`: `FixedI128`

- **interface**: `api.query.subtensorModule.rootClaimableThreshold`

### `rootClaimed(u16, AccountId32, AccountId32)`: `u128`

- **interface**: `api.query.subtensorModule.rootClaimed`

### `rootClaimType(AccountId32)`: `RootClaimTypeEnum`

- **interface**: `api.query.subtensorModule.rootClaimType`

### `rootProp(NetUid)`: `FixedU128`

- **interface**: `api.query.subtensorModule.rootProp`
- **summary**: MAP ( netuid ) --> root_prop | The subnet root proportion.

### `scalingLawPower(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.scalingLawPower`
- **summary**: MAP ( netuid ) --> scaling_law_power

### `servingRateLimit(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.servingRateLimit`
- **summary**: MAP ( netuid ) --> serving_rate_limit

### `stakeThreshold`: `u64`

- **interface**: `api.query.subtensorModule.stakeThreshold`
- **summary**: ITEM( weights_min_stake )

### `stakeWeight(NetUid)`: `Vec<u16>`

- **interface**: `api.query.subtensorModule.stakeWeight`
- **summary**: DMAP ( netuid ) --> stake_weight | weight for stake used in YC.

### `stakingColdkeys(AccountId32)`: `u64`

- **interface**: `api.query.subtensorModule.stakingColdkeys`
- **modifier**: `Optional`

### `stakingColdkeysByIndex(u64)`: `AccountId32`

- **interface**: `api.query.subtensorModule.stakingColdkeysByIndex`
- **modifier**: `Optional`

### `stakingHotkeys(AccountId32)`: `Vec<AccountId32>`

- **interface**: `api.query.subtensorModule.stakingHotkeys`
- **summary**: MAP ( cold ) --> Vec\<hot> | Maps coldkey to hotkeys that stake to it

### `startCallDelay`: `u64`

- **interface**: `api.query.subtensorModule.startCallDelay`
- **summary**: ITEM( start_call_delay )

### `subnetAlphaIn(NetUid)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.subnetAlphaIn`
- **summary**: MAP ( netuid ) --> alpha_supply_in_pool | Returns the amount of alpha in the pool.

### `subnetAlphaInEmission(NetUid)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.subnetAlphaInEmission`
- **summary**: MAP ( netuid ) --> alpha_in_emission | Returns the amount of alph in  emission into the pool per block.

### `subnetAlphaOut(NetUid)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.subnetAlphaOut`
- **summary**: MAP ( netuid ) --> alpha_supply_in_subnet | Returns the amount of alpha in the subnet.

### `subnetAlphaOutEmission(NetUid)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.subnetAlphaOutEmission`
- **summary**: MAP ( netuid ) --> alpha_out_emission | Returns the amount of alpha out emission into the network per block.

### `subnetEmaProtocolFlow(NetUid)`: `(u64,SubstrateFixedFixedI128)`

- **interface**: `api.query.subtensorModule.subnetEmaProtocolFlow`
- **modifier**: `Optional`
- **summary**: MAP ( netuid ) --> subnet_ema_protocol_flow | EMA of protocol cost flow, same smoothing as SubnetEmaTaoFlow.

### `subnetEmaTaoFlow(NetUid)`: `(u64,SubstrateFixedFixedI128)`

- **interface**: `api.query.subtensorModule.subnetEmaTaoFlow`
- **modifier**: `Optional`
- **summary**: MAP ( netuid ) --> subnet_ema_tao_flow | Returns the EMA of TAO inflow-outflow balance.

### `subnetEmissionEnabled(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.subnetEmissionEnabled`
- **summary**: MAP ( netuid ) --> subnet_emission_enabled

    When false, subnet pool-side emission is disabled for this subnet: `alpha_in`, `tao_in`, and `excess_tao` chain buys are all treated as zero. `alpha_out`, owner cut, root proportion, pending server emission, and pending validator emission are intentionally left unchanged.

    Defaults to true so existing subnets keep current behavior.

### `subnetEpochIndex(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.subnetEpochIndex`
- **summary**: MAP ( netuid ) --> monotonic epoch counter. Incremented by exactly one each time the subnet's epoch slot is consumed in `run_coinbase`

### `subnetExcessTao(NetUid)`: `TaoBalance`

- **interface**: `api.query.subtensorModule.subnetExcessTao`
- **summary**: MAP ( netuid ) --> excess_tao | Returns the excess TAO swapped (chain buys) into this subnet on the last block.

### `subnetIdentitiesV3(NetUid)`: `SubnetIdentityV3`

- **interface**: `api.query.subtensorModule.subnetIdentitiesV3`
- **modifier**: `Optional`
- **summary**: MAP ( netuid ) --> SubnetIdentityOfV3

### `subnetLeases(u32)`: `SubnetLease`

- **interface**: `api.query.subtensorModule.subnetLeases`
- **modifier**: `Optional`
- **summary**: MAP ( lease_id ) --> subnet lease | The subnet lease for a given lease id.

### `subnetLeaseShares(u32, AccountId32)`: `FixedU128`

- **interface**: `api.query.subtensorModule.subnetLeaseShares`
- **summary**: DMAP ( lease_id, contributor ) --> shares | The shares of a contributor for a given lease.

### `subnetLimit`: `u16`

- **interface**: `api.query.subtensorModule.subnetLimit`
- **summary**: The Subtensor [`TotalIssuance`] represents the total issuance of tokens on the Bittensor network.

    It is comprised of three parts:
    - The total amount of issued tokens, tracked in the TotalIssuance of the Balances pallet
    - The total amount of tokens staked in the system, tracked in [`TotalStake`]
    - The total amount of tokens locked up for subnet reg, tracked in [`TotalSubnetLocked`] attained by iterating over subnet lock.

    Eventually, Bittensor should migrate to using Holds afterwhich time we will not require this separate accounting. ITEM ( maximum_number_of_networks )

### `subnetLocked(NetUid)`: `TaoBalance`

- **interface**: `api.query.subtensorModule.subnetLocked`
- **summary**: MAP ( netuid ) --> total_subnet_locked

### `subnetMechanism(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.subnetMechanism`
- **summary**: MAP ( netuid ) --> subnet mechanism

### `subnetMovingAlpha`: `FixedI128`

- **interface**: `api.query.subtensorModule.subnetMovingAlpha`
- **summary**: ITEM ( moving_alpha ) -- subnet moving alpha.

### `subnetMovingPrice(NetUid)`: `FixedI128`

- **interface**: `api.query.subtensorModule.subnetMovingPrice`
- **summary**: MAP ( netuid ) --> moving_price | The subnet moving price.

### `subnetOwner(NetUid)`: `AccountId32`

- **interface**: `api.query.subtensorModule.subnetOwner`
- **summary**: MAP ( netuid ) --> subnet_owner

### `subnetOwnerCut`: `u16`

- **interface**: `api.query.subtensorModule.subnetOwnerCut`
- **summary**: ITEM( subnet_owner_cut )

### `subnetOwnerHotkey(NetUid)`: `AccountId32`

- **interface**: `api.query.subtensorModule.subnetOwnerHotkey`
- **summary**: MAP ( netuid ) --> subnet_owner_hotkey

### `subnetProtocolAlpha(NetUid)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.subnetProtocolAlpha`
- **summary**: MAP ( netuid ) --> protocol_alpha | Returns the protocol-owned alpha cached for the subnet.

### `subnetProtocolFlow(NetUid)`: `i64`

- **interface**: `api.query.subtensorModule.subnetProtocolFlow`
- **summary**: MAP ( netuid ) --> subnet_protocol_flow | Per-block accumulator for protocol cost (emission + chain buys - root sells).

### `subnetRootSellTao(NetUid)`: `TaoBalance`

- **interface**: `api.query.subtensorModule.subnetRootSellTao`
- **summary**: MAP ( netuid ) --> root_sell_tao | Returns the TAO received from root dividend sells on this subnet on the last block.

### `subnetTAO(NetUid)`: `TaoBalance`

- **interface**: `api.query.subtensorModule.subnetTAO`
- **summary**: MAP ( netuid ) --> tao_in_subnet | Returns the amount of TAO in the subnet.

### `subnetTaoFlow(NetUid)`: `i64`

- **interface**: `api.query.subtensorModule.subnetTaoFlow`
- **summary**: MAP ( netuid ) --> subnet_tao_flow | Returns the TAO inflow-outflow balance.

### `subnetTaoInEmission(NetUid)`: `TaoBalance`

- **interface**: `api.query.subtensorModule.subnetTaoInEmission`
- **summary**: MAP ( netuid ) --> tao_in_emission | Returns the amount of tao emitted into this subent on the last block.

### `subnetUidToLeaseId(NetUid)`: `u32`

- **interface**: `api.query.subtensorModule.subnetUidToLeaseId`
- **modifier**: `Optional`
- **summary**: MAP ( netuid ) --> lease_id | The lease id for a given netuid.

### `subnetVolume(NetUid)`: `u128`

- **interface**: `api.query.subtensorModule.subnetVolume`
- **summary**: MAP ( netuid ) --> total_volume | The total amount of TAO bought and sold since the start of the network.

### `subnetworkN(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.subnetworkN`
- **summary**: MAP ( netuid ) --> subnetwork_n (Number of UIDs in the network).

### `subtokenEnabled(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.subtokenEnabled`
- **summary**: MAP ( netuid ) --> If subtoken trading enabled

### `taoFlowCutoff`: `FixedI128`

- **interface**: `api.query.subtensorModule.taoFlowCutoff`
- **summary**: ITEM --> TAO Flow Cutoff

### `taoInRefundDeploymentBlock`: `u64`

- **interface**: `api.query.subtensorModule.taoInRefundDeploymentBlock`
- **summary**: ITEM( TaoInRefundDeploymentBlock )

### `taoWeight`: `u64`

- **interface**: `api.query.subtensorModule.taoWeight`
- **summary**: The Subtensor [`TotalIssuance`] represents the total issuance of tokens on the Bittensor network.

    It is comprised of three parts:
    - The total amount of issued tokens, tracked in the TotalIssuance of the Balances pallet
    - The total amount of tokens staked in the system, tracked in [`TotalStake`]
    - The total amount of tokens locked up for subnet reg, tracked in [`TotalSubnetLocked`] attained by iterating over subnet lock.

    Eventually, Bittensor should migrate to using Holds afterwhich time we will not require this separate accounting. ITEM --> Global weight

### `targetRegistrationsPerInterval(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.targetRegistrationsPerInterval`
- **summary**: MAP ( netuid ) --> target_registrations_this_interval

### `tempo(NetUid)`: `u16`

- **interface**: `api.query.subtensorModule.tempo`
- **summary**: MAP ( netuid ) --> tempo

### `timelockedWeightCommits(u16, u64)`: `Vec<(AccountId32,u64,Bytes,u64)>`

- **interface**: `api.query.subtensorModule.timelockedWeightCommits`
- **summary**: MAP (netuid, epoch) → VecDeque\<(who, commit_block, ciphertext, reveal_round)> Stores a queue of weight commits for an account on a given subnet.

### `tokenSymbol(NetUid)`: `Bytes`

- **interface**: `api.query.subtensorModule.tokenSymbol`
- **summary**: MAP ( netuid ) --> token_symbol | Returns the token symbol for a subnet.

### `totalHotkeyAlpha(AccountId32, u16)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.totalHotkeyAlpha`
- **summary**: DMAP ( hot, netuid ) --> alpha | Returns the total amount of alpha a hotkey owns.

### `totalHotkeyAlphaLastEpoch(AccountId32, u16)`: `AlphaBalance`

- **interface**: `api.query.subtensorModule.totalHotkeyAlphaLastEpoch`
- **summary**: DMAP ( hot, netuid ) --> alpha | Returns the total amount of alpha a hotkey owned in the last epoch.

### `totalHotkeyShares(AccountId32, u16)`: `FixedU128`

- **interface**: `api.query.subtensorModule.totalHotkeyShares`
- **summary**: DMAP ( hot, netuid ) --> total_alpha_shares | Returns the number of alpha shares for a hotkey on a subnet.

### `totalHotkeySharesV2(AccountId32, u16)`: `SafeFloat`

- **interface**: `api.query.subtensorModule.totalHotkeySharesV2`
- **summary**: DMAP ( hot, netuid ) --> total_alpha_shares | Returns the number of alpha shares for a hotkey on a subnet, stores SafeFloat.

### `totalIssuance`: `TaoBalance`

- **interface**: `api.query.subtensorModule.totalIssuance`
- **summary**: ITEM ( total_issuance )

### `totalNetworks`: `u16`

- **interface**: `api.query.subtensorModule.totalNetworks`
- **summary**: ITEM( total_number_of_existing_networks )

### `totalStake`: `TaoBalance`

- **interface**: `api.query.subtensorModule.totalStake`
- **summary**: ITEM ( total_stake )

### `transactionKeyLastBlock(AccountId32, u16, u16)`: `u64`

- **interface**: `api.query.subtensorModule.transactionKeyLastBlock`
- **summary**: NMAP ( hot, netuid, name ) --> last_block | Returns the last block of a transaction for a given key, netuid, and name.

### `transferToggle(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.transferToggle`
- **summary**: MAP ( netuid ) --> transfer_toggle

### `txChildkeyTakeRateLimit`: `u64`

- **interface**: `api.query.subtensorModule.txChildkeyTakeRateLimit`
- **summary**: ITEM ( tx_childkey_take_rate_limit )

### `txDelegateTakeRateLimit`: `u64`

- **interface**: `api.query.subtensorModule.txDelegateTakeRateLimit`
- **summary**: ITEM ( tx_delegate_take_rate_limit )

### `txRateLimit`: `u64`

- **interface**: `api.query.subtensorModule.txRateLimit`
- **summary**: ITEM ( tx_rate_limit )

### `uids(u16, AccountId32)`: `u16`

- **interface**: `api.query.subtensorModule.uids`
- **modifier**: `Optional`
- **summary**: DMAP ( netuid, hotkey ) --> uid

### `unlockRate`: `u64`

- **interface**: `api.query.subtensorModule.unlockRate`
- **summary**: ITEM( unlock_rate ) | Decay timescale in blocks for locked mass.

### `usedWork(Bytes)`: `u64`

- **interface**: `api.query.subtensorModule.usedWork`
- **summary**: StorageItem Global Used Work.

### `validatorPermit(NetUid)`: `Vec<bool>`

- **interface**: `api.query.subtensorModule.validatorPermit`
- **summary**: MAP ( netuid ) --> validator_permit

### `validatorPruneLen(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.validatorPruneLen`
- **summary**: MAP ( netuid ) --> validator_prune_len

### `validatorTrust(NetUid)`: `Vec<PerU16>`

- **interface**: `api.query.subtensorModule.validatorTrust`
- **summary**: MAP ( netuid ) --> validator_trust

### `votingPower(u16, AccountId32)`: `u64`

- **interface**: `api.query.subtensorModule.votingPower`
- **summary**: DMAP ( netuid, hotkey ) --> voting_power | EMA of stake for voting This tracks stake EMA updated every epoch when VotingPowerTrackingEnabled is true. Used by smart contracts to determine validator voting power for subnet governance.

### `votingPowerDisableAtBlock(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.votingPowerDisableAtBlock`
- **summary**: MAP ( netuid ) --> block_number | Block at which voting power tracking will be disabled. When set (non-zero), tracking continues until this block, then automatically disables and clears VotingPower entries for the subnet. Provides a 14-day grace period.

### `votingPowerEmaAlpha(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.votingPowerEmaAlpha`
- **summary**: MAP ( netuid ) --> u64 | EMA alpha value for voting power calculation. Higher alpha = faster response to stake changes. Stored as u64 with 18 decimal precision (1.0 = 10^18). Only settable by sudo/root.

### `votingPowerTrackingEnabled(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.votingPowerTrackingEnabled`
- **summary**: MAP ( netuid ) --> bool | Whether voting power tracking is enabled for this subnet. When enabled, VotingPower EMA is updated every epoch. Default is false. When disabled with disable_at_block set, tracking continues until that block.

### `weightCommits(u16, AccountId32)`: `Vec<(H256,u64,u64,u64)>`

- **interface**: `api.query.subtensorModule.weightCommits`
- **modifier**: `Optional`
- **summary**: MAP (netuid, who) --> VecDeque\<(hash, commit_epoch, commit_block, _unused)> Stores a queue of commit-reveal-v2 commits for an account on a given netuid.

### `weights(u16, u16)`: `Vec<(u16,u16)>`

- **interface**: `api.query.subtensorModule.weights`
- **summary**: DMAP ( netuid, uid ) --> weights

### `weightsSetRateLimit(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.weightsSetRateLimit`
- **summary**: MAP ( netuid ) --> weights_set_rate_limit

### `weightsVersionKey(NetUid)`: `u64`

- **interface**: `api.query.subtensorModule.weightsVersionKey`
- **summary**: MAP ( netuid ) --> weights_version_key

### `weightsVersionKeyRateLimit`: `u64`

- **interface**: `api.query.subtensorModule.weightsVersionKeyRateLimit`
- **summary**: ITEM( weights_version_key_rate_limit ) --- Rate limit in tempos.

### `yuma3On(NetUid)`: `bool`

- **interface**: `api.query.subtensorModule.yuma3On`
- **summary**: MAP ( netuid ) --> Whether or not Yuma3 is enabled


## `sudo`

### `key`: `AccountId32`

- **interface**: `api.query.sudo.key`
- **modifier**: `Optional`
- **summary**: The `AccountId` of the sudo key.

### `palletVersion`: `u16`

- **interface**: `api.query.sudo.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage


## `swap`

### `balancerAlphaReservoir(NetUid)`: `AlphaBalance`

- **interface**: `api.query.swap.balancerAlphaReservoir`
- **summary**: Alpha protocol liquidity that could not be injected without exceeding balancer weight bounds.

### `balancerTaoReservoir(NetUid)`: `TaoBalance`

- **interface**: `api.query.swap.balancerTaoReservoir`
- **summary**: TAO protocol liquidity that could not be injected without exceeding balancer weight bounds.

### `feeRate(NetUid)`: `u16`

- **interface**: `api.query.swap.feeRate`
- **summary**: The fee rate applied to swaps per subnet, normalized value between 0 and u16::MAX

### `hasMigrationRun(Bytes)`: `bool`

- **interface**: `api.query.swap.hasMigrationRun`
- **summary**: Storage for migration run status

### `palletVersion`: `u16`

- **interface**: `api.query.swap.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `palSwapInitialized(NetUid)`: `bool`

- **interface**: `api.query.swap.palSwapInitialized`
- **summary**: Storage to determine whether balancer swap was initialized for a specific subnet.

### `scrapReservoirAlpha(NetUid)`: `AlphaBalance`

- **interface**: `api.query.swap.scrapReservoirAlpha`
- **summary**: Alpha reservoir for scraps of protocol claimed fees.

### `swapBalancer(NetUid)`: `Balancer`

- **interface**: `api.query.swap.swapBalancer`
- **summary**: u64-normalized reserve weight


## `system`

### `account(AccountId32)`: `AccountInfo`

- **interface**: `api.query.system.account`
- **summary**: The full account information for a particular account ID.

### `allExtrinsicsLen`: `u32`

- **interface**: `api.query.system.allExtrinsicsLen`
- **modifier**: `Optional`
- **summary**: Total length (in bytes) for all extrinsics put together, for the current block.

### `authorizedUpgrade`: `CodeUpgradeAuthorization`

- **interface**: `api.query.system.authorizedUpgrade`
- **modifier**: `Optional`
- **summary**: `Some` if a code upgrade has been authorized.

### `blockHash(u32)`: `H256`

- **interface**: `api.query.system.blockHash`
- **summary**: Map of block numbers to block hashes.

### `blockWeight`: `PerDispatchClass`

- **interface**: `api.query.system.blockWeight`
- **summary**: The current weight for the block.

### `digest`: `Digest`

- **interface**: `api.query.system.digest`
- **summary**: Digest of the current block, also part of the block header.

### `eventCount`: `u32`

- **interface**: `api.query.system.eventCount`
- **summary**: The number of events in the `Events<T>` list.

### `events`: `Vec<FrameSystemEventRecord>`

- **interface**: `api.query.system.events`
- **summary**: Events deposited for the current block.

    NOTE: The item is unbound and should therefore never be read on chain. It could otherwise inflate the PoV size of a block.

    Events have a large in-memory size. Box the events to not go out-of-memory just in case someone still reads them from within the runtime.

### `eventTopics(H256)`: `Vec<(u32,u32)>`

- **interface**: `api.query.system.eventTopics`
- **summary**: Mapping between a topic (represented by T::Hash) and a vector of indexes of events in the `<Events<T>>` list.

    All topic vectors have deterministic storage locations depending on the topic. This allows light-clients to leverage the changes trie storage tracking mechanism and in case of changes fetch the list of events of interest.

    The value has the type `(BlockNumberFor<T>, EventIndex)` because if we used only just the `EventIndex` then in case if the topic has the same contents on the next block no notification will be triggered thus the event might be lost.

### `executionPhase`: `Phase`

- **interface**: `api.query.system.executionPhase`
- **modifier**: `Optional`
- **summary**: The execution phase of the block.

### `extrinsicCount`: `u32`

- **interface**: `api.query.system.extrinsicCount`
- **modifier**: `Optional`
- **summary**: Total extrinsics count for the current block.

### `extrinsicData(u32)`: `Bytes`

- **interface**: `api.query.system.extrinsicData`
- **summary**: Extrinsics data for the current block (maps an extrinsic's index to its data).

### `extrinsicWeightReclaimed`: `Weight`

- **interface**: `api.query.system.extrinsicWeightReclaimed`
- **summary**: The weight reclaimed for the extrinsic.

    This information is available until the end of the extrinsic execution. More precisely this information is removed in `note_applied_extrinsic`.

    Logic doing some post dispatch weight reduction must update this storage to avoid duplicate reduction.

### `inherentsApplied`: `bool`

- **interface**: `api.query.system.inherentsApplied`
- **summary**: Whether all inherents have been applied.

### `lastRuntimeUpgrade`: `LastRuntimeUpgradeInfo`

- **interface**: `api.query.system.lastRuntimeUpgrade`
- **modifier**: `Optional`
- **summary**: Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.

### `number`: `u32`

- **interface**: `api.query.system.number`
- **summary**: The current block number being processed. Set by `execute_block`.

### `palletVersion`: `u16`

- **interface**: `api.query.system.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `parentHash`: `H256`

- **interface**: `api.query.system.parentHash`
- **summary**: Hash of the previous block.

### `upgradedToTripleRefCount`: `bool`

- **interface**: `api.query.system.upgradedToTripleRefCount`
- **summary**: True if we have upgraded so that AccountInfo contains three types of `RefCount`. False (default) if not.

### `upgradedToU32RefCount`: `bool`

- **interface**: `api.query.system.upgradedToU32RefCount`
- **summary**: True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.


## `timestamp`

### `didUpdate`: `bool`

- **interface**: `api.query.timestamp.didUpdate`
- **summary**: Whether the timestamp has been updated in this block.

    This value is updated to `true` upon successful submission of a timestamp by a node. It is then checked at the end of each block execution in the `on_finalize` hook.

### `now`: `u64`

- **interface**: `api.query.timestamp.now`
- **summary**: The current time for the current block.

### `palletVersion`: `u16`

- **interface**: `api.query.timestamp.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage


## `transactionPayment`

### `nextFeeMultiplier`: `FixedU128`

- **interface**: `api.query.transactionPayment.nextFeeMultiplier`

### `palletVersion`: `u16`

- **interface**: `api.query.transactionPayment.palletVersion`
- **modifier**: `Required`
- **summary**: Returns the current pallet version from storage

### `storageVersion`: `Releases`

- **interface**: `api.query.transactionPayment.storageVersion`
