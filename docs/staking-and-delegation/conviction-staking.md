---
title: "Conviction and locked stake"
---

# Conviction and locked stake

The locked stake features lets coldkey holders lock alpha stake to a specific hotkey on a subnet. Locked stake builds **conviction**, a score that grows over time toward the locked amount. Conviction provides a public, on-chain signal of long-term commitment that cannot be silently reversed.

Conviction provides information about subnet owners and other large investors in a subnet. A subnet owner whose alpha is locked has made a cryptographic commitment: unwinding a large position requires calling `unlock_stake` and then waiting through an exponential decay period before the stake can be withdrawn. This gives other stakers advance warning before any large exit completes.

## The stake lock mechanism

Locking stake binds a specific amount of a coldkey's staked alpha, on a subnet to a specific delegate (stake recipient) hotkey. The lock enforces one invariant:

> **Total alpha staked by the coldkey on that subnet ≥ locked amount**

Everything above the locked amount is freely unstakable. The coldkey can also continue to stake additional alpha at any time: the lock only blocks the staked balance from dropping below the locked amount.

Locks are **indefinite**: they persist until the coldkey explicitly calls `unlock_stake`. There is no expiry and no need to periodically renew a lock.

One lock per coldkey per subnet is enforced. If a lock already exists for a coldkey on a subnet, additional `lock_stake` calls top up the locked amount (provided the hotkey matches the existing lock).

## Conviction

The conviction score grows over time, from zero toward the locked amount. It therefore provides a combined signal of how long _and_ how much a staker had invested in the subnet.

Growth follow an exponential curve:

$$c_1 = m - (m - c_0) \cdot e^{-\Delta t / \tau}$$

where:

- $c_0$: conviction at last update
- $c_1$: conviction now
- $m$: locked mass (alpha units)
- $\Delta t$: blocks elapsed since last update
- $\tau$: maturity time constant: **216,000 blocks (≈ 30 days)**

## Dynamics locking and unlocking

When someone locks stake, their conviction increases over time, up to the locked amount. When someone unlocks stake, their available unlocked stake increases over time up to the amount the just unlocked.

The same formula governs both curves, only the time constant differs. The lifecycle graph below shows how they interact in sequence:

**Conviction growth**: `f(t) = 1 − exp(−t / τ)`, τ = 216,000 blocks ≈ 30 days. Dot marks one time constant (63.2% of max); 90% conviction is reached in ~70 days.
**Unlock availability**: exponential decay with ~90% of unlocked stake withdrawable after ~365 days. Dot marks one time constant (63.2% of unlocked amount available). Each x-axis spans 3τ for that panel's time constant.

![Conviction growth and unlock availability, side by side](/img/conviction-panels.svg)

![Conviction lifecycle: lock then unlock](/img/conviction-lifecycle.svg)

<details>
  <summary><strong>See how it's calculated!</strong></summary>

_Scenario: lock 100α at day 0; call `unlock_stake(50α)` at day 90 (≈ 3τ, so conviction is ~95% of max). Conviction (blue) drops instantly by the unlocked amount and then rebuilds toward the new lower ceiling. Unlocked α (orange) becomes gradually withdrawable over the following ~365 days._

To understand the design intent, notice that the math is about _closing a gap_, either gap between locked amount and eventual conviction, or unlocked amount and available amount.

If we re-arrange the equation to focus on the gap:

```
gap  = m - c0          (distance between current conviction and max)
c1   = m - gap × exp(-dt/τ)
```

`exp(-dt/τ)` is a number between 0 and 1, the fraction of the gap that remains after `dt` blocks.

So:

- `dt = 0` → `exp(0) = 1` → gap unchanged → c1 = c0 ✓
- `dt = τ` (30 days) → `exp(-1) ≈ 0.368` → 36.8% of the gap remains → you've closed ~63% of it
- `dt → ∞` → `exp(-∞) = 0` → gap gone → c1 = m ✓

Starting from c0 = 0 (fresh lock of 100 alpha):

```
gap = 100 - 0 = 100
at 30 days:  c1 = 100 - 100 × 0.368 = 63.2
at 60 days:  c1 = 100 - 100 × 0.135 = 86.5
```

Conviction is always closing in on `m`, getting closer every block, never quite arriving.

**Example:** Lock 100 alpha at block 0 with no prior lock.

| Elapsed time | Conviction |
| ------------ | ---------- |
| 0 days       | 0          |
| 10 days      | ≈ 28.3     |
| 21 days      | ≈ 50.0     |
| 30 days      | ≈ 63.2     |
| 60 days      | ≈ 86.5     |
| 70 days      | ≈ 90.3     |
| 90 days      | ≈ 95.0     |

