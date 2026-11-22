/* ===== Словоход: семьи тестовой версии =====
   Файл скрипта синхронизации (Apps Script). Данные — в закрытой таблице «Словоход — семьи (тест)».
   В doPost/doGet первой строкой: if (d.fam) return famOut(famRoute(d)); */
var FAM_SID = '1AQYatS4JZTJKa8OskdHz3owP58LySAFEFggAhRXPqGs';
function famOut(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function famSh(n){ return SpreadsheetApp.openById(FAM_SID).getSheetByName(n); }
function famHash(salt, p){ return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + '|' + p, Utilities.Charset.UTF_8)); }
function famRows(){ var sh = famSh('Семьи'), v = sh.getDataRange().getValues(); return { sh: sh, v: v }; }
function famFind(v, col, val){ for (var i = 1; i < v.length; i++) if (String(v[i][col]) === String(val)) return i; return -1; }
function famN(v){ return v == null || v === '' || isNaN(+v) ? null : Math.max(0, Math.min(9, Math.round(+v))); }
function famInvSh(){ var ss = SpreadsheetApp.openById(FAM_SID), sh = ss.getSheetByName('Приглашения'); if (!sh) { sh = ss.insertSheet('Приглашения'); sh.appendRow(['Код', 'Кому', 'Создано', 'Статус', 'Email', 'Использовано']); } return sh; }
function famLg(o){ var r = {}; ['pt', 'en', 'fr', 'de', 'es'].forEach(function(k){ if (o && o[k] != null && o[k] !== '') r[k] = famN(o[k]); }); return r; }
function famKids(s){ try { return JSON.parse(s || '[]'); } catch (e) { return []; } }
function famAuth(d){ var R = famRows(), i = famFind(R.v, 0, d.fid); if (i < 0 || String(R.v[i][9]) !== String(d.token)) return null; return { R: R, i: i, row: R.v[i] }; }
function famResp(row){ return { ok: true, fid: String(row[0]), token: String(row[9]), email: String(row[2]), name: String(row[3]), kids: famKids(row[6]), ppin: row[7] === '' ? null : String(row[7]), off: row[8] === 'отключена', sumOff: row[12] === 'нет' }; }
/* ===== Задания от родителей (Словоход): лист «Задания» — id, fid, kid, json, статус, версия, обновлено.
   Родитель с телефона создаёт и подтверждает, устройство ребёнка забирает и отмечает «Сделал». Побеждает запись с большей версией v. */
function famPtSh(){ var ss = SpreadsheetApp.openById(FAM_SID), sh = ss.getSheetByName('Задания'); if (!sh) { sh = ss.insertSheet('Задания'); sh.appendRow(['id', 'fid', 'Ребёнок', 'Задание (json)', 'Статус', 'Версия', 'Обновлено']); } return sh; }
function famPtClean(t){ var o = { id: String(t.id || '').slice(0, 40), kid: String(t.kid || '').slice(0, 30), kind: ['chore', 'quiz', 'read'].indexOf(t.kind) >= 0 ? t.kind : 'chore', title: String(t.title || '').slice(0, 120), text: String(t.text || '').slice(0, 6000), q: String(t.q || '').slice(0, 400),
    opts: (t.opts || []).slice(0, 4).map(function(x){ return String(x).slice(0, 120); }), pts: Math.max(0, Math.min(200, Math.round(+t.pts || 0))), st: String(t.st || 'new').slice(0, 10), v: Math.max(0, Math.round(+t.v || 0)), res: String(t.res || '').slice(0, 200), note: String(t.note || '').slice(0, 300), t: t.t || '', by: String(t.by || '').slice(0, 10) };
  return o; }
function famPtList(fid){ var v = famPtSh().getDataRange().getValues(), out = [], old = Date.now() - 30 * 86400000;
  for (var i = 1; i < v.length; i++) if (String(v[i][1]) === String(fid)) { var t; try { t = JSON.parse(v[i][3]); } catch (e) { continue; } if (t.st === 'del' || ((t.st === 'ok' || t.st === 'miss') && new Date(v[i][6]).getTime() < old)) continue; out.push(t); }
  return out.slice(-100); }
