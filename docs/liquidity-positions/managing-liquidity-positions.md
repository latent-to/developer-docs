---
title: Managing User Liquidity Positions Tutorial
---

In this tutorial we will explore the behavior of Bittensor's Uniswap-style user liquidity positions (LPs). To facilitate this, we'll deploy a Subtensor blockchain locally and create a subnet on it.


Liquidity positions are complicated and potentially confusing, because their behavior is sensitive to the subnet price relative to the position's high' and 'low' price boundaries, at several stages of their life-cycle:

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


btcli subnet create \
--subnet-name awesome-first-subnet \
--wallet.name alice \
--network ws://127.0.0.1:9945


<!-- 
To keep the subnet price stable, let's first stake a ubnch of liquidity in. this will result in a strangely high price because no other subnets have liquidity, but at least the price will be relatively stable.

btcli stake add  --netuid 3  --network ws://127.0.0.1:9945 --wallet.name alice  --partial --tolerance 0.5 --amount 10000
 -->


## Start and configure your subnet

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
After some time has passed, you'll be able to confirm that emissions are flowing by inspecting your subnet's token economy. You'll see a non-zero amount in the *Emissions* column, indicating, even if no mining activity is occuring, the subnet creator key accumulates emissions.

If you have only started one subnet, you'll see that it's emissions are always exactly 1 $\tau$.

See [Emissions](../emissions)

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


## Create and fund a dedicated wallet for managing liquidity.


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


	This is the hotkey will contain alpha stake related to the position. When you add alpha liquidity to the position, it will come from this hotkey, and when you exit it from the position, it will credit to this hotkey.

	You can either use your wallet's name for the hotkey (as below), or specify the hotkey's ss58 address in interactive mode. 	If you need to find your hotkey's ss58, use `btcli wallet list`.

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

## Adding a liquidity position

The token input when creating a LP depends on whether the current token price is above, below, or within the window between the high and low price that define the position. Therefore you should always check the current token price when creating, removing, or modifying positions, so you correctly anticipate the behavior.

:::tip
To easily view token prices on your local chain, as well as your TAO balance and alpha stakes, use the BTCLI dashboard:
```
btcli view dashboard \
--wallet.name liquidity-manager \
--network ws://127.0.0.1:9945
```
:::

To observe the token input behavior of liquidity positions, let's create attempt to create 3 LPs, such that the current price is below, within, and above, the positions' respective price windows.


If we attempt to create an LP with high window, i.e. with its low price above the current token price, or if we attempt to create one with a window that spans the current price, it will fail. That is because the token composition for a LP with a high window is entirely alpha, and for a LP with a window that spans the current price, it is mixed TAO and alpha. Therefore, to create the LP requires some alpha to be staked into the hotkey, and currently the hotkey has no stake.


However, if we attempt to create a LP with a low window relative to the current price, i.e. with its high price below the current price, it will succeed, because the LP is composed entirely of TAO.

