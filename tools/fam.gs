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
function famKids(s){ try { return JSON.parse(s || '[]'); } catch (e) { return []; } }
function famAuth(d){ var R = famRows(), i = famFind(R.v, 0, d.fid); if (i < 0 || String(R.v[i][9]) !== String(d.token)) return null; return { R: R, i: i, row: R.v[i] }; }
function famResp(row){ return { ok: true, fid: String(row[0]), token: String(row[9]), email: String(row[2]), name: String(row[3]), kids: famKids(row[6]), ppin: row[7] === '' ? null : String(row[7]), off: row[8] === 'отключена' }; }
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
      var salt = Utilities.getUuid(), row = ['f' + now.getTime().toString(36), now, em, String(d.name || '').slice(0, 60), salt, famHash(salt, pw), '[]', '', 'активна', Utilities.getUuid(), now, 0];
      R.sh.appendRow(row); return famResp(row);
    }
    if (i < 0 || famHash(String(R.v[i][4]), pw) !== String(R.v[i][5])) return { ok: false, msg: 'Неверный email или пароль' };
    R.sh.getRange(i + 1, 11).setValue(now); return famResp(R.v[i]);
  }
  if (d.fam === 'admin') {
    if (String(d.key || '') !== String(famSh('Настройки').getRange('A1').getValue())) return { ok: false, msg: 'Неверный ключ' };
    R = famRows();
    if (d.op === 'set') { i = famFind(R.v, 0, d.fid); if (i < 0) return { ok: false, msg: 'Нет такой семьи' }; R.sh.getRange(i + 1, 9).setValue(d.on ? 'активна' : 'отключена'); R = famRows(); }
    var fams = R.v.slice(1).filter(function(r){ return r[0]; }).map(function(r){ return { fid: String(r[0]), created: r[1], email: r[2], name: r[3], kids: famKids(r[6]).map(function(k){ return { name: k.name, age: k.age, ints: k.ints || [], hero: k.hero || '', books: k.books || '', done: k.done || '', rd: k.rd, rt: k.rt, vw: k.vw, wr: k.wr, mt: k.mt, at: k.at, er: k.er, dk: k.dk, mo: k.mo }; }), off: r[8] === 'отключена', last: r[10], events: r[11] || 0 }; });
    var fb = famSh('Отзывы').getDataRange().getValues().slice(1).slice(-50).reverse().map(function(r){ return { t: r[0], email: r[2], text: r[3] }; });
    return { ok: true, fams: fams, fb: fb };
  }
  a = famAuth(d); if (!a) return { ok: false, err: 'auth' };
  var off = a.row[8] === 'отключена';
  if (d.fam === 'st') { a.R.sh.getRange(a.i + 1, 11).setValue(now); return { ok: true, off: off }; }
  if (off) return { ok: false, off: true };
  if (d.fam === 'kids') {
    var kids = (d.kids || []).slice(0, 5).map(function(k){ return { id: String(k.id).slice(0, 30), name: String(k.name).slice(0, 20), age: +k.age, look: String(k.look || '').slice(0, 10), ints: (k.ints || []).slice(0, 15).map(String), hero: String(k.hero || '').slice(0, 80), books: String(k.books || '').slice(0, 200), done: String(k.done || '').slice(0, 300), rd: k.rd == null ? null : +k.rd, color: String(k.color || '').slice(0, 10), pin: k.pin ? String(k.pin) : null, rt: famN(k.rt), vw: famN(k.vw), wr: famN(k.wr), mt: famN(k.mt), at: famN(k.at), er: famN(k.er), dk: famN(k.dk), mo: famN(k.mo) }; });
    a.R.sh.getRange(a.i + 1, 7, 1, 2).setValues([[JSON.stringify(kids), d.ppin ? "'" + String(d.ppin) : '']]); return { ok: true };
  }
  if (d.fam === 'ev') {
    var ev = (d.events || []).slice(0, 200), rows = ev.map(function(e){ var x = {}, k; for (k in e) if (k !== 't' && k !== 'kid' && k !== 'type') x[k] = e[k]; return [e.t ? new Date(e.t) : now, a.row[0], a.row[2], e.kid || '', e.type || '', JSON.stringify(x).slice(0, 2000)]; });
    if (rows.length) { var es = famSh('События'); es.getRange(es.getLastRow() + 1, 1, rows.length, 6).setValues(rows); a.R.sh.getRange(a.i + 1, 12).setValue((+a.row[11] || 0) + rows.length); }
    a.R.sh.getRange(a.i + 1, 11).setValue(now); return { ok: true };
  }
  if (d.fam === 'fb') { famSh('Отзывы').appendRow([now, a.row[0], a.row[2], String(d.text || '').slice(0, 2000)]); return { ok: true }; }
  return { ok: false, msg: 'Неизвестная команда' };
}
