/* ===== Аня: факультет (тест Распределяющей шляпы) и викторина «Знаток Гарри Поттера» =====
   Только семейное приложение (в «Словоход» не собирается — см. tools/build.py). ES5 для старого Safari.
   Права: все вопросы, пояснения и тест — свои слова; ссылки только на книгу и номер главы. */
var HP_CAP = 5; /* баллов в день за викторину */
FUN_CAP.hp = HP_CAP;
var HOUSES = {
  g: { n: 'Гриффиндор', d: 'Гриффиндору', e: '🦁', who: 'гриффиндорка', val: 'смелость и благородство', fnd: 'Годрик Гриффиндор',
    hello: '🦁 Гриффиндор приветствует тебя, смелая волшебница!',
    win: ['🦁 +10 очков Гриффиндору!', '🦁 Смело и верно!', '🔥 Настоящая гриффиндорка!', '🪄 Заклинание сработало!', '✨ Львы ревут от восторга!'] },
  s: { n: 'Слизерин', d: 'Слизерину', e: '🐍', who: 'слизеринка', val: 'целеустремлённость и находчивость', fnd: 'Салазар Слизерин',
    hello: '🐍 Слизерин приветствует тебя: ум, хитрость и цель!',
    win: ['🐍 +10 очков Слизерину!', '🐍 Хитро придумано!', '💚 Цель достигнута!', '🪄 Заклинание сработало!', '✨ Достойно слизеринки!'] },
  r: { n: 'Когтевран', d: 'Когтеврану', e: '🦅', who: 'когтевранка', val: 'ум и любознательность', fnd: 'Ровена Когтевран',
    hello: '🦅 Когтевран приветствует тебя: ум — лучшее волшебство!',
    win: ['🦅 +10 очков Когтеврану!', '🦅 Острый ум!', '📘 Мудро!', '🪄 Заклинание сработало!', '✨ Ровена Когтевран гордилась бы тобой!'] },
  h: { n: 'Пуффендуй', d: 'Пуффендую', e: '🦡', who: 'пуффендуйка', val: 'трудолюбие, честность и верность', fnd: 'Пенелопа Пуффендуй',
    hello: '🦡 Пуффендуй приветствует тебя: трудом всего добьёшься!',
    win: ['🦡 +10 очков Пуффендую!', '🦡 Труд и верность!', '💛 Так держать!', '🪄 Заклинание сработало!', '✨ Настоящая пуффендуйка!'] }
};
var HP_BASE = { hello: THEME.anya.hello, win: THEME.anya.win.slice(), banner: THEME.anya.banner.slice() };
function hpOn(kid){ return !FAM && kid === 'anya' && !!S.kids[kid]; }
function hpK(kid){ var K = S.kids[kid]; if (!K.hp) K.hp = { house: '', tr: '', seen: {}, re: [], day: null }; return K.hp; }
function hpHouse(kid){ return hpOn(kid) ? hpK(kid).house : ''; }
/* Факультет влияет на приветствие, похвалу и цвета (класс на body) */
function hpApply(){ var h = S && S.kids && S.kids.anya && S.kids.anya.hp && HOUSES[S.kids.anya.hp.house]; var A = THEME.anya;
  if (!h) { A.hello = HP_BASE.hello; A.win = HP_BASE.win.slice(); A.banner = HP_BASE.banner.slice(); return; }
  A.hello = h.hello; A.win = h.win.slice(); A.banner = HP_BASE.banner.slice(); }
function hpBodyCls(kid){ var h = hpHouse(kid); return h ? ' h-' + h : ''; }

/* Имена — по переводу «Росмэн». Номера глав одинаковы во всех переводах. (Перевод «Махаон» сильно расходится в именах и в разных тиражах — подстановку не делаем.) */
function hpT(kid, s){ return s; }

