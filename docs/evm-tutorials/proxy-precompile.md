---
title: "Proxy Precompile"
---

# Proxy Precompile

The Proxy precompile exposes the Substrate proxy pallet to EVM contracts. Proxies let one account act on behalf of another for a limited set of operation types.

- **Address**: `0x000000000000000000000000000000000000080b`
- **Source code**: [ProxyPrecompile reference](https://github.com/RaoFoundation/subtensor/blob/main/precompiles/src/proxy.rs)

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

### Proxy type values

The following table contains available Subtensor proxy types and their indexes.

Source: [`common/src/lib.rs`](https://github.com/RaoFoundation/subtensor/blob/main/common/src/lib.rs#:~:text=match%20value%20%7B):

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

The canonical ABI is exported from [`contract-tests/src/contracts/proxy.ts`](https://github.com/RaoFoundation/subtensor/blob/main/contract-tests/src/contracts/proxy.ts). You can import the ABI and contract address from a local copy of the source file as shown:

```javascript
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";
```

### Add a proxy relationship on a Bittensor EVM address

Use `addProxy` to authorize an account to act on behalf of the caller on-chain. The function takes three arguments: `delegate` (the account being authorized), `proxy_type` (the scope of permitted operations), and `delay` (the number of blocks the proxy must wait before executing a call after announcing).

```js
import { ethers } from "ethers";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey } = require("./config.js");
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(IPROXY_ADDRESS, IProxyABI, signer);

const DELEGATE_PUBLIC_KEY = "DELEGATE_COLDKEY_PUBLIC_KEY"; // raw 32-byte public key
const PROXY_TYPE = 0; // Any — see proxy type index table
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

:::info

The `delegate` parameter expects a 32-byte public key. For Substrate wallets use `decodeAddress(ss58)` imported from `@polkadot/util-crypto`; for EVM wallets you must derive the corresponding public key for the H160 account before passing it.
:::

### Get all proxies for an EVM address

Use `getProxies` to retrieve all active proxy relationships for a given account. It takes a single argument: the `bytes32` public key of the account whose proxies you want to look up. The function returns an array of `ProxyInfo` structs, each containing the delegate public key, proxy type, and delay.

```javascript
import { ethers } from "ethers";
import { blake2AsU8a } from "@polkadot/util-crypto";
import { hexToU8a } from "@polkadot/util";
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey } = require("./config.js");

function h160ToPublicKey(evmAddress) {
  const combined = new Uint8Array(24);
  new TextEncoder().encodeInto("evm:", combined);
  combined.set(hexToU8a(evmAddress), 4);
  return blake2AsU8a(combined);
}

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(IPROXY_ADDRESS, IProxyABI, signer);

const proxies = await contract.getProxies(h160ToPublicKey(signer.address));
for (const p of proxies) {
  console.log(
    `Delegate: ${p.delegate}, type: ${p.proxy_type}, delay: ${p.delay}`,
  );
}
```

:::info
Passing `signer.address` to the `h160ToPublicKey` function applies HashedAddressMapping on the EVM's H160 account to derive the corresponding Substrate public key.
:::

### Execute a proxy with an EVM account

Use the `proxyCall` function to execute a call on behalf of another account through an existing proxy relationship.

The `force_proxy_type` optionally restricts which proxy type is used for the call — pass `[0]` for `Any` or the relevant proxy type index to match the relationship. The `call` parameter is the SCALE-encoded runtime call to execute. Both of these parameters accept `uint8[]` arrays — convert the encoded call hex before passing it as shown:

```js
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { delegateEthPrivateKey } = require("./config.cjs");
import { ethers } from "ethers";
import { blake2AsU8a } from "@polkadot/util-crypto";
import { hexToU8a } from "@polkadot/util";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const signer = new ethers.Wallet(delegateEthPrivateKey, provider);
const contract = new ethers.Contract(IPROXY_ADDRESS, IProxyABI, signer);

const ENCODED_CALL = "0x050300fe65717dad0447d71...8a554d5860e0284d717";

const tx = await contract.proxyCall(
  REAL_ADDRESS_PUBLIC_KEY,
  [0], // force_proxy_type: Any
  Array.from(ethers.getBytes(ENCODED_CALL)),
  { gasLimit: 500_000n },
);
const receipt = await tx.wait();

console.log(`Proxy call executed`);
```

:::info

The `real` parameter expects a 32-byte public key. For Substrate wallets use `decodeAddress(ss58)` imported from `@polkadot/util-crypto`, for EVM wallets use `h160ToPublicKey(evmAddress)` to derive the corresponding public key before passing it.
:::

### Create a pure proxy with an EVM account

Use `createPureProxy` to create a keyless proxy account controlled entirely by the caller.

```js
import { ethers } from "ethers";
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey } = require("./config.js");

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
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

Use `removeProxy` to revoke a specific proxy relationship. The arguments must exactly match those used when the proxy was created — `delegate`, `proxy_type`, and `delay`. If any value differs, the call will fail.

```js
import { ethers } from "ethers";
import { IProxyABI, IPROXY_ADDRESS } from "./contracts/proxy";

// PROTECT YOUR PRIVATE KEYS WELL, NEVER COMMIT THEM TO GITHUB OR SHARE WITH ANYONE
const { ethPrivateKey } = require("./config.js");

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const signer = new ethers.Wallet(ethPrivateKey, provider);
const contract = new ethers.Contract(IPROXY_ADDRESS, IProxyABI, signer);

const DELEGATE_PUBLIC_KEY = "DELEGATE_COLDKEY_PUBLIC_KEY"; // raw 32-byte public key
const PROXY_TYPE = 0;
const DELAY_BLOCKS = 0;

const tx = await contract.removeProxy(
  DELEGATE_PUBLIC_KEY,
  PROXY_TYPE,
  DELAY_BLOCKS,
  { gasLimit: 300_000n },
);
await tx.wait();
console.log(`Proxy removed`);
```
