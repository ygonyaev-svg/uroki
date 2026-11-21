"""Генерирует src/theme.css: фоны (стадион у Ярика, ночной замок у Ани), яркие карточки и кнопки."""
import os, random, urllib.parse
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = random.Random(7)
def uri(svg): return "url(\"data:image/svg+xml," + urllib.parse.quote(svg, safe=" =:/,'()-.") + "\")"

# ---------- Стадион ----------
W, H = 1000, 1500
y = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMin slice">',
     '<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e3a8a"/><stop offset="1" stop-color="#60a5fa"/></linearGradient>',
     '<radialGradient id="g"><stop offset="0" stop-color="#fffbe6" stop-opacity=".95"/><stop offset="1" stop-color="#fffbe6" stop-opacity="0"/></radialGradient></defs>',
     f'<rect width="{W}" height="260" fill="url(#s)"/>']
for x in (90, 910):
    y.append(f'<rect x="{x-6}" y="40" width="12" height="200" fill="#334155"/><rect x="{x-40}" y="20" width="80" height="34" rx="6" fill="#e2e8f0"/><circle cx="{x}" cy="37" r="110" fill="url(#g)"/>')
y.append(f'<path d="M0,150 L{W},150 L{W},330 L0,330Z" fill="#1f2937"/>')
cols = ['#ef4444','#f59e0b','#fde047','#22c55e','#3b82f6','#ec4899','#ffffff','#a855f7']
for row in range(9):
    for i in range(70):
        y.append(f'<circle cx="{i*14.5+R.randint(0,6)}" cy="{160+row*18+R.randint(-2,2)}" r="5" fill="{R.choice(cols)}" opacity=".85"/>')
y.append(f'<rect y="320" width="{W}" height="38" fill="#0f172a"/>')
for i in range(12):
    y.append(f'<rect y="{358+i*100}" width="{W}" height="100" fill="{"#3faa4a" if i%2 else "#36983f"}"/>')
L = 'stroke="#ffffff" stroke-opacity=".75" stroke-width="7" fill="none"'
y.append(f'<rect x="60" y="370" width="880" height="1120" {L}/><rect x="300" y="370" width="400" height="180" {L}/><rect x="400" y="370" width="200" height="70" {L}/>')
y.append(f'<line x1="60" y1="930" x2="940" y2="930" {L}/><circle cx="500" cy="930" r="130" {L}/><circle cx="500" cy="930" r="9" fill="#fff" fill-opacity=".8"/><path d="M420,550 A90,90 0 0,0 580,550" {L}/>')
g = ['<rect x="410" y="300" width="180" height="74" fill="none" stroke="#fff" stroke-width="8"/>']
for i in range(10): g.append(f'<line x1="{414+i*18}" y1="304" x2="{414+i*18}" y2="370" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>')
for i in range(4): g.append(f'<line x1="414" y1="{310+i*16}" x2="586" y2="{310+i*16}" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>')
y += g
y.append('<g transform="translate(760,1180)"><circle r="40" fill="#fff" stroke="#111" stroke-width="3"/><polygon points="0,-14 13,-4 8,12 -8,12 -13,-4" fill="#111"/><path d="M0,-14 L0,-40 M13,-4 L38,-12 M8,12 L23,33 M-8,12 L-23,33 M-13,-4 L-38,-12" stroke="#111" stroke-width="3"/></g>')
y.append('</svg>')
stadium = ''.join(y)

# ---------- Ночной замок ----------
a = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMax slice">',
     '<defs><linearGradient id="n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b24"/><stop offset=".55" stop-color="#1e1250"/><stop offset="1" stop-color="#3b1a5e"/></linearGradient>',
     '<radialGradient id="m"><stop offset="0" stop-color="#fff7d6"/><stop offset=".6" stop-color="#fde68a" stop-opacity=".35"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></radialGradient>',
     '<radialGradient id="f"><stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient></defs>',
     f'<rect width="{W}" height="{H}" fill="url(#n)"/>']
for i in range(220):
    a.append(f'<circle cx="{R.uniform(0,W):.0f}" cy="{R.uniform(0,1050):.0f}" r="{R.choice([1,1,1.5,2,2.5])}" fill="#fff" opacity="{R.uniform(.35,1):.2f}"/>')
