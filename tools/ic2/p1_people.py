# Люди, лица, эмоции, части тела. Стиль: контур var(--il) 2px, натуральные цвета заливок.
SK='#F6C9A0'; SK2='#E3A97C'; BR='#7A4A2A'; BL='#E8B84A'; GR='#C9CED6'; DK='#2F3B55'; RD='#C8553D'
def eyes(y=17,dx=4,k='dot'):
    if k=='dot': return f'<circle cx="{16-dx}" cy="{y}" r="1.2" class="l"/><circle cx="{16+dx}" cy="{y}" r="1.2" class="l"/>'
    if k=='closed': return f'<path d="M{16-dx-1.8} {y}q1.8 1.5 3.6 0M{16+dx-1.8} {y}q1.8 1.5 3.6 0"/>'
    if k=='wide': return f'<circle cx="{16-dx}" cy="{y}" r="2" fill="#fff"/><circle cx="{16+dx}" cy="{y}" r="2" fill="#fff"/><circle cx="{16-dx}" cy="{y}" r=".9" class="l"/><circle cx="{16+dx}" cy="{y}" r=".9" class="l"/>'
    if k=='star': return f'<path fill="#F7C142" stroke-width="1.2" d="M{16-dx} {y-2.5}l.8 1.7 1.8.2-1.3 1.2.4 1.8-1.7-.9-1.7.9.4-1.8-1.3-1.2 1.8-.2zM{16+dx} {y-2.5}l.8 1.7 1.8.2-1.3 1.2.4 1.8-1.7-.9-1.7.9.4-1.8-1.3-1.2 1.8-.2z"/>'
    if k=='x': return f'<path d="M{16-dx-1.5} {y-1.5}l3 3M{16-dx+1.5} {y-1.5}l-3 3M{16+dx-1.5} {y-1.5}l3 3M{16+dx+1.5} {y-1.5}l-3 3"/>'
    if k=='wink': return f'<circle cx="{16-dx}" cy="{y}" r="1.2" class="l"/><path d="M{16+dx-1.8} {y}q1.8 1.5 3.6 0"/>'
MO={'smile':'<path d="M12.5 21.5c2 2 5 2 7 0"/>','grin':'<path fill="#fff" d="M11.5 20.5h9a4.5 4.5 0 0 1-9 0z"/>','flat':'<path d="M13 22.5h6"/>',
 'sad':'<path d="M12.5 23.5c2-2 5-2 7 0"/>','o':'<ellipse cx="16" cy="22.5" rx="1.8" ry="2.3" fill="#7A2E2E"/>','open':'<path fill="#7A2E2E" d="M12.5 21h7a3.5 3.5 0 0 1-7 0z"/>',
 'zip':'<path d="M12 22h8M13.5 21v2M16 21v2M18.5 21v2"/>','shh':'<path d="M14 22h4"/>','wave':'<path d="M11.5 22.5l1.5-1.2 1.5 1.2 1.5-1.2 1.5 1.2 1.5-1.2 1.5 1.2"/>'}
def emo(eye='dot',mo='smile',fill='#F7C142',extra=''):
    return f'<circle cx="16" cy="16" r="13" fill="{fill}"/>'+eyes(13.5,4.5,eye)+'<g transform="translate(0 -1.5)">'+MO[mo]+'</g>'+extra
# голова человека
def head(hair_back='',hair_front='',skin=SK,eye='dot',mo='smile',extra='',cheeks=True):
    ch='<circle cx="10.5" cy="21" r="1.6" fill="#F59A9A" stroke="none" opacity=".7"/><circle cx="21.5" cy="21" r="1.6" fill="#F59A9A" stroke="none" opacity=".7"/>' if cheeks else ''
    return hair_back+f'<circle cx="16" cy="18" r="10" fill="{skin}"/>'+ch+hair_front+eyes(18,4,eye)+MO[mo]+extra
