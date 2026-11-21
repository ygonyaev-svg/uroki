"""Запасные фоны тем (свои рисунки): tools/looks/bg.py → svg; растр делает bg_render.js."""
import random, os
R = random.Random(21); W, H = 900, 1350
out = os.path.dirname(os.path.abspath(__file__))
def svg(body, defs=''): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><defs>{defs}</defs>{body}</svg>'

# --- супергерои: город в сумерках ---
d = '<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121634"/><stop offset=".45" stop-color="#3A2C6C"/><stop offset=".75" stop-color="#C0567A"/><stop offset="1" stop-color="#F59A4E"/></linearGradient><radialGradient id="m"><stop offset="0" stop-color="#FFF4C8"/><stop offset=".5" stop-color="#FFE9A0" stop-opacity=".25"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient><linearGradient id="beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFF6C9" stop-opacity=".35"/><stop offset="1" stop-color="#FFF6C9" stop-opacity="0"/></linearGradient>'
b = [f'<rect width="{W}" height="{H}" fill="url(#s)"/>']
for i in range(140): b.append(f'<circle cx="{R.uniform(0,W):.0f}" cy="{R.uniform(0,520):.0f}" r="{R.choice([1,1,1.5,2])}" fill="#fff" opacity="{R.uniform(.3,.9):.2f}"/>')
b.append('<circle cx="690" cy="210" r="170" fill="url(#m)"/><circle cx="690" cy="210" r="58" fill="#FFF1C2"/>')
b.append('<path d="M300 1350L120 380l90 -6z" fill="url(#beam)"/><path d="M640 1350L800 420l60 18z" fill="url(#beam)"/>')
def city(y0, col, hmin, hmax, win, seed):
    r = random.Random(seed); x = -20; g = []
    while x < W + 20:
        w = r.randint(50, 120); h = r.randint(hmin, hmax); top = y0 - h
        g.append(f'<rect x="{x}" y="{top}" width="{w}" height="{H-top}" fill="{col}"/>')
        if r.random() < .3: g.append(f'<rect x="{x+w/2-3}" y="{top-40}" width="6" height="40" fill="{col}"/>')
        if r.random() < .25: g.append(f'<polygon points="{x},{top} {x+w/2},{top-50} {x+w},{top}" fill="{col}"/>')
        if win:
            for wy in range(top + 18, H, 34):
                for wx in range(x + 10, x + w - 14, 22):
                    if r.random() < win: g.append(f'<rect x="{wx}" y="{wy}" width="9" height="14" rx="1" fill="#FFD36B" opacity="{r.uniform(.55,1):.2f}"/>')
        x += w + r.randint(0, 8)
    return ''.join(g)
b.append(city(960, '#2A2456', 120, 330, 0, 1)); b.append(city(1080, '#1B1940', 100, 300, .22, 2)); b.append(city(1230, '#0F0E26', 60, 200, .16, 3))
b.append('<rect y="1230" width="900" height="120" fill="#0B0A1C"/>')
# фигура героя на крыше (силуэт с плащом)
b.append('<g transform="translate(450,1150)" fill="#0B0A1C"><path d="M-18 -60c-10 30-40 70-70 82 40 6 70-8 88-30 18 22 48 36 88 30-30-12-60-52-70-82z" fill="#B3263A"/><rect x="-16" y="-62" width="32" height="64" rx="10"/><circle cy="-80" r="17"/><rect x="-15" y="0" width="12" height="80"/><rect x="3" y="0" width="12" height="80"/></g>')
open(os.path.join(out, 'bg-hero.svg'), 'w').write(svg(''.join(b), d))

# --- кубический мир ---
b = ['<rect width="900" height="1350" fill="#7CC8F2"/><rect y="0" width="900" height="260" fill="#5BB3EA"/><rect y="260" width="900" height="200" fill="#6CBDEE"/>',
     '<rect x="660" y="120" width="110" height="110" fill="#FFE57A"/><rect x="680" y="140" width="70" height="70" fill="#FFF3B0"/>']
for (cx, cy, n) in [(80, 180, 7), (360, 120, 9), (520, 330, 6)]:
    for k in range(n): b.append(f'<rect x="{cx+k*30}" y="{cy+(0 if 1<k<n-2 else 15)}" width="30" height="{30 if 1<k<n-2 else 15}" fill="#fff" opacity=".95"/>')
