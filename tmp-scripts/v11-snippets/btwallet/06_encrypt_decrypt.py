"""Verify: ED25519 message encryption on Keypair, and the wallets.encrypt_message /
decrypt_message helpers.

Doc snippets: 'Message encryption' section.
"""
import shutil

TEST_PATH = "/tmp/v11-wallet-test/06"
shutil.rmtree(TEST_PATH, ignore_errors=True)

from bittensor.wallet import Wallet, Keypair
from bittensor import wallets
from bittensor.wallets import CRYPTO_ED25519

# Both parties deliberately create ED25519 keypairs (crypto_type=0)
alicia = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=CRYPTO_ED25519)
bobby = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=CRYPTO_ED25519)

# Encrypt to self: needs only the public key, decrypt needs the private key
ciphertext = alicia.encrypt(b"a secret message")
assert bytes(alicia.decrypt(ciphertext)) == b"a secret message"
print("roundtrip ok, ciphertext overhead:", len(bytes(ciphertext)) - len(b"a secret message"))

# Encrypt for someone else, addressed by SS58
ciphertext2 = Keypair.encrypt_for(bobby.ss58_address, b"hey bobby, this is alicia")
assert bytes(bobby.decrypt(ciphertext2)) == b"hey bobby, this is alicia"
print("encrypt_for ok")

# Randomized: same plaintext, different ciphertext each call
assert bytes(alicia.encrypt(b"same message")) != bytes(alicia.encrypt(b"same message"))
print("randomized nonce ok")

# SR25519 keypairs cannot encrypt or decrypt
sr = Keypair.create_from_mnemonic(Keypair.generate_mnemonic())  # default SR25519
try:
    sr.encrypt(b"this will fail")
    raise AssertionError("should have raised")
except ValueError as e:
    print("SR25519 encrypt ->", type(e).__name__, "-", e)

# Wrong key cannot decrypt
try:
    bobby.decrypt(alicia.encrypt(b"for alicia only"))
    raise AssertionError("should have raised")
except ValueError as e:
    print("wrong key ->", type(e).__name__, "-", e)

# encrypt_for with an SR25519 address fails loudly? (check reality)
try:
    Keypair.encrypt_for(sr.ss58_address, b"probe")
    print("encrypt_for(SR25519 address): SUCCEEDED (silent, undecryptable)")
except ValueError as e:
    print("encrypt_for(SR25519 address) ->", type(e).__name__, "-", e)

# Wallet-level helpers: wallet whose coldkey is ED25519
w = Wallet(name="ed-wallet", path=TEST_PATH)
w.create_new_coldkey(use_password=False, suppress=True, crypto_type=CRYPTO_ED25519)

sealed = wallets.encrypt_message("meet at the usual block height", w.coldkey.ss58_address)
print("encrypt_message:", sealed["ciphertext"][:22] + "...")
plain = wallets.decrypt_message(sealed["ciphertext"], name="ed-wallet", path=TEST_PATH)
print("decrypt_message:", plain)
assert plain == "meet at the usual block height"

# Helper refuses SR25519 recipients with a clear error
w_sr = Wallet(name="sr-wallet", path=TEST_PATH)
w_sr.create_new_coldkey(use_password=False, suppress=True)
try:
    wallets.encrypt_message("nope", w_sr.coldkey.ss58_address)
    raise AssertionError("should have raised")
except ValueError as e:
    print("encrypt_message(SR25519) ->", type(e).__name__, "-", str(e)[:120])

shutil.rmtree(TEST_PATH)
print("PASS 06")
