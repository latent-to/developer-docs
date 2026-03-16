---
title: "Batch Transactions"
---

# Batch Transactions

The Bittensor runtime's utility pallet exposes three extrinsics — `batch`, `batch_all`, and `force_batch` — that let you submit multiple calls as a single on-chain transaction. This is useful when you want to stake to multiple hotkeys, perform multiple operations atomically, or reduce the number of round-trips to the chain.

For how fees are calculated across a batch. See [Batch Transaction Fees](./fees#batch-transaction-fees).

## `batch` vs `batch_all` vs `force_batch`

The three variants differ only in how they handle errors. Choose based on whether partial success is acceptable:

| Extrinsic | On error |
|---|---|
| `batch` | Stops at first failure; prior calls succeed. Emits `BatchInterrupted`. |
| `batch_all` | Reverts all calls atomically on any failure. |
| `force_batch` | Continues past failures; failed calls are skipped. |

Use `batch_all` when all inner calls must succeed or none should. Use `batch` if partial success is acceptable, or `force_batch` to continue past failures.

**Source code:** `batch` [`pallets/utility/src/lib.rs:197–201`](https://github.com/opentensor/subtensor/blob/main/pallets/utility/src/lib.rs#L197-L201), `batch_all` [`pallets/utility/src/lib.rs:309–313`](https://github.com/opentensor/subtensor/blob/main/pallets/utility/src/lib.rs#L309-L313), `force_batch` [`pallets/utility/src/lib.rs:408–412`](https://github.com/opentensor/subtensor/blob/main/pallets/utility/src/lib.rs#L408-L412).

## Using batch calls with the SDK


The SDK's `add_stake_multiple` and `unstake_multiple` send individual extrinsics sequentially, not a single batch extrinsic.

To submit a true batch (one extrinsic on-chain), use the low-level `compose_call` + `sign_and_send_extrinsic` path directly.


```python
import bittensor as bt

sub = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="my_wallet", hotkey="my_hotkey")
wallet.unlock_coldkey()

hotkey_1 = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
hotkey_2 = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
netuid = 1
amount = bt.Balance.from_tao(10)

# Compose each inner call individually
call_1 = sub.compose_call(
    call_module="SubtensorModule",
    call_function="add_stake",
    call_params={
        "hotkey": hotkey_1,
        "netuid": netuid,
        "amount_staked": amount.rao,
    },
)
call_2 = sub.compose_call(
    call_module="SubtensorModule",
    call_function="add_stake",
    call_params={
        "hotkey": hotkey_2,
        "netuid": netuid,
        "amount_staked": amount.rao,
    },
)

# Wrap in a Utility.batch_all — reverts all calls atomically on any failure
batch_call = sub.compose_call(
    call_module="Utility",
    call_function="batch_all",
    call_params={"calls": [call_1, call_2]},
)

# Submit the batch as a single extrinsic
success, error_message = sub.sign_and_send_extrinsic(
    call=batch_call,
    wallet=wallet,
    wait_for_inclusion=True,
    wait_for_finalization=False,
)
print(f"Success: {success}" if success else f"Failed: {error_message}")
```

:::note `add_stake_multiple` is not a batch extrinsic
`subtensor.add_stake_multiple()` and `subtensor.unstake_multiple()` loop over their inputs and submit one extrinsic per hotkey. Each transaction is settled independently — they are not atomic. Use the `Utility.batch_all` pattern above when you need all-or-nothing semantics or want to pay a single transaction fee for the group.
:::

