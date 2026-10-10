import { motion, useReducedMotion } from 'motion/react'

interface Props {
  initial: string
  rest: string
  size?: 'md' | 'lg'
  /** Smaller lettering for long words (e.g. TRANSPORTATION) so they never overflow a phone. */
  compact?: boolean
  color?: string
  scriptColor?: string
  as?: 'h1' | 'h2'
  className?: string
}

/** Script swash initial + high-contrast serif remainder ("𝒯HE VENUE"). */
export function SectionTitle({ initial, rest, size = 'md', compact = false, color = 'text-gold', scriptColor, as: Tag = 'h2', className = '' }: Props) {
  const reduce = useReducedMotion()
  const big = size === 'lg'
  return (
    <Tag className={`relative inline-block font-belfast leading-[0.9] ${color} ${className}`} aria-label={initial + rest}>
      <motion.span
        aria-hidden="true"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        <span className={`font-script align-baseline ${scriptColor ?? ''} ${compact ? 'text-[clamp(50px,15vw,70px)]' : big ? 'text-[clamp(62px,22.5vw,88px)]' : 'text-[clamp(56px,19vw,74px)]'} mr-[-0.05em] italic`}>{initial}</span>
        <span className={`font-belfast font-normal tracking-[0.02em] ${compact ? 'text-[clamp(24px,7.6vw,38px)]' : 'text-[clamp(38px,13.8vw,54px)]'}`}>{rest}</span>
      </motion.span>
    </Tag>
  )
}

/** Stacked variant used by "DRESS / CODE" (rest wraps under the initial line). */
export function StackedTitle({
  initial,
  first,
  second,
  color = 'text-gold',
  initialFont = 'belfast',
}: {
  initial: string
  first: string
  second: string
  color?: string
  initialFont?: 'belfast' | 'script'
}) {
  return (
    <h2 className={`font-belfast text-center leading-[0.86] ${color}`} aria-label={`${initial}${first} ${second}`}>
      {initialFont === 'script' ? (
        <span aria-hidden="true" className="inline-flex items-baseline justify-center">
          <span className="font-script italic text-[clamp(44px,14vw,64px)] leading-none mr-[-0.03em] select-none">{initial}</span>
          <span className="font-belfast text-[clamp(30px,9.5vw,46px)] font-normal tracking-[0.02em] leading-none">{first}</span>
        </span>
      ) : (
        <span aria-hidden="true" className="block font-belfast text-[clamp(30px,9.5vw,46px)] font-normal tracking-[0.02em] leading-none">
          {initial}{first}
        </span>
      )}
      <span aria-hidden="true" className="block font-belfast text-[clamp(30px,9.5vw,46px)] font-normal tracking-[0.02em] leading-none mt-1 sm:mt-1.5">
        {second}
      </span>
    </h2>
  )
}
