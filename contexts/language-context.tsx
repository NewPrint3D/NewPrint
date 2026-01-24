"use client"

import { createContext, useContext, useMemo, useState, ReactNode } from "react"

export type Language = "pt" | "en" | "es"

export type Translations = {
  common: {
    loading: string
  }

  auth: {
    login: string
    logout: string
    welcome: string
  }

  navbar: {
    home: string
    products: string
    about: string
    contact: string
    admin: string
  }

  categories: {
    decor: string
    decorDesc: string
    accessories: string
    accessoriesDesc: string
  }

  admin: {
    dashboard: string
    welcomeBack: string
  }
}

const translations: Record<Language, Translations> = {
  pt: {
    common: { loading: "Carregando..." },
    auth: { login: "Entrar", logout: "Sair", welcome: "Bem-vindo" },
    navbar: { home: "Início", products: "Produtos", about: "Sobre", contact: "Contato", admin: "Admin" },
    categories: {
      decor: "Decoração",
      decorDesc: "Peças decorativas modernas e exclusivas",
      accessories: "Acessórios",
      accessoriesDesc: "Acessórios personalizados impressos em 3D",
    },
    admin: {
      dashboard: "Painel administrativo",
      welcomeBack: "Bem-vindo de volta, {name}",
    },
  },

  es: {
    common: { loading: "Cargando..." },
    auth: { login: "Entrar", logout: "Salir", welcome: "Bienvenido" },
    navbar: { home: "Inicio", products: "Productos", about: "Sobre nosotros", contact: "Contacto", admin: "Admin" },
    categories: {
      decor: "Decoración",
      decorDesc: "Piezas decorativas modernas y exclusivas",
      accessories: "Accesorios",
      accessoriesDesc: "Accesorios personalizados impresos en 3D",
    },
    admin: {
      dashboard: "Panel de administración",
      welcomeBack: "Bienvenido de nuevo, {name}",
    },
  },

  en: {
    common: { loading: "Loading..." },
    auth: { login: "Login", logout: "Logout", welcome: "Welcome" },
    navbar: { home: "Home", products: "Products", about: "About", contact: "Contact", admin: "Admin" },
    categories: {
      decor: "Decor",
      decorDesc: "Modern and exclusive decorative pieces",
      accessories: "Accessories",
      accessoriesDesc: "Personalized 3D printed accessories",
    },
    admin: {
      dashboard: "Admin dashboard",
      welcomeBack: "Welcome back, {name}",
    },
  },
}

type LanguageContextType = {
  language: Language
  /** Compat: alguns arquivos usam "locale" */
  locale: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const value = useMemo(
    () => ({
      language,
      locale: language, // <- compatibilidade
      setLanguage,
      t: translations[language],
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}
