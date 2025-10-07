# Rate Limits Checker

A simple script to query and display rate limit values from the Bittensor network.

## What it does

Connects to the Bittensor Finney network and queries:

- **Global rate limits**: Transaction limits, delegate take limits, network limits, etc.
- **Subnet-specific limits**: Serving rates, adjustment intervals, immunity periods, etc.

## Prerequisites

- Node.js 18.0 or higher
- Dependencies installed (run `yarn install` if needed)

## How to run

```bash
yarn node docs/scripts/check-rate-limits.js
```

> **Note**: This project uses Yarn PnP, so you must run the script with `yarn node` instead of just `node`.

## Expected output

```
Connecting to Bittensor network...
✓ Connected successfully!

GLOBAL RATE LIMITS:
==================
TxRateLimit: 1 blocks (~0h)
TxDelegateTakeRateLimit: 216000 blocks (~720h)
TxChildkeyTakeRateLimit: 216000 blocks (~720h)
NetworkRateLimit: 28800 blocks (~96h)
OwnerHyperparamRateLimit: 2 tempos
WeightsVersionKeyRateLimit: 5 blocks (~0h)
AdminFreezeWindow: 10 blocks (~0h)

SUBNET-SPECIFIC RATE LIMITS (Subnet 1):
=======================================
ServingRateLimit: 10 blocks (~0h)
AdjustmentInterval: 112 blocks (~0.4h)
ImmunityPeriod: 7200 blocks (~24h)
WeightsSetRateLimit: 100 blocks (~0.3h)
MaxRegistrationsPerBlock: 1 registrations
TargetRegistrationsPerInterval: 2 registrations

✓ Complete
```

## Troubleshooting

**Error: Cannot find module '@polkadot/api'**

- Make sure you've run `yarn install` first
- Use `yarn node` instead of `node` to run the script

**Connection timeout**

- Check your internet connection
- The script connects to `wss://entrypoint-finney.opentensor.ai:443`
