/* ===== Ярик читает сам (решение Юры 22.11) =====
   1) Задание сначала читает вслух сам: айпад слушает и подсвечивает слова. Запнулся — озвучиваем только трудное слово.
   2) «Не понимаю»: 3 раза за урок бесплатно, дальше минус 1 балл за каждый. Верно без подсказки — баллы вдвое больше, чем с подсказкой.
   3) Слоги: ежедневный блок ~10 минут по методике букваря — звуки, слияния, слова (футбол, животные).
   4) Загадки, головоломки, задачи, шахматы и программирование открываются, только когда ребёнок прочитал слово.
   Включается флагом self у ребёнка (KIDS_TPL), только в «Уроках» (не в «Словоходе»). */
function srOn(kid){ try { return !FAM && !!kid && !!KIDS[kid] && !!KIDS[kid].self && !(S.kids[kid] && S.kids[kid].selfOff); } catch (e) { return false; } }
const SR_FREE = 3;

/* ---------- 1. Задание читает сам ---------- */
let SRT = null;
function srWords(t){ const s = strip(String(t.q || '')).replace(/_+/g, ' ').replace(/\s+/g, ' ').trim(); let W = s.split(' ').filter(w => normW(w)); if (W.length > 30) W = W.slice(0, 25); return W; }
function srNeed(kid, subj, L, t, a){ if (!srOn(kid) || !t || !L || a.final || a.rd || subj === 'lang' || t.sj === 'lang' || cur.rtask != null) return false;
  const W = srWords(t), cyr = W.filter(w => /[а-яё]/i.test(w)).length; return cyr >= 2 && cyr >= W.length * .5; }
function srStop(){ if (!SRT) return; SRT.active = false; try { SRT.rec && SRT.rec.stop(); } catch (e) {} if (SRT.tick) clearInterval(SRT.tick); SRT.tick = null; }
function srGate(kid, subj, L, t, a){ if (!srNeed(kid, subj, L, t, a)) return '';
  const key = kid + '|' + cur.ds + '|' + subj + '|' + L.i;
  if (!SRT || SRT.key !== key) { srStop(); const W = srWords(t); SRT = { key, W, T: W.map(normW), st: new Array(W.length).fill(0), p: 0, base: '', cur: '', t0: Date.now(), last: Date.now(), hinted: {}, hints: 0, taps: 0, active: false, denied: false, late: false }; }
  const live = SRT.active, noSR = !SR || SRT.denied;
  const words = SRT.W.map((w, k) => `<button type="button" class="w sw ${wCls(SRT.st, k, live ? SRT.p : -1)}${SRT.hint === k ? ' swh' : ''}" data-sr="word" data-k="${k}">${U.esc(w)}</button>`).join(' ');
  const btn = noSR ? '<button class="btn big" data-sr="done">Я прочитал вслух</button>' : live ? `<span id="srstat" class="rstat">Слушаю… прочитано ${SRT.p} из ${SRT.T.length}</span>${SRT.late ? '<button class="btn ghost" data-sr="done">Я прочитал</button>' : ''}` : '<button class="btn big mic" data-sr="start">🎤 Читаю вслух</button>';
  return `<div class="srgate"><p class="srh">Сначала прочитай задание вслух, по слогам. Ответы появятся, когда дочитаешь.</p><div class="srtext" id="srtext">${words}</div><p class="hint small">Трудное слово? Нажми на него — прочитаю только его.</p><div class="row" id="srrow">${btn}</div></div>`; }
function srHint(k, tap){ if (!SRT || k == null || !SRT.W[k]) return; SRT.hint = k; if (tap) SRT.taps++; else if (!SRT.hinted[k]) SRT.hints++; SRT.hinted[k] = 1;
  document.querySelectorAll('#srtext .sw').forEach(el => el.classList.toggle('swh', +el.dataset.k === k));
  try { say(SRT.W[k].replace(/[^\p{L}\p{N}-]/gu, ''), 'ru-RU'); } catch (e) {} }
