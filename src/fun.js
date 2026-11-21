/* ===== Всегда доступно: Загадки, Головоломки, Задачи на смекалку =====
   Подключается через ALWAYS (см. app.js: alwaysTiles / vAlways). Стиль ES5 — для старого Safari.
   Баллы маленькие, с дневным лимитом на каждый раздел; идут в копилку, как PRO. Засчитывается первый ответ. */
var ALWAYS = window.ALWAYS || (window.ALWAYS = []);
var FUN_CAP = { zag: 5, pz: 6, zad: 6 };
function funK(kid){ var K = S.kids[kid]; if (!K.fun) K.fun = { z: {}, p: {}, q: {}, day: '', got: {} }; var F = K.fun; if (F.day !== U.today()) { F.day = U.today(); F.got = {}; } return F; }
/* Общая функция для всех «всегда доступных» разделов (и шахмат): начисляет не больше дневного лимита, возвращает реально начисленное */
function funPts(kid, key, pts, cap){ if (!kid || !pts) return 0; var F = funK(kid), got = F.got[key] || 0; var add = Math.max(0, Math.min(pts, (cap || FUN_CAP[key] || 5) - got)); if (add) { F.got[key] = got + add; piggyAdd(S.kids[kid], add); } save(); return add; }
function funLeft(kid, key){ var F = funK(kid); return Math.max(0, (FUN_CAP[key] || 5) - (F.got[key] || 0)); }
function funCapNote(kid, key){ var l = funLeft(kid, key); return l ? 'Сегодня можно заработать ещё <b>' + l + '</b> ' + U.pl(l, 'балл', 'балла', 'баллов') + '.' : 'Баллы на сегодня собраны — дальше играем просто для ума 🙂'; }
function funTab(act, cur0, list){ return '<div class="fntabs">' + list.map(function(t){ return '<button class="chip ' + (String(cur0) === String(t[0]) ? 'on' : '') + '" data-act="' + act + '" data-l="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>'; }
function funLvl(kid){ return kid === 'anya' ? 2 : 1; }
function funOrder(kid, list, salt){ var r = U.rng(kid + salt); return r.shuffle(list.map(function(x, i){ return i; })); }
function funBurst(pts){ if (!pts) return ''; var s = ''; for (var i = 0; i < Math.min(10, 3 + pts * 2); i++) s += '<span style="--dx:' + Math.round(Math.cos(i * 2.4) * 140) + 'px;--dy:' + Math.round(-60 - Math.abs(Math.sin(i * 1.7)) * 150) + 'px;--r:' + (i * 40) + 'deg;animation-delay:' + (i * 60) + 'ms">' + (i % 3 ? '🪙' : '⭐') + '</span>'; return '<div class="burst" aria-hidden="true">' + s + '</div>'; }

/* ---------- Загадки ---------- */
var ZG = ZAG.map(function(l){ var p = l.split('|'), own = p[0].charAt(0) === '*'; return { id: 'z' + U.h(p[0]), q: own ? p[0].slice(1) : p[0], own: own, a: p[1], w: p[2].split(';'), lv: +p[3], sc: p[4] }; });
var ZG_SCENE = { les: '🍂🌳🍂', sad: '🌱🪴🌱', dom: '🪟🛋️🕰️', dvor: '🏡🌾🪵', zima: '🌨️🏠🌨️', reka: '🌊🛶🌾', kab: '📚🔍🕯️', extra: '✨🔭✨' };
function zgList(kid, lv){ var L = ZG.filter(function(z){ return z.lv === lv; }); var o = funOrder(kid, L, 'zg' + lv); return o.map(function(i){ return L[i]; }); }
function zgPic(kid, z){ var k = kid === 'anya' ? 'a' : 'y'; return '<div class="zgpic sc-' + z.sc + '"><span class="zgemo" aria-hidden="true">' + ZG_SCENE[z.sc] + '</span><img src="img/zg-' + k + '-' + z.sc + '.webp" alt="" onerror="this.style.display=\'none\'"><span class="zgq" aria-hidden="true">?</span></div>'; }
function zgOpt(w){ return '<span class="zge">' + (ZAG_EMO[w] || '❔') + '</span><span>' + U.esc(w) + '</span>'; }
ALWAYS.push({ id: 'zag', order: 10,
  open: function(kid){ cur.fz = null; cur.zgL = funLvl(kid); },
  tile: function(kid){ if (!kid) return ''; var F = funK(kid), n = 0; for (var k in F.z) if (F.z[k]) n++;
    return '<button class="tile fun zag" data-act="always" data-id="zag"><span class="ico">🦉</span><span class="tt"><span class="sn">Загадки</span><span class="ut">Народные загадки — лёгкие и трудные. Отгадано: ' + n + ' из ' + ZG.length + '. До +' + FUN_CAP.zag + ' в день</span></span></button>'; },
  view: function(kid){ var F = funK(kid), lv = cur.zgL || funLvl(kid), L = zgList(kid, lv), z = cur.fz && ZG.filter(function(x){ return x.id === cur.fz.id; })[0];
    if (!z) z = L.filter(function(x){ return !(x.id in F.z); })[0];
    var solved = L.filter(function(x){ return F.z[x.id]; }).length, seen = L.filter(function(x){ return x.id in F.z; }).length;
    var h = '<section class="hello"><p class="eyebrow">Всегда доступно</p><h1>🦉 Загадки</h1><p class="hint">Народные загадки. Подумай как следует: засчитывается только первый ответ. Лёгкая — 1 балл, трудная — 2. ' + funCapNote(kid, 'zag') + '</p>' +
      funTab('zgtab', lv, [[1, '🙂 Лёгкие · 7–9 лет'], [2, '🧠 Трудные · 10–12 лет']]) + '<p>Отгадано: <b>' + solved + '</b> из ' + L.length + (seen > solved ? ' · не угадано: ' + (seen - solved) : '') + '</p></section>';
    if (!z) return h + '<div class="card win"><h2>Все загадки этого уровня пройдены!</h2><p>Попробуй другой уровень. Скоро добавим новые.</p></div>';
    var r = cur.fz && cur.fz.id === z.id ? cur.fz : null, opts = U.rng(z.id + kid).shuffle([z.a].concat(z.w));
    h += '<article class="card task zgcard">' + zgPic(kid, z) + '<div class="q zgtext">' + U.esc(z.q).replace(/\. /g, '.<br>') + '</div><div class="row"><button class="btn ghost small" data-act="zgsay">🔊 Послушать</button></div>' +
      '<div class="opts zgopts">' + opts.map(function(o){ var cls = r ? (o === z.a ? 'right' : o === r.v ? 'wrong' : '') : ''; return '<button class="opt ' + cls + '" data-act="zgans" data-v="' + U.esc(o) + '"' + (r ? ' disabled' : '') + '>' + zgOpt(o) + '</button>'; }).join('') + '</div>';
    if (r) h += '<div class="fb ' + (r.ok ? 'ok' : 'try') + '">' + (r.ok ? 'Верно! Это ' + U.esc(z.a.toLowerCase()) + '. ' + (r.pts ? '+' + r.pts + ' ' + U.pl(r.pts, 'балл', 'балла', 'баллов') : '') : 'Не угадал(а). Правильный ответ: <b>' + U.esc(z.a) + '</b> ' + (ZAG_EMO[z.a] || '')) + '</div>' + (r.pts ? funBurst(r.pts) : '');
    h += (z.own ? '<p class="src">Загадка придумана для этого приложения.</p>' : '<p class="src">Русская народная загадка.</p>') + '</article>';
    if (r) h += '<button class="btn big" data-act="zgnext">Следующая загадка →</button>';
    return h; },
  act: function(act, b){ var kid = cur.kid; if (!kid) return;
    if (act === 'zgtab') { cur.zgL = +b.getAttribute('data-l'); cur.fz = null; render(); }
    else if (act === 'zgsay') { var F = funK(kid), lv = cur.zgL || funLvl(kid); var z = cur.fz ? ZG.filter(function(x){ return x.id === cur.fz.id; })[0] : zgList(kid, lv).filter(function(x){ return !(x.id in F.z); })[0]; if (z) say(z.q); }
    else if (act === 'zgans') { if (cur.fz) return; var F2 = funK(kid), lv2 = cur.zgL || funLvl(kid), z2 = zgList(kid, lv2).filter(function(x){ return !(x.id in F2.z); })[0]; if (!z2) return;
      var v = b.getAttribute('data-v'), ok = v === z2.a; F2.z[z2.id] = ok ? 1 : 0; var pts = ok ? funPts(kid, 'zag', z2.lv === 2 ? 2 : 1) : 0;
      cur.fz = { id: z2.id, v: v, ok: ok, pts: pts }; ev(kid, 'загадка', { subj: 'Загадки', q: z2.q, ans: v, right: z2.a, ok: ok ? 'верно' : 'ошибка', coins: S.kids[kid].coins, text: pts ? '+' + pts + ' баллов' : '' }); save(); render(); }
    else if (act === 'zgnext') { cur.fz = null; render(); window.scrollTo(0, 0); } }
});

/* ---------- Головоломки: спички и монетки ---------- */
var EQ_SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
var EQ_GEO = { a: [0, 0, 1, 0], b: [1, 0, 1, 1], c: [1, 1, 1, 2], d: [0, 2, 1, 2], e: [0, 1, 0, 2], f: [0, 0, 0, 1], g: [0, 1, 1, 1] };
function cnTri(n){ var s = []; for (var r = 0; r < n; r++) for (var q = 0; q < n - r; q++) s.push([q, r]); return s; }
function cnFlip(S){ return S.map(function(p){ return [p[0] + p[1], -p[1]]; }); }
var CN = [
  { t: 'cn', lv: 1, n: 1, s: cnTri(2), g: cnFlip(cnTri(2)), txt: 'Треугольник из 3 монеток смотрит вершиной вверх. Передвинь <b>1</b> монетку, чтобы он смотрел вершиной вниз.' },
  { t: 'cn', lv: 1, n: 1, s: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]], g: cnTri(3), txt: 'Из 6 монеток сложен ромбик-параллелограмм. Передвинь <b>1</b> монетку, чтобы получился треугольник.' },
  { t: 'cn', lv: 1, n: 2, s: cnTri(3), g: cnFlip(cnTri(3)), txt: 'Треугольник из 6 монеток. Передвинь <b>2</b> монетки, чтобы он «перевернулся» вершиной вниз.' },
  { t: 'cn', lv: 2, n: 2, s: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]], g: [[1,0],[2,0],[0,1],[2,1],[0,2],[1,2]], txt: 'Передвинь <b>2</b> монетки, чтобы 6 монеток встали кольцом (шестиугольником с пустой серединой).' },
  { t: 'cn', lv: 2, n: 3, s: cnTri(4), g: cnFlip(cnTri(4)), txt: 'Старинная головоломка. Треугольник из 10 монеток смотрит вершиной вверх. Передвинь всего <b>3</b> монетки, чтобы он смотрел вершиной вниз.' }
];
var PZ = PZ_DATA.concat(CN).map(function(p, i){ p.id = 'p' + U.h(JSON.stringify(p.s || p.e) + p.t + p.n + (p.goal || '')); return p; });
function pzTxt(p){ if (p.txt) return p.txt; var w = function(n){ return n + ' ' + U.pl(n, 'спичку', 'спички', 'спичек'); };
  if (p.t === 'eq') return 'Равенство из спичек неверное. ' + (p.n === 1 ? 'Переложи <b>одну</b> спичку' : 'Переложи <b>' + w(p.n) + '</b>') + ', чтобы оно стало верным. Знак «=» не трогаем.';
  return (p.mode === 'r' ? 'Убери <b>' + w(p.n) + '</b>' : 'Переложи <b>' + w(p.n) + '</b>') + ', чтобы получилось ровно <b>' + p.goal + '</b> ' + U.pl(p.goal, 'одинаковый квадрат', 'одинаковых квадрата', 'одинаковых квадратов') + '. Лишних спичек оставаться не должно — каждая спичка должна быть стороной квадрата.'; }
