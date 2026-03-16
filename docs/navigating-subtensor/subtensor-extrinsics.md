---
title: "Subtensor Pallets and Extrinsics"
---

# Subtensor Pallets and Extrinsics

This document covers the dispatchable calls of all pallets included in the Subtensor runtime. For each pallet, it lists the call methods and their arguments.

## Overview

The Subtensor blockchain is built on the Substrate blockchain framework. The framework's development environment includes modules called pallets that define the core logic of the runtime and can be used, modified, or extended to implement the functionality required by the chain.

Each pallet exposes functions that users or other parts of the system can call. These calls execute successfully as long as the caller has the required permissions. Because these calls originate outside the blockchain runtime, they are called _extrinsics_.

For example, the Subtensor pallet contains functions related to Bittensor network operations, such as neuron registration, staking, or subnet management. When a user calls one of these functions—using BTCLI or another client interface—they submit an extrinsic to the chain. Some extrinsics may also trigger events on-chain, such as confirming a successful registration or updating staking balances.

## Subtensor pallets

The Subtensor runtime is composed of multiple pallets that collectively define the behavior of the Bittensor blockchain. Each pallet manages a specific domain of the protocol.

Below are some of the key pallets included in the Subtensor runtime.

### `AdminUtils`

Root and subnet-owner configuration: subnet hyperparameters, issuance, EVM, authorities. Most calls require root or subnet owner.

