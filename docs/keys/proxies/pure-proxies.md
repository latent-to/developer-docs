---
title: "Understanding Pure Proxies"
toc_max_heading_level: 2
---

# Understanding Pure Proxies

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { SdkVersion } from "../../sdk/\_sdk-version.mdx";

This page covers creating a pure proxy and executing a call using a pure proxy. The primary use case for pure proxies is constructing multisignature wallets (multisigs) with swappable members. For most other applications requiring wallet indirection, regular proxy wallets are the correct solution.

See:

- [Proxies Overview](./)
- [Working with Proxies](./working-with-proxies)
- [Secure a Coldkey with a Multisig Wallet](../multisig)

## Overview of pure proxies

Pure proxies are **keyless, non-deterministic accounts** that are created fresh using the `createPure` extrinsic. They represent a unique approach to account delegation where:

- The proxy account has **no private key** and cannot sign transactions independently
- The proxy can **only act through its delegator**—all operations must be initiated by the delegator
- The account is **completely isolated** and cannot escalate its own permissions

Pure proxies are unlike standard proxies, where the proxy can access the real account's funds to execute calls on their behalf. A pure proxy account must hold its own funds, while the spawner account acts as an _Any proxy_ for it, signing and authorizing transactions on the proxy's behalf.

It is critical to understand that pure proxies do not offer the security advantage of regular proxy wallets, which is to allow a single, less sensitive wallet to perform operations on behalf of a more valuable wallet, allowing the more sensitive wallet to remain protected behind more stringent access security. Instead, the main application of pure proxies is to solve an operational problem posed by multisig wallets, as described below.

### Transaction flow in pure proxies

All transactions involving a pure proxy must be signed by the spawner account. Once signed, the transaction is executed on-chain as if it originated directly from the pure proxy. Unlike standard proxies, a pure proxy must hold its own funds to cover fees or transfers. The spawner then acts as an _Any proxy_, handling the signing and authorization of calls, but the balance used comes from the pure proxy's account.

### Multisigs and Pure Proxies

Multisignature wallets offer a unique security advantage (see [Secure a Coldkey with a Multisig Wallet](../multisig)). However, the unique mechanism that underlies them cryptographically presents an operational difficulty. A multisig address is deterministically derived from its members. If you create a 2-of-3 multisig with Alice, Bob, and Charlie, you get a specific address. Therefore, if Charlie leaves and Dave joins, you must create an entirely new multisig with a new address—then transfer all funds and update all references.

Pure proxies offer a workaround; instead of basing the multisig on people's coldkeys directly, you can base it off or pure proxies controlled by the members of a multisig, you can make **pure proxies** the members:

```
Multisig (Any 2 of 3 signatures required to sign transaction)
├── Pure Proxy A ← controlled by Alice
├── Pure Proxy B ← controlled by Bob
└── Pure Proxy C ← controlled by Charlie
```

When Charlie leaves and Dave joins:

1. Charlie transfers control of Pure Proxy C to Dave
2. Dave now controls Pure Proxy C, allowing him to co-sign transactions with either Alice or Bob. Charlie's key is now unable to co-sign.
3. **The multisig itself never changes**—same address, same members (the pure proxies)

This approach means you never need to recreate the multisig or transfer funds when team members change. The pure proxy addresses remain constant; only who controls each pure proxy changes.

### Transferring control of a pure proxy

You can transfer control of a pure proxy to a new account by:

1. Adding the new account as an _Any_ type proxy for the pure proxy
2. Removing the old controller as proxy

This is how you swap members in a multisig-of-pure-proxies setup: the outgoing member adds the incoming member as a proxy for their pure proxy, then removes themselves. See [source code: pure proxy account generation](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L827-L850).

## Prerequisites

Before creating a pure proxy, ensure you have a spawner account that will initialize and control the pure proxy.

## Create a pure proxy

The `proxy::createPure` extrinsic creates a pure proxy. See [source code: `createPure` implementation](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L328-L360).

Use this operation to generate a pure proxy account:

<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

```bash
btcli proxy create \
  --wallet.name WALLET_NAME \
  --proxy-type Any \
  --delay 0 \
  --index 0
```

**Parameters:**

- `--wallet.name`: Your wallet name (the spawner account that will control the proxy)
- `--proxy-type`: The type of proxy (e.g., `Any`, `Staking`, `Transfer`, etc.)
- `--delay`: Optional delay in blocks (0 for immediate execution)
- `--index`: Disambiguation index for creating unique addresses (usually 0)

**Example output:**

```console
Created pure '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
from spawner '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
with proxy type 'Any' with delay 0.

Extrinsic hash: 0xcd5ded2dfc505152870610233532646f6ebdd930793fa82f999d9bda2b79c2b5
Block: 1234567
Extrinsic index: 2
```

