/* ===== Темы оформления на выбор (21.11.2026) =====
   Родитель в «Для родителей» → «Настройки» выбирает каждому ребёнку тему. Любую тему может выбрать любой ребёнок.
   Темы: футбол, супергерои, кубический мир, волшебная школа, принцессы, кукольный мир.
   Все рисунки свои, без чужих персонажей, логотипов и названий. ES5 для старого Safari. */

var ALWAYS = window.ALWAYS || (window.ALWAYS = []);
/* --- новые иконки (сетка 32, стиль как в icons.js) --- */
(function(){ var I = {
  /* супергерои */
  hmask: '<path class="a" d="M3.5 12.5c3.5-3 8.5-3 12.5-.5 4-2.5 9-2.5 12.5.5 0 5.5-3 8.5-6.5 8.5-3 0-4.4-2-6-3.2-1.6 1.2-3 3.2-6 3.2-3.5 0-6.5-3-6.5-8.5z"/><path class="w" d="M7 14.6c1.3-1.4 3.7-1.6 5.2-.3-.7 1.6-3.6 2-5.2.3zM25 14.6c-1.3-1.4-3.7-1.6-5.2-.3.7 1.6 3.6 2 5.2.3z"/>',
  hcape: '<path class="a" d="M10 6h12l1.5 3L28 27c-4 1.6-8 0-12 0s-8 1.6-12 0L8.5 9z"/><path class="b" d="M9.5 6.5c2.5 3 10.5 3 13 0"/><path d="M13 12l-2 13M19 12l2 13"/>',
  bolt: '<path class="b" d="M18.5 3L6.5 18h8.5L12.5 29 25.5 13.5H17L18.5 3z"/>',
  hshield: '<path class="a" d="M16 3.5l11 4V15c0 7-5 11.6-11 13.5C10 26.6 5 22 5 15V7.5z"/><path class="w" d="M16 9.5l2 4.2 4.5.6-3.3 3.1.8 4.5-4-2.2-4 2.2.8-4.5-3.3-3.1 4.5-.6z" stroke-width="1.6"/>',
  city: '<path class="a" d="M3.5 28V15h7v13M11 28V7h9v21M20.5 28V11h8v17"/><path class="b" stroke="none" d="M14 10h2v2.5h-2zM17 10h2v2.5h-2zM14 15h2v2.5h-2zM17 20h2v2.5h-2zM23 14h2v2.5h-2zM23 19h2v2.5h-2zM6 18h2v2.5H6z"/><path d="M2 28h28"/>',
  burst: '<path class="b" d="M16 2.5l2.6 6.4 6.5-3-1.8 6.8 6.4 2.6-6 3.8 3.5 6.1-7-.6-.9 7-4.3-5.6-5.2 4.7.6-7-6.9-.6L7.6 17 2.5 12.4l6.8-1L8.5 4.5l6 3.6z"/><circle class="w" cx="16" cy="16" r="5"/>',
  /* кубический мир — объёмные игрушечные кубики (рисуются ниже через isoC) */
  /* принцессы */
  tiara: '<path class="b" d="M4 23l2.5-11 5 6L16 7l4.5 11 5-6L28 23z"/><path class="a" d="M4 23h24v4H4z"/><circle class="w" cx="16" cy="7" r="2"/><circle class="w" cx="6.5" cy="12" r="1.6"/><circle class="w" cx="25.5" cy="12" r="1.6"/><circle class="w" cx="16" cy="17.5" r="2"/>',
  slipper: '<path class="a" d="M3.5 22c4.5 0 8-1.5 11-5 2.4-2.8 5-4.5 8.5-4.5 3.2 0 5 2 5 4.5V19H17c-3.5 0-6 3-9 3.8H4.5c-1.5 0-2-.8-1-.8z"/><path class="b" d="M24.5 19h3l-1 9h-1.5z"/><path class="w" stroke="none" d="M19 15.3c1.3-.8 2.7-1 4-.8-1.4.6-2.7 1.3-3.6 2.2z"/><path d="M9 6v4M7 8h4M24 5v3M22.5 6.5h3"/>',
  carriage: '<path class="a" d="M5 19.5a11 10 0 0 1 22 0V22H5z"/><path class="w" d="M12 18v-4a4 4 0 0 1 8 0v4z"/><path class="b" d="M14 9l2-4 2 4z"/><circle class="w" cx="9.5" cy="25.5" r="3.5"/><circle class="w" cx="22.5" cy="25.5" r="3.5"/><path d="M16 9.5V8"/>',
  rose: '<path d="M16 18v11"/><path class="b" d="M16 24c-3-.3-6-2.4-6.5-5.5 3 .2 5.6 2 6.5 5.5zM16 26c2-3 5-4.5 7.5-4-.8 3-4 4.6-7.5 4z"/><path class="a" d="M16 4c5 0 8.5 3 8.5 7.5S20.8 19 16 19s-8.5-3-8.5-7.5S11 4 16 4z"/><path d="M16 8.5c2.5 0 3.5 2 2.5 3.6-1 1.6-4 1.4-4.6-.4-.6-1.7.7-3 2.1-3.2M12 7.5c-.5 2.5 0 6 4 8"/>',
  mirror: '<ellipse class="b" cx="16" cy="12.5" rx="8.5" ry="10"/><ellipse class="a" cx="16" cy="12.5" rx="5.5" ry="7"/><path class="w" stroke="none" d="M13.2 9.5c.5-2 1.8-3 3.3-3.2-1.2 1-2 2.3-2.2 4z"/><path d="M16 22.5V27M11 28.5h10"/>',
  pcastle: '<path class="a" d="M6 14.5h5V28H6zM21 14.5h5V28h-5zM11 18.5h10V28H11z"/><path class="b" d="M5 14.5L8.5 6l3.5 8.5zM20 14.5L23.5 6l3.5 8.5zM12.5 18.5L16 10.5l3.5 8z"/><path class="w" d="M14 28v-3.5a2 2 0 0 1 4 0V28z"/><path d="M8.5 6V3.5l2 1-2 1M23.5 6V3.5l2 1-2 1"/><path d="M3 28h26"/>',
  /* кукольный мир */
  heart: '<path class="a" d="M16 27.5S4 20.5 4 12.3A6 6 0 0 1 16 9.8a6 6 0 0 1 12 2.5c0 8.2-12 15.2-12 15.2z"/><path class="w" stroke="none" d="M8.5 11.5c.4-1.8 2-2.8 3.6-2.6-1.4.6-2.4 1.6-2.8 3z"/>',
  bow: '<path class="a" d="M16 16c-4-5-11.5-7.5-11.5-2.2v4.4c0 5.3 7.5 2.8 11.5-2.2zM16 16c4-5 11.5-7.5 11.5-2.2v4.4c0 5.3-7.5 2.8-11.5-2.2z"/><path class="a" d="M14 18.5l-3.5 9 3-1.5 1.5 2 1-9.5M18 18.5l3.5 9-3-1.5-1.5 2-1-9.5"/><circle class="b" cx="16" cy="16" r="3"/>',
  dress: '<path class="a" d="M12.5 3.5h7l-.8 6 2.3 3.3-2 3.2L26 28H6l7-12-2-3.2 2.3-3.3z"/><path class="b" d="M12 16h8l.6 1.8H11.4z"/><path d="M11 22c3 1.2 7 1.2 10 0" opacity=".5"/>',
  heel: '<path class="a" d="M3 20.5c5 0 9-3 12-7 1.8-2.4 4-3.5 7-3.5 4 0 6 3 6 6v3.5H15.5c-2.5 0-4.5 1.2-6.5 3H5c-1.2 0-2-.8-2-2z"/><path class="b" d="M24 19.5h3.5L26 28.5h-1.6z"/><path class="w" stroke="none" d="M18.5 12.5c1.2-.8 2.6-1.1 4-1-1.5.7-2.7 1.5-3.4 2.6z"/>',
  handbag: '<path class="a" d="M5.5 13h21l-2 15h-17z"/><path d="M11 13V10a5 5 0 0 1 10 0v3"/><path class="b" d="M5.5 13h21l-.5 4h-20z"/><circle class="w" cx="16" cy="17" r="2"/>',
  hglasses: '<path class="a" d="M10 22s-6-3.5-6-7.5a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 7.5-6 7.5zM22 22s-6-3.5-6-7.5a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 7.5-6 7.5z"/><path d="M4 13.5L2.5 10M28 13.5l1.5-3.5"/><path class="w" stroke="none" d="M7 14c.3-.8 1-1.3 1.8-1.3-.5.4-.9.9-1 1.6zM19 14c.3-.8 1-1.3 1.8-1.3-.5.4-.9.9-1 1.6z"/>'
}; for (var k in I) ICONS[k] = I[k]; })();

