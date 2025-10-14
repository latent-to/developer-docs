---
title: "Bittensor CLI: btcli Reference Document"
---

# Bittensor CLI: `btcli` Reference Document

Command line interface (CLI) for Bittensor. Uses the values in the configuration file. These values can be overriden by passing them explicitly in the command line.

See [Getting Started](../getting-started/install-btcli.md) to install `btcli`.

:::note Transaction Fees
Many BTCLI operations incur transaction fees. See [Transaction Fees in Bittensor](../learn/fees.md) for details.
:::

Command line interface (CLI) for Bittensor. Uses the values in the configuration file. These values can be
overriden by passing them explicitly in the command line.

**Usage**:

```bash
btcli [OPTIONS] COMMAND [ARGS]...
```

**Options**:

- `--version`: Show BTCLI version.
- `--commands`: Show BTCLI commands.
- `--debug`: Saves the debug log from the last used command.
- `--install-completion`: Install completion for the current shell.
- `--show-completion`: Show completion for the current shell, to copy it or customize the installation.
- `--help`: Show this message and exit.

**Commands**:

- `config`: Config commands, aliases: `c`, `conf`
- `wallet`: Wallet commands, aliases: `wallets`, `w`
- `stake`: Stake commands, alias: `st`
- `sudo`: Sudo commands, alias: `su`
- `subnets`: Subnets commands, alias: `s`, `subnet`
- `weights`: Weights commands, aliases: `wt`, `weight`
- `utils`
- `view`: HTML view commands
- `liquidity`: Liquidity commands, aliases: `l`

## `btcli config`

**Usage**:

```bash
btcli config [OPTIONS] COMMAND [ARGS]...

aliases: conf, c
```

**Options**:

- `--help`: Show this message and exit.

**Commands**:

- `set`: Sets or updates configuration values in the BTCLI config file.
- `get`: Prints the current config file in a table.
- `clear`: Clears the fields in the config file and sets them to 'None'.

### `btcli config set`

Sets or updates configuration values in the BTCLI config file.

This command allows you to set default values that will be used across all BTCLI commands.

**Usage:**

Interactive mode:
`btcli config set`

Set specific values:
`btcli config set --wallet-name default --network finney`
`btcli config set --safe-staking --rate-tolerance 0.1`

Note:

- Network values can be network names (e.g., 'finney', 'test') or websocket URLs
- Rate tolerance is specified as a decimal (e.g., 0.05 for 0.05%)
- Changes are saved to `~/.bittensor/btcli.yaml`
- Use `btcli config get` to view current settings

**Usage**:

```console
btcli config set [OPTIONS]
```

**Options**:

| Option                                                                                                    | Type  | Description                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                               | TEXT  | Name of the wallet.                                                                                                                                                 |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                                   | TEXT  | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.                                                                                |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`                                 | TEXT  | Hotkey of the wallet                                                                                                                                                |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                               | TEXT  | The subtensor network to connect to. Default: finney.                                                                                                               |
| `--cache`, `--cache`/`--no-cache`, `--no_cache`                                                           |       | Disable caching of some commands. This will disable the `--reuse-last` and `--html` flags on commands such as `subnets metagraph`, `stake show` and `subnets list`. |
| `--tolerance`                                                                                             | FLOAT | Set the rate tolerance percentage for transactions (e.g. 0.1 for 0.1%)                                                                                              |
| `--safe-staking`, `--safe`/`--no-safe-staking`, `--unsafe`                                                |       | Enable or disable safe staking mode.                                                                                                                                |
| `--allow-partial-stake`, `--partial`, `--allow`/`--no-allow-partial-stake`, `--no-partial`, `--not-allow` |       | Allow or prevent partial stakes                                                                                                                                     |
| `--dashboard-path`, `--dashboard_path`, `--dash_path`, `--dash.path`                                      | TEXT  | Path to save the dashboard HTML file. For example: `~/.bittensor/dashboard`.                                                                                        |
| `--help`                                                                                                  |       | Show this message and exit.                                                                                                                                         |

### `btcli config get`

Prints the current config file in a table.

**Usage**:

```console
btcli config get [OPTIONS]
```

**Options**:

| Option   | Type | Description                 |
| -------- | ---- | --------------------------- |
| `--help` |      | Show this message and exit. |

### `btcli config clear`

Clears the fields in the config file and sets them to 'None'.

    - To clear the 'chain' and 'network' fields:

        ```
        btcli config clear --chain --network
        ```

    - To clear your config entirely:

        ```
        btcli config clear --all
        ```

**Usage**:

```console
btcli config clear [OPTIONS]
```

**Options**:

| Option                                                                                                    | Type | Description                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                               | TEXT | Name of the wallet.                                                                                                                                                 |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                                   | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.                                                                                |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`                                 | TEXT | Hotkey of the wallet                                                                                                                                                |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                               | TEXT | The subtensor network to connect to. Default: finney.                                                                                                               |
| `--cache`                                                                                                 |      | Disable caching of some commands. This will disable the `--reuse-last` and `--html` flags on commands such as `subnets metagraph`, `stake show` and `subnets list`. |
| `--tolerance`                                                                                             |      |                                                                                                                                                                     |
| `--safe-staking`, `--safe`/`--no-safe-staking`, `--unsafe`                                                |      | Enable or disable safe staking mode.                                                                                                                                |
| `--allow-partial-stake`, `--partial`, `--allow`/`--no-allow-partial-stake`, `--no-partial`, `--not-allow` |      | Allow or prevent partial stakes                                                                                                                                     |
| `--all`                                                                                                   |      | Clears the entire config.                                                                                                                                           |
| `--dashboard-path`, `--dashboard_path`, `--dash_path`, `--dash.path`                                      | TEXT | Path to save the dashboard HTML file. For example: `~/.bittensor/dashboard`.                                                                                        |
| `--help`                                                                                                  |      | Show this message and exit.                                                                                                                                         |

## `btcli view`

Display html dashboard with subnets list, stake, and neuron information.

**Usage**:

```console
btcli view [OPTIONS] COMMAND [ARGS]...
```

**Options**:

- `--help`: Show this message and exit.

**Commands**:

- `dashboard`: Display html dashboard with subnets list, stake, and neuron information.

### `btcli view dashboard`

Display html dashboard with subnets list, stake, and neuron information.

**Usage**:

```bash
btcli view dashboard
```

**Options**:

| Option   | Type | Description                 |
| -------- | ---- | --------------------------- |
| `--help` |      | Show this message and exit. |

## `btcli wallet`

**Usage**:

```console
btcli wallet [OPTIONS] COMMAND [ARGS]...

aliases: w, wallets
```

**Options**:

- `--help`: Show this message and exit.

**Commands**:

- `list`: Displays all the wallets and their corresponding hotkeys that are located in the wallet path specified in the config.
- `associate_hotkey`: Associate a hotkey with a wallet(coldkey).
- `swap-hotkey`: Swap hotkeys of a given wallet on the blockchain.
- `swap-coldkey`: Schedule a coldkey swap for a wallet.
- `swap-check`: Check the status of scheduled coldkey swaps.
- `regen-coldkey`: Regenerate a coldkey for a wallet on the Bittensor blockchain network.
- `regen-coldkeypub`: Regenerates the public part of a coldkey (`coldkeypub.txt`) for a wallet.
- `regen-hotkey`: Regenerates a hotkey for a wallet.
- `regen-hotkeypub`: Regenerates the public part of a hotkey (`hotkeypub.txt`) for a wallet.
- `new-hotkey`: Create a new hotkey for a wallet.
- `new-coldkey`: Create a new coldkey.
- `create`: Create a complete wallet by setting up both coldkey and hotkeys.
- `balance`: Check the balance of the wallet.
- `overview`: Displays a detailed overview of the user's registered accounts on the Bittensor network.
- `transfer`: Send TAO tokens from one wallet to another wallet on the Bittensor network.
- `set-identity`: Create or update the on-chain identity of a coldkey or a hotkey on the Bittensor network.
- `get-identity`: Shows the identity details of a user's coldkey or hotkey.
- `sign`: Allows users to sign a message with the provided wallet or wallet hotkey.
- `verify`: Verify a message signature using the signer's public key or SS58 address.

### `btcli wallet list`

Displays all the wallets and their corresponding hotkeys that are located in the wallet path specified in the config.

The output display shows each wallet and its associated `ss58` addresses for the coldkey public key and any hotkeys. The output is presented in a hierarchical tree format, with each wallet as a root node and any associated hotkeys as child nodes. The `ss58` address is displayed for each coldkey and hotkey that is not encrypted and exists on the device.

Upon invocation, the command scans the wallet directory and prints a list of all the wallets, indicating whether the
public keys are available (`?` denotes unavailable or encrypted keys).

```
btcli wallet list --path ~/.bittensor
```

Note: This command is read-only and does not modify the filesystem or the blockchain state. It is intended for use with the Bittensor CLI to provide a quick overview of the user's wallets.

**Usage**:

```console
btcli wallet list [OPTIONS]
```

**Options**:

| Option                                                      | Type | Description                                                                          |
| ----------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name` | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`     | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--quiet`                                                   |      | Display only critical information on the console.                                    |
| `--verbose`                                                 |      | Enable verbose output.                                                               |
| `--help`                                                    |      | Show this message and exit.                                                          |

### `btcli wallet associate-hotkey`

This command is used to associate a hotkey with a wallet(coldkey).

**Example**

```sh
btcli wallet associate-hotkey --hotkey-name hotkey_name
```

```sh
btcli wallet associate-hotkey --hotkey-ss58 5DkQ4...
```

**Usage:**

```sh
btcli w associate-hotkey [OPTIONS]

alias: associate_hotkey
```

**Options**

| Option                                                                      | Type | Description                                                                          |
| --------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT | Hotkey name or SS58 address of the hotkey.                                           |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney.                                |
| `--quiet`                                                                   |      | Display only critical information on the console.                                    |
| `--verbose`                                                                 |      | Enable verbose output.                                                               |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |      | Enable or disable interactive prompts.                                               |
| `--help`                                                                    |      | Show this message and exit.                                                          |
|                                                                             |

### `btcli wallet swap-hotkey`

Swap hotkeys of a given wallet on the blockchain. For a registered key pair, for example, a (coldkeyA, hotkeyA) pair, this command swaps the hotkeyA with a new, unregistered, hotkeyB to move the original registration to the (coldkeyA, hotkeyB) pair.

:::info

- Make sure that your original key pair (coldkeyA, hotkeyA) is already registered.
- Make sure that you use a newly created hotkeyB in this command. A hotkeyB that is already registered cannot be used in this command.
- Finally, note that this command requires a fee of 1 TAO for recycling and this fee is taken from your wallet (coldkeyA).
  :::

**Example:**

```
btcli wallet swap_hotkey destination_hotkey_name --wallet-name your_wallet_name --wallet-hotkey original_hotkey
```

**Usage**:

```console
btcli wallet swap-hotkey [OPTIONS] [DESTINATION_HOTKEY_NAME]

alias: swap_hotkey
```

**Arguments**:

- `[DESTINATION_HOTKEY_NAME]`: Destination hotkey name.

**Options**:

| Option                                                                      | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                 |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| ` --all-netuids`/`--no-all-netuids`,                                        |         | Use all netuids                                                                      |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |         | Enable or disable interactive prompts.                                               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |         | Show this message and exit.                                                          |
|                                                                             |

### `btcli wallet swap-coldkey`

This command allows you to schedule a coldkey swap for a wallet. You can either provide a new wallet name, or SS58 address.

**Example**

```sh
btcli wallet swap-coldkey --new-wallet my_new_wallet
```

```sh
btcli wallet swap-coldkey --new-coldkey-ss58 5Dk...X3q
```

**Usage:**

```sh
btcli wallet swap-coldkey [OPTIONS]

