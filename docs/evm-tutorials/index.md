---
title: "Bittensor EVM Smart Contracts"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { HiAcademicCap } from "react-icons/hi2";
import { MdInstallDesktop } from "react-icons/md";
import { FaNetworkWired } from "react-icons/fa";
import { GiMining } from "react-icons/gi";
import { GrValidate } from "react-icons/gr";
import { GiHiveMind } from "react-icons/gi";
import { GiOvermind } from "react-icons/gi";
import { GiBrainTentacle } from "react-icons/gi";
import { PiBrainFill } from "react-icons/pi";
import { GiBrainStem } from "react-icons/gi";
import { CiWallet } from "react-icons/ci";
import { SiTrpc } from "react-icons/si";
import { GoKey } from "react-icons/go";
import { GiCardExchange } from "react-icons/gi";
import { BiSolidNetworkChart } from "react-icons/bi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GrStakeholder } from "react-icons/gr";

# Bittensor EVM Smart Contracts

A full ethereum virtual machine (EVM) runtime operates as an application layer on top of the Bittensor blockchain (Subtensor). This allows users to:

- deploy most EVM smart contracts on subtensor without changing the code,
- interact with deployed smart contracts on the subtensor blockchain, and
- access standard Ethereum JSON-RPC methods.

:::info
Bittensor EVM smart contracts are executed solely on the **Bittensor blockchain, _not_ on the Ethereum blockchain.**
:::

See:

- [Examples and Precompiles](./examples.md)
- [EVM on Testnet](./evm-testnet-with-metamask-wallet.md)
- [EVM on Local Chain](./evm-localnet-with-metamask-wallet.md)
- [EVM on Mainnet](./evm-mainnet-with-metamask-wallet.md)
- [Opentensor Foundation Blogpost: EVM on Bittensor](https://blog.bittensor.com/evm-on-bittensor-draft-6f323e69aff7)

## EVM and Subtensor wallets on the Bittensor blockchian

Bittensor wallets are based on Polkadot-style ss58 addresses, whereas Ethereum uses h160 addresses.

The holder of a private key for an ss58 address based on the corresponding public key can sign transactions on any Bittensor chain for that address. Anyone who creates key-pairs using `btcli wallet`, for example, holds the private key and the corresponding seed phrase, and hence can sign Bittensor transactions for that wallet.

Similarly, creating an Ethereum wallet gives you control of the h160 private key for the corresponding public key.

:::info
You can easily [convert an h160 address to an ss58 address](./convert-h160-to-ss58.md), or vice versa, but this does _not_ yield the corresponding private key. This means that if you create a wallet in Bittensor, you will not be able to sign Ethereum contracts with it, nor versa.
:::

### The HashedAddressMapping

Every EVM call that touches Substrate state (staking, registering, setting weights) requires a Substrate Account—`AccountId32`. The runtime derives this from the H160 address using a one-way hash:

```
AccountId32 = Blake2b_256("evm:" ++ h160_bytes)
```

This is called **HashedAddressMapping**. It is deterministic — the same H160 always produces the same AccountId32 — but irreversible. You cannot reconstruct an H160 private key from the AccountId32.

#### How it works

When a smart contract calls a precompile function—for example, `addStake` on StakingV2, the contract's own H160 address is hashed to produce the coldkey for the stake position. The stake is held by the **contract** on-chain, not by the user who called the contract.

Use the AddressMapping precompile (`0x80C`) to compute the Substrate coldkey for any EVM address.

### Types of EVM wallets

In the context of Bittensor EVM we can distinguish between the types of wallets available:

| Type             | Created with                           | Can sign                           | Used for                                              |
| ---------------- | -------------------------------------- | ---------------------------------- | ----------------------------------------------------- |
| EVM wallet       | MetaMask or any Ethereum key generator | EVM transactions, precompile calls | Interacting with smart contracts, calling precompiles |
| Bittensor wallet | `btcli wallet`, Bittensor SDK          | Substrate extrinsics               | Staking via btcli/SDK, key operations, governance     |

:::info Gas fees on Bittensor EVM
The Bittensor EVM uses the standard Ethereum gas model. Gas fees are paid in TAO (not a separate fee token). Always ensure that you have enough TAO in required the EVM wallet to cover the gas fees for each transaction.
:::

## Ethereum vs Bittensor EVM smart contract runtime

On the Ethereum network, nodes such as full nodes, validator nodes and archive nodes run the Ethereum Virtual Environment (EVM) run-time environment. Smart contracts operate under this EVM. See the below high-level diagram.

:::info
Note that all operations performed by Bittensor EVM are executed solely on the Bittensor blockchain, not on the Ethereum blockchain.
:::

<ThemedImage
alt="Local blockchain vs public subtensor"
sources={{
    light: useBaseUrl('/img/docs/2-EVM-block-diagram.svg'),
    dark: useBaseUrl('/img/docs/dark-2-EVM-block-diagram.svg'),
  }}
style={{width: 400, display: "flex", justifySelf: "center"}}
/>
<ThemedImage
alt="Local blockchain vs public subtensor"
sources={{
    light: useBaseUrl('/img/docs/EVM-subtensor-block-diagram.svg'),
    dark: useBaseUrl('/img/docs/dark-EVM-subtensor-block-diagram.svg'),
  }}
style={{width: 400, display: "flex", justifySelf: "center"}}
/>

<ResponsiveCards>    
    <ResponsiveCard 
    icon={GiHiveMind}
    title='Install Dependencies'
    link='/evm-tutorials/install'
    body='Get started by installing dependencies first.' />    
    <ResponsiveCard
    icon={BiSolidNetworkChart}
    title='EVM Testnet with Metamask'
    link='/evm-tutorials/evm-testnet-with-metamask-wallet'
    body='Learn how to set up your Metamask wallet with EVM testnet.' />
    <ResponsiveCard
    icon={SiTrpc}
    title='EVM Localnet with Metamask'
    link='/evm-tutorials/evm-localnet-with-metamask-wallet'
    body='Set up your Metamask wallet for a localnet with EVM feature.' />
    <ResponsiveCard
    icon={GiHiveMind}
    title='EVM Mainnet with Metamask'
    link='/evm-tutorials/evm-mainnet-with-metamask-wallet'
    body='Learn how to set up your Metamask wallet with EVM mainnet.' />
    <ResponsiveCard
    icon={FaNetworkWired}
    title='Configure Hardhat for subtensor EVM'
    link='/evm-tutorials/hardhat-config-for-subtensor-evm'
    body='Using Hardhat? Configure it to work with subtensor EVM.' />
    <ResponsiveCard
    icon={FaNetworkWired}
    title='Configure Remix IDE for subtensor EVM'
    link='/evm-tutorials/remix-config-for-subtensor-evm'
    body='Remix IDE configuration to use with subtensor EVM.' />    
    <ResponsiveCard
    icon={GiCardExchange}
    title='TAO transfer from Metamask to SS58'
    link='/evm-tutorials/transfer-from-metamask-to-ss58'
    body='Learn how to transfer TAO from Metamask to SS58.' />
    <ResponsiveCard
    icon={FaMoneyBillTransfer}
    title='Transfer TAO between two H160 addresses'
    link='/evm-tutorials/transfer-between-two-h160-accounts'
    body='Learn how to transfer TAO between two Ethereum H160 addresses.' />
    <ResponsiveCard
    icon={GrStakeholder}
    title='Stake with a smart contract'
    link='/evm-tutorials/staking-precompile'
    body='Stake to a hotkey using precompiled smart contract.' />
    <ResponsiveCard
    icon={GoKey}
    title='Verify ed25519 with a precompile'
    link='/evm-tutorials/ed25519-verify-precompile'
    body='Verify an ed25519 signature on subtensor EVM.' />
    <ResponsiveCard
    icon={GiHiveMind}
    title='Troubleshooting'
    link='/evm-tutorials/troubleshooting'
    body='How to troubleshoot the most common issues.' />
</ResponsiveCards>