| Method                                        | Arguments                                     |
| --------------------------------------------- | --------------------------------------------- |
| `swap_authorities`                            | `new_authorities`                             |
| `sudo_set_default_take`                       | `default_take`                                |
| `sudo_set_tx_rate_limit`                      | `tx_rate_limit`                               |
| `sudo_set_serving_rate_limit`                 | `netuid`, `serving_rate_limit`                |
| `sudo_set_min_difficulty`                     | `netuid`, `min_difficulty`                    |
| `sudo_set_max_difficulty`                     | `netuid`, `max_difficulty`                    |
| `sudo_set_weights_version_key`                | `netuid`, `weights_version_key`               |
| `sudo_set_weights_set_rate_limit`             | `netuid`, `weights_set_rate_limit`            |
| `sudo_set_adjustment_interval`                | `netuid`, `adjustment_interval`               |
| `sudo_set_adjustment_alpha`                   | `netuid`, `adjustment_alpha`                  |
| `sudo_set_immunity_period`                    | `netuid`, `immunity_period`                   |
| `sudo_set_min_allowed_weights`                | `netuid`, `min_allowed_weights`               |
| `sudo_set_max_allowed_uids`                   | `netuid`, `max_allowed_uids`                  |
| `sudo_set_kappa`                              | `netuid`, `kappa`                             |
| `sudo_set_rho`                                | `netuid`, `rho`                               |
| `sudo_set_activity_cutoff`                    | `netuid`, `activity_cutoff`                   |
| `sudo_set_network_registration_allowed`       | `netuid`, `registration_allowed`              |
| `sudo_set_network_pow_registration_allowed`   | `netuid`, `registration_allowed`              |
| `sudo_set_target_registrations_per_interval`  | `netuid`, `target_registrations_per_interval` |
| `sudo_set_min_burn`                           | `netuid`, `min_burn`                          |
| `sudo_set_max_burn`                           | `netuid`, `max_burn`                          |
| `sudo_set_difficulty`                         | `netuid`, `difficulty`                        |
| `sudo_set_max_allowed_validators`             | `netuid`, `max_allowed_validators`            |
| `sudo_set_bonds_moving_average`               | `netuid`, `bonds_moving_average`              |
| `sudo_set_bonds_penalty`                      | `netuid`, `bonds_penalty`                     |
| `sudo_set_max_registrations_per_block`        | `netuid`, `max_registrations_per_block`       |
| `sudo_set_subnet_owner_cut`                   | `subnet_owner_cut`                            |
| `sudo_set_network_rate_limit`                 | `rate_limit`                                  |
| `sudo_set_tempo`                              | `netuid`, `tempo`                             |
| `sudo_set_total_issuance`                     | `total_issuance`                              |
| `sudo_set_network_immunity_period`            | `immunity_period`                             |
| `sudo_set_network_min_lock_cost`              | `lock_cost`                                   |
| `sudo_set_subnet_limit`                       | `max_subnets`                                 |
| `sudo_set_lock_reduction_interval`            | `interval`                                    |
| `sudo_set_rao_recycled`                       | `netuid`, `rao_recycled`                      |
| `sudo_set_stake_threshold`                    | `min_stake`                                   |
| `sudo_set_nominator_min_required_stake`       | `min_stake`                                   |
| `sudo_set_tx_delegate_take_rate_limit`        | `tx_rate_limit`                               |
| `sudo_set_min_delegate_take`                  | `take`                                        |
| `sudo_set_commit_reveal_weights_enabled`      | `netuid`, `enabled`                           |
| `sudo_set_liquid_alpha_enabled`               | `netuid`, `enabled`                           |
| `sudo_set_alpha_values`                       | `netuid`, `alpha_low`, `alpha_high`           |
| `sudo_set_dissolve_network_schedule_duration` | `duration`                                    |
| `sudo_set_commit_reveal_weights_interval`     | `netuid`, `interval`                          |
| `sudo_set_evm_chain_id`                       | `chain_id`                                    |
| `schedule_grandpa_change`                     | `next_authorities`, `in_blocks`, `forced`     |
| `sudo_set_toggle_transfer`                    | `netuid`, `toggle`                            |
| `sudo_set_recycle_or_burn`                    | `netuid`, `recycle_or_burn`                   |
| `sudo_toggle_evm_precompile`                  | `precompile_id`, `enabled`                    |
| `sudo_set_subnet_moving_alpha`                | `alpha`                                       |
| `sudo_set_subnet_owner_hotkey`                | `netuid`, `hotkey`                            |
| `sudo_set_ema_price_halving_period`           | `netuid`, `ema_halving`                       |
| `sudo_set_alpha_sigmoid_steepness`            | `netuid`, `steepness`                         |
| `sudo_set_yuma3_enabled`                      | `netuid`, `enabled`                           |
| `sudo_set_bonds_reset_enabled`                | `netuid`, `enabled`                           |
| `sudo_set_sn_owner_hotkey`                    | `netuid`, `hotkey`                            |
| `sudo_set_subtoken_enabled`                   | `netuid`, `subtoken_enabled`                  |
| `sudo_set_commit_reveal_version`              | `version`                                     |
| `sudo_set_owner_immune_neuron_limit`          | `netuid`, `immune_neurons`                    |
| `sudo_set_ck_burn`                            | `burn`                                        |
| `sudo_set_admin_freeze_window`                | `window`                                      |
| `sudo_set_owner_hparam_rate_limit`            | `epochs`                                      |
| `sudo_set_mechanism_count`                    | `netuid`, `mechanism_count`                   |
| `sudo_set_mechanism_emission_split`           | `netuid`, `maybe_split`                       |
| `sudo_trim_to_max_allowed_uids`               | `netuid`, `max_n`                             |
| `sudo_set_min_allowed_uids`                   | `netuid`, `min_allowed_uids`                  |
| `sudo_set_tao_flow_cutoff`                    | `flow_cutoff`                                 |
| `sudo_set_tao_flow_normalization_exponent`    | `exponent`                                    |
| `sudo_set_tao_flow_smoothing_factor`          | `smoothing_factor`                            |
| `sudo_set_min_non_immune_uids`                | `netuid`, `min`                               |
| `sudo_set_start_call_delay`                   | `delay`                                       |
| `sudo_set_coldkey_swap_announcement_delay`    | `duration`                                    |
| `sudo_set_coldkey_swap_reannouncement_delay`  | `duration`                                    |
| `sudo_set_max_mechanism_count`                | `max_mechanism_count`                         |

### `Balances`

Native token transfers and balance operations.

