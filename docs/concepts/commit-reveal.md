---
title: "Commit Reveal"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Commit Reveal

This page describes the **Commit Reveal** feature: a configurable waiting period that elapses between when consensus weights set by subnet validators are first committed, and when they are revealed publicly and included in [Yuma Consensus](../learn/yuma-consensus).


## Overview

In each Bittensor subnet, each validator scores&mdash;or _'weights'_&mdash;each miner, producing what is referred to as a [weight vector](../resources/glossary.md#weight-vector). The weight vectors for each validator in a subnet are combined into a weight matrix. This matrix determines emissions to miners in the subnet based on the consensus evaluation of their performance, according to [Yuma Consensus](../resources/glossary.md#yuma-consensus).

The weight matrix is public information, and must be, so that emissions in the Bittensor platform can be transparently fair. However, this transparency makes it possible for subnet validators to free-ride on the work of other validators by copying the latest consensus rather than independently evaluating subnet miners. This is unfair and potentially degrades the quality of validation work, undermining Bittensor's ability to incentivize the best miners and produce the best digital commodities overall. This is known as the **weight copying problem**.

See [The Weight Copying Problem](./weight-copying-in-bittensor.md).


The Commit Reveal feature is designed to solve the **weight copying problem** by hiding weights until they are stale. Copying stale weights should result in validators departing from consensus.

The Commit Reveal feature uses **[Drand time-lock encryption](https://drand.love/docs/timelock-encryption/)** to automatically reveal validator weights after a concealment period. When a validator sets weights, they are cryptographically encrypted and can only be decrypted after the configured number of tempos has passed. This automation eliminates the need for manual reveals and prevents selective revelation attacks.

However, it is critical to note that this only works if the consensus weight matrix changes sufficiently on the time scale of the Commit Reveal interval. If the demands on miners are too static, and miner performance is very stable, weight copying will still be successful. The primary solution for this is to demand continuous improvement from miners, requiring them to continuously evolve to maintain their scoring. Combined with a properly tuned Commit Reveal interval, this will keep validators honest, as well as producing the best digital commodities generally. If weights change relatively infrequently (such as once per week), Liquid Alpha 2 can be used to deregister weight copiers.

## The Commit Reveal Flow

### Validator Sets Weights

The sequence of events begins when a validator calls [`set_weights`](pathname:///python-api/html/autoapi/bittensor/core/extrinsics/set_weights/index.html), to commit their ratings of the subnet's miners. Validators do not need to do anything different whether or not Commit Reveal is operating.

### Automatic Commit with Time-Lock Encryption

Without Commit Reveal, values are committed openly to the chain.

With Commit Reveal, the chain automatically:
- Encrypts the weights using **[Drand time-lock encryption](https://drand.love/docs/timelock-encryption/)**
- Commits the encrypted weights to the blockchain via an internal method called [`commit_weights`](pathname:///python-api/html/autoapi/bittensor/core/extrinsics/commit_weights/index.html)
- Calculates the target Drand round based on the current block and `commit_reveal_period`

The encrypted weights cannot be decrypted by anyone—including the validator who submitted them—until the designated Drand round is reached.

### Concealment Period

A waiting interval, specified as a number of tempos, elapses. Subnet owners configure this interval with the `commit_reveal_period` hyperparameter. During this time, the weights remain encrypted on-chain and are therefore not included in Yuma Consensus.

### Automatic Reveal

After the `commit_reveal_period` has elapsed, the chain automatically decrypts and reveals the weights at the beginning of the next tempo. This happens when the corresponding Drand beacon pulse becomes available, providing the cryptographic key needed to unlock the time-locked encryption. This use of Drand as the reveal feature gives Commit Reveal a strong cryptographic guarantee.

### Consensus Processing

The revealed weights are now publicly visible and input into Yuma Consensus for the next epoch calculation, just as if they had been submitted without Commit Reveal.



The below diagram shows the Commit Reveal process across three tempos. Key things to note:
- **Drand pulse** triggers automatic reveals at block 1005, 1105, 1205 (shortly after each tempo starts)
- **Commit window** is blocks 1090-1099, 1190-1199, 1290-1299 (last 10 blocks of each tempo)
- **Concealment period** protects weights during the tempo
- **Epoch calculation** uses revealed weights at block 1100, 1200, etc.

<center>
<ThemedImage
alt="'Commit Reveal v4 Sequence Diagram'"
sources={{
    light: useBaseUrl('/img/docs/commit-reveal-v4.svg'),
    dark: useBaseUrl('/img/docs/commit-reveal-v4.svg'),
}}
style={{width: '100%', maxWidth: 900}}
/>
</center>


## Migrating to Commit Reveal

### Validators and Miners

After a subnet owner enables Commit Reveal, validators and miners don't need to change anything. Validators continue calling [`set_weights`](pathname:///python-api/html/autoapi/bittensor/core/extrinsics/set_weights/index.html) as before. All encryption, time-locking, and revealing happens automatically at the chain level.

### Subnet Owners

As a subnet owner, you must enable and configure the Commit Reveal feature using two hyperparameters:

1. **`commit_reveal_weights_enabled`** (boolean)
   - Set to `True` to activate Commit Reveal for your subnet
   - Default: `False` (disabled)
   - When enabled, all validator weights are automatically committed with time-lock encryption

2. **`commit_reveal_period`** (integer)
   - The number of tempos that must elapse before weights are revealed
   - Default: `1` (weights revealed after 1 tempo)
   - Example: If set to `3`, weights committed in tempo 10 will be revealed at the start of tempo 13

See [Setting subnet hyperparameters](../subnets/subnet-hyperparameters.md#set-hyperparameters) for how to update these values.

#### Commit Reveal and the neuron immunity period



The [Immunity Period](../resources/glossary.md#immunity-period) for neurons is the interval (measured in blocks) during which a neuron (miner or validator) newly registered on a subnet is 'immune' from deregistration due to performance. The duration of this period (in blocks) should always be larger than the Commit Reveal interval (in blocks), otherwise the immunity period will expire before a given miner's scores are available, and they may be deregistered without having their work counted.

Note: To compare these values, multiply the `commit_reveal_period` by the `tempo` to get the reveal interval in blocks.

:::danger
Subnet owners must ensure that the miner immunity period (in blocks) is larger than the Commit Reveal interval converted to blocks (commit_reveal_period × tempo).
:::

When updating the immunity period or Commit Reveal interval hyperparameters for a subnet, use the following formula:

**Note**: Both values are in blocks after conversion.

$$
\begin{align}
\text{new immunity period}_{\text{blocks}} &= (\text{new commit\_reveal\_period}_{\text{tempos}} \times \text{tempo}) \\
&\quad - (\text{old commit\_reveal\_period}_{\text{tempos}} \times \text{tempo}) \\
&\quad + \text{old immunity\_period}_{\text{blocks}}
\end{align}
$$

Where:
- $\text{tempo}$ is the subnet's tempo hyperparameter (typically 361 blocks per tempo)
- Values are converted to blocks for the calculation
- Both input and output for immunity_period are in blocks
- Both input and output for commit_reveal_period must be multiplied by tempo to convert to blocks

## Automatic Commit Reveal (added in Commit Reveal 4)

Previous versions of Commit Reveal required validators to explicitly reveal their committed weights in order to input them to Yuma Consensus. This opened an exploit vector where validators could wait until after other weights are revealed, then decide whether or not to reveal their own previously submitted weights for the tempo based on whether or not it would hurt or help vtrust.

The Drand-based automatic reveal system prevents that exploit, and more generally provides several important benefits:

1. **No manual reveals required**: Validators don't need to remember to reveal weights or maintain uptime for reveals
2. **Eliminates selective revelation**: Validators cannot choose not to reveal if they see unfavorable consensus forming
3. **Cryptographic guarantees**: Time-lock encryption ensures weights are revealed on schedule
4. **Reduced transaction costs**: No separate reveal transaction is needed
5. **Trustless operation**: Drand is a decentralized network; no single party controls reveal timing

<center>
<ThemedImage
alt="'Commit Reveal v2 Sequence Diagram'"
sources={{
    light: useBaseUrl('/img/docs/commit-reveal-v2.svg'),
    dark: useBaseUrl('/img/docs/commit-reveal-v2.svg'),
}}
style={{width: '100%', maxWidth: 900}}
/>
</center>

