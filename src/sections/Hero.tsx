import { asset } from '../lib/asset'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { Flourish } from '../components/Ornaments'
import { RsvpButton } from '../components/RsvpButton'
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
    <section ref={sectionRef} className="relative w-full bg-cream-light min-h-[100svh] flex items-center justify-center py-2 sm:py-10 px-1 sm:px-4 overflow-hidden" aria-label={t.hero.ariaCouple}>
      {/* Gazebo illustration: Monumental scale, shifted left to bleed onto the screen edge */}
      <div className="hidden lg:flex left-[-10%] xl:left-[-12%] 2xl:left-[-14%] bottom-0 absolute z-0 pointer-events-none w-[clamp(480px,58vw,1020px)] max-h-[100vh] select-none items-end justify-start">
        <img
          src={asset("assets/gazebo-full.webp")}
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
            src={asset("assets/hero-couple-transparent.webp")}
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
            src={asset("assets/hero-names.svg")}
            alt=""
            aria-hidden="true"
            className="absolute left-[5.5%] top-[30%] w-[88%] lg:left-[30.7%] lg:top-[31.9%] lg:w-[39.5%] h-auto pointer-events-none"
            decoding="async"
          />

          {/* Date (SVG with rules) */}
          {locale === 'pl' ? (
            <svg
              viewBox="0 0 328.83 71.25"
              aria-label={t.hero.dateText}
              className="absolute left-1/2 top-[79.6%] -translate-x-1/2 w-[46%] lg:top-[79.4%] lg:w-[21.1%] h-auto pointer-events-none select-none overflow-visible"
            >
              <line x1="0" y1="0.5" x2="328.83" y2="0.5" stroke="#3F5A2E" strokeWidth="1" />
              <text
                x="50%"
                y="51%"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#3F5A2E"
                fontFamily="BelfastSerial, 'Belfast Serial', serif"
                fontSize="47"
                letterSpacing="0.035em"
              >
                {t.hero.dateText}
              </text>
              <line x1="0" y1="70.75" x2="328.83" y2="70.75" stroke="#3F5A2E" strokeWidth="1" />
            </svg>
          ) : (
            <img
              src={asset("assets/hero-date.svg")}
              alt={`${t.hero.day} ${t.hero.month} ${t.hero.year}`}
              className="absolute left-1/2 top-[79.6%] -translate-x-1/2 w-[46%] lg:top-[79.4%] lg:w-[21.1%] h-auto pointer-events-none"
              decoding="async"
            />
          )}

          <Flourish className="absolute left-1/2 top-[88.4%] -translate-x-1/2 w-[17.5%] lg:top-[87.4%] lg:w-[8%] text-olive-deep pointer-events-none" />

          <RsvpButton onClick={onRsvp} className="absolute left-1/2 top-[93.2%] -translate-x-1/2" />
        </motion.div>
      </div>
    </section>
  )
}
