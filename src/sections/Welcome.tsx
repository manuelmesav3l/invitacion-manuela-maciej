import { useEffect, useRef } from 'react'
import { useReducedMotion, motion } from 'motion/react'
import { PhotoSlot } from '../components/PhotoSlot'
import { Reveal } from '../components/Reveal'
import { t } from '../content/content'
import { gsap } from '../lib/scroll'

const OFFSETS = [-6, 8, -6] // parallax yPercent: centre travels differently than the sides

export function Welcome() {
  const reduce = useReducedMotion()
  const row = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce || !row.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.wl-par').forEach((el, i) =>
        gsap.fromTo(el, { yPercent: -OFFSETS[i] / 2 }, {
          yPercent: OFFSETS[i] / 2, ease: 'none',
          scrollTrigger: { trigger: row.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }))
    }, row)
    return () => ctx.revert()
  }, [reduce])

  return (
    <section className="bg-sand pb-8 pt-6" aria-label="Welcome">
      <div className="mx-auto max-w-[560px] px-5 text-center">
        <Reveal>
          <h2 className="m-0 font-script text-[clamp(72px,22vw,112px)] font-normal leading-none text-olive-deep" style={{ transform: 'rotate(-2deg)' }}>{t.welcome.title}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          {/* TODO_COPY: welcome paragraph lives in content.ts */}
          <p className="label mx-auto mt-3 max-w-[300px] !text-[11px] !leading-[2] text-ink">{t.welcome.body}</p>
        </Reveal>

        <div ref={row} className="mt-8 grid grid-cols-[1fr_1.02fr_1fr] items-start gap-2.5 sm:gap-4">
          {t.welcome.photos.map((p, i) => (
            <motion.div
              key={p.key}
              className={i === 1 ? '' : 'mt-3'}
              initial={{ opacity: 0, y: reduce ? 0 : 60 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="wl-par group overflow-hidden rounded-[3px]">
                <PhotoSlot src={p.src} alt={p.alt} tone={p.tone} width={3} height={i === 1 ? 4.6 : 4.2} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