| Method                        | Arguments                 |
| ----------------------------- | ------------------------- |
| `transfer_allow_death`        | `dest`, `value`           |
| `force_transfer`              | `source`, `dest`, `value` |
| `transfer_keep_alive`         | `dest`, `value`           |
| `transfer_all`                | `dest`, `keep_alive`      |
| `force_unreserve`             | `who`, `amount`           |
| `upgrade_accounts`            | `who`                     |
| `force_set_balance`           | `who`, `new_free`         |
| `force_adjust_total_issuance` | `direction`, `delta`      |
| `burn`                        | `value`, `keep_alive`     |

### `BaseFee`

Base fee configuration for EVM-style transactions.

| Method                 | Arguments    |
| ---------------------- | ------------ |
| `set_base_fee_per_gas` | `new`        |
| `set_elasticity`       | `elasticity` |

### `Commitments`

Commitment/reveal data for subtensor (e.g. registration).

| Method           | Arguments        |
| ---------------- | ---------------- |
| `set_commitment` | `netuid`, `info` |
| `set_max_space`  | `new_limit`      |

### `Contracts`

WASM smart contracts.

| Method                  | Arguments                                                                  |
| ----------------------- | -------------------------------------------------------------------------- |
| `instantiate_with_code` | `value`, `gas_limit`, `storage_deposit_limit`, `code`, `data`, `salt`      |
| `instantiate`           | `value`, `gas_limit`, `storage_deposit_limit`, `code_hash`, `data`, `salt` |
| `call`                  | `dest`, `value`, `gas_limit`, `storage_deposit_limit`, `data`              |
| `upload_code`           | `code`, `storage_deposit_limit`, `determinism`                             |
| `remove_code`           | `code_hash`                                                                |
| `set_code`              | `dest`, `code_hash`                                                        |

### `Crowdloan`

Crowdloans and subnet leasing.

| Method                    | Arguments                                           |
| ------------------------- | --------------------------------------------------- |
| `create`                  | `deposit`, `min_contribution`, `cap`, `end`, `call` |
| `contribute`              | `crowdloan_id`, `amount`                            |
| `withdraw`                | `crowdloan_id`                                      |
| `finalize`                | `crowdloan_id`                                      |
| `refund`                  | `crowdloan_id`                                      |
| `dissolve`                | `crowdloan_id`                                      |
| `update_min_contribution` | `crowdloan_id`, `new_min_contribution`              |
| `update_end`              | `crowdloan_id`, `new_end`                           |
| `update_cap`              | `crowdloan_id`, `new_cap`                           |

### `Drand`

Drand randomness beacon.

| Method                    | Arguments                      |
| ------------------------- | ------------------------------ |
| `write_pulse`             | `pulses_payload`, `_signature` |
| `set_beacon_config`       | `config_payload`, `_signature` |
| `set_oldest_stored_round` | `oldest_round`                 |

### `Ethereum`

Ethereum transaction compatibility (Frontier).

| Method     | Arguments     |
| ---------- | ------------- |
| `transact` | `transaction` |

### `EVM`

EVM execution and bridge to Substrate accounts.

| Method     | Arguments                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| `call`     | `source`, `target`, `input`, `value`, `gas_limit`, `max_fee_per_gas`, `max_priority_fee_per_gas`, `nonce` |
| `create`   | `source`, `init`, `value`, `gas_limit`, `max_fee_per_gas`, `max_priority_fee_per_gas`, `nonce`            |
| `withdraw` | `address`, `value`                                                                                        |

### `Grandpa`

Finality gadget; authority changes are triggered via `AdminUtils::schedule_grandpa_change`.

| Method                         | Arguments                               |
| ------------------------------ | --------------------------------------- |
| `note_stalled`                 | `delay`, `best_finalized_block_number`  |
| `report_equivocation`          | `equivocation_proof`, `key_owner_proof` |
| `report_equivocation_unsigned` | `equivocation_proof`, `key_owner_proof` |

### `MevShield`

MEV protection / encrypted transactions.

| Method              | Arguments    |
| ------------------- | ------------ |
| `announce_next_key` | `enc_key`    |
| `submit_encrypted`  | `ciphertext` |

### `Multisig`

Multi-signature approvals around arbitrary calls.

