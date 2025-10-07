---
title: "Auto Staking for Miners"
---

# Auto Staking for Miners

Auto staking allows miners to automatically stake their mining income to a validator of their choice, streamlining the process of compound staking without manual intervention.

## Overview

The auto staking feature enables miners to set a destination validator where their mining emissions will be automatically staked. This eliminates the need for manual staking operations and ensures that mining rewards are continuously reinvested into the network.

## How Auto Staking Works

When auto staking is enabled:

1. **Mining Income**: As a miner earns emissions from your subnet participation
2. **Automatic Staking**: These emissions are automatically staked to your chosen validator
3. **Compound Growth**: Your stake grows automatically without manual intervention
4. **Validator Selection**: You choose which validator receives your auto-staked TAO

## Setting Up Auto Staking

### Prerequisites

- A coldkey
- A target hotkey to receive the auto-staked TAO (can be any hotkey, including the miner's own hotkey)


### Configuration

Auto staking is configured through the `set_coldkey_auto_stake_hotkey` extrinsic. This function allows a coldkey to designate a hotkey where all future mining rewards will be automatically staked.

**Extrinsic Details:**
- **Function**: `set_coldkey_auto_stake_hotkey`
- **Call Index**: 114
- **Parameters**: 
  - `origin`: The coldkey signature
  - `hotkey`: The target hotkey account ID for auto-staking
- **Weight**: ~5.17M + 0 reads + 1 write
- **Payment**: No (no transaction fee required)

Source: [`subtensor/pallets/subtensor/src/macros/dispatches.rs:2023-2035`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/macros/dispatches.rs#L2023-L2035)

The auto staking feature is implemented in the [Subtensor runtime](https://github.com/opentensor/subtensor/pull/2008) and stores the destination in the `AutoStakeDestination` storage map.

**Storage Definition:**
```rust
#[pallet::storage] // --- MAP ( cold ) --> hot | Returns the hotkey a coldkey will autostake to with mining rewards.
pub type AutoStakeDestination<T: Config> =
    StorageMap<_, Blake2_128Concat, T::AccountId, T::AccountId, OptionQuery>;
```

Source: [`subtensor/pallets/subtensor/src/lib.rs:1086-1088`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1086-L1088)

### How It Works

1. **Coldkey Sets Destination**: The coldkey calls `set_coldkey_auto_stake_hotkey` with the target hotkey
2. **Storage Update**: The `AutoStakeDestination` storage map is updated with `coldkey -> hotkey` mapping
3. **Mining Rewards**: When mining incentives are distributed, the system checks for an auto-stake destination
4. **Automatic Staking**: If a destination exists, rewards are staked to that hotkey instead of the original miner hotkey

### Checking Auto Staking Status

You can check your auto staking configuration by querying the `AutoStakeDestination` storage map for your coldkey.

## Benefits of Auto Staking

### For Miners

- **Automated Compound Growth**: Mining rewards are automatically reinvested
- **Reduced Manual Operations**: No need to manually stake earnings
- **Consistent Staking**: Ensures regular staking without forgetting or delays
- **Validator Support**: Helps support your chosen validator's operations

### For Validators

- **Predictable Staking**: Receives regular staking from auto-staking miners
- **Network Stability**: Contributes to consistent validator stake levels
- **Reduced Friction**: Miners are more likely to stake when it's automated

## Important Considerations

### Validator Selection

Choose your auto-staking destination carefully:

- **Validator Performance**: Select validators with good track records
- **Subnet Alignment**: Consider validators that align with your subnet interests
- **Network Health**: Support validators that contribute to network stability

### Monitoring

Even with auto staking enabled, you should:

- **Monitor Validator Performance**: Ensure your chosen validator remains active and performs well
- **Check Staking Status**: Periodically verify that auto staking is working correctly
- **Review Emissions**: Track your mining emissions and staking growth

### Disabling Auto Staking

You can disable auto staking by calling `set_coldkey_auto_stake_hotkey` with the same hotkey as the miner (effectively setting it to stake to itself), or by removing the entry from the `AutoStakeDestination` storage map through a runtime upgrade or direct storage manipulation.

## Technical Details

### Implementation

Auto staking is implemented in the [Subtensor runtime](https://github.com/opentensor/subtensor/pull/2008) with the following key components:

1. **Storage**: `AutoStakeDestination<T>` storage map that maps coldkey to hotkey
2. **Extrinsic**: `set_coldkey_auto_stake_hotkey` function (call index 114)
3. **Logic**: Modified `run_coinbase.rs` to check for auto-stake destination during incentive distribution

**Code Flow:**
```rust
// In run_coinbase.rs
let owner: T::AccountId = Owner::<T>::get(&hotkey);
let destination = AutoStakeDestination::<T>::get(&owner).unwrap_or(hotkey.clone());
Self::increase_stake_for_hotkey_and_coldkey_on_subnet(
    &destination,  // Uses auto-stake destination if set
    &owner,
    netuid,
    incentive,
);
```

Source: [`subtensor/pallets/subtensor/src/coinbase/run_coinbase.rs:514-521`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/run_coinbase.rs#L514-L521)

### Transaction Costs

The `set_coldkey_auto_stake_hotkey` extrinsic has a weight of approximately 5.17M + 0 database reads + 1 database write, with no transaction fees required.

### Coldkey Swap Integration

When a coldkey is swapped, the auto-stake destination is automatically transferred to the new coldkey, ensuring continuity of auto-staking functionality.

```rust
// In swap_coldkey.rs
if let Some(old_auto_stake_hotkey) = AutoStakeDestination::<T>::get(old_coldkey) {
    AutoStakeDestination::<T>::remove(old_coldkey);
    AutoStakeDestination::<T>::insert(new_coldkey, old_auto_stake_hotkey);
}
```

Source: [`subtensor/pallets/subtensor/src/swap/swap_coldkey.rs:181-184`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/swap/swap_coldkey.rs#L181-L184)

## Best Practices

### For Miners

1. **Start Small**: Begin with a portion of your mining income to test the system
2. **Choose Reliable Validators**: Select validators with consistent performance
3. **Monitor Regularly**: Check your auto staking status and validator performance
4. **Keep Backup Plans**: Have manual staking as a backup option

### For Validators

1. **Maintain Performance**: Keep your validator running smoothly to retain auto-staking miners
2. **Communicate Changes**: Inform miners of any planned validator changes
3. **Monitor Staking**: Track incoming auto-staked TAO from miners

## Troubleshooting

### Common Issues

**Auto staking not working:**
- Verify your `AutoStakeDestination` storage map entry is correctly set
- Check that your target hotkey is valid and owned by the same coldkey
- Ensure sufficient TAO balance for transaction fees
- Verify the extrinsic call was successful

**Target hotkey becomes invalid:**
- Auto staking will continue to the set destination even if the hotkey becomes inactive
- Update the destination by calling `set_coldkey_auto_stake_hotkey` with a new target

**Insufficient balance:**
- The `set_coldkey_auto_stake_hotkey` extrinsic requires no transaction fees, so balance is not an issue
- Check your mining emissions are being received and distributed

### Getting Help

If you encounter issues with auto staking:

1. Review the [Subtensor runtime implementation](https://github.com/opentensor/subtensor/pull/2008)
2. Check validator status on [TAO.app](https://tao.app)
3. Join the Bittensor community for support

## Related Topics

- [Mining in Bittensor](./) - Overview of mining operations
- [Staking and Delegation](../staking-and-delegation/delegation) - General staking information
- [Wallet Management](../keys/wallets) - Managing your keys and TAO
