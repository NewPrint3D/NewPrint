"use client";

import { useState } from "react";
import Image from "next/image";

type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

type Props = {
  media: MediaItem[];
};

export default function ProductGallery({ media }: Props) {
  const [active, setActive] = useState(media[0]);

  return (
    <div>
      {/* Mídia principal */}
      <div style={{ marginBottom: 16 }}>
        {active.type === "video" ? (
          <video
            src={active.src}
            controls
            style={{ width: "100%", borderRadius: 8 }}
          />
        ) : (
          <Image
            src={active.src}
            alt={active.alt || "Produto"}
            width={600}
            height={600}
            priority
            style={{ borderRadius: 8 }}
          />
        )}
      </div>

      {/* Miniaturas embaixo */}
      <div style={{ display: "flex", gap: 12 }}>
        {media.map((item, index) => (
          <button
            key={index}
            onClick={() => setActive(item)}
            style={{
              border: active.src === item.src ? "2px solid #00ffff" : "1px solid #444",
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
                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
              />
            ) : (
              <Image
                src={item.src}
                alt={item.alt || "Miniatura"}
                width={60}
                height={60}
                style={{ borderRadius: 4 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
