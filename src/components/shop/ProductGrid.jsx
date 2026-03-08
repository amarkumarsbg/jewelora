import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAllProducts } from "../../hooks/useProducts";
import { useProductRatings } from "../../hooks/useProductRatings";
import { useWishlist } from "../../context/WishlistContext";
import OptimizedImage from "../OptimizedImage";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import toast from "react-hot-toast";
import QuickViewModal from "../QuickViewModal";
import { ProductCardSkeleton } from "../ui/Skeleton";

const ProductGrid = ({ category, searchTerm = "", sortOrder = "", minPrice, maxPrice }) => {
  const { data: allProducts = [], isLoading } = useAllProducts();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const visibleProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchCategory = category
        ? product.category?.toLowerCase() === category.toLowerCase()
        : true;
      const matchSearch = searchTerm
        ? product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const price = product.salePrice ?? product.price ?? 0;
      const matchMin = minPrice == null || price >= minPrice;
      const matchMax = maxPrice == null || price <= maxPrice;
      return matchCategory && matchSearch && matchMin && matchMax;
    });
    if (sortOrder === "asc") {
      filtered = [...filtered].sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      );
    } else if (sortOrder === "desc") {
      filtered = [...filtered].sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
      );
    }
    return filtered;
  }, [allProducts, category, searchTerm, sortOrder, minPrice, maxPrice]);

  const productIds = useMemo(
    () => visibleProducts.map((p) => p.firestoreId || p.id),
    [visibleProducts]
  );
  const { data: ratingsMap = {} } = useProductRatings(productIds);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
        {visibleProducts.map((prod, index) => (
          <ProductCard
            key={prod.firestoreId || prod.id || index}
            prod={prod}
            index={index}
            isInWishlist={isInWishlist(prod.firestoreId || prod.id)}
            onToggleWishlist={toggleWishlist}
            onQuickView={() => setQuickViewProduct(prod)}
            rating={ratingsMap[prod.firestoreId || prod.id]}
          />
        ))}
        {visibleProducts.length === 0 && (
          <div className="col-span-full text-center text-neutral-mid py-12">
            No products found.
          </div>
        )}
      </div>
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </>
  );
};

function ProductCard({ prod, index, isInWishlist, onToggleWishlist, onQuickView, rating }) {
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await onToggleWishlist(prod, e);
    if (!result?.success && result?.message) toast(result.message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4 }}
    >
      <div className="relative card-modern bg-white border border-black/5 rounded-2xl overflow-hidden group h-full flex flex-col shadow-sm hover:shadow-xl hover:z-10">
        <Link
          to={`/product/${prod.firestoreId || prod.id}`}
          className="block relative aspect-square bg-white overflow-hidden p-4"
        >
          <OptimizedImage
            src={prod.image}
            alt={prod.name}
            width={520}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            style={{ maxHeight: 260 }}
          />
          <button
            type="button"
            className={`absolute top-3 right-3 p-2.5 rounded-full shadow-sm transition-all duration-300 ${
              isInWishlist
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-white/90 text-neutral-mid hover:bg-primary hover:text-white"
            }`}
            onClick={handleWishlist}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} className={isInWishlist ? "fill-current" : ""} />
          </button>
        </Link>

        <div className="p-5 flex flex-col flex-1">
            <Link
              to={`/product/${prod.firestoreId || prod.id}`}
              className="font-medium text-base text-[#2D2A32] hover:text-primary transition-colors line-clamp-3 mb-3 leading-snug min-h-[3.25rem]"
            >
            {prod.name}
          </Link>

          {(prod.stock === 0 || (prod.stock > 0 && prod.stock <= 5)) && (
            <span className="text-xs font-semibold mb-1">
              {prod.stock === 0 ? (
                <span className="text-error">Out of stock</span>
              ) : (
                <span className="text-warning">Only {prod.stock} left</span>
              )}
            </span>
          )}

          {rating?.count > 0 && (
            <div className="flex items-center gap-1 text-sm mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={s <= Math.round(rating.avg) ? "text-accent" : "text-neutral-300"}
                >
                  ★
                </span>
              ))}
              <span className="text-neutral-mid text-xs">({rating.count})</span>
            </div>
          )}
          {prod.salePrice ? (
            <p className="font-semibold text-primary mt-auto text-lg">
              <span className="line-through text-neutral-mid text-sm mr-2">
                ₹{prod.price}
              </span>
              ₹{prod.salePrice}
            </p>
          ) : (
            <p className="font-semibold text-neutral-dark mt-auto text-lg">
              ₹{prod.price}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onQuickView?.(); }}
              className="flex-1 text-center border border-neutral-dark/30 text-neutral-dark rounded-xl py-3 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-dark/5 transition-all"
            >
              <Eye size={14} className="inline mr-1" /> Quick View
            </button>
            <Link
              to={`/product/${prod.firestoreId || prod.id}`}
              className="flex-1 text-center border-2 border-neutral-dark text-neutral-dark rounded-xl py-3 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-dark hover:text-white transition-all duration-200"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductGrid;