S = 45
def hills(base, amp, col, top, seed):
    r = random.Random(seed); g = []; h = base
    for i in range(0, W // S + 1):
        h = max(base - amp, min(base + amp, h + r.choice([-S, 0, 0, S])))
        g.append(f'<rect x="{i*S}" y="{h}" width="{S}" height="{H-h}" fill="{col}"/><rect x="{i*S}" y="{h}" width="{S}" height="{S//3}" fill="{top}"/>')
    return ''.join(g)
b.append(hills(720, 135, '#5B8F3A', '#79B850', 4)); b.append(hills(900, 90, '#8B5A2B', '#5DA130', 5))
for (tx, ty) in [(90, 760), (630, 720), (780, 780)]:
    b.append(f'<rect x="{tx+S}" y="{ty}" width="{S}" height="{S*3}" fill="#6B4320"/><rect x="{tx}" y="{ty-S*3}" width="{S*3}" height="{S*3}" fill="#3F8F2E"/><rect x="{tx+S}" y="{ty-S*4}" width="{S}" height="{S}" fill="#3F8F2E"/><rect x="{tx+15}" y="{ty-S*3+15}" width="20" height="20" fill="#5DB043"/>')
b.append('<rect x="405" y="560" width="90" height="560" fill="#4FA8E8"/>' + ''.join(f'<rect x="{405+R.randint(0,3)*22}" y="{560+i*40}" width="22" height="18" fill="#9AD6FA"/>' for i in range(14)))
b.append('<rect y="1110" width="900" height="240" fill="#8B5A2B"/>' + ''.join(f'<rect x="{x*S}" y="{1110+y*S}" width="{S}" height="{S}" fill="{R.choice(["#7A4E24","#946232","#8B5A2B","#8B5A2B"])}" stroke="#6E4520" stroke-width="2"/>' for x in range(21) for y in range(6)))
b.append('<rect y="1110" width="900" height="16" fill="#5DA130"/>')
for (x, y, c) in [(180, 1200, '#7FE3F4'), (630, 1250, '#7FE3F4'), (360, 1290, '#F2C14E')]:
    b.append(f'<rect x="{x}" y="{y}" width="14" height="14" fill="{c}"/><rect x="{x+20}" y="{y+10}" width="10" height="10" fill="{c}"/>')
open(os.path.join(out, 'bg-cube.svg'), 'w').write(svg(''.join(b)))

# --- принцессы ---
d = '<linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C4DA"/><stop offset=".45" stop-color="#FCE1E6"/><stop offset=".7" stop-color="#FFEBD2"/><stop offset="1" stop-color="#C7E5D0"/></linearGradient><radialGradient id="sun"><stop offset="0" stop-color="#FFF7DE"/><stop offset="1" stop-color="#FFF7DE" stop-opacity="0"/></radialGradient>'
b = ['<rect width="900" height="1350" fill="url(#p)"/><circle cx="450" cy="760" r="320" fill="url(#sun)"/>']
for i in range(9): b.append(f'<ellipse cx="{R.randint(0,900)}" cy="{R.randint(80,520)}" rx="{R.randint(70,150)}" ry="{R.randint(18,30)}" fill="#fff" opacity=".55"/>')
for i in range(60): x, y = R.uniform(0, 900), R.uniform(0, 700); s = R.uniform(2, 6); b.append(f'<path d="M{x} {y-s}L{x+s*.3} {y-s*.3}L{x+s} {y}L{x+s*.3} {y+s*.3}L{x} {y+s}L{x-s*.3} {y+s*.3}L{x-s} {y}L{x-s*.3} {y-s*.3}z" fill="#fff" opacity="{R.uniform(.5,1):.2f}"/>')
b.append('<path d="M0 980C150 860 300 840 450 880S760 860 900 960V1350H0z" fill="#B8DDBF"/>')
cc = '#E9B9D3'; roof = '#B7578E'
def tower(x, w, top, base=1000):
    return f'<rect x="{x}" y="{top}" width="{w}" height="{base-top}" fill="{cc}"/><polygon points="{x-10},{top} {x+w/2},{top-w*1.6} {x+w+10},{top}" fill="{roof}"/><path d="M{x+w/2} {top-w*1.6}v-30l22 10-22 10" stroke="{roof}" stroke-width="3" fill="#F2C14E"/><rect x="{x+w/2-7}" y="{top+40}" width="14" height="24" rx="7" fill="#FFF1C9"/>'
b.append('<rect x="300" y="760" width="300" height="240" fill="#E3AECB"/>' + ''.join(f'<rect x="{300+i*30}" y="744" width="18" height="18" fill="#E3AECB"/>' for i in range(10)))
b.append(tower(250, 60, 640) + tower(590, 60, 620) + tower(415, 70, 520) + tower(345, 44, 700) + tower(510, 44, 690))
b.append('<path d="M420 1000v-70a30 30 0 0 1 60 0v70z" fill="#B7578E"/>')
b.append('<path d="M0 1040C200 1010 700 1010 900 1040V1350H0z" fill="#A8D6EC"/><g opacity=".35" transform="translate(0,2040) scale(1,-1)"><rect x="300" y="900" width="300" height="100" fill="#E9B9D3"/></g>')
for i in range(8): b.append(f'<path d="M{R.randint(40,860)} {R.randint(1080,1300)}h{R.randint(40,120)}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>')
b.append('<path d="M0 1240c60-30 120-10 180 10s140 20 200 0V1350H0zM900 1250c-80-30-160-10-220 20s-90 30-120 80H900z" fill="#8CC79A"/>')
for (x, y) in [(60, 1250), (130, 1280), (760, 1270), (830, 1240), (700, 1300)]: b.append(f'<circle cx="{x}" cy="{y}" r="14" fill="#F48FB8"/><circle cx="{x}" cy="{y}" r="6" fill="#F9D6E6"/>')
open(os.path.join(out, 'bg-prin.svg'), 'w').write(svg(''.join(b), d))

# --- кукольный мир ---
d = '<linearGradient id="k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9ECD"/><stop offset=".5" stop-color="#FFC9E2"/><stop offset="1" stop-color="#FFE3F1"/></linearGradient>'
b = ['<rect width="900" height="1350" fill="url(#k)"/>']
for i in range(36): b.append(f'<circle cx="{R.randint(0,900)}" cy="{R.randint(0,900)}" r="{R.randint(10,60)}" fill="#fff" opacity="{R.uniform(.08,.3):.2f}"/>')
def heart(x, y, s, c, o): return f'<path transform="translate({x},{y}) scale({s})" d="M0 10S-10 4-10-3a5 5 0 0 1 10-2 5 5 0 0 1 10 2C10 4 0 10 0 10z" fill="{c}" opacity="{o}"/>'
for i in range(26): b.append(heart(R.randint(20, 880), R.randint(40, 820), R.uniform(1, 3.2), R.choice(['#fff', '#FF7DB9', '#FFD1E8']), round(R.uniform(.35, .85), 2)))
# вилла
b.append('<rect x="170" y="760" width="560" height="300" rx="18" fill="#FFF4F9"/><path d="M140 770L450 640 760 770z" fill="#F06AA8"/>')
for x in (220, 340, 500, 620): b.append(f'<rect x="{x}" y="820" width="80" height="110" rx="40" fill="#9EDCF5"/><rect x="{x}" y="900" width="80" height="12" fill="#F06AA8"/>')
b.append('<rect x="410" y="940" width="80" height="120" rx="40" fill="#F06AA8"/>')
b.append('<rect y="1060" width="900" height="290" fill="#FFD6E8"/><rect x="90" y="1130" width="720" height="150" rx="40" fill="#6FD0F0"/>' + ''.join(f'<path d="M{130+i*70} {1180+(i%2)*40}q18 -10 36 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>' for i in range(9)))
def palm(x, y, s):
    g = f'<g transform="translate({x},{y}) scale({s})"><path d="M0 0C6-120 18-220 38-300" stroke="#C2588F" stroke-width="18" fill="none" stroke-linecap="round"/>'
    for a in (-160, -120, -70, -20, 20): g += f'<path d="M38 -300q{80*__import__("math").cos(__import__("math").radians(a))} {80*__import__("math").sin(__import__("math").radians(a))-20} {150*__import__("math").cos(__import__("math").radians(a))} {150*__import__("math").sin(__import__("math").radians(a))+40}" stroke="#E04D97" stroke-width="22" fill="none" stroke-linecap="round"/>'
    return g + '</g>'
b.append(palm(70, 1080, 1.1) + palm(830, 1090, -1.0))
open(os.path.join(out, 'bg-doll.svg'), 'w').write(svg(''.join(b), d))
print('ok')
