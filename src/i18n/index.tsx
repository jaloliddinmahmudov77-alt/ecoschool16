import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { uz, type Dictionary } from './uz'

// Yangi til qo‘shish: ru.ts / en.ts faylini `uz` tuzilmasida yarating va shu yerga qo‘shing.
export const languages = { uz } satisfies Record<string, Dictionary>
export type Language = keyof typeof languages

interface I18nValue {
  lang: Language
  setLang: (lang: Language) => void
  t: Dictionary
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('uz')
  const value = useMemo(() => ({ lang, setLang, t: languages[lang] }), [lang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n I18nProvider ichida ishlatilishi kerak')
  return ctx
}
