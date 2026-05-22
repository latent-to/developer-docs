---
title: "Bittensor Wallet"
---

# Bittensor Wallet

[bittensor-wallet](https://github.com/latent-to/btwallet) is a Python wrapper around a Rust core compiled to a native extension. Key generation, signing, verification, keyfile management, and asymmetric message encryption all execute in Rust, the language of Subtensor. Bittensor Wallet operates within the Bittensor Python SDK and BTCLI to interact with the cryptographic wallet.

You do not need to know Rust to use this library, its purpose is to provide an interface for Python developers.

This interface includes through three main classes:

| Class | Role |
|---|---|
| `Keypair` | A cryptographic key pair (public + optional private key). The primitive for signing, verifying, and encrypting. |
| `Wallet` | A named wallet present on disk: a coldkey and optionally a hotkey, with their corresponding public-key files. Wraps `Keypair` objects and handles persistence. |
| `Keyfile` | A single key file on disk. Handles at-rest password encryption and serialization. Typically accessed through `Wallet` properties rather than directly. |

## Install

```bash
pip install bittensor-wallet
```

For installation from source, virtual environment setup, and supported Python versions, see [Install Bittensor Wallet](../../getting-started/install-wallet-sdk).

## API reference

Full auto-generated API reference: [Bittensor Wallet reference](pathname:///btwallet-api/html/index.html).

## In this section

- [Keypair](./keypair): creating and importing keypairs, signing, verification, SR25519 vs ED25519
- [Encrypt and decrypt](./encrypt-decrypt): asymmetric message encryption using ED25519 keypairs
- [Wallet and Keyfile](./wallet-class): the `Wallet` object, key access patterns, at-rest encryption
