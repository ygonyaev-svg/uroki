/* ===== Настройка детей ===== */
CUR_Y.lang = { name:'Языки', src:'Português A1 и English', units: PT_Y, alt: EN_UNITS, altName:'English' };
delete CUR_Y.pt;
const KIDS = {
  yarik: { name:'Ярик', grade:'2 класс', cur: CUR_Y, read: READ_Y, n: 5, norm: 55, startWords: 60, order:['read','math','rus','world','logic','lang'] },
  anya:  { name:'Аня',  grade:'5 класс', cur: CUR_A, read: READ_A, n: 6, norm: 110, startWords: 150, order:['read','math','rus','hist','logic','lang'] }
};
const SUBJ_ICON = { read:'Аа', math:'7+5', rus:'Ёё', world:'☼', hist:'XV', logic:'?!', lang:'Pt', hw:'ДЗ' };
const STEPS = [1, 3, 7];

/* ===== Хранилище ===== */
const KEY = 'uroki.v1';
let S;
function newKid(){ return { pin:null, coins:0, pos:{}, lvl:{}, stats:{}, days:{}, reading:[], hard:{}, srs:[], purchases:[], words:0, texts:0, applied:[], msgs:[], hwText:[] }; }
function defShop(){ return [
  { id:'s1', name:'15 минут игры на планшете', price:15 },
  { id:'s2', name:'30 минут мультиков', price:30 },
  { id:'g60', name:'🎮 Час игры', price:60 },
  { id:'s3', name:'Сладость на выбор', price:30 },
  { id:'s4', name:'Выбрать ужин для всей семьи', price:80 },
  { id:'s5', name:'Поход в кафе с папой', price:200 },
  { id:'s6', name:'Подарок до 10 €', price:400 } ].concat(THEME_SHOP.map(x => Object.assign({}, x))); }
function load(){ try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return s; } catch (e) {} return { v:1, parentPin:null, kids:{ yarik:newKid(), anya:newKid() }, shop:defShop(), cfg:{ sync:'' }, queue:[], log:[] }; }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
const SYNC_URL = 'https://script.google.com/macros/s/AKfycbzlcMocKjYfldhFSe25-6w9_HVEN0sXMmlJrbj1VWuqMhHvQo5Fs-M0J7zZW2sDYEM3sw/exec';
S = load();
if (!S.cfg.sync) S.cfg.sync = SYNC_URL;
if (!S.shopV2) { const fix = { s1: ['15 минут игры', 15], s2: ['30 минут мультиков', 30], t3: ['🎮 30 минут любимой игры', 30] }; for (const it of S.shop) if (fix[it.id]) { it.name = fix[it.id][0]; it.price = fix[it.id][1]; } if (!S.shop.some(x => x.id === 'g60')) S.shop.splice(2, 0, { id: 'g60', name: '🎮 Час игры', price: 60 }); S.shopV2 = true; }
if (!S.themeShop) { for (const x of THEME_SHOP) if (!S.shop.some(y => y.id === x.id)) S.shop.push(Object.assign({}, x)); S.themeShop = true; }
const hashPin = p => String(U.h('uroki:' + p));

/* ===== Синхронизация с Google Таблицей родителя ===== */
function strip(h){ return String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function ev(kid, type, data){ const e = Object.assign({ t: new Date().toISOString(), kid: KIDS[kid].name, type }, data); S.queue.push(e); S.log.push(e); if (S.log.length > 1500) S.log = S.log.slice(-1500); save(); flushSoon(); }
let flushT = null;
function flushSoon(){ clearTimeout(flushT); flushT = setTimeout(flush, 4000); }
async function flush(){
  if (!S.cfg.sync || !S.queue.length || !navigator.onLine) return;
  const batch = S.queue.slice(0, 200);
  try { await fetch(S.cfg.sync, { method:'POST', mode:'no-cors', headers:{ 'Content-Type':'text/plain' }, body: JSON.stringify({ events: batch }) }); S.queue = S.queue.slice(batch.length); save(); if (S.queue.length) flushSoon(); } catch (e) {}
}
async function pull(){
  if (!S.cfg.sync || !navigator.onLine) return;
  try { const r = await fetch(S.cfg.sync + (S.cfg.sync.includes('?') ? '&' : '?') + 'action=cfg'); const j = await r.json(); applyCfg(j.rows || []); } catch (e) {}
}
function findUnit(kid, subj, val){
  const c = KIDS[kid].cur[subj]; if (!c || !c.units) return null; const v = String(val).toLowerCase().trim();
  for (const [track, list] of [['', c.units], ['_alt', c.alt || []]]) { const i = list.findIndex(u => u.id.toLowerCase() === v || u.t.toLowerCase().includes(v)); if (i >= 0) return { key: subj + track, i }; }
  return null;
}
function subjByName(kid, name){ const n = String(name || '').toLowerCase(); for (const [k, c] of Object.entries(KIDS[kid].cur)) if (k === n || c.name.toLowerCase().startsWith(n) || (c.altName && c.altName.toLowerCase().startsWith(n))) return k; return null; }
function applyCfg(rows){
  for (const row of rows) {
    const kid = /ан/i.test(row.kid) ? 'anya' : /яр/i.test(row.kid) ? 'yarik' : null; if (!kid || !row.id) continue;
    const K = S.kids[kid]; if (K.applied.includes(row.id)) continue;
    const type = String(row.type || '').toLowerCase();
    if (type.startsWith('тем')) { const s = subjByName(kid, row.subj); const f = s && findUnit(kid, s, row.value); if (f) K.pos[f.key] = f.i; }
    else if (type.startsWith('дз')) K.hwText.push({ id: row.id, text: String(row.value), done: false });
    else if (type.startsWith('сооб')) K.msgs.push({ id: row.id, text: String(row.value), seen: false });
    else if (type.startsWith('монет')) K.coins += Number(row.value) || 0;
    else if (type.startsWith('чтен')) { const n = Number(row.value); if (n > 0) K.readWords = n; }
    K.applied.push(row.id);
  }
  save(); if (cur.kid) render();
}

/* ===== Помощники по программе ===== */
function track(subj, ds){ const c = cur.K().cur[subj]; return c && c.alt && (U.dayNum(ds) % 2 === 1) ? '_alt' : ''; }
function unitsOf(kid, subj, tr){ const c = KIDS[kid].cur[subj]; return tr === '_alt' ? c.alt : c.units; }
function unitAt(kid, subj, tr){ const list = unitsOf(kid, subj, tr); const K = S.kids[kid]; let i = K.pos[subj + tr] || 0;
  if (i >= list.length) { /* программа пройдена — повторяем самые слабые темы */ const w = list.map((u, j) => [j, acc(K, u.id)]).sort((a, b) => a[1] - b[1]); i = w[0][0]; }
  return { u: list[i], i, total: list.length }; }
function acc(K, uid){ const s = K.stats[uid]; return s && s.n ? s.ok / s.n : 1; }
function genTasks(unit, seed, n){ const r = U.rng(seed); const out = []; const seen = new Set(); let guard = 0;
  while (out.length < n && guard++ < n * 12) { const t = unit.g(r); if (seen.has(t.q)) continue; seen.add(t.q); if (t.k === 'c') t.opts = r.shuffle([t.a, ...t.w]); out.push(t); }
  return out; }
function grade(x){ return x >= .9 ? 5 : x >= .75 ? 4 : x >= .5 ? 3 : 2; }
function dayRec(kid, ds){ const K = S.kids[kid]; if (!K.days[ds]) K.days[ds] = { les:{}, bonus:false }; return K.days[ds]; }
function nTasks(kid, subj){ return Math.max(3, KIDS[kid].n + (S.kids[kid].lvl[subj] || 0) + (S.kids[kid].extraN || 0)); }

/* ===== Озвучка и распознавание речи ===== */
function say(text, lang){ try { const s = window.speechSynthesis; if (!s) return; s.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lang || 'ru-RU'; const vs = s.getVoices(); const v = vs.find(v => v.lang === u.lang) || vs.find(v => v.lang && v.lang.startsWith(u.lang.slice(0, 2))); if (v) u.voice = v; u.rate = lang && lang.startsWith('ru') ? .9 : .85; s.speak(u); } catch (e) {} }
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const normW = w => w.toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]/gu, '');
function lev(a, b){ const m = a.length, n = b.length; if (!m) return n; if (!n) return m; let p = Array.from({ length: n + 1 }, (_, j) => j); for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; }
function sim(a, b){ if (a === b) return true; if (Math.abs(a.length - b.length) > 2) return false; const d = lev(a, b); return d <= (b.length >= 7 ? 2 : b.length >= 4 ? 1 : 0); }
function align(T, spoken){ const st = new Array(T.length).fill(0); let p = 0, extra = 0;
  for (const s of spoken) { if (!s) continue; let f = -1; for (let j = p; j < Math.min(T.length, p + 5); j++) if (T[j] && sim(s, T[j])) { f = j; break; }
    if (f < 0) { extra++; continue; } for (let k = p; k < f; k++) st[k] = T[k].length <= 2 ? 1 : 2; st[f] = 1; p = f + 1; }
  return { st, p, extra }; }

/* ===== Состояние экрана ===== */
const cur = { kid:null, view:'login', subj:null, ds:U.today(), K(){ return KIDS[this.kid]; }, pinFor:null, onPin:null, parentTab:'report', parentKid:'yarik', msg:'' };
const app = () => document.getElementById('app');
function go(view, extra){ Object.assign(cur, { view }, extra || {}); render(); window.scrollTo(0, 0); }
function coinsHtml(n){ return `<span class="coin" aria-hidden="true"></span><b>${n}</b>`; }

