import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react'
import { useReducedMotion, useInView } from 'motion/react'
import { PhotoSlot } from '../components/PhotoSlot'
import { Reveal } from '../components/Reveal'
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from '../components/Icons'
import { useLanguage } from '../context/LanguageContext'

const ImageLightbox = lazy(() => import('../components/ImageLightbox').then((m) => ({ default: m.ImageLightbox })))

export function Welcome() {
  const { t, locale } = useLanguage()
  const reduce = useReducedMotion()
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

  // Track active slide accurately across any viewport width
  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const cards = Array.from(container.children) as HTMLElement[]
    if (cards.length === 0) return

    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    let closestIdx = 0
    let minDistance = Infinity

    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const distance = Math.abs(containerCenter - cardCenter)
      if (distance < minDistance) {
        minDistance = distance
        closestIdx = idx
      }
    })

    setActiveSlide(closestIdx)
  }, [])

  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const card = container.children[index] as HTMLElement | undefined
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      setActiveSlide(index)
    }
  }

  const handlePrev = () => {
    const nextIndex = activeSlide > 0 ? activeSlide - 1 : t.welcome.photos.length - 1
    scrollToSlide(nextIndex)
  }

  const handleNext = () => {
    const nextIndex = activeSlide < t.welcome.photos.length - 1 ? activeSlide + 1 : 0
    scrollToSlide(nextIndex)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
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

      {/* RESPONSIVE CAROUSEL: Single strictly horizontal row with smooth scroll snap */}
      <div className="relative mx-auto mt-8 sm:mt-12 max-w-[1240px] px-2 sm:px-6 lg:px-8">
        {/* Floating previous arrow button (visible on tablet/desktop) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label={t.welcome.prevPhoto}
          className="hidden sm:flex absolute -left-2 md:left-1 lg:left-3 top-[44%] -translate-y-1/2 z-20 h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-sand/95 backdrop-blur-md border border-olive-deep/20 text-olive-deep shadow-[0_4px_16px_rgba(74,68,54,0.16)] transition-all duration-200 hover:bg-olive-deep hover:text-sand hover:border-olive-deep hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        {/* Floating next arrow button (visible on tablet/desktop) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label={t.welcome.nextPhoto}
          className="hidden sm:flex absolute -right-2 md:right-1 lg:right-3 top-[44%] -translate-y-1/2 z-20 h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-sand/95 backdrop-blur-md border border-olive-deep/20 text-olive-deep shadow-[0_4px_16px_rgba(74,68,54,0.16)] transition-all duration-200 hover:bg-olive-deep hover:text-sand hover:border-olive-deep hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        {/* Horizontal scroll track: strictly single horizontal row (flex-nowrap) */}
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={t.welcome.carouselLabel}
          data-lenis-prevent
          className="no-scrollbar flex flex-nowrap items-center w-full overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-5 lg:gap-6 px-[11vw] sm:px-12 lg:px-14 py-3 scroll-smooth focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 rounded-lg"
        >
          {t.welcome.photos.map((p, i) => (
            <div
              key={p.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${t.welcome.photos.length}`}
              className="snap-center shrink-0 w-[78vw] max-w-[310px] sm:w-[280px] md:w-[300px] lg:w-[320px] transition-transform duration-300"
            >
              <button
                type="button"
                onClick={() => openPhoto(i)}
                aria-label={`${t.welcome.expandPhoto}: ${p.alt}`}
                className="group relative block w-full overflow-hidden rounded-[8px] border border-[#dcd4c5]/80 bg-sand text-left shadow-[0_6px_22px_rgba(74,68,54,0.10)] transition-all duration-300 hover:border-gold/60 hover:shadow-[0_12px_32px_rgba(74,68,54,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold active:scale-[0.99] cursor-pointer"
              >
                <PhotoSlot src={p.src} alt={p.alt} tone={p.tone} width={3} height={4.2} />

                {/* Subtle hover gradient and expand badge */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-caps tracking-[0.18em] text-[#f8f1e2] backdrop-blur-sm opacity-0 transition-all duration-300 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 border border-white/20">
                  <ExpandIcon className="h-3 w-3 text-gold" />
                  <span>{t.welcome.expand}</span>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Carousel controls bar: Mobile arrows + indicator dots + slide counter */}
        <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            {/* Mobile prev button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label={t.welcome.prevPhoto}
              className="flex sm:hidden h-10 w-10 items-center justify-center rounded-full bg-sand/90 border border-olive-deep/20 text-olive-deep shadow-sm active:scale-90 touch-manipulation cursor-pointer"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {/* Indicator dots */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-[80vw] py-1 no-scrollbar" role="tablist" aria-label={t.welcome.navLabel}>
              {t.welcome.photos.map((p, i) => (
                <button
                  key={p.key}
                  type="button"
                  role="tab"
                  aria-selected={activeSlide === i}
                  aria-label={`${t.welcome.viewPhoto} ${i + 1}`}
                  onClick={() => scrollToSlide(i)}
                  className="group flex min-h-[44px] min-w-[28px] sm:min-w-[32px] items-center justify-center p-1 touch-manipulation focus-visible:outline-none cursor-pointer"
                >
                  <span
                    className={`h-2 transition-all duration-300 rounded-full ${
                      activeSlide === i ? 'w-7 sm:w-8 bg-olive-deep' : 'w-2 bg-olive-deep/30 group-hover:bg-olive-deep/60'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Mobile next button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label={t.welcome.nextPhoto}
              className="flex sm:hidden h-10 w-10 items-center justify-center rounded-full bg-sand/90 border border-olive-deep/20 text-olive-deep shadow-sm active:scale-90 touch-manipulation cursor-pointer"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Slide counter */}
          <span className="font-caps text-[11px] tracking-[0.24em] text-ink/60">
            {String(activeSlide + 1).padStart(2, '0')} / {String(t.welcome.photos.length).padStart(2, '0')}
          </span>
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
