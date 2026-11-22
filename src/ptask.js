/* ===== Задания от родителей (22.11, идея Юрия) =====
   Родитель в «Для родителей» → «Задания» создаёт задание ребёнку и назначает баллы:
   - дело по дому («вынести мусор»): ребёнок отмечает «Сделал», баллы — после подтверждения родителем;
   - задачка/головоломка с вариантами ответа: ответ кнопками, баллы сразу (с 1-й попытки — все, со 2-й — половина);
   - кусок книги: ребёнок читает сам (не быстрее разумного темпа), затем вопрос с вариантами или подтверждение родителем.
   На главной ребёнка всегда есть кнопка «Задание от родителей»: неактивна, если заданий нет.
   Баллы идут в копилку сверх дневного лимита: их размер решает родитель.
   Уроки (Ярик и Аня): задания живут на айпаде; ещё их можно прислать строкой листа «Указания» (тип «задание», подтверждение — тип «подтвердить»).
   Словоход: задания хранятся на сервере (лист «Задания», команда fam:'pt'), родитель ставит и подтверждает со своего телефона. */
const PT_KINDS = { chore: ['Дело по дому', 'broom'], quiz: ['Задачка', 'puzzle'], read: ['Чтение', 'book'] };
const PT_PTS = [5, 10, 15, 20, 30, 50];
const PT_CHORES = ['Вынести мусор', 'Убрать в своей комнате', 'Разобрать посуду', 'Застелить кровать', 'Помочь приготовить ужин', 'Полить цветы', 'Сложить свои вещи', 'Покормить питомца'];
let PT_SENDING = false, PT_T = null;
function ptAll(){ if (!S.pt) S.pt = []; return S.pt; }
function ptGet(id){ return ptAll().find(t => t.id === id); }
function ptOf(kid, st){ return ptAll().filter(t => t.kid === kid && (!st || st.includes(t.st))); }
function ptTouch(t){ t.v = (t.v || 0) + 1; t.u = Date.now(); if (FAM) { if (!S.ptq) S.ptq = {}; S.ptq[t.id] = 1; } save(); ptSyncSoon(); }
function ptPrune(){ const A = ptAll(), keep = A.filter(t => t.st !== 'del' || (S.ptq || {})[t.id]); const old = keep.filter(t => t.st === 'ok' || t.st === 'miss'); if (old.length > 40) { const drop = new Set(old.sort((a, b) => (a.u || 0) - (b.u || 0)).slice(0, old.length - 40).map(t => t.id)); S.pt = keep.filter(t => !drop.has(t.id)); } else S.pt = keep; }
function ptWords(s){ return String(s || '').split(/\s+/).filter(Boolean).length; }
/* Минимальное время чтения: темп в полтора раза выше нормы ребёнка, не меньше 20 секунд */
function ptMinSecs(kid, t){ const n = (KIDS[kid] && KIDS[kid].norm) || 60; return Math.max(20, Math.round(ptWords(t.text) / (n * 1.5) * 60)); }
function ptOpts(t){ const r = U.rng(t.id); return r.shuffle((t.opts || []).filter(Boolean).slice()); }
function ptEv(kid, t, text, pts){ try { ev(kid, 'задание родителей', { unit: t.title || PT_KINDS[t.kind][0], text, price: pts == null ? t.pts : pts }); } catch (e) {} }

/* --- баллы: начисляются на устройстве ребёнка, когда он входит (один раз на задание) --- */
function ptPay(kid){ const K = S.kids[kid]; if (!K) return; K.ptPaid = K.ptPaid || []; let got = 0, names = [];
  ptOf(kid, ['ok']).forEach(t => { if (t.paid || K.ptPaid.includes(t.id)) return; const p = Math.max(0, Math.round(t.got == null ? t.pts : t.got)); K.ptPaid.push(t.id); if (K.ptPaid.length > 300) K.ptPaid = K.ptPaid.slice(-300);
    if (p) { K.piggy = (K.piggy || 0) + p; if (!K.piggyWeek) K.piggyWeek = weekStart(U.today()); got += p; names.push('«' + (t.title || PT_KINDS[t.kind][0]) + '»'); }
    t.paid = 1; ptTouch(t); ptEv(kid, t, 'баллы начислены', p); });
  if (got) { K.ptMsg = (names.length === 1 ? 'Задание ' + names[0] + ' засчитано' : 'Задания ' + names.join(', ') + ' засчитаны') + ': +' + agree(got + ' баллов') + ' в копилку.'; save(); } }

