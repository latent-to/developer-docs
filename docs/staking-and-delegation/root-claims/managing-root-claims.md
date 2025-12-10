---
title: "Managing Root Claims"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { SdkVersion } from "../../sdk/_sdk-version.mdx";

# Managing Root Claims

This page covers how to configure, monitor, and claim root dividends, i.e. dividends from staking to validators on the Root Subnet. See [Root Claim](./)

## Prerequisites

- A coldkey with TAO staked on the root network (subnet 0).
- A hotkey that's registered and staked on one or more subnets.
- To set your Root Claim preference requires a transaction fee, so you must be able to cover the cost of the fee.

## Set a claim type

Your claim type determines what happens to your root dividends when they're claimed:

**Claim Types:**

- **Swap** (default): Future Root Alpha Emissions are swapped to TAO and added to root stake.
- **Keep**: Future Root Alpha Emissions are kept as Alpha tokens.
- **KeepSubnets**: Keep Alpha for specific subnets only; all other subnets are swapped to TAO. This gives you fine-grained control over which subnet tokens you want to hold. Note that this is a new feature and not yet supported by BTCLI and the SDK (coming soon).


<Tabs groupId="root-claim">
  <TabItem value="btcli" label="BTCLI">

Use the `btcli stake set-claim` command to set your root claim type:

```bash
btcli stake set-claim
```

The command will display your current setting and prompt for changes.

<details>
<summary><strong>Show Sample Output</strong></summary>

```console
                    Current root claim type:

 Coldkey                                            Root Claim Type
 ──────────────────────────────────────────────────────────────────
 5G4mxrN8msvc4jjwp7xoBrtAejTfAMLCMTFGCivY5inmySbq        Swap

Select new root claim type [Swap/Keep] (Swap): Keep

Changing root claim type from 'Swap' -> 'Keep'

Note: With 'Keep', future root alpha emissions will be kept as Alpha tokens.

Do you want to proceed? [y/n]: y
Enter your password:
Decrypting...
✅ Successfully set root claim type to 'Keep'
✅ Your extrinsic has been included as 5751523-6
```

</details>

  </TabItem>
  <TabItem value="sdk" label="Bittensor SDK">

<SdkVersion />

Use the `set_root_claim_type()` method to set your root claim type:

```python
import asyncio
from bittensor_wallet import Wallet
from bittensor.core.async_subtensor import AsyncSubtensor

async def main():
    # Initialize wallet and subtensor
    wallet = Wallet(name="validator", hotkey="default")
    async with AsyncSubtensor(network="local") as subtensor:
        # Set claim type to 'Keep' to retain Alpha tokens
        response = await subtensor.set_root_claim_type(
            wallet=wallet,
            new_root_claim_type="Keep",  # or "Swap" for TAO accumulation
            wait_for_finalization=True
        )

        print(response)
        if response.extrinsic_receipt:
            print(f"Transaction hash: {response.extrinsic_receipt.extrinsic_hash}")

asyncio.run(main())
```

```
Enter your password:
Decrypting...
✅ Successfully set root claim type to 'Keep'
Transaction hash: 0xe3a387589b0ae6abfd7172088cc7853224f304e0bc4c3688b335a6f6e8f9a508
```

You can also query the current claim type:

```python
import asyncio
from bittensor_wallet import Wallet
from bittensor.core.async_subtensor import AsyncSubtensor

async def main():
    wallet = Wallet(name="validator", hotkey="default")
    async with AsyncSubtensor(network="finney") as subtensor:
        claim_type = await subtensor.get_root_claim_type(
            coldkey_ss58=wallet.coldkeypub.ss58_address
        )
        print(f"Current root claim type: {claim_type}")

asyncio.run(main())
```

  </TabItem>
  <TabItem value="polkadot-app" label="Polkadot app">

