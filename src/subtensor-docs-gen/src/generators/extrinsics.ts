/**
 * generators/extrinsics.ts
 */

import * as path from "path";
import type { ApiPromise } from "@polkadot/api";
import {
  extractDocs,
  resolveTypeForHeading,
  fileHeader,
  writeFile,
  sortedPallets,
  palletAnchor,
  BITTENSOR_PALLETS,
} from "../utils";

export function generateExtrinsics(api: ApiPromise, outputDir: string): void {
  const lines: string[] = [];

  lines.push(
    fileHeader(
      "Extrinsics",
      "The following sections contain Extrinsic methods that are part of the Bittensor " +
        "(Subtensor) runtime. On the API, these are exposed via `api.tx.<Pallet>.<call_name>`.",
      (api as any)._options?.provider?.endpoint ?? "subtensor node",
    ),
  );

  const pallets = sortedPallets(api.tx as any);
  const bittensorPallets = pallets.filter(([n]) => BITTENSOR_PALLETS.has(n));
  const stdPallets = pallets.filter(([n]) => !BITTENSOR_PALLETS.has(n));

  if (bittensorPallets.length > 0) {
    lines.push("**Bittensor-specific pallets**\n");
    for (const [n] of bittensorPallets)
      lines.push(`- **[${n}](#${palletAnchor(n)})**`);
    lines.push("");
  }
  if (stdPallets.length > 0) {
    lines.push("**Standard Subtensor pallets**\n");
    for (const [n] of stdPallets)
      lines.push(`- **[${n}](#${palletAnchor(n)})**`);
    lines.push("");
  }

  for (const [palletName, palletTx] of pallets) {
    // Backtick-wrapped pallet name, no horizontal rule
    lines.push(`\n## \`${palletName}\`\n`);

    const calls = Object.entries(palletTx as Record<string, any>).sort(
      ([a], [b]) => a.localeCompare(b),
    );

    for (const [callName, callFn] of calls) {
      const meta = callFn?.meta;
      if (!meta) continue;

      // Build signature — use resolveTypeForHeading to prevent multi-line types
      const params = (meta.fields ?? []).map((field: any) => {
        const name = field.name?.toString?.() ?? "_";
        const typeStr = resolveTypeForHeading(field, api.registry);
        return `${name}: ${typeStr}`;
      });
      // Collapse everything onto one line — heading MUST be single-line
      const signature = `${callName}(${params.join(", ")})`
        .replace(/\s+/g, " ")
        .trim();

      lines.push(`### \`${signature}\`\n`);
      lines.push(`- **interface**: \`api.tx.${palletName}.${callName}\``);

      const docs = extractDocs(meta.docs ?? []);
      if (docs) {
        lines.push(`- **summary**: ${docs}`);
      }

      lines.push("");
    }
  }

  writeFile(path.join(outputDir, "extrinsics.md"), lines.join("\n"));
}
