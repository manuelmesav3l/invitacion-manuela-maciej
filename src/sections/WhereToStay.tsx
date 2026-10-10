import { asset } from '../lib/asset'
import { PillButton } from '../components/PillButton'
import { Reveal } from '../components/Reveal'
import { useLanguage } from '../context/LanguageContext'

export function WhereToStay() {
  const { t } = useLanguage()
  const s = t.stay
  return (
    <section className="bg-cream pb-16 pt-14" aria-label={s.title}>
      <div className="mx-auto max-w-[560px] px-5 text-center">
        <h2 className="m-0 font-script text-[clamp(48px,15vw,80px)] font-normal italic leading-[1.05] text-olive-deep">{s.title}</h2>
        <Reveal delay={0.1}>
          <p className="label mx-auto mt-4 max-w-[380px] !text-[11px] !leading-[2] text-olive-deep">{s.body}</p>
        </Reveal>

        <ul className="mx-auto mt-9 grid max-w-[460px] grid-cols-1 gap-6 sm:grid-cols-2">
          {s.hotels.map((h) => (
            <li key={h.key}>
              <Reveal className="flex h-full flex-col items-center gap-3 rounded-[4px] border border-olive-deep/20 bg-white/40 px-5 py-6">
                {h.photo ? (
                  <img
                    src={h.photo}
                    width={720}
                    height={540}
                    alt={h.name}
                    loading="lazy"
                    decoding="async"
                    className="mb-1 aspect-[4/3] w-full rounded-[3px] object-cover shadow-[0_8px_20px_-10px_rgba(60,45,20,.5)]"
                  />
                ) : (
                  <img
                    src={asset('assets/venue-icon-pin-alpha.webp')}
                    width={162}
                    height={232}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-auto select-none object-contain"
                  />
                )}
                <p className="label !text-[10px] !tracking-[0.3em] text-olive-deep">{h.area}</p>
                <p className="m-0 font-serif text-[clamp(20px,5.4vw,23px)] tracking-[0.06em] text-olive-deep">{h.name}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {h.mapsUrl && <PillButton href={h.mapsUrl}>{s.mapsLabel}</PillButton>}
                  {h.url && <PillButton href={h.url}>{s.websiteLabel}</PillButton>}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