function famPt(a, d){ var sh = famPtSh(), v = sh.getDataRange().getValues(), now = new Date(), fid = String(a.row[0]);
  (d.items || []).slice(0, 50).forEach(function(x){ var t = famPtClean(x); if (!t.id) return; var r = -1; for (var i = 1; i < v.length; i++) if (String(v[i][0]) === t.id && String(v[i][1]) === fid) { r = i; break; }
    if (r < 0) { var row = [t.id, fid, t.kid, JSON.stringify(t), t.st, t.v, now]; sh.appendRow(row); v.push(row); }
    else if (t.v > (+v[r][5] || 0)) { sh.getRange(r + 1, 3, 1, 5).setValues([[t.kid, JSON.stringify(t), t.st, t.v, now]]); v[r][3] = JSON.stringify(t); v[r][5] = t.v; v[r][6] = now; } });
  return famPtList(fid); }
function famRoute(d){
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { return famRoute_(d); } catch (e) { return { ok: false, msg: 'Ошибка сервера: ' + e.message }; } finally { lock.releaseLock(); }
}
function famRoute_(d){
  var now = new Date(), R, i, a;
  if (d.fam === 'reg' || d.fam === 'login') {
    var em = String(d.email || '').trim().toLowerCase(), pw = String(d.pass || '');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em) || pw.length < 6) return { ok: false, msg: 'Проверьте email и пароль' };
    R = famRows(); i = famFind(R.v, 2, em);
    if (d.fam === 'reg') {
      if (i >= 0) return { ok: false, msg: 'Этот email уже зарегистрирован — нажмите «Войти»' };
      var IV = famInvSh(), iv = IV.getDataRange().getValues(), ii = famFind(iv, 0, String(d.inv || '').trim());
      if (!d.inv || ii < 0 || iv[ii][3] !== 'свободно') return { ok: false, inv: 'bad', msg: 'Регистрация только по личному приглашению, а эта ссылка уже использована или отозвана. Попросите новую.' };
      IV.getRange(ii + 1, 4, 1, 3).setValues([['использовано', em, now]]);
      var salt = Utilities.getUuid(), row = ['f' + now.getTime().toString(36), now, em, String(d.name || '').slice(0, 60), salt, famHash(salt, pw), '[]', '', 'активна', Utilities.getUuid(), now, 0];
      R.sh.appendRow(row); return famResp(row);
    }
    if (i < 0 || famHash(String(R.v[i][4]), pw) !== String(R.v[i][5])) return { ok: false, msg: 'Неверный email или пароль' };
    R.sh.getRange(i + 1, 11).setValue(now); return famResp(R.v[i]);
  }
  if (d.fam === 'admin') {
    if (String(d.key || '') !== String(famSh('Настройки').getRange('A1').getValue())) return { ok: false, msg: 'Неверный ключ' };
    R = famRows();
    if (d.op === 'inv') { famInvSh().appendRow(['s' + Utilities.getUuid().replace(/-/g, '').slice(0, 9), String(d.label || '').slice(0, 60), now, 'свободно', '', '']); }
    if (d.op === 'invoff') { var IS = famInvSh(), IL = IS.getDataRange().getValues(), ix = famFind(IL, 0, d.code); if (ix > 0 && IL[ix][3] === 'свободно') IS.getRange(ix + 1, 4).setValue('отозвано'); }
    if (d.op === 'set') { i = famFind(R.v, 0, d.fid); if (i < 0) return { ok: false, msg: 'Нет такой семьи' }; R.sh.getRange(i + 1, 9).setValue(d.on ? 'активна' : 'отключена'); R = famRows(); }
    var fams = R.v.slice(1).filter(function(r){ return r[0]; }).map(function(r){ return { fid: String(r[0]), created: r[1], email: r[2], name: r[3], kids: famKids(r[6]).map(function(k){ return { name: k.name, age: k.age, sex: k.sex || '', ints: k.ints || [], hero: k.hero || '', books: k.books || '', done: k.done || '', rd: k.rd, rt: k.rt, vw: k.vw, wr: k.wr, mt: k.mt, at: k.at, er: k.er, dk: k.dk, mo: k.mo, lg: k.lg || {} }; }), off: r[8] === 'отключена', last: r[10], events: r[11] || 0 }; });
    var fb = famSh('Отзывы').getDataRange().getValues().slice(1).slice(-50).reverse().map(function(r){ return { t: r[0], email: r[2], text: r[3] }; });
    var invs = famInvSh().getDataRange().getValues().slice(1).filter(function(r){ return r[0]; }).map(function(r){ return { code: String(r[0]), label: r[1], t: r[2], st: r[3], email: r[4], used: r[5] }; }).reverse();
    return { ok: true, fams: fams, fb: fb, invs: invs };
  }
  a = famAuth(d); if (!a) return { ok: false, err: 'auth' };
  var off = a.row[8] === 'отключена';
  if (d.fam === 'st') { a.R.sh.getRange(a.i + 1, 11).setValue(now); var st = { ok: true, off: off }; if (d.pt) try { st.pt = famPtList(a.row[0]); } catch (e) {} return st; }
  if (off) return { ok: false, off: true };
  if (d.fam === 'kids') {
    var kids = (d.kids || []).slice(0, 5).map(function(k){ return { id: String(k.id).slice(0, 30), name: String(k.name).slice(0, 20), age: +k.age, sex: k.sex === 'f' || k.sex === 'm' ? k.sex : '', look: String(k.look || '').slice(0, 10), ints: (k.ints || []).slice(0, 15).map(String), hero: String(k.hero || '').slice(0, 80), books: String(k.books || '').slice(0, 200), done: String(k.done || '').slice(0, 300), rd: k.rd == null ? null : +k.rd, color: String(k.color || '').slice(0, 10), pin: k.pin ? String(k.pin) : null, rt: famN(k.rt), vw: famN(k.vw), wr: famN(k.wr), mt: famN(k.mt), at: famN(k.at), er: famN(k.er), dk: famN(k.dk), mo: famN(k.mo), lg: famLg(k.lg) }; });
    a.R.sh.getRange(a.i + 1, 7, 1, 2).setValues([[JSON.stringify(kids), d.ppin ? "'" + String(d.ppin) : '']]); return { ok: true };
  }
  if (d.fam === 'ev') {
    var ev = (d.events || []).slice(0, 200), rows = ev.map(function(e){ var x = {}, k; for (k in e) if (k !== 't' && k !== 'kid' && k !== 'type') x[k] = e[k]; return [e.t ? new Date(e.t) : now, a.row[0], a.row[2], e.kid || '', e.type || '', JSON.stringify(x).slice(0, 2000)]; });
    if (rows.length) { var es = famSh('События'); es.getRange(es.getLastRow() + 1, 1, rows.length, 6).setValues(rows); a.R.sh.getRange(a.i + 1, 12).setValue((+a.row[11] || 0) + rows.length); }
    a.R.sh.getRange(a.i + 1, 11).setValue(now); return { ok: true };
  }
  if (d.fam === 'snap') return famSnapSave(a, d, now);
  if (d.fam === 'snapget') return famSnapGet(a, d);
  if (d.fam === 'sum') { var su = famSum(a.row, now); if (d.mail) { var sr = famSumMail(a.row, su, 'по кнопке'); su.mailed = sr.ok; if (!sr.ok) su.mailErr = sr.msg; } return su; }
  if (d.fam === 'sumset') { famSumCol(a.R.sh); a.R.sh.getRange(a.i + 1, 13).setValue(d.on ? '' : 'нет'); return { ok: true, on: !!d.on }; }
  if (d.fam === 'pt') return { ok: true, pt: famPt(a, d) };
  if (d.fam === 'fb') { famSh('Отзывы').appendRow([now, a.row[0], a.row[2], String(d.text || '').slice(0, 2000)]); return { ok: true }; }
  return { ok: false, msg: 'Неизвестная команда' };
}

