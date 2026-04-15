import * as path from "path";
import type { ApiPromise } from "@polkadot/api";
import {
  extractDocs,
  fileHeader,
  writeFile,
  sortedPallets,
  palletAnchor,
} from "../utils";

// ── Type name helpers ─────────────────────────────────────────────────────────

/**
 * Converts snake_case to PascalCase.
 */
function snakeToPascal(s: string): string {
  return s
    .replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

/**
 * Split "A,B<C,D>,E" on top-level commas only (respects nesting).
 */
function splitTypeList(s: string): string[] {
  const parts: string[] = [];
  let depth = 0,
    start = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "<" || s[i] === "(") depth++;
    else if (s[i] === ">" || s[i] === ")") depth--;
    else if (s[i] === "," && depth === 0) {
      parts.push(s.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(s.slice(start));
  return parts;
}

/**
 * Simplify a raw TypeDef type string, replacing verbose generics with
 * readable equivalents:
 *   BoundedVec<T, N>        → Vec<T>
 *   WeakBoundedVec<T, N>    → Vec<T>
 *   BoundedBTreeMap<K,V,N>  → BTreeMap<K,V>
 *   BoundedBTreeSet<T,N>    → BTreeSet<T>
 *   WrapperOpaque<T>        → T
 *   WrapperKeepOpaque<T>    → T
 *   Box<T>                  → T
 */
function simplifyTypeString(t: string): string {
  // BoundedVec / WeakBoundedVec → Vec<inner>
  t = t.replace(
    /(?:Weak)?BoundedVec<(.+),\s*[^,>]+>/,
    (_m, inner) => `Vec<${inner.trim()}>`,
  );
  // BoundedBTreeMap → BTreeMap
  t = t.replace(
    /BoundedBTreeMap<(.+),\s*[^,>]+>/,
    (_m, kv) => `BTreeMap<${kv.trim()}>`,
  );
  // BoundedBTreeSet → BTreeSet
  t = t.replace(
    /BoundedBTreeSet<(.+),\s*[^,>]+>/,
    (_m, inner) => `BTreeSet<${inner.trim()}>`,
  );
  // WrapperOpaque / WrapperKeepOpaque / Box → unwrap
  t = t.replace(/(?:WrapperKeepOpaque|WrapperOpaque|Box)<(.+)>/, (_m, inner) =>
    inner.trim(),
  );
  return t.trim();
}

/**
 * Derives a clean, readable type name from a PortableRegistry lookup ID.
 *
 * Priority:
 *  1. Named path from SiType (e.g. AccountData, Multisig) — most specific
 *  2. TypeDef string, simplified (BoundedVec→Vec, etc.)
 *  3. Fallback to string of the id
 */
function readableTypeName(id: any, registry: any): string {
  if (!registry || id === undefined) return String(id ?? "?");

  // Try named path first
  try {
    const siType = registry.lookup.getSiType(id);
    if (siType) {
      const pathArr: string[] = siType.path?.toJSON?.() ?? [];
      if (pathArr.length > 0) {
        const leaf = pathArr[pathArr.length - 1];
        // Skip generic Rust wrapper names that aren't meaningful on their own
        const SKIP = new Set([
          "BoundedVec",
          "WeakBoundedVec",
          "BoundedBTreeMap",
          "BoundedBTreeSet",
          "WrapperOpaque",
          "WrapperKeepOpaque",
          "Box",
          "Vec",
        ]);
        if (!SKIP.has(leaf)) {
          return snakeToPascal(leaf);
        }
      }
    }
  } catch {
    /* fall through */
  }

  // TypeDef string, simplified
  try {
    const def = registry.lookup.getTypeDef(id);
    if (def?.type) {
      const t = def.type.trim();
      if (t.startsWith("{")) {
        // Inline struct JSON — try to get name from path instead
        try {
          const siType = registry.lookup.getSiType(id);
          const pathArr: string[] = siType?.path?.toJSON?.() ?? [];
          if (pathArr.length > 0)
            return snakeToPascal(pathArr[pathArr.length - 1]);
        } catch {
          /* fall through */
        }
        return "Object";
      }
      return simplifyTypeString(t);
    }
  } catch {
    /* fall through */
  }

  return String(id);
}

/**
 * Resolves a key ID to a list of type strings.
 * For tuple keys "(A,B,C)", returns ["A","B","C"].
 * For a single key, returns ["KeyType"].
 */
function readableKeyTypes(id: any, registry: any): string[] {
  if (!registry || id === undefined) return [String(id ?? "?")];
  try {
    const def = registry.lookup.getTypeDef(id);
    if (def?.type) {
      const t = def.type.trim();
      if (t.startsWith("(") && t.endsWith(")")) {
        const inner = t.slice(1, -1);
        return splitTypeList(inner).map((p) => simplifyTypeString(p.trim()));
      }
    }
  } catch {
    /* fall through */
  }
  return [readableTypeName(id, registry)];
}

// ── Storage heading ───────────────────────────────────────────────────────────

/**
 * Builds the heading in the form:
 *   `name(KeyType)`: `ValueType`         — Maps
 *   `name(Key1, Key2)`: `ValueType`      — DoubleMaps / tuple keys
 *   `name`: `ValueType`                  — Plain values
 */
function storageHeading(queryName: string, meta: any, registry: any): string {
  if (meta.type?.isMap) {
    const m = meta.type.asMap;
    const keys = readableKeyTypes(m.key, registry).join(", ");
    const value = readableTypeName(m.value, registry);
    return `\`${queryName}(${keys})\`: \`${value}\``;
  }

  if (meta.type?.isDoubleMap) {
    const dm = meta.type.asDoubleMap;
    const k1 = readableTypeName(dm.key1, registry);
    const k2 = readableTypeName(dm.key2, registry);
    const value = readableTypeName(dm.value, registry);
    return `\`${queryName}(${k1}, ${k2})\`: \`${value}\``;
  }

  if (meta.type?.isNMap) {
    const nm = meta.type.asNMap;
    const keys = (nm.keyVec ?? [])
      .map((k: any) => readableTypeName(k, registry))
      .join(", ");
    const value = readableTypeName(nm.value, registry);
    return `\`${queryName}(${keys})\`: \`${value}\``;
  }

  if (meta.type?.isPlain) {
    const value = readableTypeName(meta.type.asPlain, registry);
    return `\`${queryName}\`: \`${value}\``;
  }

  return `\`${queryName}\``;
}

// ── Generator ─────────────────────────────────────────────────────────────────

export function generateStorage(api: ApiPromise, outputDir: string): void {
  const lines: string[] = [];

  lines.push(
    fileHeader(
      "Storage",
      "This page contains storage query definitions for the Subtensor runtime. " +
        "Accessible via `api.query.<Pallet>.<storage_item>`.",
      (api as any)._options?.provider?.endpoint ?? "subtensor node",
    ),
  );

  const pallets = sortedPallets(api.query as any);
  for (const [n] of pallets) lines.push(`- **[${n}](#${palletAnchor(n)})**`);

  for (const [palletName, palletQuery] of pallets) {
    lines.push(`\n## \`${palletName}\`\n`);
    const items = Object.entries(palletQuery as Record<string, any>).sort(
      ([a], [b]) => a.localeCompare(b),
    );

    for (const [queryName, queryFn] of items) {
      const meta = queryFn?.creator?.meta ?? queryFn?.meta;
      if (!meta) continue;

      lines.push(`### ${storageHeading(queryName, meta, api.registry)}\n`);
      lines.push(`- **interface**: \`api.query.${palletName}.${queryName}\``);

      const modifier = meta.modifier?.toString?.();
      if (modifier && modifier !== "Default")
        lines.push(`- **modifier**: \`${modifier}\``);

      const docs = extractDocs(meta.docs ?? []);
      if (docs) lines.push(`- **summary**: ${docs}`);
      lines.push("");
    }
  }

  writeFile(path.join(outputDir, "storage.md"), lines.join("\n"));
}
