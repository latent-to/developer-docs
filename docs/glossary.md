---
title: "Glossary"
---

# Glossary

## A 

### Active UID

A UID slot that is considered active within a specific subnet, allowing the associated hotkey to participate as a subnet validator or subnet miner.

**See also:** [Subnet Miners](./miners/), [Subnet Validators](./validators/)

### Archive Node

A type of public subtensor node that stores the entire blockchain history, allowing for full data access and querying capabilities.

**See also:** [Subtensor Nodes](./subtensor-nodes/), [Managing Subtensor Connections](./sdk/managing-subtensor-connections.md)

### Axon

A module in the Bittensor API that uses the FastAPI library to create and run API servers. Axons receive incoming Synapse objects. Typically, an Axon is the entry point advertised by a subnet miner on the Bittensor blockchain, allowing subnet validators to communicate with the miner.

**See also:** [Subnet Miners](./miners/), [Subnet Validators](./validators/)

## B

### Bicameral Legislature

A two-tier legislative system comprising the Triumvirate and the Senate for proposal approval.

**See also:** [Governance](./governance.md), [Senate](./senate.md)

### Bittensor Wallet

A digital wallet that holds the core ownership in the Bittensor network and serves as the user's identity technology underlying all operations.

**See also:** [Wallets](./getting-started/wallets.md), [Working with Keys](./working-with-keys.md)

### Block

A unit of data in the Bittensor blockchain, containing a collection of transactions and a unique identifier (block hash). A single block is processed every 12 seconds in the Bittensor blockchain. 

**See also:** [Subtensor API](./sdk/subtensor-api.md)

## C

### Coldkey

A component of a Bittensor wallet responsible for securely storing funds and performing high-risk operations such as transfers and staking. It is encrypted on the user's device. This is analogous to a private key.

**See also:** [Coldkey-Hotkey Security](./getting-started/coldkey-hotkey-security.md), [Working with Keys](./working-with-keys.md)

### Coldkey-hotkey pair

A combination of two keys, a coldkey for secure storage and high-risk operations, and a hotkey for less secure operations and network interactions.

**See also:** [Coldkey-Hotkey Security](./getting-started/coldkey-hotkey-security.md), [Working with Keys](./working-with-keys.md)

### Commit Reveal

The commit reveal feature is designed to solve the weight-copying problem by giving would-be weight-copiers access only to stale weights. Copying stale weights should result in validators departing from consensus.

**See also:** [Commit Reveal](./subnets/commit-reveal.md)

Code References and Implementation Details

**Commit Reveal as Anti-Weight-Copying Mechanism:**
- Commit reveal prevents weight copying by introducing a time delay between weight commitment and revelation
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:41` - `do_commit_weights()` implementation
- Validators commit to weights without revealing them immediately, creating a temporal offset
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:74` - Weight commit storage in `WeightCommits<T>`
- The mechanism ensures that copied weights are stale by the time they can be used
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1075` - `get_reveal_blocks()` timing calculation

**Core Storage and Configuration:**

**Commit Reveal Enablement:**
- Commit reveal is controlled per subnet via `CommitRevealWeightsEnabled` storage
  - `subtensor/pallets/subtensor/src/lib.rs:1430` - `pub type CommitRevealWeightsEnabled<T> = StorageMap<_, Identity, u16, bool, ValueQuery, DefaultCommitRevealWeightsEnabled<T>>;`
- Enablement can be toggled by subnet owners or root
  - `subtensor/pallets/subtensor/src/utils/misc.rs:472-477` - `get_commit_reveal_weights_enabled()` and `set_commit_reveal_weights_enabled()`

**Weight Commit Storage:**
- **WeightCommits**: Stores commit hashes and timing information for each validator
  - `subtensor/pallets/subtensor/src/lib.rs:1662-1669` - `pub type WeightCommits<T: Config> = StorageDoubleMap<_, Twox64Concat, u16, Twox64Concat, T::AccountId, VecDeque<(H256, u64, u64, u64)>, OptionQuery>;`
- **CRV3WeightCommits**: Stores v3 encrypted commits with epoch-based organization
  - `subtensor/pallets/subtensor/src/lib.rs:1671-1680` - `pub type CRV3WeightCommits<T: Config> = StorageDoubleMap<_, Twox64Concat, u16, Twox64Concat, u64, VecDeque<(T::AccountId, BoundedVec<u8, ConstU32<MAX_CRV3_COMMIT_SIZE_BYTES>>, RoundNumber)>, ValueQuery>;`
- **RevealPeriodEpochs**: Configurable reveal period per subnet
  - `subtensor/pallets/subtensor/src/lib.rs:1682-1684` - `pub type RevealPeriodEpochs<T: Config> = StorageMap<_, Twox64Concat, u16, u64, ValueQuery, DefaultRevealPeriodEpochs<T>>;`

**Commit Phase Implementation:**

**Commit Hash Generation:**
- Commit hash is generated from validator data using BlakeTwo256
  - `subtensor/pallets/subtensor/src/tests/weights.rs:1520` - `let commit_hash: H256 = BlakeTwo256::hash_of(&(hotkey, netuid, uids.clone(), weight_values.clone(), salt.clone(), version_key));`
- Hash includes: hotkey, netuid, uids, weight_values, salt, and version_key
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:74` - Commit storage with hash and timing information

**Commit Validation:**
- **Enablement Check**: Ensures commit-reveal is enabled for the subnet
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:52` - `ensure!(Self::get_commit_reveal_weights_enabled(netuid), Error::<T>::CommitRevealDisabled);`
- **Registration Check**: Validates hotkey is registered on the network
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:56-59` - `ensure!(Self::is_hotkey_registered_on_network(netuid, &who), Error::<T>::HotKeyNotRegisteredInSubNet);`
- **Rate Limiting**: Prevents excessive commit frequency
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:61-66` - Rate limit check via `check_rate_limit()`

**Reveal Timing Calculation:**

**Epoch-Based Timing:**
- **Epoch Calculation**: Epochs are calculated based on tempo and netuid offset
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1040-1047` - `get_epoch_index()` implementation
- **Reveal Period**: Configurable number of epochs between commit and reveal
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1095-1097` - `get_reveal_period()` and `set_reveal_period()`

**Reveal Block Range:**
- **First Reveal Block**: Calculated from commit epoch + reveal period
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1075-1085` - `get_reveal_blocks()` implementation
- **Last Reveal Block**: First reveal block + tempo (one epoch duration)
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1086-1087` - `let last_reveal_block = first_reveal_block.saturating_add(tempo);`

**Reveal Phase Implementation:**

**Reveal Validation:**
- **Enablement Check**: Ensures commit-reveal is still enabled
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:353` - `ensure!(Self::get_commit_reveal_weights_enabled(netuid), Error::<T>::CommitRevealDisabled);`
- **Hash Verification**: Validates revealed data matches committed hash
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:396-396` - Hash matching in reveal validation
- **Timing Validation**: Ensures reveal occurs within valid time window
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1020-1027` - `is_reveal_block_range()` implementation

**Reveal Timing Checks:**
- **Too Early**: Reveal attempted before valid reveal period
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1020-1027` - `is_reveal_block_range()` check
- **Expired**: Commit has expired beyond reveal period
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1029-1035` - `is_commit_expired()` implementation
- **Valid Window**: Reveal must occur exactly at `commit_epoch + reveal_period`

**Commit Expiration and Cleanup:**

**Expiration Logic:**
- **Expiration Check**: Commits expire after reveal period + 1 epoch
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1029-1035` - `is_commit_expired()` function
- **Automatic Cleanup**: Expired commits are removed during reveal operations
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:512-520` - Expired commit removal in batch reveal

**Queue Management:**
- **FIFO Processing**: Commits are processed in first-in-first-out order
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:74` - `VecDeque<(H256, u64, u64, u64)>` storage
- **Commit Removal**: Revealed commits are removed from the queue
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:410-415` - Commit removal after successful reveal

**Security Properties:**

**Anti-Weight-Copying:**
- **Temporal Offset**: Time delay prevents immediate weight copying
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1075` - Reveal timing calculation
- **Stale Data**: Copied weights become irrelevant due to network changes
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1029-1035` - Commit expiration mechanism
- **Hash Verification**: Cryptographic commitment prevents manipulation
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:396` - Hash verification in reveal

**Rate Limiting:**
- **Commit Rate Limit**: Prevents excessive commit frequency
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:61-66` - Rate limit validation
- **Reveal Timing**: Strict timing windows prevent timing attacks
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1020-1027` - Reveal timing validation

**Testing and Validation:**

**Comprehensive Test Coverage:**
- **Basic Functionality**: Tests verify commit and reveal workflow
  - `subtensor/pallets/subtensor/src/tests/weights.rs:1502-1559` - `test_reveal_weights_when_commit_reveal_disabled()`
- **Timing Validation**: Tests verify reveal timing constraints
  - `subtensor/pallets/subtensor/src/tests/weights.rs:1663-1750` - Timing validation tests
- **Hash Verification**: Tests verify cryptographic commitment integrity
  - `subtensor/pallets/subtensor/src/tests/weights.rs:1750-1831` - `test_commit_reveal_hash()`

**Error Handling:**
- **CommitRevealDisabled**: Attempting operations when disabled
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:52` - Enablement check
- **RevealTooEarly**: Reveal attempted before valid window
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1020-1027` - Timing validation
- **ExpiredWeightCommit**: Reveal attempted after expiration
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1029-1035` - Expiration check
- **InvalidRevealCommitHashNotMatch**: Hash verification failure
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:396` - Hash matching

**Network Configuration:**

**Subnet-Level Settings:**
- **Enablement**: Per-subnet commit reveal toggle
  - `subtensor/pallets/subtensor/src/utils/misc.rs:472-477` - Enablement functions
- **Reveal Period**: Configurable epochs between commit and reveal
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:1095-1097` - Reveal period configuration
- **Rate Limits**: Commit frequency restrictions
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:61-66` - Rate limiting

**Default Values:**
- **DefaultCommitRevealWeightsEnabled**: Defaults to false (disabled)
  - `subtensor/pallets/subtensor/src/lib.rs:799` - `pub fn DefaultCommitRevealWeightsEnabled<T: Config>() -> bool { false }`
- **DefaultRevealPeriodEpochs**: Default reveal period configuration
  - `subtensor/pallets/subtensor/src/lib.rs:735` - `pub fn DefaultRevealPeriodEpochs<T: Config>() -> u64 { 1 }`

**Key Mathematical Insights:**
1. **Commit Hash = BlakeTwo256(hotkey, netuid, uids, weights, salt, version_key)**: Cryptographic commitment
2. **Reveal Epoch = Commit Epoch + Reveal Period**: Timing calculation
3. **Reveal Block Range = [first_reveal_block, last_reveal_block]**: Valid reveal window
4. **Expiration = Current Epoch > Commit Epoch + Reveal Period + 1**: Automatic cleanup
5. **Temporal Offset = Reveal Period × Tempo**: Anti-copying delay

**Network Security Implications:**
- **Weight Copying Prevention**: Temporal offset makes copied weights stale
- **Consensus Stability**: Prevents rapid weight manipulation
- **Validator Commitment**: Requires validators to commit to their assessments
- **Network Decentralization**: Reduces influence of weight-copying validators
- **Dynamic Adaptation**: Network changes make stale weights irrelevant

**Complete Commit Reveal Flow:**
1. **Configuration** → Subnet enables commit reveal and sets reveal period
2. **Commit Phase** → Validator commits hash of weights without revealing them
3. **Temporal Offset** → Network progresses for reveal_period epochs
4. **Reveal Window** → Validator reveals weights within valid time window
5. **Hash Verification** → System verifies revealed data matches commit hash
6. **Weight Application** → Verified weights are applied to consensus
7. **Cleanup** → Expired commits are automatically removed

**Commit Reveal vs Traditional Weight Setting:**
- **Traditional**: Immediate weight setting and consensus participation
- **Commit Reveal**: Delayed weight revelation with temporal offset
- **Security**: Commit reveal prevents weight copying and manipulation
- **Complexity**: Additional timing and hash verification requirements
- **Flexibility**: Configurable per subnet based on security needs

### Consensus

A measure of a subnet validator's agreement with other validators on the network, calculated based on their trust scores. This is a $\kappa$-centered sigmoid of trust, influencing the emission calculation.

**See also:** [Yuma Consensus](./yuma-consensus.md), [Consensus-Based Weights](./subnets/consensus-based-weights.md)

## D

### Delegate

A subnet validator that receives staked TAO tokens from delegators and performs validation tasks in one or more subnets.

**See also:** [Delegation](./staking-and-delegation/delegation.md), [Managing Stake with btcli](./staking-and-delegation/managing-stake-btcli.md)

### Delegate Stake

The amount of TAO staked by the delegate themselves.

**See also:** [Managing Stake with btcli](./staking-and-delegation/managing-stake-btcli.md), [Managing Stake with SDK](./staking-and-delegation/managing-stake-sdk.md)

### Validator Take %

The percentage of emissions a validator takes, of the portion that depends on delegated stake (not including their emissions in proportion to their own self-stake), before the remainder is extracted back to the stakers.

**See also:** [Emissions](./emissions.md)

Code References and Implementation Details

**Validator Take as Delegation Fee:**
- Validator take represents the fee percentage that validators charge delegators for validation services
  - `subtensor/pallets/subtensor/src/lib.rs:992-994` - `pub type Delegates<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, u16, ValueQuery, DefaultDelegateTake<T>>;`
- Take is stored as a u16 value representing percentage of u16::MAX (65,535)
  - `subtensor/pallets/subtensor/src/tests/mock.rs:168` - `pub const InitialDefaultDelegateTake: u16 = 11_796; // 18%`
- Default take is 18% (11,796/65,535), with configurable min/max bounds
  - `subtensor/pallets/subtensor/src/lib.rs:382` - `T::InitialDefaultDelegateTake::get()`

**Storage and Configuration:**

