---
title: "Bittensor EVM: Examples and Precompiles"
---

import { InstallPartial } from "./\_install.mdx";

# Bittensor EVM: Examples and Precompiles

## Available Precompiles

The following precompiled smart contracts are available on the Bittensor EVM.
The source code can be found [on GitHub](https://github.com/opentensor/subtensor/blob/main/precompiles/src).

Code examples used throughout this section are provided by the _Opentensor Foundation_ (_OTF_), and come from [this repository](https://github.com/opentensor/evm-bittensor/tree/main/examples).

## Examples

- [Convert Ethereum (H160) Address to Substrate (SS58)](./convert-h160-to-ss58): Learn how to convert between H160 and SS58 address formats

## Standard Ethereum Precompiles

- `ECRecover` (0x1): Recover the address associated with the public key from elliptic curve signature
- `Sha256` (0x2): SHA-256 hash function
- `Ripemd160` (0x3): RIPEMD-160 hash function
- `Identity` (0x4): Identity function (returns input data)
- `Modexp` (0x5): Modular exponentiation
- `Sha3FIPS256` (0x400): SHA3-256 hash function (FIPS variant)
- `ECRecoverPublicKey` (0x401): Recover the public key from an elliptic curve signature

## Bittensor-Specific Precompiles

The following list consists of Bittensor-specific precompiles with links to their respective documentation:

- `AddressMappingPrecompile`: Manage EVM and Substrate address conversions
- `AlphaPrecompile`: Manage alpha operations
- [`BalanceTransfer`](./transfer-between-two-h160-accounts.md): Transfer TAO between accounts
- `CrowdloanPrecompile`: Manage crowdloan operations
- [`Ed25519Verify`](./ed25519-verify-precompile.md): Verify Ed25519 signatures
- `LeasingPrecompile`: Manage subnet leasing operations
- [`MetagraphPrecompile`](./metagraph-precompile.md): Interact with the metagraph
- [`NeuronPrecompile`](./neuron-precompile.md): Manage neuron operations
- `ProxyPrecompile`: Manage proxy operations
- [`StakingPrecompile`](./staking-precompile.md): Manage staking operations
- [`StakingPrecompileV2`](./staking-precompile.md) (0x805): Main staking operations including:
  - `addStake`: Add stake to a hotkey
  - `removeStake`: Remove stake from a hotkey
  - `moveStake`: Move stake between hotkeys
  - `transferStake`: Transfer stake between coldkeys
  - `getTotalColdkeyStake`: Get total stake for a coldkey
  - `getTotalHotkeyStake`: Get total stake for a hotkey
  - `getStake`: Get stake between specific hotkey and coldkey
  - `addProxy`: Add a proxy delegate
  - `removeProxy`: Remove a proxy delegate
- [`Sr25519Verify`](./ed25519-verify-precompile.md): Verify Sr25519 signatures
- `StorageQueryPrecompile`: Manages EVM contracts read access to Substrate chain storage.
- [`SubnetPrecompile`](./subnet-precompile.md): Manage subnet operations
- `UidLookupPrecompile`: Looks up registered neuron UIDs associated with a given EVM address on a subnet.
- `VotingPowerPrecompile`: Manages per-validator EMA voting power scores for on-chain governance logic.
