/**
 * utils.ts
 * Shared helpers for Markdown generation.
 */

import * as fs from 'fs';
import * as path from 'path';

// ── File I/O ──────────────────────────────────────────────────────────────────

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, 'utf8');
  const rel = path.relative(process.cwd(), filePath);
  console.log(`  ✓  ${rel}  (${Math.round(content.length / 1024)}KB)`);
}

// ── Type resolution ───────────────────────────────────────────────────────────

const TYPE_ALIASES: Array<[RegExp, string]> = [
  [/^BlockNumberFor<T>$/,           'u32'         ],
  [/^BlockNumberFor<[^>]+>$/,       'u32'         ],
  [/^T::BlockNumber$/,              'u32'         ],
  [/^T::Moment$/,                   'u64'         ],
  [/^T::AccountId$/,                'AccountId'   ],
  [/^AccountIdLookupOf<T>$/,        'MultiAddress'],
  [/^AccountIdOf<T>$/,              'AccountId'   ],
  [/^T::Balance$/,                  'u128'        ],
  [/^BalanceOf<T>$/,                'u128'        ],
  [/^BalanceOf<T,[^>]+>$/,          'u128'        ],
  [/^T::Hash$/,                     'H256'        ],
  [/^T::Index$/,                    'u32'         ],
  [/^T::Nonce$/,                    'u32'         ],
  [/^(\w+)<T>$/,                    '$1'          ],
];

function normaliseType(raw: string): string {
  const t = raw.replace(/\s+/g, ' ').trim();
  for (const [re, replacement] of TYPE_ALIASES) {
    if (re.test(t)) return t.replace(re, replacement);
  }
  return t;
}

function simplifyTypeForHeading(raw: string): string {
  let t = raw.replace(/\s+/g, ' ').trim();
  for (const [re, replacement] of TYPE_ALIASES) {
    if (re.test(t)) { t = t.replace(re, replacement); break; }
  }
  t = t.replace(/<<[^>]+>::\w+(?:\s+as\s+[^>]+)?>::(\w+)/g, '$1');
  t = t.replace(/<T\s+as\s+[^>]+>::(\w+)/g, '$1');
  if (t.length > 60) {
    const outer = t.replace(/<.*$/s, '').trim();
    t = outer.split('::').pop() ?? outer;
  }
  return t;
}

export function resolveType(field: any, registry?: any): string {
  const typeName: string | undefined = field.typeName?.toString?.()?.trim();
  if (typeName && typeName.length > 0) return normaliseType(typeName);
  if (registry && field.type !== undefined) {
    try {
      const def = registry.lookup.getTypeDef(field.type);
      if (def?.type) return normaliseType(def.type);
    } catch { /* fall through */ }
  }
  return String(field.type ?? 'unknown');
}

export function resolveTypeForHeading(field: any, registry?: any): string {
  const typeName: string | undefined = field.typeName?.toString?.()?.trim();
  if (typeName && typeName.length > 0) return simplifyTypeForHeading(typeName);
  if (registry && field.type !== undefined) {
    try {
      const def = registry.lookup.getTypeDef(field.type);
      if (def?.type) return simplifyTypeForHeading(def.type);
    } catch { /* fall through */ }
  }
  return String(field.type ?? 'unknown');
}

export function resolveTypeById(id: any, registry?: any): string {
  if (!registry || id === undefined) return String(id ?? '?');
  try {
    const def = registry.lookup.getTypeDef(id);
    if (def?.type) return normaliseType(def.type);
  } catch { /* fall through */ }
  return String(id);
}

export function fmtType(typeStr: string): string {
  return `\`${typeStr}\``;
}

// ── Rustdoc link stripping ────────────────────────────────────────────────────

/**
 * Must run on the WHOLE raw line BEFORE any backtick-splitting.
 * [`label`](target) straddles a backtick boundary — splitting first breaks it.
 */
