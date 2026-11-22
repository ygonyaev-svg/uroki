/* Стихи: только общественное достояние (Пушкин, Лермонтов, Тютчев, Фет, Некрасов, Майков, Плещеев, Суриков, Есенин, народные).
   Поля: id, a — автор, t — название, k — кому ('y' Ярику, 'a' Ане, 'b' обоим), m — размер, r — схема рифм по строкам (x — без рифмы),
   st — слова с ударной буквой ЗАГЛАВНОЙ, e — картинка, learn — сколько строк учить наизусть (по умолчанию: Ярик 4, Аня 8). */
const POEMS = [
 { id:'veter', a:'А. С. Пушкин', t:'Ветер, ветер! Ты могуч…', k:'y', m:'хорей', e:'🌬️', r:'aabb', st:['вЕтер','могУч','гонЯешь','простОре'],
   text:'Ветер, ветер! Ты могуч,\nТы гоняешь стаи туч,\nТы волнуешь сине море,\nВсюду веешь на просторе.' },
 { id:'bozhkor', a:'Народная потешка', t:'Божья коровка', k:'y', m:'', e:'🐞', r:'xaabb', st:['корОвка','улетИ','горЕлого','бЕлого'],
   text:'Божья коровка,\nУлети на небо,\nПринеси нам хлеба,\nЧёрного и белого,\nТолько не горелого.' },
 { id:'travka', a:'А. Н. Плещеев', t:'Весна', k:'y', m:'хорей', e:'🐦', r:'xaxaxbxb', st:['зеленЕет','лАсточка','веснОю','сОлнышко'],
   text:'Травка зеленеет,\nСолнышко блестит;\nЛасточка с весною\nВ сени к нам летит.\nС нею солнце краше\nИ весна милей…\nПрощебечь с дороги\nНам привет скорей!' },
 { id:'osen_pl', a:'А. Н. Плещеев', t:'Осень наступила', k:'y', m:'хорей', e:'🍂', r:'ababcdcdefef', st:['наступИла','унЫло','желтЕет','дОждик'],
   text:'Осень наступила,\nВысохли цветы,\nИ глядят уныло\nГолые кусты.\nВянет и желтеет\nТравка на лугах,\nТолько зеленеет\nОзимь на полях.\nТуча небо кроет,\nСолнце не блестит,\nВетер в поле воет,\nДождик моросит…' },
 { id:'zima_sur', a:'И. З. Суриков', t:'Зима', k:'y', m:'хорей', e:'❄️', r:'xaxaxbxb', st:['пушИстый','кружИтся','ложИтся','забелЕло'],
   text:'Белый снег пушистый\nВ воздухе кружится\nИ на землю тихо\nПадает, ложится.\nИ под утро снегом\nПоле забелело,\nТочно пеленою\nВсё его одело.' },
 { id:'detstvo', a:'И. З. Суриков', t:'Детство', k:'y', m:'хорей', e:'🛷', r:'xaxaxbxb', st:['дерЕвня','сАнках','крутОй','сугрОб'],
   text:'Вот моя деревня;\nВот мой дом родной;\nВот качусь я в санках\nПо горе крутой;\nВот свернулись санки,\nИ я на бок — хлоп!\nКубарем качуся\nПод гору, в сугроб.' },
 { id:'mama_fet', a:'А. А. Фет', t:'Мама! глянь-ка из окошка…', k:'y', m:'хорей', e:'🐈', r:'aabccb', st:['окОшка','недАром','умывАла','посветлЕло'],
   text:'Мама! глянь-ка из окошка —\nЗнать, вчера недаром кошка\nУмывала нос:\nГрязи нет, весь двор одело,\nПосветлело, побелело —\nВидно, есть мороз.' },
 { id:'bereza', a:'С. А. Есенин', t:'Берёза', k:'y', m:'хорей', e:'🌳', r:'xaxaxbxb', st:['серебрОм','пушИстых','распустИлись','бахромОй'],
   text:'Белая берёза\nПод моим окном\nПринакрылась снегом,\nТочно серебром.\nНа пушистых ветках\nСнежною каймой\nРаспустились кисти\nБелой бахромой.' },
 { id:'solnyshko', a:'Народная потешка', t:'Солнышко-вёдрышко', k:'y', m:'', e:'☀️', r:'xxaa', st:['сОлнышко','окОшко','плАчут','кАмушкам'],
   text:'Солнышко-вёдрышко,\nВыгляни в окошко!\nТвои детки плачут,\nПо камушкам скачут.' },
 { id:'zima_ned', a:'Ф. И. Тютчев', t:'Зима недаром злится…', k:'b', m:'ямб', e:'🌱', r:'ababxcxc', st:['недАром','стучИтся','порА','засуетИлось'],
   text:'Зима недаром злится,\nПрошла её пора —\nВесна в окно стучится\nИ гонит со двора.\nИ всё засуетилось,\nВсё нудит Зиму вон —\nИ жаворонки в небе\nУж подняли трезвон.' },
 { id:'lukom', a:'А. С. Пушкин', t:'У лукоморья дуб зелёный…', k:'b', m:'ямб', e:'🐈‍⬛', r:'ababcdcd', st:['лукомОрья','налЕво','лЕший','русАлка','чудесА'],
   text:'У лукоморья дуб зелёный;\nЗлатая цепь на дубе том:\nИ днём и ночью кот учёный\nВсё ходит по цепи кругом;\nИдёт направо — песнь заводит,\nНалево — сказку говорит.\nТам чудеса: там леший бродит,\nРусалка на ветвях сидит…' },
 { id:'krest', a:'А. С. Пушкин', t:'Зима!.. Крестьянин, торжествуя…', k:'b', m:'ямб', e:'🐴', r:'ababccdd', st:['крестьЯнин','лошАдка','пушИстые','кибИтка'],
   text:'Зима!.. Крестьянин, торжествуя,\nНа дровнях обновляет путь;\nЕго лошадка, снег почуя,\nПлетётся рысью как-нибудь;\nБразды пушистые взрывая,\nЛетит кибитка удалая;\nЯмщик сидит на облучке\nВ тулупе, в красном кушаке.' },
 { id:'vody', a:'Ф. И. Тютчев', t:'Весенние воды', k:'b', m:'ямб', e:'💧', r:'abab', st:['белЕет','веснОй','шумЯт','бегУт'],
   text:'Ещё в полях белеет снег,\nА воды уж весной шумят —\nБегут и будят сонный брег,\nБегут, и блещут, и гласят…' },
 { id:'groza', a:'Ф. И. Тютчев', t:'Весенняя гроза', k:'b', m:'ямб', e:'⛈️', r:'ababcdcd', st:['грозУ','весЕнний','голубОм','грохОчет'],
   text:'Люблю грозу в начале мая,\nКогда весенний, первый гром,\nКак бы резвяся и играя,\nГрохочет в небе голубом.\nГремят раскаты молодые,\nВот дождик брызнул, пыль летит,\nПовисли перлы дождевые,\nИ солнце нити золотит.' },
 { id:'charod', a:'Ф. И. Тютчев', t:'Чародейкою Зимою…', k:'b', m:'хорей', e:'🌲', r:'abaab', st:['чародЕйкою','околдОван','бахромОю','неподвИжною'],
   text:'Чародейкою Зимою\nОколдован, лес стоит —\nИ под снежной бахромою,\nНеподвижною, немою,\nЧудной жизнью он блестит.' },
 { id:'nekr_loshad', a:'Н. А. Некрасов', t:'Мужичок с ноготок', k:'b', m:'амфибрахий', e:'🪵', r:'abab', st:['однАжды','хвОросту','лошАдка','мЕдленно'],
   text:'Однажды, в студёную зимнюю пору,\nЯ из лесу вышел; был сильный мороз.\nГляжу, поднимается медленно в гору\nЛошадка, везущая хворосту воз.' },
 { id:'osen_push', a:'А. С. Пушкин', t:'Уж небо осенью дышало…', k:'b', m:'ямб', e:'🦢', r:'aabbcddcee', learn:6, st:['Осенью','печАльным','тумАн','каравАн'],
   text:'Уж небо осенью дышало,\nУж реже солнышко блистало,\nКороче становился день,\nЛесов таинственная сень\nС печальным шумом обнажалась,\nЛожился на поля туман,\nГусей крикливых караван\nТянулся к югу: приближалась\nДовольно скучная пора;\nСтоял ноябрь уж у двора.' },
 { id:'parus', a:'М. Ю. Лермонтов', t:'Парус', k:'a', m:'ямб', e:'⛵', r:'ababcdcdefef', st:['одинОкий','тумАне','лазУри','мятЕжный'],
   text:'Белеет парус одинокий\nВ тумане моря голубом!..\nЧто ищет он в стране далёкой?\nЧто кинул он в краю родном?..\nИграют волны — ветер свищет,\nИ мачта гнётся и скрипит…\nУвы! он счастия не ищет\nИ не от счастия бежит!\nПод ним струя светлей лазури,\nНад ним луч солнца золотой…\nА он, мятежный, просит бури,\nКак будто в бурях есть покой!' },
 { id:'utes', a:'М. Ю. Лермонтов', t:'Утёс', k:'a', m:'хорей', e:'🪨', r:'abbacddc', st:['ночевАла','великАна','морщИне','одинОко'],
   text:'Ночевала тучка золотая\nНа груди утёса-великана;\nУтром в путь она умчалась рано,\nПо лазури весело играя;\nНо остался влажный след в морщине\nСтарого утёса. Одиноко\nОн стоит, задумался глубоко,\nИ тихонько плачет он в пустыне.' },
 { id:'utro', a:'А. С. Пушкин', t:'Зимнее утро', k:'a', m:'ямб', e:'🌅', r:'aabccbddeffe', learn:12, st:['чудЕсный','красАвица','сомкнУты','великолЕпными','прозрАчный'],
   text:'Мороз и солнце; день чудесный!\nЕщё ты дремлешь, друг прелестный —\nПора, красавица, проснись:\nОткрой сомкнуты негой взоры\nНавстречу северной Авроры,\nЗвездою севера явись!\nПод голубыми небесами\nВеликолепными коврами,\nБлестя на солнце, снег лежит;\nПрозрачный лес один чернеет,\nИ ель сквозь иней зеленеет,\nИ речка подо льдом блестит.' },
 { id:'vecher', a:'А. С. Пушкин', t:'Зимний вечер', k:'a', m:'хорей', e:'🌨️', r:'ababcdcd', st:['вИхри','крутЯ','обветшАлой','запоздАлый'],
   text:'Буря мглою небо кроет,\nВихри снежные крутя;\nТо, как зверь, она завоет,\nТо заплачет, как дитя,\nТо по кровле обветшалой\nВдруг соломой зашумит,\nТо, как путник запоздалый,\nК нам в окошко застучит.' },
 { id:'doroga', a:'А. С. Пушкин', t:'Зимняя дорога', k:'a', m:'хорей', e:'🛷', r:'ababcdcd', st:['волнИстые','пробирАется','однозвУчный','колокОльчик'],
   text:'Сквозь волнистые туманы\nПробирается луна,\nНа печальные поляны\nЛьёт печально свет она.\nПо дороге зимней, скучной\nТройка борзая бежит,\nКолокольчик однозвучный\nУтомительно гремит.' },
 { id:'osen_tut', a:'Ф. И. Тютчев', t:'Есть в осени первоначальной…', k:'a', m:'ямб', e:'🍁', r:'abab', st:['первоначАльной','корОткая','хрустАльный','лучезАрны'],
   text:'Есть в осени первоначальной\nКороткая, но дивная пора —\nВесь день стоит как бы хрустальный,\nИ лучезарны вечера…' },
 { id:'privet', a:'А. А. Фет', t:'Я пришёл к тебе с приветом…', k:'a', m:'хорей', e:'🌄', r:'ababcdcd', st:['привЕтом','горЯчим','затрепетАло','встрепенУлся'],
   text:'Я пришёл к тебе с приветом,\nРассказать, что солнце встало,\nЧто оно горячим светом\nПо листам затрепетало;\nРассказать, что лес проснулся,\nВесь проснулся, веткой каждой,\nКаждой птицей встрепенулся\nИ весенней полон жаждой…' },
 { id:'borod', a:'М. Ю. Лермонтов', t:'Бородино', k:'a', m:'ямб', e:'🎖️', r:'aabcccb', learn:7, st:['спалЁнная','францУзу','боевЫе','РоссИя'],
   text:'— Скажи-ка, дядя, ведь не даром\nМосква, спалённая пожаром,\nФранцузу отдана?\nВедь были ж схватки боевые,\nДа, говорят, ещё какие!\nНедаром помнит вся Россия\nПро день Бородина!' },
 { id:'ptichka', a:'А. С. Пушкин', t:'Птичка', k:'a', m:'ямб', e:'🕊️', r:'ababcdcd', st:['чужбИне','обЫчай','утешЕнью','даровАть'],
   text:'В чужбине свято наблюдаю\nРодной обычай старины:\nНа волю птичку отпускаю\nПри светлом празднике весны.\nЯ стал доступен утешенью;\nЗа что на Бога мне роптать,\nКогда хоть одному творенью\nЯ мог свободу даровать!' },
 { id:'moroz_v', a:'Н. А. Некрасов', t:'Мороз-воевода', k:'a', m:'амфибрахий', e:'🏔️', r:'abab', st:['бушУет','воевОда','дозОром','владЕнья'],
   text:'Не ветер бушует над бором,\nНе с гор побежали ручьи —\nМороз-воевода дозором\nОбходит владенья свои.' }
];
const PV = 'аеёиоуыэюя';
const pvN = w => String(w).toLowerCase().replace(/ё/g, 'е').replace(/[^а-я-]/g, '');
function poemList(kid){ const lv = T(kid) === 'anya' ? 'a' : 'y'; return POEMS.filter(p => p.k === 'b' || p.k === lv); }
function poemLines(p){ return p.text.split('\n'); }
function lastWord(line){ const w = line.split(/\s+/).map(x => x.replace(/[^А-Яа-яЁё-]/g, '').replace(/^-+|-+$/g, '')).filter(Boolean); return w[w.length - 1] || ''; }
function sylCount(w){ let n = 0; for (const c of w.toLowerCase()) if (PV.includes(c)) n++; return n; }
function stressMark(w){ const i = w.search(/[АЕИОУЫЭЮЯ]/), low = w.toLowerCase(); return i < 0 ? low : low.slice(0, i + 1) + '\u0301' + low.slice(i + 1); }
function sylSplit(word){ const s = word, out = []; let cur = '';
  const isV = c => PV.includes(c.toLowerCase());
  const idx = []; for (let i = 0; i < s.length; i++) if (isV(s[i])) idx.push(i);
  if (idx.length < 2) return [s];
  let start = 0;
  for (let k = 0; k < idx.length - 1; k++) { const a = idx[k], b = idx[k + 1], cons = b - a - 1; let cut = a + 1;
    if (cons >= 2) { cut = a + 2; if ('йЙ'.includes(s[a + 1]) || 'ьъ'.includes(s[a + 2])) cut = a + 2 + ('ьъ'.includes(s[a + 2]) ? 1 : 0); }
    if (cons === 1 && 'йЙьъ'.includes(s[a + 1])) cut = a + 2;
    out.push(s.slice(start, cut)); start = cut; }
  out.push(s.slice(start)); return out; }
