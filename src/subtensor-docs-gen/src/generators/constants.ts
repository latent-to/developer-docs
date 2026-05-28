import * as path from "path";
import type { ApiPromise } from "@polkadot/api";
import {
  extractDocs,
  resolveTypeById,
  fileHeader,
  writeFile,
  sortedPallets,
  palletAnchor,
} from "../utils";

export function generateConstants(api: ApiPromise, outputDir: string): void {
  const lines: string[] = [];

  lines.push(
    fileHeader(
      "Constants",
      "This page contains compile-time runtime constants for the Subtensor runtime and their respective values. " +
        "Accessible via `api.consts.<Pallet>.<constant_name>`. Values read live from node.",
      (api as any)._options?.provider?.endpoint ?? "subtensor node",
      api.runtimeVersion.specVersion.toString(),
    ),
  );

  const pallets = sortedPallets(api.consts as any);
  for (const [n] of pallets) lines.push(`- **[${n}](#${palletAnchor(n)})**`);

  for (const [palletName, palletConsts] of pallets) {
    lines.push(`\n## \`${palletName}\`\n`);
    const consts = Object.entries(palletConsts as Record<string, any>).sort(
      ([a], [b]) => a.localeCompare(b),
    );

    for (const [constName, constVal] of consts) {
      const meta = (constVal as any)?.meta;
      const typeStr = (
        meta?.type !== undefined
          ? resolveTypeById(meta.type, api.registry)
          : "unknown"
      )
        .replace(/\s+/g, " ")
        .trim();

      lines.push(`### \`${constName}\`: \`${typeStr}\`\n`);
      lines.push(`- **interface**: \`api.consts.${palletName}.${constName}\``);
      try {
        lines.push(`- **value**: \`${(constVal as any).toString()}\``);
      } catch {
        lines.push(`- **value**: *(unable to decode)*`);
      }
      const docs = extractDocs(meta?.docs ?? []);
      if (docs) lines.push(`- **summary**: ${docs}`);
      lines.push("");
    }
  }

  writeFile(path.join(outputDir, "constants.md"), lines.join("\n"));
}