function pzPts(p){ return p.n >= 3 ? 3 : p.n; }
/* Поле: слоты (места) и их геометрия */
function pzBoard(p){ var sl = {}, fixed = [], i, k;
  if (p.t === 'st') { for (var y = 0; y <= p.h; y++) for (var x = 0; x < p.w; x++) sl['h' + x + '_' + y] = [x, y, x + 1, y]; for (y = 0; y < p.h; y++) for (x = 0; x <= p.w; x++) sl['v' + x + '_' + y] = [x, y, x, y + 1]; return { sl: sl, fixed: fixed, box: [0, 0, p.w, p.h] }; }
  if (p.t === 'eq') { var X = 0; for (i = 0; i < p.e.length; i++) { var ch = p.e.charAt(i);
      if (/\d/.test(ch)) { for (k in EQ_GEO) { var g = EQ_GEO[k]; sl[i + k] = [X + g[0], g[1], X + g[2], g[3]]; } }
      else if (ch === '+' || ch === '-') { sl[i + 'h'] = [X, 1, X + 1, 1]; sl[i + 'v'] = [X + .5, .5, X + .5, 1.5]; }
      else if (ch === '=') { fixed.push([X, .75, X + 1, .75], [X, 1.25, X + 1, 1.25]); }
      X += 1.7; }
    return { sl: sl, fixed: fixed, box: [0, 0, X - .7, 2] }; }
  /* монетки: треугольная решётка, q,r → x = q + r/2, y = r·0.87 */
  var rs = p.s.map(function(a){ return a[1]; });
  var r0 = Math.min.apply(null, rs) - 1, r1 = Math.max.apply(null, rs) + 1, minx = 1e9, maxx = -1e9;
  p.s.forEach(function(a){ var xx = a[0] + a[1] / 2; minx = Math.min(minx, xx); maxx = Math.max(maxx, xx); });
  var yr = [r0, r1]; for (var r = r0; r <= r1; r++) for (var q = -8; q <= 10; q++) { var cx = q + r / 2; if (cx >= minx - 1.1 && cx <= maxx + 1.1) sl[q + "_" + r] = [cx, -r * .87]; }
  var xs = [], ys = []; for (k in sl) { xs.push(sl[k][0]); ys.push(sl[k][1]); }
  return { sl: sl, fixed: [], box: [Math.min.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, xs), Math.max.apply(null, ys)], coin: true }; }
