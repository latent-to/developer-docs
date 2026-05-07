---
title: "Conviction Staking (Stake Locks)"
---

# Conviction staking (stake locks)

Conviction staking lets coldkey holders lock alpha stake to a specific hotkey on a subnet. Locked stake builds **conviction** — a score that grows over time toward the locked amount — providing a public, on-chain signal of long-term commitment that cannot be silently reversed.

The primary use case is investor confidence in subnet owners. A subnet owner whose alpha is locked has made a cryptographic commitment: unwinding a large position requires calling `unlock_stake` and then waiting through a 30-day exponential decay period before the stake can be withdrawn. This gives other stakers advance warning before any large exit completes.

:::note Testnet launch
Conviction staking is live on testnet (spec version 403) as of May 2026 and is tentatively scheduled for mainnet on May 13, 2026.
:::

## How locks work

A lock binds a specific **amount** of a coldkey's alpha on a subnet to a specific **hotkey**. The lock enforces one invariant:

> **Total alpha staked by the coldkey on that subnet ≥ locked amount**

Everything above the locked amount is freely unstakable. The coldkey can also continue to stake additional alpha at any time — the lock only blocks the staked balance from dropping below the locked amount.

Locks are **indefinite**: they persist until the coldkey explicitly calls `unlock_stake`. There is no expiry and no need to periodically renew a lock.

One lock per coldkey per subnet is enforced. If a lock already exists for a coldkey on a subnet, additional `lock_stake` calls top up the locked amount (provided the hotkey matches the existing lock).

## Conviction

Conviction is a score that grows from zero toward the locked amount following an exponential curve:

$$c_1 = m - (m - c_0) \cdot e^{-\Delta t / \tau}$$

where:
- $c_0$ — conviction at last update
- $c_1$ — conviction now
- $m$ — locked mass (alpha units)
- $\Delta t$ — blocks elapsed since last update
- $\tau$ — maturity time constant: **648,000 blocks (≈ 90 days)**

Conviction is computed lazily — the locked mass does not change, only the evaluation time advances. No periodic transactions are required to keep conviction growing.

**Example:** Lock 100 alpha at block 0 with no prior lock.

| Elapsed time | Conviction |
|---|---|
| 0 days | 0 |
| 30 days | ≈ 28.3 |
| 62 days | ≈ 50.0 |
| 90 days | ≈ 63.2 |
| 180 days | ≈ 86.5 |
| 270 days | ≈ 95.0 |

Maximum conviction equals the locked mass. Topping up an existing lock adds to locked mass immediately; conviction continues growing from its current value toward the new (higher) maximum.

## Extrinsics

### `lock_stake`

```
api.tx.subtensorModule.lockStake(hotkey, netuid, amount)
```

Locks `amount` alpha from the coldkey's stake on `netuid` to `hotkey`.

- If no lock exists for this coldkey on `netuid`, a new lock is created with conviction 0.
- If a lock already exists, `amount` is added to the locked mass. The hotkey must match the existing lock — use `move_lock` first if switching hotkeys.
- `amount` must not exceed the coldkey's available (unlocked) alpha on the subnet.

**Errors:**
- `InsufficientStakeForLock` — available alpha is less than `amount`
- `LockHotkeyMismatch` — a lock exists for a different hotkey on this subnet
- `AmountTooLow` — amount is zero

**Event emitted:** `StakeLocked { coldkey, hotkey, netuid, amount }`

### `unlock_stake`

```
api.tx.subtensorModule.unlockStake(netuid, amount)
```

Begins the process of unlocking `amount` alpha from the coldkey's existing lock on `netuid`.

- Immediately reduces locked mass by `amount` and conviction by `amount`.
- The unlocked amount enters an exponential decay period. It becomes gradually withdrawable over time with a time constant of **216,000 blocks (≈ 30 days)**: roughly half is available after 30 days, ~86% after 60 days, and so on.
- While stake is in the unlocking period, it **cannot be unstaked or re-locked** — the available stake formula excludes both locked and unlocking amounts.