function srStart(){ if (!SRT || !SR) return; const me = SRT; me.active = true; me.last = Date.now();
  const rec = new SR(); rec.lang = 'ru-RU'; rec.continuous = true; rec.interimResults = true; me.rec = rec;
  rec.onresult = e => { if (SRT !== me || !me.active) return; let s = ''; for (let i = 0; i < e.results.length; i++) s += ' ' + e.results[i][0].transcript; me.cur = s; srUpd(); };
  rec.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { me.denied = true; srStop(); if (SRT === me) render(); } };
  rec.onend = () => { me.base += ' ' + (me.cur || ''); me.cur = ''; if (SRT === me && me.active && !me.denied && document.getElementById('srtext')) setTimeout(() => { try { rec.start(); } catch (e) {} }, 120); else me.active = false; };
  try { rec.start(); } catch (e) {}
  me.tick = setInterval(() => { if (SRT !== me || !me.active) { clearInterval(me.tick); return; } if (!document.getElementById('srtext')) { srStop(); return; }
    /* Запнулся: 5 секунд без продвижения — читаем вслух только это слово (один раз) */
    if (Date.now() - me.last > 5000 && me.p < me.T.length && !me.hinted[me.p]) { srHint(me.p); me.last = Date.now(); } }, 1000);
  /* Распознавание может не слышать — через 45 секунд даём закончить кнопкой, чтобы ребёнок не застрял */
  setTimeout(() => { if (SRT === me && !me.ok) { me.late = true; const r = document.getElementById('srrow'); if (r && !r.querySelector('[data-sr="done"]')) r.insertAdjacentHTML('beforeend', '<button class="btn ghost" data-sr="done">Я прочитал</button>'); } }, 45000);
  render(); }
function srUpd(){ const me = SRT; if (!me) return; const spoken = (me.base + ' ' + me.cur).split(/\s+/).map(normW).filter(Boolean); const r = align(me.T, spoken);
  if (r.p > me.p) me.last = Date.now(); me.st = r.st; me.p = r.p;
  document.querySelectorAll('#srtext .sw').forEach(el => { const k = +el.dataset.k; el.className = 'w sw ' + wCls(r.st, k, r.p) + (me.hint === k ? ' swh' : ''); });
  const s = document.getElementById('srstat'); if (s) s.textContent = `Слушаю… прочитано ${r.p} из ${me.T.length}`;
  /* Ошибку в слове услышали уверенно — подсказываем это слово */
  for (let k = 0; k < r.p; k++) if (r.st[k] === 2 && !me.hinted[k]) { srHint(k); break; }
  if (r.p >= me.T.length) setTimeout(() => srOk(false), 500); }
function srOk(manual){ const me = SRT; if (!me || me.ok) return; const kid = cur.kid, D = dayRec(kid, cur.ds), L = D && D.les[cur.subj]; if (!L) return;
  const secs = (Date.now() - me.t0) / 1000;
  if (manual && (!SR || me.denied) && secs < Math.max(4, me.T.length * 1.1)) { alertMsg('Не торопись: прочитай вслух каждое слово, по слогам.'); return; }
  me.ok = true; srStop();
  const a = L.ans[L.i] || (L.ans[L.i] = { tries: 0, wrong: [] }); a.rd = 1; const h = me.hints + me.taps; if (h) a.rdH = h; if (h > Math.max(3, me.T.length / 3)) a.help = 1;
  L.srN = (L.srN || 0) + 1; L.srH = (L.srH || 0) + h; L.srS = (L.srS || 0) + Math.round(secs); if (manual) L.srM = (L.srM || 0) + 1;
  save(); render(); }

/* ---------- 2. «Не понимаю» стоит баллов ---------- */
function srDl(kid, L){ if (!srOn(kid)) return '🤔 Не понимаю'; const left = SR_FREE - (L.dn || 0); return left > 0 ? `🤔 Не понимаю <span class="dnc">(бесплатно ещё ${left})</span>` : '🤔 Не понимаю <span class="dnc">(минус 1 балл)</span>'; }
function srDunno(kid, L, task){ L.dn = (L.dn || 0) + 1; if (task && srOn(kid)) { const a = L.ans[L.i] || (L.ans[L.i] = { tries: 0, wrong: [] }); a.help = 1; a.rd = 1; srStop(); } }
function srPts(kid, subj, L, T, pts){ if (!srOn(kid) || subj === 'read') return pts;
  const ok = L.ans.filter(a => a && a.ok && a.tries === 1), self = ok.filter(a => !a.help).length, helped = ok.length - self;
  L.selfN = self; L.helpN2 = helped;
  if (ok.length && helped) pts = Math.round(pts * (self * 2 + helped) / (ok.length * 2));
  const pen = Math.max(0, (L.dn || 0) - SR_FREE); if (pen) { L.dnCut = Math.min(pen, pts); pts = Math.max(0, pts - pen); }
  try { ev(kid, 'читал задания сам', { subj: subjName(kid, subj, cur.ds), text: `прочитал вслух ${L.srN || 0} из ${T.length}, подсказано слов ${L.srH || 0}, «Не понимаю» ${L.dn || 0}, сам без подсказки верно ${self}, с подсказкой ${helped}` }); } catch (e) {}
  return pts; }
