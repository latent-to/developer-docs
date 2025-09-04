---
title: "Run a Local Bittensor Blockchain Instance"
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Heading from '@theme/Heading';

# Run a Local Bittensor Blockchain Instance

This tutorial will guide the user through running a local instance of Subtensor, Bittensor's L1 blockchain. Running a local instance of the Subtensor blockchain is a great way to test changes and explore the network in a safe and isolated environment.

## Running a local subtensor instance

This section outlines steps for running a local instance of the Subtensor blockchain. There are two supported methods:

- Using a prebuilt Docker image
- Running a local build from source

Both approaches enable isolated testing, development, and debugging without requiring a connection to the mainnet. Choose the method that best fits your workflow.

<Tabs queryString="local-chain">
<TabItem value="docker" label="Using Docker (Recommended)">
Docker is the easiest way to set up a local Bittensor blockchain instance. It only takes a few minutes to get up and running with Docker.

The steps in this guide assume that you are running the command from the machine you intend to host from.

### Prerequisites

Before you begin, make sure you have installed the following on your machine:

- [Docker](https://docs.docker.com/desktop/use-desktop/)
- Install [Bittensor SDK](../getting-started/installation.md) and [Bittensor CLI](../getting-started/install-btcli.md)

The Bittensor SDK and Bittensor CLI are required to interact with the local blockchain instance.

### 1. Pull the Docker image

You can pull the official subtensor Docker image used to create the local blockchain instance from the [GitHub Container Repository](https://github.com/opentensor/subtensor/pkgs/container/subtensor-localnet). To do this, run the following command in your terminal:

```bash
docker pull ghcr.io/opentensor/subtensor-localnet:devnet-ready
```

This command downloads the `subtensor-localnet` Docker image, making it available on your device.

### 2. Run the container

Subtensor can either be run in _fast blocks_ mode, which has advantages for development and testing purposes, or _non-fast blocks_.
Below are examples of how to run the container using each mode:

- Fast blocks: Fast block mode reduces block processing time to _250ms per block_, enabling rapid chain progression. It allows faster feedback cycles for operations such as staking, subnet creation, and registration, making them ideal for local testing scenarios. To run the container in fast block mode, run the following command in your terminal:

  ```bash
  docker run --rm --name local_chain -p 9944:9944 -p 9945:9945 ghcr.io/opentensor/subtensor-localnet:devnet-ready
  ```

- Non-fast blocks: Non-fast block mode uses the default _12-second block time_, aligning with subtensor block intervals. While this mode utilizes the default block processing time, it also incorporates some enhancements—for example, subnets become eligible to start one minute after creation. To run the container in non-fast block mode, run the following command in your terminal:

  ```bash
  docker run --rm --name local_chain -p 9944:9944 -p 9945:9945 ghcr.io/opentensor/subtensor-localnet:devnet-ready False
  ```

:::info
By default, exiting the Docker container removes the image container with the local chain instance; thus, deleting the state of the local chain instance running on it. You can modify this behavior by when running the container wihtout the `--rm` flag.

For more information, see official [Docker documentation](https://docs.docker.com/reference/cli/docker/container/run/).
:::

### 3. Verify your setup

You can verify your local blockchain instance by checking the list of subnets available on your local blockchain. To do this, run the following command in the terminal:

```bash
btcli subnet list --network ws://127.0.0.1:9944
```

If the local blockchain is running correctly, you should see the following output:

```console
                                                           Subnets
                                                         Network: custom


        ┃        ┃ Price       ┃ Market Cap  ┃              ┃                        ┃               ┃              ┃
 Netuid ┃ Name   ┃ (τ_in/α_in) ┃ (α * Price) ┃ Emission (τ) ┃ P (τ_in, α_in)         ┃ Stake (α_out) ┃ Supply (α)   ┃ Tempo (k/n)
━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━
   0    │ τ root │ 1.0000 τ/Τ  │ τ 0.00      │ τ 0.0000     │ -, -                   │ Τ 0.00        │ 0.00 Τ /21M  │ -/-
   1    │ α apex │ 1.0000 τ/α  │ τ 11.00     │ τ 0.0000     │ τ 10.00, 10.00 α       │ 1.00 α        │ 11.00 α /21M │ 77/100
────────┼────────┼─────────────┼─────────────┼──────────────┼────────────────────────┼───────────────┼──────────────┼─────────────
   2    │        │ τ 1.0       │             │ τ 0.0        │ τ 10.00/175.00 (5.71%) │               │              │

```

</TabItem>
<TabItem value="local" label="Running a local build">

### Prerequisites

Before you begin, make sure you have installed the following on your machine:

- Update your Mac or Linux workstation using your package manager
- Install [Bittensor SDK](../getting-started/installation) and [Bittensor CLI](../getting-started/install-btcli)

The Bittensor SDK and Bittensor CLI are required to interact with the local blockchain instance.

### Build your local Subtensor

The following steps outline how to build a local subtensor instance:

#### 1. Install Rust/Cargo

To run locally, Substrate requires an up-to-date install of Cargo and Rust on your local machine. If Rust is already installed, update it using the following command:

```bash
rustup update
```

If Rust is not installed, install Rust and then update your shell's source to include Cargo's path by running the following commands:

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. "$HOME/.cargo/env"
```

#### 2. Clone the subtensor repo

Next, you must fetch the subtensor codebase to your local machine. Run the following commands to clone the Github repo and navigate into the `subtensor` directory:

```bash
git clone https://github.com/opentensor/subtensor.git
cd subtensor
```

Cloning the Subtensor repository provides all the necessary components to build and run the Bittensor blockchain locally.

<!-- check on a new device if this step is required -->

#### 3. Setup Rust

This step ensures that you have the nightly toolchain and the WebAssembly (wasm) compilation target. Note that this step will run the Subtensor chain directly on your terminal; therefore, we advise running it as a background process using PM2 or other software.

Update to the nightly version of Rust:

```bash
./subtensor/scripts/init.sh
```

#### 4. Run the blockchain locally

Use the `localnet.sh` script to build and launch a local instance of the subtensor blockchain. To run the blockchain:

```bash
./scripts/localnet.sh
```

This script handles compilation and starts the node in a development-ready state.

:::info Additional configurations

By default, running the `localnet.sh` script builds the Subtensor binary, purges any existing chain state, and launches the local blockchain in [fast block mode](../resources/glossary.md#fast-blocks). To run the local blockchain in [non-fast block mode](../resources/glossary.md#non-fast-blocks), run the following command in your terminal:

```bash
./scripts/localnet.sh False
```

The script also supports additional flags to customize its behavior:

- `--no-purge`: Skips deletion of the existing chain state, allowing you to resume from a previous session.
- `--build-only`: Compiles the binary and generates the chainspec without starting the node.

These flags make it easy to adapt your localnet setup for different development workflows.
:::

#### 5. Verify your setup

Ensure your local chain is working by checking the list of subnets.

```shell
btcli subnet list --network ws://127.0.0.1:9945
```

If the local blockchain is running correctly, you should see the following output:

```console
                                                           Subnets
                                                         Network: custom


        ┃        ┃ Price       ┃ Market Cap  ┃              ┃                        ┃               ┃              ┃
 Netuid ┃ Name   ┃ (τ_in/α_in) ┃ (α * Price) ┃ Emission (τ) ┃ P (τ_in, α_in)         ┃ Stake (α_out) ┃ Supply (α)   ┃ Tempo (k/n)
━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━
   0    │ τ root │ 1.0000 τ/Τ  │ τ 0.00      │ τ 0.0000     │ -, -                   │ Τ 0.00        │ 0.00 Τ /21M  │ -/-
   1    │ α apex │ 1.0000 τ/α  │ τ 11.00     │ τ 0.0000     │ τ 10.00, 10.00 α       │ 1.00 α        │ 11.00 α /21M │ 77/100
────────┼────────┼─────────────┼─────────────┼──────────────┼────────────────────────┼───────────────┼──────────────┼─────────────
   2    │        │ τ 1.0       │             │ τ 0.0        │ τ 10.00/175.00 (5.71%) │               │              │

```

### Troubleshooting local chain issues

If you encounter errors when running the local chain, consider the following:

- Fast and non-fast block modes are compiled into separate directories. Ensure you're using the correct build for your selected mode and that it has been compiled before starting the chain.
- Any time you pull updates or make changes to the _subtensor_ repository, you must rebuild the chain for those changes to take effect.

</TabItem>
</Tabs>

## Next steps

Once your local chain is running, the next step is to provision wallets for local deployment. This includes creating hotkeys and coldkeys, funding wallets, and preparing accounts for testing or development tasks. For more information, see [Provision Wallets for Local Development](./provision-wallets).
