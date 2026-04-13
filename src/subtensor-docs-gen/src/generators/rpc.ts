import * as path from "path";
import type { ApiPromise } from "@polkadot/api";
import { rpcDefinitions } from "@polkadot/types";
import { fileHeader, writeFile, palletAnchor } from "../utils";
 
// ── Types ───────────────────────────────────────────────────────────────────
 
type MethodInfo = {
  name: string;
  description: string;
  params: { name: string; type: string; isOptional?: boolean }[];
  returnType: string;
  isSubscription: boolean;
  isUnsafe: boolean;
};
 
// ── Helpers ─────────────────────────────────────────────────────────────────
 
/**
 * Determines the real namespace for a method.
 * Some methods use `aliasSection` (e.g. `net_*` and `web3_*` are defined
 * inside the `eth` interface module but belong to their own namespace).
 */
function effectiveSection(section: string, def: any): string {
  return def.aliasSection?.toString?.() ?? section;
}
 
/**
 * Queries the node for its supported RPC methods via `rpc_methods`.
 * Returns a Set of "section_method" strings, or null if the call fails.
 */
async function fetchNodeMethods(api: ApiPromise): Promise<Set<string> | null> {
  try {
    const result = await (api.rpc as any).rpc.methods();
    const list: string[] =
      result?.methods?.toJSON?.() ?? result?.toJSON?.()?.methods ?? [];
    if (list.length === 0) return null;
    return new Set(list);
  } catch {
    return null;
  }
}
 
/**
 * Builds the JSON-RPC method name(s) for matching against the node's method list.
 * Handles aliases: e.g. `chain.getFinalizedHead` also registers as
 * `chain_getFinalisedHead`.
 */
function rpcMethodNames(section: string, method: string, def: any): string[] {
  const names = [`${section}_${method}`];
  const aliases: string[] = def?.alias?.toJSON?.() ?? def?.alias ?? [];
  if (Array.isArray(aliases)) {
    for (const a of aliases) names.push(a);
  }
  // pubsub methods also register subscribe/unsubscribe variants
  if (Array.isArray(def?.pubsub) && def.pubsub.length >= 2) {
    names.push(`${section}_${def.pubsub[1]}`);
  }
  return names;
}
 
// ── Generator ─────────────────────────────────────────────────────────────────
 
export async function generateRpc(
  api: ApiPromise,
  outputDir: string,
): Promise<void> {
  const lines: string[] = [];
 
  lines.push(
    fileHeader(
      "RPC",
      "JSON-RPC methods available on a Bittensor (Subtensor) node. " +
        "Accessible via `api.rpc.<namespace>.<method_name>`.",
      (api as any)._options?.provider?.endpoint ?? "subtensor node",
    ),
  );
 
  // ── 1. Ask the node which methods it actually supports ────────────────────
 
  const nodeMethods = await fetchNodeMethods(api);
  if (nodeMethods) {
    console.log(`  ℹ  rpc_methods returned ${nodeMethods.size} methods — filtering to node-supported RPCs`);
  } else {
    console.log("  ⚠  rpc_methods unavailable — including all known definitions");
  }
 
  // ── 2. Build definitions catalogue from @polkadot/types ───────────────────
 
  const allNamespaces = new Map<string, Map<string, { info: MethodInfo; def: any }>>();
 
  for (const [section, defs] of Object.entries(
    rpcDefinitions as Record<string, Record<string, any>>,
  )) {
    for (const [method, def] of Object.entries(defs)) {
      const ns = effectiveSection(section, def);
 
      if (!allNamespaces.has(ns)) allNamespaces.set(ns, new Map());
      const nsMethods = allNamespaces.get(ns)!;
 
      if (!nsMethods.has(method)) {
        nsMethods.set(method, {
          info: {
            name: method,
            description: def.description?.toString?.() ?? "",
            params: (def.params ?? []).map((p: any) => ({
              name: p.name?.toString?.() ?? "_",
              type: p.type?.toString?.() ?? "unknown",
              isOptional: !!p.isOptional,
            })),
            returnType: def.type?.toString?.() ?? "unknown",
            isSubscription: Array.isArray(def.pubsub),
            isUnsafe: !!def.isUnsafe,
          },
          def,
        });
      }
    }
  }
 
  // ── 3. Runtime supplement — pick up anything extra the node exposes ────────
 
  try {
    const rpcCore = api.rpc as any;
    const mapping: Map<string, any> | undefined = rpcCore?.mapping;
    if (mapping) {
      for (const [, def] of mapping) {
        const section: string = def.section ?? "";
        const method: string = def.method ?? "";
        if (!section || !method) continue;
 
        const ns = effectiveSection(section, def);
        if (!allNamespaces.has(ns)) allNamespaces.set(ns, new Map());
        const nsMethods = allNamespaces.get(ns)!;
 
        if (!nsMethods.has(method)) {
          nsMethods.set(method, {
            info: {
              name: method,
              description: def.description?.toString?.() ?? "",
              params: (def.params ?? []).map((p: any) => ({
                name: p.name?.toString?.() ?? "_",
                type: p.type?.toString?.() ?? "unknown",
                isOptional: !!p.isOptional,
              })),
              returnType: def.type?.toString?.() ?? "unknown",
              isSubscription: !!def.isSubscription,
              isUnsafe: !!def.isUnsafe,
            },
            def,
          });
        }
      }
    }
  } catch {
    /* non-critical — we already have the static definitions */
  }
 
  // ── 4. Filter to only node-supported methods (if available) ───────────────
 
  const namespaces = new Map<string, MethodInfo[]>();
 
  for (const [ns, methods] of allNamespaces) {
    const filtered: MethodInfo[] = [];
 
    for (const [method, { info, def }] of methods) {
      if (nodeMethods) {
        const names = rpcMethodNames(ns, method, def);
        const supported = names.some((n) => nodeMethods.has(n));
        if (!supported) continue;
      }
      filtered.push(info);
    }
 
    if (filtered.length > 0) {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      namespaces.set(ns, filtered);
    }
  }
 
  // ── Sort ──────────────────────────────────────────────────────────────────
 
  const sortedNs = [...namespaces.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );
 
  // ── Table of contents ─────────────────────────────────────────────────────
 
  for (const [n] of sortedNs)
    lines.push(`- **[${n}](#${palletAnchor(n)})**`);
 
  // ── Per-namespace sections ────────────────────────────────────────────────
 
  for (const [nsName, methods] of sortedNs) {
    lines.push(`\n## \`${nsName}\`\n`);
 
    for (const m of methods) {
      const paramStr = m.params
        .map((p) => `${p.name}${p.isOptional ? "?" : ""}: ${p.type}`)
        .join(", ");
 
      lines.push(`### \`${m.name}(${paramStr})\`: \`${m.returnType}\`\n`);
      lines.push(`- **interface**: \`api.rpc.${nsName}.${m.name}\``);
      if (m.isSubscription) lines.push(`- **jsonrpc**: subscription`);
      if (m.isUnsafe) lines.push(`- **unsafe**: this method is flagged as unsafe`);
      if (m.description) lines.push(`- **summary**: ${m.description}`);
      lines.push("");
    }
  }
 
  if (sortedNs.length === 0) {
    lines.push("\n*No RPC methods found.*\n");
  }
 
  writeFile(path.join(outputDir, "rpc.md"), lines.join("\n"));
}