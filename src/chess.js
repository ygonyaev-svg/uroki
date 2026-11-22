/* ===== Шахматы: правила, задачи, курс для начинающих, игра вдвоём за одним экраном =====
   Написано на ES5 (var, function), чтобы работало на старом Safari. */
var CH = (function(){
  var FILES = 'abcdefgh';
  var GL = { k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟' };
  var NAME = { k:'король', q:'ферзь', r:'ладья', b:'слон', n:'конь', p:'пешка' };
  var NAME_V = { k:'короля', q:'ферзя', r:'ладью', b:'слона', n:'коня', p:'пешку' };
  var VAL = { p:1, n:3, b:3, r:5, q:9, k:0 };
  function sqName(i){ return FILES.charAt(i & 7) + ((i >> 3) + 1); }
  function sqIdx(s){ return (parseInt(s.charAt(1), 10) - 1) * 8 + FILES.indexOf(s.charAt(0)); }
  function colorOf(p){ return !p ? '' : (p === p.toUpperCase() ? 'w' : 'b'); }
  function typeOf(p){ return p ? p.toLowerCase() : ''; }
  function other(c){ return c === 'w' ? 'b' : 'w'; }

  /* ---- позиция ---- */
  function parse(fen){
    var f = fen.split(' '), rows = f[0].split('/'), b = [], i, r, c, ch, j;
    for (i = 0; i < 64; i++) b.push('');
    for (r = 0; r < 8; r++) { c = 0; for (j = 0; j < rows[r].length; j++) { ch = rows[r].charAt(j);
      if (/\d/.test(ch)) c += +ch; else { b[(7 - r) * 8 + c] = ch; c++; } } }
    return { b:b, t:f[1] || 'w', c:(f[2] && f[2] !== '-') ? f[2] : '', ep:(f[3] && f[3] !== '-') ? sqIdx(f[3]) : -1, h:+(f[4] || 0), n:+(f[5] || 1) };
  }
  function fen(P){
    var s = '', r, c, e, p;
    for (r = 7; r >= 0; r--) { e = 0; for (c = 0; c < 8; c++) { p = P.b[r * 8 + c]; if (!p) e++; else { if (e) s += e; e = 0; s += p; } } if (e) s += e; if (r) s += '/'; }
    return s + ' ' + P.t + ' ' + (P.c || '-') + ' ' + (P.ep >= 0 ? sqName(P.ep) : '-') + ' ' + P.h + ' ' + P.n;
  }
  function clone(P){ return { b:P.b.slice(), t:P.t, c:P.c, ep:P.ep, h:P.h, n:P.n }; }
  function kingSq(P, col){ var k = col === 'w' ? 'K' : 'k'; for (var i = 0; i < 64; i++) if (P.b[i] === k) return i; return -1; }

  var ND = [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
  var KD = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  var RD = [[1,0],[-1,0],[0,1],[0,-1]], BD = [[1,1],[1,-1],[-1,1],[-1,-1]];
  function on(f, r){ return f >= 0 && f < 8 && r >= 0 && r < 8; }

  function attacked(P, sq, by){
    var f = sq & 7, r = sq >> 3, i, d, ff, rr, p, t;
    var pr = by === 'w' ? r - 1 : r + 1, pw = by === 'w' ? 'P' : 'p';
    if (on(f - 1, pr) && P.b[pr * 8 + f - 1] === pw) return true;
    if (on(f + 1, pr) && P.b[pr * 8 + f + 1] === pw) return true;
    for (i = 0; i < 8; i++) { ff = f + ND[i][0]; rr = r + ND[i][1]; if (on(ff, rr)) { p = P.b[rr * 8 + ff]; if (p && colorOf(p) === by && typeOf(p) === 'n') return true; } }
    for (i = 0; i < 8; i++) { ff = f + KD[i][0]; rr = r + KD[i][1]; if (on(ff, rr)) { p = P.b[rr * 8 + ff]; if (p && colorOf(p) === by && typeOf(p) === 'k') return true; } }
    for (i = 0; i < 8; i++) { d = KD[i]; ff = f + d[0]; rr = r + d[1];
      while (on(ff, rr)) { p = P.b[rr * 8 + ff]; if (p) { if (colorOf(p) === by) { t = typeOf(p); if (t === 'q' || (t === 'r' && (d[0] === 0 || d[1] === 0)) || (t === 'b' && d[0] !== 0 && d[1] !== 0)) return true; } break; } ff += d[0]; rr += d[1]; } }
    return false;
  }
  function inCheck(P, col){ var k = kingSq(P, col || P.t); return k >= 0 && attacked(P, k, other(col || P.t)); }

  function pseudo(P, onlyFrom){
    var out = [], me = P.t, i, p, t, f, r, d, ff, rr, q, dir, start, last, k, j, x;
    function add(a, b, extra){ var m = { f:a, to:b, cap:P.b[b] }; if (extra) for (var z in extra) m[z] = extra[z]; out.push(m); }
    for (i = 0; i < 64; i++) {
      if (onlyFrom != null && i !== onlyFrom) continue;
      p = P.b[i]; if (!p || colorOf(p) !== me) continue; t = typeOf(p); f = i & 7; r = i >> 3;
      if (t === 'p') {
        dir = me === 'w' ? 1 : -1; start = me === 'w' ? 1 : 6; last = me === 'w' ? 7 : 0;
        rr = r + dir;
        if (on(f, rr) && !P.b[rr * 8 + f]) {
          if (rr === last) { for (j = 0; j < 4; j++) add(i, rr * 8 + f, { pr:'qrbn'.charAt(j) }); } else add(i, rr * 8 + f);
          if (r === start && !P.b[(r + 2 * dir) * 8 + f]) add(i, (r + 2 * dir) * 8 + f, { dbl:1 });
        }
        for (j = -1; j <= 1; j += 2) { ff = f + j; if (!on(ff, rr)) continue; q = rr * 8 + ff;
          if (P.b[q] && colorOf(P.b[q]) !== me) { if (rr === last) { for (k = 0; k < 4; k++) add(i, q, { pr:'qrbn'.charAt(k) }); } else add(i, q); }
          else if (q === P.ep) add(i, q, { ep:1, cap: me === 'w' ? 'p' : 'P' }); }
      } else if (t === 'n' || t === 'k') {
        x = t === 'n' ? ND : KD;
        for (j = 0; j < 8; j++) { ff = f + x[j][0]; rr = r + x[j][1]; if (!on(ff, rr)) continue; q = rr * 8 + ff; if (!P.b[q] || colorOf(P.b[q]) !== me) add(i, q); }
        if (t === 'k') {
          var home = me === 'w' ? 4 : 60, opp = other(me);
          if (i === home && P.c) {
            var KS = me === 'w' ? 'K' : 'k', QS = me === 'w' ? 'Q' : 'q', R = me === 'w' ? 'R' : 'r';
            if (P.c.indexOf(KS) >= 0 && P.b[home + 3] === R && !P.b[home + 1] && !P.b[home + 2] && !attacked(P, home, opp) && !attacked(P, home + 1, opp) && !attacked(P, home + 2, opp)) add(i, home + 2, { cs:1 });
            if (P.c.indexOf(QS) >= 0 && P.b[home - 4] === R && !P.b[home - 1] && !P.b[home - 2] && !P.b[home - 3] && !attacked(P, home, opp) && !attacked(P, home - 1, opp) && !attacked(P, home - 2, opp)) add(i, home - 2, { cs:2 });
          }
        }
      } else {
        x = t === 'r' ? RD : t === 'b' ? BD : KD;
        for (j = 0; j < x.length; j++) { d = x[j]; ff = f + d[0]; rr = r + d[1];
          while (on(ff, rr)) { q = rr * 8 + ff; if (P.b[q]) { if (colorOf(P.b[q]) !== me) add(i, q); break; } add(i, q); ff += d[0]; rr += d[1]; } }
      }
    }
    return out;
  }
  function make(P, m){
    var N = clone(P), p = N.b[m.f], me = P.t, t = typeOf(p);
    N.b[m.to] = m.pr ? (me === 'w' ? m.pr.toUpperCase() : m.pr) : p; N.b[m.f] = '';
    if (m.ep) N.b[m.to + (me === 'w' ? -8 : 8)] = '';
    if (m.cs === 1) { N.b[m.to - 1] = N.b[m.to + 1]; N.b[m.to + 1] = ''; }
    if (m.cs === 2) { N.b[m.to + 1] = N.b[m.to - 2]; N.b[m.to - 2] = ''; }
    N.ep = m.dbl ? (m.f + m.to) / 2 : -1;
    if (t === 'k') N.c = N.c.replace(me === 'w' ? /[KQ]/g : /[kq]/g, '');
    function rk(sq, ch){ if (m.f === sq || m.to === sq) N.c = N.c.replace(ch, ''); }
    rk(0, 'Q'); rk(7, 'K'); rk(56, 'q'); rk(63, 'k');
    N.h = (t === 'p' || m.cap) ? 0 : P.h + 1; if (me === 'b') N.n++; N.t = other(me);
    return N;
  }
  /* без короля (упражнения курса) ходы проверяются только по правилам фигур */
  function legal(P, onlyFrom){
    var me = P.t, res = [], ms = pseudo(P, onlyFrom), i, N;
    if (kingSq(P, me) < 0) return ms;
    for (i = 0; i < ms.length; i++) { N = make(P, ms[i]); if (!inCheck(N, me)) res.push(ms[i]); }
    return res;
  }
  function uci(m){ return sqName(m.f) + sqName(m.to) + (m.pr || ''); }
  function findMove(P, u){ var ms = legal(P), i; for (i = 0; i < ms.length; i++) if (uci(ms[i]) === u) return ms[i]; return null; }
  function insufficient(P){
    var minors = 0, i, t, bish = [];
    for (i = 0; i < 64; i++) { t = typeOf(P.b[i]); if (!t || t === 'k') continue; if (t === 'p' || t === 'r' || t === 'q') return false; minors++; if (t === 'b') bish.push(((i & 7) + (i >> 3)) % 2); }
    if (minors <= 1) return true;
    if (minors === bish.length) { for (i = 1; i < bish.length; i++) if (bish[i] !== bish[0]) return false; return true; }
    return false;
  }
  function status(P, hist){
    var ms = legal(P), chk = inCheck(P);
    if (!ms.length) return chk ? 'mate' : 'stalemate';
    if (insufficient(P)) return 'material';
    if (P.h >= 100) return 'fifty';
    if (hist) { var key = fen(P).split(' ').slice(0, 4).join(' '), n = 0; for (var i = 0; i < hist.length; i++) if (hist[i] === key) n++; if (n >= 3) return 'repeat'; }
    return chk ? 'check' : '';
  }
  function posKey(P){ return fen(P).split(' ').slice(0, 4).join(' '); }
  function moveText(P, m){
    var p = P.b[m.f], t = typeOf(p), s;
    if (m.cs) return m.cs === 1 ? 'короткая рокировка' : 'длинная рокировка';
    s = (t === 'p' ? 'пешка' : NAME[t]) + ' ' + sqName(m.f) + (m.cap ? ' бьёт ' + sqName(m.to) : ' — ' + sqName(m.to));
    if (m.pr) s += ', превращение в ' + NAME_V[m.pr];
    return s;
  }
  return { parse:parse, fen:fen, clone:clone, legal:legal, make:make, inCheck:inCheck, status:status, uci:uci, findMove:findMove, sqName:sqName, sqIdx:sqIdx,
    colorOf:colorOf, typeOf:typeOf, other:other, GL:GL, NAME:NAME, NAME_V:NAME_V, VAL:VAL, kingSq:kingSq, posKey:posKey, moveText:moveText, attacked:attacked };
})();

/* ===== Доска на экране ===== */
var CHB = {
  /* o: { P, flip (чёрные снизу), sel, marks:{sq:'dot'|'star'|...}, last:[f,to], rot (повернуть чёрные фигуры к игроку сверху), act } */
  zm: function(vw){ return vw >= 1250 ? 1.3 : vw >= 960 ? 1.2 : vw >= 760 ? 1.05 : 1; },
  html: function(o){
    var vw = window.innerWidth || 800, vh = window.innerHeight || 800, W = o.rot != null ? (vw >= 700 && vw > vh * 1.15 ? Math.min(vh - 90, vw - 480) : Math.min(vw - 40, vh - 340, 760)) : Math.min(vw / CHB.zm(vw) - 56, 560, Math.max(280, vh / CHB.zm(vw) - 300)); /* .wrap увеличен zoom'ом (style.css) — делим, чтобы доска с кнопками влезала по высоте (iPad 1024×768) */
    W = Math.max(240, Math.floor(W / 8) * 8);
    var P = o.P, h = '<div class="chboard' + (o.rot ? ' rot' : '') + '" style="width:' + W + 'px;font-size:' + Math.round(W / 8 * .78) + 'px">', r, c, rr, cc, i, p, cls, lg = {}, ms, k, chk = -1;
    if (o.sel != null) { ms = CH.legal(P, o.sel); for (k = 0; k < ms.length; k++) lg[ms[k].to] = ms[k].cap ? 'chx' : 'chd'; }
    if (!o.noCheck && CH.inCheck(P)) chk = CH.kingSq(P, P.t);
    for (r = 7; r >= 0; r--) for (c = 0; c < 8; c++) {
      rr = o.flip ? 7 - r : r; cc = o.flip ? 7 - c : c; i = rr * 8 + cc; p = P.b[i];
      cls = 'sq ' + ((rr + cc) % 2 ? 'l' : 'd');
      if (o.sel === i) cls += ' sel';
      if (o.last && (o.last[0] === i || o.last[1] === i)) cls += ' last';
      if (chk === i) cls += ' chk';
      if (o.hint === i) cls += ' hnt';
      h += '<button class="' + cls + '" data-act="' + (o.act || 'chsq') + '" data-sq="' + i + '">';
      if ((o.flip ? r === 0 : r === 0) && !o.noCoord) h += '<i class="cf">' + 'abcdefgh'.charAt(cc) + '</i>';
      if (c === 0 && !o.noCoord) h += '<i class="cr">' + (rr + 1) + '</i>';
      if (o.marks && o.marks[i]) h += '<i class="mk ' + o.marks[i] + '"></i>';
      if (p) h += '<span class="pc ' + CH.colorOf(p) + '">' + CH.GL[CH.typeOf(p)] + '︎</span>';
      if (lg[i]) h += '<i class="' + lg[i] + '"></i>';
      h += '</button>';
    }
    return h + '</div>';
  },
  promo: function(col, act){ var h = '<div class="chpromo">', s = 'qrbn', i; for (i = 0; i < 4; i++) h += '<button class="btn ghost" data-act="' + act + '" data-p="' + s.charAt(i) + '"><span class="pc ' + col + '">' + CH.GL[s.charAt(i)] + '︎</span></button>'; return h + '</div>'; }
};

/* ===== Состояние и баллы ===== */
var CHESS_DAY_MAX = 5;
function chK(kid){ var K = S.kids[kid]; if (!K.chess) K.chess = { solved:{}, pos:{}, course:{}, day:'', pts:0, n:0 }; return K.chess; }
function chPts(kid, n){
  if (!kid || !n) return 0;
  if (typeof funPts === 'function') return funPts(kid, 'chess', n, CHESS_DAY_MAX) || 0;
  var C = chK(kid), t = U.today(); if (C.day !== t) { C.day = t; C.pts = 0; }
  var g = Math.max(0, Math.min(n, CHESS_DAY_MAX - C.pts)); if (!g) return 0; C.pts += g;
  piggyAdd(S.kids[kid], g); return g;
}
function chDayLeft(kid){ if (typeof funLeft === 'function') return funLeft(kid, 'chess'); var C = chK(kid); return C.day === U.today() ? Math.max(0, CHESS_DAY_MAX - C.pts) : CHESS_DAY_MAX; }

/* ===== Уровни задач ===== */
var CH_LEVELS = [
  { id:'m1e', t:'Мат в 1 ход: первые шаги', d:'Мало фигур, нужно найти один матующий ход', y:1 },
  { id:'hang', t:'Забери фигуру', d:'У соперника фигура без защиты. Найди и съешь её', y:1 },
  { id:'m1', t:'Мат в 1 ход', d:'Позиции из настоящих партий', y:1, a:1 },
  { id:'m2', t:'Мат в 2 хода', d:'Первый ход готовит мат, второй ставит его', y:1, a:1 },
  { id:'tac', t:'Тактика: выиграй материал', d:'Вилки, связки, двойные удары. Найди лучший ход', a:1 },
  { id:'m3', t:'Мат в 3 хода', d:'Для сильных: три точных хода подряд', a:1 }
];
function chGoal(lv){ return lv === 'hang' ? 'Белые начинают и забирают фигуру' : lv === 'tac' ? 'Белые начинают и выигрывают материал' : lv === 'm1' || lv === 'm1e' ? 'Белые начинают и ставят мат в 1 ход' : lv === 'm2' ? 'Белые начинают и ставят мат в 2 хода' : 'Белые начинают и ставят мат в 3 хода'; }

/* ===== Экран шахмат ===== */
var CHS = { v:'menu' };   /* текущее состояние экрана шахмат (не сохраняется) */
function chOpen(kid){ CHS = { v: kid ? 'menu' : 'table' }; }

function chView(kid){
  var h = '<main class="wrap chess ' + (kid || '') + '">';
  if (CHS.v === 'table') return chTable(kid);
  h += '<header class="bar"><button class="link" data-act="' + (CHS.v === 'menu' ? 'home' : 'chmenu') + '">← ' + (CHS.v === 'menu' ? 'Назад' : 'Шахматы') + '</button>' + (kid ? '<span class="coins">' + coinsHtml(S.kids[kid].coins) + '</span>' : '') + '</header>';
  if (CHS.v === 'menu') h += chMenu(kid);
  else if (CHS.v === 'pz') h += chPuzzle(kid);
  else if (CHS.v === 'course') h += chCourseList(kid);
  else if (CHS.v === 'cl') h += chLesson(kid);
  return h + '</main>';
}
function chMenu(kid){
  var C = chK(kid), h = '<section class="hello"><h1>♞ Шахматы</h1><p>Здесь можно заниматься всегда, даже в перерыв. ' + (LIB_NOTE + ' ') + (false ? 'За задачи, решённые с первой попытки без подсказки, — по 1 баллу в копилку (до ' + CHESS_DAY_MAX + ' в день, сегодня осталось ' + chDayLeft(kid) + ').' : '') + '</p></section>';
  var mine = T(kid) === 'yarik', i, L, n, tot, done;
  var cdone = 0; for (i = 0; i < CH_COURSE.length; i++) if (C.course[CH_COURSE[i].id]) cdone++;
  var courseTile = '<button class="tile chtile" data-act="chcourse"><span class="ico">♙</span><span class="tt"><span class="sn">Учимся играть' + (mine ? ' <em>начни здесь</em>' : '') + '</span><span class="ut">Как ходят фигуры, шах, мат, рокировка. Уроков пройдено: ' + cdone + ' из ' + CH_COURSE.length + '</span></span></button>';
  var tableTile = '<button class="tile chtile" data-act="chtable"><span class="ico">♚</span><span class="tt"><span class="sn">Играть вдвоём</span><span class="ut">Положите планшет между собой: у каждого свои фигуры лицом к себе</span></span></button>';
  h += '<section class="tiles">' + (mine ? courseTile : '') + tableTile + '</section><h2>Задачи</h2><section class="tiles">';
  for (i = 0; i < CH_LEVELS.length; i++) { L = CH_LEVELS[i]; tot = (CHESS_PUZ[L.id] || []).length; if (!tot) continue; done = chSolvedIn(C, L.id);
    var rec = (mine && L.y && !L.a) || (!mine && L.a && L.id !== 'm1');
    h += '<button class="tile chtile' + (done >= tot ? ' done' : '') + '" data-act="chlevel" data-l="' + L.id + '"><span class="ico">' + (i + 1) + '</span><span class="tt"><span class="sn">' + L.t + (rec ? ' <em>для тебя</em>' : '') + '</span><span class="ut">' + L.d + '. Решено ' + done + ' из ' + tot + '</span></span></button>'; }
  h += '</section>' + (mine ? '' : '<section class="tiles">' + courseTile + '</section>');
  return h;
}
function chSolvedIn(C, lv){ var n = 0, k; for (k in C.solved) if (k.indexOf(lv + ':') === 0) n++; return n; }

/* ---- задача ---- */
function chPzStart(kid, lv, idx){
  var C = chK(kid), list = CHESS_PUZ[lv], i;
  if (idx == null) { idx = C.pos[lv] || 0; for (i = 0; i < list.length; i++) { var j = (idx + i) % list.length; if (!C.solved[lv + ':' + j]) { idx = j; break; } } }
  idx = idx % list.length;
  CHS = { v:'pz', lv:lv, i:idx, P:CH.parse(list[idx].f), ply:0, sel:null, msg:'', ok:null, first:true, hint:null, last:null, busy:false };
}
function chPuzzle(kid){
  var lv = CHS.lv, z = CHESS_PUZ[lv][CHS.i], C = chK(kid), solved = !!C.solved[lv + ':' + CHS.i];
  var h = '<div class="card chpz"><p class="eyebrow">' + CH_LEVELS.filter(function(x){ return x.id === lv; })[0].t + ' · задача ' + (CHS.i + 1) + ' из ' + CHESS_PUZ[lv].length + (solved && CHS.ok !== true ? ' · уже решена' : '') + '</p><h2>' + chGoal(lv) + '</h2>';
  h += CHB.html({ P:CHS.P, sel:CHS.sel, last:CHS.last, hint:CHS.hint });
  if (CHS.promo) h += CHB.promo('w', 'chpzpromo');
  h += '<div class="chmsg ' + (CHS.ok === true ? 'ok' : CHS.ok === false ? 'try' : '') + '">' + (CHS.msg || (lv === 'm2' || lv === 'm3' ? 'Соперник будет защищаться. Ходи фигурой: нажми на неё, потом на клетку.' : 'Нажми на фигуру, потом на клетку, куда она пойдёт.')) + '</div>';
  h += '<p class="chbtns">';
  if (CHS.ok === true) h += '<button class="btn" data-act="chpznext">Следующая задача →</button>';
  else { h += '<button class="btn ghost small" data-act="chpzhint">💡 Подсказка</button> <button class="btn ghost small" data-act="chpzreset">↺ Сначала</button> <button class="btn ghost small" data-act="chpzshow">Показать решение</button>'; }
  h += ' <button class="btn ghost small" data-act="chpzskip">Другая задача</button></p></div>';
  return h;
}
/* Проверка «другого верного решения»: в задачах на мат засчитываем любой ход, после которого мат неизбежен за оставшиеся ходы
   (иначе ребёнка ругали бы за верный, но не «авторский» ход); в «Забери фигуру» — взятие той же фигуры другим способом, если оно не хуже. */
function chForce(P, n){ var ms = CH.legal(P), i, j, Q, st, rs, ok;
  for (i = 0; i < ms.length; i++) { Q = CH.make(P, ms[i]); st = CH.status(Q); if (st === 'mate') return true;
    if (n > 1 && st !== 'stalemate' && st !== 'material') { rs = CH.legal(Q); ok = rs.length > 0; for (j = 0; j < rs.length && ok; j++) if (!chForce(CH.make(Q, rs[j]), n - 1)) ok = false; if (ok) return true; } }
  return false; }
function chAllMate(Q, n){ var st = CH.status(Q); if (st === 'mate') return true; if (n < 1 || st === 'stalemate' || st === 'material') return false; var rs = CH.legal(Q), j; if (!rs.length) return false; for (j = 0; j < rs.length; j++) if (!chForce(CH.make(Q, rs[j]), n)) return false; return true; }
function chMatEv(P){ var s = 0, i, p; for (i = 0; i < 64; i++) { p = P.b[i]; if (p) s += (CH.colorOf(p) === P.t ? 1 : -1) * CH.VAL[CH.typeOf(p)]; } return s; }
function chQS(P, a, b, d){ var ms = CH.legal(P); if (!ms.length) return CH.inCheck(P) ? -100 : 0; var sp = chMatEv(P), i, v; if (d <= 0) { if (sp >= b) return sp; if (sp > a) a = sp; }
  var best = d <= 0 ? sp : -1e9; for (i = 0; i < ms.length; i++) { if (d <= 0 && !ms[i].cap && !ms[i].pr) continue; v = -chQS(CH.make(P, ms[i]), -b, -a, d - 1); if (v > best) best = v; if (v > a) a = v; if (a >= b) break; } return best; }
function chFreeReply(P, n){ var rs = CH.legal(P), i; for (i = 0; i < rs.length; i++) if (n <= 1 || !chForce(CH.make(P, rs[i]), 1)) return rs[i]; return rs[0]; }
function chPzMove(kid, m){
  var lv = CHS.lv, z = CHESS_PUZ[lv][CHS.i], sol = z.s, u = CH.uci(m), P1 = CH.make(CHS.P, m), mateLv = lv.charAt(0) === 'm';
  var good, final;
  var left = Math.ceil((sol.length - CHS.ply) / 2);
  if (mateLv) { final = CH.status(P1) === 'mate'; good = final || (!CHS.free && u === sol[CHS.ply]);
    if (!good && left > 1 && chAllMate(P1, left - 1)) { good = true; CHS.free = true; } }
  else { good = u === sol[0];
    if (!good && lv === 'hang') { var m0 = CH.findMove(CHS.P, sol[0]); if (m0 && m.cap && m.to === m0.to && -chQS(P1, -1e9, 1e9, 1) >= -chQS(CH.make(CHS.P, m0), -1e9, 1e9, 1)) good = true; }
    final = good; }
  if (!good) {
    CHS.first = false; CHS.sel = null;
    CHS.msg = CH.status(P1) === 'stalemate' ? 'Это пат: у соперника нет ходов, но и шаха нет. Это ничья! Найди мат.' : mateLv && CH.inCheck(P1) ? 'Шах, но не мат: король может уйти или закрыться. Попробуй другой ход.' : 'Не то. Подумай ещё: ' + (mateLv ? 'какой ход не оставит королю ни одной клетки?' : 'какая фигура соперника стоит без защиты или может попасть под двойной удар?');
    CHS.ok = false; render(); return;
  }
  CHS.P = P1; CHS.last = [m.f, m.to]; CHS.sel = null; CHS.hint = null; CHS.ply++;
  if (final) { chPzSolved(kid, lv, mateLv ? 'Мат! ' : '');
    if (lv === 'tac' && sol.length >= 3) { chPzAuto(sol.slice(1, 3), 'Дальше: ', ['соперник — ', 'ты — ']); }
    return; }
  CHS.msg = 'Верно! Теперь ход соперника…'; CHS.ok = null; CHS.busy = true; render();
  setTimeout(function(){ var r = CHS.free ? chFreeReply(CHS.P, Math.ceil((sol.length - CHS.ply) / 2)) : CH.findMove(CHS.P, sol[CHS.ply]); if (!r) { CHS.busy = false; return; } CHS.msg = 'Соперник: ' + CH.moveText(CHS.P, r) + '. Твой ход!'; CHS.P = CH.make(CHS.P, r); CHS.last = [r.f, r.to]; CHS.ply++; CHS.busy = false; if (cur.view === 'always') render(); }, 700);
}
function chPzAuto(moves, pre, who){
  CHS.busy = true; var i = 0, txt = [];
  function step(){ if (i >= moves.length || cur.view !== 'always' || CHS.v !== 'pz') { CHS.busy = false; return; } var m = CH.findMove(CHS.P, moves[i]); if (!m) { CHS.busy = false; return; }
    txt.push((who ? who[i % 2] : '') + CH.moveText(CHS.P, m)); CHS.P = CH.make(CHS.P, m); CHS.last = [m.f, m.to]; i++; CHS.msg = CHS.msg0 + '<br><small>' + pre + txt.join(', ') + '.</small>'; render(); setTimeout(step, 900); }
  CHS.msg0 = CHS.msg; setTimeout(step, 900);
}
function chPzSolved(kid, lv, pre){
  var C = chK(kid), key = lv + ':' + CHS.i, was = !!C.solved[key], pts = 0;
  if (!was) { C.solved[key] = 1; C.n = (C.n || 0) + 1; if (CHS.first) pts = chPts(kid, 1); }
  C.pos[lv] = CHS.i + 1;
  CHS.ok = true; CHS.msg = pre + (CHS.first ? 'Отлично, с первой попытки!' : 'Решено!') + (pts ? ' +1 балл в копилку.' : was ? '' : '');
  if (!was) ev(kid, 'шахматы', { subj:'Шахматы', unit: CH_LEVELS.filter(function(x){ return x.id === lv; })[0].t, text:'задача ' + (CHS.i + 1) + (CHS.first ? ' с первой попытки' : ' не с первой попытки'), coins: S.kids[kid].coins, price: pts || 0 });
  save(); render();
}
function chPzHint(){
  var z = CHESS_PUZ[CHS.lv][CHS.i], m = CHS.free ? null : CH.findMove(CHS.P, z.s[CHS.ply]), left = Math.ceil((z.s.length - CHS.ply) / 2), ms, i;
  if (CHS.free) { ms = CH.legal(CHS.P); for (i = 0; i < ms.length && !m; i++) if (chAllMate(CH.make(CHS.P, ms[i]), left - 1)) m = ms[i]; }
  if (!m) return;
  CHS.first = false; CHS.hint = m.f; CHS.sel = null; CHS.msg = 'Подсказка: ходить нужно этой фигурой (' + CH.NAME[CH.typeOf(CHS.P.b[m.f])] + ').'; render();
}
function chPzShow(kid){
  var z = CHESS_PUZ[CHS.lv][CHS.i]; CHS.first = false; CHS.P = CH.parse(z.f); CHS.ply = 0; CHS.free = false; CHS.sel = null; CHS.hint = null; CHS.msg = 'Решение:'; CHS.ok = null;
  var seq = CHS.lv.charAt(0) === 'm' ? z.s : z.s.slice(0, 3); chPzAuto(seq, ''); render();
}

/* ---- игра вдвоём ---- */
function chTabG(){ if (!S.chessT || !S.chessT.f) S.chessT = { f: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', hist:[], keys:[], moves:[], last:null, rot:true, end:'' }; return S.chessT; }
function chTable(kid){
  var G = chTabG(), P = CH.parse(G.f), st = G.end || CH.status(P, G.keys), turn = P.t;
  var capW = '', capB = '', i, cnt = { w:{}, b:{} }, start = { p:8, n:2, b:2, r:2, q:1 }, t;
  for (i = 0; i < 64; i++) if (P.b[i]) { t = CH.typeOf(P.b[i]); cnt[CH.colorOf(P.b[i])][t] = (cnt[CH.colorOf(P.b[i])][t] || 0) + 1; }
  for (t in start) { for (i = 0; i < start[t] - (cnt.b[t] || 0); i++) capW += CH.GL[t] + '︎'; for (i = 0; i < start[t] - (cnt.w[t] || 0); i++) capB += CH.GL[t] + '︎'; }
  function msg(col){
    if (st === 'mate') return turn === col ? 'Мат. Ты проиграл(а) — сыграем ещё?' : '🏆 Мат! Ты победил(а)!';
    if (st === 'stalemate') return 'Пат — ничья 🤝';
    if (st === 'material') return 'Ничья: никто не сможет поставить мат 🤝';
    if (st === 'fifty') return 'Ничья: 50 ходов без взятий 🤝';
    if (st === 'repeat') return 'Ничья: позиция повторилась 3 раза 🤝';
    if (st === 'resign-w') return col === 'w' ? 'Ты сдался(ась)' : '🏆 Соперник сдался!';
    if (st === 'resign-b') return col === 'b' ? 'Ты сдался(ась)' : '🏆 Соперник сдался!';
    if (st === 'draw') return 'Ничья по согласию 🤝';
    if (turn === col) return st === 'check' ? '⚠ Тебе шах! Защити короля' : 'Твой ход';
    return 'Ход соперника…';
  }
  function side(col){
    var mine = turn === col && !G.end && st !== 'mate' && st !== 'stalemate';
    return '<div class="chside ' + col + (mine ? ' turn' : '') + (G.rot && col === 'b' ? ' up' : '') + '"><div class="chst"><b>' + (col === 'w' ? 'Белые' : 'Чёрные') + '</b> · ' + msg(col) + '</div><div class="chcap">' + (col === 'w' ? capW : capB) + '</div>' +
      (CHS.promo && turn === col ? CHB.promo(col, 'chtpromo') : '') +
      '<div class="chbtns"><button class="btn ghost small" data-act="chtundo">↶ Отменить ход</button> ' + (isOver() ? '<button class="btn small" data-act="chtnew">Новая партия</button>' : '<button class="btn ghost small" data-act="chtresign" data-c="' + col + '">Сдаться</button> <button class="btn ghost small" data-act="chtdraw">Ничья</button>') + '</div></div>';
  }
  function isOver(){ return !!G.end || st === 'mate' || st === 'stalemate' || st === 'material' || st === 'fifty' || st === 'repeat'; }
  var h = '<main class="wrap chess table ' + (kid || '') + '"><header class="bar"><button class="link" data-act="' + (kid ? 'chmenu' : 'chlogin') + '">← Назад</button><button class="link" data-act="chtrot">' + (G.rot ? '🔄 Фигуры: лицом к каждому' : '🔄 Фигуры: все в одну сторону') + '</button></header>';
  h += '<div class="chtbl">' + side('b') + CHB.html({ P:P, sel:isOver() ? null : CHS.sel, last:G.last, rot:G.rot, act:'chtsq' }) + side('w') + '</div></main>';
  return h;
}
function chTabMove(m){
  var G = chTabG(), P = CH.parse(G.f), N = CH.make(P, m);
  G.hist.push(G.f); G.keys.push(CH.posKey(P)); G.moves.push(CH.uci(m)); G.f = CH.fen(N); G.last = [m.f, m.to]; G.end = ''; CHS.sel = null; CHS.promo = null;
  var st = CH.status(N, G.keys.concat([CH.posKey(N)]));
  if (st === 'mate' || st === 'stalemate') { var kid = cur.kid; if (kid) ev(kid, 'шахматы', { subj:'Шахматы', unit:'игра вдвоём', text: st === 'mate' ? 'мат, победили ' + (N.t === 'w' ? 'чёрные' : 'белые') : 'пат' }); }
  save(); render();
}

/* ---- курс ---- */
function chCourseList(kid){
  var C = chK(kid), h = '<section class="hello"><h1>♙ Учимся играть в шахматы</h1><p>Проходи уроки по порядку. В каждом — короткое объяснение и задания на доске.</p></section><section class="tiles">', i, L, done, open;
  for (i = 0; i < CH_COURSE.length; i++) { L = CH_COURSE[i]; done = !!C.course[L.id]; open = i === 0 || C.course[CH_COURSE[i - 1].id] || done;
    h += '<button class="tile chtile ' + (done ? 'done' : open ? '' : 'locked') + '" data-act="chlesson" data-i="' + i + '"' + (open ? '' : ' aria-disabled="true"') + '><span class="ico">' + L.ico + '</span><span class="tt"><span class="sn">' + (i + 1) + '. ' + L.t + '</span><span class="ut">' + L.d + '</span></span>' + (done ? '<span class="mark m5">✓</span>' : '') + '</button>'; }
  return h + '</section>';
}
function chLessonStart(i){ CHS = { v:'cl', li:i, si:0 }; chStepInit(); }
function chStepInit(){
  var st = CH_COURSE[CHS.li].steps[CHS.si]; CHS.sel = null; CHS.ok = null; CHS.msg = ''; CHS.last = null; CHS.hint = null; CHS.qa = null; CHS.promo = null;
  if (st.fen) CHS.P = CH.parse(st.fen.indexOf(' ') > 0 ? st.fen : st.fen + ' w - - 0 1');
  if (st.stars) { CHS.stars = {}; for (var k = 0; k < st.stars.length; k++) CHS.stars[CH.sqIdx(st.stars[k])] = 1; CHS.nm = 0; }
}
function chLesson(kid){
  var L = CH_COURSE[CHS.li], st = L.steps[CHS.si], h = '<div class="card chpz"><p class="eyebrow">Урок ' + (CHS.li + 1) + ': ' + L.t + ' · шаг ' + (CHS.si + 1) + ' из ' + L.steps.length + '</p>';
  if (st.h) h += '<div class="chtext">' + st.h + ' ' + sayGate('ch' + CHS.li + '-' + CHS.si, '<button class="link" data-act="chsay">🔊</button>') + '</div>';
  if (st.fen) { var mk = {}, k; if (CHS.stars) for (k in CHS.stars) mk[k] = 'star'; if (st.mk) for (k = 0; k < st.mk.length; k++) mk[CH.sqIdx(st.mk[k])] = 'ring';
    h += CHB.html({ P:CHS.P, sel:CHS.sel, last:CHS.last, marks:mk, hint:CHS.hint, noCheck: st.t === 'stars' }); }
  if (CHS.promo) h += CHB.promo('w', 'chlpromo');
  if (st.t === 'quiz') { h += '<div class="opts">'; for (var j = 0; j < st.o.length; j++) { var cls = CHS.qa == null ? '' : st.o[j] === st.a ? ' right' : ''; h += '<button class="opt' + cls + '" data-act="chquiz" data-v="' + U.esc(st.o[j]) + '">' + st.o[j] + '</button>'; } h += '</div>'; }
  if (CHS.msg) h += '<div class="chmsg ' + (CHS.ok ? 'ok' : 'try') + '">' + CHS.msg + '</div>';
  var canNext = st.t === 'text' || CHS.ok;
  h += '<p class="chbtns">' + (canNext ? '<button class="btn" data-act="chlnext">' + (CHS.si + 1 < L.steps.length ? 'Дальше →' : 'Урок пройден ✓') + '</button>' : '') + (st.t !== 'text' && st.t !== 'quiz' && !CHS.ok ? ' <button class="btn ghost small" data-act="chlreset">↺ Сначала</button>' : '') + (CHS.si > 0 ? ' <button class="btn ghost small" data-act="chlprev">← Назад</button>' : '') + '</p></div>';
  return h;
}
function chLessonMove(kid, m){
  var st = CH_COURSE[CHS.li].steps[CHS.si], P1 = CH.make(CHS.P, m), u = CH.uci(m);
  if (st.t === 'stars') {
    P1.t = 'w'; P1.ep = -1; CHS.P = P1; CHS.last = [m.f, m.to]; CHS.sel = m.to; CHS.nm++;
    if (CHS.stars[m.to]) delete CHS.stars[m.to];
    var left = 0, k; for (k in CHS.stars) left++;
    if (!left) { CHS.ok = true; CHS.sel = null; CHS.msg = 'Все звёзды собраны за ' + CHS.nm + ' ' + U.pl(CHS.nm, 'ход', 'хода', 'ходов') + '! ' + (st.best && CHS.nm <= st.best ? 'Это самый короткий путь 👍' : st.best ? 'А можно быстрее: за ' + st.best + '. Попробуй ещё раз или иди дальше.' : ''); }
    else CHS.msg = 'Осталось звёзд: ' + left;
    CHS.ok = !left ? true : null; render(); return;
  }
  var good = false, s1 = CH.status(P1);
  if (st.goal === 'check') good = CH.inCheck(P1);
  else if (st.goal === 'mate') good = s1 === 'mate';
  else if (st.goal === 'escape') good = true;
  else if (st.goal === 'best') good = !!m.cap && CH.VAL[CH.typeOf(m.cap)] >= st.v;
  else if (st.goal === 'promo') good = !!m.pr;
  else if (st.goal) good = st.goal.split(',').indexOf(u.slice(0, 4)) >= 0 || st.goal.split(',').indexOf(u) >= 0;
  if (good) { CHS.P = P1; CHS.last = [m.f, m.to]; CHS.sel = null; CHS.ok = true; CHS.msg = st.ok || 'Правильно!'; }
  else { CHS.sel = null; CHS.ok = false; CHS.msg = st.no || (st.goal === 'mate' && s1 === 'stalemate' ? 'Это пат, а не мат: ничья! Найди другой ход.' : st.goal === 'mate' && CH.inCheck(P1) ? 'Шах, но королю есть куда уйти. Ищи мат.' : 'Не так. Попробуй ещё раз.'); }
  render();
}

/* ---- клики ---- */
function chAct(act, b){
  var kid = cur.kid, sq = b && b.getAttribute('data-sq') != null ? +b.getAttribute('data-sq') : null, P, ms, i, m;
  switch (act) {
    case 'chmenu': CHS = { v:'menu' }; render(); break;
    case 'chlogin': cur.kid = null; go('login'); break;
    case 'chtable': CHS = { v:'table' }; render(); break;
    case 'chcourse': CHS = { v:'course' }; render(); break;
    case 'chlevel': chPzStart(kid, b.getAttribute('data-l')); render(); break;
    case 'chpznext': chPzStart(kid, CHS.lv, CHS.i + 1); render(); break;
    case 'chpzskip': chPzStart(kid, CHS.lv, CHS.i + 1); render(); break;
    case 'chpzreset': { var lv = CHS.lv, ix = CHS.i, f0 = CHS.first; chPzStart(kid, lv, ix); CHS.first = f0; render(); break; }
    case 'chpzhint': if (!CHS.busy) chPzHint(); break;
    case 'chpzshow': if (!CHS.busy) chPzShow(kid); break;
    case 'chsq': {
      if (CHS.busy || CHS.ok === true && CHS.v === 'pz') break;
      P = CHS.P; if (!P) break;
      if (CHS.v === 'cl') { var stp = CH_COURSE[CHS.li].steps[CHS.si];
        if (stp.t === 'text' || stp.t === 'quiz') { CHS.sel = P.b[sq] && CHS.sel !== sq ? sq : null; render(); break; }
        if (CHS.ok) break; }
      if (CHS.sel != null) {
        ms = CH.legal(P, CHS.sel); m = null; for (i = 0; i < ms.length; i++) if (ms[i].to === sq) { m = ms[i]; break; }
        if (m) { if (m.pr) { CHS.promo = { f:m.f, to:m.to }; render(); break; } CHS.promo = null; if (CHS.v === 'pz') chPzMove(kid, m); else chLessonMove(kid, m); break; }
      }
      CHS.promo = null;
      CHS.sel = P.b[sq] && CH.colorOf(P.b[sq]) === P.t && CHS.sel !== sq ? sq : null; if (CHS.v === 'pz' && CHS.ok === false) { CHS.ok = null; CHS.msg = ''; } render(); break; }
    case 'chpzpromo': case 'chlpromo': { if (!CHS.promo) break; m = CH.findMove(CHS.P, CH.sqName(CHS.promo.f) + CH.sqName(CHS.promo.to) + b.getAttribute('data-p')); CHS.promo = null; if (m) { if (act === 'chpzpromo') chPzMove(kid, m); else chLessonMove(kid, m); } break; }
    case 'chtsq': {
      var G = chTabG(); P = CH.parse(G.f); if (G.end) break; var s0 = CH.status(P, G.keys); if (s0 === 'mate' || s0 === 'stalemate' || s0 === 'material' || s0 === 'fifty' || s0 === 'repeat') break;
      if (CHS.sel != null) { ms = CH.legal(P, CHS.sel); m = null; for (i = 0; i < ms.length; i++) if (ms[i].to === sq) { m = ms[i]; break; }
        if (m) { if (m.pr) { CHS.promo = { f:m.f, to:m.to }; render(); break; } chTabMove(m); break; } }
      CHS.promo = null; CHS.sel = P.b[sq] && CH.colorOf(P.b[sq]) === P.t && CHS.sel !== sq ? sq : null; render(); break; }
    case 'chtpromo': { if (!CHS.promo) break; var G2 = chTabG(); m = CH.findMove(CH.parse(G2.f), CH.sqName(CHS.promo.f) + CH.sqName(CHS.promo.to) + b.getAttribute('data-p')); if (m) chTabMove(m); break; }
    case 'chtundo': { var G3 = chTabG(); if (!G3.hist.length) break; G3.f = G3.hist.pop(); G3.keys.pop(); G3.moves.pop(); G3.end = ''; G3.last = null; CHS.sel = null; CHS.promo = null; save(); render(); break; }
    case 'chtnew': S.chessT = null; chTabG(); CHS.sel = null; save(); render(); break;
    case 'chtresign': { if (!window.confirm('Сдаться? Партия закончится.')) break; chTabG().end = 'resign-' + b.getAttribute('data-c'); save(); render(); break; }
    case 'chtdraw': { if (!window.confirm('Оба согласны на ничью?')) break; chTabG().end = 'draw'; save(); render(); break; }
    case 'chtrot': { var G4 = chTabG(); G4.rot = !G4.rot; save(); render(); break; }
    case 'chlesson': { var ii = +b.getAttribute('data-i'), C = chK(kid); if (ii > 0 && !C.course[CH_COURSE[ii - 1].id] && !C.course[CH_COURSE[ii].id]) { alertMsg('Сначала пройди предыдущий урок'); break; } chLessonStart(ii); render(); window.scrollTo(0, 0); break; }
    case 'chlnext': { var L = CH_COURSE[CHS.li]; if (CHS.si + 1 < L.steps.length) { CHS.si++; chStepInit(); render(); window.scrollTo(0, 0); }
      else { var C2 = chK(kid); if (!C2.course[L.id]) { C2.course[L.id] = 1; ev(kid, 'шахматы', { subj:'Шахматы', unit:'урок «' + L.t + '»', text:'пройден' }); save(); } CHS = { v:'course' }; render(); alertMsg('Урок «' + L.t + '» пройден ✓'); } break; }
    case 'chlprev': CHS.si = Math.max(0, CHS.si - 1); chStepInit(); render(); break;
    case 'chlreset': chStepInit(); render(); break;
    case 'chsay': { var st = CH_COURSE[CHS.li].steps[CHS.si]; say(strip(st.h), 'ru-RU'); break; }
    case 'chquiz': { if (CHS.qa != null) break; var st2 = CH_COURSE[CHS.li].steps[CHS.si], v = b.getAttribute('data-v'); if (v === st2.a) { CHS.qa = v; CHS.ok = true; CHS.msg = st2.e || 'Верно!'; } else { CHS.ok = false; CHS.msg = 'Нет. Подумай ещё раз.'; } render(); break; }
  }
}

/* ===== Плитка «Шахматы» на главной (всегда доступна) и «Играть вдвоём» на экране входа ===== */
var ALWAYS = window.ALWAYS || (window.ALWAYS = []);
ALWAYS.push({ id:'chess', order:20, login:true, full:true,
  tile: function(kid){
    if (!kid) return '<button class="tile always chtile" data-act="always" data-id="chess"><span class="ico">♞</span><span class="tt"><span class="sn">Шахматы вдвоём</span><span class="ut">Партия на одном экране: у каждого свои фигуры лицом к себе</span></span></button>';
    var C = chK(kid); return '<button class="tile always chtile" data-act="always" data-id="chess"><span class="ico">♞</span><span class="tt"><span class="sn">Шахматы</span><span class="ut">' + (T(kid) === 'yarik' ? 'Учимся играть, задачи и игра вдвоём' : 'Задачи на мат и тактику, игра вдвоём') + (C.n ? ' · решено задач: ' + C.n : '') + '</span></span></button>'; },
  open: function(kid){ chOpen(kid); },
  view: function(kid){ return chView(kid); },
  act: function(a, el){ chAct(a, el); }
});

/* ===== Оформление (вставляется при загрузке, чтобы не трогать общие стили) ===== */
(function(){
  var css = '' +
  '.chboard{display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;margin:10px auto;border:3px solid #6b4a2b;border-radius:6px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.18);-webkit-user-select:none;user-select:none}' +
  '.chboard .sq{position:relative;width:12.5%;height:0;padding:0 0 12.5%;margin:0;border:0;border-radius:0;cursor:pointer;-webkit-appearance:none;appearance:none;font:inherit;color:inherit}' +
  '.chboard .sq.l{background:#f0d9b5}.chboard .sq.d{background:#b58863}' +
  '.chboard .sq.last.l{background:#f3e98d}.chboard .sq.last.d{background:#d1bb54}' +
  '.chboard .sq.sel{background:#8fd18b !important}' +
  '.chboard .sq.chk{background:radial-gradient(circle,#ff4b3e 0,#e0322a 35%,rgba(224,50,42,0) 75%) !important}' +
  '.chboard .sq.hnt{box-shadow:inset 0 0 0 4px #2f7cf6}' +
  '.chboard .pc{position:absolute;left:0;top:0;width:100%;height:100%;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center;line-height:1;font-family:"Segoe UI Symbol","Apple Symbols","DejaVu Sans",serif;pointer-events:none}' +
  '.pc.w{color:#fff;text-shadow:0 0 1px #000,0 0 1px #000,1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000}' +
  '.pc.b{color:#1d1d1d;text-shadow:0 0 1px #fff}' +
  '.chboard.rot .pc.b{-webkit-transform:rotate(180deg);transform:rotate(180deg)}' +
  '.chboard .chd{position:absolute;left:37%;top:37%;right:37%;bottom:37%;border-radius:50%;background:rgba(20,80,20,.45);pointer-events:none}' +
  '.chboard .chx{position:absolute;left:4%;top:4%;right:4%;bottom:4%;border-radius:50%;box-sizing:border-box;border:5px solid rgba(20,80,20,.45);pointer-events:none}' +
  '.chboard .mk{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none}' +
  '.chboard .mk.star:after{content:"\\2605";position:absolute;left:0;right:0;top:50%;margin-top:-.5em;text-align:center;line-height:1;color:#f2b705;text-shadow:0 0 2px #7a5200}' +
  '.chboard .mk.ring{box-sizing:border-box;border:4px solid #2f7cf6;border-radius:50%}' +
  '.chboard .cf,.chboard .cr{position:absolute;font-style:normal;font-size:11px;line-height:1;opacity:.75;pointer-events:none;font-weight:700}' +
  '.chboard .cf{right:3px;bottom:2px}.chboard .cr{left:3px;top:2px}' +
  '.chboard .sq.l .cf,.chboard .sq.l .cr{color:#b58863}.chboard .sq.d .cf,.chboard .sq.d .cr{color:#f0d9b5}' +
  '.chmsg{margin:10px 0;padding:10px 14px;border-radius:12px;background:var(--soft);min-height:1.5em}' +
  '.chmsg.ok{background:#dff3e5;color:#17603a}.chmsg.try{background:#fdecea;color:#8a2520}' +
  '.chbtns{text-align:center;margin:10px 0}.chbtns .btn{margin:4px}' +
  '.chpromo{text-align:center;margin:8px 0}.chpromo .btn{font-size:34px;line-height:1;padding:6px 12px;margin:4px;min-width:60px}' +
  '.chpromo .pc{position:static;display:inline}' +
  '.chtext{font-size:19px;margin:6px 0 4px}' +
  '.chess .tile .ico{font-size:30px}' +
  '.chess.table{padding-top:6px}' +
  '.chside{text-align:center;padding:6px 8px;border-radius:14px;background:var(--card);border:1px solid var(--line)}' +
  '.chside.turn{border:2px solid var(--green);box-shadow:0 0 0 3px rgba(35,130,74,.15)}' +
  '.chside.up{-webkit-transform:rotate(180deg);transform:rotate(180deg)}' +
  '.chside .chst{font-size:18px}.chside .chcap{font-size:22px;min-height:26px;letter-spacing:1px;color:var(--ink2)}' +
  '.chside .chbtns{margin:4px 0}' +
  '@media (orientation:landscape) and (min-width:700px){.chess.table{max-width:none}.chtbl{display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center}.chtbl .chside{width:220px;-webkit-flex:none;flex:none}.chtbl .chboard{margin:0 12px}}';
  var el = document.createElement('style'); el.appendChild(document.createTextNode(css)); (document.head || document.documentElement).appendChild(el);
  window.addEventListener('resize', function(){ if (typeof cur !== 'undefined' && cur.view === 'always' && cur.aid === 'chess') { clearTimeout(CHB.rt); CHB.rt = setTimeout(render, 150); } });
})();
