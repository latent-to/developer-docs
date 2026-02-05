---
title: "Bittensor Roadmap"
---

# Bittensor Roadmap

This document outlines current major development initiatives for the Bittensor protocol, which currently include:

- [Solving the MEV problem](#solving-the-mev-problem)
- [Perfecting the Emissions Model](#perfecting-the-emissions-model)
- [The Path to Decentralization](#the-path-to-decentralization)

See also:
- [Bittensor Development Roadmap](https://www.notion.so/292ae7e8d21280f4b1b2f652c10f7f09?v=292ae7e8d212806ab31b000ca578c69b&p=2bfae7e8d2128018947cfbab29f9e03e&pm=s)
- [Church of RAO Roadmap forum](https://forum.bittensor.church/c/roadmap/9/l/latest?board=default)
- [Proposal: On-Chain Governance System for Bittensor](https://hackmd.io/mHQ9sPiCRn-vyc7ZTKBfWw)

## Solving the MEV problem
  
Throughout Bittensor's history, Maximal Extractable Value (MEV) attackers have taken a significant toll on the Bittensor token economy, as is true for many blockchain token economies.

Maximal Extractable Value (MEV) occurs when network participants exploit transaction visibility in the mempool to profit from foreknowledge of pending transactions—enabling front-running, sandwich attacks, and other forms of parasitic extraction. MEV is a fundamental problem for Substrate/Polkadot-based chains, like Bittensor's Subtensor blockchain, as discussed in this recent Polkadot [forum thread](https://forum.polkadot.network/t/encrypted-mempools-turning-polkadots-mev-leak-into-treasury-revenue/15817).

Bittensor's [price protection mechanism](./price-protection) has offered stakers a strong degree of protection for some time, but using it correctly can be a dauntingly complex and laborious task for many users and requires the use of programmable clients (e.g. BTCLI or the Python SDK) rather than simpler trading apps.

Bittensor's MEV Shield, introduced in December 2025, encrypts transaction details until block inclusion and provides easy, automated protection from MEV exploits. A number of follow-up optimizations and edge-case fixes are currently in research and development and are expected to roll out to mainnet in Spring 2026, providing a mature, comprehensive, and seamless-to-use solution to the MEV problem for Bittensor.

See [MEV Shield: Encrypted Mempool Protection](../concepts/mev-shield/)


## Perfecting the Emissions Model
  
Bittensor's Emissions algorithm, which determines the flow of liquidity into subnets, where they are then used to incentivize participants, is continually evolving. The research and development team and many contributors from the community are working hard to invent, mathematically explore, computationally simulate and rigorously crash test, the implications of possible variants of how Bittensor could distribute tokens. All of this is required in order to find the ideal protocol for the goals of Bittensor, to promote a Bittensor ecosystem that can excel both in producing better commodities and creating a fair environment for all participants.

The most recent major change was the shift in December 2025 to the 'TAO flow' emissions model, wherein subnets' relative emissions are determined by their net flow of TAO into/out of the subnet due to staking, whereas previously emissions were based on price.

Further refinements are currently being explored by Opentensor Foundation researchers. Any changes to the emissions model are expected to undergo community review and discussion prior to introduction to mainnet.

See [Emissions](../learn/emissions)

## The Path to Decentralization

The bulk of heavy development in Bittensor currently is oriented toward the transition from an operationally centralized project toward its eventual, planned state of full decentralization.

Bittensor was initially created by a small team, the Opentensor Foundation (OTF) that has maintained careful operational control since its inception, in order to protect the project and ensure it could function. Eventually achieving full decentralization while maintaining operational soundness and security along every step of the way requires careful planning and execution of a series of precise steps, delegating various components of all of the control that OTF has had over the project.

There are three essential components to this control, which must be transitioned together:

- Blockchain validation
- Operational control (sudo/triumvirate)
- Governance


The protocol for decentralized governance of Bittensor is still in research and development. For the current proposal, on which this document is based, see the [governance design document](https://hackmd.io/mHQ9sPiCRn-vyc7ZTKBfWw).


### Decentralized Blockchain Validation

Transitioning from Proof of Authority (PoA) to Nominated Proof of Stake (NPoS) is a foundational step toward true decentralization.

Block production will be distributed across elected validators, and OTF will no longer have direct control. The network at that point becomes permissionlessly decentralized at the consensus layer.

**Current Blockers:**
- Trustless MEV Shield (see below)
- Validator incentive model finalized

#### Trustless MEV Shield

The current MEV Shield implementation relies on a single encryption key held by the block validator, which works effectively in the Proof-of-Authority model. However, this centralized approach must be adapted to a trustless model before the NPoS transition can occur.

#### Validator Incentives for NPoS

The economics of running an NPoS validator need to be defined. Current thinking:
- Initially, validator incentives will likely be modest (approximately break-even)
- This is intentional — early validators should be enthusiastic participants, not pure profit-seekers
- Additional incentive mechanisms are being researched, potentially including:
  - Transaction fee distribution to validators
  - Registration fee allocation

### Operational Control

Currently, operational control of the Bittensor blockchain is exercised through the [Triumvirate](../resources/glossary#triumvirate), a [multisig](../keys/multisig) 2-of-3 that controls [sudo](../resources/glossary#sudo) operations. The Triumvirate consists of trusted developers appointed by Opentensor Foundation, who have held their keys since early in Bittensor's history, essentially acting as stewards of the blockchain on behalf of the Bittensor community. While this centralized model was beneficial in bootstrapping Bittensor, transitioning to a decentralized model is required to fulfill Bittensor's mandate for true decentralization.

### Decentralized Governance

The on-chain governance system being developed for Bittensor will replace the current sudo-based control with a checks-and-balanced based model. Authorized proposer accounts will submit proposals for protocol changes and runtime upgrades. The Triumvirate will vote on submitted proposals. Two collective bodies will provide oversight and accountability: the Economic Collective, composed of the top 16 validators by total stake, and the Building Collective, composed of the top 16 subnet owners by moving average price with a minimum age of 6 months. Once any proposal clears the triumvirate, these Collectives will have the power to delay the proposal for more discussion and ultimately reject it, or fast-track it for immediate deployment during a delay period following Triumvirate approval. During this delay period, members of both collectives can vote aye/nay on proposals (the exact mechanics of whether votes are considered independently per-collective or aggregated across both collectives is still being finalized). Either collective can fast-track a proposal to next-block execution with supermajority—more than 2/3—of "aye" votes, or cancel it outright with a simple majority—more than 1/2—of "nay" votes. Nay votes from both collectives accumulate to create delays based on the collective with the most nays, following an exponential backoff function (2^n × a base delay; base delay initially proposed as 1 hour, configurable), giving stakeholders time to respond to controversial proposals.

Additionally, each collective can replace one Triumvirate member every six months through a rotating seat mechanism, ensuring accountability. Collective members who mark themselves as eligible can be randomly selected as replacement candidates, creating a pathway for major stakeholders—validators and subnet owners—to directly participate in governance leadership.

The governance design balances efficiency with decentralization through several key principles. Gradual implementation ensures network stability is maintained throughout the transition, with the system initially coexisting alongside the current sudo implementation before fully replacing it. Stake-weighted and subnet-owner participation aligns incentives across different types of stakeholders. Checks and balances between proposal submission, Triumvirate approval, and collective oversight prevent concentration of power, while transparent on-chain processes maintain verifiability and accountability.

The initial proposed implementation focuses on enabling proposal submission by authorized proposers, on-chain Triumvirate voting on proposals, and collective oversight through delay, fast-tracking, and cancellation mechanisms. Some details remain open and are expected to be refined through testing and community feedback (e.g., how collective voting is counted across bodies, and the nomination/acceptance flow for replacements).

![Proposed Governance of Bittensor](/img/docs/proposal-flow.svg)

<!-- @startuml
title On-Chain Governance: Proposal Flow

skinparam shadowing false
skinparam defaultFontName Monospace
skinparam sequence {
  LifeLineBorderColor #444444
  ParticipantBorderColor #444444
  ParticipantBackgroundColor white
  ArrowColor #444444
}

actor "Authorized Proposer" as P
actor "Triumvirate" as T
actor "Economic Collective" as EC
actor "Building Collective" as BC
database "Chain" as C

== Proposal Submission ==
note over P
An authorized proposer submits a proposal containing a runtime upgrade
or any root extrinsic.
end note
P -> C: submit_proposal(call)

note over C
Proposal enters "Triumvirate Voting".
end note

== Triumvirate Voting Period ==
group #LightSkyBlue 7 days to reach 2/3 votes\n2/3 nay votes rejects immediately
  T -> C: vote(aye/nay)

  opt 2-of-3 ayes reached
    C -> C: approve
    
  else 2-of-3 nays reached OR 7 day timeout
    C -> C: reject
  end
end group

== Delay Period for Collectives Oversight ==

group #LightGreen Delay Period (initially 1 hour)\nEither collective can vote to approve or delay proposal 
  par A Collective votes
    EC -> C: vote(aye/nay)
  else Building Collective votes
    BC -> C: vote(aye/nay)
  end

  opt Fast-track
    C -> C: More than 2/3 of aye vote for any collective fast tracks the proposal

  end

  opt Cancel
    C -> C: More than 1/2 of nay vote for any collective cancels the proposal
  end

  opt Delay adjustments
    C -> C: recompute delay as votes change
  end
end group
note right of C
When delay is reduced below time already elapsed,
the delay period ends and execution begins.
end note
== Execution ==
note over C
After the delay period expires (and if not cancelled),
the chain executes the call with root privilege.
If execution fails, it is not retried and is cleaned up.
end note

C -> C: execute(call as Root)
alt success
  C -> C: cleanup
else failure
  C -> C: cleanup (no retry)
end

@enduml
 -->