---
title: "Managing Root Claims"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Managing Root Claims

This page covers how to configure, monitor, and claim root dividends, i.e. dividends from staking to validators on the Root Subnet. See [Root Claim](./)

## Prerequisites

- A coldkey with TAO staked on the root network (subnet 0).
- A hotkey that's registered and staked on one or more subnets.

## Set a claim type

Your claim type determines what happens to your root dividends when they're claimed:

**Claim Types:**

- **Swap**: Future Root Alpha Emissions are swapped to TAO and added to root stake (default)
- **Keep**: Future Root Alpha Emissions are kept as Alpha tokens

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
  <!-- <TabItem value="sdk" label="Bittensor SDK"></TabItem> -->
  <TabItem value="polkadot-app" label="Polkadot app">

1. Navigate to **Developer** → **Extrinsics**
2. Select your coldkey account
3. Choose the pallet: `subtensorModule` and choose the `setRootClaimType(newRootClaimType)` extrinsic.
4. Select your desired claim type:
   - `Swap` - for TAO accumulation
   - `Keep` - for alpha retention
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

Currently this can only be done with the Polkadot.js app. To see how much you can claim from a specific subnet:

    1. Navigate to **Developer** → **Chain State**
    2. Select the storage query: `subtensorModule` → `rootClaimable(AccountId)`
    3. Enter your hotkey address
    4. Click the **+** button to query

### Check claimed ALPHA

Currently this can only be done with the Polkadot.js app. To see how much you've already claimed from a subnet:

    1. Navigate to **Developer** → **Chain State**
    2. Select the storage query: `subtensorModule` → `rootClaimed(AccountId, AccountId, u16)`
    3. Fill the parameters:
        - `AccountId`: Enter the account hotkey.
        - `AccountId`: Enter the account coldkey.
        - `u16`: Enter the subnet uid.
    4. Click the **+** button to query

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
  <!-- <TabItem value="sdk" label="Bittensor SDK"></TabItem> -->
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

### View claim types on root network

When viewing the root network (subnet 0) metagraph, you can see each validator's claim type setting:

```bash
btcli subnets metagraph --netuid 0
```

This displays a **Claim Type** column showing whether each validator has configured `Swap` or `Keep` for their root emissions.

<details>
<summary><strong>Show Sample Output</strong></summary>

