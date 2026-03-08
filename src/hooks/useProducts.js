import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../firebase";

const PRODUCTS_KEY = ["products"];

async function fetchProducts(filters = {}) {
  const { category, trending, inStock = true, maxCount } = filters;
  const constraints = [where("visible", "==", true)];
  if (inStock) constraints.push(where("stock", ">", 0));
  if (category) constraints.push(where("category", "==", category));
  if (trending) constraints.push(where("trending", "==", true));
  if (maxCount) constraints.push(limit(maxCount));

  const q = query(collection(db, "dynamic_products"), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    firestoreId: doc.id,
    price: Number(doc.data().price) || 0,
    salePrice: doc.data().salePrice ? Number(doc.data().salePrice) : null,
    image: doc.data().imageUrl || doc.data().image,
  }));
}

export function useProducts(options = {}) {
  return useQuery({
    queryKey: [PRODUCTS_KEY[0], options],
    queryFn: () => fetchProducts(options),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: [PRODUCTS_KEY[0], "all"],
    queryFn: () => fetchProducts({ inStock: true, maxCount: 300 }),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts(limitCount = 24) {
  return useQuery({
    queryKey: [PRODUCTS_KEY[0], "featured", limitCount],
    queryFn: () => fetchProducts({ inStock: true, maxCount: limitCount }),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrendingProducts(limitCount = 10) {
  return useQuery({
    queryKey: [PRODUCTS_KEY[0], "trending", limitCount],
    queryFn: () => fetchProducts({ trending: true, inStock: false, maxCount: limitCount }),
    staleTime: 1000 * 60 * 5,
  });
}

export function useHeroProducts(limitCount = 5) {
  return useQuery({
    queryKey: [PRODUCTS_KEY[0], "hero", limitCount],
    queryFn: () => fetchProducts({ trending: true, inStock: true, maxCount: limitCount }),
    staleTime: 1000 * 60 * 5,
  });
}
