---
title: "Conviction and locked stake"
---

# Conviction and locked stake

The locked stake feature lets coldkey holders lock alpha stake to a specific hotkey on a subnet. Locked stake builds **conviction**, a score that grows over time toward the locked amount. Conviction provides a public, on-chain signal of long-term commitment that cannot be silently reversed.

Conviction provides information about subnet owners and other large investors in a subnet. A subnet owner whose alpha is locked has made a cryptographic commitment: unwinding a large position requires switching the lock to decaying mode and then waiting through an exponential decay period before the stake is gone. This gives other stakers advance warning before any large exit completes.

## The stake lock mechanism

Locking stake binds a specific amount of a coldkey's staked alpha on a subnet to a specific delegate (stake recipient) hotkey. The lock enforces one invariant:

> **Total alpha staked by the coldkey on that subnet ≥ locked amount**

Everything above the locked amount is freely unstakable. The coldkey can also continue to stake additional alpha at any time: the lock only blocks the staked balance from dropping below the locked amount.


## Conviction


Conviction increases over time toward the amount of locked stake, following an exponential curve so  it slows as it approaches the limit value of the locked amount.


### Decaying and perpetual modes

By default, the locked amount decreases over time along an exponential curve, freeing up more of the originally locked amount to potentially be unstaked.

Because conviciton will rise toward the locked amount, while the locked amount itself falls, over time, conviction will peak somewhere in the middle and then start to fall again.

The locked amount reaches zero (freeing all stake) with no explicit action needed.

A locked amount can also be set to **perpetual** so that it will never decreas.

The mode, **decaying** or **perpetual**, is per-coldkey per-subnet and can be changed at any time. Switching from perpetual to decaying initiates the decay process immediately from the current locked mass.

One lock per coldkey per subnet is enforced. If a lock already exists for a coldkey on a subnet, additional `lock_stake` calls top up the locked amount (provided the hotkey matches the existing lock).

## Conviction

The conviction score grows over time, from zero toward the locked amount. In perpetual mode it follows an exponential curve:

$$c_1 = m - (m - c_0) \cdot e^{-\Delta t / \tau}$$

where:

- $c_0$: conviction at last update
- $c_1$: conviction now
- $m$: locked mass (alpha units)
- $\Delta t$: blocks elapsed since last update
- $\tau$: maturity time constant (`MaturityRate`, a governance-settable on-chain value; query the chain for the current value)

In decaying mode, both the locked mass and conviction decay toward zero, but they follow different curves. Starting from a fresh lock ($c_0 = 0$), conviction first rises as the lock accumulates maturation time, then falls as the mass erodes. The formula (when `UnlockRate` = `MaturityRate` = τ, the default) is:

$$c_1 = e^{-\Delta t / \tau} \left( c_0 + m \cdot \frac{\Delta t}{\tau} \right)$$

$$m_1 = m \cdot e^{-\Delta t / \tau}$$

Switching to perpetual mode stops the mass decay and allows conviction to grow toward the full locked amount.

**90% conviction** (perpetual mode) is reached at approximately $2.3\tau$ blocks. At one time constant $\tau$, conviction is at 63.2% of locked mass.

:::note Query for current time constants
`MaturityRate` and `UnlockRate` are governance-settable on-chain storage values. The specific block counts and day estimates depend on the current on-chain values. Query `api.query.subtensorModule.maturityRate()` and `api.query.subtensorModule.unlockRate()` on the live chain before relying on any specific number.
:::

**Perpetual mode** (fresh lock of 100 alpha, $c_0 = 0$):

| Elapsed | Locked mass | Conviction |
|---|---|---|
| 0 | 100 | 0 |
| 0.5τ | 100 | 39.3 |
| 1τ | 100 | 63.2 |
| 2τ | 100 | 86.5 |
| 2.3τ | 100 | ~90 |
| 3τ | 100 | 95.0 |

Conviction closes in on the locked mass; maximum conviction equals the locked mass.

![Perpetual mode conviction diagram](/img/docs/conviction/perpetual-mode.svg)

**Decaying mode** (fresh lock of 100 alpha, $c_0 = 0$, `UnlockRate` = `MaturityRate` = τ):

| Elapsed | Locked mass | Conviction |
|---|---|---|
| 0 | 100 | 0 |
| 0.5τ | 60.7 | 30.3 |
| 1τ | 36.8 | **36.8 (peak)** |
| 2τ | 13.5 | 27.1 |
| 3τ | 5.0 | 14.9 |

