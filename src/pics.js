/* ===== Картинки к заданиям: рисунки к математике (SVG), картинки к словам задания, тематические сцены, обложки глав ===== */
const PX = {
  svg: (w, h, body, cls) => `<svg class="pic ${cls || ''}" width="${Math.round(w)}" height="${Math.round(h)}" viewBox="0 0 ${w} ${h}" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${body}</svg>`,
  t: (x, y, s, size, fill, anchor) => `<text x="${x}" y="${y}" font-size="${size || 16}" fill="${fill || 'currentColor'}" text-anchor="${anchor || 'middle'}" font-family="system-ui,-apple-system,sans-serif" font-weight="600">${s}</text>`,
  num: s => Number(String(s).replace(/\s/g, '').replace(',', '.'))
};

/* Десятки палочками, единицы кружками */
function picTens(nums, op, hide){
  const items = []; let x = 10, H = 0;
  nums.forEach((n, k) => {
    const d = Math.floor(n / 10), e = n % 10, start = x; let g = '';
    for (let i = 0; i < d; i++) { g += `<rect x="${x}" y="10" width="12" height="100" rx="3" fill="#3b82f6"/>`; for (let j = 1; j < 10; j++) g += `<line x1="${x}" x2="${x + 12}" y1="${10 + j * 10}" y2="${10 + j * 10}" stroke="#bfdbfe" stroke-width="1"/>`; x += 16; }
    for (let i = 0; i < e; i++) { g += `<circle cx="${x + 8 + (i % 2) * 16}" cy="${102 - Math.floor(i / 2) * 18}" r="7" fill="#f59e0b"/>`; }
    if (e) x += 36;
    if (!hide) g += PX.t((start + x) / 2 - 4, 132, n, 18);
    items.push(g); x += 10;
    if (k < nums.length - 1) { items.push(PX.t(x + 8, 70, op, 28)); x += 30; }
    H = 140;
  });
  return PX.svg(Math.max(x, 120), H, items.join(''), 'tens');
}
/* Умножение — ряды, деление — поровну по группам */
function picArray(a, b, emo, div){
  const R = div ? Math.round(a / b) : a, C = div ? b : b; if (R * C > 100) return '';
  const s = 26, w = C * s + 20, h = R * s + 30; let g = '';
  for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) g += `<text x="${10 + j * s + s / 2}" y="${10 + i * s + s * .78}" font-size="${s * .8}" text-anchor="middle">${emo}</text>`;
  if (div) for (let j = 0; j < C; j++) g += `<rect x="${10 + j * s + 1}" y="6" width="${s - 2}" height="${R * s + 6}" rx="8" fill="none" stroke="#a78bfa" stroke-dasharray="4 3"/>`;
  if (w >= 140) g += PX.t(w / 2, h - 4, div ? `${a} — поровну на ${C}` : `${a} ряд. по ${b}`, 13, '#64748b');
  return PX.svg(Math.max(w, 60), h, g, 'arr');
}
/* Дробь — круг */
function picPie(n, d){
  if (!(d > 0 && d <= 16)) return ''; const whole = Math.floor(n / d), rest = n % d, pies = Math.min(4, whole + (rest ? 1 : 0)) || 1; let g = '';
  for (let p = 0; p < pies; p++) { const cx = 55 + p * 105, fill = p < whole ? d : rest;
    for (let i = 0; i < d; i++) { const a0 = i / d * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / d * 2 * Math.PI - Math.PI / 2;
      const x0 = cx + 45 * Math.cos(a0), y0 = 55 + 45 * Math.sin(a0), x1 = cx + 45 * Math.cos(a1), y1 = 55 + 45 * Math.sin(a1);
      g += `<path d="M${cx},55 L${x0.toFixed(1)},${y0.toFixed(1)} A45,45 0 ${d === 1 ? 1 : 0},1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${i < fill ? '#14b8a6' : '#e2e8f0'}" stroke="#fff" stroke-width="2"/>`; } }
  g += PX.t(pies * 105 / 2 + 2, 122, `${n}/${d}`, 16);
  return PX.svg(pies * 105 + 5, 130, g, 'pie');
}
/* Проценты — сетка 10×10 */
function picPct(p){ if (!(p > 0 && p <= 100)) return ''; let g = '';
  for (let i = 0; i < 100; i++) g += `<rect x="${10 + (i % 10) * 12}" y="${10 + Math.floor(i / 10) * 12}" width="11" height="11" rx="2" fill="${i < p ? '#f43f5e' : '#e2e8f0'}"/>`;
  g += PX.t(70, 146, `${p} из 100`, 12, '#64748b'); return PX.svg(140, 152, g, 'pct'); }
/* Прямоугольник со сторонами */
function picRect(a, b, unit, sq){ const k = 150 / Math.max(a, b), w = Math.max(30, a * k), h = Math.max(24, b * k), L = 70;
  let g = `<rect x="${L}" y="24" width="${w}" height="${h}" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>`;
  g += PX.t(L + w / 2, 17, sq === '?' ? '?' : `${a} ${unit}`, 14) + PX.t(L - 6, 24 + h / 2 + 5, sq === '?' ? '?' : `${b} ${unit}`, 14, null, 'end');
  if (sq) g += PX.t(L + w / 2, 24 + h / 2 + 6, sq === '?' ? `P = ${a * 4} ${unit}` : 'квадрат', 13, '#16a34a');
  return PX.svg(L + w + 20, h + 44, g, 'rect'); }
