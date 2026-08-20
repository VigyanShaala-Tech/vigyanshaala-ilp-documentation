"""MkDocs hooks for the combined Web + Android PDF."""

from pathlib import Path
import logging
import os
import re
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_pdf import PDF_NAME, build_pdf

INCLUDE_RE = re.compile(r'^--8<--\s+"([^"]+)"\s*$', re.MULTILINE)
ANDROID_MD_LINK = re.compile(
    r"\]\((?!https?:|mailto:|/|#|\.\./|android/)([^)]+\.md[^)]*)\)"
)


def on_page_markdown(markdown, page, config, files):
    """Inline snippets and fix Android paths before MkDocs checks links."""
    src = page.file.src_uri.replace("\\", "/")
    if src != "download-pdf.md":
        return markdown

    docs = Path(config["docs_dir"])

    def insert(match):
        rel = match.group(1)
        text = (docs / rel).read_text(encoding="utf-8")
        if rel.startswith("android/"):
            text = text.replace("](../img/", "](img/")
            text = text.replace("](../../img/", "](img/")
            text = ANDROID_MD_LINK.sub(r"](android/\1)", text)
        return text

    return INCLUDE_RE.sub(insert, markdown)


def on_post_build(config, **kwargs):
    if os.environ.get("MKDOCS_SKIP_PDF") == "1":
        return
    log = logging.getLogger("mkdocs")
    site_dir = Path(config["site_dir"])
    log.info("Updating Download PDF file")
    pdf_path = build_pdf(site_dir, site_dir / PDF_NAME)
    log.info("Wrote %s", pdf_path.name)
