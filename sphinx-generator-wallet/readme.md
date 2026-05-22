# Generating Bittensor Wallet Python SDK Documentation with Sphinx

This folder contains the Sphinx configuration for generating documentation for the `bittensor_wallet` SDK. It imports the installed `bittensor_wallet` package (built via `pip install -e "$BTWALLET_ROOT"`) so docstrings coming from the Rust bindings can be rendered. The `BTWALLET_ROOT` environment variable must be configured to point to your local `btwallet` repository.

## Prerequisites

- Python 3.9+
- Rust toolchain (needed when building the PyO3 extension during `pip install -e "$BTWALLET_ROOT"`)
- Access to the [`developer-docs`](https://github.com/opentensor/developer-docs) repo for publishing

## Quick Start

1. **Create/activate the virtualenv**

   ```bash
   cd sphinx-generator-wallet
   python3 -m venv sphinx_venv
   source sphinx_venv/bin/activate
   ```

2. **Install Sphinx dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Paths**

   Set the `BTWALLET_ROOT` environment variable to point to your local `btwallet` repository:

   ```bash
   export BTWALLET_ROOT=/path/to/btwallet
   ```

   **Important:** Replace `/path/to/btwallet` with the actual path to your `btwallet` repository on your system.

4. **Install the wallet package into the env**

   Install the `bittensor_wallet` package from the configured path:

   ```bash
   pip install -e "$BTWALLET_ROOT"
   ```

   This will build the PyO3 extension from the Rust sources and install it in editable mode.

5. **Build docs**
   (Optional) run `rm -rf build/html/` to remove previous build

   ```bash
   make html
   ```

6. **Open locally**
   ```bash
   open build/html/index.html
   ```

## Publishing Workflow

1. Copy output into `developer-docs`. The generated docs must be copied to the `static/btwallet-api/html` folder within your `developer docs` directory e.g.

   ```bash
   rm -rf /path/to/developer-docs/static/btwallet-api/html
   cp -r build/html /path/to/developer-docs/static/btwallet-api/html
   ```

After running the command, you might need to restart your local server to see the actual changes in the files.

2. Commit/push from the developer-docs repo.
   ```bash
   git add static/wallet-api/html
   git commit -m "Update Wallet SDK API docs"
   git push
   ```

Link to the published docs using `[Wallet SDK API Reference](pathname:///wallet-api/html/index.html)`.

## Troubleshooting

- **`ModuleNotFoundError: bittensor_wallet`** – ensure step 4 (package installation) succeeded and the venv is activated when running `make html`. Verify that `BTWALLET_ROOT` is set correctly.

- **`BTWALLET_ROOT path does not exist`** – ensure the `BTWALLET_ROOT` environment variable points to a valid `btwallet` repository directory that contains `src/wallet.rs`.

- **`pip install -e` fails with "pyproject.toml not found"** – verify that `BTWALLET_ROOT` is set to the root of the `btwallet` repository (where `pyproject.toml` is located), not a subdirectory.

- **Rust build failures** – verify the Rust toolchain is installed and PyO3 prerequisites are met. You may need to install `maturin` first: `pip install maturin`.

- **Missing docstrings** – confirm `pip install -e "$BTWALLET_ROOT"` ran after any Rust edits; the doc fallback only applies when the package is installed in the venv. Also verify `BTWALLET_ROOT` is set correctly.

- **Start fresh** – `rm -rf build && make html`.

- **Virtual environment symlink errors** – If you see "Unable to symlink" errors when creating the venv, this is often a Homebrew Python issue on macOS. Solutions:
  - Use `python3 -m venv --copies sphinx_venv` to copy files instead of symlinking
  - Ensure you have write permissions: `chmod -R u+w sphinx_venv` (if venv already exists)
  - Try removing the existing venv and recreating: `rm -rf sphinx_venv && python3 -m venv --copies sphinx_venv`
  - If using Homebrew Python, ensure it's properly linked: `brew link python@3.14` (or your Python version)

For everything else, refer to the original `sphinx-generator/readme.md` guidance or contact the docs team.
