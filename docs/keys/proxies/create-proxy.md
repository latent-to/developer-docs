---
title: "Working with Proxies"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with Proxies

This page covers creating a standard proxy and executing a call from the proxy account.

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

- Real (delegator) account that controls funds and adds the proxy.
- Delegate account to perform allowed actions.

## Add a Proxy

You can add a proxy to authorize another account to perform actions on your behalf. To do this:

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType

subtensor = bt.Subtensor()

real_account = bt.Wallet(name="WALLET_NAME") # Your real account
delegate_address = "DELEGATE_ADDRESS" # Your delegate wallet address

response = subtensor.add_proxy(
   wallet=real_account,
   delegate_ss58=delegate_address,
   proxy_type=ProxyType.Any,
   delay=0,    # optional delay in blocks
)

if response.success:
   print(f"✓ Proxy added successfully!")
else:
   print(f"✗ Failed: {response.message}")

```

  </TabItem>

<TabItem value="polkadot-app" label="Polkadot app">
1. In the navbar menu, navigate to **Developers** → **Extrinsics**.
2. Under “using the selected account”, pick the funded delegator account.
3. Under “submit the following extrinsic”, choose the `proxy` pallet and call `addProxy(delegate, proxyType, delay)`.
4. Fill the parameters:
      - `delegate`: select the imported delegate account from the _Accounts_ dropdown.
      - `proxyType`: select `SmallTransfer`; this should allow us to transfer amounts that do not exceed 0.5τ.
      - `delay`: optionally, include a delay in blocks.
5. Click **Submit Transaction** and sign with the _delegator_ account.

</TabItem>
</Tabs>

---

Your delegate wallet is now authorized to execute small transfers on behalf of the real account.

:::info
A delegator can assign multiple proxies to the same delegate account. However, each proxy entry must use a unique `ProxyType`. Attempting to register a duplicate entry with the same delegate and `ProxyType` will result in a `proxy.Duplicate` error.
:::

### Check an Account’s Proxies

You can check which proxies are associated with an account to see their delegate addresses, proxy types, and any configured delays. To do this:

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
real_account = bt.Wallet(name="WALLET_NAME")

proxies, deposit = subtensor.get_proxies_for_real_account(
   real_account_ss58=real_account.coldkey.ss58_address
 )
```

  </TabItem>

<TabItem value="polkadot-app" label="Polkadot app">
1. From the **Developer** dropdown, navigate to **Chain state** → **Storage**.
2. Click the **selected state query** menu and select `proxy.proxies`.
3. Select the account used to create the proxy.
4. Click the **+** icon to run the query.

</TabItem>
</Tabs>

---

This returns all the proxies associated to the account and their information—`delegate`, `proxyType`, and `delay`.

## Execute a Proxy Call

Use this operation to perform a transaction or call on behalf of another account through an active proxy. When executing a standard proxy, the real account initiates the transaction, but it is signed and authorized by the delegate account.

The following example shows how to execute a transfer call using a proxy. To do this:

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import Balances

subtensor = bt.Subtensor()

real_account = "REAL_ACCOUNT_ADDRESS"  # address of the real account
delegate_address = bt.Wallet(name="PROXY_WALLET")  # name of the proxy wallet
recipient_wallet = "RECIPIENT_WALLET"

# Create a transfer call
transfer_amount = bt.Balance.from_tao(1.0)
transfer_call = Balances(subtensor).transfer_keep_alive(
   dest=recipient_wallet,
   value=transfer_amount.rao,
)

# Execute the call through the proxy
response = subtensor.proxy(
   wallet=delegate_address,  # Proxy signs the transaction
   real_account_ss58=real_account,  # Real account (origin)
   force_proxy_type=ProxyType.Any,
   call=transfer_call,
)

if response.success:
   print(f"✓ Transfer executed through proxy!")
   print(f"  Transferred {transfer_amount} from {real_account[:10]}...")
else:
   print(f"✗ Failed: {response.message}")
