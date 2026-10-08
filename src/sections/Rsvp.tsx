import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Flourish } from '../components/Ornaments'
import { Sheet } from '../components/Sheet'
import { useLanguage } from '../context/LanguageContext'
import { fetchGuest, submitRsvp, type GuestInfo } from '../lib/supabase'

const createSchema = (v: { nameMin: string; attendingRequired: string }) =>
  z.object({
    full_name: z.string().trim().min(2, v.nameMin).max(120),
    attending: z.boolean({ message: v.attendingRequired }),
    companions: z.number().int().min(0),
    dietary: z.string().max(500).optional().default(''),
    message: z.string().max(1000).optional().default(''),
    website: z.string().max(0).optional(), // honeypot
  })
type Form = z.input<ReturnType<typeof createSchema>>

const token = () => new URLSearchParams(window.location.search).get('g')

function Check() {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 52 52" width="72" height="72" fill="none" stroke="#3F5A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <motion.circle cx="26" cy="26" r="23" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
      <motion.path d="M15 27l8 8 15-17" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
    </svg>
  )
}

export function Rsvp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage()
  const L = t.rsvp.labels
  const tk = useMemo(() => token(), [])
  const [guest, setGuest] = useState<GuestInfo | null>(null)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  const schema = useMemo(() => createSchema(t.rsvp.validation), [t.rsvp.validation])

  const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: '', companions: 0, dietary: '', message: '' },
  })
  const attending = useWatch({ control, name: 'attending' })

  useEffect(() => {
    if (!open || !tk || guest) return
    fetchGuest(tk).then((g) => {
      if (!g) return
      setGuest(g)
      reset(g.response
        ? { full_name: g.response.full_name, attending: g.response.attending, companions: g.response.companions, dietary: g.response.dietary ?? '', message: g.response.message ?? '' }
        : { full_name: g.name, companions: 0, dietary: '', message: '' })
    })
  }, [open, tk, guest, reset])

  const max = guest?.max_companions ?? 0
  const onSubmit = handleSubmit(async (v) => {
    if (v.website) { setState('done'); return } // bot: pretend success
    setError(''); setState('sending')
    try {
      await submitRsvp({ token: tk, full_name: v.full_name, attending: v.attending, companions: v.attending ? v.companions : 0, dietary: v.dietary ?? '', message: v.message ?? '' })
      setState('done')
    } catch {
      setState('idle'); setError(t.rsvp.errorSubmit)
    }
  })

  const field = 'w-full border-0 border-b border-olive-deep/40 bg-transparent px-1 py-2 font-serif text-[19px] text-ink placeholder:text-ink/40 focus:border-olive-deep focus:outline-none'
  const lab = 'label !text-[10px] text-gold'

  return (
    <Sheet open={open} onClose={onClose} label={t.rsvp.title} closeLabel={L.close} tall>
      <div className="mx-auto max-w-[460px] px-7 pb-14 pt-12 text-center">
        <p className="label !text-[11px] text-olive-deep">{t.hero.kicker}</p>
        <Flourish className="mx-auto mt-2 h-6 text-sand" />
        <h2 className="m-0 font-serif text-[76px] font-normal leading-none tracking-[0.35em] text-olive-deep" style={{ paddingLeft: '0.35em' }}>{t.rsvp.title}</h2>
        <p className="mt-4 font-script text-[58px] italic leading-none text-gold">{t.rsvp.kindly}</p>
        <p className="font-serif text-[30px] font-medium leading-none text-gold">{t.rsvp.reply}</p>
        <p className="mt-1 font-serif text-[24px] tracking-[0.2em] text-gold"><span className="font-script text-[36px] normal-case italic tracking-normal">{t.rsvp.by}</span> {t.hero.day} {t.hero.month} {t.hero.year}</p>

        {state === 'done' ? (
          <div className="mt-10 flex flex-col items-center" role="status">
            <Check />
            <p className="mt-4 font-script text-[48px] text-olive-deep">{t.rsvp.thanks}</p>
            <p className="label !text-[11px] text-ink">{t.rsvp.thanksBody}</p>
            <button
              type="button"
              onClick={() => setState('idle')}
              className="label mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full border border-gold px-8 py-3 text-[12px] text-gold transition-transform active:scale-[0.98] touch-manipulation hover:bg-gold/10"
            >
              {L.edit}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-9 space-y-6 text-left">
            {!tk && <p className="label !text-[10px] text-center text-ink">{t.rsvp.needLink}</p>}
            <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label></div>

            <div>
              <label htmlFor="full_name" className={lab}>{L.name}</label>
              <input id="full_name" autoComplete="name" className={field} aria-invalid={!!errors.full_name} {...register('full_name')} />
              {errors.full_name && <p role="alert" className="mt-1 font-serif text-[15px] text-[#8a3a2a]">{errors.full_name.message}</p>}
            </div>

            <fieldset>
              <legend className={lab}>{L.attending}</legend>
              <div className="mt-2 grid grid-cols-2 gap-3" role="radiogroup">
                {[[true, L.yes], [false, L.no]].map(([val, text]) => (
                  <button
                    key={String(val)}
                    type="button"
                    role="radio"
                    aria-checked={attending === val}
                    onClick={() => setValue('attending', val as boolean, { shouldValidate: true })}
                    className={`label flex min-h-[48px] items-center justify-center rounded-full border px-4 py-3 text-center !text-[11px] sm:!text-[12px] font-medium transition-all active:scale-[0.98] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      attending === val
                        ? 'border-olive-deep bg-olive-deep text-[#f8f5ee] shadow-sm'
                        : 'border-gold/60 text-gold hover:border-gold hover:bg-gold/5'
                    }`}
                  >
                    {text as string}
                  </button>
                ))}
              </div>
              {errors.attending && <p role="alert" className="mt-1 font-serif text-[15px] text-[#8a3a2a]">{errors.attending.message}</p>}
            </fieldset>

            {attending && max > 0 && (
              <div>
                <label htmlFor="companions" className={lab}>{L.companions} (0–{max})</label>
                <select id="companions" className={field} {...register('companions', { valueAsNumber: true })}>
                  {Array.from({ length: max + 1 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="dietary" className={lab}>{L.dietary}</label>
              <input id="dietary" className={field} {...register('dietary')} />
            </div>
            <div>
              <label htmlFor="message" className={lab}>{L.message}</label>
              <textarea id="message" rows={3} className={`${field} resize-none`} {...register('message')} />
            </div>

            {error && <p role="alert" className="text-center font-serif text-[16px] text-[#8a3a2a]">{error}</p>}
            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={state === 'sending'}
                className="label flex w-full sm:w-auto sm:inline-flex min-h-[48px] items-center justify-center rounded-full bg-gold px-10 py-3.5 !text-[12px] sm:!text-[13px] text-[#f8f1e2] shadow-md transition-all active:scale-[0.98] hover:bg-[#9d8350] touch-manipulation disabled:opacity-60"
              >
                {state === 'sending' ? '…' : L.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </Sheet>
  )
}
