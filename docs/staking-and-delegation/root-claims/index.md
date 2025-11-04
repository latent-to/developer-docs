---
title: "Root Claim"
---

# Root Claim

The root claim feature in Bittensor allows stakers who stake to validators on the [Root Subnet (a.k.a. Subnet Zero)](../subnets/understanding-subnets#subnet-zero) to choose for their staking dividends to accumulate as alpha or be converted immediately to TAO.

- In **Swap** mode (default), the alpha is automatically converted to TAO at the current alpha-to-TAO rate and restaked on the root subnet.
- In **Keep** mode, the earned alpha accumulates on the subnet(s) that generated it.

This design creates flexibility for stakers. Choosing `Swap` favors long-term TAO accumulation and minimum risk, while `Keep` favors remaining invested in subnets and therefore maximizing possible reward while accepting some risk, due to fluctuation of token values.

:::info
The initial TAO staked to the validator remain staked on root in both modes. Only the alpha dividends from subnets are treated differently.

Dividends are divided between TAO and alpha based on [Root Proportion](../resources/glossary#root-proportion)
:::


### Claiming dividends

There are two ways to process claims:

- **Automatic Claims**: Each block, the blockchain selects accounts to claim rewards. Auto-claims happen randomly—roughly once every two days per account.
- **Manual Claims**: You can trigger a claim at any time using the `claim_root()` extrinsic and specifying the subnets you want to claim alpha dividends from, specifying up to five subnets to claim alpha dividends from.

Your configured `Keep` or `Swap` setting is applied automatically to both manual and automatic claims. To change this, you must call the `set_root_claim_type` extrinsic.

:::info claim threshold
Automatic claims are only processed when the accumulated amount exceeds the minimum threshold of `0.0005` alpha. This prevents small, frequent transactions from increasing network load. The threshold is configurable per subnet, allowing subnet owners to adjust it as needed.

Manual claims, however, can be made at any time — even for smaller amounts.

:::
