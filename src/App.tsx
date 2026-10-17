import { lazy, Suspense, useEffect, useState } from 'react'
import { Countdown } from './sections/Countdown'
import { DressCode } from './sections/DressCode'
import { Hero } from './sections/Hero'
import { Medellin } from './sections/Medellin'
import { Programme } from './sections/Programme'
import { Venue } from './sections/Venue'
import { Gifts } from './sections/Gifts'
import { RsvpSection } from './sections/RsvpSection'
import { Transportation } from './sections/Transportation'
import { WhereToStay } from './sections/WhereToStay'
import { ThankYou } from './sections/ThankYou'
import { Welcome } from './sections/Welcome'
import { StackCard } from './components/StackCard'
import { LanguageToggle } from './components/LanguageToggle'
import { LanguageProvider } from './context/LanguageContext'
import { initScroll, scrollToTarget } from './lib/scroll'

// Lazy load heavy interactive sheets/modals on demand to keep initial heap memory minimal
const ClimateSheet = lazy(() => import('./sections/ClimateSheet').then((m) => ({ default: m.ClimateSheet })))
const BrideGuestManager = lazy(() =>
  import('./components/admin/BrideGuestManager').then((m) => ({ default: m.BrideGuestManager }))
)

export default function App() {
  const [climate, setClimate] = useState(false)
  const [adminOpen, setAdminOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    return params.has('admin') || params.has('novia') || window.location.hash === '#admin'
  })

  useEffect(() => initScroll(), [])

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true)
      }
    }
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  const handleScrollToRsvp = () => {
    scrollToTarget('#rsvp')
  }

  return (
    <LanguageProvider>
      <main>
        <StackCard first>
          <Hero onRsvp={handleScrollToRsvp} />
        </StackCard>
        <StackCard>
          <Countdown />
          <Welcome />
          <Venue onClimate={() => setClimate(true)} />
          <Programme />
          <DressCode />
          <Gifts />
          <RsvpSection />
          <Transportation />
          <WhereToStay />
          <Medellin />
          <ThankYou onOpenAdmin={() => setAdminOpen(true)} />
        </StackCard>
        <Suspense fallback={null}>
          {climate && <ClimateSheet open={climate} onClose={() => setClimate(false)} />}
        </Suspense>
        <Suspense fallback={null}>
          {adminOpen && <BrideGuestManager open={adminOpen} onClose={() => setAdminOpen(false)} />}
        </Suspense>

        <LanguageToggle />
      </main>
    </LanguageProvider>
  )
}

