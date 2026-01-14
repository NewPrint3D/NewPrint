"use client"

import { useEffect, useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Product3DViewer } from "@/components/product-3d-viewer"
import { ProductCustomizer } from "@/components/product-customizer"
import { ProductCard } from "@/components/product-card"
import { useLanguage } from "@/contexts/language-context"
import type { Product as DbProduct } from "@/lib/db-products"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Truck, Shield, RefreshCw } from "lucide-react"

interface ProductDetailClientProps {
  product: DbProduct
  relatedProducts: DbProduct[]
}

/**
 * Normaliza o produto vindo do banco/API para não quebrar o front
 * (porque no banco está snake_case: base_price, image_url, color_images, etc.)
 */
function normalizeProduct(raw: any) {
  const colorsFromColorImages = Array.isArray(raw?.color_images)
    ? raw.color_images.map((c: any) => c?.color).filter(Boolean)
    : []

  const safeColors = Array.isArray(raw?.colors) && raw.colors.length > 0 ? raw.colors : colorsFromColorImages
  const safeSizes = Array.isArray(raw?.sizes) && raw.sizes.length > 0 ? raw.sizes : []
  const safeMaterials = Array.isArray(raw?.materials) && raw.materials.length > 0 ? raw.materials : []

  const basePriceNumber =
    raw?.basePrice != null
      ? Number(raw.basePrice)
      : raw?.base_price != null
        ? Number(raw.base_price)
        : 0

  const imageUrl = raw?.image ?? raw?.image_url ?? raw?.main_image ?? ""

  // cria mapa: "#000000" => "https://...."
  const imagesByColor: Record<string, string> = {}
  if (Array.isArray(raw?.color_images)) {
    for (const item of raw.color_images) {
      const c = item?.color
      const u = item?.url
      if (c && u) imagesByColor[c] = u
    }
  }

  // compatibilidade com outras chaves antigas
  const imagesByColorLegacy =
    raw?.imagesByColor || raw?.colorImages || raw?.imagesByVariantColor || null
  if (imagesByColorLegacy && typeof imagesByColorLegacy === "object") {
    for (const [k, v] of Object.entries(imagesByColorLegacy)) {
      if (k && typeof v === "string") imagesByColor[k] = v
    }
  }

  return {
    ...raw,
    basePrice: Number.isFinite(basePriceNumber) ? basePriceNumber : 0,
    image: imageUrl,
    colors: safeColors.length > 0 ? safeColors : ["#000000"],
    sizes: safeSizes.length > 0 ? safeSizes : ["Standard"],
    materials: safeMaterials.length > 0 ? safeMaterials : ["PLA"],
    imagesByColor,
  }
}

function getText(raw: any, field: "name" | "description", locale: string) {
  // 1) formato novo: product.name[locale]
  const obj = raw?.[field]
  if (obj && typeof obj === "object" && obj[locale]) return String(obj[locale])

  // 2) formato banco: name_pt/name_en/name_es + description_pt...
  const key = `${field}_${locale}`
  if (raw?.[key]) return String(raw[key])

  // 3) fallback: en
  const fallbackKey = `${field}_en`
  if (raw?.[fallbackKey]) return String(raw[fallbackKey])

  // 4) último fallback
  if (obj && typeof obj === "string") return obj
  return ""
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()

  const p = useMemo(() => normalizeProduct(product as any), [product])

  const storageKey = `np3d:product:${p.id}:variant`

  const getImageForColor = (color?: string) => {
    if (color && p.imagesByColor?.[color]) return p.imagesByColor[color]
    return p.image || "/placeholder.svg"
  }

  const [selectedColor, setSelectedColor] = useState<string>(p.colors?.[0] || "#000000")
  const [selectedImage, setSelectedImage] = useState<string>(getImageForColor(p.colors?.[0]))

  // carrega seleção salva
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as { color?: string; image?: string }

      const nextColor = parsed.color && p.colors.includes(parsed.color) ? parsed.color : p.colors?.[0] || "#000000"
      setSelectedColor(nextColor)

      if (parsed.image) setSelectedImage(parsed.image)
      else setSelectedImage(getImageForColor(nextColor))
    } catch {
      // nada
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  // salva seleção
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color: selectedColor, image: selectedImage }))
    } catch {
      // nada
    }
  }, [selectedColor, selectedImage, storageKey])

  // quando muda cor, troca imagem
  useEffect(() => {
    setSelectedImage(getImageForColor(selectedColor))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor])

  const title = getText(p, "name", locale)
  const description = getText(p, "description", locale)

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <Product3DViewer productImage={selectedImage} productName={title} selectedColor={selectedColor} />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {p.category}
                  </Badge>
                  {p.featured && <Badge className="bg-accent text-accent-foreground">{t.common.featured}</Badge>}
                </div>

                <h1 className="text-4xl font-bold mb-4 text-balance">{title}</h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">{t.product.reviewsCount.replace("{count}", "128")}</span>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
              </div>

              <ProductCustomizer
                // passa o produto normalizado para garantir colors/sizes/materials/basePrice ok
                product={p as any}
                onVariantChange={(v: any) => {
                  if (v?.color) setSelectedColor(v.color)
                  if (v?.image) setSelectedImage(v.image)
                  else if (v?.images?.[0]) setSelectedImage(v.images[0])
                  else if (v?.color) setSelectedImage(getImageForColor(v.color))
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
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableColors}</h4>
                  <p className="text-muted-foreground">
                    {t.product.details.colorCount.replace("{count}", String(p.colors?.length || 0))}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableSizes}</h4>
                  <p className="text-muted-foreground">{Array.isArray(p.sizes) ? p.sizes.join(", ") : ""}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.materials}</h4>
                  <p className="text-muted-foreground">{Array.isArray(p.materials) ? p.materials.join(", ") : ""}</p>
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

          {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
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