function lineSyl(line){ const out = []; line.split(/\s+/).filter(Boolean).forEach((w, wi) => { const core = w.replace(/[^А-Яа-яЁё-]/g, ''); if (!core) return; sylSplit(core).forEach((sy, k) => { if (sylCount(sy)) out.push({ sy, w: wi, first: k === 0 }); else if (out.length) out[out.length - 1].sy += sy; }); }); return out; }
function meterHit(m, i){ return m === 'хорей' ? i % 2 === 0 : m === 'ямб' ? i % 2 === 1 : m === 'амфибрахий' ? i % 3 === 1 : m === 'дактиль' ? i % 3 === 0 : m === 'анапест' ? i % 3 === 2 : false; }
function rhymes(a, b){ a = pvN(a); b = pvN(b); if (!a || !b || a === b) return false; const tail = w => { let k = w.length - 1; while (k >= 0 && !PV.includes(w[k])) k--; return w.slice(Math.max(0, k - 1)); }; return a.slice(-2) === b.slice(-2) || tail(a) === tail(b); }
function poemPairs(p){ const L = poemLines(p), r = p.r || '', out = []; for (let i = 0; i < L.length; i++) { const c = r[i]; if (!c || c === 'x') continue; for (let j = i + 1; j < L.length; j++) if (r[j] === c) { out.push([i, j]); break; } } return out; }
function poemTasks(kid, p, seed){ const R = U.rng(seed), L = poemLines(p), pairs = R.shuffle(poemPairs(p)), girl = GIRL(kid), out = [];
  const others = R.shuffle(POEMS.filter(q => q.id !== p.id).map(q => poemLines(q).map(lastWord)).flat().filter(Boolean));
  const distract = (w, n) => { const res = []; for (const o of others) { if (res.length >= n) break; if (pvN(o) === pvN(w) || rhymes(o, w) || res.some(x => pvN(x) === pvN(o))) continue; res.push(o.toLowerCase()); } return res; };
  if (pairs[0]) { const [i, j] = pairs[0], w = lastWord(L[i]), a = lastWord(L[j]).toLowerCase(); out.push({ k: 'rhyme', q: `Найди рифму к слову «${w.toLowerCase()}»`, line: L[i], a, opts: R.shuffle([a, ...distract(a, 2)]) }); }
  const pf = pairs[1] || pairs[0]; if (pf) { const [i, j] = pf, a = lastWord(L[j]), blank = L[j].replace(new RegExp(a + '([^А-Яа-яЁё]*)$'), '…$1'); out.push({ k: 'finish', q: 'Закончи строчку в рифму', ctx: [L[i], blank], a: a.toLowerCase(), opts: R.shuffle([a.toLowerCase(), ...distract(a, 2)]) }); }
  if (!girl && pairs[2]) { const [i, j] = pairs[2], w = lastWord(L[i]), a = lastWord(L[j]).toLowerCase(); out.push({ k: 'rhyme', q: `Какое слово рифмуется со словом «${w.toLowerCase()}»?`, a, opts: R.shuffle([a, ...distract(a, 2)]) }); }
  const words = [...new Set(p.text.split(/\s+/).map(w => w.replace(/[^А-Яа-яЁё-]/g, '')).filter(w => sylCount(w) >= 2 && sylCount(w) <= 5))];
  if (words.length) { const w = R.pick(words), n = sylCount(w); const o = [...new Set([n - 1, n, n + 1].filter(x => x >= 1))]; out.push({ k: 'syl', q: `Сколько слогов в слове «${w.toLowerCase()}»? Прохлопай его!`, sy: sylSplit(w.toLowerCase()).join('-'), a: String(n), opts: o.map(String) }); }
  const sts = R.shuffle((p.st || []).filter(w => /[АЕИОУЫЭЮЯ]/.test(w) && sylCount(w) >= 2));
  sts.slice(0, girl ? 1 : 2).forEach(w => { const low = w.toLowerCase(), vs = []; for (let i = 0; i < low.length; i++) if (PV.includes(low[i]) && low[i] !== 'ё') vs.push(i);
    const variants = vs.map(i => low.slice(0, i) + low[i] + '́' + low.slice(i + 1)), a = stressMark(w); const opts = R.shuffle([a, ...R.shuffle(variants.filter(v => v !== a)).slice(0, 2)]);
    out.push({ k: 'stress', q: `Где ударение? Скажи слово вслух: «${low}»`, a, opts }); });
  if (girl && (p.m === 'ямб' || p.m === 'хорей')) { const li = R.int(0, Math.min(L.length, 4) - 1); out.push({ k: 'meter', q: 'Какой размер у этой строчки? Прочитай её, отстукивая ритм.', line: L[li], a: p.m, opts: ['ямб', 'хорей'] }); }
  return out; }
