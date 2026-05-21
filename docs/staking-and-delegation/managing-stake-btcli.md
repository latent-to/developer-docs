---
title: "Managing Stake with BTCLI"
---

# Managing stake with `btcli`

This page demonstrates usage of `btcli`, the Bittensor CLI, for managing stake.

TAO holders can **stake** any amount of the liquidity they hold to a validator. Also known as **delegation**, staking supports validators, because their total stake in the subnet, including stake delegated to them by others, determines their consensus power and their share of emissions. After the validator/delegate extracts their **take** the remaining emissions are credited back to the stakers/delegators in proportion to their stake with that validator.

Likewise, TAO holders can **unstake** to withdraw their delegated tokens from validators, converting subnet-specific alpha tokens back to TAO through the subnet's automated market maker (AMM).

:::note Transaction Fees
Staking and unstaking operations incur transaction fees for the underlying blockchain transactions they trigger. See [Transaction Fees in Bittensor](../learn/fees.md) for details.
:::

See also:

- [Staking/delegation overview](./delegation)
- [Understanding pricing and anticipating slippage](../learn/slippage)
- [Price protection when staking](../learn/price-protection)
- [Staking with a proxy](../keys/proxies/staking-with-proxy)

:::tip
Minimum transaction amount for stake/unstake/move/transfer: 500,000 RAO or 0.0005 TAO.
:::

:::warning Keep your coldkey secure
Staking is a regular operation for most TAO holders. Every time you stake or unstake directly, you must decrypt and use your coldkey—exposing it to potential compromise. 

**For better security, use a [Staking Proxy](../keys/proxies/staking-with-proxy)**. With a `Staking` proxy configured with a delay, you can manage your stake without ever exposing your coldkey. If the proxy is compromised, the delay gives you time to reject unauthorized unstaking attempts.
:::

## Pre-requisite: Create a wallet

To manage stake you will need a wallet. For practice, create one with `btcli`.

```shell
btcli wallet create
```

:::danger
The funds in a crypto wallet are only as secure as your private key and/or seed phrase, and the devices that have access to these.

Test network tokens have no real value. Before managing liquidity on Bittensor mainnet, carefully consider all aspects of secrets management and endpoint security!
:::

## View TAO balance

To stake, you'll first need some TAO. Inquire in [Discord](https://discord.com/channels/799672011265015819/1107738550373454028/threads/1331693251589312553) to obtain TAO on Bittensor test network. Alternatively, you can [run a local Bittensor blockchain instance](../local-build/deploy.md).

After creating a wallet, ensure that you are targeting the test network by running the `btcli config set` command. Next, select network, and set it to `test`.

View your testnet balance with:

```shell
btcli wallet balance
```

```console
                                                 Network: test
    Wallet Name     Coldkey Address                                    Free Balance   Staked Balance   Total Balance
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    PracticeKey!    5G4mxrN8msvc4jjwp7xoBrtAejTfAMLCMTFGCivY5inmySbq      τ 54.6699         τ 4.3658       τ 59.0357



    Total Balance                                                         τ 54.6699         τ 4.3658       τ 59.0357
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```

## View subnet currency reserves

To see the list of subnets and their currencies, run:

```shell
btcli subnet list
```

You should see something like the following output. Notice that next to the subnets Netuid and Name is the subnet's token `Price (τ_in/α_in)`, which, as indicated, is a ratio of the TAO in reserve `τ_in` to alpha in reserve `α_in`.

