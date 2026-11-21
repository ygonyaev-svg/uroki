/* ===== Домашнее задание = работа над ошибками прошлого урока =====
   Правило Юры (21.11): ошибки урока — это ДЗ по предмету. Его нужно сделать до следующего урока по этому предмету,
   иначе за следующий урок баллов будет 70%. Делать можно в любое время, даже в перерыв.
   Задание исправлено, если ребёнок решил его сам; после ошибки даём похожее новое задание (ответ уже показан — повторять то же нечестно). */
const HW_K = .7;
function hwLes(kid, ds, s){ const D = S.kids[kid].days[ds], L = D && D.les && D.les[s]; return L && L.phase === 'done' && L.ans && L.ans.length && !ITEMS(s) && s !== 'read' ? L : null; }
/* последний урок по предмету до дня ds (не включая) — если в нём есть неисправленные ошибки */
function hwOwed(kid, s, ds){ const days = Object.keys(S.kids[kid].days || {}).filter(d => d < ds).sort().reverse().slice(0, 30);
  for (const d of days) { const L = hwLes(kid, d, s); if (!L) continue; const W = fixList(kid, s, L).filter(j => !L.ans[j].fix); return W.length ? { ds: d, n: W.length, all: fixList(kid, s, L).length } : null; } return null; }
function hwAll(kid){ const tomorrow = U.addDays(U.today(), 1); return (KIDS[kid].order || []).map(s => { const o = hwOwed(kid, s, tomorrow); return o ? Object.assign({ s }, o) : null; }).filter(Boolean); }
function hwCard(kid){ if (TEST && !cur.kid) return ''; const H = hwAll(kid); if (!H.length) return '';
  return `<div class="card hwc"><h2>📒 Домашнее задание</h2><p class="hint">Исправь ошибки до следующего урока по предмету. Если не сделаешь — за следующий урок будет только 70% баллов. Делать можно в любое время, даже в перерыв.</p>
   ${H.map(h => `<div class="hwrow"><div><b>${U.esc(subjName(kid, h.s, h.ds))}</b> · ${h.ds === U.today() ? 'сегодня' : U.esc(h.ds.slice(8) + '.' + h.ds.slice(5, 7))}<br><span class="hint">Исправить: ${h.n} из ${h.all}</span></div><button class="btn small" data-act="hwgo" data-s="${h.s}" data-d="${h.ds}">Делать</button></div>`).join('')}</div>`; }
function hwNote(kid, s){ const o = hwOwed(kid, s, cur.ds); if (!o) return ''; return `<div class="note">📒 Не сделано домашнее задание по прошлому уроку (${o.n} ${U.pl(o.n, 'ошибка', 'ошибки', 'ошибок')}). Если начнёшь урок без него, баллов будет 70%. <button class="link" data-act="hwgo" data-s="${s}" data-d="${o.ds}">Сделать ДЗ →</button></div>`; }
function hwSimilar(kid, s, L, t, n){ if (!n) return t; const u = unitById(kid, s, L.uid); if (!u || t.rev) return t; const shape = x => strip(x.q).replace(/\d+([,.]\d+)?/g, '#').slice(0, 18);
  const c = genTasks(u, (L.seed || 1) * 13 + n * 211, 14).filter(x => x.q !== t.q); return c.find(x => shape(x) === shape(t)) || c.find(x => x.k === t.k) || t; }
function hwCur(){ const h = cur.hw, kid = cur.kid, L = h && hwLes(kid, h.ds, h.s); if (!L) return null; const W = fixList(kid, h.s, L), left = W.filter(j => !L.ans[j].fix);
  const i = h.i != null && W.includes(h.i) && (!L.ans[h.i].fix || h.done) ? h.i : left[0]; if (i == null) return { L, W, left }; const a = L.ans[i]; const t = hwSimilar(kid, h.s, L, lessonTasks(L, kid, h.s)[i], a.hwN || 0); return { L, W, left, i, a, t }; }
