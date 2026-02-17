---
title: "Subnet Code of Conduct (Draft)"
---

# Subnet Code of Conduct (Draft)

This page discusses Bittensor's *unofficial* code of conduct for subnet owners, which is enforced by validators. Historically, norms of conduct have been enforced through the mechanism of burning the subnet's emissions by submitting a weight matrix that gives all weight to the subnet owner's own key, rather than actual miners. This triggers the emissions algorithm to burn those alpha emissions, **not** to send them to the subnet owner.

Currently, additional mechanisms for validators to limit the impact of suspected bad actor subnets, and to punish them tokenomically, are being researched for eventual inclusion in the protocol.

Bittensor's validators strive to uphold norms of conduct because they are seen as critical to keep Bittensor aligned with its design intent as a platform for funding the creation of digital commodities.

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

- Publish runnable code and at adequate documentation so third-party validators can operate independently.
- Do not require validators to interact with owner infrastructure for the core functionality of scoring/weights. Do not fee-gate, role-gate, or otherwise impede validation if the practical effect is owner control.
- Avoid centralized, owner-controlled “weight servers” or “evaluation servers” that determine outcomes off-chain.
- Do not use hyperparameter manipulation or other tactics to make third-party validators ineffective while keeping your own validators advantaged.

- If you believe any exception to the above is justified, avoid trouble by pre-emptively documenting:
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

Validators' readiness to participate as 'burn police' is critical to Bittensor's tokenomic health. If bad-actor subnets are not quickly halted, they can potentially drain significant liquidity, gaining a foothold for making further trouble and harming the public trust of TAO through pump and dump schemes that add no value. If validators display consistent, decisive responsiveness, bad actors will lose, potential bad actors will be deterred, and such attacks will remain rare.

### Transparency/Documentation

In order to maintain public trust in this critical function, burn police actions should be made transparent. Published documentation should include the evidence used to assess the sitiuation and the time-table of events, including a retroactive assessment after the situation has concluded. These records should be publicly archived.

### Communication/Warnings

Except in rare, exceptional, emergency cases, punitive actions should be proceeded by warnings, dialogue, and clear communication of what is required to bring the subnet into compliance. Without communicating these requirements prior to the sanction, the subnet owner cannot be expected to comply, and punitive actions will be seen as bullying or piratical, by the recipient as well as potentially by the community. Prompt, unambiguous, highly visible communication is the key.

Unless a subnet owner's intent is clearly malicious, it be preferred to achieve compliance through communication and negotion *without needing to exercise the burn or other punishment*.

### Fairness

Standards of conduct must be applied consistently and without bias, or public trust in Bittensor, and correlatively the value of TAO, will be eroded.

Sanctions and scrutiny should be applied based on the subnet design rather than ad hominem factors. Validators should not excuse subnets based on personal relationships; standards for exceptions, and for subnets to make transparent the rationale for any exceptions, must be applied without favoritism or secrecy.

Material conflicts of interest between validators and subnets should be avoided and stated clearly when necessary.

