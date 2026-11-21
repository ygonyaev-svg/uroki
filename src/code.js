/* ===== Игра «Тоби-программист»: основы программирования для Ярика =====
   Последовательность → удар по мячу → циклы → условия и «пока» → отладка.
   Поле: '.' трава, '#' препятствие, 'S' старт, 'G' финиш, '*' косточка (собирается сама),
   'c' улика (нужно 🔍), 'o' мяч, 'N' ворота. Решение пишется кратко: R D 3(R U) W(R) I:c(T)() K */
const CODE_KIDS = ['yarik'], CODE_DAY_MAX = 10, CODE_STEP_MS = 360;
const CG_CH = [
  { id: 1, t: 'Тоби ищет косточку', ico: '🦴', img: 'code-ch1', bg: 'park', what: 'Команды по порядку', badge: '🐕 Ошейник путешественника' },
  { id: 2, t: 'Футбол', ico: '⚽', img: 'code-ch2', bg: 'pitch', what: 'Команды и удар', badge: '🏆 Кубок бомбардира' },
  { id: 3, t: 'Повторяй!', ico: '🔁', img: 'code-ch3', bg: 'park', what: 'Циклы', badge: '🗝 Ключ от тайного тоннеля' },
  { id: 4, t: 'Тоби-сыщик', ico: '🔍', img: 'code-ch4', bg: 'street', what: 'Условия: «если» и «пока»', badge: '🎩 Шляпа настоящего сыщика' },
  { id: 5, t: 'Найди ошибку', ico: '🐞', img: 'code-ch5', bg: 'lab', what: 'Отладка программ', badge: '🎓 Диплом мастера программирования' }
];
const CG_LV = [
  /* 1. Последовательность */
  { id: '1.1', ch: 1, b: 'UDLR', g: ['.....', 'S...G', '.....'], sol: 'R R R R', say: 'Помоги Тоби добежать до косточки. Нажимай стрелки, они встанут в программу. Потом жми зелёную кнопку Пуск.' },
  { id: '1.2', ch: 1, b: 'UDLR', g: ['S..##', '##.##', '##..G'], sol: 'R R D D R R', say: 'Тоби слушается только программы. Посчитай клетки и собери стрелки по порядку.' },
  { id: '1.3', ch: 1, b: 'UDLR', g: ['##..G', '##.##', 'S..##'], sol: 'R R U U R R', say: 'Теперь косточка наверху. Не наткнись на кусты!' },
  { id: '1.4', ch: 1, b: 'UDLR', g: ['S.*.#', '#.#.#', '#*#.G'], sol: 'R D D U U R R D D R', say: 'Собери все косточки и приведи Тоби в будку.' },
  { id: '1.5', ch: 1, b: 'UDLR', g: ['S.#...', '#.#.#.', '#...#G'], sol: 'R D D R R U U R R D D', say: 'Длинная дорожка. Будь внимательным: каждая стрелка — один шаг.' },
  { id: '1.6', ch: 1, b: 'UDLR', g: ['*...#', '.##.#', 'S#*.G'], sol: 'U U R R R D D L R R', say: 'Две косточки и будка. Придумай самый короткий путь.' },
  { id: '1.7', ch: 1, b: 'UDLR', g: ['S.#.....', '#.#.###.', '#...#G..'], sol: 'R D D R R U U R R R R D D L L', say: 'Большой лабиринт! Сначала проследи путь пальцем, а потом пиши программу.' },
  /* 2. Футбол: удар летит туда, куда Тоби шагнул последним */
  { id: '2.1', ch: 2, b: 'UDLRK', g: ['.....N', 'S.o..N', '.....N'], sol: 'R R K', say: 'Футбол! Добеги до мяча и нажми удар. Мяч полетит туда, куда Тоби шёл последним.' },
  { id: '2.2', ch: 2, b: 'UDLRK', g: ['NNNNN', '.....', '..#..', 'S..o.'], sol: 'R R R U K', say: 'Ворота наверху. Сначала повернись к воротам: сделай шаг вверх вместе с мячом.' },
  { id: '2.3', ch: 2, b: 'UDLRK', g: ['#...N', 'S#o.N', '...#N'], sol: 'D R R U R K', say: 'Обведи защитника и забей гол.' },
  { id: '2.4', ch: 2, b: 'UDLRK', g: ['..#..N', 'S.o#.N', '.#...N'], sol: 'R R D R R K', say: 'Мяч у ног бежит вместе с Тоби. Обведи защитника снизу.' },
  { id: '2.5', ch: 2, b: 'UDLRK', g: ['S#...#.N', '.#.#.#.N', 'o..#...N'], sol: 'D D R R U U R R D D R R K', say: 'Целая команда защитников! Пройди змейкой и бей.' },
  { id: '2.6', ch: 2, b: 'UDLRK', g: ['S...#', '.##o#', '.....', 'NNNNN'], sol: 'R R R D D K', say: 'Ворота внизу. С какой стороны подойти к мячу, чтобы ударить вниз?' },
  /* 3. Циклы */
  { id: '3.1', ch: 3, b: 'UDLRP', max: 2, g: ['S.......G'], sol: '8(R)', say: 'Слишком длинно! Возьми оранжевый блок Повтори, положи в него стрелку и выбери число.' },
  { id: '3.2', ch: 3, b: 'UDLRP', max: 3, g: ['####G', '###..', '##..#', '#..##', 'S.###'], sol: '4(R U)', say: 'Лесенка! Какие два шага повторяются? Положи их в Повтори.' },
  { id: '3.3', ch: 3, b: 'UDLRP', max: 4, g: ['S.*####', '##..*##', '####..*', '######G'], sol: '3(R R D)', say: 'Найди кусочек пути, который повторяется три раза.' },
  { id: '3.4', ch: 3, b: 'UDLRP', max: 8, g: ['*...*', '.###.', '.###.', '.###.', 'SG..*'], sol: '4(U) 4(R) 4(D) 3(L)', say: 'Обойди пруд и собери косточки. Каждую сторону пройди одним Повтори.' },
  { id: '3.5', ch: 3, b: 'UDLRPK', max: 7, g: ['S........', '########.', 'N.o......'], sol: '8(R) 2(D) 6(L) K', say: 'Мяч далеко. Добеги до него с помощью Повтори и забей гол.' },
  { id: '3.6', ch: 3, b: 'UDLRP', max: 7, g: ['S***G', '****#', '****#', '****#'], sol: '2(3(D) R 3(U) R)', say: 'Повтори внутри Повтори! Собери все косточки змейкой: вниз, вправо, вверх, вправо.' },
  { id: '3.7', ch: 3, b: 'UDLRP', max: 5, g: ['S.*....', '.......', '..*.*..', '.......', '....*.*', '.......', '......G'], sol: '3(2(R) 2(D))', say: 'Лесенка из больших ступенек. Хватит пяти блоков!' },
  /* 4. Условия и «пока» */
  { id: '4.1', ch: 4, b: 'UDLRPT', g: ['S.c.c.G'], sol: '2(R R T) R R', say: 'Тоби — сыщик! Встань на след и нажми лупу, чтобы осмотреть его. Осмотри все следы.' },
  { id: '4.2', ch: 4, b: 'UDLRW', v: [['S....G'], ['S.........G'], ['S.G']], sol: 'W(R)', say: 'Мы не знаем, сколько шагов до флажка. Блок Пока: повторяй, пока не дойдёшь до флажка.' },
  { id: '4.3', ch: 4, b: 'UDLRPTI', cond: 'c', v: [['S.c..c..G'], ['Sc.c....G']], sol: '8(R I:c(T)())', say: 'Следы каждый раз в другом месте! Блок Если: если тут след — осмотри. Программа должна сработать на обеих улицах.' },
  { id: '4.4', ch: 4, b: 'UDLRWIT', cond: 'c', v: [['S.c..c.G'], ['Sc....c..cG'], ['S..G']], sol: 'W(R I:c(T)())', say: 'Улицы разной длины, и следы в разных местах. Объедини Пока и Если.' },
  { id: '4.5', ch: 4, b: 'UDLRWI', cond: 'r', v: [['####.G', '###..#', '#...##', 'S.####'], ['##...G', '##.###', 'S..###'], ['#..G', '#.##', 'S.##']], sol: 'W(I:r(U)(R))', say: 'Лестница каждый раз другая. Если справа преграда — иди вверх, иначе — вправо.' },
  { id: '4.6', ch: 4, b: 'UDLRWIT', cond: 'dc', v: [['S####', 'c####', '.####', '..c.G'], ['S#####', 'c.c.cG'], ['S##', 'c##', '.##', '..c', '##G']], sol: 'W(I:d(R)(D) I:c(T)())', say: 'Самое трудное дело! Спускайся, пока можно, потом иди вправо. И осматривай каждый след.' },
  { id: '4.7', ch: 4, b: 'UDLRWI', cond: 'ru', v: [['.#..G', '...##', 'S.###'], ['...G', '.###', 'S###'], ['..#G', '.##.', 'S...']], sol: 'W(I:r(I:u(L)(U))(R))', say: 'Лабиринт Мориарти! Если справа преграда, а сверху тоже — шагни влево. Если сверху свободно — вверх. Иначе — вправо.', hard: 1 },
  /* 5. Отладка: программа уже написана, но в ней ошибка */
  { id: '5.1', ch: 5, b: 'UDLR', g: ['S..##', '##.##', '##..G'], bug: 'R R D R R', sol: 'R R D D R R', say: 'Эту программу написал робот, и Тоби врезается в куст. Найди ошибку и исправь её.' },
  { id: '5.2', ch: 5, b: 'UDLRP', max: 2, g: ['S.....G'], bug: '3(R)', sol: '6(R)', say: 'Тоби не добегает. Что не так с числом в Повтори?' },
  { id: '5.3', ch: 5, b: 'UDLRP', max: 3, g: ['####G', '###..', '##..#', '#..##', 'S.###'], bug: '4(U R)', sol: '4(R U)', say: 'Лесенка не получается. Может, шаги перепутаны местами?' },
  { id: '5.4', ch: 5, b: 'UDLRK', g: ['NNNNN', '.....', '..#..', 'S..o.'], bug: 'R R R K', sol: 'R R R U K', say: 'Мяч летит мимо ворот. Чего не хватает перед ударом?' },
  { id: '5.5', ch: 5, b: 'UDLRWI', cond: 'r', v: [['####.G', '###..#', '#...##', 'S.####'], ['##...G', '##.###', 'S..###']], bug: 'W(I:r(R)(U))', sol: 'W(I:r(U)(R))', say: 'В этой программе перепутаны да и нет. Найди и поменяй.' }
];
const CG_BLK = { U: '⬆', D: '⬇', L: '⬅', R: '➡', K: '⚽', T: '🔍' };
const CG_COND = { c: { i: '🐾', t: 'тут след?' }, r: { i: '➡🧱', t: 'справа преграда?' }, d: { i: '⬇🧱', t: 'снизу преграда?' }, u: { i: '⬆🧱', t: 'сверху преграда?' } };
const CG_DIR = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };

