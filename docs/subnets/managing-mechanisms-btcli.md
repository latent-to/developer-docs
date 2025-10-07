---
title: "Managing Multiple Incentive Mechanisms with BTCLI"
---

# Managing Multiple Incentive Mechanisms with BTCLI

This tutorial shows how to configure and manage multiple incentive mechanisms in a single subnet using BTCLI.

For a discussion of the background concepts, see [Understanding Multiple Incentive Mechanisms](understanding-multiple-mech-subnets).

See also: [Managing Mechanisms with SDK](managing-mechanisms-with-sdk).

:::tip Hot new feature
Multiple incentive mechanisms per subnet is a new feature that is still in development. It's initial release on mainnet is expected the week of September 22. In the meantime, it can be experimented with using a locally run chain.

See [Announcements](../learn/announcements) for updates.
:::

**Prerequisites**
- A local Subtensor chain running. See: [Run a Local Bittensor Blockchain Instance](../local-build/deploy)
- A local subnet created (and emissions started). See: [Create a Subnet (Locally)](../local-build/create-subnet)
- Wallets provisioned and funded for local development. See: [Provision Wallets](../local-build/provision-wallets)
- BTCLI installed (development version required for mechanism commands)

:::tip
Substitute your subnet's netuid, which you can find with `btcli subnet list`.
:::

:::warning Runtime limit
As of the current Subtensor runtime, a subnet can have a maximum of 2 mechanisms. Attempts to set a higher count will be rejected by the chain (runtime enforces `MaxMechanismCount = 2`).

:::

## Check initial state

The following command will check the count of your subnet's incentive mechanisms and display the emissions split among them.


```bash
btcli subnet mech count --netuid 6 --network local
btcli subnet mech emissions --netuid 6 --network local
```
```
Subnet 6 currently has 1 mechanism.
(Tip: 1 mechanism means there are no mechanisms beyond the main subnet)

Subnet 6 only has the primary mechanism (mechanism 0). No emission split to display.
```

## Create a second mechanism

Create a second incentive mechanism by specifying the desired  count as two for your subnet.

```bash
btcli subnet mech set --mech-count 2 --netuid 6 --network local
```
```
Subnet 6 currently has 1 mechanism. Set it to 2? [y/n]: y
✅ Mechanism count set to 2 for subnet 6
```


Check the state to confirm the change

```bash
btcli subnet mech count --netuid 6 --network local
btcli subnet mech emissions --netuid 6 --network local
```
```
Subnet 6 currently has 2 mechanisms.
(Tip: 1 mechanism means there are no mechanisms beyond the main subnet)
[13:44:15] Warning: Verify your local subtensor is running on port 9944.                         subtensor_interface.py:85

           Subnet 6 • Emission split
                Network: local

  Mechanism Index   Weight (u16)    Share (%)
 ─────────────────────────────────────────────
         0                 32768    50.000763
         1                 32767    49.999237
       Total               65535   100.000000
 ─────────────────────────────────────────────


Totals are expressed as a fraction of 65535 (U16_MAX).
No custom split found; displaying an even distribution.
```


## Set a custom 90/10 emission split

Let's allocate only 10% of our subnet's emissions to the second subnet.


```bash
btcli subnet mech emissions-split --netuid 6 --network local --split "90,10" --wallet-name alice
```
```
           Subnet 6 • Emission split
                Network: local

  Mechanism Index   Weight (u16)    Share (%)
 ─────────────────────────────────────────────
         0                 32768    50.000763
         1                 32767    49.999237
       Total               65535   100.000000
 ─────────────────────────────────────────────


Totals are expressed as a fraction of 65535 (U16_MAX).
No custom split found; displaying an even distribution.

            Proposed emission split
                   Subnet 6

  Mechanism Index   Weight (u16)    Share (%)
 ─────────────────────────────────────────────
         0                 58982    90.000000
         1                  6553    10.000000

       Total               65535   100.000000
 ─────────────────────────────────────────────


Proceed with these emission weights? [y/n] (y): y
🌍  📡 Setting emission split for subnet 6...
✅ Emission split updated for subnet 6
```


We can confirm this by running the getter command again:

```bash
btcli subnet mech emissions --netuid 6 --network local
```
```

           Subnet 6 • Emission split
                Network: local

  Mechanism Index   Weight (u16)    Share (%)
 ─────────────────────────────────────────────
         0                 58982    90.000763
         1                  6553     9.999237
       Total               65535   100.000000
 ─────────────────────────────────────────────


Totals are expressed as a fraction of 65535 (U16_MAX).
```

## Troubleshooting

- Rate limiting: mechanism count changes are restricted (on mainnet) to once per ~24 hours (7200 blocks). See [Rate Limits in Bittensor](../learn/chain-rate-limits.md).
- Permissions: emission split and count updates require the subnet owner wallet.
- Local chain connectivity: ensure your local chain is running and the `network` parameter in your BTCLI config is set to `local`.
