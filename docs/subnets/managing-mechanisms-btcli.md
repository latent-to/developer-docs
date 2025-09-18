---
title: "Managing Multiple Incentive Mechanisms with BTCLI"
---

# Managing Multiple Incentive Mechanisms with BTCLI

This guide shows subnet owners how to configure and manage multiple incentive mechanisms within a single subnet using the Bittensor CLI (BTCLI). For background on the concepts, see [Understanding Multiple Incentive Mechanisms](understanding-multiple-mech-subnets). For SDK-based management, see [Managing Mechanisms with SDK](managing-mechanisms-with-sdk).

## Overview

BTCLI provides convenient commands for managing multiple incentive mechanisms:
- `btcli subnet mech count` - Check the number of active mechanisms
- `btcli subnet mech set` - Change the number of mechanisms
- `btcli subnet mech emissions` - View current emission distribution
- `btcli subnet mech emissions-split` - Configure emission distribution
- `btcli subnet metagraph --mechid` - View mechanism-specific metagraph data

:::info Prerequisites
- BTCLI installed and configured
- Subnet owner wallet with sufficient permissions
- Understanding of [multiple incentive mechanism concepts](understanding-multiple-mech-subnets)
:::

## Command Reference

### 1. Checking Mechanism Count

Display the total number of active mechanisms in a subnet:

```bash
btcli subnet mech count --netuid <NETUID>
```

**Example Output:**

When subnet has no additional mechanisms:
```
Subnet 14 currently has 1 mechanism.
(Tip: 1 mechanism means there are no mechanisms beyond the main subnet)
```

When subnet has multiple mechanisms:
```
Subnet 14 currently has 3 mechanisms.
(Tip: 1 mechanism means there are no mechanisms beyond the main subnet)
```

**Options:**
- `--netuid INTEGER`: The subnet ID to query
- `--network TEXT`: Network to connect to (finney, test, local)
- `--json`: Output results in JSON format

### 2. Setting Mechanism Count

Change the number of mechanisms in a subnet (increase or decrease):

```bash
btcli subnet mech set --netuid <NETUID> --count <COUNT>
```

**Examples:**

Increasing from 1 to 2 mechanisms:
```bash
btcli subnet mech set --netuid 14 --count 2
```

Decreasing from 2 back to 1:
```bash
btcli subnet mech set --netuid 14 --count 1
```

**Options:**
- `--netuid INTEGER`: The subnet ID to modify
- `--count INTEGER`: New number of mechanisms (minimum 1)
- `--wallet-name TEXT`: Name of the subnet owner wallet
- `--hotkey TEXT`: Hotkey of the subnet owner wallet
- `--wait-for-inclusion`: Wait for transaction inclusion
- `--wait-for-finalization`: Wait for transaction finalization
- `--json`: Output results in JSON format

:::warning Rate Limiting
Mechanism count changes are rate-limited to once per 7200 blocks (~24 hours) to prevent frequent changes.
:::

### 3. Viewing Emission Distribution

Check the current emission split between mechanisms:

```bash
btcli subnet mech emissions --netuid <NETUID>
```

**Example Outputs:**

No additional mechanisms present:
```
Subnet 14 does not currently contain any mechanisms.
```

Custom emission split defined:
```
                    Subnet 14 emission split                    
┌─────────────────┬──────────────┬─────────────┐
│ Mechanism Index │ Weight (u16) │ Share (%)   │
├─────────────────┼──────────────┼─────────────┤
│        0        │    39321     │  60.000000  │
│        1        │    19660     │  30.000000  │
│        2        │     6554     │  10.000000  │
├─────────────────┼──────────────┼─────────────┤
│     Total       │    65535     │ 100.000000  │
└─────────────────┴──────────────┴─────────────┘
Totals are expressed as a fraction of 65535 (U16_MAX).
```

Default equal distribution (when no custom split is set):
```
                    Subnet 14 emission split                    
┌─────────────────┬──────────────┬─────────────┐
│ Mechanism Index │ Weight (u16) │ Share (%)   │
├─────────────────┼──────────────┼─────────────┤
│        0        │    32767     │  49.999847  │
│        1        │    32768     │  50.000153  │
├─────────────────┼──────────────┼─────────────┤
│     Total       │    65535     │ 100.000000  │
└─────────────────┴──────────────┴─────────────┘
Totals are expressed as a fraction of 65535 (U16_MAX).
No custom split found; displaying an even distribution.
```

**Options:**
- `--netuid INTEGER`: The subnet ID to query
- `--json`: Output results in JSON format

### 4. Setting Emission Distribution

Configure how emissions are split between mechanisms:

```bash
btcli subnet mech emissions-split --netuid <NETUID> --split <VALUES>
```

