---
title: "Understanding Pure Proxies"
toc_max_heading_level: 2
---

# Understanding Pure Proxies

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page covers creating a pure proxy and executing a call using a pure proxy.

---

Pure proxies are a specialized type of proxy account in Bittensor that provide enhanced security and isolation for complex delegation scenarios. Unlike standard proxies that use existing accounts, pure proxies create new, keyless accounts that can only operate through their delegator relationship.

This page walks you through creating a pure proxy account, executing a transfer through it, and eventually removing it using the Polkadot.js web app. You will set up a new delegate account, add it to your Polkadot.js accounts, and use it to execute transactions on the blockchain.

## Overview of pure proxies

Pure proxies are **keyless, non-deterministic accounts** that are created fresh using the `createPure` extrinsic. They represent a unique approach to account delegation where:

- The proxy account has **no private key** and cannot sign transactions independently
- The proxy can **only act through its delegator**—all operations must be initiated by the delegator
- The account is **completely isolated** and cannot escalate its own permissions

Unlike standard proxies, where the delegate can access the delegator’s funds to execute calls on their behalf, pure proxies operate differently. A pure proxy account must hold its own funds, while the spawner account acts as an _Any proxy_ for it—signing and authorizing transactions on the proxy’s behalf.

:::info When to use pure proxies
Pure proxies are valuable when you want to keep your real account secure by reducing direct key exposure to the blockchain. They provide a keyless, flexible account that enables permissionless management and are especially effective for multisigs, since they allow updates to membership or thresholds without changing the account address.
:::

## Transaction flow in pure proxies

All transactions involving a pure proxy must be signed by the spawner account. Once signed, the transaction is executed on-chain as if it originated directly from the pure proxy. Unlike standard proxies, a pure proxy must hold its own funds to cover fees or transfers. The spawner then acts as an _Any proxy_, handling the signing and authorization of calls, but the balance used comes from the pure proxy's account.

When submitting calls with the `proxy(real, forceProxyType, call)` extrinsic, the pure proxy account is passed as the `real` argument, while the delegator signs the transaction. This effectively reverses the usual proxy relationship where the proxy account only authorizes the transaction, while the real account appears as the origin on chain.

:::info
You can modify who signs for a pure proxy by assigning another account as its _Any proxy_. This is done by executing a proxy call that creates a standard proxy with the `Any` proxy type. The new account can then sign on behalf of the pure proxy—for example, when updating signers in a multisig wallet. See [source code: pure proxy account generation](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L827-L850).
:::

## Prerequisites

Before creating a pure proxy, ensure you have a spawner account that will initialize and control the pure proxy.

## Create a pure proxy

The `proxy::createPure` extrinsic creates a pure proxy. See [source code: `createPure` implementation](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L328-L360).

Use this operation to generate a pure proxy account:

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType

subtensor = bt.Subtensor()

spawner = bt.Wallet(name="WALLET_NAME")

response = subtensor.create_pure_proxy(
    wallet=spawner,
    proxy_type=ProxyType.Any,
    delay=0,
    index=0,
)

if response.success:
    pure_account = response.data.get("pure_account")
    spawner_address = response.data.get("spawner")
    height = response.data.get("height")
    ext_index = response.data.get("ext_index")

    print(f"✓ Pure proxy created!")
    print(f"  Pure proxy address: {pure_account}")
    print(f"  Spawner: {spawner_address}")
    print(f"  Block: {height}")
    print(f"  Extrinsic index: {ext_index}")
else:
    print(f"✗ Failed: {response.message}")
