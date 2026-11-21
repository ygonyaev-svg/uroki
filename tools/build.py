#!/usr/bin/env python3
"""Собирает приложение в папку docs/ (для GitHub Pages)."""
import os, sys, json, hashlib
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(root, 'src')
FAM = '--fam' in sys.argv; args = [a for a in sys.argv[1:] if a != '--fam']
out = args[0] if args else os.path.join(root, 'docs', 'semya') if FAM else os.path.join(root, 'docs')
os.makedirs(out, exist_ok=True)
parts = json.load(open(os.path.join(root, 'books', 'parts.json'), encoding='utf-8'))
sys.path.insert(0, os.path.join(root, 'tools')); import meta2
BX, _e = meta2.load()
if _e: sys.exit('meta2: ' + '; '.join(_e))
rd = lambda f: open(os.path.join(src, f), encoding='utf-8').read()
js = '\n'.join(['var FAM = %d;' % FAM, rd('core.js'), rd('icons.js'), rd('icons2.js'), rd('cur_pt_nat.js'), rd('cur_fin.js'), rd('cur_fin_a.js'), rd('cur_yarik.js'), rd('cur_anya.js'), rd('cur_more_y.js'), rd('cur_more_a.js'), ] + ([rd('cur_langs.js')] if FAM else []) + [rd('hard.js'), rd('texts.js'), rd('themes.js'), 'const BOOK_TXT = ' + json.dumps(parts, ensure_ascii=False) + ';', 'const BOOK_X = ' + json.dumps(BX, ensure_ascii=False) + ';', rd('books.js'), rd('pics.js'), rd('mybooks.js'), rd('bookread.js'), rd('fun_data.js'), rd('fun_pz.js'), rd('fun.js'), ] + ([] if FAM else [rd('hp_data.js'), rd('hp.js')]) + [rd('looks.js'), rd('chess_course.js'), rd('chess_puz.js'), rd('chess.js'), rd('code.js'), rd('gloss.js'), rd('poems.js'), rd('spot.js'), rd('hw.js'), rd('tips.js'), rd('snap.js'), rd('portrait.js'), rd('testmode.js')] + ([rd('fam.js')] if FAM else []) + [rd('app.js')])
if FAM:
    import re
    for a, b in [('Задание от Юры', 'Задание от родителей'), ('ждёт цену от Юры', 'ждёт цену от родителей'), ('цену назначит Юра', 'цену назначат родители'), ('баллы от Юры', 'баллы от родителей'), ('с Юрой', 'с папой')]: js = js.replace(a, b)
    js = re.sub(r'(?<![А-Яа-яЁё])Юр(а|ы|е|у|ой)(?![А-Яа-яЁё])', r'пап\1', js); js = re.sub(r'(?<![А-Яа-яЁё])Ярик', 'Глеб', js); js = re.sub(r'(?<![А-Яа-яЁё])Ан(я|и|е|ю|ей)(?![А-Яа-яЁё])', r'Кат\1', js)
import subprocess; subprocess.run([sys.executable, os.path.join(root, 'tools', 'theme_css.py')], check=True)
css = '\n'.join(open(os.path.join(src, f), encoding='utf-8').read() for f in ('fonts.css', 'style.css', 'theme.css', 'code.css', 'design.css') + (('fam.css',) if FAM else ('hp.css', 'looks.css')))
ver = hashlib.md5((js + css).encode()).hexdigest()[:8]
TITLE = 'Словоход' if FAM else 'Уроки'; BASE = '<base href="../">' if FAM else ''; MAN = 'semya/manifest.webmanifest' if FAM else 'manifest.webmanifest'; HCL = ' class="fam"' if FAM else ''; TC = '#2D4A32' if FAM else '#38bdf8'; IP = 'semya/' if FAM else ''; FF = '&family=Alice&family=PT+Sans:wght@400;700' if FAM else ''
html = f'''<!doctype html>
<html lang="ru"{HCL}><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{TITLE}</title>{BASE}
<meta name="theme-color" content="{TC}"><meta name="color-scheme" content="light">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="{TITLE}">
<link rel="manifest" href="{MAN}"><link rel="apple-touch-icon" href="{IP}icon-180.png"><link rel="icon" href="{IP}icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700{FF}&display=swap" rel="stylesheet">
<style>{css}</style></head>
<body><div id="app"></div>
<script>window.onerror=function(m,u,l){{var a=document.getElementById('app');if(a&&!a.children.length)a.innerHTML='<div style="margin:40px auto;max-width:520px;background:#fff;padding:20px;border-radius:16px;font:16px sans-serif">Не удалось запустить приложение. Закройте и откройте его заново.<br><small>'+m+' ('+l+')</small></div>';}};</script>
<script>/* v{ver} */
{js}
{'' if FAM else "if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');"}
</script></body></html>'''
open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(html)
json.dump({'name': 'Словоход' if FAM else 'Уроки для Ярика и Ани', 'short_name': 'Словоход' if FAM else 'Уроки', 'start_url': './', 'display': 'standalone', 'background_color': '#F5EFE0' if FAM else '#fbfaf5', 'theme_color': '#2D4A32' if FAM else '#2350a8', 'lang': 'ru',
           'id': './', 'scope': './', 'orientation': 'any', 'description': 'Ежедневные уроки по-русски: чтение, математика, языки',
           'icons': [{'src': 'icon-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'}, {'src': 'icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any'}, {'src': 'icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}]},
          open(os.path.join(out, 'manifest.webmanifest'), 'w', encoding='utf-8'), ensure_ascii=False)
if FAM:
    import shutil; shutil.copy(os.path.join(root, 'tools', 'fam_admin.html'), os.path.join(out, 'admin.html'))
    for f in os.listdir(os.path.join(root, 'tools', 'semya')): shutil.copy(os.path.join(root, 'tools', 'semya', f), os.path.join(out, f))
    print('ok', out, ver); sys.exit(0)
open(os.path.join(out, 'sw.js'), 'w').write(f'''const C='uroki-{ver}';
self.addEventListener('install',e=>{{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-180.png','img/bg-yarik.webp','img/bg-anya.webp'])));self.skipWaiting();}});
self.addEventListener('activate',e=>{{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();}});
self.addEventListener('fetch',e=>{{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
e.respondWith(fetch(e.request).then(r=>{{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}}).catch(()=>caches.match(e.request,{{ignoreSearch:true}})));}});
''')
try:
    from PIL import Image, ImageDraw, ImageFont
    for size in (180, 192, 512):
        im = Image.new('RGB', (size, size), '#2350a8'); d = ImageDraw.Draw(im)
        g = size // 8
        for i in range(0, size, g): d.line([(i, 0), (i, size)], fill='#3462bd', width=max(1, size // 180)); d.line([(0, i), (size, i)], fill='#3462bd', width=max(1, size // 180))
        f = None
        for fp in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf']:
            if os.path.exists(fp): f = ImageFont.truetype(fp, int(size * .46)); break
        d.text((size / 2, size * .47), 'Аа', font=f, fill='white', anchor='mm')
        d.ellipse([size * .66, size * .66, size * .9, size * .9], fill='#e0a417')
        im.save(os.path.join(out, f'icon-{size}.png'))
except ImportError:
    print('PIL нет — иконки не созданы')
print('ok', out, ver)
