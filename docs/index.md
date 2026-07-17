---
title: "TAO.app Staking Guides"
slug: "/"
sidebar_position: 0
hide_table_of_contents: true
---

import { RiTeamLine } from "react-icons/ri";
import { MdOutlineChecklistRtl } from "react-icons/md";
import { GiArchiveRegister } from "react-icons/gi";
import { GrStakeholder } from "react-icons/gr";

# TAO.app Staking Guides

Bittensor is an open source network where participants produce best-in-class digital commodities&mdash;including AI inference and training, compute, storage, and financial-markets prediction&mdash;organized into independent **subnets**. The network constantly emits liquidity, in the form of its token, TAO ($\tau$), to participants in proportion to the value of their contributions.

TAO holders take part by **staking**: committing TAO to a validator to earn a share of that validator's emissions, and to help direct the network's rewards. These guides cover everything you need to stake, delegate, manage your positions, and move value safely&mdash;from your first delegation to root claims, price protection, hardware wallets, and staking through the Bittensor EVM.

:::tip Browse the subnets
Explore project information and tokenomic data on the [Subnet Listings](https://tao.app).
:::

<ResponsiveCards>
    <ResponsiveCard
    icon={RiTeamLine}
    title='Staking and Delegation'
    link='staking-and-delegation/delegation'
    body='Get to know how staking and delegating work in the Bittensor network.' />
    <ResponsiveCard 
    icon={MdOutlineChecklistRtl}
    title='Managing your stakes'
    link='staking-and-delegation/managing-stake-sdk'
    body='Add, move, and remove stake with btcli and the Bittensor SDK.' />
    <ResponsiveCard
    icon={GiArchiveRegister}
    title='Root claims'
    link='staking-and-delegation/root-claims'
    body='Understand and manage root claims on your stake.' />
    <ResponsiveCard
    icon={GrStakeholder}
    title='Staking on the Bittensor EVM'
    link='evm-tutorials/staking-precompile'
    body='Stake and unstake TAO directly from EVM smart contracts.' />
</ResponsiveCards>
