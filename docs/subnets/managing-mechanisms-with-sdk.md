---
title: "Managing Multiple Incentive Mechanisms with SDK"
---

# Managing Multiple Incentive Mechanisms with SDK

This guide shows subnet owners how to configure and manage multiple incentive mechanisms within a single subnet using the Bittensor SDK. For background on the concepts, see [Understanding Multiple Incentive Mechanisms](understanding-multiple-mech-subnets). For command-line management, see [Managing Mechanisms with BTCLI](managing-mechanisms-btcli).

## Overview

Multiple incentive mechanisms allow subnet owners to:
- Distribute emissions across different evaluation criteria
- Run independent Yuma Consensus for each mechanism
- Control emission proportions between mechanisms
- Maintain separate bond pools and weight matrices

:::info Backward Compatibility
All existing methods work identically when called with the default `mechid=0` parameter. Existing subnets continue operating normally with a single mechanism.
:::

## Key Concepts

- **mechid**: Mechanism ID (0, 1, 2, etc.) - defaults to 0 for backward compatibility
- **Emission Split**: How total subnet emissions are distributed between mechanisms
- **Independent Operations**: Each mechanism maintains separate weights, bonds, and incentives
- **Rate Limiting**: Mechanism count changes are limited to once per 7200 blocks

## Common Use Case Flows

### 1. Initial Setup: Creating Multiple Mechanisms

```python
import bittensor as bt
from bittensor.core.extrinsics.sudo import sudo_set_mechanism_count_extrinsic

# Initialize connection and wallet
subtensor = bt.Subtensor(network="finney")
subnet_owner_wallet = bt.Wallet("subnet_owner")

netuid = 14  # Your subnet ID

# Step 1: Set the number of mechanisms (requires subnet owner privileges)
success, message = sudo_set_mechanism_count_extrinsic(
    subtensor=subtensor,
    wallet=subnet_owner_wallet,
    netuid=netuid,
    mech_count=3  # Create 3 mechanisms (IDs: 0, 1, 2)
)

if success:
    print(f"Successfully created 3 mechanisms for subnet {netuid}")
else:
    print(f"Failed to create mechanisms: {message}")
```

### 2. Configuring Emission Distribution

```python
from bittensor.core.extrinsics.sudo import sudo_set_mechanism_emission_split_extrinsic

# Set custom emission distribution: 50%, 30%, 20%
# Values are calculated as percentage * 65535
emission_splits = [
    int(0.50 * 65535),  # 50% to mechanism 0
    int(0.30 * 65535),  # 30% to mechanism 1  
    int(0.20 * 65535),  # 20% to mechanism 2
]

success, message = sudo_set_mechanism_emission_split_extrinsic(
    subtensor=subtensor,
    wallet=subnet_owner_wallet,
    netuid=netuid,
    maybe_split=emission_splits
)

if success:
    print("Emission split configured successfully")
    # Verify the configuration
    percentages = subtensor.get_mechanism_emission_split(netuid=netuid)
    print(f"Current emission split: {percentages}")
else:
    print(f"Failed to set emission split: {message}")
```

### 3. Validator Weight Setting Across Mechanisms

```python
# Validator setting weights for different mechanisms
validator_wallet = bt.Wallet("validator")

# Mechanism 0: Text generation evaluation
uids_0 = [0, 1, 2, 3, 4]
weights_0 = [0.3, 0.25, 0.2, 0.15, 0.1]  # Normalized weights

success_0, message_0 = subtensor.set_weights(
    wallet=validator_wallet,
    netuid=netuid,
    mechid=0,  # Mechanism 0
    uids=uids_0,
    weights=weights_0,
)

# Mechanism 1: Code generation evaluation  
uids_1 = [0, 1, 2, 3, 4]
weights_1 = [0.1, 0.4, 0.3, 0.15, 0.05]  # Different weights for different criteria

success_1, message_1 = subtensor.set_weights(
    wallet=validator_wallet,
    netuid=netuid,
    mechid=1,  # Mechanism 1
    uids=uids_1,
    weights=weights_1,
)

# Mechanism 2: Multimodal evaluation
uids_2 = [0, 1, 2, 3, 4]
weights_2 = [0.2, 0.2, 0.25, 0.25, 0.1]

success_2, message_2 = subtensor.set_weights(
    wallet=validator_wallet,
    netuid=netuid,
    mechid=2,  # Mechanism 2
    uids=uids_2,
    weights=weights_2,
)

print(f"Mechanism 0 weights: {'Success' if success_0 else 'Failed'}")
print(f"Mechanism 1 weights: {'Success' if success_1 else 'Failed'}")
print(f"Mechanism 2 weights: {'Success' if success_2 else 'Failed'}")
```

