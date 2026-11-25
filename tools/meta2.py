#!/usr/bin/env python3
"""books/meta2.txt + books/parts2.json -> JS-массив BOOK_X (новые книги на 4 месяца)."""
import os, json, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A_PREF = {'np', 'mu', 'kp', 'dp', 'bp', 'ck', 'ma', 'bl'}
T_PREF = {'tt', 'hm', 'zl', 'vy', 'me', 'bi', 'ss', 'be', 'tb'}  # 12–13 лет (Словоход)

def chunks(text, target=360):
    """Делит часть на куски ~target слов по границам предложений (для чтения про себя по кускам)."""
    units = []
    for l in text.split('\n'):
        for j, x in enumerate(re.split(r'(?<=[.!?…])\s+(?=[—«А-ЯЁ])', l.strip())):
            if x: units.append(('\n' if (j == 0 and units) else ' ', x))
    tot = sum(len(x.split()) for _, x in units); n = max(2, round(tot / target)); per = tot / n
    out, cnt, k = [''], 0, 1
    for sep, x in units:
        if (cnt >= per * k - 25 and k < n and sep == '\n') or (cnt >= per * k + 60 and k < n):
            out.append(''); k += 1
        out[-1] += (sep if out[-1] else '') + x; cnt += len(x.split())
    return out

def load():
    parts = json.load(open(os.path.join(root, 'books', 'parts2.json'), encoding='utf-8'))
    out, cur, errs, bk_about = [], None, [], {}
    for ln in open(os.path.join(root, 'books', 'meta2.txt'), encoding='utf-8'):
        ln = ln.strip()
        if not ln: continue
        if ln.startswith('!!'): bk_about[cur['book']] = ln[2:].strip(); continue
        if ln.startswith('!'): cur['about'] = ln[1:].strip(); continue
        if ln.startswith('~'):
            q, right, wr = ln[1:].split('|'); cur.setdefault('cq', []).append([q, right] + [w for w in wr.split(';') if w]); continue
        if ln.startswith('@'):
            pid, book, title, author, kw = ln[1:].split('|')
            if pid not in parts: errs.append('нет текста ' + pid); continue
            cur = {'id': 'b' + pid, 'k': 't' if pid[:2] in T_PREF else 'a' if pid[:2] in A_PREF else 'y', 'book': book, 'title': title, 'author': author,
                   'text': parts[pid], 'kw': [w.strip() for w in kw.split(',') if w.strip()], 'qs': []}
            out.append(cur)
        else:
            q, right, wr = ln.split('|')
            ws = [w for w in wr.split(';') if w]
            if len(ws) != 3: errs.append(cur['id'] + ': ' + q)
            cur['qs'].append([q, right] + ws)
    for b in out:
        if b['k'] in ('a', 't'):
            b['ch'] = chunks(b['text'])
            if 'cq' in b and len(b['cq']) != len(b['ch']): errs.append(b['id'] + ': кусков %d, вопросов к кускам %d' % (len(b['ch']), len(b['cq'])))
        if 'about' not in b and b['book'] in bk_about: b['about'] = bk_about[b['book']]
        low = b['text'].lower().replace('ё', 'е')
        miss = [w for w in b['kw'] if w.lower().replace('ё', 'е')[:max(3, len(w) - 2)] not in low]
        if miss: errs.append(b['id'] + ' kw: ' + ','.join(miss))
        if len(b['qs']) != 5: errs.append(b['id'] + ' вопросов ' + str(len(b['qs'])))
    return out, errs

if __name__ == '__main__':
    out, errs = load()
    print(len(out), 'частей'); print('\n'.join(errs) or 'ошибок нет')
