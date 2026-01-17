"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { defaultLocale, getTranslations, type Locale, locales } from "@/lib/i18n"

type LanguageContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
  t: ReturnType<typeof getTranslations>
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  // carrega idioma salvo (se existir)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("locale") as Locale | null
      if (saved && locales.includes(saved)) setLocaleState(saved)
    } catch {}
  }, [])

  const setLocale = (next: Locale) => {
    if (!locales.includes(next)) return
    setLocaleState(next)
    try {
      localStorage.setItem("locale", next)
    } catch {}
  }

  const t = useMemo(() => getTranslations(locale), [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider")
  return ctx
}
