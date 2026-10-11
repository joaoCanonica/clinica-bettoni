"""Gera favicons, apple-touch-icon e assets/og-image.jpg a partir da lotus vetorial.

Requer: pip install pillow cairosvg   (uso opcional; o site nao depende disto)
Uso: python3 scripts/gerar-og.py
"""
import io
import sys
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import lotus  # noqa: E402

A = ROOT / "assets"


def png(svg, w):
    return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode(), output_width=w))).convert("RGBA")


def font(name, size):
    for p in (A / "fonts" / name, Path("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf")):
        try:
            return ImageFont.truetype(str(p), size)
        except OSError:
            continue
    return ImageFont.load_default()


def main():
    fav = lotus.silhouette()
    (A / "favicon.svg").write_text(fav + "\n")
    for n in (32, 192, 512):
        png(fav, n).save(A / f"favicon-{n}.png")
    png(lotus.silhouette(bg="#103f32", fg="#f6f5ed"), 180).convert("RGB").save(A / "apple-touch-icon.png")

    og = Image.new("RGB", (1200, 630), "#0b2f26")
    glow = Image.new("RGBA", (1200, 630))
    d = ImageDraw.Draw(glow)
    for r in range(260, 0, -4):
        d.ellipse((600 - r * 1.6, 230 - r, 600 + r * 1.6, 230 + r), fill=(23, 109, 70, int(60 * (1 - r / 260))))
    og.paste(glow, (0, 0), glow)
    flower = png(lotus.mark(False), 560)
    og.paste(flower, (320, -10), flower)
    d = ImageDraw.Draw(og)
    t1, t2 = "Clínica Dr. Bettoni", "Saúde mental e ultrassonografia · Lages, SC"
    f1, f2 = font("spectral-latin-500-normal.woff2", 72), font("dm-sans-latin-wght-normal.woff2", 30)
    d.text((600, 450), t1, font=f1, fill="#f6f5ed", anchor="mm")
    d.text((600, 525), t2, font=f2, fill="#c8dbac", anchor="mm")
    og.save(A / "og-image.jpg", quality=86, optimize=True, progressive=True)
    print("og-image.jpg", (A / "og-image.jpg").stat().st_size, "bytes")


if __name__ == "__main__":
    main()