/* --- синхронизация (только Словоход) --- */
function ptSyncSoon(){ if (!FAM) return; clearTimeout(PT_T); PT_T = setTimeout(ptSync, 1500); }
function ptSync(){
  if (!FAM || PT_SENDING || TEST || !S.fam || !S.fam.fid || !navigator.onLine) return Promise.resolve();
  const q = S.ptq || {}, items = ptAll().filter(t => q[t.id]).slice(0, 50);
  PT_SENDING = true;
  return famApi({ fam: 'pt', fid: S.fam.fid, token: S.fam.token, items }).then(j => { PT_SENDING = false; if (!j || !j.ok || !Array.isArray(j.pt)) return;
    items.forEach(t => { const s = j.pt.find(x => x.id === t.id); if (!s || (s.v || 0) >= (t.v || 0) || t.st === 'del') delete q[t.id]; });
    ptMerge(j.pt); }).catch(() => { PT_SENDING = false; });
}
function ptMerge(list){ const A = ptAll(), q = S.ptq || {}, seen = {}; let ch = false;
  list.forEach(s => { if (!s || !s.id) return; seen[s.id] = 1; const i = A.findIndex(t => t.id === s.id);
    if (i < 0) { A.push(s); ch = true; } else if ((s.v || 0) > (A[i].v || 0)) { A[i] = s; delete q[s.id]; ch = true; } else if ((s.v || 0) < (A[i].v || 0)) q[s.id] = 1; });
  for (let i = A.length - 1; i >= 0; i--) if (!seen[A[i].id] && !q[A[i].id]) { A.splice(i, 1); ch = true; } /* удалено родителем или устарело на сервере */
  if (Object.keys(q).length) ptSyncSoon();
  if (ch) { save(); if (cur.kid && cur.view === 'home') render(); else if (cur.view === 'parent' && cur.parentTab === 'tasks' && !ptTyping()) render(); else if (cur.view === 'ptask' && !cur.ptid) render(); } }
function ptTyping(){ const a = document.activeElement; return a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName); }

/* --- лист «Указания» (Уроки): тип «задание» — текст «Вынести мусор | 10» или JSON { kind, title, text, q, opts, pts }; тип «подтвердить» — название или id --- */
function ptFromRow(kid, row, type){
  if (type.startsWith('подтв')) { const v = String(row.value || '').toLowerCase().trim(); const t = ptOf(kid, ['wait', 'new']).find(x => x.id === row.value || (v && (x.title || '').toLowerCase().includes(v))); if (t) { t.st = 'ok'; ptTouch(t); } return true; }
  let d = null; try { d = JSON.parse(String(row.value)); } catch (e) {}
  if (!d || typeof d !== 'object') { const m = String(row.value || '').split('|'); d = { kind: 'chore', title: m[0].trim(), pts: parseInt(m[1]) || 10 }; }
  const t = ptNew(kid, d); t.id = 'u' + row.id; if (ptGet(t.id)) return true; ptAll().push(t); save(); return true; }
function ptNew(kid, d){ const kind = PT_KINDS[d.kind] ? d.kind : 'chore';
  return { id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), kid, kind, title: String(d.title || '').trim().slice(0, 120), text: String(d.text || '').trim().slice(0, 6000), q: String(d.q || '').trim().slice(0, 400),
    opts: (d.opts || []).map(x => String(x).trim()).filter(Boolean).slice(0, 4), pts: Math.max(1, Math.min(200, Math.round(+d.pts || 10))), st: 'new', v: 1, t: new Date().toISOString(), u: Date.now() }; }

