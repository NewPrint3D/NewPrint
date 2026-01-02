"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Product3DViewerProps {
  productImage: string
  productName: string
  selectedColor: string
}

export function Product3DViewer({ productImage, productName, selectedColor }: Product3DViewerProps) {
  const { t } = useLanguage()
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-8">
        <div
          className="relative w-full h-full transition-all duration-500"
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-2xl animate-pulse-glow"
            style={{ backgroundColor: selectedColor }}
          />
          <img
            src={productImage || "/placeholder.svg"}
            alt={productName}
            className="w-full h-full object-contain drop-shadow-2xl relative z-10"
          />
          <div
            className="absolute inset-0 mix-blend-multiply opacity-40 transition-colors duration-300 pointer-events-none z-20"
            style={{ backgroundColor: selectedColor }}
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
