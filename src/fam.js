/* ===== Словоход: семейная тестовая версия (регистрация семьи, дети 6–13, отключение из админки) =====
   Подключается только в сборке docs/semya/ (FAM = 1). Данные семей — в закрытой Google-таблице, через тот же скрипт синхронизации. */
/* Опросник для родителя: увлечения, любимые герои, любимый цвет → оформление ребёнка.
   Чужих персонажей не рисуем: любимого героя переводим в узнаваемую тему (волшебная школа, супергерой, принцесса…). */
var FAM_INT = {
  football: ['⚽ Футбол', 'yarik', ['⚽','🥅','🏆','👟','🧤','🏟️'], '⚽ ГОЛ!', 'Сегодня тренировка мозга!'],
  sport:    ['🏅 Спорт', 'yarik', ['🏅','🚴','🏊','🎾','🏀','🥇'], '🥇 Победа!', 'Разминка для головы!'],
  animals:  ['🐶 Животные', 'yarik', ['🐶','🐱','🦊','🐼','🐰','🦁'], '🐶 Ура!', 'Звери ждут тебя!'],
  space:    ['🚀 Космос', 'yarik', ['🚀','🪐','👨‍🚀','⭐','🌙','🛰️'], '🚀 Взлёт!', 'Полёт к новым знаниям!'],
  dino:     ['🦖 Динозавры', 'yarik', ['🦖','🦕','🌋','🦴','🥚','🌿'], '🦖 Р-р-р, верно!', 'Экспедиция начинается!'],
  cars:     ['🚗 Машины и техника', 'yarik', ['🚗','🏎️','🚂','🚜','✈️','🔧'], '🏎️ Полный газ!', 'Заводим мотор!'],
  games:    ['🎮 Игры', 'yarik', ['🎮','🕹️','🧩','🏆','👾','⭐'], '🎮 Новый уровень!', 'Новый уровень ждёт!'],
  hero:     ['🦸 Супергерои', 'yarik', ['🦸','⚡','🛡️','💥','🦹','🌟'], '⚡ Суперсила!', 'Герой, за дело!'],
  draw:     ['🎨 Рисование', 'anya', ['🎨','🖍️','🖌️','🌈','✏️','🖼️'], '🎨 Красота!', 'Сегодня рисуем словами!'],
  music:    ['🎤 Музыка и пение', 'anya', ['🎤','🎵','🎸','🎹','🎶','🥁'], '🎵 Браво!', 'Настраиваемся на урок!'],
  dance:    ['💃 Танцы', 'anya', ['💃','🩰','🎶','✨','🕺','🌟'], '💃 Отлично станцевала задачка!', 'Танцуем к знаниям!'],
  magic:    ['🪄 Волшебство', 'anya', ['✨','🦉','🪄','🏰','🌙','🔮'], '🪄 Заклинание сработало!', 'Добро пожаловать в Школу волшебства!'],
  princess: ['👑 Принцессы и замки', 'anya', ['👑','🏰','🦄','💖','🌸','✨'], '👑 Великолепно!', 'Королевство знаний открыто!'],
  dolls:    ['🎀 Куклы', 'anya', ['🎀','👗','🧸','💖','🌸','✨'], '🎀 Чудесно!', 'Куклы ждут новых историй!'],
  fairy:    ['📚 Сказки', 'anya', ['📚','🐻','🍯','🔥','🐺','🌲'], '📚 Как в сказке!', 'Жили-были знания…'],
  nature:   ['🌳 Природа', 'yarik', ['🌳','🌻','🦋','🐞','🍄','🌈'], '🌻 Чудесно!', 'В лес за новыми словами!']
};
var FAM_HERO = [[/кукл|пупс|\blol\b|лол(?![а-яё])/i, 'dolls'], [/гарри|поттер|хогвартс|волшеб|маг|ведьм|фея|винкс/i, 'magic'], [/эльз|холодн|анн|принцесс|рапунцел|золушк|белоснеж|ариэл|русалоч|моана|пони|единорог|барби/i, 'princess'],
  [/марвел|паук|спайдер|бэтмен|бетмен|супермен|мстит|халк|тор|капитан|железн|ниндзя|черепашк|леди баг|супер/i, 'hero'], [/майнкрафт|роблокс|марио|соник|покемон|пикачу|фортнайт|бравл/i, 'games'],
  [/щенячий|патрул|кот|собак|пёс|пес|зверопол|король лев|симба|лунтик|смешарик/i, 'animals'], [/косм|звёздн|звездн|ракет|астронав|базз/i, 'space'], [/тачки|молни|маквин|машин|робокар|трансформ|поезд|паровоз/i, 'cars'],
  [/динозавр|рекс|юрск/i, 'dino'], [/колобок|баба.?яг|жар.?птиц|иван|сказк|буратин|чебураш|винни|маша и медвед|три кота|фиксик/i, 'fairy'], [/месси|роналду|мбаппе|футбол/i, 'football']];
var FAM_COLORS = [['red', '#e11d48'], ['orange', '#f97316'], ['yellow', '#eab308'], ['green', '#16a34a'], ['sky', '#0ea5e9'], ['blue', '#2563eb'], ['violet', '#7c3aed'], ['pink', '#ec4899']];
function famInts(c){ var a = (c.ints || []).slice(), h = (c.hero || '') + ' ' + (c.books || '') + ' ' + (c.done || ''); FAM_HERO.forEach(function(x){ if (x[0].test(h) && a.indexOf(x[1]) < 0) a.push(x[1]); }); return a.filter(function(k){ return FAM_INT[k]; }); }
function famLookOf(c){ var a = famInts(c), y = 0, n = 0; a.forEach(function(k){ if (FAM_INT[k][1] === 'anya') n++; else y++; }); return !a.length ? (c.sex === 'm' ? 'yarik' : c.sex === 'f' ? 'anya' : famAgeCfg(c.age).tpl) : n > y ? 'anya' : 'yarik'; }
function famThemeOf(c){ var a = famInts(c); if (!a.length) return null; var b = [], p = [], w = [];
  a.forEach(function(k){ var I = FAM_INT[k]; b = b.concat(I[2].slice(0, 4)); p = p.concat(I[2]); w.push(I[3]); });
  w = w.concat(['🌟 Молодец!', '👏 Здорово!']); var I0 = FAM_INT[a[0]];
  return { banner: b.slice(0, 8), pics: p, win: w, hello: I0[4], world: I0[0].replace(/^\S+\s/, '') }; }