/* --- разбор краткой записи программы --- */
function cgParse(s){ let i = 0; const src = String(s || '').replace(/\s+/g, ' ');
  function list(){ const out = []; for (;;) { while (src[i] === ' ') i++; if (i >= src.length || src[i] === ')') return out; out.push(node()); } }
  function body(){ i++; const b = list(); i++; return b; }
  function node(){ const c = src[i];
    if (/\d/.test(c)) { let n = ''; while (/\d/.test(src[i])) n += src[i++]; return { t: 'P', n: +n, b: body() }; }
    if (c === 'W') { i++; return { t: 'W', b: body() }; }
    if (c === 'I') { const cd = src[i + 2]; i += 3; const b = body(); const e = body(); return { t: 'I', c: cd, b: b, e: e }; }
    i++; return { t: c }; }
  return list(); }
function cgCount(p){ let n = 0; for (const x of p) { n++; if (x.b) n += cgCount(x.b); if (x.e) n += cgCount(x.e); } return n; }
function cgDepth(p){ let d = 0; for (const x of p) if (x.b) d = Math.max(d, 1 + cgDepth(x.b), x.e ? 1 + cgDepth(x.e) : 0); return d; }
function cgGrids(lv){ return lv.v || [lv.g]; }
function cgFind(grid, ch){ const out = []; grid.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row[x] === ch) out.push([x, y]); }); return out; }

