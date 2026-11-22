/* ===== Раздел «Для родителей» (22.11): главный экран из крупных кнопок, подробности — на подэкранах.
   Сценарий: занятой родитель с телефона за 1–2 минуты. Совет: ChatGPT + Gemini + наш взгляд.
   Экраны (cur.parentTab): home — дети и кнопки; sum — сводка; tasks — дать задание; ok — подтвердить (задания и цены призов);
   time — время; coins — баллы; report — учёба подробно; portrait — портрет; set — настройки.
   Старые ключи вкладок ('shop') ведут на новые экраны. */
const PP_OLD = { shop: 'ok' };
const PP_PRICES = [30, 60, 150, 300, 700];
const PP_PTS = [5, 10, 20, 50];
const PP_WHY = ['Помощь по дому', 'Старание', 'Хорошее поведение', 'Плохое поведение', 'Без причины'];
function ppKid(){ if (!KIDS[cur.parentKid]) cur.parentKid = kidIds()[0] || null; return cur.parentKid; }
function ppToday(kid){ const K = S.kids[kid], t = U.today(), D = K.days && K.days[t], order = KIDS[kid].order || [];
  const done = order.filter(s => D && D.les && D.les[s] && D.les[s].phase === 'done'), left = order.filter(s => done.indexOf(s) < 0);
  const pts = K.dg && K.dg.d === t ? K.dg.n : 0, name = KIDS[kid].name;
  const evs = S.log.filter(e => e.kid === name && String(e.t).slice(0, 10) === t);
  const last = evs.length ? new Date(evs[evs.length - 1].t).getTime() : 0;
  return { done, left, n: order.length, pts, evs, last }; }
function ppSubj(kid, s){ if (s === 'read') return 'чтение'; if (s === 'hw') return 'домашнее задание'; const c = KIDS[kid].cur[s]; return c ? U.noEmo(c.name).toLowerCase() : s; }
function ppWaitN(kid){ const K = S.kids[kid]; return { pr: (K.shop || []).filter(x => x.price == null).length, pt: typeof ptOf === 'function' ? ptOf(kid, ['wait']).length : 0 }; }
function ppWait(kid){ const w = ppWaitN(kid); return w.pr + w.pt; }
/* Состояние ребёнка одной строкой */
function ppState(kid){ const T0 = ppToday(kid), g = GIRL(kid);
  if (restLeft(kid)) return 'отдыхает до ' + hhmm(S.kids[kid].restUntil);
  if (T0.last && Date.now() - T0.last < 10 * 60000) return 'занимается сейчас';
  if (T0.n && T0.done.length >= T0.n) return 'день выполнен';
  const fin = T0.evs.filter(e => e.type === 'урок завершён').pop(); if (fin) return 'закончил' + (g ? 'а' : '') + ': ' + U.noEmo(fin.subj).toLowerCase() + ', ' + hhmm(new Date(fin.t).getTime());
  if (T0.last) return 'последний раз в ' + hhmm(T0.last);
  return 'сегодня ещё не занимал' + (g ? 'ась' : 'ся'); }
function ppKidCard(k, on){ const T0 = ppToday(k), w = ppWait(k), K = S.kids[k];
  return `<button class="pp-kid${on ? ' on' : ''}" data-act="pkid" data-k="${k}"><span class="pp-kn">${U.esc(KIDS[k].name)}${w ? `<span class="pp-dot" aria-label="ждёт вас">${w}</span>` : ''}</span>
    <span class="pp-ks">Уроки <b>${T0.done.length} из ${T0.n}</b> · сегодня <b>+${T0.pts}</b> · на счету <b>${K.coins}</b></span><span class="pp-kst">${ppState(k)}</span></button>`; }
