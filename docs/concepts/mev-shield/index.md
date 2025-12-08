---
title: "MEV Shield: Encrypted Mempool Protection"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MEV Shield: Encrypted Mempool Protection

MEV Shield is Bittensor’s opt-in transaction encryption system that protects you from MEV attacks by keeping your transaction details hidden until they are on-chain. It encrypts any Bittensor transaction until after block inclusion, preventing block validators from front-running, sandwiching, or reordering your transaction.

## Overview

When you submit a transaction, it first enters the [_mempool_](../../resources/glossary.md#mempool), where it becomes visible to all network participants. Block validators monitor the mempool to select which transactions to include in the next block they produce.

This transparency creates a critical vulnerability: block validators can see exactly what transactions are waiting to be executed—including their details, amounts, and intended actions—before deciding how to order them in a block. This enables block validators to extract value by strategically ordering, inserting, or excluding transactions based on advanced knowledge of users' intent.

This is the _Maximal Extractable Value_ (_MEV_) problem.

### How MEV Attacks Work

MEV attacks involve a block validator exploiting early visibility into the mempool to profit by changing how transactions are ordered, inserted, or included in a block. By seeing a user's intent before it executes, the attacker can manipulate the block layout to gain an advantage—often at the user's expense.

Common attacks include:

- **Front-running**: Block validator sees your profitable transaction and executes their own first to capture the profit
- **Sandwich attacks**: Block validator places transactions before and after yours to exploit price movements
- **Transaction reordering**: Manipulating the order of transactions to maximize profit
- **Selective censorship**: Excluding specific transactions to benefit from their absence

## How MEV Shield Works

MEV shield transforms how transactions flow through the network by introducing a _commit-reveal_ scheme with encryption. When you submit a transaction with MEV protection, you first encrypt it with the block validator's public key before submitting it. The encrypted wrapper is then submitted to the chain via the `submit_encrypted()` extrinsic. The encrypted wrapper enters the mempool, but the block validators cannot see or decrypt it yet.

:::info
The block validator producing block `N` can see that an encrypted transaction exists, knows its approximate size, and knows who submitted it, but has absolutely no information about what the transaction actually does. They must include it in the block blindly.
:::

Once block `N` is finalized, the protection scheme moves to its reveal phase. At this point, the block containing your encrypted transaction is immutable; thus, no block validator can change its ordering. In block `N+1`, the block validator’s node automatically decrypts a batch of encrypted wrappers using its secret key. This process happens entirely off-chain on the block validator’s node before any on-chain call is made. The block validator then extracts your original transaction details from the decrypted plaintext.

Only after successful decryption does the block validator construct and submit the `execute_revealed()` extrinsic, passing in the already-decrypted data. The runtime validates all the proofs and executes your transaction on your behalf. Because the block production for block `N` has already completed when decryption happens, there's no opportunity for front-running, sandwiching, or reordering.

## How to use MEV shield

To use MEV Shield, you submit your transaction through the `mevShield::submit_encrypted()` extrinsic. The Bittensor SDK and BTCLI allow you enable MEV protection directly when constructing or sending your transactions as shown:

<Tabs groupId="mev-shield">

  <TabItem value="btcli" label="BTCLI">

BTCLI automatically applies MEV Shield to commands that are more prone to MEV attacks, such as staking and subnet creation, while other commands run without it. For these sensitive operations, protection is enabled by default, but you can turn it off by adding the `--no-mev-protection` flag as shown:

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
