import { neon } from "@neondatabase/serverless"

// Modo demonstração: Se DATABASE_URL não estiver configurada, o sistema funcionará com dados locais
const DATABASE_URL = process.env.DATABASE_URL

// Criar cliente SQL do Neon apenas se DATABASE_URL estiver configurada
export const sql = DATABASE_URL ? neon(DATABASE_URL) : null

// Flag para verificar se está em modo demonstração
export const isDemoMode = !DATABASE_URL

// Função auxiliar para log em modo demo
export function logDemoMode(operation: string) {
  if (isDemoMode) {
    console.log(`[DEMO MODE] ${operation} - usando dados locais`)
  }
}

// Tipos do banco de dados
export interface User {
  id: number
  email: string
  password_hash: string
  first_name: string
  last_name: string
  phone?: string
  role: "customer" | "admin"
  created_at: Date
  updated_at: Date
}

export interface Address {
  id: number
  user_id: number
  address_line: string
  city: string
  state: string
  zip_code: string
  country: string
  is_default: boolean
  created_at: Date
}

export interface Product {
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
  active: boolean
  stock_quantity: number
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: number
  user_id?: number
  order_number: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  shipping: number
  tax: number
  total: number
  shipping_first_name: string
  shipping_last_name: string
  shipping_email: string
  shipping_phone: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip_code: string
  shipping_country: string
  payment_method: string
  payment_status: "pending" | "paid" | "failed" | "refunded"
  stripe_payment_intent_id?: string
  created_at: Date
  updated_at: Date
}

export interface OrderItem {
  id: number
  order_id: number
  product_id?: number
  product_name: string
  quantity: number
  unit_price: number
  selected_color?: string
  selected_size?: string
  selected_material?: string
  subtotal: number
  created_at: Date
}