1. Navigate to **Developer** → **Extrinsics**
2. Select your coldkey account
3. Choose the pallet: `subtensorModule` and choose the `setRootClaimType(newRootClaimType)` extrinsic.
4. Select your desired claim type:
   - `Swap` - convert all Alpha to TAO (default)
   - `Keep` - retain all Alpha tokens
   - `KeepSubnets` - keep Alpha for specific subnets only (requires specifying subnet IDs)
5. Click **Submit Transaction** and sign.

  </TabItem>
</Tabs>


## Monitor claim status and types

### View claimable amounts with stake list

Output from the `btcli stake list` command includes a **Claimable** column, which shows the amount of unclaimed, accumulated ALPHA emissions available for manual claiming from each subnet.

```bash
btcli stake list
```

For a live-updating view:

```bash
btcli stake list --live
```

<details>
<summary><strong>Show Sample Output</strong></summary>

```console
                            Hotkey: Example (...)
                                                     Network: finney


        ┃                        ┃     Value ┃           ┃    Price    ┃            ┃  Emission ┃  Emission ┃  Claimable
 Netuid ┃ Name                   ┃ (α x τ/α) ┃ Stake (α) ┃ (τ_in/α_in) ┃ Registered ┃ (α/block) ┃ (Τ/block) ┃        (α)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━
 0      │ τ root                 │   τ 46.93 │  Τ 46.93  │ 1.0000 τ/Τ  │        YES │  Τ 0.0000 │  0.0000 τ │          -
 4      │ δ Targon               │    τ 0.30 │  6.88 δ   │ 0.0437 τ/δ  │        YES │  0.0012 δ │  0.0000 τ │  0.00031 δ
 120    │ ⲃ Affine               │    τ 0.00 │  0.01 ⲃ   │ 0.0551 τ/ⲃ  │         NO │  0.0013 ⲃ │  0.0000 τ │  0.00107 ⲃ
 119    │ Ⲃ Akihabara            │    τ 0.00 │  0.01 Ⲃ   │ 0.0176 τ/Ⲃ  │         NO │  0.0017 Ⲃ │  0.0000 τ │  0.00199 Ⲃ
 62     │ ز Ridges               │    τ 0.00 │  0.00 ز   │ 0.0676 τ/ز  │         NO │  0.0011 ز │  0.0000 τ │  0.00050 ز
 64     │ ش Chutes               │    τ 0.00 │  0.00 ش   │ 0.0783 τ/ش  │         NO │  0.0008 ش │  0.0000 τ │  0.00025 ش
 115    │ Ѕ SoulX                │    τ 0.00 │  0.01 Ѕ   │ 0.0125 τ/Ѕ  │         NO │  0.0015 Ѕ │  0.0000 τ │  0.00190 Ѕ
 51     │ ת lium.io              │    τ 0.00 │  0.00 ת   │ 0.0548 τ/ת  │         NO │  0.0004 ת │  0.0000 τ │  0.00039 ת
 41     │ נ Sportstensor         │    τ 0.00 │  0.00 נ   │ 0.0320 τ/נ  │         NO │  0.0009 נ │  0.0000 τ │  0.00045 נ
 8      │ θ Proprietary Tradi... │    τ 0.00 │  0.00 θ   │ 0.0286 τ/θ  │         NO │  0.0004 θ │  0.0000 τ │  0.00050 θ
```

</details>

### Query claimable ALPHA

<Tabs groupId="root-claim">
  <TabItem value="sdk" label="Bittensor SDK">

Using the following methods, you can query the claimable stake for a specific subnet.

```python
import asyncio
from bittensor_wallet import Wallet
from bittensor.core.async_subtensor import AsyncSubtensor

async def main():
    wallet = Wallet(name="validator", hotkey="default")
    async with AsyncSubtensor(network="local") as subtensor:
        # Get claimable stake for a specific subnet
        netuid = 2
        claimable_stake = await subtensor.get_root_claimable_stake(
            coldkey_ss58=wallet.coldkeypub.ss58_address,
            hotkey_ss58=wallet.hotkey.ss58_address,
            netuid=netuid
        )
        print(f"Claimable stake for subnet {netuid}: {claimable_stake}")

asyncio.run(main())
```

  </TabItem>
  <TabItem value="polkadot-app" label="Polkadot app">

