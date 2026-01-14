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
  relatedProducts: any
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()

  // ✅ garante arrays
  const safeRelatedProducts: Product[] = Array.isArray(relatedProducts) ? relatedProducts : []

  // ✅ evita quebrar se product vier null/undefined por algum motivo
  const safeProduct = product ?? {}

  const storageKey = `np3d:product:${safeProduct?.id ?? "unknown"}:variant`

  // ✅ Nome/descrição: suporta:
  // - formato antigo: name[locale], description[locale]
  // - formato API: name_pt/name_en/name_es + description_pt/description_en/description_es
  const productName =
    safeProduct?.name?.[locale] ||
    (locale === "pt" ? safeProduct?.name_pt : locale === "es" ? safeProduct?.name_es : safeProduct?.name_en) ||
    safeProduct?.name_en ||
    safeProduct?.name_pt ||
    safeProduct?.name_es ||
    "Produto"

  const productDescription =
    safeProduct?.description?.[locale] ||
    (locale === "pt"
      ? safeProduct?.description_pt
      : locale === "es"
        ? safeProduct?.description_es
        : safeProduct?.description_en) ||
    safeProduct?.description_en ||
    safeProduct?.description_pt ||
    safeProduct?.description_es ||
    ""

  // ✅ monta um mapa cor -> url, suportando:
  // - API: color_images: [{ color, url }]
  // - formatos antigos: imagesByColor / colorImages / imagesByVariantColor
  const colorImageMap = useMemo(() => {
    const map: Record<string, string> = {}

    const apiColorImages = safeProduct?.color_images
    if (Array.isArray(apiColorImages)) {
      for (const item of apiColorImages) {
        if (item?.color && item?.url) map[String(item.color)] = String(item.url)
      }
    }

    const alt =
      safeProduct?.imagesByColor || safeProduct?.colorImages || safeProduct?.imagesByVariantColor || null

    if (alt && typeof alt === "object") {
      for (const k of Object.keys(alt)) {
        if (alt[k]) map[String(k)] = String(alt[k])
      }
    }

    return map
  }, [safeProduct])

  const getImageForColor = (color?: string) => {
    if (color && colorImageMap[color]) return colorImageMap[color]
    return safeProduct?.image || "/placeholder.svg"
  }

  // ✅ Cores disponíveis:
  // - se vier product.colors usa
  // - senão deriva de color_images
  const availableColors = useMemo(() => {
    const fromColors = Array.isArray(safeProduct?.colors) ? safeProduct.colors : []
    if (fromColors.length > 0) return fromColors.map(String)

    const fromColorImages = Array.isArray(safeProduct?.color_images)
      ? safeProduct.color_images.map((c: any) => c?.color).filter(Boolean).map(String)
      : []

    return Array.from(new Set(fromColorImages))
  }, [safeProduct])

  const defaultColor = availableColors?.[0] || "#88CFC6"

  const [selectedColor, setSelectedColor] = useState<string>(defaultColor)
  const [selectedImage, setSelectedImage] = useState<string>(getImageForColor(defaultColor))

  // ✅ se as cores mudarem (ex.: chegaram depois), ajusta defaults sem quebrar
  useEffect(() => {
    const first = availableColors?.[0]
    if (!first) return
    setSelectedColor(first)
    setSelectedImage(getImageForColor(first))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableColors.join("|")])

  // ✅ recuperar seleção do localStorage (se existir)
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

  // ✅ salvar seleção
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color: selectedColor, image: selectedImage }))
    } catch {}
  }, [selectedColor, selectedImage, storageKey])

  // ✅ sempre que mudar a cor, garante imagem válida
  useEffect(() => {
    setSelectedImage((current) => {
      if (current) return current
      return getImageForColor(selectedColor)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor])

  // ✅ fallback extra: nunca deixe passar undefined para o viewer
  const viewerImage = selectedImage || safeProduct?.image || "/placeholder.svg"
  const viewerName = String(productName || "Produto")

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <Product3DViewer productImage={viewerImage} productName={viewerName} selectedColor={selectedColor} />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {String(safeProduct?.category || "")}
                  </Badge>
                  {safeProduct?.featured && (
                    <Badge className="bg-accent text-accent-foreground">{t.common.featured}</Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-4 text-balance">{viewerName}</h1>

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
                product={{
                  ...safeProduct,
                  // ✅ garante que o customizer receba cores consistentes
                  colors: availableColors,
                }}
                onVariantChange={(v: any) => {
                  try {
                    // ✅ cor
                    if (v?.color) setSelectedColor(String(v.color))

                    // ✅ imagem direta
                    if (v?.image) {
                      setSelectedImage(String(v.image))
                      return
                    }

                    // ✅ images[0] (blindado)
                    if (Array.isArray(v?.images) && v.images.length > 0 && v.images[0]) {
                      setSelectedImage(String(v.images[0]))
                      return
                    }

                    // ✅ se só veio cor, tenta mapear
                    if (v?.color) {
                      setSelectedImage(getImageForColor(String(v.color)))
                      return
                    }

                    // ✅ fallback final
                    setSelectedImage(safeProduct?.image || "/placeholder.svg")
                  } catch {
                    setSelectedImage(safeProduct?.image || "/placeholder.svg")
                  }
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
                    {Array.isArray(safeProduct?.sizes) ? safeProduct.sizes.join(", ") : ""}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.materials}</h4>
                  <p className="text-muted-foreground">
                    {Array.isArray(safeProduct?.materials) ? safeProduct.materials.join(", ") : ""}
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
                {safeRelatedProducts.map((rp) => (
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
