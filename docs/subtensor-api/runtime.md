---
title: Runtime Calls
description: "This page includes runtime API calls exposed by the Subtensor runtime."
---

# Runtime Calls

This page includes runtime API calls exposed by the Subtensor runtime. Accessible via `api.call.<RuntimeApi>.<method_name>`.

:::info
Generated from Subtensor runtime spec version **411**. Connected to: `wss://entrypoint-finney.opentensor.ai:443`
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

### `account_nonce(account: AccountId32)`: `u32`

- **interface**: `api.call.AccountNonceApi.account_nonce`
- **summary**: Get current account nonce of given `AccountId`.


## `AuraApi`

### `authorities()`: `Vec<SpConsensusAuraSr25519AppSr25519Public>`

- **interface**: `api.call.AuraApi.authorities`
- **summary**: Return the current set of authorities.

### `slot_duration()`: `u64`

- **interface**: `api.call.AuraApi.slot_duration`
- **summary**: Returns the slot duration for Aura.

    Currently, only the value provided by this type at genesis will be used.


## `BabeApi`

### `configuration()`: `{"slotDuration":"u64","epochLength":"u64","c":"(u64,u64)","authorities":"Vec<(SpConsensusBabeAppPublic,u64)>","randomness":"[u8;32]","allowedSlots":"SpConsensusBabeAllowedSlots"}`

- **interface**: `api.call.BabeApi.configuration`
- **summary**: Return the configuration for BABE.

### `current_epoch()`: `{"epochIndex":"u64","startSlot":"u64","duration":"u64","authorities":"Vec<(SpConsensusBabeAppPublic,u64)>","randomness":"[u8;32]","config":"SpConsensusBabeBabeEpochConfiguration"}`

- **interface**: `api.call.BabeApi.current_epoch`
- **summary**: Returns information regarding the current epoch.

### `current_epoch_start()`: `u64`

- **interface**: `api.call.BabeApi.current_epoch_start`
- **summary**: Returns the slot that started the current epoch.

### `generate_key_ownership_proof(slot: u64, authority_id: [u8;32])`: `Option<Bytes>`

- **interface**: `api.call.BabeApi.generate_key_ownership_proof`
- **summary**: Generates a proof of key ownership for the given authority in the current epoch. An example usage of this module is coupled with the session historical module to prove that a given authority key is tied to a given staking identity during a specific session. Proofs of key ownership are necessary for submitting equivocation reports. NOTE: even though the API takes a `slot` as parameter the current implementations ignores this parameter and instead relies on this method being called at the correct block height, i.e. any point at which the epoch for the given slot is live on-chain. Future implementations will instead use indexed data through an offchain worker, not requiring older states to be available.

### `next_epoch()`: `{"epochIndex":"u64","startSlot":"u64","duration":"u64","authorities":"Vec<(SpConsensusBabeAppPublic,u64)>","randomness":"[u8;32]","config":"SpConsensusBabeBabeEpochConfiguration"}`

- **interface**: `api.call.BabeApi.next_epoch`
- **summary**: Returns information regarding the next epoch (which was already previously announced).

### `submit_report_equivocation_unsigned_extrinsic(equivocation_proof: {"offender":"SpConsensusBabeAppPublic","slot":"u64","firstHeader":"SpRuntimeHeader","secondHeader":"SpRuntimeHeader"}, key_owner_proof: Bytes)`: `Option<Null>`

- **interface**: `api.call.BabeApi.submit_report_equivocation_unsigned_extrinsic`
- **summary**: Submits an unsigned extrinsic to report an equivocation. The caller must provide the equivocation proof and a key ownership proof (should be obtained using `generate_key_ownership_proof`). The extrinsic will be unsigned and should only be accepted for local authorship (not to be broadcast to the network). This method returns `None` when creation of the extrinsic fails, e.g. if equivocation reporting is disabled for the given runtime (i.e. this method is hardcoded to return `None`). Only useful in an offchain context.


