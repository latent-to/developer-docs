---
title: Managing User Liquidity Positions Tutorial
---

In this tutorial we will explore the behavior of liquidity positions. To facilitate this, we'll deploy a Subtensor blockchain locally and create a subnet on it.


## Prerequisites

- Deploy a Bittensor (Subtensor) blockchain locally.
	See: [Deploy a Local Bittensor Blockchain Instance]()
	Or try the easy way, by running: 
	```bash
	docker run --rm --name test_local_chain_ -p 9944:9944 -p 9945:9945 ghcr.io/opentensor/subtensor-localnet:devnet-ready
	```
- Provision coldkey and hotkey for your subnet creator and access funds from the Alice account
	See: [Provision Wallets for Local Deploy]()

- Create a Subnet
	See: [Create a Subnet (Locally)]()
	1. Create a subnet-create wallet



  btcli s start --netuid 2 --network ws://127.0.0.1:9945


## Managing positions


First, create and fund an additional wallet for the LP manager.

```shell
btcli w create --wallet.name liquidity-manager --hotkey lp-hotkey
```
```
btcli wallet transfer \
--amount 1001 \
--wallet.name alice \
--destination "5F.." \ # Coldkey public key for your liquidity-manager wallet
--network ws://127.0.0.1:9945
```


## Enable liquidity positions on the subnet

By default, liquidity 





stake a small amount 





### Adding a liquidity position

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