# Understanding Exponential Moving Averages in Bittensor

The exponential moving average (EMA) is a [mathematical technique](https://en.wikipedia.org/wiki/Exponential_smoothing) for tracking a dynamic quantity, such as a token price, over time.

Specifically, EMA is a weighted moving average that exponentially decreases the weight of older data point. This extracts a signal reflecting where the value has spent *most* of its time *most recently*, stabilizing or 'smoothing' the constant noise of rapid, largely random fluctuations.

The EMA of a changing value at a given time is determined by weighted average of the current value and the EMA at the last time step. The parameter factor, or 'smoothing factor' is called $\alpha$.

$$
\mathrm{EMA}(t) = \alpha \times \mathrm{current} + (1 - \alpha) \times \mathrm{EMA}(t-1)
$$

The alpha parameter controls how quickly the EMA responds to changes:

- **Small $\alpha$ (e.g., 0.01)**: Very slow response, high stability, takes many periods for significant changes
- **Large $\alpha$ (e.g., 0.5)**: Fast response, lower stability, quickly incorporates new information
- **$\alpha$ = 1**: No smoothing (immediate response to current value)

:::tip
Note that this alpha parameter is distinct from and unrelated to the usage of 'alpha' to refer to subnet-specific currencies.
:::

## Bittensor's Two EMA Applications

Bittensor uses EMAs to smooth two critical dynamical values during the emission process:

- Emissions to each subnet are determined by an EMA-smoothed representation of subnet price each tempo. This protects emissions from price volatility or intentional manipulation.

- Emissions to participants of each subnet are determined by EMAs of instantaneous validator-miner bond-strengths. This plays an important roll in ensuring that validators and miners are fairly rewarded for innovation, as measured by eventual consensus (rather than immediate consensus) about miner weights.

### Subnet Price Emission Smoothing

This use of EMA smoothing protects the network's economic model from price manipulation by making emissions extremely slow to respond to price changes.

**How It Works**:
The price EMA uses a sophisticated dynamic alpha calculation to ensures that new subnets have even slower price adaptation than mature ones.

$$
\alpha = \frac{ \mathrm{base\_alpha} \times  \mathrm{blocks\_since\_start}}{\mathrm{blocks\_since\_start} + \mathrm{halving\_blocks}}
$$

:::info
The value for **base_alpha** in the above is currently ~0.00003 for Bittensor mainnet ("finney").
:::

See:
- [Yuma Consensus/Coinbase emission source code](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/epoch/run_epoch.rs#L223)
- [Default alpha value for subnet price smoothing](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L828)

### Validator-Miner Bond Smoothing

This smoothing function ensures that relationships between validators and miners evolve gradually, preventing sudden manipulation while rewarding validators who discover promising miners early.

#### Basic Bond EMA (Liquid Alpha Disabled)
**Default Mode**: Single $\alpha$ for all validator-miner pairs
- **Default $\alpha$**: ~0.1 (10%)
- **Response Time**: 7-22 blocks for significant changes (~1-4 minutes)
- **Formula**: `Bond_EMA(t) = 0.1 × New_Bond + 0.9 × Previous_Bond_EMA`

#### Advanced Bond EMA (Liquid Alpha Enabled)
**Consensus-Based Mode**: Dynamic $\alpha$ per validator-miner pair based on consensus alignment
- **$\alpha$ Range**: Dynamic between $\alpha$_low and $\alpha$_high (default: 0.7 to 0.9)
- **Sigmoid Steepness**: Controls transition rate between $\alpha$_low and $\alpha$_high (default: 1000)
- **Individual Alpha**: Each validator-miner pair gets its own $\alpha$ value
- **Response Time**: 1-13 blocks depending on consensus alignment (~12 seconds to 2.6 minutes)

See [Liquid Alpha/Consensus-Based Weights](../subnets/consensus-based-weights)