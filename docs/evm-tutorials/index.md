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

- [Subtensor networks](./subtensor-networks.md)
- [EVM on Mainnet](./evm-mainnet-with-metamask-wallet.md)
- [Stake with a smart contract](./staking-precompile.md)
- [Bridge vTAO](./bridge-vtao.md)
- [Opentensor Foundation Blogpost: EVM on Bittensor](https://blog.bittensor.com/evm-on-bittensor-draft-6f323e69aff7)

## EVM and Subtensor wallets on the Bittensor blockchian

Bittensor wallets are based on Polkadot-style ss58 addresses, whereas Ethereum uses h160 addresses.

The holder of a private key for an ss58 address based on the corresponding public key can sign transactions on any Bittensor chain for that address. Anyone who creates key-pairs using `btcli wallet`, for example, holds the private key and the corresponding seed phrase, and hence can sign Bittensor transactions for that wallet.

Similarly, creating an Ethereum wallet gives you control of the h160 private key for the corresponding public key.

:::info
You can easily [convert an h160 address to an ss58 address](./convert-h160-to-ss58.md), or vice versa, but this does _not_ yield the corresponding private key. This means that if you create a wallet in Bittensor, you will not be able to sign Ethereum contracts with it, nor versa.
:::

Hence, in the context of Bittensor EVM we can distinguish between:

- 'Bittensor wallets': created using the Bittensor tool chain and therefore able to sign transactions using Bittensor transaction clients (BTCLI and the Bittensor SDK), but not EVM smart contracts, on the Bittensor blockchain.
- 'EVM wallets': created using an EVM client such as MetaMask and therefore able to sign EVM smart contracts, but not Subtensor extrinsics, on the Bittensor blockchain.

## Ethereum vs Bittensor EVM smart contract runtime

On the Ethereum network, nodes such as full nodes, validator nodes and archive nodes run the Ethereum Virtual Environment (EVM) run-time environment. Smart contracts operate under this EVM. See the below high-level diagram.

:::info
Note that all operations performed by Bittensor EVM are executed solely on the Bittensor blockchain, not on the Ethereum blockchain.
:::

<left>
<ThemedImage
alt="Local blockchain vs public subtensor"
sources={{
    light: useBaseUrl('/img/docs/2-EVM-block-diagram.svg'),
    dark: useBaseUrl('/img/docs/dark-2-EVM-block-diagram.svg'),
  }}
style={{width: 400}}
/>
</left>
<right>
<ThemedImage
alt="Local blockchain vs public subtensor"
sources={{
    light: useBaseUrl('/img/docs/EVM-subtensor-block-diagram.svg'),
    dark: useBaseUrl('/img/docs/dark-EVM-subtensor-block-diagram.svg'),
  }}
style={{width: 400}}
/>
</right>

<ResponsiveCards>    
    <ResponsiveCard 
    icon={BiSolidNetworkChart}
    title='Subtensor networks'
    link='/evm-tutorials/subtensor-networks'
    body='RPC endpoints and chain IDs for the Bittensor EVM.' />
    <ResponsiveCard
    icon={GiHiveMind}
    title='EVM Mainnet with Metamask'
    link='/evm-tutorials/evm-mainnet-with-metamask-wallet'
    body='Set up your Metamask wallet with the EVM mainnet.' />
    <ResponsiveCard
    icon={GrStakeholder}
    title='Stake with a smart contract'
    link='/evm-tutorials/staking-precompile'
    body='Stake to a hotkey using the staking precompile.' />
    <ResponsiveCard
    icon={FaNetworkWired}
    title='Bridge vTAO'
    link='/evm-tutorials/bridge-vtao'
    body='Bridge TAO to vTAO and back across the Bittensor EVM.' />
    <ResponsiveCard
    icon={GiCardExchange}
    title='vTAO bridge tutorial'
    link='/evm-tutorials/vtao-bridge-tutorial'
    body='Step-by-step walkthrough of bridging vTAO.' />
    <ResponsiveCard
    icon={FaMoneyBillTransfer}
    title='vTAO liquidity on Aerodrome'
    link='/evm-tutorials/vtao-liquidity-on-aerodrome'
    body='Provide vTAO liquidity on Aerodrome.' />
    <ResponsiveCard
    icon={GiCardExchange}
    title='TAO transfer from Metamask to SS58'
    link='/evm-tutorials/transfer-from-metamask-to-ss58'
    body='Transfer TAO from Metamask to an SS58 address.' />
    <ResponsiveCard
    icon={GoKey}
    title='Convert h160 to SS58'
    link='/evm-tutorials/convert-h160-to-ss58'
    body='Convert between h160 and ss58 address formats.' />
</ResponsiveCards>
