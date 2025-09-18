---
title: "Managing Multiple Incentive Mechanisms with BTCLI"
---

# Managing Multiple Incentive Mechanisms with BTCLI

This tutorial shows how to configure and manage multiple incentive mechanisms in a single subnet using BTCLI through a real, end-to-end flow. For background on the concepts, see [Understanding Multiple Incentive Mechanisms](understanding-multiple-mech-subnets). For SDK-based management, see [Managing Mechanisms with SDK](managing-mechanisms-with-sdk).

## What you'll do

Walk through a real flow to manage mechanisms on a running subnet using BTCLI. We'll use subnet 3 on the local network with the `alice` wallet, and we will show the real outputs you should expect to see.

::::info Prerequisites
- A local Subtensor chain running. See: [Run a Local Bittensor Blockchain Instance](../local-build/deploy)
- A local subnet created (and emissions started). See: [Create a Subnet (Locally)](../local-build/create-subnet)
- Wallets provisioned and funded for local development. See: [Provision Wallets](../local-build/provision-wallets)
- BTCLI installed (development version required for mechanism commands)
- Understanding of [multiple incentive mechanism concepts](understanding-multiple-mech-subnets)
::::

::::note Development Version Required
The mechanism management commands (`btcli subnet mech`) are only available in the development version of BTCLI. To install:

```bash
cd btcli
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -e .
```
::::

::::info Assumptions
- Subnet `netuid 3` exists on your local chain and is owned by wallet `alice`
- Commands target `--network local` and use those provisioned wallets
- If your `netuid` or wallet name differ, substitute your own values
::::

## Tutorial: Manage mechanisms end-to-end

Follow these steps on subnet 3 (`--network local`) using the `alice` wallet. Outputs shown are from a real run.

### Step 1 — Check mechanism count

```bash
btcli subnet mech count --netuid 3 --network local
```
```
[11:38:55] Warning: Verify your local subtensor is     subtensor_interface.py:85
           running on port 9944.                                                

Subnet 3 currently has 2 mechanisms.
(Tip: 1 mechanism means there are no mechanisms beyond the main subnet)
```

### Step 2 — View current emission distribution

```bash
btcli subnet mech emissions --netuid 3 --network local
```
```
[11:38:59] Warning: Verify your local subtensor is     subtensor_interface.py:85
           running on port 9944.                                                
                                               
           Subnet 3 • Emission split           
                Network: local                 
                                               
  Mechanism Index   Weight (u16)    Share (%)  
 ───────────────────────────────────────────── 
         0                 32768    50.000763  
         1                 32767    49.999237  
       Total               65535   100.000000  
 ───────────────────────────────────────────── 
                                               
                                               
Totals are expressed as a fraction of 65535 (U16_MAX).
No custom split found; displaying an even distribution.
```

### Step 3 — Set a custom 60/40 emission split

```bash
btcli subnet mech emissions-split --netuid 3 --network local --split "60,40" --wallet-name alice
```
```
            Subnet 3 • Emission split
                 Network: local

  Mechanism Index   Weight (u16)    Share (%)
 ─────────────────────────────────────────────
         0                 32768    50.000763
         1                 32767    49.999237
       Total               65535   100.000000
 ─────────────────────────────────────────────

Totals are expressed as a fraction of 65535 (U16_MAX).
No custom split found; displaying an even distribution.

             Proposed emission split
                    Subnet 3

  Mechanism Index   Weight (u16)    Share (%)
 ─────────────────────────────────────────────
         0                 39321    60.000000
         1                 26214    40.000000
       Total               65535   100.000000
 ─────────────────────────────────────────────

Proceed with these emission weights? [y/n] (y): y
```

### Step 4 — Verify the new distribution

```bash
btcli subnet mech emissions --netuid 3 --network local
```

### Step 5 — Inspect mechanism-specific metagraphs

```bash
btcli subnet metagraph --netuid 3 --network local --mechid 0
btcli subnet metagraph --netuid 3 --network local --mechid 1
```

## JSON Output Examples

All commands support `--json-output` for programmatic use.

### Mechanism Count (JSON)
```bash
btcli subnet mech count --netuid 3 --network local --json-output
```
```json
{"netuid": 3, "count": 2, "error": ""}
```

### Emission Split (JSON)
```bash
btcli subnet mech emissions --netuid 3 --network local --json-output
```
```json
{"netuid": 3, "raw_count": 2, "visible_count": 1, "split": [32768, 32767], 
"percentages": [50.000763, 49.999237], "even_distribution": true}
```

### Setting Emission Split (JSON)
```bash
btcli subnet mech emissions-split --netuid 3 --network local \
  --split "60,40" --json-output --no-prompt
```
```json
{
  "success": true,
  "err_msg": "",
  "split": [39321, 26214],
  "percentages": [60.0, 40.0]
}
```

## Troubleshooting

### Known issues
- Mechanism count changes are rate-limited to once per ~24 hours (7200 blocks).
- The `btcli subnet mech set` command may encounter prompt handling issues in non-interactive shells. If you see EOF errors, run interactively or update to the latest development build.

### Verification commands

```bash
btcli subnet mech count --netuid 3 --network local
btcli subnet mech emissions --netuid 3 --network local
btcli subnet metagraph --netuid 3 --network local --mechid 0
btcli subnet metagraph --netuid 3 --network local --mechid 1
```

## Best Practices

- Test changes on testnet first:
```bash
btcli subnet mech set --netuid 3 --count 2 --network test --wallet-name alice
```
- Monitor regularly:
```bash
#!/bin/bash
NETUID=3
NETWORK=local
btcli subnet mech count --netuid $NETUID --network $NETWORK
btcli subnet mech emissions --netuid $NETUID --network $NETWORK
```
- Keep a backup of the current emission weights:
```bash
btcli subnet mech emissions --netuid 3 --network local --json-output > backup_emissions.json
```