```

:::warning
The delegate account must hold enough funds to cover transaction fees, which are approximately 25 µTAO (0.000025 TAO).
:::

  </TabItem>
<TabItem value="polkadot-app" label="Polkadot app">

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

- With the SmallTransfer proxy type, transfers are limited to less than 0.5 TAO (500,000,000 RAO). Use the Transfer proxy type for amounts above this limit. See [source code: SmallTransfer limit definition](https://github.com/opentensor/subtensor/blob/main/common/src/lib.rs#L43).
- The delegate account must hold enough funds to cover transaction fees, which are approximately 25 µTAO (0.000025 TAO).
  :::

</TabItem>
</Tabs>

---

## Handle delayed proxies

If you configured a non-zero delay when creating a proxy, you must first make an announcement before executing the proxy call. Attempting to execute a proxy call before announcing returns a `proxy.Unannounced` error.

<details>
<summary><strong>Generate call hash</strong></summary>

Announcing a delayed proxy call requires the hash of the call that you intend to execute. Therefore, you must first generate the call hash of the transaction you want to carry out. To generate the call hash:

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.extrinsics.pallets import Balances

subtensor = bt.Subtensor()

recipient_address = "RECIPIENT_WALLET"

# Create the call you want to execute later
transfer_amount = bt.Balance.from_tao(1.0)
transfer_call = Balances(subtensor).transfer_keep_alive(
   dest=recipient_address,
   value=transfer_amount.rao,
)

# Get the call hash
call_hash = "0x" + transfer_call.call_hash.hex()

if response.success:
   print(f"  Call hash: {call_hash}")
else:
   print(f"✗ Failed: {response.message}")
```

  </TabItem>
<TabItem value="polkadot-app" label="Polkadot app">
1. Go to **Developer** → **Extrinsics**.
2. Under “**using the selected account**”, pick the delegate account.
3. Under “**submit the following extrinsic**”, choose the `balances` pallet and call the `transferKeepAlive(dest, value)` extrinsic.
4. Fill the parameters:
      - `dest`: select the recipient account.
      - `value`: input the amount to be transferred in RAO—1 TAO = 1<sup>9</sup>RAO.
5. Copy the hex code shown in the **encoded call data** field. You will use this to announce the call in the next step.

:::info
Do not submit the transaction after entering the parameters. Only copy the encoded call data once all parameters are provided.
:::

</TabItem>
</Tabs>

</details>

### Announce a proxy call

Announcing a proxy call publishes the hash of a proxy-call that will be made in the future. To announce a delayed call:

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import Balances

subtensor = bt.Subtensor()

delegate_address = bt.Wallet(name="PROXY_WALLET")
real_account = "REAL_ACCOUNT_ADDRESS"
recipient_address = "RECIPIENT_WALLET"

# Create the call you want to execute later
transfer_amount = bt.Balance.from_tao(1.0)
transfer_call = Balances(subtensor).transfer_keep_alive(
    dest=recipient_address,
    value=transfer_amount.rao,
)

# Get the call hash
call_hash = "0x" + transfer_call.call_hash.hex()

# Announce the call
response = subtensor.announce_proxy(
    wallet=delegate_address,
    real_account_ss58=real_account,
    call_hash=call_hash,
)

if response.success:
    print("✓ Proxy call announced!")
    print(f"  Call hash: {call_hash}")
else:
    print(f"✗ Failed: {response.message}")
```

:::info
Next, wait for the duration of the configured delay before executing the call. During the waiting period, the delegate can cancel the announcement—`subtensor.remove_proxy_announcement()`, while the real account retains final authority to reject it—`subtensor.reject_proxy_announcement()`.
:::
</TabItem>
<TabItem value="polkadot-app" label="Polkadot app">

1. Go to **Developer** → **Extrinsics** tab.
2. Choose the `proxy` pallet and select the `announce(real, call_hash)` extrinsic.
3. Fill the parameters:
   - `real`: select the real account used to create the proxy.
   - `callHash`: paste the call hash of the transaction to be executed.
4. Click **Submit Transaction** and sign the transaction from the delegate account.

:::info
Next, wait for the duration of the configured delay before executing the call. During the waiting period, the delegate can cancel the announcement—`removeAnnouncement(real, callHash)`, while the real account retains final authority to reject it—`rejectAnnouncement(delegate, callHash)`.
:::
</TabItem>
</Tabs>

---

### Execute a delayed proxy call

After the announcement waiting period has passed, the delegate account can now execute the proxy if the real account did not reject it. Attempting to execute the proxy before the waiting period passes returns a `proxy.Unannounced` error. To execute a delayed proxy call:

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import Balances

subtensor = bt.Subtensor()

delegate_address = bt.Wallet(name="PROXY_WALLET")
real_account = "REAL_ACCOUNT_ADDRESS"
recipient_address = "RECIPIENT_ADDRES>"

transfer_amount = bt.Balance.from_tao(1.0)
transfer_call = Balances(subtensor).transfer_keep_alive(
    dest=recipient_address,
    value=transfer_amount.rao,
)

# Execute the announced call
response = subtensor.proxy_announced(
    wallet=delegate_address,
    delegate_ss58=delegate_address.coldkeypub.ss58_address,
    real_account_ss58=real_account,
    force_proxy_type=ProxyType.Any,
    call=transfer_call,
)

if response.success:
    print("✓ Delayed proxy executed successfully!")
else:
    print(f"✗ Failed: {response.message}")
```

  </TabItem>
