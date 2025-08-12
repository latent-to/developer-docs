---
title: "Crowdloans"
---

- ## What is a subnet crowdloan?
  - Problem it solves
  - How it differs from traditional “token sale” funding
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

- ## FAQ
  - Common operational and economic questions
  - Troubleshooting

### Intro draft

The crowdloan feature lets a group of people collectively fund the registration of a new Bittensor subnet and share the resulting emissions according to each person’s contribution. Instead of a single sponsor paying the full lease cost up front, a creator opens a crowdloan with a funding cap and end block, contributors deposit funds until the cap is met, and—on success—the pallet finalizes the crowdloan by funding subnet registration and activating emissions for the group.

At finalization, the system executes an on‑chain call—typically `subtensor::register_leased_network`—using the crowdloan’s funds. This registers the subnet and creates a dedicated proxy, `SubnetLeaseBeneficiary`, for the designated beneficiary. That proxy is authorized to operate the subnet (for example, configuring subnet parameters and other allowed controls) without having custody of contributor funds or emissions splits.

While the lease is active, emissions flow to contributors pro‑rata based on their contributed share. If the crowdloan does not reach its cap by the end block, the creator can trigger refunds and dissolve the crowdloan. The call and target address specified at creation are immutable, ensuring that the purpose of the crowdloan cannot be changed mid‑campaign. This model makes subnet bootstrapping collaborative, transparent, and permissioned through a narrowly scoped proxy for safe, ongoing operations.

- Strong defaults: immutable target and call, capped funding, clear end block
- Shared upside: emissions distributed proportionally to contributions
- Safe operations: a dedicated proxy to manage the subnet within defined permissions



## Key concepts and roles

- **Crowdloan info and storage**
  - Each crowdloan is tracked by an incrementing `CrowdloanId` and stored in `Crowdloans` alongside contributor balances in `Contributions`.
```151:175:subtensor/pallets/crowdloan/src/lib.rs
    #[pallet::storage]
    pub type Crowdloans<T: Config> =
        StorageMap<_, Twox64Concat, CrowdloanId, CrowdloanInfoOf<T>, OptionQuery>;
    #[pallet::storage]
    pub type NextCrowdloanId<T> = StorageValue<_, CrowdloanId, ValueQuery, ConstU32<0>>;
    #[pallet::storage]
    pub type Contributions<T: Config> = StorageDoubleMap<
        _, Twox64Concat, CrowdloanId, Identity, T::AccountId, BalanceOf<T>, OptionQuery,
    >;
    #[pallet::storage]
    pub type CurrentCrowdloanId<T: Config> = StorageValue<_, CrowdloanId, OptionQuery>;
```

- **Immutable purpose**
  - The `call` and `target_address` are set at creation and used during `finalize`. The pallet exposes the `CurrentCrowdloanId` only during dispatch so the called extrinsic can read which crowdloan is being finalized.
```553:617:subtensor/pallets/crowdloan/src/lib.rs
/// Finalize a successful crowdloan.
// ... existing code ...
// Set the current crowdloan id so the dispatched call can access it temporarily
CurrentCrowdloanId::<T>::put(crowdloan_id);
// Retrieve and dispatch the stored call with creator origin
stored_call.dispatch(frame_system::RawOrigin::Signed(who).into())?;
// Clear the current crowdloan id
CurrentCrowdloanId::<T>::kill();
```


## Lifecycle and extrinsics

- **Create** a campaign with deposit, cap, end, min contribution, optional `call` and `target_address`.
```318:326:subtensor/pallets/crowdloan/src/lib.rs
pub fn create(
    origin: OriginFor<T>,
    #[pallet::compact] deposit: BalanceOf<T>,
    #[pallet::compact] min_contribution: BalanceOf<T>,
    #[pallet::compact] cap: BalanceOf<T>,
    #[pallet::compact] end: BlockNumberFor<T>,
    call: Option<Box<<T as Config>::RuntimeCall>>,
    target_address: Option<T::AccountId>,
) -> DispatchResult
```

- **Contribute** funds; amounts are clipped to remaining cap; contributors are counted.
```413:420:subtensor/pallets/crowdloan/src/lib.rs
pub fn contribute(
    origin: OriginFor<T>,
    #[pallet::compact] crowdloan_id: CrowdloanId,
    #[pallet::compact] amount: BalanceOf<T>,
) -> DispatchResult {
    let contributor = ensure_signed(origin)?;
    let now = frame_system::Pallet::<T>::block_number();
```

