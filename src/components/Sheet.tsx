import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { lockScroll } from '../lib/scroll'
import { CloseIcon } from './Icons'

interface Props { open: boolean; onClose: () => void; label: string; children: ReactNode; tall?: boolean; closeLabel?: string; tone?: 'cream' | 'olive' }

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Bottom-sheet dialog: focus trap, Esc to close, scroll lock, focus restore. */
export function Sheet({ open, onClose, label, children, tall, closeLabel = 'Close', tone = 'cream' }: Props) {
  const reduce = useReducedMotion()
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    lockScroll(true)
    const raf = requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !panel.current) return
      const els = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!els.length) return
      const first = els[0], last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      lockScroll(false)
      prev?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-[#3a3324]/40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} aria-hidden="true"
          />
          <motion.div
            ref={panel}
            role="dialog" aria-modal="true" aria-labelledby={titleId}
            className={`relative w-full max-w-[560px] overflow-y-auto overscroll-contain rounded-t-[28px] shadow-2xl ${tone === 'olive' ? 'bg-[#4a5443]' : 'bg-cream'} ${tall ? 'h-[96dvh]' : 'max-h-[85dvh]'}`}
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'tween', duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
          >
            <span id={titleId} className="sr-only">{label}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className={`absolute right-3 top-3 sm:right-4 sm:top-4 z-10 grid h-12 w-12 min-h-[48px] min-w-[48px] place-items-center rounded-full ${tone === 'olive' ? 'text-cream-light hover:bg-cream-light/15' : 'text-olive-deep hover:bg-sand/60'} active:scale-90 transition-transform touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold`}
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
