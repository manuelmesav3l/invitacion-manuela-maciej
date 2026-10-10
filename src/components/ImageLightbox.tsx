import { useEffect, useRef, useCallback } from 'react'
import { lockScroll } from '../lib/scroll'
import { useLanguage } from '../context/LanguageContext'
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons'

export interface LightboxImage {
  src: string
  alt: string
  tone?: string[]
}

interface Props {
  images: LightboxImage[]
  currentIndex: number
  onIndexChange: (index: number) => void
  open: boolean
  onClose: () => void
}

export function ImageLightbox({ images, currentIndex, onIndexChange, open, onClose }: Props) {
  const { t } = useLanguage()
  const lb = t.lightbox
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handlePrev = useCallback(() => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1)
  }, [currentIndex, images.length, onIndexChange])

  const handleNext = useCallback(() => {
    onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0)
  }, [currentIndex, images.length, onIndexChange])

  // Lock scroll and handle keyboard navigation
  useEffect(() => {
    if (!open) return

    lockScroll(true)
    const prevActive = document.activeElement as HTMLElement | null

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      lockScroll(false)
      prevActive?.focus?.()
    }
  }, [open, onClose, handlePrev, handleNext])

  // Mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 45 // 45px swipe threshold

    if (diff > minSwipeDistance) {
      handleNext()
    } else if (diff < -minSwipeDistance) {
      handlePrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const current = images[currentIndex] || images[0]

  return (
    <>
      {open && current && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={lb.dialogLabel}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/92 p-4 text-[#f8f1e2] select-none backdrop-blur-md"
          data-lenis-prevent
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header bar: counter and close button */}
          <div className="z-20 flex w-full max-w-4xl items-center justify-between pt-2">
            <span className="font-caps text-[12px] tracking-[0.22em] text-[#e8d7c5]/80">
              {currentIndex + 1} / {images.length}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label={lb.close}
              className="flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-white/10 text-[#f8f1e2] hover:bg-gold/80 hover:text-black touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Main stage with backdrop tap to close */}
          <div className="relative flex flex-1 w-full max-w-4xl items-center justify-center my-auto">
            {/* Click outside backdrop */}
            <div
              className="absolute inset-0 cursor-zoom-out"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Previous button (visible on mobile and desktop) */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                aria-label={lb.prev}
                className="absolute left-2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/60 text-[#f8f1e2] border border-white/15 hover:border-gold hover:bg-gold hover:text-black touch-manipulation"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
            )}

            {/* Active image, no animation */}
            <div
              className="relative z-10 flex flex-col items-center justify-center max-h-[76vh] max-w-full cursor-zoom-out"
              onClick={onClose}
            >
              <img
                src={current.src}
                alt={current.alt}
                className="max-h-[72vh] max-w-[94vw] sm:max-w-[80vw] object-contain rounded-md border border-white/10"
              />
            </div>

            {/* Next button (visible on mobile and desktop) */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                aria-label={lb.next}
                className="absolute right-2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/60 text-[#f8f1e2] border border-white/15 hover:border-gold hover:bg-gold hover:text-black touch-manipulation"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Footer bar: caption & indicator dots */}
          <div className="z-20 flex flex-col items-center gap-3 w-full max-w-2xl pb-3 text-center">
            {current.alt && (
              <p className="font-serif italic text-[14px] sm:text-[15px] text-[#e8d7c5]/90 max-w-[90%] line-clamp-2">
                {current.alt}
              </p>
            )}

            {/* Indicator dots with accessible touch targets */}
            {images.length > 1 && (
              <div className="flex items-center gap-1 sm:gap-2" role="tablist" aria-label={lb.selector}>
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={idx === currentIndex}
                    aria-label={`${lb.goTo} ${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onIndexChange(idx)
                    }}
                    className="group flex min-h-[44px] min-w-[36px] items-center justify-center p-2 touch-manipulation focus-visible:outline-none"
                  >
                    <span
                      className={`h-2.5 duration-300 rounded-full ${
                        idx === currentIndex
                          ? 'w-7 bg-gold'
                          : 'w-2.5 bg-white/30 group-hover:bg-white/60'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
