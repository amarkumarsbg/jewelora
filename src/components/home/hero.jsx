import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHeroProducts } from "../../hooks/useProducts";
import OptimizedImage from "../OptimizedImage";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: productsRaw = [] } = useHeroProducts();
  const products = [...productsRaw].sort((a, b) => {
    if (a.name === "Emerald Noor Bridal Kundan Necklace Set") return -1;
    if (b.name === "Emerald Noor Bridal Kundan Necklace Set") return 1;
    return 0;
  });

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  // Fallback hero when no trending products
  if (products.length === 0) {
    return (
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#121113] via-[#121113]/95 to-primary-dark/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative z-10 text-center px-6 py-16">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight"
          >
            Discover Elegance
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg md:text-xl text-white/80 max-w-xl mx-auto"
          >
            Handcrafted jewelry that defines your style
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/shop"
              className="inline-block mt-8 bg-white text-neutral-dark rounded-full px-10 py-4 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <section className="relative min-h-[50vh] md:min-h-[55vh] flex overflow-hidden bg-primary">
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left: Details */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 md:py-14 md:pl-12 md:pr-8 order-2 md:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.firestoreId}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
              className="text-white"
            >
              <p className="text-secondary font-semibold text-lg mb-2">
                Starting ₹{currentProduct.salePrice || currentProduct.price}
              </p>
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight line-clamp-2 text-[#FFF9ED] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                {currentProduct.name}
              </h2>
              {currentProduct.salePrice && (
                <p className="mt-2 text-white/80 text-sm">
                  <span className="line-through">₹{currentProduct.price}</span>
                  <span className="ml-2 text-secondary font-semibold">₹{currentProduct.salePrice}</span>
                </p>
              )}
              <Link
                to={`/product/${currentProduct.firestoreId}`}
                className="inline-block mt-6 bg-white text-neutral-dark rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Shop Now
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Image */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-10 order-1 md:order-2 bg-white/5 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md flex items-center justify-center"
            >
              <OptimizedImage
                src={currentProduct.imageUrl || currentProduct.image}
                alt={currentProduct.name}
                width={520}
                lazy={false}
                className="max-h-[280px] md:max-h-[360px] w-auto object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {products.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => (i === 0 ? products.length - 1 : i - 1))}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => (i + 1) % products.length)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors touch-manipulation"
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`min-w-[44px] min-h-[44px] rounded-full transition-all touch-manipulation ${
                  i === currentIndex ? "bg-white w-8 h-3" : "bg-white/50 w-3 h-3 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Hero;
