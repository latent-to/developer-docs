"""Introspect the v11 wallet API surface before writing docs."""
import inspect

import bittensor
print("bittensor version:", bittensor.__version__)

print("\n--- top-level: Keypair/Keyfile/Wallet exports? ---")
for name in ("Keypair", "Keyfile", "Wallet", "wallet", "wallets", "keyfiles"):
    print(f"bittensor.{name}:", getattr(bittensor, name, "<MISSING>"))

from bittensor.wallet import Wallet
print("\n--- bittensor.wallet module contents ---")
import bittensor.wallet as wmod
print([n for n in dir(wmod) if not n.startswith("_")])

print("\n--- Wallet public attrs ---")
print([n for n in dir(Wallet) if not n.startswith("_")])

print("\n--- Wallet.__init__ signature ---")
try:
    print(inspect.signature(Wallet.__init__))
except (ValueError, TypeError) as e:
    print("no python signature:", e)
    print(Wallet.__init__.__doc__)

print("\n--- bittensor.wallets helpers ---")
import bittensor.wallets as whelpers
print([n for n in dir(whelpers) if not n.startswith("_")])

print("\n--- bittensor.keyfiles ---")
import bittensor.keyfiles as kf
print([n for n in dir(kf) if not n.startswith("_")])
print("\nKeyfile attrs:", [n for n in dir(kf.Keyfile) if not n.startswith("_")])

print("\n--- where does Keypair live? ---")
w_kp = getattr(wmod, "Keypair", None)
print("bittensor.wallet.Keypair:", w_kp)
try:
    import bittensor.keypair as kpm
    print("bittensor.keypair module:", [n for n in dir(kpm) if not n.startswith("_")])
except ImportError as e:
    print("no bittensor.keypair:", e)
try:
    from bittensor_wallet import Keypair as BWKeypair
    print("bittensor_wallet still importable, Keypair:", BWKeypair)
except ImportError as e:
    print("bittensor_wallet not importable:", e)
