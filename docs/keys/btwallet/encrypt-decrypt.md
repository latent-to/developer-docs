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

## Basic example

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

:::danger This does not work with standard Bittensor wallets
Standard Bittensor coldkeys and hotkeys are **SR25519** by default. `encrypt_for` accepts an SS58 address string but cannot verify the key type from the address alone — it assumes ED25519. If you pass an SR25519 address, it will silently produce a ciphertext that the recipient can **never decrypt**. This API is **not** for encrypting to an arbitrary Bittensor participant's existing wallet address.

To use `encrypt` / `decrypt` / `encrypt_for`, both parties must have deliberately created ED25519 keypairs (`crypto_type=0`) for this purpose.
:::

`encrypt` is an instance method — it encrypts to the calling keypair's own public key. To encrypt to someone else, use the static method `encrypt_for`, passing the recipient's SS58 address. Both must be ED25519 keypairs.

```python
from bittensor_wallet import Keypair

# Both parties must have created their keypairs with crypto_type=0
recipient_address = "5FHneW46..."  # must be an ED25519 keypair's address, not a standard wallet address

ciphertext = Keypair.encrypt_for(recipient_address, b"message for recipient")
```

The recipient decrypts with their ED25519 keypair:

```python
recipient = Keypair.create_from_mnemonic(my_mnemonic, crypto_type=0)
plaintext = recipient.decrypt(ciphertext)
```

### Example: Alice encrypts for Bob to decrypt


```python
from bittensor_wallet import Keypair

# Both parties created ED25519 keypairs explicitly (crypto_type=0)
alice = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=0)
bob = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=0)

# Alice encrypts using only Bob's SS58 address
ciphertext = Keypair.encrypt_for(bob.ss58_address, b"hey bob, this is alice")

# Bob decrypts with his private key
plaintext = bob.decrypt(ciphertext)
assert plaintext == b"hey bob, this is alice"
```

## Error conditions

| Situation | Error |
|---|---|
| `encrypt` or `decrypt` called on an SR25519 keypair | `ValueError: Encrypt/decrypt is only supported for ED25519 keypairs` |
| `decrypt` called on a public-key-only keypair | `ValueError: Decryption requires a keypair with a private key` |
| `decrypt` called with the wrong private key | `ValueError: Decryption failed: invalid ciphertext or wrong key` |


## Full example

```python
from bittensor_wallet import Keypair

# ED25519 keypairs required for all encrypt/decrypt operations
alice = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=0)
bob = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=0)

print("=== Keypairs ===")
print(f"Alice SS58:       {alice.ss58_address}")
print(f"Alice public key: {alice.public_key.hex()}")
print(f"Bob SS58:         {bob.ss58_address}")

print("\n=== Basic roundtrip: encrypt and decrypt to self ===")
ciphertext = alice.encrypt(b"a secret message")
plaintext = alice.decrypt(ciphertext)
print(f"Original:        {b'a secret message'}")
print(f"Ciphertext ({len(ciphertext)} bytes): {ciphertext.hex()}")
print(f"Decrypted:       {plaintext}")
assert plaintext == b"a secret message"

print("\n=== encrypt_for: Alice encrypts to Bob using only his SS58 address ===")
ciphertext2 = Keypair.encrypt_for(bob.ss58_address, b"hey bob, this is alice")
plaintext2 = bob.decrypt(ciphertext2)
print(f"Ciphertext: {ciphertext2.hex()[:48]}...")
print(f"Decrypted:  {plaintext2}")
assert plaintext2 == b"hey bob, this is alice"

print("\n=== Each call to encrypt produces a unique ciphertext (randomized nonce) ===")
c1 = alice.encrypt(b"same message")
c2 = alice.encrypt(b"same message")
assert c1 != c2
print("Different ciphertexts for the same plaintext — confirmed")

print("\n=== Error: SR25519 keypair cannot encrypt ===")
sr_keypair = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=1)
try:
    sr_keypair.encrypt(b"this will fail")
except ValueError as e:
    print(f"ValueError: {e}")

print("\n=== Error: wrong key cannot decrypt ===")
ciphertext3 = alice.encrypt(b"for alice only")
try:
    bob.decrypt(ciphertext3)
except ValueError as e:
    print(f"ValueError: {e}")

print("\n=== Error: public-key-only keypair cannot decrypt ===")
alice_pubonly = Keypair(ss58_address=alice.ss58_address, crypto_type=0)
try:
    alice_pubonly.decrypt(ciphertext)
except ValueError as e:
    print(f"ValueError: {e}")

print("\nAll assertions passed.")
```