- **Withdraw** before finalization; creator cannot withdraw below their deposit.
```505:525:subtensor/pallets/crowdloan/src/lib.rs
pub fn withdraw(
    origin: OriginFor<T>,
    #[pallet::compact] crowdloan_id: CrowdloanId,
) -> DispatchResult {
    let who = ensure_signed(origin)?;
    // creator keeps the deposit
    if who == crowdloan.creator { /* ... */ }
```

- **Finalize** after end when cap is fully raised. Optionally transfers to `target_address` and dispatches the stored `call`.
```566:581:subtensor/pallets/crowdloan/src/lib.rs
pub fn finalize(
    origin: OriginFor<T>,
    #[pallet::compact] crowdloan_id: CrowdloanId,
) -> DispatchResult {
    let who = ensure_signed(origin)?;
    ensure!(now >= crowdloan.end, Error::<T>::ContributionPeriodNotEnded);
    ensure!(crowdloan.raised == crowdloan.cap, Error::<T>::CapNotRaised);
```

- **Refund** loop refunds up to `RefundContributorsLimit` per call; may need multiple calls.
```637:646:subtensor/pallets/crowdloan/src/lib.rs
pub fn refund(
    origin: OriginFor<T>,
    #[pallet::compact] crowdloan_id: CrowdloanId,
) -> DispatchResultWithPostInfo {
    let now = frame_system::Pallet::<T>::block_number();
```

- **Dissolve** after refunds; creator’s deposit is returned and storage cleaned up.
```711:721:subtensor/pallets/crowdloan/src/lib.rs
pub fn dissolve(
    origin: OriginFor<T>,
    #[pallet::compact] crowdloan_id: CrowdloanId,
) -> DispatchResult {
    let who = ensure_signed(origin)?;
    ensure!(!crowdloan.finalized, Error::<T>::AlreadyFinalized);
```


## Creating a subnet via crowdloan

- Use `subtensor::register_leased_network` as the `call` when you `create` the crowdloan. On success, the call is executed with the creator’s origin during `finalize`.
```2107:2114:subtensor/pallets/subtensor/src/macros/dispatches.rs
#[pallet::call_index(110)]
pub fn register_leased_network(
    origin: T::RuntimeOrigin,
    emissions_share: Percent,
    end_block: Option<BlockNumberFor<T>>,
) -> DispatchResultWithPostInfo
```

- The leasing logic consumes the crowdloan, registers the subnet, creates a proxy for the beneficiary, records contributor shares, and refunds unspent cap pro‑rata.
```69:101:subtensor/pallets/subtensor/src/subnets/leasing.rs
pub fn do_register_leased_network(
    origin: T::RuntimeOrigin,
    emissions_share: Percent,
    end_block: Option<BlockNumberFor<T>>,
) -> DispatchResultWithPostInfo {
    let who = ensure_signed(origin)?;
    let (crowdloan_id, crowdloan) = Self::get_crowdloan_being_finalized()?;
    // Transfer funds to lease coldkey and register subnet
    <T as Config>::Currency::transfer(&crowdloan.funds_account, &lease_coldkey, crowdloan.raised, Preservation::Expendable)?;
    Self::do_register_network(RawOrigin::Signed(lease_coldkey.clone()).into(), &lease_hotkey, 1, None)?;
```
```112:129:subtensor/pallets/subtensor/src/subnets/leasing.rs
// Enable the beneficiary to operate the subnet through a proxy
T::ProxyInterface::add_lease_beneficiary_proxy(&lease_coldkey, &who)?;
// Compute cost and store lease metadata
SubnetLeases::<T>::insert(lease_id, SubnetLease { beneficiary: who.clone(), /* ... */ emissions_share, end_block, netuid, cost });
```
```139:157:subtensor/pallets/subtensor/src/subnets/leasing.rs
// Record contributor shares and refund leftover cap proportionally
for (contributor, amount) in contributions {
    let share: U64F64 = U64F64::from(amount).saturating_div(U64F64::from(crowdloan.raised));
    SubnetLeaseShares::<T>::insert(lease_id, &contributor, share);
    let contributor_refund = share.saturating_mul(U64F64::from(leftover_cap)).floor().saturating_to_num::<u64>();
    <T as Config>::Currency::transfer(&lease_coldkey, &contributor, contributor_refund, Preservation::Expendable)?;
}
```