function ppTile(act, ic, title, sub, badge, wide){ return `<button class="pp-tile${wide ? ' wide' : ''}" data-act="ptab" data-t="${act}">${icon(ic)}<span class="pp-tt">${title}</span><span class="pp-ts">${sub}</span>${badge ? `<span class="pp-badge">${badge}</span>` : ''}</button>`; }
function ppHead(title, back){ const k = cur.parentKid, many = kidIds().length > 1;
  return `<header class="bar"><button class="link" data-act="${back ? 'ptab' : 'logout'}" data-t="home">${back ? '← Назад' : '← Выйти'}</button><span>${title}</span>${back ? '' : `<button class="pp-gear" data-act="ptab" data-t="set" aria-label="Настройки">${icon('gear')}</button>`}</header>` +
    (back && many && k && cur.parentTab !== 'set' && !(FAM && cur.parentTab === 'sum') ? `<div class="row pp-sw">${kidIds().map(x => `<button class="chip ${x === k ? 'on' : ''}" data-act="pkid" data-k="${x}">${U.esc(KIDS[x].name)}${ppWait(x) ? ' •' : ''}</button>`).join('')}</div>` : ''); }
function vParent(){
  if (FAM) famParentPull();
  let tab = PP_OLD[cur.parentTab] || cur.parentTab || 'home'; cur.parentTab = tab;
  const k = ppKid();
  if (!k) return `<main class="wrap pp">${ppHead('Родителям')}<div class="card"><p>Детей пока нет.</p>${FAM ? '<button class="btn" data-act="fkedit">Добавить детей</button>' : ''}</div></main>`;
  const titles = { sum: 'Сводка', tasks: 'Дать задание', ok: 'Проверить', time: 'Время', coins: 'Баллы', report: 'Учёба', portrait: 'Развитие', set: 'Настройки' };
  if (!titles[tab]) tab = cur.parentTab = 'home';
  if (tab === 'home') {
    const K = S.kids[k], T0 = ppToday(k), w = ppWait(k), n = typeof ptOf === 'function' ? ptOf(k, ['new']).length : 0, x = extraSecs(K) / 60;
    return `<main class="wrap pp">${ppHead('Родителям')}<div class="pp-kids">${kidIds().map(x => ppKidCard(x, x === k)).join('')}</div>
    ${w ? (W => `<button class="pp-attn" data-act="ptab" data-t="ok"><span>Ждут вашей проверки: ${[W.pt ? agree(W.pt + ' заданий') : '', W.pr ? (W.pr === 1 ? 'цена приза' : 'цены ' + W.pr + ' призов') : ''].filter(Boolean).join(', ')}</span><b>Проверить</b></button>`)(ppWaitN(k)) : ''}
    <div class="pp-grid">${ppTile('sum', 'note', 'Сводка сейчас', U.esc(KIDS[k].name) + ': что сделано за день', '', true)}
    ${ppTile('tasks', 'pen', 'Дать задание', n ? 'активных: ' + n : 'дело, задачка, чтение')}
    ${ppTile('ok', 'check', 'Проверить', w ? 'ждут вас: ' + w : 'задания и цены призов', w)}
    ${ppTile('time', 'clock', 'Время', restLeft(k) ? 'отдых до ' + hhmm(K.restUntil) : (baseList(k).filter(x => x.m > 0).map(x => x.name.toLowerCase() + ' ' + x.m).join(', ') || 'настроить') + (baseList(k).some(x => x.m > 0) ? ' мин' : ''))}
    ${ppTile('coins', 'coin', 'Баллы +/−', 'на счету ' + K.coins + (K.piggy ? ', в копилке ' + K.piggy : ''))}
    ${ppTile('report', 'chart', 'Учёба', 'предметы, чтение, ошибки')}
    ${ppTile('portrait', 'brain', 'Развитие', 'сильные стороны')}</div>
    <button class="pp-setl" data-act="ptab" data-t="set">${icon('gear')} Настройки</button></main>`; }
  let body = '';
  if (tab === 'sum') body = ppSum(k);
  else if (tab === 'tasks') body = typeof ptFormCard === 'function' ? ptFormCard(k) + ptListCard(k) : '';
  else if (tab === 'ok') body = ppOk(k);
  else if (tab === 'time') body = ppTime(k);
  else if (tab === 'coins') body = ppCoins(k);
  else if (tab === 'report') body = vReport(k);
  else if (tab === 'portrait') body = vPortrait(k);
  else body = vSettings();
  return `<main class="wrap pp">${ppHead(titles[tab], true)}${body}</main>`;
}
/* ----- Сводка: на сервере (Словоход) или по этому устройству (Уроки) ----- */
function ppSumLines(k){ const T0 = ppToday(k), K = S.kids[k], g = GIRL(k), L = [];
  L.push(T0.n && T0.done.length >= T0.n ? `Все уроки дня сделаны (${T0.n}).` : `Уроки: ${T0.done.length} из ${T0.n}.` + (T0.left.length ? ' Осталось: ' + T0.left.map(s => ppSubj(k, s)).join(', ') + '.' : ''));
  L.push(`Баллы: сегодня +${T0.pts}, на счету ${K.coins}` + (K.piggy ? `, в копилке ${K.piggy}` : '') + '.');
  const ans = T0.evs.filter(e => e.type === 'ответ'), bad = ans.filter(e => e.ok === 'ошибка');
  if (ans.length) { const by = {}; bad.forEach(e => { by[e.subj] = (by[e.subj] || 0) + 1; }); const worst = Object.keys(by).sort((a, b) => by[b] - by[a])[0];
    L.push(`Ответов ${ans.length}, ошибок ${bad.length}` + (worst ? ` (больше всего — ${U.noEmo(worst)})` : '') + '.'); }
  const rd = (K.reading || []).filter(r => r.d === U.today()); if (rd.length) { const r = rd[rd.length - 1]; L.push(`Читал${g ? 'а' : ''} вслух: ${r.title} — ${r.wpm} слов в минуту${r.acc != null ? ', точность ' + Math.round(r.acc * 100) + '%' : ''}.`); }
  const dn = T0.evs.filter(e => e.type === 'не понимаю').length; if (dn) L.push(`Нажимал${g ? 'а' : ''} «Не понимаю»: ${dn}.`);
  const byU = {}; bad.forEach(e => { if (e.unit) byU[e.unit] = (byU[e.unit] || 0) + 1; }); const hard = Object.keys(byU).filter(u => byU[u] >= 3)[0];
  if (hard) L.push(`Совет: повторите вместе тему «${U.noEmo(hard)}» — сегодня в ней ${byU[hard]} ошибки.`);
  const w = ppWait(k); if (w) L.push(`Ждут вашего подтверждения: ${w}.`);
  return L; }
