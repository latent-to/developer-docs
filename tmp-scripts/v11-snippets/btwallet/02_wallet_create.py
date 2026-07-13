"""Verify: Wallet construction, create_new_coldkey/create_new_hotkey, disk layout.

Doc snippets: 'Constructing a wallet', 'Creating new keys', disk layout tree.
Uses a temp path so ~/.bittensor/wallets is never touched.
"""
import os
import shutil

TEST_PATH = "/tmp/v11-wallet-test/02"
shutil.rmtree(TEST_PATH, ignore_errors=True)

from bittensor.wallet import Wallet

# Constructing is lazy: no keys created, no disk writes
wallet = Wallet(name="my-wallet", hotkey="my-hotkey", path=TEST_PATH)
print(repr(wallet))
assert not os.path.exists(os.path.join(TEST_PATH, "my-wallet"))
print("constructor touched disk:", os.path.exists(os.path.join(TEST_PATH, "my-wallet")))

# Non-interactive creation (docs' automation variant)
wallet.create_new_coldkey(n_words=24, use_password=False, suppress=True)
wallet.create_new_hotkey(suppress=True)

print("coldkey ss58:", wallet.coldkey.ss58_address)
print("hotkey ss58: ", wallet.hotkey.ss58_address)
print("coldkeypub == coldkey:", wallet.coldkeypub.ss58_address == wallet.coldkey.ss58_address)

# Disk layout
for root, dirs, files in os.walk(TEST_PATH):
    for f in sorted(files):
        print(os.path.relpath(os.path.join(root, f), TEST_PATH))

# Encrypted coldkey with a password supplied programmatically (no prompt)
w2 = Wallet(name="encrypted-wallet", path=TEST_PATH)
w2.create_new_coldkey(coldkey_password="hunter2-test", suppress=True)
print("coldkey encrypted at rest:", w2.coldkey_file.is_encrypted())
print("hotkey file encrypted:", wallet.hotkey_file.is_encrypted())

# create_new_* returns the wallet for chaining
w3 = Wallet(name="chained", path=TEST_PATH).create_new_coldkey(
    use_password=False, suppress=True
).create_new_hotkey(suppress=True)
print("chained ok:", w3.coldkey_file.exists_on_device() and w3.hotkey_file.exists_on_device())

shutil.rmtree(TEST_PATH)
print("PASS 02")