| Method                 | Arguments                                                                      |
| ---------------------- | ------------------------------------------------------------------------------ |
| `as_multi`             | `threshold`, `other_signatories`, `maybe_timepoint`, `call`, `max_weight`      |
| `as_multi_threshold_1` | `other_signatories`, `call`                                                    |
| `approve_as_multi`     | `threshold`, `other_signatories`, `maybe_timepoint`, `call_hash`, `max_weight` |
| `cancel_as_multi`      | `threshold`, `other_signatories`, `timepoint`, `call_hash`                     |
| `poke_deposit`         | `threshold`, `other_signatories`, `call_hash`                                  |

### `Preimage`

Preimage management for governance / other pallets.

| Method               | Arguments |
| -------------------- | --------- |
| `note_preimage`      | `bytes`   |
| `unnote_preimage`    | `hash`    |
| `request_preimage`   | `hash`    |
| `unrequest_preimage` | `hash`    |
| `ensure_updated`     | `hashes`  |

### `Proxy`

Proxy and delegate management.

| Method                | Arguments                                               |
| --------------------- | ------------------------------------------------------- |
| `proxy`               | `real`, `force_proxy_type`, `call`                      |
| `add_proxy`           | `delegate`, `proxy_type`, `delay`                       |
| `remove_proxy`        | `delegate`, `proxy_type`, `delay`                       |
| `remove_proxies`      | —                                                       |
| `create_pure`         | `proxy_type`, `delay`, `index`                          |
| `kill_pure`           | `spawner`, `proxy_type`, `index`, `height`, `ext_index` |
| `announce`            | `real`, `call_hash`                                     |
| `remove_announcement` | `real`, `call_hash`                                     |
| `reject_announcement` | `delegate`, `call_hash`                                 |
| `proxy_announced`     | `delegate`, `real`, `force_proxy_type`, `call`          |
| `poke_deposit`        | —                                                       |
| `set_real_pays_fee`   | `delegate`, `pays_fee`                                  |

### `Registry`

On-chain identity (Registry identity, not Subtensor neuron identity).

| Method           | Arguments            |
| ---------------- | -------------------- |
| `set_identity`   | `identified`, `info` |
| `clear_identity` | `identified`         |

### `SafeMode`

Chain safety controls (emergency switch-style behavior).

| Method        | Arguments |
| ------------- | --------- |
| `enter`       | —         |
| `extend`      | —         |
| `force_enter` | —         |
| `force_exit`  | —         |

### `Scheduler`

Schedule calls for future execution.

| Method           | Arguments                                          |
| ---------------- | -------------------------------------------------- |
| `schedule`       | `when`, `maybe_periodic`, `priority`, `call`       |
| `cancel`         | `when`, `index`                                    |
| `schedule_named` | `id`, `when`, `maybe_periodic`, `priority`, `call` |
| `cancel_named`   | `id`                                               |

### `SubtensorModule`

Core Bittensor logic: subnets, registration, staking, weights, serving, Alpha/TAO operations.

