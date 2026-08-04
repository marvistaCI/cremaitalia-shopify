#!/usr/bin/env python3
"""Render a Crema Italia Standard (Markdown source) to a branded, stamped PDF.

Source/render model (see Collaboration Standard §3): the Markdown file is the
single editable SOURCE OF TRUTH. This script produces a *render* of it — the PDF
you hold. The intermediate HTML is a throwaway build artifact (written to a temp
dir), never a second source. Re-run after editing the .md; never edit the PDF.

No native dependencies: Markdown -> branded HTML -> PDF via headless Edge/Chrome
(both ship on Windows). Fonts (Marcellus display + Inter body) load locally from
the re-homed Brand Standards, so every render is offline and identical.

Since 2026-08-03 this script gates its own output. The failures it catches are
SILENT: a missing .ttf still produces a valid file:// URL, Edge falls back to a
generic serif, and you get a clean-looking off-brand PDF at exit 0. The gates
are shared with the Brand renderer via `pdf_gates.py` so the two cannot drift.

Usage:
    py render.py store-operating-standards.md
    py render.py collaboration-standard.md "Collaboration_Standard_v1.0.pdf"

Options:
    --require FAM[,FAM]   Families that must be embedded (default: Marcellus,Inter)
    --allow-fallback      Downgrade the font gate to a warning. Must be explicit.
    --skip-tail-check     Downgrade the tail gate to a warning. Must be explicit.
    --preview             Also write page images beside the PDF (needs pdftoppm)

Exit codes:
    0 pass · 1 usage/source · 3 GATE 1 (font file missing) · 4 GATE 2 (font not
    embedded / fallback detected) · 5 GATE 3 (PDF missing the end of the source)
    · 6 the render never produced a complete PDF
"""
import argparse
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import markdown

HERE = Path(__file__).resolve().parent
FONT_DIR = HERE / "brand-standards" / "assets" / "fonts"

# The gate module lives with the PDF-builder skill; one copy, both renderers.
sys.path.insert(
    0, str(HERE.parent.parent / ".claude" / "skills" / "crema-italia-pdf-builder" / "scripts")
)
import pdf_gates  # noqa: E402

FONT_FILES = (
    "Marcellus-Regular.ttf",
    "Inter-Regular.ttf",
    "Inter-Medium.ttf",
    "Inter-SemiBold.ttf",
    "Inter-Italic.ttf",
)

# Brand tokens (Brand Standards v2.1)
ESPRESSO = "#55331B"
GOLD = "#B88348"
CREAM = "#FBF8F1"
IVORY = "#FFFFFF"
HAIRLINE = "#D9D2C2"
MUTE = "#8C7E6A"
GREEN = "#0E7A3A"
RED = "#C8342B"


def font_url(name: str) -> str:
    return (FONT_DIR / name).as_uri()


def find_browser() -> str:
    candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]
    for c in candidates:
        if Path(c).exists():
            return c
    raise SystemExit("No Edge/Chrome found for headless PDF rendering.")


def build_html(md_path: Path) -> tuple[str, str]:
    text = md_path.read_text(encoding="utf-8")

    # Pull the title (first H1) and the version line for the header/footer stamp.
    title_m = re.search(r"^#\s+(.+)$", text, re.M)
    title = title_m.group(1).replace("Crema Italia — ", "").strip() if title_m else md_path.stem
    ver_m = re.search(r"\*\*Version\s+([0-9.]+)\s*·\s*([0-9-]+)\*\*", text)
    version = f"v{ver_m.group(1)} · {ver_m.group(2)}" if ver_m else ""
    stamp = f"{title} {version} · source of truth: docs/standards/{md_path.name} · render — do not edit"

    body = markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "sane_lists", "attr_list"],
    )

    css = f"""
    @font-face {{ font-family:'Marcellus'; src:url('{font_url("Marcellus-Regular.ttf")}'); font-weight:400; }}
    @font-face {{ font-family:'Inter'; src:url('{font_url("Inter-Regular.ttf")}'); font-weight:400; }}
    @font-face {{ font-family:'Inter'; src:url('{font_url("Inter-Medium.ttf")}'); font-weight:500; }}
    @font-face {{ font-family:'Inter'; src:url('{font_url("Inter-SemiBold.ttf")}'); font-weight:600; }}
    @font-face {{ font-family:'Inter'; src:url('{font_url("Inter-Italic.ttf")}'); font-weight:400; font-style:italic; }}
    @page {{ size: Letter; margin: 22mm 18mm 20mm 18mm; }}
    * {{ box-sizing: border-box; }}
    html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
    body {{ font-family:'Inter',sans-serif; color:{ESPRESSO}; font-size:10.5pt; line-height:1.5; margin:0; }}
    .flag {{ position:fixed; top:0; left:0; right:0; height:3px; display:flex; }}
    .flag i {{ flex:1; }} .flag .g{{background:{GREEN};}} .flag .w{{background:{IVORY};}} .flag .r{{background:{RED};}}
    .foot {{ position:fixed; bottom:-14mm; left:0; right:0; font-family:'Inter'; font-size:7pt;
             color:{MUTE}; border-top:0.5px solid {HAIRLINE}; padding-top:3px; }}
    .eyebrow {{ font-family:'Inter'; font-weight:600; text-transform:uppercase; letter-spacing:0.16em;
                font-size:8pt; color:{GOLD}; margin:0 0 4px; }}
    h1 {{ font-family:'Marcellus',serif; font-weight:400; font-size:22pt; color:{ESPRESSO};
          margin:0 0 2px; line-height:1.15; }}
    h1 + p {{ margin-top:2px; }}
    h2 {{ font-family:'Marcellus',serif; font-weight:400; font-size:15pt; color:{GOLD};
          margin:20px 0 6px; padding-bottom:3px; border-bottom:0.75px solid {HAIRLINE};
          page-break-after:avoid; }}
    h3 {{ font-family:'Inter'; font-weight:600; font-size:10.5pt; color:{ESPRESSO}; margin:14px 0 4px;
          page-break-after:avoid; }}
    p, li {{ margin:4px 0; }}
    strong {{ font-weight:600; }} em {{ font-style:italic; }}
    a {{ color:{GOLD}; text-decoration:none; }}
    code {{ font-family:'Consolas',monospace; font-size:9pt; background:{CREAM};
            border:0.5px solid {HAIRLINE}; border-radius:3px; padding:1px 4px; }}
    pre {{ background:{CREAM}; border:0.5px solid {HAIRLINE}; border-radius:5px; padding:8px 10px;
           font-size:9pt; overflow:hidden; page-break-inside:avoid; }}
    pre code {{ border:0; background:none; padding:0; }}
    table {{ border-collapse:collapse; width:100%; margin:8px 0; font-size:9pt;
             page-break-inside:avoid; }}
    th, td {{ border:0.5px solid {HAIRLINE}; padding:4px 7px; text-align:left; vertical-align:top; }}
    th {{ background:{ESPRESSO}; color:{CREAM}; font-family:'Inter'; font-weight:600; }}
    tr:nth-child(even) td {{ background:{CREAM}; }}
    blockquote {{ border-left:2.5px solid {GOLD}; margin:8px 0; padding:2px 0 2px 12px;
                  color:#5A4A3F; background:{CREAM}; }}
    blockquote p {{ margin:3px 0; }}
    hr {{ border:0; border-top:0.75px solid {HAIRLINE}; margin:16px 0; }}
    """

    html = f"""<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head>
    <body>
    <div class="flag"><i class="g"></i><i class="w"></i><i class="r"></i></div>
    <div class="foot">CREMA ITALIA · {stamp}</div>
    <p class="eyebrow">Crema Italia · Standard</p>
    {body}
    </body></html>"""
    return html, stamp


