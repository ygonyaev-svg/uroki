var TEST_SHIFT = 0; /* тестовый режим: «новый день» сдвигает календарь вперёд */
/* ===== Общие утилиты ===== */
const U = {
  h(s){ let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; },
  rng(seed){
    let a = typeof seed === 'number' ? seed : U.h(seed);
    const f = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    f.int = (x, y) => x + Math.floor(f() * (y - x + 1));
    f.pick = arr => arr[Math.floor(f() * arr.length)];
    f.shuffle = arr => { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
    f.sample = (arr, n) => f.shuffle(arr).slice(0, n);
    return f;
  },
  /* Убрать эмодзи (для <option>, где наши иконки не подставляются) */
  noEmo(s){ return String(s == null ? '' : s).replace(/[\u2600-\u27BF\uFE0F\u200D\u2B50\u2B06\u2934\u2935\u3030\u303D\u3297\u3299]|[\uD83C-\uD83E][\uDC00-\uDFFF]/g, '').replace(/\s{2,}/g, ' ').trim(); },
  /* Имя в винительном падеже: «за Глеба», «за Катю», «за Мишу» */
  acc(n){ n = String(n || ''); if (/[^А-Яа-яЁё]/.test(n.slice(-1)) || n.length < 2) return n; const l = n.slice(-1), p = n.slice(0, -1); if (l === 'а') return p + 'у'; if (l === 'я') return p + 'ю'; if (l === 'й' || l === 'ь') return p + 'я'; if (/[бвгджзклмнпрстфхцчшщ]/i.test(l)) return n + 'а'; return n; },
  pl(n, one, few, many){ const m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return one; if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few; return many; },
  dec(x){ return String(Math.round(x * 1000) / 1000).replace('.', ','); },
  big(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); },
  esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); },
  today(){ const d = new Date(Date.now() + (typeof TEST_SHIFT === 'number' ? TEST_SHIFT : 0) * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
  dayNum(ds){ const [y, m, d] = ds.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5); },
  addDays(ds, n){ const [y, m, d] = ds.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1, d + n)); return t.toISOString().slice(0, 10); },
  roman(n){ const r = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]; let s = ''; for (const [v, c] of r) while (n >= v) { s += c; n -= v; } return s; },
  gcd(a, b){ while (b) [a, b] = [b, a % b]; return Math.abs(a); }
};

/* ===== Объяснение темы по схеме советского учебника (Моро, Виленкин, Рамзаева, букварь Горецкого) =====
   z — житейская задача, с которой учебник начинает тему; pic — рисунок к ней ('имя|арг|…', рисуется при показе: thPic в src/pics.js);
   zr — как её решили; xp — рисунок к образцу; n — названия (термины); r — правило формулировкой учебника; x — образец; c — проверка.
   Озвучка читает th как strip(th с <br> → «. »): после метки стоит <br>, скрытый в CSS, чтобы голос делал паузу. */
function UCH(o){ const L = s => `<span class="tl">${s}</span><br>`; let h = '';
  if (o.z) h += `<div class="tz">${L(o.zl || 'Задача')}${o.z}${o.pic ? `<i class="tp" data-tp="${o.pic}"></i>` : ''}${o.zr ? `<span class="tzr">${o.zr}</span>` : ''}</div>`;
  else if (o.pic) h += `<i class="tp" data-tp="${o.pic}"></i>`;
  if (o.n) h += `<div class="tn">${L('Запомни названия')}${o.n}</div>`;
  if (o.r) h += `<div class="tr">${L('Правило')}${[].concat(o.r).join('<br>')}</div>`;
  if (o.x) h += `<div class="tx">${L('Образец')}${o.x}${o.xp ? `<i class="tp" data-tp="${o.xp}"></i>` : ''}${o.c ? `<span class="tc">Проверка: ${o.c}</span>` : ''}</div>`;
  if (o.m) h += `<div class="tm">${o.m}</div>`;
  return h.replace(/(\S) ([=+−·:<>≈]) (?=\S)/g, '$1\u00a0$2\u00a0'); }

