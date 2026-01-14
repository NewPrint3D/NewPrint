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
  // extras caso venha diferente
  color_hex?: string
  colorHex?: string
  hex?: string
  image_url?: string
  imageUrl?: string
  image?: string
}

function normalizeHex(input?: string) {
  const v = (input || "").trim()
  if (!v) return ""
  const low = v.toLowerCase()
  return low.startsWith("#") ? low : `#${low}`
}

function toArray(value: unknown): string[] {
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
  return (
    p?.image ||
    p?.image_url ||
    p?.imageUrl ||
    p?.main_image ||
    p?.mainImage ||
    "/placeholder.svg"
  )
}

function buildColorImageMap(p: any): Record<string, string> {
  const out: Record<string, string> = {}

  // Formato A: color_images: [{ color, url }]
  const arr: ColorImageRow[] = Array.isArray(p?.color_images) ? p.color_images : []
  for (const row of arr) {
    const hex = normalizeHex(row?.color || row?.color_hex || row?.colorHex || row?.hex)
    const url = String(row?.url || row?.image_url || row?.imageUrl || row?.image || "").trim()
    if (hex && url) out[hex] = url
  }

  // Formato B: alguns backends mandam "imagesByColor" como objeto
  const obj =
    p?.imagesByColor ||
    p?.colorImages ||
    p?.imagesByVariantColor ||
    null

  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      const hex = normalizeHex(String(k))
      const url = String(v || "").trim()
      if (hex && url) out[hex] = url
    }
  }

  return out
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()

  const storageKey = `np3d:product:${(product as any).id}:variant`

  const normalizedProduct = useMemo(() => {
    const p: any = product
    return {
      ...p,
      colors: toArray(p?.colors).map(normalizeHex),
      sizes: toArray(p?.sizes),
      materials: toArray(p?.materials),
    }
  }, [product])

  const colorImageMap = useMemo(() => buildColorImageMap(normalizedProduct), [normalizedProduct])

  const getImageForColor = (color?: string) => {
    const key = normalizeHex(color)
    if (key && colorImageMap[key]) return colorImageMap[key]
    return getMainImage(normalizedProduct)
  }

  const initialColor = normalizedProduct.colors?.[0] || "#000000"

  const [selectedColor, setSelectedColor] = useState<string>(normalizeHex(initialColor))
  const [selectedImage, setSelectedImage] = useState<string>(getImageForColor(initialColor))

  // ✅ DEBUG: mostra exatamente o que chegou
  useEffect(() => {
    console.log("=== NP3D DEBUG START ===")
    console.log("NP3D product.id:", (product as any)?.id)
    console.log("NP3D raw colors:", (product as any)?.colors)
    console.log("NP3D normalized colors:", (normalizedProduct as any)?.colors)
    console.log("NP3D raw color_images:", (product as any)?.color_images)
    console.log("NP3D normalized color_images:", (normalizedProduct as any)?.color_images)
    console.log("NP3D colorImageMap keys:", Object.keys(colorImageMap || {}))
    console.log("NP3D colorImageMap:", colorImageMap)
    console.log("NP3D main image:", getMainImage(normalizedProduct))
    console.log("NP3D selectedColor init:", selectedColor)
    console.log("NP3D selectedImage init:", selectedImage)
    console.log("=== NP3D DEBUG END ===")
  }, [product, normalizedProduct, colorImageMap]) // proposital

  // recupera seleção salva (só cor)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as { color?: string }
      const c = parsed?.color ? normalizeHex(parsed.color) : ""
      if (!c) return
      setSelectedColor(c)
      setSelectedImage(getImageForColor(c))
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // salva seleção (cor)
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color: selectedColor }))
    } catch {}
  }, [selectedColor, storageKey])

  // sempre que muda cor, troca imagem
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
                  console.log("NP3D onVariantChange v:", v)

                  if (v?.color) {
                    const c = normalizeHex(v.color)
                    const img = getImageForColor(c)

                    console.log("NP3D clicked color:", c)
                    console.log("NP3D img for color:", img)

                    setSelectedColor(c)
                    setSelectedImage(img)
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
