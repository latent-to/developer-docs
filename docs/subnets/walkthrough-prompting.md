---
title: "Walkthrough of Example Subnet"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Walkthrough of Example Subnet

This page presents a high-level walkthrough of an example architecture for a subnet based on LLM inference. This architecture was originally based on [Subnet 1, Apex](https://github.com/opentensor/prompting/tree/main), although subnets rapidly evolve and that subnet now has a more complicated architecture. This example subnet contains several incentive mechanisms which produce conversational intelligence capable of:

- Answering questions.
- Summarizing a given text.
- Debugging code. 
- Translating languages.
- Solve mathematics problems, and more.

Our example subnet is driven by large language models (LLMs). These LLMs search the internet and utilize specialized simulator modules to produce factually accurate and mathematically correct responses. 

:::tip Explore the Subnets
Browse tokenomic information about the subnets on [TAO.app](https://tao.app), and learn more about the projects and services they support on the [Learnbittensor.org subnet listings](https://learnbittensor.org/subnets).
:::

**Prerequisites**

If you are new to Bittensor subnets and building blocks, read the following sections before you proceed further:

- [Understanding Neurons](../learn/neurons).
- [Anatomy of Incentive Mechanism](../learn/anatomy-of-incentive-mechanism).

The below diagram shows a typical subnet with many miners and validators together executing the incentive mechanism code. On the [TAO.app explorer](https://tao.app) the **Metagraph** view within a subnet's page shows the performance details for each subnet miner and validator. For example, visit [tao.app/subnets/14?active_tab=metagraph](https://www.tao.app/subnets/14?active_tab=metagraph) to view subnet 14's metagraph.

<center id="bittensor-img">
<ThemedImage
alt="Example Subnet Walkthrough"
sources={{
    light: useBaseUrl('/img/docs/1-prompting-subnet-walkthrough.svg'),
    dark: useBaseUrl('/img/docs/dark-1-prompting-subnet-walkthrough.svg'),
  }}
style={{width: 600}}
/>
</center>

## Subnet Summary

See the below diagram showing a high-level view of how an example subnet works. 

<center>
<ThemedImage
alt="Example Subnet High-Level View"
sources={{
    light: useBaseUrl('/img/docs/2-prompting-subnet-high-level.svg'),
    dark: useBaseUrl('/img/docs/dark-2-prompting-subnet-high-level.svg'),
  }}
style={{width: 750}}
/>
</center>

The numbered items in the below description correspond to the numbered sections in the above diagram:

1. The subnet validator sends a **challenge** simultaneously to multiple miners. This step constitutes the **prompt** from the subnet validator to miners. A challenge is a prompt sent to miners in such a way that:
   - This prompt is in a style and tone that is similar to humans. This is so that miners become adept at handling "fuzzy" instructions with ambiguity. This is required in order to excel at understanding user needs.
   - This prompt drives the conversation between the subnet validator and the miners in order to reach a pre-defined goal. 

    See the below [Challenge generation](#challenge-generation) section for how a challenge is generated. 
2. The miners respond to the subnet validator after performing the challenge **task**. Most tasks require miners to make use of APIs or tools to perform well.
3. The subnet validator then **scores** each subnet miner by comparing the subnet miner's response with a locally generated **reference** answer. The subnet validator uses this reference as the ground truth for this step. The reference is generated using data from APIs and tools to ensure factual correctness and to provide citations.
4. Finally, the subnet validator **sets the weights** for the miners by sending the weights to the blockchain. In the Bittensor blockchain the Yuma Consensus allocates emissions to the participating miners and Validators. 

:::tip Use of large language models 
In this subnet both the subnet validator and the miners use large language models (LLMs) to create the challenges (subnet validator) and respond to the prompts  miners).
:::

## Challenge generation

<center>
<ThemedImage
alt="Example Subnet"
sources={{
    light: useBaseUrl('/img/docs/3-prompting-subnet1-key-innovation.svg'),
    dark: useBaseUrl('/img/docs/dark-3-prompting-subnet1-key-innovation.svg'),
  }}
style={{width: 600}}
/>
</center>


- The subnet validator generates a **prompt** consisting of a clearly stated question or a task description, for a given task type. 
- The subnet validator also generates one or more **reference** answers to the above prompt. The subnet validator also provides the context to generate this reference answer.
- A requirement for this example subnet is that the entire conversation should be human-like. To accomplish this, the subnet validator takes on a human persona and wraps the above prompt in the persona's style and tone. The introduction of such random persona's style and tone creates a lossy, corrupted, version of the original clear instruction. This corrupted prompt is called a **challenge**. 
- The subnet validator prompts the miners with this challenge. Note that the **reference** is not sent to the miners.

## Scoring the miners' responses

The responses from the miners are compared to the reference answers by the subnet validator. The closer a subnet miner's response is to the reference answer, the higher is the subnet miner's score. 

:::tip Measuring subnet miner's response
This example subnet uses a combination of string literal similarity and semantic similarity as the basis for measuring the closeness of a subnet miner's response to the reference answer. 
:::

## Key subnet features

This subnet demonstrates several design features that favor actually producing intelligence instead of copying from the internet. Refer to the diagram in the above [Challenge generation](#challenge-generation) section:

### Achieving human-like conversation

To deliver to a user of this subnet an experience of a human-like conversation:

- Validators perform a roleplay where they take on the persona of **random** human users before they prompt the miners. There are several tangible benefits to this role playing flow, such as: 
  - Validators can engage the miners in a real, random, human-like conversation throughout the subnet operation.
  - Miners become adept at handling ambiguous instructions.
  - This generates, as a byproduct, interesting synthetic datasets that can be used to finetune other LLMs.
- Miners are required to produce completions that are as close as possible to the reference. To accomplish this a subnet miner must:
  - Extract clear instruction from the lossy challenge.
  - Find the appropriate context, for example, using Wikipedia. 
  - Generate a completion that matches the tone and style of the reference.
- This means that throughout the subnet validation process the miners become better and better at handling ambiguous, "fuzzy" instructions. 
- A subnet validator could increase the corruption of the instruction to increase the difficulty of the tasks.
- To change the subnet miner completions, a subnet validator may modify the style and tone of the reference answers or change the scoring function, or both.

### Prevent miners from looking up the answers

To prevent the miners from simply looking up the answers on the internet, this subnet introduces fuzziness into the prompt and requires that the miners use semantic intelligence to understand the instructions contained in the prompt.

### Evolve subnet as a mixture of experts (MoE)

The subnet validator composes a challenge based on whether the task is answering questions, summarizing a given text, debugging code, solve mathematics problems, and so on. The motivation behind using multiple tasks is several fold:

- Using multiple tasks in the prompts continuously benchmarks the capabilities of the miners across a broad range of tasks that are challenging but are still common use-cases. 
- Using multiple tasks, prompts can be routed to specialized miners, thereby providing an effective mixture of experts system.
- Finally, the miners in this subnet must become adept at using tools and APIs in order to fulfill validation tasks. We are building an API layer for inter-subnet communication, which is a natural extension of 'agentic' models.

:::tip Continuously improving performance
This example subnet is designed to achieve full coverage of the distributions across different personas (representing different users), and different tasks (representing different use-cases). See the arXiv paper [Super-Natural Instructions](https://arxiv.org/abs/2204.07705) [(PDF)](https://arxiv.org/pdf/2204.07705.pdf).
:::