See [Liquidity Positions: Dynamic token composition](./liquidity-positions#dynamic-token-composition).


### Check the price

Always check the token price prior to creating LPs so you can predict their behavior.

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

These requests are bound to fail without alpha staked to the hotkey.

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


```shell
btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager
```
```console

Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets
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


<!-- OK, so what is up with the amount of liquidity added here? Why did it only take 1.2 T from the wallet? -->


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


Next, stake into your hotkey so you'll be able to create those other LPs.

	

:::note notes
Use `--partial` to make things easier; this option allows you to specify a large staking amount, and an amount will be staked up to your tolerance threshold.


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

```shell
High position
btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager --hotkey hotsauce --liquidity 10 --price-low 1.1 --price-high 1.3
```

```shell
Spanning position
btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager --hotkey hotsauce --liquidity 10 --price-low .5 --price-high 1.5
```



Now we can see all LPs listed:

```
btcli liquidity list  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name liquidity-manager
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

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














Create a liquidity position with `add_liquidity`.
```python
await subtensor.add_liquidity(
    wallet=wallet,
    netuid=netuid,
    liquidity=Balance.from_tao(1.0),
    price_low=Balance.from_tao(1.5),
    price_high=Balance.from_tao(2.0),
    wait_for_inclusion=True,
    wait_for_finalization=False,
    period=None
)
```

[See source code](https://github.com/opentensor/bittensor/blob/staging/bittensor/core/subtensor.py#L2997-L3056)

### Modifying a position

Use `modify_liquidity` with the desired amount to add or subtract liquidity to an existing position.

```python
# Adding liquidity (positive delta)
await subtensor.modify_liquidity(
    wallet=wallet,
    netuid=netuid,
    position_id=position_id,
    liquidity_delta=Balance.from_tao(0.5),
    wait_for_inclusion=True,
    wait_for_finalization=False,
    period=None
)

# Subtracting liquidity (negative delta)
await subtensor.modify_liquidity(
    wallet=wallet,
    netuid=netuid,
    position_id=position_id,
    liquidity_delta=Balance.from_tao(0.6) * -1,  # or -Balance.from_tao(0.6)
    wait_for_inclusion=True,
    wait_for_finalization=False,
    period=None
)
```

[See source code](https://github.com/opentensor/bittensor/blob/staging/bittensor/core/subtensor.py#L3210-L3269)

### Removing a liquidity position

Removes liquidity and credits balances back to the creator's wallet.

```python
await subtensor.remove_liquidity(
    wallet=wallet,
    netuid=netuid,
    position_id=position_id,
    wait_for_inclusion=True,
    wait_for_finalization=False,
    period=None
)
```

[See source code](https://github.com/opentensor/bittensor/blob/staging/bittensor/core/subtensor.py#L3418-L3477)

### Listing positions

Get all positions on a specific subnet for a specific wallet. Returns a list of `LiquidityPosition` objects with calculated fees.

```python
positions = await subtensor.get_liquidity_list(
    wallet=wallet,
    netuid=netuid,
    block=None
)
```

[See source code](https://github.com/opentensor/bittensor/blob/staging/bittensor/core/subtensor.py#L1451-L1523)

---
# RAW SHELL JUNK:

07/14-09:13 :)  btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet name from config: PracticeKey!
Using the wallet hotkey from config: default
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets
Enter the SS58 of the hotkey to use for this transaction.: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
Enter the amount of liquidity: 1
Enter liquidity position low price: 0.9
Enter liquidity position high price (must be greater than low price): 1.1
Enter your password:
Decrypting...
^C^C^C^C^C^C
07/14-09:13 :)
07/14-09:13 :)
07/14-09:13 :)  btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name alice
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet hotkey from config: default
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets
Enter the amount of liquidity: 1
Enter liquidity position low price: 0.9
Enter liquidity position high price (must be greater than low price): 1.1
You are about to add a LiquidityPosition with:
        liquidity: 1.0000 τ
        price low: 0.9000 τ
        price high: 1.1000 τ
        to SN: 2
        using wallet with name: alice
Would you like to continue? [y/n]: y
LiquidityPosition has been successfully added.
07/14-09:13 :)  btcli liquidity list
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Netuid: 2
Using the wallet name from config: PracticeKey!
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets
Using the specified network test from config
⠏ Connecting to Substrate: Network: test, Chain: wss://test.finney.opentensor.ai:443...^C%
07/14-09:13 :)
07/14-09:13 :)  btcli liquidity list --network ws://127.0.0.1:9945
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Netuid: 2
Using the wallet name from config: PracticeKey!
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

              Liquidity Positions of PracticeKey! wallet in SN #2
          Alpha and Tao columns are respective portions of liquidity.
┏━━━━┳━━━━━━━━━━━┳━━━━━━━┳━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━┓
┃ ID ┃ Liquidity ┃ Alpha ┃ Tao ┃ Price low ┃ Price high ┃ Fee TAO ┃ Fee Alpha ┃
┡━━━━╇━━━━━━━━━━━╇━━━━━━━╇━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━┩
└────┴───────────┴───────┴─────┴───────────┴────────────┴─────────┴───────────┘
07/14-09:13 :)  btcli liquidity list --network ws://127.0.0.1:9945 --wallet.name alice
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Netuid: 2
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                      Liquidity Positions of alice wallet in SN #2
              Alpha and Tao columns are respective portions of liquidity.
