---
title: "Subnet Configuration (Hyperparameters)"
---

# Subnet Configuration (Hyperparameters)

Bittensor subnets are configured with a set of state variables (known as hyperparameters) that are recorded on the blockchain. Many of these can be accessed (viewed and set) using the Bittensor CLI `btcli`, but some of them must be checked or set using Subtensor extrinsics, as noted.

Note that the names of the variables may be slightly different in various representations, e.g. in `btcli` and in the [chain codebase](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1038).

## Manage hyperparams with `btcli`

This section covers how to use BTCLI to view, update, and verify network hyperparameters directly from the terminal.

### View the hyperparameters

Any user can view the hyperparameters of any subnet by using the `btcli subnets hyperparameters` command and including the `--netuid` flag . The command displays the subnet hyperparameter information, including their values, descriptions, and permission information.

**Example**

```bash
btcli subnet hyperparameters --netuid 14
```

```console
                                                                                           Subnet Hyperparameters
                                                                                    NETUID: 14 (TAOHash) - Network: finney


 HYPERPARAMETER                    VALUE                  NORMALIZED        OWNER SETTABLE             DESCRIPTION
 ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   activity_cutoff                 5000                   5000              Yes                        Minimum activity level required for neurons to remain active. link
   adjustment_alpha                14757395258967641292   0.8               Yes                        Alpha parameter for difficulty adjustment algorithm. link
   adjustment_interval             360                    360               No (Root Only)             Number of blocks between automatic difficulty adjustments. link
   alpha_high                      58982                  0.9000076295      Yes                        High bound of the alpha range for stake calculations. link
   alpha_low                       45875                  0.7000076295      Yes                        Low bound of the alpha range for stake calculations. link
   alpha_sigmoid_steepness         0.0                    0                 No (Root Only)             Steepness parameter for alpha sigmoid function. link
   bonds_moving_avg                1                      5.421010862e-20   Yes                        Moving average window size for bond calculations. link
   bonds_reset_enabled             False                  False             Yes                        Enable or disable periodic bond resets. link
   commit_reveal_period            1                      1                 Yes                        Duration (in blocks) for commit-reveal weight submission scheme. link
   commit_reveal_weights_enabled   True                   True              Yes                        Enable or disable commit-reveal scheme for weight submissions. link
   difficulty                      10000000               5.421010862e-13   No (Root Only)             Current proof-of-work difficulty for registration. link
   immunity_period                 5000                   5000              Yes                        Duration (in blocks) during which newly registered neurons are protected from certain penalties. link
   kappa                           32767                  0.4999923705      No (Root Only)             Kappa determines the scaling factor for consensus calculations. link
   liquid_alpha_enabled            False                  False             Yes                        Enable or disable liquid alpha staking mechanism. link
   max_burn                        100000000000           ‎100.0000 τ‎        No (Root Only)             Maximum TAO burn amount cap for subnet registration. link
   max_difficulty                  18446744073709551615   1                 Yes                        Maximum proof-of-work difficulty cap. link
   max_regs_per_block              1                      1                 No (Root Only)             Maximum number of registrations allowed per block. link
   max_validators                  64                     64                No (Root Only)             Maximum number of validators allowed in the subnet. link
   max_weight_limit                65535                  1                 Yes                        No description available.
   min_allowed_weights             1                      1                 Yes                        Minimum number of weight connections a neuron must maintain to stay active. link
   min_burn                        500000                 ‎0.0005 τ‎          Yes                        Minimum TAO burn amount required for subnet registration. link
   min_difficulty                  10000000               5.421010862e-13   No (Root Only)             Minimum proof-of-work difficulty required for registration link
   registration_allowed            True                   True              No (Root Only)             Enable or disable new registrations to the subnet. link
   rho                             10                     10                Yes                        Rho controls the rate at which weights decay over time. link
   serving_rate_limit              50                     50                Yes                        Rate limit for serving requests. link
   subnet_is_active                True                   True              Yes                        Whether the subnet is currently active and operational. link
   target_regs_per_interval        1                      1                 No (Root Only)             Target number of new registrations per adjustment interval. link
   tempo                           360                    360               No (Root Only)             Number of blocks between epoch transitions link
   transfers_enabled               True                   True              Yes                        Enable or disable TAO transfers within the subnet. link
   user_liquidity_enabled          False                  False             COMPLICATED (Owner/Sudo)   Enable or disable user liquidity features. link
   weights_rate_limit              100                    100               No (Root Only)             Maximum number of weight updates allowed per epoch. link
   weights_version                 28                     28                Yes                        Version key for weight sets. link
   yuma_version                    2                      2                 Yes                        Version of the Yuma consensus mechanism. link
 ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────



💡 Tip: Use btcli sudo set --param <name> --value <value> to modify hyperparameters.
💡 Tip: Subnet owners can set parameters marked 'Yes'. Parameters marked 'No (Root Only)' require root sudo access.
💡 Tip: To set custom hyperparameters not in this list, use the exact parameter name from the chain metadata.
   Example: btcli sudo set --netuid 14 --param custom_param_name --value 123
   The parameter name must match exactly as defined in the chain's AdminUtils pallet metadata.
📚 For detailed documentation, visit: https://docs.bittensor.com
```

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

