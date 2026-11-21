"""Разбивает тексты из Викитеки (общественное достояние) на части для уроков чтения -> books/parts2.json"""
import json, re, sys
T = json.load(open(sys.argv[1]))
def lines(k, start=None, stop=('Примечания', 'Примечание', 'Примечаниe', 'Вариант', '1831', '14 октября 1833')):
    L = [l.strip().replace(' ', ' ').replace('\xa0', ' ').replace(' ', ' ').replace('‎', '') for l in T[k].split('\n')]
    L = [l for l in L if l]
    out = []
    for l in L:
        if l in stop: break
        out.append(l)
    return out
def group(paras, target, hard=()):
    parts, cur, n = [], [], 0
    for p in paras:
        w = len(p.split())
        if p in hard:
            if cur: parts.append(cur); cur, n = [], 0
            continue
        if n and n + w > target * 1.25 and n >= target * .6:
            parts.append(cur); cur, n = [], 0
        cur.append(p); n += w
    if cur:
        if parts and n < target * .45: parts[-1] += cur
        else: parts.append(cur)
    return ['\n'.join(x) for x in parts]
R = {}
def add(prefix, parts):
    m = []
    for p in parts:
        if m and len(p.split()) < 300: m[-1] += '\n' + p
        else: m.append(p)
    for i, p in enumerate(m, 1): R[f'{prefix}{i}'] = p
# --- Аня ---
L = lines('Ночь перед Рождеством (Гоголь)'); add('np', group(L, 1350))
add('mu', group(lines('Муму (Тургенев)'), 1300))
L = lines('Кавказский пленник (Толстой)')[1:]; add('kp', group(L, 1400, hard=('I','II','III','IV','V','VI')))
L = lines('Дети подземелья (Короленко)')[1:]; H = [l for l in L if re.match(r'^\d\. ', l)]
L = [l for l in L if l != 'Заключение']; add('dp', group(L, 1450, hard=tuple(H)))
L = lines('Белый пудель (Куприн)/Б-ка миров. лит-ры для детей 1983 (СО)'); add('bp', group(L, 1450, hard=('I','II','III','IV','V','VI','VII')))
add('ck', group(lines('Чёрная курица, или Подземные жители (Погорельский)'), 1300))
add('ma', group(lines('Мальчики (Чехов)'), 5000)); add('bl', group(lines('Белолобый (Чехов)'), 5000))
# --- Ярик ---
add('ac', group(lines('Аленький цветочек (Аксаков)'), 600))
add('gt', group(lines('Городок в табакерке (Одоевский)'), 620))
add('mi', group(lines('Мороз Иванович (Одоевский)'), 620))
A = lines('Алёнушкины сказки (Мамин-Сибиряк)/Версия 2')
tales = [('zy',106,144),('kz',144,200),('km',200,265),('vv',366,444),('mh',444,514),('vr',514,618),('uv',618,724),('mk',724,778)]
for pre, a, b in tales:
    body = [l for l in A[a:b] if not (l.isupper() or re.fullmatch(r'[IVX]+', l))]
    add(pre, group(body, 600))
add('fi', ['\n'.join(lines('Филипок (Толстой)'))]); add('sp', ['\n'.join(lines('Слепая лошадь (Ушинский)'))])
add('cs', group(lines('Сказка о царе Салтане (Пушкин)')[1:], 620))
add('rr', group(lines('Сказка о рыбаке и рыбке (Пушкин)')[1:], 650))
add('mc', group(lines('Сказка о мёртвой царевне и о семи богатырях (Пушкин)')[1:], 620))
json.dump(R, open(sys.argv[2], 'w'), ensure_ascii=False, indent=0)
for k, v in R.items(): print(k, len(v.split()), '|', v[:110].replace('\n', ' / '), '…', v[-90:].replace('\n', ' / '))
