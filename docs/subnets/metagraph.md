---
title: "The Subnet Metagraph"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { SdkVersion } from "../sdk/_sdk-version.mdx";

# Subnet Metagraph

This page documents the Bittensor subnet metagraph.

The **metagraph** is a core data structure in Bittensor that represents the complete state of a subnet at any given block. It contains comprehensive information about all neurons (miners and validators) participating in a subnet, their emissions, bonds, and trust, as well as subnet metrics.

:::info source code
The metagraph is implemented in the Bittensor blockchain (Subtensor) as a Rust data structure. The source code is located in the [Subtensor repository](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/rpc_info/metagraph.rs).
:::

Related reading:

- [Understanding Neurons](../learn/neurons.md)
- [Subnet Hyperparameters](./subnet-hyperparameters.md)
- [Bittensor CLI Reference](../btcli/btcli.md)
- [Metagraph Precompile](../evm-tutorials/metagraph-precompile.md)

## Accessing the Metagraph

You can access metagraph data through multiple interfaces:

### Bittensor CLI (btcli)

The `btcli` command-line interface provides access to a subset of metagraph information (corresponding to "lite" mode in the SDK). For full metagraph data including weights and bonds, use the Python SDK with `lite=False`.

<!-- Note that if the subnet has multiple incentive mechanisms, you will be prompted to specify the id of the mechanism unless you specify it with the `--mech-id` flag. See [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets). -->

```bash
# Dump metagraph subset to file (lite mode)
btcli subnets metagraph --netuid 14 --network finney \
    --json-output > sn14_metagraph.json

# View abridged metagraph
btcli subnets metagraph --netuid 14 --network finney
```

```console
                                                    Subnet 14: TAOHash
                                                     Network: finney

 UID ┃ Stake (ξ) ┃ Alpha (ξ) ┃   Tao (τ) ┃ Dividends ┃ Incentive ┃ Emissions (ξ) ┃ Hotk… ┃ Coldkey ┃ Identity
━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━
 29  │ 271.67k ξ │ 254.83k ξ │  τ 16.84k │ 0.129183  │ 0.000000  │  19.122456 ξ  │ 5Cf4… │ 5CKhH8  │ Owner14 (*Owner)
  3  │ 387.08k ξ │  61.46k ξ │ τ 325.62k │ 0.184314  │ 0.000000  │  27.280861 ξ  │ 5C59… │ 5GZSAg  │

...
```

:::note btcli Limitations
The btcli output shows a subset of metagraph data (lite mode). For complete data including ranks, trust scores, weights, and bonds, use the Python SDK with `lite=False`.
:::

### Python SDK

<SdkVersion />