Conviction peaks at ~36.8% of the original locked mass at elapsed time = τ. After that both values fall toward zero. Note that once elapsed time exceeds τ, conviction exceeds the remaining locked mass; it reflects accumulated commitment, not just current holdings. Topping up an existing lock adds to locked mass immediately, conviction continuing from its current value.

![Decaying mode conviction diagram](/img/docs/conviction/decaying-mode.svg)

<details>
  <summary><strong>See how it's calculated</strong></summary>

**Perpetual mode**; closing a gap between current conviction and the target (locked mass):

```
gap  = m - c0
c1   = m - gap × exp(-dt/τ)
```

`exp(-dt/τ)` is the fraction of the gap that remains after `dt` blocks.

- `dt = 0` → `exp(0) = 1` → gap unchanged → c1 = c0 ✓
- `dt = τ` → `exp(-1) ≈ 0.368` → 36.8% of gap remains → 63.2% closed
- `dt → ∞` → `exp(-∞) = 0` → gap gone → c1 = m ✓

Starting from c0 = 0 (fresh lock of 100 alpha, perpetual mode):

```
gap = 100
at τ:   c1 = 100 - 100 × 0.368 = 63.2
at 2τ:  c1 = 100 - 100 × 0.135 = 86.5
at 3τ:  c1 = 100 - 100 × 0.050 = 95.0
```

Conviction is always closing in on `m`, getting closer every block, never quite arriving.

**Decaying mode** (when `UnlockRate` = `MaturityRate` = τ); conviction is the accumulated area under the decaying lock curve:

```
c1 = exp(-dt/τ) × (c0 + m × dt/τ)
m1 = m × exp(-dt/τ)
```

Starting from c0 = 0 (fresh lock of 100 alpha, decaying mode):

```
at 0.5τ:  m1 = 60.7,  c1 = 100 × 0.5 × exp(-0.5) = 30.3
at τ:     m1 = 36.8,  c1 = 100 × 1.0 × exp(-1)   = 36.8  ← peak
at 2τ:    m1 = 13.5,  c1 = 100 × 2.0 × exp(-2)   = 27.1
at 3τ:    m1 = 5.0,   c1 = 100 × 3.0 × exp(-3)   = 14.9
```

The term `(dt/τ) × exp(-dt/τ)` is maximized at `dt = τ` (value = `1/e ≈ 0.368`). Conviction represents accumulated commitment, not current holdings; after τ has elapsed, conviction exceeds the remaining locked mass.

</details>

## Extrinsics

### `lock_stake`

```
api.tx.subtensorModule.lockStake(hotkey, netuid, amount)
```

Locks `amount` alpha from the coldkey's stake on `netuid` to `hotkey`.

- If no lock exists for this coldkey on `netuid`, a new lock is created with conviction 0.
- If a lock already exists, `amount` is added to the locked mass. The hotkey must match the existing lock. Use `move_lock` first if switching hotkeys.
- `amount` must not exceed the coldkey's total alpha staked on the subnet.
- Locked alpha continues to earn staking rewards normally.
- New locks are decaying by default. Call `set_perpetual_lock(true)` after locking to opt into perpetual mode.

**Errors:**

- `InsufficientStakeForLock`: available alpha is less than `amount`
- `LockHotkeyMismatch`: a lock exists for a different hotkey on this subnet
- `AmountTooLow`: amount is zero

**Event emitted:** `StakeLocked { coldkey, hotkey, netuid, amount }`

### `set_perpetual_lock`

```
api.tx.subtensorModule.setPerpetualLock(netuid, enabled)
```

Sets or clears perpetual lock mode for the coldkey's lock on `netuid`.

- `enabled = true`: the coldkey's locked mass no longer decays. Conviction can grow toward the full locked amount.
- `enabled = false`: the coldkey's locked mass resumes decaying. This is how you initiate an exit from a lock; the mass decays exponentially over time according to `UnlockRate`.

Switching modes rolls the lock forward to the current block first, so no mass or conviction is lost in the transition.

:::note Switching to decaying mode is public
Calling `set_perpetual_lock(false)` emits the `PerpetualLockUpdated` event on-chain immediately. This is by design: the decay period exists specifically so that other stakers can observe the signal and act accordingly. A switch to decaying mode by a subnet owner should be interpreted as a potential intent to reduce their position.
:::

**Event emitted:** `PerpetualLockUpdated { coldkey, netuid, enabled }`

