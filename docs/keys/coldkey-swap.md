---
title: "Rotate/Swap your Coldkey"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Rotate/Swap your Coldkey

This page describes how to _rotate_ or _swap_ the coldkey in your wallet. This is required if you suspect your coldkey has been leaked. Your coldkey secures your identity on Bittensor.

See:

- [Wallets, Coldkeys and Hotkeys in Bittensor](./wallets)
- [Coldkey and Hotkey Workstation Security](./coldkey-hotkey-security)

See [code for coldkey swap](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/swap/swap_coldkey.rs).

:::tip Prevent emergencies with proxies
Coldkey swaps are often needed when a coldkey is compromised. **Using proxy wallets can help prevent this situation entirely.** With a properly configured proxy (limited `ProxyType` and non-zero delay), even if an attacker gains access to your proxy wallet, they cannot immediately drain your funds—the delay gives you time to detect and reject unauthorized transactions.

For high-value wallets, consider setting up a `Staking` proxy for regular staking operations instead of using your coldkey directly.

See [Proxies: Overview](./proxies/index.md) to learn how to protect your coldkey proactively.
:::

The coldkey swap mechanism provides a secure way to transition from a potentially compromised source coldkey to a new destination coldkey. To initiate the swap, you must first announce your intention by providing a cryptographic hash of the destination coldkey. This announcement is visible on the chain but does not immediately move funds or ownership; instead, it triggers a mandatory locking period for the source coldkey.