:::tip Save creation details
**Record the following values** from the output—you'll need them to kill the proxy later:

- Pure proxy address
- Block number (height)
- Extrinsic index
- The index value you used
- The proxy type you chose

BTCLI will prompt you to save this to your address book for convenience.
:::

**Save to address book:**

```bash
# Optionally add to your local address book
btcli config add-proxy \
  --name my-pure-proxy \
  --address 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty \
  --proxy-type Any \
  --spawner 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY \
  --delay 0
```

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

<SdkVersion />

```python
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType

subtensor = bt.Subtensor()

spawner = bt.Wallet(name="WALLET_NAME")

response = subtensor.create_pure_proxy(
    wallet=spawner,
    proxy_type=ProxyType.Any,
    delay=0,  # delay in blocks
    index=0,  # the disambiguation index, leave as zero
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
- The `index` parameter is a disambiguation index/salt value (u16, range 0-65535) used to generate unique pure proxy addresses, used to disambiguate proxies that have identical parameters otherwise. This should generally be left as `0` unless you are creating batches of proxies. When creating multiple pure proxies with identical `proxy_type` and `delay`, different index values will produce different addresses. This is not a sequential counter—you can use any unique values (e.g., 0, 100, 7, 42) in any order. The index must be preserved as it's required for killing the pure proxy later. If creating multiple pure proxies in a single batch transaction, each must have a unique index value.
- The proxy type can be provided either by importing and using the `ProxyType` enum or by passing the proxy type as a string. For available proxy types and their permissions, see [Proxy Types](https://docs.learnbittensor.org/keys/proxies#types-of-proxies).
  :::

</TabItem>

<TabItem value="polkadot-app" label="Polkadot app">
1. In the navbar menu, navigate to **Developers** → **Extrinsics**.
2. Under “using the selected account”, pick the delegator account.
3. Under “submit the following extrinsic”, choose the `proxy` pallet and call `createPure(proxyType, delay, index)`.
4. Fill the parameters:
   - `proxyType`: select `Any`; this grants full permissions to the proxy, including the ability to make transfers and kill the proxy.
   - `delay`: optionally, include a delay in blocks. The time-lock period in blocks. A delay of `0` means immediate execution. A non-zero value requires announcements before execution.
   - `index`: a disambiguation index/salt value (0-65535) used to generate unique pure proxy addresses. This should generally be left as `0` unless you are creating batches of proxies. When creating multiple pure proxies with the same `proxyType` and `delay`, use different index values to generate different addresses. This is not a sequential counter—you can use any unique values (e.g., 0, 100, 7, 42). The index must be preserved as it's required for killing the pure proxy later.
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

Creating a pure proxy adds the spawner account as the first delegate for that proxy. Additional delegates can also be added by [registering new proxy entries](working-with-proxies.md#add-a-proxy-relationship) from the pure proxy account, each specifying the delegate account, proxy type, etc.

## Executing calls via a pure proxy

When executing a pure proxy, the proxy account initiates the transaction, but it is signed and authorized by the spawner account. In practice, the proxy account is treated as the _real account_ during execution.

The following example shows how to execute a transfer call using a pure proxy. To do this:

<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

With pure proxies in BTCLI, use the `--proxy` flag with the **pure proxy address** as the value, and sign with the **spawner wallet**:

```bash
# Example: Transfer funds from the pure proxy
btcli wallet transfer \
  --wallet.name spawner_wallet \
  --proxy PURE_PROXY_ADDRESS \
  --dest RECIPIENT_ADDRESS \
  --amount 1.0
```

**How it works:**

- `--wallet.name spawner_wallet`: The spawner wallet signs the transaction
- `--proxy PURE_PROXY_ADDRESS`: The pure proxy account acts as the origin
- The transfer will appear to come from the pure proxy address
- Funds are deducted from the pure proxy's balance

**Using saved proxies:**
If you saved the pure proxy to your address book:

```bash
btcli wallet transfer \
  --wallet.name spawner_wallet \
  --proxy my-pure-proxy \
  --dest RECIPIENT_ADDRESS \
  --amount 1.0
```

:::warning Pure proxy must be funded
Ensure the pure proxy account has enough funds to cover both the transfer amount and transaction fees. Transfer funds to the pure proxy first using a regular transfer.
:::

**Other operations through pure proxies:**

```bash
# Add stake through pure proxy
btcli stake add \
  --wallet.name spawner_wallet \
  --proxy PURE_PROXY_ADDRESS \
  --netuid 0 \
  --amount 10.0

# Remove stake through pure proxy
btcli stake remove \
  --wallet.name spawner_wallet \
  --proxy PURE_PROXY_ADDRESS \
  --netuid 0 \
  --amount 5.0
