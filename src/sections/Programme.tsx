import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { BusSketch, DiscoSketch, SparklerSketch } from '../components/Icons'
import { TimelineNode } from '../components/TimelineNode'
import { t } from '../content/content'
import { gsap } from '../lib/scroll'

const POS = ['12%', '31%', '50%', '69%', '88%']

export function Programme() {
  const reduce = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    if (reduce) {
      gsap.set(root.current.querySelectorAll('.tl-node,.tl-label,.tl-icon,.tl-line'), { opacity: 1, scaleX: 1 })
      return
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.tl-stage', start: 'top 75%', end: 'bottom 45%', scrub: 0.6 } })
      tl.fromTo('.tl-line', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none', transformOrigin: 'left center' }, 0)
      tl.fromTo('.tl-arrow', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.02)
      gsap.utils.toArray<HTMLElement>('.tl-item').forEach((el, i) => {
        const at = parseFloat(POS[i]) / 100 - 0.03
        tl.fromTo(el.querySelector('.tl-node'), { scale: 0 }, { scale: 1, duration: 0.06, ease: 'back.out(3)' }, at)
        tl.fromTo(el.querySelector('.tl-label'), { opacity: 0, y: i % 2 ? -10 : 10 }, { opacity: 1, y: 0, duration: 0.08 }, at + 0.01)
      })
      const icons: [string, number][] = [['.tl-bus', 0.14], ['.tl-disco', 0.7], ['.tl-spark', 0.86]]
      icons.forEach(([sel, at]) => tl.fromTo(sel, { opacity: 0, scale: 0.5, rotate: -18 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.1, ease: 'back.out(2)' }, at))
    }, root)
    return () => ctx.revert()
  }, [reduce])

  return (
    <section className="bg-cream pb-16 pt-14" aria-label="Wedding programme" ref={root}>
      <div className="mx-auto max-w-[560px] px-3 text-center">
        <h2 className="m-0 font-serif font-normal leading-[0.95] text-olive-deep" aria-label="Wedding programme">
          <span aria-hidden="true" className="block font-script text-[clamp(64px,20vw,96px)] italic">{t.programme.title.script}</span>
          <span aria-hidden="true" className="-mt-3 block text-[clamp(36px,11vw,52px)] font-medium tracking-[0.02em]">{t.programme.title.rest}</span>
        </h2>

        <div className="tl-stage relative mx-auto mt-4 h-[280px] w-full">
          <BusSketch className="tl-icon tl-bus absolute left-[2%] top-[34px] w-[24%]" />
          <DiscoSketch className="tl-icon tl-disco absolute right-[8%] top-[4px] w-[22%]" style={{ animation: reduce ? undefined : 'disco-spin 24s linear infinite' }} />
          <SparklerSketch className="tl-icon tl-spark absolute bottom-[8px] right-[3%] w-[24%]" />

          <div className="absolute inset-x-[3%] top-1/2 h-0">
            <div className="tl-line absolute inset-x-[2%] top-0 h-px bg-olive-deep" />
            <svg className="tl-arrow absolute -left-0 -top-[5px]" width="10" height="11" viewBox="0 0 10 11" fill="none" stroke="#3F5A2E" strokeWidth="1.4"><path d="M8 1 2 5.5 8 10" /></svg>
            <svg className="tl-arrow absolute -right-0 -top-[5px]" width="10" height="11" viewBox="0 0 10 11" fill="none" stroke="#3F5A2E" strokeWidth="1.4"><path d="M2 1l6 4.5L2 10" /></svg>
            {t.programme.events.map((e, i) => <TimelineNode key={e.key} label={e.label} time={e.time} side={e.side} left={POS[i]} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