function srResult(kid, L){ if (!srOn(kid) || L.selfN == null) return ''; let h = `<p class="hint">Сам, без подсказки, верно: <b>${L.selfN}</b>${L.helpN2 ? ` · с подсказкой: ${L.helpN2} (за них баллы вдвое меньше)` : ' — баллы полные!'}</p>`;
  if (L.dnCut) h += `<p class="hint">«Не понимаю» нажато ${L.dn} раз: бесплатно только ${SR_FREE}, поэтому минус ${L.dnCut} ${U.pl(L.dnCut, 'балл', 'балла', 'баллов')}.</p>`; return h; }

/* ---------- Слова с картинками (свои иконки) ---------- */
const SYL_W = [
  ['кот','🐱'],['дом','🏠'],['мяч','⚽'],['гол','🥅'],['лев','🦁'],['кит','🐳'],['жук','🪲'],['сыр','🧀'],['лес','🌲'],['мёд','🍯'],['пёс','🐕'],['лёд','🧊'],['зуб','🦷'],['шар','🎈'],['ёж','🦔'],
  ['торт','🎂'],['слон','🐘'],['волк','🐺'],['мост','🌉'],['снег','❄️'],['ключ','🔑'],['лист','🍂'],['тигр','🐯'],['гриб','🍄'],['мышь','🐭'],['щит','🛡️'],['меч','🗡️'],['гусь','🪿'],
  ['ры-ба','🐟'],['ко-за','🐐'],['со-ва','🦉'],['ли-са','🦊'],['ут-ка','🦆'],['за-яц','🐰'],['жи-раф','🦒'],['пан-да','🐼'],['зеб-ра','🦓'],['лу-на','🌙'],['ро-за','🌹'],['руч-ка','🖊️'],['шап-ка','🧢'],['кни-га','📚'],['лам-па','💡'],['лод-ка','⛵'],['ку-бок','🏆'],['ме-даль','🏅'],['пти-ца','🐦'],['пче-ла','🐝'],['ёл-ка','🎄'],['гру-ша','🍐'],['виш-ня','🍒'],['по-езд','🚂'],['мед-ведь','🐻'],['ло-шадь','🐴'],['ба-нан','🍌'],['ар-буз','🍉'],['пин-гвин','🐧'],['дель-фин','🐬'],['ко-рабль','🚢'],['мор-ковь','🥕'],
  ['со-ба-ка','🐶'],['ма-ши-на','🚗'],['ра-ке-та','🚀'],['ко-ро-ва','🐄'],['я-бло-ко','🍎'],['ба-боч-ка','🦋'],['у-лит-ка','🐌'],['са-мо-лёт','✈️'],['ав-то-бус','🚌'],['кро-ко-дил','🐊'],['клуб-ни-ка','🍓'],['а-пель-син','🍊'],['ко-ро-на','👑'],
  ['че-ре-па-ха','🐢'],['ве-ло-си-пед','🚲'],['о-безь-я-на','🐒']
].map(([s, e]) => { const w = s.replace(/-/g, ''); return { w, s: s.split('-'), e, n: s.split('-').length, len: w.length }; });
const SYL_V = 'аоуыиэеёюя', SYL_V1 = 'аоуыи', SYL_C1 = 'мнлрсктпшвдз';
function sylPool(lv){ return SYL_W.filter(x => lv <= 1 ? x.n === 1 && x.len <= 3 : lv === 2 ? x.n === 1 : lv === 3 ? x.n === 2 : x.n >= 3); }
function sylPics(r, x){ const pool = SYL_W.filter(y => y.e !== x.e && y.w !== x.w), same = r.shuffle(pool.filter(y => y.w[0] === x.w[0] || Math.abs(y.len - x.len) <= 1)), rest = r.shuffle(pool);
  const out = [x]; for (const y of same.concat(rest)) { if (out.length >= 3) break; if (!out.some(z => z.e === y.e)) out.push(y); } return r.shuffle(out); }
