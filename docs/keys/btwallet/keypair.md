---
title: "Keypair"
---

# Keypair

A `Keypair` holds a cryptographic key pair and is the core primitive of the Bittensor Wallet SDK. It can be constructed from a mnemonic, seed, URI, or raw key material — and it supports signing, verification, and (for ED25519 keypairs) asymmetric message encryption.

```python
from bittensor_wallet import Keypair, CRYPTO_ED25519, CRYPTO_SR25519
```

The `CRYPTO_ED25519` and `CRYPTO_SR25519` constants are also available from the `bittensor_wallet.keypair` submodule.

## Key types: SR25519 and ED25519

Bittensor supports two key types, selected via the `crypto_type` parameter:

| Constant | Value | Algorithm | Default | Use case |
|---|---|---|---|---|
| `CRYPTO_SR25519` | `1` | SR25519 (Schnorrkel) | Yes | Coldkeys, hotkeys, all on-chain signing |
| `CRYPTO_ED25519` | `0` | ED25519 | No | Message encryption/decryption ([see Encrypt and decrypt](./encrypt-decrypt)) |

SR25519 is the default throughout the SDK. All existing Bittensor wallets use SR25519.

ED25519 is required for `encrypt`/`decrypt`. SR25519 keys cannot be converted to X25519 for sealed-box encryption; ED25519 keys can (this conversion is standardized in libsodium).

## Creating keypairs

### From a URI (development/testing)

URI-based keypairs use well-known derivation paths and are suitable for local development and test networks only.

```python
kp = Keypair.create_from_uri("//Alice")                            # SR25519 (default)
kp = Keypair.create_from_uri("//Alice", crypto_type=CRYPTO_ED25519)  # ED25519
```

:::warning
URI-based keypairs like `//Alice` are deterministic and publicly known. Never use them with real funds.
:::

### From a mnemonic

```python
mnemonic = Keypair.generate_mnemonic()                                    # 12-word mnemonic
kp = Keypair.create_from_mnemonic(mnemonic)                               # SR25519 (default)
kp = Keypair.create_from_mnemonic(mnemonic, crypto_type=CRYPTO_ED25519)   # ED25519
```

Generate a 24-word mnemonic:

```python
mnemonic = Keypair.generate_mnemonic(n_words=24)
```

### From a seed

```python
kp = Keypair.create_from_seed(b"\xab\xcd\xef...")                              # SR25519 (default)
kp = Keypair.create_from_seed(b"\xab\xcd\xef...", crypto_type=CRYPTO_ED25519)  # ED25519
```

### From a private key

```python
kp = Keypair.create_from_private_key("0x...", crypto_type=CRYPTO_SR25519)
```

### From an encrypted JSON backup

Substrate-compatible JSON key exports (e.g., from Polkadot.js) can be imported directly:

```python
with open("key-backup.json") as f:
    kp = Keypair.create_from_encrypted_json(f.read(), passphrase="your-passphrase")
```

### Public-key only

When you only need to identify or address a participant (e.g., to encrypt a message for them), you can construct a keypair from just an SS58 address. Signing and decryption require the private key.

```python
kp = Keypair(ss58_address="5FHneW46...", crypto_type=0)
```

## Properties

```python
kp.ss58_address   # SS58-encoded public address
kp.public_key     # raw public key bytes, or None if not loaded
kp.crypto_type    # CRYPTO_ED25519 (0) or CRYPTO_SR25519 (1)
kp.ss58_format    # SS58 network format (default: 42)
```

## Signing and verification

```python
kp = Keypair.create_from_mnemonic(mnemonic)

signature = kp.sign(b"my message")          # returns bytes
valid = kp.verify(b"my message", signature)  # returns bool
```

`sign` accepts either `str` or `bytes`. `verify` accepts the same. A signature produced by one keypair can only be verified against the matching public key.

## Next step: encryption

ED25519 keypairs support asymmetric message encryption. See [Encrypt and decrypt](./encrypt-decrypt).