/* ===== Экраны ===== */
function render(){
  if (S.parentPin) for (const k of ['yarik', 'anya']) burnCheck(k);
  cur.ds = cur.kid ? lessonDay(cur.kid) : U.today();
  const v = !S.parentPin ? vSetup() : cur.view === 'pin' ? vPin() : cur.view === 'home' ? vHome() : cur.view === 'lesson' ? vLesson() : cur.view === 'shop' ? vShop() : cur.view === 'parent' ? vParent() : vLogin();
  app().innerHTML = v; afterRender();
}
function afterRender(){ const f = app().querySelector('[autofocus]'); if (f) try { f.focus(); } catch (e) {} }

function vSetup(){
  return `<main class="wrap narrow"><header class="hero"><p class="eyebrow">Первый запуск</p><h1>Уроки для Ярика и Ани</h1><p>Придумайте четыре цифры для родителя и для каждого ребёнка. Код родителя нужен, чтобы выдавать награды и смотреть отчёты.</p></header>
  <form class="card form" data-form="setup">
   <label>Код родителя<input id="pp" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required autocomplete="off"></label>
   <label>Код Ярика<input id="py" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required autocomplete="off"></label>
   <label>Код Ани<input id="pa" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required autocomplete="off"></label>
   <button class="btn big">Сохранить</button></form></main>`;
}
function vLogin(){
  const card = k => { const K = S.kids[k], d = KIDS[k]; return `<button class="kidcard ${k}" data-act="login" data-kid="${k}"><span class="avatar">${d.name[0]}</span><span class="kb">${THEME[k].banner.slice(0, 4).join(' ')}</span><span class="kn">${d.name}</span><span class="kg">${d.grade}</span><span class="kc">${coinsHtml(K.coins)}</span></button>`; };
  return `<main class="wrap"><header class="hero"><p class="eyebrow">${fmtDate(cur.ds)}</p><h1>Кто сегодня учится?</h1></header>
  <div class="kids">${card('yarik')}${card('anya')}</div>
  <p class="center"><button class="link" data-act="parent">Для родителей</button></p></main>`;
}
function vPin(){
  const who = cur.pinFor === 'parent' ? 'Код родителя' : 'Код: ' + KIDS[cur.pinFor].name;
  return `<main class="wrap narrow"><header class="hero"><h1>${who}</h1><p>${U.esc(cur.msg || 'Введи четыре цифры')}</p></header>
  <div class="pinbox"><div class="dots" id="dots">${'<i></i>'.repeat(4)}</div>
  <div class="pad">${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(x => x === '' ? '<span></span>' : `<button class="key" data-act="key" data-k="${x}">${x}</button>`).join('')}</div>
  <button class="link" data-act="cancelpin">Назад</button></div></main>`;
}
let pinBuf = '';
function pinKey(k){
  if (k === '⌫') pinBuf = pinBuf.slice(0, -1); else if (pinBuf.length < 4) pinBuf += k;
  const dots = document.querySelectorAll('#dots i'); dots.forEach((d, i) => d.classList.toggle('on', i < pinBuf.length));
  if (pinBuf.length === 4) { const ok = cur.pinFor === 'parent' ? hashPin(pinBuf) === S.parentPin : hashPin(pinBuf) === S.kids[cur.pinFor].pin || hashPin(pinBuf) === S.parentPin; const cb = cur.onPin; pinBuf = '';
    if (ok) { cur.msg = ''; cb(); } else { cur.msg = 'Неверный код, попробуй ещё раз'; setTimeout(render, 150); } }
}
function askPin(forWho, cb, msg){ pinBuf = ''; go('pin', { pinFor: forWho, onPin: cb, msg: msg || '', back: cur.view }); }

function fmtDate(ds){ const [y, m, d] = ds.split('-').map(Number); const dt = new Date(y, m - 1, d); return ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'][dt.getDay()] + ', ' + d + ' ' + ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'][m - 1]; }

function lessonTitle(kid, subj, ds){
  if (subj === 'read') { const t = readText(kid); return t.title; }
  if (subj === 'hw') return 'Повторение ошибок';
  const tr = track(subj, ds); return unitAt(kid, subj, tr).u.t;
}
function subjName(kid, subj, ds){ if (subj === 'hw') return 'Домашнее задание'; const c = KIDS[kid].cur[subj]; return track(subj, ds) === '_alt' ? c.altName : c.name; }
function hwDue(kid){ const K = S.kids[kid]; return K.srs.filter(x => x.due <= cur.ds); }
function todaySubjects(kid){ const list = KIDS[kid].order.slice(); const D = dayRec(kid, cur.ds); if (hwDue(kid).length || S.kids[kid].hwText.some(h => !h.done) || D.les.hw) list.push('hw'); return list; }

/* Учебный день: пока не закончены все уроки начатого дня, новый день не открывается */
function dayDone(kid, ds){ const keep = cur.ds; cur.ds = ds; const D = S.kids[kid].days[ds]; const ok = !!D && todaySubjects(kid).every(s => D.les[s] && D.les[s].phase === 'done'); cur.ds = keep; return ok; }
function lessonDay(kid){ const K = S.kids[kid], t = U.today(); if (K.openDay && K.openDay < t && !dayDone(kid, K.openDay)) return K.openDay; return t; }
function nextOpen(kid){ const D = dayRec(kid, cur.ds); return todaySubjects(kid).find(s => !(D.les[s] && D.les[s].phase === 'done')); }
function vHome(){
  const kid = cur.kid, K = S.kids[kid], D = dayRec(kid, cur.ds), subs = todaySubjects(kid);
  const done = subs.filter(s => D.les[s] && D.les[s].phase === 'done').length;
  const streak = readStreak(kid);
  const msgs = K.msgs.filter(m => !m.seen);
  const tiles = subs.map(s => { const L = D.les[s]; const st = L && L.phase === 'done' ? 'done' : L ? 'go' : 'new'; const g = L && L.grade;
    const locked = st !== 'done' && s !== nextOpen(kid);
    return `<button class="tile ${st} ${s === 'read' ? 'main' : ''} ${locked ? 'locked' : ''}" data-act="open" data-subj="${s}" ${locked ? 'aria-disabled="true"' : ''}><span class="ico">${s === 'lang' && track('lang', cur.ds) === '_alt' ? 'En' : SUBJ_ICON[s]}</span><span class="tt"><span class="sn">${subjName(kid, s, cur.ds)}${s === 'read' && kid === 'yarik' ? ' <em>главное</em>' : ''}</span><span class="ut">${U.esc(lessonTitle(kid, s, cur.ds))}</span></span>${g ? `<span class="mark m${g}">${g}</span>` : st === 'go' ? '<span class="state">начат</span>' : ''}</button>`; }).join('');
  return `<main class="wrap ${kid}"><header class="bar"><button class="link" data-act="logout">Выйти</button><span class="coins">${coinsHtml(K.coins)}</span></header>
  <div class="banner" aria-hidden="true">${THEME[kid].banner.map((e, i) => `<span style="animation-delay:${i * .3}s">${e}</span>`).join('')}</div><section class="hello"><p class="eyebrow">${THEME[kid].hello}</p><h1>Привет, ${KIDS[kid].name}!</h1><p>${fmtDate(cur.ds)} · сделано ${done} из ${subs.length}</p>${cur.ds !== U.today() ? `<div class="note">Сначала закончи уроки за ${fmtDate(cur.ds)}. Новые откроются потом.</div>` : ''}${K.burnMsg ? `<div class="note">🔥 ${U.esc(K.burnMsg)} <button class="link" data-act="burnseen">Понятно</button></div>` : ''}${burnWarn(kid)}<p class="hint">Уроки идут по порядку: следующий откроется, когда закончишь предыдущий. 1 балл = 1 минута игры, за день можно заработать до 60.</p>
   <div class="prog"><i style="width:${Math.round(done / subs.length * 100)}%"></i></div></section>
  ${msgs.map(m => `<div class="note">✉ ${U.esc(m.text)} <button class="link" data-act="seen" data-id="${m.id}">Прочитал(а)</button></div>`).join('')}
  <section class="tiles">${tiles}</section>
  ${done === subs.length ? `<div class="card win"><h2>Все уроки на сегодня сделаны!</h2><p>Завтра будут новые. ${D.bonus ? 'Бонус +10 уже получен.' : ''}</p></div>` : ''}
  <section class="shelf card"><h2>Моя книжная полка</h2><p>Прочитано текстов: <b>${K.texts}</b> · слов вслух: <b>${K.words}</b>${streak > 1 ? ` · читаю ${streak} ${U.pl(streak,'день','дня','дней')} подряд` : ''}</p>${lastReading(kid)}</section>
  <p class="center"><button class="btn ghost" data-act="shop">Магазин наград</button></p></main>`;
}
function lastReading(kid){ const R = S.kids[kid].reading.filter(x => x.lang === 'ru').slice(-5); if (!R.length) return ''; return '<div class="speeds">' + R.map(x => `<span title="${U.esc(x.title)}"><b>${x.wpm}</b> сл/мин</span>`).join('') + `</div><p class="hint">Цель к концу года: ${KIDS[kid].norm} слов в минуту.</p>`; }
function readStreak(kid){ const K = S.kids[kid]; let n = 0, d = cur.ds; if (!(K.days[d] && K.days[d].les.read && K.days[d].les.read.phase === 'done')) d = U.addDays(d, -1); while (K.days[d] && K.days[d].les.read && K.days[d].les.read.phase === 'done') { n++; d = U.addDays(d, -1); } return n; }