### 4. Commit-Reveal Weight Setting

```python
import random

# For subnets with commit-reveal enabled
validator_wallet = bt.Wallet("validator")

# Generate salt for commitment
salt = [random.randint(0, 1000) for _ in range(len(uids_0))]

# Commit weights for mechanism 1
success, message = subtensor.commit_weights(
    wallet=validator_wallet,
    netuid=netuid,
    mechid=1,
    salt=salt,
    uids=uids_1,
    weights=weights_1,
)

if success:
    print("Weights committed successfully")
    
    # Later, reveal the weights (after commit period)
    success_reveal, message_reveal = subtensor.reveal_weights(
        wallet=validator_wallet,
        netuid=netuid,
        mechid=1,
        salt=salt,
        uids=uids_1,
        weights=weights_1,
    )
    
    if success_reveal:
        print("Weights revealed successfully")
    else:
        print(f"Failed to reveal weights: {message_reveal}")
else:
    print(f"Failed to commit weights: {message}")
```

## Monitoring and Querying Mechanisms

### 1. Checking Current Configuration

```python
# Get current mechanism count
try:
    mech_count = subtensor.get_mechanism_count(netuid=netuid)
    print(f"Subnet {netuid} has {mech_count} mechanisms")
except Exception as e:
    print(f"Error getting mechanism count: {e}")

# Get emission distribution
try:
    emission_splits = subtensor.get_mechanism_emission_split(netuid=netuid)
    print(f"Emission splits: {emission_splits}")
    
    # Convert to percentages
    for i, split in enumerate(emission_splits):
        percentage = (split / 65535) * 100
        print(f"Mechanism {i}: {percentage:.1f}%")
except Exception as e:
    print(f"Error getting emission splits: {e}")
```

### 2. Querying Mechanism Data

```python
# Get weights for specific mechanisms
for mechid in range(3):  # Assuming 3 mechanisms
    try:
        weights = subtensor.weights(netuid=netuid, mechid=mechid)
        print(f"Mechanism {mechid} weights: {len(weights)} entries")
    except Exception as e:
        print(f"Error getting weights for mechanism {mechid}: {e}")

# Get bonds for specific mechanisms
for mechid in range(3):
    try:
        bonds = subtensor.bonds(netuid=netuid, mechid=mechid)
        print(f"Mechanism {mechid} bonds: {len(bonds)} entries")
    except Exception as e:
        print(f"Error getting bonds for mechanism {mechid}: {e}")
```

### 3. Getting Mechanism-Specific Metagraph Info

```python
from bittensor.core.chain_data import SelectiveMetagraphIndex

# Get full metagraph info for a specific mechanism
try:
    mechagraph = subtensor.get_mechagraph_info(
        netuid=netuid,
        mechid=1
    )
    print(f"Mechagraph for mechanism 1: {mechagraph}")
except Exception as e:
    print(f"Error getting mechagraph: {e}")

# Get selective metagraph info (more efficient)
field_indices = [
    SelectiveMetagraphIndex.Netuid.value,
    SelectiveMetagraphIndex.Name.value,
    SelectiveMetagraphIndex.NumUids.value,
]

try:
    selective_meta = subtensor.get_selective_mechagraph_info(
        netuid=netuid,
        mechid=1,
        field_indices=field_indices,
    )
    print(f"Selective mechagraph data: {selective_meta}")
except Exception as e:
    print(f"Error getting selective mechagraph: {e}")

# Get all mechagraphs at once
try:
    all_mechagraphs = subtensor.get_all_mechagraphs_info()
    print(f"Retrieved {len(all_mechagraphs)} mechagraphs")
except Exception as e:
    print(f"Error getting all mechagraphs: {e}")
```

### 4. Checking Timelocked Weight Commits

```python
# Check timelocked weight commits for each mechanism
for mechid in range(3):
    try:
        commits = subtensor.get_timelocked_weight_commits(
            netuid=netuid,
            mechid=mechid
        )
        print(f"Mechanism {mechid} timelocked commits: {len(commits)}")
    except Exception as e:
        print(f"Error getting timelocked commits for mechanism {mechid}: {e}")
```

## Migration Strategies

### 1. Gradual Migration from Single to Multiple Mechanisms

