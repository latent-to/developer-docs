---
title: Runtime Calls
description: "This page includes runtime API calls exposed by the Subtensor runtime."
---

# Runtime Calls

This page includes runtime API calls exposed by the Subtensor runtime. Accessible via `api.call.<RuntimeApi>.<method_name>`.

:::info
Generated from Subtensor runtime spec version **419**. Connected to: `wss://entrypoint-finney.opentensor.ai:443`
:::

- **[AccountNonceApi](#accountnonceapi)**
- **[AuraApi](#auraapi)**
- **[BabeApi](#babeapi)**
- **[BlockBuilder](#blockbuilder)**
- **[ContractsApi](#contractsapi)**
- **[ConvertTransactionRuntimeApi](#converttransactionruntimeapi)**
- **[Core](#core)**
- **[DelegateInfoRuntimeApi](#delegateinforuntimeapi)**
- **[EthereumRuntimeRPCApi](#ethereumruntimerpcapi)**
- **[GenesisBuilder](#genesisbuilder)**
- **[GrandpaApi](#grandpaapi)**
- **[Metadata](#metadata)**
- **[NeuronInfoRuntimeApi](#neuroninforuntimeapi)**
- **[OffchainWorkerApi](#offchainworkerapi)**
- **[ProxyFilterRuntimeApi](#proxyfilterruntimeapi)**
- **[SessionKeys](#sessionkeys)**
- **[ShieldApi](#shieldapi)**
- **[StakeInfoRuntimeApi](#stakeinforuntimeapi)**
- **[SubnetInfoRuntimeApi](#subnetinforuntimeapi)**
- **[SubnetRegistrationRuntimeApi](#subnetregistrationruntimeapi)**
- **[SwapRuntimeApi](#swapruntimeapi)**
- **[TaggedTransactionQueue](#taggedtransactionqueue)**
- **[TransactionPaymentApi](#transactionpaymentapi)**
- **[TransactionPaymentCallApi](#transactionpaymentcallapi)**

## `AccountNonceApi`

### `accountNonce(account: AccountId32)`: `u32`

- **interface**: `api.call.accountNonceApi.accountNonce`
- **summary**: Get current account nonce of given `AccountId`.


## `AuraApi`

### `authorities()`: `Vec<Public>`

- **interface**: `api.call.auraApi.authorities`
- **summary**: Return the current set of authorities.

### `slotDuration()`: `SlotDuration`

- **interface**: `api.call.auraApi.slotDuration`
- **summary**: Returns the slot duration for Aura.

    Currently, only the value provided by this type at genesis will be used.


## `BabeApi`

### `configuration()`: `BabeConfiguration`

- **interface**: `api.call.babeApi.configuration`
- **summary**: Return the configuration for BABE.

### `currentEpoch()`: `Epoch`

- **interface**: `api.call.babeApi.currentEpoch`
- **summary**: Returns information regarding the current epoch.

### `currentEpochStart()`: `Slot`

- **interface**: `api.call.babeApi.currentEpochStart`
- **summary**: Returns the slot that started the current epoch.

### `generateKeyOwnershipProof(slot: Slot, authority_id: Public)`: `Option<OpaqueKeyOwnershipProof>`

- **interface**: `api.call.babeApi.generateKeyOwnershipProof`
- **summary**: Generates a proof of key ownership for the given authority in the current epoch. An example usage of this module is coupled with the session historical module to prove that a given authority key is tied to a given staking identity during a specific session. Proofs of key ownership are necessary for submitting equivocation reports. NOTE: even though the API takes a `slot` as parameter the current implementations ignores this parameter and instead relies on this method being called at the correct block height, i.e. any point at which the epoch for the given slot is live on-chain. Future implementations will instead use indexed data through an offchain worker, not requiring older states to be available.

### `nextEpoch()`: `Epoch`

- **interface**: `api.call.babeApi.nextEpoch`
- **summary**: Returns information regarding the next epoch (which was already previously announced).

### `submitReportEquivocationUnsignedExtrinsic(equivocation_proof: EquivocationProof, key_owner_proof: OpaqueKeyOwnershipProof)`: `Option<Null>`

- **interface**: `api.call.babeApi.submitReportEquivocationUnsignedExtrinsic`
- **summary**: Submits an unsigned extrinsic to report an equivocation. The caller must provide the equivocation proof and a key ownership proof (should be obtained using `generate_key_ownership_proof`). The extrinsic will be unsigned and should only be accepted for local authorship (not to be broadcast to the network). This method returns `None` when creation of the extrinsic fails, e.g. if equivocation reporting is disabled for the given runtime (i.e. this method is hardcoded to return `None`). Only useful in an offchain context.


## `BlockBuilder`

### `applyExtrinsic(extrinsic: UncheckedExtrinsic)`: `Result<Result<Null, DispatchError>, TransactionValidityError>`

- **interface**: `api.call.blockBuilder.applyExtrinsic`
- **summary**: Apply the given extrinsic.

    Returns an inclusion outcome which specifies if this extrinsic is included in this block or not.

### `checkInherents(block: Block, data: InherentData)`: `CheckInherentsResult`

- **interface**: `api.call.blockBuilder.checkInherents`
- **summary**: Check that the inherents are valid. The inherent data will vary from chain to chain.

### `finalizeBlock()`: `Header`

- **interface**: `api.call.blockBuilder.finalizeBlock`
- **summary**: Finish the current block.

### `inherentExtrinsics(inherent: InherentData)`: `Vec<UncheckedExtrinsic>`

- **interface**: `api.call.blockBuilder.inherentExtrinsics`
- **summary**: Generate inherent extrinsics. The inherent data will vary from chain to chain.


## `ContractsApi`

### `call(origin: AccountId32, dest: AccountId32, value: u64, gas_limit: Option<Weight>, storage_deposit_limit: Option<u64>, input_data: Vec<u8>)`: `ContractResult`

- **interface**: `api.call.contractsApi.call`
- **summary**: Perform a call from a specified account to a given contract.

    See [`crate::Pallet::bare_call`].

### `getStorage(address: AccountId32, key: Vec<u8>)`: `Result<Option<Vec<u8>>, ContractAccessError>`

- **interface**: `api.call.contractsApi.getStorage`
- **summary**: Query a given storage key in a given contract.

    Returns `Ok(Some(Vec<u8>))` if the storage value exists under the given key in the specified account and `Ok(None)` if it doesn't. If the account specified by the address doesn't exist, or doesn't have a contract then `Err` is returned.

### `instantiate(origin: AccountId32, value: u64, gas_limit: Option<Weight>, storage_deposit_limit: Option<u64>, code: Code, data: Vec<u8>, salt: Vec<u8>)`: `ContractResult`

- **interface**: `api.call.contractsApi.instantiate`
- **summary**: Instantiate a new contract.

    See `[crate::Pallet::bare_instantiate]`.

### `uploadCode(origin: AccountId32, code: Vec<u8>, storage_deposit_limit: Option<u64>, determinism: Determinism)`: `Result<CodeUploadReturnValue, DispatchError>`

- **interface**: `api.call.contractsApi.uploadCode`
- **summary**: Upload new code without instantiating a contract from it.

    See [`crate::Pallet::bare_upload_code`].


## `ConvertTransactionRuntimeApi`

### `convertTransaction(transaction: TransactionV3)`: `UncheckedExtrinsic`

- **interface**: `api.call.convertTransactionRuntimeApi.convertTransaction`


## `Core`

### `executeBlock(block: Block)`: `Null`

- **interface**: `api.call.core.executeBlock`
- **summary**: Execute the given block.

### `initializeBlock(header: Header)`: `ExtrinsicInclusionMode`

- **interface**: `api.call.core.initializeBlock`
- **summary**: Initialize a block with the given header and return the runtime executive mode.

### `version()`: `RuntimeVersion`

- **interface**: `api.call.core.version`
- **summary**: Returns the version of the runtime.


## `DelegateInfoRuntimeApi`

### `getDelegate(delegate_account: AccountId32)`: `Option<DelegateInfo>`

- **interface**: `api.call.delegateInfoRuntimeApi.getDelegate`

### `getDelegated(delegatee_account: AccountId32)`: `Vec<(DelegateInfo, (u16, u64))>`

- **interface**: `api.call.delegateInfoRuntimeApi.getDelegated`

### `getDelegates()`: `Vec<DelegateInfo>`

- **interface**: `api.call.delegateInfoRuntimeApi.getDelegates`


## `EthereumRuntimeRPCApi`

### `accountBasic(address: H160)`: `Basic`

- **interface**: `api.call.ethereumRuntimeRPCApi.accountBasic`
- **summary**: Returns pallet_evm::Accounts by address.

### `accountCodeAt(address: H160)`: `Vec<u8>`

- **interface**: `api.call.ethereumRuntimeRPCApi.accountCodeAt`
- **summary**: For a given account address, returns pallet_evm::AccountCodes.

### `author()`: `H160`

- **interface**: `api.call.ethereumRuntimeRPCApi.author`
- **summary**: Returns the converted FindAuthor::find_author authority id.

### `call(from: H160, to: H160, data: Vec<u8>, value: U256, gas_limit: U256, max_fee_per_gas: Option<U256>, max_priority_fee_per_gas: Option<U256>, nonce: Option<U256>, estimate: bool, access_list: Option<Vec<(H160, Vec<H256>)>>, authorization_list: Option<Vec<AuthorizationListItem>>)`: `Result<ExecutionInfoV2, DispatchError>`

- **interface**: `api.call.ethereumRuntimeRPCApi.call`

### `chainId()`: `u64`

- **interface**: `api.call.ethereumRuntimeRPCApi.chainId`
- **summary**: Returns runtime defined pallet_evm::ChainId.

### `create(from: H160, data: Vec<u8>, value: U256, gas_limit: U256, max_fee_per_gas: Option<U256>, max_priority_fee_per_gas: Option<U256>, nonce: Option<U256>, estimate: bool, access_list: Option<Vec<(H160, Vec<H256>)>>, authorization_list: Option<Vec<AuthorizationListItem>>)`: `Result<ExecutionInfoV2, DispatchError>`

- **interface**: `api.call.ethereumRuntimeRPCApi.create`

### `currentAll()`: `(Option<Block>, Option<Vec<ReceiptV4>>, Option<Vec<TransactionStatus>>)`

- **interface**: `api.call.ethereumRuntimeRPCApi.currentAll`

### `currentBlock()`: `Option<Block>`

- **interface**: `api.call.ethereumRuntimeRPCApi.currentBlock`
- **summary**: Return the current block.

### `currentReceipts()`: `Option<Vec<ReceiptV4>>`

- **interface**: `api.call.ethereumRuntimeRPCApi.currentReceipts`
- **summary**: Return the current receipt.

### `currentTransactionStatuses()`: `Option<Vec<TransactionStatus>>`

- **interface**: `api.call.ethereumRuntimeRPCApi.currentTransactionStatuses`
- **summary**: Return the current transaction status.

### `elasticity()`: `Option<Permill>`

- **interface**: `api.call.ethereumRuntimeRPCApi.elasticity`
- **summary**: Return the elasticity multiplier.

### `extrinsicFilter(xts: Vec<UncheckedExtrinsic>)`: `Vec<TransactionV3>`

- **interface**: `api.call.ethereumRuntimeRPCApi.extrinsicFilter`
- **summary**: Receives a `Vec<OpaqueExtrinsic>` and filters all the ethereum transactions.

### `gasLimitMultiplierSupport()`: `Null`

- **interface**: `api.call.ethereumRuntimeRPCApi.gasLimitMultiplierSupport`
- **summary**: Used to determine if gas limit multiplier for non-transactional calls (eth_call/estimateGas) is supported.

### `gasPrice()`: `U256`

- **interface**: `api.call.ethereumRuntimeRPCApi.gasPrice`
- **summary**: Returns FixedGasPrice::min_gas_price

### `initializePendingBlock(header: Header)`: `Null`

- **interface**: `api.call.ethereumRuntimeRPCApi.initializePendingBlock`
- **summary**: Initialize the pending block. The behavior should be the same as the runtime api Core_initialize_block but for a "pending" block. If your project don't need to have a different behavior to initialize "pending" blocks, you can copy your Core_initialize_block implementation.

### `pendingBlock(xts: Vec<UncheckedExtrinsic>)`: `(Option<Block>, Option<Vec<TransactionStatus>>)`

- **interface**: `api.call.ethereumRuntimeRPCApi.pendingBlock`
- **summary**: Return the pending block.

### `storageAt(address: H160, index: U256)`: `H256`

- **interface**: `api.call.ethereumRuntimeRPCApi.storageAt`
- **summary**: For a given account address and index, returns pallet_evm::AccountStorages.


## `GenesisBuilder`

### `buildState(json: Vec<u8>)`: `Result<Null, Text>`

- **interface**: `api.call.genesisBuilder.buildState`
- **summary**: Build `RuntimeGenesisConfig` from a JSON blob not using any defaults and store it in the storage.

    In the case of a FRAME-based runtime, this function deserializes the full `RuntimeGenesisConfig` from the given JSON blob and puts it into the storage. If the provided JSON blob is incorrect or incomplete or the deserialization fails, an error is returned.

    Please note that provided JSON blob must contain all `RuntimeGenesisConfig` fields, no defaults will be used.

### `getPreset(id: Option<Text>)`: `Option<Vec<u8>>`

- **interface**: `api.call.genesisBuilder.getPreset`
- **summary**: Returns a JSON blob representation of the built-in `RuntimeGenesisConfig` identified by `id`.

    If `id` is `None` the function should return JSON blob representation of the default `RuntimeGenesisConfig` struct of the runtime. Implementation must provide default `RuntimeGenesisConfig`.

    Otherwise function returns a JSON representation of the built-in, named `RuntimeGenesisConfig` preset identified by `id`, or `None` if such preset does not exist. Returned `Vec<u8>` contains bytes of JSON blob (patch) which comprises a list of (potentially nested) key-value pairs that are intended for customizing the default runtime genesis config. The patch shall be merged (rfc7386) with the JSON representation of the default `RuntimeGenesisConfig` to create a comprehensive genesis config that can be used in `build_state` method.

### `presetNames()`: `Vec<Text>`

- **interface**: `api.call.genesisBuilder.presetNames`
- **summary**: Returns a list of identifiers for available builtin `RuntimeGenesisConfig` presets.

    The presets from the list can be queried with [`GenesisBuilder::get_preset`] method. If no named presets are provided by the runtime the list is empty.


## `GrandpaApi`

### `currentSetId()`: `u64`

- **interface**: `api.call.grandpaApi.currentSetId`
- **summary**: Get current GRANDPA authority set id.

### `generateKeyOwnershipProof(set_id: u64, authority_id: Public)`: `Option<OpaqueValue>`

- **interface**: `api.call.grandpaApi.generateKeyOwnershipProof`
- **summary**: Generates a proof of key ownership for the given authority in the given set. An example usage of this module is coupled with the session historical module to prove that a given authority key is tied to a given staking identity during a specific session. Proofs of key ownership are necessary for submitting equivocation reports. NOTE: even though the API takes a `set_id` as parameter the current implementations ignore this parameter and instead rely on this method being called at the correct block height, i.e. any point at which the given set id is live on-chain. Future implementations will instead use indexed data through an offchain worker, not requiring older states to be available.

### `grandpaAuthorities()`: `Vec<(Public, u64)>`

- **interface**: `api.call.grandpaApi.grandpaAuthorities`
- **summary**: Get the current GRANDPA authorities and weights. This should not change except for when changes are scheduled and the corresponding delay has passed.

    When called at block B, it will return the set of authorities that should be used to finalize descendants of this block (B+1, B+2, ...). The block B itself is finalized by the authorities from block B-1.

### `submitReportEquivocationUnsignedExtrinsic(equivocation_proof: EquivocationProof, key_owner_proof: OpaqueValue)`: `Option<Null>`

- **interface**: `api.call.grandpaApi.submitReportEquivocationUnsignedExtrinsic`
- **summary**: Submits an unsigned extrinsic to report an equivocation. The caller must provide the equivocation proof and a key ownership proof (should be obtained using `generate_key_ownership_proof`). The extrinsic will be unsigned and should only be accepted for local authorship (not to be broadcast to the network). This method returns `None` when creation of the extrinsic fails, e.g. if equivocation reporting is disabled for the given runtime (i.e. this method is hardcoded to return `None`). Only useful in an offchain context.


## `Metadata`

### `metadata()`: `OpaqueMetadata`

- **interface**: `api.call.metadata.metadata`
- **summary**: Returns the metadata of a runtime.

### `metadataAtVersion(version: u32)`: `Option<OpaqueMetadata>`

- **interface**: `api.call.metadata.metadataAtVersion`
- **summary**: Returns the metadata at a given version.

    If the given `version` isn't supported, this will return `None`. Use [`Self::metadata_versions`] to find out about supported metadata version of the runtime.

### `metadataVersions()`: `Vec<u32>`

- **interface**: `api.call.metadata.metadataVersions`
- **summary**: Returns the supported metadata versions.

    This can be used to call `metadata_at_version`.


## `NeuronInfoRuntimeApi`

### `getNeuron(netuid: u16, uid: u16)`: `Option<NeuronInfo>`

- **interface**: `api.call.neuronInfoRuntimeApi.getNeuron`

### `getNeuronLite(netuid: u16, uid: u16)`: `Option<NeuronInfoLite>`

- **interface**: `api.call.neuronInfoRuntimeApi.getNeuronLite`

### `getNeurons(netuid: u16)`: `Vec<NeuronInfo>`

- **interface**: `api.call.neuronInfoRuntimeApi.getNeurons`

### `getNeuronsLite(netuid: u16)`: `Vec<NeuronInfoLite>`

- **interface**: `api.call.neuronInfoRuntimeApi.getNeuronsLite`


## `OffchainWorkerApi`

### `offchainWorker(header: Header)`: `Null`

- **interface**: `api.call.offchainWorkerApi.offchainWorker`
- **summary**: Starts the off-chain task for given block header.


## `ProxyFilterRuntimeApi`

### `getProxyFilter(proxy_type: Option<u8>)`: `Vec<ProxyFilterInfo>`

- **interface**: `api.call.proxyFilterRuntimeApi.getProxyFilter`

### `getProxyTypes()`: `Vec<ProxyTypeInfo>`

- **interface**: `api.call.proxyFilterRuntimeApi.getProxyTypes`


## `SessionKeys`

### `decodeSessionKeys(encoded: Vec<u8>)`: `Option<Vec<(Vec<u8>, KeyTypeId)>>`

- **interface**: `api.call.sessionKeys.decodeSessionKeys`
- **summary**: Decode the given public session keys.

    Returns the list of public raw public keys + key type.

### `generateSessionKeys(seed: Option<Vec<u8>>)`: `Vec<u8>`

- **interface**: `api.call.sessionKeys.generateSessionKeys`
- **summary**: Generate a set of session keys with optionally using the given seed. The keys should be stored within the keystore exposed via runtime externalities.

    The seed needs to be a valid `utf8` string.

    Returns the concatenated SCALE encoded public keys.


## `ShieldApi`

### `isShieldedUsingCurrentKey(key_hash: [u8; 16])`: `bool`

- **interface**: `api.call.shieldApi.isShieldedUsingCurrentKey`
- **summary**: Check if a transaction is shielded using the current key.

### `tryDecodeShieldedTx(uxt: UncheckedExtrinsic)`: `Option<ShieldedTransaction>`

- **interface**: `api.call.shieldApi.tryDecodeShieldedTx`
- **summary**: Try to decode a shielded transaction from an extrinsic.

### `tryUnshieldTx(dec_key_bytes: Vec<u8>, shielded_tx: ShieldedTransaction)`: `Option<UncheckedExtrinsic>`

- **interface**: `api.call.shieldApi.tryUnshieldTx`
- **summary**: Try to unshield a transaction using a decapsulation key.


## `StakeInfoRuntimeApi`

### `getColdkeyLock(coldkey: AccountId32, netuid: u16)`: `Option<LockState>`

- **interface**: `api.call.stakeInfoRuntimeApi.getColdkeyLock`

### `getHotkeyConviction(hotkey: AccountId32, netuid: u16)`: `FixedU128`

- **interface**: `api.call.stakeInfoRuntimeApi.getHotkeyConviction`

### `getMostConvictedHotkeyOnSubnet(netuid: u16)`: `Option<AccountId32>`

- **interface**: `api.call.stakeInfoRuntimeApi.getMostConvictedHotkeyOnSubnet`

### `getStakeFee(origin: Option<(AccountId32, u16)>, origin_coldkey_account: AccountId32, destination: Option<(AccountId32, u16)>, destination_coldkey_account: AccountId32, amount: u64)`: `u64`

- **interface**: `api.call.stakeInfoRuntimeApi.getStakeFee`

### `getStakeInfoForColdkey(coldkey_account: AccountId32)`: `Vec<StakeInfo>`

- **interface**: `api.call.stakeInfoRuntimeApi.getStakeInfoForColdkey`

### `getStakeInfoForColdkeys(coldkey_accounts: Vec<AccountId32>)`: `Vec<(AccountId32, Vec<StakeInfo>)>`

- **interface**: `api.call.stakeInfoRuntimeApi.getStakeInfoForColdkeys`

### `getStakeInfoForHotkeyColdkeyNetuid(hotkey_account: AccountId32, coldkey_account: AccountId32, netuid: u16)`: `Option<StakeInfo>`

- **interface**: `api.call.stakeInfoRuntimeApi.getStakeInfoForHotkeyColdkeyNetuid`


## `SubnetInfoRuntimeApi`

### `getAllDynamicInfo()`: `Vec<Option<DynamicInfo>>`

- **interface**: `api.call.subnetInfoRuntimeApi.getAllDynamicInfo`

### `getAllMechagraphs()`: `Vec<Option<Metagraph>>`

- **interface**: `api.call.subnetInfoRuntimeApi.getAllMechagraphs`

### `getAllMetagraphs()`: `Vec<Option<Metagraph>>`

- **interface**: `api.call.subnetInfoRuntimeApi.getAllMetagraphs`

### `getColdkeyAutoStakeHotkey(coldkey: AccountId32, netuid: u16)`: `Option<AccountId32>`

- **interface**: `api.call.subnetInfoRuntimeApi.getColdkeyAutoStakeHotkey`

### `getDynamicInfo(netuid: u16)`: `Option<DynamicInfo>`

- **interface**: `api.call.subnetInfoRuntimeApi.getDynamicInfo`

### `getMechagraph(netuid: u16, mecid: u8)`: `Option<Metagraph>`

- **interface**: `api.call.subnetInfoRuntimeApi.getMechagraph`

### `getMetagraph(netuid: u16)`: `Option<Metagraph>`

- **interface**: `api.call.subnetInfoRuntimeApi.getMetagraph`

### `getSelectiveMechagraph(netuid: u16, subid: u8, metagraph_indexes: Vec<u16>)`: `Option<SelectiveMetagraph>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSelectiveMechagraph`

### `getSelectiveMetagraph(netuid: u16, metagraph_indexes: Vec<u16>)`: `Option<SelectiveMetagraph>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSelectiveMetagraph`

### `getSubnetAccountId(netuid: u16)`: `Option<AccountId32>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSubnetAccountId`

### `getSubnetHyperparams(netuid: u16)`: `Option<SubnetHyperparams>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSubnetHyperparams`

### `getSubnetHyperparamsV2(netuid: u16)`: `Option<SubnetHyperparamsV2>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSubnetHyperparamsV2`

### `getSubnetHyperparamsV3(netuid: u16)`: `Option<Vec<HyperparamEntry>>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSubnetHyperparamsV3`

### `getSubnetInfo(netuid: u16)`: `Option<SubnetInfo>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSubnetInfo`

### `getSubnetInfoV2(netuid: u16)`: `Option<SubnetInfov2>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSubnetInfoV2`

### `getSubnetsInfo()`: `Vec<Option<SubnetInfo>>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSubnetsInfo`

### `getSubnetsInfoV2()`: `Vec<Option<SubnetInfov2>>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSubnetsInfoV2`

### `getSubnetState(netuid: u16)`: `Option<SubnetState>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSubnetState`

### `getSubnetToPrune()`: `Option<u16>`

- **interface**: `api.call.subnetInfoRuntimeApi.getSubnetToPrune`


## `SubnetRegistrationRuntimeApi`

### `getNetworkRegistrationCost()`: `u64`

- **interface**: `api.call.subnetRegistrationRuntimeApi.getNetworkRegistrationCost`


## `SwapRuntimeApi`

### `currentAlphaPrice(netuid: u16)`: `u64`

- **interface**: `api.call.swapRuntimeApi.currentAlphaPrice`

### `currentAlphaPriceAll()`: `Vec<SubnetPrice>`

- **interface**: `api.call.swapRuntimeApi.currentAlphaPriceAll`

### `simSwapAlphaForTao(netuid: u16, alpha: u64)`: `SimSwapResult`

- **interface**: `api.call.swapRuntimeApi.simSwapAlphaForTao`

### `simSwapTaoForAlpha(netuid: u16, tao: u64)`: `SimSwapResult`

- **interface**: `api.call.swapRuntimeApi.simSwapTaoForAlpha`


## `TaggedTransactionQueue`

### `validateTransaction(source: TransactionSource, tx: UncheckedExtrinsic, block_hash: H256)`: `Result<ValidTransaction, TransactionValidityError>`

- **interface**: `api.call.taggedTransactionQueue.validateTransaction`
- **summary**: Validate the transaction.

    This method is invoked by the transaction pool to learn details about given transaction. The implementation should make sure to verify the correctness of the transaction against current state. The given `block_hash` corresponds to the hash of the block that is used as current state.

    Note that this call may be performed by the pool multiple times and transactions might be verified in any possible order.


## `TransactionPaymentApi`

### `queryFeeDetails(uxt: UncheckedExtrinsic, len: u32)`: `FeeDetails`

- **interface**: `api.call.transactionPaymentApi.queryFeeDetails`

### `queryInfo(uxt: UncheckedExtrinsic, len: u32)`: `RuntimeDispatchInfo`

- **interface**: `api.call.transactionPaymentApi.queryInfo`

### `queryLengthToFee(length: u32)`: `u64`

- **interface**: `api.call.transactionPaymentApi.queryLengthToFee`

### `queryWeightToFee(weight: Weight)`: `u64`

- **interface**: `api.call.transactionPaymentApi.queryWeightToFee`


## `TransactionPaymentCallApi`

### `queryCallFeeDetails(call: RuntimeCall, len: u32)`: `FeeDetails`

- **interface**: `api.call.transactionPaymentCallApi.queryCallFeeDetails`
- **summary**: Query fee details of a given encoded `Call`.

### `queryCallInfo(call: RuntimeCall, len: u32)`: `RuntimeDispatchInfo`

- **interface**: `api.call.transactionPaymentCallApi.queryCallInfo`
- **summary**: Query information of a dispatch class, weight, and fee of a given encoded `Call`.

### `queryLengthToFee(length: u32)`: `u64`

- **interface**: `api.call.transactionPaymentCallApi.queryLengthToFee`
- **summary**: Query the output of the current `LengthToFee` given some input.

### `queryWeightToFee(weight: Weight)`: `u64`

- **interface**: `api.call.transactionPaymentCallApi.queryWeightToFee`
- **summary**: Query the output of the current `WeightToFee` given some input.