/* ===== Ребёнок ===== */
function ptHomeBtn(kid){ const n = ptOf(kid, ['new']).length, w = ptOf(kid, ['wait']).length, K = S.kids[kid];
  const msg = K.ptMsg ? `<div class="note ptmsg">${icon('check')} ${U.esc(K.ptMsg)} <button class="link" data-act="ptmsgseen">Понятно</button></div>` : '';
  return msg + `<button class="ptbtn ${n ? 'on' : ''}" data-act="ptlist" ${n || w ? '' : 'disabled aria-disabled="true"'}><span class="ptico">${icon('mail', 'big')}</span><span class="pttt"><b>Задание от родителей</b><span>${n ? `${n} ${U.pl(n, 'новое задание', 'новых задания', 'новых заданий')}` : w ? 'Ждёт проверки родителей' : 'Пока заданий нет'}${n && w ? ` · ждёт проверки: ${w}` : ''}</span></span>${n ? `<span class="ptn">${n}</span>` : ''}</button>`; }
function ptHead(back){ return `<header class="bar"><button class="link" data-act="${back}">← Назад</button><span class="coins">${coinsHtml(S.kids[cur.kid].coins)}</span></header>`; }
function vPTask(){ const kid = cur.kid; if (!kid) return vLogin(); const t = cur.ptid && ptGet(cur.ptid);
  if (!t || t.kid !== kid || t.st === 'del') { cur.ptid = null; return vPTList(kid); }
  return `<main class="wrap ${LK(kid)} ptk">${ptHead('ptlist')}<section class="lesson"><p class="eyebrow">${icon(PT_KINDS[t.kind][1])} Задание от родителей · ${PT_KINDS[t.kind][0]} · ${agree(t.pts + ' баллов')}</p>${ptBody(kid, t)}</section></main>`; }
function vPTList(kid){ const L = ptOf(kid, ['new', 'wait']).sort((a, b) => (a.st === 'new' ? 0 : 1) - (b.st === 'new' ? 0 : 1)), D = ptOf(kid, ['ok', 'miss']).sort((a, b) => (b.u || 0) - (a.u || 0)).slice(0, 5);
  const row = t => `<button class="tile pttile ${t.st === 'new' ? 'go' : t.st === 'wait' ? 'wait' : 'done'}" data-act="ptopen" data-id="${t.id}"><span class="ico">${icon(PT_KINDS[t.kind][1], 'big')}</span><span class="tt"><span class="sn">${U.esc(t.title || PT_KINDS[t.kind][0])}</span><span class="ut">${PT_KINDS[t.kind][0]} · ${t.st === 'ok' ? '+' + (t.got == null ? t.pts : t.got) + ' получено' : t.st === 'miss' ? 'без баллов' : agree(t.pts + ' баллов')}${t.st === 'wait' ? ' · ждёт проверки' : ''}</span></span></button>`;
  return `<main class="wrap ${LK(kid)} ptk">${ptHead('home')}<section class="hello"><h1>Задания от родителей</h1><p>Сделай задание и получи баллы в копилку. Дела по дому засчитывают родители, когда проверят.</p></section>
  ${L.length ? `<section class="tiles">${L.map(row).join('')}</section>` : '<div class="card"><p>Сейчас заданий нет. Когда родители дадут новое, кнопка на главной станет яркой.</p></div>'}
  ${D.length ? `<h2 class="alwh">Уже сделано</h2><section class="tiles">${D.map(row).join('')}</section>` : ''}</main>`; }
