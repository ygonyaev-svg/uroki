/* ===== «Найди ошибку» после чтения: тест на внимательность =====
   Берём кусочек прочитанной главы (Ярик 3 предложения, Аня 4) и в одном предложении меняем одно слово
   на другое слово из того же текста с тем же окончанием — грамматически звучит гладко, но по смыслу неверно.
   Текст спрятан: ребёнок вспоминает прочитанное и нажимает на неверное слово. Две попытки. */
function spotSent(text){ return (String(text).replace(/\s+/g, ' ').match(/[^.!?…]+[.!?…]+[»"]?/g) || []).map(s => s.trim()).filter(Boolean); }
function spotTask(kid, t, seed){ const R = U.rng(seed), S0 = spotSent(t.text), n = T(kid) === 'anya' ? 4 : 3;
  const wc = s => s.split(' ').length, okS = s => wc(s) >= 4 && wc(s) <= (n === 3 ? 16 : 24);
  const pool = []; for (let i = 0; i + n <= S0.length; i++) if (S0.slice(i, i + n).every(okS)) pool.push(i); if (!pool.length) return null;
  const all = [...new Set(t.text.split(/\s+/).map(w => w.replace(/[^А-Яа-яЁё-]/g, '')).filter(w => w.length >= 4))];
  const stem = w => w.toLowerCase().replace(/ё/g, 'е').slice(0, 4);
  for (let tries = 0; tries < 30; tries++) { const st = R.pick(pool), win = S0.slice(st, st + n), k = R.int(0, n - 1), words = win[k].split(' ');
    const cand = words.map((w, i) => ({ i, c: w.replace(/[^А-Яа-яЁё-]/g, '') })).filter(x => x.c.length >= 5 && !/-/.test(x.c) && x.i > 0 && words.filter(w => w.toLowerCase().includes(x.c.toLowerCase())).length === 1);
    if (!cand.length) continue; const x = R.pick(cand), low = x.c.toLowerCase(), end = low.slice(-3);
    /* замена: то же окончание из 3 букв (меньше грамматических несостыковок, которые выдают подмену), другой корень, такого слова нет в предложении, не однокоренное с приставкой */
    const nz = v => v.toLowerCase().replace(/ё/g, 'е'), sk = nz(win[k]), lz = nz(low);
    const reps = all.filter(w => { const l = w.toLowerCase(), l2 = nz(w); return l.slice(-3) === end && stem(l) !== stem(low) && !sk.includes(stem(l)) && !l2.includes(lz.slice(0, -3)) && !lz.includes(l2.slice(0, -3)) && (w[0] === w[0].toUpperCase()) === (x.c[0] === x.c[0].toUpperCase()); });
    if (!reps.length) continue; const r = R.pick(reps); const nw = words.slice(); nw[x.i] = words[x.i].replace(x.c, r);
    const sents = win.slice(); sents[k] = nw.join(' '); return { sents, k, wi: x.i, was: x.c, now: r }; }
  return null; }
function vSpot(kid, L, head){ const t = readText(kid), q = spotTask(kid, t, (L.seed || 1) + 77), a = L.spot || {};
  if (!q) { L.phase = L.gl && L.gl.length ? 'words' : 'survey'; save(); return null; }
  const fin = a.fin, girl = T(kid) === 'anya';
  const sent = (s, si) => s.split(' ').map((w, wi) => { const bad = si === q.k && wi === q.wi, tried = (a.wrong || []).some(x => x[0] === si && x[1] === wi);
    const cls = fin && bad ? (a.ok ? 'right' : 'miss') : tried ? 'wrong' : ''; return `<button class="spw ${cls}" data-act="spw" data-s="${si}" data-w="${wi}" ${fin || tried ? 'disabled' : ''}>${U.esc(w)}</button>`; }).join(' ');
  return head + `<article class="card task spot"><h2>🔎 Найди ошибку</h2><p class="hint">Это кусочек из главы, которую ты ${girl ? 'прочитала' : 'прочитал'}. Но в одном предложении я поменял одно слово — и получилось не так, как в книге. Найди его и нажми.</p>
   <div class="spt">${q.sents.map((s, si) => `<p>${sent(s, si)}</p>`).join('')}</div>
   ${fin ? (a.ok ? `<div class="fb ok"><b>${a.tries === 1 ? 'Верно, с первого раза! Ты внимательн' + (girl ? 'а' : 'ый') + '.' : 'Нашёл' + (girl ? 'ла' : '') + '!'}</b> В книге было «${U.esc(q.was.toLowerCase())}», а не «${U.esc(q.now.toLowerCase())}».</div>` : `<div class="fb bad"><b>Ошибка была здесь:</b> в книге «${U.esc(q.was.toLowerCase())}», а я написал «${U.esc(q.now.toLowerCase())}».</div>`) : a.tries ? '<div class="fb try">Это слово верное. Вспомни, как было в книге, и попробуй ещё раз.</div>' : '<p class="hint">Есть две попытки.</p>'}</article>
   ${fin ? '<button class="btn big" data-act="spnext">Дальше</button>' : ''}</section>`; }
function spotAct(act, b){ if (act !== 'spw' && act !== 'spnext') return false; const kid = cur.kid, L = dayRec(kid, cur.ds).les.read; if (!L) return true;
  if (act === 'spnext') { L.phase = L.gl && L.gl.length ? 'words' : 'survey'; L.wi = 0; save(); render(); window.scrollTo(0, 0); return true; }
  const q = spotTask(kid, readText(kid), (L.seed || 1) + 77), a = L.spot || (L.spot = { tries: 0, wrong: [] }); if (!q || a.fin) return true;
  const si = +b.dataset.s, wi = +b.dataset.w, ok = si === q.k && wi === q.wi; a.tries++;
  if (ok || a.tries >= 2) { a.fin = true; a.ok = ok; ev(kid, 'найди ошибку', { subj: 'Чтение', unit: readText(kid).t || '', q: q.sents[q.k], ans: q.sents[si].split(' ')[wi], right: q.now + ' → ' + q.was, ok: ok ? (a.tries === 1 ? 'верно' : 'со 2-й попытки') : 'ошибка' }); }
  else a.wrong.push([si, wi]);
  save(); render(); return true; }
