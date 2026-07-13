---
title: "Key Permissions in Bittensor"
---

# Key permissions in Bittensor

Every operation in Bittensor falls into one of three permission classes: some require your coldkey private key to sign, some require a hotkey private key, and some require no key at all. Understanding which class an operation belongs to tells you where it is safe to perform it, because each private key should only ever be provisioned to a machine hardened for that key's level of risk.

This page describes the three permission classes, which operations belong to each, and representative `btcli` commands for each group of operations.

See also:

- [Introduction to Wallets, Coldkeys and Hotkeys in Bittensor](./wallets)
- [Coldkey and Hotkey Workstation Security](./coldkey-hotkey-security)
- [Proxies](./proxies/)
- [Managing Your Stakes](../staking-and-delegation/managing-stake-sdk)

## Work environments and security requirements

Interacting with Bittensor generally falls into one of three levels of security, depending on whether you need to use your coldkey private key, hotkey private key, or neither.

The workstations you use to do this work can be referred to as a permissionless workstation, a coldkey workstation, or a hotkey workstation, depending on which private key is provisioned.

1. A **permissionless workstation** has only coldkey _public keys_ on it. Public keys are sufficient for viewing all information about a wallet, such as TAO and alpha stake balances. Information about wallets, subnets, miners, and validators can and should be viewed without initializing your private keys on a device, to avoid the security risk of compromising your keys.

   :::tip permissionless workstation security
   See [Permissionless workstation](./coldkey-hotkey-security#permissionless-workstation)
   :::

1. A **coldkey workstation** contains one or more coldkey private keys in the wallet path. For any coldkey associated with mainnet TAO, the coldkey workstation should be held to the highest possible security standards.

   :::tip coldkey security
   See [Cold custody: hardware wallets](./coldkey-hotkey-security#cold-custody-hardware-wallets)
   :::

1. A **hotkey workstation**, generally a server used for mining or validation, contains a hotkey private key in the wallet path, as well as the public key for the corresponding coldkey. Compromised hotkeys can damage your reputation if they are used maliciously to submit inaccurate weights as a validator, or bad work as a miner. However, ownership of TAO or alpha stake can only be transferred with a coldkey, and a leaked hotkey can be swapped out using the coldkey; therefore hotkey leaks are far less dangerous than coldkey leaks.

   :::tip hotkey workstation security
   See [Hotkey workstation](./coldkey-hotkey-security#hotkey-workstation)
   :::

## Unpermissioned operations

Reading chain state requires no private key. Balances, stake positions, subnet metagraphs, hyperparameters, and identities are all public information, and you should view them without private keys on the device wherever possible.

To set up a watch-only wallet on a permissionless workstation, regenerate just the coldkey public file from the wallet's SS58 address:

```shell
btcli wallet regen-coldkeypub --wallet my-wallet
```

### Querying and monitoring

All read commands work with public keys only:

```shell
btcli wallet balance --wallet my-wallet
btcli subnets show --netuid 14
btcli stake list --wallet my-wallet
```

Other common reads include `btcli wallet overview`, `btcli subnets list`, `btcli subnets hyperparameters` (also available as `btcli sudo get`), `btcli subnets price`, `btcli subnets burn-cost`, `btcli sudo get-take`, `btcli stake child get`, `btcli proxy list`, `btcli lock list`, and `btcli crowd list`.

Every chain read is also exposed under `btcli query <name>` (for example, `btcli query balance`). Run `btcli tools` to print the full machine-readable catalog of reads and transactions, and `btcli explain <code>` to get a long-form explanation of any error code.

### Local utilities and configuration

Commands that never touch the chain, or only read from it, require no key:

```shell
btcli config set network test
btcli utils convert 1000000000 --rao
btcli utils latency
```

The `btcli config` commands set persistent defaults, such as the target network (`finney`, i.e. mainnet, or `test`) and the wallet path. Run them on every workstation to initialize it. Signing transactions also supports `--dry-run` on any transaction command, which previews the fee and effects without submitting anything.

## Operations requiring a hotkey

Hotkeys are used by **miners** and **validators** to sign operational transactions and to authenticate to each other off-chain. Hotkey operations run on the hotkey workstation (the mining or validation server); the coldkey should never be present there.

Miners use the hotkey for:

- Serving requests from validators
- Making on-chain data commitments (if applicable)

Validators use the hotkey for:

- Making signed requests to miners
- Setting weights
- Being discoverable by stakers and miners

### Setting weights

Validators score miners by setting weights. This requires the validator's hotkey, and the validator must hold a validator permit on the subnet; see [Requirements for validation](../validators/#requirements-for-validation).

```shell
btcli weights set --wallet validator --wallet-hotkey default --netuid 14 --uids 0,1,2 --weights 0.5,0.3,0.2
```

`btcli weights set` automatically selects plaintext or commit-reveal submission as appropriate. The lower-level `btcli weights commit` and `btcli weights reveal` remain available for driving the commit-reveal path manually.

### Serving an axon

Miners publish (or clear) the endpoint where validators can reach them:

```shell
btcli axon set --wallet miner --wallet-hotkey default --netuid 14 --ip 203.0.113.10 --port 8091
btcli axon reset --wallet miner --wallet-hotkey default --netuid 14
```

### Message signing and verification

A hotkey (or a coldkey) can sign arbitrary messages, for example to prove control of a key. Verification requires only the signer's public key or SS58 address, so it is unpermissioned:

```shell
btcli wallet sign --wallet miner --wallet-hotkey default --use-hotkey --message "proof of ownership"
btcli wallet verify
```

## Operations requiring a coldkey

Your coldkey is your primary, fully privileged key. It controls all funds and all high-stakes operations, so it should be handled on a maximum security coldkey workstation only, to avoid catastrophic loss or malicious actions if compromised. See [Coldkey and Hotkey Workstation Security](./coldkey-hotkey-security).

### Wallet and key management

Creating or regenerating keys handles seed phrases, which is inherently high risk: anyone who observes a coldkey seed phrase controls the wallet. Create keys on a secure coldkey workstation, and provision hotkeys from there to your mining or validation servers. See [Handle your Seed Phrase/Mnemonic Securely](./handle-seed-phrase).

```shell
btcli wallet create
btcli wallet new-hotkey --wallet my-wallet
btcli wallet regen-coldkey --wallet my-wallet
```

Related commands: `btcli wallet new-coldkey`, `btcli wallet regen-hotkey`, and `btcli wallet associate-hotkey`, which records the hotkey-to-coldkey association on chain (a coldkey-signed transaction).

### Transfers

Moving TAO between coldkeys requires the sending coldkey and sufficient free balance:

```shell
btcli wallet transfer --wallet my-wallet --dest 5DEST... --amount 1.5
```

### Staking and delegation

All stake movements are signed by the coldkey that owns the stake:

```shell
btcli stake add --wallet my-wallet --netuid 14 --amount-tao 10
btcli stake remove --wallet my-wallet --netuid 14 --amount-alpha 5
btcli tx unstake-all --wallet my-wallet --wallet-hotkey default
```

Related commands: `btcli stake move`, `btcli stake transfer`, `btcli stake swap`, the stake-lock commands (`btcli lock add`, `btcli lock mode`, `btcli lock move`), and child hotkey delegation (`btcli stake child set`, `btcli stake child revoke`, `btcli stake child take`).

### Registration

Registering a hotkey on a subnet, so it can mine or validate, is signed by the coldkey and burns the current neuron registration cost in TAO (check it with `btcli subnets burn-cost`). Registering on the root network is a separate transaction:

```shell
btcli subnets register --netuid 14 --wallet miner --wallet-hotkey default
btcli tx root-register --wallet validator --wallet-hotkey default
```

### Subnet creation and management

Creating a subnet requires a coldkey with sufficient balance to cover the creation cost, which is computed dynamically: the price doubles when someone creates a subnet, then gradually decreases. This system is a kind of distributed auction, where price is determined by what people are willing to pay given the uncertain estimation of what others are willing to pay. Check the current cost with `btcli subnets create-cost`.

Managing an existing subnet (hyperparameters, start, identity, mechanisms, trimming, buybacks) requires the subnet owner's coldkey:

```shell
btcli subnets create --wallet owner
btcli sudo set --netuid 14 --name tempo --value 360 --wallet owner
btcli sudo start --netuid 14 --wallet owner
```

Related owner commands: `btcli sudo trim`, `btcli sudo stake-burn`, `btcli sudo set-identity`, `btcli sudo set-symbol`, and the mechanism configuration commands `btcli sudo mechanisms count` and `btcli sudo mechanisms split-emissions`. The corresponding reads (`btcli sudo get`, `btcli sudo check-start`, `btcli sudo get-identity`, `btcli sudo mechanisms emissions`) are unpermissioned.

Setting a validator's delegate take also requires that validator's coldkey:

```shell
btcli sudo set-take --wallet validator --wallet-hotkey default --take 0.09
```

### Identity

Setting an on-chain identity for a coldkey is signed by that coldkey (reading identities is unpermissioned):

```shell
btcli wallet set-identity --wallet my-wallet
```

Subnet identities are set by the subnet owner with `btcli sudo set-identity`.

### Key swaps

The coldkey is the recovery mechanism for the whole wallet. If a hotkey leaks, the owning coldkey can swap it for a fresh one without losing registration. If the coldkey itself may have leaked, announce and execute a coldkey swap to move everything to a new coldkey:

```shell
btcli wallet swap-hotkey --wallet my-wallet
btcli wallet announce-coldkey-swap --wallet my-wallet
btcli wallet swap-coldkey --wallet my-wallet
```

`btcli wallet swap-check` shows whether a coldkey has a pending swap announcement (unpermissioned). See [Rotate/Swap your Coldkey](./coldkey-swap).

### Crowdloans

Crowdloan reads (`btcli crowd list`, `btcli crowd info`, `btcli crowd contributors`) are unpermissioned. Creating, contributing to, or otherwise mutating a crowdloan spends or moves TAO and is signed by the coldkey, via `btcli tx`:

```shell
btcli tx create-crowdloan --wallet my-wallet
btcli tx contribute-crowdloan --wallet my-wallet
```

## Other requirements

Beyond holding the right key, some operations have additional requirements:

- **Available liquidity**: Transfers of TAO fail if you lack the specified amount. Staking and unstaking operations fail if they specify more than the owner has. Registering a hotkey on a subnet requires paying the current neuron registration burn in TAO, and creating a subnet requires paying the current subnet creation cost.
- **Validator permit**: To set weights, a validator must meet several requirements. See [Requirements for validation](../validators/#requirements-for-validation).

## Delegating authority with proxies

Proxies let you delegate scoped authority from a coldkey to another account, so that day-to-day operations (such as staking) can be performed without exposing the primary coldkey. Managing proxy relationships is itself a coldkey operation:

- **`btcli proxy add`** authorizes a delegate account to perform specific classes of operations on behalf of the real account (requires the real account's coldkey).
- **`btcli proxy remove`** revokes a delegate's permissions (requires the real account's coldkey).
- **`btcli proxy create`** creates a new pure proxy account: a keyless account that can only be controlled through the proxy relationship (requires the spawner's coldkey).
- **`btcli proxy kill`** permanently destroys a pure proxy account. **Warning**: all funds in the pure proxy will be permanently lost (requires the spawner's coldkey).
- **`btcli proxy execute`** executes a previously announced proxy call after the delay period has passed; used with delayed proxies (non-zero delay).
- **`btcli proxy list`** shows an account's on-chain proxy delegations (unpermissioned).

Transaction commands accept `--proxy-for` to dispatch through a proxy relationship, taking either the real account's SS58 address or a name from your local proxy book:

```shell
btcli stake add --wallet delegate --netuid 14 --amount-tao 10 --proxy-for my-staking-proxy
```

The local proxy book (`btcli proxy book add`, `btcli proxy book list`, `btcli proxy book remove`) stores named proxy entries on your workstation; it is purely local and does not affect on-chain state.

For recommended proxy configurations and lifecycle management, see [Proxies](./proxies/) and [Using BTCLI and the SDK with proxy coldkeys](./coldkey-hotkey-security#using-btcli-and-the-sdk-with-proxy-coldkeys).
