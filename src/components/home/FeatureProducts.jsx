import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAddToCartAnimation } from "../../context/AddToCartAnimationContext";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useFeaturedProducts } from "../../hooks/useProducts";
import OptimizedImage from "../OptimizedImage";
import { motion } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 8;

const FeaturedProducts = () => {
  const { currentUser } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { triggerAddAnimation } = useAddToCartAnimation();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: featuredProducts = [] } = useFeaturedProducts();

  const totalPages = Math.ceil(featuredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = featuredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      toast("Please sign in to add items to cart.");
      return;
    }

    const productId = product.firestoreId || product.id;
    const cartItemRef = doc(db, "carts", currentUser.uid, "items", productId);

    try {
      const existing = await getDoc(cartItemRef);

      if (existing.exists()) {
        await updateDoc(cartItemRef, {
          quantity: existing.data().quantity + 1,
        });
      } else {
        await setDoc(cartItemRef, {
          productId: productId,
          name: product.name,
          price: product.price,
          image: product.imageUrl || product.image,
          quantity: 1,
        });
      }

      triggerAddAnimation();
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong while adding to cart.");
    }
  };

  return (
    <section className="py-16 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 font-heading text-3xl md:text-4xl font-medium text-neutral-dark"
        >
          Featured Collections
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {paginatedProducts.map((product, index) => (
            <motion.div
              key={product.firestoreId || product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/product/${product.firestoreId || product.id}`}
                className="block h-full"
              >
                <div className="card-modern bg-white border border-black/5 rounded-2xl overflow-hidden group h-full flex flex-col">
                  <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden p-6 min-h-[280px]">
                    <OptimizedImage
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      width={520}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                      style={{ maxHeight: 260 }}
                    />
                    <button
                      type="button"
                      className={`absolute top-3 right-3 p-2.5 rounded-full shadow-sm transition-all duration-300 ${
                        isInWishlist(product.firestoreId || product.id)
                          ? "bg-primary text-white hover:bg-primary-dark"
                          : "bg-white/90 text-neutral-mid hover:bg-primary hover:text-white"
                      }`}
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const result = await toggleWishlist(product, e);
                        if (!result?.success && result?.message) toast(result.message);
                      }}
                      aria-label={isInWishlist(product.firestoreId || product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart size={16} className={isInWishlist(product.firestoreId || product.id) ? "fill-current" : ""} />
                    </button>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-medium text-sm md:text-base text-[#2D2A32] line-clamp-2 mb-3 leading-snug overflow-hidden break-words min-w-0">
                      {product.name}
                    </h3>

                    <p className="font-semibold text-primary mb-4 text-lg md:text-xl">
                      ₹{product.price}
                    </p>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="mt-auto w-full bg-neutral-dark text-white rounded-xl py-3.5 px-4 text-sm font-semibold uppercase tracking-wider hover:bg-neutral-dark/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-neutral-dark font-semibold hover:bg-primary-light hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <span className="text-neutral-mid font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-neutral-dark font-semibold hover:bg-primary-light hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-border transition-all"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
