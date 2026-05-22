---
title: "Wallet and Keyfile"
---

# Wallet and Keyfile

The `Wallet` class represents a named Bittensor wallet on disk. It manages a coldkey, hotkey, and their corresponding public-key files, and provides access to the underlying `Keypair` objects.

```python
from bittensor_wallet import Wallet, CRYPTO_ED25519, CRYPTO_SR25519
```

For the `btcli` equivalents of these operations, see [Creating/Importing a Bittensor Wallet](../working-with-keys.md). For background on coldkeys and hotkeys, see [Wallets, Coldkeys and Hotkeys](../wallets.md).

## Wallet structure on disk

A wallet is stored under `~/.bittensor/wallets/` by default:

```
~/.bittensor/wallets/
└── my-wallet/
    ├── coldkey              # password-encrypted coldkey
    ├── coldkeypub.txt       # unencrypted coldkey public key
    └── hotkeys/
        └── default          # hotkey (unencrypted by default)
```

Each file is a `Keyfile`. The coldkey is encrypted at rest by default; the hotkey is not.

## Creating a wallet

```python
wallet = Wallet()                      # uses name="default", hotkey="default"
wallet = Wallet(name="my-wallet")
wallet = Wallet(name="my-wallet", hotkey="validator-hotkey", path="/custom/path")
```

`Wallet(...)` only constructs the object — it does not create keys or touch disk.

### Generate new keys

```python
wallet.create()   # generates new coldkey and hotkey, prompts for coldkey password
```

```python
wallet.create_if_non_existent()   # only creates if the keys don't already exist
```

To create ED25519 keys instead of the default SR25519:

```python
wallet.create(
    coldkey_crypto_type=CRYPTO_ED25519,
    hotkey_crypto_type=CRYPTO_ED25519,
)
```

To suppress interactive prompts and skip password encryption (for scripts/automation):

```python
wallet.create(
    coldkey_use_password=False,
    hotkey_use_password=False,
    overwrite=False,
    suppress=True,
)
```

The same `coldkey_crypto_type` / `hotkey_crypto_type` parameters are available on `create_if_non_existent()` and `recreate()`.

### Generate keys separately

```python
wallet.new_coldkey(n_words=24, use_password=True)                        # SR25519 (default)
wallet.new_coldkey(n_words=24, use_password=True, crypto_type=CRYPTO_ED25519)

wallet.new_hotkey(n_words=12, use_password=False)                        # SR25519 (default)
wallet.new_hotkey(n_words=12, use_password=False, crypto_type=CRYPTO_ED25519)
```

`create_new_coldkey()` and `create_new_hotkey()` accept the same `crypto_type` parameter.

### Regenerate from a mnemonic

```python
wallet.regenerate_coldkey(mnemonic="word1 word2 ... word12")
wallet.regenerate_hotkey(mnemonic="word1 word2 ... word12")
```

Regenerate from a seed or JSON export:

```python
wallet.regenerate_coldkey(seed=b"...")
wallet.regenerate_coldkey(json='{"encoded": "...", ...}')
```

All `regenerate_*` methods accept a `crypto_type` parameter. Use it when recovering a key that was originally created as ED25519:

```python
wallet.regenerate_coldkey(mnemonic="word1 word2 ... word12", crypto_type=CRYPTO_ED25519)
wallet.regenerate_hotkey(mnemonic="word1 word2 ... word12", crypto_type=CRYPTO_ED25519)
wallet.regenerate_coldkeypub(ss58_address="5FHneW46...", crypto_type=CRYPTO_ED25519)
```

## Accessing keys

The four key properties return `Keypair` objects. They require the wallet to exist on disk.

```python
wallet.coldkey       # Keypair with private key (will prompt for password if encrypted)
wallet.coldkeypub    # Keypair with public key only (never prompts)
wallet.hotkey        # Keypair with private key
wallet.hotkeypub     # Keypair with public key only
```

For programmatic access without prompts, use the `get_*` methods:

```python
kp = wallet.get_coldkey(password="my-password")
kp = wallet.get_coldkeypub()
kp = wallet.get_hotkey(password=None)  # hotkey is unencrypted by default
```

