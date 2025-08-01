---
title: "Understanding Slippage: Sandwich Attacks"
---
## Understanding Sandwich Attacks

**Maximal Extractable Value (MEV)** represents profits that can be extracted by reordering, including, or excluding transactions within blocks. In AMM systems like Bittensor's subnets, the most common MEV attack is the **sandwich attack**, where bots exploit the predictable slippage from large transactions.

### Understanding Sandwich Attacks

Sandwich attacks exploit the fact that pending transactions are visible in the **mempool** before execution, allowing attackers to predict and profit from price movements.

#### How Sandwich Attacks Work

1. **Mempool Monitoring**: MEV bots continuously scan the mempool for large pending transactions
2. **Front-Running**: Bots manipulate transaction priorities set orchestrate transactions in the correct order
3. **Profit Extraction**: The victim's transaction causes slippage that the bot captures

#### Sandwich Attack Example

Let's examine a concrete example using Bittensor's AMM mechanics:

**Initial State:**
- Subnet X has 1000 alpha in reserve, 100 TAO in reserve
- Current price: 0.1 TAO per alpha
- Alice wants to stake 50 TAO (a large transaction)

**Step 1: MEV Bot Observes Alice's Transaction**
```
Mempool: [Alice: "stake 50 TAO in subnet X"]
MEV Bot calculates: "Alice will cause significant slippage, I can profit"
```

**Step 2: MEV Bot Front-Runs Alice**
```
MEV Bot submits: "stake 10 TAO in subnet X" with HIGHER PRIORITY

Execution order will be:
1. MEV Bot stakes 10 TAO (higher priority)
2. Alice stakes 50 TAO (original priority)  
3. MEV Bot unstakes equivalent alpha (on subsequent block)
```

**Step 3: Block Execution Sequence**

```
Before any transactions:
- Pool: 1000 alpha, 100 TAO
- Price: 0.1 TAO per alpha

Transaction 1 - MEV Bot stakes 10 TAO:
- Alpha received = 1000 - (1000 × 100)/(100 + 10) = 90.91 alpha
- Pool state: 909.09 alpha, 110 TAO
- New price: 0.121 TAO per alpha

Transaction 2 - Alice stakes 50 TAO:
- Alpha received = 909.09 - (909.09 × 110)/(110 + 50) = 282.11 alpha  
- Pool state: 627.98 alpha, 160 TAO
- New price: 0.255 TAO per alpha

Transaction 3 - MEV Bot unstakes 90.91 alpha:
- TAO received = 160 - (627.98 × 160)/(627.98 + 90.91) = 137.67 TAO
- MEV Bot profit: 137.67 - 10 = 127.67 TAO (!!)
```

**The Victim:**
- Alice expected ~500 alpha at 0.1 TAO per alpha
- Alice actually received 282.11 alpha (43.6% slippage!)
- Alice paid for the MEV bot's profit through worse execution

**The MEV Bot's Profit Strategy:**
- Bot bought 90.91 alpha for 10 TAO when price was 0.1 TAO per alpha  
- Alice's large transaction pushed the price up to 0.255 TAO per alpha
- Bot can now sell their 90.91 alpha at this inflated price for 137.67 TAO
- **This price spike caused by Alice is the entire source of profit**
- Without Alice's transaction, there would be no profitable price movement to exploit

#### Priority-Based Transaction Ordering

Bittensor uses priority-based ordering that enables these attacks:

**Transaction Priority Calculation:**
```rust
// From subtensor/pallets/subtensor/src/lib.rs:1796-1813
pub fn get_priority_staking(
    coldkey: &T::AccountId,
    hotkey: &T::AccountId,
    stake_amount: u64,
) -> u64 {
    let default_priority = current_block_number.saturating_sub(last_stake_block);
    
    // Higher stake amounts get higher priority
    default_priority
        .saturating_add(u32::MAX as u64)
        .saturating_add(stake_amount)
}
```

**Source**: [subtensor/pallets/subtensor/src/lib.rs:1796-1813](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1796-L1813)

MEV bots can submit transactions with higher stake amounts to gain execution priority, ensuring their front-running transactions execute first.

**Transaction Pool Implementation:**

