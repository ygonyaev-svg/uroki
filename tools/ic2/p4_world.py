R='#EF5B4C';O='#F59E3A';Y='#F7C142';G='#6CC070';DG='#3E9A55';B='#4C9BE8';LB='#BFE3F5';PU='#8B6CC9';BR='#9A6A43';TN='#E9C79A';W='#fff';GY='#C9CED6';DK='#3A3A48';PK='#F7A9B8';SKY='#9CD3F5'
N={}
CLOUD=lambda x=0,y=0,c=W: f'<path fill="{c}" transform="translate({x} {y})" d="M8 22a5 5 0 0 1 0-10 7 7 0 0 1 13-2 5.5 5.5 0 0 1 3 12z"/>'
SUN=lambda cx=16,cy=16,r=6: f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{Y}"/>'
SCENE=lambda sky,inner: f'<rect x="3" y="4" width="26" height="24" rx="4" fill="{sky}"/>{inner}<rect x="3" y="4" width="26" height="24" rx="4" fill="none"/>'
N['cloud']=CLOUD(0,1)
N['rain']=CLOUD(0,-3,GY)+f'<path stroke="{B}" d="M10 23l-1.5 4M16 23l-1.5 4M22 23l-1.5 4"/>'
N['storm']=CLOUD(0,-4,'#A3AEBD')+f'<path fill="{Y}" d="M15 18l-4 7h4l-2 6 7-9h-4l2-4z"/>'
N['suncloud']=SUN(11,11,6)+'<path d="M11 2v2M3 11h2M5 5l1.5 1.5M17 5l-1.5 1.5"/>'+CLOUD(4,4)
N['sunface']=SUN(16,16,8)+'<path d="M16 3v3M16 26v3M3 16h3M26 16h3M7 7l2 2M23 23l2 2M7 25l2-2M23 9l2-2"/><circle cx="13" cy="15" r="1" class="l"/><circle cx="19" cy="15" r="1" class="l"/><path d="M13 19c2 1.5 4 1.5 6 0"/>'
N['fog']=f'<path d="M4 10h18M8 15h20M4 20h16M10 25h16" stroke="{GY}" stroke-width="3"/>'
N['wind']='<path d="M3 12h15a4 4 0 1 0-4-4"/><path d="M3 18h20a4 4 0 1 1-4 4"/><path d="M3 24h9"/>'
N['tornado']=f'<path d="M4 6h24M6 11h20M9 16h14M12 21h9M14 26h4" stroke="{GY}" stroke-width="3"/>'
N['umbrella']=f'<path fill="{PU}" d="M3 16C3 9 9 4 16 4s13 5 13 12c-2-2-4-2-6 0-2-2-5-2-7 0-2-2-5-2-7 0-2-2-4-2-6 0z"/><path d="M16 4V2M16 16v10a3 3 0 0 1-6 0"/>'
N['rainbow']=f'<path d="M3 24a13 13 0 0 1 26 0" stroke="{R}" stroke-width="3"/><path d="M6.5 24a9.5 9.5 0 0 1 19 0" stroke="{Y}" stroke-width="3"/><path d="M10 24a6 6 0 0 1 12 0" stroke="{B}" stroke-width="3"/>'+CLOUD(-5,6)+CLOUD(14,6)
N['snowman']=f'<circle cx="16" cy="22" r="7" fill="{W}"/><circle cx="16" cy="11" r="5" fill="{W}"/><path fill="{DK}" d="M12 7h8V2h-8z"/><path d="M10 7h12"/><path fill="{O}" d="M16 11l4 1-4 1z"/><circle cx="14" cy="10" r=".8" class="l"/><path d="M9 17l-5-3M23 17l5-3"/><circle cx="16" cy="20" r=".8" class="l"/><circle cx="16" cy="24" r=".8" class="l"/>'
N['bolt']=f'<path fill="{Y}" d="M18 3L6 18h8l-3 11 13-16h-8z"/>'
N['boom']=f'<path fill="{O}" d="M16 2l3 8 8-4-4 8 8 3-8 3 4 8-8-4-3 8-3-8-8 4 4-8-8-3 8-3-4-8 8 4z"/><path fill="{Y}" d="M16 9l2 5 5-2-2 5 5 1-5 2 2 4-5-2-2 5-2-5-5 2 2-4-5-2 5-1-2-5 5 2z" stroke="none"/>'
N['splash']=f'<path fill="{B}" d="M9 4s-5 7-5 10a5 5 0 0 0 10 0c0-3-5-10-5-10zM22 12s-5 7-5 10a5 5 0 0 0 10 0c0-3-5-10-5-10z"/>'
N['smoke']=f'<path fill="{GY}" d="M5 24a4 4 0 0 1 2-7.5 5 5 0 0 1 9-3 4 4 0 0 1 7 2 4 4 0 0 1 3 7.5z"/><path d="M8 10c2-2 5-2 7 0M18 8c2-2 5-2 7 0" stroke="{GY}"/>'
N['swirl']=f'<path d="M16 16a3 3 0 1 1 3 3 6 6 0 0 1-9-4 9 9 0 0 1 12-9 12 12 0 0 1 4 18" stroke="{B}" stroke-width="2.6"/>'
N['infinity']=f'<path d="M16 16c-3-4-5-6-8-6a6 6 0 0 0 0 12c3 0 5-2 8-6s5-6 8-6a6 6 0 0 1 0 12c-3 0-5-2-8-6z" stroke="{PU}" stroke-width="2.8"/>'
# растения
FL=lambda c,cc=Y: ''.join(f'<circle cx="{16+5*__import__("math").cos(a*1.2566):.1f}" cy="{12+5*__import__("math").sin(a*1.2566):.1f}" r="4" fill="{c}"/>' for a in range(5))+f'<circle cx="16" cy="12" r="3" fill="{cc}"/>'
STEM='<path d="M16 17v12"/><path fill="'+G+'" d="M16 25c-4 0-6-2-7-5 4 0 6 2 7 5zM16 23c3 0 5-2 6-4-3 0-5 1-6 4z"/>'
N['blossom']=STEM+FL('#F7B6CC')
N['daisy']=STEM+FL(W)
N['sunflower']=STEM+''.join(f'<ellipse cx="16" cy="5" rx="2.4" ry="4.5" fill="{Y}" transform="rotate({a*36} 16 12)"/>' for a in range(10))+f'<circle cx="16" cy="12" r="4.5" fill="{BR}"/>'
N['tulip']=STEM+f'<path fill="{R}" d="M10 6l3 3 3-5 3 5 3-3v6c0 4-3 6-6 6s-6-2-6-6z"/>'
N['rose']=STEM+f'<path fill="{R}" d="M16 4c4 0 7 3 7 7s-3 6-7 6-7-2-7-6 3-7 7-7z"/><path d="M13 9c1-2 5-2 6 1-1 2-4 2-5 0M11 12c2 3 8 3 10 0"/>'
N['wheat']=f'<path d="M16 29V6"/>'+''.join(f'<ellipse cx="{16+sx*3}" cy="{y}" rx="2" ry="3.6" fill="{Y}" transform="rotate({sx*30} {16+sx*3} {y})"/>' for y in (8,13,18) for sx in (-1,1))+f'<ellipse cx="16" cy="4.5" rx="2" ry="3.2" fill="{Y}"/>'
N['herb']=f'<path d="M6 28C10 20 16 12 26 5"/>'+''.join(f'<path fill="{G}" d="M{x} {y}c-4 0-6-2-6-5 4 0 6 2 6 5zM{x} {y}c0-4 2-6 5-6 0 4-2 6-5 6z"/>' for x,y in ((10,22),(15,16),(20,11)))
N['palm']=f'<path fill="{BR}" d="M15 13c-1 6 0 11 1 16h3c-1-5-2-10-1-16z"/><path fill="{G}" d="M16 12C12 7 6 6 3 9c4-1 7 0 9 3-4-1-7 1-8 4 3-2 7-3 10-2zM17 12c4-5 10-6 13-3-4-1-7 0-9 3 4-1 7 1 8 4-3-2-7-3-10-2zM16 12c-1-4 0-8 3-9-1 3-1 6-1 9z"/><path d="M8 29h16"/>'
N['cactus']=f'<path fill="{DG}" d="M13 28V8a3 3 0 0 1 6 0v20zM13 18H9a2 2 0 0 1-2-2v-4a1.5 1.5 0 0 1 3 0v3h3M19 15h3v-4a1.5 1.5 0 0 1 3 0v5a2 2 0 0 1-2 2h-4"/><path fill="{O}" d="M9 28h14l-1 3H10z"/>'
N['xmas']=f'<path fill="{DG}" d="M16 2l6 8h-3l5 7h-3l6 8H5l6-8H8l5-7h-3z"/><path fill="{BR}" d="M14 25h4v4h-4z"/><circle cx="13" cy="18" r="1.3" fill="{R}"/><circle cx="19" cy="21" r="1.3" fill="{Y}"/><circle cx="17" cy="13" r="1.2" fill="{B}"/>'
N['mushroom']=f'<path fill="#F5EEDD" d="M12 17h8l1 10c0 1-1 2-2 2h-6c-1 0-2-1-2-2z"/><path fill="{R}" d="M3 17c0-7 6-12 13-12s13 5 13 12z"/><circle cx="10" cy="11" r="1.6" fill="#fff"/><circle cx="17" cy="9" r="2" fill="#fff"/><circle cx="23" cy="13" r="1.5" fill="#fff"/>'
N['potplant']=f'<path fill="#C8743A" d="M8 18h16l-2 11H10z"/><path d="M7 18h18"/><path d="M16 18V8"/><path fill="{G}" d="M16 14c-4 0-7-2-8-6 4 0 7 2 8 6zM16 11c3-1 6-3 6-7-4 1-6 3-6 7zM16 18c3-1 7-1 9 1-3 2-7 2-9-1z"/>'
N['clover']=f'<path fill="{DG}" d="M16 15c-4-3-9-2-9 2s5 4 9 1c-3 4-2 9 2 9 4 0 3-6 0-9 4 3 9 3 9-1s-5-5-9-2c3-4 2-9-2-9s-3 6 0 9z"/><path d="M16 17c1 4 3 8 7 12"/>'
# места и пейзажи
N['school']=f'<path fill="#F2D488" d="M3 14l13-8 13 8v14H3z"/><path fill="{R}" d="M3 14l13-8 13 8"/><path d="M16 6V2l4 1-4 1"/><path fill="{LB}" d="M7 17h4v4H7zM21 17h4v4h-4z"/><path fill="#C8743A" d="M13 28v-8h6v8z"/><circle cx="16" cy="12" r="2" fill="#fff"/>'
N['river']=SCENE(SKY,f'<path fill="{G}" d="M3 17c6-2 12-2 26 1v10H3z" stroke="none"/><path fill="{B}" d="M12 16c4 1 4 4 1 6s-6 4-4 6h10c-2-2 2-4 4-6s0-5-5-6z"/><path fill="{DG}" d="M5 17l3-6 3 6zM21 16l3-6 3 6z"/>')
N['sunrise']=SCENE('#FBD38D',f'<circle cx="16" cy="20" r="6" fill="{O}"/><path fill="{B}" stroke="none" d="M3 20h26v8H3z"/><path d="M3 20h26M8 24h6M18 24h6"/>')
N['sunset']=SCENE('#F7A880',f'<circle cx="16" cy="21" r="6" fill="{Y}"/><path fill="{PU}" d="M3 22l7-7 5 5 5-6 9 8v6H3z"/>')
N['dawnmnt']=N['sunrise'].replace(f'<path fill="{B}" stroke="none" d="M3 20h26v8H3z"/><path d="M3 20h26M8 24h6M18 24h6"/>',f'<path fill="{PU}" d="M3 26l8-10 5 6 4-4 9 8v2H3z"/>')
N['night']=SCENE('#2F3B6E',f'<path fill="{Y}" d="M21 7a5 5 0 1 0 4 8 4 4 0 0 1-4-8z"/><path fill="#5A5A7A" d="M3 28V18h5v-4h5v6h4v-8h6v6h6v10z"/><path fill="{Y}" stroke="none" d="M15 15h2v2h-2zM19 21h2v2h-2zM6 21h2v2H6z"/><circle cx="9" cy="9" r=".8" fill="#fff" stroke="none"/><circle cx="14" cy="7" r=".6" fill="#fff" stroke="none"/>')
N['evening']=SCENE('#F2A26B',f'<path fill="#6A5A8A" d="M3 28V17h5v-4h5v6h4v-8h6v6h6v11z"/><path fill="{Y}" stroke="none" d="M15 14h2v2h-2zM19 20h2v2h-2zM6 20h2v2H6z"/>')
N['city']=SCENE(SKY,f'<path fill="#8FA3B8" d="M3 28V17h5v-6h5v8h4V8h6v9h6v11z"/><path fill="#fff" stroke="none" d="M15 11h1.5v2H15zM18 11h1.5v2H18zM15 15h1.5v2H15zM18 15h1.5v2H18zM9 14h1.5v2H9z"/>')
N['bridge']=SCENE(SKY,f'<path fill="{B}" stroke="none" d="M3 22h26v6H3z"/><path fill="{R}" d="M3 18h26v3H3z"/><path d="M8 7v15M24 7v15M8 7c3 6 13 6 16 0M3 10c2 3 4 5 5 7M29 10c-2 3-4 5-5 7M12 12v6M16 13v5M20 12v6"/>')
N['mountain']=f'<path fill="#A3AEBD" d="M2 27L12 9l5 8 4-5 9 15z"/><path fill="#fff" d="M9.5 13.5L12 9l2.5 4.5-1.3 1.5-1.2-1.2-1.3 1.2zM19 14.5l2-2.5 2 2.5-1 1-1-.8-1 .8z"/>'
N['snowmnt']=N['mountain']
N['volcano']=f'<path fill="#9A6A43" d="M2 28l9-14h10l9 14z"/><path fill="{R}" d="M11 14h10l-2 5c-1-1-2-1-3 1-1-2-2-2-3-1z"/><path fill="{GY}" d="M12 10a3 3 0 0 1 2-5 4 4 0 0 1 7 0 3 3 0 0 1 1 5z"/>'
N['beach']=f'<rect x="3" y="4" width="26" height="24" rx="4" fill="{SKY}"/><path fill="#F2D488" stroke="none" d="M3 20h26v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path fill="{B}" stroke="none" d="M3 17h26v3H3z"/><path fill="{R}" d="M8 14a8 8 0 0 1 16 0z"/><path d="M16 14v10"/>'+SUN(24,8,2.5)+'<rect x="3" y="4" width="26" height="24" rx="4" fill="none"/>'
N['island']=f'<path fill="{B}" d="M2 24c4-2 8-2 14-2s10 0 14 2v4H2z"/><path fill="#F2D488" d="M7 23c2-4 6-5 10-5s7 2 9 5z"/><path fill="{BR}" d="M15 19c0-4 1-8 3-11l1.5.5c-2 3-2.5 6-2.5 10.5z"/><path fill="{G}" d="M18 8c-3-3-7-3-9-1 3 0 5 1 6 3-3 0-5 2-5 4 2-2 5-3 8-3zM18 8c3-3 7-3 9-1-3 0-5 1-6 3 3 0 5 2 5 4-2-2-5-3-8-3z"/>'
N['desert']=f'<rect x="3" y="4" width="26" height="24" rx="4" fill="#FBD38D"/><path fill="#E0A55A" stroke="none" d="M3 20c6-4 14-4 26 0v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/>'+SUN(22,10,3)+f'<path fill="{DG}" d="M9 24v-9a1.5 1.5 0 0 1 3 0v9zM9 20H7.5v-3M12 18h1.5v-3"/><rect x="3" y="4" width="26" height="24" rx="4" fill="none"/>'
N['hut']=f'<path fill="#E0A55A" d="M2 16L16 4l14 12z"/><path fill="#C8743A" d="M6 16h20v12H6z"/><path fill="{DK}" d="M13 28v-7h6v7z"/><path d="M6 10l4 3M26 10l-4 3"/>'
N['stadium']=f'<ellipse cx="16" cy="19" rx="14" ry="8" fill="#8FA3B8"/><ellipse cx="16" cy="19" rx="10" ry="5" fill="{G}"/><path d="M16 14v10M6 19h20"/><path d="M5 8v8M27 8v8"/><path fill="{Y}" d="M3 6h4v3H3zM25 6h4v3h-4z"/>'
N['museum']=f'<path fill="#F5EEDD" d="M3 12L16 4l13 8z"/><path fill="#F5EEDD" d="M4 26h24v3H4zM5 12h22v2H5z"/><path d="M8 14v12M13 14v12M19 14v12M24 14v12"/>'
N['bank']=N['museum']+f'<circle cx="16" cy="9" r="1.6" fill="{Y}"/>'
N['tower']=f'<path fill="#E8ECF1" d="M12 29l2-20h4l2 20z"/><path fill="{R}" stroke="none" d="M13 22h6l.5 4h-7zM13.8 15h4.4l.4 3.5h-5.2z"/><path d="M12 29l2-20h4l2 20z" fill="none"/><path fill="{Y}" d="M13 5h6v4h-6z"/><path d="M12 5l4-3 4 3M9 29h14M6 6l5 1M26 6l-5 1"/>'
N['church']=f'<path fill="#F5EEDD" d="M10 14l6-6 6 6v15H10z"/><path fill="#F5EEDD" d="M4 18h6v11H4zM22 18h6v11h-6z"/><path d="M16 8V2M13.5 4h5"/><path fill="#C8743A" d="M14 29v-5a2 2 0 0 1 4 0v5z"/><circle cx="16" cy="16" r="2" fill="{LB}"/>'
N['hospital']=f'<rect x="4" y="8" width="24" height="21" fill="#fff"/><path fill="{R}" stroke="none" d="M14 11h4v3h3v4h-3v3h-4v-3h-3v-4h3z"/><path fill="{LB}" d="M7 22h4v4H7zM21 22h4v4h-4z"/><path d="M2 29h28"/>'
N['station']=f'<path fill="#E0A55A" d="M3 12l13-6 13 6z"/><path fill="#F5EEDD" d="M5 12h22v14H5z"/><circle cx="16" cy="9" r="1.6" fill="#fff"/><path fill="{B}" d="M9 16h14v6H9z"/><path d="M3 28h26M7 26l1 2M24 26l1 2"/>'
N['busstop']=f'<path d="M8 29V4"/><circle cx="8" cy="7" r="5" fill="{B}"/><text x="8" y="10" text-anchor="middle" font-size="8" font-weight="900" fill="#fff" stroke="none" style="font-family:inherit">A</text><path fill="{LB}" d="M14 12h14v13H14z"/><path d="M14 25v4M28 25v4M14 19h14"/>'
N['mailbox']=f'<path fill="{R}" d="M4 11a5 5 0 0 1 10 0v9H4zM9 6h14a5 5 0 0 1 5 5v9H14"/><path d="M14 11v9M18 20v9"/><path fill="#fff" d="M7 13h4v2H7z"/><path d="M22 6V2h4v2.5h-4"/>'
N['shopcart']=f'<path d="M2 4h4l3 14h16l3-10H8"/><path fill="{Y}" d="M8.6 9H26.7L24.5 16H10z"/><circle cx="11" cy="24" r="2.5" fill="{DK}"/><circle cx="22" cy="24" r="2.5" fill="{DK}"/><path d="M9 18l-1 3h17"/>'
N['map']=f'<path fill="#F2D488" d="M3 7l8-3 10 3 8-3v21l-8 3-10-3-8 3z"/><path d="M11 4v21M21 7v21"/><path stroke="{R}" stroke-dasharray="2 2" d="M6 20c3-4 6 0 9-4s6-3 9-7"/><path stroke="{R}" d="M23 7l3 3M26 7l-3 3"/>'
N['toilet']=f'<rect x="3" y="5" width="26" height="22" rx="4" fill="{B}"/><path d="M16 8v16" stroke="#fff"/><circle cx="10" cy="10" r="1.8" fill="#fff" stroke="none"/><circle cx="22" cy="10" r="1.8" fill="#fff" stroke="none"/><path fill="#fff" stroke="none" d="M8 13h4v6h-1v5H9v-5H8zM20 13h4l1.5 6H24v5h-4v-5h-1.5z"/>'
N['hole']=f'<ellipse cx="16" cy="20" rx="13" ry="6" fill="#9A6A43"/><ellipse cx="16" cy="19" rx="9" ry="4" fill="{DK}"/>'
N['road']=f'<path fill="#6A6A7A" d="M11 4h10l7 25H4z"/><path stroke="#fff" stroke-width="2" d="M16 6v4M16 13v4M16 20v5"/>'
N['telescope']=f'<path fill="{B}" d="M3 15L22 5l3 6L6 21z"/><path fill="{GY}" d="M22 5l3-1 3 6-3 1z"/><path d="M13 16l-5 13M14 16l3 13M14 16l7 11"/>'
N['planet']=f'<circle cx="16" cy="16" r="8" fill="{O}"/><ellipse cx="16" cy="16" rx="14" ry="4" transform="rotate(-20 16 16)" fill="none" stroke-width="2.2"/><path fill="{O}" stroke="none" d="M8.5 13a8 8 0 0 1 15 0z"/>'
N['satellite']=f'<path fill="{B}" d="M2 9l6-6 6 6-6 6zM18 23l6-6 6 6-6 6z"/><path fill="{GY}" d="M11 16l5-5 5 5-5 5z"/><path d="M8 9l3 3M21 21l3 3M24 3c3 1 5 3 6 6M22 6c2 .5 3 2 4 4"/>'
N['rocket']=f'<path fill="#fff" d="M16 2c5 4 7 10 6 18h-12c-1-8 1-14 6-18z"/><circle cx="16" cy="12" r="3" fill="{LB}"/><path fill="{R}" d="M10 16l-5 6 1 4 4-3zM22 16l5 6-1 4-4-3z"/><path fill="{O}" d="M12 22h8l-1 4-3 4-3-4z"/>'
# транспорт
WHEEL=lambda x,y,r=3: f'<circle cx="{x}" cy="{y}" r="{r}" fill="{DK}"/><circle cx="{x}" cy="{y}" r="1" fill="#fff" stroke="none"/>'
N['car']=f'<path fill="{R}" d="M3 20c0-2 1-4 3-4l4-6h11l5 6c2 0 3 2 3 4v3H3z"/><path fill="{LB}" d="M11 11.5h4v4.5H8.5zM17 11.5h3.5l3.5 4.5h-7z"/>'+WHEEL(9,23)+WHEEL(23,23)
N['racecar']=f'<path fill="{R}" d="M2 20l4-5h8l4-3h6l2 3h4v6H2z"/><path fill="{DK}" d="M24 9h5v3h-5z"/><path fill="#fff" stroke="none" d="M11 17h4v3h-4z"/>'+WHEEL(8,22,3.5)+WHEEL(24,22,3.5)
N['bus']=f'<rect x="3" y="6" width="26" height="17" rx="3" fill="{Y}"/><path fill="{LB}" d="M6 9h5v5H6zM13 9h5v5h-5zM20 9h6v5h-6z"/><path d="M3 18h26"/>'+WHEEL(9,24)+WHEEL(23,24)
N['tram']=f'<rect x="5" y="7" width="22" height="18" rx="4" fill="{R}"/><path fill="{LB}" d="M8 10h7v6H8zM17 10h7v6h-7z"/><path d="M12 7L16 2l4 5M10 2h12M8 28l3-3M24 28l-3-3"/>'
N['metro']=f'<rect x="6" y="4" width="20" height="21" rx="5" fill="{B}"/><path fill="{LB}" d="M9 8h14v7H9z"/><circle cx="11" cy="20" r="1.5" fill="{Y}"/><circle cx="21" cy="20" r="1.5" fill="{Y}"/><path d="M9 29l3-4M23 29l-3-4"/>'
N['train']=f'<path fill="{R}" d="M3 22V12h6V7h8v15z"/><path fill="{DK}" d="M17 13h12v9H17z"/><path fill="{LB}" d="M11 9h4v4h-4z"/><path fill="{GY}" d="M5 6h3v6H5z"/><path d="M5 3c0-1 2-2 3-1"/>'+WHEEL(7,24)+WHEEL(14,24)+WHEEL(23,24)
N['fasttrain']=f'<path fill="#fff" d="M2 22V14c0-3 3-5 7-5h12c5 0 9 6 9 13z"/><path fill="{B}" d="M2 18h28v4H2z" stroke="none"/><path fill="{LB}" d="M22 11c3 0 5 2 6 5h-6zM8 12h4v4H8zM14 12h4v4h-4z"/><path d="M2 22V14c0-3 3-5 7-5h12c5 0 9 6 9 13z" fill="none"/><path d="M1 26h30"/>'
N['wagon']=f'<rect x="3" y="7" width="26" height="15" rx="2" fill="{G}"/><path fill="{LB}" d="M6 10h5v5H6zM13.5 10h5v5h-5zM21 10h5v5h-5z"/>'+WHEEL(9,24)+WHEEL(23,24)
N['plane']=f'<path fill="#fff" d="M2 15c0-1 1-2 3-2h18l5-6h2l-2 8 1 2H5c-2 0-3-1-3-2z"/><path fill="{B}" d="M12 15l-4 9h3l7-9zM14 13l-3-6h3l5 6z"/><path fill="{LB}" d="M5 13h2v2H5z" stroke="none"/>'
N['ship']=f'<path fill="{R}" d="M3 19h26l-4 8H7z"/><path fill="#fff" d="M8 13h16v6H8z"/><path fill="{DK}" d="M12 7h4v6h-4zM18 9h3v4h-3z"/><path fill="{B}" stroke="none" d="M2 28c4-2 7-2 10 0s7 2 10 0 6-2 8-1v3H2z"/>'
N['sailboat']=f'<path fill="#fff" d="M16 3v16H6z"/><path fill="{Y}" d="M18 6c5 3 8 8 8 13h-8z"/><path fill="#C8743A" d="M4 21h24l-4 6H8z"/><path fill="{B}" stroke="none" d="M2 28c4-2 7-2 10 0s7 2 10 0 6-2 8-1v3H2z"/>'
N['canoe']=f'<path fill="#C8743A" d="M2 18c8 4 20 4 28 0-2 4-7 6-14 6S4 22 2 18z"/><path d="M8 8l16 14M24 22l3 2-1-3"/><path fill="{B}" stroke="none" d="M2 27c4-2 7-2 10 0s7 2 10 0 6-2 8-1v3H2z"/>'
N['bike']=WHEEL(8,21,5).replace(f'fill="{DK}"','fill="none"')+WHEEL(24,21,5).replace(f'fill="{DK}"','fill="none"')+f'<path d="M8 21l5-9h8l3 9M13 12l3 9h-8M19 8h4M11 9h4"/><path fill="{R}" d="M13 12h8l-5 9z" stroke="none" opacity=".0"/>'
N['tractor']=f'<path fill="{G}" d="M4 20v-6h9V7h8l2 7h5v6z"/><path fill="{LB}" d="M15 9h4l1.5 5H15z"/><path d="M8 14V9"/>'+WHEEL(10,22,5)+WHEEL(25,23,3.5)
N['sled']=f'<path fill="{R}" d="M6 14h18v5H6z"/><path d="M3 23h22c3 0 4-2 4-4M8 19v4M22 19v4"/>'
N['skis']=f'<path d="M5 28L22 3M11 30L28 5" stroke="{R}" stroke-width="3"/><path d="M3 21l10 3M8 24l9 3" stroke-width="1.6"/>'
N['skates']=f'<path fill="#fff" d="M8 3h9v11c4 0 7 2 9 4v3H6z"/><path d="M8 8h9M5 26h22c1 0 2-1 2-2M8 21v5M22 21v5"/>'
N['wheel']=f'<circle cx="16" cy="16" r="13" fill="{DK}"/><circle cx="16" cy="16" r="7" fill="{GY}"/><circle cx="16" cy="16" r="2" fill="#fff"/><path d="M16 9v4M16 19v4M9 16h4M19 16h4"/>'
# цвета, флаги
for n,c in [('c_blue','#3B82F6'),('c_red','#EF4444'),('c_black','#2A2A35'),('c_green','#22C55E'),('c_yellow','#FACC15'),('c_white','#FFFFFF'),('c_orange','#F97316'),('c_brown','#8B5A2B'),('c_purple','#9B59D0')]:
    N[n]=f'<circle cx="16" cy="16" r="12" fill="{c}"/>'