function picBtn(x, attr, cls){ return `<button class="sypic ${cls || ''}" ${attr} aria-label="картинка"><span class="sye">${x.e}</span></button>`; }
const UPW = w => w.toUpperCase();

/* ---------- 3. Слоги: ежедневный блок ---------- */
const SYL_N = 20;
const SYL_HOW = { vow: 'Найди гласную букву. Гласные звуки можно петь: а-а-а, о-о-о.', first: 'Какой первый звук в этом слове? Назови картинку вслух и найди букву.', merge: 'Послушай слог и найди, как он пишется.', pic: 'Прочитай слово и найди картинку.', cnt: 'Сколько слогов в слове? Сколько гласных — столько и слогов.', build: 'Собери слово из слогов. Нажимай по порядку.', say: 'Прочитай слово вслух по слогам.' };
const SYL_MIX = { 1: ['vow', 'first', 'first', 'merge', 'merge', 'pic'], 2: ['first', 'merge', 'pic', 'pic', 'cnt', 'say'], 3: ['pic', 'pic', 'cnt', 'build', 'build', 'say'], 4: ['pic', 'pic', 'cnt', 'build', 'build', 'say', 'say'] };
function sylK(kid){ const K = S.kids[kid]; if (!K.syl) K.syl = { lv: 1, hist: [] }; const Y = K.syl; if (!Y.d || Y.d.ds !== cur.ds) Y.d = { ds: cur.ds, i: 0, res: [], t0: 0, done: false, pts: null, round: 0 }; return Y; }
function sylCard(kid, Y){ const d = Y.d, r = U.rng(U.h(kid + d.ds + 'syl' + d.round + ':' + d.i)); let lv = Y.lv; if (lv > 1 && r() < .3) lv = r.int(1, lv - 1); /* немного повторения прошлых уровней */
  let types = SYL_MIX[lv].slice(); if (!SR) types = types.filter(x => x !== 'say'); const type = r.pick(types);
  if (type === 'vow') { const v = r.pick(SYL_V1.split('')), cs = r.shuffle(SYL_C1.split('')).slice(0, 3); return { type, opts: r.shuffle([v].concat(cs)).map(UPW), a: UPW(v) }; }
  if (type === 'first') { const x = r.pick(SYL_W.filter(y => !'еёюяэ'.includes(y.w[0]) && y.n <= 2)), f = x.w[0], o = r.shuffle(SYL_C1.split('').concat(SYL_V1.split('')).filter(c => c !== f)).slice(0, 2); return { type, x, opts: r.shuffle([f].concat(o)).map(UPW), a: UPW(f) }; }
  if (type === 'merge') { const c = r.pick(SYL_C1.split('')), v = r.pick(SYL_V1.split('')), v2 = r.pick(SYL_V1.split('').filter(z => z !== v)), c2 = r.pick(SYL_C1.split('').filter(z => z !== c)); const a = c + v; return { type, syl: a, opts: r.shuffle([a, c + v2, r() < .5 ? v + c : c2 + v]).map(UPW), a: UPW(a) }; }
  const pool = sylPool(lv), x = r.pick(pool);
  if (type === 'pic') return { type, x, opts: sylPics(r, x).map(y => y.w), a: x.w };
  if (type === 'cnt') { const mx = lv >= 4 ? 4 : 3, o = []; for (let k = 1; k <= mx; k++) o.push(String(k)); return { type, x, opts: o, a: String(x.n) }; }
  if (type === 'build') { if (x.n < 2) { const y = r.pick(SYL_W.filter(z => z.n >= 2 && z.n <= 3)); return { type, x: y, opts: r.shuffle(y.s.slice()), a: y.w }; } return { type, x, opts: r.shuffle(x.s.slice()), a: x.w }; }
  return { type: 'say', x, a: x.w }; }
function sylTile(kid, D){ if (!srOn(kid) || cur.ds !== U.today()) return ''; const Y = sylK(kid), d = Y.d, st = d.done ? 'done' : d.i ? 'go' : 'new';
  return `<button class="tile syl ${st}" data-act="always" data-id="slogi"><span class="ico">🔤</span><span class="tt"><span class="sn">Слоги — 10 минут</span><span class="ut">${d.done ? `Сделано${d.pts ? ': +' + d.pts + ' ' + U.pl(d.pts, 'балл', 'балла', 'баллов') : ''}. Можно ещё — для тренировки` : d.i ? `Карточка ${d.i + 1} из ${SYL_N}` : 'Каждый день: звуки, слоги, слова. До +5 баллов'}</span></span></button>`; }