## `BlockBuilder`

### `apply_extrinsic(extrinsic: Bytes)`: `Result<Result<Null, SpRuntimeDispatchError>, SpRuntimeTransactionValidityTransactionValidityError>`

- **interface**: `api.call.BlockBuilder.apply_extrinsic`
- **summary**: Apply the given extrinsic.

    Returns an inclusion outcome which specifies if this extrinsic is included in this block or not.

### `check_inherents(block: {"header":"SpRuntimeHeader","extrinsics":"Vec<Bytes>"}, data: {"data":"BTreeMap<[u8;8], Bytes>"})`: `{"okay":"bool","fatalError":"bool","errors":"SpInherentsInherentData"}`

- **interface**: `api.call.BlockBuilder.check_inherents`
- **summary**: Check that the inherents are valid. The inherent data will vary from chain to chain.

### `finalize_block()`: `{"parentHash":"H256","number":"Compact<u32>","stateRoot":"H256","extrinsicsRoot":"H256","digest":"SpRuntimeDigest"}`

- **interface**: `api.call.BlockBuilder.finalize_block`
- **summary**: Finish the current block.

### `inherent_extrinsics(inherent: {"data":"BTreeMap<[u8;8], Bytes>"})`: `Vec<Bytes>`

- **interface**: `api.call.BlockBuilder.inherent_extrinsics`
- **summary**: Generate inherent extrinsics. The inherent data will vary from chain to chain.


## `ContractsApi`

### `call(origin: AccountId32, dest: AccountId32, value: u64, gas_limit: Option<SpWeightsWeightV2Weight>, storage_deposit_limit: Option<u64>, input_data: Bytes)`: `{"gasConsumed":"SpWeightsWeightV2Weight","gasRequired":"SpWeightsWeightV2Weight","storageDeposit":"PalletContractsPrimitivesStorageDeposit","debugMessage":"Bytes","result":"Result<PalletContractsPrimitivesExecReturnValue, SpRuntimeDispatchError>","events":"Option<Vec<FrameSystemEventRecord>>"}`

- **interface**: `api.call.ContractsApi.call`
- **summary**: Perform a call from a specified account to a given contract.

    See [`crate::Pallet::bare_call`].

### `get_storage(address: AccountId32, key: Bytes)`: `Result<Option<Bytes>, PalletContractsPrimitivesContractAccessError>`

- **interface**: `api.call.ContractsApi.get_storage`
- **summary**: Query a given storage key in a given contract.

    Returns `Ok(Some(Vec<u8>))` if the storage value exists under the given key in the specified account and `Ok(None)` if it doesn't. If the account specified by the address doesn't exist, or doesn't have a contract then `Err` is returned.

### `instantiate(origin: AccountId32, value: u64, gas_limit: Option<SpWeightsWeightV2Weight>, storage_deposit_limit: Option<u64>, code: {"_enum":{"Upload":"Bytes","Existing":"H256"}}, data: Bytes, salt: Bytes)`: `{"gasConsumed":"SpWeightsWeightV2Weight","gasRequired":"SpWeightsWeightV2Weight","storageDeposit":"PalletContractsPrimitivesStorageDeposit","debugMessage":"Bytes","result":"Result<PalletContractsPrimitivesInstantiateReturnValue, SpRuntimeDispatchError>","events":"Option<Vec<FrameSystemEventRecord>>"}`

- **interface**: `api.call.ContractsApi.instantiate`
- **summary**: Instantiate a new contract.

    See `[crate::Pallet::bare_instantiate]`.

### `upload_code(origin: AccountId32, code: Bytes, storage_deposit_limit: Option<u64>, determinism: {"_enum":["Enforced","Relaxed"]})`: `Result<PalletContractsPrimitivesCodeUploadReturnValue, SpRuntimeDispatchError>`

- **interface**: `api.call.ContractsApi.upload_code`
- **summary**: Upload new code without instantiating a contract from it.

    See [`crate::Pallet::bare_upload_code`].


