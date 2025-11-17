---
title: "Crowdloans"
---

### Overview

The crowdloan feature lets a group of people collectively fund an extrinsic execution or a balance transfer to a specific address. For example, it can be used to fund the registration of a new Bittensor subnet and share the resulting emissions according to each person's contribution. Instead of a single sponsor paying the full lease cost up front, a creator opens a crowdloan with a funding cap and end block, contributors deposit funds until the cap is met, and—on success—the pallet finalizes the crowdloan by funding subnet registration and activating emissions for the group.

At finalization, the system executes an on‑chain call—typically `subtensor::register_leased_network`—using the crowdloan's funds. This registers the subnet and creates a dedicated proxy, `SubnetLeaseBeneficiary`, for the designated beneficiary (the crowdloan creator). That proxy is authorized to operate the subnet (for example, configuring subnet parameters and other allowed controls) without having custody of contributor funds or emissions splits.

If the crowdloan is finalized and a lease is created, emissions flow to contributors pro‑rata based on their contributed share. If the crowdloan is not finalized after the end block, anyone can call refunds; once all contributors are refunded, the creator can dissolve the crowdloan. The call and target address specified at creation are immutable, ensuring that the purpose of the crowdloan cannot be changed mid‑campaign. This model makes subnet bootstrapping collaborative, transparent, and permissioned through a narrowly scoped proxy for safe, ongoing operations.

Design features:
- Strong defaults: immutable target and call, capped funding, clear end block
- Shared upside: emissions distributed proportionally to contributions
- Safe operations: a dedicated proxy to manage the subnet within defined permissions

:::info
**Crowdloans** and **Leasing** are two different but related concepts:

**Crowdloan** enables someone to fund some extrinsic execution or a balance transfer at some end date, with contributors able to participate to a cap. When finalized, this will execute the extrinsic (substrate defined logic where we can move the funds and do something else) or transfer the balance to an address (EVM smart contract address for example).

**Leasing** is split profit ownership of a subnet. This is tightly coupled to Crowdloan because a lease can only be created through a Crowdloan where the crowdloan extrinsic will be the `register_leased_network`. The logic to create a lease uses the contributors from the crowdloan as the lease shareholders, and the crowdloan creator as the lease beneficiary. Parameters like the lease end block and lease emissions shares are defined when you create the crowdloan.
:::

See also [Create a Subnet with a Crowdloan](./crowdloans-tutorial.md)

## Crowdloan Lifecycle

- **Create** a campaign with deposit, cap, end, min contribution, optional `call` and `target_address`. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L318-L326)

- **Contribute** funds; amounts are clipped to remaining cap; contributors are counted. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L413-L420)

- **Withdraw** before finalization; creator cannot withdraw below their deposit. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L505-L525)

- **Finalize** after end when cap is fully raised. Optionally transfers to `target_address` and dispatches the stored `call`. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L566-L581)

- **Refund** loop refunds up to `RefundContributorsLimit` per call; may need multiple calls. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L637-L646)

- **Dissolve** after refunds; creator's deposit is returned and storage cleaned up. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L711-L721)

- **Update** parameters while crowdloan is running (creator only):
  - `update_min_contribution` - adjust minimum contribution amount
  - `update_end` - extend the end block
  - `update_cap` - adjust the funding cap

## Emissions distribution during a lease

- When owner rewards are paid to a leased subnet, they are split into contributor dividends and a beneficiary cut. [Source code](https://github.com/opentensor/subtensor/blob/81ee047fd124f8837555fd79e8a3957688c5b0c6/pallets/subtensor/src/subnets/leasing.rs#L250)

- Distribution is pro‑rata by recorded share; any remainder goes to the beneficiary. A lease can be created with an emissions share from 0 to 100%, which determines the share distributed to contributors. For example, if the emissions share is 50%, it means that 50% of the owner cut (18% currently) so 9% will be split proportionally to their share to contributors. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/leasing.rs#L324-L339)

## Operating the leased subnet via proxy

- On successful registration, a `SubnetLeaseBeneficiary` proxy is added from the lease coldkey to the beneficiary. This proxy can call a narrowly scoped set of operations to operate the subnet. [Source code](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L886-L907)

- Allowed calls for `ProxyType::SubnetLeaseBeneficiary` include starting subnet calls and selected admin‑utils setters (hyperparameters), not unrestricted sudo. [Source code](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L792-L852)

## Runtime parameters (defaults)

These constants define crowdloan requirements and operational limits in the runtime: [Source code](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1556-L1571)

Implications:

- **Refund batching**: Up to 50 contributors are processed per `refund` call.
- **Duration bounds**: Campaigns must last between 7 days (50,400 blocks) and 60 days (432,000 blocks) on production chains.
- **Contribution floor**: Enforces a minimum "ticket size" for contributors.

## FAQ

### What problem do crowdloans solve?

Crowdloans enable someone to fund some extrinsic execution or a balance transfer at some end date, with contributors able to participate to a cap. When finalized, this will execute the extrinsic (substrate defined logic where we can move the funds and do something else) or transfer the balance to an address (EVM smart contract address for example).

Leasing is defined as split profit ownership of a subnet. This is tightly coupled to Crowdloan because a lease can only be created through a Crowdloan where the crowdloan extrinsic will be the "register_leased_network". The logic to create a lease will use the contributors from the crowdloan as the lease shareholders, the lease beneficiary will be crowdloan creator. Parameters like lease end block (some block in the future, probably much farther than crowdloan end) or lease emissions share are defined when you create the crowdloan and you pass the register_lease_network call with the parameters filled.

### How does the end‑to‑end flow work?

Creator calls `create` with deposit, cap, end, and a `call` of `subtensor::register_leased_network`. Contributors fund until the cap is hit. After the end block, creator calls `finalize`; funds transfer and the stored call executes with creator origin. A subnet and a `SubnetLeaseBeneficiary` proxy are set up; contributor shares are recorded, leftover cap is refunded.

### Can the purpose of a crowdloan be changed after it starts?

No. The `call` and optional `target_address` are bound at creation and used at `finalize`. The pallet exposes `CurrentCrowdloanId` only during dispatch to the called extrinsic, preventing mid‑campaign repurposing.

### Who can finalize a crowdloan and when?

Only the creator, after the end block, and only if `raised == cap` and it hasn’t already been finalized.

### What happens if the cap is not reached?

Anyone can call `refund` to batch‑refund contributors (excluding the creator) up to `RefundContributorsLimit` per call. After all refunds, only the creator can `dissolve` to recover the deposit and clean storage.

### How are emissions split during a lease?

Owner rewards are split to contributors by their recorded `SubnetLeaseShares`; any remainder goes to the beneficiary. The emissions are swapped for TAO and TAO is distributed to the contributors, not alpha. This runs automatically during coinbase distribution.

### What permissions does the beneficiary proxy have?

They can invoke a curated set of calls (e.g., start subnet calls and selected admin‑utils setters like difficulty, weights, limits).


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
