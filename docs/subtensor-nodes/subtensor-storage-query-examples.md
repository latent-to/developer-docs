---
title: "Subtensor Storage Query Examples"
---

# Subtensor Storage Query Examples

## 1. AccumulatedLeaseDividends

- **Description**: Storage for a lease ID's accumulated dividends.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `lease_id`: `u32`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    lease_id = 1
    result = substrate.query('SubtensorModule', 'AccumulatedLeaseDividends', [lease_id])
    print(result.value)
    ```
## 2. Active

- **Description**: Storage for Active.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Active', [netuid])
    print(result.value)
    ```
## 3. ActivityCutoff

- **Description**: Activity cutoff for networks.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `5000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'ActivityCutoff', [netuid])
    print(result.value)
    ```
## 4. AdjustmentAlpha

- **Description**: Alpha adjustment value for the network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'AdjustmentAlpha', [netuid])
    print(result.value)
    ```
## 5. AdjustmentInterval

- **Description**: Adjustment interval for networks.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `100`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'AdjustmentInterval', [netuid])
    print(result.value)
    ```
## 6. AdminFreezeWindow

- **Description**: Global window (in blocks) at the end of each tempo where admin ops are disallowed
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'AdminFreezeWindow')
    print(result.value)
    ```
## 7. Alpha

- **Description**: Storage for Alpha.
- **Query Type**: `(AccountId, AccountId, u16) -> unknown`
- **Parameters**:
  - `hotkey`: `AccountId`
  - `coldkey`: `AccountId`
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    from bittensor_wallet import Keypair
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    from bittensor_wallet import Keypair
    coldkey = Keypair.create_from_uri('//Bob').ss58_address
    netuid = 1
    result = substrate.query('SubtensorModule', 'Alpha', [hotkey, coldkey, netuid])
    print(result)
    ```
## 8. AlphaDividendsPerSubnet

- **Description**: Last total alpha dividend for a hotkey on a subnet.
- **Query Type**: `(u16, AccountId) -> u64`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'AlphaDividendsPerSubnet', [netuid, hotkey])
    print(result.value)
    ```
## 9. AlphaSigmoidSteepness

- **Description**: Storage for AlphaSigmoidSteepness.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'AlphaSigmoidSteepness', [netuid])
    print(result.value)
    ```
## 10. AlphaValues

- **Description**: Alpha values for the network (lower and upper alpha).
- **Query Type**: `u16 -> (u16, u16)`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `(45875, 58982)`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'AlphaValues', [netuid])
    print(result.value)
    ```
## 11. AssociatedEvmAddress

- **Description**: Storage for the EVM address associated with a subnet's uid.
- **Query Type**: `(u16, u16) -> u16`
- **Parameters**:
  - `key`: `AccountId`
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    uid = 1
    result = substrate.query('SubtensorModule', 'AssociatedEvmAddress', [netuid, uid])
    print(result)
    ```
## 12. AutoStakeDestination

- **Description**: Storage for AutoStakeDestination.
- **Query Type**: `(u16, AccountId) -> unknown`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    from bittensor_wallet import Keypair
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'AutoStakeDestination', [hotkey, netuid])
    print(result)
    ```
## 13. AutoStakeDestinationColdkeys

- **Description**: Storage for AutoStakeDestinationColdkeys.
- **Query Type**: `(u16, AccountId) -> unknown`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    from bittensor_wallet import Keypair
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'AutoStakeDestinationColdkeys', [hotkey, netuid])
    print(result.value)
    ```
## 14. Axons

- **Description**: Axon information for a given hotkey within a network.
- **Query Type**: `(u16, AccountId) -> AxonInfoOf`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `None`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'Axons', [netuid, hotkey])
    print(result)
    ```
## 15. BlockAtRegistration

- **Description**: Block number at registration for a given UID.
- **Query Type**: `(u16, u16) -> u64`
- **Parameters**:
  - `netuid`: `u16`
  - `uid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    uid = 123
    result = substrate.query('SubtensorModule', 'BlockAtRegistration', [netuid, uid])
    print(result.value)
    ```
## 16. BlockEmission

- **Description**: The total block emission value.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `1000000000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'BlockEmission')
    print(result.value)
    ```
## 17. BlocksSinceLastStep

- **Description**: Number of blocks since the last mechanism step.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'BlocksSinceLastStep', [netuid])
    print(result.value)
    ```
## 18. Bonds

- **Description**: Bond values of UIDs in a network.
- **Query Type**: `(u16, u16) -> Vec<(u16, u16)>`
- **Parameters**:
  - `netuid`: `u16`
  - `uid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    uid = 123
    result = substrate.query('SubtensorModule', 'Bonds', [netuid, uid])
    print(result.value)
    ```
## 19. BondsMovingAverage

- **Description**: Moving average of bonds in the network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `900000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'BondsMovingAverage', [netuid])
    print(result.value)
    ```
## 20. BondsPenalty

- **Description**: Bonds penalty setting for a subnet.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'BondsPenalty', [netuid])
    print(result.value)
    ```
## 21. BondsResetOn

- **Description**: Storage for BondsResetOn.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'BondsResetOn', [netuid])
    print(result.value)
    ```
