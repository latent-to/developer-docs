---
title: "Using Docker"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using Docker

To run a subtensor node with Docker, follow the below steps.

:::danger Not tested on cloud
We have not tested subtensor node installation scripts on any cloud service. In addition, if you are using Runpod cloud service, then note that this service is already [containerized](https://docs.runpod.io/pods/overview). Hence, the only option available to you for Runpod is to install a subtensor node by [compiling from source](using-source.md). **Note that we have not tested any subtensor installation steps on Runpod.**
:::

## Prerequisites

Before you begin, make sure you have installed the following on your machine:

- Install [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/desktop/use-desktop/)

The Bittensor SDK and Bittensor CLI are required to interact with the local blockchain instance.

## Step 1: Clone the subtensor repo

Clone the subtensor repository and navigate into the Subtensor directory:

```bash
git clone https://github.com/opentensor/subtensor.git
cd subtensor
```

:::tip Always Pull the Latest Changes

Before running the subtensor node, always ensure that you're working with the latest version of the repository. To do this, run the following command in the `subtensor` directory to fetch and merge the most recent updates:

```sh
git pull
```

:::

## Step 2: Clean Docker environment

Next, stop any currently running Docker containers and clean up the Docker environment using the following command:

```bash
docker compose down --volumes && docker system prune -a --volumes -f

```

:::warning Linux post-installation steps for Docker Engine
Please follow Docker's [official documentation](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user) to perform standard Linux post-installation steps for Docker Engine

Adding a user to the `docker` group is only necessary on Linux, where `sudo` privileges are required to run Docker commands. It is unnecessary on macOS.
:::

## Step 3: Run the subtensor node

Now you can run the subtensor nodes for either mainchain or testchain using any of available options.

### Using lite nodes

A lite node which primarily syncs with the only blocks that have been finalized, and not the entire blockchain. Run a lite node using the command corresponding to your target chain:

<Tabs queryString="subtensor-node" groupId="subtensor-node">
<TabItem value="mainchain" label="On mainchain">
To run a lite node connected to the Bittensor mainchain, run the following command:
```bash
./scripts/run/subtensor.sh -e docker --network mainnet --node-type lite
```

</TabItem>
<TabItem value="testchain" label="on testchain">
To run a lite node connected to the Bittensor testchain, run the following command:

```bash
./scripts/run/subtensor.sh -e docker --network testnet --node-type lite
```

</TabItem>
</Tabs>

The command pulls the Subtensor Docker image and starts the container.

:::warning Docker Resource Allocation
Ensure Docker is configured with sufficient CPU and memory resources to meet the system requirements for running a subtensor node. Inadequate allocation may prevent the node from starting correctly.

We recommend allocating at least 20 GB of RAM. You can adjust these settings in Docker Desktop under **Settings** > **Resources**.
:::

### Using archive nodes

An archive node downloads and validates all the Bittensor blockchain blocks from inception up to the most recent block. Run an archive node using the command corresponding to your target chain:

<Tabs queryString="subtensor-node" groupId="subtensor-node">
<TabItem value="mainchain" label="On mainchain">
To run an archive node connected to the Bittensor mainchain, run the following command:

```bash
./scripts/run/subtensor.sh -e docker --network mainnet --node-type archive
```

</TabItem>
<TabItem value="testchain" label="on testchain">
To run an archive node connected to the Bittensor testchain, run the following command:

```bash
./scripts/run/subtensor.sh -e docker --network testnet --node-type archive
```

</TabItem>
</Tabs>

The command pulls the Subtensor Docker image and starts the container.
