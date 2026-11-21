#!/usr/bin/env python3
"""books/meta2.txt + books/parts2.json -> JS-массив BOOK_X (новые книги на 4 месяца)."""
import os, json, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A_PREF = {'np', 'mu', 'kp', 'dp', 'bp', 'ck', 'ma', 'bl'}

def load():
    parts = json.load(open(os.path.join(root, 'books', 'parts2.json'), encoding='utf-8'))
    out, cur, errs = [], None, []
    for ln in open(os.path.join(root, 'books', 'meta2.txt'), encoding='utf-8'):
        ln = ln.strip()
        if not ln: continue
        if ln.startswith('@'):
            pid, book, title, author, kw = ln[1:].split('|')
            if pid not in parts: errs.append('нет текста ' + pid); continue
            cur = {'id': 'b' + pid, 'k': 'a' if pid[:2] in A_PREF else 'y', 'book': book, 'title': title, 'author': author,
                   'text': parts[pid], 'kw': [w.strip() for w in kw.split(',') if w.strip()], 'qs': []}
            out.append(cur)
        else:
            q, right, wr = ln.split('|')
            ws = [w for w in wr.split(';') if w]
            if len(ws) != 3: errs.append(cur['id'] + ': ' + q)
            cur['qs'].append([q, right] + ws)
    for b in out:
        low = b['text'].lower().replace('ё', 'е')
        miss = [w for w in b['kw'] if w.lower().replace('ё', 'е')[:max(3, len(w) - 2)] not in low]
        if miss: errs.append(b['id'] + ' kw: ' + ','.join(miss))
        if len(b['qs']) != 5: errs.append(b['id'] + ' вопросов ' + str(len(b['qs'])))
    return out, errs

if __name__ == '__main__':
    out, errs = load()
    print(len(out), 'частей'); print('\n'.join(errs) or 'ошибок нет')
