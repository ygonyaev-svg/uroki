// node tools/looks/bg_render.js — растр запасных фонов в docs/img/bg-*.webp (через PNG)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 1350 } });
  for (const n of ['hero', 'cube', 'prin', 'doll']) { await p.goto('file://' + path.join(__dirname, 'bg-' + n + '.svg')); await p.screenshot({ path: path.join(__dirname, 'bg-' + n + '.png') }); }
  await b.close(); })();
