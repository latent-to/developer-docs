---
title: "MEV Shield: Encrypted Mempool Protection"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MEV Shield: Encrypted Mempool Protection

## Overview

The _mempool_ is a temporary holding area in blockchain networks where pending and unconfirmed transactions sit before being included in a block. When you submit a transaction, it first enters the mempool, where it becomes visible to all network participants.

Block validators monitor the mempool to select which transactions to include in the next block they produce. While this transparency is fundamental to how blockchains operate, it creates a critical vulnerability: validators can see exactly what transactions are waiting to be executed—including their details, amounts, and intended actions—before deciding how to order them in a block.

This visibility enables block validators to extract value by strategically ordering, inserting, or excluding transactions based on advanced knowledge of users' intent. This is the _Maximal Extractable Value_ (_MEV_) problem, and it affects users across the blockchain ecosystem.

### How MEV Attacks Work

MEV attacks involve a block validator exploiting early visibility into the mempool to profit by changing how transactions are ordered, inserted, or included in a block. By seeing a user's intent before it executes, the attacker can manipulate the block layout to gain an advantage—often at the user's expense.

Common attacks include:

- **Front-running**: Validator sees your profitable transaction and executes their own first to capture the profit
- **Sandwich attacks**: Validator places transactions before and after yours to exploit price movements
- **Transaction reordering**: Manipulating the order of transactions to maximize validator profit
- **Selective censorship**: Excluding specific transactions to benefit from their absence

## What is MEV Shield?

_MEV Shield_ is Bittensor’s opt-in encrypted mempool system that protects you from MEV attacks by keeping your transaction details hidden until they’re already on-chain. It lets you wrap any Bittensor transaction in an encryption that stays locked until after inclusion in a block, preventing validators from front-running, sandwiching, or reordering your transaction.

MEV attacks can result in worse trade prices, failed transactions from slippage, and other unpredictable outcomes. MEV Shield prevents this by keeping your transactions hidden until they are finalized on-chain.

---

## How MEV Shield Works

MEV shield transforms how transactions flow through the network by introducing a _commit-reveal_ scheme with encryption. When you submit a transaction with MEV protection, you first encrypt it with the block validator's public key before submitting it. The encrypted wrapper is then submitted to the chain via the `submit_encrypted()` extrinsic. The encrypted wrapper enters the mempool, but the validators cannot see or decrypt it yet.

:::info
The validator producing block `N` can see that an encrypted transaction exists, knows its approximate size, and knows who submitted it, but has absolutely no information about what the transaction actually does. They must include it in the block blindly.
:::

Once block `N` is finalized and propagated across the network, the protection scheme moves to its reveal phase. At this point, the block containing your encrypted transaction is immutable and distributed; thus, no validator can change its ordering. In block `N+1`, the validator’s node automatically decrypts a batch of encrypted wrappers using its secret key. This process happens entirely off-chain on the validator’s node before any on-chain call is made. The validator then extracts your original transaction details from the decrypted plaintext.

Only after successful decryption does the validator construct and submit the `execute_revealed()` extrinsic, passing in the already-decrypted data. The runtime validates all the proofs and executes your transaction on your behalf. Because the block production for block `N` has already completed when decryption happens, there's no opportunity for front-running, sandwiching, or reordering. The MEV attack vulnerability is eliminated because validators are forced to commit to a block ordering while blind to transaction contents.

## When to use MEV Shield

MEV Shield is especially useful when making transaction’s whose value, timing, or visibility can be exploited. In both the Bittensor SDK and BTCLI, staking and unstaking operations already use MEV protection by default.

You should consider enabling MEV Shield in the following situations:

- **High-Value Transfers**: Large TAO movements can attract front-running or targeted manipulation. Encrypting these transactions prevents validators from acting on that visibility.

- **Staking Operations**: Actions like adding, removing, and moving stake benefit from privacy. Because these are sensitive and competitive, the Bittensor SDK and BTCLI automatically enable MEV shield on these operations.

- **Trading operations**: Trades that move prices or create arbitrage opportunities are common MEV targets. Encrypting swaps, token purchases, or liquidity changes keeps those details hidden until execution.

- **Time-Sensitive Operations**: Arbitrage attempts, liquidation protection, and auction bids rely on precise timing. MEV Shield helps prevent validators from jumping ahead or reshaping the block.

- **Competitive Actions**: When multiple actors compete—such as subnet registrations with limited slots—early visibility can give others an edge. Encrypting these calls removes that advantage.

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
