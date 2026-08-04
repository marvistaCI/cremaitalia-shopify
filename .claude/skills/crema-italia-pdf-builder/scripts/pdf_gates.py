#!/usr/bin/env python3
"""Shared render gates for Crema Italia PDFs.

ONE copy of this logic, imported by BOTH renderers, because two copies is the
drift this module exists to prevent:

  * `render_pdf.py` (this directory)  — Brand Standards: HTML source, WeasyPrint.
  * `docs/standards/render.py`        — Store Operating + Collaboration
                                        Standards: Markdown source, headless Edge.

Why gates at all: every failure below is SILENT. The renderer exits 0 and hands
you a clean-looking PDF, so nothing downstream can tell. `RENDER_TRUST.md`
md5-compares the repo render against the OneDrive copy — two copies of the same
bad render read MATCH. The check has to happen here, at render time.

  GATE 1a  source is structurally complete. A write into a cloud-synced folder
           can truncate mid-element; the renderer auto-closes the broken markup
           and produces a confident, incomplete PDF. This MUST be checked on the
           SOURCE: a truncated source renders faithfully, so comparing the
           finished PDF against that same source can never see the loss.

  GATE 1b  every locally-linked stylesheet / font / image resolves on disk,
           INCLUDING assets referenced from inside a stylesheet (`url(...)` in
           fonts.css). A missing @font-face file does not error - the renderer
           falls back to a generic serif and ships an off-brand PDF.

  GATE 2   the required brand families are actually EMBEDDED in the output, and
           no known fallback face appears. This is the one that catches a font
           that resolved but did not apply.

  GATE 3   the end of the source appears in the PDF - catches the render
           dropping a trailing element even when the source is intact. It cannot
           catch a truncated source; that is gate 1a's job.

  GATE 4   looking at every page. Not automatable. `emit_previews()` only makes
           the human/model check one command.

Dependency-free by default. `pypdf` is used for gate 3 text extraction when
present; without it gate 3 reports "unavailable" rather than passing quietly.
"""
from __future__ import annotations

import re
import subprocess
import zlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

# Faces a renderer reaches for when a brand @font-face is unavailable. Their
# presence means something did not resolve, even if the PDF looks fine.
FALLBACK_MARKERS = (
    "dejavu", "liberation", "georgia", "times", "nimbus", "freeserif",
    "freesans", "bitstream", "arial", "helvetica", "cambria", "calibri",
)

# Consolas/Courier are legitimate here: both renderers set code spans in a
# monospace face on purpose, so they are not evidence of a failed fallback.
FALLBACK_EXEMPT = ("consolas", "courier", "cascadia", "menlo", "monaco")

DEFAULT_REQUIRED = ("Marcellus", "Inter")

_SKIP_TEXT_TAGS = {"script", "style", "head", "title", "meta", "link"}
_VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}