```console
                                                                        Subnets
                                                                      Network: test


        ┃                           ┃ Price       ┃ Market Cap  ┃              ┃                         ┃               ┃                 ┃
 Netuid ┃ Name                      ┃ (τ_in/α_in) ┃ (α * Price) ┃ Emission (τ) ┃ P (τ_in, α_in)          ┃ Stake (α_out) ┃ Supply (α)      ┃ Tempo (k/n)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━
   0    │ τ root                    │ 1.0000 τ/Τ  │ τ 5.01m     │ τ 0.0000     │ -, -                    │ Τ 2.77m       │ 5.01m Τ /21M    │ -/-
  277   │ इ muv                     │ 1.7300 τ/इ  │ τ 696.47k   │ τ 0.0110     │ τ 17.24k, 9.97k इ       │ 392.63k इ     │ 402.59k इ /21M  │ 74/99
   3    │ γ templar                 │ 0.3123 τ/γ  │ τ 129.95k   │ τ 0.3383     │ τ 30.47k, 97.58k γ      │ 318.57k γ     │ 416.15k γ /21M  │ 0/99
   1    │ α apex                    │ 0.1117 τ/α  │ τ 49.00k    │ τ 0.1512     │ τ 20.61k, 184.54k α     │ 254.22k α     │ 438.76k α /21M  │ 98/99
  255   │ ዉ ethiopic_wu             │ 0.0394 τ/ዉ  │ τ 17.31k    │ τ 0.0498     │ τ 8.20k, 208.05k ዉ      │ 230.94k ዉ     │ 438.99k ዉ /21M  │ 52/99
  119   │ Ⲃ vida                    │ 0.0235 τ/Ⲃ  │ τ 10.30k    │ τ 0.0265     │ τ 4.42k, 188.50k Ⲃ      │ 250.43k Ⲃ     │ 438.93k Ⲃ /21M  │ 16/99
  117   │ Ⲁ alfa                    │ 0.0227 τ/Ⲁ  │ τ 9.96k     │ τ 0.0270     │ τ 4.53k, 199.77k Ⲁ      │ 239.10k Ⲁ     │ 438.87k Ⲁ /21M  │ 14/99
  ...
```

## View a subnet's validator neurons

```shell
btcli subnet show --netuid 119
```

```
Netuid: 119
Using the specified network test from config

                                                   Subnet 119: vida
                                                     Network: test

 UID ┃ Stake (Ⲃ) ┃ Alpha (Ⲃ) ┃  Tao (τ) ┃ Dividends ┃ Incentive ┃ Emissions (Ⲃ) ┃ Hotkey ┃ Coldkey ┃ Identity
━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━
 101 │  44.60k Ⲃ │  44.60k Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5FRxKz │ 5FRxKz  │ Owner119 (*Owner)
 45  │  81.33k Ⲃ │  72.55k Ⲃ │  τ 8.78k │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5FCPTn │ 5D2d3Y  │ muv
 21  │  10.94k Ⲃ │  10.94k Ⲃ │   τ 1.81 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5CFZ9x │ 5H13H4  │ Owner136
 22  │   9.32k Ⲃ │   9.32k Ⲃ │   τ 1.81 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5HbYLL │ 5H13H4  │ Owner136
 81  │   8.19k Ⲃ │   8.19k Ⲃ │   τ 1.81 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5HBK4F │ 5H13H4  │ Owner136
 96  │   6.52k Ⲃ │   6.52k Ⲃ │   τ 0.16 │  0.50000  │  0.0000   │  41.00023 Ⲃ   │ 5EqPr3 │ 5EvXtY  │ ~
 97  │   4.13k Ⲃ │   4.00k Ⲃ │ τ 125.80 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5CorGT │ 5Cqiai  │ ~
 80  │   3.98k Ⲃ │   3.98k Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5CtaFa │ 5H13H4  │ Owner136
 100 │   2.54k Ⲃ │   2.54k Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5FqJEi │ 5G3sVe  │ ~
 99  │  951.73 Ⲃ │  951.73 Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5GGmFp │ 5G3sVe  │ ~
 26  │  940.77 Ⲃ │  931.42 Ⲃ │   τ 9.35 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5Ct14B │ 5GEeMQ  │ ~
 78  │  932.60 Ⲃ │  932.60 Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5HgFYK │ 5DF8AP  │ ~
 20  │  931.77 Ⲃ │  931.77 Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5FnK5f │ 5DZPbo  │ ~
 76  │  931.55 Ⲃ │  931.55 Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5DCPu5 │ 5G6UQE  │ ~
 32  │  931.13 Ⲃ │  925.51 Ⲃ │   τ 5.62 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5EARqJ │ 5CtBA6  │ ~
 18  │  929.49 Ⲃ │  928.96 Ⲃ │   τ 0.52 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5HNNws │ 5Hbazs  │ ~
 33  │  929.22 Ⲃ │  924.19 Ⲃ │   τ 5.03 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5CeoYQ │ 5GKVqx  │ ~
 46  │  928.60 Ⲃ │  928.23 Ⲃ │   τ 0.38 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5GuqX1 │ 5Ehuid  │ ~
```

