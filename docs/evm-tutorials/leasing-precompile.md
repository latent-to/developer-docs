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

Unlike a standard crowdloan, which transfers raised the funds to a target address on finalization, a lease crowdloan embeds a `register_leased_network` call that executes automatically at finalization. This call registers a new subnet and creates a lease agreement between the beneficiary and contributors.

To create a lease crowdloan:

```javascript
// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, rpcUrl } = require("./config.js");
import { ethers } from "ethers";
import { ILeasingABI, ILEASING_ADDRESS } from "./contracts/leasing";

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(ILEASING_ADDRESS, ILeasingABI, signer);

const DEPOSIT = 100_000_000_000n; // 100 TAO in RAO
const MIN_CONTRIBUTION = 50_000_000_000n; // 50 TAO in RAO
const CAP = 3_000_000_000_000n; // 3000 TAO in RAO
const END_BLOCK = 8540500;
const LEASING_EMISSIONS_SHARE = 30;
const HAS_LEASING_END_BLOCK = false;

const tx = await contract.createLeaseCrowdloan(
  DEPOSIT,
  MIN_CONTRIBUTION,
  CAP,
  END_BLOCK,
  LEASING_EMISSIONS_SHARE,
  HAS_LEASING_END_BLOCK,
  0     // leasingEndBlock — ignored when hasLeasingEndBlock is false
  { gasLimit: 500_000n },
);
await tx.wait();
```

The `crowdloanCap` set when creating a lease crowdloan must be enough to the current network registration cost.

:::tip subnet registration cost and fees

A `crowdloanCap` that matches the registration cost exactly is likely to fail. Add a buffer of at least a few TAO above the current cost.

You can query the chain to get the current registration cost:

```js
api.call.subnetRegistrationRuntimeApi.getNetworkRegistrationCost();
```

:::

### Contributing to and Finalizing a Lease Crowdloan

Once a lease crowdloan is created, it receives the next crowdloan ID and enters the network's crowdloan index alongside standard campaigns. Contributing to and finalizing a lease crowdloan follows the same flow as a regular crowdloan — use the [`contribute`](./crowdloan-precompile.md#contribute-to-a-crowdloan-campaign) and [`finalize`](./crowdloan-precompile.md#finalize-a-crowdloan-campaign) functions from the Crowdloan precompile.

On finalization, the runtime executes the embedded `register_leased_network` call, registering the subnet and activating the lease automatically.

### Querying Subnet Leases

After finalizing a crowdloan, you can query the chain to retrieve information such as the lease details and the lease ID associated with a given subnet.

```javascript
const { rpcUrl } = require("./config.js");
import { ethers } from "ethers";
import { decodeAddress } from "@polkadot/util-crypto";
import { ILeasingABI, ILEASING_ADDRESS } from "./contracts/leasing.ts";

const provider = new ethers.JsonRpcProvider(rpcUrl);
const contract = new ethers.Contract(ILEASING_ADDRESS, ILeasingABI, provider);

const LEASE_ID = "LEASE_ID";
const NETUID = "NETUID";

// Get lease details by ID
const lease = await contract.getLease(LEASE_ID);
console.log(`Beneficiary: ${lease.beneficiary}`);
console.log(`Coldkey: ${lease.coldkey}`);
console.log(`Hotkey: ${lease.hotkey}`);

// Get the lease ID for a specific subnet
const leaseId = await contract.getLeaseIdForSubnet(NETUID);
console.log(`Lease ID for subnet ${NETUID}: ${leaseId}`);
```

### Terminating a lease

Use `terminateLease` to claim full ownership of a leased subnet once the lease period has ended. The function transfers subnet ownership directly to the beneficiary coldkey, removes the `SubnetLeaseBeneficiary` proxy, and permanently ends emissions-sharing with contributors.

```javascript
// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, rpcUrl } = require("./config.js");
import { ethers } from "ethers";
import { ILeasingABI, ILEASING_ADDRESS } from "./contracts/leasing";

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(ILEASING_ADDRESS, ILeasingABI, signer);

const HOTKEY = "0x9666fd"; // 32-byte hotkey owned by beneficiary's coldkey
const LEASE_ID = 0;

const tx = await contract.terminateLease(LEASE_ID, HOTKEY, {
  gasLimit: 5_000_000n,
});
await tx.wait();
```

:::info

- The `terminateLease` function can only be called by the lease beneficiary after the lease's end_block has passed. Perpetual leases (`hasLeasingEndBlock = false`) cannot be terminated.
- The hotkey argument passed to the `terminateLease` function must be a hotkey owned by or associated with the beneficiary coldkey.

:::
