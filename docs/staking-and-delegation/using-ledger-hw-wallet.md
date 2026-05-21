---
title: "Using Ledger Hardware Wallet"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Using Ledger Hardware Wallet

This guide describes how to set up your Ledger hardware wallet for managing your TAO on the Bittensor network.

## Requirements

Set up your Ledger hardware wallet as per Ledger instructions.

- [Ledger device (Nano S/S+/X, Flex, Stax)](https://www.ledger.com/).
- [Ledger Live app](https://www.ledger.com/ledger-live).

This guide assumes that you have a Ledger device and the Ledger Live app installed already.

## Common Steps

1. Connect Ledger device to your computer with Ledger Live installed.
2. Open **Ledger Live** app > **My Ledger** > **Unlock Ledger** > **Approve Ledger Live**.
3. Install the **Polkadot (DOT)** app from Ledger Live.
4. To manage your TAO from your Ledger hardware wallet, you must install a wallet app that supports TAO and also supports the Ledger hardware wallet. [Talisman](https://www.talisman.xyz/), [Nova Wallet](https://novawallet.io/), and [Subwallet](https://www.subwallet.app/) apps satisfy this condition. Install any of these wallet apps, and make sure you have configured these wallet apps to also use the Bittensor network. This is required for either transferring TAO using your Ledger, or finding the correct address to receive TAO on your Ledger device.

:::danger Stop. Did you run the above steps?
Proceed only after you successfully ran the above steps. The rest of this guide is described using Talisman wallet app.
:::


## Crucible Wallet Set Up

[Video](https://www.youtube.com/watch?v=0crPZTE69Eo)

### Connect Ledger device to Crucible Wallet
To ensure the connection to Crucible Wallet goes smoothly, make sure you have:

<div style={{paddingLeft: '40px'}}>

>**A. Plugged in your Ledger device into your computer**
>
>**B. Unlocked your device by entering your PIN**
>
>**C. Opened the Polkadot app on your Ledger**

</div>

Once you have completed the above, follow the steps below to import your Ledger wallet.

#### 1. Open the Crucible Wallet extension and click on **Import Wallet**

      <center id="Crcuible-1.1">
      <ThemedImage
      alt="Crcuible-1.1"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-1.1.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-1.1.png'),
        }}
      style={{width: 600}}
      />
      </center>
      <br />
#### 2. Click **Connect Ledger Wallet**

      <center id="Crcuible-1.2">
      <ThemedImage
      alt="Crcuible-1.2"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-1.2.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-1.2.png'),
        }}
      style={{width: 600}}
      />
      </center>
      <br />

#### 3. Allow USB permissions 

You will be directed to a webpage where you can allow USB permissions. This ensures your Ledger device is discoverable by the Crucible Wallet. When you click “Connect Wallet” the Crucible Wallet will grab your public key and ask you to give a name to your wallet.

      <center id="Crcuible-1.3">
      <ThemedImage
      alt="Crcuible-1.3"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-1.3.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-1.3.png'),
        }}
      style={{width: 600}}
      />
      </center>
      <br />

Once named, your Ledger is connected — you can now use Crucible Wallet with hardware-level security.

### Stake to Core Alpha

[Video](https://www.youtube.com/watch?v=Jq1cD6kUZiI)

To stake to Core Alpha (automatically reinvests root yield into subnets), click on **Stake to Core Alpha**.

  <center id="Crcuible-2.1">
      <ThemedImage
      alt="Crcuible-2.1"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.1.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.1.png'),
        }}
      style={{width: 600}}
      />
    </center>

You will first need to verify that you own your ledger device by signing a challange. This challange is free, never sent to the blockchain and is use donly to authenticate you with the Crucible Labs server.

  <center id="Crcuible-2.2">
      <ThemedImage
      alt="Crcuible-2.2"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.2.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.2.png'),
        }}
      style={{width: 600}}
      />
  </center>

  <center id="Crcuible-2.5">
      <ThemedImage
      alt="Crcuible-2.5"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.5.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.5.png'),
        }}
      style={{width: 900}}
      />
    </center>

You will then need to authorize the creation of a proxy wallet and fund said proxy wallet with 0.1 TAO in 2 seperate transactions. This proxy wallet will complete the unstaking yield from root and staking said yield into subnets. 

