import { motion, useReducedMotion } from 'motion/react'

interface Props {
  initial: string
  rest: string
  size?: 'md' | 'lg'
  color?: string
  scriptColor?: string
  as?: 'h1' | 'h2'
  className?: string
}

/** Script swash initial + high-contrast serif remainder ("𝒯HE VENUE"). */
export function SectionTitle({ initial, rest, size = 'md', color = 'text-gold', scriptColor, as: Tag = 'h2', className = '' }: Props) {
  const reduce = useReducedMotion()
  const big = size === 'lg'
  return (
    <Tag className={`relative inline-block font-serif leading-[0.9] ${color} ${className}`} aria-label={initial + rest}>
      <motion.span
        aria-hidden="true"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        <span className={`font-script align-baseline ${scriptColor ?? ''} ${big ? 'text-[clamp(62px,22.5vw,88px)]' : 'text-[clamp(56px,19vw,74px)]'} mr-[-0.05em] italic`}>{initial}</span>
        <span className="text-[clamp(38px,13.8vw,54px)] font-medium tracking-[0.02em]">{rest}</span>
      </motion.span>
    </Tag>
  )
}

/** Stacked variant used by "DRESS / CODE" (rest wraps under the initial line). */
export function StackedTitle({ initial, first, second, color = 'text-gold' }: { initial: string; first: string; second: string; color?: string }) {
  return (
    <h2 className={`font-serif leading-[0.86] ${color}`} aria-label={`${initial}${first} ${second}`}>
      <span aria-hidden="true" className="block">
        <span className="font-script italic text-[clamp(48px,15.9vw,62px)] mr-[-0.04em]">{initial}</span>
        <span className="text-[clamp(34px,11.8vw,46px)] font-medium tracking-[0.01em]">{first}</span>
      </span>
      <span aria-hidden="true" className="block text-[clamp(34px,11.8vw,46px)] font-medium tracking-[0.01em]">{second}</span>
    </h2>
  )
}