<TabItem value="polkadot-app" label="Polkadot app">
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

</TabItem>
</Tabs>

---

:::info

- The call details on the executed proxy must exactly match the original announcement. Any change to the call or call hash will result in a `proxy.Unannounced` error.
- Once a delayed proxy call is executed, its announcement is cleared. To execute another proxy with the same details, you must create a new announcement and wait for the waiting period to pass.
  :::

## Remove a Proxy

Removing a proxy revokes the delegate’s permission to act on behalf of the primary account, effectively ending the proxy relationship on-chain. To remove a proxy:

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType

subtensor = bt.Subtensor()

real_account = bt.Wallet(name="WALLET_NAME")
delegate_address = "DELEGATE_ADDRESS"

response = subtensor.remove_proxy(
    wallet=real_account,
    delegate_ss58=delegate_address,
    proxy_type=ProxyType.Any,
    delay=0,
)

if response.success:
    print("✓ Proxy removed successfully!")
else:
    print(f"✗ Failed: {response.message}")
```

  </TabItem>
<TabItem value="polkadot-app" label="Polkadot app">

1. In the navbar menu, navigate to **Developers** → **Extrinsics**.
2. Under “using the selected account”, pick the delegator account.
3. Under "submit the following extrinsic", choose the `proxy` pallet and call `removeProxy(delegate, proxyType, delay)`.
4. Fill the parameters:
   - `delegate`: select the imported delegate account from the _Accounts_ dropdown.
   - `proxyType`: select `SmallTransfer`; this should allow us to transfer amounts that do not exceed 0.5τ.
   - `delay`: Optionally, include a delay in blocks.
5. Click **Submit Transaction** and sign with the _delegator_ account.

</TabItem>
</Tabs>

:::info
The parameters for the proxy being removed must exactly match the proxy type and delay specified when it was added.
:::

### Remove all proxies

Use this to remove all proxies associated with an account.

<Tabs groupId="proxy">

  <!-- <TabItem value="btcli" label="BTCLI">
  </TabItem> -->

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt

subtensor = bt.Subtensor(network="local")

real_account = bt.Wallet(name="sn-creator")

response = subtensor.remove_proxies(wallet=real_account)

if response.success:
    print(f"✓ All proxies removed!")
else:
    print(f"✗ Failed: {response.message}")
```

  </TabItem>
<TabItem value="polkadot-app" label="Polkadot app">

1. In the navbar menu, navigate to **Developers** → **Extrinsics**.
2. Under “using the selected account”, pick the delegator account.
3. Under "submit the following extrinsic", choose the `proxy` pallet and call `removeProxies()`.
4. Click **Submit Transaction** and sign with the _delegator_ account.

</TabItem>
</Tabs>

---

## Troubleshooting

- `proxy.Duplicate`: A proxy with the same configuration already exists on the real account. See [source code: `Duplicate` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L739).
- `proxy.Unannounced`: A non-zero delay proxy requires an announcement; announce and wait the delay. See [source code: `Unannounced` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L743).
- `proxy.Unproxyable`/`system.CallFiltered`: The call is not permitted under the current `ProxyType`. See [source code: `Unproxyable` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L737).
- `proxy.TooMany`: You exceeded `MaxProxies` or `MaxPending`. Remove unused proxies/announcements. See [source code: `TooMany` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L731).
- `proxy.NotProxy`: Ensure you're submitting from the delegate account and referencing the correct real account. See [source code: `NotProxy` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L735).
- `Token.FundsUnavailable`: Ensure that your real account has enough available funds to cover the transaction.
