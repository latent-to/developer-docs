---
title: "Wallet Scripting"
---

import { SdkVersion } from "../../sdk/_sdk-version.mdx";

# Wallet scripting

This page covers programmatic wallet management with the Bittensor SDK: creating, loading, and regenerating wallets, signing and verifying messages with keypairs, and keyfile encryption and decryption.

For the `btcli` equivalents of these operations, see [Creating/Importing a Bittensor Wallet](../working-with-keys.md). For background on what coldkeys and hotkeys are and how they're used in Bittensor, see [Wallets, Coldkeys and Hotkeys](../wallets.md).

<SdkVersion />

:::info Formerly the `bittensor_wallet` package
Before SDK v11, wallet functionality lived in the standalone `bittensor_wallet` package. In v11 it is built into the SDK. The on-disk wallet format, keyfile encryption, and SS58 address format are unchanged: wallets created with earlier SDK versions or with `btcli` work as-is. Update imports from `bittensor_wallet` to `bittensor.wallet`. The auto-generated API reference for the legacy standalone package remains available as a [legacy reference](https://docs.learnbittensor.org/btwallet-api/html/index.html).
:::

The wallet API has three layers:

| Layer     | Import                                | Role                                                                                                                                          |
| --------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `Wallet`  | `from bittensor.wallet import Wallet` | A named wallet on disk: a coldkey and a hotkey, with their public-key files. Wraps `Keypair` objects and handles persistence.                 |
| `Keypair` | `from bittensor.wallet import Keypair`| A cryptographic key pair (public key plus optional private key). The primitive for signing, verifying, and message encryption.                |
| `Keyfile` | `from bittensor.keyfiles import Keyfile` | A single key file on disk. Handles at-rest password encryption. Typically accessed through `Wallet` properties rather than directly.        |

In addition, the `bittensor.wallets` module provides one-call convenience helpers (`create`, `regen_coldkey`, `list_wallets`, `sign_message`, `verify_message`, and others) for the most common flows. They are shown alongside the class API below.

## The Wallet class

### Wallet structure on disk

A wallet is stored under `~/.bittensor/wallets/` by default:

```
~/.bittensor/wallets/
└── my-wallet/
    ├── coldkey              # password-encrypted coldkey
    ├── coldkeypub.txt       # unencrypted coldkey public key
    └── hotkeys/
        ├── my-hotkey        # hotkey (unencrypted by default)
        └── my-hotkeypub.txt # unencrypted hotkey public key
```

Each file is a `Keyfile`. The coldkey is encrypted at rest by default; the hotkey is not.

### Constructing a wallet handle

```python
from bittensor.wallet import Wallet

wallet = Wallet()                      # name="default", hotkey="default"
wallet = Wallet(name="my-wallet")
wallet = Wallet(name="my-wallet", hotkey="my-hotkey", path="/custom/path")
```

`Wallet(...)` only constructs the object. It does not create keys or touch disk, so it works both for wallets that already exist and for wallets you are about to create. The class is also exported at the top level as `bittensor.Wallet`.

### Creating new keys

```python
wallet = Wallet(name="my-wallet", hotkey="my-hotkey")
wallet.create_new_coldkey(n_words=24)   # prints the mnemonic, prompts for an encryption password
wallet.create_new_hotkey()              # prints the mnemonic; hotkey is unencrypted by default
```

Both methods print the new key's mnemonic to stdout so you can record it, and return the wallet for chaining. Record the mnemonic securely before it scrolls away: it is the only way to recover the key. See [Handle your Seed Phrase/Mnemonic Securely](../handle-seed-phrase.md).

For scripts and automation, suppress the interactive prompts:

```python
# Encrypt the coldkey with a password supplied programmatically
wallet.create_new_coldkey(coldkey_password="my-password", suppress=True)

# Or skip at-rest encryption entirely (only appropriate for test keys)
wallet.create_new_coldkey(use_password=False, suppress=True)
wallet.create_new_hotkey(suppress=True)
```

`suppress=True` disables the mnemonic printout. Passing `coldkey_password` (or `hotkey_password`) encrypts without prompting. By default these methods refuse to overwrite an existing keyfile; pass `overwrite=True` to replace one deliberately.

The `bittensor.wallets` helpers wrap the common flows in one call:

```python
from bittensor import wallets

# Coldkey plus hotkey in one call; prompts for a coldkey password
# and prints both mnemonics
wallet = wallets.create(name="my-wallet", hotkey="miner-1")

# Add another hotkey to an existing wallet
wallets.new_hotkey(name="my-wallet", hotkey="miner-2")

# Get a handle to an existing wallet (no key creation)
wallet = wallets.open_wallet(name="my-wallet", hotkey="miner-1")

# Enumerate wallets on disk: name -> hotkey names
print(wallets.list_wallets())
# {'my-wallet': ['miner-1', 'miner-2']}

# Or with public addresses included
for info in wallets.list_wallets_detailed():
    print(info.name, info.ss58, [h.name for h in info.hotkeys])
```

### Regenerating a wallet from a mnemonic or seed

Key derivation is deterministic: regenerating from the same mnemonic always produces the same keys and addresses, on any machine.

```python
wallet = Wallet(name="restored")
wallet.regenerate_coldkey(mnemonic="word1 word2 ... word24")   # prompts for a new encryption password
wallet.regenerate_hotkey(mnemonic="word1 word2 ... word12")
```

Both methods also accept a 32-byte seed, as a hex string or raw bytes:

```python
wallet.regenerate_coldkey(seed="0x" + "ab" * 32)
```

`regenerate_coldkey` can also import a Polkadot.js encrypted JSON keystore: `wallet.regenerate_coldkey(json=(json_string, passphrase))`.

The equivalent module-level helper:

```python
from bittensor import wallets

wallet = wallets.regen_coldkey("word1 word2 ... word24", name="restored")
```

Like key creation, the `regenerate_*` methods refuse to overwrite existing keyfiles unless you pass `overwrite=True`, and accept `use_password` / `coldkey_password` / `suppress` for non-interactive use. The helper never echoes the mnemonic back to stdout.

### Watch-only wallets

To track a wallet without holding its private key, regenerate only the public-key file from the SS58 address:

```python
watch = Wallet(name="watch-only")
watch.regenerate_coldkeypub(ss58_address="5FvL4BYdJECrWz91hFz1ATbUFuQbAWxzfJqzfcqMcYr2kfpU")

print(watch.coldkeypub.ss58_address)
```

This writes only `coldkeypub.txt`; no private coldkey file is created, so the wallet can identify and receive but never sign.

### Accessing keys

The four key properties return `Keypair` objects and require the corresponding keyfile to exist on disk:

```python
wallet.coldkey       # Keypair with private key; prompts for the password if encrypted
wallet.coldkeypub    # Keypair with public key only; never prompts
wallet.hotkey        # Keypair with private key
wallet.hotkeypub     # Keypair with public key only
```

For programmatic access without prompts, pass the password explicitly:

```python
kp = wallet.get_coldkey(password="my-password")
kp = wallet.get_hotkey()   # hotkey is unencrypted by default
```

Decrypted keypairs are cached on the wallet object: after `get_coldkey(...)` (or the equivalent `unlock_coldkey()` / `unlock_hotkey()`), subsequent access to `wallet.coldkey` does not re-prompt. See [Keyfiles and at-rest encryption](#keyfiles-and-at-rest-encryption) for non-interactive unlock via environment variables.

## Keypairs: signing and verifying

Wallet keys are `Keypair` objects with the following properties:

```python
kp = wallet.hotkey
kp.ss58_address   # SS58-encoded public address
kp.public_key     # raw public key bytes
kp.crypto_type    # 1 = SR25519 (default), 0 = ED25519
kp.ss58_format    # SS58 network format (42)
```

### Signing and verification

`sign` takes bytes and returns a raw 64-byte signature. `verify` checks a signature against the keypair's public key, so verification needs only the address:

```python
from bittensor.wallet import Keypair

signature = wallet.hotkey.sign(b"my message")

wallet.hotkey.verify(b"my message", signature)          # True
wallet.hotkey.verify(b"a different message", signature) # False

# A verifier needs only the signer's SS58 address
verifier = Keypair(ss58_address=wallet.hotkey.ss58_address)
verifier.verify(b"my message", signature)               # True
```

To sign a string, encode it first: `kp.sign(message.encode())`.

The `bittensor.wallets` helpers wrap this in a portable hex format, which is convenient when a signature has to travel through JSON or a CLI:

```python
from bittensor import wallets

result = wallets.sign_message(
    "prove I control this hotkey",
    name="my-wallet",
    hotkey="miner-1",
    use="hotkey",      # or "coldkey", which unlocks if encrypted
)
print(result)
# {'ss58': '5EFqKFVLsz6VyE7myUkAwgANhepzrW5qL8Ge7F8f6JamcLeY', 'signature': '0x186536ad...'}

wallets.verify_message("prove I control this hotkey", result["signature"], result["ss58"])
# True
```

`sign_message` signs the exact UTF-8 bytes of the message. With `use="coldkey"` it resolves the password non-interactively where possible (see [Unlocking without a prompt](#unlocking-without-a-prompt)) and accepts an explicit `password=` argument.

### Standalone keypairs

Keypairs can also be created without a wallet, for ephemeral keys or for working with key material directly:

```python
from bittensor.wallet import Keypair

mnemonic = Keypair.generate_mnemonic(24)          # 12 or 24 words
kp = Keypair.create_from_mnemonic(mnemonic)

kp = Keypair.create_from_seed(bytes.fromhex("ab" * 32))

kp = Keypair.create_from_uri("//Alice")           # well-known dev keys; test networks only
```

`Keypair.create_from_encrypted_json(json_data, passphrase)` imports a Polkadot.js encrypted JSON keystore. A standalone keypair holds its private key only in memory; to persist one, write it to a keyfile as shown in [Reading and writing keyfiles directly](#reading-and-writing-keyfiles-directly).

### Key types: SR25519 and ED25519

Bittensor supports two signature schemes, selected with the `crypto_type` parameter that all key creation and regeneration functions accept:

| Constant         | Value | Default | Use case                                                    |
| ---------------- | ----- | ------- | ----------------------------------------------------------- |
| `CRYPTO_SR25519` | `1`   | Yes     | Coldkeys, hotkeys, all on-chain signing                     |
| `CRYPTO_ED25519` | `0`   | No      | [Message encryption](#message-encryption-ed25519-only)      |

Both constants are importable from `bittensor.wallets`. SR25519 is the default throughout the SDK, and all standard Bittensor wallets use it. Keyfiles record the key type on disk, so a key created as ED25519 loads as ED25519 without re-specifying the type.

## Message encryption (ED25519 only)

`Keypair` supports asymmetric message encryption using a NaCl sealed box: anyone can encrypt a message to a recipient using only the recipient's public key, and only the recipient's private key can decrypt it. Each call produces a different ciphertext (randomized ephemeral key), and the ciphertext is 48 bytes longer than the plaintext.

:::danger This does not work with standard Bittensor wallet addresses
Encryption requires **ED25519** keypairs (`crypto_type=0`), because the public key must be convertible to X25519. Standard Bittensor coldkeys and hotkeys are SR25519, and their addresses cannot be used: `encrypt_for` with an SR25519 address usually raises `ValueError`, but for some addresses it silently produces a ciphertext that the recipient can never decrypt. Both parties must deliberately create ED25519 keypairs for this purpose.
:::

```python
from bittensor.wallet import Keypair
from bittensor.wallets import CRYPTO_ED25519

# Both parties created ED25519 keypairs explicitly
alicia = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=CRYPTO_ED25519)
bobby = Keypair.create_from_mnemonic(Keypair.generate_mnemonic(), crypto_type=CRYPTO_ED25519)

# Alicia encrypts using only Bobby's SS58 address
ciphertext = Keypair.encrypt_for(bobby.ss58_address, b"hey bobby, this is alicia")

# Bobby decrypts with his private key
plaintext = bobby.decrypt(ciphertext)

# Encrypting to your own key: kp.encrypt(message) / kp.decrypt(ciphertext)
```

Calling `encrypt`/`decrypt` on an SR25519 keypair, decrypting with the wrong key, or decrypting without a private key each raise `ValueError`.

The wallet-level helpers work with hex strings and a wallet whose coldkey (or hotkey) was created with `crypto_type=CRYPTO_ED25519`:

```python
from bittensor import wallets

sealed = wallets.encrypt_message("meet at the usual block height", recipient_ss58)
# {'ciphertext': '0x4b1ef357...', 'recipient': '5...'}

plain = wallets.decrypt_message(sealed["ciphertext"], name="ed-wallet")
```

`encrypt_message` validates the recipient key and raises a descriptive `ValueError` for SR25519 addresses, so prefer it over calling `encrypt_for` directly.

## Keyfiles and at-rest encryption

Each key of a wallet lives in a `Keyfile`, accessible through wallet properties:

```python
wallet.coldkey_file       # Keyfile for the coldkey
wallet.coldkeypub_file
wallet.hotkey_file
wallet.hotkeypub_file

wallet.coldkey_file.is_encrypted()        # True for a default coldkey
wallet.hotkey_file.is_encrypted()         # False by default
wallet.coldkey_file.exists_on_device()
```

Coldkeys are encrypted at rest with a symmetric key derived from your password (NaCl secretbox). This is distinct from the asymmetric [message encryption](#message-encryption-ed25519-only) above. Keyfiles are written with owner-only permissions, atomically, so an interrupted write cannot destroy an existing keyfile.

To encrypt a hotkey at rest as well, create it with `use_password=True` (or a `hotkey_password`).

### Unlocking without a prompt

Accessing an encrypted coldkey through `wallet.coldkey` prompts for the password interactively. For automation, three verified alternatives:

1. **Pass the password explicitly:**

   ```python
   kp = wallet.get_coldkey(password="my-password")
   ```

2. **`BT_WALLET_PASSWORD` or `BT_WALLET_PASSWORD_FILE` environment variables.** The `bittensor.wallets` helpers (`sign_message`, `decrypt_message`, `signing_keypair`) consult these automatically. `BT_WALLET_PASSWORD` holds the password itself; `BT_WALLET_PASSWORD_FILE` points to a file whose single line is the password. To use the same resolution chain with the class API:

   ```python
   from bittensor import wallets

   wallet = wallets.open_wallet("my-wallet")
   pwd = wallets.resolve_wallet_password(wallet)   # env vars, password file, macOS Keychain
   coldkey = wallet.get_coldkey(password=pwd)
   ```

   Note that the bare `wallet.coldkey` property does not read `BT_WALLET_PASSWORD`; resolve the password as above and pass it in.

3. **Cache the password for the current process:**

   ```python
   wallet.coldkey_file.save_password_to_env("my-password")
   # later in the same process, no prompt:
   coldkey = Wallet(name="my-wallet").coldkey
   ```

   This stores an encoded copy of the password in a process-local environment variable named after the keyfile path (`wallet.coldkey_file.env_var_name()`). The value is encoded by the SDK; it is not a plaintext variable to set by hand. Use option 2 for cross-process automation.

On macOS, `resolve_wallet_password` can also pull from the Keychain (`keychain=True`) or show a native password dialog (`macos_prompt=True`); see `btcli wallet keychain save`.

### Reading and writing keyfiles directly

`Keyfile` is also usable standalone, for key storage outside the wallet directory layout, or to persist a `Keypair` you created in memory:

```python
from bittensor.keyfiles import Keyfile

keyfile = Keyfile("/path/to/keyfile")
keyfile.set_keypair(kp, encrypt=True, password="my-password")
kp = keyfile.get_keypair(password="my-password")
```

With `encrypt=True` and no password, `set_keypair` prompts. `set_keypair` refuses to overwrite an existing file unless `overwrite=True`.

### Error conditions

| Situation                                                        | Exception                                                        |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Wrong password for an encrypted keyfile                          | `WrongPasswordError` (a subclass of `KeyfileError`)               |
| Accessing `wallet.coldkey` when the keyfile does not exist       | `FileNotFoundError`                                               |
| Creating or regenerating a key over an existing keyfile without `overwrite=True` | `FileExistsError` (non-interactive); prompts to confirm in a terminal |
| Encrypted keyfile and no password available (non-interactive)    | `KeyfileError`                                                    |

`KeyfileError` and `WrongPasswordError` are importable from `bittensor.keyfiles`.