/* изометрический кубик: верх .a, левая грань .b, правая .w */
function isoC(cx, t, r){ var h = r / 2; return '<path class="b" d="M' + (cx - r) + ' ' + (t + h) + 'L' + cx + ' ' + (t + r) + 'V' + (t + 2 * r) + 'L' + (cx - r) + ' ' + (t + 1.5 * r) + 'z"/><path class="w" d="M' + cx + ' ' + (t + r) + 'L' + (cx + r) + ' ' + (t + h) + 'V' + (t + 1.5 * r) + 'L' + cx + ' ' + (t + 2 * r) + 'z"/><path class="a" d="M' + cx + ' ' + t + 'L' + (cx + r) + ' ' + (t + h) + 'L' + cx + ' ' + (t + r) + 'L' + (cx - r) + ' ' + (t + h) + 'z"/>'; }
(function(){ var I = {
  cubes: isoC(9.5, 13, 6.5) + isoC(22.5, 13, 6.5) + isoC(16, 3.5, 6.5),
  vtree: '<g style="--ia:#C98B55;--ib:#9A6236;--iw:#7A4A26">' + isoC(16, 19, 4) + '</g>' + isoC(16, 2, 9.5),
  vhouse: isoC(16, 10, 10) + '<path class="l" d="M18.5 27.5v-5.2l3.5-1.8v5.2z"/><path class="l" d="M9 19l2.8 1.4v2.8L9 21.8z"/>',
  vcrystal: '<path class="a" d="M16 2.5l7 6v14l-7 7-7-7v-14z"/><path class="w" d="M16 2.5v27l7-7v-14z"/><path d="M9 8.5l7 4 7-4M16 12.5v17"/>',
  vgear: '<path class="a" d="M14 3h4l.7 3.3 2.6 1.1 2.8-1.9 2.8 2.8-1.9 2.8 1.1 2.6L29 14v4l-3.3.7-1.1 2.6 1.9 2.8-2.8 2.8-2.8-1.9-2.6 1.1L18 29h-4l-.7-3.3-2.6-1.1-2.8 1.9-2.8-2.8 1.9-2.8-1.1-2.6L3 18v-4l3.3-.7 1.1-2.6-1.9-2.8 2.8-2.8 2.8 1.9 2.6-1.1z"/><circle class="w" cx="16" cy="16" r="4.5"/>',
  vrocket: '<path class="w" d="M12 10h8v14h-8z"/><path class="a" d="M12 10l4-7 4 7z"/><path class="b" d="M12 18l-5 5v4l5-3zM20 18l5 5v4l-5-3z"/><path class="b" d="M14 24h4l-2 5z"/><circle class="l" cx="16" cy="14.5" r="2"/>'
}; for (var k in I) ICONS[k] = I[k]; })();
function lic(n){ return icon(n); }
/* рисунок-иконка внутри SVG-сцены */
function lsi(n, x, y, s){ return '<g transform="translate(' + x + ',' + y + ') scale(' + (s / 32) + ')"><g class="ics ic-' + n + '">' + (ICONS[n] || '') + '</g></g>'; }

/* --- темы --- */
var LOOKS = {
  foot:  { n: 'Футбол', d: 'Стадион, мяч и своя команда', base: 'yarik', art: 'y', bi: ['ball', 'boot', 'goal', 'trophy'], sw: ['#22c55e', '#15803d', '#f97316'] },
  hero:  { n: 'Супергерои', d: 'Ночной город, плащ и своя суперсила', base: 'yarik', art: 'hero', bi: ['hmask', 'bolt', 'hshield', 'hcape'], sw: ['#E23B3B', '#1E3A8A', '#FFD23F'] },
  cube:  { n: 'Кубический мир', d: 'Мир из ярких кубиков и свой герой', base: 'yarik', art: 'cube', bi: ['cubes', 'vtree', 'vcrystal', 'vrocket'], sw: ['#FFB04A', '#1FB5A8', '#8B5CF6'] },
  magic: { n: 'Волшебная школа', d: 'Замок, свечи и свой факультет', base: 'anya', art: 'a', bi: ['owl', 'wand', 'potion', 'candle'], sw: ['#1e1250', '#7452B8', '#E2B04A'] },
  prin:  { n: 'Принцессы', d: 'Сказочный замок и своё королевство', base: 'anya', art: 'prin', bi: ['tiara', 'pcastle', 'slipper', 'rose'], sw: ['#F4B6CF', '#A8457F', '#E3B65B'] },
  doll:  { n: 'Кукольный мир', d: 'Розовый домик у моря, наряды и свой образ', base: 'yarik', art: 'doll', bi: ['heart', 'dress', 'heel', 'bow'], sw: ['#FF8CC6', '#3CCFC0', '#FFFFFF'] }
};
var LOOK_ORDER = ['foot', 'hero', 'cube', 'magic', 'prin', 'doll'];
var LOOK_THEME = {
  hero: { banner: ['hmask', 'bolt', 'hshield', 'city', 'hcape', 'burst', 'star', 'bolt'], pics: ['hmask', 'bolt', 'hshield', 'hcape', 'city', 'burst', 'star', 'medal'],
    win: ['Суперсила сработала!', 'Город спасён!', 'Геройский ответ!', 'Бах! В точку!', 'Настоящий герой!'], hello: 'Город ждёт своего героя!', world: 'Лига героев знаний' },
  cube: { banner: ['cubes', 'vtree', 'vcrystal', 'vhouse', 'vgear', 'vrocket', 'star', 'cubes'], pics: ['cubes', 'vtree', 'vcrystal', 'vhouse', 'vgear', 'vrocket'],
    win: ['Кубик на месте!', 'Башня растёт!', 'Уровень пройден!', 'Ровно и крепко!', 'Найден кристалл!'], hello: 'Строим знания кубик за кубиком!', world: 'Кубический мир' },
  prin: { banner: ['tiara', 'pcastle', 'slipper', 'rose', 'carriage', 'mirror', 'crown', 'sparkle'], pics: ['tiara', 'pcastle', 'slipper', 'rose', 'carriage', 'mirror', 'crown'],
    win: ['Королевский ответ!', 'Бал в твою честь!', 'Волшебно верно!', 'Корона сияет!', 'Достойно королевства!'], hello: 'Добро пожаловать в сказочное королевство!', world: 'Сказочное королевство' },
  doll: { banner: ['heart', 'dress', 'heel', 'bow', 'handbag', 'hglasses', 'mirror', 'sparkle'], pics: ['heart', 'dress', 'heel', 'bow', 'handbag', 'hglasses', 'mirror'],
    win: ['Блестяще!', 'Идеальный образ!', 'Ты сияешь!', 'Супер-стиль!', 'Розово-верно!'], hello: 'Сегодня ты звезда!', world: 'Кукольный мир' }
};

