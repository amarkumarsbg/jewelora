import { useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAddToCartAnimation } from "../context/AddToCartAnimationContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import ReactMarkdown from "react-markdown";
import OptimizedImage from "./OptimizedImage";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickViewModal({ product, onClose }) {
  const { currentUser } = useAuth();
  const { triggerAddAnimation } = useAddToCartAnimation();

  useEffect(() => {
    const onEscape = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast("Please sign in to add items to cart.");
      return;
    }
    const productId = product.firestoreId || product.id;
    const cartItemRef = doc(db, "carts", currentUser.uid, "items", productId);
    try {
      const existing = await getDoc(cartItemRef);
      if (existing.exists()) {
        await updateDoc(cartItemRef, { quantity: existing.data().quantity + 1 });
      } else {
        await setDoc(cartItemRef, {
          productId,
          name: product.name,
          price: product.salePrice || product.price,
          image: product.image || product.imageUrl,
          quantity: 1,
        });
      }
      triggerAddAnimation();
      toast.success("Added to bag!");
      onClose();
    } catch (err) {
      toast.error("Could not add to bag");
    }
  };

  if (!product) return null;

  const price = product.salePrice || product.price;
  const originalPrice = product.salePrice ? product.price : null;
  const outOfStock = product.stock === 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        />
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="relative bg-white w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-full bg-white/95 shadow-lg hover:bg-neutral-50 text-neutral-dark touch-manipulation"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="overflow-y-auto flex-1">
            <div className="flex flex-col lg:flex-row">
              {/* Image */}
              <div className="relative flex-shrink-0 lg:w-[45%] aspect-square lg:aspect-auto lg:min-h-[360px] bg-neutral-50 flex items-center justify-center p-6">
                <OptimizedImage
                  src={product.image || product.imageUrl}
                  alt={product.name}
                  width={520}
                  className="max-h-72 lg:max-h-80 w-auto object-contain"
                />
                {product.category && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-semibold uppercase tracking-wider">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col min-w-0">
                <h3 className="font-heading text-xl sm:text-2xl font-semibold text-neutral-dark mb-3 pr-12">
                  {product.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">₹{price}</span>
                  {originalPrice && (
                    <span className="text-neutral-mid line-through text-base">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>

                {outOfStock && (
                  <p className="text-error font-medium text-sm mb-4">Out of stock</p>
                )}

                {/* Description */}
                <div className="text-neutral-mid text-sm leading-relaxed mb-6 pr-2 max-h-40 overflow-y-auto">
                  {product.description ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      }}
                    >
                      {product.description}
                    </ReactMarkdown>
                  ) : (
                    <p>No description available.</p>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={outOfStock}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-4 text-base font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/30 touch-manipulation"
                  >
                    <ShoppingBag size={20} />
                    {outOfStock ? "Out of Stock" : "Add to Bag"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