function pzStart(p){ if (p.t === 'st') return p.s.slice(); if (p.t === 'cn') return p.s.map(function(a){ return a[0] + '_' + a[1]; });
  var o = []; for (var i = 0; i < p.e.length; i++) { var ch = p.e.charAt(i); if (/\d/.test(ch)) EQ_SEG[ch].split('').forEach(function(c){ o.push(i + c); }); else if (ch === '+') o.push(i + 'h', i + 'v'); else if (ch === '-') o.push(i + 'h'); } return o; }
function pzMoved(p, occ){ var st = pzStart(p); return st.filter(function(k){ return occ.indexOf(k) < 0; }).length; }
function eqRead(p, occ){ var s = ''; for (var i = 0; i < p.e.length; i++) { var ch = p.e.charAt(i);
    if (ch === '=') { s += '='; continue; }
    var on = occ.filter(function(k){ return k.indexOf(i + '') === 0 && /^[a-z]$/.test(k.slice(String(i).length)); }).map(function(k){ return k.slice(String(i).length); }).sort().join('');
    if (/\d/.test(ch)) { var d = null; for (var n in EQ_SEG) if (EQ_SEG[n].split('').sort().join('') === on) d = n; if (d === null) return null; s += d; }
    else { if (on === 'h') s += '-'; else if (on === 'hv') s += '+'; else return null; } }
  return s; }
