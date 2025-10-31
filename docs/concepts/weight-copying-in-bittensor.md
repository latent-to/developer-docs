---
title: "The Weight Copying Problem"
---


import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';


# The Weight Copying Problem

This page explains **weight copying**—a free-riding behavior where validators copy other validators' work instead of independently evaluating miners. This article covers how weight copying works, why it is problematic, and how subnet owners can prevent weight copying on their subnets using Bittensor's [Commit Reveal](./commit-reveal.md) feature.

See also:
- [Opentensor Weight Copying technical paper (PDF)](pathname:///papers/BT_Weight_Copier-29May2024.pdf)
- [Opentesor Blog: Weight Copying in Bittensor](https://blog.bittensor.com/weight-copying-in-bittensor-422585ab8fa5) 

## What is weight copying?

In Bittensor subnets, validators are supposed to independently evaluate miners and set weights based on their performance. These weights determine miner emissions through [Yuma Consensus](../learn/yuma-consensus.md). 

**Weight copying** occurs when a validator reads the publicly available weight matrix and copies (or derives from) other validators' weights instead of doing their own evaluation work. This allows them to:
- Avoid the computational cost of evaluation
- Avoid the development cost of building good evaluation systems
- Still earn validator dividends by appearing to participate in consensus

While this might seem like a minor optimization, it undermines the entire incentive mechanism and can lead to cascading failures in subnet quality.

<center>
<ThemedImage
alt="'Weight copying'"
sources={{
    light: useBaseUrl('/img/docs/weight-copy.svg'),
    dark: useBaseUrl('/img/docs/weight-copy.svg'),
}}
style={{width: '100%', maxWidth: 900}}
/>
</center>

## The problems with weight copying

### Degraded subnet quality

Validators are the quality control mechanism for subnets. When validators copy weights instead of independently evaluating miners:
- Bad miners can persist longer than they should
- Good innovations from new miners take longer to be recognized
- The subnet's ability to produce quality output degrades over time

### Unfair validator rewards

Weight copiers earn dividends without doing the work, in a sense free-riding or parasitising validators that actually do perform validation work. In the worst case scenario, this can lead to most validators becoming weight copiers, with real evaluation work being effectively centralized to a small number of honest validators. This would undermine the benefits of distributed consensus as well as being unfair and inefficient.

If weight copying is more profitable than honest validation, rational actors will copy weights. Another way of thinking about this is that validators must actually pay a cost to validate honestly. Therefore, when weight copying is profitable, the incentive system driving Bittensor is distorted, weakening its ability to fulfill its purpose: producing the best digital commodities in the world.

Therefore, it can be seen as the subnet owners' responsibility to the community, as well as being in their own interests, to ensure that weight copying is not profitable in their subnets. The best way to do this is by enabling and properly configuring [Commit Reveal](./commit-reveal).


Historically, many large weight copiers used an optimized strategy which we can call the stake-weighted averaging attack, that actually gives them *higher* returns than any single honest validator:

1. Weight copiers wait for weights to be publicly revealed.
2. They compute what weights they can submit that Yuma Consensus will judge as maximally in consensus, by giving the stake-weighted median of validators' weight scores for each miner. See [Glossary: Consensus Score](../resources/glossary#consensus-score).
3. By submitting weights that match the predicted consensus, they maximize their vtrust (validator trust score).
4. Higher vtrust → higher dividends per TAO staked → higher APY.

This works because in Yuma Consensus, validators are rewarded based on how well their weights align with the emerging consensus. By calculating the stake-weighted median, weight copiers can predict consensus better than any individual honest validator who might have some disagreement with others. As a result, optimized weight copiers achieve higher validator dividends per stake than honest validators, making weight copying more profitable than honest work.

This is a fundamental incentive problem for Bittensor subnet owners: if validators are needed to do validation work rather than weight copy, the validation work itself must be incentivized more than weight-copying. Fortunately, the Commit Reveal feature exists to make weight copying impossible.

## How Commit Reveal prevents weight copying

Bittensor's [Commit Reveal feature](./commit-reveal.md) solves weight copying by introducing a time delay between when weights are set and when they're publicly visible.

When weights are concealed for one or more tempos, weight copiers only have access to **stale weights** from previous tempos. If miner performance has changed since those old weights were set, the old weights are inaccurate, and copying them will put the copiers far from consensus. This will wreck their vtrust and their emissions, making weight copying unprofitable.

### The Commit Reveal Flow

1. Validators set weights
2. Weights are encrypted using time-lock encryption
3. Weights remain hidden for a configured number of tempos (the `commit_reveal_period`)
4. Weights are automatically revealed after the concealment period
5. Revealed weights are then used in Yuma Consensus calculations


<center>
<ThemedImage
alt="'Commit Reveal v4 Sequence Diagram'"
sources={{
    light: useBaseUrl('/img/docs/commit-reveal-v4.svg'),
    dark: useBaseUrl('/img/docs/commit-reveal-v4.svg'),
}}
style={{width: '100%', maxWidth: 900}}
/>
</center>


## The caveat: Dynamic scoring required

Commit Reveal only prevents weight copying if **miner performance actually changes** over the timescale of the concealment period. If the ground truth about miner rankings is overly static, then even stale weights will be accurate enough to be profitable, and in this case, nothing can prevent weight copying.

Subnet owners should design subnets that demand continuous miner improvement, which is important generally for producing best-in-class digital commodities, and also ensures that weights from yesterday are less accurate than fresh evaluations today, preventing weight copying. Alternatively, even if weights change infrequently (such as once per week), Liquid Alpha 2 can be used to deregister weight copiers.