/* ---------- Банк вопросов ---------- */
var HPQ = HP_Q.map(function(l){ var p = l.split('|'); return { id: 'h' + U.h(p[3]), b: +p[0], c: +p[1], lv: +p[2], q: p[3], a: p[4], w: p[5].split(';'), e: p[6] || '' }; });
var HP_PICQ = 'Художник ошибся. Что на картинке не так, как в книге?';
(typeof HP_PIC !== 'undefined' ? HP_PIC : []).forEach(function(l){ var p = l.split('|'); HPQ.push({ id: 'p' + U.h(p[4]), b: +p[0], c: +p[1], lv: +p[2], pic: p[3], cap: p[4], q: HP_PICQ, a: p[5], w: p[6].split(';'), e: p[7] || '' }); });
var HPQ_BY = {}; HPQ.forEach(function(x){ HPQ_BY[x.id] = x; });
var HP_DAY_N = 10;
var HP_RANK = [[0, 'Первокурсница', '🪶'], [15, 'Второкурсница', '📗'], [35, 'Третьекурсница', '🦉'], [60, 'Знаток', '🪄'], [90, 'Староста', '⭐'], [130, 'Лучшая ученица', '🏆'], [180, 'Магистр волшебного мира', '🔮'], [240, 'Хранительница всех тайн', '👑']];
function hpRank(n){ var r = HP_RANK[0], nx = null; for (var i = 0; i < HP_RANK.length; i++) if (n >= HP_RANK[i][0]) { r = HP_RANK[i]; nx = HP_RANK[i + 1] || null; } return { r: r, nx: nx }; }
function hpSolved(kid){ var S2 = hpK(kid).seen, n = 0; for (var k in S2) if (S2[k] === 1 && HPQ_BY[k]) n++; return n; }
function hpWhere(x){ return 'Книга ' + x.b + ' «' + HP_BOOKS[x.b] + '», ' + (x.b === 7 && x.c === 37 ? 'эпилог' : 'глава ' + x.c + ' — ' + HP_CH[x.b][x.c]); }
/* Подборка дня: 10 вопросов, которые Аня ещё не решила; сначала из разных книг, по кругу */
function hpDay(kid){ var H = hpK(kid), t = U.today();
  if (H.day && H.day.d === t) return H.day;
  var pool = HPQ.filter(function(x){ return H.seen[x.id] !== 1 && H.re.indexOf(x.id) < 0; });
  if (pool.length < HP_DAY_N) pool = HPQ.filter(function(x){ return H.re.indexOf(x.id) < 0; });
  var r = U.rng(kid + 'hp' + t), mix = r.shuffle(pool), by = {}, out = [];
  mix.forEach(function(x){ (by[x.b] = by[x.b] || []).push(x); });
  var pics = mix.filter(function(x){ return x.pic; }); if (pics.length) { out.push(pics[0].id); mix = mix.filter(function(x){ return x.id !== pics[0].id; }); }
  by = {}; mix.forEach(function(x){ (by[x.b] = by[x.b] || []).push(x); });
  var bs = r.shuffle([1, 2, 3, 4, 5, 6, 7]);
  for (var round = 0; out.length < HP_DAY_N && round < 50; round++) bs.forEach(function(b){ if (out.length < HP_DAY_N && by[b] && by[b].length) out.push(by[b].shift().id); });
  H.day = { d: t, ids: out, res: {} }; save(); return H.day; }
function hpCurId(kid){ var D = hpDay(kid); for (var i = 0; i < D.ids.length; i++) if (!D.res[D.ids[i]]) return D.ids[i]; return null; }
function hpOpts(kid, x){ return U.rng(x.id + kid + (cur.hre ? 're' + hpK(kid).re.length : '')).shuffle([x.a].concat(x.w)); }