```

:::tip

- Record the block number and extrinsic index where the pure proxy was created. These values are required to kill the proxy. You can also retrieve the block height and extrinsic details by searching your transaction on the [Tao.app block explorer](https://www.tao.app/blocks).
- The proxy type can be provided either by importing and using the `ProxyType` enum or by passing the proxy type as a string.
  :::

</TabItem>

<TabItem value="polkadot-app" label="Polkadot app">
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

- Record the block number and extrinsic index where the pure proxy was created. These values are required to kill the proxy.
- When creating a proxy on mainnet, you can check block details on the [Tao.app block explorer page](https://www.tao.app/blocks).

:::
</TabItem>
</Tabs>

---

Creating a pure proxy adds the spawner account as the first delegate for that proxy. Additional delegates can also be added by [registering new proxy entries](create-proxy.md#add-a-proxy) from the pure proxy account, each specifying the delegate account, proxy type, etc.

## Executing calls via a pure proxy

When executing a pure proxy, the proxy account initiates the transaction, but it is signed and authorized by the spawner account. In practice, the proxy account is treated as the _real account_ during execution.

The following example shows how to execute a transfer call using a pure proxy. To do this:

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import Balances

subtensor = bt.Subtensor()

proxy_account = "PROXY_ACCOUNT_ADDRESS"  # address of the proxy account
spawner_address = bt.Wallet(name="WALLET_NAME")  # name of the signer/spawner wallet
recipient_wallet = "RECIPIENT_WALLET"

# Create a transfer call
transfer_amount = bt.Balance.from_tao(1.0)
transfer_call = Balances(subtensor).transfer_keep_alive(
   dest=recipient_wallet,
   value=transfer_amount.rao,
)

# Execute the call through the proxy
response = subtensor.proxy(
   wallet=spawner_address,  # spawner signs the transaction
   real_account_ss58=proxy_account,  # proxy acts as real account
   force_proxy_type=ProxyType.Any,
   call=transfer_call,
)

if response.success:
   print(f"✓ Transfer executed through proxy!")
   print(f"  Transferred {transfer_amount} from {proxy_account[:10]}...")
else:
   print(f"✗ Failed: {response.message}")
```

:::info Building a call

Before executing a proxy through the SDK, you must first build the inner call that represents the action you want the chain—or proxy—to perform. This can be done by creating a generic call manually (for example using `subtensor.compose_call()`) or by using the SDK’s built-in call builders from the relevant pallet.

To build a call using the SDK call builder, import the relevant pallet class (e.g., `Proxy`, `Balances`, `SubtensorModule`, etc.) from `bittensor.core.extrinsics.pallets`, instantiate it with your subtensor instance, then call the method for the extrinsic you need. For example:

```py
from bittensor.core.extrinsics.pallets import Proxy
from bittensor.core.extrinsics.pallets import Balances

# using the Proxy pallet class
Proxy(subtensor).add_proxy(...)

# using the Balances pallet class
Balances(subtensor).transfer_keep_alive(...)
```

:::

:::warning
Ensure the pure proxy account holds enough funds to cover both the transfer and transaction fees.

:::

  </TabItem>
<TabItem value="polkadot-app" label="Polkadot app">

1. Go to **Developer** → **Extrinsics**.
2. Under “using the selected account”, choose the spawner account—account that created the proxy.
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
- Ensure the pure proxy account holds enough funds to cover both the transfer and transaction fees.
  :::

</TabItem>
</Tabs>

---

## Kill a pure proxy

Killing a pure proxy requires the proxy account address, the spawner account, and the proxy's complete creation details—the block height, extrinsic index, and disambiguation index. Once executed, the pure proxy is permanently removed, and any funds remaining in the proxy account are lost.

Pure proxies are killed using the `killPure` extrinsic as shown. See [source code: `killPure` implementation](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L380-L406):

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType

subtensor = bt.Subtensor()

spawner_address = bt.Wallet(name="WALLET_NAME")  # signer/spawner

proxy_address = "PROXY_ADDRESS"
proxy_type = ProxyType.Any
index = 0
height = "BLOCK_HEIGHT"
ext_index = "EXTRINSIC_INDEX"

# Kill the pure proxy
response = subtensor.kill_pure_proxy(
    wallet=spawner_address,
    pure_proxy_ss58=proxy_address,
    spawner=spawner_address.coldkeypub.ss58_address,  # Valid only when the spawner account signs the extrinsic
    proxy_type=proxy_type,
    index=index,    # the disambiguation index
    height=height,    # the block height where the proxy was created
    ext_index=ext_index,  # the extrinsic index of the `Proxy.PureCreated` transaction
)

if response.success:
    print("✓ Pure proxy killed successfully!")
else:
    print(f"✗ Failed: {response.message}")
```

  </TabItem>
<TabItem value="polkadot-app" label="Polkadot app">

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
</TabItem>
</Tabs>

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
