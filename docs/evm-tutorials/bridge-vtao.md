---
title: "TAO-EVM Token Bridging"
---

# TAO-EVM Token Bridging

This guide explains how TAO moves between Substrate-style wallets (SS58) and the Subtensor EVM, what vTAO is, and how to mint/redeem and bridge vTAO across EVM chains.

:::info
- All activity described here executes on the Bittensor blockchain (Subtensor), not on Ethereum mainnet.
- The public UI at `bridge.bittensor.com` wraps the same core functionality you can access via precompiles and RPC.
:::

## Intro: Two Types of 'Bridging'
### Transferring liquidity between Substrate and EVM Wallets on Bittensor Chain


**TAO** is the native token of the Bittensor network it exists on Subtensor, Bittensor's blockchain, which is built on top of Substrate. Hence, TAO is normally held in Substrate-style, ss58-format wallets, which can be used to execute Subtensor blockchain extrinsics, including through the Bittensor Python SDK and BTCLI.

See [Wallets, Coldkeys and Hotkeys in Bittensor](../keys/wallets)

If TAO is transferred to an Ethereum-style h160 wallet, it can be used in Bittensor's EVM layer. This is the same token, just represented in a different account format.

You can move TAO back and forth between Substrate and EVM wallets several ways:

- by directly calling to the substrate extrinsics 
# TODO add links to the evm-tutorials pages 

- https://bridge.bittensor.com/

- using the [tao.app TAO EVM tab](tao.app/?) in the UI.


### vTAO

vTAO is a liquid-staked representation of TAO on the Subtensor EVM.

- Your wallet balance in vTAO stays the same, but the underlying TAO locked in the contract increases with staking rewards.
- The exchange rate of TAO per vTAO trends upward over time as the underlying TAO is staked by the contract and accrues yield.
- vTAO is minted by depositing TAO into a staking contract, eventually the quantity of vTAO can be redeemed for an amount of TAO depending on the exchange rate.
- vTAO can be bridged between supported EVM chains.

:::tip
vTAO conceptually similar to [Lido's wstETH](https://docs.lido.fi/contracts/wsteth/).
:::
this you can only do from the bridge tab from tao.app/vtao... # todo fill this junk out a bit


## TAO-EVM vs Bridge (in the tao.app UI)

- TAO-EVM: Handles moving TAO between Substrate (SS58) and the Subtensor EVM (H160) on the same network. This uses Bittensor EVM precompiles to make SS58 ↔ H160 transfers simpler. See the step-by-step docs below.
- Bridge: Handles TAO ↔ vTAO on Subtensor EVM, and vTAO ↔ vTAO transfers across EVM chains via LayerZero.


## FAQs

**Is vTAO always 1:1 with TAO?**  No. vTAO is non-rebasing with a rising exchange rate. 1 vTAO represents an increasing amount of underlying TAO over time as staking yield accrues.

**Can the vTAO exchange rate go down?**  Yes, presumably @vune ?

**What fees apply?**  ???


**Is the bridge the only way to move between SS58 and H160?**  No. You can call the precompiles directly or follow the existing guides:
- [Convert H160 ↔ SS58](./convert-h160-to-ss58)
- [Transfer TAO from MetaMask to SS58](./transfer-from-metamask-to-ss58)
