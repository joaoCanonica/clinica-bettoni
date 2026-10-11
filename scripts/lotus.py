"""Gera o desenho vetorial da lotus (original) usado no site.

Uso: python3 scripts/lotus.py  -> grava assets/lotus-mark.svg, assets/favicon.svg
e imprime o SVG inline do intro (para colar em index.html se o desenho mudar).
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# (angulo, comprimento, largura relativa)
BACK = [(a, 100, 1.0) for a in (-72, -48, -24, 0, 24, 48, 72)]
MID = [(a, 82, 1.0) for a in (-60, -36, -12, 12, 36, 60)]
FRONT = [(a, 62, 1.05) for a in (-40, -20, 0, 20, 40)]
LAYERS = [("b", BACK, "lgb"), ("m", MID, "lgm"), ("f", FRONT, "lgf")]


def petal(length, width=1.0):
    k = length / 100
    w = width * k
    f = lambda x, y: f"{x * w:.1f},{y * k:.1f}"
    # petala lanceolada: base estreita, bojo no terco inferior, ponta afilada
    return (f"M0,0 C{f(-22, -14)} {f(-36, -52)} {f(-2, -97)} "
            f"Q{f(0, -101)} {f(2, -97)} C{f(36, -52)} {f(22, -14)} 0,0Z")


def defs():
    out = ['<defs>']
    for gid, top, bot in (("lgb", .80, .40), ("lgm", .88, .50), ("lgf", .94, .62)):
        out.append(f'<linearGradient id="{gid}" x1="0" y1="1" x2="0" y2="0">'
                   f'<stop offset="0" stop-color="#dfe9cf" stop-opacity="{bot}"/>'
                   f'<stop offset="1" stop-color="#fff" stop-opacity="{top}"/></linearGradient>')
    out.append('</defs>')
    return "".join(out)


def water(cls=""):
    rings = [(150, 14, .55), (115, 10, .4), (78, 6.5, .28)]
    return "".join(f'<ellipse{cls} cx="200" cy="240" rx="{rx}" ry="{ry}" fill="none" stroke="#8fb9a3" stroke-width="1" opacity="{o}"/>'
                   for rx, ry, o in rings)


def stamens():
    out = []
    for i, a in enumerate((-50, -34, -18, -6, 6, 18, 34, 50)):
        ln = 13 if abs(a) < 30 else 10
        out.append(f'<path d="M0,-6 l0,-{ln}" transform="rotate({a})"/>')
    return ('<g class="st" fill="none" stroke="#c9b27a" stroke-width="1.2" stroke-linecap="round">'
            + "".join(out) + '<circle cx="0" cy="-8" r="3.2" fill="#c9b27a" stroke="none"/></g>')


def mark(animated):
    parts = []
    for name, petals, grad in LAYERS:
        parts.append(f'<g class="ly ly-{name}" fill="url(#{grad})" stroke="#e9efd9" stroke-width="1.25" stroke-linejoin="round">')
        for i, (a, ln, wd) in enumerate(petals):
            d = petal(ln, wd)
            if animated:
                parts.append(f'<path class="pt" pathLength="1" style="--a:{a}deg;--i:{i}" d="{d}"/>')
            else:
                parts.append(f'<path transform="rotate({a})" d="{d}"/>')
        parts.append('</g>')
    flower = "".join(parts) + stamens()
    return (f'<svg viewBox="40 95 320 175" xmlns="http://www.w3.org/2000/svg"{" class=\"intro-lotus\" focusable=\"false\"" if animated else ""}>'
            + defs() + f'<g class="wt">{water()}</g>'
            + f'<g class="fl" transform="translate(200 236) scale(1.3)">{flower}</g></svg>')


def silhouette(bg=None, fg="#176d46", size=None):
    """So camada do meio + frente, um preenchimento; legivel a 32px."""
    paths = []
    for _, petals, _ in LAYERS[1:]:
        for a, ln, wd in petals:
            paths.append(f'<path transform="rotate({a})" d="{petal(ln, wd * 1.25)}"/>')
    rect = f'<rect width="400" height="400" fill="{bg}"/>' if bg else ""
    # recorta o quadrado em volta da flor: viewBox centrado
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{"0 0 400 400" if bg else "110 130 180 120"}">{rect}'
            f'<g transform="translate(200 {300 if bg else 236}){" scale(2.1)" if bg else ""}" fill="{fg}" stroke="{bg or "#fff"}" stroke-width="{2.5 if bg else 2}" stroke-linejoin="round">'
            + "".join(paths) + '</g></svg>')


if __name__ == "__main__":
    (ROOT / "assets/lotus-mark.svg").write_text(mark(False) + "\n")
    (ROOT / "assets/favicon.svg").write_text(silhouette() + "\n")
    print(mark(True))
