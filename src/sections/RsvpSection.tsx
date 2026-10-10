import { Reveal } from '../components/Reveal'
import { useLanguage } from '../context/LanguageContext'
import { RsvpForm } from './Rsvp'

/** Full RSVP section on the main page in olive #4a5443 tone: heading, deadline notes and interactive form. */
export function RsvpSection() {
  const { t } = useLanguage()
  return (
    <section
      id="rsvp"
      className="relative bg-[#4a5443] text-cream-light py-8 sm:py-14 overflow-hidden"
      aria-label={t.rsvp.title}
    >
      <Reveal>
        <RsvpForm open={true} />
      </Reveal>
    </section>
  )
}

