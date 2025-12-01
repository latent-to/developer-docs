"""Docstring helpers for wallet SDK documentation."""
from __future__ import annotations

from pathlib import Path
import re
from typing import Dict, List

# Get the btwallet repo root from environment variable or default to relative path
import os
_BTWALLET_ROOT = os.environ.get("BTWALLET_ROOT")
if _BTWALLET_ROOT:
    _REPO_ROOT = Path(_BTWALLET_ROOT).resolve()
    if not _REPO_ROOT.exists():
        raise RuntimeError(f"BTWALLET_ROOT path does not exist: {_BTWALLET_ROOT}")
else:
    # Default: assume sphinx-generator-wallet-enhanced is inside btwallet repo
    _REPO_ROOT = Path(__file__).resolve().parents[2]

# Verify the repo root exists and has src/wallet.rs
_wallet_rs = _REPO_ROOT / "src" / "wallet.rs"
if not _wallet_rs.exists():
    raise RuntimeError(
        f"Could not find btwallet repo root at {_REPO_ROOT}.\n"
        f"Expected to find: {_wallet_rs}\n"
        f"Set BTWALLET_ROOT environment variable to the path of the btwallet repo.\n"
        f"Example: export BTWALLET_ROOT=/path/to/btwallet"
    )

RUST_SOURCES = [
    _REPO_ROOT / "src" / "wallet.rs",
    _REPO_ROOT / "src" / "keyfile.rs",
    _REPO_ROOT / "src" / "keypair.rs",
    _REPO_ROOT / "src" / "config.rs",
    _REPO_ROOT / "src" / "utils.rs",
]

DOCBLOCK_RE = re.compile(
    r"(?P<block>(?:^\s*///.*\n)+)(?:^\s*(?:#\[[^\n]+\]|//).*\n)*\s*pub\s+(?:fn|struct)\s+(?P<name>[a-zA-Z0-9_]+)",
    re.MULTILINE,
)

PARAM_RE = re.compile(
    r"^`?(?P<name>[a-zA-Z0-9_\.]+)`?\s*(?:\((?P<type>[^)]+)\))?\s*[:\-]\s*(?P<desc>.+)$"
)

IGNORED_HEADERS = {"arguments:", "args:", "# arguments", "# args", "# arguments:", "# args:", "returns:", "# returns", "# returns:", "# returns", "arguments", "args", "returns"}


def load_rust_docstrings() -> Dict[str, str]:
    docs: Dict[str, str] = {}
    for path in RUST_SOURCES:
        if not path.exists():
            continue
        text = path.read_text()
        for match in DOCBLOCK_RE.finditer(text):
            raw_lines = match.group("block").splitlines()
            cleaned = []
            for line in raw_lines:
                if "///" in line:
                    cleaned.append(line.split("///", 1)[1].lstrip())
            doc = "\n".join(cleaned).strip()
            if doc:
                docs.setdefault(match.group("name"), doc)
    return docs


def needs_reformatting(text: str) -> bool:
    lowered = text.lower()
    return any(header in lowered for header in IGNORED_HEADERS)


def _parse_param_line(line: str) -> List[str]:
    stripped = line.strip().lstrip("*- ")
    
    # Handle markdown-style: `* `param_name` - description`
    if stripped.startswith("`") and "`" in stripped[1:]:
        # Format: `* `param_name` - description`
        parts = stripped.split("`", 2)
        if len(parts) >= 3:
            name = parts[1].strip()
            desc = parts[2].lstrip("- ").strip()
            return [f":param {name}: {desc}"]
    
    # Handle format: `*  keyfile_data (): The bytes to decrypt.` or `* param_name (type): description`
    # Remove leading `*` and whitespace if present
    if stripped.startswith("*"):
        stripped = stripped[1:].strip()
    
    match = PARAM_RE.match(stripped)
    if not match:
        # If no match, try to extract name and description manually
        # Handle cases like "keyfile_data (): The bytes to decrypt."
        if "(" in stripped and ")" in stripped:
            paren_match = re.match(r"^([a-zA-Z0-9_\.]+)\s*\([^)]*\)\s*[:\-]?\s*(.+)$", stripped)
            if paren_match:
                name = paren_match.group(1)
                desc = paren_match.group(2).strip()
                return [f":param {name}: {desc}"]
        return [stripped] if stripped else []
    name = match.group("name")
    desc = match.group("desc").strip()
    type_hint = (match.group("type") or "").strip()
    parts = [f":param {name}: {desc}"]
    if type_hint:
        parts.append(f":type {name}: {type_hint}")
    return parts


def format_docstring(text: str) -> List[str]:
    lines = text.strip().splitlines()
    result: List[str] = []
    buffer: List[str] = []
    state: str | None = None

    def flush():
        nonlocal buffer, state
        if not buffer:
            return
        if state == "params":
            if result and result[-1] != "":
                result.append("")
            for entry in buffer:
                result.extend(_parse_param_line(entry))
        elif state == "returns":
            # Ensure there's a blank line before returns field
            if result and result[-1] != "":
                result.append("")
            # Clean up returns content - remove markdown bullets and extract description
            content_parts = []
            for entry in buffer:
                cleaned = entry.strip().lstrip("*- ")
                # If it's in format "decrypted_data (bytes): description", extract just description
                if "(" in cleaned and ")" in cleaned and ":" in cleaned:
                    match = re.match(r"^[^:]*\([^)]*\)\s*:\s*(.+)$", cleaned)
                    if match:
                        content_parts.append(match.group(1).strip())
                    else:
                        content_parts.append(cleaned)
                else:
                    content_parts.append(cleaned)
            content = " ".join(s for s in content_parts if s.strip())
            if content:
                result.append(f":returns: {content}")
        else:
            result.extend(buffer)
        buffer = []

    for line in lines:
        stripped = line.rstrip()
        lower = stripped.strip().lower()
        # Check if this line is a header (with or without # prefix, with or without colon)
        header_match = False
        for header in IGNORED_HEADERS:
            header_clean = header.lstrip("#").strip().rstrip(":")
            if (lower == header or 
                lower == header_clean or 
                lower == header_clean + ":" or
                lower.endswith(":") and lower.rstrip(":").strip() == header_clean or
                (lower.startswith("#") and header_clean in lower)):
                flush()
                if result and result[-1] != "":
                    result.append("")
                state = "params" if ("arguments" in lower or "args" in lower) else "returns"
                header_match = True
                break
        if header_match:
            continue
        if not stripped.strip():
            flush()
            if result and result[-1] != "":
                result.append("")
            state = None
            continue
        buffer.append(stripped.strip())

    flush()
    return result
