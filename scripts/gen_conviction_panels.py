"""
Generate conviction-panels.svg — two clean side-by-side charts:
  Left:  Conviction growth   f(t) = 1 − exp(−t / 30)   τ = 30 days  (90% at ~70 days)
  Right: Unlock availability f(t) = 1 − exp(−t / τ)    τ ≈ 158 days (90% at ~365 days)

Both y-axes run 0→1 (fraction of maximum). Each x-axis spans 3τ.
Output: ../static/img/conviction-panels.svg
"""
import math, os

TAU_CONV   = 30                        # conviction τ (days)
TAU_UNLOCK = 365 / math.log(10)        # unlock τ (days) — 90% at 365 days ≈ 158.5 days

# ── layout ───────────────────────────────────────────────────────────────────
W, H   = 720, 370
MT, MB = 50, 72        # top / bottom margins
ML, MR = 62, 22        # outer left / right margins
GAP    = 28            # gap between panels
PH     = H - MT - MB  # plot height = 248
PW     = (W - ML - MR - GAP) // 2  # each panel plot width = 304

P1X = ML              # left panel plot-area left edge
P2X = ML + PW + GAP  # right panel plot-area left edge

X1 = 3 * TAU_CONV              # left panel x-range = 3τ = 90 days
X2 = 3 * TAU_UNLOCK            # right panel x-range = 3τ ≈ 476 days

def x1(d): return P1X + (d / X1) * PW
def x2(d): return P2X + (d / X2) * PW
def yy(f): return MT + PH * (1 - f)

N = 600
conv_pts   = [(d, 1 - math.exp(-d / TAU_CONV))   for d in (i * X1 / N for i in range(N + 1))]
unlock_pts = [(d, 1 - math.exp(-d / TAU_UNLOCK)) for d in (i * X2 / N for i in range(N + 1))]

def polyline(pts, xfn):
    return " ".join(f"{xfn(x):.2f},{yy(y):.2f}" for x, y in pts)

BLUE   = "#3b82f6"
ORANGE = "#f97316"
AXIS   = "#374151"
GRID   = "#e5e7eb"
TEXT   = "#111827"
MUTED  = "#6b7280"

o = []
def l(s): o.append(s)