## `ConvertTransactionRuntimeApi`

### `convert_transaction(transaction: {"_enum":{"Legacy":"EthereumTransactionLegacyLegacyTransaction","EIP2930":"EthereumTransactionEip2930Eip2930Transaction","EIP1559":"EthereumTransactionEip1559Eip1559Transaction","EIP7702":"EthereumTransactionEip7702Eip7702Transaction"}})`: `Bytes`

- **interface**: `api.call.ConvertTransactionRuntimeApi.convert_transaction`


## `Core`

### `execute_block(block: {"header":"SpRuntimeHeader","extrinsics":"Vec<Bytes>"})`: `Null`

- **interface**: `api.call.Core.execute_block`
- **summary**: Execute the given block.

### `initialize_block(header: {"parentHash":"H256","number":"Compact<u32>","stateRoot":"H256","extrinsicsRoot":"H256","digest":"SpRuntimeDigest"})`: `{"_enum":["AllExtrinsics","OnlyInherents"]}`

- **interface**: `api.call.Core.initialize_block`
- **summary**: Initialize a block with the given header and return the runtime executive mode.

### `version()`: `{"specName":"Text","implName":"Text","authoringVersion":"u32","specVersion":"u32","implVersion":"u32","apis":"Vec<([u8;8],u32)>","transactionVersion":"u32","systemVersion":"u8"}`

- **interface**: `api.call.Core.version`
- **summary**: Returns the version of the runtime.


## `DelegateInfoRuntimeApi`

### `get_delegate(delegate_account: AccountId32)`: `Option<PalletSubtensorRpcInfoDelegateInfo>`

- **interface**: `api.call.DelegateInfoRuntimeApi.get_delegate`

### `get_delegated(delegatee_account: AccountId32)`: `Vec<(PalletSubtensorRpcInfoDelegateInfo,(Compact<u16>,Compact<u64>))>`

- **interface**: `api.call.DelegateInfoRuntimeApi.get_delegated`

### `get_delegates()`: `Vec<PalletSubtensorRpcInfoDelegateInfo>`

- **interface**: `api.call.DelegateInfoRuntimeApi.get_delegates`


## `EthereumRuntimeRPCApi`

### `account_basic(address: H160)`: `{"balance":"U256","nonce":"U256"}`

- **interface**: `api.call.EthereumRuntimeRPCApi.account_basic`
- **summary**: Returns pallet_evm::Accounts by address.

### `account_code_at(address: H160)`: `Bytes`

- **interface**: `api.call.EthereumRuntimeRPCApi.account_code_at`
- **summary**: For a given account address, returns pallet_evm::AccountCodes.

### `author()`: `H160`

- **interface**: `api.call.EthereumRuntimeRPCApi.author`
- **summary**: Returns the converted FindAuthor::find_author authority id.

### `call(from: H160, to: H160, data: Bytes, value: U256, gas_limit: U256, max_fee_per_gas: Option<U256>, max_priority_fee_per_gas: Option<U256>, nonce: Option<U256>, estimate: bool, access_list: Option<Vec<(H160,Vec<H256>)>>, authorization_list: Option<Vec<EthereumTransactionEip7702AuthorizationListItem>>)`: `Result<{"exitReason":"EvmCoreErrorExitReason","value":"Bytes","usedGas":"FpEvmUsedGas","weightInfo":"Option<FpEvmWeightInfo>","logs":"Vec<EthereumLog>"}, SpRuntimeDispatchError>`

- **interface**: `api.call.EthereumRuntimeRPCApi.call`

### `chain_id()`: `u64`

- **interface**: `api.call.EthereumRuntimeRPCApi.chain_id`
- **summary**: Returns runtime defined pallet_evm::ChainId.

