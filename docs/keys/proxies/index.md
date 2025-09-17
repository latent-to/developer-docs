# Proxies

This document introduces the proxy pattern used in Bittensor and explains how it enables secure delegation of account permissions for specific classes of calls.

---

## What is a proxy?

Rather than using funds in a single account, smaller accounts with unique roles can complete tasks on behalf of the main stash account.
A proxy lets one account (the delegator, or "real" account) authorize another account (the delegate) to make permitted calls on its behalf. Proxies allow a delegator to keep their "real" accounts safe and "cold", thereby adding an extra layer of security to the tokens in the account.

The permission scope is determined by the `ProxyType` call filter. This call filter allows the delegator account set the roles and limitations of the delegate account. Optionally, actions can require an on-chain announcement window—`delay`,giving the delegator time to veto.

## Proxy terminology

When working with proxy accounts, it’s important to understand the roles and terms used. The following concepts define how proxy relationships are set up and managed:

- **Real account**: The account whose identity and funds are at stake.
- **Delegate account**: The account with access to tokens in the real account and allowed to perform certain actions for the real account.
- **ProxyType**: A capability profile that restricts which calls can be made by the delegate account.
- **Delay/announcement**: Optional time window before a proxy action can be executed.

## Common use cases

Proxies enable secure delegation of account responsibilities. Below are common scenarios where proxies are used effectively:

- **Operational delegation**: run operational tasks (e.g., staking, subnet operations) from a hot wallet while securing funds in a cold wallet.
- **Least-privilege permissions**: only allow a constrained set of calls (e.g., small transfers, staking-only, governance-only).
- **Automated agents**: let bots/services act with limited authority.

## How it works

1. The real account adds a proxy entry: (delegate, ProxyType, delay).
2. The delegate can invoke `proxy(real, proxy_type?, call)` to execute an allowed call.
3. If the proxy definition has a non-zero delay, the delegate must first announce the call and wait the delay before executing.
4. The real account may reject announcements during the waiting period.
5. The real account can remove proxies at any time to revoke access.

Economic and storage safeguards:

- Deposits are reserved per-proxy and per-announcement to prevent spam.
- Limits exist on the maximum number of proxies and pending announcements.

---

## Runtime configuration

At the runtime level, the Proxy pallet is configured with:

- Deposits: `ProxyDepositBase`, `ProxyDepositFactor`, `AnnouncementDepositBase`, `AnnouncementDepositFactor`.
- Limits: `MaxProxies` per account, `MaxPending` pending announcements.
- Hasher for call announcements: `CallHasher` (Blake2 256).
- Weight accounting for proxy calls.

The runtime uses a strongly-typed `ProxyType` enum implementing an `InstanceFilter<RuntimeCall>` that determines which calls are permitted for each type.

Common `ProxyType` categories include (names illustrative):

- **Any**: full permissions (most permissive; use with caution).
- **NonTransfer / NonFungibile**: forbids currency or token-transfer operations while allowing other actions.
- **Transfer / SmallTransfer**: limited to transfers, with `SmallTransfer` capped below a threshold.
- **Owner / Governance / Triumvirate / Senate**: governance-scoped authorities.
- **Staking / Registration / ChildKeys / SwapHotkey**: targeted Subtensor operations.
- **SubnetLeaseBeneficiary**: narrowly-scoped permissions to operate leased subnets.
- **SudoUncheckedSetCode**: extremely restricted to a single privileged call form.

Superset logic enforces relationships (e.g., `Transfer` ⊇ `SmallTransfer`; `Governance` ⊇ `Triumvirate|Senate`).

---

## Storage and Events

Key storage items:

- `Proxies(real) -> (BoundedVec<ProxyDefinition>, deposit)`
- `Announcements(delegate) -> (BoundedVec<Announcement>, deposit)`

Important events (conceptual):

- Proxy added/removed for a real account.
- Announcement made/removed.
- Proxy call executed.

---

## Lifecycle: Adding, Announcing, Executing, Removing

1. Add proxy: Real account reserves deposit and records `(delegate, ProxyType, delay)`.
2. (Optional) Announce: Delegate submits a call hash; deposit reserved; timer starts.
3. Execute: After delay, delegate calls `proxy(real, proxy_type?, call)`; runtime checks filter and delay, then dispatches.
4. Remove proxy or announcement: Real account or delegate can clean up state and reclaim deposits (subject to rules).

Security notes:

- Prefer least-privilege `ProxyType` profiles.
- Use non-zero delays for high-risk actions; monitor announcements.
- Keep the real account cold; use the delegate hot account operationally.

---

## Bittensor-Specific Usage: Subnet Leasing

Subtensor integrates proxies for subnet leasing. When a subnet lease is initiated, the beneficiary receives a scoped proxy (`SubnetLeaseBeneficiary`) from the lease owner so the beneficiary can operate subnet-specific calls without broad access to the owner’s funds.

Typical flow:

- Lease owner authorizes beneficiary via a lease flow that internally adds the proxy.
- Beneficiary operates the subnet with constrained privileges.
- On lease termination, the proxy is revoked.

---

## Developer Tips

- Map your operational needs to a minimal `ProxyType`. If a type seems overly broad, consider whether a more restrictive variant exists.
- Track deposits and limits; batch or clear announcements to avoid dangling deposits.
- For automated systems, implement announcement management and retries on dispatch errors (`Unproxyable`, `Unannounced`, `TooMany`).
- Always have a recovery path: keep the real account secured and able to remove proxies rapidly.
