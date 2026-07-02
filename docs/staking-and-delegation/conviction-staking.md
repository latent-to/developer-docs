---
title: "Conviction and locked stake"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { ProxyColdkeyWarning } from "../keys/\_proxy-warning.mdx";

# Conviction and locked stake

<ProxyColdkeyWarning />

The locked stake feature lets coldkey holders lock alpha stake to a specific hotkey on a subnet. Locked stake builds **conviction**, a score that grows over time toward the locked amount. Conviction provides a public, on-chain signal of long-term commitment that cannot be silently reversed.

Conviction provides information about subnet owners and other large investors in a subnet. A subnet owner whose alpha is locked has made a cryptographic commitment: unwinding a large position requires switching the lock to decaying mode and then waiting through an exponential decay period before the lock is gone. This gives other stakers advance warning before any large exit completes.

Locking stake binds a specific amount of a coldkey's staked alpha on a subnet to a specific conviction hotkey (lock recipient). The conviction hotkey does not need to be the same hotkey the alpha is staked to: a coldkey can stake to one hotkey and lock to a different one.

The lock code ensures that total alpha staked by the coldkey on that subnet cannot decrease below the locked amount. Everything above the locked amount is freely unstakable.

The coldkey can also continue to stake additional alpha at any time: the lock only blocks the staked balance from dropping below the locked amount.

In perpetual mode, conviction grows over time toward the locked amount, following an exponential curve that slows as it approaches the limit. In decaying mode, conviction is a time-smoothed score: it rises as locked stake matures, then falls as the lock itself decays. The behavior differs significantly between modes and is covered in detail below.

### Decaying and perpetual modes

By default, the locked amount decreases or '**decays**' over time along an exponential curve, freeing up more of the originally locked amount to potentially be unstaked.

Because conviction will rise toward the locked amount, while the locked amount itself falls, over time, conviction will peak somewhere in the middle and then start to fall again.

The locked amount reaches zero (freeing all stake) with no explicit action needed.

A locked amount can also be set to **perpetual** so that it never decreases.

The mode, **decaying** or **perpetual**, is per-coldkey per-subnet and can be changed at any time. Switching from perpetual to decaying initiates the decay process immediately from the current locked mass.

One lock per coldkey per subnet is enforced. If a lock already exists for a coldkey on a subnet, additional `lock_stake` calls top up the locked amount (provided the hotkey matches the existing lock).

## The conviction score

The conviction score grows over time, from zero toward the locked amount. In perpetual mode it follows an exponential curve:

$$c_1 = m - (m - c_0) \cdot e^{-\Delta t / \tau}$$

where:

- $c_0$: conviction at last update
- $c_1$: conviction now
- $m$: locked mass (alpha units)
- $\Delta t$: blocks elapsed since last update
- $\tau$: maturity time constant (`MaturityRate`, a governance-settable on-chain value; query the chain for the current value)

In decaying mode, both the locked mass and conviction decay toward zero, but they follow different curves. Starting from a fresh lock ($c_0 = 0$), conviction first rises as the lock accumulates maturation time, then falls as the mass erodes. The formula (when `UnlockRate` = `MaturityRate` = τ) is:

$$c_1 = e^{-\Delta t / \tau} \left( c_0 + m \cdot \frac{\Delta t}{\tau} \right)$$

$$m_1 = m \cdot e^{-\Delta t / \tau}$$

Switching to perpetual mode stops the mass decay and allows conviction to grow toward the full locked amount.

**90% conviction** (perpetual mode) is reached at approximately $2.3\tau$ blocks. At one time constant $\tau$, conviction is at 63.2% of locked mass.

:::info Current time constants

- `MaturityRate` is currently set to 311,622 blocks (**~43 days**), with a 30-day half-life as of spec version 423.
- `UnlockRate` remains 934,866 blocks (**~130 days**) with a 90-day half-life.

Since both are governance-settable, always query `api.query.subtensorModule.maturityRate()` and `api.query.subtensorModule.unlockRate()` before relying on any specific number in production code.
:::

**Perpetual mode** (fresh lock of 100 alpha, $c_0 = 0$):

| Elapsed | Locked mass | Conviction |
| ------- | ----------- | ---------- |
| 0       | 100         | 0          |
| 0.5τ    | 100         | 39.3       |
| 1τ      | 100         | 63.2       |
| 2τ      | 100         | 86.5       |
| 2.3τ    | 100         | ~90        |
| 3τ      | 100         | 95.0       |

Conviction closes in on the locked mass; maximum conviction equals the locked mass.

<details>
  <summary><strong>See how it's calculated</strong></summary>

