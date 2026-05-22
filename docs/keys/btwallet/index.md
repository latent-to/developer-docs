---
title: "Bittensor Wallet SDK"
---

# Bittensor Wallet SDK

The Bittensor Wallet SDK (`bittensor-wallet`) is a Python package backed by a Rust core compiled to a native extension. Cryptographic operations, including key generation, signing, verification, keyfile management, and asymmetric message encryption, all execute in Rust.

The package exposes a Python API through three main classes:

| Class | Role |
|---|---|
| `Keypair` | A cryptographic key pair (public + optional private key). The primitive for signing, verifying, and encrypting. |
| `Wallet` | A named wallet present on disk: a coldkey and optionally a hotkey, with their corresponding public-key files. Wraps `Keypair` objects and handles persistence. |
| `Keyfile` | A single key file on disk. Handles at-rest password encryption and serialization. Typically accessed through `Wallet` properties rather than directly. |

## Install

```bash
pip install bittensor-wallet
```

For installation from source, virtual environment setup, and supported Python versions, see [Install Wallet SDK](../../getting-started/install-wallet-sdk).

## API reference

Full auto-generated API reference: [Bittensor Wallet SDK reference](pathname:///btwallet-api/html/index.html).

## In this section

- [Keypair](./btwallet/keypair): creating and importing keypairs, signing, verification, SR25519 vs ED25519
- [Encrypt and decrypt](./btwallet/encrypt-decrypt): asymmetric message encryption using ED25519 keypairs
- [Wallet and Keyfile](./btwallet/wallet-class): the `Wallet` object, key access patterns, at-rest encryption
