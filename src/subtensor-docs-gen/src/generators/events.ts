import * as path from "path";
import type { ApiPromise } from "@polkadot/api";
import {
  extractDocs,
  resolveTypeForHeading,
  fileHeader,
  writeFile,
  sortedPallets,
  palletAnchor,
  palletHeading,
} from "../utils";

export function generateEvents(api: ApiPromise, outputDir: string): void {
  const lines: string[] = [];

  lines.push(
    fileHeader(
      "Events",
      "The following page contains runtime events emitted by the Subtensor runtime. " +
        "Accessible via `api.events.<Pallet>.<EventName>`.",
      (api as any)._options?.provider?.endpoint ?? "subtensor node",
      api.runtimeVersion.specVersion.toString(),
    ),
  );

  const pallets = sortedPallets(api.events as any);
  for (const [n] of pallets) lines.push(`- **[${n}](#${palletAnchor(n)})**`);

  for (const [palletName, palletEvents] of pallets) {
    lines.push(palletHeading(palletName));
    const events = Object.entries(palletEvents as Record<string, any>).sort(
      ([a], [b]) => a.localeCompare(b),
    );

    for (const [eventName, eventDef] of events) {
      const meta = eventDef?.meta;
      if (!meta) continue;

      // Types only, single-line — use resolveTypeForHeading to avoid line breaks
      const types = (meta.fields ?? [])
        .map((f: any) => resolveTypeForHeading(f, api.registry))
        .join(", ");

      lines.push(`### \`${eventName}(${types})\`\n`);
      lines.push(`- **interface**: \`api.events.${palletName}.${eventName}\``);
      const docs = extractDocs(meta.docs ?? []);
      if (docs) lines.push(`- **summary**: ${docs}`);
      lines.push("");
    }
  }

  writeFile(path.join(outputDir, "events.md"), lines.join("\n"));
}