function lookOn(){ return !FAM; }
function lookId(kid){ if (!lookOn() || !kid || !S || !S.kids || !S.kids[kid]) return ''; var v = S.kids[kid].look; return LOOKS[v] ? v : (T(kid) === 'anya' ? 'magic' : 'foot'); }
function lookSex(kid){ return kid === 'anya' ? 'f' : 'm'; }
function lookG(kid, m, f){ return lookSex(kid) === 'f' ? f : m; }
function lookO(kid){ var K = S.kids[kid], id = lookId(kid); if (!K.lks) K.lks = {}; return K.lks[id] || null; }

/* Тема ребёнка для THEME[...] — с учётом его выбора в интерактиве */
function lookTheme(kid){ var id = lookId(kid), base, key = 'p:' + kid;
  if (id === 'foot') base = { banner: ['ball', 'boot', 'goal', 'whistle', 'trophy', 'medal', 'flag', 'ball'].map(lic), pics: THEME.yarik.pics, win: THEME.yarik.win, hello: THEME.yarik.hello, world: THEME.yarik.world }; else if (id === 'magic') base = typeof HP_BASE !== 'undefined' ? HP_BASE : THEME.anya;
  else { var L = LOOK_THEME[id]; base = { banner: L.banner.map(lic), pics: L.pics.map(lic), win: L.win, hello: L.hello, world: L.world }; }
  var t = { banner: base.banner, pics: base.pics, win: base.win.slice(), hello: base.hello, world: base.world };
  if (id === 'magic') { t.hello = lookG(kid, 'Добро пожаловать в Школу волшебства, юный волшебник!', base.hello);
    var hs = typeof hpHouse === 'function' && HOUSES[hpHouse(kid)]; if (hs) { t.hello = typeof hpG === 'function' ? hpG(kid, hs.hello) : hs.hello; t.win = hs.win.map(function(s){ return typeof hpG === 'function' ? hpG(kid, s) : s; }); } }
  var B = LOOK_B[id], o = lookO(kid); if (B && o && B.done(o)) { var p = B.apply(kid, o); if (p.hello) t.hello = p.hello; if (p.win) t.win = p.win.concat(t.win.slice(0, 2)); }
  THEME[key] = t; return key; }

/* Класс и цвета для body */
function lookBody(kid){ var id = lookId(kid); return id ? ' th-' + id : ''; }
function lookVars(kid){ var st = document.body.style, names = ['--acc', '--b1', '--b2', '--b3', '--bt'];
  for (var i = 0; i < names.length; i++) st.removeProperty(names[i]);
  if (!kid || !lookOn()) return; var id = lookId(kid), B = LOOK_B[id], o = lookO(kid); if (!B || !o || !B.done(o)) return; var p = B.apply(kid, o).v || {};
  for (var k in p) st.setProperty(k, p[k]); }

/* ===== Интерактивы: «Моя команда», «Мой герой», «Персонаж из блоков», «Моё королевство», «Мой образ» ===== */
var KITS = { rw: ['Красно-белые', '#D7263D', '#FFFFFF'], bw: ['Сине-белые', '#1F4E9E', '#FFFFFF'], gy: ['Зелёно-жёлтые', '#178A47', '#F7C531'], by: ['Чёрно-жёлтые', '#1E1E24', '#F7C531'], ob: ['Оранжево-синие', '#F26B1D', '#1F3E7A'], sk: ['Небесно-синие', '#5AAFE8', '#0E2A4D'] };
var POSS = { gk: ['Вратарь', 'Последняя надежда команды: реакция и смелость', 'вратарь'], df: ['Защитник', 'Надёжная стена: никто не пройдёт', 'защитник'], mf: ['Полузащитник', 'Мозг команды: видит всё поле', 'полузащитник'], fw: ['Нападающий', 'Забивает голы и не боится ошибиться', 'нападающий'] };
var HPOW = { spd: ['Скорость', 'bolt', 'быстрее ветра', ['Вихрь', 'Молния', 'Стриж']], str: ['Сила', 'burst', 'сильнее всех', ['Титан', 'Громобой', 'Утёс']], fly: ['Полёт', 'hcape', 'летает над городом', ['Сокол', 'Небесный', 'Ветер']],
  inv: ['Невидимость', 'hmask', 'исчезает в одно мгновение', ['Тень', 'Призрак', 'Туман']], shd: ['Защита', 'hshield', 'защищает всех вокруг', ['Страж', 'Бастион', 'Щит']], mnd: ['Ум', 'brain', 'решает любую задачу', ['Гений', 'Профессор', 'Разум']] };
var HCOL = { rb: ['Красный и синий', '#D7263D', '#1F4E9E'], gp: ['Зелёный и фиолетовый', '#2FA35B', '#5B2A86'], yb: ['Жёлтый и чёрный', '#F7C531', '#1E1E24'], ow: ['Оранжевый и белый', '#F26B1D', '#F3F4F6'], cs: ['Бирюзовый и серебро', '#13A8B8', '#9AA6B2'], pk: ['Розовый и фиолетовый', '#E64C9B', '#4B2A86'] };
var HEMB = { star: 'Звезда', bolt: 'Молния', ring: 'Кольцо', wing: 'Крыло', heart: 'Сердце', eye: 'Глаз' };
var CSKIN = { a: '#F3D3B5', b: '#E0AC7E', c: '#B97A4E', d: '#7A4B2C' }, CHAIR = { d: ['Рыжие', '#C8552B'], b: ['Светлые', '#E9C46A'], c: ['Чёрные', '#24211F'], a: ['Русые', '#7A5230'], e: ['Синие', '#3A7BD5'] };
var CSHIRT = { d: '#F7C531', b: '#5DA130', c: '#D7263D', a: '#2FA3D9', e: '#8E44AD', f: '#ECEFF1' }, CPANT = { c: '#2B2B33', b: '#5B4636', d: '#6B8E23', a: '#33468F' };
var CWORLD = { les: ['Оранжевый остров', '#FFB04A', '#E07A12'], pes: ['Бирюзовый остров', '#3CCFC0', '#13958A'], sneg: ['Лиловый остров', '#B08CF7', '#7349D6'], okean: ['Солнечный остров', '#FFD84D', '#D9A400'], podz: ['Ледяной остров', '#8FD3FF', '#3C9BDB'] };
var KINGS = { flower: ['Цветочное', 'Цветочного', '#E86AA6', '#A8457F', '#FCE4F0'], sea: ['Морское', 'Морского', '#3FA7D6', '#1F5F99', '#E2F3FB'], snow: ['Снежное', 'Снежного', '#9CC9F0', '#4E6FA8', '#F1F6FD'],
  forest: ['Лесное', 'Лесного', '#47A36B', '#23613D', '#E5F4EA'], sun: ['Солнечное', 'Солнечного', '#F2B33D', '#B86E12', '#FEF5E1'], star: ['Звёздное', 'Звёздного', '#8E6BD1', '#4B2A86', '#EFE9FA'] };
