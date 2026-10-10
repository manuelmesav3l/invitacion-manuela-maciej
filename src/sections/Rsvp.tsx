import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Divider, Flourish } from '../components/Ornaments'
import { Sheet } from '../components/Sheet'
import { useLanguage } from '../context/LanguageContext'
import { fetchGuest, submitRsvp, type GuestInfo } from '../lib/supabase'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const PHONE_RE = /^[0-9+()\-\s.]{3,40}$/

const createSchema = (v: { nameMin: string; attendingRequired: string; emailInvalid: string }) =>
  z.object({
    full_name: z.string().trim().min(2, v.nameMin).max(120),
    email: z.string().trim().max(254).refine((x) => !x || EMAIL_RE.test(x), v.emailInvalid).optional().default(''),
    phone: z.string().trim().max(40).refine((x) => !x || PHONE_RE.test(x), v.emailInvalid).optional().default(''),
    attending: z.boolean({ message: v.attendingRequired }),
    needs_transport: z.boolean().nullable().optional(),
    transport_notes: z.string().max(200).optional().default(''),
    welcome_meeting: z.boolean().nullable().optional(),
    companions: z.number().int().min(0),
    dietary: z.string().max(500).optional().default(''),
    message: z.string().max(750).optional().default(''),
    website: z.string().max(0).optional(), // honeypot
  })
type Form = z.input<ReturnType<typeof createSchema>>

const token = () => new URLSearchParams(window.location.search).get('g')

function Check() {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 52 52" width="72" height="72" fill="none" stroke="#FAF5EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <motion.circle cx="26" cy="26" r="23" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
      <motion.path d="M15 27l8 8 15-17" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
    </svg>
  )
}

/** Stacked option bars (attending): translucent cream bars, selected one turns solid cream. */
function YesNo({ value, onChange, yes, no }: { value: boolean | undefined; onChange: (v: boolean) => void; yes: string; no: string }) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-3" role="radiogroup">
      {([[true, yes], [false, no]] as const).map(([val, text]) => (
        <button
          key={String(val)}
          type="button"
          role="radio"
          aria-checked={value === val}
          onClick={() => onChange(val)}
          className={`label flex min-h-[48px] w-full items-center px-4 py-3 text-left !text-[12px] !leading-[1.5] !tracking-[0.16em] transition-colors active:scale-[0.995] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-light/80 ${
            value === val ? 'bg-[#bf9a58] !text-[#2b3224]' : 'bg-cream-light/25 !text-cream-light hover:bg-cream-light/35'
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  )
}

/** Round radio rows (transport / welcome meeting). */
function Radios({ value, onChange, yes, no }: { value: boolean | undefined; onChange: (v: boolean) => void; yes: string; no: string }) {
  return (
    <div className="mt-3 space-y-3" role="radiogroup">
      {([[true, yes], [false, no]] as const).map(([val, text]) => (
        <button
          key={String(val)}
          type="button"
          role="radio"
          aria-checked={value === val}
          onClick={() => onChange(val)}
          className="group flex min-h-[44px] w-full items-center gap-4 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-light/80"
        >
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-cream-light transition-colors ${value === val ? 'bg-cream-light' : 'bg-transparent group-hover:bg-cream-light/20'}`}>
            {value === val && <span className="h-2 w-2 rounded-full bg-[#4a5443]" />}
          </span>
          <span className="label !text-[12px] !leading-[1.5] !tracking-[0.16em] !text-cream-light">{text}</span>
        </button>
      ))}
    </div>
  )
}