/* --- ударные слоги --- */
function stressLine(p, line){ const words = [], gs = []; let g = 0; line.split(/\s+/).filter(Boolean).forEach((tok, wi) => { const m = tok.match(/^([^А-Яа-яЁё]*)(.*?)([^А-Яа-яЁё]*)$/), core = m[2];
    const pre = U.esc(m[1]), post = U.esc(m[3]); if (!core || !sylCount(core)) { words.push({ wi, sy: [core], k: -1, pre, post }); return; }
    const sy = sylSplit(core), gi = sy.map(() => g++); sy.forEach((x, j) => gs.push({ sy: x, strong: meterHit(p.m, gi[j]) }));
    let k = -1; const n = pvN(core); const yo = sy.findIndex(x => /ё/i.test(x)); const ann = (p.st || []).find(a => pvN(a) === n);
    if (sy.length < 2) k = -1; else if (yo >= 0) k = yo; else if (ann) { const pos = ann.search(/[АЕИОУЫЭЮЯ]/); let c = 0; for (let j = 0; j < sy.length; j++) { c += sy[j].length; if (pos < c) { k = j; break; } } }
    else { const st = gi.map((x, j) => meterHit(p.m, x) ? j : -1).filter(j => j >= 0); if (st.length === 1) k = st[0]; }
    words.push({ wi, sy, k, pre, post }); });
  return { words, gs }; }
