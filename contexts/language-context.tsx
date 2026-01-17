"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { defaultLocale, getTranslations, locales, type Locale, translations } from "@/lib/i18n"

type TranslationShape = typeof translations[typeof defaultLocale]

type LanguageContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: TranslationShape
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("locale")
      if (saved && (locales as string[]).includes(saved)) {
        setLocaleState(saved as Locale)
      }
    } catch {}
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem("locale", l)
    } catch {}
  }

  // 🔒 Força SEMPRE um tipo único (evita erro "Property 'admin' does not exist...")
  const t = useMemo(() => getTranslations(locale) as TranslationShape, [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return ctx
}