function famReadList(list, done){ var d = String(done || '').toLowerCase().replace(/ё/g, 'е'); if (d.length < 4) return list;
  var out = list.filter(function(t){ var ti = String(t.title || '').toLowerCase().replace(/ё/g, 'е').replace(/^(глав[аы]|части?)[^.]*\.\s*/, ''); return !(ti.length >= 5 && d.indexOf(ti) >= 0); });
  return out.length >= 5 ? out : list; }
/* Дополнительные вопросы анкеты: [ключ, вопрос, варианты] */
var FAM_Q = [
  ['rt', 'Как пересказывает прочитанное', ['Легко и с подробностями', 'Коротко, путает порядок', 'Только по наводящим вопросам', 'Пока почти не умеет']],
  ['vw', 'Понимает ли русские слова из книг', ['Почти все', 'Бытовые понимает, книжные — нет', 'Часто просит перевести']],
  ['wr', 'Пишет и печатает по-русски', ['Пишет сам', 'Медленно, по буквам', 'Пока не пишет']],
  ['mt', 'Математика', ['Считает до 20', 'Складывает и вычитает до 100', 'Умножает и делит', 'Решает задачи в несколько действий']],
  ['at', 'Сколько может заниматься, не отвлекаясь', ['10–15 минут', '20–25 минут', '30–40 минут']],
  ['er', 'Как переносит ошибки и трудные задания', ['Расстраивается и бросает', 'Злится, но продолжает', 'Спокойно пробует снова']],
  ['dk', 'Как произносит, когда читает вслух', ['Чисто', 'Есть акцент, картавит или шепелявит', 'Читает по слогам, с паузами']],
  ['mo', 'Что больше всего мотивирует', ['Награда из копилки', 'Похвала', 'Рекорды и серии дней', 'Сюжет и новое']]];