┏━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┓
┃ ID ┃ Liquidity ┃  Alpha   ┃   Tao    ┃ Price low ┃ Price high ┃ Fee TAO  ┃ Fee Alpha ┃
┡━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━┩
│ 2  │    1.0    │ 0.0440 β │ 0.0538 τ │ 0.9001 τ  │  1.1000 τ  │ 0.0000 τ │ 0.0000 β  │
└────┴───────────┴──────────┴──────────┴───────────┴────────────┴──────────┴───────────┘
07/14-09:13 :)  btcli stake add --netuid 2 --wallet.name alice --network ws://127.0.0.1:9945  --allow-partial-stake
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Safe staking: enabled (from config).
Rate tolerance: 0.005 (0.5%) by default. Set this using `btcli config set` or `--tolerance` flag
Partial staking: enabled.


Enter the wallet hotkey name or ss58 address to stake to (or Press Enter to view delegates):
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets



                                                Subnet 2: awesome-subnet
                                                    Network: custom

 UID ┃ Stake (β) ┃ Alpha (β) ┃ Tao (τ) ┃ Dividends ┃ Incentive ┃ Emissions (β) ┃ Hotkey ┃ Coldkey ┃ Identity
━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━
  0  │   4.32k β │   4.32k β │  τ 0.00 │ 0.000000  │ 0.000000  │  9.020050 β   │ 5Grwva │ 5Grwva  │ (*Owner controlled)
─────┼───────────┼───────────┼─────────┼───────────┼───────────┼───────────────┼────────┼─────────┼─────────────────────
     │   4.32k β │   4.32k β │  0.00 β │   0.000   │           │   9.0201 β    │        │         │



Enter the UID of the delegate you want to stake to (or press Enter to cancel): 0

Selected delegate: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY ((*Owner controlled))

                                                  Wallet Coldkey Balance
                                                      Network: custom

    Wallet Name     Coldkey Address                                      Free Balance   Staked Value      Total Balance
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    alice           5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY   998,993.4017 τ   4,351.2923 τ   1,003,344.6940 τ



    Total Balance                                                      998,993.4017 τ   4,351.2923 τ   1,003,344.6940 τ
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount to stake (TAO τ): 1000

                                                                                   Staking to:
                                                  Wallet: alice, Coldkey ss58: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
                                                                                 Network: custom

 Netuid ┃                      Hotkey                      ┃  Amount (Τ)  ┃      Rate (per Τ)       ┃  Received  ┃ Fee (τ)  ┃ Rate with tolerance: (0.5%) ┃ Partial stake enabled
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━
   2    │ 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY │ 1,000.0000 τ │ 0.9950248776020396 β/Τ  │ 995.0249 β │ Τ 2.9908 │         0.9901 β/Τ          │         True
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
  998,993.4017 τ ➡ 998,979.9845 τ
Partial stake transaction. Staked:
  13.4172 τ instead of 1,000.0000 τ
Subnet: 2 Stake:
  4,351.6441 β ➡ 4,375.9215 β

07/14-09:13 :)  btcli stake list --wallet.name alice --network ws://127.0.0.1:9945
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                       Hotkey: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
                                           Network: custom


        ┃                  ┃     Value ┃           ┃    Price    ┃            ┃  Emission ┃  Emission
 Netuid ┃ Name             ┃ (α x τ/α) ┃ Stake (α) ┃ (τ_in/α_in) ┃ Registered ┃ (α/block) ┃ (Τ/block)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━
 2      │ β awesome-subnet │   τ 4.52k │  4.47k β  │ 1.0100 τ/β  │        YES │  0.7396 β │  0.0000 τ
────────┼──────────────────┼───────────┼───────────┼─────────────┼────────────┼───────────┼───────────
 1      │                  │   τ 4.52k │           │             │            │           │



Wallet:
  Coldkey SS58: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
  Free Balance: 998,979.9845 τ
  Total TAO Value (τ): τ 4.52k