function eqTrue(s){ if (!s) return false; var m = s.split('='); if (m.length !== 2) return false; var parts = m[0].split(/[+-]/).concat([m[1]]); if (parts.some(function(x){ return !x || (x.length > 1 && x.charAt(0) === '0'); })) return false;
  var ops = m[0].match(/[+-]/g) || [], v = parseInt(parts[0], 10); for (var i = 0; i < ops.length; i++) v = ops[i] === '+' ? v + parseInt(parts[i + 1], 10) : v - parseInt(parts[i + 1], 10); return v === parseInt(m[1], 10); }
function cnNorm(keys){ var P = keys.map(function(k){ var a = k.split('_'); return [+a[0], +a[1]]; }); var m = P.slice().sort(function(a, b){ return a[1] - b[1] || a[0] - b[0]; })[0]; return P.map(function(a){ return (a[0] - m[0]) + '_' + (a[1] - m[1]); }).sort().join(' '); }
function pzSolved(p, occ){ var mv = pzMoved(p, occ);
  if (p.t === 'eq') return mv >= 1 && mv <= p.n && eqTrue(eqRead(p, occ));
  if (p.t === 'cn') return mv >= 1 && mv <= p.n && cnNorm(occ) === cnNorm(p.g.map(function(a){ return a[0] + '_' + a[1]; }));
  if (p.mode === 'r' ? mv !== p.n || occ.length !== p.s.length - p.n : mv < 1 || mv > p.n) return false;
  var c = 0, used = {}; for (var y = 0; y < p.h; y++) for (var x = 0; x < p.w; x++) { var e = ['h' + x + '_' + y, 'h' + x + '_' + (y + 1), 'v' + x + '_' + y, 'v' + (x + 1) + '_' + y]; if (e.every(function(k){ return occ.indexOf(k) >= 0; })) { c++; e.forEach(function(k){ used[k] = 1; }); } }
  return c === p.goal && occ.every(function(k){ return used[k]; }); }
function cnSolution(p, B){ var T = p.g, best = null, bc = 1e9, st = pzStart(p);
  for (var dq = -8; dq <= 8; dq++) for (var dr = -6; dr <= 6; dr++) { var ks = T.map(function(a){ return (a[0] + dq) + '_' + (a[1] + dr); }); if (!ks.every(function(k){ return B.sl[k]; })) continue; var c = st.filter(function(k){ return ks.indexOf(k) < 0; }).length; if (c < bc) { bc = c; best = ks; } }
  return best || []; }