/* ----- Урок ----- */
function readText(kid){ const K = S.kids[kid], list = KIDS[kid].read; const D = K.days[cur.ds]; if (D && D.les.read && D.les.read.tid) return list.find(t => t.id === D.les.read.tid) || list[0]; return list[(K.pos.read || 0) % list.length]; }
function startLesson(subj){
  const kid = cur.kid, D = dayRec(kid, cur.ds);
  if (!D.les[subj]) {
    if (subj === 'read') { const t = readText(kid); D.les.read = { tid: t.id, phase: 'warm', ans: [], seed: U.h(kid + cur.ds + 'read') }; }
    else if (subj === 'hw') { const due = hwDue(kid).slice(0, 8); D.les.hw = { items: due.map(x => x.task), keys: due.map(x => x.key), phase: 'practice', i: 0, ans: [], txt: S.kids[kid].hwText.filter(h => !h.done).map(h => h.id) }; }
    else { const tr = track(subj, cur.ds), { u } = unitAt(kid, subj, tr); D.les[subj] = { uid: u.id, tr, seed: U.h(kid + cur.ds + subj), phase: 'theory', i: 0, ans: [], n: nTasks(kid, subj) }; }
    D.les[subj].t0 = Date.now();
    S.kids[kid].openDay = cur.ds; save(); ev(kid, 'урок начат', { subj: subjName(kid, subj, cur.ds), unit: lessonTitle(kid, subj, cur.ds) });
  }
  go('lesson', { subj });
}
function unitById(kid, subj, uid){ const c = KIDS[kid].cur[subj]; return (c.units || []).concat(c.alt || []).find(u => u.id === uid); }
function lessonTasks(L, kid, subj){ if (subj === 'hw') return L.items; if (!L._t) { const u = unitById(kid, subj, L.uid); Object.defineProperty(L, '_t', { value: genTasks(u, L.seed, L.n), enumerable: false }); } return L._t; }

function vLesson(){
  const kid = cur.kid, subj = cur.subj, D = dayRec(kid, cur.ds), L = D.les[subj];
  const head = `<header class="bar"><button class="link" data-act="home">← К урокам</button><span class="coins">${coinsHtml(S.kids[kid].coins)}</span></header>`;
  if (subj === 'read') return `<main class="wrap ${kid}">${head}${vRead(kid, L)}</main>`;
  let body = '';
  const u = subj !== 'hw' && unitById(kid, subj, L.uid);
  const steps = subj === 'hw' ? ['Задания'] : subj === 'lang' ? ['Теория', 'Практика', 'Чтение', 'Отзыв'] : ['Теория', 'Практика', 'Отзыв'];
  const stepIdx = { theory:0, practice:1, fread:2, survey: steps.length - 1, done: steps.length - 1 }[L.phase] || 0;
  const stepper = `<ol class="steps">${steps.map((s, i) => `<li class="${i < stepIdx ? 'ok' : i === stepIdx ? 'now' : ''}">${s}</li>`).join('')}</ol>`;
  const title = `<p class="eyebrow">${subjName(kid, subj, cur.ds)}</p><h1>${U.esc(subj === 'hw' ? 'Повторение ошибок' : u.t)}</h1>`;
  if (L.phase === 'theory') {
    const c = KIDS[kid].cur[subj];
    body = `<article class="card theory"><div class="th">${u.th}</div><div class="row"><button class="btn ghost small" data-act="saytheory">🔊 Прочитать вслух</button>${subj !== 'hw' ? '<button class="btn ghost small" data-act="dunno">🤔 Не понимаю</button>' : ''}</div></article>${L.helpN ? vExample(kid, subj, L, u) : ''}
    <p class="src">По учебнику: ${U.esc(c.src)}</p><button class="btn big" data-act="topractice">Понятно, к заданиям</button>`;
  } else if (L.phase === 'practice') body = vTask(kid, subj, L);
  else if (L.phase === 'fread') body = vForeign(kid, L);
  else if (L.phase === 'survey') body = vSurvey(L);
  else body = vResult(kid, subj, L);
  if (subj === 'hw' && L.phase === 'practice' && !L.items.length) body = vHwText(kid, L);
  return `<main class="wrap ${kid}">${head}<section class="lesson">${title}${stepper}${body}</section></main>`;
}
function vTask(kid, subj, L){
  const T = lessonTasks(L, kid, subj); if (!T.length) return vHwText(kid, L);
  const t = T[L.i], a = L.ans[L.i] || { tries: 0 }; const fin = a.final;
  const lang = subj === 'lang' ? (L.tr === '_alt' ? 'en-GB' : 'pt-PT') : 'ru-RU';
  let inp;
  if (t.k === 'c') inp = `<div class="opts">${t.opts.map(o => { const cls = fin && o === t.a ? 'right' : (a.wrong || []).includes(o) ? 'wrong' : ''; return `<button class="opt ${cls}" data-act="choose" data-v="${U.esc(o)}" ${fin || (a.wrong || []).includes(o) ? 'disabled' : ''}>${o}</button>`; }).join('')}</div>`;
  else inp = `<form class="numf" data-form="num"><input id="numin" inputmode="decimal" autocomplete="off" ${fin ? 'disabled' : 'autofocus'} value="${fin ? U.esc(a.v) : ''}" aria-label="Ответ"><button class="btn" ${fin ? 'disabled' : ''}>Проверить</button></form>`;
  let fb = '';
  if (fin) fb = a.ok ? `<div class="fb ok"><b>${a.tries === 1 ? U.rng(L.seed + L.i).pick(THEME[kid].win) : 'Верно!'}</b> ${t.e ? U.esc(strip(t.e)) : ''}</div>` : `<div class="fb bad"><b>Правильный ответ: ${t.k === 'n' ? U.dec(t.a) : t.a}</b> ${t.e ? U.esc(strip(t.e)) : ''}<br><span class="hint">Это задание вернётся в домашнем задании.</span></div>`;
  else if (a.tries) fb = `<div class="fb try">Не совсем. Подумай ещё раз.</div>`;
  const spk = t.sp ? `<button class="btn ghost small" data-act="sayq">🔊 Послушать</button>` : '';
  const u0 = subj !== 'hw' && unitById(kid, subj, L.uid);
  const help = u0 && !fin ? (L.showTh === L.i ? `<details class="peek" open><summary>Правило</summary><div class="th">${u0.th}</div></details>${vExample(kid, subj, L, u0)}` : `<button class="link" data-act="dunnotask">🤔 Не понимаю</button>`) : '';
  return `<div class="counter">Задание ${L.i + 1} из ${T.length}</div><article class="card task"><span class="sticker" aria-hidden="true">${U.rng((L.seed || 7) + L.i * 31).pick(THEME[kid].pics)}</span><div class="q">${t.q.replace(/_+/g, '<span class="gap">?</span>')}</div>${t.sp && !t.spAfter ? spk : ''}${inp}${fb}${t.sp && t.spAfter && fin ? spk : ''}${help}</article>
  ${fin ? `<button class="btn big" data-act="next">${L.i + 1 < T.length ? 'Дальше' : 'Закончить'}</button>` : ''}`;
}
/* Разбор на похожем примере: задание того же типа с ответом и объяснением */
function vExample(kid, subj, L, u){ const n = L.helpN || 1; const ex = genTasks(u, (L.seed || 1) * 7 + n * 101, 1)[0]; if (!ex) return '';
  const ans = ex.k === 'n' ? U.dec(ex.a) : ex.a;
  return `<article class="card example"><h3>Разберём на похожем примере</h3><div class="q">${ex.q.replace(/_+/g, '<span class="gap">?</span>')}</div><p><b>Ответ: ${ans}</b></p>${ex.e ? `<p>${U.esc(strip(ex.e))}</p>` : ''}<div class="row"><button class="btn ghost small" data-act="sayex" data-t="${U.esc(strip(ex.q.replace(/_+/g, ' пропуск ')) + '. Ответ: ' + strip(String(ans)) + '. ' + (ex.e ? strip(ex.e) : ''))}">🔊 Послушать</button><button class="link" data-act="dunno">Ещё пример</button></div><p class="hint">Я написал папе, что эта тема трудная — он поможет.</p></article>`; }
function vHwText(kid, L){ const K = S.kids[kid]; const items = K.hwText.filter(h => (L.txt || []).includes(h.id));
  return `<article class="card"><h2>Задание от папы</h2>${items.length ? items.map(h => `<label class="check"><input type="checkbox" data-act="hwtxt" data-id="${h.id}" ${h.done ? 'checked' : ''}> ${U.esc(h.text)}</label>`).join('') : '<p>Сегодня отдельных заданий нет.</p>'}</article><button class="btn big" data-act="hwdone">Готово</button>`; }
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
  const msg = L.passed === true ? 'Тема пройдена! Завтра — следующая.' : L.passed === false ? 'Завтра повторим эту тему с новыми заданиями.' : '';
  return `<article class="card result">${L.grade >= 4 ? `<div class="cheer">${U.rng(L.seed || 3).pick(THEME[kid].win)}</div>` : ''}<div class="bigmark m${L.grade}">${L.grade}</div><p>Правильно с первого раза: <b>${L.score} из ${L.total}</b></p><p>${msg}</p><p class="earn">Заработано минут игры: ${coinsHtml(L.coins || 0)}</p>${L.perfect ? '<p class="earn">🌟 Безупречный день: +10 минут!</p>' : L.q != null && L.q < .6 ? '<p class="hint">Слишком много ошибок — за этот урок минут нет. Будь внимательнее!</p>' : ''}</article><button class="btn big" data-act="home">К урокам</button>`;
}

