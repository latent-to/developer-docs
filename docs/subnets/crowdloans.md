---
title: "Crowdloans"
---

- ## What is a subnet crowdloan?
  - Problem it solves (shared ownership of subnets)
  - High‑level flow

- ## Who is this for?
  - Sponsors/creators
  - Contributors
  - Beneficiaries/operators
  - Validators and the broader network

- ## Key concepts and roles
  - Crowdloan ID and crowdloan account
  - Creator (sponsor)
  - Contributors
  - Beneficiary and the `SubnetLeaseBeneficiary` proxy
  - Cap, end block, minimum contribution, deposit
  - The immutable “target” and “call” fields

- ## Lifecycle at a glance
  - Create → Contribute → (optional) Update parameters → Finalize
  - Emissions distribution during the lease
  - Refunds and dissolve if unsuccessful

- ## Creating a subnet via crowdloan
  - Selecting parameters: cap, end block, min contribution
  - Setting the target account (optional) and the call
  - Using `subtensor::register_leased_network` as the call
  - Deposits, fees, and execution gas considerations

### Practical tips (Polkadot‑JS, local dev)

- Balances are in base units (not TAO). On the default runtime, the pallet enforces:
  - `MinimumDeposit = 10_000_000_000` (10 TAO) and
  - `AbsoluteMinimumContribution = 100_000_000` (0.1 TAO).
  - Example values that satisfy checks: `deposit: 10_000_000_000`, `min_contribution: 100_000_000`, `cap: 1_000_000_000_000`.
  - Verify your node’s exact constants in Polkadot‑JS: Developer → Chain state → Constants → `crowdloan`.

- `end` must be strictly greater than the current block and within duration bounds:
  - Check the current block at the top-left of the Polkadot‑JS UI (or the Blocks tab). On local chains with fast‑blocks enabled, this advances quickly.
  - Choose an `end` sufficiently ahead (e.g., current + 100) and within `MinimumBlockDuration` and `MaximumBlockDuration` (see Constants).

- Other creation checks to keep in mind:
  - `cap > deposit` is required.
  - The creator must have enough balance to pay `deposit`.
  - Finalization later requires `now >= end` and `raised == cap`.

- ## Contributing and managing your position
  - Contribute and partial‑cap handling
  - Withdraw before finalization
  - Tracking your share and expected emissions

- ## Finalization and lease activation
  - Success criteria
  - Funds transfer behavior
  - Executing the `register_leased_network` call
  - What gets created on success: the subnet and the proxy

- ## Emissions distribution
  - How emissions are shared pro‑rata among contributors
  - When distribution starts and when it ends
  - Perpetual vs fixed‑term leases and their implications

- ## Operating the leased subnet
  - The `SubnetLeaseBeneficiary` proxy: scope and permissions
  - Managing subnet parameters and configuration (“hyperparameters”)
  - Operational responsibilities and best practices

- ## Updating and failure modes
  - Updating min contribution, end block, and cap
  - Refunds: partial and full
  - Dissolving the crowdloan

- ## Security and trust model
  - Immutability of the call/target
  - Role separation and permissioning via proxy
  - Risks, safeguards, and recommended governance patterns

- ## How‑to guides
  - Step‑by‑step: launch a subnet via crowdloan
  - Step‑by‑step: contribute and track your emissions share

- ## Reference
  - Extrinsics: `create`, `contribute`, `withdraw`, `refund`, `finalize`, `dissolve`, `update_min_contribution`, `update_end`, `update_cap`
  - Integration: `subtensor::register_leased_network`
  - Runtime parameters (e.g., refund limits)
  - Links to CLI/API examples and code

 

### Intro draft

The crowdloan feature lets a group of people collectively fund the registration of a new Bittensor subnet and share the resulting emissions according to each person’s contribution. Instead of a single sponsor paying the full lease cost up front, a creator opens a crowdloan with a funding cap and end block, contributors deposit funds until the cap is met, and—on success—the pallet finalizes the crowdloan by funding subnet registration and activating emissions for the group.

