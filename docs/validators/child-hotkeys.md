---
title: "Child Hotkeys"
toc_max_heading_level: 2
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Child Hotkeys

This guide describes the **child hotkeys** feature and how to use it. With the child hotkeys, a subnet validator is no longer required to use the same delegate hotkey for every subnet they validate in. The subnet validator can use a separate **child hotkey** per subnet. The subnet validator does this by re-delegating a portion of their stake from their delegate hotkey to this separate child hotkey on a subnet. The originating delegate hotkey is called the **parent hotkey**.

The owner of this child hotkey would then validate in the subnet on behalf of the parent hotkey. The child hotkey would receive a percentage `take` from the resulting dividends.

<center>
<ThemedImage
alt="Coldkey and hotkey pairings"
sources={{
    light: useBaseUrl('/img/docs/child-hotkey-fig1.svg'),
    dark: useBaseUrl('/img/docs/dark-child-hotkey-fig1.svg'),
}}
style={{width: 750}}
/>
</center>

<br />

See the above diagram. Without the child hotkeys, a subnet validator's delegate hotkey would have to sign all the validation operations in all the subnets. This exposes the delegate hotkey in all the subnets. An attacker can get hold of the delegate hotkey from any one subnet in order to take over the validation operations with this hotkey, thereby crippling this subnet validator in all their subnets across the entire Bittensor network.

<center>
<ThemedImage
alt="Coldkey and hotkey pairings"
sources={{
    light: useBaseUrl('/img/docs/fig2-child-hotkey.svg'),
    dark: useBaseUrl('/img/docs/dark-fig2-child-hotkey.svg'),
}}
style={{width: 800}}
/>
</center>

See the above diagram. With the child hotkeys, if an attacker steals a child hotkey, then only those subnets are at risk where this child hotkey is used as the delegate hotkey.

## Benefits of child hotkeys

- **Security for parent hotkeys**: Re-delegating stake to multiple child hotkeys enhances the security of the parent hotkey. Each child hotkey can validate on a specific subnet using a different machine. The child hotkey would sign the validation operations on behalf of the parent hotkey: There is no need to use the parent hotkey on any of these subnets. As a consequence, the exposure of the parent hotkey can be minimized. The parent hotkey can even be moved to a secure location until it is needed, for example, to revoke a child hotkey.
- **Validators can easily scale up**: As Bittensor scales up towards hundreds of subnets, it is not practical for a single delegate to validate in every single subnet. With child hotkeys, a validator can easily make this feasible by re-delegating and offloading the validating operations to multiple child hotkeys.
- **Increased bandwidth for a subnet owner**: A validator can also re-delegate to a subnet owner's hotkey. The subnet owner would then do the validation work on the subnet, in exchange for a percentage `take` from the resulting dividends. A subnet owner can increase their access bandwidth into their own subnet in this way.
- A child hotkey and a parent hotkey need not be owned by the same entity.
- A validator can re-delegate to a hotkey of any other validator on any subnet. After re-delegation, the hotkey that is the source of the stake is called **parent hotkey** and the hotkey that receives this re-delegated stake is called **child hotkey**.
  :::tip "Child hotkey" and "parent hotkey" are terms of convenience
  The terms "child hotkey" and "parent hotkey" are only terms of convenience. There is nothing inherently different about a "child hotkey" that separates it from a "parent hotkey". Neither have any special attributes compared to a normal hotkey.
  :::

## Features

The child hotkey features are as follows:

- A hotkey must be registered on a subnet before it can be used as a parent hotkey. The hotkey can be registered on any subnet.
- A parent hotkey can have multiple child hotkeys. Similarly, a child hotkey can have more than one parent hotkey.
- A child hotkey can exist as a registered hotkey in multiple netuids simultaneously.
- **IMPORTANT**: For a given `netuid`, say, `netuid 5`, a single parent hotkey can have at most five (`5`) child hotkeys. Moreover, the same parent hotkey on a different `netuid 11` can have another set of `5` child hotkeys. Alternately, on this `netuid 11` the same parent hotkey can also have the same (`5`) child hotkeys that are in the netuid `5`.
- While setting the child hotkeys, the proportion field can have proportions that add to less than `1.0`. The proportion that was not assigned to the child hotkeys will remain with the parent hotkey. However, a proportion cannot be zero. A `0` proportion value will result in an error. Furthermore, in a given subnet, the sum of all proportions must not exceed `1.0`.

## Rate limits

The following rate limits apply for child hotkeys:

- Setting or revoking children is allowed for every 150 blocks (~30 minutes).
- A given child hotkey's take rate can only be adjusted once per 30 days.