07/14-09:13 :)
07/14-09:13 :)  btcli subnet list --network ws://127.0.0.1:9945
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(

                                                                   Subnets
                                                               Network: custom


        ┃                  ┃ Price       ┃ Market Cap  ┃              ┃                        ┃               ┃               ┃
 Netuid ┃ Name             ┃ (Τ_in/α_in) ┃ (α * Price) ┃ Emission (Τ) ┃ P (Τ_in, α_in)         ┃ Stake (α_out) ┃ Supply (α)    ┃ Tempo (k/n)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━
   0    │ τ root           │ 1.0000 τ/Τ  │ τ 0.00      │ τ 0.0000     │ -, -                   │ Τ 0.00        │ 0.00 Τ /21M   │ -/-
   2    │ β awesome-subnet │ 1.0100 τ/β  │ τ 10.23k    │ τ 1.0000     │ τ 5.58k, 5.53k β       │ 4.60k β       │ 10.13k β /21M │ 4/10
   1    │ α apex           │ 0.0000 τ/α  │ τ 0.00      │ τ 0.0000     │ τ 10.00, 10.00 α       │ 1.00 α        │ 11.00 α /21M  │ 40/100
────────┼──────────────────┼─────────────┼─────────────┼──────────────┼────────────────────────┼───────────────┼───────────────┼─────────────
   3    │                  │ τ 1.01      │             │ τ 1.0        │ τ 5.59k/7.61k (73.52%) │               │               │
07/14-09:13 :)  btcli liquidity list --network ws://127.0.0.1:9945 --wallet.name alice
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Netuid: 2
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                      Liquidity Positions of alice wallet in SN #2
              Alpha and Tao columns are respective portions of liquidity.
┏━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┓
┃ ID ┃ Liquidity ┃  Alpha   ┃   Tao    ┃ Price low ┃ Price high ┃ Fee TAO  ┃ Fee Alpha ┃
┡━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━┩
│ 2  │    1.0    │ 0.0416 β │ 0.0563 τ │ 0.9001 τ  │  1.1000 τ  │ 0.0000 τ │ 0.0000 β  │
└────┴───────────┴──────────┴──────────┴───────────┴────────────┴──────────┴───────────┘
07/14-09:13 :)  btcli liquidity list --network ws://127.0.0.1:9945 --wallet.name alice
07/14-09:13 :)
07/14-09:13 :)
07/14-09:13 :)  pip install bittensor= 9.8.2
07/14-09:13 :)
07/14-09:13 :)  btcli liquidity add  --netuid 2 --network ws://127.0.0.1:9945 --wallet.name alice
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet hotkey from config: default
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets
Enter the amount of liquidity: 17
Enter liquidity position low price: .08
Enter liquidity position high price (must be greater than low price): 1.3
You are about to add a LiquidityPosition with:
        liquidity: 17.0000 τ
        price low: 0.0800 τ
        price high: 1.3000 τ
        to SN: 2
        using wallet with name: alice
Would you like to continue? [y/n]: y
LiquidityPosition has been successfully added.
07/14-09:13 :)  btcli liquidity list --network ws://127.0.0.1:9945 --wallet.name alice
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Netuid: 2
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                      Liquidity Positions of alice wallet in SN #2
               Alpha and Tao columns are respective portions of liquidity.
┏━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┓
┃ ID ┃ Liquidity ┃  Alpha   ┃    Tao    ┃ Price low ┃ Price high ┃ Fee TAO  ┃ Fee Alpha ┃
┡━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━┩
│ 3  │   17.0    │ 2.0049 β │ 12.2765 τ │ 0.0800 τ  │  1.2999 τ  │ 0.0000 τ │ 0.0000 β  │
│ 2  │    1.0    │ 0.0416 β │ 0.0563 τ  │ 0.9001 τ  │  1.1000 τ  │ 0.0000 τ │ 0.0000 β  │
└────┴───────────┴──────────┴───────────┴───────────┴────────────┴──────────┴───────────┘
07/14-09:13 :)  btcli liquidity remove  --network ws://127.0.0.1:9945 --wallet.name alice
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Netuid: 2
Enter the liquidity position ID: 2
Using the wallet hotkey from config: default
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets
You are about to remove LiquidityPositions with:
        Subnet: 2
        Wallet name: alice
        Position id: 2
Would you like to continue? [y/n]: t
Please enter Y or N
Would you like to continue? [y/n]: y
 Position 2 has been removed.
07/14-09:13 :)  btcli wallet balance --network ws://127.0.0.1:9945 --wallet.name alice
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                                                   Wallet Coldkey Balance
                                                      Network: custom

    Wallet Name     Coldkey Address                                      Free Balance    Staked Value      Total Balance
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    alice           5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY   998,967.7636 τ   17,883.4603 τ   1,016,851.2239 τ



    Total Balance                                                      998,967.7636 τ   17,883.4603 τ   1,016,851.2239 τ
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

