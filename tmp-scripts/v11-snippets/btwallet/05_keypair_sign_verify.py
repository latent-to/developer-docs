"""Verify: Keypair creation, properties, sign/verify; wallets.sign_message/verify_message.

Doc snippets: 'Keypairs' section.
"""
import shutil

TEST_PATH = "/tmp/v11-wallet-test/05"
shutil.rmtree(TEST_PATH, ignore_errors=True)

from bittensor.wallet import Wallet, Keypair
from bittensor import wallets

# Standalone keypair from a fresh mnemonic
mnemonic = Keypair.generate_mnemonic()
kp = Keypair.create_from_mnemonic(mnemonic)
print("ss58:       ", kp.ss58_address)
print("public key: ", bytes(kp.public_key).hex())
print("crypto type:", kp.crypto_type, "(1 = SR25519)")
print("ss58 format:", kp.ss58_format)

# Dev keypair from a well-known URI (test networks only)
alice = Keypair.create_from_uri("//Alice")
print("//Alice:", alice.ss58_address)
assert alice.ss58_address == "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

# From a seed
kp_seed = Keypair.create_from_seed(bytes.fromhex("ab" * 32))
print("from seed:", kp_seed.ss58_address)

# Sign and verify
signature = kp.sign(b"my message")
print("signature bytes:", len(bytes(signature)))
print("verified:", kp.verify(b"my message", signature))
assert kp.verify(b"my message", signature)
assert not kp.verify(b"a different message", signature)
print("tampered message verifies:", kp.verify(b"a different message", signature))

# Verify against a public-key-only keypair (all a verifier needs is the address)
verifier = Keypair(ss58_address=kp.ss58_address)
assert verifier.verify(b"my message", signature)
print("verified with address only:", verifier.verify(b"my message", signature))

# Wallet keys are Keypair objects too
w = Wallet(name="signer", path=TEST_PATH)
w.create_new_coldkey(use_password=False, suppress=True)
w.create_new_hotkey(suppress=True)
sig2 = w.hotkey.sign(b"signed by my hotkey")
assert w.hotkey.verify(b"signed by my hotkey", sig2)
print("hotkey sign/verify: True")

# One-call helpers: wallets.sign_message / wallets.verify_message
result = wallets.sign_message("prove I control this hotkey",
                              name="signer", hotkey="default", use="hotkey", path=TEST_PATH)
print("sign_message:", result["ss58"], result["signature"][:20] + "...")
ok = wallets.verify_message("prove I control this hotkey", result["signature"], result["ss58"])
print("verify_message:", ok)
assert ok

# Coldkey signing with a password, non-interactively
w2 = Wallet(name="enc-signer", path=TEST_PATH)
w2.create_new_coldkey(coldkey_password="hunter2-test", suppress=True)
res2 = wallets.sign_message("coldkey-signed", name="enc-signer",
                            use="coldkey", password="hunter2-test", path=TEST_PATH)
assert wallets.verify_message("coldkey-signed", res2["signature"], res2["ss58"])
print("encrypted coldkey sign via password arg: True")

shutil.rmtree(TEST_PATH)
print("PASS 05")