```python
def migrate_to_multiple_mechanisms(subtensor, wallet, netuid, target_mechanisms=2):
    """
    Gradually migrate from single mechanism to multiple mechanisms
    """
    print(f"Starting migration to {target_mechanisms} mechanisms...")
    
    # Step 1: Create additional mechanisms
    success, message = sudo_set_mechanism_count_extrinsic(
        subtensor=subtensor,
        wallet=wallet,
        netuid=netuid,
        mech_count=target_mechanisms
    )
    
    if not success:
        print(f"Failed to create mechanisms: {message}")
        return False
    
    # Step 2: Initially set equal distribution
    equal_split = [int(65535 / target_mechanisms)] * target_mechanisms
    # Adjust for rounding
    equal_split[0] += 65535 - sum(equal_split)
    
    success, message = sudo_set_mechanism_emission_split_extrinsic(
        subtensor=subtensor,
        wallet=wallet,
        netuid=netuid,
        maybe_split=equal_split
    )
    
    if success:
        print("Migration completed successfully")
        print("Validators should now start setting weights for all mechanisms")
        return True
    else:
        print(f"Failed to set emission split: {message}")
        return False

# Example usage
migrate_to_multiple_mechanisms(subtensor, subnet_owner_wallet, netuid, 2)
```

### 2. Rebalancing Emission Distribution

```python
def rebalance_emissions(subtensor, wallet, netuid, new_splits):
    """
    Rebalance emission distribution between mechanisms
    
    Args:
        new_splits: List of percentages (must sum to 100)
    """
    if abs(sum(new_splits) - 100) > 0.01:
        print("Error: Splits must sum to 100%")
        return False
    
    # Convert percentages to chain format
    chain_splits = [int(split * 655.35) for split in new_splits]
    
    # Adjust for rounding errors
    total = sum(chain_splits)
    if total != 65535:
        chain_splits[0] += 65535 - total
    
    success, message = sudo_set_mechanism_emission_split_extrinsic(
        subtensor=subtensor,
        wallet=wallet,
        netuid=netuid,
        maybe_split=chain_splits
    )
    
    if success:
        print(f"Successfully rebalanced emissions: {new_splits}")
        return True
    else:
        print(f"Failed to rebalance: {message}")
        return False

# Example: Shift more emissions to mechanism 1
rebalance_emissions(
    subtensor, 
    subnet_owner_wallet, 
    netuid, 
    [40, 50, 10]  # 40%, 50%, 10%
)
```

## Error Handling and Troubleshooting

### Common Issues and Solutions

#### 1. Rate Limiting
```python
def check_admin_freeze_window(subtensor, netuid):
    """Check if subnet is in admin freeze window"""
    try:
        in_freeze = subtensor.is_in_admin_freeze_window(netuid=netuid)
        if in_freeze:
            print(f"Subnet {netuid} is in admin freeze window")
            print("Wait 7200 blocks (~24 hours) before making changes")
            return True
        return False
    except Exception as e:
        print(f"Error checking freeze window: {e}")
        return True

# Always check before making mechanism changes
if not check_admin_freeze_window(subtensor, netuid):
    # Proceed with mechanism changes
    pass
```

#### 2. Permission Issues
```python
def verify_subnet_ownership(subtensor, wallet, netuid):
    """Verify wallet owns the subnet"""
    try:
        subnet_info = subtensor.get_subnet_info(netuid)
        if not subnet_info:
            print(f"Subnet {netuid} does not exist")
            return False
            
        owner_hotkey = subtensor.get_subnet_owner_hotkey(netuid)
        if owner_hotkey != wallet.hotkey.ss58_address:
            print(f"Wallet {wallet.name} does not own subnet {netuid}")
            print(f"Owner: {owner_hotkey}")
            print(f"Your hotkey: {wallet.hotkey.ss58_address}")
            return False
            
        return True
    except Exception as e:
        print(f"Error verifying ownership: {e}")
        return False

# Verify before making changes
if verify_subnet_ownership(subtensor, subnet_owner_wallet, netuid):
    # Proceed with mechanism management
    pass
```

