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

| Method                                        | Arguments                                               |
| --------------------------------------------- | ------------------------------------------------------- |
| `swap_authorities`                            | `origin`, `new_authorities`                             |
| `sudo_set_default_take`                       | `origin`, `default_take`                                |
| `sudo_set_tx_rate_limit`                      | `origin`, `tx_rate_limit`                               |
| `sudo_set_serving_rate_limit`                 | `origin`, `netuid`, `serving_rate_limit`                |
| `sudo_set_min_difficulty`                     | `origin`, `netuid`, `min_difficulty`                    |
| `sudo_set_max_difficulty`                     | `origin`, `netuid`, `max_difficulty`                    |
| `sudo_set_weights_version_key`                | `origin`, `netuid`, `weights_version_key`               |
| `sudo_set_weights_set_rate_limit`             | `origin`, `netuid`, `weights_set_rate_limit`            |
| `sudo_set_adjustment_interval`                | `origin`, `netuid`, `adjustment_interval`               |
| `sudo_set_adjustment_alpha`                   | `origin`, `netuid`, `adjustment_alpha`                  |
| `sudo_set_immunity_period`                    | `origin`, `netuid`, `immunity_period`                   |
| `sudo_set_min_allowed_weights`                | `origin`, `netuid`, `min_allowed_weights`               |
| `sudo_set_max_allowed_uids`                   | `origin`, `netuid`, `max_allowed_uids`                  |
| `sudo_set_kappa`                              | `origin`, `netuid`, `kappa`                             |
| `sudo_set_rho`                                | `origin`, `netuid`, `rho`                               |
| `sudo_set_activity_cutoff`                    | `origin`, `netuid`, `activity_cutoff`                   |
| `sudo_set_network_registration_allowed`       | `origin`, `netuid`, `registration_allowed`              |
| `sudo_set_network_pow_registration_allowed`   | `origin`, `netuid`, `registration_allowed`              |
| `sudo_set_target_registrations_per_interval`  | `origin`, `netuid`, `target_registrations_per_interval` |
| `sudo_set_min_burn`                           | `origin`, `netuid`, `min_burn`                          |
| `sudo_set_max_burn`                           | `origin`, `netuid`, `max_burn`                          |
| `sudo_set_difficulty`                         | `origin`, `netuid`, `difficulty`                        |
| `sudo_set_max_allowed_validators`             | `origin`, `netuid`, `max_allowed_validators`            |
| `sudo_set_bonds_moving_average`               | `origin`, `netuid`, `bonds_moving_average`              |
| `sudo_set_bonds_penalty`                      | `origin`, `netuid`, `bonds_penalty`                     |
| `sudo_set_max_registrations_per_block`        | `origin`, `netuid`, `max_registrations_per_block`       |
| `sudo_set_subnet_owner_cut`                   | `origin`, `subnet_owner_cut`                            |
| `sudo_set_network_rate_limit`                 | `origin`, `rate_limit`                                  |
| `sudo_set_tempo`                              | `origin`, `netuid`, `tempo`                             |
| `sudo_set_total_issuance`                     | `origin`, `total_issuance`                              |
| `sudo_set_network_immunity_period`            | `origin`, `immunity_period`                             |
| `sudo_set_network_min_lock_cost`              | `origin`, `lock_cost`                                   |
| `sudo_set_subnet_limit`                       | `origin`, `max_subnets`                                 |
| `sudo_set_lock_reduction_interval`            | `origin`, `interval`                                    |
| `sudo_set_rao_recycled`                       | `origin`, `netuid`, `rao_recycled`                      |
| `sudo_set_stake_threshold`                    | `origin`, `min_stake`                                   |
| `sudo_set_nominator_min_required_stake`       | `origin`, `min_stake`                                   |
| `sudo_set_tx_delegate_take_rate_limit`        | `origin`, `tx_rate_limit`                               |
| `sudo_set_min_delegate_take`                  | `origin`, `take`                                        |
| `sudo_set_commit_reveal_weights_enabled`      | `origin`, `netuid`, `enabled`                           |
| `sudo_set_liquid_alpha_enabled`               | `origin`, `netuid`, `enabled`                           |
| `sudo_set_alpha_values`                       | `origin`, `netuid`, `alpha_low`, `alpha_high`           |
| `sudo_set_dissolve_network_schedule_duration` | `origin`, `duration`                                    |
| `sudo_set_commit_reveal_weights_interval`     | `origin`, `netuid`, `interval`                          |
| `sudo_set_evm_chain_id`                       | `origin`, `chain_id`                                    |
| `schedule_grandpa_change`                     | `origin`, `next_authorities`, `in_blocks`, `forced`     |
| `sudo_set_toggle_transfer`                    | `origin`, `netuid`, `toggle`                            |
| `sudo_set_recycle_or_burn`                    | `origin`, `netuid`, `recycle_or_burn`                   |
| `sudo_toggle_evm_precompile`                  | `origin`, `precompile_id`, `enabled`                    |
| `sudo_set_subnet_moving_alpha`                | `origin`, `alpha`                                       |
| `sudo_set_subnet_owner_hotkey`                | `origin`, `netuid`, `hotkey`                            |
| `sudo_set_ema_price_halving_period`           | `origin`, `netuid`, `ema_halving`                       |
| `sudo_set_alpha_sigmoid_steepness`            | `origin`, `netuid`, `steepness`                         |
| `sudo_set_yuma3_enabled`                      | `origin`, `netuid`, `enabled`                           |
| `sudo_set_bonds_reset_enabled`                | `origin`, `netuid`, `enabled`                           |
| `sudo_set_sn_owner_hotkey`                    | `origin`, `netuid`, `hotkey`                            |
| `sudo_set_subtoken_enabled`                   | `origin`, `netuid`, `subtoken_enabled`                  |
| `sudo_set_commit_reveal_version`              | `origin`, `version`                                     |
| `sudo_set_owner_immune_neuron_limit`          | `origin`, `netuid`, `immune_neurons`                    |
| `sudo_set_ck_burn`                            | `origin`, `burn`                                        |
| `sudo_set_admin_freeze_window`                | `origin`, `window`                                      |
| `sudo_set_owner_hparam_rate_limit`            | `origin`, `epochs`                                      |
| `sudo_set_mechanism_count`                    | `origin`, `netuid`, `mechanism_count`                   |
| `sudo_set_mechanism_emission_split`           | `origin`, `netuid`, `maybe_split`                       |
| `sudo_trim_to_max_allowed_uids`               | `origin`, `netuid`, `max_n`                             |
| `sudo_set_min_allowed_uids`                   | `origin`, `netuid`, `min_allowed_uids`                  |
| `sudo_set_tao_flow_cutoff`                    | `origin`, `flow_cutoff`                                 |
| `sudo_set_tao_flow_normalization_exponent`    | `origin`, `exponent`                                    |
| `sudo_set_tao_flow_smoothing_factor`          | `origin`, `smoothing_factor`                            |
| `sudo_set_min_non_immune_uids`                | `origin`, `netuid`, `min`                               |
| `sudo_set_start_call_delay`                   | `origin`, `delay`                                       |
| `sudo_set_coldkey_swap_announcement_delay`    | `origin`, `duration`                                    |
| `sudo_set_coldkey_swap_reannouncement_delay`  | `origin`, `duration`                                    |

