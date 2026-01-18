"use client"

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react"
import { defaultLocale, getTranslations, locales, type Locale, type TranslationShape } from "@/lib/i18n"

type LanguageContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
  t: TranslationShape
}

// ✅ Fallback absoluto: mesmo se algum componente usar useLanguage() fora do Provider,
// nunca teremos `t` = undefined no prerender/build.
const fallbackValue: LanguageContextValue = {
  locale: defaultLocale,
  setLocale: () => {},
  t: getTranslations(defaultLocale),
}

const LanguageContext = createContext<LanguageContextValue>(fallbackValue)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("locale")
      if (saved && (locales as readonly string[]).includes(saved)) {
        setLocaleState(saved as Locale)
      }
    } catch {}
  }, [])

  const setLocale = useCallback((next: Locale) => {
    if (!(locales as readonly string[]).includes(next)) return
    setLocaleState(next)
    try {
      localStorage.setItem("locale", next)
    } catch {}
  }, [])

  const t = useMemo(() => getTranslations(locale), [locale])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  // ✅ Nunca lança erro no build/prerender.
  // Se o Provider não estiver aplicado em algum trecho, retorna fallback seguro.
  return useContext(LanguageContext)
}
