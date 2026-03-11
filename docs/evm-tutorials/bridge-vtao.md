---
title: "Token Bridging"
---

# Token Bridging

This guide provides an overview of two related topics:

- how to moves TAO between Substrate-style wallets (SS58) and the Etherum style wallets on Bittensor EVM
- how to use vTAO as a token bridge between Bittensor EVM and other EVM chains.

:::info
Bittensor EVM smart contracts are executed solely on the **Bittensor blockchain, _not_ on the Ethereum blockchain.**
:::

## Transferring liquidity between Substrate and EVM Wallets on Bittensor Chain

**TAO** is the native token of the Bittensor network it exists on Subtensor, Bittensor's blockchain, which is built on top of Substrate. Hence, TAO is normally held in Substrate-style, ss58-format wallets, which can be used to execute Subtensor blockchain extrinsics, including through the Bittensor Python SDK and BTCLI.

See [Wallets, Coldkeys and Hotkeys in Bittensor](../keys/wallets)

If TAO is transferred to an Ethereum-style h160 wallet, it can be used in Bittensor's EVM layer. This is the same token, just represented in a different account format.

You can move TAO back and forth between Substrate and EVM wallets several ways:
Use example scripts:

- [Transfer TAO from H160 to SS58](./convert-h160-to-ss58)
- [Transfer TAO from SS58 to H160](./transfer-from-metamask-to-ss58)
- Using [`tao.app/bridge`](https://tao.app/bridge).
- Using OTF's EVM Bridge: [`bridge.bittensor.com/`](https://bridge.bittensor.com/)

## Bridge to other EVM Chains with vTAO

vTAO is a liquid-staked TAO token on the Subtensor EVM, available through ['tao.app/bridge'](https://tao.app/bridge).

- vTAO is minted by depositing TAO into a staking contract, the vTAO can later be redeemed for an amount of TAO depending on the exchange rate.
- Your wallet balance in vTAO stays the same, but the underlying TAO locked in the contract increases with staking rewards.
- vTAO can be bridged between supported EVM chains.

:::tip
vTAO conceptually similar to [Lido's wstETH](https://docs.lido.fi/contracts/wsteth/). For more information on how to bridge and wrap vTAO, see [Bridging and Wrapping vTAO](./vtao-bridge-tutorial.md)
:::
