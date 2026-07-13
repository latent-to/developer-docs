"""Smoke-test bittensor 11.0.0rc11: import surface + read-only testnet queries.
Run with: /Users/michaeltrestman/bittensor_workspace/latents/v11-venv/bin/python v11_smoke.py
Read-only. No wallet, no mutations.
"""
import bittensor as sub

print("package:", sub.__name__, getattr(sub, "__version__", "(no __version__)"))
print("has Client:", hasattr(sub, "Client"), "| SyncClient:", hasattr(sub, "SyncClient"))
print("intents present:", all(hasattr(sub, n) for n in ("Transfer", "AddStake", "SetWeights", "Batch")))
print("http_auth:", hasattr(sub, "http_auth"))

with sub.SyncClient("test") as client:
    block = client.block()
    print("testnet block:", block)
    subnets = client.subnets.all()
    print("testnet subnets:", len(subnets))
    ed = client.balances.existential_deposit()
    print("existential deposit:", ed)
