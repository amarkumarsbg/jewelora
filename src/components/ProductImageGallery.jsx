import { useState, useRef } from "react";
import ProductImageZoom from "./ProductImageZoom";
import { motion } from "framer-motion";

export default function ProductImageGallery({ product }) {
  const mainImg = product?.image || product?.imageUrl;
  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : mainImg ? [mainImg] : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const currentSrc = images[activeIndex] || mainImg;

  const handleDragEnd = (_, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold && activeIndex < images.length - 1) {
      setActiveIndex((i) => i + 1);
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex((i) => i - 1);
    }
  };

  if (!currentSrc) return null;

  const hasMultiple = images.length > 1;

  return (
    <div className="space-y-4">
      {/* Main image - swipeable on touch */}
      <motion.div
        key={activeIndex}
        drag={hasMultiple ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="touch-pan-y"
      >
        <ProductImageZoom
          src={currentSrc}
          alt={product?.name || "Product"}
          className="w-full max-h-[500px]"
        />
      </motion.div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === i ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-neutral-300"
              }`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