## Stake to a validator

Use `btcli stake add` to stake to a validator on a subnet. You'll be prompted to choose a subnet and validator, as well as specify an amount of TAO to stake into the validator's hotkey as alpha.

```shell
 btcli stake add
```

```console
Enter the netuid to use. Leave blank for all netuids: 119
Enter the wallet name (PracticeKey!):
Enter the wallet hotkey name or ss58 address to stake to (or Press Enter to view delegates):
Using the specified network test from config



                                                   Subnet 119: vida
                                                     Network: test

 UID ┃ Stake (Ⲃ) ┃ Alpha (Ⲃ) ┃  Tao (τ) ┃ Dividends ┃ Incentive ┃ Emissions (Ⲃ) ┃ Hotkey ┃ Coldkey ┃ Identity
━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━
 101 │  44.60k Ⲃ │  44.60k Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5FRxKz │ 5FRxKz  │ Owner119 (*Owner)
 45  │  81.33k Ⲃ │  72.55k Ⲃ │  τ 8.78k │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5FCPTn │ 5D2d3Y  │ muv
 21  │  10.94k Ⲃ │  10.94k Ⲃ │   τ 1.81 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5CFZ9x │ 5H13H4  │ Owner136
 22  │   9.32k Ⲃ │   9.32k Ⲃ │   τ 1.81 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5HbYLL │ 5H13H4  │ Owner136
 81  │   8.19k Ⲃ │   8.19k Ⲃ │   τ 1.81 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5HBK4F │ 5H13H4  │ Owner136
 96  │   6.52k Ⲃ │   6.52k Ⲃ │   τ 0.16 │  0.50000  │  0.0000   │  41.00023 Ⲃ   │ 5EqPr3 │ 5EvXtY  │ ~
 97  │   4.13k Ⲃ │   4.00k Ⲃ │ τ 125.80 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5CorGT │ 5Cqiai  │ ~
 80  │   3.98k Ⲃ │   3.98k Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5CtaFa │ 5H13H4  │ Owner136
 100 │   2.54k Ⲃ │   2.54k Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5FqJEi │ 5G3sVe  │ ~
 99  │  951.73 Ⲃ │  951.73 Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5GGmFp │ 5G3sVe  │ ~
 26  │  940.77 Ⲃ │  931.42 Ⲃ │   τ 9.35 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5Ct14B │ 5GEeMQ  │ ~
 78  │  932.60 Ⲃ │  932.60 Ⲃ │   τ 0.00 │  0.00439  │  0.0088   │   0.35965 Ⲃ   │ 5HgFYK │ 5DF8AP  │ ~
─────┼───────────┼───────────┼──────────┼───────────┼───────────┼───────────────┼────────┼─────────┼───────────────────
     │ 260.19k Ⲃ │ 251.23k Ⲃ │  8.96k Ⲃ │   1.000   │           │   82.0005 Ⲃ   │        │         │


```

After selecting a validator to delegate stake to, you'll see your wallet balance and be asked to specify the amount of TAO you wish to stake.

```console
Amount to stake (TAO τ): 5
```

You'll then see the details of the trade, including [slippage](../learn/slippage), and be asked to confirm execution.

