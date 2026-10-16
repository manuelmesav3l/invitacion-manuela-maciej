import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Lenis smooth scroll driven by GSAP's ticker with visibility lifecycle to minimize RAM and CPU cycles. */
export function initScroll() {
  if (prefersReducedMotion()) return () => {}
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)

  let isRunning = true
  const tick = (time: number) => {
    if (!isRunning) return
    lenis?.raf(time * 1000)
  }

  // Halt animation frame consumption when user switches tabs to free CPU/RAM
  const handleVisibility = () => {
    if (document.hidden) {
      isRunning = false
      lenis?.stop()
    } else {
      isRunning = true
      lenis?.start()
    }
  }

  document.addEventListener('visibilitychange', handleVisibility)
  gsap.ticker.add(tick)
  // Enable lag smoothing (500ms max, 33ms target) so GSAP throttles gracefully under CPU/memory pressure
  gsap.ticker.lagSmoothing(500, 33)

  return () => {
    document.removeEventListener('visibilitychange', handleVisibility)
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export const lockScroll = (lock: boolean) => {
  if (lock) lenis?.stop()
  else lenis?.start()
  document.body.style.overflow = lock ? 'hidden' : ''
}

export function scrollToTarget(target: string | HTMLElement, options?: { offset?: number }) {
  if (lenis) {
    lenis.scrollTo(target, options)
  } else {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    el?.scrollIntoView({ behavior: 'smooth' })
  }
}

export { gsap, ScrollTrigger }
