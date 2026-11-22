/* ===== Мои книги: чтение вслух по бумажной книге =====
   Ребёнок фотографирует разворот → проверка фото (темно/пересвет/размыто) → распознавание текста скриптом таблицы (Google OCR)
   → на экране тот же текст, прочитанное подсвечивается зелёным, пропуски — красным, считаются темп и точность → следующий разворот.
   Две неудачи с фото подряд → режим «просто слушаю»: темп по услышанным словам, без точных ошибок. */
var BR = null, BK_OCR_BUSY = false;
function bkAloudN(kid, t){ return t.aloud != null ? +t.aloud : (T(kid) === 'yarik' ? 99 : 1); }
/* Проверка фото до отправки: средняя яркость и резкость (дисперсия лапласиана) на уменьшенной копии */
function bkQuality(data, cb){
  var img = new Image();
  img.onload = function(){ try {
    var w = 320, h = Math.max(1, Math.round(img.height * w / img.width)), c = document.createElement('canvas'); c.width = w; c.height = h;
    var g = c.getContext('2d'); g.drawImage(img, 0, 0, w, h); var d = g.getImageData(0, 0, w, h).data, L = new Float32Array(w * h), sum = 0;
    for (var i = 0, j = 0; i < d.length; i += 4, j++) { L[j] = .299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2]; sum += L[j]; }
    var mean = sum / (w * h), s1 = 0, s2 = 0, n = 0;
    for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) { var k = y * w + x, v = 4 * L[k] - L[k - 1] - L[k + 1] - L[k - w] - L[k + w]; s1 += v; s2 += v * v; n++; }
    var lap = n ? s2 / n - (s1 / n) * (s1 / n) : 0;
    cb({ mean: Math.round(mean), lap: Math.round(lap), dark: mean < 75, bright: mean > 245, blur: lap < 30 });
  } catch (e) { cb({ ok: true }); } };
  img.onerror = function(){ cb({ ok: true }); }; img.src = data;
}
function bkWords(text){ return String(text || '').replace(/\r/g, '').replace(/([А-Яа-яЁё])[-\u00AD]\s*\n\s*([а-яё])/g, '$1$2').replace(/([А-Яа-яЁё])-([А-Яа-яЁё])/g, '$1- $2').split('\n').filter(function(l){ return /[А-Яа-яЁё]{2,}/.test(l); }).join('\n').split(/\s+/).filter(function(w){ return /[А-Яа-яЁё]/.test(w); }); }
function bkOcr(kid, b, t, data){
  var P = bkProg(b, t.id); BK_OCR_BUSY = true; P.ocrMsg = 'Читаю текст с фото…'; save(); render();
  var done = false, to = setTimeout(function(){ fin(null, 'долго нет ответа'); }, 45000);
  function fin(res, why){ if (done) return; done = true; clearTimeout(to); BK_OCR_BUSY = false;
    var words = res && res.ok ? bkWords(res.text) : [], need = T(kid) === 'yarik' ? 8 : 25;
    if (words.length >= need) { P.bad = 0; P.ocrMsg = ''; P.cur = { text: words.join(' '), n: words.length, t: Date.now() }; P.ph = 'aloud'; BR = null;
      ev(kid, 'книга: разворот распознан', { subj: '📚 Книга', unit: (b.title || b.id) + ' · ' + (t.title || ''), words: words.length }); }
    else bkBadPhoto(kid, b, t, res && !res.ok ? 'server' : 'few', why || (res && res.msg));
    save(); render(); }
  try {
    fetch(S.cfg.sync, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ ocr: { kid: KIDS[kid].name, book: b.id, kind: 'разворот', task: t.id, n: ++BK_SEQ, data: data } }) })
      .then(function(r){ return r.text(); }).then(function(x){ var j = null; try { j = JSON.parse(x); } catch (e) {} fin(j || { ok: false, msg: 'нет ответа' }); })
      .catch(function(e){ fin({ ok: false, msg: String(e) }); });
  } catch (e) { fin({ ok: false, msg: String(e) }); }
}
var BK_BAD = {
  dark: 'Темновато. Включи свет или подойди к окну и сфотографируй ещё раз.',
  bright: 'Слишком ярко, блики. Отодвинься от лампы и сфотографируй ещё раз.',
  blur: 'Фото размытое. Держи айпад крепко двумя руками, подожди секунду и сфотографируй ещё раз.',
  few: 'Не получилось прочитать текст. Положи книгу ровно, чтобы обе страницы были целиком в кадре, и сфотографируй ещё раз.',
  server: 'Не получилось прочитать текст. Попробуй ещё раз.'
};
function bkBadPhoto(kid, b, t, why, info){
  var P = bkProg(b, t.id); P.bad = (P.bad || 0) + 1; P.ocrMsg = '';
  ev(kid, 'книга: фото не подошло', { subj: '📚 Книга', unit: (b.title || b.id) + ' · ' + (t.title || ''), text: why + (info ? ': ' + String(info).slice(0, 200) : '') + '; попытка ' + P.bad });
  if (P.bad >= 2) { P.mode = 'listen'; P.ph = 'listen'; P.bad = 0; BR = null; say('Ничего страшного. Читай вслух по книге, а я буду слушать.', 'ru-RU'); return; }
  P.badMsg = BK_BAD[why] || BK_BAD.few; say(P.badMsg, 'ru-RU');
}
function bkSpreadPhoto(kid, b, t, data){
  var P = bkProg(b, t.id); P.badMsg = '';
  bkQuality(data, function(q){
    if (q.dark || q.bright || q.blur) { bkBadPhoto(kid, b, t, q.dark ? 'dark' : q.bright ? 'bright' : 'blur', 'яркость ' + q.mean + ', резкость ' + q.lap); save(); render(); return; }
    bkOcr(kid, b, t, data);
  });
}
/* --- живое чтение --- */
function brStart(){
  var kid = cur.kid, b = bkFind(kid, cur.bk), t = b && bkCurTask(b), P = t && bkProg(b, t.id); if (!P) return;
  var listen = P.ph === 'listen', Tw = listen ? null : P.cur.text.split(/\s+/).map(normW);
  var sv = BR && BR.paused ? BR : null;
  BR = { active: true, t0: Date.now(), acc: sv ? sv.acc : 0, T: Tw, st: sv ? sv.st : (Tw ? new Array(Tw.length).fill(0) : null), p: sv ? sv.p : 0, base: sv ? sv.base : '', cur: '', heard: sv ? sv.heard : 0, denied: false };
  if (SR) { var rec = new SR(); rec.lang = 'ru-RU'; rec.continuous = true; rec.interimResults = true; BR.rec = rec; var R0 = BR;
    rec.onresult = function(e){ var s = ''; for (var i = 0; i < e.results.length; i++) s += ' ' + e.results[i][0].transcript; R0.cur = s; brUpd(); };
    rec.onerror = function(e){ if (e.error === 'not-allowed' || e.error === 'service-not-allowed') R0.denied = true; };
    rec.onend = function(){ R0.base += ' ' + R0.cur; R0.cur = ''; if (R0.active && !R0.denied) setTimeout(function(){ try { rec.start(); } catch (x) {} }, 120); };
    try { rec.start(); } catch (e) {} }
  render();
}
function brSecs(){ return BR ? (BR.acc || 0) + (BR.active ? (Date.now() - BR.t0) / 1000 : 0) : 0; }
function brPause(){ if (!BR || !BR.active) return; BR.acc = brSecs(); BR.active = false; try { BR.rec && BR.rec.stop(); } catch (e) {} BR.base += ' ' + (BR.cur || ''); BR.cur = ''; BR.paused = true; render(); }
function brUpd(){
  var spoken = (BR.base + ' ' + BR.cur).split(/\s+/).map(normW).filter(Boolean); BR.heard = spoken.length;
  var stat = document.getElementById('brstat');
  if (!BR.T) { if (stat) stat.textContent = 'Слышу тебя: ' + spoken.length + ' ' + U.pl(spoken.length, 'слово', 'слова', 'слов'); return; }
  var r = align(BR.T, spoken); BR.st = r.st; BR.p = r.p;
  var els = document.querySelectorAll('#bktext .w'); for (var i = 0; i < els.length; i++) { var k = +els[i].getAttribute('data-i'); els[i].className = 'w ' + wCls(r.st, k, r.p); }
  var c = document.querySelector('#bktext .w.rc'); if (c && c.scrollIntoView) try { c.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { c.scrollIntoView(); }
  if (stat) stat.textContent = 'Прочитано ' + r.p + ' из ' + BR.T.length;
}
function brDone(){
  var kid = cur.kid, b = bkFind(kid, cur.bk), t = b && bkCurTask(b), P = t && bkProg(b, t.id); if (!P || !BR) return;
  var secs = Math.max(5, brSecs()), K = S.kids[kid], listen = !BR.T, useSR = SR && !BR.denied && (listen ? BR.heard > 0 : BR.p > 0);
  var n = listen ? 0 : BR.T.length, minS = (listen ? 60 : n / (KIDS[kid].norm * 1.8) * 60);
  if (!useSR && secs < minS) { alertMsg('Слишком быстро 🙂 Почитай ещё примерно ' + Math.max(1, Math.ceil((minS - secs) / 60)) + ' мин'); return; }
  if (!listen && useSR && BR.p < n * .7 && secs < n / (KIDS[kid].norm * 1.2) * 60) { alertMsg('Дочитай разворот до конца 🙂'); return; }
  BR.active = false; try { BR.rec && BR.rec.stop(); } catch (e) {}
  var words = listen ? (useSR ? BR.heard : 0) : (useSR ? Math.max(BR.p, Math.round(n * .7)) : n);
  var wpm = words ? Math.round(words / (secs / 60)) : 0, acc = null, errs = [];
  if (!listen && useSR) { var tw = P.cur.text.split(/\s+/), okc = 0, bad = 0; for (var k = 0; k < BR.p; k++) { if (BR.st[k] === 1) okc++; else if (BR.st[k] === 2) { bad++; errs.push(tw[k].replace(/[«»"'.,!?:;()—–-]/g, '')); } } acc = okc / Math.max(1, okc + bad); }
  var rec = { words: words, secs: Math.round(secs), wpm: wpm, acc: acc, errs: errs.slice(0, 15), listen: listen };
  (P.sp = P.sp || []).push(rec); P.secs = (P.secs || 0) + rec.secs; BR = null; P.cur = null;
  K.words = (K.words || 0) + words; if (wpm) K.reading.push({ d: U.today(), title: (b.title || 'Книга'), wpm: wpm, acc: acc, lang: 'ru', errs: errs.slice(0, 10), paper: 1 });
  errs.forEach(function(w){ if (!w) return; var h = K.hard[w] || (K.hard[w] = { miss: 0, ok: 0 }); h.miss++; });
  ev(kid, 'чтение вслух', { subj: '📚 Книга', unit: (b.title || b.id) + ' · ' + (t.title || '') + (listen ? ' (без текста)' : ' (разворот ' + P.sp.length + ')'), wpm: wpm, acc: acc == null ? '' : Math.round(acc * 100) + '%', words: words, secs: rec.secs, errs: errs.join(', ') });
  P.ph = 'between'; save(); render(); window.scrollTo(0, 0);
}
function bkAfterAloud(kid, b, t){ var P = bkProg(b, t.id); P.ph = t.kw && t.kw.length ? 'retell' : (t.qs || []).length ? 'qs' : t.snap ? 'snap' : 'end'; P.i = 0; save(); if (P.ph === 'end') bkFinish(kid, b, t); else render(); }
/* Картинка: как фотографировать разворот */
function bkSpreadPic(){
  var bk = function(x, y, s, rot, dark, finger){ var w = 120 * s, h = 80 * s;
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')">' + '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" fill="' + (dark ? '#8a8270' : '#fbf7ea') + '" stroke="#9c8f6a"/><line x1="0" y1="' + (-h / 2) + '" x2="0" y2="' + (h / 2) + '" stroke="#9c8f6a"/>' +
      [0, 1, 2, 3, 4].map(function(i){ var yy = -h / 2 + 12 * s + i * 12 * s; return '<rect x="' + (-w / 2 + 8 * s) + '" y="' + yy + '" width="' + (w / 2 - 16 * s) + '" height="' + 3 * s + '" fill="' + (dark ? '#5d574a' : '#999') + '"/><rect x="' + (8 * s) + '" y="' + yy + '" width="' + (w / 2 - 16 * s) + '" height="' + 3 * s + '" fill="' + (dark ? '#5d574a' : '#999') + '"/>'; }).join('') +
      (finger ? '<ellipse cx="' + (w / 2 - 14 * s) + '" cy="' + (h / 2 - 16 * s) + '" rx="' + 12 * s + '" ry="' + 22 * s + '" fill="#e8b48f"/>' : '') + '</g>'; };
  return '<svg class="bkpic" viewBox="0 0 360 210" role="img" aria-label="Как фотографировать разворот">' + BK_ARR +
    '<rect x="8" y="8" width="200" height="150" rx="14" fill="#222"/><rect x="18" y="18" width="180" height="130" rx="6" fill="#dfe9f2"/>' + bk(108, 83, 1.3, 0) +
    '<rect x="22" y="24" width="172" height="118" fill="none" stroke="#23824a" stroke-width="2.5" stroke-dasharray="7 5"/><text x="108" y="178" font-size="15" font-weight="800" fill="#23824a" text-anchor="middle">✓ Так: ровно, целиком,</text><text x="108" y="196" font-size="15" font-weight="800" fill="#23824a" text-anchor="middle">обе страницы, светло</text>' +
    bk(285, 35, .5, 18) + '<text x="285" y="72" font-size="12" font-weight="800" fill="#e0322b" text-anchor="middle">✗ косо</text>' +
    bk(285, 105, .5, 0, true) + '<text x="285" y="140" font-size="12" font-weight="800" fill="#e0322b" text-anchor="middle">✗ темно</text>' +
    bk(285, 168, .5, 0, false, true) + '<text x="285" y="204" font-size="12" font-weight="800" fill="#e0322b" text-anchor="middle">✗ палец на тексте</text></svg>';
}
function bkAloudView(kid, b, t, P){
  var h = '', Y = T(kid) === 'yarik', nsp = (P.sp || []).length, left = bkAloudN(kid, t) - nsp;
  var snapBtn = function(lbl){ return bkSnapBtn('разворот', lbl, ' data-bk="' + b.id + '" data-task="' + t.id + '"'); };
  if (BK_OCR_BUSY || P.ocrMsg) return '<div class="center bkbusy"><div class="spin"></div><p><b>' + (P.ocrMsg || 'Читаю текст с фото…') + '</b></p><p class="hint">Несколько секунд.</p></div>';
  if (P.ph === 'aloud') {
    var live = BR && BR.active, paused = BR && BR.paused && !live;
    h += '<p class="hint">Читай вслух по книге. Можно смотреть в книгу, а не на экран — я слушаю и отмечаю. Зелёное — прочитано, красное — пропущено или с ошибкой.</p>' +
      '<div class="text reading bktext" id="bktext">' + tokensHtml(P.cur.text, BR && BR.st, BR && BR.p) + '</div><div class="row">' +
      (live ? '<button class="btn big stop" data-act="brdone">✅ Разворот прочитан</button><button class="btn ghost" data-act="brpause">⏸ Пауза</button><span id="brstat" class="rstat">' + (SR ? 'Слушаю…' : 'Читай вслух, время идёт') + '</span>'
        : '<button class="btn big mic" data-act="brstart">' + (paused ? '▶ Продолжить' : '🎤 Начинаю читать вслух') + '</button>' + (paused ? '<button class="btn ghost" data-act="brdone">Разворот прочитан</button>' : '')) + '</div>' +
      '<p class="hint"><button class="link" data-act="brretake">📷 Текст не тот — переснять</button></p>';
  } else if (P.ph === 'listen') {
    var live2 = BR && BR.active;
    h += '<div class="note">Текст с фото не прочитался — ничего страшного. Читай вслух по книге, я слушаю и считаю слова.</div>' +
      '<div class="row">' + (live2 ? '<button class="btn big stop" data-act="brdone">✅ Я дочитал(а)</button><button class="btn ghost" data-act="brpause">⏸ Пауза</button><span id="brstat" class="rstat">Слушаю…</span>' : '<button class="btn big mic" data-act="brstart">' + (BR && BR.paused ? '▶ Продолжить' : '🎤 Начинаю читать вслух') + '</button>') + '</div>' +
      (live2 ? '<p class="center">Читаешь <b id="brmin">' + bkMins(brSecs() * 1000) + ' мин</b></p>' : '') + '<p class="hint"><button class="link" data-act="brtryphoto">📷 Попробовать фото ещё раз</button></p>';
  } else if (P.ph === 'between') {
    var r = P.sp[nsp - 1] || {};
    h += '<div class="fb ok">Разворот прочитан! ' + (r.wpm ? '<b>' + r.wpm + '</b> слов в минуту' : '') + (r.acc != null ? ', без ошибок ' + Math.round(r.acc * 100) + '%' : '') + '.' + (r.errs && r.errs.length ? '<br>Потренируй слова: ' + r.errs.slice(0, 6).map(U.esc).join(', ') : '') + '</div>' +
      (left > 0 ? '<p>Переверни страницу и сфотографируй следующий разворот.' + bkSay('Переверни страницу и сфотографируй следующий разворот.') + '</p>' + snapBtn('📷 Следующий разворот') : !Y ? '<p>Дальше дочитай главу про себя.</p><button class="btn big" data-act="brsilent">📖 Читаю дальше про себя</button>' : '') +
      '<button class="btn big ghost" data-act="brend">🏁 Глава закончилась</button>';
  } else {
    if (P.badMsg) h += '<div class="fb bad">📷 ' + U.esc(P.badMsg) + bkSay(P.badMsg) + '</div>';
    h += '<p>' + (Y ? 'Положи книгу на стол, открой нужные страницы и сфотографируй разворот — обе страницы. Потом читай вслух, а я буду слушать.' : 'Сфотографируй разворот, который будешь читать вслух, — я буду следить по тексту.') + bkSay('Положи книгу на стол, открой нужные страницы и сфотографируй обе страницы. Потом читай вслух, а я буду слушать.') + '</p>' + bkSpreadPic() + snapBtn('📷 Сфотографировать разворот');
  }
  return h;
}
document.addEventListener('click', function(e){
  var btn = e.target.closest ? e.target.closest('[data-act]') : null; if (!btn) return; var act = btn.getAttribute('data-act'); if (act.indexOf('br') !== 0) return;
  var kid = cur.kid, b = kid && cur.bk ? bkFind(kid, cur.bk) : null, t = b ? bkCurTask(b) : null, P = t ? bkProg(b, t.id) : null; if (!P) return;
  switch (act) {
    case 'brstart': brStart(); break;
    case 'brpause': brPause(); break;
    case 'brdone': brDone(); break;
    case 'brretake': if (BR) { BR.active = false; try { BR.rec && BR.rec.stop(); } catch (x) {} BR = null; } P.ph = 'photo'; P.cur = null; save(); render(); break;
    case 'brtryphoto': if (BR) { BR.active = false; try { BR.rec && BR.rec.stop(); } catch (x) {} BR = null; } P.ph = 'photo'; P.mode = ''; save(); render(); break;
    case 'brsilent': P.ph = 'read'; P.t0 = Date.now(); P.silent = 1; save(); render(); break;
    case 'brend': bkAfterAloud(kid, b, t); break;
  }
});
setInterval(function(){ var el = document.getElementById('brmin'); if (el && BR) el.textContent = bkMins(brSecs() * 1000) + ' мин'; }, 15000);