## 22. Burn

- **Description**: Burn value for a given network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `1000000000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Burn', [netuid])
    print(result.value)
    ```
## 23. BurnRegistrationsThisInterval

- **Description**: Number of burn registrations in this interval.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'BurnRegistrationsThisInterval', [netuid])
    print(result.value)
    ```
## 24. ChildKeys

- **Description**: Maps parent keys to child keys with proportions.
- **Query Type**: `(AccountId, u16) -> Vec<(u64, AccountId)>`
- **Parameters**:
  - `parent`: `AccountId`
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    parent = Keypair.create_from_uri('//Alice').ss58_address
    netuid = 1
    result = substrate.query('SubtensorModule', 'ChildKeys', [parent, netuid])
    print(result.value)
    ```
## 25. ChildkeyTake

- **Description**: Returns the childkey take for a given hotkey on a specific subnet.
- **Query Type**: `(AccountId, u16) -> u16`
- **Parameters**:
  - `hotkey`: `AccountId`
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    netuid = 1
    result = substrate.query('SubtensorModule', 'ChildkeyTake', [hotkey, netuid])
    print(result.value)
    ```
## 26. CKBurn

- **Description**: Storage for coldkey burn.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'CKBurn')
    print(result.value)
    ```
## 27. ColdkeySwapRescheduleDuration

- **Description**: Storage for ColdkeySwapRescheduleDuration.
- **Query Type**: `u32`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'ColdkeySwapRescheduleDuration')
    print(result.value)
    ```
## 28. ColdkeySwapScheduled

- **Description**: Storage for ColdkeySwapScheduled.
- **Query Type**: `u16 -> AccountId`
- **Parameters**:
  - `coldkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    from bittensor_wallet import Keypair
    coldkey = Keypair.create_from_uri('//Bob').ss58_address
    result = substrate.query('SubtensorModule', 'ColdkeySwapScheduled', [coldkey])
    print(result.value)
    ```
## 29. ColdkeySwapScheduleDuration

- **Description**: The block duration for which a coldkey swap schedule must wait before execution.
- **Query Type**: `u32`
- **Parameters**: None
- **Default Value**: `36000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'ColdkeySwapScheduleDuration')
    print(result.value)
    ```
## 30. CommitRevealWeightsEnabled

- **Description**: Indicates whether the commit-reveal process for weights is enabled for a given network.
- **Query Type**: `u16 -> bool`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `false`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'CommitRevealWeightsEnabled', [netuid])
    print(result.value)
    ```
## 31. CommitRevealWeightsVersion

- **Description**: Storage for CommitRevealWeightsVersion.
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'CommitRevealWeightsVersion')
    print(result.value)
    ```
## 32. Consensus

- **Description**: Consensus values of UIDs in a network.
- **Query Type**: `u16 -> Vec<u16>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Consensus', [netuid])
    print(result.value)
    ```
## 33. CRV3WeightCommits

- **Description**: Stores a queue of v3 commits for an account on a given netuid and epoch.
- **Query Type**: `(u16, u64) -> VecDeque<(AccountId, Vec<u8>, u64)>`
- **Parameters**:
  - `netuid`: `u16`
  - `commit_epoch`: `u64`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    commit_epoch = 100
    result = substrate.query('SubtensorModule', 'CRV3WeightCommits', [netuid, commit_epoch])
    print(result.value)
    ```
## 34. CRV3WeightCommitsV2

- **Description**: 
- **Query Type**: `(u16, u64) -> VecDeque<(AccountId, Vec<u8>, u64)>`
- **Parameters**:
  - `key`: `AccountId`
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    commit_epoch = 100
    result = substrate.query('SubtensorModule', 'CRV3WeightCommitsV2', [netuid, commit_epoch])
    print(result.value)
    ```
## 35. Delegates

- **Description**: Returns the hotkey delegation take, signaling that this key is open for delegation.
- **Query Type**: `AccountId -> u16`
- **Parameters**:
  - `hotkey`: `AccountId`
- **Default Value**: `11796`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'Delegates', [hotkey])
    print(result.value)
    ```
## 36. Difficulty

- **Description**: Difficulty parameter for a given network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `10000000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Difficulty', [netuid])
    print(result.value)
    ```
## 37. DissolveNetworkScheduleDuration

- **Description**: The block duration required before a network dissolve schedule executes.
- **Query Type**: `u32`
- **Parameters**: None
- **Default Value**: `36000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'DissolveNetworkScheduleDuration')
    print(result.value)
    ```
## 38. Dividends

- **Description**: Dividend values of UIDs in a network.
- **Query Type**: `u16 -> Vec<u16>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Dividends', [netuid])
    print(result.value)
    ```
## 39. EMAPriceHalvingBlocks

- **Description**: Storage for EMAPriceHalvingBlocks.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'EMAPriceHalvingBlocks', [netuid])
    print(result.value)
    ```
## 40. Emission

- **Description**: Emission values of UIDs in a network.
- **Query Type**: `u16 -> Vec<u64>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Emission', [netuid])
    print(result.value)
    ```
## 41. FirstEmissionBlockNumber

- **Description**: Storage for FirstEmissionBlockNumber.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'FirstEmissionBlockNumber', [netuid])
    print(result.value)
    ```
