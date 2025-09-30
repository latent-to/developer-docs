---
toc_max_heading_level: 2
---

# Create a Proxy Account

This tutorial walks you through creating a standard proxy and executing a call from the proxy account using the Polkadot.js web app. You will set up a delegate account, add it as a proxy to your real account with a chosen `ProxyType`, and optionally use announcements for delayed execution.

---

A standard proxy links a _delegator_ to a known account. The delegator specifies:

- The _delegate_ account.
- The allowed `ProxyType` (scope of permissions).
- An optional delay.

The delegate has access to funds in the real account and can then execute calls on behalf of the real account within the constraints of the specified `ProxyType`.

:::info When to use standard proxies
Delegating through a standard proxy is a good option when you want to entrust control to trusted individuals or organizations who can act on your behalf. In this setup, the delegate maintains their own independent signing capability, which allows them to initiate and authorize actions without relying on your key. This approach provides maximum operational flexibility while also making the delegate responsible for managing the security of their own keys.
:::

## Prerequisites

- A locally running subtensor development chain. For more information, see [run a local Bittensor blockchain instance](../../local-build/deploy.md).
- [Polkadot‑JS browser app](https://polkadot.js.org/apps/?#/explorer) and [Polkadot‑JS browser extension](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd) installed.
- An accessible 'Alice' wallet. For more information, see [Provision Wallets for Local Deploy](../../local-build/provision-wallets).
- At least 3 different accounts in your Polkadot-JS app:
  - Real (delegator) account that controls funds and adds the proxy.
  - Delegate account to perform allowed actions.
  - A recipient account to receive transferred funds.

To import accounts into the Polkadot-JS web app, see [create and import accounts to the Polkadot-JS extension](../../keys/multisig.md#create-and-import-3-coldkey-pairs-accounts-in-the-polkadot-js-browser-extension).

## Step 1: Connect Polkadot‑JS to your local chain

1. Open the Polkadot‑JS app.
2. In the network selector, choose Development → custom endpoint `ws://127.0.0.1:9944`.
3. Confirm your local chain metadata loads and your test accounts appear in the **Accounts** tab.

:::tip
If the web app does not connect to your local chain, your browser’s privacy or security settings may be blocking it. Try adjusting those settings and reconnecting.
:::

## Step 2: Add a Proxy

1. In the navbar menu, navigate to **Developers** → **Extrinsics**.
2. Under “using the selected account”, pick the funded delegator account.
3. Under “submit the following extrinsic”, choose the `proxy` pallet and call `addProxy(delegate, proxyType, delay)`.
4. Fill the parameters:

   - `delegate`: select the imported delegate account from the _Accounts_ dropdown.
   - `proxyType`: select `SmallTransfer`; this should allow us transfer amounts that do not exceed 0.5τ.
   - `delay`: optionally, include a delay in blocks.

5. Click **Submit Transaction** and sign with the _delegator_ account.

Your delegate is now authorized to execute small transfers on behalf of the real account.

:::info
A delegator can assign multiple proxies to the same delegate account. However, each proxy entry must use a unique `ProxyType`. Attempting to register a duplicate entry with the same delegate and `ProxyType` will result in a `proxy.Duplicate` error.
:::

### Checking an Account’s Proxies

You can check which proxies are associated with an account to see their delegate addresses, proxy types, and any configured delays. To do this:

1. From the **Developer** dropdown, navigate to **Chain state** → **Storage**.
2. Click the **selected state query** menu and select `proxy.proxies`.
3. Select the account used to create the proxy.
4. Click the **+** icon to run the query.

This returns the set of proxies related to the account and their information—`delegate`, `proxyType`, and `delay`.

## Step 3: Execute a Proxy Call

1. Go to **Developer** → **Extrinsics**.
2. Under “using the selected account”, choose the delegate account.
3. Select the `proxy` pallet and choose `proxy(real, forceProxyType, call)`.
4. Fill the parameters:
   - `real`: select the real account used to create the proxy.
   - `forceProxyType`: leave option unchecked.
   - `call`: the call to be made by the delegate account. Fill the following parameters:
     - Select the `balances` pallet and choose the `transferKeepAlive(dest, value)` extrinsic.
     - `dest`: select the recipient account.
     - `value`: input the amount to be transferred in RAO—1 TAO = 1<sup>9</sup>RAO.
5. Click **Submit Transaction** and sign the transaction from the delegate account.

The runtime verifies that the call is permitted by the proxy filter and that any delay requirements have been met, then dispatches the call as if signed by the Real account.

:::info
After submitting the transaction, check the Polkadot.JS web app's **Explorer** page for a `balances.Transfer` event. Notice the sender is the delegator account.
:::

:::warning

- With the SmallTransfer proxy type, transfers are limited to less than 0.5 TAO (500,000,000 RAO). Use the Transfer proxy type for amounts above this limit.
- The delegate account must hold enough funds to cover transaction fees, which are approximately 25 µTAO (0.000025 TAO).
  :::

If you configured a non-zero delay when creating the proxy, you must first make an announcement before executing the proxy call. Attempting to execute a proxy call before announcing returns a `proxy.Unannounced` error.

<details>
<summary><strong>Announce and execute a delayed proxy</strong></summary>

Announcing a delayed proxy call requires the hash of the call that you intend to execute. Therefore, you must first generate the call hash of the transaction you want to carry out. To generate the call hash:

1. Go to **Developer** → **Extrinsics**.
2. Under “**using the selected account**”, pick the delegate account.
3. Under “**submit the following extrinsic**”, choose the `balances` pallet and call the `transferKeepAlive(dest, value)` extrinsic.
4. Fill the parameters:
   - `dest`: select the recipient account.
   - `value`: input the amount to be transferred in RAO—1 TAO = 1<sup>9</sup>RAO.
5. Copy the hex code shown in the **encoded call data** field. You will use this to announce the call in the next step.

---

:::info
Do not submit the transaction after entering the parameters. Only copy the encoded call data once all parameters are provided.
:::

---

### Announce a call

To announce a delayed call:

1. Go to **Developer** → **Extrinsics** tab.
2. Choose the `proxy` pallet and select the `announce(real, call_hash)` extrinsic.
3. Fill the parameters:
   - `real`: select the real account used to create the proxy.
   - `callHash`: paste the call hash of the transaction to be executed.
4. Click **Submit Transaction** and sign the transaction from the delegate account.

Next, wait for the duration of the configured delay—in blocks—before executing the call. During the waiting period, the delegate can cancel the announcement—`removeAnnouncement(real, callHash)`, while the real account retains final authority to reject it—`rejectAnnouncement(delegate, callHash)`.

### Execute a delayed proxy call

After the announcement waiting period has passed, the delegate account can now execute the proxy if the real account did not reject it. Attempting to execute the proxy before the waiting period passes returns a `proxy.Unannounced` error. To execute a delayed proxy call:

1. Go to **Developer** → **Extrinsics**.
2. Under “using the selected account”, choose the delegate account.
3. Select the `proxy` pallet and choose `proxyAnnounced(delegate, real, forceProxyType, call)`.
4. Fill the parameters:
   - `delegate`: select the delegate account.
   - `real`: select the real account used to create the proxy.
   - `forceProxyType`: leave option unchecked.
   - `call`: the call to be made by the delegate account. Fill the following parameters:
     - Select the `balances` pallet and choose the `transferKeepAlive(dest, value)` extrinsic.
     - `dest`: select the recipient account.
     - `value`: input the amount to be transferred in RAO—1 TAO = 1<sup>9</sup>RAO.
5. Click **Submit Transaction** and sign the transaction from the delegate account.

---

:::info

- The call details must exactly match the original announcement. Any change—such as modifying the recipient or amount—will result in a `proxy.Unannounced error.
- Once a delayed proxy call is executed, its announcement is cleared. To run another proxy with the same details, you must create a new announcement.
  :::

---

</details>

## Step 4: Remove a Proxy (Revoke Access)

1. In the navbar menu, navigate to **Developers** → **Extrinsics**.
2. Under “using the selected account”, pick the delegator account.
3. Under “submit the following extrinsic”, choose the `proxy` pallete and call `removeProxy(delegate, proxyType, delay)`.
4. Fill the parameters:

   - `delegate`: select the imported delegate account from the _Accounts_ dropdown.
   - `proxyType`: select `SmallTransfer`; this should allow us transfer amounts that do not exceed 0.5τ.
   - `delay`: Optionally, include a delay in blocks.

5. Click **Submit Transaction** and sign with the _delegator_ account.

## Troubleshooting

- `proxy.Duplicate`: A proxy with the same configuration already exists on the real account.
- `proxy.Unannounced`: A non-zero delay proxy requires an announcement; announce and wait the delay.
- `proxy.Unproxyable`/`system.CallFiltered`: The call is not permitted under the current `ProxyType`.
- `proxy.TooMany`: You exceeded `MaxProxies` or `MaxPending`. Remove unused proxies/announcements.
- `proxy.NotProxy`: Ensure you’re submitting from the delegate account and referencing the correct real account.
- `Token.FundsUnavailable`: Ensure that your real account has enough available funds to cover the transaction.