/* Коробка-параллелепипед */
function picBox(a, b, c, unit){ const g = `<path d="M30,60 L130,60 L130,140 L30,140 Z" fill="#fde68a" stroke="#b45309" stroke-width="2"/><path d="M30,60 L60,30 L160,30 L130,60 Z" fill="#fcd34d" stroke="#b45309" stroke-width="2"/><path d="M130,60 L160,30 L160,110 L130,140 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>`
  + PX.t(80, 158, `${a} ${unit}`, 13) + PX.t(170, 80, `${c} ${unit}`, 13, null, 'start') + PX.t(150, 22, `${b} ${unit}`, 13);
  return PX.svg(230, 165, g, 'box'); }
/* Линейка */
function picRuler(cm){ cm = Math.min(cm, 60); const k = cm > 30 ? 8 : 14, w = cm * k + 30; let g = `<rect x="10" y="20" width="${cm * k + 10}" height="40" rx="4" fill="#fef3c7" stroke="#d97706"/>`;
  for (let i = 0; i <= cm; i++) g += `<line x1="${15 + i * k}" x2="${15 + i * k}" y1="20" y2="${i % 10 === 0 ? 48 : i % 5 === 0 ? 40 : 32}" stroke="#92400e"/>` + (i % 10 === 0 ? PX.t(15 + i * k, 76, i, 11, '#92400e') : '');
  return PX.svg(w, 82, g, 'ruler'); }
/* Часы */
function picClock(h, m){ const ha = ((h % 12) + m / 60) / 12 * 2 * Math.PI, ma = m / 60 * 2 * Math.PI; let g = `<circle cx="70" cy="70" r="60" fill="#fff" stroke="#334155" stroke-width="4"/>`;
  for (let i = 1; i <= 12; i++) { const a = i / 12 * 2 * Math.PI; g += PX.t(70 + 47 * Math.sin(a), 75 + -47 * Math.cos(a), i, 13, '#334155'); }
  g += `<line x1="70" y1="70" x2="${70 + 30 * Math.sin(ha)}" y2="${70 - 30 * Math.cos(ha)}" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/><line x1="70" y1="70" x2="${70 + 48 * Math.sin(ma)}" y2="${70 - 48 * Math.cos(ma)}" stroke="#e11d48" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="70" r="5" fill="#0f172a"/>`;
  return PX.svg(140, 140, g, 'clock'); }
/* Весы для уравнения */
function picScale(left, right){ const g = `<polygon points="150,150 135,175 165,175" fill="#64748b"/><rect x="146" y="40" width="8" height="112" fill="#64748b"/><rect x="40" y="36" width="220" height="8" rx="4" fill="#475569"/>
  <line x1="70" y1="44" x2="55" y2="90" stroke="#94a3b8"/><line x1="70" y1="44" x2="85" y2="90" stroke="#94a3b8"/><line x1="230" y1="44" x2="215" y2="90" stroke="#94a3b8"/><line x1="230" y1="44" x2="245" y2="90" stroke="#94a3b8"/>
  <path d="M20,90 h100 a50,20 0 0,1 -100,0" fill="#cbd5e1"/><path d="M180,90 h100 a50,20 0 0,1 -100,0" fill="#cbd5e1"/>` + PX.t(70, 84, left, 17) + PX.t(230, 84, right, 17);
  return PX.svg(300, 180, g, 'scale'); }
/* Угол */
function picAngle(deg, total){ const a = deg * Math.PI / 180; let g = `<line x1="30" y1="110" x2="210" y2="110" stroke="#334155" stroke-width="3"/>`;
  if (total === 90) g += `<line x1="30" y1="110" x2="30" y2="10" stroke="#334155" stroke-width="3"/>`; else g += `<line x1="30" y1="110" x2="-150" y2="110" stroke="#334155" stroke-width="3"/>`;
  const ox = total === 180 ? 120 : 30; g = total === 180 ? `<line x1="10" y1="110" x2="230" y2="110" stroke="#334155" stroke-width="3"/>` : g;
  g += `<line x1="${ox}" y1="110" x2="${ox + 95 * Math.cos(a)}" y2="${110 - 95 * Math.sin(a)}" stroke="#e11d48" stroke-width="3"/>`;
  g += `<path d="M${ox + 30},110 A30,30 0 0,0 ${ox + 30 * Math.cos(a)},${110 - 30 * Math.sin(a)}" fill="none" stroke="#e11d48" stroke-width="2"/>` + PX.t(ox + 45 * Math.cos(a / 2) + 6, 110 - 45 * Math.sin(a / 2), deg + '°', 13, '#e11d48');
  g += PX.t(ox + 40 * Math.cos((a + total * Math.PI / 180) / 2), 110 - 40 * Math.sin((a + total * Math.PI / 180) / 2), '?', 16, '#2563eb');
  return PX.svg(240, 125, g, 'angle'); }
/* Столбики для среднего */
function picBars(vals){ const mx = Math.max(...vals), avg = vals.reduce((a, b) => a + b, 0) / vals.length, w = vals.length * 46 + 20; let g = '';
  vals.forEach((v, i) => { const h = v / mx * 100; g += `<rect x="${15 + i * 46}" y="${115 - h}" width="34" height="${h}" rx="4" fill="#60a5fa"/>` + PX.t(32 + i * 46, 132, v, 12); });
  const y = 115 - avg / mx * 100; g += `<line x1="8" x2="${w - 4}" y1="${y}" y2="${y}" stroke="#f43f5e" stroke-width="2" stroke-dasharray="6 4"/>` + PX.t(w - 6, y - 4, 'среднее', 11, '#f43f5e', 'end');
  return PX.svg(w, 138, g, 'bars'); }

