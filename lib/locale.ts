export type SupportedLocale = 'pt' | 'en' | 'es'

export const currencyByLocale: Record<SupportedLocale, string> = {
  pt: 'BRL',
  en: 'USD',
  es: 'EUR',
}

export const langTag: Record<SupportedLocale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
}

export const localeToSupported = (locale: string): SupportedLocale => {
  if (locale === 'pt' || locale === 'pt-BR') return 'pt'
  if (locale === 'es' || locale === 'es-ES') return 'es'
  return 'en'
}
