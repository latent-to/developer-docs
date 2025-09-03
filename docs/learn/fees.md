---
title: "Transaction Fees in Bittensor"
---

# Transaction Fees in Bittensor

This page describes the blockchain transaction fees charged by Bittensor.

Many extrinsic transactions that change the state of the blockchain are subject to a small, weight-based fee. Staking and unstaking operations incur weight-based fees as well as amount-based fees of 0.05% of the transacted liquidity.

Reading the state of the chain is always free.

## Weight-Based Transaction Fees

Many extrinsics in Bittensor are subject to **weight-based fee**. In Polkadot-based chains like Subtensor (Bittensor's layer 1 blockchain), [weight](https://docs.polkadot.com/polkadot-protocol/glossary/#weight) is a measure of compute time.

**Fee Details**:
- **Payment source**: Sender's TAO free balance by default. For specific extrinsics, if TAO is insufficient to cover fees, the chain will charge fees in Alpha instead (see [Alpha Fallback](#alpha-fallback))
- **Denomination**: TAO by default. When fees are paid in Alpha, the TAO fee amount is converted to Alpha using the current Alpha price (no slippage).
- **Impact on liquidity**: Fees are *recycled* (deducted from `TotalIssuance`)
    See: [Recycling and Burning](../resources/glossary#recycling-and-burning)

### Staking Operations

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

### Wallet and Identity Management

- [`set_identity`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1471)
- [`set_subnet_identity`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1513)
- [`associate_evm_key`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2001)
- [`try_associate_hotkey`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1938)
- [`schedule_swap_coldkey`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1333)

### Registration

- [`register`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L895)
- [`burned_register`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L930)

### Subnet Management

- [`start_call`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1963)
- [`update_symbol`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2163)

### Burn/recycle alpha

- [`recycle_alpha`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2027)
- [`burn_alpha`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2052)

### Child Hotkey Management

- [`set_children`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1287)
- [`set_childkey_take`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1021)

### Governance

- [`adjust_senate`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L921)

<details>
    <summary><strong>See how it's calculated!</strong></summary>
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
    **Source code reference:** [`pallets/transaction-fee/src/lib.rs:44-56`](https://github.com/opentensor/subtensor/blob/main/pallets/transaction-fee/src/lib.rs#L44-L56)

</details>

## Alpha Fallback

For extrinsics that charge fees by swapping Alpha for TAO, if the sender's TAO balance cannot cover the weight-based transaction fee, the chain will fall back to charging the fee in Alpha. If both TAO and Alpha balances are insufficient to cover the anticipated fee, the transaction fails validation and will not be included in the mempool. When fees are paid in Alpha, the TAO fee is converted to Alpha using the current Alpha price with no slippage.

### Affected extrinsics

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

### Complete unstaking handling

For `remove_stake`, `remove_stake_limit`, `recycle_alpha`, and `burn_alpha`: after withdrawing Alpha fees, if the remaining Alpha balance is too small to keep as a dust balance, the transaction will consume and process the entire remaining Alpha balance in the same call.

### Updated handling of `NotEnoughStakeToWithdraw`

For `remove_stake`, `remove_stake_limit`, `recycle_alpha`, and `burn_alpha`: if the requested amount exceeds the available Alpha, the amount is capped at the available Alpha and the extrinsic succeeds (assuming no other errors).

## Swap Fees for Stake and Unstake Operations

In addition to the weight-based fee above, staking and unstaking operations are subject to fees based on a percentage of the quantity of transacted liquidity. When moving stake between subnets—whether through a transfer, swap, or move—a 0.05% fee is applied. If the move happens within the same subnet, no additional fee is incurred, only the weight-based fee.

**Fee Details:**

- **Rate**: 0.05%
- **For staking**: Fee paid in **TAO** from the staking amount
- **For unstaking**: Fee paid in **Alpha** from the unstaking amount

### Example

```shell
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

**Source code references:**

- [Fee value](https://github.com/opentensor/subtensor/blob/main/pallets/swap/src/pallet/mod.rs#L68-L76)
- [Fee calculation and distribution](https://github.com/opentensor/subtensor/blob/main/pallets/swap/src/pallet/impls.rs#L596-L639)

## Fee-Free Extrinsics

The following extrinsics are free.

### Weight Setting & Commit-Reveal

- [`set_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L83) - Setting validator weights
- [`commit_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L158) - Commit weight hash
- [`batch_commit_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L192) - Batch commit weight hashes
- [`reveal_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L241) - Reveal committed weights
- [`commit_crv3_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L285) - Commit CRv3 encrypted weights
- [`batch_reveal_weights`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L337) - Batch reveal committed weights

### Administrative & Operational

- Sudo and admin extrinsics
- Governance-related functions