---

### `Balances`

Native token transfers and balance operations.

| Method                 | Arguments                           |
| ---------------------- | ----------------------------------- |
| `transfer_allow_death` | `origin`, `dest`, `value`           |
| `transfer_keep_alive`  | `origin`, `dest`, `value`           |
| `transfer_all`         | `origin`, `dest`, `keep_alive`      |
| `force_transfer`       | `origin`, `source`, `dest`, `value` |

---

### `BaseFee`

Base fee configuration for EVM-style transactions.

| Method                 | Arguments             |
| ---------------------- | --------------------- |
| `set_base_fee_per_gas` | `origin`, `new`       |
| `set_is_active`        | `origin`, `is_active` |

---

### `Commitments`

Commitment/reveal data for subtensor (e.g. registration).

| Method           | Arguments                  |
| ---------------- | -------------------------- |
| `set_commitment` | `origin`, `netuid`, `info` |
| `set_max_space`  | `origin`, `new_limit`      |

---

### `Contracts`

WASM smart contracts.

| Method                  | Arguments                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `instantiate_with_code` | `origin`, `value`, `gas_limit`, `storage_deposit_limit`, `code`, `data`, `salt`      |
| `instantiate`           | `origin`, `value`, `gas_limit`, `storage_deposit_limit`, `code_hash`, `data`, `salt` |
| `call`                  | `origin`, `dest`, `value`, `gas_limit`, `storage_deposit_limit`, `data`              |
| `upload_code`           | `origin`, `code`, `storage_deposit_limit`, `determinism`                             |