Maximum conviction equals the locked mass. Topping up an existing lock adds to locked mass immediately; conviction continues growing from its current value toward the new (higher) maximum.

</details>

## Extrinsics

### `lock_stake`

```
api.tx.subtensorModule.lockStake(hotkey, netuid, amount)
```

Locks `amount` alpha from the coldkey's stake on `netuid` to `hotkey`.

- If no lock exists for this coldkey on `netuid`, a new lock is created with conviction 0.
- If a lock already exists, `amount` is added to the locked mass. The hotkey must match the existing lock. Use `move_lock` first if switching hotkeys.
- `amount` must not exceed the coldkey's available (unlocked) alpha on the subnet.
- Locked alpha continues to earn staking rewards normally.

**Errors:**

- `InsufficientStakeForLock`: available alpha is less than `amount`
- `LockHotkeyMismatch`: a lock exists for a different hotkey on this subnet
- `AmountTooLow`: amount is zero

**Event emitted:** `StakeLocked { coldkey, hotkey, netuid, amount }`

### `unlock_stake`

```
api.tx.subtensorModule.unlockStake(netuid, amount)
```

Begins the process of unlocking `amount` alpha from the coldkey's existing lock on `netuid`.

- Immediately reduces locked mass by `amount` and conviction by `amount`.
- The unlocked amount enters an exponential decay period and becomes gradually withdrawable over time: ~90% is available after ~365 days, with roughly half available after ~110 days.
- While stake is in the unlocking period, it **cannot be unstaked or re-locked**. The available stake formula excludes both locked and unlocking amounts.

**Errors:**

- `UnlockAmountTooHigh`: amount exceeds current locked mass

**Event emitted:** `StakeUnlocked { coldkey, hotkey, netuid, amount }`

:::note Unlock transactions are public
Calling `unlock_stake` emits the `StakeUnlocked` event on-chain immediately, before any stake is actually withdrawable. This is by design: the unlock period exists specifically so that other stakers can observe the signal and act accordingly. An unlock by a subnet owner should be interpreted as a potential intent to reduce their position, not a completed exit.
:::

### `move_lock`

```
api.tx.subtensorModule.moveLock(destination_hotkey, netuid)
```

Reassigns the coldkey's existing lock on `netuid` from its current hotkey to `destination_hotkey`.

- **Conviction resets to zero** when the old and new hotkeys are owned by different coldkeys.
- Conviction is **preserved** when both hotkeys are owned by the same coldkey (moving between your own hotkeys).
- The locked mass and unlocking mass are preserved in both cases.

When moving to a different-coldkey hotkey, conviction resets to zero, giving the previous hotkey's stakers a window to react before conviction rebuilds.

**Errors:**

- `NoExistingLock`: no lock exists for this coldkey on the subnet

**Event emitted:** `LockMoved { coldkey, origin_hotkey, destination_hotkey, netuid }`

:::note Locking does not affect emissions
Locking stake does not change the amount of emissions you receive. Emissions are determined by stake weight and consensus participation. Conviction is a governance/signaling mechanism only.
:::

## Subnet owner auto-locking

When a subnet owner receives their distribution cut each epoch, **it is automatically locked** to the subnet owner's hotkey. If the owner already has a lock, the auto-lock tops it up using the existing lock's hotkey. If no lock exists, the auto-lock targets the subnet owner's hotkey.

This means subnet owners start accumulating locked alpha and conviction from the moment they own a subnet. Unlocking requires a conscious `unlock_stake` transaction followed by the unlock delay (~90% available after ~365 days).

Subnet owners receive an additional benefit: locking alpha to themselves instantly matures their conviction to the locked amount, rather than building up over ~70 days. This applies only to the owner locking to their own hotkey.

## Key swap behavior

**Hotkey swap (system-level):** When a hotkey is swapped via `btcli wallet swap-hotkey`, all locks targeting the old hotkey are transferred to the new hotkey. Conviction is **not** reset, because the same coldkey owns both hotkeys.

**Coldkey swap:** A coldkey swap fails if the destination coldkey already has **active locked mass** on any subnet. The swap succeeds if the destination coldkey only has expired or zero-mass locks.

## Transferring locked stake

When stake is moved to another coldkey **within the same subnet**, lock obligations follow the alpha proportionally. The runtime resolves how much of the transfer carries lock state:

1. **Freely available alpha transfers first**: alpha above the locked + unlocking amount moves with no lock implications.
2. **Unlocking alpha is drawn next**: if the transfer exceeds freely available alpha, the shortfall comes from the source's unlocking mass. That amount arrives at the destination still in its decay period.
3. **Locked alpha is drawn last**: if the transfer still exceeds what's available, the remainder comes from locked mass. Conviction transfers proportionally. This step **fails with `LockHotkeyMismatch`** if the destination coldkey already has a lock pointing at a different hotkey.

