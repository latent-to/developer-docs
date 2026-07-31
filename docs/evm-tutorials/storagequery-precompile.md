---
title: "StorageQuery Precompile"
---

# StorageQuery Precompile

Provides raw read access to on-chain Substrate storage from within an EVM contract. Pass a SCALE-encoded storage key as calldata; receive the raw SCALE-encoded value.

The precompile is restricted to authorized pallet prefixes: `SubtensorModule`, `Swap`, `Balances`, `Proxy`, `Scheduler`, `Drand`, `Crowdloan`, `Sudo`, `Multisig`, `Timestamp`. Any key outside these prefixes returns an error.

- **Address**: `0x0000000000000000000000000000000000000807`
- **Source code**: [StorageQuery reference](https://github.com/RaoFoundation/subtensor/blob/14bc6f9f964b9cc362e9635dd110a487fa5d15a0/precompiles/src/storage_query.rs)

## Interface

The precompile does not use ABI-encoded calls — pass the raw storage key directly as calldata. For example:

```javascript
import { ethers } from "ethers";

const STORAGE_QUERY_ADDRESS = "0x0000000000000000000000000000000000000807";

const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");

const KEYS = {
  TotalIssuance:
    "0x658faa385070e074c85bf6b568cf055557c875e4cff74148e4628f264b974c80",
  TotalNetworks:
    "0x658faa385070e074c85bf6b568cf05555f3bb7bcd0a076a48abf8c256d221721",
};

for (const [name, key] of Object.entries(KEYS)) {
  try {
    const raw = await provider.call({
      to: STORAGE_QUERY_ADDRESS,
      data: key,
    });
    console.log(`${name}`);
    console.log(`  key: ${key}`);
    console.log(`  raw: ${raw}`);
    // raw is SCALE-encoded — decode with @polkadot/api for human-readable values
  } catch (err) {
    console.log(`${name} error: ${err.message}`);
  }
}
```

:::info when to use the StorageQuery precompile

Use StorageQuery when the value you need is not exposed by any typed precompile. For most use cases, prefer the typed precompiles (Metagraph, Alpha, Staking, etc.) — raw storage values are SCALE-encoded and require Substrate codec knowledge to decode on-chain.
:::
