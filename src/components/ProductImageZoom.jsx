import { useState } from "react";

export default function ProductImageZoom({ src, alt, className = "" }) {
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain cursor-zoom-in transition-transform duration-300"
        style={
          zoom
            ? {
                transform: "scale(2)",
                transformOrigin: `${position.x}% ${position.y}%`,
              }
            : {}
        }
        onClick={() => setZoom((z) => !z)}
      />
    </div>
  );
}
