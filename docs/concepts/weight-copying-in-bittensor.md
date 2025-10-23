---
title: "The Weight Copying Problem"
---
# The Weight Copying Problem

This page explains **weight copying**—a free-riding behavior where validators copy other validators' work instead of independently evaluating miners. This article covers how weight copying works, why it's problematic, how Bittensor's [commit-reveal](./commit-reveal.md) mechanism prevents it, and best practices for subnet owners.

## What is weight copying?

In Bittensor subnets, validators are supposed to independently evaluate miners and set weights based on their performance. These weights determine miner emissions through [Yuma Consensus](../learn/yuma-consensus.md). 

**Weight copying** occurs when a validator reads the publicly available weight matrix and copies (or derives from) other validators' weights instead of doing their own evaluation work. This allows them to:
- Avoid the computational cost of evaluation
- Avoid the development cost of building good evaluation systems
- Still earn validator dividends by appearing to participate in consensus

While this might seem like a minor optimization, it undermines the entire incentive mechanism and can lead to cascading failures in subnet quality.

## The problem with weight copying

### Degraded subnet quality

Validators are the quality control mechanism for subnets. When validators copy weights instead of independently evaluating miners:
- Bad miners can persist longer than they should
- Good innovations from new miners take longer to be recognized
- The subnet's ability to produce quality output degrades over time

### Unfair validator rewards

Weight copiers earn dividends without doing the work. This creates several problems:
- Honest validators who invest in good evaluation systems earn less per TAO staked
- Delegators may unknowingly stake to weight copiers instead of honest validators
- The economic incentive to build better validation systems is weakened

### Centralization pressure

If weight copying is more profitable than honest validation, rational actors will copy weights. This can lead to:
- Most validators becoming weight copiers
- Only 1-2 validators doing real evaluation work
- Effective centralization of subnet governance

### Consensus manipulation

Sophisticated weight copiers can actually shift consensus in harmful ways (explained below), potentially taking bribes from miners or extracting value through strategic weight setting.

## Optimized weight copying

Weight copiers don't just blindly copy one validator—they use an **optimized strategy** that actually gives them *higher* returns than any single honest validator:

### The stake-weighted averaging attack

1. **Read the current weight matrix**: Weight copiers wait for weights to be publicly revealed
2. **Calculate stake-weighted consensus**: They compute what Yuma Consensus will calculate as the "center" of opinion
   ```
   For each miner i:
     consensus_weight[i] = Σ(validator_weight[i] × validator_stake) / Σ(validator_stake)
   ```
3. **Submit the consensus weights**: By submitting weights that match the predicted consensus, they maximize their vtrust (validator trust score)
4. **Earn maximum dividends**: Higher vtrust → higher dividends per TAO staked → higher APY

### Why this works

In Yuma Consensus, validators are rewarded based on how well their weights align with the emerging consensus. By calculating the stake-weighted average, weight copiers can predict consensus better than any individual honest validator who might have some disagreement with others.

**Result**: Weight copiers achieve higher validator dividends per stake than honest validators, making weight copying more profitable than honest work.

### Example scenario

Imagine two honest validators:
- **Validator A**: 1M TAO staked, weights miner 1 as `1.0` (excellent)
- **Validator B**: 2M TAO staked, weights miner 1 as `0.5` (mediocre)

**Honest validators** submit their true evaluations and will have some divergence from final consensus.

**Weight copier** calculates:
```
consensus = (1.0 × 1M + 0.5 × 2M) / (1M + 2M) = 0.67
```

The weight copier submits `0.67` for miner 1, perfectly matching where consensus will land, and earns higher vtrust than either honest validator.

## Advanced weight copying: Consensus manipulation

With enough stake, weight copiers can do even worse:

### Shifting consensus for profit

A weight copier with significant stake can:
1. Calculate where consensus *would* be without them
2. Shift their weights to move consensus in a desired direction
3. Accept bribes from miners to shift consensus their way

**Example**: A miner might pay a weight copier to give them higher weights, knowing that the copier's stake will shift overall consensus upward, resulting in higher miner emissions.

### Why this is hard to detect

