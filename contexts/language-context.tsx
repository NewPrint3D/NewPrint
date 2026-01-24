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

    totalProducts: string
    totalOrders: string
    pendingOrders: string
    totalCustomers: string
    totalRevenue: string

    products: string
    orders: string
    customers: string
    revenue: string

    recentOrders: string
    viewAll: string
    status: string
    date: string
    customer: string
    total: string
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

      totalProducts: "Total de produtos",
      totalOrders: "Total de pedidos",
      pendingOrders: "Pedidos pendentes",
      totalCustomers: "Total de clientes",
      totalRevenue: "Faturamento total",

      products: "Produtos",
      orders: "Pedidos",
      customers: "Clientes",
      revenue: "Receita",

      recentOrders: "Pedidos recentes",
      viewAll: "Ver todos",
      status: "Status",
      date: "Data",
      customer: "Cliente",
      total: "Total",
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

      totalProducts: "Total de productos",
      totalOrders: "Total de pedidos",
      pendingOrders: "Pedidos pendientes",
      totalCustomers: "Total de clientes",
      totalRevenue: "Ingresos totales",

      products: "Productos",
      orders: "Pedidos",
      customers: "Clientes",
      revenue: "Ingresos",

      recentOrders: "Pedidos recientes",
      viewAll: "Ver todo",
      status: "Estado",
      date: "Fecha",
      customer: "Cliente",
      total: "Total",
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

      totalProducts: "Total products",
      totalOrders: "Total orders",
      pendingOrders: "Pending orders",
      totalCustomers: "Total customers",
      totalRevenue: "Total revenue",

      products: "Products",
      orders: "Orders",
      customers: "Customers",
      revenue: "Revenue",

      recentOrders: "Recent orders",
      viewAll: "View all",
      status: "Status",
      date: "Date",
      customer: "Customer",
      total: "Total",
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
      locale: language,
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
