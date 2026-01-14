import type { Metadata } from "next"
import { getProductById, getProductsByCategory } from "@/lib/db-products"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "./product-detail-client"
import type { Product } from "@/lib/db-products"

type Props = {
  params: Promise<{ id: string }>
}

function toNumber(v: unknown, fallback = 0) {
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string") {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }
  return fallback
}

function normalizeProduct(raw: any): Product {
  const name =
    raw?.name && typeof raw.name === "object"
      ? raw.name
      : {
          en: raw?.name_en ?? raw?.nameEn ?? raw?.name ?? "Product",
          pt: raw?.name_pt ?? raw?.namePt ?? raw?.name ?? "Produto",
          es: raw?.name_es ?? raw?.nameEs ?? raw?.name ?? "Producto",
        }

  const description =
    raw?.description && typeof raw.description === "object"
      ? raw.description
      : {
          en: raw?.description_en ?? raw?.descriptionEn ?? raw?.description ?? "",
          pt: raw?.description_pt ?? raw?.descriptionPt ?? raw?.description ?? "",
          es: raw?.description_es ?? raw?.descriptionEs ?? raw?.description ?? "",
        }

  const image =
    raw?.image ??
    raw?.image_url ??
    raw?.imageUrl ??
    raw?.main_image ??
    raw?.mainImage ??
    ""

  const colors = Array.isArray(raw?.colors) ? raw.colors : []
  const sizes = Array.isArray(raw?.sizes) ? raw.sizes : []
  const materials = Array.isArray(raw?.materials) ? raw.materials : []

  const basePrice =
    raw?.basePrice != null
      ? toNumber(raw.basePrice, 0)
      : toNumber(raw?.base_price ?? raw?.price ?? 0, 0)

  const colorImagesArray = Array.isArray(raw?.color_images)
    ? raw.color_images
    : Array.isArray(raw?.colorImages)
      ? raw.colorImages
      : []

  const imagesByColor: Record<string, string> = {}
  for (const item of colorImagesArray) {
    const c = item?.color ?? item?.color_hex ?? item?.hex ?? item?.colorHex
    const u = item?.url ?? item?.image_url ?? item?.imageUrl ?? item?.image
    if (typeof c === "string" && typeof u === "string" && c && u) {
      imagesByColor[c] = u
    }
  }

  return {
    id: raw?.id,
    name,
    description,
    category: raw?.category ?? "general",
    featured: Boolean(raw?.featured),
    basePrice,
    image: image || "/placeholder.svg",
    colors: colors.length ? colors : ["#000000"],
    sizes: sizes.length ? sizes : ["Standard"],
    materials: materials.length ? materials : ["PLA"],
    ...(Object.keys(imagesByColor).length ? { imagesByColor } : {}),
    ...(colorImagesArray?.length ? { color_images: colorImagesArray } : {}),
    ...(Array.isArray(raw?.variants) ? { variants: raw.variants } : {}),
  } as Product
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const raw = await getProductById(resolvedParams.id)
  const product = raw ? normalizeProduct(raw as any) : null

  if (!product) {
    return { title: "Product Not Found" }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newprint3d.com"
  const productUrl = `${baseUrl}/products/${product.id}`

  return {
    title: product.name.en,
    description: product.description.en,
    openGraph: {
      title: product.name.en,
      description: product.description.en,
      type: "website",
      url: productUrl,
      images: product.image ? [{ url: product.image, alt: product.name.en }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name.en,
      description: product.description.en,
      images: product.image ? [product.image] : [],
    },
    alternates: {
      canonical: productUrl,
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params
  const raw = await getProductById(resolvedParams.id)

  if (!raw) notFound()

  const product = normalizeProduct(raw as any)

  const allRelatedRaw = await getProductsByCategory(product.category)
  const allRelated = (allRelatedRaw || []).map((p: any) => normalizeProduct(p))
  const relatedProducts = allRelated.filter((p) => p.id !== product.id).slice(0, 3)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newprint3d.com"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name.en,
    description: product.description.en,
    image: product.image || `${baseUrl}/placeholder.svg`,
    sku: String(product.id),
    brand: { "@type": "Brand", name: "NewPrint3D" },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.id}`,
      priceCurrency: "EUR",
      price: Number(product.basePrice).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "128",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  )
}
