---
title: "Epoch Implementation"
---

# Epoch Implementation

The epoch mechanism is the heart of Yuma Consensus in Bittensor, implementing the complex algorithm that processes validator weights and determines emissions for both miners and validators. This page provides a comprehensive examination of the `epoch()` function and its supporting logic.

## Overview

The epoch function processes:
1. **Validator weights** submitted during the tempo period
2. **Stake calculations** determining validator influence  
3. **Consensus computation** through stake-weighted medians
4. **Bond updates** via exponential moving averages
5. **Emission allocation** to miners and validators

The function returns emission tuples: `Vec<(T::AccountId, AlphaCurrency, AlphaCurrency)>` representing `(hotkey, miner_emission, validator_emission)`.

## Core Function: `epoch()`

Located in `subtensor/pallets/subtensor/src/epoch/run_epoch.rs`, with two implementations:
- `epoch()` - Optimized sparse matrix version (production)
- `epoch_dense()` - Dense matrix version (testing)

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
A neuron is considered inactive if:
```
last_update + activity_cutoff < current_block
```

This ensures only recently active participants influence consensus.

### 2. Stake Processing and Validation

```rust
// Get hotkey mappings
let hotkeys: Vec<(u16, T::AccountId)> =
    <Keys<T> as IterableStorageDoubleMap<NetUid, u16, T::AccountId>>::iter_prefix(netuid)
        .collect();

// Get stake weights
let (total_stake, _alpha_stake, _tao_stake): (Vec<I64F64>, Vec<I64F64>, Vec<I64F64>) =
    Self::get_stake_weights_for_network(netuid);

let min_stake = Self::get_stake_threshold();

// Filter stake below threshold
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

**Stake Calculation:**
The `get_stake_weights_for_network()` function combines:
- **Alpha stake**: Subnet-specific token holdings
- **TAO stake**: Root subnet holdings weighted by `tao_weight` (default: 18%)

**Total stake** = alpha_stake + (tao_stake × tao_weight)

### 3. Validator Permit Management

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

**Validator Selection:**
Only the top `max_allowed_validators` by stake receive validator permits, ensuring the highest-staked participants control consensus.

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
- **Self-weights**: Prevent validators from voting for themselves (except subnet owner)
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

**Commit-Reveal Logic:**
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

**Trust Calculation:**
- **Validator trust**: Sum of a validator's clipped weights (measures alignment with consensus)
- **Server trust**: Ratio of post-clip to pre-clip rank (measures consensus adherence)

**Rank → Incentive:**
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
    
    // Normalize bonds and calculate dividends
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
- **Bonds**: Measure validator-miner relationships over time
- **EMA Updates**: $B_{ij}^{(t)} = \alpha \Delta B_{ij} + (1-\alpha) B_{ij}^{(t-1)}$
- **Dividends**: Validators earn based on bonds to high-incentive miners

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

**RAO Scaling:**
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

## Mathematical Foundation

The epoch function implements several key mathematical operations:

### Stake-Weighted Matrix Operations
```rust
// Preranks: r_j = Σ(i) w_ij * s_i  
let preranks: Vec<I32F32> = matmul_sparse(&weights, &active_stake, n);

// Consensus: weighted median of weights by stake
let consensus: Vec<I32F32> = weighted_median_col_sparse(&active_stake, &weights, n, kappa);
```

### Bond EMA Updates
For liquid alpha (Yuma3):
```rust
let alphas: Vec<Vec<I32F32>> = Self::compute_liquid_alpha_values_sparse(
    netuid, &weights_for_bonds, &bonds, &consensus
);
let ema_bonds = mat_ema_alpha_sparse(&weights_for_bonds, &bonds, &alphas);
```

For original Yuma:
```rust
let alpha: I32F32 = Self::compute_disabled_liquid_alpha(netuid);
let ema_bonds = mat_ema_sparse(&bonds_delta, &bonds, alpha);
```

### Dividend Calculation
```rust
// Yuma3: dividends = Σ(j) normalized_bonds_ij * incentive_j * active_stake_i
dividends = vec_mul(&total_bonds_per_validator, &active_stake);

// Original: dividends = Σ(j) bonds_ij * incentive_j  
dividends = matmul_transpose_sparse(&ema_bonds, &incentive);
```

## Liquid Alpha vs Original Yuma

### Liquid Alpha (Yuma3)
- **Variable alpha**: Each validator-miner bond has its own EMA parameter
- **Consensus-based**: Alpha values depend on alignment with consensus  
- **Bond weighting**: Bonds influence dividend distribution
- **Stake interaction**: Active stake affects final dividend calculation

### Original Yuma
- **Fixed alpha**: Single EMA parameter for all bonds
- **Direct bonds**: Simpler bond → dividend mapping
- **Column normalization**: Bonds sum to 1.0 per miner

## Performance Optimizations

### Sparse Matrix Operations
The production implementation uses sparse matrices to handle:
- **Memory efficiency**: Only store non-zero weights/bonds
- **Computational speed**: Skip zero multiplications
- **Scalability**: Handle large networks efficiently

### Batch Processing
- **Vector operations**: Process all neurons simultaneously
- **In-place updates**: Minimize memory allocation
- **Fixed-point math**: Avoid floating-point precision issues

## Integration with Coinbase

The epoch function is called from `drain_pending_emission()` during coinbase execution:

```rust
let hotkey_emission: Vec<(T::AccountId, AlphaCurrency, AlphaCurrency)> =
    Self::epoch(netuid, pending_alpha.saturating_add(pending_swapped));
```

The returned emission tuples feed into the broader emission distribution system, where:
- **Miner emissions** go directly to mining hotkeys
- **Validator emissions** are split between validators and their stakers
- **Distribution logic** handles child keys, takes, and delegation

## Key Design Principles

### 1. Consensus Alignment
Validators who align with stake-weighted consensus earn more through stronger bonds and higher trust scores.

### 2. Activity Requirements  
Only recently active participants influence consensus, preventing stale state from affecting current decisions.

### 3. Stake-Weighted Influence
Higher stake provides more consensus power, but is balanced by validator permit limits and consensus clipping.

### 4. Gradual Bond Updates
EMA smoothing prevents rapid manipulation while allowing adaptation to changing performance.

### 5. Economic Incentive Alignment
The mathematical design ensures validators benefit from accurately evaluating miners, while miners benefit from providing value.

Understanding the epoch mechanism is essential for subnet developers and validator operators, as it determines how their contributions are evaluated and rewarded within the Bittensor network.
