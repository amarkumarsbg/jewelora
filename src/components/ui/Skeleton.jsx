export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-black/5 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-100 rounded w-3/4" />
        <div className="h-4 bg-neutral-100 rounded w-1/2" />
        <div className="h-4 bg-neutral-100 rounded w-1/3" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <div className="aspect-square bg-neutral-100 rounded-xl animate-pulse" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 bg-neutral-100 rounded w-full animate-pulse" />
          <div className="h-4 bg-neutral-100 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-neutral-100 rounded w-1/2 animate-pulse" />
          <div className="h-10 bg-neutral-100 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