function pzSol(p, B){ if (p.t === 'cn') return cnSolution(p, B); if (p.t === 'st') return p.sol;
  var o = []; for (var i = 0; i < p.sol.length; i++) { var ch = p.sol.charAt(i); if (/\d/.test(ch)) EQ_SEG[ch].split('').forEach(function(c){ o.push(i + c); }); else if (ch === '+') o.push(i + 'h', i + 'v'); else if (ch === '-') o.push(i + 'h'); } return o; }
function pzList(kid, lv){ var L = PZ.filter(function(p){ return p.lv === lv; }); var o = funOrder(kid, L, 'pz' + lv), out = o.map(function(i){ return L[i]; });
  /* сначала проще: по числу ходов */ return out.sort(function(a, b){ return a.n - b.n; }); }
function pzCur(kid){ var F = funK(kid), lv = cur.pzL || funLvl(kid), L = pzList(kid, lv); if (cur.fp && cur.fp.lv === lv) { var x = PZ.filter(function(p){ return p.id === cur.fp.id; })[0]; if (x) return x; }
  var skip = cur.pzSkip || []; var p = L.filter(function(x){ return !(x.id in F.p) && skip.indexOf(x.id) < 0; })[0] || L.filter(function(x){ return !(x.id in F.p); })[0]; if (!p) return null;
  cur.fp = { id: p.id, lv: lv, occ: pzStart(p), sel: null, res: null }; return p; }
function pzSvg(p, st, showSol){ var B = pzBoard(p), b = B.box, m = B.coin ? .7 : .45, vb = [b[0] - m, b[1] - m, b[2] - b[0] + 2 * m, b[3] - b[1] + 2 * m], h = '', k, s;
  var occ = showSol ? pzSol(p, B) : st.occ, start = pzStart(p);
  if (B.coin) { for (k in B.sl) { s = B.sl[k]; var on = occ.indexOf(k) >= 0;
      h += on ? '<g class="pzc' + (st.sel === k ? ' sel' : '') + (showSol && start.indexOf(k) < 0 ? ' new' : '') + '" data-pk="' + k + '"><circle cx="' + s[0] + '" cy="' + s[1] + '" r=".42"/><circle class="in" cx="' + s[0] + '" cy="' + s[1] + '" r=".3"/><circle class="hit" cx="' + s[0] + '" cy="' + s[1] + '" r=".5"/></g>'
        : '<circle class="pzdot" data-ps="' + k + '" cx="' + s[0] + '" cy="' + s[1] + '" r="' + (st.sel ? .22 : .1) + '"/>' + (st.sel ? '' : '') ; } }
  else { B.fixed.forEach(function(f){ h += '<line class="pzfix" x1="' + f[0] + '" y1="' + f[1] + '" x2="' + f[2] + '" y2="' + f[3] + '"/>'; });
    for (k in B.sl) { s = B.sl[k]; var dx = s[2] - s[0], dy = s[3] - s[1], x1 = s[0] + dx * .08, y1 = s[1] + dy * .08, x2 = s[2] - dx * .08, y2 = s[3] - dy * .08;
      if (occ.indexOf(k) >= 0) h += '<g class="pzs' + (st.sel === k ? ' sel' : '') + (showSol && start.indexOf(k) < 0 ? ' new' : '') + '" data-pk="' + k + '"><line class="hit" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/><line class="wood" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/><circle class="head" cx="' + x2 + '" cy="' + y2 + '" r=".085"/></g>';
      else h += '<g class="pze' + (st.sel ? ' on' : '') + (start.indexOf(k) >= 0 ? ' was' : '') + '" data-ps="' + k + '"><line class="hit" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/><line class="ghost" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/></g>'; } }
  return '<svg class="pzsvg ' + (B.coin ? 'coins' : p.t) + '" viewBox="' + vb.join(' ') + '" preserveAspectRatio="xMidYMid meet">' + h + '</svg>'; }
