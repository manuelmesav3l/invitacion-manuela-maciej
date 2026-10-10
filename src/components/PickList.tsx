import { Reveal } from './Reveal'

export interface Pick {
  key: string
  icon: string
  title: string
  lead: string
  body: string
  top?: boolean
}

/** Editorial list of recommendations (things to do, day trips). */
export function PickList({ items, topPick }: { items: Pick[]; topPick?: string }) {
  return (
    <ul className="mx-auto mt-8 max-w-[440px] space-y-9 text-left">
      {items.map((it, i) => (
        <li key={it.key}>
          <Reveal delay={Math.min(i, 3) * 0.05}>
            <h3 className="m-0 flex items-baseline gap-2.5 font-serif text-[clamp(21px,5.6vw,25px)] font-medium leading-tight text-olive-deep">
              <span aria-hidden="true" className="shrink-0 text-[0.9em]">{it.icon}</span>
              <span>{it.title}</span>
            </h3>
            <p className="label mt-2 !text-[11px] !leading-[1.8] !tracking-[0.2em] text-gold">{it.lead}</p>
            <p className="mt-2 font-serif text-[clamp(17px,4.6vw,19px)] leading-[1.5] text-ink">{it.body}</p>
            {it.top && topPick && (
              <p className="mt-2 font-serif text-[clamp(16px,4.4vw,18px)] italic text-olive-deep">
                <span aria-hidden="true">⭐ </span>{topPick}
              </p>
            )}
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
