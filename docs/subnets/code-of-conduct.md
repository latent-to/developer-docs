---
title: "Subnet Code of Conduct (Draft)"
---

# Subnet Code of Conduct (Draft)

This page gives an overview of Bittensor's unofficial code of conduct for subnet owners. 

Throughout the history of Bittensor, norms of conduct have been enforced **by validators** through the mechanism of [burning](../resources/glossary.md#burning) the subnet's miner incentives. This is triggered by validators submitting a weight matrix that gives all weight to the subnet owner's own key, rather than actual miners--resulting in the incentives being burned (not received by the subnet owner). Coordinated burning of mining emissions has been, and will continue to be, a critical means to limit the economic impact of subnets acting in ways that are malicious, irresponsible, or otherwise harmful to the network and community. It must also serve to deter attempts to cheat the Bittensor community through Ponzi schemes and other scams, by demonstrating that such attempts are bound to fail.

Currently, additional mechanisms for validators to limit the impact of suspected bad actor subnets, and to punish them tokenomically, are being researched for eventual inclusion in the protocol.

See also:

- [Why Burn](https://github.com/bittensor-church/bittensor-why-burn/blob/master/README.md): Maintained by the Bittensor community organization Church of Rao, this living document contains detailed discussions of specific rules and consequences.

- To report a subnet for suspected violations: **TBD (forum, GitHub issues, or form—to be determined).**

## The nature of distributed policing by validators

Bittensor is a distributed incentivization engine. It is based on the idea that  that, in a well-organized, trustless, system, agents pursuing their own selfish interests can converge on a kind of productive cooperation. Bittensor's validators strive to uphold norms of conduct that are seen as critical to keep Bittensor aligned with its design intent as a platform for funding the creation of digital commodities. How can be validators be trust to act in the interest of Bittensor overall?

Validators' power comes from two sources: held stake and delegated stake, which combine into [stake-weight](../resources/glossary.md#stake-weight), the metric that [Yuma Consensus](../learn/yuma-consensus.md) uses to weight validator inputs when computing emissions. As a result, validators by their nature are invested in enforcing good behavior by subnet owners for two reasons:

1) Because validation is lucarative and can be achieved either by self-funding or by finding delegated stake, validators by their nature tend to hold and accumulate large amounts of liquidity. As a result, they are invested in the overall health of the Bittensor ecosystem, if only for the selfish reason that they want the open-market value of their token holdings to increase. Overall health in this sense means that Bittensor is fulfillings its mission of producing best-in-class digital commodities. Scammy, unstable, and vacuous subnets that result in failed investments for their stakers lower the value of all token holdings. By design, validators are in a position ot represent an interest in the long-term, overall value of the Bittensor ecosystem.

2) To the extent that a validator maintains their stake-weight through delegated stake, their power as a validator is contingent on maintaining the trust of the community that delegates to them. If a validator loses delegated stake they depend on, they lose their lucrative, powerful position as validator. Therefore, if stakers efficiently prefer delegating to validators that participate in good faith in policing actions, then validators must police subnets.

:::note
If enough validators by stake-weight opt to participate in a burn action, the other validators will have to follow suit otherwise they will fall out of consensus and lose emissions. This ensures that not all validators have to be motivated to police, since they can be economically induced to go along with policing actions provided sufficient validators by stake-weight are participating in good faith.
:::

## Purpose of the Subnet Code of Conduct

The rules and their enforcement aim to:

- Reduce incentives for extractive behavior (emissions capture without meaningful product or good-faith participation).
- Discourage unnecessary centralization (single points of failure, privileged control paths).
- Protect miners/validators/holders from fraudulent, coercive, or unsafe subnet practices.
- Provide a predictable, appealable path to remediation when problems are found.

:::note
This is not an “official law code”. Burn outcomes are ultimately the result of validators' independent decisions. Validators gain their roles by the stake delegated to them by the Bittensor community, and do not have any other authority.

**Stakers are the meta-layer.** Validators are responsible for serving their own interests and the interests of the community, but they are ultimately subject to what stakers want. Stakers keep validators honest by choosing where to delegate; validators who fail to uphold norms can lose stake to those who do. This tiered, distributed responsibility — stakers → validators → subnet owners — is what makes the system work. If you do not like how validators are enforcing these norms, move your stake.
:::

## Subnet Owner Responsibilities

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

## Code of Operating Conduct for Validators

Validators' readiness to participate as 'burn police' is critical to Bittensor's tokenomic health. If bad-actor subnets are not quickly halted, they can potentially drain significant liquidity, gaining a foothold for making further trouble and harming the public trust of TAO through pump and dump schemes that add no value. If validators display consistent, decisive responsiveness, bad actors will lose, potential bad actors will be deterred, and such attacks will remain rare.

### Transparency/Documentation

In order to maintain public trust in this critical function, punitive actions must be communicated clearly. Published documentation should include the evidence used to assess the situation and the time-table of events, including a retroactive assessment after the situation has concluded. These records should be publicly archived.

### Communication/Warnings

Except in rare, exceptional, emergency cases, punitive actions should be preceded by warnings, dialogue, and clear communication of what is required to bring the subnet into compliance. Without communicating these requirements prior to the sanction, the subnet owner cannot be expected to comply, and punitive actions will be seen as bullying or piratical, by the recipient as well as potentially by the community. Prompt, unambiguous, highly visible communication is the key.

Unless a subnet owner's intent is clearly malicious, it should be preferred to achieve compliance through communication and negotiation *without needing to exercise the burn or other punishment*.

### Fairness

Standards of conduct must be applied consistently and without bias, or public trust in Bittensor, and correlatively the value of TAO, will be eroded.

Sanctions and scrutiny should be applied based on the subnet design rather than ad hominem factors. Validators should not excuse subnets based on personal relationships; standards for exceptions, and for subnets to make transparent the rationale for any exceptions, must be applied without favoritism or secrecy.

Material conflicts of interest between validators and subnets should be avoided and stated clearly when necessary.