```console
                                                 Root Network
                                               Network: finney

 Position ┃   Tao (τ) ┃ Emission (Τ/block) ┃ Hotkey ┃ Coldkey ┃ Identity                         ┃ Claim Type
━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━
    1     │ τ 754.29k │      0.0000 τ      │ 5E2LP6 │ 5GsbTg  │ tao.bot                          │    Swap
    2     │ τ 657.96k │      0.0000 τ      │ 5GKH9F │ 5GcCZ2  │ Taostats                         │    Swap
    3     │ τ 539.39k │      0.0000 τ      │ 5G3wMP │ 5HBtpw  │ Openτensor Foundaτion            │    Swap
    4     │ τ 482.47k │      0.0000 τ      │ 5DXdHi │ 5E9fVY  │ Yuma, a DCG Company              │    Swap
    5     │ τ 369.34k │      0.0000 τ      │ 5Ckaof │ 5FHxxe  │ Kraken                           │    Swap
    6     │ τ 332.16k │      0.0000 τ      │ 5FxcZr │ 5GP8N5  │ Polychain                        │    Swap
    7     │ τ 332.07k │      0.0000 τ      │ 5Gq2gs │ 5GZSAg  │ RoundTable21                     │    Swap
    8     │ τ 293.72k │      0.0000 τ      │ 5Dd8ga │ 5GBkWR  │                                  │    Swap
    9     │ τ 289.69k │      0.0000 τ      │ 5HmkM6 │ 5Eq8b9  │ Crucible Labs                    │    Swap
    10    │ τ 278.70k │      0.0000 τ      │ 5CsvRJ │ 5EJAqc  │ tao5                             │    Swap
    31    │  τ 12.89k │      0.0000 τ      │ 5ELREh │ 5EP7UG  │ Taofu Protocol                   │    Swap
    32    │  τ 11.39k │      0.0000 τ      │ 5CszMV │ 5CMUVy  │ MUV                              │    Swap
    33    │   τ 9.94k │      0.0000 τ      │ 5Gmvye │ 5Cyfk5  │ Neural Internet                  │    Swap
    34    │   τ 2.30k │      0.0000 τ      │ 5FsGZa │ 5FS3iG  │                                  │    Swap
    35    │   τ 1.80k │      0.0000 τ      │ 5HeKSH │ 5GRPcZ  │ TaoStation                       │    Swap
    36    │   τ 1.64k │      0.0000 τ      │ 5FFSBk │ 5GP1VN  │ Kooltek68                        │    Swap
    37    │   τ 1.05k │      0.0000 τ      │ 5Hpmsk │ 5CP6HR  │ Kiln                             │    Swap
    38    │   τ 1.04k │      0.0000 τ      │ 5GHn5a │ 5FLLWE  │                                  │    Swap
    39    │   τ 1.03k │      0.0000 τ      │ 5HZ7yq │ 5H3Jyk  │                                  │    Swap
    40    │  τ 936.87 │      0.0000 τ      │ 5Hmh4D │ 5C7Nud  │ InfStones                        │    Swap
    41    │  τ 744.29 │      0.0000 τ      │ 5GcBK8 │ 5EsyFE  │ Tensor.Exchange                  │    Swap
    42    │  τ 319.48 │      0.0000 τ      │ 5H6BgK │ 5HEmke  │ TaoPolishNode                    │    Swap
    43    │  τ 213.74 │      0.0000 τ      │ 5ECvRL │ 5Gdq5d  │ Vune                             │    Swap
    44    │  τ 204.73 │      0.0000 τ      │ 5GUC4K │ 5EXAUB  │ Hand of Midas                    │    Swap
    45    │  τ 199.00 │      0.0000 τ      │ 5FFBEv │ 5F721c  │ HODL.Validators                  │    Swap
    46    │  τ 110.79 │      0.0000 τ      │ 5ED6jw │ 5CrBAG  │ Giga Corporation                 │    Swap
    47    │  τ 101.94 │      0.0000 τ      │ 5C5JU5 │ 5GMu9V  │                                  │    Swap
    48    │   τ 66.61 │      0.0000 τ      │ 5FcXnz │ 5HeQuP  │ Lucrosus Capital                 │    Swap
    49    │   τ 33.31 │      0.0000 τ      │ 5HRB5x │ 5HYgaf  │ P2P.org                          │    Swap
    50    │   τ 32.83 │      0.0000 τ      │ 5H9XxR │ 5DjkmY  │                                  │    Swap
    51    │   τ 27.05 │      0.0000 τ      │ 5DyMK7 │ 5CzLtK  │ TaoStake                         │    Swap
    52    │   τ 22.51 │      0.0000 τ      │ 5CBDhk │ 5DRnT7  │ Unit 410                         │    Swap
    53    │   τ 22.40 │      0.0000 τ      │ 5D4oo3 │ 5HnDZj  │                                  │    Swap
    54    │   τ 21.57 │      0.0000 τ      │ 5FLKnb │ 5HiveM  │ Tao Bridge                       │    Swap
    55    │   τ 18.75 │      0.0000 τ      │ 5CPzGD │ 5CLWeY  │ Chat with Hal                    │    Swap
    56    │   τ 17.88 │      0.0000 τ      │ 5FqPJM │ 5Dcihs  │ Exchange Listings                │    Swap
    57    │   τ 16.75 │      0.0000 τ      │ 5FWiXL │ 5GEoS1  │ Chutes / SN128 Primary Validator │    Swap
    58    │   τ 10.55 │      0.0000 τ      │ 5FnBaS │ 5GVv9t  │                                  │    Swap
    59    │   τ 10.55 │      0.0000 τ      │ 5CV93B │ 5CY4Lp  │ ShiftLayer                       │    Swap
    60    │   τ 10.17 │      0.0000 τ      │ 5Ehv5X │ 5Cwo4h  │ Dale Cooper                      │    Swap
    61    │   τ 10.00 │      0.0000 τ      │ 5FpsgU │ 5GgMeL  │ Owner128                         │    Swap
    62    │   τ 10.00 │      0.0000 τ      │ 5E4eKP │ 5HVdRa  │ MMO.AI                           │    Swap
    63    │    τ 8.00 │      0.0000 τ      │ 5EAMc5 │ 5H6tB2  │ Taoillium                        │    Swap
    64    │    τ 1.28 │      0.0000 τ      │ 5Cibb5 │ 5HZ6qd  │                                  │    Swap
──────────┼───────────┼────────────────────┼────────┼─────────┼──────────────────────────────────┼────────────
          │   5.50m τ │                    │        │         │                                  │


Root Network (Subnet 0)
  Rate: 1.00 τ/τ
  Emission: τ 0
  TAO Pool: τ 5.51m
  Stake: τ 4.95m
  Tempo: 1897340/100

    Description:
        The table displays the root subnet participants and their metrics.
        The columns are as follows:
            - Position: The sorted position of the hotkey by total TAO.
            - TAO: The sum of all TAO balances for this hotkey across all subnets.
            - Stake: The stake balance of this hotkey on root (measured in TAO).
            - Emission: The emission accrued to this hotkey across all subnets every block measured in TAO.
            - Hotkey: The hotkey ss58 address.
            - Coldkey: The coldkey ss58 address.
            - Root Claim: The root claim type for this coldkey. 'Swap' converts Alpha to TAO every epoch. 'Keep' keeps
Alpha emissions.
```

</details>

### View claim types on subnets

When viewing any subnet's metagraph, the **Claim Type** column shows the claim setting for neurons who have stake on root:

```bash
btcli subnets metagraph --netuid 14
```

Only neurons with stake on the root network will have their claim type displayed.

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
