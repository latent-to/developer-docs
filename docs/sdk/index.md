---
title: "SDK Overview"
---

# Bittensor SDK Overview

The Bittensor Python SDK provides a programmable interface for the Bittensor blockchain. This page serves as a guide to all SDK tutorials and examples, organized by functionality.

## Getting Started

Before diving into specific tutorials, make sure you have the SDK installed and configured:

- [Installation](../getting-started/installation.md) - Install the Bittensor SDK
- [Environment Variables](./env-vars.md) - Configure your SDK environment
- [Managing Subtensor Connections](./managing-subtensor-connections.md) - Connect to different networks
- [Migration Guide](./migration-guide.md) - Upgrade from older SDK versions

## Wallets and Keys

Learn how to create and manage wallets, handle keys, and secure your accounts.

### Creating and Managing Wallets
- [Wallets, Coldkeys and Hotkeys](../keys/wallets.md) - Understand Bittensor wallet architecture
- [Working with Keys](../keys/working-with-keys.md) - Create and manage keys using the SDK
- [Install Wallet SDK](../getting-started/install-wallet-sdk.md) - Set up wallet functionality

### Security Best Practices
- [Handle Seed Phrase Securely](../keys/handle-seed-phrase.md) - Protect your recovery phrases
- [Coldkey and Hotkey Security](../keys/coldkey-hotkey-security.md) - Security guidelines
- [Address Poisoning Scams](../keys/address-poisoning-scams.md) - Protect yourself from scams

### Advanced Key Management
- [Multisig Wallets](../keys/multisig.md) - Set up multi-signature wallets for enhanced security
- [Schedule Coldkey Swap](../keys/schedule-coldkey-swap.md) - Rotate your coldkey safely

## Checking Balances and Account Information

Query your account balances, stake positions, and other account details.

### Balance Queries
- [Managing Stake (SDK)](../staking-and-delegation/managing-stake-sdk.md) - Check and manage your stake programmatically

### Metagraph and Network Information
- [Metagraph](../subnets/metagraph.md) - Access network state and subnet information
- [Working with Subnets](../subnets/working-with-subnets.md) - Query subnet data

## Staking and Delegation

Manage your TAO stake across validators and subnets.

### Basic Staking Operations
- [Managing Stake (SDK)](../staking-and-delegation/managing-stake-sdk.md) - Complete guide to staking operations
- [Delegation](../staking-and-delegation/delegation.md) - Understand delegation mechanics

### Advanced Staking
- [Root Claims](../staking-and-delegation/root-claims/index.md) - Claim and manage root network positions
- [Managing Root Claims](../staking-and-delegation/root-claims/managing-root-claims.md) - Root claim operations
- [Price Protection](../learn/price-protection.md) - Understand stake value protection
- [Slippage](../learn/slippage.md) - Handle slippage in staking operations

### Async Staking
- [AsyncIO Operations](../subnets/asyncio.md) - Perform asynchronous staking operations

## Proxy Operations

Use proxies to delegate account permissions securely while keeping your coldkey offline.