/* ===== Конструкторы заданий =====
   k:'c' — выбор ответа, k:'n' — число. q — вопрос (html), a — ответ, w — неверные, e — пояснение */
function C(q, a, w, e){ a = String(a); const ws = []; for (const x of w) { const s = String(x); if (s !== a && !ws.includes(s)) ws.push(s); } return { k: 'c', q, a, w: ws.slice(0, 3), e: e || '' }; }
function N(q, a, e){ return { k: 'n', q, a: Number(a), e: e || '' }; }
function cmp(a, b){ return a > b ? '>' : a < b ? '<' : '='; }
function CMP(q, x, y, e){ const s = cmp(x, y); return C(q, s, ['>', '<', '='].filter(z => z !== s), e); }
/* Банк: строки "вопрос|ответ|неверный1;неверный2;неверный3|пояснение" */
function B(lines){
  const items = lines.map(l => { const [q, a, w, e] = l.split('|'); return { q, a, w: (w || '').split(';').filter(Boolean), e }; });
  return r => { const it = r.pick(items); return C(it.q, it.a, it.w, it.e); };
}
/* Несколько генераторов вперемешку */
function MIX(...gs){ return r => r.pick(gs)(r); }
/* Неверные числовые ответы рядом с правильным */
function near(a, r, steps){ steps = steps || [1, 2, 10, -1, -2, -10, 5, -5]; const out = []; for (const s of r.shuffle(steps)) { const v = a + s; if (v >= 0 && v !== a && !out.includes(v)) out.push(v); if (out.length === 3) break; } return out; }

/* Согласование числа и слова в задачах: «4 сов» → «4 совы», «21 очков» → «21 очко». После предлогов форму не трогаем. */
const AGREE = (() => { const L = 'единица,единицы,единиц|десяток,десятка,десятков|зверёк,зверька,зверьков|рыбка,рыбки,рыбок|мяч,мяча,мячей|монета,монеты,монет|щенок,щенка,щенков|слово,слова,слов|гол,гола,голов|место,места,мест|кораблик,кораблика,корабликов|уровень,уровня,уровней|цент,цента,центов|ведро,ведра,вёдер|нога,ноги,ног|паук,паука,пауков|конфета,конфеты,конфет|собака,собаки,собак|игрок,игрока,игроков|цветок,цветка,цветков|ряд,ряда,рядов|марка,марки,марок|яблоко,яблока,яблок|наклейка,наклейки,наклеек|минута,минуты,минут|день,дня,дней|квадрат,квадрата,квадратов|дом,дома,домов|утка,утки,уток|очко,очка,очков|команда,команды,команд|книга,книги,книг|шкатулка,шкатулки,шкатулок|письмо,письма,писем|сова,совы,сов|заклинание,заклинания,заклинаний|звёздочка,звёздочки,звёздочек|ученик,ученика,учеников|страница,страницы,страниц|кошка,кошки,кошек|мышь,мыши,мышей|сын,сына,сыновей|друг,друга,друзей|кофта,кофты,кофт|юбка,юбки,юбок|стул,стула,стульев|балл,балла,баллов|задача,задачи,задач|час,часа,часов|котёнок,котёнка,котят|птица,птицы,птиц|машина,машины,машин|карандаш,карандаша,карандашей|гриб,гриба,грибов|ягода,ягоды,ягод|лист,листа,листов|страна,страны,стран|ребёнок,ребёнка,детей';
  const m = {}; for (const g of L.split('|')) { const f = g.split(','); for (const w of f) if (!m[w] || w === f[2]) m[w] = f; } return m; })();