function sylView(kid){ const Y = sylK(kid), d = Y.d;
  const head = `<section class="hello"><p class="eyebrow">Каждый день</p><h1>🔤 Слоги</h1><p class="hint">Уровень ${Y.lv} из 4: ${['', 'звуки и слоги', 'короткие слова', 'слова из двух слогов', 'длинные слова'][Y.lv]}.</p></section>`;
  if (d.i >= SYL_N) return head + sylEnd(kid, Y);
  if (!d.t0) { d.t0 = Date.now(); save(); }
  const c = cur.syc && cur.syc.key === d.ds + d.round + ':' + d.i ? cur.syc : (cur.syc = Object.assign(sylCard(kid, Y), { key: d.ds + d.round + ':' + d.i, got: [], wrong: [], fin: false, ok: null }));
  const dots = `<div class="dots">${Array.from({ length: SYL_N }, (_, j) => { const x = d.res[j]; return `<span class="dot ${x == null ? (j === d.i ? 'now' : '') : x ? 'ok' : 'bad'}">${j + 1}</span>`; }).join('')}</div>`;
  let body = '';
  const optB = (o, extra) => { const cls = c.fin && o === c.a ? 'right' : c.wrong.includes(o) ? 'wrong' : ''; return `<button class="opt syo ${cls}" data-syl="ans" data-v="${U.esc(o)}" ${c.fin || c.wrong.includes(o) ? 'disabled' : ''}>${extra || U.esc(o)}</button>`; };
  if (c.type === 'vow') body = `<div class="opts syopts">${c.opts.map(o => optB(o)).join('')}</div>`;
  else if (c.type === 'first') body = `<div class="sybig">${picBtn(c.x, 'disabled', 'solo')}</div><div class="opts syopts">${c.opts.map(o => optB(o)).join('')}</div>`;
  else if (c.type === 'merge') body = `<p class="center"><button class="btn ghost" data-syl="hear">🔊 Послушать слог</button></p><div class="opts syopts">${c.opts.map(o => optB(o)).join('')}</div>`;
  else if (c.type === 'pic') body = `<div class="syword">${UPW(c.x.w)}</div><div class="sypics">${c.opts.map(w => { const y = SYL_W.find(z => z.w === w); const cls = c.fin && w === c.a ? 'right' : c.wrong.includes(w) ? 'wrong' : ''; return picBtn(y, `data-syl="ans" data-v="${U.esc(w)}" ${c.fin || c.wrong.includes(w) ? 'disabled' : ''}`, cls); }).join('')}</div>`;
  else if (c.type === 'cnt') body = `<div class="sybig">${picBtn(c.x, 'disabled', 'solo')}</div><div class="syword">${UPW(c.x.w)}</div><div class="opts syopts">${c.opts.map(o => optB(o)).join('')}</div>`;
  else if (c.type === 'build') body = `<div class="sybig">${picBtn(c.x, 'disabled', 'solo')}</div><div class="syword sybuilt">${c.got.length ? UPW(c.got.join('-')) : '&nbsp;'}</div><div class="opts syopts">${c.opts.map((o, k) => `<button class="opt syo ${c.used && c.used[k] ? 'right' : ''}" data-syl="part" data-k="${k}" ${c.fin || (c.used && c.used[k]) ? 'disabled' : ''}>${UPW(o)}</button>`).join('')}</div>`;
  else if (c.type === 'say') body = `<div class="syword">${UPW(c.x.s.join('-'))}</div>${c.fin ? '' : `<p class="center" id="sysay">${c.live ? '<span class="rstat">Слушаю…</span>' : '<button class="btn big mic" data-syl="mic">🎤 Читаю вслух</button>'}</p>${c.late ? '<p class="center"><button class="link" data-syl="giveup">Не получается — послушать</button></p>' : ''}`}`;
  let fb = '';
  if (c.fin) fb = c.ok ? `<div class="fb ok"><b>Верно!</b> ${c.x ? UPW(c.x.s.join('-')) : ''}</div>` : `<div class="fb bad"><b>Правильно: ${c.x ? UPW(c.x.s.join('-')) : U.esc(c.a)}</b>${c.type === 'cnt' ? ` — гласных ${c.x.n}, значит слогов ${c.x.n}.` : ''}</div>`;
  else if (c.wrong.length) fb = '<div class="fb try">Не совсем. Попробуй ещё.</div>';
  return head + dots + `<article class="card task sycard"><p class="syhow">${SYL_HOW[c.type]} <button class="link" data-syl="how" aria-label="Послушать задание">🔊</button></p>${body}${fb}</article>${c.fin ? `<button class="btn big" data-syl="next">${d.i + 1 < SYL_N ? 'Дальше' : 'Закончить'}</button>` : ''}`; }