a.append('<circle cx="820" cy="170" r="160" fill="url(#m)"/><circle cx="820" cy="170" r="62" fill="#fff4c2"/><circle cx="845" cy="155" r="58" fill="#1a1147" opacity=".0"/>')
cas = '#0d0a26'
a.append(f'<path d="M0,1500 L0,1230 Q250,1180 500,1220 T1000,1200 L1000,1500Z" fill="#160f3a"/>')
for (x, w, h, roof) in [(110,80,330,90),(230,120,250,0),(380,90,420,120),(500,180,300,0),(700,90,380,110),(820,110,260,0),(900,60,300,70)]:
    top = 1500-h
    a.append(f'<rect x="{x}" y="{top}" width="{w}" height="{h}" fill="{cas}"/>')
    if roof: a.append(f'<polygon points="{x-8},{top} {x+w/2},{top-roof} {x+w+8},{top}" fill="{cas}"/>')
    else:
        for k in range(int(w//24)): a.append(f'<rect x="{x+k*24}" y="{top-16}" width="14" height="16" fill="{cas}"/>')
    for k in range(R.randint(2,4)):
        wx = x + R.randint(10, max(11, int(w)-24)); wy = top + 30 + k*60
        if wy < 1470: a.append(f'<rect x="{wx}" y="{wy}" width="12" height="20" rx="6" fill="#fcd34d" opacity="{R.uniform(.6,1):.2f}"/>')
a.append('<g transform="translate(415,1035) scale(1.4)" fill="#0d0a26"><ellipse cx="0" cy="0" rx="12" ry="16"/><circle cx="0" cy="-16" r="9"/><polygon points="-8,-22 -5,-30 -2,-22"/><polygon points="8,-22 5,-30 2,-22"/><circle cx="-3.5" cy="-17" r="2.5" fill="#fcd34d"/><circle cx="3.5" cy="-17" r="2.5" fill="#fcd34d"/></g>')
a.append('</svg>')
castle = ''.join(a)

sky = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><g opacity=".5">'
       + ''.join(f'<circle cx="{R.randint(0,400)}" cy="{R.randint(0,400)}" r="{R.randint(2,6)}" fill="#fff"/>' for _ in range(30)) + '</g></svg>')

css = f"""/* ===== Яркое оформление (сгенерировано tools/theme_css.py) ===== */
:root:root{{ color-scheme:light; --paper:#f0f9ff; --grid:transparent; --ink:#1f2a44; --ink2:#55607a; --line:#e2e8f0; --card:#ffffff; --soft:#f1f5f9;
  --blue:#2563eb; --red:#e11d48; --green:#16a34a; --gold:#f59e0b; --sh:0 6px 0 rgba(15,23,42,.10),0 10px 24px rgba(15,23,42,.12); --r:22px; }}
body{{ background:#7dd3fc linear-gradient(160deg,#38bdf8 0%,#a78bfa 55%,#f472b6 100%) fixed; background-image:{uri(sky)},linear-gradient(160deg,#38bdf8 0%,#a78bfa 55%,#f472b6 100%); background-size:400px 400px,cover; color:var(--ink); }}
body::before{{ content:""; position:fixed; inset:0; z-index:-1; pointer-events:none; }}
body.yarik{{ background:#36983f; }} body.yarik::before{{ background:linear-gradient(rgba(2,6,23,.55),rgba(2,6,23,.25) 260px,rgba(2,6,23,.05) 420px),url(img/bg-yarik.webp) center 70%/cover no-repeat,{uri(stadium)} center top/cover no-repeat; }}
body.yarik .lesson > h1{{ text-shadow:0 2px 14px rgba(0,0,0,.55); }}
body.anya{{ background:#1e1250; }} body.anya::before{{ background:linear-gradient(rgba(7,11,36,.35),rgba(7,11,36,.15)),url(img/bg-anya.webp) center 40%/cover no-repeat,{uri(castle)} center bottom/cover no-repeat; }}
h1,h2,.kn,.btn,.tile .sn,.bigmark+p{{ font-family:"Nunito","Arial Rounded MT Bold",-apple-system,sans-serif; }}
h1{{ font-weight:900; font-size:34px; }}
/* текст прямо на фоне */
.hero h1,.hero .eyebrow,body .wrap > .hello h1,body .wrap > .hello p,.lesson > h1,.lesson > .eyebrow,.lesson > .author,.lesson > .hint,.lesson > p,.lesson > h2,.wrap > .center,.counter,.src,.wrap > .hint{{ color:#fff; text-shadow:0 2px 6px rgba(0,0,0,.45); }}
.lesson > .hint,.wrap > .hint,.counter,.src,.lesson > p,.lesson > .author,.wrap > .center{{ background:rgba(15,23,42,.62); border-radius:12px; padding:6px 12px; font-size:16px; display:block; width:fit-content; max-width:100%; text-shadow:none; }}
.shop-own{{ background:#fff; color:var(--ink); border-radius:20px; padding:12px 18px; box-shadow:var(--sh); }} .shop-own h2{{ color:var(--ink); text-shadow:none; }}
.wrap.login .center .link,.bar .link{{ color:#fff; font-weight:800; text-shadow:0 2px 6px rgba(0,0,0,.45); }}
.hello .eyebrow{{ color:#fde047; text-shadow:0 2px 6px rgba(0,0,0,.5); }}
.card,.tile,.kidcard,.opt,.chip{{ border:0; box-shadow:var(--sh); }}
.card{{ border-radius:24px; }}
/* кнопки — объёмные */
.btn{{ border-radius:18px; font-weight:800; letter-spacing:.01em; box-shadow:0 6px 0 rgba(0,0,0,.22); transition:transform .08s, box-shadow .08s; }}
.btn:active{{ transform:translateY(5px); box-shadow:0 1px 0 rgba(0,0,0,.22); }}
.btn.big{{ font-size:22px; min-height:66px; }}
.btn.mic{{ background:linear-gradient(#22c55e,#16a34a); }} .btn.stop{{ background:linear-gradient(#fb7185,#e11d48); }}
.opt{{ border:3px solid transparent; border-radius:18px; font-weight:700; box-shadow:0 5px 0 rgba(15,23,42,.12); transition:transform .08s; }}
.opt:not(:disabled):active{{ transform:translateY(4px); }}
.opt.right{{ background:#dcfce7; border-color:#22c55e; animation:pop .35s; }} .opt.wrong{{ background:#ffe4e6; border-color:#fb7185; animation:shake .35s; }}
@keyframes pop{{ 50%{{ transform:scale(1.08); }} }} @keyframes shake{{ 25%{{ transform:translateX(-6px); }} 75%{{ transform:translateX(6px); }} }}
/* уроки — у каждого предмета свой цвет */
.tile{{ border-radius:22px; border-left:10px solid var(--sc,#94a3b8); transition:transform .1s; }}
.tile:not(.locked):active{{ transform:scale(.97); }}
.tile .ico{{ background:var(--sc,#94a3b8); color:#fff; width:62px; height:62px; border-radius:18px; font-size:22px; font-weight:900; box-shadow:0 4px 0 rgba(0,0,0,.18); }}
.tile[data-subj=read]{{ --sc:#f97316; }} .tile[data-subj=math]{{ --sc:#3b82f6; }} .tile[data-subj=rus]{{ --sc:#ef4444; }} .tile[data-subj=world]{{ --sc:#22c55e; }}
.tile[data-subj=hist]{{ --sc:#a855f7; }} .tile[data-subj=logic]{{ --sc:#eab308; }} .tile[data-subj=lang]{{ --sc:#06b6d4; }} .tile[data-subj=hw]{{ --sc:#64748b; }}
.tile.locked{{ opacity:1; filter:none; background:#e2e8f0; }} .tile.locked .tt{{ opacity:.6; }} .tile.locked .ico{{ filter:grayscale(1); opacity:.6; }} body.anya .tile.locked{{ background:#d9c9a3; }}
.tile.done{{ opacity:1; }} .tile.done::after{{ content:"✓"; position:absolute; right:12px; top:8px; color:#16a34a; font-weight:900; }}
.tile.main{{ border-color:var(--sc); }}
.prog{{ height:16px; background:rgba(255,255,255,.55); }} .prog i{{ background:linear-gradient(90deg,#facc15,#f97316); }}
.steps li{{ background:rgba(255,255,255,.85); font-weight:700; }} .steps li.now{{ background:var(--acc); color:#fff; }}
.coins{{ border:0; font-weight:900; box-shadow:0 4px 0 rgba(0,0,0,.15); }}
.banner{{ font-size:40px; }}
/* вход */
.wrap.login .kidcard{{ border:0; color:#fff; position:relative; overflow:hidden; }}
.wrap.login .kidcard .kg,.wrap.login .kidcard .kc{{ color:#fff; }}
.kidcard.yarik{{ background:linear-gradient(#22c55e,#15803d); box-shadow:0 8px 0 #14532d,0 14px 30px rgba(0,0,0,.25); }}
.kidcard.anya{{ background:linear-gradient(#312e81,#581c87); box-shadow:0 8px 0 #2e1065,0 14px 30px rgba(0,0,0,.25); }}
.kidcard .avatar{{ background:#fff; color:#15803d; box-shadow:0 5px 0 rgba(0,0,0,.2); }} .kidcard.anya .avatar{{ color:#6d28d9; background:#fde68a; }}
.kidcard:active{{ transform:translateY(4px); }}
/* ===== Ярик: стадион ===== */
body.yarik .wrap{{ --acc:#f97316; --accsoft:#ffedd5; }}
body.yarik .coins{{ background:#0f172a; color:#facc15; font-family:"Courier New",monospace; border-radius:10px; letter-spacing:.08em; }}
body.yarik .coins::before{{ content:"СЧЁТ"; font-size:11px; color:#94a3b8; margin-right:4px; letter-spacing:.1em; }}
body.yarik .btn{{ background:linear-gradient(#fb923c,#ea580c); }} body.yarik .btn.ghost{{ background:#fff; color:#ea580c; }}
/* ===== Аня: волшебная школа ===== */
body.anya .wrap{{ --acc:#9b1c31; --accsoft:#fbe7c6; --gold:#f5c542; }}
body.anya .card,body.anya .tile,body.anya .opt,body.anya .chip,body.anya .note{{ background:#f8ecd2 linear-gradient(135deg,#fbf3e0,#efdcb4); color:#3b2a1a; --ink:#3b2a1a; --ink2:#6b5440; --soft:#f1e2c2; box-shadow:0 0 0 2px #c9a35a inset,0 6px 0 rgba(0,0,0,.35),0 10px 30px rgba(0,0,0,.35); }}
body.anya h1,body.anya h2,body.anya .lesson > h1{{ font-family:"Playfair Display",Georgia,serif; }}
body.anya .card h2,body.anya .card h3{{ color:#7a1528; }}
body.anya .hello h1,body.anya .lesson > h1{{ color:#f5d27a; }}
body.anya .btn{{ background:linear-gradient(#b91c3c,#7f1d1d); color:#fde68a; box-shadow:0 6px 0 #3f0a12; }}
body.anya .btn.ghost{{ background:#fbe7c6; color:#7f1d1d; }}
body.anya .coins{{ background:#1e1b4b; color:#f5d27a; box-shadow:0 0 0 2px #c9a35a inset,0 4px 0 rgba(0,0,0,.4); }}
body.anya .wrap > .hello::after{{ content:""; display:block; height:14px; margin-top:8px; border-radius:7px; background:repeating-linear-gradient(90deg,#9b1c31 0 22px,#f5c542 22px 34px); box-shadow:0 3px 0 rgba(0,0,0,.3); }}
body.anya .prog i{{ background:linear-gradient(90deg,#f5c542,#fde68a); }}
body.anya .opt.right{{ background:#dcfce7; }} body.anya .opt.wrong{{ background:#ffe4e6; }}
/* награды */
.burst{{ position:relative; height:0; }}
.burst span{{ position:absolute; left:50%; top:0; font-size:30px; animation:fly 1.4s ease-out forwards; opacity:0; }}
@keyframes fly{{ 0%{{ opacity:1; transform:translate(-50%,0) scale(.5); }} 100%{{ opacity:0; transform:translate(calc(-50% + var(--dx)),var(--dy)) scale(1.2) rotate(var(--r)); }} }}
.result .bigmark{{ animation:stamp .5s cubic-bezier(.2,1.6,.4,1); }}
@keyframes stamp{{ 0%{{ transform:scale(2.5) rotate(-20deg); opacity:0; }} 100%{{ transform:scale(1) rotate(-6deg); opacity:1; }} }}
.result .earn{{ font-size:22px; font-weight:900; }}
@media (prefers-reduced-motion: reduce){{ .burst span,.result .bigmark,.opt.right,.opt.wrong{{ animation:none; }} }}
"""
open(os.path.join(root, 'src', 'theme.css'), 'w', encoding='utf-8').write(css)
print(len(css))
