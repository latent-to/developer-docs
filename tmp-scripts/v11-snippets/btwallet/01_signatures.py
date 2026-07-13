"""Signatures and docstrings of everything to be documented."""
import inspect

from bittensor.wallet import Wallet, Keypair
import bittensor.wallets as ws
import bittensor.keyfiles as kf


def show(obj, name):
    try:
        sig = str(inspect.signature(obj))
    except (ValueError, TypeError):
        sig = "<native, no sig>"
    doc = (inspect.getdoc(obj) or "").strip().split("\n\n")[0]
    print(f"{name}{sig}\n    {doc[:400]}\n")


print("=== Wallet methods ===")
for m in ("create_new_coldkey", "create_new_hotkey", "regenerate_coldkey",
          "regenerate_hotkey", "regenerate_coldkeypub", "regenerate_hotkeypub",
          "get_coldkey", "get_hotkey", "unlock_coldkey", "unlock_hotkey"):
    show(getattr(Wallet, m), f"Wallet.{m}")

print("=== Keypair ===")
print("Keypair attrs:", [n for n in dir(Keypair) if not n.startswith("_")])
for m in ("generate_mnemonic", "create_from_mnemonic", "create_from_seed",
          "create_from_uri", "create_from_private_key", "create_from_encrypted_json",
          "sign", "verify", "encrypt", "decrypt", "encrypt_for"):
    obj = getattr(Keypair, m, None)
    if obj is None:
        print(f"Keypair.{m}: <MISSING>")
    else:
        show(obj, f"Keypair.{m}")

print("=== wallets helpers ===")
for m in ("create", "open_wallet", "list_wallets", "list_wallets_detailed",
          "new_coldkey", "new_hotkey", "regen_coldkey", "regen_hotkey",
          "regen_coldkey_pub", "regen_hotkey_pub",
          "sign_message", "verify_message", "signing_keypair",
          "encrypt_message", "decrypt_message",
          "resolve_wallet_password", "resolve_key_password"):
    show(getattr(ws, m), f"wallets.{m}")

print("=== Keyfile ===")
show(kf.Keyfile.__init__, "Keyfile.__init__")
for m in ("get_keypair", "set_keypair", "is_encrypted", "env_var_name",
          "save_password_to_env", "remove_password_from_env", "exists_on_device"):
    show(getattr(kf.Keyfile, m), f"Keyfile.{m}")
for m in ("encrypt_keyfile_data", "decrypt_keyfile_data",
          "serialized_keypair_to_keyfile_data", "deserialize_keypair_from_keyfile_data",
          "keyfile_data_is_encrypted", "get_password_from_environment",
          "save_password_to_environment", "resolve_key_password"):
    show(getattr(kf, m), f"keyfiles.{m}")
