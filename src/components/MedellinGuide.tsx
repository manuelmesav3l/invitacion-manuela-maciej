import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { Reveal } from './Reveal'
import { guidePhotos } from '../content/guidePhotos'
import { guideIcons } from './GuideIcons'
import { useLanguage } from '../context/LanguageContext'

interface Pick {
  key: string
  title: string
  lead: string
  body: string
  top?: boolean
}

function PickCard({ pick, open, onToggle, topLabel, reduce }: { pick: Pick; open: boolean; onToggle: () => void; topLabel: string; reduce: boolean | null }) {
  const id = useId()
  const photo = guidePhotos[pick.key]
  const Icon = guideIcons[pick.key]
  // Load the big photo the first time the card opens, then keep it for instant re-opens.
  const [seen, setSeen] = useState(open)
  const [loaded, setLoaded] = useState(false)
  if (open && !seen) setSeen(true)
  return (
    <li>
      <div className={`rounded-[4px] border bg-white/40 transition-colors duration-300 ${open ? 'border-gold shadow-[0_10px_26px_-14px_rgba(60,50,20,.45)]' : 'border-olive-deep/20 hover:border-gold/70'}`}>
        <h3 className="m-0">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            id={`${id}-btn`}
            onClick={onToggle}
            className="group flex min-h-[64px] w-full items-center gap-3.5 px-4 py-3 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sand/70 text-olive-deep shadow-[inset_0_0_0_1px_rgba(173,145,92,0.45)] transition-colors duration-300 group-hover:bg-gold/20">
              {Icon && <Icon width={24} height={24} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-[clamp(19px,5.2vw,23px)] font-medium leading-tight text-olive-deep">{pick.title}</span>
              <span className="label mt-1 block !text-[10px] !leading-[1.6] !tracking-[0.18em] text-gold">{pick.lead}</span>
            </span>
            <svg aria-hidden="true" viewBox="0 0 12 12" width="14" height="14" fill="none" stroke="#3F5A2E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${reduce ? '' : 'transition-transform duration-300'} ${open ? 'rotate-180' : ''}`}>
              <path d="M2 4.5 6 8.5l4-4" />
            </svg>
          </button>
        </h3>
        <div
          id={`${id}-panel`}
          role="region"
          aria-labelledby={`${id}-btn`}
          className={`grid ${reduce ? '' : 'transition-[grid-template-rows] duration-300 ease-out'} ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-5">
              {photo && (
                <figure className="m-0">
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[3px] bg-sand shadow-[0_8px_20px_-10px_rgba(60,45,20,.5)]">
                    {seen && (
                      <img
                        src={photo.src}
                        alt={pick.title}
                        width={900}
                        height={600}
                        decoding="async"
                        onLoad={() => setLoaded(true)}
                        className={`h-full w-full object-cover ${reduce ? '' : 'transition-opacity duration-500'} ${loaded ? 'opacity-100' : 'opacity-0'}`}
                      />
                    )}
                  </div>
                  {photo.credit && (
                    <figcaption className="mt-1.5 text-right font-serif text-[12px] italic leading-tight text-ink/60">
                      <a href={photo.credit.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline focus-visible:underline">
                        {photo.credit.author} · {photo.credit.license}
                      </a>
                    </figcaption>
                  )}
                </figure>
              )}
              <p className="m-0 mt-4 font-serif text-[clamp(17px,4.6vw,19px)] leading-[1.5] text-ink">{pick.body}</p>
              {pick.top && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 font-serif text-[15px] text-[#f8f1e2]">
                  <span aria-hidden="true">⭐</span>{topLabel}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

/** Medellín guide: tabs (things to do / day trips) over single-open accordion cards. */
export function MedellinGuide({ gallery }: { gallery: ReactNode }) {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const tabs = [
    { key: 'todo', label: t.todo.tab, intro: t.todo.intro, items: t.todo.items as Pick[], top: '' },
    { key: 'trips', label: t.trips.tab, intro: t.trips.intro, items: t.trips.items as Pick[], top: t.trips.topPick },
    { key: 'photos', label: t.medellin.photosTab, intro: '', items: [] as Pick[], top: '' },
  ] as const
  const [active, setActive] = useState(0)
  const [openKey, setOpenKey] = useState<string | null>(tabs[0].items[0].key)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const uid = useId()

  const select = (i: number) => {
    setActive(i)
    setOpenKey(tabs[i].items[0]?.key ?? null)
  }
  const onKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : -1
    if (next < 0) return
    e.preventDefault()
    select(next)
    tabRefs.current[next]?.focus()
  }
  const cur = tabs[active]

  return (
    <div className="mt-4 sm:mt-5">
      <div role="tablist" aria-label={t.medellin.kicker} className="relative mx-auto grid max-w-[460px] grid-cols-3 border-b border-gold/25">
        <span
          aria-hidden="true"
          style={{ transform: `translateX(${active * 100}%)` }}
          className={`pointer-events-none absolute -bottom-px left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent ${reduce ? '' : 'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'}`}
        />
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            ref={(el) => { tabRefs.current[i] = el }}
            type="button"
            role="tab"
            id={`${uid}-tab-${tab.key}`}
            aria-selected={active === i}
            aria-controls={`${uid}-panel`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`label flex min-h-[46px] items-center justify-center px-1 pb-1 text-center !text-[10px] !leading-[1.5] !tracking-[0.22em] font-medium transition-colors duration-300 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:!text-[12px] sm:!tracking-[0.3em] ${
              active === i ? 'text-gold' : 'text-gold/75 hover:text-gold'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${cur.key}`}>
        <Reveal key={cur.key}>
          {cur.key === 'photos' ? gallery : (
            <>
              <p className="label mt-6 !text-[10px] !tracking-[0.22em] text-gold">{cur.intro}</p>
              <ul className="mx-auto mt-5 max-w-[460px] space-y-3 text-left">
                {cur.items.map((p) => (
                  <PickCard
                    key={p.key}
                    pick={p}
                    open={openKey === p.key}
                    onToggle={() => setOpenKey(openKey === p.key ? null : p.key)}
                    topLabel={cur.top}
                    reduce={reduce}
                  />
                ))}
              </ul>
            </>
          )}
        </Reveal>
      </div>
    </div>
  )
}
