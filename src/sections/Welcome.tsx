import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react'
import { useReducedMotion, useInView, motion } from 'motion/react'
import { PhotoSlot } from '../components/PhotoSlot'
import { Reveal } from '../components/Reveal'
import { useLanguage } from '../context/LanguageContext'
import { gsap } from '../lib/scroll'

const ImageLightbox = lazy(() => import('../components/ImageLightbox').then((m) => ({ default: m.ImageLightbox })))

const OFFSETS = [-6, 8, -6] // parallax yPercent: centre travels differently than the sides

export function Welcome() {
  const { t, locale } = useLanguage()
  const reduce = useReducedMotion()
  const row = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const headingContainerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headingContainerRef, { margin: '0px 0px -5% 0px' })

  // Alternating greetings: prioritises active language while celebrating both cultures
  const words = locale === 'pl' ? ['Witamy', 'Bienvenidos'] : ['Bienvenidos', 'Witamy']

  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Reset to primary word during render whenever user switches site language
  const [prevLocale, setPrevLocale] = useState(locale)
  if (prevLocale !== locale) {
    setPrevLocale(locale)
    setWordIndex(0)
    setDisplayText('')
    setIsDeleting(false)
  }

  // Carousel & Lightbox states
  const [activeSlide, setActiveSlide] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const currentWord = words[wordIndex % words.length]

  // Stabilized calligraphic typewriter: writes, pauses for reading, and smoothly erases in an alternating loop
  useEffect(() => {
    if (reduce || !isInView) return

    let timer: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        // Natural handwriting pacing (slight variation for calligraphic feel)
        const delay = 120 + (displayText.length % 3 === 0 ? 30 : -15)
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        }, delay)
      } else {
        // Full word written: pause long enough for guests to read and appreciate
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, 2300)
      }
    } else {
      if (displayText.length > 0) {
        // Fluid erasing pace
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1))
        }, 55)
      } else {
        // Brief pause after erasing before starting the next greeting
        timer = setTimeout(() => {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }, 400)
      }
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, currentWord, words.length, reduce, isInView])

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

  // Track active slide on mobile horizontal scroll
  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current) return
    const { scrollLeft, clientWidth } = carouselRef.current
    if (clientWidth === 0) return
    const slideWidth = clientWidth * 0.78
    const index = Math.round(scrollLeft / slideWidth)
    setActiveSlide(Math.max(0, Math.min(index, t.welcome.photos.length - 1)))
  }, [t.welcome.photos.length])

  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return
    const card = carouselRef.current.children[index] as HTMLElement | undefined
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      setActiveSlide(index)
    }
  }

  const openPhoto = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <section className="bg-sand pb-12 pt-8 sm:pb-16 sm:pt-10 overflow-hidden" aria-label={words.join(' / ')}>
      <div className="mx-auto max-w-[620px] px-5 text-center">
        <Reveal>
          {/* Minimum height container to completely prevent Cumulative Layout Shift (CLS) */}
          <div
            ref={headingContainerRef}
            className="flex min-h-[clamp(76px,24vw,120px)] items-center justify-center"
          >
            <h2
              className="m-0 inline-flex items-center justify-center font-script text-[clamp(72px,22vw,112px)] font-normal leading-none text-olive-deep"
              style={{ transform: 'rotate(-2deg)' }}
              aria-label={words.join(' / ')}
            >
              <span className="sr-only">Bienvenidos — Witamy</span>

              {reduce ? (
                <span aria-hidden="true" className="select-none tracking-tight">
                  {currentWord}
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="relative inline-grid grid-cols-1 grid-rows-1 place-items-start select-none tracking-tight"
                >
                  {/* Ghost layer: establishes the exact bounding box of the current word so letters don't shift */}
                  <span
                    className="col-start-1 row-start-1 invisible opacity-0 pointer-events-none select-none whitespace-nowrap"
                    aria-hidden="true"
                  >
                    {currentWord}
                  </span>

                  {/* Visible typing layer: starts at the exact left coordinate of the word, writing towards the right */}
                  <span
                    className="col-start-1 row-start-1 whitespace-nowrap inline-flex items-center"
                    aria-hidden="true"
                  >
                    <span>{displayText || '\u00A0'}</span>
                    <span
                      aria-hidden="true"
                      className="animate-ink-cursor ml-1.5 inline-block h-[0.72em] w-[2px] rounded-full bg-gold/90 shadow-[0_0_4px_rgba(173,145,92,0.4)] translate-y-[2px] select-none"
                    />
                  </span>
                </span>
              )}
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {/* TODO_COPY: welcome paragraph lives in content.ts */}
          <div className="mx-auto mt-3 max-w-[340px] space-y-2">
            {t.welcome.body.map((line) => <p key={line} className="label !text-[11px] !leading-[2] text-ink">{line}</p>)}
          </div>
        </Reveal>
      </div>

      {/* MOBILE: Horizontal swipeable carousel with expand button and indicators */}
      <div className="mt-8 block sm:hidden">
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="no-scrollbar flex w-full overflow-x-auto snap-x snap-mandatory gap-4 px-[11vw] py-2"
          role="region"
          aria-label={t.welcome.carouselLabel}
        >
          {t.welcome.photos.map((p, i) => (
            <div
              key={p.key}
              className="snap-center shrink-0 w-[78vw] max-w-[310px]"
            >
              <button
                type="button"
                onClick={() => openPhoto(i)}
                aria-label={`${t.welcome.expandPhoto}: ${p.alt}`}
                className="group relative w-full overflow-hidden rounded-[8px] bg-sand shadow-[0_6px_22px_rgba(74,68,54,0.12)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold active:scale-[0.98] transition-transform cursor-pointer"
              >
                <PhotoSlot src={p.src} alt={p.alt} tone={p.tone} width={3} height={4.2} />
              </button>
            </div>
          ))}
        </div>

        {/* Carousel indicators with accessible touch targets */}
        <div className="mt-2 flex items-center justify-center gap-1 sm:gap-2" role="tablist" aria-label={t.welcome.navLabel}>
          {t.welcome.photos.map((p, i) => (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={activeSlide === i}
              aria-label={`${t.welcome.viewPhoto} ${i + 1}`}
              onClick={() => scrollToSlide(i)}
              className="group flex min-h-[44px] min-w-[36px] items-center justify-center p-2 touch-manipulation focus-visible:outline-none"
            >
              <span
                className={`h-2.5 transition-all duration-300 rounded-full ${
                  activeSlide === i ? 'w-8 bg-olive-deep' : 'w-2.5 bg-olive-deep/30 group-hover:bg-olive-deep/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP / TABLET: Editorial 3-column parallax layout with click-to-expand */}
      <div className="mx-auto hidden max-w-[840px] px-4 sm:block sm:px-6">
        <div ref={row} className="mt-8 grid grid-cols-[1fr_1.06fr_1fr] items-start gap-3 sm:mt-12 sm:gap-5 lg:gap-6">
          {t.welcome.photos.map((p, i) => (
            <motion.div
              key={p.key}
              className={i === 1 ? '' : 'mt-4 sm:mt-6'}
              initial={{ opacity: 0, y: reduce ? 0 : 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => openPhoto(i)}
                aria-label={`${t.welcome.expandPhoto}: ${p.alt}`}
                className="cursor-zoom-in w-full text-left rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold group"
              >
                <div className="wl-par relative overflow-hidden rounded-[4px] shadow-[0_4px_18px_rgba(74,68,54,0.08)] transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                  <PhotoSlot src={p.src} alt={p.alt} tone={p.tone} width={3} height={i === 1 ? 4.5 : 4.1} />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal (code-split on demand) */}
      {lightboxOpen && (
        <Suspense fallback={null}>
          <ImageLightbox
            images={t.welcome.photos}
            currentIndex={lightboxIndex}
            onIndexChange={setLightboxIndex}
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
          />
        </Suspense>
      )}
    </section>
  )
}

