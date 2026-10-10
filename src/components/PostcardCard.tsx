import { motion, useReducedMotion } from 'motion/react'
import { useLanguage } from '../context/LanguageContext'

export function PostcardCard({ className = '', show }: { className?: string; show: boolean }) {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const { postcard } = t.medellin
  return (
    <motion.figure
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: -160, rotate: -30 }}
      animate={show ? { opacity: 1, x: 0, rotate: -20 } : undefined}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className={`absolute m-0 aspect-[3/2] bg-[#f7f0e2] shadow-[0_14px_28px_-10px_rgba(60,45,20,.45)] ${className}`}
      aria-label={`${postcard.place}. ${postcard.text}`}
    >
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-[1.1fr_1fr] gap-3 p-[6%] text-gold">
        <div className="pt-3">
          <p className="label !text-[8px] !tracking-[0.3em] text-olive-deep">{postcard.place}</p>
          <p className="mt-2 font-serif text-[9px] leading-snug tracking-wide">{postcard.text}</p>
        </div>
        <div className="relative border-l border-gold/40 pl-3 pt-4">
          <div className="absolute right-0 top-0 h-[26%] w-[24%] border border-gold/60 p-[2px]"><div className="h-full w-full border border-gold/30" /></div>
          {[0, 1, 2, 3].map((i) => <div key={i} className="mt-[22%] h-px bg-gold/50 first:mt-[42%]" />)}
        </div>
      </div>
    </motion.figure>
  )
}
