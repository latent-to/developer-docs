---
title: "AddressMapping Precompile"
---

The `AddressMapping` precompile lets you convert a H160 EVM address into its Substrate AccountId32 (`bytes32`) using the runtime's HashedAddressMapping. This mapping is one-way; therefore, you cannot reverse it to recover the H160 private key from the AccountId32.

- **Address**: `0x000000000000000000000000000000000000080c`
- **Source code**: [AddressMapping reference](https://github.com/opentensor/subtensor/blob/main/precompiles/src/address_mapping.rs)

## Functions

| Function                                 | Parameters | Returns   | Description                                            |
| ---------------------------------------- | ---------- | --------- | ------------------------------------------------------ |
| `addressMapping(address target_address)` | address    | `bytes32` | Convert a H160 EVM address into its Substrate account. |

## Usage

### ABI

The canonical ABI is defined in the [AddressMapping precompile ABI source file](https://github.com/RaoFoundation/subtensor/blob/main/precompiles/src/solidity/addressMapping.abi). If you have a local copy of the source files, you can import the ABI and contract address into your project as shown below:

```javascript
import {
  IAddressMappingABI,
  IADDRESS_MAPPING_ADDRESS,
} from "./contracts/addressMapping";
```

### Look Up the Substrate Account for an EVM Address

```javascript
import { ethers } from "ethers";
import {
  IAddressMappingABI,
  IADDRESS_MAPPING_ADDRESS,
} from "./contracts/addressMapping";

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const addrMap = new ethers.Contract(
  IADDRESS_MAPPING_ADDRESS,
  IAddressMappingABI,
  provider,
);

const evmAddress = "0xYourEvmAddress";
const substrateId = await addrMap.addressMapping(evmAddress);
console.log(`Substrate AccountId32: ${substrateId}`);
```
