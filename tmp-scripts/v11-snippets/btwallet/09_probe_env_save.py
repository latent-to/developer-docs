"""Probe: does save_password_to_env actually enable unlock, even though
os.environ does not show it (native-level setenv)?"""
import os
import shutil

TEST_PATH = "/tmp/v11-wallet-test/09"
shutil.rmtree(TEST_PATH, ignore_errors=True)

from bittensor.wallet import Wallet
from bittensor.keyfiles import get_password_from_environment

w = Wallet(name="vault", path=TEST_PATH)
w.create_new_coldkey(coldkey_password="hunter2-test", suppress=True)

name = w.coldkey_file.env_var_name()
returned = w.coldkey_file.save_password_to_env("hunter2-test")
print("save_password_to_env returned:", returned)
print("visible in os.environ:", name in os.environ, returned in os.environ)
print("native get_password_from_environment:", get_password_from_environment(name))

# Fresh wallet object: does property access unlock without prompting?
w2 = Wallet(name="vault", path=TEST_PATH)
print("unlocked via saved env password:", w2.coldkey.ss58_address)

w.coldkey_file.remove_password_from_env()
print("after remove, native lookup:", get_password_from_environment(name))

shutil.rmtree(TEST_PATH)
print("PASS 09")