---

### `Crowdloan`

Crowdloans and subnet leasing.

| Method                    | Arguments                                                     |
| ------------------------- | ------------------------------------------------------------- |
| `create`                  | `origin`, `deposit`, `min_contribution`, `cap`, `end`, `call` |
| `contribute`              | `origin`, `crowdloan_id`, `amount`                            |
| `withdraw`                | `origin`, `crowdloan_id`                                      |
| `finalize`                | `origin`, `crowdloan_id`                                      |
| `refund`                  | `origin`, `crowdloan_id`                                      |
| `dissolve`                | `origin`, `crowdloan_id`                                      |
| `update_min_contribution` | `origin`, `crowdloan_id`, `new_min_contribution`              |
| `update_end`              | `origin`, `crowdloan_id`, `new_end`                           |
| `update_cap`              | `origin`, `crowdloan_id`, `new_cap`                           |

---

### `Drand`

Drand randomness beacon.

| Method                    | Arguments                                |
| ------------------------- | ---------------------------------------- |
| `write_pulse`             | `origin`, `pulses_payload`, `_signature` |
| `set_beacon_config`       | `origin`, `config_payload`, `_signature` |
| `set_oldest_stored_round` | `origin`, `oldest_round`                 |

---

### `Ethereum`

Ethereum transaction compatibility (Frontier).

| Method     | Arguments               |
| ---------- | ----------------------- |
| `transact` | `origin`, `transaction` |

---

### `EVM`

EVM execution and bridge to Substrate accounts.

| Method     | Arguments                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `call`     | `origin`, `source`, `target`, `input`, `value`, `gas_limit`, `max_fee_per_gas`, `max_priority_fee_per_gas`, `nonce` |
| `create`   | `origin`, `source`, `init`, `value`, `gas_limit`, `max_fee_per_gas`, `max_priority_fee_per_gas`, `nonce`            |
| `withdraw` | `origin`, `address`, `value`                                                                                        |

---

### `Grandpa`

Finality gadget; authority changes are triggered via `AdminUtils::schedule_grandpa_change`.

| Method                         | Arguments                                         |
| ------------------------------ | ------------------------------------------------- |
| `report_equivocation`          | `origin`, `equivocation_proof`, `key_owner_proof` |
| `report_equivocation_unsigned` | `origin`, `equivocation_proof`, `key_owner_proof` |

---

### `MevShield`

MEV protection / encrypted transactions.

| Method              | Arguments              |
| ------------------- | ---------------------- |
| `announce_next_key` | `origin`, `enc_key`    |
| `submit_encrypted`  | `origin`, `ciphertext` |

---

### `Multisig`

Multi-signature approvals around arbitrary calls.

| Method                 | Arguments                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `as_multi`             | `origin`, `threshold`, `other_signatories`, `maybe_timepoint`, `call`, `max_weight`      |
| `as_multi_threshold_1` | `origin`, `other_signatories`, `call`                                                    |
| `approve_as_multi`     | `origin`, `threshold`, `other_signatories`, `maybe_timepoint`, `call_hash`, `max_weight` |
| `cancel_as_multi`      | `origin`, `threshold`, `other_signatories`, `timepoint`, `call_hash`                     |

---

### `Preimage`

Preimage management for governance / other pallets.

| Method               | Arguments         |
| -------------------- | ----------------- |
| `note_preimage`      | `origin`, `bytes` |
| `unnote_preimage`    | `origin`, `hash`  |
| `request_preimage`   | `origin`, `hash`  |
| `unrequest_preimage` | `origin`, `hash`  |

