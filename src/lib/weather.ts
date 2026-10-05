import { t, WEDDING_ISO, TIMEZONE } from '../content/content'
import { daysUntil } from './countdown'

export interface Weather {
  kind: 'forecast' | 'typical' | 'fallback'
  tMax: number
  tMin: number
  rainMm: number
  rainDays?: number
}

const FALLBACK: Weather = { kind: 'fallback', tMax: 26, tMin: 17, rainMm: 5, rainDays: 17 }
const { lat, lon } = t.venue.coords

export async function loadWeather(): Promise<Weather> {
  try {
    const left = daysUntil()
    const date = WEDDING_ISO.slice(0, 10)
    if (left >= 0 && left <= 14) {
      const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=${TIMEZONE}&start_date=${date}&end_date=${date}`
      const j = await (await fetch(u)).json()
      return { kind: 'forecast', tMax: j.daily.temperature_2m_max[0], tMin: j.daily.temperature_2m_min[0], rainMm: j.daily.precipitation_sum[0] }
    }
    // Typical May: average of the last 5 full years for 1–31 May (Open-Meteo archive, no key)
    const y = new Date().getFullYear()
    const u = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${y - 5}-05-01&end_date=${y - 1}-05-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=${TIMEZONE}`
    const j = await (await fetch(u)).json()
    const avg = (a: (number | null)[]) => { const v = a.filter((x): x is number => x != null); return v.reduce((s, x) => s + x, 0) / v.length }
    const may = (arr: (number | null)[]) => arr.filter((_, i) => (j.daily.time[i] as string).slice(5, 7) === '05')
    const rain = may(j.daily.precipitation_sum)
    return {
      kind: 'typical',
      tMax: avg(may(j.daily.temperature_2m_max)),
      tMin: avg(may(j.daily.temperature_2m_min)),
      rainMm: avg(rain),
      rainDays: Math.round((rain.filter((x) => (x ?? 0) >= 1).length / 5)),
    }
  } catch {
    return FALLBACK
  }
}
