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

# Alicia creates an ED25519 keypair
alicia = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=0)

# Encrypt a message for Alicia (needs only her public key)
ciphertext = alicia.encrypt(b"a secret message")

# Decrypt (requires Alicia's private key)
plaintext = alicia.decrypt(ciphertext)
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

### Example: Alicia encrypts for Bobby to decrypt

:::note Why "Alicia" and "Bobby"?
`//Alice` and `//Bob` are reserved Polkadot dev-key URIs, so we use the variant names Alicia and Bobby to keep things separate (but familiar) for the encryption example.
:::



```python
from bittensor_wallet import Keypair

# Both parties created ED25519 keypairs explicitly (crypto_type=0)
alicia = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=0)
bobby = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=0)

# Alicia encrypts using only Bobby's SS58 address
ciphertext = Keypair.encrypt_for(bobby.ss58_address, b"hey bobby, this is alicia")

# Bobby decrypts with his private key
plaintext = bobby.decrypt(ciphertext)
assert plaintext == b"hey bobby, this is alicia"
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
alicia = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=0)
bobby = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=0)

print("=== Keypairs ===")
print(f"Alicia SS58:       {alicia.ss58_address}")
print(f"Alicia public key: {alicia.public_key.hex()}")
print(f"Bobby SS58:         {bob.ss58_address}")

print("\n=== Basic roundtrip: encrypt and decrypt to self ===")
ciphertext = alicia.encrypt(b"a secret message")
plaintext = alicia.decrypt(ciphertext)
print(f"Original:        {b'a secret message'}")
print(f"Ciphertext ({len(ciphertext)} bytes): {ciphertext.hex()}")
print(f"Decrypted:       {plaintext}")
assert plaintext == b"a secret message"

print("\n=== encrypt_for: Alicia encrypts to Bobby using only his SS58 address ===")
ciphertext2 = Keypair.encrypt_for(bobby.ss58_address, b"hey bobby, this is alicia")
plaintext2 = bobby.decrypt(ciphertext2)
print(f"Ciphertext: {ciphertext2.hex()[:48]}...")
print(f"Decrypted:  {plaintext2}")
assert plaintext2 == b"hey bobby, this is alicia"

print("\n=== Each call to encrypt produces a unique ciphertext (randomized nonce) ===")
c1 = alicia.encrypt(b"same message")
c2 = alicia.encrypt(b"same message")
assert c1 != c2
print("Different ciphertexts for the same plaintext — confirmed")

print("\n=== Error: SR25519 keypair cannot encrypt ===")
sr_keypair = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=1)
try:
    sr_keypair.encrypt(b"this will fail")
except ValueError as e:
    print(f"ValueError: {e}")

print("\n=== Error: wrong key cannot decrypt ===")
ciphertext3 = alicia.encrypt(b"for alicia only")
try:
    bobby.decrypt(ciphertext3)
except ValueError as e:
    print(f"ValueError: {e}")

print("\n=== Error: public-key-only keypair cannot decrypt ===")
alicia_pubonly = Keypair(ss58_address=alicia.ss58_address, crypto_type=0)
try:
    alicia_pubonly.decrypt(ciphertext)
except ValueError as e:
    print(f"ValueError: {e}")
```

```
=== Keypairs ===
Alicia SS58:       5HkhGLgYLmELcqtJ4nvQaTiv1JJfztArYPj9qa2qGGgQRkcU
Alicia public key: fbacfdb3746eef35947279a334d1817bd266c24b658ff022be3a975884f2100d
Bobby SS58:         5HMvDRy43or6yYMiedNR6kAc9xEmS7Wxn95deVSa6XrWPHLF

=== Basic roundtrip: encrypt and decrypt to self ===
Original:        b'a secret message'
Ciphertext (64 bytes): 6943cfd08a2139dceaf0613ece4e84a5e964b5e40057408fd6d07e8dd815c4437fb0eac04f43d33d576d61e502508c2bb056a1c9afaacd7cb4974bee1bd30fd8
Decrypted:       b'a secret message'

=== encrypt_for: Alicia encrypts to Bobby using only his SS58 address ===
Ciphertext: 774ef5f701ca27efcd7095b72bda05924a5eed410b4aed88...
Decrypted:  b'hey bobby, this is alicia'

=== Each call to encrypt produces a unique ciphertext (randomized nonce) ===
Different ciphertexts for the same plaintext — confirmed

=== Error: SR25519 keypair cannot encrypt ===
ValueError: Encrypt/decrypt is only supported for ED25519 keypairs.

=== Error: wrong key cannot decrypt ===
ValueError: Decryption failed: invalid ciphertext or wrong key.

=== Error: public-key-only keypair cannot decrypt ===
ValueError: Decryption requires a keypair with a private key.

```
