import { asset } from '../lib/asset'
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
  hero: {
    kicker: "WE'RE GETTING MARRIED",
    rsvp: 'R S V P',
    day: '06',
    month: 'MAY',
    year: '2027',
    dateText: '06 MAY 2027',
    ariaCouple: 'Manuela and Maciej',
    rsvpAria: 'RSVP (Confirm attendance)',
    gazeboAlt: 'Romantic gazebo sketch',
  },
  countdown: {
    title: 'Countdown',
    initial: 'C',
    rest: 'OUNTDOWN',
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    seconds: 'SECONDS',
    srDays: (d: number) => `${d} days until the wedding`,
  },
  welcome: {
    title: 'Welcome!',
    body: 'Welcome text coming soon.', // TODO_COPY
    expand: 'EXPAND',
    expandPhoto: 'Expand photo',
    viewPhoto: 'View photo',
    carouselLabel: 'Welcome photos carousel',
    navLabel: 'Carousel navigation',
    photos: [
      { key: 'metro', alt: 'Medellín Metro passing over the plaza and the Palace of Culture', src: asset('assets/welcome-metro.webp'), tone: ['#9db3c9', '#6b7a5a'] },
      { key: 'pueblo', alt: 'Colonial square with church, royal palm and fruit stand', src: asset('assets/welcome-pueblo.webp'), tone: ['#5a9ad0', '#3b6a3a'] },
      { key: 'botero', alt: 'Sculptures by Fernando Botero at Botero Plaza', src: asset('assets/welcome-botero.webp'), tone: ['#c9a06a', '#7a6a58'] },
    ],
  },
  lightbox: {
    dialogLabel: 'Enlarged photo viewer',
    close: 'Close photo',
    prev: 'Previous photo',
    next: 'Next photo',
    selector: 'Photo selector',
    goTo: 'Go to photo',
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
    dateText: '06 MAY 2027',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Casa+Primavera+Medell%C3%ADn', // TODO: exact link
    coords: { lat: 6.2442, lon: -75.5812 }, // TODO: real Casa Primavera coordinates (Medellín centre for now)
  },
  programme: {
    title: { script: 'Wedding', rest: 'PROGRAMME' },
    ariaLabel: 'Wedding programme',
    events: [
      { key: 'shuttle', label: 'SHUTTLE', time: '3:00', side: 'below' },
      { key: 'ceremony', label: 'CEREMONY', time: '3:00', side: 'above' },
      { key: 'dinner', label: 'DINNER', time: '3:00', side: 'below' },
      { key: 'party', label: 'PARTY', time: '3:00', side: 'above' },
      { key: 'sendoff', label: 'SEND OFF', time: '3:00', side: 'below' },
    ] as ProgrammeEvent[], // TODO: real times
  },
  dress: {
    title: { initial: 'D', first: 'RESS', second: 'CODE', sectionLabel: 'Dress code' },
    palette: 'THE COLOUR PALETTE',
    formal: 'Formal Dress Code',
    her: 'FOR HER',
    him: 'FOR HIM',
    herAlt: 'Guests in colourful formal dresses with illustrated flowers',
    himAlt: 'Formal suits for him in blues, greens, browns and black, each above its colour swatch',
    swatches: ['#8E1B5C', '#C9DDEE', '#8A9A3B', '#DB8752', '#D080A6', '#B9A0CE'],
    ours: {
      initial: 'O',
      first: 'UR',
      second: 'COLORS',
      note: 'These colors are especially meaningful to Manu & Michi',
      colors: ['#FFFFFF', '#F5F0E1', '#DDD1BB'],
      swatchLabel: 'Our colour',
    },
  },
  medellin: {
    kicker: 'WELCOME TO',
    title: { initial: 'M', rest: 'EDELLÍN' },
    sub: 'SELF FUNDED',
    mapsLabel: 'MAPS LOCATION',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Medell%C3%ADn+points+of+interest', // TODO
    polaroids: [
      { key: 'cable', alt: 'Metrocable cabins soaring above the red brick slopes and mountains of Medellín', src: asset('assets/medellin-cable.webp'), tone: ['#5c86b4', '#e0b487'] },
      { key: 'sunset', alt: 'Dramatic golden sunset and clouds over the Aburrá Valley', src: asset('assets/medellin-sunset.webp'), tone: ['#e9b58c', '#7a8a5a'] },
      { key: 'comuna13', alt: 'Vibrant painted stairs in Comuna 13: ¡Que chimba! Estoy en Medellín', src: asset('assets/medellin-comuna13.webp'), tone: ['#e05030', '#f4a040'] },
      { key: 'river', alt: 'Medellín river framed by green parks, bridges, and mountain skyline', src: asset('assets/medellin-river.webp'), tone: ['#4f7a5a', '#c09870'] },
      { key: 'barrio', alt: 'Terraced red brick houses and neighborhoods cascading down the valley', src: asset('assets/medellin-barrio.webp'), tone: ['#c05840', '#7a8a9a'] },
    ],
    postcard: { place: 'MEDELLÍN ANTIOQUIA', text: 'A vibrant city where mountains, culture, and creativity come together.' },
  },
  rsvp: {
    title: 'RSVP',
    kindly: 'Kindly',
    reply: 'REPLY',
    by: 'by',
    needLink: 'Please open your personal invitation link to reply.',
    errorSubmit: 'We could not send your response. Please check your personal link and try again.',
    labels: {
      name: 'FULL NAME',
      attending: 'WILL YOU ATTEND?',
      yes: 'JOYFULLY ACCEPT',
      no: 'REGRETFULLY DECLINE',
      companions: 'COMPANIONS',
      dietary: 'DIETARY RESTRICTIONS',
      message: 'A LITTLE NOTE',
      send: 'SEND',
      edit: 'EDIT RESPONSE',
      close: 'Close RSVP dialog',
    },
    validation: {
      nameMin: 'Please enter your full name',
      attendingRequired: 'Please choose one',
    },
    thanks: 'Thank you!',
    thanksBody: 'Your response has been received.',
  },
  climate: {
    dialogLabel: 'Climate in Medellín',
    subtitle: 'MEDELLÍN · 06 MAY 2027',
    title: 'Climate',
    loading: 'Loading…',
    forecastTitle: 'Forecast',
    typicalTitle: 'Typical May weather',
    high: 'HIGH',
    low: 'LOW',
    rainMm: 'RAIN mm',
    rainDays: 'RAINY DAYS',
    descFallback: 'Live data is unavailable. May in Medellín is typically mild — around 26° by day, 17° at night, with afternoon showers possible. A light layer for the evening is a good idea.',
    descTypical: 'Based on the average of recent Mays. A light layer for the evening and an umbrella for an afternoon shower are a good idea.',
    descLive: 'Live forecast for the wedding day.',
  },
}

