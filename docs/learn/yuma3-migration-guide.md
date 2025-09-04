---
title: "Yuma Consensus 3 (YC3) Migration Guide"
---

# Yuma Consensus 3 (YC3) Migration Guide

Yuma Consensus 3 (YC3) is the latest version of the Yuma Consensus mechanism with significant improvements to validator fairness, bond mechanics, and precision handling. This guide will help subnet owners understand what's changed and how to migrate.

See also:

- [How Yuma Consensus 3 Makes Bittensor More Fair](./yc3-blog.md) - Technical deep dive and mathematical foundations
- [Subnet Hyperparameters](../subnets/subnet-hyperparameters.md) - Complete parameter reference
- [Yuma Consensus](./yuma-consensus.md) - Understanding the consensus mechanism
- [Subnet Creation](../subnets/create-a-subnet.md) - Creating new subnets with YC3

## What is YC3?

YC3 is a drop-in replacement for the existing Yuma Consensus mechanism that addresses several critical issues while maintaining backward compatibility. Most subnet owners won't need to make any changes - the upgrade is designed to be seamless.

The most significant innovation in YC3 is per-bond EMA scaling: each validator-miner bond pair now gets its own adjustment rate (alpha value) rather than using a single rate for all bonds. This allows individual relationships to evolve at different speeds based on performance and consensus differences.

## Timeline

- Current: YC3 is live and being adopted by subnets
- There is no forced migration deadline - subnets can adopt when ready

## Key Improvements in YC3

### 1. Fair Validator Treatment

- Problem Fixed: Small validators were previously penalized simply for being small due to rounding issues.
- YC3 Solution: Bond values are now computed using fixed-point arithmetic and converted to u16 for storage efficiency, allowing precise fractional relationships while maintaining a 0-65535 storage scale.

### 2. Bond Precision Issues

- Problem Fixed: 16-bit integer precision was insufficient for bond accumulation, causing some validators to receive no bonds despite giving weight to miners.
- YC3 Solution: Enhanced precision handling with fixed-point arithmetic ensures all validators receive appropriate bond allocations.

### 3. Bond Upscaling and Decay

- Problem Fixed: Bond upscaling when consensus equals zero was causing unfair distributions.
- YC3 Solution: Fixed bond mechanics with enhanced EMA smoothing ensure more predictable and fair reward distribution.

### 4. Early Recognition Rewards

- New Feature: Validators who identify promising miners before they become widely recognized can now start accumulating bonds early.
- Technical Implementation: The alpha sigmoid function calculates adjustment rates based on the difference between a validator's current weights and network consensus.

### 5. Enhanced Tunability

- New Feature: Additional parameters allow subnet owners to fine-tune their consensus mechanisms
- Backward Compatible: Existing subnets continue to work with default settings

## Migration Process

:::tip no-op
Validators and miners do not need to update their code.
:::

### Subnet Creators

Your subnet will continue to function as before until YC3 is enabled.

To upgrade your subnet to YC3, use the coldkey with subnet creator permissions to run:

```
btcli sudo set --param yuma3_enabled
```

### Liquid Alpha Integration

YC3 works with Liquid Alpha when specific conditions are met:

1. Liquid Alpha must be enabled for the subnet
2. Consensus values must exist and contain non-zero values
3. The network must have sufficient activity

When these conditions are satisfied, validators receive additional rewards for voting for miners that aren't yet receiving votes from others.

```bash
# Enable Liquid Alpha
btcli sudo set --param liquid_alpha_enabled --value true --netuid YOUR_NETUID
```

## New Tunable Parameters

YC3 introduces additional hyperparameters for advanced subnet customization:

### Alpha Sigmoid Steepness

Controls the steepness of the alpha sigmoid function, affecting reward distribution curves and how quickly bonds adjust to weight changes.

```bash
# Set alpha sigmoid steepness
btcli sudo set --param alpha_sigmoid_steepness --value YOUR_VALUE --netuid YOUR_NETUID
```

### Bonds Moving Average

The adjustment rate is controlled by the bonds moving average parameter, which can be configured up to 97.5% (meaning bonds change by 2.5% per epoch toward their target values).

```bash
# Adjust bond smoothing (typical value: 975000 for 2.5% per epoch)
btcli sudo set --param bonds_moving_avg --value 975000 --netuid YOUR_NETUID
```

### Alpha High/Low Parameters

Fine-tune the range of alpha values used in the sigmoid function:

```bash
# Set alpha range parameters
btcli sudo set --param alpha_high --value YOUR_VALUE --netuid YOUR_NETUID
btcli sudo set --param alpha_low --value YOUR_VALUE --netuid YOUR_NETUID
```