/* --- выполнение: возвращает весь путь по шагам, потом он проигрывается анимацией --- */
function cgSim(lv, grid, prog){
  const W = grid[0].length, H = grid.length, at = (x, y) => (y < 0 || y >= H || x < 0 || x >= W) ? '#' : grid[y][x];
  const s = cgFind(grid, 'S')[0], g = cgFind(grid, 'G')[0], b0 = cgFind(grid, 'o')[0];
  const st = { x: s[0], y: s[1], d: 'R', ball: b0 ? { x: b0[0], y: b0[1], held: false } : null, left: {}, goal: false, n: 0 };
  cgFind(grid, '*').concat(cgFind(grid, 'c')).forEach(p => { st.left[p[0] + ',' + p[1]] = grid[p[1]][p[0]]; });
  const tr = [];
  const snap = (hl, ev) => { tr.push({ x: st.x, y: st.y, d: st.d, ball: st.ball ? { x: st.ball.x, y: st.ball.y } : null, left: Object.keys(st.left), goal: st.goal, hl: hl, ev: ev || '' }); };
  const blocked = (x, y) => { const c = at(x, y); return c === '#' || c === 'N'; };
  function Fail(msg, code){ this.msg = msg; this.code = code; }
  const tick = () => { if (++st.n > 400) throw new Fail('Программа никак не кончается. Проверь блок Пока.', 'loop'); };
  function run(list, path){
    list.forEach((x, i) => { const id = path + i; tick();
      if (CG_DIR[x.t]) { const v = CG_DIR[x.t], nx = st.x + v[0], ny = st.y + v[1]; st.d = x.t;
        if (blocked(nx, ny)) { snap(id, 'bump'); throw new Fail(at(nx, ny) === 'N' ? 'В ворота надо бить мячом, а не бежать самому!' : nx < 0 || ny < 0 || nx >= W || ny >= H ? 'Ой! Дальше края поля идти нельзя.' : 'Бух! Там преграда.', 'bump'); }
        st.x = nx; st.y = ny;
        if (st.ball && !st.ball.held && st.ball.x === nx && st.ball.y === ny) st.ball.held = true;
        if (st.ball && st.ball.held) { st.ball.x = nx; st.ball.y = ny; }
        const k = nx + ',' + ny; if (st.left[k] === '*') delete st.left[k];
        snap(id); }
      else if (x.t === 'T') { const k = st.x + ',' + st.y; if (st.left[k] !== 'c') { snap(id, 'no'); throw new Fail('Тут нет следа. Лупа нужна только там, где след 🐾.', 'take'); } delete st.left[k]; snap(id, 'take'); }
      else if (x.t === 'K') { if (!st.ball || !st.ball.held || st.ball.x !== st.x || st.ball.y !== st.y) { snap(id, 'no'); throw new Fail('Мяча нет у ног. Сначала добеги до мяча.', 'kick'); }
        st.ball.held = false; const v = CG_DIR[st.d]; snap(id, 'kick');
        for (;;) { const nx = st.ball.x + v[0], ny = st.ball.y + v[1], c = at(nx, ny);
          if (c === 'N') { st.ball.x = nx; st.ball.y = ny; st.goal = true; snap(id, 'goal'); break; }
          if (c === '#') { snap(id, 'miss'); throw new Fail(nx < 0 || ny < 0 || nx >= W || ny >= H ? 'Мимо! Мяч улетел за поле. Куда смотрел Тоби, когда бил?' : 'Мяч попал в защитника.', 'miss'); }
          st.ball.x = nx; st.ball.y = ny; snap(id, 'fly'); } }
      else if (x.t === 'P') { for (let k = 0; k < x.n; k++) run(x.b, id + '.'); }
      else if (x.t === 'W') { if (!x.b.length) throw new Fail('Блок Пока пустой. Положи в него команды.', 'loop'); let k = 0; while (!(g && st.x === g[0] && st.y === g[1])) { if (++k > 60) throw new Fail('Программа никак не кончается. Проверь блок Пока.', 'loop'); run(x.b, id + '.'); } }
      else if (x.t === 'I') { const c = x.c; let yes = false;
        if (c === 'c') yes = st.left[st.x + ',' + st.y] === 'c';
        else { const v = CG_DIR[c === 'r' ? 'R' : c === 'd' ? 'D' : c === 'u' ? 'U' : 'L']; yes = blocked(st.x + v[0], st.y + v[1]); }
        run(yes ? x.b : x.e, id + (yes ? '.' : ':')); } }); }
  snap('', 'start');
  try { run(prog, ''); } catch (e) { if (e instanceof Fail) return { ok: false, tr: tr, msg: e.msg, code: e.code }; throw e; }
  const left = Object.keys(st.left).map(k => st.left[k]);
  if (cgFind(grid, 'N').length && !st.goal) return { ok: false, tr: tr, msg: 'Гола нет. Добеги до мяча и ударь ⚽ в сторону ворот.', code: 'nogoal' };
  if (left.indexOf('*') >= 0) return { ok: false, tr: tr, msg: 'Остались косточки. Тоби хочет собрать все!', code: 'items' };
  if (left.indexOf('c') >= 0) return { ok: false, tr: tr, msg: 'Остались неосмотренные следы 🐾.', code: 'items' };
  if (g && !(st.x === g[0] && st.y === g[1])) return { ok: false, tr: tr, msg: 'Тоби не дошёл до цели. Добавь шагов.', code: 'short' };
  return { ok: true, tr: tr }; }