function ppSum(k){
  if (FAM) { if (!FSUM.res && !FSUM.busy && !FSUM.err && !FSUM.auto) { FSUM.auto = 1; setTimeout(() => famSumGet(false), 0); } return famSumCard(); }
  return `<div class="card pp-sum"><h2>${U.esc(KIDS[k].name)}, на ${hhmm(Date.now())}</h2>${ppSumLines(k).map(l => `<p>${U.esc(l)}</p>`).join('')}</div>
    <div class="card pp-sum"><p class="hint">Подробно по предметам, чтению и ошибкам — «Учёба» на главном экране. Каждый вечер в 20:37 сводка приходит в таблицу.</p></div>`; }
/* ----- Подтвердить: задания ждут проверки + цены призов ----- */
function ppOk(k){ const K = S.kids[k], sh = K.shop || [], wait = sh.filter(x => x.price == null), rest = sh.filter(x => x.price != null);
  const row = it => { const i = sh.indexOf(it); return `<div class="pp-prize"><div class="pp-pn"><b>${U.esc(U.noEmo(it.name))}</b>${it.price != null ? `<span class="hint">сейчас ${it.price} · ${ppDays(it.price)}</span>` : '<span class="pp-need">ждёт цену</span>'}</div>
    <div class="pp-pc">${PP_PRICES.map(p => `<button class="chip ${it.price === p ? 'on' : ''}" data-act="ppprice" data-i="${i}" data-p="${p}">${p}</button>`).join('')}<button class="chip" data-act="ppown" data-i="${i}">своя</button></div>
    ${cur.ppOwn === i ? `<form class="pp-own" data-form="ppown"><input id="ppownv" inputmode="numeric" maxlength="5" autocomplete="off" placeholder="баллы" value="${it.price || ''}"><button class="btn small">Готово</button></form>` : ''}
    <button class="link pp-del" data-act="delshop" data-i="${i}">Убрать приз</button></div>`; };
  const tasks = typeof ptWaitCard === 'function' ? ptWaitCard(k) : '';
  const pr = (wait.length ? `<div class="card"><h2>Призы ждут цену: ${wait.length}</h2><p class="hint">Приз выбрал${GIRL(k) ? 'а' : ''} ${U.esc(KIDS[k].name)}. Нажмите цену — сохранится сразу. За день уроков ребёнок зарабатывает до 60 баллов.</p>${wait.map(row).join('')}</div>` : '')
    + (rest.length ? `<details class="card pp-more"${wait.length ? '' : ' open'}><summary>Все призы и цены (${rest.length})</summary>${rest.map(row).join('')}</details>` : '');
  const buys = (K.purchases || []).slice(-5).reverse();
  return (tasks || pr ? '' : `<div class="card"><h2>Всё подтверждено</h2><p class="hint">Новых призов и сделанных заданий пока нет.</p></div>`) + tasks + pr
    + (buys.length ? `<details class="card pp-more"><summary>Последние обмены баллов</summary><ul class="plain">${buys.map(p => `<li>${p.d} — ${U.esc(U.noEmo(p.name))} (${p.price})</li>`).join('')}</ul></details>` : ''); }
