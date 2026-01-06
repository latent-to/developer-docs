---
title: "Working with Proxies"
# toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { SdkVersion } from "../../sdk/\_sdk-version.mdx";

# Working with Proxies

This page covers each step in the use of proxy wallets as a security feature for Bittensor operations:

- Creating proxy relationships between existing wallets
- Executing transactions with 0-day proxy wallets.
- Announcing and then executing transactions with a non-zero delay period.
- Removing proxy relationships

See:

- [Proxies: Overview](./index.md)
- [Staking with a Proxy](./staking-with-proxy.md)

## Introduction

### Security Considerations

Proxy wallets are a powerful security feature, but to get the full benefits, it is critical to observe good key security. When one wallet serves as proxy for another (the 'safe wallet'), both the safe wallet and the proxy wallet have their own full coldkey keypair (the public key which goes into the wallet's address, and the private key, which is recoverable using the seed phrase), and must be handled with proper care.

Generally, the safe wallet should be given the maximum security possible, whereas the proxy wallet (if it is carefully limited in its permissions), can be handled in a more convenient, less secure way. For example, a proxy might be loaded into a less trusted compute runtime, whereas the safe wallet's coldkey private key/seed phrase should _never_ be loaded into any but the most absolutely secure device). However, depending on the proxy's configuration, compromise of a proxy wallet's coldkey can still be disastrous. For example, a proxy with `ProxyType`:`any` and `delay`:`0` can immediately perform any operation on behalf of the safe wallet, so leaking such a proxy key is just as bad as leaking the safe wallet key.

Before executing any operations with any coldkeys holding TAO on Bittensor main network, carefully think through the desired end result and the steps required to achieve it.

See: [Coldkey and Hotkey Workstation Security](../coldkey-hotkey-security).

### Prerequisites

#### Practice/Dev

To follow along with the below examples for practice, you have two options:

- [Run a Local Bittensor Blockchain Instance](../../local-build/deploy).
- Follow along on test network, if you have some test TAO.

#### Main Network

Once you have practiced on a local or test chain, and you are ready to execute these operations on Bittensor main network (`finney`), you will need two wallets and enough TAO to cover some small fees:

- The safe wallet or 'real account' that will be protected by the proxy.
- The proxy wallet, which will act on behalf of the safe wallet.

:::warning fee
The delegate account must hold enough funds to cover transaction fees, which are approximately 25 Rao (0.000025 TAO).

See: [Fees](../../learn/fees)
:::

## Add a Proxy Relationship

Add a proxy record on the blockchain to designate a proxy wallet for your safe wallet.

:::note consider security!
Note that this operation requires the safe wallet's coldkey private key, which is a maximally sensitive and valuable cryptographic secret.

For any wallet with real-value TAO (i.e. TAO on Bittensor's main network, `finney`), coldkey private keys and seed phrases should be handled with utmost care, only on dedicated coldkey workstations.

See: [Coldkey and Hotkey Workstation Security](../coldkey-hotkey-security).
:::

:::info
Multiple proxy relationships can exist between a pair of wallets, as long as each proxy entry uses a different `ProxyType`. Attempting to register a duplicate entry with the same delegate and `ProxyType` will result in a `proxy.Duplicate` error.
:::
<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

### Add the on-chain proxy relationship

Run `btcli proxy add` to create a proxy relationship between existing wallets on-chain.

Note that `--wallet.name` specifies the _safe wallet_, since the private key must be loaded in for the safe wallet, not the proxy. This makes sense because it is the safe wallet that is _delegating_ the authority to order transactions to the proxy wallet, so it must be authenticated with the private key using its encryption password.

```bash
btcli proxy add \
  --wallet.name SAFE_WALLET_NAME \
  --delegate PROXY_WALLET_COLDKEY_ss58 \ # Proxy wallet's coldkey
  --proxy-type PROXY_TYPE \
```

**Parameters:**

- `--wallet.name`: Your wallet name (the real account that will authorize the proxy)
- `--delegate`: The SS58 address of the proxy (i.e. the delegate of transaction power)
- `--proxy-type`: The type of proxy relationship (e.g., `Staking`, `Transfer`, `Any`, etc.)
- `--delay`: Optional delay in blocks (0 for immediate execution)

For our example, we'll use two wallets called `PracticeSafeWallet` and `PracticeProxy`. To follow along, create two new wallets with these names and substitute their coldkey ss58 addresses:

- **`PracticeSafeWallet`**: `5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt`
- **`PracticeProxy`**: `5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe`

To give the `PracticeProxy` account the ability to order small transfers from the `PracticeSafeWallet` wallet's balance immediately (with 0 delay), we'll use the following comand:

```bash
btcli proxy add \
  --wallet.name PracticeSafeWallet \
  --delegate 5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe \
  --proxy-type SmallTransfer \
  --network test
```

```console
✅ Your extrinsic has been included as 5951841-6
Added proxy delegatee '5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe' from delegator
'5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt' with proxy type 'SmallTransfer' with delay 0.
Would you like to add this to your address book? [y/n]: y
```

### BTCLI's proxy address book

Use ` btcli config add-proxy` to configure your local BTCLI with a proxy relationship. Make sure to follow the instructions carefully depending on whether:

1. You are using a proxy relationship between pre-existing wallets, as described on this page. This covers most use cases for proxies.
1. You are using a pure proxy. See [pure proxies](./pure-proxies).

View all saved proxies with:

```bash
btcli config proxies
```

```console
 Name                    Address                 Spawner/Delegator       Proxy Type      Delay   Note
 ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  practice-proxying                 5CngkPSSnhK7ot6zFv3Q…   5GrwvaEF5zXb26Fz9rcQ…   Any             0       always be awesome
  practice-small-transfers   5GrwvaEF5zXb26Fz9rcQ…   5FLSigC9HGRKVhB9FiEo…   SmallTransfer   0       small transfers only
```

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

<SdkVersion />

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

print(response)

```

:::info
The proxy type can be provided either by importing and using the `ProxyType` enum or by passing the proxy type as a string.
:::

</TabItem>

<TabItem value="polkadot-app" label="Polkadot app">
1. In the navbar menu, navigate to **Developers** → **Extrinsics**.
2. Under “using the selected account”, pick the funded delegator account.
3. Under “submit the following extrinsic”, choose the `proxy` pallet and call `addProxy(delegate, proxyType, delay)`.
4. Fill the parameters:
      - `delegate`: select the imported delegate account from the _Accounts_ dropdown.
      - `proxyType`: select `SmallTransfer`; this should allow us to transfer amounts that do not exceed 0.5τ.
      - `delay`: the time-lock period in blocks. A delay of `0` means immediate execution without announcements. A non-zero value requires the delegate to announce calls first and wait for the delay period before execution.
5. Click **Submit Transaction** and sign with the _delegator_ account.

</TabItem>
</Tabs>

### Check an Account’s Proxies

You can check which proxies are associated with an account to see their delegate addresses, proxy types, and any configured delays. To do this:

<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

To check proxies in BTCLI, you can view your local address book:

```bash
btcli config proxies
```

This displays all proxies you've saved to your local address book.

:::info On-chain proxy query
BTCLI does not currently provide a command to query on-chain proxy state directly. To view all proxies registered on-chain for an account, use the SDK's `get_proxies_for_real_account()` method or query via Polkadot.js Apps.
:::

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
real_account = bt.Wallet(name="WALLET_NAME")

proxies, deposit = subtensor.get_proxies_for_real_account(
   real_account_ss58=real_account.coldkey.ss58_address
 )

print(f"Proxies: {proxies}")
```

  </TabItem>

<TabItem value="polkadot-app" label="Polkadot app">
1. From the **Developer** dropdown, navigate to **Chain state** → **Storage**.
2. Click the **selected state query** menu and select `proxy.proxies`.
3. Select the account used to create the proxy.
4. Click the **+** icon to run the query.

This returns all the proxies associated to the account and their information—`delegate`, `proxyType`, and `delay`.
</TabItem>
</Tabs>

## Execute a 0-Delay Proxy Call

A proxy wallet that is set up with a delay of 0 can execute transactions allowed by its proxy type simply by declaring which real account they are acting as proxy for.

:::note consider security!
This operation will be run in a coldkey workstation that is set up for the _proxy wallet_, not the _safe wallet/real account_. For main network (`finney`) wallets, the safe wallet's coldkey private key should _never_ be loaded onto the proxy workstation, otherwise we undermine the security advantage of the proxy relationship. The safe wallet's coldkey private key/seed phrase should be kept in cold storage as muchas possible, and should only be loaded into dedicated, highly secure, code environments provisioned specifically for that purpose.
:::

<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

Many `btcli` commands support the `--proxy` flag to proxy an operation on behalf of another wallet.

:::note terminology and parameter names
The language here may be counter-intuitive, in that the `--proxy` flag specifies the wallet _being_ proxied.

The wallet specified by `--wallet.name` is actually the wallet we normally call "the proxy", and `--proxy` specifies the safe wallet or 'real account'. It makes more sense if you think of the `--proxy` flag as specifying that the operation is being called _by_ proxy for the wallet that follows, i.e., the safe wallet.

More to the point, we can logically infer that it _must_ be the case that `--wallet.name` refers to the proxy, and the ss58 supplied (in the `--proxy` field) must refer to the safe wallet, since this command is meant to be run by the proxy, protecting the safe wallet. Therefore, the proxy's private key must be present and unlocked, not the safe wallet's, which should remain in cold storage.
:::

This command will transfer 18 TAO from PracticeSafeWallet to a third wallet, Miner.

```bash

btcli wallet transfer \
  --wallet.name PracticeProxy \
  --proxy 5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt \
  --destination 5DA7UsaYbk1UnhhtTxqpwdqjuxhQ2rW7D6GTN1S1S5tC2NRV \
  --amount 0.333 \
  --network test

```

**Proxy params:**

- `--wallet.name`: The proxy wallet that signs the transaction on behalf of the real account.
- `--proxy`: The real account's SS58 address (or proxy name from address book)

```console
Initiating transfer on network: test
Do you want to transfer:
  amount: 0.3330 τ
  from: PracticeProxy : 5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe
  to: 5DA7UsaYbk1UnhhtTxqpwdqjuxhQ2rW7D6GTN1S1S5tC2NRV
  for fee: 0.0000 τ
Transferring is not the same as staking. To instead stake, use btcli stake add instead.
Proceed with transfer? [y/n]: y
Enter your password:
Decrypting...
✅ Finalized
Block Hash: 0xc8f8cba3395cd34d6dd2e2bc3b8e1b5e6b6eeb60754dac398b08bca735a6a32d
Balance:
  98.7739 τ ➡ 98.4409 τ
```

:::tip Using saved proxies
If you haved a proxy relationship saved to your BTCLI address book, you can reference it by name as shown:

```bash
btcli wallet transfer \
  --wallet.name PracticeProxy \
  --proxy PracticeSafeWallet \
  --destination 5DA7UsaYbk1UnhhtTxqpwdqjuxhQ2rW7D6GTN1S1S5tC2NRV \
  --amount 0.333 \
  --network test
```

:::

</TabItem>

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

</TabItem>
</Tabs>

## Remove a Proxy

Removing a proxy revokes the delegate’s permission to act on behalf of the primary account, effectively ending the proxy relationship on-chain. To remove a proxy:

<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

```bash
btcli proxy remove \
  --wallet.name WALLET_NAME \
  --delegate DELEGATE_ADDRESS \
  --proxy-type Staking \
  --delay 0
```

**Parameters:**

- `--wallet.name`: Your wallet name (the real account that authorized the proxy)
- `--delegate`: The SS58 address of the delegate account to remove
- `--proxy-type`: Must match the proxy type used when adding
- `--delay`: Must match the delay value used when adding

For example, let's remove the 0-delay SmallTransfer proxy relationship we established above between our PracticeSafeWallet and PracticeProxy wallets.

```bash
btcli proxy remove \
  --wallet.name PracticeSafeWallet \
  --delegate 5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe \
  --proxy-type SmallTransfer \
  --delay 0
```

```console
This will remove a proxy of type SmallTransfer for delegate 5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe.Do you want
to proceed? [y/n]: y
✅Success!
```

:::info Removal is immediate
Unlike delayed execution, removing a proxy takes effect immediately, regardless of any delay configured on the proxy.
:::

</TabItem>

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
    delay=0,  # must match the delay value set when the proxy was added
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
The `delegate_ss58`, `proxy_type`, and `delay` parameters must exactly match those used when the proxy was added. The `delay` parameter is an identifier for the specific proxy relationship, not a delay before removal takes effect (removal is immediate). Use `get_proxies_for_real_account()` to retrieve the exact parameters for existing proxies.
:::

### Remove all proxies

Use this to remove all proxies associated with an account.

<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

BTCLI does not currently provide a single command to remove all proxies at once. You must remove each proxy individually using `btcli proxy remove`.

:::tip SDK alternative
To remove all proxies in one operation, use the SDK's `remove_proxies()` method.
:::

</TabItem>

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

## Announce and Execute a Delayed Proxy Call

If a proxy wallet has been given proxy powers to make a transaction with a delay, they must announce the call beforehand, and then wait the delay interval (specified by the `delay` parameter when the proxy relationship is created).

For example, the following snippets give the `PracticeProxy` wallet the ability to make large transfers, but only after an announcement-delay period of 100 blocks:

<Tabs groupId="proxy">
<TabItem value="btcli" label="BTCLI">
```bash
btcli proxy add \
  --wallet.name PracticeSafeWallet \
  --delegate 5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe \
  --proxy-type Transfer \
  --delay 100 \
  --network test
```

```console
Added proxy delegatee '5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe' from delegator
'5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt' with proxy type 'Transfer' with delay 100.
```

</TabItem>
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
   proxy_type=ProxyType.Transfer,
   delay=100,    # optional delay in blocks
)

print(response)

```

</TabItem>
</Tabs>

### Generate call hash

Announcing a delayed proxy call requires the hash of the call that you intend to execute. Therefore, you must first generate the call hash of the transaction you want to carry out. To generate the call hash:

<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

When you run a BTCLI command with the `--announce-only` flag, BTCLI automatically generates and adds the call hash to your `ProxyAnnouncements` address book.

</TabItem>

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

print(response)
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
--- 
### Announce a proxy call

Announcing a proxy call publishes the hash of a proxy-call that will be made in the future. To announce a delayed call:

<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

To announce a delayed proxy call via BTCLI, include the `--announce-only` flag when submitting the transaction, as shown:

```bash
# The call hash is automatically generated and saved
btcli wallet transfer \
  --wallet.name PracticeProxy \
  --proxy 5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt \
  --destination 5DA7UsaYbk1UnhhtTxqpwdqjuxhQ2rW7D6GTN1S1S5tC2NRV \
  --amount 0.333 \
  --network test \
  --announce-only


```

<details>
  <summary><strong>Show sample output</strong></summary>
```console
Do you want to transfer:
  amount: 0.3330 τ
  from: PracticeProxy : 5CZmB94iEG4Ld7JkejAWToAw7NKEfV3YZHX7FYaqPGh7isXe
  to: 5DA7UsaYbk1UnhhtTxqpwdqjuxhQ2rW7D6GTN1S1S5tC2NRV
  for fee: 0.0000 τ
Transferring is not the same as staking. To instead stake, use btcli stake add instead.
Proceed with transfer? [y/n]: y
Enter your password:
Decrypting...
Added entry 1ca5322e23ea9e36e8c8f1b912c817b89ef1fdcaaf25cacb57c173147ca3abbd at block 5953000 to your
ProxyAnnouncements address book. You can execute this with
btcli proxy execute --call-hash 1ca5322e23ea9e36e8c8f1b912c817b89ef1fdcaaf25cacb57c173147ca3abbd

✅ Finalized
Block Hash: 0x1c6378ee38b8c27f161b646125ec301f1aa52bffd63b090ec0c0876c9cc56ba5
Balance:
98.4409 τ ➡ 98.4409 τ

````
</details>
**What this does:**

- Creates and announces the call on-chain
- Saves the announcement details to your local database
- Does NOT execute the operation immediately

**After announcing:**

1. Wait for the configured delay period (in blocks) to pass
2. The real account has the option to reject the announcement during the delay period
3. Execute the call after the delay expires (see next step)

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.extrinsics.pallets import Balances

subtensor = bt.Subtensor(network="test")

# The proxy wallet (delegate) - this wallet signs the announcement
delegate_wallet = bt.Wallet(name="PracticeProxy")

# The real account (safe wallet) being proxied
real_account_ss58 = "5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt"

# Recipient of the transfer
recipient_address = "5DA7UsaYbk1UnhhtTxqpwdqjuxhQ2rW7D6GTN1S1S5tC2NRV"

# Create the call you want to execute later
# IMPORTANT: Remember these exact parameters - you must use them when executing
transfer_amount = bt.Balance.from_tao(7.0)
transfer_call = Balances(subtensor).transfer_keep_alive(
    dest=recipient_address,
    value=transfer_amount.rao,
)

# Get the call hash
call_hash = "0x" + transfer_call.call_hash.hex()
print(f"Call hash to announce: {call_hash}")

# Announce the call
response = subtensor.announce_proxy(
    wallet=delegate_wallet,
    real_account_ss58=real_account_ss58,
    call_hash=call_hash,
)

print(response)
# Save the call_hash - you'll need it to execute after the delay
````

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

### Execute a delayed proxy call

After the announcement waiting period has passed, the delegate account can now execute the proxy if the real account did not reject it. Attempting to execute the proxy before the waiting period passes returns a `proxy.Unannounced` error. To execute a delayed proxy call:

<Tabs groupId="proxy">

<TabItem value="btcli" label="BTCLI">

After the delay period has passed, execute the announced call:

```bash
btcli proxy execute \
  --wallet.name PracticeProxy \
  --proxy 5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt \
  --real 5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt \
  --call-hash 1ca5322e23ea9e36e8c8f1b912c817b89ef1fdcaaf25cacb57c173147ca3abbd \
  --network test
```

**How it works:**

- Retrieves the previously announced call from your local database
- Verifies the delay period has passed
- Executes the call on-chain
- Clears the announcement

BTCLI automatically tracks announcements you make with `--announce-only` in a local database, making execution easier. This allows you to execute a delayed proxy by using the `--call-hash` flag.

:::warning
Using the `--call-hash` flag attempts to resolve the call from the proxy announcements address book. Use this flag only if you made the proxy announcement via BTCLI.

If the proxy call was announced through a different method, you must provide the encoded hex for the call using the `--call-hex` flag or rebuild the call explicitly via the command prompts.
:::

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```python
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import Balances

subtensor = bt.Subtensor(network="test")

# The proxy wallet (delegate) - this wallet signs the transaction
delegate_wallet = bt.Wallet(name="PracticeProxy")

# The real account (safe wallet) being proxied
real_account_ss58 = "5CS9x5NsPHpb2THeS92zBYCSSk4MFoQjjx76DB8bEzeJTTSt"

# Recipient of the transfer
recipient_address = "5DA7UsaYbk1UnhhtTxqpwdqjuxhQ2rW7D6GTN1S1S5tC2NRV"

# IMPORTANT: The call must EXACTLY match the announced call (same amount, same recipient)
transfer_amount = bt.Balance.from_tao(7.0)
transfer_call = Balances(subtensor).transfer_keep_alive(
    dest=recipient_address,
    value=transfer_amount.rao,
)

# Verify the call hash matches what was announced
print(f"Call hash: 0x{transfer_call.call_hash.hex()}")

# Execute the announced call
response = subtensor.proxy_announced(
    wallet=delegate_wallet,
    delegate_ss58=delegate_wallet.coldkeypub.ss58_address,
    real_account_ss58=real_account_ss58,
    force_proxy_type=ProxyType.Any,
    call=transfer_call,
)

print(response)
# ExtrinsicResponse:
#   success: True
#   message: Success
```

:::warning Call hash must match
The call you execute **must have the exact same parameters** as the call you announced. Different amount = different call hash = `Unannounced` error.
:::

  </TabItem>
<TabItem value="polkadot-app" label="Polkadot app">
1. Go to **Developer** → **Extrinsics**.
2. Under "using the selected account", choose the delegate account.
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

:::info

- The call details on the executed proxy must exactly match the original announcement. Any change to the call or call hash will result in a `proxy.Unannounced` error.
- Once a delayed proxy call is executed, its announcement is cleared. To execute another proxy with the same details, you must create a new announcement and wait for the waiting period to pass.
  :::

## Troubleshooting

- `proxy.Duplicate`: A proxy with the same configuration already exists on the real account. See [source code: `Duplicate` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L739).
- `proxy.Unannounced`: A non-zero delay proxy requires an announcement; announce and wait the delay. See [source code: `Unannounced` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L743).
- `proxy.Unproxyable`/`system.CallFiltered`: The call is not permitted under the current `ProxyType`. See [source code: `Unproxyable` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L737).
- `proxy.TooMany`: You exceeded `MaxProxies` or `MaxPending`. Remove unused proxies/announcements. See [source code: `TooMany` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L731).
- `proxy.NotProxy`: Ensure you're submitting from the delegate account and referencing the correct real account. See [source code: `NotProxy` error](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L735).
- `Token.FundsUnavailable`: Ensure that your real account has enough available funds to cover the transaction.
