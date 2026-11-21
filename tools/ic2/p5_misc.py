import p3_things
A=p3_things.ITEMS['f_arrow']
rot=lambda d: f'<g transform="rotate({d} 16 16)">{A}</g>'
ITEMS={'f_arrow_l':rot(180),'f_arrow_u':rot(-90),'f_arrow_d':rot(90)}
MAP={'💅':'sparkle','🧙‍♀':'wizard','⬅':'f_arrow_l','⬆':'f_arrow_u','⬇':'f_arrow_d'}
