// /lib/i18n.ts

export type Locale = "en" | "pt" | "es"

export const locales: Locale[] = ["en", "pt", "es"]
export const defaultLocale: Locale = "es"

export const localeNames: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
}

const base = {
  common: {
    featured: "Featured",
  },

  cta: {
    view: "View",
    edit: "Edit",
  },

  product: {
    related: "Related products",
  },

  productsPage: {
    title: "Products",
    description: "Browse all products",
  },

  auth: {
    loggingIn: "Signing in...",
    loginButton: "Login",
    noAccount: "Don't have an account?",
    signUpHere: "Sign up",
  },

  admin: {
    products: "Products",
    manageCatalog: "Manage catalog",
    addProduct: "Add product",
    noProducts: "No products",
    noProductsHelper: "Create your first product",
    orderNumber: "Order",
    demoAuthWarning: "Demo mode",
    failedToLoad: "Failed to load",
    networkError: "Network error",
    deleteConfirm: "Are you sure?",
  },
}

export const translations = {
  en: {
    ...base,
  },
  pt: {
    ...base,
    common: { featured: "Destaque" },
    cta: { view: "Ver", edit: "Editar" },
    product: { related: "Produtos relacionados" },
    auth: {
      loggingIn: "Entrando...",
      loginButton: "Entrar",
      noAccount: "Não tem uma conta?",
      signUpHere: "Cadastre-se",
    },
  },
  es: {
    ...base,
    common: { featured: "Destacado" },
    cta: { view: "Ver", edit: "Editar" },
    product: { related: "Productos relacionados" },
    auth: {
      loggingIn: "Iniciando...",
      loginButton: "Iniciar sesión",
      noAccount: "¿No tienes una cuenta?",
      signUpHere: "Regístrate",
    },
  },
} as const

export type TranslationShape = (typeof translations)[typeof defaultLocale]

export function normalizeLocale(input?: string): Locale {
  if (!input) return defaultLocale
  const clean = input.toLowerCase().split("-")[0]
  return locales.includes(clean as Locale) ? (clean as Locale) : defaultLocale
}

export function getTranslations(locale?: string): TranslationShape {
  const normalized = normalizeLocale(locale)
  return translations[normalized]
}
