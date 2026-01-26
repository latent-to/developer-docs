---
title: "Validating in Bittensor"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { SdkVersion } from "../sdk/\_sdk-version.mdx";

# Validating in Bittensor

All validating in Bittensor occurs within a subnet. Each subnet independently produces the digital commodities that are its purpose, with each subnet creator defining a different _incentive mechanism_ for validators to use in judging miners' work. The validator's work is to apply this incentive mechanism to miners, using it to score their performance, and then to submit these weights to the Bittensor blockchain.  The validator scores of miners' performance determine the proportion of the subnet's emissions allocated to each miner, according to the Yuma Consensus algorithm. See [Emissions](../learn/emissions.md).

Browse the subnets and explore links to their code repositories on [TAO.app' subnets listings](https://tao.app).

:::tip Typical compute requirements
Each subnet may have distinct hardware requirements, but this [subnet minimum requirements template](https://github.com/opentensor/bittensor-subnet-template/blob/main/min_compute.yml#L49) may give an idea of the minimum memory, bandwidth and storage requirements for validators in a typical subnet node.

Validating is not supported on Windows.
:::

## How it works

Each subnet on the Bittensor blockchain supports a maximum of 256 active nodes, with each node assigned a unique UID slot. Out of these, only the top 64 nodes by emissions are eligible to serve as validators by default. A subnet with 64 validators means that all 64 top-ranked nodes meet the necessary criteria and choose to participate as validators.

To qualify as a validator, a node must have a validator permit. This permit is only granted to nodes within the top 64 and allows them to submit miner evaluations using `btcli weights commit` or the SDK's [`set_weights`](pathname:///python-api/html/autoapi/bittensor/core/extrinsics/set_weights/index.html#module-bittensor.core.extrinsics.set_weights) function.

:::tip Dynamic Validator Threshold
The number of validators isn't hardcoded. The subnet governor has the authority to increase or decrease the maximum number of validators. Any change to this limit directly affects the number of nodes that can be issued a validator permit and, thus, act as validators.
:::

## Requirements for validation

To have a **validator permit** in a given subnet, you must meet the following requirements:

- Your hotkey must be registered, granting you a UID on the subnet
- You must have a stake-weight on the subnet of least 1000, including stake delegated to your hotkey from other wallets' coldkeys. A validator's stake weight in a subnet equals their alpha stake plus their TAO stake multiplied by the `tao_weight` parameter (current value: 0.18):

      $$

      \text{Validator stake weight} = \alpha +  0.18 \times \tau

      $$

- You must be one of the top 64 nodes in the subnet, ranked by emissions.

## Hotkey Association & Staking

:::tip Root Subnet (Subnet 0) only
This step is only required if you are registering on the root subnet (Subnet O). Skip this step if you are not registering a validator on the root subnet.
:::

To become a validator on the root subnet, you must first associate your hotkey and then stake funds to your hotkey account within the subnet. To associate your hotkey:

```bash
btcli wallet associate-hotkey --wallet.name  <wallet name> --hotkey <your hotkey>
```

Add stake to your validator before registering:

```bash
# Stake funds to your hotkey account within the subnet.
btcli stake add --wallet.name <wallet name> --wallet.hotkey <your validating hotkey>
```

## Validator registration

To participate as a validator, you must first register a hotkey with the subnet in order to receive a UID on that subnet.

By default, a subnet can have a maximum of 64 active subnet validator UIDs. Upon registration, your hotkey, which is part of your wallet, becomes the holder of the UID slot.

To register:

```bash
btcli subnet register --netuid <desired netuid> --wallet.name  <wallet name> --hotkey <your hotkey>
```

## Validator deregistration

Validators, like miners, can be deregistered if their emissions are low. However, validator deregistration involves additional steps compared to miner deregistration. This is because an active validator must be among the top 64 nodes in the subnet and, therefore, cannot be instantly "pruned" by a newly registered node.

When a validator falls below the top 64 nodes by emissions, or has less than the required 1000 total stake weight, it loses its validation permit, but is not therefore automatically deregistered. If a validator loses its validation permit and has no means to gain emissions, it will eventually become the node with the lowest emission, making it eligible for deregistration.

:::info
Deregistration only occurs on subnets where all 256 UID slots are occupied. If a new registration occurs in a subnet with available UID slots, the registered neuron occupies one of the available UID slots.
:::

Each tempo, the '[neuron](../learn/neurons)' (miner _or_ validator node) with the lowest 'pruning score' (based solely on emissions), and that is no longer within its [immunity period](../subnets/subnet-hyperparameters.md#immunityperiod), risks being replaced by a newly registered neuron, who takes over that UID.

:::info Deregistration is based on emissions
The subnet does not distinguish between miners and validators for the purpose of deregistration. The chain only looks at emissions (represented as 'pruning score'). Whenever a new registration occurs in the subnet, the neuron with the lowest emissions will get deregistered.
:::

### Immunity period

Every subnet has an `immunity_period` hyperparameter expressed in a number of blocks. A neuron's `immunity_period` starts when the miner or validator registers into the subnet. For more information, see [`immunity_period`](../subnets/subnet-hyperparameters.md#immunityperiod).

A subnet neuron (miner or validator) at a UID (in that subnet) has `immunity_period` blocks to improve its performance. When `immunity_period` expires, that miner or validator can be deregistered if it has the lowest performance in the subnet and a new registration arrives.

**Implementation Details:**

Immunity status is calculated dynamically using the formula `is_immune = (current_block - registered_at) < immunity_period`, where:

- `current_block` is the current blockchain block number
- `registered_at` is the block number when the neuron was registered
- `immunity_period` is the configured protection period for the subnet (default: 4096 blocks ≈ 13.7 hours)

**Code References:**

- [`subtensor/pallets/subtensor/src/utils/misc.rs:442-448`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/utils/misc.rs#L442-448) - Immunity status calculation
- [`subtensor/pallets/subtensor/src/subnets/registration.rs:409-485`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/registration.rs#L409-485) - Pruning algorithm with immunity priority

:::tip Special cases

- In the unlikely event that all neurons are still immune, the one with the lowest "pruning score" will be deregistered by the next incoming registration.

- In cases where two or more nodes have the lowest "pruning score", the older node gets deregistered first.

- The subnet owner's hotkey has permanent immunity from deregistration.
  :::

## Acquiring stake

A validator's consensus weight and emissions depend on their hotkey's stake weight. You can stake your own TAO to your validator hotkey, or advertise your hotkey to others and seek stake. Any wallet's coldkey can stake to any hotkey, subsequently receiving emissions from that stake.

:::tip Delegation
See [Staking and Delegation](../staking-and-delegation/delegation.md)
:::

### Add stake

```bash
# Stake funds to your hotkey account within the subnet.
btcli stake add --wallet.name <wallet name> --wallet.hotkey <your validating hotkey>
```

### Calculate TAO required

<SdkVersion />

The amount of TAO needed to acquire a validator permit depends on how the other largest 64 wallets distribute TAO across themselves. You can calculate the minimum using [bt.metagraph](pathname:///python-api/html/autoapi/bittensor/core/metagraph/index.html):

```python
import bittensor as bt
subnet = bt.Metagraph(14)
top_64_stake = sorted(subnet.S)[-64:]
print (f'Current requirement for validator permits based on the top 64 stake stands at {min(top_64_stake)} tao')
```

### Check the permit status

Replace the string values for the `name` (`<my_coldkey>`) and `hotkey` (`<my_validator_hotkey>`) with your own.  
This information can be obtained from the metagraph using your UID.

```python
import bittensor as bt

subnet = bt.Metagraph(1)

wallet = bt.Wallet( name = 'my_coldkey', hotkey = 'my_validator_hotkey' )
my_uid = subnet.hotkeys.index( wallet.hotkey.ss58_address )
print(f'Validator permit: {subnet.validator_permit[my_uid]}')
```

## Validator Permits

Validator permits control which neurons can participate in validation activities within a subnet. The system operates on a stake-weighted basis, ensuring that only high-stake, trusted neurons can influence consensus.

### Permit Calculation Algorithm

Validator permits are calculated every epoch using the following process:

1. **Stake Filtering**: Only neurons with sufficient stake (minimum 1000 stake weight) are considered
2. **Top-K Selection**: The top K neurons by stake weight are awarded validator permits (typically top 64)
3. **Dynamic Updates**: Permits are recalculated every epoch based on current stake distribution

### Access Control and Security

Validator permits control several critical network functions:

- **Weight Setting**: Only permitted neurons can set non-self weights
- **Consensus Participation**: Only permitted neurons contribute to Yuma Consensus
- **Bond Management**: Neurons retain bonds only if they keep validator permits
- **Active Stake**: Only permitted neurons contribute to active stake calculations

### Permit Requirements

To obtain a validator permit, a neuron must meet these criteria:

- **Minimum Stake**: At least 1000 stake weight (α + 0.18 × τ)
- **Top K Ranking**: Be among the top K neurons by stake weight
- **Active Status**: Maintain active participation in the subnet

### Permit Lifecycle and Bond Management

When validator permits are lost, associated bonds are deleted. This ensures that only currently qualified validators can influence consensus.

### Implementation Details

For implementation details of how validator permits are calculated, managed, and cleaned up in the codebase, see the [Validator Permit Management section](../navigating-subtensor/epoch.md#3-validator-permit-management) in the Epoch Implementation documentation.

### Code References

- Validator permit calculation: [`subtensor/pallets/subtensor/src/epoch/run_epoch.rs:520-537`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs#L520-537)
- Top-K selection algorithm: [`subtensor/pallets/subtensor/src/epoch/math.rs:250-263`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/math.rs#L250-263)
- Bond cleanup logic: [`subtensor/pallets/subtensor/src/epoch/run_epoch.rs:903-921`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs#L903-921)
- Access control: [`subtensor/pallets/subtensor/src/subnets/weights.rs:745-748`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/weights.rs#L745-748)

## Inspecting UIDs

After you obtain a UID slot, you can view the status of your registered wallet by running:

```bash
btcli wallet overview --netuid
```

After providing your wallet name at the prompt, you will see output like:

| Parameter   | Example value      | Description                                                                            |
| :---------- | :----------------- | :------------------------------------------------------------------------------------- |
| COLDKEY     | my_coldkey         | The name of the coldkey associated with your slot.                                     |
| HOTKEY      | my_first_hotkey    | The name of the hotkey associated with your slot.                                      |
| UID         | 5                  | Unique identifier of the neuron.                                                       |
| ACTIVE      | True               | Whether or not the uid is considered active.                                           |
| STAKE(τ)    | 71.296             | The amount of stake in this wallet.                                                    |
| RANK        | 0.0629             | This miner's absolute ranking according to validators on the network.                  |
| TRUST       | 0.2629             | This miner's trust score as a proportion of validators on the network.                 |
| CONSENSUS   | 0.89               | The consensus score of the neuron.                                                     |
| INCENTIVE   | 0.029              | Thencentive score representing the miner's incentive alignment.                        |
| DIVIDENDS   | 0.001              | The dividends earned by the neuron for validating on the subnet.                       |
| EMISSION    | 29_340_153         | The emission in RAO (p) received by the neuron.                                        |
| VTRUST      | 0.96936            | The validator trust score indicating the network's trust in the neuron as a validator. |
| VPERMIT     | \*                 | Whether this neuron is considered eligible for validating on this subnetwork.          |
| UPDATED     | 43                 | Blocks since the neuron set weights on the chain.                                      |
| AXON        | 131.186.56.85:8091 | The entrypoint advertised by this miner on the bittensor blockchain.                   |
| HOTKEY_SS58 | 5F4tQyWr...        | The ss58-encoded address of the miner's hotkey.                                        |

### Meaning of ACTIVE

In the above table, the `ACTIVE` row applies only to UIDs that are subnet validators. It shows whether the UID is actively setting weights within the [`activity_cutoff`](../subnets/subnet-hyperparameters#activitycutoff) window. If the UID has not set weights on the blockchain for the `activity_cutoff` duration, then the Yuma Consensus will consider this subnet validator offline, i.e., turned off (`False`).

## Checking the registration status

Use any of the Python code fragments below:

- **Using Python interpreter**: Type "python" or "python3" on your macOS or Linux terminal, then copy/paste one of these snippets.
- **Using a Python file**: Copy a code snippet into, for example, `check_reg.py`, then run `python3 check_reg.py`.

### With SS58 hotkey

```python
import bittensor as bt
# Replace below with your SS58 hotkey
hotkey = "5HEo565WAy4Dbq3Sv271SAi7syBSofyfhhwRNjFNSM2gP9M2"
network = "finney"
sub = bt.Subtensor(network)
print(f"Registration status for hotkey {hotkey} is: {sub.is_hotkey_registered(hotkey)}")
```

### With SS58 hotkey and netuid

```python
import bittensor as bt
# Replace below with your SS58 hotkey
hotkey = "5HEo565WAy4Dbq3Sv271SAi7syBSofyfhhwRNjFNSM2gP9M2"
network = "finney"
netuid = 1 # subnet uid
sub = bt.Subtensor(network)
mg = sub.metagraph(netuid)
if hotkey not in mg.hotkeys:
  print(f"Hotkey {hotkey} deregistered")
else:
  print(f"Hotkey {hotkey} is registered")
```

### With UID and SS58 hotkey

```python
import bittensor as bt
# Replace below with your SS58 hotkey
hotkey = "5HEo565WAy4Dbq3Sv271SAi7syBSofyfhhwRNjFNSM2gP9M2"
network = "finney"
netuid = 1 # subnet uid
sub = bt.Subtensor(network)
mg = sub.metagraph(netuid)
uid = 2 # Your UID
registered = mg.hotkeys[uid] == hotkey
if not registered:
  print(f"Miner at uid {uid} not registered")
else:
  print(f"Miner at uid {uid} registered")
```
