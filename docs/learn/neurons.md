---
title: "Understanding Neurons"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { SdkVersion } from "../sdk/_sdk-version.mdx";

# Understanding Neurons

The design of Bittensor subnets is inspired by the structure of a simple neural network, with each **neuron** being either a miner or validator. Each neuron is identified by a unique UID within its subnet and associated with a hotkey-coldkey pair for authentication and operations.

:::tip Neuron requirements
See [minimum compute requirements](https://github.com/opentensor/bittensor-subnet-template/blob/main/min_compute.yml) for compute, memory, bandwidth and storage requirements for neurons.
:::

## Neuron Architecture Overview

Neurons in a subnet operate within a server-client architecture:

- **Axon (Server)**: Miners deploy Axon servers to receive and process data from validators
- **Dendrite (Client)**: Validators use Dendrite clients to transmit data to miners
- **Synapse (Data Object)**: Encapsulates and structures data exchanged between neurons

Additionally, the Metagraph serves as a global directory for managing subnet nodes, while the Subtensor connects neurons to the blockchain.

## Complete Neuron Lifecycle

1. **Registration** → Neuron registers via PoW or burned registration
2. **UID Assignment** → Neuron receives unique UID within subnet
3. **Immunity Period** → Neuron is protected from pruning for configurable blocks
4. **Performance Building** → Neuron accumulates rank, trust, consensus, and incentive
5. **Validator Permit** → Top K neurons by stake receive validator permits
6. **Weight Setting** → Permitted neurons can set weights and participate in consensus
7. **Bond Formation** → Validators form bonds to miners based on performance
8. **Emission Distribution** → Neurons receive TAO emissions based on performance
9. **Performance Monitoring** → Neuron performance is continuously evaluated
10. **Pruning Risk** → Low-performing neurons risk replacement by new registrations

## Managing Neurons

### Registration and UID Assignment

Neurons register with subnets through proof-of-work or burned registration methods, receiving a unique UID (User ID) within their subnet. The registration process follows an append-or-replace algorithm where new neurons either expand the subnet or replace existing low-performing neurons.

See:

- [Miner Registration](../miners/#miner-registration)
- [Validator Registration](../validators/#validator-registration)

### Performance Metrics

Neuron performance is measured through multiple metrics:

- **Rank**: Final performance score after consensus weight clipping
  See: [Rank](../resources/glossary/#rank)
- **Consensus**: Stake-weighted median of weights serving as clipping threshold
  See: [Consensus score](../resources/glossary/#consensus-score)
- **Trust**: Consensus alignment measure for miners
  See: [Trust](../resources/glossary/#trust)
- **Validator Trust**: Consensus alignment measure for validators
  See: [Validator Trust](../resources/glossary/#validator-trust)
- **Incentive**: Normalized reward allocation for miners
  See: [Incentive](../resources/glossary/#incentives)

### Validator Permits and Access Control

Top K neurons by stake weight receive validator permits, allowing them to:

- Set weights and participate in consensus
- Form bonds to miners based on performance assessment
- Contribute to active stake calculations

Only permitted neurons can set non-self weights, though all neurons can set self-weights regardless of permit status.

<!-- TODO: Add detailed implementation sections from glossary:
- Neuron Data Structures (NeuronInfo vs NeuronInfoLite)
- Blockchain Storage Implementation (Core Storage Maps, Performance Metrics Storage)
- Registration Process (PoW, Burned, Root registration methods)
- Lifecycle Management (Append vs Replace, Pruning Algorithm, Immunity Period)
- API and Retrieval (Python SDK methods, Blockchain RPC methods)
- State Management (Active Status, Validator Permits, Performance Metrics)
- Network Operations (Weight Setting, Bond Formation)
- Testing and Validation (Registration testing, Lifecycle testing, Mock implementation)
- Mathematical Insights and Security Properties
- Complete Neuron Lifecycle flow
-->

## Neuron-to-neuron communication

Neurons exchange information by:

- Encapsulating the information in a Synapse object.
- Instantiating the server (Axon) and client (dendrite) network elements and exchanging Synapse objects using this server-client (Axon-dendrite) protocol. See the below diagram.

<center>
<ThemedImage
alt="Incentive Mechanism Big Picture"
sources={{
    light: useBaseUrl('/img/docs/second-building-blocks.svg'),
    dark: useBaseUrl('/img/docs/dark-second-building-blocks.svg'),
  }}
/>
</center>

### Axon

<SdkVersion />

The `Axon` module in the Bittensor API uses the FastAPI library to create and run API servers. For example, when a subnet miner calls,

```python
import bittensor as bt
axon = bt.Axon(wallet=self.wallet, config=self.config)
```

then an API server with the name `Axon` is created on the subnet miner node. This `Axon` API server receives incoming Synapse objects from subnet validators, i.e., the `Axon` starts to serve on behalf of the subnet miner.

Similarly, in your subnet miner code you must use the `Axon` API to create an API server to receive incoming Synapse objects from the subnet validators.

### Dendrite

Axon is a **server** instance. Hence, a subnet validator will instantiate a `dendrite` **client** on itself to transmit information to axons that are on the subnet miners. For example, when a subnet validator runs the following code fragment:

```python
    responses: List[bt.Synapse] = await self.dendrite(
        axons=axons,
        synapse=synapse,
        timeout=timeout,
    )
```

then the subnet validator:

- Instantiates a `dendrite` client on itself.
- Transmits `synapse` objects to a set of `axons` (that are attached to subnet miners).
- Waits until `timeout` expires.

### Synapse

A synapse is a data object. Subnet validators and subnet miners use Synapse data objects as the main vehicle to exchange information. The `Synapse` class inherits from the `BaseModel` of the Pydantic data validation library.

For example, in the [Text Prompting Subnet](https://github.com/macrocosm-os/prompting/blob/414abbb72835c46ccc5c652e1b1420c0c2be5c03/prompting/protocol.py#L27), the subnet validator creates a `Synapse` object, called `PromptingSynapse`, with three fields—`roles`, `messages`, and `completion`. The fields `roles` and `messages` are set by the subnet validator during the initialization of this Prompting data object, and they cannot be changed after that. A third field, `completion`, is mutable. When a subnet miner receives this Prompting object from the subnet validator, the subnet miner updates this `completion` field. The subnet validator then reads this updated `completion` field.

## The Metagraph

The metagraph is a data structure that contains comprehensive information about current state of the subnet. When you inspect the metagraph of a subnet, you will find detailed information on all the nodes (neurons) in the subnet. A subnet validator should first sync with a subnet's metagraph to know all the subnet miners that are in the subnet. The metagraph can be inspected without participating in a subnet.

See [The Subnet Metagraph](../subnets/metagraph)
