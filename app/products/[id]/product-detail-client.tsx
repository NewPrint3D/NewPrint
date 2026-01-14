"use client"

import { useEffect, useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Product3DViewer } from "@/components/product-3d-viewer"
import { ProductCustomizer } from "@/components/product-customizer"
import { ProductCard } from "@/components/product-card"
import { useLanguage } from "@/contexts/language-context"
import type { Product } from "@/lib/db-products"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Truck, Shield, RefreshCw } from "lucide-react"

interface ProductDetailClientProps {
  product: any
  relatedProducts: Product[]
}

const safeNumber = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : (v as number)
  return Number.isFinite(n) ? n : 0
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()

  const safeProduct = product ?? {}
  const safeRelatedProducts = Array.isArray(relatedProducts) ? relatedProducts : []

  // ✅ Normaliza o produto para funcionar tanto com:
  // - camelCase (basePrice, colors, image)
  // - snake_case da API/admin (base_price, color_images)
  const normalized = useMemo(() => {
    const colorImages = Array.isArray(safeProduct?.color_images) ? safeProduct.color_images : []
    const colorsFromColorImages = colorImages.map((c: any) => c?.color).filter(Boolean).map(String)
    const uniqueColors = Array.from(new Set(colorsFromColorImages))

    const imageFromColorImages = colorImages?.[0]?.url ? String(colorImages[0].url) : undefined

    return {
      ...safeProduct,

      // preço
      basePrice: safeNumber(safeProduct?.basePrice ?? safeProduct?.base_price),

      // imagem principal
      image: safeProduct?.image ?? safeProduct?.main_image ?? imageFromColorImages ?? "/placeholder.svg",

      // cores
      colors: Array.isArray(safeProduct?.colors) && safeProduct.colors.length > 0 ? safeProduct.colors : uniqueColors,

      // garante arrays p/ não quebrar UI
      sizes: Array.isArray(safeProduct?.sizes) ? safeProduct.sizes : [],
      materials: Array.isArray(safeProduct?.materials) ? safeProduct.materials : [],

      // mantém o que veio da API
      color_images: colorImages,
    }
  }, [safeProduct])

  const storageKey = `np3d:product:${normalized?.id ?? "unknown"}:variant`

  // ✅ mapa cor -> url (prioriza API color_images)
  const colorImageMap = useMemo(() => {
    const map: Record<string, string> = {}

    if (Array.isArray(normalized?.color_images)) {
      for (const item of normalized.color_images) {
        if (item?.color && item?.url) map[String(item.color)] = String(item.url)
      }
    }

    // formatos antigos (se existirem)
    const alt =
      normalized?.imagesByColor || normalized?.colorImages || normalized?.imagesByVariantColor || null
    if (alt && typeof alt === "object") {
      for (const k of Object.keys(alt)) {
        if (alt[k]) map[String(k)] = String(alt[k])
      }
    }

    return map
  }, [normalized])

  const getImageForColor = (color?: string) => {
    if (color && colorImageMap[color]) return colorImageMap[color]
    return normalized?.image || "/placeholder.svg"
  }

  const availableColors = useMemo(() => {
    const fromColors = Array.isArray(normalized?.colors) ? normalized.colors.map(String) : []
    if (fromColors.length > 0) return fromColors

    const fromColorImages = Array.isArray(normalized?.color_images)
      ? normalized.color_images.map((c: any) => c?.color).filter(Boolean).map(String)
      : []

    return Array.from(new Set(fromColorImages))
  }, [normalized])

  const productName =
    normalized?.name?.[locale] ||
    (locale === "pt" ? normalized?.name_pt : locale === "es" ? normalized?.name_es : normalized?.name_en) ||
    normalized?.name_en ||
    normalized?.name_pt ||
    normalized?.name_es ||
    "Produto"

  const productDescription =
    normalized?.description?.[locale] ||
    (locale === "pt"
      ? normalized?.description_pt
      : locale === "es"
        ? normalized?.description_es
        : normalized?.description_en) ||
    normalized?.description_en ||
    normalized?.description_pt ||
    normalized?.description_es ||
    ""

  const defaultColor = availableColors?.[0] || "#88CFC6"

  const [selectedColor, setSelectedColor] = useState<string>(defaultColor)
  const [selectedImage, setSelectedImage] = useState<string>(getImageForColor(defaultColor))

  // ✅ se as cores mudarem (ex.: admin atualizou), reajusta defaults
  useEffect(() => {
    const first = availableColors?.[0]
    if (!first) {
      setSelectedImage(normalized?.image || "/placeholder.svg")
      return
    }
    setSelectedColor(first)
    setSelectedImage(getImageForColor(first))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableColors.join("|"), normalized?.image])

  // ✅ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as { color?: string; image?: string }
      if (parsed?.color) setSelectedColor(String(parsed.color))
      if (parsed?.image) setSelectedImage(String(parsed.image))
      else if (parsed?.color) setSelectedImage(getImageForColor(String(parsed.color)))
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color: selectedColor, image: selectedImage }))
    } catch {}
  }, [selectedColor, selectedImage, storageKey])

  // ✅ garante imagem
  const viewerImage = selectedImage || normalized?.image || "/placeholder.svg"

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <Product3DViewer productImage={viewerImage} productName={String(productName)} selectedColor={selectedColor} />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {String(normalized?.category || "")}
                  </Badge>
                  {normalized?.featured && (
                    <Badge className="bg-accent text-accent-foreground">{t.common.featured}</Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-4 text-balance">{String(productName)}</h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">{t.product.reviewsCount.replace("{count}", "128")}</span>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">{productDescription}</p>
              </div>

              <ProductCustomizer
                product={normalized}
                onVariantChange={(v: any) => {
                  // cor
                  if (v?.color) setSelectedColor(String(v.color))

                  // imagem direta
                  if (v?.image) {
                    setSelectedImage(String(v.image))
                    return
                  }

                  // se veio só cor, busca imagem
                  if (v?.color) {
                    setSelectedImage(getImageForColor(String(v.color)))
                    return
                  }

                  // fallback
                  setSelectedImage(normalized?.image || "/placeholder.svg")
                }}
              />
            </div>
          </div>

          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">{t.product.descriptionTab}</TabsTrigger>
              <TabsTrigger value="specifications">{t.product.specsTab}</TabsTrigger>
              <TabsTrigger value="shipping">{t.product.shippingTab}</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">{productDescription}</p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableColors}</h4>
                  <p className="text-muted-foreground">
                    {t.product.details.colorCount.replace("{count}", String(availableColors.length))}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableSizes}</h4>
                  <p className="text-muted-foreground">
                    {Array.isArray(normalized?.sizes) ? normalized.sizes.join(", ") : ""}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.materials}</h4>
                  <p className="text-muted-foreground">
                    {Array.isArray(normalized?.materials) ? normalized.materials.join(", ") : ""}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.printQuality}</h4>
                  <p className="text-muted-foreground">{t.product.details.printQualityValue}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/50">
                  <Truck className="w-12 h-12 text-primary mb-4" />
                  <h4 className="font-bold mb-2">{t.product.shippingHighlights.fast.title}</h4>
                  <p className="text-sm text-muted-foreground">{t.product.shippingHighlights.fast.description}</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/50">
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <h4 className="font-bold mb-2">{t.product.shippingHighlights.quality.title}</h4>
                  <p className="text-sm text-muted-foreground">{t.product.shippingHighlights.quality.description}</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/50">
                  <RefreshCw className="w-12 h-12 text-primary mb-4" />
                  <h4 className="font-bold mb-2">{t.product.shippingHighlights.returns.title}</h4>
                  <p className="text-sm text-muted-foreground">{t.product.shippingHighlights.returns.description}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {safeRelatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">{t.product.related}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {safeRelatedProducts.map((rp: any) => (
                  <ProductCard key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
