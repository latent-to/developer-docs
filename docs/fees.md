---
title: "Transaction Fees in Bittensor"
---

# Transaction Fees in Bittensor

This page describes the blockchain transaction fees charged by Bittensor. 

Many extrinsic transactions that change the state of the blockchain are subject to **weight-based fees** (0.05% of transaction weight), as detailed below.

Staking and unstaking operations incur weight-based fees as well as **amount-based fees** of 0.05% of the transacted liquidity.

Reading the state of the chain is always free.


## Weight-Based Transaction Fees

Many extrinsics in Bittensor are subject to **weight-based fees**. In Polkadot-based chains like Subtensor (Bittensor's layer 1 blockchain), [weight](https://docs.polkadot.com/polkadot-protocol/glossary/#weight) is a measure of compute time.

**Fee Details**: 
- Current rate: `Perbill::from_parts(500_000)` = 500,000 / 1,000,000,000 = 0.05% of transaction weight
- **Payment source**: Free balance of the transaction sender
- **Denomination**: TAO
- **Impact on liquidity**: Fees are *recycled* (deducted from `TotalIssuance`)

:::tip Planned reduction
It is currently planned that the fee coefficient will be reduced to $0.005%$ (10x reduction).
:::

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

### Wallet and Identity Management:\
- [`set_identity`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1471)
- [`set_subnet_identity`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1513)
- [`associate_evm_key`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2001)
- [`try_associate_hotkey`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1938)
- [`schedule_swap_coldkey`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1333)

### Subnet Management
- [`set_children`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1287)
- [`set_childkey_take`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1021)
- [`schedule_dissolve_network`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1408)
- [`start_call`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L1963)
- [`update_symbol`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2163)

### Token Operations
- [`recycle_alpha`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2027)
- [`burn_alpha`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2052)

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
                coeff_frac: Perbill::from_parts(500_000), // 0.05%
                negative: false,
                degree: 1,
            };
            smallvec!(coefficient)
        }
    }
    ```
    **Source code reference:** [`runtime/src/lib.rs:448-463`](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L448-L463)

</details>

## Swap Fees for Stake and Unstake Operations

In addition to the weight-based fee above, staking and unstaking operations are subject to fees based on a percentage of the quantity of transacted liquidity.

**Fee Details:**
- **Rate**: 0.05%
- **For staking**: Fee paid in **TAO** from the staking amount
- **For unstaking**: Fee paid in **Alpha** from the unstaking amount
- **Fee distribution**: Added to global fee counters per subnet

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