Closing a gap between current conviction and the target (locked mass):

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
at ~0.693τ (~30d):  c1 = 100 - 100 × 0.500 = 50.0   ← half-life
at τ       (~43d):  c1 = 100 - 100 × 0.368 = 63.2
at 2τ      (~86d):  c1 = 100 - 100 × 0.135 = 86.5
at 3τ     (~129d):  c1 = 100 - 100 × 0.050 = 95.0
```

Conviction is always closing in on `m`, getting closer every block, never quite arriving.

</details>

![Perpetual mode conviction diagram](/img/docs/conviction/perpetual-mode.svg)

**Decaying mode** (fresh lock of 100 alpha, $c_0 = 0$, `MaturityRate` τₘ = 43 days, `UnlockRate` τᵤ = 130 days):

| Elapsed | Approx. days | Locked mass | Conviction      |
| ------- | ------------ | ----------- | --------------- |
| 0       | 0            | 100         | 0               |
| t\*     | ~71 days     | 57.9        | **57.9 (peak)** |
| 1τᵤ     | ~130 days    | 36.8        | 47.7            |
| 2τᵤ     | ~260 days    | 13.5        | 19.9            |
| 3τᵤ     | ~390 days    | 5.0         | 7.4             |

Conviction peaks at ~57.9% of the original locked mass at day ~71. After the peak, both values fall toward zero. Note that once elapsed time exceeds t\*, conviction exceeds the remaining locked mass; it reflects accumulated commitment, not just current holdings. Topping up an existing lock adds to locked mass immediately, with conviction continuing from its current value.
![Decaying mode conviction diagram](/img/docs/conviction/decaying-mode.svg)

<details>
  <summary><strong>See how it's calculated</strong></summary>

Since `MaturityRate` τₘ ≠ `UnlockRate` τᵤ, the conviction formula uses the following formula:

```
m1 = m × exp(-dt / τᵤ)
c1 = m × γ(dt)
γ  = τᵤ × (exp(-dt/τᵤ) − exp(-dt/τₘ)) / (τᵤ − τₘ)
```

Starting from c0 = 0 (fresh lock of 100 alpha, decaying mode, τₘ = 43 days, τᵤ = 130 days):

```
at t*  (~71d):  m1 = 57.9,  c1 = 57.9  ← peak (conviction = remaining locked mass)
at τᵤ  (130d):  m1 = 36.8,  c1 = 47.7
at 2τᵤ (260d):  m1 = 13.5,  c1 = 19.9
at 3τᵤ (390d):  m1 = 5.0,   c1 = 7.4
```

At the peak, conviction exactly equals the remaining locked mass. After t\*, both fall toward zero. Conviction represents accumulated commitment, not current holdings; beyond t\*, conviction consistently exceeds the remaining locked mass.

</details>

## Subnet owner auto-locking

When a subnet owner receives their distribution cut each epoch, it is **not automatically locked** by default. The owner can opt in to auto-locking by modifying the `owner_cut_auto_lock_enabled` hyperparameter on the subnet. To do this, run the following command in your terminal:

```sh
btcli sudo set --param owner_cut_auto_lock_enabled --value true --netuid NETUID
```

If the owner already has a lock, the auto-lock tops it up using the existing lock's hotkey. If no lock exists, the auto-lock targets the subnet owner's hotkey.

:::info
Once enabled, any lock targeting the subnet owner's hotkey **instantly matures conviction** to the locked amount. This applies to any coldkey locking to the subnet owner's hotkey, not just the owner locking to themselves.
:::

## Key swap behavior

**Hotkey swap:** When a hotkey is swapped via `btcli wallet swap-hotkey`, all locks targeting the old hotkey are transferred to the new hotkey. Conviction is **not** reset, because the same coldkey owns both hotkeys.

**Coldkey swap:** A coldkey swap fails if the destination coldkey already has **active locked mass** on any subnet. The swap succeeds if the destination coldkey only has expired or zero-mass locks.

## Transferring locked stake

When stake is moved to another coldkey **within the same subnet**, lock obligations follow the alpha proportionally. The runtime resolves how much of the transfer carries lock state:

1. **Freely available alpha transfers first**: alpha above the locked amount moves with no lock implications.
2. **Locked alpha is drawn next**: if the transfer exceeds freely available alpha, the remainder comes from locked mass. Conviction transfers proportionally with the locked amount. This step **fails with `LockHotkeyMismatch`** if the destination coldkey already has a lock pointing at a different hotkey.

**Cross-subnet moves are different**: moving stake between subnets goes through unstake → TAO transfer → restake, which must satisfy the lock constraint. You cannot move locked alpha across subnets directly.

## Subnet deregistration

Conviction locks provide no protection against deregistration. The deregistration pruning selector scores subnets by moving alpha price only; locked state is not a factor.

If a subnet is deregistered, conviction lock records for that subnet are deleted before the standard subnet dissolution process runs. The underlying staked alpha is then handled the same way as any other stake on a deregistered subnet: it is converted to TAO pro-rata via the subnet's AMM pool and returned to each coldkey's free balance. Accumulated conviction is gone.

## Querying conviction

<Tabs groupId="conviction-query">
<TabItem value="btcli" label="btcli">

```bash
# All active locks for your coldkey
btcli lock list --wallet.name my_wallet

