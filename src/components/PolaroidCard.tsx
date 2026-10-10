import { motion, useReducedMotion } from 'motion/react'
import { PhotoSlot } from './PhotoSlot'

interface Props {
  photo: { alt: string; src: string; tone: string[] }
  rotate: number
  className?: string
  delay?: number
  z: number
  /** Board-level in-view flag (cards start off-slot, so they can't observe themselves). */
  show: boolean
}

export function PolaroidCard({ photo, rotate, className = '', delay = 0, z, show }: Props) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -110, rotate: rotate - 14 }}
      animate={show ? { opacity: 1, y: 0, rotate } : undefined}
      transition={reduce ? { duration: 0.5 } : { type: 'spring', stiffness: 70, damping: 11, delay }}
      style={{ zIndex: z }}
      className={`group absolute bg-white p-[3.5%] pb-[4%] shadow-[0_14px_28px_-10px_rgba(60,45,20,.45)] ${className}`}
    >
      <PhotoSlot src={photo.src} alt={photo.alt} tone={photo.tone} width={3} height={4} className="pointer-events-none" />
    </motion.div>
  )
}

