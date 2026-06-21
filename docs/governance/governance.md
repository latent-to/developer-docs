---
title: "Governance"
---

# Governance

Operational control of Bittensor is governed by the following decentralized protocol. All root calls, including protocol changes, runtime upgrades, and other privileged operations, reach the chain only after passing through both stages.

## Collectives

Governance is organized around five named on-chain collectives managed by `pallet-multi-collective`:

| Collective | Size | Selection | Role |
|---|---|---|---|
| **Triumvirate** | 3 (fixed) | Curated (root-assigned) | First-stage approval |
| **Proposers** | 1–20 | Curated (root-assigned) | Submit proposals |
| **Building** | 16 (fixed) | Rotating every 60 days | Review-stage voting |
| **Economic** | 16 (fixed) | Rotating every 60 days | Review-stage voting |
| **EconomicEligible** | ≤64 | Auto-synced from root registrations | Candidate pool for Economic |

## Proposal Flow

### Stage 1: Triumvirate track

A member of the **Proposers** collective submits a root call. The proposal enters the Triumvirate track:

- The three Triumvirate members have **7 days** to vote.
- **2-of-3 aye votes**: proposal advances to the review track.
- **2-of-3 nay votes** or timeout: proposal is rejected and cleaned up.

### Stage 2: Review track

On Triumvirate approval, the proposal enters a delay period. The voter set is the **deduplicated union of the Economic and Building collectives** (at most 32 members). The voter set is snapshotted at the moment the review period opens — collective rotations during the delay do not change who may vote or shift the thresholds.

The delay starts at **24 hours** and can extend to a **2-day maximum** as nay votes accumulate, following an ease-out adjustment curve. When the adjusted delay drops below the time already elapsed, execution begins.

During the delay period, voters may:

- **Fast-track**: 75% or more aye votes → executes at the next block.
- **Cancel**: 51% or more nay votes → proposal cancelled and cleaned up.
- Otherwise the proposal executes when the delay period expires.

### Execution

The chain dispatches the call with root privilege through an atomic enact wrapper. If the call fails it is not retried and is cleaned up. A stale scheduler entry on a terminated referendum cannot dispatch its inner call.

![On-Chain Governance: Proposal Flow](/img/docs/proposal-flow.svg)

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

actor "Proposers Collective\n(1–20 members)" as P
actor "Triumvirate\n(3 members)" as T
actor "Review Collective\n(Economic ∪ Building, ≤32)" as RC
database "Chain" as C

== Proposal Submission ==
note over P
A member of the Proposers collective submits a root call
(protocol change, runtime upgrade, or other privileged operation).
end note
P -> C: submit_proposal(call)

note over C
Proposal enters Triumvirate track.
end note

== Triumvirate Track (7 days) ==
group #LightSkyBlue 7-day decision window\n2-of-3 ayes advance · 2-of-3 nays reject
  T -> C: vote(aye/nay)

  opt 2-of-3 ayes reached
    C -> C: advance to review track

  else 2-of-3 nays reached OR 7-day timeout
    C -> C: reject
  end
end group

== Review Track ==

group #LightGreen 24h initial delay / 2-day max\nVoter set: deduplicated union of Economic and Building
  RC -> C: vote(aye/nay)

  opt Fast-track
    C -> C: 75% or more aye votes → execute at next block
  end

  opt Cancel
    C -> C: 51% or more nay votes → proposal cancelled
  end

  opt Delay adjustment
    C -> C: recompute delay (ease-out curve) as nay votes accumulate
  end
end group

note right of C
Voter eligibility is snapshotted at review-track open.
Collective rotations during the period do not change
who may vote or shift the thresholds.
When the adjusted delay drops below elapsed time,
execution begins.
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

## Collective Membership

### Proposers and Triumvirate

Both are curated: members are added, removed, or swapped by root governance. The Triumvirate is fixed at 3 seats. Previously the Triumvirate held sudo access directly; under the new system it is the first stage of the referendum process with no direct sudo.

### Economic collective

The Economic collective, likely to represent highly staked validators, is selected from the **EconomicEligible** pool every 60 days. The top 16 EconomicEligible coldkeys by stake EMA value take the seats. If fewer than 16 eligible coldkeys are available, the rotation fails safely and the previous membership remains in place.

**EconomicEligible** membership is auto-synced with root registration state. When a coldkey's root-registered hotkey count goes from 0 to 1, the coldkey is added to EconomicEligible. The EMA tracks a combined stake value per coldkey: liquid TAO plus the TAO value of alpha across all owned hotkeys, sampled incrementally each block (8 subnets and ≤256 hotkeys per tick, decay factor alpha=0.02). A 210-sample warmup of approximately 30 days is required before a coldkey becomes eligible for selection.

### Building collective

The Building collective is selected every 60 days. The top 16 subnet-owner coldkeys by their best subnet's moving price take the seats, subject to:

- Subnets younger than 180 days are excluded.
- At most one seat per coldkey regardless of how many qualifying subnets they own.

If fewer than 16 eligible coldkeys are available, the rotation fails safely and the previous membership remains in place.