ALWAYS.push({ id: 'hp', order: 1,
  open: function(kid){ cur.hq = null; cur.hre = null; cur.hpv = ''; },
  tile: function(kid){ if (!hpOn(kid)) return ''; var D = hpDay(kid), done = 0; for (var k in D.res) done++; var re = hpK(kid).re.length;
    return '<button class="tile fun hptile" data-act="always" data-id="hp"><span class="ico">⚡</span><span class="tt"><span class="sn">Викторина знатока</span><span class="ut">Каждый день 10 новых вопросов по всем семи книгам. Сегодня: ' + done + ' из ' + D.ids.length + (re ? ' · перечитать: ' + re : '') + '. До +' + HP_CAP + ' в день</span></span></button>'; },
  view: function(kid){ if (!hpOn(kid)) return '<div class="card">Этот раздел — только для Ани.</div>';
    var H = hpK(kid), D = hpDay(kid), solved = hpSolved(kid), rk = hpRank(solved), hs = HOUSES[H.house];
    var h = '<section class="hello"><p class="eyebrow">Всегда доступно' + (hs ? ' · ' + hs.e + ' ' + hs.n : '') + '</p><h1>⚡ Викторина знатока</h1>' +
      '<p class="hint">Вопросы для настоящих знатоков всех семи книг. Засчитывается первый ответ: обычный вопрос — 1 балл, вопрос эксперта — 2. ' + funCapNote(kid, 'hp') + '</p>' +
      '<p class="hprank"><span class="rlvb">' + rk.r[2] + ' ' + rk.r[1] + '</span> отвечено верно: <b>' + solved + '</b> из ' + HPQ.length + (rk.nx ? ' · до звания «' + rk.nx[1] + '» ещё ' + (rk.nx[0] - solved) : '') + '</p></section>';
    var x = null, mode = '';
    if (cur.hre && HPQ_BY[cur.hre]) { x = HPQ_BY[cur.hre]; mode = 're'; }
    else if (cur.hq) { x = HPQ_BY[cur.hq.id]; mode = 'res'; }
    else { var id = hpCurId(kid); x = id && HPQ_BY[id]; }
    var done = 0; for (var k in D.res) done++;
    if (x) {
      var r = (cur.hq && cur.hq.id === x.id) ? cur.hq : null, opts = hpOpts(kid, x);
      h += '<div class="counter">' + (mode === 're' || (r && r.re) ? '📖 Вопрос после перечитывания' : 'Вопрос ' + Math.min(D.ids.length, done + (r ? 0 : 1)) + ' из ' + D.ids.length) + (x.lv === 3 ? ' · <b>эксперт</b>' : '') + '</div>';
      h += '<article class="card task hpcard"><p class="hpbook">📕 Книга ' + x.b + ' · «' + HP_BOOKS[x.b] + '»</p>' + (x.pic ? '<div class="hppic" role="img" aria-label="' + U.esc(x.cap) + '"><span>' + U.esc(x.pic) + '</span></div><p class="hpcap">🖼️ ' + U.esc(x.cap) + '</p>' : '') + '<div class="q">' + U.esc(hpT(kid, x.q)) + '</div>' +
        '<div class="opts">' + opts.map(function(o){ var cls = r ? (o === x.a ? 'right' : o === r.v ? 'wrong' : '') : ''; return '<button class="opt ' + cls + '" data-act="hpans" data-v="' + U.esc(o) + '"' + (r ? ' disabled' : '') + '>' + U.esc(hpT(kid, o)) + '</button>'; }).join('') + '</div>';
      if (r) {
        h += r.ok ? '<div class="fb ok"><b>' + U.rng(x.id).pick(THEME.anya.win) + '</b> ' + (r.pts ? '+' + r.pts + ' ' + U.pl(r.pts, 'балл', 'балла', 'баллов') + '. ' : '') + U.esc(hpT(kid, x.e)) + '</div><p class="src">📖 ' + U.esc(hpT(kid, hpWhere(x))) + '</p>'
          : '<div class="fb bad"><b>Правильный ответ: ' + U.esc(hpT(kid, x.a)) + '.</b> ' + U.esc(hpT(kid, x.e)) + '</div>' +
            '<div class="note hpread">📖 <b>Где прочитать:</b> ' + U.esc(hpT(kid, hpWhere(x))) + '.<br>Перечитай эту главу в своей книге — вопрос будет ждать тебя в списке «Перечитать». Ответишь верно — получишь балл.</div>';
        h += (r.pts ? funBurst(r.pts) : '') + '</article><button class="btn big" data-act="hpnext">' + (hpCurId(kid) ? 'Следующий вопрос →' : 'Готово') + '</button>';
      } else h += '</article>' + (mode === 're' ? '<p class="center"><button class="link" data-act="hpback">← Вернуться к вопросам дня</button></p>' : '');
    } else {
      var ok = 0; for (var k2 in D.res) if (D.res[k2] === 1) ok++;
      h += '<div class="card win"><h2>Вопросы дня закончились!</h2><p>Сегодня верно: <b>' + ok + '</b> из ' + D.ids.length + '. Завтра будет новая подборка.</p>' +
        '<button class="btn ghost" data-act="hpmore">Ещё 5 вопросов</button></div>';
    }
    /* Перечитать */
    if (H.re.length) {
      h += '<section class="card hpre"><h2>📖 Перечитать</h2><p class="hint">Здесь вопросы, на которые ты ответила неверно. Прочитай главу в книге и попробуй ещё раз.</p><ul class="hplist">' +
        H.re.slice(0, 12).map(function(id){ var q = HPQ_BY[id]; if (!q) return ''; return '<li><span>' + U.esc(hpT(kid, hpWhere(q))) + '</span> <button class="btn ghost small" data-act="hpre" data-id="' + id + '">Я перечитала — ответить</button></li>'; }).join('') + '</ul>' +
        (H.re.length > 12 ? '<p class="hint">И ещё ' + (H.re.length - 12) + '.</p>' : '') + '</section>';
    }
    h += '<section class="card hpbooks"><h2>📚 По книгам</h2>' + [1, 2, 3, 4, 5, 6, 7].map(function(b){ var all = HPQ.filter(function(q){ return q.b === b; }), s = all.filter(function(q){ return H.seen[q.id] === 1; }).length;
      return '<div class="hpbk"><span>' + b + '. ' + HP_BOOKS[b] + '</span><span class="prog"><i style="width:' + Math.round(s / all.length * 100) + '%"></i></span><b>' + s + '/' + all.length + '</b></div>'; }).join('');
    h += '<p class="hint">Номера глав одинаковы во всех русских переводах. Вопросы придуманы для этого приложения своими словами. Новые вопросы добавляются регулярно.</p></section>';
    return h; },
  act: function(act, b){ var kid = cur.kid; if (!hpOn(kid)) return; var H = hpK(kid);
    if (act === 'hpans') { if (cur.hq) return; var re = !!cur.hre, id = re ? cur.hre : hpCurId(kid), x = HPQ_BY[id]; if (!x) return;
      var v = b.getAttribute('data-v'), ok = v === x.a, pts = 0;
      if (re) { if (ok) { H.re = H.re.filter(function(i){ return i !== id; }); H.seen[id] = 1; pts = funPts(kid, 'hp', 1); } }
      else { var D = hpDay(kid); D.res[id] = ok ? 1 : 2; if (ok) { if (H.seen[id] !== 1) pts = funPts(kid, 'hp', x.lv === 3 ? 2 : 1); H.seen[id] = 1; } else { if (H.seen[id] !== 1) H.seen[id] = 0; if (H.re.indexOf(id) < 0) H.re.push(id); } }
      cur.hq = { id: id, v: v, ok: ok, pts: pts, re: re }; cur.hre = null;
      ev(kid, 'викторина ГП', { subj: 'Гарри Поттер', q: x.q, ans: v, right: x.a, ok: ok ? 'верно' : 'ошибка', text: (re ? 'после перечитывания; ' : '') + 'книга ' + x.b + ', глава ' + x.c + (pts ? '; +' + pts + ' баллов' : ''), coins: S.kids[kid].coins });
      save(); render(); }
    else if (act === 'hpnext') { cur.hq = null; render(); window.scrollTo(0, 0); }
    else if (act === 'hpre') { cur.hq = null; cur.hre = b.getAttribute('data-id'); render(); window.scrollTo(0, 0); }
    else if (act === 'hpback') { cur.hre = null; cur.hq = null; render(); }
    else if (act === 'hpmore') { var D2 = hpDay(kid), have = {}; D2.ids.forEach(function(i){ have[i] = 1; });
      var pool = HPQ.filter(function(q){ return !have[q.id] && H.seen[q.id] !== 1 && H.re.indexOf(q.id) < 0; }); if (!pool.length) pool = HPQ.filter(function(q){ return !have[q.id]; });
      U.rng(kid + 'more' + D2.ids.length).shuffle(pool).slice(0, 5).forEach(function(q){ D2.ids.push(q.id); }); save(); render(); } }
});