function vHwFix(){ const kid = cur.kid, h = cur.hw || {}, c = hwCur(); const head = `<main class="wrap ${LK(kid)}"><header class="bar"><button class="link" data-act="home">← К урокам</button><span class="coins">${coinsHtml(S.kids[kid].coins)}</span></header><section class="lesson"><p class="eyebrow">📒 Домашнее задание</p><h1>${U.esc(c ? subjName(kid, h.s, h.ds) : '')}: работа над ошибками</h1>`;
  if (!c) return head + '<p>Не нашёл этот урок.</p></section></main>';
  if (c.i == null) return head + `<article class="card result"><div class="cheer">✅ Домашнее задание сделано!</div><p>Все ошибки исправлены. Следующий урок по этому предмету — с полными баллами.</p></article><button class="btn big" data-act="home">К урокам</button></section></main>`;
  const { t, a, i, W, left } = c, r = h.r || {}, fin = r.fin;
  let inp; if (t.k === 'c') inp = `<div class="opts">${t.opts.map(o => `<button class="opt ${fin && o === t.a ? 'right' : r.v === o && !r.ok ? 'wrong' : ''}" data-act="hwc" data-v="${U.esc(o)}" ${fin ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
  else inp = `<form class="numf" data-form="hwf"><input id="hwin" ${t.k === 't' ? 'autocapitalize="off" autocorrect="off" spellcheck="false"' : 'inputmode="decimal"'} autocomplete="off" ${fin ? 'disabled' : 'autofocus'} value="${fin ? U.esc(r.v) : ''}" aria-label="Ответ"><button class="btn" ${fin ? 'disabled' : ''}>Проверить</button></form>`;
  const ra = t.k === 'n' ? U.dec(t.a) : U.esc(t.a);
  const fb = fin ? (r.ok ? `<div class="fb ok"><b>Исправлено! ✓</b> ${t.e ? U.esc(strip(t.e)) : ''}</div>` : `<div class="fb bad"><b>Правильный ответ: ${ra}</b> ${t.e ? U.esc(strip(t.e)) : ''}<br><span class="hint">Разберись в объяснении — дальше будет похожее задание.</span></div>`) : '';
  const was = (a.hwN || 0) ? '<p class="hint">Похожее задание вместо того, где ты ошибся.</p>' : `<p class="hint">В уроке ты ${a.ok ? 'ответил не с первого раза' : 'ответил «' + U.esc(String(a.v)) + '»'}.</p>`;
  return head + `<div class="counter">Осталось исправить: ${left.length} из ${W.length}</div><article class="card task"><div class="q">${t.k === 't' ? t.q : t.q.replace(/_+/g, '<span class="gap">?</span>')}</div>${illus(kid, t.sj || h.s, t)}${was}${inp}${fb}${fin ? '' : '<details class="peek"><summary>Правило</summary><div class="th">' + ((unitById(kid, h.s, c.L.uid) || {}).th || '') + '</div></details>'}</article>
   ${fin ? `<button class="btn big" data-act="hwnext">Дальше</button>` : ''}</section></main>`; }
function hwAnswer(v){ const kid = cur.kid, c = hwCur(); if (!c || c.i == null) return; const h = cur.hw, t = c.t; if (h.r && h.r.fin) return; let ok;
  if (t.k === 'n') { const x = Number(String(v).replace(',', '.').replace(/\s/g, '')); if (String(v).trim() === '' || isNaN(x)) return; ok = Math.abs(x - t.a) < 1e-6; } else if (t.k === 't') { if (!String(v).trim()) return; ok = txtOk(t, v); } else ok = v === t.a;
  h.r = { fin: true, ok, v }; h.i = c.i; h.done = true;
  if (ok) c.a.fix = true; else c.a.hwN = (c.a.hwN || 0) + 1;
  ev(kid, ok ? 'дз исправлено' : 'дз ошибка', { subj: subjName(kid, h.s, h.ds), unit: (unitById(kid, h.s, c.L.uid) || {}).t || '', q: strip(t.q), ans: String(v), right: String(t.a), ok: ok ? 'верно' : 'ошибка' });
  save(); render(); }
function hwAct(act, b){ if (act === 'hwgo') { go('hwfix', { hw: { s: b.dataset.s, ds: b.dataset.d } }); return true; }
  if (cur.view !== 'hwfix') return false;
  if (act === 'hwc') { hwAnswer(b.dataset.v); return true; }
  if (act === 'hwnext') { const c = hwCur(); cur.hw = { s: cur.hw.s, ds: cur.hw.ds }; if (c && !hwCur().left.length) { const kid = cur.kid; ev(kid, 'дз сделано', { subj: subjName(kid, cur.hw.s, cur.hw.ds) }); alertMsg('Домашнее задание сделано! ✅'); } render(); window.scrollTo(0, 0); return true; }
  return false; }