---

### `Proxy`

Proxy and delegate management.

| Method                | Arguments                                                         |
| --------------------- | ----------------------------------------------------------------- |
| `proxy`               | `origin`, `real`, `force_proxy_type`, `call`                      |
| `add_proxy`           | `origin`, `delegate`, `proxy_type`, `delay`                       |
| `remove_proxy`        | `origin`, `delegate`, `proxy_type`, `delay`                       |
| `remove_proxies`      | `origin`                                                          |
| `create_pure`         | `origin`, `proxy_type`, `delay`, `index`                          |
| `kill_pure`           | `origin`, `spawner`, `proxy_type`, `index`, `height`, `ext_index` |
| `announce`            | `origin`, `real`, `call_hash`                                     |
| `remove_announcement` | `origin`, `real`, `call_hash`                                     |
| `reject_announcement` | `origin`, `delegate`, `call_hash`                                 |
| `proxy_announced`     | `origin`, `delegate`, `real`, `force_proxy_type`, `call`          |
| `poke_deposit`        | `origin`                                                          |
| `set_real_pays_fee`   | `origin`, `delegate`, `pays_fee`                                  |

---

### `Registry`

On-chain identity (Registry identity, not Subtensor neuron identity).

| Method           | Arguments                      |
| ---------------- | ------------------------------ |
| `set_identity`   | `origin`, `identified`, `info` |
| `clear_identity` | `origin`, `identified`         |

---

### `SafeMode`

Chain safety controls (emergency switch-style behavior).

| Method            | Arguments |
| ----------------- | --------- |
| `enter_safe_mode` | `origin`  |
| `leave_safe_mode` | `origin`  |

---

### `Scheduler`

Schedule calls for future execution.

| Method           | Arguments                                                    |
| ---------------- | ------------------------------------------------------------ |
| `schedule`       | `origin`, `when`, `maybe_periodic`, `priority`, `call`       |
| `cancel`         | `origin`, `when`, `index`                                    |
| `schedule_named` | `origin`, `id`, `when`, `maybe_periodic`, `priority`, `call` |
| `cancel_named`   | `origin`, `id`                                               |

---

### `SubtensorModule`

Core Bittensor logic: subnets, registration, staking, weights, serving, Alpha/TAO operations.