# Filter to a specific subnet
btcli lock list --wallet.name my_wallet --netuid 1

# View one lock with a conviction projection graph
btcli lock show --wallet.name my_wallet --netuid 1
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

The following methods on `bittensor.Subtensor` read chain state and do not submit any transaction. All accept an optional `block` parameter to query at a specific block number.

`get_coldkey_lock` applies decay to return values accurate at the queried block. `get_stake_lock` returns the raw stored checkpoint without applying decay; `conviction` and `locked_mass` reflect the state at `last_update`, not the current block.

**`LockState`** is a TypedDict returned by the lock query methods:

| Field         | Type      | Description                                |
| ------------- | --------- | ------------------------------------------ |
| `locked_mass` | `Balance` | Locked amount in subnet alpha units        |
| `conviction`  | `float`   | Matured conviction score                   |
| `last_update` | `int`     | Block number of the last stored checkpoint |

| Method                                              | Returns                       | Description                                                                         |
| --------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| `get_coldkey_lock(coldkey_ss58, netuid)`            | `Optional[LockState]`         | Current lock state with decay applied, or `None` if no lock exists                  |
| `get_stake_lock(coldkey_ss58, netuid, hotkey_ss58)` | `Optional[LockState]`         | Raw stored lock checkpoint without decay applied                                    |
| `get_stake_locks(coldkey_ss58, netuid)`             | `list[tuple[str, LockState]]` | All locks for a coldkey on a subnet as (hotkey_ss58, LockState) pairs               |
| `is_perpetual_lock(coldkey_ss58, netuid)`           | `bool`                        | `True` if the lock does not decay; `False` if it is in decaying mode                |
| `get_hotkey_conviction(hotkey_ss58, netuid)`        | `float`                       | Total conviction for a hotkey, summed over all coldkeys that have locked to it      |
| `get_most_convicted_hotkey_on_subnet(netuid)`       | `Optional[str]`               | SS58 address of the hotkey with the highest conviction, or `None` if no locks exist |

```python
import bittensor as bt

st = bt.Subtensor()

# Current lock state with decay applied
lock = st.get_coldkey_lock(coldkey_ss58="5Grw...", netuid=1)
if lock:
    print(lock["locked_mass"])   # Balance in alpha
    print(lock["conviction"])    # float
    print(lock["last_update"])   # block number of last checkpoint

# Total conviction aggregated across all coldkeys locking to this hotkey
conviction = st.get_hotkey_conviction(hotkey_ss58="5FLS...", netuid=1)

# Hotkey with the highest conviction on the subnet
king = st.get_most_convicted_hotkey_on_subnet(netuid=1)
```

</TabItem>
<TabItem value="polkadotjs" label="Polkadot.js">

