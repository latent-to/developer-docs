# TAO Halving

This page explains the TAO halving mechanism and describes how it affects the creation and distribution of new tokens across the network.

## What is TAO Halving?

**TAO halving** is a scheduled event in the Bittensor network where the block reward is reduced by 50%. This happens automatically at regular intervals based on the amount of TAO in circulation.

:::info
_Recycling_ of TAO from subnet registration fees can delay halving events. When tokens are recycled, they are returned to the emission pool and removed from circulation. This process continuously extends the time until the next halving threshold is reached.
:::

## TAO halving Mechanism

Halving occurs when the total TAO issuance reaches predetermined thresholds. Before a halving event, the network emits TAO at its current block reward, with the full amount flowing into subnet pools. Once a halving occurs, the block reward is reduced by 50%, which lowers the daily TAO emission and cuts subnet pool injections in half.

### Effect on Alpha Emissions

Alpha emissions are split into two distinct components that respond differently to the halving. The portion of Alpha tokens that is injected into subnet pools alongside TAO will halve, since it directly tracks TAO emissions at the current price ratio. In contrast, Alpha rewards distributed to miners, validators, and subnet owners do not halve and will remain constant. In simple terms, Alpha pool injections decrease with TAO, but participant Alpha rewards stay unchanged.

## Summary

- TAO halving reduces emission rate by 50% at supply-based thresholds
- Timing depends on total issuance, not block numbers
- Recycling can delay halving events
- TAO emissions and Alpha pool injections halve; Alpha participant rewards remain constant
- Current daily emission: ~7,200 TAO → ~3,600 TAO after first halving