alias: swap_coldkey
```

**Options**

| Option                                                                      | Type | Description                                                                          |
| --------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT | Hotkey of the wallet                                                                 |
| `--new-coldkey`, `--new-coldkey-ss58`, `--new-wallet`, `--new`              | TEXT | SS58 address of the new coldkey that will replace the current one.                   |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney.                                |
| `--quiet`                                                                   |      | Display only critical information on the console.                                    |
| `--verbose`                                                                 |      | Enable verbose output.                                                               |
| `--force`, `--force-swap`, `-f`                                             |      | Force the swap even if the new coldkey is already scheduled for a swap.              |
| `--help`                                                                    |      | Show this message and exit.                                                          |
|                                                                             |

### `btcli wallet swap-check`

This command checks the status of scheduled coldkey swaps. It can be used in one of three ways:

- Show all pending swaps using the `--all` flag.
- Check status of a specific wallet's swap or SS58 address.
- Check detailed swap status with block number using the `--block` flag.

**Example**

Show all pending swaps:

```sh
btcli wallet swap-check --all
```

Check specific wallet's swap:

```sh
  btcli wallet swap-check --wallet-name my_wallet
```

Check swap using SS58 address:

```sh
 btcli wallet swap-check --ss58 5DkQ4...
```

Check swap details with block number:

```sh
  btcli wallet swap-check --wallet-name my_wallet --block 12345
```

**Usage:**

```sh
btcli wallet swap-check [OPTIONS]

alias: swap_check
```

**Options**
| Option | Type | Description |
| --------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name` | TEXT | Name of the wallet. |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path` | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey` | TEXT | Hotkey of the wallet |
| `--block` | INTEGER | Block number where the swap was scheduled. |
| `--all` | | Show all pending coldkey swaps |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney. |
| `--quiet` | | Display only critical information on the console. |
| `--verbose` | | Enable verbose output. |
| `--help` | | Show this message and exit. |
| |

### `btcli wallet regen-coldkey`

Regenerate a coldkey for a wallet on the Bittensor blockchain network.

This command is used to create a new coldkey from an existing mnemonic, seed, or JSON file.

**Usage:**

Users can specify a mnemonic, a seed string, or a JSON file path to regenerate a coldkey. The command supports optional password protection for the generated key.

**Example:**

```
btcli wallet regen-coldkey --mnemonic "word1 word2 ... word12"
```

:::info
This command is critical for users who need to regenerate their coldkey either for recovery or for security reasons.
:::

**Usage**:

```console
btcli wallet regen-coldkey [OPTIONS]

alias: regen_coldkey
```

**Options**:

| Option                                                                    | Type | Description                                                                          |
| ------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`               | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                   | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey` | TEXT | Hotkey of the wallet                                                                 |
| `--mnemonic`                                                              | TEXT | Mnemonic used to regenerate your key.                                                |
| `--seed`,                                                                 | TEXT | Seed hex string used to regenerate your key.                                         |
| `--json`, `-j`                                                            | TEXT | Path to a JSON file containing the encrypted key backup.                             |
| `--json-password`,                                                        | TEXT | Password to decrypt the JSON file.key.                                               |
| `--use-password`/`--no-use-password `,                                    |      | Set this to `True` to protect the generated Bittensor key with a password.           |
| `--overwrite`/`--no-overwrite`                                            |      | Overwrite the existing wallet file with the new one.                                 |
| `--quiet`                                                                 |      | Display only critical information on the console.                                    |
| `--verbose`                                                               |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                             |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                  |      | Show this message and exit.                                                          |

### `btcli wallet regen-coldkeypub`

Regenerates the public part of a coldkey (`coldkeypub.txt`) for a wallet.

Use this command when you need to move machine for subnet mining. Use the public key or SS58 address from your `coldkeypub.txt` that you have on another machine to regenerate the `coldkeypub.txt` on this new machine.

**Usage:**

The command requires either a public key in hexadecimal format or an `SS58` address from the existing `coldkeypub.txt` from old machine to regenerate the coldkeypub on the new machine.

**Example:**

```
btcli wallet regen_coldkeypub --ss58_address 5DkQ4...
```

:::info
This command is particularly useful for users who need to regenerate their coldkeypub, perhaps due to file corruption or loss. You will need either ss58 address or public hex key from your old `coldkeypub.txt` for the wallet. It is a recovery-focused utility that ensures continued access to your wallet functionalities.
:::
**Usage**:

```console
btcli wallet regen-coldkeypub [OPTIONS]

alias: regen_coldkeypub
```

**Options**:

| Option                                                                    | Type | Description                                                                          |
| ------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`               | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                   | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey` | TEXT | Hotkey of the wallet                                                                 |
| `--public-key-hex`,                                                       | TEXT | The public key in hex format.                                                        |
| `--ss58`, `--ss58-address`,                                               | TEXT | The SS58 address of the coldkey.                                                     |
| `--overwrite`/`--no-overwrite`                                            |      | Overwrite the existing wallet file with the new one.                                 |
| `--quiet`                                                                 |      | Display only critical information on the console.                                    |
| `--verbose`                                                               |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                             |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                  |      | Show this message and exit.                                                          |

### `btcli wallet regen-hotkey`

Regenerates a hotkey for a wallet.

Similar to regenerating a coldkey, this command creates a new hotkey from a mnemonic, seed, or JSON file.

**Usage:**

Users can provide a mnemonic, seed string, or a JSON file to regenerate the hotkey. The command supports optional password protection and can overwrite an existing hotkey.

```
btcli wallet regen_hotkey --seed 0x1234...
```

:::info
This command is essential for users who need to regenerate their hotkey, possibly for security upgrades or key recovery.
It should be used with caution to avoid accidental overwriting of existing keys.
:::

**Usage**:

```console
btcli wallet regen-hotkey [OPTIONS]

alias: regen_hotkey
```

**Options**:

| Option                                                                    | Type | Description                                                                          |
| ------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`               | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                   | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey` | TEXT | Hotkey of the wallet                                                                 |
| `--mnemonic`                                                              | TEXT | Mnemonic used to regenerate your key.                                                |
| `--seed`,                                                                 | TEXT | Seed hex string used to regenerate your key.                                         |
| `--json`, `-j`                                                            | TEXT | Path to a JSON file containing the encrypted key backup.                             |
| `--json-password`,                                                        | TEXT | Password to decrypt the JSON file.key.                                               |
| `--use-password`/`--no-use-password`,                                     |      | Set this to `True` to protect the generated Bittensor key with a password.           |
| `--overwrite`/`--no-overwrite`                                            |      | Overwrite the existing wallet file with the new one.                                 |
| `--quiet`                                                                 |      | Display only critical information on the console.                                    |
| `--verbose`                                                               |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                             |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                  |      | Show this message and exit.                                                          |

### `btcli wallet regen-hotkeypub`

This command regenerates the public part of a hotkey (hotkeypub.txt) for a wallet. Use this command when you need to move machine for subnet mining. Use the public key or SS58 address from your hotkeypub.txt that you have on another machine to regenerate the hotkeypub.txt on this new machine.

**Usage**
The command requires either a public key in hexadecimal format or an `SS58` address from the existing `hotkeypub.txt` from old machine to regenerate the hotkeypub on the new machine.

**Example:**

```sh
btcli wallet regen-hotkeypub --ss58_address 5DkQ4...
```

**Usage**

```sh
btcli wallet regen-hotkeypub [OPTIONS]

alias: regen_hotkeypub
```

:::info
This command is particularly useful for users who need to regenerate their hotkeypub, perhaps due to file corruption or loss. You will need either ss58 address or public hex key from your old `hotkeypub.txt` for the wallet. It is a recovery-focused utility that ensures continued access to your wallet functionalities.  
:::

**Options**

| Option                                                                    | Type | Description                                                                          |
| ------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`               | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                   | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey` | TEXT | Hotkey of the wallet                                                                 |
| `--public-key-hex`,                                                       | TEXT | The public key in hex format.                                                        |
| `--ss58`, `--ss58-address`,                                               | TEXT | The SS58 address of the coldkey.                                                     |
| `--overwrite`/`--no-overwrite`                                            |      | Overwrite the existing wallet file with the new one.                                 |
| `--quiet`                                                                 |      | Display only critical information on the console.                                    |
| `--verbose`                                                               |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                             |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                  |      | Show this message and exit.                                                          |

### `btcli wallet new-hotkey`

Create a new hotkey for a wallet.

**Usage:**

This command is used to generate a new hotkey for managing a neuron or participating in a subnet. It provides options for the mnemonic word count, and supports password protection. It also allows overwriting the
existing hotkey.

**Example:**

```
btcli wallet new-hotkey --n_words 24
```

:::info
This command is useful to create additional hotkeys for different purposes, such as running multiple subnet miners or subnet validators or separating operational roles within the Bittensor network.
:::

**Usage**:

```console
btcli wallet new-hotkey [OPTIONS]

alias: new_hotkey
```

**Options**:

| Option                                                                    | Type    | Description                                                                          |
| ------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`               | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                   | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey` | TEXT    | Hotkey of the wallet                                                                 |
| `--n-words`, `--n_words`                                                  | INTEGER | The number of words used in the mnemonic.                                            |
| `--use-password`/`--no-use-password `,                                    |         | Set this to `True` to protect the generated Bittensor key with a password.           |
| `--uri`                                                                   | TEXT    | Create wallet from uri (e.g. 'Alice', 'Bob', 'Charlie')                              |
| `--overwrite`/`--no-overwrite`                                            |         | Overwrite the existing wallet file with the new one.                                 |
| `--quiet`                                                                 |         | Display only critical information on the console.                                    |
| `--verbose`                                                               |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                             |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                  |         | Show this message and exit.                                                          |

### `btcli wallet new-coldkey`

Create a new coldkey. A coldkey is required for holding TAO balances and performing high-value transactions.

**Usage:**

The command creates a new coldkey. It provides options for the mnemonic word count, and supports password protection. It also allows overwriting an existing coldkey.

**Example:**

```
btcli wallet new_coldkey --n_words 15
```

:::info
This command is crucial for users who need to create a new coldkey for enhanced security or as part of setting up a new wallet. It is a foundational step in establishing a secure presence on the Bittensor network.
:::

**Usage**:

```console
btcli wallet new-coldkey [OPTIONS]

alias: new_coldkey
```

**Options**:

| Option                                                                    | Type    | Description                                                                          |
| ------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`               | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                   | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey` | TEXT    | Hotkey of the wallet                                                                 |
| `--n-words`, `--n_words`                                                  | INTEGER | The number of words used in the mnemonic.                                            |
| `--use-password`/`--no-use-password `,                                    |         | Set this to `True` to protect the generated Bittensor key with a password.           |
| `--uri`                                                                   | TEXT    | Create wallet from uri (e.g. 'Alice', 'Bob', 'Charlie')                              |
| `--overwrite`/`--no-overwrite`                                            |         | Overwrite the existing wallet file with the new one.                                 |
| `--quiet`                                                                 |         | Display only critical information on the console.                                    |
| `--verbose`                                                               |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                             |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                  |         | Show this message and exit.                                                          |

### `btcli wallet create`

Create a complete wallet by setting up both coldkey and hotkeys.

**Usage:**

The command creates a new coldkey and hotkey. It provides an option for mnemonic word count. It supports password protection for the coldkey and allows overwriting of existing keys.

**Example:**

```
btcli wallet create --n-words 21
```

Note: This command is for new users setting up their wallet for the first time, or for those who wish to completely renew their wallet keys. It ensures a fresh start with new keys for secure and effective participation in the Bittensor network.

**Usage**:

```console
btcli wallet create [OPTIONS]
```

**Options**:

| Option                                                                    | Type    | Description                                                                          |
| ------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`               | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                   | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey` | TEXT    | Hotkey of the wallet                                                                 |
| `--n-words`                                                               | INTEGER | The number of words used in the mnemonic.                                            |
| `--use-password`/`--no-use-password `,                                    |         | Set this to `True` to protect the generated Bittensor key with a password.           |
| `--uri`                                                                   | TEXT    | Create wallet from uri (e.g. 'Alice', 'Bob', 'Charlie')                              |
| `--overwrite`/`--no-overwrite`                                            |         | Overwrite the existing wallet file with the new one.                                 |
| `--quiet`                                                                 |         | Display only critical information on the console.                                    |
| `--verbose`                                                               |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                             |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                  |         | Show this message and exit.                                                          |

