"use client"

import { createContext, useContext, useMemo, useState } from "react"

type Language = "es" | "pt" | "en"

type Translations = {
  categories: {
    title: string
    subtitle: string

    homeDecor: string
    homeDecorDesc: string

    toys: string
    toysDesc: string

    sensoryObjects: string
    sensoryObjectsDesc: string

    biodegradable: string
    biodegradableDesc: string

    accessories: string
    accessoriesDesc: string
  }
}

const translations: Record<Language, Translations> = {
  es: {
    categories: {
      title: "Nuestras Categorías",
      subtitle: "Productos sostenibles hechos con materiales biodegradables",

      homeDecor: "Decoración del Hogar",
      homeDecorDesc: "Jarrones, lámparas, organizadores y mucho más",

      toys: "Juguetes",
      toysDesc: "Diversión creativa y educativa para todas las edades",

      sensoryObjects: "Objetos Sensoriales",
      sensoryObjectsDesc: "Estimulación táctil y desarrollo cognitivo",

      biodegradable: "Materiales Biodegradables",
      biodegradableDesc: "Sostenibilidad en cada impresión",

      accessories: "Accesorios",
      accessoriesDesc: "Accesorios y soportes impresos en 3D para dispositivos modernos",
    },
  },

  pt: {
    categories: {
      title: "Nossas Categorias",
      subtitle: "Produtos sustentáveis feitos com materiais biodegradáveis",

      homeDecor: "Decoração do Lar",
      homeDecorDesc: "Vasos, luminárias, organizadores e muito mais",

      toys: "Brinquedos",
      toysDesc: "Diversão criativa e educativa para todas as idades",

      sensoryObjects: "Objetos Sensoriais",
      sensoryObjectsDesc: "Estimulação tátil e desenvolvimento cognitivo",

      biodegradable: "Materiais Biodegradáveis",
      biodegradableDesc: "Sustentabilidade em cada impressão",

      accessories: "Acessórios",
      accessoriesDesc: "Acessórios e suportes impressos em 3D para dispositivos modernos",
    },
  },

  en: {
    categories: {
      title: "Our Categories",
      subtitle: "Sustainable products made with biodegradable materials",

      homeDecor: "Home Decor",
      homeDecorDesc: "Vases, lamps, organizers and much more",

      toys: "Toys",
      toysDesc: "Creative and educational fun for all ages",

      sensoryObjects: "Sensory Objects",
      sensoryObjectsDesc: "Tactile stimulation and cognitive development",

      biodegradable: "Biodegradable Materials",
      biodegradableDesc: "Sustainability in every print",

      accessories: "Accessories",
      accessoriesDesc: "3D printed accessories and stands for modern devices",
    },
  },
}

type LanguageContextValue = {
  language: Language
  locale: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      locale: language, // ✅ compat: partes do site ainda usam "locale"
      setLanguage,
      t: translations[language],
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