SHORT=lambda c: f'<path fill="{c}" d="M6.2 17.5C5.5 10 10 6.5 16 6.5s10.5 3.5 9.8 11c-1.5-3.5-4-5-6.3-5.2-1 1.6-4 2.6-8 2.4-2.2-.1-3.8 1.2-5.3 2.8z"/>'
LONGB=lambda c: f'<path fill="{c}" d="M5 18C5 10 9.5 6 16 6s11 4 11 12v10h-5V19H10v9H5z"/>'
BANG=lambda c: f'<path fill="{c}" d="M6.3 16.5C6.5 10.5 10.5 7.5 16 7.5s9.5 3 9.7 9c-3-.3-6.5-2-8.2-4.5-1.7 2.5-6 4.3-11.2 4.5z"/>'
PONY=lambda c: f'<path fill="{c}" d="M23 9c4 0 6 3 5.5 7.5-.5 3-2 5-3.5 6"/>'
GLASS='<circle cx="12" cy="18" r="2.8" fill="#fff" fill-opacity=".35"/><circle cx="20" cy="18" r="2.8" fill="#fff" fill-opacity=".35"/><path d="M14.8 18h2.4"/>'
BEARD=lambda c: f'<path fill="{c}" d="M6.5 19c1 6 4.5 9 9.5 9s8.5-3 9.5-9c-1.5 1.5-3 2-4 2-1 1.8-3 2.5-5.5 2.5s-4.5-.7-5.5-2.5c-1 0-2.5-.5-4-2z"/>'
MUST=lambda c: f'<path fill="{c}" d="M11.5 21.5c1.5-1.8 3.3-2 4.5-1 1.2-1 3-.8 4.5 1-1.5.5-3 .5-4.5-.3-1.5.8-3 .8-4.5.3z"/>'
P={}
P['boy']=head(hair_front=SHORT(BR))
P['girl']=head(LONGB(BR),BANG(BR))
P['kid']=head(hair_front=SHORT(BL))
P['man']=head(hair_front=SHORT(DK),cheeks=False)
P['woman']=head(LONGB(BL),BANG(BL))
P['redhead']=head(LONGB('#D9673A'),BANG('#D9673A'))
P['person']=head(hair_front=SHORT('#9A6A43'),cheeks=False)
P['beard']=head(hair_front=SHORT(BR),mo='smile',cheeks=False,extra=BEARD(BR)+'<path d="M13.5 22.5c1.5 1 3.5 1 5 0"/>')
P['grandpa']=head(hair_front=f'<path fill="{GR}" d="M6.3 19c-.8-3 0-6 2-7.5 0 2 .5 3.5 1.2 4.5M25.7 19c.8-3 0-6-2-7.5 0 2-.5 3.5-1.2 4.5"/>',cheeks=False,extra=GLASS+MUST(GR))
P['grandma']=f'<circle cx="16" cy="6" r="3.5" fill="{GR}"/>'+head(hair_front=BANG(GR),extra=GLASS)
P['baby']=head(hair_front='<path d="M15 8.5c0-2 2.5-2.5 3-1"/>',mo='o')
P['teacher']=head(LONGB(BR),BANG(BR),extra=GLASS)
P['princess']=head(LONGB(BL),BANG(BL),extra='<path fill="#F7C142" d="M9.5 9l2.5 2.5L16 6l4 5.5L22.5 9l-1 5h-11z"/>')
P['prince']=head(hair_front=SHORT(BR),extra='<path fill="#F7C142" d="M9.5 9l2.5 2.5L16 6l4 5.5L22.5 9l-1 5h-11z"/>')
P['doctor']=head(hair_front=SHORT(DK),cheeks=False,extra='<path fill="#fff" d="M7 13c0-5 4-7.5 9-7.5s9 2.5 9 7.5z"/><path fill="#EF5B4C" stroke="none" d="M15 7.5h2v2h2v2h-2v2h-2v-2h-2v-2h2z"/>')
P['nurse']=P['doctor']
P['fire']=head(cheeks=False,extra='<path fill="#EF5B4C" d="M5 13.5c0-5.5 5-8.5 11-8.5s11 3 11 8.5H5z"/><path d="M3.5 13.5h25"/><path fill="#F7C142" d="M14 6.5h4v5h-4z"/>')
P['police']=head(cheeks=False,extra='<path fill="#2F5FA8" d="M6 13c0-4 4.5-7 10-7s10 3 10 7z"/><path fill="#1E3A6E" d="M5 13h22v2H5z"/><circle cx="16" cy="9.5" r="1.6" fill="#F7C142"/>')
P['cook']=head(cheeks=False,extra='<path fill="#fff" d="M9 13v-3a3.5 3.5 0 0 1 2-6.3A4.5 4.5 0 0 1 20.8 3.5 3.5 3.5 0 0 1 23 10v3z"/><path d="M9 11h14"/>')
P['pilot']=head(hair_front=SHORT(BR),cheeks=False,extra='<path fill="#1E3A6E" d="M6 12.5c0-4 4.5-6.5 10-6.5s10 2.5 10 6.5z"/><path fill="#F7C142" d="M12 9.5h8l-1 1.5h-6z"/>')
P['astronaut']='<circle cx="16" cy="16" r="13" fill="#E6EBF2"/><circle cx="16" cy="16" r="9" fill="#2F3B55"/><path fill="#fff" stroke="none" opacity=".6" d="M10.5 12a7 7 0 0 1 5-4l.4 1.6a5.5 5.5 0 0 0-4 3.2z"/><circle cx="12.5" cy="18" r="1" fill="#fff" stroke="none"/><circle cx="19.5" cy="18" r="1" fill="#fff" stroke="none"/>'
P['detective']=head(cheeks=False,extra='<path fill="#9A6A43" d="M8 12.5c0-5 3.5-7.5 8-7.5s8 2.5 8 7.5z"/><path fill="#9A6A43" d="M3.5 13.5c4-1.5 21-1.5 25 0-4 1.5-21 1.5-25 0z"/>')
P['hero']=head(hair_front=SHORT(DK),cheeks=False,extra='<path fill="#EF5B4C" d="M7.5 15.5h17v4.5h-17z"/><circle cx="12" cy="17.8" r="1.3" fill="#fff" stroke="none"/><circle cx="20" cy="17.8" r="1.3" fill="#fff" stroke="none"/>')
P['villain']=head(hair_front=SHORT('#3A3A48'),cheeks=False,mo='flat',extra='<path fill="#3A3A48" d="M7.5 15.5h17v4.5h-17z"/><circle cx="12" cy="17.8" r="1.3" fill="#F7C142" stroke="none"/><circle cx="20" cy="17.8" r="1.3" fill="#F7C142" stroke="none"/>')
P['mermaid']=head(LONGB('#E05A7A'),BANG('#E05A7A'),extra='<path fill="#4CC3B0" d="M10 27c2-1.5 4-2 6-2s4 .5 6 2c-2 2-4 3-6 3s-4-1-6-3z"/>')
P['silh']='<circle cx="16" cy="10" r="5.5" fill="#A3AEBD"/><path fill="#A3AEBD" d="M6 28c0-6 4.5-10 10-10s10 4 10 10z"/>'
P['stand']='<circle cx="16" cy="6" r="3.5" fill="'+SK+'"/><path fill="#4C9BE8" d="M11 11h10l-1 9h-8z"/><path d="M13 20v9M19 20v9M11 12l-3 8M21 12l3 8"/>'
P['runner']='<circle cx="19" cy="5.5" r="3.2" fill="'+SK+'"/><path fill="#EF5B4C" d="M14 10l6 1-1 8-6-1z"/><path d="M14 18l-4 5-3-1M18 19l2 5 3 4M15 11l-5 3M20 11l4 4 3-1"/>'
P['swim']='<circle cx="11" cy="12" r="3.5" fill="'+SK+'"/><path d="M14 14l7-3 6 2M14.5 15l5 1"/><path fill="#5AB0E8" d="M2 20c3-2 5-2 7 0s5 2 7 0 5-2 7 0 5 2 7 0v8H2z"/>'
P['dancer']='<circle cx="16" cy="5.5" r="3.2" fill="'+SK+'"/><path fill="#E05A7A" d="M13 10h6l4 11H9z"/><path d="M14 21l-2 8M18 21l3 7M13 11l-6-4M19 11l6-3"/>'
P['dancer2']='<circle cx="15" cy="5.5" r="3.2" fill="'+SK+'"/><path fill="#8B6CC9" d="M12 10h6l1 10h-8z"/><path d="M12.5 20l-4 8M17.5 20l4 7 3 0M12 11l-5 5M18 11l6-6"/>'
P['cyclist']='<circle cx="8" cy="22" r="5" fill="none"/><circle cx="24" cy="22" r="5" fill="none"/><path d="M8 22l5-9h8l3 9M13 13l3 9h-8M19 9h3"/><circle cx="16" cy="5" r="2.6" fill="'+SK+'"/><path fill="#4C9BE8" d="M14 8l4 0 1 5h-5z"/>'
P['rower']='<path fill="#9A6A43" d="M3 21h26l-3 5H6z"/><circle cx="14" cy="10" r="3" fill="'+SK+'"/><path fill="#F59E3A" d="M12 14h5v7h-5z"/><path d="M6 12l20 14"/><path fill="#5AB0E8" stroke="none" d="M2 27h28v3H2z"/>'
P['rider']='<path fill="#9A6A43" d="M6 16c2-3 6-4 12-3l6-4 3 2-2 3c1 3 0 6-2 7v7h-2.5v-5h-8v5H10v-6c-3 0-4-3-4-6z"/><circle cx="15" cy="4.5" r="2.6" fill="'+SK+'"/><path fill="#EF5B4C" d="M13 7h4l1 6h-6z"/>'
P['acro']='<circle cx="16" cy="25" r="3" fill="'+SK+'"/><path fill="#F59E3A" d="M13 12h6v10h-6z"/><path d="M13 13l-5-8M19 13l5-8M14 21l-4 5M18 21l4 5"/>'
P['shrug']=head(hair_front=SHORT(BR),cheeks=False,mo='flat',extra='')+'<path d="M3 23l4-3 2 2M29 23l-4-3-2 2"/>'
P['wave']='<path fill="'+SK+'" d="M10 17V9a2 2 0 0 1 4 0v6V6a2 2 0 0 1 4 0v9V7.5a2 2 0 0 1 4 0V16v-4a2 2 0 0 1 4 0v8c0 5-3.5 9-9 9-3 0-5.5-1.5-7-4l-4-6.5a2 2 0 0 1 3.5-2z"/><path d="M5 8c-1-1.5-1-3.5 0-5M3 10c-2-2-2-6 0-8"/>'
P['hand']='<path fill="'+SK+'" d="M10 17V9a2 2 0 0 1 4 0v6V6a2 2 0 0 1 4 0v9V7.5a2 2 0 0 1 4 0V16v-4a2 2 0 0 1 4 0v8c0 5-3.5 9-9 9-3 0-5.5-1.5-7-4l-4-6.5a2 2 0 0 1 3.5-2z"/>'
P['pray']='<path fill="'+SK+'" d="M15.5 4c-1 0-2 1-2.5 3l-4 13-4 4 3 4 6-5 1.5-6zM16.5 4c1 0 2 1 2.5 3l4 13 4 4-3 4-6-5-1.5-6z"/>'
P['raise']='<path fill="'+SK+'" d="M4 16V8a1.8 1.8 0 0 1 3.5 0v5V5a1.8 1.8 0 0 1 3.5 0v8-6a1.8 1.8 0 0 1 3.5 0v8c0 4-1 7-4 8l-1 4H6l-1-5c-1-1-1-2-1-2z"/><path fill="'+SK+'" d="M28 16V8a1.8 1.8 0 0 0-3.5 0v5V5A1.8 1.8 0 0 0 21 5v8-6a1.8 1.8 0 0 0-3.5 0v8c0 4 1 7 4 8l1 4H26l1-5c1-1 1-2 1-2z"/>'
P['eyes']='<ellipse cx="10" cy="16" rx="6" ry="8" fill="#fff"/><ellipse cx="22" cy="16" rx="6" ry="8" fill="#fff"/><circle cx="11.5" cy="17" r="3" fill="#4A3220"/><circle cx="23.5" cy="17" r="3" fill="#4A3220"/><circle cx="12.3" cy="16" r="1" fill="#fff" stroke="none"/><circle cx="24.3" cy="16" r="1" fill="#fff" stroke="none"/>'
P['eye']='<path fill="#fff" d="M2.5 16C6 10 10.5 7.5 16 7.5S26 10 29.5 16C26 22 21.5 24.5 16 24.5S6 22 2.5 16z"/><circle cx="16" cy="16" r="5.5" fill="#6A9ED6"/><circle cx="16" cy="16" r="2.5" class="l"/><circle cx="17.5" cy="14.5" r="1" fill="#fff" stroke="none"/>'
P['nose']='<path fill="'+SK+'" d="M17 4c-1 6-5 12-7 16-1.5 3 1 6 4 5.5 1 1.5 3 1.5 4.5 0 3 .5 5-2 3.5-5"/><path d="M13.5 24c.5-1.5 1.5-2 2.5-2"/>'
P['ear']='<path fill="'+SK+'" d="M10 13a8 8 0 0 1 16 0c0 4-2 6-4 8s-2 7-6 7c-2.5 0-4-1.5-4.5-3.5"/><path d="M14 13a4 4 0 0 1 8 0c0 2-2 3-3 4"/>'
P['mouth']='<path fill="#E0525E" d="M3 16c3-4 7-6 9.5-5 1.5.6 2.5.6 3.5 0s2-.6 3.5 0c2.5-1 6.5 1 9.5 5-3 5-7.5 7-13 7S6 21 3 16z"/><path d="M3 16c5 1.5 21 1.5 26 0"/>'
P['tongue']='<path fill="#E0525E" d="M4 11c3-3 7-4 12-4s9 1 12 4c-3 2-7 3-12 3S7 13 4 11z"/><path fill="#F7A9B8" d="M10 13v6a6 6 0 0 0 12 0v-6"/><path d="M16 14v5"/>'
P['tooth']='<path fill="#fff" d="M8 5c3-1.5 5.5 0 8 0s5-1.5 8 0c3 2 2.5 7 1 11-1 3-1 6-2 10-.6 2.2-3 2.2-3.5 0L18 20c-.3-1.5-3.7-1.5-4 0l-1.5 6c-.5 2.2-2.9 2.2-3.5 0-1-4-1-7-2-10C5.5 12 5 7 8 5z"/>'
P['foot']='<path fill="'+SK+'" d="M10 28c-3 0-4.5-2.5-4-6 .5-4 2-6 2-11 0-3 2-5 5-5s5 3 5 6c0 4-1 6 1 9 2 4 0 7-4 7z"/><circle cx="21" cy="6" r="2" fill="'+SK+'"/><circle cx="24" cy="9" r="1.6" fill="'+SK+'"/><circle cx="25.5" cy="12.5" r="1.4" fill="'+SK+'"/>'
P['leg']='<path fill="'+SK+'" d="M13 3h7l-1 13c0 3 0 5 1 7h6c2 0 3 1.5 3 3s-1 2.5-3 2.5H14c-2 0-3-1-3-3 0-3 2-5 2-8z"/>'
P['steps']='<path fill="#9A6A43" d="M8 4c2.5 0 3.5 2.5 3 6s-2 5-4 5-3-2-2.5-5S5.5 4 8 4zM22 14c2.5 0 3.5 2.5 3 6s-2 5-4 5-3-2-2.5-5 1-6 3.5-6z"/><path fill="#9A6A43" d="M6 17h4v3H6zM20 27h4v3h-4z"/>'
P['muscle2']='<path fill="'+SK+'" d="M5 25c0-5 2-11 5-18h5l-1 3h-3l1 6c3-3 9-3 12 1 3 4 0 11-6 11H9c-2.5 0-4-1.5-4-3z"/><path d="M13 21c2-2.5 5-2.5 7-.5"/>'
P['heart_r']='<path fill="#EF5B4C" d="M16 28S3 20 3 11.5A6.5 6.5 0 0 1 16 8a6.5 6.5 0 0 1 13 3.5C29 20 16 28 16 28z"/>'
E={}
E['sleep']=emo('closed','o')+'<path d="M22 5h4l-4 4h4" stroke-width="1.6"/>'
E['cold']=emo('wide','zip','#7CC4F0')
E['hot']=emo('closed','open','#F58A5A')+'<path fill="#5AB0E8" d="M27 9c0 2-1 3-2 3s-2-1-2-3 2-4 2-4 2 2 2 4z"/>'
E['angry']=emo('dot','sad','#F07A5A')+'<path d="M8.5 9.5l5 2M23.5 9.5l-5 2"/>'
E['cry']=emo('closed','sad')+'<path fill="#5AB0E8" d="M10 17c0 2-1 3.5-1 4.5a1.5 1.5 0 0 0 3 0c0-1-1-2.5-2-4.5z"/>'
E['scared']=emo('wide','o','#C9D6F2')
E['sorry']=emo('closed','sad')
E['surprise']=emo('wide','o')
E['glad']=emo('closed','grin')
E['bored']=emo('closed','o')+'<path d="M8 10h5M19 10h5"/>'
E['wow']=emo('star','grin')
E['upside']='<g transform="rotate(180 16 16)">'+emo('dot','smile')+'</g>'
E['dizzy']=emo('x','o')
E['silly']=emo('wink','open')
E['huff']=emo('dot','flat','#F07A5A')+'<path d="M5 22c-1.5 0-2.5-1-2.5-2M27 22c1.5 0 2.5-1 2.5-2"/>'
E['shh']=emo('dot','shh')+'<path fill="'+SK+'" d="M15 18v-6a1.5 1.5 0 0 1 3 0v6"/>'
E['zip']=emo('dot','zip')
E['dead']=emo('x','flat','#C9CED6')
E['monkeyeyes']='<circle cx="16" cy="16" r="12" fill="#9A6A43"/><path fill="#E9C79A" d="M9 14c0-3 3-4 7-4s7 1 7 4c0 2 1 3 1 5 0 4-4 7-8 7s-8-3-8-7c0-2 1-3 1-5z"/><path fill="'+SK2+'" d="M6 13h9v5H6zM17 13h9v5h-9z"/><path d="M13 23c2 1 4 1 6 0"/>'
E['ogre']='<circle cx="16" cy="17" r="11" fill="#E0525E"/><path fill="#fff" d="M8 8L6 2l5 4zM24 8l2-6-5 4z"/>'+eyes(15,4.5,'dot')+'<path fill="#fff" d="M10 21h12l-2 4h-8z"/><path d="M13 21v2M19 21v2"/>'
E['zzz']='<path d="M6 8h7l-7 8h7M17 4h5l-5 6h5M21 16h7l-7 9h7"/>'
E['thought']='<path fill="#fff" d="M9 20a6 6 0 0 1 1-12 7 7 0 0 1 12-1 5.5 5.5 0 0 1 3 11z"/><circle cx="8" cy="24" r="2.2" fill="#fff"/><circle cx="4.5" cy="28" r="1.3" fill="#fff"/>'
E['skull']='<path fill="#F1F3F6" d="M6 14a10 10 0 0 1 20 0c0 4-2 6-3 7v4h-3v-2h-2v2h-4v-2h-2v2H9v-4c-1-1-3-3-3-7z"/><circle cx="12" cy="14.5" r="2.5" class="l"/><circle cx="20" cy="14.5" r="2.5" class="l"/><path class="l2" d="M15 18.5h2l-1 2z"/>'
ITEMS={**{('p_'+k):v for k,v in P.items()},**{('e_'+k):v for k,v in E.items()}}
MAP={'🧒':'p_kid','👧':'p_girl','👦':'p_boy','👩':'p_woman','👨':'p_man','👵':'p_grandma','👴':'p_grandpa','🧑‍🏫':'p_teacher','🧔':'p_beard','👶':'p_baby','🧑':'p_person',
 '👩‍🦰':'p_redhead','👸':'p_princess','🤴':'p_prince','🧑‍⚕':'p_doctor','👨‍⚕':'p_doctor','🧑‍🚒':'p_fire','👮':'p_police','👨‍🍳':'p_cook','🧑‍🍳':'p_cook','👨‍✈':'p_pilot','👨‍🚀':'p_astronaut',
 '🕵':'p_detective','🦸':'p_hero','🦹':'p_villain','🧜':'p_mermaid','👤':'p_silh','🧍':'p_stand','🏃':'p_runner','🏊':'p_swim','💃':'p_dancer','🕺':'p_dancer2','🚴':'p_cyclist','🚣':'p_rower','🏇':'p_rider','🤸':'p_acro',
 '🤷':'p_shrug','👋':'p_wave','✋':'p_hand','🖐':'p_hand','🙏':'p_pray','🙌':'p_raise','👀':'p_eyes','👁':'p_eye','👃':'p_nose','👂':'p_ear','👄':'p_mouth','👅':'p_tongue','🦷':'p_tooth','🦶':'p_foot','🦵':'p_leg','👣':'p_steps','❤':'p_heart_r',
 '😴':'e_sleep','🥶':'e_cold','🥵':'e_hot','😠':'e_angry','😢':'e_cry','😨':'e_scared','😔':'e_sorry','😮':'e_surprise','😄':'e_glad','🥱':'e_bored','🤩':'e_wow','🙃':'e_upside','😵':'e_dizzy','🤪':'e_silly','😤':'e_huff','🤫':'e_shh','🤐':'e_zip','🙈':'e_monkeyeyes','👹':'e_ogre','💤':'e_zzz','💭':'e_thought','💀':'e_skull','🧑‍🤝‍🧑':'people','👭':'people'}