**Core Storage Implementation:**
- **Delegates Storage**: Maps hotkey to take value in blockchain state
  - `subtensor/pallets/subtensor/src/lib.rs:992-994` - `pub type Delegates<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, u16, ValueQuery, DefaultDelegateTake<T>>;`
- **Default Values**: Network-wide configuration for take limits
  - `subtensor/pallets/subtensor/src/lib.rs:382` - `DefaultDelegateTake<T>()` - Default 18%
  - `subtensor/pallets/subtensor/src/lib.rs:393` - `DefaultMinDelegateTake<T>()` - Minimum 9%
  - `subtensor/pallets/subtensor/src/lib.rs:977` - `MaxDelegateTake<T>` - Maximum 18%

**Take Management Functions:**

**Increase Take Implementation:**
- **Rate Limiting**: Prevents rapid take increases to maintain network stability
  - `subtensor/pallets/subtensor/src/staking/increase_take.rs:55-62` - Rate limit validation
- **Strict Increase**: Take can only be increased, never decreased via this function
  - `subtensor/pallets/subtensor/src/staking/increase_take.rs:50-52` - `ensure!(take > current_take, Error::<T>::DelegateTakeTooLow);`
- **Max Bound Check**: Take cannot exceed network maximum (18%)
  - `subtensor/pallets/subtensor/src/staking/increase_take.rs:55-56` - `ensure!(take <= max_take, Error::<T>::DelegateTakeTooHigh);`

**Decrease Take Implementation:**
- **Rate Limiting**: Prevents rapid take decreases
  - `subtensor/pallets/subtensor/src/staking/decrease_take.rs:45-50` - Rate limit validation
- **Strict Decrease**: Take can only be decreased, never increased via this function
  - `subtensor/pallets/subtensor/src/staking/decrease_take.rs:48-50` - `ensure!(take < current_take, Error::<T>::DelegateTakeTooLow);`
- **Min Bound Check**: Take cannot fall below network minimum (9%)
  - `subtensor/pallets/subtensor/src/staking/decrease_take.rs:52-53` - `ensure!(take >= min_take, Error::<T>::DelegateTakeTooLow);`

**Emission Calculation Formula:**

**Return Per 1000 TAO Calculation:**
- **Mathematical Formula**: `return_per_1000 = (emissions_per_day * (1 - take_percentage)) / (total_stake / 1000)`
  - `subtensor/pallets/subtensor/src/rpc_info/delegate_info.rs:23-40` - `return_per_1000_tao()` implementation
- **Take Percentage Conversion**: `take_percentage = take_value / u16::MAX`
  - `subtensor/pallets/subtensor/src/rpc_info/delegate_info.rs:28-29` - Take to percentage conversion
- **Delegator Return**: Delegators receive `(1 - take_percentage)` of validator emissions
  - `subtensor/pallets/subtensor/src/rpc_info/delegate_info.rs:30-35` - Delegator return calculation

**Emission Distribution Logic:**

**Validator vs Delegator Emissions:**
- **Validator Self-Stake**: Validator keeps 100% of emissions from their own stake
  - `developer-docs/docs/staking-and-delegation/delegation.md:73-121` - Emission distribution examples
- **Delegated Stake**: Validator takes percentage from delegated stake emissions
  - `subtensor/pallets/subtensor/src/rpc_info/delegate_info.rs:113` - Take application to delegated emissions
- **Delegator Proportional**: Delegators receive proportional shares of remaining emissions
  - `developer-docs/docs/staking-and-delegation/delegation.md:73-85` - Proportional distribution formula

**Example Calculation:**
- **Validator with 18% take**: Takes 18% of delegated stake emissions
- **Delegators receive**: 82% of delegated stake emissions
- **Total validator emissions**: 100% of self-stake + 18% of delegated stake
- **Mathematical representation**: `validator_total = self_stake_emissions + (delegated_stake_emissions * 0.18)`

**Rate Limiting and Security:**

**Transaction Rate Limits:**
- **Take Change Rate Limit**: Prevents rapid take manipulation
  - `subtensor/pallets/subtensor/src/staking/increase_take.rs:55-62` - Rate limit enforcement
- **Rate Limit Storage**: Tracks last take change timestamp per hotkey
  - `subtensor/pallets/subtensor/src/lib.rs:1656` - `LastTxBlockDelegateTake<T: Config>`
- **Rate Limit Configuration**: Network-wide rate limit parameter
  - `subtensor/pallets/subtensor/src/lib.rs:1473` - `TxDelegateTakeRateLimit<T>`

**Ownership Validation:**
- **Coldkey Verification**: Only hotkey owner can modify take
  - `subtensor/pallets/subtensor/src/staking/increase_take.rs:42` - `Self::do_take_checks(&coldkey, &hotkey)?;`
- **Registration Check**: Hotkey must be registered to set take
  - `subtensor/pallets/subtensor/src/staking/helpers.rs:15-20` - Registration validation

**Testing and Validation:**

**Return Calculation Testing:**
- **18% Take Test**: Verifies correct return calculation for 18% take
  - `subtensor/pallets/subtensor/src/tests/delegate_info.rs:9-37` - `test_return_per_1000_tao()`
- **Mathematical Verification**: Tests verify `return_per_1000 = 82` for 18% take with 10,000 TAO stake
  - `subtensor/pallets/subtensor/src/tests/delegate_info.rs:19-25` - Expected return calculation

**Take Management Testing:**
- **Increase Take Tests**: Verify take can be increased up to maximum
  - `subtensor/pallets/subtensor/src/tests/staking.rs:2761-2830` - Take increase validation
- **Decrease Take Tests**: Verify take can be decreased down to minimum
  - `subtensor/pallets/subtensor/src/tests/staking.rs:2830-2900` - Take decrease validation
- **Boundary Testing**: Tests verify min/max take enforcement
  - `subtensor/pallets/subtensor/src/tests/staking.rs:2786-2829` - Boundary condition tests

**Network Configuration:**

**Default Network Parameters:**
- **InitialDefaultDelegateTake**: 18% (11,796/65,535)
  - `subtensor/pallets/subtensor/src/tests/mock.rs:168` - Default take value
- **MinDelegateTake**: 9% (5,898/65,535) - Minimum allowed take
  - `subtensor/pallets/subtensor/src/lib.rs:393` - Minimum take configuration
- **MaxDelegateTake**: 18% (11,796/65,535) - Maximum allowed take
  - `subtensor/pallets/subtensor/src/lib.rs:977` - Maximum take configuration

**Rate Limit Configuration:**
- **TxDelegateTakeRateLimit**: Controls frequency of take changes
  - `subtensor/pallets/subtensor/src/lib.rs:1473` - Rate limit parameter
- **LastTxBlockDelegateTake**: Per-hotkey rate limit tracking
  - `subtensor/pallets/subtensor/src/lib.rs:1656` - Rate limit storage

**Key Mathematical Insights:**
1. **Take Percentage = take_value / u16::MAX**: Conversion from u16 to percentage
2. **Delegator Return = emissions * (1 - take_percentage)**: Delegator share calculation
3. **Validator Total = self_emissions + (delegated_emissions * take_percentage)**: Total validator earnings
4. **Return Per 1000 = (daily_emissions * (1 - take)) / (total_stake / 1000)**: Delegator return rate

**Network Security Properties:**
- **Economic Incentives**: Take creates market-driven validation fees
- **Rate Limiting**: Prevents take manipulation and network instability
- **Bounded Range**: Min/max limits prevent extreme take values
- **Ownership Control**: Only hotkey owners can modify their take
- **Transparent Calculation**: Clear mathematical formula for delegator returns

**Complete Validator Take Flow:**
1. **Registration** → Validator registers and sets initial take (18% default)
2. **Delegation** → Delegators stake to validator
3. **Emission Calculation** → Yuma Consensus calculates validator emissions
4. **Take Application** → Validator extracts take percentage from delegated emissions
5. **Distribution** → Remaining emissions distributed to delegators proportionally
6. **Take Management** → Validator can increase/decrease take within bounds
7. **Rate Limiting** → Changes rate-limited to prevent manipulation

**Validator Take vs Other Network Fees:**
- **Validator Take**: Fee for validation services (9-18%)
- **Staking Fee**: One-time fee for delegation (network parameter)
- **Registration Fee**: One-time fee for subnet registration
- **Childkey Take**: Fee for childkey delegation (separate parameter)
- **Network Owner Cut**: Subnet owner's share of emissions

**Economic Implications:**
- **Market Competition**: Validators compete on take rates and performance
- **Delegator Choice**: Delegators choose validators based on take and returns
- **Network Efficiency**: Take incentivizes quality validation services
- **Economic Security**: Take creates skin-in-the-game for validators
- **Dynamic Adjustment**: Take can be adjusted based on market conditions

**Python SDK Usage:**

**Setting Validator Take:**
- **Main Method**: `subtensor.set_delegate_take()` - Automatically chooses increase/decrease based on current value
  - `bittensor/bittensor/core/subtensor.py:3283-3366` - `set_delegate_take()` implementation
- **Direct Methods**: `increase_take_extrinsic()` and `decrease_take_extrinsic()` for specific operations
  - `bittensor/bittensor/core/extrinsics/take.py:1-110` - Direct extrinsic implementations
- **Async Support**: `async_subtensor.set_delegate_take()` for asynchronous operations
  - `bittensor/bittensor/core/async_subtensor.py:4537-4619` - Async implementation

**Basic Usage Example:**
```python
import bittensor as bt

# Initialize subtensor connection
subtensor = bt.subtensor()

# Create wallet (must own the hotkey)
wallet = bt.wallet()

# Set validator take to 15% (0.15)
success, message = subtensor.set_delegate_take(
    wallet=wallet,
    hotkey_ss58=wallet.hotkey.ss58_address,
    take=0.15,  # 15% take
    wait_for_inclusion=True,
    wait_for_finalization=True
)

if success:
    print(f"✅ Take updated successfully: {message}")
else:
    print(f"❌ Failed to update take: {message}")
```

**Getting Current Take:**
```python
# Get current take for a hotkey
current_take = subtensor.get_delegate_take(hotkey_ss58="5F...")
print(f"Current take: {current_take:.2%}")  # e.g., "Current take: 18.00%"
```

**Error Handling:**
- **DelegateTakeTooHigh**: Take exceeds maximum (18%)
  - `bittensor/bittensor/core/errors.py:63-67` - Error definition
- **DelegateTakeTooLow**: Take below minimum (9%) or invalid decrease
  - `bittensor/bittensor/core/errors.py:70-75` - Error definition
- **DelegateTxRateLimitExceeded**: Too frequent take changes
  - `bittensor/bittensor/core/errors.py:165-171` - Rate limit error
- **NonAssociatedColdKey**: Wallet doesn't own the hotkey
- **HotKeyAccountNotExists**: Hotkey not registered

**Advanced Usage:**
```python
# Async usage
async def update_validator_take():
    async with bt.subtensor() as subtensor:
        success, message = await subtensor.set_delegate_take(
            wallet=wallet,
            hotkey_ss58=wallet.hotkey.ss58_address,
            take=0.12,  # 12% take
            raise_error=True  # Raise exceptions instead of returning False
        )
        return success, message

# Direct extrinsic calls (for specific increase/decrease)
from bittensor.core.extrinsics.take import increase_take_extrinsic, decrease_take_extrinsic

# Force increase take
success, message = increase_take_extrinsic(
    subtensor=subtensor,
    wallet=wallet,
    hotkey_ss58=wallet.hotkey.ss58_address,
    take=13107,  # u16 value for ~20% (13107/65535)
    wait_for_inclusion=True
)
```

**Take Value Conversion:**
- **Float to u16**: `take_u16 = int(take_float * 0xFFFF)`
  - `bittensor/bittensor/core/subtensor.py:3330` - Conversion implementation
- **u16 to Float**: `take_float = take_u16 / 0xFFFF`
  - `bittensor/bittensor/core/subtensor.py:1117` - `u16_normalized_float()` usage
- **Example**: 18% = 0.18 * 65535 = 11,796 u16 value

**Testing Examples:**
- **E2E Tests**: `bittensor/tests/e2e_tests/test_delegate.py:84-170` - Comprehensive testing
- **Unit Tests**: `bittensor/tests/unit_tests/test_subtensor_extended.py:956-1002` - SDK method testing
- **Async Tests**: `bittensor/tests/unit_tests/test_async_subtensor.py:2692-2750` - Async method testing

### Delegation

Also known as staking, delegating TAO to a validator (who is thereby the delegate), increases the validator's stake and secure a validator permit.

**See also:** [Delegation](./staking-and-delegation/delegation.md), [Managing Stake with btcli](./staking-and-delegation/managing-stake-btcli.md)

### Dendrite  

A client instance used by subnet validators and subnet miners to transmit information to axons on subnet miners and subnet validators. Dendrites communicate with axons using the server-client (Axon-dendrite) protocol.

**See also:** [Subnet Miners](./miners/), [Subnet Validators](./validators/)

### Deregistration

The process of removing a subnet miner or a subnet validator from the subnet due to poor performance.

