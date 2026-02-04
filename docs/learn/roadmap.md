---
title: "Bittensor Roadmap"
---

# Bittensor Roadmap

This document outlines current major development initiatives for the Bittensor protocol, which currently include:

- [Solving the MEV problem](#solving-the-mev-problem)
- [Perfecting the Emissions Model](#perfecting-the-emissions-model)
- [The Path to Decentralization](#the-path-to-decentralization)

See also:

- [Community Roadmap board](https://www.notion.so/292ae7e8d21280f4b1b2f652c10f7f09?v=292ae7e8d212806ab31b000ca578c69b&p=2bfae7e8d2128018947cfbab29f9e03e&pm=s)


## Solving the MEV problem
  
Maximal Extractable Value (MEV) occurs when network participants exploit transaction visibility in the mempool to profit from foreknowledge of pending transactions—enabling front-running, sandwich attacks, and other forms of parasitic extraction. Bittensor's MEV Shield encrypts transaction details until block inclusion, preventing these exploits and protecting users.  

See [MEV Shield: Encrypted Mempool Protection](../concepts/mev-shield/)

## Perfecting of the Emissions Model
  
Bittensor's Emissions algorith, by which Bittensor rewards participants with ownership of tokens, is continually evolving. The research and development team and many contributors from the community are working hard to invent, mathematically explore, computationally simulate and rigorously crash test, the implications of possible variants of how Bittensor could distribute tokens. All of this is required in order to find the ideal protocol for the goals of Bittensor, to promote a Bittensor ecosystem that can excel both in producing better commodities and creating a fair environment for all participants.

See [Emissions](../learn/emissions)

## The Path to Decentralization

The bulk of heavy development in Bittensor currently is oriented toward the transition from an operationally centralized project toward its eventual, planned state of fully decentralization.

Bittensor was created by a small team, the Opentensor Foundation (OTF) that has maintained careful operational control since its inception, in order to protect the project and ensure it could function. Eventually achieving full decentralization while maintaining operational soundness and security along every step of the way requires careful planning and execution of a series of precise steps, delegating various components of all of the control that OTF has had over the project.

We can roughly think of three essential chunks to this control:

- Blockchain validation
- Operational control (sudo)
- Decision-making

### Decentralized Blockchain Validation

**Status:** In Development  
**Target:** Spring 2026

Transitioning from Proof of Authority (PoA) to Nominated Proof of Stake (NPoS) a foundational step toward true decentralization.

**What this means:**
- Block production will be distributed across elected validators
- OTF will no longer have direct control over block production
- The network becomes permissionlessly decentralized at the consensus layer


**Prerequisites:**
- Trustless MEV Shield (see below)
- Validator incentive model finalized
- Governance framework in place



The current MEV Shield must be upgraded to a trustless implementation before NPoS can launch. This prevents validators from exploiting their position to front-run transactions.

Bittensor's [MEV Shield](../concepts/mev-shield/index.md) encrypts transaction data until block finalization, preventing MEV attacks by keeping transaction details hidden from potential exploiters in the mempool. The shield must transition to a trustless model to ensure security in a fully decentralized validation environment.


**Current Status:**

Bittensor is in the final stages of rooting out MEV. The current MEV Shield implementation relies on a single encryption key held by the block validator, which works effectively in the Proof-of-Authority model. However, this centralized approach must be adapted to a trustless model before the NPoS transition can occur.

Recent anti-MEV improvements include batch call filtering, proxy transaction mitigation, slippage clamping mechanisms, and shielded priority transactions for subnet operations.

### Validator Incentives for NPoS

**Status:** Under Research  
**Target:** Before NPoS launch

The economics of running an NPoS validator need to be defined. Current thinking:
- Initially, validator incentives will likely be modest (approximately break-even)
- This is intentional — early validators should be enthusiastic participants, not pure profit-seekers
- Additional incentive mechanisms are being researched, potentially including:
  - Transaction fee distribution to validators
  - Registration fee allocation


### Rotating Triumvirate Elections

**Status:** Planned  
**Target:** Q2 2026

The Triumvirate (a multisig 2 of 3 that controls sudo operations on the Bittensor blockchain) will transition to democratically elected positions.

**Proposed mechanism:**
- Three seats, with one seat up for election every three months (rotating)
- Ranked choice voting
- Members elected from stakers and builders
- Once elected, the Triumvirate can exercise stronger executive power with democratic legitimacy

**Why this matters:**
Currently, the Triumvirate consists of appointed Opentensor Foundation employees who exercise power cautiously as a "benevolent dictator" during Bittensor's transitional phase. An elected Triumvirate can act with the mandate of the community, enabling more decisive governance when needed.

### Enhanced Governance Framework

**Status:** In Development  
**Target:** Q2 2026

Building out the full governance stack to enable community-driven protocol evolution:

**On-Chain Governance System:**
- Proposal mechanisms for community input and protocol changes
- Voting procedures with appropriate thresholds and time delays
- Treasury governance for network resource allocation
- Transparent proposal tracking and execution

**Governance Participants:**
- **Triumvirate**: Elected executive body with sudo origin access for privileged operations
- **Senate**: Top K delegate hotkeys by stake, participating in proposal review and voting
- **Community**: All stakeholders can participate through delegation and proposal submission

**Key Design Principles:**
- Gradual decentralization to maintain network stability
- Stake-weighted participation to align incentives
- Checks and balances between executive and legislative functions
- Transparent processes with on-chain verifiability

**Current Implementation Status:**
<!-- NOTE (from 2/3/26 meeting, Loris lines 118-120): Current governance palette features implemented -->
- Election mechanisms for governance positions
- Proposal submission by OTF
- Triumvirate voting on proposals
- Two collectives (subnet owners and top takers) can vote to fast track or censure proposals
- Triumvirate elections not included in v1 (by previous design decision)
- SR tool integration needed for proof of identity between GitHub and proposals
- Code updates needed before v1 release based on evolved requirements

<!-- NOTE: Loris mentioned governance work is on hold while working on Polkadot SDK upgrade and dispatch queue -->

**What v1 Enables:**
The first governance release will allow testing the democratic process even without full elections. For controversial changes that the Triumvirate could execute unilaterally but prefers community input on (e.g., deregistrations), proposals can run through the governance process to gauge community sentiment before the Triumvirate acts.
<!-- NOTE: From first meeting lines 121-123, Speaker 1 discussing governance testing strategy -->

For detailed governance plans, see the [governance design document](https://hackmd.io/mHQ9sPiCRn-vyc7ZTKBfWw).



