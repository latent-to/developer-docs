---
title: "Working with Concurrency"
---

import { SdkVersion } from "../sdk/_sdk-version.mdx";

This page covers concurrency and connection management with the Bittensor SDK: the async `Client`, the blocking `SyncClient`, and how to make many chain reads efficiently.

<SdkVersion />

## Client lifecycle

Every `Client` or `SyncClient` instance owns a websocket connection to Subtensor, Bittensor's blockchain. Close it when you are done: if you don't, the connection stays open until Python's garbage collector gets to it, which threading can make unreliable.

Use one of the following (not both):

1. **(Preferred)** Instantiate the client as a [context manager](https://docs.python.org/3/reference/datamodel.html#context-managers) with `with` / `async with`, which closes the connection when the context ends.
2. Call `close()` manually when finished.

```python
import bittensor as sub

# Preferred: context manager
with sub.SyncClient("test") as client:
    # all calls to the client inside this block
    ...
# connection is closed at the end of the context scope
```

```python
import bittensor as sub

# Manual close
client = sub.SyncClient("test")
print(client.block())
client.close()
```

The async client works the same way with `async with` / `await client.close()`.

## Serial reads are slow

Calls to the blockchain are slow, and routines that make many calls in series get slower in proportion. For example, checking a range of netuids one at a time makes a separate round-trip for each:

```python
import bittensor as sub

with sub.SyncClient("test") as client:
    for netuid in range(1, 4):
        info = client.subnets.subnet(netuid=netuid)
        print(f"subnet {netuid} exists: {info is not None}")
```

## Concurrent reads with asyncio

The async `Client` shares one websocket connection across concurrent requests. Using Python's [asyncio](https://docs.python.org/3/library/asyncio.html), the same check runs the reads concurrently:

```python
import asyncio
import bittensor as sub

async def main():
    async with sub.Client("test") as client:
        results = await asyncio.gather(
            *[client.subnets.subnet(netuid=n) for n in range(1, 8)]
        )
        for n, info in zip(range(1, 8), results):
            print(f"subnet {n} exists: {info is not None}")

asyncio.run(main())
```

## Consistent multi-reads: pin a snapshot

Concurrent reads can land on different blocks. When a set of reads must be mutually consistent, pin them to one block with `client.at(block)` — the returned snapshot has the same read surface as the client:

```python
import asyncio
import bittensor as sub

async def main():
    async with sub.Client("test") as client:
        block = await client.block()
        snap = await client.at(block)
        results = await asyncio.gather(
            *[snap.subnets.subnet(netuid=n) for n in range(1, 4)]
        )
        print(f"at block {block}:", [info is not None for info in results])

asyncio.run(main())
```

## Coroutine vs function

The usage of `async def` creates an asyncio _coroutine_ rather than a function. Coroutines differ from functions in that coroutines are run in event loops using `await`.

:::caution Coroutines must always be awaited
Coroutines always need to be awaited, and generally speaking, "asyncio objects" are instantiated with `async with`. See [Python documentation on asyncio](https://docs.python.org/3/library/asyncio.html) for a comprehensive section with examples.
:::

## Reads without a named method

Every named read is a typed method on its client namespace (`client.subnets`, `client.staking`, `client.balances`, ...). Anything without a named read is reachable through the generic accessors — `client.query(...)`, `client.query_map(...)`, `client.constant(...)`, and `client.runtime(...)` — which cover the entire runtime surface. See [Subtensor storage query examples](../subtensor-nodes/subtensor-storage-query-examples).
