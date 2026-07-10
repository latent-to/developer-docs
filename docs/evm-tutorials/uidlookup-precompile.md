---
title: "UidLookup Precompile"
---

# UidLookup Precompile

The UidLookup precompile maps an EVM address to the UIDs of neurons that have associated it via the `associate_evm_address` extrinsic.

- **Address**: `0x0000000000000000000000000000000000000806`
- **Source code**: [UidLookup reference](https://github.com/RaoFoundation/subtensor/blob/14bc6f9f964b9cc362e9635dd110a487fa5d15a0/precompiles/src/uid_lookup.rs)

See also: [Associating an EVM Key](../subtensor-api/extrinsics.md#associateevmkeynetuid-netuid-evm_key-h160-block_number-u64-signature-signature).

## Function

| Function                                                      | Parameters | State mutability | Description                                           |
| ------------------------------------------------------------- | ---------- | ---------------- | ----------------------------------------------------- |
| `uidLookup(uint16 netuid, address evm_address, uint16 limit)` | address    | view             | Allows for UID lookup when provided with EVM address. |

## Usage

### ABI

Canonical ABI: [`contract-tests/src/contracts/uidLookup.ts`](https://github.com/RaoFoundation/subtensor/blob/main/contract-tests/src/contracts/uidLookup.ts). You can import the ABI and contract address if you have a local copy of the source files as shown:

```javascript
import { IUIDLookupABI, IUID_LOOKUP_ADDRESS } from "./contracts/uidLookup";
```

### Look Up Neurons Associated with an EVM Address

```javascript
import { ethers } from "ethers";
import { IUIDLookupABI, IUID_LOOKUP_ADDRESS } from "./contracts/uidLookup";

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const uidLookup = new ethers.Contract(
  IUID_LOOKUP_ADDRESS,
  IUIDLookupABI,
  provider,
);

const netuid = 1;
const evmAddress = "0xYourNeuronEvmAddress";
const results = await uidLookup.uidLookup(netuid, evmAddress, 10);

for (const item of results) {
  console.log(`UID ${item.uid} associated at block ${item.block_associated}`);
}
```