```console
                                                        Staking to:
                   Wallet: PracticeKey!, Coldkey ss58: 5G4m...
                                                       Network: test

 Netuid ┃                      Hotkey                      ┃ Amount (τ) ┃      Rate (per τ)      ┃   Received   ┃ Slippage
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━
   19   │ 5FCPTnjevGqAuTttetBy4a24Ej3pH9fiQ8fmvP1ZkrVsLUoT │  τ 5.0000  │ 991.3160712161465 t/τ  │ 4,793.8697 t │ 3.2827 %
────────┼──────────────────────────────────────────────────┼────────────┼────────────────────────┼──────────────┼──────────
        │                                                  │            │                        │              │

Description:
The table displays information about the stake operation you are about to perform.
The columns are as follows:
    - Netuid: The netuid of the subnet you are staking to.
    - Hotkey: The ss58 address of the hotkey you are staking to.
    - Amount: The TAO you are staking into this subnet onto this hotkey.
    - Rate: The rate of exchange between your TAO and the subnet's stake.
    - Received: The amount of stake you will receive on this subnet after slippage.
    - Slippage: The slippage percentage of the stake operation. (0% if the subnet is not dynamic i.e. root).

Would you like to continue? [y/n]:
```

If you confirm, the staking operation will execute.

### Staking to multiple validators

You can add stake to multiple validators at once by running the following command:

```shell
btcli stake add -n 4,14,70
```

The command accepts a comma-separated list of the subnets you wish to stake into. If you want to stake the same amount of TAO into all subnets, you can include the `--amount` flag as shown:

```shell
btcli stake add -n 4,14,70 --amount 100
```

## View your current stakes

Use `btcli stake list` to view your currently held stakes. For each validator you have staked, you'll see how much stake you currently hold on each subnet.

Stake is held in alpha, but note that value at the current price is also displayed, along with the computed **Swap** value and slippage rate of the current holdings.

```console
                       Hotkey: 5GEXJdUXxLVmrkaHBfkFmoodXrCSUMFSgPXULbnrRicEt1kK
                                            Network: test

                             See below for an explanation of the columns

        ┃           ┃     Value ┃           ┃    Price    ┃                  ┃            ┃  Emission
 Netuid ┃ Name      ┃ (α x τ/α) ┃ Stake (α) ┃ (τ_in/α_in) ┃    Swap (α -> τ) ┃ Registered ┃ (α/block)
━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━
 250    │ ኤ unknown │   τ 18.38 │ 602.14 ኤ  │ 0.0305 τ/ኤ  │ τ 17.96 (2.287%) │        YES │  0.0000 ኤ
 119    │ Ⲃ vidac   │   τ 13.72 │  98.73 Ⲃ  │ 0.1390 τ/Ⲃ  │ τ 13.61 (0.815%) │        YES │  0.0000 Ⲃ
────────┼───────────┼───────────┼───────────┼─────────────┼──────────────────┼────────────┼───────────
 2      │           │   τ 32.10 │           │             │          τ 31.57 │            │

Press Enter to continue to the next hotkey...
```

## Unstaking with btcli

Unstaking is the process of withdrawing your staked TAO from validators, converting subnet-specific alpha tokens back to TAO through the subnet's AMM. When you unstake, slippage applies similar to staking operations—your transaction affects pool prices, with larger amounts experiencing more slippage.

:::important Key considerations when unstaking
**Slippage**: Unstaking operations are subject to slippage as your transaction affects the subnet's AMM pool prices. The CLI will show you the expected slippage before confirming. See [Understanding Pricing and Anticipating Slippage](../learn/slippage.md).

**Price protection**: btcli provides built-in confirmation screens showing rates and slippage before execution. See [Price Protection When Staking](../learn/price-protection.md).

**Transaction fees**: Unstaking incurs blockchain transaction fees. See [Transaction Fees in Bittensor](../learn/fees.md).
:::

### Remove stake from a validator

Use `btcli stake remove` to unstake from a specific validator. You'll be prompted to select the subnet and validator, then specify the amount to unstake.

