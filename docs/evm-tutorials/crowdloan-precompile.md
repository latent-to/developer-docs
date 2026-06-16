---
title: "Crowdloan Precompile"
---

# Crowdloan Precompile

The Crowdloan precompile lets EVM contracts create and manage crowdloans entirely on-chain. A campaign creator sets a funding cap and deadline, contributors deposit TAO, and when the cap is reached, the crowdloan can be finalized to execute either the stored call or a transfer to a target address.

- **Address**: `0x0000000000000000000000000000000000000809`
- **Source code**: [CrowdloanPrecompile reference](https://github.com/opentensor/subtensor/blob/main/precompiles/src/crowdloan.rs)

See [Crowdloans](../subnets/crowdloans/index.md) for the full concept and Substrate-side workflow.

## Functions

| Function                                                                                        | Mutability | Description                                                                           |
| ----------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| `create(uint64 deposit, uint64 minContribution, uint64 cap, uint32 end, address targetAddress)` | payable    | Create a new campaign. `end` is the block number at which contributions close.        |
| `contribute(uint32 crowdloanId, uint64 amount)`                                                 | payable    | Contribute to an active campaign.                                                     |
| `withdraw(uint32 crowdloanId)`                                                                  | payable    | Withdraw your contribution before finalization.                                       |
| `finalize(uint32 crowdloanId)`                                                                  | payable    | Finalize a successful campaign and transfer funds to `targetAddress`.                 |
| `refund(uint32 crowdloanId)`                                                                    | payable    | Refund contributors of a failed campaign. Call repeatedly for large contributor sets. |
| `dissolve(uint32 crowdloanId)`                                                                  | payable    | Clean up storage after full refund.                                                   |
| `updateMinContribution(uint32 crowdloanId, uint64 newMinContribution)`                          | payable    | Update minimum contribution (creator only).                                           |
| `updateEnd(uint32 crowdloanId, uint32 newEnd)`                                                  | payable    | Update end block (creator only).                                                      |
| `updateCap(uint32 crowdloanId, uint64 newCap)`                                                  | payable    | Update funding cap (creator only).                                                    |
| `getCrowdloan(uint32 crowdloanId)`                                                              | view       | Returns `CrowdloanInfo` struct.                                                       |
| `getContribution(uint32 crowdloanId, bytes32 coldkey)`                                          | view       | Returns contributor's total deposit in RAO.                                           |

## Usage examples

### ABI

The canonical ABI is exported from [`contract-tests/src/contracts/crowdloan.ts`](https://github.com/opentensor/subtensor/blob/main/contract-tests/src/contracts/crowdloan.ts). You can import the ABI and contract address if you have a local copy of the source files as shown:

```javascript
import { ICrowdloanABI, ICROWDLOAN_ADDRESS } from "./contracts/crowdloan";
```

### Creating a campaign

```javascript
import { ethers } from "ethers";
import { ICrowdloanABI, ICROWDLOAN_ADDRESS } from "./contracts/crowdloan";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, rpcUrl } = require("./config.js");

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(ICROWDLOAN_ADDRESS, ICrowdloanABI, signer);

const depositRao = 1_000_000_000n; // 1 TAO

const tx = await contract.create(
  depositRao, // deposit
  100_000_000n, // minContribution: 0.1 TAO
  100_000_000_000n, // cap: 100 TAO
  57000, // end block
  "0xYourTargetAddress",
  { value: depositRao, gasLimit: 500_000n },
);
await tx.wait();
```

### Checking campaign progress

```javascript
const info = await contract.getCrowdloan(0);
console.log(`Raised: ${info.raised} RAO of ${info.cap} RAO cap`);
console.log(`Finalized: ${info.finalized}`);
```

## Notes

- All TAO amounts are in **RAO** (1 TAO = 1,000,000,000 RAO).
- `refund` processes a batch of contributors per call. For large campaigns, call it repeatedly before calling `dissolve`.
- The caller's EVM address maps to a Substrate coldkey via HashedAddressMapping. Use the same address for all operations on a given contribution.
