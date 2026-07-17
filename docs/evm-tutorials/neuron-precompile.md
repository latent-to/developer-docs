---
title: "Neuron Precompile"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Neuron Precompile

This precompile enables full management of neurons (miner and validator nodes) through smart contracts, from registration to weight setting to service configuration.

See [Understanding Neurons](../learn/neurons.md).

:::info
Payable functions require tokens for execution
:::

## Precompile Address

The neuron precompile is available at address `0x804` (2052 in decimal).

## Available Functions

The neuron precompile provides the following core functions for neuron management:

### Weight Management

#### `setWeights`

Set weights (rankings) for miners on the subnet. See [Requirements for validation](../validators/#requirements-for-validation)

**Parameters:**

- `netuid` (uint16): The subnet ID where the neuron is registered
- `dests` (uint16[]): Array of destination neuron UIDs to assign weights to
- `weights` (uint16[]): Array of weight values corresponding to each destination UID
- `versionKey` (uint64): Version key for weight compatibility and validation

**Description:**
This function allows a neuron to set weights on other neurons in the same subnet. The weights represent how much value or trust this neuron assigns to others, which is crucial for the Bittensor consensus mechanism.

#### `commitWeights`

Commits weights using a hash commitment scheme for privacy and security.

**Parameters:**

- `netuid` (uint16): The subnet ID where the neuron is registered
- `commitHash` (bytes32): Hash commitment of the weights to be revealed later

**Description:**
This function implements a commit-reveal scheme for setting weights. The neuron first commits a hash of their weights, then later reveals the actual weights. This prevents weight-copying.

#### `revealWeights`

Reveals previously committed weights by providing the original data that produces the committed hash.

**Parameters:**

- `netuid` (uint16): The subnet ID where the neuron is registered
- `uids` (uint16[]): Array of neuron UIDs that weights are being set for
- `values` (uint16[]): Array of weight values for each corresponding UID
- `salt` (uint16[]): Salt values used in the original hash commitment
- `versionKey` (uint64): Version key for weight compatibility

**Description:**
This function completes the commit-reveal process by revealing the actual weights that were previously committed. The provided data must hash to the previously committed hash for the transaction to succeed.

### Neuron Registration

Neuron registration is required for joining a subnet as a miner or validator

#### `burnedRegister`

Registers a neuron in a subnet by burning TAO tokens.

**Parameters:**

- `netuid` (uint16): The subnet ID to register the neuron in
- `hotkey` (bytes32): The hotkey public key (32 bytes) of the neuron to register

**Description:**
This function registers a new neuron in the specified subnet by burning TAO at the **current dynamic registration price**. The price **decays** over time (governed by `BurnHalfLife`) and **increases** after each successful registration (governed by `BurnIncreaseMult`), clamped by `MinBurn` and `MaxBurn`. The hotkey represents the neuron's identity on the network.

#### `registerLimit`

Registers a neuron but **only if** the burn price does not exceed a caller-supplied cap (slippage protection).

**Parameters:**

- `netuid` (uint16): The subnet ID to register the neuron in
- `hotkey` (bytes32): The hotkey public key (32 bytes) of the neuron to register
- `limitPrice` (uint64): Maximum acceptable burn price in the chain’s fixed-point balance representation—confirm encoding with the deployed precompile ABI and metadata

**Description:**
Use this when you want the transaction to **fail** if the registration cost would be higher than `limitPrice`.

### Axon Services

#### `serveAxon`

Configures and serves an axon endpoint for the neuron.

**Parameters:**

- `netuid` (uint16): The subnet ID where the neuron is serving
- `version` (uint32): Version of the axon service
- `ip` (uint128): IP address of the axon service (supports both IPv4 and IPv6)
- `port` (uint16): Port number where the axon is listening
- `ipType` (uint8): Type of IP address (4 for IPv4, 6 for IPv6)
- `protocol` (uint8): Network protocol identifier
- `placeholder1` (uint8): Reserved for future use
- `placeholder2` (uint8): Reserved for future use

**Description:**
This function allows a neuron to announce its axon service endpoint to the network. An axon is the service interface that other neurons can connect to for communication and inference requests using the dendrite-axon protocol.

#### `serveAxonTls`

Configures and serves an axon endpoint with TLS/SSL security.

**Parameters:**

- `netuid` (uint16): The subnet ID where the neuron is serving
- `version` (uint32): Version of the axon service
- `ip` (uint128): IP address of the axon service
- `port` (uint16): Port number where the axon is listening
- `ipType` (uint8): Type of IP address (4 for IPv4, 6 for IPv6)
- `protocol` (uint8): Network protocol identifier
- `placeholder1` (uint8): Reserved for future use
- `placeholder2` (uint8): Reserved for future use
- `certificate` (bytes): TLS/SSL certificate data for secure connections

**Description:**
Similar to `serveAxon`, but includes TLS certificate information for secure encrypted communication. This is recommended for production environments where data privacy and security are important.

#### `servePrometheus`

Configures a Prometheus metrics endpoint for the neuron.

**Parameters:**

- `netuid` (uint16): The subnet ID where the neuron is serving
- `version` (uint32): Version of the Prometheus service
- `ip` (uint128): IP address where Prometheus metrics are served
- `port` (uint16): Port number for the Prometheus endpoint
- `ipType` (uint8): Type of IP address (4 for IPv4, 6 for IPv6)

**Description:**
This function allows a neuron to expose a Prometheus metrics endpoint for monitoring and observability. Prometheus metrics can include performance data, request counts, and other operational metrics.

## Usage Examples

### Setup

Before using the neuron precompile, you'll need a basic setup.

:::note
The following setup code is adapted from the test implementation in [neuron.precompile.emission-check.test.ts](https://github.com/RaoFoundation/subtensor/blob/main/evm-tests/test/neuron.precompile.emission-check.test.ts)
:::

```javascript
import { ethers } from "ethers";

// Neuron precompile address and ABI
// Source: https://raw.githubusercontent.com/RaoFoundation/subtensor/refs/heads/main/evm-tests/src/contracts/neuron.ts
const INEURON_ADDRESS = "0x0000000000000000000000000000000000000804";

const INeuronABI = [
  {
    inputs: [
      {
        internalType: "uint16",
        name: "netuid",
        type: "uint16",
      },
      {
        internalType: "bytes32",
        name: "commitHash",
        type: "bytes32",
      },
    ],
    name: "commitWeights",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "netuid",
        type: "uint16",
      },
      {
        internalType: "uint16[]",
        name: "uids",
        type: "uint16[]",
      },
      {
        internalType: "uint16[]",
        name: "values",
        type: "uint16[]",
      },
      {
        internalType: "uint16[]",
        name: "salt",
        type: "uint16[]",
      },
      {
        internalType: "uint64",
        name: "versionKey",
        type: "uint64",
      },
    ],
    name: "revealWeights",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "netuid",
        type: "uint16",
      },
      {
        internalType: "uint16[]",
        name: "dests",
        type: "uint16[]",
      },
      {
        internalType: "uint16[]",
        name: "weights",
        type: "uint16[]",
      },
      {
        internalType: "uint64",
        name: "versionKey",
        type: "uint64",
      },
    ],
    name: "setWeights",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "netuid",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "version",
        type: "uint32",
      },
      {
        internalType: "uint128",
        name: "ip",
        type: "uint128",
      },
      {
        internalType: "uint16",
        name: "port",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "ipType",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "protocol",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "placeholder1",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "placeholder2",
        type: "uint8",
      },
    ],
    name: "serveAxon",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "netuid",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "version",
        type: "uint32",
      },
      {
        internalType: "uint128",
        name: "ip",
        type: "uint128",
      },
      {
        internalType: "uint16",
        name: "port",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "ipType",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "protocol",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "placeholder1",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "placeholder2",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "certificate",
        type: "bytes",
      },
    ],
    name: "serveAxonTls",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "netuid",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "version",
        type: "uint32",
      },
      {
        internalType: "uint128",
        name: "ip",
        type: "uint128",
      },
      {
        internalType: "uint16",
        name: "port",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "ipType",
        type: "uint8",
      },
    ],
    name: "servePrometheus",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "netuid",
        type: "uint16",
      },
      {
        internalType: "bytes32",
        name: "hotkey",
        type: "bytes32",
      },
    ],
    name: "burnedRegister",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

// Initialize contract instance
const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
const neuronContract = new ethers.Contract(INEURON_ADDRESS, INeuronABI, wallet);
```

### Neuron Registration

#### Register a Neuron by Burning TAO

:::note
The following registration example is adapted from the test implementation in [neuron.precompile.emission-check.test.ts](https://github.com/RaoFoundation/subtensor/blob/main/evm-tests/test/neuron.precompile.emission-check.test.ts)
:::

```javascript
async function registerNeuron() {
  try {
    const netuid = 1; // Target subnet ID
    const hotkey =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"; // 32-byte hotkey

    const tx = await neuronContract.burnedRegister(netuid, hotkey);
    await tx.wait();

    console.log("Neuron registered successfully!");
    console.log("Transaction hash:", tx.hash);
  } catch (error) {
    console.error("Registration failed:", error);
  }
}
```

### Weight Management

#### Setting Weights Directly

:::note
The following weight setting example is adapted from the test implementation in [neuron.precompile.set-weights.test.ts](https://github.com/RaoFoundation/subtensor/blob/main/evm-tests/test/neuron.precompile.set-weights.test.ts)
:::

```javascript
async function setNeuronWeights() {
  try {
    const netuid = 1;
    const dests = [1, 2, 3]; // Target neuron UIDs
    const weights = [100, 200, 150]; // Weight values for each target
    const versionKey = 0;

    const tx = await neuronContract.setWeights(
      netuid,
      dests,
      weights,
      versionKey,
    );
    await tx.wait();

    console.log("Weights set successfully!");
    console.log("Transaction hash:", tx.hash);
  } catch (error) {
    console.error("Setting weights failed:", error);
  }
}
```

#### Commit-Reveal Weight Setting

:::note
The following commit-reveal weight setting example is adapted from the test implementation in [neuron.precompile.reveal-weights.test.ts](https://github.com/RaoFoundation/subtensor/blob/main/evm-tests/test/neuron.precompile.reveal-weights.test.ts)
:::

```javascript
import { blake2AsU8a } from "@polkadot/util-crypto";
import { Vec, Tuple, VecFixed, u16, u8, u64 } from "@polkadot/types-codec";
import { TypeRegistry } from "@polkadot/types";
import { hexToU8a } from "@polkadot/util";

// Helper function to convert Ethereum address to public key
// Logic adapted from: https://github.com/RaoFoundation/subtensor/blob/main/evm-tests/src/address-utils.ts
function convertH160ToPublicKey(ethAddress) {
  const prefix = "evm:";
  const prefixBytes = new TextEncoder().encode(prefix);
  const addressBytes = hexToU8a(
    ethAddress.startsWith("0x") ? ethAddress : `0x${ethAddress}`,
  );
  const combined = new Uint8Array(prefixBytes.length + addressBytes.length);

  // Concatenate prefix and Ethereum address
  combined.set(prefixBytes);
  combined.set(addressBytes, prefixBytes.length);

  // Hash the combined data (the public key)
  const hash = blake2AsU8a(combined);
  return hash;
}

// Helper function to generate commit hash
// Logic adapted from: https://github.com/RaoFoundation/subtensor/blob/main/evm-tests/test/neuron.precompile.reveal-weights.test.ts
function generateCommitHash(netuid, address, uids, values, salt, version_key) {
  const registry = new TypeRegistry();

  // Convert Ethereum address to public key format (32 bytes)
  const publicKey = convertH160ToPublicKey(address);

  const tupleData = new Tuple(
    registry,
    [
      VecFixed.with(u8, 32), // Public key
      u16, // Network UID
      Vec.with(u16), // UIDs
      Vec.with(u16), // Values
      Vec.with(u16), // Salt
      u64, // Version key
    ],
    [publicKey, netuid, uids, values, salt, version_key],
  );

  return blake2AsU8a(tupleData.toU8a());
}

// Step 1: Commit weights
async function commitWeights() {
  try {
    const netuid = 1;
    const uids = [1];
    const values = [5];
    const salt = [9]; // Random salt values
    const version_key = 0;

    // Generate commit hash
    const commitHash = generateCommitHash(
      netuid,
      wallet.address,
      uids,
      values,
      salt,
      version_key,
    );

    const tx = await neuronContract.commitWeights(netuid, commitHash);
    await tx.wait();

    console.log("Weights committed successfully!");
    console.log("Transaction hash:", tx.hash);

    // Store the reveal data for later use
    return { uids, values, salt, version_key };
  } catch (error) {
    console.error("Committing weights failed:", error);
  }
}

// Step 2: Reveal weights (after commit period)
async function revealWeights(revealData) {
  try {
    const netuid = 1;
    const { uids, values, salt, version_key } = revealData;

    const tx = await neuronContract.revealWeights(
      netuid,
      uids,
      values,
      salt,
      version_key,
    );
    await tx.wait();

    console.log("Weights revealed successfully!");
    console.log("Transaction hash:", tx.hash);
  } catch (error) {
    console.error("Revealing weights failed:", error);
  }
}

// Complete commit-reveal process
async function commitRevealWeights() {
  const revealData = await commitWeights();

  // Wait for the appropriate time (based on subnet parameters)
  // In production, you'd wait for the reveal period to begin

  await revealWeights(revealData);
}
```

:::tip
The commit-reveal mechanism requires generating a proper hash commitment using substrate utilities. Refer to the [test implementation](https://github.com/RaoFoundation/subtensor/blob/main/evm-tests/test/neuron.precompile.reveal-weights.test.ts) for the complete hash generation logic.
:::

### Service Configuration

#### Serve Axon Endpoint

:::note
The following axon service configuration example is adapted from the test implementation in [neuron.precompile.serve.axon-prometheus.test.ts](https://github.com/RaoFoundation/subtensor/blob/main/evm-tests/test/neuron.precompile.serve.axon-prometheus.test.ts)
:::

```javascript
async function serveAxon() {
  try {
    const netuid = 1;
    const version = 1;
    const ip = 0x7f000001; // 127.0.0.1 in hex
    const port = 8080;
    const ipType = 4; // IPv4
    const protocol = 0;
    const placeholder1 = 0;
    const placeholder2 = 0;

    const tx = await neuronContract.serveAxon(
      netuid,
      version,
      ip,
      port,
      ipType,
      protocol,
      placeholder1,
      placeholder2,
    );
    await tx.wait();

    console.log("Axon endpoint configured successfully!");
    console.log("Transaction hash:", tx.hash);
  } catch (error) {
    console.error("Serving axon failed:", error);
  }
}
```

#### Serve Axon with TLS

:::note
The following TLS axon service configuration example is adapted from the test implementation in [neuron.precompile.serve.axon-prometheus.test.ts](https://github.com/RaoFoundation/subtensor/blob/main/evm-tests/test/neuron.precompile.serve.axon-prometheus.test.ts)
:::

```javascript
async function serveAxonTls() {
  try {
    const netuid = 1;
    const version = 1;
    const ip = 0x7f000001; // 127.0.0.1 in hex
    const port = 8443; // HTTPS port
    const ipType = 4; // IPv4
    const protocol = 0;
    const placeholder1 = 0;
    const placeholder2 = 0;

    // Example TLS certificate (in practice, use your actual certificate)
    const certificate = new Uint8Array([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      58, 59, 60, 61, 62, 63, 64, 65,
    ]);

    const tx = await neuronContract.serveAxonTls(
      netuid,
      version,
      ip,
      port,
      ipType,
      protocol,
      placeholder1,
      placeholder2,
      certificate,
    );
    await tx.wait();

    console.log("Axon TLS endpoint configured successfully!");
    console.log("Transaction hash:", tx.hash);
  } catch (error) {
    console.error("Serving axon TLS failed:", error);
  }
}
```

#### Serve Prometheus Metrics

:::note
The following Prometheus metrics configuration example is adapted from the test implementation in [neuron.precompile.serve.axon-prometheus.test.ts](https://github.com/RaoFoundation/subtensor/blob/main/evm-tests/test/neuron.precompile.serve.axon-prometheus.test.ts)
:::

```javascript
async function servePrometheus() {
  try {
    const netuid = 1;
    const version = 1;
    const ip = 0x7f000001; // 127.0.0.1 in hex
    const port = 9090; // Prometheus default port
    const ipType = 4; // IPv4

    const tx = await neuronContract.servePrometheus(
      netuid,
      version,
      ip,
      port,
      ipType,
    );
    await tx.wait();

    console.log("Prometheus endpoint configured successfully!");
    console.log("Transaction hash:", tx.hash);
  } catch (error) {
    console.error("Serving Prometheus failed:", error);
  }
}
```

### Complete Neuron Setup Example

```javascript
async function setupCompleteNeuron() {
  try {
    const netuid = 1;
    const hotkey =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

    // 1. Register the neuron
    console.log("Registering neuron...");
    await registerNeuron();

    // 2. Configure axon service
    console.log("Setting up axon service...");
    await serveAxon();

    // 3. Configure Prometheus metrics
    console.log("Setting up Prometheus metrics...");
    await servePrometheus();

    // 4. Set initial weights (if validator)
    console.log("Setting weights...");
    await setNeuronWeights();

    console.log("Neuron setup complete!");
  } catch (error) {
    console.error("Neuron setup failed:", error);
  }
}

// Run complete setup
setupCompleteNeuron();
```

### Error Handling and Best Practices

```javascript
async function robustNeuronOperation() {
  try {
    const netuid = 1;
    const dests = [1, 2, 3];
    const weights = [100, 200, 150];
    const versionKey = 0;

    // Always check gas estimates before executing
    const gasEstimate = await neuronContract.setWeights.estimateGas(
      netuid,
      dests,
      weights,
      versionKey,
    );

    // Add buffer to gas limit
    const gasLimit = (gasEstimate * 120n) / 100n;

    const tx = await neuronContract.setWeights(
      netuid,
      dests,
      weights,
      versionKey,
      { gasLimit },
    );

    // Wait for confirmation with timeout
    const receipt = await tx.wait(1);

    if (receipt.status === 1) {
      console.log("Operation successful!");
    } else {
      console.error("Transaction failed");
    }
  } catch (error) {
    if (error.code === "INSUFFICIENT_FUNDS") {
      console.error("Insufficient funds for transaction");
    } else if (error.code === "NETWORK_ERROR") {
      console.error("Network connection issue");
    } else {
      console.error("Unexpected error:", error.message);
    }
  }
}
```
