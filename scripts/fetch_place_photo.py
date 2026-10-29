#!/usr/bin/env python3
"""Fetch a place photo into SITE/photos/{id}.jpg with Commons search + retries + placeholder.

Usage:
  fetch_place_photo.py SITE_DIR PHOTO_ID --query "Fushimi Inari Kyoto"
  fetch_place_photo.py SITE_DIR PHOTO_ID --file "Exact_Name.jpg"
  fetch_place_photo.py SITE_DIR PHOTO_ID --query "Kyoto Gion" --file "optional.jpg"

Exit 0 if a jpg was written (Commons or placeholder). Prints PHOTOS line on stdout.
"""
from __future__ import annotations

import argparse
import json
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

UA = "static-travel-guide-skill/1.1 (itinerary builder; https://github.com/aladdin0306/static-travel-guide-skill)"
API = "https://commons.wikimedia.org/w/api.php"
CTX = ssl.create_default_context()


def http_get(url: str, retries: int = 5, pause: float = 1.2) -> bytes:
    last: Exception | None = None
    for i in range(retries):
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, context=CTX, timeout=45) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            last = e
            # Retry transient errors
            if e.code in (429, 500, 502, 503, 504) and i + 1 < retries:
                time.sleep(pause * (i + 1))
                continue
            raise
        except (urllib.error.URLError, TimeoutError) as e:
            last = e
            if i + 1 < retries:
                time.sleep(pause * (i + 1))
                continue
            raise
    raise RuntimeError(f"GET failed: {url}") from last


def api_json(params: dict) -> dict:
    q = urllib.parse.urlencode(params)
    raw = http_get(f"{API}?{q}")
    return json.loads(raw.decode("utf-8"))


def strip_html(s: str) -> str:
    return re.sub(r"<[^>]+>", "", s or "").strip()


def file_info(title: str) -> tuple[str, str, str] | None:
    """Return (filename, url, credit) or None if missing."""
    if not title.startswith("File:"):
        title = f"File:{title}"
    data = api_json(
        {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|mime|extmetadata|size",
            "format": "json",
        }
    )
    page = next(iter(data["query"]["pages"].values()))
    if page.get("missing") is not None or "imageinfo" not in page:
        return None
    info = page["imageinfo"][0]
    mime = (info.get("mime") or "").lower()
    if not mime.startswith("image/") or mime in ("image/svg+xml", "image/tiff"):
        return None
    meta = info.get("extmetadata") or {}
    artist = strip_html((meta.get("Artist") or {}).get("value") or "Unknown")
    lic = strip_html(
        (meta.get("LicenseShortName") or {}).get("value")
        or (meta.get("UsageTerms") or {}).get("value")
        or "see Commons"
    )
    fname = title.replace("File:", "", 1)
    return fname, info["url"], f"{artist} · {lic}"


def search_files(query: str, limit: int = 12) -> list[str]:
    data = api_json(
        {
            "action": "query",
            "list": "search",
            "srnamespace": "6",
            "srsearch": query,
            "srlimit": str(limit),
            "format": "json",
        }
    )
    return [hit["title"] for hit in data.get("query", {}).get("search", [])]


def compress_to_jpeg(src: Path, dest: Path) -> None:
    import subprocess
    import shutil

    if shutil.which("sips"):
        subprocess.run(
            ["sips", "-s", "format", "jpeg", "-Z", "1600", str(src), "--out", str(dest)],
            check=True,
            capture_output=True,
        )
        return
    if shutil.which("magick"):
        subprocess.run(
            ["magick", str(src), "-resize", "1600x1600>", "-quality", "82", str(dest)],
            check=True,
            capture_output=True,
        )
        return
    if shutil.which("convert"):
        subprocess.run(
            ["convert", str(src), "-resize", "1600x1600>", "-quality", "82", str(dest)],
            check=True,
            capture_output=True,
        )
        return
    # Fallback: copy bytes; rename to .jpg even if png/webp
    dest.write_bytes(src.read_bytes())


def write_placeholder(dest: Path, label: str) -> str:
    """Solid JPEG via sips from a tiny generated PNG, or bundled asset."""
    import struct
    import zlib
    import subprocess
    import shutil

    def png_rgb(w: int, h: int, rgb: tuple[int, int, int]) -> bytes:
        r, g, b = rgb
        raw = b"".join(b"\x00" + bytes([r, g, b]) * w for _ in range(h))

        def chunk(tag: bytes, data: bytes) -> bytes:
            return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

        ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
        return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")

    tmp = dest.with_suffix(".png")
    tmp.write_bytes(png_rgb(1200, 800, (15, 118, 110)))  # teal
    try:
        compress_to_jpeg(tmp, dest)
    finally:
        tmp.unlink(missing_ok=True)
    # If compress left non-jpeg copy, still ok for <img>
    if not dest.exists() and shutil.which("sips"):
        subprocess.run(["sips", "-s", "format", "jpeg", str(tmp), "--out", str(dest)], check=False)
    credit = f"Placeholder · {label[:40]}"
    return credit


def try_download(url: str, dest: Path) -> bool:
    tmp = dest.with_suffix(".download")
    try:
        tmp.write_bytes(http_get(url, retries=5))
        compress_to_jpeg(tmp, dest)
        return dest.exists() and dest.stat().st_size > 1000
    except Exception as e:
        print(f"download failed: {e}", file=sys.stderr)
        return False
    finally:
        tmp.unlink(missing_ok=True)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("site_dir")
    ap.add_argument("photo_id")
    ap.add_argument("--query", default="", help="Commons search query (place name)")
    ap.add_argument("--file", default="", help="Exact Commons file name (optional)")
    ap.add_argument("--no-placeholder", action="store_true")
    args = ap.parse_args()

    site = Path(args.site_dir).resolve()
    photos = site / "photos"
    photos.mkdir(parents=True, exist_ok=True)
    dest = photos / f"{args.photo_id}.jpg"

    candidates: list[str] = []
    if args.file:
        candidates.append(args.file if args.file.startswith("File:") else f"File:{args.file}")

    queries = []
    if args.query.strip():
        q = args.query.strip()
        queries = [q, f"{q} temple", f"{q} shrine", f"{q} exterior", f"{q} Japan"]
        # de-dupe
        seen = set()
        queries = [x for x in queries if not (x in seen or seen.add(x))]

    for q in queries:
        try:
            for title in search_files(q):
                if title not in candidates:
                    candidates.append(title)
        except Exception as e:
            print(f"search error for {q!r}: {e}", file=sys.stderr)

    # Cap attempts
    candidates = candidates[:15]
    chosen: tuple[str, str, str] | None = None
    for title in candidates:
        try:
            info = file_info(title)
        except Exception as e:
            print(f"info error {title}: {e}", file=sys.stderr)
            continue
        if not info:
            continue
        fname, url, credit = info
        if try_download(url, dest):
            chosen = (fname, url, credit)
            break

    if not chosen:
        if args.no_placeholder:
            print("FAILED: no Commons image", file=sys.stderr)
            return 1
        label = args.query or args.photo_id
        credit = write_placeholder(dest, label)
        fname = f"placeholder:{label}"
        print(f"WARN: used placeholder for {args.photo_id}", file=sys.stderr)
        chosen = (fname, "", credit)

    fname, _url, credit = chosen
    print(f"Saved {dest}")
    print("PHOTOS entry:")
    print(f'  "{args.photo_id}": [{json.dumps(credit, ensure_ascii=False)}, {json.dumps(fname, ensure_ascii=False)}],')
    return 0


if __name__ == "__main__":
    sys.exit(main())