/* --- состояние ребёнка --- */
function cgK(kid){ const K = S.kids[kid]; if (!K.code) K.code = { lv: {}, pts: {}, pend: 0, last: '' }; return K.code; }
function cgIdx(id){ for (let i = 0; i < CG_LV.length; i++) if (CG_LV[i].id === id) return i; return -1; }
function cgOpen(kid, i){ if (i <= 0) return true; const C = cgK(kid).lv, a = C[CG_LV[i - 1].id]; if (a && a.s) return true;
  /* быстрый темп: три уровня подряд на 3 звезды с первой попытки — можно перешагнуть через один */
  if (i >= 4) { for (let k = i - 4; k < i - 1; k++) { const r = C[CG_LV[k].id]; if (!r || r.s < 3 || r.first !== 1) return false; } return true; }
  return false; }
function cgStars(lv, n, used){ if (used) return 1; const o = cgCount(cgParse(lv.sol)); return n <= o ? 3 : n <= o + 2 ? 2 : 1; }
function cgToday(kid){ return cgK(kid).pts[U.today()] || 0; }
/* Баллы приходят в копилку, когда уроки дня сделаны; до этого лежат «в ожидании» */
function cgPayPending(kid){ const C = cgK(kid); if (!C.pend) return; const t = U.today(); const D = S.kids[kid].days[t]; if (!(D && D.bonus) && !dayDone(kid, t)) return;
  piggyAdd(S.kids[kid], C.pend); ev(kid, 'программирование', { subj: 'Программирование', text: `+${C.pend} баллов из ожидания в копилку` }); C.pend = 0; save(); }

/* --- плитка на главной --- */
function codeTile(kid){ if (CODE_KIDS.indexOf(kid) < 0) return ''; const C = cgK(kid); let won = 0; CG_LV.forEach(l => { if (C.lv[l.id] && C.lv[l.id].s) won++; });
  const nx = CG_LV.find((l, i) => !(C.lv[l.id] && C.lv[l.id].s) && cgOpen(kid, i));
  return `<button class="tile code" data-act="always" data-id="code"><span class="ico"><img src="img/code-tile.webp" alt="" onerror="this.parentNode.textContent='🐶'"></span><span class="tt"><span class="sn">Тоби-программист</span><span class="ut">${won ? `Пройдено ${won} из ${CG_LV.length}` : 'Игра: научи щенка Тоби слушаться программы'}${nx ? ` · дальше: уровень ${nx.id}` : ' · всё пройдено!'}</span></span><span class="state">до +${CODE_DAY_MAX}</span></button>`; }

/* --- карта уровней --- */
function vCode(){ const kid = cur.kid, C = cgK(kid); cgPayPending(kid);
  const day = cgToday(kid);
  const chs = CG_CH.map(ch => { const L = CG_LV.map((l, i) => ({ l, i })).filter(z => z.l.ch === ch.id);
    const got = L.filter(z => C.lv[z.l.id] && C.lv[z.l.id].s).length;
    return `<section class="cgch card"><div class="cgchh"><div class="cgcov" style="background-image:url(img/${ch.img}.webp)"><span>${ch.ico}</span></div><div><h2>${ch.id}. ${U.esc(ch.t)}</h2><p class="hint">${U.esc(ch.what)} · ${got} из ${L.length}</p>${got === L.length ? `<p class="cgbadge">${U.esc(ch.badge)}</p>` : `<p class="hint">Награда за главу: ${U.esc(ch.badge)}</p>`}</div></div>
      <div class="cglvs">${L.map(z => { const r = C.lv[z.l.id], op = cgOpen(kid, z.i), s = r && r.s || 0;
        return `<button class="cglv ${s ? 'won' : op ? 'open' : 'lock'}${z.l.hard ? ' hard' : ''}" data-act="cglv" data-id="${z.l.id}" ${op ? '' : 'aria-disabled="true"'}><b>${z.l.id}</b><i>${s ? '★★★'.slice(0, s) + '<s>' + '★★★'.slice(s) + '</s>' : op ? '▶' : '🔒'}</i></button>`; }).join('')}</div></section>`; }).join('');
  return `<main class="wrap ${kid} cg"><header class="bar"><button class="link" data-act="home">← На главную</button><span class="coins">${coinsHtml(S.kids[kid].coins)}</span></header>
    <section class="hello cghero"><img class="cgtoby" src="img/code-toby.webp" alt="" onerror="this.remove()"><div><p class="eyebrow">Игра</p><h1>Тоби-программист</h1><p>Щенок Тоби понимает только программы. Собери из блоков программу, и Тоби выполнит её шаг за шагом.</p>
    <p class="hint">За новый уровень — столько баллов, сколько звёзд. Сегодня: <b>${day} из ${CODE_DAY_MAX}</b>.${C.pend ? ` Ждут в копилку: <b>${C.pend}</b> — придут, когда сделаешь уроки дня.` : ''}</p></div></section>${chs}</main>`; }

