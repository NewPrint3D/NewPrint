"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, defaultLocale, getTranslations, locales } from "@/lib/i18n"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: ReturnType<typeof getTranslations>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [t, setT] = useState(getTranslations(defaultLocale))

  useEffect(() => {
    if (typeof window === "undefined") return

    const savedLocale = localStorage.getItem("locale")

    // só aceita idioma válido
    if (savedLocale && locales.includes(savedLocale as Locale)) {
      setLocaleState(savedLocale as Locale)
      setT(getTranslations(savedLocale as Locale))
    } else {
      // garante espanhol como padrão
      setLocaleState(defaultLocale)
      setT(getTranslations(defaultLocale))
      localStorage.setItem("locale", defaultLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    if (!locales.includes(newLocale)) return

    setLocaleState(newLocale)
    setT(getTranslations(newLocale))
    localStorage.setItem("locale", newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}
