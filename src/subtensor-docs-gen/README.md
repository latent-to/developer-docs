# subtensor-docs-gen

Generates the Markdown API reference at `docs/subtensor-api/` by connecting to a live
Subtensor node and introspecting the runtime metadata via `@polkadot/api`.

Modelled after the [polkadot.js docs generator](https://github.com/polkadot-js/docs).

## Prerequisites

- Node.js 18+
- Yarn 1.x (`npm install -g yarn` if not already installed)
- Access to a running Subtensor node (mainnet, testnet, or local)

## Setup

```bash
cd subtensor-docs-gen
yarn install
```

## Usage

### Against mainnet (finney)

```bash
yarn generate
```

Connects to `wss://entrypoint-finney.opentensor.ai:443`.

### Against a local dev node

```bash
# In one terminal — start the node
cargo run --release -- --dev

# In another terminal — generate
yarn generate:local
```

Connects to `ws://127.0.0.1:9944`.

### Against testnet

```bash
yarn generate:test
```

### Custom endpoint or output path

```bash
SUBTENSOR_WS=wss://my-node.example.com:443 yarn generate

# Write to a different directory
OUTPUT_DIR=/tmp/subtensor-docs yarn generate
```

## Output

All files are written to `../docs/api-reference/` (i.e. `subtensor/docs/api-reference/`):

| File            | Contents                                                |
| --------------- | ------------------------------------------------------- |
| `README.md`     | Overview + live pallet inventory table                  |
| `extrinsics.md` | All `api.tx.*` dispatchable calls                       |
| `events.md`     | All `api.events.*` event definitions                    |
| `errors.md`     | All `api.errors.*` error variants                       |
| `storage.md`    | All `api.query.*` storage items                         |
| `constants.md`  | All `api.consts.*` runtime constants (with live values) |
| `rpc.md`        | Custom Subtensor JSON-RPC methods                       |

## Project structure

```
subtensor-docs-gen/
├── package.json
├── tsconfig.json
├── src/
│   ├── generate.ts          ← main entry point
│   ├── types.ts             ← Bittensor custom SCALE types + RPC defs
│   ├── utils.ts             ← shared Markdown helpers
│   └── generators/
│       ├── extrinsics.ts
│       ├── events.ts
│       ├── errors.ts
│       ├── storage.ts
│       ├── constants.ts
```

## How it works

1. `generate.ts` connects to the node via WebSocket using `@polkadot/api`.
2. The API performs a `state_getMetadata` RPC call, returning SCALE-encoded FRAME metadata.
3. Custom types from `types.ts` are registered so Bittensor-specific structs decode correctly.
4. Each generator module walks its namespace (`api.tx`, `api.events`, etc.), extracts doc comments and type info, and writes a Markdown file.
5. `constants.ts` additionally reads the _live values_ of each constant from the running node.
6. All files are written to the configured `OUTPUT_DIR`.

## Automation

A GitHub Actions workflow at `.github/workflows/update-api-docs.yml` runs every Friday at 06:00 UTC.
It opens a pull request with the updated docs when changes are detected.

You can also trigger it manually from the **Actions** tab with an optional custom endpoint.

## Adding new custom types

If Subtensor introduces a new pallet or struct, update `src/types.ts`:

```typescript
export const bittensorTypes = {
  // existing types...
  MyNewStruct: {
    field_one: "u64",
    field_two: "AccountId",
  },
};
```
