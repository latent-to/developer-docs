---
title: Managing User Liquidity Positions Tutorial
---

In this tutorial we will explore the behavior of Bittensor's Uniswap-style user liquidity positions (LPs). To facilitate this, we'll deploy a Subtensor blockchain locally and create a subnet on it.

Liquidity positions can be complicated and potentially confusing, as their behavior is sensitive to the subnet price relative to the position's high' and 'low' price boundaries, at several stages of their life-cycle:

- When a LP is created
- When liquidity is added to an existing LP by modifying it
- During fee accrual
- When liquidity is exited from an existing LP by modifying it
- When liquidity is exited from an existing LP by removing (deleting) the position.

## Setup

### Deploy a Bittensor (Subtensor) blockchain locally.

See: [Deploy a Local Bittensor Blockchain Instance](../local-build/deploy)

Or try the easy way, by running:

```bash
docker run --rm --name test_local_chain_ -p 9944:9944 -p 9945:9945 ghcr.io/opentensor/subtensor-localnet:devnet-ready
```

### Create a subnet

Create a subnet managed by the Alice wallet.

See [Provision wallets: Access the Alice account](../local-build/provision-wallets#access-the-alice-account)

```
btcli subnet create \
--subnet-name awesome-first-subnet \
--wallet.name alice \
--network ws://127.0.0.1:9945
```

<!--
To keep the subnet price stable, let's first stake a ubnch of liquidity in. this will result in a strangely high price because no other subnets have liquidity, but at least the price will be relatively stable.

btcli stake add  --netuid 3  --network ws://127.0.0.1:9945 --wallet.name alice  --partial --tolerance 0.5 --amount 10000
 -->

### Start emissions

First, use the subnet creator key to start emissions on the subnet. Assuming your want to use subnet 2, run:

```shell
btcli subnet start --netuid 2 \
--wallet.name sn-creator \
--network ws://127.0.0.1:9945
```

```console
Are you sure you want to start subnet 2's emission schedule? [y/n]: y
Enter your password:
Decrypting...
✅ Successfully started subnet 2's emission schedule.
```

:::tip
After some time has passed, you'll be able to confirm that emissions are flowing by inspecting your subnet's token economy. You'll see a non-zero amount in the _Emissions_ column, indicating, even if no mining activity is occuring, the subnet creator key accumulates emissions.

If you have only started one subnet, you'll see that it's emissions are always exactly 1 $\tau$.

See [Emissions](../learn/emissions)

```shell
 btcli view dashboard \
--wallet.name sn-creator \
--network ws://127.0.0.1:9945
```

:::

### Configure the `user_liquidity_enabled` hyperparameter

Set the `user_liquidity_enabled` hyperparameter to `True` from its default value of `False`.

```shell
btcli sudo set --netuid 2 \
--parameter user_liquidity_enabled \
--value True \
--wallet.name sn-creator \
--network ws://127.0.0.1:9945

```

```console
✅ Hyperparameter user_liquidity_enabled changed to True

                          Subnet Hyperparameters
            NETUID: 2 (awesome-first-subnet) - Network: custom

 HYPERPARAMETER                    VALUE                  NORMALIZED
 ────────────────────────────────────────────────────────────────────────

 (all the hyperparameters...)

   user_liquidity_enabled          True                   True
 ────────────────────────────────────────────────────────────────────────
```

:::tip
Confirm the subnet configuration with the following command, checking that `user_liquidity_enabled` is `True`.

```
btcli subnet hyperparameters --netuid 2 --network ws://127.0.0.1:9945
```

:::

### Create and fund a liquidity manager wallet

Additionally, in order to manage liquidity on a subnet, a user use a hotkey that has some stake on the subnet. Therefore you must register and stake some liquidity into the hotkey. This alpha liquidity will be used for the alpha component when you add liquidity to a position, when creating or modifying it.

1. Create the wallet
   ```shell
   btcli w create --wallet.name liquidity-manager --hotkey lp-hotkey
   ```
2. Transfer funds from the Alice account
   ```
   btcli wallet transfer \
   --amount 1001 \
   --wallet.name alice \
   --destination "5F7LNFEmsngMV2yaA41WPeYuQmVGcesu5TPJizPDpSUHviVr" \ # Coldkey public key for your liquidity-manager wallet
   --network ws://127.0.0.1:9945
   ```
3. Check your balance in the dashboard

   ```shell
   btcli view dashboard \
   --wallet.name liquidity-manager \
   --network ws://127.0.0.1:9945
   ```

4. Register your liquidity-manager's hotkey.

   This is the hotkey that will contain alpha stake related to the position. When you add alpha liquidity to the position, it will come from this hotkey, and when you exit it from the position, it will be credited to this hotkey.

   You can either use your wallet's name for the hotkey (as below), or specify the hotkey's ss58 address in interactive mode. If you need to find your hotkey's ss58, use `btcli wallet list`.

   :::tip
   On a local blockchain running in fastblocks mode, you will likely need to use the `--period` flag to give you a long enough window before your registration request will expire.
   :::

   ```shell
   btcli subnet register \
   --wallet.name liquidity-manager \
   --wallet.hotkey hotsauce \
   --period 20 \
   --network ws://127.0.0.1:9945
   ```

   ```console
     Register to netuid: 2
                                                            Network: custom

    Netuid ┃ Symbol ┃ Cost (Τ) ┃                      Hotkey                      ┃                     Coldkey
   ━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      2    │   β    │ τ 0.0913 │ 5DJepbhrkAVdf5L3kXLMvjHu8TBB62AAGN8U4LjTtQYoKG9R │ 5F7LNFEmsngMV2yaA41WPeYuQmVGcesu5TPJizPDpSUHviVr
   ────────┼────────┼──────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────
           │        │          │                                                  │
   Your balance is: 1,001.0000 τ
   The cost to register by recycle is 0.0913 τ
   Do you want to continue? [y/n] (n): y
   Enter your password:
   Decrypting...
   Balance:
     1,001.0000 τ ➡ 1,000.9087 τ
   ✅ Registered on netuid 2 with UID 1
   ```

## Creating liquidity positions

The token input when creating a LP depends on whether the current token price is above, below, or within the window between the high and low price that define the position. Therefore you should always check the current token price when creating, removing, or modifying positions, so you correctly anticipate the behavior.

To observe the token input behavior of liquidity positions, let's create attempt to create 3 LPs, such that the current price is below, within, and above, the positions' respective price windows.

If we attempt to create an LP with high window, i.e. with its low price above the current token price, or if we attempt to create one with a window that spans the current price, it will fail. That is because the token composition for a LP with a high window is entirely alpha, and for a LP with a window that spans the current price, it is mixed TAO and alpha. Therefore, to create the LP requires some alpha to be staked into the hotkey, and currently the hotkey has no stake.

However, if we attempt to create a LP with a low window relative to the current price, i.e. with its high price below the current price, it will succeed, because the LP is composed entirely of TAO.

See [Liquidity Positions: Dynamic token composition](./#dynamic-token-composition).

### Check the price

Always check the token price prior to creating LPs so you can predict their behavior.

To easily view token prices on your local chain, as well as your TAO balance and alpha stakes, use the BTCLI dashboard:

```
btcli view dashboard \
--wallet.name liquidity-manager \
--network ws://127.0.0.1:9945
```

You can also check the price with the following:

```
btcli subnet list  --network ws://127.0.0.1:9945

                                                                      Subnets
                                                                  Network: custom


        ┃                        ┃ Price       ┃ Market Cap  ┃              ┃                         ┃               ┃               ┃
 Netuid ┃ Name                   ┃ (Τ_in/α_in) ┃ (α * Price) ┃ Emission (Τ) ┃ P (Τ_in, α_in)          ┃ Stake (α_out) ┃ Supply (α)    ┃ Tempo (k/n)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━
   0    │ τ root                 │ 1.0000 τ/Τ  │ τ 0.00      │ τ 0.0000     │ -, -                    │ Τ 0.00        │ 0.00 Τ /21M   │ -/-
   2    │ β awesome-first-subnet │ 1.0001 τ/β  │ τ 13.02k    │ τ 1.0000     │ τ 7.00k, 7.00k β        │ 6.02k β       │ 13.02k β /21M │ 3/10
   1    │ α apex                 │ 0.0000 τ/α  │ τ 0.00      │ τ 0.0000     │ τ 10.00, 10.00 α        │ 1.00 α        │ 11.00 α /21M  │ 21/100
────────┼────────────────────────┼─────────────┼─────────────┼──────────────┼─────────────────────────┼───────────────┼───────────────┼─────────────
```

### High and spanning window

These requests are bound to fail, because we have not yet staked any alpha to the hotkey:

```
btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager --hotkey hotsauce

Enter the amount of liquidity: 10
Enter liquidity position low price: 1.1
Enter liquidity position high price (must be greater than low price): 1.3

You are about to add a LiquidityPosition with:
        liquidity: 10.0000 τ
        price low: 1.1000 τ
        price high: 1.3000 τ
        to SN: 2
        using wallet with name: liquidity-manager
Would you like to continue? [y/n]: y
Error: Subtensor returned `InsufficientBalance(Module)` error. This means: `The caller does not have enough balance for the operation.

btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager --hotkey hotsauce --liquidity 10 --price-low .5 --price-high 1.5

You are about to add a LiquidityPosition with:
        liquidity: 10.0000 τ
        price low: 0.5000 τ
        price high: 1.5000 τ
        to SN: 2
        using wallet with name: liquidity-manager
Would you like to continue? [y/n]: y
Error: Subtensor returned `InsufficientBalance(Module)` error. This means: `The caller does not have enough balance for the operation.
```

### If the current price is below the window

However, the following position can be created, because its high price is below the current token price.

```shell
btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager
```

```console
Enter the amount of liquidity: 10
Enter liquidity position low price: .5
Enter liquidity position high price (must be greater than low price): .7
Enter your password:
Decrypting...
You are about to add a LiquidityPosition with:
        liquidity: 100.0000 τ
        price low: 0.5000 τ
        price high: 0.7000 τ
        to SN: 2
        using wallet with name: liquidity-manager
Would you like to continue? [y/n]: y
LiquidityPosition has been successfully added.
```

View the position by running:

```shell
btcli liquidity list  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager
```

```console

                Liquidity Positions of liquidity-manager wallet in SN #2
              Alpha and Tao columns are respective portions of liquidity.
┏━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┓
┃ ID ┃ Liquidity ┃  Alpha   ┃   Tao    ┃ Price low ┃ Price high ┃ Fee TAO  ┃ Fee Alpha ┃
┡━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━┩
│ 2  │   10.0    │ 0.0000 β │ 1.2956 τ │ 0.5000 τ  │  0.7001 τ  │ 0.0000 τ │ 0.0000 β  │
└────┴───────────┴──────────┴──────────┴───────────┴────────────┴──────────┴───────────┘

```

### Add alpha to the liquidity manager hotkey

Next, stake into your hotkey so you'll be able to create those other LPs.

:::note notes
Use `--partial` to make things easier; this option allows you to specify a large staking amount, and an amount will be staked up to your tolerance threshold.

If you don't use partial (or unsafe-staking mode), you'll have to find a staking amount that will be tolerated by your slippage limit.
:::

```shell
btcli stake add --netuid 2 \
--hotkey hotsauce --amount 10 \
--wallet.name liquidity-manager \
--partial \
--network ws://127.0.0.1:9945
```

```console
Safe staking: enabled (from config).
Rate tolerance: 0.005 (0.5%) by default. Set this using `btcli config set` or `--tolerance` flag
Partial staking: enabled.


                                                  Wallet Coldkey Balance
                                                     Network: custom

    Wallet Name         Coldkey Address                                    Free Balance   Staked Value   Total Balance
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    liquidity-manager   5F7LNFEmsngMV2yaA41WPeYuQmVGcesu5TPJizPDpSUHviVr   1,000.9100 τ       0.0000 τ    1,000.9100 τ



    Total Balance                                                          1,000.9100 τ       0.0000 τ    1,000.9100 τ
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount to stake (TAO τ): 10

                                                                                 Staking to:
                                          Wallet: liquidity-manager, Coldkey ss58: 5F7LNFEmsngMV2yaA41WPeYuQmVGcesu5TPJizPDpSUHviVr
                                                                               Network: custom

 Netuid ┃                      Hotkey                      ┃ Amount (Τ) ┃      Rate (per Τ)      ┃ Received ┃ Fee (τ)  ┃ Rate with tolerance: (0.5%) ┃ Partial stake enabled
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━
   2    │ 5DJepbhrkAVdf5L3kXLMvjHu8TBB62AAGN8U4LjTtQYoKG9R │ 10.0000 τ  │ 0.666633241675929 β/Τ  │ 6.6663 β │ Τ 0.0299 │         0.6633 β/Τ          │         True
────────┼──────────────────────────────────────────────────┼────────────┼────────────────────────┼──────────┼──────────┼─────────────────────────────┼───────────────────────
        │                                                  │            │                        │          │          │                             │

Description:
The table displays information about the stake operation you are about to perform.
The columns are as follows:
    - Netuid: The netuid of the subnet you are staking to.
    - Hotkey: The ss58 address of the hotkey you are staking to.
    - Amount: The TAO you are staking into this subnet onto this hotkey.
    - Rate: The rate of exchange between your TAO and the subnet's stake.
    - Received: The amount of stake you will receive on this subnet after slippage.
    - Rate Tolerance: Maximum acceptable alpha rate. If the rate exceeds this tolerance, the transaction will be limited or rejected.
    - Partial staking: If True, allows staking up to the rate tolerance limit. If False, the entire transaction will fail if rate tolerance is exceeded.

Would you like to continue? [y/n]: y
Enter your password:
Decrypting...
✅ Finalized. Stake added to netuid: 2
Balance:
  1,000.9100 τ ➡ 990.9100 τ
Subnet: 2 Stake:
  0.0000 τ ➡ 6.6299 β
```

If you now view your dashboard, you'll see that your TAO balance has reduced by the staked amount, plus the amount of $\tau$ locked into the liquidity position.

```
 btcli view dashboard \
--wallet.name liquidity-manager \
--network ws://127.0.0.1:9945
```

Now let's try again to create the positions that previously we could not.

#### High window position

```shell

btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager --hotkey hotsauce --liquidity 10 --price-low 1.1 --price-high 1.3
```

#### Spanning window position

```shell
btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager --hotkey hotsauce --liquidity 10 --price-low .5 --price-high 1.5
```

### View your LPs

Now we can see all LPs listed.

:::note
The `liquidity` parameter you specify is **not** the amount of TAO/Alpha tokens that will be locked up. Instead, it's a mathematical scaling factor from Uniswap V3's concentrated liquidity model, which calculates the token amounts deducted from your hotkey and coldkey (alpha and TAO respectively) when creating a LP.

Hence you are not charged 10 TAO to create a LP with a magnitude of 10, in this case note that the quantity is 1.295
:::

```shell
btcli liquidity list  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager

                Liquidity Positions of liquidity-manager wallet in SN #2
              Alpha and Tao columns are respective portions of liquidity.
┏━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┓
┃ ID ┃ Liquidity ┃  Alpha   ┃   Tao    ┃ Price low ┃ Price high ┃ Fee TAO  ┃ Fee Alpha ┃
┡━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━┩
│ 5  │   10.0    │ 1.8226 β │ 2.9407 τ │ 0.5000 τ  │  1.4999 τ  │ 0.0000 τ │ 0.0000 β  │
│ 4  │   10.0    │ 0.7638 β │ 0.0000 τ │ 1.1000 τ  │  1.2999 τ  │ 0.0000 τ │ 0.0000 β  │
│ 2  │   10.0    │ 0.0000 β │ 1.2956 τ │ 0.5000 τ  │  0.7001 τ  │ 0.0000 τ │ 0.0000 β  │
└────┴───────────┴──────────┴──────────┴───────────┴────────────┴──────────┴───────────┘
```

##

Now let's see what happens when we stake and unstake within the trading window of liquidity positions.

Create a validator coldkey if you don't have one, (See [Provision Wallets for Local Deploy](../local-build/provision-wallets) and [Mine and Validate (Locally): Register](../local-build/mine-validate)) then transfer a small amount of TAO to it from the Alice wallet.

Then register a hotkey for it on subnet 2.

Now, let's stake to it from the Alice wallet.

```
btcli stake add --netuid 2 \
--network ws://127.0.0.1:9945 --wallet.name alice --partial  --amount 1000

Safe staking: enabled (from config).
Rate tolerance: 0.005 (0.5%) by default. Set this using `btcli config set` or `--tolerance` flag
Partial staking: enabled.


Enter the wallet hotkey name or ss58 address to stake to (or Press Enter to view delegates):
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets



                                             Subnet 2: awesome-first-subnet
                                                    Network: custom

 UID ┃ Stake (β) ┃ Alpha (β) ┃ Tao (τ) ┃ Dividends ┃ Incentive ┃ Emissions (β) ┃ Hotkey ┃ Coldkey ┃ Identity
━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━
  0  │  11.35k β │  11.35k β │  τ 0.00 │ 0.000000  │ 0.000000  │  0.000000 β   │ 5Grwva │ 5Grwva  │ (*Owner controlled)
  2  │  751.95 β │  751.95 β │  τ 0.00 │ 0.000000  │ 0.000000  │  9.020050 β   │ 5CffqS │ 5EEy34  │ ~
  1  │   10.84 β │   10.84 β │  τ 0.00 │ 0.000000  │ 0.000000  │  0.000000 β   │ 5DJepb │ 5F7LNF  │ ~
─────┼───────────┼───────────┼─────────┼───────────┼───────────┼───────────────┼────────┼─────────┼─────────────────────
     │  12.12k β │  12.12k β │  0.00 β │   0.000   │           │   9.0201 β    │        │         │



Enter the UID of the delegate you want to stake to (or press Enter to cancel): 2

Selected delegate: 5CffqSVhydFJHBSbbgfVLAVkoNBTsv3wLj2Tsh1cr2kfanU6

                                                                                   Staking to:
                                                  Wallet: alice, Coldkey ss58: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
                                                                                 Network: custom

 Netuid ┃                      Hotkey                      ┃  Amount (Τ)  ┃      Rate (per Τ)       ┃  Received  ┃ Fee (τ)  ┃ Rate with tolerance: (0.5%) ┃ Partial stake enabled
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━
   2    │ 5CffqSVhydFJHBSbbgfVLAVkoNBTsv3wLj2Tsh1cr2kfanU6 │ 1,000.0000 τ │ 0.9926136629572226 β/Τ  │ 992.6137 β │ Τ 2.9908 │         0.9877 β/Τ          │         True
────────┼──────────────────────────────────────────────────┼──────────────┼─────────────────────────┼────────────┼──────────┼─────────────────────────────┼───────────────────────
        │                                                  │              │                         │            │          │                             │

Description:
The table displays information about the stake operation you are about to perform.
The columns are as follows:
    - Netuid: The netuid of the subnet you are staking to.
    - Hotkey: The ss58 address of the hotkey you are staking to.
    - Amount: The TAO you are staking into this subnet onto this hotkey.
    - Rate: The rate of exchange between your TAO and the subnet's stake.
    - Received: The amount of stake you will receive on this subnet after slippage.
    - Rate Tolerance: Maximum acceptable alpha rate. If the rate exceeds this tolerance, the transaction will be limited or rejected.
    - Partial staking: If True, allows staking up to the rate tolerance limit. If False, the entire transaction will fail if rate tolerance is exceeded.

Would you like to continue? [y/n]: y
✅ Finalized. Stake added to netuid: 2
Balance:
  996,967.4407 τ ➡ 996,934.4742 τ
Partial stake transaction. Staked:
  32.9665 τ instead of 1,000.0000 τ
Subnet: 2 Stake:
  420.9182 β ➡ 457.4970 β
```

So now, examining the liquidity positions, we can see that some small amount of fees have accumulated to the LP whose window spans the current price, but not the others.

Note that the fees have accumulated to `Fee TAO`, but not to `Fee Alpha`.

```shell
 btcli liquidity list  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager

                Liquidity Positions of liquidity-manager wallet in SN #2
              Alpha and Tao columns are respective portions of liquidity.
┏━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┓
┃ ID ┃ Liquidity ┃  Alpha   ┃   Tao    ┃ Price low ┃ Price high ┃ Fee TAO  ┃ Fee Alpha ┃
┡━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━┩
│ 4  │   10.0    │ 1.7729 β │ 2.9908 τ │ 0.5000 τ  │  1.4999 τ  │ 0.0001 τ │ 0.0000 β  │
│ 3  │   10.0    │ 0.7638 β │ 0.0000 τ │ 1.1000 τ  │  1.2999 τ  │ 0.0000 τ │ 0.0000 β  │
│ 2  │   10.0    │ 0.0000 β │ 1.2956 τ │ 0.5000 τ  │  0.7001 τ  │ 0.0000 τ │ 0.0000 β  │
└────┴───────────┴──────────┴──────────┴───────────┴────────────┴──────────┴───────────┘
```

Now let's unstake and see what happens

```shell
btcli stake remove --netuid 2 \
--partial \
--wallet.name alice \
--network ws://127.0.0.1:9945
```

```console
Safe staking: enabled (from config).
Rate tolerance: 0.005 (0.5%) by default. Set this using `btcli config set` or `--tolerance` flag
Partial staking: enabled.

Enter the hotkey name or ss58 address to unstake from (or Press Enter to view existing staked hotkeys):

                         Hotkeys with Stakes for Subnet 2

 Index ┃ Identity    ┃ Netuids ┃ Hotkey Address
━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     0 │ 5Grw...utQY │ 2       │ 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
     1 │ 5Cff...anU6 │ 2       │ 5CffqSVhydFJHBSbbgfVLAVkoNBTsv3wLj2Tsh1cr2kfanU6
───────┼─────────────┼─────────┼──────────────────────────────────────────────────
       │             │         │

Enter the index of the hotkey you want to unstake from [0/1]: 1



               Stakes for hotkey
                  5Cff...anU6
5CffqSVhydFJHBSbbgfVLAVkoNBTsv3wLj2Tsh1cr2kfanU
                       6

 Subnet ┃ Symbol ┃ Stake Amount ┃ Rate (Τ/α)
━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━
      2 │ β      │ 3,067.5744 β │ 1.012479 τ/β
────────┼────────┼──────────────┼──────────────
        │        │              │


Unstake all: 3,067.5744 β from 5Cff...anU6 on netuid: 2?  [y/n/q] (n): y

                                                             Unstaking to:
                             Wallet: alice, Coldkey ss58: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
                                                            Network: custom

 Netuid ┃   Hotkey    ┃  Amount (α)  ┃  Rate (Τ/α)   ┃ Fee (α)  ┃ Received (Τ) ┃ Rate with tolerance: (0.5%) ┃ Partial unstake enabled
━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━
   2    │ 5Cff...anU6 │ 3,067.5744 β │ 1.012479(Τ/β) │ 9.1744 β │ 3,105.8531 τ │        1.007416 Τ/β         │          True
────────┼─────────────┼──────────────┼───────────────┼──────────┼──────────────┼─────────────────────────────┼─────────────────────────
        │             │              │               │          │ 3,105.8531 τ │                             │

Description:
The table displays information about the stake remove operation you are about to perform.
The columns are as follows:
    - Netuid: The netuid of the subnet you are unstaking from.
    - Hotkey: The ss58 address or identity of the hotkey you are unstaking from.
    - Amount to Unstake: The stake amount you are removing from this key.
    - Rate: The rate of exchange between TAO and the subnet's stake.
    - Fee: The transaction fee for this unstake operation.
    - Received: The amount of free balance TAO you will receive on this subnet after slippage and fees.
    - Slippage: The slippage percentage of the unstake operation. (0% if the subnet is not dynamic i.e. root).
    - Rate Tolerance: Maximum acceptable alpha rate. If the rate reduces below this tolerance, the transaction will be limited or rejected.
    - Partial unstaking: If True, allows unstaking up to the rate tolerance limit. If False, the entire transaction will fail if rate tolerance is exceeded.

Would you like to continue? [y/n]: y
✅ Finalized
Balance:
  996,934.4742 τ ➡ 997,054.1796 τ
Partial unstake transaction. Unstaked:
  118.8823 β instead of 3,067.5744 β
Subnet: 2 Stake:
  3,075.3541 β ➡ 2,956.4718 β
Unstaking operations completed.
```

Now, viewing our LP again, we can see that fees have accumulated to the position's `Fee Alpha` attribute.

```shell
btcli liquidity list  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager

                Liquidity Positions of liquidity-manager wallet in SN #2
              Alpha and Tao columns are respective portions of liquidity.
┏━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┓
┃ ID ┃ Liquidity ┃  Alpha   ┃   Tao    ┃ Price low ┃ Price high ┃ Fee TAO  ┃ Fee Alpha ┃
┡━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━┩
│ 4  │   10.0    │ 1.7978 β │ 2.9657 τ │ 0.5000 τ  │  1.4999 τ  │ 0.0001 τ │ 0.0001 β  │
│ 3  │   10.0    │ 0.7638 β │ 0.0000 τ │ 1.1000 τ  │  1.2999 τ  │ 0.0000 τ │ 0.0000 β  │
│ 2  │   10.0    │ 0.0000 β │ 1.2956 τ │ 0.5000 τ  │  0.7001 τ  │ 0.0000 τ │ 0.0000 β  │
└────┴───────────┴──────────┴──────────┴───────────┴────────────┴──────────┴───────────┘
```

## Remove liquidity from the position

Let's remove the LP and recover the liquidity inside. To see how this affects our balance, run the `dashboard` command once before the `liquidity remove` command, and once after. You will see a small increase in your token balances.

:::tip
You can find the required LP ID with `btcli liquidity list`, as seen above.
:::

```shell
btcli liquidity remove --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager
```

```console
Enter the liquidity position ID: 5
Enter the SS58 of the hotkey to use for this transaction.: 5DJepbhrkAVdf5L3kXLMvjHu8TBB62AAGN8U4LjTtQYoKG9R

You are about to remove LiquidityPositions with:
        Subnet: 2
        Wallet name: liquidity-manager
        Position id: 5
Would you like to continue? [y/n]: y
Enter your password:
Decrypting...
Position 5 has been removed.
```