/* --- экран уровня --- */
let CG = null, CG_VIEW = 'map'; /* { id, prog, sel:{k,i}, run, vi, step, res, hint } */
function cgStart(id){ const lv = CG_LV[cgIdx(id)]; const C = cgK(cur.kid); const r = C.lv[id] || {};
  CG = { id: id, prog: lv.bug ? cgParse(lv.bug) : (r.prog ? JSON.parse(JSON.stringify(r.prog)) : []), sel: { k: '', i: -1 }, run: false, vi: 0, res: null, hint: 0, used: false };
  CG.sel.i = CG.prog.length; C.last = id; save(); CG_VIEW = 'lv'; go('always', { aid: 'code' }); setTimeout(() => say(lv.say), 400); }
function cgSlot(prog, k){ if (!k) return prog; let a = prog; for (const part of k.split('/')) { const m = part.split('.'); const n = a[+m[0]]; a = m[1] === 'e' ? n.e : n.b; } return a; }
function cgBlockHtml(x, path, k, i){ const sel = CG.sel.k === k && CG.sel.i === i + 1 && CG.selB, id = path;
  const del = sel ? `<span class="cgdel" data-act="cgdel" data-k="${k}" data-i="${i}">✕</span>` : '';
  if (x.t === 'P' || x.t === 'W' || x.t === 'I') {
    const kb = (k ? k + '/' : '') + i + '.b', ke = (k ? k + '/' : '') + i + '.e';
    const head = x.t === 'P' ? `<span class="cgh">🔁 Повтори <span class="cgn" data-act="cgnum" data-k="${k}" data-i="${i}">${x.n}</span> раз</span>`
      : x.t === 'W' ? `<span class="cgh">⟳ Пока не 🏁</span>` : `<span class="cgh">❓ Если <span class="cgn" data-act="cgcond" data-k="${k}" data-i="${i}">${CG_COND[x.c].i}</span></span>`;
    return `<div class="cgc cg${x.t}${sel ? ' sel' : ''}" data-id="${id}"><div class="cghd" data-act="cgsel" data-k="${k}" data-i="${i}">${head}${del}</div>${x.t === 'I' ? '<div class="cglab">да</div>' : ''}${cgListHtml(x.b, id + '.', kb)}${x.t === 'I' ? '<div class="cglab">иначе</div>' + cgListHtml(x.e, id + ':', ke) : ''}</div>`; }
  return `<span class="cgb cg${x.t}${sel ? ' sel' : ''}" data-id="${id}" data-act="cgsel" data-k="${k}" data-i="${i}">${CG_BLK[x.t]}${del}</span>`; }
function cgListHtml(list, path, k){ const on = CG.sel.k === k && !CG.selB;
  return `<div class="cgl${on ? ' on' : ''}">${CG.sel.k === k && CG.sel.i === 0 ? '<span class="cgcur"></span>' : ''}<span class="cgdrop${list.length && list[0].b ? ' lead' : ''}" data-act="cgslot" data-k="${k}" data-i="0">${list.length ? '' : '＋'}</span>${list.map((x, i) => cgBlockHtml(x, path + i, k, i) + (CG.sel.k === k && CG.sel.i === i + 1 ? '<span class="cgcur"></span>' : '')).join('')}${list.length ? `<span class="cgdrop end${list[list.length - 1].b ? ' after' : ''}" data-act="cgslot" data-k="${k}" data-i="${list.length}">${list[list.length - 1].b ? '＋' : ''}</span>` : ''}</div>`; }