### `move_lock`

```
api.tx.subtensorModule.moveLock(destination_hotkey, netuid)
```

Reassigns the coldkey's existing lock on `netuid` from its current hotkey to `destination_hotkey`.

- **Conviction resets to zero** when the old and new hotkeys are owned by different coldkeys.
- Conviction is **preserved** when both hotkeys are owned by the same coldkey (moving between your own hotkeys).
- The locked mass is preserved in both cases.

When moving to a different-coldkey hotkey, conviction resets to zero, giving the previous hotkey's stakers a window to react before conviction rebuilds.

**Errors:**

- `NoExistingLock`: no lock exists for this coldkey on the subnet

**Event emitted:** `LockMoved { coldkey, origin_hotkey, destination_hotkey, netuid }`

:::note Locking does not affect emissions
Locking stake does not change the amount of emissions you receive. Emissions are determined by stake weight and consensus participation. Conviction is a governance/signaling mechanism only.
:::

## Subnet owner auto-locking

When a subnet owner receives their distribution cut each epoch, it is **automatically locked** to the subnet owner's hotkey by default. If the owner already has a lock, the auto-lock tops it up using the existing lock's hotkey. If no lock exists, the auto-lock targets the subnet owner's hotkey.

Auto-locking is enabled per-subnet by default and can be disabled via the `OwnerCutAutoLockEnabled` governance parameter (root-only).

Subnet owners receive an additional benefit: locking alpha to themselves **instantly matures their conviction** to the locked amount, rather than building up over time. This applies only when the owner is locking to their own hotkey.

## Key swap behavior

**Hotkey swap (system-level):** When a hotkey is swapped via `btcli wallet swap-hotkey`, all locks targeting the old hotkey are transferred to the new hotkey. Conviction is **not** reset, because the same coldkey owns both hotkeys.

**Coldkey swap:** A coldkey swap fails if the destination coldkey already has **active locked mass** on any subnet. The swap succeeds if the destination coldkey only has expired or zero-mass locks.

## Transferring locked stake

When stake is moved to another coldkey **within the same subnet**, lock obligations follow the alpha proportionally. The runtime resolves how much of the transfer carries lock state:

1. **Freely available alpha transfers first**: alpha above the locked amount moves with no lock implications.
2. **Locked alpha is drawn next**: if the transfer exceeds freely available alpha, the remainder comes from locked mass. Conviction transfers proportionally with the locked amount. This step **fails with `LockHotkeyMismatch`** if the destination coldkey already has a lock pointing at a different hotkey.

**Cross-subnet moves are different**: moving stake between subnets goes through unstake → TAO transfer → restake, which must satisfy the lock constraint. You cannot move locked alpha across subnets directly.

## Querying conviction

Three runtime API calls expose lock and conviction state on-chain:

| Method | Returns |
|---|---|
| `get_coldkey_lock(coldkey, netuid)` | The current `LockState` for this coldkey on `netuid`, rolled forward to the current block, or `None` if no lock exists |
| `get_hotkey_conviction(hotkey, netuid)` | Current total conviction for `hotkey` on `netuid`, summed over all coldkeys that have locked to it |
| `get_most_convicted_hotkey_on_subnet(netuid)` | The hotkey with the highest conviction on `netuid`, or `None` if no locks exist. Internally calls `subnet_king`. |

Conviction is a rolling value: querying at different blocks yields different results as time passes and the exponential evolves.

## Storage

Lock state is stored across six structures:

| Storage | Key | Contents |
|---|---|---|
| `Lock` | `(coldkey, netuid, hotkey)` | Individual per-coldkey lock record |
| `HotkeyLock` | `(netuid, hotkey)` | Aggregate perpetual lock totals for non-owner hotkeys |
| `DecayingHotkeyLock` | `(netuid, hotkey)` | Aggregate decaying lock totals for non-owner hotkeys |
| `OwnerLock` | `netuid` | Aggregate perpetual lock total for the subnet owner hotkey |
| `DecayingOwnerLock` | `netuid` | Aggregate decaying lock total for the subnet owner hotkey |
| `DecayingLock` | `(coldkey, netuid)` | When present and `false`, this coldkey's lock is in perpetual mode. Absent = decaying (default). |

Two governance-settable parameters control the time constants:

- **`MaturityRate`**: time constant τ (in blocks) for conviction growth in perpetual mode. Query on-chain for the current value.
- **`UnlockRate`**: time constant τ (in blocks) for locked mass decay in decaying mode. Query on-chain for the current value.

