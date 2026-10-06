import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { PinIcon } from '../components/Icons'
import { PillButton } from '../components/PillButton'
import { PolaroidCard } from '../components/PolaroidCard'
import { PostcardCard } from '../components/PostcardCard'
import { Reveal } from '../components/Reveal'
import { SectionTitle } from '../components/SectionTitle'
import { useLanguage } from '../context/LanguageContext'
import { gsap } from '../lib/scroll'

const LAYOUT = [
  { cls: 'left-[2%] top-[3%] w-[41%]', rotate: -8 },
  { cls: 'left-[25%] top-[25%] w-[39%]', rotate: -3 },
  { cls: 'left-[53%] top-[9%] w-[43%]', rotate: 9 },
  { cls: 'left-[50%] top-[46%] w-[42%]', rotate: -9 },
]

export function Medellin() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const m = t.medellin
  const table = useRef<HTMLDivElement>(null)
  const [order, setOrder] = useState([1, 2, 3, 4])
  const bringFront = (i: number) => setOrder((o) => o.map((z, k) => (k === i ? Math.max(...o) + 1 : z)))

  useEffect(() => {
    if (reduce || !table.current) return
    const tw = gsap.fromTo(table.current, { yPercent: 3 }, {
      yPercent: -3, ease: 'none',
      scrollTrigger: { trigger: table.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    return () => { tw.scrollTrigger?.kill(); tw.kill() }
  }, [reduce])

  return (
    <section className="overflow-hidden bg-sand pb-20 pt-14" aria-label={`${m.kicker} ${m.title.initial}${m.title.rest}`}>
      <div className="mx-auto max-w-[560px] px-5 text-center">
        <Reveal><p className="label !text-[13px] !tracking-[0.3em] text-olive-deep">{m.kicker}</p></Reveal>
        <SectionTitle initial={m.title.initial} rest={m.title.rest} size="lg" color="text-olive-deep" className="-mt-1" />
        <Reveal><p className="label -mt-1 !text-[10px] text-gold">{m.sub}</p></Reveal>

        <div ref={table} className="relative mx-auto mt-6 w-full" style={{ aspectRatio: '1 / 1.42' }}>
          {m.polaroids.map((p, i) => (
            <PolaroidCard key={p.key} photo={p} rotate={LAYOUT[i].rotate} className={LAYOUT[i].cls} delay={i * 0.18}
              z={order[i]} onFront={() => bringFront(i)} constraintsRef={table} />
          ))}
          <PostcardCard className="-left-[2%] top-[62%] z-[3] w-[58%]" />
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <PinIcon width={30} height={30} className="text-olive-deep" />
          <PillButton variant="green" href={m.mapsUrl}>{m.mapsLabel}</PillButton>
        </div>
      </div>
    </section>
  )
}
