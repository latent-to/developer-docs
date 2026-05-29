import * as path from "path";
import type { ApiPromise } from "@polkadot/api";
import { extractDocs, resolveTypeById, fileHeader, writeFile } from "../utils";

/**
 * Attempt to derive a readable type name from a type ID via the registry.
 */
function readableType(typeId: any, registry: any): string {
  if (typeId === undefined || typeId === null) return "unknown";
  try {
    return resolveTypeById(typeId, registry);
  } catch {
    return String(typeId);
  }
}

export function generateRuntimeCalls(api: ApiPromise, outputDir: string): void {
  const lines: string[] = [];

  lines.push(
    fileHeader(
      "Runtime Calls",
      "This page includes runtime API calls exposed by the Subtensor runtime. " +
        "Accessible via `api.call.<RuntimeApi>.<method_name>`.",
      (api as any)._options?.provider?.endpoint ?? "subtensor node",
      api.runtimeVersion.specVersion.toString(),
    ),
  );

  // ── Collect runtime APIs from metadata ────────────────────────────────────

  type ApiEntry = {
    apiName: string;
    methods: {
      methodName: string;
      params: string;
      returnType: string;
      docs: string;
    }[];
  };

  const apiEntries: ApiEntry[] = [];

  // ── Primary: api.runtimeMetadata.asLatest.apis ───────────────────────────
  //
  // Confirmed via diagnostic: asLatest.apis returns all 23 runtime APIs.
  // Each api.name.toString() gives the correct PascalCase name.
  // Each method.output is a polkadot.js codec object — .toNumber() extracts
  // the plain numeric type ID needed by resolveTypeById.
  //
  // Error handling is per-method, not per-batch: a single method that fails
  // type resolution no longer silently discards every other API.

  try {
    const runtimeApis = (api.runtimeMetadata as any).asLatest?.apis;
    if (runtimeApis && runtimeApis.length > 0) {
      for (const runtimeApi of runtimeApis) {
        const apiName = runtimeApi.name?.toString?.() ?? "Unknown";
        const methods: ApiEntry["methods"] = [];

        for (const method of runtimeApi.methods ?? []) {
          try {
            const methodName = method.name?.toString?.() ?? "unknown";

            const params = (method.inputs ?? [])
              .map((input: any) => {
                const name = input.name?.toString?.() ?? "_";
                // .toNumber() extracts the plain type ID from the codec object
                const typeId =
                  input.type?.toNumber?.() ??
                  input.ty?.toNumber?.() ??
                  input.type ??
                  input.ty;
                return `${name}: ${readableType(typeId, api.registry)}`;
              })
              .join(", ");

            const rawOutput = method.output ?? method.outputTy;
            const outputId = rawOutput?.toNumber?.() ?? rawOutput;
            const returnType = readableType(outputId, api.registry);

            const docs = extractDocs(
              method.docs?.toJSON?.() ?? method.docs ?? [],
            );

            methods.push({ methodName, params, returnType, docs });
          } catch {
            /* skip individual methods that fail type resolution */
          }
        }

        if (methods.length > 0) {
          methods.sort((a, b) => a.methodName.localeCompare(b.methodName));
          apiEntries.push({ apiName, methods });
        }
      }
    }
  } catch (err) {
    console.warn("  ⚠  Could not read runtime API metadata:", err);
  }

  // ── Supplement: api.call namespace ───────────────────────────────────────
  //
  // api.call holds APIs registered via polkadot.js type augmentation (camelCase
  // names). Always run this pass and add any entry not already found in the
  // metadata results. Case-insensitive comparison handles the PascalCase vs
  // camelCase difference between the two sources.

  const foundLower = new Set(apiEntries.map((e) => e.apiName.toLowerCase()));

  try {
    const callNs = api.call as any;
    if (callNs && typeof callNs === "object") {
      for (const [apiName, apiMethods] of Object.entries(callNs).sort(
        ([a], [b]) => a.localeCompare(b),
      )) {
        if (
          !apiMethods ||
          typeof apiMethods !== "object" ||
          apiName.startsWith("_") ||
          foundLower.has(apiName.toLowerCase())
        )
          continue;

        const methods: ApiEntry["methods"] = [];

        for (const [methodName, methodFn] of Object.entries(
          apiMethods as Record<string, any>,
        ).sort(([a], [b]) => a.localeCompare(b))) {
          if (typeof methodFn !== "function") continue;

          try {
            const meta = (methodFn as any)?.meta;
            const params = (meta?.fields ?? meta?.params ?? [])
              .map((f: any) => {
                const name = f.name?.toString?.() ?? "_";
                const typeId =
                  f.type?.toNumber?.() ??
                  f.typeName?.toNumber?.() ??
                  f.type ??
                  f.typeName;
                return `${name}: ${readableType(typeId, api.registry)}`;
              })
              .join(", ");

            const rawOutput = meta?.type;
            const outputId = rawOutput?.toNumber?.() ?? rawOutput;
            const returnType = outputId
              ? readableType(outputId, api.registry)
              : "unknown";

            const docs = extractDocs(meta?.docs ?? []);
            methods.push({ methodName, params, returnType, docs });
          } catch {
            /* skip individual methods that fail type resolution */
          }
        }

        if (methods.length > 0) {
          apiEntries.push({ apiName, methods });
        }
      }
    }
  } catch (err) {
    console.warn("  ⚠  Could not supplement from api.call namespace:", err);
  }

  apiEntries.sort((a, b) => a.apiName.localeCompare(b.apiName));

  // ── Table of contents ─────────────────────────────────────────────────────
  for (const entry of apiEntries) {
    lines.push(`- **[${entry.apiName}](#${entry.apiName.toLowerCase()})**`);
  }

  // ── Per-API sections ──────────────────────────────────────────────────────
  for (const { apiName, methods } of apiEntries) {
    lines.push(`\n## \`${apiName}\`\n`);

    for (const { methodName, params, returnType, docs } of methods) {
      const signature = `${methodName}(${params})`.replace(/\s+/g, " ").trim();

      lines.push(`### \`${signature}\`: \`${returnType}\`\n`);
      lines.push(`- **interface**: \`api.call.${apiName}.${methodName}\``);
      if (docs) {
        lines.push(`- **summary**: ${docs}`);
      }
      lines.push("");
    }
  }

  if (apiEntries.length === 0) {
    lines.push(
      "\n*No runtime API calls found in the connected node's metadata.*\n",
    );
  }

  writeFile(path.join(outputDir, "runtime.md"), lines.join("\n"));
}