/* ----- Ответы ----- */
function answer(v){
  const kid = cur.kid, subj = cur.subj, L = dayRec(kid, cur.ds).les[subj], T = lessonTasks(L, kid, subj), t = T[L.i];
  const a = L.ans[L.i] || (L.ans[L.i] = { tries: 0, wrong: [] }); if (a.final) return;
  let ok;
  if (t.k === 'n') { const x = Number(String(v).replace(',', '.').replace(/\s/g, '')); if (String(v).trim() === '' || isNaN(x)) return; ok = Math.abs(x - t.a) < 1e-6; }
  else ok = v === t.a;
  a.tries++; a.v = v;
  if (!ok && t.k === 'c') a.wrong.push(v);
  const lastTry = t.k === 'c' && t.opts.length - a.wrong.length <= 1;
  if (ok || a.tries >= 2 || lastTry) { a.final = true; a.ok = ok;
    const K = S.kids[kid];
    const uid = subj === 'hw' ? (t.uid || 'hw') : L.uid;
    t.uid = uid;
    if (subj !== 'hw') { const s = K.stats[uid] || (K.stats[uid] = { n: 0, ok: 0 }); s.n++; if (ok && a.tries === 1) s.ok++; }
    if (!(ok && a.tries === 1)) addSrs(kid, subj, t);
    if (subj === 'hw') updSrs(kid, L.keys[L.i], ok && a.tries === 1);
    ev(kid, 'ответ', { subj: subjName(kid, subj, cur.ds), unit: subj === 'hw' ? 'повторение' : unitById(kid, subj, L.uid).t, q: strip(t.q), ans: String(v), right: t.k === 'n' ? U.dec(t.a) : t.a, ok: ok && a.tries === 1 ? 'верно' : ok ? 'со 2-й попытки' : 'ошибка' });
  }
  save(); render();
}
function addSrs(kid, subj, t){ const K = S.kids[kid]; const key = U.h(t.q + t.a) + ''; if (K.srs.some(x => x.key === key)) return; const copy = JSON.parse(JSON.stringify(t)); K.srs.push({ key, task: copy, step: 0, due: U.addDays(cur.ds, 1) }); }
function updSrs(kid, key, ok){ const K = S.kids[kid]; const x = K.srs.find(z => z.key === key); if (!x) return; if (ok) { x.step++; if (x.step >= STEPS.length) K.srs = K.srs.filter(z => z !== x); else x.due = U.addDays(cur.ds, STEPS[x.step]); } else { x.step = 0; x.due = U.addDays(cur.ds, 1); } }
function nextTask(){
  const kid = cur.kid, subj = cur.subj, L = dayRec(kid, cur.ds).les[subj], T = lessonTasks(L, kid, subj);
  if (L.i + 1 < T.length) { L.i++; save(); render(); return; }
  if (subj === 'hw' && S.kids[kid].hwText.some(h => !h.done && (L.txt || []).includes(h.id))) { L.items = []; save(); render(); return; }
  if (subj === 'lang') { L.phase = 'fread'; startForeign(kid, L); save(); render(); return; }
  L.phase = 'survey'; save(); render();
}
function finishLesson(){
  const kid = cur.kid, subj = cur.subj, K = S.kids[kid], D = dayRec(kid, cur.ds), L = D.les[subj];
  const T = subj === 'read' ? [] : lessonTasks(L, kid, subj);
  const ans = subj === 'read' ? L.ans : L.ans; const total = subj === 'read' ? (readText(kid).qs.length) : T.length;
  const first = ans.filter(a => a && a.ok && a.tries === 1).length + (L.fans ? L.fans.filter(a => a && a.ok && a.tries === 1).length : 0);
  const tot = total + (L.fans ? L.fq : 0);
  const ratio = tot ? first / tot : 1; L.score = first; L.total = tot; L.grade = grade(ratio);
  const q = lessonQuality(kid, subj, L, ratio); L.q = q;
  if (subj !== 'read' && subj !== 'hw') {
    const key = subj + L.tr; L.passed = ratio >= .8;
    if (L.passed) K.pos[key] = (K.pos[key] || 0) + 1;
    const f = L.fb || {}; const lv = K.lvl[subj] || 0;
    if (f.diff === 'легко' && ratio === 1) K.lvl[subj] = Math.min(lv + 1, 3); else if (f.diff === 'трудно' && ratio < .75) K.lvl[subj] = Math.max(lv - 1, -1);
  }
  if (subj === 'hw') K.hwText.forEach(h => { if ((L.txt || []).includes(h.id)) h.done = true; });
  L.secs = Math.min(1500, Math.round((Date.now() - (L.t0 || Date.now())) / 1000)); D.secs = (D.secs || 0) + L.secs;
  const subs = todaySubjects(kid), M = Math.floor(LESSON_POOL / Math.max(5, subs.length));
  let pts = q < .6 ? 0 : Math.round(M * q * q); D.pts = D.pts || 0; pts = Math.max(0, Math.min(pts, LESSON_POOL - D.pts)); D.pts += pts;
  K.coins += pts; L.coins = pts; L.phase = 'done';
  if (!D.bonus && subs.every(s => D.les[s] && D.les[s].phase === 'done')) { D.bonus = true; K.lastDone = U.today(); K.burnBase = 0;
    if (subs.every(s => (D.les[s].q || 0) >= .9)) { const b = Math.max(0, DAY_MAX - D.pts); D.pts += b; K.coins += b; L.coins += b; L.perfect = true; }
    const mins = Math.round(D.secs / 60); K.extraN = K.extraN || 0; if (mins < 40) K.extraN = Math.min(3, K.extraN + 1); else if (mins > 65) K.extraN = Math.max(-2, K.extraN - 1);
    ev(kid, 'день завершён', { coins: K.coins, score: D.pts + ' мин игры заработано', secs: D.secs, text: `занимался ${mins} мин` }); }
  ev(kid, 'урок завершён', { subj: subjName(kid, subj, cur.ds), unit: lessonTitle(kid, subj, cur.ds), score: `${first}/${tot}`, grade: L.grade, passed: L.passed === undefined ? '' : L.passed ? 'тема пройдена' : 'повтор', mood: (L.fb || {}).mood, diff: (L.fb || {}).diff, like: (L.fb || {}).like, text: (L.fb || {}).text, coins: K.coins });
  save(); render();
}

/* ----- Баллы: 1 балл = 1 минута игры. За день максимум 60: 50 за уроки по качеству + 10 за безупречный день ----- */
const DAY_MAX = 60, DAY_BONUS = 10, LESSON_POOL = DAY_MAX - DAY_BONUS;
function lessonQuality(kid, subj, L, ratio){
  if (subj === 'hw' && !(L.items && L.items.length) && !(L.ans && L.ans.length)) return .9;
  if (subj !== 'read') return ratio;
  const r = L.res || {}, norm = KIDS[kid].norm * .8 * progressFactor(kid);
  const acc = r.acc == null ? .8 : r.acc;
  const pace = !r.wpm ? .5 : r.wpm > KIDS[kid].norm * 3 ? .4 : Math.min(1, r.wpm / norm);
  const parts = [[ratio, .4], [acc, .25], [pace, .15]];
  if (L.rt) parts.push([L.rt.score, .2]);
  const w = parts.reduce((a, x) => a + x[1], 0); return parts.reduce((a, x) => a + x[0] * x[1], 0) / w;
}
/* Пропуск дня: баллы сгорают. Пропущен 1 день — половина, 2 и больше — все. */
function burnCheck(kid){ const K = S.kids[kid], t = U.today(); if (!K.lastDone) { K.lastDone = t; K.burnDate = t; return; } if (K.burnDate === t) return; K.burnDate = t;
  let missed = 0, d = K.lastDone; while (U.addDays(d, 1) < t) { d = U.addDays(d, 1); missed++; }
  const before = K.burnBase == null ? missed : missed - K.burnBase; K.burnBase = missed;
  if (missed < 1 || before < 1 || K.coins <= 0) return;
  const lost = missed >= 2 ? K.coins : Math.ceil(K.coins / 2); K.coins -= lost; K.burnMsg = `Ты пропустил(а) занятия — сгорело ${lost} мин игры.`;
  ev(kid, 'баллы сгорели', { coins: K.coins, price: -lost, text: `пропущено дней: ${missed}` }); save(); }
function burnWarn(kid){ const K = S.kids[kid], t = U.today(); if (K.lastDone === t || K.coins <= 0) return '';
  const y = U.addDays(t, -1); return `<div class="note warn">⏳ Не закончишь сегодня все уроки — завтра сгорит ${K.lastDone >= y ? 'половина баллов' : 'всё, что накоплено'} (${K.coins}).</div>`; }

