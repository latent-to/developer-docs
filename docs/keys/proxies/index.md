# Proxies

This document introduces the proxy pattern used in Bittensor and explains how it enables secure delegation of account permissions for specific classes of calls.

---

## What is a proxy?

Rather than using funds in a single account, smaller accounts with unique roles can complete tasks on behalf of the main stash account.
A proxy lets one account (the delegator, or "real" account) authorize another account (the delegate) to make permitted calls on its behalf. Proxies allow a delegator to keep their "real" accounts safe and "cold", thereby adding an extra layer of security to the tokens in the account.

The permission scope is determined by the `ProxyType` call filter. This call filter allows the delegator account set the roles and limitations of the delegate account. Optionally, actions can require an on-chain announcement period—`delay`, giving the delegator time to reject a call made by a delegate.

## Proxy terminology

The following concepts define how proxy relationships are set up and managed:

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

A proxy relationship starts when the _real account_—delegator—creates a proxy entry, which specifies or creates the _delegate account_, the allowed `ProxyType`, and an optional delay. Once this entry exists, the delegate can execute permitted calls on behalf of the real account using the `proxy(real, forceProxyType, call)` extrinsic.

If the proxy entry includes a non-zero delay, the delegate cannot execute the call immediately. Instead, they must first announce the intended action and wait for the delay period to pass. During this waiting window, the delegator has the ability to reject the announcement, effectively blocking the call. The delegate can also remove a call they previously announced and return the deposit.

The real account always retains full control over the relationship. It can revoke a delegate’s access at any time by removing the proxy entry, immediately disabling the delegate’s ability to act on its behalf.

## Types of proxies

When setting up a proxy, there are two aspects of proxy setup:

1. **Proxy Account Type**

This determines how the proxy is set up and managed. When creating a proxy, you can choose between two account types:

- **Standard Proxy Account**: Registers an existing account as a proxy for the delegator. The assigned account now acts as a delegate and can make calls on behalf of the delegator, according to the configured `ProxyType`. You can create it with the `addProxy` extrinsic.

- **Pure Proxy Account**: Creates a new account that cannot be accessed directly to act as the delegate. This account is initialized with a proxy of the specified `ProxyType` for the origin sender, and all actions are signed by the delegator on its behalf. You can create it with the `createPure` extrinsic.

:::warning
Pure proxies are _keyless_, _non-deterministic_ accounts. They have no private key, cannot sign transactions themselves, and cannot be recovered. If the relationship between the delegator and the pure proxy is broken, any funds in the pure proxy account are permanently lost.
:::

2. **`ProxyType`**

This defines what the proxy is allowed to do on behalf of the real account. It describes the capabilities of that proxy (e.g., staking-only, governance-only, transfer-only, etc.).

The following table shows the available `ProxyType` options and their descriptions:

| `ProxyType`              | Description                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `Any`                    | Grants full permissions. This is the most permissive `ProxyType`; use with caution. |
| `Owner`                  | Allows subnet owner operations.                                                     |
| `NonCritical`            | Allows only non-critical operations.                                                |
| `NonTransfer`            | Blocks all transfer operations.                                                     |
| `Senate`                 | Allows senate governance operations.                                                |
| `NonFungible`            | Blocks all TAO transfer or movement.                                                |
| `Triumvirate`            | Allows triumvirate governance operations.                                           |
| `Governance`             | Covers both senate and triumvirate governance operations.                           |
| `Staking`                | Allows staking-related operations.                                                  |
| `Registration`           | Allows registration-related operations.                                             |
| `Transfer`               | Allows unrestricted transfer operations.                                            |
| `SmallTransfer`          | Allows transfers capped at 0.5 TAO.                                                 |
| `RootWeights`            | Deprecated.                                                                         |
| `ChildKeys`              | Allows child key operations.                                                        |
| `SudoUncheckedSetCode`   | Restricted to a single privileged call form.                                        |
| `SwapHotkey`             | Allows hotkey swap operations.                                                      |
| `SubnetLeaseBeneficiary` | Allows management of leased subnets.                                                |

### Choosing the Right `ProxyType`

When setting up proxies, always follow the principle of least privilege. Choose the narrowest `ProxyType` that covers the intended actions instead of defaulting to broad permissions. For example:

- Operational tasks: `Staking`, `Registration`, `ChildKeys`, `SwapHotkey`.
- Governance actions: `Triumvirate`, `Senate`, or `Governance` (broader).
- Funds movement: `Transfer` or `SmallTransfer` (with per-transfer limit).
- Subnet leasing: `SubnetLeaseBeneficiary`.

Only use the unrestricted `Any` type when no other option fits. If a proxy call fails with `proxy.Unproxyable` or `system.CallFiltered`, it usually means the selected `ProxyType` doesn’t permit that call. In such cases, switch to a more suitable type or create a separate proxy with proper scope.

## Proxy Usage Limits

To ensure scalability and prevent abuse, proxy usage is subject to certain limits as shown:

- **`MaxProxies`**: This refers to the maximum number of delegate accounts that can be linked to a single real account. Each account can register up to 20 proxies in total. See [source code](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L644).
- **`MaxPending`**: This refers to the maximum number of pending announcements that a delegate account can have. This limit helps prevent excessive queuing. Each account can have up to 75 pending announcements at a time. See [source code](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L645).

## Best practices for using proxies

When setting up and using proxies, it’s important to follow practices that reduce security risks and operational overhead. The following guidelines highlight how to map permissions correctly, manage delays, and keep accounts secure while making proxy usage efficient:

- Map your operational needs to a minimal `ProxyType`. If a type seems overly broad, consider whether a more restrictive variant exists.
- Use non-zero delays for high-risk actions; monitor announcements.
- Track deposits and limits; batch or clear announcements to avoid dangling deposits.
- Keep the real account cold; use the delegate hot account operationally.
