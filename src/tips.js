/* Подсказки по касанию: дети нажимают на непонятное (баллы, копилку, проценты…) — всплывает объяснение, можно послушать. */
const TIPS = {
  coins: ['⭐ Баллы на счёте', 'Это твои баллы. 1 балл = 1 минута игры или мультиков сверх обычного времени. Их можно потратить на призы, которые ты выбрал{а}.'],
  piggy: ['🐷 Копилка', 'Сюда падают баллы за уроки, загадки, стихи и задачи. В воскресенье всё из копилки переходит на счёт, и сверху добавляется ещё десять процентов — подарок за то, что ты копил{а} и не тратил{а}. Забрать раньше можно, но тогда без прибавки.'],
  percent: ['% Процент', 'Процент — это одна сотая часть. Десять процентов от ста баллов — это десять баллов. Десять процентов от пятидесяти — пять. Чем больше накопил{а}, тем больше прибавка.'],
  drip: ['📈 Капитал растёт', 'Капитал — это всё, что у тебя есть: счёт и копилка вместе. За каждый верный ответ с первого раза капитал чуть-чуть растёт. Пять верных подряд — растёт в полтора раза быстрее, десять подряд — в два раза. Ошибка начинает серию заново.'],
  rest: ['☕ Перерыв', 'Голове нужен отдых. После двадцати минут занятий следующий новый урок откроется через два часа. Пройденные уроки можно открыть и повторить.'],
  base: ['🎮 Обычное время', 'Каждый день у тебя есть шестьдесят минут игр и тридцать минут YouTube — это время есть всегда. Баллы добавляют минуты сверху.'],
  wpm: ['📖 Скорость чтения', 'Это сколько слов ты читаешь вслух за одну минуту. Чем больше читаешь, тем быстрее и легче получается.'],
  norm: ['📏 Норма', 'Норма — сколько слов в минуту обычно читают дети твоего класса к концу учебного года.'],
  level: ['🏅 Уровень чтения', 'Уровень растёт, когда ты ставишь новый рекорд скорости и читаешь без ошибок. За каждый новый уровень — значок и десять баллов в копилку.'],
  acc: ['🎯 Точность', 'Точность — сколько слов из ста ты прочитал{а} правильно.'],
  prog: ['📊 Полоска', 'Полоска показывает, сколько уроков на сегодня уже сделано.'],
  mark: ['📝 Оценка', 'Оценка за урок, как в школе: пять — отлично, четыре — хорошо, три — нужно повторить. Считается только первый ответ.']
};
function tipText(key){ const t = TIPS[key]; if (!t) return null; const girl = cur.kid && (typeof T === 'function' ? T(cur.kid) : cur.kid) === 'anya'; return [t[0], t[1].replace(/\{а\}/g, girl ? 'а' : '')]; }
function tipShow(key){ const t = tipText(key); if (!t) return; tipHide(); const d = document.createElement('div'); d.className = 'tipbox'; d.id = 'tipbox'; d.setAttribute('role', 'dialog');
  d.innerHTML = `<div class="tipin"><h3>${U.esc(t[0])}</h3><p>${U.esc(t[1])}</p><div class="tiprow"><button class="btn small" data-tipsay="${key}">🔊 Послушать</button><button class="btn ghost small" data-tipclose="1">Понятно</button></div></div>`;
  document.body.appendChild(d); }
function tipHide(){ const o = document.getElementById('tipbox'); if (o) o.remove(); }
document.addEventListener('click', e => { const s = e.target.closest('[data-tipsay]'); if (s) { const t = tipText(s.dataset.tipsay); if (t) say(t[0].replace(/^[^А-Яа-яЁё%]+/, '') + '. ' + t[1], 'ru-RU'); return; }
  if (e.target.closest('[data-tipclose]') || e.target.id === 'tipbox') { try { sayStop(); } catch (x) {} tipHide(); return; }
  if (e.target.closest('[data-act]')) return; const el = e.target.closest('[data-tip]'); if (el) tipShow(el.dataset.tip); });