### `create(from: H160, data: Bytes, value: U256, gas_limit: U256, max_fee_per_gas: Option<U256>, max_priority_fee_per_gas: Option<U256>, nonce: Option<U256>, estimate: bool, access_list: Option<Vec<(H160,Vec<H256>)>>, authorization_list: Option<Vec<EthereumTransactionEip7702AuthorizationListItem>>)`: `Result<FpEvmExecutionInfoV2, SpRuntimeDispatchError>`

- **interface**: `api.call.EthereumRuntimeRPCApi.create`

### `current_all()`: `(Option<EthereumBlock>,Option<Vec<EthereumReceiptReceiptV4>>,Option<Vec<FpRpcTransactionStatus>>)`

- **interface**: `api.call.EthereumRuntimeRPCApi.current_all`

### `current_block()`: `Option<EthereumBlock>`

- **interface**: `api.call.EthereumRuntimeRPCApi.current_block`
- **summary**: Return the current block.

### `current_receipts()`: `Option<Vec<EthereumReceiptReceiptV4>>`

- **interface**: `api.call.EthereumRuntimeRPCApi.current_receipts`
- **summary**: Return the current receipt.

### `current_transaction_statuses()`: `Option<Vec<FpRpcTransactionStatus>>`

- **interface**: `api.call.EthereumRuntimeRPCApi.current_transaction_statuses`
- **summary**: Return the current transaction status.

### `elasticity()`: `Option<Permill>`

- **interface**: `api.call.EthereumRuntimeRPCApi.elasticity`
- **summary**: Return the elasticity multiplier.

### `extrinsic_filter(xts: Vec<Bytes>)`: `Vec<EthereumTransactionTransactionV3>`

- **interface**: `api.call.EthereumRuntimeRPCApi.extrinsic_filter`
- **summary**: Receives a `Vec<OpaqueExtrinsic>` and filters all the ethereum transactions.

### `gas_limit_multiplier_support()`: `Null`

- **interface**: `api.call.EthereumRuntimeRPCApi.gas_limit_multiplier_support`
- **summary**: Used to determine if gas limit multiplier for non-transactional calls (eth_call/estimateGas) is supported.

### `gas_price()`: `U256`

- **interface**: `api.call.EthereumRuntimeRPCApi.gas_price`
- **summary**: Returns FixedGasPrice::min_gas_price

### `initialize_pending_block(header: {"parentHash":"H256","number":"Compact<u32>","stateRoot":"H256","extrinsicsRoot":"H256","digest":"SpRuntimeDigest"})`: `Null`

- **interface**: `api.call.EthereumRuntimeRPCApi.initialize_pending_block`
- **summary**: Initialize the pending block. The behavior should be the same as the runtime api Core_initialize_block but for a "pending" block. If your project don't need to have a different behavior to initialize "pending" blocks, you can copy your Core_initialize_block implementation.

### `pending_block(xts: Vec<Bytes>)`: `(Option<EthereumBlock>,Option<Vec<FpRpcTransactionStatus>>)`

- **interface**: `api.call.EthereumRuntimeRPCApi.pending_block`
- **summary**: Return the pending block.

### `storage_at(address: H160, index: U256)`: `H256`

- **interface**: `api.call.EthereumRuntimeRPCApi.storage_at`
- **summary**: For a given account address and index, returns pallet_evm::AccountStorages.


## `GenesisBuilder`

### `build_state(json: Bytes)`: `Result<Null, Text>`

- **interface**: `api.call.GenesisBuilder.build_state`
- **summary**: Build `RuntimeGenesisConfig` from a JSON blob not using any defaults and store it in the storage.

    In the case of a FRAME-based runtime, this function deserializes the full `RuntimeGenesisConfig` from the given JSON blob and puts it into the storage. If the provided JSON blob is incorrect or incomplete or the deserialization fails, an error is returned.

    Please note that provided JSON blob must contain all `RuntimeGenesisConfig` fields, no defaults will be used.

### `get_preset(id: Option<Text>)`: `Option<Bytes>`

