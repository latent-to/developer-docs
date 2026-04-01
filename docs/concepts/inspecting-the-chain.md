---
title: "Inspecting the Chain with Polkadot.js"
---

# Inspecting the Chain with Polkadot.js


The [Polkadot.js Blockchain Explorer Browser App: `https://polkadot.js.org/apps/`](https://polkadot.js.org/apps/) offers a way to connect directly to Bittensor's blockchain layer (Subtensor), and query chain state, submit extrinsics, and inspect runtime metadata without installing any software. This page covers the features most relevant to Bittensor users.

## Connecting to Bittensor

Use these pre-configured links:

- **Mainnet (Finney):** [polkadot.js/apps/?rpc=wss://entrypoint-finney.opentensor.ai:443](https://polkadot.js.org/apps/?rpc=wss://entrypoint-finney.opentensor.ai:443)
- **Testnet:** [polkadot.js/apps/?rpc=wss://test.finney.opentensor.ai:443](https://polkadot.js.org/apps/?rpc=wss://test.finney.opentensor.ai:443)

Or click the network selector in the top-left corner and enter a custom WebSocket endpoint under **Development → Custom**.

## Chain state (storage queries)

**Developer → Chain state → Storage**

This is where you read on-chain parameters and account data. Select a pallet (e.g. `subtensorModule`, `proxy`, `balances`) and a storage item, then click **+** to query.

Example queries:

| Query | What it returns |
|---|---|
| `subtensorModule.networkRateLimit()` | Blocks between subnet registrations |
| `subtensorModule.minStake()` | Minimum transaction amount for staking operations |
| `subtensorModule.immunityPeriod(netuid)` | Immunity period in blocks for a subnet |
| `proxy.announcements(account)` | Pending proxy announcements |


### Storage maps vs storage values

Some storage items are **values** (global constants, no parameters needed). Others are **maps** keyed by account, netuid, or other identifiers. For maps, fill in the key field before querying.

## Constants

**Developer → Chain state → Constants**

Runtime constants are values baked into the chain code that don't change without a runtime upgrade. Select a pallet and constant name to view.

| Constant | What it returns |
|---|---|
| `balances.existentialDeposit` | Minimum account balance (500 RAO) |
| `proxy.maxProxies` | Maximum proxy relationships per account |
| `proxy.maxPending` | Maximum pending announcements per delegate |
| `proxy.announcementDepositBase` | Base deposit for proxy announcements |

## Runtime calls

**Developer → Runtime calls**

Runtime calls execute read-only functions that may involve computation (not just storage reads). Useful for derived values like the current subnet registration cost.

| Call | What it returns |
|---|---|
| `SubnetInfoRuntimeApi.get_subnet_info(netuid)` | Full subnet info including price, emission, reserves |
| `TransactionPaymentApi.query_info(uxt, len)` | Fee estimate for an extrinsic |

## Extrinsics

**Developer → Extrinsics**

Submit transactions directly. This is useful for operations not yet supported by `btcli`, or when signing with Polkadot Vault (QR code signing from an air-gapped device).

To submit an extrinsic:
1. Select the signing account.
2. Choose the pallet and call.
3. Fill in parameters.
4. Click **Submit Transaction**.

For Polkadot Vault users, the app will display a QR code to scan with the Vault device for air-gapped signing.

## Block explorer

**Network → Explorer**

Browse recent blocks and their extrinsics. Click any block number to see the extrinsics it contains and their events.

- Querying at a specific block: In Chain state, toggle "include option" and enter a block hash to query historical state.
- Decoding call data: Paste raw call data under Developer → Decode to see the human-readable extrinsic.
- Metadata updates: If you're using Polkadot Vault, you must re-load chain metadata after each Bittensor runtime upgrade. See [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security#hardware-solution-polkadot-vault).
