import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { Flourish, RsvpLogo } from '../components/Ornaments'
import { useLanguage } from '../context/LanguageContext'

export function Hero({ onRsvp }: { onRsvp: () => void }) {
  const { t, locale } = useLanguage()
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reduce || !sectionRef.current) return

    // Hero stays completely stationary (no movement on scroll)
    // and fades out smoothly into the background as the user scrolls.
    const fade = gsap.to(sectionRef.current, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: () => window.innerHeight * 0.75,
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    return () => {
      fade.scrollTrigger?.kill()
      fade.kill()
    }
  }, [reduce])

  return (
    <section ref={sectionRef} className="relative w-full bg-cream min-h-screen flex items-center justify-center py-2 sm:py-10 px-1 sm:px-4 overflow-hidden" aria-label={t.hero.ariaCouple}>
      {/* Gazebo illustration: Monumental scale, shifted left to bleed onto the screen edge */}
      <div className="hidden lg:flex left-[-10%] xl:left-[-12%] 2xl:left-[-14%] bottom-0 absolute z-0 pointer-events-none w-[clamp(480px,58vw,1020px)] max-h-[100vh] select-none items-end justify-start">
        <img
          src="/assets/gazebo-full.webp"
          width={1024}
          height={980}
          alt={t.hero.gazeboAlt}
          className="w-full h-auto max-h-[100vh] object-contain block object-left-bottom"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="relative w-full max-w-[1024px] 2xl:max-w-[1140px] mx-auto flex items-center justify-center z-10">
        <motion.div
          ref={heroRef}
          className="hero-card-container relative mx-auto overflow-hidden select-none lg:overflow-visible"
          initial={reduce ? false : { opacity: 0.9, scale: 0.995 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Couple illustration with transparent background */}
          <img
            src="/assets/hero-couple-transparent.webp"
            width={1024}
            height={700}
            alt={`${t.couple.a} & ${t.couple.b} - ${t.hero.kicker}`}
            className="absolute left-[-61%] top-[-2.8%] h-auto w-[216.7%] max-w-none pointer-events-none lg:inset-0 lg:h-full lg:w-full lg:max-w-full lg:object-contain"
            fetchPriority="high"
            decoding="async"
          />

          {/* Top kicker */}
          <p className="absolute top-[3.2%] inset-x-0 text-center font-caps text-[clamp(10px,2.6vw,15px)] lg:top-[5.6%] lg:text-[clamp(11px,1.45vw,15px)] font-medium tracking-[0.32em] text-olive-deep pointer-events-none">
            {t.hero.kicker}
          </p>

          {/* Names lockup (SVG): positioned per the reference artboard */}
          <img
            src="/assets/hero-names.svg"
            alt=""
            aria-hidden="true"
            className="absolute left-[5.5%] top-[30%] w-[88%] lg:left-[30.7%] lg:top-[31.9%] lg:w-[39.5%] h-auto pointer-events-none"
            decoding="async"
          />

          {/* Date (SVG with rules) */}
          {locale === 'pl' ? (
            <div className="absolute left-[24%] top-[79.2%] w-[52%] lg:left-[39%] lg:top-[79.3%] lg:w-[23%] pointer-events-none border-y border-olive-deep py-[2px] sm:py-[3px] text-center">
              <span className="block font-belfast text-[clamp(13px,3vw,23px)] lg:text-[18px] tracking-[0.14em] text-olive-deep leading-tight whitespace-nowrap">
                {t.hero.dateText}
              </span>
            </div>
          ) : (
            <img
              src="/assets/hero-date.svg"
              alt={`${t.hero.day} ${t.hero.month} ${t.hero.year}`}
              className="absolute left-[27%] top-[79.6%] w-[46%] lg:left-[40%] lg:top-[79.4%] lg:w-[21.1%] h-auto pointer-events-none"
              decoding="async"
            />
          )}

          <Flourish className="absolute left-1/2 top-[88.4%] w-[17.5%] lg:left-[50.5%] lg:top-[87.4%] lg:w-[8%] -translate-x-1/2 text-olive-deep pointer-events-none" />

          {/* RSVP button with luxury hover interaction */}
          <button
            type="button"
            onClick={onRsvp}
            aria-label={t.hero.rsvpAria}
            className="group absolute left-1/2 top-[93.2%] w-[22%] lg:left-[50.5%] lg:top-[92%] lg:w-[10%] -translate-x-1/2 cursor-pointer p-1 -m-1 text-olive-deep transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105 hover:text-gold active:scale-95 active:text-[#937848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded select-none"
          >
            <RsvpLogo className="w-full h-auto block transition-all duration-300 drop-shadow-none group-hover:drop-shadow-[0_2px_10px_rgba(173,145,92,0.4)]" />

            {/* Hairline golden underline expanding smoothly on hover */}
            <span
              className="absolute -bottom-0.5 left-1/2 h-[1px] w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 scale-x-0 transition-all duration-400 ease-out group-hover:opacity-100 group-hover:scale-x-100 pointer-events-none"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
