"""Verify: Keyfile access, at-rest encryption, non-interactive unlock paths,
env vars, and error conditions.

Doc snippets: 'Keyfiles and at-rest encryption' section.
"""
import os
import shutil
import subprocess
import sys

TEST_PATH = "/tmp/v11-wallet-test/07"
shutil.rmtree(TEST_PATH, ignore_errors=True)

from bittensor.wallet import Wallet, Keypair
from bittensor import wallets
from bittensor.keyfiles import Keyfile, KeyfileError, WrongPasswordError

w = Wallet(name="vault", path=TEST_PATH)
w.create_new_coldkey(coldkey_password="hunter2-test", suppress=True)
w.create_new_hotkey(suppress=True)

# Keyfile handles
print(repr(w.coldkey_file))
print("coldkey encrypted:", w.coldkey_file.is_encrypted())
print("hotkey encrypted: ", w.hotkey_file.is_encrypted())

# Programmatic unlock with an explicit password (no prompt)
kp = w.get_coldkey(password="hunter2-test")
print("unlocked:", kp.ss58_address)

# Wrong password
w_fresh = Wallet(name="vault", path=TEST_PATH)
try:
    w_fresh.get_coldkey(password="wrong-password")
    raise AssertionError("should have raised")
except Exception as e:
    print("wrong password ->", type(e).__name__, "-", e)
    print("  is WrongPasswordError:", isinstance(e, WrongPasswordError))
    print("  is KeyfileError:", isinstance(e, KeyfileError))

# Missing keyfile
ghost = Wallet(name="ghost", path=TEST_PATH)
try:
    ghost.coldkey
    raise AssertionError("should have raised")
except Exception as e:
    print("missing keyfile ->", type(e).__name__, "-", e)

# Overwrite refusal (non-interactive)
try:
    w_fresh.create_new_coldkey(use_password=False, suppress=True)  # overwrite=False default
    raise AssertionError("should have raised")
except Exception as e:
    print("overwrite refused ->", type(e).__name__, "-", str(e)[:80])

# Per-keyfile password cache for the current process: save_password_to_env.
# The BT_PW_<path> variable it sets holds an obfuscated encoding at the native
# level; it is not a plaintext variable users can export themselves.
name = w.coldkey_file.env_var_name()
print("env_var_name:", name)
w.coldkey_file.save_password_to_env("hunter2-test")
w_cached = Wallet(name="vault", path=TEST_PATH)
print("unlock after save_password_to_env:", w_cached.coldkey.ss58_address == kp.ss58_address)
assert w_cached.coldkey.ss58_address == kp.ss58_address

# Documented cross-process pattern: BT_WALLET_PASSWORD + resolve_wallet_password
code_resolve = (
    "from bittensor import wallets\n"
    f"w = wallets.open_wallet('vault', path={TEST_PATH!r})\n"
    "pwd = wallets.resolve_wallet_password(w)\n"
    "print('resolved unlock', w.get_coldkey(password=pwd).ss58_address)\n"
)
proc_r = subprocess.run(
    [sys.executable, "-c", code_resolve],
    env={**os.environ, "BT_WALLET_PASSWORD": "hunter2-test"},
    capture_output=True, text=True, stdin=subprocess.DEVNULL,
)
print("resolve_wallet_password run:", proc_r.stdout.strip(), proc_r.stderr.strip()[:100])
assert proc_r.returncode == 0 and kp.ss58_address in proc_r.stdout

# BT_WALLET_PASSWORD: consumed by the wallets.* helpers (subprocess so env is clean)
code = (
    "from bittensor import wallets\n"
    f"r = wallets.sign_message('env unlock', name='vault', use='coldkey', path={TEST_PATH!r})\n"
    "print('signed by', r['ss58'])\n"
)
proc = subprocess.run(
    [sys.executable, "-c", code],
    env={**os.environ, "BT_WALLET_PASSWORD": "hunter2-test"},
    capture_output=True, text=True, stdin=subprocess.DEVNULL,
)
print("BT_WALLET_PASSWORD run:", proc.stdout.strip(), proc.stderr.strip()[:100])
assert proc.returncode == 0

# BT_WALLET_PASSWORD_FILE
pwfile = os.path.join(TEST_PATH, "pw.txt")
with open(pwfile, "w") as f:
    f.write("hunter2-test\n")
proc2 = subprocess.run(
    [sys.executable, "-c", code],
    env={**os.environ, "BT_WALLET_PASSWORD_FILE": pwfile},
    capture_output=True, text=True, stdin=subprocess.DEVNULL,
)
print("BT_WALLET_PASSWORD_FILE run:", proc2.stdout.strip(), proc2.stderr.strip()[:100])
assert proc2.returncode == 0

# NOTE: bare `wallet.coldkey` does NOT read BT_WALLET_PASSWORD (only BT_PW_<path>);
# confirm so the docs state it accurately.
code_bare = (
    "from bittensor.wallet import Wallet\n"
    f"w = Wallet(name='vault', path={TEST_PATH!r})\n"
    "print(w.coldkey.ss58_address)\n"
)
proc3 = subprocess.run(
    [sys.executable, "-c", code_bare],
    env={**os.environ, "BT_WALLET_PASSWORD": "hunter2-test"},
    capture_output=True, text=True, stdin=subprocess.DEVNULL,
)
print("bare wallet.coldkey with only BT_WALLET_PASSWORD -> returncode", proc3.returncode,
      "|", (proc3.stdout + proc3.stderr).strip()[:120])

# Keyfile primitives: set_keypair / get_keypair on a standalone keyfile
standalone = Keyfile(os.path.join(TEST_PATH, "standalone-key"))
kp_new = Keypair.create_from_mnemonic(Keypair.generate_mnemonic())
standalone.set_keypair(kp_new, encrypt=True, password="s3cr3t-test")
restored = standalone.get_keypair(password="s3cr3t-test")
assert restored.ss58_address == kp_new.ss58_address
print("standalone keyfile roundtrip: True")

shutil.rmtree(TEST_PATH)
print("PASS 07")