# --------------------------------------------------------------- HTML parsing
class _SourceParser(HTMLParser):
    """Collect locally-linked assets, visible text, and tag balance."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.assets: list[str] = []
        self.saw_html_open = False
        self.saw_body_open = False
        self.saw_html_close = False
        self.saw_body_close = False
        self._text: list[str] = []
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag == "html":
            self.saw_html_open = True
        elif tag == "body":
            self.saw_body_open = True
        if tag in _SKIP_TEXT_TAGS and tag not in _VOID_TAGS:
            self._skip += 1
        a = {k.lower(): (v or "") for k, v in attrs}
        if tag == "link" and "stylesheet" in a.get("rel", "").lower():
            self.assets.append(a.get("href", ""))
        elif tag in ("img", "source", "script"):
            self.assets.append(a.get("src", ""))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag.lower() in _SKIP_TEXT_TAGS and tag.lower() not in _VOID_TAGS:
            self._skip -= 1

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag == "html":
            self.saw_html_close = True
        elif tag == "body":
            self.saw_body_close = True
        if tag in _SKIP_TEXT_TAGS and tag not in _VOID_TAGS and self._skip:
            self._skip -= 1

    def handle_data(self, data):
        if not self._skip and data.strip():
            self._text.append(data)

    @property
    def text(self) -> str:
        return normalize_text(" ".join(self._text))


def normalize_text(s: str) -> str:
    """Collapse whitespace so source text and extracted PDF text can be compared."""
    return re.sub(r"\s+", " ", s).strip()


def visible_text_from_html(html: str) -> str:
    p = _SourceParser()
    p.feed(html)
    return p.text


def _is_local(href: str) -> bool:
    if not href:
        return False
    scheme = urlparse(href).scheme.lower()
    return scheme in ("", "file")


def _resolve(href: str, base: Path) -> Path:
    path = urlparse(href).path if urlparse(href).scheme == "file" else href.split("#")[0].split("?")[0]
    return (base / unquote(path)).resolve()


def _css_refs(css_path: Path) -> list[str]:
    """url(...) targets inside a stylesheet - this is where the .ttf files hide."""
    try:
        css = css_path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return []
    return [m.group(1).strip("'\"") for m in re.finditer(r"url\(\s*([^)]+?)\s*\)", css)]


# ------------------------------------------------------------------- GATE 1
def gate_source_html(src: Path) -> tuple[list[str], str]:
    """GATE 1a + 1b for an HTML source. Returns (problems, visible_text)."""
    problems: list[str] = []
    raw = src.read_text(encoding="utf-8", errors="replace")

    # --- 1a: structural completeness, checked on the SOURCE ---
    if not raw.strip():
        return ([f"source is empty: {src.name}"], "")
    tail = raw.rstrip()
    if not tail.endswith("</html>"):
        problems.append(
            f"source does not end with </html> (ends with: ...{tail[-60:]!r}) - "
            "likely a truncated write"
        )

    parser = _SourceParser()
    parser.feed(raw)
    if parser.saw_html_open and not parser.saw_html_close:
        problems.append("source opens <html> but never closes it")
    if parser.saw_body_open and not parser.saw_body_close:
        problems.append("source opens <body> but never closes it")

    # --- 1b: linked assets resolve, including through stylesheets ---
    base = src.parent
    seen: set[Path] = set()
    queue = [(h, base) for h in parser.assets if _is_local(h)]
    while queue:
        href, rel_base = queue.pop(0)
        target = _resolve(href, rel_base)
        if target in seen:
            continue
        seen.add(target)
        if not target.exists():
            problems.append(f"linked asset does not resolve: {href}  ->  {target}")
            continue
        if target.suffix.lower() == ".css":
            queue.extend(
                (ref, target.parent) for ref in _css_refs(target) if _is_local(ref)
            )

    return problems, parser.text


def gate_assets_exist(paths: list[Path], label: str = "font") -> list[str]:
    """GATE 1b for renderers that build asset URLs in code (no HTML to parse)."""
    return [f"{label} does not resolve: {p}" for p in paths if not p.exists()]


# ------------------------------------------------------------------- GATE 0
def pdf_is_complete(pdf: Path) -> bool:
    """Is this a whole PDF, or a file we caught mid-write?

    A PDF ends with %%EOF. Headless Edge writes the file AFTER the process it
    was launched from has already returned, so a renderer that trusts the exit
    code can stat a half-flushed file and gate a partial document - which reads
    as 'fonts missing' and sends you hunting for the wrong bug.
    """
    if not pdf.exists() or pdf.stat().st_size == 0:
        return False
    with pdf.open("rb") as fh:
        fh.seek(max(0, pdf.stat().st_size - 1024))
        return b"%%EOF" in fh.read()


def wait_for_pdf(pdf: Path, timeout: float = 60.0, settle: float = 0.4) -> bool:
    """Block until `pdf` is a complete, size-stable file. False on timeout.

    Required for any renderer that shells out to headless Edge/Chrome; harmless
    for WeasyPrint, which writes synchronously.
    """
    import time

    deadline = time.time() + timeout
    last = -1
    stable_since = None
    while time.time() < deadline:
        size = pdf.stat().st_size if pdf.exists() else -1
        if size > 0 and size == last:
            if stable_since is None:
                stable_since = time.time()
            elif time.time() - stable_since >= settle and pdf_is_complete(pdf):
                return True
        else:
            stable_since = None
        last = size
        time.sleep(0.15)
    return pdf_is_complete(pdf)


# ------------------------------------------------------------------- GATE 2
def pdf_font_names(pdf: Path) -> set[str]:
    """Every /BaseFont in the PDF, dependency-free.

    Scans the raw bytes AND every inflatable stream: headless Edge writes font
    objects in the clear, WeasyPrint packs them into compressed object streams.
    Both have to be covered or the gate passes on a technicality.
    """
    data = pdf.read_bytes()
    pattern = re.compile(rb"/BaseFont\s*/([A-Za-z0-9+#\-,._]+)")
    found = {m.group(1).decode("latin-1") for m in pattern.finditer(data)}
    for m in re.finditer(rb"stream\r?\n", data):
        start = m.end()
        end = data.find(b"endstream", start)
        if end == -1:
            continue
        try:
            inflated = zlib.decompress(data[start:end])
        except zlib.error:
            continue
        found |= {m2.group(1).decode("latin-1") for m2 in pattern.finditer(inflated)}
    # Strip the six-letter subset prefix: "IVVIMS+Marcellus" -> "Marcellus".
    return {re.sub(r"^[A-Z]{6}\+", "", n) for n in found}


def gate_fonts(
    pdf: Path, required: tuple[str, ...] = DEFAULT_REQUIRED
) -> tuple[list[str], set[str]]:
    """GATE 2. Returns (problems, font_names_found)."""
    names = pdf_font_names(pdf)
    problems: list[str] = []
    if not names:
        return (["no embedded fonts found in the PDF at all"], names)

    lowered = [n.lower() for n in names]
    for fam in required:
        needle = fam.lower().replace(" ", "").replace("-", "")
        if not any(needle in n.replace(" ", "").replace("-", "") for n in lowered):
            problems.append(f"required family not embedded: {fam}")

    for n in sorted(names):
        low = n.lower()
        if any(x in low for x in FALLBACK_EXEMPT):
            continue
        hit = next((mk for mk in FALLBACK_MARKERS if mk in low), None)
        if hit:
            problems.append(f"fallback face present ({hit}): {n} - a brand font did not apply")
    return problems, names


# ------------------------------------------------------------------- GATE 3
def pdf_text(pdf: Path) -> str | None:
    """Extracted PDF text, or None if no extractor is installed."""
    try:
        from pypdf import PdfReader
    except ImportError:
        return None
    try:
        reader = PdfReader(str(pdf))
        return normalize_text(" ".join((p.extract_text() or "") for p in reader.pages))
    except Exception:
        return None


def gate_tail(
    pdf: Path, source_text: str, probe: int = 60
) -> tuple[list[str], str]:
    """GATE 3. Does the end of the source appear in the PDF?

    Returns (problems, preview_of_source_tail). A missing extractor is reported
    as a problem, never as a pass - an unrun check is not a passed check.
    """
    source_text = normalize_text(source_text)
    if not source_text:
        return (["source has no visible text to check"], "")
    tail = source_text[-probe:]
    text = pdf_text(pdf)
    if text is None:
        return (["no PDF text extractor available (pip install pypdf) - gate not run"], tail)

    if _loose(tail) in _loose(text):
        return ([], tail)
    # Retry on a shorter probe: hyphenation and ligatures can break a long span.
    short = source_text[-25:]
    if _loose(short) in _loose(text):
        return ([], short)
    return ([f"the last {len(tail)} chars of the source do not appear in the PDF"], tail)


def _loose(s: str) -> str:
    """Compare ignoring whitespace, case, and characters extraction mangles."""
    return re.sub(r"[^a-z0-9]", "", s.lower())


# ------------------------------------------------------------------- GATE 4
def emit_previews(pdf: Path, dpi: int = 135) -> tuple[list[Path], str | None]:
    """Write page images beside the PDF. Returns (images, error_message)."""
    stem = pdf.with_suffix("")
    try:
        subprocess.run(
            ["pdftoppm", "-png", "-r", str(dpi), str(pdf), f"{stem}-page"],
            check=True, capture_output=True, timeout=180,
        )
    except FileNotFoundError:
        return ([], "pdftoppm not found on PATH - install poppler to emit page images")
    except subprocess.CalledProcessError as exc:
        return ([], f"pdftoppm failed: {exc.stderr.decode('utf-8', 'replace')[:200]}")
    except subprocess.TimeoutExpired:
        return ([], "pdftoppm timed out")
    return (sorted(stem.parent.glob(f"{stem.name}-page*.png")), None)


# --------------------------------------------------------------- reporting
def report(
    pdf: Path,
    source_text: str,
    required: tuple[str, ...] = DEFAULT_REQUIRED,
    allow_fallback: bool = False,
    skip_tail_check: bool = False,
) -> int:
    """Run gates 2 and 3 against a finished PDF and print a verdict.

    Returns the process exit code: 0 pass, 4 font gate, 5 tail gate,
    6 output absent or incomplete. Gate 1 is caller-specific (HTML source vs.
    built-in font paths) and runs BEFORE rendering, so it is not part of this call.
    """
    code = 0

    if not pdf_is_complete(pdf):
        print("  GATE 0 FAILED - the output is missing or incomplete (no %%EOF).")
        print("  Do not trust a renderer's exit code as proof it finished writing.")
        return 6

    problems, names = gate_fonts(pdf, required)
    if names:
        print(f"  fonts in PDF: {', '.join(sorted(names))}")
    if problems:
        head = "GATE 2 WARNING" if allow_fallback else "GATE 2 FAILED"
        print(f"  {head} - font embedding:")
        for p in problems:
            print(f"    - {p}")
        if not allow_fallback:
            print("  The PDF rendered but is NOT brand compliant. Fix the font paths,")
            print("  or re-run with --allow-fallback if this is deliberate.")
            code = 4
    else:
        print(f"  GATE 2 pass - {', '.join(required)} embedded, no fallback faces.")

    if code:
        return code

    tail_problems, preview = gate_tail(pdf, source_text)
    if tail_problems:
        head = "GATE 3 WARNING" if skip_tail_check else "GATE 3 FAILED"
        print(f"  {head} - render integrity:")
        for p in tail_problems:
            print(f"    - {p}")
        if preview:
            print(f"    source ends with: ...{preview}")
        if not skip_tail_check:
            code = 5
    else:
        print(f"  GATE 3 pass - PDF contains the end of the source (...{preview[-40:]}).")

    return code