function stressLines(kid, p){ if (!p.m) return []; const L = poemLines(p), out = [], n = T(kid) === 'anya' ? 3 : 2; for (let i = 0; i < Math.min(L.length, 8) && out.length < n; i++) if (stressLine(p, L[i]).words.some(w => w.k >= 0)) out.push(i); return out; }
/* --- сессия на день --- */
function poemState(kid){ const K = S.kids[kid]; return K.poem || (K.poem = { i: 0, n: 0, learned: [] }); }
function poemCur(kid){ const st = poemState(kid), list = poemList(kid); return list[st.i % list.length]; }
function poemLearnN(kid, p){ return Math.min(poemLines(p).length, p.learn || (T(kid) === 'anya' ? 8 : 4)); }
function poemTile(kid, D){ if (cur.ds !== U.today()) return ''; const P = D.poem, p = P ? POEMS.find(x => x.id === P.id) : poemCur(kid), st = poemState(kid);
  const s = P && P.phase === 'done' ? 'done' : P ? 'go' : 'new';
  return `<button class="tile poemt ${s}" data-act="openpoem"><span class="ico">🎵</span><span class="tt"><span class="sn">Стихи</span><span class="ut">${s === 'done' ? `Сделано${P.coins ? ': +' + P.coins + ' баллов' : ''}${st.learned.length ? ' · наизусть: ' + st.learned.length : ''}` : `${p.e} ${U.esc(p.a)} «${U.esc(p.t)}» · рифма, слоги, наизусть. До +5${st.learned.includes(p.id) ? '' : ', наизусть +10'}`}</span></span>${P && P.grade ? `<span class="mark m${P.grade}">${P.grade}</span>` : ''}</button>`; }
function poemOpen(kid){ const D = dayRec(kid, cur.ds); if (!D.poem) { if (restAsk(kid)) { go('home'); alertMsg('Сначала ответь: устал или готов ещё? 🙂'); return; } if (restLeft(kid)) { alertMsg(`Перерыв ☕ Следующее занятие откроется в ${hhmm(S.kids[kid].restUntil)}`); return; }
    const p = poemCur(kid), st = poemState(kid); st.n = (st.n || 0) + 1; D.poem = { id: p.id, phase: 'read', i: 0, ans: [], t0: Date.now(), hide: 0, seed: U.h(kid + cur.ds + p.id + st.n) }; save(); }
  go('poem'); }
