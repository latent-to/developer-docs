---
title: "Developer Guides"
description: "Guides for building on Bittensor: mining, validating, staking, running subnets, and the SDK, CLI, Subtensor API and EVM."
slug: "/"
sidebar_label: "Home"
---

<head>
  <title>Learn Bittensor - Developer Guides</title>
</head>

import { HiAcademicCap, HiOutlineAcademicCap } from "react-icons/hi2";
import { MdInstallDesktop, MdOutlineChecklistRtl } from "react-icons/md";
import { FaNetworkWired, FaPython, FaRegNewspaper } from "react-icons/fa";
import { GiMining, GiStarFormation } from "react-icons/gi";
import { GrValidate } from "react-icons/gr";
import { BiMath } from "react-icons/bi";
import { RiTeamLine, RiGovernmentLine } from "react-icons/ri";
import { VscSymbolParameter } from "react-icons/vsc";
import { GoCommandPalette, GoNumber } from "react-icons/go";
import { CiWallet } from "react-icons/ci";
import { SiEthereum } from "react-icons/si";


Bittensor is an open source platform where participants produce best-in-class digital commodities, including compute power, storage space, artificial intelligence (AI) inference and training, protein folding, financial markets prediction, and many more.

Bittensor is composed of distinct **subnets**. Each subnet is an independent community of miners (who produce the commodity), and validators (who evaluate the miners' work).

The Bittensor network constantly emits liquidity, in the form of newly created TAO ($\tau$) and subnet-specific alpha tokens, to participants in proportion to the value of their contributions. Participants include:

- **Miners**&mdash;Work to produce digital commodities. See [mining in Bittensor](./miners/index.md).
- **Validators**&mdash;Evaluate the quality of miners' work. [See validating in Bittensor](./validators/index.md)
- **Subnet Creators**&mdash;Manage the incentive mechanisms that specify the work miners and validators must perform and evaluate, respectively. See [Create a Subnet](./subnets/create-a-subnet)
- **Stakers**&mdash;TAO holders can support specific validators by staking TAO to them. See [Staking](./staking-and-delegation/delegation).

:::tip Browse the subnets
Browse the subnets and explore links to their code repositories on [TAO.app](https://www.tao.app)'s subnets listings.
:::

## Start here

<ResponsiveCards>
    <ResponsiveCard
    icon={HiAcademicCap}
    title='Introduction to Bittensor'
    link='/learn/introduction'
    body='Learn fundamental Bittensor concepts' />
    <ResponsiveCard
    icon={GiStarFormation}
    title='Bittensor frequently asked questions (FAQ)'
    link='/resources/questions-and-answers'
    body='Everything you were afraid to ask about Bittensor.' />
    <ResponsiveCard
    icon={MdInstallDesktop}
    title='Guide to Bittensor tools'
    link='/concepts/tools'
    body='Open source tools for the Bittensor ecosystem, including the Python SDK and `btcli`.' />
    <ResponsiveCard
    icon={FaRegNewspaper}
    title='Glossary'
    link='/resources/glossary'
    body='Definitions for the terms used throughout these guides.' />
</ResponsiveCards>

## Participate

You can participate in an existing subnet as either a subnet validator or a subnet miner, or by staking your TAO to running validators.

<ResponsiveCards>
    <ResponsiveCard
    icon={RiTeamLine}
    title='Staking and Delegation'
    link='/staking-and-delegation/delegation'
    body='Get to know staking and delegation on the Bittensor network.' />
    <ResponsiveCard
    icon={GiMining}
    title='Mining in Bittensor'
    link='/miners'
    body='Get ready to mine on Bittensor subnets' />
    <ResponsiveCard
    icon={GrValidate}
    title='Validating in Bittensor'
    link='/validators'
    body='Get ready to validate on Bittensor subnets' />
    <ResponsiveCard
    icon={BiMath}
    title='Emissions'
    link='/learn/emissions'
    body='Learn how emissions are calculated.' />
    <ResponsiveCard
    icon={RiGovernmentLine}
    title='Governance'
    link='/governance'
    body='Learn how Bittensor governance transitions to full community ownership.' />
</ResponsiveCards>

## Running a subnet

Ready to run your own subnet? Follow the below links.

<ResponsiveCards>
    <ResponsiveCard
    icon={MdOutlineChecklistRtl}
    title='Create a subnet'
    link='/subnets/create-a-subnet'
    body='Step-by-step instructions for creating a subnet locally, on testchain, or mainchain.' />
    <ResponsiveCard
    icon={HiOutlineAcademicCap}
    title='OCR subnet tutorial'
    link='/tutorials/ocr-subnet-tutorial'
    body='Convert your validated incentive-mechanism notebook into a working subnet.' />
    <ResponsiveCard
    icon={VscSymbolParameter}
    title='Subnet hyperparameters'
    link='/subnets/subnet-hyperparameters'
    body='Get to know subnet hyperparameters and how to use them effectively.' />
    <ResponsiveCard
    icon={FaNetworkWired}
    title='Run a local Bittensor blockchain'
    link='/local-build/deploy'
    body='Set up a local Subtensor instance for testing and development.' />
</ResponsiveCards>

## Build on Bittensor

Use the Bittensor SDK, CLI and Wallet SDK to develop against the network, or call the chain directly.

<ResponsiveCards>
    <ResponsiveCard
    icon={FaPython}
    title='Bittensor Python SDK'
    link='/sdk'
    body='Build miners, validators and tooling in Python.' />
    <ResponsiveCard
    icon={GoCommandPalette}
    title='Bittensor CLI'
    link='/btcli/overview'
    body='Manage wallets, stake and subnet operations from the command line.' />
    <ResponsiveCard
    icon={CiWallet}
    title='Bittensor Wallet'
    link='/keys/btwallet'
    body='Create and manage coldkeys and hotkeys programmatically.' />
    <ResponsiveCard
    icon={GoNumber}
    title='Subtensor API'
    link='/subtensor-api'
    body='Generated reference for the extrinsics, storage, events and errors the chain exposes.' />
    <ResponsiveCard
    icon={SiEthereum}
    title='Bittensor EVM'
    link='/evm-tutorials'
    body='Deploy smart contracts and call precompiles on the Bittensor EVM.' />
</ResponsiveCards>

## Get help

If the chain rejects a call, [Subtensor Error Codes](./errors/index.md) explains the error variants the runtime returns and how they reach you through `btcli`, the SDK and PolkadotJS. [Troubleshooting](./errors/troubleshooting.md) covers the problems that come up most often when running miners and validators.

For everything else, the [Bittensor community links](./resources/community-links.md) collect the Discord channels, block explorers and dashboards that the ecosystem uses day to day.
