"""Verify: regenerate_coldkey / regenerate_hotkey / regenerate_coldkeypub,
and the wallets.regen_* helpers.

Doc snippets: 'Regenerating a wallet from a mnemonic or seed', watch-only wallet.
"""
import shutil

TEST_PATH = "/tmp/v11-wallet-test/04"
shutil.rmtree(TEST_PATH, ignore_errors=True)

from bittensor.wallet import Wallet, Keypair
from bittensor import wallets

mnemonic = Keypair.generate_mnemonic(24)

# Same mnemonic -> same key, deterministic
w1 = Wallet(name="restored", path=TEST_PATH)
w1.regenerate_coldkey(mnemonic=mnemonic, use_password=False, suppress=True)
w1.regenerate_hotkey(mnemonic=mnemonic, suppress=True)

w2 = Wallet(name="restored-copy", path=TEST_PATH)
w2.regenerate_coldkey(mnemonic=mnemonic, use_password=False, suppress=True)
assert w1.coldkey.ss58_address == w2.coldkey.ss58_address
print("deterministic:", w1.coldkey.ss58_address)

# From a 32-byte seed (hex string or bytes)
w3 = Wallet(name="from-seed", path=TEST_PATH)
w3.regenerate_coldkey(seed="0x" + "ab" * 32, use_password=False, suppress=True)
print("from seed:", w3.coldkey.ss58_address)

# From a Polkadot.js encrypted JSON export: regenerate_coldkey(json=(json_str, passphrase), ...)
# (not exercised here; format verified via signature)

# Watch-only wallet: public key only, from an SS58 address
watch = Wallet(name="watch-only", path=TEST_PATH)
watch.regenerate_coldkeypub(ss58_address=w1.coldkey.ss58_address)
print("watch-only coldkeypub:", watch.coldkeypub.ss58_address)
assert watch.coldkeypub.ss58_address == w1.coldkey.ss58_address
assert not watch.coldkey_file.exists_on_device()
print("watch-only has no private coldkey file: True")

# Module-level helper equivalent
w4 = wallets.regen_coldkey(mnemonic, name="restored-helper", use_password=False, path=TEST_PATH)
assert w4.coldkey.ss58_address == w1.coldkey.ss58_address
print("wallets.regen_coldkey matches: True")

shutil.rmtree(TEST_PATH)
print("PASS 04")
