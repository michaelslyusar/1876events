"""Make web-ready photo variants for the site.

Reads the master JPEGs in assets/photos/ and writes, for each one, WebP and JPEG
copies at a few widths into public/images/ (e.g. carlton-ballroom-1024.webp).
The page picks the right size for the screen. Also recompresses the logo PNGs
and the social-share image.

    pip install pillow
    python scripts/optimize_images.py

Run it again whenever you add or replace a photo in assets/photos/.
"""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "photos"
OUT = ROOT / "public" / "images"
WIDTHS = [640, 1024, 1600]  # plus the master's own width when it is smaller than the largest
MAX_WIDTH = 1800
WEBP_QUALITY = 76
JPEG_QUALITY = 78


def variants(im):
    top = min(im.width, MAX_WIDTH)
    return sorted({w for w in WIDTHS if w < top} | {top})


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*-[0-9]*.*"):
        if old.suffix in (".webp", ".jpg") and old.stem.rsplit("-", 1)[-1].isdigit():
            old.unlink()

    total = 0
    for path in sorted(SRC.glob("*.jpg")):
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        for w in variants(im):
            h = round(im.height * w / im.width)
            sized = im if w == im.width else im.resize((w, h), Image.LANCZOS)
            webp = OUT / f"{path.stem}-{w}.webp"
            jpg = OUT / f"{path.stem}-{w}.jpg"
            sized.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)
            sized.save(jpg, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
            total += webp.stat().st_size
            print(f"{webp.name:30} {webp.stat().st_size // 1024:5} KB   {jpg.name:30} {jpg.stat().st_size // 1024:5} KB")

    og = OUT / "og-image.jpg"
    if og.exists():
        Image.open(og).convert("RGB").save(og, "JPEG", quality=80, optimize=True, progressive=True)
        print(f"{og.name:30} {og.stat().st_size // 1024:5} KB")

    for name in ("logo.png", "logo-512.png"):
        p = OUT / name
        if p.exists():
            Image.open(p).convert("RGBA").quantize(colors=128, method=Image.Quantize.FASTOCTREE).save(p, optimize=True)
            print(f"{p.name:30} {p.stat().st_size // 1024:5} KB")


if __name__ == "__main__":
    main()
