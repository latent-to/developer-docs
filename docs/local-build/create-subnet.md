---
title: "Create a Subnet (Locally)"
---

# Create a Subnet (Locally)

This page covers creating a subnet on a locally deployed Subtensor blockchain, which is useful for local Bittensor development.

For creating a subnet on Bittensor test and main network, see [Create a Subnet](../subnets/create-a-subnet).

## Prerequisites

Before continuing with the rest of this tutorial, make sure you've completed the following:

- [Deploy a Subtensor chain locally](./deploy)
- [Provision wallets for the subnet creator, miner, and validator users for this tutorial.](./provision-wallets)
- Sufficient amount of TAO in your subnet creator wallet to cover the [burn cost](../resources/glossary.md#burn-cost).

## Create a subnet

Now, let us create a new subnet on the local chain. To create a new subnet, run the following command in your terminal:

```shell
btcli subnet create \
--subnet-name awesome-first-subnet \
--wallet.name sn-creator \
--wallet.hotkey default \
--network ws://127.0.0.1:9945
```

:::info
When running a local chain in fast-blocks mode, we recommend using the `--no-mev-protection` flag when executing this command.
:::

You will then be prompted to provide the wallet hotkey as well as configure the subnet as shown:

```console
Subnet burn cost: τ 1,000.0000
Your balance is: τ 1,001.0000
Do you want to burn τ 1,000.0000 to register a subnet? [y/n]:y
Enter your password:
Decrypting...
🌏  📡 Registering subnet..
```

To check on your newly created subnets, run the following command in your terminal:

```shell
btcli subnet list --network ws://127.0.0.1:9945
```

A list of all subnets in your local subtensor instance is returned:

```console
                                                         Subnets
                                                     Network: custom
        ┃             ┃ Price       ┃ Market Cap  ┃              ┃ P (τ_in,    ┃ Stake        ┃             ┃
 Netuid ┃ Name        ┃ (τ_in/α_in) ┃ (α * Price) ┃ Emission (τ) ┃ α_in)       ┃ (α_out)      ┃ Supply (α)  ┃ Tempo (k/n)
━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━
   0    │ τ root      │ 1.0000 τ/Τ  │ τ 0.00      │ τ 0.0000     │ -, -        │ Τ 0.00       │ 0.00 Τ /21M │ -/-
   2    │ β           │ 0.0000 τ/β  │ τ 1.00k     │ τ 0.0000     │ τ 1.00k,    │ 0.00 β       │ 1.00k β     │ 29/360
        │ awesome-fi… │             │             │              │ 1.00k β     │              │ /21M        │
   1    │ α apex      │ 0.0000 τ/α  │ τ 11.00     │ τ 0.0000     │ τ 10.00,    │ 1.00 α       │ 11.00 α     │ 29/100
        │             │             │             │              │ 10.00 α     │              │ /21M        │
────────┼─────────────┼─────────────┼─────────────┼──────────────┼─────────────┼──────────────┼─────────────┼─────────────
   4    │             │ τ 1.0       │             │ τ 0.0        │ τ           │              │             │
        │             │             │             │              │ 2.01k/29.00 │              │             │
        │             │             │             │              │ (6931.03%)  │              │             │
```

### Subnet creation cost

The cost for subnet creation is dynamic; it lowers gradually and doubles every time a subnet is created.

:::info
Note that this is labeled "burn cost", even though technically the cost of subnet creation is _recycled_, rather than _burned_.

See: [Glossary: Recycling and Burning](../resources/glossary#recycling-and-burning)
:::

## Start emissions on the subnet

To activate your subnet, beginning emissions and allowing staking, run:

```
btcli subnet start --netuid NETUID \
--wallet.name sn-creator \
--network ws://127.0.0.1:9945
```

Replace `NETUID` with the netuid of the subnet you want to enable emissions on.

After a while, you can confirm that the subnet's emissions have started by inspecting your subnet's token economy. You'll see a non-zero amount in the *Emission* column, indicating the subnet creator key accumulates emissions.

You can confirm the emissions by running the `btcli subnets list` command:

```console
                                                         Subnets
                                                     Network: custom
        ┃             ┃ Price       ┃ Market Cap  ┃              ┃ P (τ_in,    ┃ Stake        ┃             ┃
 Netuid ┃ Name        ┃ (τ_in/α_in) ┃ (α * Price) ┃ Emission (τ) ┃ α_in)       ┃ (α_out)      ┃ Supply (α)  ┃ Tempo (k/n)
━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━
   0    │ τ root      │ 1.0000 τ/Τ  │ τ 0.00      │ τ 0.0000     │ -, -        │ Τ 0.00       │ 0.00 Τ /21M │ -/-
   2    │ β           │ 1.0000 τ/β  │ τ 1.81k     │ τ 1.0000     │ τ 1.00k,    │ 414.00 β     │ 1.81k β     │ 29/360
        │ awesome-fi… │             │             │              │ 1.00k β     │              │ /21M        │
   1    │ α apex      │ 0.0000 τ/α  │ τ 11.00     │ τ 0.0000     │ τ 10.00,    │ 1.00 α       │ 11.00 α     │ 29/100
        │             │             │             │              │ 10.00 α     │              │ /21M        │
────────┼─────────────┼─────────────┼─────────────┼──────────────┼─────────────┼──────────────┼─────────────┼─────────────
   4    │             │ τ 1.0       │             │ τ 1.0        │ τ           │              │             │
        │             │             │             │              │ 1.41k/562.00│              │             │
        │             │             │             │              │ (6931.03%)  │              │             │
```

## Troubleshooting

### Insufficient funds

The coldkey signing the `subnet create` transaction must have a sufficient $\tau$ balance to cover the burn cost of subnet creation, so called because the funds cannot be recovered.

```console
Subnet burn cost: τ 1,000.0000
Your balance of: τ 0.0000 is not enough to burn τ 1,000.0000 to register a subnet.
```

To fix this, transfer TAO from the Alice account to cover this transaction and try again. For more information, see [Transfer TAO to wallets](./provision-wallets.md#transfer-tao-to-wallets).

## Next steps

With emissions now active on your subnet, you can begin registering and running miners and validators to participate in the network.
