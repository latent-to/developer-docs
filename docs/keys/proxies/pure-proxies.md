# Understanding Pure Proxies

Pure proxies are a specialized type of proxy account in Bittensor that provide enhanced security and isolation for complex delegation scenarios. Unlike standard proxies that use existing accounts, pure proxies create new, keyless accounts that can only operate through their delegator relationship.

This page walks you through creating a pure proxy account, executing a transfer through it, and eventually removing it using the Polkadot.js web app. You will set up a new delegate account, add it to your Polkadot.js accounts, and use it to execute transactions on the blockchain.

## Overview of pure proxies

Pure proxies are **keyless, non-deterministic accounts** that are created fresh using the `createPure` extrinsic. They represent a unique approach to account delegation where:

- The proxy account has **no private key** and cannot sign transactions independently
- The proxy can **only act through its delegator**—all operations must be initiated by the delegator
- The account is **completely isolated** and cannot escalate its own permissions

Unlike standard proxies, where the delegate can access the delegator’s funds to execute calls on their behalf, pure proxies operate differently. A pure proxy account must hold its own funds, while the real account acts as an _Any proxy_ for it—signing and authorizing transactions on the proxy’s behalf.

:::info When to use pure proxies
Pure proxies are valuable when you want to keep your real account secure by reducing direct key exposure to the blockchain. They provide a keyless, flexible account that enables permissionless management and are especially effective for multisigs, since they allow updates to membership or thresholds without changing the account address.
:::

## Transaction flow in pure proxies

All transactions involving a pure proxy must be signed by the delegator account. Once signed, the transaction is executed on-chain as if it originated directly from the pure proxy. Unlike standard proxies, a pure proxy must hold its own funds to cover fees or transfers. The delegator then acts as an _Any proxy_, handling the signing and authorization of calls, but the balance used comes from the pure proxy's account.

When submitting calls with the `proxy(real, forceProxyType, call)` extrinsic, the pure proxy account is passed as the `real` argument, while the delegator signs the transaction. This effectively reverses the usual proxy relationship where the proxy account only authorizes the transaction, while the real account appears as the origin on chain.

:::info
You can modify who signs for a pure proxy by assigning another account as its _Any proxy_. This is done by executing a proxy call that creates a standard proxy with the `Any` proxy type. The new account can then sign on behalf of the pure proxy—for example, when updating signers in a multisig wallet. See [source code: pure proxy account generation](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L827-L850).
:::

## Prerequisites

- A locally running subtensor development chain. For more information, see [run a local Bittensor blockchain instance](../../local-build/deploy.md).
- [Polkadot‑JS browser app](https://polkadot.js.org/apps/?#/explorer) connected to your local Bittensor instance and [Polkadot‑JS browser extension](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd) installed. For information on connecting the Polkadot-JS browser app to your local blockchain instance, see [Connect Polkadot to your local chain](./create-proxy.md#step-1-connect-polkadotjs-to-your-local-chain).
- An accessible 'Alice' wallet. For more information, see [Provision Wallets for Local Deploy](../../local-build/provision-wallets).
- At least 2 different accounts in your Polkadot-JS app:
  - Real (delegator) account that controls funds and adds the proxy.
  - A recipient account to receive transferred funds.

## Create a pure proxy

Use the `proxy::createPure` extrinsic to create a pure proxy as shown. See [source code: `createPure` implementation](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L328-L360):

1. In the navbar menu, navigate to **Developers** → **Extrinsics**.
2. Under “using the selected account”, pick the delegator account.
3. Under “submit the following extrinsic”, choose the `proxy` pallet and call `createPure(proxyType, delay, index)`.
4. Fill the parameters:

   - `proxyType`: select `Any`; this grants full permissions to the proxy, including the ability to make transfers and kill the proxy.
   - `delay`: optionally, include a delay in blocks.
   - `index`: leave as zero.

5. Click **Submit Transaction** and sign with the _delegator_ account.

### Retrieve and import the proxy account

1. After creating the pure proxy, go to **Network** → **Explorer** in the Polkadot-JS web app.
2. On the **recent events** panel, find the `proxy.PureCreated` event from the transaction. This event shows details of the proxy created including the address of the newly spawned account.
3. Copy the address of the proxy account.
4. Go to **Accounts** → **Accounts**.
5. Click **+ Proxied**.
6. Paste the proxy account address in the **proxied account** field and then provide a name for the pure proxy account.

Importing the proxy account makes it selectable in the Polkadot-JS web app UI.

:::tip

- Record the block number and extrinsic index where the pure proxy was created. These values are required when removing the proxy.
- When creating a proxy on mainnet, you can check block details on the [Tao.app block explorer page](https://www.tao.app/blocks).

:::

## Executing calls via a pure proxy

1. Go to **Developer** → **Extrinsics**.
2. Under “using the selected account”, choose the delegate account—account that created the proxy.
3. Select the `proxy` pallet and choose `proxy(real, forceProxyType, call)`.
4. Fill the parameters:
   - `real`: select the pure proxy account from the UI.
   - `forceProxyType`: leave option unchecked.
   - `call`: the call to be made by the delegate account. Fill the following parameters:
     - Select the `balances` pallet and choose the `transferKeepAlive(dest, value)` extrinsic.
     - `dest`: select the recipient account.
     - `value`: input the amount to be transferred in RAO—1 TAO = 1<sup>9</sup>RAO.
5. Click **Submit Transaction** and sign the transaction from the delegate account.

:::info

- After submitting the transaction, check the Polkadot.JS web app's **Explorer** page for a `balances.Transfer` event. Notice the sender is the pure proxy account.
- Ensure the pure proxy account holds enough funds to cover both the transfer and associated fees.
  :::

## Kill a pure proxy

Pure proxies are killed using the `killPure` extrinsic as shown. See [source code: `killPure` implementation](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L380-L406):

1. Go to **Developer** → **Extrinsics**.
2. Under “using the selected account”, choose the pure proxy account.
3. Select the `proxy` pallet and choose `killPure(spawner, proxyType, index, height, extIndex)`.
4. Fill the parameters:
   - `spawner`: select the account that created the proxy from the UI.
   - `proxyType`: select the proxy type.
   - `index`: leave as `0`.
   - `height`: input the block number that the proxy was created at.
   - `extIndex`: input the extrinsic index of the `proxy.PureCreated` event.
5. Click **Submit Transaction** and sign the transaction from the delegate account.

Ensure that all parameters are correct before making this call. The call will fail with a `Proxy.NoPermission` error if any parameter is invalid or if the origin account lacks permission to perform the action.

:::warning
Killing a pure proxy deletes the account the proxy account from the blockchain. Any funds in the account are permanently lost.
:::

:::info Removing vs. Killing a Pure Proxy
Killing a pure proxy permanently deletes the account and releases its reserved deposit. Removing a proxy, on the other hand, only detaches it from the account that initiates the transaction. The pure proxy remains on-chain and can still be used if it has other proxies linked to it, but it becomes inactive once all proxy relationships are removed. For more information on how to remove a proxy, see [Remove a proxy](create-proxy.md#step-4-remove-a-proxy).
:::

## Troubleshooting

- `Token.FundsUnavailable`: Ensure that the pure proxy account has been funded and has enough funds to cover the transfer.
- `proxy.NotProxy`: Ensure you're executing the pure proxy correctly—from the creator account and referencing the pure proxy account as `real`. See [source code: `NotProxy` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L735).
- `Proxy.NoPermission`: The `killPure` call is not permitted under the current. See [source code: `NoPermission` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L741).
- `system.CallFiltered`: The call is not permitted under the current `ProxyType`.
