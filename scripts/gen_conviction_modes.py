"""
Generate perpetual-mode.svg and decaying-mode.svg for conviction-staking docs.

Updated constants:
  MaturityRate (τ_m) = 43 days  (~311,622 blocks)  <- changed
  UnlockRate   (τ_u) = 130 days (~934,866 blocks)  <- unchanged
  half-life (MaturityRate) = 30 days (τ_m × ln2 ≈ 43 × 0.693)

  Since τ_m ≠ τ_u, the decaying mode conviction formula uses the
  closed-form integral (gamma formula):
    mass(t)       = m × exp(-t / τ_u)
    conviction(t) = m × γ(t)
    γ(t)          = τ_u × (exp(-t/τ_u) - exp(-t/τ_m)) / (τ_u - τ_m)
  peak at t* = ln(τ_u/τ_m) / (1/τ_m - 1/τ_u)

Output: ../static/img/docs/conviction/
"""
import math, os

TAU_M     = 43     # MaturityRate in days
TAU_U     = 130    # UnlockRate in days (unchanged)
HALF_LIFE = TAU_M * math.log(2)   # ~29.8 days ~= 30 days
TAU = TAU_M        # alias for perpetual mode (only MaturityRate matters there)

# τ symbol and subscript variants
SYM_TAU   = "\u03c4"           # τ
SYM_TAU_M = "\u03c4\u2098"     # τₘ
SYM_TAU_U = "\u03c4\u1d64"     # τᵤ

# -- shared layout -----------------------------------------------------------
W, H   = 720, 420
X0     = 65
YT     = 40
YB     = 350
PH     = YB - YT

def py(pct): return YB - (pct / 100) * PH

BLUE  = "#3B82F6"
RED   = "#EF4444"
AXIS  = "#374151"
GRID  = "#E5E7EB"
GREY  = "#9CA3AF"
TEXT  = "#374151"
MUTED = "#6B7280"
DARK  = "#1F2937"

def pts_to_str(pts):
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)

out_dir = os.path.join(os.path.dirname(__file__), "../static/img/docs/conviction")
os.makedirs(out_dir, exist_ok=True)


# ===========================================================================
# PERPETUAL MODE
# ===========================================================================

X_MAX_P = 450
PW_P    = 695 - X0

def px_p(day): return X0 + (day / X_MAX_P) * PW_P
def conv_p(t): return 100 * (1 - math.exp(-t / TAU))

N_P = 400
perp_pts = [(px_p(i * X_MAX_P / N_P), py(conv_p(i * X_MAX_P / N_P))) for i in range(N_P + 1)]

day_half = HALF_LIFE
day_tau  = TAU
day_90   = TAU * math.log(10)

x_tau_p  = px_p(day_tau)
x_half_p = px_p(day_half)
x_90_p   = px_p(day_90)
y_half_p = py(conv_p(day_half))
y_tau_p  = py(conv_p(day_tau))
y_90_p   = py(conv_p(day_90))

perp_xticks = [0, 90, 180, 270, 360, 450]

lines_p = []
def lp(s): lines_p.append(s)