function poemSteps(kid){ return T(kid) === 'anya' ? [['read', 'Читаю'], ['tasks', 'Рифма и ритм'], ['stress', 'Ударение'], ['compose', 'Мои строки'], ['learn', 'Наизусть'], ['done', 'Итог']] : [['read', 'Читаю'], ['tasks', 'Рифма и слоги'], ['stress', 'Ударение'], ['learn', 'Наизусть'], ['done', 'Итог']]; }
function vPoem(){ const kid = cur.kid, D = dayRec(kid, cur.ds), P = D.poem; if (!P) return vHome(); const p = POEMS.find(x => x.id === P.id) || poemCur(kid), L = poemLines(p), girl = GIRL(kid);
  const steps = poemSteps(kid), ix = steps.findIndex(s => s[0] === P.phase);
  const head = `<main class="wrap ${LK(kid)}"><header class="bar"><button class="link" data-act="home">← К урокам</button><span class="coins">${coinsHtml(S.kids[kid].coins)}</span></header><section class="lesson poem"><p class="eyebrow">🎵 Стихи</p><h1>${p.e} ${U.esc(p.t)}</h1><p class="author">${U.esc(p.a)}</p><ol class="steps">${steps.map((s, i) => `<li class="${i < ix ? 'ok' : ''} ${i === ix ? 'now' : ''}">${s[1]}</li>`).join('')}</ol>`;
  const end = '</section></main>';
  if (P.phase === 'read') return head + `<article class="card"><div class="ptext">${L.map(l => `<p>${U.esc(l)}</p>`).join('')}</div><button class="btn ghost small" data-act="psay">🔊 Послушать</button>${girl ? '' : ` <button class="btn ghost small" data-act="psyl">${P.syl ? 'Обычно' : 'По слогам'}</button>`}</article>
   ${P.syl ? `<article class="card"><div class="ptext syl">${L.map(l => `<p>${l.split(/\s+/).map(w => { const c = w.replace(/[^А-Яа-яЁё-]/g, ''); return c ? U.esc(w.replace(c, sylSplit(c).join('-'))) : U.esc(w); }).join(' ')}</p>`).join('')}</div></article>` : ''}
   <article class="card"><h2>${girl ? 'Как читать стихи' : 'Как читать стихи'}</h2><p>Сначала послушай. Потом прочитай вслух <b>два раза</b>: не торопись, на конце строчки — маленькая пауза. Слова в конце строчек звучат похоже — это <b>рифма</b>.</p>${girl ? '<p class="hint">Ударные и безударные слоги в стихах чередуются ровно, как шаги. <b>Хорей</b> — ТА-та (ударный первый): «Бу́ря мгло́ю не́бо кро́ет». <b>Ямб</b> — та-ТА (ударный второй): «Моро́з и со́лнце; де́нь чуде́сный».</p>' : '<p class="hint">Слог — это кусочек слова с одной гласной. Сколько гласных — столько слогов: «ко-ров-ка» — три слога. Ударный слог мы говорим громче.</p>'}</article>
   <button class="btn big" data-act="ptasks">Я прочитал${girl ? 'а' : ''} вслух 2 раза</button>` + end;
  if (P.phase === 'tasks') { const T0 = poemTasks(kid, p, P.seed), i = P.i, q = T0[i], a = P.ans[i] || {};
    if (!q) { P.phase = 'stress'; save(); return vPoem(); }
    return head + `<div class="counter">Задание ${i + 1} из ${T0.length}</div><article class="card task"><div class="q">${U.esc(q.q)}</div>${q.line ? `<p class="pline">«${U.esc(q.line)}»</p>` : ''}${q.ctx ? `<div class="ptext">${q.ctx.map(l => `<p>${U.esc(l)}</p>`).join('')}</div>` : ''}
     <div class="opts">${q.opts.map(o => `<button class="opt ${a.v != null && o === q.a ? 'right' : a.v === o && !a.ok ? 'wrong' : ''}" data-act="pq" data-v="${U.esc(o)}" ${a.v != null ? 'disabled' : ''}>${U.esc(o)}</button>`).join('')}</div>
     ${a.v != null ? (a.ok ? `<div class="fb ok"><b>Верно!</b>${q.sy ? ' ' + U.esc(q.sy) : ''}</div>` : `<div class="fb bad"><b>Правильно: ${U.esc(q.a)}</b>${q.sy ? ' (' + U.esc(q.sy) + ')' : ''}</div>`) : '<p class="hint">Засчитывается только первый ответ.</p>'}</article>${a.v != null ? '<button class="btn big" data-act="pnext">Дальше</button>' : ''}` + end; }
  if (P.phase === 'clap') P.phase = 'stress';
  if (P.phase === 'stress') { const LS = stressLines(kid, p); if (!LS.length) { P.phase = girl ? 'compose' : 'learn'; save(); return vPoem(); }
    const li = Math.min(LS.length - 1, P.sl || 0), info = stressLine(p, L[LS[li]]), sa = P.sa || {}, need = info.words.filter(w => w.k >= 0), done = need.every(w => sa[LS[li] + ':' + w.wi]);
    const tile = w => { if (w.k < 0) return `<span class="sw plain">${w.pre}${w.sy.map(x => U.esc(x)).join('')}${w.post}</span>`; const a = sa[LS[li] + ':' + w.wi];
      return `<span class="sw">${w.pre}${w.sy.map((x, j) => `<button class="sst ${a ? (j === w.k ? 'right' : j === a.v ? 'wrong' : '') : ''}" data-act="pst" data-w="${w.wi}" data-s="${j}" ${a ? 'disabled' : ''}>${U.esc(x)}</button>`).join('')}${w.post}</span>`; };
    const rh = done ? `<div class="rhythm"><div class="rline">${info.gs.map((g, i) => `<span class="${g.strong ? 'rs' : 'rw'}">${U.esc(g.strong ? g.sy.toUpperCase() : g.sy.toLowerCase())}</span>`).join('<i>·</i>')}</div><p class="rpat">${info.gs.map(g => g.strong ? '<b>ТА</b>' : 'та').join('-')}</p><p class="hint">${girl ? `Ударные слоги стоят на своих местах: это <b>${U.esc(p.m)}</b>. ${p.m === 'ямб' ? 'Ударный — каждый второй слог: та-ТА.' : p.m === 'хорей' ? 'Ударный — каждый первый из пары: ТА-та.' : 'Ударный — один слог из трёх.'}` : 'Видишь? Громкие слоги идут ровно, как шаги. Это и есть ритм стиха.'}</p></div>` : '';
    return head + `<article class="card"><h2>🎯 Найди ударные слоги</h2><p class="hint">Нажми на слог, который в слове звучит громче (ударный). Скажи слово вслух — так легче. Серые слова пропускаем.</p>
     <div class="sline">${info.words.map(tile).join(' ')}</div>
     <p class="center hint">Строчка ${li + 1} из ${LS.length}</p>${sayGate('pl' + LS[li], '<button class="btn ghost small" data-act="psayline">🔊 Послушать строчку</button>')}${rh}</article>
     ${done ? `<button class="btn big" data-act="psnext">Дальше</button>` : '<p class="hint center">Засчитывается только первое нажатие.</p>'}` + end; }
  if (P.phase === 'compose') { const pr = poemPairs(p)[0] || [0, 1], line = L[pr[0]], w = lastWord(line);
    return head + `<article class="card"><h2>✍️ Сочини свою строчку</h2><p>Придумай <b>свою</b> вторую строчку, чтобы она рифмовалась со строчкой:</p><p class="pline">«${U.esc(line)}»</p><p class="hint">Последнее слово должно звучать похоже на «${U.esc(w.toLowerCase())}». ${p.m === 'ямб' || p.m === 'хорей' ? 'Попробуй сохранить ' + p.m + '.' : ''}</p>
     <textarea id="pcomp" rows="3" placeholder="Моя строчка…">${U.esc(P.comp || '')}</textarea>${P.compRes ? `<div class="fb ${P.compRes === 'ok' ? 'ok' : 'try'}">${P.compRes === 'ok' ? '<b>Есть рифма!</b> Красиво.' : 'Рифма не слышна. Попробуй другое последнее слово — или оставь так.'}</div>` : ''}</article>
     <button class="btn big" data-act="pcomp">${P.compRes ? 'Дальше' : 'Проверить'}</button>` + end; }
  if (P.phase === 'learn') { const n = poemLearnN(kid, p), LL = L.slice(0, n), h = P.hide || 0, live = RT && RT.active;
    const hideW = (w, i) => { const c = w.replace(/[^А-Яа-яЁё-]/g, ''); if (!c || h === 0) return U.esc(w); if (h === 1 && i % 3 !== 2) return U.esc(w); if (h === 2 && i % 2 === 0) return U.esc(w); return U.esc(w.replace(c, c[0] + '…')); };
    return head + `<article class="card"><h2>🧠 Учим наизусть</h2><p>Выучи ${n === L.length ? 'всё стихотворение' : 'первые ' + n + ' ' + U.pl(n, 'строчку', 'строчки', 'строчек')}. Прочитай, потом нажимай «Спрятать слова» и рассказывай по памяти.</p>
     <div class="learnt ${P.reciting && !P.peek ? 'hid' : ''}"><p class="hidmsg">🙈 Текст спрятан — рассказывай по памяти.</p><div class="ptext">${LL.map((l, li) => `<p>${l.split(/\s+/).map((w, wi) => { const x = hideW(w, wi); return P.recBad && P.recBad[li] && P.recBad[li].includes(wi) ? `<span class="rbad">${x}</span>` : x; }).join(' ')}</p>`).join('')}</div>${P.recBad && Object.keys(P.recBad).length ? '<p class="hint"><span class="rbad">Подчёркнутые</span> слова не услышаны — повтори их.</p>' : ''}</div>
     <div class="row">${P.reciting ? `<button class="btn ghost small" data-act="ppeek">${P.peek ? '🙈 Спрятать текст' : '💡 Подсказка'}</button>` : `<button class="btn ghost small" data-act="phide">${h < 3 ? 'Спрятать слова' : 'Показать всё'}</button> <button class="btn ghost small" data-act="psayl">🔊 Послушать</button>`}</div></article>
     <article class="card"><h2>Расскажи наизусть</h2><p class="hint">${SR ? 'Нажми 🎤 и расскажи. Или нажми на поле и надиктуй микрофоном на клавиатуре.' : 'Нажми на поле и надиктуй стих микрофоном на клавиатуре (кнопка 🎤 рядом с пробелом) — или напиши его.'}</p>
     <textarea id="prec" rows="5" placeholder="Расскажи стих…">${U.esc(P.rec || '')}</textarea>
     <div class="row">${SR ? `<button class="btn ${live ? 'stop' : 'mic'}" data-act="${live ? 'precstop' : 'precgo'}">${live ? '⏹ Стоп' : '🎤 Рассказать'}</button> ` : ''}<button class="btn" data-act="pcheck">Проверить</button></div>
     ${P.recRes != null ? `<div class="fb ${P.recRes >= .85 ? 'ok' : 'try'}">${P.recRes >= .85 ? `<b>Наизусть! ${Math.round(P.recRes * 100)}%</b>` : `Совпало ${Math.round(P.recRes * 100)}% слов. Повтори ещё — нужно 85%.`}${P.recMiss && P.recMiss.length && P.recRes < .85 ? `<br><span class="hint">Не услышано: ${P.recMiss.slice(0, 8).map(U.esc).join(', ')}</span>` : ''}</div>` : ''}</article>
     <button class="btn big" data-act="pfinish">${P.recRes >= .85 ? 'Закончить' : 'Закончить (выучу потом)'}</button>` + end; }
  /* done */
  const st = poemState(kid);
  return head + `<article class="card win"><h2>Готово!</h2><p>Задания: <b>${P.score || 0} из ${P.total || 0}</b> с первого раза.</p><p>${P.coins ? `+${P.coins} ${U.pl(P.coins, 'балл', 'балла', 'баллов')} в копилку 🐷` : 'В этот раз без баллов — нужно больше верных ответов.'}</p>${P.learnedNow ? `<p>🏅 Стих выучен наизусть! +10 баллов.</p>` : st.learned.includes(p.id) ? '' : '<p class="hint">Наизусть ещё не выучено — завтра продолжим этот же стих.</p>'}<p class="hint">Знаю наизусть: ${st.learned.length ? st.learned.map(id => { const q = POEMS.find(x => x.id === id); return q ? '«' + U.esc(q.t) + '»' : ''; }).join(', ') : 'пока ничего'}.</p></article>
   <button class="btn big" data-act="home">К урокам</button>` + end; }