function ptBody(kid, t){ const P = cur.ptp || (cur.ptp = {}), say0 = `<button class="btn ghost small" data-act="ptsay">${icon('sound')} Не могу прочитать</button>`;
  const head = `<h1>${U.esc(t.title || PT_KINDS[t.kind][0])}</h1>${t.note && t.st === 'new' ? `<div class="note">Родители просят доделать: ${U.esc(t.note)}</div>` : ''}`;
  if (t.st === 'ok' || t.st === 'miss') return head + `<div class="card win"><h2>${t.st === 'ok' ? 'Задание выполнено' : 'Задание закончено'}</h2><p>${t.st === 'ok' ? `Получено: <b>${t.got == null ? t.pts : t.got}</b> в копилку.` : 'В этот раз без баллов. В следующий раз получится!'}${t.kind === 'quiz' || (t.kind === 'read' && t.q) ? ` Правильный ответ: <b>${U.esc(t.opts[0])}</b>.` : ''}</p></div><button class="btn big" data-act="ptlist">К заданиям</button>`;
  if (t.st === 'wait') return head + (t.text && t.kind === 'chore' ? `<article class="card"><p>${U.esc(t.text).replace(/\n/g, '<br>')}</p></article>` : '') + `<div class="card"><h2>${icon('hourglass')} Ждём проверки</h2><p>Родители посмотрят и засчитают задание. Баллы сразу придут в копилку.</p></div><button class="btn big" data-act="ptlist">К заданиям</button>`;
  if (t.kind === 'chore') return head + (t.text ? `<article class="card"><p class="pttext">${U.esc(t.text).replace(/\n/g, '<br>')}</p></article>` : '') + `<div class="row">${say0}</div><button class="btn big" data-act="ptdone">Сделал${GIRL(kid) ? 'а' : ''}</button><p class="hint">Отметь, когда всё сделаешь по-настоящему. Баллы придут, когда родители проверят.</p>`;
  if (t.kind === 'read' && !(P[t.id] && P[t.id].read)) { const st = (P[t.id] = P[t.id] || {}); if (!st.t0) st.t0 = Date.now(); const left = Math.max(0, ptMinSecs(kid, t) - Math.round((Date.now() - st.t0) / 1000));
    if (left > 0) { clearTimeout(window.PT_RT); window.PT_RT = setTimeout(() => { if (cur.view === 'ptask' && cur.ptid === t.id) softRender(); }, Math.min(left, 15) * 1000 + 300); }
    return head + `<article class="card reading"><div class="text">${U.esc(t.text).replace(/\n/g, '<br>')}</div></article><button class="btn big" data-act="ptread" ${left > 0 ? 'disabled' : ''}>${left > 0 ? `Читай внимательно… ещё ${left > 60 ? Math.ceil(left / 60) + ' мин' : left + ' с'}` : `Я прочитал${GIRL(kid) ? 'а' : ''}`}</button>`; }
  if (t.kind === 'read' && !t.q) return head + `<div class="card"><p>Расскажи родителям, о чём ты прочитал${GIRL(kid) ? 'а' : ''}. Когда расскажешь, нажми кнопку — родители засчитают задание.</p></div><button class="btn big" data-act="ptdone">Рассказал${GIRL(kid) ? 'а' : ''}, отправить</button>`;
  /* вопрос с вариантами: задачка или вопрос к тексту */
  const st = (P[t.id] = P[t.id] || {}), wr = st.wrong || [], opts = ptOpts(t);
  return head + (t.kind === 'quiz' && t.text ? `<article class="card"><p class="pttext">${U.esc(t.text).replace(/\n/g, '<br>')}</p></article>` : '') + `<article class="card"><p class="q">${U.esc(t.q)}</p>${wr.length ? '<p class="bad">Неверно. Подумай ещё раз — получишь половину баллов.</p>' : ''}<div class="opts">${opts.map(o => `<button class="opt ${wr.includes(o) ? 'wrong' : ''}" data-act="ptans" data-v="${U.esc(o)}" ${wr.includes(o) ? 'disabled' : ''}>${U.esc(o)}</button>`).join('')}</div></article><div class="row">${t.kind === 'quiz' ? say0 : ''}</div>`; }