/* ===== Сводка для родителей и синхронизация прогресса (22.11.2026) =====
   Лист «Снимки»: семья | ребёнок (id) | t (мс) | обновлено | день (JSON: план уроков, баллы сегодня) | частей | части снимка по 45000 знаков.
   Снимок — прогресс ребёнка с его устройства; родитель видит его на своём телефоне. Хранится самый новый (по t).
   Вечерняя сводка: famEvening по расписанию 20:30 и 21:30 (Лиссабон), повтор только тем, кому письмо ещё не ушло. Журнал — лист «Сводки».
   Установить расписание один раз: запустить famSumSetup в редакторе (заодно спросит разрешение на отправку писем).
   Опубликовано 22.11.2026: версия развертывания 15 (вместе с заданиями от родителей). */
var FAM_TZ = 'Europe/Lisbon', FAM_PART = 45000;
function famSnapSh(){ var ss = SpreadsheetApp.openById(FAM_SID), sh = ss.getSheetByName('Снимки'); if (!sh) { sh = ss.insertSheet('Снимки'); sh.appendRow(['Семья', 'Ребёнок', 't', 'Обновлено', 'День', 'Частей', 'Снимок']); } return sh; }
function famSumCol(sh){ if (!sh.getRange(1, 13).getValue()) sh.getRange(1, 13).setValue('Сводка'); }
function famSnapRows(fid){ var sh = famSnapSh(), n = sh.getLastRow(); if (n < 2) return { sh: sh, rows: [] };
  var v = sh.getRange(2, 1, n - 1, 6).getValues(), out = []; for (var i = 0; i < v.length; i++) if (String(v[i][0]) === fid) out.push({ r: i + 2, kid: String(v[i][1]), t: +v[i][2] || 0, day: v[i][4], n: +v[i][5] || 0 }); return { sh: sh, rows: out }; }