## 42. HasMigrationRun

- **Description**: Storage for migration run status.
- **Query Type**: `Vec<u8> -> bool`
- **Parameters**:
  - `key`: `Vec<u8>`
- **Default Value**: `false`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    key = b"migrate_identities"
    result = substrate.query('SubtensorModule', 'HasMigrationRun', [key])
    print(result.value)
    ```
## 43. Identities

- **Description**: Storage for Identities.
- **Query Type**: `u16 -> AccountId`
- **Parameters**:
  - `coldkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    from bittensor_wallet import Keypair
    coldkey = Keypair.create_from_uri('//Bob').ss58_address
    result = substrate.query('SubtensorModule', 'Identities', [coldkey])
    print(result)
    ```
## 44. IdentitiesV2

- **Description**: Identity information for a given coldkey (v2 format).
- **Query Type**: `AccountId -> ChainIdentityOfV2`
- **Parameters**:
  - `coldkey`: `AccountId`
- **Default Value**: `None`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    coldkey = Keypair.create_from_uri('//Charlie').ss58_address
    result = substrate.query('SubtensorModule', 'IdentitiesV2', [coldkey])
    print(result)
    ```
## 45. ImmuneOwnerUidsLimit

- **Description**: List of subnet owner immune UIDs.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'ImmuneOwnerUidsLimit', [netuid])
    print(result.value)
    ```
## 46. ImmunityPeriod

- **Description**: Immunity period for networks.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `4096`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'ImmunityPeriod', [netuid])
    print(result.value)
    ```
## 47. Incentive

- **Description**: Incentive values of UIDs in a network.
- **Query Type**: `u16 -> Vec<u16>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Incentive', [netuid])
    print(result.value)
    ```
## 48. IsNetworkMember

- **Description**: Whether a hotkey is a member of a network.
- **Query Type**: `(AccountId, u16) -> bool`
- **Parameters**:
  - `hotkey`: `AccountId`
  - `netuid`: `u16`
- **Default Value**: `false`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    netuid = 1
    result = substrate.query('SubtensorModule', 'IsNetworkMember', [hotkey, netuid])
    print(result.value)
    ```
## 49. Kappa

- **Description**: Kappa parameter of the network.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `32767`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Kappa', [netuid])
    print(result.value)
    ```
## 50. Keys

- **Description**: Maps UID to hotkey within a network.
- **Query Type**: `(u16, u16) -> AccountId`
- **Parameters**:
  - `netuid`: `u16`
  - `uid`: `u16`
- **Default Value**: `AccountId` derived from trailing zeroes
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    uid = 123
    result = substrate.query('SubtensorModule', 'Keys', [netuid, uid])
    print(result)
    ```
## 51. LargestLocked

- **Description**: 
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'LargestLocked', [netuid])
    print(result.value)
    ```
## 52. LastAdjustmentBlock

- **Description**: Block number of the last adjustment for a given network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'LastAdjustmentBlock', [netuid])
    print(result.value)
    ```
## 53. LastColdkeyHotkeyStakeBlock

- **Description**: Last block at which stake was added/removed for a coldkey-hotkey pair.
- **Query Type**: `(AccountId, AccountId) -> u64`
- **Parameters**:
  - `coldkey`: `AccountId`
  - `hotkey`: `AccountId`
- **Default Value**: `None`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    coldkey = Keypair.create_from_uri('//Alice').ss58_address
    hotkey = Keypair.create_from_uri('//Bob').ss58_address
    result = substrate.query('SubtensorModule', 'LastColdkeyHotkeyStakeBlock', [coldkey, hotkey])
    print(result.value)
    ```
## 54. LastHotkeyEmissionOnNetuid

- **Description**: Last emission block for a hotkey on a given netuid.
- **Query Type**: `(AccountId, u16) -> u64`
- **Parameters**:
  - `hotkey`: `AccountId`
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    netuid = 1
    result = substrate.query('SubtensorModule', 'LastHotkeyEmissionOnNetuid', [hotkey, netuid])
    print(result.value)
    ```
## 55. LastHotkeySwapOnNetuid

- **Description**: Storage for LastHotkeySwapOnNetuid.
- **Query Type**: `(u16, AccountId) -> unknown`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    from bittensor_wallet import Keypair
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'LastHotkeySwapOnNetuid', [netuid, hotkey])
    print(result.value)
    ```
## 56. LastMechansimStepBlock

- **Description**: Last block when the mechanism step was performed.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'LastMechansimStepBlock', [netuid])
    print(result.value)
    ```
## 57. LastRateLimitedBlock

- **Description**: Storage for `LastRateLimitedBlock`
- **Query Type**: `u16 -> AccountId`
- **Parameters**:
  - `RatelimitKey`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    from bittensor_wallet import Keypair
    coldkey = Keypair.create_from_uri('//Bob').ss58_address
    result = substrate.query('SubtensorModule', 'LastRateLimitedBlock', [{"LastTxBlock": coldkey}])
    print(result.value)
    ```
