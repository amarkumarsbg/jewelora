import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useAllProducts } from "../hooks/useProducts";
import OptimizedImage from "./OptimizedImage";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: products = [] } = useAllProducts();
  const ref = useRef(null);

  const results = query.trim().length >= 2
    ? products
        .filter(
          (p) =>
            p.name?.toLowerCase().includes(query.toLowerCase()) ||
            p.category?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-mid" />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-44 lg:w-56 pl-10 pr-9 py-2 rounded-full border border-black/10 bg-white/50 text-sm placeholder:text-neutral-mid/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-mid touch-manipulation"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-black/10 shadow-xl py-2 z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-neutral-mid text-sm text-center">No products found</p>
          ) : (
            results.map((p) => (
              <Link
                key={p.firestoreId || p.id}
                to={`/product/${p.firestoreId || p.id}`}
                onClick={() => { setQuery(""); setIsOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary-light/50 transition-colors"
              >
                <div className="w-12 h-12 flex-shrink-0 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                  <OptimizedImage src={p.image} alt="" width={96} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-dark text-sm line-clamp-1">{p.name}</p>
                  <p className="text-primary font-semibold text-sm">₹{p.salePrice ?? p.price}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
