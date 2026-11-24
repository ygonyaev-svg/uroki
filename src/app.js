/* ===== Настройка детей ===== */
CUR_Y.lang = { name:'Языки', src:'Português: 2.º–3.º ano (gramática, ortografia) и English', units: PT_NAT, old: PT_Y, alt: EN_UNITS, altName:'English' };
CUR_A.logic.alt = A_FIN; CUR_A.logic.altName = 'Финансы'; CUR_Y.world.alt = Y_FIN; CUR_Y.world.altName = 'Деньги'; CUR_Y.world.altSrc = 'Финансовая грамотность (по стандартам Jump$tart, K-5)';
delete CUR_Y.pt;
/* Блок «Продолжение» (решение методсовета, п. 2): темы следующего класса помечены в программах cont:1 и стоят в конце своих списков,
   после основной программы; порядок внутри основной части и внутри «Продолжения» сохраняется. Позиция детей переносится по id (posmap.js). */
function contLast(list){ if (!list) return; const a = list.filter(u => !u.cont), b = list.filter(u => u.cont); if (!b.length) return; list.length = 0; for (const u of a.concat(b)) list.push(u); }
for (const C0 of [CUR_Y, CUR_A]) for (const c of Object.values(C0)) { contLast(c.units); contLast(c.alt); }
const CONT_MARK = u => u && u.cont ? 'Продолжение · ' : '';
const KIDS_TPL = {
  yarik: { name:'Ярик', grade:'2 класс', cur: CUR_Y, read: READ_Y, n: 10, w: { read: .24, rus: .13, lang: .13, math: .30, world: .10, logic: .10, hw: .05 }, norm: 55, startWords: 60, rplan: !FAM, rdLv: 0, order:['read','math','rus','world','logic','lang'] },
  anya:  { name:'Аня',  grade:'5 класс', cur: CUR_A, read: READ_A, n: 14, w: { read: .22, rus: .16, lang: .12, math: .26, hist: .12, logic: .12, hw: .05 }, norm: 110, startWords: 150, rdLv: 3, order:['read','math','rus','hist','logic','lang'] }
};
const KIDS = FAM ? {} : KIDS_TPL;
/* Шаблон программы (yarik — младшие, anya — старшие) и оформление ребёнка; в семейной версии дети заводятся родителями */
const TPL = k => T(k);
function T(k){ return FAM ? ((KIDS[k] && KIDS[k].tpl) || 'yarik') : k; }
function LK(k){ return FAM ? ((KIDS[k] && KIDS[k].look) || T(k)) : (typeof lookId === 'function' && lookId(k) ? LOOKS[lookId(k)].base : k); }
function TH(k){ return FAM && THEME['k:' + k] ? 'k:' + k : !FAM && typeof lookTheme === 'function' && S && S.kids && S.kids[k] ? lookTheme(k) : LK(k); }
function kidIds(){ return FAM ? Object.keys(KIDS) : ['yarik', 'anya']; }
const SUBJ_ICON = { read:'Аа', math:'7+5', rus:'Ёё', world:'☼', hist:'XV', logic:'?!', lang:'Pt', hw:'ДЗ' };
const STEPS = [1, 3, 7];

/* ===== Хранилище ===== */
const KEY = FAM ? 'semya.v1' : 'uroki.v1';
let S;
/* Детям пишет Юра (отчим): «папа» в сообщениях из таблицы заменяем. */
function noPapa(s){ return String(s).replace(/от папы/gi, 'от Юры').replace(/папа/gi, 'Юра').replace(/папы/gi, 'Юры').replace(/папе/gi, 'Юре'); }
function newKid(){ return { pin:null, coins:0, pos:{}, lvl:{}, stats:{}, days:{}, reading:[], hard:{}, srs:[], purchases:[], words:0, texts:0, applied:[], msgs:[], hwText:[] }; }
function defShop(){ return [
  { id:'s1', name:'15 минут игры на планшете', price:15 },
  { id:'s2', name:'30 минут мультиков', price:30 },
  { id:'g60', name:'🎮 Час игры', price:60 },
  { id:'s3', name:'Сладость на выбор', price:30 },
  { id:'s4', name:'Выбрать ужин для всей семьи', price:80 },
  { id:'s6', name:'Подарок до 10 €', price:400 } ]; }