const pl: typeof en = {
  couple: { a: 'Manuela', b: 'Maciej' },
  hero: {
    kicker: 'BIERZEMY ŚLUB',
    rsvp: 'R S V P',
    day: '06',
    month: 'MAJA',
    year: '2027',
    dateText: '06 MAJA 2027',
    ariaCouple: 'Manuela i Maciej',
    rsvpAria: 'Potwierdź obecność (RSVP)',
    gazeboAlt: 'Szkic romantycznej altany',
  },
  countdown: {
    title: 'Odliczanie',
    initial: 'O',
    rest: 'DLICZANIE',
    days: 'DNI',
    hours: 'GODZIN',
    minutes: 'MINUT',
    seconds: 'SEKUND',
    srDays: (d: number) => `Pozostało ${d} dni do ślubu`,
  },
  welcome: {
    title: 'Witamy!',
    body: 'Tekst powitalny wkrótce.',
    expand: 'POWIĘKSZ',
    expandPhoto: 'Powiększ zdjęcie',
    viewPhoto: 'Zobacz zdjęcie',
    carouselLabel: 'Galeria zdjęć powitalnych',
    navLabel: 'Nawigacja galerii',
    photos: [
      { key: 'metro', alt: 'Metro w Medellín przejeżdżające nad placem i Pałacem Kultury', src: asset('assets/welcome-metro.webp'), tone: ['#9db3c9', '#6b7a5a'] },
      { key: 'pueblo', alt: 'Kolonialny plac z kościołem, palmą i stoiskiem z owocami', src: asset('assets/welcome-pueblo.webp'), tone: ['#5a9ad0', '#3b6a3a'] },
      { key: 'botero', alt: 'Rzeźby Fernando Botero na Placu Botero', src: asset('assets/welcome-botero.webp'), tone: ['#c9a06a', '#7a6a58'] },
    ],
  },
  lightbox: {
    dialogLabel: 'Powiększenie zdjęcia',
    close: 'Zamknij zdjęcie',
    prev: 'Poprzednie zdjęcie',
    next: 'Następne zdjęcie',
    selector: 'Wybór zdjęcia',
    goTo: 'Przejdź do zdjęcia',
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
    dateText: '06 MAJA 2027',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Casa+Primavera+Medell%C3%ADn',
    coords: { lat: 6.2442, lon: -75.5812 },
  },
  programme: {
    title: { script: 'Harmonogram', rest: 'ŚLUBU' },
    ariaLabel: 'Harmonogram ślubu',
    events: [
      { key: 'shuttle', label: 'TRANSPORT', time: '15:00', side: 'below' },
      { key: 'ceremony', label: 'CEREMONIA', time: '15:00', side: 'above' },
      { key: 'dinner', label: 'OBIAD', time: '15:00', side: 'below' },
      { key: 'party', label: 'WESELE', time: '15:00', side: 'above' },
      { key: 'sendoff', label: 'POŻEGNANIE', time: '15:00', side: 'below' },
    ] as ProgrammeEvent[],
  },
  dress: {
    title: { initial: 'S', first: 'TRÓJ', second: 'WIECZOROWY', sectionLabel: 'Strój wieczorowy' },
    palette: 'PALETA KOLORÓW',
    formal: 'Strój Wieczorowy',
    her: 'DLA NIEJ',
    him: 'DLA NIEGO',
    herAlt: 'Goście w eleganckich kolorowych sukniach z motywem kwiatowym',
    himAlt: 'Eleganckie garnitury dla panów w odcieniach niebieskiego, zieleni, brązu i czerni, każdy nad próbką koloru',
    swatches: ['#8E1B5C', '#C9DDEE', '#8A9A3B', '#DB8752', '#D080A6', '#B9A0CE'],
    ours: {
      initial: 'N',
      first: 'ASZE',
      second: 'KOLORY',
      note: 'Te kolory są zarezerwowane dla Pary Młodej (Manu i Michi)',
      colors: ['#FFFFFF', '#F5F0E1', '#DDD1BB'],
      swatchLabel: 'Nasz kolor',
    },
  },
  medellin: {
    kicker: 'WITAMY W',
    title: { initial: 'M', rest: 'EDELLÍN' },
    sub: 'MIASTO WIECZNEJ WIOSNY',
    mapsLabel: 'LOKALIZACJA NA MAPIE',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Medell%C3%ADn+points+of+interest',
    polaroids: [
      { key: 'cable', alt: 'Kolejka linowa Metrocable unosząca się nad zboczami i górami Medellín', src: asset('assets/medellin-cable.webp'), tone: ['#5c86b4', '#e0b487'] },
      { key: 'sunset', alt: 'Spektakularny zachód słońca i złote chmury nad doliną Aburrá', src: asset('assets/medellin-sunset.webp'), tone: ['#e9b58c', '#7a8a5a'] },
      { key: 'comuna13', alt: 'Kolorowe schody w Comuna 13: ¡Que chimba! Estoy en Medellín', src: asset('assets/medellin-comuna13.webp'), tone: ['#e05030', '#f4a040'] },
      { key: 'river', alt: 'Rzeka Medellín w otoczeniu zielonych parków, mostów i panoramy gór', src: asset('assets/medellin-river.webp'), tone: ['#4f7a5a', '#c09870'] },
      { key: 'barrio', alt: 'Kaskadowo ułożone domy z czerwonej cegły i dzielnice na zboczach doliny', src: asset('assets/medellin-barrio.webp'), tone: ['#c05840', '#7a8a9a'] },
    ],
    postcard: { place: 'MEDELLÍN ANTIOQUIA', text: 'Tętniące życiem miasto, w którym góry, kultura i radość życia tworzą niezwykły klimat.' },
  },
  rsvp: {
    title: 'RSVP',
    kindly: 'Prosimy o',
    reply: 'POTWIERDZENIE',
    by: 'do',
    needLink: 'Aby odpowiedzieć, otwórz swój osobisty link do zaproszenia.',
    errorSubmit: 'Nie udało się wysłać odpowiedzi. Sprawdź swój osobisty link i spróbuj ponownie.',
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
      close: 'Zamknij okno RSVP',
    },
    validation: {
      nameMin: 'Proszę podać imię i nazwisko',
      attendingRequired: 'Proszę dokonać wyboru',
    },
    thanks: 'Dziękujemy!',
    thanksBody: 'Twoja odpowiedź została pomyślnie zapisana.',
  },
  climate: {
    dialogLabel: 'Klimat w Medellín',
    subtitle: 'MEDELLÍN · 06 MAJA 2027',
    title: 'Klimat',
    loading: 'Ładowanie…',
    forecastTitle: 'Prognoza pogody',
    typicalTitle: 'Typowa pogoda w maju',
    high: 'MAKS.',
    low: 'MIN.',
    rainMm: 'OPADY mm',
    rainDays: 'DNI DESZCZOWE',
    descFallback: 'Dane na żywo są chwilowo niedostępne. Maj w Medellín jest zazwyczaj bardzo przyjemny — około 26°C w dzień, 17°C wieczorem, z możliwymi przelotnymi opadami. Lekkie okrycie na wieczór będzie doskonałym wyborem.',
    descTypical: 'Na podstawie średnich temperatur z ostatnich lat. Lekkie okrycie na wieczór i parasol na popołudniowy deszcz to dobry pomysł.',
    descLive: 'Prognoza na żywo na dzień ślubu.',
  },
}

export type Locale = 'en' | 'pl'
export const translations: Record<Locale, typeof en> = { en, pl }
export const content = { en, pl }
export const t = en

export const WEDDING_ISO = '2027-05-06T15:00:00-05:00'
export const TIMEZONE = 'America/Bogota'

