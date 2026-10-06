import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations, type Locale } from '../content/content'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: typeof translations.en
}

const STORAGE_KEY = 'wedding_invitation_locale'

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale
      if (saved === 'en' || saved === 'pl') return saved
    } catch {
      // Ignore localStorage errors in restricted environments
    }
    return 'en'
  })

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // Ignore localStorage errors
    }
    document.documentElement.lang = l
  }

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'pl' : 'en')
  }

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const t = translations[locale] || translations.en

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      toggleLocale: () => {},
      t: translations.en,
    }
  }
  return ctx
}
