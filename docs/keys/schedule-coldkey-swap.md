---
title: "Rotate/Swap your Coldkey"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

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

The coldkey swap mechanism works as follows:

- The coldkey swap mechanism enables you to announce and later execute the swapping of a source coldkey to a destination coldkey. If your existing coldkey is potentially compromised, use this feature to initiate a swap.
- When you use this feature, you must first announce your intention by providing a hash of the destination coldkey. Announcements are publicly visible on the chain before execution.
- After announcing, you must manually execute the swap after the required delay has passed by providing the actual destination coldkey. The system will verify that the key matches the previously announced hash.
- The default announcement delay period before the swap can be executed is **36,000 blocks (approximately 5 days)**.
- The source coldkey will be locked once the swap is announced. After the delay period has elapsed and the swap is successfully executed, the original coldkey will be unlocked entirely.
- **Cost**: The cost of this coldkey swap transaction is 0.1 TAO. This must be available in your source coldkey.
- After execution, any subnet ownership from your source coldkey will move to the destination coldkey.
- The delegated stake will be transferred from your source coldkey to the destination coldkey.
- For those who were staking to a validator from their source coldkey, their staking TAO will transfer to the destination coldkey.
- If the destination coldkey already has an identity, it is preserved rather than overwritten.

:::info reannouncing coldkey swaps
A coldkey swap can be reannounced only after the [ColdkeySwapReannouncementDelay](https://github.com/opentensor/subtensor/blob/b1067d49a24112e80a1fc8ce04f52a34f9bb6cff/chain-extensions/src/mock.rs#L329C15-L329C52) has passed. By default, this is 7,200 blocks (~1 day) after the initial announcement delay period expires. Reannouncing will overwrite the existing announcement and reset the mandatory waiting period before execution.
:::

## Prerequisites

To follow along with the below examples:

- You must own the source coldkey to be swapped.
- The destination (new) coldkey public key must not already be assigned to a hotkey _or a coldkey that is associated with any hotkeys_.

:::tip
Confirm the identity of the destination coldkey. A mistake here can result in loss of all of the source coldkey's assets and identity.

- If you are rotating the coldkey to maintain ownership, you must control the destination coldkey privatekey. Otherwise you will lose control over all of the source coldkey's assets and identity.
- If you are transferring ownership to someone else, confirm that they have secure control of the destination coldkey private key.
  :::

## Announce a coldkey swap

:::warning Announced swaps cannot be cancelled
Once a coldkey swap has been announced, **it cannot be cancelled**. This is an intentional design feature; coldkey swaps must not be cancellable, because if they were, an attacker who gained access to a coldkey could use cancellation to thwart the owner's attempt to swap it.

The delay period is intentionally long to allow those affected by the swap to access their coldkeys in order to respond. This is an issue because high-value keys (for example, coldkeys with subnet ownership or which control high value validator hotkeys) should be kept under stringent conditions of physical security, implying they cannot always be quickly accessed, for example during travel.

:::

## Using Bittensor-CLI

`btcli w swap-coldkey`

## Using the [Polkadot JS extension](https://polkadot.js.org/extension/)

1. You must import your source and destination coldkeys into the Polkadot JS extension.
2. You must connect the source coldkey account to the [polkadot.js.org/apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fentrypoint-finney.opentensor.ai%3A443#/explorer) website.

:::danger If you do not do this step, then you will not see **Developer** > **Extrinsics** option on the [polkadot.js.org/apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fentrypoint-finney.opentensor.ai%3A443#/extrinsics) website.
:::

## Steps for Polkadot JS

Follow the steps shown below the screenshot:

<center>
<ThemedImage
alt="Coldkey and hotkey pairings"
sources={{
    light: useBaseUrl('/img/docs/schedule-coldkey-swap-polkadotapp.png'),
    dark: useBaseUrl('/img/docs/schedule-coldkey-swap-polkadotapp.png'),
}}
style={{width: 900}}
/>
</center>

<br />

### Step 1: Connect to the subtensor network on Polkadot.js

Open your web browser and navigate to the Polkadot.js Apps website (https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fentrypoint-finney.opentensor.ai%3A443#/).

### Step 2: Navigate to the Extrinsics page

From the top navigation menu, proceed to **Developer** > **Extrinsics** to open the Extrinsics page. If you do not see this option, then make sure you successfully imported your source coldkey into the Polkadot JS extension, and connected this source coldkey account to the Polkadot.js Apps website.

### Step 3: Select your source coldkey account

Locate the drop-down section labeled **using the selected account** and select your connected account. This account should be your source coldkey account.

### Step 4: Select the `subtensorModule`

Locate the drop-down section labeled **submit the following extrinsic** and select `subtensorModule`.

### Step 5: Choose the `scheduleSwapColdkey` function

After selecting the `subtensorModule`, a second drop-down menu will appear on the right side of it. From this drop-down select the `scheduleSwapColdkey` option.

### Step 6: Provide the destination coldkey

Provide your destination coldkey in the `newColdkey: AccountId32` field.

### Step 7: Submit the transaction

Check again that you have provided the correct source and destination coldkeys.

Scroll down to the bottom of the page and click on the **Submit Transaction** button. Polkadot.js will prompt you to sign the transaction using the selected account. After you sign the transaction, the signed transaction will be broadcast to the Subtensor.

## Verify

Your scheduled coldkey swap will execute on the mainnet 36000 blocks after you successfully scheduled the coldkey swap using the above method. Check your destination coldkey after approximately 5 days to verify.
