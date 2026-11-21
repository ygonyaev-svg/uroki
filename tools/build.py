#!/usr/bin/env python3
"""Собирает приложение в папку docs/ (для GitHub Pages)."""
import os, sys, json, hashlib
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(root, 'src'); out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'docs')
os.makedirs(out, exist_ok=True)
parts = json.load(open(os.path.join(root, 'books', 'parts.json'), encoding='utf-8'))
sys.path.insert(0, os.path.join(root, 'tools')); import meta2
BX, _e = meta2.load()
if _e: sys.exit('meta2: ' + '; '.join(_e))
rd = lambda f: open(os.path.join(src, f), encoding='utf-8').read()
js = '\n'.join([rd('core.js'), rd('cur_yarik.js'), rd('cur_anya.js'), rd('cur_more_y.js'), rd('cur_more_a.js'), rd('hard.js'), rd('texts.js'), rd('themes.js'), 'const BOOK_TXT = ' + json.dumps(parts, ensure_ascii=False) + ';', 'const BOOK_X = ' + json.dumps(BX, ensure_ascii=False) + ';', rd('books.js'), rd('pics.js'), rd('app.js')])
import subprocess; subprocess.run([sys.executable, os.path.join(root, 'tools', 'theme_css.py')], check=True)
css = open(os.path.join(src, 'style.css'), encoding='utf-8').read() + '\n' + open(os.path.join(src, 'theme.css'), encoding='utf-8').read()
ver = hashlib.md5((js + css).encode()).hexdigest()[:8]
html = f'''<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Уроки</title>
<meta name="theme-color" content="#38bdf8"><meta name="color-scheme" content="light">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Уроки">
<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-180.png"><link rel="icon" href="icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Nunito:wght@700;800;900&family=Cinzel+Decorative:wght@700&display=swap" rel="stylesheet">
<style>{css}</style></head>
<body><div id="app"></div>
<script>window.onerror=function(m,u,l){{var a=document.getElementById('app');if(a&&!a.children.length)a.innerHTML='<div style="margin:40px auto;max-width:520px;background:#fff;padding:20px;border-radius:16px;font:16px sans-serif">Не удалось запустить приложение. Закройте и откройте его заново.<br><small>'+m+' ('+l+')</small></div>';}};</script>
<script>/* v{ver} */
{js}
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');
</script></body></html>'''
open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(html)
json.dump({'name': 'Уроки для Ярика и Ани', 'short_name': 'Уроки', 'start_url': './', 'display': 'standalone', 'background_color': '#fbfaf5', 'theme_color': '#2350a8', 'lang': 'ru',
           'icons': [{'src': 'icon-192.png', 'sizes': '192x192', 'type': 'image/png'}, {'src': 'icon-512.png', 'sizes': '512x512', 'type': 'image/png'}]},
          open(os.path.join(out, 'manifest.webmanifest'), 'w', encoding='utf-8'), ensure_ascii=False)
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
