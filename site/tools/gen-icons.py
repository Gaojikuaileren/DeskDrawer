#!/usr/bin/env python3
"""
Generate every branding raster the site needs, from one vector-ish source of truth.

Why this exists
---------------
The site previously declared its favicon as an inline `data:` URI. Browsers accept that;
Google's favicon crawler does not — it needs a real file at a real, crawlable URL. With no
such file, Google fell back to /favicon.ico, which Cloudflare Pages answered with index.html
(HTTP 200, text/html), so the icon was discarded and a generic one shown in search results.

This script emits the real files. Run it from the repo root:

    python site/tools/gen-icons.py

Output lands directly in docs/ (the Cloudflare Pages output directory).
"""

import io
import os
import struct
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "docs")
ASSET = os.path.join(OUT, "assets")
os.makedirs(ASSET, exist_ok=True)

# ---------------------------------------------------------------- brand tokens
BG_TOP = (14, 17, 24)
BG_BOT = (7, 8, 16)
BG_FLAT = (9, 10, 14)
BLUE = (122, 169, 255)
GREEN = (87, 207, 162)
TEXT = (244, 246, 250)
MUTED = (154, 162, 178)

SS = 8  # supersampling factor — draw big, downsample with LANCZOS for crisp edges

FONT_DIR = r"C:\Windows\Fonts"
F_BOLD = os.path.join(FONT_DIR, "segoeuib.ttf")
F_SEMI = os.path.join(FONT_DIR, "seguisb.ttf")
F_REG = os.path.join(FONT_DIR, "segoeui.ttf")


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def vgrad(size, top, bottom):
    """Vertical linear gradient as an RGB image."""
    w, h = size
    g = Image.new("RGB", (1, h))
    px = g.load()
    for y in range(h):
        t = y / max(1, h - 1)
        px[0, y] = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
    return g.resize((w, h), Image.BILINEAR)


def radial_mask(size, cx, cy, rx, ry, strength=1.0):
    """Soft elliptical falloff mask, used for the atmospheric glows."""
    base = Image.radial_gradient("L").resize((max(2, int(rx * 2)), max(2, int(ry * 2))), Image.BILINEAR)
    base = base.point(lambda v: int((255 - v) * strength))
    m = Image.new("L", size, 0)
    m.paste(base, (int(cx - rx), int(cy - ry)))
    return m


# ---------------------------------------------------------------- the mark
# Design grid is 32 units square, matching the SVG in the page header so the
# favicon, the PWA icon, the OG card and the on-page logo are the same drawing.
#   left  bar: tall,  blue   — the open drawer
#   right bar: short, green  — the folded drawer
GLYPH = [
    # (x, y, w, h, radius, color)
    (6.8, 7.0, 7.6, 18.0, 2.3, BLUE),
    (17.6, 7.0, 7.6, 11.6, 2.3, GREEN),
]


def draw_glyph(draw, x0, y0, span, alpha=255):
    """Draw the two bars inside a `span`-wide box whose top-left is (x0, y0)."""
    u = span / 32.0
    for (x, y, w, h, r, color) in GLYPH:
        draw.rounded_rectangle(
            [x0 + x * u, y0 + y * u, x0 + (x + w) * u, y0 + (y + h) * u],
            radius=r * u,
            fill=color + (alpha,),
        )


