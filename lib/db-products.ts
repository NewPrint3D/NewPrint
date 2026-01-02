import { sql } from "@/lib/db"

export interface DBProduct {
  id: number
  name_en: string
  name_pt: string
  name_es: string
  description_en: string
  description_pt: string
  description_es: string
  category: string
  base_price: number
  image_url: string
  colors: string[]
  sizes: string[]
  materials: string[]
  featured: boolean
  stock_quantity: number
  active: boolean
  created_at: Date
  updated_at: Date
}

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
  colors: string[]
  sizes: string[]
  materials: string[]
  featured: boolean
  stock: number
  active: boolean
}

function normalizeProduct(dbProduct: DBProduct): Product {
  return {
    id: String(dbProduct.id),
    name: {
      en: dbProduct.name_en,
      pt: dbProduct.name_pt,
      es: dbProduct.name_es,
    },
    description: {
      en: dbProduct.description_en,
      pt: dbProduct.description_pt,
      es: dbProduct.description_es,
    },
    category: dbProduct.category,
    basePrice: Number(dbProduct.base_price),
    image: dbProduct.image_url,
    colors: Array.isArray(dbProduct.colors) ? dbProduct.colors : [],
    sizes: Array.isArray(dbProduct.sizes) ? dbProduct.sizes : [],
    materials: Array.isArray(dbProduct.materials) ? dbProduct.materials : [],
    featured: dbProduct.featured,
    stock: dbProduct.stock_quantity,
    active: dbProduct.active,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const result = await sql!`
      SELECT
        id, name_en, name_pt, name_es,
        description_en, description_pt, description_es,
        category, base_price, image_url, colors, sizes, materials,
        featured, stock_quantity, active, created_at, updated_at
      FROM products
      WHERE active = true
      ORDER BY created_at DESC
    `
    return result.map((row) => normalizeProduct(row as DBProduct))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const result = await sql!`
      SELECT
        id, name_en, name_pt, name_es,
        description_en, description_pt, description_es,
        category, base_price, image_url, colors, sizes, materials,
        featured, stock_quantity, active, created_at, updated_at
      FROM products
      WHERE id = ${id} AND active = true
      LIMIT 1
    `

    if (result.length === 0) {
      return null
    }

    return normalizeProduct(result[0] as DBProduct)
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const result = await sql!`
      SELECT
        id, name_en, name_pt, name_es,
        description_en, description_pt, description_es,
        category, base_price, image_url, colors, sizes, materials,
        featured, stock_quantity, active, created_at, updated_at
      FROM products
      WHERE featured = true AND active = true
      ORDER BY created_at DESC
      LIMIT 6
    `
    return result.map((row) => normalizeProduct(row as DBProduct))
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const result = await sql!`
      SELECT
        id, name_en, name_pt, name_es,
        description_en, description_pt, description_es,
        category, base_price, image_url, colors, sizes, materials,
        featured, stock_quantity, active, created_at, updated_at
      FROM products
      WHERE category = ${category} AND active = true
      ORDER BY created_at DESC
    `
    return result.map((row) => normalizeProduct(row as DBProduct))
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}
