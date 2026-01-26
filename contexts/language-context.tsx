
"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type Language = "pt" | "en" | "es"

type FeatureItem = {
  title: string
  description: string
}

export type AdminTranslations = Record<string, string> & {
  failedToLoad: string
  networkError: string
  demoAuthWarning: string
  failedToUpdate: string
  backToProducts: string
  editProduct: string
  editProductHelper: string
  productInformation: string
}

export type Translations = {
  common: {
    loading: string
    featured: string
  }

  cta: {
    view: string
    viewAll: string
    edit: string
    delete: string
    add: string
    create: string
    update: string
    confirm: string
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

  features: {
    title: string
    subtitle: string
    quality: FeatureItem
    customization: FeatureItem
    fastDelivery: FeatureItem
    support: FeatureItem
  }

  admin: AdminTranslations
}

const translations: Record<Language, Translations> = {
  pt: {
    common: { loading: "Carregando...", featured: "Destaque" },
    cta: {
      view: "Ver",
      viewAll: "Ver todos",
      edit: "Editar",
      delete: "Excluir",
      add: "Adicionar",
      create: "Criar",
      update: "Atualizar",
      confirm: "Confirmar",
    },
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
    features: {
      title: "Por que escolher a NewPrint",
      subtitle: "Qualidade, personalização e suporte em cada pedido",
      quality: {
        title: "Qualidade Premium",
        description: "Acabamento detalhado e impressão de alta precisão.",
      },
      customization: {
        title: "Personalização",
        description: "Cores e variações para combinar com seu estilo.",
      },
      fastDelivery: {
        title: "Produção Rápida",
        description: "Processo ágil para enviar o quanto antes.",
      },
      support: {
        title: "Suporte",
        description: "Atendimento para tirar dúvidas e ajudar no pedido.",
      },
    },
    admin: {
      failedToLoad: "Falha ao carregar os dados",
      networkError: "Erro de rede. Tente novamente.",
      demoAuthWarning: "Aviso: autenticação em modo demonstração.",
      failedToUpdate: "Falha ao atualizar. Tente novamente.",
      backToProducts: "Voltar aos produtos",
      editProduct: "Editar produto",
      editProductHelper: "Atualize as informações do produto e salve as alterações.",
      productInformation: "Informações do produto",

      save: "Salvar",
      saving: "Salvando...",
      cancel: "Cancelar",
      update: "Atualizar",
      name: "Nome",
      description: "Descrição",
      price: "Preço",
      category: "Categoria",
      stock: "Estoque",
      images: "Imagens",
    },
  },

  es: {
    common: { loading: "Cargando...", featured: "Destacado" },
    cta: {
      view: "Ver",
      viewAll: "Ver todos",
      edit: "Editar",
      delete: "Eliminar",
      add: "Añadir",
      create: "Crear",
      update: "Actualizar",
      confirm: "Confirmar",
    },
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
    features: {
      title: "Por qué elegir NewPrint",
      subtitle: "Calidad, personalización y soporte en cada pedido",
      quality: {
        title: "Calidad Premium",
        description: "Acabado detallado e impresión de alta precisión.",
      },
      customization: {
        title: "Personalización",
        description: "Colores y variaciones para tu estilo.",
      },
      fastDelivery: {
        title: "Producción Rápida",
        description: "Proceso ágil para enviar lo antes posible.",
      },
      support: {
        title: "Soporte",
        description: "Atención para ayudarte con tu pedido.",
      },
    },
    admin: {
      failedToLoad: "Error al cargar los datos",
      networkError: "Error de red. Inténtalo de nuevo.",
      demoAuthWarning: "Aviso: autenticación en modo demostración.",
      failedToUpdate: "Error al actualizar. Inténtalo de nuevo.",
      backToProducts: "Volver a productos",
      editProduct: "Editar producto",
      editProductHelper: "Actualiza la información del producto y guarda los cambios.",
      productInformation: "Información del producto",

      save: "Guardar",
      saving: "Guardando...",
      cancel: "Cancelar",
      update: "Actualizar",
      name: "Nombre",
      description: "Descripción",
      price: "Precio",
      category: "Categoría",
      stock: "Stock",
      images: "Imágenes",
    },
  },

  en: {
    common: { loading: "Loading...", featured: "Featured" },
    cta: {
      view: "View",
      viewAll: "View all",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      create: "Create",
      update: "Update",
      confirm: "Confirm",
    },
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
    features: {
      title: "Why choose NewPrint",
      subtitle: "Quality, customization and support on every order",
      quality: {
        title: "Premium Quality",
        description: "High-precision printing with a detailed finish.",
      },
      customization: {
        title: "Customization",
        description: "Colors and variations to match your style.",
      },
      fastDelivery: {
        title: "Fast Production",
        description: "Quick process to ship as soon as possible.",
      },
      support: {
        title: "Support",
        description: "Help and guidance for your order.",
      },
    },
    admin: {
      failedToLoad: "Failed to load data",
      networkError: "Network error. Please try again.",
      demoAuthWarning: "Warning: authentication is running in demo mode.",
      failedToUpdate: "Failed to update. Please try again.",
      backToProducts: "Back to products",
      editProduct: "Edit product",
      editProductHelper: "Update the product information and save changes.",
      productInformation: "Product information",

      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      update: "Update",
      name: "Name",
      description: "Description",
      price: "Price",
      category: "Category",
      stock: "Stock",
      images: "Images",
    },
  },
}

type LanguageContextType = {
  language: Language
  locale: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  return (
    <LanguageContext.Provider
      value={{
        language,
        locale: language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}
