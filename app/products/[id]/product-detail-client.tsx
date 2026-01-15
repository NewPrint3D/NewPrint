"use client"

import { useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCustomizer } from "@/components/product-customizer"
import { ProductCard } from "@/components/product-card"
import { useLanguage } from "@/contexts/language-context"
import type { Product } from "@/lib/db-products"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Truck, Shield, RefreshCw } from "lucide-react"
import ProductGallery from "./ProductGallery"

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

type MediaItem = { type: "image" | "video"; src: string; alt?: string }

const normalizeHex = (hex?: string) => (hex || "").trim().toLowerCase()

const toArray = (v: any): string[] => {
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean)
  return []
}

/**
 * Mapeia as cores (hex) para nomes de arquivo.
 * Você pode expandir esse mapa quando adicionar novas cores.
 */
const COLOR_TO_BASENAME: Record<string, string> = {
  "#000000": "preto",
  "#ffffff": "branco",
  "#212121": "cinza",
  "#ff0000": "vermelho",
}

function mediaForColor(basePath: string, hex: string) {
  const name = COLOR_TO_BASENAME[hex]
  if (!name) return null

  return [
    { type: "image" as const, src: `${basePath}/${name}.webp` },
    { type: "image" as const, src: `${basePath}/${name}.png` },
  ]
}


export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()

  const productId = String((product as any).id ?? (product as any).product_id ?? (product as any).slug ?? "6")

  const colors = useMemo(() => toArray((product as any).colors), [product])

  const media: MediaItem[] = useMemo(() => {
    const basePath = `/products/${productId}`

    const items: MediaItem[] = []

    // Sempre tenta carregar o vídeo principal (se existir)
    items.push({ type: "video", src: `${basePath}/video.mp4` })

    // Adiciona imagens conforme as cores do produto (se tiver mapeamento)
    for (const c of colors) {
      const key = normalizeHex(c)
      const file = COLOR_TO_FILENAME[key]
      if (file) {
        const candidates = mediaForColor(basePath, key)
if (candidates) items.push(...candidates)

      }
    }

    // Se não houver cores cadastradas, você pode colocar ao menos 1 imagem padrão:
    // items.push({ type: "image", src: `${basePath}/preto.png`, alt: "Produto" })

    return items
  }, [productId, colors])

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <ProductGallery media={media} />
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
                  {(product as any).description?.[locale] ||
                    (product as any).description_pt ||
                    (product as any).description ||
                    ""}
                </p>
              </div>

              <ProductCustomizer product={product as any} onVariantChange={() => {}} />
            </div>
          </div>

          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">{t.product.descriptionTab}</TabsTrigger>
              <TabsTrigger value="specifications">{t.product.specsTab}</TabsTrigger>
              <TabsTrigger value="shipping">{t.product.shippingTab}</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <p className="text-muted-foreground leading-relaxed">
                {(product as any).description?.[locale] ||
                  (product as any).description_pt ||
                  (product as any).description ||
                  ""}
              </p>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <p className="text-muted-foreground">{t.product.details.printQualityValue}</p>
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
