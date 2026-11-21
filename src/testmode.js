/* Тестовый режим для родителя: копия данных в «песочнице» — все уроки открыты, перерывов нет,
   баллы и прогресс детей не меняются, события в таблицу не идут. Кнопка «📝 Замечание» отправляет заметку Юры в таблицу. */
let TEST = false;
function testCard(){ return `<div class="card testc"><h2>🧪 Тестовый режим</h2><p class="hint">Пройдите любые задания за ребёнка: всё открыто, без перерывов. Баллы и прогресс детей не меняются, в таблицу ничего не пишется. Замечания по ходу — кнопкой «📝 Замечание».</p><div class="row">${kidIds().map(k => `<button class="btn small" data-act="testgo" data-k="${k}">За ${KIDS[k].name === 'Аня' ? 'Аню' : KIDS[k].name === 'Ярик' ? 'Ярика' : KIDS[k].name}</button>`).join(' ')}</div></div>`; }
function testEnter(k){ const real = S; S = JSON.parse(JSON.stringify(real)); S.queue = []; S.test = true; TEST = true;
  Object.keys(S.kids).forEach(x => { S.kids[x].restUntil = 0; S.kids[x].blk = 0; S.kids[x].prizesSet = true; });
  cur.kid = k; go('home'); }
function testExit(){ TEST = false; S = load(); cur.kid = null; go('login'); }
function testBar(){ return `<div class="testbar">🧪 Тест · ${U.esc(cur.kid ? KIDS[cur.kid].name : '')} <button class="link" data-act="testkid">сменить ребёнка</button> <button class="link" data-act="testday">новый день</button> <button class="link" data-act="testexit">выйти из теста</button></div><button class="notebtn" data-act="noteopen">📝 Замечание</button>`; }
function noteCtx(){ const h = document.querySelector('#app h1'), q = document.querySelector('#app .q'); return [cur.kid ? KIDS[cur.kid].name : '', cur.view, cur.subj && cur.view === 'lesson' ? cur.subj : '', h ? h.textContent.trim().slice(0, 80) : ''].filter(Boolean).join(' / ') + (q ? ' — ' + q.textContent.trim().slice(0, 200) : ''); }
function noteOpen(){ const ctx = noteCtx(); const d = document.createElement('div'); d.className = 'tipbox'; d.id = 'notebox';
  d.innerHTML = `<div class="tipin"><h3>${icon('note')} Замечание</h3><p class="hint">Экран: ${U.esc(ctx)}</p><textarea id="notetext" rows="4" placeholder="Что улучшить? Можно надиктовать."></textarea><div class="tiprow"><button class="btn small" data-act="notesend">Отправить</button><button class="btn ghost small" data-act="noteclose">Отмена</button></div></div>`;
  d.dataset.ctx = ctx; document.body.appendChild(d); try { micDecorate(d); } catch (e) {} }
function noteSend(){ const box = document.getElementById('notebox'), t = document.getElementById('notetext'), text = t ? t.value.trim() : ''; if (!text) { alertMsg('Напишите или надиктуйте замечание'); return; }
  const e = { t: new Date().toISOString(), kid: 'Юра', type: 'замечание', subj: TEST ? 'тест' : '', unit: box ? box.dataset.ctx : '', text };
  try { micStop(); } catch (x) {} if (box) box.remove();
  if (TEST) { try { const R = JSON.parse(localStorage.getItem(KEY)); R.queue.push(e); localStorage.setItem(KEY, JSON.stringify(R)); } catch (x) {}
    const sync = S.cfg.sync; if (sync && navigator.onLine) fetch(sync, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(FAM ? { fam: 'ev', fid: S.fam && S.fam.fid, token: S.fam && S.fam.token, events: [e] } : { events: [e] }) }).then(() => { try { const R = JSON.parse(localStorage.getItem(KEY)); R.queue = R.queue.filter(x => !(x.type === 'замечание' && x.t === e.t)); localStorage.setItem(KEY, JSON.stringify(R)); } catch (x) {} }).catch(() => {}); }
  else { S.queue.push(e); save(); flushSoon(); }
  alertMsg('Замечание сохранено ✓'); }
function testAct(act, b){ switch (act) {
  case 'testgo': testEnter(b.dataset.k); return true;
  case 'testexit': testExit(); return true;
  case 'testkid': { const ks = kidIds(), i = ks.indexOf(cur.kid); cur.kid = ks[(i + 1) % ks.length]; go('home'); return true; }
  case 'testday': { if (!cur.kid) return true; const K = S.kids[cur.kid]; delete K.days[U.today()]; K.restUntil = 0; K.blk = 0; go('home'); alertMsg('Тестовый день начат заново'); return true; }
  case 'noteopen': noteOpen(); return true;
  case 'noteclose': { try { micStop(); } catch (x) {} const o = document.getElementById('notebox'); if (o) o.remove(); return true; }
  case 'notesend': noteSend(); return true;
  } return false; }
