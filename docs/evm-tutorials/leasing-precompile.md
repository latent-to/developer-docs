---
title: "Leasing Precompile"
---

# Leasing Precompile

The Leasing precompile lets EVM contracts create lease crowdloans, terminate leases, and query lease state.

- **Address**: `0x000000000000000000000000000000000000080a`
- **Source code**: [LeasingPrecompile reference](https://github.com/opentensor/subtensor/blob/main/precompiles/src/leasing.rs)

See [Subnet Crowdloans](../subnets/crowdloans/crowdloans-tutorial.md) for the full concept.

## Functions

| Function                                                                                                                                                                                                 | Mutability | Description                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `createLeaseCrowdloan(uint64 crowdloanDeposit, uint64 crowdloanMinContribution, uint64 crowdloanCap, uint32 crowdloanEnd, uint8 leasingEmissionsShare, bool hasLeasingEndBlock, uint32 leasingEndBlock)` | payable    | Create a lease crowdloan. `leasingEmissionsShare` is the % of subnet owner emissions distributed to contributors (0–100).                        |
| `terminateLease(uint32 leaseId, bytes32 hotkey)`                                                                                                                                                         | payable    | Terminate an ended lease and claim subnet ownership. Only callable after `end_block`. `hotkey` must be owned by the calling beneficiary coldkey. |
| `getLease(uint32 leaseId)`                                                                                                                                                                               | view       | Returns `LeaseInfo` struct.                                                                                                                      |
| `getContributorShare(uint32 leaseId, bytes32 contributor)`                                                                                                                                               | view       | Returns `(uint128 integer, uint128 fractional)`.                                                                                                 |
| `getLeaseIdForSubnet(uint16 netuid)`                                                                                                                                                                     | view       | Returns the leaseId associated with a subnet.                                                                                                    |

## Usage examples

### ABI

The canonical ABI is exported from [`contract-tests/src/contracts/leasing.ts`](https://github.com/opentensor/subtensor/blob/main/contract-tests/src/contracts/leasing.ts).

```javascript
import { ILeasingABI, ILEASING_ADDRESS } from "./contracts/leasing";
```

### Creating a lease crowdloan

```javascript
// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, subSeed, rpcUrl, wsUrl } = require("./config.js");
import { ethers } from "ethers";
import { ILeasingABI, ILEASING_ADDRESS } from "./contracts/leasing";

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(ILEASING_ADDRESS, ILeasingABI, signer);

const depositRao = 1_000_000_000n; // 1 TAO

const tx = await contract.createLeaseCrowdloan(
  depositRao, // crowdloanDeposit
  100_000_000n, // crowdloanMinContribution: 0.1 TAO
  10_000_000_000_000n, // crowdloanCap: 10,000 TAO
  500000, // crowdloanEnd block
  30, // leasingEmissionsShare: 30%
  true, // hasLeasingEndBlock
  6000000, // leasingEndBlock (~2 years out)
  { value: depositRao, gasLimit: 500_000n },
);
await tx.wait();
```

### Terminating a lease

```javascript
// Call after lease end_block has passed
const leaseId = 0;
const hotkey = "0xabcd..."; // 32-byte hotkey owned by caller's coldkey

const lease = await contract.getLease(leaseId);
if (
  lease.has_end_block &&
  BigInt(await provider.getBlockNumber()) >= lease.end_block
) {
  const tx = await contract.terminateLease(leaseId, hotkey, {
    gasLimit: 500_000n,
  });
  await tx.wait();
}
```

### Querying a subnet's lease

```javascript
const netuid = 5;
const leaseId = await contract.getLeaseIdForSubnet(netuid);
const lease = await contract.getLease(leaseId);

console.log(`Lease ends at block: ${lease.end_block}`);
console.log(`Emissions share to contributors: ${lease.emissions_share}%`);
```