- **interface**: `api.call.GenesisBuilder.get_preset`
- **summary**: Returns a JSON blob representation of the built-in `RuntimeGenesisConfig` identified by `id`.

    If `id` is `None` the function should return JSON blob representation of the default `RuntimeGenesisConfig` struct of the runtime. Implementation must provide default `RuntimeGenesisConfig`.

    Otherwise function returns a JSON representation of the built-in, named `RuntimeGenesisConfig` preset identified by `id`, or `None` if such preset does not exist. Returned `Vec<u8>` contains bytes of JSON blob (patch) which comprises a list of (potentially nested) key-value pairs that are intended for customizing the default runtime genesis config. The patch shall be merged (rfc7386) with the JSON representation of the default `RuntimeGenesisConfig` to create a comprehensive genesis config that can be used in `build_state` method.

### `preset_names()`: `Vec<Text>`

- **interface**: `api.call.GenesisBuilder.preset_names`
- **summary**: Returns a list of identifiers for available builtin `RuntimeGenesisConfig` presets.

    The presets from the list can be queried with [`GenesisBuilder::get_preset`] method. If no named presets are provided by the runtime the list is empty.


## `GrandpaApi`

### `current_set_id()`: `u64`

- **interface**: `api.call.GrandpaApi.current_set_id`
- **summary**: Get current GRANDPA authority set id.

### `generate_key_ownership_proof(set_id: u64, authority_id: [u8;32])`: `Option<Bytes>`

- **interface**: `api.call.GrandpaApi.generate_key_ownership_proof`
- **summary**: Generates a proof of key ownership for the given authority in the given set. An example usage of this module is coupled with the session historical module to prove that a given authority key is tied to a given staking identity during a specific session. Proofs of key ownership are necessary for submitting equivocation reports. NOTE: even though the API takes a `set_id` as parameter the current implementations ignore this parameter and instead rely on this method being called at the correct block height, i.e. any point at which the given set id is live on-chain. Future implementations will instead use indexed data through an offchain worker, not requiring older states to be available.

### `grandpa_authorities()`: `Vec<(SpConsensusGrandpaAppPublic,u64)>`

- **interface**: `api.call.GrandpaApi.grandpa_authorities`
- **summary**: Get the current GRANDPA authorities and weights. This should not change except for when changes are scheduled and the corresponding delay has passed.

    When called at block B, it will return the set of authorities that should be used to finalize descendants of this block (B+1, B+2, ...). The block B itself is finalized by the authorities from block B-1.

### `submit_report_equivocation_unsigned_extrinsic(equivocation_proof: {"setId":"u64","equivocation":"SpConsensusGrandpaEquivocation"}, key_owner_proof: Bytes)`: `Option<Null>`

- **interface**: `api.call.GrandpaApi.submit_report_equivocation_unsigned_extrinsic`
- **summary**: Submits an unsigned extrinsic to report an equivocation. The caller must provide the equivocation proof and a key ownership proof (should be obtained using `generate_key_ownership_proof`). The extrinsic will be unsigned and should only be accepted for local authorship (not to be broadcast to the network). This method returns `None` when creation of the extrinsic fails, e.g. if equivocation reporting is disabled for the given runtime (i.e. this method is hardcoded to return `None`). Only useful in an offchain context.


## `Metadata`

### `metadata()`: `OpaqueMetadata`

- **interface**: `api.call.Metadata.metadata`
- **summary**: Returns the metadata of a runtime.

### `metadata_at_version(version: u32)`: `Option<OpaqueMetadata>`

- **interface**: `api.call.Metadata.metadata_at_version`
- **summary**: Returns the metadata at a given version.

    If the given `version` isn't supported, this will return `None`. Use [`Self::metadata_versions`] to find out about supported metadata version of the runtime.

### `metadata_versions()`: `Vec<u32>`

- **interface**: `api.call.Metadata.metadata_versions`
- **summary**: Returns the supported metadata versions.

    This can be used to call `metadata_at_version`.


