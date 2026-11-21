/* ===== Мои книги: бумажные книги из дома =====
   Ребёнок фотографирует обложку, оборот титульного листа (издательство, год, тираж, ISBN), заднюю обложку со штрихкодом, по желанию оглавление; для незнакомых книг — страницы главы → фото уходят в скрипт таблицы → папка «Уроки — фото книг» на Диске
   и строка в листе «Фото книг». Вечером Claude смотрит фото, узнаёт книгу и присылает задания строкой в «Указания»:
   тип «книга», значение — JSON { book, title, author, msg, tasks:[{ id, title, read, min, qs, kw, snap }] }.
   qs: ["вопрос","верно","неверно1","неверно2"] — выбор; { q, a, alt:[...] } — ответ словом.
   Чтение — по бумаге, вне экрана: таймер идёт, даже если айпад отложили. До +10 баллов в день за книги. */
var BOOK_PTS = 10;
var BK_UPQ = [], BK_SENDING = false, BK_SEQ = 0;
function bkK(kid){ var K = S.kids[kid]; if (!K.books) K.books = []; return K.books; }
function bkFind(kid, id){ var a = bkK(kid); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
function bkProg(b, tid){ if (!b.prog) b.prog = {}; if (!b.prog[tid]) b.prog[tid] = { ph: 'intro', ans: [] }; return b.prog[tid]; }
function bkCurTask(b){ var t = b.tasks || []; for (var i = 0; i < t.length; i++) { var p = b.prog && b.prog[t[i].id]; if (!p || p.ph !== 'done') return t[i]; } return null; }
function bkMins(ms){ return Math.max(0, Math.floor(ms / 60000)); }

/* --- фото: сжать и отправить --- */
function bkPrep(file, max, q, cb){
  var url = null, done = false;
  function fin(x){ if (done) return; done = true; try { if (url && window.URL && URL.revokeObjectURL) URL.revokeObjectURL(url); } catch (e) {} cb(x); }
  var img = new Image();
  img.onload = function(){ try { var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, s = Math.min(1, max / Math.max(w, h)); var c = document.createElement('canvas'); c.width = Math.round(w * s); c.height = Math.round(h * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); fin(c.toDataURL('image/jpeg', q)); } catch (e) { fin(null); } };
  img.onerror = function(){ fin(null); };
  try { if (window.URL && URL.createObjectURL) { url = URL.createObjectURL(file); img.src = url; return; } } catch (e) {}
  var fr = new FileReader(); fr.onload = function(){ img.src = fr.result; }; fr.onerror = function(){ fin(null); }; fr.readAsDataURL(file);
}
function bkSend(kid, book, kind, task, note, data){
  BK_UPQ.push({ photo: { kid: KIDS[kid].name, book: book, kind: kind, task: task || '', note: note || '', n: ++BK_SEQ, data: data } });
  bkFlush();
}
function bkFlush(){
  if (BK_SENDING || !BK_UPQ.length || !S.cfg.sync) return;
  if (navigator.onLine === false) { setTimeout(bkFlush, 20000); return; }
  BK_SENDING = true; bkStatus();
  fetch(S.cfg.sync, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(BK_UPQ[0]) })
    .then(function(){ BK_UPQ.shift(); BK_SENDING = false; bkStatus(); bkFlush(); })
    .catch(function(){ BK_SENDING = false; bkStatus(); setTimeout(bkFlush, 20000); });
}
function bkStatus(){ var el = document.getElementById('bkup'); if (el) el.innerHTML = bkUpHtml(); }
function bkUpHtml(){ var n = BK_UPQ.length; return n ? '⏳ Отправляется ' + n + ' ' + U.pl(n, 'фото', 'фото', 'фото') + '… Не закрывай приложение.' : ''; }
function bkSnapBtn(kind, label, extra){ return '<label class="btn big bksnap">' + label + '<input type="file" accept="image/*" capture="environment" data-bkkind="' + kind + '"' + (extra || '') + ' style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0"></label>'; }
function bkSay(text){ return ' ' + sayGate('bk' + U.h(text), '<button class="link" data-act="bksay" data-t="' + U.esc(text) + '" title="Прочитать вслух">🔊</button>'); }

