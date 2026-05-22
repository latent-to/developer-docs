---
title: "Bittensor Wallet SDK"
---

# Bittensor Wallet SDK

The Bittensor Wallet SDK (`bittensor-wallet`) is a Python wrapper around a Rust core compiled to a native extension. Key generation, signing, verification, keyfile management, and asymmetric message encryption all execute in Rust, the language of Subtensor. The Bittensor Wallet SDK operates within the Bittensor Python SDK and BTCLI to interact with the cryptographic wallet.

You do not need to know Rust to use this library, its purpose is to provide an interface for Python developers.

It encapsulates the cryptographic concerns into 3 main classes:

| Class | Meaning |
|---|---|
| `Keypair` | A cryptographic key pair (public + optional private key). The primitive for signing, verifying, and encrypting. |
| `Wallet` | A named wallet, prsent on disk: a coldkey and optionally hotkey, and their corresponding public-key files. Wraps `Keypair` objects and handles persistence. |
| `Keyfile` | A single key file on disk, used for at-rest password encryption and deserialization. |

## Install

```bash
pip install bittensor-wallet
```

For installation from source, virtual environment setup, and supported Python versions, see [Install Wallet SDK](../../getting-started/install-wallet-sdk).

## API reference

Full API reference (auto-generated from source): [Bittensor Wallet SDK reference](pathname:///btwallet-api/html/index.html).

## In this section

- [Keypair](./btwallet/keypair): creating and importing keypairs, signing, verification, SR25519 vs ED25519
- [Encrypt and decrypt](./btwallet/encrypt-decrypt): asymmetric message encryption using ED25519 keypairs
- [Wallet and Keyfile](./btwallet/wallet-class): the `Wallet` object, key access patterns, at-rest encryption
