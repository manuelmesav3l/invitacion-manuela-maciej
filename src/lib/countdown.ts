import { WEDDING_ISO } from '../content/content'

export interface Remaining { days: number; hours: number; minutes: number; seconds: number }

export function remaining(now = Date.now()): Remaining {
  const diff = Math.max(0, new Date(WEDDING_ISO).getTime() - now)
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  }
}

export const daysUntil = () => Math.ceil((new Date(WEDDING_ISO).getTime() - Date.now()) / 86_400_000)
