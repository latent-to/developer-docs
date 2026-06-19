---
title: RPC
description: "This page shows JSON-RPC methods available on the Subtensor node."
---

# RPC

This page shows JSON-RPC methods available on the Subtensor node. Accessible via `api.rpc.<namespace>.<method_name>`.

:::info
Generated from Subtensor runtime spec version **419**. Connected to: `wss://entrypoint-finney.opentensor.ai:443`
:::

- **[author](#author)**
- **[chain](#chain)**
- **[childstate](#childstate)**
- **[eth](#eth)**
- **[net](#net)**
- **[offchain](#offchain)**
- **[payment](#payment)**
- **[rpc](#rpc)**
- **[state](#state)**
- **[system](#system)**
- **[web3](#web3)**

## `author`

### `hasKey(publicKey: Bytes, keyType: Text)`: `bool`

- **interface**: `api.rpc.author.hasKey`
- **unsafe**: this method is flagged as unsafe
- **summary**: Returns true if the keystore has private keys for the given public key and key type.

### `hasSessionKeys(sessionKeys: Bytes)`: `bool`

- **interface**: `api.rpc.author.hasSessionKeys`
- **unsafe**: this method is flagged as unsafe
- **summary**: Returns true if the keystore has private keys for the given session public keys.

### `insertKey(keyType: Text, suri: Text, publicKey: Bytes)`: `Bytes`

- **interface**: `api.rpc.author.insertKey`
- **unsafe**: this method is flagged as unsafe
- **summary**: Insert a key into the keystore.

### `pendingExtrinsics()`: `Vec<Extrinsic>`

- **interface**: `api.rpc.author.pendingExtrinsics`
- **summary**: Returns all pending extrinsics, potentially grouped by sender

### `removeExtrinsic(bytesOrHash: Vec<ExtrinsicOrHash>)`: `Vec<Hash>`

- **interface**: `api.rpc.author.removeExtrinsic`
- **unsafe**: this method is flagged as unsafe
- **summary**: Remove given extrinsic from the pool and temporarily ban it to prevent reimporting

### `rotateKeys()`: `Bytes`

- **interface**: `api.rpc.author.rotateKeys`
- **unsafe**: this method is flagged as unsafe
- **summary**: Generate new session keys and returns the corresponding public keys

### `submitAndWatchExtrinsic(extrinsic: Extrinsic)`: `ExtrinsicStatus`

- **interface**: `api.rpc.author.submitAndWatchExtrinsic`
- **jsonrpc**: subscription
- **summary**: Submit and subscribe to watch an extrinsic until unsubscribed

### `submitExtrinsic(extrinsic: Extrinsic)`: `Hash`

- **interface**: `api.rpc.author.submitExtrinsic`
- **summary**: Submit a fully formatted extrinsic for block inclusion


## `chain`

### `getBlock(hash?: BlockHash)`: `SignedBlock`

- **interface**: `api.rpc.chain.getBlock`
- **summary**: Get header and body of a relay chain block

### `getBlockHash(blockNumber?: BlockNumber)`: `BlockHash`

- **interface**: `api.rpc.chain.getBlockHash`
- **summary**: Get the block hash for a specific block

### `getFinalizedHead()`: `BlockHash`

- **interface**: `api.rpc.chain.getFinalizedHead`
- **summary**: Get hash of the last finalized block in the canon chain

### `getHeader(hash?: BlockHash)`: `Header`

- **interface**: `api.rpc.chain.getHeader`
- **summary**: Retrieves the header for a specific block

### `subscribeAllHeads()`: `Header`

- **interface**: `api.rpc.chain.subscribeAllHeads`
- **jsonrpc**: subscription
- **summary**: Retrieves the newest header via subscription

### `subscribeFinalizedHeads()`: `Header`

- **interface**: `api.rpc.chain.subscribeFinalizedHeads`
- **jsonrpc**: subscription
- **summary**: Retrieves the best finalized header via subscription

### `subscribeNewHeads()`: `Header`

- **interface**: `api.rpc.chain.subscribeNewHeads`
- **jsonrpc**: subscription
- **summary**: Retrieves the best header via subscription


## `childstate`

### `getKeys(childKey: PrefixedStorageKey, prefix: StorageKey, at?: Hash)`: `Vec<StorageKey>`

- **interface**: `api.rpc.childstate.getKeys`
- **summary**: Returns the keys with prefix from a child storage, leave empty to get all the keys

### `getKeysPaged(childKey: PrefixedStorageKey, prefix: StorageKey, count: u32, startKey?: StorageKey, at?: Hash)`: `Vec<StorageKey>`

- **interface**: `api.rpc.childstate.getKeysPaged`
- **summary**: Returns the keys with prefix from a child storage with pagination support

### `getStorage(childKey: PrefixedStorageKey, key: StorageKey, at?: Hash)`: `Option<StorageData>`

- **interface**: `api.rpc.childstate.getStorage`
- **summary**: Returns a child storage entry at a specific block state

### `getStorageEntries(childKey: PrefixedStorageKey, keys: Vec<StorageKey>, at?: Hash)`: `Vec<Option<StorageData>>`

- **interface**: `api.rpc.childstate.getStorageEntries`
- **summary**: Returns child storage entries for multiple keys at a specific block state

### `getStorageHash(childKey: PrefixedStorageKey, key: StorageKey, at?: Hash)`: `Option<Hash>`

- **interface**: `api.rpc.childstate.getStorageHash`
- **summary**: Returns the hash of a child storage entry at a block state

### `getStorageSize(childKey: PrefixedStorageKey, key: StorageKey, at?: Hash)`: `Option<u64>`

- **interface**: `api.rpc.childstate.getStorageSize`
- **summary**: Returns the size of a child storage entry at a block state


## `eth`

### `accounts()`: `Vec<H160>`

- **interface**: `api.rpc.eth.accounts`
- **summary**: Returns accounts list.

### `blockNumber()`: `U256`

- **interface**: `api.rpc.eth.blockNumber`
- **summary**: Returns the blockNumber

### `call(request: EthCallRequest, number?: BlockNumber)`: `Bytes`

- **interface**: `api.rpc.eth.call`
- **summary**: Call contract, returning the output data.

### `chainId()`: `U64`

- **interface**: `api.rpc.eth.chainId`
- **summary**: Returns the chain ID used for transaction signing at the current best block. None is returned if not available.

### `coinbase()`: `H160`

- **interface**: `api.rpc.eth.coinbase`
- **summary**: Returns block author.

### `estimateGas(request: EthCallRequest, number?: BlockNumber)`: `U256`

- **interface**: `api.rpc.eth.estimateGas`
- **summary**: Estimate gas needed for execution of given contract.

### `feeHistory(blockCount: U256, newestBlock: BlockNumber, rewardPercentiles: Option<Vec<f64>>)`: `EthFeeHistory`

- **interface**: `api.rpc.eth.feeHistory`
- **summary**: Returns fee history for given block count & reward percentiles

### `gasPrice()`: `U256`

- **interface**: `api.rpc.eth.gasPrice`
- **summary**: Returns current gas price.

### `getBalance(address: H160, number?: BlockNumber)`: `U256`

- **interface**: `api.rpc.eth.getBalance`
- **summary**: Returns balance of the given account.

### `getBlockByHash(hash: H256, full: bool)`: `Option<EthRichBlock>`

- **interface**: `api.rpc.eth.getBlockByHash`
- **summary**: Returns block with given hash.

### `getBlockByNumber(block: BlockNumber, full: bool)`: `Option<EthRichBlock>`

- **interface**: `api.rpc.eth.getBlockByNumber`
- **summary**: Returns block with given number.

### `getBlockTransactionCountByHash(hash: H256)`: `U256`

- **interface**: `api.rpc.eth.getBlockTransactionCountByHash`
- **summary**: Returns the number of transactions in a block with given hash.

### `getBlockTransactionCountByNumber(block: BlockNumber)`: `U256`

- **interface**: `api.rpc.eth.getBlockTransactionCountByNumber`
- **summary**: Returns the number of transactions in a block with given block number.

### `getCode(address: H160, number?: BlockNumber)`: `Bytes`

- **interface**: `api.rpc.eth.getCode`
- **summary**: Returns the code at given address at given time (block number).

### `getFilterChanges(index: U256)`: `EthFilterChanges`

- **interface**: `api.rpc.eth.getFilterChanges`
- **summary**: Returns filter changes since last poll.

### `getFilterLogs(index: U256)`: `Vec<EthLog>`

- **interface**: `api.rpc.eth.getFilterLogs`
- **summary**: Returns all logs matching given filter (in a range 'from' - 'to').

### `getLogs(filter: EthFilter)`: `Vec<EthLog>`

- **interface**: `api.rpc.eth.getLogs`
- **summary**: Returns logs matching given filter object.

### `getStorageAt(address: H160, index: U256, number?: BlockNumber)`: `H256`

- **interface**: `api.rpc.eth.getStorageAt`
- **summary**: Returns content of the storage at given address.

### `getTransactionByBlockHashAndIndex(hash: H256, index: U256)`: `EthTransaction`

- **interface**: `api.rpc.eth.getTransactionByBlockHashAndIndex`
- **summary**: Returns transaction at given block hash and index.

### `getTransactionByBlockNumberAndIndex(number: BlockNumber, index: U256)`: `EthTransaction`

- **interface**: `api.rpc.eth.getTransactionByBlockNumberAndIndex`
- **summary**: Returns transaction by given block number and index.

### `getTransactionByHash(hash: H256)`: `EthTransaction`

- **interface**: `api.rpc.eth.getTransactionByHash`
- **summary**: Get transaction by its hash.

### `getTransactionCount(address: H160, number?: BlockNumber)`: `U256`

- **interface**: `api.rpc.eth.getTransactionCount`
- **summary**: Returns the number of transactions sent from given address at given time (block number).

### `getTransactionReceipt(hash: H256)`: `EthReceipt`

- **interface**: `api.rpc.eth.getTransactionReceipt`
- **summary**: Returns transaction receipt by transaction hash.

### `getUncleByBlockHashAndIndex(hash: H256, index: U256)`: `EthRichBlock`

- **interface**: `api.rpc.eth.getUncleByBlockHashAndIndex`
- **summary**: Returns an uncles at given block and index.

### `getUncleByBlockNumberAndIndex(number: BlockNumber, index: U256)`: `EthRichBlock`

- **interface**: `api.rpc.eth.getUncleByBlockNumberAndIndex`
- **summary**: Returns an uncles at given block and index.

### `getUncleCountByBlockHash(hash: H256)`: `U256`

- **interface**: `api.rpc.eth.getUncleCountByBlockHash`
- **summary**: Returns the number of uncles in a block with given hash.

### `getUncleCountByBlockNumber(number: BlockNumber)`: `U256`

- **interface**: `api.rpc.eth.getUncleCountByBlockNumber`
- **summary**: Returns the number of uncles in a block with given block number.

### `getWork()`: `EthWork`

- **interface**: `api.rpc.eth.getWork`
- **summary**: Returns the hash of the current block, the seedHash, and the boundary condition to be met.

### `hashrate()`: `U256`

- **interface**: `api.rpc.eth.hashrate`
- **summary**: Returns the number of hashes per second that the node is mining with.

### `maxPriorityFeePerGas()`: `U256`

- **interface**: `api.rpc.eth.maxPriorityFeePerGas`
- **summary**: Returns max priority fee per gas

### `mining()`: `bool`

- **interface**: `api.rpc.eth.mining`
- **summary**: Returns true if client is actively mining new blocks.

### `newBlockFilter()`: `U256`

- **interface**: `api.rpc.eth.newBlockFilter`
- **summary**: Returns id of new block filter.

### `newFilter(filter: EthFilter)`: `U256`

- **interface**: `api.rpc.eth.newFilter`
- **summary**: Returns id of new filter.

### `newPendingTransactionFilter()`: `U256`

- **interface**: `api.rpc.eth.newPendingTransactionFilter`
- **summary**: Returns id of new block filter.

### `protocolVersion()`: `u64`

- **interface**: `api.rpc.eth.protocolVersion`
- **summary**: Returns protocol version encoded as a string (quotes are necessary).

### `sendRawTransaction(bytes: Bytes)`: `H256`

- **interface**: `api.rpc.eth.sendRawTransaction`
- **summary**: Sends signed transaction, returning its hash.

### `sendTransaction(tx: EthTransactionRequest)`: `H256`

- **interface**: `api.rpc.eth.sendTransaction`
- **summary**: Sends transaction; will block waiting for signer to return the transaction hash

### `submitHashrate(index: U256, hash: H256)`: `bool`

- **interface**: `api.rpc.eth.submitHashrate`
- **summary**: Used for submitting mining hashrate.

### `submitWork(nonce: H64, headerHash: H256, mixDigest: H256)`: `bool`

- **interface**: `api.rpc.eth.submitWork`
- **summary**: Used for submitting a proof-of-work solution.

### `subscribe(kind: EthSubKind, params?: EthSubParams)`: `Null`

- **interface**: `api.rpc.eth.subscribe`
- **jsonrpc**: subscription
- **summary**: Subscribe to Eth subscription.

### `syncing()`: `EthSyncStatus`

- **interface**: `api.rpc.eth.syncing`
- **summary**: Returns an object with data about the sync status or false.

### `uninstallFilter(index: U256)`: `bool`

- **interface**: `api.rpc.eth.uninstallFilter`
- **summary**: Uninstalls filter.


## `net`

### `listening()`: `bool`

- **interface**: `api.rpc.net.listening`
- **summary**: Returns true if client is actively listening for network connections. Otherwise false.

### `peerCount()`: `Text`

- **interface**: `api.rpc.net.peerCount`
- **summary**: Returns number of peers connected to node.

### `version()`: `Text`

- **interface**: `api.rpc.net.version`
- **summary**: Returns protocol version.


## `offchain`

### `localStorageClear(kind: StorageKind, key: Bytes)`: `Null`

- **interface**: `api.rpc.offchain.localStorageClear`
- **unsafe**: this method is flagged as unsafe
- **summary**: Clear offchain local storage under given key and prefix

### `localStorageGet(kind: StorageKind, key: Bytes)`: `Option<Bytes>`

- **interface**: `api.rpc.offchain.localStorageGet`
- **unsafe**: this method is flagged as unsafe
- **summary**: Get offchain local storage under given key and prefix

### `localStorageSet(kind: StorageKind, key: Bytes, value: Bytes)`: `Null`

- **interface**: `api.rpc.offchain.localStorageSet`
- **unsafe**: this method is flagged as unsafe
- **summary**: Set offchain local storage under given key and prefix


## `payment`

### `queryFeeDetails(extrinsic: Bytes, at?: BlockHash)`: `FeeDetails`

- **interface**: `api.rpc.payment.queryFeeDetails`
- **summary**: Query the detailed fee of a given encoded extrinsic

### `queryInfo(extrinsic: Bytes, at?: BlockHash)`: `RuntimeDispatchInfoV1`

- **interface**: `api.rpc.payment.queryInfo`
- **summary**: Retrieves the fee information for an encoded extrinsic


## `rpc`

### `methods()`: `RpcMethods`

- **interface**: `api.rpc.rpc.methods`
- **summary**: Retrieves the list of RPC methods that are exposed by the node


## `state`

### `call(method: Text, data: Bytes, at?: BlockHash)`: `Bytes`

- **interface**: `api.rpc.state.call`
- **summary**: Perform a call to a builtin on the chain

### `getChildReadProof(childStorageKey: PrefixedStorageKey, keys: Vec<StorageKey>, at?: BlockHash)`: `ReadProof`

- **interface**: `api.rpc.state.getChildReadProof`
- **summary**: Returns proof of storage for child key entries at a specific block state.

### `getKeys(key: StorageKey, at?: BlockHash)`: `Vec<StorageKey>`

- **interface**: `api.rpc.state.getKeys`
- **summary**: Retrieves the keys with a certain prefix

### `getKeysPaged(key: StorageKey, count: u32, startKey?: StorageKey, at?: BlockHash)`: `Vec<StorageKey>`

- **interface**: `api.rpc.state.getKeysPaged`
- **summary**: Returns the keys with prefix with pagination support.

### `getMetadata(at?: BlockHash)`: `Metadata`

- **interface**: `api.rpc.state.getMetadata`
- **summary**: Returns the runtime metadata

### `getPairs(prefix: StorageKey, at?: BlockHash)`: `Vec<KeyValue>`

- **interface**: `api.rpc.state.getPairs`
- **unsafe**: this method is flagged as unsafe
- **summary**: Returns the keys with prefix, leave empty to get all the keys (deprecated: Use getKeysPaged)

### `getReadProof(keys: Vec<StorageKey>, at?: BlockHash)`: `ReadProof`

- **interface**: `api.rpc.state.getReadProof`
- **summary**: Returns proof of storage entries at a specific block state

### `getRuntimeVersion(at?: BlockHash)`: `RuntimeVersion`

- **interface**: `api.rpc.state.getRuntimeVersion`
- **summary**: Get the runtime version

### `getStorage(key: StorageKey, at?: BlockHash)`: `StorageData`

- **interface**: `api.rpc.state.getStorage`
- **summary**: Retrieves the storage for a key

### `getStorageHash(key: StorageKey, at?: BlockHash)`: `Hash`

- **interface**: `api.rpc.state.getStorageHash`
- **summary**: Retrieves the storage hash

### `getStorageSize(key: StorageKey, at?: BlockHash)`: `u64`

- **interface**: `api.rpc.state.getStorageSize`
- **summary**: Retrieves the storage size

### `queryStorage(keys: Vec<StorageKey>, fromBlock: Hash, toBlock?: BlockHash)`: `Vec<StorageChangeSet>`

- **interface**: `api.rpc.state.queryStorage`
- **unsafe**: this method is flagged as unsafe
- **summary**: Query historical storage entries (by key) starting from a start block

### `queryStorageAt(keys: Vec<StorageKey>, at?: BlockHash)`: `Vec<StorageChangeSet>`

- **interface**: `api.rpc.state.queryStorageAt`
- **summary**: Query storage entries (by key) starting at block hash given as the second parameter

### `subscribeRuntimeVersion()`: `RuntimeVersion`

- **interface**: `api.rpc.state.subscribeRuntimeVersion`
- **jsonrpc**: subscription
- **summary**: Retrieves the runtime version via subscription

### `subscribeStorage(keys?: Vec<StorageKey>)`: `StorageChangeSet`

- **interface**: `api.rpc.state.subscribeStorage`
- **jsonrpc**: subscription
- **summary**: Subscribes to storage changes for the provided keys

### `traceBlock(block: Hash, targets: Option<Text>, storageKeys: Option<Text>, methods: Option<Text>)`: `TraceBlockResponse`

- **interface**: `api.rpc.state.traceBlock`
- **unsafe**: this method is flagged as unsafe
- **summary**: Provides a way to trace the re-execution of a single block


## `system`

### `accountNextIndex(accountId: AccountId)`: `Index`

- **interface**: `api.rpc.system.accountNextIndex`
- **summary**: Retrieves the next accountIndex as available on the node

### `addLogFilter(directives: Text)`: `Null`

- **interface**: `api.rpc.system.addLogFilter`
- **unsafe**: this method is flagged as unsafe
- **summary**: Adds the supplied directives to the current log filter

### `addReservedPeer(peer: Text)`: `Text`

- **interface**: `api.rpc.system.addReservedPeer`
- **unsafe**: this method is flagged as unsafe
- **summary**: Adds a reserved peer

### `chain()`: `Text`

- **interface**: `api.rpc.system.chain`
- **summary**: Retrieves the chain

### `chainType()`: `ChainType`

- **interface**: `api.rpc.system.chainType`
- **summary**: Retrieves the chain type

### `dryRun(extrinsic: Bytes, at?: BlockHash)`: `ApplyExtrinsicResult`

- **interface**: `api.rpc.system.dryRun`
- **unsafe**: this method is flagged as unsafe
- **summary**: Dry run an extrinsic at a given block

### `health()`: `Health`

- **interface**: `api.rpc.system.health`
- **summary**: Return health status of the node

### `localListenAddresses()`: `Vec<Text>`

- **interface**: `api.rpc.system.localListenAddresses`
- **summary**: The addresses include a trailing /p2p/ with the local PeerId, and are thus suitable to be passed to addReservedPeer or as a bootnode address for example

### `localPeerId()`: `Text`

- **interface**: `api.rpc.system.localPeerId`
- **summary**: Returns the base58-encoded PeerId of the node

### `name()`: `Text`

- **interface**: `api.rpc.system.name`
- **summary**: Retrieves the node name

### `networkState()`: `NetworkState`

- **interface**: `api.rpc.system.networkState`
- **unsafe**: this method is flagged as unsafe
- **summary**: Returns current state of the network

### `nodeRoles()`: `Vec<NodeRole>`

- **interface**: `api.rpc.system.nodeRoles`
- **summary**: Returns the roles the node is running as

### `peers()`: `Vec<PeerInfo>`

- **interface**: `api.rpc.system.peers`
- **unsafe**: this method is flagged as unsafe
- **summary**: Returns the currently connected peers

### `properties()`: `ChainProperties`

- **interface**: `api.rpc.system.properties`
- **summary**: Get a custom set of properties as a JSON object, defined in the chain spec

### `removeReservedPeer(peerId: Text)`: `Text`

- **interface**: `api.rpc.system.removeReservedPeer`
- **unsafe**: this method is flagged as unsafe
- **summary**: Remove a reserved peer

### `reservedPeers()`: `Vec<Text>`

- **interface**: `api.rpc.system.reservedPeers`
- **summary**: Returns the list of reserved peers

### `resetLogFilter()`: `Null`

- **interface**: `api.rpc.system.resetLogFilter`
- **unsafe**: this method is flagged as unsafe
- **summary**: Resets the log filter to Substrate defaults

### `syncState()`: `SyncState`

- **interface**: `api.rpc.system.syncState`
- **summary**: Returns the state of the syncing of the node

### `version()`: `Text`

- **interface**: `api.rpc.system.version`
- **summary**: Retrieves the version of the node


## `web3`

### `clientVersion()`: `Text`

- **interface**: `api.rpc.web3.clientVersion`
- **summary**: Returns current client version.

### `sha3(data: Bytes)`: `H256`

- **interface**: `api.rpc.web3.sha3`
- **summary**: Returns sha3 of the given data
