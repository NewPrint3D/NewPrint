"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Product3DViewerProps {
  productImage: string
  productName: string
  selectedColor: string // mantido para compatibilidade, mas NÃO aplicamos mais overlay de cor
}

export function Product3DViewer({ productImage, productName }: Product3DViewerProps) {
  const { t } = useLanguage()
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)

  const src = productImage?.trim() ? productImage : "/placeholder.svg"

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-8">
        <div
          className="relative w-full h-full transition-all duration-500"
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
          }}
        >
          {/* ✅ Sem overlays de cor. A cor do produto vem 100% da URL da imagem. */}
          <img
            src={src}
            alt={productName}
            className="w-full h-full object-contain drop-shadow-2xl"
            loading="eager"
          />
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => setRotation((r) => r + 90)}
            aria-label="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => setZoom((z) => Math.min(2, Number((z + 0.2).toFixed(2))))}
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.2).toFixed(2))))}
            aria-label="Zoom out"
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
