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

  return (
    <div>
      {/* mídia principal */}
      <div style={{ marginBottom: 16 }}>
        {active.type === "video" ? (
          <video
            src={active.src}
            controls
            playsInline
            style={{ width: "100%", borderRadius: 8 }}
          />
        ) : (
          <Image
            src={active.src}
            alt={active.alt || "Produto"}
            width={900}
            height={900}
            priority
            style={{ borderRadius: 8, width: "100%", height: "auto" }}
          />
        )}
      </div>

      {/* miniaturas */}
      <div style={{ display: "flex", gap: 12 }}>
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
              border:
                active.src === item.src
                  ? "2px solid #00ffff"
                  : "1px solid #444",
              padding: 2,
              borderRadius: 6,
              cursor: "pointer",
              background: "transparent",
            }}
          >
            {item.type === "video" ? (
              <video
                src={item.src}
                muted
                playsInline
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            ) : (
              <Image
                src={item.src}
                alt={item.alt || "Miniatura"}
                width={60}
                height={60}
                style={{
                  borderRadius: 4,
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