### Understanding Proxies
- [Proxies Overview](../keys/proxies/index.md) - Learn about proxy accounts and types
- [Proxy Types](../keys/proxies/index.md#types-of-proxies) - Available proxy types and permissions

### Working with Proxies
- [Create and Manage Proxies](../keys/proxies/create-proxy.md) - Set up standard proxy relationships
- [Pure Proxies](../keys/proxies/pure-proxies.md) - Create and use keyless pure proxy accounts

### Proxy Use Cases
- [Staking with a Proxy](../keys/proxies/staking-with-proxy.md) - Manage staking operations through a proxy
- Proxy transfers - Use proxies for token transfers (see Working with Proxies)
- Advanced proxy operations - Execute any permitted call through a proxy

## Transfers and Transactions

Send TAO and manage token transfers on the network.

### Basic Transfers
- [Managing Stake (SDK)](../staking-and-delegation/managing-stake-sdk.md) - Includes transfer examples

### Advanced Transactions
- [Commit-Reveal Pattern](../concepts/commit-reveal.md) - Use commit-reveal for operations
- [Consensus-Based Weights](../concepts/consensus-based-weights.md) - Submit weighted consensus

## Subnet Operations

Create, manage, and interact with subnets on the Bittensor network.

### Getting Subnet Information
- [Understanding Subnets](../subnets/understanding-subnets.md) - Learn subnet fundamentals
- [Metagraph](../subnets/metagraph.md) - Query subnet state and neuron information
- [Working with Subnets](../subnets/working-with-subnets.md) - Access subnet data programmatically

### Creating and Managing Subnets
- [Create a Subnet](../subnets/create-a-subnet.md) - Launch your own subnet
- [Managing Mechanisms (SDK)](../subnets/managing-mechanisms-with-sdk.md) - Configure subnet parameters
- [Subnet Hyperparameters](../subnets/subnet-hyperparameters.md) - Understand subnet settings

### Crowdloans
- [Crowdloans Overview](../subnets/crowdloans/index.md) - Participate in subnet crowdloans
- [Crowdloans Tutorial](../subnets/crowdloans/crowdloans-tutorial.md) - Step-by-step crowdloan guide

### Registration
- **Get registration cost** - Check current registration fees (see Working with Subnets)
- **Register to a subnet** - Join a subnet as a miner or validator (see Create a Subnet)

### Neuron Information
- [Metagraph](../subnets/metagraph.md) - Get miner and validator information
- [UID Trimming](../subnets/uid-trimming.md) - Understand neuron deregistration

### Subnet Design
- [Basic Subnet Tutorials](../tutorials/basic-subnet-tutorials.md) - Step-by-step subnet examples
- [OCR Subnet Tutorial](../tutorials/ocr-subnet-tutorial.md) - Build an OCR subnet
- [Walkthrough: Prompting](../subnets/walkthrough-prompting.md) - Create a prompting subnet

## Mining and Validating

Run miners and validators on the Bittensor network.

### Mining
- [Mining Overview](../miners/index.md) - Learn about mining on Bittensor
- [Autostaking](../miners/autostaking.md) - Automatically restake mining rewards

### Validating
- [Validating Overview](../validators/index.md) - Set up a validator
- [Child Hotkeys](../validators/child-hotkeys.md) - Manage child hotkey relationships

## 8. Liquidity Positions

Manage liquidity positions on Uniswap for TAO tokens.

- [Liquidity Positions](../liquidity-positions/liquidity-positions.md) - Understand liquidity provision
- [Managing Liquidity Positions](../liquidity-positions/managing-liquidity-positions.md) - Add and remove liquidity

## 9. Dynamic TAO (dTAO)

Work with Dynamic TAO features and alpha tokens.

- [Dynamic TAO Overview](../dynamic-tao/index.md) - Understand dTAO mechanics
- [SDK Cheat Sheet](../dynamic-tao/sdk-cheat-sheet.md) - Quick reference for dTAO operations
- [dTAO FAQ](../dynamic-tao/dtao-faq.md) - Frequently asked questions

## 10. Advanced Topics

### Async Operations
- [AsyncIO](../subnets/asyncio.md) - Perform asynchronous operations for better performance
- [Managing Connections](./managing-subtensor-connections.md) - Handle async Subtensor connections

### Tools and Utilities
- [Bittensor Networks](../concepts/bittensor-networks.md) - Connect to different networks (mainnet, testnet, local)
- [Logging Levels](../concepts/bt-logging-levels.md) - Configure SDK logging
- [Utilities](../resources/utilities.md) - Helper functions and tools

### Governance
- [Governance](../governance/governance.md) - Participate in network governance
- [Senate](../governance/senate.md) - Understand the Senate role


## Local Development
- [Deploy Local Network](../local-build/deploy.md) - Run Bittensor locally
- [Provision Wallets](../local-build/provision-wallets.md) - Set up test wallets
- [Create Local Subnet](../local-build/create-subnet.md) - Create subnets locally
- [Mine and Validate Locally](../local-build/mine-validate.md) - Test mining/validation

## API Reference

For detailed API documentation:

- [Bittensor API Reference](./bt-api-ref.md) - Complete API documentation
- [Subtensor API](./subtensor-api.md) - Subtensor client reference