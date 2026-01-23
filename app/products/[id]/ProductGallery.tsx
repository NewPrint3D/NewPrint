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

  const isActive = (item: MediaItem) => active?.type === item.type && active?.src === item.src

  return (
    <div style={{ width: "100%" }}>
      {/* mídia principal (tamanho padronizado) */}
      <div
        style={{
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 12,

          // caixa padrão (responsiva): mantém sempre o mesmo "tamanho visual"
          aspectRatio: "1 / 1",
          maxHeight: 560,
          position: "relative",
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
              objectFit: "contain", // ✅ não corta, padroniza (principalmente a branca)
              padding: 14, // ✅ dá “respiro” para não encostar nas bordas
            }}
          />
        )}
      </div>

      {/* miniaturas (menores + scroll se precisar) */}
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 4,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {uniqueMedia.map((item, index) => (
          <button
            key={`${item.type}-${item.src}-${index}`}
            onClick={() => {
              setActive(item)

              // 🔒 vídeo NÃO altera cor
              if (item.type === "image") {
                onSelectItem?.(item)
              }
            }}
            style={{
              border: isActive(item) ? "2px solid #00ffff" : "1px solid rgba(255,255,255,0.18)",
              padding: 2,
              borderRadius: 10,
              cursor: "pointer",
              background: "rgba(255,255,255,0.03)",
              flex: "0 0 auto",
            }}
            aria-label="Selecionar mídia"
            type="button"
          >
            <div
              style={{
                width: 48, // ✅ menor
                height: 48, // ✅ menor
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
                background: "rgba(0,0,0,0.25)",
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
                  }}
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt || "Miniatura"}
                  fill
                  sizes="48px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
