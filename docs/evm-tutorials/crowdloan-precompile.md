---
title: "Crowdloan Precompile"
---

# Crowdloan Precompile

The Crowdloan precompile lets EVM contracts create and manage crowdloans entirely on-chain. A campaign creator sets a funding cap and deadline, contributors deposit TAO, and when the cap is reached, the crowdloan can be finalized to execute either the stored call or a transfer to a target address.

- **Address**: `0x0000000000000000000000000000000000000809`
- **Source code**: [CrowdloanPrecompile reference](https://github.com/RaoFoundation/subtensor/blob/main/precompiles/src/crowdloan.rs)

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

The canonical ABI is exported from [`contract-tests/src/contracts/crowdloan.ts`](https://github.com/RaoFoundation/subtensor/blob/main/contract-tests/src/contracts/crowdloan.ts). You can import the ABI and contract address if you have a local copy of the source files as shown:

```javascript
import { ICrowdloanABI, ICROWDLOAN_ADDRESS } from "./contracts/crowdloan";
```

### Creating a campaign

Use `create` to launch a crowdloan campaign on-chain. The function takes the initial deposit amount, minimum contribution per contributor, funding cap, end block, and a target EVM address to receive the raised funds upon finalization.

The target address is a H160 address type, not `bytes32`. You must pass it as a plain EVM address:

```javascript
import { ethers } from "ethers";
import { ICrowdloanABI, ICROWDLOAN_ADDRESS } from "./contracts/crowdloan";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey } = require("./config.js");

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(ICROWDLOAN_ADDRESS, ICrowdloanABI, signer);

const DEPOSIT = 10_000_000_000n; // 10 TAO in RAO
const MIN_CONTRIBUTION = 1_000_000_000n; // 1 TAO in RAO
const CAP = 50_000_000_000n; // 50 TAO in RAO
const END_BLOCK = 8540500;
const TARGET_ADDRESS =  "0xTargetEVMAddress",

const tx = await contract.create(
  DEPOSIT,
  MIN_CONTRIBUTION,
  CAP,
  END_BLOCK,
  TARGET_ADDRESS
  { gasLimit: 100_000n },
);
await tx.wait();

console.log(`Crowdloan created`);
```

### Checking campaign progress

Use the `getCrowdloan` function to retrieve the current state of a campaign by its ID.

```javascript
import { ethers } from "ethers";
import { ICrowdloanABI, ICROWDLOAN_ADDRESS } from "./contracts/crowdloan";

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const contract = new ethers.Contract(
  ICROWDLOAN_ADDRESS,
  ICrowdloanABI,
  provider,
);

const info = await contract.getCrowdloan(0);
console.log(`Raised: ${info.raised} RAO of ${info.cap} RAO cap`);
console.log(`Finalized: ${info.finalized}`);
console.log(`Cap: ${info.cap}`);
console.log(`End: ${info.end}`);
```

### Contribute to a crowdloan campaign

Use `contribute` to add TAO to an active crowdloan campaign. The function takes the `crowdloanId` and the `amount` in RAO. The `amount` must be at least the campaign's `min_contribution`.

```javascript
import { ethers } from "ethers";
import { ICrowdloanABI, ICROWDLOAN_ADDRESS } from "./contracts/crowdloan";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey } = require("./config.js");

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(ICROWDLOAN_ADDRESS, ICrowdloanABI, signer);

const CROWDLOAN_ID = 0;
const AMOUNT = 1_000_000_000n; // 1 TAO in RAO

const tx = await contract.contribute(CROWDLOAN_ID, AMOUNT, {
  gasLimit: 2_000_000n,
});

console.log(`Contributed ${AMOUNT} RAO to crowdloan ${CROWDLOAN_ID}`);
```

### Finalize a crowdloan campaign

Use `finalize` to close a successfully funded campaign and transfer the raised TAO to the target address set at creation. The campaign must have reached its cap before the `finalize` function can be called.

```javascript
import { ethers } from "ethers";
import { ICrowdloanABI, ICROWDLOAN_ADDRESS } from "./contracts/crowdloan";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey } = require("./config.js");

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(ICROWDLOAN_ADDRESS, ICrowdloanABI, signer);

const CROWDLOAN_ID = 0;

const tx = await contract.finalize(CROWDLOAN_ID, { gasLimit: 2_000_000n });
const receipt = await tx.wait();
console.log(`Crowdloan ${CROWDLOAN_ID} finalized`);
```

### Dissolve a crowdloan campaign

Use `dissolve` to permanently remove a crowdloan from storage.

```javascript
import { ethers } from "ethers";
import { ICrowdloanABI, ICROWDLOAN_ADDRESS } from "./contracts/crowdloan";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey } = require("./config.js");

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(ICROWDLOAN_ADDRESS, ICrowdloanABI, signer);

const CROWDLOAN_ID = 0;

const tx = await contract.dissolve(CROWDLOAN_ID, { gasLimit: 2_000_000n });
const receipt = await tx.wait();
console.log(`Crowdloan ${CROWDLOAN_ID} dissolved`);
```