**Source**: [subtensor/runtime/src/lib.rs:1857-1872](https://github.com/opentensor/subtensor/blob/main/runtime/src/lib.rs#L1857-L1872)

The runtime implements the `TaggedTransactionQueue` API where transactions are validated and added to the transaction pool where they compete based on priority before block inclusion.

**Transaction Validation and Prioritization:**

**Source**: [subtensor/pallets/subtensor/src/lib.rs:2115-2137](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L2115-L2137)

When `add_stake` transactions are submitted, they get prioritized based on the stake amount, allowing MEV bots to front-run by submitting higher-stake transactions.

**Transaction Pool Competition:**

**Source**: [subtensor/pallets/drand/src/lib.rs:614-618](https://github.com/opentensor/subtensor/blob/main/pallets/drand/src/lib.rs#L614-L618)

The code comments in the DRAND pallet explicitly state: "We can still have multiple transactions compete for the same 'spot', and the one with higher priority will replace other one in the pool."

### Configuring MEV Protection

#### Recommended Slippage Tolerances

**Conservative (Recommended for most users):**
```bash
btcli stake add --amount 100 --safe --tolerance 0.005  # 0.5%
```

**Moderate (For users comfortable with some slippage):**
```bash
btcli stake add --amount 100 --safe --tolerance 0.02   # 2%
```

**Aggressive (Only for time-sensitive operations):**
```bash
btcli stake add --amount 100 --safe --tolerance 0.05   # 5%
```

#### Large Transaction Strategy

For large transactions that might attract MEV attention:

**1. Split into smaller amounts:**
```python
# Instead of one large transaction
large_amount = bt.Balance.from_tao(1000)

# Split into smaller chunks
chunk_size = bt.Balance.from_tao(50)
chunks = large_amount // chunk_size

for i in range(chunks):
    success = subtensor.add_stake(
        wallet=wallet,
        amount=chunk_size,
        safe_staking=True,
        rate_tolerance=0.01,  # 1% tolerance
        allow_partial_stake=False
    )
    
    if not success:
        print(f"Chunk {i+1} rejected due to slippage")
        break
    
    time.sleep(15)  # Wait for next block to reset rate limits
```

**2. Use partial execution for very large amounts:**
```python
# Allow partial execution within tight tolerances
success = subtensor.add_stake(
    wallet=wallet,
    amount=bt.Balance.from_tao(1000),
    safe_staking=True,
    rate_tolerance=0.01,         # 1% max slippage
    allow_partial_stake=True     # Execute what fits within tolerance
)
```

#### Pre-Transaction Analysis

Always check potential slippage before large transactions:

```python
import bittensor as bt

subtensor = bt.Subtensor()
subnet_info = subtensor.subnet(netuid=14)

# Check slippage for your intended transaction
tao_amount = 100.0
alpha_received, slippage_amount = subnet_info.tao_to_alpha_with_slippage(tao_amount)
slippage_percentage = subnet_info.tao_to_alpha_with_slippage(tao_amount, percentage=True)

print(f"Staking {tao_amount} TAO:")
print(f"  - Alpha received: {alpha_received}")
print(f"  - Slippage: {slippage_percentage:.2%}")

if slippage_percentage > 0.02:  # 2% threshold
    print("⚠️  WARNING: High slippage detected!")
    print("   Consider:")
    print("   - Splitting into smaller transactions")
    print("   - Using partial execution")
    print("   - Waiting for better liquidity conditions")
else:
    print("✅ Slippage within acceptable range")
```

### MEV Protection Best Practices

1. **Always Use Safe Staking**: Enable `safe_staking=True` for protection
2. **Set Conservative Tolerances**: Start with 0.5-2% for most operations
3. **Monitor Pool Liquidity**: Check `subnet_info.tao_in` and `subnet_info.alpha_in` before large transactions
4. **Split Large Transactions**: Break amounts >100 TAO into smaller chunks
5. **Use Partial Execution**: Enable for very large amounts to ensure some execution
6. **Time Transactions Wisely**: Avoid periods of high MEV bot activity
7. **Pre-Calculate Slippage**: Always check expected slippage before executing

### Error Handling for MEV Protection

```python
try:
    success = subtensor.add_stake(
        wallet=wallet,
        amount=bt.Balance.from_tao(100),
        safe_staking=True,
        rate_tolerance=0.01
    )
    
    if success:
        print("✅ Transaction successful with MEV protection")
    else:
        print("❌ Transaction failed - likely due to slippage protection")
        
except Exception as e:
    if "SlippageTooHigh" in str(e):
        print("🛡️  Slippage protection activated - transaction rejected")
        print("   Try: Lower amount, higher tolerance, or partial execution")
    elif "StakingOperationRateLimitExceeded" in str(e):
        print("⏱️  Rate limit active - wait for next block")
    else:
        print(f"❌ Other error: {e}")
```

### Summary

Bittensor's multi-layered MEV protection combines:

1. **Rate Limiting**: Prevents rapid successive operations that enable sandwich attacks
2. **Slippage Protection**: Allows users to set maximum acceptable slippage thresholds  
3. **Partial Execution**: Enables execution of portion that fits within tolerance
4. **Price Limits**: Blockchain-level enforcement of maximum acceptable prices

By configuring conservative slippage tolerances and using Bittensor's built-in protections, users can effectively defend against MEV attacks while still participating in the network's AMM system.