"""
Generate conviction-lifecycle.svg — a single sequential timeline showing:

  Scenario: lock 100α at day 0, call unlock_stake(50α) at day 90.

  Phase 1 (day 0-90):
    - Conviction grows from 0 toward 100α ceiling: c(t) = 100·(1−exp(−t/90))
    - At day 90, conviction ≈ 63.2α

  Unlock event (day 90):
    - locked_mass: 100 → 50
    - conviction:  63.2 → 13.2  (drops by 50, the unlocked amount)
    - unlocked_mass: 0 → 50  (enters 30-day decay period)

  Phase 2 (day 90-300):
    - Conviction rebuilds from 13.2 toward new ceiling 50:
        c(t) = 50 − (50−13.2)·exp(−(t−90)/90)
    - Unlocked α becomes available:
        available(t) = 50·(1−exp(−(t−90)/30))

Output: ../static/img/conviction-lifecycle.svg
"""
import math, os

# ── scenario constants ────────────────────────────────────────────────────────
LOCK_AMOUNT   = 100    # initial lock
UNLOCK_AMOUNT = 50     # amount unlocked at UNLOCK_DAY
UNLOCK_DAY    = 90
TAU_CONV      = 90     # conviction τ (days)
TAU_UNLOCK    = 30     # unlock τ (days)
X_MAX         = 300

c_at_unlock   = LOCK_AMOUNT * (1 - math.exp(-UNLOCK_DAY / TAU_CONV))  # ≈ 63.2
c_after_unlock = c_at_unlock - UNLOCK_AMOUNT                            # ≈ 13.2
locked_after  = LOCK_AMOUNT - UNLOCK_AMOUNT                             # = 50

def conviction(t):
    if t <= UNLOCK_DAY:
        return LOCK_AMOUNT * (1 - math.exp(-t / TAU_CONV))
    else:
        dt = t - UNLOCK_DAY
        return locked_after - (locked_after - c_after_unlock) * math.exp(-dt / TAU_CONV)

def unlock_avail(t):
    if t < UNLOCK_DAY:
        return 0
    dt = t - UNLOCK_DAY
    return UNLOCK_AMOUNT * (1 - math.exp(-dt / TAU_UNLOCK))

# ── layout ───────────────────────────────────────────────────────────────────
W, H   = 720, 400
MT, MB = 52, 60
ML, MR = 65, 28
PW     = W - ML - MR   # 627
PH     = H - MT - MB   # 288
Y_MAX  = 110            # a bit above 100 for headroom

def px(day):  return ML + (day / X_MAX) * PW
def py(alpha): return MT + PH * (1 - alpha / Y_MAX)

N = 800
conv_pts   = [(t, conviction(t))   for t in (i * X_MAX / N for i in range(N + 1))]
unlock_pts = [(t, unlock_avail(t)) for t in (i * X_MAX / N for i in range(N + 1))]

def polyline(pts):
    return " ".join(f"{px(x):.2f},{py(y):.2f}" for x, y in pts)

BLUE   = "#3b82f6"
ORANGE = "#f97316"
AXIS   = "#374151"
GRID   = "#e5e7eb"
TEXT   = "#111827"
MUTED  = "#6b7280"
RED    = "#ef4444"

o = []
def l(s): o.append(s)

