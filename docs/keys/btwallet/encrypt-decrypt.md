---
title: "Encrypt and decrypt"
---

# Encrypt and decrypt

The Bittensor Wallet SDK supports asymmetric message encryption on `Keypair` objects. This lets one party encrypt a message to a recipient using only their public key; only the recipient's private key can decrypt it.

:::info ED25519 only
`encrypt` and `decrypt` require **ED25519 keypairs** (`crypto_type=0`). SR25519 keypairs will raise a `ValueError`. This is a cryptographic constraint: SR25519 keys cannot be converted to X25519 for sealed-box encryption. If you're building a feature that uses encryption, generate your keypairs with `crypto_type=0`.
:::

## How it works

Encryption uses a **NaCl sealed box** (libsodium): the ED25519 public key is converted to X25519, and the message is encrypted with XSalsa20-Poly1305 using an ephemeral sender key. The sender's identity is not included in the ciphertext.

- Encrypting requires only the recipient's **public key**.
- Decrypting requires the recipient's **private key**.
- Each call to `encrypt` produces a different ciphertext (randomized nonce), even for the same message.
- The ciphertext is always exactly 48 bytes longer than the plaintext (sealed box overhead: 32-byte ephemeral public key + 16-byte MAC).

## Basic roundtrip

```python
from bittensor_wallet import Keypair

# Alice creates an ED25519 keypair
alice = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=0)

# Encrypt a message for Alice (needs only her public key)
ciphertext = alice.encrypt(b"a secret message")

# Decrypt (requires Alice's private key)
plaintext = alice.decrypt(ciphertext)
assert plaintext == b"a secret message"
```

## Encrypt for a remote participant

The most common real-world pattern: you know someone's SS58 address but don't have their full keypair object.

```python
from bittensor_wallet import Keypair

recipient_address = "5FHneW46..."  # recipient's SS58 address (must be an ED25519 key)

# Encrypt using only the address — no private key needed on the sender side
ciphertext = Keypair.encrypt_for(recipient_address, b"message for recipient")
```

The recipient decrypts with their own keypair:

```python
# On the recipient's machine
from bittensor_wallet import Wallet

wallet = Wallet("my-wallet")
plaintext = wallet.hotkey.decrypt(ciphertext)
```

Or with a bare keypair:

```python
recipient = Keypair.create_from_mnemonic(my_mnemonic, crypto_type=0)
plaintext = recipient.decrypt(ciphertext)
```

:::warning
`encrypt_for` assumes the SS58 address belongs to an ED25519 keypair (`crypto_type=0`). Passing an SR25519 address will produce a ciphertext, but the intended recipient's SR25519 private key cannot decrypt it. Both parties must be using ED25519 for this to work end-to-end.
:::

## Alice encrypts for Bob

A full two-party example using wallet hotkeys:

```python
from bittensor_wallet import Keypair, Wallet

# Bob's wallet — his hotkey must be ED25519
bob = Wallet("bob")
bob_address = bob.hotkey.ss58_address

# Alice encrypts a message for Bob (Alice only needs Bob's address)
ciphertext = Keypair.encrypt_for(bob_address, b"hey bob, this is alice")

# --- ciphertext is sent over any channel ---

# Bob decrypts with his private key
plaintext = bob.hotkey.decrypt(ciphertext)
assert plaintext == b"hey bob, this is alice"
```

## Error conditions

| Situation | Error |
|---|---|
| `encrypt` or `decrypt` called on an SR25519 keypair | `ValueError: Encrypt/decrypt is only supported for ED25519 keypairs` |
| `decrypt` called on a public-key-only keypair | `ValueError: Decryption requires a keypair with a private key` |
| `decrypt` called with the wrong private key | `ValueError: Decryption failed: invalid ciphertext or wrong key` |

## Relationship to keyfile encryption

Keyfile encryption (the `Keyfile.encrypt(password)` / `Keyfile.decrypt(password)` API) is a separate, unrelated mechanism. It encrypts the key file at rest on disk using a password-derived symmetric key. The `Keypair.encrypt`/`decrypt` API described on this page encrypts arbitrary message payloads in application code using asymmetric key material. They operate at different layers and serve different purposes.

## Use cases

- Subnet validators securely exchanging configuration or scoring data that should not be visible to observers
- Application-layer private messaging between participants whose ED25519 public keys (SS58 addresses) are known
- Storing sensitive per-hotkey data in a shared location where only the key owner can read it
