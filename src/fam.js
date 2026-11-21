/* ===== Словоход: семейная тестовая версия (регистрация семьи, дети 6–13, отключение из админки) =====
   Подключается только в сборке docs/semya/ (FAM = 1). Данные семей — в закрытой Google-таблице, через тот же скрипт синхронизации. */
var FAM_LOOKS = [['yarik', '⚽ Футбол и животные'], ['anya', '🪄 Волшебство и замки']];
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
  L.forEach(function(c){ var a = famAgeCfg(c.age);
    KIDS[c.id] = Object.assign({}, KIDS_TPL[a.tpl], a, { name: c.name, grade: c.age + ' ' + U.pl(+c.age, 'год', 'года', 'лет'), look: c.look || a.tpl });
    if (!S.kids[c.id]) S.kids[c.id] = newKid(); if (c.pin) S.kids[c.id].pin = c.pin; });
  if (S.fam && S.fam.ppin) S.parentPin = S.fam.ppin;
}
function famApi(o){
  return fetch(SYNC_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(o) })
    .then(function(r){ return r.json(); });
}
var FAM_BUSY = false;
function famStatus(){
  if (!S.fam || !S.fam.fid || !navigator.onLine) return;
  return famApi({ fam: 'st', fid: S.fam.fid, token: S.fam.token }).then(function(j){
    if (!j) return; var off = !!j.off || j.err === 'auth'; if (off !== !!S.fam.off) { S.fam.off = off; save(); render(); } }).catch(function(){});
}
function famGate(){
  if (!KIDS[cur.parentKid]) cur.parentKid = kidIds()[0] || null;
  if (S.fam && S.fam.off) return famWrap(famBrand(true) + '<header class="hero"><h1>Доступ приостановлен</h1><p>Тестовый доступ для вашей семьи сейчас отключён. Свяжитесь с организатором теста.</p></header><p class="center"><button class="btn ghost" data-act="fkrecheck">Проверить ещё раз</button></p>');
  if (!S.fam) return cur.fview === 'login' ? vFamLogin() : vFamReg();
  if (!S.parentPin || !kidIds().length || cur.view === 'fkids') return vFamKids();
  return null;
}
function famWrap(h){ return '<main class="wrap narrow famscr">' + h + '</main>'; }
var FAM_MOTTO = 'Слово за словом, шаг за шагом — к родным корням.';
function famBrand(big){ return '<div class="fambrand' + (big ? ' big' : '') + '"><img src="semya/logo.webp" alt="" width="' + (big ? 160 : 64) + '" height="' + (big ? 160 : 64) + '"><div><div class="famlogo">Слово<span>ход</span></div>' + (big ? '<p class="fammotto">' + FAM_MOTTO + '</p>' : '') + '</div></div>'; }
function famIn(id, label, type, extra){ return '<label>' + label + '<input id="' + id + '" type="' + (type || 'text') + '" autocomplete="off" ' + (extra || '') + '></label>'; }
function vFamReg(){
  return famWrap(famBrand(true) + '<header class="hero"><p class="eyebrow">Бесплатная тестовая версия</p><p class="famintro">Всё начинается со слова. Родная речь — корни, из которых растёт человек, где бы он ни жил. Русский язык, чтение вслух, математика и логика для детей 6–13 лет. 20–40 минут в день, уроки ведёт приложение, отчёт — родителю.</p></header>' +
    '<form class="card form" data-form="freg"><h2>Регистрация семьи</h2>' + famIn('fname', 'Ваше имя') + famIn('femail', 'Email', 'email', 'inputmode="email" autocapitalize="off"') + famIn('fpass', 'Пароль (не короче 6 знаков)', 'password') +
    '<button class="btn big"' + (FAM_BUSY ? ' disabled' : '') + '>' + (FAM_BUSY ? 'Подождите…' : 'Зарегистрироваться') + '</button></form>' +
    '<p class="center"><button class="link" data-act="fklogin">Уже регистрировались? Войти</button></p>');
}
function vFamLogin(){
  return famWrap(famBrand(true) + '<header class="hero"><h1>Вход для родителей</h1><p>Войдите тем же email и паролем, что при регистрации.</p></header>' +
    '<form class="card form" data-form="flogin">' + famIn('femail', 'Email', 'email', 'inputmode="email" autocapitalize="off"') + famIn('fpass', 'Пароль', 'password') +
    '<button class="btn big"' + (FAM_BUSY ? ' disabled' : '') + '>' + (FAM_BUSY ? 'Подождите…' : 'Войти') + '</button></form>' +
    '<p class="center"><button class="link" data-act="fkreg">Новая семья? Регистрация</button></p>');
}
/* Черновик списка детей на экране настройки */
function fkDraft(){ if (!cur.fk) cur.fk = ((S.fam && S.fam.kids) || []).map(function(c){ return { id: c.id, name: c.name, age: c.age, look: c.look, has: !!c.pin }; }); if (!cur.fk.length) cur.fk.push({ id: '', name: '', age: 8, look: '' }); return cur.fk; }
function fkRead(){ (cur.fk || []).forEach(function(c, i){ var g = function(n){ var el = document.getElementById('fk' + n + i); return el ? el.value : null; };
  if (g('n') != null) { c.name = g('n').trim(); c.age = +g('a'); c.look = g('l'); c.pinNew = g('p'); } }); }