**Cross-subnet moves are different**: moving stake between subnets goes through unstake → TAO transfer → restake, which must satisfy `ensure_available_stake`. You cannot drag locked or unlocking alpha across subnets.

## Querying conviction

Two runtime API calls expose conviction state on-chain:

| Method                                        | Returns                                                                                            |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `get_hotkey_conviction(hotkey, netuid)`       | Current total conviction for `hotkey` on `netuid`, summed over all coldkeys that have locked to it |
| `get_most_convicted_hotkey_on_subnet(netuid)` | The hotkey with the highest conviction on `netuid`, or `None` if no locks exist. Internally calls `subnet_king`. |

Conviction is a rolling value, so querying at different blocks yields different results as time passes and the exponential grows.

Explorer tools like [tao.app](https://www.tao.app) and [taostats.io](https://taostats.io/) are expected to surface per-subnet lock state, including subnet owner lock percentage and conviction scores, providing investors with at-a-glance commitment signals.

## Storage

Lock state is stored in two maps:

- `Lock[(coldkey, netuid, hotkey)]`: per-coldkey lock record containing locked mass, unlocking mass, conviction score, and last update block
- `HotkeyLock[(netuid, hotkey)]`: aggregate lock totals per hotkey (used for conviction queries without iterating all coldkeys)

The maturity time constant (`MaturityRate`) and unlock time constant (`UnlockRate`) are configurable on-chain storage values adjustable by governance. At launch, `MaturityRate` is set to ~216,000 blocks (τ ≈ 30 days), which produces 90% conviction in ~70 days. `UnlockRate` is set to release ~90% of unlocked stake after ~365 days. The unlock and maturity windows are key parameters in the mechanism's attack surface, and tuning them changes how quickly conviction can build or unwind.

## Appendix: implementation

The conviction formula is closed-form with no iteration or history, because the runtime stores only a checkpoint at the last mutation and evaluates forward on demand.

**What's stored** (`LockState`, `lib.rs`):

```rust
pub struct LockState {
    pub locked_mass: AlphaBalance,   // constant between user actions
    pub unlocked_mass: AlphaBalance, // amount pending the unlock decay period
    pub conviction: U64F64,          // c0: conviction at last_update
    pub last_update: u64,            // block number of last write
}
```

No history. Just a snapshot at a single block. The four fields are sufficient to reconstruct conviction at any future block.

**The formula** (`calculate_matured_values`, `lock.rs`):

```rust
let decay = Self::exp_decay(dt, tau);  // exp(-dt/tau)
let new_conviction =
    mass_fixed.saturating_sub(
        decay.saturating_mul(mass_fixed.saturating_sub(conviction))
    );
// = m - exp(-dt/tau) * (m - c0)
```

One call, no loop. This is the same equation shown in the [Conviction](#conviction) section above.

**On-demand evaluation** (`roll_forward_lock`, `lock.rs`):

```rust
pub fn roll_forward_lock(lock: LockState, now: u64) -> LockState {
    let dt = now.saturating_sub(lock.last_update);
    let (new_unlocked_mass, new_conviction) =
        Self::calculate_matured_values(
            lock.locked_mass, lock.unlocked_mass, lock.conviction, dt,
        );
    LockState {
        locked_mass: lock.locked_mass,
        unlocked_mass: new_unlocked_mass,
        conviction: new_conviction,
        last_update: now,
    }
}
```

**The mutation pattern** (from `do_lock_stake`, `lock.rs`):

```rust
// Roll to current block before modifying
let lock = Self::roll_forward_lock(existing, now);
let new_locked = lock.locked_mass.saturating_add(amount);
Self::insert_lock_state(coldkey, netuid, hotkey, LockState {
    locked_mass: new_locked,
    unlocked_mass: lock.unlocked_mass,
    conviction: lock.conviction,  // current conviction becomes new c0
    last_update: now,             // checkpoint resets to now
});
```

Every mutation (`lock_stake`, `unlock_stake`, `move_lock`) calls `roll_forward_lock` first. This advances conviction to the current block and writes it as the new `c0`. From that point, the stored `(c0, m, last_update)` triple is sufficient to evaluate conviction at any future block without needing history.

Conviction is therefore a pure function of elapsed time between mutations. Given the stored checkpoint, conviction at any future block `b` is:

```
c(b) = m - (m - c0) × exp(-(b - last_update) / τ)
```

This is exactly what `get_hotkey_conviction` evaluates when queried. You can also project forward: if no mutations occur between now and block `b`, the formula gives the exact future conviction. A mutation (top-up, partial unlock, `move_lock`) resets `c0` and `last_update` to a new checkpoint, restarting the forecast from there.
