---
title: "TAO-EVM Token Bridging"
---

# TAO-EVM Token Bridging

This guide explains how TAO moves between Substrate-style wallets (SS58) and the Subtensor EVM, what vTAO is, and how to mint/redeem and bridge vTAO across EVM chains.

:::info
Bittensor EVM smart contracts are executed solely on the **Bittensor blockchain, _not_ on the Ethereum blockchain.**
:::

## Transferring liquidity between Substrate and EVM Wallets on Bittensor Chain

**TAO** is the native token of the Bittensor network it exists on Subtensor, Bittensor's blockchain, which is built on top of Substrate. Hence, TAO is normally held in Substrate-style, ss58-format wallets, which can be used to execute Subtensor blockchain extrinsics, including through the Bittensor Python SDK and BTCLI.

See [Wallets, Coldkeys and Hotkeys in Bittensor](../keys/wallets)

If TAO is transferred to an Ethereum-style h160 wallet, it can be used in Bittensor's EVM layer. This is the same token, just represented in a different account format.

You can move TAO back and forth between Substrate and EVM wallets several ways:
- Using precompiles:
	- [Convert H160 ↔ SS58](./convert-h160-to-ss58)
	- [Transfer TAO from MetaMask to SS58](./transfer-from-metamask-to-ss58)
- Using OTF's EVM Bridge: [`bridge.bittensor.com/`](https://bridge.bittensor.com/)
- using the [`tao.app/vtao`](tao.app/?) in the UI.


## Bridge to other EVM Chains with vTAO

vTAO is a liquid-staked representation of TAO on the Subtensor EVM.

- Your wallet balance in vTAO stays the same, but the underlying TAO locked in the contract increases with staking rewards.
- The exchange rate of TAO per vTAO trends upward over time as the underlying TAO is staked by the contract and accrues yield.
- vTAO is minted by depositing TAO into a staking contract, eventually the quantity of vTAO can be redeemed for an amount of TAO depending on the exchange rate.
- vTAO can be bridged between supported EVM chains.

:::tip
vTAO conceptually similar to [Lido's wstETH](https://docs.lido.fi/contracts/wsteth/).
:::
this you can only do from the bridge tab from tao.app/vtao... 

