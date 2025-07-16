---
title: "Provision Wallets for Local Deploy"
---

This page continues the previous tutorial for local Bittensor development.

Now that your local Subtensor chain is deployed, you can provision wallets to serve the roles of subnet creator, miner and validator, to populate your local Bittensor ecosystem.

Every local blockchain is pre-provisioned with an "Alice" account, which is loaded with one million $\tau$.

## Access the Alice account

To access the handy pre-provisioned development "Alice" account on your local chain, use:

```shell
btcli wallet create --uri alice
```

Next, you will be prompted to configure the wallet by setting a name for the wallet's coldkey and hotkey.

:::tip
To access the 'Alice' wallet, you must use the assigned coldkey name and include the local subtensor chail URL as shown

```sh
btcli wallet balance --wallet.name alice --network ws://127.0.0.1:9945
```

The following should be returned in the console:

```console
                                                                       Wallet Coldkey Balance
                                                                          Network: custom

    Wallet Name     Coldkey Address                                     Free Balance      Staked Value              Total Balance
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    alice           5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY   1,000,000.0000 τ       0.0000 τ              1,000,000.0000 τ


    Total Balance                                                      1,000,000.0000 τ       0.0000 τ              1,000,000.0000 τ
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

:::

## Provision wallets

You will need wallets for the different personas, i.e., subnet owner, subnet validator and subnet miner, in the subnet.

- The owner wallet creates and controls the subnet.
- The validator and miner will be registered to the subnet created by the owner. This ensures that the validator and miner can run the respective validator and miner scripts.

### Create a coldkey-only wallet for the subnet creator role (they do not need a hotkey):

```bash
btcli wallet new_coldkey \
--wallet.name sn-creator
```

### Set up the miner's wallet with a coldkey and hotkey:

```bash
btcli wallet new_coldkey \
--wallet.name miner
```

```bash
btcli wallet new_hotkey \
--wallet.name miner \
--wallet.hotkey default

```

### Set up the validator's wallet with a coldkey and hotkey:

```bash
btcli wallet new_coldkey \
--wallet.name validator
```

```bash
btcli wallet new_hotkey \
--wallet.name validator \
--wallet.hotkey default
```
