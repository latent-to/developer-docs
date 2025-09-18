---
title: "Managing Multiple Incentive Mechanisms with SDK"
---

# Managing Multiple Incentive Mechanisms with SDK

This tutorial shows how to configure and manage multiple incentive mechanisms in a single subnet using the Bittensor Python SDK.

For background on the concepts, see [Understanding Multiple Incentive Mechanisms](./understanding-multiple-mech-subnets).

See also [Managing Mechanisms with BTCLI](./managing-mechanisms-btcli).


**Prerequisites**
- A local Subtensor chain running. See: [Run a Local Bittensor Blockchain Instance](../local-build/deploy)
- A local subnet created (and emissions started). See: [Create a Subnet (Locally)](../local-build/create-subnet)
- Wallets provisioned and funded for local development. See: [Provision Wallets](../local-build/provision-wallets)
- BTCLI installed (development version required for mechanism commands)


:::tip
Substitute your subnet's netuid, which you can find with `btcli subnet list`.
:::


## Initialize SDK and wallet

The following snippet initializes the Bittensor SDK, imports the needed modules, connects to the local blockchain, and initializes the wallet object for the Alice wallet.

Run this at the top of each script below.

```python
import bittensor as bt
from bittensor.core.extrinsics.sudo import (
    sudo_set_mechanism_emission_split_extrinsic,
    sudo_set_mechanism_count_extrinsic,
)

# Connect to local chain
subtensor = bt.Subtensor(network="local")

# Load the subnet owner wallet (assumes wallet is provisioned locally)
wallet = bt.Wallet(name="alice")

netuid = 7
print("SDK version:", bt.__version__)
print(f"Connected to {subtensor.network} — managing subnet {netuid} with wallet {wallet.name}")
```

Example output:
```text
SDK version: 9.10.1
Connected to local — managing subnet 7 with wallet alice
```

## Read current mechanism configuration

Add the below snippet to display the current mechanism count on subnet 7 (or whatever subnet you have set above).

```python
# Mechanism count
mech_count = subtensor.get_mechanism_count(netuid=netuid)
print(f"Subnet {netuid} mech count: {mech_count} ")

# Current emission split (chain-stored values)
raw_split = subtensor.get_mechanism_emission_split(netuid=netuid)
print(f"Raw emission split: {raw_split}")

# Normalize to percentages by sum (works for either u16-scaled or raw values)
if not raw_split == None:
    _total = max(1, sum(raw_split))
    percentages = [round((v / _total) * 100, 6) for v in raw_split]
    print("Percentages:", percentages)

```

```
Subnet 7 mech count: 1
Raw emission split: None
```


## Create a second mechanism

Use the sudo extrinsic to increase the mechanism count to 2 for your subnet owner wallet.

```python
# Increase mechanism count to 2
ok, err = sudo_set_mechanism_count_extrinsic(
    subtensor=subtensor,
    wallet=wallet,
    netuid=netuid,
    mech_count=2,
)
print("Set mech count success:", ok)
if not ok:
    print("Error:", err)

# Verify the change
new_count = subtensor.get_mechanism_count(netuid=netuid)
print(f"Subnet {netuid} mech count (after): {new_count}")

# Read split again; if None, display implied equal distribution
split_after = subtensor.get_mechanism_emission_split(netuid=netuid)
print("Raw emission split (after):", split_after)
if split_after is None and new_count > 1:
    # Even distribution implied
    even_pct = round(100.0 / new_count, 6)
    print("Percentages:", [even_pct] * new_count)
elif split_after:
    _tot = max(1, sum(split_after))
    print("Percentages:", [round((v/_tot)*100, 6) for v in split_after])
```

Example output:
```text
Set mech count success: True
Subnet 7 mech count (after): 2
Raw emission split (after): [32768, 32767]
Percentages: [50.000763, 49.999237]
```

## Set a custom 60/40 emission split

```python
# Use simple human-friendly values; the chain stores a vector of ints.
# Normalization on read will display percentages accurately regardless of scale.
new_split = [60, 40]

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

## Verify the change

```python
updated_raw = subtensor.get_mechanism_emission_split(netuid=netuid)
_total = max(1, sum(updated_raw))
updated_pct = [round((v / _total) * 100, 6) for v in updated_raw]
print("Updated raw split:", updated_raw)
print("Updated percentages:", updated_pct)
```

Representative output:
```text
Updated raw split: [60, 40]
Updated percentages: [60.0, 40.0]
```

## Query mechanism-specific data (optional)

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

# Verify subnet mech count
print("Mechanism count:", subtensor.get_mechanism_count(netuid=netuid))
```
