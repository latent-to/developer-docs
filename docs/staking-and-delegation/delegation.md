---
title: "Staking/Delegation Overview"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Staking/delegation overview

TAO holders can **stake** any amount of the liquidity they hold to a validator. Also known as **delegation**, staking supports validators, because their total stake in the subnet, including stake delegated to them by others, determines their consensus power and their share of emissions. After the validator/delegate extracts their **take** the remaining emissions are credited back to the stakers/delegators in proportion to their stake with that validator.

:::note Transaction Fees
Staking and unstaking operations incur transaction fees. See [Transaction Fees in Bittensor](../learn/fees.md) for details.
:::

See also:

- [Browse validators on TAO.app](https://www.tao.app/validators), with on-chain identities, stake distributions, validator take percentages, etc.
- [Managing Stake with 'btcli'](./managing-stake-btcli.md)
- [Managing Stake with the Python SDK](./managing-stake-sdk.md)
- [Staking with a Proxy](../keys/proxies/staking-with-proxy): Keep your coldkey secure while managing staking operations

:::tip tips
Validators/delegates can configure their take. The default value is 18%. See [`btcli sudo set-take`](../btcli#btcli-sudo-set-take).

Minimum required stake for nominators is 0.1 TAO.
:::

### Staking into Subnets

Staking is always local to a subnet.

Each subnet operates its own automated market maker (AMM), meaning it mantains its own reserves of the two tokens being traded so that it can facilitate a trade of any desired quantity of liquidity (as long as its available), at a price that it automated calculates.

Each subnet has a reserve of TAO and a reserve of its currency, referred to in general as its alpha ($\alpha$) currency. Stake is held in $\alpha$ token denominations.

As a TAO holder, you will stake to a validator’s hotkey on a specific subnet. Staking to a given validator's hotkeys on different subnets is independent.

**When you stake:**

1. First, your TAO stake goes into the subnet's TAO reserve of its AMM pool.
1. Then, the subnet's AMM pool algorithm uses the latest exchange rate and calculates the equivalent units of $\alpha$, for the TAO that was just added to the TAO reserve side. This amount of $\alpha$ is taken out of the alpha reserve of the pool and is sent to the validator’s hotkey.
1. The validator’s hotkey holds the $\alpha$. The sum of stake among all hotkeys is referred as **$\alpha$ outstanding** for that subnet.

### Unstaking back to TAO {#unstaking}

**When you unstake:**

1. When you issue an unstake command, `btcli stake remove`, and specify the units of $\alpha$ token you want to unstake, this $\alpha$ is first taken out of the validator's hotkey and added to the $\alpha$ reserves of the subnet pool.
2. The subnet's AMM pool algorithm then applies the latest exchange rate and calculates the equivalent TAO units for the $\alpha$ token units that were just added to the $\alpha$ reserves of the pool.
3. These equivalent TAO units are then taken out of the TAO reserves of the subnet pool and are sent to the TAO holder's coldkey.

:::important Key considerations when unstaking
**Slippage**: Like staking, unstaking operations are subject to slippage because your transaction affects the subnet's AMM pool prices. Larger unstaking amounts will experience more slippage. See [Understanding Pricing and Anticipating Slippage](../learn/slippage.md) for details.

**Price protection**: Bittensor provides built-in price protection mechanisms to prevent unfavorable unstaking transactions. You can set tolerance limits and enable partial execution. See [Price Protection When Staking](../learn/price-protection.md) for more information.

**Transaction fees**: Unstaking operations incur blockchain transaction fees. These fees are recycled back into the TAO emission pool. See [Transaction Fees in Bittensor](../learn/fees.md).
:::

### Unstaking methods

There are several ways to unstake your TAO:

- **Direct unstaking**: Remove stake from a specific validator on a specific subnet using `btcli stake remove` or the SDK's `unstake()` method
- **Unstake all**: Remove all stake from a validator on a subnet in one operation
- **Move stake**: Move stake between validators or subnets without withdrawing to your coldkey (see [Moving stake](#moving-stake))
- **Transfer stake**: Transfer ownership of staked tokens to another coldkey (see [Transferring stake](#transferring-stake))

### Moving stake

Moving stake is a special operation that transfers stake between validators or subnets in a single atomic transaction, without first withdrawing to your coldkey. This can be more efficient than unstaking and restaking separately, as it minimizes the number of transactions and associated fees.

### Transferring stake

Transferring stake changes ownership of staked tokens from one coldkey to another while keeping the stake on the same validator. This comprises unstaking, transferring TAO ownership, and restaking to the same validator as an atomic transaction.

:::tip Stake is always expressed in alpha units
In Dynamic TAO, except for the stake held in [the Root Subnet](../subnets/understanding-subnets.md#subnet-zero), the stake held by a hotkey in a subnet is always expressed in the subnet-specific $\alpha$ units. Root Subnet stake is expressed in $\tau$.
:::

:::tip Prereq
To follow along, install the [latest release of `btcli`](https://pypi.org/project/bittensor-cli/).
:::

<details>
<summary> <strong>See how its calculated</strong> </summary>
## Example

Suppose a validator holds 800 TAO of their own.

Then three nominators stake to the validator as follows:

- Nominator 1: 100 TAO.
- Nominator 2: 70 TAO.
- Nominator 3: 30 TAO.

The validator's effective stake is the total sum of their own and all delegated stake.

$$
\text{delegated stake} = 100\tau + 70\tau + 30\tau = 200\tau
$$

$$
\text{total stake} = \text{self-stake} + \text{delegated stake} = 800\tau + 200\tau = 1000 \tau
$$

Emissions to stakers are proportional to their contribution to delegated stake:

    $$
    \text{emission for staker x from validator V} =
      \frac
      { stake_x }
      { \sum_{i \in \text{V's stakers}} \bigl(stake_i) }
    $$

- Nominator 1 represents 50% of total delegated TAO:

  $$
  \text{emission for staker x from validator V} =
    \frac
    { 100\tau }
    { 100\tau + 70\tau + 30\tau } = 50\%
  $$

- Nominator 2 contributes 35% of the total delegated TAO.
  $$
      \text{emission for staker x from validator V} =
        \frac
        { 70\tau }
        { 100\tau + 70\tau + 30\tau } = 35\%
  $$
- Nominator 3 contributes 15% of the total delegated TAO.
  $$
      \text{emission for staker x from validator V} =
        \frac
        { 30\tau }
        { 100\tau + 70\tau + 30\tau } = 15\%
  $$

The delegate validator would keep 80% of the emissions, based on their 80% proportion of the total stake (0.8). In addition, the validator would keep their 18% take of the emissions earned on the delegated stake.

As a result:

- Total emissions to the delegate are: $0.8 + 0.2*0.18= .836 = 83.6\%$ of the received emissions.
- Each nominator receives the following portions of the validator's total emissions, based on their contribution percentages:
  - Nominator 1 emissions: $(1-0.8)*(1-0.18)*.5 = .082 = 8.2\%$
  - Nominator 2 emissions: $(1-0.8)*(1-0.18)*.35 = .0574 = 5.74\%$
  - Nominator 3 emissions: $(1-0.8)*(1-0.18)*.15 = .0246 = 2.46\%$

:::info A nominator is a delegating authority
A nominator is the same as a delegating authority. Typically, a nominator is an owner of TAO funds who wants to invest in the Bittensor network without performing any validating tasks.
:::

</details>
