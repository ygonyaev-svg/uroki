# Собирает src/icons2.js из p1..p4: картинки внутри заданий.
import json, sys, os, importlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
mods=['p1_people','p2_animals','p3_things','p4_world']+[m for m in ['p5_misc'] if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)),m+'.py'))]
I={}; M={}
for m in mods:
    x=importlib.import_module(m); I.update(x.ITEMS)
    for k,v in x.MAP.items(): M[k.replace('️','')]=v
out=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','src','icons2.js')
with open(out,'w') as f:
    f.write('// Картинки внутри заданий (сгенерировано tools/ic2/gen.py, не править руками)\n')
    f.write('var ICONS2 = '+json.dumps(I,ensure_ascii=False)+';\n')
    f.write('var EMO2 = '+json.dumps(M,ensure_ascii=False)+';\n')
    f.write('(function(){ for (var k in ICONS2) if (!ICONS[k]) ICONS[k] = ICONS2[k]; for (var e in EMO2) if (!EMO_ICON[e]) EMO_ICON[e] = EMO2[e]; EMO_RE = icoBuildRe(); })();\n')
print(len(I),'icons',len(M),'emoji')