l(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
l(f'  <rect width="{W}" height="{H}" fill="white"/>')

# ── helper: draw one panel ────────────────────────────────────────────────────
def panel(pxfn, x_max, x_ticks, tau_day, color, pts, label, formula):
    # grid
    for yf in [0.2, 0.4, 0.6, 0.8, 1.0]:
        y = yy(yf)
        x_left  = pxfn(0)
        x_right = pxfn(x_max)
        l(f'  <line x1="{x_left:.2f}" y1="{y:.2f}" x2="{x_right:.2f}" y2="{y:.2f}" stroke="{GRID}" stroke-width="1"/>')
    for xd in x_ticks:
        x = pxfn(xd)
        l(f'  <line x1="{x:.2f}" y1="{MT}" x2="{x:.2f}" y2="{MT+PH}" stroke="{GRID}" stroke-width="1"/>')

    # 63.2% reference
    y63 = yy(1 - 1/math.e)
    x_left  = pxfn(0)
    x_right = pxfn(x_max)
    l(f'  <line x1="{x_left:.2f}" y1="{y63:.2f}" x2="{x_right:.2f}" y2="{y63:.2f}" '
      f'stroke="#9ca3af" stroke-width="1" stroke-dasharray="4,3"/>')
    l(f'  <text x="{x_left+4}" y="{y63-5:.2f}" font-size="10" fill="{MUTED}" font-family="sans-serif">63.2%</text>')

    # τ vertical reference
    x_tau = pxfn(tau_day)
    l(f'  <line x1="{x_tau:.2f}" y1="{MT}" x2="{x_tau:.2f}" y2="{MT+PH}" '
      f'stroke="{color}" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>')

    # curve
    l(f'  <polyline points="{polyline(pts, pxfn)}" fill="none" stroke="{color}" stroke-width="2.5" stroke-linejoin="round"/>')

    # dot at (τ, 63.2%)
    l(f'  <circle cx="{x_tau:.2f}" cy="{y63:.2f}" r="4" fill="{color}" stroke="white" stroke-width="1.5"/>')

    # axes
    x0 = pxfn(0)
    xn = pxfn(x_max)
    yb = MT + PH
    l(f'  <line x1="{x0:.2f}" y1="{MT}" x2="{x0:.2f}" y2="{yb}" stroke="{AXIS}" stroke-width="1.5"/>')
    l(f'  <line x1="{x0:.2f}" y1="{yb}" x2="{xn:.2f}" y2="{yb}" stroke="{AXIS}" stroke-width="1.5"/>')

    # x ticks + labels
    for xd in x_ticks:
        x = pxfn(xd)
        l(f'  <line x1="{x:.2f}" y1="{yb}" x2="{x:.2f}" y2="{yb+5}" stroke="{AXIS}" stroke-width="1.5"/>')
        l(f'  <text x="{x:.2f}" y="{yb+18}" text-anchor="middle" font-size="12" fill="{TEXT}" font-family="sans-serif">{xd}</text>')

    # x axis label
    xmid = pxfn(x_max / 2)
    l(f'  <text x="{xmid:.2f}" y="{yb+36}" text-anchor="middle" font-size="12" fill="{MUTED}" font-family="sans-serif">Days</text>')

    # panel title
    l(f'  <text x="{xmid:.2f}" y="{MT-18}" text-anchor="middle" font-size="13" font-weight="600" fill="{TEXT}" font-family="sans-serif">{label}</text>')

    # formula below title
    l(f'  <text x="{xmid:.2f}" y="{MT-5}" text-anchor="middle" font-size="11" fill="{MUTED}" font-family="sans-serif">{formula}</text>')

# ── left panel (conviction) ───────────────────────────────────────────────────
panel(x1, X1, [0, 30, 60, 90], TAU_CONV, BLUE, conv_pts,
      "Conviction Growth",
      "f(t) = 1 − exp(−t / 30)    τ = 216,000 blocks ≈ 30 days")

# ── right panel (unlock) ──────────────────────────────────────────────────────
panel(x2, X2, [0, 150, 300, 450], TAU_UNLOCK, ORANGE, unlock_pts,
      "Unlock Availability",
      "f(t) = 1 − exp(−t / τ)    ~90% available after ~365 days")

# ── shared y-axis label ───────────────────────────────────────────────────────
ymid = MT + PH / 2
l(f'  <text transform="rotate(-90,14,{ymid:.2f})" x="14" y="{ymid+4:.2f}" '
  f'text-anchor="middle" font-size="12" fill="{TEXT}" font-family="sans-serif">Fraction of maximum</text>')

# ── y ticks on left panel only ────────────────────────────────────────────────
for yf in [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]:
    y = yy(yf)
    l(f'  <line x1="{P1X-5}" y1="{y:.2f}" x2="{P1X}" y2="{y:.2f}" stroke="{AXIS}" stroke-width="1.5"/>')
    l(f'  <text x="{P1X-9}" y="{y+4:.2f}" text-anchor="end" font-size="11" fill="{TEXT}" font-family="sans-serif">{yf:.1f}</text>')

# ── y ticks on right panel ────────────────────────────────────────────────────
for yf in [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]:
    y = yy(yf)
    l(f'  <line x1="{P2X-5}" y1="{y:.2f}" x2="{P2X}" y2="{y:.2f}" stroke="{AXIS}" stroke-width="1.5"/>')
    l(f'  <text x="{P2X-9}" y="{y+4:.2f}" text-anchor="end" font-size="11" fill="{TEXT}" font-family="sans-serif">{yf:.1f}</text>')

l('</svg>')

out = os.path.join(os.path.dirname(__file__), "../static/img/conviction-panels.svg")
with open(out, "w") as f:
    f.write("\n".join(o))
print(f"Written: {os.path.abspath(out)}")