function ppDays(p){ const d = Math.max(1, Math.round(p / 60)); return p <= 60 ? '≈ день уроков' : '≈ ' + agree(d + ' дней') + ' уроков'; }
/* ----- Время ----- */
function ppTime(k){ const K = S.kids[k], bt = baseTime(k), x = extraSecs(K) / 60, used = Math.round((K.sess || 0) / 60), r = restLeft(k);
  return ppAllow(k) + `<div class="card"><h2>${U.esc(KIDS[k].name)}: ${r ? 'отдыхает до ' + hhmm(K.restUntil) : 'можно заниматься'}</h2>
    <p>Занятий в этой сессии: <b>${used} из ${60 + x} мин</b>${x ? ` (+${x} от вас)` : ''}.</p>
    <div class="pp-big2"><button class="btn" data-act="xtadd" data-k="${k}" data-m="10">+10 минут</button><button class="btn" data-act="xtadd" data-k="${k}" data-m="30">+30 минут</button></div>
    ${x ? `<p><button class="btn ghost small" data-act="xtadd" data-k="${k}" data-m="-10">Убрать 10 минут</button></p>` : ''}
    ${r ? `<p><button class="btn ghost" data-act="norest" data-k="${k}">Снять перерыв</button></p>` : ''}
    <p class="hint">Добавленное время — только на сегодня. Каждые ~20 минут ребёнка спрашивают «Не устал?»; после часа занятий — перерыв 2 часа.</p></div>
`; }
/* Что разрешено каждый день: свой список родителя, ребёнок видит его на главном экране */
const PP_MIN = [15, 30, 45, 60, 90, 120], PP_IDEAS = ['Игры', 'YouTube', 'Мультики', 'Телефон', 'Компьютер', 'Прогулка с друзьями', 'Настольные игры'];
function ppAllow(k){ const L = baseList(k), F = cur.ppAl || {};
  return `<div class="card"><h2>Что разрешено каждый день</h2><p class="hint">Ваш список: на что и сколько минут. ${U.esc(KIDS[k].name)} видит его на своём главном экране. Это время есть всегда и не сгорает; заработанные баллы добавляют минуты сверху (1 балл = 1 минута). Нажмите — сохранится сразу.</p>
    ${L.length ? L.map((x, i) => `<div class="pp-prize"><div class="pp-pn"><b>${icon(baseIcon(x.name))} ${U.esc(x.name)}: ${x.m} мин</b></div><div class="pp-pc">${PP_MIN.map(m => `<button class="chip ${x.m === m ? 'on' : ''}" data-act="ppalm" data-i="${i}" data-m="${m}">${m}</button>`).join('')}</div><button class="link pp-del" data-act="ppaldel" data-i="${i}">Убрать</button></div>`).join('') : '<p>Список пуст: свободного времени без баллов нет.</p>'}
    <form class="form pp-add" data-form="ppal"><p class="fkql">Добавить своё</p><div class="row">${PP_IDEAS.filter(n => !L.some(x => x.name === n)).map(n => `<button type="button" class="chip" data-act="ppalidea" data-n="${n}">${n}</button>`).join('')}</div>
    <label>Название<input id="ppaln" maxlength="40" autocomplete="off" placeholder="Например: планшет, прогулка, мультики" value="${U.esc(F.n || '')}"></label>
    <p class="fkql">Сколько минут в день</p><div class="pp-pc">${PP_MIN.map(m => `<button type="button" class="chip ${(F.m || 30) === m ? 'on' : ''}" data-act="ppalnm" data-m="${m}">${m}</button>`).join('')}</div>
    <button class="btn">Добавить</button></form></div>`; }