At finalization, the system executes an on‑chain call—typically `subtensor::register_leased_network`—using the crowdloan’s funds. This registers the subnet and creates a dedicated proxy, `SubnetLeaseBeneficiary`, for the designated beneficiary. That proxy is authorized to operate the subnet (for example, configuring subnet parameters and other allowed controls) without having custody of contributor funds or emissions splits.

While the lease is active, emissions flow to contributors pro‑rata based on their contributed share. If the crowdloan is not finalized after the end block, anyone can call refunds; once all contributors are refunded, the creator can dissolve the crowdloan. The call and target address specified at creation are immutable, ensuring that the purpose of the crowdloan cannot be changed mid‑campaign. This model makes subnet bootstrapping collaborative, transparent, and permissioned through a narrowly scoped proxy for safe, ongoing operations.

- Strong defaults: immutable target and call, capped funding, clear end block
- Shared upside: emissions distributed proportionally to contributions
- Safe operations: a dedicated proxy to manage the subnet within defined permissions



## Key concepts and roles

- **Crowdloan info and storage**
  - Each crowdloan is tracked by an incrementing `CrowdloanId` and stored in `Crowdloans` alongside contributor balances in `Contributions`. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L151-L175)

- **Immutable purpose**
  - The `call` and `target_address` are set at creation and used during `finalize`. The pallet exposes the `CurrentCrowdloanId` only during dispatch so the called extrinsic can read which crowdloan is being finalized. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L553-L617)


## Lifecycle and extrinsics

- **Create** a campaign with deposit, cap, end, min contribution, optional `call` and `target_address`. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L318-L326)

- **Contribute** funds; amounts are clipped to remaining cap; contributors are counted. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L413-L420)

- **Withdraw** before finalization; creator cannot withdraw below their deposit. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L505-L525)

- **Finalize** after end when cap is fully raised. Optionally transfers to `target_address` and dispatches the stored `call`. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L566-L581)

- **Refund** loop refunds up to `RefundContributorsLimit` per call; may need multiple calls. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L637-L646)

- **Dissolve** after refunds; creator's deposit is returned and storage cleaned up. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/src/lib.rs#L711-L721)


## Creating a subnet via crowdloan

- Use `subtensor::register_leased_network` as the `call` when you `create` the crowdloan. On success, the call is executed with the creator's origin during `finalize`. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2107-L2114)

