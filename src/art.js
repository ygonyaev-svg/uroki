/* ===== Иллюстрации на экранах (акварель, Gemini): картинки призов и шапки экранов. Нет файла — картинка просто не показывается. ===== */
var PRIZE_ART = [
  [/^(g15|g30|g60|s1|t3)$|игр(?!уш)|планшет/i, 'game'], [/^(tv|s2)$|мульт|сериал/i, 'tv'], [/^(sw|s3)$|слад|конфет|морожен/i, 'sweet'],
  [/^late$|спать|позже/i, 'late'], [/^(din|s4)$|ужин|пицц/i, 'dinner'], [/^film$|кино|фильм/i, 'film'], [/^cafe$|кафе|ресторан/i, 'cafe'],
  [/^trip$|поездк|путешеств/i, 'trip'], [/^ball$|мяч|форм/i, 'ball'], [/^zoo$|океан|зоопарк|аквариум/i, 'zoo'], [/^match$|матч|стадион/i, 'match'],
  [/^noclean$|уборк/i, 'noclean'], [/^book$|книг/i, 'book'], [/^stick$|наклей|значок/i, 'sticker'], [/^self$|для себя/i, 'self'],
  [/^friend$|друз|гости/i, 'friends'], [/^nochore$|домашних дел|выходной/i, 'nochore'], [/switch|nintendo|приставк|консол/i, 'console'], [/^(gift|s6)$|подар/i, 'gift']];
function prizeArtName(it){ var s = (it.id || '') + ' ' + (it.name || ''); for (var i = 0; i < PRIZE_ART.length; i++) if (PRIZE_ART[i][0].test(it.id || '') || PRIZE_ART[i][0].test(it.name || '')) return PRIZE_ART[i][1]; return 'gift'; }
function prizeArt(it, cls){ return '<img class="prart ' + (cls || '') + '" src="img/art/pr-' + prizeArtName(it) + '.webp" alt="" loading="lazy" onerror="this.remove()">'; }
function scrArt(name, cls){ return '<img class="scrart ' + (cls || '') + '" src="img/art/' + name + '.webp" alt="" onerror="this.remove()">'; }
