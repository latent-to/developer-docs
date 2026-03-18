---
title: "Transaction Fees in Bittensor"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Transaction Fees in Bittensor

This page describes the blockchain transaction fees charged by Bittensor and shows how to estimate them before running transactions.

Many extrinsic transactions that change the state of the blockchain are subject to a fee based on a combination of weight (computational load) and length (storage load).

Staking and unstaking operations incur this fee as well as amount-based **swap fees** of 0.05% of the transacted liquidity.

Reading the state of the chain is always free.

This page also covers:
- The [alpha fallback](#alpha-fallback) mechanism, whereby transaction fees are paid in alpha when a wallet's TAO balance is insufficient
- [Fee-free extrinsics](#fee-free-extrinsics).
- [Fees for proxy calls](#proxy-call-fees)
- [Fees for batch transactions](#batch-transaction-fees)
- [Estimating fees](#estimating-fees)
- [Example: Fees in the lifecycle of a transaction](#example-fees-in-the-lifecycle-of-a-transaction)

## General Transaction Fees

Each fee-bearing extrinsic is charged two components, both paid from the sender’s TAO free balance and recycled (deducted from `TotalIssuance`; see [Recycling and Burning](../resources/glossary#recycling-and-burning)):

- **Weight fee** — proportional to compute time ([weight](https://docs.polkadot.com/polkadot-protocol/glossary/#weight); specifically the `ref_time` component, in picoseconds). Calculated as $\text{weight} \times (50{,}000 / 10^9)$ rao.

- **Length fee** — 1 rao per byte of the encoded extrinsic.

$\text{Total transaction fee} = \text{weight fee} + \text{length fee}$

Extrinsics that are [fee-free](#fee-free-extrinsics) (e.g. `set_weights`, `commit_weights`, `reveal_weights`, sudo) pay neither component.

<details>
<summary><strong>See affected extrinsics</strong></summary>

#### Staking Operations

- [`add_stake`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L591)
- [`remove_stake`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L635)
- [`add_stake_limit`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1793)
- [`remove_stake_limit`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1857)
- [`remove_stake_full_limit`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2081)
- [`move_stake`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1643)
- [`transfer_stake`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1686)
- [`swap_stake`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1731)
- [`swap_stake_limit`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1904)
- [`unstake_all`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1581)
- [`unstake_all_alpha`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1614)

#### Wallet and Identity Management

- [`set_identity`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1471)
- [`set_subnet_identity`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1513)
- [`try_associate_hotkey`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1938)
- [`schedule_swap_coldkey`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1333)
- [`set_coldkey_auto_stake_hotkey`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2132)

#### Registration

- [`register`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L895)
- [`root_register`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1037)
- [`burned_register`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L930)

#### Subnet Management

- [`register_network`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1231)
- [`register_network_with_identity`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1440)
- [`start_call`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1963)
- [`update_symbol`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2163)

#### Burn/Recycle Alpha

- [`recycle_alpha`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2027)
- [`burn_alpha`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2052)

#### Child Hotkey Management

- [`set_children`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1287)
- [`set_childkey_take`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1021)

#### Governance

- [`adjust_senate`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L921)
- [`claim_root`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2254)
- [`set_root_claim_type`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2289)

</details>

<details>
<summary><strong>See how fees are calculated</strong></summary>

**Weight fee** — source: [`pallets/transaction-fee/src/lib.rs:44-56`](https://github.com/opentensor/subtensor/blob/main/pallets/transaction-fee/src/lib.rs#L44-L56)

```rust
pub struct LinearWeightToFee;

impl WeightToFeePolynomial for LinearWeightToFee {
    type Balance = Balance;

    fn polynomial() -> WeightToFeeCoefficients<Self::Balance> {
        let coefficient = WeightToFeeCoefficient {
            coeff_integer: 0,
            coeff_frac: Perbill::from_parts(50_000), // 0.005%
            negative: false,
            degree: 1,
        };
        smallvec!(coefficient)
    }
}
```

**Length fee** — runtime config sets [`LengthToFee = IdentityFee`](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L564): 1 rao per byte of the encoded extrinsic. Source: [`runtime/src/lib.rs`](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs) and the [FRAME Transaction Payment pallet](https://docs.substrate.io/reference/frame-pallets/transaction-payment/).

</details>


## Swap Fees for Stake and Unstake Operations

In addition to the weight-based fee above, staking and unstaking operations are subject to fees based on a percentage of the quantity of transacted liquidity. When moving stake between subnets—whether through a transfer, swap, or move—a 0.05% fee is applied.

**Fee Details:**

- **Rate**: 0.05%
- **For staking**: Fee paid in **TAO** from the staking amount
- **For unstaking**: Fee paid in **Alpha** from the unstaking amount

See: [Swap Simulator example](#swap-simulator)

:::tip
When moving stake between hotkeys within the subnet, no staking fee is applied, only the weight-based transaction fee.
:::

**Source code references:**

- [Fee value](https://github.com/opentensor/subtensor/blob/main/pallets/swap/src/pallet/mod.rs#L68-L76)
- [Fee calculation and distribution](https://github.com/opentensor/subtensor/blob/main/pallets/swap/src/pallet/impls.rs#L596-L639)

### Alpha Fallback

:::note
This feature is not yet active. The alpha fallback logic is implemented but currently disabled in the chain. At present, if a coldkey cannot cover the transaction fee in TAO, the transaction is rejected.
:::

For the unstaking and stake-movement extrinsics listed below, if the sender's TAO balance cannot cover the transaction fee, the chain will fall back to charging the fee in Alpha instead. If both TAO and Alpha balances are insufficient to cover the fee, the transaction is rejected before it is processed. When fees are paid in Alpha, the TAO fee amount is converted to Alpha at the current Alpha price with no slippage.

#### Affected extrinsics

- `remove_stake`
- `remove_stake_limit`
- `remove_stake_full_limit`
- `unstake_all`
- `unstake_all_alpha`
- `move_stake`
- `transfer_stake`
- `swap_stake`
- `swap_stake_limit`
- `recycle_alpha`
- `burn_alpha`

:::note balance edgecases


- For `remove_stake`, `remove_stake_limit`, `recycle_alpha`, and `burn_alpha`: after withdrawing Alpha fees, if the remaining Alpha balance is too small to keep as a dust balance, the transaction will consume and process the entire remaining Alpha balance in the same call.
- For `remove_stake`, `remove_stake_limit`, `recycle_alpha`, and `burn_alpha`: if the requested amount exceeds the available Alpha, the amount is capped at the available Alpha and the extrinsic succeeds (assuming no other errors).

:::


## Fee-Free Extrinsics

Reading the state of the chain is always free. Additionally, the following extrinsics are free of fees.

### Weight Setting & Commit-Reveal

- [`set_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L83) - Setting validator weights
- [`commit_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L158) - Commit weight hash
- [`batch_commit_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L192) - Batch commit weight hashes
- [`reveal_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L241) - Reveal committed weights
- [`commit_crv3_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L285) - Commit CRv3 encrypted weights
- [`batch_reveal_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L337) - Batch reveal committed weights

## Batch Transaction Fees

The utility pallet's `batch`, `batch_all`, and `force_batch` extrinsics aggregate the fees of their inner calls. The weight of the outer extrinsic is the sum of the inner call weights plus a small per-call overhead for the batch wrapper itself.

See: [Batch Transactions](./batch-transactions)

<details>
<summary><strong>See how batch transaction fees are calculated</strong></summary>

The `pays_fee` for the entire batch is determined by [`weight_and_dispatch_class`](https://github.com/opentensor/subtensor/blob/main/pallets/utility/src/lib.rs#L606-L618):

```rust
let mut pays = Pays::No;

for di in calls.iter().map(|call| call.get_dispatch_info()) {
    total_weight = total_weight.saturating_add(di.call_weight);
    if di.pays_fee == Pays::Yes {
        pays = Pays::Yes;
    }
}
```

**The batch pays a fee if any inner call is fee-bearing.** The batch is free only if all inner calls are fee-free. For example, batching `set_weights` (free) with `add_stake` (fee-bearing) results in a fee being charged for the batch.
</details>

:::note
This applies only to the weight + length transaction fee. Swap fees for staking operations are assessed per-call inside the runtime and are not affected by the batch's `pays_fee`.
:::

All three batch variants behave identically for fee purposes.


**Source code:** `weight_and_dispatch_class` [`pallets/utility/src/lib.rs:606–618`](https://github.com/opentensor/subtensor/blob/main/pallets/utility/src/lib.rs#L606-L618).


## Proxy Call Fees

When a call is dispatched through the `proxy` extrinsic, the total transaction fee covers the proxy's own overhead **plus** the inner call's weight. Crucially, the outer extrinsic inherits `pays_fee` and `dispatch_class` directly from the inner call ([`pallets/proxy/src/lib.rs:232–238`](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L232-L238)):

See [Proxies: Overview](../keys/proxies/) for a full description of proxy types, delays, and use cases.



```rust
#[pallet::weight({
    let di = call.get_dispatch_info();
    (T::WeightInfo::proxy(T::MaxProxies::get())
        .saturating_add(T::DbWeight::get().reads_writes(1, 1))
        .saturating_add(di.call_weight),
    di.class, di.pays_fee)
})]
```

This means that if the inner call is [fee-free](#fee-free-extrinsics) (e.g. `set_weights`, `commit_weights`), the entire proxy call is also free — no transaction fee is charged.

:::info Proxy management extrinsics

`add_proxy`, `remove_proxy`, `remove_proxies`, `create_pure`, `kill_pure`, `announce`, `remove_announcement`, and `reject_announcement` all pay the standard weight + length fee. `add_proxy` and `remove_proxy` additionally adjust the reserved proxy deposit.
:::

### Proxy registration deposits

Registering a proxy relationship locks a **reserved** balance from the real account's free TAO — this is not burned. It is returned in full when the proxy is removed. The total deposit for `n` proxies on a single real account is:

$$\text{proxy deposit} = \underbrace{60{,}000{,}000}_{\text{base}} + \underbrace{33{,}000{,}000 \times n}_{\text{per proxy}} \text{ rao}$$

| Constant | Rao | TAO |
|---|---|---|
| `ProxyDepositBase` | 60,000,000 | τ 0.06 |
| `ProxyDepositFactor` | 33,000,000 | τ 0.033 per proxy |

So one proxy relationship costs τ 0.093 reserved; each additional proxy on the same real account adds τ 0.033.

**Source code:** deposit formula [`runtime/src/lib.rs:199–204`](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L199-L204), constants [`runtime/src/lib.rs:539–543`](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L539-L543), deposit calculation [`pallets/proxy/src/lib.rs:964–971`](https://github.com/opentensor/subtensor/blob/main/pallets/proxy/src/lib.rs#L964-L971).

<details>
<summary><strong>Verify deposit amounts on-chain</strong></summary>

These values are runtime constants (compiled into the WASM blob) and can only change with a runtime upgrade. To verify the current live values against what is documented here:

```python
import bittensor as bt

sub = bt.Subtensor(network="finney")
s = sub.substrate

for name in [
    "ProxyDepositBase",
    "ProxyDepositFactor",
    "AnnouncementDepositBase",
    "AnnouncementDepositFactor",
    "MaxProxies",
    "MaxPending",
]:
    print(f"{name}: {s.get_constant('Proxy', name)}")
```

```console
ProxyDepositBase: 60000000
ProxyDepositFactor: 33000000
AnnouncementDepositBase: 36000000
AnnouncementDepositFactor: 68000000
MaxProxies: 20
MaxPending: 75
```

</details>

### Announcement deposits

Proxies configured with a non-zero `delay` must announce calls before executing them. Each pending announcement locks an additional reserved balance (also returned on removal or execution):

$$\text{announcement deposit} = \underbrace{36{,}000{,}000}_{\text{base}} + \underbrace{68{,}000{,}000 \times n}_{\text{per announcement}} \text{ rao}$$

| Constant | Rao | TAO |
|---|---|---|
| `AnnouncementDepositBase` | 36,000,000 | τ 0.036 |
| `AnnouncementDepositFactor` | 68,000,000 | τ 0.068 per announcement |

Up to 75 pending announcements are allowed per account (`MaxPending`). **Source code:** [`runtime/src/lib.rs:546–549`](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L546-L549).


## Estimating fees

The chain and the SDK expose **two separate estimation paths**: one for the **swap/liquidity fee** (stake, unstake, move, swap) and one for the **transaction fee** (weight + length). Use both when you want the full cost of a staking-related call.

### Swap simulator

The **SimSwap Runtime API** simulates a swap and returns the liquidity fee and expected amounts. It does **not** include the transaction (extrinsic) fee.

:::note Full cost for a stake operation

For add_stake, remove_stake, move_stake, or swap_stake:

1. **Swap fee:** `sim_swap(origin_netuid, destination_netuid, amount)` → use `tao_fee` or `alpha_fee` as appropriate (and same-subnet moves have no swap fee).
2. **Transaction fee:** Compose the extrinsic, then `get_payment_info(call, keypair)` or `get_extrinsic_fee(call, keypair)` → `partial_fee`.

Total estimated cost = transaction fee (in TAO) + swap fee (in TAO or alpha, depending on direction).
:::


On chain, the runtime implements `SwapRuntimeApi` with:

- `sim_swap_tao_for_alpha(netuid, tao)` — simulates TAO → alpha (e.g. add_stake). Returns `SimSwapResult`: `tao_amount`, `alpha_amount`, `tao_fee`, `alpha_fee`.
- `sim_swap_alpha_for_tao(netuid, alpha)` — simulates alpha → TAO (e.g. remove_stake). Returns `SimSwapResult` with fee and amounts.

Both official clients, BTCLI and the Python SDK, support sim swaps.


<Tabs groupId="fee-estimate-swap">
<TabItem value="btcli" label="BTCLI">

BCLI does not offer a separate `sim swap` command, but when you run **stake add**, **stake remove**, or **stake move**, BTCLI shows a preview table with the swap fee **(Fee (τ))** and **Extrinsic Fee (τ)** (transaction fee) before you confirm:

:::danger
the only way to see these fees in BTCLI is to run the actual stake command; the table is printed before execution. Use the default prompt and answer "no" at "Would you like to continue?" to exit without sending the transaction.
:::


```bash
btcli stake add
```

```console
...

Amount to stake (TAO τ): 100

                                                       Staking to:
                   Wallet: 2MuchTau!, Coldkey ss58: 5Xj...
                                                      Network: test

        ┃              ┃            ┃              ┃              ┃          ┃              ┃  Rate with   ┃   Partial
        ┃              ┃            ┃              ┃     Est.     ┃          ┃  Extrinsic   ┃  tolerance:  ┃    stake
 Netuid ┃    Hotkey    ┃ Amount (τ) ┃ Rate (per τ) ┃   Received   ┃ Fee (τ)  ┃   Fee (τ)    ┃    (0.5%)    ┃   enabled
━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━
   2    │ 5GrwvaEF5zX… │ 100.0000 τ │ 2416.813286… │ 241,556.4147 │ Τ 0.0504 │   0.0013 τ   │  2404.7893   │    False
        │              │            │     β/Τ      │      β       │          │              │     β/Τ      │
────────┼──────────────┼────────────┼──────────────┼──────────────┼──────────┼──────────────┼──────────────┼──────────────
        │              │            │              │              │          │              │              │

```


The table lists each hotkey/netuid with Fee (τ) (swap fee) and Extrinsic Fee (τ). To only view fees without executing, answer **no** at the confirmation prompt.


</TabItem>
<TabItem value="sdk" label="Bittensor SDK">

Use the SDK's `subtensor.sim_swap(origin_netuid, destination_netuid, amount)`.

This method hits the blockchain's SimSwap runtime API to compute the swap simulation, and for cross-subnet moves, simulates two swaps and combines the result. The result is a `SimSwapResult` with:

- `tao_fee`, `alpha_fee` — the swap/liquidity fee (in TAO or alpha)
- `tao_amount`, `alpha_amount` — expected output amounts
- Slippage fields

Btcli uses `sim_swap` to show “Fee (τ)” and “Est. Received” in stake add/remove/move. The SDK’s `get_fee_for_stake_add`, `get_fee_for_stake_remove`, and `get_fee_for_move_stake` use `sim_swap` for the liquidity-fee part.

This example estimates swap fee and output for add_stake (TAO → alpha for SN 14):

```python
import bittensor as bt

sub = bt.Subtensor(network="finney")
netuid = 14
amount_stake = bt.Balance.from_tao(0.1)

result = sub.sim_swap(
    origin_netuid=0,
    destination_netuid=netuid,    
    amount=amount_stake,
)
print(result)

```
```console
SimSwapResult(tao_amount=τ0.099949646, alpha_amount=2.635103285γ, tao_fee=τ0.000050354, alpha_fee=0.000000000γ)
```
This example estimates swap fee and output for remove_stake (alpha for SN 14 → TAO):

```python
import bittensor as bt

sub = bt.Subtensor(network="finney")
netuid = 14
amount_stake = bt.Balance.from_tao(0.1)


result = sub.sim_swap(
    origin_netuid=14,
    destination_netuid=0,    
    amount=amount_stake,
)
print(result)
```

```console
SimSwapResult(tao_amount=τ0.000964782, alpha_amount=0.099949646ξ, tao_fee=τ0.000000000, alpha_fee=0.000050354ξ)
```

This example estimates swap for a cross-subnet move (subnet 14 → subnet 5):

```python
import bittensor as bt

sub = bt.Subtensor(network="finney")

amount_alpha = bt.Balance.from_tao(1).set_unit(5)

result = sub.sim_swap(
    origin_netuid=14,
    destination_netuid=5,
    amount=amount_alpha,
)

print(result)
```

```console
SimSwapResult(tao_amount=τ0.009642946, alpha_amount=0.625912713ξ, tao_fee=τ0.000004858, alpha_fee=0.000503280ξ)
```
</TabItem>
</Tabs>

**Code references:** Runtime [`SwapRuntimeApi`](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs) (`sim_swap_tao_for_alpha`, `sim_swap_alpha_for_tao`); swap pallet [`sim_swap`](https://github.com/opentensor/subtensor/blob/main/pallets/swap/src/pallet/impls.rs); SDK [`sim_swap`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/subtensor.py) and btcli `subtensor_interface.sim_swap`; chain_data [`SimSwapResult`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/chain_data.py).

### Extrinsic fee simulation

To estimate the **weight + length** fee for any extrinsic (including stake calls), use the chain's payment query APIs in the polkadot browser app, or use the Bittensor Python SDK

<Tabs groupId="fee-estimate-tx">

<TabItem value="btcli" label="BTCLI">

The **stake add**, **stake remove**, and **stake move** commands display **Extrinsic Fee (τ)** in the preview table alongside the swap fee, as described above:

:::danger
the only way to see these fees in BTCLI is to run the actual stake command; the table is printed before execution. Use the default prompt and answer "no" at "Would you like to continue?" to exit without sending the transaction.
:::

```bash
btcli stake add
```

```console
...

Amount to stake (TAO τ): 100

                                                       Staking to:
                   Wallet: 2MuchTau!, Coldkey ss58: 5Xj...
                                                      Network: test

        ┃              ┃            ┃              ┃              ┃          ┃              ┃  Rate with   ┃   Partial
        ┃              ┃            ┃              ┃     Est.     ┃          ┃  Extrinsic   ┃  tolerance:  ┃    stake
 Netuid ┃    Hotkey    ┃ Amount (τ) ┃ Rate (per τ) ┃   Received   ┃ Fee (τ)  ┃   Fee (τ)    ┃    (0.5%)    ┃   enabled
━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━
   2    │ 5GrwvaEF5zX… │ 100.0000 τ │ 2416.813286… │ 241,556.4147 │ Τ 0.0504 │   0.0013 τ   │  2404.7893   │    False
        │              │            │     β/Τ      │      β       │          │              │     β/Τ      │
────────┼──────────────┼────────────┼──────────────┼──────────────┼──────────┼──────────────┼──────────────┼──────────────
        │              │            │              │              │          │              │              │

```

</TabItem>
<TabItem value="sdk" label="Bittensor SDK">

Two methods in the SDK can be used to get fees for a transaction:

- `subtensor.get_payment_info(call, keypair)`  returns a dict including `partial_fee` (the total transaction fee in rao). This method is used by BTCLI under the hood to fetch “Extrinsic Fee”.
- `subtensor.get_extrinsic_fee(call, keypair)` calls `get_payment_info()` but returns only the `Balance` amount for the fee.

You must **compose the call** (e.g. the exact `add_stake`, `move_stake`, or other extrinsic and params) before calling these; they simulate the fee for that call and keypair. See [Working with Blockchain Calls
](../sdk/call)

```python
import bittensor as bt

sub = bt.Subtensor(network="test")
wallet = bt.Wallet(name="my_wallet", hotkey="my_hotkey")
wallet.unlock_coldkey()

netuid = 1
hotkey_ss58 = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
amount = bt.Balance.from_tao(10)

# Compose the add_stake call (same params you would use to send the tx)
call = sub.compose_call(
    call_module="SubtensorModule",
    call_function="add_stake",
    call_params={
        "hotkey": hotkey_ss58,
        "netuid": netuid,
        "amount_staked": amount.rao,
    },
)
# Keypair is the account that pays the fee (coldkey)
fee = sub.get_extrinsic_fee(call=call, keypair=wallet.coldkeypub)
print(f"Estimated transaction fee: {fee}")
```
```console
Estimated transaction fee: τ0.001337128
```

</TabItem>
<TabItem value="polkadotjs" label="Polkadot.js App">
 Query fee details directly from the chain using the [Polkadot.js browser app](https://polkadot.js.org/apps/?rpc=wss://entrypoint-finney.opentensor.ai:443#/runtime) connected to Finney. Under **Developer → Runtime Calls**, use `TransactionPaymentApi`:

- `query_info(uxt, len)` or `query_fee_details(uxt, len)` — full fee breakdown for a given extrinsic and its encoded length
- `query_weight_to_fee(weight)` — weight component only
- `query_length_to_fee(length)` — length component only

</TabItem>
</Tabs>

### Batch fee simulation

Because a batch extrinsic is just a single composed call, pass the finished `batch_call` to `get_extrinsic_fee` before sending it as for any other extrinsic.

Using the SDK:
```python
import bittensor as bt

sub = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="my_wallet", hotkey="my_hotkey")
wallet.unlock_coldkey()

hotkey_1 = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
hotkey_2 = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
netuid = 1
amount = bt.Balance.from_tao(10)

call_1 = sub.compose_call(
    call_module="SubtensorModule",
    call_function="add_stake",
    call_params={"hotkey": hotkey_1, "netuid": netuid, "amount_staked": amount.rao},
)
call_2 = sub.compose_call(
    call_module="SubtensorModule",
    call_function="add_stake",
    call_params={"hotkey": hotkey_2, "netuid": netuid, "amount_staked": amount.rao},
)

batch_call = sub.compose_call(
    call_module="Utility",
    call_function="batch_all",
    call_params={"calls": [call_1, call_2]},
)

# Estimate the transaction fee before sending
fee = sub.get_extrinsic_fee(call=batch_call, keypair=wallet.coldkeypub)
print(f"Estimated transaction fee: {fee}")
```

```console
Estimated transaction fee: τ0.001401232
```

Note this is only the weight + length transaction fee. For staking operations you also need the swap fee — use `sub.sim_swap()` per inner call for that. See [Estimating fees](./fees#estimating-fees) for the full picture.


## Example: Fees in the lifecycle of a transaction

This section traces a single **move_stake** transaction from the moment it is submitted until the chain has applied every fee. It shows how the **transaction fee** (weight + length) and the **swap/liquidity fee** combine, and how the chain avoids double-charging on moves.

**Scenario:** Moving 1 TAO worth of alpha from **subnet 5** to **subnet 18** — same coldkey, different hotkeys.

### What the chain does

1. **The transaction fee is charged upfront.**
   Before the extrinsic executes, the runtime deducts the weight + length fee from the coldkey’s TAO free balance ([`withdraw_fee`](https://github.com/opentensor/subtensor/blob/main/pallets/transaction-fee/src/lib.rs#L315)). If the balance is insufficient, the transaction is rejected immediately.
   - **Weight fee:** $\text{weight} \times (50{,}000 / 10^9)$ rao ([`LinearWeightToFee`](https://github.com/opentensor/subtensor/blob/main/pallets/transaction-fee/src/lib.rs#L43-L56): `Perbill::from_parts(50_000)`).
   - **Length fee:** 1 rao per byte of the encoded extrinsic ([`LengthToFee = IdentityFee`](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L564)).

2. **The move executes.**
   [`do_move_stake`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/move_stake.rs#L30) calls [`transition_stake_internal`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/move_stake.rs#L298), which runs two swaps because origin and destination subnets differ:
   - **Unstake on origin (subnet 5):** [`unstake_from_subnet`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/move_stake.rs#L358) converts the alpha to TAO, taking a **swap fee** in alpha (`drop_fee_origin`).
   - **Stake on destination (subnet 18):** [`stake_into_subnet`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/move_stake.rs#L376) converts that TAO to alpha with no swap fee (`drop_fee_destination = true`). Only one liquidity fee is charged per move.

3. **Which side pays the swap fee depends on the origin.**
   [`drop_fee_origin = origin_netuid == NetUid::ROOT`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/move_stake.rs#L354-L355), `drop_fee_destination = !drop_fee_origin`:
   - **Non-root → subnet:** swap fee on the origin unstake (alpha→TAO).
   - **Root → subnet:** swap fee on the destination stake (TAO→alpha).

For this scenario (**subnet 5 → subnet 18**), the coldkey pays the transaction fee in TAO, and one swap fee is taken in alpha from the moved liquidity on subnet 5.

### Calculating the fees

**1. Transaction fee (weight component)**  
The `move_stake` extrinsic has a declared weight of ([`dispatches.rs`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1557-L1559)):

```text
Weight::from_parts(164_300_000, 0)
  + DbWeight::reads(15)
  + DbWeight::writes(7)
```

The chain converts this to rao using the fee formula: $\text{fee\_rao} = \text{weight} \times 50{,}000 / 10^9$. The exact weight contribution of each read and write is determined by the chain’s `DbWeight` constants. For illustration, if the total weight is about 165_000_000:

- Weight fee $\approx 165{,}000{,}000 \times 50{,}000 / 10^9 \approx$ **8,250 rao** (about 0.00000825 TAO).

**2. Transaction fee (length component)**  
The encoded extrinsic includes the call index, two account IDs (32 bytes each), two netuids, and an alpha amount. A typical size is on the order of 100–200 bytes. At 1 rao per byte ([`LengthToFee = IdentityFee`](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L564)):

- Length fee ≈ **100–200 rao**.

**3. Swap fee (liquidity component)**  
For subnet 5 (mechanism 1), the fee is $\text{alpha\_amount} \times (\text{FeeRate}(\text{netuid}) / 65{,}535)$ ([`calculate_fee_amount`](https://github.com/opentensor/subtensor/blob/main/pallets/swap/src/pallet/impls.rs#L367) for mechanism 1), where 65,535 is the maximum possible fee rate value. With the default [`DefaultFeeRate`](https://github.com/opentensor/subtensor/blob/main/pallets/swap/src/pallet/mod.rs#L78) of 33:

- Rate $\approx 33 / 65{,}535 \approx 0.0504\%$.
- For 1 TAO worth of alpha on subnet 5, the swap fee is about **0.0005 TAO** (about 500_000 rao), taken in alpha from the amount moved.

So in this example, **total cost** to the user is roughly:

- **Transaction fee:** ~8_250 + ~150 ≈ **~8_400 rao** (0.0000084 TAO), paid from the coldkey’s TAO balance.
- **Swap fee:** ~0.05% of the moved amount, paid in alpha (from the stake on subnet 5).