ALWAYS.push({ id: 'pz', order: 30,
  open: function(kid){ cur.fp = null; cur.pzL = funLvl(kid); cur.pzSkip = []; },
  tile: function(kid){ if (!kid) return ''; var F = funK(kid), n = 0; for (var k in F.p) if (F.p[k]) n++;
    return '<button class="tile fun pz" data-act="always" data-id="pz"><span class="ico">🧩</span><span class="tt"><span class="sn">Головоломки</span><span class="ut">Спички и монетки: передвинь, чтобы сложилось. Решено: ' + n + ' из ' + PZ.length + '. До +' + FUN_CAP.pz + ' в день</span></span></button>'; },
  view: function(kid){ var F = funK(kid), lv = cur.pzL || funLvl(kid), L = pzList(kid, lv), p = pzCur(kid), solved = L.filter(function(x){ return F.p[x.id]; }).length;
    var h = '<section class="hello"><p class="eyebrow">Всегда доступно</p><h1>🧩 Головоломки</h1><p class="hint">Перетащи спичку или монетку пальцем на новое место (или нажми на неё, а потом на пустое место). Когда всё готово — «Проверить». Проверка одна, как в уроках. ' + funCapNote(kid, 'pz') + '</p>' +
      funTab('pztab', lv, [[1, '🙂 Уровень 1'], [2, '🧠 Уровень 2']]) + '<p>Решено: <b>' + solved + '</b> из ' + L.length + '</p></section>';
    if (!p) return h + '<div class="card win"><h2>Все головоломки этого уровня пройдены!</h2><p>Попробуй другой уровень.</p></div>';
    var st = cur.fp, mv = pzMoved(p, st.occ), need = p.t === 'st' && p.mode === 'r';
    h += '<article class="card task pzcard"><div class="q">' + pzTxt(p) + '</div><div class="pzwrap" id="pzwrap">' + pzSvg(p, st, false) + '</div>';
    if (!st.res) h += '<p class="pzcount">' + (need ? 'Убрано' : 'Передвинуто') + ': <b>' + mv + '</b> из ' + p.n + (need ? ' · нажми на спичку, чтобы убрать её (нажми на пустое место — вернуть)' : '') + '</p><div class="row"><button class="btn" data-act="pzcheck"' + ((need ? mv === p.n : mv >= 1) ? '' : ' disabled') + '>Проверить</button><button class="btn ghost" data-act="pzreset">↺ Начать заново</button>' + (mv ? '' : '<button class="link" data-act="pzskip">Отложить, другая</button>') + '</div>';
    else h += '<div class="fb ' + (st.res.ok ? 'ok' : 'try') + '">' + (st.res.ok ? 'Получилось! ' + (st.res.pts ? '+' + st.res.pts + ' ' + U.pl(st.res.pts, 'балл', 'балла', 'баллов') : '') : 'Не получилось. Вот одно из решений (новые места — зелёные):') + '</div>' + (st.res.ok ? funBurst(st.res.pts) : '<div class="pzwrap sol">' + pzSvg(p, st, true) + '</div>');
    h += '</article>' + (st.res ? '<button class="btn big" data-act="pznext">Следующая головоломка →</button>' : '');
    return h; },
  act: function(act, b){ var kid = cur.kid; if (!kid) return; var p = pzCur(kid);
    if (act === 'pztab') { cur.pzL = +b.getAttribute('data-l'); cur.fp = null; render(); }
    else if (act === 'pzreset' && p && !cur.fp.res) { cur.fp.occ = pzStart(p); cur.fp.sel = null; render(); }
    else if (act === 'pzskip' && p) { cur.pzSkip = (cur.pzSkip || []).concat([p.id]); cur.fp = null; render(); }
    else if (act === 'pznext') { cur.fp = null; render(); window.scrollTo(0, 0); }
    else if (act === 'pzcheck' && p && !cur.fp.res) { var F = funK(kid), ok = pzSolved(p, cur.fp.occ); F.p[p.id] = ok ? 1 : 0; var pts = ok ? funPts(kid, 'pz', pzPts(p)) : 0; cur.fp.res = { ok: ok, pts: pts }; cur.fp.sel = null;
      ev(kid, 'головоломка', { subj: 'Головоломки', q: strip(pzTxt(p)) + (p.e ? ' ' + p.e : ''), ans: p.t === 'eq' ? (eqRead(p, cur.fp.occ) || '?') : '', ok: ok ? 'верно' : 'ошибка', coins: S.kids[kid].coins, text: pts ? '+' + pts + ' баллов' : '' }); save(); render(); } }
});
/* Перетаскивание (касание и мышь). На SVG-элементах не используем data-act/dataset — старый Safari. */
var PZD = null, PZ_TAPT = 0;
function pzEl(t){ while (t && t.getAttribute) { if (t.getAttribute('data-pk') || t.getAttribute('data-ps')) return t; t = t.parentNode; } return null; }
function pzPt(svg, x, y){ try { var pt = svg.createSVGPoint(); pt.x = x; pt.y = y; return pt.matrixTransform(svg.getScreenCTM().inverse()); } catch (e) { return { x: 0, y: 0 }; } }
function pzMove(from, to){ var st = cur.fp; if (!st || st.res) return; var i = st.occ.indexOf(from); if (i < 0 || st.occ.indexOf(to) >= 0) return; var p = pzCur(cur.kid);
  if (p.t === 'st' && p.mode === 'r') return; st.occ[i] = to; st.sel = null; render(); }