| Method                                 | Arguments                                                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `set_weights`                          | `netuid`, `dests`, `weights`, `version_key`                                                                                |
| `set_mechanism_weights`                | `netuid`, `mecid`, `dests`, `weights`, `version_key`                                                                       |
| `batch_set_weights`                    | `netuids`, `weights`, `version_keys`                                                                                       |
| `commit_weights`                       | `netuid`, `commit_hash`                                                                                                    |
| `commit_mechanism_weights`             | `netuid`, `mecid`, `commit_hash`                                                                                           |
| `batch_commit_weights`                 | `netuids`, `commit_hashes`                                                                                                 |
| `reveal_weights`                       | `netuid`, `uids`, `values`, `salt`, `version_key`                                                                          |
| `reveal_mechanism_weights`             | `netuid`, `mecid`, `uids`, `values`, `salt`, `version_key`                                                                 |
| `commit_crv3_mechanism_weights`        | `netuid`, `mecid`, `commit`, `reveal_round`                                                                                |
| `batch_reveal_weights`                 | `netuid`, `uids_list`, `values_list`, `salts_list`, `version_keys`                                                         |
| `commit_timelocked_weights`            | `netuid`, `commit`, `reveal_round`, `commit_reveal_version`                                                                |
| `commit_timelocked_mechanism_weights`  | `netuid`, `mecid`, `commit`, `reveal_round`, `commit_reveal_version`                                                       |
| `add_stake`                            | `hotkey`, `netuid`, `amount_staked`                                                                                        |
| `add_stake_limit`                      | `hotkey`, `netuid`, `amount_staked`, `limit_price`, `allow_partial`                                                        |
| `remove_stake`                         | `hotkey`, `netuid`, `amount_unstaked`                                                                                      |
| `remove_stake_limit`                   | `hotkey`, `netuid`, `amount_unstaked`, `limit_price`, `allow_partial`                                                      |
| `remove_stake_full_limit`              | `hotkey`, `netuid`, `limit_price`                                                                                          |
| `move_stake`                           | `origin_hotkey`, `destination_hotkey`, `origin_netuid`, `destination_netuid`, `alpha_amount`                               |
| `transfer_stake`                       | `destination_coldkey`, `hotkey`, `origin_netuid`, `destination_netuid`, `alpha_amount`                                     |
| `swap_stake`                           | `hotkey`, `origin_netuid`, `destination_netuid`, `alpha_amount`                                                            |
| `swap_stake_limit`                     | `hotkey`, `origin_netuid`, `destination_netuid`, `alpha_amount`, `limit_price`                                             |
| `unstake_all`                          | `hotkey`                                                                                                                   |
| `unstake_all_alpha`                    | `hotkey`                                                                                                                   |
| `add_stake_burn`                       | `hotkey`, `netuid`, `amount`, `limit`                                                                                      |
| `decrease_take`                        | `hotkey`, `take`                                                                                                           |
| `increase_take`                        | `hotkey`, `take`                                                                                                           |
| `serve_axon`                           | `netuid`, `version`, `ip`, `port`, `ip_type`, `protocol`, `placeholder1`, `placeholder2`                                   |
| `serve_axon_tls`                       | `netuid`, `version`, `ip`, `port`, `ip_type`, `protocol`, `placeholder1`, `placeholder2`, `certificate`                    |
| `serve_prometheus`                     | `netuid`, `version`, `ip`, `port`, `ip_type`                                                                               |
| `register`                             | `netuid`, `block_number`, `nonce`, `work`, `hotkey`                                                                        |
| `root_register`                        | `hotkey`                                                                                                                   |
| `burned_register`                      | `netuid`, `hotkey`                                                                                                         |
| `register_network`                     | `hotkey`                                                                                                                   |
| `register_network_with_identity`       | `hotkey`, `identity`                                                                                                       |
| `dissolve_network`                     | `_coldkey`, `netuid`                                                                                                       |
| `root_dissolve_network`                | `netuid`                                                                                                                   |
| `faucet`                               | `block_number`, `nonce`, `work`                                                                                            |
| `start_call`                           | `netuid`                                                                                                                   |
| `update_symbol`                        | `netuid`, `symbol`                                                                                                         |
| `swap_hotkey`                          | `hotkey`, `new_hotkey`, `netuid`                                                                                           |
| `swap_coldkey`                         | `old_coldkey`, `new_coldkey`, `swap_cost`                                                                                  |
| `announce_coldkey_swap`                | `new_coldkey_hash`                                                                                                         |
| `swap_coldkey_announced`               | `new_coldkey`                                                                                                              |
| `dispute_coldkey_swap`                 | —                                                                                                                          |
| `reset_coldkey_swap`                   | `coldkey`                                                                                                                  |
| `set_identity`                         | `name`, `url`, `github_repo`, `image`, `discord`, `description`, `additional`                                              |
| `set_subnet_identity`                  | `netuid`, `subnet_name`, `github_repo`, `subnet_contact`, `subnet_url`, `discord`, `description`, `logo_url`, `additional` |
| `set_children`                         | `hotkey`, `netuid`, `children`                                                                                             |
| `set_childkey_take`                    | `hotkey`, `netuid`, `take`                                                                                                 |
| `try_associate_hotkey`                 | `hotkey`                                                                                                                   |
| `associate_evm_key`                    | `netuid`, `evm_key`, `block_number`, `signature`                                                                           |
| `schedule_swap_coldkey`                | `_new_coldkey` — **Deprecated**                                                                                            |
| `set_pending_childkey_cooldown`        | `cooldown`                                                                                                                 |
| `sudo_set_tx_childkey_take_rate_limit` | `tx_rate_limit`                                                                                                            |
| `sudo_set_min_childkey_take`           | `take`                                                                                                                     |
| `sudo_set_max_childkey_take`           | `take`                                                                                                                     |
| `recycle_alpha`                        | `hotkey`, `amount`, `netuid`                                                                                               |
| `burn_alpha`                           | `hotkey`, `amount`, `netuid`                                                                                               |
| `register_leased_network`              | `emissions_share`, `end_block`                                                                                             |
| `terminate_lease`                      | `lease_id`, `hotkey`                                                                                                       |
| `claim_root`                           | `subnets`                                                                                                                  |
| `set_root_claim_type`                  | `new_root_claim_type`                                                                                                      |
| `set_coldkey_auto_stake_hotkey`        | `netuid`, `hotkey`                                                                                                         |
| `sudo_set_num_root_claims`             | `new_value`                                                                                                                |
| `sudo_set_root_claim_threshold`        | `netuid`, `new_value`                                                                                                      |
| `sudo_set_voting_power_ema_alpha`      | `netuid`, `alpha`                                                                                                          |
| `enable_voting_power_tracking`         | `netuid`                                                                                                                   |
| `disable_voting_power_tracking`        | `netuid`                                                                                                                   |