/* ----- Чтение ----- */
let RD = null; /* текущая сессия чтения вслух */
function aloudPart(text, limit){ const words = text.split(/\s+/); if (words.length <= limit * 1.25) return { aloud: text, rest: '' };
  let n = limit; while (n < words.length && !/[.!?…»]$/.test(words[n - 1])) n++; const lines = text.split('\n'); let cnt = 0, out = [], rest = [];
  for (const ln of lines) { const w = ln.split(/\s+/).filter(Boolean).length; if (cnt < n) { out.push(ln); cnt += w; } else rest.push(ln); }
  return { aloud: out.join('\n'), rest: rest.join('\n') }; }
function wordsLimit(kid){ const K = S.kids[kid]; return K.readWords || KIDS[kid].startWords; }
function tokensHtml(text, st, p){ let i = 0; return text.split('\n').map(line => '<p>' + line.split(/\s+/).filter(Boolean).map(w => { const k = i++; const c = st ? (st[k] === 1 ? 'r1' : st[k] === 2 ? 'r2' : k === p ? 'rc' : '') : ''; return `<span class="w ${c}" data-i="${k}">${U.esc(w)}</span>`; }).join(' ') + '</p>').join(''); }
function vRead(kid, L){
  const t = readText(kid), K = S.kids[kid];
  const { aloud, rest } = aloudPart(t.text, readLim(kid, L));
  const head = `<section class="lesson"><p class="eyebrow">Чтение</p><h1>${U.esc(t.title)}</h1>${t.author ? `<p class="author">${U.esc(t.author)}</p>` : ''}
   <ol class="steps">${(() => { const st = readSteps(t, rest), ix = st.indexOf(PH_STEP[L.phase]); return st.map((s, i) => `<li class="${i < ix ? 'ok' : i === ix ? 'now' : ''}">${s}</li>`).join(''); })()}</ol>`;
  if (L.phase === 'warm') {
    const hard = Object.entries(K.hard).sort((a, b) => b[1].miss - a[1].miss).slice(0, 5).map(x => x[0]);
    const auto = t.text.split(/\s+/).map(w => w.replace(/[^\p{L}-]/gu, '')).filter(w => w.length >= 9);
    const list = [...new Set(hard.concat(auto))].slice(0, 6);
    return head + `<article class="card"><h2>Разминка: прочитай слова по слогам</h2><p class="hint">Нажми на слово, чтобы его послушать.</p><div class="warm">${list.map(w => `<button class="ww" data-act="sayw" data-w="${U.esc(w)}">${U.esc(w)}</button>`).join('')}</div>
    <p>Сегодня читаешь вслух: <b>${aloud.split(/\s+/).length} слов</b>. Читай спокойно и чётко, как будто рассказываешь кому-то.</p></article>
    <button class="btn big" data-act="toread">Начать чтение</button></section>`;
  }
  if (L.phase === 'read') {
    const live = RD && RD.active;
    return head + `<article class="card reading" lang="${L.lang || 'ru'}"><div class="text" id="rtext">${tokensHtml(aloud, RD && RD.st, RD && RD.p)}</div></article>${rest ? '<p class="hint">Это начало главы. Остальное потом дочитаешь сам(а), про себя.</p>' : ''}
    <div class="readbar">${SR ? (live ? `<button class="btn big stop" data-act="stopread">Я дочитал(а)</button><span id="rstat" class="rstat">Слушаю…</span>` : `<button class="btn big mic" data-act="startread">🎤 Читать вслух</button>`) : (live ? `<button class="btn big stop" data-act="stopread">Я дочитал(а)</button>` : `<button class="btn big" data-act="startread">Начать (засекаю время)</button><p class="hint">На этом устройстве нет распознавания речи. Читай вслух взрослому, я засеку время.</p>`)}</div></section>`;
  }
  if (L.phase === 'silent') {
    if (!L.st0) { L.st0 = Date.now(); save(); }
    return head + `<article class="card"><p>Теперь дочитай главу <b>про себя</b>, внимательно. Потом перескажешь и ответишь на вопросы с подвохом.</p><p class="hint">Не торопись: раньше чем через ${Math.max(1, Math.round(silentMin(kid, rest) / 60))} мин кнопка не сработает.</p></article>
    <article class="card reading"><div class="text">${tokensHtml(rest)}</div></article><div class="readbar"><button class="btn big" data-act="silentdone">Я дочитал(а) главу</button></div></section>`;
  }
  if (L.phase === 'retell') {
    const r = L.rt;
    if (r) return head + `<article class="card"><h2>Пересказ</h2>${r.adult ? '<p>Хорошо! Теперь вопросы.</p>' : `<p>Ты вспомнил(а) ${r.hit.length} из ${r.n} главных вещей${r.hit.length ? ': ' + r.hit.map(U.esc).join(', ') : ''}.</p>${r.miss.length ? `<p class="hint">Не прозвучало: ${r.miss.map(U.esc).join(', ')}.</p>` : ''}`}</article><button class="btn big" data-act="toqs">К вопросам</button></section>`;
    const live = RT && RT.active, voice = SR && !L.noSR;
    return head + `<article class="card"><h2>Перескажи главу своими словами</h2><p class="hint">Кто там был? Что случилось? Чем всё закончилось? Расскажи подробно, не меньше минуты.</p>${voice ? `<div id="rtell" class="rtell">${U.esc(RT && RT.text || '')}</div>` : ''}</article>
    <div class="readbar">${voice ? (live ? `<button class="btn big stop" data-act="retellstop">Я закончил(а)</button><span class="rstat">Слушаю…</span>` : `<button class="btn big mic" data-act="retellstart">🎤 Рассказать</button>`) : `<button class="btn big" data-act="retelladult">Пересказал(а) взрослому</button><p class="hint">Перескажи главу маме или папе.</p>`}</div></section>`;
  }
  if (L.phase === 'qs') {
    const r = L.res || {};
    const qs = readQs(kid, L), i = L.i || 0, q = qs[i], a = L.ans[i] || {};
    const sum = `<div class="readres"><span><b>${r.wpm || '—'}</b> слов в минуту</span>${r.acc != null ? `<span><b>${Math.round(r.acc * 100)}%</b> точность</span>` : ''}${r.errs && r.errs.length ? `<span>Трудные слова: ${r.errs.slice(0, 6).map(U.esc).join(', ')}</span>` : ''}</div>`;
    return head + sum + `<div class="counter">Вопрос ${i + 1} из ${qs.length}</div>${t.kw ? '' : `<details class="peek"><summary>Посмотреть текст</summary><div class="text">${tokensHtml(t.text)}</div></details>`}
    <article class="card task"><div class="q">${U.esc(q.q)}</div><div class="opts">${q.opts.map(o => `<button class="opt ${a.final && o === q.a ? 'right' : (a.wrong || []).includes(o) ? 'wrong' : ''}" data-act="rq" data-v="${U.esc(o)}" ${a.final || (a.wrong || []).includes(o) ? 'disabled' : ''}>${U.esc(o)}</button>`).join('')}</div>
    ${a.final ? (a.ok ? `<div class="fb ok"><b>Верно!</b></div>` : `<div class="fb bad"><b>Правильный ответ: ${U.esc(q.a)}</b></div>`) : a.tries ? (t.kw ? '<div class="fb try">Подумай ещё. Тут есть подвох!</div>' : '<div class="fb try">Подумай ещё. Можно заглянуть в текст.</div>') : ''}</article>
    ${a.final ? `<button class="btn big" data-act="rnext">${i + 1 < qs.length ? 'Дальше' : 'Закончить'}</button>` : ''}</section>`;
  }
  if (L.phase === 'survey') return head + vSurvey(L) + '</section>';
  return head + vResult(kid, 'read', L) + `<p class="center hint">${L.res && L.res.good ? 'Отличный темп! Следующий текст будет чуть длиннее.' : L.res && L.res.repeat ? 'Завтра перечитаем этот текст ещё раз — так читать станет легче.' : ''}</p></section>`;
}
const PH_STEP = { warm:'Разминка', read:'Читаю вслух', silent:'Читаю сам', retell:'Пересказ', qs:'Вопросы', survey:'Отзыв', done:'Отзыв' };
function readSteps(t, rest){ const s = ['Разминка', 'Читаю вслух']; if (rest) s.push('Читаю сам'); if (t.kw) s.push('Пересказ'); return s.concat(['Вопросы', 'Отзыв']); }
function readLim(kid, L){ return (L && L.lim) || wordsLimit(kid); }
function silentMin(kid, rest){ const w = rest.split(/\s+/).filter(Boolean).length; return Math.min(900, Math.round(w / (KIDS[kid].norm * 2.5) * 60)); }
let RT = null; /* пересказ голосом */
function retellStart(){
  const R0 = RT = { active: true, base: '', cur: '', text: '', t0: Date.now() };
  const rec = new SR(); rec.lang = 'ru-RU'; rec.continuous = true; rec.interimResults = true; R0.rec = rec;
  rec.onresult = e => { let s = ''; for (let i = 0; i < e.results.length; i++) s += ' ' + e.results[i][0].transcript; R0.cur = s; R0.text = (R0.base + ' ' + s).trim(); const el = document.getElementById('rtell'); if (el) el.textContent = R0.text; };
  rec.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') R0.denied = true; };
  rec.onend = () => { R0.base += ' ' + R0.cur; R0.cur = ''; if (R0.active && !R0.denied) setTimeout(() => { try { rec.start(); } catch (e) {} }, 120); };
  try { rec.start(); } catch (e) {}
  render();
}
function kwHit(stem, words){ const k = normW(stem), n = Math.min(k.length, Math.max(4, k.length - 2)), p = k.slice(0, n); return words.some(w => w.startsWith(p)); }
function retellStop(){
  if (!RT) return; RT.active = false; try { RT.rec && RT.rec.stop(); } catch (e) {}
  const kid = cur.kid, L = dayRec(kid, cur.ds).les.read, t = readText(kid);
  const words = RT.text.split(/\s+/).map(normW).filter(Boolean);
  if (words.length < 12) { L.rtTries = (L.rtTries || 0) + 1; if (RT.denied || L.rtTries >= 2) L.noSR = true; RT = null; save(); render(); alertMsg(L.noSR ? 'Не получилось услышать. Перескажи взрослому.' : 'Расскажи подробнее — хотя бы несколько предложений'); return; }
  const hit = t.kw.filter(k => kwHit(k, words)), miss = t.kw.filter(k => !hit.includes(k));
  L.rt = { n: t.kw.length, hit, miss, score: hit.length / t.kw.length, words: words.length };
  ev(kid, 'пересказ', { subj: 'Чтение', unit: t.title, text: RT.text.slice(0, 1500), score: `${hit.length}/${t.kw.length}`, words: words.length, secs: Math.round((Date.now() - RT.t0) / 1000) });
  RT = null; save(); render();
}
function readQs(kid, L){ const t = readText(kid); const r = U.rng(L.seed || 1); return t.qs.map(([q, a, ...w]) => ({ q, a, opts: r.shuffle([a, ...w]) })); }