#       HYPERPARAMETER                  OWNER SETTABLE       DESCRIPTION
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
1       activity_cutoff                 Yes                  Minimum activity level required for neurons to remain active.
2       adjustment_alpha                Yes                  Alpha parameter for difficulty adjustment algorithm.
3       adjustment_interval             No (Root Only)       Number of blocks between automatic difficulty adjustments.
4       alpha_high                      Yes                  High bound of the alpha range for stake calculations.
5       alpha_low                       Yes                  Low bound of the alpha range for stake calculations.
6       alpha_sigmoid_steepness         No (Root Only)       Steepness parameter for alpha sigmoid function.
7       bonds_moving_avg                Yes                  Moving average window size for bond calculations.
8       bonds_reset_enabled             Yes                  Enable or disable periodic bond resets.
9       commit_reveal_period            Yes                  Duration (in blocks) for commit-reveal weight submission scheme.
10      commit_reveal_weights_enabled   Yes                  Enable or disable commit-reveal scheme for weight submissions.
11      difficulty                      No (Root Only)       Current proof-of-work difficulty for registration.
12      immunity_period                 Yes                  Duration (in blocks) during which newly registered neurons are protected from certain penalties.
13      kappa                           No (Root Only)       Kappa determines the scaling factor for consensus calculations.
14      liquid_alpha_enabled            Yes                  Enable or disable liquid alpha staking mechanism.
15      max_burn                        No (Root Only)       Maximum TAO burn amount cap for subnet registration.
16      max_difficulty                  Yes                  Maximum proof-of-work difficulty cap.
17      max_regs_per_block              No (Root Only)       Maximum number of registrations allowed per block.
18      max_validators                  No (Root Only)       Maximum number of validators allowed in the subnet.
19      max_weight_limit                Yes                  No description available.
20      min_allowed_weights             Yes                  Minimum number of weight connections a neuron must maintain to stay active.
21      min_burn                        Yes                  Minimum TAO burn amount required for subnet registration.
22      min_difficulty                  No (Root Only)       Minimum proof-of-work difficulty required for registration
23      registration_allowed            No (Root Only)       Enable or disable new registrations to the subnet.
24      rho                             Yes                  Rho controls the rate at which weights decay over time.
25      serving_rate_limit              Yes                  Rate limit for serving requests.
26      subnet_is_active                Yes                  Whether the subnet is currently active and operational.
27      target_regs_per_interval        No (Root Only)       Target number of new registrations per adjustment interval.
28      tempo                           No (Root Only)       Number of blocks between epoch transitions
29      transfers_enabled               Yes                  Enable or disable TAO transfers within the subnet.
30      user_liquidity_enabled          COMPLICATED          Enable or disable user liquidity features.
31      weights_rate_limit              No (Root Only)       Maximum number of weight updates allowed per epoch.
32      weights_version                 Yes                  Version key for weight sets.
33      yuma_version                    Yes                  Version of the Yuma consensus mechanism.

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

