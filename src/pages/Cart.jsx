import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import products from "../components/shop/product";
import { Minus, Plus, Trash2, LogIn, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const getEstimatedDelivery = () => {
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);
  start.setDate(today.getDate() + 5);
  end.setDate(today.getDate() + 8);
  const fmt = (d) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
};

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) return;

      const cartRef = collection(db, "carts", currentUser.uid, "items");
      const snapshot = await getDocs(cartRef);

      const firebaseItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const merged = firebaseItems.map((item) => {
        const local = products.find((p) => p.id === item.productId);
        return {
          ...item,
          image: local?.image || item.imageUrl || item.image || "",
          name: item.name || local?.name || "Unnamed Product",
          price: item.price || local?.price || 0,
        };
      });

      setCartItems(merged);
    };

    fetchCart();
  }, [currentUser]);

  const handleIncrease = async (item) => {
    const itemRef = doc(db, "carts", currentUser.uid, "items", item.id);
    const newQuantity = item.quantity + 1;
    await updateDoc(itemRef, { quantity: newQuantity });
    setCartItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity } : i))
    );
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;
    const itemRef = doc(db, "carts", currentUser.uid, "items", item.id);
    const newQuantity = item.quantity - 1;
    await updateDoc(itemRef, { quantity: newQuantity });
    setCartItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity } : i))
    );
  };

  const handleRemove = async (itemId) => {
    const itemRef = doc(db, "carts", currentUser.uid, "items", itemId);
    await deleteDoc(itemRef);
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    toast.success("Removed from cart");
  };

  const goToCheckout = () => {
    if (!currentUser) {
      toast("Please sign in to proceed to checkout");
      return;
    }
    navigate("/checkout");
  };

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + parseInt(String(item.price).replace(/[^\d]/g, "")) * item.quantity,
    0
  );

  // Sign-in gate for guests
  if (!currentUser) {
    return (
      <section className="min-h-[60vh] bg-cream flex items-center justify-center py-16">
        <div className="mx-auto max-w-lg px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] p-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <LogIn className="text-primary" size={40} />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-medium text-neutral-dark mb-3">
              Sign in to view your cart
            </h2>
            <p className="text-neutral-mid mb-8 max-w-sm mx-auto">
              Create an account or sign in to add items to your cart and proceed to checkout securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signin"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white rounded-full px-8 py-3.5 font-semibold hover:bg-primary-dark transition-colors"
              >
                <LogIn size={20} />
                Sign In
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 border-2 border-neutral-dark text-neutral-dark rounded-full px-8 py-3.5 font-semibold hover:bg-neutral-dark hover:text-white transition-colors"
              >
                <ShoppingBag size={20} />
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <h2 className="font-heading text-3xl md:text-4xl font-medium text-neutral-dark mb-8 text-center">
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-black/5 p-12 text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="text-neutral-mid" size={32} />
          </div>
          <p className="text-neutral-mid text-lg mb-6">Your cart is empty</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-neutral-dark text-white rounded-full px-6 py-3 font-semibold hover:bg-neutral-dark/90 transition-colors"
          >
            <ShoppingBag size={18} />
            Browse Shop
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="bg-white border border-black/5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-48 h-48 flex-shrink-0 flex items-center justify-center bg-white p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h5 className="font-semibold text-neutral-dark">{item.name}</h5>
                    <p className="text-primary font-semibold mt-1">₹{item.price}</p>
                    <p className="text-neutral-mid text-sm mt-1">Beautifully crafted jewelry piece.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 bg-primary-light/30">
                      <button
                        type="button"
                        className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-primary hover:bg-primary/20 rounded transition-colors touch-manipulation"
                        onClick={() => handleDecrease(item)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-primary hover:bg-primary/20 rounded transition-colors touch-manipulation"
                        onClick={() => handleIncrease(item)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="flex items-center gap-2 px-4 py-2 border border-error/50 text-error rounded-xl text-sm font-semibold hover:bg-error/10 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sticky top-24">
              <h5 className="font-heading font-semibold text-neutral-dark mb-4">
                Cart Summary
              </h5>
              <p className="text-sm text-neutral-mid mb-2">
                Total Items: <span className="font-semibold text-neutral-dark">{cartItems.length}</span>
              </p>
              <p className="text-sm text-neutral-mid mb-2">
                Estimated Delivery: <span className="font-semibold text-neutral-dark">{getEstimatedDelivery()}</span>
              </p>
              <p className="text-lg mb-6">
                Total Price: <span className="font-bold text-primary">₹{totalPrice}</span>
              </p>
              <button
                onClick={goToCheckout}
                className="w-full bg-primary text-white rounded-full py-3.5 font-semibold hover:bg-primary-dark transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
