---
title: "Coldkey and Hotkey Workstation Security"
---

import { SecurityWarning } from "./\_security-warning.mdx";

# Coldkey and Hotkey Workstation Security

<SecurityWarning />

See also:

- [Intro to Wallets, Coldkeys and Hotkeys in Bittensor](./wallets)
- Bittensor CLI: Permissions Guide
- [Handle your Seed Phrase/Mnemonic Securely](./handle-seed-phrase)

## Security model

Bittensor operations fall into several tiers of security risk based on which key is required:

| Tier | Key required | Recommended environment |
|---|---|---|
| **Permissionless** | Public key only | Any device |
| **Hotkey operational** | Hotkey | Mining/validation server |
| **Coldkey operational** | Scoped proxy coldkey | Internet-connected workstation |
| **Custody** | Primary coldkey | Hardware wallet only |


## Permissionless workstation

You can check public information about Bittensor wallets (including your TAO and alpha stake balances), subnets, validators, and more _without_ using a private key. Transaction information is public on the Bittensor blockchain, with parties identified by their coldkey public key.

Whenever possible, do read-only work on a device that does _not_ have any private key loaded.

To use `btcli` as a permissionless workstation, import only your coldkey **public key**:

```shell
btcli w regen-coldkeypub --ss58 <YOUR COLDKEY PUBLIC KEY>
```

Then view balances, stakes, and blockchain state:

```shell
btcli view dashboard
```

Websites that offer permissionless browsing of Bittensor data:

- [taostats.io](https://taostats.io)
- [TAO.app (without loading a private key)](https://tao.app)

## Cold custody: hardware wallets

Your primary coldkey is the ultimate authority over your Bittensor wallet. It controls all TAO and alpha balances. **This key should live in a hardware wallet and never be exported to any machine.**

Hardware wallets keep the private key inside the device. Signing happens on the device itself; the key is never exposed to the host machine's operating system.






### Operations requiring the primary coldkey

Only two operations strictly require the primary coldkey:

1. **Initial proxy setup**: creating the very first proxy relationship on a new coldkey, since no proxy exists yet to act on its behalf.
2. **Coldkey rotation**: swapping to a new coldkey.

All other operations, including rejecting proxy announcements, can be done through a `NonTransfer` proxy.

For these, use your hardware wallet (Ledger or Polkadot Vault). Both support proxy creation and coldkey rotation.

**After the initial proxy is in place, use it to manage all subsequent proxy relationships.** A `NonTransfer` proxy can create and remove other proxies, and perform batch operations so the primary coldkey never needs to leave cold storage again. The recommended pattern:

1. From your hardware wallet, create a single `NonTransfer` proxy with a non-zero delay.
2. Use that proxy to create narrower, scoped proxies (`Staking`, `Registration`, etc.) as needed.
3. Use those scoped proxies for day-to-day operations.
4. Use the `NonTransfer` proxy to revoke scoped proxies when they're no longer needed.

If you find yourself needing to load your primary coldkey onto a machine to perform an operation, that is a signal to reconsider the approach.


### Hardware Solution: Ledger

Ledger hardware wallets, used with a compatible wallet app, support TAO transfers, staking, unstaking, and proxy creation. Compatible wallet apps include the Bittensor mobile wallet app ([bittensor.com/wallet](https://bittensor.com/wallet)), [Crucible](https://crucible.bittensor.com/), [Talisman](https://www.talisman.xyz/), [Nova Wallet](https://novawallet.io/), and [SubWallet](https://www.subwallet.app/).

See [Using Ledger Hardware Wallet](../staking-and-delegation/using-ledger-hw-wallet).

### Hardware Solution: Polkadot Vault

[Polkadot Vault](https://vault.novasama.io/) (formerly Parity Signer) turns a dedicated offline smartphone into a cold-signing device. The private key is generated on the device, which is then kept in airplane mode permanently. Transactions pass between the hot and cold device exclusively via QR code — the key never leaves the air-gapped phone.

Unlike Ledger wallet apps, which expose a limited set of supported operations, Polkadot Vault can decode and sign **any Subtensor extrinsic**.


### Rotating your coldkey

If you suspect the primary coldkey has been compromised, you can swap it out using an on-chain extrinsic. This operation has a 5-day waiting period during which the coldkey is locked. The cost is 0.1 TAO.

See [Rotate/Swap your Coldkey](./coldkey-swap).

If a proxy coldkey is compromised it may be easier, and is certainly quicker, to revoke its proxy status and purge any references to it from your system.


## Using BTCLI and the SDK with proxy coldkeys

`btcli` and the Bittensor SDK run on internet-connected machines. Any coldkey loaded onto such a machine is exposed to network risk regardless of how the machine is configured.


Proxies can be set to act with a required delay, allowing a window to reject unauthorized transactions. A properly maintained, adequately monitored system of scoped, delayed proxies is the safest way to perform `btcli` and SDK operations that require a coldkey, such as managing subnets or hotkeys.

### Recommended proxy configuration

Configure proxies with:

- **Least-privileged proxy type**: use only the permission level the operation requires:
  - `Staking`: stake and unstake only, no transfers
  - `SmallTransfer`: TAO and alpha transfers below 0.5 TAO/alpha per transaction only
  - `Transfer`: unlimited transfers, including all of your TAO to someone else in one quick step.
  - `Registration`: hotkey registration only
  - `Owner`: subnet owner operations only

- **Non-zero delay**: a delayed proxy must announce its intent on-chain and wait a specified number of blocks before the call executes. During this window, you can reject and veto the transaction using a `NonTransfer` proxy.


:::danger Zero-delay proxies provide no veto window

A proxy with `delay: 0` executes immediately, with no announcement period and no window to reject unauthorized transactions. It is always recommended set a non-zero delay for proxies that control mainnet liquidity.
:::


Set up proxies from your hardware wallet so the primary coldkey is never involved in day-to-day operations. See:

- [Proxies: Overview](./proxies/index.md)
- [Working with Proxies](./proxies/working-with-proxies.md)
- [Managing Your Stakes](../staking-and-delegation/managing-stake-sdk.md)

### Proxy lifecycle

The safest pattern for any `btcli` or SDK operation requiring a coldkey:

1. **Create** a proxy with the narrowest type and a delay sufficient to let you detect and cancel misuse.
2. **Use** it for the specific operation.
3. **Revoke** it after you are no longer monitoring it for announcements.

Keeping long-lived proxies with broad permissions around indefinitely defeats the purpose. The goal is to minimize the window during which a leaked key can cause damage.

### Monitor proxy announcements

A delayed proxy must broadcast its intent on-chain before executing, which allows users to check pending announcements and ensure that no unauthorized transactions are made.

**However, if you are not actively monitoring those announcements, the delay provides no protection.** An attacker who steals a proxy key can announce a call and wait out the delay undetected if no one is watching.

**Requirements:**

- Check for pending announcements on a schedule **shorter than your configured delay period**. A 100-block delay (~20 minutes) requires checks more frequent than that.
- Revoke any proxy relationship you are not actively monitoring. A dormant delayed proxy with no observer is no safer than a zero-delay proxy.
- Be ready to reject unexpected announcements using your `NonTransfer` proxy immediately.

See [Monitor and Reject Announcements](./proxies/working-with-proxies#monitor-and-reject-proxy-announcements) for how to query pending announcements, run a monitoring script, and reject.

See also: [Avoid Staking Proxy Attacks](../learn/avoid-staking-proxy-attacks) for a description of the specific multi-transaction sandwich attack that delayed proxies defend against.

:::warning Do not mine with primary coldkeys
Miners need coldkeys for currency management and hotkeys for serving requests. No coldkey should be present in an environment running mining code.
:::

### Team and multi-signature setups

If a team collectively manages a coldkey, you can use a multisig to prevent a single compromised team member from acting unilaterally.

See [Multi-signature wallets](./multisig).

## Hotkey workstation

Hotkeys in Bittensor serve as the operational keys for mining, validation, and weight commits, requiring moderately high availability. Because hotkeys do not control direct movement of TAO balances, they pose a lower risk if compromised. Nonetheless, a malicious actor who gains control of a hotkey can damage your reputation, submit invalid weights (if you are a validator), or serve malicious responses to requests as a miner.

A hotkey workstation is an operational environment. Losing a hotkey is less of a direct financial loss than losing a coldkey, but the reputational and operational risks are serious. Use general best practices for managing secrets, monitor hotkey activity continuously, and have a rapid mitigation strategy ready if a hotkey is compromised.

### Secrets management

Hotkeys must be created in coldkey workstation environments and then provisioned to the mining or validation server. Options:

- A secrets management solution such as [HashiCorp Vault](https://www.vaultproject.io/), [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), or [GCP Secret Manager](https://cloud.google.com/secret-manager) to provision the hotkey to the server at runtime.
- Ephemeral secret injection via CI/CD pipelines (GitLab, GitHub Actions) to inject secrets at runtime without storing them on the server.
- Never put keys in code repositories.

### Hotkey rotation

If you suspect a hotkey has been leaked, rotate it as soon as possible:

```shell
btcli wallet swap-hotkey
```

This moves the subnet registration to a newly created hotkey owned by the same coldkey, including all stake delegated by other users. The operation incurs a 1 TAO recycling fee.

### Minimize dependency risk

Bittensor nodes often run complex software stacks with many dependencies. Steps to reduce risk:

- Keep your Python environment or Docker images updated with the latest patches.
- Avoid installing unnecessary packages.
- Pin exact package versions and verify SHA-256 hashes with `pip install --require-hashes`.
- Consider sandboxing ML libraries using solutions like custom Docker seccomp profiles.

For an additional layer of defense against supply chain attacks, configure network egress control to create a host-level firewall that restricts outbound connections to an explicit allowlist. Even if a malicious package executes, it cannot exfiltrate key material if it cannot reach attacker-controlled infrastructure.