function cgSprite(t){ return `<i class="cgs cgs-${t}"></i>`; }
function cgBoard(lv, grid){ const W = grid[0].length, H = grid.length, ch = CG_CH[lv.ch - 1];
  let cells = ''; grid.forEach((row, y) => { for (let x = 0; x < W; x++) { const c = row[x]; cells += `<div class="cgcell ${(x + y) % 2 ? 'b' : 'a'}${c === '#' ? ' wall' : c === 'N' ? ' net' : ''}">${c === '#' ? cgSprite(lv.ch === 2 || (lv.ch === 3 && cgFind(grid, 'N').length) ? 'def' : lv.ch === 4 ? 'brick' : (x * 7 + y * 3) % 3 ? 'bush' : 'tree') : c === 'G' ? cgSprite(lv.ch === 4 || lv.ch === 5 ? 'flag' : cgFind(grid, '*').length ? 'house' : 'bone') : ''}</div>`; } });
  const pos = (x, y) => `left:${x / W * 100}%;top:${y / H * 100}%;width:${100 / W}%;height:${100 / H}%`;
  const items = cgFind(grid, '*').map(p => `<div class="cgsp it" data-k="${p[0]},${p[1]}" style="${pos(p[0], p[1])}">${cgSprite('bone')}</div>`).join('') + cgFind(grid, 'c').map(p => `<div class="cgsp it" data-k="${p[0]},${p[1]}" style="${pos(p[0], p[1])}">${cgSprite('paw')}</div>`).join('');
  const s = cgFind(grid, 'S')[0], b = cgFind(grid, 'o')[0];
  let hint = ''; if (CG.hint) { const r = cgSim(lv, grid, cgParse(lv.sol)); const seen = {}; r.tr.forEach((t, i) => { const k = t.x + ',' + t.y; if (i && !seen[k]) { seen[k] = 1; hint += `<div class="cgsp hintdot" style="${pos(t.x, t.y)}"><span>${Object.keys(seen).length}</span></div>`; } }); }
  return `<div class="cgboard th-${ch.bg}" style="padding-bottom:${H / W * 100}%"><div class="cggrid" style="grid-template-columns:repeat(${W},1fr);grid-template-rows:repeat(${H},1fr)">${cells}</div>${hint}${items}${b ? `<div class="cgsp ball" id="cgball" style="${pos(b[0], b[1])}">${cgSprite('ball')}</div>` : ''}<div class="cgsp hero dR" id="cghero" style="${pos(s[0], s[1])}">${cgSprite('toby')}</div></div>`; }
function vCodeLv(){ const kid = cur.kid, lv = CG_LV[cgIdx(CG.id)], grids = cgGrids(lv), n = cgCount(CG.prog), r = cgK(kid).lv[lv.id] || {};
  const bl = lv.b.split('').filter(c => c !== 'P' && c !== 'W' && c !== 'I');
  const full = lv.max && n >= lv.max;
  const tut = lv.id === '1.1' && !CG.prog.length ? 'R' : lv.id === '1.1' && CG.prog.length < 4 ? 'R' : ''; const pal = bl.map(c => `<button class="cgb cg${c}${c === tut ? ' tut' : ''}" data-act="cgadd" data-t="${c}" ${CG.run || full ? 'disabled' : ''}>${CG_BLK[c]}</button>`).join('')
    + (lv.b.indexOf('P') >= 0 ? `<button class="cgb cgP wide" data-act="cgadd" data-t="P" ${CG.run || full ? 'disabled' : ''}>🔁 Повтори</button>` : '')
    + (lv.b.indexOf('W') >= 0 ? `<button class="cgb cgW wide" data-act="cgadd" data-t="W" ${CG.run || full ? 'disabled' : ''}>⟳ Пока не 🏁</button>` : '')
    + (lv.b.indexOf('I') >= 0 ? `<button class="cgb cgI wide" data-act="cgadd" data-t="I" ${CG.run || full ? 'disabled' : ''}>❓ Если</button>` : '');
  const res = CG.res;
  const tabs = grids.length > 1 ? `<div class="cgtabs">${grids.map((g, i) => `<button class="chip ${i === CG.vi ? 'on' : ''}" data-act="cgvar" data-i="${i}" ${CG.run ? 'disabled' : ''}>Улица ${i + 1}${res && res.vr && res.vr[i] != null ? (res.vr[i] ? ' ✓' : ' ✗') : ''}</button>`).join('')}</div><p class="hint center">Программа одна — она должна сработать на каждой улице.</p>` : '';
  const goal = lv.ch === 2 || cgFind(grids[0], 'N').length ? '⚽ → 🥅' : grids[0].join('').indexOf('c') >= 0 ? '🐾 → 🏁' : grids[0].join('').indexOf('*') >= 0 ? '🦴 → 🏠' : lv.ch >= 4 ? '🏁' : '🦴';
  return `<main class="wrap ${kid} cg cglvl"><header class="bar"><button class="link" data-act="code">← Уровни</button><span class="cgttl">Уровень ${lv.id} · ${goal}</span><button class="link" data-act="cgsay">🔊</button></header>
  <p class="cgsay">${U.esc(lv.say)}</p>${tabs}
  <div id="cgbwrap">${cgBoard(lv, grids[CG.vi])}</div>
  ${res && !CG.run ? `<div class="fb ${res.ok ? 'ok' : 'try'}">${res.ok ? `Ура! ${'⭐'.repeat(res.stars)} ${res.pts ? `+${res.pts} ${U.pl(res.pts, 'балл', 'балла', 'баллов')}${res.pend ? ' (придут после уроков дня)' : ''}` : ''}${res.badge ? `<div class="cgbadge big">Глава пройдена! Награда: ${U.esc(res.badge)}</div>` : ''}${res.stars < 3 && !CG.used ? `<br><small>Можно короче: попробуй уложиться в ${cgCount(cgParse(lv.sol))} ${U.pl(cgCount(cgParse(lv.sol)), 'блок', 'блока', 'блоков')}, чтобы получить 3 звезды.</small>` : ''}` : U.esc(res.msg)}</div>` : ''}
  <section class="cgprog card"><div class="cgph"><b>Программа</b><span class="hint">${lv.max ? `блоков ${n} из ${lv.max}` : `блоков: ${n}`}</span></div>${cgListHtml(CG.prog, '', '')}</section>
  <section class="cgpal">${pal}</section>
  <div class="cgctl">${res && res.ok && !CG.run ? `<button class="btn" data-act="cgnext">Дальше ▶</button>` : `<button class="btn cgrun" data-act="cgrun" ${CG.run || !CG.prog.length ? 'disabled' : ''}>▶ Пуск</button>`}
    <button class="btn ghost" data-act="cgclear" ${CG.run ? 'disabled' : ''}>🗑 Очистить</button>
    ${(r.t || 0) >= 2 && !CG.hint && !(res && res.ok) ? `<button class="btn ghost glow" data-act="cghint">💡 Подсказка</button>` : ''}
    ${(r.t || 0) >= 4 && !(res && res.ok) && !CG.used ? `<button class="btn ghost" data-act="cgsol">📖 Показать решение</button>` : ''}</div>
  <p class="hint center">Нажми на блок в программе, чтобы выбрать его: новый блок встанет после него, ✕ — удалить. Нажми на «＋» внутри Повтори, чтобы класть блоки внутрь. Число в Повтори меняется нажатием.</p></main>`; }

