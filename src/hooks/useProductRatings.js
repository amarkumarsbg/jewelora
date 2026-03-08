import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export function useProductRatings(productIds) {
  const ids = (productIds || []).filter(Boolean);
  const hasIds = ids.length > 0;

  return useQuery({
    queryKey: ["productRatings", ids.sort().join(",")],
    queryFn: async () => {
      if (ids.length === 0) return {};
      const results = {};
      ids.forEach((id) => { results[id] = { avg: 0, count: 0 }; });

      // Firestore 'in' supports up to 30 items
      const chunkSize = 30;
      for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        const q = query(
          collection(db, "reviews"),
          where("productId", "in", chunk)
        );
        const snap = await getDocs(q);
        const byProduct = {};
        chunk.forEach((id) => { byProduct[id] = []; });
        snap.docs.forEach((d) => {
          const data = d.data();
          const pid = data.productId;
          if (byProduct[pid]) byProduct[pid].push(data.rating || 0);
        });
        Object.entries(byProduct).forEach(([pid, ratings]) => {
          if (ratings.length > 0) {
            const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
            results[pid] = { avg, count: ratings.length };
          }
        });
      }
      return results;
    },
    enabled: hasIds,
    staleTime: 1000 * 60 * 2,
  });
}
