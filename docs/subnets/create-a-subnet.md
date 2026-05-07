---
title: "Create a Subnet"
---

# Create a Subnet

This page describes the procedures for creating a new Bittensor subnet on test chain or main chain.

You should first try [Creating a Subnet on a locally deployed chain](../local-build/create-subnet).

Creating a subnet is a major undertaking. You should read up on [Understanding Subnets](understanding-subnets) and research existing subnets before planning to create one.

## Considerations

### Research existing subnets

Prospective subnet creators should familiarize themselves with the space of existing subnets.

- Real-time subnet info on [tao.app](https://www.tao.app/explorer)
- LearnBittensor's [Subnet listings](https://learnbittensor.org/subnets)

### Burn cost

This refers to the required amount of TAO to be recycled when creating a new subnet. The burn cost for subnet creation is dynamic and reflects the current cost to register a new subnet. Its value lowers gradually and doubles every time a subnet is created.

:::tip try it live

Check the burn cost to create a subnet on Bittensor main network and test network:

<link rel="stylesheet" href="https://unpkg.com/@antonz/codapi@0.19.10/dist/snippet.css" />
<codapi-settings url="https://bittensor-codex.com/v1">
</codapi-settings>

```shell
btcli subnet burn-cost --network finney
```

<codapi-snippet sandbox="python" editor="basic" init-delay="500">
</codapi-snippet>

```shell
btcli subnet burn-cost --network test
```

<codapi-snippet sandbox="python" editor="basic" init-delay="500">
</codapi-snippet>
:::

### Validating in your own subnet

You must meet the same [requirements for validation](../validators#requirements-for-validation) as other validators in order to set weights in your own subnet.

One option for subnet owners is to ask one of the root network (subnet 0) validators to parent your validator hotkey as a childkey of theirs. This will lend their stake to your validator, and can help you ensure that your validator maintains a sufficient stake to effectively participate in consensus as well as resist deregistration. See the [Child Hotkeys](../validators/child-hotkeys) documentation for more detail.

### Subnet creation rate limits

Subnet creations are limited to **one subnet creation per 14400 blocks** (approximately one every two days). The cost to register a new subnet is also dynamic. For these reason, picking the right time to create your subnet requires planning.

## Prerequisites

- [Install the most recent version of BTCLI](../getting-started/install-btcli).

- [Create a wallet](../keys/working-with-keys#creating-a-wallet-with-btcli).

- To create a subnet on test chain, your wallet must have sufficient test net TAO. Inquire in [Discord](https://discord.com/channels/799672011265015819/1107738550373454028/threads/1331693251589312553) to obtain TAO on Bittensor test network.
- To create a subnet on main network (finney) requires a substantial investment of TAO, depending on current registration cost for new subnets.

## Creating a subnet on testchain

Create your new subnet on the testchain using the test TAO you received from the previous step. This will create a new subnet on the testchain and give you its owner permissions.

Run the create subnet command on the testchain.

```bash
btcli subnet create --network test
```

Output:

```bash
# Enter the owner wallet name, which gives the coldkey permissions to define running hyperparameters later.
>> Enter wallet name (default): owner   # Enter your owner wallet name
>> Enter password to unlock key:        # Enter your wallet password.
>> Register subnet? [y/n]: <y/n>        # Select yes (y)
>> Registering subnet...
✅ Registered subnetwork with netuid: 1 # Your subnet netuid will show here, save this for later.
```

## Creating a subnet on mainchain

:::caution Alert: Minimum required TAO
Creating a subnet on the mainnet is competitive, and the cost is determined by the rate at which new networks are registered onto the chain.
:::

### Create the subnet

Use the below command to create a new subnet on the mainchain.

```bash
btcli subnet create
```

Output:

```bash
>> Enter wallet name (default): owner   # Enter your owner wallet name
>> Enter password to unlock key:        # Enter your wallet password.
>> Register subnet? [y/n]: <y/n>        # Select yes (y)
>> Registering subnet...
✅ Registered subnetwork with netuid: 1 # Your subnet netuid will show here, save this for later.
```

:::info starting a subnet

Newly created subnets are inactive by default and do not begin emitting until they have been started by the subnet owner. This allows subnet owners to configure the subnet, register and activate validators, and onboard miners before activation.
:::

:::note Subnet owner alpha is automatically locked

The subnet owner's share of each epoch's emissions is **automatically locked** via [conviction staking](../staking-and-delegation/conviction-staking.md). Locked alpha accrues conviction over time and cannot be unstaked immediately — unlocking requires an explicit `unlock_stake` transaction followed by a ≈30-day decay period.

This is intentional: it gives investors a public, cryptographic signal of the owner's commitment. Tools like [tao.app](https://www.tao.app) and community dashboards are expected to surface per-subnet lock and conviction data.
:::

### Start the subnet

Use the following command to start the subnet:

```bash
btcli subnet start --netuid x
```
