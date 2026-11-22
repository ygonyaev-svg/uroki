/* ===== Читальня: дополнительный заработок — только чтением (правило Юры, 22.11) =====
   Когда уроки дня сделаны, заработать ещё можно только здесь: блок усидчивого чтения 15, 20 или 30 минут подряд.
   Баллы — только за целый блок. Время засчитывается только за настоящее чтение:
   — вслух (начинающий читатель, если айпад слушает): минута идёт, пока распознавание видит, что ребёнок продвигается по тексту
     (пауза дольше LIB_GAP секунд не считается); страница засчитана, когда прочитано 90% слов;
   — про себя: на страницу есть минимальное время (не пролистать) и максимум (не «пересидеть»), а каждые две страницы —
     «Найди ошибку» по только что прочитанному. Не нашёл — эти страницы не засчитаны.
   Загадки, головоломки, задачи, шахматы и программирование теперь без баллов (играем для ума). Викторина ГП и «Мои книги» — это чтение, они остаются.
   Баллы Читальни идут в копилку сверх дневного потолка DAY_CAP, но не больше LIB_DAY_MIN минут чтения в день. */
var LIB_BLOCKS = [[15, 10], [20, 15], [30, 25]], LIB_DAY_MIN = 45, LIB_GAP = 30;
var LIB_NOTE = 'Здесь играем для ума, без баллов. Заработать ещё можно только чтением — в Читальне.';
var LR = null; /* живое распознавание страницы */
function libK(kid){ var K = S.kids[kid], t = U.today(); if (!K.lib) K.lib = { i: null, s: 0 }; if (K.lib.d !== t) { K.lib.d = t; K.lib.min = 0; K.lib.pts = 0; K.lib.blk = null; K.lib.msg = ''; } return K.lib; }
function libOpen(kid){ if (TEST) return true; var t = U.today(), D = S.kids[kid].days[t]; return !!(D && D.bonus) || dayDone(kid, t); }
function libAloud(kid){ var K = S.kids[kid]; return !!SR && (K.readBest || KIDS[kid].norm || 100) < 80; }
function libList(kid){ return (KIDS[kid].read || []).filter(function(t){ return t && t.text; }); }
function libSents(text){ return (String(text).replace(/\s+/g, ' ').match(/[^.!?…]+[.!?…]+[»"]?|[^.!?…]+$/g) || []).map(function(s){ return s.trim(); }).filter(Boolean); }
function libPageW(kid){ return libAloud(kid) ? (T(kid) === 'yarik' ? 30 : 60) : 130; }
function libCurText(kid){ var B = libK(kid), list = libList(kid); if (!list.length) return null;
  if (B.i == null) { var days = Object.keys(S.kids[kid].days || {}).sort().reverse(), tid = null, k = -1; for (var d = 0; d < days.length && !tid; d++) { var Dd = S.kids[kid].days[days[d]]; tid = Dd && Dd.les && Dd.les.read && Dd.les.read.tid; } for (var j = 0; j < list.length; j++) if (list[j].id === tid) k = j; B.i = k + 1; B.s = 0; }
  var t = list[B.i % list.length], S0 = libSents(t.text); if (B.s >= S0.length) { B.i++; B.s = 0; t = list[B.i % list.length]; S0 = libSents(t.text); } return { t: t, S: S0 }; }
function libPage(kid){ var c = libCurText(kid); if (!c) return null; var B = libK(kid), n = libPageW(kid), out = [], w = 0, k = B.s;
  while (k < c.S.length && (w < n || !out.length)) { var x = c.S[k].split(' ').length; if (out.length && w + x > n * 1.35) break; out.push(c.S[k]); w += x; k++; }
  return { t: c.t, sents: out, from: B.s, to: k, words: w, text: out.join(' '), last: k >= c.S.length }; }
function libWords(s){ return s.split(/\s+/).filter(Boolean); }
function libStop(){ if (!LR) return; LR.active = false; try { LR.rec && LR.rec.stop(); } catch (e) {} LR = null; }

/* --- карточка на главной --- */
function libCard(kid){ if (!kid) return ''; var B = libK(kid), left = LIB_DAY_MIN - (B.min || 0);
  if (!libOpen(kid)) return '<section class="card libc off"><h2>' + icon('books') + ' Читальня</h2><p>Откроется, когда сделаешь все уроки дня. Там можно заработать ещё — но только чтением: 15, 20 или 30 минут подряд.</p></section>';
  if (left < LIB_BLOCKS[0][0] && !B.blk) return '<section class="card libc"><h2>' + icon('books') + ' Читальня</h2><p>На сегодня в Читальне всё: ты читал' + (T(kid) === 'anya' ? 'а' : '') + ' ' + (B.min || 0) + ' минут и заработал' + (T(kid) === 'anya' ? 'а' : '') + ' <b>+' + (B.pts || 0) + '</b>. Завтра можно снова.</p></section>';
  return '<section class="card libc on"><h2>' + icon('books') + ' Читальня — заработать ещё</h2><p>' + (B.blk ? 'Блок чтения начат: ' + Math.floor((B.blk.sec || 0) / 60) + ' из ' + B.blk.m + ' минут.' : 'Хочешь ещё баллов? Почитай 15, 20 или 30 минут подряд. Баллы — только за целый блок.') + (B.pts ? ' Сегодня уже +' + B.pts + '.' : '') + '</p><button class="btn big" data-act="libgo">' + (B.blk ? 'Продолжить чтение' : 'Открыть Читальню') + '</button></section>'; }

/* --- экран --- */
function vLib(){ var kid = cur.kid, K = S.kids[kid], B = libK(kid);
  var head = '<main class="wrap ' + LK(kid) + '"><header class="bar"><button class="link" data-act="libhome">← К урокам</button><span class="coins">' + coinsHtml(K.coins) + '</span></header><section class="lesson lib"><p class="eyebrow">Читальня</p>';
  if (!libOpen(kid)) return head + '<h1>Сначала уроки</h1><p>Читальня откроется, когда сделаешь все уроки дня.</p></section></main>';
  var b = B.blk;
  if (!b) { var left = LIB_DAY_MIN - (B.min || 0);
    return head + '<h1>Заработай чтением</h1>' + (B.msg ? '<div class="fb ok"><b>' + U.esc(B.msg) + '</b></div>' : '') +
      '<p>Выбери, сколько будешь читать. Время идёт, только когда ты по-настоящему читаешь' + (libAloud(kid) ? ' вслух — я слушаю.' : ': не пролистать, а после каждых двух страниц — «Найди ошибку».') + ' Баллы — только за целый блок.</p>' +
      '<div class="libblk">' + LIB_BLOCKS.map(function(x){ var ok = x[0] <= left; return '<button class="btn big ' + (ok ? '' : 'ghost') + '" data-act="libstart" data-m="' + x[0] + '" ' + (ok ? '' : 'disabled') + '>' + x[0] + ' минут — +' + x[1] + '</button>'; }).join('') + '</div>' +
      '<p class="hint">Сегодня прочитано в Читальне: ' + (B.min || 0) + ' из ' + LIB_DAY_MIN + ' минут' + (B.pts ? ', заработано +' + B.pts : '') + '.</p></section></main>'; }
  var pg = libPage(kid); if (!pg) return head + '<p>Нет текстов.</p></section></main>';
  var done = Math.min(b.m * 60, b.sec || 0), pct = Math.round(done / (b.m * 60) * 100);
  var bar = '<div class="libbar"><div class="prog"><i style="width:' + pct + '%"></i></div><span>' + Math.floor(done / 60) + ' мин из ' + b.m + ' · +' + b.pts + ' в конце</span></div>';
  var title = '<h1>' + U.esc(pg.t.title || '') + '</h1>' + (pg.t.author ? '<p class="author">' + U.esc(pg.t.author) + '</p>' : '');
  if (b.chk) return head + title + bar + libChkView(kid, b) + '</section></main>';
  if (b.aloud) { var live = LR && LR.active;
    return head + title + bar + '<article class="card reading"><div class="text" id="ltext"><p>' + libWords(pg.text).map(function(w, i){ var st = LR && LR.st ? LR.st[i] : 0; return '<span class="w ' + (st === 1 ? 'r1' : st === 2 ? 'r2' : LR && i === LR.p ? 'rc' : '') + '" data-i="' + i + '">' + U.esc(w) + '</span>'; }).join(' ') + '</p></div></article>' +
      '<div class="readbar">' + (live ? '<button class="btn ghost" data-act="libpause">' + icon('pause') + ' Пауза</button><span id="lstat" class="rstat">Слушаю… читай вслух</span>' : '<button class="btn big mic" data-act="libmic">' + icon('mic') + ' ' + (b.pages ? 'Читать дальше вслух' : 'Читать вслух') + '</button>') + '</div>' +
      '<p class="hint">Страница засчитается, когда прочитаешь её вслух. Если молчать — время не идёт.</p></section></main>'; }
  if (!b.t0) { b.t0 = Date.now(); save(); }
  return head + title + bar + '<article class="card reading"><div class="text">' + pg.sents.map(function(s){ return U.esc(s); }).join(' ') + '</div></article>' +
    '<div class="readbar"><button class="btn big" data-act="libnext">Прочитал' + (T(kid) === 'anya' ? 'а' : '') + ' страницу</button></div><p class="hint">Читай внимательно: после каждых двух страниц — «Найди ошибку» по прочитанному.</p></section></main>'; }

/* --- «Найди ошибку» по двум страницам --- */
function libChkView(kid, b){ var q = b.chk, girl = T(kid) === 'anya';
  var sent = function(s, si){ return s.split(' ').map(function(w, wi){ var bad = si === q.k && wi === q.wi, tried = (q.wrong || []).some(function(x){ return x[0] === si && x[1] === wi; });
    var cls = q.fin && bad ? (q.ok ? 'right' : 'miss') : tried ? 'wrong' : ''; return '<button class="spw ' + cls + '" data-act="libspw" data-s="' + si + '" data-w="' + wi + '" ' + (q.fin || tried ? 'disabled' : '') + '>' + U.esc(w) + '</button>'; }).join(' '); };
  return '<article class="card task spot"><h2>' + icon('search') + ' Найди ошибку</h2><p class="hint">Это из страниц, которые ты сейчас ' + (girl ? 'прочитала' : 'прочитал') + '. В одном предложении я поменял одно слово. Найди его. Две попытки.</p><div class="spt">' + q.sents.map(function(s, si){ return '<p>' + sent(s, si) + '</p>'; }).join('') + '</div>' +
    (q.fin ? (q.ok ? '<div class="fb ok"><b>Верно!</b> В тексте было «' + U.esc(q.was.toLowerCase()) + '». Страницы засчитаны.</div>' : '<div class="fb bad"><b>Ошибка была здесь:</b> в тексте «' + U.esc(q.was.toLowerCase()) + '». Эти две страницы не засчитаны — читай внимательнее.</div>') : (q.wrong && q.wrong.length ? '<div class="fb try">Это слово верное. Попробуй ещё раз.</div>' : '')) + '</article>' +
    (q.fin ? '<button class="btn big" data-act="libchkok">Дальше</button>' : ''); }

/* --- распознавание вслух --- */
function libMic(kid){ var pg = libPage(kid); if (!pg || !SR) return; libStop();
  var T0 = libWords(pg.text).map(normW), R0 = LR = { active: true, T: T0, st: new Array(T0.length).fill(0), p: 0, base: '', cur: '', from: 0, last: Date.now(), kid: kid };
  var rec = new SR(); rec.lang = 'ru-RU'; rec.continuous = true; rec.interimResults = true; R0.rec = rec;
  rec.onresult = function(e){ if (LR !== R0) return; var s = ''; for (var i = R0.from; i < e.results.length; i++) s += ' ' + e.results[i][0].transcript; R0.cur = s; R0.n = e.results.length; libUpd(R0); };
  rec.onerror = function(e){ if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { R0.denied = true; libStop(); var b = libK(kid).blk; if (b) { b.aloud = false; save(); } render(); } };
  rec.onend = function(){ R0.base += ' ' + R0.cur; R0.cur = ''; R0.from = 0; if (LR === R0 && R0.active) setTimeout(function(){ try { rec.start(); } catch (x) {} }, 120); };
  try { rec.start(); } catch (x) {}
  render(); }
function libUpd(R0){ var kid = R0.kid, b = libK(kid).blk; if (!b) return;
  var spoken = (R0.base + ' ' + R0.cur).split(/\s+/).map(normW).filter(Boolean), r = align(R0.T, spoken), now = Date.now();
  if (r.p > R0.p) { b.sec = (b.sec || 0) + Math.min((now - R0.last) / 1000, LIB_GAP); b.words = (b.words || 0) + (r.p - R0.p); R0.last = now; }
  else if (now - R0.last > LIB_GAP * 1000) R0.last = now - LIB_GAP * 1000;
  R0.st = r.st; R0.p = r.p;
  var els = document.querySelectorAll('#ltext .w'); for (var i = 0; i < els.length; i++) { var k = +els[i].getAttribute('data-i'); els[i].className = 'w ' + (r.st[k] === 1 ? 'r1' : r.st[k] === 2 ? 'r2' : k === r.p ? 'rc' : ''); }
  var c = document.querySelector('#ltext .w.rc'); if (c && c.scrollIntoView) c.scrollIntoView({ block: 'center', behavior: 'smooth' });
  if (r.p >= Math.ceil(R0.T.length * .9)) { /* страница прочитана — следующая, микрофон не выключаем */
    var pg = libPage(kid); libK(kid).s = pg.to; b.pages = (b.pages || 0) + 1; save();
    if (libFinish(kid)) return;
    var np = libPage(kid); R0.T = libWords(np.text).map(normW); R0.st = new Array(R0.T.length).fill(0); R0.p = 0; R0.base = ''; R0.cur = ''; R0.from = R0.n || 0; render(); return; }
  if (libFinish(kid)) return;
  var bar = document.querySelector('.libbar span'), pr = document.querySelector('.libbar i'); if (bar) bar.textContent = Math.floor(Math.min(b.sec, b.m * 60) / 60) + ' мин из ' + b.m + ' · +' + b.pts + ' в конце'; if (pr) pr.style.width = Math.round(Math.min(1, b.sec / (b.m * 60)) * 100) + '%';
  if (Math.random() < .1) save(); }

/* --- конец блока --- */
function libFinish(kid){ var K = S.kids[kid], B = libK(kid), b = B.blk; if (!b || (b.sec || 0) < b.m * 60) return false;
  libStop(); var pts = b.pts; K.piggy = (K.piggy || 0) + pts; if (!K.piggyWeek) K.piggyWeek = weekStart(U.today());
  B.min = (B.min || 0) + b.m; B.pts = (B.pts || 0) + pts; var pg = libPage(kid), wpm = b.words && b.aloud ? Math.round(b.words / (b.sec / 60)) : '';
  K.texts = K.texts || 0;
  ev(kid, 'читальня', { subj: 'Чтение', unit: (pg && pg.t.title) || '', score: b.m + ' мин', wpm: wpm, text: (b.aloud ? 'вслух' : 'про себя') + ', страниц ' + (b.pages || 0) + (b.miss ? ', не засчитано ' + b.miss : '') + ', +' + pts + ' баллов', coins: K.coins });
  B.msg = 'Блок ' + b.m + ' минут прочитан! +' + pts + ' в копилку.'; B.blk = null; save(); render(); window.scrollTo(0, 0); return true; }

function libAct(act, b){
  if (act === 'libgo') { go('lib'); window.scrollTo(0, 0); return true; }
  if (cur.view !== 'lib' && act.indexOf('lib') !== 0) return false;
  var kid = cur.kid; if (!kid) return false; var B = libK(kid), blk = B.blk;
  switch (act) {
    case 'libhome': libStop(); if (blk) { blk.t0 = 0; save(); } go('home'); return true;
    case 'libstart': { var m = +b.getAttribute('data-m'), x = LIB_BLOCKS.filter(function(y){ return y[0] === m; })[0]; if (!x || !libOpen(kid) || (B.min || 0) + m > LIB_DAY_MIN) return true;
      B.msg = ''; B.blk = { m: m, pts: x[1], sec: 0, words: 0, pages: 0, aloud: libAloud(kid), pend: 0, pn: 0, miss: 0 }; ev(kid, 'читальня начата', { subj: 'Чтение', score: m + ' мин' }); save(); render(); window.scrollTo(0, 0); if (B.blk.aloud) libMic(kid); return true; }
    case 'libmic': libMic(kid); return true;
    case 'libpause': libStop(); save(); render(); return true;
    case 'libnext': { if (!blk || blk.chk) return true; var pg = libPage(kid), el = (Date.now() - (blk.t0 || Date.now())) / 1000, norm = KIDS[kid].norm || 100;
      var minS = pg.words / (norm * 2) * 60, maxS = pg.words / (norm * .5) * 60;
      if (el < minS) { alertMsg('Слишком быстро. Прочитай страницу внимательно, ещё примерно ' + Math.max(5, Math.ceil(minS - el)) + ' сек.'); return true; }
      blk.pend = (blk.pend || 0) + Math.min(el, maxS); blk.pn = (blk.pn || 0) + 1; blk.ptext = (blk.ptext || '') + ' ' + pg.text; B.s = pg.to; blk.pages = (blk.pages || 0) + 1; blk.t0 = 0;
      if (blk.pn >= 2) { var q = spotTask(kid, { text: blk.ptext }, Date.now() % 100000); if (q) { q.wrong = []; blk.chk = q; } else { blk.sec += blk.pend; blk.pend = 0; blk.pn = 0; blk.ptext = ''; } }
      save(); if (!blk.chk && libFinish(kid)) return true; render(); window.scrollTo(0, 0); return true; }
    case 'libspw': { var q2 = blk && blk.chk; if (!q2 || q2.fin) return true; var si = +b.getAttribute('data-s'), wi = +b.getAttribute('data-w'), ok = si === q2.k && wi === q2.wi; q2.tries = (q2.tries || 0) + 1;
      if (ok || q2.tries >= 2) { q2.fin = true; q2.ok = ok; } else q2.wrong.push([si, wi]); save(); render(); return true; }
    case 'libchkok': { if (!blk || !blk.chk) return true; if (blk.chk.ok) blk.sec += blk.pend; else blk.miss = (blk.miss || 0) + blk.pn; blk.pend = 0; blk.pn = 0; blk.ptext = ''; blk.chk = null; save(); if (libFinish(kid)) return true; render(); window.scrollTo(0, 0); return true; }
  }
  return false; }
