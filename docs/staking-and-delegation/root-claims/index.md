# Root Claims

Root claims define how root ALPHA dividents are accumulated and distributed on the Bittensor network.

---

The root claim mechanism in Bittensor allows [nominators](../../resources/glossary.md#nominator) who stake to root validators to either accumulate their ALPHA dividends or convert them to TAO immediately.

Validators on the Bittensor network earn ALPHA as a reward for participating in subnets. When nominators stake TAO to root validators, they become eligible to receive ALPHA dividends from all subnets where the validator participates based on their root network stake. Root claim determines whether a participant’s rewards are automatically converted to TAO or retained as alpha, and how those claims are processed over time.

## How it works

Every nominator on the root subnet earns a stream of ALPHA dividends, derived from their validator’s share of subnet emissions. These dividends accumulate automatically for a short period of time until a claim is initiated.

When a claim occurs, one of two things happens depending on your chosen configuration:

- In **Swap** mode (default), the ALPHA is automatically converted to TAO at the current ALPHA-to-TAO rate and restaked on the root subnet.
- In **Keep** mode, the earned ALPHA accumulates on the subnet(s) that generated it.

This design creates flexibility for stakers—choosing `Swap` favors long-term TAO accumulation and stability, while `Keep` provides exposure to subnet growth while reducing the sell pressure on ALPHA tokens.

:::info

The initial TAO staked root validators remain staked on root in both modes. Only the nominators' ALPHA dividends from subnets are treated differently.
:::

## Root claim types

Each coldkey can configure how they want to handle root claims. There are two root claim types: `Swap` and `Keep`.

- **Swap**: This is the default root claim type. The `Swap` type converts accumulated ALPHA into TAO at claim time. The swapped TAO is then staked on the root network, effectively increasing your TAO stake.

- **Keep**: The `Keep` type allows you to retain dividends as ALPHA tokens on the originating subnet. Instead of converting to TAO, your ALPHA accumulates as a direct stake in the subnets that produced it. This offers direct exposure to subnet growth—if ALPHA gains value, your subnet stakes increase in worth accordingly. It also helps reduce overall sell pressure on ALPHA tokens, supporting healthier subnet markets over time.

You can switch between these modes at any time using the `set_root_claim_type` extrinsic.

### Claiming dividends

There are two ways to process claims:

- **Automatic Claims**: Each block, the blockchain selects accounts to claim rewards. Auto-claims happen randomly—roughly once every two days per account.
- **Manual Claims**: You can trigger a claim at any time using the `claim_root()` extrinsic and specifying the subnets you want to claim ALPHA dividends from, specifying up to five subnets to claim ALPHA dividends from.

Your configured `Keep` or `Swap` setting is applied automatically to both manual and automatic claims. To change this, you must call the `set_root_claim_type` extrinsic.

:::info claim threshold
Automatic claims are only processed when the accumulated amount exceeds the minimum threshold of `0.0005` ALPHA. This prevents small, frequent transactions from increasing network load. The threshold is configurable per subnet, allowing subnet owners to adjust it as needed.

Manual claims, however, can be made at any time — even for smaller amounts.

:::