<div style={{display: 'flex', justifyContent: 'space-around', gap: '20px', flexWrap: 'wrap'}}>
      <div id="Crcuible-2.3">
      <ThemedImage
      alt="Crcuible-2.3"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.3.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.3.png'),
        }}
      style={{width: 400}}
      />
      </div>

      <div id="Crcuible-2.4">
      <ThemedImage
      alt="Crcuible-2.4"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.4.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.4.png'),
        }}
      style={{width: 400}}
      />
      </div>
</div>

After creating and funding the proxy wallet, you will be directed to the allocation screen where you can enter the amount you wish to allocate, customize your allocation strategy and sign the final staking transaction. 

  <center id="Crcuible-2.6">
      <ThemedImage
      alt="Crcuible-2.6"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.6.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.6.png'),
        }}
      style={{width: 600}}
      />
      </center>

  <center id="Crcuible-2.7">
      <ThemedImage
      alt="Crcuible-2.7"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.7.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-2.7.png'),
        }}
      style={{width: 900}}
      />
      </center>

<div style={{marginTop: '60px'}} />


### Manual Staking to Subnets
To manually stake to a subnet click the **Allocate** button on the bottom of the dashboard screen.Select *Manual Stake* on the following screen to then open a list of all subnets.

  <center id="Crcuible-3.1">
      <ThemedImage
      alt="Crcuible-3.1"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-3.1.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-3.1.png'),
        }}
      style={{width: 600}}
      />
  </center>

After selecting the subnet, you'll be directed to the allocation page where you to enter in the amount you wish to allocate and click **Allocate** to send the transaction to your Ledger device.

  <center id="Crcuible-3.2">
      <ThemedImage
      alt="Crcuible-3.2"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-3.2.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-3.2.png'),
        }}
      style={{width: 900}}
      />
  </center>

<div style={{marginTop: '60px'}} />

### Transfering TAO
[Video](https://www.youtube.com/watch?v=0IBjbUwm_2U)

To transfer TAO from your Ledger wallet, click on the transfer button in the bottom right corner of the Crucible Wallet.

Enter the recipiant address and amount you wish to transfer, then confirm the transactions, on your Ledger Device.
     
  <center id="Crcuible-4.1">
      <ThemedImage
      alt="Crcuible-4.1"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-4.1.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-4.1.png'),
        }}
      style={{width: 600}}
      />
    </center>
    <br /> 
    
  <center id="Crcuible-4.2">
      <ThemedImage
      alt="Crcuible-4.2"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-4.2.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Crucible/Crucible-4.2.png'),
        }}
      style={{width: 900}}
      />
      </center>
      <br />

## Talisman Wallet Set Up

### Step 1. Connect Talisman app to Ledger device

  1. Connect Ledger hardware wallet device to your computer.
  2. Open Talisman wallet app and select **Add Account**.
  3. Select **Connect** and choose **Connect Ledger**.

      <center id="Talisman-1.3">
      <ThemedImage
      alt="Talisman-1.3"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-1.3.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-1.3.png'),
        }}
      style={{width: 900}}
      />
      </center>
      <br />

  4. Select **Polkadot**. Then in the **Choose Network** drop-down select  **Bittensor** as the network, and in the **Choose Ledger App** section select **Polkadot App**.

      <center id="Talisman-1.4">
      <ThemedImage
      alt="Talisman-1.4"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-1.4.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-1.4.png'),
        }}
      style={{width: 900}}
      />
      </center>
      <br />

      :::tip Failed to connect?
      If you see "Failed to connect to your Ledger" message, then unlock your Ledger device and open the Polkadot app, then click "Retry".
      :::

      <center id="Talisman-1.4a">
      <ThemedImage
      alt="Talisman-1.4a"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-1.4a.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-1.4a.png'),
        }}
      style={{width: 900}}
      />
      </center>
      <br />

  5. When the above steps are complete, then you have successfully connected your Ledger hardware wallet device to the Polkadot app. Next, choose the Ledger hardware wallet addresses you would like to import to the Talisman wallet. Your Ledger hardware wallet device is now ready to be used with the Talisman Wallet app.

      The below screenshot shows multiple addresses in the Ledger hardware wallet device.

          <center id="Talisman-1.4a">
          <ThemedImage
          alt="Talisman-1.4a"
          sources={{
              light: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-1.5.png'),
              dark: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-1.5.png'),
            }}
          style={{width: 900}}
          />
          </center>
          <br />

      :::tip Failed to connect?
      If you had transferred TAO to the Ledger device already, then select **Custom** and modify the **Account index** to **0**. This will then show you the Ledger hardware wallet address to which you had transferred your TAO previously. You may try other values if needed.
      :::

      <center id="Talisman-1.4a">
      <ThemedImage
      alt="Talisman-1.4a"
      sources={{
          light: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-1.5a.png'),
          dark: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-1.5a.png'),
        }}
      style={{width: 900}}
      />
      </center>
      <br />

