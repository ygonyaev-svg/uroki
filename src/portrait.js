/* ===== Портрет ребёнка (для родителей) =====
   Наблюдения по результатам в приложении, не диагноз. Основа — модель способностей CHC + карта интересов (Климов/Голланд);
   схема сверена с ChatGPT и Gemini 21.11.2026. Детей не сравниваем между собой, слабостей не пишем — только «что можно развивать».
   Данные: компактный журнал S.pf[kid] (не входит в снимок ребёнка, чтобы не раздувать его): [секунды, шкала, итог, добровольно, темп, точность, пересказ]. */
const PF_MAX = 4000;
const PF_SC = {
  rus:   { n: 'Русская речь и чтение', i: '📖', d: 'чтение вслух, понимание текста, пересказ, стихи, русский язык' },
  logic: { n: 'Логика и счёт', i: '🧮', d: 'математика, логика, задачи на смекалку, загадки' },
  constr:{ n: 'Конструирование', i: '🧩', d: 'программирование, головоломки со спичками, шахматные задачи' },
  world: { n: 'Любознательность к миру', i: '🌍', d: 'природа, история, устройство мира, деньги' },
  lang:  { n: 'Другие языки', i: '🗣️', d: 'португальский, английский и другие языки, кроме русского' } };
const PF_VOL = { загадка: 'Загадки', головоломка: 'Головоломки со спичками', 'задача на смекалку': 'Задачи на смекалку', шахматы: 'Шахматы', программирование: 'Программирование', стихи: 'Стихи', 'стих наизусть': 'Стихи', экстра: 'Экстра-задания', PRO: 'Уровень PRO', испытание: 'Испытания' };
const PF_PROF = {
  rus:   ['журналист или писатель', 'юрист', 'учитель', 'редактор', 'актёр или ведущий', 'психолог'],
  logic: ['инженер', 'программист', 'аналитик данных', 'финансист', 'физик или математик', 'архитектор'],
  constr:['инженер-конструктор', 'разработчик игр', 'робототехник', 'архитектор', 'пилот', 'мастер по технике'],
  world: ['врач', 'биолог или ветеринар', 'историк или археолог', 'эколог', 'геолог', 'исследователь'],
  lang:  ['переводчик', 'дипломат', 'международный бизнес', 'гид или специалист по туризму'] };

function pfCat(subj, q){ const s = String(subj || ''), t = String(q || '');
  if (/Русск|Чтение|Стих|Книга/.test(s)) return 'rus';
  if (/Математ|Логик|смекалк|Загадк/.test(s)) return 'logic';
  if (/Программ|Головолом|Шахмат/.test(s)) return 'constr';
  if (/Мир|Истори|Природ|Финанс|Деньг|Копил/.test(s)) return 'world';
  if (/Язык|Portugu|English|Fran|Deutsch|Espa/.test(s)) return 'lang';
  if (/\d/.test(t)) return 'logic'; if (/[a-zà-ü]{3}/i.test(t) && !/[а-яё]{3}/i.test(t)) return 'lang'; return 'rus'; }
const pfPct = s => { const m = String(s || '').match(/(\d+)/); return m ? +m[1] / 100 : null; };
const pfFrac = s => { const m = String(s || '').match(/(\d+)\s*\/\s*(\d+)/); return m && +m[2] ? +m[1] / +m[2] : null; };
/* итог: 1 — верно с первой, 2 — сам исправил, 0 — ошибка/подсмотрел решение, -1 — без оценки */
function pfRec(e){ const ty = e.type, ts = Math.round(Date.parse(e.t) / 1000) || 0;
  if (ty === 'ответ' || ty === 'загадка' || ty === 'задача на смекалку' || ty === 'головоломка') {
    const o = e.ok === 'верно' ? 1 : e.ok === 'со 2-й попытки' ? 2 : e.ok === 'ошибка' ? 0 : -1; if (o < 0) return null;
    return [ts, pfCat(e.subj, e.q), o, ty === 'ответ' ? 0 : 1]; }
  if (ty === 'программирование' && e.ok) { const m = String(e.text || '').match(/попыток (\d+)/); return [ts, 'constr', e.ok === 'по решению' ? 0 : m && +m[1] > 1 ? 2 : 1, 1]; }
  if (ty === 'шахматы' && /задача/.test(e.text || '')) return [ts, 'constr', /не с первой/.test(e.text) ? 2 : 1, 1];
  if (ty === 'чтение вслух' && e.wpm && /Чтение|Книга/.test(e.subj || '')) return [ts, 'rus', -1, 0, +e.wpm || 0, pfPct(e.acc)];
  if (ty === 'пересказ') { const r = pfFrac(e.score); return r == null ? null : [ts, 'rus', -1, 0, 0, null, r]; }
  if (ty === 'стих наизусть') return [ts, 'rus', -1, 1, 0, pfPct(e.text)];
  if (PF_VOL[ty]) return [ts, 'vol:' + ty, -1, 1];
  if (ty === 'урок завершён') return [ts, 'done', -1, 0, 0, null, null, e.mood || 0, e.subj || ''];
  return null; }
