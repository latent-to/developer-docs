---
title: "Subtensor API"
description: "Generated reference for the extrinsics, storage items, events, errors, constants and RPC methods exposed by the Subtensor runtime."
---

This section is the generated reference for the runtime of Subtensor, the L1 substrate blockchain underlying the Bittensor network. It documents every call the chain accepts, every value it stores, and every event and error it emits, along with the arguments and types each one takes.

These pages describe the chain interface itself, so they apply to any client that talks to a Subtensor node, including the Bittensor CLI (`btcli`), the Bittensor Python SDK, and PolkadotJS. Each page covers one namespace of the PolkadotJS API and is organized by pallet, matching the pallets in the [Subtensor codebase](../navigating-subtensor/index.md).

:::info
Each page is generated from a Subtensor runtime spec, and records the spec version and endpoint it was generated from.
:::

## Changing chain state

[Extrinsics](./extrinsics.md) are the transactions that write to the chain: registering a hotkey, setting weights, staking, transferring balances. Submit them via `api.tx.<Pallet>.<call_name>`.

Every extrinsic is subject to [transaction fees](../learn/fees.md), and many are also [rate limited](../learn/chain-rate-limits.md).

## Reading chain state

- [Storage](./storage.md): the values the chain keeps, such as stake, weights and subnet hyperparameters, via `api.query.<Pallet>.<storage_item>`
- [Constants](./constants.md): values fixed when the runtime is built, via `api.consts.<Pallet>.<constant_name>`
- [Runtime Calls](./runtime.md): runtime API methods that compute a result from chain state, via `api.call.<RuntimeApi>.<method_name>`
- [RPC](./rpc.md): JSON-RPC methods served by the node itself rather than the runtime, via `api.rpc.<namespace>.<method_name>`

To explore the same data interactively before writing any code, see [Inspecting the Chain with Polkadot.js](../concepts/inspecting-the-chain.md).

## Events and errors

- [Events](./events.md): what the runtime emits when a call succeeds, via `api.events.<Pallet>.<EventName>`
- [Errors](./errors.md): the error variants a call can return, via `api.errors.<Pallet>.<ErrorName>`

Errors that surface as a numeric code rather than a name are listed in [Custom Errors](../errors/custom.md). For how these errors reach you through `btcli`, the SDK and PolkadotJS, see [Subtensor Error Codes](../errors/index.md).
