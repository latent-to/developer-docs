import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Managing Root Claims

This guide covers how to configure, monitor, and claim root dividends in the Bittensor network.

## Prerequisites

- A coldkey with TAO staked on the root network (subnet 0).
- A hotkey that's registered and staked on one or more subnets.
- Familiarity with the Polkadot.js App.
<!-- - Basic familiarity with BTCLI, the Bittensor SDK, or Polkadot.js Apps. -->

## Set a claim type

Your claim type determines what happens to your root dividends when they're claimed:

    1. Navigate to **Developer** → **Extrinsics**
    2. Select your coldkey account
    3. Choose the pallet: `subtensorModule` and choose the `setRootClaimType(newRootClaimType)` extrinsic.
    4. Select your desired claim type:
        - `Swap` - for TAO accumulation
        - `Keep` - for alpha retention
    5. Click **Submit Transaction** and sign.

<!-- <Tabs groupId="root-claim">
  <TabItem value="btcli" label="BTCLI"></TabItem>
  <TabItem value="sdk" label="Bittensor SDK"></TabItem>
  <TabItem value="polkadot-app" label="Polkadot app">
    1. Navigate to **Developer** → **Extrinsics**
    2. Select your coldkey account
    3. Choose the pallet: `subtensorModule` and choose the `setRootClaimType(newRootClaimType)` extrinsic.
    4. Select your desired claim type:
        - `Swap` - for TAO accumulation
        - `Keep` - for alpha retention
    5. Click **Submit Transaction** and sign.

  </TabItem>
</Tabs> -->

## Query claimable ALPHA

To see how much you can claim from a specific subnet:

<!-- <Tabs groupId="root-claim">
  <TabItem value="btcli" label="BTCLI"></TabItem>
  <TabItem value="sdk" label="Bittensor SDK"></TabItem>
  <TabItem value="polkadot-app" label="Polkadot app">
    1. Navigate to **Developer** → **Chain State**
    2. Select the storage query: `subtensorModule` → `rootClaimable(AccountId)`
    3. Enter your hotkey address
    4. Click the **+** button to query
  </TabItem>
</Tabs> -->

1. Navigate to **Developer** → **Chain State**
2. Select the storage query: `subtensorModule` → `rootClaimable(AccountId)`
3. Enter your hotkey address
4. Click the **+** button to query

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

<!-- <Tabs groupId="root-claim">
  <TabItem value="btcli" label="BTCLI"></TabItem>
  <TabItem value="sdk" label="Bittensor SDK"></TabItem>
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
   </Tabs> -->

1. Navigate to **Developer** → **Extrinsics**
2. Select your coldkey account
3. Choose: `subtensorModule` → `claimRoot(subnets)`
4. Add subnet IDs to claim from:
   - Click **Add item** for each subnet
   - Enter the netuid (e.g., `1`, `2`, `3`)
   - You can claim from up to 5 subnets at once.
5. Click **Submit Transaction** and sign