| Method                                 | Arguments                                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `set_weights`                          | `origin`, `netuid`, `dests`, `weights`, `version_key`                                                                                |
| `set_mechanism_weights`                | `origin`, `netuid`, `mecid`, `dests`, `weights`, `version_key`                                                                       |
| `batch_set_weights`                    | `origin`, `netuids`, `weights`, `version_keys`                                                                                       |
| `commit_weights`                       | `origin`, `netuid`, `commit_hash`                                                                                                    |
| `commit_mechanism_weights`             | `origin`, `netuid`, `mecid`, `commit_hash`                                                                                           |
| `batch_commit_weights`                 | `origin`, `netuids`, `commit_hashes`                                                                                                 |
| `reveal_weights`                       | `origin`, `netuid`, `uids`, `values`, `salt`, `version_key`                                                                          |
| `reveal_mechanism_weights`             | `origin`, `netuid`, `mecid`, `uids`, `values`, `salt`, `version_key`                                                                 |
| `commit_crv3_mechanism_weights`        | `origin`, `netuid`, `mecid`, `commit`, `reveal_round`                                                                                |
| `batch_reveal_weights`                 | `origin`, `netuid`, `uids_list`, `values_list`, `salts_list`, `version_keys`                                                         |
| `commit_timelocked_weights`            | `origin`, `netuid`, `commit`, `reveal_round`, `commit_reveal_version`                                                                |
| `commit_timelocked_mechanism_weights`  | `origin`, `netuid`, `mecid`, `commit`, `reveal_round`, `commit_reveal_version`                                                       |
| `add_stake`                            | `origin`, `hotkey`, `netuid`, `amount_staked`                                                                                        |
| `add_stake_limit`                      | `origin`, `hotkey`, `netuid`, `amount_staked`, `limit_price`, `allow_partial`                                                        |
| `remove_stake`                         | `origin`, `hotkey`, `netuid`, `amount_unstaked`                                                                                      |
| `remove_stake_limit`                   | `origin`, `hotkey`, `netuid`, `amount_unstaked`, `limit_price`, `allow_partial`                                                      |
| `remove_stake_full_limit`              | `origin`, `hotkey`, `netuid`, `limit_price`                                                                                          |
| `move_stake`                           | `origin`, `origin_hotkey`, `destination_hotkey`, `origin_netuid`, `destination_netuid`, `alpha_amount`                               |
| `transfer_stake`                       | `origin`, `destination_coldkey`, `hotkey`, `origin_netuid`, `destination_netuid`, `alpha_amount`                                     |
| `swap_stake`                           | `origin`, `hotkey`, `origin_netuid`, `destination_netuid`, `alpha_amount`                                                            |
| `swap_stake_limit`                     | `origin`, `hotkey`, `origin_netuid`, `destination_netuid`, `alpha_amount`, `limit_price`                                             |
| `unstake_all`                          | `origin`, `hotkey`                                                                                                                   |
| `unstake_all_alpha`                    | `origin`, `hotkey`                                                                                                                   |
| `add_stake_burn`                       | `origin`, `hotkey`, `netuid`, `amount`, `limit`                                                                                      |
| `decrease_take`                        | `origin`, `hotkey`, `take`                                                                                                           |
| `increase_take`                        | `origin`, `hotkey`, `take`                                                                                                           |
| `serve_axon`                           | `origin`, `netuid`, `version`, `ip`, `port`, `ip_type`, `protocol`, `placeholder1`, `placeholder2`                                   |
| `serve_axon_tls`                       | `origin`, `netuid`, `version`, `ip`, `port`, `ip_type`, `protocol`, `placeholder1`, `placeholder2`, `certificate`                    |
| `serve_prometheus`                     | `origin`, `netuid`, `version`, `ip`, `port`, `ip_type`                                                                               |
| `register`                             | `origin`, `netuid`, `block_number`, `nonce`, `work`, `hotkey`                                                                        |
| `root_register`                        | `origin`, `hotkey`                                                                                                                   |
| `burned_register`                      | `origin`, `netuid`, `hotkey`                                                                                                         |
| `register_network`                     | `origin`, `hotkey`                                                                                                                   |
| `register_network_with_identity`       | `origin`, `hotkey`, `identity`                                                                                                       |
| `dissolve_network`                     | `origin`, `_coldkey`, `netuid`                                                                                                       |
| `root_dissolve_network`                | `origin`, `netuid`                                                                                                                   |
| `faucet`                               | `origin`, `block_number`, `nonce`, `work`                                                                                            |
| `start_call`                           | `origin`, `netuid`                                                                                                                   |
| `update_symbol`                        | `origin`, `netuid`, `symbol`                                                                                                         |
| `swap_hotkey`                          | `origin`, `hotkey`, `new_hotkey`, `netuid`                                                                                           |
| `swap_coldkey`                         | `origin`, `old_coldkey`, `new_coldkey`, `swap_cost`                                                                                  |
| `announce_coldkey_swap`                | `origin`, `new_coldkey_hash`                                                                                                         |
| `swap_coldkey_announced`               | `origin`, `new_coldkey`                                                                                                              |
| `dispute_coldkey_swap`                 | `origin`                                                                                                                             |
| `reset_coldkey_swap`                   | `origin`, `coldkey`                                                                                                                  |
| `set_identity`                         | `origin`, `name`, `url`, `github_repo`, `image`, `discord`, `description`, `additional`                                              |
| `set_subnet_identity`                  | `origin`, `netuid`, `subnet_name`, `github_repo`, `subnet_contact`, `subnet_url`, `discord`, `description`, `logo_url`, `additional` |
| `set_children`                         | `origin`, `hotkey`, `netuid`, `children`                                                                                             |
| `set_childkey_take`                    | `origin`, `hotkey`, `netuid`, `take`                                                                                                 |
| `try_associate_hotkey`                 | `origin`, `hotkey`                                                                                                                   |
| `associate_evm_key`                    | `origin`, `netuid`, `evm_key`, `block_number`, `signature`                                                                           |
| `schedule_swap_coldkey`                | `origin`, `_new_coldkey` — **Deprecated**                                                                                            |
| `set_pending_childkey_cooldown`        | `origin`, `cooldown`                                                                                                                 |
| `sudo_set_tx_childkey_take_rate_limit` | `origin`, `tx_rate_limit`                                                                                                            |
| `sudo_set_min_childkey_take`           | `origin`, `take`                                                                                                                     |
| `sudo_set_max_childkey_take`           | `origin`, `take`                                                                                                                     |
| `recycle_alpha`                        | `origin`, `hotkey`, `amount`, `netuid`                                                                                               |
| `burn_alpha`                           | `origin`, `hotkey`, `amount`, `netuid`                                                                                               |
| `register_leased_network`              | `origin`, `emissions_share`, `end_block`                                                                                             |
| `terminate_lease`                      | `origin`, `lease_id`, `hotkey`                                                                                                       |
| `claim_root`                           | `origin`, `subnets`                                                                                                                  |
| `set_root_claim_type`                  | `origin`, `new_root_claim_type`                                                                                                      |
| `set_coldkey_auto_stake_hotkey`        | `origin`, `netuid`, `hotkey`                                                                                                         |
| `sudo_set_num_root_claims`             | `origin`, `new_value`                                                                                                                |
| `sudo_set_root_claim_threshold`        | `origin`, `netuid`, `new_value`                                                                                                      |
| `sudo_set_voting_power_ema_alpha`      | `origin`, `netuid`, `alpha`                                                                                                          |
| `enable_voting_power_tracking`         | `origin`, `netuid`                                                                                                                   |
| `disable_voting_power_tracking`        | `origin`, `netuid`                                                                                                                   |

