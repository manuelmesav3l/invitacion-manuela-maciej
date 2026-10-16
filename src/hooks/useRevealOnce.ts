import { useEffect, useState, type RefObject } from 'react'

/**
 * True once any part of `ref` has been inside the viewport (one-shot).
 * IntersectionObserver is the primary signal, but a scroll/resize/pageshow check backs it up so a missed
 * or delayed observer callback (mobile Safari, bfcache restore, collapsing toolbars) can never leave a block hidden.
 */
export function useRevealOnce(ref: RefObject<HTMLElement | null>, bottomMargin = 0.1) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    const visible = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      return r.bottom > 0 && r.top < vh * (1 - bottomMargin)
    }
    const check = () => { if (visible()) setShown(true) }
    if (visible()) { setShown(true); return }

    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShown(true) }, { rootMargin: `0px 0px -${bottomMargin * 100}% 0px` })
    io.observe(el)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    window.addEventListener('pageshow', check)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      window.removeEventListener('pageshow', check)
    }
  }, [ref, shown, bottomMargin])

  return shown
}
