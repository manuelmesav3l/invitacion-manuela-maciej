import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { TimelineNode } from '../components/TimelineNode'
import { useLanguage } from '../context/LanguageContext'
import { gsap } from '../lib/scroll'

const POS = ['10%', '30%', '50%', '70%', '90%']

export function Programme() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    if (reduce) {
      gsap.set(root.current.querySelectorAll('.tl-node,.tl-label,.tl-icon,.tl-line,.tl-arrow'), { opacity: 1, scaleX: 1, scale: 1, y: 0, rotate: 0 })
      return
    }

    const ctx = gsap.context(() => {
      // Plays automatically to completion as soon as section enters view
      // Eliminates the scrub requirement so users see the entire timeline complete without excessive scrolling
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 75%',
          once: true,
        },
      })

      // 1. Line draws smoothly from left to right
      tl.fromTo(
        '.tl-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.95, ease: 'power2.out', transformOrigin: 'left center' },
        0
      )

      // 2. Left arrow appears right away; right arrow appears when line finishes
      tl.fromTo('.tl-arrow-left', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' }, 0.05)
      tl.fromTo('.tl-arrow-right', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, 0.88)

      // 3. Nodes and text labels reveal sequentially along the timeline path
      const items = gsap.utils.toArray<HTMLElement>('.tl-item')
      items.forEach((el, i) => {
        const at = 0.12 + i * 0.17
        tl.fromTo(
          el.querySelector('.tl-node'),
          { scale: 0 },
          { scale: 1, duration: 0.35, ease: 'back.out(2.5)' },
          at
        )
        tl.fromTo(
          el.querySelector('.tl-label'),
          { opacity: 0, y: i % 2 === 1 ? -8 : 8 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
          at + 0.04
        )
      })

      // 4. Vintage engraved icons float in at their corresponding milestones with breathing room
      // Shuttle Bus (milestone 1 - 10%)
      tl.fromTo(
        '.tl-bus',
        { opacity: 0, y: -14, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.6)' },
        0.18
      )
      // Disco Ball (milestone 4 - Party, 70%)
      tl.fromTo(
        '.tl-disco',
        { opacity: 0, y: -16, scale: 0.88, rotate: -12 },
        { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.8)' },
        0.62
      )
      // Sparklers (milestone 5 - Send Off, 90%)
      tl.fromTo(
        '.tl-spark',
        { opacity: 0, y: 16, scale: 0.88, rotate: 10 },
        { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.8)' },
        0.78
      )
    }, root)

    return () => ctx.revert()
  }, [reduce])

  return (
    <section className="bg-cream pb-16 pt-12 sm:pt-16" aria-label={t.programme.ariaLabel} ref={root}>
      <div className="mx-auto max-w-[620px] px-3 sm:px-4 text-center">
        <h2 className="m-0 font-serif font-normal leading-[0.95] text-olive-deep" aria-label={t.programme.ariaLabel}>
          <span aria-hidden="true" className="block font-script text-[clamp(64px,19vw,94px)] italic">{t.programme.title.script}</span>
          <span aria-hidden="true" className="-mt-2 sm:-mt-3 block text-[clamp(32px,10vw,48px)] font-medium tracking-[0.03em]">{t.programme.title.rest}</span>
        </h2>

        {/* Timeline Stage: generous height ensures icons and text labels never collide or overlap */}
        <div className="tl-stage relative mx-auto mt-6 sm:mt-8 h-[310px] sm:h-[340px] w-full">
          {/* Shuttle bus illustration: sits cleanly above Shuttle node without encroaching Ceremony */}
          <img
            src="/assets/programme-bus.webp"
            width={279}
            height={171}
            alt="Shuttle bus illustration"
            loading="lazy"
            decoding="async"
            className="blend-multiply tl-icon tl-bus absolute left-[0%] top-[44px] sm:top-[50px] w-[24%] sm:w-[22%] max-w-[130px] h-auto object-contain select-none pointer-events-none"
          />

          {/* Disco ball illustration: crowns Party node with comfortable clearance above the '3:00' text */}
          <img
            src="/assets/programme-disco.webp"
            width={280}
            height={271}
            alt="Disco ball illustration"
            loading="lazy"
            decoding="async"
            className="blend-multiply tl-icon tl-disco absolute left-[59%] sm:left-[59.5%] top-[6px] sm:top-[8px] w-[23%] sm:w-[21%] max-w-[115px] h-auto object-contain select-none pointer-events-none"
          />

          {/* Sparklers illustration: positioned under Send Off node with ample clearance below the '3:00' text */}
          <img
            src="/assets/programme-sparkler.webp"
            width={283}
            height={236}
            alt="Sparklers illustration"
            loading="lazy"
            decoding="async"
            className="blend-multiply tl-icon tl-spark absolute left-[88.4%] -translate-x-1/2 top-[calc(50%+45px)] sm:top-[calc(50%+51px)] w-[24%] sm:w-[22%] max-w-[125px] h-auto object-contain select-none pointer-events-none"
          />

          {/* Central Timeline axis and milestones */}
          <div className="absolute inset-x-[2%] top-1/2 h-0">
            <div className="tl-line absolute inset-x-[1.5%] top-0 h-px bg-olive-deep" />
            <svg className="tl-arrow tl-arrow-left absolute left-0 -top-[5px]" width="10" height="11" viewBox="0 0 10 11" fill="none" stroke="#3F5A2E" strokeWidth="1.4">
              <path d="M8 1 2 5.5 8 10" />
            </svg>
            <svg className="tl-arrow tl-arrow-right absolute right-0 -top-[5px]" width="10" height="11" viewBox="0 0 10 11" fill="none" stroke="#3F5A2E" strokeWidth="1.4">
              <path d="M2 1l6 4.5L2 10" />
            </svg>
            {t.programme.events.map((e, i) => (
              <TimelineNode key={e.key} label={e.label} time={e.time} side={e.side} left={POS[i]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
