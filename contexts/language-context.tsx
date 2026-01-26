"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type Language = "pt" | "en" | "es"

export type Translations = {
  common: {
    loading: string
  }

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
    technology3d: string
    technology3dDesc: string
  }

  products: {
    title: string
    subtitle: string
  }

  admin: {
    failedToLoad: string
    networkError: string
    demoAuthWarning: string
  }
}

const translations: Record<Language, Translations> = {
  pt: {
    common: { loading: "Carregando..." },
    categories: {
      title: "Categorias",
      subtitle: "Explore nossos produtos impressos em 3D",
      homeDecor: "Decoração do Lar",
      homeDecorDesc: "Vasos, organizadores e itens decorativos",
      toys: "Brinquedos",
      toysDesc: "Diversão criativa para todas as idades",
      sensoryObjects: "Objetos Sensoriais",
      sensoryObjectsDesc: "Estímulo tátil e cognitivo",
      biodegradable: "Materiais Biodegradáveis",
      biodegradableDesc: "Sustentabilidade em cada impressão",
      technology3d: "Tecnologia 3D",
      technology3dDesc: "Acessórios e suportes impressos em 3D",
    },
    products: {
      title: "Produtos",
      subtitle: "Escolha o modelo ideal para você",
    },
    admin: {
      failedToLoad: "Falha ao carregar os dados",
      networkError: "Erro de rede. Tente novamente.",
      demoAuthWarning: "Aviso: autenticação em modo demonstração.",
    },
  },

  es: {
    common: { loading: "Cargando..." },
    categories: {
      title: "Categorías",
      subtitle: "Explora nuestros productos impresos en 3D",
      homeDecor: "Decoración del Hogar",
      homeDecorDesc: "Jarrones, organizadores y mucho más",
      toys: "Juguetes",
      toysDesc: "Diversión creativa y educativa para todas las edades",
      sensoryObjects: "Objetos Sensoriales",
      sensoryObjectsDesc: "Estimulación táctil y desarrollo cognitivo",
      biodegradable: "Materiales Biodegradables",
      biodegradableDesc: "Sostenibilidad en cada impresión",
      technology3d: "Tecnología 3D",
      technology3dDesc: "Accesorios y soportes impresos en 3D",
    },
    products: {
      title: "Productos",
      subtitle: "Elige el modelo ideal para ti",
    },
    admin: {
      failedToLoad: "Error al cargar los datos",
      networkError: "Error de red. Inténtalo de nuevo.",
      demoAuthWarning: "Aviso: autenticación en modo demostración.",
    },
  },

  en: {
    common: { loading: "Loading..." },
    categories: {
      title: "Categories",
      subtitle: "Explore our 3D printed products",
      homeDecor: "Home Decor",
      homeDecorDesc: "Vases, organizers and more",
      toys: "Toys",
      toysDesc: "Creative and educational fun for all ages",
      sensoryObjects: "Sensory Objects",
      sensoryObjectsDesc: "Tactile stimulation and cognitive development",
      biodegradable: "Biodegradable Materials",
      biodegradableDesc: "Sustainability in every print",
      technology3d: "3D Technology",
      technology3dDesc: "3D printed accessories and mounts",
    },
    products: {
      title: "Products",
      subtitle: "Choose the perfect model for you",
    },
    admin: {
      failedToLoad: "Failed to load data",
      networkError: "Network error. Please try again.",
      demoAuthWarning: "Warning: authentication is running in demo mode.",
    },
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}
