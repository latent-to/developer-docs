---
title: "Subnet Configuration (Hyperparameters)"
---

# Subnet Configuration (Hyperparameters)

Bittensor subnets are configured with a set of state variables (known as hyperparameters) that are recorded on the blockchain. Many of these can be accessed (viewed and set) using the Bittensor CLI `btcli`, but some of them must be checked or set using Subtensor extrinsics, as noted.

Note that the names of the variables may be slightly different in various representations, e.g. in `btcli` and in the [chain codebase](https://github.com/RaoFoundation/subtensor/blob/main/runtime/src/lib.rs#L1038).

Non-root neuron (UID) registration pricing is driven by **`BurnHalfLife`** and **`BurnIncreaseMult`**, with **`MinBurn`** and **`MaxBurn`** as bounds. Confirm live names and values with `btcli subnet hyperparameters`.

## Manage hyperparams with `btcli`

This section covers how to use BTCLI to view, update, and verify network hyperparameters directly from the terminal.

### View the hyperparameters

Any user can view the hyperparameters of any subnet by using the `btcli subnets hyperparameters` command and including the `--netuid` flag . The command displays the subnet hyperparameter information, including their values, descriptions, and permission information.

**Example**

```bash
btcli subnet hyperparameters --netuid 14
```

<!-- TODO: refresh sample output of `btcli subnet hyperparameters --netuid 14` once the neuron registration rework (subtensor PR #2382) is live on finney. -->

Run the command against your target network to see current hyperparameter names, values, and descriptions.

### Set hyperparameters on BTCLI {#set-hyperparameters}

Setting hyperparameters can be set using BTCLI requires the appropriate permissions. Only the subnet owner coldkey or a coldkey with root permissions can modify subnet hyperparameters. Hyperparameters that require root permissions cannot be set using BTCLI.

To set a hyperparameter:

```bash
btcli sudo set --netuid 14
```

<details>
    <summary><strong>Show sample output</strong></summary>
    
<!-- prettier-ignore-start -->

```
Available hyperparameters:

#      HYPERPARAMETER                     OWNER SETTABLE       DESCRIPTION
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
1      activity_cutoff                    Yes                  Effective validator inactivity cutoff in blocks, computed as activity_cutoff_factor × tempo ÷ 1000. Read-only; set activity_cutoff_factor instead.
2      activity_cutoff_factor             COMPLICATED          Tolerated validator inactivity as per-mille of tempo (1000 = one full tempo). Effective cutoff in blocks = factor × tempo ÷ 1000. Allowed range: 1000
                                                               to 50000.
3      alpha_high                         Yes                  High bound of the alpha range for stake calculations.
4      alpha_low                          Yes                  Low bound of the alpha range for stake calculations.
5      alpha_sigmoid_steepness            No (Root Only)       Steepness parameter for alpha sigmoid function.
6      alpha_values                       Yes                  Alpha range  for stake calculations.
7      bonds_moving_avg                   Yes                  Moving average window size for bond calculations.
8      bonds_reset_enabled                Yes                  Enable or disable periodic bond resets.
9      burn_half_life                     Yes                  Half-life (in blocks) controlling how quickly the registration burn price decays back toward min_burn.
10     burn_increase_mult                 Yes                  Multiplier applied to the registration burn price after each successful registration.
11     commit_reveal_period               Yes                  Duration (in blocks) for commit-reveal weight submission scheme.
12     commit_reveal_weights_enabled      Yes                  Enable or disable commit-reveal scheme for weight submissions.
13     immunity_period                    Yes                  Duration (in blocks) during which newly registered neurons are protected from certain penalties.
14     kappa                              No (Root Only)       Kappa determines the scaling factor for consensus calculations.
15     liquid_alpha_enabled               Yes                  Enable or disable liquid alpha staking mechanism.
16     max_allowed_uids                   Yes                  Maximum number of UIDs (neurons) on the subnet, essentially 'untrimming'.
17     max_burn                           COMPLICATED          Maximum TAO burn amount cap for subnet registration.
18     max_regs_per_block                 No (Root Only)       Maximum number of registrations allowed per block.
19     max_validators                     No (Root Only)       Maximum number of validators allowed in the subnet.
20     min_allowed_uids                   No (Root Only)       Minimum number of UIDs (neurons) required for the subnet to remain active.
21     min_allowed_weights                Yes                  Minimum number of weight connections a neuron must maintain to stay active.
22     min_burn                           Yes                  Minimum TAO burn amount required for subnet registration.
23     min_childkey_take                  Yes                  Minimum childkey take (%) required on this subnet. Settable by the subnet owner. Cannot be set below the global protocol minimum.
24     network_pow_registration_allowed   Yes                  Enable or disable proof-of-work based registration.
25     owner_cut_auto_lock_enabled        Yes                  Whether the subnet owner cut is automatically locked when collected.
26     owner_cut_enabled                  Yes                  Whether the subnet owner cut is taken from the subnet's emissions.
27     recycle_or_burn                    Yes                  Set whether subnet TAO is recycled or burned.
28     registration_allowed               No (Root Only)       Enable or disable new registrations to the subnet.
29     serving_rate_limit                 Yes                  Rate limit for serving requests.
30     sn_owner_hotkey                    Yes                  Set the subnet owner hotkey.
31     subnet_is_active                   Yes                  Whether the subnet is currently active and operational.
32     subnet_owner_hotkey                Yes                  Alias for sn_owner_hotkey; sets the subnet owner hotkey.
33     target_regs_per_interval           No (Root Only)       Target number of new registrations per adjustment interval.
34     tempo                              COMPLICATED          Number of blocks between automatic epoch transitions. Owner-settable between 360 and 50400 blocks (rate-limited to one change per 360 blocks); root
                                                               can set any value via sudo.
35     transfers_enabled                  Yes                  Enable or disable TAO transfers within the subnet.
36     weights_rate_limit                 No (Root Only)       Maximum number of weight updates allowed per epoch.
37     weights_version                    Yes                  Version key for weight sets.
38     yuma3_enabled                      Yes                  Enable or disable Yuma3 consensus mechanism.
39     yuma_version                       Yes                  Version of the Yuma consensus mechanism.



Enter the number of the hyperparameter: 7

Selected: bonds_moving_avg
Moving average window size for bond calculations. link
Side Effects: Larger windows provide smoother bond values but slower response to changes. Smaller windows react faster but may be more volatile.
📚 Docs: https://docs.learnbittensor.org/subnets/subnet-hyperparameters#bondsmovingaverage

Enter the new value for bonds_moving_avg in the VALUE column format: 89000
Enter the wallet name (Hint: You can set this with `btcli config set --wallet-name`) (default): sn-creator
Enter your password:
Decrypting...
✅ Your extrinsic has been included as 1671-6
✅ Hyperparameter bonds_moving_avg changed to 89000
```

<!-- prettier-ignore-end -->

</details>

#### Set custom hyperparameters

You can also modify values for hyperparameters that are not included in the table. To do this, you must provide the hyperparameter's setter extrinsic and value when running the `btcli sudo set` command.

```sh
 btcli sudo set --param SETTER_EXTRINSIC --value VALUE --netuid NETUID
```

:::info custom hyperparameter values

When using custom hyperparameters, provide values in the format that matches their underlying type. For numeric types like `u16` or `u64`, you must pass a normalized floating point value between `0` and `1`. Alternatively, add the `--normalize` flag to provide a base-10 integer value instead.

For example, the following command sets the number of owner-immune neurons to four using a base-10 value:

```sh
btcli sudo set --param sudo_set_owner_immune_neuron_limit --value 4 --normalize
```

:::

## Runtime API: `get_subnet_hyperparams_v3`

The canonical runtime API for fetching subnet hyperparameters is `get_subnet_hyperparams_v3`. V1 and V2 are deprecated.

V3 returns `Option<Vec<HyperparamEntry>>` (None if the subnet does not exist). Each entry is:

```rust
struct HyperparamEntry {
    name: Vec<u8>,     // ASCII identifier, e.g. b"kappa"
    value: HyperparamValue,
}

enum HyperparamValue {
    Bool(bool),
    U16(u16),
    U32(u32),
    U64(u64),
    U128(u128),
    TaoBalance(u64),
    I32F32(i32f32),
    U64F64(u64f64),
}
```

Clients look up params by name. Unknown names are forward-compatible additions and should be ignored rather than treated as errors.

**Params removed from V3** (no longer returned): `adjustment_alpha`, `adjustment_interval`, `difficulty`, `min_difficulty`, `max_difficulty`, `rho`.

**Params added in V3**: `burn_half_life`, `burn_increase_mult`, `owner_cut_enabled`, `owner_cut_auto_lock_enabled`.

## Subnet Hyperparameters

This section details all subnet hyperparameters, including their default values, descriptions, and the setter extrinsics required to modify them.

### ActivityCutoff

:::warning Deprecated
With the introduction of dynamic tempos, the `ActivityCutoff` hyperparameter is no longer settable. Use the [`activity_cutoff_factor`](#activitycutofffactor) instead.

The BTCLI display for `activity_cutoff` still shows the computed block value for readability.
:::

**Type**: u16

**Default**: 5000

**`btcli` setter**: `btcli sudo set --param activity_cutoff`

**Setter extrinsic**: `sudo_set_activity_cutoff`

**Permissions required to set**: Subnet owner

**Description**:

The number of blocks for the stake to become inactive for the purpose of epoch in Yuma Consensus. If a validator doesn't submit weights within the first `ActivityCutoff` blocks of the epoch, it will not be able to participate until the start of the next epoch.

### ActivityCutoffFactor

**Type**: u32

**Default**: 13,889 (≈ 13.889 tempos—preserves the legacy 5,000-block cutoff at the default tempo of 360)

**`btcli` setter**: `btcli sudo set --param activity_cutoff_factor`

**Setter extrinsic**: `set_activity_cutoff_factor`

**Permissions required to set**: Subnet owner

**Description**:

The validator inactivity tolerance expressed in **per-mille epochs** (1/1000 granularity). Bounded by `MinActivityCutoffFactorMilli`—`1000` and `MaxActivityCutoffFactorMilli`—`50,000`

<details> 
<summary><strong>See how its calculated</strong></summary>

The effective cutoff in blocks is computed at runtime as:

```
cutoff_blocks = (ActivityCutoffFactorMilli × Tempo) / 1000
```

This means the activity cutoff scales automatically with tempo—a subnet with a longer tempo gets a proportionally longer inactivity window, which prevents validators from being excluded for not submitting weights at a rate that doesn't match their subnet's epoch schedule.

</details>

### AlphaSigmoidSteepness

**Type**: i16

**Default**: 1000

**`btcli` setter**: `btcli sudo set --param alpha_sigmoid_steepness`

**Setter extrinsic**: `sudo_set_alpha_sigmoid_steepness`

**Permissions required to set**: Subnet owner

**Description**:
`AlphaSigmoidSteepness` determines how the consensus mechanism assigns an alpha value for a given miner-validator pair based on voting alignment. Lower steepness values result in moderate alpha values, while higher steepness values push alpha values closer to the defined `alpha_low` or `alpha_high` values.

### AlphaValues

**Type**: nil

**Default**: nil

**`btcli` setter**: `btcli sudo set --param sudo_set_alpha_values`

**Setter extrinsic**: `sudo_set_alpha_values`

**Permissions required to set**: Subnet owner

**Description**:
The `AlphaValues` hyperparameter sets the values for [liquid alpha](../concepts/consensus-based-weights.md) on a subnet. Modifying the `AlphaValues` hyperparameter will require you to set the `alpha_low` and `alpha_high` values for the subnet.

### BondsMovingAverage

**Type**: u64

**Default**:

**`btcli` setter**: `btcli sudo set --param bonds_moving_avg`

**`btcli` setter**: `sudo_set_bonds_moving_average`

**Permissions required to set**: Subnet owner

**Description**:

The moving average of bonds. The higher bonds yield to higher dividends for validators.

See [Yuma Consensus: bonding mechanics](../learn/yuma-consensus#bonding-mechanics).

### BondsPenalty

**Type**: u16

**Default**: 0

**`btcli` setter**: none

**Setter extrinsic**: `sudo_set_bonds_penalty`

**Permissions required to set**: Subnet owner

**Description**:
The magnitude of the penalty subtracted from weights for exceeding consensus, for a specific subnet.

See [Yuma Consensus: Penalizing out-of-consensus bonds](../learn/yuma-consensus#penalizing-out-of-consensus-bonds).

### BondsResetEnabled

**Type**: Bool

**Default**: False

**`btcli` setter**: `btcli sudo set --param bonds_reset_enabled`

**Setter extrinsic**: `sudo_set_bonds_reset_enabled`

**Permissions required to set**: Subnet owner

**Description**:

Determines whether or not bonds are reset-enabled.

### BurnHalfLife

**Type**: Confirm on target network (typically a block count)

**Default**: Network-dependent; use `btcli subnet hyperparameters`

**`btcli` setter**: Use the parameter name as listed by `btcli subnet hyperparameters` on your network (often `burn_half_life`)

**Setter extrinsic**: `sudo_set_burn_half_life`

**Permissions required to set**: Subnet owner

**Description**:

**`BurnHalfLife`** sets the decay horizon (in blocks) for the **neuron registration burn cost** between registrations: a longer half-life means the price falls more slowly when nobody registers.

### BurnIncreaseMult

**Type**: Confirm on target network (floating-point multiplier in the runtime)

**Default**: Network-dependent; use `btcli subnet hyperparameters`

**`btcli` setter**: Use the parameter name as listed by `btcli subnet hyperparameters` on your network (often `burn_increase_mult`)

**Setter extrinsic**: `sudo_set_burn_increase_mult`

**Permissions required to set**: Subnet owner

**Description**:

**`BurnIncreaseMult`** is the factor by which the **current** neuron registration burn cost is **multiplied when a registration succeeds** (before **`MinBurn`** / **`MaxBurn`** clamping). Higher values make rapid successive registrations more expensive.

### CommitRevealPeriod

**Type**: u64

**Default**: 1

**`btcli` setter**: `btcli sudo set --param commit_reveal_period`

**Setter extrinsic**: `sudo_set_commit_reveal_weights_interval`

**Permissions required to set**: Subnet owner

**Description**:

The number of **tempos** (epochs) that must elapse before validator weights are revealed from time-lock encryption. Prevents weight-copying.

**Important**: This is measured in **tempos**, not blocks. A tempo equals the subnet's configured `tempo` hyperparameter (default 360 blocks). For example, if you set `commit_reveal_period` to 3 and your subnet's configured `tempo` is 360, weights will be revealed after 3 tempos = 1080 blocks.

See [Commit Reveal](../concepts/commit-reveal) for details on how commit reveal works.

### CommitRevealWeightsEnabled

**Type**: Boolean

**Default**: False

**`btcli` setter**: `btcli sudo set --param commit_reveal_weights_enabled`

**Setter extrinsic**: `sudo_set_commit_reveal_weights_enabled`

**Permissions required to set**: Subnet owner

**Description**:

Enables [Commit Reveal](../concepts/commit-reveal)

### EMAPriceHalvingPeriod

**Type**: u64

**Default**: 201600

**`btcli` setter**: n/a

**Setter extrinsic**: `sudo_set_ema_price_halving_period`

**Permissions required to set**: Root

**Description**:

Sets the halving time of average moving price on a subnet.

### ImmuneOwnerUidsLimit

**Type**: u16

**Default**: 1

**`btcli` setter**: `btcli sudo set --param sudo_set_owner_immune_neuron_limit`

**Setter extrinsic**: `sudo_set_owner_immune_neuron_limit`

**Permissions required to set**: Subnet owner

**Description**:

The `ImmuneOwnerUidsLimit` hyperparameter determines the maximum number neurons that can be marked as owner-immune on a subnet.

### ImmunityPeriod

**Type**: u16

**Default**: 5000

**`btcli` setter**: `btcli sudo set --param immunity_period`

**Setter extrinsic**: `sudo_set_immunity_period`

**Permissions required to set**: Subnet owner

**Description**:

The number of blocks after registration when a miner is protected from deregistration

### Kappa

**Type**: u16

**Default**: 32767 ( or approximately 0.5 normalized )

**`btcli` setter**: `btcli sudo set --param kappa`

**Setter extrinsic**: `sudo_set_kappa`

**Permissions required to set**: Root

**Description**:

The consensus majority ratio: The weights set by validators who have lower normalized stake than Kappa are not used in calculating consensus, which affects ranks, which affect incentives.

the consensus threshold for bond-clipping during [Yuma Consensus](../learn/yuma-consensus)

### LiquidAlphaEnabled

**Type**: Bool

**Default**: False

**`btcli` setter**: `btcli sudo set --param liquid_alpha_enabled`

**Setter extrinsic**: `sudo_set_liquid_alpha_enabled`

**Permissions required to set**: Subnet owner

**Description**:

Enables the [liquid alpha ](../concepts/consensus-based-weights) feature.

### MaxAllowedUids

**Type**: u16

**Default**: 256

**`btcli` setter**: `btcli sudo set --param sudo_trim_to_max_allowed_uids` / `btcli sudo trim`

**Setter extrinsic**: `sudo_trim_to_max_allowed_uids`

**Permissions required to set**: Subnet owner

**Description**:

Maximum number of neurons on a subnet.

### MaxAllowedValidators

**Type**: u16

**Default**: 64

**`btcli` setter**: `btcli sudo set --param max_validators`

**Setter extrinsic**: `sudo_set_max_allowed_validators`

**Permissions required to set**: Root

**Description**:

Maximum validators on a subnet.

### MaxBurn

**Type**: u64

**Default**: 100000000000 normalized to 100.0000(τ)

**`btcli` setter**: `btcli sudo set --param max_burn`

**Setter extrinsic**: `sudo_set_max_burn`

**Permissions required to set**: Subnet owner

**Description**:

Upper bound for the **dynamic TAO burn** required for **neuron (UID) registration** on the subnet. This clamps the price together with [MinBurn](#minburn); **`BurnHalfLife`** and **`BurnIncreaseMult`** shape how the price moves over time and on each registration.

### MaxRegistrationsPerBlock

**Type**: u16

**Default**: 1

**`btcli` setter**: `btcli sudo set --param max_regs_per_block`

**Setter extrinsic**: `sudo_set_max_registrations_per_block`

**Permissions required to set**: Root

**Description**:

Not used for neuron registration. Neuron admission is governed by continuous burn pricing; see [BurnHalfLife](#burnhalflife) and [BurnIncreaseMult](#burnincreasemult).

### MechanismCount

**Type**: u8

**Default**: 1

**`btcli` setter**: n/a

**Setter extrinsic**: `sudo_set_mechanism_count`

**Permissions required to set**: Subnet owner

**Description**:
Sets the number of mechanisms on a subnet. Before modifying this hyperparameter, you must ensure that the new mechanism count multiplied by the maximum number of UIDs in a subnet must be less than 256. To learn more about trimming UIDs, see [UID trimming](../subnets/uid-trimming.md).

### MechanismEmissionSplit

**Type**: `<Vec<u16>>`

**Default**: n/a

**`btcli` setter**: n/a

**Setter extrinsic**: `sudo_set_mechanism_emission_split`

**Permissions required to set**: Subnet owner

**Description**:
The `MechanismEmissionSplit` sets the emissions splits of mechanisms in a subnet.

### MinAllowedUids

**Type**: u16

**Default**: 64

**`btcli` setter**: n/a

**Setter extrinsic**: `sudo_set_min_allowed_uids`

**Permissions required to set**: Root

**Description**:
This hyperparameter sets the minimum allowed UIDs for a subnet. It is only callable by the root account.

### MinAllowedWeights

**Type**: u16

**Default**: 1

**`btcli` setter**: `btcli sudo set --param min_allowed_weights`

**Setter extrinsic**: `sudo_set_min_allowed_weights`

**Permissions required to set**: Subnet owner

**Description**:
Minimum number of weights for a validator to set when setting weights.

### MinBurn

**Type**: u64

**Default**: 500000 normalized to 0.0005(τ)

**`btcli` setter**: `btcli sudo set --param min_burn`

**Setter extrinsic**: `sudo_set_min_burn`

**Permissions required to set**: Subnet owner

**Description**:

Lower bound for the **dynamic TAO burn** required for **neuron (UID) registration** on the subnet. This clamps the price together with [MaxBurn](#maxburn).

### MinNonImmuneUids

**Type**: u16

**Default**: 10

**`btcli` setter**: n/a

**Setter extrinsic**: `sudo_set_min_non_immune_uids`

**Permissions required to set**: Root

**Description**:
Sets the minimum number non-immune UIDs that must remain in a subnet. It is only callable by the root account.

### NetworkPowRegistrationAllowed

**Type**: Boolean

**Default**: False

**`btcli` setter**: none

<!-- Is it weird this one doesn't have a  btcli setter like registration_allowed ??? -->

**Setter extrinsic**: `sudo_set_network_pow_registration_allowed`

**Permissions required to set**: Subnet owner

**Description**:

Not used for neuron registration. Neuron registration is burn-based and always open; see [Understanding Neurons](../learn/neurons.md).

### NetworkRateLimit

**Type**: u64

**Default**: 14400

**`btcli` setter**: none

**Setter extrinsic**: `sudo_set_network_rate_limit`

**Permissions required to set**: Root

**Description**:

Rate limit for network registrations expressed in blocks

### NetworkRegistrationAllowed

**Type**: Boolean

**Default**: True

**`btcli` setter**: `btcli sudo set --param registration_allowed`

**Setter extrinsic**: `sudo_set_network_registration_allowed`

**Permissions required to set**: Root

**Description**:

`NetworkRegistrationAllowed` determines whether neuron registration is enabled on the subnet. If disabled, the subnet will not receive new neurons.

### OwnerCutAutoLockEnabled

**Type**: Bool

**Default**: `false`

**`btcli` setter**: none

**Setter extrinsic**: `sudo_set_owner_cut_auto_lock_enabled`

**Permissions required to set**: Subnet owner

**Description**:

Controls whether the subnet owner's cut of emissions is automatically locked each epoch. When `true`, the distribution cut is added to the owner's conviction lock (topping up an existing lock or creating a new one targeting the owner hotkey). When `false`, the cut is received as free stake with no auto-locking. Exposed in `get_subnet_hyperparams_v3`.

### OwnerCutEnabled

**Type**: Bool

**Default**: `true`

**`btcli` setter**: none

**Setter extrinsic**: `sudo_set_owner_cut_enabled`

**Permissions required to set**: Subnet owner

**Description**:

Controls whether the subnet owner receives their cut of emissions at all. When set to `false`, the owner cut is not distributed. Defaults to `true`. Exposed in `get_subnet_hyperparams_v3`.

### OwnerHyperparamRateLimit

**Type**: u16

**Default**: 2 (tempos)

**`btcli` setter**: none

**Setter extrinsic**: `sudo_set_owner_hparam_rate_limit`

**Permissions required to set**: Root

**Description**:

Global multiplier that rate-limits how frequently a subnet owner can update subnet hyperparameters. The cooldown window equals `Tempo(netuid) × OwnerHyperparamRateLimit` blocks. The rate limit is tracked independently per hyperparameter; changing `kappa` does not block an immediate change to `rho`, for example.

### OwnerCutAutoLockEnabled

**Type**: bool

**Default**: true

**`btcli` setter**: n/a

**Setter extrinsic**: `sudo_set_owner_cut_auto_lock_enabled`

**Permissions required to set**: Subnet owner or Root

**Description**:

Controls whether the subnet owner's cut of emissions is automatically locked (converted to locked stake) rather than distributed as liquid TAO. Defaults to `true`. Exposed in `get_subnet_hyperparams_v3`.

### OwnerCutEnabled

**Type**: bool

**Default**: true

**`btcli` setter**: n/a

**Setter extrinsic**: `sudo_set_owner_cut_enabled`

**Permissions required to set**: Subnet owner or Root

**Description**:

Controls whether the subnet owner receives their cut of emissions at all. When set to `false`, the owner cut is not distributed. Defaults to `true`. Exposed in `get_subnet_hyperparams_v3`.

### RecycleOrBurn

**Type**: `RecycleOrBurnEnum`

**Default**: Burn

**`btcli` setter**: n/a

**Setter extrinsic**: `sudo_set_recycle_or_burn`

**Permissions required to set**: Subnet owner

**Description**: The `RecycleOrBurnEnum` hyperparameter sets the behaviour of the burn UIDs for a given subnet. If set to `Burn`, the miner emission sent to the burn UID(s) will be burned. If set to `Recycle`, the miner emission sent to the burn UID(s) will be recycled.

### ServingRateLimit

**Type**: u64

**Default**: 50

**`btcli` setter**: `btcli sudo set --param serving_rate_limit`

**Setter extrinsic**: `sudo_set_serving_rate_limit`

**Permissions required to set**: Subnet owner

**Description**:

Rate limit for calling `serve_axon` and `serve_prometheus` extrinsics used by miners.

### SubtokenEnabled

**Type**: Bool

**Default**: True

**`btcli` setter**: n/a

**Setter extrinsic**: `sudo_set_subtoken_enabled`

**Permissions required to set**: Root

**Description**:
Enables or disables subtoken trading for a given subnet.

### SubnetIsActive

**Type**: Bool

**Default**: False

**`btcli` setter**: `btcli subnets start`

**Setter extrinsic**: nil

**Permissions required to set**: Subnet owner

**Description**:
Indicates whether or not the subnet's emissions have started.

### SubnetOwnerHotkey

**Type**: n/a

**Default**: Defaults to the hotkey of the account that created the subnet.

**`btcli` setter**: `btcli sudo set --param sudo_set_subnet_owner_hotkey`

**Setter extrinsic**: `sudo_set_subnet_owner_hotkey`

**Permissions required to set**: Subnet owner

**Description**:
Changes the hotkey of the subnet owner on the subnet.

### TargetRegistrationsPerInterval

**Type**: u16

**Default**: 1

**`btcli` command**: `btcli sudo set --param target_regs_per_interval`

**Setter extrinsic**: `sudo_set_target_registrations_per_interval`

**Permissions required to set**: Root

**Description**:

Not used for neuron registration. Neuron admission is governed by continuous burn pricing; see [BurnHalfLife](#burnhalflife) and [BurnIncreaseMult](#burnincreasemult).

### Tempo

**Type**: u16

**Default**: 360

**`btcli` setter**: `btcli sudo set --param tempo`

**Setter extrinsics**: The `tempo` hyperparameter can be updated through one of two setter extrinsics, depending on the applicable permissions:

- `set_tempo` — requires subnet owner permissions; bounded to `[MinTempo, MaxTempo]` (360–50,400 blocks); rate-limited to one call per 360 blocks regardless of current tempo
- `sudo_set_tempo` — requires root permissions; accepts any `u16`, no bounds enforced, no rate limit

**Permissions required to set**: Subnet owner (bounded) or Root (unbounded)

**Description**:

The number of blocks between Yuma Consensus epoch transitions for the subnet. See [Emission](../learn/emissions.md).

### ToggleTransfer

**Type**: Boolean

**Default**: True

**`btcli` setter**: `btcli sudo set --param transfers_enabled`

**Setter extrinsic**: `sudo_set_toggle_transfer`

**Permissions required to set**: Subnet owner

**Description**:

Allows/disallows transfer of stake between coldkeys.

### UserLiquidityEnabled

**Type**: Bool

**Default**: False

**`btcli` setter**: `btcli sudo set --param user_liquidity_enabled`

**Setter extrinsic**: `toggle_user_liquidity`

**Permissions required to set**: Subnet owner

**Description**:

Determines whether or not the user liquidity feature is enabled on the subnet.

### WeightsVersion

**Type**: u64

**Default**: 0

**`btcli` setter**: `btcli sudo set --param weights_version`

**Setter extrinsic**: `sudo_set_weights_version_key`

**Permissions required to set**: Subnet owner

**Description**:

If the version key specified in `set_weights` extrinsic is lower than this system-wide setting (`WeightsVersionKey`), the transaction will fail. This is a fool-proofing protection for validators to update, not a security feature.

<!-- need more explanation/clarification ??? -->

### WeightsRateLimit / CommitmentRateLimit

**Type**: u64

**Default**: 100

**`btcli` setter**: `btcli sudo set --param weights_rate_limit`

**Setter extrinsic**: `sudo_set_weights_set_rate_limit`

**Permissions required to set**: Root

**Description**:

How long, in blocks, a validator must wait between weight commits on a subnet.

### YumaVersion

**Type**: Bool

**Default**: False

**`btcli` setter**: `btcli sudo set --param yuma_version`

**Setter extrinsic**: `sudo_set_yuma3_enabled`

**Permissions required to set**: Subnet owner

**Description**:

Toggles the consensus mechanism used by the subnet between Yuma Consensus v2 and v3.

## Global/Root State Variables

The following variables are global and/or can only be configured with `root` permissions, which are held by a triumvirate of Opentensor Foundation employees. They are listed here for reference.

### ColdkeySwapAnnouncementDelay

**Type**: u12

**Default**: `36000`

**`btcli` setter**: no

**Setter extrinsic**: `sudo_set_coldkey_swap_announcement_delay`

**Permissions required to set**: Root

**Description**:

The duration in blocks of the waiting period before a coldkey swap.

See [Rotate/Swap your Coldkey](../keys/coldkey-swap)

<!-- fact check what is this on chain -->

### DissolveNetworkScheduleDuration

Deprecated

### EmissionValue

**Description**:

Deprecated. replaced with SubnetAlphaInEmission, SubnetAlphaOutEmission, and SubnetTaoInEmission.

### EvmChainId

**Permissions required to set**: root

**Description**:

The Chain ID. `945` for Bittensor mainnet, a.k.a. Finney.

### Issuance

**Type**: u64

**Description**:
Refers to total issuance, the amount of TAO in circulation.

### LockReductionInterval

**Type**: u64

**Default**: 14 \* 7200

**`btcli` setter**:

**Setter extrinsic**:

**Permissions required to set**: root

**Description**:

The number of blocks that need to pass in order for the network lock cost to half.

`sudo_set_lock_reduction_interval`| root

### NetworkMinLockCost

**`btcli` setter**: none

**Setter extrinsic**: `sudo_set_network_min_lock_cost`

**Permissions required to set**: root

**Description**:

`NetworkMinLockCost` is the minimum TAO to pay for subnet registration

### TxDelegateTakeRateLimit

**Type**: u64

**Default**: 216000

**`btcli` setter**:

**Setter extrinsic**:

**Permissions required to set**: root

**Description**:

Rate limit of how frequently can a delegate take be increased

### TxRateLimit

**Type**: u64

**Default**: 1000

**`btcli` setter**: none

**Setter extrinsic**: `sudo_set_tx_rate_limit`

**Permissions required to set**: root

**Description**:

Rate limit for `swap_hotkey` extrinsic.

### SubnetEmissionEnabled

**Type**: bool (per subnet)

**Default**: `true`

**`btcli` setter**: none

**Setter extrinsic**: `adminUtils.sudoSetSubnetEmissionEnabled(netuid, enabled)`

**Permissions required to set**: Root (sudo only — not settable by subnet owners)

**Description**:

Controls whether a subnet receives pool-side emission injection each epoch. When `false`, the subnet receives no alpha-in, tao-in, or chain-buy injections. The subnet's emission share is redistributed to enabled subnets. Alpha-out, owner cut, root proportion, and validator/server emissions continue regardless of this flag.

This toggle is intended for emergency governance use — for example, temporarily halting emissions to a subnet that is exhibiting problematic behavior, without fully dissolving it.

See [`adminUtils.SubnetEmissionEnabledSet`](https://docs.learnbittensor.org/subtensor-api/events) for the on-chain event emitted when this is changed.

### SubnetOwnerCut

**`btcli` setter**: none

**Setter extrinsic**: `sudo_set_subnet_owner_cut`

**Permissions required to set**: root

**Description**:

The ratio of all subnet alpha emissions that is given to subnet owner as stake. (Global, fixed at 18%.)

### StakeThreshold

**Type**: u12

**Default**: 1000

**`btcli` setter**: none

**Setter extrinsic**: `sudo_set_stake_threshold`

**Permissions required to set**: root

**Description**:

The minimum stake required for validating. Currently 1000