To see how much you can claim from a specific subnet:

1. Navigate to **Developer** → **Chain State**
2. Select the storage query: `subtensorModule` → `rootClaimable(AccountId)`
3. Enter your hotkey address
4. Click the **+** button to query

  </TabItem>
</Tabs>

---

### Check claimed ALPHA

<Tabs groupId="root-claim">
  <TabItem value="sdk" label="Bittensor SDK">

You can check how much you've already claimed from a subnet:

```python
import asyncio
from bittensor_wallet import Wallet
from bittensor.core.async_subtensor import AsyncSubtensor

async def main():
    wallet = Wallet(name="validator", hotkey="default")
    async with AsyncSubtensor(network="local") as subtensor:
        # Get already claimed stake for a specific subnet
        netuid = 2
        claimed_stake = await subtensor.get_root_claimed(
            coldkey_ss58=wallet.coldkeypub.ss58_address,
            hotkey_ss58=wallet.hotkey.ss58_address,
            netuid=netuid
        )
        print(f"Already claimed stake for subnet {netuid}: {claimed_stake}")

asyncio.run(main())
```

  </TabItem>
  <TabItem value="polkadot-app" label="Polkadot app">

To see how much you've already claimed from a subnet:

1. Navigate to **Developer** → **Chain State**
2. Select the storage query: `subtensorModule` → `rootClaimed(AccountId, AccountId, u16)`
3. Fill the parameters:
   - `AccountId`: Enter the account hotkey.
   - `AccountId`: Enter the account coldkey.
   - `u16`: Enter the subnet uid.
4. Click the **+** button to query

  </TabItem>
</Tabs>

---

## Trigger a manual claim

The network will eventually process your pending emissions automatically. However, you can choose to manually claim your accumulated ALPHA without waiting, for a small extrinsic fee. See [Transaction Fees](../../learn/fees).

To manually trigger a claim:

<Tabs groupId="root-claim">
  <TabItem value="btcli" label="BTCLI">

Use the `btcli stake process-claim` command to manually claim your accumulated root network emissions:

```console
btcli st process-claim --verbose
```

<details>
<summary><strong>Show Sample Output</strong></summary>

```
               Claimable emissions

 Netuid   Current Stake   Claimable   Hotkey                                             Identity
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1           0.0035 α    0.0005 α   5CoZxgtfhcJKX2HmkwnsN18KbaT9aih9eF3b6qVPTgAUbifj   TAO.app
               0.0015 α    0.0002 α   5G3wMP3g3d775hauwmAZioYFVZYnvw6eY46wkFy8hEWD5KP3   Openτensor Foundaτion
   2           0.0036 β    0.0005 β   5CoZxgtfhcJKX2HmkwnsN18KbaT9aih9eF3b6qVPTgAUbifj   TAO.app
               0.0015 β    0.0002 β   5G3wMP3g3d775hauwmAZioYFVZYnvw6eY46wkFy8hEWD5KP3   Openτensor Foundaτion
   3           0.0033 γ    0.0005 γ   5CoZxgtfhcJKX2HmkwnsN18KbaT9aih9eF3b6qVPTgAUbifj   TAO.app
               2.6817 γ    0.0002 γ   5G3wMP3g3d775hauwmAZioYFVZYnvw6eY46wkFy8hEWD5KP3   Openτensor Foundaτion
   4           6.8791 δ    0.0003 δ   5CoZxgtfhcJKX2HmkwnsN18KbaT9aih9eF3b6qVPTgAUbifj   TAO.app
               0.0020 δ    0.0003 δ   5G3wMP3g3d775hauwmAZioYFVZYnvw6eY46wkFy8hEWD5KP3   Openτensor Foundaτion
   5           0.0033 ε    0.0004 ε   5CoZxgtfhcJKX2HmkwnsN18KbaT9aih9eF3b6qVPTgAUbifj   TAO.app
               0.0014 ε    0.0002 ε   5G3wMP3g3d775hauwmAZioYFVZYnvw6eY46wkFy8hEWD5KP3   Openτensor Foundaτion

...

Enter up to 5 netuids to claim from (comma-separated)
(1,2,3,4,5): 1,2,3,4,5

Estimated extrinsic fee: 0.000046377 τ
Do you want to proceed? [y/n]:
```