## 58. LastTxBlock

- **Description**: Last block for a transaction key.
- **Query Type**: `AccountId -> u64`
- **Parameters**:
  - `key`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    key = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'LastTxBlock', [key])
    print(result.value)
    ```
## 59. LastTxBlockChildKeyTake

- **Description**: Last block for a childkey take transaction.
- **Query Type**: `AccountId -> u64`
- **Parameters**:
  - `key`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    key = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'LastTxBlockChildKeyTake', [key])
    print(result.value)
    ```
## 60. LastTxBlockDelegateTake

- **Description**: Last block for a delegate take transaction key.
- **Query Type**: `AccountId -> u64`
- **Parameters**:
  - `key`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    key = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'LastTxBlockDelegateTake', [key])
    print(result.value)
    ```
## 61. LastUpdate

- **Description**: Last update values of UIDs in a network.
- **Query Type**: `u16 -> Vec<u64>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'LastUpdate', [netuid])
    print(result.value)
    ```
## 62. LiquidAlphaOn

- **Description**: Whether Liquid Alpha is enabled.
- **Query Type**: `u16 -> bool`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `false`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'LiquidAlphaOn', [netuid])
    print(result.value)
    ```
## 63. LoadedEmission

- **Description**: Emission data loaded for a network.
- **Query Type**: `u16 -> Vec<(AccountId, u64, u64)>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `None`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'LoadedEmission', [netuid])
    print(result)
    ```
## 64. MaxAllowedUids

- **Description**: Maximum allowed UIDs for networks.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `4096`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MaxAllowedUids', [netuid])
    print(result.value)
    ```
## 65. MaxAllowedValidators

- **Description**: Maximum allowed validators for networks.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `128`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MaxAllowedValidators', [netuid])
    print(result.value)
    ```
## 66. MaxBurn

- **Description**: Maximum burn value for a given network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `100000000000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MaxBurn', [netuid])
    print(result.value)
    ```
## 67. MaxChildkeyTake

- **Description**: Maximum childkey take (percentage \* 65535) for child-keys.
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `11796`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'MaxChildkeyTake')
    print(result.value)
    ```
## 68. MaxDelegateTake

- **Description**: Maximum delegate take (percentage * 65535) for delegations.
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `11796`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'MaxDelegateTake')
    print(result.value)
    ```
## 69. MaxDifficulty

- **Description**: Maximum difficulty parameter for a given network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `u64::MAX / 4`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MaxDifficulty', [netuid])
    print(result.value)
    ```
## 70. MaxRegistrationsPerBlock

- **Description**: Maximum registrations allowed per block.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `block`: `u16`
- **Default Value**: `1`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    block = 100
    result = substrate.query('SubtensorModule', 'MaxRegistrationsPerBlock', [block])
    print(result.value)
    ```
## 71. MaxWeightsLimit

- **Description**: Maximum weight limit for networks.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `1000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MaxWeightsLimit', [netuid])
    print(result.value)
    ```
## 72. MechanismCountCurrent

- **Description**: Storage for MechanismCountCurrent.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MechanismCountCurrent', [netuid])
    print(result.value)
    ```
## 73. MechanismEmissionSplit

- **Description**: Storage for a subnet's mechanism emissions split.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MechanismEmissionSplit', [netuid])
    print(result)
    ```
## 74. MinActivityCutoff

- **Description**: Storage for MinActivityCutoff.
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'MinActivityCutoff')
    print(result.value)
    ```
## 75. MinAllowedUids

- **Description**: Minimum allowed UIDs for networks (global).
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `128`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MinAllowedUids', [netuid])
    print(result.value)
    ```
## 76. MinAllowedWeights

- **Description**: Minimum allowed weights for networks.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `1024`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MinAllowedWeights', [netuid])
    print(result.value)
    ```
## 77. MinBurn

- **Description**: Minimum burn value for a given network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `1000000000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MinBurn', [netuid])
    print(result.value)
    ```
## 78. MinChildkeyTake

- **Description**: Minimum childkey take (percentage * 65535) for child-keys.
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'MinChildkeyTake')
    print(result.value)
    ```
## 79. MinDelegateTake

- **Description**: Minimum delegate take (percentage * 65535) for delegations.
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'MinDelegateTake')
    print(result.value)
    ```
## 80. MinDifficulty

- **Description**: Minimum difficulty parameter for a given network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `10000000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'MinDifficulty', [netuid])
    print(result.value)
    ```
## 81. NetworkImmunityPeriod

- **Description**: Immunity period for networks (global).
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `50400`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'NetworkImmunityPeriod')
    print(result.value)
    ```
## 82. NetworkLastLockCost

- **Description**: Last lock cost for networks.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `1000000000000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'NetworkLastLockCost')
    print(result.value)
    ```
## 83. NetworkLockReductionInterval