/* Разрядная таблица: целые числа по классам и десятичные дроби */
function picPlace(str){ str = str.replace(/\s/g, ''); const [ip, fp] = str.split(/[.,]/); const w = 40, cells = [];
  const digs = ip.split(''), n = digs.length; digs.forEach((d, i) => { const r = n - 1 - i; cells.push({ d, cls: Math.floor(r / 3), c: ['#bbf7d0', '#bfdbfe', '#fde68a'][Math.floor(r / 3)] || '#e9d5ff' }); });
  let g = '', x = 10, prev = null, groups = [];
  cells.forEach((c, i) => { if (prev !== null && c.cls !== prev) x += 10; if (prev !== c.cls) groups.push({ cls: c.cls, x0: x }); g += `<rect x="${x}" y="10" width="${w - 4}" height="48" rx="7" fill="${c.c}"/>` + PX.t(x + (w - 4) / 2, 45, c.d, 26); groups[groups.length - 1].x1 = x + w - 4; x += w; prev = c.cls; });
  const names = ['единицы', 'тысячи', 'миллионы', 'миллиарды'];
  if (n > 3) groups.forEach(gr => { g += `<line x1="${gr.x0}" x2="${gr.x1}" y1="66" y2="66" stroke="#64748b"/>` + PX.t((gr.x0 + gr.x1) / 2, 82, gr.x1 - gr.x0 < 70 ? ['ед.', 'тыс.', 'млн', 'млрд'][gr.cls] : names[gr.cls], 11, '#475569'); });
  if (fp) { g += PX.t(x + 2, 50, ',', 30); x += 12; const fx = x; fp.split('').forEach(d => { g += `<rect x="${x}" y="10" width="${w - 4}" height="48" rx="7" fill="#fbcfe8"/>` + PX.t(x + (w - 4) / 2, 45, d, 26); x += w; });
    g += PX.t((10 + fx - 12) / 2, 82, 'целые', 11, '#475569') + PX.t((fx + x - 4) / 2, 82, ['', 'десятые', 'сотые', 'тысячные'][fp.length], 11, '#475569'); }
  return PX.svg(x + 10, 90, g, 'place'); }
/* Числовой луч для округления */
function picLine(v, step){ const lo = Math.floor(v / step) * step, hi = lo + step, X = n => 30 + (n - lo) / step * 240; const f = n => String(+n.toFixed(3)).replace('.', ',');
  let g = `<line x1="20" y1="50" x2="280" y2="50" stroke="#334155" stroke-width="3"/>`;
  for (let i = 0; i <= 10; i++) { const n = lo + step * i / 10; g += `<line x1="${X(n)}" x2="${X(n)}" y1="${i % 5 ? 44 : 38}" y2="${i % 5 ? 56 : 62}" stroke="#334155"/>`; }
  g += PX.t(X(lo), 82, f(lo), 14) + PX.t(X(hi), 82, f(hi), 14) + `<circle cx="${X(v)}" cy="50" r="7" fill="#e11d48"/>` + PX.t(X(v), 28, f(v), 14, '#e11d48');
  return PX.svg(300, 92, g, 'line'); }