function ppAllowSave(k, L, msg){ const K = S.kids[k]; K.allow = L; ev(k, 'обычное время', { text: L.map(x => x.name + ' ' + x.m + ' мин').join(', ') || 'пусто' }); save(); if (msg) alertMsg(msg); if (FAM) setTimeout(() => famSnapTouch(k), 0); render(); }
/* ----- Баллы +/− с причиной ----- */
function ppCoins(k){ const K = S.kids[k], why = cur.ppWhy || '', name = KIDS[k].name;
  const hist = S.log.filter(e => e.kid === name && e.type === 'баллы от Юры').slice(-5).reverse();
  return `<div class="card"><h2>${U.esc(name)}: на счету ${K.coins}</h2><p class="fkql">За что (можно не выбирать)</p>
    <div class="row">${PP_WHY.map(w => `<button class="chip ${why === w ? 'on' : ''}" data-act="ppwhy" data-w="${w}">${w}</button>`).join('')}</div>
    <p class="fkql">Начислить</p><div class="pp-amt">${PP_PTS.map(p => `<button class="btn" data-act="ppcoins" data-n="${p}">+${p}</button>`).join('')}</div>
    <p class="fkql">Списать</p><div class="pp-amt">${[5, 10, 20, 50].map(p => `<button class="btn ghost" data-act="ppcoins" data-n="-${p}">−${p}</button>`).join('')}</div>
    <form class="form pp-own" data-form="coins"><input id="coinadd" inputmode="numeric" autocomplete="off" placeholder="своё число, например 15 или −15"><button class="btn small">Готово</button></form></div>
    ${hist.length ? `<div class="card"><h2>Недавно</h2><ul class="plain">${hist.map(e => `<li>${e.t.slice(5, 10).split('-').reverse().join('.')} · ${e.price > 0 ? '+' : ''}${e.price}${e.text ? ' · ' + U.esc(e.text) : ''}</li>`).join('')}</ul></div>` : ''}`; }
