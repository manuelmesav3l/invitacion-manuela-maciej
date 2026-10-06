import { lazy, Suspense, useEffect, useState } from 'react'
import { Countdown } from './sections/Countdown'
import { DressCode } from './sections/DressCode'
import { Hero } from './sections/Hero'
import { Medellin } from './sections/Medellin'
import { Programme } from './sections/Programme'
import { Venue } from './sections/Venue'
import { Welcome } from './sections/Welcome'
import { StackCard } from './components/StackCard'
import { LanguageToggle } from './components/LanguageToggle'
import { LanguageProvider } from './context/LanguageContext'
import { initScroll } from './lib/scroll'

// Lazy load heavy interactive sheets/modals on demand to keep initial heap memory minimal
const Rsvp = lazy(() => import('./sections/Rsvp').then((m) => ({ default: m.Rsvp })))
const ClimateSheet = lazy(() => import('./sections/ClimateSheet').then((m) => ({ default: m.ClimateSheet })))

export default function App() {
  const [rsvp, setRsvp] = useState(false)
  const [climate, setClimate] = useState(false)
  useEffect(() => initScroll(), [])

  return (
    <LanguageProvider>
      <main>
        <StackCard first>
          <Hero onRsvp={() => setRsvp(true)} />
        </StackCard>
        <StackCard>
          <Countdown />
          <Welcome />
          <Venue onClimate={() => setClimate(true)} />
          <Programme />
          <DressCode />
          <Medellin />
        </StackCard>
        <Suspense fallback={null}>
          {rsvp && <Rsvp open={rsvp} onClose={() => setRsvp(false)} />}
          {climate && <ClimateSheet open={climate} onClose={() => setClimate(false)} />}
        </Suspense>

        <LanguageToggle />
      </main>
    </LanguageProvider>
  )
}
