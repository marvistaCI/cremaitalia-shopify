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
import os
import sys
from pathlib import Path


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