function pzTap(el){ var st = cur.fp, p = cur.kid && pzCur(cur.kid); if (!st || st.res || !p) return; var pk = el.getAttribute('data-pk'), ps = el.getAttribute('data-ps');
  if (p.t === 'st' && p.mode === 'r') { if (pk) { if (pzMoved(p, st.occ) < p.n) st.occ.splice(st.occ.indexOf(pk), 1); else alertMsg('Уже убрано ' + p.n + '. Верни одну, если передумал(а).'); } else if (ps && p.s.indexOf(ps) >= 0) st.occ.push(ps); render(); return; }
  if (pk) { st.sel = st.sel === pk ? null : pk; render(); } else if (ps && st.sel) pzMove(st.sel, ps); }
function pzDown(e, x, y){ var el = pzEl(e.target); if (!el || cur.view !== 'always' || cur.aid !== 'pz') return false; var svg = el.ownerSVGElement; if (!svg) return false;
  PZD = { el: el, svg: svg, x: x, y: y, drag: false, pk: el.getAttribute('data-pk') }; return true; }
function pzDrag(x, y){ if (!PZD || !PZD.pk) return; var p = cur.kid && pzCur(cur.kid); if (!p || (p.t === 'st' && p.mode === 'r') || (cur.fp && cur.fp.res)) return;
  if (!PZD.drag && Math.abs(x - PZD.x) + Math.abs(y - PZD.y) < 8) return; PZD.drag = true;
  var a = pzPt(PZD.svg, PZD.x, PZD.y), c = pzPt(PZD.svg, x, y); PZD.el.setAttribute('transform', 'translate(' + (c.x - a.x) + ',' + (c.y - a.y) + ')'); PZD.el.setAttribute('class', (PZD.el.getAttribute('class') || '') + ' drag'); }
function pzUp(x, y){ var D = PZD; PZD = null; if (!D) return; if (!D.drag) { pzTap(D.el); return; }
  var p = pzCur(cur.kid), B = pzBoard(p), a = pzPt(D.svg, D.x, D.y), c = pzPt(D.svg, x, y), s = B.sl[D.pk], dx = c.x - a.x, dy = c.y - a.y;
  var mx = (B.coin ? s[0] : (s[0] + s[2]) / 2) + dx, my = (B.coin ? s[1] : (s[1] + s[3]) / 2) + dy, best = null, bd = B.coin ? .55 : .5;
  for (var k in B.sl) { if (cur.fp.occ.indexOf(k) >= 0) continue; var t = B.sl[k], tx = B.coin ? t[0] : (t[0] + t[2]) / 2, ty = B.coin ? t[1] : (t[1] + t[3]) / 2, d = Math.sqrt((tx - mx) * (tx - mx) + (ty - my) * (ty - my)); if (d < bd) { bd = d; best = k; } }
  if (best) pzMove(D.pk, best); else render(); }
