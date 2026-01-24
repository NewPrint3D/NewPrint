"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type ColorImage = { color: string; url: string }

interface Product3DViewerProps {
  productName: string
  selectedColor: string
  baseImage: string
  colorImages: ColorImage[]
}

export function Product3DViewer({
  productName,
  selectedColor,
  baseImage,
  colorImages,
}: Product3DViewerProps) {
  const { t } = useLanguage()
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)

  // ✅ garante que sempre exista uma imagem “base”
  const safeBaseImage = baseImage && baseImage.length > 0 ? baseImage : "/placeholder.svg"

  // ✅ acha a imagem correta da cor (se existir)
  const colorImageUrl = useMemo(() => {
    if (!selectedColor) return ""
    if (!Array.isArray(colorImages)) return ""

    const target = selectedColor.toLowerCase().trim()
    const match = colorImages.find(
      (img) => (img?.color || "").toLowerCase().trim() === target
    )

    return match?.url || ""
  }, [selectedColor, colorImages])

  // ✅ prioridade: se tiver imagem da cor, mostra ela. Se falhar, volta pro baseImage (via onError)
  const [currentSrc, setCurrentSrc] = useState<string>(safeBaseImage)

  // sempre que mudar a cor/imagens, tenta aplicar a imagem certa
  useMemo(() => {
    setCurrentSrc(colorImageUrl || safeBaseImage)
  }, [colorImageUrl, safeBaseImage])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-8">
        <div
          className="relative w-full h-full transition-all duration-500"
          style={{ transform: `rotate(${rotation}deg) scale(${zoom})` }}
        >
          {/* ✅ USAR <img> normal (sem Next/Image) pra não bloquear Cloudinary */}
          <img
            src={currentSrc}
            alt={productName}
            className="w-full h-full object-contain drop-shadow-2xl relative z-10"
            onError={() => {
              // se a url da cor falhar, volta pra base
              if (currentSrc !== safeBaseImage) setCurrentSrc(safeBaseImage)
            }}
          />
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => setRotation((r) => r + 90)}
          >
            <RotateCw className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
          {t.common.interactive3d}
        </div>
      </div>
    </Card>
  )
}
