---
title: "Working with Subnets"
---

import { SdkVersion } from "../sdk/_sdk-version.mdx";

# Working with Subnets

Subnets are composed of a discrete number of UIDs. The subnet validators and subnet miners are associated with these UIDs. Each UID in the subnet belongs to a unique [hotkey](../keys/wallets.md#what-are-wallets-and-keys) which in turn is connected to a unique **coldkey** which was used during registration. The Yuma Consensus runs on these UIDs. This section presents a few examples showing how to work with subnets.

Transfer is transfer from cold to cold
Registration takes tao from cold
Hotkey Tao movement is only stake add and remove and it’s loaded by emissions while mining
Root delegation/undelegation is hotkey Tao movement to a strangers hotkey and it’s loaded by the activities of the strangers emission validation activities

## Viewing subnetworks

Show all currently running subnets on Bittensor:

```bash
btcli subnets list
```

## Viewing state

<SdkVersion />

To display fine-grained information about each subnetwork use [bt.Metagraph](pathname:///python-api/html/autoapi/bittensor/core/metagraph/index.html):

```python
import bittensor as bt
subnet = bt.Metagraph( netuid = 1 )             # Get the current state.
assert subnet.netuid == 1
subnet.sync( block = 6711260 )                   # Sync the state with a particular block.
assert subnet.block == 6711260
```

## Verifying UIDs

```python
import bittensor as bt
subnet = bt.Metagraph( netuid = 1 )
subnet = bt.metagraph( netuid = 1 )
print(subnet.uids.tolist())
```

## Extracting UID information

```python
import bittensor as bt
subnet = bt.Metagraph(netuid=1)
uid = 123
print('uid', uid, 'owned by hotkey:', subnet.hotkeys[uid], 'associated with coldkey:', subnet.coldkeys[uid])
```

## Viewing parameters

The below code prints stake `S` on the subnet and the weights `W` set by the subnet validators in the subnet.

```python numbered dark
import bittensor as bt
subnet = bt.Metagraph( netuid = 1, lite = False)
print ('subnet 1 validator stake', subnet.S )
print ('subnet 1 validator weights', subnet.W )
```

## Viewing dividends

The below code prints the subnet validator dividends, `D`.

```python
import bittensor as bt
subnet = bt.Metagraph( netuid = 1 )
print ('subnet 1 validator dividends', subnet.D )
```
