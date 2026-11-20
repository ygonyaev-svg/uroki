/* ===== Общие утилиты ===== */
const U = {
  h(s){ let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; },
  rng(seed){
    let a = typeof seed === 'number' ? seed : U.h(seed);
    const f = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    f.int = (x, y) => x + Math.floor(f() * (y - x + 1));
    f.pick = arr => arr[Math.floor(f() * arr.length)];
    f.shuffle = arr => { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
    f.sample = (arr, n) => f.shuffle(arr).slice(0, n);
    return f;
  },
  pl(n, one, few, many){ const m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return one; if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few; return many; },
  dec(x){ return String(Math.round(x * 1000) / 1000).replace('.', ','); },
  big(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); },
  esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); },
  today(){ const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
  dayNum(ds){ const [y, m, d] = ds.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5); },
  addDays(ds, n){ const [y, m, d] = ds.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1, d + n)); return t.toISOString().slice(0, 10); },
  roman(n){ const r = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]; let s = ''; for (const [v, c] of r) while (n >= v) { s += c; n -= v; } return s; },
  gcd(a, b){ while (b) [a, b] = [b, a % b]; return Math.abs(a); }
};

/* ===== Конструкторы заданий =====
   k:'c' — выбор ответа, k:'n' — число. q — вопрос (html), a — ответ, w — неверные, e — пояснение */
function C(q, a, w, e){ a = String(a); const ws = []; for (const x of w) { const s = String(x); if (s !== a && !ws.includes(s)) ws.push(s); } return { k: 'c', q, a, w: ws.slice(0, 3), e: e || '' }; }
function N(q, a, e){ return { k: 'n', q, a: Number(a), e: e || '' }; }
function cmp(a, b){ return a > b ? '>' : a < b ? '<' : '='; }
function CMP(q, x, y, e){ const s = cmp(x, y); return C(q, s, ['>', '<', '='].filter(z => z !== s), e); }
/* Банк: строки "вопрос|ответ|неверный1;неверный2;неверный3|пояснение" */
function B(lines){
  const items = lines.map(l => { const [q, a, w, e] = l.split('|'); return { q, a, w: (w || '').split(';').filter(Boolean), e }; });
  return r => { const it = r.pick(items); return C(it.q, it.a, it.w, it.e); };
}
/* Несколько генераторов вперемешку */
function MIX(...gs){ return r => r.pick(gs)(r); }
/* Неверные числовые ответы рядом с правильным */
function near(a, r, steps){ steps = steps || [1, 2, 10, -1, -2, -10, 5, -5]; const out = []; for (const s of r.shuffle(steps)) { const v = a + s; if (v >= 0 && v !== a && !out.includes(v)) out.push(v); if (out.length === 3) break; } return out; }