/** RSVP content (heading + deadline + form). Shared by the modal sheet and the inline section. */
export function RsvpForm({ open = true, className = '' }: { open?: boolean; className?: string }) {
  const uid = useId()
  const { t } = useLanguage()
  const L = t.rsvp.labels
  const tk = useMemo(() => token(), [])
  const [guest, setGuest] = useState<GuestInfo | null>(null)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  const schema = useMemo(() => createSchema(t.rsvp.validation), [t.rsvp.validation])

  const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      companions: 0,
      dietary: '',
      transport_notes: '',
      message: '',
      needs_transport: null,
      welcome_meeting: null,
    },
  })
  const attending = useWatch({ control, name: 'attending' })
  const welcomeMeeting = useWatch({ control, name: 'welcome_meeting' })

  useEffect(() => {
    if (!open || !tk || guest) return
    fetchGuest(tk).then((g) => {
      if (!g) return
      setGuest(g)
      const rawMsg = g.response?.message ?? ''
      const transportMatch = rawMsg.match(/(?:\r?\n|^)\[Transport:\s*([^\]]+)\]\s*$/i)
      const cleanMessage = transportMatch ? rawMsg.replace(/(?:\r?\n|^)\[Transport:\s*[^\]]+\]\s*$/i, '').trim() : rawMsg
      const savedTransportNotes = g.response?.transport_notes
        ? g.response.transport_notes
        : (transportMatch
            ? transportMatch[1].trim()
            : (g.response?.needs_transport !== null && g.response?.needs_transport !== undefined
                ? (g.response.needs_transport ? 'Yes' : 'No')
                : ''))

      reset(g.response
        ? {
            full_name: g.response.full_name,
            attending: g.response.attending,
            companions: g.response.companions,
            dietary: g.response.dietary ?? '',
            transport_notes: savedTransportNotes,
            message: cleanMessage,
            email: g.response.email ?? '',
            phone: g.response.phone ?? '',
            needs_transport: g.response.needs_transport ?? null,
            welcome_meeting: g.response.welcome_meeting ?? null,
          }
        : {
            full_name: g.name,
            email: '',
            phone: '',
            companions: 0,
            dietary: '',
            transport_notes: '',
            message: '',
            needs_transport: null,
            welcome_meeting: null,
          })
    })
  }, [open, tk, guest, reset])

  const max = guest?.max_companions ?? 0
  const onSubmit = handleSubmit(async (v) => {
    if (v.website) { setState('done'); return } // bot: pretend success
    setError(''); setState('sending')
    try {
      const transportText = (v.transport_notes || '').trim()
      const isNegative = /^(no\b|ningun|ningún|sin\s|none\b|nie\b|false\b)/i.test(transportText)
      const computedTransport = transportText
        ? !isNegative
        : (v.needs_transport ?? null)

      const cleanMsg = (v.message || '').replace(/(?:\r?\n|^)\[Transport:\s*[^\]]+\]\s*$/i, '').trim()
      let composedMessage = cleanMsg
      if (transportText && !/^(yes|si|tak|no|nie)$/i.test(transportText)) {
        composedMessage = cleanMsg
          ? `${cleanMsg}\n[Transport: ${transportText}]`
          : `[Transport: ${transportText}]`
      }
      if (composedMessage.length > 1000) {
        composedMessage = composedMessage.slice(0, 1000)
      }

      await submitRsvp({
        token: tk,
        full_name: v.full_name,
        attending: v.attending,
        companions: v.attending ? v.companions : 0,
        dietary: v.dietary ?? '',
        message: composedMessage,
        email: v.email ?? '',
        phone: v.phone ?? '',
        needs_transport: v.attending ? computedTransport : null,
        welcome_meeting: v.attending ? (v.welcome_meeting ?? null) : null,
      })
      setState('done')
    } catch (e) {
      // The database rejects a missing/unknown personal token explicitly; anything else is a transient/other failure.
      const msg = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? '')
      setState('idle'); setError(/invitation (link|token)/i.test(msg) ? t.rsvp.errorSubmit : t.rsvp.errorGeneric)
    }
  })

  const field = 'mt-2 w-full rounded-none border border-cream-light/45 bg-transparent px-3 py-2.5 font-serif text-[18px] text-cream-light placeholder:text-cream-light/40 transition-colors focus:border-cream-light focus:outline-none focus:ring-1 focus:ring-cream-light [&>option]:text-ink'
  const lab = "label block !text-[12px] !tracking-[0.16em] !text-cream-light after:content-[':']"
  const err = 'mt-1 font-serif text-[15px] text-[#f3b9a6]'

  return (
    <div className={`mx-auto max-w-[480px] px-6 sm:px-7 pb-14 pt-10 text-center ${className}`}>
      <h2 className="m-0 font-serif text-[clamp(56px,18vw,76px)] font-normal leading-none tracking-[0.35em] text-cream-light" style={{ paddingLeft: '0.35em' }}>{t.rsvp.title}</h2>
      <Divider className="mx-auto mt-5 w-40 text-cream-light" />
      <p className="mt-9 font-script text-[clamp(52px,15vw,64px)] italic leading-[0.9] text-[#bf9a58]">{t.rsvp.kindly}</p>
      <p className="m-0 mt-1 font-serif text-[clamp(28px,8vw,34px)] font-medium leading-none tracking-[0.04em] text-[#bf9a58]">{t.rsvp.reply}</p>
      <p className="m-0 mt-2 font-serif text-[clamp(22px,6.6vw,28px)] tracking-[0.2em] text-[#bf9a58]"><span className="font-script text-[1.5em] normal-case italic tracking-normal">{t.rsvp.by}</span> {t.rsvp.deadline}</p>
      <p className="label mx-auto mt-3 max-w-[300px] !text-[10px] !leading-[1.8] !text-cream-light/75">{t.rsvp.deadlineNote}</p>

      <p className="label mx-auto mt-7 inline-block rounded-full bg-[#bf9a58] px-7 py-2.5 !text-[13px] !tracking-[0.2em] !text-cream-light">{t.rsvp.note}</p>
      <p className="label mx-auto mt-4 max-w-[320px] !text-[12px] !leading-[1.7] !tracking-[0.16em] !text-cream-light">{t.rsvp.plusOnes}</p>

      {state === 'done' ? (
        <div className="mt-10 flex flex-col items-center" role="status">
          <Check />
          <p className="mt-4 font-script text-[48px] text-cream-light">{t.rsvp.thanks}</p>
          <p className="label !text-[12px] !text-cream-light">{t.rsvp.thanksBody}</p>
          <button
            type="button"
            onClick={() => setState('idle')}
            className="label mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full border border-cream-light/70 px-8 py-3 !text-[12px] !text-cream-light transition-colors active:scale-[0.98] touch-manipulation hover:bg-cream-light/10"
          >
            {L.edit}
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-10 space-y-7 text-left">
          {!tk && <p role="alert" className="label rounded-[3px] border border-[#f3b9a6]/60 px-4 py-3 text-center !text-[11px] !leading-[1.7] !text-[#f3b9a6]">{t.rsvp.needLink}</p>}
          <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label></div>

          <fieldset>
            <legend className={lab}>{L.attending}</legend>
            <YesNo
              value={attending}
              onChange={(v) => setValue('attending', v, { shouldValidate: true })}
              yes={L.yes}
              no={L.no}
            />
            {errors.attending && <p role="alert" className={err}>{errors.attending.message}</p>}
          </fieldset>

          {attending && max > 0 && (
            <div>
              <label htmlFor={`${uid}-companions`} className={lab}>{L.companions} (0–{max})</label>
              <select id={`${uid}-companions`} className={field} {...register('companions', { valueAsNumber: true })}>
                {Array.from({ length: max + 1 }, (_, i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          )}

          <div>
            <label htmlFor={`${uid}-full_name`} className={lab}>{L.name}</label>
            <input id={`${uid}-full_name`} autoComplete="name" className={field} aria-invalid={!!errors.full_name} {...register('full_name')} />
            {errors.full_name && <p role="alert" className={err}>{errors.full_name.message}</p>}
          </div>
          <div>
            <label htmlFor={`${uid}-email`} className={lab}>{L.email}</label>
            <input id={`${uid}-email`} type="email" inputMode="email" autoComplete="email" className={field} aria-invalid={!!errors.email} {...register('email')} />
            {errors.email && <p role="alert" className={err}>{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor={`${uid}-phone`} className={lab}>{L.phone}</label>
            <input id={`${uid}-phone`} type="tel" inputMode="tel" autoComplete="tel" className={field} aria-invalid={!!errors.phone} {...register('phone')} />
            {errors.phone && <p role="alert" className={err}>{errors.phone.message}</p>}
          </div>
          <div>
            <label htmlFor={`${uid}-dietary`} className={lab}>{L.dietary}</label>
            <input id={`${uid}-dietary`} className={field} {...register('dietary')} />
          </div>

          <div>
            <label htmlFor={`${uid}-transport`} className={lab}>{L.transport}</label>
            <input id={`${uid}-transport`} className={field} {...register('transport_notes')} />
          </div>

          <fieldset>
            <legend className={lab}>{L.welcome}</legend>
            <Radios
              value={welcomeMeeting ?? undefined}
              onChange={(v) => setValue('welcome_meeting', v, { shouldValidate: true, shouldDirty: true })}
              yes={L.welcomeYes}
              no={L.welcomeNo}
            />
          </fieldset>

          <div>
            <label htmlFor={`${uid}-message`} className={lab}>{L.message}</label>
            <textarea id={`${uid}-message`} rows={4} className="mt-2 w-full resize-none rounded-none border-0 bg-[#b6b3a5] px-3 py-2.5 font-serif text-[18px] text-ink focus:outline-none focus:ring-2 focus:ring-cream-light" {...register('message')} />
          </div>

          {error && <p role="alert" className="text-center font-serif text-[16px] text-[#f3b9a6]">{error}</p>}
          <div className="pt-3 text-center">
            <button
              type="submit"
              disabled={state === 'sending' || !tk}
              className="label inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#bf9a58] px-12 py-3 !text-[13px] !tracking-[0.3em] !text-cream-light shadow-md transition-all active:scale-[0.98] hover:bg-[#cba768] touch-manipulation disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-light focus-visible:ring-offset-2 focus-visible:ring-offset-[#4a5443]"
            >
              {state === 'sending' ? '…' : L.send}
            </button>
            <Flourish className="mx-auto mt-5 h-7 text-cream-light" />
          </div>
        </form>
      )}
    </div>
  )
}

export function Rsvp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage()
  return (
    <Sheet open={open} onClose={onClose} label={t.rsvp.title} closeLabel={t.rsvp.labels.close} tall tone="olive">
      <RsvpForm open={open} />
    </Sheet>
  )
}