- The weight copier is still "participating" in consensus
- Their weights might look reasonable on the surface
- Only sophisticated analysis can detect the manipulation pattern

## How commit-reveal prevents weight copying

The [commit-reveal mechanism](./commit-reveal.md) solves weight copying by introducing a time delay between when weights are set and when they're publicly visible:

### The concealment period

1. Validators set weights normally
2. Weights are encrypted using time-lock encryption
3. Weights remain hidden for a configured number of tempos (the `commit_reveal_period`)
4. Weights are automatically revealed after the concealment period
5. Revealed weights are used in Yuma Consensus calculations

### Why weight copiers can't win

When weights are concealed for one or more tempos:
- Weight copiers only have access to **stale weights** from previous tempos
- If miner performance has changed since those old weights were set, the old weights are inaccurate
- Copying stale weights causes validators to **diverge from consensus** rather than align with it
- Lower alignment → lower vtrust → lower dividends
- **Weight copying becomes unprofitable**

### The requirement: Dynamic scoring

Commit-reveal only works if **miner performance actually changes** over the timescale of the concealment period. If:
- Miner rankings are static
- Performance is completely predictable
- No new miners register or old miners improve

Then even stale weights will be accurate, and weight copying can still work.

**Solution**: Subnet owners should design subnets that demand continuous miner improvement, ensuring that weights from yesterday are less accurate than fresh evaluations today.

## Historical context: The CRv3 bug

Understanding how weight copying evolved helps explain why the current system works the way it does.

### Commit-reveal v3 (CRv3): The same-tempo vulnerability

In the third version of commit-reveal:
- Validators committed weights (encrypted)
- Validators revealed weights (decrypted) **in the same tempo**
- Both operations happened before the epoch calculation

### The exploit

Weight copiers discovered they could:
1. Wait for honest validators to reveal their weights (still in the same tempo)
2. Quickly calculate the stake-weighted consensus
3. Submit their own weights before the epoch calculation at the end of the tempo
4. Still achieve higher vtrust than honest validators

Despite weights being "concealed," the same-tempo reveal gave weight copiers enough time to copy and submit.

### The fix: Commit-reveal v4 (CRv4)

