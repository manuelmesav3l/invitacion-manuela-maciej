import { motion, useReducedMotion } from 'motion/react'
import { StackedTitle } from '../components/SectionTitle'
import { SwatchDot } from '../components/SwatchDot'
import { t } from '../content/content'

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

const d = t.dress

export function DressCode() {
  const reduce = useReducedMotion()
  return (
    <section className="bg-cream pb-28 pt-16" aria-label="Dress code">
      <div className="mx-auto max-w-[560px] px-[5%]">
        {/* FOR HER */}
        <div className="relative mt-12 pb-7 pt-[70px]">
          <p className="label absolute right-0 top-[-36px] !text-[13px] !tracking-[0.3em] text-olive-deep">{d.her}</p>
          <DrawnFrame />
          <div className="absolute inset-x-0 top-0 -translate-y-[42px] text-center">
            <div className="inline-block bg-cream px-3"><StackedTitle initial={d.title.initial} first={d.title.rest.split(' ')[0]} second="CODE" /></div>
          </div>
          <p className="label mt-1 text-center !text-[13px] !tracking-[0.3em] text-olive-deep -translate-y-[6px]">{d.palette}</p>
          <div className="relative mt-3">
            <motion.img
              src="/assets/dress-her-collage.webp" width={910} height={695} alt={d.herAlt} loading="lazy" decoding="async"
              className="mx-auto w-[94%]"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute bottom-[1.5%] right-[3.2%] flex w-[57%] justify-between">
              {d.swatches.map((c, i) => <SwatchDot key={c} color={c} index={i} label={`Palette colour ${i + 1}`} />)}
            </div>
          </div>
          <p className="label mt-4 text-center !text-[13px] !tracking-[0.3em] text-olive-deep">{d.formal}</p>
        </div>

        {/* FOR HIM — mirrored vertically */}
        <div className="relative mt-24 pb-[70px] pt-7">
          <p className="label absolute bottom-[-36px] left-0 !text-[13px] !tracking-[0.3em] text-olive-deep">{d.him}</p>
          <DrawnFrame />
          <p className="label text-center !text-[13px] !tracking-[0.3em] text-olive-deep">{d.palette}</p>
          {/* TODO_ASSET: FOR HIM image pending — drop the file in /public/assets and set `src` */}
          <img
            data-todo-asset="dress-him" alt={d.himAlt} width={910} height={695}
            src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
            className="mx-auto mt-3 aspect-[910/695] w-[94%] bg-transparent object-cover" loading="lazy"
          />
          <p className="label mt-3 text-center !text-[13px] !tracking-[0.3em] text-olive-deep">{d.formal}</p>
          <div className="absolute inset-x-0 bottom-0 translate-y-[42px] text-center">
            <div className="inline-block bg-cream px-3"><StackedTitle initial={d.title.initial} first={d.title.rest.split(' ')[0]} second="CODE" /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
