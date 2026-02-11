---
title: "Bittensor CLI: Permissions Guide"
---

The Bittensor CLI, `btcli` provides a wide range of functionality, and has a range of different requirements for various commands: some require a coldkey private key to authenticate, some require a hotkey private key, and some require neither. Additionally, different functions require different levels of permissions. Some require the user to have special status like being registered with a node, have a validator permit, or be an active member of the senate.

This page details the requirements for all of the `btcli` commands.

See also the `btcli` permissions guides for specific Bittensor personas:

- [Staker's Guide to `BTCLI`](../staking-and-delegation/stakers-btcli-guide)
- [Miner's Guide to `BTCLI`](../miners/miners-btcli-guide)
- [Validator's Guide to `BTCLI`](../validators/validators-btcli-guide)
- [Subnet Creator's Guide to `BTCLI`](../subnets/subnet-creators-btcli-guide)
- [Senator's Guide to `BTCLI`](../governance/senators-btcli-guide)

Other resources:

- [Introduction to Wallets, Coldkeys and Hotkeys in Bittensor](../keys/wallets)
- [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security)

## Bittensor work environments and security requirements

Interacting with Bittensor generally falls into one of three levels of security, depending on whether you need to use your coldkey private key, hotkey private key, or neither.

The workstations you use to do this work can be referred to as a permissionless workstation (requiring neither private key), a coldkey workstation or a hotkey workstation, depending on which private key is provisioned.

1. A **permissionless workstation** has only coldkey _public keys_ on it. Public keys are sufficient for viewing all information about a wallet, such as TAO and alpha stake balances. Information about wallets, subnets, miners, and validators can and should be viewed without initializing your private keys on a device, to avoid the security risk of compromising your keys.

   :::tip coldkey workstation security
   See [Permissionless workstation](../keys/coldkey-hotkey-security#permissionless-workstation)
   :::

1. A **coldkey workstation** contains one or more coldkey private key in the `wallet_path`. For any coldkey associated with mainnet TAO, the coldkey workstation should be held to the highest possible security standards.

   :::tip coldkey workstation security
   See [Coldkey workstation](../keys/coldkey-hotkey-security#coldkey-workstation)
   :::

1. **A hotkey workstation**—which is generally a server used for mining or validation—contains a hotkey private key in the `wallet_path` located in the `btcli config`, as well as a coldkey public key for the corresponding coldkey. Compromised hotkeys can damage your reputation if they are used to maliciously to submit inaccurate weights as a validator, or bad work as a miner. However, ownership of TAO or alpha stake can only be transferred with a coldkey, and a leaked hotkey can be swapped using the coldkey; therefore hotkey leaks are far less dangerous than coldkey leaks.

   :::tip hotkey workstation
   See [Hotkey workstation security](../keys/coldkey-hotkey-security#hotkey-workstation)
   :::

## Requirements for `btcli` functions

### Coldkey

Your coldkey is your primary, fully privileged key; important for all users. This key should be handled on a maximum security **coldkey workstation** only, to avoid catastrophic loss or malicious actions if compromised.

See [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security).

Required for:

- Moving and transferring TAO
- Managing stake (add/remove/move)
- Creating hotkeys
- Registering hotkeys in subnets
- Creating and modifying subnets
- Participating in governance of Bittensor as a senator

### Hotkey

Hotkeys are used by **miners** and **validators** to sign transactions, and are required for governance.

Required for:

- Running miners:
  - Serving requests from validators
  - Making on-chain data commitments (if applicable)
- Running validators:
  - making signed requests to miners
  - setting weights
  - being discoverable by stakers and miners

### Available liquidity

Some operations require a TAO balance or alpha stake balance to execute.

- Transfers of TAO fail if you lack the specified amount
- Staking and unstaking operations fail if they specify more than the owner has
- Registering a hotkey on a subnet to mine or validate has a fee that can be paid with TAO or proof-of-work.
- Creating a subnet requires a fee, which is computed dynamically. The price to create a subnet doubles when someone creates a subnet, and then gradually decreases. This system is designed as a kind of distributed auction, where price is determined by what people are willing to pay given the uncertain estimation of what others are willing to pay.

### Validator Permit

To set weights, a validator must meet several requirements. See [Requirements for validation](../validators/#requirements-for-validation).

### Senate requirements

See [Senate: Requirements](../governance/senate#requirements)

## `btcli` commands

### `config`

The `btcli config ...` commands are used to configure `btcli`, including:

- selecting the targeted network (`finney` a.k.a. mainnet or `test` for test network)
- setting the directory where your Bittensor wallet coldkeys and/or hotkeys are stored

These commands don't require any permissions to run. Rather, you run these commands on all `btcli` workstations to initialize them.

See: [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security)

<details>
  <summary>btcli config</summary>

- `btcli config set`
- `btcli config get`
- `btcli config clear`
- `btcli config metagraph`
- `btcli config add-proxy`
- `btcli config proxies`
- `btcli config remove-proxy`
- `btcli config update-proxy`
- `btcli config clear-proxy`
</details>

### `wallet`

`wallet` subcommands have a variety of uses and must be run on all different kinds of workstation.

The `wallet` command is required to provision keys to `btcli`, so it can access your wallet. This is essentially the equivalent of logging in/authentication. This is true for both coldkeys, which all users require, and hotkeys, which are required only by miners and validators as well as for advanced functions.

:::tip mind your keys
See: [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security)
:::

#### Provisioning keys

1. **`btcli wallet regen-coldkeypub`**: This initializes a wallet for a **permissionless workstation** with a public key only. It allows you to read all information about your wallet, which is public information. However, it doesn't allow you to sign any transactions and therefore doesn't allow you to make any _changes_ to the state of the blockchain, including any of your balances or stakes.

1. **`new coldkey`** is used to initialize a coldkey workstation using a newly created _seed phrase_. This is a high security risk operation due to the inherent risk of handling the seed phrase.

1. **`regen coldkey`** is used to initialize a coldkey workstation using a pre-existing wallet's _seed phrase_. This is a high security risk operation due to the inherent risk of handling the seed phrase.

1. **`new hotkey`** is used to initialize a hotkey workstation using a newly created _seed phrase_. This is a high security risk operation due to the inherent risk of handling the seed phrase. Hotkeys should be created on secure coldkey workstation and then carefully provisioned to working nodes for mining and validation.

1. **`regen hotkey`** is used to initialize a hotkey workstation using a pre-existing wallet's _seed phrase_. This is a high security risk operation due to the inherent risk of handling the seed phrase.

1. **`btcli wallet create`** is used to initialize a new coldkey and hotkey workstation with new seed phrases for both. This is a high security risk operation due to the inherent risk of handling the seed phrase.

1. **`btcli wallet associate-hotkey`** is used to associate a hotkey with a coldkey on chain.

#### Permissionless operations

- **`btcli wallet balance`**: Displays a wallet balance.
- **`btcli wallet overview`**: Displays a wallet overview.
- **`btcli wallet list`**: Displays all the wallets and their corresponding hotkeys that are located in the wallet path.

#### Operations requiring coldkey private key:

- **`swap-hotkey`** rotates a hotkey coldkey owned by the coldkey.
- **`swap-coldkey`** announces and executes a coldkey swap to transfer assets on the coldkey to the destination coldkey.
- **`swap-check`** checks to see if a coldkey has an existing swap announcement.
- **`new-hotkey`** creates a new hotkey owned by the coldkey.
- **`transfer`** transfers TAO to another coldkey.
- **`set-identity`** sets the coldkey's public identity information.
- **`sign`(with coldkey)** signs a message with the coldkey.

#### Operations requiring hotkey private key:

- **`sign`** (with hotkey): sign a message with the hotkey
- **`verify`**: Verify a message signature using the signer's public key or SS58 address

<details>
  <summary>`btcli wallet`</summary>
#### `btcli wallet list`
#### `btcli wallet swap-hotkey`
#### `btcli wallet swap-coldkey announce`
#### `btcli wallet swap-coldkey execute`
#### `btcli wallet swap-coldkey dispute`
#### `btcli wallet swap-check`
#### `btcli wallet regen-coldkey`
#### `btcli wallet regen-coldkeypub`
#### `btcli wallet regen-hotkey`
#### `btcli wallet regen-hotkeypub`
#### `btcli wallet new-hotkey`
#### `btcli wallet new-coldkey`
#### `btcli wallet associate-hotkey`
#### `btcli wallet create`
#### `btcli wallet balance`
#### `btcli wallet overview`
#### `btcli wallet transfer`
#### `btcli wallet inspect`
#### `btcli wallet set-identity`
#### `btcli wallet get-identity`
#### `btcli wallet sign`
#### `btcli wallet verify`

</details>

### `stake`

Read operations require public keys. Write operations (stake add, move, remove...) require a coldkey private key.

:::tip mind your keys
See: [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security)
:::

<details>
  <summary>btcli stake</summary>
#### `btcli stake add`
#### `btcli stake remove`
#### `btcli stake auto`
#### `btcli stake set-auto`
#### `btcli stake list`
#### `btcli stake move`
#### `btcli stake transfer`
#### `btcli stake swap`
#### `btcli stake wizard`
#### `btcli stake child`
##### `btcli stake child get`
##### `btcli stake child set`
##### `btcli stake child revoke`
##### `btcli stake child take`
#### `btcli stake set-claim`
#### `btcli stake process-claim`

</details>

### `sudo`

#### Read commands (permissionless)

- **`get`** (same as `btcli subnet hyperparameters`), displays hyperparameters.
- **`proposals`** displays proposals currently before the senate.
- **`senate`** displays current senators.
- **`get-take`** shows the validator take of a given validator.

#### Write commands (require coldkey)

- **`set`** sets the hyperparameters for a subnet (requires the coldkey of the subnet creator).
- **`trim`** sets the maximum number of UIDs on a subnet (requires the coldkey of the subnet creator).
- **`set-take`** sets the validator take for a validator (requires the validator's coldkey).
- **`senate-vote`** votes on a proposal before the senate (requres a coldkey with senate permissions).

<details>
  <summary>`btcli sudo`</summary>
#### `btcli sudo set`
#### `btcli sudo get`
#### `btcli sudo trim`
#### `btcli sudo senate`
#### `btcli sudo proposals`
#### `btcli sudo senate-vote`
#### `btcli sudo set-take`
#### `btcli sudo get-take`

</details>

### `subnets`

#### Read commands (permissionless)

- **`list`** lists subnets.
- **`show` alias `metagraph`** displays info about miner and validator activity on the subnet.
- **`hyperparameters`** shows configuration of a specific subnet.
- **`price`** displays a graph of alpha token prices of subnets over time.
- **`burn-cost`** shows current fee to create subnet.
- **`check-start`** checks if a subnet's emission schedule can be started.
- **`get-identity`** retrieves on-chain identity for a given subnet.
- **`mechanisms count`** shows how many mechanisms are registered under a subnet.
- **`mechanisms emissions`** display the current emission split across mechanisms for a subnet.

#### Write commands (require coldkey)

- **`create`**: Create a subnet (requires burn fee)
- **`register/pow-register`**: Register a UID for the hotkey on a given subnet
- **`start`**: Starts a subnet's emission schedule
- **`set-identity`**: Sets on-chain identity for a given subnet.
- **`set-symbol`**: Sets on-chain symbol for a given subnet.
- **`mechanisms set`**: Configures how many mechanisms are registered for a subnet.
- **`mechanisms split-emissions`**: Updates the emission split across mechanisms for a subnet.

:::tip
Subnet hyperparameters are set with `btcli sudo set`.
:::

Creating subnets requires a coldkey with sufficient balance to cover burn costs.

<!-- Miner and validator registering a hotkey uses a coldkey, has a TAO cost unless proof-of-work -->

<!-- how does POW work??? -->

<details>
  <summary>`btcli subnets`</summary>
#### `btcli subnets hyperparameters`
#### `btcli subnets list`
#### `btcli subnets burn-cost`
#### `btcli subnets create`
#### `btcli subnets pow-register`
#### `btcli subnets register`
#### `btcli subnets metagraph`
#### `btcli subnets show`
#### `btcli subnets price`
#### `btcli subnets check-start`
#### `btcli subnets start`
#### `btcli subnets get-identity`
#### `btcli subnets set-identity`
#### `btcli subnets set-symbol`

</details>

### `weights`

Reading weights with `reveal` is permissionless.

To set weights with `commit`, a validator must meet several requirements. See [Requirements for validation](#validator-permit).

<details>
  <summary>`btcli weight`</summary>
#### `btcli weights reveal`
#### `btcli weights commit`

</details>

### `proxy`

The `proxy` command group allows you to create and manage proxy accounts for secure delegation of account permissions.

#### Read/permissionless commands

There are no read-only proxy commands in btcli. To view proxies associated with an account, use the SDK's `get_proxies_for_real_account()` method or query chain state directly via Polkadot.js.

#### Write commands (require coldkey)

- **`proxy create`**: Creates a new pure proxy account. This generates a keyless account that can only be controlled through the proxy relationship. Requires the spawner's coldkey.
- **`proxy add`**: Adds a standard proxy relationship, authorizing a delegate account to perform specific operations on behalf of the real account. Requires the real account's coldkey.
- **`proxy remove`**: Removes a proxy relationship, revoking the delegate's permissions. Requires the real account's coldkey.
- **`proxy kill`**: Permanently destroys a pure proxy account. **Warning**: All funds in the pure proxy will be permanently lost. Requires the spawner's coldkey.

#### Proxy execution commands

- **`proxy execute`**: Executes a previously announced proxy call after the delay period has passed. This is used with delayed proxies (non-zero delay).

:::tip Address book management
The `btcli config` commands provide convenient local address book management for proxies:

- `btcli config add-proxy` - Save a proxy to your local address book
- `btcli config proxies` - List all proxies in your address book
- `btcli config remove-proxy` - Remove a proxy from your address book (local only, does not affect on-chain state)
- `btcli config update-proxy` - Update a proxy entry in your address book
  :::

:::info Using proxies with other commands
Many btcli commands support the `--proxy` flag, allowing you to execute operations through a proxy account. You can specify either:

- The proxy's SS58 address directly: `--proxy 5ABC...`
- The proxy's name from your address book: `--proxy my-staking-proxy`

For delayed proxies, use the `--announce-only` flag to announce a call without executing it immediately.
:::

See also: [Proxies Documentation](../keys/proxies/)

<details>
  <summary>`btcli proxy`</summary>

#### `btcli proxy create`

#### `btcli proxy add`

#### `btcli proxy remove`

#### `btcli proxy kill`

#### `btcli proxy execute`

</details>

### `crowd`

The `btcli crowd` commands are used to create and manage crowdloans on the network.

- **`crowd contribute`**: Pledges TAO contribution from your wallet to a specific crowdloan campaign.
- **`crowd withdraw`**: Recalls your contributed TAO from a non-finalized crowdloan.
- **`crowd finalize`**: Finalizes a crowdloan that has reached its cap if the finalization conditions are met. Finalizing a crowdloan either transfers the funds to the target account or executes the underlying crowdloan call.
- **`crowd create`**: Initializes a new crowdloan campaign with a defined funding cap, duration, and purpose.
- **`crowd update`**: Modifies the details of an existing crowdloan campaign. This command can only be called by the crowdloan creator.
- **`crowd refund`**: Triggers the return of TAO to all contributors of an non-finalized crowdloan. This command can only be called by the crowdloan creator.
- **`crowd dissolve`**: Dissolves a crowdloan entirely and removes its record from the blockchain. This command can only be called by the crowdloan creator after all contributors have been refunded.
- **`crowd list`**: Displays a summarized list of all active and past crowdloans, including their current status on the selected network.
- **`crowd info`**: Provides detailed information about a specific crowdloan.

<details>
  <summary>`btcli crowd`</summary>

#### `btcli crowd contribute`

#### `btcli crowd withdraw`

#### `btcli crowd finalize`

#### `btcli crowd create`

#### `btcli crowd update`

#### `btcli crowd refund`

#### `btcli crowd dissolve`

#### `btcli crowd list`

#### `btcli crowd info`

</details>

### `liquidity`

The `btcli liquidity` commands are used to provide and manage trading liquidity for specific subnets. For more information, see [Liquidity positions](../liquidity-positions/liquidity-positions.md).

- **`liquidity add`**: Add liquidity to the swap (as a combination of TAO + Alpha).
- **`liquidity list`**: Shows a wallet's liquidity positions in given subnet.
- **`liquidity modify`**: Modifies the liquidity position for the given subnet.
- **`liquidity remove`**: Remove liquidity from the swap (as a combination of TAO + Alpha).

<details>
  <summary>`btcli liquidity`</summary>

#### `liquidity add`

#### `liquidity list`

#### `liquidity modify`

#### `liquidity remove`

</details>

### `axon`

The `btcli axon` commands are used to configure or remove a neuron's serving endpoint on the network.

- **`axon reset`** is used to reset the axon information for a neuron on the network by setting the IP address and port to `0.0.0.0` and `1` respectively.
- **`axon set`** sets the axon information for a neuron on the network.

<details>
  <summary>`btcli axon`</summary>

#### `btcli axon reset`

#### `btcli axon set`

</details>

### `utils`

The `btcli utils ...` commands are utility commands used for specialized operations like checking network latency and performing token conversions.

- **`utils convert`** is a convenience command for performing conversions between minimal units (RAO) and TAO, or other chain-specific conversions. It is permissionless (no key required) because it performs no on-chain operation, just a local calculation.
- **`utils latency`** returns the latency of all finney-like nodes. You can also view latency on additional networks by using the `--network` flag.
<details>
  <summary>`btcli utils`</summary>

#### `btcli utils convert`

#### `btcli utils latency`

</details>

### `view`

- **`view dashboard`** generates an HTML dashboard that provides a comprehensive overview of the entire network, listing all subnets and detailing the wallet's stake information across each of them.

<details>

  <summary>`btcli view`</summary>

#### `btcli view dashboard`

</details>
