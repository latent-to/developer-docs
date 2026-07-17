---
title: "Understand Price Protection"
---

import { SdkVersion } from "../sdk/\_sdk-version.mdx";

# Understand Price Protection

Bittensor clients (BTCLI and the SDK) provides three modes to give users control over how their transactions handle adverse price movements: Strict, Partial, and Unsafe.

Other users' transactions can affect the token price, even while your transaction is pending. Subnet token prices may change rapidly, with significant consequences affecting your execution price and increasing slippage. These effects can be exploited by "sandwich attacks" and other [MEV (Maximal Extractable Value)](../resources/glossary.md#mev-maximal-extractable-value) attacks, or can result in loss of liquidity due to organic price volatility.

It is therefore important to carefully manage price protection when staking and unstaking real value liquidity, i.e. on mainnet ("finney"). For additional protection against MEV attacks, consider using [MEV Shield](../sdk/mev-protection.md) to encrypt your transactions.

## Price Protection Modes

### Strict Safe Mode (Default)

In this mode, the transaction is **rejected entirely** if executing it would push the final market price beyond the tolerance threshold from the price when you submitted the transaction. Tolerance threshold can be specified but is 5% by default.

This mode provides maximum protection against price volatility, market movements, and sandwich attacks by preventing transactions that would push the execution price beyond the specified tolerance. This is preferable when you want to guarantee a transaction price, and are willing to accept transaction failure if you cannot get that price.

**Example**: You set a 2% tolerance for unstaking. If executing your transaction would push the final price more than 2% below the price when you submitted the transaction, the entire transaction is rejected.

### Partial Safe Mode

In this mode, the transaction executes **the maximum amount that can be executed while keeping the execution price within the defined tolerance** of the original submission price. If the full amount would cause the market price to exceed the tolerance range, only a portion would be executed.

This mode ensures a partial transaction execution even if market conditions would make the full transaction exceed price tolerance limits.

This is preferable if you want a guarantee of some transaction, and are willing to accept variation in price, which can result in loss of liquidity of up to the tolerance threshold.

**Example**: You try to unstake 1000 alpha with 2% tolerance. If executing the full amount would push the final market price beyond 2% of the original price, the system calculates and executes only the maximum amount (e.g., 400 alpha) that stays within the 2% limit.

### Unsafe Mode

This mode **ignores price protection entirely**. The transaction executes regardless of price movements, offering the fastest execution but no protection against adverse price changes or sandwich attacks.

This mode is generally convenient for development and testing, but inadvisable with real-value liquidity on mainnet ("finney").

### Example Comparison by Mode

Consider attempting to unstake 1000 alpha when executing the full transaction would push the market price 5% below the original price, with tolerance set to 2%:

| Mode         | Outcome                                                                         |
| ------------ | ------------------------------------------------------------------------------- |
| Strict Safe  | Transaction rejected entirely (5% price movement > 2% tolerance)                |
| Partial Safe | Unstakes ~400 alpha (maximum amount that keeps final price within 2% tolerance) |
| Unsafe       | Unstakes full 1000 alpha regardless of 5% price impact                          |

## Managing Price Protection with BTCLI

The `btcli stake` interface provides parameters to control price protection modes.

**Enable/disable price protection (strict or partial):**

True by default. Enables price protection, which is strict by default.

```bash
--safe-staking/--no-safe-staking, --safe/--unsafe
```

**Enable/disable partial execution (ignored in unsafe mode):**

If price protection (`--safe-staking`) is enabled, determines whether protection is strict or partial.

```bash
--allow-partial-stake/--no-allow-partial-stake, --partial/--no-partial
```

**Set price tolerance:**

If in **partial safe** staking mode, determines the threshold of price variation tolerated in the transaction.

```bash
--tolerance, --rate-tolerance FLOAT
```

