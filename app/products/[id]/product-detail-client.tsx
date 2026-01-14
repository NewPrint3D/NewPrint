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
  color?: string
  url?: string
}

function normalizeHex(input?: string) {
  const v = (input || "").trim()
  if (!v) return ""
  const low = v.toLowerCase()
  return low.startsWith("#") ? low : `#${low}`
}

function toArray(value: unknown): string[] {
  // ✅ seu backend pode mandar colors como string: "#000000,#FF0000"
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean)

  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }

  return []
}

function getMainImage(p: any): string {
  // ✅ seu backend usa image_url
  return (p?.image || p?.image_url || p?.main_image || p?.mainImage || "/placeholder.svg") as string
}

function buildColorImageMap(p: any): Record<string, string> {
  // ✅ formato real (console): color_images: [{ color: "#000000", url: "https://..." }]
  const arr: ColorImageRow[] = Array.isArray(p?.color_images) ? p.color_images : []
  const out: Record<string, string> = {}

  for (const row of arr) {
    const hex = normalizeHex(row?.color)
    const url = String(row?.url || "").trim()
    if (hex && url) out[hex] = url
  }

  return out
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()

  const storageKey = `np3d:product:${(product as any).id}:variant`

  // ✅ normaliza o product para garantir arrays (colors/sizes/materials)
  const normalizedProduct = useMemo(() => {
    const p: any = product
    return {
      ...p,
      colors: toArray(p?.colors).map(normalizeHex),
      sizes: toArray(p?.sizes),
      materials: toArray(p?.materials),
    }
  }, [product])

  // ✅ mapa HEX -> URL
  const colorImageMap = useMemo(() => buildColorImageMap(normalizedProduct), [normalizedProduct])

  const getImageForColor = (color?: string) => {
    const key = normalizeHex(color)
    if (key && colorImageMap[key]) return colorImageMap[key]
    return getMainImage(normalizedProduct)
  }

  const initialColor = normalizedProduct.colors?.[0] || "#000000"
  const [selectedColor, setSelectedColor] = useState<string>(normalizeHex(initialColor))
  const [selectedImage, setSelectedImage] = useState<string>(getImageForColor(initialColor))

  // ✅ ao carregar, tenta recuperar do localStorage, mas sempre recalcula imagem usando o mapa
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as { color?: string }
      const savedColor = parsed?.color ? normalizeHex(parsed.color) : ""
      if (!savedColor) return
      setSelectedColor(savedColor)
      setSelectedImage(getImageForColor(savedColor))
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ✅ salva somente a cor (a imagem é derivada do mapa)
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color: selectedColor }))
    } catch {
      // ignore
    }
  }, [selectedColor, storageKey])

  // ✅ sempre que a cor mudar, troca a imagem pela URL cadastrada
  useEffect(() => {
    setSelectedImage(getImageForColor(selectedColor))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, colorImageMap])

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <Product3DViewer
                productImage={selectedImage}
                productName={normalizedProduct?.name?.[locale] || normalizedProduct?.name?.en || "Product"}
                selectedColor={selectedColor}
              />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {normalizedProduct.category}
                  </Badge>

                  {normalizedProduct.featured && (
                    <Badge className="bg-accent text-accent-foreground">{t.common.featured}</Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-4 text-balance">
                  {normalizedProduct?.name?.[locale] || normalizedProduct?.name?.en}
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
                  {normalizedProduct?.description?.[locale] || normalizedProduct?.description?.en}
                </p>
              </div>

              <ProductCustomizer
                product={normalizedProduct}
                onVariantChange={(v: any) => {
                  if (v?.color) {
                    const c = normalizeHex(v.color)
                    setSelectedColor(c)
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
                  {normalizedProduct?.description?.[locale] || normalizedProduct?.description?.en}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableColors}</h4>
                  <p className="text-muted-foreground">
                    {t.product.details.colorCount.replace("{count}", String(normalizedProduct.colors?.length || 0))}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableSizes}</h4>
                  <p className="text-muted-foreground">{(normalizedProduct.sizes || []).join(", ")}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.materials}</h4>
                  <p className="text-muted-foreground">{(normalizedProduct.materials || []).join(", ")}</p>
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
                {relatedProducts.map((rp: any) => (
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
