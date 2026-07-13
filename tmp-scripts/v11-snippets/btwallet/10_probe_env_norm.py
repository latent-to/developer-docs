"""Probe: how does native get_password_from_environment normalize names?"""
import os
import subprocess
import sys

name = "BT_PW__TMP_V11-WALLET-TEST_07_VAULT_COLDKEY"
under = name.replace("-", "_")

code = (
    "from bittensor.keyfiles import get_password_from_environment as g\n"
    f"print('hyphen-name lookup:', g({name!r}))\n"
    f"print('underscore-name lookup:', g({under!r}))\n"
)
for label, env_name in [("set-hyphen", name), ("set-underscore", under)]:
    proc = subprocess.run(
        [sys.executable, "-c", code],
        env={**os.environ, env_name: "pw123"},
        capture_output=True, text=True,
    )
    print(f"--- {label} ---")
    print(proc.stdout, proc.stderr[:200])
