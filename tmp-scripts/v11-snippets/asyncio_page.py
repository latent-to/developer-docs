"""Verify v11 snippets for subnets/asyncio.md (+ absorbed connections content).
Run: SSL_CERT_FILE=$(v11-venv/bin/python -m certifi) v11-venv/bin/python asyncio_page.py
Read-only against the public test network.
"""
import asyncio
import bittensor as sub

print("--- sync, series (SyncClient context manager) ---")
with sub.SyncClient("test") as client:
    for netuid in range(1, 4):
        info = client.subnets.subnet(netuid=netuid)
        print(f"subnet {netuid} exists: {info is not None}")

print("--- sync, manual close() ---")
client = sub.SyncClient("test")
print("block:", client.block())
client.close()

print("--- async, concurrent with gather ---")

async def main():
    async with sub.Client("test") as client:
        results = await asyncio.gather(
            *[client.subnets.subnet(netuid=n) for n in range(1, 8)]
        )
        for n, info in zip(range(1, 8), results):
            print(f"subnet {n} exists: {info is not None}")

asyncio.run(main())

print("--- async, snapshot-pinned multi-read ---")

async def pinned():
    async with sub.Client("test") as client:
        block = await client.block()
        snap = await client.at(block)
        results = await asyncio.gather(
            *[snap.subnets.subnet(netuid=n) for n in range(1, 4)]
        )
        print(f"at block {block}:", [info is not None for info in results])

asyncio.run(pinned())