/* Проверка наизусть: по строкам, слова сравниваются «по звучанию» — распознавание речи часто путает окончания и похожие слова. */
function recPh(w){ w = pvN(w).replace(/-/g, ''); return w.replace(/[ьъ]/g, '').replace(/[ёо]/g, 'а').replace(/[еэяиы]/g, 'и').replace(/ю/g, 'у').replace(/тс|дс|тьс/g, 'ц').replace(/(.)\1/g, '$1').replace(/[бвгдзж]$/, c => 'пфктсш'['бвгдзж'.indexOf(c)]); }
function recLev(a, b){ if (Math.abs(a.length - b.length) > 3) return 9; let p = []; for (let j = 0; j <= b.length; j++) p[j] = j;
  for (let i = 1; i <= a.length; i++) { const c = [i]; for (let j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[b.length]; }
function recSame(w, g){ if (!w || !g) return false; if (pvN(w).replace(/ё/g, 'е') === pvN(g).replace(/ё/g, 'е')) return true; const a = recPh(w), b = recPh(g); if (a === b) return true;
  const sh = Math.min(a.length, b.length), lg = Math.max(a.length, b.length); if (sh >= 3 && lg - sh <= 3 && (a.startsWith(b) || b.startsWith(a))) return true;
  return recLev(a, b) <= (lg <= 3 ? 0 : lg <= 4 ? 1 : a[0] === b[0] ? 2 : 1) + (sh >= 5 && a.slice(0, 3) === b.slice(0, 3) ? 1 : 0); }
function recLcs(T, G){ const n = T.length, m = G.length, d = []; for (let i = 0; i <= n; i++) { d[i] = []; for (let j = 0; j <= m; j++) d[i][j] = i && j ? (recSame(T[i - 1], G[j - 1]) ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1])) : 0; }
  const hit = new Array(n).fill(false); let i = n, j = m; while (i && j) { if (recSame(T[i - 1], G[j - 1]) && d[i][j] === d[i - 1][j - 1] + 1) { hit[i - 1] = true; i--; j--; } else if (d[i - 1][j] >= d[i][j - 1]) i--; else j--; } return hit; }