### Unlocking explicitly

```python
wallet.unlock_coldkey()     # prompts for password, caches the decrypted keypair
wallet.unlock_hotkey()
```

After `unlock_coldkey()`, subsequent access to `wallet.coldkey` does not re-prompt.

## Keyfile

The `Keyfile` class manages a single key file — it handles reading, writing, and password-based at-rest encryption. You typically access it through wallet properties rather than constructing it directly.

```python
wallet.coldkey_file    # Keyfile for the coldkey
wallet.hotkey_file     # Keyfile for the hotkey
wallet.coldkeypub_file
wallet.hotkeypub_file
```

### Crypto type persistence

Keyfiles serialize and restore the `cryptoType` field. A keypair written to disk with `crypto_type=CRYPTO_ED25519` will be deserialized as ED25519 — you don't need to specify the type again when loading an existing key.

### At-rest encryption

```python
wallet.coldkey_file.encrypt(password="my-password")
wallet.coldkey_file.decrypt(password="my-password")
```

This is distinct from keypair-level message encryption. Keyfile encryption protects the private key on disk using a symmetric password-derived key (NaCl secretbox). See [Encrypt and decrypt](./encrypt-decrypt) for asymmetric message encryption.

### Storing the coldkey password in an environment variable

For automated environments where interactive prompts are not possible:

```python
wallet.coldkey_file.save_password_to_env("my-password")
```

The SDK will read the password from the environment variable `BT_WALLET_<NAME>_COLDKEY_PASSWORD` (uppercased wallet name) when unlocking.

You can also pass it directly at wallet creation:

```python
wallet.create(coldkey_use_password=True, coldkey_password="my-password", suppress=True)
```

## Setting keys programmatically

To assign an existing `Keypair` to a wallet slot:

```python
kp = Keypair.create_from_mnemonic(mnemonic)

wallet.set_coldkey(kp, encrypt=True, overwrite=False)
wallet.set_hotkey(kp, encrypt=False, overwrite=False)
wallet.set_coldkeypub(kp)
wallet.set_hotkeypub(kp)
```

## Create from a URI (development/testing)

```python
wallet.create_coldkey_from_uri("//Alice", use_password=False)
wallet.create_coldkey_from_uri("//Alice", use_password=False, crypto_type=CRYPTO_ED25519)

wallet.create_hotkey_from_uri("//Bob", use_password=False)
wallet.create_hotkey_from_uri("//Bob", use_password=False, crypto_type=CRYPTO_ED25519)
```

:::warning
URI-based keys like `//Alice` are deterministic and publicly known. Use them only on local devnets or testnets, never with real funds.
:::

## Error conditions

| Situation | Exception |
|---|---|
| `Keyfile.decrypt` or `get_keypair` called with wrong password | `KeyFileError: Decryption error: Wrong password for decryption.` |
| Accessing `wallet.coldkey` when key file does not exist on disk | `KeyFileError` |
| `set_coldkey` / `set_hotkey` with `overwrite=False` when key already exists | `KeyFileError` |
| `regenerate_coldkey` with `overwrite=False` when key already exists | `KeyFileError` |

## Full runnable example

