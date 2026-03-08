import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setWishlistIds(new Set());
      setLoading(false);
      return;
    }

    const wishlistRef = collection(db, "users", currentUser.uid, "wishlist");
    const unsub = onSnapshot(wishlistRef, (snap) => {
      const ids = new Set(snap.docs.map((d) => d.id));
      setWishlistIds(ids);
    });
    setLoading(false);
    return () => unsub();
  }, [currentUser]);

  const isInWishlist = (productId) => wishlistIds.has(productId);

  const toggleWishlist = async (product, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!currentUser) {
      return { success: false, message: "Sign in to save items to your wishlist" };
    }
    const productId = product.firestoreId || product.id;
    if (!productId) return { success: false };

    try {
      const itemRef = doc(db, "users", currentUser.uid, "wishlist", productId);
      if (wishlistIds.has(productId)) {
        await deleteDoc(itemRef);
        return { success: true, removed: true };
      }
      await setDoc(itemRef, {
        productId,
        name: product.name,
        price: product.price ?? product.salePrice,
        image: product.image || product.imageUrl,
        addedAt: new Date().toISOString(),
      });
      return { success: true, added: true };
    } catch (err) {
      console.error("Wishlist error:", err);
      return { success: false, message: "Could not update wishlist" };
    }
  };

  const wishlistCount = wishlistIds.size;

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        wishlistCount,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
