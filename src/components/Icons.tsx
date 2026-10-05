import type { SVGProps } from 'react'

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
type P = SVGProps<SVGSVGElement>

export const PinIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...p}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" />
  </svg>
)
export const SunCloudIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...base} {...p}>
    <circle cx="8.5" cy="8.5" r="3" /><path d="M8.5 2.5v1.2M2.5 8.5h1.2M4.3 4.3l.9.9M12.7 4.3l-.9.9" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 .3-7 4.8 4.8 0 0 0-9 1.3A2.9 2.9 0 0 0 9 19Z" />
  </svg>
)
export const CloseIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...base} {...p}><path d="M5 5l14 14M19 5 5 19" /></svg>
)

/* Hand-drawn sketch icons for the programme (gold/sepia line art; swap for finals in /public/assets). */
const sk = { fill: 'none', stroke: '#a38658', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const BusSketch = (p: P) => (
  <svg viewBox="0 0 120 80" aria-hidden="true" {...sk} {...p}>
    <path d="M10 60V22a8 8 0 0 1 8-8h72a14 14 0 0 1 14 14v32a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4Z" fill="#efe4d0" />
    <path d="M10 46h94M14 24h24v16H14zM44 24h24v16H44zM74 24h26a6 6 0 0 1 4 6v10H74z" />
    <circle cx="34" cy="62" r="8" fill="#f8f5ee" /><circle cx="34" cy="62" r="3" />
    <circle cx="86" cy="62" r="8" fill="#f8f5ee" /><circle cx="86" cy="62" r="3" />
    <path d="M18 18h60M22 50h10M92 50h8M6 60h6" opacity=".6" />
  </svg>
)
export const DiscoSketch = (p: P) => (
  <svg viewBox="0 0 100 100" aria-hidden="true" {...sk} {...p}>
    <circle cx="50" cy="52" r="28" fill="#efe4d0" />
    <path d="M22 52h56M50 24v56M28 36c14 6 30 6 44 0M28 68c14-6 30-6 44 0M36 28c-6 14-6 30 0 48M64 28c6 14 6 30 0 48" />
    <path d="M50 24V8M44 8h12" />
    <g className="sparkle-a"><path d="M86 20l2 5 5 2-5 2-2 5-2-5-5-2 5-2ZM12 30l1.5 3.5 3.5 1.5-3.5 1.5L12 40l-1.5-3.5L7 35l3.5-1.5Z" /></g>
  </svg>
)
export const SparklerSketch = (p: P) => (
  <svg viewBox="0 0 120 100" aria-hidden="true" {...sk} {...p}>
    <path d="M30 92 58 40M92 92 62 40" strokeWidth="2" />
    <g style={{ transformOrigin: '60px 34px', animation: 'sparkle 2.4s ease-in-out infinite' }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2, r1 = 8, r2 = 24 + (i % 3) * 5
        return <path key={i} d={`M${60 + Math.cos(a) * r1} ${34 + Math.sin(a) * r1}L${60 + Math.cos(a) * r2} ${34 + Math.sin(a) * r2}`} />
      })}
      <circle cx="60" cy="34" r="3" fill="#a38658" />
    </g>
  </svg>
)
