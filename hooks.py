"""MkDocs hooks for the combined student and admin PDF guides."""

from pathlib import Path
import hashlib
import json
import logging
import os
import re
import shutil
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_pdf import PDF_GUIDES, build_pdf, save_pdf_cache

INCLUDE_RE = re.compile(r'^--8<--\s+"([^"]+)"\s*$', re.MULTILINE)
ANDROID_MD_LINK = re.compile(
    r"\]\((?!https?:|mailto:|/|#|\.\./|android/)([^)]+\.md[^)]*)\)"
)
ADMIN_MD_LINK = re.compile(
    r"\]\((?!https?:|mailto:|/|#|\.\./)([^)]+\.md[^)]*)\)"
)
H2_WITH_ID = re.compile(r"^## .+\{:\s*#[^}]+\}\s*$", re.MULTILINE)
FRONTMATTER_RE = re.compile(r"\A---\r?\n.*?\r?\n---\r?\n*", re.DOTALL)
PDF_PAGES = {"download-pdf.md", "download-admin-pdf.md"}
IMG_IN_MD = re.compile(r"\]\((?:\.\./)*img/([^)\s]+)\)")


def _admin_md_href(match):
    target = match.group(1)
    name, _, frag = target.partition("#")
    slug = name[:-3] if name.endswith(".md") else name
    url = f"/admin/{slug}/"
    if frag:
        url += f"#{frag}"
    return f"]({url})"


def _warn_missing_search_terms(markdown, page):
    """Keep hashed article sections findable in search when new H2s are added."""
    if "skip-to" not in markdown:
        return
    log = logging.getLogger("mkdocs.plugins")
    parts = re.split(r"(?=^## )", markdown, flags=re.MULTILINE)
    for part in parts:
        if not H2_WITH_ID.match(part):
            continue
        if "sr-search-terms" in part:
            continue
        heading = part.splitlines()[0].strip()
        log.warning("%s: add sr-search-terms under %s so search can find this section", page.file.src_uri, heading)


def _strip_frontmatter(text):
    return FRONTMATTER_RE.sub("", text, count=1)


def on_page_markdown(markdown, page, config, files):
    """Inline snippets and fix image paths before MkDocs checks links."""
    _warn_missing_search_terms(markdown, page)
    src = page.file.src_uri.replace("\\", "/")
    if src not in PDF_PAGES:
        return markdown

    docs = Path(config["docs_dir"])

    def insert(match):
        rel = match.group(1)
        text = _strip_frontmatter((docs / rel).read_text(encoding="utf-8"))
        if rel.startswith("android/") or rel.startswith("admin/"):
            text = text.replace("](../img/", "](img/")
            text = text.replace("](../../img/", "](img/")
        if rel.startswith("android/"):
            text = ANDROID_MD_LINK.sub(r"](android/\1)", text)
        if rel.startswith("admin/"):
            text = ADMIN_MD_LINK.sub(_admin_md_href, text)
        return text

    return INCLUDE_RE.sub(insert, markdown)


def _cache_dir() -> Path:
    return Path(__file__).resolve().parent / ".pdf-cache"


def _guide_source_files(docs_dir: Path, download_md: str) -> list[Path]:
    """Markdown and images that make up one Export in PDF file."""
    start = docs_dir / download_md
    files = [start]
    if not start.is_file():
        return files
    text = start.read_text(encoding="utf-8")
    snippets = []
    for match in INCLUDE_RE.finditer(text):
        snippet = docs_dir / match.group(1)
        files.append(snippet)
        snippets.append(snippet)
    img_dir = docs_dir / "img"
    for path in snippets:
        if not path.is_file():
            continue
        body = path.read_text(encoding="utf-8")
        for img_match in IMG_IN_MD.finditer(body):
            files.append(img_dir / img_match.group(1))
    return files


def _fingerprint(paths: list[Path]) -> str:
    digest = hashlib.sha256()
    for path in sorted({p.resolve() for p in paths if p.is_file()}, key=str):
        digest.update(path.name.encode("utf-8"))
        digest.update(b"\0")
        if path.suffix.lower() in {".md", ".html"}:
            digest.update(path.read_bytes())
        else:
            info = path.stat()
            digest.update(f"{info.st_size}:{info.st_mtime_ns}".encode("utf-8"))
        digest.update(b"\0")
    return digest.hexdigest()


def _stamp_path(filename: str) -> Path:
    return _cache_dir() / f"{filename}.sha256"


def on_files(files, config):
    """Register PDFs so mkdocs serve actually exposes them (files in site/ alone 404)."""
    from mkdocs.structure.files import File, InclusionLevel

    cache_dir = _cache_dir()
    for guide in PDF_GUIDES:
        cache = cache_dir / guide["filename"]
        if not cache.is_file():
            continue
        existing = files.get_file_from_path(guide["filename"])
        if existing is not None:
            files.remove(existing)
        files.append(
            File.generated(
                config,
                guide["filename"],
                abs_src_path=str(cache),
                inclusion=InclusionLevel.INCLUDED,
            )
        )
    return files


