"""Make web-ready photo variants for the site.

Reads the master JPEGs in assets/photos/ and writes, for each one:
  - WebP and JPEG copies at a few widths into public/images/
    (e.g. carlton-ballroom-ottawa-1024.webp); the page picks a size per screen
  - a 1200 x 630 link-preview image into public/images/og/
  - its sizes into src/photos.json, which the build reads for width/height
Also recompresses the logo PNGs and the default social-share image.

    pip install pillow
    python scripts/optimize_images.py

Run it again whenever you add or replace a photo in assets/photos/.
Name files by what they show, in lowercase with hyphens, e.g. fitzroy-workshop-2.jpg.
"""

import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "photos"
OUT = ROOT / "public" / "images"
OG = OUT / "og"
MANIFEST = ROOT / "src" / "photos.json"
WIDTHS = [640, 1024, 1600]  # plus the master's own width when it is smaller than the largest
MAX_WIDTH = 1800
WEBP_QUALITY = 76
JPEG_QUALITY = 78


def variants(im):
    top = min(im.width, MAX_WIDTH)
    return sorted({w for w in WIDTHS if w < top} | {top})


def og_crop(im):
    """Centre-crop to 1200 x 630."""
    target = 1200 / 630
    if im.width / im.height > target:
        w = round(im.height * target)
        box = ((im.width - w) // 2, 0, (im.width - w) // 2 + w, im.height)
    else:
        h = round(im.width / target)
        box = (0, (im.height - h) // 2, im.width, (im.height - h) // 2 + h)
    return im.crop(box).resize((1200, 630), Image.LANCZOS)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    OG.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*-[0-9]*.*"):
        if old.suffix in (".webp", ".jpg") and old.stem.rsplit("-", 1)[-1].isdigit():
            old.unlink()
    for old in OG.glob("*.jpg"):
        old.unlink()

    manifest = {}
    for path in sorted(SRC.glob("*.jpg")):
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        sizes = variants(im)
        top = sizes[-1]
        manifest[path.stem] = {"widths": sizes, "width": top, "height": round(im.height * top / im.width)}
        for w in sizes:
            h = round(im.height * w / im.width)
            sized = im if w == im.width else im.resize((w, h), Image.LANCZOS)
            webp = OUT / f"{path.stem}-{w}.webp"
            jpg = OUT / f"{path.stem}-{w}.jpg"
            sized.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)
            sized.save(jpg, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
            print(f"{webp.name:44} {webp.stat().st_size // 1024:5} KB   {jpg.stat().st_size // 1024:5} KB (jpg)")
        og = OG / f"{path.stem}.jpg"
        og_crop(im).save(og, "JPEG", quality=80, optimize=True, progressive=True)

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {MANIFEST.relative_to(ROOT)} ({len(manifest)} photos)")

    og = OUT / "og-image.jpg"
    if og.exists():
        Image.open(og).convert("RGB").save(og, "JPEG", quality=80, optimize=True, progressive=True)

    for name in ("logo.png", "logo-512.png"):
        p = OUT / name
        if p.exists():
            Image.open(p).convert("RGBA").quantize(colors=128, method=Image.Quantize.FASTOCTREE).save(p, optimize=True)


if __name__ == "__main__":
    main()
