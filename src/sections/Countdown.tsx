import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { t } from '../content/content'
import { remaining, type Remaining } from '../lib/countdown'

const pad = (n: number, len = 2) => String(n).padStart(len, '0')

function Digits({ value, len, animate }: { value: number; len: number; animate: boolean }) {
  const s = pad(value, len)
  return (
    <span className="relative inline-flex overflow-hidden" aria-hidden="true">
      {s.split('').map((ch, i) => (
        <span key={i} className="relative inline-block min-w-[0.55em] text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={ch}
              className="block"
              initial={animate ? { y: '80%', opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              exit={animate ? { y: '-80%', opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

export function Countdown() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const [real, setReal] = useState<Remaining>(remaining)
  const [shown, setShown] = useState<Remaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [counted, setCounted] = useState(false)

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null
    const start = () => {
      if (!id) id = setInterval(() => setReal(remaining()), 1000)
    }
    const stop = () => {
      if (id) {
        clearInterval(id)
        id = null
      }
    }

    const onVisibility = () => {
      if (document.hidden) {
        stop()
      } else {
        setReal(remaining())
        start()
      }
    }

    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (!inView) return
    if (reduce) return
    let raf = 0
    const start = performance.now(), dur = 1400, target = remaining()
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3)
      setShown({ days: Math.round(target.days * e), hours: Math.round(target.hours * e), minutes: Math.round(target.minutes * e), seconds: Math.round(target.seconds * e) })
      if (p < 1) raf = requestAnimationFrame(step)
      else setCounted(true)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce])

  const done = counted || !!reduce
  const v = done ? real : shown
  const cols: [number, number, string][] = [[v.days, 2, t.countdown.days], [v.hours, 2, t.countdown.hours], [v.minutes, 2, t.countdown.minutes], [v.seconds, 2, t.countdown.seconds]]

  return (
    <section className="bg-sand pb-14 pt-16 sm:pb-20 sm:pt-20" aria-label="Countdown">
      <div ref={ref} className="mx-auto max-w-[920px] px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="leading-none"
        >
          <img src="/assets/countdown-title.png" alt={t.countdown.title} width={746} height={204} className="mx-auto h-auto w-[min(86vw,460px)]" decoding="async" />
        </motion.h2>
        <p className="sr-only" aria-live="polite">{`${remaining().days} days until the wedding`}</p>
        <div className="mx-auto mt-8 grid w-full max-w-[880px] grid-cols-2 gap-y-8 text-olive-deep sm:mt-12 sm:grid-cols-4 sm:gap-y-0">
          {cols.map(([n, len, label], i) => (
            <div key={label} className={`px-2 ${i % 2 === 1 ? 'border-l border-olive-deep/40' : ''} ${i > 0 ? 'sm:border-l sm:border-olive-deep/40' : ''}`}>
              <div className="font-serif text-[clamp(56px,16vw,112px)] font-medium leading-none tabular-nums tracking-[0.02em]"><Digits value={n} len={len} animate={done} /></div>
              <div className="label mt-4 !text-[clamp(11px,1.6vw,15px)] !tracking-[0.3em] text-gold">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