/* Набранный текст не теряется при перерисовке экрана */
document.addEventListener('input', e => { const el = e.target; if (!el || el.tagName !== 'TEXTAREA' || !cur.kid) return; try { const D = dayRec(cur.kid, cur.ds);
  if (el.id === 'rtxt' && D.les.read) D.les.read.rtDraft = el.value; else if (el.id === 'prec' && D.poem) D.poem.rec = el.value; else if (el.id === 'pcomp' && D.poem) D.poem.comp = el.value; else if (el.id === 'fbtext' && cur.subj && D.les[cur.subj]) { const L = D.les[cur.subj]; L.fb = L.fb || {}; L.fb.text = el.value; } else return;
  clearTimeout(window.TXT_T); window.TXT_T = setTimeout(save, 800); } catch (x) {} });
function busyTyping(){ const a = document.activeElement; if (a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && a.type !== 'button'))) return true; return [].some.call(document.querySelectorAll('textarea'), t => t.value.trim()); }
function softRender(){ if (busyTyping() || (typeof RT !== 'undefined' && RT && RT.active)) return; render(); }
/* Голосовой ввод в любое поле текста: кнопка 🎤 под полем; без распознавания — подсказка про микрофон на клавиатуре */
let MIC = null;
function micStop(){ if (!MIC) return; MIC.on = false; try { MIC.rec.stop(); } catch (e) {} const b = document.querySelector(`[data-mic="${MIC.id}"]`); if (b) { b.textContent = '🎤 Сказать голосом'; b.classList.remove('live'); } MIC = null; }
function micStart(id, btn){ if (MIC) { const same = MIC.id === id; micStop(); if (same) return; } const el = document.getElementById(id); if (!el || !SR) return;
  const M = MIC = { id, on: true, base: el.value.trim(), cur: '' }; const rec = new SR(); M.rec = rec; rec.lang = 'ru-RU'; rec.continuous = true; rec.interimResults = true;
  rec.onresult = e => { let s = ''; for (let i = 0; i < e.results.length; i++) s += ' ' + e.results[i][0].transcript; M.cur = s.trim(); const t = document.getElementById(id); if (t) { t.value = (M.base + ' ' + M.cur).trim(); t.dispatchEvent(new Event('input', { bubbles: true })); } };
  rec.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { alertMsg('Разреши микрофон в настройках, чтобы говорить голосом'); micStop(); } };
  rec.onend = () => { M.base = (M.base + ' ' + M.cur).trim(); M.cur = ''; if (M.on) setTimeout(() => { try { rec.start(); } catch (e) {} }, 150); };
  try { rec.start(); } catch (e) {} btn.textContent = '⏹ Готово'; btn.classList.add('live'); }
document.addEventListener('click', e => { const b = e.target.closest('[data-mic]'); if (b) { e.preventDefault(); micStart(b.dataset.mic, b); } });
function micDecorate(root){ (root || document).querySelectorAll('textarea[id]:not([data-micd])').forEach(t => { t.setAttribute('data-micd', '1'); if (t.id === 'rtxt' || t.id === 'prec') return;
  const d = document.createElement('div'); d.className = 'micbar';
  d.innerHTML = SR ? `<button type="button" class="btn ghost small mic2" data-mic="${t.id}">🎤 Сказать голосом</button><span class="hint">Говори — текст появится сам. Потом можно поправить.</span>` : '<span class="hint">🎤 Можно не печатать: нажми на поле, потом на микрофон на клавиатуре рядом с пробелом, и говори.</span>';
  t.insertAdjacentElement('afterend', d); }); }
try { new MutationObserver(() => micDecorate()).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
/* Озвучка заданий — только после «Не понимаю»: сначала ребёнок читает сам. Совсем маленьким (6 лет и младше, семейная версия) — сразу. */
function voiceFree(kid){ try { return !!(FAM && KIDS[kid] && KIDS[kid].age && KIDS[kid].age <= 6); } catch (e) { return false; } }
function sayGate(key, btn){ cur.heard = cur.heard || {}; if (voiceFree(cur.kid) || cur.heard[key]) return `<span data-hk="${U.esc(key)}">${btn}</span>`; return `<button class="link dunno2" data-heard="${U.esc(key)}">🤔 Не понимаю</button>`; }
document.addEventListener('click', e => { const b = e.target.closest('[data-heard]'); if (!b) return; e.preventDefault(); const key = b.dataset.heard; cur.heard = cur.heard || {}; cur.heard[key] = 1;
  try { if (cur.kid) ev(cur.kid, 'не понимаю', { text: 'попросил(а) прочитать вслух' }); } catch (x) {} render();
  setTimeout(() => { const t = document.querySelector(`[data-hk="${key.replace(/"/g, '')}"] button`); if (t) t.click(); }, 60); });
