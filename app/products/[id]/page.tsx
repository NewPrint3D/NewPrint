import type { Metadata } from "next"
import { getProductById, getProductsByCategory } from "@/lib/db-products"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "./product-detail-client"
import type { Product } from "@/lib/db-products"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newprint3d.com"
  const productUrl = `${baseUrl}/products/${resolvedParams.id}`

  return {
    title: "Produto | NewPrint3D",
    description: "Produto personalizado da NewPrint3D",
    alternates: { canonical: productUrl },
  }
}

/* =========================
   TODO o resto continua igual
   ========================= */

function toNumber(v: unknown, fallback = 0) {
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string") {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }
  return fallback
}

function normalizeHex(input: unknown): string | null {
  if (typeof input !== "string") return null
  const s = input.trim().toLowerCase()
  if (!s) return null

  const hex = s.startsWith("#") ? s.slice(1) : s
  if (!/^[0-9a-f]{6}$/.test(hex)) return null

  return `#${hex}`
}

function hexToFileName(hexWithHash: string): string {
  return hexWithHash.replace("#", "").toLowerCase()
}

function colorNameFromHex(hexWithHash: string) {
  const hex = hexToFileName(hexWithHash)

  const map: Record<string, { pt: string; en: string; es: string }> = {
    "000000": { pt: "Preto", en: "Black", es: "Negro" },
    "ffffff": { pt: "Branco", en: "White", es: "Blanco" },
    "d32f2f": { pt: "Vermelho", en: "Red", es: "Rojo" },
    "212121": { pt: "Cinza", en: "Gray", es: "Gris" },
    "fbc02d": { pt: "Amarelo", en: "Yellow", es: "Amarillo" },
  }

  return map[hex] ?? {
    pt: "Cor selecionada",
    en: "Selected color",
    es: "Color seleccionada",
  }
}

function normalizeProduct(raw: any): Product {
  return raw as Product
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params
  const raw = await getProductById(resolvedParams.id)

  if (!raw) notFound()

  const product = normalizeProduct(raw)

  const relatedRaw = await getProductsByCategory(product.category)
  const related = (relatedRaw || []).filter((p: any) => p.id !== product.id).slice(0, 3)

  return <ProductDetailClient product={product} relatedProducts={related} />
}
