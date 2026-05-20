---
title: Runtime Calls
description: "This page includes runtime API calls exposed by the Subtensor runtime."
---

# Runtime Calls

This page includes runtime API calls exposed by the Subtensor runtime. Accessible via `api.call.<RuntimeApi>.<method_name>`.

:::info
Generated from a live snapshot of the Subtensor runtime on **2026-05-15**. Connected to: `wss://entrypoint-finney.opentensor.ai:443`
:::

- **[accountNonceApi](#accountnonceapi)**
- **[auraApi](#auraapi)**
- **[babeApi](#babeapi)**
- **[blockBuilder](#blockbuilder)**
- **[contractsApi](#contractsapi)**
- **[convertTransactionRuntimeApi](#converttransactionruntimeapi)**
- **[core](#core)**
- **[genesisBuilder](#genesisbuilder)**
- **[grandpaApi](#grandpaapi)**
- **[metadata](#metadata)**
- **[offchainWorkerApi](#offchainworkerapi)**
- **[sessionKeys](#sessionkeys)**
- **[taggedTransactionQueue](#taggedtransactionqueue)**
- **[transactionPaymentApi](#transactionpaymentapi)**
- **[transactionPaymentCallApi](#transactionpaymentcallapi)**

## `accountNonceApi`

### `accountNonce(accountId: AccountId)`: `Index`

- **interface**: `api.call.accountNonceApi.accountNonce`

## `auraApi`

### `authorities()`: `Vec<AuthorityId>`

- **interface**: `api.call.auraApi.authorities`

### `slotDuration()`: `SlotDuration`

- **interface**: `api.call.auraApi.slotDuration`

## `babeApi`

### `configuration()`: `BabeGenesisConfiguration`

- **interface**: `api.call.babeApi.configuration`

### `currentEpoch()`: `Epoch`

- **interface**: `api.call.babeApi.currentEpoch`

### `currentEpochStart()`: `Slot`

- **interface**: `api.call.babeApi.currentEpochStart`

### `generateKeyOwnershipProof(slot: Slot, authorityId: AuthorityId)`: `Option<OpaqueKeyOwnershipProof>`

- **interface**: `api.call.babeApi.generateKeyOwnershipProof`

### `nextEpoch()`: `Epoch`

- **interface**: `api.call.babeApi.nextEpoch`

### `submitReportEquivocationUnsignedExtrinsic(equivocationProof: BabeEquivocationProof, keyOwnerProof: OpaqueKeyOwnershipProof)`: `Option<Null>`

- **interface**: `api.call.babeApi.submitReportEquivocationUnsignedExtrinsic`

## `blockBuilder`

### `applyExtrinsic(extrinsic: Extrinsic)`: `ApplyExtrinsicResult`

- **interface**: `api.call.blockBuilder.applyExtrinsic`

### `checkInherents(block: Block, data: InherentData)`: `CheckInherentsResult`

- **interface**: `api.call.blockBuilder.checkInherents`

### `finalizeBlock()`: `Header`

- **interface**: `api.call.blockBuilder.finalizeBlock`

### `inherentExtrinsics(inherent: InherentData)`: `Vec<Extrinsic>`

- **interface**: `api.call.blockBuilder.inherentExtrinsics`

## `contractsApi`

### `call(origin: AccountId, dest: AccountId, value: Balance, gasLimit: Option<WeightV2>, storageDepositLimit: Option<Balance>, inputData: Vec<u8>)`: `ContractExecResult`

- **interface**: `api.call.contractsApi.call`

### `getStorage(address: AccountId, key: Bytes)`: `Option<Bytes>`

- **interface**: `api.call.contractsApi.getStorage`

### `instantiate(origin: AccountId, value: Balance, gasLimit: Option<WeightV2>, storageDepositLimit: Option<Balance>, code: CodeSource, data: Bytes, salt: Bytes)`: `ContractInstantiateResult`

- **interface**: `api.call.contractsApi.instantiate`

### `uploadCode(origin: AccountId, code: Bytes, storageDepositLimit: Option<Balance>)`: `CodeUploadResult`

- **interface**: `api.call.contractsApi.uploadCode`

## `convertTransactionRuntimeApi`

### `convertTransaction(transaction: TransactionV2)`: `Extrinsic`

- **interface**: `api.call.convertTransactionRuntimeApi.convertTransaction`

## `core`

### `executeBlock(block: Block)`: `Null`

- **interface**: `api.call.core.executeBlock`

### `initializeBlock(header: Header)`: `ExtrinsicInclusionMode`

- **interface**: `api.call.core.initializeBlock`

### `version()`: `RuntimeVersion`

- **interface**: `api.call.core.version`

## `genesisBuilder`

### `buildConfig(json: Vec<u8>)`: `Result<(), GenesisBuildErr>`

- **interface**: `api.call.genesisBuilder.buildConfig`

### `createDefaultConfig()`: `Vec<u8>`

- **interface**: `api.call.genesisBuilder.createDefaultConfig`

## `grandpaApi`

### `currentSetId()`: `SetId`

- **interface**: `api.call.grandpaApi.currentSetId`

### `generateKeyOwnershipProof(setId: SetId, authorityId: AuthorityId)`: `Option<OpaqueKeyOwnershipProof>`

- **interface**: `api.call.grandpaApi.generateKeyOwnershipProof`

### `grandpaAuthorities()`: `AuthorityList`

- **interface**: `api.call.grandpaApi.grandpaAuthorities`

### `submitReportEquivocationUnsignedExtrinsic(equivocationProof: GrandpaEquivocationProof, keyOwnerProof: OpaqueKeyOwnershipProof)`: `Option<Null>`

- **interface**: `api.call.grandpaApi.submitReportEquivocationUnsignedExtrinsic`

## `metadata`

### `metadata()`: `OpaqueMetadata`

- **interface**: `api.call.metadata.metadata`

### `metadataAtVersion(version: u32)`: `Option<OpaqueMetadata>`

- **interface**: `api.call.metadata.metadataAtVersion`

### `metadataVersions()`: `Vec<u32>`

- **interface**: `api.call.metadata.metadataVersions`

## `offchainWorkerApi`

### `offchainWorker(header: Header)`: `Null`

- **interface**: `api.call.offchainWorkerApi.offchainWorker`

## `sessionKeys`

### `decodeSessionKeys(encoded: Bytes)`: `Option<Vec<(Bytes, KeyTypeId)>>`

- **interface**: `api.call.sessionKeys.decodeSessionKeys`

### `generateSessionKeys(seed: Option<Bytes>)`: `Bytes`

- **interface**: `api.call.sessionKeys.generateSessionKeys`

## `taggedTransactionQueue`

### `validateTransaction(source: TransactionSource, tx: Extrinsic, blockHash: BlockHash)`: `TransactionValidity`

- **interface**: `api.call.taggedTransactionQueue.validateTransaction`

## `transactionPaymentApi`

### `queryFeeDetails(uxt: Extrinsic, len: u32)`: `FeeDetails`

- **interface**: `api.call.transactionPaymentApi.queryFeeDetails`

### `queryInfo(uxt: Extrinsic, len: u32)`: `RuntimeDispatchInfo`

- **interface**: `api.call.transactionPaymentApi.queryInfo`

### `queryLengthToFee(length: u32)`: `Balance`

- **interface**: `api.call.transactionPaymentApi.queryLengthToFee`

### `queryWeightToFee(weight: Weight)`: `Balance`

- **interface**: `api.call.transactionPaymentApi.queryWeightToFee`

## `transactionPaymentCallApi`

### `queryCallFeeDetails(call: Call, len: u32)`: `FeeDetails`

- **interface**: `api.call.transactionPaymentCallApi.queryCallFeeDetails`

### `queryCallInfo(call: Call, len: u32)`: `RuntimeDispatchInfo`

- **interface**: `api.call.transactionPaymentCallApi.queryCallInfo`

### `queryLengthToFee(length: u32)`: `Balance`

- **interface**: `api.call.transactionPaymentCallApi.queryLengthToFee`

### `queryWeightToFee(weight: Weight)`: `Balance`

- **interface**: `api.call.transactionPaymentCallApi.queryWeightToFee`