:::info Set custom hyperparameters

You can also modify values for hyperparameters that are not included in the table. To do this, you must provide the hyperparameter's setter extrinsic and value when running the `btcli sudo set` command.

For example, the following command sets the number of owner-immune neurons to `four`.

```sh
 btcli sudo set --param sudo_set_owner_immune_neuron_limit --value .00007
```

:::

## Subnet Hyperparameters

This section details all subnet hyperparameters, including their default values, descriptions, and the setter extrinsics required to modify them.

### ActivityCutoff

**Type**: u16

**Default**: 5000

**`btcli` setter**: `btcli sudo set --param activity_cutoff`

**Setter extrinsic**: `sudo_set_activity_cutoff`

**Permissions required to set**: Subnet owner

**Description**:

The number of blocks for the stake to become inactive for the purpose of epoch in Yuma Consensus. If a validator doesn't submit weights within the first `ActivityCutoff` blocks of the epoch, it will not be able to participate until the start of the next epoch.

### AdjustmentAlpha

**Type**: u64

**Default**: 0

**`btcli` setter**: `btcli sudo set --param adjustment_alpha`

**Setter extrinsic**: `sudo_set_adjustment_alpha`

**Permissions required to set**: Subnet owner

**Description**:
`AdjustmentAlpha` is the rate at which difficulty and burn are adjusted up or down.

### AdjustmentInterval

**Type**: u16

**Default**: 360

**`btcli` setter**: `btcli sudo set --param adjustment_interval`

**Setter extrinsic**: `sudo_set_adjustment_interval`

**Permissions required to set**: Root

**Description**:

`AdjustmentInterval` is number of blocks that pass between difficulty and burn adjustments.

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

### CommitRevealPeriod

**Type**: u64

**Default**: 1

**`btcli` setter**: `btcli sudo set --param commit_reveal_period`

**Setter extrinsic**: `sudo_set_commit_reveal_weights_interval`

**Permissions required to set**: Subnet owner

**Description**:

The number of **tempos** (epochs) that must elapse before validator weights are revealed from time-lock encryption. Prevents weight-copying.

**Important**: This is measured in **tempos** (not blocks, as you might expect). A tempo equals the subnet's `tempo` hyperparameter (typically 360 blocks). For example, if you set `commit_reveal_period` to 3 and your `tempo` is 360, weights will be revealed after 3 tempos = 1080 blocks.

See [Commit Reveal](../concepts/commit-reveal) for details on how commit reveal works.

### CommitRevealWeightsEnabled

**Type**: Boolean

**Default**: False

**`btcli` setter**: `btcli sudo set --param commit_reveal_weights_enabled`

**Setter extrinsic**: `sudo_set_commit_reveal_weights_enabled`

**Permissions required to set**: Subnet owner

**Description**:

Enables [Commit Reveal](../concepts/commit-reveal)

### Difficulty

**Type**: u64

**Default**: 10000000

**`btcli` setter**: `btcli sudo set --param difficulty`

**Setter extrinsic**: `sudo_set_difficulty`

**Permissions required to set**: Root

**Description**:

