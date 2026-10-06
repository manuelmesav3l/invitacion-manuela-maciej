// All editable copy, links and data live here. i18n-ready: add `es` next to `en` and pick by locale.
// TODO_COPY marks placeholder copy pending from the couple. TODO_ASSET marks pending images.

export const TODO_COPY = true
export const TODO_ASSET = true

export interface ProgrammeEvent {
  key: string
  label: string
  time: string
  side: 'above' | 'below'
}

const en = {
  couple: { a: 'Manuela', b: 'Maciej' },
  hero: { kicker: "WE'RE GETTING MARRIED", rsvp: 'R S V P', day: '06', month: 'MAY', year: '2027' },
  countdown: { title: 'Countdown', days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS' },
  welcome: {
    title: 'Welcome!',
    body: 'Welcome text coming soon.', // TODO_COPY
    photos: [
      { key: 'metro', alt: 'Metro de Medellín pasando sobre la plaza y el Palacio de la Cultura', src: '/assets/welcome-metro.webp', tone: ['#9db3c9', '#6b7a5a'] },
      { key: 'pueblo', alt: 'Plaza colonial con iglesia, palma real y puesto de frutas', src: '/assets/welcome-pueblo.webp', tone: ['#5a9ad0', '#3b6a3a'] },
      { key: 'botero', alt: 'Esculturas de Fernando Botero en la Plaza Botero', src: '/assets/welcome-botero.webp', tone: ['#c9a06a', '#7a6a58'] },
    ],

  },
  venue: {
    title: { initial: 'T', rest: 'HE VENUE' },
    logoAlt: 'Casa Primavera',
    illustrationAlt: 'Sketch of Casa Primavera glasshouse with palms and mountains',
    body: 'Venue description coming soon.', // TODO_COPY
    mapsLabel: 'MAPS LOCATION',
    climateLabel: 'CLIMATE',
    weekday: 'THURSDAY',
    time: '3 PM',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Casa+Primavera+Medell%C3%ADn', // TODO: exact link
    coords: { lat: 6.2442, lon: -75.5812 }, // TODO: real Casa Primavera coordinates (Medellín centre for now)
  },
  programme: {
    title: { script: 'Wedding', rest: 'PROGRAMME' },
    events: [
      { key: 'shuttle', label: 'SHUTTLE', time: '3:00', side: 'below' },
      { key: 'ceremony', label: 'CEREMONY', time: '3:00', side: 'above' },
      { key: 'dinner', label: 'DINNER', time: '3:00', side: 'below' },
      { key: 'party', label: 'PARTY', time: '3:00', side: 'above' },
      { key: 'sendoff', label: 'SEND OFF', time: '3:00', side: 'below' },
    ] as ProgrammeEvent[], // TODO: real times
  },
  dress: {
    title: { initial: 'D', rest: 'RESS CODE' },
    palette: 'THE COLOUR PALETTE',
    formal: 'FORMAL DRESS CODE',
    her: 'FOR HER',
    him: 'FOR HIM',
    herAlt: 'Guests in colourful formal dresses with illustrated flowers',
    himAlt: 'Formal suits for him in blues, greens, browns and black, each above its colour swatch',
    swatches: ['#8E1B5C', '#C9DDEE', '#8A9A3B', '#DB8752', '#D080A6', '#B9A0CE'],
    ours: {
      first: 'UR',
      second: 'COLORS',
      note: 'These colors are especially meaningful to Manu & Michi',
      colors: ['#FFFFFF', '#F5F0E1', '#DDD1BB'],
    },
  },
  medellin: {
    kicker: 'WELCOME TO',
    title: { initial: 'M', rest: 'EDELLÍN' },
    sub: 'SELF FUNDED',
    mapsLabel: 'MAPS LOCATION',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Medell%C3%ADn+points+of+interest', // TODO
    polaroids: [
      { key: 'street', alt: 'Colourful street with flowers in Medellín', src: '', tone: ['#d9648f', '#e8b48c'] },
      { key: 'city', alt: 'Medellín skyline at sunset', src: '', tone: ['#e9b58c', '#7a8a5a'] },
      { key: 'cable', alt: 'Metrocable above the mountains', src: '', tone: ['#5c86b4', '#e0b487'] },
      { key: 'botero', alt: 'Plaza Botero and historic building', src: '', tone: ['#4f8a5a', '#c9a06a'] },
    ], // TODO_ASSET
    postcard: { place: 'MEDELLÍN ANTIOQUIA', text: 'A vibrant city where mountains, culture, and creativity come together.' },
  },
  rsvp: {
    title: 'RSVP',
    kindly: 'Kindly',
    reply: 'REPLY',
    by: 'by',
    labels: {
      name: 'FULL NAME', attending: 'WILL YOU ATTEND?', yes: 'JOYFULLY ACCEPT', no: 'REGRETFULLY DECLINE',
      companions: 'COMPANIONS', dietary: 'DIETARY RESTRICTIONS', message: 'A LITTLE NOTE', send: 'SEND', edit: 'EDIT RESPONSE',
    },
    thanks: 'Thank you!',
    thanksBody: 'Your response has been received.',
  },
}

const pl: typeof en = {
  couple: { a: 'Manuela', b: 'Maciej' },
  hero: { kicker: 'BIERZEMY ŚLUB', rsvp: 'R S V P', day: '06', month: 'MAJA', year: '2027' },
  countdown: { title: 'Odliczanie', days: 'DNI', hours: 'GODZIN', minutes: 'MINUT', seconds: 'SEKUND' },
  welcome: {
    title: 'Witamy!',
    body: 'Tekst powitalny wkrótce.',
    photos: [
      { key: 'metro', alt: 'Metro w Medellín przejeżdżające nad placem i Pałacem Kultury', src: '/assets/welcome-metro.webp', tone: ['#9db3c9', '#6b7a5a'] },
      { key: 'pueblo', alt: 'Kolonialny plac z kościołem, palmą i stoiskiem z owocami', src: '/assets/welcome-pueblo.webp', tone: ['#5a9ad0', '#3b6a3a'] },
      { key: 'botero', alt: 'Rzeźby Fernando Botero na Placu Botero', src: '/assets/welcome-botero.webp', tone: ['#c9a06a', '#7a6a58'] },
    ],
  },
  venue: {
    title: { initial: 'M', rest: 'IEJSCE WESELA' },
    logoAlt: 'Casa Primavera',
    illustrationAlt: 'Szkic szklarni Casa Primavera z palmami i górami',
    body: 'Opis miejsca wkrótce.',
    mapsLabel: 'LOKALIZACJA GOOGLE MAPS',
    climateLabel: 'KLIMAT I POGODA',
    weekday: 'CZWARTEK',
    time: '15:00',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Casa+Primavera+Medell%C3%ADn',
    coords: { lat: 6.2442, lon: -75.5812 },
  },
  programme: {
    title: { script: 'Harmonogram', rest: 'ŚLUBU' },
    events: [
      { key: 'shuttle', label: 'TRANSPORT', time: '15:00', side: 'below' },
      { key: 'ceremony', label: 'CEREMONIA', time: '15:00', side: 'above' },
      { key: 'dinner', label: 'OBIAD', time: '15:00', side: 'below' },
      { key: 'party', label: 'WESELE', time: '15:00', side: 'above' },
      { key: 'sendoff', label: 'POŻEGNANIE', time: '15:00', side: 'below' },
    ] as ProgrammeEvent[],
  },
  dress: {
    title: { initial: 'D', rest: 'RESS CODE' },
    palette: 'PALETA KOLORÓW',
    formal: 'STRÓJ WIECZOROWY',
    her: 'DLA NIEJ',
    him: 'DLA NIEGO',
    herAlt: 'Goście w eleganckich kolorowych sukniach z motywem kwiatowym',
    himAlt: 'Eleganckie garnitury dla panów w odcieniach niebieskiego, zieleni, brązu i czerni, każdy nad próbką koloru',
    swatches: ['#8E1B5C', '#C9DDEE', '#8A9A3B', '#DB8752', '#D080A6', '#B9A0CE'],
    ours: {
      first: 'UR',
      second: 'COLORS',
      note: 'Te kolory są szczególnie ważne dla Manu i Michi',
      colors: ['#FFFFFF', '#F5F0E1', '#DDD1BB'],
    },
  },
  medellin: {
    kicker: 'WITAMY W',
    title: { initial: 'M', rest: 'EDELLÍN' },
    sub: 'MIASTO WIECZNEJ WIOSNY',
    mapsLabel: 'LOKALIZACJA NA MAPIE',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Medell%C3%ADn+points+of+interest',
    polaroids: [
      { key: 'street', alt: 'Kolorowa uliczka z kwiatami w Medellín', src: '', tone: ['#d9648f', '#e8b48c'] },
      { key: 'city', alt: 'Panorama Medellín o zachodzie słońca', src: '', tone: ['#e9b58c', '#7a8a5a'] },
      { key: 'cable', alt: 'Kolejka linowa Metrocable nad górami', src: '', tone: ['#5c86b4', '#e0b487'] },
      { key: 'botero', alt: 'Plac Botero i zabytkowy budynek', src: '', tone: ['#4f8a5a', '#c9a06a'] },
    ],
    postcard: { place: 'MEDELLÍN ANTIOQUIA', text: 'Tętniące życiem miasto, w którym góry, kultura i radość życia tworzą niezwykły klimat.' },
  },
  rsvp: {
    title: 'RSVP',
    kindly: 'Prosimy o',
    reply: 'POTWIERDZENIE',
    by: 'do',
    labels: {
      name: 'IMIĘ I NAZWISKO',
      attending: 'CZY BĘDZIESZ Z NAMI?',
      yes: 'Z RADOŚCIĄ PRZYBĘDĘ',
      no: 'NIESTETY NIE MOGĘ',
      companions: 'OSOBY TOWARZYSZĄCE',
      dietary: 'PREFERENCJE ŻYWIENIOWE',
      message: 'WIADOMOŚĆ DLA PARY MŁODEJ',
      send: 'WYŚLIJ',
      edit: 'EDYTUJ ODPOWIEDŹ',
    },
    thanks: 'Dziękujemy!',
    thanksBody: 'Twoja odpowiedź została pomyślnie zapisana.',
  },
}

export type Locale = 'en' | 'pl'
export const translations: Record<Locale, typeof en> = { en, pl }
export const content = { en, pl }
export const t = en

export const WEDDING_ISO = '2027-05-06T15:00:00-05:00'
export const TIMEZONE = 'America/Bogota'