Both are adjustable by governance. Query `api.query.subtensorModule.maturityRate()` and `api.query.subtensorModule.unlockRate()` for current values before computing time estimates.

## Subnet ownership changes

The conviction mechanism underpins an eventual path to conviction-based subnet ownership transfer. Two conditions must both hold before ownership can change:

1. The subnet is at least **one year old**
2. Total rolled aggregate conviction on the subnet is at least **10% of `SubnetAlphaOut`**

When both conditions are met, the hotkey with the highest aggregate conviction (`subnet_king`) becomes the subnet owner hotkey, and that hotkey's owning coldkey becomes the subnet owner. The RPC method `get_most_convicted_hotkey_on_subnet(netuid)` shows who would currently win.

:::note Ownership changes not yet active
The conviction-based ownership transfer mechanism is implemented and can be queried, but is not yet enabled on mainnet. It will be activated via a separate governance transaction. Subnet owners can begin building conviction immediately.
:::

## Appendix: implementation

The conviction formula is closed-form with no iteration or history. The runtime stores only a checkpoint at the last mutation and evaluates forward on demand.

**What's stored** (`LockState`, `lock.rs`):

```rust
pub struct LockState {
    pub locked_mass: AlphaBalance,  // constant in perpetual mode; decays in decaying mode
    pub conviction: U64F64,         // c0: conviction at last_update
    pub last_update: u64,           // block number of last write
}
```

No history. Just a snapshot at a single block. The three fields are sufficient to reconstruct lock state at any future block.

**The formula** (`calculate_decayed_mass_and_conviction`, `lock.rs`):

In perpetual mode (`perpetual_lock = true`):
```rust
let maturity_decay = Self::exp_decay(dt, maturity_rate);  // exp(-dt/τ)
let new_locked_mass = locked_mass;  // unchanged
let new_conviction =
    maturity_decay.saturating_mul(conviction)           // c0 × exp(-dt/τ)
    .saturating_add(
        mass_fixed.saturating_mul(                      // + m × (1 - exp(-dt/τ))
            U64F64::from(1).saturating_sub(maturity_decay)
        )
    );
// = m - (m - c0) × exp(-dt/τ)
```

In decaying mode (`perpetual_lock = false`), when `unlock_rate == maturity_rate` (the default, both are the same on-chain value):
```rust
let unlock_decay = Self::exp_decay(dt, unlock_rate);    // exp(-dt/τ)
let maturity_decay = Self::exp_decay(dt, maturity_rate); // exp(-dt/τ)  [same τ]
let new_locked_mass = unlock_decay.saturating_mul(mass_fixed);  // m × exp(-dt/τ)
let conviction_from_existing = maturity_decay.saturating_mul(conviction); // c0 × exp(-dt/τ)
let dt_fixed = U64F64::from(dt);
let tau_fixed = U64F64::from(maturity_rate);
let conviction_from_mass = mass_fixed.saturating_mul(
    dt_fixed.safe_div(tau_fixed).saturating_mul(maturity_decay)  // m × (dt/τ) × exp(-dt/τ)
);
let new_conviction = conviction_from_existing + conviction_from_mass;
// = exp(-dt/τ) × (c0 + m × dt/τ)
```

When the two rates differ, the conviction from mass uses the closed-form integral:
```rust
// γ = τ_unlock × (exp(-dt/τ_unlock) - exp(-dt/τ_maturity)) / (τ_unlock - τ_maturity)
let gamma = tau_x.saturating_mul(decay_delta).checked_div(tau_delta);
let conviction_from_mass = mass_fixed.saturating_mul(gamma.max(0));
```
This is the analytic solution to the convolution of the decaying mass with the maturity kernel `exp(-t/τ_maturity)/τ_maturity`.

**Owner lock special case** (`roll_forward_lock`, `lock.rs`):

```rust
if owner_lock {
    rolled.conviction = U64F64::from(rolled.locked_mass);  // instant full conviction
}
```

Owner locks targeting the subnet owner's own hotkey always have `conviction == locked_mass`, regardless of elapsed time.

**On-demand evaluation** (`roll_forward_lock`, `lock.rs`):

Every mutation (`lock_stake`, `set_perpetual_lock`, `move_lock`) calls `roll_forward_lock` first, advancing all values to the current block and writing them as the new checkpoint. From that point, `(locked_mass, conviction, last_update)` is sufficient to evaluate state at any future block without history.
