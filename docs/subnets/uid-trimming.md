---
title: "UID Trimming"
---

# UID Trimming

UID trimming is a subnet management feature that allows subnet owners to reduce the number of neuron UIDs registered on their subnet, compressing the remaining UIDs to maintain consecutive indexing. UID trimming safely preserves high-performing and immune neurons,

:::info UID trimming rate limit
The chain's trim UID rate limit is 216,000 blocks (~30 days). Therefore, subnet owners can only make changes to their UID count every 30 days.

See [Rate Limits in Bittensor](../learn/chain-rate-limits.md).
:::

- **Preserves Immune UIDs**: Both temporally immune UIDs and owner-owned UIDs are protected from trimming
- **Emission-Based Selection**: UIDs are trimmed based on their emission scores, removing the lowest performers
- **UID Compression**: After trimming, remaining UIDs are compressed to the left to maintain consecutive indexing
- **Storage Migration**: All associated storage is properly migrated and cleaned up
- **Configurable Limits**: Subnet owners can set minimum and maximum allowed UID counts

:::info

- The minimum UID count to which subnet owners can trim is currently 64.
- The maximum number of immune UIDs must not exceed 80% of the maximum UID count.
  :::

## Emission-Based Selection

UIDs are sorted by their emission scores in descending order. The trimming process:

1. **Identifies Low Performers**: Starts from the lowest emitters and works upward
2. **Skips Immune UIDs**: Bypasses any UIDs that are temporally or owner immune
3. **Respects Limits**: Ensures the final count doesn't exceed the maximum allowed UIDs

## For Subnet Owners

Subnet trim UIDs using [`btcli sudo trim`](#uid-trimming-with-btcli) or the `sudo_trim_to_max_allowed_uids` extrinsic.

**What happens:**

- Owner-controlled UIDs are protected
- Recently registered UIDs (within immunity period) are protected
- UIDs with the lowest emission scores are removed first
- Remaining UIDs are compressed to maintain consecutive indexing
- All associated data (weights, bonds, etc.) is properly migrated

## For Miners and Validators

### Protection from Trimming

You are protected from trimming if you have:

1. **Temporal Immunity**: You registered recently (within the subnet's immunity period)
2. **Owner Immunity**: Your UID is owned by the subnet owner (up to a configurable limit)
3. **High Emissions**: Only low emissions neurons can be trimmed.

### What Happens When Your UID Gets Trimmed

When your UID is trimmed, all of your neuron data is **permanently deleted** from the blockchain, including:

- UID-to-hotkey mapping
- Block registration timestamp
- Emission (incentive and dividends) history
- All weights you set to other neurons (Validators only)
- All bonds other neurons (Validators) had to you (Miners)
- Axon information (IP, port, etc.)
- Neuron certificates
- Prometheus metrics
- Last update timestamps

**Your UID number will be reassigned** - the remaining UIDs are compressed to maintain consecutive numbering (e.g., if UIDs 5, 7, 9 remain after trimming, they become UIDs 0, 1, 2).

### After Trimming

If your UID was trimmed:

- You must re-register to participate again
- You will receive a new UID number
- You start fresh with default scores

### Source Code References

- **Core Implementation**: `subtensor/pallets/subtensor/src/subnets/uids.rs`

## UID trimming with BTCLI

The `btcli sudo trim` command allows subnet owners to reduce the number of active UIDs on their subnet by trimming excess UIDs down to a specified maximum limit.

:::warning Subnet Owner Only
This is a **sudo operation** that can only be performed by the subnet owner (the wallet that created the subnet).
:::

### Basic usage

```shell
btcli sudo trim --netuid <NETUID> --max <MAX_UIDS>
```

### Example


To trim subnet 14 on a local chain to a maximum of 100 UIDs:

```shell
btcli sudo trim --netuid 14 --max 100
```
```                                                                                                       
You are about to trim UIDs on SN3 to a limit of 100 [y/n] (n): y
✅ Successfully trimmed UIDs on SN3 to 100
```

The command will:

1. Verify that your wallet owns the specified subnet
2. Display a confirmation prompt showing the trim operation details
3. Execute the trim operation if confirmed
4. Display the result of the operation

:::note Transaction Fees
UID trimming operations incur transaction fees for the underlying blockchain transactions they trigger. See [Transaction Fees in Bittensor](../learn/fees.md) for details.
:::