/* Картинки к словам: основа слова → рисунок */
const WORD_PIC = [
  ['яблок','🍎'],['груш','🍐'],['апельсин','🍊'],['банан','🍌'],['вишн','🍒'],['клубник','🍓'],['арбуз','🍉'],['морков','🥕'],['гриб','🍄'],['орех','🌰'],['конфет','🍬'],['торт','🎂'],['пирож','🥧'],['хлеб','🍞'],['молок','🥛'],['сыр','🧀'],['мёд','🍯'],['каш','🥣'],
  ['кош','🐱'],['кот','🐱'],['собак','🐶'],['пёс','🐕'],['щен','🐶'],['лис','🦊'],['волк','🐺'],['медвед','🐻'],['заяц','🐰'],['зайц','🐰'],['ёж','🦔'],['бел','🐿️'],['слон','🐘'],['жираф','🦒'],['лев','🦁'],['льв','🦁'],['тигр','🐯'],['обезьян','🐒'],['зебр','🦓'],['крокодил','🐊'],['черепах','🐢'],['лягушк','🐸'],['змея','🐍'],['змеи','🐍'],['утк','🦆'],['утят','🦆'],['гус','🪿'],['куриц','🐔'],['цыпл','🐥'],['петух','🐓'],['ворон','🐦‍⬛'],['сов','🦉'],['птиц','🐦'],['воробь','🐦'],['лошад','🐴'],['кон','🐴'],['коров','🐄'],['свин','🐷'],['овц','🐑'],['коз','🐐'],['мыш','🐭'],['рыб','🐟'],['кит','🐳'],['дельфин','🐬'],['акул','🦈'],['пингвин','🐧'],['бабочк','🦋'],['пчёл','🐝'],['пчел','🐝'],['муравь','🐜'],['паук','🕷️'],['жук','🪲'],['улитк','🐌'],['дракон','🐉'],['единорог','🦄'],['попуга','🦜'],['верблюд','🐪'],['олен','🦌'],['кенгуру','🦘'],['панд','🐼'],['белый медведь','🐻‍❄️'],
  ['мяч','⚽'],['футбол','⚽'],['гол','🥅'],['ворот','🥅'],['кубок','🏆'],['медал','🏅'],['кукл','🪆'],['робот','🤖'],['машин','🚗'],['автобус','🚌'],['поезд','🚂'],['самолёт','✈️'],['корабл','🚢'],['лодк','⛵'],['велосипед','🚲'],['ракет','🚀'],
  ['звезд','⭐'],['звёзд','⭐'],['солнц','☀️'],['лун','🌙'],['облак','☁️'],['дожд','🌧️'],['снег','❄️'],['снеж','❄️'],['мороз','🥶'],['гроз','⛈️'],['радуг','🌈'],['ветер','🌬️'],['ветр','🌬️'],['речк','🏞️'],['рек','🏞️'],['мор','🌊'],['озер','🏞️'],['гор','⛰️'],['вулкан','🌋'],['лес','🌲'],['дерево','🌳'],['деревья','🌳'],['деревьев','🌳'],['сад','🌳'],['цветок','🌸'],['цветы','🌸'],['цветов','🌸'],['роз','🌹'],['ромашк','🌼'],['трав','🌿'],['лист','🍂'],['ёлк','🎄'],['берёз','🌳'],['дуб','🌳'],['поле','🌾'],['остров','🏝️'],['пустын','🏜️'],['земл','🌍'],['планет','🪐'],['огон','🔥'],['вод','💧'],['лёд','🧊'],['льд','🧊'],
  ['дом','🏠'],['школ','🏫'],['замок','🏰'],['замк','🏰'],['город','🏙️'],['мост','🌉'],['окн','🪟'],['двер','🚪'],['ключ','🔑'],['часы','⏰'],['час','⏰'],['книг','📚'],['тетрад','📓'],['карандаш','✏️'],['ручк','🖊️'],['портфел','🎒'],['письм','✉️'],['телефон','📱'],['компьютер','💻'],['лампа','💡'],['фонар','🏮'],['подарок','🎁'],['шар','🎈'],['шапк','🧢'],['пальто','🧥'],['платье','👗'],['сапог','👢'],['очки','👓'],['очков','👓'],['корон','👑'],['меч','🗡️'],['щит','🛡️'],['палочк','🪄'],['метл','🧹'],['зель','🧪'],['котел','🧪'],['котл','🧪'],['мантия','🧙'],['волшеб','🪄'],['маг','🧙'],['колдун','🧙'],['ведьм','🧙‍♀️'],['принцесс','👸'],['корол','🤴'],['рыцар','🛡️'],['пират','🏴‍☠️'],['сокровищ','💎'],['монет','🪙'],['деньг','💶'],['евро','💶'],['карт','🗺️'],['компас','🧭'],['лупа','🔎'],['лупу','🔎'],['сыщик','🕵️'],['трубк','🪈'],['скрипк','🎻'],['барабан','🥁'],['музык','🎵'],['песн','🎶'],['цирк','🎪'],['театр','🎭'],['врач','🧑‍⚕️'],['доктор','🧑‍⚕️'],['повар','🧑‍🍳'],['учител','🧑‍🏫'],['мам','👩'],['пап','👨'],['бабушк','👵'],['дедушк','👴'],['девочк','👧'],['мальчик','👦'],['друз','🧑‍🤝‍🧑'],['друз','🧑‍🤝‍🧑'],['дружб','🧑‍🤝‍🧑'],['сердц','❤️'],['глаз','👀'],['рук','✋'],['ног','🦶'],['зуб','🦷'],
  ['весн','🌷'],['лето','🏖️'],['летн','🏖️'],['осен','🍁'],['зим','⛄'],['утр','🌅'],['ночь','🌃'],['ночью','🌃'],['вечер','🌆']
];
const SHORT_END = /^(|а|ы|у|е|ом|ой|и|ов|ам|ами|ах|ик|ок|ка|ки|ку|ей|я|ю|ь|ья|ье|ёк|ята|ят)$/;
function wordPics(text, max){
  const words = text.toLowerCase().split(/[^\p{L}-]+/u).filter(w => w.length >= 3); const out = [];
  for (const w of words) for (const [stem, e] of WORD_PIC) {
    if (!w.startsWith(stem)) continue;
    if (stem.length <= 4 && !SHORT_END.test(w.slice(stem.length))) continue;
    if (!out.includes(e)) out.push(e); break;
  }
  return out.slice(0, max || 3);
}
function picWords(text, cls){ const ps = wordPics(text, 3); return ps.length ? `<div class="wpics ${cls || ''}">${ps.map(e => `<span>${e}</span>`).join('')}</div>` : ''; }

/* Рисунок к заданию по математике: разбираем условие */
/* Ярик (2 класс): треугольник с подписанными сторонами; прямоугольник с неизвестной шириной */
function picTri(a, b, c, unit){ let g = `<polygon points="30,140 210,140 110,30" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>`;
  g += PX.t(120, 162, `${a} ${unit}`, 14) + PX.t(52, 82, `${b} ${unit}`, 14, null, 'middle') + PX.t(190, 82, `${c} ${unit}`, 14, null, 'middle');
  return PX.svg(240, 172, g, 'tri'); }
function picRectQ(a, unit, note){ const w = 150, h = 80, L = 40; let g = `<rect x="${L}" y="24" width="${w}" height="${h}" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>`;
  g += PX.t(L + w / 2, 17, `${a} ${unit}`, 14) + PX.t(L - 6, 24 + h / 2 + 5, '?', 16, null, 'end') + PX.t(L + w / 2, 24 + h / 2 + 6, note, 13, '#16a34a');
  return PX.svg(L + w + 20, h + 44, g, 'rect'); }
