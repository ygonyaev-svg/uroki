import sys,importlib,os
sys.path.insert(0,os.path.dirname(__file__))
css=open(os.path.join(os.path.dirname(__file__),'../../src/design.css')).read(); css=css[css.index('.ic{'):css.index('/* --- общий слой')]
mods=sys.argv[2:]; out=sys.argv[1]; cells=''
for m in mods:
    M=importlib.import_module(m)
    for k,v in M.ITEMS.items(): cells+=f'<div class=c><svg class="ic" viewBox="0 0 32 32">{v}</svg><small>{k}</small></div>'
open(out,'w').write(f'<html><style>{css} body{{margin:0;font-family:sans-serif;--il:#1B2A44;--ia:#4C9BE8;--ib:#F5A524;--iw:#fff}} .t{{display:flex;flex-wrap:wrap;gap:4px;padding:10px}} .c{{width:104px;text-align:center}} .c .ic{{width:84px;height:84px}} small{{display:block;font-size:10px}}</style><div class=t>{cells}</div></html>')
