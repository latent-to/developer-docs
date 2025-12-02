---
title: "Proxies: Overview"
---

# Proxies: Overview

This page introduces the theory and use of proxy wallets for enhanced security in Bittensor.

See [Working with Proxies](./proxies/working-with-proxies)

## Introduction: What is a proxy?

Proxies allow one wallet to perform Bittensor operations on behalf of another. Used correctly, this allows you to add a strong layer of additional protection for your most important wallets and the valuable assets they control, such as large TAO or alpha holdings, or subnet ownership. Proxy relationships are useful both for one person managing their own coldkey security, and also for allowing one person to on behalf of another person or an organization.

The private key and seed phrase for a highly valuable wallet's coldkey should be kept offline as much as possible, and only used via a dedicated, highly secure [coldkey workstation](../coldkey-hotkey-security.md). By allowing one coldkey to serve as a *proxy* or stand-in for another, the "real account" or "safe wallet", we add an additional layer of security for the safe wallet by leaving it in cold storage and using the proxy instead.

### Common use cases

Proxies are useful in many situations where the permissions of one coldkey should be gated behind another level of security:

- **Staking operations**: Keep your coldkey secure in cold storage while using a proxy to manage staking operations. 
	
	See [Staking with a Proxy](../../keys/proxies/staking-with-proxy.md).
- **Operational delegation**: run subnet operations tasks like setting hyperparameters from a designated operations wallet, allowing the owner wallet to remain in maximum-security deep storage.
- **Least-privilege permissions**: allow an employee or other designated operoator to perform a constrained set of calls on a project-owned wallet.

### Scope and Delays

The power of proxies as a security tool comes from the two ways proxies can be limited: in the scope of their permissions, and by requiring a delay with announcement before they can perform operations. It's critical to note that without using these constraints properly, proxies don't necessarily give any security benefit.

- The proxy can be constrained to specific operations. The permission scope is determined by the `ProxyType` call filter. 
- The proxy can be constrained by a **delay** with a public **announcement**, giving the safe wallet holder time to reject a call made by they proxy (for example, if a key has been compromised).





### Terminology and parameters

- Safe wallet/real account: The wallet/account being protected by the proxy relationship.
- Proxy wallet/account: The account with access to tokens in the real account and allowed to perform certain actions for the real account.
- Pure Proxy: A keyless stand-in wallet controlled by the real accountused primarily
- ProxyType: Optional call filter that restricts which calls can be made by the delegate account.
- Delay/announcement: Optional time-lock period (in blocks) before a proxy action can be executed. A delay of `0` means the proxy can be used immediately without announcements. A non-zero delay requires the delegate to announce calls first, wait for the delay period to pass, then execute them, giving the real account time to review and reject unwanted operations.

A proxy relationship begins when the _real account/safe wallet_ creates a proxy entry, which specifies or creates the _delegate account_, the allowed `ProxyType`, and an optional delay. Once this entry exists, the delegate can execute permitted calls on behalf of the real account using the `proxy(real, forceProxyType, call)` extrinsic.

If the proxy entry includes a non-zero delay, the delegate cannot execute the call immediately. Instead, they must first announce the intended action and wait for the delay period to pass. During this waiting window, the delegator has the ability to reject the announcement, effectively blocking the call. The delegate can also remove a call they previously announced and return the deposit.

The real account always retains full control over the relationship. It can revoke a proxy’s access to their proxy operations at any time by removing the proxy entry, immediately disabling the delegate’s ability to act on its behalf.

:::note proxies vs pure proxies
*Proxies*, which 'stand in' for a real account by initiating transactions on its behalf, must not be confused with *pure proxies*, which 'stand-in' for the real account in a reverse relationship, where the real account can initiate transactions on behalf of the pure proxy. Pure proxies are primarily designed to be used with multi-sig wallets.

See also:

- [Pure proxies](../keys/proxies/pure-proxies)
- [Multi-sig wallets](../keys/multisig)
- [Polkadot.js Substrate Proxy Docs](https://wiki.polkadot.com/learn/learn-proxies/)
:::


## `ProxyType`

This defines what the proxy is allowed to do on behalf of the real account. It describes the capabilities of that proxy (e.g., staking-only, transfer-only, registration-only, etc.).

The following table shows the available `ProxyType` options and their descriptions:

| `ProxyType`              | Description                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `Any`                    | Grants full permissions to execute any call on behalf of the real account. This is the most permissive `ProxyType`; use with caution. |
| `Owner`                  | Allows subnet identity and settings management. Permitted operations: AdminUtils calls (except `sudo_set_sn_owner_hotkey`), `set_subnet_identity`, `update_symbol`. |
| `NonCritical`            | Allows all operations except critical ones that could harm the account. Prohibited operations: `dissolve_network`, `root_register`, `burned_register`, Sudo calls. |
| `NonTransfer`            | Allows all operations except token transfers. Prohibited operations: all Balances module calls, `transfer_stake`, `schedule_swap_coldkey`, `swap_coldkey`. |
| `NonFungible`            | Allows all operations except token-related operations and registrations. Prohibited operations: all Balances module calls, all staking operations (`add_stake`, `remove_stake`, `unstake_all`, `swap_stake`, `move_stake`, `transfer_stake`), registration operations (`burned_register`, `root_register`), key swap operations (`schedule_swap_coldkey`, `swap_coldkey`, `swap_hotkey`). |
| `Staking`                | Allows only staking-related operations: `add_stake`, `add_stake_limit`, `remove_stake`, `remove_stake_limit`, `remove_stake_full_limit`, `unstake_all`, `unstake_all_alpha`, `swap_stake`, `swap_stake_limit`, `move_stake`. |
| `Registration`           | Allows only neuron registration operations: `burned_register`, `register`. |
| `Transfer`               | Allows only token transfer operations: `transfer_keep_alive`, `transfer_allow_death`, `transfer_all`, `transfer_stake`. |
| `SmallTransfer`          | Allows only small token transfers below 0.5 TAO. Permitted operations: `transfer_keep_alive`, `transfer_allow_death` (if value < 0.5 TAO), `transfer_stake` (if alpha_amount < 0.5 TAO). |
| `ChildKeys`              | Allows only child key management operations: `set_children`, `set_childkey_take`. |
| `SudoUncheckedSetCode`   | Allows only runtime code updates: `sudo_unchecked_weight` with inner call `System::set_code`. |
| `SwapHotkey`             | Allows only hotkey swap operations: `swap_hotkey`. |
| `SubnetLeaseBeneficiary` | Allows subnet management and configuration operations: `start_call`, multiple `AdminUtils.sudo_set_*` calls for subnet parameters, network settings, weights, alpha values, etc. |
| `RootClaim`              | Allows only root claim operations: `claim_root`. |



## Best practices for using proxies

When setting up and using proxies, it's important to follow practices that reduce security risks and operational overhead. The following guidelines highlight how to map permissions correctly, manage delays, and keep accounts secure while making proxy usage efficient:

- Map your operational needs to a minimal `ProxyType`. If a type seems overly broad, consider whether a more restrictive variant exists.
- Use non-zero delays for high-risk actions; monitor announcements.
- Track deposits and limits; batch or clear announcements to avoid dangling deposits.
- Favor maximum security over convenience when protecting your real account coldkey, using a more convenient but less protected mode of access to your proxy wallet for day for operations.

### Choosing the Right `ProxyType`

When setting up proxies, always follow the principle of least privilege. Choose the narrowest `ProxyType` that covers the intended actions instead of defaulting to broad permissions. For example:

- Operational tasks: `Staking`, `Registration`, `ChildKeys`, `SwapHotkey`.
- Funds movement: `Transfer` or `SmallTransfer` (with per-transfer limit).
- Subnet management: `Owner` (for identity and settings), `SubnetLeaseBeneficiary` (for leased subnets).
- Root claims: `RootClaim`.

Only use the unrestricted `Any` type when no other option fits. If a proxy call fails with `proxy.Unproxyable` or `system.CallFiltered`, it usually means the selected `ProxyType` doesn't permit that call. In such cases, switch to a more suitable type or create a separate proxy with proper scope.

### Proxy Usage Limits

To ensure scalability and prevent abuse, proxy usage is subject to certain limits as shown:

- **`MaxProxies`**: This refers to the maximum number of delegate accounts that can be linked to a single real account. Each account can register up to 20 proxies in total. See [source code: MaxProxies configuration](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L670).
- **`MaxPending`**: This refers to the maximum number of pending announcements that a delegate account can have. This limit helps prevent excessive queuing. Each account can have up to 75 pending announcements at a time. See [source code: MaxPending configuration](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L671).