/* --- проигрывание --- */
function cgApply(t){ const h = document.getElementById('cghero'); if (!h) return;
  const grid = cgGrids(CG_LV[cgIdx(CG.id)])[CG.vi], w = grid[0].length, hh = grid.length;
  h.style.left = t.x / w * 100 + '%'; h.style.top = t.y / hh * 100 + '%'; h.className = 'cgsp hero d' + t.d + (t.ev === 'bump' || t.ev === 'no' ? ' bump' : t.ev === 'take' ? ' sniff' : t.ev === 'goal' ? ' joy' : '');
  const ball = document.getElementById('cgball'); if (ball && t.ball) { ball.style.left = t.ball.x / w * 100 + '%'; ball.style.top = t.ball.y / hh * 100 + '%'; ball.className = 'cgsp ball' + (t.goal ? ' in' : ''); }
  const L = {}; t.left.forEach(k => { L[k] = 1; }); Array.prototype.forEach.call(document.querySelectorAll('.cgsp.it'), el => { el.classList.toggle('got', !L[el.dataset.k]); });
  Array.prototype.forEach.call(document.querySelectorAll('.cgprog .run'), el => el.classList.remove('run'));
  if (t.hl) { const el = document.querySelector(`.cgprog [data-id="${t.hl}"]`); if (el) el.classList.add('run'); } }
function cgRun(){ const kid = cur.kid, lv = CG_LV[cgIdx(CG.id)], grids = cgGrids(lv);
  if (lv.max && cgCount(CG.prog) > lv.max) { alertMsg(`Не больше ${lv.max} блоков`); return; }
  const R = grids.map(g => cgSim(lv, g, CG.prog)); const vr = R.map(x => x.ok);
  CG.run = true; CG.res = null; CG.vi = 0; render(); let vi = 0, i = 0;
  const done = () => { CG.run = false; const ok = vr.every(Boolean), bad = R.find(x => !x.ok);
    const C = cgK(kid), rec = C.lv[lv.id] || (C.lv[lv.id] = { s: 0, t: 0, w: 0 });
    if (!ok) { rec.t = (rec.t || 0) + 1; CG.res = { ok: false, msg: (grids.length > 1 ? `Улица ${R.indexOf(bad) + 1}: ` : '') + bad.msg, vr: vr }; CG.vi = R.indexOf(bad); save(); render(); say(bad.msg); return; }
    const n = cgCount(CG.prog), stars = cgStars(lv, n, CG.used); const prev = rec.s || 0; if (!prev && !rec.first) rec.first = (rec.t || 0) + 1;
    rec.w = (rec.w || 0) + 1; rec.prog = JSON.parse(JSON.stringify(CG.prog));
    let pts = 0, pend = false; if (stars > prev && !CG.used) { const room = Math.max(0, CODE_DAY_MAX - cgToday(kid)); pts = Math.min(stars - prev, room); }
    if (stars > prev) rec.s = stars;
    if (pts) { C.pts[U.today()] = cgToday(kid) + pts; const t = U.today(), D = S.kids[kid].days[t]; if ((D && D.bonus) || dayDone(kid, t)) piggyAdd(S.kids[kid], pts); else { C.pend = (C.pend || 0) + pts; pend = true; } }
    ev(kid, 'программирование', { subj: 'Программирование', unit: `Уровень ${lv.id}`, score: stars + '★', ok: CG.used ? 'по решению' : 'верно', text: `попыток ${rec.t + 1}, блоков ${n}${pts ? `, +${pts} баллов` : ''}` });
    const chL = CG_LV.filter(l => l.ch === lv.ch), chDone = chL.every(l => C.lv[l.id] && C.lv[l.id].s); const badge = chDone && prev === 0 ? CG_CH[lv.ch - 1].badge : '';
    if (badge) ev(kid, 'программирование', { subj: 'Программирование', unit: `Глава ${lv.ch} пройдена`, text: badge });
    CG.res = { ok: true, stars: stars, pts: pts, pend: pend, vr: vr, badge: badge }; save(); render();
    say(badge ? 'Глава пройдена! Тоби получает награду: ' + badge.replace(/^\S+\s/, '') : stars === 3 ? 'Отлично! Три звезды!' : 'Получилось!'); };
  const me = CG; const step = () => { if (CG !== me || cur.view !== 'always' || cur.aid !== 'code' || CG_VIEW !== 'lv') { me.run = false; return; } const tr = R[vi].tr;
    if (i < tr.length) { cgApply(tr[i]); i++; setTimeout(step, tr[i - 1].ev === 'fly' ? 140 : CODE_STEP_MS); return; }
    if (R[vi].ok && vi + 1 < R.length) { vi++; i = 0; CG.vi = vi; CG.res = { vr: vr.map((v, k) => k < vi ? v : null) }; const w = document.getElementById('cgbwrap'); if (w) w.innerHTML = cgBoard(lv, grids[vi]); Array.prototype.forEach.call(document.querySelectorAll('.cgtabs .chip'), (el, k) => { el.classList.toggle('on', k === vi); }); setTimeout(step, 500); return; }
    if (!R[vi].ok) { R.forEach((x, k) => { if (k > vi) vr[k] = null; }); }
    setTimeout(done, 350); };
  setTimeout(step, 250); }