The Bittensor Python SDK [Metagraph module](pathname:///python-api/html/autoapi/bittensor/core/metagraph/index.html) provides programmatic access to metagraph data:

```python
from bittensor.core.metagraph import Metagraph

# Initialize metagraph for subnet 14 (lite mode - excludes weights/bonds)
m = Metagraph(netuid=14, network="finney", sync=True)

# Initialize metagraph with full data including weights and bonds
m = Metagraph(netuid=14, network="finney", lite=False, sync=True)
```

### Mechanism-aware metagraphs (multiple incentive mechanisms)

Subnets can run multiple incentive mechanisms. The SDK supports selecting a mechanism and exposes mechanism-related fields:

- Metagraph accepts a `mechid` parameter (default `0`).
- New fields: `mechid: int`, `mechanisms_emissions_split: list[int]`, `mechanism_count: int`.

```python
from bittensor.core.metagraph import Metagraph

# Default mechanism (0)
meta = Metagraph(netuid=14, network="finney", sync=True)
print(meta.mechid)  # 0
print(meta.mechanism_count)  # e.g., 2
print(meta.emissions_split)  # e.g., [60, 40]

# Specific mechanism (1)
mech_meta = Metagraph(netuid=14, network="finney", sync=True, lite=False)
mech_meta.mechid = 1
mech_meta.sync()  # or re-init with mechid in helper constructors
```

See also: [Multiple Incentive Mechanisms Within Subnets](./understanding-multiple-mech-subnets.md).

### Smart Contract Access (Metagraph Precompile)

For smart contract integration, you can access metagraph data through the **Metagraph Precompile** at address `0x0000000000000000000000000000000000000802`. This provides read-only access to individual neuron metrics and network information.

:::tip Smart Contract Integration
For detailed smart contract examples and complete ABI, see the [Metagraph Precompile](../evm-tutorials/metagraph-precompile.md) documentation.
:::

### RPC Functions

The blockchain provides several RPC functions for accessing metagraph data:

- `get_metagraph(netuid)` - Returns complete metagraph for a subnet
- `get_all_metagraphs()` - Returns metagraphs for all subnets
- `get_selective_metagraph(netuid, indexes)` - Returns partial metagraph data

See [Subtensor:Metagraph RPC source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/rpc_info/metagraph.rs)

## Performance Considerations

### Lite vs Full Sync

- **Lite Mode** (`lite=True`): Faster sync, excludes weights and bonds (corresponds to btcli output)
- **Full Mode** (`lite=False`): Complete data including weight matrices and bond matrices

### Caching

The metagraph supports local caching to persistent files:

```python
# Save metagraph for later use
metagraph.save()

# Load cached metagraph
metagraph.load()

# Custom save directory
metagraph.save(root_dir=['/custom', 'path'])
```

:::info Cache Location
Metagraph files are saved to `~/.bittensor/metagraphs/network-{network}/netuid-{netuid}/block-{block_number}.pt` by default. The files are persistent and not temporary.

**Source**: [`bittensor/bittensor/core/metagraph.py:96-115`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/metagraph.py#L96-L115)
:::

## Data Structures

### Metagraph Object

In the Bittensor Python SDK, the `Metagraph` class encapsulates the following information about a particular subnet.

[Metagraph class specification, SDK reference](pathname:///python-api/html/autoapi/bittensor/core/metagraph/index.html)

<!--  -->
<details>
  <summary>Metagraph Properties</summary>
| Name | Description |
|------|--|
| `netuid`  | The subnet's unique identifier within the Bittensor network |
| `network`  | Name of the Bittensor network, i.e. mainnet ('finney'), test, or a locally deployed chain |
| `version`  | Bittensor version number |
| `n`  | Total number of neurons registered on the subnet |
| `block`  | Block number when the metagraph record was retrieved |
| `total_stake`  | Total [stake weight](../resources/glossary.md#stake-weight) (α + τ × 0.18) across all neurons | 
| **Stake** / `S` | Total [stake weight](../resources/glossary.md#stake-weight) (α + τ × 0.18) of each neuron, determining consensus power and emissions |
| **Alpha Stake** / `AS` | Alpha token stake (α) for each neuron |
| **Tao Stake** / `TS` | [TAO](../resources/glossary.md#tao-tau) token stake (τ) for each neuron |
| **Ranks** / `R` | Final performance scores after [consensus](../resources/glossary.md#consensus-score) weight clipping - [stake-weighted](../resources/glossary.md#stake-weight) sum of clipped weights that directly determine emissions to miners |
| **Trust** / `T` | [Consensus alignment](../resources/glossary.md#trust) ratio (final rank / pre-rank) - measures how much consensus clipping affected the rank, where 1.0 indicates perfect consensus alignment |
| **Validator Trust** / `Tv` | [Validator trust](../resources/glossary.md#validator-trust) - sum of clipped weights set by each validator, measuring validator influence in consensus |
| **Consensus** / `C` | [Consensus score](../resources/glossary.md#consensus-score) - stake-weighted median of weights per neuron, serving as consensus threshold for weight clipping |
| **Incentive** / `I` | Normalized ranks representing [incentive](../resources/glossary.md#incentives) allocation for miners based on performance |
| **Emission** / `E` | Token [emission](../resources/glossary.md#emission) amounts in [RAO](../resources/glossary.md#rao) (10^-9 TAO) per block |
| **Dividends** / `D` | [Bond](../resources/glossary.md#validator-miner-bonds)-based rewards for validators from their investments in miners |
| **Bonds** / `B` | Inter-neuronal [bond matrix](../resources/glossary.md#validator-miner-bonds) representing validator investments in miners, used to calculate validator emissions |
| **Weights** / `W` | [Weight matrix](../resources/glossary.md#weight-matrix) (validator → miner assignments) formed from validator weight vectors, input for [Yuma Consensus](../resources/glossary.md#yuma-consensus) |
| `uids` |  Unique [UID](../resources/glossary.md#uid-slot) identifiers for each neuron |
| `hotkeys` |  Neuron [hotkey](../resources/glossary.md#hotkey) addresses |
| `coldkeys` |  Neuron [coldkey](../resources/glossary.md#coldkey) addresses |
| `addresses` |  Network IP addresses |
| `axons` |  Network connection details for [axon](../resources/glossary.md#axon) servers |
| `neurons` |  Complete [neuron](../resources/glossary.md#neuron) objects with all metadata |
| `active` |  Neuron activity status within the [`activity_cutoff`](./subnet-hyperparameters.md#activitycutoff) window |
| `last_update` |  Last update block numbers for staleness detection |
| `validator_permit` |  Boolean array indicating whether each neuron has [validator permits](../resources/glossary.md#validator-permit) to set weights and participate in consensus |
| `name` |  Subnet name |
| `symbol` |  Subnet token symbol |
| `network_registered_at` |  Registration block when subnet was created |
| `num_uids` |  Current number of neurons |
| `max_uids` |  Maximum allowed neurons (typically 256) |
| `identities` |  List of chain identities |
| `identity` |  Subnet identity information |
| `pruning_score` |  List of pruning scores based on emissions, used for [deregistration](../resources/glossary.md#deregistration) when subnet is full |
| `block_at_registration` |  List of registration blocks for each neuron, used for [immunity period](../resources/glossary.md#immunity-period) calculations |
| `tao_dividends_per_hotkey` |  [TAO](../resources/glossary.md#tao-tau) dividends by hotkey |
| `alpha_dividends_per_hotkey` |  Alpha dividends by hotkey |
| `last_step` |  Last step block number |
| `tempo` |  [Tempo](../resources/glossary.md#tempo) - block interval for updates (360 blocks = 72 minutes) |
| `blocks_since_last_step` |  Blocks since last step |
| `owner_coldkey` |  Subnet owner [coldkey](../resources/glossary.md#coldkey) |
| `owner_hotkey` |  Subnet owner [hotkey](../resources/glossary.md#hotkey) |
| `hparams` |  Subnet [hyperparameters](./subnet-hyperparameters.md) (`MetagraphInfoParams`) |
| `pool` |  Liquidity pool information (`MetagraphInfoPool`) |
| `emissions` |  Emission configuration (`MetagraphInfoEmissions`) |
</details>

### Neuron Info

A neuron represents any registered participant on the subnet, whether a miner or a validator.

See also:

- [Understanding Neurons](../learn/neurons.md)
- [NeuronInfo class specification, SDK reference](pathname:///python-api/html/autoapi/bittensor/core/chain_data/neuron_info/index.html#bittensor.core.chain_data.neuron_info.NeuronInfo)

<details>
  <summary>Neuron Info Properties</summary>
| Name | Description |
--|--
`uid` | Unique [UID](../resources/glossary.md#uid-slot) identifier for the neuron within the subnet
`hotkey` | [Hotkey](../resources/glossary.md#hotkey) address for network operations and signing
`coldkey` | [Coldkey](../resources/glossary.md#coldkey) address for secure storage and high-risk operations
`stake` | Total [stake weight](../resources/glossary.md#stake-weight) (α + τ × 0.18) determining consensus power and emissions
`rank` | Final [performance rank](../resources/glossary.md#rank) after consensus weight clipping, directly determining emissions
`trust` | [Consensus alignment](../resources/glossary.md#trust) ratio (final rank / pre-rank) measuring impact of consensus filtering
`consensus` | [Consensus score](../resources/glossary.md#consensus-score) - stake-weighted median of weights serving as clipping threshold
`incentive` | Normalized [incentive](../resources/glossary.md#incentives) score representing reward allocation for miners
`emission` | Token [emission](../resources/glossary.md#emission) rate in [RAO](../resources/glossary.md#rao) per block
`dividends` | [Bond](../resources/glossary.md#validator-miner-bonds)-based dividend amount for validators
`validator_trust` | [Validator trust](../resources/glossary.md#validator-trust) measuring validator influence in consensus
`active` | Activity status within the [`activity_cutoff`](./subnet-hyperparameters.md#activitycutoff) window
`last_update` | Last update block number for staleness detection
`validator_permit` | Boolean indicating [validator permit](../resources/glossary.md#validator-permit) status for weight setting and consensus participation
`weights` | [Weight vector](../resources/glossary.md#weight-vector) assignments from this neuron to others
`bonds` | [Bond](../resources/glossary.md#validator-miner-bonds) investments from this neuron to others
`axon_info` | Network connection details for the [axon](../resources/glossary.md#axon) server
  </details>

### Axons

An axon represents a server run by a registered miner, capable of answering requests by validators.

See also:

- [Understanding Neurons](../learn/neurons.md)
- [Axon class specification, SDK reference](pathname:///python-api/html/autoapi/bittensor/core/axon/index.html#module-bittensor.core.axon)
- [Axon class specification, SDK reference](pathname:///python-api/html/autoapi/bittensor/core/axon/index.html#module-bittensor.core.axon)

<details>
  <summary>Axon Properties</summary>

| Name           | Description                                                     |
| -------------- | --------------------------------------------------------------- |
| `hotkey`       | Neuron [hotkey](../resources/glossary.md#hotkey) address        |
| `coldkey`      | Neuron [coldkey](../resources/glossary.md#coldkey) address      |
| `ip`           | IP address for the [axon](../resources/glossary.md#axon) server |
| `port`         | Port number for the axon server                                 |
| `ip_type`      | IP type (IPv4/IPv6)                                             |
| `version`      | Protocol version for axon-dendrite communication                |
| `placeholder1` | Reserved field for future use                                   |
| `placeholder2` | Reserved field for future use                                   |

</details>

### MetagraphInfoParams

Represents the hyperparameters of a subnet.

See also:

- [Subnet Hyperparameters](./subnet-hyperparameters)
- [MetagraphInfoParams class specification, SDK reference](pathname:///python-api/html/autoapi/bittensor/core/chain_data/metagraph_info/index.html#bittensor.core.chain_data.metagraph_info.MetagraphInfoParams)

<details>
  <summary>MetagraphInfoParams (Hyperparams) Properties</summary>

| Name                            | Description                                                                                    |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `activity_cutoff`               | Activity cutoff threshold                                                                      |
| `adjustment_alpha`              | Adjustment alpha parameter                                                                     |
| `adjustment_interval`           | Adjustment interval                                                                            |
| `alpha_high`                    | Alpha high threshold                                                                           |
| `alpha_low`                     | Alpha low threshold                                                                            |
| `bonds_moving_avg`              | Bonds moving average                                                                           |
| `burn`                          | Burn amount                                                                                    |
| `commit_reveal_period`          | Commit reveal period                                                                           |
| `commit_reveal_weights_enabled` | Commit reveal weights enabled                                                                  |
| `difficulty`                    | Network difficulty                                                                             |
| `immunity_period`               | Immunity period                                                                                |
| `kappa`                         | Kappa parameter                                                                                |
| `liquid_alpha_enabled`          | Liquid alpha enabled                                                                           |
| `max_burn`                      | Maximum burn                                                                                   |
| `max_difficulty`                | Maximum difficulty                                                                             |
| `max_regs_per_block`            | Max registrations per block                                                                    |
| `max_validators`                | Maximum validators                                                                             |
| `max_weights_limit`             | Maximum weights limit                                                                          |
| `min_allowed_weights`           | Minimum allowed weights                                                                        |
| `min_burn`                      | Minimum burn                                                                                   |
| `min_difficulty`                | Minimum difficulty                                                                             |
| `pow_registration_allowed`      | POW registration allowed                                                                       |
| `registration_allowed`          | Registration allowed                                                                           |
| `rho`                           | Rho parameter                                                                                  |
| `serving_rate_limit`            | Serving rate limit                                                                             |
| `target_regs_per_interval`      | Target registrations per interval                                                              |
| `tempo`                         | [Tempo](../resources/glossary.md#tempo) - block interval for updates (360 blocks = 72 minutes) |
| `weights_rate_limit`            | [Weights](../resources/glossary.md#weight-vector) rate limit for submissions                   |
| `weights_version`               | [Weights](../resources/glossary.md#weight-vector) version for protocol compatibility           |

</details>

### MetagraphInfoPool

Contains information about the subnet's liquidity pool

See also:

- [Understanding Subnets: Liquidity pools](./understanding-subnets#liquidity-pools).
- [MetagraphInfoPool class specification, SDK reference](pathname:///python-api/html/autoapi/bittensor/core/chain_data/metagraph_info/index.html#bittensor.core.chain_data.metagraph_info.MetagraphInfoPool)

<details>
  <summary>MetagraphInfoPool properties</summary>
| Name | Description |
--|--
`alpha_out`            | Alpha token quanitity bound for emission to subnet participants
`alpha_in`             | Alpha token quanitity emitted to the liquidity pool
`tao_in`               | Tao token emission to the liquidity pool
`subnet_volume`        | Total trading volume in the subnet's liquidity pool
`moving_price`         | Moving average price of the subnet token
</details>
<!-- What's the difference between above and below?  -->
### MetagraphInfoEmissions

Contains detailed information about the subnet's emissions.

See also:

- [Emissions](../learn/emissions).
- [MetagraphInfoEmissions class specification, SDK reference](pathname:///python-api/html/autoapi/bittensor/core/chain_data/metagraph_info/index.html#bittensor.core.chain_data.metagraph_info.MetagraphInfoPool)

<details>
  <summary>MetagraphInfoEmissions properties</summary>
| Name | Description |
--|--
`alpha_out_emission`   | Alpha token outflow [emission](../resources/glossary.md#emission) rate
`alpha_in_emission`    | Alpha token inflow [emission](../resources/glossary.md#emission) rate
`subnet_emission`      | Subnet [emission](../resources/glossary.md#emission) rate to participants
`tao_in_emission`      | [TAO](../resources/glossary.md#tao-tau) token inflow [emission](../resources/glossary.md#emission) rate
`pending_alpha_emission`  | Pending alpha token [emission](../resources/glossary.md#emission) amount
`pending_root_emission`   | Pending root network [emission](../resources/glossary.md#emission) amount
</details>

## Python Code Examples

This section provides practical examples of working with the Bittensor metagraph using the Python SDK. Each example demonstrates different aspects of metagraph analysis and data extraction.

**Prerequisites**:

- Bittensor Python SDK installed (`pip install bittensor`)
- Network connection to access Bittensor blockchain
- Python 3.7+ environment

### Basic Metagraph Information

This example shows how to access basic metagraph metadata and subnet information:

```python
#!/usr/bin/env python3

from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1
    print("Initializing metagraph for subnet 1...")
    metagraph = Metagraph(netuid=1, network="finney", sync=True)

    # Get basic metagraph metadata
    print("\n=== Basic Metagraph Metadata ===")
    print(f"Network: {metagraph.network}")
    print(f"Subnet UID: {metagraph.netuid}")
    print(f"Total neurons: {metagraph.n.item()}")
    print(f"Current block: {metagraph.block.item()}")
    print(f"Version: {metagraph.version.item()}")

    # Get subnet information
    print("\n=== Subnet Information ===")
    print(f"Subnet name: {metagraph.name}")
    print(f"Subnet symbol: {metagraph.symbol}")
    print(f"Registered at block: {metagraph.network_registered_at}")
    print(f"Max UIDs: {metagraph.max_uids}")
    print(f"Owner: {metagraph.owner_coldkey}")

if __name__ == "__main__":
    main()
```

### Neuron Metrics Analysis

This example demonstrates stake distribution and neuron metrics analysis:

```python
#!/usr/bin/env python3

from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1
    print("Initializing metagraph for subnet 1...")
    metagraph = Metagraph(netuid=1, network="finney", sync=True)

    # Get all neuron UIDs
    uids = metagraph.uids
    print(f"\nNeuron UIDs: {uids.tolist()}")

    # Analyze stake distribution
    stakes = metagraph.S  # Total stake
    alpha_stakes = metagraph.AS  # Alpha token stake
    tao_stakes = metagraph.TS  # TAO token stake

    print(f"\n=== Stake Analysis ===")
    print(f"Total stake across all neurons: {stakes.sum().item():.2f}")
    print(f"Average stake per neuron: {stakes.mean().item():.2f}")
    print(f"Highest stake: {stakes.max().item():.2f}")
    print(f"Lowest stake: {stakes.min().item():.2f}")

    # Find top staked neurons
    top_staked_indices = stakes.argsort()[::-1][:10]
    print("\nTop 10 staked neurons:")
    for i, idx in enumerate(top_staked_indices):
        uid = uids[idx].item()
        stake = stakes[idx].item()
        print(f"  {i+1}. UID {uid}: {stake:.2f} τ")

if __name__ == "__main__":
    main()
```

### Performance and Ranking Analysis

This example shows how to analyze neuron performance, ranks, and trust scores:

```python
#!/usr/bin/env python3

from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1
    print("Initializing metagraph for subnet 1...")
    metagraph = Metagraph(netuid=1, network="finney", sync=True)

    # Get performance metrics
    ranks = metagraph.R  # Performance ranks
    trust = metagraph.T  # Trust scores
    consensus = metagraph.C  # Consensus scores
    validator_trust = metagraph.Tv  # Validator trust
    uids = metagraph.uids

    # Find top performing neurons
    top_ranked_indices = ranks.argsort()[::-1][:10]
    print("\n=== Top 10 Ranked Neurons ===")
    for i, idx in enumerate(top_ranked_indices):
        uid = uids[idx].item()
        rank = ranks[idx].item()
        trust_score = trust[idx].item()
        consensus_score = consensus[idx].item()
        print(f"  {i+1}. UID {uid}: Rank={rank:.4f}, Trust={trust_score:.4f}, Consensus={consensus_score:.4f}")

    # Analyze trust distribution
    print(f"\n=== Trust Analysis ===")
    print(f"Average trust score: {trust.mean().item():.4f}")
    print(f"Trust score std dev: {trust.std().item():.4f}")
    print(f"Highest trust: {trust.max().item():.4f}")
    print(f"Lowest trust: {trust.min().item():.4f}")

    # Find most trusted validators
    validator_indices = metagraph.validator_permit.nonzero()[0]
    if len(validator_indices) > 0:
        validator_trust_scores = validator_trust[validator_indices]
        top_validators = validator_indices[validator_trust_scores.argsort()[::-1][:5]]
        print("\n=== Top 5 Trusted Validators ===")
        for i, idx in enumerate(top_validators):
            uid = uids[idx].item()
            vtrust = validator_trust[idx].item()
            print(f"  {i+1}. UID {uid}: Validator Trust={vtrust:.4f}")
    else:
        print("\nNo validators found in this subnet.")

if __name__ == "__main__":
    main()
```

### Economic Analysis

This example demonstrates analysis of economic metrics like incentives, emissions, and dividends:

```python
#!/usr/bin/env python3

from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1
    print("Initializing metagraph for subnet 1...")
    metagraph = Metagraph(netuid=1, network="finney", sync=True)

    # Get economic metrics
    incentives = metagraph.I  # Incentive scores
    emissions = metagraph.E  # Emission rates
    dividends = metagraph.D  # Dividend distributions
    uids = metagraph.uids

    # Analyze incentive distribution
    print(f"\n=== Incentive Analysis ===")
    print(f"Total incentives: {incentives.sum().item():.4f}")
    print(f"Average incentive: {incentives.mean().item():.4f}")
    print(f"Highest incentive: {incentives.max().item():.4f}")

    # Find highest incentivized neurons
    top_incentive_indices = incentives.argsort()[::-1][:10]
    print("\n=== Top 10 Incentivized Neurons ===")
    for i, idx in enumerate(top_incentive_indices):
        uid = uids[idx].item()
        incentive = incentives[idx].item()
        emission = emissions[idx].item()
        dividend = dividends[idx].item()
        print(f"  {i+1}. UID {uid}: Incentive={incentive:.4f}, Emission={emission:.4f}, Dividend={dividend:.4f}")

    # Analyze dividend distribution
    print(f"\n=== Dividend Analysis ===")
    print(f"Total dividends: {dividends.sum().item():.4f}")
    print(f"Average dividend: {dividends.mean().item():.4f}")
    print(f"Dividend std dev: {dividends.std().item():.4f}")

if __name__ == "__main__":
    main()
```

### Network Connectivity Analysis

This example shows how to analyze network addresses and axon information:

```python
#!/usr/bin/env python3

from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1
    print("Initializing metagraph for subnet 1...")
    metagraph = Metagraph(netuid=1, network="finney", sync=True)

    # Get network information
    axons = metagraph.axons
    uids = metagraph.uids

    # Analyze network addresses
    addresses = [axon.ip for axon in axons]
    unique_addresses = set(addresses)
    unique_hotkeys = set(metagraph.hotkeys)
    unique_coldkeys = set(metagraph.coldkeys)

    print(f"\n=== Network Address Analysis ===")
    print(f"Total unique addresses: {len(unique_addresses)}")
    print(f"Total unique hotkeys: {len(unique_hotkeys)}")
    print(f"Total unique coldkeys: {len(unique_coldkeys)}")

    # Find neurons sharing addresses
    address_to_uids = {}
    for i, address in enumerate(addresses):
        if address not in address_to_uids:
            address_to_uids[address] = []
        address_to_uids[address].append(uids[i].item())

    print(f"\n=== Neurons Sharing Addresses ===")
    for address, uids_list in address_to_uids.items():
        if len(uids_list) > 1:
            print(f"  Address {address}: UIDs {uids_list}")

    # Show axon details for first few neurons
    print(f"\n=== Axon Details (First 5 Neurons) ===")
    for i in range(min(5, len(axons))):
        axon = axons[i]
        uid = uids[i].item()
        hotkey = metagraph.hotkeys[i][:10] + "..."
        print(f"  UID {uid}: IP={axon.ip}, Port={axon.port}, Hotkey={hotkey}")

if __name__ == "__main__":
    main()
```

### Weight Matrix Analysis

This example demonstrates weight matrix analysis (requires `lite=False`):

```python
#!/usr/bin/env python3

from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1 with full sync (not lite)
    print("Initializing metagraph for subnet 1 (full sync)...")
    metagraph = Metagraph(netuid=1, network="finney", lite=False, sync=True)

    uids = metagraph.uids

    # Get weight matrix (requires lite=False)
    if not metagraph.lite and hasattr(metagraph, 'weights') and metagraph.weights.size > 0:
        weights = metagraph.W  # Weight matrix

        print(f"\n=== Weight Matrix Analysis ===")
        print(f"Weight matrix shape: {weights.shape}")
        print(f"Total weights: {weights.sum().item():.4f}")
        print(f"Average weight: {weights.mean().item():.4f}")
        print(f"Max weight: {weights.max().item():.4f}")

        # Find miners receiving most weights
        weight_received = weights.sum(axis=0)  # Sum of incoming weights
        top_receivers = weight_received.argsort()[::-1][:10]
        print("\n=== Miners Receiving Most Frequent Weights ===")
        for i, idx in enumerate(top_receivers):
            uid = uids[idx].item()
            total_weight = weight_received[idx].item()
            print(f"  {i+1}. UID {uid}: {total_weight:.4f}")

        # Find validators sending most weights
        weight_sent = weights.sum(axis=1)  # Sum of outgoing weights
        top_senders = weight_sent.argsort()[::-1][:10]
        print("\n=== Validators Setting Weights Most Frequently ===")
        for i, idx in enumerate(top_senders):
            uid = uids[idx].item()
            total_weight = weight_sent[idx].item()
            print(f"  {i+1}. UID {uid}: {total_weight:.4f}")

        # Find highest set weight
        max_weight_idx = weights.argmax()
        sender_idx = max_weight_idx // weights.shape[1]
        receiver_idx = max_weight_idx % weights.shape[1]
        max_weight = weights.max().item()
        print(f"\n=== Highest Single Set Weight ===")
        print(f"UID {uids[sender_idx].item()} -> UID {uids[receiver_idx].item()}: {max_weight:.4f}")
    else:
        print("Weights not available. Make sure to use lite=False when initializing the metagraph.")

if __name__ == "__main__":
    main()
```

### Bond Analysis

This example shows bond matrix analysis (requires `lite=False`):

```python
#!/usr/bin/env python3

from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1 with full sync (not lite)
    print("Initializing metagraph for subnet 1 (full sync)...")
    metagraph = Metagraph(netuid=1, network="finney", lite=False, sync=True)

    uids = metagraph.uids

    # Get bond matrix (requires lite=False)
    if not metagraph.lite and hasattr(metagraph, 'bonds') and metagraph.bonds.size > 0:
        bonds = metagraph.B  # Bond matrix

        print(f"\n=== Bond Matrix Analysis ===")
        print(f"Bond matrix shape: {bonds.shape}")
        print(f"Total bonds: {bonds.sum().item():.4f}")
        print(f"Average bond: {bonds.mean().item():.4f}")

        # Find miners with most bonds
        bonds_received = bonds.sum(axis=0)  # Sum of incoming bonds
        top_bonded = bonds_received.argsort()[::-1][:10]
        print("\n=== Top 10 Most Bonded Miners ===")
        for i, idx in enumerate(top_bonded):
            uid = uids[idx].item()
            total_bonds = bonds_received[idx].item()
            print(f"  {i+1}. UID {uid}: {total_bonds:.4f}")
    else:
        print("Bonds not available. Make sure to use lite=False when initializing the metagraph.")

if __name__ == "__main__":
    main()
```

### Neuron Activity Analysis

This example demonstrates analyzing validator activity:

```python
#!/usr/bin/env python3

from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1
    print("Initializing metagraph for subnet 1...")
    metagraph = Metagraph(netuid=1, network="finney", sync=True)

    # Get activity information
    active = metagraph.active  # Activity status
    last_update = metagraph.last_update  # Last update blocks
    validator_permit = metagraph.validator_permit  # Validator permissions
    uids = metagraph.uids
    stakes = metagraph.S
    ranks = metagraph.R

    # Analyze activity
    active_count = active.sum().item()
    total_count = len(active)
    print(f"\n=== Activity Analysis ===")
    print(f"Active validators: {active_count}/{total_count} ({active_count/total_count:.1%})")


    # Analyze validator distribution
    validator_count = validator_permit.sum().item()
    print(f"\n=== Validator Analysis ===")
    print(f"Validators: {validator_count}/{total_count} ({validator_count/total_count:.1%})")

    # Find validators
    validator_indices = validator_permit.nonzero()[0]
    if len(validator_indices) > 0:
        print("\n=== Validators ===")
        for idx in validator_indices:
            uid = uids[idx].item()
            stake = stakes[idx].item()
            rank = ranks[idx].item()
            print(f"  UID {uid}: Stake={stake:.2f}, Rank={rank:.4f}")
    else:
        print("\nNo validators found in this subnet.")

if __name__ == "__main__":
    main()
```

### Subnet Economics

This example shows how to access subnet hyperparameters, pool, and emissions:

```python
#!/usr/bin/env python3

from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1
    print("Initializing metagraph for subnet 1...")
    metagraph = Metagraph(netuid=1, network="finney", sync=True)

    # Get subnet hyperparameters
    hparams = metagraph.hparams
    print(f"\n=== Subnet Hyperparameters ===")
    print(f"  Activity cutoff: {hparams.activity_cutoff}")
    print(f"  Adjustment alpha: {hparams.adjustment_alpha}")
    print(f"  Adjustment interval: {hparams.adjustment_interval}")
    print(f"  Alpha high: {hparams.alpha_high}")
    print(f"  Alpha low: {hparams.alpha_low}")
    print(f"  Burn rate: {hparams.burn}")
    print(f"  Max burn: {hparams.max_burn}")
    print(f"  Min burn: {hparams.min_burn}")
    print(f"  Difficulty: {hparams.difficulty}")
    print(f"  Max difficulty: {hparams.max_difficulty}")
    print(f"  Min difficulty: {hparams.min_difficulty}")
    print(f"  Max validators: {hparams.max_validators}")
    print(f"  Tempo: {hparams.tempo}")
    print(f"  Weights version: {hparams.weights_version}")

    # Get subnet pool information
    pool = metagraph.pool
    print(f"\n=== Subnet Pool ===")
    print(f"  Alpha out: {pool.alpha_out}")
    print(f"  Alpha in: {pool.alpha_in}")
    print(f"  TAO in: {pool.tao_in}")
    print(f"  Subnet volume: {pool.subnet_volume}")
    print(f"  Moving price: {pool.moving_price}")

    # Get subnet emissions
    emissions = metagraph.emissions
    print(f"\n=== Subnet Emissions ===")
    print(f"  Alpha out emission: {emissions.alpha_out_emission}")
    print(f"  Alpha in emission: {emissions.alpha_in_emission}")
    print(f"  Subnet emission: {emissions.subnet_emission}")
    print(f"  TAO in emission: {emissions.tao_in_emission}")
    print(f"  Pending alpha emission: {emissions.pending_alpha_emission}")
    print(f"  Pending root emission: {emissions.pending_root_emission}")

if __name__ == "__main__":
    main()
```

### Advanced Analysis Examples

This example demonstrates advanced analysis techniques including correlations and [Gini coefficient](https://en.wikipedia.org/wiki/Gini_coefficient) of stake distribution.

```python
#!/usr/bin/env python3

import numpy as np
from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1
    print("Initializing metagraph for subnet 1...")
    metagraph = Metagraph(netuid=1, network="finney", sync=True)

    # Get basic metrics
    stakes = metagraph.S
    ranks = metagraph.R
    trust = metagraph.T
    uids = metagraph.uids

    # Correlation analysis between metrics
    print("\n=== Metric Correlations ===")
    try:
        # Calculate correlations
        stake_rank_corr = np.corrcoef(stakes, ranks)[0, 1]
        stake_trust_corr = np.corrcoef(stakes, trust)[0, 1]
        rank_trust_corr = np.corrcoef(ranks, trust)[0, 1]

        print("Metric Correlations:")
        print(f"  Stake vs Rank: {stake_rank_corr:.4f}")
        print(f"  Stake vs Trust: {stake_trust_corr:.4f}")
        print(f"  Rank vs Trust: {rank_trust_corr:.4f}")
    except Exception as e:
        print(f"Could not calculate correlations: {e}")

    # Network efficiency analysis (if weights are available)
    if not metagraph.lite and hasattr(metagraph, 'weights') and metagraph.weights.size > 0:
        weights = metagraph.W

        print("\n=== Network Efficiency Analysis ===")
        # Calculate network efficiency (average path length)
        non_zero_weights = weights[weights > 0]
        if len(non_zero_weights) > 0:
            avg_weight = non_zero_weights.mean().item()
            weight_std = non_zero_weights.std().item()
            print(f"Network efficiency:")
            print(f"  Average non-zero weight: {avg_weight:.4f}")
            print(f"  Weight standard deviation: {weight_std:.4f}")
            print(f"  Weight distribution CV: {weight_std/avg_weight:.4f}")
    else:
        print("\nWeights not available for network efficiency analysis.")

    # Stake concentration analysis
    print("\n=== Stake Concentration Analysis ===")
    total_stake = stakes.sum().item()
    try:
        stake_percentiles = np.percentile(stakes, [25, 50, 75, 90, 95, 99])
        print("Stake distribution percentiles:")
        for p, val in zip([25, 50, 75, 90, 95, 99], stake_percentiles):
            print(f"  {p}th percentile: {val:.2f} τ")

        # Gini coefficient for stake inequality
        sorted_stakes = np.sort(stakes)
        n = len(sorted_stakes)
        cumulative_stakes = np.cumsum(sorted_stakes)
        gini = (n + 1 - 2 * np.sum(cumulative_stakes) / cumulative_stakes[-1]) / n
        print(f"Stake Gini coefficient: {gini:.4f}")
    except Exception as e:
        print(f"Could not calculate stake concentration metrics: {e}")

if __name__ == "__main__":
    main()
```

### Async Usage

This example demonstrates async metagraph usage:

```python
#!/usr/bin/env python3

import asyncio
from bittensor.core.async_subtensor import AsyncSubtensor
from bittensor.core.metagraph import async_metagraph

async def analyze_metagraph():
    # Create async subtensor first
    async with AsyncSubtensor(network="finney") as subtensor:
        # Create async metagraph with subtensor
        print("Creating async metagraph...")
        metagraph = await async_metagraph(
            netuid=1,
            network="finney",
            lite=False,
            subtensor=subtensor  # Pass the subtensor
        )

        # Perform analysis
        stakes = metagraph.S
        print(f"Total stake: {stakes.sum().item():.2f}")

        # Sync to latest block
        print("Syncing to latest block...")
        await metagraph.sync(subtensor=subtensor)
        print(f"Synced to block: {metagraph.block.item()}")

async def main():
    print("=== Async Metagraph Analysis ===")
    await analyze_metagraph()

if __name__ == "__main__":
    asyncio.run(main())
```

### Complete Neuron Information

This example shows how to access complete neuron object information:

```python
#!/usr/bin/env python3

from bittensor.core.metagraph import Metagraph

def main():
    # Initialize metagraph for subnet 1
    print("Initializing metagraph for subnet 1...")
    metagraph = Metagraph(netuid=1, network="finney", sync=True, lite=False)

    # Get complete neuron information for first 5 neurons
    print("=== Complete Neuron Information (First 5 Neurons) ===")

    for i in range(min(5, metagraph.n.item())):
        neuron = metagraph.neurons[i]
        axon = metagraph.axons[i]  # Fixed: Access axon from metagraph.axons

        print(f"\nNeuron {i}:")
        print(f"  UID: {neuron.uid}")
        print(f"  Hotkey: {neuron.hotkey}")
        print(f"  Coldkey: {neuron.coldkey}")
        print(f"  Stake: {neuron.stake}")
        print(f"  Rank: {neuron.rank}")
        print(f"  Trust: {neuron.trust}")
        print(f"  Consensus: {neuron.consensus}")
        print(f"  Incentive: {neuron.incentive}")
        print(f"  Emission: {neuron.emission}")
        print(f"  Dividends: {neuron.dividends}")
        print(f"  Active: {neuron.active}")
        print(f"  Last update: {neuron.last_update}")
        print(f"  Validator permit: {neuron.validator_permit}")
        print(f"  Validator trust: {neuron.validator_trust}")
        print(f"  Axon IP: {axon.ip}")  # From metagraph.axons
        print(f"  Axon port: {axon.port}")
        print(f"  ---")

if __name__ == "__main__":
    main()
```

## Source Code References

### Core Implementation

- **Metagraph Class**: [`bittensor/bittensor/core/metagraph.py`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/metagraph.py)
- **Chain Data**: [`bittensor/bittensor/core/chain_data/metagraph_info.py`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/chain_data/metagraph_info.py)
- **Subtensor RPC**: [`subtensor/pallets/subtensor/src/rpc_info/metagraph.rs`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/rpc_info/metagraph.rs)

### Consensus Algorithm

- **Yuma Consensus**: [`subtensor/pallets/subtensor/src/epoch/run_epoch.rs`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs)
- **Mathematical Operations**: [`subtensor/pallets/subtensor/src/epoch/math.rs`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/math.rs)

### Key Constants

- **TAO Stake Weight**: [`bittensor/bittensor/core/settings.py:7`](https://github.com/opentensor/bittensor/blob/main/bittensor/core/settings.py#L7) - `ROOT_TAO_STAKE_WEIGHT = 0.18`
