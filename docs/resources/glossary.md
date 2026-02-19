---
title: "Glossary"
---

# Glossary

## A

### Active UID

A UID slot that is considered active within a specific subnet, allowing the associated hotkey to participate as a subnet validator or subnet miner.

**See also:** [Subnet Miners](../miners/), [Subnet Validators](../validators/)

### ADR (Alpha Distribution Ratio)

A metric that compares ALPHA tokens held by participants versus ALPHA tokens remaining in the AMM pool. ADR is calculated as the ratio of emissions to injections, measuring how much ALPHA goes to people (emissions) relative to how much is put into the pool (injections). A higher ADR means liquidation happens at a deeper discount to spot price. Under the current protocol, ADR tracks 2^(k - n), where k is the global TAO halving index and n is the subnet's ALPHA halving index.

### Archive Node

A type of public subtensor node that stores the entire blockchain history, allowing for full data access and querying capabilities.

**See also:** [Subtensor Nodes](../subtensor-nodes/), [Managing Subtensor Connections](../sdk/managing-subtensor-connections.md)

### Axon

A module in the Bittensor API that uses the FastAPI library to create and run API servers. Axons receive incoming Synapse objects. Typically, an Axon is the entry point advertised by a subnet miner on the Bittensor blockchain, allowing subnet validators to communicate with the miner.

**See also:** [Subnet Miners](../miners/), [Subnet Validators](../validators/)

## B

### Bicameral Legislature

A two-tier legislative system comprising the Triumvirate and the Senate for proposal approval.

**See also:** [Governance](../governance/governance.md), [Senate](../governance/senate.md)

### Bittensor Wallet

A digital wallet that holds the core ownership in the Bittensor network and serves as the user's identity technology underlying all operations.

**See also:** [Wallets](../keys/wallets.md), [Working with Keys](../keys/working-with-keys.md)

### Block

A unit of data in the Bittensor blockchain, containing a collection of transactions and a unique identifier (block hash). A single block is processed every 12 seconds in the Bittensor blockchain.

**See also:** [Subtensor API](../sdk/subtensor-api.md)

### Blockchain validator

A node that participates in the Subtensor blockchain’s consensus mechanism to produce and validate blocks. Blockchain validators operate at the blockchain level, not within individual subnets.

#### Blockchain validator vs subnet validator

A blockchain validator participates in the network-wide consensus by validating transactions, producing blocks, and participating in network-wide consensus. In contrast, a subnet validator operates only within a specific subnet's consensus mechanism, where it evaluates miners' tasks and performances.

Blockchain validators function at the core consensus layer and affect the entire network, while subnet validators belong to the application layer and influence only local subnet incentives and rewards.

### Burn cost

This refers to the required amount of TAO to be recycled when creating a new subnet, i.e., cost of registering a new subnet.