/* ===== Родитель: вкладка «Задания» ===== */
function ptForm(){ if (!cur.ptf) cur.ptf = { kind: 'chore', title: '', text: '', q: '', a: '', w1: '', w2: '', w3: '', pts: 10 }; return cur.ptf; }
function ptFormRead(){ const F = ptForm(), g = id => { const el = document.getElementById(id); return el ? el.value : null; };
  ['title', 'text', 'q', 'a', 'w1', 'w2', 'w3'].forEach(k => { const v = g('ptf_' + k); if (v != null) F[k] = v; }); const p = g('ptf_pts'); if (p != null && p !== '') F.pts = Math.max(1, Math.min(200, parseInt(p) || F.pts)); }
function vPTParent(){ const pk = cur.parentKid, F = ptForm(), name = KIDS[pk].name;
  const kidSw = `<div class="row">${kidIds().map(k => `<button class="chip ${pk === k ? 'on' : ''}" data-act="pkid" data-k="${k}">${KIDS[k].name}${ptOf(k, ['wait']).length ? ' •' : ''}</button>`).join('')}</div>`;
  const W = ptOf(pk, ['wait']), N = ptOf(pk, ['new']), D = ptOf(pk, ['ok', 'miss']).sort((a, b) => (b.u || 0) - (a.u || 0)).slice(0, 8);
  const line = (t, btns) => `<div class="ptrow"><div><b>${U.esc(t.title || PT_KINDS[t.kind][0])}</b><br><span class="hint">${PT_KINDS[t.kind][0]} · ${agree(t.pts + ' баллов')}${t.st === 'ok' ? ' · засчитано +' + (t.got == null ? t.pts : t.got) : t.st === 'miss' ? ' · ответ неверный, без баллов' : ''}</span></div><div class="ptbtns">${btns}</div></div>`;
  const wait = W.length ? `<div class="card ptwait"><h2>Ждут проверки: ${W.length}</h2><p class="hint">${U.esc(name)} ${GIRL(pk) ? 'отметила, что сделала' : 'отметил, что сделал'}. Проверьте и засчитайте — баллы придут в копилку.</p>${W.map(t => line(t, `<button class="btn small" data-act="ptok" data-id="${t.id}">Засчитать</button><button class="btn small ghost" data-act="ptback" data-id="${t.id}">Вернуть</button>`)).join('')}</div>` : '';
  const act = `<div class="card"><h2>Активные задания</h2>${N.length ? N.map(t => line(t, `${t.kind === 'chore' ? `<button class="btn small ghost" data-act="ptok" data-id="${t.id}">Засчитать</button>` : ''}<button class="link" data-act="ptdel" data-id="${t.id}">Убрать</button>`)).join('') : `<p class="hint">Сейчас у ребёнка нет заданий — кнопка «Задание от родителей» у него неактивна.</p>`}</div>`;
  const done = D.length ? `<div class="card"><h2>Сделано недавно</h2>${D.map(t => line(t, '')).join('')}</div>` : '';
  const k = F.kind, inp = (id, label, ph, max) => `<label>${label}<input id="ptf_${id}" value="${U.esc(F[id] || '')}" maxlength="${max || 120}" autocomplete="off" placeholder="${ph || ''}"></label>`;
  const ta = (id, label, ph, rows, max) => `<label>${label}<textarea id="ptf_${id}" rows="${rows}" maxlength="${max}" placeholder="${ph}">${U.esc(F[id] || '')}</textarea></label>`;
  const opts = `<p class="fkql">Варианты ответа${k === 'read' ? ' (если задали вопрос)' : ''} — ребёнок выбирает кнопкой, печатать ничего не нужно</p>${inp('a', 'Правильный ответ', '', 120)}${inp('w1', 'Неверный вариант', '', 120)}${inp('w2', 'Ещё неверный (можно пусто)', '', 120)}${inp('w3', 'Ещё неверный (можно пусто)', '', 120)}`;
  const fields = k === 'chore' ? `<div class="row ptchips">${PT_CHORES.map(c => `<button type="button" class="chip ${F.title === c ? 'on' : ''}" data-act="ptchore" data-t="${U.esc(c)}">${c}</button>`).join('')}</div>${inp('title', 'Что сделать', 'Например: вынести мусор')}${ta('text', 'Подробности (можно пусто)', 'Например: и поставить новый пакет', 2, 600)}`
    : k === 'quiz' ? `${inp('title', 'Название (можно пусто)', 'Например: Задачка про яблоки')}${ta('q', 'Вопрос или условие задачи', 'У Маши 5 яблок, она отдала 2. Сколько осталось?', 3, 400)}${opts}`
    : `${inp('title', 'Название', 'Например: «Каштанка», глава 1')}${ta('text', 'Текст для чтения — вставьте отрывок из книги', 'Скопируйте сюда кусочек книги', 8, 6000)}${inp('q', 'Вопрос по тексту (можно пусто — тогда ребёнок перескажет вам, а вы засчитаете)', 'Например: Как звали собаку?', 400)}${opts}`;
  const form = `<form class="card form ptform" data-form="ptnew"><h2>Новое задание · ${U.esc(name)}</h2><div class="row">${Object.keys(PT_KINDS).map(x => `<button type="button" class="chip ${k === x ? 'on' : ''}" data-act="ptkind" data-k="${x}">${icon(PT_KINDS[x][1])} ${PT_KINDS[x][0]}</button>`).join('')}</div>${fields}
    <p class="fkql">Сколько баллов</p><div class="row">${PT_PTS.map(p => `<button type="button" class="chip ${+F.pts === p ? 'on' : ''}" data-act="ptpts" data-p="${p}">${p}</button>`).join('')}</div>
    <label>Или своё число<input id="ptf_pts" inputmode="numeric" maxlength="3" autocomplete="off" value="${PT_PTS.includes(+F.pts) ? '' : F.pts}"></label>
    <p class="hint">1 балл = 1 минута игры. Баллы за ваши задания идут в копилку сверх дневного лимита — сколько давать, решаете вы.${k === 'quiz' ? ' За ответ с первой попытки — все баллы, со второй — половина.' : ''}${k === 'chore' ? ' Баллы придут, когда вы нажмёте «Засчитать».' : ''}</p>
    <button class="btn big">Дать задание</button></form>`;
  const fam = FAM ? `<p class="hint">Задания хранятся на сервере: можно давать их со своего телефона — у ребёнка они появятся, когда его устройство подключится к интернету (обычно за несколько минут).</p>` : '';
  return kidSw + wait + form + act + done + fam; }
