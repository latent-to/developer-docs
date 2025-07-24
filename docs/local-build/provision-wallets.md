---
title: "Provision Wallets for Local Deploy"
---

This page continues the previous tutorial for local Bittensor development.

Now that your local Subtensor chain is deployed, you can provision wallets to serve the roles of subnet creator, miner and validator, to populate your local Bittensor ecosystem.

Every local blockchain is pre-provisioned with an "Alice" account, which is loaded with one million $\tau$.

## Prerequisites

To follow along with the rest of this tutorial, ensure that you have a local chain running. To set up a local chain, see [Create a local blockchain instance](./deploy.md).

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

- The subnet owner wallet creates and controls the subnet.
- The validator and miner will be registered to the subnet created by the owner. This ensures that the validator and miner can run the respective validator and miner scripts.

To create a wallet, run the following command in your terminal:

```bash
btcli wallet create \
--wallet.name WALLET_NAME \
--hotkey WALLET_HOTKEY \
--network ws://127.0.0.1:9945
```

Replace `WALLET_NAME` and `WALLET_HOTKEY` with the appropriate identifiers for each role—subnet creator, miner, or validator.

### Transfer TAO to wallets

After creating your wallets, transfer some TAO from the `Alice` account to them to cover the transaction fees required for onchain operations. To transfer TAO, run the following command in your terminal:

```sh
btcli wallet transfer \
--wallet.name alice \
--destination DESTINATION_ADDRESS \
--network ws://127.0.0.1:9945
```

Replace `DESTINATION_ADDRESS` with the wallet address you want to send the TAO to.

:::info
Run the `btcli wallets list` command and carefully check the ss58 address of the destination coldkey that you want to fund.
:::