See [Rate Limits in Bittensor: Child hotkey operations rate limit](../learn/chain-rate-limits#child-hotkey-operations-rate-limit).

## Minimum stake requirement

To set child hotkeys, the parent hotkey must have a minimum total stake. This requirement checks the TAO-equivalent value of your alpha stake across all subnets.

The minimum stake requirement is:

- **Mainnet**: 1000 TAO worth of alpha
- **Testnet**: 100 TAO worth of alpha

**How it's calculated**: Your alpha stake is summed **across ALL subnets** (not just the subnet where you're setting children). Each subnet's alpha is converted to TAO value using that subnet's alpha price, then all values are summed together. View [source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/helpers.rs#L47-L62).

:::tip
Query `subtensorModule.stakeThreshold()` to check the current threshold.
:::

## Child hotkey commands

Use the `btcli` command options described below to work with child hotkeys.

## Setting a child hotkey

You can allocate a portion of the parent hotkey’s stake weight to its child hotkeys, specifying the exact proportion for each one. The parent hotkey must be registered on at least one netuid, but it doesn’t have to be registered on the same netuid where the child weights are being set. However, all child hotkeys assigned must be registered on the netuid specified in the command.

### Usage

```bash
btcli stake child set --netuid <netuid> --children <a list of SS58 child hotkeys>  --proportions <a list of decimal numbers> --hotkey <parent hotkey> --wallet.name <coldkey>
```

### Parameters

- `--netuid:` The netuid of the subnet in the network. Value must be greater than zero.
- `--children`: A comma-separated ordered list of SS58 hotkeys for the child hotkeys.
- `--proportions`: A comma-separated ordered list of the stake weight proportions for the child hotkeys listed in the `--children` parameter.
- `--hotkey`: A single SS58 of the parent hotkey. This must be a delegate hotkey that is already registered in with any `netuid`.
- `--wallet.name`: Name of the wallet or the SS58 of the coldkey. This coldkey must be matched with the parent hotkey SS58 of the `--hotkey`.

:::info

- The `--children` and `--proportions` parameters can each include up to five comma-separated values.
- The sum of all proportion values for the child hotkeys should be less than or equal to 1.
- All hotkeys listed in the `--children` parameter must be already registered on the `netuid` used in this command.
- Only the staked TAO of the parent hotkey can be assigned to the child hotkeys. If the parent hotkey has zero stake, then the command will issue an error message and stop.

  :::

#### Setting a single child hotkey

```bash
btcli stake child set \
  --netuid 4 \
  --children 5HEXVAHY9gyavj5xnbov9Qoba4hPJYkkwwnq1MQFepLK7Gei \
  --proportions 0.5 \
  --hotkey 5DqJdDLU23m7yf6rZSmbLTshU7Bfn9eCTBkduhF4r9i73B9Y \
  --wallet.name Alice
```

#### Setting multiple child hotkeys

```bash
btcli stake child set \
  --netuid 4 \
  --children 5Gx1CZ9jviC6V2KynBAcTpES4yK76riCagv5o5SFFZFYXj4s,5HEXVAHY9gyavj5xnbov9Qoba4hPJYkkwwnq1MQFepLK7Gei \
  --proportions 0.3,0.7 \
  --hotkey 5DqJdDLU23m7yf6rZSmbLTshU7Bfn9eCTBkduhF4r9i73B9Y \
  --wallet.name Alice\
```

## Adding a new child hotkey

If a parent hotkey has, for example, three child hotkeys: `child hotkey A`, `child hotkey B` and `child hotkey C`, then to add a fourth—`child hotkey D`, you must run `btcli stake child set` command again with the parent hotkey and set the proportions for all four child hotkeys `A`, `B`, `C` and `D`.

:::info Updating hotkey proportions
When updating the proportion of a child hotkey, you must rerun the `btcli stake child set` command with the parent hotkey and all existing child hotkeys, including their updated proportions.

:::

## Getting the child hotkeys

Run the following command to display all the child hotkeys for a given parent hotkey.

```bash
btcli stake child get
```

### Example usage

```bash
btcli stake child get --netuid <netuid> --hotkey <parent hotkey> --all
```

## Revoking the child hotkeys

This is used to remove delegated authority from all child hotkeys, removing their position and influence on the subnet.

:::info Revoking a specific child hotkey is not allowed
It is not possible to revoke a specific child hotkey. However, if a parent hotkey has, for example, three child hotkeys: `child hotkey A`, `child hotkey B` and `child hotkey C`, then setting the parent hotkey again with only child hotkeys `A` and `B` will result in revoking `child hotkey C`.
:::

### Usage

```bash
btcli stake child revoke
```

### Example

```bash
btcli stake child revoke \
  --netuid 4 \
  --hotkey 5DqJdDLU23m7yf6rZSmbLTshU7Bfn9eCTBkduhF4r9i73B9Y \
  --wallet.name Alice
```

## Get and set child hotkey take

Each child hotkey can have a defined take percentage that determines the portion of rewards it receives on a given netuid. The take value can range from `0` (0%) to `0.18` (18%). This configuration is subnet-specific meaning that a child hotkey may have one take percentage on one netuid and a different value on another.

The child hotkey can also set its delegate take separately from the child hotkey take. That is, a child hotkey can carry two separate take rates: the child hotkey take rate and the delegate take rate. For the delegate take rate, see [Set delegate take](../btcli/btcli.md#btcli-sudo-set-take).

### Usage

```bash
btcli stake child take
```

:::info
Running the command without the `--take` flag only retrieves the child hotkey's take on the subnet. To set the child hotkey take, you must run the command with the `--take` flag.
:::

To set child hotkey take, run the following command:

```bash
btcli stake child take \
  --netuid <netuid> \
  --child-hotkey-ss58 <child hotkey> \
  --take <decimal number> \
  --wallet.name <coldkey>
```

### Parameters

- `--child-hotkey-ss58 `: A single SS58 of the child hotkey. If not provided, it assigns the take value to the hotkey of the signing wallet.
- `--take`: A value between `0` (0%) and `0.18` (18%). Default value is `0`.
- `--netuid`: The `netuid` in which this child hotkey's `take` is applicable. Note that a child hotkey's `take` is subnet-specific, i.e., a child hotkey can have one `take` in one `netuid` and a different `take` in another `netuid`.

### Example

```bash
btcli stake take child take \
  --netuid 4 \
  --hotkey 5DqJdDLU23m7yf6rZSmbLTshU7Bfn9eCTBkduhF4r9i73B9Y \
  --take 0.09 \
  --wallet.name Alice
```