/* ---------- Распределяющая шляпа ---------- */
var HAT_Q = [
  ['Что из этого тебе ближе всего?', [['Вступиться за того, кого обижают, даже если страшно', 'g'], ['Поставить большую цель и обязательно её добиться', 's'], ['Разгадать загадку, над которой все сдались', 'r'], ['Помочь, даже если никто об этом не узнает', 'h']]],
  ['Какой урок в школе волшебства ты ждала бы больше всего?', [['Защиту от тёмных искусств', 'g'], ['Зельеварение', 's'], ['Заклинания или астрономию', 'r'], ['Травологию и уход за волшебными существами', 'h']]],
  ['Ночью в пустом коридоре что-то загрохотало. Что ты сделаешь?', [['Пойду и посмотрю, что там', 'g'], ['Тихо понаблюдаю: кто это и что можно узнать', 's'], ['Подумаю, что это может быть, и проверю в книгах', 'r'], ['Позову друзей — вместе разберёмся', 'h']]],
  ['Что для тебя обиднее всего услышать о себе?', [['Что ты трусиха', 'g'], ['Что ты ничего не добилась', 's'], ['Что ты не думаешь головой', 'r'], ['Что ты подвела друзей', 'h']]],
  ['Какой волшебный предмет ты бы выбрала?', [['Меч, который появляется у смелых', 'g'], ['Кольцо, которому подчиняются двери и замки', 's'], ['Книгу, которая отвечает на любой вопрос', 'r'], ['Котелок, из которого хватает еды на всех', 'h']]],
  ['В лесу развилка. Куда пойдёшь?', [['К тёмному замку, откуда слышен крик о помощи', 'g'], ['К фонтану, исполняющему одно желание', 's'], ['К старой башне с забытой библиотекой', 'r'], ['На поляну, где у костра собрались друзья', 'h']]],
  ['Что ты хотела бы, чтобы о тебе сказали через сто лет?', [['Она была очень храброй', 'g'], ['Она добилась великого', 's'], ['Она была мудрой и много знала', 'r'], ['Она была доброй и верной', 'h']]]
];
ALWAYS.push({ id: 'hat', order: 2,
  open: function(kid){ cur.hat = { i: 0, sc: { g: 0, s: 0, r: 0, h: 0 }, res: '' }; if (hpHouse(kid)) cur.hat.show = 1; },
  tile: function(kid){ if (!hpOn(kid)) return ''; var hs = HOUSES[hpHouse(kid)];
    return '<button class="tile fun hptile hat" data-act="always" data-id="hat"><span class="ico">' + (hs ? hs.e : '🎩') + '</span><span class="tt"><span class="sn">' + (hs ? 'Мой факультет: ' + hs.n : 'Распределяющая шляпа') + '</span><span class="ut">' + (hs ? hs.val.charAt(0).toUpperCase() + hs.val.slice(1) + '. Цвета, приветствие и похвала — твоего факультета' : 'Пройди распределение и выбери свой факультет') + '</span></span></button>'; },
  view: function(kid){ if (!hpOn(kid)) return ''; var H = hpK(kid), C = cur.hat || (cur.hat = { i: 0, sc: { g: 0, s: 0, r: 0, h: 0 } });
    var h = '<section class="hello"><p class="eyebrow">Школа волшебства</p><h1>🎩 Распределяющая шляпа</h1></section>';
    if (C.show && H.house) { var hs = HOUSES[H.house];
      return h + '<article class="card hatres h-' + H.house + '"><div class="hatcrest">' + hs.e + '</div><h2>Ты — ' + hs.who + '!</h2><p>Факультет <b>' + hs.n + '</b>. Основатель — ' + hs.fnd + '. Здесь ценят ' + hs.val + '.</p><p>Теперь приложение встречает тебя цветами твоего факультета, а за верные ответы очки идут ' + hs.d + '.</p>' +
        '<div class="row"><button class="btn" data-act="home">На главную</button> <button class="btn ghost" data-act="hatagain">Пройти распределение заново</button></div></article>'; }
    if (C.i < HAT_Q.length) { var q = HAT_Q[C.i], ord = U.rng('hat' + C.i + (H.house || '')).shuffle(q[1]);
      return h + '<div class="counter">Вопрос ' + (C.i + 1) + ' из ' + HAT_Q.length + '</div><article class="card task"><p class="hint">Шляпа заглядывает в твои мысли… Отвечай честно — правильных ответов здесь нет.</p><div class="q">' + q[0] + '</div><div class="opts hatopts">' +
        ord.map(function(o){ return '<button class="opt" data-act="hatans" data-v="' + o[1] + '">' + o[0] + '</button>'; }).join('') + '</div></article>'; }
    var best = ['g', 's', 'r', 'h'].sort(function(a, b2){ return C.sc[b2] - C.sc[a]; }), top = best.filter(function(k){ return C.sc[k] === C.sc[best[0]]; });
    var say = top.length > 1 ? 'Хм… Непросто, очень непросто! Ты подходишь сразу ' + (top.length === 2 ? 'двум' : 'нескольким') + ' факультетам: ' + top.map(function(k){ return HOUSES[k].e + ' ' + HOUSES[k].n; }).join(' и ') + '. Шляпа слушает и твоё желание — выбирай сама.' :
      'Шляпа думает… ' + HOUSES[top[0]].e + ' <b>' + HOUSES[top[0]].n.toUpperCase() + '!</b> Но Шляпа всегда учитывает и желание ученика. Если сердце просит другой факультет — выбери его.';
    return h + '<article class="card"><p class="hatsay">' + say + '</p><div class="hatpick">' + ['g', 's', 'r', 'h'].map(function(k){ var x = HOUSES[k];
      return '<button class="hatbtn h-' + k + (top.indexOf(k) >= 0 ? ' rec' : '') + '" data-act="hatset" data-v="' + k + '"><span class="hatcrest">' + x.e + '</span><b>' + x.n + '</b><small>' + x.val + '</small><small>совпало ответов: ' + C.sc[k] + ' из ' + HAT_Q.length + '</small></button>'; }).join('') + '</div></article>'; },
  act: function(act, b){ var kid = cur.kid; if (!hpOn(kid)) return; var H = hpK(kid), C = cur.hat || (cur.hat = { i: 0, sc: { g: 0, s: 0, r: 0, h: 0 } });
    if (act === 'hatans') { C.sc[b.getAttribute('data-v')]++; C.i++; render(); window.scrollTo(0, 0); }
    else if (act === 'hatagain') { cur.hat = { i: 0, sc: { g: 0, s: 0, r: 0, h: 0 } }; render(); }
    else if (act === 'hatset') { var v = b.getAttribute('data-v'); if (!HOUSES[v]) return; var old = H.house; H.house = v; hpApply(); C.show = 1;
      ev(kid, 'факультет', { subj: 'Гарри Поттер', text: HOUSES[v].n + (old && old !== v ? ' (был ' + HOUSES[old].n + ')' : '') + '; тест: ' + ['g', 's', 'r', 'h'].map(function(k){ return HOUSES[k].n + ' ' + C.sc[k]; }).join(', ') });
      save(); render(); window.scrollTo(0, 0); } }
});
