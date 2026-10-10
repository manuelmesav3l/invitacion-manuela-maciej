import { PickList } from '../components/PickList'
import { Reveal } from '../components/Reveal'
import { SectionTitle, StackedTitle } from '../components/SectionTitle'
import { useLanguage } from '../context/LanguageContext'

export function ThingsToDo() {
  const { t } = useLanguage()
  const d = t.todo
  return (
    <section className="bg-sand pb-16 pt-14" aria-label={`${d.kicker} ${d.title.initial}${d.title.rest}`}>
      <div className="mx-auto max-w-[560px] px-5 text-center">
        <Reveal><p className="label !text-[13px] !tracking-[0.3em] text-olive-deep">{d.kicker}</p></Reveal>
        <SectionTitle initial={d.title.initial} rest={d.title.rest} size="lg" color="text-olive-deep" className="-mt-1" />
        <Reveal><p className="label mt-1 !text-[10px] text-gold">{d.intro}</p></Reveal>
        <PickList items={d.items} />
      </div>
    </section>
  )
}

export function DayTrips() {
  const { t } = useLanguage()
  const d = t.trips
  return (
    <section className="bg-cream pb-16 pt-14" aria-label={`${d.title.initial}${d.title.first} ${d.title.second}`}>
      <div className="mx-auto max-w-[560px] px-5 text-center">
        <StackedTitle initial={d.title.initial} first={d.title.first} second={d.title.second} initialFont="script" />
        <Reveal><p className="label mt-3 !text-[10px] text-olive-deep">{d.intro}</p></Reveal>
        <PickList items={d.items} topPick={d.topPick} />
      </div>
    </section>
  )
}