function load(){ try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return s; } catch (e) {} return { v:1, parentPin:null, kids: FAM ? {} : { yarik:newKid(), anya:newKid() }, shop:defShop(), cfg:{ sync:'' }, queue:[], log:[] }; }
function save(){ try { if (S.kids) for (const k of Object.keys(S.kids)) if (KIDS[k]) posMark(k); } catch (e) {} try { if (TEST) { localStorage.setItem(KEY + '.test', JSON.stringify(S)); return; } if (typeof snapMark === 'function') snapMark(); localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
const SYNC_URL = 'https://script.google.com/macros/s/AKfycbzlcMocKjYfldhFSe25-6w9_HVEN0sXMmlJrbj1VWuqMhHvQo5Fs-M0J7zZW2sDYEM3sw/exec';
S = load();
if (FAM) famInit();
if (!S.cfg.sync) S.cfg.sync = SYNC_URL;
if (!S.shopV2) { const fix = { s1: ['15 минут игры', 15], s2: ['30 минут мультиков', 30], t3: ['🎮 30 минут любимой игры', 30] }; for (const it of S.shop) if (fix[it.id]) { it.name = fix[it.id][0]; it.price = fix[it.id][1]; } if (!S.shop.some(x => x.id === 'g60')) S.shop.splice(2, 0, { id: 'g60', name: '🎮 Час игры', price: 60 }); S.shopV2 = true; }
S.shop = (S.shop || []).filter(x => !/пап/i.test(x.name));
/* Крупные призы — примерно месяц стабильных занятий (≈50 баллов в день) */
{ const NP = { match: [600, 1500], trip: [600, 1500], ball: [500, 800], zoo: [350, 700], cafe: [400, 600] };
  for (const k of kidIds()) for (const it of (S.kids[k] && S.kids[k].shop) || []) { const r = NP[it.id]; if (r && it.price === r[0]) it.price = r[1]; } }
/* 21.11: Ярику — математика с умножения, португальский для носителя с начала; Ане — уровень выше */
if (!S.mig2 && S.kids && S.kids.yarik) { const Y = S.kids.yarik, A = S.kids.anya; Y.pos = Y.pos || {}; Y.pos.math = Math.max(Y.pos.math || 0, 9); Y.pos.lang = 0; A.lvl = A.lvl || {}; for (const sj of ['math', 'rus', 'logic', 'lang', 'hist']) A.lvl[sj] = Math.max(A.lvl[sj] || 0, 1); S.mig2 = 1; }
/* Позиции в программе — по id темы (src/posmap.js) */
if (S.kids) for (const k of Object.keys(S.kids)) if (KIDS[k]) posFix(k);
const hashPin = p => String(U.h('uroki:' + p));

/* ===== Синхронизация с Google Таблицей родителя ===== */
function strip(h){ return String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
/* В таблицу — чистый текст: без HTML, &nbsp; и эмодзи */
function evClean(e){ const o = {}; for (const k in e) { let v = e[k]; if (typeof v === 'string' && k !== 't') { v = v.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'); v = emoStrip(v.replace(EMO_RE, '\u0001')).replace(/\u0001+/g, m => m.length > 1 ? '[' + m.length + ' карт.]' : '').replace(/[ \u00a0]{2,}/g, ' ').trim(); if (/^[=+]/.test(v)) v = "'" + v; /* «=» в начале Таблица считает формулой (#ERROR!) */ } o[k] = v; } return o; }
function ev(kid, type, data){ const e = Object.assign({ t: new Date().toISOString(), kid: KIDS[kid].name, type }, data); if (!TEST) S.queue.push(evClean(e)); S.log.push(e); if (S.log.length > 1500) S.log = S.log.slice(-1500); try { dripOn(kid, type, data || {}); } catch (x) {} if (typeof pfOn === 'function') pfOn(kid, e); save(); flushSoon(); }
/* озвучка в уроке: одна запись на шаг (для динамики самостоятельного чтения) */
function voiceEv(kid, L, what){ if (!L) return; const k = what + ':' + (L.phase || '') + ':' + (L.i || 0); L._vo = L._vo || {}; if (L._vo[k]) return; L._vo[k] = 1; ev(kid, 'озвучка', { subj: subjName(kid, cur.subj, cur.ds), unit: (unitById(kid, cur.subj, L.uid) || {}).t || '', text: what }); }
/* «Капающий процент»: каждый верный ответ с первой попытки — где угодно в приложении — немного увеличивает накопленный капитал (счёт + копилка).
   +0,4% капитала за ответ (не меньше 0,2 балла); серия 5 верных подряд — ×1,5, серия 10 — ×2; ошибка обнуляет серию и ничего не даёт.
   Потолок за день: 3% капитала, но не меньше 10 баллов. Капает в копилку (в воскресенье +10% сверху). */
const DRIP_RATE = .004, DRIP_MIN = .2, DRIP_CAP = .03, DRIP_CAP_MIN = 10;
function dripRec(K){ const d = U.today(); if (!K.drip || K.drip.d !== d) K.drip = { d, got: 0, frac: 0, streak: (K.drip && K.drip.streak) || 0, sess: (K.drip && K.drip.sess) || 0, cap: Math.max(DRIP_CAP_MIN, Math.round(((K.coins || 0) + (K.piggy || 0)) * DRIP_CAP)) }; return K.drip; }
function dripOn(kid, type, d){ const K = S.kids[kid]; if (!K) return; if (/^(загадка|головоломка|задача на смекалку|шахматы|программирование)$/.test(type)) return; /* после уроков баллы — только чтением (правило Юры 22.11) */
  const chessOk = type === 'шахматы' && /с первой попытки/.test(d.text || '') && !/не с первой/.test(d.text || ''), chessBad = type === 'шахматы' && /не с первой/.test(d.text || '');
  const ok = d.ok === 'верно' || chessOk, bad = d.ok === 'ошибка' || d.ok === 'со 2-й попытки' || chessBad; if (!ok && !bad) return;
  const R = dripRec(K); if (bad) { R.streak = 0; return; }
  R.streak++; if (R.got >= R.cap) return;
  const cap0 = (K.coins || 0) + (K.piggy || 0), mult = R.streak >= 10 ? 2 : R.streak >= 5 ? 1.5 : 1;
  const add = Math.min(R.cap - R.got, Math.max(DRIP_MIN, cap0 * DRIP_RATE) * mult); R.got += add; R.sess += add; R.frac += add;
  const whole = Math.floor(R.frac); if (whole > 0) { R.frac -= whole; piggyAdd(K, whole); }
  dripFly(add); }
function dripFly(add){ try { const el = document.createElement('div'); el.className = 'dripfly'; el.textContent = '📈 +' + (Math.round(add * 10) / 10).toString().replace('.', ','); document.body.appendChild(el); setTimeout(() => el.remove(), 1600); } catch (e) {} }
function dripCard(kid){ const K = S.kids[kid], R = K.drip; if (!R || !(R.sess >= .1)) return ''; const n = (Math.round(R.sess * 10) / 10).toString().replace('.', ',');
  return `<div class="note dripc tipc" data-tip="drip">💰 <b>Пока ты занимался(ась), твой капитал вырос на +${n}!</b> Каждый верный ответ с первого раза добавляет немного к накопленному, а серия из 5 и 10 верных подряд ускоряет рост. Сегодня уже +${(Math.round(R.got * 10) / 10).toString().replace('.', ',')} из ${R.cap} возможных. <button class="link" data-act="dripseen">Здорово!</button></div>`; }
let flushT = null;
function flushSoon(){ clearTimeout(flushT); flushT = setTimeout(flush, 4000); }
async function flush(){
  if (TEST) return;
  if (!S.cfg.sync || !S.queue.length || !navigator.onLine || (FAM && !(S.fam && S.fam.fid))) return;
  const batch = S.queue.slice(0, 200);
  try { await fetch(S.cfg.sync, { method:'POST', mode:'no-cors', headers:{ 'Content-Type':'text/plain' }, body: JSON.stringify(FAM ? { fam:'ev', fid:S.fam.fid, token:S.fam.token, events: batch } : { events: batch }) }); S.queue = S.queue.slice(batch.length); save(); if (S.queue.length) flushSoon(); } catch (e) {}
}
async function pull(){
  if (TEST) return;
  if (FAM) { ptSync(); return famStatus(); }
  if (!S.cfg.sync || !navigator.onLine) return;
  try { const r = await fetch(S.cfg.sync + (S.cfg.sync.includes('?') ? '&' : '?') + 'action=cfg'); const j = await r.json(); applyCfg(j.rows || []); } catch (e) {}
}
function findUnit(kid, subj, val){
  const c = KIDS[kid].cur[subj]; if (!c || !c.units) return null; const v = String(val).toLowerCase().trim();
  for (const [track, list] of [['', c.units], ['_alt', c.alt || []]]) { const i = list.findIndex(u => u.id.toLowerCase() === v || u.t.toLowerCase().includes(v)); if (i >= 0) return { key: subj + track, i }; }
  return null;
}
function subjByName(kid, name){ const n = String(name || '').toLowerCase(); for (const [k, c] of Object.entries(KIDS[kid].cur)) if (k === n || c.name.toLowerCase().startsWith(n) || (c.altName && c.altName.toLowerCase().startsWith(n))) return k; return null; }
function applyCfg(rows){ let fresh = false;
  for (const row of rows) {
    const kid = /ан/i.test(row.kid) ? 'anya' : /яр/i.test(row.kid) ? 'yarik' : null; if (!kid || !row.id) continue;
    const K = S.kids[kid]; if (K.applied.includes(row.id)) continue;
    const type = String(row.type || '').toLowerCase();
    if (type.startsWith('тем')) { const s = subjByName(kid, row.subj); const f = s && findUnit(kid, s, row.value); if (f) { K.pos[f.key] = f.i; const Dt = K.days[U.today()], Lt = Dt && Dt.les && Dt.les[s]; if (Lt && Lt.phase !== 'done') delete Dt.les[s]; /* начатый сегодня урок по старой теме начнётся заново с новой */ } }
    else if (type.startsWith('дз')) K.hwText.push({ id: row.id, text: String(row.value), done: false });
    else if (type.startsWith('сооб')) K.msgs.push({ id: row.id, text: String(row.value), seen: false });
    else if (type.startsWith('монет')) K.coins += Number(row.value) || 0;
    else if (type.startsWith('чтен')) { const n = Number(row.value); if (n > 0) K.readWords = n; }
    else if (type.startsWith('книг')) bkApply(kid, row);
    else if (type.startsWith('задан') || type.startsWith('подтв')) ptFromRow(kid, row, type);
    else if (type.startsWith('врем')) { const t = U.today(), m = Math.round((Number(row.value) || 10) / 10) * 10; if (!K.xt || K.xt.d !== t) K.xt = { d: t, m: 0 }; K.xt.m = Math.max(0, Math.min(180, K.xt.m + m)); if (m > 0 && K.restForced && K.restUntil > Date.now()) { K.restUntil = 0; K.restForced = false; K.sess = Math.max(0, SESS_SECS + extraSecs(K) - m * 60); K.blkAt = Date.now(); } }
    else if (type.startsWith('перер')) { K.restUntil = 0; K.blk = 0; K.sess = 0; K.ask = false; }
    else if (type.startsWith('цен')) { const n = Math.round(Number(row.value)), q = String(row.subj || '').toLowerCase().trim(); const nm = x => emoStrip(String(x.name)).toLowerCase().replace(/\s+/g, ''), qn = q.replace(/\s+/g, ''), sh = K.shop || []; const part = sh.filter(x => qn.length >= 4 && isNaN(Number(qn)) && nm(x).includes(qn)); const it = q && (sh.find(x => x.id.toLowerCase() === q) || sh.find(x => nm(x) === qn) || (part.length === 1 ? part[0] : null)); /* сначала точное совпадение id/названия; часть названия — только если однозначно и не число (Таблица превращает «5€» в 5) */ if (!it || !(n > 0)) continue; /* приза ещё нет на этом устройстве — попробуем при следующей загрузке */ it.price = n; ev(kid, 'цена приза', { unit: it.name, price: n }); }
    else if (type.startsWith('уров')) { const s = subjByName(kid, row.subj), n = Math.round(Number(row.value)); if (s && !isNaN(n)) K.lvl[s] = Math.max(-2, Math.min(5, n)); } /* число заданий в уроке: база + уровень */
    else continue; /* незнакомую команду не отмечаем — её выполнит следующая версия приложения */
    K.applied.push(row.id); fresh = true;
  }
  if (fresh) { save(); if (cur.kid) softRender(); }
}

/* ===== Помощники по программе ===== */
function track(subj, ds){ const c = cur.K().cur[subj]; return c && c.alt && (U.dayNum(ds) % 2 === 1) ? '_alt' : ''; }
function unitsOf(kid, subj, tr){ const c = KIDS[kid].cur[subj]; return tr === '_alt' ? c.alt : c.units; }
function unitAt(kid, subj, tr){ const list = unitsOf(kid, subj, tr); const K = S.kids[kid]; let i = K.pos[subj + tr] || 0;
  if (i >= list.length) { /* программа пройдена — повторяем самые слабые темы */ const w = list.map((u, j) => [j, acc(K, u.id)]).sort((a, b) => a[1] - b[1]); i = w[0][0]; }
  return { u: list[i], i, total: list.length }; }
function acc(K, uid){ const s = K.stats[uid]; return s && s.n ? s.ok / s.n : 1; }
function genTasks(unit, seed, n){ const r = U.rng(seed); const out = []; const seen = new Set(); let guard = 0;
  while (out.length < n && guard++ < n * 12) { const t = unit.g(r); t.q = agree(t.q); t.e = agree(t.e); if (t.k === 'c' && /^\d+([.,]\d+)?$/.test(t.a) && t.w.every(x => /^\d+([.,]\d+)?$/.test(String(x)))) { t.k = 'n'; t.wn = t.w; t.a = Number(String(t.a).replace(',', '.')); delete t.w; } /* числа — только вводом, без угадывания */
    else if (t.k === 'c' && !t.ord && !t.kc && /^[a-zà-üа-яё'’-]+$/i.test(String(t.a)) && t.w.every(x => /^[a-zà-üа-яё'’-]+$/i.test(String(x))) && !TXT_KEEP[strip(t.q)] && !(FAM && (KIDS[cur.kid] || {}).noType) && (/_/.test(t.q) || new RegExp('(^|[^a-zà-üа-яё])' + String(t.a).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-zà-üа-яё]|$)', 'i').test(strip(t.q)))) { t.k = 't'; t.alt = TXT_ALT[strip(t.q)] || []; t.a = String(t.a); t.wx = t.w; delete t.w; } /* слово из вопроса или пропуск — пишем сами */ if (seen.has(t.q)) continue; seen.add(t.q); if (t.k === 'c') t.opts = t.ord ? [t.a, ...t.w].sort() : r.shuffle([t.a, ...t.w]); /* ord — варианты-буквы карточек (А, Б, В, Г) идут по порядку */ out.push(t); }
  return out; }
function grade(x){ return x >= .9 ? 5 : x >= .75 ? 4 : x >= .5 ? 3 : 2; }
function dayRec(kid, ds){ const K = S.kids[kid]; if (!K.days[ds]) K.days[ds] = { les:{}, bonus:false }; return K.days[ds]; }
function nTasks(kid, subj){ return Math.max(3, KIDS[kid].n + (S.kids[kid].lvl[subj] || 0) + (S.kids[kid].extraN || 0)); }

/* ===== Озвучка и распознавание речи ===== */
/* Живой голос: заранее записанные файлы (Gemini TTS) — tts/<голос>/<хеш>.mp3, список в tts/index.json. Если файла нет — голос системы. */
let TTS_HAVE = { f: {}, m: {} }, TTS_A = null;
try { fetch('tts/index.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).then(j => { if (j) for (const v of ['f', 'm']) { TTS_HAVE[v] = {}; for (const k of j[v] || []) TTS_HAVE[v][k] = 1; } }).catch(() => {}); } catch (e) {}
function ttsKey(text){ return U.h(String(text).replace(/\s+/g, ' ').trim()); }
function sayStop(){ try { if (TTS_A) { TTS_A.pause(); TTS_A = null; } if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} }
function say(text, lang){ const v = (cur.kid && S.kids[cur.kid].voice) || 'f', k = ttsKey(text);
  if (TTS_HAVE[v] && TTS_HAVE[v][k]) { sayStop(); try { TTS_A = new Audio(`tts/${v}/${k}.mp3`); const p = TTS_A.play(); if (p && p.catch) p.catch(() => sayRobot(text, lang)); return; } catch (e) {} }
  sayRobot(text, lang); }
function sayRobot(text, lang){ try { const s = window.speechSynthesis; if (!s) return; sayStop(); text = String(text).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, ' ').replace(/\s+/g, ' ').trim(); /* эмодзи системный голос читает названием («футбольный мяч») */ const u = new SpeechSynthesisUtterance(text); u.lang = lang || 'ru-RU'; const vs = s.getVoices(); const v = vs.find(v => v.lang === u.lang) || vs.find(v => v.lang && v.lang.startsWith(u.lang.slice(0, 2))); if (v) u.voice = v; u.rate = lang && lang.startsWith('ru') ? .9 : .85; s.speak(u); } catch (e) {} }
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const normW = w => w.toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]/gu, '');
function lev(a, b){ const m = a.length, n = b.length; if (!m) return n; if (!n) return m; let p = Array.from({ length: n + 1 }, (_, j) => j); for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; }
/* Сравнение слов при чтении вслух: распознавание речи путает окончания и похожие звуки даже у взрослых — сравниваем «по звучанию». */
function simPh(w){ return w.replace(/[ьъ]/g, '').replace(/[ёо]/g, 'а').replace(/[еэяиы]/g, 'и').replace(/ю/g, 'у').replace(/тс|дс|тьс/g, 'ц').replace(/(.)\1/g, '$1').replace(/[бвгдзж]$/, c => 'пфктсш'['бвгдзж'.indexOf(c)]); }
function sim(a, b){ if (a === b) return true; if (Math.abs(a.length - b.length) > 3) return false; const plus = FAM && b.length >= 4 ? (KIDS[cur.kid] || {}).simPlus || 0 : 0;
  if (lev(a, b) <= (b.length >= 7 ? 2 : b.length >= 4 ? 1 : 0) + plus) return true;
  if (!/[а-я]/.test(b)) return false; const x = simPh(a), y = simPh(b); if (x === y) return true;
  const sh = Math.min(x.length, y.length), lg = Math.max(x.length, y.length); if (sh >= 3 && lg - sh <= 2 && (x.startsWith(y) || y.startsWith(x))) return true;
  return lg >= 4 && lev(x, y) <= (lg >= 7 ? 2 : 1); }
/* Сверка прочитанного с текстом (22.11, см. «Голос — итог 22.11»): выравниваем весь отрывок целиком, а не «жадно».
   Правило: ошибку засчитываем, только когда уверены. st: 1 — верно, 3 — похоже (подсказка, без штрафа), 2 — ошибка, 0 — ещё не читал или не услышали. */
const NUMW = /^(од|дв|тр|чет|пят|шест|сем|восем|девят|десят|сорок|девяност|сот|ст[оа]|тысяч|нол|нул)/;
const ALC = new Map(); /* кэш сравнений слов между пересчётами — живая подсветка пересчитывается много раз */
function alignSc(s, t){ if (s === t) return 2; if (/^\d+$/.test(s)) return NUMW.test(t) ? 2 : -1; if (simPh(s) === simPh(t)) return 2; return sim(s, t) ? 1 : -1; }
function align(T, spoken){ const m = T.length, n = spoken.length, st = new Array(m).fill(0);
  if (!m || !n) return { st, p: 0, extra: n };
  const W = 40, NEG = -1e9, sc = (s, t) => { const k = s + '|' + t; let v = ALC.get(k); if (v === undefined) { if (ALC.size > 60000) ALC.clear(); v = alignSc(s, t); ALC.set(k, v); } return v; };
  const D = [], P = []; for (let i = 0; i <= m; i++) { D.push(new Float32Array(n + 1).fill(NEG)); P.push(new Uint8Array(n + 1)); }
  D[0][0] = 0; for (let j = 1; j <= n; j++) { D[0][j] = -0.5 * j; P[0][j] = 2; } for (let i = 1; i <= m && i <= W; i++) { D[i][0] = -i; P[i][0] = 1; }
  for (let i = 1; i <= m; i++) { const lo = Math.max(1, i - W), hi = Math.min(n, i + W); const Ti = T[i - 1];
    for (let j = lo; j <= hi; j++) { let best = NEG, bp = 0, v;
      if (D[i - 1][j - 1] > NEG) { v = D[i - 1][j - 1] + sc(spoken[j - 1], Ti); if (v > best) { best = v; bp = 0; } }
      if (D[i - 1][j] > NEG) { v = D[i - 1][j] - 1; if (v > best) { best = v; bp = 1; } }
      if (D[i][j - 1] > NEG) { v = D[i][j - 1] - 0.5; if (v > best) { best = v; bp = 2; } }
      if (j >= 2 && D[i - 1][j - 2] > NEG && Ti.length > spoken[j - 1].length) { const x = sc(spoken[j - 2] + spoken[j - 1], Ti); if (x > 0) { v = D[i - 1][j - 2] + x; if (v > best) { best = v; bp = 3; } } } /* «проказница» + «мартышка» */
      if (i >= 2 && D[i - 2][j - 1] > NEG) { const x = sc(spoken[j - 1], T[i - 2] + Ti); if (x > 0) { v = D[i - 2][j - 1] + x + 0.5; if (v > best) { best = v; bp = 4; } } } /* «стара я» = «старая» */
      D[i][j] = best; P[i][j] = bp; } }
  /* конец чтения — там, где выравнивание лучше всего (дальше ребёнок ещё не читал) */
  let bi = 0, bv = D[0][n]; for (let i = 1; i <= m; i++) if (D[i][n] > bv + 1e-6) { bv = D[i][n]; bi = i; }
  let i = bi, j = n, extra = 0; const del = new Array(m).fill(false);
  while (i > 0 || j > 0) { const p = i > 0 && j > 0 ? P[i][j] : i > 0 ? 1 : 2;
    if (p === 0) { const x = sc(spoken[j - 1], T[i - 1]); st[i - 1] = x === 2 ? 1 : x === 1 ? 3 : 2; i--; j--; }
    else if (p === 3) { st[i - 1] = 1; i--; j -= 2; } else if (p === 4) { st[i - 1] = st[i - 2] = 1; i -= 2; j--; }
    else if (p === 1) { del[i - 1] = true; i--; } else { extra++; j--; } }
  const digits = spoken.some(w => /^\d+$/.test(w));
  /* не услышали слово — это не ошибка ребёнка (диктовка теряет слова). Ошибка — только пропуск целой фразы (4+ слов подряд) */
  for (let k = 0; k < bi; k++) if (del[k]) { let e = k; while (e < bi && del[e]) e++; const run = e - k;
    for (let q = k; q < e; q++) st[q] = T[q].length <= 2 || (digits && NUMW.test(T[q])) ? 1 : run >= 4 ? 2 : 0; k = e - 1; }
  return { st, p: bi, extra }; }
/* класс слова при чтении вслух */
function wCls(st, k, p){ return st ? (st[k] === 1 ? 'r1' : st[k] === 2 ? 'r2' : st[k] === 3 ? 'r3' : k === p ? 'rc' : '') : ''; }

/* Часы работы (правило Юры 21.11): детская часть — с 8:00 до 21:00 по Лиссабону. «Для родителей» и тестовый режим — всегда. */
const OPEN_H = 8, CLOSE_H = 21;
function lisbonHour(){ try { const p = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Lisbon', hour: '2-digit', hour12: false }); const h = parseInt(p, 10); if (!isNaN(h)) return h % 24; } catch (e) {} return new Date().getHours(); }
function sleepNow(){ const h = lisbonHour(); return h < OPEN_H || h >= CLOSE_H; }
function vSleep(){ const h = lisbonHour(); return `<main class="wrap ${LK(cur.kid)}"><header class="bar"><button class="link" data-act="logout">← Выйти</button></header><section class="lesson"><article class="card result"><div class="cheer">🌙</div><h1 style="color:#2a2622">Сейчас приложение спит</h1><p>Уроки открыты с <b>8 утра до 9 вечера</b>. ${h >= CLOSE_H ? 'Пора отдыхать — почитай бумажную книжку перед сном 📖' : 'Ещё рано — приходи в 8 утра ☀️'}</p><p class="hint">Все баллы и прогресс сохранены.</p></article></section></main>`; }
setInterval(() => { if (cur.kid && !TEST && cur.view !== 'parent' && ((sleepNow() ? 1 : 0) !== (cur.slept || 0))) { cur.slept = sleepNow() ? 1 : 0; render(); } }, 60000);

/* ===== Состояние экрана ===== */
const cur = { kid:null, view:'login', subj:null, ds:U.today(), K(){ return KIDS[this.kid]; }, pinFor:null, onPin:null, parentTab:'home', parentKid:'yarik', msg:'' };
const app = () => document.getElementById('app');
function go(view, extra){ try { sayStop(); } catch (e) {} try { micStop(); } catch (e) {} try { if (view !== 'lib') libStop(); } catch (e) {} Object.assign(cur, { view, rview: null, rtask: null, rtry: null, rtCheck: null, rtDraft: '' }, extra || {}); render(); window.scrollTo(0, 0);
  if (view === 'lesson' && cur.kid && cur.subj) { const D = S.kids[cur.kid].days[cur.ds], L = D && D.les[cur.subj]; if (L && L.scrollY && L.scrollY.ph === (L.phase || '') + (L.fphase || '')) { const y = L.scrollY.y; setTimeout(() => window.scrollTo(0, y), 60); } } }
/* Запоминаем, докуда ребёнок долистал текст, чтобы вернуться на то же место */
function rememberScroll(){ if (cur.view !== 'lesson' || !cur.kid || !cur.subj) return; const D = S.kids[cur.kid].days[cur.ds], L = D && D.les[cur.subj]; if (L) { L.scrollY = { ph: (L.phase || '') + (L.fphase || ''), y: window.scrollY || 0 }; save(); } }
function coinsHtml(n){ const K = cur.kid && S.kids[cur.kid]; return `<span class="tipc" data-tip="coins"><span class="coin" aria-hidden="true"></span><b>${n}</b></span>${K ? `<span class="tipc pigh" data-tip="piggy">🐷<b>${K.piggy || 0}</b></span>` : ''}`; }

/* ===== Экраны ===== */
/* Пол ребёнка (анкета Словохода): «прочитал» / «прочитала». Без пола — по шаблону, как у Ярика и Ани */
function GIRL(kid){ const k = KIDS[kid]; return k && k.sex ? k.sex === 'f' : T(kid) === 'anya'; }
function sexify(h, kid){ if (!kid || !KIDS[kid] || !KIDS[kid].sex) return h; const f = KIDS[kid].sex === 'f'; return h.replace(/([А-Яа-яЁё]+)\(а\)/g, (m, w) => f ? w + 'а' : w); }
function render(){
  /* Сгорание и копилку считаем только по сверенному с таблицей прогрессу ребёнка: на чужом айпаде копия может быть старой (23.11: у Ярика «сгорели» баллы на айпаде Ани, хотя день 22.11 он закрыл на своём) */
  if (S.parentPin) for (const k of kidIds()) { if (!FAM && !TEST && S.cfg.sync && typeof SNAP_OK !== 'undefined' && !SNAP_OK[k]) continue; burnCheck(k); piggyCheck(k); }
  if (cur.kid && S.kids[cur.kid] && cur.view !== 'parent') ptPay(cur.kid);
  cur.ds = cur.kid ? lessonDay(cur.kid) : U.today();
  if (typeof hpApply === 'function') hpApply();
  let v = FAM && famGate() ? famGate() : !S.parentPin ? vSetup() : cur.view === 'pin' ? vPin() : cur.view === 'home' ? vHome() : cur.view === 'lesson' ? vLesson() : cur.view === 'prizes' ? vPrizes() : cur.view === 'shop' ? vShop() : cur.view === 'books' ? vBooks() : cur.view === 'book' ? vBook() : cur.view === 'bkadd' ? vBkAdd() : cur.view === 'parent' ? vParent() : cur.view === 'always' ? vAlways() : cur.view === 'poem' ? vPoem() : cur.view === 'hwfix' ? vHwFix() : cur.view === 'lib' ? vLib() : cur.view === 'ptask' ? vPTask() : vLogin();
  if (!TEST && cur.kid && S.parentPin && cur.view !== 'parent' && cur.view !== 'pin' && sleepNow()) { try { if (RD && RD.active) pauseRead(); } catch (e) {} try { micStop(); } catch (e) {} try { libStop(); } catch (e) {} v = vSleep(); }
  else if (!TEST && cur.kid && S.parentPin && cur.view !== 'parent' && cur.view !== 'pin' && restLeft(cur.kid)) { try { if (RD && RD.active) pauseRead(); } catch (e) {} try { micStop(); } catch (e) {} try { libStop(); } catch (e) {} v = vRestScreen(cur.kid); }
  else if (!TEST && cur.kid && S.parentPin && cur.view !== 'parent' && cur.view !== 'pin' && restAsk(cur.kid) && !(RD && RD.active) && !(LR && LR.active)) v = vAsk(cur.kid);
  document.body.className = cur.kid && ['home', 'lesson', 'shop', 'prizes', 'books', 'book', 'bkadd', 'always', 'hwfix', 'lib'].includes(cur.view) ? LK(cur.kid) + (typeof lookBody === 'function' ? lookBody(cur.kid) : '') + (typeof hpBodyCls === 'function' ? hpBodyCls(cur.kid) : '') : '';
  if (typeof lookVars === 'function') lookVars(document.body.className ? cur.kid : null);
  if (FAM) famBody();
  app().innerHTML = (TEST ? testBar() : '') + (FAM ? sexify(v, cur.view === 'parent' ? cur.parentKid : cur.kid) : v); afterRender();
}
function afterRender(){ const f = app().querySelector('[autofocus]'); if (f) try { f.focus(); } catch (e) {} }

function vSetup(){
  return `<main class="wrap narrow"><header class="hero"><p class="eyebrow">Первый запуск</p><h1>Уроки для Ярика и Ани</h1><p>Придумайте четыре цифры для родителя и для каждого ребёнка. Код родителя нужен, чтобы выдавать награды и смотреть отчёты.</p></header>
  <form class="card form" data-form="setup">
   <label>Код родителя<input id="pp" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required autocomplete="off"></label>
   <label>Код Ярика<input id="py" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required autocomplete="off"></label>
   <label>Код Ани<input id="pa" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required autocomplete="off"></label>
   <button class="btn big">Сохранить</button></form>
  <div class="card"><h2>Это телефон родителя?</h2><p class="hint">Если дети занимаются на своих айпадах, а здесь вы хотите только смотреть отчёты, придумайте один код родителя. Данные детей подтянутся с сервера, айпады это никак не затронет.</p>
  <form class="form pp-own" data-form="setupview"><input id="pv" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" placeholder="код родителя, 4 цифры"><button class="btn">Войти</button></form></div></main>`;
}
function vLogin(){
  if (!FAM && S.viewer) return `<main class="wrap login"><header class="hero"><p class="eyebrow">${fmtDate(cur.ds)}</p><h1>Телефон родителя</h1><p>Здесь только отчёты: дети занимаются на своих айпадах.</p></header>
  <p class="center"><button class="btn big" data-act="parent">Войти как родитель</button></p></main>`;
  const card = k => { const K = S.kids[k], d = KIDS[k]; return `<button class="kidcard ${LK(k)}${typeof lookBody === 'function' ? lookBody(k) : ''}"${FAM ? famCardStyle(k) : ''} data-act="login" data-kid="${k}"><span class="avatar">${d.name[0]}</span><span class="kb">${THEME[TH(k)].banner.slice(0, 4).join(' ')}</span><span class="kn">${d.name}</span><span class="kg">${d.grade}</span><span class="kc">${coinsHtml(K.coins)}</span></button>`; };
  return `<main class="wrap login">${FAM ? famBrand(false) : ''}<header class="hero"><p class="eyebrow">${fmtDate(cur.ds)}</p><h1>Кто сегодня учится?</h1></header>
  <div class="kids">${kidIds().map(card).join('')}</div>${FAM ? famLoginExtra() : ''}
  ${alwaysTiles(null)}
  <p class="center"><button class="link" data-act="parent">Для родителей</button></p>${window.INSTALL_EV ? '<p class="center"><button class="btn ghost" data-act="install">📲 Установить на экран телефона</button></p>' : ''}</main>`;
}
/* Android/Chrome: своя кнопка установки приложения на главный экран */
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); window.INSTALL_EV = e; if (cur.view === 'login') render(); });
window.addEventListener('appinstalled', () => { window.INSTALL_EV = null; if (cur.view === 'login') render(); });
function vPin(){
  const who = cur.pinFor === 'parent' ? 'Код родителя' : KIDS[cur.pinFor].name + ', введи свой код';
  return `<main class="wrap narrow"><header class="hero"><h1>${U.esc(who)}</h1><p>${U.esc(cur.msg || (cur.pinFor === 'parent' ? 'Введите четыре цифры' : 'Четыре цифры'))}</p></header>
  <div class="pinbox"><div class="dots" id="dots">${'<i></i>'.repeat(4)}</div>
  <div class="pad">${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(x => x === '' ? '<span></span>' : `<button class="key" data-act="key" data-k="${x}">${x}</button>`).join('')}</div>
  <button class="link" data-act="cancelpin">Назад</button></div></main>`;
}
let pinBuf = '';
function pinKey(k){
  if (k === '⌫') pinBuf = pinBuf.slice(0, -1); else if (pinBuf.length < 4) pinBuf += k;
  const dots = document.querySelectorAll('#dots i'); dots.forEach((d, i) => d.classList.toggle('on', i < pinBuf.length));
  if (pinBuf.length === 4 && cur.pinSet) { const P = cur.pinSet, v = pinBuf; pinBuf = '';
    if (!P.first) { const h = hashPin(v), used = [S.parentPin].concat(Object.keys(S.kids).filter(k => k !== P.kid).map(k => S.kids[k].pin)); if (used.includes(h)) { cur.msg = 'Этот код уже занят. Придумай другой'; setTimeout(render, 150); return; } P.first = v; cur.msg = 'Введи новый код ещё раз'; setTimeout(render, 150); return; }
    if (P.first !== v) { cur.pinSet = { kid: P.kid }; cur.msg = 'Коды не совпали. Придумай новый код ещё раз'; setTimeout(render, 150); return; }
    S.kids[P.kid].pin = hashPin(v); cur.pinSet = null; save(); ev(P.kid, 'пароль изменён', {}); alertMsg('Пароль изменён ✓'); go('home'); return; }
  if (pinBuf.length === 4) { const ok = cur.pinFor === 'parent' ? hashPin(pinBuf) === S.parentPin : hashPin(pinBuf) === S.kids[cur.pinFor].pin || hashPin(pinBuf) === S.parentPin; const cb = cur.onPin; pinBuf = '';
    if (ok) { cur.msg = ''; cb(); } else { cur.msg = 'Неверный код, попробуй ещё раз'; setTimeout(render, 150); } }
}
function askPin(forWho, cb, msg){ pinBuf = ''; go('pin', { pinFor: forWho, onPin: cb, msg: msg || '', back: cur.view }); }

function fmtDate(ds){ const [y, m, d] = ds.split('-').map(Number); const dt = new Date(y, m - 1, d); return ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'][dt.getDay()] + ', ' + d + ' ' + ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'][m - 1]; }

function lessonTitle(kid, subj, ds){
  { const L0 = ((S.kids[kid].days[ds] || {}).les || {})[subj]; if (L0 && L0.phase === 'done' && L0.ttl) return L0.ttl; }
  if (subj === 'read') { const t = readText(kid); return t.title; }
  if (subj === 'hw') return 'Повторение ошибок';
  if (subj === 'extra') return 'Дополнительные задания';
  if (subj === 'pro') return 'Тот же день — сложнее';
  if (subj === 'train') return 'Сложные задачи на завтра и дальше';
  const tr = track(subj, ds), u = unitAt(kid, subj, tr).u; return u.t + (((S.kids[kid].passN || {})[u.id] || 0) === 1 ? ' · закрепление' : '');
}
function subjName(kid, subj, ds){ if (subj === 'hw') return 'Домашнее задание'; if (subj === 'extra') return '⭐ Экстра'; if (subj === 'pro') return '🏆 Уровень PRO'; if (subj === 'train') return '🔥 Испытание'; const c = KIDS[kid].cur[subj]; return track(subj, ds) === '_alt' ? c.altName : c.name; }
function hwDue(kid){ const K = S.kids[kid]; return K.srs.filter(x => x.due <= cur.ds); }
function todaySubjects(kid){ const list = KIDS[kid].order.slice(); const D = dayRec(kid, cur.ds); if (D.bonus) { if (D.les.hw) list.push('hw'); return list; } /* закрытый день не открываем заново */ if (hwDue(kid).length || S.kids[kid].hwText.some(h => !h.done) || D.les.hw) list.push('hw'); return list; }

/* Учебный день: пока не закончены все уроки начатого дня, новый день не открывается */
function dayDone(kid, ds){ const keep = cur.ds; cur.ds = ds; const D = S.kids[kid].days[ds]; const ok = !!D && todaySubjects(kid).every(s => D.les[s] && D.les[s].phase === 'done'); cur.ds = keep; return ok; }
function lessonDay(kid){ const K = S.kids[kid], t = U.today(); if (K.openDay && K.openDay < t && !dayDone(kid, K.openDay)) return K.openDay; return t; }
function nextOpen(kid){ const D = dayRec(kid, cur.ds); return todaySubjects(kid).find(s => !(D.les[s] && D.les[s].phase === 'done')); }
/* ===== Всегда доступно: загадки, головоломки, задачи, шахматы (каждая фича — свой файл, ALWAYS.push) ===== */
var ALWAYS = window.ALWAYS || (window.ALWAYS = []);
function alwaysGet(id){ return ALWAYS.filter(x => x.id === id)[0]; }
function alwaysTiles(kid){ const L = ALWAYS.filter(x => kid || x.login).sort((a, b) => (a.order || 0) - (b.order || 0)); if (!L.length) return '';
  return `<h2 class="alwh">${kid ? '🧩 Всегда доступно — даже когда уроки сделаны' : 'Играть вместе'}</h2><section class="tiles always">${L.map(x => { try { return x.tile(kid); } catch (e) { return ''; } }).join('')}</section>`; }
function alwaysWrap(kid, html){ return `<main class="wrap ${kid ? LK(kid) : ''} alw"><header class="bar">${kid ? '<button class="link" data-act="home">← На главную</button>' : '<button class="link" data-act="tologin">← Назад</button>'}${kid ? `<span class="coins">${coinsHtml(S.kids[kid].coins)}</span>` : ''}</header>${html}</main>`; }
/* Игры «Всегда доступно» — только после первого урока дня (Юрий 24.11: не играть вместо уроков). В день без уроков — открыты. */
const ALW_AFTER1 = ['zag', 'pz', 'zad'];
function alwOpen(kid){ const subs = todaySubjects(kid); if (!subs.length) return true; const D = dayRec(kid, U.today()); return subs.some(s => D.les[s] && D.les[s].phase === 'done'); }
function vAlways(){ const F = alwaysGet(cur.aid), kid = cur.kid || null; if (!F) return kid ? vHome() : vLogin(); if (kid && ALW_AFTER1.includes(F.id) && !alwOpen(kid)) return alwaysWrap(kid, `<section class="hello"><h1>Сначала первый урок</h1><p class="hint">Загадки, головоломки и задачи на смекалку откроются, когда сделаешь первый урок дня.</p></section><button class="btn big" data-act="home">К урокам →</button>`); if (kid && typeof rlGate === 'function') { const g = rlGate(kid, F); if (g) return alwaysWrap(kid, g); } let h; try { h = F.view(kid); } catch (e) { h = '<div class="card">Ошибка: ' + U.esc(e.message) + '</div>'; } return F.full ? h : alwaysWrap(kid, h); }
function vHome(){
  const kid = cur.kid, K = S.kids[kid], D = dayRec(kid, cur.ds), subs = todaySubjects(kid);
  const done = subs.filter(s => D.les[s] && D.les[s].phase === 'done').length;
  const streak = readStreak(kid);
  const msgs = K.msgs.filter(m => !m.seen);
  const tiles = subs.map(s => { const L = D.les[s]; const st = L && L.phase === 'done' ? 'done' : L ? 'go' : 'new'; const g = L && L.grade;
    const locked = !TEST && ((st === 'new' && restLeft(kid) > 0) || (st !== 'done' && s !== nextOpen(kid) && !(D.unlock || []).includes(s)));
    return `<button class="tile ${st} ${s === 'read' ? 'main' : ''} ${locked ? 'locked' : ''}" data-act="open" data-subj="${s}" ${locked ? 'aria-disabled="true"' : ''}><span class="ico">${icon(s === 'lang' && track('lang', cur.ds) === '_alt' ? 's_en' : ((s === 'world' && T(kid) === 'yarik') || (s === 'logic' && T(kid) === 'anya')) && track(s, cur.ds) === '_alt' ? 's_fin' : SUBJ_IC[s], 'big') || SUBJ_ICON[s]}</span><span class="tt"><span class="sn">${subjName(kid, s, cur.ds)}${s === 'read' && T(kid) === 'yarik' ? ' <em>главное</em>' : ''}</span><span class="ut">${U.esc(lessonTitle(kid, s, cur.ds))}</span></span>${g ? `<span class="mark m${g}">${g}</span>` : st === 'go' ? '<span class="state">начат</span>' : ''}</button>`; }).join('');
  return `<main class="wrap ${LK(kid)}"><header class="bar"><button class="link" data-act="logout">Выйти</button><button class="link voice" data-act="voice" title="Кто читает задания">🔊 ${K.voice === 'm' ? 'Мужской голос' : 'Женский голос'}</button><span class="coins">${coinsHtml(K.coins)}</span></header>
  <div class="banner" aria-hidden="true">${THEME[TH(kid)].banner.map((e, i) => `<span style="animation-delay:${i * .3}s">${e}</span>`).join('')}</div><section class="hello"><p class="eyebrow">${THEME[TH(kid)].hello}</p><h1>Привет, ${KIDS[kid].name}!</h1><p>${fmtDate(cur.ds)} · сделано ${done} из ${subs.length}</p>${cur.ds !== U.today() ? `<div class="note">Сначала закончи уроки за ${fmtDate(cur.ds)}. Новые откроются потом.</div>` : ''}${K.burnMsg ? `<div class="note">🔥 ${U.esc(K.burnMsg)} <button class="link" data-act="burnseen">Понятно</button></div>` : ''}${burnWarn(kid)}${rusNote(kid)}${dripCard(kid)}${restCard(kid)}${hwCard(kid)}${capLeft(K) ? '' : '<div class="note">✅ Баллы на сегодня собраны (' + DAY_CAP + ' из ' + DAY_CAP + '). Можно заниматься дальше для ума — новые баллы завтра.</div>'}${timeCard(kid)}<p class="hint">Уроки идут по порядку: следующий откроется, когда закончишь предыдущий. Открыть урок раньше можно за 10 баллов, но за него дадут только треть баллов, пока не сделаны все уроки дня. 1 балл = 1 минута игры. Заработанное копится в копилке 🐷 и в воскресенье переходит на счёт с прибавкой +10%.</p>
   <div class="prog tipc" data-tip="prog"><i style="width:${Math.round(done / subs.length * 100)}%"></i></div></section>
  ${ptHomeBtn(kid)}
  ${fineCard(kid)}${msgs.map(m => `<div class="note">✉ ${U.esc(noPapa(m.text))} <button class="link" data-act="seen" data-id="${m.id}">Прочитал(а)</button></div>`).join('')}
  <section class="tiles">${typeof sylTile === 'function' ? sylTile(kid, D) : ''}${tiles}${poemTile(kid, D)}${extraTile(kid, D)}${proTile(kid, D)}${trainTile(kid, D)}</section>
  ${libCard(kid)}
  ${alwaysTiles(kid)}
  <p class="center"><button class="link" data-act="chpin">🔑 Поменять пароль</button></p>
  ${done === subs.length ? `<div class="card win"><h2>Все уроки на сегодня сделаны!</h2><p>Завтра будут новые. ${D.perfect ? `Безупречный день: бонус +${D.perfect} получен.` : ''}${proReady(kid, D) && !D.les.pro ? ' Все уроки на 4 и 5 — тебе открыт уровень PRO: ещё до 30 минут!' : ''}</p></div>` : ''}
  ${FAM ? '' : bkHomeCard(kid)}
  <section class="shelf card"><h2>Моя книжная полка</h2><p>Прочитано текстов: <b>${K.texts}</b> · слов вслух: <b>${K.words}</b>${streak > 1 ? ` · читаю ${streak} ${U.pl(streak,'день','дня','дней')} подряд` : ''}</p>${lastReading(kid)}</section>
  <p class="center"><button class="btn ghost" data-act="shop">🎁 Мои призы</button></p></main>`;
}
function lastReading(kid){ const K = S.kids[kid], R = K.reading.filter(x => x.lang === 'ru').slice(-5); if (!R.length) return ''; const best = readBestOf(kid), lv = readLv(kid, best);
  return `<p class="rlv tipc" data-tip="level"><span class="rlvb">${lv.cur[2]} ${lv.cur[1]}</span> рекорд <b>${best}</b> сл/мин${lv.next ? ` · до уровня «${lv.next[1]}» ещё ${lv.next[0] - best}` : ''}</p>${badgesRow(kid)}` + '<div class="speeds">' + R.map(x => `<span title="${U.esc(x.title)}"><b>${x.wpm}</b> сл/мин</span>`).join('') + `</div><p class="hint">Цель к концу года: ${KIDS[kid].norm} ${U.pl(KIDS[kid].norm, 'слово', 'слова', 'слов')} в минуту.</p>${vocabRow(kid)}`; }
/* ----- Темп чтения: уровни, рекорды, значки ----- */
const READ_LV = { yarik: [[0,'Новичок','🌱'],[20,'Ученик','📖'],[30,'Читатель','📚'],[40,'Знаток слов','🔤'],[55,'Мастер чтения','🏅'],[70,'Чемпион','🏆'],[90,'Легенда','👑']],
  anya: [[0,'Ученица','🌱'],[80,'Читательница','📖'],[100,'Книжный знаток','📚'],[120,'Мастер слова','✒️'],[140,'Магистр чтения','🌟'],[160,'Архимаг книг','🔮']] };
function readLvList(kid){ return READ_LV[T(kid) === 'anya' ? 'anya' : 'yarik']; }
function readLv(kid, wpm){ const A = readLvList(kid); let i = 0; A.forEach((x, k) => { if (wpm >= x[0]) i = k; }); return { i, cur: A[i], next: A[i + 1] }; }
function readOkRec(kid, x){ return (x.acc == null || x.acc >= (KIDS[kid].accMin || .9) - .05) && x.wpm <= KIDS[kid].norm * 3; }
/* Рекорд — только по чтению, которое айпад слышал (есть точность). Темп «по времени» мог быть нажатием «Я дочитал» раньше времени (22.11: у Ярика вышло 78 сл/мин). */
function readBestOf(kid){ const K = S.kids[kid]; if (K.readBest == null || K.readBestV !== 2) { K.readBest = Math.max(0, ...K.reading.filter(x => x.lang === 'ru' && x.acc != null && readOkRec(kid, x)).map(x => x.wpm)); K.readBestV = 2; } return K.readBest; }
function badgesRow(kid){ const lv = readLv(kid, readBestOf(kid)).i; if (!lv) return ''; return `<div class="badges">${readLvList(kid).slice(1, lv + 1).map(x => `<span title="${x[1]}">${x[2]}</span>`).join('')}</div>`; }
function vocabRow(kid){ const V = S.kids[kid].vocab || []; if (!V.length) return ''; return `<p class="hint">Новых слов в копилке слов: <b>${V.length}</b> — последние: ${V.slice(-4).map(v => U.esc(v.w)).join(', ')}.</p>`; }
function sparkSvg(kid, vals, norm){ const W = 300, H = 90, P = 8, mx = Math.max(norm * 1.15, ...vals) || 1, lo = Math.floor(Math.min(norm, ...vals) * .7), n = vals.length;
  const X = i => n < 2 ? W / 2 : P + i * (W - 2 * P) / (n - 1), Y = v => H - P - (v - lo) / Math.max(1, mx - lo) * (H - 2 * P);
  const pts = vals.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="Скорость чтения по разам"><line x1="0" x2="${W}" y1="${Y(norm).toFixed(1)}" y2="${Y(norm).toFixed(1)}" class="sn"/><text x="${W - 4}" y="${(Y(norm) - 4).toFixed(1)}" text-anchor="end" class="st">норма ${norm}</text>${n > 1 ? `<polyline points="${pts}" class="sl"/>` : ''}${vals.map((v, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="${i === n - 1 ? 6 : 3.5}" class="${i === n - 1 ? 'sc now' : 'sc'}"/>`).join('')}</svg>`; }
function paceCard(kid, r){ const K = S.kids[kid], norm = KIDS[kid].norm, best = readBestOf(kid), lv = readLv(kid, best), girl = GIRL(kid);
  const vals = K.reading.filter(x => x.lang === 'ru').slice(-10).map(x => x.wpm);
  const d = r.prev != null ? r.wpm - r.prev : null;
  const praise = r.lvup ? `🎉 Новый уровень: <b>${lv.cur[2]} ${lv.cur[1]}</b>! Ты ${girl ? 'заслужила' : 'заслужил'} новый значок и +10 баллов в копилку.`
    : r.rec ? `🏆 Новый рекорд! Так быстро ты ещё не ${girl ? 'читала' : 'читал'}.`
    : d == null ? 'Первый замер. Дальше будем сравнивать с ним.'
    : d >= 3 ? `💪 Быстрее, чем в прошлый раз, на ${d} ${U.pl(d, 'слово', 'слова', 'слов')} в минуту! Молодец!`
    : d > -3 ? 'Почти как в прошлый раз — ровно и спокойно. Так и держи!'
    : `Сегодня чуть медленнее (в прошлый раз было ${r.prev}). Ничего страшного: текст был труднее. Главное — читать чисто.`;
  const goal = lv.next ? Math.min(lv.next[0], Math.max(r.wpm, r.prev || 0) + 3) : Math.max(r.wpm, best) + 2;
  const pr = lv.next ? Math.max(4, Math.min(100, Math.round((best - lv.cur[0]) / (lv.next[0] - lv.cur[0]) * 100))) : 100;
  return `<article class="card pace"><p class="eyebrow">Твой темп</p><div class="pbig"><span class="tipc" data-tip="wpm"><b>${r.wpm}</b> слов в минуту</span>${r.acc != null ? ` · <span class="tipc" data-tip="acc">точность ${Math.round(r.acc * 100)}%</span>` : ''}</div>
   <p class="ppr">${praise}</p>
   ${r.prev != null ? `<p>В прошлый раз: <b>${r.prev}</b>. Твой рекорд: <b>${best}</b>.</p>` : ''}
   <p class="tipc" data-tip="norm">Норма к концу года${KIDS[kid].grade ? ' (' + KIDS[kid].grade + ')' : ''} — <b>${norm}</b> ${U.pl(norm, 'слово', 'слова', 'слов')} в минуту.${r.wpm >= norm ? ' Ты уже читаешь как надо — даже быстрее!' : ` Осталось ${norm - r.wpm}.`}</p>
   ${vals.length > 1 ? sparkSvg(kid, vals, norm) + '<p class="hint center">Твои последние чтения. Пунктир — норма.</p>' : ''}
   <div class="plv tipc" data-tip="level"><span>${lv.cur[2]} ${lv.cur[1]}</span>${lv.next ? `<div class="pbar"><i style="width:${pr}%"></i></div><span>${lv.next[2]} ${lv.next[1]} · ${lv.next[0]}</span>` : '<span>Высший уровень!</span>'}</div>
   ${badgesRow(kid)}
   <p class="pgoal">🎯 Цель на следующий раз: <b>${goal}</b> слов в минуту${r.acc != null ? ' и без ошибок' : ''}.</p></article>
   <button class="btn big" data-act="paceok">Дальше</button>`; }
/* ----- Словарик: новые слова к главе и проверка в конце ----- */
function glossCard(kid, L){ const gl = L.gl || []; if (!gl.length) return '';
  return `<article class="card gloss"><h2>📖 Новые слова</h2><p class="hint">Сначала узнай, что они значат. Нажми 🔊 — я прочитаю. В конце спрошу!</p>${gl.map((g, i) => `<div class="gw"><span class="ge">${g.e}</span><div><b>${U.esc(g.w)}</b> — ${U.esc(g.d)}</div><button class="ib" data-act="sayg" data-i="${i}" aria-label="Послушать">🔊</button></div>`).join('')}</article>`; }
function wordQs(kid, L){ const gl = (L.gl || []).slice(0, 4), lvl = T(kid) === 'anya' ? 'a' : 'y', r = U.rng(U.h('wq' + cur.ds + (L.gl || []).map(g => g.w).join()));
  const pool = GLOSS.filter(g => lvl === 'a' || g[4] === 'y');
  return gl.map(g => { const ds = [...new Set(r.shuffle(pool.filter(x => x[1] !== g.w && x[2] !== g.d)).map(x => x[2]))].slice(0, 2); return { w: g.w, e: g.e, a: g.d, opts: r.shuffle([g.d, ...ds]) }; }); }
function vWords(kid, L, head){ const qs = wordQs(kid, L), i = L.wi || 0, A = L.wans || [];
  if (i >= qs.length) { const okn = A.filter(a => a && a.ok).length;
    return head + `<article class="card gloss"><h2>Какие новые слова ты ${GIRL(kid) ? 'узнала' : 'узнал'}</h2><p>Угадано с первого раза: <b>${okn} из ${qs.length}</b>${okn === qs.length ? ' — отлично!' : ''}</p>${(L.gl || []).map((g, k) => `<div class="gw"><span class="ge">${g.e}</span><div><b>${U.esc(g.w)}</b> — ${U.esc(g.d)}</div>${A[k] ? (A[k].ok ? '✅' : '🔁') : ''}</div>`).join('')}<p class="hint">Попробуй сегодня сказать одно из этих слов в разговоре.</p></article><button class="btn big" data-act="wdone">Дальше</button></section>`; }
  const q = qs[i], a = A[i] || {};
  return head + `<div class="counter">Новое слово ${i + 1} из ${qs.length}</div><article class="card task"><div class="q">Что значит «${U.esc(q.w)}»? ${q.e}</div><div class="opts">${q.opts.map(o => `<button class="opt ${a.v != null && o === q.a ? 'right' : a.v === o && !a.ok ? 'wrong' : ''}" data-act="wq" data-v="${U.esc(o)}" ${a.v != null ? 'disabled' : ''}>${U.esc(o)}</button>`).join('')}</div>
   ${a.v != null ? (a.ok ? '<div class="fb ok"><b>Верно!</b></div>' : `<div class="fb bad"><b>«${U.esc(q.w)}» — это ${U.esc(q.a)}</b></div>`) : ''}</article>${a.v != null ? `<button class="btn big" data-act="wnext">Дальше</button>` : ''}</section>`; }
function readStreak(kid){ const K = S.kids[kid]; let n = 0, d = cur.ds; if (!(K.days[d] && K.days[d].les.read && K.days[d].les.read.phase === 'done')) d = U.addDays(d, -1); while (K.days[d] && K.days[d].les.read && K.days[d].les.read.phase === 'done') { n++; d = U.addDays(d, -1); } return n; }

/* ----- Урок ----- */
function readText(kid){ const K = S.kids[kid], list = KIDS[kid].read, P = KIDS[kid].rplan; const D = K.days[cur.ds]; if (D && D.les.read && D.les.read.tid) return (P ? rpById(kid, D.les.read.tid) : list.find(t => t.id === D.les.read.tid)) || (P ? rpPick(kid) : list[0]); if (P) return rpPick(kid); return list[(K.pos.read || 0) % list.length]; }
/* ===== План чтения по неделям (методсовет 21.11, п.1) — для ребёнка с rplan (Ярик).
   Объём растёт по неделям: нед.1 20–30 слов … нед.11–12 200–250. Сначала короткие тексты по длине; главы книг — отрывками по 120–150 слов
   (вопросы главы раздаются по отрывкам), пока ребёнок не читает 300 слов за раз; потом снова целые главы. Начало плана — K.rpStart, прочитанное — K.readDone. ===== */
function rpWeeks(){ return [[20, 30], [30, 40], [40, 50], [50, 70], [70, 90], [90, 110], [110, 130], [130, 160], [160, 200], [160, 200], [200, 250], [200, 250]]; }
function rpWc(s){ return String(s || '').split(/\s+/).filter(Boolean).length; }
var RP_CACHE = {}, RP_STOP = { поче: 1, сколь: 1, сдел: 1, сказ: 1, была: 1, было: 1, были: 1, котор: 1, заче: 1, како: 1, какие: 1, чего: 1, кого: 1, кому: 1, этот: 1, эта: 1, это: 1 };
function rpStem(w){ w = String(w).toLowerCase().replace(/ё/g, 'е').replace(/[^а-яa-z]/g, ''); return w.length <= 4 ? w : w.slice(0, Math.min(6, w.length - 2)); }
function rpSplit(t, pool, pool2){
  const units = []; String(t.text || '').split('\n').forEach(ln => { if (!ln.trim()) return; if (rpWc(ln) <= 150) { units.push({ s: ln.trim(), nl: 1 }); return; }
    (ln.match(/[^.!?…]+(?:[.!?…]+[»"]*|$)\s*/g) || [ln]).forEach((x, k) => { if (x.trim()) units.push({ s: x.trim(), nl: k === 0 ? 1 : 0 }); }); });
  const ch = []; let c0 = [], n = 0;
  units.forEach(u => { const w = rpWc(u.s); if (c0.length && (n >= 120 || (n >= 80 && n + w > 150))) { ch.push(c0); c0 = []; n = 0; } c0.push(u); n += w; });
  if (c0.length) ch.push(c0);
  if (ch.length > 1 && rpWc(ch[ch.length - 1].map(u => u.s).join(' ')) < 60) { const last = ch.pop(); ch[ch.length - 1] = ch[ch.length - 1].concat(last); }
  const join = us => us.map((u, i) => (i ? (u.nl ? '\n' : ' ') : '') + u.s).join('');
  let parts = ch.map(c => ({ us: c, qi: [] }));
  const W = c => join(c.us).toLowerCase().replace(/ё/g, 'е').split(/[^а-яa-z]+/).filter(Boolean), has = (ws, st) => st.length >= 3 && ws.some(w => w.startsWith(st));
  const qs = t.qs || [];
  /* вопрос — к отрывку, где есть слова ответа и вопроса (редкие слова весят больше); «в конце / в начале» — к последнему / первому отрывку */
  const PW0 = parts.map(W), P = parts.length, df = x => PW0.filter(ws => has(ws, x)).length || 1;
  qs.forEach((qq, qi) => { const a = String(qq[1]).split(/\s+/).map(rpStem).filter(x => x.length >= 3 && !RP_STOP[x]), qw = String(qq[0]).split(/\s+/).map(rpStem).filter(x => x.length >= 4 && !RP_STOP[x]);
    const end = /в конце|закончил|кончил|последн/i.test(qq[0]), beg = /в начале|сначала|первым делом/i.test(qq[0]);
    let best = 0, bs = -1e9; PW0.forEach((ws, j) => { const sc = a.filter(x => has(ws, x)).reduce((s0, x) => s0 + 2 / df(x), 0) + qw.filter(x => has(ws, x)).reduce((s0, x) => s0 + 1 / df(x), 0) + (end ? (j === P - 1 ? 9 : 0) : beg ? (j ? 0 : 9) : 0); if (sc > bs + 1e-9) { bs = sc; best = j; } }); parts[best].qi.push(qi); });
  /* отрывку без вопроса — вопрос на внимание по ключевым словам главы (kw): какое слово было в отрывке; если не вышло — присоединяем к соседнему */
  const norm = w => w.toLowerCase().replace(/ё/g, 'е'), formIn = (stem, txt) => (txt.match(/[А-Яа-яЁё]+/g) || []).find(w => norm(w).startsWith(norm(stem))) || '';
  const fix = (stem, w) => /^[А-ЯЁ]/.test(stem) ? w : w.toLowerCase(), all = join(units);
  const kws = (t.kw || []).map(k => [k, fix(k, formIn(k, all))]).concat((pool || []).map(x => [x[0], x[1]])).filter(x => x[1]);
  parts.forEach(pt => { if (pt.qi.length) return; const tx = join(pt.us), inP = kws.filter(x => formIn(x[0], tx)), outP = kws.filter(x => !formIn(x[0], tx)).map(x => x[1]).filter((w, i, A) => A.indexOf(w) === i);
    if (outP.length < 2) (pool2 || []).forEach(w => { if (outP.length < 3 && !formIn(w, tx) && outP.indexOf(w) < 0) outP.push(w); });
    if (inP.length && outP.length >= 2) pt.own = [['Какое из этих слов было в этом отрывке?', fix(inP[0][0], formIn(inP[0][0], tx))].concat(outP.slice(0, 3))]; });
  for (let i = 0; i < parts.length && parts.length > 1;) { if (parts[i].qi.length || parts[i].own) { i++; continue; } const j = i + 1 < parts.length ? i + 1 : i - 1, A = Math.min(i, j), B = Math.max(i, j);
    parts[A] = { us: parts[A].us.concat(parts[B].us), qi: parts[A].qi.concat(parts[B].qi), own: parts[A].own || parts[B].own }; parts.splice(B, 1); i = 0; }
  return parts.map((pt, k) => ({ id: t.id + '.' + (k + 1), part: t.id, k, of: parts.length, ttl: t.title, title: parts.length > 1 ? `${t.title} (${k + 1} из ${parts.length})` : t.title, author: t.author, book: t.book,
    text: join(pt.us), qs: pt.qi.length ? pt.qi.sort((x, y) => x - y).map(i => qs[i]) : pt.own })); }
function rpLadder(kid){ if (RP_CACHE[kid]) return RP_CACHE[kid]; const list = KIDS[kid].read || [];
  const shorts = list.filter(t => !t.book && !t.kw).map((t, i) => [t, i]).sort((a, b) => rpWc(a[0].text) - rpWc(b[0].text) || a[1] - b[1]).map(x => x[0]);
  const ch = list.filter(t => t.book || t.kw), G = ['лиса','заяц','медведь','волк','ворона','лошадь','корова','собака','петух','мышка'], parts = [].concat(...ch.map(t => rpSplit(t, [].concat(...ch.filter(c => c !== t && c.book === t.book).map(c => (c.kw || []).map(k => { const m = (String(c.text).match(/[А-Яа-яЁё]+/g) || []).find(w => w.toLowerCase().replace(/ё/g, 'е').startsWith(k.toLowerCase().replace(/ё/g, 'е'))); return [k, m ? (/^[А-ЯЁ]/.test(k) ? m : m.toLowerCase()) : '']; }))).filter(x => x[1]), G))), by = {}, n = {};
  list.concat(parts).forEach(t => { by[t.id] = t; n[t.id] = rpWc(t.text); });
  return (RP_CACHE[kid] = { shorts, parts, by, n }); }
function rpJoin(g){ const f = g[0], l = g[g.length - 1]; return { id: g.map(p => p.id).join('+'), ids: g.map(p => p.id), part: f.part, k: f.k, of: f.of, ttl: f.ttl, title: `${f.ttl} (${f.k + 1}–${l.k + 1} из ${f.of})`, author: f.author, book: f.book, text: g.map(p => p.text).join('\n'), qs: [].concat(...g.map(p => p.qs)) }; }
function rpById(kid, id){ const R = rpLadder(kid); if (R.by[id]) return R.by[id]; const g = String(id).split('+').map(x => R.by[x]); return g.length > 1 && g.every(Boolean) ? rpJoin(g) : null; }
function rpBand(kid){ const K = S.kids[kid], ds = cur.ds || U.today(), W = rpWeeks();
  if (!K.rpStart) { K.rpStart = ds; K.readWords = W[0][0]; K.readDone = K.readDone || {}; }
  const w = Math.max(0, Math.floor((U.dayNum(ds) - U.dayNum(K.rpStart)) / 7)), b = W[Math.min(w, W.length - 1)];
  return { w: w + 1, lo: b[0], hi: w >= W.length ? Math.min(350, Math.max(b[1], K.readWords || 0)) : b[1] }; } /* после 12 недель — до 350 слов вслух, остальное главы про себя */
function rpPick(kid){ const R = rpLadder(kid), K = S.kids[kid], b = rpBand(kid), done = K.readDone || {}, lo = b.lo * .7, hi = b.hi * 1.2, big = b.w > rpWeeks().length && (K.readWords || 0) >= 300;
  const n = t => R.n[t.id] || (R.n[t.id] = rpWc(t.text)), last = t => done[t.id] || 0;
  let book = null; const i0 = R.parts.findIndex(p => !done[p.id] && !done[p.part]);
  if (i0 >= 0) { const p0 = R.parts[i0];
    if (big && p0.k === 0) book = R.by[p0.part];
    else { const g = [p0]; let s = n(p0); for (let i = i0 + 1; i < R.parts.length; i++) { const p = R.parts[i]; if (p.part !== p0.part || done[p.id] || !(s + n(p) <= hi || (g.length === 1 && s < b.lo && s + n(p) <= b.hi * 1.3))) break; g.push(p); s += n(p); } book = g.length > 1 ? rpJoin(g) : p0; } }
  const s1 = R.shorts.find(t => !done[t.id] && n(t) >= lo && n(t) <= hi); if (s1) return s1;
  if (book && (big || n(book) <= b.hi * 1.3)) return book;
  const s2 = R.shorts.find(t => !done[t.id] && n(t) <= hi); if (s2) return s2;
  if (book && b.lo >= 90) return book; /* с 6-й недели новый отрывок книги лучше, чем перечитывание */
  /* новых текстов по силам нет — перечитываем тот, что читали давнее всего */
  const fit = R.shorts.filter(t => n(t) <= hi), again = fit.filter(t => n(t) >= lo).sort((a, c) => last(a) - last(c))[0] || fit.sort((a, c) => last(a) - last(c))[0];
  return again || book || R.shorts[0] || KIDS[kid].read[0]; }
function rpDone(kid, t){ const K = S.kids[kid], d = U.dayNum(cur.ds || U.today()); K.readDone = K.readDone || {}; (t.ids || [t.id]).forEach(id => { K.readDone[id] = d; });
  if (t.book && !t.part) rpLadder(kid).parts.filter(p => p.part === t.id).forEach(p => { K.readDone[p.id] = d; }); }
function startLesson(subj){
  const kid = cur.kid, D = dayRec(kid, cur.ds);
  if (!D.les[subj]) {
    if (subj === 'read') { const t = readText(kid); D.les.read = { tid: t.id, phase: 'warm', ans: [], seed: U.h(kid + cur.ds + 'read') }; }
    else if (subj === 'train') { D.les.train = { items: trainTasks(kid, D), phase: 'practice', i: 0, ans: [], seed: U.h(kid + cur.ds + 'train') }; }
    else if (subj === 'pro') { D.les.pro = { items: proTasks(kid, D), phase: 'practice', i: 0, ans: [], seed: U.h(kid + cur.ds + 'pro') }; }
    else if (subj === 'extra') { D.les.extra = { items: extraTasks(kid, D), phase: 'practice', i: 0, ans: [], seed: U.h(kid + cur.ds + 'extra') }; }
    else if (subj === 'hw') { const due = hwDue(kid).slice(0, 8); D.les.hw = { items: due.map(x => x.task), keys: due.map(x => x.key), phase: 'practice', i: 0, ans: [], txt: S.kids[kid].hwText.filter(h => !h.done).map(h => h.id) }; }
    else { const tr = track(subj, cur.ds), { u } = unitAt(kid, subj, tr); D.les[subj] = { uid: u.id, tr, seed: U.h(kid + cur.ds + subj), phase: 'theory', i: 0, ans: [], n: nTasks(kid, subj) }; }
    D.les[subj].t0 = Date.now();
    S.kids[kid].openDay = cur.ds; save(); ev(kid, 'урок начат', { subj: subjName(kid, subj, cur.ds), unit: lessonTitle(kid, subj, cur.ds) });
  }
  go('lesson', { subj });
}
function unitById(kid, subj, uid){ const c = KIDS[kid].cur[subj]; return (c.units || []).concat(c.alt || [], c.old || []).find(u => u.id === uid); }
function lessonTasks(L, kid, subj){ if (ITEMS(subj)) { if (!L._c || L._c.src !== L.items) { const c = allChoice(L.items, L.seed || 3); c.src = L.items; Object.defineProperty(L, '_c', { value: c, enumerable: false, configurable: true, writable: true }); } return L._c; } if (!L._t) { const u = unitById(kid, subj, L.uid); let T = genTasks(u, L.seed, L.n);
    /* Математика: в конце урока 3 задания на повторение пройденных тем (вперемешку, со вводом ответа) */
    if (subj === 'math' && L.mix !== 0) { const list = unitsOf(kid, subj, L.tr || ''), j = list.indexOf(u); if (j > 0) { const r = U.rng(L.seed + 5); for (let k = 0; k < 3; k++) { const pu = list[r.int(Math.max(0, j - 12), j - 1)], x = genTasks(HARD[pu.id] ? { g: HARD[pu.id] } : pu, L.seed + 17 * k, 1)[0]; if (x) { x.rev = pu.t; T.push(x); } } } }
    T = allChoice(T, L.seed); Object.defineProperty(L, '_t', { value: T, enumerable: false }); } return L._t; }

function vLesson(){
  const kid = cur.kid, subj = cur.subj, D = dayRec(kid, cur.ds), L = D.les[subj];
  const head = `<header class="bar"><button class="link" data-act="home">← К урокам</button><span class="coins">${coinsHtml(S.kids[kid].coins)}</span></header>`;
  if (subj === 'read') return `<main class="wrap ${LK(kid)}">${head}${vRead(kid, L)}</main>`;
  let body = '';
  const u = !ITEMS(subj) && unitById(kid, subj, L.uid);
  const steps = ITEMS(subj) ? ['Задания'] : subj === 'lang' ? ['Теория', 'Практика', 'Чтение', 'Отзыв'] : ['Теория', 'Практика', 'Отзыв'];
  const stepIdx = ITEMS(subj) ? 0 : { theory:0, practice:1, fread:2, survey: steps.length - 1, done: steps.length - 1 }[L.phase] || 0;
  const doneAll = L.phase === 'done' || L.phase === 'survey';
  const stepper = `<ol class="steps">${steps.map((s, i) => { const past = i < stepIdx || (ITEMS(subj) && doneAll); const on = cur.rview ? s === cur.rview : i === stepIdx; const can = past || (i === stepIdx && (cur.rview || cur.rtask != null));
    return `<li class="${past ? 'ok' : ''} ${on ? 'now' : ''} ${can ? 'tap' : ''}">${can ? `<button class="stp" data-act="rview" data-s="${past && s !== cur.rview ? s : ''}">${s}</button>` : s}</li>`; }).join('')}</ol>`;
  const title = `<p class="eyebrow">${subjName(kid, subj, cur.ds)}</p><h1>${U.esc(subj === 'hw' ? 'Повторение ошибок' : subj === 'extra' ? 'Дополнительные задания по сегодняшним урокам' : subj === 'pro' ? 'Уровень PRO: тот же день, но сложнее' : subj === 'train' ? 'Испытание: сложные задачи по новым темам' : u.t)}</h1>`;
  if (cur.rtask != null) body = vRetry(kid, subj, L, cur.rtask);
  else if (cur.rview === 'Теория' && u) body = `<div class="note">Это повторение — баллы не меняются. <button class="link" data-act="rview" data-s="">Вернуться к уроку →</button></div><article class="card theory">${subjArt(kid, subj)}<div class="th">${thR(u.th)}</div><div class="row"><button class="btn ghost small" data-act="saytheory">🔊 Прочитать вслух</button></div></article><button class="btn big" data-act="rview" data-s="">Вернуться к уроку</button>`;
  else if (cur.rview === 'Практика' || cur.rview === 'Задания') body = vPracList(kid, subj, L);
  else if (L.phase === 'theory') {
    const c = KIDS[kid].cur[subj];
    body = `${!(L.ans && L.ans.length) ? hwNote(kid, subj) : ""}<article class="card theory">${subjArt(kid, subj)}<div class="th">${thR(u.th)}</div><div class="row">${L.helpN || voiceFree(kid) ? '<button class="btn ghost small" data-act="saytheory">🔊 Прочитать вслух</button>' : ''}${subj !== 'hw' ? `<button class="btn ghost small" data-act="dunno">${typeof srDl === 'function' ? srDl(kid, L) : '🤔 Не понимаю'}</button>` : ''}</div></article>${L.helpN ? vExample(kid, subj, L, u) : ''}
    <p class="src">По учебнику: ${U.esc(c.src)}</p><button class="btn big" data-act="topractice">Понятно, к заданиям</button>`;
  } else if (L.phase === 'practice') body = vTask(kid, subj, L);
  else if (L.phase === 'fread') body = vForeign(kid, L);
  else if (L.phase === 'survey') body = vSurvey(L);
  else body = vResult(kid, subj, L);
  if (subj === 'hw' && L.phase === 'practice' && !L.items.length) body = vHwText(kid, L);
  return `<main class="wrap ${LK(kid)}">${head}<section class="lesson">${title}${stepper}${body}</section></main>`;
}
function vTask(kid, subj, L){
  const T = lessonTasks(L, kid, subj); if (!T.length) return vHwText(kid, L);
  const t = T[L.i], a = L.ans[L.i] || { tries: 0 }; const fin = a.final;
  if (!fin) { L.qt = L.qt || {}; if (!L.qt[L.i]) L.qt[L.i] = Date.now(); }
  const lang = subj === 'lang' ? LCODE(kid, L.tr) : 'ru-RU';
  let inp;
  if (t.k === 'c') inp = `<div class="opts">${t.opts.map(o => { const cls = fin && o === t.a ? 'right' : (a.wrong || []).includes(o) ? 'wrong' : ''; return `<button class="opt ${cls}" data-act="choose" data-v="${U.esc(o)}" ${fin || (a.wrong || []).includes(o) ? 'disabled' : ''}>${o}</button>`; }).join('')}</div>`;
  else if (t.k === 't') inp = `<form class="numf txtf" data-form="num"><input id="numin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ${fin ? 'disabled' : 'autofocus'} value="${fin ? U.esc(a.v) : ''}" aria-label="Ответ" placeholder="Напиши ответ"><button class="btn" ${fin ? 'disabled' : ''}>Проверить</button></form>`;
  else inp = `<form class="numf" data-form="num"><input id="numin" inputmode="decimal" autocomplete="off" ${fin ? 'disabled' : 'autofocus'} value="${fin ? U.esc(a.v) : ''}" aria-label="Ответ"><button class="btn" ${fin ? 'disabled' : ''}>Проверить</button></form>`;
  let fb = '';
  if (fin) fb = a.ok ? `<div class="fb ok"><b>${a.tries === 1 ? U.rng(L.seed + L.i).pick(THEME[TH(kid)].win) : 'Верно!'}</b> ${t.e ? U.esc(strip(t.e)) : ''}</div>` : `<div class="fb bad"><b>Правильный ответ: ${t.k === 'n' ? U.dec(t.a) : t.a}</b> ${t.e ? U.esc(strip(t.e)) : ''}<br><span class="hint">Это задание попадёт в домашнее задание (📒 на главном экране).</span></div>`;
  else if (a.tries) fb = `<div class="fb try">Не совсем. Подумай ещё раз.</div>`;
  const spk = t.sp ? `<button class="btn ghost small" data-act="sayq">🔊 Послушать</button>` : '';
  const u0 = (subj === 'extra' || subj === 'pro' || subj === 'train') && t.uid ? unitById(kid, t.sj, t.uid) : subj !== 'hw' && unitById(kid, subj, L.uid);
  const gate = typeof srGate === 'function' ? srGate(kid, subj, L, t, a) : ''; if (gate) inp = gate;
  const help = u0 && !fin ? (L.showTh === L.i ? `${t.sp ? '' : '<button class="btn ghost small" data-act="sayqtext">🔊 Прочитать задание</button>'}<details class="peek" open><summary>Правило</summary><div class="th">${thR(u0.th, 1)}</div></details>${vExample(kid, subj, L, u0, t)}` : `<button class="link" data-act="dunnotask">${typeof srDl === 'function' ? srDl(kid, L) : '🤔 Не понимаю'}</button>`) : '';
  const dots = `<div class="dots">${T.map((x, j) => { const aj = L.ans[j]; const st = aj && aj.final ? (aj.ok && aj.tries === 1 ? 'ok' : aj.ok ? 'mid' : 'bad') : j === L.i ? 'now' : ''; return `<span class="dot ${st}">${j + 1}</span>`; }).join('')}</div>`;
  return `<div class="counter">Задание ${L.i + 1} из ${T.length}</div>${dots}${L.i === 0 ? '<p class="hint small">Отвечай внимательно: засчитывается только первый ответ.</p>' : ''}<article class="card task">${(() => { const il = illus(kid, t.sj || subj, t); return il ? '' : `<div class="scenebar">${scene(kid, (L.seed || 7) + L.i)}</div>`; })()}<span class="sticker" aria-hidden="true">${U.rng((L.seed || 7) + L.i * 31).pick(THEME[TH(kid)].pics)}</span>${t.rev ? `<p class="revtag">🔁 Повторение: ${U.esc(t.rev)}</p>` : ''}${gate ? '' : `<div class="q">${t.k === 't' ? t.q : t.q.replace(/_+/g, '<span class="gap">?</span>')}</div>`}${illus(kid, t.sj || subj, t)}${t.sp && !t.spAfter ? spk : ''}${inp}${fb}${t.sp && t.spAfter && fin ? spk : ''}${help}</article>
  ${fin ? `<button class="btn big" data-act="next">${L.i + 1 < T.length ? 'Дальше' : 'Закончить'}</button>` : ''}`;
}
/* Разбор на похожем примере: задание того же типа с ответом и объяснением */
function subjArt(kid, subj){ const k = !FAM && typeof lookId === 'function' && lookId(kid) ? LOOKS[lookId(kid)].art : T(kid) === 'yarik' ? 'y' : 'a'; let n = subj; if (T(kid) === 'anya' && subj === 'hist' && track('hist', cur.ds) === '_alt') n = 'geo'; if (T(kid) === 'yarik' && subj === 'world' && track('world', cur.ds) === '_alt') n = 'fin'; if (T(kid) === 'anya' && subj === 'logic' && track('logic', cur.ds) === '_alt') n = 'fin'; if (FAM) { const c = (KIDS[kid].cur || {})[subj], m = c && c.alt && track(subj, cur.ds) === '_alt' && { 'Геометрия':'geom', 'Физика':'phys', 'Природа и техника':'nat' }[c.altName]; if (m) n = m; } /* свои картинки у второй линии предмета 12–13 лет */
  if (!['math','rus','world','logic','lang','read','hist','geo','fin','geom','phys','nat'].includes(n)) return '';
  return `<img class="subjart" src="img/subj-${k}-${n}.webp" alt="" onerror="this.remove()">`; }
function vExample(kid, subj, L, u, cur0){ const n = L.helpN || 1; const shape = x => strip(x.q).replace(/\d+([,.]\d+)?/g, '#').slice(0, 18);
  const cands = genTasks(u, (L.seed || 1) * 7 + n * 101, 14).filter(x => !cur0 || x.q !== cur0.q); const ex = (cur0 && cands.find(x => shape(x) === shape(cur0))) || (cur0 && cands.find(x => x.k === cur0.k && shape(x).slice(0, 8) === shape(cur0).slice(0, 8))) || cands[0]; if (!ex) return '';
  const ans = ex.k === 'n' ? U.dec(ex.a) : ex.a;
  return `<article class="card example"><h3>Разберём на похожем примере</h3><div class="q">${ex.q.replace(/_+/g, '<span class="gap">?</span>')}</div>${illus(kid, subj, ex)}<p><b>Ответ: ${ans}</b></p>${ex.e ? `<p>${U.esc(strip(ex.e))}</p>` : ''}<div class="row"><button class="btn ghost small" data-act="sayex" data-t="${U.esc(strip(ex.q.replace(/_+/g, ' пропуск ')) + '. Ответ: ' + strip(String(ans)) + '. ' + (ex.e ? strip(ex.e) : ''))}">🔊 Послушать</button><button class="link" data-act="dunno" data-more="1">Ещё пример</button></div><p class="hint">Я отметил, что тема трудная: Юра увидит и поможет разобраться.</p></article>`; }
/* Повторение внутри урока: список заданий и «попробовать ещё раз» — баллы не меняются */
function vPracList(kid, subj, L){ const T = lessonTasks(L, kid, subj);
  return `<div class="note">Это повторение — баллы не меняются. <button class="link" data-act="rview" data-s="">Вернуться к уроку →</button></div><article class="card"><h2>Все задания урока</h2><p class="hint">Нажми на задание, чтобы решить его ещё раз.</p><ol class="plist">${T.map((t, j) => { const a = L.ans[j]; const st = a && a.final ? (a.ok && a.tries === 1 ? 'ok' : a.ok ? 'mid' : 'bad') : ''; return `<li class="${st}"><button class="prow" data-act="rtask" data-i="${j}"${a && a.final ? '' : ' disabled'}><span class="pn">${j + 1}</span><span class="pq">${strip(t.q).replace(/_+/g, '?')}</span><span class="ps">${a && a.fix ? '🛠' : st === 'ok' ? '✓' : st === 'mid' ? '½' : st === 'bad' ? '✗' : '…'}</span></button></li>`; }).join('')}</ol></article><button class="btn big" data-act="rview" data-s="">Вернуться к уроку</button>`; }
function vRetry(kid, subj, L, i){ const T = lessonTasks(L, kid, subj), t = T[i]; if (!t) return ''; const r = cur.rtry && cur.rtry.i === i ? cur.rtry : { i, wrong: [], tries: 0 }; const fin = r.fin, a0 = L.ans[i] || {};
  let inp;
  if (t.k === 'c') inp = `<div class="opts">${t.opts.map(o => { const cls = fin && o === t.a ? 'right' : r.wrong.includes(o) ? 'wrong' : ''; return `<button class="opt ${cls}" data-act="rtryc" data-v="${U.esc(o)}" ${fin || r.wrong.includes(o) ? 'disabled' : ''}>${o}</button>`; }).join('')}</div>`;
  else inp = `<form class="numf" data-form="rtry"><input id="rtin" ${t.k === 't' ? 'autocapitalize="off" autocorrect="off" spellcheck="false"' : 'inputmode="decimal"'} autocomplete="off" ${fin ? 'disabled' : ''} value="${fin ? U.esc(r.v) : ''}" aria-label="Ответ"><button class="btn" ${fin ? 'disabled' : ''}>Проверить</button></form>`;
  const ra = t.k === 'n' ? U.dec(t.a) : U.esc(t.a);
  const fb = fin ? (r.ok ? `<div class="fb ok"><b>Верно!</b> ${t.e ? U.esc(strip(t.e)) : ''}</div>` : `<div class="fb bad"><b>Правильный ответ: ${ra}</b> ${t.e ? U.esc(strip(t.e)) : ''}</div>`) : r.tries ? '<div class="fb try">Не совсем. Подумай ещё раз.</div>' : '';
  const was = a0.final ? `<p class="hint">${a0.fix ? '🛠 Исправлено в работе над ошибками. ' : !L.fixPaid && !(a0.ok && a0.tries === 1) ? 'Чтобы исправление пошло в результат, нужна работа над ошибками (' + FIX_PRICE + ' баллов). ' : ''}В уроке: ${a0.ok && a0.tries === 1 ? 'верно с первого раза ✓' : a0.ok ? 'верно со второй попытки' : 'ошибка, ответ был ' + U.esc(String(a0.v))}</p>` : '';
  const W = fixList(kid, subj, L), nf = W.find(j => j !== i && !L.ans[j].fix), nxt = nf != null ? nf : T.findIndex((x, j) => j > i && L.ans[j] && L.ans[j].final);
  return `<div class="note">Повторение задания ${i + 1} — баллы не меняются.</div><article class="card task"><div class="q">${t.q.replace(/_+/g, '<span class="gap">?</span>')}</div>${illus(kid, t.sj || subj, t)}${was}${inp}${fb}</article>
  <div class="row">${fin ? '<button class="btn ghost" data-act="rtryagain">↻ Ещё раз</button>' : ''}${nxt >= 0 ? `<button class="btn ghost" data-act="rtask" data-i="${nxt}">${nf != null ? 'Следующая ошибка →' : 'Следующее →'}</button>` : ''}</div><button class="btn big" data-act="rview" data-s="">Вернуться к уроку</button>`; }
function retryAnswer(v){ const kid = cur.kid, L = dayRec(kid, cur.ds).les[cur.subj], i = cur.rtask, t = lessonTasks(L, kid, cur.subj)[i]; if (!t) return;
  const r = cur.rtry && cur.rtry.i === i ? cur.rtry : (cur.rtry = { i, wrong: [], tries: 0 }); if (r.fin) return; let ok;
  if (t.k === 'n') { const x = Number(String(v).replace(',', '.').replace(/\s/g, '')); if (String(v).trim() === '' || isNaN(x)) return; ok = Math.abs(x - t.a) < 1e-6; } else if (t.k === 't') { if (!String(v).trim()) return; ok = txtOk(t, v); } else ok = v === t.a;
  r.tries++; r.v = v; if (!ok && t.k === 'c') r.wrong.push(v);
  if (ok || r.tries >= 2 || (t.k === 'c' && t.opts.length - r.wrong.length <= 1)) { r.fin = true; r.ok = ok; }
  const a0 = L.ans[i]; if (ok && L.fixPaid && a0 && a0.final && !(a0.ok && a0.tries === 1) && !a0.fix && !(t.k === 'c' && t.opts.length <= 2 && r.tries > 1)) { a0.fix = true; fixRegrade(kid, cur.subj, L); const W = fixList(kid, cur.subj, L), left = W.filter(j => !L.ans[j].fix).length;
    ev(kid, 'исправлено', { subj: subjName(kid, cur.subj, cur.ds), unit: (unitById(kid, cur.subj, L.uid) || {}).t || '', q: strip(t.q), ans: String(v), right: String(t.a), ok: 'верно' }); save(); if (!left) alertMsg('Все ошибки исправлены — 100%! 💪'); }
  render(); }
function vHwText(kid, L){ const K = S.kids[kid]; const items = K.hwText.filter(h => (L.txt || []).includes(h.id));
  return `<article class="card"><h2>Задание от Юры</h2>${items.length ? items.map(h => `<label class="check"><input type="checkbox" data-act="hwtxt" data-id="${h.id}" ${h.done ? 'checked' : ''}> ${U.esc(h.text)}</label>`).join('') : '<p>Сегодня отдельных заданий нет.</p>'}</article><button class="btn big" data-act="hwdone">Готово</button>`; }
function vSurvey(L){
  const f = L.fb || {};
  const b = (k, v, t) => `<button class="chip ${f[k] === v ? 'on' : ''}" data-act="fb" data-k="${k}" data-v="${v}">${t}</button>`;
  return `<article class="card survey"><h2>Как тебе урок?</h2>
  <div class="row">${b('mood', 4, '😀 Здорово')}${b('mood', 3, '🙂 Хорошо')}${b('mood', 2, '😐 Так себе')}${b('mood', 1, '🙁 Плохо')}</div>
  <h3>Было…</h3><div class="row">${b('diff', 'легко', 'легко')}${b('diff', 'нормально', 'нормально')}${b('diff', 'трудно', 'трудно')}</div>
  <h3>Больше всего понравилось</h3><div class="row">${b('like', 'объяснение', 'объяснение')}${b('like', 'задания', 'задания')}${b('like', 'текст', 'текст')}${b('like', 'награды', 'награды')}${b('like', 'ничего', 'ничего')}</div>
  <label class="free">Что было непонятно или скучно? (можно не писать)<textarea id="fbtext" rows="2">${U.esc(f.text || '')}</textarea></label></article>
  <button class="btn big" data-act="sendfb" ${f.mood && f.diff ? '' : 'disabled'}>Отправить и получить награду</button>`;
}
function vResult(kid, subj, L){
  const msg = L.consolidate ? 'Хорошо! Завтра закрепим эту тему ещё раз — с новыми заданиями.' : L.passed === true ? 'Тема пройдена! Завтра — следующая.' : L.passed === false ? 'Завтра повторим эту тему с новыми заданиями.' : '';
  return `<article class="card result">${L.grade >= 4 ? `<div class="cheer">${U.rng(L.seed || 3).pick(THEME[TH(kid)].win)}</div>` : ''}<div class="bigmark m${L.grade}">${L.grade}</div><p>Правильно с первого раза: <b>${L.score} из ${L.total}</b></p><p>${msg}</p><p class="earn">Заработано минут игры: ${coinsHtml(L.coins || 0)}</p>${L.ootCut ? '<p class="hint">Урок был не по порядку — баллов только треть.</p>' : ''}${L.hwCut ? '<p class="hint">📒 Домашнее задание по прошлому уроку не было сделано — баллов 70%.</p>' : ''}${L.rusCut ? `<p class="hint">📚 Баллы за этот урок — ${L.rusCut}%: русский пока не на пятёрку. Подтяни русский, и все баллы станут полными.</p>` : ''}${L.fastCut ? '<p class="hint">Слишком быстро — баллов меньше. Решай внимательно, проверяй себя.</p>' : ''}${fineCard(kid)}${typeof srResult === 'function' ? srResult(kid, L) : ''}${L.coins ? `<div class="burst" aria-hidden="true">${Array.from({ length: Math.min(14, 4 + L.coins) }, (_, i) => `<span style="--dx:${Math.round(Math.cos(i * 2.4) * 160)}px;--dy:${Math.round(-60 - Math.abs(Math.sin(i * 1.7)) * 180)}px;--r:${i * 40}deg;animation-delay:${i * 60}ms">${i % 3 ? '🪙' : L.grade >= 5 ? '⭐' : '✨'}</span>`).join('')}</div>` : ''}${L.proOpen ? '<div class="card win"><h2>Открыт уровень PRO!</h2><p>Все уроки сегодня на 4 и 5. В PRO можно заработать ещё до 30 минут сверх дневной нормы.</p></div>' : ''}${L.perfect ? '<p class="earn">🌟 Безупречный день: +10 минут!</p>' : L.q != null && L.q < .6 ? '<p class="hint">Слишком много ошибок — за этот урок минут нет. Будь внимательнее!</p>' : ''}</article>${fixCard(kid, subj, L)}<button class="btn big" data-act="home">К урокам</button>`;
}
/* Работа над ошибками: в любое время, без перерыва. Платная (Юрий 24.11): 10 баллов за урок — тогда исправленные ошибки поднимают результат урока до 100%.
   Бесплатное домашнее задание (hw.js) снимает штраф 70%, но результат урока не меняет. */
const FIX_PRICE = 10;
function fixList(kid, subj, L){ const T = lessonTasks(L, kid, subj) || []; return T.map((t, j) => j).filter(j => { const a = L.ans[j]; return a && a.final && !(a.ok && a.tries === 1); }); }
function fixCard(kid, subj, L){ if (!L.ans || ITEMS(subj) && subj === 'hw') return ''; const W = fixList(kid, subj, L); if (!W.length) return ''; const F = W.filter(j => L.ans[j].fix).length, tot = L.total || lessonTasks(L, kid, subj).length, pct = Math.round(((L.score || 0) + F) / Math.max(1, tot) * 100), nx = W.find(j => !L.ans[j].fix);
  if (!L.fixPaid) { const c = S.kids[kid].coins || 0; return `<article class="card fixc"><h2>🛠 Работа над ошибками</h2><p>Результат урока: <b>${pct}%</b>. Хочешь улучшить? Исправь ошибки — результат станет до 100%, а оценка для уровня PRO — до четвёрки.</p><p class="hint">Работа над ошибками стоит ${FIX_PRICE} баллов. Бесплатное домашнее задание на главной снимает штраф за следующий урок, но результат этого урока не меняет.</p>${c >= FIX_PRICE ? `<button class="btn" data-act="fixbuy">Улучшить результат за ${FIX_PRICE} баллов</button>` : `<p class="hint">Нужно ${FIX_PRICE} баллов, у тебя ${c}.</p>`}</article>`; }
  return `<article class="card fixc"><h2>🛠 Работа над ошибками</h2><p>Исправлено <b>${F} из ${W.length}</b> · результат с исправлениями: <b>${pct}%</b></p><p>Оценка урока для уровня PRO: <b>${lesGrade(L)}</b></p><p class="hint">Оплачено. Исправляй в любое время, даже в перерыв. Исправленные ошибки засчитываются и как домашнее задание.</p>${nx != null ? `<button class="btn" data-act="rtask" data-i="${nx}">${F ? 'Дальше исправлять' : 'Исправить ошибки'}</button>` : '<p class="earn">✅ Все ошибки исправлены — 100%!</p>'}</article>`; }
function fixRegrade(kid, subj, L){ L.fixGrade = lesGrade(L);
  const D = dayRec(kid, cur.ds); if (cur.ds === U.today() && D.bonus && !D.proOpen && proOk(kid, D)) { D.proOpen = true; ev(kid, 'PRO открыт', { text: 'после работы над ошибками' }); setTimeout(() => alertMsg('Открыт уровень PRO! Там можно заработать ещё до 30 минут.'), 0); } }
function fixBuy(kid, subj, L){ const K = S.kids[kid]; if (!L || L.fixPaid || (K.coins || 0) < FIX_PRICE) return; K.coins -= FIX_PRICE; L.fixPaid = true; fixRegrade(kid, subj, L);
  ev(kid, 'работа над ошибками', { subj: subjName(kid, subj, cur.ds), unit: (unitById(kid, subj, L.uid) || {}).t || '', price: -FIX_PRICE, coins: K.coins }); save(); }

/* ----- Штраф за небрежность (решение Юрия 23.11, правила — совет с ChatGPT и Gemini) -----
   «Наугад» — неверный ответ быстрее, чем можно прочитать вопрос: 2 с + 0,9 с на слово (Ярик) / 0,4 с (Аня), не меньше 3 с.
   Первые 2 ответа наугад в уроке прощаются, с 3-го — минус 2 балла за каждый, не больше 6 за урок и 12 за день, ниже нуля не уходит.
   Честные (медленные) ошибки и «Не понимаю» не штрафуются. Следующий урок того же предмета без ответов наугад возвращает половину снятого.
   Ребёнок видит карточку сразу после урока и при следующем входе. В Словоходе — только если родитель включил. */
const FINE_FREE = 2, FINE_EACH = 2, FINE_LESSON = 6, FINE_DAY = 12;
function fineOn(){ return FAM ? !!(S.cfg && S.cfg.fineOn) : !(S.cfg && S.cfg.fineOff); }
function guessSecs(kid, t){ const w = String(strip(t.q || '')).split(/\s+/).filter(Boolean).length; return Math.max(3, 2 + w * (TPL(kid) === 'yarik' ? .9 : .4)); }
function fineCheck(kid, subj, L, D){ if (!fineOn() || !L.ans) return; const K = S.kids[kid], g = L.ans.filter(a => a && a.guess != null), nm = subjName(kid, subj, cur.ds); K.fines = K.fines || []; K.fineBack = K.fineBack || {};
  const back = K.fineBack[subj];
  if (!g.length && back) { K.coins += back; K.fines.push({ d: cur.ds, back: back, subj: U.noEmo(nm), seen: false }); ev(kid, 'штраф возвращён', { subj: nm, price: back, coins: K.coins, text: 'урок без ответов наугад' }); delete K.fineBack[subj]; }
  if (g.length <= FINE_FREE) return;
  let n = Math.min(FINE_LESSON, (g.length - FINE_FREE) * FINE_EACH); D.fine = D.fine || 0; n = Math.min(n, FINE_DAY - D.fine, K.coins); if (n <= 0) return;
  K.coins -= n; D.fine += n; L.fine = n; const fast = Math.min.apply(null, g.map(a => a.guess)), slow = Math.max.apply(null, g.map(a => a.guess));
  const why = `${g.length} ${U.pl(g.length, 'ответ', 'ответа', 'ответов')} наугад: быстрее, чем можно прочитать вопрос (за ${fast === slow ? U.dec(fast) : U.dec(fast) + '–' + U.dec(slow)} с). Первые ${FINE_FREE} прощаются.`;
  K.fines.push({ d: cur.ds, n: n, subj: U.noEmo(nm), unit: lessonTitle(kid, subj, cur.ds), why: why, seen: false }); K.fineBack[subj] = (K.fineBack[subj] || 0) + Math.ceil(n / 2);
  ev(kid, 'штраф', { subj: nm, unit: lessonTitle(kid, subj, cur.ds), price: -n, coins: K.coins, text: why }); }
function fineCard(kid){ const K = S.kids[kid], F = (K.fines || []).filter(f => !f.seen); if (!F.length) return '';
  return `<article class="card finec"><h2>${F.some(f => f.n) ? 'Сняты баллы за спешку' : 'Баллы вернулись'}</h2><ul class="plain">${F.map(f => f.n ? `<li><b>−${f.n}</b> · ${U.esc(f.subj)}${f.unit ? ' «' + U.esc(U.noEmo(f.unit)) + '»' : ''}: ${U.esc(f.why)}</li>` : `<li><b>+${f.back}</b> · ${U.esc(f.subj)}: урок без ответов наугад, вернули половину снятого.</li>`).join('')}</ul>${F.some(f => f.n) ? `<p class="hint">Сделай следующий урок по этому предмету внимательно — и половина вернётся.</p>` : ''}<button class="btn" data-act="fineseen">Понятно</button></article>`; }
/* ----- Ответы ----- */
function answer(v){
  const kid = cur.kid, subj = cur.subj, L = dayRec(kid, cur.ds).les[subj], T = lessonTasks(L, kid, subj), t = T[L.i];
  const a = L.ans[L.i] || (L.ans[L.i] = { tries: 0, wrong: [] }); if (a.final) return;
  let ok;
  if (t.k === 'n') { const x = Number(String(v).replace(',', '.').replace(/\s/g, '')); if (String(v).trim() === '' || isNaN(x)) return; ok = Math.abs(x - t.a) < 1e-6; }
  else if (t.k === 't') { if (!String(v).trim()) return; ok = txtOk(t, v); }
  else ok = v === t.a;
  a.tries++; a.v = v;
  if (!ok && t.k === 'c') a.wrong.push(v);
  const lastTry = (subj === 'pro' && !t.pro) || (t.k === 'c' && t.opts.length - a.wrong.length <= 1);
  if (ok || a.tries >= 1 || lastTry) { /* засчитывается только первый ответ */ a.final = true; a.ok = ok;
    if (!ok && a.tries === 1 && fineOn()) { const sec = (Date.now() - ((L.qt || {})[L.i] || Date.now())) / 1000; if (sec < guessSecs(kid, t)) { a.guess = Math.round(sec * 10) / 10; } }
    const K = S.kids[kid];
    const uid = ITEMS(subj) ? (t.uid || subj) : L.uid;
    t.uid = uid;
    if (subj !== 'hw') { const s = K.stats[uid] || (K.stats[uid] = { n: 0, ok: 0 }); s.n++; if (ok && a.tries === 1) s.ok++; }
    if (!(ok && a.tries === 1) && !t.pro) addSrs(kid, t.sj || subj, t);
    if (subj === 'hw') updSrs(kid, L.keys[L.i], ok && a.tries === 1);
    ev(kid, 'ответ', { subj: subjName(kid, subj, cur.ds), unit: subj === 'hw' ? 'повторение' : subj === 'extra' ? 'экстра' : subj === 'pro' ? 'PRO' : subj === 'train' ? 'Испытание' : unitById(kid, subj, L.uid).t, q: strip(t.q), ans: String(v), right: t.k === 'n' ? U.dec(t.a) : t.a, ok: ok && a.tries === 1 ? 'верно' : ok ? 'со 2-й попытки' : 'ошибка' });
  }
  save(); render();
}
/* Задания со вводом, где подходит больше одного ответа: дополнительные верные ответы */
const TXT_ALT = { 'My parents ___ at work.': ['are'], '___ the film good?': ['Is'], 'Todos os dias ele ___ à escola a pé.': ['vai'], 'A Ana é tão alta ___ a irmã.': ['quanto'], 'Wait, I ___ help you!': ['will'], 'I think Yarik ___ win the match.': ["'ll"] };
const TXT_KEEP = { 'You ___ not run in the library.': 1 };
function txtN(x){ return String(x).toLowerCase().replace(/[’`]/g, "'").replace(/[«».!?]/g, '').replace(/\bcan't\b|\bcannot\b/g, 'can not').replace(/\bwon't\b/g, 'will not').replace(/n't\b/g, ' not').replace(/^'ll$|\b'll\b/g, 'will').replace(/(\w)'ll\b/g, '$1 will').replace(/^'m$/, 'am').replace(/^'re$/, 'are').replace(/^'s$/, 'is').replace(/\s+/g, ' ').trim(); }
function txtOk(t, v){ const e = x => x.length > 1 ? x.replace(/ё/g, 'е') : x, z = e(txtN(v)); if (z === e(txtN(t.a)) || (t.alt || []).some(x => e(txtN(x)) === z)) return true;
  /* Русское слово в другом падеже («коза» вместо «козу») — засчитываем, если это не задание на правописание */ const A = e(txtN(t.a)), st = x => x.slice(0, Math.max(3, x.length - 2)); return !/_/.test(t.q || '') && /^[а-я]{4,}$/.test(A) && /^[а-я]{4,}$/.test(z) && st(A) === st(z); }
function addSrs(kid, subj, t){ const K = S.kids[kid]; const key = U.h(t.q + t.a) + ''; if (K.srs.some(x => x.key === key)) return; const copy = JSON.parse(JSON.stringify(t)); K.srs.push({ key, task: copy, step: 0, due: U.addDays(cur.ds, 1) }); }
function updSrs(kid, key, ok){ const K = S.kids[kid]; const x = K.srs.find(z => z.key === key); if (!x) return; if (ok) { x.step++; if (x.step >= STEPS.length) K.srs = K.srs.filter(z => z !== x); else x.due = U.addDays(cur.ds, STEPS[x.step]); } else { x.step = 0; x.due = U.addDays(cur.ds, 1); } }
function nextTask(){
  const kid = cur.kid, subj = cur.subj, L = dayRec(kid, cur.ds).les[subj], T = lessonTasks(L, kid, subj);
  if (L.i + 1 < T.length) { L.i++; save(); render(); return; }
  if (subj === 'hw' && S.kids[kid].hwText.some(h => !h.done && (L.txt || []).includes(h.id))) { L.items = []; save(); render(); return; }
  if (subj === 'lang' && foreignList(L).length) { L.phase = 'fread'; startForeign(kid, L); save(); render(); return; }
  L.phase = 'survey'; save(); render();
}
function finishLesson(){
  const kid = cur.kid, subj = cur.subj, K = S.kids[kid], D = dayRec(kid, cur.ds), L = D.les[subj];
  L.ttl = lessonTitle(kid, subj, cur.ds);
  const T = subj === 'read' ? [] : lessonTasks(L, kid, subj);
  const ans = subj === 'read' ? L.ans : L.ans; const total = subj === 'read' ? (readText(kid).qs.length) : T.length;
  const first = ans.filter(a => a && a.ok && a.tries === 1).length + (L.fans ? L.fans.filter(a => a && a.ok && a.tries === 1).length : 0);
  const tot = total + (L.fans ? L.fq : 0);
  const ratio = tot ? first / tot : 1; L.score = first; L.total = tot; L.grade = grade(ratio);
  const q = lessonQuality(kid, subj, L, ratio); L.q = q;
  if (subj !== 'read' && !ITEMS(subj)) {
    const key = subj + L.tr; L.passed = ratio >= .8;
    /* Каждая тема — два урока: изучение и закрепление. Дальше идём, когда тема сдана дважды (≥80%). */
    if (L.passed) { K.passN = K.passN || {}; const pn = (K.passN[L.uid] || 0) + (ratio === 1 ? 2 : 1); /* всё верно с первого раза — тема закрыта сразу, без закрепления */ K.passN[L.uid] = pn; if (pn >= 2) { K.pos[key] = (K.pos[key] || 0) + 1; L.topicDone = true; } else L.consolidate = true; }
    const f = L.fb || {}; const lv = K.lvl[subj] || 0;
    if (ratio === 1 && f.diff !== 'трудно') K.lvl[subj] = Math.min(lv + 1, 5); else if (f.diff === 'трудно' && ratio < .75) K.lvl[subj] = Math.max(lv - 1, -1);
  }
  if (subj === 'hw') K.hwText.forEach(h => { if ((L.txt || []).includes(h.id)) h.done = true; });
  L.secs = Math.min(1500, Math.round((Date.now() - (L.t0 || Date.now())) / 1000)); D.secs = (D.secs || 0) + L.secs; restTick(kid, L.secs);
  if (subj === 'extra') { /* Экстра после закрытого дня: +5 баллов при 80% верных с первого раза, +3 при 60% */
    const rk = rusK(kid, subj), pts = Math.round((ratio >= .8 ? EXTRA_BONUS : ratio >= .6 ? 3 : 0) * rk); if (rk < 1) L.rusCut = Math.round(rk * 100); pts = piggyAdd(K, pts); L.coins = pts; D.extraPts = pts; L.phase = 'done';
    ev(kid, 'экстра', { subj: 'Экстра', score: `${first}/${tot}`, grade: L.grade, coins: K.coins, text: `+${pts} баллов` }); save(); render(); return; }
  if (subj === 'train') { /* Испытание после PRO: новые темы, одна попытка; до +15 баллов */
    let pts = ratio >= .85 ? TRAIN_BONUS : ratio >= .7 ? 10 : ratio >= .55 ? 5 : 0; { const rk = rusK(kid, subj); if (rk < 1) { pts = Math.round(pts * rk); L.rusCut = Math.round(rk * 100); } } const minS = T.length * (TPL(kid) === 'yarik' ? 25 : 30); if (L.secs < minS) { pts = Math.round(pts / 2); L.fastCut = true; }
    pts = piggyAdd(K, pts); L.coins = pts; D.trainPts = pts; L.phase = 'done';
    ev(kid, 'испытание', { subj: '🔥 Испытание', score: `${first}/${tot}`, grade: L.grade, coins: K.coins, secs: L.secs, text: `+${pts} баллов` }); save(); render(); return; }
  if (subj === 'pro') { /* PRO: тот же день сложнее, одна попытка; до +30 баллов сверх дневного лимита */
    let pts = ratio >= .9 ? PRO_BONUS : ratio >= .75 ? 20 : ratio >= .6 ? 10 : 0; { const rk = rusK(kid, subj); if (rk < 1) { pts = Math.round(pts * rk); L.rusCut = Math.round(rk * 100); } } const minS = T.length * (TPL(kid) === 'yarik' ? 20 : 25); if (L.secs < minS) { pts = Math.round(pts / 2); L.fastCut = true; }
    pts = piggyAdd(K, pts); L.coins = pts; D.proPts = pts; L.phase = 'done';
    ev(kid, 'PRO', { subj: 'Уровень PRO', score: `${first}/${tot}`, grade: L.grade, coins: K.coins, secs: L.secs, text: `+${pts} баллов` }); save(); render(); return; }
  const subs = todaySubjects(kid), W = KIDS[kid].w || {}, wsum = subs.reduce((s0, x) => s0 + (W[x] || .1), 0), M = LESSON_POOL * (W[subj] || .1) / Math.max(1, wsum);
  let pts = q < .6 ? 0 : Math.round(M * q * q);
  /* Баллы за усилие: урок, пролетевший быстрее нормы времени, даёт меньше (норма ≈ 25–30 с на задание) */
  if (subj !== 'read' && !ITEMS(subj)) { const T0 = lessonTasks(L, kid, subj), minS = (T0.length || 5) * (TPL(kid) === 'yarik' ? 35 : 40), fk = Math.min(1, L.secs / minS); if (fk < 1) { pts = Math.round(pts * Math.max(.3, fk)); L.fastCut = fk < .9; }
  }
  /* Урок, открытый не по порядку за баллы: пока день не закрыт целиком, только треть */
  if (subj !== 'read' && !ITEMS(subj)) { const ow = hwOwed(kid, subj, cur.ds); if (ow && pts > 0) { pts = Math.round(pts * HW_K); L.hwCut = ow.n; } }
  { const rk = rusK(kid, subj); if (rk < 1 && pts > 0) { L.rusCut = Math.round(rk * 100); pts = Math.round(pts * rk); } }
  if (subj !== 'read' && !ITEMS(subj) && typeof srPts === 'function') pts = srPts(kid, subj, L, lessonTasks(L, kid, subj), pts);
  if (L.oot && !subs.every(s => s === subj || (D.les[s] && D.les[s].phase === 'done'))) { pts = Math.round(pts / 3); L.ootCut = true; } D.pts = D.pts || 0; pts = Math.max(0, Math.min(pts, LESSON_POOL - D.pts)); D.pts += pts;
  pts = piggyAdd(K, pts); L.coins = pts; L.phase = 'done';
  fineCheck(kid, subj, L, D);
  if (!D.bonus && subs.every(s => D.les[s] && D.les[s].phase === 'done')) { D.bonus = true; { const t0 = U.today(); K.okStreak = (K.lastDone === U.addDays(t0, -1) || K.lastDone === t0) ? (K.okStreak || 0) + 1 : 1; if (K.okStreak >= 2 && K.baseCut) { K.baseCut = 0; ev(kid, 'базовое время вернулось', { text: 'игры 60 мин, YouTube 30 мин' }); } } K.lastDone = U.today(); K.burnBase = 0;
    if (subs.every(s => (D.les[s].q || 0) >= .9 && !D.les[s].fastCut && !D.les[s].oot)) { let b = Math.max(0, DAY_MAX - D.pts); b = piggyAdd(K, b); D.pts += b; L.coins += b; L.perfect = true; D.perfect = b; }
    if (proOk(kid, D)) { L.proOpen = true; D.proOpen = true; ev(kid, 'PRO открыт', { text: 'все уроки дня на 4 и 5' }); }
    const mins = Math.round(D.secs / 60); K.extraN = K.extraN || 0; if (mins < 40) K.extraN = Math.min(3, K.extraN + 1); else if (mins > 65) K.extraN = Math.max(-2, K.extraN - 1);
    ev(kid, 'день завершён', { coins: K.coins, score: D.pts + ' мин игры заработано', secs: D.secs, text: `занимался ${mins} мин` }); }
  ev(kid, 'урок завершён', { subj: subjName(kid, subj, cur.ds), unit: lessonTitle(kid, subj, cur.ds), score: `${first}/${tot}`, grade: L.grade, passed: L.passed === undefined ? '' : L.consolidate ? 'сдано 1 из 2 (закрепление завтра)' : L.passed ? 'тема пройдена' : 'повтор', mood: (L.fb || {}).mood, diff: (L.fb || {}).diff, like: (L.fb || {}).like, text: (L.fb || {}).text, coins: K.coins });
  save(); render();
}

/* ----- Баллы: 1 балл = 1 минута игры. За день максимум 60: 50 за уроки по качеству + 10 за безупречный день ----- */
/* Русский — главный предмет. Пока по чтению и русскому не «пятёрка», баллы по остальным предметам идут с понижением.
   Оценка — средняя оценка за последние 10 уроков чтения и русского (L.q от 0 до 1). */
const RUS_SUBJ = { read: 1, rus: 1 };
function rusState(kid){ const K = S.kids[kid], qs = [];
  for (const ds of Object.keys(K.days || {}).sort().reverse()) { const D = K.days[ds]; for (const s of ['read', 'rus']) { const L = D.les && D.les[s]; if (L && L.phase === 'done' && typeof L.q === 'number') qs.push(L.q); } if (qs.length >= 10) break; }
  const n = qs.length, avg = n ? qs.reduce((a, b) => a + b, 0) / n : 0, low5 = qs.slice(0, 5).some(x => x < .75);
  const k = n < 3 ? .85 : avg >= .9 && !low5 ? 1 : avg >= .8 ? .85 : avg >= .7 ? .7 : .55;
  return { n, avg, k }; }
function rusK(kid, subj){ return RUS_SUBJ[subj] || subj === 'hw' ? 1 : rusState(kid).k; }
function rusNote(kid){ const r = rusState(kid); if (r.k >= 1) return ''; if (r.n < 3) return `<div class="note">📚 Сначала покажи себя в русском и чтении: после трёх уроков станет ясно, полные ли баллы за остальные предметы. Пока они идут на ${Math.round(r.k * 100)}%.</div>`; return `<div class="note">📚 Русский пока не на пятёрку, поэтому за остальные предметы баллы идут на ${Math.round(r.k * 100)}%. Подтяни чтение и русский — и все баллы станут полными!</div>`; }
const DAY_MAX = 60, DAY_BONUS = 10, LESSON_POOL = DAY_MAX - DAY_BONUS, SKIP_PRICE = 10, EXTRA_BONUS = 5, PRO_BONUS = 30;
function extraTile(kid, D){ if (!D.bonus || cur.ds !== U.today()) return ''; const L = D.les.extra;
  if (!L && !extraTasks(kid, D).length) return '';
  const st = L && L.phase === 'done' ? 'done' : L ? 'go' : 'new';
  return `<button class="tile extra ${st}" data-act="openextra"><span class="ico">⭐</span><span class="tt"><span class="sn">Экстра</span><span class="ut">${st === 'done' ? `Сделано: +${L.coins || 0} ${U.pl(L.coins || 0, 'балл', 'балла', 'баллов')}` : 'Хочешь ещё? Задания по сегодняшним ошибкам: +5 баллов'}</span></span>${L && L.grade ? `<span class="mark m${L.grade}">${L.grade}</span>` : ''}</button>`; }
/* Перерывы (правило Юры 21.11): каждые ~20 минут спрашиваем «Не устал?». Готов — занимается дальше; устал — сам выбирает отдых 15/20/30 мин.
   Но за одну сессию не больше часа занятий: после часа — обязательный перерыв 2 часа. Пройденные уроки и работа над ошибками открыты всегда. */
const REST_MS = 2 * 3600 * 1000, BLOCK_SECS = 20 * 60, SESS_SECS = 60 * 60;
function restLeft(kid){ if (TEST) return 0; return Math.max(0, (S.kids[kid].restUntil || 0) - Date.now()); }
function hhmm(ts){ const d = new Date(ts), z = n => (n < 10 ? '0' : '') + n; return d.getHours() + ':' + z(d.getMinutes()); }
function fmtLeft(ms){ const m = Math.ceil(ms / 60000), h = Math.floor(m / 60), r = m % 60; return h ? h + ' ч ' + r + ' мин' : r + ' мин'; }
function restTick(kid, secs){ /* время теперь считает общий таймер экрана (screenTick) */ }
function restTick0(kid, secs){ if (TEST) return; const K = S.kids[kid], now = Date.now(); if (!K.blkAt || now - K.blkAt > REST_MS) { K.blk = 0; K.sess = 0; } K.blk = (K.blk || 0) + (secs || 0); K.sess = (K.sess || 0) + (secs || 0); K.blkAt = now;
  if (K.sess >= SESS_SECS + extraSecs(K)) { K.blk = 0; K.sess = 0; K.ask = false; K.restUntil = now + REST_MS; K.restForced = true; ev(kid, 'перерыв', { text: 'час занятий за сессию; обязательный перерыв до ' + hhmm(K.restUntil) }); }
  else if (K.blk >= BLOCK_SECS) { K.blk = 0; K.ask = true; } }
/* Таймер экрана: считаем всё время в приложении (уроки, загадки, шахматы, программирование…), пока ребёнок реально нажимает. */
let LAST_IN = Date.now(); ['pointerdown', 'touchstart', 'keydown'].forEach(e => document.addEventListener(e, () => { LAST_IN = Date.now(); }, true));
function screenTick(){ const kid = cur.kid; if (!kid || TEST || !S.parentPin || document.visibilityState === 'hidden' || ['login', 'pin', 'parent'].includes(cur.view) || Date.now() - LAST_IN > 120000) return;
  try { if (sleepNow() || restLeft(kid) || restAsk(kid)) return; } catch (e) { return; }
  const K = S.kids[kid], a0 = K.ask, r0 = K.restUntil; restTick0(kid, 30); save(); if (K.ask !== a0 || K.restUntil !== r0) { if (!busyTyping() && !(typeof RD !== 'undefined' && RD && RD.active)) render(); } }
setInterval(screenTick, 30000);
function tomorrowHtml(kid){ const tm = U.addDays(U.today(), 1), it = []; try { const r = lessonTitle(kid, 'read', tm); if (r) it.push('📖 Новая глава: <b>' + U.esc(r) + '</b>'); } catch (e) {} try { const m = lessonTitle(kid, 'math', tm); if (m) it.push('🔢 Математика: <b>' + U.esc(m) + '</b>'); } catch (e) {}
  it.push('🎵 Новое стихотворение или продолжение', '🎁 Сюрприз-загадка дня'); return '<ul class="tmr">' + it.map(x => '<li>' + x + '</li>').join('') + '</ul>'; }
function vRestScreen(kid){ const K = S.kids[kid], ms = restLeft(kid), g = T(kid) === 'anya', forced = K.restForced, got = dayGot(K).n;
  return `<main class="wrap ${LK(kid)}"><header class="bar"><button class="link" data-act="logout">← Выйти</button><span class="coins">${coinsHtml(K.coins)}</span></header><section class="lesson"><article class="card result restscr">
   ${forced ? `<div class="cheer">🌟</div><h1>На сегодня всё, ты ${g ? 'молодчина' : 'молодец'}!</h1><p>Ты отлично ${g ? 'позанималась' : 'позанимался'} целый час. Сегодня собрано <b>${got}</b> ${U.pl(got, 'балл', 'балла', 'баллов')}. Теперь — отдых для глаз и головы: погуляй, поиграй в мяч, почитай бумажную книжку.</p><p>${new Date(K.restUntil).getHours() >= CLOSE_H - 1 || new Date(K.restUntil).getDate() !== new Date().getDate() ? 'Следующее занятие — <b>завтра с 8 утра</b>.' : `Следующее занятие — в <b>${hhmm(K.restUntil)}</b> (через <span id="restleft">${fmtLeft(ms)}</span>).`}</p><h3>Завтра тебя ждёт:</h3>${tomorrowHtml(kid)}`
   : `<div class="cheer">😴</div><h1>Отдыхаешь</h1><p>Вернёшься через <b><span id="restleft">${fmtLeft(ms)}</span></b> (в ${hhmm(K.restUntil)}). Отойди от экрана: подвигайся, попей воды, посмотри в окно.</p>`}
   <p class="hint">Все баллы и прогресс сохранены.</p></article></section></main>`; }
function vAsk(kid){ return `<main class="wrap ${LK(kid)}"><header class="bar"><button class="link" data-act="logout">← Выйти</button><span class="coins">${coinsHtml(S.kids[kid].coins)}</span></header><section class="lesson">${askCard(kid)}</section></main>`; }
/* Родитель может добавить ребёнку время на сегодня, шагами по 10 минут */
function extraSecs(K){ return K.xt && K.xt.d === U.today() ? K.xt.m * 60 : 0; }
function restAsk(kid){ const K = S.kids[kid]; return !TEST && K.ask && !restLeft(kid); }
function askCard(kid){ if (!restAsk(kid)) return ''; const K = S.kids[kid], m = Math.round((K.sess || 0) / 60), left = Math.max(5, Math.round((SESS_SECS + extraSecs(K) - (K.sess || 0)) / 60)), g = T(kid) === 'anya';
  return `<div class="card askrest"><h2>${g ? 'Не устала?' : 'Не устал?'} 🙂</h2><p>Ты занимаешься уже <b>${m} мин</b>. Можно продолжить (сегодня ещё до ${left} мин подряд) или отдохнуть.</p>
   <div class="row"><button class="btn" data-act="restgo">💪 ${g ? 'Готова' : 'Готов'} ещё</button></div><p class="hint">Или отдохни — выбери сколько:</p>
   <div class="row">${[15, 20, 30].map(n => `<button class="btn ghost" data-act="restpick" data-m="${n}">😴 ${n} мин</button>`).join(' ')}</div></div>`; }
function restGate(kid, s){ const D = dayRec(kid, cur.ds); if (D.les[s]) return false; if (restAsk(kid)) { go('home'); alertMsg('Сначала ответь: устал или готов ещё? 🙂'); return true; } const ms = restLeft(kid); if (!ms) return false; alertMsg(`Перерыв ☕ Следующее занятие откроется в ${hhmm(S.kids[kid].restUntil)} (через ${fmtLeft(ms)})`); return true; }
function restCard(kid){ const ms = restLeft(kid); if (!ms) return askCard(kid); if (!S.kids[kid].restForced) return `<div class="note rest tipc" data-tip="rest">😴 <b>Отдыхаешь.</b> Новые уроки откроются в <b>${hhmm(S.kids[kid].restUntil)}</b> (через <span id="restleft">${fmtLeft(ms)}</span>). Отойди от экрана: подвигайся, попей воды. Пройденные уроки и работа над ошибками открыты.</div>`; return `<div class="note rest tipc" data-tip="rest">☕ <b>Перерыв.</b> Ты хорошо позанимался(ась)! Следующее занятие откроется в <b>${hhmm(S.kids[kid].restUntil)}</b> (через <span id="restleft">${fmtLeft(ms)}</span>). Пройденные уроки и работа над ошибками открыты.</div>`; }
setInterval(() => { const el = document.getElementById('restleft'); if (!el || !cur.kid) return; const ms = restLeft(cur.kid); if (!ms) render(); else el.textContent = fmtLeft(ms); }, 30000);
function ITEMS(subj){ return subj === 'hw' || subj === 'extra' || subj === 'pro' || subj === 'train'; }
/* Испытание: после PRO — сложные задачи по следующим темам программы (математика, русский, языки), одна попытка */
const TRAIN_BONUS = 15;
function trainReady(kid, D){ return cur.ds === U.today() && D.les.pro && D.les.pro.phase === 'done'; }
function trainTasks(kid, D){ const out = [], K = S.kids[kid];
  const plan = T(kid) === 'yarik' ? [['math', 0, 3], ['math', 1, 3], ['math', 2, 2], ['rus', 0, 2], ['rus', 1, 1], ['lang', 0, 2], ['lang', 1, 1]] : [['math', 0, 3], ['math', 1, 3], ['math', 2, 2], ['rus', 0, 2], ['rus', 1, 2], ['lang', 0, 2]];
  for (const [s, off, n] of plan) { const c = KIDS[kid].cur[s]; if (!c || !c.units) continue; const list = c.units, p0 = K.pos[s] || 0, nMain = list.filter(x => !x.cont).length, i = Math.min(p0 < nMain ? nMain - 1 : list.length - 1, p0 + off), u = list[i]; if (!u) continue;
    for (const x of genTasks(HARD[u.id] ? { g: HARD[u.id] } : u, U.h(kid + cur.ds + 'train' + s + off), n)) { x.sj = s; x.uid = u.id; out.push(x); } }
  const seen = new Set(), uniq = out.filter(x => { const k = String(x.q).replace(/\d+/g, '#').slice(0, 40); if (seen.has(k)) return false; seen.add(k); return true; });
  return U.rng(U.h(kid + cur.ds + 'trainMix')).shuffle(uniq).slice(0, 16); }
function trainTile(kid, D){ if (!trainReady(kid, D)) return ''; const L = D.les.train; if (!L && !trainTasks(kid, D).length) return '';
  const st = L && L.phase === 'done' ? 'done' : L ? 'go' : 'new';
  return `<button class="tile pro ${st}" data-act="opentrain"><span class="ico">🔥</span><span class="tt"><span class="sn">Испытание</span><span class="ut">${st === 'done' ? `Пройдено: +${L.coins || 0} ${U.pl(L.coins || 0, 'балл', 'балла', 'баллов')}` : st === 'go' ? `Задание ${L.i + 1} из ${L.items.length}` : 'Сложные задачи по темам, которые будут дальше. Одна попытка. До +15 баллов'}</span></span>${L && L.grade ? `<span class="mark m${L.grade}">${L.grade}</span>` : ''}</button>`; }
/* Уровень PRO: после всех уроков и Экстры — тот же день заново, но сложнее. По 3 задания на сегодняшнюю тему и 2 на следующую (на завтра). Одна попытка. */
/* Правило Юры 24.11: PRO открывается, когда все уроки дня пройдены на 4 и 5 (повторение ошибок не считается). Экстру ждать не нужно. */
function proOk(kid, D){ const subs = todaySubjects(kid).filter(s => s !== 'hw'); return subs.length > 0 && subs.every(s => D.les[s] && D.les[s].phase === 'done' && lesGrade(D.les[s]) >= 4); }
/* оценка с учётом платной работы над ошибками: исправленный урок засчитывается в PRO не выше четвёрки */
function lesGrade(L){ if (!L.fixPaid || !L.ans) return L.grade || 0; const F = L.ans.filter(a => a && a.final && !(a.ok && a.tries === 1) && a.fix).length, tot = L.total || L.ans.length;
  return Math.max(L.grade || 0, Math.min(4, grade(((L.score || 0) + F) / Math.max(1, tot)))); }
function proReady(kid, D){ return !!D.bonus && cur.ds === U.today() && proOk(kid, D); }
function proTasks(kid, D){ const out = [];
  for (const s of Object.keys(D.les)) { const L = D.les[s]; if (!L.uid || L.phase !== 'done') continue; const u = unitById(kid, s, L.uid); if (!u) continue;
    for (const x of genTasks(HARD[u.id] ? { g: HARD[u.id] } : u, U.h(kid + cur.ds + 'pro' + s), HARD[u.id] ? 4 : 3)) { x.sj = s; x.uid = u.id; out.push(x); }
    const list = unitsOf(kid, s, L.tr), j = list.indexOf(u), nx = j >= 0 && list[j + 1] && (u.cont || !list[j + 1].cont) ? list[j + 1] : null; /* «Продолжение» не подмешиваем, пока идёт основная программа */
    if (nx) for (const x of genTasks(nx, U.h(kid + cur.ds + 'pro2' + s), 2)) { x.sj = s; x.uid = nx.id; x.pro = 1; out.push(x); } }
  return U.rng(U.h(kid + cur.ds + 'proMix')).shuffle(out).slice(0, 16); }
function proTile(kid, D){ if (!proReady(kid, D)) { if (cur.ds !== U.today() || D.les.pro) return '';
    const low = D.bonus ? todaySubjects(kid).filter(s => s !== 'hw' && D.les[s] && lesGrade(D.les[s]) < 4) : [];
    return `<div class="tile pro locked"><span class="ico">🏆</span><span class="tt"><span class="sn">Уровень PRO</span><span class="ut">${D.bonus ? `Сегодня не открылся: ${low.map(s => subjName(kid, s, cur.ds)).join(', ')} ниже четвёрки. Исправь там ошибки в работе над ошибками (${FIX_PRICE} баллов за урок) — и PRO откроется!` : 'Откроется, если все уроки дня будут на 4 и 5. Там можно заработать ещё до 30 минут'}</span></span><span class="state">до +30</span></div>`; }
  const L = D.les.pro; if (!L && !proTasks(kid, D).length) return '';
  const st = L && L.phase === 'done' ? 'done' : L ? 'go' : 'new';
  return `<button class="tile pro ${st}" data-act="openpro"><span class="ico">🏆</span><span class="tt"><span class="sn">Уровень PRO</span><span class="ut">${st === 'done' ? `Пройден: +${L.coins || 0} ${U.pl(L.coins || 0, 'балл', 'балла', 'баллов')}` : st === 'go' ? `Задание ${L.i + 1} из ${L.items.length}` : 'Пройди этот день ещё раз — задачи на смекалку и тема завтрашнего урока. Одна попытка'}</span></span>${L && L.grade ? `<span class="mark m${L.grade}">${L.grade}</span>` : '<span class="state">до +30</span>'}</button>`; }
/* Экстра: по 3 новых задания на темы, где сегодня были ошибки, и по 1 на закрепление остальных; не больше 10 */
function extraTasks(kid, D){ const out = [];
  const subs = Object.keys(D.les).filter(s => D.les[s].uid && D.les[s].phase === 'done').map(s => { const L = D.les[s]; const bad = (L.ans || []).filter(a => a && !(a.ok && a.tries === 1)).length; return { s, L, bad }; }).sort((a, b) => b.bad - a.bad);
  for (const { s, L, bad } of subs) { const u = unitById(kid, s, L.uid); if (!u) continue;
    for (const x of genTasks(u, U.h(kid + cur.ds + 'extra' + s), bad ? 3 : 1)) { x.sj = s; x.uid = u.id; out.push(x); } }
  return out.slice(0, 10); }
function lessonQuality(kid, subj, L, ratio){
  if (subj === 'hw' && !(L.items && L.items.length) && !(L.ans && L.ans.length)) return .9;
  if (subj !== 'read') return ratio;
  const r = L.res || {}, norm = KIDS[kid].norm * .8 * progressFactor(kid);
  /* Без микрофона точность и темп не измерить — не снижаем за это оценку; пересказ взрослому засчитывается полностью */
  const parts = [[ratio, .4]];
  if (r.acc != null) parts.push([r.acc, .25]);
  if (r.wpm) parts.push([r.wpm > KIDS[kid].norm * 3 ? .4 : Math.min(1, r.wpm / norm), .15]);
  if (L.rt && !L.rt.adult) parts.push([L.rt.score, .2]);
  const w = parts.reduce((a, x) => a + x[1], 0); return parts.reduce((a, x) => a + x[0] * x[1], 0) / w;
}
/* Пропуск дня: баллы сгорают. Пропущен 1 день — половина, 2 и больше — все. */
/* Обычное время каждый день (по умолчанию 60 мин игр + 30 мин YouTube, родитель меняет на экране «Время»), не сгорает. Сгорают только заработанные баллы. */
const BASE_GAME = 60, BASE_YT = 30;
/* Что разрешено каждый день: родитель сам вписывает, на что и сколько минут (экран «Время», 22.11). По умолчанию игры 60 + YouTube 30 */
function baseList(kid){ const K = S.kids[kid]; return K && Array.isArray(K.allow) ? K.allow : [{ id: 'g', name: 'Игры', m: BASE_GAME }, { id: 'y', name: 'YouTube', m: BASE_YT }]; }
function baseIcon(name){ const n = String(name).toLowerCase(); return /игр|комп|приставк|роблокс|майнкрафт/.test(n) ? 'game' : /youtube|ютуб|мульт|фильм|кино|сериал|тв|телевиз|видео/.test(n) ? 'video' : /телефон|планшет|айпад/.test(n) ? 'phone' : /прогул|улиц|двор|парк/.test(n) ? 'tree' : /друз|гост/.test(n) ? 'people' : /музык|песн/.test(n) ? 'music' : /мяч|футбол/.test(n) ? 'ball' : 'clock'; }
function baseTime(kid){ const L = baseList(kid); return { game: (L[0] || {}).m || 0, yt: (L[1] || {}).m || 0, cut: 0, list: L }; }
function dayWorked(kid, ds){ const D = S.kids[kid].days[ds]; if (!D || !D.les) return false; const n = (KIDS[kid].order || []).length || 6, done = Object.keys(D.les).filter(s => D.les[s] && D.les[s].phase === 'done' && (KIDS[kid].order || []).includes(s)).length; return done >= Math.ceil(n / 2); }
function burnCheck(kid){ const K = S.kids[kid], t = U.today(); if (!K.lastDone) { K.lastDone = t; K.burnDate = t; return; } if (K.burnDate === t) return; K.burnDate = t;
  let missed = 0, d = K.lastDone; while (U.addDays(d, 1) < t) { d = U.addDays(d, 1); if (!dayWorked(kid, d)) missed++; } /* день, где сделана хотя бы половина уроков, не пропуск (например, не успел до 21:00) */
  const before = K.burnBase == null ? missed : missed - K.burnBase; K.burnBase = missed;
  if (missed < 1 || before < 1 || (K.coins <= 0 && !(K.piggy > 0))) return;
  K.okStreak = 0;
  let lost = K.coins > 0 ? (missed >= 2 ? K.coins : Math.ceil(K.coins / 2)) : 0; K.coins -= lost; if (K.piggy > 0) { const lp = missed >= 2 ? K.piggy : Math.ceil(K.piggy / 2); K.piggy -= lp; lost += lp; }
  const bt = baseTime(kid);
  K.burnMsg = `Ты пропустил(а) занятия — сгорело ${agree(lost + ' баллов')}.`;
  ev(kid, 'баллы сгорели', { coins: K.coins, price: -lost, text: `пропущено дней: ${missed}` }); save(); }
function burnWarn(kid){ const K = S.kids[kid], t = U.today(); if (K.lastDone === t || K.coins <= 0 || dayWorked(kid, t)) return '';
  const y = U.addDays(t, -1); return `<div class="note warn">⏳ Не закончишь сегодня все уроки — завтра сгорит ${K.lastDone >= y ? 'половина баллов' : 'всё, что накоплено'} (${K.coins}).</div>`; }
function timeCard(kid){ const K = S.kids[kid], bt = baseTime(kid);
  return `<div class="card timecard"><h2>Время на сегодня</h2><div class="tt2">${bt.list.filter(x => x.m > 0).map(x => `<span class="tipc" data-tip="base">${icon(baseIcon(x.name))} ${U.esc(x.name)} <b>${x.m} мин</b></span>`).join('')}<span class="tipc" data-tip="coins">⭐ Баллы <b>${K.coins}</b>&nbsp;(+1 минута за балл)</span></div>${piggyCard(kid)}</div>`; }
/* ----- Копилка: заработанное за неделю копится и в воскресенье переходит на счёт с прибавкой +10%. Забрать раньше можно, но без прибавки. ----- */
const PIGGY_RATE = .10;
function weekStart(ds){ const n = U.dayNum(ds), wd = (n + 3) % 7; /* 0 = понедельник */ return U.addDays(ds, -wd); }
/* Общий дневной потолок на ВСЁ приложение (правило Юры 21.11): уроки, Экстра, PRO, загадки, шахматы, программирование, стихи, книги, проценты.
   Когда потолок набран — заниматься можно, но без баллов. */
const DAY_CAP = 75;
function dayGot(K){ const t = U.today(); if (!K.dg || K.dg.d !== t) K.dg = { d: t, n: 0 }; return K.dg; }
function capLeft(K){ return Math.max(0, DAY_CAP - dayGot(K).n); }
function piggyAdd(K, pts){ if (!pts) return 0; if (pts > 0) { const g = dayGot(K); pts = Math.min(pts, Math.max(0, DAY_CAP - g.n)); if (!pts) return 0; g.n += pts; } K.piggy = (K.piggy || 0) + pts; if (!K.piggyWeek) K.piggyWeek = weekStart(U.today()); return pts; }
function piggyCheck(kid){ const K = S.kids[kid], t = U.today(), w = weekStart(t); if (!K.piggyWeek) { K.piggyWeek = w; return; }
  const sunday = (U.dayNum(t) + 3) % 7 === 6; if (K.piggy > 0 && (K.piggyWeek !== w || (sunday && K.piggyPaid !== K.piggyWeek))) { const bonus = K.piggyEarly === K.piggyWeek ? 0 : Math.round(K.piggy * PIGGY_RATE), tot = K.piggy + bonus; K.coins += tot; K.piggyMsg = `🐷 Копилка открыта: ${agree(K.piggy + ' баллов')}${bonus ? ` + ${bonus} за терпение (10%)` : ''} = ${tot} на счёт!`; ev(kid, 'копилка', { coins: K.coins, price: tot, text: `накоплено ${K.piggy}, процент ${bonus}` }); K.piggy = 0; K.piggyPaid = K.piggyWeek; save(); }
  if (K.piggyWeek !== w) { K.piggyWeek = w; save(); } }
function piggyCard(kid){ const K = S.kids[kid], p = K.piggy || 0, b = Math.round(p * PIGGY_RATE);
  return `<div class="piggy"><span class="pig" aria-hidden="true">🐷</span><span><span class="tipc" data-tip="piggy">Копилка: <b>${p}</b></span>${p ? ` · в воскресенье станет <b>${p + b}</b> <span class="tipc" data-tip="percent">(+10%)</span>` : ' · заработанное за уроки копится тут до воскресенья'}</span>${p ? '<button class="link" data-act="piggyearly">Забрать сейчас без процента</button>' : ''}</div>${K.piggyMsg ? `<div class="note">${U.esc(K.piggyMsg)} <button class="link" data-act="piggyseen">Ура!</button></div>` : ''}`; }

/* ----- Чтение ----- */
let RD = null; /* текущая сессия чтения вслух */
function aloudPart(text, limit){ const words = text.split(/\s+/); if (words.length <= limit * 1.25) return { aloud: text, rest: '' };
  let n = limit; while (n < words.length && !/[.!?…»]$/.test(words[n - 1])) n++; const lines = text.split('\n'); let cnt = 0, out = [], rest = [];
  for (const ln of lines) { const w = ln.split(/\s+/).filter(Boolean).length; if (cnt < n) { out.push(ln); cnt += w; } else rest.push(ln); }
  return { aloud: out.join('\n'), rest: rest.join('\n') }; }
function wordsLimit(kid){ const K = S.kids[kid]; if (KIDS[kid].rplan) { const b = rpBand(kid); return Math.max(b.lo, Math.min(b.hi, K.readWords || b.lo)); } return K.readWords || KIDS[kid].startWords; }
function tokensHtml(text, st, p){ let i = 0; return text.split('\n').map(line => '<p>' + line.split(/\s+/).filter(Boolean).map(w => { const k = i++; const c = wCls(st, k, p); return `<span class="w ${c}" data-i="${k}">${U.esc(w)}</span>`; }).join(' ') + '</p>').join(''); }
function vRead(kid, L){
  const t = readText(kid), K = S.kids[kid];
  if (!L.gl && L.phase === 'warm') { L.gl = glossFor(kid, t.text, 4); save(); }
  const { aloud, rest } = aloudPart(t.text, readLim(kid, L));
  const head = `<section class="lesson"><p class="eyebrow">Чтение</p><h1>${U.esc(t.title)}</h1>${t.author ? `<p class="author">${U.esc(t.author)}</p>` : ''}
   <ol class="steps">${(() => { const st = readSteps(t, rest, L), ix = st.indexOf(PH_STEP[L.phase]); return st.map((s, i) => { const on = cur.rview ? s === cur.rview : i === ix; const can = i < ix || (i === ix && cur.rview);
      return `<li class="${i < ix ? 'ok' : ''} ${on ? 'now' : ''} ${can ? 'tap' : ''}">${can ? `<button class="stp" data-act="rview" data-s="${i === ix ? '' : s}">${s}</button>` : s}</li>`; }).join(''); })()}</ol>`;
  if (cur.rview && cur.rview !== PH_STEP[L.phase]) return head + vReview(kid, L, t, aloud, rest) + '</section>';
  if (L.phase === 'warm') {
    const hard = Object.entries(K.hard).sort((a, b) => b[1].miss - a[1].miss).slice(0, 5).map(x => x[0]);
    const auto = t.text.split(/\s+/).map(w => w.replace(/[^\p{L}-]/gu, '')).filter(w => w.length >= 9);
    const list = [...new Set(hard.concat(auto))].slice(0, 6);
    return head + cover(t) + glossCard(kid, L) + `<article class="card"><h2>Разминка: прочитай слова по слогам</h2><p class="hint">Нажми на слово, чтобы его послушать.</p><div class="warm">${list.map(w => `<button class="ww" data-act="sayw" data-w="${U.esc(w)}">${U.esc(w)}</button>`).join('')}</div>
    <p>Сегодня читаешь вслух: <b>${((n) => n + ' ' + U.pl(n, 'слово', 'слова', 'слов'))(aloud.split(/\s+/).length)}</b>. Читай спокойно и чётко, как будто рассказываешь кому-то.</p></article>
    <button class="btn big" data-act="toread">Начать чтение</button></section>`;
  }
  if (L.phase === 'read') {
    rdRestore(L, aloud);
    return head + `<article class="card reading" lang="${L.lang || 'ru'}"><div class="text" id="rtext">${tokensHtml(aloud, RD && RD.st, RD && RD.p)}</div></article>${rest ? '<p class="hint">Это начало главы. Остальное потом дочитаешь сам(а), про себя.</p>' : ''}
    <div class="readbar">${readBar('startread', SR ? `<button class="btn big mic" data-act="startread">🎤 Читать вслух</button>` : `<button class="btn big" data-act="startread">Начать (засекаю время)</button><p class="hint">Здесь айпад не умеет слушать чтение (нужно обновить iPadOS). Ничего страшного: нажми «Начать», читай вслух, в конце нажми «Готово» — я засеку время и посчитаю скорость.</p>`)}</div></section>`;
  }
  if (L.res && L.res.pace && !L.paceSeen && ['silent', 'retell', 'qs'].includes(L.phase)) return head + paceCard(kid, L.res) + '</section>';
  if (L.phase === 'spot') { const v = vSpot(kid, L, head); if (v) return v; }
  if (L.phase === 'words') return vWords(kid, L, head);
  if (L.phase === 'silent') {
    if (!L.st0) { L.st0 = Date.now(); save(); }
    return head + cover(t) + `<article class="card"><p>Теперь дочитай главу <b>про себя</b>, внимательно. Потом перескажешь и ответишь на вопросы с подвохом.</p><p class="hint">Не торопись: раньше чем через ${Math.max(1, Math.round(silentMin(kid, rest) / 60))} мин кнопка не сработает.</p></article>
    <article class="card reading"><div class="text">${tokensHtml(rest)}</div></article><div class="readbar"><button class="btn big" data-act="silentdone">Я дочитал(а) главу</button></div></section>`;
  }
  if (L.phase === 'retell') {
    const r = L.rt;
    if (r) return head + `<article class="card"><h2>Пересказ</h2>${r.adult ? '<p>Хорошо! Теперь вопросы.</p>' : `<p>Ты вспомнил(а) ${r.hit.length} из ${r.n} главных вещей${r.hit.length ? ': ' + r.hit.map(U.esc).join(', ') : ''}.</p>${r.miss.length ? `<p class="hint">Не прозвучало: ${r.miss.map(U.esc).join(', ')}.</p>` : ''}${retellTips(r)}`}</article>${!r.adult && r.score < .5 && (L.rtTries || 0) < 3 ? `<button class="btn ghost" data-act="retellmore">✍️ Дополнить пересказ</button>` : ''}<button class="btn big" data-act="toqs">К вопросам</button></section>`;
    return head + retellBox(L, false) + '</section>';
  }
  if (L.phase === 'qs') {
    const r = L.res || {};
    const qs = readQs(kid, L), i = L.i || 0, q = qs[i], a = L.ans[i] || {};
    const sum = `<div class="readres"><span><b>${r.wpm || '—'}</b> слов в минуту</span>${r.acc != null ? `<span><b>${Math.round(r.acc * 100)}%</b> точность</span>` : ''}${r.errs && r.errs.length ? `<span>Трудные слова: ${r.errs.slice(0, 6).map(U.esc).join(', ')}</span>` : ''}</div>`;
    return head + sum + `<div class="counter">Вопрос ${i + 1} из ${qs.length}</div>${t.kw ? '' : `<details class="peek"><summary>Посмотреть текст</summary><div class="text">${tokensHtml(t.text)}</div></details>`}
    <article class="card task"><div class="q">${U.esc(q.q)}</div>${picWords(q.q)}<div class="opts">${q.opts.map(o => `<button class="opt ${a.final && o === q.a ? 'right' : (a.wrong || []).includes(o) ? 'wrong' : ''}" data-act="rq" data-v="${U.esc(o)}" ${a.final || (a.wrong || []).includes(o) ? 'disabled' : ''}>${U.esc(o)}</button>`).join('')}</div>
    ${a.final ? (a.ok ? `<div class="fb ok"><b>Верно!</b></div>` : `<div class="fb bad"><b>Правильный ответ: ${U.esc(q.a)}</b></div>`) : a.tries ? (t.kw ? '<div class="fb try">Подумай ещё. Тут есть подвох!</div>' : '<div class="fb try">Подумай ещё. Можно заглянуть в текст.</div>') : ''}</article>
    ${a.final ? `<button class="btn big" data-act="rnext">${i + 1 < qs.length ? 'Дальше' : 'Закончить'}</button>` : ''}</section>`;
  }
  if (L.phase === 'survey') return head + vSurvey(L) + '</section>';
  return head + vResult(kid, 'read', L) + `<p class="center hint">${L.res && L.res.good ? 'Отличный темп! Следующий текст будет чуть длиннее.' : L.res && L.res.repeat ? 'Завтра перечитаем этот текст ещё раз — так читать станет легче.' : ''}</p></section>`;
}
const PH_STEP = { warm:'Разминка', read:'Читаю вслух', silent:'Читаю сам', retell:'Пересказ', qs:'Вопросы', spot:'Найди ошибку', words:'Слова', survey:'Отзыв', done:'Отзыв' };
/* Повтор пройденного этапа: можно перечитать, послушать, пересказать ещё раз — баллы не меняются */
function vReview(kid, L, t, aloud, rest){
  const s = cur.rview, K = S.kids[kid], r = L.res || {};
  const back = `<div class="note">Это повторение — баллы не меняются. <button class="link" data-act="rview" data-s="">Вернуться к уроку →</button></div>`;
  if (s === 'Разминка') { const hard = Object.keys(K.hard).slice(0, 5), auto = t.text.split(/\s+/).map(w => w.replace(/[^\p{L}-]/gu, '')).filter(w => w.length >= 9);
    const list = [...new Set(hard.concat(auto))].slice(0, 8);
    return back + glossCard(kid, L) + `<article class="card"><h2>Разминка</h2><div class="warm">${list.map(w => `<button class="ww" data-act="sayw" data-w="${U.esc(w)}">${U.esc(w)}</button>`).join('')}</div></article>`; }
  if (s === 'Читаю вслух' && r.pace) return back + paceCard(kid, r).replace(/<button class="btn big" data-act="paceok">Дальше<\/button>/, '') + `<article class="card reading"><div class="text">${tokensHtml(aloud)}</div></article>`;
  if (s === 'Читаю вслух') return back + `<article class="card"><div class="readres"><span><b>${r.wpm || '—'}</b> слов в минуту</span>${r.acc != null ? `<span><b>${Math.round(r.acc * 100)}%</b> точность</span>` : ''}${r.errs && r.errs.length ? `<span>Трудные слова: ${r.errs.slice(0, 8).map(w => `<button class="ww" data-act="sayw" data-w="${U.esc(w)}">${U.esc(w)}</button>`).join(' ')}</span>` : ''}</div><p class="hint">Прочитай ещё раз вслух — для тренировки.</p></article><article class="card reading"><div class="text">${tokensHtml(aloud)}</div></article>`;
  if (s === 'Слова') return back + glossCard(kid, L);
  if (s === 'Читаю сам') return back + `<article class="card reading"><div class="text">${tokensHtml(rest)}</div></article>`;
  if (s === 'Пересказ') return back + (L.rt && L.rt.text ? `<article class="card"><h2>Твой пересказ</h2><p class="rtell">${U.esc(L.rt.text)}</p>${retellResHtml(L.rt)}</article>` : '') + retellBox(L, true);
  if (s === 'Вопросы') { const qs = readQs(kid, L);
    return back + `<article class="card"><h2>Вопросы</h2><ol class="plain">${qs.map((q, i) => { const a = L.ans[i] || {}; return `<li><b>${U.esc(q.q)}</b><br>Правильно: ${U.esc(q.a)}${a.wrong && a.wrong.length ? `<br><span class="hint">Сначала ответил(а): ${a.wrong.map(U.esc).join(', ')}</span>` : a.final ? ' ✓' : ''}</li>`; }).join('')}</ol></article><details class="peek"><summary>Посмотреть текст</summary><div class="text">${tokensHtml(t.text)}</div></details>`; }
  return back;
}
function readSteps(t, rest, L){ const s = ['Разминка', 'Читаю вслух']; if (rest) s.push('Читаю сам'); if (t.kw) s.push('Пересказ'); s.push('Вопросы'); s.push('Найди ошибку'); if (L && L.gl && L.gl.length) s.push('Слова'); return s.concat(['Отзыв']); }
function readLim(kid, L){ if (L && L.lim) return L.lim; const lim = wordsLimit(kid); if (!KIDS[kid].rplan) return lim; /* по плану текст подобран по силам — читается вслух целиком */ const n = rpWc(readText(kid).text); return n <= rpBand(kid).hi * 1.4 ? Math.max(lim, n) : lim; }
function silentMin(kid, rest){ const w = rest.split(/\s+/).filter(Boolean).length; return Math.min(900, Math.round(w / (KIDS[kid].norm * 2.5) * 60)); }
let RT = null; /* пересказ голосом */
function retellStart(){
  const ta = document.getElementById('rtxt'), had = ta ? ta.value.trim() : '';
  const R0 = RT = { active: true, base: had, cur: '', text: had, t0: Date.now() };
  const rec = new SR(); rec.lang = 'ru-RU'; rec.continuous = true; rec.interimResults = true; R0.rec = rec;
  rec.onresult = e => { let s = ''; for (let i = 0; i < e.results.length; i++) s += ' ' + e.results[i][0].transcript; R0.cur = s; R0.text = (R0.base + ' ' + s).trim(); const el = document.getElementById('rtxt'); if (el) el.value = R0.text; };
  rec.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') R0.denied = true; };
  rec.onend = () => { R0.base += ' ' + R0.cur; R0.cur = ''; if (R0.active && !R0.denied) setTimeout(() => { try { rec.start(); } catch (e) {} }, 120); };
  try { rec.start(); } catch (e) {}
  render();
}
function kwHit(stem, words){ const k = normW(stem), n = Math.min(k.length, Math.max(4, k.length - 2)), p = k.slice(0, n); return words.some(w => w.startsWith(p)); }
function retellStop(){ if (RT) { RT.active = false; try { RT.rec && RT.rec.stop(); } catch (e) {} } const el = document.getElementById('rtxt'); if (el && RT) { el.value = RT.text; } RT = null; render(); }
/* Пересказ: ребёнок надиктовывает (кнопка 🎤 или микрофон на клавиатуре iPad) или пишет, приложение проверяет по главным словам главы */
function retellBox(L, practice){
  const live = RT && RT.active, prev = practice ? (cur.rtDraft || '') : (L.rtDraft || (L.rt && L.rt.text) || '');
  return `<article class="card"><h2>${practice ? 'Перескажи ещё раз (для себя, без баллов)' : 'Перескажи главу своими словами'}</h2>
   <p class="hint">Кто там был? Что случилось? Чем всё закончилось? ${SR ? 'Нажми «🎤 Надиктовать» и рассказывай.' : 'Нажми на поле, потом на 🎤 на клавиатуре и рассказывай — слова появятся сами.'} Потом нажми «Проверить».</p>
   <textarea id="rtxt" class="rtxt" rows="7" placeholder="Здесь появится твой пересказ…">${U.esc(live ? RT.text : prev)}</textarea>
   <div class="row">${SR ? (live ? `<button class="btn stop" data-act="retellstop">⏹ Стоп</button><span class="rstat">Слушаю…</span>` : `<button class="btn mic" data-act="retellstart">🎤 Надиктовать</button>`) : ''}
   <button class="btn big" data-act="${practice ? 'rtpractice' : 'retellcheck'}">Проверить пересказ</button></div>
   ${practice && cur.rtCheck ? retellResHtml(cur.rtCheck) : ''}
   ${!practice && (L.rtTries || 0) >= 2 ? `<p class="hint">Не получается? <button class="link" data-act="retelladult">Пересказал(а) взрослому</button></p>` : ''}</article>`; }
function retellScore(t, text){ const words = text.split(/\s+/).map(normW).filter(Boolean);
  const hit = t.kw.filter(k => kwHit(k, words)), miss = t.kw.filter(k => !hit.includes(k));
  const lenK = Math.min(1, words.length / 40); /* короткий пересказ из одних ключевых слов не засчитываем полностью */
  return { n: t.kw.length, hit, miss, score: Math.round(hit.length / t.kw.length * (.6 + .4 * lenK) * 100) / 100, words: words.length, text: text.slice(0, 2000) }; }
function retellTips(r){ const tips = []; if (r.words < 40) tips.push('Расскажи подробнее: что было в начале, в середине и в конце.'); if (r.miss.length) tips.push('Вспомни, что было про: ' + r.miss.slice(0, 3).map(U.esc).join(', ') + '.'); if (r.score >= .8 && r.words >= 40) tips.push('Молодец, всё главное рассказал(а)!');
  return tips.length ? `<p class="hint">${tips.join(' ')}</p>` : ''; }
function retellResHtml(r){ return `<div class="fb ${r.score >= .6 ? 'ok' : 'try'}">Ты вспомнил(а) ${r.hit.length} из ${r.n} главных вещей. ${retellTips(r)}</div>`; }
function retellCheck(){
  const kid = cur.kid, L = dayRec(kid, cur.ds).les.read, t = readText(kid), el = document.getElementById('rtxt'), text = ((el && el.value) || '').trim();
  if (RT) { RT.active = false; try { RT.rec && RT.rec.stop(); } catch (e) {} RT = null; }
  L.rtDraft = text; const r = retellScore(t, text);
  if (r.words < 12) { L.rtTries = (L.rtTries || 0) + 1; save(); render(); alertMsg('Расскажи подробнее — хотя бы несколько предложений'); return; }
  L.rtTries = (L.rtTries || 0) + 1; L.rt = [L.rt, L.rtKeep, r].filter(Boolean).sort((a, b) => b.score - a.score)[0]; if (L.rt !== r) L.rt = Object.assign({}, L.rt, { text: r.text }); delete L.rtKeep;
  ev(kid, 'пересказ', { subj: 'Чтение', unit: t.title, text: text.slice(0, 1500), score: `${r.hit.length}/${r.n}`, words: r.words });
  save(); render(); }
function readQs(kid, L){ const t = readText(kid); const r = U.rng(L.seed || 1); return t.qs.map(([q, a, ...w]) => ({ q, a, opts: r.shuffle([a, ...w]) })); }

function startRead(lang){
  const kid = cur.kid, L = cur.subj === 'read' ? dayRec(kid, cur.ds).les.read : null;
  const text = cur.subj === 'read' ? aloudPart(readText(kid).text, readLim(kid, L)).aloud : RD_TEXT();
  const T = text.split(/\s+/).filter(Boolean).map(normW);
  const sv = RD && RD.paused && RD.T.length === T.length ? RD : null;
  RD = { active: true, t0: Date.now(), acc: sv ? sv.acc : 0, T, st: sv ? sv.st : new Array(T.length).fill(0), p: sv ? sv.p : 0, base: sv ? sv.base : '', cur: '', lang: lang || 'ru-RU', denied: sv ? sv.denied : false };
  if (SR && !RD.denied) {
    const rec = new SR(); rec.lang = RD.lang; rec.continuous = true; rec.interimResults = true; RD.rec = rec;
    rec.onresult = e => { let s = ''; for (let i = 0; i < e.results.length; i++) s += ' ' + e.results[i][0].transcript; RD.cur = s; updRead(); };
    rec.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { RD.denied = true; RD.active = true; const st = document.getElementById('rstat'); if (st) st.textContent = 'Микрофон не разрешён — читай вслух, я засеку время.'; } };
    rec.onend = () => { RD.base += ' ' + RD.cur; RD.cur = ''; if (RD.active && !RD.denied) setTimeout(() => { try { rec.start(); } catch (e) {} }, 120); };
    try { rec.start(); } catch (e) {}
  }
  render(); if (RD.p) rdScroll();
}
function rdSecs(){ return RD ? (RD.acc || 0) + (RD.active ? (Date.now() - RD.t0) / 1000 : 0) : 0; }
function rdLesson(){ const D = dayRec(cur.kid, cur.ds); return D.les[cur.subj]; }
/* Пауза: останавливаем микрофон и таймер, запоминаем место — потом можно продолжить, даже после выхода */
function pauseRead(){
  if (!RD) return; if (RD.active) { RD.acc = rdSecs(); RD.active = false; try { RD.rec && RD.rec.stop(); } catch (e) {} RD.base += ' ' + (RD.cur || ''); RD.cur = ''; }
  RD.paused = true; const L = rdLesson(); if (L) { L.rdSave = { acc: RD.acc, p: RD.p, st: RD.st, base: RD.base, n: RD.T.length, denied: !!RD.denied }; save(); } }
function rdRestore(L, text){ if (RD || !L || !L.rdSave) return; const T = text.split(/\s+/).filter(Boolean).map(normW); const s = L.rdSave; if (s.n !== T.length) return;
  RD = { active: false, paused: true, acc: s.acc || 0, T, st: s.st || new Array(T.length).fill(0), p: s.p || 0, base: s.base || '', cur: '', denied: !!s.denied }; rdScroll(); }
function rdScroll(){ setTimeout(() => { const c = document.querySelector('#rtext .w.rc'); if (c && c.scrollIntoView) c.scrollIntoView({ block: 'center' }); }, 120); }
function readBar(startAct, startLbl){ const live = RD && RD.active, paused = RD && RD.paused && !live;
  if (live) return `<button class="btn big stop" data-act="stopread">Я дочитал(а)</button><button class="btn ghost" data-act="pauseread">⏸ Пауза</button><span id="rstat" class="rstat">${SR && !RD.denied ? 'Слушаю…' : 'Читай вслух, время идёт'}</span>`;
  if (paused) return `<button class="btn big mic" data-act="${startAct}">▶ Продолжить чтение</button><button class="btn ghost" data-act="stopread">Я дочитал(а)</button><span class="rstat">Пауза${RD.p ? ' · прочитано ' + RD.p + ' из ' + RD.T.length + ' слов' : ''} · читаешь ${Math.max(1, Math.round(rdSecs() / 60))} мин</span>`;
  return startLbl; }
function updRead(){
  const spoken = (RD.base + ' ' + RD.cur).split(/\s+/).map(normW).filter(Boolean);
  const r = align(RD.T, spoken); RD.st = r.st; RD.p = r.p; RD.extra = r.extra;
  document.querySelectorAll('#rtext .w, .ftext .w').forEach(el => { const k = +el.dataset.i; el.className = 'w ' + wCls(r.st, k, r.p); });
  const cur_ = document.querySelector('.w.rc'); if (cur_ && cur_.scrollIntoView) cur_.scrollIntoView({ block: 'center', behavior: 'smooth' });
  const stat = document.getElementById('rstat'); if (stat) stat.textContent = `Прочитано ${r.p} из ${RD.T.length}`;
  if (r.p >= RD.T.length) setTimeout(stopRead, 600);
}
function stopRead(){
  if (!RD || !(RD.active || RD.paused)) return;
  { const sec0 = rdSecs(), minS = (RD.T || []).length / (KIDS[cur.kid].norm * 1.6) * 60; /* без распознавания речи нельзя «пролистать» текст */
    if (!(SR && !RD.denied && RD.p > 0) && sec0 < minS) { alertMsg(`Слишком быстро 🙂 Дочитай вслух до конца, ещё примерно ${Math.max(1, Math.ceil((minS - sec0) / 60))} мин`); return; } }
  const secsAll = rdSecs(); RD.active = false; RD.paused = false; try { RD.rec && RD.rec.stop(); } catch (e) {} { const L0 = rdLesson(); if (L0) delete L0.rdSave; }
  const kid = cur.kid, K = S.kids[kid], secs = Math.max(5, secsAll);
  const useSR = SR && !RD.denied && RD.p > 0;
  const reached = useSR ? RD.p : RD.T.length;
  const wpm = Math.round(reached / (secs / 60));
  const LR = cur.subj === 'read' ? dayRec(kid, cur.ds).les.read : null; if (LR && !LR.lim) LR.lim = readLim(kid);
  const textWords = (cur.subj === 'read' ? aloudPart(readText(kid).text, readLim(kid, LR)).aloud : RD_TEXT()).split(/\s+/).filter(Boolean);
  let errs = [], acc = null;
  if (useSR) { let okc = 0, bad = 0; for (let k = 0; k < RD.p; k++) { if (RD.st[k] === 1) okc++; else if (RD.st[k] === 2) { bad++; errs.push(textWords[k].replace(/[^\p{L}-]/gu, '')); } } acc = okc / Math.max(1, okc + bad); }
  const res = { wpm, acc, errs, secs: Math.round(secs), words: reached, sr: useSR };
  if (cur.subj === 'read') {
    const L = dayRec(kid, cur.ds).les.read; L.res = res; L.i = 0; { const sp = aloudPart(readText(kid).text, readLim(kid, L)); L.phase = sp.rest ? 'silent' : readText(kid).kw ? 'retell' : 'qs'; L.st0 = Date.now(); }
    const norm = KIDS[kid].norm; res.good = (acc == null || acc >= (KIDS[kid].accMin || .9)) && wpm >= norm * .8 * progressFactor(kid) && wpm <= norm * 3;
    res.repeat = acc != null && acc < (KIDS[kid].accMin || .9) - .05;
    errs.forEach(w => { const h = K.hard[w] || (K.hard[w] = { miss: 0, ok: 0 }); h.miss++; });
    if (useSR) RD.T.forEach((w, k) => { if (RD.st[k] === 1) { const orig = textWords[k].replace(/[^\p{L}-]/gu, ''); if (K.hard[orig]) { K.hard[orig].ok++; if (K.hard[orig].ok >= 2) delete K.hard[orig]; } } });
    const lim = wordsLimit(kid); K.readWords = Math.round(res.good ? lim * 1.15 : res.repeat ? Math.max(30, lim * .9) : lim);
    { const pr = K.reading.filter(x => x.lang === 'ru').slice(-1)[0], b0 = readBestOf(kid), lv0 = readLv(kid, b0).i; res.prev = pr ? pr.wpm : null; res.pace = 1;
      if (useSR && readOkRec(kid, res) && wpm > b0) { K.readBest = wpm; res.rec = b0 > 0; } /* без распознавания темп — только по времени (ребёнок мог нажать «Я дочитал» раньше): рекорды и уровни не засчитываем */
      const lv1 = readLv(kid, K.readBest).i; if (lv1 > lv0 && b0 > 0) { res.lvup = lv1; (K.badges = K.badges || []).push({ t: 'read', lv: lv1, d: cur.ds, wpm }); piggyAdd(K, 10); ev(kid, 'новый уровень чтения', { subj: 'Чтение', unit: readLvList(kid)[lv1][1], wpm }); } }
    K.words += reached; K.reading.push({ d: cur.ds, title: readText(kid).title, wpm, acc, lang: 'ru', errs: errs.slice(0, 10) });
    ev(kid, 'чтение вслух', { subj: 'Чтение', unit: readText(kid).title, wpm, acc: acc == null ? '' : Math.round(acc * 100) + '%', words: reached, secs: res.secs, errs: useSR ? errs.join(', ') : 'темп по времени: айпад не слушал чтение' + (RD.denied ? ' (микрофон не разрешён)' : SR ? '' : ' (нет распознавания речи)') + `; ${reached} слов за ${res.secs} с` });
  } else { const L = dayRec(kid, cur.ds).les[cur.subj]; L.fres = res; L.fphase = 'qs'; S.kids[kid].reading.push({ d: cur.ds, title: L.ftitle, wpm, acc, lang: L.tr === '_alt' ? 'en' : 'pt' }); ev(kid, 'чтение вслух', { subj: L.tr === '_alt' ? 'English' : 'Português', unit: L.ftitle, wpm, acc: acc == null ? '' : Math.round(acc * 100) + '%', errs: errs.join(', ') }); }
  save(); render();
}
function progressFactor(kid){ const K = S.kids[kid]; const n = K.reading.filter(x => x.lang === 'ru').length; return Math.min(1, .6 + n * .01); }
function readAnswer(v){
  const kid = cur.kid, L = dayRec(kid, cur.ds).les.read, qs = readQs(kid, L), i = L.i || 0, q = qs[i];
  const a = L.ans[i] || (L.ans[i] = { tries: 0, wrong: [] }); if (a.final) return; a.tries++;
  const ok = v === q.a; if (!ok) a.wrong.push(v);
  if (ok || a.tries >= 1) { a.final = true; a.ok = ok; ev(kid, 'ответ', { subj: 'Чтение', unit: readText(kid).title, q: q.q, ans: v, right: q.a, ok: ok && a.tries === 1 ? 'верно' : ok ? 'со 2-й попытки' : 'ошибка' }); }
  save(); render();
}

/* ----- Чтение на португальском / английском внутри урока языков ----- */
function foreignList(L){ const f = FLANG(cur.kid, L.tr); return f === 'en' ? READ_EN : f === 'pt' ? READ_PT : []; }
/* Язык дорожки «Языки»: '' — основной (португальский), '_alt' — английский; в «Словоходе» задаёт анкета (KIDS[kid].lc) */
function LCODE(kid, tr){ const lc = kid && KIDS[kid] && KIDS[kid].lc; return (lc && lc[tr || '']) || (tr === '_alt' ? 'en-GB' : 'pt-PT'); }
function FLANG(kid, tr){ return LCODE(kid, tr).slice(0, 2); }
function startForeign(kid, L){ const K = S.kids[kid]; const key = L.tr === '_alt' ? 'enRead' : 'ptRead'; const list = foreignList(L).filter(t => T(kid) === 'anya' || t.lvl === 1 || (K.pos[key] || 0) >= 3); const t = list[(K.pos[key] || 0) % list.length]; L.fid = t.id; L.ftitle = t.title; L.fphase = 'read'; L.fans = []; L.fq = t.qs.length; L.fi = 0; }
function curForeign(L){ return foreignList(L).find(t => t.id === L.fid); }
function RD_TEXT(){ const L = dayRec(cur.kid, cur.ds).les[cur.subj]; return curForeign(L).text; }
function vForeign(kid, L){
  const t = curForeign(L), lang = LCODE(cur.kid, L.tr);
  if (L.fphase === 'read') { rdRestore(L, t.text);
    return `<article class="card reading"><h2>${U.esc(t.title)}</h2><div class="text ftext" id="rtext">${tokensHtml(t.text, RD && RD.st, RD && RD.p)}</div><button class="btn ghost small" data-act="sayfull">🔊 Послушать, как читать</button></article>
    <div class="readbar">${readBar('startfread', `<button class="btn big mic" data-act="startfread">🎤 Прочитать вслух</button>`)}</div>`; }
  const r = U.rng(U.h(L.fid + cur.ds)); const qs = t.qs.map(([q, a, ...w]) => ({ q, a, opts: r.shuffle([a, ...w]) })); const i = L.fi, q = qs[i], a = L.fans[i] || {};
  return `<div class="counter">Вопрос ${i + 1} из ${qs.length}</div><details class="peek"><summary>Посмотреть текст</summary><div class="text">${tokensHtml(t.text)}</div></details><article class="card task"><div class="q">${U.esc(q.q)}</div>${picWords(q.q)}<div class="opts">${q.opts.map(o => `<button class="opt ${a.final && o === q.a ? 'right' : (a.wrong || []).includes(o) ? 'wrong' : ''}" data-act="fq" data-v="${U.esc(o)}" ${a.final || (a.wrong || []).includes(o) ? 'disabled' : ''}>${U.esc(o)}</button>`).join('')}</div>${a.final ? (a.ok ? '<div class="fb ok"><b>Certo!</b></div>' : `<div class="fb bad"><b>${U.esc(q.a)}</b></div>`) : a.tries ? '<div class="fb try">Ещё раз.</div>' : ''}</article>${a.final ? `<button class="btn big" data-act="fnext">${i + 1 < qs.length ? 'Дальше' : 'К отзыву'}</button>` : ''}`;
}
function foreignAnswer(v){ const kid = cur.kid, L = dayRec(kid, cur.ds).les[cur.subj], t = curForeign(L); const r = U.rng(U.h(L.fid + cur.ds)); const qs = t.qs.map(([q, a, ...w]) => ({ q, a, opts: r.shuffle([a, ...w]) })); const q = qs[L.fi];
  const a = L.fans[L.fi] || (L.fans[L.fi] = { tries: 0, wrong: [] }); if (a.final) return; a.tries++; const ok = v === q.a; if (!ok) a.wrong.push(v);
  if (ok || a.tries >= 1) { a.final = true; a.ok = ok; ev(kid, 'ответ', { subj: L.tr === '_alt' ? 'English' : 'Português', unit: t.title, q: q.q, ans: v, right: q.a, ok: ok && a.tries === 1 ? 'верно' : ok ? 'со 2-й попытки' : 'ошибка' }); }
  save(); render(); }

/* ----- Магазин ----- */
const CASH_MAX = 2; /* призы-деньги («5 €», «10 €») — не чаще 2 раз в месяц на ребёнка (решение Юрия 23.11) */
function isCash(it){ return /^\s*\d+([.,]\d+)?\s*(€|евро|eur)\s*$/i.test(String(it && it.name || '')); }
/* призы с игровым временем (15/30 мин, час игры, мультики) — каждый не чаще раза в неделю, с понедельника (решение Юрия 23.11) */
function isWeekly(it){ return ['g15', 'g30', 'g60', 'tv', 't3'].includes(it && it.id) || /(\d+\s*минут|час)[^,]*(игр|мульт|сериал)/i.test(String(it && it.name || '')); }
function weekOf(ds){ return Math.floor((U.dayNum(ds) + 3) / 7); }
function weeklyTaken(K, it){ const w = weekOf(U.today()); return (K.purchases || []).some(p => String(p.name) === String(it.name) && p.d && weekOf(p.d) === w); }
function prizeLock(K, it){ return isCash(it) && cashLeft(K) <= 0 ? 'деньги — 2 раза в месяц, уже взято' : isWeekly(it) && weeklyTaken(K, it) ? 'уже взято на этой неделе, снова с понедельника' : ''; }
function cashLeft(K){ const m = U.today().slice(0, 7); return CASH_MAX - (K.purchases || []).filter(p => String(p.d || '').slice(0, 7) === m && isCash(p)).length; }
function vShop(){
  const kid = cur.kid, K = S.kids[kid];
  return `<main class="wrap ${LK(kid)}"><header class="bar"><button class="link" data-act="home">← Назад</button><span class="coins">${coinsHtml(K.coins)}</span></header>
  <section class="lesson"><p class="eyebrow">Призы</p><h1>Мои призы</h1><p class="hint">1 балл = 1 минута игры. Обмен подтверждает взрослый своим кодом.</p>
  <div class="shop">${(K.shop || []).map(it => it.price == null ? `<div class="card item"><span class="iname">${U.esc(it.name)}</span><span class="hint">ждёт цену от Юры</span></div>` : `<div class="card item"><span class="iname">${U.esc(it.name)}</span><span class="price">${coinsHtml(it.price)}</span>${prizeLock(K, it) ? `<span class="hint">${prizeLock(K, it)}</span>` : `<button class="btn small" data-act="buy" data-id="${it.id}" ${K.coins < it.price ? 'disabled' : ''}>${K.coins < it.price ? `ещё ${it.price - K.coins}` : 'Обменять'}</button>`}</div>`).join('')}</div>
  <button class="btn ghost" data-act="editprizes">✏️ Изменить мои призы</button>
  ${K.purchases.length ? `<div class="shop-own"><h2>Мои награды</h2><ul class="plain">${K.purchases.slice(-10).reverse().map(p => `<li>${p.d} — ${U.esc(p.name)} (${p.price})</li>`).join('')}</ul></div>` : ''}</section></main>`;
}

/* ----- Выбор призов: ребёнок выбирает сам, цену ставит взрослый ----- */
function prizeIdeas(kid){
  const c = [['g15', '🎮 15 минут игры', 15], ['g30', '🎮 30 минут игры', 30], ['g60', '🎮 Час игры', 60], ['tv', '📺 30 минут мультиков или сериала', 30], ['sw', '🍬 Сладость на выбор', 30], ['late', '🌙 Лечь спать на 30 минут позже', 40],
    ['din', '🍕 Выбрать ужин для всей семьи', 80], ['film', '🎬 Семейный вечер кино — фильм выбираю я', 60], ['cafe', '🍽️ Всей семьёй в кафе или ресторан', 600], ['trip', '🏝️ Семейная поездка — место выбираю я', 1500], ['gift', '🎁 Подарок до 10 €', 400]];
  const y = [['ball', '⚽ Новый мяч или футбольная форма', 800], ['zoo', '🐬 Всей семьёй в океанариум или зоопарк', 700], ['noclean', '🧸 День без уборки игрушек', 50], ['match', '🏟️ Сходить на футбольный матч', 1500]];
  const a = [['book', '📚 Новая книга на выбор', 150], ['stick', '🦉 Наклейки или значок', 50], ['self', '💅 Что-то для себя до 5 €', 200], ['friend', '👭 Позвать друзей в гости', 120], ['nochore', '🧹 Выходной от домашних дел', 60]];
  return c.concat(T(kid) === 'yarik' ? y : a).map(([id, name, price]) => ({ id, name, price }));
}
function vPrizes(){
  const kid = cur.kid, ideas = prizeIdeas(kid).concat(cur.prOwn || []), sel = cur.prSel || [];
  return `<main class="wrap ${LK(kid)}"><header class="bar">${S.kids[kid].prizesSet ? '<button class="link" data-act="home">← Назад</button>' : '<span></span>'}<span class="coins">${coinsHtml(S.kids[kid].coins)}</span></header>
  <section class="lesson"><p class="eyebrow">Мои призы</p><h1>${S.kids[kid].prizesSet ? 'Измени свои призы' : 'Сначала выбери, ради чего будешь учиться'}</h1>
  <p>За уроки ты получаешь баллы: <b>1 балл = 1 минута игры</b>, за день можно заработать до 60. Баллы можно копить и менять на призы. Выбери хотя бы 3 приза или придумай свои.</p>
  <div class="prizes">${ideas.map(it => `<button class="chip ${sel.includes(it.id) ? 'on' : ''}" data-act="prtoggle" data-id="${it.id}">${U.esc(it.name)}${it.price != null ? ` · ${it.price}` : ' · цену назначит Юра'}</button>`).join('')}</div>
  <form class="card form" data-form="prize"><label>Свой приз<input id="prname" maxlength="60" autocomplete="off" placeholder="Например: новая игра, поход в кино…"></label><button class="btn small">Добавить</button><p class="hint">Цену в баллах для своего приза поставит Юра.</p></form>
  <button class="btn big" data-act="prdone" ${sel.length < 3 ? 'disabled' : ''}>Готово (${sel.length})</button></section></main>`;
}

/* ----- Родителям: см. parent.js ----- */
function devInfo(){ const ua = navigator.userAgent; const m = ua.match(/OS (\d+)[_.](\d+)/) || ua.match(/Version\/(\d+)\.(\d+)/); const ios = m ? m[1] + '.' + m[2] : '?'; const pwa = (window.navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches)) ? 'с главного экрана' : 'в браузере';
  return `Версия системы: ${ios}, открыто ${pwa}. Распознавание чтения вслух: ${SR ? '✅ есть' : '❌ нет — нужен iPadOS 14.5 или новее (Настройки → Основные → Обновление ПО); пока скорость чтения считается по таймеру'}. Микрофон: ${navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? 'доступен' : 'недоступен'}.`; }
function vSettings(){
  const unitSel = kid => Object.entries(KIDS[kid].cur).filter(([, c]) => c.units).map(([k, c]) => [['', c.units, c.name]].concat(c.alt ? [['_alt', c.alt, c.altName]] : []).map(([tr, list, nm]) => `<label>${KIDS[kid].name} · ${nm}<select id="sel_${kid}_${k}${tr}">${list.map((u, i) => `${u.cont && !(list[i - 1] || {}).cont ? '<optgroup label="Продолжение (следующий класс)">' : ''}<option value="${i}" ${(S.kids[kid].pos[k + tr] || 0) === i ? 'selected' : ''}>${i + 1}. ${CONT_MARK(u)}${U.esc(U.noEmo(u.t))}</option>${u.cont && i === list.length - 1 ? '</optgroup>' : ''}`).join('')}</select></label>`).join('')).join('');
  const grp = (t, h) => `<details class="pp-group"><summary>${t}</summary>${h}</details>`;
  /* Частое — сверху; редкое и служебное — свёрнуто (совет ChatGPT и Gemini 22.11). Перерывы и добавочное время — на экране «Время». */
  return (FAM ? famSettings() : grp('Коды входа', `<form class="card form" data-form="pins"><h2>Коды</h2><label>Новый код родителя<input id="np" inputmode="numeric" maxlength="4" autocomplete="off"></label><label>Новый код Ярика<input id="ny" inputmode="numeric" maxlength="4" autocomplete="off"></label><label>Новый код Ани<input id="na" inputmode="numeric" maxlength="4" autocomplete="off"></label><button class="btn small">Сменить коды</button></form>`))
    + grp('С какой темы продолжать', `<div class="card form"><h2>Темы: с чего продолжать</h2>${kidIds().map(unitSel).join('')}<button class="btn small" data-act="saveunits">Сохранить темы</button></div>`)
    + (typeof lookSettings === 'function' && lookSettings() ? grp('Оформление', lookSettings()) : '')
    + grp('Служебное: устройство, проверка, сброс', `<div class="card"><h2>Это устройство</h2><p>${devInfo()}</p></div>${FAM ? '' : `<div class="card form" ><h2>Связь с таблицей родителя</h2><label>Адрес скрипта Google<input id="syncurl" value="${U.esc(S.cfg.sync || '')}" autocomplete="off"></label><p class="hint">В очереди на отправку: ${S.queue.length}.</p><div class="row"><button class="btn small" data-act="savesync">Сохранить и отправить</button></div></div>`}
  <div class="card"><h2>Начать заново</h2><p class="hint">Стирает на этом айпаде весь прогресс, монеты, покупки и коды. После теста нажмите — и приложение будет как новое.</p><button class="btn small stop" data-act="resetall">Сбросить всё на этом устройстве</button></div>` + testCard());
}

/* ===== События ===== */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return; const act = b.dataset.act;
  if (FAM && !cur.kid && ['xtadd', 'saveshop', 'delshop'].includes(act)) { const tk = act === 'xtadd' ? b.dataset.k : cur.parentKid; setTimeout(() => famSnapTouch(tk), 0); }
  const kid = cur.kid; const D = kid && dayRec(kid, cur.ds); const L = D && cur.subj && D.les[cur.subj];
  switch (act) {
    case 'login': askPin(b.dataset.kid, () => { cur.kid = b.dataset.kid; snapCheck(cur.kid); ev(cur.kid, 'вход', {}); const K = S.kids[cur.kid]; if (!K.prizesSet) { cur.prSel = []; cur.prOwn = []; cur.prBack = 'home'; go('prizes'); } else go('home'); }); break;
    case 'parent': askPin('parent', () => go('parent', { kid: null, parentTab: 'home' })); break;
    case 'chpin': { const k0 = kid; askPin(k0, () => { cur.pinSet = { kid: k0 }; go('pin', { pinFor: k0, msg: 'Придумай новый код из 4 цифр' }); }, 'Введи свой старый код'); break; }
    case 'cancelpin': cur.pinSet = null; go(cur.kid ? 'home' : 'login'); break;
    case 'always': { const F = alwaysGet(b.dataset.id); if (!F) break; if (typeof rlReset === 'function') rlReset(F.id); if (F.open) F.open(cur.kid || null); go('always', { aid: F.id }); break; }
    case 'tologin': cur.kid = null; go('login'); break;
    case 'key': pinKey(b.dataset.k); break;
    case 'logout': if (RD && (RD.active || RD.paused)) pauseRead(); RD = null; rememberScroll(); if (RT && RT.active) { RT.active = false; try { RT.rec.stop(); } catch (e) {} RT = null; } cur.kid = null; go('login'); break;
    case 'home': if (RD && (RD.active || RD.paused)) pauseRead(); RD = null; rememberScroll(); go('home'); break;
    case 'piggyearly': { const K0 = S.kids[kid]; if (!(K0.piggy > 0)) break; if (!window.confirm(`Забрать ${K0.piggy} сейчас? Тогда прибавки +10% (${Math.round(K0.piggy * PIGGY_RATE)}) не будет.`)) break; K0.coins += K0.piggy; ev(kid, 'копилка досрочно', { coins: K0.coins, price: K0.piggy, text: 'без процента' }); K0.piggy = 0; save(); render(); break; }
    case 'voice': { const K0 = S.kids[kid]; K0.voice = K0.voice === 'm' ? 'f' : 'm'; save(); render(); say(K0.voice === 'm' ? 'Привет! Теперь задания читаю я.' : 'Привет! Теперь задания читаю я.', 'ru-RU'); break; }
    case 'fineseen': (S.kids[kid].fines || []).forEach(f => { f.seen = true; }); if (S.kids[kid].fines.length > 30) S.kids[kid].fines = S.kids[kid].fines.slice(-30); save(); render(); break;
    case 'piggyseen': S.kids[kid].piggyMsg = ''; save(); render(); break;
    case 'opentrain': { if (restGate(kid, 'train')) break; if (D.les.train) { go('lesson', { subj: 'train' }); break; } if (!trainReady(kid, D)) break; startLesson('train'); break; }
    case 'openpro': { if (restGate(kid, 'pro')) break; if (D.les.pro) { go('lesson', { subj: 'pro' }); break; } if (!proReady(kid, D)) break; startLesson('pro'); break; }
    case 'rtask': { cur.rtask = +b.dataset.i; cur.rtry = null; rememberScroll(); render(); window.scrollTo(0, 0); break; }
    case 'rtryc': retryAnswer(b.dataset.v); break;
    case 'rtryagain': cur.rtry = null; render(); break;
    case 'fixbuy': { const L0 = dayRec(kid, cur.ds).les[cur.subj]; if (!L0 || L0.fixPaid || (S.kids[kid].coins || 0) < FIX_PRICE || !window.confirm(`Работа над ошибками стоит ${FIX_PRICE} баллов. Исправленные ошибки поднимут результат урока. Оплатить?`)) break; fixBuy(kid, cur.subj, L0); render(); break; }
    case 'openextra': { if (restGate(kid, 'extra')) break; if (D.les.extra && D.les.extra.phase === 'done') { go('lesson', { subj: 'extra' }); break; } startLesson('extra'); break; }
    case 'open': { const s0 = b.dataset.subj, L0 = D.les[s0]; if (restGate(kid, s0)) break; if (!TEST && !(L0 && L0.phase === 'done') && s0 !== nextOpen(kid) && !(D.unlock || []).includes(s0)) {
      const K0 = S.kids[kid]; if (K0.coins < SKIP_PRICE) { alertMsg(`Сначала закончи предыдущий урок 🔒 Открыть раньше можно за ${SKIP_PRICE} баллов`); break; }
      if (!window.confirm(`Открыть «${subjName(kid, s0, cur.ds)}» не по порядку за ${SKIP_PRICE} баллов?\nПока не сделаны все уроки дня, за такой урок дают только треть баллов.`)) break;
      K0.coins -= SKIP_PRICE; (D.unlock = D.unlock || []).push(s0); ev(kid, 'урок не по порядку', { subj: subjName(kid, s0, cur.ds), price: -SKIP_PRICE, coins: K0.coins }); save(); }
    startLesson(s0); if (D.les[s0] && (D.unlock || []).includes(s0)) { D.les[s0].oot = true; save(); } break; }
    case 'install': { const ie = window.INSTALL_EV; if (ie) { ie.prompt(); ie.userChoice.then(() => { window.INSTALL_EV = null; render(); }); } break; }
    case 'dripseen': { const R = S.kids[kid].drip; if (R) R.sess = 0; save(); render(); break; }
    case 'restgo': { const K0 = S.kids[kid]; K0.ask = false; K0.blk = 0; ev(kid, 'не устал', { text: 'занимается дальше; за сессию ' + Math.round((K0.sess || 0) / 60) + ' мин' }); save(); render(); break; }
    case 'restpick': { const K0 = S.kids[kid], m = +b.dataset.m; K0.ask = false; K0.blk = 0; K0.restForced = false; K0.restUntil = Date.now() + m * 60000; ev(kid, 'перерыв', { text: 'сам выбрал отдых ' + m + ' мин' }); save(); render(); break; }
    case 'xtadd': { const K0 = S.kids[b.dataset.k], t = U.today(); if (!K0.xt || K0.xt.d !== t) K0.xt = { d: t, m: 0 }; K0.xt.m = Math.max(0, Math.min(180, K0.xt.m + (+b.dataset.m))); if (+b.dataset.m > 0 && K0.restForced && K0.restUntil > Date.now()) { K0.restUntil = 0; K0.restForced = false; K0.sess = Math.max(0, SESS_SECS + extraSecs(K0) - (+b.dataset.m) * 60); K0.blkAt = Date.now(); } ev(b.dataset.k, 'родитель добавил время', { text: (+b.dataset.m > 0 ? '+' : '') + b.dataset.m + ' мин; всего сверху ' + K0.xt.m + ' мин' }); save(); render(); break; }
    case 'norest': { const K0 = S.kids[b.dataset.k]; K0.restUntil = 0; K0.blk = 0; K0.sess = 0; K0.ask = false; save(); render(); break; }
    case 'seen': { const m = S.kids[kid].msgs.find(x => x.id === b.dataset.id); if (m) m.seen = true; save(); render(); break; }
    case 'dunno': { L.helpN = (L.helpN || 0) + 1; if (!b.dataset.more && typeof srDunno === 'function') srDunno(kid, L, false); const u = unitById(kid, cur.subj, L.uid); ev(kid, 'не понимаю', { subj: subjName(kid, cur.subj, cur.ds), unit: u.t, text: L.phase === 'theory' ? 'объяснение темы' : 'задание' }); save(); render(); if (L.phase === 'theory' && L.helpN === 1) say(strip(u.th.replace(/<br>/g, '. ')), 'ru-RU'); break; }
    case 'dunnotask': { L.showTh = L.i; L.helpN = (L.helpN || 0) + 1; if (typeof srDunno === 'function') srDunno(kid, L, true); const t = lessonTasks(L, kid, cur.subj)[L.i], u = (t.uid && t.sj ? unitById(kid, t.sj, t.uid) : unitById(kid, cur.subj, L.uid)) || { t: '' }; ev(kid, 'не понимаю', { subj: subjName(kid, cur.subj, cur.ds), unit: u.t, q: strip(t.q) }); save(); render(); if (!t.sp) say(strip(String(t.q)).replace(/_+/g, ' пропуск '), 'ru-RU'); break; }
    case 'sayqtext': { voiceEv(kid, L, 'задание'); const t = lessonTasks(L, kid, cur.subj)[L.i]; if (t) say(strip(String(t.q)).replace(/_+/g, ' пропуск '), 'ru-RU'); break; }
    case 'sayex': say(b.dataset.t, 'ru-RU'); break;
    case 'saytheory': { voiceEv(kid, L, 'объяснение'); const u = unitById(kid, cur.subj, L.uid); say(strip(u.th.replace(/<br>/g, '. ')), 'ru-RU'); break; }
    case 'topractice': L.phase = 'practice'; save(); render(); break;
    case 'choose': answer(b.dataset.v); break;
    case 'sayq': { voiceEv(kid, L, 'задание (язык)'); const T = lessonTasks(L, kid, cur.subj); const t = T[L.i]; say(t.sp, LCODE(kid, L.tr)); break; }
    case 'next': nextTask(); break;
    case 'fb': { L.fb = L.fb || {}; L.fb[b.dataset.k] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v; const tx = document.getElementById('fbtext'); if (tx) L.fb.text = tx.value; save(); render(); break; }
    case 'sendfb': { const tx = document.getElementById('fbtext'); if (tx) L.fb.text = tx.value.trim(); finishLesson(); break; }
    case 'hwtxt': { const h = S.kids[kid].hwText.find(x => x.id === b.dataset.id); if (h) h.done = b.checked; save(); break; }
    case 'hwdone': L.phase = 'survey'; save(); render(); break;
    case 'sayw': say(b.dataset.w, 'ru-RU'); break;
    case 'toread': L.phase = 'read'; L.lim = wordsLimit(kid); RD = null; save(); render(); break;
    case 'silentdone': { const t = readText(kid), rest = aloudPart(t.text, readLim(kid, L)).rest, need = silentMin(kid, rest), el = (Date.now() - (L.st0 || 0)) / 1000;
      if (el < need) { alertMsg(`Слишком быстро 🙂 Читай внимательно, ещё примерно ${Math.max(1, Math.ceil((need - el) / 60))} мин`); break; }
      L.silentSecs = Math.round(el); ev(kid, 'чтение про себя', { subj: 'Чтение', unit: t.title, words: rest.split(/\s+/).filter(Boolean).length, secs: L.silentSecs });
      L.phase = t.kw ? 'retell' : 'qs'; L.i = 0; save(); render(); break; }
    case 'retellstart': retellStart(); break;
    case 'retellstop': retellStop(); break;
    case 'retellcheck': retellCheck(); break;
    case 'retellmore': { L.rtDraft = (L.rt && L.rt.text) || L.rtDraft || ''; L.rtKeep = L.rt; L.rt = null; save(); render(); break; }
    case 'rtpractice': { const el = document.getElementById('rtxt'); cur.rtDraft = el ? el.value : ''; if (RT) { RT.active = false; try { RT.rec && RT.rec.stop(); } catch (x) {} RT = null; } cur.rtCheck = retellScore(readText(kid), cur.rtDraft); render(); break; }
    case 'rview': { cur.rview = b.dataset.s || null; cur.rtask = null; cur.rtry = null; cur.rtCheck = null; if (RD && RD.active) pauseRead(); render(); window.scrollTo(0, 0); break; }
    case 'retelladult': { const t = readText(kid); L.rt = { n: t.kw.length, hit: [], miss: [], score: .7, adult: true }; ev(kid, 'пересказ', { subj: 'Чтение', unit: t.title, text: 'пересказал(а) взрослому' }); save(); render(); break; }
    case 'toqs': L.phase = 'qs'; L.i = 0; save(); render(); break;
    case 'burnseen': delete S.kids[kid].burnMsg; save(); render(); break;
    case 'startread': startRead('ru-RU'); break;
    case 'stopread': stopRead(); break;
    case 'pauseread': pauseRead(); render(); break;
    case 'rq': readAnswer(b.dataset.v); break;
    case 'paceok': L.paceSeen = 1; L.st0 = Date.now(); save(); render(); window.scrollTo(0, 0); break;
    case 'sayg': { const g = (L.gl || [])[+b.dataset.i]; if (g) say(`${g.w}. ${g.d}`, 'ru-RU'); break; }
    case 'wq': { const qs = wordQs(kid, L), i = L.wi || 0, q = qs[i]; L.wans = L.wans || []; if (!q || L.wans[i]) break; const ok = b.dataset.v === q.a; L.wans[i] = { v: b.dataset.v, ok };
      ev(kid, 'ответ', { subj: 'Чтение', unit: 'Новые слова', q: 'Что значит «' + q.w + '»?', ans: b.dataset.v, right: q.a, ok: ok ? 'верно' : 'ошибка' }); save(); render(); break; }
    case 'wnext': L.wi = (L.wi || 0) + 1; save(); render(); break;
    case 'wdone': { const K = S.kids[kid]; K.vocab = K.vocab || []; (L.gl || []).forEach((g, k) => { if (!K.vocab.some(v => v.w === g.w)) K.vocab.push({ w: g.w, d: g.d, e: g.e, ok: !!(L.wans && L.wans[k] && L.wans[k].ok), ds: cur.ds }); }); L.phase = 'survey'; save(); render(); window.scrollTo(0, 0); break; }
    case 'rnext': { const qs = readQs(kid, L); if ((L.i || 0) + 1 < qs.length) { L.i = (L.i || 0) + 1; } else { L.phase = 'spot'; L.wi = 0; const K = S.kids[kid]; K.texts++; if (!(L.res && L.res.repeat)) { K.pos.read = (K.pos.read || 0) + 1; if (KIDS[kid].rplan) rpDone(kid, readText(kid)); } } save(); render(); break; }
    case 'startfread': if (!(RD && RD.paused)) RD = null; startRead(LCODE(cur.kid, L.tr)); break;
    case 'sayfull': voiceEv(kid, L, 'текст (язык)'); say(curForeign(L).text, LCODE(cur.kid, L.tr)); break;
    case 'fq': foreignAnswer(b.dataset.v); break;
    case 'fnext': { if (L.fi + 1 < L.fq) L.fi++; else { L.phase = 'survey'; const key = L.tr === '_alt' ? 'enRead' : 'ptRead'; S.kids[kid].pos[key] = (S.kids[kid].pos[key] || 0) + 1; } save(); render(); break; }
    case 'shop': go('shop'); break;
    case 'buy': { const it = (S.kids[kid].shop || []).find(x => x.id === b.dataset.id); if (!it || it.price == null || prizeLock(S.kids[kid], it)) break; const k0 = kid; askPin('parent', () => { const K = S.kids[k0]; if (K.coins >= it.price && !prizeLock(K, it)) { K.coins -= it.price; K.purchases.push({ d: cur.ds, name: it.name, price: it.price }); ev(k0, 'награда', { unit: it.name, coins: K.coins, price: it.price }); save(); } cur.kid = k0; go('shop'); }, `Подтвердите: «${it.name}» за ${it.price} монет`); break; }
    case 'resetall': if (window.confirm('Стереть весь прогресс, монеты и коды на этом айпаде?')) { if (kidIds().length) ev(kidIds()[0], 'сброс устройства', {}); flush().finally(() => { try { localStorage.removeItem(KEY); } catch (x) {} location.reload(); }); } break;
    case 'ptab': go('parent', { parentTab: b.dataset.t }); if (b.dataset.t === 'tasks') ptSync(); break;
    case 'pkid': go('parent', { parentKid: b.dataset.k }); break;
    case 'delshop': S.kids[cur.parentKid].shop.splice(+b.dataset.i, 1); save(); render(); break;
    case 'saveshop': { const K = S.kids[cur.parentKid]; K.shop.forEach((it, i) => { const v = parseInt(document.getElementById('sp' + i).value); if (v > 0) { if (it.price !== v) ev(cur.parentKid, 'цена приза', { unit: it.name, price: v }); it.price = v; } }); save(); alertMsg('Цены сохранены'); render(); break; }
    case 'editprizes': { const K = S.kids[kid]; cur.prSel = (K.shop || []).map(x => x.id); cur.prOwn = (K.shop || []).filter(x => x.own).map(x => Object.assign({}, x)); cur.prBack = 'shop'; go('prizes'); break; }
    case 'prtoggle': { const id = b.dataset.id, i = cur.prSel.indexOf(id); if (i >= 0) cur.prSel.splice(i, 1); else cur.prSel.push(id); render(); break; }
    case 'prdone': { const K = S.kids[kid]; if (cur.prSel.length < 3) { alertMsg('Выбери хотя бы 3 приза'); break; }
      const all = prizeIdeas(kid).concat(cur.prOwn), old = K.shop || [];
      K.shop = cur.prSel.map(id => { const o = old.find(x => x.id === id); if (o) return o; const it = all.find(x => x.id === id); return it ? Object.assign({}, it) : null; }).filter(Boolean);
      const fresh = K.shop.filter(x => !old.some(o => o.id === x.id)); K.prizesSet = true;
      ev(kid, 'призы выбраны', { text: K.shop.map(x => x.name + (x.price == null ? ' (нужна цена)' : ` — ${x.price}`)).join('; ') });
      save(); go(cur.prBack || 'home'); break; }
    case 'saveunits': for (const kd of kidIds()) for (const [k, c] of Object.entries(KIDS[kd].cur)) for (const tr of ['', '_alt']) { const el = document.getElementById(`sel_${kd}_${k}${tr}`); if (el) S.kids[kd].pos[k + tr] = +el.value; } save(); alertMsg('Темы сохранены'); break;
    case 'savesync': S.cfg.sync = document.getElementById('syncurl').value.trim(); save(); flush(); pull(); alertMsg('Сохранено'); break;
    default: { if (ppAct(act, b)) break; if (typeof lookAct === 'function' && lookAct(act, b)) break; if (testAct(act, b)) break; if (spotAct(act, b)) break; if (libAct(act, b)) break; if (hwAct(act, b)) break; if (poemAct(act, b)) break; if (FAM && famAct(act, b)) break; if (ptAct(act, b)) break; const F = cur.view === 'always' && alwaysGet(cur.aid); if (F && F.act) F.act(act, b); }
  }
});
function alertMsg(t, ms){ const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), ms || 2200); }
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault(); const k = f.dataset.form;
  const val = id => (document.getElementById(id) || {}).value || '';
  if (FAM && famForm(k, f, val)) return;
  if (ppForm(k, val)) return;
  if (FAM && !cur.kid && k === 'hw') { const tk = cur.parentKid; setTimeout(() => famSnapTouch(tk), 0); }
  if (k === 'ptnew') return ptSubmit();
  if (k === 'setupview') { const p = val('pv'); if (!/^\d{4}$/.test(p)) return alertMsg('Нужно четыре цифры'); S.parentPin = hashPin(p); S.viewer = true; save(); return askPin('parent', () => go('parent', { kid: null, parentTab: 'home' })); }
  if (k === 'setup') { const p = val('pp'), y = val('py'), a = val('pa'); if (![p, y, a].every(x => /^\d{4}$/.test(x))) return alertMsg('Нужно по четыре цифры'); if (new Set([p, y, a]).size < 3) return alertMsg('Коды Юры, Ярика и Ани должны быть разными'); S.parentPin = hashPin(p); S.kids.yarik.pin = hashPin(y); S.kids.anya.pin = hashPin(a); save(); go('login'); }
  { const F = ALWAYS.filter(x => k.indexOf(x.id) === 0)[0]; if (F && F.form) return F.form(k, f); }
  if (k === 'num') answer(val('numin'));
  if (k === 'rtry') retryAnswer(val('rtin'));
  if (k === 'hwf') hwAnswer(val('hwin'));
  if (k === 'prize') { const t = val('prname').trim().slice(0, 60); if (t) { const it = { id: 'o' + Date.now(), name: t, price: null, own: true }; cur.prOwn.push(it); cur.prSel.push(it.id); render(); } }
  if (k === 'pins') { const p = val('np'), y = val('ny'), a = val('na'); { const H = { p: /^\d{4}$/.test(p) ? hashPin(p) : S.parentPin, y: /^\d{4}$/.test(y) ? hashPin(y) : S.kids.yarik.pin, a: /^\d{4}$/.test(a) ? hashPin(a) : S.kids.anya.pin }; if (new Set([H.p, H.y, H.a]).size < 3) return alertMsg('Коды Юры, Ярика и Ани должны быть разными'); } if (/^\d{4}$/.test(p)) S.parentPin = hashPin(p); if (/^\d{4}$/.test(y)) S.kids.yarik.pin = hashPin(y); if (/^\d{4}$/.test(a)) S.kids.anya.pin = hashPin(a); save(); alertMsg('Коды обновлены'); render(); }
  if (k === 'hw') { const t = val('hwtext').trim(); if (t) { S.kids[cur.parentKid].hwText.push({ id: 'h' + Date.now(), text: t, done: false }); save(); alertMsg('Задание добавлено'); render(); } }
  if (k === 'coins') { const n = parseInt(String(val('coinadd')).replace('−', '-')); if (n) ppCoinAdd(cur.parentKid, n); }
});
window.addEventListener('online', () => { flush(); pull(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { pull(); flush(); if (cur.ds !== U.today() && cur.view === 'home') render(); } });
if ('speechSynthesis' in window) try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => {}; } catch (e) {}
render(); pull(); flush(); setInterval(() => { pull(); flush(); }, 5 * 60 * 1000);