function startRead(lang){
  const kid = cur.kid, L = cur.subj === 'read' ? dayRec(kid, cur.ds).les.read : null;
  const text = cur.subj === 'read' ? aloudPart(readText(kid).text, readLim(kid, L)).aloud : RD_TEXT();
  const T = text.split(/\s+/).filter(Boolean).map(normW);
  RD = { active: true, t0: Date.now(), T, st: new Array(T.length).fill(0), p: 0, base: '', cur: '', lang: lang || 'ru-RU' };
  if (SR) {
    const rec = new SR(); rec.lang = RD.lang; rec.continuous = true; rec.interimResults = true; RD.rec = rec;
    rec.onresult = e => { let s = ''; for (let i = 0; i < e.results.length; i++) s += ' ' + e.results[i][0].transcript; RD.cur = s; updRead(); };
    rec.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { RD.denied = true; RD.active = true; const st = document.getElementById('rstat'); if (st) st.textContent = 'Микрофон не разрешён — читай вслух, я засеку время.'; } };
    rec.onend = () => { RD.base += ' ' + RD.cur; RD.cur = ''; if (RD.active && !RD.denied) setTimeout(() => { try { rec.start(); } catch (e) {} }, 120); };
    try { rec.start(); } catch (e) {}
  }
  render();
}
function updRead(){
  const spoken = (RD.base + ' ' + RD.cur).split(/\s+/).map(normW).filter(Boolean);
  const r = align(RD.T, spoken); RD.st = r.st; RD.p = r.p; RD.extra = r.extra;
  document.querySelectorAll('#rtext .w, .ftext .w').forEach(el => { const k = +el.dataset.i; el.className = 'w ' + (r.st[k] === 1 ? 'r1' : r.st[k] === 2 ? 'r2' : k === r.p ? 'rc' : ''); });
  const cur_ = document.querySelector('.w.rc'); if (cur_ && cur_.scrollIntoView) cur_.scrollIntoView({ block: 'center', behavior: 'smooth' });
  const stat = document.getElementById('rstat'); if (stat) stat.textContent = `Прочитано ${r.p} из ${RD.T.length}`;
  if (r.p >= RD.T.length) setTimeout(stopRead, 600);
}
function stopRead(){
  if (!RD || !RD.active) return; RD.active = false; try { RD.rec && RD.rec.stop(); } catch (e) {}
  const kid = cur.kid, K = S.kids[kid], secs = Math.max(5, (Date.now() - RD.t0) / 1000);
  const useSR = SR && !RD.denied && RD.p > 0;
  const reached = useSR ? RD.p : RD.T.length;
  const wpm = Math.round(reached / (secs / 60));
  const LR = cur.subj === 'read' ? dayRec(kid, cur.ds).les.read : null; if (LR && !LR.lim) LR.lim = wordsLimit(kid);
  const textWords = (cur.subj === 'read' ? aloudPart(readText(kid).text, readLim(kid, LR)).aloud : RD_TEXT()).split(/\s+/).filter(Boolean);
  let errs = [], acc = null;
  if (useSR) { let okc = 0, bad = 0; for (let k = 0; k < RD.p; k++) { if (RD.st[k] === 1) okc++; else if (RD.st[k] === 2) { bad++; errs.push(textWords[k].replace(/[^\p{L}-]/gu, '')); } } acc = okc / Math.max(1, okc + bad); }
  const res = { wpm, acc, errs, secs: Math.round(secs), words: reached, sr: useSR };
  if (cur.subj === 'read') {
    const L = dayRec(kid, cur.ds).les.read; L.res = res; L.i = 0; { const sp = aloudPart(readText(kid).text, readLim(kid, L)); L.phase = sp.rest ? 'silent' : readText(kid).kw ? 'retell' : 'qs'; L.st0 = Date.now(); }
    const norm = KIDS[kid].norm; res.good = (acc == null || acc >= .9) && wpm >= norm * .8 * progressFactor(kid) && wpm <= norm * 3;
    res.repeat = acc != null && acc < .85;
    errs.forEach(w => { const h = K.hard[w] || (K.hard[w] = { miss: 0, ok: 0 }); h.miss++; });
    if (useSR) RD.T.forEach((w, k) => { if (RD.st[k] === 1) { const orig = textWords[k].replace(/[^\p{L}-]/gu, ''); if (K.hard[orig]) { K.hard[orig].ok++; if (K.hard[orig].ok >= 2) delete K.hard[orig]; } } });
    const lim = wordsLimit(kid); K.readWords = Math.round(res.good ? lim * 1.15 : res.repeat ? Math.max(30, lim * .9) : lim);
    K.words += reached; K.reading.push({ d: cur.ds, title: readText(kid).title, wpm, acc, lang: 'ru', errs: errs.slice(0, 10) });
    ev(kid, 'чтение вслух', { subj: 'Чтение', unit: readText(kid).title, wpm, acc: acc == null ? '' : Math.round(acc * 100) + '%', words: reached, secs: res.secs, errs: errs.join(', ') });
  } else { const L = dayRec(kid, cur.ds).les[cur.subj]; L.fres = res; L.fphase = 'qs'; S.kids[kid].reading.push({ d: cur.ds, title: L.ftitle, wpm, acc, lang: L.tr === '_alt' ? 'en' : 'pt' }); ev(kid, 'чтение вслух', { subj: L.tr === '_alt' ? 'English' : 'Português', unit: L.ftitle, wpm, acc: acc == null ? '' : Math.round(acc * 100) + '%', errs: errs.join(', ') }); }
  save(); render();
}
function progressFactor(kid){ const K = S.kids[kid]; const n = K.reading.filter(x => x.lang === 'ru').length; return Math.min(1, .6 + n * .01); }
function readAnswer(v){
  const kid = cur.kid, L = dayRec(kid, cur.ds).les.read, qs = readQs(kid, L), i = L.i || 0, q = qs[i];
  const a = L.ans[i] || (L.ans[i] = { tries: 0, wrong: [] }); if (a.final) return; a.tries++;
  const ok = v === q.a; if (!ok) a.wrong.push(v);
  if (ok || a.tries >= 2) { a.final = true; a.ok = ok; ev(kid, 'ответ', { subj: 'Чтение', unit: readText(kid).title, q: q.q, ans: v, right: q.a, ok: ok && a.tries === 1 ? 'верно' : ok ? 'со 2-й попытки' : 'ошибка' }); }
  save(); render();
}

