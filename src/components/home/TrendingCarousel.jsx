import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTrendingProducts } from "../../hooks/useProducts";
import OptimizedImage from "../OptimizedImage";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TrendingCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: products = [], isLoading } = useTrendingProducts();

  if (isLoading || products.length === 0) return null;

  const currentProduct = products[currentIndex];

  const next = () => setCurrentIndex((i) => (i + 1) % products.length);
  const prev = () => setCurrentIndex((i) => (i === 0 ? products.length - 1 : i - 1));

  return (
    <section className="py-16 bg-[#121113]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 font-heading text-3xl font-medium text-white"
        >
          Trending Jewelry
        </motion.h2>

        <div className="relative rounded-xl overflow-hidden shadow-lg bg-white">
          <div className="aspect-[16/9] md:aspect-[21/9] flex items-center justify-center bg-white">
            <OptimizedImage
              src={currentProduct.imageUrl || currentProduct.image}
              alt={currentProduct.name}
              width={1200}
              lazy={false}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
            <div className="relative p-3 pt-6">
              <div className="flex flex-col items-center text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
              <h5 className="font-heading font-semibold text-base md:text-lg text-white line-clamp-1 overflow-hidden text-ellipsis text-center px-4 w-full">
                {currentProduct.name}
              </h5>
              <div className="mt-2 flex gap-2">
                {currentProduct.stock === 0 ? (
                  <span className="rounded-full bg-error/90 px-3 py-1 text-xs font-semibold">
                    Out of Stock
                  </span>
                ) : currentProduct.stock <= 5 ? (
                  <span className="rounded-full bg-warning/90 px-3 py-1 text-xs font-semibold text-neutral-dark">
                    Only {currentProduct.stock} left
                  </span>
                ) : (
                  <span className="rounded-full bg-success/90 px-3 py-1 text-xs font-semibold">
                    In Stock
                  </span>
                )}
              </div>
              <Link
                to={`/product/${currentProduct.firestoreId}`}
                className="mt-3 bg-primary hover:bg-primary-dark text-white rounded-full px-6 py-2 text-sm font-semibold transition-colors"
              >
                Shop Now
              </Link>
              </div>
            </div>
          </div>

          {products.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-dark flex items-center justify-center shadow-lg"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-dark flex items-center justify-center shadow-lg"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