function ppCoinAdd(k, n){ const K = S.kids[k]; if (!n) return; if (K.coins + n < 0) return alertMsg(`Столько списать нельзя: на счету ${K.coins}`);
  K.coins += n; const w = cur.ppWhy && cur.ppWhy !== 'Без причины' ? cur.ppWhy : ''; ev(k, 'баллы от Юры', { coins: K.coins, price: n, text: w }); save();
  alertMsg(`${KIDS[k].name}: ${n > 0 ? '+' : ''}${n}${w ? ' · ' + w : ''}`); if (FAM) setTimeout(() => famSnapTouch(k), 0); render(); }
function ppSetPrice(k, i, v){ const it = (S.kids[k].shop || [])[i]; if (!it || !(v > 0)) return; if (it.price !== v) ev(k, 'цена приза', { unit: it.name, price: v }); it.price = v; cur.ppOwn = null; save(); alertMsg('Цена ' + v + ' сохранена'); if (FAM) setTimeout(() => famSnapTouch(k), 0); render(); }
function ppAct(act, b){ const k = cur.parentKid;
  switch (act) {
    case 'ppalm': { const L = baseList(k).map(x => Object.assign({}, x)), i = +b.dataset.i; if (!L[i]) return true; L[i].m = +b.dataset.m; ppAllowSave(k, L, L[i].name + ': ' + L[i].m + ' мин в день'); return true; }
    case 'ppaldel': { const L = baseList(k).slice(), x = L.splice(+b.dataset.i, 1)[0]; if (x) ppAllowSave(k, L, 'Убрано: ' + x.name); return true; }
    case 'ppalidea': { const e = document.getElementById('ppaln'); cur.ppAl = Object.assign({}, cur.ppAl, { n: b.dataset.n }); if (e) e.value = b.dataset.n; return true; }
    case 'ppalnm': { const e = document.getElementById('ppaln'); cur.ppAl = Object.assign({}, cur.ppAl, { m: +b.dataset.m, n: e ? e.value : '' }); const y = window.scrollY; render(); window.scrollTo(0, y); return true; }
    case 'ppwhy': cur.ppWhy = cur.ppWhy === b.dataset.w ? '' : b.dataset.w; render(); return true;
    case 'ppcoins': ppCoinAdd(k, +b.dataset.n); return true;
    case 'ppprice': ppSetPrice(k, +b.dataset.i, +b.dataset.p); return true;
    case 'ppown': cur.ppOwn = cur.ppOwn === +b.dataset.i ? null : +b.dataset.i; render(); setTimeout(() => { const e = document.getElementById('ppownv'); if (e) e.focus(); }, 50); return true;
  }
  return false; }
function ppForm(k0, val){
  if (k0 === 'ppal') { const n = val('ppaln').trim(), k = cur.parentKid; if (!n) { alertMsg('Напишите, на что время: например, мультики'); return true; } const L = baseList(k).slice(); L.push({ id: 'a' + Date.now(), name: n.slice(0, 40), m: (cur.ppAl || {}).m || 30 }); cur.ppAl = null; ppAllowSave(k, L, 'Добавлено: ' + n); return true; }
  if (k0 !== 'ppown') return false; ppSetPrice(cur.parentKid, cur.ppOwn, parseInt(val('ppownv'))); return true; }