/* ----- Чтение на португальском / английском внутри урока языков ----- */
function foreignList(L){ return L.tr === '_alt' ? READ_EN : READ_PT; }
function startForeign(kid, L){ const K = S.kids[kid]; const key = L.tr === '_alt' ? 'enRead' : 'ptRead'; const list = foreignList(L).filter(t => kid === 'anya' || t.lvl === 1 || (K.pos[key] || 0) >= 3); const t = list[(K.pos[key] || 0) % list.length]; L.fid = t.id; L.ftitle = t.title; L.fphase = 'read'; L.fans = []; L.fq = t.qs.length; L.fi = 0; }
function curForeign(L){ return foreignList(L).find(t => t.id === L.fid); }
function RD_TEXT(){ const L = dayRec(cur.kid, cur.ds).les[cur.subj]; return curForeign(L).text; }
function vForeign(kid, L){
  const t = curForeign(L), lang = L.tr === '_alt' ? 'en-GB' : 'pt-PT';
  if (L.fphase === 'read') { const live = RD && RD.active;
    return `<article class="card reading"><h2>${U.esc(t.title)}</h2><div class="text ftext" id="rtext">${tokensHtml(t.text, RD && RD.st, RD && RD.p)}</div><button class="btn ghost small" data-act="sayfull">🔊 Послушать, как читать</button></article>
    <div class="readbar">${live ? `<button class="btn big stop" data-act="stopread">Я дочитал(а)</button><span id="rstat" class="rstat">Слушаю…</span>` : `<button class="btn big mic" data-act="startfread">🎤 Прочитать вслух</button>`}</div>`; }
  const r = U.rng(U.h(L.fid + cur.ds)); const qs = t.qs.map(([q, a, ...w]) => ({ q, a, opts: r.shuffle([a, ...w]) })); const i = L.fi, q = qs[i], a = L.fans[i] || {};
  return `<div class="counter">Вопрос ${i + 1} из ${qs.length}</div><details class="peek"><summary>Посмотреть текст</summary><div class="text">${tokensHtml(t.text)}</div></details><article class="card task"><div class="q">${U.esc(q.q)}</div><div class="opts">${q.opts.map(o => `<button class="opt ${a.final && o === q.a ? 'right' : (a.wrong || []).includes(o) ? 'wrong' : ''}" data-act="fq" data-v="${U.esc(o)}" ${a.final || (a.wrong || []).includes(o) ? 'disabled' : ''}>${U.esc(o)}</button>`).join('')}</div>${a.final ? (a.ok ? '<div class="fb ok"><b>Certo!</b></div>' : `<div class="fb bad"><b>${U.esc(q.a)}</b></div>`) : a.tries ? '<div class="fb try">Ещё раз.</div>' : ''}</article>${a.final ? `<button class="btn big" data-act="fnext">${i + 1 < qs.length ? 'Дальше' : 'К отзыву'}</button>` : ''}`;
}
function foreignAnswer(v){ const kid = cur.kid, L = dayRec(kid, cur.ds).les[cur.subj], t = curForeign(L); const r = U.rng(U.h(L.fid + cur.ds)); const qs = t.qs.map(([q, a, ...w]) => ({ q, a, opts: r.shuffle([a, ...w]) })); const q = qs[L.fi];
  const a = L.fans[L.fi] || (L.fans[L.fi] = { tries: 0, wrong: [] }); if (a.final) return; a.tries++; const ok = v === q.a; if (!ok) a.wrong.push(v);
  if (ok || a.tries >= 2) { a.final = true; a.ok = ok; ev(kid, 'ответ', { subj: L.tr === '_alt' ? 'English' : 'Português', unit: t.title, q: q.q, ans: v, right: q.a, ok: ok && a.tries === 1 ? 'верно' : ok ? 'со 2-й попытки' : 'ошибка' }); }
  save(); render(); }

/* ----- Магазин ----- */
function vShop(){
  const kid = cur.kid, K = S.kids[kid];
  return `<main class="wrap ${kid}"><header class="bar"><button class="link" data-act="home">← Назад</button><span class="coins">${coinsHtml(K.coins)}</span></header>
  <section class="lesson"><p class="eyebrow">Магазин наград</p><h1>На что потратить монеты?</h1><p class="hint">Обмен подтверждает родитель своим кодом.</p>
  <div class="shop">${S.shop.map(it => `<div class="card item"><span class="iname">${U.esc(it.name)}</span><span class="price">${coinsHtml(it.price)}</span><button class="btn small" data-act="buy" data-id="${it.id}" ${K.coins < it.price ? 'disabled' : ''}>${K.coins < it.price ? `ещё ${it.price - K.coins}` : 'Обменять'}</button></div>`).join('')}</div>
  ${K.purchases.length ? `<h2>Мои награды</h2><ul class="plain">${K.purchases.slice(-10).reverse().map(p => `<li>${p.d} — ${U.esc(p.name)} (${p.price})</li>`).join('')}</ul>` : ''}</section></main>`;
}

/* ----- Родителям ----- */
function vParent(){
  const tabs = [['report', 'Отчёт'], ['shop', 'Магазин'], ['set', 'Настройки']];
  let body = '';
  if (cur.parentTab === 'report') body = vReport(cur.parentKid);
  else if (cur.parentTab === 'shop') body = `<div class="card"><h2>Награды и цены</h2>${S.shop.map((it, i) => `<div class="shoprow"><input id="sn${i}" value="${U.esc(it.name)}" aria-label="Награда"><input id="sp${i}" inputmode="numeric" value="${it.price}" aria-label="Цена"><button class="link" data-act="delshop" data-i="${i}">Удалить</button></div>`).join('')}<div class="row"><button class="btn small ghost" data-act="addshop">Добавить</button><button class="btn small" data-act="saveshop">Сохранить</button></div></div>`;
  else body = vSettings();
  return `<main class="wrap"><header class="bar"><button class="link" data-act="logout">← Выйти</button><span>Родителям</span></header>
  <nav class="tabs">${tabs.map(([k, t]) => `<button class="tab ${cur.parentTab === k ? 'on' : ''}" data-act="ptab" data-t="${k}">${t}</button>`).join('')}</nav>${body}</main>`;
}
function vReport(kid){
  const K = S.kids[kid], d = KIDS[kid];
  const kidSw = `<div class="row">${['yarik', 'anya'].map(k => `<button class="chip ${kid === k ? 'on' : ''}" data-act="pkid" data-k="${k}">${KIDS[k].name}</button>`).join('')}</div>`;
  const subs = Object.entries(d.cur).filter(([k, c]) => c.units).map(([k, c]) => { const rows = [['', c.units, c.name]].concat(c.alt ? [['_alt', c.alt, c.altName]] : []);
    return rows.map(([tr, list, nm]) => { const i = Math.min(K.pos[k + tr] || 0, list.length); const tried = list.filter(u => K.stats[u.id]); const a = tried.length ? Math.round(tried.reduce((s, u) => s + acc(K, u.id), 0) / tried.length * 100) : null;
      return `<tr><td>${nm}</td><td>${i} из ${list.length}</td><td>${U.esc((list[Math.min(i, list.length - 1)] || {}).t || '')}</td><td>${a == null ? '—' : a + '%'}</td></tr>`; }).join(''); }).join('');
  const weak = Object.entries(K.stats).filter(([, s]) => s.n >= 3).map(([id, s]) => [id, s.ok / s.n]).sort((a, b) => a[1] - b[1]).slice(0, 6).map(([id, x]) => { const u = Object.values(d.cur).flatMap(c => (c.units || []).concat(c.alt || [])).find(u => u.id === id); return `<li>${U.esc(u ? u.t : id)} — ${Math.round(x * 100)}%</li>`; }).join('');
  const rd = K.reading.slice(-10).reverse().map(r => `<tr><td>${r.d}</td><td>${U.esc(r.title)}</td><td>${r.lang}</td><td>${r.wpm}</td><td>${r.acc == null ? '—' : Math.round(r.acc * 100) + '%'}</td><td>${U.esc((r.errs || []).join(', '))}</td></tr>`).join('');
  const fbs = S.log.filter(e => e.kid === d.name && e.type === 'урок завершён').slice(-10).reverse().map(e => `<li>${e.t.slice(0, 10)} · ${U.esc(e.subj)}: ${e.grade} (${e.score}) · ${['', '🙁', '😐', '🙂', '😀'][e.mood || 0] || ''} ${U.esc(e.diff || '')}${e.text ? ' · «' + U.esc(e.text) + '»' : ''}</li>`).join('');
  const errs = S.log.filter(e => e.kid === d.name && e.type === 'ответ' && e.ok === 'ошибка').slice(-12).reverse().map(e => `<li><b>${U.esc(e.subj)}</b>: ${U.esc(e.q)} — ответил(а) «${U.esc(e.ans)}», надо «${U.esc(e.right)}»</li>`).join('');
  return kidSw + `<div class="card"><h2>${d.name}: монеты ${K.coins}, прочитано слов ${K.words}, в повторении ${K.srs.length} заданий</h2>
  <div class="tscroll"><table><thead><tr><th>Предмет</th><th>Темы</th><th>Сейчас</th><th>Точность</th></tr></thead><tbody>${subs}</tbody></table></div></div>
  <div class="card"><h2>Слабые места</h2>${weak ? `<ul>${weak}</ul>` : '<p>Пока мало данных.</p>'}</div>
  <div class="card"><h2>Чтение вслух</h2>${rd ? `<div class="tscroll"><table><thead><tr><th>Дата</th><th>Текст</th><th>Язык</th><th>сл/мин</th><th>Точность</th><th>Ошибки</th></tr></thead><tbody>${rd}</tbody></table></div>` : '<p>Ещё не читал(а).</p>'}<p class="hint">Норма к концу года: ${d.norm} слов в минуту. Сейчас читает вслух по ${wordsLimit(kid)} слов за урок.</p></div>
  <div class="card"><h2>Последние ошибки</h2>${errs ? `<ul>${errs}</ul>` : '<p>Ошибок нет.</p>'}</div>
  <div class="card"><h2>Отзывы после уроков</h2>${fbs ? `<ul>${fbs}</ul>` : '<p>Пока нет.</p>'}</div>
  <div class="card"><h2>Быстрые действия</h2><form class="form" data-form="hw"><label>Задание ребёнку (появится в «Домашнем задании»)<input id="hwtext" autocomplete="off"></label><button class="btn small">Добавить</button></form>
  <form class="form" data-form="coins"><label>Монеты (+ или −)<input id="coinadd" inputmode="numeric" autocomplete="off"></label><button class="btn small">Начислить</button></form></div>`;
}
function vSettings(){
  const unitSel = kid => Object.entries(KIDS[kid].cur).filter(([, c]) => c.units).map(([k, c]) => [['', c.units, c.name]].concat(c.alt ? [['_alt', c.alt, c.altName]] : []).map(([tr, list, nm]) => `<label>${KIDS[kid].name} · ${nm}<select id="sel_${kid}_${k}${tr}">${list.map((u, i) => `<option value="${i}" ${(S.kids[kid].pos[k + tr] || 0) === i ? 'selected' : ''}>${i + 1}. ${U.esc(u.t)}</option>`).join('')}</select></label>`).join('')).join('');
  return `<div class="card form"><h2>Темы: с чего продолжать</h2>${unitSel('yarik')}${unitSel('anya')}<button class="btn small" data-act="saveunits">Сохранить темы</button></div>
  <div class="card form" ><h2>Связь с таблицей родителя</h2><label>Адрес скрипта Google<input id="syncurl" value="${U.esc(S.cfg.sync || '')}" autocomplete="off"></label><p class="hint">В очереди на отправку: ${S.queue.length}.</p><div class="row"><button class="btn small" data-act="savesync">Сохранить и отправить</button></div></div>
  <div class="card"><h2>Начать заново</h2><p class="hint">Стирает на этом айпаде весь прогресс, монеты, покупки и коды. После теста нажмите — и приложение будет как новое.</p><button class="btn small stop" data-act="resetall">Сбросить всё на этом устройстве</button></div>
  <form class="card form" data-form="pins"><h2>Коды</h2><label>Новый код родителя<input id="np" inputmode="numeric" maxlength="4" autocomplete="off"></label><label>Новый код Ярика<input id="ny" inputmode="numeric" maxlength="4" autocomplete="off"></label><label>Новый код Ани<input id="na" inputmode="numeric" maxlength="4" autocomplete="off"></label><button class="btn small">Сменить коды</button></form>`;
}

