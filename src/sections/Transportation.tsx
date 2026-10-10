import { asset } from '../lib/asset'
import { PillButton } from '../components/PillButton'
import { Reveal } from '../components/Reveal'
import { SectionTitle } from '../components/SectionTitle'
import { useLanguage } from '../context/LanguageContext'

/** Pick-up information. Lives inside the Venue block, right under the maps/climate buttons. */
export function Transportation() {
  const { t } = useLanguage()
  const x = t.transport
  return (
    <div className="mt-8 border-t border-olive-deep/20 pt-10" role="group" aria-label={`${x.title.initial}${x.title.rest}`}>
      <SectionTitle initial={x.title.initial} rest={x.title.rest} compact color="text-olive-deep" />
      <Reveal className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
        <div className="flex flex-col items-center gap-3">
          <img
            src={asset('assets/venue-icon-pin.webp')}
            width={162}
            height={232}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="blend-multiply h-16 w-auto select-none object-contain sm:h-[76px]"
          />
          <PillButton href={x.mapsUrl}>{x.mapsLabel}</PillButton>
        </div>
        <div className="text-center sm:text-left">
          <p className="label !text-[11px] !tracking-[0.3em] text-gold">{x.pickup}</p>
          <p className="m-0 mt-1 font-belfast text-[clamp(28px,8.4vw,40px)] leading-[1.05] text-olive-deep">{x.placeName}</p>
        </div>
      </Reveal>
    </div>
  )
}
