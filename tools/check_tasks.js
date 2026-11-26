#!/usr/bin/env node
/* Проверка всех заданий перед выкладкой (Уроки и Словоход — один код).
   Запуск: node tools/check_tasks.js [docs/index.html]  — вызывается из tools/build.py.
   Генерирует задания каждой темы (все дети, все возрасты 6–13) на 30 сидах и ищет:
   — пустые или сломанные подстановки (« », undefined, NaN, null, [object);
   — вопрос ссылается на слово / предложение / картинку / текст, которых в задании нет;
   — «Сколько всего … звуков/букв?» без «в русском языке / в алфавите»;
   — верный ответ не среди вариантов, повтор вариантов.
   Если что-то найдено — печатает список и выходит с кодом 1 (сборка останавливается). */
const path = require('path');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { console.log('check_tasks: playwright нет — проверка пропущена'); process.exit(0); }
const file = path.resolve(process.argv[2] || path.join(__dirname, '..', 'docs', 'index.html'));

const RULES = [
  [/«\s*»|\[\s*\]|undefined|NaN|\bnull\b|\[object/, 'пустая или сломанная подстановка'],
  [/(^|[^а-яё])(в|из|у) (этом|этого|данном|следующем) (слове|слова|предложении|предложения|тексте|текста|числе|примере)/i, 'ссылается на «это слово/предложение», которого нет'],
  [/(^|[^а-яё])(в|из|у) (слове|слова|предложении|предложения|словах|тексте|строчке|строке)\s*[?:.…]?\s*$/i, 'вопрос заканчивается «в слове?» — самого слова нет'],
  [/Сколько (всего )?(гласных|согласных|твёрдых|мягких|звонких|глухих)? ?(звуков|букв)\??$/i, 'не сказано, где считать (в каком слове / в русском языке)'],
];
const NEED_PIC = /(на|по) (картинке|рисунке|фото|схеме|чертеже)|(^|[^а-яё])(посмотри на (картин|рисун|фото|схем)|что нарисовано|кто нарисован|что изображено)/i;
const HAS_OBJ = /«[^»]+»|"[^"]+"|\[[^\]]+\]|:\s*\S/; /* в вопросе есть само слово/пример */

(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('ошибка страницы: ' + e.message.slice(0, 200)));
  await p.goto('file://' + file); await p.waitForTimeout(1200);
  const T = await p.evaluate(() => { const res = [], seen = new Set();
    const one = (src, u) => { if (!u || typeof u.g !== 'function' || seen.has(u.id)) return; seen.add(u.id); const qs = new Set();
      for (let s = 1; s <= 30; s++) { let L; try { L = genTasks(u, s * 97 + 5, 14); } catch (e) { res.push({ src, ut: u.t, q: 'ОШИБКА ГЕНЕРАЦИИ: ' + e, a: '', bad: 1 }); return; }
        for (const t of L) { if (qs.has(t.q)) continue; qs.add(t.q); res.push({ src, ut: u.t, q: t.q, a: t.a, k: t.k, opts: t.opts, pic: !!t.pic, sp: !!t.sp }); } } };
    const walk = (src, C) => { for (const [s, c] of Object.entries(C || {})) for (const u of [].concat(c.units || [], c.alt || [], c.old || [])) one(src + '/' + s, u); };
    for (const k of Object.keys(KIDS_TPL)) walk(k, KIDS_TPL[k].cur);
    if (typeof AGE_CUR !== 'undefined') for (const a of Object.keys(AGE_CUR)) walk(a + ' лет', AGE_CUR[a]);
    return res; });
  await b.close();
  const strip = s => String(s == null ? '' : s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const bad = new Map();
  for (const t of T) { const raw = String(t.q || ''), q = strip(t.q), why = [], vis = t.pic || t.sp || /<svg|<img|class="(pic|em)/.test(raw);
    if (t.bad) why.push('генерация');
    for (const [re, w] of RULES) if (re.test(q) && !(/обычно|всегда|бывает/i.test(q) && !/«\s*»|undefined|NaN/.test(q))) why.push(w);
    if (NEED_PIC.test(q) && !vis) why.push('говорит про картинку, а картинки нет');
    if (/(^|[^а-яё])(это|этот|эта|эти) (слово|слова|предложение|число|пример)\b/i.test(q) && !HAS_OBJ.test(q) && !vis) why.push('«это слово» без самого слова');
    const nm = q.match(/(^|\s)[Уу] ([А-ЯЁ][а-яё]+) [^.?]*, у ([А-ЯЁ][а-яё]+)/); if (nm && nm[2] === nm[3]) why.push('одно и то же имя дважды');
    if (t.k === 'c' && Array.isArray(t.opts)) { const o = t.opts.map(strip); if (!o.includes(strip(t.a))) why.push('верного ответа нет среди вариантов'); if (new Set(o).size !== o.length) why.push('одинаковые варианты'); }
    if (why.length) { const key = t.src + ' | ' + t.ut + ' | ' + q; if (!bad.has(key)) bad.set(key, why.join('; ')); } }
  const out = [...errs, ...[...bad].map(([k, w]) => k + '  →  ' + w)];
  if (out.length) { console.log('check_tasks: найдено ' + out.length + ' сломанных заданий (' + T.length + ' проверено):\n' + out.slice(0, 80).join('\n')); process.exit(1); }
  console.log('check_tasks: ok, ' + T.length + ' заданий');
})();