**Input Formats:**

You can provide values in two formats:

1. **Percentages** (easier to understand):
```bash
btcli subnet mech emissions-split --netuid 14 --split "60,30,10"
```

2. **Raw u16 values** (0-65535):
```bash
btcli subnet mech emissions-split --netuid 14 --split "39321,19660,6554"
```

**Interactive Mode:**

Run without `--split` to enter interactive mode:

```bash
btcli subnet mech emissions-split --netuid 14
```

The CLI will prompt for each mechanism's weight:
```
You either provide U16 values or percentages.
Relative weight for Main Mechanism (1) (current: 32767 ~ 50.00%): 60
Relative weight for Mechanism 2 (current: 32768 ~ 50.00%): 30
Relative weight for Mechanism 3 (current: 0 ~ 0.00%): 10
```

**Example Output:**
```
                     Proposed emission split                     
                          Subnet 14                          
┌─────────────────┬──────────────┬─────────────┐
│ Mechanism Index │ Weight (u16) │ Share (%)   │
├─────────────────┼──────────────┼─────────────┤
│        0        │    39321     │  60.000000  │
│        1        │    19660     │  30.000000  │
│        2        │     6554     │  10.000000  │
├─────────────────┼──────────────┼─────────────┤
│     Total       │    65535     │ 100.000000  │
└─────────────────┴──────────────┴─────────────┘

Proceed with these emission weights? [Y/n]: y
✓ Emission split updated for subnet 14
```

**Options:**
- `--netuid INTEGER`: The subnet ID to modify
- `--split TEXT`: Comma-separated values (percentages or u16)
- `--wallet-name TEXT`: Name of the subnet owner wallet
- `--hotkey TEXT`: Hotkey of the subnet owner wallet
- `--wait-for-inclusion`: Wait for transaction inclusion
- `--wait-for-finalization`: Wait for transaction finalization
- `--json`: Output results in JSON format

### 5. Viewing Mechanism-Specific Metagraph

The `metagraph` command has been updated to support mechanism-specific data:

```bash
btcli subnet metagraph --netuid <NETUID> --mechid <MECHANISM_ID>
```

**Interactive Mechanism Selection:**

When multiple mechanisms exist, BTCLI will prompt for mechanism selection:

For subnet with 2 mechanisms:
```bash
btcli subnet metagraph --netuid 14
```
```
Select mechanism ID for subnet 14:
[0] Mechanism 0 (Main)
[1] Mechanism 1
Enter mechanism ID [0-1]: 1
```

For subnet with 1 mechanism:
```bash
btcli subnet metagraph --netuid 1
```
```
Subnet 1 has only 1 mechanism. Using mechanism 0.
```

**Options:**
- `--netuid INTEGER`: The subnet ID to query
- `--mechid INTEGER`: Specific mechanism ID to view
- All standard metagraph options (sorting, formatting, etc.)

## Common Workflows

### 1. Initial Setup: Creating Multiple Mechanisms

```bash
# Step 1: Check current mechanism count
btcli subnet mech count --netuid 14

# Step 2: Increase to 3 mechanisms
btcli subnet mech set --netuid 14 --count 3 \
  --wallet-name subnet_owner \
  --hotkey owner_hotkey

# Step 3: Verify the change
btcli subnet mech count --netuid 14

# Step 4: Check default emission distribution
btcli subnet mech emissions --netuid 14
```

### 2. Configuring Custom Emission Split

```bash
# View current distribution
btcli subnet mech emissions --netuid 14

# Set custom distribution: 50%, 30%, 20%
btcli subnet mech emissions-split --netuid 14 \
  --split "50,30,20" \
  --wallet-name subnet_owner \
  --hotkey owner_hotkey

# Verify the new distribution
btcli subnet mech emissions --netuid 14
```

### 3. Monitoring Mechanism Performance

```bash
# Check mechanism-specific metagraphs
btcli subnet metagraph --netuid 14 --mechid 0
btcli subnet metagraph --netuid 14 --mechid 1
btcli subnet metagraph --netuid 14 --mechid 2

# Compare emission distributions over time
btcli subnet mech emissions --netuid 14 --json > emissions_$(date +%Y%m%d).json
```

### 4. Gradual Migration Strategy

```bash
# Start with 2 mechanisms
btcli subnet mech set --netuid 14 --count 2 \
  --wallet-name subnet_owner

# Initially set equal split
btcli subnet mech emissions-split --netuid 14 \
  --split "50,50" \
  --wallet-name subnet_owner

# After validators adapt, rebalance
btcli subnet mech emissions-split --netuid 14 \
  --split "70,30" \
  --wallet-name subnet_owner
```

## JSON Output Examples

All commands support `--json` flag for programmatic use:

### Mechanism Count (JSON)
```bash
btcli subnet mech count --netuid 14 --json
```
```json
{
  "netuid": 14,
  "count": 3,
  "error": ""
}
```

### Emission Split (JSON)
```bash
btcli subnet mech emissions --netuid 14 --json
```
```json
{
  "netuid": 14,
  "raw_count": 3,
  "visible_count": 2,
  "split": [39321, 19660, 6554],
  "percentages": [60.0, 30.0, 10.0],
  "even_distribution": false
}
```

### Setting Emission Split (JSON)
```bash
btcli subnet mech emissions-split --netuid 14 \
  --split "60,30,10" --json --no-prompt
```
```json
{
  "success": true,
  "err_msg": "",
  "split": [39321, 19660, 6554],
  "percentages": [60.0, 30.0, 10.0]
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Permission Denied

**Error:**
```
Subnet with netuid 14 does not exist.
```

**Solutions:**
- Verify the subnet exists: `btcli subnet list`
- Ensure you're using the correct network: `--network finney`
- Check your wallet owns the subnet

#### 2. Rate Limiting

**Error:**
```
Cannot change mechanism count: subnet is in admin freeze window
```

**Solutions:**
- Wait 7200 blocks (~24 hours) since the last mechanism count change
- Check freeze status with SDK: `subtensor.is_in_admin_freeze_window(netuid)`

#### 3. Invalid Split Values

**Error:**
```
Expected 3 weight values, received 2.
```

**Solutions:**
- Ensure split values match the number of mechanisms
- Check mechanism count first: `btcli subnet mech count --netuid <NETUID>`
- Use correct format: comma-separated values without spaces

#### 4. Wallet Configuration

**Error:**
```
Wallet not found: subnet_owner
```

**Solutions:**
```bash
# List available wallets
btcli wallet list

# Use correct wallet name and hotkey
btcli subnet mech set --netuid 14 --count 2 \
  --wallet-name correct_name \
  --hotkey correct_hotkey
```

#### 5. Network Connection Issues

**Error:**
```
Failed to connect to network
```

**Solutions:**
```bash
# Specify network explicitly
btcli subnet mech count --netuid 14 --network finney

# Try different endpoints
btcli subnet mech count --netuid 14 \
  --subtensor.chain_endpoint wss://entrypoint-finney.opentensor.ai:443
```

### Verification Commands

Always verify changes after making them:

```bash
# Verify mechanism count
btcli subnet mech count --netuid 14

# Verify emission distribution
btcli subnet mech emissions --netuid 14

# Check subnet info
btcli subnet show --netuid 14

# View mechanism-specific data
btcli subnet metagraph --netuid 14 --mechid 0
btcli subnet metagraph --netuid 14 --mechid 1
```

## Best Practices

### 1. Testing on Testnet

Always test mechanism changes on testnet first:

```bash
# Test on testnet
btcli subnet mech set --netuid 14 --count 2 \
  --network test \
  --wallet-name test_wallet
```

### 2. Gradual Implementation

1. **Start Simple**: Begin with 2 mechanisms
2. **Equal Split**: Use 50/50 distribution initially
3. **Monitor**: Watch validator participation
4. **Adjust**: Fine-tune based on performance

### 3. Documentation

Keep records of your changes:

```bash
# Save current state before changes
btcli subnet mech emissions --netuid 14 --json > pre_change_$(date +%Y%m%d).json

# Document reasoning for changes
echo "Changed to 60/30/10 split to incentivize text generation" > change_log.txt
```

### 4. Monitoring

Set up regular monitoring:

```bash
#!/bin/bash
# monitor_mechanisms.sh
NETUID=14

echo "=== Mechanism Status Report $(date) ===" 
btcli subnet mech count --netuid $NETUID
btcli subnet mech emissions --netuid $NETUID
echo "========================================="
```

### 5. Backup Strategy

Always have a rollback plan:

```bash
# Before making changes, note current settings
btcli subnet mech count --netuid 14
btcli subnet mech emissions --netuid 14 --json > backup_emissions.json

# If needed, restore previous settings
# (manually extract values from backup_emissions.json)
```

## Summary

BTCLI provides powerful and user-friendly commands for managing multiple incentive mechanisms:

- **`mech count`**: Quick mechanism count checks
- **`mech set`**: Easy mechanism count changes
- **`mech emissions`**: Clear emission distribution views
- **`mech emissions-split`**: Flexible emission configuration
- **`metagraph --mechid`**: Mechanism-specific data analysis

The interactive prompts and clear output formatting make BTCLI ideal for subnet owners who prefer command-line tools over programmatic SDK approaches. Always test changes on testnet first and monitor validator participation across all mechanisms.
