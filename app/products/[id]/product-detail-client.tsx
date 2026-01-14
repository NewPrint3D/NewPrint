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
import ProductGallery from "./ProductGallery";
interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

type ColorImage = { color?: string; hex?: string; url?: string; imageUrl?: string; image_url?: string }

const normalizeHex = (hex?: string) => (hex || "").trim().toLowerCase()

const toArray = (v: any): string[] => {
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean)
  return []
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()
  const storageKey = `np3d:product:${(product as any).id}:variant`

  const colors = useMemo(() => toArray((product as any).colors), [product])

  const baseImage =
    (product as any).image_url ||
    (product as any).imageUrl ||
    (product as any).image ||
    "/placeholder.svg"

  const colorImages: ColorImage[] = useMemo(() => {
    const raw = (product as any).color_images || (product as any).colorImages || []
    return Array.isArray(raw) ? raw : []
  }, [product])

  const getImageForColor = (hex?: string) => {
    const key = normalizeHex(hex)
    if (!key) return baseImage
    const found = colorImages.find((ci) => normalizeHex(ci.color || ci.hex) === key)
    return found?.url || found?.imageUrl || found?.image_url || baseImage
  }

  const defaultColor = colors[0] || "#000000"
  const defaultImage = getImageForColor(defaultColor)

  const [selectedColor, setSelectedColor] = useState<string>(defaultColor)
  const [selectedImage, setSelectedImage] = useState<string>(defaultImage)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as { color?: string; image?: string }
      const c = parsed.color || defaultColor
      setSelectedColor(c)
      setSelectedImage(parsed.image || getImageForColor(c))
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // mantém consistente quando cor muda
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
              key={selectedImage}
  productName={
    (product as any).name?.[locale] ||
    (product as any).name_pt ||
    (product as any).name ||
    "Produto"
  }
  selectedColor={selectedColor}
 baseImage={selectedImage}
  colorImages={Array.isArray((product as any).color_images) ? (product as any).color_images : []}
/>
<ProductGallery
  imagesByColor={{
    "#000000": "/images/vaso-preto.png",
    "#ffffff": "/images/vaso-branco.png",
    "#212121": "/images/vaso-cinza.png",
    "#ff0000": "/images/vaso-vermelho.png",
  }}
  selectedColor={selectedColor}
  onChange={(color, image) => {
    setSelectedColor(color);
    setSelectedImage(image);
  }}
/>

  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
  cor: {selectedColor} <br />
  img: {selectedImage}
</div>
         
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {(product as any).category}
                  </Badge>
                  {(product as any).featured && <Badge className="bg-accent text-accent-foreground">{t.common.featured}</Badge>}
                </div>

                <h1 className="text-4xl font-bold mb-4 text-balance">
                  {(product as any).name?.[locale] || (product as any).name_pt || (product as any).name || "Produto"}
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
                  {(product as any).description?.[locale] || (product as any).description_pt || (product as any).description || ""}
                </p>
              </div>

           <ProductCustomizer
  product={product as any}
onVariantChange={(v: any) => {
  if (v?.color) {
    setSelectedColor(v.color)
    setSelectedImage(getImageForColor(v.color))
  }

  if (v?.image) {
    setSelectedImage(v.image)
  }
}}

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
                  {(product as any).description?.[locale] || (product as any).description_pt || (product as any).description || ""}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableColors}</h4>
                  <p className="text-muted-foreground">{t.product.details.colorCount.replace("{count}", String(colors.length || 0))}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.availableSizes}</h4>
                  <p className="text-muted-foreground">{toArray((product as any).sizes).join(", ")}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-bold mb-2">{t.product.details.materials}</h4>
                  <p className="text-muted-foreground">{toArray((product as any).materials).join(", ")}</p>
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
