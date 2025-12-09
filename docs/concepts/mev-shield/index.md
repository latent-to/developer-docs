---
title: "MEV Shield: Encrypted Mempool Protection"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MEV Shield: Encrypted Mempool Protection

MEV Shield is Bittensor’s opt-in transaction encryption system that protects you from MEV attacks by keeping your transaction details hidden until they are on-chain. It encrypts any Bittensor transaction until after block inclusion, preventing untrusted observers and third-party bots from front-running or sandwiching your transaction.

## Overview

When you submit a transaction, it first enters the [_mempool_](../../resources/glossary.md#mempool), where it becomes visible to all network participants. This transparency creates a critical vulnerability: attackers can see exactly what transactions are waiting to be executed—including their details, amounts, and intended actions. This enables them to extract value by reacting to visible transactions using knowledge of users’ intent and submitting competing transactions that profit from the original action.

This is the _Maximal Extractable Value_ (_MEV_) problem.

### How MEV Attacks Work

MEV attacks involve an untrusted observer exploiting early visibility into the mempool to profit from users’ pending actions. By seeing a user’s intent before it executes, the attacker can submit competing transactions that take advantage of the pending action—often at the user’s expense.

Common attacks include:

- **Front-running**: An attacker detects your pending profitable transaction and submits a competing transaction to execute first and capture the profit.
- **Sandwich attacks**: An attacker submits one transaction just before yours and another right after it to exploit the price movement your transaction creates.

## How MEV Shield Works

MEV shield transforms how transactions flow through the Bittensor network by encrypting transactions before submission so their details remain hidden until execution. When you submit a transaction with MEV protection, you first encrypt it with the block validator's public key before submitting it. The encrypted wrapper is then submitted to the chain via the `submit_encrypted()` extrinsic. The encrypted wrapper enters the network, but external observers cannot see its contents until it has been decrypted.

:::info
The block validator producing block `N` can also see that an encrypted transaction exists, knows its approximate size, and knows who submitted it, but has no information about what the transaction actually does.
:::

Once block `N` is finalized, the encrypted transaction becomes immutable on-chain. While the block validator includes it in the block, its contents remain hidden from external observers who might attempt to exploit it. In block `N+1`, the block validator’s node automatically decrypts a batch of encrypted wrappers using its secret key. This process happens entirely off-chain on the block validator’s node before any on-chain call is made. The block validator then extracts your original transaction details from the decrypted plaintext.

Only after successful decryption does the block validator node call the inner extrinsic to submit the transaction. The runtime validates all the proofs and executes your transaction on your behalf. Because the block production for block `N` has already completed when decryption happens, there's no opportunity for front-running or sandwiching.

## How to use MEV shield

To use MEV Shield, you submit your transaction through the `mevShield::submit_encrypted()` extrinsic.

:::warning MEV shield with hotkey-signed extrinsics
MEV shield should not be used for transactions that are signed by a hotkey. Attempting to use MEV shield with extrinsics signed by a hotkey will fail.
:::

The Bittensor SDK and BTCLI allow you enable MEV protection directly when constructing or sending your transactions as shown:

<Tabs groupId="mev-shield">

  <TabItem value="btcli" label="BTCLI">

BTCLI automatically applies MEV Shield to commands that are more prone to MEV attacks, such as staking, subnet creation, and proxy execution, while all other commands run without it. For these sensitive operations, MEV protection is enabled by default, but you can turn it off by adding the `--no-mev-protection` flag as shown:

```bash
# Remove stake without MEV protection
btcli stake remove \
  --wallet.name my_wallet \
  --wallet.hotkey my_hotkey \
  --amount 5.0 \
  --no-mev-protection

# Add stake with MEV protection (default)
btcli stake add \
  --wallet.name my_wallet \
  --wallet.hotkey my_hotkey \
  --amount 10.0 \
  --mev-protection
```

  </TabItem>

  <TabItem value="sdk" label="Bittensor SDK">
  When using the SDK, MEV Shield can be applied to any Bittensor extrinsic function using the `mev_protection` parameter. To do this:

```python
from bittensor import Subtensor, Wallet
from bittensor.utils.balance import Balance

# Initialize subtensor and wallet
subtensor = Subtensor()
wallet = Wallet()

# Add stake with MEV protection enabled
response = subtensor.add_stake(
  wallet=wallet,
  netuid=1,
  hotkey_ss58='5C86aJ2uQawR6P6veaJQXNK9HaWh6NMbUhTiLs65kq4ZW3NH',
  amount=Balance.from_tao(1),
  mev_protection=True,  # Enable MEV Shield protection
  wait_for_inclusion=True,
  wait_for_finalization=True
)

print(response)
```

  </TabItem>

</Tabs>