- **Description**: Lock reduction interval for networks.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `100800`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'NetworkLockReductionInterval')
    print(result.value)
    ```
## 84. NetworkMinLockCost

- **Description**: Minimum lock cost for networks.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `1000000000000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'NetworkMinLockCost')
    print(result.value)
    ```
## 85. NetworkPowRegistrationAllowed

- **Description**: Whether PoW registration is allowed in the network.
- **Query Type**: `u16 -> bool`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `false`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'NetworkPowRegistrationAllowed', [netuid])
    print(result.value)
    ```
## 86. NetworkRateLimit

- **Description**: Network rate limit.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `7200`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'NetworkRateLimit')
    print(result.value)
    ```
## 87. NetworkRegisteredAt

- **Description**: Block number when the network was registered.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'NetworkRegisteredAt', [netuid])
    print(result.value)
    ```
## 88. NetworkRegistrationAllowed

- **Description**: Whether registration is allowed in the network.
- **Query Type**: `u16 -> bool`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `false`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'NetworkRegistrationAllowed', [netuid])
    print(result.value)
    ```
## 89. NetworkRegistrationStartBlock

- **Description**: Storage for `NetworkRegistrationStartBlock`.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'NetworkRegistrationStartBlock')
    print(result.value)
    ```
## 90. NetworksAdded

- **Description**: Whether the network has been added.
- **Query Type**: `u16 -> bool`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `false`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'NetworksAdded', [netuid])
    print(result.value)
    ```
## 91. NeuronCertificates

- **Description**: Storage for NeuronCertificates.
- **Query Type**: `(u16, AccountId) -> unknown`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    from bittensor_wallet import Keypair
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'NeuronCertificates', [netuid, hotkey])
    print(result)
    ```
## 92. NextStakeJobId

- **Description**: Ensures unique IDs for StakeJobs storage map.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'NextStakeJobId')
    print(result.value)
    ```
## 93. NextSubnetLeaseId

- **Description**: Storage for NextSubnetLeaseId.
- **Query Type**: `u32`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'NextSubnetLeaseId')
    print(result.value)
    ```
## 94. NominatorMinRequiredStake

- **Description**: Minimum required stake for nominators.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'NominatorMinRequiredStake')
    print(result.value)
    ```
## 95. OwnedHotkeys

- **Description**: Returns the vector of hotkeys controlled by this coldkey.
- **Query Type**: `AccountId -> Vec<AccountId>`
- **Parameters**:
  - `coldkey`: `AccountId`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    coldkey = Keypair.create_from_uri('//Bob').ss58_address
    result = substrate.query('SubtensorModule', 'OwnedHotkeys', [coldkey])
    print(result.value)
    ```
## 96. Owner

- **Description**: Returns the controlling coldkey for a hotkey.
- **Query Type**: `AccountId -> AccountId`
- **Parameters**:
  - `hotkey`: `AccountId`
- **Default Value**: `AccountId` derived from trailing zeroes
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'Owner', [hotkey])
    print(result)
    ```
## 97. OwnerHyperparamRateLimit

- **Description**: Global number of epochs used to rate limit subnet owner hyperparameter updates
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'OwnerHyperparamRateLimit')
    print(result.value)
    ```
## 98. ParentKeys

- **Description**: Maps child keys to parent keys with proportions.
- **Query Type**: `(AccountId, u16) -> Vec<(u64, AccountId)>`
- **Parameters**:
  - `child`: `AccountId`
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    child = Keypair.create_from_uri('//Alice').ss58_address
    netuid = 1
    result = substrate.query('SubtensorModule', 'ParentKeys', [child, netuid])
    print(result.value)
    ```
## 99. PendingAlphaSwapped

- **Description**: Storage for PendingAlphaSwapped.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'PendingAlphaSwapped', [netuid])
    print(result.value)
    ```
## 100. PendingChildKeyCooldown

- **Description**: Storage value for pending childkey cooldown, settable by root. Stakes record in genesis. The total issued balance in genesis
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'PendingChildKeyCooldown')
    print(result.value)
    ```
## 101. PendingChildKeys

- **Description**: Pending child keys to be applied after cooldown.
- **Query Type**: `(u16, AccountId) -> (Vec<(u64, AccountId)>, u64)`
- **Parameters**:
  - `netuid`: `u16`
  - `parent`: `AccountId`
- **Default Value**: `( [], 0 )`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    parent = Keypair.create_from_uri('//Alice').ss58_address
    netuid = 1
    result = substrate.query('SubtensorModule', 'PendingChildKeys', [netuid, parent])
    print(result.value)
    ```
## 102. PendingEmission

- **Description**: Pending emission of the network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'PendingEmission', [netuid])
    print(result.value)
    ```
## 103. PendingOwnerCut

- **Description**: Storage for PendingOwnerCut.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'PendingOwnerCut', [netuid])
    print(result.value)
    ```
## 104. PendingRootAlphaDivs

- **Description**: Storage for PendingRootDivs.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'PendingRootAlphaDivs', [netuid])
    print(result.value)
    ```
## 105. POWRegistrationsThisInterval

- **Description**: Number of PoW registrations in this interval.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'POWRegistrationsThisInterval', [netuid])
    print(result.value)
    ```
## 106. Prometheus