</details>

  </TabItem>
  <TabItem value="sdk" label="Bittensor SDK">

Use the `claim_root()` method to manually claim your accumulated root network emissions:

```python
import asyncio
from bittensor_wallet import Wallet
from bittensor.core.async_subtensor import AsyncSubtensor

async def main():
    # Initialize wallet and subtensor
    wallet = Wallet(name="validator", hotkey="default")
    async with AsyncSubtensor(network="local") as subtensor:
        # Specify the subnets to claim from (up to 5 at once)
        netuids = [1, 2, 3]

        # Claim root emissions
        response = await subtensor.claim_root(
            wallet=wallet,
            netuids=netuids,
            wait_for_finalization=True
        )

        print(response)
        if response.extrinsic_receipt:
            print(f"Transaction hash: {response.extrinsic_receipt.extrinsic_hash}")

asyncio.run(main())
```

```console
Enter your password:
Decrypting...
✅ Successfully claimed root emissions from subnets [1, 2, 3]
Transaction hash: 0x0e153ac52f63dde1be1854f00daf09f643d1491c6e6b4103cdd5b04591921e3f
```

You can also check claimable amounts before claiming:

```python
import asyncio
from bittensor_wallet import Wallet
from bittensor.core.async_subtensor import AsyncSubtensor

async def main():
    wallet = Wallet(name="validator", hotkey="default")
    async with AsyncSubtensor(network="finney") as subtensor:
        # Get stake info which includes claimable amounts
        stake_info = await subtensor.get_stake_info_for_coldkey(
            coldkey_ss58=wallet.coldkeypub.ss58_address
        )

        if stake_info:
            print("Claimable emissions by subnet:")
            for info in stake_info:
                if hasattr(info, 'claimable') and info.claimable > 0:
                    print(f"  Subnet {info.netuid}: {info.claimable}")
        else:
            print("No claimable emissions found")

asyncio.run(main())
```

  </TabItem>
  <TabItem value="polkadot-app" label="Polkadot app">

1. Navigate to **Developer** → **Extrinsics**
2. Select your coldkey account
3. Choose: `subtensorModule` → `claimRoot(subnets)`
4. Add subnet IDs to claim from:
   - Click **Add item** for each subnet
   - Enter the netuid (e.g., `1`, `2`, `3`)
   - You can claim from up to 5 subnets at once.
5. Click **Submit Transaction** and sign

  </TabItem>
</Tabs>

---

## Inspecting the Metagraph: View claim types for registered neurons

When viewing any subnet's metagraph, the **Claim Type** column shows the claim setting for registered neurons who have stake:

```bash
btcli subnets metagraph --netuid 14
```

<details>
<summary><strong>Show Sample Output</strong></summary>

