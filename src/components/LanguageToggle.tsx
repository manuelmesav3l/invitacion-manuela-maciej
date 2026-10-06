import { motion } from 'motion/react'
import { useLanguage } from '../context/LanguageContext'

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  return (
    <aside
      className="fixed bottom-5 right-4 z-40 sm:bottom-6 sm:right-6 select-none"
      aria-label="Selección de idioma / Language selector"
    >
      <div className="flex items-center rounded-full bg-cream/92 p-1 shadow-[0_8px_26px_-4px_rgba(60,50,20,0.28)] backdrop-blur-md border border-gold/50 transition-shadow hover:shadow-[0_10px_30px_-4px_rgba(60,50,20,0.35)]">
        <button
          type="button"
          onClick={() => setLocale('en')}
          aria-label="View invitation in English"
          aria-pressed={locale === 'en'}
          className={`relative flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-caps tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            locale === 'en'
              ? 'bg-olive-deep text-[#f8f1e2] shadow-sm font-semibold'
              : 'text-ink/75 hover:text-olive-deep hover:bg-black/5'
          }`}
        >
          {locale === 'en' && (
            <motion.span
              layoutId="lang-active-pill"
              className="absolute inset-0 rounded-full bg-olive-deep -z-10"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <span>EN</span>
        </button>

        <button
          type="button"
          onClick={() => setLocale('pl')}
          aria-label="Zobacz zaproszenie w języku polskim (Polski)"
          aria-pressed={locale === 'pl'}
          className={`relative flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-caps tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            locale === 'pl'
              ? 'bg-olive-deep text-[#f8f1e2] shadow-sm font-semibold'
              : 'text-ink/75 hover:text-olive-deep hover:bg-black/5'
          }`}
        >
          {locale === 'pl' && (
            <motion.span
              layoutId="lang-active-pill"
              className="absolute inset-0 rounded-full bg-olive-deep -z-10"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <span className="text-[12px] leading-none" aria-hidden="true">🇵🇱</span>
          <span>PL</span>
        </button>
      </div>
    </aside>
  )
}
