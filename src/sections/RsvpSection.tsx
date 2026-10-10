import { useLanguage } from '../context/LanguageContext'
import { RsvpForm } from './Rsvp'

/** Inline RSVP section (deadline, plus-ones note, form, submit) between Gifts and Thank you. */
export function RsvpSection() {
  const { t } = useLanguage()
  return (
    <section id="rsvp" className="bg-cream" aria-label={t.rsvp.title}>
      <RsvpForm open />
    </section>
  )
}
