import type { ReactNode, SVGProps } from 'react'

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const svg = (d: ReactNode) => (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...base} {...p}>{d}</svg>
)

/** Line icons for the Medellín guide cards, keyed by item key. */
export const guideIcons: Record<string, (p: SVGProps<SVGSVGElement>) => ReactNode> = {
  // spray can (street art)
  comuna13: svg(<><rect x="7" y="9" width="8" height="12" rx="1.5" /><path d="M9 9V6h4v3M10 6V4h2v2M18 6h.01M19.5 9h.01M18 12h.01" /></>),
  // sculpture: round head over a plump body
  botero: svg(<><circle cx="12" cy="6" r="2.6" /><path d="M7 21c-1-5 0-9 5-9s6 4 5 9ZM5 21h14" /></>),
  // cocktail glass
  provenza: svg(<><path d="M5 5h14l-7 8ZM12 13v7M8 20h8M8.5 8h7" /></>),
  // tree
  laureles: svg(<><circle cx="12" cy="9" r="5.5" /><path d="M12 14.5V21M9 21h6M12 11l-2-2M12 12l2-2" /></>),
  // mountains + sun
  arvi: svg(<><path d="M2.5 20 9 9l4.5 7 2.5-3.5 5.5 7.5ZM17.5 6.5a2 2 0 1 0 0 .01" /></>),
  // coffee cup
  coffee: svg(<><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5ZM16 10.5h1.5a2.5 2.5 0 0 1 0 5H15.5M9 3.5c-1 1 1 2 0 3.5M12.5 3.5c-1 1 1 2 0 3.5" /></>),
  // fork and knife
  food: svg(<><path d="M7 3v7M5 3v5a2 2 0 0 0 4 0V3M7 10v11M17 21V3c-2 1.5-3 4-3 7h3" /></>),
  // sailboat (the reservoir)
  guatape: svg(<><path d="M12 3v13M12 4c4 2 6 6 6 12h-6M12 8c-2.5 2-4 5-4 8h4M4 19h16" /></>),
  // arched bridge / old town
  santafe: svg(<><path d="M2.5 18h19M4 18v-6a8 8 0 0 1 16 0v6M9 18v-4a3 3 0 0 1 6 0v4M4 8h16" /></>),
  // coffee leaf
  coffeecountry: svg(<><path d="M5 19C4 11 9 5 20 4c0 10-5 16-13 15M5 19c2-5 5-8 9-10" /></>),
  // village church
  jardin: svg(<><path d="M12 3v3M10.5 4.5h3M8 21V10l4-4 4 4v11M4 21h16M10.5 21v-4a1.5 1.5 0 0 1 3 0v4M12 10h.01" /></>),
}
