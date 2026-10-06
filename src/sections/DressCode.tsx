import { asset } from '../lib/asset'
import { motion, useReducedMotion } from 'motion/react'
import { StackedTitle } from '../components/SectionTitle'
import { SwatchDot } from '../components/SwatchDot'
import { useLanguage } from '../context/LanguageContext'

/** Hairline frame that draws itself stroke by stroke. */
function DrawnFrame() {
  const reduce = useReducedMotion()
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
      <motion.rect
        x="0" y="0" width="100%" height="100%" fill="none" stroke="#8b9670" strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: reduce ? 1 : 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 2.2, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export function DressCode() {
  const { t } = useLanguage()
  const d = t.dress
  const o = d.ours
  const reduce = useReducedMotion()
  return (
    <section className="bg-cream pb-28 pt-16" aria-label={d.title.sectionLabel}>
      <div className="mx-auto max-w-[560px] px-[5%]">
        {/* FOR HER */}
        <div className="relative mt-12 pb-7 pt-[70px]">
          <p className="label absolute right-0 top-[-36px] !text-[13px] !tracking-[0.3em] text-olive-deep">{d.her}</p>
          <DrawnFrame />
          <div className="absolute inset-x-0 top-0 -translate-y-[42px] text-center">
            <div className="inline-block bg-cream px-3"><StackedTitle initial={d.title.initial} first={d.title.first} second={d.title.second} /></div>
          </div>
          <p className="label mt-1 text-center !text-[13px] !tracking-[0.3em] text-olive-deep -translate-y-[6px]">{d.palette}</p>
          <motion.img
            src={asset("assets/dress-her-palette.webp")} width={1400} height={1030} alt={d.herAlt} loading="lazy" decoding="async"
            className="blend-multiply mx-auto mt-3 w-full"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <p className="label mt-4 text-center !text-[13px] !tracking-[0.3em] text-olive-deep">{d.formal}</p>
        </div>

        {/* FOR HIM — mirrored vertically */}
        <div className="relative mt-24 pb-[70px] pt-7">
          <p className="label absolute bottom-[-36px] left-0 !text-[13px] !tracking-[0.3em] text-olive-deep">{d.him}</p>
          <DrawnFrame />
          <p className="label text-center !text-[13px] !tracking-[0.3em] text-olive-deep">{d.palette}</p>
          {/* Eleven suits are too small to read at phone width, so the strip scrolls sideways there and fits from sm up. */}
          <div
            className="mt-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory sm:overflow-visible"
            role="region" aria-label={d.himAlt} tabIndex={0}
          >
            <img
              src={asset("assets/dress-him-palette.webp")} width={1800} height={829} alt={d.himAlt} loading="lazy" decoding="async"
              className="blend-multiply mx-auto h-auto w-[780px] max-w-none snap-center sm:w-full sm:max-w-full"
            />
          </div>
          <p className="label mt-3 text-center !text-[13px] !tracking-[0.3em] text-olive-deep">{d.formal}</p>
          <div className="absolute inset-x-0 bottom-0 translate-y-[42px] text-center">
            <div className="inline-block bg-cream px-3"><StackedTitle initial={d.title.initial} first={d.title.first} second={d.title.second} /></div>
          </div>
        </div>

        {/* OUR COLORS */}
        <div className="relative mt-24 pb-7 pt-[70px]">
          <DrawnFrame />
          <div className="absolute inset-x-0 top-0 -translate-y-[42px] text-center">
            <div className="inline-block bg-cream px-3"><StackedTitle initial={o.initial} first={o.first} second={o.second} /></div>
          </div>
          <p className="label mt-1 text-center !text-[13px] !tracking-[0.3em] text-olive-deep -translate-y-[6px]">{d.palette}</p>
          <div className="mt-8 flex justify-center gap-[4%] px-[5%]">
            {o.colors.map((c, i) => (
              <SwatchDot key={c} color={c} index={i} label={`${o.swatchLabel} ${i + 1}`} className="w-[26%] shadow-[inset_0_0_0_1px_rgba(63,90,46,0.12)]" />
            ))}
          </div>
          <p className="label mt-8 px-4 text-center !text-[13px] !leading-[1.9] !tracking-[0.2em] text-olive-deep">{o.note}</p>
        </div>
      </div>
    </section>
  )
}