var KEMB = { rose: ['Роза', 'rose'], star: ['Звезда', 'star'], moon: ['Луна', 'moon'], heart: ['Сердце', 'heart'], crown: ['Корона', 'crown'], slipper: ['Туфелька', 'slipper'] };
var DHAIR = { a: ['Светлые', '#F2CF73'], b: ['Каштановые', '#7A4A2A'], c: ['Рыжие', '#D2602E'], d: ['Чёрные', '#26211F'], e: ['Розовые', '#F48FC0'] };
var DDRESS = { pink: ['Розовое', '#F06AA8'], lil: ['Сиреневое', '#B48BE0'], mint: ['Мятное', '#6CD4B4'], sky: ['Голубое', '#78BDEB'], gold: ['Золотое', '#F2C14E'], red: ['Красное', '#E2433D'] };
var DSTYLE = { ball: 'Пышное', short: 'Короткое', long: 'Длинное' }, DACC = { bow: ['Бант', 'bow'], tiara: ['Ободок', 'tiara'], glasses: ['Очки-сердечки', 'hglasses'], bag: ['Сумочка', 'handbag'] };

/* рисунки результата */
function jerseySvg(o, sz){ var k = KITS[o.kit] || KITS.rw, n = o.num || 10;
  return '<svg class="lkpic noico" viewBox="0 0 120 120" width="' + (sz || 120) + '" height="' + (sz || 120) + '" aria-hidden="true"><path d="M38 12l-26 14 10 22 12-6v62h52V42l12 6 10-22-26-14c-3 8-11 12-22 12s-19-4-22-12z" fill="' + k[1] + '" stroke="#1B2A44" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M38 12c3 8 11 12 22 12s19-4 22-12" fill="none" stroke="' + k[2] + '" stroke-width="5"/><path d="M12 26l10 22M108 26l-10 22" stroke="' + k[2] + '" stroke-width="5"/>' +
    '<text x="60" y="88" text-anchor="middle" font-family="Rubik,Nunito,sans-serif" font-weight="900" font-size="40" fill="' + k[2] + '" stroke="#1B2A44" stroke-width="1.5">' + n + '</text></svg>'; }
function embSvg(e, c){ var S0 = { star: '<path d="M0-11l3.2 6.6 7.3 1-5.3 5.2 1.3 7.2L0 5.6-6.5 9l1.3-7.2-5.3-5.2 7.3-1z"/>', bolt: '<path d="M2-12L-7 2h6l-2 10L7-3H1z"/>', ring: '<circle r="9" fill="none" stroke-width="4" stroke="' + c + '"/><circle r="3"/>',
    wing: '<path d="M-10 6C-8-6 2-11 11-11 6-8 9-5 4-3 8-1 5 1 1 2 3 4 0 6-10 6z"/>', heart: '<path d="M0 10S-10 4-10-3a5 5 0 0 1 10-2 5 5 0 0 1 10 2C10 4 0 10 0 10z"/>', eye: '<path d="M-11 0C-6-7 6-7 11 0 6 7-6 7-11 0z"/><circle r="3.5" fill="#fff"/>' };
  return '<g fill="' + c + '">' + (S0[e] || S0.star) + '</g>'; }
function heroSvg(o, sz){ var c = HCOL[o.col] || HCOL.rb, s = c[1], p = c[2], skin = '#F1C9A5';
  return '<svg class="lkpic noico" viewBox="0 0 120 150" width="' + Math.round((sz || 120) * .8) + '" height="' + (sz || 120) + '" aria-hidden="true"><g stroke="#1B2A44" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +
    '<path d="M38 44L18 136c14 6 28-2 42-2s28 8 42 2L82 44z" fill="' + p + '"/>' +
    '<path d="M42 46h36l6 36-8 4-2 18H46l-2-18-8-4z" fill="' + s + '"/><path d="M36 50l-12 34 8 4 12-30M84 50l12 34-8 4-12-30" fill="' + s + '"/>' +
    '<path d="M46 104l-2 34h12l4-28 4 28h12l-2-34z" fill="' + p + '"/><path d="M44 130h12v8H43zM64 130h12l1 8H64z" fill="' + s + '"/>' +
    '<circle cx="60" cy="28" r="17" fill="' + skin + '"/><path d="M43 27c4-4 10-5 17-3 7-2 13-1 17 3-1 5-4 7-8 7-4 0-6-2-9-3-3 1-5 3-9 3-4 0-7-2-8-7z" fill="' + p + '"/><path d="M44 20c2-9 10-12 16-12s14 3 16 12c-6-4-26-4-32 0z" fill="#3A2A1E"/>' +
    '<rect x="50" y="94" width="20" height="5" fill="#F7C531"/></g><circle cx="53" cy="28" r="2" fill="#fff"/><circle cx="67" cy="28" r="2" fill="#fff"/>' +
    '<g transform="translate(60,66)"><circle r="13" fill="#fff" stroke="#1B2A44" stroke-width="2.5"/>' + embSvg(o.emb, p === '#F3F4F6' ? s : p) + '</g></svg>'; }
