/* ===== Словоход: начальные курсы французского, немецкого и испанского (объяснения по-русски) =====
   Слова: «слово|перевод|эмодзи». Озвучка — через LCODE(kid, tr). */
function LW(s){ return s.split(';').map(x => x.split('|')); }
function langCourse(p, lname, T, G){
  const v = (n, t, k, intro) => ({ id: p + '_' + n, t, th: vocabTheory(T[k], intro), g: vocabGen(T[k], lname) });
  return [
    v(1, T.n.hello, 'hello', T.i.hello), v(2, T.n.num, 'num'), v(3, T.n.col, 'col', T.i.col), v(4, T.n.ani, 'ani', T.i.ani),
    { id: p + '_5', t: G[0][0], th: G[0][1], g: B(G[0][2]) },
    v(6, T.n.fam, 'fam'), v(7, T.n.food, 'food'),
    { id: p + '_8', t: G[1][0], th: G[1][1], g: B(G[1][2]) },
    v(9, T.n.school, 'school'), v(10, T.n.phr, 'phr', T.i.phr),
    { id: p + '_11', t: G[2][0], th: G[2][1], g: B(G[2][2]) },
    v(12, T.n.verbs, 'verbs')
  ];
}
const FR_T = {
  n: { hello: 'Bonjour ! Приветствия', num: 'Числа 1–10', col: 'Цвета', ani: 'Животные', fam: 'Семья', food: 'Еда', school: 'Школа', phr: 'Фразы для общения', verbs: 'Что я умею' },
  i: { hello: 'Французы при встрече говорят <b>bonjour</b>, а вечером <b>bonsoir</b>. Друзьям можно сказать <b>salut</b>.', col: 'Прилагательное обычно стоит <b>после</b> слова: un chat <b>noir</b> — чёрный кот.', ani: '<b>Le</b> — мужской род, <b>la</b> — женский.', phr: 'Нажми на фразу, чтобы послушать.' },
  hello: LW('bonjour|здравствуйте|👋;salut|привет|🙂;bonsoir|добрый вечер|🌙;au revoir|до свидания|👋;merci|спасибо|🙏;s\'il te plaît|пожалуйста|🙂;oui|да|✅;non|нет|❌;Je m\'appelle…|Меня зовут…|🧒;Ça va ?|Как дела?|😊'),
  num: LW('un|один|1;deux|два|2;trois|три|3;quatre|четыре|4;cinq|пять|5;six|шесть|6;sept|семь|7;huit|восемь|8;neuf|девять|9;dix|десять|10'),
  col: LW('rouge|красный|🔴;bleu|синий|🔵;vert|зелёный|🟢;jaune|жёлтый|🟡;noir|чёрный|⚫;blanc|белый|⚪;orange|оранжевый|🟠;rose|розовый|🩷;marron|коричневый|🟤;gris|серый|🩶'),
  ani: LW('le chat|кошка|🐱;le chien|собака|🐶;le poisson|рыба|🐟;l\'oiseau|птица|🐦;le cheval|лошадь|🐴;la vache|корова|🐮;le lapin|кролик|🐰;le lion|лев|🦁;la souris|мышь|🐭;l\'ours|медведь|🐻'),
  fam: LW('la mère|мама|👩;le père|папа|👨;le frère|брат|👦;la sœur|сестра|👧;la grand-mère|бабушка|👵;le grand-père|дедушка|👴;la famille|семья|👪;l\'ami|друг|🧑‍🤝‍🧑;le bébé|малыш|👶;l\'oncle|дядя|🧔'),
  food: LW('la pomme|яблоко|🍎;le pain|хлеб|🍞;le lait|молоко|🥛;l\'eau|вода|💧;le fromage|сыр|🧀;l\'œuf|яйцо|🥚;la glace|мороженое|🍦;le jus|сок|🧃;la soupe|суп|🍲;le gâteau|торт|🎂'),
  school: LW('l\'école|школа|🏫;le livre|книга|📖;le crayon|карандаш|✏️;le stylo|ручка|🖊️;le cartable|портфель|🎒;le professeur|учитель|🧑‍🏫;la table|стол|🪑;la règle|линейка|📏;le cahier|тетрадь|📓;la classe|класс|🏫'),
  phr: LW('Je ne comprends pas.|Я не понимаю.|🤔;Répète, s\'il te plaît.|Повтори, пожалуйста.|🔁;J\'ai faim.|Я хочу есть.|🍽️;J\'ai soif.|Я хочу пить.|🥤;Où sont les toilettes ?|Где туалет?|🚻;Comment ça s\'appelle ?|Как это называется?|❓;Je ne sais pas.|Я не знаю.|🤷;On joue ?|Поиграем?|⚽'),
  verbs: LW('Je sais nager.|Я умею плавать.|🏊;J\'aime lire.|Я люблю читать.|📖;J\'habite au Portugal.|Я живу в Португалии.|🇵🇹;Je joue au football.|Я играю в футбол.|⚽;J\'ai un chien.|У меня есть собака.|🐶;Je vais à l\'école.|Я иду в школу.|🏫')
};
const FR_G = [
  ['Le, la, les — артикли', 'Перед словом во французском почти всегда стоит артикль. <b>le</b> — мужской род (le chat), <b>la</b> — женский (la pomme), <b>l\'</b> — перед гласной (l\'école), <b>les</b> — множественное число (les chats).',
    ['___ chat (кот)|le|la;les;l\'', '___ pomme (яблоко)|la|le;les;l\'', '___ école (школа)|l\'|le;la;les', '___ livres (книги)|les|le;la;l\'', '___ mère (мама)|la|le;les;l\'', '___ père (папа)|le|la;les;l\'', '___ oiseau (птица)|l\'|le;la;les']],
  ['Être — быть', 'je <b>suis</b>, tu <b>es</b>, il/elle <b>est</b>, nous <b>sommes</b>, vous <b>êtes</b>, ils/elles <b>sont</b>.<br>Je suis content — я доволен. Elle est petite — она маленькая.',
    ['Je ___ content.|suis|es;est;sont', 'Tu ___ mon ami.|es|suis;est;êtes', 'Elle ___ petite.|est|es;suis;sont', 'Nous ___ à l\'école.|sommes|êtes;sont;est', 'Ils ___ grands.|sont|est;sommes;es', 'Vous ___ français ?|êtes|sommes;es;est']],
  ['Avoir — иметь', 'j\'<b>ai</b>, tu <b>as</b>, il/elle <b>a</b>, nous <b>avons</b>, vous <b>avez</b>, ils <b>ont</b>.<br>J\'ai un chat — у меня есть кот. J\'ai huit ans — мне восемь лет.',
    ['J\'___ un chat.|ai|as;a;ont', 'Tu ___ un frère ?|as|ai;a;avez', 'Il ___ huit ans.|a|as;ai;ont', 'Nous ___ un chien.|avons|avez;ont;a', 'Elles ___ des livres.|ont|a;avons;as']]
];
const DE_T = {
  n: { hello: 'Hallo! Приветствия', num: 'Числа 1–10', col: 'Цвета', ani: 'Животные', fam: 'Семья', food: 'Еда', school: 'Школа', phr: 'Фразы для общения', verbs: 'Что я умею' },
  i: { hello: 'Немцы говорят <b>Guten Morgen</b> утром, <b>Guten Tag</b> днём, а друзьям — просто <b>Hallo</b>.', col: 'Все существительные в немецком пишутся с <b>большой буквы</b>: der Hund, die Katze.', ani: '<b>der</b> — мужской род, <b>die</b> — женский, <b>das</b> — средний.', phr: 'Нажми на фразу, чтобы послушать.' },
  hello: LW('Hallo|привет|👋;Guten Morgen|доброе утро|🌅;Guten Tag|добрый день|☀️;Gute Nacht|спокойной ночи|🌙;Tschüss|пока|👋;danke|спасибо|🙏;bitte|пожалуйста|🙂;ja|да|✅;nein|нет|❌;Ich heiße…|Меня зовут…|🧒'),
  num: LW('eins|один|1;zwei|два|2;drei|три|3;vier|четыре|4;fünf|пять|5;sechs|шесть|6;sieben|семь|7;acht|восемь|8;neun|девять|9;zehn|десять|10'),
  col: LW('rot|красный|🔴;blau|синий|🔵;grün|зелёный|🟢;gelb|жёлтый|🟡;schwarz|чёрный|⚫;weiß|белый|⚪;orange|оранжевый|🟠;rosa|розовый|🩷;braun|коричневый|🟤;grau|серый|🩶'),
  ani: LW('die Katze|кошка|🐱;der Hund|собака|🐶;der Fisch|рыба|🐟;der Vogel|птица|🐦;das Pferd|лошадь|🐴;die Kuh|корова|🐮;das Kaninchen|кролик|🐰;der Löwe|лев|🦁;die Maus|мышь|🐭;der Bär|медведь|🐻'),
  fam: LW('die Mutter|мама|👩;der Vater|папа|👨;der Bruder|брат|👦;die Schwester|сестра|👧;die Oma|бабушка|👵;der Opa|дедушка|👴;die Familie|семья|👪;der Freund|друг|🧑‍🤝‍🧑;das Baby|малыш|👶;der Onkel|дядя|🧔'),
  food: LW('der Apfel|яблоко|🍎;das Brot|хлеб|🍞;die Milch|молоко|🥛;das Wasser|вода|💧;der Käse|сыр|🧀;das Ei|яйцо|🥚;das Eis|мороженое|🍦;der Saft|сок|🧃;die Suppe|суп|🍲;der Kuchen|пирог|🎂'),
  school: LW('die Schule|школа|🏫;das Buch|книга|📖;der Bleistift|карандаш|✏️;der Kuli|ручка|🖊️;die Schultasche|портфель|🎒;der Lehrer|учитель|🧑‍🏫;der Tisch|стол|🪑;das Lineal|линейка|📏;das Heft|тетрадь|📓;die Klasse|класс|🏫'),
  phr: LW('Ich verstehe nicht.|Я не понимаю.|🤔;Noch einmal, bitte.|Ещё раз, пожалуйста.|🔁;Ich habe Hunger.|Я хочу есть.|🍽️;Ich habe Durst.|Я хочу пить.|🥤;Wo ist die Toilette?|Где туалет?|🚻;Wie heißt das?|Как это называется?|❓;Ich weiß nicht.|Я не знаю.|🤷;Spielen wir?|Поиграем?|⚽'),
  verbs: LW('Ich kann schwimmen.|Я умею плавать.|🏊;Ich lese gern.|Я люблю читать.|📖;Ich wohne in Portugal.|Я живу в Португалии.|🇵🇹;Ich spiele Fußball.|Я играю в футбол.|⚽;Ich habe einen Hund.|У меня есть собака.|🐶;Ich gehe in die Schule.|Я иду в школу.|🏫')
};
const DE_G = [
  ['Der, die, das — артикли', 'У каждого немецкого слова есть род: <b>der</b> — мужской (der Hund), <b>die</b> — женский (die Katze), <b>das</b> — средний (das Buch). Во множественном числе всегда <b>die</b>: die Bücher. Артикль лучше учить вместе со словом.',
    ['___ Hund (собака)|der|die;das;den', '___ Katze (кошка)|die|der;das;den', '___ Buch (книга)|das|der;die;den', '___ Mutter (мама)|die|der;das;den', '___ Vater (папа)|der|die;das;den', '___ Pferd (лошадь)|das|der;die;den', '___ Schule (школа)|die|der;das;den']],
  ['Sein — быть', 'ich <b>bin</b>, du <b>bist</b>, er/sie/es <b>ist</b>, wir <b>sind</b>, ihr <b>seid</b>, sie <b>sind</b>.<br>Ich bin acht — мне восемь. Das ist mein Hund — это моя собака.',
    ['Ich ___ acht Jahre alt.|bin|bist;ist;sind', 'Du ___ mein Freund.|bist|bin;ist;seid', 'Das ___ meine Katze.|ist|bin;sind;bist', 'Wir ___ in der Schule.|sind|seid;ist;bin', 'Ihr ___ toll!|seid|sind;ist;bist', 'Sie ___ Geschwister.|sind|ist;seid;bin']],
  ['Haben — иметь', 'ich <b>habe</b>, du <b>hast</b>, er/sie/es <b>hat</b>, wir <b>haben</b>, ihr <b>habt</b>, sie <b>haben</b>.<br>Ich habe einen Bruder — у меня есть брат.',
    ['Ich ___ einen Bruder.|habe|hast;hat;haben', 'Du ___ eine Katze.|hast|habe;hat;habt', 'Sie ___ ein Fahrrad. (она)|hat|haben;hast;habe', 'Wir ___ Hunger.|haben|habt;hat;habe', 'Ihr ___ Glück!|habt|haben;hat;hast']]
];
const ES_T = {
  n: { hello: '¡Hola! Приветствия', num: 'Числа 1–10', col: 'Цвета', ani: 'Животные', fam: 'Семья', food: 'Еда', school: 'Школа', phr: 'Фразы для общения', verbs: 'Что я умею' },
  i: { hello: 'Испанцы говорят <b>buenos días</b> утром, <b>buenas tardes</b> днём и <b>buenas noches</b> вечером.', col: 'Прилагательное обычно стоит <b>после</b> слова: un gato <b>negro</b> — чёрный кот.', ani: '<b>El</b> — мужской род, <b>la</b> — женский.', phr: 'Вопрос в испанском начинается перевёрнутым знаком: <b>¿</b>Dónde…? Нажми на фразу, чтобы послушать.' },
  hello: LW('hola|привет|👋;buenos días|доброе утро|🌅;buenas tardes|добрый день|☀️;buenas noches|добрый вечер, спокойной ночи|🌙;adiós|до свидания|👋;gracias|спасибо|🙏;por favor|пожалуйста|🙂;sí|да|✅;no|нет|❌;Me llamo…|Меня зовут…|🧒'),
  num: LW('uno|один|1;dos|два|2;tres|три|3;cuatro|четыре|4;cinco|пять|5;seis|шесть|6;siete|семь|7;ocho|восемь|8;nueve|девять|9;diez|десять|10'),
  col: LW('rojo|красный|🔴;azul|синий|🔵;verde|зелёный|🟢;amarillo|жёлтый|🟡;negro|чёрный|⚫;blanco|белый|⚪;naranja|оранжевый|🟠;rosa|розовый|🩷;marrón|коричневый|🟤;gris|серый|🩶'),
  ani: LW('el gato|кошка|🐱;el perro|собака|🐶;el pez|рыба|🐟;el pájaro|птица|🐦;el caballo|лошадь|🐴;la vaca|корова|🐮;el conejo|кролик|🐰;el león|лев|🦁;el ratón|мышь|🐭;el oso|медведь|🐻'),
  fam: LW('la madre|мама|👩;el padre|папа|👨;el hermano|брат|👦;la hermana|сестра|👧;la abuela|бабушка|👵;el abuelo|дедушка|👴;la familia|семья|👪;el amigo|друг|🧑‍🤝‍🧑;el bebé|малыш|👶;el tío|дядя|🧔'),
  food: LW('la manzana|яблоко|🍎;el pan|хлеб|🍞;la leche|молоко|🥛;el agua|вода|💧;el queso|сыр|🧀;el huevo|яйцо|🥚;el helado|мороженое|🍦;el zumo|сок|🧃;la sopa|суп|🍲;la tarta|торт|🎂'),
  school: LW('la escuela|школа|🏫;el libro|книга|📖;el lápiz|карандаш|✏️;el bolígrafo|ручка|🖊️;la mochila|рюкзак|🎒;el profesor|учитель|🧑‍🏫;la mesa|стол|🪑;la regla|линейка|📏;el cuaderno|тетрадь|📓;la clase|класс|🏫'),
  phr: LW('No entiendo.|Я не понимаю.|🤔;¿Puedes repetir?|Можешь повторить?|🔁;Tengo hambre.|Я хочу есть.|🍽️;Tengo sed.|Я хочу пить.|🥤;¿Dónde está el baño?|Где туалет?|🚻;¿Cómo se llama esto?|Как это называется?|❓;No sé.|Я не знаю.|🤷;¿Jugamos?|Поиграем?|⚽'),
  verbs: LW('Sé nadar.|Я умею плавать.|🏊;Me gusta leer.|Я люблю читать.|📖;Vivo en Portugal.|Я живу в Португалии.|🇵🇹;Juego al fútbol.|Я играю в футбол.|⚽;Tengo un perro.|У меня есть собака.|🐶;Voy a la escuela.|Я иду в школу.|🏫')
};
const ES_G = [
  ['El, la, los, las — артикли', '<b>el</b> — мужской род (el perro), <b>la</b> — женский (la casa). Во множественном числе: <b>los</b> perros, <b>las</b> casas. Слова на <b>-o</b> чаще мужского рода, на <b>-a</b> — женского.',
    ['___ perro (собака)|el|la;los;las', '___ casa (дом)|la|el;los;las', '___ libros (книги)|los|las;el;la', '___ manzanas (яблоки)|las|los;la;el', '___ madre (мама)|la|el;los;las', '___ padre (папа)|el|la;los;las', '___ niños (дети)|los|las;el;la']],
  ['Ser и estar — быть', '<b>Ser</b> — то, что постоянно: кто ты, какой ты. Soy Lisa — я Лиза. <b>Estar</b> — состояние и место: Estoy cansado — я устал. Estoy en casa — я дома.<br>ser: soy, eres, es, somos, son. estar: estoy, estás, está, estamos, están.',
    ['Yo ___ Lisa.|soy|estoy;es;está', 'Hoy ___ cansado.|estoy|soy;es;eres', 'Mamá ___ en casa.|está|es;soy;son', 'Nosotros ___ amigos.|somos|estamos;son;es', 'Tú ___ muy alto.|eres|estás;es;soy', 'El libro ___ en la mesa.|está|es;son;soy']],
  ['Tener — иметь', 'yo <b>tengo</b>, tú <b>tienes</b>, él/ella <b>tiene</b>, nosotros <b>tenemos</b>, ellos <b>tienen</b>.<br>Tengo ocho años — мне восемь лет. Tengo un perro — у меня есть собака.',
    ['Yo ___ ocho años.|tengo|tienes;tiene;tienen', 'Tú ___ un hermano.|tienes|tengo;tiene;tenemos', 'Ella ___ un gato.|tiene|tienes;tengo;tienen', 'Nosotros ___ hambre.|tenemos|tienen;tiene;tengo', 'Ellos ___ una casa grande.|tienen|tiene;tenemos;tienes']]
];
const FR_U = langCourse('fr', 'по-французски', FR_T, FR_G);
const DE_U = langCourse('de', 'по-немецки', DE_T, DE_G);
const ES_U = langCourse('es', 'по-испански', ES_T, ES_G);