---

### `Sudo`

Root-only superuser dispatch.

| Method                  | Arguments                  |
| ----------------------- | -------------------------- |
| `sudo`                  | `origin`, `call`           |
| `sudo_unchecked_weight` | `origin`, `call`, `weight` |
| `set_key`               | `origin`, `new`            |

---

### `Swap`

TAO/Alpha AMM and liquidity.

| Method                  | Arguments                                                               |
| ----------------------- | ----------------------------------------------------------------------- |
| `set_fee_rate`          | `origin`, `netuid`, `rate`                                              |
| `toggle_user_liquidity` | `origin`, `netuid`, `enable`                                            |
| `add_liquidity`         | `origin`, `_hotkey`, `_netuid`, `_tick_low`, `_tick_high`, `_liquidity` |
| `remove_liquidity`      | `origin`, `hotkey`, `netuid`, `position_id`                             |
| `modify_position`       | `origin`, `hotkey`, `netuid`, `position_id`, `liquidity_delta`          |
| `disable_lp`            | `origin`                                                                |

---

### `System`

Core system pallet for accounts, blocks, and execution.

| Method                    | Arguments          |
| ------------------------- | ------------------ |
| `remark`                  | `origin`, `remark` |
| `set_heap_pages`          | `origin`, `pages`  |
| `set_code`                | `origin`, `code`   |
| `set_code_without_checks` | `origin`, `code`   |

---

### `Timestamp`

Block timestamp management.

| Method | Arguments       |
| ------ | --------------- |
| `set`  | `origin`, `now` |

---

### `Utility`

Batch and dispatch helpers.

| Method                 | Arguments                     |
| ---------------------- | ----------------------------- |
| `batch`                | `origin`, `calls`             |
| `as_derivative`        | `origin`, `index`, `call`     |
| `batch_all`            | `origin`, `calls`             |
| `dispatch_as`          | `origin`, `as_origin`, `call` |
| `force_batch`          | `origin`, `calls`             |
| `with_weight`          | `origin`, `call`, `weight`    |
| `if_else`              | `origin`, `main`, `fallback`  |
| `dispatch_as_fallible` | `origin`, `as_origin`, `call` |

---

For the exact list of variants and types for all pallets, query **`state_getMetadata`** or use the chain’s type definitions (e.g. for Polkadot.js or other clients).
