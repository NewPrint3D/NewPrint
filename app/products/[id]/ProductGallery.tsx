"use client"

import { useMemo, useState, useEffect } from "react"
import Image from "next/image"

type MediaItem = {
  type: "image" | "video"
  src: string
  alt?: string
  hex?: string
  colorName?: { pt: string; en: string; es: string }
}

type Props = {
  media: MediaItem[]
  onSelectItem?: (item: MediaItem) => void
}

function getKeyForItem(item: MediaItem) {
  if (item.type === "image") {
    return item.src.replace(/\.webp$/i, "").replace(/\.png$/i, "")
  }
  return item.src
}

function isWebp(src: string) {
  return /\.webp$/i.test(src)
}

export default function ProductGallery({ media, onSelectItem }: Props) {
  const uniqueMedia = useMemo(() => {
    const map = new Map<string, MediaItem>()

    for (const item of media) {
      const key = getKeyForItem(item)
      const existing = map.get(key)

      if (!existing) {
        map.set(key, item)
        continue
      }

      if (item.type === "image" && existing.type === "image") {
        if (isWebp(item.src) && !isWebp(existing.src)) {
          map.set(key, item)
        }
      }
    }

    const ordered: MediaItem[] = []
    for (const item of media) {
      const key = getKeyForItem(item)
      const chosen = map.get(key)
      if (chosen && !ordered.includes(chosen)) ordered.push(chosen)
    }

    return ordered.length ? ordered : media
  }, [media])

  const [active, setActive] = useState<MediaItem | null>(null)

  useEffect(() => {
    if (uniqueMedia.length) {
      setActive(uniqueMedia[0])
      onSelectItem?.(uniqueMedia[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueMedia])

  if (!active) return null

  // ✅ tamanhos padronizados
  const THUMB = 52

  return (
    <div>
      {/* ✅ MÍDIA PRINCIPAL
          - remove “moldura/borda preta” (sem letterbox)
          - força o conteúdo a preencher o quadro
      */}
      <div
        style={{
          marginBottom: 14,
          borderRadius: 12,
          overflow: "hidden",
          background: "transparent",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            // ✅ quadro fixo para padronizar todas as imagens (evita “bordas”)
            aspectRatio: "1 / 1",
          }}
        >
          {active.type === "video" ? (
            <video
              src={active.src}
              controls
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                background: "transparent",
              }}
            />
          ) : (
            <Image
              src={active.src}
              alt={active.alt || "Produto"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "cover",
                display: "block",
              }}
            />
          )}
        </div>
      </div>

      {/* ✅ MINIATURAS (menores + padronizadas) */}
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 6,
        }}
      >
        {uniqueMedia.map((item, index) => {
          const isActive = active.src === item.src

          return (
            <button
              key={`${item.type}-${item.src}-${index}`}
              onClick={() => {
                setActive(item)
                // 🔒 vídeo NÃO altera cor
                if (item.type === "image") onSelectItem?.(item)
              }}
              style={{
                border: isActive ? "2px solid #00ffff" : "1px solid rgba(255,255,255,0.18)",
                padding: 2,
                borderRadius: 10,
                cursor: "pointer",
                background: "transparent",
                flex: "0 0 auto",
              }}
              aria-label={item.alt || "Miniatura"}
            >
              <div
                style={{
                  width: THUMB,
                  height: THUMB,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "transparent",
                }}
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt || "Miniatura"}
                    width={THUMB}
                    height={THUMB}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
