import * as path from "path";
import type { ApiPromise } from "@polkadot/api";
import {
  extractDocs,
  resolveTypeById,
  fileHeader,
  writeFile,
  palletAnchor,
  palletHeading,
} from "../utils";

/**
 * Converts snake_case to camelCase.
 * FRAME runtime API method names are snake_case in Rust; polkadot.js exposes
 * them as camelCase (e.g. execute_block -> executeBlock).
 */
function snakeToCamel(s: string): string {
  return s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * Lowercases the first character so the runtime API namespace matches how
 * polkadot.js exposes it on api.call (e.g. SwapRuntimeApi -> swapRuntimeApi).
 */
function toCallNamespace(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/**
 * Resolves a Si registry type ID to a clean, human-readable type name.
 *
 * Strategy (in order):
 *  1. Named types with a path → return the leaf name (e.g. ApplyExtrinsicResult).
 *  2. Generic containers (Vec, Option, Result, Compact, Array, Tuple) →
 *     reconstruct recursively so inner types are also cleaned up.
 *  3. Fall back to the TypeDef string from the registry.
 *
 * A depth cap of 6 prevents infinite recursion on self-referential types.
 */
function readableType(typeId: any, registry: any, depth = 0): string {
  if (typeId === undefined || typeId === null) return "unknown";
  if (!registry || depth > 6) return String(typeId?.toNumber?.() ?? typeId);

  const id: number = typeId?.toNumber?.() ?? typeId;

  try {
    const siType = registry.lookup.getSiType(id);
    if (!siType) throw new Error("no siType");

    const pathArr: string[] = siType.path?.toJSON?.() ?? [];
    const leaf = pathArr.length > 0 ? pathArr[pathArr.length - 1] : "";
    const def = siType.def;

    // ── Named, non-generic types ─────────────────────────────────────────────
    // Return the leaf component of the Rust path directly (e.g. DispatchError,
    // ApplyExtrinsicResult, AccountId). Skip known generic wrappers so we
    // reconstruct them with their resolved inner types instead.
    const GENERIC_WRAPPERS = new Set([
      "Vec",
      "Option",
      "Result",
      "BoundedVec",
      "WeakBoundedVec",
      "BoundedBTreeMap",
      "BoundedBTreeSet",
      "Box",
    ]);
    if (leaf && !GENERIC_WRAPPERS.has(leaf)) {
      return leaf;
    }

    // ── Vec / Sequence ───────────────────────────────────────────────────────
    if (def?.isSequence) {
      const inner = readableType(
        def.asSequence.type.toNumber(),
        registry,
        depth + 1,
      );
      return `Vec<${inner}>`;
    }

    // ── Compact<T> ───────────────────────────────────────────────────────────
    if (def?.isCompact) {
      return readableType(def.asCompact.type.toNumber(), registry, depth + 1);
    }

    // ── [T; N] fixed-length array ────────────────────────────────────────────
    if (def?.isArray) {
      const inner = readableType(
        def.asArray.type.toNumber(),
        registry,
        depth + 1,
      );
      return `[${inner}; ${def.asArray.len}]`;
    }

    // ── Tuple (A, B, …) — also covers the unit type () → Null ───────────────
    if (def?.isTuple) {
      const parts: string[] = def.asTuple.map((t: any) =>
        readableType(t.toNumber(), registry, depth + 1),
      );
      return parts.length === 0 ? "Null" : `(${parts.join(", ")})`;
    }

    // ── Variant — special-case Option<T> and Result<T, E> ───────────────────
    if (def?.isVariant) {
      const variants = def.asVariant.variants;

      if (leaf === "Option") {
        const some = variants.find((v: any) => v.name.toString() === "Some");
        if (some?.fields?.length > 0) {
          const inner = readableType(
            some.fields[0].type.toNumber(),
            registry,
            depth + 1,
          );
          return `Option<${inner}>`;
        }
        return "Option<unknown>";
      }

      if (leaf === "Result") {
        const okVar = variants.find((v: any) => v.name.toString() === "Ok");
        const errVar = variants.find((v: any) => v.name.toString() === "Err");
        const okType =
          okVar?.fields?.length > 0
            ? readableType(okVar.fields[0].type.toNumber(), registry, depth + 1)
            : "Null";
        const errType =
          errVar?.fields?.length > 0
            ? readableType(
                errVar.fields[0].type.toNumber(),
                registry,
                depth + 1,
              )
            : "Null";
        return `Result<${okType}, ${errType}>`;
      }

      // Other variant types with a path: fall through to the leaf-name check
      // above (already handled) or to the typedef fallback below.
    }
  } catch {
    /* fall through to typedef */
  }

  // ── Fallback: raw typedef string ─────────────────────────────────────────
  try {
    const def = registry.lookup.getTypeDef(id);
    if (def?.type) return def.type;
  } catch {}

  return String(id);
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
            const methodName = snakeToCamel(
              method.name?.toString?.() ?? "unknown",
            );

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
    lines.push(`- **[${entry.apiName}](#${palletAnchor(entry.apiName)})**`);
  }

  // ── Per-API sections ──────────────────────────────────────────────────────
  for (const { apiName, methods } of apiEntries) {
    lines.push(palletHeading(apiName));

    for (const { methodName, params, returnType, docs } of methods) {
      const signature = `${methodName}(${params})`.replace(/\s+/g, " ").trim();

      lines.push(`### \`${signature}\`: \`${returnType}\`\n`);
      lines.push(
        `- **interface**: \`api.call.${toCallNamespace(apiName)}.${methodName}\``,
      );
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
