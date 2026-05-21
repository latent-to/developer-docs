---
title: "SDK Tutorials"
---

# SDK Tutorials

The Bittensor Python SDK provides a programmable interface to the Bittensor blockchain. This page guides you through practical SDK tutorials organized as a learning path.

## Prerequisites

- [Installation](../getting-started/installation.md): Install the Bittensor SDK
- [Environment Variables](./env-vars.md): Configure your SDK environment

## Working with Wallets

Learn how to create wallets, manage keys, and handle credentials programmatically.

- [Install Wallet SDK](../getting-started/install-wallet-sdk.md): Set up wallet functionality
- [Working with Keys](../keys/working-with-keys.md): Create and manage keys with the SDK
- [Handle Seed Phrase](../keys/handle-seed-phrase.md): Save and restore wallets securely

## Checking Balances and Account Information

Query your account balances, stake positions, and network state.

- [Managing Stake (SDK)](../staking-and-delegation/managing-stake-sdk.md): Check balances and stake positions
- [Metagraph](../subnets/metagraph.md): Query subnet state and neuron information

## Staking Operations

Manage your TAO stake across validators and subnets.

- [Managing Stake (SDK)](../staking-and-delegation/managing-stake-sdk.md): Complete staking guide covering:
  - How to stake with the SDK
  - How to unstake with the SDK
  - How to move stake between validators
  - How to transfer stake
- [Managing Root Claims](../staking-and-delegation/root-claims/managing-root-claims.md): Claim root network positions
- [Managing Liquidity Positions](../liquidity-positions/managing-liquidity-positions.md): Add and remove liquidity on Uniswap

## Proxy Operations

Use proxies to delegate account permissions securely while keeping your coldkey offline.

- [Create and Manage Proxies](../keys/proxies/working-with-proxies.md): Set up standard proxy relationships
- [Pure Proxies](../keys/proxies/pure-proxies.md): Create and use keyless pure proxy accounts
- [Staking with a Proxy](../keys/proxies/staking-with-proxy.md): Perform staking operations through a proxy

**By proxy type:**

- **Proxy staking**: See [Staking with a Proxy](../keys/proxies/staking-with-proxy.md)
- **Other proxy operations**: Execute any permitted call through a proxy (see [Working with Proxies](../keys/proxies/working-with-proxies.md))

## Advanced: Working with Blockchain Calls

Compose and execute complex blockchain transactions using `GenericCall` and pallet-specific builders.

- [Working with Blockchain Calls](./call.md): Create, compose, and execute calls with `GenericCall` and `CallBuilder` - essential for proxies, crowdloans, MEV protection, and fee estimation

## Subnet Operations

Create, manage, and interact with subnets.

- [Working with Subnets](../subnets/working-with-subnets.md): Query subnet data programmatically
- [Metagraph](../subnets/metagraph.md): Access subnet state and neuron information
- [Create a Subnet](../subnets/create-a-subnet.md): Launch your own subnet (includes registration cost info)
- [Managing Mechanisms (SDK)](../subnets/managing-mechanisms-with-sdk.md): Configure subnet parameters
- [Crowdloans Tutorial](../subnets/crowdloans/crowdloans-tutorial.md): Participate in subnet crowdloans
- [Consensus-Based Weights](../concepts/consensus-based-weights.md): Submit weighted consensus

## Local Development and Testing

Test your SDK code on a local network.

- [Deploy Local Network](../local-build/deploy.md): Run Bittensor locally
- [Provision Wallets](../local-build/provision-wallets.md): Set up test wallets
- [Create Local Subnet](../local-build/create-subnet.md): Create subnets locally
- [Mine and Validate Locally](../local-build/mine-validate.md): Test mining/validation

## Subnet Design

End-to-end tutorials for building incentive mechanisms.

- [Basic Subnet Tutorials](../tutorials/basic-subnet-tutorials.md): Step-by-step subnet examples
- [OCR Subnet Tutorial](../tutorials/ocr-subnet-tutorial.md): Build an OCR subnet
- [Walkthrough: Prompting](../subnets/walkthrough-prompting.md): Create a prompting subnet

## Managing Threads and Connections

Perform operations asynchronously for better performance.

- [Working with Concurrency](../subnets/asyncio.md): Use async/await patterns with the SDK
- [Managing Subtensor Connections](./managing-subtensor-connections.md): Handle async connections

## MEV Protection

Protect your transactions from front-running and MEV attacks using the MEV Shield.

- [MEV Shield Protection](./mev-protection.md): Encrypt transactions to prevent MEV attacks on staking, registration, and other operations

## API Reference

- [Bittensor API Reference](./bt-api-ref.md): Complete API documentation
- [Subtensor API](./subtensor-api.md): Subtensor client reference
- [Migration Guide](./migration-guide.md): Upgrade from older SDK versions