```shell
btcli stake remove
```

You'll see a confirmation screen showing:

- The amount you're unstaking (in alpha)
- The current exchange rate
- How much TAO you'll receive
- The slippage percentage

```console
Enter the hotkey name or ss58 address to unstake from (or Press Enter to view existing staked hotkeys):
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets
Using the specified network test from config



                                           Hotkeys with Stakes

 Index ┃ Identity         ┃ Netuids                    ┃ Hotkey Address
━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     0 │ SuperNetOwnerGuy │ 0, 2-3, 320, 324, 119, 250 │ 5GEXJdUXxLVmrkaHBfkFmoodXrCSUMFSgPXULbnrRicEt1kK
     1 │ Owner3           │ 3                          │ 5FupG35rCCMghVEAzdYuxxb4SWHU7HtpKeveDmSoyCN8vHyb
     2 │ CrypticMax       │ 3                          │ 5EHammhTy9rV9FhDdYeFY98YTMvU8Vz9Zv2FuFQQQyMTptc6
     3 │ muv              │ 5, 277, 45                 │ 5FCPTnjevGqAuTttetBy4a24Ej3pH9fiQ8fmvP1ZkrVsLUoT
     4 │ Brainlock        │ 277                        │ 5EFtEvPcgZHheW36jGXMPMrDETzbngziR3DPPVVp5L5Gt7Wo
     5 │ merit            │ 119                        │ 5CFZ9xDaFQVLA9ERsTs9S3i6jp1VDydvjQH5RDsyWCCJkTM4
───────┼──────────────────┼────────────────────────────┼──────────────────────────────────────────────────
       │                  │                            │

Enter the index of the hotkey you want to unstake from [0/1/2/3/4/5]: 0



                  Stakes for hotkey
                  SuperNetOwnerGuy
  5GEXJdUXxLVmrkaHBfkFmoodXrCSUMFSgPXULbnrRicEt1kK

 Subnet ┃ Symbol ┃ Stake Amount      ┃ Rate (Τ/α)
━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━
      0 │ Τ      │ Τ 7.3947          │ 1.000000 τ/Τ
      2 │ β      │ 0.0243 β          │ 0.001754 τ/β
      3 │ γ      │ 0.0414 γ          │ 0.111141 τ/γ
    320 │ イ     │ 1,724,839.6158 イ │ 0.000000 τ/イ
    324 │ カ     │ 1,677,528.1530 カ │ 0.000522 τ/カ
    119 │ Ⲃ      │ 474.0460 Ⲃ        │ 0.077959 τ/Ⲃ
    250 │ ኤ      │ 981.1793 ኤ        │ 0.015457 τ/ኤ
────────┼────────┼───────────────────┼───────────────
        │        │                   │



Enter the netuids of the subnets to unstake from (comma-separated), or 'all' to unstake from all (all): all

Do you want to:
Yes: Unstake from all subnets and automatically re-stake to subnet 0 (root)
No: Unstake everything (including subnet 0) [y/n] (y): y
🌏  Retrieving stake information & identities from test...[Error]: Not enough Alpha to pay the transaction fee.


                                           Unstaking Summary - All Alpha Stakes
                   Wallet: PracticeKey!, Coldkey ss58: 5G4m...
                                                      Network: test

 Netuid ┃          Hotkey           ┃ Current Stake (α) ┃   Rate (τ/α)   ┃   Fee (α)   ┃ Extrinsic Fee (τ) ┃ Received (τ)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━
   3    │ 5GEXJdUXxLVmrkaHBfkFmood… │     0.0414 γ      │ 0.111141(Τ/γ)  │  0.0000 γ   │     0.0002 τ      │   0.0044 τ
  320   │ 5GEXJdUXxLVmrkaHBfkFmood… │ 1,724,839.6158 イ │ 0.000000(Τ/イ) │ 868.5391 イ │     0.0002 τ      │   0.0092 τ
  324   │ 5GEXJdUXxLVmrkaHBfkFmood… │ 1,677,528.1530 カ │ 0.000522(Τ/カ) │ 844.7155 カ │     0.0002 τ      │  164.4346 τ
  119   │ 5GEXJdUXxLVmrkaHBfkFmood… │    474.0460 Ⲃ     │ 0.077959(Τ/Ⲃ)  │  0.2387 Ⲃ   │     0.0002 τ      │  36.9276 τ
  250   │ 5GEXJdUXxLVmrkaHBfkFmood… │    981.1793 ኤ     │ 0.015457(Τ/ኤ)  │  0.4941 ኤ   │     0.0002 τ      │  15.1467 τ
────────┼───────────────────────────┼───────────────────┼────────────────┼─────────────┼───────────────────┼──────────────
        │                           │                   │                │             │                   │
Total expected return: 216.5224 τ

Do you want to proceed with unstaking everything? [y/n]: y
```

