---
title: "Token Halvings Problem and Solution"
---

# Token Halvings Problem and Solution

## FAQ

### What’s the core problem?
Later subnets are structurally disadvantaged: every TAO halving creates a new class of subnets with weaker tokenomics, making them more prone to deregistration—even if they behave identically to earlier cohorts.

### Why do we need to act before the first TAO halving?

Because the first halving already creates two permanent classes. Once split, later subnets will be persistently weaker and more deregistration-prone.

The crux is that injections shrink with the global TAO halving index k, while emissions depend on the subnet’s own ALPHA halving index n. The gap m = n - k controls outcomes, giving exponential advantageous 2^(k-n) to older subnets.

### What is ADR?

ADR is the emissions-to-injections ratio. It measures how much ALPHA goes to people (emissions) relative to how much is put into the pool (injections). A higher ADR means liquidation happens at a deeper discount. In the current protocol, ADR tracks 2^(k - n), underlying the subnet cohort asymmetry. 

### Doesn’t buy pressure balance things out between newer and older subnets?

Not symmetrically. Unstake/slippage depends only on the ALPHA reserve. As injections shrink with k while emissions remain at n, identical sell fractions yank out more TAO in later cohorts. Systematic sell flows (e.g., root) happen every block; buy flows are sporadic.

### What is the synchronized-halving fix in plain words?

Make both ALPHA injection and ALPHA emission halve with the same global schedule (k). That kills the gap m. Consequences: no interval compression asymmetry, no liquidation discount vs spot, and liquidity impact becomes cohort-invariant for the same behavior.

### What happens to the “21M per subnet” idea?

This design concept is the root of the problem. Keeping a fixed 21M for every subnet conflicts with eliminating the cohort disadvantage. Synchronizing both ALPHA components to k removes the disadvantage but implies per-subnet max supply depends on registration time. ALPHA is highly divisible; Zeno-halvings keep a clean tail.


### What are the trade-offs of synchronizing?
- Pro: Removes cohort classes (fairness), simpler mental model, predictable dynamics.
- Con: Per-subnet max ALPHA varies with registration time; requires accepting supply differences and potentially using Zeno-halvings to keep the tail smooth.

### Can we fix it by only changing how ALPHA halvings work (emissions-only)?

That slows interval compression but leaves ADR/liquidity asymmetries intact. You still get unequal max supplies and persistent cohort differences.

### Can subnet mergers/forks cure the asymmetry?

Not safely if ADRs differ a lot. Big gaps in ADR (e.g., 2^(k - n)) create merger/arbitrage issues. Late->early mergers can be exploitable unless ADRs are aligned.

### What is “liquidity impact” and why does it hurt later cohorts more?
It’s the fraction of TAO reserves removed when selling ALPHA. For unstaking, the impact depends only on the ALPHA reserve. Later cohorts get smaller injections into the pool, so the same sell fraction removes more TAO.

### What is the “haircut” on liquidation?
It’s the discount between liquidation price and spot. With ADR>1 (typical for late cohorts), P_L = P/ADR ⇒ a large haircut. Example: ADR=32 ⇒ P_L is P/32 (~97% discount).

### How does the root proportion change across cohorts?
Later cohorts’ total issuance grows slower over shared horizons, so the root’s share declines more slowly. Practically, root sells a larger share for longer—another persistent disadvantage for later cohorts.

### What if we do nothing?

We entrench permanent classes. Later subnets will be weaker across liquidity, liquidation, and incentive trajectories, and be more vulnerable to deregistration even with identical performance.

### What changes immediately after the first halving?

Material shifts appear right away (e.g., the baseline liquidity impact for the same sell fraction rises significantly from ~29% to ~45% in examples discussed). The divergence then compounds with subsequent halvings.

### What are Zeno-halvings

Zeno-halvings, based on Zeno's Paradox of movement, embodied in the race between [Achilles and the tortoise](https://en.wikipedia.org/wiki/Infinity#Zeno:_Achilles_and_the_tortoise), and the idea that emissions should be able to halve infinitely, with the emissions becoming smaller and smaller, requiring higher precision token denominations.

That preserves the intended scaling without “falling off a cliff.”

### I run a subnet today—what’s the practical takeaway?

Early cohorts enjoy structural advantages. If the goal is a fair, durable ecosystem that welcomes future subnets, synchronizing the halving schedules (and acknowledging variable max supplies) removes the class disadvantage and simplifies operations.


## GLOSSARY 

###  TAO (τ)

The main network token. Its block reward halves on a global schedule.

###  ALPHA (α)

A subnet’s token. Each subnet has its own ALPHA. ALPHA is created two ways: injected into the AMM and emitted to participants.

### TAO halving index (k)

How many global TAO halvings have happened (0, 1, 2, ...). Bigger k means smaller TAO block rewards.

### ALPHA halving index (n)

How many ALPHA halvings a specific subnet has gone through (0, 1, 2, ...). Bigger n means smaller ALPHA emissions for that subnet.

### Cohort gap (m = n - k)

The single number that explains cohort differences. If m is negative (new subnet registered after multiple TAO halvings), the subnet is disadvantaged; if positive, it’s an earlier cohort with different dynamics.

### Injection (Δα)

ALPHA minted into the AMM reserves. It scales with the TAO halving index k (shrinks as k grows). Think: top-ups to the pool driven by global TAO emissions.

### Emission (Δα′)

ALPHA minted directly to participants (miners, nominators, etc.) based on the subnet’s own schedule n.

### TERP (TAO Emission Ratio Property)

The rule that allocates TAO injections across subnets according to smoothed (EMA) prices.

### EMA price (p̃)

Exponentially weighted moving average price; a smoothed price used by TERP to avoid reacting to short-term noise.

### AMM (Automated Market Maker)

The on-chain market for swapping TAO and ALPHA. We use the constant-product AMM as the baseline mental model.

### Liquidity impact (R)

When users sell/unstake ALPHA, R is the fraction of TAO reserves removed from the AMM. Higher R means worse slippage/impact.

### ADR (emissions-to-injections ratio)

Simple version: “How much ALPHA goes to people vs how much is put into the pool.” Formally, ADR_k,n ≈ 2^(k - n) under the baseline. Bigger ADR ⇒ liquidation prices are a smaller fraction of spot (deeper discount).

### Spot price (P)

TAO per ALPHA using AMM reserves (τ/α in the pool).

### Liquidation price (P_L)

TAO per ALPHA using outstanding supply instead of pool reserves. Under baseline it’s P_L = P / ADR.

### Haircut (h)

The liquidation discount relative to spot: h = 1 - (P_L / P). Higher h means worse outcomes on liquidation.

### Root proportion (r)

How rewards split between the root stakers and subnet validators; drifts over time with issuance.

### Synchronized halving (explored fix)

Make both ALPHA components (injection and emission) follow the global TAO schedule (k). This removes the cohort gap m.

### Zeno-halvings (precision fix)

Increase token precision so halvings can continue below the smallest unit; avoids the emission tail rounding to zero.

### Deregistration

When a subnet fails to meet economic/operation criteria and gets removed. Later cohorts are more vulnerable under current rules.

### Cohort/class

Subnets born between TAO halvings. Each halving creates a new class with different tokenomics under the current design.


