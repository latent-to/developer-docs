/**
 * generate.ts
 *
 * Main entry point for the Subtensor API reference doc generator.
 *
 * Usage:
 *   yarn generate                          # mainnet (finney)
 *   yarn generate:local                    # local dev node
 *   yarn generate:test                     # testnet
 *   SUBTENSOR_WS=ws://... yarn ts-node src/generate.ts
 *
 * Output:
 *   Writes Markdown files to OUTPUT_DIR (default: ../docs/api-reference
 *   relative to the subtensor repo root, i.e. one level up from this project).
 */

import * as path from "path";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { bittensorTypes, bittensorRpc } from "./types";
import { ensureDir } from "./utils";
import { generateExtrinsics } from "./generators/extrinsics";
import { generateEvents } from "./generators/events";
import { generateErrors } from "./generators/errors";
import { generateStorage } from "./generators/storage";
import { generateConstants } from "./generators/constants";
import { generateRpc } from "./generators/rpc";
import { generateRuntimeCalls } from "./generators/runtime";

// ── Configuration ─────────────────────────────────────────────────────────────

const WS_ENDPOINT =
  process.env.SUBTENSOR_WS ?? "wss://entrypoint-finney.opentensor.ai:443";

const OUTPUT_DIR =
  process.env.OUTPUT_DIR ??
  path.resolve(__dirname, "..", "..", "..", "docs", "subtensor-api");

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("\n╔════════════════════════════════════════════════╗");
  console.log("║  Subtensor API Reference — Doc Generator       ║");
  console.log("╚════════════════════════════════════════════════╝\n");
  console.log(`  Endpoint : ${WS_ENDPOINT}`);
  console.log(`  Output   : ${OUTPUT_DIR}\n`);

  // ── Connect ──────────────────────────────────────────────────────────────
  console.log("▶ Connecting to node...");
  const provider = new WsProvider(WS_ENDPOINT, 5_000 /* reconnect delay ms */);

  const api = await ApiPromise.create({
    provider,
    types: bittensorTypes,
    rpc: bittensorRpc,
  });

  await api.isReady;

  const chain = (await api.rpc.system.chain()).toString();
  const nodeName = (await api.rpc.system.name()).toString();
  const nodeVer = (await api.rpc.system.version()).toString();
  const specVer = api.runtimeVersion.specVersion.toString();

  console.log(`\n  Chain    : ${chain}`);
  console.log(`  Node     : ${nodeName} ${nodeVer}`);
  console.log(`  Spec ver : ${specVer}`);

  // ── Prepare output directory ──────────────────────────────────────────────
  ensureDir(OUTPUT_DIR);
  console.log("\n▶ Generating docs...\n");

  // ── Run all generators ────────────────────────────────────────────────────
  generateExtrinsics(api, OUTPUT_DIR);
  generateEvents(api, OUTPUT_DIR);
  generateErrors(api, OUTPUT_DIR);
  generateStorage(api, OUTPUT_DIR);
  generateConstants(api, OUTPUT_DIR);
  await generateRpc(api, OUTPUT_DIR);
  generateRuntimeCalls(api, OUTPUT_DIR);

  console.log("\n▶ Done.\n");

  // ── Clean up ──────────────────────────────────────────────────────────────
  await api.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✖ Fatal error:", err);
  process.exit(1);
});