function stripRustdocLinksFromLine(line: string): string {
  // Reference-style link definition line — drop entirely
  if (/^\s*\[`?[^\]]+`?\]:\s*\S/.test(line)) return '';
  // Inline backtick-label link → keep just the backtick span
  line = line.replace(/\[(`[^`]+`)\]\([^)]*\)/g, '$1');
  // Inline plain-text-label link (non-http) → keep just the label
  line = line.replace(/\[([^\]]+)\]\((?!https?:\/\/)([^)]*)\)/g, '$1');
  return line;
}

// ── Doc comment processing ────────────────────────────────────────────────────

/**
 * Converts a raw FRAME metadata docs array to Markdown for the summary field.
 *
 * The returned string is intended to follow "- **summary**: " in a list item.
 * The first line has no indent (sits inline with the label).
 * All subsequent lines are indented 4 spaces (CommonMark list continuation).
 *
 * Token types recognised:
 *
 *   section   — any line starting with # (one or more)
 *              — OR a bare "Word:" / "Two Words:" label on its own line
 *              → rendered as **Label:** (bold, indented, with colon)
 *
 *   item      — * `foo` - desc   or   - `foo` - desc   (FRAME style)
 *              — * some plain text                      (any * or - lead)
 *              — * 'param' (Type):  +  tab-desc line   (SubtensorModule style)
 *              → rendered as:  - text  (indented)
 *
 *   numbered  — 1. foo
 *              → rendered as:  1. foo  (indented)
 *
 *   prose     — everything else; consecutive lines joined with a space
 *              — first-line prose: no indent
 *              — subsequent prose blocks (after blank/section/item): indented
 *              — leading ---, --, — stripped when at the very start
 *              — O(N), O(1) etc. wrapped in backticks
 */
export function extractDocs(docs: any[]): string {
  if (!docs || docs.length === 0) return '';

  // ── Regexes ──────────────────────────────────────────────────────────────

  // Any line starting with one or more # → section header
  const HASH_SECTION_RE   = /^\s*#+\s*(.+?):?\s*$/;

  // Bare "Label:" or "Two Words:" on its own line (no # prefix) → section
  // Must be only capitalised-word(s) followed by a colon, nothing else.
  // Bare section: a single word or two short words followed by colon, alone on line.
  // Intentionally tight (max ~20 chars, no punctuation mid-word) to avoid matching
  // prose sentences that end with a colon.
  const BARE_SECTION_RE   = /^\s*([A-Z][A-Za-z]{1,18}(?:\s+[A-Za-z]{1,12})?):\s*$/;

  // Standard FRAME list item: * `foo` - desc  or  - `foo` - desc
  const FRAME_ITEM_RE     = /^\s*[*-]\s+(`[^`]+`|\[[^\]]+\])\s*([-–—]\s*(.*))?$/;

  // Generic bullet: any line starting with * or - followed by content
  // (catches plain prose bullets not covered by FRAME_ITEM_RE)
  const GENERIC_ITEM_RE   = /^\s*[*-]\s+(.+)$/;

  // SubtensorModule item: * 'param' (Type):  or  * 'param':
  const SUBTENSOR_ITEM_RE = /^\s*\*\s+'([^']+)'(?:\s*\(([^)]*)\))?[:\s]*(.*)$/;

  // SubtensorModule tab-indented description: \t- description
  const SUBTENSOR_DESC_RE = /^[\t ]+[-–]\s+(.+)$/;

  // Numbered list
  const NUMBERED_RE       = /^\s*(\d+)\.\s+(.+)$/;

  // ── Pass 1: tokenise ──────────────────────────────────────────────────────

  type Token =
    | { t: 'blank' }
    | { t: 'section';  text: string }
    | { t: 'item';     text: string }
    | { t: 'item_start'; text: string }
    | { t: 'desc';     text: string }
    | { t: 'numbered'; n: number; text: string }
    | { t: 'prose';    text: string };

  const tokens: Token[] = [];

  for (const raw of docs) {
    const line    = stripRustdocLinksFromLine(raw.toString());
    const trimmed = line.trim();

    if (trimmed === '') {
      tokens.push({ t: 'blank' });
      continue;
    }

    // # heading — always a section
    if (/^\s*#+/.test(trimmed)) {
      const m = HASH_SECTION_RE.exec(trimmed);
      const heading = m ? m[1].trim() : trimmed.replace(/^#+\s*/, '').trim();
      tokens.push({ t: 'section', text: capitalise(heading) });
      continue;
    }

    // Bare "Label:" section (no # prefix)
    if (BARE_SECTION_RE.test(trimmed)) {
      const m = BARE_SECTION_RE.exec(trimmed)!;
      tokens.push({ t: 'section', text: capitalise(m[1].trim()) });
      continue;
    }

    // SubtensorModule tab-desc (must test the raw line for leading whitespace)
    if (SUBTENSOR_DESC_RE.test(line)) {
      const m = SUBTENSOR_DESC_RE.exec(line)!;
      tokens.push({ t: 'desc', text: m[1].trim() });
      continue;
    }

    // SubtensorModule item: * 'param' (Type): ...
    {
      const m = SUBTENSOR_ITEM_RE.exec(trimmed);
      if (m) {
        const name  = m[1].trim();
        const type  = m[2]?.trim() ?? '';
        const extra = m[3]?.trim() ?? '';
        const label = type ? `\`${name}\` (${type})` : `\`${name}\``;
        tokens.push({ t: 'item_start', text: extra ? `${label} — ${extra}` : label });
        continue;
      }
    }

    // Standard FRAME item: * `foo` - desc
    {
      const m = FRAME_ITEM_RE.exec(trimmed);
      if (m) {
        const label = m[1];
        const desc  = m[3]?.trim() ?? '';
        tokens.push({ t: 'item', text: desc ? `${label} — ${desc}` : label });
        continue;
      }
    }

    // Generic bullet (any * or - lead not matched above)
    {
      const m = GENERIC_ITEM_RE.exec(trimmed);
      if (m) {
        tokens.push({ t: 'item', text: m[1].trim() });
        continue;
      }
    }

    // Numbered list
    {
      const m = NUMBERED_RE.exec(trimmed);
      if (m) {
        tokens.push({ t: 'numbered', n: parseInt(m[1], 10), text: m[2].trim() });
        continue;
      }
    }

    tokens.push({ t: 'prose', text: trimmed });
  }

  // ── Pass 2: merge SubtensorModule item_start + desc ───────────────────────

  const merged: Exclude<Token, { t: 'item_start' } | { t: 'desc' }>[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.t === 'item_start') {
      let j = i + 1;
      while (j < tokens.length && tokens[j].t === 'blank') j++;
      if (j < tokens.length && tokens[j].t === 'desc') {
        const desc = (tokens[j] as { t: 'desc'; text: string }).text;
        merged.push({ t: 'item', text: `${tok.text} — ${desc}` });
        i = j;
        while (i + 1 < tokens.length && tokens[i + 1].t === 'blank') i++;
      } else {
        merged.push({ t: 'item', text: tok.text });
      }
      continue;
    }
    if (tok.t === 'desc') {
      // Orphaned desc — treat as prose
      merged.push({ t: 'prose', text: tok.text });
      continue;
    }
    merged.push(tok as any);
  }

  // ── Pass 3: render ────────────────────────────────────────────────────────
  // First prose line: no indent (sits inline with "- **summary**: ").
  // Everything after: 4-space indent (CommonMark list continuation).
  //
  // Paragraph-break rule:
  //   A blank line in the source creates a real paragraph break in the output
  //   ONLY when it separates structurally different content (e.g. prose →
  //   section, prose → list, or two distinct prose paragraphs separated by a
  //   genuine blank).  A line break with no blank line before it is NEVER a
  //   paragraph break — consecutive prose lines always join onto the same line.
  //
  // Implementation: we track `prevNonBlank` so that after seeing a blank we
  // know whether what came before was prose.  If prose preceded and prose
  // follows the blank, we merge (the blank was just a soft wrap in the source).
  // If a section/item/numbered follows the blank, we keep the blank as a real
  // paragraph separator.

  const INDENT = '    ';
  const out: string[] = [];
  let prev: Token['t'] | null = null;
  let prevNonBlank: Token['t'] | null = null;
  let firstProseDone = false;
  let pendingBlank = false; // a blank was seen; defer emitting it

  for (const tok of merged) {

    if (tok.t === 'blank') {
      pendingBlank = true;
      prev = 'blank';
      continue;
    }

    if (tok.t === 'section') {
      // A section header ALWAYS needs a blank line before it so Markdown renderers
      // start it on a new paragraph. Without this, items immediately followed by a
      // section header (no blank line in source) render the header inline.
      if (out.length > 0 && out[out.length - 1] !== '') out.push('');
      pendingBlank = false;
      out.push(`${INDENT}**${tok.text}:**`);
      out.push('');
      prev = 'section';
      prevNonBlank = 'section';
      firstProseDone = true;
      continue;
    }

    if (tok.t === 'item') {
      // Flush a pending blank before a list item (real separation)
      if (pendingBlank && out.length > 0 && out[out.length - 1] !== '') out.push('');
      pendingBlank = false;
      const itemText = tok.text.replace(/\bO\(([^)]+)\)/g, '`O($1)`');
      out.push(`${INDENT}- ${itemText}`);
      prev = 'item';
      prevNonBlank = 'item';
      firstProseDone = true;
      continue;
    }

    if (tok.t === 'numbered') {
      if (pendingBlank && out.length > 0 && out[out.length - 1] !== '') out.push('');
      pendingBlank = false;
      out.push(`${INDENT}${tok.n}. ${tok.text}`);
      prev = 'numbered';
      prevNonBlank = 'numbered';
      firstProseDone = true;
      continue;
    }

    // prose
    let proseText = tok.text;

    // Strip leading dashes at the very start of the summary
    if (out.length === 0 || prevNonBlank === 'section') {
      proseText = proseText.replace(/^[-–—]{1,3}\s*/, '').trim();
    }
    if (!proseText) { pendingBlank = false; prev = 'prose'; continue; }

    proseText = proseText.replace(/\bO\(([^)]+)\)/g, '`O($1)`');

    // Capture before clearing — used to decide join vs break below
    const hadBlank = pendingBlank;
    pendingBlank = false;

    // Paragraph-break rule:
    //   hadBlank === true  → a blank line separated this prose from the previous
    //                        → REAL paragraph break — emit blank, start new line
    //   hadBlank === false → consecutive lines, no blank between them
    //                        → source line-wrap — JOIN onto the current line

    if (hadBlank && out.length > 0 && out[out.length - 1] !== '') {
      // Real paragraph break
      out.push('');
    }

    const lastLine = out.length > 0 ? out[out.length - 1] : '';
    const canJoin  = !hadBlank &&
                     prevNonBlank === 'prose' &&
                     lastLine !== '' &&
                     !lastLine.startsWith(INDENT + '-') &&
                     !lastLine.startsWith(INDENT + '**');

    if (canJoin) {
      out[out.length - 1] += ' ' + proseText;
    } else {
      const indent = firstProseDone ? INDENT : '';
      out.push(`${indent}${proseText}`);
      firstProseDone = true;
    }
    prev = 'prose';
    prevNonBlank = 'prose';
  }

  while (out.length > 0 && out[out.length - 1] === '') out.pop();
  if (out.length === 0) return '';

  return escapeMdx(out.join('\n'));
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Escapes MDX-breaking characters in prose outside backtick spans.
 */
export function escapeMdx(text: string): string {
  const parts = text.split(/(`[^`]*`)/g);
  return parts
    .map((part, i) => {
      if (i % 2 === 0) {
        return part.replace(/</g, '\\<').replace(/\{/g, '\\{');
      }
      return part;
    })
    .join('');
}

// ── Misc helpers ──────────────────────────────────────────────────────────────

export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function fileHeader(title: string, description: string, endpoint: string): string {
  return `# ${title}

${description}

> **NOTE:** Generated from a live snapshot of the Subtensor runtime on **${today()}**.
> Connected to: \`${endpoint}\`
> On the API: \`api.tx / api.query / api.events / api.errors / api.consts\`

`;
}

export function palletAnchor(palletName: string): string {
  return palletName.toLowerCase();
}

export const BITTENSOR_PALLETS = new Set([
  'SubtensorModule',
  'AdminUtils',
  'Commitments',
  'Crowdloan',
  'Registry',
]);

export function sortedPallets<T>(ns: Record<string, T>): [string, T][] {
  const entries = Object.entries(ns);
  entries.sort(([a], [b]) => {
    if (a === 'SubtensorModule') return -1;
    if (b === 'SubtensorModule') return 1;
    return a.localeCompare(b);
  });
  return entries;
}
