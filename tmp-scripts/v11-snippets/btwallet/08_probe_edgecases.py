"""Probe: (a) does encrypt_for reliably reject SR25519 addresses, or only sometimes?
(b) what env var name does save_password_to_env actually use?
"""
import os

from bittensor.wallet import Keypair
from bittensor.keyfiles import Keyfile

# (a) 200 random SR25519 addresses: how many raise on encrypt_for?
raised = 0
silent = 0
for _ in range(200):
    sr = Keypair.create_from_mnemonic(Keypair.generate_mnemonic())
    try:
        Keypair.encrypt_for(sr.ss58_address, b"probe")
        silent += 1
    except ValueError:
        raised += 1
print(f"encrypt_for on SR25519 addresses: raised={raised} silent-success={silent}")

# (b) env var naming with a hyphenated path
kf = Keyfile("/tmp/v11-wallet-test/08/my-vault/coldkey")
print("env_var_name():", kf.env_var_name())
before = set(os.environ)
kf.save_password_to_env("pw-test")
new = set(os.environ) - before
print("actually set:", new)
for n in new:
    os.environ.pop(n, None)

# and with a plain path (no hyphens)
kf2 = Keyfile(os.path.expanduser("~/.bittensor/wallets/alice/coldkey"))
print("plain env_var_name():", kf2.env_var_name())
