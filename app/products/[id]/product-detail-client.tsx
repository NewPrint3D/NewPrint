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
  product: Product
  relatedProducts: Product[]
}

type ColorImageRow = {
  color_hex?: string
  colorHex?: string
  hex?: string
  image_url?: string
  imageUrl?: string
  url?: string
}

function normalizeHex(input?: string) {
  const v = (input || "").trim().toLowerCase()
  if (!v) return ""
  return v.startsWith("#") ? v : `#${v}`
}

function buildColorImageMap(product: any): Record<string, string> {
  // 1) formatos antigos (se existirem)
  const map =
    product?.imagesByColor ||
    product?.colorImages ||
    product?.imagesByVariantColor ||
    null

  if (map && typeof map === "object" && !Array.isArray(map)) {
    const out: Record<string, string> = {}
    for (const [k, v] of Object.entries(map)) {
      const key = normalizeHex(String(k))
      const val = String(v || "")
      if (key && val) out[key] = val
    }
    return out
  }

  // 2) formato da sua API atual: color_images: [{ color_hex, image_url }]
  const arr: ColorImageRow[] = Array.isArray(product?.color_images) ? product.color_images : []
  const out: Record<string, string> = {}

  for (const row of arr) {
    const hex = normalizeHex(row.color_hex || row.colorHex || row.hex)
    const url = String(row.image_url || row.imageUrl || row.url || "").trim()
    if (hex && url) out[hex] = url
  }

  return out
}

function getMainImage(product: any): string {
  // sua API parece usar image_url
  return (
    product?.image ||
    product?.image_url ||
    product?.main_image ||
    product?.mainImage ||
    ""
  )
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()

  const storageKey = `np3d:product:${product.id}:variant`

  const colorImageMap = useMemo(() => buildColorImageMap(product as any), [product])

  const getImageForColor = (color?: string) => {
    const key = normalizeHex(color)
    if (key && colorImageMap[key]) return colorImageMap[key]
    return getMainImage(product as any) || "/placeholder.svg"
  }

  const colors = Array.isArray((product as any)?.colors) ? (product as any).colors : []
  const initialColor = colors[0] || "#000000"

  const [selectedColor, setSelectedColor] = useState<string>(initialColor)
  const [selectedImage, setSelectedImage] = useState<string>(getImageForColor(initialColor))

  // Carrega seleção salva
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as { color?: string; image?: string }
      const savedColor = parsed?.color ? normalizeHex(parsed.color) : ""
      if (savedColor) setSelectedColor(savedColor)

      // se tiver imagem salva, usa ela; senão recalcula pelo mapa
      if (parsed?.image) setSelectedImage(parsed.image)
      else if (savedColor) setSelectedImage(getImageForColor(savedColor))
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persiste seleção
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color: selectedColor, image: selectedImage }))
    } catch {
      // ignore
    }
  }, [selectedColor, selectedImage, storageKey])

  // Sempre que a cor mudar, atualiza a imagem pela regra (color_images -> image_url)
  useEffect(() => {
    setSelectedImage(getImageForColor(selectedColor))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor])

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <Product3DViewer
                productImage={selectedImage}
                productName={(product as any)?.name?.[locale] || (product as any)?.name?.en || "Product"}
                selectedColor={selectedColor}
              />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {(product as any).category}
                  </Badge>
                  {(product as any).featured && (
                    <Badge className="bg-accent text-accent-foreground">{t.common.featured}</Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-4 text-balance">
                  {(product as any)?.name?.[locale] || (product as any)?.name?.en}
                </h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">{t.product.reviewsCount.replace("{count}", "128")}</span>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {(product as any)?.description?.[locale] || (product as any)?.description?.en}
                </p>
              </div>

              <ProductCustomizer
                product={product as any}
                onVariantChange={(v: any) => {
                  // O ProductCustomizer manda pelo menos a cor.
                  if (v?.color) {
                    const c = normalizeHex(v.color)
                    setSelectedColor(c)
                    // imagem vem do map color_images, então não precisamos depender de v.image
                    setSelectedImage(getImageForColor(c))
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
                <p className="text-muted-foreground leading-relaxed">
                  {(product as any)?.description?.[locale] || (product as any)?.description?.en}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableColors}</h4>
                  <p className="text-muted-foreground">
                    {t.product.details.colorCount.replace(
                      "{count}",
                      String(Array.isArray((product as any)?.colors) ? (product as any).colors.length : 0)
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableSizes}</h4>
                  <p className="text-muted-foreground">
                    {Array.isArray((product as any)?.sizes) ? (product as any).sizes.join(", ") : ""}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.materials}</h4>
                  <p className="text-muted-foreground">
                    {Array.isArray((product as any)?.materials) ? (product as any).materials.join(", ") : ""}
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
                  <ProductCard key={(relatedProduct as any).id} product={relatedProduct as any} />
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
