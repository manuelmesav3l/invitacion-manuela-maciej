import { RsvpLogo } from './Ornaments'
import { useLanguage } from '../context/LanguageContext'

/** The "RSVP" wordmark button (hero + RSVP section): same size everywhere. Pass positioning via className. */
export function RsvpButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  const { t } = useLanguage()
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.hero.rsvpAria}
      aria-haspopup="dialog"
      className={`group min-h-[44px] min-w-[96px] sm:min-w-[112px] flex items-center justify-center cursor-pointer text-olive-deep transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105 hover:text-gold active:scale-95 active:text-[#937848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream-light rounded touch-manipulation select-none ${className}`}
    >
      <div className="w-[78px] min-[380px]:w-[88px] sm:w-[98px] lg:w-[108px] relative flex flex-col items-center">
        <RsvpLogo className="w-full h-auto block transition-all duration-300 drop-shadow-none group-hover:drop-shadow-[0_2px_10px_rgba(173,145,92,0.4)]" />
        {/* Hairline golden underline expanding smoothly on hover */}
        <span
          className="absolute -bottom-1 left-1/2 h-[1px] w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 scale-x-0 transition-all duration-400 ease-out group-hover:opacity-100 group-hover:scale-x-100 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </button>
  )
}