### Unstake all from a validator

To unstake all your stake from a specific validator, or from all validators use the `--all` flag:

```shell
btcli stake remove --all
```

Either specify the hotkey, to remove all stake on all subnets, or `all` for all stake on all subnets for all validator hotkeys.

```console
Enter the hotkey name or ss58 address to unstake all from (or enter 'all' to unstake from all hotkeys) (default): all
Using the specified network test from config

                                    Unstaking Summary - All Stakes
         Wallet: PracticeKey!, Coldkey ss58: 5G4mx...
                                             Network: test

 Netuid ┃   Hotkey   ┃ Current Stake (α) ┃  Rate (τ/α)   ┃ Fee (α)  ┃ Extrinsic Fee (τ) ┃ Received (τ)
━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━
   0    │ stakinkey1 │    Τ 223.9187     │ 1.000000(Τ/Τ) │ Τ 0.0000 │     0.0000 τ      │  223.9187 τ
   3    │ CrypticMax │     55.3817 γ     │ 0.111113(Τ/γ) │ 0.0279 γ │     0.0000 τ      │   6.1504 τ
   5    │    muv     │   2,433.6223 ε    │ 0.000400(Τ/ε) │ 1.2254 ε │     0.0000 τ      │   0.9727 τ
   17   │  Owner16   │   10,660.8115 ρ   │ 0.000209(Τ/ρ) │ 5.3682 ρ │     0.0000 τ      │   2.2171 τ
  277   │    muv     │     20.0331 इ     │ 0.274036(Τ/इ) │ 0.0101 इ │     0.0000 τ      │   5.4870 τ
  277   │ Brainlock  │     16.3792 इ     │ 0.274036(Τ/इ) │ 0.0082 इ │     0.0000 τ      │   4.4862 τ
   45   │    muv     │   1,452.0454 פ    │ 0.000207(Τ/פ) │ 0.7312 פ │     0.0000 τ      │   0.2998 τ
  119   │   merit    │    107.4401 Ⲃ     │ 0.077918(Τ/Ⲃ) │ 0.0541 Ⲃ │     0.0000 τ      │   8.3667 τ
  250   │ stakinkey1 │     6.7777 ኤ      │ 0.015434(Τ/ኤ) │ 0.0034 ኤ │     0.0000 τ      │   0.1045 τ
────────┼────────────┼───────────────────┼───────────────┼──────────┼───────────────────┼──────────────
        │            │                   │               │          │                   │
Total expected return: 252.0030 τ

Do you want to proceed with unstaking everything? [y/n]:
```

## Transferring stake

The `btcli stake transfer` command is used to transfer ownership of stake from one wallet (coldkey) to another.

:::tip
Don't confuse this with `btcli stake move`, which does not transfer ownership to another wallet/coldkey, but moves stake between validators or subnets, effectively unstaking and restaking it in a single operation.
:::

This operation effectively comprises a series of operations, which occur as an atomic transaction:

- first, the specified amount is unstaked from the subnet alpha token into TAO
- that amount of TAO is then transferred to the ownership of the recipient
- the recipient then automatically stakes the newly received TAO into the subnet, receiving the alpha tokens in return

