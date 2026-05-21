---
title: "Auto Staking for Miners"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { SdkVersion } from "../sdk/_sdk-version.mdx";

# Auto Staking for Miners

Auto staking allows miners to automatically stake their mining income to a validator of their choice, streamlining the process of compound staking without manual intervention.

## Overview

The auto staking feature enables miners to set a destination validator where their mining emissions will be automatically staked. This eliminates the need for manual staking operations and ensures that mining rewards are continuously reinvested into the network.

When auto staking is set, as a miner earns emissions from your subnet participation, their emissions are automatically staked to a specified validator. This conveniently allows miners to grow their stake as they earn it, without the need for repetitive manual stake movement operations.

### How It Works On Chain

On the Bittensor blockchain (Subtensor), the `AutoStakeDestination` chain state variable holds autostaking destination hotkeys for each netuid, for each wallet that sets them.

Setting your wallet's auto stake destinations is mostly easily done with BTCLI or the Bittensor Python SDK, as described below, but can also be set through the `set_coldkey_auto_stake_hotkey` extrinsic (call index 114).

See [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2206).

### Prerequisites

- A wallet
- A target hotkey to receive the auto-staked TAO (can be any hotkey, including the miner's own hotkey)

:::info Coldkey Swap Integration

When a coldkey is swapped, the auto-stake destination is automatically transferred to the new coldkey, ensuring continuity of auto-staking functionality.

:::

## Managing Auto Staking

You can view and set auto-stake destinations directly from the Bittensor CLI or Bittensor SDK.

### View current auto-stake destinations

Shows the target hotkey per subnet for a given coldkey. If none is set, the output notes the default behavior.

<Tabs groupId="autostaking-method">
<TabItem value="btcli" label="BTCLI">

```bash
# By wallet name (uses your configured wallet path)
btcli stake auto --wallet.name <wallet>

# By coldkey SS58 address
btcli stake auto --ss58 <coldkey-ss58>
```

```console
btcli stake auto --wallet.name alice --network local
```

```console
                    Auto Stake Destinations for alice
                             Network: local
        Coldkey: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY

 Netuid   Subnet                 Status    Destination Hotkey   Identity
─────────────────────────────────────────────────────────────────────────
   0      root                   Default
   1      apex                   Default
   2      zawesome-first-su...   Default

Total subnets: 3  Custom destinations: 0
```

</TabItem>

<TabItem value="sdk" label="Python SDK">

<SdkVersion />

```python
import asyncio
import bittensor as bt

async def main():
    async with bt.AsyncSubtensor(network="local") as subtensor:
        coldkey_ss58 = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"  # This is the Alice key, replace with your coldkey SS58
        pairs = await subtensor.get_auto_stakes(coldkey_ss58=coldkey_ss58)
        if not pairs:
            print("No auto-stake destinations set.")
        else:
            for netuid, hotkey in pairs.items():
                print(f"netuid {netuid}: {hotkey}")

asyncio.run(main())
```

```shell
netuid 1: 5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM
netuid 2: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

</TabItem>
</Tabs>

### Set auto-stake destination

Sets the destination hotkey for your coldkey on a specific subnet.

<Tabs groupId="autostaking-method">
<TabItem value="btcli" label="BTCLI">

```bash
btcli stake set-auto --wallet.name <wallet> --netuid <netuid>
```

For example

```shell
btcli stake set-auto --wallet.name alice --network local
```

```console
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets
Enter the netuid to configure (1): 2
Enter the hotkey ss58 address to auto-stake to (Press Enter to view delegates):

                                             Subnet 2: zawesome-first-su...
                                              Network: local • Mechanism 0

 UID ┃ Stake (β) ┃ Alpha (β) ┃ Tao (τ) ┃ Dividends ┃ Incentive ┃ Emissions (β) ┃ Hotkey ┃ Coldkey ┃ Identity
━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━
  0  │   8.38k β │   8.38k β │  τ 0.00 │ 0.000000  │ 0.000000  │  0.000000 β   │ 5Grwva │ 5Grwva  │ (*Owner controlled)
  2  │  13.38k β │  13.38k β │  τ 0.00 │ 0.000000  │ 0.000000  │  9.020050 β   │ 5CffqS │ 5EEy34  │ ~
  1  │    0.00 β │    0.00 β │  τ 0.00 │ 0.000000  │ 0.000000  │  0.000000 β   │ 5Capz7 │ 5DA7Us  │ ~
─────┼───────────┼───────────┼─────────┼───────────┼───────────┼───────────────┼────────┼─────────┼─────────────────────
     │  21.77k β │  21.77k β │  0.00 β │   0.000   │           │   9.0201 β    │        │         │

Enter the UID of the delegate you want to stake to (or press Enter to cancel): 2

Selected delegate: 5CffqSVhydFJHBSbbgfVLAVkoNBTsv3wLj2Tsh1cr2kfanU6

                               Confirm Auto-Stake Destination
 Netuid   Subnet                                Destination Hotkey                  Identity
─────────────────────────────────────────────────────────────────────────────────────────────
   2      zawesome-first-su...   5CffqSVhydFJHBSbbgfVLAVkoNBTsv3wLj2Tsh1cr2kfanU6

Set this auto-stake destination? [y/n] (y): y
✅Your extrinsic has been included as 20979-1
✅ Auto-stake destination set for netuid 2
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
import asyncio
import bittensor as bt

async def main():
    async with bt.async_subtensor(network="local") as subtensor:
        wallet = bt.Wallet(
            name="Alice",
        )
        wallet.unlock_coldkey()

        netuid = 2  # subnet to configure
        hotkey_ss58 = "5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM"  # validator hotkey to auto-stake to

        response = await subtensor.set_auto_stake(
            wallet=wallet,
            netuid=netuid,
            hotkey_ss58=hotkey_ss58,
            wait_for_inclusion=True,
            wait_for_finalization=False,
        )
        print(response)

asyncio.run(main())
```

</TabItem>
</Tabs>