After the announcement, a required delay period must pass before the swap can be finalized. By default, this [announcement delay period](<(https://github.com/opentensor/subtensor/blob/b1067d49a24112e80a1fc8ce04f52a34f9bb6cff/pallets/subtensor/src/lib.rs#L1360)>) is set to **36,000 blocks** (approximately **5 days**). Once this period has elapsed, you must manually execute the swap by providing the actual destination coldkey. The system then verifies that this key matches the previously submitted hash and that the required time has passed.

:::info
If the destination coldkey already has an existing identity, it will be preserved during this process rather than being overwritten.
:::

The cost for a coldkey swap transaction is **0.1 TAO**. This must be available in the source coldkey when the swap is announced. Upon successful execution, the source coldkey is entirely unlocked, and all associated assets are migrated to the destination coldkey. This includes the transfer of all delegated stake, staked TAO (for those staking to a validator), and any subnet ownership from the source coldkey to the destination coldkey.

:::warning Announced swaps cannot be cancelled
Once a coldkey swap has been announced, **it cannot be cancelled**. This is an intentional design feature; coldkey swaps must not be cancellable, because if they were, an attacker who gained access to a coldkey could use cancellation to thwart the owner's attempt to swap it.

The delay period is intentionally long to allow those affected by the swap to access their coldkeys in order to respond. This is an issue because high-value keys (for example, coldkeys with subnet ownership or which control high value validator hotkeys) should be kept under stringent conditions of physical security, implying they cannot always be quickly accessed, for example during travel.

:::

## Prerequisites

To follow along with the below examples:

- You must own the source coldkey to be swapped.
- A destination (new) coldkey public key.

:::tip
Confirm the identity of the destination coldkey. A mistake here can result in loss of all of the source coldkey's assets and identity.

- If you are rotating the coldkey to maintain ownership, you must control the destination coldkey privatekey. Otherwise you will lose control over all of the source coldkey's assets and identity.
- If you are transferring ownership to someone else, confirm that they have secure control of the destination coldkey private key.
  :::

## Announce a coldkey swap

Before swapping a coldkey, users must first announce their intention to swap coldkeys by providing a hash of the new coldkey and then wait the required delay interval before executing the swap.

To announce a coldkey swap:

<Tabs groupId="coldkey-swap">

  <TabItem value="btcli" label="BTCLI">

Run the following command to announce a coldkey swap using BTCLI:

```bash
btcli wallets swap-coldkey announce \
--wallet-name WALLET_NAME \
--new-coldkey DESTINATION_COLDKEY
```

Replace `WALLET_NAME` and `DESTINATION_COLDKEY` with the appropriate wallet addresses.

<details>
  <summary><strong>Show sample output</strong></summary>

  <!-- prettier-ignore-start -->

```sh
Wallet selected: Wallet (Name: 'alice', Hotkey: 'default', Path: '/Users/chidera/.bittensor/wallets/')


New coldkey wallet: Wallet (Name: 'swap-test', Hotkey: 'default', Path: '/Users/chidera/.bittensor/wallets/')

Using the specified network local from config
[19:16:41] Warning: Verify your local subtensor is running on port 9944.                                                                                                                    subtensor_interface.py:91

                                 Announcing Coldkey Swap

                 Item ┃ Value
━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Current Coldkey │ 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
          New Coldkey │ 5FHqAJM9jtVccTctCVmEvxzzm6qeA2yfbqcLFZLMipRKS1cB
     New Coldkey Hash │ 0x278149779b423b9294031351e042580000f6f0bce1fbf3a217a27be977c6d080
            Swap Cost │ ‎0.1000 τ‎
Delay Before Execution│ 5d
──────────────────────┼────────────────────────────────────────────────────────────────────
                      │
Are you sure you want to continue? [y/n] (n): y
✅ Successfully announced coldkey swap

✅ Your extrinsic has been included as 208-2

                                 Coldkey Swap Announced

                Item ┃ Value
━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Original Coldkey │ 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
         New Coldkey │ 5FHqAJM9jtVccTctCVmEvxzzm6qeA2yfbqcLFZLMipRKS1cB
    New Coldkey Hash │ 0x278149779b423b9294031351e042580000f6f0bce1fbf3a217a27be977c6d080
     Execution Block │ 258
Time Until Executable│ 4d 23h
─────────────────────┼────────────────────────────────────────────────────────────────────
                     │

After the delay, run:
btcli wallet swap-coldkey execute --new-coldkey 5FHqAJM9jtVccTctCVmEvxzzm6qeA2yfbqcLFZLMipRKS1cB
```

<!-- prettier-ignore-end -->
 </details> 
</TabItem>
<TabItem value="sdk" label="Bittensor SDK">
Paste the following snippet to announce a coldkey swap using the Bittensor SDK:

```py
import bittensor as bt

subtensor = bt.Subtensor(network="local")
wallet = bt.Wallet(name="WALLET_NAME")

new_coldkey_ss58 = "DESTINATION_COLDKEY"

# Announce the coldkey swap
response = subtensor.announce_coldkey_swap(
    wallet=wallet,
    new_coldkey_ss58=new_coldkey_ss58,
    wait_for_inclusion=True,
    wait_for_finalization=True,
)

if response.success:
    print(f"✅ Coldkey swap announced successfully!")
else:
    print(f"❌ Failed to announce swap: {response.message}")
```

Replace `WALLET_NAME` and `DESTINATION_COLDKEY` with the appropriate wallet addresses. Also, modify the targeted network if necessary.
</TabItem>

  <!-- <TabItem value="polkadot-app" label="Polkadot app">
  </TabItem> -->
</Tabs >

:::info reannouncing coldkey swaps
A coldkey swap can be reannounced only after the [ColdkeySwapReannouncementDelay](https://github.com/opentensor/subtensor/blob/b1067d49a24112e80a1fc8ce04f52a34f9bb6cff/chain-extensions/src/mock.rs#L329C15-L329C52) has passed. By default, this is 7,200 blocks (~1 day) after the initial announcement delay period expires. Reannouncing will overwrite the existing announcement and reset the mandatory waiting period before execution.
:::

### Check announcements from a coldkey

You can check the details of any coldkey swap announcements associated with a particular coldkey. This allows you to verify that your announcement is active while inspecting the committed hash and the target block for execution.

<Tabs groupId="coldkey-swap">

  <TabItem value="btcli" label="BTCLI">

Run the following command to execute a coldkey swap using BTCLI:

```bash
btcli wallets swap-check --wallet-name WALLET_NAME
```

Replace `WALLET_NAME` with the source coldkey address.

<details>
  <summary><strong>Show sample output</strong></summary>

```sh
Enter wallet name or SS58 address (leave blank to show all pending announcements): alice

                                          Pending Coldkey Swap Announcements
                                                  Current Block: 115

 Coldkey                                          ┃ New Coldkey Hash      ┃ Execution Block ┃ Time Remaining ┃ Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━╇━━━━━━━━━
 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY │ 0x94772f97f5...ae2160 │           36111 │         4d 23h │ Pending


```

 </details>

</TabItem>
<TabItem value="sdk" label="Bittensor SDK">
Paste the following snippet to execute a coldkey swap using the Bittensor SDK:

```py
import bittensor as bt

subtensor = bt.Subtensor(network="local")
wallet = bt.Wallet(name="WALLET_NAME")

announcement = subtensor.get_coldkey_swap_announcement(
    coldkey_ss58=wallet.coldkeypub.ss58_address
)

if announcement:
    current_block = subtensor.get_current_block()

    print(f"📋 Announcement found:")
    print(f"   New coldkey hash: {announcement.new_coldkey_hash}")
    print(f"   Execution block: {announcement.execution_block}")
    print(f"   Current block: {current_block}")
else:
    print("❌ No announcement found")
```

Replace `WALLET_NAME` with the source coldkey address. Also, modify the targeted network if necessary.
</TabItem>

  <!-- <TabItem value="polkadot-app" label="Polkadot app">
  </TabItem> -->
</Tabs >

## Execute a coldkey swap

After the announcement waiting period has passed, the source coldkey can now execute the swap to finalize the process. Attempting to execute a coldkey swap before the announcement delay period has passed will return an error.

To execute a coldkey swap:

<Tabs groupId="coldkey-swap">

  <TabItem value="btcli" label="BTCLI">

Run the following command to execute a coldkey swap using BTCLI:

```bash
btcli wallets swap-coldkey execute \
--wallet-name WALLET_NAME \
--new-coldkey DESTINATION_COLDKEY
```

Replace `WALLET_NAME` and `DESTINATION_COLDKEY` with the appropriate wallet addresses.

<details>
  <summary><strong>Show sample output</strong></summary>

```sh
Wallet selected: Wallet (Name: 'alice', Hotkey: 'default', Path: '/Users/chidera/.bittensor/wallets/')

New coldkey wallet: Wallet (Name: 'swap-test', Hotkey: 'default', Path: '/Users/chidera/.bittensor/wallets/')

Using the specified network local from config
[18:59:12] Warning: Verify your local subtensor is running on port 9944.                                                                                                                    subtensor_interface.py:91

                       Executing Coldkey Swap

            Item ┃ Value
━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Current Coldkey │ 5Gxhv5iZGBvvR6YJeEdLmvZ7hSHbE6FdHc43fLqMVkhki7j4
     New Coldkey │ 5G4HAHNfT3TFvXMi53LLCR4vsBbSeKXUPsBycDtfbkroMVP9
─────────────────┼──────────────────────────────────────────────────
                 │

WARNING: This action is irreversible. All assets will be transferred.

Are you sure you want to continue? [y/n] (n): y
Decrypting...

✅ Successfully executed coldkey swap!
✅ Your extrinsic has been included as 39386-2

                      Coldkey Swap Completed

            Item ┃ Value
━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Old Coldkey  │ 5Gxhv5iZGBvvR6YJeEdLmvZ7hSHbE6FdHc43fLqMVkhki7j4
     New Coldkey │ 5G4HAHNfT3TFvXMi53LLCR4vsBbSeKXUPsBycDtfbkroMVP9
─────────────────┼──────────────────────────────────────────────────
                 │

All assets have been transferred to the new coldkey.
```

 </details>

</TabItem>
<TabItem value="sdk" label="Bittensor SDK">
Paste the following snippet to execute a coldkey swap using the Bittensor SDK:

```py
import bittensor as bt

subtensor = bt.Subtensor(network="local")
wallet = bt.Wallet(name="WALLET_NAME")

new_coldkey_ss58 = "DESTINATION_COLDKEY"

# Announce the coldkey swap
response = subtensor.announce_coldkey_swap(
    wallet=wallet,
    new_coldkey_ss58=new_coldkey_ss58,
    wait_for_inclusion=True,
    wait_for_finalization=True,
)

if response.success:
    print(f"✅ Coldkey swap announced successfully!")
else:
    print(f"❌ Failed to announce swap: {response.message}")
```

Replace `WALLET_NAME` and `DESTINATION_COLDKEY` with the appropriate wallet addresses. Also, modify the targeted network if necessary.
</TabItem>

  <!-- <TabItem value="polkadot-app" label="Polkadot app">
  </TabItem> -->
</Tabs >

<!-- check balance -->
