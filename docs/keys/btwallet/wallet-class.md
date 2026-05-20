---
title: "Wallet and Keyfile"
---

# Wallet and Keyfile

The `Wallet` class represents a named Bittensor wallet on disk. It manages a coldkey, hotkey, and their corresponding public-key files, and provides access to the underlying `Keypair` objects.

```python
from bittensor_wallet import Wallet, CRYPTO_ED25519, CRYPTO_SR25519
```

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