- **Default**: 0.005 (0.5%)
- **Range**: 0.0 to 1.0 (0% to 100%)
- **Purpose**: Maximum allowed final price deviation from submission price

### BTCLI Examples

**Strict Safe Mode (reject if price moves beyond tolerance):**

```bash
# note that --safe is unnecessary as it is enabled by default
btcli stake add --amount 100 --netuid 1 --safe --tolerance 0.02 --no-partial
```

**Partial Safe Mode (execute what fits within tolerance):**

```bash
# note that --safe is unnecessary as it is enabled by default
btcli stake add --amount 1000 --netuid 1 --safe --tolerance 0.02 --partial
```

**Unsafe Mode (ignore price protection):**

```bash
btcli stake add --amount 300 --netuid 1 --unsafe
```

## Managing Price Protection with the SDK

<SdkVersion />

:::warning SDK default is unsafe
Unlike `btcli`, the SDK does **not** enable price protection by default, it must be explicitly configured.
:::

When using the SDK with proxies (the recommended approach for mainnet), price protection is configured through the pallet-level calls `add_stake_limit` and `remove_stake_limit`. These accept two parameters that control protection behavior:

- **`limit_price`** (int): The worst acceptable price in RAO per one alpha. For staking this is a ceiling (max you'll pay); for unstaking it's a floor (min you'll accept).
- **`allow_partial`** (bool): If `False` (strict mode), the transaction is rejected entirely when the price exceeds the limit. If `True` (partial mode), the maximum amount that stays within the limit is executed.

To calculate `limit_price` from a tolerance percentage:

```python
subnet = await subtensor.subnet(netuid=netuid)

# For staking (price goes up as you buy alpha, so set a ceiling):
limit_price = bt.Balance.from_tao(subnet.price.tao * (1 + rate_tolerance)).rao

# For unstaking (price goes down as you sell alpha, so set a floor):
limit_price = bt.Balance.from_tao(subnet.price.tao * (1 - rate_tolerance)).rao
```

### SDK Examples

See [Managing Your Stakes](../staking-and-delegation/managing-stake-sdk) for complete proxy staking workflows.

#### Strict Mode (reject if price moves beyond tolerance)

```python
import asyncio
import bittensor as bt
from bittensor.core.extrinsics.pallets import SubtensorModule

async def main():
    async with bt.AsyncSubtensor(network="test") as subtensor:
        subnet = await subtensor.subnet(netuid=1)
        limit_price = bt.Balance.from_tao(subnet.price.tao * 1.02).rao  # 2% tolerance

        call = await SubtensorModule(subtensor).add_stake_limit(
            netuid=1,
            hotkey="5F...",
            amount_staked=bt.Balance.from_tao(100).rao,
            limit_price=limit_price,
            allow_partial=False,  # Reject entirely if price exceeds limit
        )
        # Submit via proxy (see Managing Your Stakes for full proxy examples)

asyncio.run(main())
```

#### Partial Mode (execute what fits within tolerance)

```python
call = await SubtensorModule(subtensor).add_stake_limit(
    netuid=1,
    hotkey="5F...",
    amount_staked=bt.Balance.from_tao(1000).rao,
    limit_price=limit_price,
    allow_partial=True,  # Execute maximum amount within price limit
)
```

#### Unsafe Mode (no price protection)

For testnet or development use only. Uses `add_stake` instead of `add_stake_limit`:

```python
call = await SubtensorModule(subtensor).add_stake(
    netuid=1,
    hotkey="5F...",
    amount_staked=bt.Balance.from_tao(100).rao,
)
```

:::tip High-level API (testnet convenience)
The SDK also provides `subtensor.add_stake(safe_staking=True)` and `subtensor.unstake(safe_unstaking=True)` which auto-compute the limit price. However, these methods sign directly from the wallet's coldkey and do not support proxies, so they are only suitable for testnet or development use. On mainnet, use the pallet-level calls shown above with `subtensor.proxy()`.
:::

