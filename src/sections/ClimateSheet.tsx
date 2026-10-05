import { useEffect, useState } from 'react'
import { Sheet } from '../components/Sheet'
import { loadWeather, type Weather } from '../lib/weather'

export function ClimateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [w, setW] = useState<Weather | null>(null)
  useEffect(() => {
    if (open && !w) loadWeather().then(setW)
  }, [open, w])

  const title = w?.kind === 'forecast' ? 'Forecast' : 'Typical May weather'
  return (
    <Sheet open={open} onClose={onClose} label="Climate in Medellín">
      <div className="px-8 pb-10 pt-14 text-center text-olive-deep">
        <p className="label text-gold">MEDELLÍN · 06 MAY 2027</p>
        <h2 className="mt-2 font-script text-[54px] font-normal leading-none">Climate</h2>
        {!w ? (
          <p className="label mt-8 animate-pulse !text-[11px]">Loading…</p>
        ) : (
          <div className="mt-6">
            <p className="label !text-[11px] text-ink">{title}</p>
            <div className="mx-auto mt-5 grid max-w-[300px] grid-cols-3 divide-x divide-olive-deep/40">
              <Stat v={`${Math.round(w.tMax)}°`} l="HIGH" />
              <Stat v={`${Math.round(w.tMin)}°`} l="LOW" />
              <Stat v={w.kind === 'forecast' ? `${w.rainMm.toFixed(1)}` : `${w.rainDays ?? '–'}`} l={w.kind === 'forecast' ? 'RAIN mm' : 'RAINY DAYS'} />
            </div>
            <p className="mx-auto mt-6 max-w-[300px] font-serif text-[16px] leading-snug text-ink">
              {w.kind === 'fallback'
                ? 'Live data is unavailable. May in Medellín is typically mild — around 26° by day, 17° at night, with afternoon showers possible. A light layer for the evening is a good idea.'
                : w.kind === 'typical'
                  ? 'Based on the average of recent Mays. A light layer for the evening and an umbrella for an afternoon shower are a good idea.'
                  : 'Live forecast for the wedding day.'}
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
