---
title: "Exponential Moving Averages (EMAs)in Bittensor"
---

# Exponential Moving Averages (EMAs) in Bittensor

The exponential moving average (EMA) is a [mathematical technique](https://en.wikipedia.org/wiki/Exponential_smoothing) for tracking a dynamic quantity, such as a token price, over time. Specifically, EMA is a weighted moving average that exponentially decreases the weight of older data point. This extracts a signal reflecting where the value has spent _most_ of its time _most recently_, stabilizing or 'smoothing' the constant noise of rapid, largely random fluctuations.

Bittensor uses EMAs to smooth two critical dynamical values during the emission process:

- Emissions to each subnet are determined by an EMA-smoothed representation of net TAO flows (staking minus unstaking activity). This protects emissions from short-term fluctuations and manipulation attempts.

- Emissions to participants of each subnet are determined by EMAs of instantaneous validator-miner bond-strengths. This plays an important role in ensuring that validators and miners are fairly rewarded for innovation, as measured by eventual consensus (rather than immediate consensus) about miner weights.

## Mathematical definition

The EMA of a changing value at a given time is determined by weighted average of the current value and the EMA at the last time step. The parameter factor, or 'smoothing factor' is called $\alpha$.

$$
\mathrm{EMA}^{(t)} = \alpha \times \mathrm{current} + (1 - \alpha) \times \mathrm{EMA}^{(t-1)}
$$

The alpha parameter controls how quickly the EMA responds to changes:

- **Small $\alpha$ (e.g., 0.01)**: Very slow response, high stability, takes many periods for significant changes
- **Large $\alpha$ (e.g., 0.5)**: Fast response, lower stability, quickly incorporates new information
- **$\alpha$ = 1**: No smoothing (immediate response to current value)

:::tip
Note that this alpha parameter is distinct from and unrelated to the usage of 'alpha' to refer to subnet-specific currencies.
:::

## Subnet Flow Emission Smoothing

This use of EMA smoothing protects the network's economic model from manipulation by making emissions extremely slow to respond to changes in staking activity.

**How It Works**:
The flow-based model uses an EMA to track net TAO flows (staking minus unstaking) over time, with a 30-day half-life (~86.8 day effective window):

$$
S_i = (1 - \alpha) \cdot S_{i-1} + \alpha \cdot \text{net\_flow}_i
$$

**Key Parameters**:
- **Smoothing factor ($\alpha$)**: ~0.000003209 (creates 30-day half-life)
- **EMA window**: ~86.8 days (effective duration over which old values still affect the running EMA)
- **Response characteristic**: Very slow - 99.9997% from previous EMA, only 0.0003% from current block

This extremely slow EMA prevents:
- Short-term gaming through temporary staking spikes
- Price manipulation through wash trading
- Flash attacks on emissions

Subnets with negative net flows (more unstaking than staking) receive zero emissions after the EMA reflects sustained negative flow.

:::tip Flow-Based Model Active
As of November 2025, emissions are based on EMA of TAO flows rather than token prices. See [Emissions](./emissions.md) for complete details.
:::

See:
- [Flow-based emission implementation](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs)
- [EMA smoothing factor](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1302-L1308)

## Validator-Miner Bond Smoothing

This smoothing function ensures that relationships between validators and miners evolve gradually, preventing sudden manipulation while rewarding validators who discover promising miners early.

### Basic Bond EMA (Liquid Alpha Disabled)

**Default Mode**: Single $\alpha$ for all validator-miner pairs

- **Default $\alpha$**: ~0.1 (10%)
- **Response Time**: 7-22 blocks for significant changes (~1-4 minutes)
- **Formula**
  The EMA of the bond (BondEMA)of a validator i for a miner j, at time t, is the $\alpha$-weighted average of the instantaneous bond and the previous timestep's BondEMA:
  $$
  BondEMA_{ij}^{(t)} = \alpha \times \, InstantBond_{ij} + (1-\alpha)\,BondEMA_{ij}^{(t-1)}
  $$

### Advanced Bond EMA (Liquid Alpha Enabled)

**Consensus-Based Mode**: Dynamic $\alpha$ per validator-miner pair based on consensus alignment

- **$\alpha$ Range**: Dynamic between $\alpha$\_low and $\alpha$\_high (default: 0.7 to 0.9)
- **Sigmoid Steepness**: Controls transition rate between $\alpha$\_low and $\alpha$\_high (default: 1000)
- **Individual Alpha**: Each validator-miner pair gets its own $\alpha$ value
- **Response Time**: 1-13 blocks depending on consensus alignment (~12 seconds to 2.6 minutes)

See [Liquid Alpha/Consensus-Based Weights](../concepts/consensus-based-weights)
