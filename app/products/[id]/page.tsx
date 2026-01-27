import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PHASE_PRODUCTION_BUILD } from "next/constants"

import { getProductById, getProductsByCategory } from "@/lib/db-products"
import { ProductDetailClient } from "./product-detail-client"
import type { Product } from "@/lib/db-products"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newprint3d.com"
  const productUrl = `${baseUrl}/products/${params.id}`

  return {
    title: "Produto | NewPrint3D",
    description: "Produto personalizado da NewPrint3D",
    alternates: { canonical: productUrl },
  }
}

function normalizeProduct(raw: any): Product {
  return raw as Product
}

export default async function ProductDetailPage({ params }: Props) {
  // ✅ Evita quebra do build: Next às vezes tenta "collect page data" no build
  // e isso não pode depender de DB.
  const isBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
  if (isBuild) {
    // Render real acontece em runtime (Render). Aqui só precisamos não quebrar o build.
    return null
  }

  let raw: any
  try {
    raw = await getProductById(params.id)
  } catch {
    // Se DB falhar por qualquer motivo, não derruba o servidor nem o build.
    return notFound()
  }

  if (!raw) return notFound()

  const product = normalizeProduct(raw)

  let related: Product[] = []
  try {
    const relatedRaw = await getProductsByCategory(product.category)
    related = (relatedRaw || [])
      .filter((p: any) => p.id !== product.id)
      .slice(0, 3)
      .map(normalizeProduct)
  } catch {
    related = []
  }

  return <ProductDetailClient product={product} relatedProducts={related} />
}
