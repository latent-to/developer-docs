import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Commit Reveal

This page describes the **commit reveal** feature: a configurable waiting period that elapses between a) when consensus weights set by subnet validators are first committed, and b) when they are revealed publicly and included in Yuma Consensus.

This feature was designed to address the issue of _weight copying_ by validators.

## Overview

Commit reveal uses **[Drand time-lock encryption](https://drand.love/docs/timelock-encryption/)** to automatically reveal validator weights after a concealment period. When a validator sets weights, they are cryptographically encrypted and can only be decrypted after the configured number of tempos has passed. This automation eliminates the need for manual reveals and prevents selective revelation attacks.

**For validators**: The commit reveal process is completely transparent. You continue to call [`set_weights`](pathname:///python-api/html/autoapi/bittensor/core/extrinsics/set_weights/index.html) exactly as you always have. All commit-reveal logic happens behind the scenes at the chain level.

## Weight copying

In each Bittensor subnet, each validator scores&mdash;or _'weights'_&mdash;each miner, producing what is referred to as a [weight vector](../resources/glossary.md#weight-vector). The weight vectors for each validator in a subnet are combined into a weight matrix. This matrix determines emissions to miners in the subnet based on the consensus evaluation of their performance, according to [Yuma Consensus](../resources/glossary.md#yuma-consensus).

The weight matrix is public information, and must be, so that emissions in the Bittensor platform can be transparently fair. However, this transparency makes it possible for subnet validators to free-ride on the work of other validators by copying the latest consensus rather than independently evaluating subnet miners. This is unfair and potentially degrades the quality of validation work, undermining Bittensor's ability to incentivize the best miners and produce the best digital commodities overall.

The commit reveal feature is designed to solve the weight copying problem by giving would-be weight copiers access only to stale weights. Copying stale weights should result in validators departing from consensus. However, it is critical to note that this only works if the consensus weight matrix changes sufficiently on the time scale of the commit reveal interval. If the demands on miners are too static, and miner performance is very stable, weight copying will still be successful. The only solution for this is to demand continuous improvement from miners, requiring them to continuously evolve to maintain their scoring. Combined with a properly tuned Commit Reveal interval, this will keep validators honest, as well as producing the best models.

## Commit Reveal and Immunity Period

The [Immunity Period](../resources/glossary.md#immunity-period) is the interval (measured in blocks) during which a miner or validator newly registered on a subnet is 'immune' from deregistration due to performance. The duration of this period value should always be larger than the Commit Reveal interval, otherwise the immunity period will expire before a given miner's scores are available, and they may be deregistered without having their work counted.

When creating a new subnet, ensure that the miner immunity period is larger than the commit reveal interval. When updating the immunity period or commit reveal interval hyperparameters for a subnet, use the following formula:

```
new_immunity_period = (new_commit_reveal_period x tempo - old_commit_reveal_period x tempo) + old_immunity_period
```

See [Subnet Hyperparameters](../subnets/subnet-hyperparameters.md).

## How commit reveal works

When commit reveal is enabled for a subnet, the following process occurs automatically:

### 1. Validator Sets Weights

A subnet validator calls [`set_weights`](pathname:///python-api/html/autoapi/bittensor/core/extrinsics/set_weights/index.html) exactly as they normally would. No code changes are required.

### 2. Automatic Commit with Time-Lock Encryption

Instead of publishing weights openly, the chain automatically:
- Encrypts the weights using **[Drand time-lock encryption](https://drand.love/docs/timelock-encryption/)**
- Commits the encrypted weights to the blockchain via an internal method called [`commit_weights`](pathname:///python-api/html/autoapi/bittensor/core/extrinsics/commit_weights/index.html)
- Calculates the target Drand round based on the current block and `commit_reveal_period`

The encrypted weights cannot be decrypted by anyone—including the validator who submitted them—until the designated Drand round is reached.

:::tip Tempo is a hyperparameter
The subnet's tempo is a hyperparameter. Subnet owners cannot modify this parameter, which defaults to `360` blocks.
:::

### 3. Concealment Period

A waiting interval, specified as a number of tempos, elapses. Subnet owners configure this interval with the `commit_reveal_period` hyperparameter. During this time:
- The weights remain encrypted on-chain
- No one can view or copy the weights
- The validator does not need to take any action

### 4. Automatic Reveal

After the `commit_reveal_period` has elapsed, the chain automatically decrypts and reveals the weights at the beginning of the next tempo. This happens when the corresponding Drand randomness beacon pulse becomes available, providing the cryptographic key needed to unlock the time-locked encryption.

**Key security property**: The reveal timing is cryptographically guaranteed by the Drand network—a decentralized randomness beacon. No single party can prevent or delay the reveal once weights are committed.

### 5. Consensus Processing

The revealed weights are now publicly visible and input into Yuma Consensus for the next epoch calculation, just as if they had been submitted without commit reveal.

<br />
:::tip Completely transparent to validators
After a subnet owner enables commit reveal, validators don't need to change anything. They continue calling [`set_weights`](pathname:///python-api/html/autoapi/bittensor/core/extrinsics/set_weights/index.html) as always. All encryption, time-locking, and automatic revealing happens at the chain level.
:::

## Benefits of automatic commit reveal

The Drand-based automatic reveal system provides several important benefits:

1. **No manual reveals required**: Validators don't need to remember to reveal weights or maintain uptime for reveals
2. **Eliminates selective revelation**: Validators cannot choose not to reveal if they see unfavorable consensus forming
3. **Cryptographic guarantees**: Time-lock encryption ensures weights are revealed on schedule
4. **Reduced transaction costs**: No separate reveal transaction is needed
5. **Trustless operation**: Drand is a decentralized network; no single party controls reveal timing

<center>
<ThemedImage
alt="'Commit Reveal v4 Sequence Diagram'"
sources={{
    light: useBaseUrl('/img/docs/commit-reveal-v4-sequence.png'),
    dark: useBaseUrl('/img/docs/commit-reveal-v4-sequence.png'),
}}
style={{width: '100%', maxWidth: 900}}
/>
</center>

<br />

This detailed sequence diagram shows the CRv4 process across three tempos. Key observations:
- **Drand pulse** triggers automatic reveals at block 1005, 1105, 1205 (shortly after each tempo starts)
- **Commit window** is blocks 1090-1099 of each tempo (last 10 blocks)
- **Concealment period** protects weights during the tempo
- **Epoch calculation** uses revealed weights at block 1100, 1200, etc.

## Configuring commit reveal

As a subnet owner, you can enable and configure commit reveal using two hyperparameters:

### Hyperparameters

1. **`commit_reveal_weights_enabled`** (boolean)
   - Set to `True` to activate commit reveal for your subnet
   - Default: `False` (disabled)
   - When enabled, all validator weights are automatically committed with time-lock encryption

2. **`commit_reveal_period`** (integer)
   - The number of tempos that must elapse before weights are revealed
   - Default: `1` (weights revealed after 1 tempo)
   - Example: If set to `3`, weights committed in tempo 10 will be revealed at the start of tempo 13

See [Setting subnet hyperparameters](../subnets/subnet-hyperparameters.md#set-hyperparameters) for how to update these values.

### Reveal timing example

Weights will be revealed at the beginning of the tempo after the `commit_reveal_period` has elapsed. The Drand pulse triggers the automatic decryption shortly after the new tempo begins.

**Example**: If `commit_reveal_period` is set to `3`:
- **Tempo 10**: Validator commits weights (encrypted)
- **Tempo 11**: Weights remain concealed
- **Tempo 12**: Weights remain concealed  
- **Tempo 13**: Weights automatically revealed at tempo start

The current tempo when committing counts as tempo 1 in the calculation. Refer to the detailed sequence diagram above for a visual representation of this timing.

:::tip Validator experience
Validators don't see any of this timing complexity. They simply call `set_weights()` whenever they want to update their weights. The chain handles all commit-reveal timing automatically.
:::

:::danger Critical: Immunity period must be longer than commit reveal interval
Ensure that your immunity period is **longer** than your commit reveal interval to avoid unintended miner deregistration. If the immunity period expires before weights are revealed, newly registered miners may be deregistered without having their performance evaluated. See [Commit Reveal and Immunity Period](#commit-reveal-and-immunity-period).
:::

<br />

## What is Drand?

[Drand](https://drand.love) (pronounced "dee-rand") is a distributed randomness beacon network that provides publicly verifiable, unpredictable, and unbiased random numbers. It is operated by the [League of Entropy](https://drand.love/league-of-entropy/), a consortium of independent organizations running Drand nodes.

**Time-lock encryption** is a cryptographic technique where data is encrypted such that it can only be decrypted after a specific time has passed. Drand provides this capability by regularly producing randomness "pulses" at fixed intervals. Data encrypted for a future Drand round cannot be decrypted until that round's randomness is published—even by the person who encrypted it.

Key properties that make Drand suitable for Bittensor:
- **Decentralized**: No single entity controls the randomness generation
- **Verifiable**: Anyone can verify that randomness was generated correctly
- **Predictable timing**: Pulses are produced at regular intervals
- **Industry adoption**: Used by multiple blockchain and cryptographic protocols
- **Open source**: Fully transparent implementation

Learn more: [Drand Time-Lock Encryption documentation](https://drand.love/docs/timelock-encryption/)


## Technical papers and blog

- ACM CCS2024 Poster PDF [Solving the Free-rider Problem In Bittensor](pathname:///papers/ACM_CCS2024_Poster.pdf).
- See [Weight Copying in Bittensor, a technical paper (PDF)](pathname:///papers/BT_Weight_Copier-29May2024.pdf).
- Blog post, [Weight Copying in Bittensor](https://blog.bittensor.com/weight-copying-in-bittensor-422585ab8fa5).

