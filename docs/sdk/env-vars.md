---
title: "Environment Variables"
---

import { SdkVersion } from "./_sdk-version.mdx";

# Environment Variables

This page documents the environment variables recognized by Bittensor v11. The v10 SDK's configuration machinery (`BT_SUBTENSOR_NETWORK`, `BT_AXON_*`, `BT_LOGGING_*`, `BT_NO_PARSE_CLI_ARGS`, and the rest) is gone: the SDK never parses CLI arguments, logs through the standard `logging` module, and takes connection settings as constructor arguments. See the [v10 to v11 migration guide](./migration-guide).

<SdkVersion />

## `btcli` variables

These set defaults for the corresponding global CLI flags. An explicit flag on the command line always wins.

### `BT_NETWORK`

Default network for `--network`/`-n`. Accepts a network name (`finney`, `test`, `archive`, `local`) or a `ws://`/`wss://` endpoint URL.

### `BT_WALLET`

Default wallet (coldkey) name for `--wallet`/`-w`.

### `BT_WALLET_HOTKEY`

Default hotkey name for `--wallet-hotkey`/`-H`.

### `BT_WALLET_PATH`

Default wallets directory for `--wallet-path`. If unset, `~/.bittensor/wallets`.

### `BTCLI_CONFIG`

Location of the persistent CLI config file. If unset, `~/.bittensor/btcli.json`. See [Configure btcli defaults](../getting-started/installation#configure-btcli-defaults).

## SDK variables

### `BT_CHAIN_ENDPOINT`

Overrides the endpoint that the `local` network name resolves to (default `ws://127.0.0.1:9944`). To point the SDK at any other endpoint, pass the `ws://` URL directly as the network argument: `sub.Client("wss://your-endpoint")`.

### `BT_WALLET_PASSWORD` and `BT_WALLET_PASSWORD_FILE`

Non-interactive coldkey unlock, for scripts and services that cannot answer a password prompt. `BT_WALLET_PASSWORD` holds the password itself (secret-manager friendly); `BT_WALLET_PASSWORD_FILE` names a file whose single line is the password. An interactive prompt is used only if neither is set and a TTY is available.

:::caution
A password in an environment variable is visible to anything that can read your process environment. Prefer `BT_WALLET_PASSWORD_FILE` with tight file permissions, or inject `BT_WALLET_PASSWORD` from a secret manager at runtime. Never commit either to source control.
:::