- **Description**: Storage for Prometheus.
- **Query Type**: `(u16, AccountId) -> unknown`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    from bittensor_wallet import Keypair
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'Prometheus', [netuid, hotkey])
    print(result)
    ```
## 107. PruningScores

- **Description**: Pruning scores of UIDs in a network.
- **Query Type**: `u16 -> Vec<u16>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'PruningScores', [netuid])
    print(result.value)
    ```
## 108. Rank

- **Description**: Rank values of UIDs in a network.
- **Query Type**: `u16 -> Vec<u16>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Rank', [netuid])
    print(result.value)
    ```
## 109. RAORecycledForRegistration

- **Description**: Global RAO recycled for registration.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'RAORecycledForRegistration', [netuid])
    print(result.value)
    ```
## 110. RecycleOrBurn

- **Description**: Storage for RecycleOrBurn.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'RecycleOrBurn', [netuid])
    print(result)
    ```
## 111. RegistrationsThisBlock

- **Description**: Number of registrations in the current block for a given network.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'RegistrationsThisBlock', [netuid])
    print(result.value)
    ```
## 112. RegistrationsThisInterval

- **Description**: Storage for RegistrationsThisInterval.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'RegistrationsThisInterval', [netuid])
    print(result.value)
    ```
## 113. RevealPeriodEpochs

- **Description**: Number of epochs allowed for commit-reveal periods on a given netuid.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `1`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'RevealPeriodEpochs', [netuid])
    print(result.value)
    ```
## 114. Rho

- **Description**: Rho parameter of the network.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `10`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Rho', [netuid])
    print(result.value)
    ```
## 115. ScalingLawPower

- **Description**: Scaling law power for the network.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `50`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'ScalingLawPower', [netuid])
    print(result.value)
    ```
## 116. ServingRateLimit

- **Description**: Rate limit for serving in the network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `50`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'ServingRateLimit', [netuid])
    print(result.value)
    ```
## 117. StakeThreshold

- **Description**: Storage for `StakeThreshold`.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'StakeThreshold')
    print(result.value)
    ```
## 118. StakeWeight

- **Description**: Weight for stake used in YC (consensus).
- **Query Type**: `u16 -> Vec<u16>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'StakeWeight', [netuid])
    print(result.value)
    ```
## 119. StakingHotkeys

- **Description**: Maps coldkey to hotkeys that stake to it.
- **Query Type**: `AccountId -> Vec<AccountId>`
- **Parameters**:
  - `coldkey`: `AccountId`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    coldkey = Keypair.create_from_uri('//Bob').ss58_address
    result = substrate.query('SubtensorModule', 'StakingHotkeys', [coldkey])
    print(result.value)
    ```
## 120. StakingOperationRateLimiter

- **Description**: Rate limits for staking operations.
- **Query Type**: `(AccountId, AccountId, u16) -> unknown`
- **Parameters**:
  - `hotkey`: `AccountId`
  - `coldkey`: `AccountId`
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    from bittensor_wallet import Keypair
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    from bittensor_wallet import Keypair
    coldkey = Keypair.create_from_uri('//Bob').ss58_address
    netuid = 1
    result = substrate.query('SubtensorModule', 'StakingOperationRateLimiter', [hotkey, coldkey, netuid])
    print(result.value)
    ```
## 121. SubnetAlphaIn

- **Description**: Amount of alpha in the subnet's liquidity pool.
- **Query Type**: `(u16) -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetAlphaIn', [netuid])
    print(result.value)
    ```
## 122. SubnetAlphaInEmission

- **Description**: Amount of alpha entering a subnet per block.
- **Query Type**: `(u16) -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetAlphaInEmission', [netuid])
    print(result.value)
    ```
## 123. SubnetAlphaInProvided

- **Description**: Storage for SubnetAlphaInProvided.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetAlphaInProvided', [netuid])
    print(result.value)
    ```
## 124. SubnetAlphaOut

- **Description**: Amount of alpha in the subnet itself.
- **Query Type**: `(u16) -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetAlphaOut', [netuid])
    print(result.value)
    ```
## 125. SubnetAlphaOutEmission

- **Description**: Amount of alpha leaving a subnet per block.
- **Query Type**: `(u16) -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetAlphaOutEmission', [netuid])
    print(result.value)
    ```
## 126. SubnetIdentities

- **Description**: Storage for SubnetIdentities.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetIdentities', [netuid])
    print(result)
    ```
## 127. SubnetIdentitiesV2

- **Description**: Identity information for a subnet (v2 format).
- **Query Type**: `u16 -> SubnetIdentityOfV2`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `None`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetIdentitiesV2', [netuid])
    print(result)
    ```
## 128. SubnetIdentitiesV3

- **Description**: Identity information for a subnet (v3 format).
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetIdentitiesV3', [netuid])
    print(result)
    ```
## 129. SubnetLeases

- **Description**: Storage for SubnetLeases.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `lease_id`: `u32`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    lease_id = 1
    result = substrate.query('SubtensorModule', 'SubnetLeases', [lease_id])
    print(result)
    ```
## 130. SubnetLeaseShares

- **Description**: Storage for SubnetLeaseShares.
- **Query Type**: `(u16, AccountId) -> unknown`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    lease_id = 1
    coldkey = Keypair.create_from_uri('//Bob').ss58_address
    result = substrate.query('SubtensorModule', 'SubnetLeaseShares', [lease_id, coldkey])

    print(result)
    ```
