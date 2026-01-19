"use client"

import { useEffect, useMemo, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, CheckCircle } from "lucide-react"
import type { Product } from "@/lib/products"

type ColorImage = { color?: string; hex?: string; url?: string; imageUrl?: string; image_url?: string }

interface ProductCustomizerProps {
  product: Product
  onVariantChange?: (v: { color: string; colorName: string; size: string; material: string; price: number; image: string }) => void
  selectedColorHex?: string
  selectedColorName?: string
  selectedImageUrl?: string
  hideColorButtons?: boolean
}

const safeNumber = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : (v as number)
  return Number.isFinite(n) ? n : 0
}

const normalizeHex = (hex?: string) => (hex || "").trim()

const toArray = (v: any): string[] => {
  if (Array.isArray(v)) return v.filter(Boolean).map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean)
  return []
}

export function ProductCustomizer({
  product,
  onVariantChange,
  selectedColorHex,
  selectedColorName,
  selectedImageUrl,
  hideColorButtons = true,
}: ProductCustomizerProps) {
  const { t, locale } = useLanguage()
  const { addItem } = useCart()

  // ---- Performance: Memoização de Arrays
  const colors = useMemo(() => toArray((product as any).colors), [product])
  const sizes = useMemo(() => toArray((product as any).sizes), [product])
  const materials = useMemo(() => toArray((product as any).materials), [product])

  // ---- Lógica de Imagem Principal (Fallbacks em cascata)
  const baseImage = useMemo(() => {
    return (product as any).image_url || 
           (product as any).imageUrl || 
           (product as any).image || 
           "/placeholder.svg"
  }, [product])

  const colorImages: ColorImage[] = useMemo(() => {
    const raw = (product as any).color_images || (product as any).colorImages || []
    return Array.isArray(raw) ? raw : []
  }, [product])

  const getImageForColor = (hex: string) => {
    const key = normalizeHex(hex).toLowerCase()
    const found = colorImages.find((ci) => normalizeHex(ci.color || ci.hex).toLowerCase() === key)
    return found?.url || found?.imageUrl || found?.image_url || baseImage
  }

  // Preços
  const materialPrices: Record<string, number> = { PLA: 0, ABS: 5, PETG: 8 }
  const sizePrices: Record<string, number> = { Small: 0, Medium: 5, Large: 10, Standard: 0, "19cm": 0 }
  
  const basePrice = safeNumber((product as any).basePrice ?? (product as any).base_price ?? (product as any).price)
  const getMaterialExtra = (material: string) => materialPrices[material] ?? 0
  const getSizeExtra = (size: string) => sizePrices[size] ?? 0

  const storageKey = `np3d:product:${(product as any).id}:variant`

  // Defaults
  const defaultColor = colors[0] || "#000000"
  const defaultSize = sizes[0] || "Standard"
  const defaultMaterial = materials[0] || "PLA"

  // ESTADOS
  const [selectedColor, setSelectedColor] = useState<string>(selectedColorHex || defaultColor)
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize)
  const [selectedMaterial, setSelectedMaterial] = useState<string>(defaultMaterial)
  const [selectedImage, setSelectedImage] = useState<string>(selectedImageUrl || getImageForColor(defaultColor))
  const [colorName, setColorName] = useState<string>(selectedColorName || "")
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const totalPrice = basePrice + getMaterialExtra(selectedMaterial) + getSizeExtra(selectedSize)

  const notifyVariantChange = (color: string, cName: string, size: string, material: string, image: string) => {
    onVariantChange?.({ 
      color, 
      colorName: cName, 
      size, 
      material, 
      price: basePrice + getMaterialExtra(material) + getSizeExtra(size), 
      image 
    })
  }

  // Sincronização Definitiva: Sempre que as props mudarem (clique na miniatura)
  useEffect(() => {
    // Se a imagem vinda da galeria existir, ela MANDA no estado.
    if (selectedImageUrl || selectedColorHex) {
      const nextImg = selectedImageUrl || getImageForColor(selectedColorHex || selectedColor)
      const nextColor = selectedColorHex || selectedColor
      const nextName = selectedColorName || colorName

      setSelectedImage(nextImg)
      setSelectedColor(nextColor)
      setColorName(nextName)
      
      notifyVariantChange(nextColor, nextName, selectedSize, selectedMaterial, nextImg)
    }
  }, [selectedColorHex, selectedImageUrl, selectedColorName])

  // Carregamento Inicial (ignora cache se as props estiverem presentes para evitar imagens quebradas)
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved && !selectedImageUrl) {
      try {
        const parsed = JSON.parse(saved)
        setSelectedSize(parsed.size || defaultSize)
        setSelectedMaterial(parsed.material || defaultMaterial)
      } catch (e) {
        console.error("Erro ao carregar cache de variante")
      }
    }
  }, [])

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      selectedColor,
      selectedColorName: colorName,
      selectedSize,
      selectedMaterial,
      price: totalPrice,
      selectedImage,
    } as any)

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div>
          <Label className="text-base font-bold mb-2 block">{t.customizer.color}</Label>
          <div className="text-sm text-muted-foreground">
            {colorName ? (
              <span className="font-medium text-foreground">{colorName}</span>
            ) : (
              <span className="italic">{t.products.selectColorHint}</span>
            )}
          </div>
        </div>

        <div>
          <Label className="text-base font-bold mb-3 block">{t.customizer.size}</Label>
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <div key={size} className="relative">
                <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                <Label
                  htmlFor={`size-${size}`}
                  className="flex items-center justify-center px-4 py-2 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                >
                  {size}
                  {(sizePrices[size] ?? 0) > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      +{formatCurrency(sizePrices[size], locale)}
                    </Badge>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-bold mb-3 block">{t.customizer.material}</Label>
          <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial} className="space-y-3">
            {materials.map((material) => (
              <div key={material} className="relative">
                <RadioGroupItem value={material} id={`material-${material}`} className="peer sr-only" />
                <Label
                  htmlFor={`material-${material}`}
                  className="flex items-center justify-between p-4 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <span className="font-medium">{material}</span>
                  {(materialPrices[material] ?? 0) > 0 && (
                    <Badge variant="secondary">+{formatCurrency(materialPrices[material], locale)}</Badge>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-medium text-muted-foreground">{t.customizer.totalPrice}</span>
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(totalPrice * quantity, locale)}
            </span>
          </div>

          <Button size="lg" className="w-full group relative overflow-hidden" onClick={handleAddToCart} disabled={isAdded}>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isAdded ? (
                <><CheckCircle className="w-5 h-5" /> {t.customizer.addedToCart}</>
              ) : (
                <><ShoppingCart className="w-5 h-5" /> {t.products.addToCart}</>
              )}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