```console


                                                             Subnet 14: TAOHash
                                                       Network: finney • Mechanism 0

 UID ┃  Stake (ξ) ┃  Alpha (ξ) ┃    Tao (τ) ┃ Dividends ┃ Incentive ┃ Emissions (ξ) ┃ Hotkey ┃ Coldkey ┃ Identity              ┃ Claim Type
━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━
 29  │ 475.38k テ │ 395.29k テ │   τ 80.09k │ 0.265568  │ 0.999588  │ 187.260435 テ │ 5Cf4LP │ 5CKhH8  │ Owner14 (*Owner)      │    Swap
  3  │ 784.52k テ │ 294.40k テ │  τ 490.12k │ 0.438437  │ 0.000000  │ 64.894660 テ  │ 5C59tt │ 5GZSAg  │ RoundTable21          │    Swap
 243 │ 155.00k テ │  44.71k テ │  τ 110.29k │ 0.086595  │ 0.000000  │ 12.817256 テ  │ 5Ev8Zs │ 5HBtpw  │ Openτensor Foundaτion │    Swap
 147 │ 138.50k テ │  51.49k テ │   τ 87.01k │ 0.077363  │ 0.000000  │ 11.450874 テ  │ 5DfmoR │ 5E9fVY  │ Yuma, a DCG Company   │    Swap
 191 │  66.50k テ │   17.62 テ │   τ 66.48k │ 0.060868  │ 0.000000  │  9.010114 テ  │ 5GYfuc │ 5FHxxe  │ Kraken                │    Swap
 99  │  53.92k テ │   1.77k テ │   τ 52.14k │ 0.030121  │ 0.000000  │  4.458510 テ  │ 5HmkM6 │ 5Eq8b9  │ Crucible Labs         │    Swap
  4  │  50.66k テ │  26.55k テ │   τ 24.10k │ 0.028290  │ 0.000000  │  4.188392 テ  │ 5GRhNw │ 5Fuzgv  │ Rizzo (Insured)       │    Swap
 70  │  10.85k テ │   1.16k テ │    τ 9.69k │ 0.006058  │ 0.000000  │  0.897160 テ  │ 5G9hfk │ 5Ek8i6  │ 1T1B.AI               │    Swap
 235 │   9.38k テ │    0.77 テ │    τ 9.38k │ 0.005234  │ 0.000000  │  0.775315 テ  │ 5HbScN │ 5F4Xca  │ ~                     │    Swap
 89  │   5.00k テ │    0.02 テ │    τ 5.00k │ 0.000000  │ 0.000000  │  0.000000 テ  │ 5GKH9F │ 5GcCZ2  │ Taostats              │    Swap
 59  │   2.54k テ │  484.57 テ │    τ 2.05k │ 0.001404  │ 0.000000  │  0.209705 テ  │ 5FZGu1 │ 5CMUVy  │ MUV                   │    Swap
 207 │  533.28 テ │  533.28 テ │     τ 0.00 │ 0.000000  │ 0.000000  │  0.000000 テ  │ 5HTSgd │ 5GNE4s  │ tao5 (taohash key)    │     -
 21  │  350.18 テ │  350.18 テ │     τ 0.00 │ 0.000000  │ 0.000000  │  0.000000 テ  │ 5GND7u │ 5FNRRL  │ ~                     │     -
 134 │  116.72 テ │  116.72 テ │     τ 0.00 │ 0.000000  │ 0.000000  │  0.000000 テ  │ 5Esg46 │ 5ECNhc  │ ~                     │     -

...

────┼────────────┼────────────┼────────────┼───────────┼───────────┼───────────────┼────────┼─────────┼───────────────────────┼────────────    │   1.75m テ │ 816.98k テ │ 936.37k テ │   1.000   │           │  296.0217 ξ   │        │         │                       │


Subnet 14: TAOHash
  Total mechanisms: 1
  Owner: 5CKhH8nKAhXLmqxwaXzFtVFgxqwwnyckXG8qLpmGtzVJH9Ri (Owner14)
  Rate: 0.0104 τ/テ
  EMA TAO Inflow: τ 0.0102
  Emission: τ 0.0099
  TAO Pool: τ 21.15k
  Alpha Pool: 2.04m テ
  Tempo: 150/360
  Registration cost (recycled): τ 0.0005
```

</details>
