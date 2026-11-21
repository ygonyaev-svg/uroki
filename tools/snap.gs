/* ===== Резервная копия прогресса детей (добавлено в Код.gs скрипта синхронизации) =====
   doPost, первой строкой после разбора JSON: if (_fd && _fd.snap) return snapOut_(snapSave_(_fd));
   doGet, первой строкой: if (e.parameter.action === 'snap') return snapOut_(snapGet_(String(e.parameter.kid || '')));
   Лист «Снимки»: kid | t (мс) | дата | число частей | части JSON по 45000 символов. */
function snapSh_(){ const ss = SpreadsheetApp.openById(SID); return ss.getSheetByName('Снимки') || ss.insertSheet('Снимки'); }
function snapSave_(d){ /* сохраняет, только если снимок новее */ }
function snapGet_(kid){ /* { ok, t, state } */ }
function snapOut_(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
