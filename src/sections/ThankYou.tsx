import { Reveal } from '../components/Reveal'
import { SectionTitle } from '../components/SectionTitle'
import { useLanguage } from '../context/LanguageContext'

export function ThankYou() {
  const { t } = useLanguage()
  const k = t.thanks
  return (
    <section className="bg-sand pb-28 pt-14" aria-label={`${k.title.initial}${k.title.rest}`}>
      <div className="mx-auto max-w-[560px] px-5">
        <Reveal className="relative border border-[#8b9670] px-4 pb-9 pt-12 text-center">
          <div className="absolute inset-x-0 top-0 -translate-y-1/2 text-center">
            <div className="inline-block bg-sand px-4">
              <SectionTitle initial={k.title.initial} rest={k.title.rest} compact color="text-olive-deep" />
            </div>
          </div>
          <p className="label !text-[12px] !leading-[1.9] !tracking-[0.25em] text-olive-deep">{k.body}</p>
        </Reveal>
      </div>
    </section>
  )
}
