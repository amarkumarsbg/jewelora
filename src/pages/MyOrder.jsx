import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Package,
  MapPin,
  ExternalLink,
  Star,
  Send,
  ImagePlus,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ReceiptInvoice from "../components/ReceiptInvoice";
import { Link } from "react-router-dom";
import MobileBackHeader from "../components/ui/MobileBackHeader";

// Review Form (modernized)
const ReviewForm = ({
  orderId,
  productId,
  customerName,
  customerCity,
  onReviewSubmit,
}) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const cloudData = new FormData();
    cloudData.append("file", file);
    cloudData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: cloudData }
      );
      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "reviews"), {
        userId: currentUser.uid,
        orderId,
        productId,
        rating,
        description: desc,
        photoUrl: imageUrl || "",
        createdAt: serverTimestamp(),
        userName: currentUser.displayName || "Anonymous",
        customerName,
        customerCity,
      });
      toast.success("Thank you! Your review has been submitted.");
      setRating(0);
      setDesc("");
      setImageUrl("");
      onReviewSubmit?.();
    } catch (err) {
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-dark placeholder:text-neutral-mid focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-6 rounded-2xl border border-black/5 bg-cream/50"
    >
      <h3 className="font-heading text-lg font-semibold text-neutral-dark mb-4">
        Write a Review
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1.5">
              Name
            </label>
            <input
              type="text"
              className={inputClass}
              value={customerName || ""}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1.5">
              City
            </label>
            <input
              type="text"
              className={inputClass}
              value={customerCity || ""}
              disabled
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-1.5">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Star
                  size={24}
                  className={
                    star <= rating
                      ? "fill-secondary text-secondary"
                      : "text-neutral-mid/40"
                  }
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-1.5">
            Your Review
          </label>
          <textarea
            className={`${inputClass} min-h-[100px] resize-none`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Share your experience..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-1.5">
            Photo (optional)
          </label>
          {imageUrl ? (
            <div className="relative inline-block">
              <img
                src={imageUrl}
                alt="Preview"
                className="rounded-xl object-cover max-h-28 border border-black/10"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-error text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-full h-20 rounded-xl border-2 border-dashed border-black/15 bg-white hover:border-primary/40 cursor-pointer transition-colors">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading ? (
                <span className="text-sm text-neutral-mid">Uploading...</span>
              ) : (
                <>
                  <ImagePlus size={20} className="text-neutral-mid mr-2" />
                  <span className="text-sm text-neutral-mid">Add photo</span>
                </>
              )}
            </label>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-2.5 px-5 font-semibold hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          <Send size={16} />
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

const statusColors = {
  ordered: "bg-primary/10 text-primary",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-warning/20 text-warning",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-error/20 text-error",
};

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      const orderRef = collection(db, "orders", currentUser.uid, "orders");
      const snapshot = await getDocs(orderRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };
    fetchOrders();
  }, [currentUser]);

  const formatDate = (secs) => {
    if (!secs) return "—";
    return new Date(secs * 1000).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    const s = (status || "ordered").toLowerCase();
    return statusColors[s] || "bg-primary/10 text-primary";
  };

  return (
    <div className="min-h-screen bg-linen">
      <MobileBackHeader title="My Orders" to="/profile" />
      {/* Header */}
      <div className="bg-primary py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-medium !text-white">
            My Orders
          </h1>
          <p className="mt-2 text-white/80 text-sm md:text-base">
            Track your orders and view order history
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl border border-black/5 shadow-sm"
          >
            <Package size={48} className="mx-auto text-neutral-mid/50 mb-4" />
            <h2 className="font-heading text-xl font-semibold text-neutral-dark mb-2">
              No orders yet
            </h2>
            <p className="text-neutral-mid text-sm mb-6">
              Start shopping to see your orders here
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-6 py-3 font-semibold hover:bg-primary-dark transition-colors"
            >
              <Package size={18} />
              Browse Shop
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {orders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden"
                >
                  {/* Card header */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 border-b border-black/5 cursor-pointer"
                    onClick={() =>
                      setExpandedOrder(expandedOrder === order.id ? null : order.id)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Package size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-dark">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-neutral-mid flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(order.createdAt?.seconds)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Ordered"}
                      </span>
                      <span className="font-semibold text-neutral-dark">
                        ₹{order.total}
                      </span>
                      {expandedOrder === order.id ? (
                        <ChevronUp size={20} className="text-neutral-mid" />
                      ) : (
                        <ChevronDown size={20} className="text-neutral-mid" />
                      )}
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 md:p-6 space-y-6">
                          {/* Payment */}
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard size={16} className="text-neutral-mid shrink-0" />
                            <span className="text-neutral-mid">Payment:</span>
                            <span className="font-medium text-neutral-dark">
                              {order.paymentMethod === "Razorpay-Link"
                                ? "Razorpay (Payment Link)"
                                : order.paymentMethod || "—"}
                            </span>
                          </div>

                          {/* Custom details if any */}
                          {order.items?.some((i) => i.customDetails) && (
                            <div className="text-sm">
                              <span className="text-neutral-mid">Additional Details: </span>
                              {order.items
                                .filter((i) => i.customDetails)
                                .map((item, i) => (
                                  <span key={i} className="text-neutral-dark">
                                    {item.customDetails}
                                  </span>
                                ))}
                            </div>
                          )}

                          {/* Shipping Address */}
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                              <MapPin size={16} className="text-primary" />
                              Shipping Address
                            </h4>
                            <div className="text-sm text-neutral-dark bg-cream/50 rounded-xl p-4 space-y-1">
                              <p className="font-medium">
                                {order.shippingInfo?.fullName || "N/A"}
                              </p>
                              <p>{order.shippingInfo?.email || "N/A"}</p>
                              <p>{order.shippingInfo?.phone || "N/A"}</p>
                              <p>
                                {order.shippingInfo?.address
                                  ? `${order.shippingInfo.address}, ${order.shippingInfo.city} - ${order.shippingInfo.pincode}`
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Tracking */}
                          {(order.trackingLink || order.trackingMessage) && (
                            <div>
                              <h4 className="text-sm font-semibold text-neutral-dark mb-2 flex items-center gap-2">
                                <Truck size={16} className="text-primary" />
                                Tracking
                              </h4>
                              <div className="text-sm space-y-1">
                                {order.trackingMessage && (
                                  <p className="text-neutral-dark">
                                    {order.trackingMessage}
                                  </p>
                                )}
                                {order.trackingLink && (
                                  <a
                                    href={
                                      order.trackingLink.startsWith("http")
                                        ? order.trackingLink
                                        : `https://${order.trackingLink}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
                                  >
                                    <ExternalLink size={14} />
                                    Track Order
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Items */}
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-dark mb-3">
                              Items
                            </h4>
                            <ul className="space-y-2">
                              {order.items?.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex justify-between items-center py-3 border-b border-black/5 last:border-0"
                                >
                                  <div>
                                    <span className="font-medium text-neutral-dark">
                                      {item.name}
                                    </span>
                                    <span className="text-neutral-mid text-sm block">
                                      Qty: {item.quantity}
                                    </span>
                                  </div>
                                  <span className="font-semibold text-neutral-dark">
                                    ₹{item.price}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Review (delivered only) */}
                          {order.status === "delivered" && (
                            <ReviewForm
                              orderId={order.id}
                              productId={order.items?.[0]?.id}
                              customerName={order.shippingInfo?.fullName}
                              customerCity={order.shippingInfo?.city}
                              onReviewSubmit={() => {}}
                            />
                          )}

                          {/* Download Receipt */}
                          <div className="pt-2">
                            <ReceiptInvoice order={order} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
