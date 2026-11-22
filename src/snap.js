/* Резервная копия прогресса: снимок каждого ребёнка хранится в таблице (лист «Снимки»).
   При входе ребёнка сверяемся: если в таблице снимок новее — берём его (другой айпад, значок вместо Safari, стёртые данные).
   Пока сверка не прошла, свой снимок не отправляем, чтобы пустое устройство не затёрло настоящий прогресс. */
const SNAP_OK = {}, SNAP_PUSHED = {}; let SNAP_T = null, SNAP_BUSY = false;
function snapWork(K){ return Object.keys(K.days || {}).some(d => Object.keys((K.days[d] || {}).les || {}).length); }
function snapMark(){ if (TEST || !cur.kid || SNAP_BUSY) return; if (FAM) return famSnapMark(cur.kid); const K = S.kids[cur.kid]; if (!K) return; if (!SNAP_OK[cur.kid]) { if (snapWork(K) && K.modT) K.dirtyT = Date.now(); return; } K.modT = Date.now(); clearTimeout(SNAP_T); SNAP_T = setTimeout(snapPush, 45000); }
function snapPush(){ if (FAM) return famSnapPush(); if (TEST || !S.cfg.sync || !navigator.onLine) return; clearTimeout(SNAP_T);
  Object.keys(SNAP_OK).forEach(kid => { const K = S.kids[kid]; if (!K || !K.modT || SNAP_PUSHED[kid] === K.modT) return; const t = K.modT;
    try { fetch(S.cfg.sync, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ snap: 1, kid, t, state: JSON.stringify(K) }) }).then(() => { SNAP_PUSHED[kid] = t; }).catch(() => {}); } catch (e) {} }); }
async function snapCheck(kid){ if (FAM) return famSnapCheck(kid); if (TEST || !kid || SNAP_OK[kid] || !S.cfg.sync || !navigator.onLine) return;
  try { const r = await fetch(S.cfg.sync + (S.cfg.sync.includes('?') ? '&' : '?') + 'action=snap&kid=' + encodeURIComponent(kid)); const j = await r.json(); if (!j || !j.ok) return;
    const K = S.kids[kid]; if (j.t && j.state && j.t > Math.max(K.modT || 0, K.dirtyT || 0)) { const R = JSON.parse(j.state); if (R && typeof R === 'object' && R.days) { SNAP_BUSY = true; S.kids[kid] = R; if (typeof posFix === 'function') posFix(kid); save(); SNAP_BUSY = false; SNAP_PUSHED[kid] = R.modT; if (cur.kid === kid) { alertMsg('Прогресс загружен ✓'); if (cur.view === 'prizes' && R.prizesSet) go('home'); else render(); } } }
    SNAP_OK[kid] = true; if (!S.kids[kid].modT) { S.kids[kid].modT = Date.now(); } snapPush();
  } catch (e) {} }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') snapPush(); else if (cur.kid) snapCheck(cur.kid); });
setInterval(() => { if (cur.kid) snapCheck(cur.kid); }, 60000);