function famSnapSave(a, d, now){
  var fid = String(a.row[0]), kid = String(d.kid || '').slice(0, 30), t = +d.t || 0, st = String(d.state || '');
  if (!kid || !t || !st || st.length > 3000000) return { ok: false, msg: 'Пустой снимок' };
  var S = famSnapRows(fid), x = S.rows.filter(function(r){ return r.kid === kid; })[0];
  var day = d.day ? JSON.stringify(d.day).slice(0, 20000) : '';
  if (x && x.t >= t) { if (day) S.sh.getRange(x.r, 5).setValue(day); return { ok: true, old: true, t: x.t }; }
  var parts = []; for (var p = 0; p < st.length; p += FAM_PART) parts.push(st.slice(p, p + FAM_PART));
  var row = [fid, kid, t, now, day, parts.length].concat(parts), r = x ? x.r : S.sh.getLastRow() + 1;
  if (x && x.n > parts.length) S.sh.getRange(r, 7 + parts.length, 1, x.n - parts.length).clearContent();
  S.sh.getRange(r, 1, 1, row.length).setValues([row]);
  return { ok: true, t: t };
}
function famSnapGet(a, d){
  var fid = String(a.row[0]), want = d.kids && d.kids.length ? d.kids.map(String) : null, have = d.have || {}, S = famSnapRows(fid), out = [];
  S.rows.forEach(function(x){ if (want && want.indexOf(x.kid) < 0) return; if (have[x.kid] && +have[x.kid] >= x.t) { out.push({ kid: x.kid, t: x.t }); return; }
    var st = x.n ? S.sh.getRange(x.r, 7, 1, x.n).getValues()[0].join('') : ''; out.push({ kid: x.kid, t: x.t, state: st }); });
  return { ok: true, snaps: out };
}
function famDayStr(dt){ return Utilities.formatDate(dt, FAM_TZ, 'yyyy-MM-dd'); }
/* События семьи за день (с конца листа, последние 30000 строк) */
function famEvDay(fid, day){
  var sh = famSh('События'), n = sh.getLastRow(); if (n < 2) return [];
  var from = Math.max(2, n - 30000 + 1), v = sh.getRange(from, 1, n - from + 1, 6).getValues(), out = [];
  for (var i = 0; i < v.length; i++) { if (String(v[i][1]) !== fid) continue; var t = v[i][0] instanceof Date ? v[i][0] : new Date(v[i][0]); if (isNaN(t) || famDayStr(t) !== day) continue;
    var x = {}; try { x = JSON.parse(v[i][5] || '{}'); } catch (e) {} x.t = t; x.kid = String(v[i][3]); x.type = String(v[i][4]); out.push(x); }
  return out;
}
var FAM_MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
function famDayHuman(day){ var p = day.split('-'); return +p[2] + ' ' + FAM_MON[+p[1] - 1]; }
function famPl(n, a, b, c){ n = Math.abs(n) % 100; var m = n % 10; return n > 10 && n < 20 ? c : m === 1 ? a : m >= 2 && m <= 4 ? b : c; }
function famClean(s, n){ s = String(s == null ? '' : s).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/[☀-➿\uD83C-􏰀-\uDFFF️‍]/g, '').replace(/\s+/g, ' ').trim(); return n && s.length > n ? s.slice(0, n - 1) + '…' : s; }
function famUniq(a){ var o = []; a.forEach(function(x){ if (x && o.indexOf(x) < 0) o.push(x); }); return o; }
/* Сводка за сегодня по всем детям семьи: { ok, day, at, kids: [{ name, lines: [] }], text } */
function famSum(row, now){
  var fid = String(row[0]), day = famDayStr(now), kids = famKids(row[6]), E = famEvDay(fid, day), SN = famSnapRows(fid).rows;
  var res = { ok: true, day: day, dayH: famDayHuman(day), at: Utilities.formatDate(now, FAM_TZ, 'HH:mm'), kids: [] };
  kids.forEach(function(k){
    var f = k.sex === 'f', V = function(m, w){ return f ? w : m; }, e = E.filter(function(x){ return x.kid === k.name; }), L = [];
    var sn = SN.filter(function(x){ return x.kid === String(k.id); })[0], di = null; try { di = sn && sn.day ? JSON.parse(sn.day) : null; } catch (x) {}
    var today = di && di.d === day ? di : null, plan = (di && di.plan) || [];
    var fin = e.filter(function(x){ return x.type === 'урок завершён'; });
    if (!e.length && !(today && today.plan.some(function(p){ return p.st; }))) {
      L.push('Сегодня не ' + V('занимался', 'занималась') + '.' + (plan.length ? ' Уроков в плане на день: ' + plan.length + '.' : ''));
      if (di && di.coins != null) L.push('Баллов на счету: ' + di.coins + '.');
      res.kids.push({ name: k.name, lines: L }); return; }
    if (today && plan.length) {
      var dn = plan.filter(function(p){ return p.st === 'done'; }), go = plan.filter(function(p){ return p.st === 'go'; }), no = plan.filter(function(p){ return !p.st; });
      L.push('Уроки: сделано ' + dn.length + ' из ' + plan.length + (dn.length ? ' (' + dn.map(function(p){ return famClean(p.n) + (p.g ? ', оценка ' + p.g : ''); }).join('; ') + ')' : '') + '.');
      if (go.length) L.push('Начаты, но не закончены: ' + go.map(function(p){ return famClean(p.n); }).join(', ') + '.');
      L.push(no.length ? 'Не сделано: ' + no.map(function(p){ return famClean(p.n); }).join(', ') + '.' : (go.length ? '' : 'Все уроки дня сделаны.'));
    } else if (fin.length) L.push('Уроков сделано: ' + fin.length + ' (' + fin.map(function(x){ return famClean(x.subj) + (x.grade ? ', оценка ' + x.grade : ''); }).join('; ') + ').');
    else L.push('Уроки сегодня ещё не ' + V('закончил', 'закончила') + '.');
    if (today) L.push('Баллы: +' + (today.pts || 0) + ' за сегодня, всего на счету ' + (today.coins || 0) + '.' + (today.secs ? ' В уроках ' + Math.max(1, Math.round(today.secs / 60)) + ' мин.' : ''));
    var ans = e.filter(function(x){ return x.type === 'ответ' || x.type === 'загадка' || x.type === 'задача на смекалку' || x.type === 'головоломка'; }), bad = ans.filter(function(x){ return x.ok === 'ошибка'; });
    if (ans.length) { L.push('Ответов: ' + ans.length + ', ошибок: ' + bad.length + '.');
      bad.slice(-4).forEach(function(x){ L.push('— ' + famClean(x.subj, 30) + ': ' + famClean(x.q, 90) + (x.ans ? ' — ' + V('ответил', 'ответила') + ' «' + famClean(x.ans, 40) + '»' : '') + (x.right ? ', верно «' + famClean(x.right, 40) + '»' : '') + '.'); }); }
    var rd = e.filter(function(x){ return x.type === 'чтение вслух'; }), heard = rd.filter(function(x){ return x.wpm && x.acc !== '' && x.acc != null && !/^темп по времени/.test(String(x.errs || '')); });
    if (rd.length) L.push('Чтение вслух: ' + famUniq(rd.map(function(x){ return '«' + famClean(x.unit, 60) + '»'; })).join(', ') + '.' + (heard.length ? ' Темп ' + heard.map(function(x){ return x.wpm; }).join(', ') + ' ' + famPl(+heard[heard.length - 1].wpm, 'слово', 'слова', 'слов') + ' в минуту, точность ' + heard[heard.length - 1].acc + '.' : ''));
    var sil = e.filter(function(x){ return x.type === 'чтение про себя'; }); if (sil.length) L.push('Чтение про себя: ' + sil.length + ' ' + famPl(sil.length, 'текст', 'текста', 'текстов') + '.');
    var nu = e.filter(function(x){ return x.type === 'не понимаю'; }); L.push(nu.length ? '«Не понимаю»: ' + nu.length + ' ' + famPl(nu.length, 'раз', 'раза', 'раз') + ' (' + famUniq(nu.map(function(x){ return famClean(x.subj); })).join(', ') + ').' : '«Не понимаю» не ' + V('нажимал', 'нажимала') + '.');
    var ex = { 'шахматы': 'шахматы', 'загадка': 'загадки', 'головоломка': 'головоломки', 'задача на смекалку': 'задачи на смекалку', 'программирование': 'программирование' }, xs = famUniq(e.filter(function(x){ return ex[x.type]; }).map(function(x){ return ex[x.type]; }));
    if (xs.length) L.push('Ещё ' + V('занимался', 'занималась') + ': ' + xs.join(', ') + '.');
    res.kids.push({ name: k.name, lines: L.filter(Boolean) });
  });
  res.text = 'Сводка за ' + res.dayH + ', на ' + res.at + '\n\n' + res.kids.map(function(k){ return k.name + '\n' + k.lines.join('\n'); }).join('\n\n');
  return res;
}
function famSumLog(){ var ss = SpreadsheetApp.openById(FAM_SID), sh = ss.getSheetByName('Сводки'); if (!sh) { sh = ss.insertSheet('Сводки'); sh.appendRow(['Время', 'День', 'Семья', 'Email', 'Как', 'Итог']); } return sh; }
function famSumMail(row, su, how){
  var em = String(row[2] || ''); if (!em) return { ok: false, msg: 'Нет email' };
  var names = su.kids.map(function(k){ return k.name; }).join(' и '), esc = function(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var foot = 'Подробнее — в разделе «Для родителей»: https://slovohod.com\nВечерние письма можно отключить там же, в «Настройках».';
  var html = '<div style="font-family:Georgia,serif;color:#1f2a22;max-width:560px"><p style="color:#2D4A32;font-size:20px;margin:0 0 4px"><b>Словоход</b></p><p style="color:#6b7280;margin:0 0 16px">Сводка за ' + su.dayH + ', на ' + su.at + '</p>' +
    su.kids.map(function(k){ return '<h3 style="color:#2D4A32;margin:16px 0 6px">' + esc(k.name) + '</h3>' + k.lines.map(function(l){ return '<p style="margin:0 0 6px;line-height:1.45">' + esc(l) + '</p>'; }).join(''); }).join('') +
    '<p style="color:#6b7280;font-size:13px;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:10px">Подробнее — в разделе «Для родителей»: <a href="https://slovohod.com" style="color:#C28A2C">slovohod.com</a>. Вечерние письма можно отключить там же, в «Настройках».</p></div>';
  try { MailApp.sendEmail({ to: em, subject: 'Словоход: ' + names + ' — сводка за ' + su.dayH, body: su.text + '\n\n' + foot, htmlBody: html, name: 'Словоход' });
    famSumLog().appendRow([new Date(), su.day, String(row[0]), em, how, 'отправлено']); return { ok: true }; }
  catch (e) { famSumLog().appendRow([new Date(), su.day, String(row[0]), em, how, 'ошибка: ' + e.message]); return { ok: false, msg: e.message }; }
}
/* Вечерняя рассылка: всем активным семьям с детьми, кроме отключивших; повторный запуск шлёт только тем, кому сегодня ещё не ушло */
function famEvening(){
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try { var now = new Date(), day = famDayStr(now), R = famRows(), lg = famSumLog().getDataRange().getValues(), sent = {};
    lg.forEach(function(r){ if (String(r[1]) === day && r[4] === 'вечер' && r[5] === 'отправлено') sent[String(r[2])] = 1; });
    for (var i = 1; i < R.v.length; i++) { var row = R.v[i]; if (!row[0] || !row[2] || row[8] === 'отключена' || row[12] === 'нет' || sent[String(row[0])] || !famKids(row[6]).length) continue;
      try { famSumMail(row, famSum(row, now), 'вечер'); } catch (e) { famSumLog().appendRow([new Date(), day, String(row[0]), row[2], 'вечер', 'ошибка: ' + e.message]); } }
  } finally { lock.releaseLock(); }
}
function famSumSetup(){
  ScriptApp.getProjectTriggers().forEach(function(t){ if (t.getHandlerFunction() === 'famEvening') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('famEvening').timeBased().atHour(20).nearMinute(30).everyDays(1).inTimezone(FAM_TZ).create();
  ScriptApp.newTrigger('famEvening').timeBased().atHour(21).nearMinute(30).everyDays(1).inTimezone(FAM_TZ).create();
  famSumCol(famRows().sh); famSnapSh(); famSumLog();
  Logger.log('Писем можно отправить сегодня: ' + MailApp.getRemainingDailyQuota());
}
