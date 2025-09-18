---
title: "Managing Multiple Incentive Mechanisms with SDK"
---

# Managing Multiple Incentive Mechanisms with SDK

This tutorial walks through configuring and managing multiple incentive mechanisms within a subnet using the Bittensor SDK. For background on concepts, see [Understanding Multiple Incentive Mechanisms](understanding-multiple-mech-subnets). For a CLI-based approach, see [Managing Mechanisms with BTCLI](managing-mechanisms-btcli).

## What you'll do

Use the SDK to read the current mechanism configuration, set a custom emission split, and verify results on a local subnet.

::::info Prerequisites
- A local Subtensor chain running. See: [Run a Local Bittensor Blockchain Instance](../local-build/deploy)
- A local subnet created (and emissions started). See: [Create a Subnet (Locally)](../local-build/create-subnet)
- Wallets provisioned and funded for local development. See: [Provision Wallets](../local-build/provision-wallets)
- Bittensor SDK installed in your environment
::::

::::info Assumptions
- Subnet `netuid 3` exists on your local chain and is owned by wallet `alice`
- Code examples connect to `network="local"` and use those provisioned wallets
- If your `netuid` or wallet name differ, substitute your own values
::::

## Tutorial: Manage mechanisms end-to-end (SDK)

Follow these steps on subnet 3 using the `alice` wallet. Shown outputs are representative of an actual local run aligned with the BTCLI tutorial.

### Step 1 — Initialize SDK and wallet

```python
import bittensor as bt
from bittensor.core.extrinsics.sudo import (
    sudo_set_mechanism_emission_split_extrinsic,
)

# Connect to local chain
subtensor = bt.Subtensor(network="local")

# Load the subnet owner wallet (assumes wallet is provisioned locally)
wallet = bt.Wallet(name="alice")

netuid = 3
print(f"Connected to {subtensor.network} — managing subnet {netuid} with wallet {wallet.name}")
```

Example output:
```text
Connected to local — managing subnet 3 with wallet alice
```

### Step 2 — Read current mechanism configuration

```python
# Mechanism count
mech_count = subtensor.get_mechanism_count(netuid=netuid)
print(f"Subnet {netuid} currently has {mech_count} mechanisms.")

# Current emission split (raw u16 weights)
raw_split = subtensor.get_mechanism_emission_split(netuid=netuid)
print(f"Raw emission split: {raw_split}")

# Convert to percentages for readability
percentages = [(v / 65535) * 100 for v in raw_split]
print("Percentages:", [round(p, 6) for p in percentages])
```

Representative output on a fresh local subnet with 2 mechanisms:
```text
Subnet 3 currently has 2 mechanisms.
Raw emission split: [32768, 32767]
Percentages: [50.000763, 49.999237]
```

### Step 3 — Set a custom 60/40 emission split

```python
# Convert human-friendly percentages to chain format (u16 weights)
# 60% → 39321, 40% → 26214 (these sum to 65535)
new_split = [39321, 26214]

ok, err = sudo_set_mechanism_emission_split_extrinsic(
    subtensor=subtensor,
    wallet=wallet,
    netuid=netuid,
    maybe_split=new_split,
)

print("Update success:", ok)
if not ok:
    print("Error:", err)
```

Expected output:
```text
Update success: True
```

### Step 4 — Verify the change

```python
updated_raw = subtensor.get_mechanism_emission_split(netuid=netuid)
updated_pct = [(v / 65535) * 100 for v in updated_raw]
print("Updated raw split:", updated_raw)
print("Updated percentages:", [round(p, 6) for p in updated_pct])
```

Representative output:
```text
Updated raw split: [39321, 26214]
Updated percentages: [60.0, 40.0]
```

### Step 5 — Query mechanism-specific data (optional)

```python
# Example: read per-mechanism weights/bonds counts to sanity-check data paths
for mechid in range(len(updated_raw)):
    try:
        weights = subtensor.weights(netuid=netuid, mechid=mechid)
        bonds = subtensor.bonds(netuid=netuid, mechid=mechid)
        print(f"Mechanism {mechid}: weights_entries={len(weights)}, bond_entries={len(bonds)}")
    except Exception as e:
        print(f"Mechanism {mechid}: query error: {e}")
```

Example output:
```text
Mechanism 0: weights_entries=0, bond_entries=0
Mechanism 1: weights_entries=0, bond_entries=0
```

## Troubleshooting

- Rate limiting: mechanism count changes are restricted to once per ~24 hours (7200 blocks). Check before updating counts.
- Permissions: emission split and count updates require the subnet owner wallet.
- Local chain connectivity: ensure your local chain is running and your SDK points to `network="local"`.

Quick checks:
```python
# Admin freeze window
in_freeze = subtensor.is_in_admin_freeze_window(netuid=netuid)
print("In admin freeze window:", in_freeze)

# Verify subnet exists
print("Mechanism count:", subtensor.get_mechanism_count(netuid=netuid))
```

## Best Practices

- Test changes on testnet first: `bt.Subtensor(network="test")`
- Keep human-readable and chain-format splits side-by-side to avoid mistakes
- Log changes (old split → new split) for auditability in your ops scripts

## See also

- CLI flow version of this tutorial: [Managing Mechanisms with BTCLI](managing-mechanisms-btcli)
- Concepts: [Understanding Multiple Incentive Mechanisms](understanding-multiple-mech-subnets)
