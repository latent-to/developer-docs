---
title: "Mining and Validating on Localnet"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { SdkVersion } from "../sdk/\_sdk-version.mdx";

# Mining and Validating on Localnet

This page walks through mining and validating on a local Bittensor network. It covers how to register a neuron on a subnet, then run the miner and validator scripts to begin earning emissions.

For mining and validating on the Bittensor mainnet, see [Mining in Bittensor](../miners/index.md) and [Validating in Bittensor](../validators/index.md).

## Prerequisites

Before continuing with the rest of this tutorial, make sure you've completed the following:

- [Deploy a Subtensor chain locally](./deploy)
- [Provision wallets for the subnet creator, miner, and validator users for this tutorial.](./provision-wallets)
- [Created and started a subnet](./create-subnet) to enable emissions.

This guide uses Opentensor's [_subnet template_](https://github.com/opentensor/subnet-template/tree/main) repo. The repo provides a minimal implementation for building a custom subnet on the Bittensor network and includes the core logic for the miner and validator.

## 1. Register the neuron hotkeys

To participate in a subnet, you must first register a hotkey on it. This registration assigns the wallet a unique identifier (UID), which is required to interact with and receive emissions from the subnet.

To register the hotkey, run the following command in your terminal, replacing `NETUID`, `WALLET_NAME`, and `WALLET_HOTKEY` with the target subnet ID, the name of the wallet, and the associated hotkey, respectively, as shown:

```bash
btcli subnets register --netuid NETUID \
--wallet-name WALLET_NAME \
--hotkey WALLET_HOTKEY \
--network ws://127.0.0.1:9945
```

You will be prompted to confirm the registration fee and enter your wallet password to authorize the transaction.

<details>
<summary><strong>Show Sample Output</strong></summary>

```console
Warning: Verify your local subtensor is running on port 9944.                                                                                                                     subtensor_interface.py:88
Using the specified network local from config

                                                      Register to netuid: 2
                                                          Network: local

 Netuid ┃ Symbol ┃ Cost (Τ) ┃                      Hotkey                      ┃                     Coldkey
━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   2    │   β    │ τ 0.0985 │ 5FErfAJc3Wf32TVLQTtM....TRTrgMF4sjYWfq49oMCxXxqS │ 5Gxhv5iZGBvvR6YJeEdLmvZ7hS....dHc43fLqMVkhki7j4
────────┼────────┼──────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────
        │        │          │                                                  │
Your balance is: 99,999.9000 τ
The cost to register by recycle is 0.0985 τ
Do you want to continue? [y/n] (n): y
Enter your password:
Decrypting...
Balance:
  99,999.9000 τ ➡ 99,999.8015 τ
✅ Registered on netuid 3 with UID 2
```

</details>

Repeat the registration process for both the miner and validator hotkeys.

To confirm the registration of your hotkeys in the subnet, run the following command in your terminal:

```sh
btcli subnet show --netuid NETUID --network ws://127.0.0.1:9945
```

The command returns detailed information about a subnet including its registered neurons and their state.

<details>
<summary><strong>Show Sample Output</strong></summary>

```console

Warning: Verify your local subtensor is running on port 9944.                                                                                                                     subtensor_interface.py:89



                                                     Subnet 2: New subnet
                                                     Network: local

 UID ┃ Stake (β) ┃ Alpha (β) ┃ Tao (τ) ┃ Dividends ┃ Incentive ┃ Emissions (β) ┃ Hotkey ┃ Coldkey ┃ Identity
━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━
  0  │    5.04 β │    5.04 β │  τ 0.00 │ 0.000000  │ 0.000000  │  9.017303 β   │ 5DFZTw │ 5Dc1Qu  │ (*Owner controlled)
  1  │    0.00 β │    1.00 β │  τ 0.00 │ 0.000000  │ 0.000000  │  0.000000 β   │ 5FErfA │ 5GxHV5  │ ~
  2  │    0.00 β │    1.00 β │  τ 0.00 │ 0.000000  │ 0.000000  │  0.000000 β   │ 5GRLEv │ 5EnNgi  │ ~
─────┼───────────┼───────────┼─────────┼───────────┼───────────┼───────────────┼────────┼─────────┼─────────────────────
     │    5.04 β │    5.04 β │  0.00 β │   0.000   │           │  9.017303 β   │        │         │


Subnet 2: New subnet
  Owner: 5Dc1Qu2pDfWuDzt3c5wJV2LxRXAmVqZYsAib72e59H3vnRVn
  Rate: 1.0056 τ/β
  Emission: τ 0.0000
  TAO Pool: τ 1.10k
  Alpha Pool: 1.10 β
  Tempo: 8/360
  Registration cost (recycled): τ 0.0845

```

</details>

## 2. Acquire validator permit

