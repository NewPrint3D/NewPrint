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

function normalizeHex(input: unknown): string | null {
  if (typeof input !== "string") return null
  const s = input.trim().toLowerCase()
  if (!s) return null

  // Accept: "#d32f2f" or "d32f2f"
  const hex = s.startsWith("#") ? s.slice(1) : s
  if (!/^[0-9a-f]{6}$/.test(hex)) return null

  return `#${hex}`
}

function hexToFileName(hexWithHash: string): string {
  return hexWithHash.replace("#", "").toLowerCase()
}

// Nomes “bons” para conversão (fallback elegante)
function colorNameFromHex(hexWithHash: string) {
  const hex = hexToFileName(hexWithHash)

  const map: Record<
    string,
    { pt: string; en: string; es: string }
  > = {
    "000000": { pt: "Preto", en: "Black", es: "Negro" },
    "ffffff": { pt: "Branco", en: "White", es: "Blanco" },
    "f5f5f5": { pt: "Branco", en: "White", es: "Blanco" },
    "d32f2f": { pt: "Vermelho", en: "Red", es: "Rojo" },
    "ff0000": { pt: "Vermelho", en: "Red", es: "Rojo" },
    "212121": { pt: "Cinza", en: "Gray", es: "Gris" },
    "808080": { pt: "Cinza", en: "Gray", es: "Gris" },
  }

  return (
    map[hex] ?? {
      pt: "Cor selecionada",
      en: "Selected color",
      es: "Color seleccionada",
    }
  )
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

  // 1) Captura do admin (se existir)
  const imagesByColorFromAdmin: Record<string, string> = {}
  for (const item of colorImagesArray) {
    const cRaw = item?.color ?? item?.color_hex ?? item?.hex ?? item?.colorHex
    const c = normalizeHex(cRaw)
    const u = item?.url ?? item?.image_url ?? item?.imageUrl ?? item?.image
    if (c && typeof u === "string" && u) {
      imagesByColorFromAdmin[c] = u
    }
  }

  // 2) Cores: prioridade
  const rawColors = Array.isArray(raw?.colors) ? raw.colors : []
  const normalizedRawColors = rawColors
    .map((c: any) => normalizeHex(c))
    .filter(Boolean) as string[]

  const derivedColors = Object.keys(imagesByColorFromAdmin)
  const colors =
    normalizedRawColors.length >= derivedColors.length && normalizedRawColors.length > 0
      ? normalizedRawColors
      : derivedColors.length > 0
        ? derivedColors
        : ["#000000"]

  // 3) Fonte da verdade para imagens do site:
  //    sempre aponta para /products/{id}/colors/{hex}.webp
  //    (assim imagem e cor ficam “casadas” pelo HEX)
  const imagesByColor: Record<string, string> = {}
  for (const c of colors) {
    const file = hexToFileName(c)
    imagesByColor[c] = `/products/${raw?.id}/colors/${file}.webp`
  }

  // 4) Metadados de cor para UI e carrinho (nome + hex + imagem)
  //    (o client vai usar isso para selecionar cor clicando na imagem, sem bolinhas)
  const colorOptions = colors.map((c) => {
    const names = colorNameFromHex(c)
    return {
      hex: c,
      file: hexToFileName(c),
      image: imagesByColor[c],
      name: names, // {pt,en,es}
    }
  })

  return {
    id: raw?.id,
    name,
    description,
    category: raw?.category ?? "general",
    featured: Boolean(raw?.featured),
    basePrice,
    image: image || "/placeholder.svg",
    colors,
    sizes: sizes.length ? sizes : ["Standard"],
    materials: materials.length ? materials : ["PLA"],

    // Mantém compatibilidade com o client atual:
    ...(Object.keys(imagesByColor).length ? { imagesByColor } : {}),

    // Mantém o que veio do admin (caso você queira usar em algum lugar):
    ...(colorImagesArray?.length ? { color_images: colorImagesArray } : {}),

    // EXTRA (para a correção do fluxo de cor por imagem + carrinho):
    ...(colorOptions.length ? ({ colorOptions } as any) : {}),

    ...(Array.isArray(raw?.variants) ? { variants: raw.variants } : {}),
  } as Product
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const raw = await getProductById(resolvedParams.id)
  const product = raw ? normalizeProduct(raw as any) : null

  if (!product) return { title: "Product Not Found" }

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
    alternates: { canonical: productUrl },
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