### `btcli wallet balance`

Check the balance of the wallet. This command shows a detailed view of the wallet's coldkey balances, including free and staked balances.

You can also pass multiple ss58 addresses of coldkeys to check their balance (using --ss58).

**Example:**

- To display the balance of a single wallet, use the command with the `--wallet-name` argument and provide the wallet name:

  ```
  btcli w balance --wallet-name WALLET
  ```

- To use the default config values, use:

  ```
  btcli w balance
  ```

- To display the balances of all your wallets, use the `--all` argument:

  ```
  btcli w balance --all
  ```

- To display the balances of ss58 addresses, use the `--ss58` argument:

  ```
  btcli w balance --ss58 &lt;ss58_address&gt; --ss58 &lt;ss58_address&gt;
  ```

**Usage**:

```console
btcli wallet balance [OPTIONS]
```

**Options**:

| Option                                                                      | Type | Description                                                                          |
| --------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT | Hotkey of the wallet                                                                 |
| `--ss58`, `--ss58-address`,                                                 | TEXT | The SS58 address of the coldkey.                                                     |
| `--all`, `-a`                                                               |      | Whether to display the balances for all the wallets.                                 |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney.                                |
| `--quiet`                                                                   |      | Display only critical information on the console.                                    |
| `--verbose`                                                                 |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |      | Show this message and exit.                                                          |

### `btcli wallet overview`

Displays a detailed overview of the user's registered accounts on the Bittensor network.

This command compiles and displays comprehensive information about each neuron associated with the user's wallets, including both hotkeys and coldkeys. It is especially useful for users managing multiple accounts or looking for a summary of their network activities and stake distributions.

**Usage:**

```
btcli wallet overview
```

```
btcli wallet overview --all
```

Note: This command is read-only and does not modify the blockchain state or account configuration.
It provides a quick and comprehensive view of the user's network presence, making it useful for monitoring account status,
stake distribution, and overall contribution to the Bittensor network.

**Usage**:

```console
btcli wallet overview [OPTIONS]
```

**Options**:

| Option                                                                      | Type | Description                                                                                                                                 |
| --------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT | Name of the wallet.                                                                                                                         |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.                                                        |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT | Hotkey of the wallet                                                                                                                        |
| `--all`, `-a`                                                               |      | See an overview for all the wallets                                                                                                         |
| `--sort-by`, `--sort_by`                                                    | TEXT | Sort the hotkeys by the specified column title. For example: name, uid, axon.                                                               |
| `--sort-order`, `--sort_order`                                              | TEXT | Sort the hotkeys in the specified order (ascending/asc or descending/desc/reverse).                                                         |
| `--include-hotkeys`, `-in`                                                  | TEXT | Hotkeys to include. Specify by name or ss58 address. If left empty, all hotkeys, except those in the `--exclude-hotkeys`, will be included. |
| `--exclude-hotkeys`, `-ex`                                                  | TEXT | Hotkeys to exclude. Specify by name or ss58 address. If left empty, all hotkeys, except those in the `--include-hotkeys`, will be excluded. |
| `--netuids`, `--netuid`, `-n`                                               | TEXT | Set the netuid(s) to exclude. Separate multiple netuids with a comma, for example: `-n 0,1,2`.                                              |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney.                                                                                       |
| `--quiet`                                                                   |      | Display only critical information on the console.                                                                                           |
| `--verbose`                                                                 |      | Enable verbose output.                                                                                                                      |
| `--json-output`, `--json-out`                                               |      | Outputs the result of the command as JSON.                                                                                                  |
| `--help`                                                                    |      | Show this message and exit.                                                                                                                 |

### `btcli wallet transfer`

Send TAO tokens from one wallet to another wallet on the Bittensor network.

This command is used for transactions between different wallet accounts, enabling users to send tokens to other
participants on the network. The command displays the user's current balance before prompting for the amount
to transfer (send), ensuring transparency and accuracy in the transaction.

**Usage:**

The command requires that you specify the destination address (public key) and the amount of TAO you want transferred.
It checks if sufficient balance exists in your wallet and prompts for confirmation before proceeding with the transaction.

**Example:**

```
btcli wallet transfer --dest 5Dp8... --amount 100
```

Note: This command is used for executing token transfers within the Bittensor network. Users should verify the destination address and the TAO amount before confirming the transaction to avoid errors or loss of funds.

**Usage**:

```console
btcli wallet transfer [OPTIONS]
```

**Options**:

| Option                                                                      | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--destination`, `--dest`, `-d`                                             | TEXT    | Destination address (ss58) of the wallet (coldkey).                                  |
| `--amount`, `-a`                                                            | FLOAT   | Amount (in TAO) to transfer.                                                         |
| `--all`                                                                     |         | Transfer all available balance.                                                      |
| `--all`                                                                     |         | Whether to display the balances for all the wallets.                                 |
| `--period`, `-era`                                                          | INTEGER | Length (in blocks) for which the transaction should be valid.                        |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                 |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |         | Show this message and exit.                                                          |

### `btcli wallet set-identity`

Create or update the on-chain identity of a coldkey or a hotkey on the Bittensor network. Incurs a 1 TAO transaction fee.

The on-chain identity includes attributes such as display name, legal name, web URL, PGP fingerprint, and contact information, among others.

The command prompts the user for the identity attributes and validates the input size for each attribute. It provides an option to update an existing validator hotkey identity. If the user consents to the transaction cost, the identity is updated on the blockchain.

Each field has a maximum size of 64 bytes. The PGP fingerprint field is an exception and has a maximum size of 20 bytes. The user is prompted to enter the PGP fingerprint as a hex string, which is then converted to bytes. The user is also prompted to enter the coldkey or hotkey `ss58` address for the identity to be updated.

If the user does not have a hotkey, the coldkey address is used by default. If setting a validator identity, the hotkey will be used by default. If the user is setting an identity for a subnet, the coldkey will be used by default.

**Example:**

```
btcli wallet set_identity
```

:::info
This command should only be used if the user is willing to incur the a recycle fee associated with setting an identity on the blockchain. It is a high-level command that makes changes to the blockchain state and should not be used programmatically as part of other scripts or applications.
:::

**Usage**:

```console
btcli wallet set-identity [OPTIONS]

alias: set_identity
```

**Options**:

| Option                                                                      | Type | Description                                                                          |
| --------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT | Hotkey of the wallet                                                                 |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney.                                |
| `--name`                                                                    | TEXT | The display name for the identity.                                                   |
| `--web-url`, `--web`                                                        | TEXT | The web URL for the identity.                                                        |
| `--image-url`, `--image`                                                    | TEXT | The image URL for the identity.                                                      |
| `--discord`                                                                 | TEXT | The Discord handle for the identity.                                                 |
| `--description`                                                             | TEXT | The description for the identity.                                                    |
| `--additional`                                                              | TEXT | Additional details for the identity.                                                 |
| `--github`                                                                  | TEXT | The GitHub repository for the identity.                                              |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |      | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                   |      | Display only critical information on the console.                                    |
| `--verbose`                                                                 |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |      | Show this message and exit.                                                          |

### `btcli wallet get-identity`

Shows the identity details of a user's coldkey or hotkey.

The command displays the information in a table format showing:

- Address: The `ss58` address of the queried key.

- Item: Various attributes of the identity such as stake, rank, and trust.

- Value: The corresponding values of the attributes.

**Example:**

```sh
btcli wallet get_identity --key &lt;s58_address&gt;
```

:::info
This command is primarily used for informational purposes and has no side effects on the blockchain network state.
:::

**Usage**:

```console
btcli wallet get-identity [OPTIONS]

alias: get_identity
```

**Options**:

| Option                                                                                 | Type | Description                                                                          |
| -------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                            | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`              | TEXT | Hotkey of the wallet                                                                 |
| `--ss58`, `--coldkey_ss58`, `--coldkey.ss58_address`, `--coldkey.ss58`, `--key`, `-k ` | TEXT | Coldkey address of the wallet                                                        |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`            | TEXT | The subtensor network to connect to. Default: finney.                                |
| `--quiet`                                                                              |      | Display only critical information on the console.                                    |
| `--verbose`                                                                            |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                                          |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                               |      | Show this message and exit.                                                          |

### `btcli wallet sign`

Allows users to sign a message with the provided wallet or wallet hotkey. Use this command to easily prove your ownership of a coldkey or a hotkey.

**Usage:**

Using the provided wallet (coldkey), the command generates a signature for a given message.

**Example:**

```sh
btcli wallet sign --wallet-name default --message '{"something": "here", "timestamp": 1719908486}'
```

```sh
btcli wallet sign --wallet-name default --wallet-hotkey hotkey --message '{"something": "here", "timestamp": 1719908486}'
```

**Usage**:

```console
btcli wallet sign [OPTIONS]
```

**Options**:

| Option                                                                    | Type | Description                                                                                          |
| ------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------- |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`               | TEXT | Name of the wallet.                                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                   | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.                 |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey` | TEXT | Hotkey of the wallet                                                                                 |
| `--use-hotkey` / `--no-use-hotkey`                                        |      | If specified, the message will be signed by the hotkey. If not specified, the user will be prompted. |
| `--message`                                                               | TEXT | The message to encode and sign.                                                                      |
| `--quiet`                                                                 |      | Display only critical information on the console.                                                    |
| `--verbose`                                                               |      | Enable verbose output.                                                                               |
| `--json-output`, `--json-out`                                             |      | Outputs the result of the command as JSON.                                                           |
| `--help`                                                                  |      | Show this message and exit.                                                                          |

### `btcli wallet verify`

Verify a message signature using the signer's public key or SS58 address. This command allows you to verify that a message was signed by the owner of a specific address.

**Usage:**

Provide the original message, the signature (in hex format), and either the SS58 address or public key of the signer to verify the signature.

**Example:**

```sh
btcli wallet verify --message "Hello world" --signature "0xabc123..." --address "5GrwvaEF..."
```

```sh
btcli wallet verify -m "Test message" -s "0xdef456..." -p "0x1234abcd..."
```

**Usage**:

```console
btcli wallet verify [OPTIONS]
```

**Options**:

| Option                                 | Type | Description                                                     |
| -------------------------------------- | ---- | --------------------------------------------------------------- |
| `--message`                            | TEXT | The message that was signed. [default: None]                    |
| `--signature`, `-s`                    | TEXT | The signature to verify. (hex format) [default: None]           |
| `--address`, `--public-key` `-a`, `-p` | TEXT | SS58 address or public key (hex) of the signer. [default: None] |
| `--quiet`                              |      | Display only critical information on the console.               |
| `--verbose`                            |      | Enable verbose output.                                          |
| `--json-output`, `--json-out`          |      | Outputs the result of the command as JSON.                      |
| `--help`                               |      | Show this message and exit.                                     |

## `btcli stake`

**Usage**:

```console
btcli stake [OPTIONS] COMMAND [ARGS]...