function sylFin(ok){ const kid = cur.kid, Y = sylK(kid), c = cur.syc; if (!c || c.fin) return; c.fin = true; c.ok = ok; Y.d.res[Y.d.i] = ok ? 1 : 0; save(); render(); if (c.x) setTimeout(() => { try { say(c.x.w, 'ru-RU'); } catch (e) {} }, 150); }
function sylEnd(kid, Y){ const d = Y.d, okN = d.res.filter(Boolean).length, acc = okN / SYL_N;
  if (!d.done) { d.done = true; const mins = Math.max(1, Math.round((Date.now() - (d.t0 || Date.now())) / 60000)); const lv0 = Y.lv;
    if (acc >= .85 && Y.lv < 4) Y.lv++; else if (acc < .5 && Y.lv > 1) Y.lv--;
    if (d.round === 0) { const p = acc >= .85 ? 5 : acc >= .65 ? 3 : 1; d.pts = piggyAdd(S.kids[kid], p); }
    Y.hist.push({ d: d.ds, ok: okN, n: SYL_N, lv: lv0, m: mins }); if (Y.hist.length > 60) Y.hist.shift();
    ev(kid, 'слоги', { subj: 'Слоги', unit: 'уровень ' + lv0, score: okN + '/' + SYL_N, secs: mins * 60, text: (d.round ? 'тренировка' : '+' + (d.pts || 0) + ' баллов') + (Y.lv !== lv0 ? ', новый уровень ' + Y.lv : '') }); save(); }
  return `<article class="card result"><div class="bigmark m${grade(acc)}">${grade(acc)}</div><p>Верно с первого раза: <b>${okN} из ${SYL_N}</b></p>${d.round === 0 ? `<p class="earn">Баллы: ${coinsHtml(d.pts || 0)}</p>` : ''}<p>${acc >= .85 ? (Y.lv === 4 ? 'Отлично! Ты читаешь длинные слова.' : 'Отлично! Завтра — уровень ' + Y.lv + '.') : acc < .5 ? 'Завтра потренируемся на уровне попроще.' : 'Хорошо! Завтра закрепим.'}</p></article><button class="btn ghost" data-syl="again">Ещё 20 карточек (без баллов)</button><button class="btn big" data-act="home">К урокам</button>`; }
let SYM = null;
function sylMic(){ const c = cur.syc; if (!c || !SR) return; try { SYM && SYM.stop(); } catch (e) {} const rec = new SR(); rec.lang = 'ru-RU'; rec.continuous = true; rec.interimResults = true; SYM = rec; c.live = true; let all = '';
  const target = normW(c.x.w), match = s => s.split(/\s+/).map(normW).filter(Boolean).some(w => w === target || alignSc(target, w) > 0) || normW(s.replace(/[-\s]/g, '')).indexOf(target) >= 0;
  rec.onresult = e => { if (cur.syc !== c) { try { rec.stop(); } catch (x) {} return; } let s = ''; for (let i = 0; i < e.results.length; i++) s += ' ' + e.results[i][0].transcript; all = s; if (match(s)) { c.live = false; try { rec.stop(); } catch (x) {} sylFin(!c.heard); } };
  rec.onerror = () => {}; rec.onend = () => { if (cur.syc === c && c.live && document.getElementById('sysay')) setTimeout(() => { try { rec.start(); } catch (x) {} }, 120); };
  try { rec.start(); } catch (e) {}
  setTimeout(() => { if (cur.syc === c && !c.fin) { c.late = true; render(); } }, 10000);
  render(); }
(window.ALWAYS || (window.ALWAYS = [])).push({ id: 'slogi', order: -1, nogate: true,
  tile: function(){ return ''; }, /* плитка — среди уроков дня (sylTile) */
  open: function(){ cur.syc = null; },
  view: function(kid){ return kid ? sylView(kid) : ''; } });