/* Особые случаи для Ярика: null — разбирать дальше обычным порядком, '' — без картинки (картинка была бы неверной или подсказала бы ответ) */
function mathPicY(s){ let m;
  const tm = [...s.matchAll(/(\d{1,2}):(\d\d)/g)]; if (tm.length) return tm.length > 1 ? `<div class="pair">${tm.slice(0, 2).map(x => picClock(+x[1], +x[2])).join('<b>→</b>')}</div>` : picClock(+tm[0][1], +tm[0][2]);
  if ((m = s.match(/[Сс]тороны треугольника (\d+)\s*(см|дм|м),\s*(\d+)\s*(?:см|дм|м)\s*и\s*(\d+)/))) return picTri(+m[1], +m[3], +m[4], m[2]);
  if ((m = s.match(/(Периметр|Площадь) (?:прямоугольника )?(\d+)\s*см²?,\s*длина (\d+)\s*(см)/))) return picRectQ(+m[3], m[4], m[1] === 'Периметр' ? `P = ${m[2]} ${m[4]}` : `S = ${m[2]} см²`);
  if (/см²|[Пп]лощадь/.test(s) && !/[Дд]лина[^\d]*\d+[^\d]*ширина[^\d]*\d+|[Сс]торона квадрата/.test(s)) return '';
  if (/идёт \d+ час/.test(s)) return '';
  if (/\d+\s*сот\./.test(s) || /\(ост\./.test(s)) return '';
  if (/^\s*\d+\s*(дм|м)(\s*\d+\s*см)?\s*=\s*\?\s*см/.test(s)) return '';
  if ((m = s.match(/(□|\d+)\s*([+−·-])\s*(□|\d+)\s*=\s*(\d+)/)) && /□/.test(m[1] + m[3])) return picScale(`${m[1]} ${m[2]} ${m[3]}`, m[4]);
  if ((m = s.match(/([\d\s()+−·:-]+)=\s*\?/))) { const ex = m[1], ops = (ex.match(/[+−·:-]/g) || []).length;
    if (ops >= 2) return '';
    if ((m = ex.match(/(\d+)\s*([·:])\s*(\d+)/))) { const a = +m[1], b = +m[3];
      if (m[2] === '·' && (a < 1 || b < 1 || a > 10 || b > 10)) return '';
      if (m[2] === ':' && (a < 1 || b < 1 || a % b || a / b > 10 || b > 10)) return ''; } }
  return null; }
function mathPic(kid, q){
  const s = q.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/ /g, ' ');
  let m;
  if (T(kid) === 'yarik') { const y = mathPicY(s); if (y !== null) return y; }
  if ((m = s.match(/(\d+)\s*ч\s*(\d+)\s*мин/))) return picClock(+m[1], +m[2]);
  if (/(^|[^а-яё])час(ов|а|ы)?([^а-яё]|$)|минут/.test(s) && !/\d+\s*[·:]/.test(s)) return picClock(3, 0);
  if ((m = s.match(/(\d+)\s*%/)) && T(kid) === 'anya') return picPct(+m[1]);
  if ((m = s.match(/(\d+)\s*%/))) return picPct(+m[1]);
  if ((m = s.match(/(\d+)\s+(\d+)\/(\d+)/))) return picPie(+m[1] * +m[3] + +m[2], +m[3]);
  if ((m = s.match(/(\d+)\/(\d+)/))) return picPie(+m[1], +m[2]);
  if ((m = s.match(/частей\D+(\d+)\D+?(\d+)/)) && /раздел/.test(s)) return picPie(+m[2], +m[1]);
  if ((m = s.match(/(\d+)\s*(см|дм|м)\s*[×x]\s*(\d+)\s*\2\s*[×x]\s*(\d+)/))) return picBox(+m[1], +m[3], +m[4], m[2]);
  if ((m = s.match(/(\d+)\s*(см|дм|м)\s*[×x]\s*(\d+)/))) return picRect(+m[1], +m[3], m[2]);
  if ((m = s.match(/[Рр]ебро куба (\d+)\s*(\S+)/))) return picBox(+m[1], +m[1], +m[1], m[2].replace(/\.$/, ''));
  if ((m = s.match(/[Дд]лина[^\d]*(\d+)\s*(см|дм|м)[^\d]*ширина[^\d]*(\d+)/))) return picRect(+m[1], +m[3], m[2]);
  if ((m = s.match(/[Пп]ериметр квадрата\D*(\d+)\s*(см|дм|м)/))) return picRect(+m[1] / 4, +m[1] / 4, m[2], '?');
  if ((m = s.match(/[Сс]торона квадрата\D*(\d+)\s*(см|дм|м)/))) return picRect(+m[1], +m[1], m[2], true);
  if ((m = s.match(/(Прямой|Развёрнутый) угол[^\d]*(\d+)°/))) return picAngle(+m[2], m[1] === 'Прямой' ? 90 : 180);
  if ((m = s.match(/среднее арифметическое:\s*([\d,\s]+)/))) { const v = m[1].split(/,\s*/).map(Number).filter(x => x > 0); if (v.length >= 2 && v.length <= 8) return picBars(v); }
  if ((m = s.match(/Округли (\d+[,.]\d+) до (десятых|сотых|целых)/))) { const v = PX.num(m[1]), st = { 'десятых': .1, 'сотых': .01, 'целых': 1 }[m[2]]; return picLine(v, st); }
  if ((m = s.match(/Сравни:\s*(\d{1,3}(?:[\s\u00a0]\d{3})+)\s*\?\s*(\d{1,3}(?:[\s\u00a0]\d{3})+)/))) return `<div class="stack">${picPlace(m[1])}${picPlace(m[2])}</div>`;
  if ((m = s.match(/(?:числе|Округли)\s*(\d{1,3}(?:[\s\u00a0]\d{3})+)/))) return picPlace(m[1]);
  if ((m = s.match(/(?:в числе|Запиши десятичной дробью:?)\s*(\d+,\d+)/))) return picPlace(m[1]);
  if ((m = s.match(/(\d+,\d+)\s*([+−·:-])\s*(\d+(?:,\d+)?)/)) && T(kid) === 'anya') return `<div class="pair">${picPlace(m[1])}<b>${m[2]}</b>${picPlace(m[3])}</div>`;
  if (T(kid) === 'yarik' && /\d+\s*(дм|см)(?![а-яё])/.test(s)) { const qs = [], re = /(\d+)\s*(м|дм|см)(?![а-яё])(?:\s*(\d+)\s*(дм|см)(?![а-яё]))?/g; let q; const cmv = (n, u) => u === 'м' ? n * 100 : u === 'дм' ? n * 10 : n;
    while ((q = re.exec(s))) qs.push(cmv(+q[1], q[2]) + (q[3] ? cmv(+q[3], q[4]) : 0));
    const v = Math.max(...qs); if (v > 0 && v <= 60) return picRuler(v); }
  if ((m = s.match(/^(.*?)\b(\d*)\s*x\s*([+−-])\s*(\d+)\s*=\s*(\d+)/)) || (m = s.match(/(\d+)\s*([+−-])\s*x\s*=\s*(\d+)/))) {
    const eq = s.match(/[^.:]*x[^.]*=\s*\d+/); if (eq) { const [l, r] = eq[0].split('='); return picScale(l.trim().replace(/^.*?:\s*/, '').replace(/^Реши уравнение\s*/, ''), r.trim()); } }
  if ((m = s.match(/(\d+)\s*x\s*=\s*(\d+)/))) return picScale(m[1] + 'x', m[2]);
  if (T(kid) === 'yarik') {
    if ((m = s.match(/(\d+)\s*([·:])\s*(\d+)\s*=\s*\?/))) { const a = +m[1], b = +m[3]; return m[2] === '·' ? picArray(a, b, '🔵') : picArray(a, b, '🔵', true); }
    if ((m = s.match(/(\d+)\s*·\s*(\d+)/)) && +m[1] <= 10 && +m[2] <= 10) return picArray(+m[1], +m[2], '🔵');
    if ((m = s.match(/(\d+)\s*([+−-])\s*(\d+)\s*=\s*\?/)) && +m[1] <= 100 && +m[3] <= 100) return picTens([+m[1], +m[3]], m[2]);
    if ((m = s.match(/Сравни числа:\s*(\d+)\s*\?\s*(\d+)/))) return picTens([+m[1], +m[2]], '?');
    if ((m = s.match(/в числе (\d+)/)) && +m[1] <= 100) return picTens([+m[1]], '');
    if ((m = s.match(/(\d+)\s*дес\.\s*(\d+)\s*ед/))) return picTens([+m[1] * 10 + +m[2]], '', true);
    if ((m = s.match(/(\d+)\s+[а-яё]+\s+разложили[^\d]+по\s+(\d+)/))) { const e = wordPics(s, 1)[0] || '🔵'; return picArray(+m[1] / +m[2], +m[2], e); }
    const ns = (s.match(/\d+/g) || []).map(Number); const e = wordPics(s, 1)[0];
    if (e && ns.length === 2 && ns[0] <= 20 && ns[1] <= 20 && !/раз|больше|меньше|ног|лап|по \d|поровну|подели|раздели|между|одн(ой|ого|а|у) |кажд|€|цент|кг|десят|\d\s*(г|л|м|см|дм|мин|ч)(?![а-яё])/.test(s)) return `<div class="groups">${ns.slice(0, 2).map(n => `<span class="grp">${e.repeat(n)}</span>`).join('<b>?</b>')}</div>`;
  }
  return '';
}