N['sq_red']='<rect x="4" y="4" width="24" height="24" rx="4" fill="#EF4444"/>'
N['sq_yellow']='<rect x="5" y="3" width="22" height="26" rx="3" fill="#FACC15"/>'
N['fl_pt']='<rect x="3" y="7" width="26" height="18" rx="2" fill="#E0363A"/><path fill="#1E8A3C" stroke="none" d="M4.5 8.5h9.5v15H4.5z"/><circle cx="14" cy="16" r="4" fill="#F7C142"/><rect x="3" y="7" width="26" height="18" rx="2" fill="none"/>'
N['fl_ie']='<rect x="3" y="7" width="26" height="18" rx="2" fill="#fff"/><path fill="#1E9A50" stroke="none" d="M4.5 8.5H12v15H4.5z"/><path fill="#F58A2A" stroke="none" d="M20 8.5h7.5v15H20z"/><rect x="3" y="7" width="26" height="18" rx="2" fill="none"/>'
N['fl_fr']='<rect x="3" y="7" width="26" height="18" rx="2" fill="#fff"/><path fill="#2A54B0" stroke="none" d="M4.5 8.5H12v15H4.5z"/><path fill="#E0363A" stroke="none" d="M20 8.5h7.5v15H20z"/><rect x="3" y="7" width="26" height="18" rx="2" fill="none"/>'
N['fl_pirate']='<path d="M6 29V3"/><path fill="#2A2A35" d="M6 4h22v14H6z"/><circle cx="17" cy="10" r="3.5" fill="#fff" stroke="none"/><path stroke="#fff" d="M12 15l10-2M12 13l10 2"/>'
N['cowboy']='<path fill="#C8743A" d="M10 14c0-6 2-9 6-9s6 3 6 9z"/><path fill="#C8743A" d="M2 13c3 3 7 4 14 4s11-1 14-4c-1 4-6 6-14 6S3 17 2 13z"/><circle cx="16" cy="24" r="0" />'
N['graduate']='<path fill="#2F3B55" d="M2.5 12L16 6l13.5 6L16 18z"/><path fill="#2F3B55" d="M8 15v6c0 2 3.5 4 8 4s8-2 8-4v-6l-8 3.5z"/><path d="M29.5 12v8"/><circle cx="29.5" cy="21" r="1.4" fill="#F7C142"/>'
N['tdino']=f'<path fill="{G}" d="M4 27v-7c0-6 4-9 9-9h3V7c0-2 1.5-3.5 3.5-3.5h5c2 0 3.5 1.5 3.5 3.5v3c0 1.5-1 2.5-2.5 2.5H22v6c0 4-2 6-4 7v2h-3v-2h-4v2H8v-2c-2 0-4-1-4-3"/><circle cx="21.5" cy="7.5" r="1" class="l"/>'
N['otter']=''
ITEMS={('n_'+k):v for k,v in N.items() if v}
MAP={'☁':'n_cloud','🌧':'n_rain','⛈':'n_storm','🌤':'n_suncloud','🌞':'n_sunface','🌫':'n_fog','🌪':'n_tornado','☂':'n_umbrella','🌈':'n_rainbow','⛄':'n_snowman','⚡':'n_bolt','💥':'n_boom','💦':'n_splash','💨':'n_smoke','🌀':'n_swirl','♾':'n_infinity',
 '🌸':'n_blossom','🌼':'n_daisy','🌻':'n_sunflower','🌷':'n_tulip','🌹':'n_rose','🌾':'n_wheat','🌿':'n_herb','🌴':'n_palm','🌵':'n_cactus','🎄':'n_xmas','🍄':'n_mushroom','🪴':'n_potplant','☘':'n_clover',
 '🏫':'n_school','🏞':'n_river','🌅':'n_sunrise','🌄':'n_dawnmnt','🌃':'n_night','🌆':'n_evening','🏙':'n_city','🌉':'n_bridge','⛰':'n_mountain','🏔':'n_snowmnt','🌋':'n_volcano','🏖':'n_beach','🏝':'n_island','🏜':'n_desert','🛖':'n_hut','🏟':'n_stadium','🏛':'n_museum','🏦':'n_bank','🗼':'n_tower','⛪':'n_church','🏥':'n_hospital','🚉':'n_station','🚏':'n_busstop','📮':'n_mailbox','🛒':'n_shopcart','🗺':'n_map','🚻':'n_toilet','🕳':'n_hole','🛣':'n_road','🔭':'n_telescope','🪐':'n_planet','🛰':'n_satellite','🚀':'n_rocket',
 '🚗':'n_car','🏎':'n_racecar','🚌':'n_bus','🚋':'n_tram','🚇':'n_metro','🚂':'n_train','🚆':'n_fasttrain','🚃':'n_wagon','✈':'n_plane','🚢':'n_ship','⛵':'n_sailboat','🛶':'n_canoe','🚲':'n_bike','🚜':'n_tractor','🛷':'n_sled','🎿':'n_skis','⛸':'n_skates','🛞':'n_wheel',
 '🔵':'n_c_blue','🔴':'n_c_red','⚫':'n_c_black','🟢':'n_c_green','🟡':'n_c_yellow','⚪':'n_c_white','🟠':'n_c_orange','🟤':'n_c_brown','🟣':'n_c_purple','🟥':'n_sq_red','🟨':'n_sq_yellow','🇵🇹':'n_fl_pt','🇮🇪':'n_fl_ie','🇫🇷':'n_fl_fr','🏴‍☠':'n_fl_pirate','🤠':'n_cowboy','🎓':'n_graduate','🦖':'n_tdino'}