def _write_admin_redirects(site_dir: Path):
    """Keep old /tas-admin/ and /analytics/ URLs working (they 404 without /admin/)."""
    redirects = {
        "tas-admin": "/admin/tas-admin/",
        "analytics": "/admin/analytics/",
    }
    for slug, dest in redirects.items():
        folder = site_dir / slug
        folder.mkdir(parents=True, exist_ok=True)
        (folder / "index.html").write_text(
            "<!DOCTYPE html>\n"
            "<html lang=\"en\">\n"
            "<head>\n"
            "  <meta charset=\"utf-8\">\n"
            f'  <meta http-equiv="refresh" content="0; url={dest}">\n'
            f'  <link rel="canonical" href="{dest}">\n'
            f'  <script>window.location.replace({dest!r});</script>\n'
            f"  <title>Redirecting</title>\n"
            "</head>\n"
            f'<body><a href="{dest}">Continue</a></body>\n'
            "</html>\n",
            encoding="utf-8",
        )


def _fix_search_index(site_dir: Path):
    """Keep full-word search working. Material adds trailing * to queries, which
    skips stemming, so a stemmer in the index makes certificate/install miss."""
    path = site_dir / "search" / "search_index.json"
    if not path.is_file():
        return
    data = json.loads(path.read_text(encoding="utf-8"))
    cfg = data.setdefault("config", {})
    pipeline = [p for p in (cfg.get("pipeline") or []) if p != "stemmer"]
    if "stopWordFilter" not in pipeline:
        pipeline.append("stopWordFilter")
    if "trimmer" not in pipeline:
        pipeline.append("trimmer")
    cfg["pipeline"] = pipeline
    sep = cfg.get("separator") or ""
    if "<>" not in sep:
        cfg["separator"] = r'[\s\-,:!=\[\]()"/<>]+|(?!\b)(?=[A-Z][a-z])|\.(?!\d)|&[lg]t;'
    path.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


def _write_pdf_manifest(site_dir: Path, docs_dir: Path):
    """Lets Export in PDF links bust browser cache when guide source changes."""
    manifest = {}
    for guide in PDF_GUIDES:
        download_md = guide.get("download_md", f"{guide['page']}.md")
        manifest[guide["filename"]] = _fingerprint(_guide_source_files(docs_dir, download_md))
    (site_dir / "pdf-versions.json").write_text(
        json.dumps(manifest, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )


def _guide_pdf_state(guide, docs_dir: Path, force: bool):
    cache = _cache_dir() / guide["filename"]
    download_md = guide.get("download_md", f"{guide['page']}.md")
    fingerprint = _fingerprint(_guide_source_files(docs_dir, download_md))
    stamp = _stamp_path(guide["filename"])
    up_to_date = (
        not force
        and cache.is_file()
        and stamp.is_file()
        and stamp.read_text(encoding="utf-8").strip() == fingerprint
    )
    return fingerprint, up_to_date, cache, stamp


def on_post_build(config, **kwargs):
    log = logging.getLogger("mkdocs")
    site_dir = Path(config["site_dir"])
    docs_dir = Path(config["docs_dir"])
    _write_admin_redirects(site_dir)
    _fix_search_index(site_dir)
    _write_pdf_manifest(site_dir, docs_dir)
    skip_generate = os.environ.get("MKDOCS_SKIP_PDF") == "1"
    force = os.environ.get("MKDOCS_FORCE_PDF") == "1"

    log.info("Updating Export in PDF when guide source changed")
    for guide in PDF_GUIDES:
        dest = site_dir / guide["filename"]
        fingerprint, up_to_date, cache, stamp = _guide_pdf_state(guide, docs_dir, force)
        if up_to_date:
            shutil.copy2(cache, dest)
            log.info("%s is up to date", guide["filename"])
            continue

        if skip_generate:
            log.warning(
                "%s is out of date — regenerating (MKDOCS_SKIP_PDF skips only when "
                "the PDF already matches the latest guide text)",
                guide["filename"],
            )

        try:
            pdf_path = build_pdf(site_dir, guide)
            save_pdf_cache(pdf_path)
            if pdf_path.resolve() != dest.resolve():
                shutil.copy2(pdf_path, dest)
            stamp.parent.mkdir(parents=True, exist_ok=True)
            stamp.write_text(fingerprint + "\n", encoding="utf-8")
            log.info("Wrote %s", pdf_path.name)
        except Exception:
            log.exception("Could not generate %s; keeping the last cached file if any", guide["filename"])
            if cache.is_file():
                shutil.copy2(cache, dest)
