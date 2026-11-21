/* ===== Свои иконки вместо системных эмодзи =====
   Стиль: rounded duotone, сетка 32×32, контур 2px со скруглёнными концами, две заливки:
   .a — основной цвет, .b — акцент, .w — светлая деталь. Цвета задаются темой через CSS-переменные --il/--ia/--ib/--iw.
   Эмодзи в тексте заменяются автоматически (наблюдатель за #app), так что логика и данные не меняются. */
var ICONS = {
  /* --- интерфейс --- */
  game: '<path class="a" d="M9 10h14a6 6 0 0 1 6 6v3a4 4 0 0 1-7 2.6L20.5 20h-9L10 21.6A4 4 0 0 1 3 19v-3a6 6 0 0 1 6-6z"/><path d="M9 13.5v5M6.5 16h5"/><circle class="b" cx="21" cy="14.5" r="1.4"/><circle class="b" cx="24" cy="17.5" r="1.4"/>',
  video: '<rect class="a" x="3" y="7" width="26" height="18" rx="5"/><path class="w" d="M13.5 11.5v9l7.5-4.5z"/><path d="M9 28h14"/>',
  star: '<path class="b" d="M16 3.5l3.7 7.6 8.3 1.2-6 5.9 1.4 8.3L16 22.6l-7.4 3.9L10 18.2l-6-5.9 8.3-1.2z"/><path class="w" stroke="none" d="M12.5 12.6l2.2-.4 1.1-2.4" />',
  coin: '<circle class="b" cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="8.5"/><path class="w" d="M16 11l1.5 3 3.3.4-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.4z" stroke-width="1.4"/>',
  piggy: '<path class="a" d="M6 17c0-5.5 4.5-9 10.5-9 3 0 5.6.9 7.4 2.4L27 9l-.6 4.2c1 1.2 1.6 2.6 1.6 4.3V19l-2.4.8c-.8 2-2.3 3.5-4.1 4.4V27h-4v-2.1c-1 .1-2 .1-3 0V27h-4v-3.1C7.7 22.3 6 19.9 6 17z"/><path d="M6 17.5c-1.5 0-2.5-1-2.5-2.5"/><circle cx="22.5" cy="15" r="1" fill="currentColor" stroke="none" class="l"/><path class="b" d="M14 8.6l2.5-4 2.5 4"/>',
  cup: '<path class="a" d="M5 13h17v6a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7z"/><path d="M22 15h2a3 3 0 0 1 0 6h-2.5"/><path class="b" d="M10 4c-1 1.5 1 2.5 0 4M15 4c-1 1.5 1 2.5 0 4"/><path d="M4 29h20"/>',
  books: '<rect class="a" x="4" y="6" width="7" height="21" rx="1.5"/><rect class="b" x="11" y="9" width="7" height="18" rx="1.5"/><path class="a" d="M19.5 10.5l5.2-1.4 4.4 16.5-5.2 1.4z"/><path d="M6.5 10h2M13.5 13h2"/>',
  book: '<path class="w" d="M16 8c-3-2-7.5-2.5-12-1.5v19c4.5-1 9-.5 12 1.5 3-2 7.5-2.5 12-1.5v-19C23.5 5.5 19 6 16 8z"/><path d="M16 8v19"/><path class="b" d="M21 6.6V14l2-1.5 2 1.5V6.4"/>',
  key: '<circle class="b" cx="10" cy="16" r="6"/><circle cx="10" cy="16" r="2"/><path d="M16 16h13M24 16v4.5M28 16v3"/>',
  lock: '<rect class="b" x="6" y="14" width="20" height="15" rx="4"/><path d="M10.5 14V10a5.5 5.5 0 0 1 11 0v4"/><path d="M16 20v3.5"/>',
  gift: '<rect class="a" x="5" y="14" width="22" height="14" rx="2.5"/><rect class="a" x="3.5" y="9.5" width="25" height="5" rx="2"/><path class="b" d="M14 9.5h4V28h-4z"/><path d="M16 9.5c-2-4-7-5-7-1.8C9 9.5 13 9.5 16 9.5c3 0 7 0 7-1.8 0-3.2-5-2.2-7 1.8z"/>',
  camera: '<path class="a" d="M4 11.5A2.5 2.5 0 0 1 6.5 9H10l2-3h8l2 3h3.5a2.5 2.5 0 0 1 2.5 2.5V24a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 24z"/><circle class="w" cx="16" cy="17.5" r="5.5"/><circle class="b" cx="16" cy="17.5" r="2.5"/>',
  puzzle: '<path class="a" d="M5 9h6a3 3 0 1 1 6 0h6v6a3 3 0 1 1 0 6v6h-6a3 3 0 1 0-6 0H5v-6a3 3 0 1 0 0-6z"/><path class="b" d="M5 15a3 3 0 1 1 0 6"/>',
  riddle: '<path class="a" d="M7 6h18a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-8l-6 5v-5H7a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z"/><path class="w" d="M12.5 12a3.5 3.5 0 1 1 5 3.2c-1 .5-1.5 1.1-1.5 2.3"/><circle cx="16" cy="20.6" r=".6" class="l"/>',
  knight: '<path class="a" d="M10 27c0-5 2-7.5 4-9.5l-4.5 1.5-2.5-2.5 6-9 2-3 1.5 2.5C21 8 25 12 25 18.5V27z"/><path d="M8 28h18"/><circle cx="14.5" cy="11.5" r="1" class="l"/>',
  pawn: '<circle class="a" cx="16" cy="9" r="4"/><path class="a" d="M12 27c0-4 1.5-7.5 3-12h2c1.5 4.5 3 8 3 12z"/><path d="M8 28h16M12.5 15h7"/>',
  king: '<path class="a" d="M11 27c0-5 1-8 2.5-12h5c1.5 4 2.5 7 2.5 12z"/><path class="b" d="M10 15h12l-1.5-4h-9z"/><path d="M16 3v6M13 5.5h6M8 28h16"/>',
  poem: '<path class="w" d="M7 4h13l5 5v19H7z"/><path d="M11 13h10M11 17h10M11 21h6"/><path class="b" d="M28.5 5.5L19 20l-2 3.5 3.5-2L30 7z"/>',
  music: '<path d="M12 23V7l14-3v16"/><ellipse class="a" cx="9" cy="23.5" rx="3.5" ry="3"/><ellipse class="a" cx="23" cy="20.5" rx="3.5" ry="3"/><path class="b" d="M12 11l14-3V4L12 7z"/>',
  abacus: '<rect class="w" x="4" y="5" width="24" height="22" rx="2.5"/><path d="M4 11h24M4 16h24M4 21h24"/><circle class="a" cx="9" cy="11" r="2"/><circle class="a" cx="13" cy="11" r="2"/><circle class="b" cx="20" cy="16" r="2"/><circle class="a" cx="10" cy="21" r="2"/><circle class="b" cx="23" cy="21" r="2"/>',
  fire: '<path class="b" d="M16 29c-5.5 0-9-3.5-9-8.5 0-4.5 3-7 4.5-11 1.5 2 2 3.5 2 5.5 1.5-2.5 2.5-6.5 1.5-11.5 5 2.5 10 8 10 15.5 0 5.5-3.5 10-9 10z"/><path class="w" d="M16 29c-2.5 0-4-1.7-4-4 0-2.5 2-3.5 3-6 2 1.5 5 3.5 5 6.5 0 2-1.5 3.5-4 3.5z"/>',
  trophy: '<path class="b" d="M9 4h14v7a7 7 0 0 1-14 0z"/><path d="M9 7H5.5v2.5A4.5 4.5 0 0 0 10 14M23 7h3.5v2.5A4.5 4.5 0 0 1 22 14M16 18v5"/><path class="a" d="M10 28v-2a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2z"/>',
  medal: '<path class="a" d="M9 3h5l3 8h-5zM23 3h-5l-3 8h5z"/><circle class="b" cx="16" cy="20" r="8"/><path class="w" d="M16 16l1.2 2.5 2.8.4-2 2 .5 2.7-2.5-1.3-2.5 1.3.5-2.7-2-2 2.8-.4z"/>',
  crown: '<path class="b" d="M4 11l6 5 6-9 6 9 6-5-2.5 14h-19z"/><path d="M7 28h18"/><circle class="a" cx="16" cy="19" r="2"/>',
  sound: '<path class="a" d="M5 12.5h5l7-6v19l-7-6H5z"/><path d="M21 12a5.5 5.5 0 0 1 0 8M24.5 8.5a10.5 10.5 0 0 1 0 15"/>',
  mic: '<rect class="a" x="11" y="3" width="10" height="17" rx="5"/><path d="M6.5 15a9.5 9.5 0 0 0 19 0M16 24.5V29M11 29h10"/><path class="w" d="M11 10h4M11 14h4"/>',
  stop: '<circle class="a" cx="16" cy="16" r="13"/><rect class="w" x="11" y="11" width="10" height="10" rx="2"/>',
  pause: '<circle class="a" cx="16" cy="16" r="13"/><path class="w" d="M12.5 10.5h2.5v11h-2.5zM17 10.5h2.5v11H17z"/>',
  check: '<circle class="a" cx="16" cy="16" r="13"/><path class="w" d="M10 16.5l4 4 8-9" fill="none"/>',
  cross: '<circle class="b" cx="16" cy="16" r="13"/><path d="M11 11l10 10M21 11L11 21"/>',
  mail: '<rect class="w" x="3.5" y="7" width="25" height="18" rx="3"/><path class="a" d="M4.5 8.5L16 17l11.5-8.5"/>',
  pen: '<path class="a" d="M21.5 4.5l6 6L12 26l-7.5 1.5L6 20z"/><path class="b" d="M18.5 7.5l6 6"/><path d="M6 20l6 6"/>',
  note: '<rect class="w" x="5" y="4" width="18" height="24" rx="2.5"/><path d="M9 10h10M9 14h10M9 18h6"/><path class="b" d="M28 11L18 23l-3 1 1-3 10-12z"/>',
  sparkle: '<path class="b" d="M14 3c.8 6 3 8.2 9 9-6 .8-8.2 3-9 9-.8-6-3-8.2-9-9 6-.8 8.2-3 9-9z"/><path class="a" d="M24.5 18c.4 3 1.5 4.1 4.5 4.5-3 .4-4.1 1.5-4.5 4.5-.4-3-1.5-4.1-4.5-4.5 3-.4 4.1-1.5 4.5-4.5z"/>',
  hourglass: '<path d="M7 4h18M7 28h18"/><path class="w" d="M9 4h14c0 6-7 8-7 12 0 4 7 6 7 12H9c0-6 7-8 7-12 0-4-7-6-7-12z"/><path class="b" d="M12 27c0-3 4-4.5 4-6.5 0 2 4 3.5 4 6.5zM12.5 9h7c-1 2-3.5 3-3.5 4.5 0-1.5-2.5-2.5-3.5-4.5z"/>',
  sprout: '<path d="M16 28V15"/><path class="a" d="M16 17C16 10 11 7 5 7c0 6 4 10 11 10z"/><path class="b" d="M16 14c0-5 4-8 11-8 0 5-4 8-11 8z"/><path d="M10 28h12"/>',
  chart: '<path d="M4 4v24h24"/><path class="a" d="M8 24v-6h4v6zM14.5 24V14h4v10zM21 24V9h4v15z"/><path class="b" d="M7 14l7-6 5 3 8-7" fill="none"/>',
  target: '<circle class="w" cx="15" cy="17" r="12"/><circle class="a" cx="15" cy="17" r="7.5"/><circle class="w" cx="15" cy="17" r="3"/><path class="b" d="M15 17L27 5M23 5h4v4"/>',
  party: '<path class="a" d="M4 28l5-16 11 11z"/><path d="M7.5 18.5l6 6"/><path class="b" d="M17 7c1-2 3-2 3-4M23 12c2-1 4 0 6-2M21 9l2-2"/><circle class="b" cx="26" cy="5" r="1.3"/><circle class="b" cx="13" cy="5" r="1.3"/>',
  phone: '<rect class="a" x="8" y="3" width="16" height="26" rx="3.5"/><path class="w" d="M11 7h10v15H11z"/><path d="M14.5 25.5h3"/>',
  euro: '<circle class="b" cx="16" cy="16" r="12"/><path d="M20.5 11.5a6 6 0 1 0 0 9M9.5 14.5h8M9.5 17.5h8"/>',
  search: '<circle class="w" cx="13" cy="13" r="8.5"/><path class="a" d="M19.5 19.5l7 7" stroke-width="4"/><path d="M9.5 11a4 4 0 0 1 3.5-2.5"/>',
  bulb: '<path class="b" d="M16 3a9 9 0 0 0-5 16.5V22h10v-2.5A9 9 0 0 0 16 3z"/><path d="M11.5 25.5h9M13 29h6M16 22v-6l-2.5-2.5M16 16l2.5-2.5"/>',
  think: '<circle class="b" cx="16" cy="16" r="13"/><circle cx="12" cy="13" r="1" class="l"/><circle cx="20" cy="13" r="1" class="l"/><path d="M12 21.5c2.5-1 5-1 8 0"/><path d="M19 8.5c1.5-1 3-1 4.5 0"/>',
  happy: '<circle class="b" cx="16" cy="16" r="13"/><circle cx="12" cy="13" r="1" class="l"/><circle cx="20" cy="13" r="1" class="l"/><path class="w" d="M10 18.5h12a6 6 0 0 1-12 0z"/>',
  smile: '<circle class="b" cx="16" cy="16" r="13"/><circle cx="12" cy="13" r="1" class="l"/><circle cx="20" cy="13" r="1" class="l"/><path d="M11 19c3 3 7 3 10 0"/>',
  neutral: '<circle class="b" cx="16" cy="16" r="13"/><circle cx="12" cy="13" r="1" class="l"/><circle cx="20" cy="13" r="1" class="l"/><path d="M11.5 20.5h9"/>',
  sad: '<circle class="b" cx="16" cy="16" r="13"/><circle cx="12" cy="13" r="1" class="l"/><circle cx="20" cy="13" r="1" class="l"/><path d="M11 22c3-3 7-3 10 0"/>',
  repeat: '<path d="M6.5 15.5A9.5 9.5 0 0 1 23 9.5"/><path d="M24 4v6h-6"/><path d="M25.5 16.5A9.5 9.5 0 0 1 9 22.5"/><path d="M8 28v-6h6"/><circle class="b" cx="16" cy="16" r="3"/>',
  flag: '<path d="M7 29V4"/><path class="w" d="M7 5h19l-3 6 3 6H7z"/><path class="a" d="M7 5h6.3v4H7zM19.6 5H26l-1.3 2.6-.7 1.4h-4.4zM13.3 9h6.3v4h-6.3zM7 13h6.3v4H7zM19.6 13H23l1 2 1 2h-5.4z" stroke="none"/>',
  like: '<path class="a" d="M10 14l5-10c2 0 3.5 1.5 3 4l-1 4.5h7a3 3 0 0 1 3 3.5l-1.5 8.5a3 3 0 0 1-3 2.5H10z"/><rect class="b" x="4" y="13.5" width="6" height="14" rx="1.5"/>',
  warn: '<path class="b" d="M16 4L29 27H3z"/><path d="M16 12v7"/><circle cx="16" cy="23" r=".8" class="l"/>',
  hand: '<path class="a" d="M9 17V8.5a2 2 0 0 1 4 0V15V6a2 2 0 0 1 4 0v9V7.5a2 2 0 0 1 4 0V16v-5a2 2 0 0 1 4 0v9c0 5-3.5 9-9 9-3 0-5.5-1.5-7-4l-4-6.5a2 2 0 0 1 3.5-2z"/>',
  glob: '<circle class="a" cx="16" cy="16" r="12.5"/><path class="b" d="M9 8.5c3 1 2 4 5 4.5s1 4 3.5 4.5-1 5 1.5 7c-3 .5-6 0-8.5-2 1-3-2.5-3.5-3-7 1-2.5 1.5-4.5 1.5-7zM22 7.5c1 2-1 3 1 4.5s3 0 4.2 2.5"/><path d="M3.5 16h25"/>',
  chat: '<path class="a" d="M4 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-6l-5 4v-4H7a3 3 0 0 1-3-3z"/><path class="b" d="M25 11h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-1v4l-5-4h-4a3 3 0 0 1-3-3v-1"/>',
  bell: '<path class="b" d="M16 4a8 8 0 0 0-8 8v6l-3 4h22l-3-4v-6a8 8 0 0 0-8-8z"/><path d="M13 26a3 3 0 0 0 6 0"/>',
  pin: '<path class="b" d="M16 29s9-8.5 9-16a9 9 0 0 0-18 0c0 7.5 9 16 9 16z"/><circle class="w" cx="16" cy="13" r="3.5"/>',
  calendar: '<rect class="w" x="4" y="6" width="24" height="22" rx="3"/><path class="a" d="M4 9a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v4H4z"/><path d="M10 3v6M22 3v6"/><path class="b" d="M10 18h4v4h-4z"/>',
  ruler: '<rect class="b" x="2.5" y="11" width="27" height="10" rx="2" transform="rotate(-30 16 16)"/><path d="M9 21.2l-1.5-2.6M13 18.9l-1-1.7M17 16.6l-1.5-2.6M21 14.3l-1-1.7M25 12l-1.5-2.6"/>',
  handshake: '<path class="a" d="M3 12l5-4 6 2 4-2 6 1 5 4-4 7-7 6-4-2-7-5z"/><path d="M14 10l-4 4c1 1.5 3 1.5 4 0l3-2 6 6M15 22l-3-3M18 20l-3-3"/>',
  home: '<path class="a" d="M5 15L16 5l11 10v12a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 5 27z"/><path class="b" d="M13 28.5V20h6v8.5"/>',
  brain: '<path class="a" d="M16 6c-2-3-7-2.5-7.5 1.5C5 8 4 12 6 14c-2 2-1.5 6.5 2 7.5 0 4 4.5 6 8 3.5 3.5 2.5 8 .5 8-3.5 3.5-1 4-5.5 2-7.5 2-2 1-6-2.5-6.5C23 3.5 18 3 16 6z"/><path d="M16 6v19M11 11c1.5 0 3 1 3 3M21 11c-1.5 0-3 1-3 3M10.5 18.5c1.5-.5 3 0 4 1.5M21.5 18.5c-1.5-.5-3 0-4 1.5"/>',
  clock: '<circle class="w" cx="16" cy="16" r="12.5"/><path d="M16 9v7l4.5 3"/><circle class="b" cx="16" cy="16" r="1.5"/>',
  leaf: '<path class="a" d="M6 26C5 15 11 6 27 5c0 15-8 22-21 21z"/><path d="M6 26C11 19 15 15 21 11"/>',
  snow: '<path d="M16 3v26M4.7 9.5l22.6 13M4.7 22.5l22.6-13"/><path class="b" d="M12.5 5.5L16 8l3.5-2.5M12.5 26.5L16 24l3.5 2.5"/><circle class="a" cx="16" cy="16" r="3"/>',
  sun: '<circle class="b" cx="16" cy="16" r="7"/><path d="M16 2.5v3.5M16 26v3.5M2.5 16H6M26 16h3.5M6.5 6.5L9 9M23 23l2.5 2.5M6.5 25.5L9 23M23 9l2.5-2.5"/>',
  drop: '<path class="a" d="M16 3S7 13 7 19a9 9 0 0 0 18 0c0-6-9-16-9-16z"/><path class="w" d="M12 19a4 4 0 0 0 3 4"/>',
  tree: '<path class="a" d="M16 3c-5 0-8 4-7 8-3 1-4 5-2 8 2 2.5 5 2.5 7 1.5h4c2 1 5 1 7-1.5 2-3 1-7-2-8 1-4-2-8-7-8z"/><path class="b" d="M14 20h4v9h-4z"/>',
  wind: '<path d="M3 12h15a4 4 0 1 0-4-4"/><path class="b" d="M3 18h20a4 4 0 1 1-4 4" fill="none"/><path d="M3 24h9"/>',
  wave: '<path class="a" d="M3 22c3-3 6-3 9 0s6 3 9 0 5-3 8-1v7H3z"/><path d="M3 15c3-3 6-3 9 0s6 3 9 0 5-3 8-1"/>',
  abc: '<rect class="a" x="3" y="6" width="26" height="20" rx="5"/><text x="16" y="21" text-anchor="middle" font-size="11.5" font-weight="800" stroke="none" class="l" style="font-family:inherit">Абв</text>',
  cap: '<path class="a" d="M2.5 12L16 6l13.5 6L16 18z"/><path class="b" d="M8 15v6c0 2 3.5 4 8 4s8-2 8-4v-6l-8 3.5z"/><path d="M29.5 12v8"/>',
  question: '<circle class="a" cx="16" cy="16" r="13"/><path d="M12 12.5a4 4 0 1 1 5.5 3.7c-1 .5-1.5 1.2-1.5 2.6" stroke="#fff" stroke-width="2.6"/><circle cx="16" cy="22.5" r="1.2" fill="#fff" stroke="none"/>',
  people: '<circle class="a" cx="11" cy="10" r="4.5"/><circle class="b" cx="22" cy="11" r="3.8"/><path class="a" d="M3 27c0-5 3.5-9 8-9s8 4 8 9z"/><path class="b" d="M19.5 18.5c.8-.3 1.6-.5 2.5-.5 4 0 7 3.5 7 9h-9"/>',
  /* --- Ярик: футбол и звери --- */
  ball: '<circle class="w" cx="16" cy="16" r="13"/><path class="l2" d="M16 10.5l5 3.6-1.9 5.9h-6.2l-1.9-5.9z"/><path d="M16 10.5V3.5M21 14.1l6.5-2.3M19.1 20l3.9 5.5M12.9 20L9 25.5M11 14.1l-6.5-2.3"/>',
  dog: '<path class="b" d="M7 6c-3 0-4.5 5-3.5 10l3.5-1.5zM25 6c3 0 4.5 5 3.5 10L25 14.5z"/><path class="a" d="M16 5c-6 0-9.5 4.5-9.5 10.5S10 28 16 28s9.5-6.5 9.5-12.5S22 5 16 5z"/><path class="w" d="M16 15c-3.5 0-6 3-6 6.5 0 3 3 6.5 6 6.5s6-3.5 6-6.5c0-3.5-2.5-6.5-6-6.5z"/><circle cx="11.5" cy="13" r="1.2" class="l"/><circle cx="20.5" cy="13" r="1.2" class="l"/><path class="l2" d="M14 18.5h4l-2 2z"/><path d="M16 20.5v2c-1 1.5-2.5 1.5-3.5.5M16 22.5c1 1.5 2.5 1.5 3.5.5"/>',
  lion: '<path class="b" d="M16 2.5l3 2.5 4-1 1.5 3.5 3.5 1.5-.5 4 2.5 3-2.5 3 .5 4-3.5 1.5-1.5 3.5-4-1-3 2.5-3-2.5-4 1-1.5-3.5L4 23l.5-4L2 16l2.5-3-.5-4 3.5-1.5L9 4l4 1z"/><circle class="a" cx="16" cy="16.5" r="8"/><circle cx="13" cy="15" r="1" class="l"/><circle cx="19" cy="15" r="1" class="l"/><path class="l2" d="M14.3 18.5h3.4L16 20.3z"/><path d="M16 20.3c-.5 1.5-2 2-3 1.3M16 20.3c.5 1.5 2 2 3 1.3"/>',
  fox: '<path class="a" d="M4 4l6.5 6h11L28 4l-1 12c0 6-5 12-11 12S5 22 5 16z"/><path class="w" d="M6 17c3 0 6 2 10 7 4-5 7-7 10-7-1 5.5-5 11-10 11S7 22.5 6 17z"/><path class="b" d="M6.5 7l3.5 3M25.5 7L22 10"/><circle cx="11.5" cy="15.5" r="1.2" class="l"/><circle cx="20.5" cy="15.5" r="1.2" class="l"/><path class="l2" d="M14.5 23h3L16 25z"/>',
  cat: '<path class="a" d="M5 4l6 5h10l6-5v13c0 6.5-5 11-11 11S5 23.5 5 17z"/><path class="b" d="M7 8l2.5 2M25 8l-2.5 2"/><circle cx="11.5" cy="16" r="1.3" class="l"/><circle cx="20.5" cy="16" r="1.3" class="l"/><path class="l2" d="M14.5 20h3L16 21.6z"/><path d="M16 21.6v1.4M3 19l6 .5M3 23l6-1.5M29 19l-6 .5M29 23l-6-1.5"/>',
  turtle: '<path class="b" d="M24 17c2.5-2.5 6-2 6 1s-3 3.5-5 3"/><path class="a" d="M4 21c0-7 5-12 11-12s11 5 11 12z"/><path d="M8 21l3-6h8l3 6M11 15l4-6M19 15l-4-6"/><path class="b" d="M6 21h4v4H6zM19 21h4v4h-4z"/><path d="M2.5 21h26"/><circle cx="27" cy="17.5" r=".8" class="l"/>',
  dolphin: '<path class="a" d="M3 20c4-10 13-14 22-12l3-4 0 6c2 2 2 5 0 6-6-3-12 0-14 6l2 5-6-3c-2 1-5 0-7-4z"/><path class="w" d="M8 21c3 0 6-1 8-3"/><circle cx="23" cy="12" r="1" class="l"/>',
  panda: '<circle class="b" cx="8" cy="8" r="4"/><circle class="b" cx="24" cy="8" r="4"/><circle class="w" cx="16" cy="17" r="11.5"/><path class="b" d="M9.5 13c2-1.5 4-.5 4 2s-2 4-4 3-2-3.5 0-5zM22.5 13c-2-1.5-4-.5-4 2s2 4 4 3 2-3.5 0-5z"/><path class="l2" d="M14.5 21h3L16 22.5z"/>',
  frog: '<circle class="a" cx="10" cy="9" r="4.5"/><circle class="a" cx="22" cy="9" r="4.5"/><path class="a" d="M3 20c0-6 5.5-9 13-9s13 3 13 9-5.5 8-13 8-13-2-13-8z"/><circle class="w" cx="10" cy="9" r="2.2"/><circle class="w" cx="22" cy="9" r="2.2"/><path d="M10 20c3.5 3 8.5 3 12 0"/>',
  rabbit: '<path class="w" d="M10 15C8 9 8 3 11 3s4 6 4 11M22 15c2-6 2-12-1-12s-4 6-4 11"/><circle class="w" cx="16" cy="20" r="9"/><path class="b" d="M11 6c1 2 1.5 5 2 8M21 6c-1 2-1.5 5-2 8"/><circle cx="12.5" cy="19" r="1.2" class="l"/><circle cx="19.5" cy="19" r="1.2" class="l"/><path class="l2" d="M14.5 22.5h3L16 24z"/>',
  fish: '<path class="a" d="M3 16c4-6 10-8 16-6 3 1 5 3 6 6-1 3-3 5-6 6-6 2-12 0-16-6z"/><path class="b" d="M25 16l4-5v10z"/><circle cx="9" cy="14.5" r="1.2" class="l"/><path d="M14 11c1.5 3 1.5 7 0 10"/>',
  dino: '<path class="a" d="M4 27v-7c0-6 4-9 9-9h3V7c0-2 1.5-3.5 3.5-3.5h5c2 0 3.5 1.5 3.5 3.5v3c0 1.5-1 2.5-2.5 2.5H22v6c0 4-2 6-4 7v2h-3v-2h-4v2H8v-2c-2 0-4-1-4-3"/><circle cx="21.5" cy="7.5" r="1" class="l"/><path class="b" d="M8 11.5l1.5-3 2 2.5 1.5-3 1.5 2.5"/>',
  boot: '<path class="a" d="M4 13.5c0-1.5 1-2.5 2.5-2.5H12c1 2 3 3 6 3.5 5 .8 9 2 10 5.5.3 1.2-.5 2-1.5 2H5.5C4.5 22 4 21.2 4 20.5z"/><path class="b" d="M4 20h24.2c-.3 1.5-1.5 2.5-3 2.5H6c-1 0-2-1-2-2.5z"/><path d="M14 14l1.5-2.5M17.5 14.6l1.5-2.5M7 22.5V25M12 22.5V25M18 22.5V25M24 22.5V25"/>',
  whistle: '<path class="a" d="M12 10h15v6h-6a8.5 8.5 0 1 1-9-6z"/><circle class="w" cx="12.5" cy="18.5" r="3"/><path class="b" d="M22 10v-3h5v3"/><path d="M4 9L2 6M7 6.5L6 3"/>',
  goal: '<path class="w" d="M3 26V7h26v19"/><path d="M3 12l5 3v11M29 12l-5 3v11M8 15h16M8 20h16M13 7v19M19 7v19"/><circle class="b" cx="16" cy="23" r="3.5"/>',
  apple: '<path class="b" d="M16 9c-3-2-9-2-10.5 3.5S6.5 28 11 28.5c2 .2 3-1 5-1s3 1.2 5 1c4.5-.5 7-11 5.5-16S19 7 16 9z"/><path d="M16 9c0-3 1-5 3-6"/><path class="a" d="M17 6c2-2.5 5-2.5 7-1.5-2 2.5-5 2.5-7 1.5z"/>',
  bball: '<circle class="b" cx="16" cy="16" r="13"/><path d="M3 16h26M16 3v26M7 6.5c4 5 4 14 0 19M25 6.5c-4 5-4 14 0 19"/>',
  tennis: '<circle class="a" cx="16" cy="16" r="13"/><path class="w" d="M6 7c4.5 5 4.5 13 0 18M26 7c-4.5 5-4.5 13 0 18" fill="none"/>',
  paw: '<ellipse class="a" cx="16" cy="21" rx="6.5" ry="5.5"/><ellipse class="a" cx="8" cy="14" rx="2.6" ry="3.3"/><ellipse class="a" cx="13" cy="9" rx="2.6" ry="3.3"/><ellipse class="a" cx="19" cy="9" rx="2.6" ry="3.3"/><ellipse class="a" cx="24" cy="14" rx="2.6" ry="3.3"/>',
  bird: '<path class="a" d="M5 18c0-6 4.5-10 10-10 4 0 6 2 7 4.5l5 .5-4 3c0 6-4.5 10-10.5 10C8 26 5 23 5 18z"/><path class="b" d="M10 17c3 0 6 1.5 8 4-4 1-7 0-8-4z"/><circle cx="19" cy="12.5" r="1" class="l"/><path d="M12 26l-1 3M16 26l1 3"/>',
  bear: '<circle class="a" cx="8" cy="8" r="4"/><circle class="a" cx="24" cy="8" r="4"/><circle class="a" cx="16" cy="17" r="11"/><ellipse class="w" cx="16" cy="21" rx="5" ry="4"/><circle cx="11.5" cy="14.5" r="1.2" class="l"/><circle cx="20.5" cy="14.5" r="1.2" class="l"/><path class="l2" d="M14.5 19.5h3L16 21z"/>',
  wolf: '<path class="a" d="M5 3l6 7h10l6-7v14c0 6.5-5 11-11 11S5 23.5 5 17z"/><path class="w" d="M9 18c2 0 4.5 1 7 4 2.5-3 5-4 7-4-1 5-3.5 8-7 8s-6-3-7-8z"/><circle cx="11.5" cy="15" r="1.2" class="l"/><circle cx="20.5" cy="15" r="1.2" class="l"/><path class="l2" d="M14.5 21.5h3L16 23z"/>',
  hedgehog: '<path class="b" d="M4 22c0-7 5-12 12-12 3 0 5 1 7 2.5L20 10l5 1-1-3 4 3.5-2 1.5 3 2-3 .5c.5 1.5 1 3.5 1 5.5z"/><path class="a" d="M21 22c0-3 2-6 5-6 2 0 3.5 2 3.5 4l-2 2z"/><circle cx="26" cy="19" r=".9" class="l"/><path d="M3 22h26M9 22v3M17 22v3"/>',
  /* --- Аня: школа волшебства --- */
  owl: '<path class="a" d="M6 6l4 3.5h12L26 6v13c0 5.5-4.5 10-10 10S6 24.5 6 19z"/><circle class="w" cx="11.5" cy="14.5" r="4"/><circle class="w" cx="20.5" cy="14.5" r="4"/><circle class="b" cx="11.5" cy="14.5" r="1.6"/><circle class="b" cx="20.5" cy="14.5" r="1.6"/><path class="b" d="M14.5 19h3L16 21.5z"/><path d="M11 25l2-1.5M21 25l-2-1.5"/>',
  wand: '<path class="a" d="M4 28L19 13" stroke-width="3.5"/><path class="w" d="M4 28l4-4" stroke-width="3.5"/><path class="b" d="M23 3l1.2 3.5 3.8.3-3 2.3 1 3.7L23 10.7 19.9 12.8l1-3.7-3-2.3 3.8-.3z"/><path d="M27 16v3M25.5 17.5h3M15 5v2M14 6h2"/>',
  potion: '<path class="w" d="M12 3h8M13 3v7L6 22a5 5 0 0 0 4.3 7.5h11.4A5 5 0 0 0 26 22l-7-12V3"/><path class="a" d="M8.5 19h15l2 3.5a4.2 4.2 0 0 1-3.8 6H10.3a4.2 4.2 0 0 1-3.8-6z"/><circle class="w" cx="13" cy="23.5" r="1.3"/><circle class="w" cx="18" cy="21.5" r=".9"/>',
  scroll: '<path class="w" d="M8 6h17v18a3 3 0 0 1-3 3H8"/><path class="b" d="M5 6a3 3 0 0 1 6 0v18a3 3 0 1 1-6 0z"/><path class="b" d="M22 27a3 3 0 0 0 3-3h4a3 3 0 0 1-3 3z"/><path d="M14 11h7M14 15h7M14 19h5"/>',
  castle: '<path class="a" d="M4 28V13h4v-3h3v3h3V9h4v4h3v-3h3v3h4v15z"/><path class="b" d="M14 9l2-6 2 6M4 13l2-5 2 5M24 13l2-5 2 5"/><path class="w" d="M13 28v-6a3 3 0 0 1 6 0v6"/><path d="M8 18v2M24 18v2"/>',
  moon: '<path class="b" d="M20 4a12 12 0 1 0 8.5 17A10 10 0 0 1 20 4z"/><path class="w" d="M24.5 6l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  dragon: '<path class="a" d="M5 24c0-6 4-11 10-12l2-5 3 4 3-3v5c3 1 6 4 6 8-3-1-5-1-7 1-1 3 0 5 3 6H9c-2 0-4-1.5-4-4z"/><path class="b" d="M13 13L8 6l-1 7zM20 16c2-2 5-2 7 0"/><circle cx="21" cy="11.5" r="1" class="l"/>',
  crystal: '<circle class="a" cx="16" cy="14" r="10"/><path class="w" d="M11 9a6 6 0 0 1 5-2.5"/><path class="b" d="M9 25h14l2 4H7z"/><path class="w" d="M19 13l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" stroke-width="1.2"/>',
  candle: '<path class="b" d="M16 3c-2.5 3-3 5-3 6.5a3 3 0 0 0 6 0c0-1.5-.5-3.5-3-6.5z"/><path d="M16 12.5V14"/><rect class="w" x="11" y="14" width="10" height="12" rx="1.5"/><path class="a" d="M6 26h20l-2 3H8z"/><path d="M14 17v4"/>',
  grimoire: '<path class="a" d="M7 4h17a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/><path class="w" d="M4 25a3 3 0 0 1 3-3h19v6H7a3 3 0 0 1-3-3z"/><path class="b" d="M15 8l1.2 2.8 3 .2-2.3 2 .8 3-2.7-1.6-2.7 1.6.8-3-2.3-2 3-.2z"/>',
  bkey: '<circle class="b" cx="9" cy="9" r="5.5"/><circle class="w" cx="9" cy="9" r="2"/><path d="M13 13l14 14M22 22l-3 3M25.5 25.5l-2.5 2.5"/>',
  broom: '<path d="M27 4L14 17"/><path class="b" d="M12 15l5 5-4 8c-3 1-7-1-9-3s-4-6-3-9z"/><path d="M8 20l-3 3M11 22l-3 4"/>',
  spider: '<circle class="a" cx="16" cy="18" r="6"/><circle class="a" cx="16" cy="10" r="3.5"/><path d="M11 15L4 10M11 18H3M11 21l-7 5M21 15l7-5M21 18h8M21 21l7 5M16 3v3.5"/>',
  wizard: '<path class="a" d="M8 15L16 2l8 13z"/><path class="b" d="M4 15h24l-2 3H6z"/><circle class="w" cx="16" cy="23" r="6"/><path class="w" d="M16 29c-6 0-10 0-10 0 2-3 5-4 10-4s8 1 10 4c0 0-4 0-10 0z"/><path d="M14 7l1-1.5M17.5 10l1-1.5"/>',
  constel: '<path d="M5 22l7-6 6 3 5-9 4 3"/><circle class="b" cx="5" cy="22" r="2"/><circle class="b" cx="12" cy="16" r="2"/><circle class="b" cx="18" cy="19" r="2"/><circle class="b" cx="23" cy="10" r="2.5"/><circle class="b" cx="27" cy="13" r="1.6"/>',
  feather: '<path class="w" d="M26 4C14 5 8 13 7 25l3-1c9-2 15-8 16-20z"/><path d="M5 28L20 11M10 18h6M12 15h6M14 12h5"/>',
  /* --- предметы --- */
  s_read: '<path class="w" d="M16 8c-3-2-7.5-2.5-12-1.5v19c4.5-1 9-.5 12 1.5 3-2 7.5-2.5 12-1.5v-19C23.5 5.5 19 6 16 8z"/><path d="M16 8v19M7.5 12c2-.5 4-.2 5.5.5M7.5 16c2-.5 4-.2 5.5.5M19 12.5c1.5-.7 3.5-1 5.5-.5M19 16.5c1.5-.7 3.5-1 5.5-.5"/>',
  s_math: '<rect class="w" x="4" y="4" width="24" height="24" rx="5"/><path d="M8.5 11h6M11.5 8v6M18 11h6M8.5 19.5l5 5M13.5 19.5l-5 5M18 20.5h6M18 23.5h6"/>',
  s_rus: '<rect class="w" x="3.5" y="5" width="25" height="22" rx="5"/><text x="16" y="22.5" text-anchor="middle" font-size="15" font-weight="800" stroke="none" class="l" style="font-family:inherit">Ёё</text>',
  s_world: '<circle class="w" cx="16" cy="16" r="12.5"/><path class="b" d="M9 8.5c3 1 2 4 5 4.5s1 4 3.5 4.5-1 5 1.5 7c-3 .5-6 0-8.5-2 1-3-2.5-3.5-3-7 1-2.5 1.5-4.5 1.5-7zM22 7.5c1 2-1 3 1 4.5s3 0 4.2 2.5"/>',
  s_hist: '<path class="w" d="M6 9l10-5 10 5zM8 9h16v2H8zM8 25h16v2H8zM5 27h22v2H5z"/><path d="M10 11v14M14 11v14M18 11v14M22 11v14"/>',
  s_logic: '<path class="w" d="M16 3a9 9 0 0 0-5 16.5V22h10v-2.5A9 9 0 0 0 16 3z"/><path d="M11.5 25.5h9M13 29h6M13.5 9.5a2.8 2.8 0 1 1 3.5 2.7c-.7.3-1 .8-1 1.8"/><circle cx="16" cy="17" r=".6" class="l"/>',
  s_lang: '<path class="w" d="M4 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-6l-5 4v-4H7a3 3 0 0 1-3-3z"/><path class="w" d="M25 11h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-1v4l-5-4h-4a3 3 0 0 1-3-3v-1"/><path d="M9 10.5h8M18 19.5h6"/>',
  s_hw: '<rect class="w" x="6" y="3.5" width="20" height="25" rx="2.5"/><path d="M6 9h-2M6 15h-2M6 21h-2M11 10h10M11 15h10M11 20h6"/>',
  s_fin: '<circle class="w" cx="16" cy="16" r="12"/><path d="M20.5 11.5a6 6 0 1 0 0 9M9.5 14.5h8M9.5 17.5h8"/>',
  s_en: '<path class="w" d="M4 7a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-8l-6 5v-5H7a3 3 0 0 1-3-3z"/><path d="M10 9h-0.5v8H10M9.5 13H13M9.5 9H14M9.5 17H14M17 17V9l5 8V9"/>'
};
/* Эмодзи → иконка */
var EMO_ICON = { '🎮':'game','▶️':'video','▶':'video','📺':'video','🎬':'video','⭐':'star','🌟':'star','🪙':'coin','💰':'coin','🐷':'piggy','☕':'cup','📚':'books','📖':'book','🔑':'key','🔒':'lock','🎁':'gift','📷':'camera','📸':'camera','🧩':'puzzle','🎵':'music','🎶':'music','🧮':'abacus','🔥':'fire','🏆':'trophy','🏅':'medal','🎖️':'medal','👑':'crown',
  '🔊':'sound','🔈':'sound','🎤':'mic','⏹':'stop','⏹️':'stop','⏸':'pause','⏸️':'pause','✅':'check','❌':'cross','✉':'mail','✉️':'mail','📩':'mail','✒️':'pen','✍️':'pen','✏️':'pen','📝':'note','✨':'sparkle','⏳':'hourglass','⌛':'hourglass','🌱':'sprout','📈':'chart','📊':'chart','🎯':'target','🔤':'abc','🔡':'abc','🎓':'cap','❓':'question','❔':'question','💬':'chat','🧑‍🤝‍🧑':'people','👪':'people','🥇':'medal','🐦':'bird','🐻':'bear','🐺':'wolf','🦔':'hedgehog','🎉':'party','📲':'phone','📱':'phone','💶':'euro','🔍':'search','🔎':'search','💡':'bulb',
  '🤔':'think','😀':'happy','😃':'happy','🙂':'smile','😊':'smile','😐':'neutral','🙁':'sad','😕':'sad','🔁':'repeat','🔄':'repeat','🏁':'flag','👍':'like','⚠':'warn','⚠️':'warn','💪':'medal','👏':'hand','🌍':'glob','🗣️':'chat','🗣':'chat','📏':'ruler','🤝':'handshake','🏠':'home','🏡':'home','🧠':'brain','🕰️':'clock','⏰':'clock','🍂':'leaf','🍁':'leaf','❄️':'snow','🌨️':'snow','☀️':'sun','💧':'drop','🌳':'tree','🌲':'tree','🌊':'wave','🌬️':'wind','🌬':'wind','💨':'wind',
  '⚽':'ball','🐶':'dog','🐕':'dog','🦁':'lion','🦊':'fox','🐱':'cat','🐈':'cat','🐢':'turtle','🐬':'dolphin','🐼':'panda','🐸':'frog','🐰':'rabbit','🐟':'fish','🦖':'dino','👟':'boot','📯':'whistle','🥅':'goal','🍎':'apple','🏀':'bball','🎾':'tennis','🐾':'paw',
  '🦉':'owl','🪄':'wand','🧪':'potion','📜':'scroll','🏰':'castle','🌙':'moon','🐉':'dragon','🔮':'crystal','🕯️':'candle','🕯':'candle','📕':'grimoire','🗝':'bkey','🗝️':'bkey','🧹':'broom','🕷':'spider','🕷️':'spider','🧙‍♀️':'wizard','🧙':'wizard','🌌':'constel','🪶':'feather' };
