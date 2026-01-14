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

type AnyObj = Record<string, any>

const normHex = (hex?: string) => {
  const h = (hex || "").trim().toLowerCase()
  if (!h) return ""
  return h.startsWith("#") ? h : `#${h}`
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()

  const p = product as unknown as AnyObj

  // ✅ pega imagem principal tanto em camelCase quanto snake_case
  const mainImage: string =
    (p.image as string) ||
    (p.imageUrl as string) ||
    (p.image_url as string) ||
    (p.main_image as string) ||
    ""

  // ✅ monta um map HEX -> URL a partir de "color_images" (snake_case) e variações
  const imagesByColor = useMemo(() => {
    const map: Record<string, string> = {}

    const list =
      (p.color_images as any[]) ||
      (p.colorImages as any[]) ||
      (p.imagesByColor as any[]) ||
      (p.images_by_color as any[]) ||
      []

    if (Array.isArray(list)) {
      for (const item of list) {
        const hex = normHex(item?.color || item?.hex || item?.colorHex || item?.color_hex)
        const url = (item?.image || item?.url || item?.imageUrl || item?.image_url || "").trim()
        if (hex && url) map[hex] = url
      }
    }

    return map
  }, [p.color_images, p.colorImages, p.imagesByColor, p.images_by_color])

  const colors: string[] = useMemo(() => {
    const raw = p.colors
    if (Array.isArray(raw) && raw.length) return raw.map(normHex).filter(Boolean)

    // fallback: se não vier colors, usa as chaves do imagesByColor
    const keys = Object.keys(imagesByColor)
    return keys.length ? keys : []
  }, [p.colors, imagesByColor])

  const storageKey = `np3d:product:${p.id}:variant`

  const getImageForColor = (color?: string) => {
    const c = normHex(color)
    if (c && imagesByColor[c]) return imagesByColor[c]
    return mainImage || "/placeholder.svg"
  }

  const initialColor = colors[0] || "#000000"
  const [selectedColor, setSelectedColor] = useState<string>(initialColor)
  const [selectedImage, setSelectedImage] = useState<string>(getImageForColor(initialColor))

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as { color?: string; image?: string }
      if (parsed?.color) {
        const c = normHex(parsed.color)
        setSelectedColor(c)
        setSelectedImage(parsed.image?.trim() || getImageForColor(c))
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ color: selectedColor, image: selectedImage }))
    } catch {}
  }, [selectedColor, selectedImage, storageKey])

  useEffect(() => {
    setSelectedImage(getImageForColor(selectedColor))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor])

  // ✅ Nome/descrição com fallback seguro (porque pode vir name_pt, name_en, etc)
  const name =
    (p?.name?.[locale] as string) ||
    (p?.[`name_${locale}`] as string) ||
    (p?.name_pt as string) ||
    (p?.name_en as string) ||
    (p?.name_es as string) ||
    "Produto"

  const description =
    (p?.description?.[locale] as string) ||
    (p?.[`description_${locale}`] as string) ||
    (p?.description_pt as string) ||
    (p?.description_en as string) ||
    (p?.description_es as string) ||
    ""

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <Product3DViewer productImage={selectedImage} productName={name} selectedColor={selectedColor} />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {p.category || "product"}
                  </Badge>
                  {p.featured && <Badge className="bg-accent text-accent-foreground">{t.common.featured}</Badge>}
                </div>

                <h1 className="text-4xl font-bold mb-4 text-balance">{name}</h1>

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
                product={product}
                onVariantChange={(v: any) => {
                  if (v?.color) setSelectedColor(normHex(v.color))
                  // se você passar image no futuro, ele respeita:
                  if (v?.image) setSelectedImage(v.image)
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
                  <p className="text-muted-foreground">{String(colors.length)}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableSizes}</h4>
                  <p className="text-muted-foreground">{Array.isArray(p.sizes) ? p.sizes.join(", ") : "-"}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.materials}</h4>
                  <p className="text-muted-foreground">{Array.isArray(p.materials) ? p.materials.join(", ") : "-"}</p>
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
                {relatedProducts.map((rp) => (
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