07/14-09:13 :)  btcli stake list --wallet.name alice --network ws://127.0.0.1:9945
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                       Hotkey: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
                                           Network: custom


        ┃                  ┃     Value ┃           ┃    Price    ┃            ┃  Emission ┃  Emission
 Netuid ┃ Name             ┃ (α x τ/α) ┃ Stake (α) ┃ (τ_in/α_in) ┃ Registered ┃ (α/block) ┃ (Τ/block)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━
 2      │ β awesome-subnet │  τ 17.99k │ 17.82k β  │ 1.0100 τ/β  │        YES │  0.7396 β │  0.0000 τ
────────┼──────────────────┼───────────┼───────────┼─────────────┼────────────┼───────────┼───────────
 1      │                  │  τ 17.99k │           │             │            │           │



Wallet:
  Coldkey SS58: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
  Free Balance: 998,967.7636 τ
  Total TAO Value (τ): τ 17.99k
07/14-09:13 :)  btcli wallet transfer \
--amount 1001 \
--wallet.name alice \
--destination "5C9xw4gDyu11ocdpWrmhT1sbi4xEHCpzEMsyMA4jGfAZQofQ" \
--network ws://127.0.0.1:9945
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets
Initiating transfer on network: custom
Do you want to transfer:
  amount: 1,001.0000 τ
  from: alice : 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
  to: 5C9xw4gDyu11ocdpWrmhT1sbi4xEHCpzEMsyMA4jGfAZQofQ
  for fee: 0.0001 τ [y/n]: y
✅ Finalized
Block Hash: 0x1b26cbd0b361f24346e79feb66eac1e4ad70b173136f9c520c033aa02cd31e10
Balance:
  998,967.7636 τ ➡ 997,966.7634 τ
07/14-09:13 :)  btcli wallet balance --network ws://127.0.0.1:9945 --wallet.name sn-creator
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                                                Wallet Coldkey Balance
                                                   Network: custom

    Wallet Name     Coldkey Address                                    Free Balance   Staked Value   Total Balance
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    sn-creator      5C9xw4gDyu11ocdpWrmhT1sbi4xEHCpzEMsyMA4jGfAZQofQ   1,001.0000 τ       0.0000 τ    1,001.0000 τ



    Total Balance                                                      1,001.0000 τ       0.0000 τ    1,001.0000 τ
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

07/14-09:13 :)  btcli stake add --netuid 2 --wallet.name sn-creator --network ws://127.0.0.1:9945  --allow-partial-stake
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Safe staking: enabled (from config).
Rate tolerance: 0.005 (0.5%) by default. Set this using `btcli config set` or `--tolerance` flag
Partial staking: enabled.


Enter the wallet hotkey name or ss58 address to stake to (or Press Enter to view delegates):
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets



                                                Subnet 2: awesome-subnet
                                                    Network: custom

 UID ┃ Stake (β) ┃ Alpha (β) ┃ Tao (τ) ┃ Dividends ┃ Incentive ┃ Emissions (β) ┃ Hotkey ┃ Coldkey ┃ Identity
━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━
  0  │  18.75k β │  18.75k β │  τ 0.00 │ 0.000000  │ 0.000000  │  9.020050 β   │ 5Grwva │ 5Grwva  │ (*Owner controlled)
─────┼───────────┼───────────┼─────────┼───────────┼───────────┼───────────────┼────────┼─────────┼─────────────────────
     │  18.75k β │  18.75k β │  0.00 β │   0.000   │           │   9.0201 β    │        │         │



Enter the UID of the delegate you want to stake to (or press Enter to cancel): 0

Selected delegate: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY ((*Owner controlled))

                                                Wallet Coldkey Balance
                                                   Network: custom

    Wallet Name     Coldkey Address                                    Free Balance   Staked Value   Total Balance
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    sn-creator      5C9xw4gDyu11ocdpWrmhT1sbi4xEHCpzEMsyMA4jGfAZQofQ   1,001.0000 τ       0.0000 τ    1,001.0000 τ



    Total Balance                                                      1,001.0000 τ       0.0000 τ    1,001.0000 τ
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount to stake (TAO τ): 1000

                                                                                   Staking to:
                                                Wallet: sn-creator, Coldkey ss58: 5C9xw4gDyu11ocdpWrmhT1sbi4xEHCpzEMsyMA4jGfAZQofQ
                                                                                 Network: custom

 Netuid ┃                      Hotkey                      ┃  Amount (Τ)  ┃      Rate (per Τ)       ┃  Received  ┃ Fee (τ)  ┃ Rate with tolerance: (0.5%) ┃ Partial stake enabled
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━
   2    │ 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY │ 1,000.0000 τ │ 0.9900745060471015 β/Τ  │ 990.0745 β │ Τ 2.9908 │         0.9851 β/Τ          │         True
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
Enter your password:
Decrypting...
✅ Finalized. Stake added to netuid: 2
Balance:
  1,001.0000 τ ➡ 951.2508 τ