l(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
l(f'  <rect width="{W}" height="{H}" fill="white"/>')

# ── phase background shading ──────────────────────────────────────────────────
x_unlock = px(UNLOCK_DAY)
l(f'  <rect x="{ML}" y="{MT}" width="{x_unlock-ML:.2f}" height="{PH}" fill="#eff6ff" opacity="0.5"/>')  # blue tint
l(f'  <rect x="{x_unlock:.2f}" y="{MT}" width="{ML+PW-x_unlock:.2f}" height="{PH}" fill="#fff7ed" opacity="0.5"/>')  # orange tint

# ── grid ──────────────────────────────────────────────────────────────────────
for alpha in [25, 50, 75, 100]:
    y = py(alpha)
    l(f'  <line x1="{ML}" y1="{y:.2f}" x2="{ML+PW}" y2="{y:.2f}" stroke="{GRID}" stroke-width="1"/>')
for xd in range(0, X_MAX + 1, 30):
    x = px(xd)
    l(f'  <line x1="{x:.2f}" y1="{MT}" x2="{x:.2f}" y2="{MT+PH}" stroke="{GRID}" stroke-width="1"/>')

# ── locked mass ceiling lines (dashed) ───────────────────────────────────────
# Phase 1: ceiling at 100
y100 = py(LOCK_AMOUNT)
l(f'  <line x1="{ML}" y1="{y100:.2f}" x2="{x_unlock:.2f}" y2="{y100:.2f}" '
  f'stroke="{BLUE}" stroke-width="1" stroke-dasharray="5,4" opacity="0.5"/>')
l(f'  <text x="{ML+4}" y="{y100-5:.2f}" font-size="10" fill="{BLUE}" font-family="sans-serif" opacity="0.8">lock ceiling 100α</text>')

# Phase 2: ceiling at 50
y50 = py(locked_after)
l(f'  <line x1="{x_unlock:.2f}" y1="{y50:.2f}" x2="{ML+PW}" y2="{y50:.2f}" '
  f'stroke="{BLUE}" stroke-width="1" stroke-dasharray="5,4" opacity="0.5"/>')
l(f'  <text x="{x_unlock+4}" y="{y50-5:.2f}" font-size="10" fill="{BLUE}" font-family="sans-serif" opacity="0.8">lock ceiling 50α</text>')

# ── unlock event vertical line ────────────────────────────────────────────────
l(f'  <line x1="{x_unlock:.2f}" y1="{MT}" x2="{x_unlock:.2f}" y2="{MT+PH}" '
  f'stroke="{AXIS}" stroke-width="1.5" stroke-dasharray="6,4"/>')

# event label
l(f'  <text x="{x_unlock+5}" y="{MT+18}" font-size="11" font-weight="600" fill="{AXIS}" font-family="sans-serif">unlock_stake(50α)</text>')
l(f'  <text x="{x_unlock+5}" y="{MT+31}" font-size="10" fill="{MUTED}" font-family="sans-serif">day {UNLOCK_DAY}</text>')

# ── conviction drop annotation ────────────────────────────────────────────────
# Arrow from pre-unlock conviction to post-unlock conviction at the unlock day
y_pre  = py(c_at_unlock)
y_post = py(c_after_unlock)
l(f'  <line x1="{x_unlock:.2f}" y1="{y_pre:.2f}" x2="{x_unlock:.2f}" y2="{y_post:.2f}" '
  f'stroke="{RED}" stroke-width="1.5" marker-end="url(#arrow)"/>')

# ── arrow marker def ──────────────────────────────────────────────────────────
l(f'  <defs>')
l(f'    <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">')
l(f'      <path d="M0,0 L8,4 L0,8 Z" fill="{RED}"/>')
l(f'    </marker>')
l(f'  </defs>')

# conviction drop label
x_lbl = x_unlock - 85
l(f'  <text x="{x_lbl:.2f}" y="{(y_pre+y_post)/2+4:.2f}" text-anchor="middle" '
  f'font-size="10" fill="{RED}" font-family="sans-serif">−50α conviction</text>')

# ── curves ────────────────────────────────────────────────────────────────────
# draw orange first so blue sits on top
l(f'  <polyline points="{polyline(unlock_pts)}" fill="none" stroke="{ORANGE}" stroke-width="2.5" stroke-linejoin="round"/>')
l(f'  <polyline points="{polyline(conv_pts)}"   fill="none" stroke="{BLUE}"   stroke-width="2.5" stroke-linejoin="round"/>')

# ── axes ──────────────────────────────────────────────────────────────────────
yb = MT + PH
l(f'  <line x1="{ML}" y1="{MT}" x2="{ML}" y2="{yb}" stroke="{AXIS}" stroke-width="1.5"/>')
l(f'  <line x1="{ML}" y1="{yb}" x2="{ML+PW}" y2="{yb}" stroke="{AXIS}" stroke-width="1.5"/>')

# x ticks + labels
for xd in range(0, X_MAX + 1, 30):
    x = px(xd)
    l(f'  <line x1="{x:.2f}" y1="{yb}" x2="{x:.2f}" y2="{yb+5}" stroke="{AXIS}" stroke-width="1.5"/>')
    l(f'  <text x="{x:.2f}" y="{yb+18}" text-anchor="middle" font-size="12" fill="{TEXT}" font-family="sans-serif">{xd}</text>')

# y ticks + labels
for alpha in [0, 25, 50, 75, 100]:
    y = py(alpha)
    l(f'  <line x1="{ML-5}" y1="{y:.2f}" x2="{ML}" y2="{y:.2f}" stroke="{AXIS}" stroke-width="1.5"/>')
    l(f'  <text x="{ML-9}" y="{y+4:.2f}" text-anchor="end" font-size="12" fill="{TEXT}" font-family="sans-serif">{alpha}</text>')

# axis titles
xmid = ML + PW / 2
l(f'  <text x="{xmid:.2f}" y="{H-8}" text-anchor="middle" font-size="13" fill="{TEXT}" font-family="sans-serif">Days</text>')
ymid = MT + PH / 2
l(f'  <text transform="rotate(-90,14,{ymid:.2f})" x="14" y="{ymid+4:.2f}" '
  f'text-anchor="middle" font-size="13" fill="{TEXT}" font-family="sans-serif">Alpha (α)</text>')

# chart title
l(f'  <text x="{xmid:.2f}" y="22" text-anchor="middle" font-size="14" font-weight="600" fill="{TEXT}" font-family="sans-serif">Conviction Lifecycle: Lock then Unlock</text>')
l(f'  <text x="{xmid:.2f}" y="37" text-anchor="middle" font-size="11" fill="{MUTED}" font-family="sans-serif">Scenario: lock 100α at day 0, call unlock_stake(50α) at day 90</text>')

# ── phase labels ──────────────────────────────────────────────────────────────
x_p1_mid = px(UNLOCK_DAY / 2)
x_p2_mid = px(UNLOCK_DAY + (X_MAX - UNLOCK_DAY) / 2)
l(f'  <text x="{x_p1_mid:.2f}" y="{MT+PH-10}" text-anchor="middle" font-size="11" fill="{BLUE}" font-family="sans-serif" opacity="0.8">Phase 1 — conviction builds</text>')
l(f'  <text x="{x_p2_mid:.2f}" y="{MT+PH-10}" text-anchor="middle" font-size="11" fill="{ORANGE}" font-family="sans-serif" opacity="0.8">Phase 2 — unlock period + conviction rebuilds</text>')

# ── legend ────────────────────────────────────────────────────────────────────
lx, ly = ML + PW - 205, MT + PH - 90
l(f'  <rect x="{lx-8}" y="{ly-13}" width="210" height="72" rx="4" fill="white" stroke="{GRID}" stroke-width="1"/>')
l(f'  <line x1="{lx}" y1="{ly+2}" x2="{lx+22}" y2="{ly+2}" stroke="{BLUE}" stroke-width="2.5"/>')
l(f'  <text x="{lx+27}" y="{ly+6}" font-size="12" fill="{TEXT}" font-family="sans-serif">Conviction score</text>')
l(f'  <line x1="{lx}" y1="{ly+32}" x2="{lx+22}" y2="{ly+32}" stroke="{ORANGE}" stroke-width="2.5"/>')
l(f'  <text x="{lx+27}" y="{ly+36}" font-size="12" fill="{TEXT}" font-family="sans-serif">Unlocked α available to withdraw</text>')
l(f'  <line x1="{lx}" y1="{ly+52}" x2="{lx+22}" y2="{ly+52}" stroke="{BLUE}" stroke-width="1" stroke-dasharray="5,4" opacity="0.6"/>')
l(f'  <text x="{lx+27}" y="{ly+56}" font-size="12" fill="{TEXT}" font-family="sans-serif">Lock ceiling (max conviction)</text>')

l('</svg>')

out = os.path.join(os.path.dirname(__file__), "../static/img/conviction-lifecycle.svg")
with open(out, "w") as f:
    f.write("\n".join(o))
print(f"Written: {os.path.abspath(out)}")