const AGREE_PREP = /(?:^|[\s(«])(из|от|до|без|у|для|около|кроме|с|со|по|в|во|на|о|об|к|ко|за|между|над|под|при)\s+$/i;
function agree(s){ if (typeof s !== 'string') return s; return s.replace(/(^|[^\d,.])(\d+)(\s+)([а-яё]+)(?![а-яё])/gi, (all, pre, n, sp, w, off, str) => { off += pre.length; const f = AGREE[w.toLowerCase()]; if (!f) return all;
  if (AGREE_PREP.test(str.slice(Math.max(0, off - 12), off))) return all; const k = +n, m10 = k % 10, m100 = k % 100;
  const v = m10 === 1 && m100 !== 11 ? f[0] : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? f[1] : f[2]; return pre + n + sp + (w[0] === w[0].toUpperCase() ? v[0].toUpperCase() + v.slice(1) : v); }); }
/* ===== Везде — варианты ответа крупными кнопками (правило Юры 21.11): ручной ввод заменяем выбором ===== */
function numOpts(a, r){ a = Number(a); const isInt = Math.abs(a - Math.round(a)) < 1e-9, m = Math.abs(a), c = [];
  if (isInt) { c.push(a + 1, a - 1, a + 10, a - 10, a + 2); if (m >= 100) c.push(a + 100, a - 100); if (m >= 1000) c.push(a + 1000, a - 1000); if (m >= 20) c.push(a + 20, a - 20, a + 9, a - 9); /* не «×10» и «:10» — такие варианты нелепы */ const s = String(Math.abs(a)); if (s.length >= 2) { const sw = Number(s.slice(0, -2) + s.slice(-1) + s.slice(-2, -1)) * (a < 0 ? -1 : 1); c.push(sw); } }
  else c.push(a + .1, a - .1, a + 1, a - 1, a * 10, a / 10, a + .01);
  const out = []; for (const v0 of r.shuffle(c)) { const v = Math.round(v0 * 1000) / 1000; if (v !== a && (a < 0 || v >= 0) && !out.includes(v)) out.push(v); if (out.length === 3) break; }
  while (out.length < 3) { const v = a + out.length + 3; if (!out.includes(v)) out.push(v); } return out; }
function asChoice(t, seed, pool){ if (!t || t.k === 'c' || !(t.k === 'n' || t.k === 't')) return t; const r = U.rng(seed);
  if (t.k === 'n') { const a = U.dec(t.a);
    /* У автора были свои неверные варианты — берём их: соседние числа могут оказаться тоже верными («делится на 10»: 4820 и 48200) */
    const own = (t.wn || []).map(x => U.dec(Number(String(x).replace(',', '.')))).filter((x, i, A) => x !== a && A.indexOf(x) === i);
    const ws = own.length >= 2 ? own.slice(0, 3) : numOpts(t.a, r).map(U.dec);
    return Object.assign({}, t, { k: 'c', a, opts: r.shuffle([a].concat(ws)), was: 'n' }); }
  const low = x => String(x).toLowerCase().replace(/ё/g, 'е').trim(), A = String(t.a), bad = [A].concat(t.alt || []).map(low);
  const qw = (String(t.q).replace(/<[^>]+>/g, ' ').match(/«([^»]+)»/) || [])[1] || '';
  const fromQ = qw.split(/[\s,.;:!?—–-]+/).filter(w => w.length >= 2 && /[А-Яа-яЁёA-Za-zÀ-ÿ]/.test(w));
  const cand = []; const add = w => { const l = low(w); if (l && !bad.includes(l) && !cand.some(x => low(x) === l)) cand.push(/^[А-ЯЁA-Z]/.test(A) ? w : (w.length > 1 && w !== w.toUpperCase() ? w.toLowerCase() : w)); };
  (t.wx || []).forEach(add); /* сначала — неверные варианты, которые задал автор задания */
  if (A.split(/\s+/).length === 1 && fromQ.length) r.shuffle(fromQ).forEach(add);
  (pool || []).forEach(x => { if (x && x !== t && x.k === 't') add(String(x.a)); });
  if (cand.length < 1) return t; return Object.assign({}, t, { k: 'c', a: A, opts: r.shuffle([A].concat(cand.slice(0, 3))), was: 't' }); }
function allChoice(T, seed){ return (T || []).map((t, i) => asChoice(t, (seed || 1) * 31 + i * 7, T)); }
