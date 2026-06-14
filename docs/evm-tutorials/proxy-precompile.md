---
title: "Proxy Precompile"
---

# Proxy Precompile

The Proxy precompile exposes the Substrate proxy pallet to EVM contracts. Proxies let one account act on behalf of another for a limited set of operation types.

- **Address**: `0x000000000000000000000000000000000000080b`
- **Source code**: [ProxyPrecompile reference](https://github.com/opentensor/subtensor/blob/main/precompiles/src/proxy.rs)

See also: [Proxy Types and Permissions](../keys/proxies/index.md) for the full list of proxy types.

## Functions

| Function                                                                                          | Mutability | Description                                                                     |
| ------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| `addProxy(bytes32 delegate, uint8 proxy_type, uint32 delay)`                                      | nonpayable | Authorize `delegate` as a proxy of `proxy_type` with a `delay` in blocks.       |
| `removeProxy(bytes32 delegate, uint8 proxy_type, uint32 delay)`                                   | nonpayable | Remove a specific proxy relationship.                                           |
| `removeProxies()`                                                                                 | nonpayable | Remove all proxies and recover the deposit.                                     |
| `createPureProxy(uint8 proxy_type, uint32 delay, uint16 index)`                                   | nonpayable | Create a keyless pure proxy account. Returns `bytes32 proxy`.                   |
| `killPureProxy(bytes32 spawner, uint8 proxy_type, uint16 index, uint32 height, uint32 ext_index)` | nonpayable | Destroy a pure proxy. `height` and `ext_index` identify the creation extrinsic. |
| `proxyCall(bytes32 real, uint8[] force_proxy_type, uint8[] call)`                                 | nonpayable | Execute a SCALE-encoded call on behalf of `real`.                               |
| `pokeDeposit()`                                                                                   | nonpayable | Recalculate the proxy deposit for the caller.                                   |
| `getProxies(bytes32 account)`                                                                     | view       | Returns all proxy relationships for `account`.                                  |

:::info Working with proxy accounts

- **`delegate`** (`bytes32`) — the account to authorize as proxy. Pass the raw 32-byte public key: use `decodeAddress(ss58)` for Substrate wallets, or `h160ToPublicKey(evmAddress)` for EVM wallets.
- **`proxy_type`** (`uint256`) — numeric index controlling what operations the proxy can perform. `0` grants full access (`Any`). See the [proxy type index table](./proxy-precompile.md#proxy-type-values) for the full list.
- **`delay`** (`uint256`) — number of blocks the proxy must wait after announcing a call before executing it. Pass `0` for immediate execution.
  :::

### Proxy type values

Source: [`common/src/lib.rs`](https://github.com/opentensor/subtensor/blob/main/common/src/lib.rs) — `TryFrom<u8> for ProxyType`.

| Value | Type                     | Notes                        |
| ----- | ------------------------ | ---------------------------- |
| 0     | `Any`                    | All operations               |
| 1     | `Owner`                  | Subnet owner calls           |
| 2     | `NonCritical`            |                              |
| 3     | `NonTransfer`            | All except balance transfers |
| 4     | `Senate`                 | Deprecated                   |
| 5     | `NonFungible`            | Nothing involving moving TAO |
| 6     | `Triumvirate`            | Deprecated                   |
| 7     | `Governance`             | Deprecated                   |
| 8     | `Staking`                | Staking operations           |
| 9     | `Registration`           |                              |
| 10    | `Transfer`               |                              |
| 11    | `SmallTransfer`          | Transfers up to limit        |
| 12    | `RootWeights`            | Deprecated                   |
| 13    | `ChildKeys`              |                              |
| 14    | `SudoUncheckedSetCode`   |                              |
| 15    | `SwapHotkey`             |                              |
| 16    | `SubnetLeaseBeneficiary` | Operate a leased subnet      |
| 17    | `RootClaim`              |                              |

Check [Proxy Types](../keys/proxies/index.md#proxytype) for the authoritative up-to-date list.

## Usage examples

### ABI

The canonical ABI is exported from [`contract-tests/src/contracts/proxy.ts`](https://github.com/opentensor/subtensor/blob/main/contract-tests/src/contracts/proxy.ts). You can import the ABI and contract address from a local copy of the source file as shown:

```javascript
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";
```

### Add a proxy relationship on a Bittensor EVM address

```js
import { ethers } from "ethers";
import { decodeAddress } from "@polkadot/util-crypto";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, rpcUrl } = require("./config.js");
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(IPROXY_ADDRESS, IProxyABI, signer);

const DELEGATE_SS58 = "5FJPvu5BGh2U3vrinRzDobr6Mtsrp...";
const DELEGATE_PUBLIC_KEY = decodeAddress(DELEGATE_SS58); // decode SS58 → raw 32-byte public key
const PROXY_TYPE = 0; // Any — see proxy type index table in docs
const DELAY_BLOCKS = 0;

const tx = await contract.addProxy(
  DELEGATE_PUBLIC_KEY,
  PROXY_TYPE,
  DELAY_BLOCKS,
  { gasLimit: 300_000n },
);
const receipt = await tx.wait();

console.log(`Proxy added successfully`);
```

### Get all proxies for an EVM address

```javascript
import { ethers } from "ethers";
import { blake2AsU8a } from "@polkadot/util-crypto";
import { hexToU8a } from "@polkadot/util";
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, subSeed, rpcUrl, wsUrl } = require("./config.js");

function h160ToPublicKey(evmAddress) {
  const combined = new Uint8Array(24);
  new TextEncoder().encodeInto("evm:", combined);
  combined.set(hexToU8a(evmAddress), 4);
  return blake2AsU8a(combined);
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(IPROXY_ADDRESS, IProxyABI, signer);

const proxies = await contract.getProxies(h160ToPublicKey(signer.address));
for (const p of proxies) {
  console.log(
    `Delegate: ${p.delegate}, type: ${p.proxy_type}, delay: ${p.delay}`,
  );
}
```

### Create a pure proxy with an EVM account

```js
import { ethers } from "ethers";
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, rpcUrl } = require("./config.js");

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(IPROXY_ADDRESS, IProxyABI, signer);

const PROXY_TYPE = 0;
const DELAY_BLOCKS = 0;
const DISAMBIGUATION_INDEX = 0;

// Create pure proxy
const pureTx = await contract.createPureProxy(
  PROXY_TYPE,
  DELAY_BLOCKS,
  DISAMBIGUATION_INDEX,
  {
    gasLimit: 300_000n,
  },
);
const pureReceipt = await pureTx.wait();
console.log(`Pure proxy created in block ${pureReceipt.blockNumber}`);
```

### Remove a proxy relationship on an EVM account

```js
import { ethers } from "ethers";
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";
import { decodeAddress } from "@polkadot/util-crypto";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey, rpcUrl } = require("./config.js");

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(IPROXY_ADDRESS, IProxyABI, signer);

const DELEGATE_SS58 = "5FJPvu5BGh2U3vrinRzDobr6Mtsrp...";
const PROXY_TYPE = 0;
const DELAY_BLOCKS = 0;

// Remove proxy
const tx = await contract.removeProxy(
  decodeAddress(DELEGATE_SS58), // or h160ToPublicKey(evmAddress) for EVM wallets
  PROXY_TYPE,
  DELAY_BLOCKS,
  { gasLimit: 300_000n },
);
await tx.wait();
console.log(`Proxy removed`);
```