## `NeuronInfoRuntimeApi`

### `get_neuron(netuid: u16, uid: u16)`: `Option<PalletSubtensorRpcInfoNeuronInfo>`

- **interface**: `api.call.NeuronInfoRuntimeApi.get_neuron`

### `get_neuron_lite(netuid: u16, uid: u16)`: `Option<PalletSubtensorRpcInfoNeuronInfoNeuronInfoLite>`

- **interface**: `api.call.NeuronInfoRuntimeApi.get_neuron_lite`

### `get_neurons(netuid: u16)`: `Vec<PalletSubtensorRpcInfoNeuronInfo>`

- **interface**: `api.call.NeuronInfoRuntimeApi.get_neurons`

### `get_neurons_lite(netuid: u16)`: `Vec<PalletSubtensorRpcInfoNeuronInfoNeuronInfoLite>`

- **interface**: `api.call.NeuronInfoRuntimeApi.get_neurons_lite`


## `OffchainWorkerApi`

### `offchain_worker(header: {"parentHash":"H256","number":"Compact<u32>","stateRoot":"H256","extrinsicsRoot":"H256","digest":"SpRuntimeDigest"})`: `Null`

- **interface**: `api.call.OffchainWorkerApi.offchain_worker`
- **summary**: Starts the off-chain task for given block header.


## `SessionKeys`

### `decode_session_keys(encoded: Bytes)`: `Option<Vec<(Bytes,SpCoreCryptoKeyTypeId)>>`

- **interface**: `api.call.SessionKeys.decode_session_keys`
- **summary**: Decode the given public session keys.

    Returns the list of public raw public keys + key type.

### `generate_session_keys(seed: Option<Bytes>)`: `Bytes`

- **interface**: `api.call.SessionKeys.generate_session_keys`
- **summary**: Generate a set of session keys with optionally using the given seed. The keys should be stored within the keystore exposed via runtime externalities.

    The seed needs to be a valid `utf8` string.

    Returns the concatenated SCALE encoded public keys.


## `ShieldApi`

### `is_shielded_using_current_key(key_hash: [u8;16])`: `bool`

- **interface**: `api.call.ShieldApi.is_shielded_using_current_key`
- **summary**: Check if a transaction is shielded using the current key.

### `try_decode_shielded_tx(uxt: Bytes)`: `Option<StpShieldShieldedTxShieldedTransaction>`

- **interface**: `api.call.ShieldApi.try_decode_shielded_tx`
- **summary**: Try to decode a shielded transaction from an extrinsic.

### `try_unshield_tx(dec_key_bytes: Bytes, shielded_tx: {"keyHash":"[u8;16]","kemCt":"Bytes","aeadCt":"Bytes","nonce":"[u8;24]"})`: `Option<Bytes>`

- **interface**: `api.call.ShieldApi.try_unshield_tx`
- **summary**: Try to unshield a transaction using a decapsulation key.


## `StakeInfoRuntimeApi`

### `get_coldkey_lock(coldkey: AccountId32, netuid: u16)`: `Option<PalletSubtensorStakingLockLockState>`

- **interface**: `api.call.StakeInfoRuntimeApi.get_coldkey_lock`

### `get_hotkey_conviction(hotkey: AccountId32, netuid: u16)`: `{"bits":"u128"}`

- **interface**: `api.call.StakeInfoRuntimeApi.get_hotkey_conviction`

### `get_most_convicted_hotkey_on_subnet(netuid: u16)`: `Option<AccountId32>`

- **interface**: `api.call.StakeInfoRuntimeApi.get_most_convicted_hotkey_on_subnet`

### `get_stake_fee(origin: Option<(AccountId32,u16)>, origin_coldkey_account: AccountId32, destination: Option<(AccountId32,u16)>, destination_coldkey_account: AccountId32, amount: u64)`: `u64`

- **interface**: `api.call.StakeInfoRuntimeApi.get_stake_fee`

