---
title: "Conviction Staking: Designing Trust into Bittensor"
---

# Conviction staking: designing trust into Bittensor

Subnet ownership in Bittensor has a fundamental information problem. A subnet owner holds alpha staked to their own hotkey — but nothing prevents them from quietly reducing that position. An investor staking into a subnet where the owner has already reduced exposure to near zero is taking on risk they cannot see.

This is sometimes called the rug-pull problem, though "silent exit" is more precise: the owner doesn't need to do anything dramatic, just unstake gradually and let their committed position shrink while the subnet continues operating and attracting external stake.

Conviction staking addresses this by introducing a cryptographic metric for **commitment**, based on a new mechanism whereby stakers can **lock** their stake to a subnet. Once locked, stake must be unlocked (an on-chain operation which is therefore public information) before it can be unstaked. Unlocked becomes available to unstake all only gradually, with 50% availabe after ~30 days and 85% available at 60 days.

Gradual unlock-and-release process gives investors a period to respond to planned exits by subnet owners or other major investors.

## What conviction measures

Locking stake creates a **conviction score** — a number that grows from zero toward the locked amount following an exponential curve:

$$c_1 = m - (m - c_0) \cdot e^{-\Delta t / \tau}$$

where $m$ is the locked mass (alpha), $c_0$ is conviction at the last checkpoint, $\Delta t$ is elapsed blocks, and $\tau$ is 648,000 blocks (≈ 90 days).

The intuition: conviction tracks the gap between current conviction and locked mass, and that gap shrinks exponentially. A fresh lock of 100α starts at zero conviction. After 90 days: ~63α. After 180 days: ~86α. It approaches 100α asymptotically — always getting closer, never quite arriving.

This creates a **time cost** for conviction. You cannot lock stake today and claim full conviction tomorrow. A subnet owner claiming 90 days of high conviction has demonstrably been locked for 90 days — the chain records this and the formula is public.

Conviction is also the foundation for a future **subnet governance** mechanism. The hotkey with the highest total conviction on a subnet (the "subnet king") is expected to gain voting or veto rights over subnet parameters as the protocol matures. Conviction therefore becomes the measure by which control of a subnet can shift — slowly, visibly, and through demonstrated long-term commitment rather than a sudden ownership transfer.

## Two taus, two different roles

The mechanism uses two exponential time constants, and understanding the difference between them clarifies the design.

**Conviction tau (τ = 648,000 blocks ≈ 90 days)** governs how quickly conviction accumulates toward locked mass. This is a **design parameter** — the protocol designers chose a timescale they consider meaningful for long-term commitment. Ninety days is long enough that conviction cannot be manufactured overnight, but short enough that a genuine long-term holder builds substantial conviction within a quarter.

**Unlock tau (τ = 216,000 blocks ≈ 30 days)** governs how quickly unlocked stake becomes withdrawable after `unlock_stake` is called. This plays a structurally different role.

When an owner calls `unlock_stake`, observers now have three numbers: the unlocked amount, the unlock-rate constant (public, fixed), and the block of the unlock event. From those three, they can compute exactly when any fraction of that position becomes withdrawable:

$$\text{withdrawable}(t) = \text{unlocked} \cdot (1 - e^{-\Delta t / \tau_{\text{unlock}}})$$

This is closer to what the perceptual psychologist David Lee called **tau** in a different sense entirely — a first-order variable in the observable stream that encodes a hidden but actionable quantity without requiring explicit knowledge of the underlying parameters. Lee showed that animals tracking an approaching object don't need to know its speed or distance; the ratio of image size to its rate of expansion gives time-to-contact directly.

In conviction staking, a rational observer watching an unlock event doesn't need to know the owner's total position size or their intentions. The unlock amount, the rate constant, and the elapsed blocks give you "time until this stake can exit" — the variable you actually care about when deciding whether to stay in a subnet. The unlock period is precisely designed so that this information is available and actionable before the exit completes.

In short: conviction tau is the designer's statement about what commitment means temporally. Unlock tau is the observer's tool for computing time-to-exit.

## Subnet owners start locked by default

One detail that changes the practical picture: subnet owners don't have to remember to lock their stake. When an owner receives their distribution cut each epoch, **it is automatically locked** to their hotkey. From the moment someone registers a subnet, their owner cut begins accumulating as locked alpha, and conviction begins growing from zero.

Unlocking requires a conscious, explicit `unlock_stake` transaction. This flips the default: owners are locked until they choose otherwise, rather than unlocked until they choose to lock. An absence of lock state on a subnet owner's hotkey is therefore a meaningful signal — it means the owner has taken an active step to unlock, not simply that they never engaged with the feature.

## The commitment ladder

The combination of auto-locking, conviction growth, and unlock delay creates a natural commitment ladder that investors can read from chain state:

| Signal | What it means |
|---|---|
| No lock on owner hotkey | Owner has explicitly unlocked, or is newly onboarded and unlock was intentional |
| Lock exists, conviction < 30% | Recent or recently topped-up lock; commitment is new |
| Lock exists, conviction > 63% | Owner has been continuously locked for at least one time constant (90 days) |
| `unlock_stake` event emitted | Owner has signaled intent to reduce position; exit begins now |
| High conviction + large locked mass | Demonstrated long-term commitment; costly to reverse quickly |

Tools like [tao.app](https://www.tao.app) and tau.stats are building interfaces to surface this data per subnet. The mechanism only works as an investor signal if the data is visible — the protocol makes it available on-chain, but ecosystem tooling is what makes it legible at a glance.

## A note on what conviction does not do

Conviction is a governance and signaling mechanism. It does **not** affect emissions. Locking more stake, holding it longer, or achieving maximum conviction does not change how much alpha you earn — emissions continue to be determined by stake weight and consensus participation.

This is intentional. Conflating conviction with emission weight would distort the incentive: owners would lock not because they believe in the subnet but because it increases their yield. Keeping them separate means conviction is a credible signal of belief — someone who locks alpha and waits 90 days is expressing long-term confidence in the subnet, not optimizing a reward formula.

## Using this as a builder

If you're building tooling that interacts with alpha transfers within a subnet, one implementation detail matters: locked and unlocking alpha travels with same-subnet stake transfers. The runtime applies a priority order — freely available alpha moves first, then unlocking alpha, then locked alpha — and a transfer that must draw from locked mass will fail if the destination coldkey's existing lock points to a different hotkey (`LockHotkeyMismatch`).

For exchanges and wallets that accept alpha transfers: check lock state before accepting. Alpha that arrives locked cannot be immediately unstaked. An `unlock_stake` call followed by the 30-day decay period is required before that stake becomes liquid.

Two runtime API calls are available for querying conviction state:

- `get_hotkey_conviction(hotkey, netuid)` — total conviction for a hotkey on a subnet, summed across all locking coldkeys
- `get_most_convicted_hotkey_on_subnet(netuid)` — the current "subnet king" by conviction

Conviction is a rolling value that changes every block — query at the current block for the current value, or apply the formula to project forward given the stored checkpoint.

---

The full reference documentation, including extrinsic signatures, error types, storage layout, and the implementation appendix showing how the checkpoint system works in code, is in [Conviction Staking](../staking-and-delegation/conviction-staking).
