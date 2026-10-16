import { motion, useAnimationControls, useReducedMotion } from 'motion/react'

export function SwatchDot({ color, index, label, className = 'w-[16%]' }: { color: string; index: number; label: string; className?: string }) {
  const reduce = useReducedMotion()
  const controls = useAnimationControls()
  const wiggle = () => { if (!reduce) controls.start({ rotate: [0, -18, 14, -8, 0], scale: [1, 1.12, 1], transition: { duration: 0.5 } }) }
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={wiggle}
      animate={controls}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 14, delay: index * 0.08 }}
      className={`relative block h-auto rounded-full border-0 p-0 ${className}`}
      style={{ background: color, aspectRatio: '1 / 1' }}
    />
  )
}
