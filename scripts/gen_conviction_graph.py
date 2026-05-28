"""
Generate conviction-curve.svg for the conviction staking docs page.

Two curves, both normalized to fraction of maximum (0→1):
  - Conviction growth:   f(t) = 1 - exp(-t / 30)   τ = 216,000 blocks ≈ 30 days  (90% at ~70 days)
  - Unlock availability: f(t) = 1 - exp(-t / τ)    τ ≈ 158 days                   (90% at ~365 days)

Output: ../static/img/conviction-curve.svg
"""
import math
import os

TAU_CONV   = 30                        # conviction τ (days)
TAU_UNLOCK = 365 / math.log(10)        # unlock τ (days) — 90% at 365 days ≈ 158.5 days

# ── layout ──────────────────────────────────────────────────────────────────
W, H = 720, 400
ML, MR, MT, MB = 65, 30, 45, 55   # margins
PW = W - ML - MR                   # plot width  = 625
PH = H - MT - MB                   # plot height = 300

X_MAX = 400   # days on x-axis
Y_MAX = 1.0

def px(day):
    return ML + (day / X_MAX) * PW

def py(frac):
    return MT + PH - (frac / Y_MAX) * PH

# ── curves ───────────────────────────────────────────────────────────────────
N = 800

def conviction(t):
    return 1 - math.exp(-t / TAU_CONV)

def unlock_access(t):
    return 1 - math.exp(-t / TAU_UNLOCK)

pts_conv   = [(i * X_MAX / N, conviction(i * X_MAX / N))   for i in range(N + 1)]
pts_unlock = [(i * X_MAX / N, unlock_access(i * X_MAX / N)) for i in range(N + 1)]

def polyline(pts):
    return " ".join(f"{px(x):.2f},{py(y):.2f}" for x, y in pts)

# ── colours ──────────────────────────────────────────────────────────────────
BLUE   = "#3b82f6"
ORANGE = "#f97316"
AXIS   = "#374151"
GRID   = "#e5e7eb"
TEXT   = "#111827"
MUTED  = "#6b7280"

# ── build ────────────────────────────────────────────────────────────────────
o = []

def l(s):
    o.append(s)

