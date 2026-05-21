---
title: "Providing vTAO liquidity to Aerodrome"
---

import ConvertVTAO from '/img/docs/convert-vtao.png';
import AerodromeDeposit from '/img/docs/aerodrome-deposit.png';
import vTAODeposit from '/img/docs/vtao-deposit.png';
import ConfirmDeposit from '/img/docs/confirm-deposit.png';

# Providing vTAO liquidity to Aerodrome

This page walks through how to move vTAO from the Bittensor EVM to the Base network to provide liquidity on Aerodrome.

:::danger Understanding liquidity positions
Providing liquidity in a Concentrated Volatile pool involves significant risk, including Impermanent Loss. Before following this tutorial, ensure you understand how price ranges affect your asset ratio.

For more information on how liquidity positions work, see [Understanding Liquidity Provision in DeFi](https://blog.uniswap.org/how-liquidity-provision-in-defi-works).
:::

## Prerequisites

To continue with the rest of this tutorial,, you will need the following:

- An EVM Wallet browser extension containing some vTAO.
- Some ETH and USDC on the Base network in your EVM wallet.

To learn about how to convert native TAO to vTAO, see [Bridging and Wrapping vTAO](./vtao-bridge-tutorial.md).

## Step 1: Bridge vTAO to Base

Bridging vTAO to Base is a two-step process: first, approve the smart contract to access your tokens, then execute the final transaction to confirm. To do this:

1. Navigate to the [TAO.app](https://www.tao.app/bridge) bridge page.
2. Switch to the **Bridge** tab within the [TAO.app](https://www.tao.app/bridge) bridge page to open the cross-chain bridge modal.
3. On the **From** dropdown, select vTAO under **Bittensor (EVM)** and input the amount of vTAO you want to bridge.
4. On the **To** dropdown, select vTAO under **Base**.
5. Click the **Approve vTAO** button and sign the pop-up on the browser extension.

<img src={ConvertVTAO} alt="Convert vTAO" style={{width: 700, display: "flex", justifySelf: "center"}} />
<br/>

Once the approval is confirmed, click the **Bridge** button and then sign the pop-up on the browser extension to finalize the transaction.

:::warning Gas fees
Bridging vTAO from the Bittensor EVM to Base requires native TAO for gas. Ensure your EVM wallet holds a sufficient TAO balance to cover these transaction fees.
:::

## Step 2: Connect EVM wallet to Aerodrome

1. Visit to the [Aerodrome Finance](https://aero.drome.eth.limo/connect?to=%2Fdash%3F) page.
2. Click the **Browser Wallet** button to connect your EVM wallet.

:::tip
On the [TAO.app](https://www.tao.app/bridge) bridge page, retrieve the contact address for vTAO on the Base network from the **vTAO Contract Addresses** section—`0xe9f6D9898f9269B519E1435E6ebafF766c7f46BF`.
:::

## Step 3: Configure the deposit pool

1. Navigate to the [Aerodrome dashboard](https://aero.drome.eth.limo/dash).
2. Click on the **New deposit** button to open the modal.
3. In the **Token you want to deposit** dropdown, select USDC.
4. On the **Token you want to pair with** dropdown, paste the contact address for vTAO on the Base network.
5. Open the **USDC/VTAO** pair tagged `0.3% Concentrated Volatile 200` and click **Continue**.

<img src={AerodromeDeposit} alt="Aerodrome deposit" style={{width: 700, display: "flex", justifySelf: "center"}} />
<br/>

## Step 4: Deposit assets

1. Ensure that you are on the **New deposit** page
2. In the **Set price range** section, click the `USDC|vTAO` toggle to switch the view to vTAO.
3. Define your price range:
   - **Low**: The lowest price in your range; below this, your position is 100% USDC.
   - **High**: The highest price in your range; above this, your position becomes 100% vTAO.
4. Set the amount of vTAO to deposit.
5. Click **Deposit** and then sign the transaction in your EVM wallet.

:::warning Gas fees
Depositing assets on Aerodrome requires native ETH on the Base network for gas. Ensure your EVM wallet holds a sufficient ETH balance to cover these transaction fees.
:::

<img src={vTAODeposit} alt="vTAO deposit" style={{width: 700, display: "flex", justifySelf: "center"}} />
<br/>

:::info Two-Step Transaction Flow
To finish your deposit, you must sign two wallet prompts: first to approve the vTAO spend, and then to finalize. The second wallet pop-up will appear immediately after the first transaction clears.
:::

After signing the transaction that confirms the deposit, you can confirm the deposit by checking the [Aerodrome dashboard](https://aero.drome.eth.limo/dash).

<img src={ConfirmDeposit} alt="vTAO deposit" style={{width: 700, display: "flex", justifySelf: "center"}} />

Notice the new deposit under the **Liquidity Rewards** section.