### `Sudo`

Root-only superuser dispatch.

| Method                  | Arguments        |
| ----------------------- | ---------------- |
| `sudo`                  | `call`           |
| `sudo_unchecked_weight` | `call`, `weight` |
| `set_key`               | `new`            |
| `sudo_as`               | `who`, `call`    |
| `remove_key`            | —                |

### `Swap`

TAO/Alpha AMM and liquidity.

| Method                  | Arguments                                                     |
| ----------------------- | ------------------------------------------------------------- |
| `set_fee_rate`          | `netuid`, `rate`                                              |
| `toggle_user_liquidity` | `netuid`, `enable`                                            |
| `add_liquidity`         | `_hotkey`, `_netuid`, `_tick_low`, `_tick_high`, `_liquidity` |
| `remove_liquidity`      | `hotkey`, `netuid`, `position_id`                             |
| `modify_position`       | `hotkey`, `netuid`, `position_id`, `liquidity_delta`          |
| `disable_lp`            | —                                                             |

### `System`

Core system pallet for accounts, blocks, and execution.

| Method                             | Arguments           |
| ---------------------------------- | ------------------- |
| `remark`                           | `remark`            |
| `set_heap_pages`                   | `pages`             |
| `set_code`                         | `code`              |
| `set_code_without_checks`          | `code`              |
| `set_storage`                      | `items`             |
| `kill_storage`                     | `keys`              |
| `kill_prefix`                      | `prefix`, `subkeys` |
| `remark_with_event`                | `remark`            |
| `authorize_upgrade`                | `code_hash`         |
| `authorize_upgrade_without_checks` | `code_hash`         |
| `apply_authorized_upgrade`         | `code`              |

### `Timestamp`

Block timestamp management.

| Method | Arguments |
| ------ | --------- |
| `set`  | `now`     |

### `Utility`

Batch and dispatch helpers.

| Method                 | Arguments           |
| ---------------------- | ------------------- |
| `batch`                | `calls`             |
| `as_derivative`        | `index`, `call`     |
| `batch_all`            | `calls`             |
| `dispatch_as`          | `as_origin`, `call` |
| `force_batch`          | `calls`             |
| `with_weight`          | `call`, `weight`    |
| `if_else`              | `main`, `fallback`  |
| `dispatch_as_fallible` | `as_origin`, `call` |