## 131. SubnetLimit

- **Description**: Maximum number of networks.
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `12`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'SubnetLimit')
    print(result.value)
    ```
## 132. SubnetLocked

- **Description**: Locked amount in the subnet.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetLocked', [netuid])
    print(result.value)
    ```
## 133. SubnetMechanism

- **Description**: Mechanism identifier for the subnet.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetMechanism', [netuid])
    print(result.value)
    ```
## 134. SubnetMovingAlpha

- **Description**: Moving alpha parameter for the dynamic subnet price.
- **Query Type**: `I96F32`
- **Parameters**: None
- **Default Value**: `0.000003`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'SubnetMovingAlpha')
    print(result)
    ```
## 135. SubnetMovingPrice

- **Description**: The moving average price for a subnet.
- **Query Type**: `(u16) -> I96F32`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0.0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetMovingPrice', [netuid])
    print(result)
    ```
## 136. SubnetOwner

- **Description**: Owner of the subnet.
- **Query Type**: `u16 -> AccountId`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `AccountId`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetOwner', [netuid])
    print(result)
    ```
## 137. SubnetOwnerCut

- **Description**: Subnet owner cut percentage.
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `11796`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'SubnetOwnerCut')
    print(result.value)
    ```
## 138. SubnetOwnerHotkey

- **Description**: Storage for SubnetOwnerHotkey.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetOwnerHotkey', [netuid])
    print(result)
    ```
## 139. SubnetTAO

- **Description**: Amount of TAO in a given subnet's pool.
- **Query Type**: `(u16) -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetTAO', [netuid])
    print(result.value)
    ```
## 140. SubnetTaoInEmission

- **Description**: Storage for SubnetTaoInEmission.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetTaoInEmission', [netuid])
    print(result.value)
    ```
## 141. SubnetTaoProvided

- **Description**: Storage for SubnetTaoProvided.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetTaoProvided', [netuid])
    print(result.value)
    ```
## 142. SubnetUidToLeaseId

- **Description**: Storage for SubnetUidToLeaseId.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetUidToLeaseId', [netuid])
    print(result)
    ```
## 143. SubnetVolume

- **Description**: Total volume of TAO bought/sold for a subnet.
- **Query Type**: `(u16) -> u128`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetVolume', [netuid])
    print(result.value)
    ```
## 144. SubnetworkN

- **Description**: Number of UIDs in the network.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetworkN', [netuid])
    print(result.value)
    ```
## 145. SubtokenEnabled

- **Description**: Storage for `SubtokenEnabled`.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `false`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'SubtokenEnabled', [netuid])
    print(result.value)
    ```
## 146. TaoDividendsPerSubnet

- **Description**: Last total root dividend for a hotkey on a subnet.
- **Query Type**: `(u16, AccountId) -> u64`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'TaoDividendsPerSubnet', [netuid, hotkey])
    print(result.value)
    ```
## 147. TaoWeight

- **Description**: A global parameter representing "Tao weight" in the system.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `971718665099567868`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'TaoWeight')
    print(result.value)
    ```
## 148. TargetRegistrationsPerInterval

- **Description**: Target registrations per interval for the network.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `2`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'TargetRegistrationsPerInterval', [netuid])
    print(result.value)
    ```
## 149. Tempo

- **Description**: Tempo of the network.
- **Query Type**: `u16 -> u16`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `99`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Tempo', [netuid])
    print(result.value)
    ```
## 150. TimelockedWeightCommits

- **Description**: Stores a queue of weight commits for an account on a given subnet.
- **Query Type**: `(u16, AccountId) -> u64`
- **Parameters**:
  - `key`: `AccountId`
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    commit_epoch = 100
    result = substrate.query('SubtensorModule', 'TimelockedWeightCommits', [netuid, commit_epoch])
    print(result.value)
    ```
## 151. TokenSymbol

- **Description**: The token symbol for a subnet.
- **Query Type**: `u16 -> Vec<u8>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `"\xF0\x9D\x9C\x8F"`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'TokenSymbol', [netuid])
    print(result.value)
    ```
## 152. TotalHotkeyAlpha

- **Description**: Storage for TotalHotkeyAlpha.
- **Query Type**: `(u16, AccountId) -> unknown`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    from bittensor_wallet import Keypair
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'TotalHotkeyAlpha', [hotkey, netuid])
    print(result.value)
    ```
## 153. TotalHotkeyAlphaLastEpoch

- **Description**: Storage for TotalHotkeyAlphaLastEpoch.
- **Query Type**: `(u16, AccountId) -> unknown`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    from bittensor_wallet import Keypair
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'TotalHotkeyAlphaLastEpoch', [hotkey, netuid])
    print(result.value)
    ```
## 154. TotalHotkeyShares

- **Description**: Returns the number of alpha shares for a hotkey on a subnet.
- **Query Type**: `(u16, AccountId) -> unknown`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    from bittensor_wallet import Keypair
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'TotalHotkeyShares', [hotkey, netuid])
    print(result)
    ```
