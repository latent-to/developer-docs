---
title: "Alpha Precompile"
---

# Alpha Precompile

The Alpha precompile exposes the state of every subnet's AMM pool to EVM smart contracts. It is a read-only interface for token prices, pool reserves, swap simulation, and emission rates. Any contract that needs to react to subnet token economics uses this precompile as its data source.

- **Address**: `0x0000000000000000000000000000000000000808`
- **Source code**: [AlphaPrecompile reference](https://github.com/RaoFoundation/subtensor/blob/main/precompiles/src/alpha.rs)

## Concepts

### Spot price vs. moving price

`getAlphaPrice` returns the current instantaneous price derived from the pool reserves (`TaoIn / AlphaIn`). This is the price you would get at this exact block.

`getMovingAlphaPrice` returns an exponential moving average of the spot price, smoothed over `getEMAPriceHalvingBlocks` blocks. Use the moving price when you need a tamper-resistant value—it is significantly harder to manipulate through flash transactions than the spot price.

### Pool reserves vs. outstanding supply

The pool holds two reserves:

- `TaoInPool` — TAO locked in the subnet's AMM pool.
- `AlphaInPool` — alpha tokens locked in the AMM pool.

`AlphaOutPool` (also called `AlphaOut`) tracks the total alpha outstanding outside the pool — staked by validators, miners, and delegators. `AlphaIssuance` is the total ever minted.

The ratio `AlphaInPool / (AlphaInPool + AlphaOutPool)` tells you what fraction of alpha supply is available for immediate trading.

### Swap simulation

`simSwapTaoForAlpha` and `simSwapAlphaForTao` compute expected output for a given input using the constant-product formula, including fees. Use these before a stake or unstake operation to estimate slippage and decide whether to use a limit-price variant.

## Function reference

### Prices and pool state

| Function                             | Parameters | Returns                   | Description                            |
| ------------------------------------ | ---------- | ------------------------- | -------------------------------------- |
| `getAlphaPrice(uint16 netuid)`       | netuid     | `uint256` (RAO per alpha) | Spot price                             |
| `getMovingAlphaPrice(uint16 netuid)` | netuid     | `uint256` (RAO per alpha) | EMA price                              |
| `getTaoInPool(uint16 netuid)`        | netuid     | `uint64`                  | TAO reserves in pool                   |
| `getAlphaInPool(uint16 netuid)`      | netuid     | `uint64`                  | Alpha reserves in pool                 |
| `getAlphaOutPool(uint16 netuid)`     | netuid     | `uint64`                  | Alpha outstanding outside pool         |
| `getAlphaIssuance(uint16 netuid)`    | netuid     | `uint64`                  | Total alpha ever minted                |
| `getTaoWeight()`                     | —          | `uint256`                 | Global TAO weight scalar               |
| `getSumAlphaPrice()`                 | —          | `uint256`                 | Sum of alpha prices across all subnets |
| `getCKBurn()`                        | —          | `uint256`                 | CK burn rate                           |

### Swap simulation

| Function                                          | Parameters                | Returns                                  |
| ------------------------------------------------- | ------------------------- | ---------------------------------------- |
| `simSwapTaoForAlpha(uint16 netuid, uint64 tao)`   | netuid, tao amount in RAO | Expected alpha received (`uint256`)      |
| `simSwapAlphaForTao(uint16 netuid, uint64 alpha)` | netuid, alpha amount      | Expected TAO received in RAO (`uint256`) |

### Emission rates (per block)

| Function                             | Parameters | Returns   | Description                                           |
| ------------------------------------ | ---------- | --------- | ----------------------------------------------------- |
| `getTaoInEmission(uint16 netuid)`    | netuid     | `uint256` | TAO flowing into the pool per block                   |
| `getAlphaInEmission(uint16 netuid)`  | netuid     | `uint256` | Alpha minted into the pool per block                  |
| `getAlphaOutEmission(uint16 netuid)` | netuid     | `uint256` | Alpha emitted outside the pool (to stakers) per block |

### Subnet metadata

| Function                                  | Parameters | Returns                        | Description               |
| ----------------------------------------- | ---------- | ------------------------------ | ------------------------- |
| `getSubnetMechanism(uint16 netuid)`       | netuid     | `uint16` (0=Stable, 1=Dynamic) | AMM mechanism type        |
| `getRootNetuid()`                         | —          | `uint16`                       | Root subnet ID (always 0) |
| `getEMAPriceHalvingBlocks(uint16 netuid)` | netuid     | `uint64`                       | Blocks for EMA half-life  |
| `getSubnetVolume(uint16 netuid)`          | netuid     | `uint256`                      | Recent trading volume     |

## Usage examples

### ABI

The canonical ABI is exported from [`contract-tests/src/contracts/alpha.ts`](https://github.com/RaoFoundation/subtensor/blob/main/contract-tests/src/contracts/alpha.ts). You can import the ABI and contract address from a local copy of the source file as shown:

```javascript
import { IAlphaABI, IALPHA_ADDRESS } from "./contracts/alpha";
```

### Reading pool state

```javascript
import { ethers } from "ethers";
import { IAlphaABI, IALPHA_ADDRESS } from "./contracts/alpha";

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const alphaContract = new ethers.Contract(IALPHA_ADDRESS, IAlphaABI, provider);

const netuid = 14;

const spotPrice = await alphaContract.getAlphaPrice(netuid);
const movingPrice = await alphaContract.getMovingAlphaPrice(netuid);
const taoReserve = await alphaContract.getTaoInPool(netuid);
const alphaReserve = await alphaContract.getAlphaInPool(netuid);

// Simulate a 1 TAO (1e9 RAO) stake
const ONE_TAO_RAO = 1_000_000_000n;
const expectedAlpha = await alphaContract.simSwapTaoForAlpha(
  netuid,
  ONE_TAO_RAO,
);

console.log(`Spot price: ${spotPrice}`);
console.log(`Expected alpha for 1 TAO stake: ${expectedAlpha}`);
```
