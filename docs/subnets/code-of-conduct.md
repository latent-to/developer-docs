---
title: "Subnet Code of Conduct (Draft)"
---

# Subnet Code of Conduct (Draft)

This document is a DRAFT code of conduct for subnet owners: practical norms that have historically been *socially enforced* by validators. The enforcement mechanism has been a coordinated decision to burn the subnet's emissions by submitting a weight matrix that only gives weight to the subnet owner's own key, rather than actual miners; this triggers the alpha emissions to be burnt (not to be sent to the subnet owner).

Bittensor's validators strive to uphold this set of norms because they are seen as critical to keep Bittensor aligned with its design intent as a platform for funding the creation of digital commodities.

The rules and their enforcement aim to:

- Reduce incentives for extractive behavior (emissions capture without meaningful product or good-faith participation).
- Discourage unnecessary centralization (single points of failure, privileged control paths).
- Protect miners/validators/holders from fraudulent, coercive, or unsafe subnet practices.
- Provide a predictable, appealable path to remediation when problems are found.

:::note
This is not an “official law code”. Burn outcomes are ultimately the result of validators' independent decisions. Validators gain their roles by the stake delegated to them by the Bittensor community, and do not have any other authority. 
:::

## Subet Owner Responsibilities

### Validator operations should be open-source and permissionless

- Do not use hyperparameter manipulation or other tactics to make third-party validators ineffective while keeping your own validators advantaged.

- Publish runnable code and at least minimal documentation so third-party validators can operate independently.

- Do not require validators to interact with owner infrastructure for the core functionality of scoring/weights. Do not fee-gate, role-gate, or otherwise impede validation if the practical effect is owner control.

- Avoid centralized, owner-controlled “weight servers” or “evaluation servers” that determine outcomes off-chain.

- If you believe a narrow exception is justified (e.g., an anti-fraud module), document:
  - what is closed,
  - why it must be closed,
  - what safeguards exist,
  - when it will be opened (or what would change the decision).

### Do not build extractive custody paths

- Do not collude with certain miners so as to turn your subnet into a private emissions pipeline.
- Do not mine your own subnet in a way that undermines fair competition or misrepresents decentralization.
- Do not require miners to redirect emissions to owner-controlled “treasury” accounts.
- Use smart contracts for any additional token interactions in order to keep your accounting transparent and on-chain.

### Avoid discrimination-as-a-bandage

- Avoid restricting miners by coldkey, axon IP, or IP ranges as routine policy.
- Fix the underlying mechanism instead; discrimination is typically easy to evade and often reduces transparency.

### Safety and legality

- Do not enable, tolerate, or monetize harmful/criminal activity (e.g., malware, CSAM, botnets).
- Be cautious about architectures that create legal exposure for participants.

### What to do if your subnet is under review

If your subnet is being discussed for burn-related action, pursue a course of transparency and engagement in order to gain or regain good standing in the community:

- Acknowledge and address specific claims (don’t argue past it).
- Publish evidence and/or a patch (repo, commit, release tag).
- Make validation reproducible (remove “trust me” dependencies).
- Communicate your remediation plans and provide a single place to track progress (issue tracker, forum post).
- Request reevaluation after a substantive code/architecture change.

## Code of Operating Conduct for Validators (acting as 'burn police')

Enforcement of the code of conduct is an open, decentralized process. Publishing process norms helps owners know what to expect and helps validators keep decisions understandable.

### Core principles

- **Consistency**: apply standards evenly; avoid favoritism.
- **Transparency by default**: public rationale and non-ephemeral records where feasible.
- **Evidence over vibes or personal cred**: prefer primary sources and reproducible claims.
- **Due process**: right of reply and time to remediate when appropriate.
- **Proportionality**: “pause and fix” when there is good faith; reserve severe measures for persistent malice/defiance.
- **Conflict-of-interest controls**: disclose material conflicts; abstain where possible.
- **Professional conduct**: no harassment/doxxing; critique designs; avoid defamation.

### Logging

Ideally, log every 'burn police' action with its rationale and a subsequent assessment of the success of the action. For each subnet action (burn / sink / other), publish:

- What norm was implicated (or “under review” if preliminary)
- Evidence links (code, on-chain, public statements)
- Remediation checklist
- Next review trigger (e.g., “major code update shipped”)
- Publish post hoc assessment