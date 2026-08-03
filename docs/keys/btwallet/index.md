---
title: "Bittensor Wallet"
---

[bittensor-wallet](https://github.com/latent-to/btwallet) is a Python wrapper around a Rust core compiled to a native extension. Key generation, signing, verification, keyfile management, and asymmetric message encryption all execute in Rust, the language of Subtensor. Bittensor Wallet operates within the Bittensor Python SDK and BTCLI to interact with the cryptographic wallet.

You do not need to know Rust to use this library, its purpose is to provide an interface for Python developers.

This interface includes three main classes:

| Class     | Role                                                                                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Keypair` | A cryptographic key pair (public + optional private key). The primitive for signing, verifying, and encrypting.                                                |
| `Wallet`  | A named wallet present on disk: a coldkey and optionally a hotkey, with their corresponding public-key files. Wraps `Keypair` objects and handles persistence. |
| `Keyfile` | A single key file on disk. Handles at-rest password encryption and serialization. Typically accessed through `Wallet` properties rather than directly.         |

## Install

:::warning Install from Verified Sources
Always double-check the package name and origin before installation. Use links and commands directly from our docs or official release announcements to avoid malicious lookalikes.
:::

### From PyPI

```bash
python3 -m venv btwallet-venv
source btwallet-venv/bin/activate
pip install bittensor-wallet
```

### From source

Use this option to develop or contribute to the Bittensor Wallet Rust core.

```bash
python3 -m venv btwallet-venv
source venv/bin/activate
git clone https://github.com/RaoFoundation/btwallet.git
cd btwallet
pip install maturin
maturin develop
```

After `maturin develop` completes, run `pip list` and confirm `bittensor-wallet` appears.

## Verify your installation

```python
import bittensor_wallet
print(bittensor_wallet.__version__)
```

## Supported Python versions

- bittensor (SDK): Python 3.9-3.11 (reference: https://github.com/RaoFoundation/bittensor/blob/master/setup.py#L86-L88)
- bittensor-cli: Python 3.9-3.12 (reference: https://github.com/RaoFoundation/btcli/blob/main/setup.py#L91-L94)
- bittensor-wallet: Python 3.9-3.12 (reference: https://github.com/RaoFoundation/btwallet/blob/main/pyproject.toml#L34-L37)

## Compatibility notes

- If you installed Bittensor SDK `8.2.0` or BTCLI `8.2.0`, `bittensor-wallet 2.0.2` is already included — the steps above are only needed for a standalone installation.
- Bittensor SDK `8.2.0`+ and BTCLI `8.2.0`+ require `bittensor-wallet >= 2.0.2`.

## API reference

Full auto-generated API reference: [Bittensor Wallet reference](https://docs.learnbittensor.org/btwallet-api/html/index.html).

## In this section

- [Keypair](./btwallet/keypair): creating and importing keypairs, signing, verification, SR25519 vs ED25519
- [Encrypt and decrypt](./btwallet/encrypt-decrypt): asymmetric message encryption using ED25519 keypairs
- [Wallet and Keyfile](./btwallet/wallet-class): the `Wallet` object, key access patterns, at-rest encryption
