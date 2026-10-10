import { MedellinGallery } from '../components/MedellinGallery'
import { MedellinGuide } from '../components/MedellinGuide'
import { Reveal } from '../components/Reveal'
import { SectionTitle } from '../components/SectionTitle'
import { useLanguage } from '../context/LanguageContext'

export function Medellin() {
  const { t } = useLanguage()
  const m = t.medellin

  return (
    <section className="overflow-hidden bg-sand pb-24 pt-14" aria-label={`${m.kicker} ${m.title.initial}${m.title.rest}`}>
      <div className="mx-auto max-w-[560px] px-5 text-center">
        <Reveal><p className="label !text-[13px] !tracking-[0.3em] text-olive-deep">{m.kicker}</p></Reveal>
        <SectionTitle initial={m.title.initial} rest={m.title.rest} size="lg" color="text-olive-deep" className="-mt-1" />
        <Reveal><p className="label -mt-1 !text-[10px] text-gold">{m.sub}</p></Reveal>

        <MedellinGuide gallery={<MedellinGallery />} />
      </div>
    </section>
  )
}
