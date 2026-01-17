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
  alt?: string
  // extras (para sincronizar cor ↔ imagem)
  hex?: string
  colorName?: { pt: string; en: string; es: string }
}

const normalizeHex = (hex?: string) =>
  (hex || "").trim().toLowerCase().replace("#", "")

const toArray = (v: any): string[] => {
  if (Array.isArray(v)) return v.filter(Boolean).map(String)
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean)
  return []
}

// Nomes elegantes (fallback)
const colorNameFromHex = (hexNoHash: string) => {
  const h = (hexNoHash || "").toLowerCase()
  const map: Record<string, { pt: string; en: string; es: string }> = {
    "000000": { pt: "Preto", en: "Black", es: "Negro" },
    "ffffff": { pt: "Branco", en: "White", es: "Blanco" },
    "f5f5f5": { pt: "Branco", en: "White", es: "Blanco" },
    "d32f2f": { pt: "Vermelho", en: "Red", es: "Rojo" },
    "ff0000": { pt: "Vermelho", en: "Red", es: "Rojo" },
    "212121": { pt: "Cinza", en: "Gray", es: "Gris" },
    "808080": { pt: "Cinza", en: "Gray", es: "Gris" },
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

  const productId = String((product as any).id ?? (product as any).product_id ?? (product as any).slug)

  /**
   * Preferimos usar product.colorOptions (criado no server)
   * porque já traz {hex, image, name} pronto e consistente.
   * Se não existir, cai no fallback pelos HEX de product.colors.
   */
  const colorOptions = useMemo(() => {
    const fromServer = (product as any).colorOptions
    if (Array.isArray(fromServer) && fromServer.length) {
      return fromServer
        .map((o: any) => ({
          hex: String(o?.hex || "").toLowerCase(),
          file: String(o?.file || normalizeHex(o?.hex)),
          image: String(o?.image || ""),
          name: o?.name || colorNameFromHex(normalizeHex(o?.hex)),
        }))
        .filter((o: any) => o.hex && o.file && o.image)
    }

    const colors = toArray((product as any).colors)
    const basePath = `/products/${productId}`

    return colors
      .map((c) => normalizeHex(c))
      .filter(Boolean)
      .map((hex) => ({
        hex: `#${hex}`,
        file: hex,
        image: `${basePath}/colors/${hex}.webp`,
        name: colorNameFromHex(hex),
      }))
  }, [product, productId])

  /**
   * ✅ Fonte de verdade da seleção:
   * Quando o cliente clica numa miniatura, isso precisa virar:
   * - selectedHex
   * - selectedName
   * - selectedImage
   */
  const [selectedHex, setSelectedHex] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedColorName, setSelectedColorName] = useState<{ pt: string; en: string; es: string } | null>(null)

  // Inicializa seleção (primeira cor disponível)
  useEffect(() => {
    if (!colorOptions.length) return
    const first = colorOptions[0]
    setSelectedHex(first.hex?.startsWith("#") ? first.hex : `#${first.file}`)
    setSelectedImage(first.image)
    setSelectedColorName(first.name)
  }, [colorOptions])

  /**
   * ✅ Media da galeria:
   * - 1 vídeo (opcional)
   * - 1 imagem por cor (somente webp)  -> evita duplicar "miniaturas" e confusão
   */
  const media: MediaItem[] = useMemo(() => {
    const basePath = `/products/${productId}`
    const items: MediaItem[] = []

    // Vídeo principal (opcional)
    items.push({
      type: "video",
      src: `${basePath}/video.mp4`,
    })

    for (const opt of colorOptions) {
      const hexNoHash = normalizeHex(opt.hex || opt.file)
      if (!hexNoHash) continue

      items.push({
        type: "image",
        src: opt.image || `${basePath}/colors/${hexNoHash}.webp`,
        hex: `#${hexNoHash}`,
        colorName: opt.name || colorNameFromHex(hexNoHash),
      })
    }

    return items
  }, [productId, colorOptions])

  /**
   * ✅ Callback para sincronizar galeria -> seleção de cor
   * (vamos usar quando ajustarmos o ProductGallery para informar qual imagem foi clicada)
   *
   * Por enquanto, mesmo sem mudar o ProductGallery, já deixamos isso pronto.
   */
  const onSelectFromGallery = (item: MediaItem) => {
    if (item.type !== "image") return
    const hex = item.hex ? (item.hex.startsWith("#") ? item.hex : `#${normalizeHex(item.hex)}`) : ""
    if (hex) setSelectedHex(hex)
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
              {/* Passamos props extras via "as any" para não travar TypeScript.
                  Depois vamos ajustar o ProductGallery para usar onSelectItem. */}
              <ProductGallery
                media={media}
                {...({
                  onSelectItem: onSelectFromGallery,
                  selectedHex,
                } as any)}
              />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {(product as any).category}
                  </Badge>
                </div>

                <h1 className="text-4xl font-bold mb-4">
                  {(product as any).name?.[locale] ||
                    (product as any).name_pt ||
                    (product as any).name ||
                    "Produto"}
                </h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    {t.product.reviewsCount.replace("{count}", "128")}
                  </span>
                </div>

                <p className="text-lg text-muted-foreground">
                  {(product as any).description?.[locale] ||
                    (product as any).description_pt ||
                    (product as any).description ||
                    ""}
                </p>
              </div>

              {/* ✅ IMPORTANTE:
                  Aqui vamos fazer o ProductCustomizer usar a seleção da galeria
                  e remover os botões/bolinhas.
                  Já enviamos as infos, mas o componente precisa ser ajustado. */}
              <ProductCustomizer
                product={product as any}
                onVariantChange={() => {}}
                {...({
                  selectedColorHex: selectedHex,
                  selectedColorName: selectedColorName?.[locale] ?? selectedColorName?.pt ?? "",
                  selectedImageUrl: selectedImage,
                  // A ideia é o ProductCustomizer NÃO renderizar color buttons.
                  // Vamos implementar isso no arquivo dele.
                  hideColorButtons: true,
                } as any)}
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
              <p className="text-muted-foreground">
                {(product as any).description?.[locale] ||
                  (product as any).description_pt ||
                  (product as any).description ||
                  ""}
              </p>
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
