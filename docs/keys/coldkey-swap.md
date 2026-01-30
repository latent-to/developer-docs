---
title: "Rotate/Swap your Coldkey"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Rotate/Swap your Coldkey

This page describes how to _rotate_ or _swap_ the coldkey in your wallet. Because the coldkey controls your access to your wallet, this is the equivalent of 'changing your password', although it is more complex, due to the nature of blockchain cryptography.

It is *critical* to swap your coldkey if you it has been leaked. Your coldkey secures your wallet's identity and assets.

See:

- [Wallets, Coldkeys and Hotkeys in Bittensor](./wallets)
- [Coldkey and Hotkey Workstation Security](./coldkey-hotkey-security)
- [Blockchain sourcecode](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/swap/swap_coldkey.rs).

# Introduction

The coldkey swap mechanism provides a secure way to transition from a potentially compromised source coldkey to a new destination coldkey.

Because they are such sensitive operations a security perspective, coldkey swaps unfold in several careful stages:

1. Initiation/Announcement

The first step is for the coldkey owner to initiate the swap by making an announcement that the swap will occur (which is public), which begins a mandatory waiting period, during which the wallet is locked and the swap can be disputed. At this initiation step, the coldkey owner provides the destination wallet address, which remains private, as only a hash is published to the blockchain.

2. Pending Period

Currently the waiting/locked period is **36,000 blocks** (~ **5 days**). During this period, the swap can be disputed but not finalized.

