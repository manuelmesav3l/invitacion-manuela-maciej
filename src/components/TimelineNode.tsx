import { forwardRef } from 'react'

interface Props { label: string; time: string; side: 'above' | 'below'; left: string }

/** Dot + stem + label. GSAP reveals `.tl-node` (dot) and `.tl-label` as the line reaches `left`. */
export const TimelineNode = forwardRef<HTMLDivElement, Props>(({ label, time, side, left }, ref) => (
  <div ref={ref} className="tl-item absolute top-1/2 w-0" style={{ left }}>
    <span className="tl-node absolute -left-[5px] -top-[5px] block h-[10px] w-[10px] rounded-full bg-olive-deep shadow-[0_0_0_2px_#e8d7c5]" />
    <div
      className={`tl-label absolute left-1/2 flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-olive-deep ${
        side === 'above' ? 'bottom-[12px] sm:bottom-[14px] flex-col-reverse' : 'top-[12px] sm:top-[14px]'
      }`}
    >
      <span className="label !text-[9px] sm:!text-[10px] !tracking-[0.22em] sm:!tracking-[0.26em]">{label}</span>
      <span className="font-serif text-[20px] sm:text-[24px] leading-none tracking-wider my-1 sm:my-1.5">{time}</span>
    </div>
  </div>
))