function pfOn(kid, e){ try { S.pf = S.pf || {}; const L = S.pf[kid] = S.pf[kid] || []; const r = pfRec(e); if (!r) return; L.push(r);
  /* добровольное занятие — отдельной отметкой, чтобы считать интересы */
  if (r[3] && !/^vol:/.test(r[1]) && PF_VOL[e.type]) L.push([r[0], 'vol:' + e.type, -1, 1]);
  if (L.length > PF_MAX) S.pf[kid] = L.slice(-PF_MAX); } catch (x) {} }
/* один раз подтягиваем то, что уже есть в журнале устройства */
function pfInit(){ if (S.pfInit) return; S.pf = S.pf || {}; const byName = {}; for (const k of kidIds()) byName[KIDS[k].name] = k;
  for (const e of S.log || []) { const k = byName[e.kid]; if (k) pfOn(k, e); } S.pfInit = 1; }

function pfCalc(kid){ pfInit(); const L = (S.pf && S.pf[kid]) || [], sc = {}, vol = {}, days = new Set(), now = Date.now() / 1000;
  for (const k in PF_SC) sc[k] = { n: 0, w: 0, ok: 0, fix: 0, err: 0, rec: [] };
  let t0 = null, prevAns = null; const gaps = [], rd = [], rt = [];
  for (const r of L) { const [ts, c, o] = r; if (!t0 || ts < t0) t0 = ts;
    if (/^vol:/.test(c)) { const v = PF_VOL[c.slice(4)]; const dk = v + new Date(ts * 1000).toDateString(); if (!vol[v]) vol[v] = { n: 0, d: new Set() }; vol[v].n++; vol[v].d.add(dk); continue; }
    if (c === 'done') continue;
    days.add(new Date(ts * 1000).toDateString());
    if (c === 'rus' && r[4]) rd.push([ts, r[4], r[5]]);
    if (c === 'rus' && r[6] != null) rt.push(r[6]);
    if (o < 0 || !sc[c]) continue;
    const S1 = sc[c]; S1.n++; if (o === 1) S1.ok++; else if (o === 2) S1.fix++; else S1.err++; S1.rec.push(o === 1 ? 1 : 0);
    if (!r[3] && prevAns) { const g = ts - prevAns; if (g > 2 && g < 180) gaps.push([g, o === 1 ? 1 : 0]); } if (!r[3]) prevAns = ts; }
  const span = t0 ? Math.max(1, Math.round((now - t0) / 86400)) : 0;
  const tot = Object.values(sc).reduce((s, x) => s + x.n, 0);
  for (const k in sc) { const x = sc[k]; x.acc = x.n ? x.ok / x.n : null;
    /* динамика: последние 30 против предыдущих 30 */
    const a = x.rec.slice(-30), b = x.rec.slice(-60, -30); x.trend = a.length >= 15 && b.length >= 15 ? a.reduce((s, v) => s + v, 0) / a.length - b.reduce((s, v) => s + v, 0) / b.length : null; }
  const errs = Object.values(sc).reduce((s, x) => s + x.fix + x.err, 0), fixed = Object.values(sc).reduce((s, x) => s + x.fix, 0);
  let style = null; if (gaps.length >= 30) { const srt = gaps.map(g => g[0]).sort((p, q) => p - q), med = srt[srt.length >> 1];
    const fast = gaps.filter(g => g[0] < med), slow = gaps.filter(g => g[0] >= med), fa = fast.reduce((s, g) => s + g[1], 0) / Math.max(1, fast.length), sa = slow.reduce((s, g) => s + g[1], 0) / Math.max(1, slow.length);
    const accAll = gaps.reduce((s, g) => s + g[1], 0) / gaps.length; style = { med, fa, sa, acc: accAll, n: gaps.length }; }
  return { sc, vol, days: days.size, span, tot, errs, fixed, style, rd, rt }; }

function pfWord(n, a, b, c){ n = Math.abs(n) % 100; const n1 = n % 10; return n > 10 && n < 20 ? c : n1 > 1 && n1 < 5 ? b : n1 === 1 ? a : c; }
function pfBar(v){ return `<span class="pfbar"><i style="width:${Math.round(Math.max(.04, Math.min(1, v)) * 100)}%"></i></span>`; }

