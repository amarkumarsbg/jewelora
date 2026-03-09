import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductGrid from "../components/shop/ProductGrid";
import FeaturedProducts from "../components/home/FeatureProducts";
import PullToRefresh from "../components/PullToRefresh";
import { motion } from "framer-motion";

const Shop = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const query = new URLSearchParams(location.search);

  const rawCategory = query.get("category");
  const category = rawCategory
    ? decodeURIComponent(rawCategory)
    : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const categoryFilters = [
    { name: "All", slug: null },
    { name: "Mangalsutra", slug: "Mangalsutra" },
    { name: "Necklaces", slug: "Necklaces" },
    { name: "Pendants", slug: "Pendants" },
    { name: "Bangles", slug: "Bangles" },
    { name: "Bracelets", slug: "Bracelets" },
    { name: "Earrings", slug: "Earrings" },
    { name: "Rakhi", slug: "Rakhi" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-linen"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Sticky filter bar */}
        <div className="sticky top-20 z-30 mb-6 -mx-4 px-4 py-4 bg-white/95 backdrop-blur-md border-b border-black/5 shadow-sm rounded-xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-mid" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 py-2.5 text-sm placeholder:text-neutral-mid focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  className="flex-1 min-w-[140px] rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-neutral-dark focus:border-primary focus:outline-none transition-all"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">Sort</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
                <button
                  type="button"
                  onClick={() => setShowPriceFilter(!showPriceFilter)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    showPriceFilter ? "bg-primary text-white border-primary" : "border-black/10 text-neutral-dark hover:border-primary hover:text-primary"
                  }`}
                >
                  <SlidersHorizontal size={16} /> Price
                </button>
              </div>
            </div>

            {showPriceFilter && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-3 sm:gap-4 items-center pt-2 border-t border-black/5"
              >
                <span className="text-xs font-medium text-neutral-mid">Price range (₹)</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={priceRange.min || ""}
                  onChange={(e) => setPriceRange((p) => ({ ...p, min: parseInt(e.target.value) || 0 }))}
                  className="min-w-0 flex-1 w-20 sm:w-28 rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <span className="text-neutral-mid shrink-0">–</span>
                <input
                  type="number"
                  min={priceRange.min}
                  placeholder="Max"
                  value={priceRange.max === 100000 ? "" : priceRange.max}
                  onChange={(e) => setPriceRange((p) => ({ ...p, max: parseInt(e.target.value) || 100000 }))}
                  className="min-w-0 flex-1 w-20 sm:w-28 rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Category pills - horizontal scroll */}
        <div className="overflow-x-auto -mx-4 px-4 pb-4 scrollbar-hide">
          <div className="flex gap-2 min-w-max pb-2">
            {categoryFilters.map((cat) => {
              const isActive = (category || null) === cat.slug;
              return (
                <Link
                  key={cat.slug ?? "all"}
                  to={cat.slug ? `/shop?category=${encodeURIComponent(cat.slug)}` : "/shop"}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-neutral-dark border border-black/10 hover:border-primary hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        <PullToRefresh
          onRefresh={() => queryClient.invalidateQueries({ queryKey: ["products"] })}
        >
          <ProductGrid
            category={category}
            searchTerm={searchTerm}
            sortOrder={sortOrder}
            minPrice={priceRange.min}
            maxPrice={priceRange.max === 100000 ? undefined : priceRange.max}
          />
        </PullToRefresh>

        {!category && (
          <div className="mt-16">
            <FeaturedProducts />
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Shop;