---

### Step 2. Transfer TAO from Ledger hardware wallet

To transfer TAO from your connected Ledger hardware wallet, execute the following steps:

1. Select the Ledger account from the **All Accounts** dropdown.

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-3.1.png'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-3.1.png'),
  }}
style={{width: 550}}
/>
</center>
<br />


2. Select **Send** to send from the TAO address to another wallet address.

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-4.1.png'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-4.1.png'),
  }}
style={{width: 550}}
/>
</center>
<br />


3. Select **Bittensor** from the list of networks.

4. Input the destination address. This destination address is any TAO wallet address that is configured with the Bittensor network. Paste the destination address into the **To** field, as shown in the below screenshot.

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-4.4.png'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-4.4.png'),
  }}
style={{width: 550}}
/>
</center>
<br />

5. Input the transaction amount and **Review** the transaction. In the below screenshot, an example transfer screen for sending 1.337 TAO from the connected Ledger hardware wallet device to a destination address that starts with `5EHVUN...` is shown.

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-4.5.png'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-4.5.png'),
  }}
style={{width: 550}}
/>
</center>
<br />

6. Review the transaction and press **Approve on Ledger**.

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-4.6.png'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-4.6.png'),
  }}
style={{width: 550}}
/>
</center>
<br />

:::tip Verify the transaction on the Ledger device
The below steps require you to verify on the Ledger device screen.
:::

7. On your Ledger device screen, verify the transaction details are as expected. Then select **Approve** on the device (or **Reject** if you want to cancel).

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Ledger/Ledger-4.7a.jpg'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Ledger/Ledger-4.7a.jpg'),
  }}
style={{width: 550}}
/>
</center>
<br />

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Ledger/Ledger-4.7b.jpg'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Ledger/Ledger-4.7b.jpg'),
  }}
style={{width: 550}}
/>
</center>
<br />

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Ledger/Ledger-4.7c.jpg'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Ledger/Ledger-4.7c.jpg'),
  }}
style={{width: 550}}
/>
</center>
<br />

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Ledger/Ledger-4.7d.jpg'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Ledger/Ledger-4.7d.jpg'),
  }}
style={{width: 550}}
/>
</center>
<br />

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Ledger/Ledger-4.7e.jpg'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Ledger/Ledger-4.7e.jpg'),
  }}
style={{width: 550}}
/>
</center>
<br />

8. Finished! Your TAO has been sent.

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-4.8.png'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet/Talisman/Talisman-4.8.png'),
  }}
style={{width: 550}}
/>
</center>
<br />

### Copying TAO address from Ledger device

While using any crypto wallet, you might need to bring over your Ledger device's TAO address to this wallet. Follow the below steps.

1. From your Talisman Wallet app, drop-down on **All Accounts** and select the Ledger account.

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-3.1.png'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-3.1.png'),
  }}
style={{width: 900}}
/>
</center>
<br />

2. Select **Copy**.

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-3.2.png'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-3.2.png'),
  }}
style={{width: 900}}
/>
</center>
<br />

3. Search for **Bittensor** network and click the **Copy to clipboard** button under **Bittensor**.

<center id="Talisman-1.4a">
<ThemedImage
alt="Talisman-1.4a"
sources={{
    light: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-3.3.png'),
    dark: useBaseUrl('/img/docs/ledger-hw-wallet//Talisman/Talisman-3.3.png'),
  }}
style={{width: 900}}
/>
</center>
<br />

You have successfully copied the TAO address on the Ledger hardware wallet to the clipboard. You can then paste this TAO address into any crypto wallet you use.

---