### `get_stake_info_for_coldkey(coldkey_account: AccountId32)`: `Vec<PalletSubtensorRpcInfoStakeInfo>`

- **interface**: `api.call.StakeInfoRuntimeApi.get_stake_info_for_coldkey`

### `get_stake_info_for_coldkeys(coldkey_accounts: Vec<AccountId32>)`: `Vec<(AccountId32,Vec<PalletSubtensorRpcInfoStakeInfo>)>`

- **interface**: `api.call.StakeInfoRuntimeApi.get_stake_info_for_coldkeys`

### `get_stake_info_for_hotkey_coldkey_netuid(hotkey_account: AccountId32, coldkey_account: AccountId32, netuid: u16)`: `Option<PalletSubtensorRpcInfoStakeInfo>`

- **interface**: `api.call.StakeInfoRuntimeApi.get_stake_info_for_hotkey_coldkey_netuid`


## `SubnetInfoRuntimeApi`

### `get_all_dynamic_info()`: `Vec<Option<PalletSubtensorRpcInfoDynamicInfo>>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_all_dynamic_info`

### `get_all_mechagraphs()`: `Vec<Option<PalletSubtensorRpcInfoMetagraph>>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_all_mechagraphs`

### `get_all_metagraphs()`: `Vec<Option<PalletSubtensorRpcInfoMetagraph>>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_all_metagraphs`

### `get_coldkey_auto_stake_hotkey(coldkey: AccountId32, netuid: u16)`: `Option<AccountId32>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_coldkey_auto_stake_hotkey`

### `get_dynamic_info(netuid: u16)`: `Option<PalletSubtensorRpcInfoDynamicInfo>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_dynamic_info`

### `get_mechagraph(netuid: u16, mecid: u8)`: `Option<PalletSubtensorRpcInfoMetagraph>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_mechagraph`

### `get_metagraph(netuid: u16)`: `Option<PalletSubtensorRpcInfoMetagraph>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_metagraph`

### `get_selective_mechagraph(netuid: u16, subid: u8, metagraph_indexes: Vec<u16>)`: `Option<PalletSubtensorRpcInfoMetagraphSelectiveMetagraph>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_selective_mechagraph`

### `get_selective_metagraph(netuid: u16, metagraph_indexes: Vec<u16>)`: `Option<PalletSubtensorRpcInfoMetagraphSelectiveMetagraph>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_selective_metagraph`

### `get_subnet_account_id(netuid: u16)`: `Option<AccountId32>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_subnet_account_id`

### `get_subnet_hyperparams(netuid: u16)`: `Option<PalletSubtensorRpcInfoSubnetInfoSubnetHyperparams>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_subnet_hyperparams`

### `get_subnet_hyperparams_v2(netuid: u16)`: `Option<PalletSubtensorRpcInfoSubnetInfoSubnetHyperparamsV2>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_subnet_hyperparams_v2`

### `get_subnet_info(netuid: u16)`: `Option<PalletSubtensorRpcInfoSubnetInfo>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_subnet_info`

### `get_subnet_info_v2(netuid: u16)`: `Option<PalletSubtensorRpcInfoSubnetInfoSubnetInfov2>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_subnet_info_v2`

### `get_subnet_state(netuid: u16)`: `Option<PalletSubtensorRpcInfoShowSubnetSubnetState>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_subnet_state`

### `get_subnet_to_prune()`: `Option<u16>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_subnet_to_prune`

### `get_subnets_info()`: `Vec<Option<PalletSubtensorRpcInfoSubnetInfo>>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_subnets_info`

### `get_subnets_info_v2()`: `Vec<Option<PalletSubtensorRpcInfoSubnetInfoSubnetInfov2>>`

- **interface**: `api.call.SubnetInfoRuntimeApi.get_subnets_info_v2`


## `SubnetRegistrationRuntimeApi`

### `get_network_registration_cost()`: `u64`