**See also:** [Burn cost](../subnets/create-a-subnet.md#burn-cost)

## C

### Coldkey

A component of a Bittensor wallet responsible for securely storing funds and performing high-risk operations such as transfers and staking. It is encrypted on the user's device. This is analogous to a private key.

**See also:** [Coldkey-Hotkey Security](../keys/coldkey-hotkey-security.md), [Working with Keys](../keys/working-with-keys.md)

### Coldkey-hotkey pair

A combination of two keys, a coldkey for secure storage and high-risk operations, and a hotkey for less secure operations and network interactions.

**See also:** [Coldkey-Hotkey Security](../keys/coldkey-hotkey-security.md), [Working with Keys](../keys/working-with-keys.md)

### Commit Reveal

The Commit Reveal feature is designed to solve the weight-copying problem by giving would-be weight-copiers access only to stale weights. Copying stale weights should result in validators departing from consensus.

**See also:**

- [Commit Reveal](../concepts/commit-reveal.md)
- [The Weight Copying Problem](../concepts/weight-copying-in-bittensor)

### Consensus Score

The consensus score is calculated as the stake-weighted median of all weights assigned to a specific neuron by validators. This creates a consensus threshold that filters out outlier weights, ensuring that only weights near the median consensus are used in final rank calculations.

**See also:** [Yuma Consensus](../learn/yuma-consensus.md), [Consensus-Based Weights](../concepts/consensus-based-weights.md)

#### Mathematical Definition:

For each neuron $j$, the consensus score $C_j$ is calculated as:

$$
C_j = \text{weighted\_median}(\{w_{ij} \mid i \in \text{validators}\}, \{s_i \mid i \in \text{validators}\}, \kappa)
$$

Where:

- $w_{ij}$ is the weight assigned by validator $i$ to neuron $j$
- $s_i$ is the stake of validator $i$
- $\kappa$ is the consensus majority ratio (typically 51%)
- $\text{weighted\_median}$ is the stake-weighted median function

Calculation Process:

1. **Weight collection**: Gather all weights assigned to each neuron by validators
2. **Stake weighting**: Apply stake weights to validator opinions
3. **Median calculation**: Find stake-weighted median using κ parameter (typically 51%)
4. **Threshold establishment**: Consensus score becomes clipping threshold for weights

Properties and Interpretation:

- **Range**: [0, 1] normalized values
- **High Consensus**: Values close to 1 indicate strong validator agreement
- **Low Consensus**: Values close to 0 indicate weak validator agreement
- **Outlier Detection**: Weights below consensus score are clipped to 0

Network Security Properties:

- **Anti-Manipulation**: Consensus filtering prevents weight manipulation by outliers
- **Stake-Weighted**: Higher stake validators have more influence in consensus
- **Dynamic Threshold**: Consensus adapts to changing network conditions
- **Majority Rule**: κ parameter controls consensus strictness (typically 51%)

#### Relationship to Other Metrics

**Consensus vs Trust:**

- **Consensus**: Stake-weighted median of weights (consensus threshold)
- **Trust**: Ratio of final rank to pre-rank (consensus alignment impact)
- **Relationship**: Consensus determines weight clipping, Trust measures the impact

**Consensus vs Ranks:**

- **Consensus**: Threshold for weight filtering
- **Ranks**: Final performance scores after consensus filtering
- **Relationship**: Consensus influences rank calculation through weight clipping

**Consensus vs Validator Trust:**

- **Consensus**: Per-neuron consensus thresholds
- **Validator Trust**: Sum of clipped weights set by each validator
- **Relationship**: Validator trust measures validator influence in consensus

**Source**:

- [`bittensor/bittensor/core/metagraph.py:360-372`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/metagraph.py#L360-372)
- [`subtensor/pallets/subtensor/src/epoch/run_epoch.rs:595`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs#L595)

## D

### Delegate

A subnet validator that receives staked TAO tokens from delegators and performs validation tasks in one or more subnets.

**See also:** [Delegation](../staking-and-delegation/delegation.md), [Managing Stake with btcli](../staking-and-delegation/managing-stake-btcli.md)

### Delegate Stake

The amount of TAO staked by the delegate themselves.

**See also:** [Managing Stake with btcli](../staking-and-delegation/managing-stake-btcli.md), [Managing Stake with SDK](../staking-and-delegation/managing-stake-sdk.md)

### Delegation

Also known as staking, delegating TAO to a validator (who is thereby the delegate), increases the validator's stake and secure a validator permit.

**See also:** [Delegation](../staking-and-delegation/delegation.md), [Managing Stake with btcli](../staking-and-delegation/managing-stake-btcli.md)

### Dendrite

A client instance used by subnet validators and subnet miners to transmit information to axons on subnet miners and subnet validators. Dendrites communicate with axons using the server-client (Axon-dendrite) protocol.

**See also:** [Subnet Miners](../miners/), [Subnet Validators](../validators/)

### Deregistration

The process of removing a subnet miner or a subnet validator from the subnet due to poor performance.

**See also:** [Miner Deregistration](../miners/#miner-deregistration), [Subnet Miners](../miners/)

### Drand/time-lock encryption

[Drand](https://drand.love)) is a distributed randomness beacon network that provides publicly verifiable, unpredictable, and unbiased random numbers. It is operated by the [League of Entropy](https://drand.love/league-of-entropy/), a consortium of independent organizations running Drand nodes.

Drand provides **time-lock encryption**, a cryptographic technique that encrypts data so that it can only be decrypted _after a specific time has passed_. Drand provides this capability by regularly producing randomness "pulses" at fixed intervals. Data encrypted for a future Drand round cannot be decrypted—even by the person who encrypted it—until that round's randomness is published.

Key properties that make Drand suitable for applications in Bittensor, such as [Commit Reveal](#commit-reveal):

- **Decentralized**: No single entity controls the randomness generation
- **Verifiable**: Anyone can verify that randomness was generated correctly
- **Predictable timing**: Pulses are produced at regular intervals
- **Industry adoption**: Used by multiple blockchain and cryptographic protocols
- **Open source**: Fully transparent implementation

Learn more:

- [Drand Time-Lock Encryption documentation](https://drand.love/docs/timelock-encryption/)
- [Commit Reveal](../concepts/commit-reveal)

## E

### EdDSA Cryptographic Keypairs

A cryptographic algorithm used to generate public and private key pairs for coldkeys and hotkeys in the Bittensor wallet.

**See also:** [Working with Keys](../keys/working-with-keys.md), [Coldkey-Hotkey Security](../keys/coldkey-hotkey-security.md)

### Effective stake

The total staked TAO amount of a delegate, including their own TAO tokens and those delegated by nominators.

**See also:** [Managing Stake with btcli](../staking-and-delegation/managing-stake-btcli.md), [Managing Stake with SDK](../staking-and-delegation/managing-stake-sdk.md)

### Emission

Every block, TAO is injected into each subnet in Bittensor, and every tempo (or 360 blocks), it is extracted by participants (miners, validators, stakers, and subnet creators).

Emission is this process of generating and allocating currency to participants. The amount allocated to a given participant over some duration of time is also often referred to as 'their emissions' for the period.

Emissions are protected from manipulation through [Exponential Moving Average (EMA)](#exponential-moving-average-ema) mechanisms that smooth both validator-miner bond evolution and subnet price effects.

**See also:** [Emissions](../learn/emissions.md), [Exponential Moving Average (EMA)](#exponential-moving-average-ema)

### Encrypting the Hotkey

An optional security measure for the hotkey.

**See also:** [Coldkey-Hotkey Security](../keys/coldkey-hotkey-security.md), [Working with Keys](../keys/working-with-keys.md)

### Epoch

An epoch in Bittensor is the period during which a subnet executes its consensus mechanism. Its is determined number of blocks defined by the subnet's [tempo](#tempo) hyperparameter.

**See also:** [Tempo](#tempo), [Yuma Consensus](../learn/yuma-consensus.md)

### Existential Deposit

The minimum amount of TAO required for an account to exist on the Bittensor blockchain. Accounts with balances below this threshold can be reaped (removed) to conserve network resources and prevent blockchain bloat from dust accounts.

The existential deposit is a runtime constant set in the Balances pallet configuration. While the default value is defined in the runtime code as 500 RAO (0.0000005 TAO), the actual on-chain value can be queried from the blockchain using the `Balances::ExistentialDeposit` constant.

Use the Bittensor SDK to query the current existential deposit:

```python
import asyncio
import json
from bittensor.core.async_subtensor import AsyncSubtensor
from bittensor.utils.balance import Balance

async def main():
	async with AsyncSubtensor(network="finney") as subtensor:
		deposit = await subtensor.get_existential_deposit()
	print(f"Existential deposit: {deposit.tao} TAO")
asyncio.run(main())

```

### Exponential Moving Average (EMA)

A weighted moving average that prioritizes recent observations while exponentially decreasing the weight of older data points. In Bittensor, EMA is used in two critical stability mechanisms:

1. **Validator-Miner Bond Smoothing**: Smooths the evolution of bonds between validators and miners over time, rewarding early discovery while preventing abrupt manipulation attempts. Has two modes:
   - **Basic Mode**: Single α ≈ 0.1 (~7-22 blocks for significant changes)
   - **Liquid Alpha Mode**: Dynamic α range 0.7-0.9 based on consensus alignment (~1-13 blocks depending on consensus)

2. **Subnet Flow Emission Smoothing**: Protects emissions from manipulation by extremely slowly incorporating TAO flow changes (net staking minus unstaking) into emission calculations (α ≈ 0.000003209, ~30 day half-life, ~86.8 day effective window)

**Formula**: `EMA(t) = α × Current_Value + (1 - α) × EMA(t-1)`

**Key Properties**:

- Lower α = slower adaptation, higher stability
- Higher α = faster adaptation, lower stability
- Bittensor prioritizes stability with conservative α values

**See also:** [Understanding Exponential Moving Averages](../learn/ema.md), [Consensus-based Weights](../concepts/consensus-based-weights.md), [Validator-Miner Bonds](#validator-miner-bonds), [Emission](#emission)

### Existential deposit

An existential deposit is the minumum required TAO in a wallet (i.e., in a coldkey).
If a wallet balance goes below the existential deposit, then this wallet account is deactivated and the remaining TAO in it is destroyed.
**This is set to 500 RAO for any Bittensor wallet**.

See also [What is the Existential Deposit?](https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-).

### External Wallet

A Bittensor wallet created through the Bittensor website or using a tool like [subkey](https://docs.substrate.io/reference/command-line-tools/subkey/), allowing users to use TAO without installing Bittensor.

**See also:** [Wallets](../keys/wallets.md), [Installation](../getting-started/installation.md)

## F

### Fast blocks

A development-only configuration that accelerates block production to 250ms intervals, enabling rapid local testing and immediate execution of on-chain operations.

**See also:** [Create a local instance](../local-build/deploy.md?local-chain=docker#2-run-the-container)

## H

### Halving

The process where Bittensor's daily token emission rate cuts in half, similar to Bitcoin's halving mechanism. Halvings reduce the rate of new TAO tokens entering circulation.

Unlike Bitcoin which halves based on block numbers, Bittensor implements halvings based on total token supply. When specific supply thresholds are reached, the emission rate of TAO is cut in half.

The actual date of each halving is not fixed—it changes based on the amount of TAO being recycled each day.

**See also:**

- Halving countdown on [TAO.app Tokenomics Dashboard](https://www.tao.app/tokenomics)
- [Emission](../learn/emissions.md)

### Hotkey

A component of a Bittensor wallet responsible for less secure operations such as signing messages into the network, secure a UID slot in a subnet, running subnet miners and subnet validators in a subnet. It can be encrypted or unencrypted, but is unencrypted by default. The terms "account" and "hotkey" are used synonymously.

**See also:** [Coldkey-Hotkey Security](../keys/coldkey-hotkey-security.md), [Working with Keys](../keys/working-with-keys.md)

### Hotkey-Coldkey Pair

Authentication mechanism for delegates and nominators and for delegates participating in the Senate.

**See also:** [Coldkey-Hotkey Security](../keys/coldkey-hotkey-security.md), [Working with Keys](../keys/working-with-keys.md)

## I

### Immunity Period

A grace period granted to newly registered neurons during which they are protected from deregistration due to poor performance. The immunity period allows new miners and validators time to establish themselves and improve their performance before becoming eligible for pruning. The default period being is 4096 blocks (~13.7 hours), but can be configured by the subnet creator.

**See also:** [Miner Deregistration](../miners/#miner-deregistration), [Validator Deregistration](../validators/index.md#validator-deregistration), [Subnet Hyperparameters](../subnets/subnet-hyperparameters.md#immunityperiod)

### Incentives

A portion of the TAO emission received by the subnet miners when they provide valuable services and compete for UID slots in a subnet.

**See also:** [Emissions](../learn/emissions.md), [Anatomy of Incentive Mechanism](../learn/anatomy-of-incentive-mechanism.md)

### Incentive Mechanism

A system that drives the behavior of subnet miners and governs consensus among subnet validators in a Bittensor subnet. Each subnet has one or more incentive mechanisms, which should be designed carefully to promote desired behaviors and penalize undesired ones. When multiple incentive mechanisms are used, each operates independently with separate bond pools for Yuma Consensus calculations, allowing subnet creators to distribute emissions across different types of work or evaluation criteria.

**See also:** [Anatomy of Incentive Mechanism](../learn/anatomy-of-incentive-mechanism.md), [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets), [Understanding Subnets](../subnets/understanding-subnets.md)

### Issuance

The total amount of TAO circulating in the Bittensor network. Includes TAO that is held in wallets and subnet liquidity pools.

This can be viewed on Bittensor explorers such as [TAO.app's Tokenomics Dashboard](https://www.tao.app/tokenomics), or [TAOstats](https://taostats.io).

To query it directly from the chain, see: [Subtensor Storage Query Example: Total Issuance](../subtensor-nodes/subtensor-storage-query-examples.md#168-totalissuance)

See also: [Recycling and burning](#recycling-and-burning)

## L

### Lite Node

A type of public subtensor node that stores limited blockchain data and relies on archive nodes for full historical data.

**See also:** [Subtensor Nodes](../subtensor-nodes/), [Managing Subtensor Connections](../sdk/managing-subtensor-connections.md)

### Local Blockchain

A private blockchain used for developing and testing subnet incentive mechanisms. A local blockchain is not public and is isolated from any Bittensor network.

**See also:** [Local Build](../local-build/deploy), [Create a Subnet](../local-build/create-subnet.md)

### Local Wallet

A Bittensor wallet created on the user's machine, requiring the installation of Bittensor.

**See also:** [Wallets](../keys/wallets.md), [Installation](../getting-started/installation.md)

### Loss Function

In the context of machine learning, a mathematical function that measures the difference between the predicted output and the ground truth. In Bittensor, incentive mechanisms act as loss functions that steer subnet miners towards desirable outcomes.

**See also:** [Anatomy of Incentive Mechanism](../learn/anatomy-of-incentive-mechanism.md), [Understanding Subnets](../subnets/understanding-subnets.md)

## M

### Mainchain

The primary Bittensor blockchain network, used for production purposes and connected to lite or archive nodes.

**See also:** [Bittensor Networks](../concepts/bittensor-networks.md), [Subtensor Nodes](../subtensor-nodes/)

### Mempool

The _mempool_ is a temporary holding area in blockchain networks where pending and unconfirmed transactions sit before being included in a block. When you submit a transaction, it first enters the mempool, where it becomes visible to all network participants.

### Metagraph

A data structure that contains comprehensive information about the current state of a subnet, including detailed information on all the nodes (neurons) such as subnet validator stakes and subnet weights in the subnet. Metagraph aids in calculating emissions.

**See:** [The Subnet Metagraph](../subnets/metagraph)

### MEV (Maximal Extractable Value)

In blockchain networks, MEV refers to the profit that can be extracted by reordering, inserting, or censoring transactions within a block.

Common MEV attacks include:

- **Front-running**: Observing a pending transaction and submitting a similar transaction with higher priority to execute first
- **Sandwich attacks**: Placing transactions before and after a target transaction to profit from the price movement caused by that transaction
- **Back-running**: Submitting a transaction immediately after a target transaction to capitalize on its effects

In Bittensor, MEV attacks can affect staking and unstaking operations, where attackers might exploit knowledge of pending transactions to manipulate token prices. The MEV Shield feature protects against these attacks by encrypting transactions until they are included in a block.

**See also:** [MEV Shield](../sdk/mev-protection.md), [Price Protection](../learn/price-protection.md)

### Multiple Incentive Mechanisms

A feature that allows subnets to implement multiple independent evaluation systems within a single subnet. Each mechanism operates with its own bond pool for Yuma Consensus calculations, enabling subnet creators to distribute emissions across different types of work or evaluation criteria. Validators must evaluate miners separately for each mechanism, and miner performance in one mechanism does not affect their rating in another.

**See also:** [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets), [Anatomy of Incentive Mechanism](../learn/anatomy-of-incentive-mechanism.md)

### Miner Deregistration

The process of removing a poor-performing subnet miner from a UID slot, making room for a newly registered miner.

**See also:** [Miner Deregistration](../miners/#miner-deregistration)

### Mnemonic

A sequence of words used to regenerate keys, in case of loss, and restore coldkeys and hotkeys in the Bittensor wallet.

**See also:** [Handle Seed Phrase](../keys/handle-seed-phrase.md), [Working with Keys](../keys/working-with-keys.md)

## N

### NaCl Format

A secure encryption format, using the [NaCl](https://nacl.cr.yp.to/) library, used for updating legacy Bittensor wallets to improve security.

**See also:** [Working with Keys](../keys/working-with-keys.md), [Coldkey-Hotkey Security](../keys/coldkey-hotkey-security.md)

### Netuid

A unique identifier assigned to a subnet within the Bittensor network.

**See also:** [Understanding Subnets](../subnets/understanding-subnets.md), [Working with Subnets](../subnets/working-with-subnets.md)

### Neuron

The basic computing node in a Bittensor subnet, representing a node in a neural network. Neurons can be either subnet validators or subnet miners, each identified by a unique UID within their subnet and associated with a hotkey-coldkey pair for authentication and operations.

Neurons participate in the network through axon servers (miners) and dendrite clients (validators), exchanging synapse objects to perform subnet-specific tasks. Their performance is measured through metrics like rank, trust, consensus, and incentive scores, which determine emissions and validator permits.

**See also:** [Understanding Neurons](../learn/neurons.md), [Subnet Validators](../validators/), [Subnet Miners](../miners/), [NeuronInfo class](pathname:///python-api/html/autoapi/bittensor/core/chain_data/neuron_info/index.html)

### Nominate

The process of a staking TAO on a validator's hotkey. Nomination allows token holders to participate in subnet emissions by staking their TAO to active validators, earning proportional rewards based on the validator's performance.

**See also:** [Staking and delegation](../staking-and-delegation/delegation.md)

### Nominator

An account that stakes TAO on a validator's hotkey. Nominators are token holders who nominate their TAO to validators/delegates to participate in subnet's consensus and earn dividends while keeping control of their tokens.

**See also:** [Staking and delegation](../staking-and-delegation/delegation.md)

### Non-fast blocks

A development-only configuration that adheres to Subtensor’s default 12-second block interval, simulating production timing for features like delayed subnet activation.

**See also:** [Create a local instance](../local-build/deploy.md?local-chain=docker#2-run-the-container)

## O

### Objective Function

In the context of machine learning and subnet operations, this refers to the goal that the subnet is continuously optimizing for, through its incentive mechanism.

**See also:** [Anatomy of Incentive Mechanism](../learn/anatomy-of-incentive-mechanism.md), [Understanding Subnets](../subnets/understanding-subnets.md)

## P

### Private Key

A private component of the cryptographic key pair, crucial for securing and authorizing transactions and operations within the Bittensor network.

**See also:** [Working with Keys](../keys/working-with-keys.md), [Coldkey-Hotkey Security](../keys/coldkey-hotkey-security.md)

### Proposal

A suggestion or plan put forward by the Triumvirate for the Senate to vote on.

**See also:** [Governance](../governance/governance.md), [Senate](../governance/senate.md)

### Proposal hash

A unique identifier for a proposal used in the voting process.

**See also:** [Governance](../governance/governance.md), [Senate](../governance/senate.md)

### Public Key

A cryptographic key that is publicly available and used for verifying signatures, encrypting messages, and identifying accounts in the Bittensor network. This is the publicly shareable part of the cryptographic key pair associated with both the coldkey and hotkey, allowing others to securely interact with the wallet.

**See also:** [Working with Keys](../keys/working-with-keys.md), [Coldkey-Hotkey Security](../keys/coldkey-hotkey-security.md)

### Public Subtensor

A publicly accessible node in the Bittensor network that can be run as a lite node or an archive node and synchronized with either the mainchain or testchain.

**See also:** [Subtensor Nodes](../subtensor-nodes/), [Managing Subtensor Connections](../sdk/managing-subtensor-connections.md)

## R

### RAO

A denomination of TAO, representing one billionth (10<sup>-9</sup>) of a TAO.

**See also:** [Emissions](../learn/emissions.md)

### Rank

This metagraph property represents the final aggregate judgment of a each miner, computed by Yuma Consensus alogirithm operating over the miner-ratings submitted by a subnet's validators each tempo. The final `rank` score represent a miner's performance after any outlier weights set by validators have been removed through consensus clipping. This ensures that only weights near the median consensus are used in final calculations.

Ranks are calculated as the stake-weighted sum of consensus-clipped weights and directly determine emissions to miners.

**See also:** [Emissions](../learn/emissions.md), [Yuma Consensus](../learn/yuma-consensus.md), [Subnet Metagraph](../subnets/metagraph)

**Relationship to Other Metrics:**

- **Ranks vs Consensus**: Ranks are calculated using consensus-clipped weights
- **Ranks vs Trust**: Trust measures how much consensus clipping affected the rank
- **Ranks vs Incentive**: Ranks are normalized to become incentive values
- **Ranks vs Validator Trust**: Validator trust measures validator influence in consensus

**Calculation Process:**

1. **Pre-ranks**: Initial stake-weighted sum of all weights before consensus filtering
2. **Consensus calculation**: Stake-weighted median of weights per neuron (consensus threshold)
3. **Weight clipping**: Weights clipped at consensus threshold to remove outliers
4. **Final ranks**: Stake-weighted sum of clipped weights (the rank value)

**Properties and Interpretation:**

- **Range**: [0, 1] normalized values after final normalization
- **High Rank**: Values close to 1 indicate strong consensus-based performance
- **Low Rank**: Values close to 0 indicate weak consensus-based performance
- **Incentive Distribution**: Ranks directly determine incentive allocation to miner neurons

**Network Security Properties:**

- **Consensus-Based**: Ranks reflect network consensus rather than individual validator opinions
- **Outlier Protection**: Consensus clipping prevents manipulation by outlier weights
- **Stake-Weighted**: Higher stake validators have more influence in rank calculation
- **Dynamic Updates**: Ranks are recalculated every epoch based on current network state

**Mathematical Definition:**
For each neuron $j$, the rank $R_j$ is calculated as:
$$R_j = \sum_{i \in \text{validators}} S_i \cdot \overline{W_{ij}}$$

Where:

- $S_i$ is the stake of validator $i$
- $\overline{W_{ij}}$ is the consensus-clipped weight from validator $i$ to neuron $j$
- The sum is taken over all validators in the subnet

**Source**:

- [`bittensor/bittensor/core/metagraph.py:325-331`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/metagraph.py#L325-331)
- [`subtensor/pallets/subtensor/src/epoch/run_epoch.rs:605`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs#L605)

### Recycling and burning

Tokens (TAO and subnet-specific alpha) can be 'removed from circulation', meaning these tokens exist in neither wallet nor liquidity pool, and cannot be transacted. This can happen in two ways:

- When tokens are **recycled**, they are subtracted from the chain's record of token issuance (`TotalIssuance`), so effectively the same quantity of tokens can be emitted again.

- In contrast, when tokens are **burned** they exist in no wallet and no pool and can no longer be transacted; however they are still included in the record of token issuance, so they will not be re-emitted, and in effect will forever remain as a quantity of _missing_ tokens, a difference between issuance and the effective quantity in circulation.

#### Recycling

Tokens are recycled in several cases in Bittensor operations:

- **All transaction fees are recycled**: When transaction fees are collected, they are deducted from `TotalIssuance`, effectively recycling them back into the system for future emission. See [Transaction Fees in Bittensor](../learn/fees)
- **Subnet Creation fees**: When a new subnet is created, the cost is recycled, except for one TAO, which is used to initialize the subnet's TAO liquidity pool.
- **Neuron Registration fees**: When a user registers a hotkey on a subnet to participate as a miner or validator, they are charged a registration fee in TAO. Alpha tokens worth the current swap value of the fee are taken from the subnet's alpha liquidity pool and recycled.
- **Extrinsic transaction**: Users can manually recycle alpha tokens using the `recycle_alpha` extrinsic, which reduces both the user's stake and the subnet's `SubnetAlphaOut` tracker.

#### Burning

Subnet-specific alpha tokens are burned in several contexts:

- **Creator emissions burning**: Alpha emissions for mining on a subnet are automatically burned if they are emitted to the hotkey with creator permissions on the subnet, or if they are emitted to a hotkey controlled by the subnet owner's coldkey. This allows validators to burn some or all of the subnet's emissions to prevent token inflation (by weighting the subnet creator hotkey).
- **Extrinsic transaction**: Alpha can be burned on demand using the `burn_alpha` Subtensor extrinsic. Unlike recycling, burning does not reduce `SubnetAlphaOut`.
- **Root Subnet automated burning**: Subnet Zero (Root Subnet) alpha tokens are burned under specific economic conditions to maintain system stability.

### Regenerating a Key

The process of recreating a lost or deleted coldkey or hotkey using the associated mnemonic.

**See also:** [Handle Seed Phrase](../keys/handle-seed-phrase.md), [Working with Keys](../keys/working-with-keys.md)

### Register

The process of registering keys with a subnet and purchasing a UID slot.

**See also:** [Subnet Miners](../miners/), [Subnet Validators](../validators/), [Working with Subnets](../subnets/working-with-subnets.md)

### Root Proportion

For a given subnet, the relative weight of TAO staked to validators on that subnet through staking to the Root Subnet (rather than directly to the subnet). Mathematically it is the ratio of stake on Root to the total issuance of the subnet's alpha token.

**Properties:**

- **Range**: [0, 1] representing the proportion of dividends going to root stakers
- **Higher root proportion**: More of the total stake in the subnet is held by stakers in root, rather than directly in the subnet.
- **Lower root proportion**: More dividends remain as alpha for subnet stakers

**Mathematical Definition:**

$$
\text{Root proportion} = \frac{\text{Root TAO} \times \text{TAO weight}}{\text{Root TAO} \times \text{TAO weight} + \text{alpha issuance}}
$$

Where:

- `Root TAO`: Total TAO staked in Root Subnet
- `TAO weight`: Global parameter ([TAO Weight](#tao-weight)) determining TAO vs alpha influence (currently 0.18)

See also:

- [Root Subnet/Subnet Zero](#root-subnetsubnet-zero)
- [TAO Weight](#tao-weight)
- [Coinbase Implementation](../navigating-subtensor/emissions-coinbase.md#6-calculating-root-proportion)
- [Emissions](../learn/emissions.md)

### Root Subnet/Subnet Zero

Subnet Zero a.k.a. the root subnet is a special subnet. No miners can register on subnet zero, and no validation work is performed. However validators can register, and $\tau$-holders can stake to those validators, as with any other subnet. This offers a mechanism for $\tau$-holders to stake $\tau$ into validators in a subnet-agnostic way. This works because the weight of a validator in a subnet includes both their share of that subnet's $\alpha$ and their share of staked TAO in Subnet Zero.

## S

### SS58 Encoded

A compact representation of public keys corresponding to the wallet's coldkey and hotkey, used as wallet addresses for secure TAO transfers.

**See also:** [Working with Keys](../keys/working-with-keys.md), [Wallets](../keys/wallets.md)

### Slippage

In the context of an automated market maker (AMM), slippage is the impact on the tokens acquired in a trade due to the change in price from the trade transaction itself.

In Bittensor, each subnet's alpha token is traded on a constant product AMM. When you stake TAO to receive alpha (or unstake alpha to receive TAO), your transaction changes the token price, resulting in receiving less than the current market rate X the quantity of the token you are inputting.

Larger transactions cause more slippage. Bittensor provides slippage protection through tolerance limits and partial execution options.

**See:** [Understanding Pricing and Anticipating Slippage](../learn/slippage.md)

### Senate

A group of elected delegates formed from the top K delegate hotkeys, responsible for approving or disapproving proposals made by the Triumvirate.

**See also:** [Senate](../governance/senate.md), [Governance](../governance/governance.md)

### Stake

The amount of currency tokens delegated to a validator UID in a subnet. Includes both self-stake (from the validator's own cold-key) and stake delegated from others.

Stake determines a validator's weight in consensus as well as their emissions.

**See also:** [Managing Stake with btcli](../staking-and-delegation/managing-stake-btcli.md), [Managing Stake with SDK](../staking-and-delegation/managing-stake-sdk.md), [Delegation](../staking-and-delegation/delegation.md)

### Stake Weight

The computed total stake value for a validator that determines their consensus power and emissions in a subnet. Stake weight combines a validator's alpha stake and TAO stake using the TAO weight parameter to calculate their total influence in the network.

**See also:** [TAO Weight](#tao-weight), [Understanding Subnets](../subnets/understanding-subnets.md)

**Mathematical Definition:**
For a validator with alpha stake $\alpha$ and TAO stake $\tau$, the stake weight $W$ is calculated as:

$$
W = {\alpha + \tau \ \times w_{\tau}}
$$

Where $w_{\tau}$ is the global TAO weight parameter (currently 0.18)

A validator's relative influence in a subnet is calculated as:

$$
\text{Relative Stake Weight} = \frac{\text{Stake Weight}_i}{\sum_{v \in \text{validators}} \text{Stake Weight}_v}
$$

**Consensus Power:**

- **Weight Setting**: Higher stake weight means more influence when setting weights
- **Validator Permits**: Stake weight determines eligibility for validator permits
- **Bond Formation**: Stake weight influences bond calculations and retention

**Validator Emissions:**

- **Relative Distribution**: Higher stake weight -> higher emission share

**Code References:**

- **Yuma Consensus**: [`subtensor/pallets/subtensor/src/epoch/run_epoch.rs:530`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs#L530)
- **Validator dividend distribution**: [`subtensor/pallets/subtensor/src/coinbase/run_coinbase.rs:165`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/run_coinbase.rs#L165)

### Staking

The process of attaching TAO to a validator hotkey, i.e., locking TAO to a subnet validator's hotkey to increase their total stake and increase their consensus power and share of dividends.

**See also:**

- [Managing Stake with btcli](../staking-and-delegation/managing-stake-btcli.md)
- [Managing Stake with SDK](../staking-and-delegation/managing-stake-sdk.md)
- [Delegation](../staking-and-delegation/delegation.md)
- [Browse validators on TAO.app](https://www.tao.app/validators)

### Subnet

A Bittensor subnet is an incentive-based competition market that produces a specific kind of digital commodity. It consists of a community of miners that produce the commodity, and a community of validators that measures the miners' work to ensure its quality.

**See also:** [Understanding Subnets](../subnets/understanding-subnets.md), [Working with Subnets](../subnets/working-with-subnets.md), [Create a Subnet](../subnets/create-a-subnet.md)

### Subnet Miner

The task-performing entity within a Bittensor subnet. A subnet miner is a type of node in a Bittensor subnet that is connected only to subnet validators. Subnet miners are isolated from the external world and communicate bidirectionally with subnet validators. A subnet miner is responsible for performing tasks given to them by the subnet validators in that subnet.

**See also:** [Subnet Miner Documentation](../miners/)

### Subnet Creator

The individual or entity responsible for defining the specific digital task to be performed by subnet miners, implementing one or more incentive mechanisms, and providing sufficient documentation for participation in the subnet. Subnet creators can configure multiple incentive mechanisms to distribute emissions across different types of work or evaluation criteria.

**See also:** [Create a Subnet](../subnets/create-a-subnet.md), [Subnet Creators btcli Guide](../subnets/subnet-creators-btcli-guide.md), [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets)

### Subnet Protocol

A unique set of rules defining interactions between subnet validators and miners, including how tasks are queried and responses are provided.

**See also:** [Understanding Subnets](../subnets/understanding-subnets.md), [Working with Subnets](../subnets/working-with-subnets.md)

### Subnet scoring model

A component of an incentive mechanism that defines how subnet miners' responses are evaluated, aiming to align subnet miner behavior with the subnet's goals and user preferences. It is a mathematical object that converts miner responses into numerical scores, enabling continuous improvement and competition among miners. When multiple incentive mechanisms are used, each has its own scoring model for independent evaluation.

**See also:** [Anatomy of Incentive Mechanism](../learn/anatomy-of-incentive-mechanism.md), [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets), [Understanding Subnets](../subnets/understanding-subnets.md)

### Subnet Task

A key component of any incentive mechanism that defines the work the subnet miners will perform. The task should be chosen to maximize subnet miner effectiveness at the intended use case for the subnet. When multiple incentive mechanisms are used within a subnet, each mechanism can define different tasks for miners to perform.

**See also:** [Understanding Subnets](../subnets/understanding-subnets.md), [Anatomy of Incentive Mechanism](../learn/anatomy-of-incentive-mechanism.md), [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets)

### Subnet Weights

The importance assigned to each subnet determined by net TAO flows (staking minus unstaking activity) and used to determine the percentage emissions to subnets. As of November 2025, this is based on EMA-smoothed TAO flows rather than token prices.

**See also:** [Emissions](../learn/emissions.md), [Consensus-Based Weights](../concepts/consensus-based-weights.md)

### Subtensor

[Subtensor](https://github.com/opentensor/subtensor) is Bittensor's layer 1 blockchain based on substrate (now PolkadotSDK). This serves Bittensor as a system of record for transactions and rankings, operates Yuma Consensus, and emits liquidity to participants to incentivize their participation in network activities.

The Bittensor SDK offers the [`bittensor.core.subtensor`](pathname:///python-api/html/autoapi/bittensor/core/subtensor/index.html) and [`bittensor.core.async_subtensor`](pathname:///python-api/html/autoapi/bittensor/core/async_subtensor/index.html) modules to handle Subtensor blockchain interactions.

**See also:** [Subtensor API](../sdk/subtensor-api.md), [Subtensor Nodes](../subtensor-nodes/), [Managing Subtensor Connections](../sdk/managing-subtensor-connections.md)

### Sudo

A privileged key for administrative actions, replaced by governance protocol for enhanced security.

**See also:** [Governance](../governance/governance.md), [btcli Permissions](../btcli/btcli-permissions.md)

### Synapse

A data object used by subnet validators and subnet miners as the main vehicle to exchange information. Synapse objects are based on the BaseModel of the Pydantic data validation library.

**See also:** [Subnet Miners](../miners/), [Subnet Validators](../validators/)

## T

### TAO ($\tau$)

The cryptocurrency of the Bittensor network, used to incentivize participation in network activities (mining, validation, subnet creation and management). Currently, 0.5 TAO is minted every 12 seconds on the Bittensor blockchain.

**See also:** [Emissions](../learn/emissions.md), [Wallets](../keys/wallets.md)

### TAO Weight

A global parameter (currently set to 0.18) that determines the relative influence of TAO stake versus alpha stake when calculating a validator's total stake weight, a critical value that influence's a validator's consensus power and emissions.

**See also:** [Stake Weight](#stake-weight)

### Tempo

Tempo is a subnet-specific hyperparameter that determines how frequently epochs run. It is a 360-block period over which the Yuma Consensus calculates emissions to subnet participants based on the latest available ranking weight matrix. A single block is processed every 12 seconds, hence a 360-block tempo passes every 4320 seconds or ~72 minutes.

**See also:** [Yuma Consensus](../learn/yuma-consensus.md), [Emissions](../learn/emissions.md)

### Transfer

The process of sending TAO tokens from one wallet address to another in the Bittensor network.

**See also:** [Wallets](../keys/wallets.md), [Working with Keys](../keys/working-with-keys.md)

### Triumvirate

A group of three Opentensor Foundation employees responsible for creating proposals.

**See also:** [Governance](../governance/governance.md), [Senate](../governance/senate.md)

### Trust

In the Yuma Consensus algorithm, trust represents how much a miner's rank was affected by consensus clipping. Trust is calculated as the ratio of final rank to pre-rank. It represents how much of the original validator support survived the consensus clipping process, providing insight into whether a neuron received controversial or outlier weight assignments.

**See also:** [Yuma Consensus](../learn/yuma-consensus.md), [Subnet Metagraph](../subnets/metagraph)

**Mathematical Definition:**
For each neuron $j$, the trust $T_j$ is calculated as:

$$
T_j = \frac{R_j}{P_j}
$$

Where:

- $R_j$ is the final rank after consensus clipping
- $P_j$ is the pre-rank before consensus clipping
- The ratio indicates the proportion of original support that survived consensus filtering

Interpretation:

- **Range**: [0, 1] where 1.0 indicates perfect consensus alignment
- **`Trust = 1.0`**: Neuron's rank unchanged by consensus (high consensus alignment)
- **`Trust < 1.0`**: Neuron's rank reduced by consensus clipping (lower value means more reduction)
- **`Trust = 0.0`**: Neuron's rank eliminated by consensus (no consensus support)

Calculation Process:

1. **Pre-ranks calculation**: $P_j = \sum_{i} S_i \cdot W_{ij}$ (stake-weighted sum of all weights)
2. **Consensus filtering**: Weights clipped at consensus threshold to remove outliers
3. **Final ranks calculation**: $R_j = \sum_{i} S_i \cdot \overline{W_{ij}}$ (stake-weighted sum of clipped weights)
4. **Trust calculation**: $T_j = R_j / P_j$ (ratio of final to pre-rank)

**Relationship to Other Metrics:**

- **Trust vs Consensus**: Trust measures the impact of consensus filtering
- **Trust vs Ranks**: Trust is the ratio of final rank to pre-rank
- **Trust vs Validator Trust**: Trust is per-neuron, Validator Trust is per-validator
- **Trust vs Incentive**: Trust influences incentive through consensus mechanisms

**Metric Comparison Table**

| Metric              | Purpose             | Calculation                                 | Range  | Interpretation                              |
| ------------------- | ------------------- | ------------------------------------------- | ------ | ------------------------------------------- |
| **Consensus**       | Consensus threshold | Stake-weighted median of weights per neuron | [0, 1] | Higher = stronger validator agreement       |
| **Ranks**           | Performance scoring | Stake-weighted sum of clipped weights       | [0, 1] | Higher = better performance after consensus |
| **Trust**           | Consensus alignment | Final rank / Pre-rank                       | [0, 1] | 1.0 = no clipping, < 1.0 = some clipping    |
| **Validator Trust** | Validator influence | Sum of clipped weights per validator        | [0, 1] | Higher = more consensus-aligned validator   |

**Source**:

- [`bittensor/bittensor/core/metagraph.py:380-393`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/metagraph.py#L380-393)
- [`subtensor/pallets/subtensor/src/epoch/run_epoch.rs:608`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs#L608)

The relationship between these metrics creates a feedback loop: consensus determines weight clipping, which affects ranks and trust, which influences validator trust, which feeds back into future consensus calculations. This system ensures that the network rewards neurons with strong validator agreement while penalizing those with controversial or outlier weight assignments, creating a robust mechanism for maintaining network quality and security.

## U

### UID Slot

A position occupied by a subnet miner or subnet validator within a subnet, identified by a unique UID. The UID is assigned to a hotkey when it is registered in a subnet, allowing the hotkey to participate as a subnet validator or subnet miner.

**See also:** [Subnet Miners](../miners/), [Subnet Validators](../validators/), [Working with Subnets](../subnets/working-with-subnets.md)

### Unstaking

The process of withdrawing staked TAO from a validator hotkey, converting subnet-specific alpha tokens back to TAO through the subnet's automated market maker (AMM). Unstaking operations are subject to slippage—the transaction impacts pool prices, with larger amounts experiencing more slippage. Bittensor provides price protection mechanisms including tolerance limits and partial execution options to guard against unfavorable exchange rates.

When you unstake:

1. Alpha tokens are removed from the validator's hotkey and added to the subnet's alpha reserves
2. The AMM calculates equivalent TAO using the current exchange rate
3. TAO is removed from the subnet's TAO reserves and transferred to your coldkey

Unstaking incurs blockchain transaction fees, which are recycled back into the TAO emission pool.

**See also:**

- [Staking/Delegation overview](../staking-and-delegation/delegation.md#unstaking)
- [Managing Stake with btcli](../staking-and-delegation/managing-stake-btcli.md#unstaking-with-btcli)
- [Managing Stake with SDK](../staking-and-delegation/managing-stake-sdk.md#unstaking-from-a-validator)
- [Understanding Pricing and Anticipating Slippage](../learn/slippage.md)
- [Price Protection When Staking](../learn/price-protection.md)
- [Transaction Fees](../learn/fees.md)

## V

### Validator Permit

A boolean flag indicating whether a specific neuron has validation rights within a subnet. Validator permits are awarded to the top K neurons by stake weight and are required for setting weights and participating in consensus.

**See also:** [VPermit](#vpermit), [Validator Requirements](../validators/index.md#requirements-for-validation), [Stake Weight](#stake-weight)

### VPermit

A list of subnet IDs (netuids) indicating which subnets a delegate is authorized to validate on. VPermits are delegate-level permissions that aggregate individual validator permits across multiple subnets, allowing delegates to participate in validation activities on specific subnets.

**See also:** [Validator Permits](#validator-permit), [Delegation](../staking-and-delegation/delegation.md), [Validator Requirements](../validators/index.md#requirements-for-validation)

### Validator (or subnet validator) {#subnet-validator}

A type of node in a subnet that evaluates the performance of miners and sets weights based on their output

**See also:**

- [Validating in Bittensor](../validators/)
- [Browse validators on TAO.app](https://www.tao.app/validators)

### Validator Trust

A specialized trust metric for validator neurons that measures their influence in the consensus process. Validator trust is calculated as the sum of all clipped weights set by each validator across all neurons, indicating how much weight a validator successfully contributed to consensus.

**See also:** [Yuma Consensus](../learn/yuma-consensus.md), [Subnet Metagraph](../subnets/metagraph.md), [Validator-Miner Bonds](#validator-miner-bonds)

**Basic Concept:**
Validator trust specifically measures validator neurons' influence in the consensus process. It represents how much weight each validator successfully contributed to the consensus after weight clipping, providing insight into validator alignment with network consensus.

**Mathematical Definition:**
For each validator $i$, the validator trust $T_{vi}$ is calculated as:
$$T_{vi} = \sum_{j \in \text{neurons}} \overline{W_{ij}}$$

Where:

- $\overline{W_{ij}}$ is the consensus-clipped weight from validator $i$ to neuron $j$
- The sum is taken over all neurons in the subnet
- Validator trust measures the total influence a validator has in consensus

**Calculation Process:**

1. **Weight setting**: Validators set weights to all neurons in the subnet
2. **Consensus calculation**: Stake-weighted median of weights per neuron (consensus threshold)
3. **Weight clipping**: Weights clipped at consensus threshold to remove outliers
4. **Validator trust calculation**: Sum of all clipped weights set by each validator

**Properties and Interpretation:**

- **Range**: [0, 1] normalized values
- **High Validator Trust**: Values close to 1 indicate strong consensus alignment
- **Low Validator Trust**: Values close to 0 indicate outlier weight assignments
- **Validator Influence**: Higher validator trust means more influence in consensus decisions

**Network Security Properties:**

- **Consensus Alignment**: Validator trust measures how well validators align with consensus
- **Outlier Detection**: Low validator trust indicates potential manipulation attempts
- **Validator Quality**: High validator trust indicates quality validation services
- **Economic Incentives**: Validator trust influences validator rewards and bond retention

**Source**:

- [`bittensor/bittensor/core/metagraph.py:397-409`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/metagraph.py#L397-409)
- [`subtensor/pallets/subtensor/src/epoch/run_epoch.rs:600`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs#L600)

**Relationship to Other Metrics:**

- **Validator Trust vs Trust**: Validator trust is per-validator, Trust is per-neuron
- **Validator Trust vs Consensus**: Validator trust measures validator influence in consensus
- **Validator Trust vs Ranks**: Validator trust influences rank calculation through consensus
- **Validator Trust vs Bonds**: Validator trust affects bond retention and validator permits

### Validator-Miner Bonds

Bonds represent the "investment" a validator has made in evaluating a specific miner. This bonding mechanism uses [Exponential Moving Average (EMA)](#exponential-moving-average-ema) to smooth bond evolution over time, integral to the Yuma Consensus' design intent of incentivizing high-quality performance by miners, and honest evaluation by validators.

**Bond Formation Process:**

**1. Instant Bond Calculation:**
The instant bond $\Delta B_{ij}$ of validator $i$ to miner $j$ is calculated as:
$$\Delta B_{ij} = \frac{S_i \cdot \widetilde{W_{ij}}}{\sum_{k \in \mathbb{V}} S_k \cdot \widetilde{W_{kj}}}$$

Where:

- $S_i$ is validator $i$'s stake
- $\widetilde{W_{ij}}$ is the bond-weight (penalty-adjusted weight)
- The denominator normalizes by the total bond-weight for miner $j$ across all validators

**2. Bond-Weight Calculation:**
Bond-weights are penalized when validators overstate miner performance:
$$\widetilde{W_{ij}} = (1-\beta)W_{ij} + \beta\overline{W_{ij}}$$

Where:

- $W_{ij}$ is the original weight set by validator $i$ for miner $j$
- $\overline{W_{ij}}$ is the consensus-clipped weight
- $\beta$ is the bonds penalty factor (configurable hyperparameter)

**3. Exponential Moving Average (EMA) Bonds:**
Instant bonds are smoothed over time using [EMA](#exponential-moving-average-ema) to prevent abrupt changes:
$$B_{ij}^{(t)} = \alpha \Delta B_{ij} + (1-\alpha)B_{ij}^{(t-1)}$$

Where $\alpha$ is the EMA smoothing factor (see [Exponential Moving Average](#exponential-moving-average-ema) for details).

**Bond Mechanics and Design:**

**Consensus Alignment:**

- Validators who stay near consensus build stronger EMA bonds
- Bonds are penalized when validators overstate miner performance
- The EMA smooths out abrupt swings in validator behavior
- Bonds incentivize consistent alignment with consensus

**Bond Retention:**

- Neurons retain bonds only if they keep validator permits
- Bonds are cleared when neurons lose validator permits
- Bonds are stored as sparse matrices in blockchain state

**Bond Decay:**

- Bonds decay over time using [EMA](#exponential-moving-average-ema) with the `bonds_moving_avg` parameter
- Higher decay rates (larger α) make bonds more responsive to recent performance
- Lower decay rates (smaller α) allow bonds to persist longer

**Economic Alignment:**

- Bonds create long-term relationships between validators and miners
- Validators are incentivized to discover and support promising miners early
- Bond strength reflects validator confidence in miner performance

**Dynamic Adjustment:**

- Bonds adapt to changing network conditions and consensus
- EMA smoothing prevents exploitation of rapid bond changes
- Bonds provide stability while allowing for network evolution

**Retrieval:**

- Bonds can be queried via the `bonds()` method in the Subtensor API
- Metagraph includes bonds matrix accessible via `metagraph.B` property
- Bonds are included in neuron information structures

**Related hyperparameters:**

- `bonds_penalty`: Controls penalty for out-of-consensus weights (0-65535)
- `bonds_moving_avg`: Controls bond decay rate (typically 900,000)
- `liquid_alpha_enabled`: Enables dynamic alpha adjustment for bonds

**Validator Permits:**

- Bonds are retained only by neurons with validator permits
- Loss of validator permit clears all bonds for that neuron
- Bonds align with permit retention for economic security

**Emission Distribution:**

- Bonds directly determine validator emission shares
- Strong bonds lead to higher validator rewards
- Bonds create market-based incentive alignment

**Code References:**

- [Bond calculation in epoch execution]https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs:631)
- [EMA bond computation]https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/math.rs:1475)
- [Bonds API method]https://github.com/opentensor/subtensor/blob/main/bittensor/core/async_subtensor.py:931)
- [Bonds storage definition]https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs:1560)

**See also:** [Yuma Consensus](../learn/yuma-consensus), [Emissions](../learn/emissions)

### Validator Take %

The percentage of emissions a validator takes, of the portion that depends on delegated stake (not including their emissions in proportion to their own self-stake), before the remainder is extracted back to the stakers.

Effectively, this represents the fee percentage that validators charge delegators for validation services.

**See also:** [Emissions](../learn/emissions.md)

## W

### Wallet Address

A unique identifier derived from the public key, used as a destination for sending and receiving TAO tokens in the Bittensor network.

**See also:** [Wallets](../keys/wallets.md), [Working with Keys](../keys/working-with-keys.md)

### Wallet Location

The directory path where the generated Bittensor wallets are stored locally on the user's machine.

**See also:** [Wallets](../keys/wallets.md), [Installation](../getting-started/installation.md)

### Weight Copying

A free-riding exploit possible for validators, which can be guarded against using Commit Reveal.

### Weight Matrix

A matrix formed from the ranking weight vectors of all subnet validators in a subnet, used as input for the Yuma Consensus module to calculate emissions to that subnet. When multiple incentive mechanisms are used, each mechanism has its own weight matrix for independent consensus calculations.

**See also:** [Yuma Consensus](../learn/yuma-consensus.md), [Consensus-Based Weights](../concepts/consensus-based-weights.md), [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets)

### Weight Vector

A vector maintained by each subnet validator, with each element representing the weight assigned to a subnet miner based on its performance. When multiple incentive mechanisms are used, validators maintain separate weight vectors for each mechanism.

The ranking weight vectors for each subnet are transmitted to the blockchain, where they combine to form the [weight matrix](#weight-matrix) (or matrices when multiple mechanisms are used) that is input for Yuma Consensus.

**See also:** [Consensus-Based Weights](../concepts/consensus-based-weights.md), [Yuma Consensus](../learn/yuma-consensus.md), [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets)

## Y

### Yuma Consensus

The consensus mechanism in the Bittensor blockchain that computes emissions to participants.

**See also:** [Yuma Consensus](../learn/yuma-consensus.md)