function ptSubmit(){ ptFormRead(); const F = ptForm(), pk = cur.parentKid, k = F.kind;
  const opts = [F.a, F.w1, F.w2, F.w3].map(x => String(x || '').trim()).filter(Boolean);
  if (k === 'chore' && !F.title.trim()) return alertMsg('Напишите, что нужно сделать');
  if (k === 'quiz' && !F.q.trim()) return alertMsg('Напишите вопрос или условие');
  if (k === 'read' && ptWords(F.text) < 5) return alertMsg('Вставьте текст для чтения');
  if ((k === 'quiz' || (k === 'read' && F.q.trim())) && (!String(F.a).trim() || opts.length < 2)) return alertMsg('Нужны правильный ответ и хотя бы один неверный');
  if (new Set(opts.map(x => x.toLowerCase())).size < opts.length) return alertMsg('Варианты ответа не должны повторяться');
  const t = ptNew(pk, { kind: k, title: F.title || (k === 'quiz' ? 'Задачка' : ''), text: F.text, q: k === 'chore' ? '' : F.q, opts: k === 'chore' || (k === 'read' && !F.q.trim()) ? [] : opts, pts: F.pts });
  t.by = 'p'; ptAll().push(t); ptTouch(t); ptEv(pk, t, 'новое задание');
  cur.ptf = { kind: k, title: '', text: '', q: '', a: '', w1: '', w2: '', w3: '', pts: F.pts }; alertMsg('Задание отправлено: ' + KIDS[pk].name); render(); }

