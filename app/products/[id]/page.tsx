import type { Metadata } from "next"
import { getProductsByCategory } from "@/lib/db-products"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "./product-detail-client"

type Props = {
  params: Promise<{ id: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://newprint3d.com"

// ✅ Busca o produto pela API (que já retorna variants + color_images)
async function fetchProductById(id: string) {
  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) return null
  return res.json()
}

  export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const product = await fetchProductById(resolvedParams.id)

  if (!product) {
    return { title: "Product Not Found" }
  }

  const productUrl = `${baseUrl}/products/${product.id}`

  return {
    title: product.name?.en ?? "Product",
    description: product.description?.en ?? "",
    openGraph: {
      title: product.name?.en ?? "Product",
      description: product.description?.en ?? "",
      type: "website",
      url: productUrl,
      images: product.image ? [{ url: product.image, alt: product.name?.en ?? "Product" }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name?.en ?? "Product",
      description: product.description?.en ?? "",
      images: product.image ? [product.image] : [],
    },
    alternates: {
      canonical: productUrl,
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
 const resolvedParams = await params
const product = await fetchProductById(resolvedParams.id)

  if (!product) {
    notFound()
  }

  const allRelatedProducts = await getProductsByCategory(product.category)
  const relatedProducts = allRelatedProducts.filter((p) => p.id !== product.id).slice(0, 3)

  // JSON-LD structured data for Product
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name?.en ?? "",
    description: product.description?.en ?? "",
    image: product.image || `${baseUrl}/placeholder.svg`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "NewPrint3D",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.id}`,
      priceCurrency: "EUR",
      price: Number(product.basePrice || 0).toFixed(2),
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