```python
import tempfile
import shutil
from bittensor_wallet import Wallet, Keypair
from bittensor_wallet.keyfile import (
    serialized_keypair_to_keyfile_data,
    deserialize_keypair_from_keyfile_data,
    encrypt_keyfile_data,
    decrypt_keyfile_data,
    keyfile_data_is_encrypted,
    keyfile_data_encryption_method,
)

WALLET_PATH = tempfile.mkdtemp(prefix="btwallet-test-")

# --- Wallet init ---
w = Wallet(name="alice", hotkey="default", path=WALLET_PATH)
w.create_if_non_existent(coldkey_use_password=False, hotkey_use_password=False, suppress=True)

print(w)
print(f"coldkey SS58:  {w.coldkey.ss58_address}")
print(f"coldkey type:  {'SR25519' if w.coldkey.crypto_type == 1 else 'ED25519'}")
print(f"hotkey SS58:   {w.hotkey.ss58_address}")

# --- Keyfile state ---
print(f"is_encrypted (no password): {w.coldkey_file.is_encrypted()}")

# --- Keyfile encrypt / decrypt ---
w.coldkey_file.encrypt(password="hunter2")
print(f"is_encrypted after encrypt: {w.coldkey_file.is_encrypted()}")
print(f"encryption_method:          {keyfile_data_encryption_method(w.coldkey_file.data)}")
w.coldkey_file.decrypt(password="hunter2")
print(f"is_encrypted after decrypt: {w.coldkey_file.is_encrypted()}")

# --- Serialization roundtrip ---
raw = serialized_keypair_to_keyfile_data(w.coldkey)
restored = deserialize_keypair_from_keyfile_data(raw)
assert restored.ss58_address == w.coldkey.ss58_address

# --- encrypt_keyfile_data / decrypt_keyfile_data ---
enc = encrypt_keyfile_data(raw, password="s3cr3t")
dec = decrypt_keyfile_data(enc, password="s3cr3t")
assert deserialize_keypair_from_keyfile_data(dec).ss58_address == w.coldkey.ss58_address
print(f"keyfile_data_is_encrypted: {keyfile_data_is_encrypted(enc)}")

# --- regenerate_coldkey: deterministic ---
mnemonic = Keypair.generate_mnemonic()
w2 = Wallet(name="bob", hotkey="default", path=WALLET_PATH)
w3 = Wallet(name="bob-copy", hotkey="default", path=WALLET_PATH)
w2.regenerate_coldkey(mnemonic=mnemonic, use_password=False, overwrite=True, suppress=True)
w3.regenerate_coldkey(mnemonic=mnemonic, use_password=False, overwrite=True, suppress=True)
assert w2.coldkey.ss58_address == w3.coldkey.ss58_address
print(f"Same mnemonic → same coldkey: {w2.coldkey.ss58_address}")

# --- regenerate_coldkeypub from ss58 ---
w.regenerate_coldkeypub(ss58_address=w.coldkey.ss58_address, overwrite=True)
print(f"coldkeypub SS58: {w.coldkeypub.ss58_address}")

# --- set_coldkey / set_hotkey ---
new_kp = Keypair.create_from_mnemonic(Keypair.generate_mnemonic())
w.set_coldkey(new_kp, encrypt=False, overwrite=True)
print(f"set_coldkey → new SS58: {w.coldkey.ss58_address}")

# --- Dev key (//Alice) ---
w_dev = Wallet(name="dev", hotkey="default", path=WALLET_PATH)
w_dev.create_coldkey_from_uri("//Alice", use_password=False, overwrite=True, suppress=True)
print(f"//Alice SS58: {w_dev.coldkey.ss58_address}")

# --- Error: wrong password ---
w.coldkey_file.encrypt(password="correct")
try:
    w.coldkey_file.get_keypair(password="wrong")
except Exception as e:
    print(f"{type(e).__name__}: {e}")
w.coldkey_file.decrypt(password="correct")

shutil.rmtree(WALLET_PATH)
print("All assertions passed.")
```

```
Wallet (Name: 'alice', Hotkey: 'default', Path: '/tmp/btwallet-test-...')
coldkey SS58:  5CXy6RkRGWYFadcdf39stZgi69J1EpgTztMYGV2Qh9nEju4A
coldkey type:  SR25519
hotkey SS58:   5CM46xcEGhag8UQwH65PcvsZxkj2JitGtWnmMoG22iVAFLxh
is_encrypted (no password): False
is_encrypted after encrypt: True
encryption_method:          NaCl
is_encrypted after decrypt: False
keyfile_data_is_encrypted: True
Same mnemonic → same coldkey: 5CSp9wwYt5mwnjzLhq1ctJ6jgDLB8LXiCpsRgUatV2PTkZtt
coldkeypub SS58: 5CXy6RkRGWYFadcdf39stZgi69J1EpgTztMYGV2Qh9nEju4A
set_coldkey → new SS58: 5FFBEQCciyibS3DcsA8NtQ4qXYbGshpPj4QLJG64dbN4QJRR
//Alice SS58: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
KeyFileError: Decryption error: Wrong password for decryption.
All assertions passed.
```
