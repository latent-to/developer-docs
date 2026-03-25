---
title: "Avoid Staking Proxy Attacks"
---

import { SecurityWarning } from "../keys/_security-warning.mdx";

# Avoid Staking Proxy Attacks

A `Staking` proxy relationship allows one wallet to stake on behalf of another. A typical way to use this is to keep your TAO in a 'safe' wallet, and to use another wallet that is a staking proxy of the first only to stake and unstake on behalf of the other. This allows the first wallet to remain in 'cold storage' without ever having its key cryptographic material loaded onto a 'hot' device connected to the internet.

Start with: [Proxies: Overview](../keys/proxies/index.md).

It might seem like leaking a staking proxy key would be not so bad; unlike a transfer proxy, an attacker can't use it to just steal all of your TAO in one step.

However, an attacker that gains your staking proxy can still drain your token balance by repeatedly setting you up for maximized 'sandwich attacks', where you make unfavorable trades, losing value each time as the attacker gains.

## How the attack works

1. The attacker stakes some of their own TAO into a subnet (first leg).
2. Using the stolen `Staking` proxy, they stake a large amount of the victim's TAO into the same subnet and hotkey (second leg), moving the pool further.
3. The attacker unstakes their alpha (third leg).
4. Using the proxy again, they unstake the victim's alpha (fourth leg).

The attack may be obscure to the victim, in that no transaction links their account directly to a the attackers. The loss shows up only as unexpected transactions that lose value to high slippage.

See [Slippage](./slippage.md).

## Protect yourself: non-zero delay + monitoring

A non-zero delay forces the delegate to announce a call and wait for a number of blocks before execution. During that window, the real account (for example from a hardware wallet) can reject the announcement. With zero delay, there is no such window: a leaked delegate key can act as fast as the chain accepts extrinsics.

Whether delay helps you in practice depends on whether you actually check for announcements on a schedule shorter than the delay. If you never look, a long delay only helps after the fact in forensics, not prevention.

See [Monitor and Reject Proxy Announcements](../keys/proxies/working-with-proxies#monitor-and-reject-proxy-announcements)

- Prefer scoped proxy types and non-zero delay for any delegate that can touch meaningful stake. See [Proxies: Overview](../keys/proxies/index.md) and [Working with Proxies](../keys/proxies/working-with-proxies.md).
- Treat a compromised `Staking` proxy (especially one with 0-delay) as a real operational risk, not "low impact": rotate or remove the proxy, and assume stake-moving activity until you verify otherwise.
- Keep the custody coldkey off hot workstations; follow the best practices described in [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security.md).
- Revoke proxies you are not actively using if you do not want ongoing monitoring burden.

## Learn more

- [Proxies: Overview](../keys/proxies/index.md) (main proxy documentation)
- [Working with Proxies](../keys/proxies/working-with-proxies.md)
- [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security.md)
- [Slippage](./slippage.md)
- [Price protection](./price-protection.md)
