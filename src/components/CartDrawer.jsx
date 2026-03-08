import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import products from "./shop/product";

const CartDrawer = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = currentUser?.email === "info@jewelora.in";

  useEffect(() => {
    if (!isOpen) return;
    if (!currentUser || isAdmin) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    const fetchCart = async () => {
      const snap = await getDocs(collection(db, "carts", currentUser.uid, "items"));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const merged = items.map((item) => {
        const local = products.find((p) => p.id === item.productId);
        return {
          ...item,
          image: item.image || item.imageUrl || local?.image || "",
          name: item.name || local?.name || "Product",
          price: item.price || local?.price || 0,
        };
      });
      setCartItems(merged);
      setLoading(false);
    };
    fetchCart();
  }, [isOpen, currentUser, isAdmin]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (parseInt(String(item.price).replace(/[^\d]/g, "")) || 0) * (item.quantity || 1),
    0
  );

  const showSignIn = !currentUser || isAdmin;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:bg-black/20"
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
              <h3 className="font-heading text-xl font-semibold text-neutral-dark">
                Your Cart {cartItems.length > 0 && `(${cartItems.length})`}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-neutral-mid hover:bg-neutral-dark/5 hover:text-neutral-dark transition-colors"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {showSignIn ? (
                <div className="p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <LogIn className="text-primary" size={28} />
                  </div>
                  <h4 className="font-heading text-lg font-semibold text-neutral-dark mb-2">
                    Sign in required
                  </h4>
                  <p className="text-neutral-mid text-sm mb-6 max-w-xs">
                    Sign in to add items to your cart and proceed to checkout securely.
                  </p>
                  <Link
                    to="/signin"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <LogIn size={18} />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={onClose}
                    className="mt-3 text-sm text-primary hover:underline"
                  >
                    Create an account
                  </Link>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <ShoppingCart className="text-neutral-mid" size={28} />
                  </div>
                  <h4 className="font-medium text-neutral-dark mb-2">Your cart is empty</h4>
                  <p className="text-neutral-mid text-sm mb-6">Add some beautiful pieces to get started.</p>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 bg-neutral-dark text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-neutral-dark/90 transition-colors"
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <ul className="p-4 space-y-4">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex gap-4 p-3 rounded-xl bg-cream/50 border border-black/5">
                      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-white rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-dark text-sm line-clamp-2">{item.name}</p>
                        <p className="text-primary font-semibold text-sm mt-1">
                          ₹{item.price} × {item.quantity || 1}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!showSignIn && cartItems.length > 0 && (
              <div className="border-t border-black/5 p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-neutral-mid">Subtotal</span>
                  <span className="font-bold text-neutral-dark">₹{totalPrice}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full bg-primary text-white text-center rounded-full py-3.5 font-semibold hover:bg-primary-dark transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="block w-full mt-3 text-center text-sm text-neutral-mid hover:text-primary transition-colors"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
