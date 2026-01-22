"use client"

import { useMemo, useState, useEffect } from "react"
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

type MediaItem = {
  type: "image" | "video"
  src: string
  hex?: string
  colorName?: { pt: string; en: string; es: string }
}

const normalizeHex = (hex?: string) =>
  (hex || "").trim().toLowerCase().replace("#", "")

const colorNameFromHex = (hexNoHash: string) => {
  const h = (hexNoHash || "").toLowerCase()
  const map: Record<string, { pt: string; en: string; es: string }> = {
    "000000": { pt: "Preto", en: "Black", es: "Negro" },
    "ffffff": { pt: "Branco", en: "White", es: "Blanco" },
    "212121": { pt: "Cinza", en: "Gray", es: "Gris" },
    "ff0000": { pt: "Vermelho", en: "Red", es: "Rojo" },
  }

  return (
    map[h] ?? {
      pt: "Cor selecionada",
      en: "Selected color",
      es: "Color seleccionada",
    }
  )
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { t, locale } = useLanguage()

  const productId = String(
    (product as any).id ?? (product as any).product_id ?? (product as any).slug
  )

  const colorOptions = useMemo(() => {
    const fromServer = (product as any).colorOptions
    if (Array.isArray(fromServer) && fromServer.length) {
      return fromServer.map((o: any) => ({
        hex: String(o.hex).toLowerCase(),
        image: String(o.image),
        name: o.name || colorNameFromHex(normalizeHex(o.hex)),
      }))
    }

    return []
  }, [product])

  const [selectedHex, setSelectedHex] = useState("")
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedColorName, setSelectedColorName] =
    useState<{ pt: string; en: string; es: string } | null>(null)

  useEffect(() => {
    if (!colorOptions.length) return
    const first = colorOptions[0]
    setSelectedHex(first.hex)
    setSelectedImage(first.image)
    setSelectedColorName(first.name)
  }, [colorOptions])

  const media: MediaItem[] = useMemo(() => {
    const items: MediaItem[] = []

    for (const opt of colorOptions) {
      items.push({
        type: "image",
        src: opt.image,
        hex: opt.hex,
        colorName: opt.name,
      })
    }

    return items
  }, [colorOptions])

  const onSelectFromGallery = (item: MediaItem) => {
    if (item.type !== "image") return
    if (item.hex) setSelectedHex(item.hex)
    if (item.src) setSelectedImage(item.src)
    if (item.colorName) setSelectedColorName(item.colorName)
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <ProductGallery
                media={media}
                {...({ onSelectItem: onSelectFromGallery } as any)}
              />
            </div>

            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="capitalize mb-2">
                  {(product as any).category}
                </Badge>

                <h1 className="text-4xl font-bold mb-4">
                  {(product as any).name?.[locale] ||
                    (product as any).name_pt ||
                    (product as any).name ||
                    "Produto"}
                </h1>

                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground">
                  {(product as any).description?.[locale] ||
                    (product as any).description_pt ||
                    (product as any).description ||
                    ""}
                </p>
              </div>

              <ProductCustomizer
                product={product as any}
                {...({
                  selectedColorHex: selectedHex,
                  selectedColorName:
                    selectedColorName?.[locale] ?? selectedColorName?.pt ?? "",
                  selectedImageUrl: selectedImage,
                  hideColorButtons: true,
                } as any)}
              />
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">
                {t.product.related}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={(relatedProduct as any).id}
                    product={relatedProduct as any}
                  />
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
