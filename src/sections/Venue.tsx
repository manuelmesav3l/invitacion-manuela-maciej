import { asset } from '../lib/asset'
import { motion, useReducedMotion } from 'motion/react'
import { PillButton } from '../components/PillButton'
import { Reveal } from '../components/Reveal'
import { SectionTitle } from '../components/SectionTitle'
import { useLanguage } from '../context/LanguageContext'

export function Venue({ onClimate }: { onClimate: () => void }) {
  const { t, locale } = useLanguage()
  const reduce = useReducedMotion()
  const v = t.venue
  return (
    <section className="bg-sand pb-16 pt-10 sm:pt-14" aria-label={`${v.title.initial}${v.title.rest}`}>
      <div className="mx-auto max-w-[680px] px-4 sm:px-6 text-center">
        <h2 className="sr-only">{`${v.title.initial}${v.title.rest} — Casa Primavera`}</h2>

        {/* EN artwork carries its own 'THE VENUE' lettering; PL uses the same art without it plus a live title. */}
        {!v.hasBakedTitle && (
          <SectionTitle initial={v.title.initial} rest={v.title.rest} size="lg" className="mb-2" />
        )}
        <motion.img
          src={asset(v.hasBakedTitle ? 'assets/venue-composite-a.webp' : 'assets/venue-composite-notitle-a.webp')}
          width={1088}
          height={v.hasBakedTitle ? 1464 : 1134}
          alt={`${v.title.initial}${v.title.rest} — Casa Primavera`}
          loading="lazy"
          decoding="async"
          className="mx-auto w-full select-none"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        <Reveal delay={0.1}>
          <div className="mx-auto mt-6 max-w-[380px] space-y-3">
            {v.body.map((line) => <p key={line} className="label !text-[11px] !leading-[2] text-ink">{line}</p>)}
          </div>
        </Reveal>

        <div className="relative mt-10 h-[215px] sm:h-[235px]">
          <div className="absolute left-[12%] sm:left-[16%] top-0 flex flex-col items-center gap-3">
            <img
              src={asset("assets/venue-icon-pin-alpha.webp")}
              width={162}
              height={232}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="h-16 sm:h-[76px] w-auto object-contain select-none transition-transform duration-300 hover:scale-105"
            />
            <PillButton href={v.mapsUrl} delay={0.05}>{v.mapsLabel}</PillButton>
          </div>
          <div className="absolute right-[4%] sm:right-[6%] top-[98px] sm:top-[108px] flex flex-col items-center gap-3">
            <img
              src={asset("assets/venue-icon-climate-alpha.webp")}
              width={284}
              height={250}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="h-16 sm:h-[76px] w-auto object-contain select-none transition-transform duration-300 hover:scale-105"
            />
            <PillButton onClick={onClimate} ariaHaspopup="dialog" delay={0.2}>{v.climateLabel}</PillButton>
          </div>
        </div>

        <Reveal className="mt-12 flex flex-col items-center text-olive-deep">
          <p className="label !text-[clamp(11px,2.8vw,13px)] !tracking-[0.36em] text-olive-deep select-none">
            {v.weekday}
          </p>

          {locale === 'pl' ? (
            <svg
              viewBox="0 0 328.83 71.25"
              aria-label={v.dateText}
              className="my-3 w-[clamp(220px,66vw,290px)] max-w-full h-auto select-none pointer-events-none overflow-visible"
            >
              <line x1="0" y1="0.5" x2="328.83" y2="0.5" stroke="#3F5A2E" strokeWidth="1" />
              <text
                x="50%"
                y="51%"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#3F5A2E"
                fontFamily="BelfastSerial, 'Belfast Serial', serif"
                fontSize="47"
                letterSpacing="0.035em"
              >
                {v.dateText}
              </text>
              <line x1="0" y1="70.75" x2="328.83" y2="70.75" stroke="#3F5A2E" strokeWidth="1" />
            </svg>
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
