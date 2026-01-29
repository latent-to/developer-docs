## Emissions and Earnings

### Root Subnet Earnings

Root validators earn through a dividend mechanism:

- **Root Dividends**: A portion of each subnet's Alpha emissions is allocated to root validators based on the subnet's "root proportion"
- **Root Proportion**: Determined by the amount of TAO staked on the root subnet relative to the subnet's total value
- **Distribution**: Root dividends are distributed proportionally to root validators based on their stake
- **Claiming**: Root validators can claim their dividends, with options to:
  - Swap Alpha to TAO and stake it back on root (default)
  - Keep Alpha as-is
  - Keep Alpha for specific subnets while swapping others

### Mining Subnet Earnings

Mining subnets distribute emissions through a 50/50 split:

- **Miner Incentive (50%)**: Distributed to miners based on validator consensus on their utility
- **Validator Dividends (50%)**: Distributed to validators based on their bonds with miners and consensus participation
- **Root Proportion**: A portion of validator dividends goes to root validators based on the subnet's root proportion
- **Owner Cut**: Subnet owners receive a percentage cut of emissions (configurable)

Earnings are calculated using Yuma Consensus, which:

- Rewards validators for agreeing with stake-weighted consensus
- Rewards miners based on consensus-clipped validator weights
- Penalizes validators who weight above consensus
- Uses exponential moving averages for bonds to reward early discovery

## Mining and Validating

### Mining (Servers)

Miners in non-root subnets:

- **Role**: Provide the actual utility or service that the subnet is designed for
- **Registration**: Must burn TAO (converted to Alpha) to register
- **Earnings**: Receive 50% of subnet emissions based on validator consensus
- **Consensus**: Validators evaluate miner performance and assign weights
- **Activity**: Must remain active and serve requests to maintain their position

### Validating

Validators exist in both root and mining subnets:

**Root Validators:**

- Evaluate and weight other subnets (not individual miners)
- Set weights on subnets to indicate their perceived value
- Earn dividends from all subnets based on root proportion
- Must have sufficient stake to maintain position

**Mining Subnet Validators:**

- Evaluate and weight miners within their subnet
- Set weights on miners to indicate their perceived utility
- Earn 50% of subnet emissions (minus root proportion)
- Bond with miners using exponential moving averages
- Consensus-clipping prevents manipulation by penalizing weights above consensus

## Registration and Creation

### Subnet Creation

Creating a new subnet requires:

1. **Lock Cost**: Pay a TAO lock amount that increases with each subnet creation
2. **Pruning**: If the subnet limit is reached, the lowest-performing subnet is dissolved and its netuid is recycled
3. **Initial Pool**: A portion of the lock amount goes into the subnet's TAO/Alpha liquidity pool
4. **Recycle**: The remaining lock amount (after pool allocation) is recycled back into the network
5. **Owner**: The creator becomes the subnet owner and can configure parameters

The lock cost formula:

- Starts at minimum lock amount
- Doubles with each subnet creation
- Decreases over time based on blocks since last creation
- Minimum lock amount is enforced

### Registration to Subnets

**Root Subnet Registration:**

- Free (no burn required)
- Requires sufficient stake on the hotkey
- If full, replaces the validator with lowest stake
- Automatically sets registrant as delegate

**Mining Subnet Registration:**

- Requires burning TAO tokens
- Burn amount is converted to Alpha through the subnet's AMM
- The burned Alpha reduces the subnet's AlphaOut supply
- Registration can be rate-limited per block and per interval
- If subnet is full, replaces the lowest-performing UID

### Burn vs Recycle

Both mechanisms reduce Alpha supply but serve different purposes:

**Burn:**

- Permanently removes Alpha from circulation
- Reduces SubnetAlphaOut
- Used during registration to enter a subnet
- Tokens are destroyed and cannot be recovered

**Recycle:**

- Returns Alpha to the network's recycling pool
- Reduces SubnetAlphaOut
- Used when exiting a subnet or managing supply
- Recycled tokens can be used for future registrations
- Applied during subnet creation for excess lock amounts

The choice between burn and recycle affects the subnet's token economics:

- Burn reduces total supply permanently (deflationary)
- Recycle maintains supply but removes it from active circulation (temporary deflationary)

Both operations require:

- Sufficient stake in Alpha on the subnet
- The subnet must have subtoken enabled
- Cannot be performed on root subnet
- Must have sufficient liquidity in SubnetAlphaOut
