#!/usr/bin/env python3
"""Render a Crema Italia HTML source file to PDF with WeasyPrint - and prove it is clean.

Core principle of the crema-italia-pdf-builder skill: the HTML is the editable
source of truth; the PDF is a reproducible render of it. Output is written next
to the source with the same basename, so the two always travel together.

Since 2026-08-03 this script verifies its own work and exits non-zero on
failure. Every failure it catches is otherwise SILENT - the renderer returns 0
and hands you a clean-looking, wrong PDF. The gates themselves live in
`pdf_gates.py`, shared with `docs/standards/render.py` so the two renderers
cannot drift apart. See that module for what each gate proves and why.

Usage:
    python render_pdf.py <source.html> [output.pdf] [options]

If [output.pdf] is omitted, writes <source>.pdf beside the source file.
Relative URLs in the HTML (brand CSS, fonts.css, .ttf files, images) resolve
from the source file's own directory, so keep the source in the project tree.

Options:
    --require FAM[,FAM]   Families that must be embedded (default: Marcellus,Inter)
    --allow-fallback      Downgrade GATE 2 to a warning. Must be explicit.
    --skip-tail-check     Downgrade GATE 3 to a warning. Must be explicit.
    --preview             Also write page images beside the PDF (needs pdftoppm)
    --preview-dpi N       Preview resolution (default 135)

Exit codes:
    0  rendered, all enabled gates passed
    1  usage / source problem
    2  WeasyPrint could not load
    3  GATE 1 failed - source incomplete, or a linked asset did not resolve
    4  GATE 2 failed - required font missing, not embedded, or fallback detected
    5  GATE 3 failed - the PDF does not contain the end of the source
"""
import argparse
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import pdf_gates  # noqa: E402


def _ensure_native_libs() -> None:
    """Put the GTK/Pango/Cairo DLLs on the Windows DLL search path.

    WeasyPrint needs native libs (libgobject, libpango, libcairo, libharfbuzz)
    that Windows doesn't ship. We install them via MSYS2
    (`pacman -S mingw-w64-x86_64-pango` -> C:\\msys64\\mingw64\\bin) and add that
    directory here at runtime, so rendering works without touching the global
    PATH. Extend/override with WEASYPRINT_DLL_DIRECTORIES (os.pathsep-separated).
    No-op on non-Windows, where the system package manager handles this.
    """
    if os.name != "nt":
        return
    env = os.environ.get("WEASYPRINT_DLL_DIRECTORIES", "")
    candidates = [p for p in env.split(os.pathsep) if p] + [
        r"C:\msys64\mingw64\bin",
        r"C:\msys64\ucrt64\bin",
        r"C:\Program Files\GTK3-Runtime Win64\bin",
    ]
    for d in candidates:
        try:
            if d and Path(d).is_dir():
                os.add_dll_directory(d)
        except OSError:
            pass


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

    src = Path(args.source).expanduser().resolve()
    if not src.exists():
        print(f"Source not found: {src}")
        return 1
    if src.suffix.lower() not in {".html", ".htm"}:
        print(f"Expected an .html source, got: {src.name}")
        return 1

    out = (
        Path(args.output).expanduser().resolve()
        if args.output
        else src.with_suffix(".pdf")
    )

    # ---- GATE 1: on the SOURCE, before rendering ----
    # A truncated source renders faithfully, so this can never be checked
    # against the finished PDF. It has to happen here or not at all.
    problems, source_text = pdf_gates.gate_source_html(src)
    if problems:
        print("GATE 1 FAILED - the source is not fit to render:")
        for p in problems:
            print(f"  - {p}")
        print("\nFix the source (or the asset paths) and re-run. Rendering now would")
        print("produce a confident, clean-looking PDF that is quietly wrong.")
        return 3
    print(f"GATE 1 pass - source complete, all linked assets resolve.")

    # ---- render ----
    _ensure_native_libs()
    try:
        from weasyprint import HTML
    except (ImportError, OSError) as exc:
        print(
            "WeasyPrint could not load.\n"
            f"  {exc}\n\n"
            "If the Python package is missing:\n"
            "  pip install weasyprint --break-system-packages\n\n"
            "If native libs are missing (libgobject/libpango/libcairo), install\n"
            "them via MSYS2:\n"
            "  winget install MSYS2.MSYS2\n"
            r"  C:\msys64\usr\bin\pacman -S --needed --noconfirm mingw-w64-x86_64-pango"
            "\n"
            r"(this script auto-adds C:\msys64\mingw64\bin to the DLL path.)"
        )
        return 2

    # filename= sets base_url to the source dir so relative assets resolve.
    HTML(filename=str(src)).write_pdf(str(out))

    print(f"Rendered: {out}")
    print(f"Source kept: {src}")
    print(f"PDF size: {out.stat().st_size:,} bytes")

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

    # ---- GATE 4: not automatable ----
    if args.preview:
        imgs, err = pdf_gates.emit_previews(out, args.preview_dpi)
        if err:
            print(f"  GATE 4 - could not emit page images: {err}")
        else:
            print(f"  GATE 4 - wrote {len(imgs)} page image(s) beside the PDF.")
            print("  LOOK AT EVERY ONE, then delete them before committing.")
    else:
        print("  GATE 4 - not automated. Re-run with --preview to emit page images,")
        print("  and read every page before handing this over.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
