// /lib/i18n.ts
export type Locale = "en" | "pt" | "es"

export const locales: Locale[] = ["en", "pt", "es"]
export const defaultLocale: Locale = "es"

const translations: Record<Locale, any> = {
  en: {},
  pt: {},
  es: {},
}

export function getTranslations(locale?: string) {
  const lang = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale

  const dict = translations[lang] || {}

  return new Proxy(dict, {
    get(target, prop) {
      if (typeof prop !== "string") return ""

      if (!(prop in target)) {
        // cria nível automaticamente
        target[prop] = new Proxy(
          {},
          {
            get(_, key) {
              return typeof key === "string" ? "" : ""
            },
          }
        )
      }

      return target[prop]
    },
  })
}