/* ===== События ===== */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return; const act = b.dataset.act;
  const kid = cur.kid; const D = kid && dayRec(kid, cur.ds); const L = D && cur.subj && D.les[cur.subj];
  switch (act) {
    case 'login': askPin(b.dataset.kid, () => { cur.kid = b.dataset.kid; ev(cur.kid, 'вход', {}); go('home'); }); break;
    case 'parent': askPin('parent', () => go('parent', { kid: null })); break;
    case 'cancelpin': go(cur.kid ? 'home' : 'login'); break;
    case 'key': pinKey(b.dataset.k); break;
    case 'logout': if (RD && RD.active) stopRead(); if (RT && RT.active) { RT.active = false; try { RT.rec.stop(); } catch (e) {} RT = null; } cur.kid = null; go('login'); break;
    case 'home': if (RD && RD.active) { RD.active = false; try { RD.rec && RD.rec.stop(); } catch (x) {} } go('home'); break;
    case 'open': { const s0 = b.dataset.subj, L0 = D.les[s0]; if (!(L0 && L0.phase === 'done') && s0 !== nextOpen(kid)) { alertMsg('Сначала закончи предыдущий урок 🔒'); break; } startLesson(s0); break; }
    case 'seen': { const m = S.kids[kid].msgs.find(x => x.id === b.dataset.id); if (m) m.seen = true; save(); render(); break; }
    case 'dunno': { L.helpN = (L.helpN || 0) + 1; const u = unitById(kid, cur.subj, L.uid); ev(kid, 'не понимаю', { subj: subjName(kid, cur.subj, cur.ds), unit: u.t, text: L.phase === 'theory' ? 'объяснение темы' : 'задание' }); save(); render(); break; }
    case 'dunnotask': { L.showTh = L.i; L.helpN = (L.helpN || 0) + 1; const u = unitById(kid, cur.subj, L.uid), t = lessonTasks(L, kid, cur.subj)[L.i]; ev(kid, 'не понимаю', { subj: subjName(kid, cur.subj, cur.ds), unit: u.t, q: strip(t.q) }); save(); render(); break; }
    case 'sayex': say(b.dataset.t, 'ru-RU'); break;
    case 'saytheory': { const u = unitById(kid, cur.subj, L.uid); say(strip(u.th.replace(/<br>/g, '. ')), 'ru-RU'); break; }
    case 'topractice': L.phase = 'practice'; save(); render(); break;
    case 'choose': answer(b.dataset.v); break;
    case 'sayq': { const T = lessonTasks(L, kid, cur.subj); const t = T[L.i]; say(t.sp, L.tr === '_alt' ? 'en-GB' : 'pt-PT'); break; }
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
    case 'retelladult': { const t = readText(kid); L.rt = { n: t.kw.length, hit: [], miss: [], score: .7, adult: true }; ev(kid, 'пересказ', { subj: 'Чтение', unit: t.title, text: 'пересказал(а) взрослому' }); save(); render(); break; }
    case 'toqs': L.phase = 'qs'; L.i = 0; save(); render(); break;
    case 'burnseen': delete S.kids[kid].burnMsg; save(); render(); break;
    case 'startread': startRead('ru-RU'); break;
    case 'stopread': stopRead(); break;
    case 'rq': readAnswer(b.dataset.v); break;
    case 'rnext': { const qs = readQs(kid, L); if ((L.i || 0) + 1 < qs.length) { L.i = (L.i || 0) + 1; } else { L.phase = 'survey'; const K = S.kids[kid]; K.texts++; if (!(L.res && L.res.repeat)) K.pos.read = (K.pos.read || 0) + 1; } save(); render(); break; }
    case 'startfread': RD = null; startRead(L.tr === '_alt' ? 'en-GB' : 'pt-PT'); break;
    case 'sayfull': say(curForeign(L).text, L.tr === '_alt' ? 'en-GB' : 'pt-PT'); break;
    case 'fq': foreignAnswer(b.dataset.v); break;
    case 'fnext': { if (L.fi + 1 < L.fq) L.fi++; else { L.phase = 'survey'; const key = L.tr === '_alt' ? 'enRead' : 'ptRead'; S.kids[kid].pos[key] = (S.kids[kid].pos[key] || 0) + 1; } save(); render(); break; }
    case 'shop': go('shop'); break;
    case 'buy': { const it = S.shop.find(x => x.id === b.dataset.id); const k0 = kid; askPin('parent', () => { const K = S.kids[k0]; if (K.coins >= it.price) { K.coins -= it.price; K.purchases.push({ d: cur.ds, name: it.name, price: it.price }); ev(k0, 'награда', { unit: it.name, coins: K.coins, price: it.price }); save(); } cur.kid = k0; go('shop'); }, `Подтвердите: «${it.name}» за ${it.price} монет`); break; }
    case 'resetall': if (window.confirm('Стереть весь прогресс, монеты и коды на этом айпаде?')) { ev('yarik', 'сброс устройства', {}); flush().finally(() => { try { localStorage.removeItem(KEY); } catch (x) {} location.reload(); }); } break;
    case 'ptab': go('parent', { parentTab: b.dataset.t }); break;
    case 'pkid': go('parent', { parentKid: b.dataset.k }); break;
    case 'addshop': S.shop.push({ id: 's' + Date.now(), name: 'Новая награда', price: 50 }); save(); render(); break;
    case 'delshop': S.shop.splice(+b.dataset.i, 1); save(); render(); break;
    case 'saveshop': S.shop.forEach((it, i) => { it.name = document.getElementById('sn' + i).value.trim() || it.name; it.price = Math.max(1, parseInt(document.getElementById('sp' + i).value) || it.price); }); save(); render(); break;
    case 'saveunits': for (const kd of ['yarik', 'anya']) for (const [k, c] of Object.entries(KIDS[kd].cur)) for (const tr of ['', '_alt']) { const el = document.getElementById(`sel_${kd}_${k}${tr}`); if (el) S.kids[kd].pos[k + tr] = +el.value; } save(); alertMsg('Темы сохранены'); break;
    case 'savesync': S.cfg.sync = document.getElementById('syncurl').value.trim(); save(); flush(); pull(); alertMsg('Сохранено'); break;
  }
});
function alertMsg(t){ const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2200); }
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault(); const k = f.dataset.form;
  const val = id => (document.getElementById(id) || {}).value || '';
  if (k === 'setup') { const p = val('pp'), y = val('py'), a = val('pa'); if (![p, y, a].every(x => /^\d{4}$/.test(x))) return alertMsg('Нужно по четыре цифры'); S.parentPin = hashPin(p); S.kids.yarik.pin = hashPin(y); S.kids.anya.pin = hashPin(a); save(); go('login'); }
  if (k === 'num') answer(val('numin'));
  if (k === 'pins') { const p = val('np'), y = val('ny'), a = val('na'); if (/^\d{4}$/.test(p)) S.parentPin = hashPin(p); if (/^\d{4}$/.test(y)) S.kids.yarik.pin = hashPin(y); if (/^\d{4}$/.test(a)) S.kids.anya.pin = hashPin(a); save(); alertMsg('Коды обновлены'); render(); }
  if (k === 'hw') { const t = val('hwtext').trim(); if (t) { S.kids[cur.parentKid].hwText.push({ id: 'h' + Date.now(), text: t, done: false }); save(); alertMsg('Задание добавлено'); render(); } }
  if (k === 'coins') { const n = parseInt(val('coinadd')); if (n) { S.kids[cur.parentKid].coins += n; ev(cur.parentKid, 'монеты от родителя', { coins: S.kids[cur.parentKid].coins, price: n }); save(); alertMsg('Готово'); render(); } }
});
window.addEventListener('online', () => { flush(); pull(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { pull(); flush(); if (cur.ds !== U.today() && cur.view === 'home') render(); } });
if ('speechSynthesis' in window) try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => {}; } catch (e) {}
render(); pull(); flush(); setInterval(() => { pull(); flush(); }, 5 * 60 * 1000);
