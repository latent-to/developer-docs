---
title: "Install Bittensor"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { SdkVersion } from "../sdk/\_sdk-version.mdx";

# Install Bittensor

Bittensor ships as a single Python package containing the SDK, the `btcli` command line tool, and the wallet module. Installing it is the first step for scripting against the chain or managing wallets, stake, and registrations from the command line.

<SdkVersion />

---

:::warning Install from Verified Sources
Always double-check the package name and origin before installation. Use links and commands directly from our docs or official release announcements to avoid malicious lookalikes.
:::

## Requirements

- **Python 3.10–3.13.** On a newer interpreter (e.g. 3.14), `pip install -U bittensor` silently keeps the old 10.x release, because pip selects the newest release whose `requires-python` matches. If `btcli --version` reports 9.x/10.x after upgrading, check `python --version` first.
- **Platforms:** wheels ship for Linux (x86_64, aarch64) and macOS (Apple Silicon and Intel). On any other platform pip falls back to a source build, which requires a [Rust toolchain](https://www.rust-lang.org/tools/install).
- **Windows** is not supported natively; use [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/about) with an [Ubuntu distribution](https://github.com/ubuntu/WSL/blob/main/docs/guides/install-ubuntu-wsl2.md) and follow the Linux steps. Wallet operations work under WSL 2, but mining and validating on Windows are not recommended or supported.

:::tip Create and activate a virtual environment
To avoid dependency issues, [create](https://docs.python.org/3/library/venv.html#creating-virtual-environments) and [activate](https://docs.python.org/3/library/venv.html#how-venvs-work) a Python virtual environment before installing:

```bash
python3 -m venv bt_venv
source bt_venv/bin/activate
```

:::

## Install

```bash
pip install bittensor
```

This one package installs the SDK, `btcli`, and the wallet module. The separate `bittensor-cli` and `bittensor_wallet` packages are superseded — remove them from your requirements. Existing wallets on disk are keyfile-compatible; there is nothing to convert.

## Upgrading from the old stack

Order matters in an environment that already has the old packages, because `bittensor-cli` 9.x and `bittensor` 11.x both own the `btcli` command:

```bash
pip uninstall -y bittensor-cli bittensor-wallet
pip install -U bittensor
```

If you upgraded first and uninstalled `bittensor-cli` after, pip deletes the `btcli` script (it is still listed in the old package's file manifest). Nothing is lost — reinstate it with:

```bash
pip install --force-reinstall --no-deps bittensor
```

While a stale `bittensor-cli` is still installed, `btcli` prints a warning with this fix on every run.

## Verify the installation

<Tabs>
<TabItem value="btcli" label="btcli">

```bash
btcli --version
```

</TabItem>
<TabItem value="python" label="Python">

```python
import bittensor as sub
print(sub.__version__)
```

</TabItem>
<TabItem value="chain" label="Chain connectivity">

Confirm the installation can reach the chain by reading from the test network:

```python
import bittensor as sub

with sub.SyncClient("test") as client:
    print("current block:", client.block())
```

</TabItem>
</Tabs>

## Configure btcli defaults

Set commonly used values (network, wallet name, hotkey) once, and override them per command as needed. Configuration is stored in `~/.bittensor/btcli.json` (override the location with the `BTCLI_CONFIG` environment variable):

```bash
btcli config set network test
btcli config set wallet my_coldkey
btcli config get
```

For the SDK's environment variables, see [Environment variables](../sdk/env-vars).

## Next steps

- [Create a wallet](../keys/wallets)
- [Key permissions](../keys/key-permissions) — which operations need which key, and where each key should live
