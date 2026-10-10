import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useRevealOnce } from '../hooks/useRevealOnce'
import { PolaroidCard } from './PolaroidCard'
import { PostcardCard } from './PostcardCard'
import { useLanguage } from '../context/LanguageContext'
import { gsap } from '../lib/scroll'

const LAYOUT = [
  { cls: 'left-[2%] top-[2%] w-[42%]', rotate: -7 },
  { cls: 'left-[53%] top-[4%] w-[43%]', rotate: 8 },
  { cls: 'left-[18%] top-[23%] w-[43%]', rotate: -4 },
  { cls: 'left-[52%] top-[41%] w-[42%]', rotate: -8 },
  { cls: 'left-[46%] top-[63%] w-[42%]', rotate: 6 },
]

/** Fixed polaroid collage + postcard in curated editorial layout (third tab of the Medellín guide). */
export function MedellinGallery() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const table = useRef<HTMLDivElement>(null)
  const show = useRevealOnce(table)

  useEffect(() => {
    if (reduce || !table.current) return
    const tw = gsap.fromTo(table.current, { yPercent: 3 }, {
      yPercent: -3, ease: 'none',
      scrollTrigger: { trigger: table.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    return () => { tw.scrollTrigger?.kill(); tw.kill() }
  }, [reduce])

  return (
    <div ref={table} className="relative mx-auto mt-6 w-full" style={{ aspectRatio: '1 / 1.56' }}>
      {t.medellin.polaroids.map((p, i) => (
        <PolaroidCard
          key={p.key}
          photo={p}
          rotate={LAYOUT[i].rotate}
          className={LAYOUT[i].cls}
          delay={i * 0.16}
          z={i + 1}
          show={show}
        />
      ))}
      <PostcardCard className="-left-[2%] top-[61%] z-[2] w-[54%]" show={show} />
    </div>
  )
}