/* ---------- 4. Игры открываются прочитанным словом ---------- */
const RL_GATE = { zag: 'Загадки', pz: 'Головоломки', zad: 'Задачи на смекалку', chess: 'Шахматы', code: 'Программирование' };
function rlReset(id){ cur.rlOk = cur.rlOk || {}; delete cur.rlOk[id]; cur.rlW = null; }
function rlGate(kid, F){ if (!srOn(kid) || !F || !RL_GATE[F.id] || (cur.rlOk && cur.rlOk[F.id])) return '';
  const Y = sylK(kid), lv = Math.max(2, Y.lv);
  if (!cur.rlW || cur.rlW.id !== F.id) { const r = U.rng(Date.now() % 100000), x = r.pick(sylPool(Math.min(4, lv))); cur.rlW = { id: F.id, x, opts: sylPics(r, x), wrong: [] }; }
  const g = cur.rlW;
  return `<section class="hello"><p class="eyebrow">Ключ к игре</p><h1>${RL_GATE[F.id]}</h1><p>Чтобы открыть, прочитай слово и найди его картинку.</p></section><article class="card task sycard"><div class="syword">${UPW(g.x.w)}</div><div class="sypics">${g.opts.map(y => picBtn(y, `data-rl="${U.esc(y.w)}" ${g.wrong.includes(y.w) ? 'disabled' : ''}`, g.wrong.includes(y.w) ? 'wrong' : '')).join('')}</div>${g.wrong.length ? '<div class="fb try">Не та картинка. Прочитай ещё раз, по слогам.</div>' : ''}</article>`; }

/* ---------- Кнопки ---------- */
document.addEventListener('click', e => {
  const s = e.target.closest('[data-sr]'), y = e.target.closest('[data-syl]'), g = e.target.closest('[data-rl]');
  if (s) { e.preventDefault(); const a = s.dataset.sr; if (a === 'start') srStart(); else if (a === 'done') srOk(true); else if (a === 'word') srHint(+s.dataset.k, true); return; }
  if (g) { e.preventDefault(); const w = g.dataset.rl, G = cur.rlW; if (!G) return; if (w === G.x.w) { cur.rlOk = cur.rlOk || {}; cur.rlOk[G.id] = 1; try { ev(cur.kid, 'ключ к игре', { subj: RL_GATE[G.id], text: 'прочитал «' + G.x.w + '»' + (G.wrong.length ? ' с ' + (G.wrong.length + 1) + '-й попытки' : '') }); } catch (x) {} alertMsg('Верно! Открываю.'); render(); } else { G.wrong.push(w); render(); } return; }
  if (!y) return; e.preventDefault(); const a = y.dataset.syl, kid = cur.kid, c = cur.syc, Y = kid && sylK(kid);
  if (a === 'how' && c) say(SYL_HOW[c.type], 'ru-RU');
  else if (a === 'hear' && c) { c.heard = 1; say(c.syl, 'ru-RU'); }
  else if (a === 'ans' && c && !c.fin) { const v = y.dataset.v; if (v === c.a) sylFin(!c.wrong.length); else { c.wrong.push(v); if (c.opts.length - c.wrong.length <= 1) sylFin(false); else render(); } }
  else if (a === 'part' && c && !c.fin) { const k = +y.dataset.k, need = c.x.s[c.got.length]; if (c.opts[k] === need) { c.used = c.used || {}; c.used[k] = 1; c.got.push(need); if (c.got.length === c.x.s.length) sylFin(!c.wrong.length); else render(); } else { c.wrong.push('x' + c.wrong.length); render(); } }
  else if (a === 'mic' && c) sylMic();
  else if (a === 'giveup' && c) { c.live = false; try { SYM && SYM.stop(); } catch (x) {} sylFin(false); }
  else if (a === 'next' && Y) { try { SYM && SYM.stop(); } catch (x) {} Y.d.i++; cur.syc = null; save(); render(); window.scrollTo(0, 0); const c2 = cur.syc; if (c2 && c2.type === 'merge') say(c2.syl, 'ru-RU'); }
  else if (a === 'again' && Y) { const r0 = (Y.d.round || 0) + 1; Y.d = { ds: cur.ds, i: 0, res: [], t0: 0, done: false, pts: null, round: r0 }; cur.syc = null; save(); render(); window.scrollTo(0, 0); }
});
