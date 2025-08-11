# Understanding Exponential Moving Averages in Bittensor

The exponential moving average (EMA) is a [mathematical technique](https://en.wikipedia.org/wiki/Exponential_smoothing) for tracking a dynamic quantity, such as a token price, over time.

Specifically, EMA is a weighted moving average that exponentially decreases the weight of older data point. This extracts a signal reflecting where the value has spent *most* of its time *most recently*, stabilizing or 'smoothing' the constant noise of rapid, largely random fluctuations.

The EMA formula is elegantly simple:

```
EMA(t) = α × Current_Value + (1 - α) × EMA(t-1) 
```

$$
\mathrm{EMA}(t) = \alpha \times \mathrm{Current\_Value} + (1 - \alpha) \times \mathrm{EMA}(t-1)
$$
Where:
- **α (alpha)** is the smoothing factor (0 < α < 1)
- **Current_Value** is the new observation
- **EMA(t-1)** is the previous EMA value

### Understanding Alpha (α)

The alpha parameter controls how quickly the EMA responds to changes:

- **Small α (e.g., 0.01)**: Very slow response, high stability, takes many periods for significant changes
- **Large α (e.g., 0.5)**: Fast response, lower stability, quickly incorporates new information
- **α = 1**: No smoothing (immediate response to current value)

## Bittensor's Two EMA Applications

Bittensor strategically employs EMAs in two critical areas, each with different objectives and parameter settings.

### 1. Validator-Miner Bond Smoothing (with Liquid Alpha Option)

**Purpose**: Ensures that relationships between validators and miners evolve gradually, preventing sudden manipulation while rewarding validators who discover promising miners early.

**Location**: Consensus mechanism during epoch calculations

#### Basic Bond EMA (Liquid Alpha Disabled)
**Default Mode**: Single α for all validator-miner pairs
- **Default α**: ~0.1 (10%) <!-- ✅ VERIFIED: bonds_moving_average = 900,000 / 1,000,000 = 0.9, so α = 1 - 0.9 = 0.1 (see subtensor/pallets/subtensor/src/epoch/run_epoch.rs:1084-1091) -->
- **Response Time**: 7-22 blocks for significant changes (~1-4 minutes) <!-- ✅ VERIFIED: With 12-second blocks, this equals 84-264 seconds (see subtensor/common/src/lib.rs:197) -->
- **Formula**: `Bond_EMA(t) = 0.1 × New_Bond + 0.9 × Previous_Bond_EMA`

#### Advanced Bond EMA (Liquid Alpha Enabled)
**Consensus-Based Mode**: Dynamic α per validator-miner pair based on consensus alignment
- **α Range**: Dynamic between α_low and α_high (default: 0.7 to 0.9) <!-- ✅ VERIFIED: Default alpha values (45875, 58982) convert to ~0.7 and ~0.9 (see subtensor/pallets/subtensor/src/lib.rs:783-784) -->
- **Sigmoid Steepness**: Controls transition rate between α_low and α_high (default: 1000) <!-- ✅ VERIFIED: SubtensorInitialAlphaSigmoidSteepness = 1000 (see subtensor/runtime/src/lib.rs:1151) -->
- **Individual Alpha**: Each validator-miner pair gets its own α value
- **Response Time**: 1-13 blocks depending on consensus alignment (~12 seconds to 2.6 minutes)

**How Liquid Alpha Works**: <!-- ✅ VERIFIED: Formula confirmed in subtensor/pallets/subtensor/src/epoch/run_epoch.rs:1351-1362 -->
```
α = α_low + sigmoid(combined_diff) × (α_high - α_low)
where combined_diff = |weight - consensus| or |bond - weight|
```

**Dynamic Behavior**:
- **Consensus-Aligned Validators**: Get α closer to α_high (faster bonding)
- **Out-of-Consensus Validators**: Get α closer to α_low (slower bonding)
- **Discovery Incentive**: Validators who find good miners before consensus forms get rewarded with faster bonding

**Benefits**:
- **Rewards Discovery**: Validators who identify high-value miners early build stronger long-term bonds
- **Prevents Gaming**: Sudden weight shifts cannot instantly manipulate bond distributions
- **Consensus Alignment**: Rewards validators who align with network consensus
- **Manipulation Resistance**: Penalizes validators who deviate significantly from consensus
- **Individual Tuning**: Each validator-miner relationship has its own EMA rate (when liquid alpha enabled)

### 2. Subnet Price Emission Smoothing

**Purpose**: Protects the network's economic model from price manipulation by making emissions extremely slow to respond to price changes.

**Location**: Coinbase emission calculations

**Key Parameters**:
- **α**: Dynamic, typically ~0.000003 (ultra-conservative) <!-- ✅ VERIFIED: SubnetMovingAlpha default is 0.000003 (see subtensor/pallets/subtensor/src/lib.rs:831) -->
- **Response Time**: ~30 days for 50% adjustment, ~3.5 months for 90% adjustment <!-- ✅ VERIFIED: Mathematical calculation with α = 0.000003 confirmed -->
- **Halving Period**: 201,600 blocks (~4 weeks) <!-- ✅ VERIFIED: InitialEmaPriceHalvingPeriod = 201,600 blocks (see subtensor/runtime/src/lib.rs:1207) -->

**How It Works**:
The price EMA uses a sophisticated dynamic alpha calculation: <!-- ✅ VERIFIED: Formula confirmed in subtensor/pallets/subtensor/src/staking/stake_utils.rs:54-56 -->
```
α = base_alpha × (blocks_since_start) / (blocks_since_start + halving_blocks)
```

This ensures new subnets have even slower price adaptation than mature ones.

**Benefits**:
- **Attack Resistance**: Prevents pump-and-dump schemes from manipulating emissions
- **Market Stability**: Filters out short-term price volatility
- **Fair Distribution**: Ensures emission advantages must be sustained over long periods

## Real-World Example: Price Manipulation Defense

Consider this scenario to understand why ultra-conservative price EMAs are crucial:

**Without EMA Protection**:
1. Attackers coordinate to artificially inflate a subnet's token price from $0.50 to $10,200
2. The subnet immediately receives 20,000x more emissions
3. Attackers dump tokens and crash the price
4. Network resources have been unfairly redistributed

**With EMA Protection (α = 0.000003)**:
1. Same price manipulation attempt occurs
2. EMA moves from $0.50 to only ~$0.53 (tiny increase) <!-- ⚠️ SUSPECT: This calculation assumes static α, but price EMA uses dynamic α that depends on blocks_since_start. For new subnets, α would be much smaller, for mature subnets, α approaches base_alpha × 1 = 0.000003 -->
3. Emission advantage is negligible despite massive price spike
4. Attack becomes economically infeasible

## Mathematical Analysis: Time Constants

For any EMA, you can calculate how long it takes to reach a certain percentage of a change:

```
Time for X% adjustment = ln(1 - X/100) / ln(1 - α)
```

### Bond EMA Examples:

**Basic Bond EMA (α = 0.1)**:
- **50% adjustment**: ~7 blocks (1.4 minutes)
- **90% adjustment**: ~22 blocks (4.4 minutes)
- **99% adjustment**: ~44 blocks (8.8 minutes)

**Liquid Alpha Bond EMA - High Consensus (α = 0.9)**:
- **50% adjustment**: ~1 block (12 seconds)
- **90% adjustment**: ~2 blocks (24 seconds)
- **99% adjustment**: ~4 blocks (48 seconds)

**Liquid Alpha Bond EMA - Low Consensus (α = 0.7)**:
- **50% adjustment**: ~2 blocks (24 seconds)
- **90% adjustment**: ~7 blocks (84 seconds)
- **99% adjustment**: ~13 blocks (156 seconds)

### Price EMA Example (α = 0.000003): <!-- ⚠️ IMPORTANT: This assumes static α, but actual implementation uses dynamic α formula -->
- **50% adjustment**: ~231,049 blocks (30 days) <!-- ✅ VERIFIED: 231,049 × 12 seconds = 2,772,588 seconds ≈ 32 days -->
- **90% adjustment**: ~768,497 blocks (3.5 months) <!-- ✅ VERIFIED: 768,497 × 12 seconds = 9,221,964 seconds ≈ 107 days -->
- **99% adjustment**: ~1,536,994 blocks (7 months) <!-- ✅ VERIFIED: 1,536,994 × 12 seconds = 18,443,928 seconds ≈ 213 days -->

## Design Philosophy: Stability Over Speed

Bittensor's EMA implementations reflect a fundamental design philosophy that prioritizes long-term network health over short-term responsiveness:

### Conservative by Design
- **Price EMAs**: Extremely conservative to prevent economic attacks
- **Bond EMAs**: Moderately conservative to balance discovery rewards with stability
  - **Basic Mode**: Fixed α for stability
  - **Liquid Alpha Mode**: Adaptive α - fast for consensus-aligned behavior, slow for outliers
- **Safety First**: Better to be slow and secure than fast and vulnerable

### Network Effects
- **Honest Behavior**: Rewards participants who provide consistent, long-term value
- **Attack Deterrence**: Makes manipulation expensive and ineffective
- **Economic Stability**: Prevents sudden shocks from destabilizing the network

## Technical Implementation

### Core EMA Functions

#### 1. Basic Matrix EMA (`mat_ema`)
**Location**: `subtensor/pallets/subtensor/src/epoch/math.rs:1338` <!-- ✅ VERIFIED -->

```rust
pub fn mat_ema(new: &[Vec<I32F32>], old: &[Vec<I32F32>], alpha: I32F32) -> Vec<Vec<I32F32>>
```

**Implementation Details**:
- **Fixed-Point Arithmetic**: Uses `I32F32` (32-bit signed fixed-point) for all calculations
- **Saturating Operations**: All arithmetic uses `saturating_mul()` and `saturating_add()` to prevent overflow
- **Formula**: `result = α × new + (1 - α) × old`
- **Functional Style**: Implemented using iterator chains for efficiency

**Key Code**:
```rust
let one_minus_alpha: I32F32 = I32F32::saturating_from_num(1.0).saturating_sub(alpha);
new.iter().zip(old).map(|(new_row, old_row)| {
    new_row.iter().zip(old_row).map(|(new_elem, old_elem)| {
        alpha.saturating_mul(*new_elem)
             .saturating_add(one_minus_alpha.saturating_mul(*old_elem))
    }).collect()
}).collect()
```

#### 2. Variable Alpha EMA (`mat_ema_alpha`)
**Location**: `subtensor/pallets/subtensor/src/epoch/math.rs:1454` <!-- ✅ VERIFIED -->

```rust
pub fn mat_ema_alpha(new: &[Vec<I32F32>], old: &[Vec<I32F32>], alpha: &[Vec<I32F32>]) -> Vec<Vec<I32F32>>
```

**Advanced Implementation Features**:
- **Per-Element Alpha**: Each validator-miner pair has its own alpha value
- **Bond Decay Model**: Implements `Bonds_decayed = Bonds × (1 - α)` <!-- ✅ VERIFIED: Line 1490 -->
- **Purchase Increment**: `purchase_increment = α × new_weight` with minimum zero constraint <!-- ✅ VERIFIED: Line 1494 -->
- **Capped Bonds**: Final result clamped to maximum of 1.0 <!-- ✅ VERIFIED: Line 1495 -->

**Key Implementation**:
```rust
// Calculate the complement of the alpha value
let one_minus_alpha = one.saturating_sub(*alpha_val);

// Bonds_decayed = Bonds * (1 - alpha)  
let decayed_val = one_minus_alpha.saturating_mul(*old_val);

// Each validator can increase bonds by at most clamped_alpha per epoch towards the cap
let purchase_increment = alpha_val.saturating_mul(*new_val).max(zero);
let result_val = decayed_val.saturating_add(purchase_increment).min(one);
```

#### 3. Sparse Matrix EMA (`mat_ema_sparse`)
**Location**: `subtensor/pallets/subtensor/src/epoch/math.rs:1366` <!-- ✅ VERIFIED -->

**Optimization Features**:
- **Memory Efficiency**: Stores only non-zero values as `(index, value)` pairs
- **Sparse-to-Dense Conversion**: Temporary dense conversion for EMA calculation
- **Zero Filtering**: Removes zero values from final sparse representation

### Alpha Calculation Mechanisms

#### 1. Basic Bond Alpha Calculation
**Location**: `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:1365` <!-- ✅ VERIFIED -->

```rust
pub fn compute_disabled_liquid_alpha(netuid: NetUid) -> I32F32 {
    // Scale down bonds_moving_average by 1,000,000
    let bonds_moving_average: I64F64 = I64F64::from_num(Self::get_bonds_moving_average(netuid))
        .saturating_div(I64F64::from_num(1_000_000));
    
    // Alpha = 1 - bonds_moving_average
    let alpha: I32F32 = I32F32::from_num(1)
        .saturating_sub(I32F32::from_num(bonds_moving_average));
    alpha
}
```

**Precision Details**:
- **Scaling Factor**: `bonds_moving_average` divided by 1,000,000 for decimal precision
- **Default**: 900,000 → 0.9 → α = 0.1
- **Type Conversion**: `I64F64` for intermediate precision, `I32F32` for final result

#### 2. Liquid Alpha Sigmoid Calculation
**Location**: `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:1336` <!-- ✅ VERIFIED -->

```rust
pub fn alpha_sigmoid(
    consensus: I32F32, weight: I32F32, bond: I32F32,
    alpha_low: I32F32, alpha_high: I32F32, alpha_sigmoid_steepness: I32F32
) -> I32F32
```

**Sophisticated Logic**:
- **Diff Calculation**: 
  - `diff_buy = clamp(weight - consensus, 0, 1)` (buying above consensus)
  - `diff_sell = clamp(bond - weight, 0, 1)` (selling below weight)
  - `combined_diff = weight >= bond ? diff_buy : diff_sell`

- **Sigmoid Function**: 
  ```rust
  sigmoid = 1.0 / (1.0 + e^(-steepness/100 * (combined_diff - 0.5)))
  α = α_low + sigmoid × (α_high - α_low)
  ```

- **Steepness Scaling**: Steepness divided by -100 for numerical stability <!-- ✅ VERIFIED: Line 1355 -->

### Bonds Penalty Integration
**Location**: `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:214-219` <!-- ✅ VERIFIED -->

**Preprocessing Step**:
```rust
let bonds_penalty: I32F32 = Self::get_float_bonds_penalty(netuid);
// bonds_penalty = 0: weights_for_bonds = weights.clone()
// bonds_penalty = 1: weights_for_bonds = clipped_weights.clone()  
let weights_for_bonds: Vec<Vec<I32F32>> = interpolate(&weights, &clipped_weights, bonds_penalty);
```

**Purpose**: 
- **Consensus Enforcement**: Higher penalty uses more consensus-clipped weights
- **Interpolation**: `weights_for_bonds = (1-β) × weights + β × clipped_weights`
- **Range**: β ∈ [0,1] where 0 = no penalty, 1 = full consensus enforcement

### Price EMA Implementation
**Location**: `subtensor/pallets/subtensor/src/staking/stake_utils.rs:37` <!-- ✅ VERIFIED -->

**Dynamic Alpha Formula**:
```rust
let blocks_since_start_call = current_block - start_call_block;
let halving_time = EMAPriceHalvingBlocks::get(netuid); // 201,600 blocks
let alpha: U96F32 = base_alpha × (blocks_since_start / (blocks_since_start + halving_time));

// EMA calculation
let current_price: U96F32 = alpha × current_alpha_price;
let current_moving: U96F32 = (1 - alpha) × previous_moving_price;  
let new_moving = current_price + current_moving;
```

**Timing Behavior**:
- **New Subnets**: α approaches 0 (extremely slow)
- **Mature Subnets**: α approaches `base_alpha` (0.000003)
- **Halving Time**: 201,600 blocks for α to reach 50% of maximum

### Fixed-Point Arithmetic Details

#### Precision Types
- **`I32F32`**: 32-bit signed fixed-point (16.16 format)
- **`I64F64`**: 64-bit signed fixed-point (32.32 format) 
- **`U96F32`**: 96-bit unsigned fixed-point for price calculations

#### Saturation Guarantees
- **`saturating_mul()`**: Prevents overflow by clamping to type limits
- **`saturating_add()`**: Prevents overflow in addition operations
- **`saturating_sub()`**: Prevents underflow in subtraction operations

#### Conversion Patterns
```rust
// u64 to fixed-point with scaling
I64F64::from_num(value).saturating_div(I64F64::from_num(1_000_000))

// Fixed-point precision preservation  
I32F32::saturating_from_num(I64F64_value)

// Floating-point to fixed-point
I32F32::saturating_from_num(0.5_f64)
```

### Error Handling and Edge Cases

#### Matrix Dimension Validation
```rust
assert!(new.len() == old.len());
assert!(new.len() == alpha.len());
assert!(new_row.len() == old_row.len());
```

#### Empty Matrix Handling
```rust
if new.is_empty() || new.first().is_none_or(|row| row.is_empty()) {
    return vec![vec![]; 1];
}
```

#### Bounds Enforcement
- **Alpha Clamping**: `clamp_value(alpha, alpha_low, alpha_high)`
- **Bond Capping**: Final bond values clamped to [0, 1]
- **Consensus Limits**: Weights clipped at consensus thresholds before EMA

### Performance Optimizations

#### Sparse Matrix Efficiency
- **Memory Usage**: Only stores non-zero bond values
- **Computational Complexity**: O(nnz) instead of O(n²) for sparse operations
- **Cache Efficiency**: Better memory locality for large, sparse networks

#### Iterator Chains
- **Functional Programming**: Rust iterator chains for CPU optimization
- **Zero-Copy**: In-place operations where possible
- **SIMD Potential**: Fixed-point operations suitable for vectorization

### Configuration Parameters
- **`BondsMovingAverage`**: Controls bond EMA responsiveness (default: 900,000) <!-- ✅ VERIFIED: SubtensorInitialBondsMovingAverage = 900,000 (see subtensor/runtime/src/lib.rs:1170) -->
- **`EMAPriceHalvingBlocks`**: Controls price EMA timing (default: 201,600 blocks) <!-- ✅ VERIFIED: InitialEmaPriceHalvingPeriod = 201,600 (see subtensor/runtime/src/lib.rs:1207) -->
- **`SubnetMovingAlpha`**: Base parameter for price calculations <!-- ✅ VERIFIED: DefaultMovingAlpha = 0.000003 (see subtensor/pallets/subtensor/src/lib.rs:831) -->
- **`AlphaValues`**: Sets α_low and α_high for liquid alpha (default: [0.7, 0.9]) <!-- ✅ VERIFIED: DefaultAlphaValues = (45875, 58982) ≈ (0.7, 0.9) (see subtensor/pallets/subtensor/src/lib.rs:783-784) -->
- **`LiquidAlphaOn`**: Enables/disables consensus-based weights (default: false) <!-- ✅ VERIFIED: DefaultLiquidAlpha = false (see subtensor/pallets/subtensor/src/lib.rs:772) -->

### Governance
Network governance can adjust EMA parameters through administrative calls, allowing the network to adapt its stability characteristics as it evolves.

## Security Implications

EMAs are not just mathematical conveniences—they're active security measures:

### Attack Vectors Prevented
1. **Bond Manipulation**: Prevents validators from suddenly redirecting all bonds to colluding miners
2. **Price Gaming**: Makes pump-and-dump schemes economically infeasible
3. **Coalition Attacks**: Limits the speed at which coordinated groups can extract value
4. **Market Volatility**: Protects against natural market fluctuations destabilizing incentives
5. **Consensus Gaming**: Liquid alpha penalizes validators who consistently deviate from consensus
6. **Weight Copying**: Dynamic alpha rewards original evaluation over copying behavior

### Trade-offs
- **Discovery Lag**: Genuinely valuable new miners take time to receive full recognition
- **Price Response**: Legitimate price changes take months to fully reflect in emissions
- **Complexity**: Adds mathematical complexity to economic calculations

## Conclusion

Exponential Moving Averages in Bittensor represent a sophisticated approach to balancing competing demands:
- **Security vs. Responsiveness**: EMAs provide security while maintaining some adaptability
- **Stability vs. Discovery**: Bond EMAs reward early discovery while preventing manipulation
- **Fairness vs. Efficiency**: Price EMAs ensure fair emission distribution despite market volatility
- **Consensus vs. Innovation**: Liquid alpha rewards consensus alignment while still enabling discovery

Understanding EMAs is crucial for anyone participating in Bittensor's ecosystem, as they fundamentally shape how value flows through the network and how the system responds to both honest behavior and malicious attacks. The conservative parameters reflect Bittensor's commitment to long-term sustainability over short-term optimization.
