import { useEffect, useState } from 'react'
import { Countdown } from './sections/Countdown'
import { ClimateSheet } from './sections/ClimateSheet'
import { DressCode } from './sections/DressCode'
import { Hero } from './sections/Hero'
import { Medellin } from './sections/Medellin'
import { Programme } from './sections/Programme'
import { Rsvp } from './sections/Rsvp'
import { Venue } from './sections/Venue'
import { Welcome } from './sections/Welcome'
import { StackCard } from './components/StackCard'
import { initScroll } from './lib/scroll'

export default function App() {
  const [rsvp, setRsvp] = useState(false)
  const [climate, setClimate] = useState(false)
  useEffect(() => initScroll(), [])
  return (
    <main>
      <StackCard first><Hero onRsvp={() => setRsvp(true)} /></StackCard>
      <StackCard>
        <Countdown />
        <Welcome />
        <Venue onClimate={() => setClimate(true)} />
        <Programme />
        <DressCode />
        <Medellin />
      </StackCard>
      <Rsvp open={rsvp} onClose={() => setRsvp(false)} />
      <ClimateSheet open={climate} onClose={() => setClimate(false)} />
    </main>
  )
}