function poemRecScore(p, n, said){ const got = String(said).split(/\s+/).map(pvN).filter(Boolean); let hit = 0, tot = 0; const miss = [], bad = {};
  /* слова через дефис и слитные («солнышко-вёдрышко», «глянь-ка», «недаром») распознавание часто пишет двумя словами — склеиваем */
  poemLines(p).slice(0, n).join(' ').split(/\s+/).map(pvN).filter(w => w.includes('-') || w.length >= 6).forEach(h => { for (let i = 0; i + 1 < got.length; i++) if (!recSame(got[i], h) && recSame(got[i] + got[i + 1], h)) got.splice(i, 2, got[i] + got[i + 1]); });
  poemLines(p).slice(0, n).forEach((line, li) => { const raw = line.split(/\s+/), T0 = raw.map(pvN), idx = T0.map((w, i) => w ? i : -1).filter(i => i >= 0), T = idx.map(i => T0[i]); if (!T.length) return;
    const W = Math.ceil(T.length * 1.6) + 3; let best = null, bn = -1;
    for (let st = 0; st < Math.max(1, got.length - Math.min(W, got.length) + 1); st++) { const h = recLcs(T, got.slice(st, st + W)), c = h.filter(Boolean).length; if (c > bn) { bn = c; best = h; } if (c === T.length) break; }
    /* однобуквенные «и», «в», «с» распознавание часто теряет — их пропуск не считаем ошибкой */
    tot += T.length; hit += bn; best.forEach((ok, k) => { if (!ok) { if (T[k].replace(/-/g, '').length <= 1) { tot--; return; } miss.push(T[k]); (bad[li] = bad[li] || []).push(idx[k]); } }); });
  return { s: hit / Math.max(1, tot), miss, bad }; }
function poemFinish(kid){ const D = dayRec(kid, cur.ds), P = D.poem, K = S.kids[kid], p = POEMS.find(x => x.id === P.id), st = poemState(kid);
  const T0 = poemTasks(kid, p, P.seed), first = P.ans.filter(a => a && a.ok).length + (P.sOk || 0), tot = T0.length + (P.sN || 0), ratio = first / Math.max(1, tot);
  P.score = first; P.total = tot; P.grade = grade(ratio); P.secs = Math.min(1200, Math.round((Date.now() - P.t0) / 1000));
  let pts = ratio >= .8 ? 5 : ratio >= .6 ? 3 : 0; if (P.secs < 120) pts = Math.round(pts / 2);
  if (P.recRes >= .85 && !st.learned.includes(p.id)) { st.learned.push(p.id); pts += 10; P.learnedNow = true; ev(kid, 'стих наизусть', { subj: 'Стихи', unit: p.a + ' «' + p.t + '»', text: Math.round(P.recRes * 100) + '% слов' }); }
  if (st.learned.includes(p.id) || st.n >= 3) { st.i = (st.i || 0) + 1; st.n = 0; }
  pts = piggyAdd(K, pts); P.coins = pts; D.secs = (D.secs || 0) + P.secs; restTick(kid, P.secs); P.phase = 'done';
  ev(kid, 'стихи', { subj: 'Стихи', unit: p.a + ' «' + p.t + '»', score: `${first}/${T0.length}`, grade: P.grade, secs: P.secs, text: `+${pts} баллов` + (P.comp ? '; своя строчка: ' + P.comp : '') });
  save(); render(); window.scrollTo(0, 0); }
