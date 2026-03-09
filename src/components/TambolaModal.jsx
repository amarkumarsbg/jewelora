import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Instagram, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const modalCategories = [
  { name: "Mangalsutra", image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766602914/h2gvmvrs1dhkws5l54fv.jpg", slug: "Mangalsutra" },
  { name: "Pendants", image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766569169/g2uieic9vsiq6wufqqfy.jpg", slug: "Pendants" },
  { name: "Earrings", image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766605977/xciabxz0eoiqflshoh5q.jpg", slug: "Earrings" },
  { name: "Bracelets", image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766664915/prikhjwwayexdj02m2mj.jpg", slug: "Bracelets" },
  { name: "Bangles", image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766573932/gf7fm3ltynknxx5v7ezj.jpg", slug: "Bangles" },
  { name: "Necklaces", image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766602799/o91ndinkixpvdaiglfms.jpg", slug: "Necklaces" },
];

export default function PromoModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem("promoShown");
    if (!hasSeenPromo) {
      setShowModal(true);
      sessionStorage.setItem("promoShown", "true");
    }
  }, []);

  const closeModal = () => setShowModal(false);

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-modal-title"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
          onClick={closeModal}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-primary">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-secondary" />
              <h2 id="promo-modal-title" className="font-heading text-lg font-semibold text-white">
                Flat <span className="text-secondary">20% OFF</span> on First Order
              </h2>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white/90 hover:bg-white/20 transition-colors touch-manipulation"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6">
            {/* Category grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
              {modalCategories.map((cat, i) => (
                <Link
                  key={cat.slug}
                  to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  onClick={closeModal}
                  className="group relative block aspect-square rounded-xl overflow-hidden border border-black/5 shadow-sm hover:shadow-md hover:border-secondary/30 transition-all duration-300"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute bottom-1.5 left-1 right-1 text-center text-white text-xs font-semibold drop-shadow-md">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Promo text */}
            <div className="text-center mb-6">
              <p className="text-neutral-mid text-sm mb-1">
                ✨ Follow us on Instagram & get
              </p>
              <p className="font-heading text-xl sm:text-2xl font-semibold text-primary mb-1">
                FREE SHIPPING + Exclusive Deals
              </p>
              <p className="text-neutral-mid text-sm">
                Sign up today and unlock premium jewelry offers curated just for you.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <a
                href="https://www.instagram.com/jew_elora/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeModal}
                className="flex items-center justify-center gap-2 bg-[#E4405F] text-white rounded-xl py-3.5 font-semibold hover:bg-[#d62d4f] transition-colors touch-manipulation"
              >
                <Instagram size={20} />
                Follow on Instagram
              </a>
              <Link
                to="/signup"
                onClick={closeModal}
                className="flex items-center justify-center bg-secondary text-white rounded-xl py-3.5 font-semibold hover:bg-accent transition-colors touch-manipulation"
              >
                Sign Up / Sign In
              </Link>
              <Link
                to="/shop"
                onClick={closeModal}
                className="flex items-center justify-center border-2 border-neutral-dark/30 text-neutral-dark rounded-xl py-3.5 font-semibold hover:bg-neutral-dark hover:text-white transition-colors touch-manipulation"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