To qualify as a validator on a subnet, a registered node must have a validator permit. This permit allows nodes to submit miner evaluations and set weights on a subnet. For more information, see [validator permits](../validators/index.md#requirements-for-validation).

To get validator permits on the demo subnet, you need to stake sufficient TAO to the validator hotkey. To do this, run the following command in the terminal:

```bash
btcli stake add --netuid NETUID \
--wallet-name WALLET_NAME \
--hotkey WALLET_HOTKEY \
--partial \
--network ws://127.0.0.1:9945
```

:::info
When running a local chain in fast-blocks mode, we recommend using the `--no-mev-protection` flag when executing this command.
:::

Replace `NETUID`, `WALLET_NAME`, and `WALLET_HOTKEY` with the target subnet ID, the name of the wallet, and the associated hotkey, respectively.

Once you've staked enough TAO to the validator hotkey, the validator becomes eligible to submit evaluations and set weights on the subnet. You can verify that the validator has been granted a permit using any of the following methods:

<Tabs queryString="local-chain">
<TabItem value="btcli" label="Using BTCLI">
Run the following command in the terminal:
```bash
btcli wallet overview --wallet.name WALLET_NAME --network ws://127.0.0.1:9945
```
Replace the `WALLET_NAME` with the name of the validator wallet.

<details>
<summary><strong>Show Sample Output</strong></summary>

```console
Warning: Verify your local subtensor is running on port 9944.                                                                                                                     subtensor_interface.py:88
Using the specified network local from config
                                                                                                     Wallet

                                                                        test-validator : 5Gxhv5iZGBvvR6YJeEd...bE6FdHc43fLqMVkhki7j4
                                                                                                 Network: local
Subnet: 2: New subnet β

  COLDKEY          HOTKEY           UID      ACTIVE     STAKE(β)         RANK        TRUST    CONSENSUS    INCENTIVE    DIVIDENDS   EMISSION(…       VTRUST   VPE…   UPDAT…   AXON                HOTKEY_SS58
 ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  test-validator   test-validator   1         False       287.57         0.00         0.00         0.00         0.00         0.00   38841066.…         0.00    *       5908   none                5FErfAJc3W
 ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
                                    1                   287.57 β       0.0000       0.0000       0.0000       0.0000       0.0000    ρ38841066       0.0000

                                                                       Wallet free balance: 99,994.3638 τ
```

</details>

If the validator wallet has a validator permit, an asterisk (`*`) is shown under the `VPERMIT` column for the corresponding subnet in the response table.

</TabItem>
<TabItem value="python SDK" label="Using Bittensor SDK">

<SdkVersion />

Input the following lines in your Python environment, replacing `NETUID`, `WALLET_NAME`, and `WALLET_HOTKEY` with the target subnet ID, the name of the validator wallet, and its associated hotkey, respectively.

```python
import bittensor as bt
network=bt.Subtensor(network="local")
subnet = network.metagraph(NETUID)
wallet = bt.Wallet( name = 'WALLET_NAME', hotkey = 'HOTKEY' )
my_uid = subnet.hotkeys.index( wallet.hotkey.ss58_address )
print(f'Validator permit: {subnet.validator_permit[my_uid]}')
```

The command outputs `True` or `False` depending on whether the validator hotkey has a permit.
</TabItem>
</Tabs>

:::info Validator Permits on Localnet Subnets
On localnet subnets, competition for permits is typically minimal. After staking TAO to the validator hotkey, the neuron should become eligible for a validator permit. If it does not yet have one, wait until the end of the subnet’s tempo.
:::

## 3. Pull the `subnet-template` repo

The `subnet-template` repo contains the core logic for the subnet miner and validator. It features a simple `dummy` protocol where miners multiply input values by 2, while validators evaluate responses and update network weights based on performance.

To begin, clone the `subnet-template` GitHub repository and navigate into its directory:

```sh
git clone https://github.com/opentensor/subnet-template.git
cd subnet-template
```

:::info
After changing to the `subnet-template` directory, you must install the dependencies required to run the miner and validator Python scripts. To do this, create a virtual environment and run the following command in the `subnet-template` directory:

```sh
pip install bittensor
```

:::

## 4. Run the miner and validator

After getting the validator permits, you can now run the validator alongside the miner to begin participating in the subnet.

Begin by starting the miner process to produce and submit work to the subnet. Then, run the validator process on a different terminal tab to evaluate miner outputs and set weights for the network.

:::info

- To ensure proper operation, run the miner and validator processes concurrently, each in a separate terminal tab or session.
- Also, run the `miner.py` and `validator.py` scripts in the Python environment with the Bittensor SDK installed.
  :::

### Start the miner process

To start the miner, run the following Python script in the `subnet-template` directory:

```sh
python miner.py \
  --wallet.name WALLET_NAME \
  --wallet.hotkey HOTKEY \
  --netuid NETUID \
  --axon.port 8901 \
  --subtensor.network local
```

The script launches an Axon server on port `8901`, which the miner uses to receive incoming requests from validators.

### Start the validator process

To start the validator process, run the following Python script in the `subnet-template` directory:

```sh
python validator.py \
  --wallet.name WALLET_NAME \
  --wallet.hotkey HOTKEY \
  --netuid NETUID \
  --subtensor.network local
```

This script begins the process of sending inputs to the miners and setting weights based on miner responses.

:::info miner and validator logs
Use the `--logging.info` flag to print miner and validator log messages directly to the console. This helps you monitor activity in real time.
:::

## 5. Check your emissions

After weights have been successfully set on the subnet, you can check the updated emissions distribution at the end of the subnet's [tempo](../resources/glossary.md#tempo).

To check the subnet's emissions, run the following command in the terminal:

```sh
btcli subnet show --netuid NETUID --network ws://127.0.0.1:9945
```

The command returns detailed information about a subnet, including its registered neurons, their current state, and updated emission earnings.

<details>
<summary><strong>Show Sample Output</strong></summary>

```console

Using the specified network local from config
Warning: Verify your local subtensor is running on port 9944.                                                                                                                     subtensor_interface.py:89



                                                  Subnet 2: New subnet
                                                     Network: local

 UID ┃ Stake (β) ┃ Alpha (β) ┃ Tao (τ) ┃ Dividends ┃ Incentive ┃ Emissions (β) ┃ Hotkey ┃ Coldkey ┃ Identity
━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━
  0  │  109.80 β │  109.80 β │  τ 0.00 │ 0.000000  │ 0.000000  │  0.000000 β   │ 5DFZTw │ 5Dc1Qu  │ (*Owner controlled)
  1  │  354.68 β │  354.68 β │  τ 0.00 │ 1.000000  │ 0.000000  │ 148.010826 β  │ 5FErfA │ 5Gxhv5  │ Test validator
  2  │  148.01 β │  148.01 β │  τ 0.00 │ 0.000000  │ 1.000000  │ 148.010826 β  │ 5GRLEv │ 5EnNgi  │ Test miner
─────┼───────────┼───────────┼─────────┼───────────┼───────────┼───────────────┼────────┼─────────┼─────────────────────
     │  612.49 β │  612.49 β │  0.00 β │   1.000   │           │  296.0217 β   │        │         │


Subnet 2: New subnet
  Owner: 5Dc1Qu2pDfWuDzt3c5wJV2LxRXAmVqZYsAib72e59H3vnRVn
  Rate: 1.0054 τ/β
  Emission: τ 0.0000
  TAO Pool: τ 1.62k
  Alpha Pool: 1.61k β
  Tempo: 23/360
  Registration cost (recycled): τ 0.1000

```

Note the increase in the miner neuron's `Incentive` column and the validator neuron's `Dividend` column as well as the `Emissions` on both neurons.

</details>

For more information on a subnet's emission distribution, see [Emissions](../learn/emissions.md).

## Troubleshooting errors

This section discusses errors that could arise while running the validator or miner, and provides steps to diagnose and resolve them.

**Insufficient funds**

The coldkey signing the `btcli subnet register` transaction must have a sufficient $\tau$ balance to cover the recycling cost of the registration.

<details>
<summary><strong>Show sample error</strong></summary>

```console
Insufficient balance 0.0000 τ to register neuron. Current recycle is 0.0970 τ TAO.
```

</details>

**Unregistered miner or validator**

This occurs when you attempt to run a miner or validator on a subnet where it is not registered.

<details>
<summary><strong>Show sample error</strong></summary>

```console
Your miner: Wallet (Name: 'test-miner', Hotkey: 'test-miner', Path: '~/.bittensor/wallets/') is not registered to chain connection: Network: local, Chain: ws://127.0.0.1:9944 
Run 'btcli register' and try again.
```

</details>

**`NeuronNoValidatorPermit`**

This means that the neuron is attempting to set weights without a validator permit. Try fix this, you must stake sufficient TAO to the validator hotkey and wait till the end of the subnet's tempo.

<details>
<summary><strong>Show sample error</strong></summary>

```console
Failed set weights. Error: Subtensor returned `NeuronNoValidatorPermit(Module)` error. This means: `The caller is attempting to set non-self weights without being a permitted validator. | Please consult https://docs.bittensor.com/errors/subtensor#neuronnovalidatorpermit`.
```

</details>

**`WeightVecLengthIsLow`**

This error occurs when the validator attempts to set weights for fewer elements than allowed. It often happens when all neurons in the subnet are unresponsive, causing the validator to try setting zero weights for each of them.

<details>
<summary><strong>Show sample error</strong></summary>

```console
Error: Subtensor returned `WeightVecLengthIsLow(Module)` error. This means: `The dispatch is attempting to set weights on chain with fewer elements than are allowed. | Please consult https://docs.bittensor.com/errors/subtensor#weightveclengthislow`.
```

</details>