In [Polkadot.js](https://polkadot.js.org/apps/), go to **Developer → RPC calls** and select the `stakeInfo` module to call `getColdkeyLock`. For the other two methods, go to **Developer → Runtime calls** and select the `stakeInfoRuntimeApi` module.

| Polkadot.js module                    | Method                                   | Returns                                                                                                                |
| ------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| RPC calls → `stakeInfo`               | `getColdkeyLock(coldkey, netuid)`        | The current `LockState` for this coldkey on `netuid`, rolled forward to the current block, or `None` if no lock exists |
| Runtime calls → `stakeInfoRuntimeApi` | `getHotkeyConviction(hotkey, netuid)`    | Current total conviction for `hotkey` on `netuid`, summed over all coldkeys that have locked to it                     |
| Runtime calls → `stakeInfoRuntimeApi` | `getMostConvictedHotkeyOnSubnet(netuid)` | The hotkey with the highest conviction on `netuid`, or `None` if no locks exist                                        |

Conviction is a rolling value: querying at different blocks yields different results as time passes and the exponential evolves.

</TabItem>
</Tabs>

## Extrinsics

Extrinsics are signed transactions submitted to the Subtensor blockchain. The `api.tx.subtensorModule.*` form below is the raw Polkadot.js encoding used for direct chain interaction. The Python SDK (`bittensor.Subtensor`) provides a wrapper method for each extrinsic that handles wallet signing, submission, and optional MEV Shield encryption.

### Locking stake

<Tabs groupId="conviction-extrinsic">
<TabItem value="btcli" label="btcli">

```bash
btcli lock add --wallet.name my_wallet --netuid 1 --hotkey-ss58 5G... --amount 50
```

<details>
  <summary><strong>Show sample output</strong></summary>

```console
btcli lock add --wallet.name SuperPractice --netuid 444 --hotkey-ss58 5GYLDZPadaNcSAkcbPVVA6UYcNWpKwibDS8VAhjGMzKhQhrv --amount 1000

Using the specified network test from config

                                                       Lock Preview

        ┃          ┃    Current ┃            ┃            ┃  Available ┃            ┃            ┃     +365d ┃
 Netuid ┃   Mode   ┃     Locked ┃     Adding ┃ New Locked ┃      After ┃  +30d Free ┃  +90d Free ┃      Free ┃ Hotkey
━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━
  444   │ decaying │ 2,252.1588 │ 1,000.0000 │ 3,252.1588 │ 160,610.2… │   670.9189 │ 1,626.0798 │ 3,056.57… │ 5GYLDZPad…
        │          │         αε │         αε │         αε │         αε │         αε │         αε │        αε │

Owner hotkey target: conviction is pinned to locked alpha by chain rules.
Decaying locks free locked alpha over time. Perpetual locks keep alpha locked until you switch them to decaying.


Lock projection (use --no-graph to hide)
(Alpha (αε)) ^
      3.4k |
      3.0k | ⠢⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      2.7k | ⠀⠀⠉⠢⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      2.3k | ⠀⠀⠀⠀⠀⠉⠒⠤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      1.9k | ⠀⠀⠀⠀⠀⠀⠀⠀⠈⠒⠤⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      1.5k | ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠒⠤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      1.1k | ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠑⠒⠢⢄⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
       759 | ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠒⠒⠢⠤⠤⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
       379 | ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠑⠒⠒⠒⠤⠤⠤⠤⢄⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      0.00 | ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠒⠒⠒⠒
-----------|-|---------|---------|---------|---------|---------|---------|-> (Days)
           | 0         61        122       182       243       304       365

Legend:
-------
⠤⠤ Locked = Conviction
Owner hotkey target: one line represents both locked alpha and conviction.

Submit lock top-up? [y/n] (n): y
Enter your password:
Decrypting...
✅ Your extrinsic has been included as 7264727-6
✅ Lock add succeeded.
```

</details>

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
response = subtensor.lock_stake(
    wallet=wallet,
    hotkey_ss58="5G...",
    netuid=1,
    amount=amount,  # Balance in subnet alpha units
)
```

MEV Shield protection is enabled by default. Pass `mev_protection=False` to submit without it. The `period`, `wait_for_inclusion`, and `wait_for_finalization` keyword arguments control submission behavior.

</TabItem>
<TabItem value="chain" label="Chain extrinsic">

```
api.tx.subtensorModule.lockStake(hotkey, netuid, amount)
```

</TabItem>
</Tabs>

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

### Setting lock mode to perpetual

<Tabs groupId="conviction-extrinsic">
<TabItem value="btcli" label="btcli">

```bash
# View current mode
btcli lock mode --wallet.name my_wallet --netuid 1

# Switch to perpetual
btcli lock mode --wallet.name my_wallet --netuid 1 --mode perpetual

# Resume decaying
btcli lock mode --wallet.name my_wallet --netuid 1 --mode decaying
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
response = subtensor.set_perpetual_lock(
    wallet=wallet,
    netuid=1,
    enabled=True,   # False to resume decaying
)
```

</TabItem>
<TabItem value="chain" label="Chain extrinsic">

```
api.tx.subtensorModule.setPerpetualLock(netuid, enabled)
```

</TabItem>
</Tabs>

Sets or clears perpetual lock mode for the coldkey's lock on `netuid`.

- `enabled = true`: the coldkey's locked mass no longer decays. Conviction can grow toward the full locked amount.
- `enabled = false`: the coldkey's locked mass resumes decaying. This is how you initiate an exit from a lock; the mass decays exponentially over time according to `UnlockRate`.

Switching modes rolls the lock forward to the current block first, so no mass or conviction is lost in the transition.

:::note Switching to decaying mode is public
Calling `set_perpetual_lock(false)` emits the `PerpetualLockUpdated` event on-chain immediately. This is by design: the decay period exists specifically so that other stakers can observe the signal and act accordingly. A switch to decaying mode by a subnet owner should be interpreted as a potential intent to reduce their position.
:::

**Event emitted:** `PerpetualLockUpdated { coldkey, netuid, enabled }`

### Moving a lock

<Tabs groupId="conviction-extrinsic">
<TabItem value="btcli" label="btcli">

```bash
btcli lock move --wallet.name my_wallet --netuid 1 --dest 5G...
```

Omit `--dest` for interactive hotkey selection.

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
response = subtensor.move_lock(
    wallet=wallet,
    destination_hotkey_ss58="5G...",
    netuid=1,
)
```

MEV Shield protection is enabled by default. Pass `mev_protection=False` to submit without it.

</TabItem>
<TabItem value="chain" label="Chain extrinsic">

```
api.tx.subtensorModule.moveLock(destination_hotkey, netuid)
```

</TabItem>
</Tabs>

Reassigns the coldkey's existing lock on `netuid` from its current hotkey to `destination_hotkey`.

- **Conviction resets to zero** when the old and new hotkeys are owned by different coldkeys.
- Conviction is **preserved** when both hotkeys are owned by the same coldkey (moving between your own hotkeys).
- The locked mass of alpha within the subnet is conserved across the move from one hotkey to another.

**Errors:**

- `NoExistingLock`: no lock exists for this coldkey on the subnet

**Event emitted:** `LockMoved { coldkey, origin_hotkey, destination_hotkey, netuid }`

:::note Locking does not affect emissions
Locking stake does not change the amount of emissions you receive. Emissions are determined by stake weight and consensus participation.
:::

## Subnet ownership changes

:::info Active as of spec version 425
Conviction-based ownership enforcement is now live. `change_subnet_owner_if_needed()` runs automatically after each subnet epoch.
:::

Ownership transfers automatically at the end of each block's coinbase run if two conditions hold simultaneously:

1. The subnet is at least **one year old** (≥ 7,200 × 365 + 1,800 blocks from `networkRegisteredAt`)
2. Total aggregate conviction across all locks on the subnet ≥ **10% of `SubnetAlphaOut`**

The hotkey with the highest aggregate conviction (`subnet_king`) then becomes the subnet owner hotkey, and that hotkey's owning coldkey becomes the subnet owner.

**To monitor readiness via Polkadot.js (Developer → Chain state → `subtensorModule`):**

| Query                                                                                        | What it tells you                                                         |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `networkRegisteredAt(netuid)`                                                                | Block the subnet was created; add 2,629,800 to get the one-year threshold |
| `subnetAlphaOut(netuid)`                                                                     | Total outstanding alpha; 10% of this is the conviction threshold          |
| Developer → Runtime calls → `stakeInfoRuntimeApi` → `getMostConvictedHotkeyOnSubnet(netuid)` | The hotkey that would currently win ownership                             |
| Developer → Runtime calls → `stakeInfoRuntimeApi` → `getHotkeyConviction(hotkey, netuid)`    | Any hotkey's current aggregate conviction score                           |

## Storage

All six storage items live under **Developer → Chain state → `subtensorModule`** in Polkadot.js.

| Storage item                         | Keys                    | Contents                                                   |
| ------------------------------------ | ----------------------- | ---------------------------------------------------------- |
| `lock(coldkey, netuid, hotkey)`      | coldkey, netuid, hotkey | Individual per-coldkey lock record (`LockState`)           |
| `hotkeyLock(netuid, hotkey)`         | netuid, hotkey          | Aggregate perpetual lock totals for non-owner hotkeys      |
| `decayingHotkeyLock(netuid, hotkey)` | netuid, hotkey          | Aggregate decaying lock totals for non-owner hotkeys       |
| `ownerLock(netuid)`                  | netuid                  | Aggregate perpetual lock total for the subnet owner hotkey |
| `decayingOwnerLock(netuid)`          | netuid                  | Aggregate decaying lock total for the subnet owner hotkey  |
| `decayingLock(coldkey, netuid)`      | coldkey, netuid         | `false` = perpetual mode; absent = decaying (default)      |

Two governance-settable parameters control the time constants:

- **`MaturityRate`**: time constant τ (in blocks) for conviction growth in perpetual mode. Currently set to ~43 days (~311,622 blocks) as of spec version 423.
- **`UnlockRate`**: time constant τ (in blocks) for locked mass decay in decaying mode. Currently set to a 90-day half-life (spec version 423).

Both are adjustable by governance. Query `api.query.subtensorModule.maturityRate()` and `api.query.subtensorModule.unlockRate()` for current values before computing time estimates.

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

In decaying mode (`perpetual_lock = false`), when `unlock_rate == maturity_rate`:

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
