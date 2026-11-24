/* Резервная копия прогресса: снимок каждого ребёнка хранится в таблице (лист «Снимки»).
   При входе ребёнка сверяемся: если в таблице снимок новее — берём его (другой айпад, значок вместо Safari, стёртые данные).
   Пока сверка не прошла, свой снимок не отправляем, чтобы пустое устройство не затёрло настоящий прогресс. */
const SNAP_OK = {}, SNAP_PUSHED = {}; let SNAP_T = null, SNAP_BUSY = false;
function snapWork(K){ return Object.keys(K.days || {}).some(d => Object.keys((K.days[d] || {}).les || {}).length); }
/* Слияние снимков (24.11.2026): незаконченный урок продолжается с того же места на любом устройстве.
   Решает не только время снимка, но и сделанная работа: более «старый» по часам, но с большим числом пройденного снимок
   не затирается чужим (родитель на телефоне поменял цену — его копия ребёнка была старой). Начатые уроки, где своё
   устройство продвинулось дальше, переносятся в принятый снимок; баллы за урок начисляются только при его завершении — двойных нет. */
const SNAP_PH = { theory:1, warm:1, read:2, practice:2, silent:3, fread:3, retell:4, qs:5, spot:6, words:7, survey:8 };
function snapLesProg(L){ if (!L) return -1; if (L.phase === 'done') return 1e6; const a = (L.ans || []).filter(x => x != null).length; return (SNAP_PH[L.phase] || 0) * 1000 + a * 10 + (L.i || 0) + (L.wi || 0) + (L.rt ? 5 : 0); }
function snapWorkN(K){ let n = 0; for (const d of Object.keys(K.days || {})) { const les = (K.days[d] || {}).les || {}; for (const s of Object.keys(les)) n += les[s] && les[s].phase === 'done' ? 1000 : 1 + Math.min(999, Math.floor(snapLesProg(les[s]) / 10)); } return n + (K.purchases || []).length + (K.hwText || []).filter(h => h.done).length; }
function snapMerge(L, R, rt){ try {
  if (!L || !snapWork(L)) return R;
  if (snapWorkN(R) < snapWorkN(L)) { /* в пришедшем снимке меньше сделано — это устаревшая копия; оставляем своё, забираем только настройки родителя */
    ['shop', 'allow', 'xt', 'prizesSet'].forEach(f => { if (R[f] !== undefined) L[f] = R[f]; });
    const ids = {}; (L.msgs || []).forEach(m => { ids[m.id] = 1; }); (R.msgs || []).forEach(m => { if (!ids[m.id]) L.msgs.push(m); });
    const hw = {}; (L.hwText || []).forEach(h => { hw[h.id] = h; }); (R.hwText || []).forEach(h => { if (!hw[h.id]) L.hwText.push(h); else if (h.done) hw[h.id].done = h.done; });
    return L; }
  for (const d of Object.keys(L.days || {})) { const ll = (L.days[d] || {}).les || {}; for (const s of Object.keys(ll)) { const a = ll[s]; if (!a || a.phase === 'done') continue;
    const RD = R.days[d] || (R.days[d] = { les: {}, bonus: false }); RD.les = RD.les || {}; if (snapLesProg(a) > snapLesProg(RD.les[s])) RD.les[s] = a; } }
  if (L.openDay && (!R.openDay || L.openDay > R.openDay)) R.openDay = L.openDay;
  } catch (e) {} return R; }
function snapMark(){ if (TEST || !cur.kid || SNAP_BUSY) return; if (FAM) return famSnapMark(cur.kid); const K = S.kids[cur.kid]; if (!K) return; if (!SNAP_OK[cur.kid]) { if (snapWork(K) && K.modT) K.dirtyT = Date.now(); return; } K.modT = Date.now(); clearTimeout(SNAP_T); SNAP_T = setTimeout(snapPush, 45000); }
function snapPush(){ if (FAM) return famSnapPush(); if (TEST || !S.cfg.sync || !navigator.onLine) return; clearTimeout(SNAP_T);
  Object.keys(SNAP_OK).forEach(kid => { const K = S.kids[kid]; if (!K || !K.modT || SNAP_PUSHED[kid] === K.modT) return; const t = K.modT;
    const body = JSON.stringify({ snap: 1, kid, t, state: JSON.stringify(K) }); /* keepalive браузер принимает только до 64 КБ — большой снимок с ним молча не уходил (у Ани с 22.11) */
    try { fetch(S.cfg.sync, { method: 'POST', mode: 'no-cors', keepalive: body.length < 60000, headers: { 'Content-Type': 'text/plain' }, body }).then(() => { SNAP_PUSHED[kid] = t; }).catch(() => {}); } catch (e) {} }); }
async function snapCheck(kid){ if (FAM) return famSnapCheck(kid); if (TEST || !kid || SNAP_OK[kid] || !S.cfg.sync || !navigator.onLine) return;
  try { const r = await fetch(S.cfg.sync + (S.cfg.sync.includes('?') ? '&' : '?') + 'action=snap&kid=' + encodeURIComponent(kid)); const j = await r.json(); if (!j || !j.ok) return;
    const K = S.kids[kid]; if (j.t && j.state && j.t > Math.max(K.modT || 0, K.dirtyT || 0)) { let R = JSON.parse(j.state); if (R && typeof R === 'object' && R.days) { R = snapMerge(K, R, j.t); if (R === K) { SNAP_OK[kid] = true; K.modT = Date.now(); snapPush(); return; } SNAP_BUSY = true; S.kids[kid] = R; if (typeof posFix === 'function') posFix(kid); save(); SNAP_BUSY = false; SNAP_PUSHED[kid] = R.modT; if (cur.kid === kid) { alertMsg('Прогресс загружен ✓'); if (cur.view === 'prizes' && R.prizesSet) go('home'); else render(); } } }
    SNAP_OK[kid] = true; if (!S.kids[kid].modT) { S.kids[kid].modT = Date.now(); } snapPush();
  } catch (e) {} }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') snapPush(); else if (cur.kid) snapCheck(cur.kid); });
setInterval(() => { if (cur.kid) snapCheck(cur.kid); }, 60000);
