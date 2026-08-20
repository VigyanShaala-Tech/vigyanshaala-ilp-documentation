"""Build a real PDF of the combined Web + Android student guide."""

from __future__ import annotations

import os
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PDF_NAME = "VigyanShaala-ILP-Student-Guide.pdf"


def _serve(site_dir: Path):
    class QuietHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(site_dir), **kwargs)

        def log_message(self, format, *args):
            return

    server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def build_pdf(site_dir: Path, output: Path | None = None) -> Path:
    site_dir = site_dir.resolve()
    html_page = site_dir / "download-pdf" / "index.html"
    if not html_page.is_file():
        raise FileNotFoundError(f"Missing combined guide page: {html_page}")

    output = (output or site_dir / PDF_NAME).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    try:
        from playwright.sync_api import sync_playwright
    except ImportError as exc:
        raise RuntimeError(
            "Playwright is required to generate the PDF. "
            "Run: pip install playwright && playwright install chromium"
        ) from exc

    server = _serve(site_dir)
    host, port = server.server_address
    url = f"http://{host}:{port}/download-pdf/"

    launch_args = ["--disable-dev-shm-usage"]
    if hasattr(os, "geteuid") and os.geteuid() == 0:
        launch_args.append("--no-sandbox")

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(args=launch_args)
            page = browser.new_page()
            page.goto(url, wait_until="load", timeout=120_000)
            page.evaluate("document.body.classList.add('pdf-guide-page')")
            page.evaluate("document.title = 'VigyanShaala ILP — Student Guide'")
            page.emulate_media(media="print")
            page.evaluate(
                """
                async () => {
                  const imgs = [...document.querySelectorAll(".md-content img")];
                  await Promise.all(imgs.map((img) => {
                    if (img.complete) return;
                    return new Promise((resolve) => {
                      img.addEventListener("load", resolve, { once: true });
                      img.addEventListener("error", resolve, { once: true });
                    });
                  }));
                }
                """
            )
            broken = page.evaluate(
                """
                () => [...document.querySelectorAll(".md-content img")]
                  .filter((img) => !img.naturalWidth)
                  .map((img) => img.getAttribute("src") || img.src)
                """
            )
            if broken:
                preview = ", ".join(broken[:8])
                raise RuntimeError(
                    f"{len(broken)} PDF images failed to load (e.g. {preview})"
                )
            page.pdf(
                path=str(output),
                format="A4",
                print_background=True,
                display_header_footer=True,
                header_template="<div></div>",
                footer_template=(
                    '<div style="width:100%; font-size:9px; color:#5a5a5a; '
                    "text-align:center; font-family:'Nunito Sans', Arial, sans-serif; "
                    'padding:0 12mm 2mm;">'
                    '<span class="pageNumber"></span>'
                    " / "
                    '<span class="totalPages"></span>'
                    "</div>"
                ),
                margin={
                    "top": "14mm",
                    "bottom": "18mm",
                    "left": "12mm",
                    "right": "12mm",
                },
            )
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    return output


def main(argv: list[str]) -> int:
    site_dir = Path(argv[1] if len(argv) > 1 else "site")
    build_pdf(site_dir)
    print(f"Wrote {site_dir / PDF_NAME}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