def tile(size, radius_ratio=0.2188, glyph_scale=1.0, flat_bg=False):
    """A square app-tile: rounded dark plate + the mark, rendered supersampled."""
    S = size * SS
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))

    plate = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    bg = vgrad((S, S), BG_TOP, BG_BOT).convert("RGBA")
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=radius_ratio * S, fill=255)
    plate.paste(bg, (0, 0), mask)
    img.alpha_composite(plate)

    # hairline top highlight, so the tile reads as a physical surface at large sizes
    if size >= 64:
        hl = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        ImageDraw.Draw(hl).rounded_rectangle(
            [0, 0, S - 1, S - 1], radius=radius_ratio * S, outline=(255, 255, 255, 26), width=max(1, S // 220)
        )
        img.alpha_composite(hl)

    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    span = S * glyph_scale
    draw_glyph(ImageDraw.Draw(layer), (S - span) / 2, (S - span) / 2, span)
    img.alpha_composite(layer)

    return img.resize((size, size), Image.LANCZOS)


def save(img, name):
    path = os.path.join(OUT, name)
    img.save(path)
    print(f"  {name:34s} {os.path.getsize(path):>8,} B")


print("icons ->")

def _dib(im):
    """A 32bpp bottom-up DIB frame with an empty AND mask, as old ICO parsers expect."""
    im = im.convert("RGBA")
    w, h = im.size
    header = struct.pack("<IiiHHIIiiII", 40, w, h * 2, 1, 32, 0, w * h * 4, 0, 0, 0, 0)
    px = im.load()
    xor = bytearray()
    for y in range(h - 1, -1, -1):
        for x in range(w):
            r, g, b, a = px[x, y]
            xor += bytes((b, g, r, a))
    and_row = ((w + 31) // 32) * 4  # 1bpp, rows padded to 4 bytes
    return header + bytes(xor) + bytes(and_row * h)


def write_ico(images, path):
    """
    Hand-rolled ICO writer.

    Pillow's ICO encoder silently drops any requested size larger than the base image,
    which produced a single 16x16 frame here. Writing the container directly keeps every
    frame exactly as rendered. DIB below 64px for maximum parser compatibility, PNG above
    it to keep the file small.
    """
    blobs = []
    for im in images:
        if im.size[0] >= 64:
            buf = io.BytesIO()
            im.save(buf, format="PNG", optimize=True)
            blobs.append(buf.getvalue())
        else:
            blobs.append(_dib(im))

    out = struct.pack("<HHH", 0, 1, len(images))
    offset = 6 + 16 * len(images)
    for im, data in zip(images, blobs):
        w, h = im.size
        out += struct.pack("<BBBBHHII", w % 256, h % 256, 0, 0, 1, 32, len(data), offset)
        offset += len(data)
    with open(path, "wb") as fh:
        fh.write(out + b"".join(blobs))


# ---- favicon.ico: multi-resolution, the file Google's favicon crawler actually wants
ico_path = os.path.join(OUT, "favicon.ico")
write_ico([tile(s) for s in (16, 24, 32, 48, 64, 128, 256)], ico_path)
print(f"  {'favicon.ico':34s} {os.path.getsize(ico_path):>8,} B")

# ---- PNG favicons (Google prefers these too; some crawlers ignore .ico entirely)
save(tile(32), "favicon-32x32.png")
save(tile(16), "favicon-16x16.png")
save(tile(96), "favicon-96x96.png")

# ---- Apple touch icon: full-bleed, iOS applies its own mask
save(tile(180, radius_ratio=0.0, glyph_scale=0.74), "apple-touch-icon.png")

# ---- PWA / manifest icons
save(tile(192), "icon-192.png")
save(tile(512), "icon-512.png")
# maskable: content must survive a circular crop, so keep it inside the 80% safe zone
save(tile(512, radius_ratio=0.0, glyph_scale=0.56), "icon-maskable-512.png")

# ---- Windows tile
save(tile(270, radius_ratio=0.0, glyph_scale=0.62), "mstile-270x270.png")

# ---------------------------------------------------------------- social cards
def og_card(out_name, title, subtitle, kicker="deskdrawer.pages.dev"):
    """1200x630 Open Graph / Twitter card in the site's own visual language."""
    W, H = 1200, 630
    img = vgrad((W, H), (13, 15, 22), (6, 7, 11)).convert("RGBA")

    # atmospheric glows, mirroring the CSS radial-gradients on the live page
    for (cx, cy, rx, ry, color, strength) in [
        (W * 0.80, -40, 620, 470, BLUE, 0.30),
        (W * 0.10, 60, 520, 430, GREEN, 0.20),
        (W * 0.55, H + 120, 700, 480, BLUE, 0.16),
    ]:
        glow = Image.new("RGBA", (W, H), color + (255,))
        img.alpha_composite(Image.composite(glow, Image.new("RGBA", (W, H), (0, 0, 0, 0)),
                                            radial_mask((W, H), cx, cy, rx, ry, strength)))

    # faint 64px grid, fading out toward the bottom
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    for x in range(0, W, 64):
        gd.line([(x, 0), (x, H)], fill=(255, 255, 255, 12))
    for y in range(0, H, 64):
        gd.line([(0, y), (W, y)], fill=(255, 255, 255, 12))
    fade = Image.linear_gradient("L").resize((W, H)).point(lambda v: 255 - v)
    grid.putalpha(Image.composite(grid.getchannel("A"), Image.new("L", (W, H), 0), fade))
    img.alpha_composite(grid)

    d = ImageDraw.Draw(img)
    PAD = 84

    # mark + wordmark
    mark = tile(96)
    img.alpha_composite(mark, (PAD, PAD))
    d.text((PAD + 96 + 22, PAD + 26), "DeskDrawer", font=font(F_BOLD, 40), fill=TEXT)

    # headline, wrapped by measured width
    f_title = font(F_BOLD, 68 if len(title) < 34 else 56)
    words, lines, cur = title.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if d.textlength(trial, font=f_title) > W - PAD * 2 and cur:
            lines.append(cur)
            cur = w
        else:
            cur = trial
    lines.append(cur)

    y = H - PAD - 46 - len(lines) * (f_title.size + 12) - (34 if subtitle else 0)
    for ln in lines:
        d.text((PAD, y), ln, font=f_title, fill=TEXT)
        y += f_title.size + 12

    if subtitle:
        d.text((PAD, y + 8), subtitle, font=font(F_REG, 27), fill=MUTED)
        y += 34

    # footer rule + domain
    d.line([(PAD, H - PAD + 4), (W - PAD, H - PAD + 4)], fill=(255, 255, 255, 28), width=1)
    d.text((PAD, H - PAD + 16), kicker, font=font(F_SEMI, 22), fill=(126, 136, 154))

    # accent stripe, bottom-right, tying back to the two-bar mark
    d.rounded_rectangle([W - PAD - 96, H - PAD + 18, W - PAD - 46, H - PAD + 26], radius=4, fill=BLUE)
    d.rounded_rectangle([W - PAD - 38, H - PAD + 18, W - PAD, H - PAD + 26], radius=4, fill=GREEN)

    path = os.path.join(ASSET, out_name)
    img.convert("RGB").save(path, quality=92, optimize=True)
    print(f"  assets/{out_name:27s} {os.path.getsize(path):>8,} B")


print("social cards ->")
CARDS = [
    ("og.png", "Lightweight Windows desktop organizer", "Group desktop icons into clean drawers. Buy once, use for life."),
    ("og-docs.png", "DeskDrawer documentation", "Every board, menu, gesture and setting, explained."),
    ("og-faq.png", "DeskDrawer questions & answers", "Straight answers about boards, files, privacy and licensing."),
    ("og-glossary.png", "The DeskDrawer glossary", "Canonical definitions for every concept in the app."),
    ("og-notes.png", "Engineering notes", "How DeskDrawer is built, and why it is built that way."),
    ("og-download.png", "Download DeskDrawer", "One-time purchase on the Microsoft Store. Windows 10 and 11."),
    ("og-features.png", "Everything DeskDrawer does", "Drawers, native shell behaviour, sorting, and nothing else."),
    ("og-compare.png", "DeskDrawer vs. full desktop suites", "An honest way to choose a desktop organizer."),
    ("og-changelog.png", "Release history", "Every DeskDrawer version, and what changed in it."),
    ("og-about.png", "About DeskDrawer", "Who builds it, and the principles it is built on."),
    ("og-privacy.png", "Privacy at DeskDrawer", "No ads, no telemetry, no accounts, no network calls."),
    ("og-support.png", "DeskDrawer support", "Report a bug, request a feature, or get help."),
    ("og-roadmap.png", "DeskDrawer roadmap", "What is being considered, and what is deliberately out of scope."),
]
for args in CARDS:
    og_card(*args)

print("\ndone.")