```

</TabItem>

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

## Kill a pure proxy

Killing a pure proxy requires the proxy account address, the spawner account, and the proxy's complete creation details—the block height, extrinsic index, and the disambiguation index used during creation. Once executed, the pure proxy is permanently removed, and any funds remaining in the proxy account are lost.

Pure proxies are killed using the `killPure` extrinsic as shown. See [source code: `killPure` implementation](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L380-L406):

:::danger Permanent deletion
Killing a pure proxy permanently deletes the pure proxy account. **Any funds remaining in the account will be permanently lost.** Make sure to transfer all funds out before killing the proxy.

BTCLI will prompt you for confirmation with the text "KILL" to proceed.
:::

<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

```bash
btcli proxy kill \
  --wallet.name SPAWNER_WALLET \
  --height BLOCK_NUMBER \
  --ext-index EXTRINSIC_INDEX \
  --proxy-type Any \
  --index 0 \
  --spawner SPAWNER_ADDRESS
```

**Required Parameters:**

- `--wallet.name`: The spawner wallet that created the proxy
- `--height`: The block number where the pure proxy was created
- `--ext-index`: The extrinsic index of the creation transaction
- `--proxy-type`: Must match the type used when creating (e.g., `Any`)
- `--index`: Must match the index used when creating (usually `0`)
- `--spawner`: The SS58 address of the spawner account

**Example:**

Suppose we created a pure proxy and received output as follows:

```console
 btcli proxy create \
  --wallet.name PracticeSafeWallet \
  --proxy-type Transfer \
  --delay 0 \
  --index 0

This will create a Pure Proxy of type Transfer. Do you want to proceed? [y/n]: y
Enter your password:
Decrypting...
l✅ Your extrinsic has been included as 5960138-7
Created pure '5DvEUipraHsk26renzART8NKuskd3yacsJq64wKHRGTpncCn' from spawner '5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt' with proxy type 'Transfer' with delay 0.
```

We use the block number/extrinsic index as follows when identifying the pure proxy to kill:

```bash
btcli proxy kill \
  --wallet.name PracticeSafeWallet \
  --proxy-type Transfer \
  --spawner 5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt

Enter the block number at which the proxy was created: 5960138
Enter the extrinsic index of the `btcli proxy create` event.: 5960138

This will kill a Pure Proxy account of type Transfer.
All access to this account will be lost. Any funds held in it will be inaccessible.To proceed, enter KILL: KILL
Enter your password:
Decrypting...
✅Success!
```

</TabItem>

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
    index=index,    # the disambiguation index/salt value used during creation (must match exactly)
    height=height,    # the block height where the proxy was created
    ext_index=ext_index,  # the extrinsic index of the `Proxy.PureCreated` transaction
)

if response.success:
    print("✓ Pure proxy killed successfully!")
else:
    print(f"✗ Failed: {response.message}")
```

:::info Parameter requirements

- The `index`, `proxy_type`, and `delay` (from creation) must exactly match those used when creating the pure proxy.
- `height` and `ext_index` uniquely identify the creation transaction. Together, they specify exactly when and where in the blockchain the pure proxy was created. These values are returned in the `PureCreated` event from `create_pure_proxy()`.
:::

  </TabItem>
<TabItem value="polkadot-app" label="Polkadot app">

1. Go to **Developer** → **Extrinsics**.
2. Under “using the selected account”, choose the pure proxy account.
3. Select the `proxy` pallet and choose `killPure(spawner, proxyType, index, height, extIndex)`.
4. Fill the parameters:
   - `spawner`: select the account that created the proxy from the UI.
   - `proxyType`: select the proxy type (must match the value used during creation).
   - `index`: enter the disambiguation index/salt value used during creation (typically `0` unless you created multiple pure proxies with identical parameters). Must match exactly the index used in `createPure`.
   - `height`: input the block number that the proxy was created at.
   - `extIndex`: input the extrinsic index of the `proxy.PureCreated` event.
5. Click **Submit Transaction** and sign the transaction from the delegate account.

Ensure that all parameters are correct before making this call. The call will fail with a `Proxy.NoPermission` error if any parameter is invalid or if the origin account lacks permission to perform the action.
</TabItem>
</Tabs>

## Troubleshooting

- `Token.FundsUnavailable`: Ensure that the pure proxy account has been funded and has enough funds to cover the transfer.
- `proxy.NotProxy`: Ensure you're executing the pure proxy correctly—from the creator account and referencing the pure proxy account as `real`. See [source code: `NotProxy` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L735).
- `Proxy.NoPermission`: The `killPure` call is not permitted under the current. See [source code: `NoPermission` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L741).
- `system.CallFiltered`: The call is not permitted under the current `ProxyType`.