**Errors:**
- `UnlockAmountTooHigh` — amount exceeds current locked mass

**Event emitted:** `StakeUnlocked { coldkey, hotkey, netuid, amount }`

### `move_lock`

```
api.tx.subtensorModule.moveLock(destination_hotkey, netuid)
```

Reassigns the coldkey's existing lock on `netuid` from its current hotkey to `destination_hotkey`.

- **Conviction resets to zero** when the old and new hotkeys are owned by different coldkeys.
- Conviction is **preserved** when both hotkeys are owned by the same coldkey (moving between your own hotkeys).
- The locked mass and unlocking mass are preserved in both cases.

This gives the previous hotkey's stakers a window to react before conviction rebuilds on the new hotkey.

**Errors:**
- `NoExistingLock` — no lock exists for this coldkey on the subnet

**Event emitted:** `LockMoved { coldkey, origin_hotkey, destination_hotkey, netuid }`

## Subnet owner auto-locking

When a subnet owner receives their distribution cut each epoch, **it is automatically locked** to the subnet owner's hotkey. If the owner already has a lock, the auto-lock tops it up using the existing lock's hotkey. If no lock exists, the auto-lock targets the subnet owner's hotkey.

This means subnet owners start accumulating locked alpha and conviction from the moment they own a subnet. Unlocking requires a conscious `unlock_stake` transaction followed by the 30-day unlock delay.

## Key swap behavior

**Hotkey swap (system-level):** When a hotkey is swapped via `btcli wallet swap-hotkey`, all locks targeting the old hotkey are transferred to the new hotkey. Conviction is **not** reset, because the same coldkey owns both hotkeys.

**Coldkey swap:** A coldkey swap fails if the destination coldkey already has **active locked mass** on any subnet. The swap succeeds if the destination coldkey only has expired or zero-mass locks — those are consolidated with the source coldkey's locks.

## Transferring locked stake

Locked stake can be transferred to another coldkey (e.g., for OTC sales). When stake is transferred:

- Freely available (unlocked, not-in-unlock-period) stake transfers first.
- If the transfer amount exceeds available stake, the shortfall is drawn from unlocking stake, then from locked stake.
- Locked mass and conviction transfer proportionally.
- The lock follows the stake to the destination coldkey.

This means a subnet owner can lock their stake and then transfer it to an investor — the investor receives the stake already locked and must wait through the unlock period before they can unstake.

:::warning For exchanges and tools accepting alpha transfers
If your system accepts alpha stake transfers, check whether the incoming stake carries a lock. Locked alpha cannot be unstaked immediately — an unlock transaction and the 30-day decay period are required first.
:::

## Querying conviction

Two runtime API calls expose conviction state on-chain:

| Method | Returns |
|---|---|
| `get_hotkey_conviction(hotkey, netuid)` | Current total conviction for `hotkey` on `netuid`, summed over all coldkeys that have locked to it |
| `get_most_convicted_hotkey_on_subnet(netuid)` | The hotkey with the highest conviction on `netuid`, or `None` if no locks exist |

Conviction is a rolling value — querying at different blocks yields different results as time passes and the exponential grows.

Tools like [tao.app](https://www.tao.app) and tau.stats are expected to surface per-subnet lock state, including subnet owner lock percentage and conviction scores, providing investors with at-a-glance commitment signals.

## Storage

Lock state is stored in two maps:

- `Lock[(coldkey, netuid, hotkey)]` — per-coldkey lock record containing locked mass, unlocking mass, conviction score, and last update block
- `HotkeyLock[(netuid, hotkey)]` — aggregate lock totals per hotkey (used for conviction queries without iterating all coldkeys)

The maturity time constant (`MaturityRate`) and unlock time constant (`UnlockRate`) are configurable runtime storage values, defaulting to 648,000 and 216,000 blocks respectively.
