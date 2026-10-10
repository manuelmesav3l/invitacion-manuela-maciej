import { motion, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { PhotoSlot } from './PhotoSlot'

interface Props {
  photo: { alt: string; src: string; tone: string[] }
  rotate: number
  className?: string
  delay?: number
  z: number
  onFront: () => void
  constraintsRef: React.RefObject<HTMLElement | null>
  /** Board-level in-view flag (cards start off-slot, so they can't observe themselves). */
  show: boolean
}

export function PolaroidCard({ photo, rotate, className = '', delay = 0, z, onFront, constraintsRef, show }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  return (
    <motion.div
      ref={ref}
      drag={!reduce}
      dragConstraints={constraintsRef}
      dragElastic={0.2}
      dragMomentum={false}
      onPointerDown={onFront}
      whileDrag={{ scale: 1.05 }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -280, rotate: rotate - 25 }}
      animate={show ? { opacity: 1, y: 0, rotate } : undefined}
      transition={reduce ? { duration: 0.5 } : { type: 'spring', stiffness: 70, damping: 11, delay }}
      style={{ zIndex: z, touchAction: 'pan-y' }}
      className={`group absolute bg-white p-[3.5%] pb-[4%] shadow-[0_14px_28px_-10px_rgba(60,45,20,.45)] ${className}`}
    >
      <PhotoSlot src={photo.src} alt={photo.alt} tone={photo.tone} width={3} height={4} className="pointer-events-none" />
    </motion.div>
  )
}