CRv4 fixed this by:
- Using [Drand time-lock encryption](https://drand.love/docs/timelock-encryption/) for automatic reveals
- Ensuring reveals happen at the *start* of the next tempo
- Making the reveal timing cryptographically guaranteed (no manual validator action)
- Eliminating the window for weight copiers to act

See [Commit-Reveal documentation](./commit-reveal.md) for full technical details.

## The decline of weight copying

Since the deployment of CRv4 and increased subnet owner awareness, weight copying has become significantly less profitable:

### Statistics (as of late 2024)

<!-- TODO Do we have something to show for this? -->

Weight copying validator collective:
- **Alpha stake**: Decreased from ~8M TAO to ~4.5M TAO
- **Subnet coverage**: Decreased from 50+ subnets to ~35 subnets
- **Validator count**: Major weight copying operations show declining participation

This decline demonstrates that commit-reveal, when properly configured, effectively neutralizes the weight copying advantage.

### Why some weight copiers persist

Despite the declining profitability:
1. **Some subnets don't enable commit-reveal** (it's optional, not mandatory)
2. **Some subnets have static scoring** (weights don't change much over time)
3. **Short-term profit extraction** is still possible before delegators move stake
4. **Information asymmetry** means some delegators don't yet understand the problem

## Best practices for subnet owners

### 1. Enable commit-reveal (strongly recommended)

Set these hyperparameters:
```
commit_reveal_weights_enabled: true
commit_reveal_period: 1  # Start with 1 tempo
```

**Why**: While technically optional, commit-reveal should be considered essential for any subnet that wants to avoid weight copying.

See [Commit-Reveal configuration guide](./commit-reveal.md#configuring-commit-reveal).

### 2. Ensure dynamic miner evaluation

Design your subnet so that:
- Miner performance changes frequently (at least every few tempos)
- New miners can demonstrate improvements
- Task difficulty or evaluation criteria evolve over time
- Validators must continuously evaluate to maintain accurate weights

**Example**: Text generation subnets that rotate prompts daily, or prediction markets that constantly have new questions.

### 3. Configure appropriate commit-reveal periods

**General guidance**:
- **Fast-changing subnets** (daily performance shifts): 1-2 tempo concealment is sufficient
- **Medium-changing subnets** (weekly performance shifts): 3-5 tempo concealment
- **Slow-changing subnets** (monthly performance shifts): Consider if commit-reveal is right fit, or redesign subnet to be more dynamic

**Rule of thumb**: The concealment period should be shorter than the typical time it takes for miner rankings to significantly change.

### 4. Monitor validator behavior

Watch for signs of weight copying:
- Validators with suspiciously high vtrust relative to their evaluation quality
- Validators whose weights perfectly track consensus with no leading/lagging
- Validators who only submit weights shortly after reveals (if you can observe this)
- Validators registered on many subnets but with minimal evaluation infrastructure

### 5. Educate your validator community

Make sure validators understand:
- Why commit-reveal is enabled
- How to configure their systems properly
- The immunity period requirements (see below)
- That they should continue calling `set_weights()` normally (commit-reveal is transparent)

### 6. Set adequate immunity periods

**Critical requirement**: `immunity_period` (in blocks) must be longer than `commit_reveal_period × tempo`

If immunity period is too short, newly registered miners may be deregistered before their weights are revealed and counted.

**Formula for updating**:
```
new_immunity_period = (new_commit_reveal_period × tempo - old_commit_reveal_period × tempo) + old_immunity_period
```

See [Commit-Reveal and Immunity Period](./commit-reveal.md#commit-reveal-and-immunity-period).

## Why not make commit-reveal mandatory?

There's ongoing debate in the Bittensor community about whether commit-reveal should be mandatory for all subnets.

### Arguments for mandatory commit-reveal

1. **Eliminates weight copying as a viable strategy** across the entire network
2. **Levels the playing field** for honest validators
3. **Improves overall network quality** by ensuring real evaluation work
4. **Simpler for subnet owners** (one less decision to make)
5. **Aligns with long-term network health** over short-term flexibility

### Arguments for optional commit-reveal

1. **Subnet autonomy**: Owners should control their own subnet mechanics
2. **Experimentation**: Some subnets might find novel uses for immediate weight visibility
3. **Edge cases**: Subnets using Yuma v1 or other specialized configurations might not need it
4. **Transition period**: Forced upgrades can disrupt existing operations

### Current status

As of now, commit-reveal remains **optional**. However, the recommendation is to enable it unless you have a specific, well-understood reason not to.

## Detection and analysis

### For delegators: Identifying weight copiers

If you're delegating TAO, watch for these red flags:
- Validator registered on many subnets (40+) without corresponding infrastructure
- High validator APY without clear explanation of evaluation methodology
- Validator started earning immediately upon registration (no ramp-up period)
- Declining stake over time as informed delegators move away




## Free-riding vs. value creation

Weight copying is one example of a broader category of challenges in decentralized incentive mechanisms:

Any system that rewards participation must:
- Make it possible to verify that real work was done
- Make copying or faking work more expensive than doing real work
- Ensure that short-term extraction is less profitable than long-term contribution

### Progressive hardening

Bittensor's approach has been:
1. Launch with simple, elegant mechanism
2. Observe what attacks emerge in practice
3. Add targeted defenses (like commit-reveal)
4. Continue evolving as new patterns appear



## Related documentation

- [Commit-Reveal mechanism](./commit-reveal.md) - Full technical details on how commit-reveal works
- [Yuma Consensus](../learn/yuma-consensus.md) - Understanding the consensus algorithm that weight copying tries to game
- [Subnet Hyperparameters](../subnets/subnet-hyperparameters.md) - How to configure commit-reveal and immunity periods
- [Weight Copying technical paper (PDF)](pathname:///papers/BT_Weight_Copier-29May2024.pdf) - Academic analysis
- [Blog: Weight Copying in Bittensor](https://blog.bittensor.com/weight-copying-in-bittensor-422585ab8fa5) - Community-focused explanation
