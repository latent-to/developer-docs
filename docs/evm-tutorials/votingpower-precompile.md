---
title: "Voting Power Precompile"
---

# Voting Power Precompile

The VotingPower precompile gives smart contracts read-only access to the per-validator EMA voting power scores tracked on each subnet. Use it to build on-chain governance mechanisms — slashing conditions, quorum checks, reward weighting — that respond to relative validator influence.

- **Address**: `0x000000000000000000000000000000000000080d`
- **Source code**: [VotingPowerPrecompile reference](https://github.com/RaoFoundation/subtensor/blob/main/precompiles/src/voting_power.rs)

## Functions

| Function                                        | Parameters     | Returns   | Description                                                                               |
| ----------------------------------------------- | -------------- | --------- | ----------------------------------------------------------------------------------------- |
| `getVotingPower(uint16 netuid, bytes32 hotkey)` | netuid, hotkey | `uint256` | EMA voting power for a validator. Returns `0` if tracking is disabled or no entry exists. |
| `getTotalVotingPower(uint16 netuid)`            | netuid         | `uint256` | Sum of voting power across all validators on the subnet.                                  |
| `isVotingPowerTrackingEnabled(uint16 netuid)`   | netuid         | `bool`    | Whether tracking is currently active.                                                     |
| `getVotingPowerDisableAtBlock(uint16 netuid)`   | netuid         | `uint64`  | Block at which tracking will auto-disable, or `0` if none scheduled.                      |
| `getVotingPowerEmaAlpha(uint16 netuid)`         | netuid         | `uint64`  | EMA smoothing factor (18 decimal precision, `1.0 = 10^18`).                               |

## Usage examples

### ABI

The canonical ABI is exported from [`contract-tests/src/contracts/votingPower.ts`](https://github.com/RaoFoundation/subtensor/blob/main/contract-tests/src/contracts/votingPower.ts). You can import the ABI and contract address if you have a local copy of the source files as shown:

```javascript
import {
  IVotingPowerABI,
  IVOTING_POWER_ADDRESS,
} from "./contracts/votingPower";
```

### Quorum checks

```javascript
import { ethers } from "ethers";
import {
  IVotingPowerABI,
  IVOTING_POWER_ADDRESS,
} from "./contracts/votingPower";

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const vp = new ethers.Contract(
  IVOTING_POWER_ADDRESS,
  IVotingPowerABI,
  provider,
);

const netuid = 1;
const hotkey = "0xabcd..."; // 32-byte hotkey

const enabled = await vp.isVotingPowerTrackingEnabled(netuid);
const validatorVP = await vp.getVotingPower(netuid, hotkey);
const totalVP = await vp.getTotalVotingPower(netuid);

console.log(`Tracking enabled: ${enabled}`);
console.log(`Validator has ${validatorVP} voting power`);
console.log(`Total voting power: ${totalVP}`);
```

:::info

The `hotkey` parameter on the `getVotingPower` function expects a 32-byte public key. For Substrate wallets use `decodeAddress(ss58)` imported from `@polkadot/util-crypto`; for EVM wallets you must derive the corresponding public key for the H160 account before passing it.
:::
