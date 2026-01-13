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

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()

  const storageKey = `np3d:product:${product?.id}:variant`

  // ✅ Nome/descrição funcionando tanto no formato antigo (name[locale])
  // quanto no formato novo da API (name_pt, name_en, name_es)
  const productName =
    product?.name?.[locale] ||
    (locale === "pt" ? product?.name_pt : locale === "es" ? product?.name_es : product?.name_en) ||
    product?.name_en ||
    "Produto"

  const productDescription =
    product?.description?.[locale] ||
    (locale === "pt"
      ? product?.description_pt
      : locale === "es"
        ? product?.description_es
        : product?.description_en) ||
    product?.description_en ||
    ""

  // ✅ Monta um "mapa" de cor -> url a partir de color_images (API)
  const colorImageMap = useMemo(() => {
    const map: Record<string, string> = {}

    // formato API: color_images: [{ color: "#000000", url: "..." }]
    const apiColorImages = product?.color_images
    if (Array.isArray(apiColorImages)) {
      for (const item of apiColorImages) {
        if (item?.color && item?.url) map[item.color] = item.url
      }
    }

    // formatos antigos (caso existam)
    const alt =
      product?.imagesByColor || product?.colorImages || product?.imagesByVariantColor || null
    if (alt && typeof alt === "object") {
      for (const k of Object.keys(alt)) {
        if (alt[k]) map[k] = alt[k]
      }
    }

    return map
  }, [product])

  const getImageForColor = (color?: string) => {
    if (color && colorImageMap[color]) return colorImageMap[color]
    return product?.image
  }

  // ✅ Cores: tenta pegar do product.colors, senão deriva do color_images
  const availableColors = useMemo(() => {
    const fromColors = Array.isArray(product?.colors) ? product.colors : []
    if (fromColors.length > 0) return fromColors

    const fromColorImages = Array.isArray(product?.color_images)
      ? product.color_images.map((c: any) => c?.color).filter(Boolean)
      : []

    // remove duplicadas
    return Array.from(new Set(fromColorImages))
  }, [product])

  const defaultColor = availableColors?.[0] || "#88CFC6"

  const [selectedColor, setSelectedColor] = useState<string>(defaultColor)
  const [selectedImage, setSelectedImage] = useState<string>(getImageForColor(defaultColor) || product?.image)

  // ✅ Se as cores chegarem depois, atualiza o padrão
  useEffect(() => {
    const first = availableColors?.[0]
    if (!first) return
    setSelectedColor(first)
    setSelectedImage(getImageForColor(first) || product?.image)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableColors?.join("|")])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as { color?: string; image?: string }
      if (parsed.color) setSelectedColor(parsed.color)
      if (parsed.image) setSelectedImage(parsed.image)
      else if (parsed.color) setSelectedImage(getImageForColor(parsed.color) || product?.image)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color: selectedColor, image: selectedImage }))
    } catch {}
  }, [selectedColor, selectedImage, storageKey])

  useEffect(() => {
    setSelectedImage((current) => current || getImageForColor(selectedColor) || product?.image)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor])

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <Product3DViewer productImage={selectedImage} productName={productName} selectedColor={selectedColor} />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {product?.category || ""}
                  </Badge>
                  {product?.featured && (
                    <Badge className="bg-accent text-accent-foreground">{t.common.featured}</Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-4 text-balance">{productName}</h1>

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
                  ...product,
                  // ✅ garante que o customizer tenha cores (mesmo vindo da API)
                  colors: availableColors,
                }}
                onVariantChange={(v: any) => {
                  if (v?.color) setSelectedColor(v.color)
                  if (v?.image) setSelectedImage(v.image)
                  else if (v?.images?.[0]) setSelectedImage(v.images[0])
                  else if (v?.color) setSelectedImage(getImageForColor(v.color) || product?.image)
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
                  <p className="text-muted-foreground">{Array.isArray(product?.sizes) ? product.sizes.join(", ") : ""}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.materials}</h4>
                  <p className="text-muted-foreground">
                    {Array.isArray(product?.materials) ? product.materials.join(", ") : ""}
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

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">{t.product.related}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
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
