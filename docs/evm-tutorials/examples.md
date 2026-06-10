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

The following tutorials cover common EVM workflows on Bittensor, including account management, token bridging, and interaction with precompiles:

- [Convert Ethereum (H160) Address to Substrate (SS58)](./convert-h160-to-ss58): Learn how to convert between H160 and SS58 address formats.
- [Bridging and wrapping vTAO](./vtao-bridge-tutorial.md): Move native TAO from the Bittensor Substrate layer to the Bittensor EVM and wrap it into vTAO.
- [Transfer TAO from Metamask to SS58 Address](./transfer-from-metamask-to-ss58.md): Learn how to transfer TAO from your Metamask wallet to your Bittensor SS58 address for a coldkey (wallet) or a hotkey.
- [Transfer Between Two H160 Accounts](./transfer-between-two-h160-accounts.md): Learn how to transfer TAO between two H160 accounts.

## Standard Ethereum Precompiles

The following table consists of standard Ethereum precompiles with their addresses and description:

| Precompile           | Address | Description                                                                              |
| -------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `ECRecover`          | `0x1`   | Recover the address associated with the public key from elliptic curve signature (ECDSA) |
| `Sha256`             | `0x2`   | SHA-256 hash function                                                                    |
| `Ripemd160`          | `0x3`   | RIPEMD-160 hash function                                                                 |
| `Identity`           | `0x4`   | Identity function (returns input data)                                                   |
| `Modexp`             | `0x5`   | Modular exponentiation                                                                   |
| `Dispatch`           | `0x6`   | Dispatch a runtime call from EVM                                                         |
| `Bn128Mul`           | `0x7`   | BN128 scalar multiplication                                                              |
| `Bn128Pairing`       | `0x8`   | BN128 pairing check                                                                      |
| `Bn128Add`           | `0x9`   | BN128 point addition                                                                     |
| `Sha3FIPS256`        | `0x400` | SHA3-256 hash function (FIPS variant)                                                    |
| `ECRecoverPublicKey` | `0x401` | Recover public key from an elliptic curve signature (ECDSA)                              |

## Bittensor-Specific Precompiles

The following table lists of Bittensor-specific precompiles with their addresses, descriptions and links to their respective documentation:

| Precompile                  | Address | Description                                                                                                   |
| --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `Ed25519Verify`             | `0x402` | Verify Ed25519 signatures. See [Ed25519 Verify](./ed25519-verify-precompile.md)                               |
| `SR25519Verify`             | `0x403` | Verify Substrate SR25519 signatures. See SR25519 Verify ./sr25519-verify-precompile.md                        |
| `BalanceTransferPrecompile` | `0x800` | Transfer TAO between H160 addresses. see [Transfer TAO](./transfer-between-two-h160-accounts.md)              |
| `StakingPrecompile`         | `0x801` | Staking via `msg.value` — **deprecated**, use V2. See [Staking Precompile](./staking-precompile.md)           |
| `MetagraphPrecompile`       | `0x802` | Interact with the metagraph (rank, trust, stake, axon). See [Metagraph Precompile](./metagraph-precompile.md) |
| `SubnetPrecompile`          | `0x803` | Register subnets, get/set hyperparameters . See [Subnet Precompile](./subnet-precompile.md)                   |
| `NeuronPrecompile`          | `0x804` | Register neurons, set weights, serve axon. See [Neuron Precompile](./neuron-precompile.md)                    |
| `StakingPrecompileV2`       | `0x805` | Full staking with limits, allowances, moves . See                                                             |
| `UidLookupPrecompile`       | `0x806` | Map EVM address → registered neuron UID. See                                                                  |
| `StorageQueryPrecompile`    | `0x807` | Manages EVM contracts read access to Substrate chain storage.                                                 |
| `AlphaPrecompile`           | `0x808` | AMM pool state, prices, swap simulation. See                                                                  |
| `CrowdloanPrecompile`       | `0x809` | Create and manage crowdloan campaigns. See                                                                    |
| `LeasingPrecompile`         | `0x80A` | Create subnet lease crowdloans, terminate leases. See                                                         |
| `ProxyPrecompile`           | `0x80B` | Add/remove/execute Substrate proxy relationships. See                                                         |
| `AddressMappingPrecompile`  | `0x80C` | Convert H160 → Substrate AccountId32. See                                                                     |
| `VotingPowerPrecompile`     | `0x80D` | Query per-validator EMA voting power. See                                                                     |