function vFamKids(){
  var L = fkDraft(), first = !S.parentPin;
  var ages = function(v){ var h = ''; for (var a = 6; a <= 13; a++) h += '<option value="' + a + '"' + (+v === a ? ' selected' : '') + '>' + a + ' ' + U.pl(a, 'год', 'года', 'лет') + '</option>'; return h; };
  var looks = function(v, age){ var d = v || famAgeCfg(age).tpl; return FAM_LOOKS.map(function(x){ return '<option value="' + x[0] + '"' + (d === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join(''); };
  var rows = L.map(function(c, i){ return '<fieldset class="card form fkid"><h2>Ребёнок ' + (i + 1) + (L.length > 1 ? ' <button type="button" class="link" data-act="fkdel" data-i="' + i + '">убрать</button>' : '') + '</h2>' +
    '<label>Имя<input id="fkn' + i + '" value="' + U.esc(c.name || '') + '" maxlength="20" autocomplete="off"></label>' +
    '<label>Возраст<select id="fka' + i + '">' + ages(c.age) + '</select></label>' +
    '<label>Оформление<select id="fkl' + i + '">' + looks(c.look, c.age) + '</select></label>' +
    '<label>Код ребёнка, 4 цифры' + (c.has ? ' (оставьте пустым, чтобы не менять)' : '') + '<input id="fkp' + i + '" inputmode="numeric" maxlength="4" autocomplete="off" value="' + U.esc(c.pinNew || '') + '"></label></fieldset>'; }).join('');
  return famWrap(famBrand(false) + '<header class="hero"><p class="eyebrow">' + U.esc((S.fam && S.fam.email) || '') + '</p><h1>' + (first ? 'Добавьте детей' : 'Дети') + '</h1><p>Программа подстраивается под возраст: 6–9 лет — младшая, 10–13 лет — старшая. Дальше сложность меняется по ответам ребёнка.</p></header>' +
    '<form data-form="fkids">' + rows + (L.length < 5 ? '<p class="center"><button type="button" class="btn ghost" data-act="fkadd">+ Ещё ребёнок</button></p>' : '') +
    '<div class="card form"><label>Код родителя, 4 цифры' + (first ? '' : ' (оставьте пустым, чтобы не менять)') + '<input id="fkpp" inputmode="numeric" maxlength="4" autocomplete="off"></label><p class="hint">Код родителя открывает отчёты и подтверждает призы. Коды детей — чтобы брат или сестра не заходили друг за друга.</p>' +
    '<button class="btn big">Сохранить</button>' + (first ? '' : ' <button type="button" class="link" data-act="fkback">Отмена</button>') + '</div></form>');
}
function famLoginExtra(){ return '<p class="fammotto center">' + FAM_MOTTO + '</p>'; }
function famSettings(){
  return '<div class="card"><h2>Семья</h2><p class="hint">' + U.esc(S.fam.email || '') + '</p><div class="row"><button class="btn small" data-act="fkedit">Дети и коды</button> <button class="btn small stop" data-act="fkout">Выйти из аккаунта</button></div></div>' +
    '<form class="card form" data-form="ffb"><h2>Отзыв о тестовой версии</h2><label>Что понравилось, что мешает, чего не хватает<textarea id="ffbt" rows="4" maxlength="2000" style="display:block;width:100%;box-sizing:border-box;margin-top:6px;font:inherit;padding:10px;border-radius:12px;border:1px solid #cbd5e1"></textarea></label><button class="btn small">Отправить</button></form>';
}
function famAct(act, b){
  switch (act) {
    case 'fklogin': cur.fview = 'login'; render(); return true;
    case 'fkreg': cur.fview = 'reg'; render(); return true;
    case 'fkadd': fkRead(); cur.fk.push({ id: '', name: '', age: 8, look: '' }); render(); return true;
    case 'fkdel': fkRead(); cur.fk.splice(+b.dataset.i, 1); render(); return true;
    case 'fkedit': cur.fk = null; go('fkids'); return true;
    case 'fkback': cur.fk = null; go('parent', { parentTab: 'set' }); return true;
    case 'fkrecheck': famStatus(); return true;
    case 'fkout': if (window.confirm('Выйти из аккаунта на этом устройстве? Прогресс детей на этом устройстве сотрётся.')) { flush().finally(function(){ try { localStorage.removeItem(KEY); } catch (x) {} location.reload(); }); } return true;
  }
  return false;
}
function famAuthDone(j){
  FAM_BUSY = false;
  if (!j || !j.ok) { render(); return alertMsg(j && j.msg ? j.msg : 'Не получилось. Проверьте интернет и попробуйте ещё раз'); }
  S.fam = { fid: j.fid, token: j.token, email: j.email, name: j.name || '', kids: j.kids || [], ppin: j.ppin || null, off: !!j.off };
  famInit(); save(); cur.fk = null; go('login');
}
function famForm(k, f, val){
  if (k === 'freg' || k === 'flogin') {
    var em = val('femail').trim().toLowerCase(), pw = val('fpass'), nm = k === 'freg' ? val('fname').trim() : '';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { alertMsg('Проверьте email'); return true; }
    if (pw.length < 6) { alertMsg('Пароль — не короче 6 знаков'); return true; }
    if (k === 'freg' && !nm) { alertMsg('Напишите ваше имя'); return true; }
    if (FAM_BUSY) return true; FAM_BUSY = true; render();
    famApi({ fam: k === 'freg' ? 'reg' : 'login', email: em, pass: pw, name: nm }).then(famAuthDone).catch(function(){ famAuthDone(null); });
    return true;
  }
  if (k === 'fkids') {
    fkRead(); var L = cur.fk, pp = val('fkpp'), first = !S.parentPin, i, c, pins = [];
    for (i = 0; i < L.length; i++) { c = L[i];
      if (!c.name) { alertMsg('Напишите имя ребёнка ' + (i + 1)); return true; }
      if (c.pinNew && !/^\d{4}$/.test(c.pinNew)) { alertMsg('Код ребёнка — четыре цифры'); return true; }
      if (!c.has && !c.pinNew) { alertMsg('Придумайте код для ребёнка: ' + c.name); return true; } }
    if ((first || pp) && !/^\d{4}$/.test(pp)) { alertMsg('Код родителя — четыре цифры'); return true; }
    var old = {}; (S.fam.kids || []).forEach(function(x){ old[x.id] = x; });
    var kids = L.map(function(c, j){ var id = c.id || ('k' + Date.now().toString(36) + j); var o = old[id] || {};
      return { id: id, name: c.name.slice(0, 20), age: c.age, look: c.look || famAgeCfg(c.age).tpl, pin: c.pinNew ? hashPin(c.pinNew) : o.pin }; });
    var ppin = pp ? hashPin(pp) : S.fam.ppin;
    kids.forEach(function(x){ pins.push(x.pin); }); pins.push(ppin);
    if (pins.filter(function(x, j){ return pins.indexOf(x) !== j; }).length) { alertMsg('Коды должны быть разными у всех'); return true; }
    var gone = (S.fam.kids || []).filter(function(x){ return !kids.some(function(y){ return y.id === x.id; }); });
    gone.forEach(function(x){ delete S.kids[x.id]; });
    S.fam.kids = kids; S.fam.ppin = ppin; S.parentPin = ppin; famInit(); save();
    famApi({ fam: 'kids', fid: S.fam.fid, token: S.fam.token, kids: kids, ppin: ppin }).catch(function(){});
    cur.fk = null; alertMsg('Сохранено'); go('login');
    return true;
  }
  if (k === 'ffb') { var t = val('ffbt').trim(); if (!t) return true;
    famApi({ fam: 'fb', fid: S.fam.fid, token: S.fam.token, text: t.slice(0, 2000) }).then(function(){ alertMsg('Спасибо! Отзыв отправлен'); render(); }).catch(function(){ alertMsg('Нет связи. Попробуйте позже'); });
    return true; }
  return false;
}
