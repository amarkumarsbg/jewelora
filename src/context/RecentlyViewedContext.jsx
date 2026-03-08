import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "jewelora_recently_viewed";
const MAX_ITEMS = 10;

const RecentlyViewedContext = createContext(null);

export function RecentlyViewedProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    }
  }, []);

  const addProduct = (product) => {
    if (!product?.firestoreId && !product?.id) return;
    const id = product.firestoreId || product.id;
    setItems((prev) => {
      const filtered = prev.filter((p) => (p.firestoreId || p.id) !== id);
      const updated = [{ ...product, firestoreId: product.firestoreId || id }, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ items, addProduct }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext) || { items: [], addProduct: () => {} };
}

export function useTrackProduct(product) {
  const { addProduct } = useRecentlyViewed();
  useEffect(() => {
    if (product) addProduct(product);
  }, [product?.firestoreId, product?.id]);
}
