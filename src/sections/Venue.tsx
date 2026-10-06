import { asset } from '../lib/asset'
import { motion, useReducedMotion } from 'motion/react'
import { PillButton } from '../components/PillButton'
import { Reveal } from '../components/Reveal'
import { useLanguage } from '../context/LanguageContext'

export function Venue({ onClimate }: { onClimate: () => void }) {
  const { t, locale } = useLanguage()
  const reduce = useReducedMotion()
  const v = t.venue
  return (
    <section className="bg-sand pb-16 pt-10 sm:pt-14" aria-label={`${v.title.initial}${v.title.rest}`}>
      <div className="mx-auto max-w-[680px] px-4 sm:px-6 text-center">
        <h2 className="sr-only">{`${v.title.initial}${v.title.rest} — Casa Primavera`}</h2>

        <motion.img
          src={asset("assets/venue-composite.webp")}
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

        <div className="relative mt-10 h-[215px] sm:h-[235px]">
          <div className="absolute left-[12%] sm:left-[16%] top-0 flex flex-col items-center gap-3">
            <img
              src={asset("assets/venue-icon-pin.webp")}
              width={162}
              height={232}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="blend-multiply h-16 sm:h-[76px] w-auto object-contain select-none transition-transform duration-300 hover:scale-105"
            />
            <PillButton href={v.mapsUrl} delay={0.05}>{v.mapsLabel}</PillButton>
          </div>
          <div className="absolute right-[4%] sm:right-[6%] top-[98px] sm:top-[108px] flex flex-col items-center gap-3">
            <img
              src={asset("assets/venue-icon-climate.webp")}
              width={284}
              height={250}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="blend-multiply h-16 sm:h-[76px] w-auto object-contain select-none transition-transform duration-300 hover:scale-105"
            />
            <PillButton onClick={onClimate} ariaHaspopup="dialog" delay={0.2}>{v.climateLabel}</PillButton>
          </div>
        </div>

        <Reveal className="mt-12 flex flex-col items-center text-olive-deep">
          <p className="label !text-[clamp(11px,2.8vw,13px)] !tracking-[0.36em] text-olive-deep select-none">
            {v.weekday}
          </p>

          {locale === 'pl' ? (
            <div className="my-3 w-[clamp(220px,66vw,290px)] max-w-full border-y border-olive-deep/75 py-2 text-center select-none">
              <span className="block font-belfast text-[clamp(22px,6.5vw,34px)] tracking-[0.12em] text-olive-deep leading-none">
                {v.dateText}
              </span>
            </div>
          ) : (
            <img
              src={asset("assets/hero-date.svg")}
              alt={`${t.hero.day} ${t.hero.month} ${t.hero.year}`}
              width={328}
              height={71}
              loading="lazy"
              decoding="async"
              className="my-3 w-[clamp(220px,66vw,290px)] max-w-full h-auto select-none pointer-events-none"
            />
          )}

          <p className="font-belfast text-[clamp(18px,4.8vw,22px)] tracking-[0.16em] text-olive-deep select-none">
            {v.time}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