function poemAct(act, b){ if (cur.view !== 'poem' && act !== 'openpoem') return false; const kid = cur.kid; if (act === 'openpoem') { poemOpen(kid); return true; }
  const D = dayRec(kid, cur.ds), P = D.poem; if (!P) return false; const p = POEMS.find(x => x.id === P.id), girl = GIRL(kid);
  switch (act) {
    case 'psay': say(p.text.replace(/\n/g, '. '), 'ru-RU'); break;
    case 'psayl': say(poemLines(p).slice(0, poemLearnN(kid, p)).join('. '), 'ru-RU'); break;
    case 'ppeek': P.peek = !P.peek; if (P.peek) P.hint = (P.hint || 0) + 1; save(); render(); break;
    case 'psyl': P.syl = !P.syl; save(); render(); break;
    case 'ptasks': if (Date.now() - P.t0 < 25000) { alertMsg('Сначала прочитай стих вслух два раза 🙂'); break; } P.phase = 'tasks'; P.i = 0; save(); render(); window.scrollTo(0, 0); break;
    case 'pq': { const T0 = poemTasks(kid, p, P.seed), q = T0[P.i]; if (!q || P.ans[P.i]) break; const ok = b.dataset.v === q.a; P.ans[P.i] = { v: b.dataset.v, ok };
      ev(kid, 'ответ', { subj: 'Стихи', unit: p.t, q: q.q, ans: b.dataset.v, right: q.a, ok: ok ? 'верно' : 'ошибка' }); save(); render(); break; }
    case 'pnext': P.i++; if (P.i >= poemTasks(kid, p, P.seed).length) { P.phase = 'stress'; P.sl = 0; P.sa = {}; } save(); render(); window.scrollTo(0, 0); break;
    case 'pst': { const LS = stressLines(kid, p), li = LS[Math.min(LS.length - 1, P.sl || 0)]; if (li == null) break; const info = stressLine(p, poemLines(p)[li]), w = info.words.find(x => x.wi === +b.dataset.w); P.sa = P.sa || {};
      const key = li + ':' + w.wi; if (!w || w.k < 0 || P.sa[key]) break; const v = +b.dataset.s, ok = v === w.k; P.sa[key] = { v, ok }; P.sN = (P.sN || 0) + 1; if (ok) P.sOk = (P.sOk || 0) + 1;
      ev(kid, 'ответ', { subj: 'Стихи', unit: p.t, q: 'Ударный слог: ' + w.sy.join('-'), ans: w.sy[v], right: w.sy[w.k], ok: ok ? 'верно' : 'ошибка' }); save(); render(); break; }
    case 'psayline': { const LS = stressLines(kid, p), li = LS[Math.min(LS.length - 1, P.sl || 0)]; if (li != null) say(poemLines(p)[li], 'ru-RU'); break; }
    case 'psnext': { const LS = stressLines(kid, p); P.sl = (P.sl || 0) + 1; if (P.sl >= LS.length) { P.phase = girl ? 'compose' : 'learn'; if (P.sN) alertMsg(`Ударные слоги: ${P.sOk || 0} из ${P.sN} 🎯`); } save(); render(); window.scrollTo(0, 0); break; }
    case 'pcomp': { const el = document.getElementById('pcomp'); const v = el ? el.value.trim() : '';
      if (P.compRes) { P.phase = 'learn'; save(); render(); window.scrollTo(0, 0); break; }
      if (v.split(/\s+/).length < 3) { alertMsg('Напиши целую строчку — хотя бы 3 слова'); break; }
      const pr = poemPairs(p)[0] || [0, 1], w = lastWord(poemLines(p)[pr[0]]); P.comp = v; P.compRes = rhymes(lastWord(v), w) ? 'ok' : 'no'; save(); render(); break; }
    case 'phide': P.hide = ((P.hide || 0) + 1) % 4; save(); render(); break;
    case 'precgo': { const el = document.getElementById('prec'); if (el) el.value = ''; P.rec = ''; P.recRes = null; P.recMiss = null; P.recBad = null; P.reciting = true; P.peek = false; save(); retellStartFor('prec'); break; }
    case 'precstop': { if (RT) { RT.active = false; try { RT.rec && RT.rec.stop(); } catch (e) {} P.rec = RT.text; RT = null; } save(); render(); break; }
    case 'pcheck': { if (RT) { RT.active = false; try { RT.rec && RT.rec.stop(); } catch (e) {} RT = null; } const el = document.getElementById('prec'); P.rec = el ? el.value : P.rec || ''; const r = poemRecScore(p, poemLearnN(kid, p), P.rec); P.recRes = r.s; P.recMiss = r.miss; P.recBad = r.bad; P.reciting = false; P.peek = false; if (P.hint) ev(kid, 'подсказка наизусть', { subj: 'Стихи', unit: p.t }); P.hint = 0; save(); render(); break; }
    case 'pfinish': { const el = document.getElementById('prec'); if (el) P.rec = el.value; if (RT) { RT.active = false; try { RT.rec && RT.rec.stop(); } catch (e) {} RT = null; } poemFinish(kid); break; }
    default: return false;
  }
  return true; }
/* Голосовой ввод в произвольное поле (тот же механизм, что у пересказа) */
function retellStartFor(id){ const ta = document.getElementById(id), had = ta ? ta.value.trim() : '';
  const R0 = RT = { active: true, base: had, cur: '', text: had, t0: Date.now() };
  const rec = new SR(); rec.lang = 'ru-RU'; rec.continuous = true; rec.interimResults = true; R0.rec = rec;
  rec.onresult = e => { let s = ''; for (let i = 0; i < e.results.length; i++) s += ' ' + e.results[i][0].transcript; R0.cur = s; R0.text = (R0.base + ' ' + s).trim(); const el = document.getElementById(id); if (el) el.value = R0.text; };
  rec.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') R0.denied = true; };
  rec.onend = () => { R0.base += ' ' + R0.cur; R0.cur = ''; if (R0.active && !R0.denied) setTimeout(() => { try { rec.start(); } catch (e) {} }, 120); };
  try { rec.start(); } catch (e) {}
  render(); }

/* Поле «Расскажи наизусть»: как только ребёнок начал отвечать — текст стиха прячется (показ только по «Подсказке»). */
document.addEventListener('focusin', e => { if (!e.target || e.target.id !== 'prec' || cur.view !== 'poem') return; try { const P = dayRec(cur.kid, cur.ds).poem; if (P && !P.reciting) { P.reciting = true; P.peek = false; save(); const d = document.querySelector('.learnt'); if (d) d.classList.add('hid'); } } catch (x) {} });
