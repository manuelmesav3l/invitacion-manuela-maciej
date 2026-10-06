import { useEffect, useState } from 'react'
import { Sheet } from '../components/Sheet'
import { useLanguage } from '../context/LanguageContext'
import { loadWeather, type Weather } from '../lib/weather'

export function ClimateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage()
  const c = t.climate
  const [w, setW] = useState<Weather | null>(null)
  useEffect(() => {
    if (open && !w) loadWeather().then(setW)
  }, [open, w])

  const title = w?.kind === 'forecast'
    ? c.forecastTitle
    : c.typicalTitle

  const description = w?.kind === 'fallback'
    ? c.descFallback
    : w?.kind === 'typical'
      ? c.descTypical
      : c.descLive

  return (
    <Sheet open={open} onClose={onClose} label={c.dialogLabel} closeLabel={t.rsvp.labels.close}>
      <div className="px-8 pb-10 pt-14 text-center text-olive-deep">
        <p className="label text-gold">{c.subtitle}</p>
        <h2 className="mt-2 font-script text-[54px] font-normal leading-none">{c.title}</h2>
        {!w ? (
          <p className="label mt-8 animate-pulse !text-[11px]">{c.loading}</p>
        ) : (
          <div className="mt-6">
            <p className="label !text-[11px] text-ink">{title}</p>
            <div className="mx-auto mt-5 grid max-w-[300px] grid-cols-3 divide-x divide-olive-deep/40">
              <Stat v={`${Math.round(w.tMax)}°`} l={c.high} />
              <Stat v={`${Math.round(w.tMin)}°`} l={c.low} />
              <Stat
                v={w.kind === 'forecast' ? `${w.rainMm.toFixed(1)}` : `${w.rainDays ?? '–'}`}
                l={w.kind === 'forecast' ? c.rainMm : c.rainDays}
              />
            </div>
            <p className="mx-auto mt-6 max-w-[300px] font-serif text-[16px] leading-snug text-ink">
              {description}
            </p>
          </div>
        )}
      </div>
    </Sheet>
  )
}

const Stat = ({ v, l }: { v: string; l: string }) => (
  <div className="px-2"><div className="font-serif text-[40px] leading-none">{v}</div><div className="label mt-2 !text-[9px] text-gold">{l}</div></div>
)
