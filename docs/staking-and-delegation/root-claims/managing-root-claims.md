---
title: "Managing Root Claims"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Managing Root Claims

This guide covers how to configure, monitor, and claim root dividends in the Bittensor network.

## Prerequisites

- A coldkey with TAO staked on the root network (subnet 0).
- A hotkey that's registered and staked on one or more subnets.

## Set a claim type

Your claim type determines what happens to your root dividends when they're claimed:

  **Claim Types:**

  - **Swap**: Future Root Alpha Emissions are swapped to TAO and added to root stake (default)
  - **Keep**: Future Root Alpha Emissions are kept as Alpha tokens

<Tabs groupId="root-claim">
  <TabItem value="btcli" label="BTCLI">

Use the `btcli stake set-claim` command to set your root claim type:

```bash
btcli stake set-claim
```

The command will display your current setting and prompt for changes:

```console
                    Current root claim type:

 Coldkey                                            Root Claim Type
 ──────────────────────────────────────────────────────────────────
 5G4mxrN8msvc4jjwp7xoBrtAejTfAMLCMTFGCivY5inmySbq        Swap

Select new root claim type [Swap/Keep] (Swap): Keep

Changing root claim type from 'Swap' -> 'Keep'

Note: With 'Keep', future root alpha emissions will be kept as Alpha tokens.

Do you want to proceed? [y/n]: y
Enter your password:
Decrypting...
✅ Successfully set root claim type to 'Keep'
✅ Your extrinsic has been included as 5751523-6
```



  </TabItem>
  <!-- <TabItem value="sdk" label="Bittensor SDK"></TabItem> -->
  <TabItem value="polkadot-app" label="Polkadot app">

  1. Navigate to **Developer** → **Extrinsics**
  2. Select your coldkey account
  3. Choose the pallet: `subtensorModule` and choose the `setRootClaimType(newRootClaimType)` extrinsic.
  4. Select your desired claim type:
      - `Swap` - for TAO accumulation
      - `Keep` - for alpha retention
  5. Click **Submit Transaction** and sign.

  </TabItem>
</Tabs>

## Query claimable ALPHA

To see how much you can claim from a specific subnet:

<Tabs groupId="root-claim">
  <TabItem value="btcli" label="BTCLI">
  
  
  </TabItem>
  <!-- <TabItem value="sdk" label="Bittensor SDK"></TabItem> -->
  <TabItem value="polkadot-app" label="Polkadot app">
    1. Navigate to **Developer** → **Chain State**
    2. Select the storage query: `subtensorModule` → `rootClaimable(AccountId)`
    3. Enter your hotkey address
    4. Click the **+** button to query
  </TabItem>
</Tabs>

## Check claimed ALPHA

To see how much you've already claimed from a subnet:

<!-- <Tabs groupId="root-claim">
  <TabItem value="btcli" label="BTCLI"></TabItem>
  <TabItem value="sdk" label="Bittensor SDK"></TabItem>
  <TabItem value="polkadot-app" label="Polkadot app">

    1. Navigate to **Developer** → **Chain State**
    2. Select the storage query: `subtensorModule` → `rootClaimed(AccountId, AccountId, u16)`
    3. Fill the parameters:
        - `AccountId`: Enter the account hotkey.
        - `AccountId`: Enter the account coldkey.
        - `u16`: Enter the subnet uid.
    4. Click the **+** button to query

   </TabItem>
   </Tabs> -->

1. Navigate to **Developer** → **Chain State**
1. Select the storage query: `subtensorModule` → `rootClaimed(AccountId, AccountId, u16)`
1. Fill the parameters:
   - `AccountId`: Enter the account hotkey.
   - `AccountId`: Enter the account coldkey.
   - `u16`: Enter the subnet uid.
1. Click the **+** button to query

## Trigger a manual claim

Trigger a manual claim to collect accumulated ALPHA without waiting for auto-claim. To manually trigger a claim:

<Tabs groupId="root-claim">
  <TabItem value="btcli" label="BTCLI">

Use the `btcli stake process-claim` command to manually claim your accumulated root network emissions:

```bash
btcli stake process-claim
```

Claim from specific netuids (up to 5 at once):

```bash
btcli stake process-claim --netuids 1,2,3
```

With a specific wallet:

```bash
btcli stake process-claim --netuids 1,2 --wallet-name my_wallet
```

:::note
The network will eventually process your pending emissions automatically. However, you can choose to manually claim your emissions with a small extrinsic fee.
:::

  </TabItem>
  <!-- <TabItem value="sdk" label="Bittensor SDK"></TabItem> -->
  <TabItem value="polkadot-app" label="Polkadot app">

  1. Navigate to **Developer** → **Extrinsics**
  2. Select your coldkey account
  3. Choose: `subtensorModule` → `claimRoot(subnets)`
  4. Add subnet IDs to claim from:
      - Click **Add item** for each subnet
      - Enter the netuid (e.g., `1`, `2`, `3`)
      - You can claim from up to 5 subnets at once.
  5. Click **Submit Transaction** and sign

  </TabItem>
</Tabs>

## Monitor claim status and types

### View claimable amounts with stake list

The `btcli stake list` command now includes a **Claimable** column showing accumulated emissions for each subnet:

```bash
btcli stake list
```

For a live-updating view:

```bash
btcli stake list --live
```

This column displays the amount of unclaimed ALPHA emissions available for manual claiming from each subnet.

### View claim types on root network

When viewing the root network (subnet 0) metagraph, you can see each validator's claim type setting:

```bash
btcli subnets metagraph --netuid 0
```

This displays a **Claim Type** column showing whether each validator has configured `Swap` or `Keep` for their root emissions.

### View claim types on subnets

When viewing any subnet's metagraph, the **Claim Type** column shows the claim setting for neurons who have stake on root:

```bash
btcli subnets metagraph --netuid 14
```

Only neurons with stake on the root network will have their claim type displayed.