- The leasing logic consumes the crowdloan, registers the subnet, creates a proxy for the beneficiary, records contributor shares, and refunds unspent cap pro‑rata. [Source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/leasing.rs#L69-L157)


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
They enable shared funding and ownership of subnets so that no single sponsor must front the entire lock cost. Emissions are shared pro‑rata among contributors while a designated beneficiary operates the subnet via a scoped proxy.

### How does the end‑to‑end flow work?
Creator calls `create` with deposit, cap, end, and a `call` of `subtensor::register_leased_network`. Contributors fund until the cap is hit. After the end block, creator calls `finalize`; funds transfer and the stored call executes with creator origin. A subnet and a `SubnetLeaseBeneficiary` proxy are set up; contributor shares are recorded, leftover cap is refunded.

### Where can I see the exact extrinsics and storage?
See the cited code blocks in this article for `create`, `contribute`, `withdraw`, `finalize`, `refund`, `dissolve` and the storage maps `Crowdloans`, `Contributions`, `CurrentCrowdloanId`.

### Can the purpose of a crowdloan be changed after it starts?
No. The `call` and optional `target_address` are bound at creation and used at `finalize`. The pallet exposes `CurrentCrowdloanId` only during dispatch to the called extrinsic, preventing mid‑campaign repurposing.

### Who can finalize a crowdloan and when?
Only the creator, after the end block, and only if `raised == cap` and it hasn’t already been finalized.

### What happens if the cap is not reached?
Anyone can call `refund` to batch‑refund contributors (excluding the creator) up to `RefundContributorsLimit` per call. After all refunds, only the creator can `dissolve` to recover the deposit and clean storage.

### How are emissions split during a lease?
Owner rewards are split pro‑rata to contributors by their recorded `SubnetLeaseShares`; any remainder goes to the beneficiary. This runs automatically during coinbase distribution.

### What permissions does the beneficiary proxy have?
`ProxyType::SubnetLeaseBeneficiary` can invoke a curated set of calls (e.g., start subnet calls and selected admin‑utils setters like difficulty, weights, limits). It cannot perform unrestricted sudo.

### Can the campaign parameters be updated mid‑flight?
The creator can update `min_contribution`, `end`, and `cap` on a non‑finalized crowdloan, subject to checks (duration bounds, cap >= raised, etc.). The `call` and `target_address` are immutable.

### What are the defaults for deposits, contribution minimums, and timing?
Runtime defaults currently set minimum deposit, absolute minimum contribution, min/max block durations, refund batch size, and max contributors. See the Runtime parameters section for exact constants.

### Is there a maximum number of contributors?
Yes. `MaxContributors` limits unique contributors per crowdloan; contributions beyond that will be rejected.

### How are leftover funds handled at lease creation?
Any leftover cap (after paying registration + proxy cost) is refunded pro‑rata to contributors; the residual remainder goes to the beneficiary.

### How do I track my expected emissions?
Your share equals your contribution divided by total raised at `finalize`. Emissions are distributed to your coldkey during the lease according to that share.

### Can a lease be terminated early?
No. The beneficiary may terminate only after the optional `end_block` has passed; for perpetual leases there is no end block.

### What if the preimage call is missing at finalize?
`finalize` errors with `CallUnavailable` and drops the preimage reference for that call, per the pallet’s error handling. Ensure the `call` was stored as a preimage at `create` time.


## Tutorial: Launch a subnet via crowdloan (local dev with Polkadot‑JS)

This hands‑on guide mirrors production flow and uses Polkadot‑JS to submit each extrinsic from distinct wallets.

### 0) Setup

- Prepare accounts: `creator` (opens and finalizes), `beneficiary` (operates subnet), `contrib1`, `contrib2`.
- Fund them with dev TAO.
- Connect Polkadot‑JS to your local node (e.g., `ws://127.0.0.1:9944`).

Notes for local dev:
- All amounts are base units. Typical defaults: `MinimumDeposit = 10_000_000_000` (10 TAO), `AbsoluteMinimumContribution = 100_000_000` (0.1 TAO).
- Inspect your runtime constants in Polkadot‑JS: Developer → Chain state → Constants → `crowdloan`.
- `end` must be strictly greater than the current block (see top‑left block counter in Polkadot‑JS) and within `MinimumBlockDuration`/`MaximumBlockDuration`. With fast‑blocks, pick a sufficiently ahead block (e.g., current + 100).

### 1) Create the crowdloan (creator)

Polkadot‑JS: Developer → Extrinsics
- Using account: `creator`
- Call: `crowdloan.create(deposit, min_contribution, cap, end, call, target_address)`
  - deposit: e.g., `10_000_000_000`
  - min_contribution: e.g., `100_000_000`
  - cap: e.g., `1_000_000_000_000` (must be > deposit)
  - end: current block + 100 (adjust for duration bounds)
  - call (Option<Call>): set to `subtensor.register_leased_network(emissions_share, end_block)`
    - emissions_share: e.g., `30` (Percent)
    - end_block: Some(current + 500) for a fixed term, or None for perpetual
  - target_address: None
- Submit and sign.

Expected response:
- `system.ExtrinsicSuccess`
- `balances.Withdraw`
- `system.NewAccount`
- `balances.Endowed`
- `balances.Transfer`
- `crowdloan.Created`
- `balances.Deposit`
- `transactionPayment.TransactionFeePaid`
### 2) Contribute (each contributor)

Repeat for `creator` (optional), `contrib1`, `contrib2` before `end`:
- Using account: contributor wallet
- Call: `crowdloan.contribute(crowdloan_id, amount)`
- Submit and sign.

Notes:
- Amounts below `min_contribution` are rejected.
- If a contribution would exceed `cap`, it’s clipped to the remaining amount.
- You can verify state via Storage: `crowdloan.Crowdloans(id)` and `crowdloan.Contributions(id, account)`.

### 3) Finalize (creator)

After `end` passes and `raised == cap`:
- Using account: `creator`
- Call: `crowdloan.finalize(crowdloan_id)`
- Submit and sign.

On success:
- If `target_address` was set, funds are transferred to it.
- The nested `subtensor.register_leased_network` is dispatched with creator origin; the lease is created and proxy added.

### 4) Verify the leased subnet

Storage checks (Developer → Chain state → Storage):
- `subtensor.SubnetLeases(lease_id)` → shows `beneficiary`, `emissions_share`, `end_block`, `netuid`, `cost`.
- `subtensor.SubnetUidToLeaseId(netuid)` → maps subnet to lease id.
- `subtensor.SubnetLeaseShares(lease_id, contributor)` → contributor pro‑rata shares.
- Proxy (runtime dependent): proxy mappings reflect `SubnetLeaseBeneficiary` authorization for the `beneficiary`.

### 5) Optional: Observe dividends

Owner emissions are periodically split among contributors (by share) and the beneficiary. On dev, advance blocks; if it’s not the distribution block or liquidity is insufficient, dividends accumulate for later distribution.

### 6) Alternative path: Refund and dissolve (if cap not reached)

- Anyone signed: `crowdloan.refund(crowdloan_id)` repeatedly until all contributors (excluding creator) are refunded (batched up to `RefundContributorsLimit`).
- Creator: `crowdloan.dissolve(crowdloan_id)` when only the creator’s deposit remains. This cleans storage and returns the deposit.

### 7) Useful adjustments (creator)

Before finalization:
- `crowdloan.update_min_contribution(crowdloan_id, new_min)` → must be ≥ `AbsoluteMinimumContribution`.
- `crowdloan.update_end(crowdloan_id, new_end)` → must satisfy duration bounds and be > current block.
- `crowdloan.update_cap(crowdloan_id, new_cap)` → must be ≥ `raised`.

### 8) Optional: Withdraw

Before finalization:
- Any contributor can `crowdloan.withdraw(crowdloan_id)` to recover their contribution.
- The creator can only withdraw amounts above the kept deposit; the deposit itself remains until refund/dissolve.



---Below-is-CRUFT-to-delete-only-when-article-is-finished
# source to use and link to
from https://academy.binance.com/en/glossary/polkadot-crowdloan:

Polkadot Crowdloan refers to the process of staking Polkadot (DOT) tokens to support specific projects in the Polkadot Slot Auction. In return, participants can receive rewards from the projects.
Polkadot (DOT) is an open-source protocol that allows different blockchains to exchange data and applications. In the Polkadot ecosystem, there are two types of blockchains. The main chain is called the Relay Chain, while parallel blockchains are each called a parachain. You can think of Relay Chain as the heart of Polkadot that can connect different parachains. Similar to Ethereum Plasma chains, Parachains can process transactions independently of the Relay Chain. This allows Parachains to greatly improve blockchain scalability.
In order to connect parachains to the Relay Chain, parachain projects need to lease a parachain slot via the Parachain Slot Auction. Projects can bid for a slot in the auction by staking DOT, the native token of Polkadot. Projects that are willing to stake the most DOT tokens can become a Polkdot parachain and lease the slot for 12 to 96 weeks. 

To acquire more DOT tokens for the bidding, parachain teams can use Polkadot Crowdloan to obtain DOT from the community. Crowdloan is a crowdsourcing system that allows participants to support specific parachain projects by staking DOT. In a crowdloan campaign, participants that stake DOT can receive rewards from the project. These rewards can take many forms, such as tokens from the parachain they support. Once they participate in the crowdloan, the staked DOT will be locked up in the project’s slot auction bid. If the project wins the bidding, it can lease a slot to connect its parachain to the Relay Chain. The DOT tokens sourced from the crowdloan will be locked into the parachain slot for the entire lease period (between 12 to 96 weeks). 


# Crowdloan Pallet
source: https://github.com/opentensor/subtensor/blob/main/pallets/crowdloan/README.md

## Overview

A pallet that enables the creation and management of generic crowdloans for transferring funds and executing an arbitrary call.

Users of this pallet can create a crowdloan by providing a deposit, a cap, an end block, an optional target address and an optional call.

Users can contribute to a crowdloan by providing funds to the crowdloan they choose to support. The contribution can be withdrawn while the crowdloan is not finalized.

Once the crowdloan is finalized, the funds will be transferred to the target address if provided; otherwise, the end user is expected to transfer them manually on-chain if the call is a pallet extrinsic. The call will be dispatched with the current crowdloan ID stored as a temporary item.

If the crowdloan fails to reach the cap, the creator can decide to refund all contributors and dissolve the crowdloan. The initial deposit will be refunded.

*The call or target address provided when creating the crowdloan is guaranteed to never change. Only the minimum contribution, end block and cap can be updated from the crowdloan creator.*

## Interface

- `create`: Create a crowdloan that will raise funds up to a maximum cap and if successful, will transfer funds to the target address if provided and/or dispatch the call (using creator origin). The initial deposit will be transfered to the crowdloan account and will be refunded in case the crowdloan fails to raise the cap. Additionally, the creator will pay for the execution of the call.

- `contribute`: Contribute to an active crowdloan. The contribution will be transfered to the crowdloan account and will be refunded if the crowdloan fails to raise the cap. If the contribution would raise the amount above the cap, the contribution will be set to the amount that is left to be raised.

- `withdraw`: Withdraw a contribution from an active (not yet finalized or dissolved) crowdloan. Only contributions over the deposit can be withdrawn by the creator.

- `refund`: Try to refund all contributors (excluding the creator) up to the limit defined by runtime parameter `RefundContributorsLimit` (currently set to 50 in the default runtime). If the limit is reached, the call will stop and the crowdloan will be marked as partially refunded. It may be needed to dispatch this call multiple times to refund all contributors.

The following functions are only callable by the creator of the crowdloan:

- `finalize`: Finalize a successful crowdloan. The call will transfer the raised amount to the target address if it was provided when the crowdloan was created and dispatch the call that was provided using the creator origin. 

- `dissolve`: Dissolve a crowdloan. The crowdloan will be removed from the storage. All contributions must have been refunded before the crowdloan can be dissolved (except the creator's one).

- `update_min_contribution`: Update the minimum contribution of a non-finalized crowdloan.

- `update_end`: Update the end block of a non-finalized crowdloan.

- `update_cap`: Update the cap of a non-finalized crowdloan.

## Integration with subnet leasing (from the subtensor pallet)

The `crowdloan` pallet can be used to create a crowdloan that will be used to register a new leased network through a crowdloan using the `register_leased_network` extrinsic from the `subtensor` pallet as a call parameter to the crowdloan pallet `create` extrinsic. A new subnet will be registered paying the lock cost using the crowdloan funds and a proxy will be created for the beneficiary to operate the subnet.

When active, the lease will distribute dividends to the contributors according to their contribution to the crowdloan and the lease can be operated by the beneficiary using the proxy created `SubnetLeaseBeneficiary`.

If the lease is perpetual, the lease will never be terminated and emissions will continue to be distributed to the contributors.

If the lease has an end block, the lease can be terminated when end block has passed and the subnet ownership will be transferred to the beneficiary.