l(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
l(f'  <rect width="{W}" height="{H}" fill="white"/>')

# grid
for yf in [0.2, 0.4, 0.6, 0.8, 1.0]:
    y = py(yf)
    l(f'  <line x1="{ML}" y1="{y:.2f}" x2="{ML+PW}" y2="{y:.2f}" stroke="{GRID}" stroke-width="1"/>')
for xd in range(0, X_MAX + 1, 50):
    x = px(xd)
    l(f'  <line x1="{x:.2f}" y1="{MT}" x2="{x:.2f}" y2="{MT+PH}" stroke="{GRID}" stroke-width="1"/>')

# reference line at 1 - 1/e ≈ 63.2%  (one time-constant level)
y63 = py(1 - 1/math.e)
l(f'  <line x1="{ML}" y1="{y63:.2f}" x2="{ML+PW}" y2="{y63:.2f}" '
  f'stroke="#9ca3af" stroke-width="1" stroke-dasharray="5,4"/>')
l(f'  <text x="{ML+4}" y="{y63-5:.2f}" font-size="11" fill="{MUTED}" font-family="sans-serif">63.2% (one τ)</text>')

# reference verticals at each τ
for xd, col in [(TAU_CONV, BLUE), (TAU_UNLOCK, ORANGE)]:
    x = px(xd)
    l(f'  <line x1="{x:.2f}" y1="{MT}" x2="{x:.2f}" y2="{MT+PH}" '
      f'stroke="{col}" stroke-width="1" stroke-dasharray="4,4" opacity="0.45"/>')

# curves (unlock on top so it's not hidden by conviction)
l(f'  <polyline points="{polyline(pts_unlock)}" fill="none" stroke="{ORANGE}" stroke-width="2.5" stroke-linejoin="round"/>')
l(f'  <polyline points="{polyline(pts_conv)}"   fill="none" stroke="{BLUE}"   stroke-width="2.5" stroke-linejoin="round"/>')

# dots at the τ crossing points
dot_r = 4
for (xd, func, col) in [(TAU_CONV, conviction, BLUE), (TAU_UNLOCK, unlock_access, ORANGE)]:
    x, y = px(xd), py(func(xd))
    l(f'  <circle cx="{x:.2f}" cy="{y:.2f}" r="{dot_r}" fill="{col}" stroke="white" stroke-width="1.5"/>')

# axes
l(f'  <line x1="{ML}" y1="{MT}" x2="{ML}" y2="{MT+PH}" stroke="{AXIS}" stroke-width="1.5"/>')
l(f'  <line x1="{ML}" y1="{MT+PH}" x2="{ML+PW}" y2="{MT+PH}" stroke="{AXIS}" stroke-width="1.5"/>')

# x ticks + labels
for xd in range(0, X_MAX + 1, 50):
    x  = px(xd)
    yb = MT + PH
    l(f'  <line x1="{x:.2f}" y1="{yb}" x2="{x:.2f}" y2="{yb+5}" stroke="{AXIS}" stroke-width="1.5"/>')
    l(f'  <text x="{x:.2f}" y="{yb+19}" text-anchor="middle" font-size="12" fill="{TEXT}" font-family="sans-serif">{xd}</text>')

# y ticks + labels
for yf in [0, 0.2, 0.4, 0.6, 0.8, 1.0]:
    y = py(yf)
    l(f'  <line x1="{ML-5}" y1="{y:.2f}" x2="{ML}" y2="{y:.2f}" stroke="{AXIS}" stroke-width="1.5"/>')
    l(f'  <text x="{ML-9}" y="{y+4:.2f}" text-anchor="end" font-size="12" fill="{TEXT}" font-family="sans-serif">{yf:.1f}</text>')

# axis titles
l(f'  <text x="{ML + PW/2:.2f}" y="{H-8}" text-anchor="middle" font-size="13" fill="{TEXT}" font-family="sans-serif">Days since lock / unlock event</text>')
l(f'  <text transform="rotate(-90,16,{MT + PH/2:.2f})" x="16" y="{MT + PH/2 + 4:.2f}" '
  f'text-anchor="middle" font-size="13" fill="{TEXT}" font-family="sans-serif">Fraction of maximum</text>')

# chart title
l(f'  <text x="{ML + PW/2:.2f}" y="22" text-anchor="middle" font-size="14" font-weight="600" fill="{TEXT}" font-family="sans-serif">Conviction Growth &amp; Unlock Availability</text>')

# legend (top-right inside plot)
lx = ML + PW - 210
ly = MT + 18

l(f'  <rect x="{lx-10}" y="{ly-14}" width="215" height="76" rx="4" fill="white" stroke="{GRID}" stroke-width="1"/>')

l(f'  <line x1="{lx}" y1="{ly+3}" x2="{lx+22}" y2="{ly+3}" stroke="{BLUE}" stroke-width="2.5"/>')
l(f'  <circle cx="{lx+11}" cy="{ly+3}" r="3.5" fill="{BLUE}" stroke="white" stroke-width="1.5"/>')
l(f'  <text x="{lx+28}" y="{ly+7}" font-size="12" fill="{TEXT}" font-family="sans-serif">Conviction growth</text>')
l(f'  <text x="{lx+28}" y="{ly+21}" font-size="11" fill="{MUTED}" font-family="sans-serif">τ = 216,000 blocks (≈ 30 days)</text>')

l(f'  <line x1="{lx}" y1="{ly+40}" x2="{lx+22}" y2="{ly+40}" stroke="{ORANGE}" stroke-width="2.5"/>')
l(f'  <circle cx="{lx+11}" cy="{ly+40}" r="3.5" fill="{ORANGE}" stroke="white" stroke-width="1.5"/>')
l(f'  <text x="{lx+28}" y="{ly+44}" font-size="12" fill="{TEXT}" font-family="sans-serif">Unlock availability</text>')
l(f'  <text x="{lx+28}" y="{ly+58}" font-size="11" fill="{MUTED}" font-family="sans-serif">~90% available after ~365 days</text>')

l('</svg>')

# ── write ─────────────────────────────────────────────────────────────────────
out = os.path.join(os.path.dirname(__file__), "../static/img/conviction-curve.svg")
with open(out, "w") as f:
    f.write("\n".join(o))

print(f"Written: {os.path.abspath(out)}")