Current dynamically computed value for the proof-of-work (POW) requirement for POW hotkey registration. Decreases over time but increases after new registrations, between the min and the maximum set by the Subnet owner. see [MaxDifficulty](#maxdifficulty).

<!-- What are the units here? What does this actually mean, how are miners supposed to read/understand this? -->

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

The maximum of the dynamic range for TAO cost of burn registration on the subnet.

### MaxDifficulty

**Type**: u64

**Default**: 18446744073709551615 normalized to 1

**`btcli` setter**: `btcli sudo set --param max_difficulty`

**Setter extrinsic**: `sudo_set_max_difficulty`

**Permissions required to set**: Subnet owner

**Description**:

The maximum of the dynamic range for difficulty of proof-of-work registration on the subnet.

### MaxRegistrationsPerBlock

**Type**: u16

**Default**: 1

**`btcli` setter**: `btcli sudo set --param max_regs_per_block`

**Setter extrinsic**: `sudo_set_max_registrations_per_block`

**Permissions required to set**: Root

**Description**:

Maximum neuron registrations per block. Note: Actual limit may be lower, as there is also per interval limit [`TargetRegistrationsPerInterval`](#targetregistrationsperinterval).

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

The minimum of the range of the dynamic burn cost for registering on the subnet.

### MinDifficulty

**Type**: u64

**Default**: 10000000 normalized to 5.421010862e-13

**`btcli` setter**: `btcli sudo set --param min_difficulty`

**Setter extrinsic**: `sudo_set_min_difficulty`

**Permissions required to set**: Subnet owner

**Description**:

The minimum of the range of the proof-of-work for registering on the subnet.

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

`NetworkPowRegistrationAllowed` is a flag that toggles PoW registrations on a subnet

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

`NetworkRegistrationAllowed` determines if burned registrations are allowed. If both burned and pow registrations are disabled, the subnet will not get emissions.

### OwnerHyperparamRateLimit

**Type**: u16

**Default**: 2 (tempos)

**`btcli` setter**: none

**Setter extrinsic**: `sudo_set_owner_hparam_rate_limit`

**Permissions required to set**: Root

**Description**:

Global multiplier that rate-limits how frequently a subnet owner can update subnet hyperparameters. The cooldown window equals `Tempo(netuid) × OwnerHyperparamRateLimit` blocks. The rate limit is tracked independently per hyperparameter; changing `kappa` does not block an immediate change to `rho`, for example.

### RecycleOrBurn

**Type**: `RecycleOrBurnEnum`

**Default**: Burn

**`btcli` setter**: n/a

**Setter extrinsic**: `sudo_set_recycle_or_burn`

**Permissions required to set**: Subnet owner

**Description**: The `RecycleOrBurnEnum` hyperparameter sets the behaviour of the burn UIDs for a given subnet. If set to `Burn`, the miner emission sent to the burn UID(s) will be burned. If set to `Recycle`, the miner emission sent to the burn UID(s) will be recycled.

### Rho

**Type**: u16

**Default**: 10

**`btcli` setter**: `btcli sudo set --param rho`

**Setter extrinsic**: `sudo_set_rho`

**Permissions required to set**: Subnet owner

**Description**:

Deprecated.

<!-- will this be chopped from btcli? -->

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

Target number of neuron registrations allowed per interval. Interval is `AdjustmentInterval`.

:::info
The hyperparameter triggers a rate limit when the registration attempts in the current interval exceed three times the `TargetRegistrationsPerInterval` value.
:::

### Tempo

**Type**: u16

**Default**: 360

**`btcli` setter**: `btcli sudo set --param tempo`

**Setter extrinsic**: `sudo_set_tempo`

**Permissions required to set**: Root

**Description**:

Length of subnet tempo in blocks.
See [Emission](../learn/emissions.md)

### ToggleTransfer

**Type**: Boolean

**Default**: True

**`btcli` setter**: btcli sudo set --param transfers_enabled`

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

### ColdkeySwapScheduleDuration

**Type**: u12

**Default**:

**`btcli` setter**: no

**Setter extrinsic**: `sudo_set_coldkey_swap_schedule_duration`

**Permissions required to set**: Root

**Description**:

The duration in blocks of the waiting period before a coldkey swap.

See [Rotate/Swap your Coldkey](../keys/schedule-coldkey-swap)

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