## Emissions distribution during a lease

- When owner rewards are paid to a leased subnet, they are split into contributor dividends and a beneficiary cut.
```450:452:subtensor/pallets/subtensor/src/coinbase/run_coinbase.rs
if let Some(lease_id) = SubnetUidToLeaseId::<T>::get(netuid) {
    Self::distribute_leased_network_dividends(lease_id, real_owner_cut);
}
```

- Distribution is pro‑rata by recorded share; any remainder goes to the beneficiary.
```324:339:subtensor/pallets/subtensor/src/subnets/leasing.rs
for (contributor, share) in SubnetLeaseShares::<T>::iter_prefix(lease_id) {
    let tao_for_contributor = share.saturating_mul(U64F64::from(tao_unstaked.to_u64())).floor().saturating_to_num::<u64>();
    Self::add_balance_to_coldkey_account(&contributor, tao_for_contributor);
    tao_distributed = tao_distributed.saturating_add(tao_for_contributor.into());
}
let beneficiary_cut_tao = tao_unstaked.saturating_sub(tao_distributed);
Self::add_balance_to_coldkey_account(&lease.beneficiary, beneficiary_cut_tao.into());
```


## Operating the leased subnet via proxy

- On successful registration, a `SubnetLeaseBeneficiary` proxy is added from the lease coldkey to the beneficiary. This proxy can call a narrowly scoped set of operations to operate the subnet.
```886:907:subtensor/runtime/src/lib.rs
impl ProxyInterface<AccountId> for Proxier {
    fn add_lease_beneficiary_proxy(lease: &AccountId, beneficiary: &AccountId) -> DispatchResult {
        pallet_proxy::Pallet::<Runtime>::add_proxy_delegate(
            lease,
            beneficiary.clone(),
            ProxyType::SubnetLeaseBeneficiary,
            0,
        )
    }
}
```

- Allowed calls for `ProxyType::SubnetLeaseBeneficiary` include starting subnet calls and selected admin‑utils setters (hyperparameters), not unrestricted sudo.
```792:852:subtensor/runtime/src/lib.rs
ProxyType::SubnetLeaseBeneficiary => matches!(
    c,
    RuntimeCall::SubtensorModule(pallet_subtensor::Call::start_call { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_serving_rate_limit { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_min_difficulty { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_max_difficulty { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_weights_version_key { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_adjustment_alpha { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_max_weight_limit { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_immunity_period { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_min_allowed_weights { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_kappa { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_rho { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_activity_cutoff { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_network_registration_allowed { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_network_pow_registration_allowed { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_max_burn { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_bonds_moving_average { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_bonds_penalty { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_commit_reveal_weights_enabled { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_liquid_alpha_enabled { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_alpha_values { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_commit_reveal_weights_interval { .. })
        | RuntimeCall::AdminUtils(pallet_admin_utils::Call::sudo_set_toggle_transfer { .. })
)
```


## Runtime parameters (defaults)

These constants define crowdloan requirements and operational limits in the runtime:
```1556:1571:subtensor/runtime/src/lib.rs
parameter_types! {
    pub const CrowdloanPalletId: PalletId = PalletId(*b"bt/cloan");
    pub const MinimumDeposit: Balance = 10_000_000_000; // 10 TAO
    pub const AbsoluteMinimumContribution: Balance = 100_000_000; // 0.1 TAO
    pub const MinimumBlockDuration: BlockNumber = /* 7 days or 50 on fast-blocks */;
    pub const MaximumBlockDuration: BlockNumber = /* 60 days or 20000 on fast-blocks */;
    pub const RefundContributorsLimit: u32 = 50;
    pub const MaxContributors: u32 = 500;
}
```

Implications:
- **Refund batching**: Up to 50 contributors are processed per `refund` call.
- **Duration bounds**: Ensures campaigns are neither too short nor too long.
- **Contribution floor**: Enforces a minimum "ticket size" for contributors.

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

- `refund`: Try to refund all contributors (excluding the creator) up to the limit defined by a runtime parameter *RefundContributorsLimit* (currently set to 5). If the limit is reached, the call will stop and the crowdloan will be marked as partially refunded. It may be needed to dispatch this call multiple times to refund all contributors.

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


