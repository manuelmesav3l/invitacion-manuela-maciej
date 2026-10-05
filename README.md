# Manuela & Maciej — Digital Wedding Invitation

React 18 + Vite + TypeScript · Tailwind · Motion · GSAP ScrollTrigger · Lenis · Supabase (RSVP).

## Run
```bash
npm install
cp .env.example .env      # fill in Supabase values
npm run dev               # http://localhost:5173
npm run build && npm run preview
npm run typecheck && npm run lint
```

## Supabase setup
1. Create a project at supabase.com.
2. SQL Editor → run `supabase/migrations/0001_rsvp.sql` (tables, RLS, `get_guest` / `submit_rsvp` RPCs).
3. Project Settings → API: copy URL and anon key into `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Add guests: `insert into guests (token, name, max_companions) values ('maria-7f3k', 'María Pérez', 2);`
5. Share `https://your-site/?g=maria-7f3k`. The form preloads name/cupos and lets the guest edit their answer with the same link.

Tables have RLS on with no policies and no grants: public read is impossible; writes go only through the RPCs, which validate the token and companion limit. One row per guest (unique index) bounds spam; a honeypot field is also included.

## Deploy (Vercel / Netlify)
Build command `npm run build`, output `dist`, add the two env vars in the dashboard.

## Content
Everything editable is in `src/content/content.ts` (names, date, copy, times, links, coordinates, palette). Search for `TODO_COPY` / `TODO_ASSET`.

## Pending
- Welcome and Venue paragraphs (`TODO_COPY`)
- Dress code FOR HIM image (`TODO_ASSET`, `data-todo-asset="dress-him"`)
- Real programme times (all "3:00")
- Google Maps links (venue + Medellín) and Casa Primavera coordinates
- Photos: Welcome (3) and Medellín polaroids (4) — currently tonal gradient placeholders
- High-res assets to replace (`public/assets/`, cropped from the mockup by `scripts/crop-assets.mjs`): `hero-couple.webp`, `venue-illustration.webp`, `venue-logo.webp`, `dress-her-collage.webp` (ideally transparent PNG/SVG), `og-image.jpg`; bus / disco ball / sparkler are hand-drawn SVGs in `components/Icons.tsx`, postcard is CSS — swap for the originals.

## Technical decisions
- Fonts: Pinyon Script (scripts), Cormorant Garamond (titles/numbers), Cormorant SC (labels).
- Hero names are live text; the baked-in names were in-painted out of the cropped illustration.
- Lenis is driven by GSAP's ticker; disabled entirely under `prefers-reduced-motion` (fades only).
- GSAP scrub: hero/welcome/Medellín parallax and the programme timeline (line + nodes + icons). Motion: reveals, mask text, count-up/digit slide, frame drawing, drag polaroids, sheets.
- Climate: Open-Meteo archive (average of last 5 Mays) → real forecast within 14 days → static fallback.

## Known differences vs the design
- Mockup only available as low-res slices; photos and some ornaments are approximations.
- Dress collage: swatch circles were painted out of the raster and rebuilt in HTML; slight hem clipping on a few dresses.
- Small "white flower" on swatches omitted (not visible in the reference). Lighthouse was not run.
