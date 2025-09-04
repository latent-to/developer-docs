---
title: "Crowdloans"
---

### Overview

The crowdloan feature lets a group of people collectively fund the registration of a new Bittensor subnet and share the resulting emissions according to each person’s contribution. Instead of a single sponsor paying the full lease cost up front, a creator opens a crowdloan with a funding cap and end block, contributors deposit funds until the cap is met, and—on success—the pallet finalizes the crowdloan by funding subnet registration and activating emissions for the group.

At finalization, the system executes an on‑chain call—typically `subtensor::register_leased_network`—using the crowdloan’s funds. This registers the subnet and creates a dedicated proxy, `SubnetLeaseBeneficiary`, for the designated beneficiary. That proxy is authorized to operate the subnet (for example, configuring subnet parameters and other allowed controls) without having custody of contributor funds or emissions splits.

While the lease is active, emissions flow to contributors pro‑rata based on their contributed share. If the crowdloan is not finalized after the end block, anyone can call refunds; once all contributors are refunded, the creator can dissolve the crowdloan. The call and target address specified at creation are immutable, ensuring that the purpose of the crowdloan cannot be changed mid‑campaign. This model makes subnet bootstrapping collaborative, transparent, and permissioned through a narrowly scoped proxy for safe, ongoing operations.

- Strong defaults: immutable target and call, capped funding, clear end block
- Shared upside: emissions distributed proportionally to contributions
- Safe operations: a dedicated proxy to manage the subnet within defined permissions

See also [Create a Subnet with a Crowdloan](./crowdloans-tutorial.md)

## Crowdloan Lifecycle

- **Create** a campaign with deposit, cap, end, min contribution, optional `call` and `target_address`. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L318-L326)

- **Contribute** funds; amounts are clipped to remaining cap; contributors are counted. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L413-L420)

- **Withdraw** before finalization; creator cannot withdraw below their deposit. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L505-L525)

- **Finalize** after end when cap is fully raised. Optionally transfers to `target_address` and dispatches the stored `call`. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L566-L581)

- **Refund** loop refunds up to `RefundContributorsLimit` per call; may need multiple calls. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L637-L646)

- **Dissolve** after refunds; creator's deposit is returned and storage cleaned up. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L711-L721)

## Emissions distribution during a lease

- When owner rewards are paid to a leased subnet, they are split into contributor dividends and a beneficiary cut. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/run_coinbase.rs#L450-L452)

- Distribution is pro‑rata by recorded share; any remainder goes to the beneficiary. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/leasing.rs#L324-L339)

## Operating the leased subnet via proxy

- On successful registration, a `SubnetLeaseBeneficiary` proxy is added from the lease coldkey to the beneficiary. This proxy can call a narrowly scoped set of operations to operate the subnet. [Source code](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L886-L907)

- Allowed calls for `ProxyType::SubnetLeaseBeneficiary` include starting subnet calls and selected admin‑utils setters (hyperparameters), not unrestricted sudo. [Source code](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L792-L852)

## Runtime parameters (defaults)

These constants define crowdloan requirements and operational limits in the runtime: [Source code](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1556-L1571)

Implications:

- **Refund batching**: Up to 50 contributors are processed per `refund` call.
- **Duration bounds**: Ensures campaigns are neither too short nor too long.
- **Contribution floor**: Enforces a minimum "ticket size" for contributors.

## FAQ

### What problem do crowdloans solve?

Crowdloans enable shared funding and ownership of subnets so that no single sponsor must front the entire lock cost. Emissions are shared among contributors while a designated beneficiary operates the subnet via a scoped proxy.

### How does the end‑to‑end flow work?

Creator calls `create` with deposit, cap, end, and a `call` of `subtensor::register_leased_network`. Contributors fund until the cap is hit. After the end block, creator calls `finalize`; funds transfer and the stored call executes with creator origin. A subnet and a `SubnetLeaseBeneficiary` proxy are set up; contributor shares are recorded, leftover cap is refunded.

### Can the purpose of a crowdloan be changed after it starts?

No. The `call` and optional `target_address` are bound at creation and used at `finalize`. The pallet exposes `CurrentCrowdloanId` only during dispatch to the called extrinsic, preventing mid‑campaign repurposing.

### Who can finalize a crowdloan and when?

Only the creator, after the end block, and only if `raised == cap` and it hasn’t already been finalized.

### What happens if the cap is not reached?

Anyone can call `refund` to batch‑refund contributors (excluding the creator) up to `RefundContributorsLimit` per call. After all refunds, only the creator can `dissolve` to recover the deposit and clean storage.

### How are emissions split during a lease?

Owner rewards are split to contributors by their recorded `SubnetLeaseShares`; any remainder goes to the beneficiary. This runs automatically during coinbase distribution.

### What permissions does the beneficiary proxy have?

They can invoke a curated set of calls (e.g., start subnet calls and selected admin‑utils setters like difficulty, weights, limits).

<!-- TODO: investigate this and fill out the details -->

### Can the campaign parameters be updated mid‑flight?

The creator can update `min_contribution`, `end`, and `cap` on a non‑finalized crowdloan, subject to checks (duration bounds, cap >= raised, etc.). The `call` and `target_address` are immutable.

### Is there a maximum number of contributors?

Yes. `MaxContributors` limits unique contributors per crowdloan; contributions beyond that will be rejected.

### How are leftover funds handled at lease creation?

Any leftover cap (after paying registration + proxy cost) is refunded to contributors; the residual remainder goes to the beneficiary.

### How do I track my expected emissions?

Your share equals your contribution divided by total raised at `finalize`. Emissions are distributed to your coldkey during the lease according to that share.

### Can a lease be terminated early?

No. The beneficiary may terminate only after the optional `end_block` has passed; for perpetual leases there is no end block.