def main() -> int:
    ap = argparse.ArgumentParser(add_help=True, description=__doc__)
    ap.add_argument("source")
    ap.add_argument("output", nargs="?")
    ap.add_argument("--require", default=",".join(pdf_gates.DEFAULT_REQUIRED))
    ap.add_argument("--allow-fallback", action="store_true")
    ap.add_argument("--skip-tail-check", action="store_true")
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--preview-dpi", type=int, default=135)
    args = ap.parse_args()

    required = tuple(f.strip() for f in args.require.split(",") if f.strip())

    md_path = (HERE / args.source).resolve() if not Path(args.source).is_absolute() else Path(args.source)
    if not md_path.exists():
        print(f"Source not found: {md_path}")
        return 1
    if not md_path.read_text(encoding="utf-8").strip():
        print(f"Source is empty: {md_path}")
        return 1

    default_out = md_path.stem.replace("-", "_").title().replace("_", "_") + ".pdf"
    out = (HERE / (args.output if args.output else default_out)).resolve()

    # ---- GATE 1: the fonts must exist BEFORE we render ----
    # Path.as_uri() happily builds a file:// URL for a file that isn't there;
    # Edge then falls back to a generic serif and exits 0. Checked here or never.
    missing = pdf_gates.gate_assets_exist([FONT_DIR / f for f in FONT_FILES])
    if missing:
        print("GATE 1 FAILED - brand fonts are not where this script expects them:")
        for m in missing:
            print(f"  - {m}")
        print("\nRendering now would silently produce an off-brand PDF.")
        return 3
    print("GATE 1 pass - all brand font files resolve.")

    html, stamp = build_html(md_path)
    source_text = pdf_gates.visible_text_from_html(html)

    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(html)
        tmp_html = Path(f.name)

    # Remove any previous render first: if this run fails we must not stat a
    # stale file and report it as fresh output.
    out.unlink(missing_ok=True)

    browser = find_browser()
    subprocess.run(
        [browser, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         f"--print-to-pdf={out}", tmp_html.as_uri()],
        check=True, capture_output=True, timeout=120,
    )

    # Edge writes the PDF AFTER this process returns - its exit code is not
    # proof the file is on disk, let alone complete. Statting immediately gets
    # either nothing or a half-flushed document that looks like a font failure.
    ok = pdf_gates.wait_for_pdf(out)
    tmp_html.unlink(missing_ok=True)
    if not ok:
        print(f"Render did not produce a complete PDF: {out}")
        print("  Headless Edge returned success but never finished writing.")
        print("  Re-run; if it persists, check that Edge can run headless on this machine.")
        return 6

    print(f"Rendered: {out.name}  ({out.stat().st_size:,} bytes)")
    print(f"  from source: {md_path.name}")
    print(f"  stamp: {stamp}")

    # ---- GATES 2 + 3: on the finished PDF ----
    code = pdf_gates.report(
        out,
        source_text,
        required=required,
        allow_fallback=args.allow_fallback,
        skip_tail_check=args.skip_tail_check,
    )
    if code:
        return code

    if args.preview:
        imgs, err = pdf_gates.emit_previews(out, args.preview_dpi)
        if err:
            print(f"  GATE 4 - could not emit page images: {err}")
        else:
            print(f"  GATE 4 - wrote {len(imgs)} page image(s). Read every one, "
                  "then delete them before committing.")
    else:
        print("  GATE 4 - not automated. Re-run with --preview to emit page images.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
