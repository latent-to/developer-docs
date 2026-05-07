---
title: "Running a Subtensor node"
---

# Running a Subtensor node

This page covers what you need to know before setting up a Subtensor node.

---

A Subtensor node is an internet-connected machine that holds a synchronized copy of the Bittensor blockchain and exposes interfaces for querying state or participating in network operations such as block validation, subnet validation, and mining.

Running your own node gives you a private, low-latency endpoint instead of depending on a public one, which is recommended for any serious validator, miner, or indexer workload.

:::info Before you begin
Before you start running a subtensor node, you need to decide on what type of node you want to run. The node type you choose should depend on your available storage capacity and whether your use case requires access to historical chain data. For more information, see [Lite node vs Archive node](../../subtensor-nodes#lite-node-vs-archive-node).
:::

## Choosing an approach

There are two supported ways to run a Subtensor node:

- **Run with Docker**: Runs the node inside a preconfigured container. This provides a faster setup and a consistent, isolated environment for running the Subtensor node.
- **Run with Source Code**: Builds and runs the node directly from the Subtensor repository. Use this approach if you need full control over the build, plan to modify or inspect the runtime, or are debugging or contributing to Subtensor.

Both approaches result in the same node behavior. The difference is in setup, control, and operational complexity.

## Next steps

- [From source code](./using-source.md)
- [Using Docker](./using-source.md)
