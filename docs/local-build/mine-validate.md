---
title: "Mining and Validating on Localnet"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Mining and Validating on Localnet

This page walks through mining and validating on a local Bittensor network. It covers how to register a neuron on a subnet, then run the miner and validator scripts to begin earning emissions.

For mining and validating on the Bittensor mainnet, see [Mining in Bittensor](../miners/index.md) and [Validating in Bittensor](../validators/index.md).

## Prerequisites

Before continuing with the rest of this tutorial, make sure you've completed the following:

- [Deploy a Subtensor chain locally](./deploy)
- [Provision wallets for the subnet creator, miner, and validator users for this tutorial.](./provision-wallets)
- [Created and started a subnet](./create-subnet) to enable emissions.

This guide uses Opentensor's [_subnet template_](https://github.com/opentensor/subnet-template/tree/main) repo. The repo provides a minimal implementation for building a custom subnet on the Bittensor network and includes the core logic for the miner and validator.

## 1. Register the hotkeys

To participate in a subnet, you must first register a hotkey on it. This registration assigns the wallet a unique identifier (UID), which is required to interact with and receive emissions from the subnet.

To register the hotkey, run the following command in your terminal, replacing `NETUID`, `WALLET_NAME`, and `WALLET_HOTKEY` with the target subnet ID, the name of the wallet, and the associated hotkey, respectively, as shown:

```bash
btcli subnets register --netuid NETUID \
--wallet-name WALLET_NAME \
--hotkey WALLET_HOTKEY
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
   2    │   γ    │ τ 0.0985 │ 5FErfAJc3Wf32TVLQTtM....TRTrgMF4sjYWfq49oMCxXxqS │ 5Gxhv5iZGBvvR6YJeEdLmvZ7hS....dHc43fLqMVkhki7j4
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

## 2. Acquire validator permit

To qualify as a validator on a subnet, a registered node must have a validator permit. This permit allows nodes to submit miner evaluations and set weights on a subnet. For more information, see [validator permits]

To get validator permits on the demo subnet, you need to stake sufficient TAO to the validator hotkey. To do this, run the following command in the terminal:

```bash
btcli stake add --netuid NETUID \
--wallet-name WALLET_NAME \
--hotkey WALLET_HOTKEY \
--partial
```

Replace `NETUID`, `WALLET_NAME`, and `WALLET_HOTKEY` with the target subnet ID, the name of the wallet, and the associated hotkey, respectively.

Once you've staked enough TAO to the validator hotkey, the validator becomes eligible to submit evaluations and set weights on the subnet. You can verify that the validator has been granted a permit using any of the following methods:

<Tabs queryString="local-chain">
<TabItem value="btcli" label="Using BTCLI">
Run the following command in the terminal:
```bash
btcli wallet overview --wallet.name WALLET_NAME 
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
Subnet: 2: New subnett β

  COLDKEY          HOTKEY           UID      ACTIVE     STAKE(β)         RANK        TRUST    CONSENSUS    INCENTIVE    DIVIDENDS   EMISSION(…       VTRUST   VPE…   UPDAT…   AXON                HOTKEY_SS58
 ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  test-validator   test-validator   1         False       287.57         0.00         0.00         0.00         0.00         0.00   38841066.…         0.00    *       5908   none                5FErfAJc3W
 ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
                                    1                   287.57 β       0.0000       0.0000       0.0000       0.0000       0.0000    ρ38841066       0.0000

```

</details>

If the validator wallet has a validator permit, an asterisk (`*`) will appear under the `VPERMIT` column for the corresponding subnet in the response table.

</TabItem>
<TabItem value="python SDK" label="Using Bittensor SDK">
Input the following lines in your Python environment, replacing `NETUID`, `WALLET_NAME`, and `WALLET_HOTKEY` with the target subnet ID, the name of the wallet, and the associated hotkey, respectively.

```python
import bittensor as bt
network=bt.subtensor(network="local")
subnet = network.metagraph(NETUID)
wallet = bt.wallet( name = 'WALLET_NAME', hotkey = 'HOTKEY' )
my_uid = subnet.hotkeys.index( wallet.hotkey.ss58_address )
print(f'Validator permit: {subnet.validator_permit[my_uid]}')
```

The command outputs `True` or `False` depending on whether the validator hotkey has a permit.
</TabItem>
</Tabs>

---

### Troubleshoot

#### Insufficient funds

If you have not added TAO to your validator wallet, you'll see an error like the following:

```console
Insufficient balance τ 0.0000 to register neuron. Current recycle is τ 1.0000 TAO
```

Transfer funds from the Alice account to cover it and try again. Consult `btcli w list` and carefully check the ss58 address of the destination coldkey (in this case, the one with the name `validator`).

```shell
btcli wallet transfer \
--amount 11 \
--wallet.name alice \
--destination "5EEy34..." \
--network ws://127.0.0.1:9945
```

### Successful registration

Repeat the above steps to successfully register your miner and validator once they are funded

```console
netuid: 2


                                                   Register to netuid: 2
                                                      Network: custom

 Netu… ┃ Sym… ┃ Cost (… ┃                     Hotkey                     ┃                     Coldkey
━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   2   │  β   │ τ 1.00… │ 5CffqSVhydFJHBSbbgfVLAVkoNBTsv3wLj2Tsh1cr2kfa… │ 5EEy34R4gfXe5SG62nz1nDuh3KAovRLpKLm4ccSv7qkNhn…
───────┼──────┼─────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────
       │      │         │                                                │
Your balance is: τ 11.0000
The cost to register by recycle is τ 1.0000
Do you want to continue? [y/n] (n): y
Enter your password:
Decrypting...
Balance:
  τ 11.0000 ➡ τ 10.0000
✅ Registered on netuid 2 with UID 1
▰▱▱▱▱▱▱ 📡 Recycling TAO for Registration...
```

### Check your registration

Confirm your registration on the subnet with the following command:

```shell
btcli wallet overview --wallet.name validator --network ws://127.0.0.1:9945

btcli wallet overview --wallet.name miner --network ws://127.0.0.1:9945

```

```console
                                                        Wallet

                             validator : 5EEy34R4gfXe5SG62nz1nDuh3KAovRLpKLm4ccSv7qkNhnqw
                                                   Network: custom
Subnet: 2: awesome-first-subnet β

  COLDKEY   HOTKEY    UID   AC…   STA…   RANK   TRU…   CON…   INC…   DIV…   EMI…   VTR…   …   U…   AXON       HOTKE…
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  valida…   default   1     Tr…   0.00   0.00   0.00   0.00   0.00   0.00   0.0…   0.00       51   none       5Cffq…
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
                      1           0.0…   0.0…   0.0…   0.0…   0.0…   0.0…     ρ0   0.0…


                                                Wallet balance: τ10.0

                                                        Wallet

                               miner : 5DA7UsaYbk1UnhhtTxqpwdqjuxhQ2rW7D6GTN1S1S5tC2NRV
                                                   Network: custom
Subnet: 2: awesome-first-subnet β

  COLDKEY   HOTKEY    UID   AC…   STA…   RANK   TRU…   CON…   INC…   DIV…   EMI…   VTR…   …   U…   AXON       HOTKE…
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  miner     default   2     Tr…   0.00   0.00   0.00   0.00   0.00   0.00   0.0…   0.00       22   none       5Capz…
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
                      1           0.0…   0.0…   0.0…   0.0…   0.0…   0.0…     ρ0   0.0…


                                                Wallet balance: τ10.0
```

```shell
python3 neurons/miner.py netuid=2 -chain_endpoint=ws://127.0.0.1:9945 wallet_name=miner wallet_hotkey=default
```
