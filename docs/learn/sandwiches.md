---
title: "Understanding Slippage: Sandwich Attacks"
---

# Understanding Sandwich Attacks

## What Are Sandwich Attacks?

**Maximal Extractable Value (MEV)** represents profits that can be extracted by reordering, including, or excluding transactions within blocks. In AMM systems like Bittensor's subnets, the most common MEV attack is the **sandwich attack**, where bots exploit the predictable slippage from large transactions.

### How Sandwich Attacks Work

1. **Mempool Monitoring**: MEV bots continuously scan the mempool for large pending transactions
2. **Front-Running**: Bots submit higher-priority transactions that execute before the victim's transaction
3. **Rate Limiting Protection**: Bittensor's rate limiting prevents staking and unstaking in the same block, forcing bots to wait for subsequent blocks
4. **Delayed Profit Extraction**: The victim's transaction causes slippage that the bot captures in later blocks

## Quick Protection Guide

**The simplest way to protect against sandwich attacks:**

1. **Pre-calculate your slippage** using Bittensor's SDK
2. **Set your tolerance slightly only slightly higher** than the expected slippage
3. **Disable partial staking** - if you get sandwiched, the transaction will be rejected

```python
import bittensor as bt

# 1. Calculate expected slippage
subtensor = bt.Subtensor()
subnet_info = subtensor.subnet(netuid=14)
expected_slippage = subnet_info.tao_to_alpha_with_slippage(100.0, percentage=True)

# 2. Set tolerance slightly higher (e.g., +0.1%)
tolerance = expected_slippage + 0.001

# 3. Stake with tight tolerance and no partial execution
success = subtensor.add_stake(
    wallet=wallet,
    amount=bt.Balance.from_tao(100),
    safe_staking=True,
    rate_tolerance=tolerance,
    allow_partial_stake=False  # ← Key: reject if sandwiched
)
```
**Result**: If a MEV bot tries to sandwich your transaction, the slippage will exceed your tolerance and the transaction will be rejected, protecting you from the attack.

## Example

Using simplified numbers for clarity:

**Initial State:**
- Subnet has 1,000 alpha in reserve, 100 TAO in reserve
- Current price: 0.1 TAO per alpha
- Alice wants to stake 50 TAO

**Sandwich Attack Sequence:**
```
Block N - MEV Bot stakes 10 TAO:
- Alpha received: ~90 alpha
- New price: ~0.12 TAO per alpha

Block N - Alice stakes 50 TAO:
- Alpha received: ~280 alpha (~44% slippage!)
- New price: ~0.25 TAO per alpha

Block N+1 - MEV Bot unstakes ~90 alpha:
- TAO received: ~23 TAO
- MEV Bot profit: ~13 TAO (~130% return!)
```

**The Protection**: If Alice had set her tolerance to a more reasonable 5% or less (below the ~44% actual slippage), her transaction would have been rejected, preventing the sandwich attack.
