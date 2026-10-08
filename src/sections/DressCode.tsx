import { asset } from '../lib/asset'
import { motion, useReducedMotion } from 'motion/react'
import { StackedTitle } from '../components/SectionTitle'
import { SwatchDot } from '../components/SwatchDot'
import { useLanguage } from '../context/LanguageContext'

/** Hairline frame that draws itself stroke by stroke with inset coordinates so all 4 edges render crisply. */
function DrawnFrame() {
  const reduce = useReducedMotion()
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <motion.rect
        x="1"
        y="1"
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        fill="none"
        stroke="#8b9670"
        strokeWidth="1"
        initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.8 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: '120px 0px' }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
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
        <div className="relative mt-12 pb-9 pt-[68px]">
          <DrawnFrame />
          <div className="absolute inset-x-0 top-0 -translate-y-[42px] text-center">
            <div className="inline-block bg-cream px-4">
              <StackedTitle initial={d.title.initial} first={d.title.first} second={d.title.second} />
            </div>
          </div>
          <div className="text-center -translate-y-[4px]">
            <p className="label !text-[12px] !tracking-[0.3em] text-olive-deep">{d.palette}</p>
            <div className="mx-auto mt-2 h-[1px] w-24 bg-olive-deep/25" />
          </div>
          <motion.img
            src={asset("assets/dress-her-palette.webp")}
            width={1400}
            height={1030}
            alt={d.herAlt}
            loading="lazy"
            decoding="async"
            className="blend-multiply mx-auto mt-4 w-full"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="mt-5 text-center">
            <p className="label !text-[12px] !tracking-[0.3em] text-olive-deep">{d.her}</p>
            <p className="mt-1 font-serif text-[18px] sm:text-[20px] tracking-[0.06em] text-olive-deep font-normal">{d.formal}</p>
          </div>
        </div>

        {/* FOR HIM */}
        <div className="relative mt-24 pb-9 pt-[68px]">
          <DrawnFrame />
          <div className="absolute inset-x-0 top-0 -translate-y-[42px] text-center">
            <div className="inline-block bg-cream px-4">
              <StackedTitle initial={d.title.initial} first={d.title.first} second={d.title.second} />
            </div>
          </div>
          <div className="text-center -translate-y-[4px]">
            <p className="label !text-[12px] !tracking-[0.3em] text-olive-deep">{d.palette}</p>
            <div className="mx-auto mt-2 h-[1px] w-24 bg-olive-deep/25" />
          </div>
          {/* Eleven suits are too small to read at phone width, so the strip scrolls sideways there and fits from sm up. */}
          <div
            className="mt-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory sm:overflow-visible"
            role="region"
            aria-label={d.himAlt}
            tabIndex={0}
          >
            <img
              src={asset("assets/dress-him-palette.webp")}
              width={1800}
              height={829}
              alt={d.himAlt}
              loading="lazy"
              decoding="async"
              className="blend-multiply mx-auto h-auto w-[780px] max-w-none snap-center sm:w-full sm:max-w-full"
            />
          </div>
          <div className="mt-5 text-center">
            <p className="label !text-[12px] !tracking-[0.3em] text-olive-deep">{d.him}</p>
            <p className="mt-1 font-serif text-[18px] sm:text-[20px] tracking-[0.06em] text-olive-deep font-normal">{d.formal}</p>
          </div>
        </div>

        {/* OUR COLORS */}
        <div className="relative mt-24 pb-9 pt-[68px]">
          <DrawnFrame />
          <div className="absolute inset-x-0 top-0 -translate-y-[42px] text-center">
            <div className="inline-block bg-cream px-4">
              <StackedTitle initial={o.initial} first={o.first} second={o.second} />
            </div>
          </div>
          <div className="text-center -translate-y-[4px]">
            <p className="label !text-[12px] !tracking-[0.3em] text-olive-deep">{d.palette}</p>
            <div className="mx-auto mt-2 h-[1px] w-24 bg-olive-deep/25" />
          </div>
          <div className="mt-8 flex justify-center gap-6 sm:gap-8 px-6">
            {o.colors.map((c, i) => (
              <SwatchDot
                key={c}
                color={c}
                index={i}
                label={`${o.swatchLabel} ${i + 1}`}
                className="w-20 sm:w-24 max-w-[96px] shadow-[inset_0_0_0_1px_rgba(63,90,46,0.18)]"
              />
            ))}
          </div>
          <p className="label mt-8 max-w-[380px] mx-auto px-4 text-center !text-[12px] !leading-[1.8] !tracking-[0.18em] text-olive-deep">
            {o.note}
          </p>
        </div>
      </div>
    </section>
  )
}
