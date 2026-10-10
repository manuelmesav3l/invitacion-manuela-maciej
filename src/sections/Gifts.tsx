import { asset } from '../lib/asset'
import { Divider } from '../components/Ornaments'
import { Reveal } from '../components/Reveal'
import { SectionTitle } from '../components/SectionTitle'
import { useLanguage } from '../context/LanguageContext'

export function Gifts() {
  const { t } = useLanguage()
  const g = t.gifts
  return (
    <section className="bg-sand pb-14 pt-14" aria-label={`${g.title.initial}${g.title.rest}`}>
      <div className="mx-auto max-w-[420px] px-6 text-center">
        <SectionTitle initial={g.title.initial} rest={g.title.rest} compact />
        <Reveal delay={0.1}>
          <img
            src={asset('assets/gifts-envelope.webp')}
            width={720}
            height={449}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="mx-auto mt-5 h-auto w-[min(78%,300px)] select-none drop-shadow-[0_14px_18px_rgba(60,45,20,.25)]"
          />
          <div className="mx-auto mt-8 space-y-3">
            {g.body.map((line) => <p key={line} className="label !text-[11px] !leading-[2] text-olive-deep">{line}</p>)}
          </div>
          <Divider className="mx-auto mt-9 w-40 text-gold" />
        </Reveal>
      </div>
    </section>
  )
}
