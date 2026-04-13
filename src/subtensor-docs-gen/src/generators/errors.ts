import * as path from "path";
import type { ApiPromise } from "@polkadot/api";
import {
  extractDocs,
  fileHeader,
  writeFile,
  sortedPallets,
  palletAnchor,
} from "../utils";

export function generateErrors(api: ApiPromise, outputDir: string): void {
  const lines: string[] = [];

  lines.push(
    fileHeader(
      "Errors",
      "Error variants returned by the Bittensor (Subtensor) runtime. " +
        "Accessible via `api.errors.<Pallet>.<ErrorName>`.",
      (api as any)._options?.provider?.endpoint ?? "subtensor node",
    ),
  );

  const pallets = sortedPallets(api.errors as any);
  for (const [n] of pallets) lines.push(`- **[${n}](#${palletAnchor(n)})**`);

  for (const [palletName, palletErrors] of pallets) {
    lines.push(`\n## \`${palletName}\`\n`);
    const errors = Object.entries(palletErrors as Record<string, any>).sort(
      ([a], [b]) => a.localeCompare(b),
    );

    for (const [errorName, errorDef] of errors) {
      const meta = errorDef?.meta;
      if (!meta) continue;

      lines.push(`### \`${errorName}\`\n`);
      lines.push(`- **interface**: \`api.errors.${palletName}.${errorName}\``);
      const docs = extractDocs(meta.docs ?? []);
      if (docs) lines.push(`- **summary**: ${docs}`);
      lines.push("");
    }
  }

  writeFile(path.join(outputDir, "errors.md"), lines.join("\n"));
}