- **interface**: `api.call.SubnetRegistrationRuntimeApi.get_network_registration_cost`


## `SwapRuntimeApi`

### `current_alpha_price(netuid: u16)`: `u64`

- **interface**: `api.call.SwapRuntimeApi.current_alpha_price`

### `current_alpha_price_all()`: `Vec<PalletSubtensorSwapRuntimeApiSubnetPrice>`

- **interface**: `api.call.SwapRuntimeApi.current_alpha_price_all`

### `sim_swap_alpha_for_tao(netuid: u16, alpha: u64)`: `{"taoAmount":"u64","alphaAmount":"u64","taoFee":"u64","alphaFee":"u64","taoSlippage":"u64","alphaSlippage":"u64"}`

- **interface**: `api.call.SwapRuntimeApi.sim_swap_alpha_for_tao`

### `sim_swap_tao_for_alpha(netuid: u16, tao: u64)`: `{"taoAmount":"u64","alphaAmount":"u64","taoFee":"u64","alphaFee":"u64","taoSlippage":"u64","alphaSlippage":"u64"}`

- **interface**: `api.call.SwapRuntimeApi.sim_swap_tao_for_alpha`


## `TaggedTransactionQueue`

### `validate_transaction(source: {"_enum":["InBlock","Local","External"]}, tx: Bytes, block_hash: H256)`: `Result<SpRuntimeTransactionValidityValidTransaction, SpRuntimeTransactionValidityTransactionValidityError>`

- **interface**: `api.call.TaggedTransactionQueue.validate_transaction`
- **summary**: Validate the transaction.

    This method is invoked by the transaction pool to learn details about given transaction. The implementation should make sure to verify the correctness of the transaction against current state. The given `block_hash` corresponds to the hash of the block that is used as current state.

    Note that this call may be performed by the pool multiple times and transactions might be verified in any possible order.


## `TransactionPaymentApi`

### `query_fee_details(uxt: Bytes, len: u32)`: `{"inclusionFee":"Option<PalletTransactionPaymentInclusionFee>","tip":"u64"}`

- **interface**: `api.call.TransactionPaymentApi.query_fee_details`

### `query_info(uxt: Bytes, len: u32)`: `{"weight":"SpWeightsWeightV2Weight","class":"FrameSupportDispatchDispatchClass","partialFee":"u64"}`

- **interface**: `api.call.TransactionPaymentApi.query_info`

### `query_length_to_fee(length: u32)`: `u64`

- **interface**: `api.call.TransactionPaymentApi.query_length_to_fee`

### `query_weight_to_fee(weight: {"refTime":"Compact<u64>","proofSize":"Compact<u64>"})`: `u64`

- **interface**: `api.call.TransactionPaymentApi.query_weight_to_fee`


## `TransactionPaymentCallApi`

### `query_call_fee_details(call: Call, len: u32)`: `{"inclusionFee":"Option<PalletTransactionPaymentInclusionFee>","tip":"u64"}`

- **interface**: `api.call.TransactionPaymentCallApi.query_call_fee_details`
- **summary**: Query fee details of a given encoded `Call`.

### `query_call_info(call: Call, len: u32)`: `{"weight":"SpWeightsWeightV2Weight","class":"FrameSupportDispatchDispatchClass","partialFee":"u64"}`

- **interface**: `api.call.TransactionPaymentCallApi.query_call_info`
- **summary**: Query information of a dispatch class, weight, and fee of a given encoded `Call`.

### `query_length_to_fee(length: u32)`: `u64`

- **interface**: `api.call.TransactionPaymentCallApi.query_length_to_fee`
- **summary**: Query the output of the current `LengthToFee` given some input.

### `query_weight_to_fee(weight: {"refTime":"Compact<u64>","proofSize":"Compact<u64>"})`: `u64`

- **interface**: `api.call.TransactionPaymentCallApi.query_weight_to_fee`
- **summary**: Query the output of the current `WeightToFee` given some input.
