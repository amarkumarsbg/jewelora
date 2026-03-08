import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAddToCartAnimation } from "../context/AddToCartAnimationContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import OptimizedImage from "./OptimizedImage";
import toast from "react-hot-toast";

export default function QuickViewModal({ product, onClose }) {
  const { currentUser } = useAuth();

  useEffect(() => {
    const onEscape = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast("Please sign in to add items to cart.");
      return;
    }
    const productId = product.firestoreId || product.id;
    const cartItemRef = doc(db, "carts", currentUser.uid, "items", productId);
    try {
      const existing = await getDoc(cartItemRef);
      if (existing.exists()) {
        await updateDoc(cartItemRef, { quantity: existing.data().quantity + 1 });
      } else {
        await setDoc(cartItemRef, {
          productId,
          name: product.name,
          price: product.salePrice || product.price,
          image: product.image || product.imageUrl,
          quantity: 1,
        });
      }
      triggerAddAnimation();
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Could not add to cart");
    }
  };

  if (!product) return null;

  const price = product.salePrice || product.price;
  const outOfStock = product.stock === 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-neutral-100 text-neutral-dark"
        >
          <X size={20} />
        </button>

        <div className="lg:w-1/2 flex items-center justify-center bg-white p-8 min-h-[240px]">
          <OptimizedImage
            src={product.image || product.imageUrl}
            alt={product.name}
            width={400}
            className="max-h-72 w-auto object-contain"
          />
        </div>

        <div className="lg:w-1/2 p-6 flex flex-col">
          <h3 className="font-heading text-xl font-semibold text-neutral-dark mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-primary font-bold text-xl mb-4">₹{price}</p>
          <p className="text-neutral-mid text-sm line-clamp-3 mb-6">{product.description?.slice(0, 120)}...</p>
          <div className="mt-auto space-y-3">
            <Link
              to={`/product/${product.firestoreId || product.id}`}
              onClick={onClose}
              className="block w-full text-center border-2 border-neutral-dark text-neutral-dark rounded-xl py-3 text-sm font-semibold hover:bg-neutral-dark hover:text-white transition-colors"
            >
              View Full Details
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="w-full bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {outOfStock ? "Out of Stock" : "Add to Bag"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
