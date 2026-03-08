import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import OptimizedImage from "./OptimizedImage";

export default function RecentlyViewedSection() {
  const { items } = useRecentlyViewed();
  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl md:text-3xl font-medium text-neutral-dark mb-6">
          Recently Viewed
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {items.slice(0, 6).map((p) => (
            <Link
              key={p.firestoreId || p.id}
              to={`/product/${p.firestoreId || p.id}`}
              className="flex-shrink-0 w-36 snap-center group"
            >
              <div className="bg-white rounded-xl border border-black/5 overflow-hidden aspect-square flex items-center justify-center p-2 group-hover:shadow-lg transition-shadow">
                <OptimizedImage
                  src={p.image || p.imageUrl}
                  alt={p.name}
                  width={200}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-neutral-dark line-clamp-2 overflow-hidden break-words">{p.name}</p>
              <p className="text-primary font-semibold text-sm">₹{p.price ?? p.salePrice ?? "—"}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