Partial stake transaction. Staked:
  49.7492 τ instead of 1,000.0000 τ
Subnet: 2 Stake:
  0.0000 τ ➡ 48.9858 β

07/14-09:13 :)  btcli stake list --wallet.name alice --network ws://127.0.0.1:9945
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                       Hotkey: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
                                           Network: custom


        ┃                  ┃     Value ┃           ┃    Price    ┃            ┃  Emission ┃  Emission
 Netuid ┃ Name             ┃ (α x τ/α) ┃ Stake (α) ┃ (τ_in/α_in) ┃ Registered ┃ (α/block) ┃ (Τ/block)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━
 2      │ β awesome-subnet │  τ 19.17k │ 18.88k β  │ 1.0151 τ/β  │        YES │  0.7396 β │  0.0000 τ
────────┼──────────────────┼───────────┼───────────┼─────────────┼────────────┼───────────┼───────────
 1      │                  │  τ 19.17k │           │             │            │           │



Wallet:
  Coldkey SS58: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
  Free Balance: 997,966.7634 τ
  Total TAO Value (τ): τ 19.17k
07/14-09:13 :)  btcli stake list --wallet.name sn-creator --network ws://127.0.0.1:9945
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                       Hotkey: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
                                           Network: custom


        ┃                  ┃     Value ┃           ┃    Price    ┃            ┃  Emission ┃  Emission
 Netuid ┃ Name             ┃ (α x τ/α) ┃ Stake (α) ┃ (τ_in/α_in) ┃ Registered ┃ (α/block) ┃ (Τ/block)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━
 2      │ β awesome-subnet │   τ 49.96 │  49.22 β  │ 1.0151 τ/β  │        YES │  0.7396 β │  0.0000 τ
────────┼──────────────────┼───────────┼───────────┼─────────────┼────────────┼───────────┼───────────
 1      │                  │   τ 49.96 │           │             │            │           │



Wallet:
  Coldkey SS58: 5C9xw4gDyu11ocdpWrmhT1sbi4xEHCpzEMsyMA4jGfAZQofQ
  Free Balance: 951.2508 τ
  Total TAO Value (τ): τ 49.96
07/14-09:13 :)
07/14-09:13 :)  btcli stake list --wallet.name alice --network ws://127.0.0.1:9945
07/14-09:13 :)
07/14-09:13 :)  btcli liquidity list --network ws://127.0.0.1:9945 --wallet.name alice
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Netuid: 2
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                      Liquidity Positions of alice wallet in SN #2
               Alpha and Tao columns are respective portions of liquidity.
┏━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┓
┃ ID ┃ Liquidity ┃  Alpha   ┃    Tao    ┃ Price low ┃ Price high ┃ Fee TAO  ┃ Fee Alpha ┃
┡━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━┩
│ 3  │   17.0    │ 1.9627 β │ 12.3192 τ │ 0.0800 τ  │  1.2999 τ  │ 0.0001 τ │ 0.0000 β  │
└────┴───────────┴──────────┴───────────┴───────────┴────────────┴──────────┴───────────┘
07/14-09:13 :)  btcli stake remove --netuid 2 --wallet.name sn-creator --network ws://127.0.0.1:9945  --allow-partial-stake
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Safe staking: enabled (from config).
Rate tolerance: 0.005 (0.5%) by default. Set this using `btcli config set` or `--tolerance` flag
Partial staking: enabled.


Enter the hotkey name or ss58 address to unstake from (or Press Enter to view existing staked hotkeys):
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets



                         Hotkeys with Stakes for Subnet 2

 Index ┃ Identity    ┃ Netuids ┃ Hotkey Address
━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     0 │ 5Grw...utQY │ 2       │ 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
───────┼─────────────┼─────────┼──────────────────────────────────────────────────
       │             │         │

