import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface Props {
  variant?: 'gold' | 'green'
  icon?: ReactNode
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  delay?: number
  ariaHaspopup?: 'dialog'
}

export function PillButton({ variant = 'gold', icon, children, href, onClick, className = '', delay = 0, ariaHaspopup }: Props) {
  const reduce = useReducedMotion()
  const bg = variant === 'gold' ? 'bg-gold' : 'bg-olive-deep'
  const cls = `group inline-flex items-center justify-center gap-2.5 rounded-full ${bg} px-6 py-3 min-[380px]:px-7 min-h-[44px] text-[#f8f1e2] label text-[12px] shadow-[0_6px_16px_-8px_rgba(60,50,20,.5)] transition-transform active:scale-[0.96] hover:scale-[1.03] touch-manipulation select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${className}`
  const inner = (
    <>
      {icon && <span className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">{icon}</span>}
      <span>{children}</span>
    </>
  )
  const motionProps = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.9 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: '-5% 0px' },
    transition: reduce ? { duration: 0.4 } : { type: 'spring' as const, stiffness: 180, damping: 12, delay },
  }
  return href ? (
    <motion.a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...motionProps}>{inner}</motion.a>
  ) : (
    <motion.button type="button" onClick={onClick} aria-haspopup={ariaHaspopup} className={cls} {...motionProps}>{inner}</motion.button>
  )
}