## 155. TotalIssuance

- **Description**: Represents the total issuance of tokens on the Bittensor network.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'TotalIssuance')
    print(result.value)
    ```
## 156. TotalNetworks

- **Description**: Total number of existing networks.
- **Query Type**: `u16`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'TotalNetworks')
    print(result.value)
    ```
## 157. TotalStake

- **Description**: The total amount of tokens staked in the system.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'TotalStake')
    print(result.value)
    ```
## 158. TransactionKeyLastBlock

- **Description**: Last block of a transaction for a given key, netuid, and name.
- **Query Type**: `(AccountId, u16, u16) -> u64`
- **Parameters**:
  - `hotkey`: `AccountId`
  - `netuid`: `u16`
  - `name`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    netuid = 1
    name = 1
    result = substrate.query('SubtensorModule', 'TransactionKeyLastBlock', [hotkey, netuid, name])
    print(result.value)
    ```
## 159. TransferToggle

- **Description**: Storage for TransferToggle.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `true`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'TransferToggle', [netuid])
    print(result.value)
    ```
## 160. Trust

- **Description**: Trust values of UIDs in a network.
- **Query Type**: `u16 -> Vec<u16>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Trust', [netuid])
    print(result.value)
    ```
## 161. TxChildkeyTakeRateLimit

- **Description**: Transaction childkey take rate limit.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `0` or chain-defined
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'TxChildkeyTakeRateLimit')
    print(result.value)
    ```
## 162. TxDelegateTakeRateLimit

- **Description**: Transaction delegate take rate limit.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `216000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'TxDelegateTakeRateLimit')
    print(result.value)
    ```
## 163. TxRateLimit

- **Description**: Transaction rate limit.
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `1000`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'TxRateLimit')
    print(result.value)
    ```
## 164. Uids

- **Description**: Maps hotkey to UID within a network.
- **Query Type**: `(u16, AccountId) -> u16`
- **Parameters**:
  - `netuid`: `u16`
  - `hotkey`: `AccountId`
- **Default Value**: `None`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'Uids', [netuid, hotkey])
    print(result.value)
    ```
## 165. UsedWork

- **Description**: Global used work storage.
- **Query Type**: `Vec<u8> -> u64`
- **Parameters**:
  - `key`: `Vec<u8>`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    key = b"some_key"
    result = substrate.query('SubtensorModule', 'UsedWork', [key])
    print(result.value)
    ```
## 166. ValidatorPermit

- **Description**: Validator permit values of UIDs in a network.
- **Query Type**: `u16 -> Vec<bool>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'ValidatorPermit', [netuid])
    print(result.value)
    ```
## 167. ValidatorPruneLen

- **Description**: Length of validator pruning.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `1`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'ValidatorPruneLen', [netuid])
    print(result.value)
    ```
## 168. ValidatorTrust

- **Description**: Validator trust values of UIDs in a network.
- **Query Type**: `u16 -> Vec<u16>`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'ValidatorTrust', [netuid])
    print(result.value)
    ```
## 169. WeightCommits

- **Description**: Returns the commit data for an account on a given netuid (commit-reveal).
- **Query Type**: `(u16, AccountId) -> VecDeque<(H256, u64, u64, u64)>`
- **Parameters**:
  - `netuid`: `u16`
  - `who`: `AccountId`
- **Default Value**: `None`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    who = Keypair.create_from_uri('//Alice').ss58_address
    result = substrate.query('SubtensorModule', 'WeightCommits', [netuid, who])
    print(result)
    ```
## 170. Weights

- **Description**: Weight values of UIDs in a network.
- **Query Type**: `(u16, u16) -> Vec<(u16, u16)>`
- **Parameters**:
  - `netuid`: `u16`
  - `uid`: `u16`
- **Default Value**: `[]`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    uid = 123
    result = substrate.query('SubtensorModule', 'Weights', [netuid, uid])
    print(result.value)
    ```
## 171. WeightsSetRateLimit

- **Description**: Rate limit for setting weights in the network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `100`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'WeightsSetRateLimit', [netuid])
    print(result.value)
    ```
## 172. WeightsVersionKey

- **Description**: Version key for weights in the network.
- **Query Type**: `u16 -> u64`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'WeightsVersionKey', [netuid])
    print(result.value)
    ```
## 173. WeightsVersionKeyRateLimit

- **Description**: Storage for `WeightsVersionKeyRateLimit`
- **Query Type**: `u64`
- **Parameters**: None
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    result = substrate.query('SubtensorModule', 'WeightsVersionKeyRateLimit')
    print(result.value)
    ```

## 174. Yuma3On

- **Description**: Storage for value for a subnet's `Yuma3On` hyperparameter.
- **Query Type**: `u16 -> unknown`
- **Parameters**:
  - `netuid`: `u16`
- **Default Value**: `0`
- **Python Example**:
    ```python
    from async_substrate_interface import SubstrateInterface
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")

    netuid = 1
    result = substrate.query('SubtensorModule', 'Yuma3On', [netuid])
    print(result.value)
    ```