3. Dispute or Finalization
    1. [Disputing a coldkey swap](#dispute-a-coldkey-swap) prevents the execution of the swap and locks the coldkey. At this point, the triumvirate is required to resolve the dispute. The coldkey private key is required to dispute a swap.
    1. If the Pending Period expires without the swap being disputed, the coldkey owner must finalize the swap by again providing the destination coldkey. The blockchain verifies that this key matches the recorded hash before proceeding.


:::info notes
- If the destination coldkey already has an existing identity, it will be preserved rather than being overwritten, and the assets of the source wallet will be transferred/merged into this existing wallet.

- The cost for a coldkey swap transaction is **0.1 TAO**. This must be available in the source coldkey when the swap is announced. Upon successful execution all assets are migrated to the destination coldkey. This includes all TAO, all stake in subnets, control of any hotkeys, and any subnet ownership.

:::


![Coldkey swap flow diagram](/img/docs/coldkey-swap.svg)

<!-- 
https://editor.plantuml.com/uml/


@startuml
title Coldkey Swap

skinparam shadowing false
skinparam defaultFontName Monospace
skinparam sequence {
  LifeLineBorderColor #444444
  ParticipantBorderColor #444444
  ParticipantBackgroundColor white
  ArrowColor #444444
}

actor "Swap Initiator\n(must hold key)" as KH

database "Chain\n(Subtensor)" as C
actor "Swap Disputant\n(must hold key)" as D
== Announcement ==
    note over KH
The iniator (key owner wanting to swap the key)
triggers the swap, using a client to submit an
`announce_coldkey_swap` extrinsic.
    end note
KH -> C: announce_coldkey_swap(source_private_key, destination address)


== Pending Swap / LOCKED window (~5 days / 36,000 blocks) ==
note over C
This waiting period is required in case an attacker steals a key and tries to execute a swap.
The owner of the coldkey can *dispute* the swap, blocking it until the triumvirate adjudicates.

  end note
group #LightSkyBlue Disputed Swap
  opt
    D -[#red]> C: dispute_coldkey_swap(source_private_key)
    note right of C
Swap is blocked.
The wallet remains locked pending action by the triumvirate.
    end note
  end opt
end group

== Finalization period==
note over C
Disputes are no longer allowed.
Keyholder can *finalize* swap using the (secret) coldkey used to make the announcement.
end note

KH -> C: execute_coldkey_swap(source_private_key, dest_coldkey)
C -> C: verify hash
C -> C: transfer/migrate assets

note over C
Result: assets moved to destination coldkey.
Announcement cleared, swap complete.
end note

@enduml



 -->

:::tip Prevent emergencies with proxies
Coldkey swaps are needed when a coldkey has been compromised, that is, if you suspect it may have been leaked, i.e. that it is possible that someone else could have copied or recorded it in some way and can reproduce it. If someone gains your coldkey private key, they can take all of your wallet's assets, so any possibility of a compromise should be taken seriously.

To limit the opportunity to compromise your most valuable coldkey, you can use another wallet as a **proxy.** With a properly configured proxy (a `ProxyType` limited to specific actions, and non-zero delay), even if an attacker gains access to your proxy wallet, they cannot immediately drain your funds—the delay gives you time to detect and reject unauthorized transactions.

For high-value wallets, consider setting up a `Staking` proxy for regular staking operations instead of using your coldkey directly.

See [Proxies: Overview](./proxies/index.md) to learn how to protect your coldkey proactively.
:::

## Prerequisites

To follow along with the below examples:

- You must own the source coldkey to be swapped.
- A destination (new) coldkey public key.
- To safely experiment with this and other blockchain operations, you can deploy a your own
 instance of Subtensor (Bittensor's blockchain component).

:::warning
Confirm the identity of the destination coldkey. A mistake here can result in loss of all of the source coldkey's assets and identity.

- The destination coldkey must not have any existing associations with hotkeys on-chain.
- If you are rotating the coldkey to maintain ownership, you must control the destination coldkey privatekey. Otherwise you will lose control over all of the source coldkey's assets and identity.
- If you are transferring ownership to someone else, confirm that they have secure control of the destination coldkey private key.
  :::


## Check pending (announced) coldkey swaps

You can fetch a list of all pending coldkey swaps, or check a paricular coldkey for pending swaps:

You can check the details of all any coldkey swap announcements associated with a particular coldkey. This allows you to verify that your announcement is active while inspecting the committed hash and the target block for execution.

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
</Tabs >



## Announce a coldkey swap

Before swapping a coldkey, users must first announce their intention to swap coldkeys by providing the new coldkey and then wait the required delay interval before executing the swap.

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
</Tabs >

:::info reannouncing coldkey swaps
A coldkey swap can be reannounced only after the [ColdkeySwapReannouncementDelay](https://github.com/opentensor/subtensor/blob/devnet-ready/runtime/src/lib.rs#:~:text=pub%20const%20InitialColdkeySwapReannouncementDelay) has passed. By default, this is 7,200 blocks (~1 day) after the initial announcement delay period expires. Reannouncing will overwrite the existing announcement and reset the mandatory waiting period before execution.
:::


## Execute/finalize a coldkey swap

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
response = subtensor.swap_coldkey_announced(
    wallet=wallet,
    new_coldkey_ss58=new_coldkey_ss58,
    wait_for_inclusion=True,
    wait_for_finalization=True,
)

if response.success:
    print(f"✅ Coldkey swap executed successfully!")
else:
    print(f"❌ Failed to announce swap: {response.message}")
```

Replace `WALLET_NAME` and `DESTINATION_COLDKEY` with the appropriate wallet addresses. Also, modify the targeted network if necessary.
</TabItem>
</Tabs >

After executing a coldkey swap, all assets will be transferred to the destination coldkey, including TAO balance, delegated stake, and any subnet ownership.

## Dispute a coldkey swap

If a malicious actor announces a coldkey swap on a compromised key, the legitimate owner can trigger a dispute at any point prior to its execution to intercept the operation. This operation freezes the coldkey and prevents the attacker from completing the swap process.

To dispute a coldkey swap:
<Tabs groupId="coldkey-swap">
<TabItem value="btcli" label="BTCLI">
Run the following command to dispute a coldkey swap using BTCLI:

```bash
btcli wallets swap-coldkey dispute --wallet-name WALLET_NAME
```

Replace `WALLET_NAME` with the appropriate wallet addresses.

<details>
  <summary><strong>Show sample output</strong></summary>

```sh
Wallet selected: Wallet (Name: 'alice', Hotkey: 'default', Path: '/Users/chidera/.bittensor/wallets/')

Using the specified network local from config
[13:27:34] Warning: Verify your local subtensor is running on port 9944.                                                                                                                    subtensor_interface.py:91

                                       Dispute Coldkey Swap

            Item ┃ Value
━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         Coldkey │ 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
 Execution Block │ 87
          Status │ Ready
         Warning │ Disputing freezes the current swap process until the triumvirate can intervene.
─────────────────┼─────────────────────────────────────────────────────────────────────────────────
                 │
Proceed with dispute? Your swap process will be frozen until the triumvirate can intervene. [y/n] (n): y
✅ Coldkey swap disputed.

✅ Your extrinsic has been included as 40386-2
```

 </details>
</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```py
import bittensor as bt

subtensor = bt.Subtensor(network="local")
wallet = bt.Wallet(name="WALLET_NAME")

response = subtensor.dispute_coldkey_swap(
wallet=wallet,
wait_for_inclusion=True,
wait_for_finalization=True,
)

if response.success:
print(f"✅ Coldkey swap disputed successfully!")
else:
print(f"❌ Failed to dispute coldkey swap: {response.message}")

```

Replace `WALLET_NAME` with the appropriate wallet addresses. Also, modify the targeted network if necessary.
</TabItem>

</Tabs>

:::info
The [`dispute_coldkey_swap`](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/subtensor/src/macros/dispatches.rs#:~:text=pub%20fn%20dispute_coldkey_swap) extrinsic is only callable by a coldkey with an active swap announcement. If no swap has been initiated, the process returns a [`ColdkeySwapAnnouncementNotFound`](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/subtensor/src/macros/errors.rs#:~:text=ColdkeySwapAnnouncementNotFound) error.
:::

After a coldkey swap is disputed, the legitimate owner must contact the Triumvirate to prove ownership of the coldkey. The coldkey remains frozen until the Triumvirate resolves the dispute and [manually resets it](https://github.com/opentensor/subtensor/blob/devnet-ready/pallets/subtensor/src/macros/dispatches.rs#:~:text=pub%20fn%20reset_coldkey_swap).
