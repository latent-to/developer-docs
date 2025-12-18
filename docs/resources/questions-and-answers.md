---
title: "Frequently asked questions (FAQ)"
hide_table_of_contents: false
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { HiAcademicCap } from "react-icons/hi2";
import { MdInstallDesktop } from "react-icons/md";
import { FaNetworkWired } from "react-icons/fa";
import { GiMining } from "react-icons/gi";
import { GrValidate } from "react-icons/gr";
import { MdOutlineChecklistRtl } from "react-icons/md";
import { GiArchiveRegister } from "react-icons/gi";
import { BiMath } from "react-icons/bi";
import { RiTeamLine } from "react-icons/ri";
import { RiGovernmentLine } from "react-icons/ri";
import { FaGalacticSenate } from "react-icons/fa";
import { GiStarFormation } from "react-icons/gi";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { VscSymbolParameter } from "react-icons/vsc";
import { GoCommandPalette } from "react-icons/go";
import { FaPython } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa";
import { SiFuturelearn } from "react-icons/si";
import { GoNumber } from "react-icons/go";
import { VscFileMedia } from "react-icons/vsc";

# Frequently asked questions (FAQ)

## Resources and Learning

### Where can I find beginner-friendly resources for learning about Bittensor?

[LearnBittensor.org](https://learnbittensor.org) offers introductory guides, subnet listings, and curated learning paths to help you get started with the Bittensor ecosystem.

### Is there an AI assistant that can help me search the docs?

Yes! [TAO.app Savant](https://www.tao.app/savant) is an AI assistant integrated with the Bittensor documentation. It offers a convenient way to search the docs and also provides up-to-the-moment tokenomic data, including subnet token prices, emissions, and network statistics.

### Where can I see live data about subnets and tokens?

Browse tokenomic information about the subnets on [TAO.app](https://tao.app), and learn more about the projects and services they support on the [LearnBittensor.org subnet listings](https://learnbittensor.org/subnets).

---

## General

### Is Bittensor a blockchain or an AI platform?

It is both!

Bittensor is a platform for the production of digital commodities, including AI inference, training, and infrastructure, as well as others unrelated to artificial intelligence.

Bittensor is backed by its own substrate blockchain, Subtensor. The distributed ledger of the Bittensor main network serves as the system of record, and TAO, Bittensor's cryptocurrency token, serves to incentivize activity across the platform.

### So what is a subnet?

A subnet is a community that produces a digital commodity in a competitive market, with Bittensor keeping track of and incentivizing the activities required for this production.

Anyone with the funds and technical know-how can create a subnet, or participate in an existing subnet.

Each subnet has its own token, called its **alpha** token. When you stake into a subnet, you exchange TAO for that subnet's alpha. The alpha token's value fluctuates based on the subnet's performance and market activity.

### How does competition work in a subnet?

The work to be performed by miners is set by the subnet creator in the form of the subnet's incentive mechanism. The miners compete to best perform the task, submitting their work to the validators.

The validators then rank the quality of the work done by the miners within the subnet. The aggregated scores of the validators determine the quantity of emissions to each miner.

At the same time, validators are also incentivized to do their best work, because their emissions depend on how well their miner scorings agree with the general consensus of other validators.

### What exactly is the task of a subnet miner?

The task of miners is different in each subnet. Some subnets provide AI services like specialized inference, training, or prediction. Others provide infrastructure as a service, including storage or compute.

### So where does the blockchain come in?

The blockchain records all the key activity of the subnets in its ledger. It also continuously runs an algorithm called Yuma Consensus (YC). YC takes in rankings of the subnet's miners by the subnet's validators, and computes the emissions to miners, validators, stakers, and subnet creators.

### Do subnets talk to each other?

A new abstract base class, called `SubnetsAPI` is released in Bittensor `6.8.0` and your application can use this to enable cross subnet communication. Normally, however, if you are not using the `SubnetsAPI`, then the subtensor blockchain does not mix data from one subnet with another subnet data and a subnet does not communicate with another subnet.

:::tip See also
See [Bittensor Subnets API](https://github.com/opentensor/bittensor/blob/master/README.md#bittensor-subnets-api).
:::

---

## Staking and Alpha Tokens

### How does staking work?

You stake to a validator on a specific subnet. This can be either a mining subnet (most subnets) or the unique root subnet, a.k.a. Subnet Zero.

- When you stake on a mining subnet, you exchange TAO for the subnet's alpha token, and stake that into the validator's hotkey.
- When you stake on the root subnet, you stake TAO for TAO. Your emissions are TAO.

### What is the risk/reward profile of staking into a subnet?

Each subnet has its own alpha token. When you stake into a validator within a given subnet, you exchange TAO for that subnet's alpha. When you unstake from the validator in that subnet, you exchange the alpha for TAO. Staking and unstaking is therefore sensitive to the price of the alpha. This price is the ratio of TAO in the subnet's reserve to alpha in reserve.

Held stake (alpha tokens) may increase or decrease in TAO value as the price of the alpha changes.

### What is the Root Subnet (Subnet Zero)?

Subnet Zero (the root subnet) is a special subnet. No miners can register on Subnet Zero, and no validation work is performed. However, validators can register, and TAO-holders can stake to those validators, as with any other subnet.

This offers a mechanism for TAO-holders to stake TAO into validators in a subnet-agnostic way. This works because the weight of a validator in a subnet includes both their share of that subnet's alpha and their share of staked TAO in Subnet Zero.

### How do emissions to root subnet stakers work?

**Network-wide Impact**: Your stake contributes weight across all subnets where your validator operates. This means your stake extracts emissions from multiple subnets simultaneously. See [Validator stake weight](../subnets/understanding-subnets.md#validator-stake-weight) for more details.

**Proportional emission and TAO weight**: TAO and alpha are emitted to a validator's stakers in proportion to the validators' holdings in each token. See [Emission: Extraction](../learn/emissions.md#extraction).

### What are root claims?

When you stake TAO on the root subnet, you receive alpha emissions from all subnets where your validator operates. Root claims let you control what happens to these alpha emissions:

- **Swap** (default): Alpha is automatically swapped to TAO and added to your root stake.
- **Keep**: Alpha is kept as alpha tokens (staked on the respective subnets).
- **KeepSubnets**: Keep alpha for specific subnets only; swap the rest to TAO.

See [Managing Root Claims](../staking-and-delegation/root-claims/managing-root-claims.md).

### Can users transfer alpha tokens (subnet tokens)?

It is up to the subnet creator, and is configured using the `TransferToggle` hyperparameter.

When enabled, a holder of alpha stake can transfer its ownership to another coldkey/wallet using [`btcli stake transfer`](../staking-and-delegation/managing-stake-btcli#transferring-stake) or [`transfer_stake`](pathname:///python-api/html/autoapi/bittensor/core/async_subtensor/index.html#bittensor.core.async_subtensor.AsyncSubtensor.transfer_stake).

### Will there be a cap on alpha tokens?

Yes. There is a hard cap of 21 million for any subnet's alpha token, the same as for TAO itself. Alpha tokens follow a halving schedule as well.

---

## Security Features

### What security options are available to protect my wallet?

Bittensor offers several advanced security features:

1. **Proxies**: Allow one wallet to perform operations on behalf of another, so you can keep your main coldkey in secure cold storage.
2. **MEV Shield**: Encrypts transactions to protect against front-running attacks.
3. **Multi-signature wallets**: Require multiple parties to approve transactions.
4. **Time-locked delays**: Require announcements before high-value operations can execute.

### What are proxies and how do they work?

Proxies allow one wallet to perform Bittensor operations on behalf of another. This adds a security layer by letting you keep your most valuable coldkeys in cold storage while using a less-protected proxy wallet for day-to-day operations.

Key features:
- **Permission scoping**: Use `ProxyType` to limit what the proxy can do (e.g., staking-only, transfer-only).
- **Time-lock delays**: Require the proxy to announce actions in advance, giving you time to reject unauthorized operations.
- **Revocable access**: The real account can revoke proxy access at any time.

See [Proxies Overview](../keys/proxies/index.md).

### What is MEV Shield?

MEV (Maximal Extractable Value) Shield encrypts your transactions to protect them from front-running and other MEV attacks. When MEV Shield is enabled:

1. Your transaction is encrypted before entering the mempool.
2. Validators cannot see the transaction details until after it's included in a block.
3. The transaction is decrypted and executed, preventing attackers from profiting by seeing your pending transactions.

You can enable MEV Shield on a per-transaction basis (`mev_protection=True`) or globally via the `BT_MEV_PROTECTION` environment variable.

See [MEV Shield](../sdk/mev-protection.md).

### What is a multi-signature wallet?

A multi-signature (multi-sig) wallet requires multiple parties to approve a transaction before it can be executed. This is useful for organizations, DAOs, or anyone who wants to distribute control over funds.

See [Multi-sig Wallets](../keys/multisig.md).

### How should I secure my coldkey?

Best practices for coldkey security:

1. **Use cold storage**: Keep your coldkey seed phrase offline, ideally on a hardware device or paper backup stored securely.
2. **Set up a proxy**: Use a proxy for daily operations so your coldkey rarely needs to be accessed.
3. **Consider multi-sig**: For high-value wallets, require multiple approvals for transactions.
4. **Use MEV Shield**: Protect sensitive transactions from front-running.
5. **Use a dedicated workstation**: Access your coldkey only from a secure, dedicated machine.

See [Coldkey and Hotkey Security](../keys/coldkey-hotkey-security.md).

---

## Mining and Validation

### Is mining and validation in Bittensor the same as in Bitcoin?

No, there are some key differences! Bitcoin miners work to validate blocks according to Proof of Work consensus so they can be added to the blockchain.

In Bittensor, "mining", within subnets, has nothing to do with adding blocks to the chain. Instead, it has to do with production of digital commodities. Similarly, "validation", within subnets, has nothing to do with validating blocks—it concerns validating the work performed by miners.

### So is there a separate blockchain validation on Bittensor?

Yes indeed. In Bittensor, the work of validating the blockchain is performed by the Opentensor Foundation on a Proof-of-Authority model.

### What is the incentive to be a miner or a validator, or create a subnet?

Bittensor incentivizes participation through emission of TAO. Each day, 7200 TAO are emitted into the network (one TAO every 12 seconds).

The emission of TAO within each subnet is as follows:

- 18% to the subnet creator.
- 41% to validators
- 41% to the miners

See [Emissions](../learn/emissions.md).

### I don't want to create a subnet, can I just be a miner or a validator?

Yes! Most participants will not create their own subnets, there are lots to choose from.

See:

- [Validating in Bittensor](../validators/index.md)
- [Mining in Bittensor](../miners/index.md).

### Is there a central place where I can see compute requirements for mining and validating for all subnets?

Unfortunately no. Subnets are not run or managed by Opentensor Foundation, and the landscape of subnets is constantly evolving.

Browse the subnets at [TAO.app](https://tao.app), or on [Discord](https://discord.com/channels/799672011265015819/830068283314929684).

### Can I be a subnet miner or a subnet validator forever?

You can keep trying forever, but your success depends on your performance. Mining and validating in a subnet is competitive. If a miner or validator is one of the three lowest in the subnet, it may be de-registered at the end of the tempo, and have to register again.

See [miner deregistration](../miners/index.md#miner-deregistration).

### What is auto-staking for miners?

Miners can automatically stake their mining income to a validator of their choice. This reduces sell pressure and allows miners to compound their earnings without manual intervention.

See [Auto-staking](../miners/autostaking.md).

---

## Creating and Managing Subnets

### What will it take to start and manage a subnet?

You register a subnet by burning TAO (the registration cost). Once registered, you configure the subnet's incentive mechanism and hyperparameters.

### What is the cost of creating a subnet?

Subnet registration cost is dynamic. It doubles when a subnet is registered, and decreases at a slow rate such that the price halves after 38,880 blocks—roughly five and a half days. This implies that, if the demand for new subnets is steady, one should be created roughly every five and a half days.

### How do subnet owners control governance (weight-setting)?

Each validator's weight in the subnet is a function of the alpha staked to them on the subnet, plus the TAO staked to them in Subnet Zero, with the value of the TAO being multiplied by the TAO weight, which is between 0 and 1.

See [validator stake weight](../subnets/understanding-subnets.md#validator-stake-weight).

### Do subnet creators control emissions for their own tokens?

**No**. Emissions are calculated by protocol logic (e.g., in `run_coinbase.rs`) and are based on network-wide parameters. Subnet founders cannot arbitrarily print tokens—emission follows the same consistent rules across all subnets.

See [Emissions](../learn/emissions.md).

### What happens when a subnet is abandoned?

If no participants use or mine a subnet, its token will likely drop to negligible value. Other subnets and the root remain unaffected. Each subnet's success or failure is largely self-contained.

:::note
Subnets can be deregistered when the 128-subnet limit is reached and a new subnet attempts to register. The subnet with the lowest EMA price (among those past their 4-month immunity period) is deregistered. Alpha holders receive their proportional share of the subnet's TAO pool.

See [Subnet Deregistration](../subnets/subnet-deregistration.md).
:::

---

## Governance

### How does governance work in Bittensor?

Bittensor uses on-chain governance with proposals and voting by the Senate (comprised of the top validators).

See [Governance](../governance/governance.md).

---

## Technical Details

### Where can I find more technical details?

- **Codebase**: Refer to the Bittensor codebase, especially `run_coinbase.rs`, which calculates emissions logic for subnets and the root network.
- **SDK Documentation**: See the [Bittensor SDK](../sdk/index.md) for Python API reference.
- **AI Assistant**: Use [TAO.app Savant](https://www.tao.app/savant) to search the docs with AI assistance.
