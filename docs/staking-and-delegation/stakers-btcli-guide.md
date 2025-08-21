---
title: "Staker's Guide to `BTCLI`"
---

# Staker's Guide to `BTCLI`

This page prepares the reader for managing TAO and alpha stake using `btcli` in a secure manner.

:::note Transaction Fees
Staking and unstaking operations incur transaction fees. See [Transaction Fees in Bittensor](../learn/fees.md) for details.
:::

For general coverage of `btcli` security and usage considerations across persona, see: [Bittensor CLI: Permissions Guide](../btcli/btcli-permissions)

## Intro

Stakers enter value into the Bittensor network by acquiring TAO and staking or _delegating_ it to validators to support their work. As validators extract emissions, a certain percentage goes back to stakers.

Stakers must be familiar with operations related to managing the TAO and staked alpha tokens in their Bittensor wallet balances.

Account balances are public information, and can be viewed _without_ using a coldkey, even in an insecure environment. However, any account operation that **changes the state** of the Bittensor chain, such as a balance transfer or staking operation, must be signed with your wallet's coldkey private key.

Performing these functions requires using a **coldkey**, and hence must be performed in a [**highly secure environment**](../keys/coldkey-hotkey-security) for any wallet connected to real (mainnet) TAO balance. A leak of your coldkey can lead to a catastrophic loss of funds.

Any operation can be practiced against Bittensor testnet using throw-away keys _not_ connected to your real TAO balances on mainnet.

:::tip
Stakers only need a coldkey. Unless you plan to mine, validate, or participate in governance, you do not need a hotkey.
:::

See:

- [Staking/Delegation Overview](./delegation.md)
- [Bittensor CLI: Permissions Guide](../btcli/btcli-permissions)
- [Wallets, Coldkeys and Hotkeys in Bittensor](../keys/wallets)
- [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security)

## Requirements for wallet, balance and staking functions

### Wallets

- View balances and stake&mdash;only coldkey public key is required (permissionless)
- Create or generate a new coldkey.
- Transfer TAO from your coldkey to another address. Requires a coldkey signature (secure environment).

### Subnet Discovery

- `btcli subnets list`, `btcli subnets show`, `btcli subnets metagraph`: See available subnets or node info. Permissionless read.
- `btcli subnets price`, `btcli subnets burn-cost`, `btcli subnets burn_cost`: Show the required burn to register in a particular subnet. Permissionless read.

### Staking (All require **coldkey** except for list):

- Add, remove, or move stake to validators on specific subnets.
- Transfer ownership of stake to anoth
- `btcli stake child ...` / `btcli stake children ...` (get, set, revoke, take)
- Short aliases: `btcli st add`, `btcli st remove`, etc.

### Workstation configuration

- `btcli config set`, `btcli config get`, etc. (Permissionless) to configure a `btcli` environment.

## Key rotation

If you suspect your coldkey may have been leaked, you can request to swap it out of your wallet, using an extrinsic blockchain transaction. This operation has a 5 day waiting period, during which your coldkey will be locked. The cost of this coldkey swap transaction is 0.1 TAO.

See [Rotate/Swap your Coldkey](../keys/schedule-coldkey-swap)
