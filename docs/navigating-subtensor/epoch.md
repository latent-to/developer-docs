---
title: "Implementation of the Yuma Consensus Epoch"
---

# Implementation of the Yuma Consensus Epoch

If [Yuma Consensus (YC](../resources/glossary.md#yuma-consensus) is the heart of Bittensor, the epoch is the heartbeat, a regular pulse of calculations that processes [validator](../resources/glossary.md#subnet-validator) weights and determines [emissions](../resources/glossary.md#emission) for participants. This page takes a deep dive into how the code accomplishes its purpose.

The epoch function takes as its input the matrix of values assigned to each miner by each validator, and returns emission tuples of hotkey, emission for mining, and emission for validating.

It derives these by performing stake-weighted consensus (YC) over them in order to derive the aggregated miner ratings and miner-validator bonds. Miners gain emissions (incentives) based on their aggregate ratings, and validators gain emissions (dividends) based on their bonds to highly rated miners.

The basic flow of the epoch is:

1. Validator weights are submitted during the preceding [tempo](../resources/glossary.md#tempo).
2. [Stake weight](../resources/glossary.md#stake-weight) determines validator influence during consensus.
3. [Consensus](../resources/glossary.md#consensus-score) computation clips validator-miner ratings that outlie the stake-weighted median.
4. Bonds update via [exponential moving averages](../resources/glossary.md#exponential-moving-average-ema).
5. Emissions are allocated to miners and validators.

## Core Function: `epoch()`

Source code: [`run_epoch.rs`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs).

### Function Signature

```rust
pub fn epoch(
    netuid: NetUid,
    rao_emission: AlphaCurrency,
) -> Vec<(T::AccountId, AlphaCurrency, AlphaCurrency)>
```

## Implementation Flow

### 1. Network State Collection

```rust
// Get subnetwork size
let n = Self::get_subnetwork_n(netuid);

// Get current block and timing
let current_block: u64 = Self::get_current_block_as_u64();
let tempo: u64 = Self::get_tempo(netuid).into();
let activity_cutoff: u64 = Self::get_activity_cutoff(netuid) as u64;

// Get neuron activity data
let last_update: Vec<u64> = Self::get_last_update(netuid);
let block_at_registration: Vec<u64> = Self::get_block_at_registration(netuid);

// Calculate inactive neurons
let inactive: Vec<bool> = last_update
    .iter()
    .map(|updated| updated.saturating_add(activity_cutoff) < current_block)
    .collect();

let active: Vec<bool> = inactive.iter().map(|&b| !b).collect();
```

**Activity Determination:**
A [neuron](../resources/glossary.md#neuron) is considered inactive if:

```
last_update + activity_cutoff < current_block
```

This ensures only recently active participants influence consensus.

### 2. Stake Processing and Validation

First, get hotkeys mapped to stake-weights.

```rust

let hotkeys: Vec<(u16, T::AccountId)> =
    <Keys<T> as IterableStorageDoubleMap<NetUid, u16, T::AccountId>>::iter_prefix(netuid)
        .collect();

let (total_stake, _alpha_stake, _tao_stake): (Vec<I64F64>, Vec<I64F64>, Vec<I64F64>) =
    Self::get_stake_weights_for_network(netuid);

let min_stake = Self::get_stake_threshold();
```

Filter out hotkeys below minimum stake threshold.

```rust
let mut filtered_stake: Vec<I64F64> = total_stake
    .iter()
    .map(|&s| {
        if fixed64_to_u64(s) < min_stake {
            return I64F64::from(0);
        }
        s
    })
    .collect();

// Normalize stake
inplace_normalize_64(&mut filtered_stake);
let stake: Vec<I32F32> = vec_fixed64_to_fixed32(filtered_stake);
```

:::info Stake-Weight Calculation
**Stake-Weight** = alpha_stake + (tao_stake × tao_weight)

The `get_stake_weights_for_network()` function combines:

- **Alpha stake**: Subnet-specific token holdings
- **TAO stake**: [Root subnet](../resources/glossary.md#root-subnetsubnet-zero) holdings weighted by `[tao_weight](../resources/glossary.md#tao-weight)` (default: 18%)
  :::

Filter validator permit candidates for minimum stake-weight.

```rust
// Get the minimum stake required
let min_stake = Self::get_stake_threshold();

let mut filtered_stake: Vec<I64F64> = total_stake
    .iter()
    .map(|&s| {
        if fixed64_to_u64(s) < min_stake {
            return I64F64::from(0);
        }
        s
    })
    .collect();
```

### 3. Validator Permit Management

Validator permits are dynamically calculated every epoch based on stake distribution. This system ensures that only the most committed (highest-staked) participants can influence consensus.

```rust
// Get current validator permits
let validator_permits: Vec<bool> = Self::get_validator_permit(netuid);
let validator_forbids: Vec<bool> = validator_permits.iter().map(|&b| !b).collect();

// Get max allowed validators
let max_allowed_validators: u16 = Self::get_max_allowed_validators(netuid);

// Calculate new validator permits based on top-k stake
let new_validator_permits: Vec<bool> =
    is_topk_nonzero(&stake, max_allowed_validators as usize);
```

**Validator Selection Algorithm:**

The `is_topk_nonzero()` function implements a filtering process:

1. **Stake Filtering**: Only neurons with stake ≥ `stake_threshold` (minimum 1000 stake weight) are considered
2. **Top-K Selection**: The top K neurons by stake weight receive validator permits (default: top 64)
3. **Non-Zero Requirement**: Neurons with zero stake are automatically excluded
4. **Stable Sorting**: Uses ascending stable sort to ensure deterministic selection when stakes are equal

**Algorithm Details:**

```rust
pub fn is_topk_nonzero(vector: &[I32F32], k: usize) -> Vec<bool> {
    let n: usize = vector.len();
    let mut result: Vec<bool> = vector.iter().map(|&elem| elem != I32F32::from(0)).collect();
    if n < k {
        return result; // All non-zero elements get permits if total < k
    }
    let mut idxs: Vec<usize> = (0..n).collect();
    idxs.sort_by_key(|&idx| &vector[idx]); // ascending stable sort
    for &idx in idxs.iter().take(n.saturating_sub(k)) {
        result[idx] = false; // Mark bottom (n-k) elements as false
    }
    result
}
```

This ensures that exactly K neurons (or fewer if insufficient candidates) receive validator permits, with deterministic tie-breaking through stable sorting.

**Permit Lifecycle:**

```rust
// Bonds are cleared when permits are lost
new_validator_permits
    .iter()
    .zip(validator_permits)
    .zip(ema_bonds)
    .enumerate()
    .for_each(|(i, ((new_permit, validator_permit), ema_bond))| {
        if *new_permit {
            // Retain bonds if permit is maintained
            let new_bonds_row: Vec<(u16, u16)> = ema_bond
                .iter()
                .map(|(j, value)| (*j, fixed_proportion_to_u16(*value)))
                .collect();
            Bonds::<T>::insert(netuid, i as u16, new_bonds_row);
        } else if validator_permit {
            // Clear bonds if permit is lost
            let new_empty_bonds_row: Vec<(u16, u16)> = vec![];
            Bonds::<T>::insert(netuid, i as u16, new_empty_bonds_row);
        }
    });
```

**Key Features:**

- **Dynamic Updates**: Permits are recalculated every epoch based on current stake distribution
- **Bond Preservation**: Neurons retain their bonds only while holding validator permits
- **Automatic Cleanup**: Bonds are cleared when permits are lost, preventing stale relationships
- **Stake Threshold**: Minimum stake requirement (typically 1000 stake weight) filters out low-commitment participants

**Related Documentation:**

- For validator setup and requirements, see [Validating in Bittensor](../validators/index.md)
- For detailed permit lifecycle management, see [Validator Permits section](../validators/index.md#validator-permits)

**Code References:**

- Validator permit calculation: [`subtensor/pallets/subtensor/src/epoch/run_epoch.rs:520-537`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs#L520-537)
- Top-K selection algorithm: [`subtensor/pallets/subtensor/src/epoch/math.rs:250-263`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/math.rs#L250-263)
- Bond cleanup logic: [`subtensor/pallets/subtensor/src/epoch/run_epoch.rs:903-921`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs#L903-921)

### 4. Active Stake Calculation

```rust
let mut active_stake: Vec<I32F32> = stake.clone();

// Remove inactive stake
inplace_mask_vector(&inactive, &mut active_stake);

// Remove non-validator stake
inplace_mask_vector(&validator_forbids, &mut active_stake);

// Normalize active stake
inplace_normalize(&mut active_stake);
```

**Active stake** represents the consensus power of validators who are:

1. Recently active (within `activity_cutoff`)
2. Hold validator permits
3. Meet minimum stake requirements

### 5. Weight Processing

```rust
// Access network weights (sparse format)
let mut weights: Vec<Vec<(u16, I32F32)>> = Self::get_weights_sparse(netuid);

// Mask weights from non-permitted validators
weights = mask_rows_sparse(&validator_forbids, &weights);

// Remove self-weights (except subnet owner if exists)
let owner_uid: Option<u16> = Self::get_owner_uid(netuid);
if let Some(owner_uid) = owner_uid {
    weights = mask_diag_sparse_except_index(&weights, owner_uid);
} else {
    weights = mask_diag_sparse(&weights);
}

// Remove weights to deregistered neurons
weights = vec_mask_sparse_matrix(
    &weights,
    &last_update,
    &block_at_registration,
    &|updated, registered| updated <= registered,
);
```

**Weight Filtering:**
Weights are filtered to remove:

- **Self-weights**: Prevent validators from voting for themselves (except [subnet creator](../resources/glossary.md#subnet-creator))
- **Outdated weights**: Weights set before target neuron's latest registration
- **Non-validator weights**: Only permitted validators can influence consensus

#### Commit-Reveal Weight Processing

```rust
if Self::get_commit_reveal_weights_enabled(netuid) {
    let mut commit_blocks: Vec<u64> = vec![u64::MAX; n as usize];

    // Process v2 commits
    for (who, q) in WeightCommits::<T>::iter_prefix(netuid) {
        for (_, cb, _, _) in q.iter() {
            if !Self::is_commit_expired(netuid, *cb) {
                if let Some(i) = uid_of(&who) {
                    commit_blocks[i] = commit_blocks[i].min(*cb);
                }
                break;
            }
        }
    }

    // Process v3 commits
    for (_epoch, q) in CRV3WeightCommitsV2::<T>::iter_prefix(netuid) {
        for (who, cb, ..) in q.iter() {
            if !Self::is_commit_expired(netuid, *cb) {
                if let Some(i) = uid_of(who) {
                    commit_blocks[i] = commit_blocks[i].min(*cb);
                }
            }
        }
    }

    // Mask weights from validators with active commits
    weights = vec_mask_sparse_matrix(
        &weights,
        &commit_blocks,
        &block_at_registration,
        &|cb, reg| cb < reg,
    );
}
```

**[Commit Reveal](../resources/glossary.md#commit-reveal) Logic:**
When enabled, validators must commit to weights before revealing them. Weights are masked if:

- Validator has an active (non-expired) commit
- Commit was made before target neuron's registration

### 6. Weight Normalization

```rust
// Normalize remaining weights by row
inplace_row_normalize_sparse(&mut weights);
```

After filtering, each validator's weights are normalized so they sum to 1.0, ensuring equal influence regardless of absolute weight values.

### 7. Consensus Calculation

```rust
// Compute preranks (before consensus clipping)
let preranks: Vec<I32F32> = matmul_sparse(&weights, &active_stake, n);

// Get consensus threshold (default: 51%)
let kappa: I32F32 = Self::get_float_kappa(netuid);

// Calculate consensus as stake-weighted median
let consensus: Vec<I32F32> = weighted_median_col_sparse(&active_stake, &weights, n, kappa);

// Clip weights at consensus level
let clipped_weights: Vec<Vec<(u16, I32F32)>> = col_clip_sparse(&weights, &consensus);
```

**Consensus Computation:**
For each miner j, consensus $\overline{W_j}$ is the maximum weight level supported by at least fraction κ of total stake:

$$
\overline{W_j} = \arg \max_{w} \left( \sum_{i \in \mathbb{V}} S_i \cdot \mathbf{1}_{W_{ij} \geq w} \geq \kappa \right)
$$

**Weight Clipping:**
Any weight above consensus is clipped: $\overline{W_{ij}} = \min(W_{ij}, \overline{W_j})$

### 8. Trust and Rank Calculation

```rust
// Calculate validator trust (sum of clipped weights)
let validator_trust: Vec<I32F32> = row_sum_sparse(&clipped_weights);

// Compute final ranks using clipped weights
let mut ranks: Vec<I32F32> = matmul_sparse(&clipped_weights, &active_stake, n);

// Compute server trust (rank after / rank before clipping)
let trust: Vec<I32F32> = vecdiv(&ranks, &preranks);

// Normalize ranks to get incentives
inplace_normalize(&mut ranks);
let incentive: Vec<I32F32> = ranks.clone();
```

**[Trust](../resources/glossary.md#trust) Calculation:**

- **[Validator trust](../resources/glossary.md#validator-trust)**: Sum of a validator's clipped weights (measures alignment with consensus)
- **Server trust**: Ratio of post-clip to pre-clip [rank](../resources/glossary.md#rank) (measures consensus adherence)

**Rank → [Incentive](../resources/glossary.md#incentives):**
Final normalized ranks become miner incentives, ensuring total incentives sum to 1.0.

### 9. Bond Processing

The bond mechanism depends on whether Yuma3 is enabled:

#### Yuma3 Bonds (Liquid Alpha)

```rust
if Yuma3On::<T>::get(netuid) {
    // Get existing bonds
    let mut bonds = Self::get_bonds_sparse_fixed_proportion(netuid);

    // Remove bonds to recently registered neurons
    let last_tempo: u64 = current_block.saturating_sub(tempo);
    bonds = scalar_vec_mask_sparse_matrix(
        &bonds,
        last_tempo,
        &block_at_registration,
        &|last_tempo, registered| last_tempo <= registered,
    );

    // Compute new bonds with liquid alpha
    ema_bonds = Self::compute_bonds_sparse(netuid, &weights_for_bonds, &bonds, &consensus);

    // Normalize bonds and calculate validator emissions
    let mut ema_bonds_norm = ema_bonds.clone();
    inplace_col_normalize_sparse(&mut ema_bonds_norm, n);

    let total_bonds_per_validator: Vec<I32F32> =
        row_sum_sparse(&mat_vec_mul_sparse(&ema_bonds_norm, &incentive));

    dividends = vec_mul(&total_bonds_per_validator, &active_stake);
    inplace_normalize(&mut dividends);
}
```

#### Original Yuma Bonds

```rust
else {
    // Get existing bonds
    let mut bonds: Vec<Vec<(u16, I32F32)>> = Self::get_bonds_sparse(netuid);

    // Remove bonds to recently registered neurons
    bonds = scalar_vec_mask_sparse_matrix(/* ... */);
    inplace_col_normalize_sparse(&mut bonds, n);

    // Compute bond deltas from weights and stake
    let mut bonds_delta: Vec<Vec<(u16, I32F32)>> =
        row_hadamard_sparse(&weights_for_bonds, &active_stake);
    inplace_col_normalize_sparse(&mut bonds_delta, n);

    // Apply EMA to bonds
    ema_bonds = Self::compute_ema_bonds_normal_sparse(&bonds_delta, &bonds, netuid);
    inplace_col_normalize_sparse(&mut ema_bonds, n);

    // Calculate dividends: d_i = SUM(j) b_ij * incentive_j
    dividends = matmul_transpose_sparse(&ema_bonds, &incentive);
    inplace_normalize(&mut dividends);
}
```

**Bond Dynamics:**

- **[Bonds](../resources/glossary.md#validator-miner-bonds)**: Measure validator-miner relationships over time
- **EMA Updates**: $B_{ij}^{(t)} = \alpha \Delta B_{ij} + (1-\alpha) B_{ij}^{(t-1)}$
- **Validator Emissions**: Validators earn based on bonds to high-incentive miners

### 10. Emission Distribution

```rust
// Calculate combined emissions for pruning scores
let combined_emission: Vec<I32F32> = incentive
    .iter()
    .zip(dividends.clone())
    .map(|(ii, di)| ii.saturating_add(di))
    .collect();

let emission_sum: I32F32 = combined_emission.iter().sum();

// Separate server and validator emissions
let mut normalized_server_emission: Vec<I32F32> = incentive.clone();
let mut normalized_validator_emission: Vec<I32F32> = dividends.clone();
let mut normalized_combined_emission: Vec<I32F32> = combined_emission.clone();

// Normalize based on total emission sum
inplace_normalize_using_sum(&mut normalized_server_emission, emission_sum);
inplace_normalize_using_sum(&mut normalized_validator_emission, emission_sum);
inplace_normalize(&mut normalized_combined_emission);

// Handle zero emission case
if emission_sum == I32F32::from(0) {
    if is_zero(&active_stake) {
        normalized_validator_emission.clone_from(&stake);
        normalized_combined_emission.clone_from(&stake);
    } else {
        normalized_validator_emission.clone_from(&active_stake);
        normalized_combined_emission.clone_from(&active_stake);
    }
}
```

**Emission Fallback:**
When no weights are set (emission_sum = 0), emissions default to stake proportions.

### 11. RAO Conversion

```rust
// Convert to actual currency amounts
let float_rao_emission: I96F32 = I96F32::saturating_from_num(rao_emission);

let server_emission: Vec<AlphaCurrency> = normalized_server_emission
    .iter()
    .map(|se| {
        let scaled = I96F32::saturating_from_num(*se)
            .saturating_mul(float_rao_emission);
        scaled.saturating_to_num::<u64>().into()
    })
    .collect();

let validator_emission: Vec<AlphaCurrency> = normalized_validator_emission
    .iter()
    .map(|ve| {
        let scaled = I96F32::saturating_from_num(*ve)
            .saturating_mul(float_rao_emission);
        scaled.saturating_to_num::<u64>().into()
    })
    .collect();
```

**[RAO](../resources/glossary.md#rao) Scaling:**
Normalized emission proportions are scaled by the total RAO emission amount to get actual currency values.

### 12. State Updates

```rust
// Store computed values
StakeWeight::<T>::insert(netuid, cloned_stake_weight);
Active::<T>::insert(netuid, active);
Emission::<T>::insert(netuid, combined_emission);
Rank::<T>::insert(netuid, cloned_ranks);
Trust::<T>::insert(netuid, cloned_trust);
Consensus::<T>::insert(netuid, cloned_consensus);
Incentive::<T>::insert(netuid, cloned_incentive);
Dividends::<T>::insert(netuid, cloned_dividends);
PruningScores::<T>::insert(netuid, cloned_pruning_scores);
ValidatorTrust::<T>::insert(netuid, cloned_validator_trust);
ValidatorPermit::<T>::insert(netuid, new_validator_permits);

// Update bonds for validators with permits
new_validator_permits
    .iter()
    .zip(validator_permits)
    .zip(ema_bonds)
    .enumerate()
    .for_each(|(i, ((new_permit, validator_permit), ema_bond))| {
        if *new_permit {
            let new_bonds_row: Vec<(u16, u16)> = ema_bond
                .iter()
                .map(|(j, value)| (*j, fixed_proportion_to_u16(*value)))
                .collect();
            Bonds::<T>::insert(netuid, i as u16, new_bonds_row);
        } else if validator_permit {
            Bonds::<T>::insert(netuid, i as u16, vec![]);
        }
    });
```

**Storage Updates:**
All computed values are stored for:

- **External queries**: Allow inspection of consensus state
- **Next epoch**: Bonds and permits carry forward
- **Pruning**: Combined emission determines neuron removal

### 13. Return Emission Tuples

```rust
// Create final emission mapping
hotkeys
    .into_iter()
    .map(|(uid_i, hotkey)| {
        (
            hotkey,
            server_emission[uid_i as usize],    // Miner emission
            validator_emission[uid_i as usize], // Validator emission
        )
    })
    .collect()
```
