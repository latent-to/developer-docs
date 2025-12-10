---
title: "MEV Shield: Encrypted Mempool Protection"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MEV Shield: Encrypted Mempool Protection

MEV Shield is a Bittensor security feature that protects transactions from maximal extractable value (MEV) attacks by keeping details hidden until they are on-chain. It (optionally) encrypts any Bittensor transaction until after block inclusion, preventing other users from profiting from any foreknowldge of your transaction details.

See also: [MEV Shield Bittensor Python SDK Guide](/sdk/mev-protection).


## How MEV Shield Works

When you submit a transaction, it first enters the [_mempool_](../../resources/glossary.md#mempool), where it becomes visible to all network participants. This transparency allows for a variety of exploits where one user can profit from other user's predictable actions in a way that is considered parasitic or unfair.

This is the _Maximal Extractable Value_ (_MEV_) problem.

With MEV shield, transaction data is encrypted with a public key provided by the blockchain validator. The blockchain validator decrypts it right before finalizing the transaction, so the transaction details are inaccessible to would-be-MEV-attackers.

## Basic Usage

Both of Bittensor's official clients, the command line interface `BTCLI` and the Python SDK, enable MEV shield by default for sensitive operations. Under the hood, MEV-Shielded transactions are submitted by these clients (or directly by users) to the blockchain through the `mevShield::submit_encrypted()` extrinsic. 

:::warning MEV shield with hotkey-signed extrinsics
MEV shield should not be used for transactions that are signed by a hotkey. Attempting to use MEV shield with extrinsics signed by a hotkey will fail.

Note that while it is technically possible to transfer TAO to a hotkey, which would, technically, allow you to use MEV protection for HK operations, this is neither intended nor advisable.

**Because hotkeys are not intended to hold TAO, you are in *untested waters* if you do so, and there may be unintended consequences that could result in asset loss.**
:::


<Tabs groupId="mev-shield">

  <TabItem value="btcli" label="BTCLI">

BTCLI automatically applies MEV Shield to commands that are more prone to MEV attacks, such as staking, subnet creation, and proxy execution, while all other commands run without it.

For these sensitive operations, MEV protection is enabled by default, but you can turn it off by adding the `--no-mev-protection` flag as shown:

```bash
# Add stake with MEV protection (default)
btcli stake add \
  --wallet.name my_wallet \
  --wallet.hotkey my_hotkey \
  --amount 10.0 \
  --mev-protection # redundant, since this is the default behavior!

# Remove stake without MEV protection
btcli stake remove \
  --wallet.name my_wallet \
  --wallet.hotkey my_hotkey \
  --amount 5.0 \
  --no-mev-protection # Danger, you are giving your TAO to bots!

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
