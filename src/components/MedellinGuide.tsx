import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { Reveal } from './Reveal'
import { guidePhotos } from '../content/guidePhotos'
import { Sheet } from './Sheet'
import { useLanguage } from '../context/LanguageContext'

interface Pick {
  key: string
  title: string
  lead: string
  body: string
  top?: boolean
}

const TILT = [-2.2, 1.8, -1.2, 2.4, -1.8, 1.4, -2.4, 1.1]

function PickPolaroid({ pick, index, lone, onOpen }: { pick: Pick; index: number; lone: boolean; onOpen: () => void }) {
  const photo = guidePhotos[pick.key]
  return (
    <li className={lone ? 'col-span-2 mx-auto w-1/2' : undefined}>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        style={{ rotate: `${TILT[index % TILT.length]}deg` }}
        className="group block w-full bg-white p-[5%] pb-[6%] text-left shadow-[0_14px_28px_-12px_rgba(60,45,20,.5)] transition-[transform,box-shadow] duration-300 hover:!rotate-0 hover:-translate-y-1 hover:shadow-[0_20px_34px_-12px_rgba(60,45,20,.55)] active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
      >
        <span className="relative block aspect-square w-full overflow-hidden bg-sand">
          {photo && (
            <img src={photo.src} alt="" width={900} height={600} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
        </span>
        <span className="mt-2.5 block text-center">
          <span className="block font-serif text-[clamp(15px,4.2vw,18px)] font-medium leading-tight text-olive-deep">{pick.title}</span>
          <span className="label mt-1 block !text-[8.5px] !leading-[1.5] !tracking-[0.16em] text-gold">{pick.lead}</span>
        </span>
      </button>
    </li>
  )
}

function PickModal({ pick, topLabel, onClose, closeLabel }: { pick: Pick | null; topLabel: string; onClose: () => void; closeLabel: string }) {
  // Keep the last pick mounted while the sheet animates out.
  const [last, setLast] = useState<Pick | null>(pick)
  if (pick && pick !== last) setLast(pick)
  const shown = pick ?? last
  const photo = shown ? guidePhotos[shown.key] : undefined
  return (
    <Sheet open={!!pick} onClose={onClose} label={shown?.title ?? ''} closeLabel={closeLabel}>
      {shown && (
        <article className="px-5 pb-10 pt-[72px] text-center">
          {photo && (
            <figure className="m-0">
              <div className="mx-auto max-w-[420px] -rotate-1 bg-white p-2.5 pb-3 shadow-[0_14px_28px_-12px_rgba(60,45,20,.5)]">
                <div className="aspect-[3/2] w-full overflow-hidden bg-sand">
                  <img src={photo.src} alt={shown.title} width={900} height={600} decoding="async" className="h-full w-full object-cover" />
                </div>
              </div>
              {photo.credit && (
                <figcaption className="mt-2 font-serif text-[12px] italic text-ink/60">
                  <a href={photo.credit.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline focus-visible:underline">
                    {photo.credit.author} · {photo.credit.license}
                  </a>
                </figcaption>
              )}
            </figure>
          )}
          <h3 aria-hidden="true" className="m-0 mt-6 font-belfast text-[clamp(26px,7.5vw,34px)] font-normal leading-tight text-olive-deep">{shown.title}</h3>
          <p className="label mt-2 !text-[10px] !tracking-[0.2em] text-gold">{shown.lead}</p>
          <p className="m-0 mx-auto mt-5 max-w-[440px] font-serif text-[clamp(17px,4.6vw,19px)] leading-[1.6] text-ink">{shown.body}</p>
          {shown.top && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 font-serif text-[15px] text-[#f8f1e2]">
              <span aria-hidden="true">⭐</span>{topLabel}
            </p>
          )}
        </article>
      )}
    </Sheet>
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
  const [picked, setPicked] = useState<Pick | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const uid = useId()

  const select = (i: number) => {
    setActive(i)
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
            className={`flex min-h-[60px] items-center justify-center px-0.5 pt-3 pb-1.5 text-center font-belfast leading-[1.05] tracking-[0.02em] text-[clamp(12px,3.5vw,17px)] transition-colors duration-300 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              active === i ? 'text-[#8f7240]' : 'text-[#8f7240]/75 hover:text-[#8f7240]'
            }`}
          >
            <span aria-label={tab.label}>
              <span aria-hidden="true">
                {/* The script "T" collides with the following "H"; keep it in the serif face. */}
                {tab.label.charAt(0) === 'T'
                  ? tab.label
                  : <><span className="font-script italic text-[1.7em] leading-none align-baseline mr-[-0.04em]">{tab.label.charAt(0)}</span>{tab.label.slice(1)}</>}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${cur.key}`}>
        <Reveal key={cur.key}>
          {cur.key === 'photos' ? gallery : (
            <>
              <p className="label mt-6 !text-[10px] !tracking-[0.22em] text-gold">{cur.intro}</p>
              <ul className="mx-auto mt-7 grid max-w-[460px] grid-cols-2 gap-x-5 gap-y-7 px-1">
                {cur.items.map((p, i) => (
                  <PickPolaroid key={p.key} pick={p} index={i} lone={i === cur.items.length - 1 && cur.items.length % 2 === 1} onOpen={() => setPicked(p)} />
                ))}
              </ul>
            </>
          )}
        </Reveal>
      </div>
      <PickModal pick={picked} topLabel={t.trips.topPick} onClose={() => setPicked(null)} closeLabel={t.rsvp.labels.close} />
    </div>
  )
}
