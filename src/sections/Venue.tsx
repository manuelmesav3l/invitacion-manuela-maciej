import { motion, useReducedMotion } from 'motion/react'
import { PinIcon, SunCloudIcon } from '../components/Icons'
import { PillButton } from '../components/PillButton'
import { Reveal } from '../components/Reveal'
import { t } from '../content/content'

export function Venue({ onClimate }: { onClimate: () => void }) {
  const reduce = useReducedMotion()
  const v = t.venue
  return (
    <section className="bg-sand pb-16 pt-10 sm:pt-14" aria-label="The venue">
      <div className="mx-auto max-w-[680px] px-4 sm:px-6 text-center">
        <h2 className="sr-only">The Venue — Casa Primavera</h2>

        <motion.img
          src="/assets/venue-composite.webp"
          width={1088}
          height={1464}
          alt={`${v.title.initial}${v.title.rest} — Casa Primavera`}
          loading="lazy"
          decoding="async"
          className="blend-multiply mx-auto w-full select-none"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* TODO_COPY: venue paragraph lives in content.ts */}
        <Reveal delay={0.1}><p className="label mx-auto mt-6 max-w-[320px] !text-[11px] !leading-[2] text-ink">{v.body}</p></Reveal>

        <div className="relative mt-9 h-[170px]">
          <div className="absolute left-[16%] top-0 flex flex-col items-center gap-2">
            <PinIcon width={30} height={30} className="text-gold" />
            <PillButton href={v.mapsUrl} delay={0.05}>{v.mapsLabel}</PillButton>
          </div>
          <div className="absolute right-[6%] top-[86px] flex flex-col items-center gap-2">
            <SunCloudIcon width={34} height={34} className="text-gold" />
            <PillButton onClick={onClimate} ariaHaspopup="dialog" delay={0.2}>{v.climateLabel}</PillButton>
          </div>
        </div>

        <Reveal className="mt-10 text-olive-deep">
          <p className="label !text-[13px] !tracking-[0.34em]">{v.weekday}</p>
          <div className="mx-auto my-2 w-[66%] max-w-[320px] whitespace-nowrap border-y border-olive-deep/60 py-1.5 font-serif text-[clamp(20px,6.2vw,30px)] tracking-[0.18em]">
            {`${t.hero.day}  ${t.hero.month} ${t.hero.year}`}
          </div>
          <p className="font-serif text-[22px] tracking-[0.25em]">{v.time}</p>
        </Reveal>
      </div>
    </section>
  )
}