function vPortrait(kid){
  const P = pfCalc(kid), MIN_ANS = 40, MIN_DAYS = 5, SC_MIN = 20, DIR_DAYS = 20, DIR_SPAN = 42;
  const note = `<p class="hint pfnote">Это наблюдения по результатам ребёнка в приложении, а не психологическая диагностика и не прогноз. Интересы и способности в этом возрасте быстро меняются — портрет обновляется сам по мере занятий.</p>`;
  if (P.tot < MIN_ANS || P.days < MIN_DAYS) {
    const p = Math.min(P.tot / MIN_ANS, P.days / MIN_DAYS);
    return `<div class="card"><h2>Портрет: копим наблюдения</h2><p>Чтобы выводы были честными, нужно хотя бы ${MIN_ANS} ответов за ${MIN_DAYS} разных дней. Сейчас: ${P.tot} ${pfWord(P.tot, 'ответ', 'ответа', 'ответов')} за ${P.days} ${pfWord(P.days, 'день', 'дня', 'дней')}.</p>${pfBar(p)}<p class="hint">Готово примерно на ${Math.round(p * 100)}%.</p></div>${note}`; }
  const ready = Object.keys(PF_SC).filter(k => P.sc[k].n >= SC_MIN);
  const rows = Object.keys(PF_SC).map(k => { const x = P.sc[k], s = PF_SC[k];
    if (x.n < SC_MIN) return `<div class="pfrow dim"><b>${s.i} ${s.n}</b><span class="hint">пока мало данных (${x.n} из ${SC_MIN})</span></div>`;
    const tr = x.trend == null ? '' : x.trend > .08 ? ' · растёт ↗' : x.trend < -.08 ? ' · последнее время труднее ↘' : ' · ровно';
    return `<div class="pfrow"><b>${s.i} ${s.n}</b>${pfBar(x.acc)}<span class="hint">${Math.round(x.acc * 100)}% верно с первой попытки · ${x.n} ${pfWord(x.n, 'задание', 'задания', 'заданий')}${tr}</span></div>`; }).join('');
  /* сильные стороны — относительно самого ребёнка */
  const rank = ready.slice().sort((a, b) => P.sc[b].acc - P.sc[a].acc);
  const strong = rank.filter(k => P.sc[k].acc >= .7).slice(0, 2), grow = rank.length >= 3 ? rank[rank.length - 1] : null;
  const S_TXT = {
    rus: 'хорошо понимает прочитанное и чувствует язык: русские задания удаются стабильно',
    logic: 'уверенно находит закономерности и решает задачи на счёт и рассуждение',
    constr: 'хорошо строит последовательность действий и держит в голове многошаговое решение',
    world: 'с интересом и толком разбирается в том, как устроены природа и мир',
    lang: 'легко переключается между языками и хорошо держит иностранную лексику и грамматику' };
  const G_TXT = {
    rus: 'Русский — главный предмет. Помогает ежедневное чтение вслух по 10 минут и пересказ своими словами после главы.',
    logic: 'Помогают задачи «объясни, как решал» и настольные игры со счётом — без спешки, на понимание.',
    constr: 'Помогают конструкторы, головоломки и уровни «Тоби» — где надо спланировать ход заранее.',
    world: 'Помогают совместные прогулки «почему так?», музеи и короткие научно-популярные книги.',
    lang: 'Помогают мультфильмы и книги на этом языке и короткие разговоры с носителями.' };
  let out = '';
  out += `<div class="card"><h2>Сильные стороны</h2>${strong.length ? '<ul>' + strong.map(k => `<li><b>${PF_SC[k].n}:</b> ${S_TXT[k]}.</li>`).join('') + '</ul>' : '<p>Пока ровно по всем направлениям — ярких перекосов нет.</p>'}`;
  /* русский — всегда отдельной строкой: главный предмет */
  const R = P.sc.rus; if (R.n >= SC_MIN && !strong.includes('rus')) out += `<p class="hint">Русский: ${Math.round(R.acc * 100)}% верно с первой попытки — это главный предмет, на нём держится всё остальное.</p>`;
  if (P.rd.length >= 3) { const a = P.rd.slice(0, 3), b = P.rd.slice(-3), av = l => Math.round(l.reduce((s, r) => s + r[1], 0) / l.length);
    out += `<p class="hint">Чтение вслух: было около ${av(a)} слов в минуту, сейчас около ${av(b)} (${P.rd.length} ${pfWord(P.rd.length, 'замер', 'замера', 'замеров')}).${P.rt.length >= 3 ? ` Пересказ: в среднем ${Math.round(P.rt.reduce((s, v) => s + v, 0) / P.rt.length * 100)}% ключевых слов.` : ''}</p>`; }
  out += '</div>';
  /* как работает */
  const how = [];
  if (P.errs >= 10) { const f = P.fixed / P.errs; how.push(f >= .5 ? `После ошибки чаще всего пробует снова и сам находит верный ответ (${P.fixed} из ${P.errs} случаев) — это настойчивость, она важнее скорости.` : f >= .25 ? `После ошибки примерно в ${Math.round(f * 100)}% случаев сам доходит до верного ответа. Хорошо хвалить именно за вторую попытку.` : `После ошибки пока чаще сдаётся или ждёт подсказки. Помогает спокойное «попробуй ещё раз» и похвала за саму попытку.`); }
  if (P.style) { const st = P.style; how.push(st.fa < st.sa - .15 ? `Быстрые ответы заметно чаще ошибочны, чем обдуманные (${Math.round(st.fa * 100)}% против ${Math.round(st.sa * 100)}%) — иногда торопится. Тут помогает правило «прочитай вопрос ещё раз».` : st.acc >= .8 ? (st.med <= 15 ? 'Работает быстро и при этом точно: навык уже автоматизирован.' : 'Работает вдумчиво: не спешит, зато отвечает точно.') : st.med <= 15 ? 'Отвечает быстро; точность пока средняя — стоит чуть сбавить темп.' : 'Думает над ответами подолгу; точность растёт вместе с опытом.'); }
  if (how.length) out += `<div class="card"><h2>Как работает</h2><ul>${how.map(h => `<li>${h}</li>`).join('')}</ul></div>`;
  /* сам выбирает */
  const vol = Object.entries(P.vol).map(([k, v]) => [k, v.d.size, v.n]).sort((a, b) => b[1] - a[1] || b[2] - a[2]);
  out += `<div class="card"><h2>Что выбирает сам, сверх плана</h2>${vol.length ? '<ul>' + vol.slice(0, 5).map(([k, d, n]) => `<li><b>${k}</b> — в ${d} ${pfWord(d, 'день', 'дня', 'дней')}, всего ${n} ${pfWord(n, 'действие', 'действия', 'действий')}</li>`).join('') + '</ul><p class="hint">То, к чему ребёнок возвращается сам, говорит об интересе больше, чем оценки.</p>' : '<p>Пока ничего сверх плана — интересы проявятся позже.</p>'}</div>`;
  /* направления и профессии */
  if (P.days >= DIR_DAYS && P.span >= DIR_SPAN && strong.length) {
    const VOLK = { 'Программирование': 'constr', 'Головоломки со спичками': 'constr', 'Шахматы': 'logic', 'Задачи на смекалку': 'logic', 'Загадки': 'rus', 'Стихи': 'rus' };
    const keys = strong.slice(); for (const [k] of vol.slice(0, 2)) { const c = VOLK[k]; if (c && !keys.includes(c) && keys.length < 3) keys.push(c); }
    const prof = []; for (let i = 0; prof.length < 6 && i < 6; i++) for (const k of keys) { const p = PF_PROF[k][i]; if (p && !prof.includes(p) && prof.length < 6) prof.push(p); }
    out += `<div class="card"><h2>Где такие навыки пригодятся</h2><p>Сочетание «${keys.map(k => PF_SC[k].n.toLowerCase()).join(' + ')}» часто встречается у людей таких профессий:</p><p class="pfprof">${prof.map(p => `<span class="chip">${p}</span>`).join(' ')}</p><p class="hint">Это не выбор профессии, а повод познакомиться: книга, музей, кружок, разговор со взрослым из этой сферы.</p></div>`;
  } else { const left = Math.max(DIR_DAYS - P.days, 0), leftSpan = Math.max(DIR_SPAN - P.span, 0);
    out += `<div class="card dim"><h2>Где такие навыки пригодятся</h2><p class="hint">Откроется после 6 недель наблюдений${left || leftSpan ? ` — ещё примерно ${Math.max(left, leftSpan)} ${pfWord(Math.max(left, leftSpan), 'день', 'дня', 'дней')}` : ''}. Раньше выводы о направлениях были бы гаданием.</p></div>`; }
  if (grow) out += `<div class="card"><h2>Что можно развивать</h2><p><b>${PF_SC[grow].n}.</b> ${G_TXT[grow]}</p></div>`;
  return `<div class="card"><h2>Направления</h2><p class="hint">Доля верных ответов с первой попытки по каждому направлению. Сравниваем ребёнка только с самим собой.</p>${rows}<p class="hint">Основание: ${P.tot} ${pfWord(P.tot, 'ответ', 'ответа', 'ответов')} за ${P.days} ${pfWord(P.days, 'день', 'дня', 'дней')} занятий.</p></div>` + out + note;
}