alias: st
```

**Options**:

- `--help`: Show this message and exit.

**Commands**:

- `add`: Stake TAO to one or more hotkeys on specific netuids with your coldkey.
- `remove`: Unstake TAO from one or more hotkeys and transfer them back to the user's coldkey wallet.
- `list`: Display detailed stake information for a wallet across all subnets.
- `move`: Move staked TAO between hotkeys while keeping the same coldkey ownership.
- `transfer`: Transfer stake between coldkeys while keeping the same hotkey ownership.
- `swap`: Swap stake between different subnets while keeping the same coldkey-hotkey pair ownership.
- `child`: Child Hotkey commands, alias: `children`
- `children`

### `btcli stake add`

Stake TAO to one or more hotkeys on specific or multiple netuids with your coldkey.

Stakes are always added through your coldkey's free balance. For stake movement, see the [`btcli stake move`](#btcli-stake-move) command.

Common Examples:

1. Interactive staking (guided prompts):

   ```sh
   btcli stake add
   ```

2. Safe staking with rate tolerance of 10% with partial transaction disabled:

   ```sh
   btcli stake add --amount 100 --netuid 1 --safe --tolerance 0.1 --no-partial
   ```

3. Allow partial stake if rates change with tolerance of 10%:

   ```sh
   btcli stake add --amount 300 --safe --partial --tolerance 0.1
   ```

4. Unsafe staking with no rate protection:

   ```sh
   btcli stake add --amount 300 --netuid 1 --unsafe
   ```

5. Stake to multiple hotkeys:

   ```sh
   btcli stake add --amount 200 --include-hotkeys hk_ss58_1,hk_ss58_2,hk_ss58_3
   ```

6. Stake the same amount of TAO into multiple subnets:

   ```sh
   btcli stake add -n 4,14,64 --amount 100
   ```

7. Stake all balance to a subnet:
   ```sh
   btcli stake add --all --netuid 3
   ```

Safe Staking Parameters:--safe: Enables rate tolerance checks
`--tolerance`: Maximum % rate change allowed (0.05 = 5%)
`--partial`: Complete partial stake if rates exceed tolerance

**Usage**:

```console
btcli stake add [OPTIONS]
```

**Options**:

| Option                                                                                                    | Type    | Description                                                                                                                               |
| --------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `--all-tokens`, `--all`, `-a`                                                                             |         | When set, the command stakes all the available TAO from the coldkey.                                                                      |
| `--amount`                                                                                                | FLOAT   | The amount of TAO to stake                                                                                                                |
| `--include-hotkeys`, `--hotkey-ss58-address`, `-in`                                                       | TEXT    | Specifies hotkeys by name or ss58 address to stake to. For example, `-in hk1,hk2`                                                         |
| `--exclude-hotkeys`, `-ex`                                                                                | TEXT    | Specifies hotkeys by name or ss58 address to not to stake to (use this option only with `--all-hotkeys`) i.e. `--all-hotkeys -ex hk3,hk4` |
| `--all-hotkeys`/ `--no-all-hotkeys`                                                                       |         | When set, this command stakes to all hotkeys associated with the wallet. Do not use if specifying hotkeys in `--include-hotkeys`.         |
| `--netuids`, `--netuid`, `-n`                                                                             | TEXT    | Netuid(s) to for which to add stake. Specify multiple netuids by separating with a comma, for example: `-n 0,1,2`.                        |
| `--all-netuids`/ `--no-all-netuid`                                                                        |         | Use all netuids.                                                                                                                          |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                               | TEXT    | Name of the wallet.                                                                                                                       |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                                   | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.                                                      |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`                                 | TEXT    | Hotkey of the wallet                                                                                                                      |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                               | TEXT    | The subtensor network to connect to. Default: finney.                                                                                     |
| `--tolerance`, `--rate-tolerance`                                                                         | FLOAT   | Set the rate tolerance percentage for transactions (e.g. 0.1 for 0.1%)                                                                    |
| `--safe-staking`, `--safe`/`--no-safe-staking`, `--unsafe`                                                |         | Enable or disable safe staking mode.                                                                                                      |
| `--allow-partial-stake`, `--partial`, `--allow`/`--no-allow-partial-stake`, `--no-partial`, `--not-allow` |         | Allow or prevent partial stakes                                                                                                           |
| `--period`, `-era`                                                                                        | INTEGER | Length (in blocks) for which the transaction should be valid.                                                                             |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                                       |         | Enable or disable interactive prompts.                                                                                                    |
| `--quiet`                                                                                                 |         | Display only critical information on the console.                                                                                         |
| `--verbose`                                                                                               |         | Enable verbose output.                                                                                                                    |
| `--json-output`, `--json-out`                                                                             |         | Outputs the result of the command as JSON.                                                                                                |
| `--help`                                                                                                  |         | Show this message and exit.                                                                                                               |

### `btcli stake auto`

Display auto-stake destinations for a wallet across all subnets.

**Usage:**

```bash
btcli stake auto [OPTIONS]
```

**Parameters:**

| Options                                                                     | Type | Description                                                                          |
| --------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` |      | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT | Name of the wallet.                                                                  |
| `--wallet-path`, `-p`, `--wallet_path`, `--wallet.path`                     | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--ss58`, `--coldkey_ss58`, `--coldkey.ss58_address`, `--coldkey.ss58`      |      | Coldkey address of the wallet                                                        |
| `--quiet`                                                                   |      | Display only critical information on the console.                                    |
| `--verbose`                                                                 |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |      | Show this message and exit.                                                          |

### `btcli stake set-auto`

Set the auto-stake destination hotkey for a coldkey.

**Usage:**

```bash
btcli stake set-auto [OPTIONS]
```

**Parameters:**

| Options                                                                     | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` |         | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `--wallet-path`, `-p`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--prompt/--no-prompt`, ` /--yes`, ` /--no_prompt`, ` /-y`                  |         | Enable or disable interactive prompts.                                               |
| `--wait_for_inclusion`                                                      |         | If `True`, waits until the transaction is included in a block.                       |
| `--wait_for_finalization`                                                   |         | If `True`, waits until the transaction is finalized on the blockchain.               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |         | Show this message and exit.                                                          |

### `btcli stake remove`

Unstake TAO from one or more hotkeys and transfer them back to the user's coldkey wallet.

This command is used to withdraw TAO or Alpha stake from different hotkeys.

Common Examples:

1. Interactive unstaking (guided prompts):

   ```
   btcli stake remove
   ```

2. Safe unstaking with 10% rate tolerance:

   ```
   btcli stake remove --amount 100 --netuid 1 --safe --tolerance 0.1
   ```

3. Allow partial unstake if rates change:

   ```
   btcli stake remove --amount 300 --safe --partial
   ```

4. Unstake from multiple hotkeys:

   ```
   btcli stake remove --amount 200 --include-hotkeys hk1,hk2,hk3
   ```

5. Unstake all from a hotkey:

   ```
   btcli stake remove --all
   ```

6. Unstake all Alpha from a hotkey and stake to Root:
   ```
   btcli stake remove --all-alpha
   ```

Safe Staking Parameters:
`--safe`: Enables rate tolerance checks during unstaking
`--tolerance`: Max allowed rate change (0.05 = 5%)
`--partial`: Complete partial unstake if rates exceed tolerance

**Usage**:

```console
btcli stake remove [OPTIONS]
```

**Options**:

| Option                                                                                                    | Type    | Description                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                               | TEXT    | The subtensor network to connect to. Default: finney.                                                                                         |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                               | TEXT    | Name of the wallet.                                                                                                                           |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                                   | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.                                                          |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`                                 | TEXT    | Hotkey of the wallet                                                                                                                          |
| `--netuid`,                                                                                               | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                                                                            |
| `--all-netuids`/ `--no-all-netuid`                                                                        |         | Use all netuids.                                                                                                                              |
| `--unstake-all`, `--all`                                                                                  |         | When set, this command unstakes all staked TAO + Alpha from the all hotkeys.                                                                  |
| `--unstake-all-alpha`, `--all-alpha`                                                                      |         | When set, this command unstakes all staked Alpha from the all hotkeys.                                                                        |
| `--amount`, `-a`                                                                                          | FLOAT   | The amount of TAO to unstake                                                                                                                  |
| `--hotkey-ss58-address`                                                                                   | TEXT    | The ss58 address of the hotkey to unstake from.                                                                                               |
| `--include-hotkeys`, `-in`                                                                                | TEXT    | Specifies hotkeys by name or ss58 address to unstake from. For example, `-in hk1,hk2`                                                         |
| `--exclude-hotkeys`, `-ex`                                                                                | TEXT    | Specifies hotkeys by name or ss58 address to not to unstake from (use this option only with `--all-hotkeys`) i.e. `--all-hotkeys -ex hk3,hk4` |
| `--all-hotkeys`/ `--no-all-hotkeys`                                                                       |         | When set, this command unstakes from all hotkeys associated with the wallet. Do not use if specifying hotkeys in `--include-hotkeys`.         |
| `--tolerance`, `--rate-tolerance`                                                                         | FLOAT   | Set the rate tolerance percentage for transactions (e.g. 0.1 for 0.1%)                                                                        |
| `--safe-staking`, `--safe`/`--no-safe-staking`, `--unsafe`                                                |         | Enable or disable safe staking mode.                                                                                                          |
| `--allow-partial-stake`, `--partial`, `--allow`/`--no-allow-partial-stake`, `--no-partial`, `--not-allow` |         | Allow or prevent partial stakes                                                                                                               |
| `--period`, `-era`                                                                                        | INTEGER | Length (in blocks) for which the transaction should be valid.                                                                                 |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                                       |         | Enable or disable interactive prompts.                                                                                                        |
| `--interactive`, `-t`                                                                                     |         | Enter interactive mode for unstaking.                                                                                                         |
| `--quiet`                                                                                                 |         | Display only critical information on the console.                                                                                             |
| `--verbose`                                                                                               |         | Enable verbose output.                                                                                                                        |
| `--json-output`, `--json-out`                                                                             |         | Outputs the result of the command as JSON.                                                                                                    |
| `--help`                                                                                                  |         | Show this message and exit.                                                                                                                   |

### `btcli stake list`

Display detailed stake information for a wallet across all subnets.

Shows stake allocations, exchange rates, and emissions for each hotkey.

Common Examples:

1. Basic stake overview:

```
btcli stake list --wallet.name my_wallet
```

2. Live updating view with refresh:

```
btcli stake list --wallet.name my_wallet --live
```

3. View specific coldkey by address:

```
btcli stake list --ss58 5Dk...X3q
```

4. Verbose output with full values:

```
btcli stake list --wallet.name my_wallet --verbose
```

**Usage**:

```console
btcli stake list [OPTIONS]
```

**Options**:

| Option                                                                                 | Type | Description                                                                          |
| -------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`            | TEXT | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                            | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`              | TEXT | Hotkey of the wallet                                                                 |
| `--ss58`, `--coldkey_ss58`, `--coldkey.ss58_address`, `--coldkey.ss58`, `--key`, `-k ` | TEXT | Coldkey address of the wallet                                                        |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                    |      | Enable or disable interactive prompts.                                               |
| `--live`                                                                               |      | Display live view of the table                                                       |
| `--quiet`                                                                              |      | Display only critical information on the console.                                    |
| `--verbose`                                                                            |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                                          |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                               |      | Show this message and exit.                                                          |

### `btcli stake move`

Move staked TAO between hotkeys while keeping the same coldkey ownership.

This command allows you to:

- Move stake from one hotkey to another hotkey
- Move stake between different subnets
- Keep the same coldkey ownership

You can specify:

- The origin subnet (--origin-netuid)
- The destination subnet (--dest-netuid)
- The destination hotkey (--dest-hotkey)
- The amount to move (--amount)

If no arguments are provided, an interactive selection menu will be shown.

**Example:**

```
btcli stake move
```

**Usage**:

```console
btcli stake move [OPTIONS]
```

**Options**:

| Option                                                                                             | Type    | Description                                                                          |
| -------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                        | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                        | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                            | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `from`, `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT    | Validator hotkey or SS58 where the stake is currently located.                       |
| `--origin-netuid`                                                                                  | INTEGER | Origin netuid.                                                                       |
| `--dest-netuid`                                                                                    | INTEGER | Destination netuid.                                                                  |
| `to`, `--dest-ss58`, `--dest`                                                                      | TEXT    | Destination validator hotkey SS58.                                                   |
| `--amount`                                                                                         | FLOAT   | The amount of TAO to stake                                                           |
| `--stake-all`, `--all`                                                                             |         | Stake all.                                                                           |
| `--period`, `-era`                                                                                 | INTEGER | Length (in blocks) for which the transaction should be valid.                        |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                                |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                                          |         | Display only critical information on the console.                                    |
| `--verbose`                                                                                        |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                                                      |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                                           |         | Show this message and exit.                                                          |

