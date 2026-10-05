import { useEffect, useRef, useState } from 'react'
import { useReducedMotion, motion } from 'motion/react'
import { PhotoSlot } from '../components/PhotoSlot'
import { Reveal } from '../components/Reveal'
import { t } from '../content/content'
import { gsap } from '../lib/scroll'

const OFFSETS = [-6, 8, -6] // parallax yPercent: centre travels differently than the sides
const WORDS = ['Bienvenidos', 'Witamy']

export function Welcome() {
  const reduce = useReducedMotion()
  const row = useRef<HTMLDivElement>(null)

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Caligraphic typewriter animation alternating between "Bienvenidos" and "Witamy"
  useEffect(() => {
    if (reduce) return

    const currentWord = WORDS[currentWordIndex]
    let timer: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        // Natural handwriting pacing (slight variation for calligraphic feel)
        const delay = 125 + (displayText.length % 3 === 0 ? 35 : -15)
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        }, delay)
      } else {
        // Full word written: pause long enough for guests to read and appreciate
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, 2200)
      }
    } else {
      if (displayText.length > 0) {
        // Smooth and fluid erasing pace
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1))
        }, 65)
      } else {
        // Brief pause after erasing before starting the next greeting
        timer = setTimeout(() => {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % WORDS.length)
        }, 450)
      }
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, currentWordIndex, reduce])

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
    <section className="bg-sand pb-12 pt-8 sm:pb-16 sm:pt-10" aria-label="Welcome">
      <div className="mx-auto max-w-[620px] px-5 text-center">
        <Reveal>
          {/* Minimum height container to completely prevent Cumulative Layout Shift (CLS) */}
          <div className="flex min-h-[clamp(76px,24vw,120px)] items-center justify-center">
            <h2
              className="m-0 inline-flex items-center justify-center font-script text-[clamp(72px,22vw,112px)] font-normal leading-none text-olive-deep"
              style={{ transform: 'rotate(-2deg)' }}
              aria-label="Bienvenidos / Witamy"
            >
              <span className="sr-only">Bienvenidos — Witamy</span>
              <span aria-hidden="true" className="select-none tracking-tight">
                {reduce ? 'Bienvenidos' : (displayText || '\u00A0')}
              </span>
              {!reduce && (
                <span
                  aria-hidden="true"
                  className="animate-ink-cursor ml-1.5 inline-block h-[0.7em] w-[2px] translate-y-[2px] bg-gold/90 select-none"
                />
              )}
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {/* TODO_COPY: welcome paragraph lives in content.ts */}
          <p className="label mx-auto mt-3 max-w-[320px] !text-[11px] !leading-[2] text-ink">{t.welcome.body}</p>
        </Reveal>
      </div>

      {/* Expanded photo gallery container for superior editorial scale */}
      <div className="mx-auto max-w-[840px] px-4 sm:px-6">
        <div ref={row} className="mt-8 grid grid-cols-[1fr_1.06fr_1fr] items-start gap-3 sm:mt-12 sm:gap-5 lg:gap-6">
          {t.welcome.photos.map((p, i) => (
            <motion.div
              key={p.key}
              className={i === 1 ? '' : 'mt-4 sm:mt-6'}
              initial={{ opacity: 0, y: reduce ? 0 : 60 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="wl-par group overflow-hidden rounded-[4px] shadow-[0_4px_18px_rgba(74,68,54,0.08)]">
                <PhotoSlot src={p.src} alt={p.alt} tone={p.tone} width={3} height={i === 1 ? 4.5 : 4.1} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