/* Фигуры шахмат меняем только в плитках (.ico), на доске — нет */
var ICO_ONLY = { '♞':'knight','♙':'pawn','♚':'king' };
var SUBJ_IC = { read:'s_read', math:'s_math', rus:'s_rus', world:'s_world', hist:'s_hist', logic:'s_logic', lang:'s_lang', hw:'s_hw' };
function icon(name, cls){ var p = ICONS[name]; if (!p) return ''; return '<svg class="ic ic-' + name + (cls ? ' ' + cls : '') + '" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' + p + '</svg>'; }
function icoBuildRe(){ var ks = Object.keys(EMO_ICON).concat(Object.keys(ICO_ONLY)).sort(function(a, b){ return b.length - a.length; });
  return new RegExp('(' + ks.map(function(k){ return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')️?', 'g'); }
var EMO_RE = icoBuildRe();
function icoSkip(el){ for (var n = el; n && n.nodeType === 1; n = n.parentNode) { var c = n.className; if (typeof c !== 'string') c = n.getAttribute && n.getAttribute('class') || '';
    var t = n.tagName; if (t === 'TEXTAREA' || t === 'INPUT' || t === 'SCRIPT' || t === 'STYLE' || t === 'OPTION' || t === 'svg' || t === 'SVG' || t === 'TITLE') return true;
    if (/(^| )(noico|ic|chboard|pc)( |$)/.test(c)) return true; if (n.id === 'app' || n.tagName === 'BODY') break; } return false; }
function icoize(root){ if (!root || !document.createTreeWalker) return; var w = document.createTreeWalker(root, 4, null, false), list = [], n;
  while ((n = w.nextNode())) { EMO_RE.lastIndex = 0; if (EMO_RE.test(n.nodeValue)) list.push(n); }
  for (var i = 0; i < list.length; i++) { n = list[i]; var par = n.parentNode; if (!par || icoSkip(par)) continue;
    var inIco = false; for (var q = par; q && q.nodeType === 1 && q.id !== 'app'; q = q.parentNode) if (q.classList && q.classList.contains('ico')) { inIco = true; break; }
    EMO_RE.lastIndex = 0; var s = n.nodeValue, html = '', last = 0, m, any = false;
    while ((m = EMO_RE.exec(s))) { var k = m[1], nm = EMO_ICON[k] || (inIco ? ICO_ONLY[k] : null); if (!nm) continue; any = true;
      html += U.esc(s.slice(last, m.index)) + icon(nm, inIco ? 'big' : ''); last = m.index + m[0].length; }
    if (!any) continue; html += U.esc(s.slice(last));
    var span = document.createElement('span'); span.className = 'icw'; span.innerHTML = html;
    var frag = document.createDocumentFragment(); while (span.firstChild) frag.appendChild(span.firstChild); par.replaceChild(frag, n); }
}
// Эмодзи внутри SVG-сцен (<text>⚽</text>) → вложенный <svg> с нашей иконкой того же размера
var SVGNS = 'http://www.w3.org/2000/svg';
function icoSvgText(root){ if (!root || !root.getElementsByTagName) return; var ts = root.getElementsByTagName('text'), arr = [], i;
  for (i = 0; i < ts.length; i++) arr.push(ts[i]);
  for (i = 0; i < arr.length; i++) { var t = arr[i], s = t.textContent, names = [], m, rest;
    if (!s || t.getAttribute('data-ico')) continue; EMO_RE.lastIndex = 0;
    while ((m = EMO_RE.exec(s))) { var nm = EMO_ICON[m[1]]; if (!nm) { names = null; break; } names.push(nm); }
    if (!names || !names.length) continue; EMO_RE.lastIndex = 0; rest = s.replace(EMO_RE, '').replace(/[\s‍️]/g, ''); if (rest) continue;
    var fs = parseFloat(t.getAttribute('font-size')) || parseFloat((t.style && t.style.fontSize) || '') || 16, x = parseFloat(t.getAttribute('x')) || 0, y = parseFloat(t.getAttribute('y')) || 0;
    var w = fs * 1.1, tot = w * names.length, an = t.getAttribute('text-anchor') || '';
    var x0 = an === 'middle' ? x - tot / 2 : an === 'end' ? x - tot : x, y0 = y - fs * .92;
    var g = document.createElementNS(SVGNS, 'g'); g.setAttribute('data-ico', '1'); var tr = t.getAttribute('transform'); if (tr) g.setAttribute('transform', tr);
    var op = t.getAttribute('opacity'); if (op) g.setAttribute('opacity', op);
    for (var j = 0; j < names.length; j++) { var src = '<svg xmlns="' + SVGNS + '" class="ics ic-' + names[j] + '" x="' + (x0 + j * w) + '" y="' + y0 + '" width="' + w + '" height="' + w + '" viewBox="0 0 32 32">' + ICONS[names[j]] + '</svg>';
      try { var d = new DOMParser().parseFromString(src, 'image/svg+xml').documentElement; g.appendChild(document.importNode(d, true)); } catch (e) {} }
    if (g.firstChild) t.parentNode.replaceChild(g, t); }
}
(function(){ var busy = false, sched = false;
  function run(){ sched = false; var a = document.getElementById('app'); if (!a) return; busy = true; try { icoize(a); icoSvgText(a); var ms = document.querySelectorAll('.modal,.tipbox,.testbar,.toast,.dripfly'); for (var i = 0; i < ms.length; i++) { if (a.contains(ms[i])) continue; icoize(ms[i]); icoSvgText(ms[i]); } } catch (e) {} busy = false; }
  function start(){ var a = document.getElementById('app'); if (!a || !window.MutationObserver) return;
    new MutationObserver(function(){ if (busy) return; if (!sched) { sched = true; run(); } }).observe(document.body, { childList: true, subtree: true, characterData: true }); run(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start(); })();
/* Весы ⚖ (были настоящим эмодзи в загадках и в уроке шахмат «Сколько стоят фигуры») */
if (!ICONS.scales) ICONS.scales = '<path d="M16 6v20M10 27h12M6 10h20M6 10l-3.5 8M6 10l3.5 8M26 10l-3.5 8M26 10l3.5 8"/><path class="a" d="M2.5 18h7a3.5 3.5 0 0 1-7 0zM22.5 18h7a3.5 3.5 0 0 1-7 0z"/><circle class="l" cx="16" cy="6" r="1.8"/>';
if (!EMO_ICON['⚖']) { EMO_ICON['⚖'] = 'scales'; EMO_RE = icoBuildRe(); }