Enter the index of the hotkey you want to unstake from [0]: 0



               Stakes for hotkey
                  5Grw...utQY
5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQ
                       Y

 Subnet ┃ Symbol ┃ Stake Amount ┃ Rate (Τ/α)
━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━
      2 │ β      │ 49.5208 β    │ 1.015075 τ/β
────────┼────────┼──────────────┼──────────────
        │        │              │


Unstake all: 49.5208 β from 5Grw...utQY on netuid: 2?  [y/n/q] (n): 49.52
Please select one of the available options
Unstake all: 49.5208 β from 5Grw...utQY on netuid: 2?  [y/n/q] (n): n
Enter amount to unstake in β from subnet: 2 (Max: 49.5208 β): 49

                                                            Unstaking to:
                         Wallet: sn-creator, Coldkey ss58: 5C9xw4gDyu11ocdpWrmhT1sbi4xEHCpzEMsyMA4jGfAZQofQ
                                                           Network: custom

 Netuid ┃   Hotkey    ┃ Amount (α) ┃  Rate (Τ/α)   ┃ Fee (α)  ┃ Received (Τ) ┃ Rate with tolerance: (0.5%) ┃ Partial unstake enabled
━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━
   2    │ 5Grw...utQY │ 49.0000 β  │ 1.015075(Τ/β) │ 0.1465 β │  49.7387 τ   │        1.010000 Τ/β         │          True
────────┼─────────────┼────────────┼───────────────┼──────────┼──────────────┼─────────────────────────────┼─────────────────────────
        │             │            │               │          │  49.7387 τ   │                             │

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
Enter your password:
Decrypting...
✅ Finalized
Balance:
  951.2508 τ ➡ 1,000.7207 τ
Partial unstake transaction. Unstaked:
  48.9810 β instead of 49.0000 β
Subnet: 2 Stake:
  49.8823 β ➡ 0.9013 β
Unstaking operations completed.
07/14-09:13 :)  btcli stake list --wallet.name sn-creator --network ws://127.0.0.1:9945
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                       Hotkey: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
                                           Network: custom


        ┃                  ┃     Value ┃           ┃    Price    ┃            ┃  Emission ┃  Emission
 Netuid ┃ Name             ┃ (α x τ/α) ┃ Stake (α) ┃ (τ_in/α_in) ┃ Registered ┃ (α/block) ┃ (Τ/block)
━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━
 2      │ β awesome-subnet │    τ 0.91 │  0.90 β   │ 1.0102 τ/β  │        YES │  0.7396 β │  0.0000 τ
────────┼──────────────────┼───────────┼───────────┼─────────────┼────────────┼───────────┼───────────
 1      │                  │    τ 0.91 │           │             │            │           │



Wallet:
  Coldkey SS58: 5C9xw4gDyu11ocdpWrmhT1sbi4xEHCpzEMsyMA4jGfAZQofQ
  Free Balance: 1,000.7207 τ
  Total TAO Value (τ): τ 0.91
07/14-09:13 :)  btcli liquidity list --network ws://127.0.0.1:9945 --wallet.name alice
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Netuid: 1
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets
Error: Subnet with netuid: 1 is not active in Network: custom, Chain: ws://127.0.0.1:9945.
07/14-09:13 :)  btcli liquidity list --network ws://127.0.0.1:9945 --wallet.name alice
/Users/michaeltrestman/Library/Python/3.9/lib/python/site-packages/urllib3/__init__.py:35: NotOpenSSLWarning: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'LibreSSL 2.8.3'. See: https://github.com/urllib3/urllib3/issues/3020
  warnings.warn(
Netuid: 2
Using the wallet path from config: /Users/michaeltrestman/.bittensor/wallets

                      Liquidity Positions of alice wallet in SN #2
               Alpha and Tao columns are respective portions of liquidity.
┏━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┓
┃ ID ┃ Liquidity ┃  Alpha   ┃    Tao    ┃ Price low ┃ Price high ┃ Fee TAO  ┃ Fee Alpha ┃
┡━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━┩
│ 3  │   17.0    │ 2.0037 β │ 12.2778 τ │ 0.0800 τ  │  1.2999 τ  │ 0.0001 τ │ 0.0001 β  │
└────┴───────────┴──────────┴───────────┴───────────┴────────────┴──────────┴───────────┘
07/14-09:13 :)