/* --- задания от Claude из листа «Указания» --- */
function bkApply(kid, row){
  var d; try { d = JSON.parse(String(row.value)); } catch (e) { return; }
  var id = d.book || row.subj; if (!id) return;
  var b = bkFind(kid, id);
  if (!b) { b = { id: id, title: '', added: U.today(), tasks: [], prog: {} }; bkK(kid).push(b); }
  if (d.title) b.title = d.title; if (d.author) b.author = d.author; if (d.msg) { b.msg = d.msg; b.msgSeen = false; }
  if (d.replace) b.tasks = [];
  (d.tasks || []).forEach(function(t){ if (!t || !t.id) return; var have = false; for (var i = 0; i < b.tasks.length; i++) if (b.tasks[i].id === t.id) { b.tasks[i] = t; have = true; } if (!have) b.tasks.push(t); });
  if (d.finished) b.finished = true;
  b.st = 'ready'; b.upd = U.today();
}

/* --- экраны --- */
function bkHomeCard(kid){
  var a = bkK(kid).filter(function(b){ return !b.hidden; }), ready = 0, wait = 0;
  a.forEach(function(b){ if (bkCurTask(b)) ready++; else if (!b.finished) wait++; });
  var news = a.some(function(b){ return b.msg && !b.msgSeen; });
  return '<section class="card bkhome"><h2>📚 Мои бумажные книги</h2><p>' + (T(kid) === 'yarik' ? 'Читай настоящую книжку! Сфотографируй книгу, которая есть дома, а Claude придумает к ней задания.' : 'Читай настоящие книги. Сфотографируй обложку, оборот титульного листа и штрихкод — Claude узнает издание и составит задания по главам.') +
    ' За задание по книге — до +' + BOOK_PTS + ' баллов в день.</p>' +
    (a.length ? '<p class="hint">' + (ready ? '✅ Есть задания: ' + ready + ' ' + U.pl(ready, 'книга', 'книги', 'книг') + '. ' : '') + (wait ? '⏳ Ждём задания: ' + wait + '. ' : '') + (news ? '✉ Есть сообщение по книге.' : '') + '</p>' : '') +
    '<button class="btn big" data-act="bkopen">' + (a.length ? 'Открыть мои книги' : '📷 Добавить первую книгу') + '</button></section>';
}
function bkHead(back){ return '<header class="bar"><button class="link" data-act="' + back + '">← Назад</button><span class="coins">' + coinsHtml(S.kids[cur.kid].coins) + '</span></header>'; }
function vBooks(){
  var kid = cur.kid, a = bkK(kid).filter(function(b){ return !b.hidden; });
  var list = a.map(function(b){ var t = bkCurTask(b), n = (b.tasks || []).length, dn = n - (b.tasks || []).filter(function(x){ var p = b.prog && b.prog[x.id]; return !p || p.ph !== 'done'; }).length;
    var st = b.finished && !t ? '🏁 Прочитана!' : t ? '✅ Задание: ' + U.esc(t.title || 'читать') : '⏳ Claude смотрит фото. Задания появятся завтра.';
    return '<button class="tile bk ' + (t ? 'go' : 'new') + '" data-act="bkbook" data-id="' + b.id + '"><span class="ico bkthumb">' + (b.thumb ? '<img src="' + b.thumb + '" alt="">' : '📖') + '</span><span class="tt"><span class="sn">' + U.esc(b.title || 'Новая книга') + (b.author ? ' <em>' + U.esc(b.author) + '</em>' : '') + '</span><span class="ut">' + st + (n ? ' · сделано ' + dn + ' из ' + n : '') + '</span></span>' + (b.msg && !b.msgSeen ? '<span class="state">✉</span>' : '') + '</button>'; }).join('');
  return '<main class="wrap ' + kid + '">' + bkHead('home') + '<section class="hello"><h1>📚 Мои книги</h1><p>Книги, которые ты читаешь на бумаге. Айпад нужен только чтобы сфотографировать и ответить на вопросы.</p></section>' +
    '<p id="bkup" class="hint">' + bkUpHtml() + '</p>' +
    (list ? '<section class="tiles">' + list + '</section>' : '<div class="card"><p>Пока книг нет. Найди дома книгу, которую хочешь прочитать, и сфотографируй её.</p></div>') +
    '<button class="btn big ghost" data-act="bkadd">📷 Добавить книгу</button></main>';
}
/* Наглядные подсказки: что фотографировать (пример — Л. Н. Толстой «Рассказы для детей»; выходные данные условные) */
var BK_ARR = '<defs><marker id="bka" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#e0322b"/></marker></defs>';
function bkArrow(x1, y1, x2, y2, label, lx, ly, anchor){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#e0322b" stroke-width="3" marker-end="url(#bka)"/><text x="' + lx + '" y="' + ly + '" fill="#e0322b" font-size="15" font-weight="800" text-anchor="' + (anchor || 'start') + '">' + label + '</text>'; }
function bkPic(kind){
  var o = '<svg class="bkpic" viewBox="0 0 360 250" role="img" aria-label="Пример: что фотографировать">' + BK_ARR, f = 'font-family="Georgia,serif"';
  if (kind === 'обложка') o += '<rect x="20" y="10" width="170" height="230" rx="6" fill="#2f6b4f"/><rect x="20" y="10" width="14" height="230" fill="#24553e"/>' +
    '<text x="112" y="45" fill="#f6e7b0" font-size="13" text-anchor="middle" ' + f + '>Л. Н. ТОЛСТОЙ</text><text x="112" y="78" fill="#fff" font-size="20" font-weight="700" text-anchor="middle" ' + f + '>РАССКАЗЫ</text><text x="112" y="100" fill="#fff" font-size="17" font-weight="700" text-anchor="middle" ' + f + '>ДЛЯ ДЕТЕЙ</text>' +
    '<circle cx="112" cy="160" r="38" fill="#f6e7b0"/><path d="M90 172q22-34 44 0z" fill="#2f6b4f"/><circle cx="104" cy="146" r="6" fill="#2f6b4f"/>' +
    '<rect x="8" y="2" width="194" height="246" rx="10" fill="none" stroke="#e0322b" stroke-width="2.5" stroke-dasharray="8 6"/>' +
    bkArrow(300, 88, 196, 88, 'название', 296, 80, 'end') + bkArrow(300, 50, 196, 42, 'автор', 296, 40, 'end') + '<text x="210" y="210" fill="#e0322b" font-size="14" font-weight="700">Вся обложка</text><text x="210" y="228" fill="#e0322b" font-size="14" font-weight="700">в кадре, без бликов</text>';
  else if (kind === 'титул') o += '<rect x="10" y="10" width="160" height="230" fill="#fbf7ea" stroke="#c9bd98"/>' +
    '<text x="90" y="34" font-size="9" fill="#555" text-anchor="middle" ' + f + '>Для младшего школьного возраста</text>' +
    '<g fill="#aaa">' + [60, 70, 80, 90].map(function(y){ return '<rect x="24" y="' + y + '" width="' + (y === 90 ? 80 : 132) + '" height="4"/>'; }).join('') + '</g>' +
    '<rect x="20" y="128" width="140" height="24" fill="#ffe8a3"/><text x="24" y="138" font-size="8.5" fill="#333" ' + f + '>© Издательство «Детская литература»,</text><text x="24" y="149" font-size="8.5" fill="#333" ' + f + '>оформление, 1987</text>' +
    '<rect x="20" y="168" width="140" height="14" fill="#ffe8a3"/><text x="24" y="178" font-size="8.5" fill="#333" ' + f + '>Тираж 300 000 экз.  Цена 45 к.</text>' +
    '<rect x="20" y="196" width="140" height="14" fill="#ffe8a3"/><text x="24" y="206" font-size="8.5" fill="#333" ' + f + '>ISBN 5-08-000000-0</text>' +
    '<text x="90" y="250" font-size="12" font-weight="800" fill="#e0322b" text-anchor="middle">оборот страницы с названием</text>' +
    bkArrow(355, 140, 166, 140, 'издательство, год', 352, 132, 'end') + bkArrow(355, 175, 166, 175, 'тираж', 352, 168, 'end') + bkArrow(355, 203, 166, 203, 'ISBN', 352, 196, 'end');
  else if (kind === 'штрихкод') o += '<rect x="20" y="10" width="170" height="230" rx="6" fill="#2f6b4f"/><text x="105" y="60" fill="#f6e7b0" font-size="12" text-anchor="middle" ' + f + '>Задняя обложка</text>' +
    '<rect x="60" y="160" width="100" height="62" fill="#fff"/><g fill="#111">' + [0, 4, 6, 11, 14, 16, 21, 25, 27, 32, 35, 38, 43, 46, 49, 53, 57, 60, 64, 68, 71, 76, 80, 84].map(function(x, i){ return '<rect x="' + (66 + x) + '" y="165" width="' + (i % 3 ? 1.6 : 2.8) + '" height="42"/>'; }).join('') + '</g><text x="110" y="218" font-size="9" text-anchor="middle" fill="#111">9 785080 000000</text>' +
    bkArrow(300, 190, 166, 190, 'штрихкод', 296, 182, 'end') + '<text x="210" y="100" fill="#e0322b" font-size="14" font-weight="700">Если штрихкода нет —</text><text x="210" y="118" fill="#e0322b" font-size="14" font-weight="700">этот шаг пропусти</text>';
  else o += '<rect x="20" y="10" width="160" height="230" fill="#fbf7ea" stroke="#c9bd98"/><text x="100" y="40" font-size="14" font-weight="700" text-anchor="middle" ' + f + '>СОДЕРЖАНИЕ</text>' +
    ['Филипок', 'Котёнок', 'Акула', 'Прыжок', 'Лев и собачка', 'Пожарные собаки'].map(function(n, i){ return '<text x="32" y="' + (70 + i * 24) + '" font-size="11" ' + f + '>' + n + '</text><text x="168" y="' + (70 + i * 24) + '" font-size="11" text-anchor="end" ' + f + '>' + (3 + i * 4) + '</text>'; }).join('') +
    bkArrow(320, 120, 186, 120, 'главы и страницы', 316, 112, 'end');
  return o + '</svg>';
}
var BK_STEPS = [
  { k: 'обложка', h: 'Обложка', must: true, y: 'Положи книгу на стол и сфотографируй обложку целиком, чтобы было видно название и автора.', a: 'Обложка целиком: название и автор, без бликов.' },
  { k: 'титул', h: 'Оборот титульного листа', must: true, y: 'Открой книгу. Найди страницу с названием книги. Переверни её: на обратной стороне мелкий текст — издательство, год, тираж. Сфотографируй эту страницу поближе, чтобы буквы были чёткие.', a: 'Страница после титула с мелким текстом: издательство, год, тираж, ISBN. Снимай близко, чтобы читались цифры. Это самое точное фото — по нему находится именно твоё издание.' },
  { k: 'штрихкод', h: 'Задняя обложка со штрихкодом', y: 'Переверни книгу. Если сзади есть штрихкод — полоски с цифрами, сфотографируй его. Если нет — пропусти.', a: 'Штрихкод с цифрами ISBN на задней обложке. У старых книг его нет — тогда пропусти.' },
  { k: 'оглавление', h: 'Оглавление (по желанию)', y: 'Если найдёшь страницу Содержание, сфотографируй её. Так Claude разделит книгу на кусочки.', a: 'Оглавление (все его страницы) — по нему Claude составит план чтения по главам.' }
];
function vBkAdd(){
  var kid = cur.kid, A = cur.bkAdd || {}, b = bkFind(kid, A.id), Y = T(kid) === 'yarik', got = (b && b.got) || {};
  if (b && b.thumb) got['обложка'] = got['обложка'] || 1;
  var cards = BK_STEPS.map(function(st, i){
    var n = got[st.k] || 0, txt = Y ? st.y : st.a, open = i === 0 || got['обложка'];
    if (!open) return '';
    return '<article class="card bkstep' + (n ? ' got' : '') + '"><h2>' + (i + 1) + '. ' + st.h + ' ' + (n ? '✅' + (n > 1 ? ' ' + n + ' фото' : '') : '') + '</h2>' + bkPic(st.k) + '<p>' + txt + bkSay(st.y) + '</p>' +
      (st.k === 'обложка' && b && b.thumb ? '<img class="bkcover" src="' + b.thumb + '" alt="обложка">' : '') +
      bkSnapBtn(st.k, n ? (st.k === 'оглавление' ? '📷 Ещё страница' : '📷 Переснять') : '📷 Сфотографировать') + '</article>'; }).join('');
  var ready = got['обложка'];
  return '<main class="wrap ' + kid + '">' + bkHead('bkopen') + '<section class="hello"><h1>Новая книга</h1><p>Три фото — и Claude узнает книгу. Смотри на картинки: красные стрелки показывают, что должно попасть в кадр.</p></section>' + cards +
    (ready ? '<article class="card"><label class="hint">Как называется книга? (можно не писать)<input id="bktitle" class="bkinp" maxlength="80" value="' + U.esc((b && b.title) || '') + '"></label>' +
      (!got['титул'] ? '<p class="hint">⚠ Без оборота титульного листа Claude может не узнать издание. Лучше сфотографируй его.</p>' : '') +
      '<p class="hint">Если книга редкая, Claude попросит сфотографировать страницы главы, которую ты читаешь, и задаст вопросы по ним.</p>' +
      '<button class="btn big" data-act="bkaddok">Готово — отправить Claude</button></article>' : '') +
    '<p id="bkup" class="hint">' + bkUpHtml() + '</p></main>';
}
function vBook(){
  var kid = cur.kid, b = bkFind(kid, cur.bk); if (!b) return vBooks();
  var t = bkCurTask(b), tasks = b.tasks || [];
  var head = '<section class="hello bkhead">' + (b.thumb ? '<img class="bkcover sm" src="' + b.thumb + '" alt="">' : '') + '<div><h1>' + U.esc(b.title || 'Новая книга') + '</h1>' + (b.author ? '<p>' + U.esc(b.author) + '</p>' : '') + '</div></section>';
  var msg = b.msg ? '<div class="note">✉ ' + U.esc(noPapa(b.msg)) + bkSay(noPapa(b.msg)) + (b.msgSeen ? '' : ' <button class="link" data-act="bkmsgseen">Понятно</button>') + '</div>' : '';
  var body = '';
  if (!tasks.length) body = '<div class="card"><h2>⏳ Claude смотрит твои фото</h2><p>Вечером он узнает книгу и придумает задания. Загляни сюда завтра!</p></div>';
  else if (!t) body = b.finished ? '<div class="card win"><h2>🏁 Книга прочитана!</h2><p>Молодец! Выбери следующую книгу и сфотографируй её.</p></div>' : '<div class="card"><h2>Все задания сделаны 👍</h2><p>Новые появятся завтра. А пока можно читать дальше просто так.</p></div>';
  else body = bkTaskView(kid, b, t);
  var done = tasks.filter(function(x){ var p = b.prog && b.prog[x.id]; return p && p.ph === 'done'; }).map(function(x){ var p = b.prog[x.id]; return '<li>✅ ' + U.esc(x.title || x.read || '') + (p.pts != null ? ' · +' + p.pts : '') + '</li>'; }).join('');
  return '<main class="wrap ' + kid + '">' + bkHead('bkopen') + head + msg + '<p id="bkup" class="hint">' + bkUpHtml() + '</p>' + body +
    (done ? '<details class="card"><summary>Сделано: ' + tasks.filter(function(x){ var p = b.prog && b.prog[x.id]; return p && p.ph === 'done'; }).length + '</summary><ul>' + done + '</ul></details>' : '') +
    '<div class="card"><p class="hint">Claude не узнал книгу или нужны другие страницы? Сфотографируй ещё.</p>' + bkSnapBtn('страницы', '📷 Добавить фото страниц', ' data-bk="' + b.id + '"') + '</div></main>';
}
function bkTaskView(kid, b, t){
  var P = bkProg(b, t.id), now = Date.now();
  var steps = ['Читаю'].concat(t.kw && t.kw.length ? ['Пересказ'] : [], (t.qs || []).length ? ['Вопросы'] : [], t.snap ? ['Фото'] : []);
  var cur0 = { intro: 0, read: 0, photo: 0, aloud: 0, listen: 0, between: 0, retell: 1, qs: steps.indexOf('Вопросы'), snap: steps.length - 1 }[P.ph] || 0;
  var sbar = '<ul class="steps">' + steps.map(function(s, i){ return '<li class="' + (i < cur0 ? 'ok' : i === cur0 ? 'now' : '') + '">' + s + '</li>'; }).join('') + '</ul>';
  var h = '<article class="card"><h2>' + U.esc(t.title || 'Задание') + '</h2>' + sbar;
  if (P.ph === 'intro' || P.ph === 'read') {
    h += '<p class="bkread">' + U.esc(t.read || '') + bkSay(t.read || '') + '</p>' + (t.min ? '<p class="hint">Читай спокойно, примерно ' + t.min + ' ' + U.pl(t.min, 'минуту', 'минуты', 'минут') + '. Айпад можно отложить.</p>' : '');
    if (P.ph === 'intro') h += (bkAloudN(kid, t) > 0 ? '<button class="btn big mic" data-act="bkaloud">🎤 Читать вслух по книге</button><button class="btn big ghost" data-act="bkstart">📖 Читать про себя</button>' : '<button class="btn big" data-act="bkstart">📖 Начинаю читать</button>');
    else h += '<p class="center">Читаешь уже <b>' + bkMins(now - P.t0) + ' мин</b></p><button class="btn big" data-act="bkreaddone">✅ Я прочитал(а)</button>';
  } else if (['photo', 'aloud', 'listen', 'between'].indexOf(P.ph) >= 0) {
    h += '<p class="bkread">' + U.esc(t.read || '') + '</p>' + bkAloudView(kid, b, t, P);
  } else if (P.ph === 'retell') {
    var live = RT && RT.active;
    h += '<p>Перескажи своими словами, что ты прочитал(а): кто там был, что случилось, чем закончилось.' + bkSay('Перескажи своими словами, что ты прочитал. Кто там был, что случилось, чем закончилось.') + '</p>' +
      '<textarea id="rtxt" class="rtxt" rows="6" placeholder="Здесь появится твой пересказ…">' + U.esc(live ? RT.text : (P.rtDraft || '')) + '</textarea><div class="row">' +
      (SR ? (live ? '<button class="btn stop" data-act="retellstop">⏹ Стоп</button><span class="rstat">Слушаю…</span>' : '<button class="btn mic" data-act="retellstart">🎤 Надиктовать</button>') : '') +
      '<button class="btn big" data-act="bkretell">Проверить пересказ</button></div>' + (P.rt ? retellResHtml(P.rt) + '<button class="btn big" data-act="bktoqs">Дальше — вопросы</button>' : '') +
      ((P.rtTries || 0) >= 2 && !P.rt ? '<p class="hint"><button class="link" data-act="bkrtadult">Пересказал(а) взрослому</button></p>' : '') +
      (!SR ? '<p class="hint">Нажми на поле, потом на 🎤 на клавиатуре и рассказывай.</p>' : '');
  } else if (P.ph === 'qs') {
    var qs = bkQs(t), i = P.i || 0, q = qs[i], a = P.ans[i] || {};
    h += '<p class="hint">Вопрос ' + (i + 1) + ' из ' + qs.length + '. Можно заглянуть в книгу — ответ там! Ответ даётся один раз.</p><div class="q">' + U.esc(q.q) + bkSay(q.q) + '</div>';
    if (q.k === 'c') h += '<div class="opts">' + q.opts.map(function(o){ return '<button class="opt ' + (a.final && o === q.a ? 'right' : a.v === o ? 'wrong' : '') + '" data-act="bkq" data-v="' + U.esc(o) + '" ' + (a.final ? 'disabled' : '') + '>' + U.esc(o) + '</button>'; }).join('') + '</div>';
    else h += a.final ? '<p>Твой ответ: <b>' + U.esc(a.v) + '</b></p>' : '<form data-form="bkt" class="numf txtf"><input id="bktin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Напиши ответ" autofocus><button class="btn">Ответить</button></form>';
    if (a.final) h += '<div class="fb ' + (a.ok ? 'ok">Верно! 👍' : 'bad">Правильно: <b>' + U.esc(q.a) + '</b>') + '</div><button class="btn big" data-act="bknext">Дальше</button>';
  } else if (P.ph === 'snap') {
    h += '<p>' + U.esc(t.snap) + bkSay(t.snap) + '</p><p class="hint">Так Claude приготовит задание на следующий раз.</p>' + bkSnapBtn('страницы', '📷 Сфотографировать', ' data-bk="' + b.id + '" data-task="' + t.id + '"') +
      ((P.snaps || 0) ? '<p>✅ Отправлено фото: ' + P.snaps + '</p><button class="btn big" data-act="bkfinish">Готово</button>' : '<p class="hint"><button class="link" data-act="bkfinish">Пропустить</button></p>');
  }
  return h + '</article>';
}
function bkQs(t){
  var r = U.rng(t.id);
  return (t.qs || []).map(function(x){
    if (Object.prototype.toString.call(x) === '[object Array]') return { k: 'c', q: x[0], a: String(x[1]), opts: r.shuffle(x.slice(1).map(String)) };
    if (x.w && x.w.length) return { k: 'c', q: x.q, a: String(x.a), opts: r.shuffle([String(x.a)].concat(x.w.map(String))) };
    return { k: 't', q: x.q, a: String(x.a), alt: x.alt || [] };
  });
}
function bkNorm(s){ return String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/[«»"'.,!?:;()\-–—]/g, ' ').replace(/\s+/g, ' ').trim(); }
function bkAnswer(v){
  var kid = cur.kid, b = bkFind(kid, cur.bk), t = b && bkCurTask(b); if (!t) return;
  var P = bkProg(b, t.id), qs = bkQs(t), i = P.i || 0, q = qs[i]; if (!q || (P.ans[i] && P.ans[i].final)) return;
  var ok = q.k === 'c' ? v === q.a : [q.a].concat(q.alt).some(function(x){ return bkNorm(x) === bkNorm(v); });
  P.ans[i] = { v: v, ok: ok, final: true };
  ev(kid, 'ответ', { subj: '📚 Книга', unit: (b.title || b.id) + ' · ' + (t.title || ''), q: q.q, ans: v, right: q.a, ok: ok ? 'верно' : 'ошибка' });
  save(); render();
}
function bkFinish(kid, b, t){
  var P = bkProg(b, t.id), qs = bkQs(t), n = qs.length, ok = P.ans.filter(function(a){ return a && a.ok; }).length;
  var ratio = n ? ok / n : 1, q = t.kw && t.kw.length ? (n ? .65 * ratio + .35 * ((P.rt && P.rt.score) || 0) : ((P.rt && P.rt.score) || 0)) : ratio;
  var accs = (P.sp || []).filter(function(r){ return r.acc != null; }); if (accs.length) q = .8 * q + .2 * accs.reduce(function(a, r){ return a + r.acc; }, 0) / accs.length;
  var pts = q < .6 ? 0 : Math.round(BOOK_PTS * q * q);
  var D = dayRec(kid, U.today()); D.bookPts = D.bookPts || 0; pts = Math.max(0, Math.min(pts, BOOK_PTS - D.bookPts)); D.bookPts += pts;
  var K = S.kids[kid]; piggyAdd(K, pts); P.pts = pts; P.ph = 'done'; P.end = Date.now(); K.texts = (K.texts || 0) + 1;
  ev(kid, 'книга: задание', { subj: '📚 Книга', unit: (b.title || b.id) + ' · ' + (t.title || ''), score: ok + '/' + n, secs: P.secs || '', coins: K.coins, text: '+' + pts + ' баллов' + (P.rt ? '; пересказ ' + P.rt.hit.length + '/' + P.rt.n : '') });
  save(); render(); alertMsg(pts ? 'Задание по книге сделано: +' + pts + ' 🐷' : (D.bookPts >= BOOK_PTS ? 'Сделано! Баллы за книги сегодня уже получены' : 'Сделано! В следующий раз читай внимательнее'));
}
function bkPhoto(input){
  var kid = cur.kid, f = input.files && input.files[0], kind = input.getAttribute('data-bkkind'); if (!f || !kid) return;
  var bid = input.getAttribute('data-bk') || (cur.bkAdd && cur.bkAdd.id), tid = input.getAttribute('data-task') || '';
  if (!bid) return; alertMsg('Готовлю фото…');
  if (kind === 'разворот') { bkPrep(f, 1800, .85, function(data){ var b0 = bkFind(kid, bid), t0 = b0 && bkCurTask(b0); if (!data) { alertMsg('Не получилось прочитать фото, попробуй ещё раз'); return; } if (t0) bkSpreadPhoto(kid, b0, t0, data); }); try { input.value = ''; } catch (e) {} return; }
  bkPrep(f, 1600, .8, function(data){
    if (!data) { alertMsg('Не получилось прочитать фото, попробуй ещё раз'); return; }
    var b = bkFind(kid, bid); if (!b) return;
    var note = kind === 'страницы' && tid ? (function(){ for (var i = 0; i < b.tasks.length; i++) if (b.tasks[i].id === tid) return b.tasks[i].snap || ''; return ''; })() : '';
    bkSend(kid, bid, kind, tid, note, data);
    if (kind === 'обложка') bkPrep(f, 220, .7, function(th){ if (th) { b.thumb = th; save(); render(); } });
    if (kind === 'оглавление') b.nToc = (b.nToc || 0) + 1;
    if (kind !== 'страницы') { b.got = b.got || {}; b.got[kind] = (b.got[kind] || 0) + 1; }
    if (tid) { var P = bkProg(b, tid); P.snaps = (P.snaps || 0) + 1; }
    if (kind === 'страницы' && !tid) { b.st = 'wait'; b.morePics = U.today(); }
    ev(kid, 'книга: фото', { subj: '📚 Книга', unit: b.title || bid, text: kind + (note ? ': ' + note : '') });
    save(); render(); alertMsg('Фото отправлено 👍');
  });
  try { input.value = ''; } catch (e) {}
}
document.addEventListener('change', function(e){ var el = e.target; if (el && el.getAttribute && el.getAttribute('data-bkkind')) bkPhoto(el); });
document.addEventListener('submit', function(e){ var f = e.target; if (!f || !f.getAttribute || f.getAttribute('data-form') !== 'bkt') return; e.preventDefault(); var el = document.getElementById('bktin'), v = el ? el.value.trim() : ''; if (v) bkAnswer(v); });
document.addEventListener('click', function(e){
  var btn = e.target.closest ? e.target.closest('[data-act]') : null; if (!btn) return; var act = btn.getAttribute('data-act'); if (act.indexOf('bk') !== 0) return;
  var kid = cur.kid; if (!kid) return; var b = cur.bk ? bkFind(kid, cur.bk) : null, t = b ? bkCurTask(b) : null, P = t ? bkProg(b, t.id) : null;
  switch (act) {
    case 'bkopen': if (RT && RT.active) retellStop(); go('books'); break;
    case 'bkbook': go('book', { bk: btn.getAttribute('data-id') }); break;
    case 'bkadd': { var id = 'b' + (T(kid) === 'yarik' ? 'y' : 'a') + Date.now().toString(36); bkK(kid).push({ id: id, title: '', added: U.today(), tasks: [], prog: {}, st: 'new', hidden: true }); cur.bkAdd = { id: id }; save(); go('bkadd', { bkAdd: { id: id } }); break; }
    case 'bkaddok': { var A = cur.bkAdd && bkFind(kid, cur.bkAdd.id); if (!A || !A.thumb) { alertMsg('Сначала сфотографируй обложку'); break; } var tl = document.getElementById('bktitle'); if (tl && tl.value.trim()) A.title = tl.value.trim().slice(0, 80);
      A.hidden = false; A.st = 'wait'; ev(kid, 'книга добавлена', { subj: '📚 Книга', unit: A.id, text: (A.title || 'без названия') + '; фото: ' + Object.keys(A.got || {}).map(function(k){ return k + ' ' + A.got[k]; }).join(', ') });
      save(); cur.bk = A.id; go('book', { bk: A.id }); break; }
    case 'bksay': say(btn.getAttribute('data-t'), 'ru-RU'); break;
    case 'bkmsgseen': if (b) { b.msgSeen = true; save(); render(); } break;
    case 'bkaloud': if (P) { P.ph = 'photo'; P.t0 = P.t0 || Date.now(); ev(kid, 'книга: читаю вслух', { subj: '📚 Книга', unit: (b.title || b.id) + ' · ' + (t.title || '') }); save(); render(); } break;
    case 'bkstart': if (P) { P.ph = 'read'; P.t0 = Date.now(); ev(kid, 'книга: читаю', { subj: '📚 Книга', unit: (b.title || b.id) + ' · ' + (t.title || '') }); save(); render(); } break;
    case 'bkreaddone': { if (!P) break; var el = (Date.now() - (P.t0 || Date.now())) / 1000, need = P.silent ? Math.max(60, (t.min || 5) * 60 * .6 - (P.secs || 0)) : (t.min || 5) * 60 * .6;
      if (el < need) { alertMsg('Слишком быстро 🙂 Почитай ещё примерно ' + Math.max(1, Math.ceil((need - el) / 60)) + ' мин'); break; }
      P.secs = (P.secs || 0) + Math.round(el); P.ph = t.kw && t.kw.length ? 'retell' : (t.qs || []).length ? 'qs' : t.snap ? 'snap' : 'end'; P.i = 0; save(); if (P.ph === 'end') bkFinish(kid, b, t); else render(); break; }
    case 'bkretell': { var ta = document.getElementById('rtxt'), text = ((ta && ta.value) || '').trim(); if (RT) { RT.active = false; try { RT.rec && RT.rec.stop(); } catch (x) {} RT = null; }
      P.rtDraft = text; P.rtTries = (P.rtTries || 0) + 1; var r = retellScore({ kw: t.kw }, text);
      if (r.words < (T(kid) === 'yarik' ? 8 : 15)) { save(); render(); alertMsg('Расскажи подробнее — хотя бы несколько предложений'); break; }
      if (!P.rt || r.score > P.rt.score) P.rt = r; ev(kid, 'пересказ', { subj: '📚 Книга', unit: (b.title || b.id) + ' · ' + (t.title || ''), text: text.slice(0, 1500), score: r.hit.length + '/' + r.n, words: r.words }); save(); render(); break; }
    case 'bkrtadult': P.rt = { n: t.kw.length, hit: [], miss: [], score: .7, adult: true }; ev(kid, 'пересказ', { subj: '📚 Книга', unit: b.title || b.id, text: 'пересказал(а) взрослому' }); P.ph = (t.qs || []).length ? 'qs' : t.snap ? 'snap' : 'end'; save(); if (P.ph === 'end') bkFinish(kid, b, t); else render(); break;
    case 'bktoqs': P.ph = (t.qs || []).length ? 'qs' : t.snap ? 'snap' : 'end'; P.i = 0; save(); if (P.ph === 'end') bkFinish(kid, b, t); else render(); break;
    case 'bkq': bkAnswer(btn.getAttribute('data-v')); break;
    case 'bknext': { var n = bkQs(t).length; if ((P.i || 0) + 1 < n) { P.i = (P.i || 0) + 1; save(); render(); } else if (t.snap) { P.ph = 'snap'; save(); render(); } else bkFinish(kid, b, t); window.scrollTo(0, 0); break; }
    case 'bkfinish': bkFinish(kid, b, t); break;
  }
});
setInterval(function(){ if (cur.view === 'book' && cur.kid) { var b = bkFind(cur.kid, cur.bk), t = b && bkCurTask(b), P = t && b.prog && b.prog[t.id]; if (P && P.ph === 'read' && !(document.activeElement && document.activeElement.tagName === 'INPUT')) render(); } }, 30000);