/* Главная функция: рисунок к заданию */
function illus(kid, subj, t){
  /* Задание «что нарисовано»: картинка задана самим заданием (t.pic — слово из WORD_PIC) */
  if (t.pic) { const ps = wordPics(String(t.pic), 1); return ps.length ? `<div class="illus"><div class="wpics">${ps.map(e => `<span>${e}</span>`).join('')}</div></div>` : ''; }
  const q = (t.q || '').replace(/<[^>]+>/g, ' ');
  if (/[\u{1F300}-\u{1FAFF}]{3,}/u.test(q)) return ''; /* в задании уже есть картинки */
  if (/<svg/.test(t.q || '')) return ''; /* в задании свой рисунок (фигуры, карточки, весы) */
  if (subj === 'math') { const m = mathPic(kid, t.q || ''); if (m) return `<div class="illus">${m}</div>`; }
  const q2 = String(t.a).length <= 3 && /_/.test(q) ? q.replace(/_+/, t.a) : q;
  /* Картинка не должна подсказывать ответ: убираем рисунки, которые совпадают с рисунком ответа или вариантов */
  const ban = wordPics([t.a].concat(t.opts || t.w || []).map(String).join(' '), 12);
  const ps = wordPics(q2, 6).filter(e => !ban.includes(e)).slice(0, 3);
  return ps.length ? `<div class="illus"><div class="wpics">${ps.map(e => `<span>${e}</span>`).join('')}</div></div>` : '';
}