```
btcli stake transfer


This command transfers stake from one coldkey to another while keeping the same hotkey.
Using the wallet name from config: PracticeKey!
Using the wallet hotkey from config: stakinkey1
Enter the destination wallet name or coldkey SS58 address: zingo
Using the specified network test from config

                    Available Stakes to Transfer
                         for wallet hotkey:
    stakinkey1: 5GEXJdUXxLVmrkaHBfkFmoodXrCSUMFSgPXULbnrRicEt1kK

  Index ┃ Netuid ┃ Name                 ┃ Stake Amount ┃ Registered
━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━
      0 │ 0      │ τ root               │ τ 76.1340    │     NO
      1 │ 3      │ γ templar            │ 0.0008 γ     │    YES
      2 │ 119    │ Ⲃ vida               │ 0.0009 Ⲃ     │    YES
      3 │ 250    │ ኤ ethiopic_glottal_e │ 11.2528 ኤ    │    YES

Enter the index of the stake you want to transfer [0/1/2/3]: 3

Enter the amount to transfer ኤ (max: 11.2528 ኤ) or 'all' for entire balance: all

Enter the netuid of the subnet you want to move stake to (0-308): 250

                             Moving stake from: ኤ(Netuid: 250) to: ኤ(Netuid: 250)
                                                 Network: test

 origin netuid ┃ origin hotkey ┃ dest netuid ┃ dest hotkey ┃ amount (ኤ) ┃ rate (ኤ/ኤ) ┃ received (ኤ) ┃ slippage
━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━
    ኤ(250)     │   5GE...1kK   │   ኤ(250)    │  5GE...1kK  │ 11.2528 ኤ  │   1.0ኤ/ኤ   │  11.2502 ኤ   │ 0.0228%
───────────────┼───────────────┼─────────────┼─────────────┼────────────┼────────────┼──────────────┼──────────
               │               │             │             │            │            │              │
Would you like to continue? [y/n]: y
Enter your password:
Decrypting...
Origin Stake:
  11.2528 ኤ ➡ 0.0000 ኤ
Destination Stake:
  0.0000 ኤ ➡ 11.2502 ኤ
```

When the recipient check's their `stake list`, they'll now see the transferred stake:

```console
btcli stake list --wallet_name zingo


Using the specified network test from config

                            Hotkey: 5GEXJdUXxLVmrkaHBfkFmoodXrCSUMFSgPXULbnrRicEt1kK
                                                 Network: test


        ┃                      ┃     Value ┃           ┃    Price    ┃                 ┃            ┃  Emission
 Netuid ┃ Name                 ┃ (α x τ/α) ┃ Stake (α) ┃ (τ_in/α_in) ┃   Swap (α -> τ) ┃ Registered ┃ (α/block)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━
 0      │ τ root               │    τ 2.34 │  τ 2.34   │ 1.0000 τ/τ  │    N/A (0.000%) │         NO │  τ 0.0000
 250    │ ኤ ethiopic_glottal_e │    τ 0.22 │  11.25 ኤ  │ 0.0195 τ/ኤ  │ τ 0.22 (0.006%) │        YES │  0.0000 ኤ
────────┼──────────────────────┼───────────┼───────────┼─────────────┼─────────────────┼────────────┼───────────
 2      │                      │    τ 2.56 │           │             │          τ 2.56 │            │



Wallet:
  Coldkey SS58: 5F1T...
  Free Balance: τ 0.0000
  Total TAO (τ): τ 2.51
  Total Value (τ): τ 2.56
```

## Moving stake

The `btcli stake move` command is used to moves stake between validators or subnets, effectively unstaking and restaking it in a single operation. It does not change ownership of the stake, which remains with the same wallet/coldkey.

:::tip
Don't confuse this with `btcli stake transfer`, which is used to transfer ownership of stake from one wallet (coldkey) to another.
:::