function cubeSvg(o, sz){ var sk = CSKIN[o.skin] || CSKIN.a, hr = (CHAIR[o.hair] || CHAIR.d)[1], sh = CSHIRT[o.shirt] || CSHIRT.d, pn = CPANT[o.pant] || CPANT.c, wc = (CWORLD[o.world] || CWORLD.les)[1];
  var blk = function(x, y, w, h, c){ return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="' + c + '" stroke="#1B2A44" stroke-width="3"/><rect x="' + (x + w - 9) + '" y="' + (y + 5) + '" width="5" height="' + (h - 10) + '" rx="2.5" fill="#000" opacity=".12"/>'; };
  return '<svg class="lkpic noico" viewBox="0 0 120 170" width="' + Math.round((sz || 120) * .7) + '" height="' + (sz || 120) + '" aria-hidden="true"><ellipse cx="60" cy="162" rx="40" ry="6" fill="' + wc + '" opacity=".5"/>' +
    blk(40, 112, 18, 46, pn) + blk(62, 112, 18, 46, pn) + blk(18, 66, 18, 42, sh) + blk(84, 66, 18, 42, sh) + blk(36, 62, 48, 54, sh) +
    '<rect x="50" y="76" width="20" height="20" rx="4" fill="#fff" opacity=".55"/>' + blk(32, 8, 56, 52, sk) +
    '<path d="M32 30V15a7 7 0 0 1 7-7h42a7 7 0 0 1 7 7v15c-6-8-14-10-28-10s-22 2-28 10z" fill="' + hr + '" stroke="#1B2A44" stroke-width="3" stroke-linejoin="round"/>' +
    '<circle cx="49" cy="36" r="5" fill="#fff" stroke="#1B2A44" stroke-width="2"/><circle cx="71" cy="36" r="5" fill="#fff" stroke="#1B2A44" stroke-width="2"/><circle cx="50" cy="37" r="2.4" fill="#1B2A44"/><circle cx="72" cy="37" r="2.4" fill="#1B2A44"/>' +
    '<path d="M52 47c5 4 11 4 16 0" fill="none" stroke="#1B2A44" stroke-width="2.5" stroke-linecap="round"/><circle cx="42" cy="45" r="3" fill="#F7A9B8" opacity=".7"/><circle cx="78" cy="45" r="3" fill="#F7A9B8" opacity=".7"/></svg>'; }
function crestSvg(kid, o, sz){ var k = KINGS[o.king] || KINGS.flower, e = (KEMB[o.emb] || KEMB.rose)[1];
  return '<svg class="lkpic noico" viewBox="0 0 120 140" width="' + Math.round((sz || 120) * .86) + '" height="' + (sz || 120) + '" aria-hidden="true"><g stroke="#1B2A44" stroke-width="3" stroke-linejoin="round">' +
    '<path d="M36 30l-6-20 15 10 15-16 15 16 15-10-6 20z" fill="#F2C14E"/><circle cx="45" cy="20" r="3" fill="' + k[2] + '"/><circle cx="60" cy="6" r="3.5" fill="#fff"/><circle cx="75" cy="20" r="3" fill="' + k[2] + '"/>' +
    '<path d="M18 34h84v40c0 30-20 48-42 60-22-12-42-30-42-60z" fill="' + k[2] + '"/><path d="M60 34v100c-22-12-42-30-42-60V34z" fill="' + k[3] + '" opacity=".9"/>' +
    '<path d="M24 40h72v34c0 25-16 40-36 51-20-11-36-26-36-51z" fill="none" stroke="#F2C14E" stroke-width="3"/></g>' +
    '<g transform="translate(36,58) scale(1.5)"><circle cx="16" cy="16" r="15" fill="' + k[4] + '" stroke="#F2C14E" stroke-width="2"/><g class="ics ic-' + e + '">' + ICONS[e] + '</g></g></svg>'; }
function dollSvg(o, sz){ var h = (DHAIR[o.hair] || DHAIR.a)[1], d = (DDRESS[o.dress] || DDRESS.pink)[1], st = o.style || 'ball', sk = '#F6D2BC', acc = o.acc || 'bow';
  var skirt = st === 'ball' ? 'M44 74h32l22 50c-14 6-62 6-76 0z' : st === 'long' ? 'M46 74h28l10 64c-14 4-34 4-48 0z' : 'M45 74h30l10 32c-14 5-36 5-50 0z';
  var legs = st === 'long' ? '' : '<path d="M52 ' + (st === 'ball' ? 124 : 106) + 'v26M68 ' + (st === 'ball' ? 124 : 106) + 'v26" stroke="' + sk + '" stroke-width="7" stroke-linecap="round"/><path d="M46 150h10M64 150h10" stroke="' + d + '" stroke-width="6" stroke-linecap="round"/>';
  var a = acc === 'bow' ? '<path d="M60 12c-5-6-14-8-14-2v5c0 6 9 3 14-3zM60 12c5-6 14-8 14-2v5c0 6-9 3-14-3z" fill="' + d + '" stroke="#1B2A44" stroke-width="2"/><circle cx="60" cy="12" r="3.5" fill="#fff" stroke="#1B2A44" stroke-width="2"/>' :
    acc === 'tiara' ? '<path d="M44 16l4-9 6 6 6-9 6 9 6-6 4 9z" fill="#F2C14E" stroke="#1B2A44" stroke-width="2" stroke-linejoin="round"/>' :
    acc === 'glasses' ? '<path d="M53 36s-6-3-6-7a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 7-6 7zM67 36s-6-3-6-7a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 7-6 7z" fill="' + d + '" stroke="#1B2A44" stroke-width="1.6"/>' :
    '<path d="M86 92h18l-2 18H88z" fill="' + d + '" stroke="#1B2A44" stroke-width="2"/><path d="M90 92v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#1B2A44" stroke-width="2"/>';
  return '<svg class="lkpic noico" viewBox="0 0 120 160" width="' + Math.round((sz || 120) * .75) + '" height="' + (sz || 120) + '" aria-hidden="true">' + legs +
    '<path d="M40 20c0-12 9-18 20-18s20 6 20 18v36c-6 4-34 4-40 0z" fill="' + h + '" stroke="#1B2A44" stroke-width="2.5"/>' +
    '<g stroke="#1B2A44" stroke-width="2.5" stroke-linejoin="round"><path d="M56 44h8v8h-8z" fill="' + sk + '"/><path d="M38 58l-8 30M82 58l8 30" stroke="' + sk + '" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M46 52h28l4 22H42z" fill="' + d + '"/><path d="' + skirt + '" fill="' + d + '"/><path d="M44 74h32" stroke="#fff" stroke-width="3"/>' +
    '<ellipse cx="60" cy="30" rx="15" ry="17" fill="' + sk + '"/><path d="M45 26c3-10 9-12 15-12s12 2 15 12c-6-6-24-6-30 0z" fill="' + h + '"/></g>' +
    '<circle cx="54" cy="31" r="2" fill="#2B3A67"/><circle cx="66" cy="31" r="2" fill="#2B3A67"/><path d="M56 39c2 2 6 2 8 0" stroke="#C2185B" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="50" cy="36" r="2.5" fill="#F7A9B8" opacity=".7"/><circle cx="70" cy="36" r="2.5" fill="#F7A9B8" opacity=".7"/>' + a + '</svg>'; }

/* описание каждого интерактива: шаги (выбор из вариантов), рисунок, что меняется в приложении */
function lkOpts(map, f){ return Object.keys(map).map(function(k){ return f(k, map[k]); }); }
function sw2(a, b){ return '<span class="lksw" style="background:linear-gradient(135deg,' + a + ' 50%,' + b + ' 50%)"></span>'; }
var LOOK_B = {
  foot: { t: 'Моя команда', sub: 'Позиция, цвета формы и номер на футболке', ic: 'boot',
    steps: [
      { k: 'pos', q: 'Кем ты играешь в команде?', o: function(){ return lkOpts(POSS, function(k, x){ return [k, '<b>' + x[0] + '</b><small>' + x[1] + '</small>']; }); } },
      { k: 'kit', q: 'Какие цвета у формы твоей команды?', o: function(){ return lkOpts(KITS, function(k, x){ return [k, sw2(x[1], x[2]) + '<b>' + x[0] + '</b>']; }); } },
      { k: 'num', q: 'Какой номер будет на футболке?', grid: 1, o: function(){ return [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 14, 17, 19, 21, 23, 99].map(function(n){ return [String(n), '<b class="lknum">' + n + '</b>']; }); } }
    ],
    pic: function(kid, o, sz){ return jerseySvg(o, sz); },
    done: function(o){ return o.pos && o.kit && o.num; },
    say: function(kid, o){ return 'Ты — ' + POSS[o.pos][2] + ' под номером ' + o.num + '. Форма: ' + KITS[o.kit][0].toLowerCase() + '.'; },
    apply: function(kid, o){ var k = KITS[o.kit]; var dark = k[2] === '#FFFFFF' ? k[1] : k[1];
      return { hello: 'Номер ' + o.num + ', ' + POSS[o.pos][2] + ' — на поле!', win: ['Гол! Номер ' + o.num + ' забивает!', o.pos === 'gk' ? 'Отличный сейв!' : 'Точный пас!'], v: { '--acc': dark, '--b1': k[1], '--b2': dark, '--bt': k[2] === '#FFFFFF' || k[2] === '#F7C531' ? k[2] : '#fff' } }; } },
  hero: { t: 'Мой супергерой', sub: 'Придумай героя: суперсила, имя, костюм и эмблема', ic: 'hmask',
    steps: [
      { k: 'pow', q: 'Какая у твоего героя суперсила?', o: function(){ return lkOpts(HPOW, function(k, x){ return [k, icon(x[1], 'big') + '<b>' + x[0] + '</b><small>Герой ' + x[2] + '</small>']; }); } },
      { k: 'nm', q: 'Как зовут твоего героя? Выбери имя или напиши своё.', input: 1, o: function(o){ var p = HPOW[o.pow] || HPOW.spd; return p[3].concat(['Капитан ' + p[3][0]]).map(function(n){ return [n, '<b>' + n + '</b>']; }); } },
      { k: 'col', q: 'Какого цвета костюм и плащ?', o: function(){ return lkOpts(HCOL, function(k, x){ return [k, sw2(x[1], x[2]) + '<b>' + x[0] + '</b>']; }); } },
      { k: 'emb', q: 'Какая эмблема на груди?', grid: 1, o: function(o){ var c = (HCOL[o.col] || HCOL.rb)[2]; return lkOpts(HEMB, function(k, x){ return [k, '<svg class="lkemb noico" viewBox="-16 -16 32 32" width="44" height="44"><circle r="15" fill="#fff" stroke="#1B2A44" stroke-width="2"/>' + embSvg(k, c === '#F3F4F6' ? '#1B2A44' : c) + '</svg><b>' + x + '</b>']; }); } }
    ],
    pic: function(kid, o, sz){ return heroSvg(o, sz); },
    done: function(o){ return o.pow && o.nm && o.col && o.emb; },
    say: function(kid, o){ return 'Твой герой — <b>' + U.esc(o.nm) + '</b>. Суперсила: ' + HPOW[o.pow][0].toLowerCase() + ', ' + HPOW[o.pow][2] + '.'; },
    apply: function(kid, o){ var c = HCOL[o.col]; return { hello: U.esc(o.nm) + ', город ждёт тебя!', win: [U.esc(o.nm) + ' спасает день!', 'Суперсила «' + HPOW[o.pow][0] + '» сработала!'], v: { '--acc': c[1], '--b1': c[1], '--b2': c[1], '--b3': c[2] } }; } },
  cube: { t: 'Герой из кубиков', sub: 'Собери своего героя из кубиков и выбери остров', ic: 'cubes',
    steps: [
      { k: 'skin', q: 'Цвет кожи', grid: 1, o: function(){ return lkOpts(CSKIN, function(k, x){ return [k, '<span class="lksw sq" style="background:' + x + '"></span>']; }); } },
      { k: 'hair', q: 'Волосы', grid: 1, o: function(){ return lkOpts(CHAIR, function(k, x){ return [k, '<span class="lksw sq" style="background:' + x[1] + '"></span><b>' + x[0] + '</b>']; }); } },
      { k: 'shirt', q: 'Футболка', grid: 1, o: function(){ return lkOpts(CSHIRT, function(k, x){ return [k, '<span class="lksw sq" style="background:' + x + '"></span>']; }); } },
      { k: 'pant', q: 'Штаны', grid: 1, o: function(){ return lkOpts(CPANT, function(k, x){ return [k, '<span class="lksw sq" style="background:' + x + '"></span>']; }); } },
      { k: 'world', q: 'На каком острове живёт твой герой?', o: function(){ return lkOpts(CWORLD, function(k, x){ return [k, sw2(x[1], x[2]) + '<b>' + x[0] + '</b>']; }); } }
    ],
    live: 1, pic: function(kid, o, sz){ return cubeSvg(o, sz); },
    done: function(o){ return o.skin && o.hair && o.shirt && o.pant && o.world; },
    say: function(kid, o){ return 'Герой готов! Его дом — ' + CWORLD[o.world][0].toLowerCase() + '.'; },
    apply: function(kid, o){ var w = CWORLD[o.world]; return { hello: w[0] + ': строим знания кубик за кубиком!', v: { '--acc': w[2], '--b1': w[1], '--b2': w[2] } }; } },
  prin: { t: 'Моё королевство', sub: 'Выбери королевство, его цвета и герб', ic: 'tiara',
    steps: [
      { k: 'king', q: 'Каким королевством ты правишь?', o: function(){ return lkOpts(KINGS, function(k, x){ return [k, sw2(x[2], x[3]) + '<b>' + x[0] + ' королевство</b>']; }); } },
      { k: 'emb', q: 'Что изображено на твоём гербе?', grid: 1, o: function(){ return lkOpts(KEMB, function(k, x){ return [k, icon(x[1], 'big') + '<b>' + x[0] + '</b>']; }); } }
    ],
    pic: function(kid, o, sz){ return crestSvg(kid, o, sz); },
    done: function(o){ return o.king && o.emb; },
    say: function(kid, o){ return lookG(kid, 'Ты — принц ', 'Ты — принцесса ') + KINGS[o.king][1] + ' королевства. На гербе — ' + KEMB[o.emb][0].toLowerCase() + '.'; },
    apply: function(kid, o){ var k = KINGS[o.king]; return { hello: lookG(kid, 'Принц ', 'Принцесса ') + KINGS[o.king][1] + ' королевства, добро пожаловать!', win: ['Слава ' + KINGS[o.king][1].replace(/ого$/, 'ому') + ' королевству!'], v: { '--acc': k[3], '--b1': k[2], '--b2': k[3] } }; } },
  doll: { t: 'Мой образ', sub: 'Причёска, платье и аксессуар — собери свой образ', ic: 'dress',
    steps: [
      { k: 'hair', q: 'Какие волосы?', grid: 1, o: function(){ return lkOpts(DHAIR, function(k, x){ return [k, '<span class="lksw" style="background:' + x[1] + '"></span><b>' + x[0] + '</b>']; }); } },
      { k: 'style', q: 'Какое платье?', o: function(){ return lkOpts(DSTYLE, function(k, x){ return [k, '<b>' + x + '</b>']; }); } },
      { k: 'dress', q: 'Какого цвета?', grid: 1, o: function(){ return lkOpts(DDRESS, function(k, x){ return [k, '<span class="lksw" style="background:' + x[1] + '"></span><b>' + x[0] + '</b>']; }); } },
      { k: 'acc', q: 'И последний штрих — аксессуар', grid: 1, o: function(){ return lkOpts(DACC, function(k, x){ return [k, icon(x[1], 'big') + '<b>' + x[0] + '</b>']; }); } }
    ],
    live: 1, pic: function(kid, o, sz){ return dollSvg(o, sz); },
    done: function(o){ return o.hair && o.style && o.dress && o.acc; },
    say: function(kid, o){ return 'Образ готов: ' + DSTYLE[o.style].toLowerCase() + ' ' + DDRESS[o.dress][0].toLowerCase() + ' платье и ' + DACC[o.acc][0].toLowerCase() + '.'; },
    apply: function(kid, o){ var d = DDRESS[o.dress][1]; return { hello: 'Сегодня ты звезда! Образ дня готов.', v: { '--acc': d, '--b1': d, '--b2': d } }; } }
};
var LOOK_DEF = { foot: { pos: 'fw', kit: 'rw', num: '10' }, hero: { pow: 'spd', nm: 'Вихрь', col: 'rb', emb: 'bolt' }, cube: { skin: 'a', hair: 'd', shirt: 'd', pant: 'c', world: 'les' }, prin: { king: 'flower', emb: 'rose' }, doll: { hair: 'a', style: 'ball', dress: 'pink', acc: 'bow' } };

/* --- плитка во «Всегда доступно» и экран интерактива --- */
ALWAYS.push({ id: 'mylook', order: 1,
  open: function(kid){ var o = lookO(kid), B = LOOK_B[lookId(kid)]; cur.lk = { i: 0, o: {}, show: !!(o && B && B.done(o)) }; },
  tile: function(kid){ var id = lookId(kid), B = LOOK_B[id]; if (!B) return ''; var o = lookO(kid), ok = o && B.done(o);
    return '<button class="tile fun lktile" data-act="always" data-id="mylook"><span class="ico">' + (ok ? B.pic(kid, o, 54) : icon(B.ic, 'big')) + '</span><span class="tt"><span class="sn">' + B.t + '</span><span class="ut">' + (ok ? B.say(kid, o).replace(/<[^>]+>/g, '') + ' Изменить можно в любой момент.' : B.sub + '. Цвета и приветствие станут твоими') + '</span></span></button>'; },
  view: function(kid){ var id = lookId(kid), B = LOOK_B[id]; if (!B) return ''; var C = cur.lk || (cur.lk = { i: 0, o: {} }), K = S.kids[kid], saved = lookO(kid);
    var h = '<section class="hello"><p class="eyebrow">' + LOOKS[id].n + '</p><h1>' + B.t + '</h1></section>';
    if (C.show && saved && B.done(saved)) return h + '<article class="card lkres"><div class="lkbig">' + B.pic(kid, saved, 190) + '</div><p class="lksay">' + B.say(kid, saved) + '</p><p class="hint">Теперь приложение встречает тебя по-твоему: свои цвета, приветствие и похвала.</p><div class="row"><button class="btn" data-act="home">На главную</button> <button class="btn ghost" data-act="lkagain">Придумать заново</button></div></article>';
    var st = B.steps[C.i], o = C.o, prev = Object.keys(o).length ? o : (saved || LOOK_DEF[id]), pv = {}; for (var k in LOOK_DEF[id]) pv[k] = o[k] || (saved && saved[k]) || LOOK_DEF[id][k];
    var opts = st.o(o).map(function(x){ return '<button class="opt lkopt' + (o[st.k] === x[0] ? ' on' : '') + '" data-act="lkset" data-v="' + U.esc(x[0]) + '">' + x[1] + '</button>'; }).join('');
    return h + '<div class="counter">Шаг ' + (C.i + 1) + ' из ' + B.steps.length + '</div><article class="card task lkstep"><div class="lkrow"><div class="lkprev">' + B.pic(kid, pv, 150) + '</div><div class="lkmain"><div class="q">' + st.q + '</div>' +
      '<div class="opts lkopts' + (st.grid ? ' grid' : '') + '">' + opts + '</div>' +
      (st.input ? '<form class="form lkform" data-form="mylook-name"><label>Своё имя героя<input id="lkname" maxlength="18" autocomplete="off" value="' + U.esc(o.nm || '') + '"></label><button class="btn small">Готово</button></form>' : '') + '</div></div>' +
      (C.i ? '<button class="link" data-act="lkback">← Назад</button>' : '') + '</article>'; },
  act: function(act, b){ var kid = cur.kid, id = lookId(kid), B = LOOK_B[id]; if (!B) return; var C = cur.lk || (cur.lk = { i: 0, o: {} });
    if (act === 'lkset') { C.o[B.steps[C.i].k] = b.getAttribute('data-v'); lkNext(kid); }
    else if (act === 'lkback') { C.i = Math.max(0, C.i - 1); render(); }
    else if (act === 'lkagain') { cur.lk = { i: 0, o: {} }; render(); window.scrollTo(0, 0); } },
  form: function(k, f){ if (k !== 'mylook-name') return; var C = cur.lk, v = (document.getElementById('lkname').value || '').replace(/[<>"&]/g, '').trim().slice(0, 18); if (!C || !v) return; C.o.nm = v.charAt(0).toUpperCase() + v.slice(1); lkNext(cur.kid); }
});
function lkNext(kid){ var id = lookId(kid), B = LOOK_B[id], C = cur.lk; C.i++;
  if (C.i >= B.steps.length) { var K = S.kids[kid]; if (!K.lks) K.lks = {}; K.lks[id] = C.o; C.show = 1;
    ev(kid, 'моя тема', { subj: LOOKS[id].n, text: B.say(kid, C.o).replace(/<[^>]+>/g, '') }); save(); }
  render(); window.scrollTo(0, 0); }

/* --- выбор темы родителем --- */
function lookCardSvg(id){ var L = LOOKS[id]; return '<span class="lkcard-sw" style="background:linear-gradient(135deg,' + L.sw[0] + ',' + L.sw[1] + ')">' + L.bi.map(function(n){ return icon(n); }).join('') + '</span>'; }
function lookSettings(){ if (!lookOn()) return '';
  return '<div class="card lkset"><h2>Оформление</h2><p class="hint">Выберите каждому ребёнку тему: фон, цвета, рисунки и похвала поменяются сразу. Любую тему может выбрать любой ребёнок. В каждой теме есть своя игра-выбор во «Всегда доступно».</p>' +
    kidIds().map(function(k){ var cu = lookId(k); return '<h3>' + KIDS[k].name + '</h3><div class="lkgrid">' + LOOK_ORDER.map(function(id){ var L = LOOKS[id];
      return '<button class="lkcard th-' + id + (cu === id ? ' on' : '') + '" data-act="setlook" data-k="' + k + '" data-v="' + id + '">' + lookCardSvg(id) + '<b>' + L.n + '</b><small>' + L.d + '</small></button>'; }).join('') + '</div>'; }).join('') + '</div>'; }
function lookAct(act, b){ if (act !== 'setlook') return false; var k = b.getAttribute('data-k'), v = b.getAttribute('data-v'); if (!S.kids[k] || !LOOKS[v]) return true;
  var old = lookId(k); S.kids[k].look = v; if (old !== v) ev(k, 'тема оформления', { subj: LOOKS[v].n, text: 'было: ' + (LOOKS[old] ? LOOKS[old].n : '—') }); save(); render(); return true; }

/* --- сцены над заданием для новых тем --- */
var LOOK_SCENES = {
  hero: [
    function(){ return PX.svg(400, 90, '<rect width="400" height="90" fill="#22285C"/><circle cx="330" cy="22" r="12" fill="#FFF1B8"/><path d="M200 90L120 0h40z" fill="#FFF1B8" opacity=".18"/><g fill="#141838"><rect x="0" y="40" width="40" height="50"/><rect x="44" y="24" width="34" height="66"/><rect x="82" y="48" width="44" height="42"/><rect x="230" y="30" width="36" height="60"/><rect x="270" y="50" width="50" height="40"/><rect x="324" y="36" width="34" height="54"/><rect x="362" y="56" width="38" height="34"/></g><g fill="#F7C531" opacity=".8"><rect x="50" y="32" width="5" height="6"/><rect x="64" y="46" width="5" height="6"/><rect x="238" y="40" width="5" height="6"/><rect x="332" y="48" width="5" height="6"/><rect x="284" y="60" width="5" height="6"/></g>' + lsi('hcape', 160, 14, 44) + lsi('bolt', 214, 30, 30)); },
    function(){ return PX.svg(400, 90, '<rect width="400" height="90" fill="#FFD23F"/><g fill="#F7B500">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function(i){ return '<path d="M200 45L' + (i * 60 - 30) + ' -10h30z"/>'; }).join('') + '</g>' + lsi('burst', 30, 14, 60) + lsi('hshield', 120, 18, 54) + lsi('hmask', 200, 22, 50) + lsi('bolt', 280, 16, 56) + lsi('star', 345, 22, 44)); },
    function(){ return PX.svg(400, 90, '<rect width="400" height="90" fill="#7FB8E6"/><path d="M0 70h400v20H0z" fill="#4A6FA5"/><g fill="#E9F2FB"><ellipse cx="80" cy="28" rx="34" ry="10"/><ellipse cx="300" cy="20" rx="40" ry="11"/></g>' + lsi('city', 20, 30, 50) + lsi('city', 320, 30, 50) + lsi('hcape', 170, 8, 52) + '<path d="M140 40h-50M150 52h-40" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>'); }
  ],
  cube: [
    function(){ return PX.svg(400, 90, '<rect width="400" height="90" fill="#BDEBFF"/><rect y="74" width="400" height="16" fill="#FFE3B8"/>' + lsi('cubes', 20, 30, 46) + lsi('vtree', 90, 10, 64) + lsi('vhouse', 170, 20, 56) + lsi('vcrystal', 250, 28, 44) + lsi('cubes', 320, 26, 52)); },
    function(){ var g = '<rect width="400" height="90" fill="#2B2350"/>', i; for (i = 0; i < 30; i++) g += '<rect x="' + (i * 37 % 400) + '" y="' + (i * 23 % 70) + '" width="3" height="3" fill="#fff" opacity=".7"/>';
      return PX.svg(400, 90, g + lsi('vrocket', 60, 14, 60) + lsi('vcrystal', 160, 30, 40) + lsi('vgear', 240, 24, 46) + lsi('star', 320, 20, 40)); },
    function(){ return PX.svg(400, 90, '<rect width="400" height="90" fill="#FFF1D6"/><path d="M0 70h400v20H0z" fill="#9EE6DC"/>' + lsi('vtree', 20, 6, 60) + lsi('cubes', 110, 24, 50) + lsi('vhouse', 200, 14, 60) + lsi('vtree', 300, 10, 58)); }
  ],
  prin: [
    function(){ return PX.svg(400, 90, '<defs><linearGradient id="pg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FCD5E5"/><stop offset="1" stop-color="#FFF1DA"/></linearGradient></defs><rect width="400" height="90" fill="url(#pg)"/><path d="M0 90V70c60-14 120-10 200 0s140 6 200-6v26z" fill="#BFE3C4"/>' + lsi('pcastle', 160, 6, 76) + lsi('sparkle', 60, 14, 26) + lsi('sparkle', 320, 20, 22) + lsi('rose', 40, 52, 30) + lsi('rose', 330, 54, 30)); },
    function(){ return PX.svg(400, 90, '<rect width="400" height="90" fill="#7A3E6E"/><g fill="#F2C14E" opacity=".9">' + [40, 120, 200, 280, 360].map(function(x){ return '<circle cx="' + x + '" cy="10" r="6"/><path d="M' + x + ' 0v4"/>'; }).join('') + '</g><rect y="66" width="400" height="24" fill="#5A2C52"/>' + lsi('carriage', 30, 30, 48) + lsi('slipper', 170, 38, 40) + lsi('mirror', 260, 22, 46) + lsi('tiara', 335, 34, 40)); },
    function(){ return PX.svg(400, 90, '<rect width="400" height="90" fill="#E6F3FB"/><path d="M0 64c40-6 80 6 120 0s80-6 120 0 80 6 160-2v28H0z" fill="#9CC9F0"/>' + lsi('crown', 40, 18, 44) + lsi('tiara', 130, 22, 44) + lsi('rose', 220, 16, 46) + lsi('heart', 310, 22, 40)); }
  ],
  doll: [
    function(){ var g = '<rect width="400" height="90" fill="#FFD6EA"/>', i; for (i = 0; i < 14; i++) g += '<rect x="' + i * 30 + '" width="15" height="90" fill="#FFC2DF"/>';
      return PX.svg(400, 90, g + lsi('heart', 30, 20, 44) + lsi('dress', 110, 14, 56) + lsi('heel', 190, 26, 44) + lsi('handbag', 260, 18, 48) + lsi('bow', 330, 22, 46)); },
    function(){ return PX.svg(400, 90, '<rect width="400" height="90" fill="#FFE3F1"/><rect y="62" width="400" height="28" fill="#7FD3F0"/><path d="M0 62h400" stroke="#fff" stroke-width="4"/><g fill="#F48FC0"><rect x="120" y="22" width="160" height="40" rx="6"/><path d="M110 24l90-20 90 20z"/></g><g fill="#fff"><rect x="140" y="32" width="24" height="18" rx="3"/><rect x="236" y="32" width="24" height="18" rx="3"/><rect x="188" y="34" width="24" height="28" rx="12"/></g>' + lsi('heart', 40, 18, 36) + lsi('hglasses', 320, 14, 46)); },
    function(){ var g = '<rect width="400" height="90" fill="#3A1E3F"/>', i; for (i = 0; i < 9; i++) g += '<circle cx="' + (i * 50 + 20) + '" cy="8" r="5" fill="#FFE3F1"/><path d="M' + (i * 50 + 20) + ' 10L' + (i * 50 + 5) + ' 90h30z" fill="#FFE3F1" opacity=".08"/>';
      return PX.svg(400, 90, g + '<rect x="0" y="70" width="400" height="20" fill="#F48FC0"/>' + lsi('dress', 80, 18, 52) + lsi('mirror', 175, 14, 52) + lsi('sparkle', 260, 18, 40) + lsi('heel', 320, 30, 40)); }
  ]
};
