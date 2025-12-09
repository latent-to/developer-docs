---
title: "Managing Multiple Incentive Mechanisms with SDK"
---

import { SdkVersion } from "../sdk/_sdk-version.mdx";

# Managing Multiple Incentive Mechanisms with SDK

This tutorial shows how to configure and manage multiple incentive mechanisms in a single subnet using the Bittensor Python SDK.

For background on the concepts, see [Understanding Multiple Incentive Mechanisms](./understanding-multiple-mech-subnets).

See also [Managing Mechanisms with BTCLI](./managing-mechanisms-btcli).

:::tip Hot new feature
Multiple incentive mechanisms per subnet is a new feature that is still in development. It's initial release on mainnet is expected the week of September 22. In the meantime, it can be experimented with using a locally run chain.

See [Announcements](../learn/announcements) for updates.
:::

**Prerequisites**

- A local Subtensor chain running. See: [Run a Local Bittensor Blockchain Instance](../local-build/deploy)
- A local subnet created (and emissions started). See: [Create a Subnet (Locally)](../local-build/create-subnet)
- Wallets provisioned and funded for local development. See: [Provision Wallets](../local-build/provision-wallets)
- BTCLI installed (development version required for mechanism commands)

:::tip
Substitute your subnet's netuid, which you can find with `btcli subnet list`.
:::

:::warning Runtime limit
As of the current Subtensor runtime, a subnet can have a maximum of 2 mechanisms. Attempts to set a higher count will be rejected by the chain (runtime enforces `MaxMechanismCount = 2`).
:::

## Initialize SDK and wallet

<SdkVersion />

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

# Input the netuid of the created subnet
netuid = 2
print("SDK version:", bt.__version__)
print(f"Connected to {subtensor.network} — managing subnet {netuid} with wallet {wallet.name}")
```

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

# Normalize to percentages by sum (works for either u16-scaled or raw values)
if not raw_split == None:
    _total = max(1, sum(raw_split))
    percentages = [round((v / _total) * 100, 6) for v in raw_split]
    print("Percentages:", percentages)
else:
    print("No split defined.")
```

```
Subnet 7 mech count: 1
No split defined.
```

## Create a second mechanism

Use the sudo extrinsic to increase the mechanism count to 2 for your subnet owner wallet.

```python
# Increase mechanism count to 2
response = sudo_set_mechanism_count_extrinsic(
    subtensor=subtensor,
    wallet=wallet,
    netuid=netuid,
    mech_count=2,
)
print(response)

# Verify the change
new_count = subtensor.get_mechanism_count(netuid=netuid)
print(f"Subnet {netuid} mech count (after): {new_count}")

# Read split again; if None, display implied equal distribution
split_after = subtensor.get_mechanism_emission_split(netuid=netuid)

print("split:")
print(split_after)
```

```text
Set mech count success: True
Subnet 7 mech count (after): 2
split:
[50, 50]
```

## Set a custom 60/40 emission split

```python
new_split = [60, 40]

response = sudo_set_mechanism_emission_split_extrinsic(
    subtensor=subtensor,
    wallet=wallet,
    netuid=netuid,
    maybe_split=new_split,
)

print(response)
```

```text
Update success: True


```

## Verify the change

```python
split_after = subtensor.get_mechanism_emission_split(netuid=netuid)
print("split:")
print(split_after)
```

```text
split:
[60, 40]
```

## Troubleshooting

- Rate limiting: mechanism count changes are restricted (on mainnet) to once per ~24 hours (7200 blocks). See [Rate Limits in Bittensor](../learn/chain-rate-limits.md).
- Permissions: emission split and count updates require the subnet owner wallet.
- Local chain connectivity: ensure your local chain is running and your SDK points to `network="local"`.
