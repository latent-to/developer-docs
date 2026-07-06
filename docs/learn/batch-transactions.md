---
title: "Batch Transactions"
---

import { ProxyColdkeyWarning } from "../keys/\_proxy-warning.mdx";

# Batch Transactions

The Bittensor runtime's utility pallet exposes three extrinsics: `batch`, `batch_all`, and `force_batch`, which enable multiple calls to be submitted as a single on-chain transaction. This is useful when you want to stake to multiple hotkeys, perform multiple operations atomically, or reduce the number of round-trips to the chain.

For how fees are calculated across a batch. See [Batch Transaction Fees](./fees#batch-transaction-fees).

## `batch` vs `batch_all` vs `force_batch`

The three variants differ only in how they handle errors. Choose based on whether partial success is acceptable:

| Extrinsic     | On error                                                               |
| ------------- | ---------------------------------------------------------------------- |
| `batch`       | Stops at first failure; prior calls succeed. Emits `BatchInterrupted`. |
| `batch_all`   | Reverts all calls atomically on any failure.                           |
| `force_batch` | Continues past failures; failed calls are skipped.                     |

:::info
Use `batch_all` when all inner calls must succeed or none should. Use `batch` if partial success is acceptable, or `force_batch` to continue past failures.
:::

**Source code:** `batch` [`pallets/utility/src/lib.rs:197–201`](https://github.com/RaoFoundation/subtensor/blob/main/pallets/utility/src/lib.rs#L197-L201), `batch_all` [`pallets/utility/src/lib.rs:309–313`](https://github.com/RaoFoundation/subtensor/blob/main/pallets/utility/src/lib.rs#L309-L313), `force_batch` [`pallets/utility/src/lib.rs:408–412`](https://github.com/RaoFoundation/subtensor/blob/main/pallets/utility/src/lib.rs#L408-L412).

## Using batch calls with the SDK

<ProxyColdkeyWarning />

The SDK's `add_stake_multiple` and `unstake_multiple` send individual extrinsics sequentially, not a single batch extrinsic.

To submit multiple stake actions as an atomic batch (one extrinsic on-chain), use the low-level pallet builder + `proxy` path. The batch call is wrapped in a proxy extrinsic signed by your proxy wallet.

:::note Proxy type for batch calls
The `Staking` proxy type is an allowlist of specific staking extrinsics. It does not permit `Utility::batch_all` as the outer call, so batch staking via a `Staking` proxy will fail with `CallFiltered`. Use a `NonTransfer` proxy for batch staking. `NonTransfer` blocks only balance transfers and coldkey swaps, allowing everything else including batch wrappers. `NonCritical` also works but is more permissive than most users need.
:::

```python
import os
import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

sub = bt.Subtensor(network="test")
proxy_wallet = bt.Wallet(name=os.environ['BT_PROXY_WALLET_NAME'])
real_account_ss58 = os.environ['BT_REAL_ACCOUNT_SS58']

hotkey_1 = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
hotkey_2 = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
netuid = 1
amount = bt.Balance.from_tao(10)

pallet = SubtensorModule(sub)
call_1 = pallet.add_stake(netuid=netuid, hotkey=hotkey_1, amount_staked=amount.rao)
call_2 = pallet.add_stake(netuid=netuid, hotkey=hotkey_2, amount_staked=amount.rao)

# Wrap in a Utility.batch_all to revert all calls atomically on any failure
batch_call = sub.compose_call(
    call_module="Utility",
    call_function="batch_all",
    call_params={"calls": [call_1, call_2]},
)

# Submit via proxy — Staking proxy type cannot wrap batch calls, use NonTransfer
response = sub.proxy(
    wallet=proxy_wallet,
    real_account_ss58=real_account_ss58,
    force_proxy_type=ProxyType.NonTransfer,
    call=batch_call,
)
print(response)
```

:::note `add_stake_multiple` is not a batch extrinsic
`subtensor.add_stake_multiple()` and `subtensor.unstake_multiple()` loop over their inputs and submit one extrinsic per hotkey. Each transaction is settled independently, i.e., they are not atomic. Use the `Utility.batch_all` pattern above when you need all-or-nothing semantics or want to pay a single transaction fee for the group.
:::
