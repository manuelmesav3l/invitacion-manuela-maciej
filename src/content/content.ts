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
    body: ["Who would have thought we'd end up here?", "After everything that brought us to this moment, we can't wait to celebrate our wedding with you in Medellín."],
    expand: 'EXPAND',
    expandPhoto: 'Expand photo',
    viewPhoto: 'View photo',
    prevPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    carouselLabel: 'Welcome photos carousel',
    navLabel: 'Carousel navigation',
    photos: [
      {
        key: 'skyline',
        alt: 'Panoramic view of Medellín nestled in the Aburrá Valley',
        src: asset('assets/welcome-medellin-skyline.webp'),
        tone: ['#3d7ca8', '#5b8a58'],
      },
      {
        key: 'guayacan',
        alt: 'Town square in bloom with yellow Guayacán tree and colonial architecture',
        src: asset('assets/welcome-guayacan-plaza.webp'),
        tone: ['#e8b931', '#4a6b32'],
      },
      {
        key: 'guatape',
        alt: 'Aerial view of the Guatapé reservoir and the Rock of El Peñol',
        src: asset('assets/welcome-guatape-rock.webp'),
        tone: ['#18649b', '#2e5c33'],
      },
      {
        key: 'cathedral-roses',
        alt: 'Brick neo-Gothic basilica and rose garden in the central square',
        src: asset('assets/welcome-cathedral-roses.webp'),
        tone: ['#7a5944', '#3d6b38'],
      },
      {
        key: 'cathedral-night',
        alt: 'Illuminated facade and towers of the historic basilica at night',
        src: asset('assets/welcome-cathedral-night.webp'),
        tone: ['#1b1c2b', '#b38237'],
      },
    ],
  },
  ui: { close: 'Close' },
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
    hasBakedTitle: true, // the EN composite artwork already contains the 'THE VENUE' lettering
    logoAlt: 'Casa Primavera',
    illustrationAlt: 'Sketch of Casa Primavera glasshouse with palms and mountains',
    body: ["From the mountains of Medellín to the endless green of Antioquia, this landscape has always been part of what makes this place so special.", "At Casa Primavera, we'll celebrate our wedding surrounded by a landscape we never get tired of."],
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
    illustrations: { bus: 'Shuttle bus illustration', disco: 'Disco ball illustration', sparkler: 'Sparklers illustration' },
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
    reference: '*For your reference.',
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
    photosTab: 'PHOTOS',
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
  transport: {
    title: { initial: 'T', rest: 'RANSPORTATION' },
    placeName: 'LETTERA HOTEL',
    pickup: 'PICK-UP POINT',
    mapsLabel: 'MAPS LOCATION',
    mapsUrl: 'https://maps.app.goo.gl/ppPuUyN557i58dhy8',
  },
  gifts: {
    title: { initial: 'G', rest: 'IFTS' },
    body: ['Your presence is the greatest gift we could ask for.', 'For those who wish to honour us with a gift, you are welcome to do so with a card or envelope on the day.'],
  },
  stay: {
    title: 'Where to stay',
    body: "We've carefully selected a collection of our preferred hotels to help you plan your stay in Medellín. Of course, you're welcome to choose any hotel, Airbnb, or holiday apartment that best suits your plans.",
    websiteLabel: 'WEBSITE',
    mapsLabel: 'LOCATION',
    hotels: [
      { key: 'lettera', name: 'LETTERA HOTEL', area: 'POBLADO', url: '', photo: asset('assets/stay-lettera.webp'), mapsUrl: 'https://maps.app.goo.gl/ppPuUyN557i58dhy8' }, // TODO: website + discount code (pending from Isabel)
      { key: 'lagoon', name: 'LAGOON HOTEL', area: 'POBLADO', url: '', photo: asset('assets/stay-lagoon.webp'), mapsUrl: 'https://maps.app.goo.gl/jTmoUAspiK2pSoya9' }, // TODO: website + discount code (pending from Isabel)
    ],
  },
  todo: {
    tab: 'THINGS TO DO',
    kicker: 'THINGS TO DO IN',
    title: { initial: 'M', rest: 'EDELLÍN' },
    intro: 'Our picks for experiencing the city.',
    items: [
      { key: 'comuna13', title: 'Comuna 13 & Metrocable', lead: 'Art, music & Medellín’s story.', body: 'Explore colorful streets, incredible street art, music and the story of one of Medellín’s most transformed neighborhoods. One of the best ways to do that is by Metrocable. See Medellín from above.' },
      { key: 'provenza', title: 'Provenza & El Poblado', lead: 'Restaurants, cafés & nightlife.', body: 'A great area to wander around, grab a coffee, have dinner, enjoy cocktails and experience Medellín after dark.' },
      { key: 'laureles', title: 'Laureles', lead: 'Eat, drink & live like a local.', body: 'A more relaxed side of Medellín, known for its restaurants, cafés, bars and local atmosphere.' },
      { key: 'arvi', title: 'Parque Arví', lead: 'Escape into the mountains.', body: 'Head up into the hills for fresh air, greenery and beautiful views — a completely different side of Medellín.' },
      { key: 'botero', title: 'Plaza Botero & Museo de Antioquia', lead: 'Art in the heart of the city.', body: 'See the iconic sculptures of Fernando Botero and explore one of Medellín’s most important cultural spots.' },
      { key: 'coffee', title: 'Colombian Coffee', lead: 'You’re in Colombia, after all.', body: 'Visit one of Medellín’s specialty coffee shops or, if you have more time, experience a coffee farm surrounded by mountains and greenery.' },
      { key: 'food', title: 'Try the local food', lead: 'Come hungry.', body: 'Arepas, bandeja paisa, empanadas, chicharrón, buñuelos… There’s plenty to try, so don’t leave Colombia without tasting some of the local favorites.' },
    ],
  },
  trips: {
    tab: 'DAY TRIP',
    title: { initial: 'D', first: 'AY', second: 'TRIP' },
    intro: 'Our picks for trips around Medellín.',
    topPick: 'Our top recommendation.',
    items: [
      { key: 'guatape', top: true, title: 'Guatapé', lead: 'The one you shouldn’t miss.', body: 'Explore the colorful town, admire its famous zócalos and climb — or simply admire — La Piedra del Peñol for incredible views over the surrounding landscape.' },
      { key: 'santafe', top: false, title: 'Santa Fe de Antioquia', lead: 'A taste of colonial Colombia.', body: 'Wander through cobblestone streets, whitewashed colonial buildings and historic plazas, and discover a different side of Antioquia.' },
      { key: 'coffeecountry', top: false, title: 'Coffee Country', lead: 'A day among the coffee fields.', body: 'Head into the Antioquian countryside to discover how Colombian coffee is grown, harvested and prepared, surrounded by mountains and endless green.' },
      { key: 'jardin', top: false, title: 'Jardín', lead: 'For those with more time.', body: 'A beautiful mountain town surrounded by coffee country, nature and traditional Antioquian architecture. A little farther from Medellín, but worth considering if you’re staying a little longer.' }, // TODO_COPY: end of sentence completed by us, confirm with client
    ],
  },
  thanks: {
    title: { initial: 'T', rest: 'HANK YOU' },
    body: 'FOR BEING PART OF OUR SPECIAL DAY',
  },
  rsvp: {
    title: 'RSVP',
    kindly: 'Kindly',
    reply: 'REPLY',
    by: 'by',
    deadline: '15 DEC 2026', // TODO: confirm — max date, ~2 months after the invitation is received
    deadlineNote: 'An exception is made for QR Employees.', // TODO: confirm wording with client
    note: 'A LITTLE NOTE',
    plusOnes: 'Please note that plus ones are only included, if specifically indicated on your invitation.',
    needLink: 'Please open your personal invitation link to reply.',
    errorSubmit: 'We could not send your response. Please check your personal link and try again.',
    errorGeneric: 'Something went wrong while sending. Please try again in a moment.',
    labels: {
      name: 'FULL NAME',
      email: 'EMAIL (OPTIONAL)',
      phone: 'PHONE (OPTIONAL)',
      attending: 'WILL YOU BE ATTENDING?',
      yes: "WOULDN'T MISS IT FOR THE WORLD!",
      no: 'SENDING LOVE FROM AFAR.',
      companions: 'COMPANIONS',
      dietary: 'YOUR ALLERGIES OR DIETARY REQUIREMENTS',
      transport: 'WILL YOU NEED TRANSPORTATION?',
      transportYes: 'YES, PLEASE',
      transportNo: 'NO, THANK YOU',
      welcome: 'WILL YOU ALSO BE JOINING US FOR THE WELCOME MEETING ON 5 MAY?',
      welcomeYes: "YES, I'LL BE THERE",
      welcomeNo: 'NO, WEDDING ONLY',
      message: "IS THERE ANYTHING YOU'D LIKE TO TELL US?",
      send: 'SEND RSVP',
      edit: 'EDIT RESPONSE',
      close: 'Close RSVP dialog',
    },
    validation: {
      nameMin: 'Please enter your full name',
      emailInvalid: 'Please enter a valid email address',
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
    hours: 'GODZINY',
    minutes: 'MINUTY',
    seconds: 'SEKUNDY',
    srDays: (d: number) => `Pozostało ${d} dni do ślubu`,
  },
  welcome: {
    title: 'Witamy!',
    body: ['Któżby pomyślał, że znajdziemy się w tym miejscu?', 'Po wszystkim co doprowadziło nas do tej chwili, nie możemy doczekać się aby celebrować ją z wami w Medellín.'],
    expand: 'POWIĘKSZ',
    expandPhoto: 'Powiększ zdjęcie',
    viewPhoto: 'Zobacz zdjęcie',
    prevPhoto: 'Poprzednie zdjęcie',
    nextPhoto: 'Następne zdjęcie',
    carouselLabel: 'Galeria zdjęć powitalnych',
    navLabel: 'Nawigacja galerii',
    photos: [
      {
        key: 'skyline',
        alt: 'Panoramiczny widok na Medellín w Dolinie Aburrá',
        src: asset('assets/welcome-medellin-skyline.webp'),
        tone: ['#3d7ca8', '#5b8a58'],
      },
      {
        key: 'guayacan',
        alt: 'Rynek miasteczka z kwitnącym żółtym drzewem Guayacán i kolonialną architekturą',
        src: asset('assets/welcome-guayacan-plaza.webp'),
        tone: ['#e8b931', '#4a6b32'],
      },
      {
        key: 'guatape',
        alt: 'Widok z lotu ptaka na zalew w Guatapé i skałę El Peñol',
        src: asset('assets/welcome-guatape-rock.webp'),
        tone: ['#18649b', '#2e5c33'],
      },
      {
        key: 'cathedral-roses',
        alt: 'Ceglana neogotycka bazylika i ogród różany na głównym placu',
        src: asset('assets/welcome-cathedral-roses.webp'),
        tone: ['#7a5944', '#3d6b38'],
      },
      {
        key: 'cathedral-night',
        alt: 'Podświetlona fasada i wieże historycznej bazyliki nocą',
        src: asset('assets/welcome-cathedral-night.webp'),
        tone: ['#1b1c2b', '#b38237'],
      },
    ],
  },
  ui: { close: 'Zamknij' },
  lightbox: {
    dialogLabel: 'Powiększenie zdjęcia',
    close: 'Zamknij zdjęcie',
    prev: 'Poprzednie zdjęcie',
    next: 'Następne zdjęcie',
    selector: 'Wybór zdjęcia',
    goTo: 'Przejdź do zdjęcia',
  },
  venue: {
    title: { initial: 'M', rest: 'IEJSCE' },
    hasBakedTitle: false,
    logoAlt: 'Casa Primavera',
    illustrationAlt: 'Szkic szklarni Casa Primavera z palmami i górami',
    body: ['Od gór otaczających Medellín, po nieskończoną zieleń regionu Antioquia, ten krajobraz to niewątpliwie wizytówka, która sprawia, że to miejsce wyjątkowe.', 'W Casa Primavera, będziemy celebrować otoczeni pięknym widokiem, który nigdy się nie nudzi.'],
    mapsLabel: 'MIEJSCE NA MAPIE',
    climateLabel: 'KLIMAT',
    weekday: 'CZWARTEK',
    time: '15.00',
    dateText: '06 MAJA 2027',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Casa+Primavera+Medell%C3%ADn',
    coords: { lat: 6.2442, lon: -75.5812 },
  },
  programme: {
    title: { script: 'Program', rest: 'UROCZYSTOŚCI' },
    ariaLabel: 'Program Uroczystości',
    illustrations: { bus: 'Ilustracja autobusu', disco: 'Ilustracja kuli dyskotekowej', sparkler: 'Ilustracja zimnych ogni' },
    events: [
      { key: 'shuttle', label: 'TRANSPORT', time: '15:00', side: 'below' },
      { key: 'ceremony', label: 'CEREMONIA', time: '15:00', side: 'above' },
      { key: 'dinner', label: 'OBIAD', time: '15:00', side: 'below' },
      { key: 'party', label: 'ZABAWA', time: '15:00', side: 'above' },
      { key: 'sendoff', label: 'POWRÓT', time: '15:00', side: 'below' },
    ] as ProgrammeEvent[],
  },
  dress: {
    // The client asked to keep the whole dress code section in English for both versions.
    title: { initial: 'D', first: 'RESS', second: 'CODE', sectionLabel: 'Dress code' },
    palette: 'THE COLOUR PALETTE',
    formal: 'Formal Dress Code',
    her: 'FOR HER',
    him: 'FOR HIM',
    reference: '*Dla przykładu.',
    herAlt: 'Goście w eleganckich kolorowych sukniach z motywem kwiatowym',
    himAlt: 'Eleganckie garnitury dla panów w odcieniach niebieskiego, zieleni, brązu i czerni, każdy nad próbką koloru',
    swatches: ['#8E1B5C', '#C9DDEE', '#8A9A3B', '#DB8752', '#D080A6', '#B9A0CE'],
    ours: {
      initial: 'K',
      first: 'OLORY',
      second: 'PARY MŁODEJ',
      note: 'Trzy kolory zarezerwowane dla Manueli i Macieja',
      colors: ['#FFFFFF', '#F5F0E1', '#DDD1BB'],
      swatchLabel: 'Kolor Pary Młodej',
    },
  },
  medellin: {
    kicker: 'WITAMY W',
    title: { initial: 'M', rest: 'EDELLÍN' },
    sub: 'MIASTO WIECZNEJ WIOSNY',
    photosTab: 'ZDJĘCIA',
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
  transport: {
    title: { initial: 'T', rest: 'RANSPORT' },
    placeName: 'LETTERA HOTEL',
    pickup: 'PUNKT ODBIORU',
    mapsLabel: 'LOKALIZACJA',
    mapsUrl: 'https://maps.app.goo.gl/ppPuUyN557i58dhy8',
  },
  gifts: {
    title: { initial: 'P', rest: 'ODARUNKI' },
    body: ['Obecność na tym wydarzeniu, to najlepszy prezent o jaki moglibyśmy prosić.', 'Jeżeli jednak planujesz, wręczyć nam upominek, przyjmiemy kartki tudzież koperty w dzień wesela.'],
  },
  stay: {
    title: 'Gdzie się zatrzymać',
    body: 'Wybraliśmy dokładnie listę miejsc, aby ułatwić pobyt w Medellín. Oczywiście to są tylko nasze sugestie. Na liście są zarówno hotele, jak i apartamenty, ale finalny wybór zależy od prywatnych preferencji, planów oraz długości pobytu.',
    websiteLabel: 'STRONA',
    mapsLabel: 'LOKALIZACJA',
    hotels: [
      { key: 'lettera', name: 'LETTERA HOTEL', area: 'POBLADO', url: '', photo: asset('assets/stay-lettera.webp'), mapsUrl: 'https://maps.app.goo.gl/ppPuUyN557i58dhy8' },
      { key: 'lagoon', name: 'LAGOON HOTEL', area: 'POBLADO', url: '', photo: asset('assets/stay-lagoon.webp'), mapsUrl: 'https://maps.app.goo.gl/jTmoUAspiK2pSoya9' },
    ],
  },
  todo: {
    tab: 'CO ROBIĆ',
    kicker: 'CO ROBIĆ W',
    title: { initial: 'M', rest: 'EDELLÍN' },
    intro: 'Nasze propozycje, jak poznać miasto.', // TODO_COPY: client gave no PL for this line
    items: [
      { key: 'comuna13', title: 'Comuna 13 & Metrocable', lead: 'Sztuka, muzyka i historia Medellín.', body: 'Kolorowe uliczki, niesamowita sztuka uliczna, muzyka i historia jednej z najbardziej niezwykłych dzielnic Medellín. Jednym z najlepszych sposobów na zobaczenie 13 Dzielnicy jest przejażdżka kolejką linową nad Medellín - Metrocable.' },
      { key: 'provenza', title: 'Provenza & El Poblado', lead: 'Restauracje, kawiarnie i życie nocne.', body: 'Idealne miejsce na spacer, dobrą kawę, kolację, drinka i poznanie Medellín po zmroku.' },
      { key: 'laureles', title: 'Laureles', lead: 'Jedzenie, drinki i lokalna atmosfera.', body: 'Spokojniejsza część Medellín, pełna restauracji, kawiarni, barów i miejsc, w których można poczuć bardziej lokalny klimat miasta.' },
      { key: 'arvi', title: 'Parque Arví', lead: 'Ucieczka w góry.', body: 'Świeże powietrze, dużo zieleni i piękne widoki — zupełnie inna, bardziej naturalna strona Medellín.' },
      { key: 'botero', title: 'Plaza Botero & Museo de Antioquia', lead: 'Sztuka w sercu miasta.', body: 'Zobaczcie charakterystyczne rzeźby Fernando Botero i odwiedźcie jedno z najważniejszych miejsc związanych ze sztuką i kulturą Medellín.' },
      { key: 'coffee', title: 'Kolumbijska kawa', lead: 'W końcu jesteście w Kolumbii!', body: 'Odwiedźcie jedną z lokalnych kawiarni speciality albo, jeśli macie więcej czasu, wybierzcie się na plantację kawy wśród gór i bujnej zieleni.' },
      { key: 'food', title: 'Spróbujcie lokalnej kuchni', lead: 'Przyjedźcie głodni.', body: 'Arepas, bandeja paisa, empanadas, chicharrón, buñuelos… Jest czego próbować, więc nie wyjeżdżajcie z Kolumbii bez skosztowania lokalnych specjałów.' },
    ],
  },
  trips: {
    tab: 'WYCIECZKI JEDNODNIOWE',
    title: { initial: 'W', first: 'YCIECZKI', second: 'JEDNODNIOWE' },
    intro: 'Nasze propozycje wycieczek z Medellín.', // TODO_COPY: client gave no PL for this line
    topPick: 'Nasza rekomendacja numer jeden.',
    items: [
      { key: 'guatape', top: true, title: 'Guatapé', lead: 'Tego miejsca naprawdę nie można pominąć.', body: 'Kolorowe miasteczko, słynne zócalos i niesamowite widoki z La Piedra del Peñol. Możecie wejść na szczyt lub po prostu podziwiać krajobraz — widoki zdecydowanie są tego warte.' },
      { key: 'santafe', top: false, title: 'Santa Fe de Antioquia', lead: 'Kolonialna strona Kolumbii.', body: 'Spacerujcie po brukowanych uliczkach, zobaczcie białe kolonialne budynki i historyczne place oraz odkryjcie inną stronę Antioquii.' }, // TODO_COPY: end of sentence completed by us, confirm with client
      { key: 'coffeecountry', top: false, title: 'Region kawowy', lead: 'Dzień wśród plantacji kawy.', body: 'Wybierzcie się na kolumbijską wieś, aby zobaczyć, jak uprawia się, zbiera i przygotowuje kawę — wszystko w otoczeniu gór i niesamowitej zieleni.' },
      { key: 'jardin', top: false, title: 'Jardín', lead: 'Dla tych, którzy zostają na dłużej.', body: 'Piękne górskie miasteczko otoczone plantacjami kawy, naturą i tradycyjną architekturą Antioquii. Jest trochę dalej od Medellín, ale zdecydowanie warto je rozważyć przy dłuższym pobycie.' }, // TODO_COPY: end of sentence completed by us, confirm with client
    ],
  },
  thanks: {
    title: { initial: 'D', rest: 'ZIĘKUJEMY' },
    body: 'ZA BYCIE CZĘŚCIĄ TEGO WYJĄTKOWEGO DNIA',
  },
  rsvp: {
    title: 'RSVP',
    kindly: 'Prosimy o',
    reply: 'ODPOWIEDŹ',
    by: 'do',
    deadline: '15/12/2026',
    deadlineNote: 'Wyjątek dotyczy pracowników QR.',
    note: 'KRÓTKA UWAGA',
    plusOnes: 'Uwaga: Informacja o osobie towarzyszącej, uwzględniona w indywidualnym zaproszeniu.',
    needLink: 'Aby odpowiedzieć, otwórz swój osobisty link do zaproszenia.',
    errorSubmit: 'Nie udało się wysłać odpowiedzi. Sprawdź swój osobisty link i spróbuj ponownie.',
    errorGeneric: 'Coś poszło nie tak podczas wysyłania. Spróbuj ponownie za chwilę.',
    labels: {
      name: 'IMIĘ I NAZWISKO',
      email: 'EMAIL (OPCJONALNIE)',
      phone: 'NR TELEFONU (OPCJONALNIE)',
      attending: 'POTWIERDZENIE OBECNOŚCI',
      yes: 'TAK, OCZYWIŚCIE!',
      no: 'NIESTETY NIE.',
      companions: 'OSOBY TOWARZYSZĄCE',
      dietary: 'UCZULENIA LUB WYMAGANIA ŻYWIENIOWE',
      transport: 'CZY POTRZEBNY BĘDZIE TRANSPORT DO I Z WESELA?',
      transportYes: 'TAK',
      transportNo: 'NIE',
      welcome: 'PRZYJĘCIE POWITALNE 5 MAJA 2027?',
      welcomeYes: 'TAK!',
      welcomeNo: 'NIE, TYLKO WESELE.',
      message: 'CZY JEST JESZCZE COŚ, O CZYM WARTO NAM WSPOMNIEĆ?',
      send: 'WYŚLIJ RSVP',
      edit: 'EDYTUJ ODPOWIEDŹ',
      close: 'Zamknij okno RSVP',
    },
    validation: {
      nameMin: 'Proszę podać imię i nazwisko',
      emailInvalid: 'Proszę podać poprawny adres email',
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

