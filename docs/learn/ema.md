---
title: "Exponential Moving Averages (EMAs)in Bittensor"
---

# Exponential Moving Averages (EMAs) in Bittensor

The exponential moving average (EMA) is a [mathematical technique](https://en.wikipedia.org/wiki/Exponential_smoothing) for tracking a dynamic quantity, such as a token price, over time. Specifically, EMA is a weighted moving average that exponentially decreases the weight of older data point. This extracts a signal reflecting where the value has spent _most_ of its time _most recently_, stabilizing or 'smoothing' the constant noise of rapid, largely random fluctuations.

Bittensor uses EMAs to smooth two critical dynamical values during the emission process:

- TAO emissions to each subnet are determined by a three-factor weighted share of the fixed block emission: each subnet's EMA price (`SubnetMovingPrice`), reduced by any miner-burn penalty.
- Alpha emissions to participants of each subnet are determined by EMAs of instantaneous validator-miner bond-strengths. This plays an important role in ensuring that validators and miners are fairly rewarded for innovation, as measured by eventual consensus (rather than immediate consensus) about miner weights.

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

## Subnet Price EMA Smoothing

EMA smoothing protects the network's economic model from manipulation by making TAO emission shares extremely slow to respond to short-term price fluctuations.

**How It Works**:
The price-based model uses an EMA of each subnet's token price (`SubnetMovingPrice`) to determine emission shares, rather than the live spot price. This means a sudden price spike or crash has minimal immediate effect on a subnet's emission share:

$$
\mathrm{EMA}^{(t)} = \alpha \times \mathrm{current\_price} + (1 - \alpha) \times \mathrm{EMA}^{(t-1)}
$$

Unlike the previous flow-based model which used a fixed smoothing factor, the price EMA uses a **dynamic alpha** that varies by subnet age. New subnets start with a near-zero alpha (extremely slow adaptation) and gradually approach `base_alpha` as they mature:

$$
\alpha = \frac{ \mathrm{base\_alpha} \times  \mathrm{blocks\_since\_start}}{\mathrm{blocks\_since\_start} + \mathrm{halving\_blocks}}
$$

This dynamic alpha prevents:

- Short-term gaming through temporary price pumps, especially on newly registered subnets
- Coordinated buy pressure to capture emission shares
- Flash attacks on emission shares

:::info
Unlike the previous flow-based model, there is no zero-emission floor tied to net flows. A subnet's emission share tracks its relative EMA price — a subnet with a very low or declining EMA price receives a correspondingly small but non-zero share of block emissions (subject to the miner-burn penalty).
:::
See:

- [Subnet emissions source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/coinbase/subnet_emissions.rs)
- [Default alpha value for subnet price smoothing](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L828)

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
