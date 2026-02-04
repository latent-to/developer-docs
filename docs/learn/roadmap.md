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
  
Maximal Extractable Value (MEV) occurs when network participants exploit transaction visibility in the mempool to profit from foreknowledge of pending transactions—enabling front-running, sandwich attacks, and other forms of parasitic extraction.

Throughout Bittensor's history, MEV attackers have taken a significant toll on the Bittensor token economy, as is true for many blockchain token economies. Carefully using Bittensor's [price protection mechanisms](./price-protection) can protect stakers, but can be a dauntingly complex and laborious task for many users.

Bittensor's MEV Shield, introduced in December 2025, encrypts transaction details until block inclusion, provided easy, automated protection from MEV exploits. 

See [MEV Shield: Encrypted Mempool Protection](../concepts/mev-shield/)

A number of follow-up optimizations and edge-case fixes are currently in research and development and are expected to roll out to main net in Spring 2026.

## Perfecting of the Emissions Model
  
Bittensor's Emissions algorith, by which Bittensor rewards participants with ownership of tokens, is continually evolving. The research and development team and many contributors from the community are working hard to invent, mathematically explore, computationally simulate and rigorously crash test, the implications of possible variants of how Bittensor could distribute tokens. All of this is required in order to find the ideal protocol for the goals of Bittensor, to promote a Bittensor ecosystem that can excel both in producing better commodities and creating a fair environment for all participants.

The most recent major change was the shift in December 2025 to the 'TAO flow' emissions model, wherein subnets' relative emissions are determined by their net flow of TAO into/out of the subnet due to staking, whereas previously emissions were based on price.

Further refinements are currently being being explored by Opentensor Foundation researchers. Any changes to the emissions model are expected to undergo community review and discussion prior to introduction to main net.

See [Emissions](../learn/emissions)

## The Path to Decentralization

The bulk of heavy development in Bittensor currently is oriented toward the transition from an operationally centralized project toward its eventual, planned state of fully decentralization.

Bittensor was initially created by a small team, the Opentensor Foundation (OTF) that has maintained careful operational control since its inception, in order to protect the project and ensure it could function. Eventually achieving full decentralization while maintaining operational soundness and security along every step of the way requires careful planning and execution of a series of precise steps, delegating various components of all of the control that OTF has had over the project.

We can roughly think of three essential chunks to this control:

- Blockchain validation
- Operational control (sudo)
- Decision-making

### Decentralized Blockchain Validation

Transitioning from Proof of Authority (PoA) to Nominated Proof of Stake (NPoS) a foundational step toward true decentralization.

Block production will be distributed across elected validators, and OTF will no longer have direct control. The network at that point becomes permissionlessly decentralized at the consensus layer.

**Current Blockers:**
- Trustless MEV Shield (see below)
- Validator incentive model finalized
- Governance framework in place

#### Trustless MEV Shield

The current MEV Shield implementation relies on a single encryption key held by the block validator, which works effectively in the Proof-of-Authority model. However, this centralized approach must be adapted to a trustless model before the NPoS transition can occur.

#### Validator Incentives for NPoS

The economics of running an NPoS validator need to be defined. Current thinking:
- Initially, validator incentives will likely be modest (approximately break-even)
- This is intentional — early validators should be enthusiastic participants, not pure profit-seekers
- Additional incentive mechanisms are being researched, potentially including:
  - Transaction fee distribution to validators
  - Registration fee allocation

### Rotating Triumvirate Elections

The Triumvirate (a multisig 2 of 3 that controls sudo operations on the Bittensor blockchain) will transition to democratically elected positions.

Currently, the Triumvirate consists of appointed Opentensor Foundation employees who exercise power cautiously as a "benevolent dictator" during Bittensor's transitional phase. An elected Triumvirate can act with the mandate of the community, enabling more decisive governance when needed.

**Proposed mechanism:**
- Three seats, with one seat up for election every three months (rotating)
- Ranked choice voting
- Members elected from stakers and builders


### Enhanced Governance Framework


The protocol for decentralized governance of Bittensor is still in research and development. For the current proposal, see the [governance design document](https://hackmd.io/mHQ9sPiCRn-vyc7ZTKBfWw).

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





