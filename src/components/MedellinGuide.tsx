import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
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

const TILT = [-7, 8, -4, -8, 6, -5, 7, -3]
const LEFT = [2, 50, 12, 47, 5, 46, 12, 49]
/** Board geometry in % of its own width: card width, vertical step, card height. */
const CARD_W = 44, STEP = 36, CARD_H = 80

/** Scattered, draggable polaroids (same look as the Photos tab); tap opens the detail modal. */
function PickBoard({ items, onOpen }: { items: Pick[]; onOpen: (p: Pick) => void }) {
  const reduce = useReducedMotion()
  const board = useRef<HTMLDivElement>(null)
  const [order, setOrder] = useState<Record<string, number>>({})
  const next = useRef(items.length + 1)
  const dragged = useRef(false)
  const bringFront = (key: string) => setOrder((o) => ({ ...o, [key]: next.current++ }))
  const heightW = 2 + (items.length - 1) * STEP + CARD_H

  return (
    <div ref={board} className="relative mx-auto mt-7 w-full max-w-[460px]" style={{ aspectRatio: `100 / ${heightW}` }}>
      {items.map((p, i) => {
        const photo = guidePhotos[p.key]
        const rotate = TILT[i % TILT.length]
        return (
          <motion.button
            key={p.key}
            type="button"
            aria-haspopup="dialog"
            aria-label={`${p.title}. ${p.lead}`}
            drag={!reduce}
            dragConstraints={board}
            dragElastic={0.2}
            dragMomentum={false}
            onPointerDown={() => { dragged.current = false; bringFront(p.key) }}
            onDragStart={() => { dragged.current = true }}
            onTap={() => { if (!dragged.current) onOpen(p) }}
            whileDrag={{ scale: 1.05 }}
            whileHover={reduce ? undefined : { scale: 1.02 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -240, rotate: rotate - 25 }}
            whileInView={{ opacity: 1, y: 0, rotate }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={reduce ? { duration: 0.5 } : { type: 'spring', stiffness: 70, damping: 11, delay: (i % 2) * 0.16 }}
            style={{ left: `${LEFT[i % LEFT.length]}%`, top: `${((2 + i * STEP) / heightW) * 100}%`, width: `${CARD_W}%`, zIndex: order[p.key] ?? items.length - i, touchAction: 'pan-y' }}
            className="absolute cursor-grab bg-white p-[3.5%] pb-[4%] text-center shadow-[0_14px_28px_-10px_rgba(60,45,20,.45)] active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="pointer-events-none block aspect-[3/4] w-full overflow-hidden bg-sand">
              {photo && <img src={photo.src} alt="" width={900} height={600} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />}
            </span>
            <span className="pointer-events-none mt-2 block">
              <span className="block font-serif text-[clamp(13px,3.9vw,17px)] font-medium leading-tight text-olive-deep">{p.title}</span>
              <span className="label mt-1 block !text-[8px] !leading-[1.45] !tracking-[0.14em] text-gold">{p.lead}</span>
            </span>
          </motion.button>
        )
      })}
    </div>
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
              <div className={`mx-auto -rotate-1 bg-white ${photo.portrait ? 'max-w-[320px]' : 'max-w-[420px]'} p-2.5 pb-3 shadow-[0_14px_28px_-12px_rgba(60,45,20,.5)]`}>
                <div className={`${photo.portrait ? 'aspect-[3/4]' : 'aspect-[3/2]'} w-full overflow-hidden bg-sand`}>
                  <img src={photo.src} alt={shown.title} width={900} height={photo.portrait ? 1200 : 600} decoding="async" className="h-full w-full object-cover" />
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
      <div role="tablist" aria-label={t.medellin.kicker} className="relative mx-auto grid max-w-[460px] grid-cols-3 border-b border-gold/40">
        <span
          aria-hidden="true"
          style={{ transform: `translateX(${active * 100}%)` }}
          className={`pointer-events-none absolute -bottom-px left-0 flex h-[3px] w-1/3 justify-center ${reduce ? '' : 'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'}`}
        >
          <span className="block h-full w-3/4 rounded-full bg-olive-deep" />
        </span>
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
              active === i ? 'text-olive-deep' : 'text-[#8f7240]/65 hover:text-olive-deep'
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
              <PickBoard key={cur.key} items={cur.items} onOpen={setPicked} />
            </>
          )}
        </Reveal>
      </div>
      <PickModal pick={picked} topLabel={t.trips.topPick} onClose={() => setPicked(null)} closeLabel={t.rsvp.labels.close} />
    </div>
  )
}