/* Тематические сцены для шапки карточки задания */
const SCENES = {
  yarik: [
    () => PX.svg(400, 90, `<rect width="400" height="90" fill="#4ade80"/><g stroke="#fff" stroke-width="3" fill="none"><rect x="6" y="6" width="388" height="78"/><line x1="200" y1="6" x2="200" y2="84"/><circle cx="200" cy="45" r="18"/><rect x="6" y="25" width="30" height="40"/><rect x="364" y="25" width="30" height="40"/></g><text x="250" y="60" font-size="30">⚽</text><text x="80" y="58" font-size="30">🏃</text><text x="340" y="56" font-size="26">🧤</text>`, 'scene'),
    () => PX.svg(400, 90, `<rect width="400" height="90" fill="#fde68a"/><circle cx="350" cy="22" r="14" fill="#fb923c"/><path d="M0,70 Q100,50 200,70 T400,66 V90 H0Z" fill="#a3e635"/><text x="30" y="72" font-size="34">🦒</text><text x="110" y="76" font-size="30">🐘</text><text x="190" y="76" font-size="28">🦓</text><text x="260" y="78" font-size="26">🦁</text><text x="320" y="78" font-size="22">🌴</text>`, 'scene'),
    () => PX.svg(400, 90, `<rect width="400" height="90" fill="#1e293b"/><g fill="#38bdf8"><rect x="20" y="60" width="40" height="10"/><rect x="90" y="45" width="40" height="10"/><rect x="170" y="30" width="40" height="10"/><rect x="260" y="50" width="40" height="10"/></g><text x="95" y="42" font-size="24">🐱</text><text x="175" y="27" font-size="20">⭐</text><text x="265" y="47" font-size="20">🪙</text><text x="330" y="70" font-size="30">🎮</text><text x="22" y="56" font-size="22">👾</text>`, 'scene'),
    () => PX.svg(400, 90, `<rect width="400" height="90" fill="#7dd3fc"/><path d="M0,60 Q50,50 100,60 T200,60 T300,60 T400,60 V90 H0Z" fill="#0284c7"/><text x="40" y="80" font-size="30">🐬</text><text x="150" y="84" font-size="26">🐢</text><text x="250" y="82" font-size="28">🐠</text><text x="320" y="50" font-size="26">⛵</text><text x="80" y="30" font-size="20">☁️</text>`, 'scene')
  ],
  anya: [
    () => PX.svg(400, 90, `<rect width="400" height="90" fill="#1e1b4b"/><circle cx="350" cy="24" r="14" fill="#fef3c7"/><g fill="#312e81"><rect x="60" y="40" width="120" height="50"/><rect x="50" y="20" width="22" height="70"/><rect x="170" y="10" width="22" height="80"/><polygon points="50,20 61,2 72,20"/><polygon points="170,10 181,-8 192,10"/><rect x="110" y="28" width="20" height="62"/><polygon points="110,28 120,12 130,28"/></g><g fill="#fde047"><rect x="80" y="55" width="6" height="9"/><rect x="140" y="55" width="6" height="9"/><rect x="176" y="30" width="6" height="9"/></g><text x="250" y="50" font-size="26">🦉</text><text x="300" y="80" font-size="22">✨</text><text x="20" y="30" font-size="14">⭐</text><text x="230" y="20" font-size="12">⭐</text>`, 'scene'),
    () => PX.svg(400, 90, `<rect width="400" height="90" fill="#422006"/><g fill="#78350f"><rect x="0" y="60" width="400" height="30"/></g><text x="40" y="58" font-size="34">📚</text><text x="120" y="60" font-size="30">🧪</text><text x="190" y="58" font-size="30">🕯️</text><text x="260" y="60" font-size="30">🔮</text><text x="330" y="58" font-size="30">🪄</text>`, 'scene'),
    () => PX.svg(400, 90, `<rect width="400" height="90" fill="#0f766e"/><path d="M0,90 L60,40 L120,90Z M90,90 L170,25 L250,90Z M220,90 L300,45 L380,90Z" fill="#134e4a"/><text x="160" y="40" font-size="26">🧹</text><text x="40" y="30" font-size="18">⭐</text><text x="300" y="34" font-size="24">🐉</text><text x="350" y="20" font-size="14">✨</text>`, 'scene'),
    () => PX.svg(400, 90, `<rect width="400" height="90" fill="#831843"/><g stroke="#fbcfe8" stroke-width="2"><line x1="0" y1="70" x2="400" y2="70"/></g><text x="30" y="62" font-size="30">🦄</text><text x="110" y="62" font-size="28">🌙</text><text x="180" y="62" font-size="28">🧙‍♀️</text><text x="250" y="62" font-size="28">🐈‍⬛</text><text x="320" y="62" font-size="28">🏰</text>`, 'scene')
  ]
};
function scene(kid, seed){ const S0 = (!FAM && typeof LOOK_SCENES !== 'undefined' && LOOK_SCENES[lookId(kid)]) || (!FAM && lookId(kid) === 'magic' && SCENES.anya) || (!FAM && lookId(kid) === 'foot' && SCENES.yarik) || SCENES[T(kid)] || SCENES.yarik; return S0[Math.abs(seed | 0) % S0.length](); }

