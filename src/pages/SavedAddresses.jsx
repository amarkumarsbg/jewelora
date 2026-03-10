import { useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { MapPin, Trash2, Phone, Mail, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import MobileBackHeader from "../components/ui/MobileBackHeader";

const SavedAddresses = () => {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, "users", currentUser.uid, "addresses");
        const snapshot = await getDocs(colRef);
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAddresses(list);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [currentUser]);

  const deleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "addresses", id));
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      toast.success("Address removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen">
      <MobileBackHeader title="Saved Addresses" to="/profile" />
      {/* Header */}
      <div className="bg-primary py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-medium !text-white">
            Saved Addresses
          </h1>
          <p className="mt-2 text-white/80 text-sm md:text-base">
            Manage your delivery addresses for faster checkout
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl border border-black/5 shadow-sm"
          >
            <MapPin size={48} className="mx-auto text-neutral-mid/50 mb-4" />
            <h2 className="font-heading text-xl font-semibold text-neutral-dark mb-2">
              No saved addresses
            </h2>
            <p className="text-neutral-mid text-sm mb-6">
              Add an address during checkout to save it for future orders
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-6 py-3 font-semibold hover:bg-primary-dark transition-colors"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {addresses.map((addr, idx) => (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                >
                  <div className="flex gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-dark mb-1">
                        {addr.fullName}
                      </p>
                      <p className="text-sm text-neutral-dark mb-1">
                        {addr.address}, {addr.city}, {addr.state} – {addr.pincode}
                      </p>
                      {addr.phone && (
                        <p className="text-sm text-neutral-mid flex items-center gap-1.5">
                          <Phone size={14} />
                          {addr.phone}
                        </p>
                      )}
                      {addr.email && (
                        <p className="text-sm text-neutral-mid flex items-center gap-1.5">
                          <Mail size={14} />
                          {addr.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteAddress(addr.id)}
                    className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <p className="text-center text-sm text-neutral-mid mt-8">
              Add new addresses when placing an order from the checkout page
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedAddresses;
