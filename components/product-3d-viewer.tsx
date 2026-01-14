"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ColorImage {
  color: string
  url: string
}

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

  // 🔴 AQUI ESTÁ A CORREÇÃO DEFINITIVA
  const currentImage = useMemo(() => {
    if (!selectedColor || !Array.isArray(colorImages)) return baseImage

    const match = colorImages.find(
      (img) => img.color.toLowerCase() === selectedColor.toLowerCase()
    )

    return match?.url || baseImage
  }, [selectedColor, colorImages, baseImage])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="relative aspect-square bg-muted flex items-center justify-center p-6">
        <div
          className="relative w-full h-full transition-all duration-300"
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
          }}
        >
          <img
            src={currentImage}
            alt={productName}
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>

        {/* CONTROLES */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setRotation((r) => r + 90)}
          >
            <RotateCw className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs bg-background/80 px-3 py-1 rounded-full">
          {t.common.interactive3d}
        </div>
      </div>
    </Card>
  )
}
