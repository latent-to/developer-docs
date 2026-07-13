"""Verify: bittensor.wallets convenience helpers (create, open_wallet, list_wallets).

Doc snippets: 'Convenience helpers' section.
"""
import shutil

TEST_PATH = "/tmp/v11-wallet-test/03"
shutil.rmtree(TEST_PATH, ignore_errors=True)

from bittensor import wallets

# create: coldkey + hotkey in one call (use_password=False for automation;
# the default use_password=True prompts)
wallet = wallets.create(name="my-wallet", hotkey="miner-1", use_password=False, path=TEST_PATH)
print("created:", wallet.coldkey.ss58_address)

wallets.new_hotkey(name="my-wallet", hotkey="miner-2", path=TEST_PATH)

# open_wallet: handle only, no key creation
w = wallets.open_wallet(name="my-wallet", hotkey="miner-1", path=TEST_PATH)
print("opened hotkey:", w.hotkey.ss58_address)

# list_wallets: name -> hotkeys
print(wallets.list_wallets(path=TEST_PATH))

# list_wallets_detailed
for info in wallets.list_wallets_detailed(path=TEST_PATH):
    print(info.name, info.ss58, [h.name for h in info.hotkeys])

shutil.rmtree(TEST_PATH)
print("PASS 03")
