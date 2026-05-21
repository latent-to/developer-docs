---
title: "Halving Mechanisms in Bittensor"
---

# Halving Mechanisms in Bittensor

This page explains the TAO and ALPHA halving mechanisms and describes how it affects the creation and distribution of new tokens across the network.

---

A halving is a mechanism that automatically reduces the rate at which new tokens are created and distributed by 50%. The Bittensor network implements two distinct and independent halving mechanisms:

- **TAO Halving**: Reduces TAO emission rate by 50% at supply-based thresholds
- **Alpha Halving**: Reduces emission rate of a subnet's Alpha tokens by 50%

Both mechanisms work together to control token supply and maintain network economics.

## TAO Halvings

A TAO Halving occurs when the total TAO issuance reaches predetermined thresholds. This happens automatically at regular intervals based on the amount of TAO in circulation.

Before a halving event, the network emits TAO at its current block reward, with the full amount flowing into subnet pools. Once a halving occurs, the block reward is reduced by 50%, which lowers the daily TAO emission and cuts subnet pool injections in half.

Follow the approach of the halving at TAO.app's tokenomics dashboard: [tao.app/tokenomics](https://www.tao.app/tokenomics)

:::info Impact of TAO Recycling
_Recycling_ of TAO from subnet registration fees can delay halving events. When tokens are recycled, they are returned to the emission pool and removed from circulation. This process continuously extends the time until the next halving threshold is reached.
:::

### Effect on Alpha Emissions

Alpha emissions are split into two distinct components that respond differently to the halving. During a TAO halving, the portion of Alpha tokens that is injected into subnet pools alongside TAO will halve, since it is directly proportional to the subnet's TAO injections to maintain the current price ratio. In contrast, Alpha rewards distributed to miners, validators, and subnet owners do not halve and will remain constant.

In simple terms, [Alpha pool injections](../learn/emissions.md#alpha-reserve-injection) decrease with TAO halvings, but participant [Alpha rewards](../learn/emissions.md#alpha-outstanding-injection) remain unchanged during a TAO halving.

## Alpha Halvings

Alpha halving refers to the halving of Alpha emissions when a subnet's total Alpha issuance reaches predetermined threshold. Unlike TAO halvings which affects the entire network, Alpha halvings operate at the subnet level and affect Alpha token emissions within each subnet.

During an Alpha halving, the amount of Alpha distributed to miners, validators, and subnet owners each block is reduced by half, and this adjustment applies uniformly to all participants within that subnet.

## Summary

- TAO and Alpha halvings reduce emission rate by 50% at supply-based thresholds
- Timing depends on total issuance, not block numbers
- Recycling can delay halving events
- TAO emissions and Alpha pool injections halve while Alpha participant rewards remain constant during a TAO halving
- Current daily emission: ~7,200 TAO → ~3,600 TAO after first halving