#### 3. Weight Setting Errors
```python
def safe_set_weights(subtensor, wallet, netuid, mechid, uids, weights):
    """Safely set weights with error handling"""
    try:
        # Validate inputs
        if len(uids) != len(weights):
            raise ValueError("UIDs and weights must have same length")
            
        # Normalize weights
        weight_sum = sum(weights)
        if weight_sum == 0:
            raise ValueError("Weight sum cannot be zero")
            
        normalized_weights = [w / weight_sum for w in weights]
        
        # Check if commit-reveal is enabled
        commit_reveal = subtensor.commit_reveal_enabled(netuid)
        
        if commit_reveal:
            print(f"Commit-reveal enabled for subnet {netuid}")
            print("Use commit_weights() and reveal_weights() instead")
            return False
            
        # Set weights
        success, message = subtensor.set_weights(
            wallet=wallet,
            netuid=netuid,
            mechid=mechid,
            uids=uids,
            weights=normalized_weights,
        )
        
        if success:
            print(f"Successfully set weights for mechanism {mechid}")
            return True
        else:
            print(f"Failed to set weights: {message}")
            return False
            
    except Exception as e:
        print(f"Error setting weights: {e}")
        return False

# Example usage
safe_set_weights(
    subtensor, 
    validator_wallet, 
    netuid, 
    mechid=1, 
    uids=[0, 1, 2], 
    weights=[0.5, 0.3, 0.2]
)
```

#### 4. Mechanism Query Errors
```python
def safe_query_mechanism(subtensor, netuid, mechid, query_type="weights"):
    """Safely query mechanism data with error handling"""
    try:
        # Check if mechanism exists
        mech_count = subtensor.get_mechanism_count(netuid)
        if mechid >= mech_count:
            print(f"Mechanism {mechid} does not exist (count: {mech_count})")
            return None
            
        if query_type == "weights":
            return subtensor.weights(netuid=netuid, mechid=mechid)
        elif query_type == "bonds":
            return subtensor.bonds(netuid=netuid, mechid=mechid)
        elif query_type == "commits":
            return subtensor.get_timelocked_weight_commits(netuid=netuid, mechid=mechid)
        else:
            raise ValueError(f"Unknown query type: {query_type}")
            
    except Exception as e:
        print(f"Error querying mechanism {mechid} {query_type}: {e}")
        return None

# Example usage
weights = safe_query_mechanism(subtensor, netuid, mechid=1, query_type="weights")
if weights:
    print(f"Retrieved {len(weights)} weight entries")
```

## Best Practices

### 1. Testing on Testnet First
```python
# Always test on testnet before mainnet
testnet_subtensor = bt.Subtensor(network="test")
# Run all mechanism operations on testnet first
```

### 2. Gradual Emission Rebalancing
```python
def gradual_rebalance(subtensor, wallet, netuid, target_splits, steps=5):
    """
    Gradually rebalance emissions over multiple epochs
    """
    current_splits = subtensor.get_mechanism_emission_split(netuid=netuid)
    current_percentages = [(s / 65535) * 100 for s in current_splits]
    
    for step in range(1, steps + 1):
        # Calculate intermediate splits
        intermediate_splits = []
        for i, (current, target) in enumerate(zip(current_percentages, target_splits)):
            intermediate = current + (target - current) * (step / steps)
            intermediate_splits.append(intermediate)
        
        print(f"Step {step}/{steps}: {intermediate_splits}")
        rebalance_emissions(subtensor, wallet, netuid, intermediate_splits)
        
        # Wait for next epoch or desired interval
        # time.sleep(epoch_duration)
```

### 3. Monitoring Mechanism Health
```python
def monitor_mechanism_health(subtensor, netuid):
    """
    Monitor the health of all mechanisms in a subnet
    """
    try:
        mech_count = subtensor.get_mechanism_count(netuid)
        print(f"Monitoring {mech_count} mechanisms for subnet {netuid}")
        
        for mechid in range(mech_count):
            weights = subtensor.weights(netuid=netuid, mechid=mechid)
            bonds = subtensor.bonds(netuid=netuid, mechid=mechid)
            
            print(f"Mechanism {mechid}:")
            print(f"  - Active validators: {len(weights)}")
            print(f"  - Bond entries: {len(bonds)}")
            
            # Check for weight distribution
            if weights:
                total_weights = sum(sum(w[1]) for w in weights)
                print(f"  - Total weight: {total_weights}")
            
    except Exception as e:
        print(f"Error monitoring mechanisms: {e}")

# Run periodically
monitor_mechanism_health(subtensor, netuid)
```

## Summary

Managing multiple incentive mechanisms requires careful planning and gradual implementation. Key points:

1. **Start Simple**: Begin with 2 mechanisms and equal emission splits
2. **Test Thoroughly**: Use testnet for all initial testing
3. **Monitor Closely**: Track validator participation across all mechanisms
4. **Rebalance Gradually**: Avoid sudden large changes to emission distribution
5. **Handle Errors Gracefully**: Implement proper error handling and validation

The multiple mechanism system provides powerful tools for subnet optimization while maintaining backward compatibility with existing operations.
