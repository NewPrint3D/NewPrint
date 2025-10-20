export interface Product {
  id: string
  name: {
    en: string
    pt: string
    es: string
  }
  description: {
    en: string
    pt: string
    es: string
  }
  category: string
  basePrice: number
  image: string
  model?: string
  colors: string[]
  sizes: string[]
  materials: string[]
  featured: boolean
}

import productsData from "@/data/products.json"

export const products: Product[] = productsData as Product[]

export function getProductsByCategory(category?: string) {
  if (!category) return products
  return products.filter((p) => p.category === category)
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured)
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}
