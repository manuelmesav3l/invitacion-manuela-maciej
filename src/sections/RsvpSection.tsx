import { Reveal } from '../components/Reveal'
import { RsvpButton } from '../components/RsvpButton'
import { useLanguage } from '../context/LanguageContext'

/** RSVP call-to-action between Gifts and Thank you: deadline, plus-ones note and the RSVP button (opens the form modal). */
export function RsvpSection({ onRsvp }: { onRsvp: () => void }) {
  const { t } = useLanguage()
  const r = t.rsvp
  return (
    <section id="rsvp" className="bg-sand pb-14 pt-6" aria-label={r.title}>
      <Reveal className="mx-auto max-w-[420px] px-6 text-center">
        <p className="font-script text-[clamp(44px,14vw,58px)] italic leading-none text-gold">{r.kindly}</p>
        <p className="font-serif text-[clamp(24px,7vw,30px)] font-medium leading-none text-gold">{r.reply}</p>
        <p className="mt-2 font-serif text-[clamp(20px,6vw,24px)] tracking-[0.2em] text-gold">
          <span className="font-script text-[1.5em] normal-case italic tracking-normal">{r.by}</span> {r.deadline}
        </p>
        <p className="label mx-auto mt-2 max-w-[300px] !text-[10px] !leading-[1.8] text-gold/90">{r.deadlineNote}</p>
        <p className="mx-auto mt-5 max-w-[340px] font-serif text-[15px] italic leading-snug text-ink/80">{r.plusOnes}</p>
        <div className="mt-6 flex justify-center">
          <RsvpButton onClick={onRsvp} />
        </div>
      </Reveal>
    </section>
  )
}
