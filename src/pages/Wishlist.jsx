import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useAddToCartAnimation } from "../context/AddToCartAnimationContext";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import MobileBackHeader from "../components/ui/MobileBackHeader";
import OptimizedImage from "../components/OptimizedImage";
import toast from "react-hot-toast";

const Wishlist = () => {
  const { currentUser } = useAuth();
  const { wishlistIds } = useWishlist();
  const { triggerAddAnimation } = useAddToCartAnimation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser || wishlistIds.size === 0) {
        setItems([]);
        return;
      }
      const ref = collection(db, "users", currentUser.uid, "wishlist");
      const snap = await getDocs(ref);
      setItems(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          firestoreId: d.id,
        }))
      );
    };
    fetchWishlist();
  }, [currentUser, wishlistIds.size]);

  const handleRemove = async (productId) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "wishlist", productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Could not remove");
    }
  };

  const handleAddToCart = async (item) => {
    if (!currentUser) {
      toast("Please sign in to add items to cart.");
      return;
    }
    const productId = item.id || item.firestoreId;
    const cartItemRef = doc(db, "carts", currentUser.uid, "items", productId);
    try {
      const existing = await getDoc(cartItemRef);
      if (existing.exists()) {
        await updateDoc(cartItemRef, { quantity: existing.data().quantity + 1 });
      } else {
        await setDoc(cartItemRef, {
          productId,
          name: item.name,
          price: item.salePrice || item.price,
          image: item.image || item.imageUrl,
          quantity: 1,
        });
      }
      triggerAddAnimation();
      toast.success("Added to bag!");
      await handleRemove(productId);
    } catch (err) {
      toast.error("Could not add to bag");
    }
  };

  if (!currentUser) {
    return (
      <section className="min-h-[50vh] bg-cream">
        <MobileBackHeader title="Your Wishlist" to="/" />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <Heart className="mx-auto text-primary/50 mb-4" size={48} />
          <h1 className="font-heading text-2xl md:text-3xl text-neutral-dark mb-4">
            Your Wishlist
          </h1>
          <p className="text-neutral-mid mb-6">
            Sign in to save your favorite items and access them from any device.
          </p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream">
      <MobileBackHeader title="Your Wishlist" to="/shop" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-medium text-neutral-dark mb-8 lg:block hidden">
          Your Wishlist
          {items.length > 0 && (
            <span className="text-neutral-mid font-normal ml-2">({items.length} items)</span>
          )}
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-black/5"
          >
            <Heart className="mx-auto text-primary/30 mb-4" size={64} strokeWidth={1} />
            <p className="text-neutral-mid text-lg mb-2">Your wishlist is empty</p>
            <p className="text-neutral-mid text-sm mb-6">
              Tap the heart on any product to add it here
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-neutral-dark text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-neutral-dark/90 transition-colors"
            >
              <ShoppingBag size={18} />
              Browse Shop
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-y-10">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-black/5 overflow-hidden group"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="block relative aspect-square bg-white p-4"
                >
                  <OptimizedImage
                    src={item.image}
                    alt={item.name}
                    width={400}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(item.id);
                    }}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 shadow-sm hover:bg-primary hover:text-white text-primary transition-all duration-300"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={16} className="fill-current" />
                  </button>
                </Link>
                <div className="p-4">
                  <Link
                    to={`/product/${item.id}`}
                    className="font-medium text-neutral-dark hover:text-primary line-clamp-2 text-sm leading-snug"
                  >
                    {item.name}
                  </Link>
                  <p className="font-semibold text-primary mt-2">₹{item.price ?? "—"}</p>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="mt-3 w-full text-center border-2 border-neutral-dark text-neutral-dark rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-dark hover:text-white transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
