#!/usr/bin/env python3
"""Render a Crema Italia HTML source file to PDF with WeasyPrint.

Core principle of the crema-italia-pdf-builder skill: the HTML is the editable
source of truth; the PDF is a reproducible render of it. Output is written next
to the source with the same basename, so the two always travel together.

Usage:
    python render_pdf.py <source.html> [output.pdf]

If [output.pdf] is omitted, writes <source>.pdf beside the source file.
Relative URLs in the HTML (brand CSS, fonts.css, .ttf files, images) resolve
from the source file's own directory, so keep the source in the project tree.
"""
import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python render_pdf.py <source.html> [output.pdf]")
        return 1

    src = Path(sys.argv[1]).expanduser().resolve()
    if not src.exists():
        print(f"Source not found: {src}")
        return 1
    if src.suffix.lower() not in {".html", ".htm"}:
        print(f"Expected an .html source, got: {src.name}")
        return 1

    out = (
        Path(sys.argv[2]).expanduser().resolve()
        if len(sys.argv) > 2
        else src.with_suffix(".pdf")
    )

    try:
        from weasyprint import HTML
    except ImportError:
        print(
            "WeasyPrint is not installed.\n"
            "Install it with:  pip install weasyprint --break-system-packages"
        )
        return 2

    # filename= sets base_url to the source dir so relative assets resolve.
    HTML(filename=str(src)).write_pdf(str(out))

    size = out.stat().st_size
    print(f"Rendered: {out}")
    print(f"Source kept: {src}")
    print(f"PDF size: {size:,} bytes")
    if size < 20_000:
        print(
            "WARNING: the PDF is unusually small. Check that the brand CSS and "
            "local .ttf fonts resolved correctly (a missing stylesheet or font "
            "produces a stripped-down render)."
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