lp(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="system-ui, sans-serif">')
lp(f'  <rect width="{W}" height="{H}" fill="white"/>')

lp(f'  <text x="392" y="22" text-anchor="middle" font-size="14" font-weight="600" fill="{DARK}">Perpetual Mode: Locked Mass and Conviction Over Time</text>')
lp(f'  <text x="392" y="38" text-anchor="middle" font-size="11" fill="{MUTED}">(Full stake locked immediately at t=0)</text>')

for pct in [0, 25, 50, 75, 100]:
    y = py(pct)
    lp(f'  <line x1="{X0}" y1="{y:.1f}" x2="695" y2="{y:.1f}" stroke="{GRID}" stroke-width="1"/>')

for d in perp_xticks:
    x = px_p(d)
    lp(f'  <line x1="{x:.1f}" y1="{YT}" x2="{x:.1f}" y2="{YB}" stroke="{GRID}" stroke-width="1"/>')

lp(f'  <line x1="{x_tau_p:.1f}" y1="{YT}" x2="{x_tau_p:.1f}" y2="{YB}" stroke="{GREY}" stroke-width="1" stroke-dasharray="5,3"/>')
lp(f'  <line x1="{X0}" y1="{YT}" x2="695" y2="{YT}" stroke="{BLUE}" stroke-width="2.5"/>')
lp(f'  <polyline points="{pts_to_str(perp_pts)}" fill="none" stroke="{RED}" stroke-width="2.5"/>')

lp(f'  <circle cx="{x_half_p:.1f}" cy="{y_half_p:.1f}" r="4" fill="{RED}"/>')
lp(f'  <circle cx="{x_tau_p:.1f}" cy="{y_tau_p:.1f}" r="4" fill="{RED}"/>')
lp(f'  <circle cx="{x_90_p:.1f}" cy="{y_90_p:.1f}" r="4" fill="{RED}"/>')

lp(f'  <text x="{x_tau_p + 3:.1f}" y="52" font-size="11" fill="{MUTED}">{SYM_TAU} \u2248 {TAU} days</text>')

hl_d = round(day_half)
lp(f'  <rect x="{x_half_p - 39:.1f}" y="{y_half_p + 5:.1f}" width="84" height="16" rx="3" fill="white" fill-opacity="0.9" stroke="{GRID}"/>')
lp(f'  <text x="{x_half_p + 3:.1f}" y="{y_half_p + 17:.1f}" text-anchor="middle" font-size="10" fill="{RED}">50% at day {hl_d}</text>')

lp(f'  <rect x="{x_tau_p + 4:.1f}" y="{y_tau_p - 14:.1f}" width="110" height="16" rx="3" fill="white" fill-opacity="0.9" stroke="{GRID}"/>')
lp(f'  <text x="{x_tau_p + 59:.1f}" y="{y_tau_p - 2:.1f}" text-anchor="middle" font-size="10" fill="{RED}">63.2% (= 1 \u2212 1/e) at {SYM_TAU}</text>')

day_90_r = round(day_90)
lp(f'  <rect x="{x_90_p - 48:.1f}" y="{y_90_p - 14:.1f}" width="96" height="16" rx="3" fill="white" fill-opacity="0.9" stroke="{GRID}"/>')
lp(f'  <text x="{x_90_p:.1f}" y="{y_90_p - 2:.1f}" text-anchor="middle" font-size="10" fill="{RED}">~90% at day {day_90_r}</text>')

lp(f'  <line x1="{X0}" y1="{YB}" x2="695" y2="{YB}" stroke="{AXIS}" stroke-width="1.5"/>')
lp(f'  <line x1="{X0}" y1="{YT}" x2="{X0}" y2="{YB + 5}" stroke="{AXIS}" stroke-width="1.5"/>')

for d in perp_xticks:
    x = px_p(d)
    lp(f'  <text x="{x:.1f}" y="368" text-anchor="middle" font-size="11" fill="{MUTED}">{d}</text>')

hl_r = round(HALF_LIFE)
lp(f'  <text x="380" y="385" text-anchor="middle" font-size="12" fill="{TEXT}">Days (MaturityRate {SYM_TAU} \u2248 {TAU} days; half-life = {hl_r} days)</text>')

for pct, label in [(0, "0%"), (25, "25%"), (50, "50%"), (75, "75%"), (100, "100%")]:
    y = py(pct)
    lp(f'  <text x="58" y="{y + 4:.1f}" text-anchor="end" font-size="11" fill="{MUTED}">{label}</text>')

lp(f'  <text transform="rotate(-90)" x="-200" y="14" text-anchor="middle" font-size="12" fill="{TEXT}">% of Original Locked Mass</text>')

lp(f'  <line x1="430" y1="405" x2="456" y2="405" stroke="{BLUE}" stroke-width="2.5"/>')
lp(f'  <text x="460" y="409" font-size="11" fill="{TEXT}">Locked mass (constant)</text>')
lp(f'  <line x1="596" y1="405" x2="622" y2="405" stroke="{RED}" stroke-width="2.5"/>')
lp(f'  <text x="626" y="409" font-size="11" fill="{TEXT}">Conviction</text>')

lp('</svg>')

out_p = os.path.join(out_dir, "perpetual-mode.svg")
with open(out_p, "w") as f:
    f.write("\n".join(lines_p))
print(f"Written: {os.path.abspath(out_p)}")


# ===========================================================================
# DECAYING MODE
# ===========================================================================

X_MAX_D = 540
PW_D    = 695 - X0

def px_d(day): return X0 + (day / X_MAX_D) * PW_D

def mass_d(t):
    return 100 * math.exp(-t / TAU_U)

def conv_d(t):
    if t == 0:
        return 0
    gamma = TAU_U * (math.exp(-t / TAU_U) - math.exp(-t / TAU_M)) / (TAU_U - TAU_M)
    return 100 * gamma

t_peak = math.log(TAU_U / TAU_M) / (1/TAU_M - 1/TAU_U)
peak_conv_pct = conv_d(t_peak)

N_D = 400
mass_pts   = [(px_d(i * X_MAX_D / N_D), py(mass_d(i * X_MAX_D / N_D))) for i in range(N_D + 1)]
conv_pts_d = [(px_d(i * X_MAX_D / N_D), py(conv_d(i * X_MAX_D / N_D))) for i in range(N_D + 1)]

x_tau_m_d = px_d(TAU_M)
x_tau_u_d = px_d(TAU_U)
x_peak_d  = px_d(t_peak)
y_peak_d  = py(peak_conv_pct)

decay_xticks = [0, 90, 180, 270, 360, 450, 540]

lines_d = []
def ld(s): lines_d.append(s)

ld(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="system-ui, sans-serif">')
ld(f'  <rect width="{W}" height="{H}" fill="white"/>')

ld(f'  <text x="392" y="22" text-anchor="middle" font-size="14" font-weight="600" fill="{DARK}">Decaying Mode: Locked Mass and Conviction Over Time</text>')

for pct in [0, 25, 50, 75, 100]:
    y = py(pct)
    ld(f'  <line x1="{X0}" y1="{y:.1f}" x2="695" y2="{y:.1f}" stroke="{GRID}" stroke-width="1"/>')

for d in decay_xticks:
    x = px_d(d)
    ld(f'  <line x1="{x:.1f}" y1="{YT}" x2="{x:.1f}" y2="{YB}" stroke="{GRID}" stroke-width="1"/>')

# τₘ reference line (MaturityRate)
ld(f'  <line x1="{x_tau_m_d:.1f}" y1="{YT}" x2="{x_tau_m_d:.1f}" y2="{YB}" stroke="{GREY}" stroke-width="1" stroke-dasharray="5,3"/>')
# τᵤ reference line (UnlockRate)
ld(f'  <line x1="{x_tau_u_d:.1f}" y1="{YT}" x2="{x_tau_u_d:.1f}" y2="{YB}" stroke="{GREY}" stroke-width="1" stroke-dasharray="2,3"/>')

ld(f'  <polyline points="{pts_to_str(mass_pts)}" fill="none" stroke="{BLUE}" stroke-width="2.5"/>')
ld(f'  <polyline points="{pts_to_str(conv_pts_d)}" fill="none" stroke="{RED}" stroke-width="2.5"/>')
ld(f'  <circle cx="{x_peak_d:.1f}" cy="{y_peak_d:.1f}" r="4" fill="{RED}"/>')

ld(f'  <text x="{x_tau_m_d + 3:.1f}" y="38" font-size="11" fill="{MUTED}">{SYM_TAU_M} \u2248 {TAU_M}d</text>')
ld(f'  <text x="{x_tau_u_d + 3:.1f}" y="38" font-size="11" fill="{MUTED}">{SYM_TAU_U} \u2248 {TAU_U}d</text>')

peak_r   = round(peak_conv_pct, 1)
t_peak_r = round(t_peak)
ld(f'  <rect x="{x_peak_d + 8:.1f}" y="{y_peak_d - 14:.1f}" width="152" height="28" rx="3" fill="white" fill-opacity="0.9" stroke="{GRID}"/>')
ld(f'  <text x="{x_peak_d + 84:.1f}" y="{y_peak_d - 2:.1f}" text-anchor="middle" font-size="10" fill="{RED}">Conviction peak \u2248 {peak_r}% at day {t_peak_r}</text>')
ld(f'  <text x="{x_peak_d + 84:.1f}" y="{y_peak_d + 10:.1f}" text-anchor="middle" font-size="10" fill="{MUTED}">({SYM_TAU_M} \u2260 {SYM_TAU_U}: peak shifts right of {SYM_TAU_M})</text>')

ld(f'  <line x1="{X0}" y1="{YB}" x2="695" y2="{YB}" stroke="{AXIS}" stroke-width="1.5"/>')
ld(f'  <line x1="{X0}" y1="{YT}" x2="{X0}" y2="{YB + 5}" stroke="{AXIS}" stroke-width="1.5"/>')

for d in decay_xticks:
    x = px_d(d)
    ld(f'  <text x="{x:.1f}" y="368" text-anchor="middle" font-size="11" fill="{MUTED}">{d}</text>')

ld(f'  <text x="380" y="385" text-anchor="middle" font-size="12" fill="{TEXT}">Days (MaturityRate {SYM_TAU_M} \u2248 {TAU_M} days; UnlockRate {SYM_TAU_U} \u2248 {TAU_U} days)</text>')

for pct, label in [(0, "0%"), (25, "25%"), (50, "50%"), (75, "75%"), (100, "100%")]:
    y = py(pct)
    ld(f'  <text x="58" y="{y + 4:.1f}" text-anchor="end" font-size="11" fill="{MUTED}">{label}</text>')

ld(f'  <text transform="rotate(-90)" x="-195" y="14" text-anchor="middle" font-size="12" fill="{TEXT}">% of Original Locked Mass</text>')

ld(f'  <line x1="430" y1="405" x2="456" y2="405" stroke="{BLUE}" stroke-width="2.5"/>')
ld(f'  <text x="460" y="409" font-size="11" fill="{TEXT}">Locked mass</text>')
ld(f'  <line x1="548" y1="405" x2="574" y2="405" stroke="{RED}" stroke-width="2.5"/>')
ld(f'  <text x="578" y="409" font-size="11" fill="{TEXT}">Conviction</text>')

ld('</svg>')

out_d = os.path.join(out_dir, "decaying-mode.svg")
with open(out_d, "w") as f:
    f.write("\n".join(lines_d))
print(f"Written: {os.path.abspath(out_d)}")