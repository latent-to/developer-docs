---
title: "Announcements and Developments"
---

# Announcements and Developments

This page tracks recent and upcoming changes to the Bittensor protocol and other major events in the Bittensor ecosystem.

**January, 2026**

## Updated coldkey swap mechanism

**Status**: In development

- **What**: Coldkey swap transitions from a schedule-based system to an "Announce-and-Execute" workflow, requiring users to finalize the swap after a mandatory delay.
- **Key Features**:
  - Swaps are no longer automatic. After announcing, the user must execute the swap by providing the destination coldkey to verify it against the announced hash.
  - A default waiting period of 36,000 blocks (~5 days) must elapse before the announced swap can be executed.
  - To prevent spam or frontrunning, a 7,200-block (~1 day) buffer is required after the initial delay expires before a new announcement can be submitted.
  - The source coldkey is locked upon announcement. Once executed, all TAO, delegated stakes, and subnet ownership transfer to the destination key.

**December, 2025**

## Upcoming TAO halving

The first TAO halving event is approaching, which will reduce block rewards by 50%—0.5 TAO per block. This change means less liquidity will be injected each block into the subnet pools. For more information, see the [TAO halving documentation](../concepts/halving.md).

You can track the halving schedule and countdown on the [tao.app explorer](https://tao.app/halving), which provides real-time block data and the estimated time remaining until the reward reduction occurs.

## Proxies

**Status**: Implemented

- **What**: Proxies allow one wallet to perform Bittensor operations on behalf of another, adding a security layer for valuable wallets.
- **Key Features**:
  - Keep high-value coldkeys in cold storage while using proxies for daily operations.
  - Constrain proxy permissions using `ProxyType` (e.g., staking-only, transfer-only).
  - Add time-lock delays with public announcements for high-risk actions.

For detailed information, see: [Proxies Overview](../keys/proxies/index.md).

## MEV Shield

**Status**: Implemented

MEV Shield encrypts transactions to protect them from maximal extractable value (MEV) attacks.

For detailed information, see: [MEV Shield](../sdk/mev-protection.md).

## Bittensor SDK v10

**Status**: Released

A new major version of the Bittensor SDK has arrived!

See: [Bittensor SDK v10 Migration guide](../sdk/migration-guide).

---

**October, 2025**

## Root claim

**Status**: Implemented

- **What**: Root claim replaces the automatic selling of root-alpha dividends and allows users to either accumulate their alpha dividends or enable autosell to sell them off immediately.
- **Key Features**:
  - Taking no action means your root alpha is kept as Alpha tokens (the new default is `Keep`).
  - Auto-claims happen automatically and randomly—roughly once every two days per account. Your `Keep`/`Swap` setting will apply.
  - To swap your alpha to TAO, call the `set_root_claim_type(Swap)` extrinsic.
  - Manually claim accumulated alpha on specific subnets by calling the `claim_root()` extrinsic and providing the list of subnets.

## Subnet UID trimming

**Status**: Implemented (Merged)

- **What**: UID trimming allows subnet owners to reduce the number of neuron UIDs registered on their subnet, compressing the remaining UIDs to maintain consecutive indexing.
- **Key Features**:
  - Now allows subnet owners to increase maximum UID count after previous trimming.
  - Removes the lowest-performing neurons based on emission scores.
  - Both temporally immune UIDs and owner-owned UIDs are protected from trimming.
  - After trimming, remaining UIDs are compressed to the left to maintain consecutive indexing

For detailed information, see: [UID trimming](../subnets/uid-trimming.md).

## Multiple Incentive Mechanisms Within Subnets

**Status**: Implemented (Merged)

- **What**: Multiple incentive mechanisms allow subnet owners to apportion emissions across different evaluation criteria, each running Yuma Consensus independently with separate bond pools
- **Key Features**:
  - Enables up to 2 incentive mechanisms (IDs 0,1) within each subnet for multi-task validation.
  - Fully backward-compatible with existing miners and validators via mechanism ID 0
  - Each mechanism has its own weight matrix and independent bond pools for consensus calculations
  - All validators participate in all mechanisms with identical stake weights
- Miners can automatically participate in any of the subnet's mechanisms when registering for a subnet
  - **Emission distribution control**: Subnet owners can set custom emission distributions using the `sudo_set_subsubnet_emission_split` extrinsic
  - **Immediate mechanism number setting**: No onset period - changes take effect immediately
  - **Rate limiting**: Subnet owners can set mechanism numbers once per 7200 blocks

For detailed information, see: [Multiple Incentive Mechanisms Within Subnets](../subnets/understanding-multiple-mech-subnets)

## Hyperparameter Rate Limiting

**Status**: WIP

- **What**: Prevents subnet owners from changing hyperparameters too frequently
- **Rules**: Cannot change hyperparameters in last 10 blocks of a tempo
- **Purpose**: Prevent exploitation where subnet owners kick off root validators to take full incentives
- **Implementation**: Applies 7,200-block rate limit to prevent subnet owner exploitation

See [Rate Limits in Bittensor](../learn/chain-rate-limits.md).

## Child Key Fee

A percentage fee will be deducted from emissions bound to validator hotkeys through a _child hotkey_ relationship. This is designed to more highly incentivize validators who perform validation work, over child-key-only validators. It is being gradually rolled out to reduce surprise for the community and allow validators to adjust.

**Status**: Implemented (Merged)

- **Plan**:
  - Start at 1% (September 10)
  - 30-day delay
  - Increase by 1% per day for 17 days
  - Final rate: 18%

## Changes to the Subnet Registration/Deregistration Process

**Status**: Ready for deployment on September 16, 2025

- **Key Changes**:

  - Subnet limit remains at 128 initially with no new registrations available immediately
  - Immunity period reduced from 6 months to 4 months from registration block
  - Network rate limit increased to 4 days between registrations
  - Initial lock cost set at 1,000 TAO with standard linear decay mechanism
  - First deregistrations available approximately September 23 (one week after deployment)

  See: [Subnet Deregistration](../subnets/subnet-deregistration)

## Auto-Staking for Miners

**Status**: Implemented (Merged)

- **What**: Miners can automatically stake their mining income to a validator of their choice
- **Implementation**:
  - New extrinsics `set_coldkey_auto_stake_hotkey` and `get_coldkey_auto_stake_hotkey`
  - Set per coldkey, affects all miner hotkeys
  - No transaction fees required
  - Reduces sell pressure by allowing automatic delegation of mining rewards
  - Event emission system being added to distinguish mining vs staking rewards for proper accounting
  - Requires CLI support for configuration and management

## Registration Fee Controls

**Status**: Deployed

- **What**: Subnet owners can configure neuron registration fees
- **Implementation**:
  - Subnet owners can configure neuron registration fees between 0.1 and 1 TAO