function ptAct(act, b){ const kid = cur.kid;
  switch (act) {
    case 'ptlist': cur.ptid = null; cur.ptp = {}; go('ptask'); return true;
    case 'ptopen': cur.ptid = b.dataset.id; go('ptask'); return true;
    case 'ptmsgseen': if (kid) { delete S.kids[kid].ptMsg; save(); render(); } return true;
    case 'ptsay': { const t = ptGet(cur.ptid); if (t) { say(strip([t.title, t.kind === 'chore' ? t.text : '', t.q].filter(Boolean).join('. ')), 'ru-RU'); try { ev(kid, 'озвучка', { subj: 'Задание от родителей', unit: t.title, text: 'задание' }); } catch (e) {} } return true; }
    case 'ptdone': { const t = ptGet(cur.ptid); if (!t || t.st !== 'new') return true; t.st = 'wait'; t.note = ''; ptTouch(t); ptEv(kid, t, t.kind === 'read' ? 'прочитал(а), ждёт подтверждения' : 'сделал(а), ждёт подтверждения'); render(); return true; }
    case 'ptread': { const t = ptGet(cur.ptid), P = cur.ptp || (cur.ptp = {}); if (!t) return true; const st = P[t.id] = P[t.id] || {}; st.read = true; ptEv(kid, t, 'прочитал(а) текст за ' + Math.round((Date.now() - (st.t0 || Date.now())) / 1000) + ' с', 0); render(); window.scrollTo(0, 0); return true; }
    case 'ptans': { const t = ptGet(cur.ptid), P = cur.ptp || (cur.ptp = {}); if (!t || t.st !== 'new') return true; const st = P[t.id] = P[t.id] || {}; st.wrong = st.wrong || []; const v = b.dataset.v, ok = v === t.opts[0];
      if (ok) { t.st = 'ok'; t.got = st.wrong.length ? Math.ceil(t.pts / 2) : t.pts; t.res = st.wrong.length ? 'со 2-й попытки' : 'верно'; ptTouch(t); ptEv(kid, t, 'ответ: ' + t.res, t.got); ptPay(kid); try { say(st.wrong.length ? 'Верно!' : 'Верно! Молодец!', 'ru-RU'); } catch (e) {} }
      else { st.wrong.push(v); if (st.wrong.length >= 2 || st.wrong.length >= t.opts.length - 1) { t.st = 'miss'; t.got = 0; t.res = 'ошибка'; ptTouch(t); ptEv(kid, t, 'ответ неверный: ' + v, 0); } }
      render(); return true; }
    /* родитель */
    case 'ptkind': ptFormRead(); ptForm().kind = b.dataset.k; render(); return true;
    case 'ptchore': { ptFormRead(); const F = ptForm(); F.title = b.dataset.t; const y = window.scrollY; render(); window.scrollTo(0, y); return true; }
    case 'ptpts': { ptFormRead(); ptForm().pts = +b.dataset.p; const el = document.getElementById('ptf_pts'); if (el) el.value = ''; const y = window.scrollY; render(); window.scrollTo(0, y); return true; }
    case 'ptok': { const t = ptGet(b.dataset.id); if (!t) return true; t.st = 'ok'; t.got = t.pts; t.note = ''; ptTouch(t); ptEv(t.kid, t, 'родитель засчитал', t.pts); alertMsg('Засчитано: +' + t.pts + '. Баллы придут ребёнку в копилку'); render(); return true; }
    case 'ptback': { const t = ptGet(b.dataset.id); if (!t) return true; const n = window.prompt('Что доделать? (можно оставить пустым)', '') ; if (n === null) return true; t.st = 'new'; t.note = String(n).trim().slice(0, 300) || 'Задание сделано не до конца.'; ptTouch(t); ptEv(t.kid, t, 'родитель вернул: ' + t.note, 0); render(); return true; }
    case 'ptdel': { const t = ptGet(b.dataset.id); if (!t || !window.confirm('Убрать задание «' + (t.title || PT_KINDS[t.kind][0]) + '»?')) return true; t.st = 'del'; ptTouch(t); ptEv(t.kid, t, 'родитель убрал задание', 0); ptPrune(); render(); return true; }
  }
  return false; }
