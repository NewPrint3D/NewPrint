"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";

type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

type Props = {
  media: MediaItem[];
};

function getKeyForItem(item: MediaItem) {
  // Para imagens: agrupa webp/png do mesmo "nome" (ex: /preto.webp e /preto.png)
  if (item.type === "image") {
    return item.src.replace(/\.webp$/i, "").replace(/\.png$/i, "");
  }
  // Para vídeo: chave fixa por src
  return item.src;
}

function isWebp(src: string) {
  return /\.webp$/i.test(src);
}

export default function ProductGallery({ media }: Props) {
  // 1) Dedup: mantém 1 miniatura por imagem (preferindo webp)
  const uniqueMedia = useMemo(() => {
    const map = new Map<string, MediaItem>();

    for (const item of media) {
      const key = getKeyForItem(item);
      const existing = map.get(key);

      if (!existing) {
        map.set(key, item);
        continue;
      }

      // Se já existe e o novo é WEBP, substitui (preferência)
      if (item.type === "image" && existing.type === "image") {
        if (isWebp(item.src) && !isWebp(existing.src)) {
          map.set(key, item);
        }
      }
    }

    // Mantém a ordem original: vídeo primeiro, depois imagens
    const ordered: MediaItem[] = [];
    for (const item of media) {
      const key = getKeyForItem(item);
      const chosen = map.get(key);
      if (chosen && !ordered.includes(chosen)) ordered.push(chosen);
    }

    return ordered.length ? ordered : media;
  }, [media]);

  const [active, setActive] = useState<MediaItem>(uniqueMedia[0]);

  // Se o media mudar (deploy, troca de produto), garante active válido
  useEffect(() => {
    setActive(uniqueMedia[0]);
  }, [uniqueMedia]);

  return (
    <div>
      {/* Mídia principal */}
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

      {/* Miniaturas embaixo */}
      <div style={{ display: "flex", gap: 12 }}>
        {uniqueMedia.map((item, index) => (
          <button
            key={`${item.type}-${item.src}-${index}`}
            onClick={() => setActive(item)}
            style={{
              border:
                active.type === item.type && active.src === item.src
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
                style={{ borderRadius: 4, width: 60, height: 60, objectFit: "cover" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
