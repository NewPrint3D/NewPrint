"use client";

import Image from "next/image";

type Props = {
  imagesByColor: Record<string, string>;
  selectedColor: string;
  onChange: (color: string, image: string) => void;
};

export default function ProductGallery({ imagesByColor, selectedColor, onChange }: Props) {
  const colors = Object.keys(imagesByColor);
  const imageSrc = imagesByColor[selectedColor] || imagesByColor[colors[0]];

  return (
    <div>
      <Image
        key={selectedColor}
        src={imageSrc}
        alt="Vaso decorativo"
        width={600}
        height={600}
        priority
      />

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color, imagesByColor[color])}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: selectedColor === color ? "2px solid #00ffff" : "1px solid #555",
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