**See also:** [Miner Deregistration](./miners/#miner-deregistration), [Subnet Miners](./miners/)

## E 

### EdDSA Cryptographic Keypairs

A cryptographic algorithm used to generate public and private key pairs for coldkeys and hotkeys in the Bittensor wallet.

**See also:** [Working with Keys](./working-with-keys.md), [Coldkey-Hotkey Security](./getting-started/coldkey-hotkey-security.md)

### Effective stake

The total staked TAO amount of a delegate, including their own TAO tokens and those delegated by nominators.

**See also:** [Managing Stake with btcli](./staking-and-delegation/managing-stake-btcli.md), [Managing Stake with SDK](./staking-and-delegation/managing-stake-sdk.md)

### Emission

Every block, currency is injected into each subnet in Bittensor, and every tempo (or 360 blocks), it is extracted by participants (miners, validators, stakers, and subnet creators).

Emission is this process of generating and allocating currency to participants. The amount allocated to a given participant over some duration of time is also often referred to as 'their emissions' for the period.

**See also:** [Emissions](./emissions.md)

### Encrypting the Hotkey

An optional security measure for the hotkey.

**See also:** [Coldkey-Hotkey Security](./getting-started/coldkey-hotkey-security.md), [Working with Keys](./working-with-keys.md)

### External Wallet

A Bittensor wallet created through the Bittensor website or using a tool like [subkey](https://docs.substrate.io/reference/command-line-tools/subkey/), allowing users to use TAO without installing Bittensor.

**See also:** [Wallets](./getting-started/wallets.md), [Installation](./getting-started/installation.md)

## H 

### Hotkey

A component of a Bittensor wallet responsible for less secure operations such as signing messages into the network, secure a UID slot in a subnet, running subnet miners and subnet validators in a subnet. It can be encrypted or unencrypted, but is unencrypted by default. The terms "account" and "hotkey" are used synonymously.

**See also:** [Coldkey-Hotkey Security](./getting-started/coldkey-hotkey-security.md), [Working with Keys](./working-with-keys.md)

### Hotkey-Coldkey Pair

Authentication mechanism for delegates and nominators and for delegates participating in the Senate.

**See also:** [Coldkey-Hotkey Security](./getting-started/coldkey-hotkey-security.md), [Working with Keys](./working-with-keys.md)

## I 

### Immunity Period

A grace period granted to a newly registered subnet miner or subnet validator, during which they will not be deregistered due to performance. Allows a miner or validator new to the subnet to adapt and improve their performance, in order to avoid deregistration once the immunity period expires.

**See also:** [Subnet Miners](./miners/), [Subnet Validators](./validators/)

Code References and Implementation Details

**Immunity Period as Protection Mechanism:**
- Immunity period provides a grace period for new neurons to establish themselves without immediate deregistration risk
  - `subtensor/pallets/subtensor/src/utils/misc.rs:442-448` - `get_neuron_is_immune()` implementation
- Immunity status is calculated dynamically based on registration block and current block
  - `subtensor/pallets/subtensor/src/utils/misc.rs:442-448` - `current_block.saturating_sub(registered_at) < u64::from(immunity_period)`
- Immunity period is configurable per subnet and can be adjusted by subnet owners
  - `subtensor/pallets/subtensor/src/lib.rs:1369-1371` - `pub type ImmunityPeriod<T> = StorageMap<_, Identity, u16, u16, ValueQuery, DefaultImmunityPeriod<T>>;`

**Storage and Configuration:**

**Core Storage Implementation:**
- **ImmunityPeriod Storage**: Maps netuid to immunity period value in blockchain state
  - `subtensor/pallets/subtensor/src/lib.rs:1369-1371` - `pub type ImmunityPeriod<T> = StorageMap<_, Identity, u16, u16, ValueQuery, DefaultImmunityPeriod<T>>;`
- **Default Values**: Network-wide configuration for immunity period
  - `subtensor/pallets/subtensor/src/lib.rs:660-662` - `DefaultImmunityPeriod<T>()` - Default 4096 blocks
  - `subtensor/runtime/src/lib.rs:1077` - `pub const SubtensorInitialImmunityPeriod: u16 = 4096;`
- **BlockAtRegistration Storage**: Tracks registration block for each neuron
  - `subtensor/pallets/subtensor/src/lib.rs:1580-1588` - `pub type BlockAtRegistration<T: Config> = StorageDoubleMap<_, Identity, u16, Identity, u16, u64, ValueQuery, DefaultBlockAtRegistration<T>>;`

**Immunity Status Calculation:**

**Dynamic Immunity Check:**
- **Registration Block Retrieval**: Gets the block number when neuron was registered
  - `subtensor/pallets/subtensor/src/utils/misc.rs:442-448` - `let registered_at = Self::get_neuron_block_at_registration(netuid, uid);`
- **Current Block Retrieval**: Gets the current blockchain block number
  - `subtensor/pallets/subtensor/src/utils/misc.rs:442-448` - `let current_block = Self::get_current_block_as_u64();`
- **Immunity Period Retrieval**: Gets the configured immunity period for the subnet
  - `subtensor/pallets/subtensor/src/utils/misc.rs:442-448` - `let immunity_period = Self::get_immunity_period(netuid);`
- **Immunity Formula**: `is_immune = (current_block - registered_at) < immunity_period`
  - `subtensor/pallets/subtensor/src/utils/misc.rs:442-448` - `current_block.saturating_sub(registered_at) < u64::from(immunity_period)`

**Pruning Algorithm Integration:**

**Pruning Score Calculation:**
- **Score-Based Selection**: Neuron with lowest pruning score is selected for replacement
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:409-485` - `get_neuron_to_prune()` implementation
- **Immunity Priority**: Non-immune neurons are prioritized over immune neurons for pruning
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:439-485` - Immunity status check in pruning algorithm
- **Tie-Breaking**: When scores are equal, earliest registered neuron is pruned
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:440-485` - Registration time tie-breaking

**Pruning Algorithm Logic:**

**Two-Tier Selection Process:**
- **Non-Immune Neurons**: First priority for pruning when available
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:454-465` - Non-immune neuron selection logic
- **Immune Neurons**: Second priority, only pruned when all neurons are immune
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:440-453` - Immune neuron selection logic
- **Owner Protection**: Subnet owner hotkey is protected from pruning regardless of immunity status
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:425-433` - Owner protection check

**Score Comparison Logic:**
- **Lower Score Priority**: Neurons with lower pruning scores are selected first
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:440-485` - Score comparison in pruning algorithm
- **Registration Time Tie-Breaking**: When scores are equal, earlier registration wins
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:440-485` - Registration time comparison
- **UID Tie-Breaking**: When registration times are equal, lower UID wins
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:440-485` - UID-based tie-breaking

**Registration Process Integration:**

**Registration Block Recording:**
- **Block Storage**: Registration block is recorded when neuron is registered
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:214-339` - Registration block storage in `do_registration()`
- **Timestamp Tracking**: Each neuron's registration time is tracked for immunity calculation
  - `subtensor/pallets/subtensor/src/lib.rs:1580-1588` - `BlockAtRegistration` storage definition
- **Dynamic Updates**: Immunity status updates automatically as blocks progress

**Registration Methods:**
- **Proof-of-Work Registration**: Traditional registration with block recording
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:214-339` - `do_registration()` implementation
- **Burned Registration**: Registration by burning TAO with block recording
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:54-206` - `do_burned_registration()` implementation

**Python SDK Integration:**

**Immunity Period Retrieval:**
- **Synchronous Method**: `subtensor.immunity_period()` retrieves immunity period for subnet
  - `bittensor/bittensor/core/subtensor.py:1998-2025` - `immunity_period()` implementation
- **Asynchronous Method**: `async_subtensor.immunity_period()` for async operations
  - `bittensor/bittensor/core/async_subtensor.py:2931-2970` - Async `immunity_period()` implementation
- **Block-Specific Queries**: Immunity period can be queried at specific block numbers
  - `bittensor/bittensor/core/subtensor.py:1998-2025` - Block parameter support

**Testing and Validation:**

**Comprehensive Test Coverage:**
- **Immunity Status Testing**: Tests verify correct immunity calculation
  - `subtensor/pallets/subtensor/src/tests/registration.rs:621-675` - Immunity status validation tests
- **Pruning Algorithm Testing**: Tests verify immunity-aware pruning
  - `subtensor/pallets/subtensor/src/tests/registration.rs:583-701` - Pruning algorithm tests
- **Edge Case Testing**: Tests verify behavior when all neurons are immune
  - `subtensor/pallets/subtensor/src/tests/registration.rs:1261-1311` - All-immune scenarios

**Test Scenarios:**
- **Mixed Immunity**: Tests with both immune and non-immune neurons
  - `subtensor/pallets/subtensor/src/tests/registration.rs:583-701` - Mixed immunity test scenarios
- **All Immune**: Tests when all neurons are in immunity period
  - `subtensor/pallets/subtensor/src/tests/registration.rs:1261-1311` - All-immune test scenarios
- **Tie-Breaking**: Tests for score and registration time tie-breaking
  - `subtensor/pallets/subtensor/src/tests/registration.rs:583-701` - Tie-breaking validation

**Network Configuration:**

**Default Network Parameters:**
- **SubtensorInitialImmunityPeriod**: 4096 blocks (default for mainnet)
  - `subtensor/runtime/src/lib.rs:1077` - Default immunity period value
- **Test Immunity Period**: 2 blocks (for testing environments)
  - `subtensor/pallets/subtensor/src/tests/mock.rs:161` - Test immunity period value
- **Subnet-Specific**: Each subnet can have different immunity periods
  - `subtensor/pallets/subtensor/src/lib.rs:1369-1371` - Per-subnet immunity period storage

**Configuration Management:**
- **Subnet Owner Control**: Subnet owners can adjust immunity period
  - `subtensor/pallets/subtensor/src/utils/misc.rs:442-448` - Immunity period management functions
- **Dynamic Adjustment**: Immunity period can be changed during subnet operation
  - `subtensor/pallets/subtensor/src/utils/misc.rs:442-448` - `set_immunity_period()` function
- **Event Emission**: Immunity period changes emit blockchain events
  - `subtensor/pallets/subtensor/src/utils/misc.rs:442-448` - Event emission for immunity changes

**Key Mathematical Insights:**
1. **Immunity Formula**: `is_immune = (current_block - registered_at) < immunity_period`
2. **Block Duration**: Each block is 12 seconds, so 4096 blocks = ~13.7 hours
3. **Dynamic Status**: Immunity status updates every block automatically
4. **Pruning Priority**: Non-immune neurons are pruned before immune neurons
5. **Owner Protection**: Subnet owners are protected regardless of immunity status

**Network Security Properties:**
- **Grace Period**: New neurons have time to establish performance
- **Performance Pressure**: Immunity eventually expires, creating performance incentives
- **Owner Stability**: Subnet owners are protected from immediate pruning
- **Dynamic Adjustment**: Immunity periods can be tuned per subnet needs
- **Fair Competition**: Immunity prevents immediate replacement of new participants

**Complete Immunity Period Flow:**
1. **Registration** → Neuron registers and registration block is recorded
2. **Immunity Calculation** → System calculates immunity status every block
3. **Performance Building** → Neuron has immunity_period blocks to improve performance
4. **Immunity Expiration** → Neuron becomes eligible for pruning after immunity expires
5. **Pruning Evaluation** → Non-immune neurons are prioritized for pruning
6. **Owner Protection** → Subnet owners are protected regardless of immunity status
7. **Dynamic Updates** → Immunity status updates automatically with each block

**Immunity Period vs Other Protection Mechanisms:**
- **Immunity Period**: Temporary protection for new neurons (4096 blocks)
- **Owner Protection**: Permanent protection for subnet owners
- **Validator Permits**: Performance-based validation rights
- **Stake Requirements**: Economic barriers to participation
- **Rate Limiting**: Transaction frequency restrictions

**Economic Implications:**
- **Performance Incentives**: Immunity creates pressure to improve performance
- **Network Stability**: Prevents rapid turnover of new participants
- **Owner Commitment**: Protects subnet owners from immediate replacement
- **Competition Balance**: Balances protection with performance requirements
- **Dynamic Governance**: Allows subnet-specific immunity tuning

**Python SDK Usage:**

**Getting Immunity Period:**
```python
import bittensor as bt

# Initialize subtensor connection
subtensor = bt.subtensor()

# Get immunity period for a subnet
immunity_period = subtensor.immunity_period(netuid=1)
print(f"Immunity period: {immunity_period} blocks")  # e.g., "Immunity period: 4096 blocks"

# Get immunity period at specific block
immunity_period_at_block = subtensor.immunity_period(netuid=1, block=1000000)
print(f"Immunity period at block 1000000: {immunity_period_at_block}")
```

**Async Usage:**
```python
async def get_immunity_period():
    async with bt.subtensor() as subtensor:
        immunity_period = await subtensor.immunity_period(netuid=1)
        return immunity_period

# Usage
immunity_period = await get_immunity_period()
print(f"Immunity period: {immunity_period} blocks")
```

**Error Handling:**
- **Subnet Not Found**: Returns `None` if subnet doesn't exist
  - `bittensor/bittensor/core/subtensor.py:1998-2025` - Error handling in immunity_period()
- **Block Not Found**: Returns `None` if specified block doesn't exist
  - `bittensor/bittensor/core/subtensor.py:1998-2025` - Block validation
- **Network Issues**: Handles connection and RPC errors gracefully
  - `bittensor/bittensor/core/subtensor.py:1998-2025` - Network error handling

**Testing Examples:**
- **E2E Tests**: `bittensor/tests/e2e_tests/test_root_set_weights.py:63-115` - Immunity period testing
- **Unit Tests**: `bittensor/tests/unit_tests/test_subtensor_extended.py` - SDK method testing
- **Async Tests**: `bittensor/tests/unit_tests/test_async_subtensor.py` - Async method testing

**Immunity Period Calculation Examples:**
- **Block 1000 Registration**: Immunity until block 5096 (1000 + 4096)
- **Block 5000 Registration**: Immunity until block 9096 (5000 + 4096)
- **Current Block 8000**: Neuron registered at block 3000 is no longer immune
- **Current Block 6000**: Neuron registered at block 2000 is no longer immune

**Network Configuration Examples:**
- **Subnet 1**: 7200 blocks immunity period (24 hours)
- **Default Subnets**: 4096 blocks immunity period (~13.7 hours)
- **Test Networks**: 2 blocks immunity period (24 seconds)
- **Custom Subnets**: Configurable immunity periods based on subnet needs

### Incentives

A portion of the TAO emission received by the subnet miners when they provide valuable services and compete for UID slots in a subnet.

**See also:** [Emissions](./emissions.md), [Anatomy of Incentive Mechanism](./learn/anatomy-of-incentive-mechanism.md)

### Incentive Mechanism

A system that drives the behavior of subnet miners and governs consensus among subnet validators in a Bittensor subnet. Each subnet has its own incentive mechanism, which should be designed carefully to promote desired behaviors and penalize undesired ones.

**See also:** [Anatomy of Incentive Mechanism](./learn/anatomy-of-incentive-mechanism.md), [Understanding Subnets](./subnets/understanding-subnets.md)

## L 

### Lite Node

A type of public subtensor node that stores limited blockchain data and relies on archive nodes for full historical data.

**See also:** [Subtensor Nodes](./subtensor-nodes/), [Managing Subtensor Connections](./sdk/managing-subtensor-connections.md)

### Local Blockchain

A private blockchain used for developing and testing subnet incentive mechanisms. A local blockchain is not public and is isolated from any Bittensor network.

**See also:** [Local Build](./local-build/deploy), [Create a Subnet](./local-build/create-subnet.md)

### Local Wallet

A Bittensor wallet created on the user's machine, requiring the installation of Bittensor.

**See also:** [Wallets](./getting-started/wallets.md), [Installation](./getting-started/installation.md)

### Loss Function

In the context of machine learning, a mathematical function that measures the difference between the predicted output and the ground truth. In Bittensor, incentive mechanisms act as loss functions that steer subnet miners towards desirable outcomes.

**See also:** [Anatomy of Incentive Mechanism](./learn/anatomy-of-incentive-mechanism.md), [Understanding Subnets](./subnets/understanding-subnets.md)

## M 

### Mainchain

The primary Bittensor blockchain network, used for production purposes and connected to lite or archive nodes.

**See also:** [Bittensor Networks](./bittensor-networks.md), [Subtensor Nodes](./subtensor-nodes/)

### Metagraph

A data structure that contains comprehensive information about the current state of a subnet, including detailed information on all the nodes (neurons) such as subnet validator stakes and subnet weights in the subnet. Metagraph aids in calculating emissions.

**See also:** [Subtensor API](./sdk/subtensor-api.md), [Understanding Subnets](./subnets/understanding-subnets.md)

### Miner Deregistration

The process of removing a poor-performing subnet miner from a UID slot, making room for a newly registered miner.

**See also:** [Miner Deregistration](./miners/#miner-deregistration)

### Mnemonic

A sequence of words used to regenerate keys, in case of loss, and restore coldkeys and hotkeys in the Bittensor wallet.

**See also:** [Handle Seed Phrase](./keys/handle-seed-phrase.md), [Working with Keys](./working-with-keys.md)

## N 

### NaCl Format

A secure encryption format, using the [NaCl](https://nacl.cr.yp.to/) library, used for updating legacy Bittensor wallets to improve security.

**See also:** [Working with Keys](./working-with-keys.md), [Coldkey-Hotkey Security](./getting-started/coldkey-hotkey-security.md)

### Netuid

A unique identifier assigned to a subnet within the Bittensor network.

**See also:** [Understanding Subnets](./subnets/understanding-subnets.md), [Working with Subnets](./subnets/working-with-subnets.md)

### Neuron

The basic computing node in a Bittensor subnet, representing a node in a neural network. Neurons can be either subnet validators or subnet miners.

Code References and Implementation Details

**Neuron as Core Network Entity:**
- Neurons are the fundamental participants in Bittensor subnets, representing both miners and validators
  - `bittensor/core/chain_data/neuron_info.py:18` - `Represents the metadata of a neuron including keys, UID, stake, rankings, and other attributes.`
- Each neuron has a unique UID (User ID) within its subnet, assigned during registration
  - `bittensor/core/chain_data/neuron_info.py:25` - `uid (int): The unique identifier for the neuron.`
- Neurons are identified by their hotkey-coldkey pair, with the hotkey serving as the operational key
  - `bittensor/core/chain_data/neuron_info.py:23-24` - `hotkey (str): The hotkey associated with the neuron.`, `coldkey (str): The coldkey associated with the neuron.`

**Neuron Data Structures:**

**NeuronInfo - Complete Neuron Data:**
- `NeuronInfo` contains comprehensive neuron metadata including weights and bonds
  - `bittensor/core/chain_data/neuron_info.py:44-60` - Complete field definitions
- Key performance metrics stored as normalized float values (0-1 range):
  - `bittensor/core/chain_data/neuron_info.py:30-35` - `rank (float)`, `emission (float)`, `incentive (float)`, `consensus (float)`, `trust (float)`, `validator_trust (float)`
- Stake information includes both total stake and per-coldkey breakdown
  - `bittensor/core/chain_data/neuron_info.py:27-29` - `stake (Balance)`, `stake_dict (dict[str, Balance])`, `total_stake (Balance)`
- Network participation data:
  - `bittensor/core/chain_data/neuron_info.py:26` - `netuid (int): The network unique identifier for the neuron.`
  - `bittensor/core/chain_data/neuron_info.py:36` - `validator_permit (bool): Validator permit status.`
  - `bittensor/core/chain_data/neuron_info.py:37-38` - `weights (list[tuple[int, int]])`, `bonds (list[list[int]])`

**NeuronInfoLite - Lightweight Neuron Data:**
- `NeuronInfoLite` provides essential neuron data without weights and bonds for efficiency
  - `bittensor/core/chain_data/neuron_info_lite.py:18` - `NeuronInfoLite is a dataclass representing neuron metadata without weights and bonds.`
- Used when full weight/bond data is not required, reducing data transfer overhead
  - `bittensor/core/chain_data/neuron_info_lite.py:44-60` - Field definitions excluding weights and bonds

**Blockchain Storage Implementation:**

**Core Storage Maps:**
- **Keys**: Maps (netuid, uid) to hotkey for UID-to-hotkey lookup
  - `subtensor/pallets/subtensor/src/lib.rs:1537-1541` - `pub type Keys<T: Config> = StorageDoubleMap<_, Identity, u16, Identity, u16, T::AccountId, OptionQuery>;`
- **Uids**: Maps (netuid, hotkey) to uid for hotkey-to-UID lookup
  - `subtensor/pallets/subtensor/src/lib.rs:1533-1536` - `pub type Uids<T: Config> = StorageDoubleMap<_, Identity, u16, Blake2_128Concat, T::AccountId, u16, OptionQuery>;`
- **Owner**: Maps hotkey to coldkey for ownership verification
  - `subtensor/pallets/subtensor/src/lib.rs:1542` - `pub type Owner<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, T::AccountId, OptionQuery>;`

**Performance Metrics Storage:**
- **Rank, Trust, Consensus, Incentive**: Stored as u16 vectors per subnet
  - `subtensor/pallets/subtensor/src/lib.rs:1525-1532` - Various metric storage maps
- **Emission**: Stored as u64 values representing emission rates
  - `subtensor/pallets/subtensor/src/lib.rs:1524` - `pub type Emission<T: Config> = StorageMap<_, Identity, u16, Vec<u64>, ValueQuery, EmptyU64Vec<T>>;`
- **ValidatorPermit**: Boolean vector indicating validator permissions
  - `subtensor/pallets/subtensor/src/lib.rs:1549-1552` - `pub type ValidatorPermit<T: Config> = StorageMap<_, Identity, u16, Vec<bool>, ValueQuery, EmptyBoolVec<T>>;`

**Neuron Registration Process:**

**Registration Methods:**
- **Proof-of-Work Registration**: Traditional registration requiring computational work
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:214-339` - `do_registration()` implementation
- **Burned Registration**: Registration by burning TAO tokens
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:54-206` - `do_burned_registration()` implementation
- **Root Registration**: Special registration for root network (netuid 0)
  - `subtensor/pallets/subtensor/src/macros/dispatches.rs:914` - `root_register()` extrinsic

**Registration Algorithm:**
- **Append vs Replace Logic**: New neurons either append to subnet or replace existing ones
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:8-35` - `register_neuron()` implementation
- **Pruning Selection**: When subnet is full, neuron with lowest pruning score is replaced
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:405-485` - `get_neuron_to_prune()` algorithm
- **Immunity Period**: New neurons are protected from pruning for a configurable period
  - `subtensor/pallets/subtensor/src/utils/misc.rs:448` - `get_neuron_is_immune()` function

**Neuron Lifecycle Management:**

**Append Neuron Process:**
- **UID Assignment**: New neurons get the next available UID (equal to current subnet size)
  - `subtensor/pallets/subtensor/src/subnets/uids.rs:75-95` - `append_neuron()` implementation
- **Storage Expansion**: All metric vectors are expanded to accommodate new neuron
  - `subtensor/pallets/subtensor/src/subnets/uids.rs:85-95` - Vector expansion for new neuron
- **Default Values**: New neurons start with zero values for all metrics
  - `subtensor/pallets/subtensor/src/subnets/uids.rs:85-95` - Default value initialization

**Replace Neuron Process:**
- **Old Neuron Cleanup**: Previous neuron's data is cleared and associations removed
  - `subtensor/pallets/subtensor/src/subnets/uids.rs:35-75` - `replace_neuron()` implementation
- **New Neuron Setup**: New neuron inherits the UID with fresh default values
  - `subtensor/pallets/subtensor/src/subnets/uids.rs:65-75` - New neuron initialization
- **Bond Clearing**: All bonds are cleared when neurons are replaced
  - `subtensor/pallets/subtensor/src/subnets/uids.rs:25-30` - `clear_neuron()` function

**Pruning Algorithm:**
- **Score-Based Selection**: Neuron with lowest pruning score is selected for replacement
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:405-485` - Pruning score evaluation
- **Immunity Protection**: Neurons within immunity period are protected from pruning
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:430-485` - Immunity period logic
- **Tie-Breaking**: When scores are equal, earliest registered neuron is pruned
  - `subtensor/pallets/subtensor/src/subnets/registration.rs:440-485` - Registration time tie-breaking

**Neuron API and Retrieval:**

**Python SDK Methods:**
- **Individual Neuron Retrieval**: Get neuron by UID or hotkey
  - `bittensor/core/subtensor.py:1369-1411` - `get_neuron_for_pubkey_and_subnet()` implementation
  - `bittensor/core/async_subtensor.py:2183-2229` - Async version of neuron retrieval
- **Batch Neuron Retrieval**: Get all neurons in a subnet
  - `bittensor/core/subtensor_api/neurons.py:1-16` - `Neurons` class for batch operations
- **UID Lookup**: Find UID for a given hotkey on a subnet
  - `bittensor/core/subtensor.py:1922-1947` - `get_uid_for_hotkey_on_subnet()` implementation

**Blockchain RPC Methods:**
- **Runtime API**: Neurons are retrieved via `NeuronInfoRuntimeApi`
  - `subtensor/pallets/subtensor/src/rpc_info/neuron_info.rs:155` - `get_neuron()` RPC method
- **Storage Queries**: Direct storage access for UID and hotkey lookups
  - `subtensor/pallets/subtensor/src/subnets/uids.rs:130-150` - UID lookup functions
- **Batch Retrieval**: Efficient retrieval of all neurons in a subnet
  - `subtensor/pallets/subtensor/src/rpc_info/neuron_info.rs:210-238` - `get_neurons_lite()` implementation

**Neuron State Management:**

**Active Status:**
- **Active Flag**: Boolean indicating if neuron is currently active
  - `bittensor/core/chain_data/neuron_info.py:26` - `active (int): The active status of the neuron.`
- **Last Update**: Block number of last activity for staleness detection
  - `bittensor/core/chain_data/neuron_info.py:37` - `last_update (int): The timestamp of the last update.`
- **Staleness Filtering**: Neurons with outdated last_update are filtered from consensus
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:570-575` - Staleness filtering in epoch

**Validator Permits:**
- **Permit Assignment**: Top K neurons by stake receive validator permits
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:520-523` - Validator permit assignment
- **Access Control**: Only permitted neurons can set weights and participate in consensus
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:745-748` - Weight setting permission check
- **Dynamic Updates**: Permits are recalculated every epoch based on current stake
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:847` - Permit storage update

**Neuron Performance Metrics:**

**Core Metrics Calculation:**
- **Rank**: Performance rank based on trust and incentive scores
  - `bittensor/core/chain_data/neuron_info.py:30` - `rank (float): The rank score of the neuron.`
- **Trust**: Consensus-based trust score from inter-peer weights
  - `bittensor/core/chain_data/neuron_info.py:33` - `trust (float): The trust score.`
- **Consensus**: Agreement level with other validators
  - `bittensor/core/chain_data/neuron_info.py:32` - `consensus (float): The consensus score.`
- **Incentive**: Reward allocation based on performance
  - `bittensor/core/chain_data/neuron_info.py:31` - `incentive (float): The incentive value.`

**Emission and Dividends:**
- **Emission**: TAO emission rate to the neuron
  - `bittensor/core/chain_data/neuron_info.py:30` - `emission (float): The emission rate.`
- **Dividends**: Additional rewards from bond investments
  - `bittensor/core/chain_data/neuron_info.py:35` - `dividends (float): The dividends value.`
- **Validator Trust**: Specialized trust score for validator neurons
  - `bittensor/core/chain_data/neuron_info.py:34` - `validator_trust (float): The validation trust score.`

**Neuron Network Operations:**

**Weight Setting:**
- **Weight Matrix**: Neurons set weights to other neurons, forming the consensus matrix
  - `subtensor/pallets/subtensor/src/lib.rs:1543-1549` - `Weights<T>` storage definition
- **Permission Control**: Only validator-permitted neurons can set non-self weights
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:745-748` - Weight setting restrictions
- **Self-Weight Exception**: All neurons can set self-weights regardless of permit status
  - `subtensor/pallets/subtensor/src/subnets/weights.rs:961-963` - Self-weight permission logic

**Bond Formation:**
- **Bond Investment**: Validators form bonds to miners based on performance assessment
  - `subtensor/pallets/subtensor/src/lib.rs:1560-1566` - `Bonds<T>` storage definition
- **EMA Bonds**: Bonds are smoothed using exponential moving average
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:687` - EMA bond computation
- **Bond Retention**: Bonds are retained only by neurons with validator permits
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:849-862` - Bond retention logic

**Neuron Testing and Validation:**

**Registration Testing:**
- **Successful Registration**: Tests verify proper neuron registration and UID assignment
  - `subtensor/pallets/subtensor/src/tests/registration.rs:102-192` - Registration success tests
- **Pruning Scenarios**: Tests verify correct neuron replacement when subnet is full
  - `subtensor/pallets/subtensor/src/tests/registration.rs:583-701` - Pruning algorithm tests
- **Immunity Period**: Tests verify immunity protection during registration
  - `subtensor/pallets/subtensor/src/tests/registration.rs:1261-1300` - Immunity period tests

**Neuron Lifecycle Testing:**
- **Replace Neuron**: Tests verify proper neuron replacement and data clearing
  - `subtensor/pallets/subtensor/src/tests/uids.rs:15-201` - Neuron replacement tests
- **Owner Protection**: Tests verify subnet owners are protected from pruning
  - `subtensor/pallets/subtensor/src/tests/uids.rs:424-542` - Owner protection tests
- **Bond Management**: Tests verify bond clearing during neuron replacement
  - `subtensor/pallets/subtensor/src/tests/uids.rs:201-266` - Bond clearing tests

**Mock Implementation:**
- **Mock Subtensor**: Provides in-memory neuron management for testing
  - `bittensor/utils/mock/subtensor_mock.py:725-786` - Mock neuron retrieval methods
- **Force Registration**: Allows test-specific neuron registration
  - `bittensor/utils/mock/subtensor_mock.py:470-499` - `force_register_neuron()` method
- **State Management**: Mock maintains neuron state across test scenarios
  - `bittensor/utils/mock/subtensor_mock.py:823-873` - `_neuron_subnet_exists()` implementation

**Key Mathematical Insights:**
1. **Neuron = UID + Hotkey + Coldkey**: Each neuron is uniquely identified by its UID and key pair
2. **Registration = Append or Replace**: New neurons either expand the subnet or replace existing ones
3. **Pruning = Lowest Score**: Neurons with lowest pruning scores are replaced when subnet is full
4. **Immunity = Protection Period**: New neurons are protected from pruning for a configurable period
5. **Performance = Multi-Metric**: Neuron performance is measured by rank, trust, consensus, and incentive

**Network Security Properties:**
- **Economic Barriers**: Registration costs prevent Sybil attacks
- **Performance-Based Pruning**: Low-performing neurons are automatically replaced
- **Stake-Based Permits**: Validator permits require economic stake for consensus participation
- **Dynamic Adjustment**: Neuron state adapts to changing network conditions
- **Owner Protection**: Subnet owners are protected from pruning to ensure network stability

**Complete Neuron Lifecycle:**
1. **Registration** → Neuron registers via PoW or burned registration
2. **UID Assignment** → Neuron receives unique UID within subnet
3. **Immunity Period** → Neuron is protected from pruning for configurable blocks
4. **Performance Building** → Neuron accumulates rank, trust, consensus, and incentive
5. **Validator Permit** → Top K neurons by stake receive validator permits
6. **Weight Setting** → Permitted neurons can set weights and participate in consensus
7. **Bond Formation** → Validators form bonds to miners based on performance
8. **Emission Distribution** → Neurons receive TAO emissions based on performance
9. **Performance Monitoring** → Neuron performance is continuously evaluated
10. **Pruning Risk** → Low-performing neurons risk replacement by new registrations

**Neuron vs Subnet Relationship:**
- **Subnet Container**: Neurons exist within specific subnets identified by netuid
- **Subnet Limits**: Each subnet has maximum allowed UIDs (typically 256)
- **Subnet-Specific**: Neuron metrics and state are subnet-specific
- **Cross-Subnet**: Neurons can participate in multiple subnets with different UIDs
- **Subnet Governance**: Subnet owners have special privileges and protection

**Neuron vs Validator/Miner Roles:**
- **Neuron = Container**: Neuron is the container entity that can be either validator or miner
- **Validator = Role**: Neurons with validator permits can set weights and participate in consensus
- **Miner = Role**: Neurons without validator permits perform subnet-specific tasks
- **Role Flexibility**: Neurons can change roles based on permit status and stake
- **Performance Metrics**: Both roles contribute to neuron's overall performance score


## N 

### Nominate

The process of a delegate registering themselves as a candidate for others to stake their $TAO to.

### Nominator

Another term for a delegator. A subnet validator who nominates their own hotkey as a delegate, allowing others to delegate their TAO to the nominator's hotkey.

### Nominator (Delegator)

A TAO holder who delegates their stake.

## O 

### Objective Function

In the context of machine learning and subnet operations, this refers to the goal that the subnet is continuously optimizing for, through its incentive mechanism.

**See also:** [Anatomy of Incentive Mechanism](./learn/anatomy-of-incentive-mechanism.md), [Understanding Subnets](./subnets/understanding-subnets.md)

## P 

### Private Key

A private component of the cryptographic key pair, crucial for securing and authorizing transactions and operations within the Bittensor network.

**See also:** [Working with Keys](./working-with-keys.md), [Coldkey-Hotkey Security](./getting-started/coldkey-hotkey-security.md)

### Proposal

A suggestion or plan put forward by the Triumvirate for the Senate to vote on.

**See also:** [Governance](./governance.md), [Senate](./senate.md)

### Proposal hash

A unique identifier for a proposal used in the voting process.

**See also:** [Governance](./governance.md), [Senate](./senate.md)

### Public Key

A cryptographic key that is publicly available and used for verifying signatures, encrypting messages, and identifying accounts in the Bittensor network. This is the publicly shareable part of the cryptographic key pair associated with both the coldkey and hotkey, allowing others to securely interact with the wallet.

**See also:** [Working with Keys](./working-with-keys.md), [Coldkey-Hotkey Security](./getting-started/coldkey-hotkey-security.md)

### Public Subtensor

A publicly accessible node in the Bittensor network that can be run as a lite node or an archive node and synchronized with either the mainchain or testchain.

**See also:** [Subtensor Nodes](./subtensor-nodes/), [Managing Subtensor Connections](./sdk/managing-subtensor-connections.md)

## R 

### RAO

A denomination of TAO, representing one billionth (10<sup>-9</sup>) of a TAO.

**See also:** [Emissions](./emissions.md)

### Rank

A measure of a subnet miner's performance relative to other subnet miners in the same subnet, calculated based on the subnet miner's trust and incentive scores. This is the sum of weighted stake, contributing to the emission process.

**See also:** [Emissions](./emissions.md), [Yuma Consensus](./yuma-consensus.md)

### Recycling, burning, and locking

"Recycling TAO" means that this TAO is put back into the Bittensor emissions system. Instead of minting new TAO this recycled TAO that is in the recycle bin will be used again in the new emissions.

This happens in two cases:

- When you register either as a subnet validator or a subnet miner and get a `UID` in return, the registration cost TAO you pay is recycled. 
- Emissions are recycled for those subnets that have registration turned off or paused.

When TAO is burned it is permanently removed from circulation, reducing total supply.

Locked TAO is neither recycled nor burned, but held unspent, without the ability to move it until it is unlocked. The cost for subnet registration is locked and returned if the subnet is deregistered.

**See also:** [Emissions](./emissions.md), [Subnet Miners](./miners/), [Subnet Validators](./validators/)

### Regenerating a Key

The process of recreating a lost or deleted coldkey or hotkey using the associated mnemonic.

**See also:** [Handle Seed Phrase](./keys/handle-seed-phrase.md), [Working with Keys](./working-with-keys.md)

### Register

The process of registering keys with a subnet and purchasing a UID slot.

**See also:** [Subnet Miners](./miners/), [Subnet Validators](./validators/), [Working with Subnets](./subnets/working-with-subnets.md)

## S 

### SS58 Encoded

A compact representation of public keys corresponding to the wallet's coldkey and hotkey, used as wallet addresses for secure TAO transfers.

**See also:** [Working with Keys](./working-with-keys.md), [Wallets](./getting-started/wallets.md)

### Senate

A group of elected delegates formed from the top K delegate hotkeys, responsible for approving or disapproving proposals made by the Triumvirate.

**See also:** [Senate](./senate.md), [Governance](./governance.md)

### Stake

The amount of currency tokens delegated to a validator UID in a subnet. Includes both self-stake (from the validator's own cold-key) and stake delegated from others. 

Stake determines a validator's weight in consensus as well as their emissions.

**See also:** [Managing Stake with btcli](./staking-and-delegation/managing-stake-btcli.md), [Managing Stake with SDK](./staking-and-delegation/managing-stake-sdk.md), [Delegation](./staking-and-delegation/delegation.md)

### Staking

The process of attaching TAO to a hotkey, i.e., locking TAO to a hotkey, to participate as a subnet validator, and to secure a validator permit.

**See also:** [Managing Stake with btcli](./staking-and-delegation/managing-stake-btcli.md), [Managing Stake with SDK](./staking-and-delegation/managing-stake-sdk.md), [Delegation](./staking-and-delegation/delegation.md)

### Subnet

A Bittensor subnet is an incentive-based competition market that produces a specific kind of digital commodity. It consists of a community of miners that produce the commodity, and a community of validators that measures the miners' work to ensure its quality.

**See also:** [Understanding Subnets](./subnets/understanding-subnets.md), [Working with Subnets](./subnets/working-with-subnets.md), [Create a Subnet](./subnets/create-a-subnet.md)

### Subnet Incentive Mechanism

The framework that governs the behavior of subnet miners and ensures consensus among subnet validators by promoting desirable actions and penalizing undesired ones.

**See also:** [Anatomy of Incentive Mechanism](./learn/anatomy-of-incentive-mechanism.md), [Understanding Subnets](./subnets/understanding-subnets.md)

### Subnet Miner

The task-performing entity within a Bittensor subnet. A subnet miner is a type of node in a Bittensor subnet that is connected only to subnet validators. Subnet miners are isolated from the external world and communicate bidirectionally with subnet validators. A subnet miner is responsible for performing tasks given to them by the subnet validators in that subnet. 

**See also:** [Subnet Miners](./miners/), [Subnet Miner Documentation](./miners/subnet_miner_docs.md)

### Subnet Creator

The individual or entity responsible for defining the specific digital task to be performed by subnet miners, implementing an incentive mechanism, and providing sufficient documentation for participation in the subnet.

**See also:** [Create a Subnet](./subnets/create-a-subnet.md), [Subnet Creators btcli Guide](./subnets/subnet-creators-btcli-guide.md)

### Subnet Protocol

A unique set of rules defining interactions between subnet validators and miners, including how tasks are queried and responses are provided.

**See also:** [Understanding Subnets](./subnets/understanding-subnets.md), [Working with Subnets](./subnets/working-with-subnets.md)

### Subnet scoring model

A component of the incentive mechanism that defines how subnet miners' responses are evaluated, aiming to align subnet miner behavior with the subnet's goals and user preferences. It is a mathematical object that converts miner responses into numerical scores, enabling continuous improvement and competition among miners.

**See also:** [Anatomy of Incentive Mechanism](./learn/anatomy-of-incentive-mechanism.md), [Understanding Subnets](./subnets/understanding-subnets.md)

### Subnet Task

A key component of any incentive mechanism that defines the work the subnet miners will perform. The task should be chosen to maximize subnet miner effectiveness at the intended use case for the subnet.

**See also:** [Understanding Subnets](./subnets/understanding-subnets.md), [Anatomy of Incentive Mechanism](./learn/anatomy-of-incentive-mechanism.md)

### Subnet Weights

The importance assigned to each subnet determined by relative price among subnets and used to determine the percentage emissions to subnets.

**See also:** [Emissions](./emissions.md), [Consensus-Based Weights](./subnets/consensus-based-weights.md)

### Subtensor

[Subtensor](https://github.com/opentensor/subtensor) is Bittensor's layer 1 blockchain based on substrate (now PolkadotSDK). This serves Bittensor as a system of record for transactions and rankings, operates Yuma Consensus, and emits liquidity to participants to incentivize their participation in network activities.

The Bittensor SDK offers the [`bittensor.core.subtensor`](pathname:///python-api/html/autoapi/bittensor/core/subtensor/index.html) and [`bittensor.core.async_subtensor`](pathname:///python-api/html/autoapi/bittensor/core/async_subtensor/index.html) modules to handle Subtensor blockchain interactions.

**See also:** [Subtensor API](./sdk/subtensor-api.md), [Subtensor Nodes](./subtensor-nodes/), [Managing Subtensor Connections](./sdk/managing-subtensor-connections.md)

### Sudo

A privileged key for administrative actions, replaced by governance protocol for enhanced security.

**See also:** [Governance](./governance.md), [btcli Permissions](./btcli-permissions.md)

### Synapse

A data object used by subnet validators and subnet miners as the main vehicle to exchange information. Synapse objects are based on the BaseModel of the Pydantic data validation library.

**See also:** [Subnet Miners](./miners/), [Subnet Validators](./validators/)

## T 

### TAO ($\tau$)

The cryptocurrency of the Bittensor network, used to incentivize participation in network activities (mining, validation, subnet creation and management). A single TAO is newly created (i.e., minted) every 12 seconds on the Bittensor blockchain.

**See also:** [Emissions](./emissions.md), [Wallets](./getting-started/wallets.md)

### Tempo

A 360-block period during which the Yuma Consensus calculates emissions to subnet participants based on the latest available ranking weight matrix. A single block is processed every 12 seconds, hence a 360-block tempo occurs every 4320 seconds or 72 minutes. 

**See also:** [Yuma Consensus](./yuma-consensus.md), [Emissions](./emissions.md)

### Transfer

The process of sending TAO tokens from one wallet address to another in the Bittensor network.

**See also:** [Wallets](./getting-started/wallets.md), [Working with Keys](./working-with-keys.md)

### Triumvirate

A group of three Opentensor Foundation employees responsible for creating proposals.

**See also:** [Governance](./governance.md), [Senate](./senate.md)

### Trust

A measure of a subnet miner's reputation and reliability, calculated based on the consensus of subnet validators.

Code References and Implementation Details

**Trust as a Core Network Metric:**
- Trust is stored as a `float` value in both `NeuronInfo` and `NeuronInfoLite` data structures
  - `bittensor/core/chain_data/neuron_info.py:32` - `trust (float): The trust score.`
  - `bittensor/core/chain_data/neuron_info_lite.py:29` - `trust (float): Trust value of the neuron.`
- Trust values are normalized using `u16_normalized_float()` function, converting from 16-bit unsigned integers to float values between 0 and 1
  - `bittensor/core/chain_data/neuron_info.py:158` - `trust=u16_normalized_float(decoded["trust"]),`
  - `bittensor/core/chain_data/neuron_info_lite.py:126` - `trust=u16_normalized_float(decoded["trust"]),`
- In the metagraph, trust is represented as a tensor (numpy array or torch tensor) accessible via `metagraph.T` property
  - `bittensor/core/metagraph.py:392` - `return self.trust`

**Trust Calculation and Sources:**
- Trust values are directly read from the blockchain state via `neuron.trust` field
  - `bittensor/core/metagraph.py:759-762` - `self.trust = self._create_tensor([neuron.trust for neuron in self.neurons], dtype=self._dtype_registry["float32"],)`
- The trust matrix is "inferred from the network's inter-peer weights" according to metagraph documentation
  - `bittensor/core/metagraph.py:385-386` - `The trust matrix is inferred from the network's inter-peer weights, indicating the level of trust each neuron has in others.`
- Trust represents the collective assessment of a neuron's reliability by other neurons in the network
- Higher trust values indicate stronger trust relationships between neurons

**Trust vs Validator Trust:**
- **Trust (T)**: General trust score for all neurons, primarily miners
  - `bittensor/core/metagraph.py:380-393` - Property T() documentation
- **Validator Trust (Tv)**: Specialized trust score specifically for validator neurons
  - `bittensor/core/metagraph.py:397-409` - Property Tv() documentation
- Both are stored separately in the blockchain state and metagraph
  - `bittensor/core/chain_data/neuron_info.py:33` - `validator_trust (float): The validation trust score.`
  - `bittensor/core/chain_data/neuron_info_lite.py:30` - `validator_trust (float): Validator trust value of the neuron.`
- Validator trust is crucial for network security and validation processes

**Trust in Consensus and Emission Calculation:**

**The Staked Weighted Trust System:**
The consensus mechanism in Bittensor operates on a "staked weighted trust system" where trust values are combined with stake weights to determine consensus scores. This system leverages the collective judgment of all participating peers to create a robust consensus mechanism.

**Natural Language Analysis:**
In simple terms, the consensus system works like a weighted voting mechanism where:
1. Each neuron's opinion (weight) about other neurons is weighted by their stake
2. Trust values determine how much influence each neuron has in the consensus
3. Higher trust means more influence in the consensus calculation
4. The $\kappa$-centered sigmoid function transforms trust values into consensus scores

**Code Implementation Details:**

**Consensus Property in Metagraph:**
- Consensus values are stored as tensors in the metagraph and accessed via `metagraph.C`
  - `bittensor/core/metagraph.py:360-372` - Property C() documentation and implementation
- The consensus property returns `self.consensus` which contains consensus scores for all neurons
  - `bittensor/core/metagraph.py:372` - `return self.consensus`

**Consensus Data Flow:**
- Consensus values are read from blockchain state and stored in neuron data structures
  - `bittensor/core/chain_data/neuron_info.py:147` - `consensus=u16_normalized_float(decoded["consensus"]),`
  - `bittensor/core/chain_data/neuron_info_lite.py:113` - `consensus=u16_normalized_float(decoded["consensus"]),`
- Consensus values are normalized using `u16_normalized_float()` function, converting from 16-bit integers to float values between 0 and 1
- In the metagraph, consensus is represented as a tensor accessible via `metagraph.C` property
  - `bittensor/core/metagraph.py:759-762` - `self.consensus = self._create_tensor([neuron.consensus for neuron in self.neurons], dtype=self._dtype_registry["float32"],)`

**Trust → Consensus → Rank → Incentive → Emission Pipeline:**

**Step 1: Trust Calculation from Weights**
- Trust values are "inferred from the network's inter-peer weights"
  - `bittensor/core/metagraph.py:385-386` - `The trust matrix is inferred from the network's inter-peer weights, indicating the level of trust each neuron has in others.`
- Each neuron i sets weights w_ij towards other neurons j, reflecting trust assessments
  - `bittensor/core/metagraph.py:442-443` - `These weights are reflective of the neuron's assessment or judgment of other neurons in the network.`
- Higher weights from neuron i to neuron j imply greater trust or value placed on neuron j's contributions
  - `bittensor/core/metagraph.py:449` - `can imply greater trust or value placed on that neuron's contributions.`

**Step 2: Consensus Calculation via $\kappa$-Centered Sigmoid**
- Trust influences consensus through the $\kappa$-centered sigmoid function
- `bittensor/core/glossary.md:52` - `This is a $\kappa$-centered sigmoid of trust, influencing the emission calculation.`
- The $\kappa$-centered sigmoid transforms trust values into consensus scores, creating a non-linear relationship that amplifies high trust values and dampens low trust values

**Step 3: Rank Calculation from Trust and Incentive**
- Rank is calculated based on the subnet miner's trust and incentive scores
  - `bittensor/core/glossary.md:232` - `calculated based on the subnet miner's trust and incentive scores.`
- Rank values are stored in neuron data structures and normalized
  - `bittensor/core/chain_data/neuron_info.py:154` - `rank=u16_normalized_float(decoded["rank"]),`
  - `bittensor/core/chain_data/neuron_info_lite.py:120` - `rank=u16_normalized_float(decoded["rank"]),`
- Rank determines a neuron's position in the network hierarchy and influences emission distribution

**Step 4: Incentive Calculation**
- Incentive values represent rewards neurons receive for their contributions
  - `bittensor/core/metagraph.py:332-342` - Property I() documentation
- Incentive is based on informational value, stake, and consensus with other peers
  - `bittensor/core/metagraph.py:334-336` - `The Bittensor network employs an incentive mechanism that rewards neurons based on their informational value, stake, and consensus with other peers.`
- Trust values are used in the Yuma Consensus algorithm for computing emissions
- Incentive values are normalized and stored in neuron structures
  - `bittensor/core/chain_data/neuron_info.py:145` - `incentive=u16_normalized_float(decoded["incentive"]),`
  - `bittensor/core/chain_data/neuron_info_lite.py:111` - `incentive=u16_normalized_float(decoded["incentive"]),`

**Step 5: Emission Distribution**
- Emission values denote the distribution of rewards to neurons
  - `bittensor/core/metagraph.py:344-354` - Property E() documentation
- Emissions are based on stake and performance, with trust influencing the distribution
  - `bittensor/core/metagraph.py:348-350` - `Emissions refer to the distribution or release of rewards (often in the form of cryptocurrency) to neurons, typically based on their stake and performance.`
- The emission mechanism ensures active and contributing neurons are appropriately rewarded

**Testing Evidence of the Pipeline:**

**Initial State (New Neurons):**
- Trust starts at 0 for new neurons
  - `tests/e2e_tests/test_incentive.py:69` - `assert bob_neuron.trust == 0`
- Consensus, incentive, and rank all start at 0
  - `tests/e2e_tests/test_incentive.py:71-73` - `assert bob_neuron.incentive == 0`, `assert bob_neuron.consensus == 0`, `assert bob_neuron.rank == 0`

**After Successful Operation:**
- Miner trust reaches 1.0 (full trust)
  - `tests/e2e_tests/test_incentive.py:129` - `assert bob_neuron.trust == 1`
- Consensus, incentive, and rank all increase above 0.5
  - `tests/e2e_tests/test_incentive.py:125-127` - `assert bob_neuron.incentive > 0.5`, `assert bob_neuron.consensus > 0.5`, `assert bob_neuron.rank > 0.5`
- Validator trust approaches 1.0 (\>0.99) for properly functioning validators
  - `tests/e2e_tests/test_incentive.py:119` - `assert alice_neuron.validator_trust > 0.99`

**Validator vs Miner Dynamics:**
- Validators receive dividends (1.0) and have high validator_trust (\>0.99)
  - `tests/e2e_tests/test_incentive.py:116-117` - `assert alice_neuron.dividends == 1.0`, `assert alice_neuron.validator_trust > 0.99`
- Validators have lower incentive, consensus, and rank (\<0.5) compared to miners
  - `tests/e2e_tests/test_incentive.py:118,120-121` - `assert alice_neuron.incentive < 0.5`, `assert alice_neuron.consensus < 0.5`, `assert alice_neuron.rank < 0.5`
- Miners have higher incentive, consensus, and rank (\>0.5) and full trust (1.0)
  - `tests/e2e_tests/test_incentive.py:125-127,129` - Various assertions showing miner values

**Mathematical Relationship:**
The relationship between trust, consensus, rank, incentive, and emission can be conceptualized as:
1. **Trust (T)** = f(weights_matrix) - Collective assessment from inter-peer weights
2. **Consensus (C)** = $\kappa$-sigmoid(T, stake_weights) - $\kappa$-centered sigmoid of trust weighted by stake
3. **Rank (R)** = g(T, I) - Function of trust and incentive scores
4. **Incentive (I)** = h(consensus, stake, informational_value) - Based on consensus and other factors
5. **Emission (E)** = i(rank, stake, performance) - Final reward distribution

**Network Security Implications:**
- Trust mechanisms prevent malicious actors from gaining undue influence
- The $\kappa$-centered sigmoid creates a non-linear trust amplification that rewards high-trust neurons
- The staked weighted system ensures that high-stake validators have more influence in consensus
- Trust creates a reputation system that guides network decision-making and emission distribution
- The entire pipeline ensures that reliable contributors are identified and rewarded appropriately

**Complete Trust Flow Implementation:**

**1. Weight Setting and Storage:**
- Validators set weights via `set_weights()` extrinsic
  - `pallets/subtensor/src/subnets/weights.rs:676` - `pub fn do_set_weights()`
- Weights are stored in blockchain storage as `Weights<T>` double map
  - `pallets/subtensor/src/lib.rs:1543-1549` - `pub type Weights<T: Config> = StorageDoubleMap`
- Weights are max-upscaled and normalized before storage
  - `pallets/subtensor/src/subnets/weights.rs:750` - `let max_upscaled_weights: Vec<u16> = vec_u16_max_upscale_to_u16(&values);`

**2. Weight Retrieval in Epoch:**
- Weights are retrieved during epoch execution via `get_weights_sparse()`
  - `pallets/subtensor/src/epoch/run_epoch.rs:905` - `pub fn get_weights_sparse(netuid: u16) -> Vec<Vec<(u16, I32F32)>>`
- Weights are converted from u16 to I32F32 fixed-point format
  - `pallets/subtensor/src/epoch/run_epoch.rs:920` - `I32F32::saturating_from_num(*weight_ij)`

**3. Trust Calculation in Yuma Consensus:**
- **Pre-ranks calculation**: `preranks = matmul_sparse(&weights, &active_stake, n)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:591` - `let preranks: Vec<I32F32> = matmul_sparse(&weights, &active_stake, n);`
- **Consensus calculation**: `consensus = weighted_median_col_sparse(&active_stake, &weights, n, kappa)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:595` - `let consensus: Vec<I32F32> = weighted_median_col_sparse(&active_stake, &weights, n, kappa);`
- **Weight clipping**: `clipped_weights = col_clip_sparse(&weights, &consensus)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:598` - `let clipped_weights: Vec<Vec<(u16, I32F32)>> = col_clip_sparse(&weights, &consensus);`
- **Post-clip ranks**: `ranks = matmul_sparse(&clipped_weights, &active_stake, n)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:605` - `let mut ranks: Vec<I32F32> = matmul_sparse(&clipped_weights, &active_stake, n);`

**4. Trust Formula Implementation:**
- **Trust calculation**: `trust = vecdiv(&ranks, &preranks)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:608` - `let trust: Vec<I32F32> = vecdiv(&ranks, &preranks);`
- **vecdiv function**: Element-wise division with zero protection
  - `pallets/subtensor/src/epoch/math.rs:322` - `pub fn vecdiv(x: &[I32F32], y: &[I32F32]) -> Vec<I32F32>`
- **Mathematical meaning**: Trust = (rank_after_clipping) / (rank_before_clipping)
  - Range: [0, 1] where 1.0 means no clipping occurred (full consensus)

**5. Storage and Metagraph Reporting:**
- Trust values are converted to u16 for storage
  - `pallets/subtensor/src/epoch/run_epoch.rs:850` - `let cloned_trust: Vec<u16> = trust.iter().map(|xi| fixed_proportion_to_u16(*xi)).collect();`
- Trust is stored in blockchain state
  - `pallets/subtensor/src/epoch/run_epoch.rs:857` - `Trust::<T>::insert(netuid, cloned_trust);`
- Metagraph retrieves trust from blockchain state
  - `pallets/subtensor/src/rpc_info/metagraph.rs:754` - `trust: Trust::<T>::get(netuid).into_iter().map(Compact::from).collect()`

**6. Validator Trust Calculation:**
- **Validator trust**: Sum of clipped weights set by each validator
  - `pallets/subtensor/src/epoch/run_epoch.rs:600` - `let validator_trust: Vec<I32F32> = row_sum_sparse(&clipped_weights);`
- **row_sum_sparse function**: Sums across each row of the sparse matrix
  - `pallets/subtensor/src/epoch/math.rs:374` - `pub fn row_sum_sparse(sparse_matrix: &[Vec<(u16, I32F32)>]) -> Vec<I32F32>`
- **Mathematical meaning**: Validator trust = sum of all clipped weights set by that validator

**7. Trust in Emission Calculation:**
- Trust influences incentive calculation through consensus mechanism
  - `pallets/subtensor/src/epoch/run_epoch.rs:610` - `let incentive: Vec<I32F32> = ranks.clone();`
- Trust affects bond formation and validator dividends
  - `pallets/subtensor/src/epoch/run_epoch.rs:631` - `let weights_for_bonds: Vec<Vec<(u16, I32F32)>> = interpolate_sparse(&weights, &clipped_weights, n, bonds_penalty);`
- Trust creates feedback loop: high trust → better consensus → higher rewards → stronger bonds

**Notes:**
1. **Trust = 1.0**: Neuron's weights were not clipped, indicating full consensus agreement
2. **Trust < 1.0**: Neuron's weights were clipped, indicating disagreement with consensus
3. **Trust = 0.0**: Neuron received no consensus weight, indicating complete disagreement
4. **Validator Trust**: Measures how much consensus weight each validator contributes
5. **Dynamic Nature**: Trust updates every epoch based on current weight submissions

**Security Properties:**
- **Anti-manipulation**: $\kappa$-centered clipping prevents weight manipulation
- **Stake-weighted**: Higher stake validators have more influence in consensus
- **Consensus-driven**: Trust rewards alignment with majority opinion
- **Bond formation**: Trust influences long-term validator-miner relationships

## U 

### UID Slot

A position occupied by a subnet miner or subnet validator within a subnet, identified by a unique UID. The UID is assigned to a hotkey when it is registered in a subnet, allowing the hotkey to participate as a subnet validator or subnet miner.

**See also:** [Subnet Miners](./miners/), [Subnet Validators](./validators/), [Working with Subnets](./subnets/working-with-subnets.md)

## V 

### VPermit

Validator permits held by the delegate for specific subnets.

Code References and Implementation Details

**VPermit as Delegator Authorization:**
- VPermit represents the list of subnets that a delegate is authorized to validate on
  - `bittensor/core/chain_data/delegate_info.py:17` - `validator_permits (list[int]): List of subnets that the delegate is allowed to validate on.`
  - `bittensor/core/chain_data/delegate_info_lite.py:19` - `validator_permits (list[int]): List of subnets that the delegate is allowed to validate on.`
- VPermit is stored as a list of subnet IDs (netuids) in delegate information structures
  - `bittensor/core/chain_data/delegate_info.py:26` - `validator_permits: list[int]`
  - `bittensor/core/chain_data/delegate_info_lite.py:29` - `validator_permits: list[int]`

**VPermit vs Validator Permit:**
- **VPermit**: List of subnets a delegate can validate on (delegate-level authorization)
  - `bittensor/core/chain_data/delegate_info.py:76` - `validator_permits=list(decoded.get("validator_permits", [])),`
  - `bittensor/core/chain_data/delegate_info_lite.py:43` - `validator_permits=decoded["validator_permits"],`
- **Validator Permit**: Boolean flag indicating if a specific neuron has validation rights (neuron-level authorization)
  - `bittensor/core/chain_data/neuron_info.py:36` - `validator_permit (bool): Validator permit status.`
  - `bittensor/core/chain_data/neuron_info_lite.py:33` - `validator_permit (bool): Indicates if the neuron has a validator permit.`

**VPermit in Delegate Information:**
- VPermit is included in both full and lite delegate information structures
  - `bittensor/core/chain_data/delegate_info.py:76` - `validator_permits=list(decoded.get("validator_permits", [])),`
  - `bittensor/core/chain_data/delegate_info_lite.py:43` - `validator_permits=decoded["validator_permits"],`
- VPermit is also included in delegated information for specific subnet contexts
  - `bittensor/core/chain_data/delegate_info.py:108` - `validator_permits=list(delegate_info.get("validator_permits", [])),`

**VPermit in Testing and Validation:**
- Test scenarios verify VPermit functionality for delegates
  - `tests/e2e_tests/test_delegate.py:210` - `validator_permits=[],`
  - `tests/e2e_tests/test_delegate.py:224` - `validator_permits=[],`
  - `tests/e2e_tests/test_delegate.py:282` - `validator_permits=[alice_subnet_netuid],`
- Tests verify that delegates can gain VPermits for specific subnets
  - `tests/e2e_tests/test_delegate.py:273` - `# let chain update validator_permits`

**VPermit in Network Operations:**
- VPermit determines which subnets a delegate can participate in as a validator
- VPermit is used to control delegate access to subnet validation activities
- VPermit is part of the delegate nomination and authorization system
- VPermit enables subnet-specific validation permissions for delegates

**VPermit vs Validator Permit in Metagraph:**
- The metagraph tracks validator_permit (boolean) for individual neurons
  - `bittensor/core/metagraph.py:203` - `validator_permit: Indicates if a neuron is authorized to act as a validator.`
  - `bittensor/core/metagraph.py:791-792` - `self.validator_permit = self._create_tensor([neuron.validator_permit for neuron in self.neurons], dtype=bool)`
- VPermit (delegate-level) and validator_permit (neuron-level) work together to control validation access
- Both are essential for the network's validation security and access control mechanisms

**Complete Validator Permit Flow Implementation:**

**1. Validator Permit Calculation in Epoch:**
- **Stake filtering**: Only neurons with sufficient stake are considered for validator permits
  - `pallets/subtensor/src/epoch/run_epoch.rs:489-500` - Stake filtering based on minimum stake threshold
- **Top-K selection**: Validator permits are awarded to the top K neurons by stake
  - `pallets/subtensor/src/epoch/run_epoch.rs:520-523` - `let new_validator_permits: Vec<bool> = is_topk_nonzero(&stake, max_allowed_validators as usize);`
- **is_topk_nonzero function**: Selects top K non-zero stake neurons
  - `pallets/subtensor/src/epoch/math.rs:250-260` - `pub fn is_topk_nonzero(vector: &[I32F32], k: usize) -> Vec<bool>`

**2. Validator Permit Algorithm Details:**
- **Step 1**: Filter neurons with non-zero stake
  - `pallets/subtensor/src/epoch/math.rs:253` - `let mut result: Vec<bool> = vector.iter().map(|&elem| elem != I32F32::from(0)).collect();`
- **Step 2**: Sort neurons by stake in ascending order
  - `pallets/subtensor/src/epoch/math.rs:257` - `idxs.sort_by_key(|&idx| &vector[idx]); // ascending stable sort`
- **Step 3**: Select top K neurons (highest stake)
  - `pallets/subtensor/src/epoch/math.rs:258-260` - `for &idx in idxs.iter().take(n.saturating_sub(k)) { result[idx] = false; }`
- **Mathematical meaning**: Validator permits = top K neurons by stake, where K = max_allowed_validators

**3. Validator Permit Storage and Retrieval:**
- **Storage**: Validator permits stored as boolean vector in blockchain state
  - `pallets/subtensor/src/lib.rs:1550-1552` - `pub type ValidatorPermit<T: Config> = StorageMap<_, Identity, u16, Vec<bool>, ValueQuery, EmptyBoolVec<T>>;`
- **Retrieval**: Validator permits retrieved during epoch execution
  - `pallets/subtensor/src/epoch/run_epoch.rs:515` - `let validator_permits: Vec<bool> = Self::get_validator_permit(netuid);`
- **Update**: New validator permits calculated and stored every epoch
  - `pallets/subtensor/src/epoch/run_epoch.rs:847` - `ValidatorPermit::<T>::insert(netuid, new_validator_permits.clone());`

**4. Validator Permit Access Control:**
- **Weight setting restriction**: Only neurons with validator permits can set non-self weights
  - `pallets/subtensor/src/subnets/weights.rs:745-748` - `ensure!(Self::check_validator_permit(netuid, neuron_uid, &uids, &values), Error::<T>::NeuronNoValidatorPermit);`
- **check_validator_permit function**: Validates permit status for weight setting
  - `pallets/subtensor/src/subnets/weights.rs:960-967` - `pub fn check_validator_permit(netuid: u16, uid: u16, uids: &[u16], weights: &[u16]) -> bool`
- **Self-weight exception**: All neurons can set self-weights regardless of permit status
  - `pallets/subtensor/src/subnets/weights.rs:961-963` - `if Self::is_self_weight(uid, uids, weights) { return true; }`

**5. Validator Permit in Consensus Calculation:**
- **Active stake filtering**: Only validator-permitted neurons contribute to active stake
  - `pallets/subtensor/src/epoch/run_epoch.rs:530-532` - `inplace_mask_vector(&validator_forbids, &mut active_stake);`
- **Weight matrix filtering**: Only validator-permitted neurons' weights are used in consensus
  - `pallets/subtensor/src/epoch/run_epoch.rs:545-546` - `weights = mask_rows_sparse(&validator_forbids, &weights);`
- **Consensus participation**: Validator permits determine which neurons participate in Yuma Consensus

**6. Validator Permit in Bond Management:**
- **Bond retention**: Neurons retain bonds only if they keep validator permits
  - `pallets/subtensor/src/epoch/run_epoch.rs:849-862` - Bond management based on permit status
- **Bond clearing**: Bonds are cleared when neurons lose validator permits
  - `pallets/subtensor/src/epoch/run_epoch.rs:856-860` - `if *new_permit { /* retain bonds */ } else if validator_permit { /* clear bonds */ }`

**7. Validator Permit in Delegate Information:**
- **VPermit calculation**: Delegate VPermits calculated from individual neuron permits
  - `pallets/subtensor/src/rpc_info/delegate_info.rs:88-96` - VPermit calculation for delegates
- **Subnet-specific permits**: Each delegate's VPermit list contains netuids where they have validator permits
  - `pallets/subtensor/src/rpc_info/delegate_info.rs:92-95` - `if validator_permit { validator_permits.push((*netuid).into()); }`

**8. Validator Permit Testing and Validation:**
- **Stake-based permit testing**: Tests verify that validator permits are awarded based on stake
  - `pallets/subtensor/src/tests/epoch.rs:2175-2213` - Comprehensive validator permit testing
- **Weight setting access testing**: Tests verify that only permitted neurons can set weights
  - `pallets/subtensor/src/tests/weights.rs:474-520` - Weight setting access control testing
- **Permit revocation testing**: Tests verify that permits are revoked when stake decreases
  - `pallets/subtensor/src/tests/epoch.rs:2195-2213` - Permit revocation scenarios

**9. Validator Permit in Metagraph Reporting:**
- **Metagraph inclusion**: Validator permits included in metagraph data structures
  - `pallets/subtensor/src/rpc_info/metagraph.rs:754` - `validator_permit: ValidatorPermit::<T>::get(netuid)`
- **Neuron info inclusion**: Validator permits included in individual neuron information
  - `pallets/subtensor/src/rpc_info/neuron_info.rs:36` - `validator_permit: bool` field in NeuronInfo

**10. Validator Permit Security Properties:**
- **Stake-based selection**: Validator permits awarded based on economic stake, ensuring skin-in-the-game
- **Dynamic adjustment**: Permits recalculated every epoch based on current stake distribution
- **Access control**: Permits control critical network functions like weight setting and consensus participation
- **Bond alignment**: Permits align with bond retention, creating economic incentives for validators
- **Network security**: Permits ensure only high-stake, trusted neurons participate in consensus

**Key Mathematical Insights:**
1. **Validator Permit = Top K by Stake**: Permits awarded to K neurons with highest stake
2. **K = max_allowed_validators**: Network parameter controlling validator count
3. **Stake Threshold**: Minimum stake required to be considered for permits
4. **Dynamic Nature**: Permits recalculated every epoch based on current stake
5. **Economic Security**: High stake requirement ensures validator commitment

**Network Security Implications:**
- **Economic barrier**: High stake requirement prevents Sybil attacks
- **Consensus control**: Only permitted validators participate in consensus
- **Weight manipulation prevention**: Permits prevent unauthorized weight setting
- **Bond alignment**: Permits align with bond retention for economic security
- **Dynamic adjustment**: Permits adapt to changing network conditions and stake distribution

**Complete Validator Permit Flow:**
1. **Stake Calculation** → Total stake calculated for each neuron
2. **Threshold Filtering** → Neurons below minimum stake excluded
3. **Top-K Selection** → Top K neurons by stake awarded permits
4. **Storage Update** → New permits stored in blockchain state
5. **Access Control** → Permits control weight setting and consensus participation
6. **Bond Management** → Permits determine bond retention/clearing
7. **Metagraph Reporting** → Permits included in network state reporting
8. **Delegate VPermits** → Individual permits aggregated into delegate VPermits

**Validator Permit vs VPermit Relationship:**
- **Validator Permit**: Neuron-level boolean flag (has permit or not)
- **VPermit**: Delegate-level list of subnet IDs where delegate has permits
- **Aggregation**: VPermit = list of netuids where delegate's neurons have validator_permit = true
- **Hierarchy**: VPermit aggregates multiple validator permits across subnets for a single delegate
- **Purpose**: Validator permit controls individual neuron access, VPermit controls delegate-level permissions


### Validator

A type of node in a subnet that creates tasks, evaluates the performance of subnet miners and sets weights based on their output. A subnet validator is connected only to subnet miners and to the external world. Subnet validators receive inputs from the external world and communicate bidirectionally with subnet miners. 

**See also:** [Subnet Validators](./validators/), [Validators btcli Guide](./validators/validators-btcli-guide.md)

### Validator-Miner Bonds

A mechanism in the Bittensor network that represents the investment relationship between validators and miners, used to calculate validator emissions and incentivize consistent, honest evaluation of miner performance.

**Core Concept:**
Bonds represent the "investment" a validator has made in evaluating a specific miner. This bonding mechanism is integral to the network's market-based approach to measuring and rewarding machine intelligence through the Yuma Consensus algorithm.

**Bond Formation Process:**

**1. Instant Bond Calculation:**
The instant bond $\Delta B_{ij}$ of validator $i$ to miner $j$ is calculated as:
$$\Delta B_{ij} = \frac{S_i \cdot \widetilde{W_{ij}}}{\sum_{k \in \mathbb{V}} S_k \cdot \widetilde{W_{kj}}}$$

Where:
- $S_i$ is validator $i$'s stake
- $\widetilde{W_{ij}}$ is the bond-weight (penalty-adjusted weight)
- The denominator normalizes by the total bond-weight for miner $j$ across all validators

**2. Bond-Weight Calculation:**
Bond-weights are penalized when validators overstate miner performance:
$$\widetilde{W_{ij}} = (1-\beta)W_{ij} + \beta\overline{W_{ij}}$$

Where:
- $W_{ij}$ is the original weight set by validator $i$ for miner $j$
- $\overline{W_{ij}}$ is the consensus-clipped weight
- $\beta$ is the bonds penalty factor (configurable hyperparameter)

**3. Exponential Moving Average (EMA) Bonds:**
Instant bonds are smoothed over time using EMA to prevent abrupt changes:
$$B_{ij}^{(t)} = \alpha \Delta B_{ij} + (1-\alpha)B_{ij}^{(t-1)}$$

Where $\alpha$ is the EMA smoothing factor (typically around 10%).

**Bond Mechanics and Incentives:**

**Consensus Alignment:**
- Validators who stay near consensus build stronger EMA bonds
- Bonds are penalized when validators overstate miner performance
- The EMA smooths out abrupt swings in validator behavior
- Bonds incentivize consistent alignment with consensus

**Validator Emissions:**
Each validator's share of validator emissions (41% of subnet emissions) is calculated as:
$$V_i = \sum_{j \in \mathbb{M}} (B_{ij} \times M_j)$$

Where $M_j$ is miner $j$'s share of miner emissions.

**Bond Management:**

**Bond Retention:**
- Neurons retain bonds only if they keep validator permits
- Bonds are cleared when neurons lose validator permits
- Bonds are stored as sparse matrices in blockchain state

**Bond Decay:**
- Bonds decay over time based on the `bonds_moving_avg` parameter
- Higher decay rates make bonds more responsive to recent performance
- Lower decay rates allow bonds to persist longer

**Network Security Properties:**

**Anti-Manipulation:**
- Bonds prevent weight manipulation through economic penalties
- Validators must "put skin in the game" to influence consensus
- Bond penalties discourage collusive over-evaluation of miners

**Economic Alignment:**
- Bonds create long-term relationships between validators and miners
- Validators are incentivized to discover and support promising miners early
- Bond strength reflects validator confidence in miner performance

**Dynamic Adjustment:**
- Bonds adapt to changing network conditions and consensus
- EMA smoothing prevents exploitation of rapid bond changes
- Bonds provide stability while allowing for network evolution

**Technical Implementation:**

**Storage:**
- Bonds are stored as sparse matrices in blockchain state
- Each validator's bonds to miners are stored as vectors of (miner_uid, bond_value) pairs
- Bonds are updated every epoch during Yuma Consensus execution

**Retrieval:**
- Bonds can be queried via the `bonds()` method in the Subtensor API
- Metagraph includes bonds matrix accessible via `metagraph.B` property
- Bonds are included in neuron information structures

**Hyperparameters:**
- `bonds_penalty`: Controls penalty for out-of-consensus weights (0-65535)
- `bonds_moving_avg`: Controls bond decay rate (typically 900,000)
- `liquid_alpha_enabled`: Enables dynamic alpha adjustment for bonds

**Relationship to Other Network Components:**

**Trust and Consensus:**
- Bonds influence trust calculation through consensus mechanisms
- High bond values indicate strong validator-miner relationships
- Trust creates feedback loop: high trust → better consensus → higher bonds

**Validator Permits:**
- Bonds are retained only by neurons with validator permits
- Loss of validator permit clears all bonds for that neuron
- Bonds align with permit retention for economic security

**Emission Distribution:**
- Bonds directly determine validator emission shares
- Strong bonds lead to higher validator rewards
- Bonds create market-based incentive alignment

**Code References:**
- `pallets/subtensor/src/epoch/run_epoch.rs:631` - Bond calculation in epoch execution
- `pallets/subtensor/src/epoch/math.rs:1475` - EMA bond computation
- `bittensor/core/async_subtensor.py:931` - Bonds API method
- `pallets/subtensor/src/lib.rs:1560` - Bonds storage definition

**See also:** [Yuma Consensus](./yuma-consensus), [Emissions](./emissions), [Trust](#trust), [Validator Permits](#vpermit)

Code References and Implementation Details

**Bonds as Core Network Data Structure:**
- Bonds are stored as sparse matrices in blockchain state via `Bonds<T>` storage map
  - `subtensor/pallets/subtensor/src/lib.rs:1560-1566` - `pub type Bonds<T: Config> = StorageDoubleMap<_, Identity, u16, Identity, u16, Vec<(u16, u16)>, ValueQuery, DefaultBonds<T>>;`
- Bonds are represented as vectors of (miner_uid, bond_value) pairs for each validator
  - `bittensor/core/chain_data/neuron_info.py:47` - `bonds (list[list[int]]): List of bonds associated with the neuron.`
- Bonds are included in both full and lite neuron information structures
  - `bittensor/core/chain_data/neuron_info.py:158` - `bonds=[[e[0], e[1]] for e in decoded["bonds"]],`
  - Note: `NeuronInfoLite` does not include bonds to reduce data size

**Bonds in Metagraph Representation:**
- Bonds are accessible via `metagraph.B` property in the metagraph
  - `bittensor/core/metagraph.py:427-436` - Property B() documentation and implementation
- Bonds are processed using `_process_weights_or_bonds()` method
  - `bittensor/core/metagraph.py:673-690` - `_process_weights_or_bonds()` method for processing bonds data
- Bonds are converted to tensors using `convert_bond_uids_and_vals_to_tensor()`
  - `bittensor/utils/weight_utils.py:143-162` - `convert_bond_uids_and_vals_to_tensor()` function

**Bonds API and Retrieval:**
- Bonds can be queried via the `bonds()` method in AsyncSubtensor
  - `bittensor/core/async_subtensor.py:931-976` - `bonds()` method implementation
- Bonds are retrieved from blockchain storage via `SubtensorModule::Bonds` storage map
  - `bittensor/core/async_subtensor.py:963-965` - `storage_function="Bonds"` query
- Bonds are returned as list of tuples mapping neuron UID to bond tuples
  - `bittensor/core/async_subtensor.py:976` - `return b_map`

**Bond Calculation in Yuma Consensus:**

**1. Bond-Weight Calculation:**
- **Bonds penalty retrieval**: `bonds_penalty = Self::get_float_bonds_penalty(netuid)`
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:207-208` - Bonds penalty retrieval
- **Weight interpolation**: `weights_for_bonds = interpolate_sparse(&weights, &clipped_weights, n, bonds_penalty)`
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:625-627` - Weight interpolation for bonds
- **Mathematical meaning**: $\widetilde{W_{ij}} = (1-\beta)W_{ij} + \beta\overline{W_{ij}}$ where $\beta$ is bonds penalty

**2. Instant Bond Calculation:**
- **Bonds delta**: `bonds_delta = row_hadamard_sparse(&weights_for_bonds, &active_stake)`
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:680-682` - Instant bond calculation
- **Normalization**: `inplace_col_normalize_sparse(&mut bonds_delta, n)`
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:684` - Bond normalization
- **Mathematical meaning**: $\Delta B_{ij} = \frac{S_i \cdot \widetilde{W_{ij}}}{\sum_{k \in \mathbb{V}} S_k \cdot \widetilde{W_{kj}}}$

**3. EMA Bond Computation:**
- **Alpha calculation**: `alpha = 1 - bonds_moving_avg / 1_000_000`
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:1020-1025` - Alpha calculation
- **EMA computation**: `ema_bonds = mat_ema_sparse(&bonds_delta, &bonds, alpha)`
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:687` - EMA bond computation

**4. Bond Storage and Management:**
- **Permit-based retention**: Bonds stored only if neuron retains validator permit
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:849-862` - Bond retention logic
- **Storage format**: Bonds stored as `Vec<(u16, u16)>` pairs
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:852-854` - Bond storage format

**5. Dividend Calculation:**
- **Dividend computation**: `dividends = matmul_transpose_sparse(&ema_bonds, &incentive)`
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:713` - Dividend calculation
- **Normalization**: `inplace_normalize(&mut dividends)`
  - `subtensor/pallets/subtensor/src/epoch/run_epoch.rs:714` - Dividend normalization
- **Mathematical meaning**: $D_i = \sum_{j \in \mathbb{M}} B_{ij} \times I_j$ where:
  - $B_{ij}$ is the EMA bond from validator $i$ to miner $j$
  - $I_j$ is miner $j$'s incentive share

**Key Mathematical Insights:**
1. **Bonds = Economic Investment**: Bonds represent validator "investment" in miner performance
2. **Penalty Mechanism**: Bonds penalty ($\beta$) reduces bond value for out-of-consensus weights
3. **EMA Smoothing**: Bonds change gradually over time, preventing manipulation
4. **Consensus Alignment**: Bonds incentivize validators to align with network consensus
5. **Economic Security**: Bonds create skin-in-the-game for validators

**Network Security Properties:**
- **Anti-manipulation**: Bond penalties make weight manipulation economically costly
- **Consensus stability**: Bonds create economic incentives for consensus alignment
- **Validator commitment**: Bonds require validators to commit to their evaluations
- **Market-based incentives**: Bonds create a market for validator-miner relationships
- **Dynamic adjustment**: Bonds adapt to changing network conditions and consensus

**Complete Bond Flow Implementation:**

**1. Weight Setting and Storage:**
- Validators set weights via `set_weights()` extrinsic
  - `pallets/subtensor/src/subnets/weights.rs:676` - `pub fn do_set_weights()`
- Weights are stored in blockchain storage as `Weights<T>` double map
  - `pallets/subtensor/src/lib.rs:1543-1549` - `pub type Weights<T: Config> = StorageDoubleMap`

**2. Consensus Calculation:**
- **Consensus computation**: `consensus = weighted_median_col_sparse(&active_stake, &weights, n, kappa)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:595` - Consensus calculation
- **Weight clipping**: `clipped_weights = col_clip_sparse(&weights, &consensus)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:598` - Weight clipping at consensus

**3. Bond-Weight Calculation:**
- **Bonds penalty retrieval**: `bonds_penalty = Self::get_float_bonds_penalty(netuid)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:625` - Bonds penalty retrieval
- **Weight interpolation**: `weights_for_bonds = interpolate_sparse(&weights, &clipped_weights, n, bonds_penalty)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:625-627` - Bond-weight calculation

**4. Instant Bond Formation:**
- **Bonds delta**: `bonds_delta = row_hadamard_sparse(&weights_for_bonds, &active_stake)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:680-682` - Instant bond calculation
- **Normalization**: `inplace_col_normalize_sparse(&mut bonds_delta, n)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:684` - Bond normalization

**5. EMA Bond Computation:**
- **Alpha calculation**: `alpha = 1 - bonds_moving_avg / 1_000_000`
  - `pallets/subtensor/src/epoch/run_epoch.rs:1020-1025` - Alpha calculation
- **EMA computation**: `ema_bonds = mat_ema_sparse(&bonds_delta, &bonds, alpha)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:687` - EMA bond computation

**6. Bond Storage and Management:**
- **Permit-based retention**: Bonds stored only if neuron retains validator permit
  - `pallets/subtensor/src/epoch/run_epoch.rs:849-862` - Bond retention logic
- **Storage format**: Bonds stored as `Vec<(u16, u16)>` pairs
  - `pallets/subtensor/src/epoch/run_epoch.rs:852-854` - Bond storage format

**7. Dividend Calculation:**
- **Dividend computation**: `dividends = matmul_transpose_sparse(&ema_bonds, &incentive)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:713` - Dividend calculation
- **Normalization**: `inplace_normalize(&mut dividends)`
  - `pallets/subtensor/src/epoch/run_epoch.rs:714` - Dividend normalization

**Key Mathematical Insights:**
1. **Bonds = Economic Investment**: Bonds represent validator "investment" in miner performance
2. **Penalty Mechanism**: Bonds penalty ($\beta$) reduces bond value for out-of-consensus weights
3. **EMA Smoothing**: Bonds change gradually over time, preventing manipulation
4. **Consensus Alignment**: Bonds incentivize validators to align with network consensus
5. **Economic Security**: Bonds create skin-in-the-game for validators

**Network Security Properties:**
- **Anti-manipulation**: Bond penalties make weight manipulation economically costly
- **Consensus stability**: Bonds create economic incentives for consensus alignment
- **Validator commitment**: Bonds require validators to commit to their evaluations
- **Market-based incentives**: Bonds create a market for validator-miner relationships
- **Dynamic adjustment**: Bonds adapt to changing network conditions and consensus


## W 

### Wallet Address

A unique identifier derived from the public key, used as a destination for sending and receiving TAO tokens in the Bittensor network.

**See also:** [Wallets](./getting-started/wallets.md), [Working with Keys](./working-with-keys.md)

### Wallet Location

The directory path where the generated Bittensor wallets are stored locally on the user's machine.

**See also:** [Wallets](./getting-started/wallets.md), [Installation](./getting-started/installation.md)

### Weight Matrix

A matrix formed from the ranking weight vectors of all subnet validators in a subnet, used as input for the Yuma Consensus module to calculate emissions to that subnet.

**See also:** [Yuma Consensus](./yuma-consensus.md), [Consensus-Based Weights](./subnets/consensus-based-weights.md)

### Weight Vector

A vector maintained by each subnet validator, with each element representing the weight assigned to a subnet miner based on its performance.

The ranking weight vectors for each subnet are transmitted to the blockchain, where they combine to form the [weight matrix](#weight-matrix) that is input for Yuma Consensus.

**See also:** [Consensus-Based Weights](./subnets/consensus-based-weights.md), [Yuma Consensus](./yuma-consensus.md)

## Y 

### Yuma Consensus

The consensus mechanism in the Bittensor blockchain that computes emissions to participants. 

**See also:** [Yuma Consensus](./yuma-consensus.md)
