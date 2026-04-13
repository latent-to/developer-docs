import * as path from "path";
import type { ApiPromise } from "@polkadot/api";
import {
  extractDocs,
  resolveTypeById,
  fileHeader,
  writeFile,
} from "../utils";

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

export function generateRuntimeCalls(
  api: ApiPromise,
  outputDir: string,
): void {
  const lines: string[] = [];

  lines.push(
    fileHeader(
      "Runtime Calls",
      "Runtime API calls exposed by the Bittensor (Subtensor) runtime. " +
        "Accessible via `api.call.<RuntimeApi>.<method_name>`.",
      (api as any)._options?.provider?.endpoint ?? "subtensor node",
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

  try {
    const runtimeApis = (api as any).runtimeMetadata?.asLatest?.apis;
    if (runtimeApis) {
      for (const runtimeApi of runtimeApis) {
        const traitNameParts: string[] =
          runtimeApi.name?.toJSON?.() ??
          runtimeApi.name?.toString?.()?.split("::") ??
          [];
        const apiName =
          traitNameParts.length > 0
            ? traitNameParts[traitNameParts.length - 1]
            : runtimeApi.name?.toString?.() ?? "Unknown";

        const methods: ApiEntry["methods"] = [];

        for (const method of runtimeApi.methods ?? []) {
          const methodName = method.name?.toString?.() ?? "unknown";

          const params = (method.inputs ?? [])
            .map((input: any) => {
              const name = input.name?.toString?.() ?? "_";
              const typeStr = readableType(input.type ?? input.ty, api.registry);
              return `${name}: ${typeStr}`;
            })
            .join(", ");

          const returnType = readableType(
            method.output ?? method.outputTy,
            api.registry,
          );

          const docs = extractDocs(method.docs?.toJSON?.() ?? method.docs ?? []);

          methods.push({ methodName, params, returnType, docs });
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

  // ── Fallback: introspect api.call namespace ───────────────────────────────

  if (apiEntries.length === 0) {
    try {
      const callNs = api.call as any;
      if (callNs && typeof callNs === "object") {
        for (const [apiName, apiMethods] of Object.entries(callNs).sort(
          ([a], [b]) => a.localeCompare(b),
        )) {
          if (
            !apiMethods ||
            typeof apiMethods !== "object" ||
            apiName.startsWith("_")
          )
            continue;

          const methods: ApiEntry["methods"] = [];

          for (const [methodName, methodFn] of Object.entries(
            apiMethods as Record<string, any>,
          ).sort(([a], [b]) => a.localeCompare(b))) {
            if (typeof methodFn !== "function") continue;

            const meta = (methodFn as any)?.meta;
            const params = (meta?.fields ?? meta?.params ?? [])
              .map((f: any) => {
                const name = f.name?.toString?.() ?? "_";
                const typeStr = readableType(
                  f.type ?? f.typeName,
                  api.registry,
                );
                return `${name}: ${typeStr}`;
              })
              .join(", ");

            const returnType = meta?.type
              ? readableType(meta.type, api.registry)
              : "unknown";

            const docs = extractDocs(meta?.docs ?? []);
            methods.push({ methodName, params, returnType, docs });
          }

          if (methods.length > 0) {
            apiEntries.push({ apiName, methods });
          }
        }
      }
    } catch (err) {
      console.warn("  ⚠  Could not introspect api.call namespace:", err);
    }
  }

  apiEntries.sort((a, b) => a.apiName.localeCompare(b.apiName));

  // ── Table of contents ─────────────────────────────────────────────────────
  for (const entry of apiEntries) {
    lines.push(
      `- **[${entry.apiName}](#${entry.apiName.toLowerCase()})**`,
    );
  }

  // ── Per-API sections ──────────────────────────────────────────────────────
  for (const { apiName, methods } of apiEntries) {
    lines.push(`\n## \`${apiName}\`\n`);

    for (const { methodName, params, returnType, docs } of methods) {
      const signature = `${methodName}(${params})`
        .replace(/\s+/g, " ")
        .trim();

      lines.push(`### \`${signature}\`: \`${returnType}\`\n`);
      lines.push(
        `- **interface**: \`api.call.${apiName}.${methodName}\``,
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

  writeFile(path.join(outputDir, "runtime-calls.md"), lines.join("\n"));
}
