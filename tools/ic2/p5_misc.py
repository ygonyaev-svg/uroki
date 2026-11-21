import p3_things
A=p3_things.ITEMS['f_arrow']
rot=lambda d: f'<g transform="rotate({d} 16 16)">{A}</g>'
ITEMS={'f_arrow_l':rot(180),'f_arrow_u':rot(-90),'f_arrow_d':rot(90),
 'f_notebook':p3_things.ITEMS.get('f_notebook',''),
 'ch_rook':'<path class="a" d="M10 27c0-4 1-8 2-12h8c1 4 2 8 2 12z"/><path class="b" d="M9 15V8h3v2.5h2.5V8h3v2.5H20V8h3v7z"/><path d="M8 28h16M11.5 15h9"/>',
 'ch_bishop':'<path class="a" d="M11 27c0-4 1.5-7 3-10h4c1.5 3 3 6 3 10z"/><path class="b" d="M16 4.5c3.5 2.5 5 5.5 4 9.5a4 4 0 0 1-8 0c-1-4 .5-7 4-9.5z"/><path d="M8 28h16M17.5 8.5l-2.5 3.5"/><circle cx="16" cy="3.5" r="1.4" class="l"/>',
 'ch_queen':'<path class="a" d="M11 27c0-5 1-8 2.5-12h5c1.5 4 2.5 7 2.5 12z"/><path class="b" d="M9.5 15h13l1.5-8-4 4-4-6-4 6-4-4z"/><path d="M8 28h16"/><circle cx="8" cy="6.5" r="1.3" class="l"/><circle cx="16" cy="4" r="1.3" class="l"/><circle cx="24" cy="6.5" r="1.3" class="l"/>',
}
ITEMS={k:v for k,v in ITEMS.items() if v}
MAP={'💅':'sparkle','🧙‍♀':'wizard','⬅':'f_arrow_l','⬆':'f_arrow_u','⬇':'f_arrow_d','📈':'chart','📒':'f_notebook',
 '♟':'pawn','♙':'pawn','♞':'knight','♘':'knight','♚':'king','♔':'king','♜':'ch_rook','♖':'ch_rook','♝':'ch_bishop','♗':'ch_bishop','♛':'ch_queen','♕':'ch_queen'}
