"""Verify v11 environment variables for sdk/env-vars.md.
Sets vars in-process, checks they are honored. Read-only (one testnet connect).
"""
import os

os.environ["BT_WALLET"] = "env-test-coldkey"
os.environ["BT_WALLET_HOTKEY"] = "env-test-hotkey"
os.environ["BT_WALLET_PATH"] = "/tmp/v11-env-test-wallets"

from bittensor.wallet import Wallet

w = Wallet()
print("wallet name from BT_WALLET:", w.name)
print("hotkey from BT_WALLET_HOTKEY:", w.hotkey_str)
print("path from BT_WALLET_PATH:", w.path)

os.environ["BT_NETWORK"] = "test"
import bittensor as sub

with sub.SyncClient() as client:
    print("BT_NETWORK=test client block:", client.block())