/* ----- Учёба подробно: карточки вместо таблиц ----- */
function vReport(kid){
  const K = S.kids[kid], d = KIDS[kid], g = GIRL(kid);
  const subs = Object.entries(d.cur).filter(([k, c]) => c.units).map(([k, c]) => { const rows = [['', c.units, c.name]].concat(c.alt ? [['_alt', c.alt, c.altName]] : []);
    return rows.map(([tr, list, nm]) => { const i = Math.min(K.pos[k + tr] || 0, list.length), n0 = list.filter(u => !u.cont).length; const tried = list.filter(u => K.stats[u.id]); const a = tried.length ? Math.round(tried.reduce((s, u) => s + acc(K, u.id), 0) / tried.length * 100) : null;
      const pc = Math.round(Math.min(i, n0) / Math.max(1, n0) * 100), now = list[Math.min(i, list.length - 1)] || {};
      return `<div class="pp-subj"><div class="pp-sh"><b>${U.esc(U.noEmo(nm))}</b><span>${a == null ? '' : 'точность ' + a + '%'}</span></div><div class="pp-bar"><i style="width:${pc}%"></i></div>
        <div class="hint">${i < n0 ? `тема ${i + 1} из ${n0}` : 'программа пройдена' + (list.length > n0 ? `, «Продолжение» ${i - n0} из ${list.length - n0}` : '')} · ${CONT_MARK(now)}${U.esc(U.noEmo(now.t || ''))}</div></div>`; }).join(''); }).join('');
  const weak = Object.entries(K.stats).filter(([, s]) => s.n >= 3).map(([id, s]) => [id, s.ok / s.n]).filter(x => x[1] < .8).sort((a, b) => a[1] - b[1]).slice(0, 5).map(([id, x]) => { const u = Object.values(d.cur).flatMap(c => (c.units || []).concat(c.alt || [])).find(u => u.id === id); return `<li>${CONT_MARK(u)}${U.esc(U.noEmo(u ? u.t : id))} — ${Math.round(x * 100)}%</li>`; }).join('');
  const rd = K.reading.slice(-6).reverse().map(r => `<li>${r.d.slice(5).split('-').reverse().join('.')} · ${U.esc(r.title)} — <b>${r.wpm}</b> сл/мин${r.acc == null ? '' : ', точность ' + Math.round(r.acc * 100) + '%'}${(r.errs || []).length ? `<br><span class="hint">ошибки: ${U.esc(r.errs.join(', '))}</span>` : ''}</li>`).join('');
  const fbs = S.log.filter(e => e.kid === d.name && e.type === 'урок завершён').slice(-8).reverse().map(e => `<li>${e.t.slice(5, 10).split('-').reverse().join('.')} · ${U.esc(U.noEmo(e.subj))}: ${e.grade} (${e.score})${e.diff ? ' · ' + U.esc(e.diff) : ''}${e.text ? ' · «' + U.esc(e.text) + '»' : ''}</li>`).join('');
  const errs = S.log.filter(e => e.kid === d.name && e.type === 'ответ' && e.ok === 'ошибка').slice(-10).reverse().map(e => `<li><b>${U.esc(U.noEmo(e.subj))}</b>: ${U.esc(strip(e.q))} — ответ «${U.esc(e.ans)}», надо «${U.esc(e.right)}»</li>`).join('');
  return `<div class="card"><h2>${U.esc(d.name)}: прочитано слов ${K.words}</h2>${subs}</div>
  <div class="card"><h2>Чтение вслух</h2>${rd ? `<ul class="plain pp-list">${rd}</ul>` : `<p>Ещё не читал${g ? 'а' : ''}.</p>`}<p class="hint">Норма к концу года: ${d.norm} ${U.pl(d.norm, 'слово', 'слова', 'слов')} в минуту. Сейчас читает вслух по ${wordsLimit(kid)} ${U.pl(wordsLimit(kid), 'слову', 'слова', 'слов')} за урок.</p></div>
  ${weak ? `<div class="card"><h2>Над чем поработать</h2><ul class="plain pp-list">${weak}</ul></div>` : ''}
  <details class="card pp-more"><summary>Последние ошибки${errs ? '' : ' — нет'}</summary>${errs ? `<ul class="plain pp-list">${errs}</ul>` : ''}</details>
  <details class="card pp-more"><summary>Отзывы ребёнка после уроков${fbs ? '' : ' — пока нет'}</summary>${fbs ? `<ul class="plain pp-list">${fbs}</ul>` : ''}</details>
  <div class="card"><p class="hint">В повторении ${K.srs.length} ${U.pl(K.srs.length, 'задание', 'задания', 'заданий')}. С какой темы продолжать — в «Настройках».</p></div>`;
}