/* Обложки книг */
const COVERS = {
  'Пёстрая лента': () => PX.svg(400, 170, `<rect width="400" height="170" fill="#1f2937"/><rect y="120" width="400" height="50" fill="#374151"/><g fill="#111827"><rect x="20" y="40" width="70" height="80"/><rect x="100" y="20" width="60" height="100"/><rect x="300" y="30" width="80" height="90"/></g><g fill="#fbbf24"><rect x="35" y="55" width="10" height="14"/><rect x="115" y="40" width="10" height="14"/><rect x="320" y="50" width="10" height="14"/></g><rect x="215" y="40" width="5" height="80" fill="#4b5563"/><circle cx="217" cy="38" r="10" fill="#fde68a" opacity=".9"/><text x="180" y="150" font-size="46">🕵️</text><text x="250" y="150" font-size="34">🔎</text><text x="60" y="160" font-size="30">🐍</text><path d="M0,100 Q100,90 200,105 T400,95" stroke="#9ca3af" stroke-width="10" opacity=".25" fill="none"/>`, 'cover'),
  'Серая Шейка': () => PX.svg(400, 170, `<rect width="400" height="170" fill="#e0f2fe"/><path d="M0,110 H400 V170 H0Z" fill="#f8fafc"/><ellipse cx="200" cy="120" rx="110" ry="22" fill="#38bdf8"/><g fill="#166534"><polygon points="40,110 60,40 80,110"/><polygon points="330,110 350,30 370,110"/></g><text x="185" y="128" font-size="34">🦆</text><text x="300" y="150" font-size="34">🦊</text><text x="80" y="40" font-size="16">❄️</text><text x="250" y="30" font-size="18">❄️</text><text x="150" y="60" font-size="14">❄️</text>`, 'cover'),
  'Лягушка-путешественница': () => PX.svg(400, 170, `<rect width="400" height="170" fill="#bae6fd"/><path d="M0,140 Q100,120 200,140 T400,135 V170 H0Z" fill="#86efac"/><line x1="120" y1="70" x2="280" y2="70" stroke="#92400e" stroke-width="5"/><text x="90" y="82" font-size="34">🦆</text><text x="270" y="82" font-size="34">🦆</text><text x="183" y="98" font-size="30">🐸</text><text x="40" y="40" font-size="24">☁️</text><text x="320" y="36" font-size="26">☀️</text>`, 'cover'),
  'Каштанка': () => PX.svg(400, 170, `<rect width="400" height="170" fill="#7f1d1d"/><polygon points="200,10 60,90 340,90" fill="#dc2626"/><g fill="#fef2f2"><polygon points="200,10 100,90 130,90"/><polygon points="200,10 170,90 200,90"/><polygon points="200,10 240,90 270,90"/></g><rect x="60" y="90" width="280" height="60" fill="#b91c1c"/><rect x="170" y="100" width="60" height="50" fill="#450a0a"/><text x="70" y="150" font-size="34">🐕</text><text x="280" y="148" font-size="30">🐈</text><text x="240" y="150" font-size="26">🪿</text><text x="300" y="60" font-size="22">🎪</text>`, 'cover'),
  'Слон': () => PX.svg(400, 170, `<rect width="400" height="170" fill="#fef3c7"/><rect x="0" y="130" width="400" height="40" fill="#d6d3d1"/><rect x="40" y="40" width="80" height="90" fill="#e7e5e4"/><rect x="290" y="30" width="80" height="100" fill="#e7e5e4"/><g fill="#93c5fd"><rect x="55" y="55" width="18" height="18"/><rect x="85" y="55" width="18" height="18"/><rect x="305" y="45" width="18" height="18"/><rect x="335" y="45" width="18" height="18"/></g><text x="140" y="140" font-size="70">🐘</text><text x="240" y="140" font-size="34">👧</text>`, 'cover'),
  'Волшебник страны Оз': () => PX.svg(400, 170, `<rect width="400" height="170" fill="#bbf7d0"/><path d="M160,170 L200,70 L240,170Z" fill="#facc15"/><g stroke="#ca8a04" stroke-width="1"><line x1="170" y1="150" x2="230" y2="150"/><line x1="178" y1="130" x2="222" y2="130"/><line x1="186" y1="110" x2="214" y2="110"/></g><g fill="#16a34a"><rect x="180" y="30" width="12" height="40"/><rect x="198" y="18" width="12" height="52"/><rect x="216" y="36" width="12" height="34"/></g><text x="60" y="140" font-size="34">👧</text><text x="100" y="140" font-size="28">🐕</text><text x="280" y="140" font-size="32">🦁</text><text x="320" y="140" font-size="30">🤖</text><text x="30" y="40" font-size="30">🌪️</text>`, 'cover'),
  'Всадник без головы': () => PX.svg(400, 170, `<rect width="400" height="170" fill="#fdba74"/><circle cx="320" cy="60" r="30" fill="#fef08a"/><path d="M0,120 Q100,105 200,118 T400,112 V170 H0Z" fill="#a16207"/><g fill="#166534"><rect x="40" y="80" width="10" height="40"/><rect x="30" y="92" width="8" height="5"/><rect x="50" y="88" width="8" height="5"/><rect x="350" y="85" width="9" height="35"/></g><text x="150" y="125" font-size="52">🏇</text><text x="240" y="128" font-size="34">🐎</text><text x="90" y="150" font-size="22">🌵</text><text x="300" y="155" font-size="22">🤠</text>`, 'cover')
};
function cover(t){ const s = (t.book || '') + ' ' + (t.title || ''); let k = Object.keys(COVERS).concat(Object.keys(COVER_IMG)).find(k => s.includes(k));
  if (!k && /Холмс/.test(s)) k = 'Пёстрая лента'; if (!k && /(^|\s)Оз(\s|\.|$)|Изумруд/.test(s)) k = 'Волшебник страны Оз';
  if (!k) return ''; const f = COVER_IMG[k];
  return f ? `<div class="coverwrap photo" style="background-image:url(img/${f})"><img src="img/${f}" alt="" loading="lazy" onerror="COVERS['${k}'] ? this.parentNode.innerHTML=COVERS['${k}']() : this.parentNode.remove()"></div>` : `<div class="coverwrap">${COVERS[k]()}</div>`; }
/* Обложки, нарисованные ChatGPT (webp). Если файла нет — рисуем SVG. */
const COVER_IMG = { 'Пёстрая лента':'cover-holmes.webp', 'Серая Шейка':'cover-sheyka.webp', 'Лягушка-путешественница':'cover-lyagushka.webp', 'Каштанка':'cover-kashtanka.webp', 'Слон':'cover-slon.webp', 'Волшебник страны Оз':'cover-oz.webp', 'Всадник без головы':'cover-reid.webp',
  'Ночь перед Рождеством':'cover-noch.webp', 'Аленький цветочек':'cover-cvetok.webp', 'Сказка о царе Салтане':'cover-saltan.webp', 'Муму':'cover-mumu.webp',
  'Кавказский пленник':'cover-plennik.webp', 'Дети подземелья':'cover-podzem.webp', 'Белый пудель':'cover-pudel.webp', 'Чёрная курица':'cover-kurica.webp',
  'Городок в табакерке':'cover-tabakerka.webp', 'Мороз Иванович':'cover-moroz.webp', 'Алёнушкины сказки':'cover-alenushka.webp', 'Сказка о рыбаке и рыбке':'cover-rybka.webp',
  'Сказка о мёртвой царевне':'cover-carevna.webp', 'Филипок':'cover-filipok.webp' };