/* Изучаемые языки: код → [название, код озвучки] и уровни владения */
var FAM_LANGS = { pt: ['Португальский', 'pt-PT'], en: ['Английский', 'en-GB'], fr: ['Французский', 'fr-FR'], de: ['Немецкий', 'de-DE'], es: ['Испанский', 'es-ES'] };
var FAM_LLV = ['Изучать с нуля', 'Изучать: немного говорит', 'Изучать: общается в школе', 'Изучать: говорит свободно'];
/* Курс по языку и уровню. Начальные уровни — объяснения по-русски; «общается в школе» и «свободно» — упор на грамматику и письмо */
function famLangCourse(code, lv, age){
  if (code === 'pt') return lv >= 2 ? PT_NAT : lv === 1 && age >= 8 ? PT_A : PT_Y;
  if (code === 'en') return lv >= 2 || (lv === 1 && age >= 9) ? EN_A : EN_UNITS;
  return { fr: FR_U, de: DE_U, es: ES_U }[code];
}
function famLangs(c){ var lg = c.lg || {}; return Object.keys(FAM_LANGS).filter(function(k){ return lg[k] != null && lg[k] !== ''; }).slice(0, 2); }
var FAM_QK = FAM_Q.map(function(q){ return q[0]; });
function famQv(c, k){ var v = c[k]; return v == null || v === '' ? null : +v; }
var FAM_RD = ['Пока не читает или читает по слогам', 'Читает медленно, с трудом', 'Читает уверенно', 'Читает много и быстро, сам выбирает книги'];
function famColor(c){ var x = FAM_COLORS.filter(function(z){ return z[0] === c.color; })[0]; return x ? x[1] : ''; }
function famBody(){ var c = cur.kid && famKid(cur.kid), col = c && famColor(c); if (col && document.body.className) document.body.style.setProperty('--acc', col); else document.body.style.removeProperty('--acc'); }
function famKid(id){ return ((S.fam && S.fam.kids) || []).filter(function(c){ return c.id === id; })[0]; }
function famCardStyle(id){ var c = famKid(id), col = c && famColor(c); return col ? ' style="background:linear-gradient(160deg,' + col + ',' + col + 'cc)"' : ''; }
function famAgeCfg(age){
  age = Math.max(6, Math.min(13, +age || 8));
  return { tpl: age <= 9 ? 'yarik' : 'anya',
    n: { 6: 6, 7: 8, 8: 10, 9: 11, 10: 12, 11: 13, 12: 14, 13: 15 }[age],
    norm: { 6: 30, 7: 40, 8: 55, 9: 70, 10: 90, 11: 110, 12: 120, 13: 130 }[age],
    startWords: { 6: 30, 7: 40, 8: 60, 9: 80, 10: 110, 11: 150, 12: 170, 13: 190 }[age] };
}
function famInit(){
  var k; for (k in KIDS) delete KIDS[k];
  var L = (S.fam && S.fam.kids) || [];
  L.forEach(function(c){ var a = famAgeCfg(c.age), rd = c.rd == null || c.rd === '' ? (+c.age <= 6 ? 0 : +c.age === 7 ? 1 : 2) : +c.rd;
    /* Уровень чтения: тексты и объём чтения вслух; математика остаётся по возрасту */
    a.startWords = Math.round(a.startWords * [0.5, 0.8, 1, 1.4][rd]); a.norm = Math.round(a.norm * [0.7, 0.85, 1, 1.2][rd]);
    var q = function(k){ return famQv(c, k); }, sw = 1, nf = 1;
    if (q('rt') != null) sw *= [1.1, 1, 0.85, 0.7][q('rt')];
    if (q('vw') != null) sw *= [1, 0.85, 0.7][q('vw')];
    if (q('at') != null) nf = [0.65, 0.85, 1.1][q('at')];
    a.startWords = Math.max(20, Math.round(a.startWords * sw));
    a.n = Math.max(4, Math.round(a.n * nf) - (q('er') === 0 ? 1 : 0));
    if (q('wr') === 2) a.noType = 1;
    if (q('dk')) { a.accMin = 0.8; a.simPlus = 1; }
    /* Математика: программа и стартовая тема по ответу родителя, а не по возрасту */
    var mt = q('mt'), mk = null, mp = 0;
    if (mt === 0) { mk = 'yarik'; mp = 0; } else if (mt === 1) { mk = 'yarik'; mp = 5; }
    else if (mt === 2) { if (c.age <= 9) { mk = 'yarik'; mp = 11; } else { mk = 'anya'; mp = 0; } }
    else if (mt === 3) { if (c.age >= 11) { mk = 'age'; mp = 0; } else if (c.age >= 8) { mk = 'anya'; mp = 0; } else { mk = 'yarik'; mp = 13; } }
    /* Курс своего возраста (src/cur_ages.js): его предметы заменяют предметы шаблона */
    var ac = typeof AGE_CUR !== 'undefined' && AGE_CUR[+c.age];
    if (ac) a.cur = Object.assign({}, KIDS_TPL[a.tpl].cur, ac);
    /* Анкета «отстаёт» (mt 0–1) или «опережает» (mt 3) — математика из соседнего курса; «по возрасту» (mt 2) — своя. С 11 лет «опережает» — тоже свой курс: курс Ани (5 класс) для 12–13 лет был бы шагом назад */
    if (ac && ac.math && (mt == null || mt === 2)) { mk = null; if (mt === 2) { mk = 'age'; mp = 0; } }
    if (mk && mk !== 'age') a.cur = Object.assign({}, a.cur || KIDS_TPL[a.tpl].cur, { math: KIDS_TPL[mk].cur.math });
    var ls = famLangs(c), lset = ls.map(function(k){ return k + (+c.lg[k]); }).join(',');
    if (ls.length) { var l0 = ls[0], l1 = ls[1], lc = { '': FAM_LANGS[l0][1] };
      var lang = { name: FAM_LANGS[l0][0], src: 'Словоход', units: famLangCourse(l0, +c.lg[l0], c.age) };
      if (l1) { lang.alt = famLangCourse(l1, +c.lg[l1], c.age); lang.altName = FAM_LANGS[l1][0]; lc._alt = FAM_LANGS[l1][1]; }
      a.cur = Object.assign({}, a.cur || KIDS_TPL[a.tpl].cur, { lang: lang }); a.lc = lc; }
    else { a.cur = Object.assign({}, a.cur || KIDS_TPL[a.tpl].cur); delete a.cur.lang; a.order = KIDS_TPL[a.tpl].order.filter(function(sj){ return sj !== 'lang'; }); } /* «Не изучать» везде — иностранного языка в плане нет */
    a.read = famReadList((rd >= 2 && c.age >= 12 ? READ_T : rd >= 3 && c.age >= 9 ? READ_A : (rd <= 1 && c.age <= 7) || (rd === 0 && c.age <= 10) ? READ_S.concat(READ_Y) : rd <= 2 && c.age <= 10 ? READ_Y : KIDS_TPL[a.tpl].read).filter(function(t){ return !/Ярик/.test(t.text || ''); }), c.done); /* 6–7 лет и нечитающие до 10 — короткие тексты; 8–10 лет — классика 2–4 классов (Мамин-Сибиряк, Гаршин, Аксаков…); тексты «про Ярика» — только в Уроках */
    KIDS[c.id] = Object.assign({}, KIDS_TPL[a.tpl], a, { name: c.name, rdLv: rd, age: +c.age, grade: c.age + ' ' + U.pl(+c.age, 'год', 'года', 'лет'), sex: c.sex || '', look: c.look || famLookOf(c) });
    var th = famThemeOf(c); if (th) THEME['k:' + c.id] = th; else delete THEME['k:' + c.id];
    if (!S.kids[c.id]) S.kids[c.id] = newKid(); if (c.pin) S.kids[c.id].pin = c.pin;
    var K = S.kids[c.id], ms = mk ? mt + '|' + mk : ''; if (ms && K.mathSet !== ms) { K.pos.math = mp; K.mathSet = ms; }
    var as = ac ? c.age + ':' + Object.keys(ac).join(',') : ''; if ((K.ageSet || '') !== as) { if (ac) Object.keys(ac).forEach(function(sj){ delete K.pos[sj]; delete K.pos[sj + '_alt']; }); K.ageSet = as; }
    var rs = !a.read.length ? '' : READ_S.indexOf(a.read[0]) >= 0 ? 's' : READ_T.indexOf(a.read[0]) >= 0 && READ_A.indexOf(a.read[0]) < 0 ? 't' : ''; if ((K.readSet || '') !== rs) { K.pos.read = 0; K.readSet = rs; } /* свой список чтения 12–13 лет — с начала */
    if ((K.langSet || '') !== lset) { delete K.pos.lang; delete K.pos.lang_alt; K.langSet = lset; } });
  if (S.fam && S.fam.ppin) S.parentPin = S.fam.ppin;
}
function famApi(o){
  return fetch(SYNC_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(o) })
    .then(function(r){ return r.json(); });
}
var FAM_BUSY = false;
/* Регистрация только по личному одноразовому приглашению: ссылка …/semya/#i=КОД */
var FAM_INV = (function(){ var c = ''; try { var m = (location.hash + '&' + location.search).match(/[#?&]i=([A-Za-z0-9]{6,20})/); if (m) { c = m[1]; localStorage.setItem('slovohod.inv', c); history.replaceState(null, '', location.pathname); } c = c || localStorage.getItem('slovohod.inv') || ''; } catch (e) {} return c; })();
/* Анкета детей на сервер. Не дошла (нет связи, ошибка) — помечаем и повторяем при каждом открытии, иначе на другом устройстве детей не будет */
function famKidsPush(loud){
  if (!S.fam || !S.fam.fid || !S.fam.kidsDirty) return Promise.resolve();
  return famApi({ fam: 'kids', fid: S.fam.fid, token: S.fam.token, kids: S.fam.kids || [], ppin: S.fam.ppin })
    .then(function(j){ if (j && j.ok) { delete S.fam.kidsDirty; save(); } else if (loud) alertMsg('Анкета сохранена на этом устройстве, но не отправилась на сервер. Повторим сами при следующем открытии', 6000); })
    .catch(function(){ if (loud) alertMsg('Нет связи: анкета сохранена на этом устройстве и отправится, когда появится интернет', 6000); });
}
function famStatus(){
  if (!S.fam || !S.fam.fid || !navigator.onLine) return;
  famKidsPush(false);
  return famApi({ fam: 'st', fid: S.fam.fid, token: S.fam.token }).then(function(j){
    if (!j) return; var off = !!j.off || j.err === 'auth'; if (off !== !!S.fam.off) { S.fam.off = off; save(); render(); } }).catch(function(){});
}
function famGate(){
  if (!KIDS[cur.parentKid]) cur.parentKid = kidIds()[0] || null;
  if (S.fam && S.fam.off) return famWrap(famBrand(true) + '<header class="hero"><h1>Доступ приостановлен</h1><p>Тестовый доступ для вашей семьи сейчас отключён. Свяжитесь с организатором теста.</p></header><p class="center"><button class="btn ghost" data-act="fkrecheck">Проверить ещё раз</button></p>');
  if (!S.fam) return cur.fview === 'login' || (!cur.fview && !FAM_INV) ? vFamLogin() : vFamReg();
  if (!S.parentPin || !kidIds().length || cur.view === 'fkids') return vFamKids();
  return null;
}
function famWrap(h){ return '<main class="wrap narrow famscr">' + h + '</main>'; }
var FAM_MOTTO = 'От первых слов — к большим книгам';
function famBrand(big){ return '<div class="fambrand' + (big ? ' big' : '') + '"><img src="semya/logo.webp" alt="" width="' + (big ? 160 : 64) + '" height="' + (big ? 160 : 64) + '"><div><div class="famlogo">Слово<span>ход</span></div>' + (big ? '<p class="fammotto">' + FAM_MOTTO + '</p>' : '') + '</div></div>'; }
function famIn(id, label, type, extra){ return '<label>' + label + '<input id="' + id + '" type="' + (type || 'text') + '" autocomplete="off" ' + (extra || '') + '></label>'; }
function vFamReg(){
  if (!FAM_INV) return famWrap(famBrand(true) + '<header class="hero"><p class="eyebrow">Закрытая тестовая версия</p><h1>Только по приглашению</h1><p>Зарегистрироваться можно по личной ссылке-приглашению. Каждая ссылка действует для одной семьи. Если вы уже зарегистрированы — войдите.</p></header>' +
    '<p class="center"><button class="btn big" data-act="fklogin">Войти</button></p>' + '<p class="center"><a class="link" href="semya/ustanovka.html" target="_blank">Как установить на телефон, планшет и компьютер</a></p>');
  return famWrap(famBrand(true) + '<header class="hero"><p class="eyebrow">Бесплатная тестовая версия</p><p class="famintro">Дома вы говорите по-русски, а в школе и с друзьями ребёнок всё чаще переходит на другой язык. Словоход каждый день по 20–40 минут читает с ним, просит пересказать и задаёт вопросы. Урок ведёт приложение, а вам приходит короткий отчёт.</p></header>' +
    '<form class="card form" data-form="freg"><h2>Регистрация семьи</h2>' + famIn('fname', 'Ваше имя') + famIn('femail', 'Email', 'email', 'inputmode="email" autocapitalize="off"') + famIn('fpass', 'Пароль (не короче 6 знаков)', 'password') +
    '<button class="btn big"' + (FAM_BUSY ? ' disabled' : '') + '>' + (FAM_BUSY ? 'Подождите…' : 'Зарегистрироваться') + '</button></form>' +
    '<p class="center"><button class="link" data-act="fklogin">Уже регистрировались? Войти</button></p>' + '<p class="center"><a class="link" href="semya/ustanovka.html" target="_blank">Как установить на телефон, планшет и компьютер</a></p>');
}
function vFamLogin(){
  return famWrap(famBrand(true) + '<header class="hero"><h1>Вход для родителей</h1><p>Войдите тем же email и паролем, что при регистрации.</p></header>' +
    '<form class="card form" data-form="flogin">' + famIn('femail', 'Email', 'email', 'inputmode="email" autocapitalize="off"') + famIn('fpass', 'Пароль', 'password') +
    '<button class="btn big"' + (FAM_BUSY ? ' disabled' : '') + '>' + (FAM_BUSY ? 'Подождите…' : 'Войти') + '</button></form>' +
    '<p class="center"><button class="link" data-act="fkreg">Новая семья? Регистрация</button></p>' + '<p class="center"><a class="link" href="semya/ustanovka.html" target="_blank">Как установить на телефон, планшет и компьютер</a></p>');
}
/* Черновик списка детей на экране настройки */
function fkDraft(){ if (!cur.fk) cur.fk = ((S.fam && S.fam.kids) || []).map(function(c){ return { id: c.id, name: c.name, age: c.age, sex: c.sex || '', ints: (c.ints || []).slice(), hero: c.hero || '', books: c.books || '', done: c.done || '', rd: c.rd == null ? '' : String(c.rd), color: c.color || '', has: !!c.pin, lg: Object.assign({}, c.lg || {}), q: FAM_QK.reduce(function(o, k){ o[k] = c[k] == null ? '' : String(c[k]); return o; }, {}) }; }); if (!cur.fk.length) cur.fk.push({ id: '', name: '', age: 8, sex: '', ints: [], hero: '', books: '', done: '', rd: '', color: '' }); return cur.fk; }
function fkRead(){ (cur.fk || []).forEach(function(c, i){ var g = function(n){ var el = document.getElementById('fk' + n + i); return el ? el.value : null; };
  if (g('n') != null) { c.name = g('n').trim(); c.age = +g('a'); c.sex = g('s') || ''; c.hero = g('h').trim(); c.books = g('b').trim(); c.done = g('d').trim(); c.rd = g('r'); c.pinNew = g('p'); c.q = c.q || {}; FAM_QK.forEach(function(k){ var v = g('q' + k); if (v != null) c.q[k] = v; }); c.lg = c.lg || {}; Object.keys(FAM_LANGS).forEach(function(k){ var v = g('l' + k); if (v != null) { if (v === '') delete c.lg[k]; else c.lg[k] = v; } }); } }); }
function vFamKids(){
  var L = fkDraft(), first = !S.parentPin;
  var ages = function(v){ var h = ''; for (var a = 6; a <= 13; a++) h += '<option value="' + a + '"' + (+v === a ? ' selected' : '') + '>' + a + ' ' + U.pl(a, 'год', 'года', 'лет') + '</option>'; return h; };
  var rows = L.map(function(c, i){ return '<fieldset class="card form fkid"><h2>Ребёнок ' + (i + 1) + (L.length > 1 ? ' <button type="button" class="link" data-act="fkdel" data-i="' + i + '">убрать</button>' : '') + '</h2>' +
    '<label>Имя<input id="fkn' + i + '" value="' + U.esc(c.name || '') + '" maxlength="20" autocomplete="off"></label>' +
    '<label>Возраст<select id="fka' + i + '">' + ages(c.age) + '</select></label>' +
    '<label>Мальчик или девочка — чтобы приложение обращалось правильно: «ты прочитал» или «ты прочитала»<select id="fks' + i + '"><option value="">— выберите —</option><option value="m"' + (c.sex === 'm' ? ' selected' : '') + '>Мальчик</option><option value="f"' + (c.sex === 'f' ? ' selected' : '') + '>Девочка</option></select></label>' +
    '<p class="fkql">Что любит? Отметьте всё, что подходит — по этому подберём картинки и оформление</p><div class="row fkints">' + Object.keys(FAM_INT).map(function(k){ return '<button type="button" class="chip' + ((c.ints || []).indexOf(k) >= 0 ? ' on' : '') + '" data-act="fkint" data-i="' + i + '" data-k="' + k + '">' + FAM_INT[k][0] + '</button>'; }).join('') + '</div>' +
    '<label>Любимые герои мультиков или книг<input id="fkh' + i + '" value="' + U.esc(c.hero || '') + '" maxlength="80" autocomplete="off" placeholder="Например: Гарри Поттер, Человек-паук, Колобок"></label>' +
    '<label>Как читает по-русски<select id="fkr' + i + '"><option value="">— выберите —</option>' + FAM_RD.map(function(t, k){ return '<option value="' + k + '"' + (String(c.rd) === String(k) ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label>' +
    '<p class="fkql">Ещё несколько вопросов — чтобы задания с первого дня были по силам</p>' + FAM_Q.map(function(x){ var v = (c.q || {})[x[0]]; return '<label>' + x[1] + '<select id="fkq' + x[0] + i + '"><option value="">— выберите —</option>' + x[2].map(function(t, k){ return '<option value="' + k + '"' + (v !== '' && v != null && String(v) === String(k) ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label>'; }).join('') +
    '<p class="fkql">Иностранные языки — по желанию</p><p class="hint">Русский ребёнок учит всегда. Можно добавить один или два иностранных языка и отметить, как ребёнок говорит на нём сейчас. Если иностранный язык не нужен, оставьте везде «Не изучать».</p>' + Object.keys(FAM_LANGS).map(function(k){ var v = (c.lg || {})[k]; return '<label>' + FAM_LANGS[k][0] + '<select id="fkl' + k + i + '"><option value="">Не изучать</option>' + FAM_LLV.map(function(t, j){ return '<option value="' + j + '"' + (v != null && v !== '' && +v === j ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label>'; }).join('') +
    '<label>Любимые книги<input id="fkb' + i + '" value="' + U.esc(c.books || '') + '" maxlength="200" autocomplete="off" placeholder="На любом языке, можно несколько"></label>' +
    '<label>Что уже прочитал(а) из русских книг<input id="fkd' + i + '" value="' + U.esc(c.done || '') + '" maxlength="300" autocomplete="off" placeholder="Например: Денискины рассказы, Каштанка"></label>' +
    '<p class="fkql">Любимый цвет</p><div class="row fkcols">' + FAM_COLORS.map(function(x){ return '<button type="button" class="fkcol' + (c.color === x[0] ? ' on' : '') + '" data-act="fkcol" data-i="' + i + '" data-k="' + x[0] + '" style="background:' + x[1] + '" aria-label="' + x[0] + '"></button>'; }).join('') + '</div>' +
    '<label>Код ребёнка, 4 цифры — ребёнок вводит его, когда входит в свой профиль' + (c.has ? ' (оставьте пустым, чтобы не менять)' : '') + '<input id="fkp' + i + '" inputmode="numeric" maxlength="4" autocomplete="off" value="' + U.esc(c.pinNew || '') + '"></label></fieldset>'; }).join('');
  return famWrap(famBrand(false) + '<header class="hero"><p class="eyebrow">' + U.esc((S.fam && S.fam.email) || '') + '</p><h1>' + (first ? 'Добавьте детей' : 'Дети') + '</h1><p>Программа подбирается по возрасту ребёнка — от подготовки к школе до седьмого класса. Дальше сложность меняется по его ответам.</p></header>' +
    '<form data-form="fkids">' + rows + (L.length < 5 ? '<p class="center"><button type="button" class="btn ghost" data-act="fkadd">+ Ещё ребёнок</button></p>' : '') +
    '<div class="card form"><label>Код родителя, 4 цифры' + (first ? '' : ' (оставьте пустым, чтобы не менять)') + '<input id="fkpp" inputmode="numeric" maxlength="4" autocomplete="off"></label><p class="hint">Код родителя нужен, чтобы открыть отчёты и подтвердить призы. У каждого ребёнка свой код: так брат или сестра не смогут заниматься под чужим именем. Все коды должны быть разными.</p>' +
    '<button class="btn big">Сохранить</button>' + (first ? '' : ' <button type="button" class="link" data-act="fkback">Отмена</button>') + '</div></form>');
}
function famLoginExtra(){ return '<p class="fammotto center">' + FAM_MOTTO + '</p>'; }
function famSettings(){
  return '<div class="card"><h2>Семья</h2><p class="hint">' + U.esc(S.fam.email || '') + '</p><div class="row"><button class="btn small" data-act="fkedit">Дети и коды</button> <button class="btn small stop" data-act="fkout">Выйти из аккаунта</button></div></div>' +
    '<div class="card"><h2>Вечерняя сводка на почту</h2><p class="hint">Каждый день около 20:30 (Лиссабон) на ' + U.esc(S.fam.email || '') + ' приходит письмо: что дети сделали и чего не сделали за день. Сводку на эту минуту можно получить на главном экране родителя, кнопка «Сводка сейчас».</p><p>' + (S.fam.sumOff ? 'Сейчас отключена.' : 'Сейчас включена.') + '</p><div class="row"><button class="btn small' + (S.fam.sumOff ? '' : ' ghost') + '" data-act="' + (S.fam.sumOff ? 'fsumon' : 'fsumoff') + '">' + (S.fam.sumOff ? 'Включить' : 'Отключить') + '</button></div></div>' +
    '<form class="card form" data-form="ffb"><h2>Отзыв о тестовой версии</h2><label>Что понравилось, что мешает, чего не хватает<textarea id="ffbt" rows="4" maxlength="2000" style="display:block;width:100%;box-sizing:border-box;margin-top:6px;font:inherit;padding:10px;border-radius:12px;border:1px solid #cbd5e1"></textarea></label><button class="btn small">Отправить</button></form>';
}
function famAct(act, b){
  switch (act) {
    case 'ffine': S.cfg = S.cfg || {}; S.cfg.fineOn = !S.cfg.fineOn; save(); render(); return true;
    case 'fklogin': cur.fview = 'login'; render(); return true;
    case 'fkreg': cur.fview = 'reg'; render(); return true;
    case 'fkadd': fkRead(); cur.fk.push({ id: '', name: '', age: 8, sex: '', ints: [], hero: '', books: '', done: '', rd: '', color: '' }); render(); return true;
    case 'fkint': { fkRead(); var c1 = cur.fk[+b.dataset.i], L1 = c1.ints = c1.ints || [], j1 = L1.indexOf(b.dataset.k); if (j1 >= 0) L1.splice(j1, 1); else L1.push(b.dataset.k); var y0 = window.scrollY; render(); window.scrollTo(0, y0); return true; }
    case 'fkcol': { fkRead(); var c2 = cur.fk[+b.dataset.i]; c2.color = c2.color === b.dataset.k ? '' : b.dataset.k; var y1 = window.scrollY; render(); window.scrollTo(0, y1); return true; }
    case 'fkdel': fkRead(); cur.fk.splice(+b.dataset.i, 1); render(); return true;
    case 'fkedit': cur.fk = null; go('fkids'); return true;
    case 'fkback': cur.fk = null; go('parent', { parentTab: 'set' }); return true;
    case 'fkrecheck': famStatus(); return true;
    case 'fsum': famSumGet(false); return true;
    case 'fsummail': famSumGet(true); return true;
    case 'fsumon': famSumSet(true); return true;
    case 'fsumoff': famSumSet(false); return true;
    case 'fkout': if (window.confirm('Выйти из аккаунта на этом устройстве? Прогресс детей на этом устройстве сотрётся.')) { flush().finally(function(){ try { localStorage.removeItem(KEY); } catch (x) {} location.reload(); }); } return true;
  }
  return false;
}
function famAuthDone(j){
  FAM_BUSY = false;
  if (j && j.inv === 'bad') { FAM_INV = ''; try { localStorage.removeItem('slovohod.inv'); } catch (e) {} }
  if (j && j.ok && FAM_INV) { FAM_INV = ''; try { localStorage.removeItem('slovohod.inv'); } catch (e) {} }
  if (!j || !j.ok) { render(); return alertMsg(j && j.msg ? j.msg : 'Не получилось. Проверьте интернет и попробуйте ещё раз'); }
  S.fam = { fid: j.fid, token: j.token, email: j.email, name: j.name || '', kids: j.kids || [], ppin: j.ppin || null, off: !!j.off, sumOff: !!j.sumOff };
  famInit(); save(); cur.fk = null; go('login');
}
function famBad(id, msg, id2){ alertMsg(msg, 5000); var e = document.getElementById(id2 || id); if (e) { e.scrollIntoView({ block: 'center' }); e.focus(); } return true; }
function famForm(k, f, val){
  if (k === 'freg' || k === 'flogin') {
    var em = val('femail').trim().toLowerCase(), pw = val('fpass'), nm = k === 'freg' ? val('fname').trim() : '';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { alertMsg('Проверьте email'); return true; }
    if (pw.length < 6) { alertMsg('Пароль — не короче 6 знаков'); return true; }
    if (k === 'freg' && !nm) { alertMsg('Напишите ваше имя'); return true; }
    if (FAM_BUSY) return true; FAM_BUSY = true; render();
    famApi({ fam: k === 'freg' ? 'reg' : 'login', email: em, pass: pw, name: nm, inv: k === 'freg' ? FAM_INV : '' }).then(famAuthDone).catch(function(){ famAuthDone(null); });
    return true;
  }
  if (k === 'fkids') {
    fkRead(); var L = cur.fk, pp = val('fkpp'), first = !S.parentPin, i, c, pins = [];
    for (i = 0; i < L.length; i++) { c = L[i];
      if (!c.name) return famBad('fkn' + i, 'Напишите имя ребёнка ' + (i + 1));
      if (c.sex !== 'm' && c.sex !== 'f') return famBad('fks' + i, c.name + ': отметьте, мальчик или девочка');
      var lgOn = Object.keys(c.lg || {}).filter(function(k){ return FAM_LANGS[k] && c.lg[k] !== ''; }); if (lgOn.length > 2) { return famBad(null, c.name + ': можно изучать не больше двух иностранных языков, а выбрано ' + lgOn.length + ' (' + lgOn.map(function(k){ return FAM_LANGS[k][0].toLowerCase(); }).join(', ') + '). У лишних выберите «Не изучать».', 'fkl' + lgOn[2] + i); }
      if (c.pinNew && !/^\d{4}$/.test(c.pinNew)) return famBad('fkp' + i, 'Код ребёнка ' + c.name + ' — ровно четыре цифры');
      if (!c.has && !c.pinNew) return famBad('fkp' + i, 'Придумайте код из четырёх цифр для ребёнка: ' + c.name); }
    if ((first || pp) && !/^\d{4}$/.test(pp)) return famBad('fkpp', 'Код родителя — ровно четыре цифры');
    var old = {}; (S.fam.kids || []).forEach(function(x){ old[x.id] = x; });
    var kids = L.map(function(c, j){ var id = c.id || ('k' + Date.now().toString(36) + j); var o = old[id] || {};
      var x = { id: id, name: c.name.slice(0, 20), age: c.age, sex: c.sex === 'f' ? 'f' : c.sex === 'm' ? 'm' : '', ints: c.ints || [], hero: (c.hero || '').slice(0, 80), books: (c.books || '').slice(0, 200), done: (c.done || '').slice(0, 300), rd: c.rd === '' || c.rd == null ? null : +c.rd, color: c.color || '', pin: c.pinNew ? hashPin(c.pinNew) : o.pin };
      FAM_QK.forEach(function(k){ var v = (c.q || {})[k]; x[k] = v === '' || v == null ? null : +v; }); x.lg = {}; Object.keys(c.lg || {}).forEach(function(k){ if (FAM_LANGS[k] && c.lg[k] !== '') x.lg[k] = +c.lg[k]; }); return x; });
    var ppin = pp ? hashPin(pp) : S.fam.ppin;
    kids.forEach(function(x){ pins.push(x.pin); }); pins.push(ppin);
    if (pins.filter(function(x, j){ return pins.indexOf(x) !== j; }).length) return famBad(null, 'Коды не должны совпадать: у каждого ребёнка и у родителя свой код');
    var gone = (S.fam.kids || []).filter(function(x){ return !kids.some(function(y){ return y.id === x.id; }); });
    gone.forEach(function(x){ delete S.kids[x.id]; });
    S.fam.kids = kids; S.fam.ppin = ppin; S.parentPin = ppin; famInit(); save();
    S.fam.kidsDirty = 1; save(); famKidsPush(true);
    cur.fk = null; alertMsg('Сохранено'); go('login');
    return true;
  }
  if (k === 'ffb') { var t = val('ffbt').trim(); if (!t) return true;
    famApi({ fam: 'fb', fid: S.fam.fid, token: S.fam.token, text: t.slice(0, 2000) }).then(function(){ alertMsg('Спасибо! Отзыв отправлен'); render(); }).catch(function(){ alertMsg('Нет связи. Попробуйте позже'); });
    return true; }
  return false;
}
/* ===== Синхронизация прогресса и сводка для родителей (22.11.2026) =====
   Прогресс ребёнка (снимок S.kids[id] + его журнал) уходит на сервер с устройства, где он занимается, — через 15 с после изменений и при сворачивании.
   Родитель на своём телефоне открывает «Для родителей» — снимки подтягиваются, отчёты показывают то же, что на планшете ребёнка.
   Правило: побеждает более новый снимок (K.modT). Устройство, ещё ни разу не сверившееся, свой непустой прогресс не отдаёт чужому — сначала отправляет его. */
var FSNAP = { ok: {}, pushed: {}, pulled: {}, chk: {}, timer: null, busy: false, at: 0 };
function famSnapOn(){ return !TEST && S.fam && S.fam.fid && !S.fam.off; }
function famSnapMark(kid){ var K = S.kids[kid]; if (!K || !famSnapOn() || FSNAP.busy) return;
  if (!FSNAP.ok[kid]) { if (snapWork(K) && K.modT) K.dirtyT = Date.now(); return; }
  K.modT = Date.now(); clearTimeout(FSNAP.timer); FSNAP.timer = setTimeout(famSnapPush, 15000); }
/* Явное действие родителя (цена приза, баллы, задание, время) на устройстве, где снимок уже загружен, — отправляем сразу */
function famSnapTouch(kid){ if (!famSnapOn() || !S.kids[kid] || !(FSNAP.ok[kid] || FSNAP.pulled[kid])) return; FSNAP.ok[kid] = true; S.kids[kid].modT = Date.now(); famSnapPush(); }
/* План и итог дня — для сводки на сервере */
function famDayInfo(kid){ var K = S.kids[kid]; if (!K || !KIDS[kid]) return null; var t = U.today(), keep = cur.ds, plan = [];
  try { cur.ds = t; var D = K.days[t] || { les: {} }; plan = todaySubjects(kid).map(function(s){ var L = D.les[s] || {}; return { n: String(subjName(kid, s, t)).replace(/^[^A-Za-zА-Яа-яЁё]+/, ''), st: L.phase === 'done' ? 'done' : L.phase ? 'go' : '', g: L.grade || '', sc: L.total ? L.score + '/' + L.total : '' }; }); } catch (e) {}
  cur.ds = keep; var D2 = K.days[t] || {}; return { d: t, plan: plan, pts: D2.pts || 0, coins: K.coins || 0, secs: D2.secs || 0 }; }
function famKidLog(kid){ var nm = KIDS[kid] && KIDS[kid].name; return S.log.filter(function(e){ return e.kid === nm; }).slice(-300); }
function famSnapPush(){ if (!famSnapOn() || !navigator.onLine) return Promise.resolve(); clearTimeout(FSNAP.timer);
  return Promise.all(Object.keys(FSNAP.ok).map(function(kid){ var K = S.kids[kid]; if (!K || !K.modT || FSNAP.pushed[kid] === K.modT) return null; var t = K.modT;
    return famApi({ fam: 'snap', fid: S.fam.fid, token: S.fam.token, kid: kid, t: t, state: JSON.stringify({ K: K, log: famKidLog(kid) }), day: famDayInfo(kid) })
      .then(function(j){ if (j && j.ok) FSNAP.pushed[kid] = t; }).catch(function(){}); })); }
function famLogMerge(log){ if (!log || !log.length) return; var have = {}; S.log.forEach(function(e){ have[e.t + '|' + e.kid + '|' + e.type + '|' + (e.q || '')] = 1; });
  log.forEach(function(e){ var k = e.t + '|' + e.kid + '|' + e.type + '|' + (e.q || ''); if (!have[k]) { S.log.push(e); have[k] = 1; } });
  S.log.sort(function(a, b){ return a.t < b.t ? -1 : a.t > b.t ? 1 : 0; }); if (S.log.length > 1500) S.log = S.log.slice(-1500); }
/* Подтянуть снимки. asKid — ребёнок вошёл на этом устройстве: после сверки устройство начинает отправлять свой прогресс */
function famSnapPull(ids, asKid){ if (!famSnapOn() || !navigator.onLine) return Promise.resolve(false);
  var have = {}; ids.forEach(function(k){ var K = S.kids[k]; if (K && K.modT) have[k] = Math.max(K.modT || 0, K.dirtyT || 0); });
  return famApi({ fam: 'snapget', fid: S.fam.fid, token: S.fam.token, kids: ids, have: have }).then(function(j){ if (!j || !j.ok) return false; var ch = false;
    (j.snaps || []).forEach(function(x){ var K = S.kids[x.kid]; if (!K || !x.state) return; var loc = Math.max(K.modT || 0, K.dirtyT || 0);
      if (!K.modT && snapWork(K) && asKid) return; /* первый раз на этом устройстве, и здесь уже есть свои занятия — свой прогресс не затираем */
      if (x.t <= loc) return; var R; try { R = JSON.parse(x.state); } catch (e) { return; } if (!R || !R.K || !R.K.days) return;
      var M = snapMerge(K, R.K, x.t); if (M === K) { famLogMerge(R.log); K.modT = Date.now(); if (asKid) FSNAP.ok[x.kid] = true; ch = true; return; } /* у себя сделано больше — своё не затираем, отправим его */
      R.K = M; FSNAP.busy = true; if (K.pin && !R.K.pin) R.K.pin = K.pin; S.kids[x.kid] = R.K; S.kids[x.kid].modT = x.t; FSNAP.pushed[x.kid] = x.t; famLogMerge(R.log); if (typeof posFix === 'function') try { posFix(x.kid); } catch (e) {} FSNAP.busy = false; ch = true; });
    ids.forEach(function(k){ FSNAP.pulled[k] = Date.now(); });
    if (asKid) ids.forEach(function(k){ var K = S.kids[k]; if (!K) return; FSNAP.ok[k] = true; if (!K.modT || (K.dirtyT && K.dirtyT > K.modT)) K.modT = Date.now(); delete K.dirtyT; });
    S.fam.snapAt = Date.now(); save(); if (asKid) famSnapPush(); return ch; }).catch(function(){ return false; }); }
/* Вход ребёнка: первая сверка сразу, дальше — раз в 3 минуты (вдруг родитель поменял цены призов или добавил время) */
function famSnapCheck(kid){ if (!kid || !famSnapOn()) return; var last = FSNAP.chk[kid] || 0; if (FSNAP.ok[kid] && Date.now() - last < 180000) return; FSNAP.chk[kid] = Date.now();
  return famSnapPull([kid], true).then(function(ch){ if (ch && cur.kid === kid) { var K = S.kids[kid]; if (cur.view === 'prizes' && K.prizesSet) go('home'); else if (cur.view !== 'lesson') render(); } }); }
/* Родитель открыл раздел — подтягиваем прогресс всех детей (не чаще раза в 20 секунд) */
function famParentPull(force){ if (!famSnapOn() || (!force && Date.now() - FSNAP.at < 20000)) return; FSNAP.at = Date.now();
  famSnapPull(kidIds(), false).then(function(ch){ if (cur.view === 'parent') { if (ch || force) render(); } }); }
/* Карточка «Сводка за сегодня» вверху отчёта */
var FSUM = { busy: false, res: null, err: '' };
function famSumCard(){ if (!S.fam || !S.fam.fid) return '';
  var r = FSUM.res, body = r ? '<p class="hint">' + U.esc(r.dayH) + ', на ' + U.esc(r.at) + '</p>' + r.kids.map(function(k){ return '<h3>' + U.esc(k.name) + '</h3>' + k.lines.map(function(l){ return '<p class="fsumln">' + U.esc(l) + '</p>'; }).join(''); }).join('') +
    '<div class="row"><button class="btn small ghost" data-act="fsummail"' + (FSUM.busy ? ' disabled' : '') + '>Прислать на почту</button></div>' : (FSUM.err ? '<p>' + U.esc(FSUM.err) + '</p>' : '<p class="hint">Что ребёнок сделал и чего не сделал на эту минуту: уроки, баллы, ошибки, чтение, «Не понимаю». Каждый вечер около 20:30 такая же сводка приходит на ' + U.esc(S.fam.email || 'почту') + (S.fam.sumOff ? ' (сейчас отключено в «Настройках»)' : '') + '.</p>');
  var sync = S.fam.snapAt ? '<p class="hint">Прогресс детей обновлён в ' + new Date(S.fam.snapAt).toTimeString().slice(0, 5) + '.</p>' : '';
  return '<div class="card fsum"><h2>Сводка за сегодня</h2>' + body + '<div class="row"><button class="btn small" data-act="fsum"' + (FSUM.busy ? ' disabled' : '') + '>' + (FSUM.busy ? 'Собираем…' : r ? 'Обновить' : 'Сводка сейчас') + '</button></div>' + sync + '</div>'; }
function famSumGet(mail){ if (FSUM.busy) return; FSUM.busy = true; FSUM.err = ''; render();
  var pre = []; try { pre.push(Promise.resolve(flush()).catch(function(){})); } catch (e) {} pre.push(famSnapPush());
  Promise.all(pre).then(function(){ return famApi({ fam: 'sum', fid: S.fam.fid, token: S.fam.token, mail: mail ? 1 : 0 }); }).then(function(j){ FSUM.busy = false;
    if (!j || !j.ok) { FSUM.err = j && j.off ? 'Доступ приостановлен.' : 'Не получилось собрать сводку. Проверьте интернет и попробуйте ещё раз.'; render(); return; }
    FSUM.res = j; render(); if (mail) alertMsg(j.mailed ? 'Сводка отправлена на ' + (S.fam.email || 'почту') : 'Письмо не ушло: ' + (j.mailErr || 'ошибка почты') + '. Сводка — на экране', 6000);
  }).catch(function(){ FSUM.busy = false; FSUM.err = 'Нет связи с сервером. Попробуйте ещё раз.'; render(); }); }
function famSumSet(on){ famApi({ fam: 'sumset', fid: S.fam.fid, token: S.fam.token, on: on ? 1 : 0 }).then(function(j){ if (j && j.ok) { S.fam.sumOff = !on; save(); render(); alertMsg(on ? 'Вечерняя сводка включена' : 'Вечерняя сводка отключена'); } else alertMsg('Не получилось. Попробуйте ещё раз'); }).catch(function(){ alertMsg('Нет связи. Попробуйте позже'); }); }