### `btcli stake transfer`

Transfer stake between coldkeys while keeping the same hotkey ownership.

This command allows you to:

- Transfer stake from one coldkey to another coldkey
- Keep the same hotkey ownership
- Transfer stake between different subnets

You can specify:

- The origin subnet (--origin-netuid)
- The destination subnet (--dest-netuid)
- The destination wallet/address (--dest)
- The amount to transfer (--amount)

If no arguments are provided, an interactive selection menu will be shown.

**Example:**

Transfer 100 TAO from subnet 1 to subnet 2:

```
btcli stake transfer --origin-netuid 1 --dest-netuid 2 --dest wallet2 --amount 100
```

Using SS58 address:

```
btcli stake transfer --origin-netuid 1 --dest-netuid 2 --dest 5FrLxJsyJ5x9n2rmxFwosFraxFCKcXZDngEP9H7qjkKgHLcK --amount 100
```

**Usage**:

```console
btcli stake transfer [OPTIONS]
```

**Options**:

| Option                                                                                     | Type    | Description                                                                          |
| ------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                    | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT    | Hotkey name or SS58 address of the hotkey                                            |
| `--origin-netuid`                                                                          | INTEGER | The netuid to transfer stake from.                                                   |
| `--dest-netuid`                                                                            | INTEGER | The netuid to transfer stake to.                                                     |
| `--dest-ss58`, `--dest`                                                                    | TEXT    | The destination wallet name or SS58 address to transfer stake to.                    |
| `--amount`                                                                                 | FLOAT   | The amount of stake to transfer.                                                     |
| `--stake-all`, `--all`                                                                     |         | Stake all.                                                                           |
| `--period`, `-era`                                                                         | INTEGER | Length (in blocks) for which the transaction should be valid.                        |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                        |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                                  |         | Display only critical information on the console.                                    |
| `--verbose`                                                                                |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                                              |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                                   |         | Show this message and exit.                                                          |

### `btcli stake swap`

Swap stake between different subnets while keeping the same coldkey-hotkey pair ownership.

This command allows you to:

- Move stake from one subnet to another subnet
- Keep the same coldkey ownership
- Keep the same hotkey ownership

You can specify:

- The origin subnet (--origin-netuid)
- The destination subnet (--dest-netuid)
- The amount to swap (--amount)

If no arguments are provided, an interactive selection menu will be shown.

**Example:**

Swap 100 TAO from subnet 1 to subnet 2:

```
btcli stake swap --wallet-name default --wallet-hotkey default --origin-netuid 1 --dest-netuid 2 --amount 100
```

**Usage**:

```console
btcli stake swap [OPTIONS]
```

**Options**:

| Option                                                                                     | Type    | Description                                                                          |
| ------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                    | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT    | Hotkey name or SS58 address of the hotkey                                            |
| `--origin-netuid`, `-o`                                                                    | INTEGER | The netuid to swap stake from.                                                       |
| `--dest-netuid`, `-d`                                                                      | INTEGER | The netuid to swap stake to.                                                         |
| `--amount`, `-a`                                                                           | FLOAT   | The amount of stake to swap.                                                         |
| `--swap-all`, `--all`                                                                      |         | Swap all available stake.                                                            |
| `--period`, `-era`                                                                         | INTEGER | Length (in blocks) for which the transaction should be valid.                        |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                        |         | Enable or disable interactive prompts.                                               |
| `--wait-for-inclusion`/ `--no-wait-for-inclusion`                                          |         | If `True`, waits until the transaction is included in a block.                       |
| `--wait-for-finalization`/ `--no-wait-for-finalization`                                    |         | If `True`, waits until the transaction is finalized on the blockchain.               |
| `--quiet`                                                                                  |         | Display only critical information on the console.                                    |
| `--verbose`                                                                                |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                                              |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                                   |         | Show this message and exit.                                                          |

### `btcli stake child`

**Usage**:

```console
btcli stake child [OPTIONS] COMMAND [ARGS]...

alias: children
```

**Options**:

- `--help`: Show this message and exit.

**Commands**:

- `get`: Get all the child hotkeys on a specified subnet.
- `set`: Set child hotkeys on a specified subnet (or all). Overrides currently set children.
- `revoke`: Remove all children hotkeys on a specified subnet (or all).
- `take`: Get and set your child hotkey take on a specified subnet.

#### `btcli stake child get`

Get all the child hotkeys on a specified subnet.

Users can specify the subnet and see the child hotkeys and the proportion that is given to them. This command is used to view the authority delegated to different hotkeys on the subnet.

**Example:**

```
btcli stake child get --netuid 1
```

```
btcli stake child get --all-netuids
```

**Usage**:

```console
btcli stake child get [OPTIONS]

alias: children
```

**Options**:

| Option                                                                                     | Type    | Description                                                                          |
| ------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                    | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT    | Hotkey name or SS58 address of the hotkey                                            |
| `--netuid`                                                                                 | INTEGER | The netuid of the subnet.                                                            |
| `--all-netuids`, `--all`, `--allnetuids`                                                   |         | When set, gets the child hotkeys from all the subnets.                               |
| `--quiet`                                                                                  |         | Display only critical information on the console.                                    |
| `--verbose`                                                                                |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                                              |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                                   |         | Show this message and exit.                                                          |

#### `btcli stake child set`

Set child hotkeys on specified subnets.

Users can specify the 'proportion' to delegate to child hotkeys (ss58 address). The sum of proportions cannot be greater than 1.

This command is used to delegate authority to different hotkeys, securing their position and influence on the subnet.

**Example:**

```
btcli stake child set -c 5FCL3gmjtQV4xxxxuEPEFQVhyyyyqYgNwX7drFLw7MSdBnxP -c 5Hp5dxxxxtGg7pu8dN2btyyyyVA1vELmM9dy8KQv3LxV8PA7 --hotkey default --netuid 1 -p 0.3 -p 0.7
```

**Usage**:

```console
btcli stake child set [OPTIONS]

alias: children
```

**Options**:

| Option                                                                                     | Type    | Description                                                                                      |
| ------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------ |
| `--children`, `-c`                                                                         | TEXT    | Enter child hotkeys (ss58)                                                                       |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                | TEXT    | The subtensor network to connect to. Default: finney.                                            |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                | TEXT    | Name of the wallet.                                                                              |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                    | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.             |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT    | Hotkey name or SS58 address of the hotkey                                                        |
| `--netuid`                                                                                 | INTEGER | The netuid of the subnet in the network.                                                         |
| `--all-netuids`/`--no-all-netuids`                                                         |         | Use all netuids.                                                                                 |
| `--proportions`, `--prop`                                                                  | FLOAT   | Enter the stake weight proportions for the child hotkeys (sum should be less than or equal to 1) |
| `--wait-for-inclusion`/ `--no-wait-for-inclusion`                                          |         | If `True`, waits until the transaction is included in a block.                                   |
| `--wait-for-finalization`/ `--no-wait-for-finalization`                                    |         | If `True`, waits until the transaction is finalized on the blockchain.                           |
| `--quiet`                                                                                  |         | Display only critical information on the console.                                                |
| `--verbose`                                                                                |         | Enable verbose output.                                                                           |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                        |         | Enable or disable interactive prompts.                                                           |
| `--json-output`, `--json-out`                                                              |         | Outputs the result of the command as JSON.                                                       |
| `--help`                                                                                   |         | Show this message and exit.                                                                      |

#### `btcli stake child revoke`

Remove all children hotkeys on a specified subnet.

This command is used to remove delegated authority from all child hotkeys, removing their position and influence on the subnet.

**Example:**

```
btcli stake child revoke --hotkey &lt;parent_hotkey&gt; --netuid 1
```

**Usage**:

```console
btcli stake child revoke [OPTIONS]

alias: children
```

**Options**:

| Option                                                                                     | Type    | Description                                                                          |
| ------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                    | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT    | Hotkey name or SS58 address of the hotkey                                            |
| `--netuid`                                                                                 | INTEGER | The netuid of the subnet in the network.                                             |
| `--all-netuids`, `--all`, `--allnetuids`                                                   |         | When this flag is used it sets child hotkeys on all the subnets.                     |
| `--wait-for-inclusion`/ `--no-wait-for-inclusion`                                          |         | If `True`, waits until the transaction is included in a block.                       |
| `--wait-for-finalization`/ `--no-wait-for-finalization`                                    |         | If `True`, waits until the transaction is finalized on the blockchain.               |
| `--quiet`                                                                                  |         | Display only critical information on the console.                                    |
| `--verbose`                                                                                |         | Enable verbose output.                                                               |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                        |         | Enable or disable interactive prompts.                                               |
| `--json-output`, `--json-out`                                                              |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                                   |         | Show this message and exit.                                                          |

#### `btcli stake child take`

Get and set your child hotkey take on a specified subnet.

The child hotkey take must be between 0 - 18%.

**Example:**

To get the current take value, do not use the '--take' option:

    ```
    btcli stake child take --hotkey &lt;child_hotkey&gt; --netuid 1
    ```

To set a new take value, use the '--take' option:

    ```
    btcli stake child take --hotkey &lt;child_hotkey&gt; --take 0.12 --netuid 1
    ```

**Usage**:

```console
btcli stake child take [OPTIONS]

alias: children
```

**Options**:

| Option                                                                                     | Type    | Description                                                                                                    |
| ------------------------------------------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                | TEXT    | The subtensor network to connect to. Default: finney.                                                          |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                | TEXT    | Name of the wallet.                                                                                            |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                    | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.                           |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT    | Hotkey name or SS58 address of the hotkey                                                                      |
| `--netuid`                                                                                 | INTEGER | The netuid of the subnet in the network.                                                                       |
| `--all-netuids`, `--all`, `--allnetuids`                                                   |         | When this flag is used it sets child hotkeys on all the subnets.                                               |
| `--take`                                                                                   | FLOAT   | Use to set the take value for your child hotkey. When not used, the command will fetch the current take value. |
| `--wait-for-inclusion`/ `--no-wait-for-inclusion`                                          |         | If `True`, waits until the transaction is included in a block.                                                 |
| `--wait-for-finalization`/ `--no-wait-for-finalization`                                    |         | If `True`, waits until the transaction is finalized on the blockchain.                                         |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                        |         | Enable or disable interactive prompts.                                                                         |
| `--quiet`                                                                                  |         | Display only critical information on the console.                                                              |
| `--verbose`                                                                                |         | Enable verbose output.                                                                                         |
| `--json-output`, `--json-out`                                                              |         | Outputs the result of the command as JSON.                                                                     |
| `--help`                                                                                   |         | Show this message and exit.                                                                                    |

## `btcli sudo`

**Usage**:

```console
btcli sudo [OPTIONS] COMMAND [ARGS]...

alias: su
```

**Options**:

- `--help`: Show this message and exit.

**Commands**:

- `set`: Used to set hyperparameters for a specific subnet.
- `get`: Shows a list of the hyperparameters for the specified subnet.
- `senate`: Shows the Senate members of the Bittensor's governance protocol.
- `proposals`: View active proposals for the senate in the Bittensor's governance protocol.
- `senate-vote`: Cast a vote on an active proposal in Bittensor's governance protocol.
- `set-take`: Allows users to change their delegate take percentage.
- `get-take`: Allows users to check their delegate take percentage.
- `trim`: Allows subnet owners to trim UIDs on their subnet to a specified max number of netuids.

### `btcli sudo set`

Used to set hyperparameters for a specific subnet.

This command allows subnet owners to modify hyperparameters such as its tempo, emission rates, and other hyperparameters.

**Example:**

```
btcli sudo set --netuid 1 --param tempo --value 400
```

**Usage**:

```console
btcli sudo set [OPTIONS]
```

**Options**:

| Option                                                                                     | Type    | Description                                                                          |
| ------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                    | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT    | Hotkey name or SS58 address of the hotkey                                            |
| `--netuid`                                                                                 | INTEGER | The netuid of the subnet in the network.                                             |
| `--param`, `--parameter`                                                                   | TEXT    | The subnet hyperparameter to set                                                     |
| `--value`                                                                                  | TEXT    | Value to set the hyperparameter to.                                                  |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                        |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                                  |         | Display only critical information on the console.                                    |
| `--verbose`                                                                                |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                                              |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                                   |         | Show this message and exit.                                                          |

### `btcli sudo get`

Shows a list of the hyperparameters for the specified subnet.

**Example:**

```
btcli sudo get --netuid 1
```

**Usage**:

```console
btcli sudo get [OPTIONS]
```

**Options**:

| Option                                                                      | Type    | Description                                           |
| --------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney. |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network.              |
| `--quiet`                                                                   |         | Display only critical information on the console.     |
| `--verbose`                                                                 |         | Enable verbose output.                                |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.            |
| `--help`                                                                    |         | Show this message and exit.                           |

### `btcli sudo senate`

Shows the Senate members of the Bittensor's governance protocol.

This command lists the delegates involved in the decision-making process of the Bittensor network, showing their names and wallet addresses. This information is crucial for understanding who holds governance roles within the network.

**Example:**

```
btcli sudo senate
```

**Usage**:

```console
btcli sudo senate [OPTIONS]
```

**Options**:

| Option                                                                      | Type | Description                                           |
| --------------------------------------------------------------------------- | ---- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney. |
| `--quiet`                                                                   |      | Display only critical information on the console.     |
| `--verbose`                                                                 |      | Enable verbose output.                                |
| `--json-output`, `--json-out`                                               |      | Outputs the result of the command as JSON.            |
| `--help`                                                                    |      | Show this message and exit.                           |

### `btcli sudo proposals`

View active proposals for the senate in the Bittensor's governance protocol.

This command displays the details of ongoing proposals, including proposal hashes, votes, thresholds, and proposal data.

**Example:**

```
btcli sudo proposals
```

**Usage**:

```console
btcli sudo proposals [OPTIONS]
```

**Options**:

| Option                                                                      | Type | Description                                           |
| --------------------------------------------------------------------------- | ---- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney. |
| `--quiet`                                                                   |      | Display only critical information on the console.     |
| `--verbose`                                                                 |      | Enable verbose output.                                |
| `--json-output`, `--json-out`                                               |      | Outputs the result of the command as JSON.            |
| `--help`                                                                    |      | Show this message and exit.                           |

### `btcli sudo senate-vote`

Cast a vote on an active proposal in Bittensor's governance protocol.

This command is used by Senate members to vote on various proposals that shape the network's future. Use `btcli sudo proposals` to see the active proposals and their hashes.

**Usage:**
The user must specify the hash of the proposal they want to vote on. The command then allows the Senate member to cast a 'Yes' or 'No' vote, contributing to the decision-making process on the proposal. This command is crucial for Senate members to exercise their voting rights on key proposals. It plays a vital role in the governance and evolution of the Bittensor network.

**Example:**

```
btcli sudo senate-vote --proposal &lt;proposal_hash&gt;
```

**Usage**:

```console
btcli sudo senate-vote [OPTIONS]

alias: senate_vote
```

**Options**:

| Option                                                                                     | Type | Description                                                                          |
| ------------------------------------------------------------------------------------------ | ---- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                | TEXT | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                    | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT | Hotkey name or SS58 address of the hotkey                                            |
| `--proposal`, `--proposal-hash`                                                            | TEXT | The hash of the proposal to vote on.                                                 |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                        |      | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                                  |      | Display only critical information on the console.                                    |
| `--verbose`                                                                                |      | Enable verbose output.                                                               |
| `--vote-aye/--vote-nay`                                                                    |      | The vote cast on the proposal                                                        |
| `--help`                                                                                   |      | Show this message and exit.                                                          |

### `btcli sudo set-take`

Allows users to change their delegate take percentage.

This command can be used to update the delegate takes. To run the command, the user must have a configured wallet with both hotkey and coldkey.
The command makes sure the new take value is within 0-18% range.

**Example:**

```
btcli sudo set-take --wallet-name my_wallet --wallet-hotkey my_hotkey
```

**Usage**:

```console
btcli sudo set-take [OPTIONS]

alias: set_take
```

**Options**:

| Option                                                                                     | Type  | Description                                                                          |
| ------------------------------------------------------------------------------------------ | ----- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                | TEXT  | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                | TEXT  | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                    | TEXT  | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT  | Hotkey name or SS58 address of the hotkey                                            |
| `--take`                                                                                   | FLOAT | The new take value.                                                                  |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`                        |       | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                                  |       | Display only critical information on the console.                                    |
| `--verbose`                                                                                |       | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                                              |       | Outputs the result of the command as JSON.                                           |
| `--help`                                                                                   |       | Show this message and exit.                                                          |

### `btcli sudo get-take`

Allows users to check their delegate take percentage.

This command can be used to fetch the delegate take of your hotkey.

**Example:**

```
btcli sudo get-take --wallet-name my_wallet --wallet-hotkey my_hotkey
```

**Usage**:

```console
btcli sudo get-take [OPTIONS]

alias: get_take
```

**Options**:

| Option                                                                                     | Type | Description                                                                          |
| ------------------------------------------------------------------------------------------ | ---- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`                | TEXT | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                                | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                                    | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`, `--hotkey-ss58` | TEXT | Hotkey name or SS58 address of the hotkey                                            |
| `--quiet`                                                                                  |      | Display only critical information on the console.                                    |
| `--verbose`                                                                                |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                                              |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                                   |      | Show this message and exit.                                                          |

### `btcli sudo trim`

Allows subnet owners to trim UIDs on their subnet to a specified max number of netuids.

**EXAMPLE**

```bash
btcli sudo trim --netuid 95 --wallet-name my_wallet --wallet-hotkey my_hotkey --max 64
```

**Usage:**

```bash
btcli sudo trim [OPTIONS]
```

**Parameters:**

| Options                                                                     | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` |         | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `--wallet-path`, `-p`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--hotkey`, `-H`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                 |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| `--max`, `--max-uids`                                                       | INTEGER | The maximum number of allowed uids to which to trim                                  |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--prompt/--no-prompt`, ` /--yes`, ` /--no_prompt`, ` /-y`                  |         | Enable or disable interactive prompts.                                               |
| `--help`                                                                    |         | Show this message and exit.                                                          |

## `btcli subnets`

**Usage**:

```console
btcli subnets [OPTIONS] COMMAND [ARGS]...

aliases: subnet, s
```

**Options**:

- `--help`: Show this message and exit.

**Commands**:

- `mechanisms`: Subnet mechanism commands, alias: `mech`
- `hyperparameters`: Shows a list of the hyperparameters for the specified subnet.
- `list`: List all subnets and their detailed information.
- `burn-cost`: Shows the required amount of TAO to be recycled for creating a new subnet, i.e., cost of registering a new subnet.
- `create`: Registers a new subnet on the network.
- `pow-register`: Register a neuron (a subnet validator or a subnet miner) using Proof of Work (POW).
- `register`: Register a neuron (a subnet validator or a subnet miner) in the specified subnet by recycling some TAO.
- `metagraph`: Displays detailed information about a...
- `show`: Displays detailed information about a subnet including participants and their state.
- `price`: Shows the historical price of a subnet for the past 4 hours.
- `check-start`: Checks if a subnet's emission schedule can be started.
- `set-identity`: Get the identity information for a subnet.
- `get-identity`: Set or update the identity information for a subnet.
- `set-symbol`: Allows the user to update their subnet symbol to a different available symbol. The full list of available symbols can be found here: https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/symbols.rs#L8

### `btcli subnet mechanisms`

**Usage**:

```console
btcli s mechanisms [OPTIONS] COMMAND [ARGS]...

alias: mech
```

**Options**:

- `--help`: Show this message and exit.

**Commands**:

- `count`: Display how many mechanisms are registered under a subnet.
- `set`: Configure how many mechanisms are registered for a subnet.
- `emissions`: Display the current emission split across mechanisms for a subnet.
- `split-emissions`: Update the emission split across mechanisms for a subnet.

#### `btcli subnet mechanisms count`

Display how many mechanisms are registered under a subnet. Includes the base mechanism (index 0). Helpful for verifying the active mechanism counts in a subnet.

```bash
btcli subnet mechanisms count --netuid 12
```

**Usage:**

```bash
btcli subnet mechanisms count [OPTIONS]
```

**Parameters:**

| Options                                                                     | Type    | Description                                           |
| --------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` |         | The subtensor network to connect to. Default: finney. |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).    |
| `--quiet`                                                                   |         | Display only critical information on the console.     |
| `--verbose`                                                                 |         | Enable verbose output.                                |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.            |
| `--help`                                                                    |         | Show this message and exit.                           |

#### `btcli subnet mechanisms set`

Configure how many mechanisms are registered for a subnet.

The base mechanism at index 0 and new ones are incremented by 1.

Common Examples:

1. Prompt for the new mechanism count interactively:

```bash
btcli subnet mechanisms set --netuid 12
```

2. Set the count to 2 using a specific wallet:

```bash
btcli subnet mechanisms set --netuid 12 --count 2 --wallet.name my_wallet --wallet.hotkey admin
```

**Usage:**

```bash
btcli subnet mechanisms set [OPTIONS]
```

**Parameters:**

| Options                                                                     | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` |         | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `--wallet-path`, `-p`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--hotkey`, `-H`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                 |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| `--count`, `--mech-count`                                                   | INTEGER | Number of mechanisms to set for the subnet.                                          |
| `--wait_for_inclusion`                                                      |         | If `True`, waits until the transaction is included in a block.                       |
| `--wait_for_finalization`                                                   |         | If `True`, waits until the transaction is finalized on the blockchain.               |
| `--prompt/--no-prompt`, ` /--yes`, ` /--no_prompt`, ` /-y`                  |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |         | Show this message and exit.                                                          |

#### `btcli subnet mechanisms emissions`

Display the current emission split across mechanisms for a subnet. Shows raw `U16` weights alongside percentage shares for each mechanism. Useful for verifying the emission split in a subnet.

```bash
btcli subnet mechanisms emissions --netuid 12
```

**Usage:**

```bash
btcli subnet mechanisms emissions [OPTIONS]
```

**Parameters:**

| Options                                                                     | Type    | Description                                           |
| --------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` |         | The subtensor network to connect to. Default: finney. |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).    |
| `--quiet`                                                                   |         | Display only critical information on the console.     |
| `--verbose`                                                                 |         | Enable verbose output.                                |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.            |
| `--help`                                                                    |         | Show this message and exit.                           |

#### `btcli subnet mechanisms split-emissions`

Update the emission split across mechanisms for a subnet.

Accepts comma-separated weights (`U16` values or percentages). When `--split` is omitted and prompts remain enabled, you will be guided interactively and the CLI automatically normalises the weights.

Common Examples:

1. Configure the split interactively:

```bash
btcli subnet mechanisms split-emissions --netuid 12
```

2. Apply a 70/30 distribution in one command:

```bash
btcli subnet mechanisms split-emissions --netuid 12 --split 70,30 --wallet.name my_wallet --wallet.hotkey admin
```

**Usage:**

```bash
btcli subnet mechanisms split-emissions [OPTIONS]

alias: emissions-split
```

**Parameters:**

| Options                                                                     | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` |         | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `--wallet-path`, `-p`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--hotkey`, `-H`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                 |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| `--split`                                                                   | TEXT    | Comma-separated relative weights for each mechanism (normalised automatically).      |
| `--wait_for_inclusion`                                                      |         | If `True`, waits until the transaction is included in a block.                       |
| `--wait_for_finalization`                                                   |         | If `True`, waits until the transaction is finalized on the blockchain.               |
| `--prompt/--no-prompt`, ` /--yes`, ` /--no_prompt`, ` /-y`                  |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |         | Show this message and exit.                                                          |

### `btcli subnets hyperparameters`

Shows a list of the hyperparameters for the specified subnet.

**Example:**