document.addEventListener('touchstart', function(e){ if (e.touches.length !== 1) return; var t = e.touches[0]; if (pzDown(e, t.clientX, t.clientY)) e.preventDefault(); }, { passive: false });
document.addEventListener('touchmove', function(e){ if (!PZD) return; var t = e.touches[0]; pzDrag(t.clientX, t.clientY); if (PZD && PZD.drag) e.preventDefault(); }, { passive: false });
document.addEventListener('touchend', function(e){ if (!PZD) return; var t = e.changedTouches[0]; PZ_TAPT = Date.now(); pzUp(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
document.addEventListener('touchcancel', function(){ if (PZD) { PZD = null; render(); } });
document.addEventListener('mousedown', function(e){ if (Date.now() - PZ_TAPT < 800) return; if (pzDown(e, e.clientX, e.clientY)) e.preventDefault(); });
document.addEventListener('mousemove', function(e){ if (PZD) pzDrag(e.clientX, e.clientY); });
document.addEventListener('mouseup', function(e){ if (PZD) pzUp(e.clientX, e.clientY); });

/* ---------- Задачи на смекалку ---------- */
function zdParse(l, lv){ var p = l.split('|'); return { id: 'q' + U.h(p[0]), q: p[0], a: Number(p[1].replace(',', '.')), as: p[1], e: p[2], lv: lv }; }
var ZD = ZAD1.map(function(l){ return zdParse(l, 1); }).concat(ZAD2.map(function(l){ return zdParse(l, 2); }));
function zdList(kid, lv){ var L = ZD.filter(function(z){ return z.lv === lv; }); var o = funOrder(kid, L, 'zd' + lv); return o.map(function(i){ return L[i]; }); }
function zdPts(kid, z){ var my = funLvl(kid); return z.lv > my ? 3 : z.lv < my ? 1 : 2; }
function zdCur(kid){ var F = funK(kid), lv = cur.zdL || funLvl(kid); if (cur.fq) return ZD.filter(function(x){ return x.id === cur.fq.id; })[0]; return zdList(kid, lv).filter(function(x){ return !(x.id in F.q); })[0]; }
ALWAYS.push({ id: 'zad', order: 40,
  open: function(kid){ cur.fq = null; cur.zdL = funLvl(kid); },
  tile: function(kid){ if (!kid) return ''; var F = funK(kid), n = 0; for (var k in F.q) if (F.q[k]) n++;
    return '<button class="tile fun zad" data-act="always" data-id="zad"><span class="ico">🧮</span><span class="tt"><span class="sn">Задачи на смекалку</span><span class="ut">Хитрые задачи в духе старых сборников. Уровень ' + funLvl(kid) + '. Решено: ' + n + '. До +' + FUN_CAP.zad + ' в день</span></span></button>'; },
  view: function(kid){ var F = funK(kid), lv = cur.zdL || funLvl(kid), L = zdList(kid, lv), z = zdCur(kid), solved = L.filter(function(x){ return F.q[x.id]; }).length;
    var h = '<section class="hello"><p class="eyebrow">Всегда доступно</p><h1>🧮 Задачи на смекалку</h1><p class="hint">Читай внимательно — в задачах бывают ловушки. Засчитывается первый ответ. ' + funCapNote(kid, 'zad') + '</p>' +
      funTab('zdtab', lv, [[1, 'Уровень 1 · 2–3 класс'], [2, 'Уровень 2 · 5 класс']]) + '<p>Решено: <b>' + solved + '</b> из ' + L.length + '</p></section>';
    if (!z) return h + '<div class="card win"><h2>Все задачи этого уровня решены!</h2><p>Скоро добавим новые.</p></div>';
    var r = cur.fq;
    h += '<article class="card task"><span class="sticker" aria-hidden="true">' + U.rng(z.id).pick(THEME[kid].pics) + '</span><div class="q">' + U.esc(z.q) + '</div>' + (typeof picWords === 'function' ? picWords(z.q) : '') + '<div class="row"><button class="btn ghost small" data-act="zdsay">🔊 Послушать</button></div>' +
      '<form class="numf" data-form="zadf"><input id="zdin" inputmode="decimal" autocomplete="off" ' + (r ? 'disabled value="' + U.esc(r.v) + '"' : 'autofocus') + ' aria-label="Ответ"><button class="btn"' + (r ? ' disabled' : '') + '>Проверить</button></form>';
    if (r) h += '<div class="fb ' + (r.ok ? 'ok' : 'try') + '">' + (r.ok ? 'Верно! ' + (r.pts ? '+' + r.pts + ' ' + U.pl(r.pts, 'балл', 'балла', 'баллов') : '') : 'Неверно. Ответ: <b>' + U.esc(z.as) + '</b>') + '</div><p class="hint">' + U.esc(z.e) + '</p>' + (r.ok ? funBurst(r.pts) : '');
    h += '</article>' + (r ? '<button class="btn big" data-act="zdnext">Следующая задача →</button>' : '');
    return h; },
  act: function(act, b){ var kid = cur.kid; if (!kid) return;
    if (act === 'zdtab') { cur.zdL = +b.getAttribute('data-l'); cur.fq = null; render(); }
    else if (act === 'zdsay') { var z = zdCur(kid); if (z) say(z.q); }
    else if (act === 'zdnext') { cur.fq = null; render(); window.scrollTo(0, 0); } },
  form: function(k, f){ var kid = cur.kid; if (!kid || cur.fq) return; var z = zdCur(kid); if (!z) return; var el = document.getElementById('zdin'), v = String(el && el.value || '').trim(); if (!v) return alertMsg('Напиши ответ числом');
    var n = Number(v.replace(',', '.').replace(/\s/g, '')); if (isNaN(n)) return alertMsg('Нужно число');
    var ok = Math.abs(n - z.a) < 1e-9, F = funK(kid); F.q[z.id] = ok ? 1 : 0; var pts = ok ? funPts(kid, 'zad', zdPts(kid, z)) : 0; cur.fq = { id: z.id, v: v, ok: ok, pts: pts };
    ev(kid, 'задача на смекалку', { subj: 'Задачи на смекалку', q: z.q, ans: v, right: z.as, ok: ok ? 'верно' : 'ошибка', coins: S.kids[kid].coins, text: pts ? '+' + pts + ' баллов' : '' }); save(); render(); }
});