/* --- действия --- */
function codeAct(act, b){ const kid = cur.kid;
  if (act === 'code') { if (CG) CG.run = false; CG = null; CG_VIEW = 'map'; go('always', { aid: 'code' }); return true; }
  if (act === 'cglv') { const i = cgIdx(b.dataset.id); if (!cgOpen(kid, i)) { alertMsg('Сначала пройди предыдущий уровень'); return true; } cgStart(b.dataset.id); return true; }
  if (!CG) return false; const lv = CG_LV[cgIdx(CG.id)];
  if (CG.run && CG_VIEW === 'lv') return true;
  const touch = () => { CG.res = null; };
  switch (act) {
    case 'cgsay': say(lv.say); return true;
    case 'cgadd': { const t = b.dataset.t; const arr = cgSlot(CG.prog, CG.sel.k); const depth = CG.sel.k ? CG.sel.k.split('/').length : 0;
      if ((t === 'P' || t === 'W' || t === 'I') && depth >= 2) { alertMsg('Глубже класть нельзя'); return true; }
      const node = t === 'P' ? { t: 'P', n: 2, b: [] } : t === 'W' ? { t: 'W', b: [] } : t === 'I' ? { t: 'I', c: (lv.cond || 'c')[0], b: [], e: [] } : { t: t };
      const at = Math.max(0, Math.min(CG.sel.i, arr.length)); arr.splice(at, 0, node);
      if (node.b) CG.sel = { k: (CG.sel.k ? CG.sel.k + '/' : '') + at + '.b', i: 0 }; else CG.sel = { k: CG.sel.k, i: at + 1 }; CG.selB = false;
      touch(); render(); return true; }
    case 'cgsel': { const k = b.dataset.k, i = +b.dataset.i; if (CG.sel.k === k && CG.sel.i === i + 1 && CG.selB) CG.selB = false; else { CG.sel = { k: k, i: i + 1 }; CG.selB = true; } render(); return true; }
    case 'cgslot': CG.sel = { k: b.dataset.k, i: +b.dataset.i }; CG.selB = false; render(); return true;
    case 'cgdel': { const arr = cgSlot(CG.prog, b.dataset.k), i = +b.dataset.i; arr.splice(i, 1); CG.sel = { k: b.dataset.k, i: i }; CG.selB = false; touch(); render(); return true; }
    case 'cgnum': { const x = cgSlot(CG.prog, b.dataset.k)[+b.dataset.i]; x.n = x.n >= 9 ? 2 : x.n + 1; touch(); render(); return true; }
    case 'cgcond': { const x = cgSlot(CG.prog, b.dataset.k)[+b.dataset.i]; const cs = (lv.cond || 'c').split(''); x.c = cs[(cs.indexOf(x.c) + 1) % cs.length]; touch(); render(); say(CG_COND[x.c].t); return true; }
    case 'cgclear': CG.prog = []; CG.sel = { k: '', i: 0 }; CG.selB = false; CG.used = false; touch(); render(); return true;
    case 'cgvar': CG.vi = +b.dataset.i; render(); return true;
    case 'cgrun': cgRun(); return true;
    case 'cghint': CG.hint = 1; render(); say('Номера на поле показывают, куда должен пройти Тоби. Посчитай шаги.'); ev(kid, 'не понимаю', { subj: 'Программирование', unit: `Уровень ${lv.id}`, text: 'подсказка' }); return true;
    case 'cgsol': if (!window.confirm('Показать решение? За этот уровень тогда будет одна звезда и без баллов. Разберись, как оно работает!')) return true; CG.prog = cgParse(lv.sol); CG.used = true; CG.sel = { k: '', i: CG.prog.length }; touch(); render(); return true;
    case 'cgnext': { const i = cgIdx(CG.id) + 1; if (i < CG_LV.length && cgOpen(kid, i)) cgStart(CG_LV[i].id); else { CG = null; CG_VIEW = 'map'; go('always', { aid: 'code' }); } return true; }
  }
  return false; }

/* подключение к разделу «Всегда доступно» (см. app.js: ALWAYS) */
var ALWAYS = window.ALWAYS || (window.ALWAYS = []);
ALWAYS.push({ id: 'code', order: 5, full: true,
  tile: function(kid){ return codeTile(kid); },
  open: function(){ if (CG) CG.run = false; CG = null; CG_VIEW = 'map'; },
  view: function(kid){ if (!kid) return vLogin(); return CG_VIEW === 'lv' && CG ? vCodeLv() : vCode(); },
  act: function(act, b){ codeAct(act, b); } });
