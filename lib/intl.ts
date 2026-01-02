import { currencyByLocale, langTag, type SupportedLocale } from './locale'

export const formatCurrency = (value: number, locale: SupportedLocale): string => {
  try {
    return new Intl.NumberFormat(langTag[locale], {
      style: 'currency',
      currency: currencyByLocale[locale],
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } catch (error) {
    // Fallback para USD se houver erro
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value)
  }
}

export const formatDate = (iso: string | number | Date, locale: SupportedLocale): string => {
  try {
    return new Intl.DateTimeFormat(langTag[locale], {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch (error) {
    // Fallback para formato ISO se houver erro
    return new Date(iso).toLocaleString()
  }
}
