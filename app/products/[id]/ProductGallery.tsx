"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  imagesByColor: Record<string, string>;
};

export default function ProductGallery({ imagesByColor }: Props) {
  const colors = Object.keys(imagesByColor);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div>
      {/* Imagem do produto */}
      <Image
        key={selectedColor}
        src={imagesByColor[selectedColor]}
        alt="Vaso decorativo"
        width={600}
        height={600}
        priority
      />

      {/* Bolinhas de cor */}
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border:
                selectedColor === color
                  ? "2px solid #00ffff"
                  : "1px solid #555",
              background: color,
              cursor: "pointer",
            }}
            aria-label={`Cor ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
