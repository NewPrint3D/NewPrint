"use client"

import { useEffect, useMemo, useState } from "react"

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
    return item.src.replace(/\.webp$/i, "").replace(/\.png$/i, "").replace(/\.jpg$/i, "").replace(/\.jpeg$/i, "")
  }
  return item.src
}

function isWebp(src: string) {
  return /\.webp$/i.test(src)
}

function normalizeSrc(src: string) {
  if (!src) return "/placeholder.svg"

  // Se vier URL do GitHub (blob), força raw
  if (src.includes("github.com/") && src.includes("/blob/")) {
    return src.replace("/blob/", "/raw/")
  }

  // Se vier caminho absoluto sem barra, corrige
  if (!src.startsWith("http") && !src.startsWith("/")) {
    return `/${src}`
  }

  return src
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
      const first = uniqueMedia[0]
      setActive(first)
      onSelectItem?.(first)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueMedia])

  if (!active) return null

  const THUMB = 52
  const activeSrc = normalizeSrc(active.src)

  return (
    <div>
      {/* MÍDIA PRINCIPAL */}
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
            aspectRatio: "1 / 1",
          }}
        >
          {active.type === "video" ? (
            <video
              src={activeSrc}
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
            <img
              src={activeSrc}
              alt={active.alt || "Produto"}
              loading="eager"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                const img = e.currentTarget
                if (!img.dataset.fallback) {
                  img.dataset.fallback = "1"
                  img.src = "/placeholder.svg"
                }
              }}
            />
          )}
        </div>
      </div>

      {/* MINIATURAS */}
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
          const src = normalizeSrc(item.src)

          return (
            <button
              key={`${item.type}-${item.src}-${index}`}
              onClick={() => {
                setActive(item)
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
                    src={src}
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
                  <img
                    src={src}
                    alt={item.alt || "Miniatura"}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      const img = e.currentTarget
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = "1"
                        img.src = "/placeholder.svg"
                      }
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
