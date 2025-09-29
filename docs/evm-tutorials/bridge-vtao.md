---
title: "TAO-EVM Token Bridging"
---

# TAO-EVM Token Bridging

This guide explains how TAO moves between Substrate-style wallets (SS58) and the Subtensor EVM, what vTAO is, and how to mint/redeem and bridge vTAO across EVM chains.

:::info
- All activity described here executes on the Bittensor blockchain (Subtensor), not on Ethereum mainnet.
- The public UI at `bridge.bittensor.com` wraps the same core functionality you can access via precompiles and RPC.
:::

## Why do we need a token bridge?

- Different execution environments are siloed. Substrate (SS58) and EVM (H160) use different address formats and state machines; balances cannot natively move between them.
- Liquidity is fragmented across networks. Users often need value where applications/liquidity live (Subtensor EVM, or other EVM chains).
- Users prefer self-custodial movement of value, without centralized exchanges or manual wrapping flows.
- A bridge provides predictable conversion and transport:
  - On Subtensor: SS58 ↔ H160 transfers for TAO, and TAO ↔ vTAO mint/redeem via a staking contract.
  - Across EVM chains: message-based transfer of vTAO (via LayerZero), minting/burning the representation on the destination/source.
- Net effect: ownership preserved, liquidity portable, and minimal trust assumptions beyond the audited contracts and the messaging layer.

## What is vTAO?

vTAO is a liquid-staked representation of TAO on the Subtensor EVM, conceptually similar to Lido's wstETH (not stETH):

- Your wallet balance in vTAO remains constant (non-rebasing).
- The exchange rate of TAO per vTAO trends upward over time as the underlying TAO is staked by the contract and accrues yield.
- You can mint vTAO from TAO, redeem vTAO back to TAO, and bridge vTAO between supported EVM chains.

## TAO-EVM vs Bridge (in the UI)

- TAO-EVM: Handles moving TAO between Substrate (SS58) and the Subtensor EVM (H160) on the same network. This uses Bittensor EVM precompiles to make SS58 ↔ H160 transfers simpler. See the step-by-step docs below.
- Bridge: Handles TAO ↔ vTAO on Subtensor EVM, and vTAO ↔ vTAO transfers across EVM chains via LayerZero.

In other words, TAO-EVM is for substrate ↔ EVM account movements on Subtensor; Bridge is for mint/redeem vTAO and cross-chain vTAO transfers.

## How it works (at a glance)

- Substrate ↔ EVM transfers use Bittensor-specific EVM precompiles that understand SS58/H160 addressing and move TAO between them on Subtensor.
- vTAO mint/redeem happens on Subtensor EVM via a staking smart contract that holds TAO and issues/burns vTAO at the current exchange rate.
- Cross-chain vTAO bridging uses LayerZero to message across supported EVM networks, moving vTAO representations between chains.

## Prerequisites

- MetaMask (or another EVM wallet) configured for the Subtensor EVM network you are using.
- Optionally, a Substrate (SS58) wallet with TAO.
- Some gas on the relevant network(s) to pay transaction fees.

Helpful setup guides:

- EVM networks and MetaMask: see
  - [EVM Testnet with MetaMask](./evm-testnet-with-metamask-wallet)
  - [EVM Localnet with MetaMask](./evm-localnet-with-metamask-wallet)
  - [EVM Mainnet with MetaMask](./evm-mainnet-with-metamask-wallet)

## Move TAO between SS58 and H160 on Subtensor (TAO-EVM)

If you simply need to move TAO between a Substrate address (SS58) and an EVM address (H160) on Subtensor:

- Convert addresses when needed: [Convert H160 ↔ SS58](./convert-h160-to-ss58)
- Transfer between MetaMask and SS58: [Transfer TAO from MetaMask to SS58](./transfer-from-metamask-to-ss58)

These flows are also accessible via the "TAO EVM" tab in the public bridge UI, which wraps the precompiles to simplify the process.

## Mint vTAO from TAO (on Subtensor EVM)

1. Open the Bridge UI and select the Bridge tab.
2. Choose TAO → vTAO.
3. Enter the TAO amount, review the current TAO/vTAO exchange rate, and confirm.
4. Approve transactions in your wallet. You will pay normal gas fees.

Result: Your TAO is locked in the staking contract and you receive vTAO. Your vTAO balance will remain constant, while the TAO-per-vTAO exchange rate increases over time.

## Redeem vTAO back to TAO (on Subtensor EVM)

1. In the Bridge tab, select vTAO → TAO.
2. Enter the vTAO amount. The UI shows the TAO you will receive at the current exchange rate.
3. Confirm and approve the transaction.

Result: vTAO is burned and you receive TAO on Subtensor EVM.

## Bridge vTAO across EVM chains (LayerZero)

1. In the Bridge tab, select source and destination EVM networks.
2. Choose vTAO as the asset. Enter the amount to bridge.
3. Review estimated fees and time; confirm and sign. A LayerZero message will transfer vTAO to the destination chain.

Notes:

- You will pay gas on the source chain and a relayer/oracle fee as shown by the UI.
- Finality times depend on the chains involved.
- Bridging is for vTAO; TAO itself does not cross chains—mint on source, bridge vTAO, then optionally redeem on the destination if you need TAO on that chain’s EVM.

## FAQs

**Is vTAO always 1:1 with TAO?**  No. vTAO is non-rebasing with a rising exchange rate. 1 vTAO represents an increasing amount of underlying TAO over time as staking yield accrues.

**Can the vTAO exchange rate go down?**  The design targets a monotonically increasing exchange rate. Contract and protocol risks still apply.

**What fees apply?**  Normal EVM gas fees apply. Cross-chain bridging includes LayerZero-related fees displayed in the UI.

**Is the bridge the only way to move between SS58 and H160?**  No. You can call the precompiles directly or follow the existing guides:
- [Convert H160 ↔ SS58](./convert-h160-to-ss58)
- [Transfer TAO from MetaMask to SS58](./transfer-from-metamask-to-ss58)

## References

- Precompiles and examples: [Bittensor EVM: Examples and Precompiles](./examples)
- Subtensor EVM overview: [Bittensor EVM Smart Contracts](./index)

:::caution
Bridging and staking involve smart-contract and cross-chain risks. Only use official UIs and contracts you trust, verify networks, and test with small amounts first.
:::


