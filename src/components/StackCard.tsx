import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Stacked-card scroll: the card sticks once its content is fully seen
 * (top = viewport − height, capped at 0) and the next card slides over it,
 * with rounded top corners and an upward halo shadow.
 */
export function StackCard({ children, first = false }: { children: ReactNode; first?: boolean }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    const measure = () => {
      if (first) {
        setTop(0)
        return
      }
      setTop(Math.min(0, Math.round(window.innerHeight - el.offsetHeight)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [first, reduce])

  if (reduce) return <>{children}</>

  return (
    <div
      ref={ref}
      style={{ top: first ? 0 : top }}
      className={`sticky ${first ? 'top-0 bg-cream-light' : 'rounded-t-[28px] shadow-[0_-18px_48px_-12px_rgba(63,90,46,0.28)] sm:rounded-t-[40px]'} overflow-hidden`}
    >
      {children}
    </div>
  )
}