```
btcli sudo get --netuid 1
```

**Usage**:

```console
btcli subnets hyperparameters [OPTIONS]
```

**Options**:

| Option                                                                      | Type    | Description                                           |
| --------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney. |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).    |
| `--quiet`                                                                   |         | Display only critical information on the console.     |
| `--verbose`                                                                 |         | Enable verbose output.                                |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.            |
| `--help`                                                                    |         | Show this message and exit.                           |

### `btcli subnets list`

List all subnets and their detailed information.

Common Examples:

1.  List all subnets:

```
btcli subnets list
```

2.  List all subnets in live mode:

```
btcli subnets list --live
```

**Output Columns:**

- **Netuid** - Subnet identifier number
- **Name** - Subnet name with currency symbol (τ/α/β etc)
- **Price** (τ_in/α_in) - Exchange rate (TAO per alpha token)
- **Market Cap** (α \* Price) - Total value in TAO (alpha tokens × price)
- **Emission** (τ) - TAO rewards emitted per block to subnet
- **P** (τ_in, α_in) - Pool reserves (Tao reserves, alpha reserves) in liquidity pool
- **Stake** (α_out) - Total staked alpha tokens across all hotkeys (alpha outstanding)
- **Supply** (α) - Circulating alpha token supply
- **Tempo** (k/n) - Block interval for subnet updates

**Example:**

```
btcli subnets list
```

**Usage**:

```console
btcli subnets list [OPTIONS]
```

**Options**:

| Option                                                                      | Type | Description                                           |
| --------------------------------------------------------------------------- | ---- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney. |
| `--quiet`                                                                   |      | Display only critical information on the console.     |
| `--verbose`                                                                 |      | Enable verbose output.                                |
| `--live`                                                                    |      | Display live view of the table                        |
| `--json-output`, `--json-out`                                               |      | Outputs the result of the command as JSON.            |
| `--help`                                                                    |      | Show this message and exit.                           |

### `btcli subnets burn-cost`

Shows the required amount of TAO to be recycled for creating a new subnet, i.e., cost of registering a new subnet.

The current implementation anneals the cost of creating a subnet over a period of two days. If the displayed cost is unappealing to you, check back in a day or two to see if it has decreased to a more affordable level.

**Example:**

```
btcli subnets burn_cost
```

**Usage**:

```console
btcli subnets burn-cost [OPTIONS]

alias: burn_cost
```

**Options**:

| Option                                                                      | Type | Description                                           |
| --------------------------------------------------------------------------- | ---- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney. |
| `--quiet`                                                                   |      | Display only critical information on the console.     |
| `--verbose`                                                                 |      | Enable verbose output.                                |
| `--json-output`, `--json-out`                                               |      | Outputs the result of the command as JSON.            |
| `--help`                                                                    |      | Show this message and exit.                           |

### `btcli subnets create`

Creates a new subnet on the network.

This command allows you to create a new subnet and set the subnet's identity.
You also have the option to set your own identity after the registration is complete.

Common Examples:

1. Interactive subnet creation:

```
btcli subnets create
```

2. Create with GitHub repo and contact email:

```
btcli subnets create --subnet-name MySubnet --github-repo https://github.com/myorg/mysubnet --subnet-contact team@mysubnet.net
```

**Usage**:

```console
btcli subnets create [OPTIONS]
```

**Options**:

| Option                                                                      | Type | Description                                                                          |
| --------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT | Hotkey of the wallet                                                                 |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT | The subtensor network to connect to. Default: finney.                                |
| `--subnet-name`                                                             | TEXT | Name of the subnet.                                                                  |
| `--github-repo`, `repo`                                                     | TEXT | The GitHub repository URL.                                                           |
| `--subnet-contact`, `--contact`, `--email`                                  | TEXT | Contact email for subnet.                                                            |
| `--subnet-url`, `--url`                                                     | TEXT | The web URL for the subnet.                                                          |
| `--discord-handle`, `discord`                                               | TEXT | The Discord handle for the subnet.                                                   |
| `--description`                                                             | TEXT | The description for the subnet.                                                      |
| `--additional-info`                                                         | TEXT | Additional details for the subnet.                                                   |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |      | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                   |      | Display only critical information on the console.                                    |
| `--verbose`                                                                 |      | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |      | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |      | Show this message and exit.                                                          |

### `btcli subnets pow-register`

Register a neuron (a subnet validator or a subnet miner) using Proof of Work (POW).

This method is an alternative registration process that uses computational work for securing a neuron's place on the subnet.

The command starts by verifying the existence of the specified subnet. If the subnet does not exist, it terminates with an error message. On successful verification, the POW registration process is initiated, which requires solving computational puzzles.

The command also supports additional wallet and subtensor arguments, enabling further customization of the registration process.

**Example:**

```
btcli pow_register --netuid 1 --num_processes 4 --cuda
```

Note: This command is suitable for users with adequate computational resources to participate in POW registration.
It requires a sound understanding of the network's operations and POW mechanics. Users should ensure their systems meet the necessary hardware and software requirements, particularly when opting for CUDA-based GPU acceleration.

This command may be disabled by the subnet owner. For example, on netuid 1 this is permanently disabled.

**Usage**:

```console
btcli subnets pow-register [OPTIONS]

alias pow_register
```

**Options**:

| Option                                                                      | Type    | Description                                                                            |
| --------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                    |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.   |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                   |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                  |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                     |
| `--processors`                                                              | INTEGER | Number of processors to use for POW registration.                                      |
| `-u`, `--update-interval`                                                   | INTEGER | The number of nonces to process before checking for the next block during registration |
| `--output-in-place`/`--no-output-in-place`                                  |         | Whether to output the registration statistics in-place.                                |
| `--verbose`, `-v`                                                           |         | Enable verbose output.                                                                 |
| `--use-cuda`, `--cuda`/`--no-use-cuda`, `--no-cuda`                         |         | Set the flag to use CUDA for POW registration.                                         |
| `--dev-id`, `-d`                                                            | INTEGER | Set the CUDA device id(s), in the order of the device speed (0 is the fastest).        |
| `--threads-per-block`, `-tpb`                                               | INTEGER | Set the number of threads per block for CUDA.                                          |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |         | Enable or disable interactive prompts.                                                 |
| `--help`                                                                    |         | Show this message and exit.                                                            |

### `btcli subnets register`

Register a neuron (a subnet validator or a subnet miner) in the specified subnet by recycling some TAO.

Before registering, the command checks if the specified subnet exists and whether the user's balance is sufficient to cover the registration cost.

The registration cost is determined by the current recycle amount for the specified subnet. If the balance is insufficient or the subnet does not exist, the command will exit with an error message.

**Example:**

```
btcli subnets register --netuid 1
```

**Usage**:

```console
btcli subnets register [OPTIONS]
```

**Options**:

| Option                                                                      | Type    | Description                                                                                                                                                                                          |
| --------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                                                                                                                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                                                                                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.                                                                                                                 |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                                                                                                                                 |
| `--netuid`,                                                                 | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                                                                                                                                   |
| `--period`, `-era`                                                          | INTEGER | Length (in blocks) for which the transaction should be valid. Note that it is possible that if you use an era for this transaction that you may pay a different fee to register than the one stated. |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |         | Enable or disable interactive prompts.                                                                                                                                                               |
| `--quiet`                                                                   |         | Display only critical information on the console.                                                                                                                                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                                                                                                                                               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                                                                                                                                           |
| `--help`                                                                    |         | Show this message and exit.                                                                                                                                                                          |

### `btcli subnets metagraph`

Inspect the metagraph for a subnet.

Shows miners, validators, stake, ranks, emissions, and other runtime stats. When multiple mechanisms exist, the CLI prompts for one unless `--mechid` is supplied. Netuid `0` always uses mechid `0`.

Common Examples:

1. Inspect the mechanism with prompts for selection:

```bash
btcli subnets metagraph --netuid 12
```

2. Pick mechanism 1 explicitly:

```bash
btcli subnets metagraph --netuid 12 --mechid 1
```

**Usage**:

```console
btcli subnets metagraph [OPTIONS]
```

**Options**:

| Option                                                                      | Type    | Description                                           |
| --------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney. |
| `--netuid`,                                                                 | INTEGER | The netuid of the subnet in the network, (e.g. 1).    |
| `--mechid`, `--mech-id`, `--mech_id`, `--mechanism_id`, `--mechanism-id`    | INTEGER | Mechanism ID within the subnet (defaults to 0).       |
| `--sort`                                                                    |         | Sort the subnets by uid.                              |
| `--quiet`                                                                   |         | Display only critical information on the console.     |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |         | Enable or disable interactive prompts.                |
| `--verbose`                                                                 |         | Enable verbose output.                                |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.            |
| `--help`                                                                    |         | Show this message and exit.                           |

### `btcli subnets show`

Inspect the metagraph for a subnet.

Shows miners, validators, stake, ranks, emissions, and other runtime stats. When multiple mechanisms exist, the CLI prompts for one unless `--mechid` is supplied. Netuid `0` always uses mechid `0`.

Common Examples:

1. Inspect the mechanism with prompts for selection:

```bash
btcli subnets show --netuid 12
```

2. Pick mechanism 1 explicitly:

```bash
btcli subnets show --netuid 12 --mechid 1
```

**Usage**:

```console
btcli subnets show [OPTIONS]
```

**Options**:

| Option                                                                      | Type    | Description                                           |
| --------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney. |
| `--netuid`,                                                                 | INTEGER | The netuid of the subnet in the network, (e.g. 1).    |
| `--mechid`, `--mech-id`, `--mech_id`, `--mechanism_id`, `--mechanism-id`    | INTEGER | Mechanism ID within the subnet (defaults to 0).       |
| `--sort`                                                                    |         | Sort the subnets by uid.                              |
| `--quiet`                                                                   |         | Display only critical information on the console.     |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |         | Enable or disable interactive prompts.                |
| `--verbose`                                                                 |         | Enable verbose output.                                |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.            |
| `--help`                                                                    |         | Show this message and exit.                           |

### `btcli subnets price`

Shows the historical price of a subnet for the past 4 hours.

This command displays the historical price of a subnet for the past 4 hours.

- If the `--all` flag is used, the command will display the price for all subnets in html format.
- If the `--html` flag is used, the command will display the price in an HTML chart.
- If the `--log-scale` flag is used, the command will display the price in log scale.
- If no html flag is used, the command will display the price in the cli.

**Example:**

```bash
btcli subnets price --netuid 1
```

```bash
btcli subnets price --netuid 1 --html --log
```

```bash
btcli subnets price --all --html
```

```bash
btcli subnets price --netuids 1,2,3,4 --html
```

**Usage**:

```bash
btcli subnets price [OPTIONS]
```

**Options**:

| Option                                                                      | Type    | Description                                                                                     |
| --------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                           |
| `--netuids`, `--netuid`, `-n`                                               | TEXT    | Netuids to show the price for. Separate multiple netuids with a comma, for example: `-n 0,1,2`. |
| `--interval-hours`, `--interval`                                            | INTEGER | The number of hours to show the historical price for.                                           |
| `--all-netuids`, `--all`                                                    |         | Show the price for all subnets.                                                                 |
| `--log-scale`, `--log`                                                      |         | Show the price in log scale.                                                                    |
| `--current`                                                                 |         | Show only the current data, and no historical data.                                             |
| `--html`                                                                    |         | Display the table as HTML in the browser.                                                       |
| `--quiet`                                                                   |         | Display only critical information on the console.                                               |
| `--verbose`                                                                 |         | Enable verbose output.                                                                          |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                                      |
| `--help`                                                                    |         | Show this message and exit.                                                                     |

### `btcli subnets check-start`

Checks if a subnet's emission schedule can be started. This command verifies if a subnet's emission schedule can be started based on the subnet's registration block.

**Example:**

```bash
btcli subnets check_start --netuid 1
```

**Usage**

```bash
btcli subnets check-start [OPTIONS]

alias check_start
```

**Options**:

| Option                                                                      | Type    | Description                                           |
| --------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney. |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).    |
| `--quiet`                                                                   |         | Display only critical information on the console.     |
| `--verbose`                                                                 |         | Enable verbose output.                                |
| `--help`                                                                    |         | Show this message and exit.                           |

### `btcli subnets set-identity`

Set or update the identity information for a subnet. This command allows subnet owners to set or update identity information like name, GitHub repo, contact details, etc.

**Examples:**

1. Interactive subnet identity setting:

```bash
btcli subnets set-identity --netuid 1
```

2.  Set subnet identity with specific values:

```bash
btcli subnets set-identity --netuid 1 --subnet-name MySubnet --github-repo https://github.com/myorg/mysubnet --subnet-contact team@mysubnet.net
```

**Usage**:

```sh
btcli subnets set-identity [OPTIONS]

alias: set_identity
```

**Options**:

| Option                                                                      | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                 |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| `--subnet-name`, `--name`                                                   | TEXT    | Name of the subnet.                                                                  |
| `--github-repo`, `repo`                                                     | TEXT    | The GitHub repository URL.                                                           |
| `--subnet-contact`, `--contact`, `--email`                                  | TEXT    | Contact email for subnet.                                                            |
| `--subnet-url`, `--url`                                                     | TEXT    | The web URL for the subnet.                                                          |
| `--discord-handle`, `discord`                                               | TEXT    | The Discord handle for the subnet.                                                   |
| `--description`                                                             | TEXT    | The description for the subnet.                                                      |
| `--additional-info`                                                         | TEXT    | Additional details for the subnet.                                                   |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |         | Show this message and exit.                                                          |

### `btcli subnets get-identity`

Get the identity information for a subnet. This command displays the identity information of a subnet including name, GitHub repo, contact details, etc.

**Examples:**

```sh
btcli subnets get-identity --netuid 1
```

**Usage**:

```sh
btcli subnets get-identity [OPTIONS]

alias: get_identity
```

**Options**:

| Option                                                                      | Type    | Description                                           |
| --------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney. |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).    |
| `--quiet`                                                                   |         | Display only critical information on the console.     |
| `--verbose`                                                                 |         | Enable verbose output.                                |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.            |
| `--help`                                                                    |         | Show this message and exit.                           |

### `btcli subnets set-symbol`

Allows the user to update their subnet symbol to a different available symbol. The full list of available symbols can be found here:
https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/subnets/symbols.rs#L8

**EXAMPLE**

```bash
btcli subnets set-symbol --netuid 1 シ
```

:::info
JSON OUTPUT:
If --json-output is used, the output will be in the following schema: `{success: bool, message: str}`
:::

**Usage:**

```bash
btcli subnets set-symbol [OPTIONS]
```

**Parameters:**

| Options                                                                     | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `--wallet-path`, `-p`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--hotkey`, `-H`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                 |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` |         | The subtensor network to connect to. Default: finney.                                |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--prompt/--no-prompt`, ` /--yes`, ` /--no_prompt`, ` /-y`                  |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--help`                                                                    |         | Show this message and exit.                                                          |

## `btcli weights`

**Usage**:

```console
btcli weights [OPTIONS] COMMAND [ARGS]...

aliases: wt, weight
```

**Options**:

- `--help`: Show this message and exit.

**Commands**:

- `reveal`: Reveal weights for a specific subnet.
- `commit`: Commit weights for specific subnet.

### `btcli weights reveal`

Reveal weights for a specific subnet.

You must specify the netuid, the UIDs you are interested in, and weights you wish to reveal.

**Example:**

```
btcli wt reveal --netuid 1 --uids 1,2,3,4 --weights 0.1,0.2,0.3,0.4 --salt 163,241,217,11,161,142,147,189
```

**Usage**:

```console
btcli weights reveal [OPTIONS]
```

**Options**:

| Option                                                                      | Type    | Description                                                                                                   |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                                           |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.                          |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                                          |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                                         |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                                            |
| `--uids`, `-u`                                                              | TEXT    | Corresponding UIDs for the specified netuid, e.g. -u 1,2,3 ..                                                 |
| `--weights`, `-w`                                                           | TEXT    | Weights for the specified UIDs, e.g. `-w 0.2,0.4,0.1 ...` Must correspond to the order of the specified UIDs. |
| `--salt`, `-s`                                                              | TEXT    | Corresponding salt for the hash function, e.g. -s 163,241,217 ...                                             |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |         | Enable or disable interactive prompts.                                                                        |
| `--quiet`                                                                   |         | Display only critical information on the console.                                                             |
| `--verbose`                                                                 |         | Enable verbose output.                                                                                        |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                                                    |
| `--help`                                                                    |         | Show this message and exit.                                                                                   |

### `btcli weights commit`

Commit weights for specific subnet.

Use this command to commit weights for a specific subnet. You must specify the netuid, the UIDs you are interested in, and the weights you wish to commit.

**Example:**

```
btcli wt commit --netuid 1 --uids 1,2,3,4 --w 0.1,0.2,0.3
```

Note: This command is used to commit weights for a specific subnet and requires the user to have the necessary
permissions.

**Usage**:

```console
btcli weights commit [OPTIONS]
```

**Options**:

| Option                                                                      | Type    | Description                                                                                                   |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                                           |
| `-p`, `--wallet-path`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`.                          |
| `-H`, `--hotkey`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                                          |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                                         |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                                            |
| `--uids`, `-u`                                                              | TEXT    | Corresponding UIDs for the specified netuid, e.g. -u 1,2,3 ..                                                 |
| `--weights`, `-w`                                                           | TEXT    | Weights for the specified UIDs, e.g. `-w 0.2,0.4,0.1 ...` Must correspond to the order of the specified UIDs. |
| `--salt`, `-s`                                                              | TEXT    | Corresponding salt for the hash function, e.g. -s 163,241,217 ...                                             |
| `--prompt`, `--prompt`, `--no-prompt`, `--yes`, `--no_prompt`, `-y`         |         | Enable or disable interactive prompts.                                                                        |
| `--quiet`                                                                   |         | Display only critical information on the console.                                                             |
| `--verbose`                                                                 |         | Enable verbose output.                                                                                        |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                                                    |
| `--help`                                                                    |         | Show this message and exit.                                                                                   |

## `btcli utils`

**Usage**:

```console
btcli utils [OPTIONS] COMMAND [ARGS]...
```

**Options**:

- `--help`: Show this message and exit.

**Commands**:

- `convert`: Allows for converting between tao and rao...
- `latency`: This command will give you the latency of all finney-like network in additional to any additional networks you specify via the '--network' flag.

### `btcli utils convert`

Allows for converting between tao and rao using the specified flags

**Usage**:

```sh
btcli utils convert [OPTIONS]
```

**Options**:

| Option   | Type  | Description                 |
| -------- | ----- | --------------------------- |
| `--rao`  | TEXT  | Convert amount from Rao     |
| `--tao`  | FLOAT | Convert amount from Tao     |
| `--help` |       | Show this message and exit. |

### `btcli utils latency`

This command will give you the latency of all finney-like network in addition to any additional networks you specify via the `--network` flag

The results are three-fold. One column is the overall time to initialise a connection, send the requests, and wait for the results. The second column measures single ping-pong speed once connected. The third makes a real world call to fetch the chain head.

**Example:**

```sh
btcli utils latency --network ws://189.234.12.45 --network wss://mysubtensor.duckdns.org
```

**Usage**:

```sh
btcli utils latency [OPTIONS]
```

**Options**:

| Option      | Type | Description                                                |
| ----------- | ---- | ---------------------------------------------------------- |
| `--network` | TEXT | Network(s) to test for the best connection [default: None] |
| `--help`    |      | Show this message and exit.                                |

## `btcli liquidity`

**Usage:**

```sh
btcli liquidity [OPTIONS] COMMAND [ARGS]...

alias: l
```

Options:

`--help`: Show this message and exit.

Commands:

- `add`: Add liquidity to the swap (as a combination of TAO + Alpha).
- `list`: Displays liquidity positions in given subnet.
- `modify`: Modifies the liquidity position for the given subnet.
- `remove`: Remove liquidity from the swap (as a combination of TAO + Alpha).

### `btcli liquidity add`

Add liquidity to the swap (as a combination of TAO + Alpha).

**Usage:**

```bash
btcli liquidity add [OPTIONS]
```

**Parameters:**

| Options                                                                            | Type    | Description                                                                          |
| ---------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint`        | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                        | TEXT    | Name of the wallet.                                                                  |
| `--wallet-path`, `-p`, `--wallet_path`, `--wallet.path`                            | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--hotkey`, `-H`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`          | TEXT    | Hotkey of the wallet                                                                 |
| `--netuid`                                                                         | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| `--liquidity`                                                                      | FLOAT   | Amount of liquidity to add to the subnet.                                            |
| `--price-low`, `--price_low`, `--liquidity-price-low`, `--liquidity_price_low`     | FLOAT   | Low price for the adding liquidity position.                                         |
| `--price-high`, `--price_high`, `--liquidity-price-high`, `--liquidity_price_high` | FLOAT   | High price for the adding liquidity position.                                        |
| `--prompt/--no-prompt`, ` /--yes`, ` /--no_prompt`, ` /-y`                         |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                          |         | Display only critical information on the console.                                    |
| `--verbose`                                                                        |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                                      |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                           |         | Show this message and exit.                                                          |

### `btcli liquidity list`

Displays liquidity positions in given subnet.

**Usage:**

```bash
btcli liquidity list [OPTIONS]
```

**Parameters:**

| Options                                                                     | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `--wallet-path`, `-p`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--hotkey`, `-H`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                 |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |         | Show this message and exit.                                                          |

### `btcli liquidity modify`

Modifies the liquidity position for the given subnet.

**Usage:**

```bash
btcli liquidity modify [OPTIONS]
```

**Parameters:**

| Options                                                                     | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `--wallet-path`, `-p`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--hotkey`, `-H`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                 |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| `--position-id`, `--position_id`                                            | INTEGER | Position ID for modification or removing.                                            |
| `--liquidity-delta`, `--liquidity_delta`                                    | FLOAT   | Liquidity amount for modification.                                                   |
| `--prompt/--no-prompt`, ` /--yes`, ` /--no_prompt`, ` /-y`                  |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |         | Show this message and exit.                                                          |

### `btcli liquidity remove`

Remove liquidity from the swap (as a combination of TAO + Alpha).

**Usage:**

```bash
btcli liquidity remove [OPTIONS]
```

**Parameters:**

| Options                                                                     | Type    | Description                                                                          |
| --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| `--network`, `--subtensor.network`, `--chain`, `--subtensor.chain_endpoint` | TEXT    | The subtensor network to connect to. Default: finney.                                |
| `--wallet-name`, `--name`, `--wallet_name`, `--wallet.name`                 | TEXT    | Name of the wallet.                                                                  |
| `--wallet-path`, `-p`, `--wallet_path`, `--wallet.path`                     | TEXT    | Path where the wallets are located. For example: `/Users/btuser/.bittensor/wallets`. |
| `--hotkey`, `-H`, `--wallet_hotkey`, `--wallet-hotkey`, `--wallet.hotkey`   | TEXT    | Hotkey of the wallet                                                                 |
| `--netuid`                                                                  | INTEGER | The netuid of the subnet in the network, (e.g. 1).                                   |
| `--position-id`, `--position_id`                                            | INTEGER | Position ID for modification or removal.                                             |
| `--all`, `--a`                                                              |         | Whether to remove all liquidity positions for given subnet.                          |
| `--prompt/--no-prompt`, ` /--yes`, ` /--no_prompt`, ` /-y`                  |         | Enable or disable interactive prompts.                                               |
| `--quiet`                                                                   |         | Display only critical information on the console.                                    |
| `--verbose`                                                                 |         | Enable verbose output.                                                               |
| `--json-output`, `--json-out`                                               |         | Outputs the result of the command as JSON.                                           |
| `--help`                                                                    |         | Show this message and exit.                                                          |

---
